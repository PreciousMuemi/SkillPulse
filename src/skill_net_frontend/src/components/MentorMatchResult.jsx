import React, { useState, useEffect } from 'react';
import { api } from '../services/api';


const MentorMatchResults = ({ menteeId, searchCriteria }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorMatches();
  }, [searchCriteria]);

  const fetchMentorMatches = async () => {
    setLoading(true);
    try {
      const matchedMentors = await api.requestMentorMatch(
        menteeId,
        searchCriteria.skills,
        searchCriteria.availability,
        searchCriteria.mentorshipStyle,
        searchCriteria.location
      );
      setMentors(matchedMentors);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorId) => {
    try {
      await api.requestMentorship(mentorId);
      // Add success notification
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Mentor Matches
      </h2>
      
      {loading ? (
        <div className="text-center text-gray-500">Finding your perfect mentors...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : mentors.length === 0 ? (
        <div className="text-gray-500 text-center">
          No mentors found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div 
              key={mentor.userId} 
              className="border rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={mentor.profile.avatar || '/default-avatar.png'} 
                  alt={mentor.profile.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{mentor.profile.name}</h3>
                  <p className="text-gray-500">{mentor.profile.mentorType}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.profile.skills.map((skill) => (
                    <span 
                      key={skill.name} 
                      className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleRequestMentorship(mentor.userId)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Request Mentorship
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={fetchMentorMatches}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Refresh Matches
        </button>
        <div className="text-gray-500">
          {mentors.length} mentors found
        </div>
      </div>
    </div>
  );
};

export default MentorMatchResults;
