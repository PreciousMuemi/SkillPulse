import React, { useState, useEffect } from 'react';
import { api, getAllCoursesFromJson } from "../services/api"; 
import Confetti from 'react-confetti';

const CourseExplorer = () => {
  // State for Confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // State Management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [userFeedback, setUserFeedback] = useState({});

  // Dynamically generate categories from JSON
  const CATEGORIES = getAllCoursesFromJson().categories.map(category => ({
    value: category.name,
    label: category.name
  }));

  const DIFFICULTIES = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  // Fetch Courses on Component Mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        // Use getAllCoursesFromJson to fetch courses
        const allCourses = getAllCoursesFromJson().categories.flatMap(category => 
          category.courses.map(course => ({
            ...course,
            category: category.name
          }))
        );
        setCourses(allCourses);
        setLoading(false);
      } catch (fetchError) {
        setError('Failed to load courses. Please try again.');
        setLoading(false);
        console.error('Failed to load courses', fetchError);
      }
    };
    loadCourses();
  }, []);

  // Course Filtering Logic
  const filteredCourses = courses.filter(course => 
    (!selectedCategory || course.category === selectedCategory) &&
    (!selectedDifficulty || course.level === selectedDifficulty)
  );

  // Module Completion Handler
  const handleModuleCompletion = async (courseId, moduleId) => {
    try {
      // Update completed modules
      const currentCompletedModules = completedModules[courseId] || [];
      const newCompletedModules = [...currentCompletedModules, moduleId];

      setCompletedModules(prev => ({
        ...prev,
        [courseId]: newCompletedModules
      }));

      // Check if all modules are completed
      const course = await api.getCourseById(courseId);
      if (newCompletedModules.length === course.modules.length) {
        // Assuming this method exists in your API
        await api.claimCourseCompletionReward(courseId);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      // Calculate XP
      await api.calculateXP(courseId, newCompletedModules);
    } catch (error) {
      console.error('Module completion error', error);
    }
  };

  // Feedback Submission Handler
  const handleFeedbackSubmit = (courseId, feedback) => {
    setUserFeedback(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), feedback]
    }));
  };

  // Course Details Modal
  const CourseDetailsModal = ({ course, onClose }) => {
    const [feedbackText, setFeedbackText] = useState('');

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold text-[#272757] mb-4">{course.name}</h2>
          <p className="text-gray-600 mb-6">{course.description || 'No description available'}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Course Details */}
            <div>
              <h3 className="font-semibold text-[#272757] mb-3">Course Info</h3>
              <div className="space-y-2">
                <p>Difficulty: {course.level}</p>
                <p>Modules: {course.modules.length}</p>
                <p>Submission Platform: {course.submissionPlatform || 'Not specified'}</p>
              </div>
            </div>

            {/* Module Progress */}
            <div>
              <h3 className="font-semibold text-[#272757] mb-3">Module Progress</h3>
              {course.modules.map(module => (
                <div key={module.id} className="flex items-center mb-2">
                  <input 
                    type="checkbox"
                    checked={(completedModules[course.id] || []).includes(module.id)}
                    onChange={() => handleModuleCompletion(course.id, module.id)}
                    className="mr-2 text-[#272757] focus:ring-[#272757]"
                  />
                  <span>{module.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Feedback Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-[#272757] mb-3">Community Feedback</h3>
            
            {/* Existing Feedback */}
            {(userFeedback[course.id] || []).map((feedback, index) => (
              <div 
                key={index} 
                className="bg-gray-100 p-3 rounded-lg mb-2"
              >
                {feedback}
              </div>
            ))}

            {/* Feedback Input */}
            <div className="flex mt-4">
              <input 
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#272757]"
              />
              <button 
                onClick={() => {
                  if (feedbackText.trim()) {
                    handleFeedbackSubmit(course.id, feedbackText);
                    setFeedbackText('');
                  }
                }}
                className="bg-[#272757] text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#272757]"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#272757] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Confetti Display */}
      {showConfetti && <Confetti />}

      {/* Modal Rendering */}
      {activeCourse && (
        <CourseDetailsModal 
          course={activeCourse} 
          onClose={() => setActiveCourse(null)} 
        />
      )}

      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#272757] mb-4">
            Skill Net Learning Platform
          </h1>
          <p className="text-gray-600">
            Unlock Your Potential, One Course at a Time
          </p>
        </div>

        {/* Filtering Section */}
        <div className="flex justify-center space-x-4 mb-8">
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#272757]"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#272757]"
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => setActiveCourse(course)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#272757] group-hover:text-opacity-80 transition-colors">
                    {course.name}
                  </h3>
                  <div className="text-yellow-500 group-hover:scale-110 transition-transform">
                    ⭐
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{course.level} Level</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.modules.length} Modules
                  </span>
                  <div className="text-blue-500 group-hover:scale-110 transition-transform">
                    📖
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseExplorer;
