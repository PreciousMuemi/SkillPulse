import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Book, Users, Award, Hash, Calendar, ChevronRight, LogOut, Activity, Star, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import MentorDiscovery from './MentorDiscovery';
import 'react-toastify/dist/ReactToastify.css';
import Logo from './skillnet.jpg';
import MentorQualificationSystem from './MentorQualification';
// import MentorProgram from './MentorProgram';
import MentorRequestForm from './MentorRequestForm';
import Header from './Header';
import { blobToPrincipal } from '../utils/principal';
import { skill_net_backend } from '../../../declarations/skill_net_backend';
import ContentUploadComponent  from './content';
import { useUser } from './UserContext';
const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    principal: '',
    xp: 0,
    walletBalance: 0,
    level: 1
  });
  const [userType, setUserType] = useState('user');
  const [principal, setPrincipal] = useState(null);
  const { user, updateUserVibe } = useUser();
  const [mentorApplication, setMentorApplication] = useState(null);
  const [principalId, setPrincipalId] = useState('');
  const [activeTab, setActiveTab] = useState('mentoring');
  const [showMentorRequest, setShowMentorRequest] = useState(false);
  const [mentorRequestLoading, setMentorRequestLoading] = useState(false);
  const [mentorMatch, setMentorMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);


  const courses = [
    { id: 'js-course', name: 'JavaScript for Beginners', description: 'A comprehensive course to learn JavaScript from scratch.', participants: 320 },
    { id: 'react-course', name: 'Mastering React', description: 'An advanced course for mastering React and building real-world applications.', participants: 220 }
  ];
  
  const communities = [
    { id: 'js-community', name: 'JavaScript Enthusiasts', description: 'A community for JavaScript learners and experts.', members: 1240 },
    { id: 'react-community', name: 'React Developers', description: 'A community for ReactJS enthusiasts to share knowledge and tips.', members: 980 }
  ];

  const studyJams = [
    { id: 'js-study-jam', name: 'JavaScript Study Jam', date: '2024-12-10', description: 'Join this study jam to improve your JS skills with peers.', spots: 15 },
    { id: 'react-study-jam', name: 'React Study Jam', date: '2024-12-12', description: 'Join this study jam to deepen your understanding of React.', spots: 20 }
  ];

  const sidebarTabs = [
    { id: 'mentoring', icon: Users, label: 'Mentoring' },
    { id: 'courses', icon: Book, label: 'Courses' },
    { id: 'communities', icon: Hash, label: 'Communities' },
    { id: 'study-jams', icon: Calendar, label: 'Study Jams' },
    { id: 'glowup', icon: Star, label: 'GlowUp' },
    { id: 'forums', icon: Star, label: 'Forums' },
  ];

  const forums = [
    { id: 'js-forum', name: 'JavaScript Forum', description: 'A forum for learing Js.' },
    { id: 'react-forum', name: 'React Forum', description: 'A forum for learning react.' },
  ];

  const addNotification = useCallback((message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Add this helper function at the top of your component
  const logError = (error, context) => {
    const message = error?.message || 'Unknown error occurred';
    const combinedMessage = `${context}: ${message}`;
    
    if (combinedMessage) {
      console.error(combinedMessage);
    }
  };

  // Update the error handling in fetchUserProfile
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
      
      if ('ok' in userResult && userResult.ok) {
        const userInfo = userResult.ok;
        setUserProfile({
          principal: principalId,
          xp: Number(userInfo.tokens) || 0,
          walletBalance: Number(userInfo.tokens) || 0,
          level: Math.floor((Number(userInfo.tokens) || 0) / 1000) + 1
        });
        toast.success('Profile loaded successfully');
      } else {
        logError(new Error('Invalid user data received'), 'User Profile Fetch');
      }
    } catch (error) {
      logError(error, 'User Profile Fetch');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  const handleMentorApplication = async () => {
    try {
      const mentorApplication = {
        userId: principalId,
        submissionDate: Date.now(),
        qualifications: [],
        specializations: [],
        testScores: [],
        status: "pending"
      };
  
      const response = await skill_net_backend.applyForMentor(mentorApplication);
      
      if ('ok' in response) {
        setMentorApplication({ status: 'pending' });
        addNotification('Mentor application submitted successfully', 'success');
      } else {
        console.error('Mentor application failed:', response.err);
        addNotification('Failed to submit mentor application', 'error');
      }
    } catch (error) {
      console.error('Error applying for mentor:', error);
      addNotification('Error during mentor application', 'error');
    }
  };

  const handleLogout = () => {
    addNotification('Logging out...', 'info');
    navigate('/login');
  };

  const renderNotifications = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`
              p-4 rounded-lg shadow-lg text-white 
              ${notification.type === 'success' ? 'bg-green-600' : 
                notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
            `}
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex"
    >
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {renderNotifications()}
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#040622] text-white shadow-xl flex flex-col"
      >
        <div className="p-6 text-center text-3xl font-bold tracking-wider border-b border-gray-700 flex items-center justify-center">
        <div className="flex items-center">
          <img src={Logo} alt="App Logo" className="h-10 w-10 mr-2" />
        </div>
          SkillPulse
        </div>
        
        <nav className="mt-6 space-y-2 flex-grow px-4">
          {sidebarTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ease-in-out
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              `}
            >
              <tab.icon className="w-5 h-5 mr-3" />
              <span className="flex-grow text-left">{tab.label}</span>
              {activeTab !== tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </motion.button>
          ))}
        </nav>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 border-t border-gray-700"
        >
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      
      <div className="flex-grow bg-gray-100 overflow-y-auto">
        <Header className="bg-white shadow-sm" />
        
        <motion.main 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* User Progress Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6"
          >
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Star className="mr-2 text-yellow-500" />
                  Your Progress
                </h2>
                <div className="flex items-center">
                  <Activity className="mr-2 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Level {userProfile.level}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex-grow">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Experience Points</span>
                    <span className="text-sm font-bold text-blue-600">
                      {userProfile.xp} XP
                    </span>
                  </div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(userProfile.xp % 1000) / 1000 * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-3 bg-blue-500 rounded-full"
                  />
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Wallet: {userProfile.walletBalance} SKN
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Content Sections */}
          <AnimatePresence mode="wait">
            {activeTab === 'mentoring' && (
              <motion.div 
                key="mentoring"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="space-y-6"
              >
                {/* {<MentorQualificationSystem/> } */}
                
                {/* Mentor Application Section */}
                <div className="flex justify-between items-center">
                  {/* <h3 className="text-lg font-semibold">Mentoring</h3> */}
                  {userType === 'user' && (
                    <div className="space-x-4">
                      <MentorDiscovery />
                      {/* {!mentorApplication && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMentorApplication}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                        >
                          Apply to be a Mentor
                        </motion.button>
                      )} */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMentorRequest(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                      >
                        Request a Mentor
                      </motion.button>
                    </div>
                  )}
                </div>
                

                {mentorApplication && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
                  >
                    <h4 className="font-semibold text-yellow-800">Mentor Application Status</h4>
                    <p className="text-yellow-700">Your application is being reviewed</p>
                  </motion.div>
                )}
              </motion.div>
            )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Courses</h2>
              <ul className="space-y-4">
                {courses.map(course => (
                  <li key={course.id} className="border bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <h3 className="text-xl font-semibold text-indigo-600">{course.name}</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Participants: {course.participants}</p>
                    <div className="mt-4">
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

            {activeTab === 'communities' && (
              <motion.div 
                key="communities"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Communities</h3>
                {communities.map((community) => (
                  <motion.div 
                    key={community.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
                  >
                    <h4 className="text-md font-medium flex items-center">
                      <Hash className="mr-2 text-blue-500" />
                      {community.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">{community.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600">{community.members}members</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
                      >
                        Join
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'study-jams' && (
              <motion.div 
                key="study-jams"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Study Jams</h3>
                {studyJams.map((studyJam) => (
                  <motion.div 
                    key={studyJam.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
                  >
                    <h4 className="text-md font-medium flex items-center">
                      <Calendar className="mr-2 text-green-500" />
                      {studyJam.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">{studyJam.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="mr-2">Date: {studyJam.date}</span>
                        {/* <span className="text-blue-500">{studyJam.spots} spots left</span> */}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-all"
                      >
                        Join
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

      {activeTab === 'glowup' && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Profile & Stats */}
            
            <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  // src=
                  className="w-16 h-16 rounded-full ring-2 ring-indigo-300"
                />
                <div>
                  <h3 className="font-bold text-xl">@ Username</h3>
                  <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                    role • Lv X
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {label: '🔥 Streak', value: 23},
                  {label: '⭐ Posts', value: 11},
                  {label: '💫 Rating', value: 2.3}
                ].map(stat => (
                  <div key={stat.label} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-xl text-center">
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-indigo-700">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Content Upload */}
            <div className="md:col-span-2 bg-white shadow-2xl rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-indigo-700 flex items-center">
                  <Upload className="mr-3 text-indigo-500" size={28} />
                  Share Your Magic ✨
                </h2>
              </div>

              <ContentUploadComponent
                onUploadSuccess={(uploadedContent) => {
                  toast.success('Content Uploaded Successfully!', {
                    position: "top-right",
                    duration: 3000
                  });
                }}
              />

              {/* Quick Upload Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h4 className="font-medium text-indigo-700 mb-2">Today's Posts</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-600">
                      43
                    </span>
                    <span className="text-sm text-indigo-500">
                      /55 available
                    </span>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-700 mb-2">Next Unlock</h4>
                  <p className="text-sm text-purple-600">
                    200
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'forums' && (
      <motion.div 
        key="forums"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Forums</h3>
        {forums.map((forum) => (
          <motion.div 
            key={forum.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            <h4 className="text-md font-medium">{forum.name}</h4>
            <p className="text-sm text-gray-500 mt-2">{forum.description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openForum(forum.id)}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all"
            >
              View Posts
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    )}

          
          </AnimatePresence>

          {/* Mentor Request Modal */}
          <AnimatePresence>
            {showMentorRequest && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Request a Mentor</h2>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={() => setShowMentorRequest(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <MentorRequestForm 
                    onClose={() => setShowMentorRequest(false)}
                    onSubmit={(formData) => {
                      handleMentorRequest(formData);
                      setShowMentorRequest(false);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
};
class DashboardErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-container">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}


export default Dashboard;
