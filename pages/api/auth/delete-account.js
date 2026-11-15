import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import Progress from '../../../models/Progress';
import { withAuth } from '../../../lib/auth';

/**
 * Account Deletion API Endpoint (Protected)
 * Deletes user profile and progress records from MongoDB.
 */
async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use DELETE to remove account.'
    });
  }

  try {
    await dbConnect();
    const { firebaseUid } = req.user;
    const dbUserId = req.dbUser?._id;

    // Delete associated progress records
    const progressConditions = [{ firebaseUid }];
    if (dbUserId) {
      progressConditions.push({ userId: dbUserId });
    }
    await Progress.deleteMany({ $or: progressConditions });

    // Delete user record
    await User.deleteOne({
      $or: [
        { firebaseUid },
        ...(dbUserId ? [{ _id: dbUserId }] : [])
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Account and associated learning progress deleted successfully.'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account. Please try again later.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: false });
