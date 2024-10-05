import React, { useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useNavigate } from 'react-router-dom';

// incorporated internet identity 
const LoginPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          console.log("Successfully logged in");
          navigate('/landing'); // Use navigate to redirect
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        width: '300px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome to SkillNet</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          Connect and empower yourself through skills
        </p>
        <button
          onClick={handleLogin}
          disabled={isAuthenticating}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isAuthenticating ? "Authenticating..." : "Login with Internet Identity"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
