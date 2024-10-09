import React from 'react';
import MentorCard from './MentorCard';

const MentorshipPanel = ({ mentors }) => {
  return (
    <div className="bg-purple-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Available Mentors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </div>
  );
};

export default MentorshipPanel;