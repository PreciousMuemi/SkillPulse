import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

const AchievementsPanel = ({ achievements = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-purple-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-purple-700 p-4 rounded-lg text-center"
          >
            <img src={achievement.icon} alt={achievement.name} className="w-16 h-16 mx-auto mb-2" />
            <h3 className="font-semibold">{achievement.name}</h3>
            <p className="text-sm text-purple-300">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsPanel;
