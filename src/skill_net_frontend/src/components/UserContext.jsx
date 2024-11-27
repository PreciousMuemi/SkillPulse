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

      // Fetch user identity from Internet Identity
      const info = await skill_net_backend.whoami();
      if (!info) {
        throw new Error('No user identity found');
      }

      const principalId = blobToPrincipal(info);
      
      // Fetch user profile from backend
      const backendProfile = await skill_net_backend.getUser(principalId);
      
      // Merge with local storage data
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      const mergedProfile = {
        ...storedProfile,
        ...backendProfile,
        principalId,
        lastUpdated: new Date().toISOString()
      };

      setUserProfile(mergedProfile);
      setEnrolledCourses(storedEnrolledCourses);
      
      // Update local storage
      localStorage.setItem('userProfile', JSON.stringify(mergedProfile));
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      
      // Fallback to local storage if backend fails
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedEnrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      if (storedProfile) {
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
      
      // Update backend
      if (userProfile?.principalId) {
        await skill_net_backend.updateUser(userProfile.principalId, newProfile);
      }

      // Update local state and storage
      const updatedProfile = {
        ...userProfile,
        ...newProfile,
        lastUpdated: new Date().toISOString()
      };
      
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      throw err;
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      setError(null);
      
      if (!enrolledCourses.includes(courseId)) {
        // Update backend
        if (userProfile?.principalId) {
          await skill_net_backend.enrollInCourse(userProfile.principalId, courseId);
        }

        // Update local state and storage
        const updatedEnrolledCourses = [...enrolledCourses, courseId];
        setEnrolledCourses(updatedEnrolledCourses);
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));
        
        // Update XP and wallet balance if needed
        const updatedProfile = await skill_net_backend.getUser(userProfile.principalId);
        if (updatedProfile) {
          updateUserProfile(updatedProfile);
        }
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if needed
      // await skillnet_backend.logout();
      
      // Clear local storage
      localStorage.removeItem('userProfile');
      localStorage.removeItem('enrolledCourses');
      
      // Reset state
      setUserProfile(null);
      setEnrolledCourses([]);
      setError(null);
      
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err.message);
    }
  };

  const refreshUserData = () => {
    return fetchUserData();
  };

  const contextValue = {
    userProfile,
    enrolledCourses,
    loading,
    error,
    updateUserProfile,
    enrollInCourse,
    logout,
    refreshUserData
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;