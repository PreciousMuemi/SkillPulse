import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useUser } from './UserContext'; // Import the user context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      setAuthClient(client);

      // Fetch user details when authenticated
      if (isAuthenticated) {
        const userDetails = await client.getIdentity(); // Example to get user info
        setUser(userDetails);
      }
      return { user };
    });
  }, []);

  async function login() {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: async () => {
          setIsAuthenticated(true);
          const userDetails = await authClient.getIdentity(); // Get user details
          setUser(userDetails);  // Store user details after login
        },
      });
    }
  }

  async function logout() {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setUser(null);  // Reset user data on logout
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
