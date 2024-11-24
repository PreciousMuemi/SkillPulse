import React, { useState, useEffect } from 'react';
import { MentorList } from './MentorList';
import { SkillSearch } from './SkillSearch';
import { useWallet } from './WalletConnection';
import api from '../services/api';

const MentorMenteeMatch = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isConnected, principal } = useWallet();

    const handleSearch = async (skills) => {
        if (!isConnected) {
            return;
        }

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
            
            {!isConnected ? (
                <div className="text-center">
                    <p>Connect your wallet to find mentors</p>
                </div>
            ) : (
                <>
                    <SkillSearch onSearch={handleSearch} />
                    {loading ? (
                        <div>Loading mentors...</div>
                    ) : (
                        <MentorList mentors={mentors} />
                    )}
                </>
            )}
        </div>
    );
};

export default MentorMenteeMatch;