import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
// import CourseDetail from './components/courseDetail';
import UserProfile from './components/UserProfile';
import MentorMenteeMatch from './components/MentorMenteeMatch';
import LeaderBoard from './components/LeaderBoard';
import NFTGallery from './components/NFTgallery';
import AchievementsPanel from './components/AchievementsPanel';
import JobMarket from './components/jobMarket';
import CourseExplorer from './components/Realcourse';
import UserRegistrationFlow from './components/login';
import StudyJamForm from './components/JamForm';
import TribeCreationForm from './components/TribeForm';
import CreateForumForm from './components/ForumForm';
import MentorshipMatchForm from './components/MForm';
import NotificationSetupForm from './components/NotificationForm';
import UserInterestsForm from './components/skilsform';

function AppRoutes({ 
  isAuthenticated, 
  principal, 
  onLogin, 
  onLogout, 
  isWalletConnected,
  backendActor 
}) {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            principal ? <UserRegistrationFlow /> : <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage onLogin={onLogin} />} 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <Dashboard 
              onLogout={onLogout} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/course/:id" 
        element={
          isAuthenticated ? (
            <CourseExplorer
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/profile" 
        element={
          isAuthenticated ? (
            <UserProfile 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          isAuthenticated ? (
            <LeaderBoard 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/mentor-match" 
        element={
          isAuthenticated ? (
            <MentorMenteeMatch 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/nft-gallery" 
        element={
          isAuthenticated ? (
            <NFTGallery 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/achievements" 
        element={
          isAuthenticated ? (
            <AchievementsPanel 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      <Route 
        path="/jobs" 
        element={
          isAuthenticated ? (
            <JobMarket 
              backendActor={backendActor} 
              isWalletConnected={isWalletConnected} 
            />
          ) : (
            <Navigate to="/" />
          )
        } 
      />

      {/* Unprotected Routes */}
      <Route path="/study-jam" element={<StudyJamForm />} />
      <Route path="/tribe" element={<TribeCreationForm />} />
      <Route path="/forum" element={<CreateForumForm />} />
      <Route path="/mentorship" element={<MentorshipMatchForm />} />
      <Route path="/notifications" element={<NotificationSetupForm />} />
      <Route path="/skills" element={<UserInterestsForm />} />
    </Routes>
  );
}

export default AppRoutes;
