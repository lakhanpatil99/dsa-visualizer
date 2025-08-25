import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST for login.' 
    });
  }

  try {
    // Connect to database
    await dbConnect();

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.' 
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username, 
        email: user.email 
      },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token and user data
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    // Log error for debugging (but don't expose it to client)
    console.error('Login error:', error);

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
      message: 'Login failed. Please try again later.' 
    });
  }
}
