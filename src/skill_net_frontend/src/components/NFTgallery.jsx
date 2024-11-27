import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import Header from './Header';

const NFTCard = ({ nft }) => (
  <div className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 p-4 border rounded-lg">
    <div className="pb-2">
      <h3 className="text-lg font-semibold text-primary truncate">
        {nft.name || 'Unnamed NFT'}
      </h3>
    </div>
    <div>
      <p className="text-sm text-muted-foreground line-clamp-3">
        {nft.description || 'No description available'}
      </p>
      <div className="flex justify-between items-center mt-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            {
              Common: 'bg-gray-100 text-gray-800',
              Uncommon: 'bg-green-100 text-green-800',
              Rare: 'bg-blue-100 text-blue-800',
              Epic: 'bg-purple-100 text-purple-800',
              Legendary: 'bg-orange-100 text-orange-800',
            }[nft.rarity] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {nft.rarity || 'Unknown'}
        </span>
        <span className="text-sm text-muted-foreground">
          {nft.courseName || 'Course info unavailable'}
        </span>
      </div>
    </div>
  </div>
);

function NFTGallery() {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const fetchNFTs = async () => {
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching NFTs for user:', user?.id);
      const userNFTs = await api.getUserNFTs(user.id);
      setNFTs(userNFTs || []);
    } catch (err) {
      setError('Failed to fetch NFTs. Please try again later.');
      console.error('NFT Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchNFTs();
    }
  }, [authLoading, user?.id]);

  const handleRefresh = () => {
    fetchNFTs();
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
        <p className="ml-2 text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Your NFT Gallery
          </h1>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <p className="ml-2 text-muted-foreground">Loading your NFTs...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <AlertCircle className="w-8 h-8 mr-2" />
            <p>{error}</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">
              You have no NFTs. Start collecting!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
