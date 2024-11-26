import React, { useState } from 'react';
import { enrollInCourse } from '../services/api';
import { useAuth } from './AuthContext';

function EnrollmentButton({ courseId }) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  async function handleEnroll() {
    if (isAuthenticated) {
      const result = await enrollInCourse(courseId);
      if (result.ok) {
        setIsEnrolled(true);
      } else {
        alert('Failed to enroll: ' + result.err);
      }
    } else {
      alert('Please log in to enroll in courses.');
    }
  }

  return (
    <button onClick={handleEnroll} disabled={isEnrolled}>
      {isEnrolled ? 'Enrolled' : 'Enroll'}
    </button>
  );
}

export default EnrollmentButton;