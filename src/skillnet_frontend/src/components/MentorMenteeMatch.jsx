import React, { useState, useEffect } from 'react';
import { becomeMentor, requestMentor } from '../services/api';
import { useAuth } from './AuthContext';
import Header from './Header';

const Button = ({ onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
    {children}
  </div>
);

const Alert = ({ variant, children }) => (
  <div className={`p-4 rounded-lg mb-4 ${variant === 'error' ? 'bg-red-100 text-red-800' : 'bg-[#6A9C89] text-white'}`}>
    {children}
  </div>
);

const Popup = ({ isOpen, onClose }) => (
  isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="font-bold mb-2">Mentor Eligibility Criteria</h3>
        <p>The mentor must have completed the advanced course and received their credentials and star rating.</p>
        <Button onClick={onClose} className="bg-[#16423C] hover:bg-[#0f2b27] w-full">
          Close
        </Button>
      </div>
    </div>
  ) : null
);

const MentorMenteeMatch = () => {
  const [isMentor, setIsMentor] = useState(false);
  const [hasMentor, setHasMentor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMentorStatus = async () => {
      try {
        const status = await getUserMentorStatus();
        setIsMentor(status.is_mentor);
        setHasMentor(status.has_mentor);
      } catch (err) {
        setError('Failed to fetch mentor status');
      }
    };

    if (isAuthenticated) {
      fetchMentorStatus();
    }
  }, [isAuthenticated]);

  const handleAction = async (action) => {
    setIsLoading(true);
    setError(null);
    try {
      if (action === becomeMentor) {
        const result = await becomeMentor();
        setIsMentor(true);
      } else {
        // For requesting a mentor, include desired skills
        const desiredSkills = ['python', 'javascript']; // You can make this dynamic
        const result = await matchMentor(userId, desiredSkills);
        if (result.recommended_mentors.length > 0) {
          setHasMentor(true);
        } else {
          setError('No suitable mentors found at this time');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#6A9C89]">
        <Alert variant="error">
          <h3 className="font-bold mb-2">Authentication Required</h3>
          <p>Please log in to use the mentor-mentee matching system.</p>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#16423C] to-[#6A9C89] flex items-center justify-center p-4">
        <Card>
          <h2 className="text-3xl font-bold text-center mb-8 text-[#16423C]">Mentor-Mentee Matching</h2>
          {error && (
            <Alert variant="error">
              <p>{error}</p>
            </Alert>
          )}
          {!isMentor && !hasMentor && (
            <div className="space-y-4">
              <Button
                onClick={() => handleAction(becomeMentor)}
                disabled={isLoading}
                className="bg-[#16423C] hover:bg-[#0f2b27] w-full"
              >
                {isLoading ? 'Processing...' : 'Become a Mentor'}
              </Button>
              <Button
                onClick={() => handleAction(requestMentor)}
                disabled={isLoading}
                className="bg-[#6A9C89] hover:bg-[#5a8b79] w-full"
              >
                {isLoading ? 'Processing...' : 'Request a Mentor'}
              </Button>
              <Button
                onClick={() => setShowPopup(true)}
                className="bg-[#FFD700] hover:bg-[#FFC300] w-full"
              >
                View Mentor Eligibility
              </Button>
            </div>
          )}
          {(isMentor || hasMentor) && (
            <Alert variant="success">
              <h3 className="font-bold mb-2">
                {isMentor ? 'You are now a mentor!' : 'You have a mentor!'}
              </h3>
              <p>
                {isMentor
                  ? 'Help others learn and grow. Check your dashboard for mentee assignments.'
                  : 'You have been matched with a mentor. Check your profile for details.'}
              </p>
            </Alert>
          )}
        </Card>
      </div>
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
};

export default MentorMenteeMatch;
