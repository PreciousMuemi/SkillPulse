import React, { useState } from 'react';
// import { useUser } from '../context/UserContext'; // Assuming you have a UserContext

const UserProfile = () => {
  const { user, updateUserVibe } = useUser();
  const [contentStats, setContentStats] = useState({
    posts: [],
    engagement: 0,
    streak: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img 
                src={user.profilePic} 
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all"
              />
              <span className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full text-white text-xs">
                {user.vibeStatus.level}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user.displayName}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.vibeStatus.mood} • {user.streak} Day Streak 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            { label: 'Content Score', value: user.contentScore, icon: '🎯' },
            { label: 'Tribe Members', value: user.tribe.length, icon: '👥' },
            { label: 'Achievements', value: user.achievements.length, icon: '🏆' }
          ].map(stat => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-gray-600">{stat.label}</div>
              <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;