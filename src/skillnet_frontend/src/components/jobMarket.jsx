import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';


const JobMarketplace = ({ icpActor }) => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      if (icpActor) {
        const fetchedJobs = await icpActor.getAllJobs();
        setJobs(fetchedJobs);
      }
    };
    fetchJobs();
  }, [icpActor]);
  return (
    <div className="bg-purple-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Job Marketplace</h2>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-purple-700 p-4 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <Briefcase className="mr-2" />
              <h3 className="text-lg font-semibold">{job.title}</h3>
            </div>
            <p className="text-sm text-purple-300 mb-2">{job.company}</p>
            <p className="text-sm mb-2">{job.location}</p>
            <p className="text-sm mb-4">{job.description}</p>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded">
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default JobMarketplace;