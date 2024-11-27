import React, { useState, useEffect } from 'react';
import { Bell, Book, Users, Award, Hash, Calendar, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MentorProgram from './MentorProgram';
import Header from './Header';
import { blobToPrincipal } from '../utils/principal';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    principal: '',
    xp: 0,
    walletBalance: 0
  });
  const [userType, setUserType] = useState('user');
  const [mentorApplication, setMentorApplication] = useState(null);
  const [principalId, setPrincipalId] = useState('');
  const [activeTab, setActiveTab] = useState('mentoring');
  const [showMentorRequest, setShowMentorRequest] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    subject: '',
    timezone: '',
    preferredTime: '',
    frequency: '',
    level: ''
  });
  const [mentorMatch, setMentorMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const communities = [
    { id: 'js-community', name: 'JavaScript Enthusiasts', description: 'A community for JavaScript learners and experts.' },
    { id: 'react-community', name: 'React Developers', description: 'A community for ReactJS enthusiasts to share knowledge and tips.' }
  ];

  const studyJams = [
    { id: 'js-study-jam', name: 'JavaScript Study Jam', date: '2024-12-10', description: 'Join this study jam to improve your JS skills with peers.' },
    { id: 'react-study-jam', name: 'React Study Jam', date: '2024-12-12', description: 'Join this study jam to deepen your understanding of React.' }
  ];

  const sidebarTabs = [
    { id: 'mentoring', icon: Users, label: 'Mentoring' },
    { id: 'communities', icon: Hash, label: 'Communities' },
    { id: 'study-jams', icon: Calendar, label: 'Study Jams' }
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      if (!skill_net_backend) {
        throw new Error('Backend canister not initialized');
      }
  
      const principalBlob = await skill_net_backend.whoami();
      const principalId = blobToPrincipal(principalBlob);
      setPrincipalId(principalId);
  
      const userResult = await skill_net_backend.getUser();
      if ('ok' in userResult) {
        const userInfo = userResult.ok;
        setUserProfile({
          principal: principalId,

          xp: userInfo.tokens || 0,
          walletBalance: userInfo.tokens || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {

      setLoading(false);  // This ensures loading is set to false in all cases
    }
  };

  const handleMentorApplication = async () => {
    try {
      const mentorApplication = {
        userId: principalId,
        submissionDate: Date.now(),
        qualifications: [], // Add relevant qualifications
        specializations: [], // Add relevant specializations
        testScores: [], // Add any test scores
        status: "pending"
      };
  
      const response = await skill_net_backend.applyForMentor(mentorApplication);
      
      if ('ok' in response) {
        setMentorApplication({ status: 'pending' });
      } else {
        console.error('Mentor application failed:', response.err);
      }
    } catch (error) {
      console.error('Error applying for mentor:', error);
    }
  };
  const [mentorRequestLoading, setMentorRequestLoading] = useState(false);
  const [mentorApplicationLoading, setMentorApplicationLoading] = useState(false);
  const [showMentorRequest, setShowMentorRequest] = useState(false);
  const [mentorMatch, setMentorMatch] = useState(null);

  const handleMentorRequest = async (formData) => {
    try {
      setMentorRequestLoading(true);
      const result = await skill_net_backend.requestMentor(formData);
      if (result) {
        handleMentorMatchSuccess(result);
      }
      setShowMentorRequest(false);
    } catch (error) {
      console.error('Error matching mentor:', error);
    } finally {
      setMentorRequestLoading(false);
    }
  };

  const handleMentorMatchSuccess = (match) => {
    setMentorMatch(match);
    // Show success notification or update UI
  };

  const handleLogout = () => {
    navigate('/login');
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
   
      {showMentorRequest && (
        <MentorRequestForm 
        onClose={() => setShowMentorRequest(false)}
        onSuccess={(match) => {
          setMentorMatch(match);
          setShowMentorRequest(false);
        }}
        />
      )}

      {mentorMatch && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
          <h3 className="text-lg font-medium text-green-800">Mentor Match Found!</h3>
          <div className="mt-2">
            <p>Match Score: {(mentorMatch.matchScore * 100).toFixed(1)}%</p>
            <p>Request ID: {mentorMatch.requestId}</p>
            <button 
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => {/* Handle accepting match */}}
            >
              Accept Match
            </button>
          </div>
        </div>
      )}
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-900 text-white shadow-lg flex flex-col">
        <div className="p-4 text-center text-2xl font-bold tracking-wider bg-gray-800 border-b border-gray-700">
          SkillNet
        </div>
        <nav className="mt-4 space-y-1 flex-grow">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center w-full px-4 py-3 transition-all duration-200 ease-in-out
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <tab.icon className="w-5 h-5 mr-3" />
              <span className="flex-grow text-left">{tab.label}</span>
              {activeTab !== tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
  
      <div className="flex-grow bg-gray-100">
        <Header className="bg-white shadow-sm" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome back, {userProfile.principal || 'User'}!
            </h1>
  
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Your Progress</h2>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-500">Experience Points</div>
                  <div className="text-sm font-medium text-gray-500">{userProfile.xp} XP</div>
                </div>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(userProfile.xp % 1000) / 1000 * 100}%` }}
                      transition={{ duration: 1 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  Wallet Balance: {userProfile.walletBalance || 0} SKN
                </div>
              </div>
            </div>
  
            {activeTab === 'mentoring' && (
              <div className="space-y-6">
                <MentorProgram />
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Mentoring</h3>
                  {userType === 'user' ? (
                    <div className="space-x-4">
                      {!mentorApplication && (
                        <button
                          onClick={handleMentorApplication}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Apply to be a Mentor
                        </button>
                      )}
                      <button
                        onClick={() => setShowMentorRequest(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Request a Mentor
                      </button>
                    </div>
                  ) : (
                    <div className="text-green-600 font-medium">Active Mentor</div>
                  )}
                </div>
  
                {mentorApplication && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h4 className="font-semibold text-yellow-800">Mentor Application Status</h4>
                    <p className="text-yellow-700">Your application is being reviewed</p>
                  </div>
                )}
  
                {mentorMatch && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <h4 className="font-semibold text-blue-800">Mentor Match Found!</h4>
                    <div className="text-blue-700 space-y-2">
                      <p>Mentor: {mentorMatch.name}</p>
                      <p>Expertise: {mentorMatch.expertise}</p>
                      <p>Availability: {mentorMatch.available}</p>
                      <p>Match Score: {(mentorMatch.confidence * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                )}
              </div>
            )}
  
            {activeTab === 'communities' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Communities</h3>
                {communities.map((community) => (
                  <div key={community.id} className="bg-white p-4 rounded-md shadow-md">
                    <h4 className="text-md font-medium">{community.name}</h4>
                    <p className="text-sm text-gray-500">{community.description}</p>
                    <button className="text-blue-500 hover:underline text-sm">Join</button>
                  </div>
                ))}
              </div>
            )}
  
            {activeTab === 'study-jams' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Study Jams</h3>
                {studyJams.map((studyJam) => (
                  <div key={studyJam.id} className="bg-white p-4 rounded-md shadow-md">
                    <h4 className="text-md font-medium">{studyJam.name}</h4>
                    <p className="text-sm text-gray-500">{studyJam.description}</p>
                    <div className="text-sm text-gray-600">Date: {studyJam.date}</div>
                    <button className="text-blue-500 hover:underline text-sm">Join</button>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {showMentorRequest && <MentorRequestForm />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;