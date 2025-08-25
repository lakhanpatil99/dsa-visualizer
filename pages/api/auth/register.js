import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST for registration.' 
    });
  }

  try {
    // Connect to database
    await dbConnect();

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, email, and password are required' 
      });
    }

    // Validate field lengths
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ 
        success: false,
        message: 'Username must be between 3 and 30 characters' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
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

    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() }, 
        { username: username.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase().trim()) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already registered. Please use a different email or try logging in.' 
        });
      } else {
        return res.status(400).json({ 
          success: false,
          message: 'Username is already taken. Please choose a different username.' 
        });
      }
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        username: newUser.username, 
        email: newUser.email 
      },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response with token and user data
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: newUser.toJSON()
    });

  } catch (error) {
    // Log error for debugging (but don't expose it to client)
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error.code === 11000) {
      // Duplicate key error
      if (error.keyPattern?.email) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already registered. Please use a different email or try logging in.' 
        });
      }
      if (error.keyPattern?.username) {
        return res.status(400).json({ 
          success: false,
          message: 'Username is already taken. Please choose a different username.' 
        });
      }
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
      message: 'Registration failed. Please try again later.' 
    });
  }
}
