import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { withAuth } from '../../../lib/auth';

/**
 * Returns current authenticated user profile
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use GET to fetch user data.'
    });
  }

  try {
    await dbConnect();
    const { firebaseUid, email } = req.user;

    let user = await User.findOne({ firebaseUid });

    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!user) {
      // User is authenticated in Firebase but hasn't synced with MongoDB yet
      return res.status(200).json({
        success: true,
        message: 'Firebase identity verified',
        user: {
          firebaseUid,
          email,
          displayName: req.user.name || email.split('@')[0],
          emailVerified: req.user.emailVerified
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: false });
