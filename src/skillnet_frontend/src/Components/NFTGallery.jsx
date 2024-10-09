import React from 'react';
import { motion } from 'framer-motion';

const NFTGallery = ({ nfts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nfts.map((nft, index) => (
        <motion.div
          key={nft.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-purple-800 rounded-lg overflow-hidden shadow-lg"
        >
          <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
            <p className="text-sm text-purple-300">{nft.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NFTGallery;