import React, { useState } from 'react';

const CourseCard = ({ course }) => {
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    setEnrolled(true);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="font-semibold mb-4">Duration: {course.duration}</p>
      
      <button
        className={`px-4 py-2 rounded-md transition-colors ${
          enrolled ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        onClick={handleEnroll}
        disabled={enrolled}
      >
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  );
};

export default CourseCard;
