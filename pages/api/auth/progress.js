import dbConnect from '../../../lib/dbConnect';
import { withAuth } from '../../../lib/auth';
import Progress from '../../../models/Progress';

/**
 * Progress Management API (Protected)
 * Requires authenticated session and email verification.
 */
async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Supported methods: GET, POST.'
    });
  }

  try {
    await dbConnect();
    const { firebaseUid } = req.user;
    const dbUserId = req.dbUser?._id;

    if (req.method === 'POST') {
      const { 
        algorithmType, 
        algorithmName, 
        progressData, 
        completionStatus,
        stepsCompleted,
        totalSteps,
        timeSpent,
        lastStep,
        notes 
      } = req.body;

      if (!algorithmType || !algorithmName) {
        return res.status(400).json({
          success: false,
          message: 'Algorithm type and name are required'
        });
      }

      const validTypes = ['sorting', 'data-structures', 'trees', 'graphs'];
      if (!validTypes.includes(algorithmType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid algorithm type. Allowed: ${validTypes.join(', ')}`
        });
      }

      const progressRecord = {
        firebaseUid,
        ...(dbUserId ? { userId: dbUserId } : {}),
        algorithmType,
        algorithmName,
        progressData: progressData || {},
        completionStatus: completionStatus || 'in_progress',
        stepsCompleted: Number(stepsCompleted) || 0,
        totalSteps: Number(totalSteps) || 0,
        timeSpent: Number(timeSpent) || 0,
        lastStep: String(lastStep || ''),
        notes: String(notes || '')
      };

      // Perform atomic upsert matching on firebaseUid and algorithm
      const result = await Progress.findOneAndUpdate(
        {
          $or: [
            { firebaseUid, algorithmType, algorithmName },
            ...(dbUserId ? [{ userId: dbUserId, algorithmType, algorithmName }] : [])
          ]
        },
        progressRecord,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Progress saved successfully',
        progressId: result._id,
        progress: result.toJSON()
      });

    } else if (req.method === 'GET') {
      const { algorithmType, algorithmName } = req.query;

      const userMatchConditions = [{ firebaseUid }];
      if (dbUserId) {
        userMatchConditions.push({ userId: dbUserId });
      }

      const query = {
        $or: userMatchConditions
      };

      if (algorithmType) {
        query.algorithmType = String(algorithmType);
      }
      if (algorithmName) {
        query.algorithmName = String(algorithmName);
      }

      const progressRecords = await Progress.find(query)
        .sort({ updatedAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        message: 'Progress fetched successfully',
        progress: progressRecords
      });
    }

  } catch (error) {
    console.error('Progress API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing progress data.'
    });
  }
}

// Enforce email verification for saving/fetching progress
export default withAuth(handler, { requireEmailVerified: true });
