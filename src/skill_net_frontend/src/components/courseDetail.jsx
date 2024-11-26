import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import Header from './Header';

const dummyCourses = [
  // ... (keep the dummyCourses array as it was)
];

const courseCategories = [
  // ... (keep the courseCategories array as it was)
];

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false); // State to track enrollment
  const { userProfile, enrolledCourses, enrollInCourse } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      // Simulating API call with dummy data
      const courseData = dummyCourses.find(c => c.id === parseInt(id));
      setCourse(courseData);
      setEnrolled(enrolledCourses.includes(parseInt(id))); // Check if already enrolled
    }
    fetchCourse();
  }, [id, enrolledCourses]);

  const handleEnroll = () => {
    enrollInCourse(parseInt(id));
    setEnrolled(true); // Set enrolled state to true
  };

  if (!course || !userProfile) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const category = courseCategories.find(cat => cat.id === course.category);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <Header />
      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{category.icon}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {category.name}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-lg font-semibold mb-4">Duration: {course.duration}</p>

      {/* Enroll button */}
      {enrolled ? (
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
          disabled
        >
          Enrolled
        </button>
      ) : (
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleEnroll}
        >
          Enroll Now
        </button>
      )}

      <h3 className="text-2xl font-bold mt-8 mb-4">Course Outline</h3>
      <ul className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">Module {index + 1}</h4>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            {/* Project section for each module */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Project for Module {index + 1}</h4>
              <p className="text-gray-600 mb-2">Project description goes here. Students can submit their work.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Submit Project
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetail;
