import React, { useState } from 'react';

export const SkillSearch = ({ onSearch }) => {
    const [skills, setSkills] = useState([]);
    const [input, setInput] = useState('');

    const handleAddSkill = () => {
        if (input.trim() && !skills.includes(input.trim())) {
            setSkills([...skills, input.trim()]);
            setInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="w-full">
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter skills..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => onSearch(skills)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                    Search Mentors
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <div
                        key={skill}
                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                    >
                        <span className="mr-2">{skill}</span>
                        <span className="text-sm font-bold">×</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
