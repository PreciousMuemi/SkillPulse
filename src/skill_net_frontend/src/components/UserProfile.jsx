import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import { useUser } from './UserContext';
import api from '../services/api';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    principal: '',
    xp: 0,
    skills: [],
    mentorStatus: '',
    certifications: []
  });
  const [completedCourses, setCompletedCourses] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserAchievements();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userInfo = await api.getUser();
      setProfile(userInfo.principal, userInfo.xp, userInfo.skills, userInfo.mentorStatus, userInfo.certifications);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const userNFTs = await api.getUserNFTs();
      setBadges(userNFTs);
      
      const courses = await api.listCourses();
      const completed = courses.filter(course => course.status === 'completed');
      setCompletedCourses(completed);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Header />
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Principal ID</h3>
            <p className="text-gray-600">{profile.principal}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Experience Points</h3>
            <p className="text-gray-600">{profile.xp} XP</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Mentor Status</h3>
            <p className="text-gray-600">{profile.mentorStatus}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Completed Courses</h3>
        <div className="grid grid-cols-2 gap-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium">{course.title}</h4>
              <p className="text-sm text-gray-600">Completed on: {course.completionDate}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Badges Earned</h3>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="text-center">
              <div className="w-16 h-16 mx-auto mb-2">
                <img src={badge.image} alt={badge.name} className="w-full h-full object-contain" />
              </div>
              <p className="text-sm font-medium">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
