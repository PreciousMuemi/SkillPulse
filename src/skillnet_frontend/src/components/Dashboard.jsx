import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from './UserContext';
import Header from './Header';

const courseCategories = [
  { id: 'softSkills', name: 'Soft Skills', icon: '🗣️' },
  { id: 'computing', name: 'Computing', icon: '💻' },
  { id: 'dataScience', name: 'Data Science', icon: '📊' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'languages', name: 'Languages', icon: '🌐' },
];

const dummyCourses = [

  { id: 1, title: "Effective Communication", description: "Master the art of clear and impactful communication", category: "softSkills", duration: "4 weeks" },
  { id: 2, title: "Leadership Fundamentals", description: "Develop essential leadership skills for the modern workplace", category: "softSkills", duration: "6 weeks" },
  { id: 3, title: "Time Management Mastery", description: "Learn techniques to boost productivity and manage time effectively", category: "softSkills", duration: "3 weeks" },
  
  // Computing
  { id: 4, title: "Introduction to Python", description: "Learn the basics of Python programming", category: "computing", duration: "8 weeks" },
  { id: 5, title: "Web Development Bootcamp", description: "Comprehensive course on full-stack web development", category: "computing", duration: "12 weeks" },
  { id: 6, title: "Mobile App Development with React Native", description: "Build cross-platform mobile apps", category: "computing", duration: "10 weeks" },
  
  // Data Science
  { id: 7, title: "Data Analysis with Python", description: "Learn to analyze data using Python and popular libraries", category: "dataScience", duration: "8 weeks" },
  { id: 8, title: "Machine Learning Fundamentals", description: "Introduction to machine learning algorithms and applications", category: "dataScience", duration: "10 weeks" },
  
  // Design
  { id: 9, title: "UI/UX Design Principles", description: "Master the fundamentals of user interface and user experience design", category: "design", duration: "6 weeks" },
  { id: 10, title: "Graphic Design for Beginners", description: "Learn the basics of graphic design and visual communication", category: "design", duration: "5 weeks" },
  
  // Business
  { id: 11, title: "Entrepreneurship 101", description: "Learn the fundamentals of starting and running a business", category: "business", duration: "8 weeks" },
  { id: 12, title: "Digital Marketing Essentials", description: "Master the core concepts of digital marketing", category: "business", duration: "6 weeks" },
  
  // Languages
  { id: 13, title: "Spanish for Beginners", description: "Start your journey to Spanish fluency", category: "languages", duration: "10 weeks" },
  { id: 14, title: "Mandarin Chinese Basics", description: "Learn the fundamentals of Mandarin Chinese", category: "languages", duration: "12 weeks" },
];

const Dashboard = ({ onLogout }) => {
  // const { userProfile, updateUserProfile, enrolledCourses, enrollInCourse } = useUser();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!userProfile) {
  //     fetchUserProfile();
  //   }
  // }, []);

  const fetchUserProfile = async () => {
    // Simulating API call
    const profile = {
      username: "John Doe",
      level: 5,
      xp: 2750,
      tokenBalance: 500,
    };
    updateUserProfile(profile);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCourses = selectedCategories.length > 0
    ? dummyCourses.filter(course => selectedCategories.includes(course.category))
    : dummyCourses;

  const handleEnroll = (courseId) => {
    enrollInCourse(courseId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.svg" alt="SkillNet" />
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
              <button onClick={onLogout} className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav> */}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, !</h1>
          
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Your Progress</h2>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Level</div>
                <div className="text-sm font-medium text-gray-500"> XP</div>
              </div>
              <div className="mt-2 relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(323 % 1000) / 1000 * 100}%` }}
                    transition={{ duration: 1 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Wallet Balance:  SKN</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {courseCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-4 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-200 ${
                  selectedCategories.includes(category.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{course.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {courseCategories.find(cat => cat.id === course.category).name}
                    </span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  {/* {enrolledCourses.includes(course.id) ? (
                    <button 
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Continue Course
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Enroll Now
                    </button> */}
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;