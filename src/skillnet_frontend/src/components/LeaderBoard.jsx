import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, TrendingUp, BookOpen } from 'lucide-react';

// Dummy data generators
const generateDummyNFTs = (count) => {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const courseNames = ['Introduction to Blockchain', 'Smart Contract Development', 'Cryptography Basics', 'DeFi Fundamentals', 'NFT Creation'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `CryptoEdu NFT #${i + 1}`,
    description: `A unique NFT earned for mastering key concepts in blockchain and cryptocurrency.`,
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    courseName: courseNames[Math.floor(Math.random() * courseNames.length)],
  }));
};

const generateDummyLeaderboard = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: `User${i + 1}`,
    level: Math.floor(Math.random() * 100) + 1,
    tokens: Math.floor(Math.random() * 10000),
  }));
};

const generateDummyJobs = (count) => {
  const jobTitles = ['Blockchain Developer', 'Smart Contract Auditor', 'Crypto Analyst', 'DeFi Specialist', 'NFT Artist'];
  const companies = ['CryptoTech', 'BlockChain Inc.', 'DeFi Solutions', 'NFT Creations', 'Crypto Exchange'];
  const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'London, UK', 'Singapore'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    description: `We are seeking a talented professional to join our team and contribute to cutting-edge blockchain projects.`,
  }));
};

const generateDummyAchievements = (count) => {
  const achievementNames = ['Blockchain Beginner', 'Smart Contract Wizard', 'Crypto Trader', 'NFT Creator', 'DeFi Expert'];
  const descriptions = [
    'Completed the introduction to blockchain course',
    'Deployed your first smart contract',
    'Made your first successful crypto trade',
    'Created and minted your first NFT',
    'Participated in a DeFi liquidity pool'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: achievementNames[i % achievementNames.length],
    description: descriptions[i % descriptions.length],
    icon: `/api/placeholder/50/50?text=${encodeURIComponent(achievementNames[i % achievementNames.length])}`,
  }));
};

// Reusable components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${className}`}
  >
    {children}
  </button>
);

// NFTGallery Component
const NFTGallery = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedNFTs = generateDummyNFTs(12);
    setNFTs(fetchedNFTs);
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Your NFT Gallery</h2>
      {isLoading ? (
        <div className="text-center">
          <p className="text-xl">Loading your NFTs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.id} className="transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{nft.name}</h3>
              <div className="aspect-w-1 aspect-h-1 mb-4">
                <img 
                  src={`/api/placeholder/200/200?text=${encodeURIComponent(nft.name)}`}
                  alt={nft.name}
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-gray-600 mb-2">{nft.description}</p>
              <p className="text-sm font-semibold text-blue-600">Rarity: {nft.rarity}</p>
              <p className="text-sm text-gray-500">Earned from Course: {nft.courseName}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// LeaderBoard Component
const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const leaderboardData = generateDummyLeaderboard(20);
    setLeaderboard(leaderboardData);
    setIsLoading(false);
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Leaderboard</h2>
      {isLoading ? (
        <p className="text-center">Loading leaderboard...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.level}</td>
                  <td className="px-4 py-2">{user.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

// JobMarketplace Component
const JobMarketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedJobs = generateDummyJobs(10);
    setJobs(fetchedJobs);
    setIsLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Job Marketplace</h2>
      {isLoading ? (
        <p className="text-center">Loading jobs...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center mb-2">
                  <Briefcase className="mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                <p className="text-sm mb-2">{job.location}</p>
                <p className="text-sm mb-4">{job.description}</p>
                <Button>Apply Now</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// AchievementsPanel Component
const AchievementsPanel = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedAchievements = generateDummyAchievements(6);
    setAchievements(fetchedAchievements);
    setIsLoading(false);
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Achievements</h2>
      {isLoading ? (
        <p className="text-center">Loading achievements...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-100 p-4 rounded-lg text-center"
            >
              <img src={achievement.icon} alt={achievement.name} className="w-16 h-16 mx-auto mb-2" />
              <h3 className="font-semibold">{achievement.name}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

// Main App Component
const Components = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">CryptoEdu</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <NFTGallery />
          <div className="mt-10">
            <LeaderBoard />
          </div>
          <div className="mt-10">
            <JobMarketplace />
          </div>
          <div className="mt-10">
            <AchievementsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Components;