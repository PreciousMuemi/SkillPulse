import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MentorApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    experience: '',
    availability: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement mentor application submission logic
    console.log('Submitting mentor application:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-purple-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Become a Mentor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded bg-purple-700 text-white"
        />
        <input
          type="text"
          placeholder="Area of Expertise"
          value={formData.expertise}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          className="w-full p-2 rounded bg-purple-700 text-white"
        />
        <textarea
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="w-full p-2 rounded bg-purple-700 text-white"
        />
        <input
          type="text"
          placeholder="Availability (hours per week)"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="w-full p-2 rounded bg-purple-700 text-white"
        />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded">
          Submit Application
        </button>
      </form>
    </motion.div>
  );
};

export default MentorApplication;