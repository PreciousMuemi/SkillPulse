import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Star, Award } from 'lucide-react';
import MentorQualificationSystem from './MentorQualification';

// Mock Mentor Data (replace with actual backend data later)
const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Alex Rodriguez',
    role: 'Senior Software Engineer',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 8,
    rating: 4.8,
    specialties: ['Web Development', 'Frontend Architecture'],
    availability: 'Part-time',
    imageUrl: '/api/placeholder/200/200'
  },
  {
    id: 2,
    name: 'Sarah Kim',
    role: 'Data Science Lead',
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    experience: 6,
    rating: 4.9,
    specialties: ['AI', 'Data Visualization'],
    availability: 'Full-time',
    imageUrl: '/api/placeholder/200/200'
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Cloud Solutions Architect',
    skills: ['AWS', 'Kubernetes', 'DevOps'],
    experience: 10,
    rating: 4.7,
    specialties: ['Cloud Infrastructure', 'Scalability'],
    availability: 'Part-time',
    imageUrl: '/api/placeholder/200/200'
  }
];

const MentorDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState(MOCK_MENTORS);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showQualificationSystem, setShowQualificationSystem] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false); // Initialize to false

  // Skill tags for filtering
  const SKILL_TAGS = [
    'JavaScript', 'React', 'Python', 'Machine Learning', 
    'AWS', 'Node.js', 'Data Analysis', 'DevOps'
  ];

  // Filter mentors based on search and selected skills
  const filterMentors = () => {
    return MOCK_MENTORS.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.every(skill => mentor.skills.includes(skill));
      
      return matchesSearch && matchesSkills;
    });
  };

  // Update filtered mentors when search or skills change
  useEffect(() => {
    setFilteredMentors(filterMentors());
  }, [searchQuery, selectedSkills]);

  // Render Mentor Card
  const MentorCard = ({ mentor }) => (
    <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-xl">
      <div className="flex items-center mb-4">
        <img 
          src={mentor.imageUrl} 
          alt={mentor.name} 
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{mentor.name}</h3>
          <p className="text-gray-500">{mentor.role}</p>
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
        <h4 className="font-semibold mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {mentor.skills.map(skill => (
            <span 
              key={skill} 
              className="bg-[#00001C] text-white px-2 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full bg-[#00001C] text-white py-2 rounded-lg hover:bg-gray-800 transition">
      Book Session
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Mentorship Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#00001C] mb-4">Find Your Perfect Mentor</h1>
        <p className="text-gray-600">Connect with experienced professionals who can guide your learning journey.</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12 flex items-center justify-between">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search mentors by name or skill" 
            className="w-full p-4 pl-12 border-2 border-[#00001C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00001C]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00001C]" />
        </div>

        {/* Skill Filter Dropdown */}
        <div className="relative">
        <div 
            className="flex items-center bg-white border-2 border-[#00001C] p-4 rounded-lg cursor-pointer"
            onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
          >
              <Filter className="mr-2 text-[#00001C]" />
              <span className="text-[#00001C]">Filter Skills</span>
            </div>
            {isSkillDropdownOpen && (
                <div className=" absolute z-10 bg-white shadow-lg rounded-lg p-6 w-64 mt-4">
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
                            ? 'bg-[#00001C] text-white' 
                            : 'bg-gray-200 text-[#00001C]'
                        }`}
                    >
                        {skill}
                    </button>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      

      {/* Become a Mentor Section */}
      <div className="mb-12 bg-[#00001C] rounded-xl p-8 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Want to Become a Mentor?</h2>
          <p className="text-gray-300">Share your knowledge and help others grow in their learning journey.</p>
        </div>
        <button 
          onClick={() => setShowQualificationSystem(true)}
          className="bg-white text-[#00001C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Apply Now
        </button>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredMentors.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>

      {/* Mentor Qualification System Modal */}
      {showQualificationSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-l w-[400px] max-h-[60vh]  overflow-y-auto relative">
            <button 
              onClick={() => setShowQualificationSystem(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              {/* <size={24} /> */}
            </button>
            <MentorQualificationSystem />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDiscovery;