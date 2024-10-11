import React, { useState, useEffect } from 'react';
import { getUserNFTs } from '../services/api';
import { useAuth } from './AuthContext';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const NFTCard = ({ nft }) => (
  <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <h3 className="text-xl font-bold mb-2 text-[#16423C]">{nft.name}</h3>
    <div className="aspect-w-1 aspect-h-1 mb-4">
      <img 
        src={`/api/placeholder/200/200?text=${encodeURIComponent(nft.name)}`}
        alt={nft.name}
        className="object-cover rounded-lg"
      />
    </div>
    <p className="text-gray-600 mb-2">{nft.description}</p>
    <p className="text-sm font-semibold text-[#6A9C89]">Rarity: {nft.rarity}</p>
    <p className="text-sm text-gray-500">Earned from Course: {nft.courseName}</p>
  </Card>
);

// Function to generate dummy NFT data
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

function NFTGallery() {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchNFTs() {
      if (isAuthenticated) {
        setIsLoading(true);
        setError(null);
        try {
          // For demonstration, we'll use dummy data instead of actual API call
          // const userNFTs = await getUserNFTs();
          const userNFTs = generateDummyNFTs(12); // Generate 12 dummy NFTs
          setNFTs(userNFTs);
        } catch (err) {
          setError('Failed to fetch NFTs. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchNFTs();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#6A9C89]">
        <Card>
          <p className="text-[#16423C] font-semibold">Please log in to view your NFT gallery.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16423C] to-[#6A9C89] text-white">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Your NFT Gallery</h2>
        {isLoading ? (
          <div className="text-center">
            <p className="text-xl">Loading your NFTs...</p>
          </div>
        ) : error ? (
          <Card className="text-center text-red-600">{error}</Card>
        ) : nfts.length === 0 ? (
          <Card className="text-center">
            <p className="text-[#16423C] font-semibold">You haven't earned any NFTs yet. Complete courses to earn NFTs!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTGallery;