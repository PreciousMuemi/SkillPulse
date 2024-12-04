import React, { useState } from 'react';
import { Book, Calendar, Clock } from 'lucide-react';

const StudyJamForm = () => {
  const [jamDetails, setJamDetails] = useState({
    topic: '',
    duration: '',
    schedule: ''
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const studyTags = ['Programming', 'Data Science', 'Design', 'AI/ML', 'Web Dev'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-center mb-4 animate-pulse">
          <Book className="w-12 h-12 text-emerald-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Create Study Jam</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Book className="absolute left-3 top-3 text-emerald-300" />
            <input 
              type="text"
              placeholder="Study Jam Topic"
              value={jamDetails.topic}
              onChange={(e) => setJamDetails(prev => ({...prev, topic: e.target.value}))}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-emerald-300" />
              <input 
                type="text"
                placeholder="Duration"
                value={jamDetails.duration}
                onChange={(e) => setJamDetails(prev => ({...prev, duration: e.target.value}))}
                className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-emerald-300" />
              <input 
                type="text"
                placeholder="Schedule"
                value={jamDetails.schedule}
                onChange={(e) => setJamDetails(prev => ({...prev, schedule: e.target.value}))}
                className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>
          <div>
            <p className="text-white/70 mb-2">Select Study Jam Tags</p>
            <div className="flex flex-wrap gap-2">
              {studyTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag) 
                      : [...prev, tag]
                  )}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag) 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Create Study Jam
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyJamForm;