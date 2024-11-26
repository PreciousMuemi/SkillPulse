import React, { useState, useEffect } from 'react';

export const MentorEligibilityCheck = ({ onEligibilityPassed }) => {
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const checkEligibility = async () => {
    const user = await window.canister.getUser();
    if (user.ok) {
      const requirements = {
        minCompletedCourses: 3,
        minSkillLevel: "intermediate",
        verificationRequired: true
      };

      const isEligible = 
        user.ok.completedCourses.length >= requirements.minCompletedCourses &&
        user.ok.verificationStatus === "verified" &&
        user.ok.skills.some(skill => skill.level === "intermediate" || skill.level === "expert");

      setEligibilityStatus(isEligible);
      setUserDetails(user.ok);
    }
  };

  useEffect(() => {
    checkEligibility();
  }, []);

  if (!userDetails) {
    return <div>Loading eligibility check...</div>;
  }

    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Mentor Program Eligibility</h3>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg flex justify-between items-center ${
            userDetails.completedCourses.length >= 3 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <span className="flex items-center">
              {userDetails.completedCourses.length >= 3 ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              Completed Courses
            </span>
            <span>({userDetails.completedCourses.length}/3)</span>
          </div>
          
          {/* Similar styling for other requirements */}
        </div>
  
        {eligibilityStatus ? (
          <button 
            onClick={onEligibilityPassed}
            className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Proceed to Application
          </button>
        ) : (
          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            <p className="text-sm">Complete the remaining requirements to become eligible for the mentor program.</p>
          </div>
        )}
      </div>
    );
  };
  