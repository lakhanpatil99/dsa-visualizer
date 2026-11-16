import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) {
      isConnected = true;
    }
  } catch (err) {
    console.warn('MongoDB connection check failed, using memory store fallback:', err.message);
  }

  let applications = [];
  if (isConnected) {
    applications = await InternshipApplication.find({ firebaseUid: user.uid }).sort({ createdAt: -1 });
  } else {
    applications = memoryStore.getApplicationsByUser(user.uid);
  }

  return res.status(200).json({
    success: true,
    applications
  });
}

export default withAuth(handler, { requireEmailVerified: true });
