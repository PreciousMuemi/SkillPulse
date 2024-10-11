import React, { useState } from 'react';
import { becomeMentor, requestMentor } from '../services/api';
import { useAuth } from './AuthContext';
import Header from './Header';

function MentorMenteeMatch() {
  const [isMentor, setIsMentor] = useState(false);
  const [hasMentor, setHasMentor] = useState(false);
  const { isAuthenticated } = useAuth();

  async function handleBecomeMentor() {
    if (isAuthenticated) {
      const result = await becomeMentor();
      if (result.ok) {
        setIsMentor(true);
      } else {
        alert('Failed to become a mentor: ' + result.err);
      }
    }
  }

  async function handleRequestMentor() {
    if (isAuthenticated) {
      const result = await requestMentor();
      if (result.ok) {
        setHasMentor(true);
      } else {
        alert('Failed to request a mentor: ' + result.err);
      }
    }
  }

  if (!isAuthenticated) return <div>Please log in to use the mentor-mentee matching system.</div>;

  return (
    <div className="mentor-mentee-match">
        <Header />
      <h2>Mentor-Mentee Matching</h2>
      {!isMentor && !hasMentor && (
        <div>
          <button onClick={handleBecomeMentor}>Become a Mentor</button>
          <button onClick={handleRequestMentor}>Request a Mentor</button>
        </div>
      )}
      {isMentor && <p>You are now a mentor! Help others learn and grow.</p>}
      {hasMentor && <p>You have been matched with a mentor. Check your profile for details.</p>}
    </div>
  );
}

export default MentorMenteeMatch;