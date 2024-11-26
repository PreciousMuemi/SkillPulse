import React from 'react';

export const MentorApplication = () => {
  const submitApplication = async (data) => {
    const application = {
      qualifications: data.qualifications,
      specializations: data.specializations,
      testScores: data.testScores
    };
    // Call to backend
    await window.canister.applyForMentor(application);
  };

  return (
    <div className="mentor-application">
      <h2>Become a Mentor</h2>
      {/* Application form components */}
    </div>
  );
};
