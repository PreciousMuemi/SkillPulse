import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      setAuthClient(client);
    });
  }, []);

  async function login() {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: () => setIsAuthenticated(true),
      });
    }
  }

  async function logout() {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}