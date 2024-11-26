import React, { useState } from 'react';
import { Actor } from '@dfinity/agent';

const MentorApplication = () => {
  const [formData, setFormData] = useState({
    qualifications: [''],
    specializations: [''],
    testScores: [{ subject: '', score: '' }],
    availability: [],
    yearsOfExperience: '',
    preferredTimezone: '',
    bio: ''
  });

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const addField = (fieldType) => {
    setFormData({
      ...formData,
      [fieldType]: [...formData[fieldType], '']
    });
  };

  const addTestScore = () => {
    setFormData({
      ...formData,
      testScores: [...formData.testScores, { subject: '', score: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const application = {
      submissionDate: Date.now(),
      qualifications: formData.qualifications.filter(q => q !== ''),
      specializations: formData.specializations.filter(s => s !== ''),
      testScores: formData.testScores
        .filter(t => t.subject !== '' && t.score !== '')
        .map(t => [t.subject, Number(t.score)]),
      status: "pending"
    };

    try {
      const response = await window.canister.applyForMentor(application);
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      // Handle error
    }
  };


    return (
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Mentor Application</h2>
        
        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Professional Background</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({
                  ...formData,
                  yearsOfExperience: e.target.value
                })}
                min="0"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                value={formData.bio}
                onChange={(e) => setFormData({
                  ...formData,
                  bio: e.target.value
                })}
                required
              />
            </div>
          </div>
        </section>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Qualifications Section */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Qualifications</h3>
            {/* ... qualification inputs with Tailwind styling ... */}
          </section>
  
          {/* Specializations Section */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Specializations</h3>
            {/* ... specialization inputs with Tailwind styling ... */}
          </section>
        </div>
  
        <button 
          type="submit" 
          className="w-full mt-8 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold text-lg"
        >
          Submit Application
        </button>
      </form>
    );
  };
  
export default MentorApplication;