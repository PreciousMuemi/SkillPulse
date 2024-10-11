import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

// Import components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/courseDetail';
import UserProfile from './components/UserProfile';
import WalletConnection from './components/WalletConnection';
import Footer from './components/Footer';
import Header from './components/Header';
import MentorMenteeMatch from './components/MentorMenteeMatch';
import LeaderBoard from './components/LeaderBoard';
import NFTGallery from './components/NFTgallery';
import AchievementsPanel from './components/AchievementsPanel';
import JobMarket from './components/jobMarket';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    };

    initAuth();
  }, []);

  const handleAuthenticated = async (client) => {
    setIsAuthenticated(true);
    const identity = client.getIdentity();
    const agent = new HttpAgent({ identity });
    const actor = await window.Actor.createActor(backendIdlFactory, {
      agent,
      canisterId: backendCanisterId,
    });
    setBackendActor(actor);
  };

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: () => handleAuthenticated(authClient),
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setBackendActor(null);
    }
  };

  // const handleWalletConnect = (connected) => {
  //   setIsWalletConnected(connected);
  // };

  return (
    <Router>
      <div className="app">
        {/* {isAuthenticated && <WalletConnection onConnect={handleWalletConnect} />} */}
        <Routes>
          <Route path="/" element=
            {isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage onLogin={login} />}
          />
          <Route path="/dashboard" element=
            {isAuthenticated ? (
              <Dashboard 
                backendActor={backendActor} 
                onLogout={logout}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/course/:id" element=
            {isAuthenticated ? (
              <CourseDetail 
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/profile" element=
            {isAuthenticated ? (
              <UserProfile 
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/leaderboard" element=
            {isAuthenticated ? (
              <LeaderBoard 
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/mentor-match" element=
            {isAuthenticated ? (
              <MentorMenteeMatch
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/nft-gallery" element=
            {isAuthenticated ? (
              <NFTGallery 
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/archievements" element=
            {isAuthenticated ? (
              <AchievementsPanel
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route path="/job-market" element=
            {isAuthenticated ? (
              <JobMarket 
                backendActor={backendActor}
                isWalletConnected={isWalletConnected}
              />
            ) : (
              <Navigate to="/" />
            )}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;