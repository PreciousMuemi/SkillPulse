import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [principalId, setPrincipalId] = useState(null);

  const [userDetails] = useState({
    name: 'Lucia Alvarez',
    profession: 'Photographer',
    age: 29,
    education: 'B.A. in Photography',
    location: 'New York, USA',
  });

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setTimeOfDay('Good Morning');
    } else if (hours < 18) {
      setTimeOfDay('Good Afternoon');
    } else {
      setTimeOfDay('Good Evening');
    }
  }, []);

  // Function to connect to Plug Wallet
  const connectPlugWallet = async () => {
    try {
      const isConnected = await window.ic.plug.requestConnect();
      if (isConnected) {
        setWalletConnected(true);

        const principal = await window.ic.plug.sessionManager.getPrincipal();
        setPrincipalId(principal.toText());
      }
    } catch (error) {
      console.error('Error connecting to Plug Wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 flex justify-center items-center p-6">
      <div className="rounded-xl shadow-lg p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - User Details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder image, replace with actual image
            alt="User profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold">{userDetails.name}</h1>
          <p className="text-gray-500">{userDetails.profession}</p>

          <div className="mt-6 space-y-2">
            <p className="text-gray-700">
              <strong>Age:</strong> {userDetails.age}
            </p>
            <p className="text-gray-700">
              <strong>Education:</strong> {userDetails.education}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {userDetails.location}
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mt-8">
            {!walletConnected ? (
              <button
                onClick={connectPlugWallet}
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                Connect Plug Wallet
              </button>
            ) : (
              <div className="text-green-600">
                <p>Wallet Connected</p>
                <p className="text-sm text-gray-500">Principal ID: {principalId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Bio, Goals, etc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-bold mb-2">Bio</h3>
            <p className="text-gray-600">A passionate photographer with a love for capturing moments and telling stories through images.</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-bold mb-2">Goals</h3>
            <p className="text-gray-600">To build a globally recognized photography brand and work with international clients.</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-bold mb-2">Motivations</h3>
            <p className="text-gray-600">Driven by the ability to freeze moments and preserve memories that last a lifetime.</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-bold mb-2">Concerns</h3>
            <p className="text-gray-600">Navigating the challenges of running a business while maintaining creative passion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
