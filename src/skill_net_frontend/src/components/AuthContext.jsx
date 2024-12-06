import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useUser } from './UserContext';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);

  // Safely use useUser with fallback
  const { 
    fetchUserProfile = async () => null, 
    clearUser = () => {} 
  } = useUser();

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const identity = client.getIdentity();
          const currentPrincipal = identity.getPrincipal();
          setPrincipal(currentPrincipal);

          // Attempt to fetch user profile
          await fetchUserProfile(currentPrincipal);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, [fetchUserProfile]);

  // Login method
  const login = useCallback(async () => {
    if (authClient) {
      try {
        await authClient.login({
          identityProvider: process.env.II_URL,
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            const currentPrincipal = identity.getPrincipal();
            
            setIsAuthenticated(true);
            setPrincipal(currentPrincipal);

            // Check if user profile exists
            const userProfile = await fetchUserProfile(currentPrincipal);
            
            // If no profile exists, prepare for registration
            if (!userProfile) {
              return false;
            }

            return true;
          },
        });
      } catch (error) {
        console.error('Login error:', error);
        setIsAuthenticated(false);
        return false;
      }
    }
    return false;
  }, [authClient, fetchUserProfile]);

  // Logout method
  const logout = useCallback(async () => {
    if (authClient) {
      try {
        await authClient.logout();
        setIsAuthenticated(false);
        setPrincipal(null);
        clearUser();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }, [authClient, clearUser]);

  const contextValue = {
    isAuthenticated,
    login,
    logout,
    principal,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
