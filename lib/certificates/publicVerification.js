import dbConnect from '../dbConnect.js';
import Certificate from '../../models/Certificate.js';

const PUBLIC_CERTIFICATE_FIELDS = [
  'certificateId',
  'recipientName',
  'type',
  'title',
  'description',
  'domain',
  'tier',
  'milestoneCount',
  'duration',
  'startDate',
  'endDate',
  'issueDate',
  'status',
  'revokedReason',
  'revokedAt',
  'founderName',
  'founderTitle'
].join(' ');

/**
 * Normalize public credential references without assuming a particular
 * historical prefix. Existing IDs remain resolvable.
 */
export function normalizeCertificateId(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  if (normalized.length < 3 || normalized.length > 96) return null;
  if (!/^[A-Z0-9][A-Z0-9-]*$/.test(normalized)) return null;
  return normalized;
}

function safeText(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * MongoDB is the sole authority for public credential verification.
 * A connection/query failure is intentionally thrown so callers can return
 * an unavailable response instead of incorrectly declaring a credential invalid.
 */
export async function getPublicCertificateById(rawId) {
  const certificateId = normalizeCertificateId(rawId);
  if (!certificateId) {
    return { status: 'INVALID_ID', certificate: null };
  }

  const connection = await dbConnect();
  if (!connection || connection.connection?.readyState !== 1) {
    throw new Error('Certificate registry database is unavailable.');
  }

  const record = await Certificate.findOne({ certificateId })
    .select(PUBLIC_CERTIFICATE_FIELDS)
    .lean();

  if (!record) {
    return { status: 'NOT_FOUND', certificate: null };
  }

  const status = record.status === 'REVOKED' ? 'REVOKED' : 'VALID';
  const certificate = {
    certificateId: safeText(record.certificateId, 96),
    recipientName: safeText(record.recipientName, 160),
    type: safeText(record.type, 48),
    title: safeText(record.title, 240),
    description: safeText(record.description, 700),
    domain: safeText(record.domain, 120) || null,
    tier: safeText(record.tier, 32) || null,
    milestoneCount: Number.isFinite(record.milestoneCount) ? record.milestoneCount : null,
    duration: safeText(record.duration, 80) || null,
    startDate: safeDate(record.startDate),
    endDate: safeDate(record.endDate),
    issueDate: safeDate(record.issueDate),
    status,
    revokedReason: status === 'REVOKED' ? safeText(record.revokedReason, 300) : null,
    revokedAt: status === 'REVOKED' ? safeDate(record.revokedAt) : null,
    founderName: safeText(record.founderName || 'Lakhansing Patil', 120),
    founderTitle: safeText(record.founderTitle || 'Founder, AlgoMania', 120)
  };

  return { status, certificate };
}
