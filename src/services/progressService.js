class ProgressService {
  constructor(token) {
    this.token = token;
    this.baseURL = '/api/auth/progress';
  }

  // Save progress for a specific algorithm
  async saveProgress(progressData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }

  // Fetch progress for a specific algorithm or all progress
  async fetchProgress(algorithmType = null, algorithmName = null) {
    try {
      let url = this.baseURL;
      const params = new URLSearchParams();
      
      if (algorithmType) params.append('algorithmType', algorithmType);
      if (algorithmName) params.append('algorithmName', algorithmName);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  // Get progress summary for dashboard
  async getProgressSummary() {
    try {
      const allProgress = await this.fetchProgress();
      const summary = {
        totalAlgorithms: allProgress.progress.length,
        completed: allProgress.progress.filter(p => p.completionStatus === 'completed').length,
        inProgress: allProgress.progress.filter(p => p.completionStatus === 'in_progress').length,
        mastered: allProgress.progress.filter(p => p.completionStatus === 'mastered').length,
        totalTimeSpent: allProgress.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
      };
      
      return summary;
    } catch (error) {
      console.error('Error getting progress summary:', error);
      throw error;
    }
  }

  // Update completion status
  async updateCompletionStatus(algorithmType, algorithmName, status) {
    try {
      const currentProgress = await this.fetchProgress(algorithmType, algorithmName);
      let progressData = {};
      
      if (currentProgress.progress && currentProgress.progress.length > 0) {
        progressData = currentProgress.progress[0];
      }
      
      progressData.completionStatus = status;
      progressData.algorithmType = algorithmType;
      progressData.algorithmName = algorithmName;
      
      return await this.saveProgress(progressData);
    } catch (error) {
      console.error('Error updating completion status:', error);
      throw error;
    }
  }
}

export default ProgressService;
