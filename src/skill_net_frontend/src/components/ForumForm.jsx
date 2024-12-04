import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const CreateForumForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <MessageCircle className="w-12 h-12 text-blue-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Create Forum</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            placeholder="Forum Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea 
            placeholder="Forum Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            rows={3}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Create Forum
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateForumForm;