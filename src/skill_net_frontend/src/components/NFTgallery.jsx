import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Cpu, 
  Zap, 
  Star, 
  Trophy, 
  Globe, 
  Layers, 
  Rocket 
} from 'lucide-react';
import Header from './Header';
// Import local images
import NFT1 from '../images/NFT1.jpg';
import NFT2 from '../images/NFT2.jpg';
import NFT3 from '../images/nft3.jpg';

const NFTGallery = () => {
  const [nfts, setNFTs] = useState([
    {
      id: 1,
      title: "Full Stack Mastery",
      description: "Advanced Web Development Certification",
      category: "Web Development",
      skills: ["React", "Node.js", "TypeScript"],
      level: "Advanced",
      progress: 85,
      learnTime: "120 hours",
      imageUrl: NFT1  // Use imported local image
    },
    {
      id: 2,
      title: "Blockchain Foundations",
      description: "Comprehensive Blockchain Ecosystem",
      category: "Blockchain",
      skills: ["Solidity", "Smart Contracts", "Ethereum"],
      level: "Intermediate",
      progress: 75,
      learnTime: "90 hours",
      imageUrl: NFT2  // Use imported local image
    },
    {
      id: 3,
      title: "AI & Machine Learning",
      description: "Advanced AI Development Bootcamp",
      category: "Artificial Intelligence",
      skills: ["Python", "Machine Learning", "Neural Networks"],
      level: "Expert",
      progress: 95,
      learnTime: "160 hours",
      imageUrl: NFT3  // Use imported local image
    }
  ]);

  const CategoryBadge = ({ category }) => {
    const categoryColors = {
      "Web Development": "bg-blue-100 text-blue-800",
      "Blockchain": "bg-green-100 text-green-800",
      "Artificial Intelligence": "bg-purple-100 text-purple-800"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  const SkillProgress = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const NFTCard = ({ nft }) => (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <CategoryBadge category={nft.category} />
        </div>
        <img 
          src={nft.imageUrl} 
          alt={nft.title} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{nft.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{nft.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Learning Progress</span>
            <span>{nft.progress}%</span>
          </div>
          <SkillProgress progress={nft.progress} />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {nft.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <Cpu className="inline-block mr-1 text-blue-500" size={16} />
            {nft.learnTime}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>

    <Header />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Your NFTs()Non-fungible tokens,
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Unlock your potential through comprehensive, cutting-edge technology courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default NFTGallery;



// import React, { useState, useEffect } from 'react';
// import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
// import api from '../services/api';
// import { useAuth } from './AuthContext';
// import Header from './Header';

// const NFTCard = ({ nft }) => (
//   <div className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 p-4 border rounded-lg">
//     <div className="pb-2">
//       <h3 className="text-lg font-semibold text-primary truncate">
//         {nft.name || 'Unnamed NFT'}
//       </h3>
//     </div>
//     <div>
//       <p className="text-sm text-muted-foreground line-clamp-3">
//         {nft.description || 'No description available'}
//       </p>
//       <div className="flex justify-between items-center mt-2">
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             {
//               Common: 'bg-gray-100 text-gray-800',
//               Uncommon: 'bg-green-100 text-green-800',
//               Rare: 'bg-blue-100 text-blue-800',
//               Epic: 'bg-purple-100 text-purple-800',
//               Legendary: 'bg-orange-100 text-orange-800',
//             }[nft.rarity] || 'bg-gray-100 text-gray-800'
//           }`}
//         >
//           {nft.rarity || 'Unknown'}
//         </span>
//         <span className="text-sm text-muted-foreground">
//           {nft.courseName || 'Course info unavailable'}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// function NFTGallery() {
//   const [nfts, setNFTs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, loading: authLoading } = useAuth();

//   const fetchNFTs = async () => {
//     if (!user) {
//       setError('User not authenticated');
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       console.log('Fetching NFTs for user:', user?.id);
//       const userNFTs = await api.getUserNFTs(user.id);
//       setNFTs(userNFTs || []);
//     } catch (err) {
//       setError('Failed to fetch NFTs. Please try again later.');
//       console.error('NFT Fetch Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!authLoading) {
//       fetchNFTs();
//     }
//   }, [authLoading, user?.id]);

//   const handleRefresh = () => {
//     fetchNFTs();
//   };

//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin">
//           <RefreshCw className="w-8 h-8 text-primary" />
//         </div>
//         <p className="ml-2 text-muted-foreground">Authenticating...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Header />
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <Trophy className="w-8 h-8 text-primary" />
//             Your NFT Gallery
//           </h1>
//           <button
//             onClick={handleRefresh}
//             disabled={isLoading}
//             className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-100"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin">
//               <RefreshCw className="w-8 h-8 text-primary" />
//             </div>
//             <p className="ml-2 text-muted-foreground">Loading your NFTs...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-64 text-red-500">
//             <AlertCircle className="w-8 h-8 mr-2" />
//             <p>{error}</p>
//           </div>
//         ) : nfts.length === 0 ? (
//           <div className="text-center">
//             <p className="text-muted-foreground">
//               You have no NFTs. Start collecting!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {nfts.map((nft) => (
//               <NFTCard key={nft.id} nft={nft} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NFTGallery;
