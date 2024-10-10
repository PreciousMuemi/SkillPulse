import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Load user profile and enrolled courses from localStorage on mount
    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    
    if (storedProfile) setUserProfile(storedProfile);
    setEnrolledCourses(storedEnrolledCourses);
  }, []);

  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      const updatedEnrolledCourses = [...enrolledCourses, courseId];
      setEnrolledCourses(updatedEnrolledCourses);
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, enrolledCourses, enrollInCourse }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);