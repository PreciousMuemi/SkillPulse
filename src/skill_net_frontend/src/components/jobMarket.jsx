import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Building2, CheckCircle2 } from 'lucide-react';

// Kenyan cities for locations
const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 
  'Thika', 'Garissa', 'Machakos', 'Kitale', 'Nyeri'
];

const generateDummyJobs = (count) => {
  const jobTitles = [
    'Software Engineer', 'Data Analyst', 'Product Manager', 
    'UX Designer', 'Marketing Specialist', 'Sales Representative',
    'Customer Success Manager', 'Business Analyst', 'HR Coordinator'
  ];

  const companies = [
    'Safaricom', 'M-Pesa', 'Equity Bank', 'Kenya Airways', 'KEMRI',
    'Jumia', 'Twiga Foods', 'Google Kenya', 'Microsoft Africa', 'IBM Nairobi'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
    company: companies[Math.floor(Math.random() * companies.length)],
    location: KENYAN_CITIES[Math.floor(Math.random() * KENYAN_CITIES.length)],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }));
};

const JobMarketplace = ({ icpActor }) => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchedJobs = generateDummyJobs(10);
    setJobs(fetchedJobs);
  }, []);

  const handleApplyClick = (job) => {
    // Dummy logic for job application
    if (!appliedJobs.some(appliedJob => appliedJob.id === job.id)) {
      setAppliedJobs([...appliedJobs, job]);
      
      // Simulate application process
      setTimeout(() => {
        alert(`Application submitted for ${job.title} at ${job.company}!`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a173b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 20px rgba(255,255,255,0.1)',
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 
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
      </div>
    </div>
  );
};

export default JobMarketplace;