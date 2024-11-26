import React, { useState, useEffect } from 'react';
import { MentorList } from './MentorList';
import { SkillSearch } from './SkillSearch';
import api from '../services/api';
import Header from './Header';
const MentorMenteeMatch = () => {

    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (skills) => {

        setLoading(true);
        try {
            const response = await api.requestMentorMatch(principal, skills);
            if (response.ok) {
                setMentors(response.data.recommended_mentors);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Find Your Mentor</h2>
            
                <>
                    <SkillSearch onSearch={handleSearch} />
                    {loading ? (
                        <div>Loading mentors...</div>
                    ) : (
                        <MentorList mentors={mentors} />
                    )}
                </>
        </div>
    );
};

export default MentorMenteeMatch;
