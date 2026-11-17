import crypto from 'crypto';
import Certificate from '../../models/Certificate.js';

const COMPETITION_MILESTONES = [
  {
    tier: 'bronze',
    type: 'competition_bronze',
    target: 20,
    idPrefix: 'ALG-CMP-BR',
    title: 'Competition Achievement — Bronze Tier'
  },
  {
    tier: 'silver',
    type: 'competition_silver',
    target: 100,
    idPrefix: 'ALG-CMP-SL',
    title: 'Competition Achievement — Silver Tier'
  },
  {
    tier: 'gold',
    type: 'competition_gold',
    target: 200,
    idPrefix: 'ALG-CMP-AU',
    title: 'Competition Achievement — Gold Tier'
  }
];

/**
 * Internal server-side issuance only. Callers must supply a count computed
 * from persisted, unique ACCEPTED submissions after verifying the user.
 * The public certificate endpoints remain read-only; no issuance endpoint
 * is exposed to visitors.
 */
export async function ensureCompetitionMilestoneCertificates({
  firebaseUid,
  userEmail,
  recipientName,
  uniqueSolvedCount
}) {
  if (!firebaseUid || !userEmail || !Number.isFinite(uniqueSolvedCount)) {
    throw new Error('Verified competition identity and progress are required.');
  }

  await Certificate.collection.createIndex(
    { sourceKey: 1 },
    { unique: true, sparse: true, name: 'certificate_sourceKey_unique' }
  );

  const safeRecipient = (typeof recipientName === 'string' && recipientName.trim())
    ? recipientName.trim().slice(0, 120)
    : 'AlgoMania Learner';
  const year = new Date().getUTCFullYear();
  const issued = [];

  for (const milestone of COMPETITION_MILESTONES) {
    if (uniqueSolvedCount < milestone.target) continue;

    const sourceKey = `competition:${firebaseUid}:${milestone.type}`;
    let existing = await Certificate.findOne({ sourceKey });

    // Backward compatibility: never reissue a credential created by the older
    // admin flow, which did not persist sourceKey.
    if (!existing) {
      existing = await Certificate.findOne({
        firebaseUid,
        type: milestone.type
      });
      if (existing && !existing.sourceKey) {
        try {
          await Certificate.updateOne(
            { _id: existing._id, $or: [{ sourceKey: { $exists: false } }, { sourceKey: null }] },
            { $set: { sourceKey } }
          );
        } catch (error) {
          if (error?.code !== 11000) throw error;
        }
      }
    }

    if (existing) {
      issued.push(existing);
      continue;
    }

    let saved = null;
    for (let attempt = 0; attempt < 3 && !saved; attempt += 1) {
      const certificateId = `${milestone.idPrefix}-${year}-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
      const verificationUrl = `https://www.algomania.in/certificates/verify/${certificateId}`;
      const certificate = {
        certificateId,
        sourceKey,
        firebaseUid,
        userEmail: userEmail.toLowerCase().trim(),
        recipientName: safeRecipient,
        type: milestone.type,
        title: milestone.title,
        description: `Official AlgoMania ${milestone.tier} competition credential issued after verification of ${uniqueSolvedCount} unique accepted challenge solutions.`,
        domain: null,
        tier: milestone.tier,
        milestoneCount: uniqueSolvedCount,
        duration: null,
        startDate: null,
        endDate: null,
        issueDate: new Date(),
        status: 'VALID',
        founderName: 'Lakhansing Patil',
        founderTitle: 'Founder, AlgoMania',
        verificationUrl,
        metadata: {
          issuedAutomatically: true,
          issuanceSource: 'UNIQUE_ACCEPTED_SUBMISSIONS',
          verifiedAcceptedCount: uniqueSolvedCount
        }
      };

      try {
        saved = await Certificate.create(certificate);
      } catch (error) {
        if (error?.code !== 11000) throw error;

        // Parallel submissions or a legacy migration may have won the unique
        // source-key race. Reuse that one authoritative credential.
        saved = await Certificate.findOne({ sourceKey }) ||
          await Certificate.findOne({ firebaseUid, type: milestone.type });
        if (!saved && attempt === 2) throw error;
      }
    }

    if (saved) issued.push(saved);
  }

  return issued;
}
