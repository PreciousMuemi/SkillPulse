import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, CheckCircle, Zap } from 'lucide-react';
import Header from './Header';
const AchievementsPanel = ({ 
  achievements = [], 
  userProfile = {},
  completedCourses = [],
  mentorRating = 0
}) => {
  // Combine different achievement sources
  const generateAchievements = () => {
    const combinedAchievements = [
      // Badges from explicit achievements
      ...achievements,

      // Course Completion Achievements
      ...completedCourses.map((course, index) => ({
        id: `course-${index}`,
        name: `${course.title} Completed`,
        icon: <CheckCircle className="w-16 h-16 mx-auto mb-2 text-green-400" />,
        description: `Earned on ${course.completionDate}`,
        type: 'course'
      })),

      // Mentor Achievements
      ...(userProfile.isMentor ? [{
        id: 'mentor-achievement',
        name: 'Verified Mentor',
        icon: <Star className="w-16 h-16 mx-auto mb-2 text-yellow-400" />,
        description: `Rating: ${mentorRating}/5`,
        type: 'mentor'
      }] : []),

      // SKN Token Achievements
      ...(userProfile.sknTokens > 0 ? [{
        id: 'skn-token',
        name: 'SKN Token Holder',
        icon: <Zap className="w-16 h-16 mx-auto mb-2 text-blue-400" />,
        description: `${userProfile.sknTokens} Tokens Earned`,
        type: 'token'
      }] : [])
    ];

    return combinedAchievements;
  };

  const achievementsList = generateAchievements();

  return (
    <div>

    <Header />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#040622] p-6 rounded-2xl shadow-2xl border-2 border-purple-900/30"
    >
      <div className="flex items-center mb-6">
        <Award className="mr-4 text-purple-400" size={32} />
        <h2 className="text-3xl font-bold text-white">Your Achievements</h2>
      </div>

      {achievements.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-purple-300 py-8"
        >
          <p>No achievements yet. Keep learning and growing!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              className={`
                bg-purple-900/40 p-4 rounded-xl text-center 
                transform transition-all duration-300 
                hover:scale-105 hover:bg-purple-900/60
                border border-purple-800/50
                ${achievement.type === 'course' ? 'border-green-600/30' : ''}
                ${achievement.type === 'mentor' ? 'border-yellow-600/30' : ''}
                ${achievement.type === 'token' ? 'border-blue-600/30' : ''}
              `}
            >
              {typeof achievement.icon === 'string' ? (
                <img 
                  src={achievement.icon} 
                  alt={achievement.name} 
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
              ) : (
                achievement.icon
              )}
              <h3 className="font-semibold text-white mb-1">{achievement.name}</h3>
              <p className="text-sm text-purple-300">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
    </div>
  );
};

export default AchievementsPanel;