import React, { useState } from 'react';
import { BookOpen, FileText } from 'lucide-react';

const CreateCourseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    price: '',
    prerequisites: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const prereqs = formData.prerequisites.split(',').map(p => p.trim());
    // Submission logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <BookOpen className="w-12 h-12 text-blue-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Create Course</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea 
            placeholder="Course Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            rows={3}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input 
            type="text"
            placeholder="Instructor Name"
            value={formData.instructor}
            onChange={(e) => setFormData(prev => ({...prev, instructor: e.target.value}))}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
              className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input 
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
              className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <input 
            type="text"
            placeholder="Prerequisites (comma-separated)"
            value={formData.prerequisites}
            onChange={(e) => setFormData(prev => ({...prev, prerequisites: e.target.value}))}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;