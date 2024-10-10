import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserProfile = ({ backendActor }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    // Fetch user profile from the backend
    // const result = await backendActor.getUserProfile();
    // setUserProfile(result);
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
              <img 
                src="/profile-placeholder.png" 
                alt="Profile" 
                className="w-24 h-24 rounded-full mt-4"
              />
            </div>
            <div className="divide-y divide-gray-200 mt-6">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p><strong>Username:</strong> {userProfile.username}</p>
                <p><strong>Level:</strong> {userProfile.level}</p>
                <p><strong>XP:</strong> {userProfile.xp}</p>
                <p><strong>Wallet Balance:</strong> {userProfile.tokenBalance} SKN</p>
                <div>
                  <strong>Skills:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {userProfile.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Completed Courses:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {userProfile.completedCourses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Your Progress</p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(userProfile.xp % 100) / 100 * 100}%` }}
                      transition={{ duration: 1 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    />
                  </div>
                </div>
              </div>
              <button 
                className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
