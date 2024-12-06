import React, { createContext, useState, useContext, useCallback } from 'react';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

// Create a default context with fallback methods
const defaultContextValue = {
  user: null,
  setUser: () => {},
  fetchUserProfile: async () => null,
  clearUser: () => {},
  loading: false,
  error: null
};

const UserContext = createContext(defaultContextValue);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err);
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async (principal) => {
    try {
      setLoading(true);
      const userProfile = await skill_net_backend.getUserProfile(principal);
      
      if (userProfile) {
        setUser(userProfile);
        return userProfile;
      }
      
      return null;
    } catch (err) {
      setError(err);
      console.error('Error fetching user profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const contextValue = {
    user,
    setUser: updateUser,
    fetchUserProfile,
    clearUser,
    loading,
    error
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
