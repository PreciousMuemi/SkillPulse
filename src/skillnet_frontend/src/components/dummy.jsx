// Dummy data for NFTGallery
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
  
  // Dummy data for LeaderBoard
  const generateDummyLeaderboard = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      username: `User${i + 1}`,
      level: Math.floor(Math.random() * 100) + 1,
      tokens: Math.floor(Math.random() * 10000),
    }));
  };
  
  // Dummy data for JobMarketplace
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
  
  // Dummy data for AchievementsPanel
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
  
  export { generateDummyNFTs, generateDummyLeaderboard, generateDummyJobs, generateDummyAchievements };