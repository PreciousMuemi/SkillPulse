import React from 'react';
import { Star } from 'lucide-react';

const MentorCard = ({ mentor }) => {
  return (
    <div className="bg-purple-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">{mentor.name}</h3>
      <p className="text-sm text-purple-300 mb-2">{mentor.expertise}</p>
      <p className="mb-2">Experience: {mentor.experience} years</p>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={i < mentor.rating ? 'text-yellow-400' : 'text-gray-400'}
          />
        ))}
        <span className="ml-2">{mentor.rating.toFixed(1)}</span>
      </div>
      <button className="mt-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">
        Request Mentorship
      </button>
    </div>
  );
};

export default MentorCard;