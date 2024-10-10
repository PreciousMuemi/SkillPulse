import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-8"
      >
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to SkillNet
        </h1>
        <p className="text-2xl text-white mb-10 max-w-2xl mx-auto drop-shadow-md">
          Unlock your potential with a decentralized, AI-driven learning platform. 
          Earn skills, get certified, and connect with mentors globally.
        </p>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#34D399' }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          className="bg-white text-green-600 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-gray-100 transition duration-300"
        >
          Get Started with Internet Identity
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
