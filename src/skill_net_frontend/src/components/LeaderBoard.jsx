import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import Card from '../components/card'; // Adjust the path if necessary

import Button from '../components/Button'; 
import Header from './Header';

// Enhanced LeaderBoard Component
export const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const leaderboardData = generateDummyLeaderboard(20);
    setLeaderboard(leaderboardData);
    setIsLoading(false);
  }, []);

  return (
    <div>

    <Header />
    <div className="bg-	#040622 py-12">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Leaderboard</h2>
        
        {isLoading ? (
          <div className="text-center text-lg text-gray-500">Loading leaderboard...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Level</th>
                  <th className="px-6 py-3 text-left">Tokens</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">{user.level}</td>
                    <td className="px-6 py-4 text-gray-600">{user.tokens}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

// Dummy data generator function
const generateDummyLeaderboard = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: `User${i + 1}`,
    level: Math.floor(Math.random() * 100) + 1,
    tokens: Math.floor(Math.random() * 10000),
  }));
};
export default LeaderBoard;


