import React from 'react';
import { StarIcon } from '@heroicons/react/solid';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-purple-300 mb-4">{course.provider}</p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-400 mr-1">{course.rating}</span>
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-2 text-purple-300">({course.reviewCount} reviews)</span>
        </div>
        <p className="mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-purple-300">{course.duration}</span>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;