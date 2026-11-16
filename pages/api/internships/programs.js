import { DEFAULT_INTERNSHIP_PROGRAMS } from '../../../lib/internships/internshipData.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    return res.status(200).json({
      success: true,
      programs: DEFAULT_INTERNSHIP_PROGRAMS
    });
  } catch (err) {
    console.error('Error fetching internship programs:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
