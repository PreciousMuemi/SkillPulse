import React, { useState, useEffect } from 'react';
import { Upload, XCircle, CheckCircle, Star, TrendingUp } from 'lucide-react';

const ContentUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [skillLevelDetails, setSkillLevelDetails] = useState({
    level: 'Beginner',
    subLevel: 1,
    points: 0,
    nextLevelPoints: 100
  });
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState({ views: 0, likes: 0, comments: 0 });

  const isVideoFile = (file) => {
    return file && file.type.startsWith('video/');
  };

  const validateContentPosting = async () => {
    try {
      const result = await skillNetContract.validateContentPosting({
        level: skillLevelDetails.level,
        subLevel: skillLevelDetails.subLevel
      });

      if (!result.canPost) {
        throw new Error('Not eligible to post content at this level');
      }

      return true;
    } catch (error) {
      setUploadStatus('error');
      return false;
    }
  };

  const fetchRecommendedContent = async () => {
    try {
      const recommendations = await skillNetContract.getRecommendedContent({
        currentLevel: skillLevelDetails.level,
        currentSubLevel: skillLevelDetails.subLevel
      });

      setRecommendedContent(recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const updateSkillProgress = (uploadedContent) => {
    const pointsEarned = calculateSkillPoints(uploadedContent);
    
    const newPoints = skillLevelDetails.points + pointsEarned;
    const newSubLevel = calculateSubLevel(newPoints);
    const newLevel = calculateLevel(newPoints);

    setSkillLevelDetails(prev => ({
      ...prev,
      points: newPoints,
      subLevel: newSubLevel,
      level: newLevel,
      nextLevelPoints: calculateNextLevelPoints(newLevel)
    }));

    fetchRecommendedContent();
    distributePaymentBasedOnEngagement(uploadedContent.id);
  };

  const calculateSkillPoints = (content) => {
    return Math.floor((engagementMetrics.views + engagementMetrics.likes * 2 + engagementMetrics.comments * 3) / content.length); 
  };

  const distributePaymentBasedOnEngagement = async (contentId) => {
    const totalEngagement = engagementMetrics.views + engagementMetrics.likes + engagementMetrics.comments;
    
    if (totalEngagement > 0) { 
        const paymentAmount = totalEngagement * TOKEN_VALUE; 
        
        await skillNetContract.distributeTokens(contentId, paymentAmount); 
        console.log(`Distributed ${paymentAmount} tokens for content ID ${contentId}`);
    }
  };

  const calculateSubLevel = (totalPoints) => {
    return Math.min(5, Math.floor(totalPoints / 20) + 1);
  };

  const calculateLevel = (totalPoints) => {
    if (totalPoints < 100) return 'Beginner';
    if (totalPoints < 300) return 'Intermediate';
    return 'Advanced';
  };

  const calculateNextLevelPoints = (level) => {
    switch (level) {
        case 'Beginner': return 100;
        case 'Intermediate': return 300;
        case 'Advanced': return 500;
        default: return 100;
    }
  };

  const handleFileUpload = async () => {
    if (!file || !isVideoFile(file)) {
      alert('Please upload a valid video file.');
      return;
    }

    setUploadStatus('uploading');

    try {
      const isEligible = await validateContentPosting();

      if (!isEligible) {
        throw new Error('Posting not allowed');
      }

      const editedVideoFile = await editVideo(file);
      const uploadResult = await uploadToIPFS(editedVideoFile, {
        skillLevel : skillLevelDetails.level,
        subLevel: skillLevelDetails.subLevel
      });

      updateSkillProgress(uploadResult);
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div>
      <h1>Upload Your Content</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadStatus === 'uploading' && <p>Uploading...</p>}
      {uploadStatus === 'success' && <p>Upload successful!</p>}
      {uploadStatus === 'error' && <p>Upload failed. Please try again.</p>}
    </div>
  );
};

export default ContentUploadComponent;