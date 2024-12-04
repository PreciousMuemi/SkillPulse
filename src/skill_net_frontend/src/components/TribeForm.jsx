import React, { useState } from 'react';
import { Users, Globe, Hash } from 'lucide-react';

const TribeCreationForm = () => {
  const [tribeDetails, setTribeDetails] = useState({
    name: '',
    description: '',
    members: []
  });

  const [memberInput, setMemberInput] = useState('');

  const addMember = () => {
    if (memberInput && !tribeDetails.members.includes(memberInput)) {
      setTribeDetails(prev => ({
        ...prev,
        members: [...prev.members, memberInput]
      }));
      setMemberInput('');
    }
  };

  const removeMember = (member) => {
    setTribeDetails(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== member)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-center mb-4 animate-pulse">
          <Globe className="w-12 h-12 text-indigo-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Create Tribe</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Users className="absolute left-3 top-3 text-indigo-300" />
            <input 
              type="text"
              placeholder="Tribe Name"
              value={tribeDetails.name}
              onChange={(e) => setTribeDetails(prev => ({...prev, name: e.target.value}))}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <textarea 
            placeholder="Tribe Description"
            value={tribeDetails.description}
            onChange={(e) => setTribeDetails(prev => ({...prev, description: e.target.value}))}
            rows={3}
            className="w-full px-4 py-2 bg-white/20 text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <div className="relative">
            <Hash className="absolute left-3 top-3 text-indigo-300" />
            <input 
              type="text"
              placeholder="Add Member (Principal ID)"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button 
              type="button"
              onClick={addMember}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>
          {tribeDetails.members.length > 0 && (
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 mb-2">Added Members:</p>
              <div className="flex flex-wrap gap-2">
                {tribeDetails.members.map(member => (
                  <div 
                    key={member} 
                    className="bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center space-x-2"
                  >
                    <span>{member}</span>
                    <button 
                      onClick={() => removeMember(member)}
                      className="text-white/70 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Create Tribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default TribeCreationForm;