import React, { useState } from 'react';
import { Target, Layers, TrendingUp } from 'lucide-react';

const interests = {
  technologies: ['AI/ML', 'Web Development', 'Blockchain', 'Cloud Computing', 'Cybersecurity'],
  industries: ['Tech', 'Finance', 'Healthcare', 'Education', 'Startups'],
  learningStyles: ['Project-Based', 'Theory-Heavy', 'Mentorship', 'Self-Paced', 'Collaborative']
};

const UserInterestsForm = () => {
  const [selectedInterests, setSelectedInterests] = useState({
    technologies: [],
    industries: [],
    learningStyles: []
  });

  const [skillLevels, setSkillLevels] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0
  });

  const toggleInterest = (category, value) => {
    setSelectedInterests(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-center mb-6 animate-pulse">
          <Target className="w-12 h-12 text-blue-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Your Profile Insights</h2>
        </div>

        <div className="space-y-6">
          {Object.entries(interests).map(([category, options]) => (
            <div key={category} className="bg-white/10 p-4 rounded-xl">
              <h3 className="text-xl text-white mb-3 capitalize flex items-center">
                <Layers className="mr-2 text-blue-300" /> 
                {category.replace(/([A-Z])/g, ' $1')}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {options.map(option => (
                  <button
                    key={option}
                    onClick={() => toggleInterest(category, option)}
                    className={`p-2 rounded-lg text-sm transition-all ${
                      selectedInterests[category].includes(option)
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white/10 p-4 rounded-xl">
            <h3 className="text-xl text-white mb-3 flex items-center">
              <TrendingUp className="mr-2 text-green-300" /> 
              Skill Progression
            </h3>
            {Object.entries(skillLevels).map(([level, value]) => (
              <div key={level} className="flex items-center space-x-4 mb-2">
                <span className="text-white capitalize w-24">{level}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={value}
                  onChange={(e) => setSkillLevels(prev => ({...prev, [level]: e.target.value}))}
                  className="w-full h-2 bg-white/30 rounded-full appearance-none"
                />
                <span className="text-white w-8">{value}</span>
              </div>
            ))}
          </div>

          <button 
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInterestsForm;