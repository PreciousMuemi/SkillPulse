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

const MentorMenteeMatch = () => {
  const [isMentor, setIsMentor] = useState(false);
  const [hasMentor, setHasMentor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Fetch user's current mentor/mentee status here
  }, []);

  const handleAction = async (action) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await action();
      if (result.ok) {
        action === becomeMentor ? setIsMentor(true) : setHasMentor(true);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('You are [eligible to become a mentor.');

      setIsLoading(false);
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
    <><Header /><div className="min-h-screen bg-gradient-to-br from-[#16423C] to-[#6A9C89] flex items-center justify-center p-4">
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
    </div></>
  );
};
}

export default MentorMenteeMatch;
