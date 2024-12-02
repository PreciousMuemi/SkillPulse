import React, { useState, useEffect } from 'react';

// Qualification Criteria with more detailed assessment
const QUALIFICATION_CRITERIA = {
  nextGenMentors: {
    minAge: 16,
    maxAge: 35,
    minAdvancedCourses: 2,
    minCommunityEngagement: 75,
    requiredBadges: ['skill-mastery', 'community-impact'],
    maxApplicationTime: 15 * 60 * 1000 // 15 minutes
  },
  professionalMentors: {
    minWorkExperience: 3,
    requiredCertifications: 1,
    professionalRecommendations: 2
  }
};

const MentorQualificationSystem = () => {
  const [stage, setStage] = useState('initial-screening');
  const [mentorType, setMentorType] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState({
    mentorType: null,
    personalDetails: {
      name: '',
      age: '',
      skills: [],
      completedCourses: [],
      badges: []
    },
    assessmentResult: null
  });

  // Comprehensive Skill Pulse Assessment
  const conductSkillPulseAssessment = (profile) => {
    if (profile.mentorType === 'next-gen') {
      const age = parseInt(profile.personalDetails.age);
      
      const isAgeValid = 
        age >= QUALIFICATION_CRITERIA.nextGenMentors.minAge && 
        age <= QUALIFICATION_CRITERIA.nextGenMentors.maxAge;

      const advancedCoursesCompleted = 
        profile.personalDetails.completedCourses?.filter(course => course.level === 'advanced').length || 0;
      
      const communityEngagementScore = 
        profile.personalDetails.communityPoints || 0;
      
      const hasRequiredBadges = 
        QUALIFICATION_CRITERIA.nextGenMentors.requiredBadges.every(
          badge => profile.personalDetails.badges.includes(badge)
        );

      const assessmentDetails = {
        qualified: 
          isAgeValid &&
          advancedCoursesCompleted >= QUALIFICATION_CRITERIA.nextGenMentors.minAdvancedCourses &&
          communityEngagementScore >= QUALIFICATION_CRITERIA.nextGenMentors.minCommunityEngagement &&
          hasRequiredBadges,
        details: {
          ageValidation: {
            status: isAgeValid, 
            message: isAgeValid 
              ? 'Age requirement met' 
              : 'Age must be between 16 and 35'
          },
          advancedCourses: {
            count: advancedCoursesCompleted,
            status: advancedCoursesCompleted >= QUALIFICATION_CRITERIA.nextGenMentors.minAdvancedCourses,
            message: advancedCoursesCompleted >= QUALIFICATION_CRITERIA.nextGenMentors.minAdvancedCourses
              ? 'Sufficient advanced courses completed'
              : 'Need more advanced courses'
          },
          communityEngagement: {
            score: communityEngagementScore,
            status: communityEngagementScore >= QUALIFICATION_CRITERIA.nextGenMentors.minCommunityEngagement,
            message: communityEngagementScore >= QUALIFICATION_CRITERIA.nextGenMentors.minCommunityEngagement
              ? 'Strong community engagement'
              : 'Community engagement needs improvement'
          },
          badges: {
            status: hasRequiredBadges,
            message: hasRequiredBadges
              ? 'All required badges obtained'
              : 'Missing required badges'
          }
        }
      };

      return assessmentDetails;
    }

    // Professional mentor logic can be added here
    return { qualified: true, details: {} };
  };

  // Render different stages of mentor application
  const renderScreeningStages = () => {
    switch(stage) {
      case 'initial-screening':
        return (
          <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Mentor Qualification Pathway
            </h2>
            
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Select Mentor Type
                </label>
                <select 
                  value={mentorType || ''}
                  onChange={(e) => setMentorType(e.target.value)}
                  className="w-full p-3 border rounded"
                >
                  <option value="">Select Mentor Type</option>
                  <option value="next-gen">Next Generation Learner-Mentor</option>
                  <option value="professional">Professional Mentor</option>
                </select>
              </div>
              
              {mentorType && (
                <button 
                  onClick={() => {
                    setStartTime(Date.now());
                    setStage('detailed-application');
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Begin Application
                </button>
              )}
            </div>
          </div>
        );
      
      case 'detailed-application':
        return (
          <DetailedMentorApplication 
            mentorType={mentorType}
            onSubmit={(profileData) => {
              // Check application time
              const currentTime = Date.now();
              const applicationDuration = currentTime - startTime;
              
              if (applicationDuration > QUALIFICATION_CRITERIA.nextGenMentors.maxApplicationTime) {
                alert('Application time exceeded. Please restart.');
                setStage('initial-screening');
                return;
              }

              const assessmentResult = conductSkillPulseAssessment({
                ...profileData,
                mentorType
              });
              
              setCandidateProfile(prev => ({
                ...prev,
                ...profileData,
                mentorType,
                assessmentResult
              }));
              
              setStage('verification');
            }} 
          />
        );
      
      case 'verification':
        const isQualified = candidateProfile.assessmentResult?.qualified;
        const assessmentDetails = candidateProfile.assessmentResult?.details;
        
        return (
          <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${
              isQualified ? 'text-green-600' : 'text-red-600'
            }`}>
              {isQualified 
                ? 'Mentor Pathway Confirmed' 
                : 'Application Under Review'}
            </h2>
            
            {isQualified ? (
              <div>
                <p className="text-green-700 mb-4">
                  Congratulations! You've qualified as a {mentorType === 'next-gen' ? 'Next Gen Mentor' : 'Professional Mentor'}
                </p>
                <button 
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
                  onClick={() => setStage('mentor-onboarding')}
                >
                  Continue to Onboarding
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-red-700 mb-4">
                  Areas Needing Improvement
                </h3>
                <div className="space-y-2 text-left">
                  {Object.entries(assessmentDetails || {}).map(([key, detail]) => (
                    !detail.status && (
                      <div key={key} className="bg-red-50 p-3 rounded">
                        <p className="text-red-700 font-medium">{detail.message}</p>
                      </div>
                    )
                  ))}
                </div>
                <button 
                  className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
                  onClick={() => setStage('initial-screening')}
                >
                  Revise Application
                </button>
              </div>
            )}
          </div>
        );
      
      case 'mentor-onboarding':
        return <MentorOnboardingGuide mentorType={mentorType} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {renderScreeningStages()}
    </div>
  );
};

// Detailed Mentor Application Component
const DetailedMentorApplication = ({ mentorType, onSubmit }) => {
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      age: '',
      skills: [],
      completedCourses: [],
      badges: [],
      communityPoints: 0
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-lg p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {mentorType === 'next-gen' 
          ? 'Next Generation Mentor Application' 
          : 'Professional Mentor Profile'}
      </h2>

      <div className="space-y-6">
        {mentorType === 'next-gen' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Age</label>
            <input
              type="number"
              placeholder="Your Age"
              className="w-full p-3 border rounded"
              value={formData.personalDetails.age}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personalDetails: {
                  ...prev.personalDetails,
                  age: e.target.value
                }
              }))}
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Age must be between 16 and 35
            </p>
          </div>
        )}

        {/* Additional form fields can be added here */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
};

// Placeholder Onboarding Component
const MentorOnboardingGuide = ({ mentorType }) => (
  <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">
      Welcome, {mentorType === 'next-gen' ? 'Next Gen Mentor' : 'Professional Mentor'}!
    </h2>
    <p>Your onboarding journey begins here...</p>
  </div>
);

export default MentorQualificationSystem;