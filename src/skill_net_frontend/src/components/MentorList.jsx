import React from 'react';

export const MentorList = ({ mentors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {mentors.map((mentor) => (
                <div
                    key={mentor.userId.toString()}
                    className="p-6 border rounded-lg shadow-sm"
                >
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">
                                    {mentor.userId.toString().slice(0, 8)}...
                                </span>
                                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                    {mentor.experience_years} years experience
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mentor.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            Schedule Session
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const MentorCard = ({ mentor }) => (
    <div className="p-5 border rounded shadow-md">
        <h3 className="text-lg font-bold mb-2">
            {mentor.userId.toString().slice(0, 8)}...
        </h3>
        <p className="text-sm mb-1">Experience: {mentor.experience_years} years</p>
        <p className="text-sm mb-1">Rating: {mentor.rating}/5</p>
        <p className="text-sm mb-1">Availability: {mentor.availability.join(', ')}</p>
        <p className="text-sm mb-3">Timezone: {mentor.timezone}</p>
        <div className="flex flex-wrap gap-2">
            {mentor.skills.map((skill) => (
                <span
                    key={skill}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                >
                    {skill}
                </span>
            ))}
        </div>
    </div>
);
