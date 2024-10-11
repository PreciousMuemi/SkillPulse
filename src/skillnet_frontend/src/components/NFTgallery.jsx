import React, { useState, useEffect } from 'react';
import { getUserNFTs } from '../services/api';
import { useAuth } from './AuthContext';
import Header from './Header';

function NFTGallery() {
  const [nfts, setNFTs] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchNFTs() {
      if (isAuthenticated) {
        const userNFTs = await getUserNFTs();
        setNFTs(userNFTs);
      }
    }
    fetchNFTs();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div>Please log in to view your NFT gallery.</div>;

  return (
    <div className="nft-gallery">
      <Header />
      <h2>Your NFT Gallery</h2>
      {nfts.length === 0 ? (
        <p>You haven't earned any NFTs yet. Complete courses to earn NFTs!</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-item">
              <h3>{nft.name}</h3>
              <p>{nft.description}</p>
              <p>Rarity: {nft.rarity}</p>
              <p>Earned from Course ID: {nft.courseId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTGallery;