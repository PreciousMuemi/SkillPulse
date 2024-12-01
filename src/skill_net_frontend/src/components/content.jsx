import React, { useState, useEffect } from 'react';
import { Upload, XCircle, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const ContentCreation = () => {
  const { user, checkEligibility } = useUser();
  const [eligibility, setEligibility] = useState(null);

  const contentTypes = {
    'tutorial': { icon: '📚', minLevel: 2 },
    'showcase': { icon: '🎨', minLevel: 3 },
    'challenge': { icon: '🎯', minLevel: 4 }
  };

  const handleContentSubmit = async (content) => {
    try {
      const eligibilityCheck = await checkEligibility(content.type);
      if (!eligibilityCheck.canPost) {
        throw new Error(`Level ${eligibilityCheck.requiredLevel} required!`);
      }
      // Content submission logic
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Share Your Magic ✨
      </h2>
      
      {eligibility?.canPost ? (
        <div className="space-y-4">
          <select className="w-full p-3 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-200">
            {Object.entries(contentTypes).map(([type, info]) => (
              <option key={type} disabled={user.vibeStatus.level < info.minLevel}>
                {info.icon} {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <textarea 
            placeholder="Drop your knowledge here..."
            className="w-full p-4 rounded-xl border border-purple-100 h-32 focus:ring-2 focus:ring-purple-200"
          />
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all">
            Share with the Squad 🚀
          </button>
        </div>
      ) : (
        <div className="text-center p-6 bg-purple-50 rounded-xl">
          <p className="text-lg font-medium text-purple-600">
            Level up to unlock more content powers! 🎯
          </p>
          <p className="text-sm text-purple-400 mt-2">
            Next unlock at level {user.vibeStatus.level + 1}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentCreation;