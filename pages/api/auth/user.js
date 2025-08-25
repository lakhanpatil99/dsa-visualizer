import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use GET to fetch user data.' 
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required. Please log in again.' 
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required. Please log in again.' 
      });
    }

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Access token expired. Please log in again.' 
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid access token. Please log in again.' 
        });
      } else {
        return res.status(401).json({ 
          success: false,
          message: 'Token verification failed. Please log in again.' 
        });
      }
    }

    // Connect to database
    await dbConnect();

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found. Please log in again.' 
      });
    }

    // Return user data
    return res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      user: user.toJSON()
    });

  } catch (error) {
    // Log error for debugging (but don't expose it to client)
    console.error('User API error:', error);

    // Handle database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        success: false,
        message: 'Service temporarily unavailable. Please try again later.' 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: `Validation error: ${validationErrors.join(', ')}` 
      });
    }

    // Generic error message for unexpected errors
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve user data. Please try again later.' 
    });
  }
}
