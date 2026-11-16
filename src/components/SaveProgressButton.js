import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../../context/ThemeContext';
import ProtectedFeature from './ProtectedFeature';

const SaveProgressButton = ({ 
  algorithmType, 
  algorithmName, 
  currentState, 
  stepsCompleted = 0, 
  totalSteps = 0, 
  timeSpent = 0,
  lastStep = '',
  notes = ''
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [savedProgress, setSavedProgress] = useState(null);
  const { progressService, isAuthenticated } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (isAuthenticated && progressService && algorithmType && algorithmName) {
      loadProgress();
    }
  }, [isAuthenticated, progressService, algorithmType, algorithmName]);

  const loadProgress = async () => {
    try {
      const result = await progressService.fetchProgress(algorithmType, algorithmName);
      if (result.progress && result.progress.length > 0) {
        setSavedProgress(result.progress[0]);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleSaveProgress = async () => {
    if (!progressService) return;
    
    setIsSaving(true);
    setMessage('');
    
    try {
      const progressData = {
        algorithmType,
        algorithmName,
        progressData: currentState || {},
        stepsCompleted,
        totalSteps,
        timeSpent,
        lastStep,
        notes,
        completionStatus: stepsCompleted >= totalSteps ? 'completed' : 'in_progress'
      };

      const result = await progressService.saveProgress(progressData);
      setSavedProgress(result.progress);
      setMessage('Progress saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to save progress: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const saveButton = (
    <button
      onClick={handleSaveProgress}
      disabled={isSaving}
      className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-xs ${
        isSaving
          ? 'bg-[#E8E4DA] text-[#A09D95] cursor-not-allowed'
          : 'bg-[#28533D] hover:bg-[#1E3E2E] text-[#FFFDF8] hover:shadow'
      }`}
    >
      {isSaving ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>{savedProgress ? 'Update Cloud Progress' : 'Save Cloud Progress'}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="space-y-2.5">
      <ProtectedFeature>
        {saveButton}
      </ProtectedFeature>
      
      {message && (
        <div className={`text-xs p-2.5 rounded-lg border font-mono ${
          message.includes('successfully') 
            ? 'bg-[#E4E9DD] text-[#28533D] border-[#28533D]/30' 
            : 'bg-[#FDEDEA] text-[#C93B14] border-[#EF592A]/30'
        }`}>
          {message}
        </div>
      )}
      
      {savedProgress && (
        <div className={`text-[11px] font-mono p-3 rounded-xl border space-y-1 ${
          isDarkMode ? 'bg-[#1F1E1B] border-[#383630] text-[#DED9CE]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
        }`}>
          <div className="font-bold text-[#EF592A]">
            Last saved: {new Date(savedProgress.updatedAt).toLocaleDateString()}
          </div>
          <div>Status: {savedProgress.completionStatus?.replace('_', ' ')}</div>
          {savedProgress.stepsCompleted > 0 && (
            <div>Progress: {savedProgress.stepsCompleted}/{savedProgress.totalSteps} steps</div>
          )}
          {savedProgress.timeSpent > 0 && (
            <div>Time spent: {Math.floor(savedProgress.timeSpent / 60)}m {savedProgress.timeSpent % 60}s</div>
          )}
        </div>
      )}
      
      <div className="text-[11px] font-mono text-[#69665F] dark:text-[#A09D95]">
        Cloud sync keeps your completed algorithms across devices
      </div>
    </div>
  );
};

export default SaveProgressButton;
