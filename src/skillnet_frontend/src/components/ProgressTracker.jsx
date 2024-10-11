import React, { useState, useEffect } from 'react';
import { getUserProgress } from '../services/api';
import { useAuth } from './AuthContext';

function ProgressTracker({ courseId }) {
  const [progress, setProgress] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchProgress() {
      if (isAuthenticated) {
        const userProgress = await getUserProgress(courseId);
        setProgress(userProgress);
      }
    }
    fetchProgress();
  }, [isAuthenticated, courseId]);

  return (
    <div className="progress-tracker">
      <h3>Your Progress</h3>
      <p>Completed Modules: {progress.completedModules.length}</p>
      <h4>Quiz Scores</h4>
      <ul>
        {progress.quizScores.map(([moduleId, score]) => (
          <li key={moduleId}>Module {moduleId}: {score}%</li>
        ))}
      </ul>
    </div>
  );
}

export default ProgressTracker;