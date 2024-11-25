import React, { useState, useEffect } from 'react';
import { Bell, Book, Users, Award, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from './UserContext';
import Header from './Header';
import { blobToPrincipal } from '../utils/principal';
import { skillnet_backend } from '../../../declarations/skillnet_backend';

// Define course categories
const courseCategories = [
  { id: 'softSkills', name: 'Soft Skills', icon: '🗣️' },
  { id: 'computing', name: 'Computing', icon: '💻' },
  { id: 'dataScience', name: 'Data Science', icon: '📊' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'languages', name: 'Languages', icon: '🌐' }
];

// Sample courses by category
const coursesByCategory = {
  softSkills: [
    {
      id: 'communication',
      title: 'Effective Communication Skills',
      description: 'Improve your communication skills in personal and professional settings',
      duration: '4 weeks',
      price: '5 SKN',
      mentorPrice: '4 SKN',
      modules: [{ id: 1, title: 'Verbal Communication', duration: '2 weeks', completed: false }]
    }
  ],
  computing: [
    {
      id: 'web-dev',
      title: 'Web Development Fundamentals',
      description: 'Complete beginner course covering HTML, CSS, and JavaScript basics',
      duration: '8 weeks',
      price: '10 SKN',
      mentorPrice: '8 SKN',
      modules: [{ id: 1, title: 'HTML Basics', duration: '2 weeks', completed: false }]
    }
  ],
  dataScience: [
    {
      id: 'intro-ds',
      title: 'Introduction to Data Science',
      description: 'Learn the fundamentals of Data Science including Python, Pandas, and data visualization',
      duration: '6 weeks',
      price: '12 SKN',
      mentorPrice: '10 SKN',
      modules: [{ id: 1, title: 'Python Basics', duration: '2 weeks', completed: false }]
    }
  ],
  // Add more categories and courses here...
};

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userProfile, setUserProfile] = useState({
    principal: '',
    xp: 0,
    walletBalance: 0
  });
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const principalBlob = await skillnet_backend.whoami();
      const principalId = blobToPrincipal(principalBlob);
      setPrincipalId(principalId);

      const userInfo = await skillnet_backend.getUser(principalId);
      setUserProfile({
        principal: principalId,
        xp: userInfo?.xp || 0,
        walletBalance: userInfo?.walletBalance || 0
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleMentorRequest = (e) => {
    e.preventDefault();
    setShowMentorRequest(false);
    alert('Mentor matched! Check your notifications for details.');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Display courses for the selected category
  const displayCourses = () => {
    const courses = coursesByCategory[selectedCategory] || [];
    return courses.map(course => (
      <div key={course.id} className="bg-white shadow rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-bold">{course.title}</h3>
        <p>{course.description}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Price:</strong> {course.price}</p>
        <p><strong>Mentor Price:</strong> {course.mentorPrice}</p>
        <button className="px-4 py-2 bg-green-500 text-white rounded">Start Course</button>
      </div>
    ));
  };

  // Handle category selection
  const handleCategorySelection = (category) => {
    setActiveTab(category);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, {userProfile.principal || 'User'}!</h1>

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
              <div className="text-sm font-medium text-gray-500">Wallet Balance: {userProfile.walletBalance || 0} SKN</div>
            </div>
          </div>

          {/* Tabs for Courses, Mentoring, Certifications */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 py-4">
              <button
                onClick={() => setActiveTab('courses')}
                className={`${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Book className="w-4 h-4 mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('mentoring')}
                className={`${
                  activeTab === 'mentoring'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Users className="w-4 h-4 mr-2" />
                Mentoring
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`${
                  activeTab === 'certifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Award className="w-4 h-4 mr-2" />
                Certifications
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {/* Course Tab Content */}
            {activeTab === 'courses' && displayCourses()}
            {/* Mentoring Tab Content */}
            {activeTab === 'mentoring' && (
              <div>
                <button
                  onClick={() => setShowMentorRequest(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Request a Mentor
                </button>

                {showMentorRequest && (
                  <div className="mt-4">
                    <form onSubmit={handleMentorRequest}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subject</label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded w-full"
                            value={mentorForm.subject}
                            onChange={e => setMentorForm({ ...mentorForm, subject: e.target.value })}
                          />
                        </div>
                        {/* Additional fields for timezone, preferred time, etc. */}
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                        >
                          Submit Request
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            {/* Certifications Tab Content */}
            {activeTab === 'certifications' && <div>Certifications content will go here</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
