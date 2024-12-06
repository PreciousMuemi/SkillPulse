import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Star, Award } from 'lucide-react';
import MentorQualificationSystem from './MentorQualification';
import MentorMatchResults from './MentorMatchResult'; // Import the new component
import { api } from '../services/api'; // Import API service
import { useAuth } from './AuthContext';
 
const MentorDiscovery = () => {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showQualificationSystem, setShowQualificationSystem] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    skills: '',
    availability: '',
    mentorshipStyle: '',
    location: ''
  });

  // Skill tags for filtering
  const SKILL_TAGS = [
    'JavaScript', 'React', 'Python', 'Machine Learning', 
    'AWS', 'Node.js', 'Data Analysis', 'DevOps'
  ];

  // Fetch mentor data from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await api.listMentors(); // Assuming you have this method in your API
        setMentors(data);
        setFilteredMentors(data);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  // Trigger mentor match
  const handleFindMentor = () => {
    // Prepare search criteria
    setSearchCriteria({
      skills: selectedSkills.join(','),
      availability: '', // Add from form if needed
      mentorshipStyle: '', // Add from form if needed
      location: '' // Add from form if needed
    });
    setShowMatchResults(true);
  };

  // Render Mentor Card (kept from original implementation)
  const MentorCard = ({ mentor }) => (
    <div className="bg-white/40 shadow-xl rounded-xl p-6 transform transition-all hover:scale-105 backdrop-blur-md border border-[#1E3A8A]/20">
      <div className="flex items-center mb-4">
        <img 
          src={mentor.imageUrl || '/default-avatar.png'} 
          alt={mentor.name} 
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-[#1E3A8A]">{mentor.name}</h3>
          <p className="text-gray-600">{mentor.role}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Star className="text-yellow-500 mr-2" size={20} />
          <span className="font-semibold">{mentor.rating} Rating</span>
        </div>
        <div className="flex items-center">
          <Award className="text-blue-500 mr-2" size={20} />
          <span>{mentor.experience} Years Experience</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-[#1E3A8A]">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {mentor.skills.map(skill => (
            <span 
              key={skill} 
              className="bg-[#1E3A8A] text-white px-2 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#16366C] transition">
        Book Session
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-4">Find Your Perfect Mentor</h1>
        <p className="text-gray-600">Connect with experienced professionals who can guide your learning journey.</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12 flex items-center justify-between">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search mentors by name or skill" 
            className="w-full p-4 pl-12 border-2 border-[#1E3A8A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1E3A8A]" />
        </div>

        {/* Skill Filter Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center bg-white border-2 border-[#1E3A8A] p-4 rounded-lg cursor-pointer"
            onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
          >
            <Filter className="mr-2 text-[#1E3A8A]" />
            <span className="text-[#1E3A8A]">Filter Skills</span>
          </div>
          {isSkillDropdownOpen && (
            <div className="absolute z-10 bg-white/40 shadow-lg rounded-lg p-6 w-64 mt-4 backdrop-blur-md border border-[#1E3A8A]/20">
              <div className="flex flex-wrap gap-3">
                {SKILL_TAGS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => 
                      setSelectedSkills(prev => 
                        prev.includes(skill) 
                        ? prev.filter(s => s !== skill) 
                        : [...prev, skill]
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      selectedSkills.includes(skill) 
                        ? 'bg-[#1E3A8A] text-white' 
                        : 'bg-gray-200 text-[#1E3A8A]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleFindMentor}
                className="mt-4 w-full bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#16366C] transition"
              >
                Find Mentors
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Match Results */}
      {showMatchResults && principal && (
        <MentorMatchResults 
          menteeId={principal} 
          searchCriteria={searchCriteria} 
          onClose={() => setShowMatchResults(false)}
        />
      )}

      {/* Become a Mentor Section */}
      <div className="mb-12 bg-[#1E3A8A] rounded-xl p-8 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Want to Become a Mentor?</h2>
          <p className="text-gray-200">Share your knowledge and help others grow in their learning journey.</p>
        </div>
        <button 
          onClick={() => setShowQualificationSystem(true)}
          className="bg-white text-[#1E3A8A] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Apply Now
        </button>
      </div>

      {/* Mentor Cards Grid */}
      {!showMatchResults && (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredMentors.map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}

      {/* Mentor Qualification System Modal */}
      {showQualificationSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-l w-[400px] max-h-[60vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowQualificationSystem(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
            <MentorQualificationSystem />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDiscovery;
