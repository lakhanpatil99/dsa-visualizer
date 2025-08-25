import dbConnect from '../../../lib/dbConnect';
import { withAuth } from '../../../lib/auth';
import Progress from '../../../models/Progress';

async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId } = req.user; // From JWT token via withAuth middleware
    
    if (req.method === 'POST') {
      // Save progress
      const { algorithmType, algorithmName, progressData, completionStatus } = req.body;
      
      if (!algorithmType || !algorithmName) {
        return res.status(400).json({ 
          message: 'Algorithm type and name are required' 
        });
      }

      // Create or update progress record
      const progressRecord = {
        userId,
        algorithmType,
        algorithmName,
        progressData: progressData || {},
        completionStatus: completionStatus || 'in_progress',
        stepsCompleted: req.body.stepsCompleted || 0,
        totalSteps: req.body.totalSteps || 0,
        timeSpent: req.body.timeSpent || 0,
        lastStep: req.body.lastStep || '',
        notes: req.body.notes || ''
      };

      // Use findOneAndUpdate with upsert for better handling
      const result = await Progress.findOneAndUpdate(
        { 
          userId, 
          algorithmType, 
          algorithmName 
        },
        progressRecord,
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        message: 'Progress saved successfully',
        progressId: result._id,
        progress: result
      });

    } else if (req.method === 'GET') {
      // Fetch progress
      const { algorithmType, algorithmName } = req.query;
      
      let query = { userId };
      
      // If specific algorithm is requested, filter by it
      if (algorithmType && algorithmName) {
        query.algorithmType = algorithmType;
        query.algorithmName = algorithmName;
      }
      
      const progressRecords = await Progress
        .find(query)
        .sort({ updatedAt: -1 })
        .lean();

      res.status(200).json({
        message: 'Progress fetched successfully',
        progress: progressRecords
      });
    }

  } catch (error) {
    console.error('Progress API error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
}

export default withAuth(handler);
