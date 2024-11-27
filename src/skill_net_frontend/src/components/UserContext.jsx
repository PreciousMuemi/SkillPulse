import React, { createContext, useState, useEffect, useContext } from 'react';
import { skill_net_backend } from '../../../declarations/skill_net_backend';
import { blobToPrincipal } from '../utils/principal';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const info = await skill_net_backend.whoami();
      if (!info) {
        throw new Error('No user identity found.');
      }

      const principalId = blobToPrincipal(info);

      const backendProfile = await skill_net_backend.getUser(principalId);

      const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

      const mergedProfile = {
        ...storedProfile,
        ...backendProfile,
        principalId,
        lastUpdated: new Date().toISOString(),
      };

      setUserProfile(mergedProfile);
      setEnrolledCourses(storedEnrolledCourses);

      localStorage.setItem('userProfile', JSON.stringify(mergedProfile));
    } catch (err) {
      console.error('Error fetching user data:', err.message);
      setError('Failed to load user data. Using cached data.');

      const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

      if (Object.keys(storedProfile).length > 0) {
        setUserProfile(storedProfile);
        setEnrolledCourses(storedEnrolledCourses);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (newProfile) => {
    try {
      setError(null);

      if (userProfile?.principalId) {
        await skill_net_backend.updateUser(userProfile.principalId, newProfile);
      }

      const updatedProfile = {
        ...userProfile,
        ...newProfile,
        lastUpdated: new Date().toISOString(),
      };

      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (err) {
      console.error('Error updating user profile:', err.message);
      setError('Failed to update user profile.');
      throw err;
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      setError(null);

      if (!enrolledCourses.includes(courseId)) {
        if (userProfile?.principalId) {
          await skill_net_backend.enrollInCourse(userProfile.principalId, courseId);
        }

        const updatedEnrolledCourses = [...enrolledCourses, courseId];
        setEnrolledCourses(updatedEnrolledCourses);
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));

        const updatedProfile = await skill_net_backend.getUser(userProfile.principalId);
        if (updatedProfile) {
          updateUserProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Error enrolling in course:', err.message);
      setError('Failed to enroll in course.');
      throw err;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('enrolledCourses');
      setUserProfile(null);
      setEnrolledCourses([]);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err.message);
      setError('Failed to log out.');
    }
  };

  const contextValue = {
    userProfile,
    enrolledCourses,
    loading,
    error,
    updateUserProfile,
    enrollInCourse,
    logout,
    refreshUserData: fetchUserData,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
