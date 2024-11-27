import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Building2, CheckCircle2, XCircle } from 'lucide-react';
import Header from './Header';
// Kenyan cities for locations
const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 
  'Thika', 'Garissa', 'Machakos', 'Kitale', 'Nyeri'
];

const generateDetailedJobs = (count) => {
  const jobTitles = [
    'Senior Software Engineer', 'Data Analyst', 'Product Manager', 
    'UX/UI Designer', 'Marketing Specialist', 'Sales Representative',
    'Customer Success Manager', 'Business Analyst', 'HR Coordinator'
  ];

  const companies = [
    'Safaricom', 'M-Pesa', 'Equity Bank', 'Kenya Airways', 'KEMRI',
    'Jumia', 'Twiga Foods', 'Google Kenya', 'Microsoft Africa', 'IBM Nairobi'
  ];

  const jobDescriptions = [
    'We are seeking a talented professional to join our dynamic team. The ideal candidate will have strong problem-solving skills and experience in cutting-edge technologies.',
    'Responsible for analyzing complex data sets and providing actionable insights to drive business strategy and decision-making.',
    'Leading cross-functional teams to develop and launch innovative products that transform user experiences.',
    'Creating intuitive and visually stunning user interfaces that delight and engage our customers.',
    'Developing and implementing comprehensive marketing strategies to expand our market reach and brand awareness.'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    location: KENYAN_CITIES[Math.floor(Math.random() * KENYAN_CITIES.length)],
    description: jobDescriptions[Math.floor(Math.random() * jobDescriptions.length)],
    requirements: [
      '3-5 years of relevant experience',
      'Degree in related field',
      'Strong communication skills',
      'Proficiency in relevant technologies'
    ]
  }));
};

const ApplicationModal = ({ job, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resume: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-md border border-white/20 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <XCircle size={24} />
        </button>

        <h2 className="text-2xl text-white mb-6">Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <div>
            <label className="block text-white/70 mb-2">Upload Resume</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="w-full bg-white/10 text-white/70 p-3 rounded-lg border border-white/20 file:mr-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white file:px-4 file:py-2"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            Submit Application
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const JobMarketplace = ({ icpActor }) => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchedJobs = generateDetailedJobs(10);
    setJobs(fetchedJobs);
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleApplicationSubmit = (applicationData) => {
    if (!appliedJobs.some(appliedJob => appliedJob.id === selectedJob.id)) {
      setAppliedJobs([...appliedJobs, selectedJob]);
      
      // Simulate application submission
      console.log('Application submitted:', applicationData);
      alert(`Application for ${selectedJob.title} submitted successfully!`);
      
      setSelectedJob(null);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#0a173b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50, letterSpacing: '-0.1em' }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            letterSpacing: '0.1em',
            transition: { 
              duration: 0.8,
              type: 'spring',
              bounce: 0.3
            }
          }}
          className="text-4xl font-extralight text-center text-white mb-10 tracking-wide"
        >
          Job Marketplace
        </motion.h1>

        <div className="space-y-6">
          <AnimatePresence>
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    bounce: 0.4
                  }
                }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 20px rgba(255,255,255,0.1)',
                  transition: { duration: 0.2 }
                }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg relative overflow-hidden"
              >
                {/* Job Applied Indicator */}
                {appliedJobs.some(appliedJob => appliedJob.id === job.id) && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 text-green-400 flex items-center"
                  >
                    <CheckCircle2 size={20} className="mr-2" />
                    <span className="text-sm">Applied</span>
                  </motion.div>
                )}

                <div className="flex items-center mb-4">
                  <Briefcase className="text-white/70 mr-3" size={24} />
                  <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                </div>

                <div className="space-y-2 text-white/80 mb-4">
                  <div className="flex items-center">
                    <Building2 className="mr-2 text-white/60" size={16} />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-white/60" size={16} />
                    <span>{job.location}</span>
                  </div>
                </div>

                <p className="text-white/70 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="mb-4">
                  <h3 className="text-white/80 font-semibold mb-2">Requirements:</h3>
                  <ul className="text-white/60 text-sm list-disc pl-5">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  onClick={() => handleApplyClick(job)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={appliedJobs.some(appliedJob => appliedJob.id === job.id)}
                  className={`w-full py-2 rounded-lg 
                    transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-white/50
                    ${appliedJobs.some(appliedJob => appliedJob.id === job.id) 
                      ? 'bg-green-600/30 text-green-300 cursor-not-allowed' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  {appliedJobs.some(appliedJob => appliedJob.id === job.id) 
                    ? 'Applied' 
                    : 'Apply Now'}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedJob && (
            <ApplicationModal 
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onSubmit={handleApplicationSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};
export default JobMarketplace;