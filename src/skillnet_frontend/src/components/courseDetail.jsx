import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseDetail = ({ backendActor }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('Not Enrolled');

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    // Implement this function to fetch course details from the backend
    // const result = await backendActor.getCourseDetail(id);
    // setCourse(result);
  };

  const handleEnroll = async () => {
    // Implement this function to enroll the user in the course
    // const result = await backendActor.enrollInCourse(id);
    // if (result.ok) {
    //   setEnrollmentStatus('Enrolled');
    // }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">{course.title}</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>{course.description}</p>
                <ul className="list-disc space-y-2">
                  <li>Difficulty: {course.difficulty}</li>
                  <li>Duration: {course.duration}</li>
                  <li>Reward: {course.tokenReward} SKN</li>
                </ul>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Your progress: {enrollmentStatus}</p>
                {enrollmentStatus === 'Not Enrolled' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnroll}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Enroll Now
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;