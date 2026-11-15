import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { withAuth } from '../../../lib/auth';

/**
 * Idempotent User Profile Synchronization Endpoint
 * Synchronizes Firebase identity with MongoDB profile, safely reconciling legacy accounts.
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to synchronize profile.'
    });
  }

  try {
    await dbConnect();

    const { firebaseUid, email, name, emailVerified, provider } = req.user;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Missing authenticated identity'
      });
    }

    // 1. Check if user already exists with this firebaseUid
    let user = await User.findOne({ firebaseUid });

    if (!user && normalizedEmail) {
      // 2. Legacy Account Reconciliation: check if user exists with matching email
      // SECURITY REQUIREMENT: Require authoritative verified identity before linking
      // an existing legacy record by email. Unverified accounts cannot claim existing profiles.
      if (emailVerified === true) {
        user = await User.findOne({ email: normalizedEmail });

        if (user) {
          // Link legacy account to Firebase identity
          user.firebaseUid = firebaseUid;
          if (!user.displayName && name) user.displayName = name;
          user.emailVerified = true;
          user.providerId = provider || 'password';
          user.lastLoginAt = new Date();
          user.updatedAt = new Date();
          await user.save();

          return res.status(200).json({
            success: true,
            message: 'Legacy account successfully linked',
            migrated: true,
            user: user.toJSON()
          });
        }
      }
    }

    if (user) {
      // Update existing record
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      user.emailVerified = !!emailVerified;
      if (name && !user.displayName) user.displayName = name;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile synchronized successfully',
        user: user.toJSON()
      });
    }

    // 3. Brand New User: Create new record
    const baseUsername = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) : (normalizedEmail.split('@')[0] || 'user');
    const uniqueSuffix = firebaseUid.slice(-4);
    const generatedUsername = `${baseUsername}_${uniqueSuffix}`.slice(0, 30);

    const newUser = new User({
      firebaseUid,
      email: normalizedEmail,
      displayName: name || normalizedEmail.split('@')[0],
      username: generatedUsername.length >= 3 ? generatedUsername : `user_${uniqueSuffix}`,
      emailVerified: !!emailVerified,
      providerId: provider || 'password',
      accountStatus: 'active',
      onboardingStatus: 'completed',
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'New user profile created',
      user: newUser.toJSON()
    });

  } catch (error) {
    console.error('Error synchronizing user profile:', error);

    // Handle potential duplicate key race condition safely
    if (error.code === 11000) {
      try {
        const existing = await User.findOne({ firebaseUid: req.user.firebaseUid });
        if (existing) {
          return res.status(200).json({
            success: true,
            message: 'Profile synchronized',
            user: existing.toJSON()
          });
        }
      } catch (e) {
        // Fall through
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to synchronize user profile. Please try again later.'
    });
  }
}

// Allow sync even if email is not yet verified so registration records can be created
export default withAuth(handler, { requireEmailVerified: false });
