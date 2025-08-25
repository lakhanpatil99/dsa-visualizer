import jwt from 'jsonwebtoken';

/**
 * Verify JWT token from request headers
 * @param {Object} req - Next.js request object
 * @returns {Object} Decoded token payload
 */
export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}

/**
 * Middleware function to protect API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} Protected handler function
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      // Verify token before calling the handler
      const decoded = verifyToken(req);
      req.user = decoded; // Attach user data to request
      return handler(req, res);
    } catch (error) {
      if (error.message === 'No token provided' || 
          error.message === 'Invalid token' || 
          error.message === 'Token expired') {
        return res.status(401).json({ 
          message: 'Authentication required',
          error: error.message
        });
      }
      
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
  };
}
