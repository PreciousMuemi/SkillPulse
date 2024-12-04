import React, { useState } from 'react';
import { Hand, Filter, Zap, Clock, MapPin } from 'lucide-react';
import api from "../services/api";


import BACKGROUND_IMAGE from '../images/bg.jpg';
const MentorshipMatchForm = () => {
  const [matchCriteria, setMatchCriteria] = useState({
    menteeId: '',
    skills: '',
    skillLevel: 'beginner',
    availability: [],
    mentorshipStyle: '',
    location: '',
    timezone: '',
    goals: ''
  });

  const [isMatching, setIsMatching] = useState(false);
  const [mentorMatch, setMentorMatch] = useState(null);
  const [error, setError] = useState(null);

  const timeSlots = [
    'Monday Morning', 'Monday Evening',
    'Tuesday Morning', 'Tuesday Evening',
    'Wednesday Morning', 'Wednesday Evening',
    'Thursday Morning', 'Thursday Evening',
    'Friday Morning', 'Friday Evening',
    'Saturday', 'Sunday'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatchCriteria((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (slot) => {
    setMatchCriteria((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsMatching(true);

    try {
    
      const response = await api.requestMentorMatch(
        matchCriteria.menteeId,
        matchCriteria.skills,
        matchCriteria.skillLevel,
        matchCriteria.availability,
        matchCriteria.mentorshipStyle,
        matchCriteria.location,
      ) 
      //   setTimeout(() => {
      //     resolve("Expert Mentor in React and JavaScript Available");
      //   }, 1500);
      // });
      setMentorMatch(response);
      setIsMatching(false);
    } catch (error) {
      setError('Failed to fetch mentor matches. Please try again later.');
      console.error('Error finding mentor:', error.message);
      setIsMatching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: `url(${BACKGROUND_IMAGE})`, 
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg overflow-y-auto">
        <div className="container mx-auto px-4 py-12 relative max-w-6xl"></div>
      <div className="min-h-screen bg-image flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="flex items-center justify-center mb-6 animate-pulse">
          <Hand className="w-12 h-12 text-blue-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Mentorship Match</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm mb-4">
              {error}
            </div>
          )}
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-blue-300" />
            <input 
              type="text"
              name="skills"
              placeholder="e.g., JavaScript, React, Python"
              value={matchCriteria.skills}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <Zap className="absolute left-3 top-3 text-yellow-300" />
            <select
              name="skillLevel"
              value={matchCriteria.skillLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="relative">
            <select 
              name="mentorshipStyle"
              value={matchCriteria.mentorshipStyle}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Mentorship Style</option>
              <option value="hands-on">Hands-on</option>
              <option value="guided">Guided Learning</option>
              <option value="collaborative">Collaborative</option>
            </select>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Clock className="mr-2 text-blue-300" />
              <label className="text-sm font-medium text-white">Availability</label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <label 
                  key={slot} 
                  className="flex items-center space-x-2 text-white text-sm"
                >
                  <input
                    type="checkbox"
                    checked={matchCriteria.availability.includes(slot)}
                    onChange={() => handleAvailabilityChange(slot)}
                    className="rounded bg-white/20 border-white/30"
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-green-300" />
            <input
              type="text"
              name="timezone"
              placeholder="Timezone (e.g., UTC+1, EST)"
              value={matchCriteria.timezone}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-purple-300" />
            <input
              type="text"
              name="location"
              placeholder="Current Location"
              value={matchCriteria.location}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <textarea 
            name="goals"
            placeholder="Career/Learning Goals"
            value={matchCriteria.goals}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button 
            type="submit"
            disabled={isMatching}
            className={`w-full py-3 rounded-xl transition-all duration-300 ${
              isMatching 
                ? 'bg-blue-800 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isMatching ? 'Matching...' : 'Find Mentor Match'}
          </button>

          {mentorMatch && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <h3 className="text-white font-semibold mb-2">Mentor Matched:</h3>
              <p className="text-white">{mentorMatch}</p>
            </div>
          )}
        </form>
      </div>
      </div>
      </div>
    </div>
  );
};

export default MentorshipMatchForm;