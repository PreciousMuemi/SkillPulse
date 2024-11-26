import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Book, Users, Award, Calendar, Hash, ChevronRight, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from './UserContext';
import MentorProgram from './MentorProgram';
import UserProfile from './UserProfile';
import Header from './Header';
import { blobToPrincipal } from '../utils/principal';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userProfile, setUserProfile] = useState({
    principal: '',
    xp: 0,
    walletBalance: 0
  });
  const [userType, setUserType] = useState('user');
  const [mentorApplication, setMentorApplication] = useState(null);
  const [principalId, setPrincipalId] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
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
    { id: 'courses', icon: Book, label: 'Courses' },
    { id: 'mentoring', icon: Users, label: 'Mentoring' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'certifications', icon: Award, label: 'Certifications' },
    { id: 'communities', icon: Hash, label: 'Communities' },
    { id: 'study-jams', icon: Calendar, label: 'Study Jams' }
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchMentorMatch();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const principalBlob = await skillnet_backend.whoami();
      const principalId = blobToPrincipal(principalBlob);
      setPrincipalId(principalId);

      const userInfo = await skill_net_backend.getUser(principalId);
      setUserProfile({
        principal: principalId,
        xp: userInfo?.xp || 0,
        walletBalance: userInfo?.walletBalance || 0
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleMentorApplication = async () => {
    try {
      const response = await skill_net_backend.applyForMentor();
      if (response.ok) {
        setMentorApplication({ status: 'pending' });
      }
    } catch (error) {
      console.error('Error applying for mentor:', error);
    }
  };

  const fetchMentorMatch = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/match_mentor', {
        mentee_id: principalId,
        desired_skills: [
          { name: "python", level: "intermediate" },
          { name: "web_development", level: "beginner" }
        ]
      });
      
      const topMentor = response.data.recommended_mentors[0];
      setMentorMatch({
        name: topMentor.mentor_id,
        expertise: topMentor.mentor_id,
        available: topMentor.availability.join(', '),
        confidence: response.data.match_confidence
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentor match:', error);
      setLoading(false);
    }
  };

  const handleMentorRequest = async (formData) => {
    try {
      setLoading(true);
      const user = await skill_net_backend.getUser();
      if (!user.ok) {
        throw new Error('Please create a user profile first');
      }

      const response = await axios.post('http://127.0.0.1:5000/match_mentor', {
        mentee_id: principalId,
        desired_skills: formData.skills,
        timezone: formData.timezone,
        preferred_time: formData.preferredTime
      });

      if (response.data.recommended_mentors.length > 0) {
        setMentorMatch(response.data.recommended_mentors[0]);
      }
    } catch (error) {
      console.error('Error matching mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const MentorRequestForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Request a Mentor</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleMentorRequest(mentorForm);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject Area</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300"
              value={mentorForm.subject}
              onChange={(e) => setMentorForm({...mentorForm, subject: e.target.value})}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowMentorRequest(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
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
  
            {activeTab === 'profile' && <UserProfile />}
  
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
)}
export default Dashboard;