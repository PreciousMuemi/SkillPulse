import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skill_net_backend } from '../../../declarations/skill_net_backend';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const UserRegistrationFlow = () => {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { setUser } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    skills: [],
    role: ''
  });
  const [registrationError, setRegistrationError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError(null);

    // Validate form data
    if (!formData.name || !formData.email) {
      setRegistrationError('Please fill in all required fields');
      return;
    }

    try {
      // Prepare profile data for backend
      const profileData = {
        id: principal,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        skills: [], // Add skill selection logic
        role: formData.role,
      };

      // Call backend method to add user
      const result = await skill_net_backend.addUser(profileData);
      
      if (result.ok) {
        // Update user context
        await setUser(profileData);
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Handle backend validation errors
        setRegistrationError(result.err?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('An unexpected error occurred');
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/30 border border-white/20 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Join Our Platform</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Select User Type</h3>
          <div className="flex justify-center space-x-4">
            {userTypes.map(({ type, icon, description }) => (
              <button 
                key={type}
                onClick={() => handleUserTypeSelect(type)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 
                  ${userType === type 
                    ? 'bg-white/50 ring-2 ring-blue-300 shadow-lg' 
                    : 'hover:bg-white/20 opacity-70'}`}
              >
                {icon}
                <span className="mt-2 font-medium text-gray-700">{type}</span>
                <span className="text-xs text-gray-500">{description}</span>
              </button>
            ))}
          </div>
        </div>

        {userType && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {registrationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {registrationError}
              </div>
            )}

            <input 
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input 
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <textarea 
              name="bio"
              placeholder="Brief Bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            ></textarea>
            <input 
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            
            <button 
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserRegistrationFlow;
