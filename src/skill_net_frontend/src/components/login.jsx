import React, { useState, useEffect } from 'react';
import { UserCircle, ShieldCheck, Star, Smile, Heart, Coffee, Moon, Sun } from 'lucide-react';
// import { skill_net_backend } from '../../../declarations/skill_net_backend';
// import { useUser } from './services';

const UserRegistrationFlow = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [userType, setUserType] = useState('');
  const [moodStarter, setMoodStarter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: ''
  });

  const moodIcons = [
    { icon: <Smile className="w-12 h-12 text-yellow-500" />, text: "Feeling Awesome!" },
    { icon: <Heart className="w-12 h-12 text-red-500" />, text: "Ready to Grow" },
    { icon: <Coffee className="w-12 h-12 text-brown-500" />, text: "Energized Today" },
    { icon: <Moon className="w-12 h-12 text-indigo-500" />, text: "Calm & Focused" },
    { icon: <Sun className="w-12 h-12 text-orange-500" />, text: "Bright & Optimistic" }
  ];

  const userTypes = [
    { type: 'Normal', icon: <UserCircle className="w-12 h-12 text-blue-500" />, description: 'Standard User' },
    { type: 'Mentor', icon: <ShieldCheck className="w-12 h-12 text-green-500" />, description: 'Guidance Provider' },
    { type: 'Admin', icon: <Star className="w-12 h-12 text-purple-500" />, description: 'System Manager' }
  ];

  // useEffect(() => {
  //   // Simulated check for existing user
  //   const checkUserRegistration = async () => {
  //     // In real implementation, check Principal ID
  //     // const existingUser = skill_net_backend.getItem('userRegistered');
  //     if (existingUser) {
  //       setIsNewUser(false);
  //     }
  //   };
  //   checkUserRegistration();
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userRegistered', 'true');
    setIsNewUser(false);
  };

    // return (
    //   <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
    //     <div className="w-full max-w-md backdrop-blur-lg bg-white/30 border border-white/20 shadow-2xl rounded-2xl p-8 text-center">
    //       <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
    //       <div className="mb-6">
    //         <h3 className="text-xl mb-4">How are you feeling today?</h3>
    //         <div className="flex justify-center space-x-2">
    //           {moodIcons.map(({ icon, text }) => (
    //             <button 
    //               key={text}
    //               onClick={() => setMoodStarter(text)}
    //               className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 
    //                 ${moodStarter === text 
    //                   ? 'bg-white/50 ring-2 ring-blue-300 shadow-lg' 
    //                   : 'hover:bg-white/20 opacity-70'}`}
    //             >
    //               {icon}
    //               <span className="text-xs mt-1 text-gray-600">{text}</span>
    //             </button>
    //           ))}
    //         </div>
    //       </div>
    //       {moodStarter && (
    //         <button 
    //           onClick={() => {/* Navigate to dashboard */}}
    //           className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
    //         >
    //           Continue to Dashboard
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/30 border border-white/20 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Join Our Platform</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Select User Type</h3>
          <div className="flex justify-center space-x-4">
            {userTypes.map(({ type, icon, description }) => (
              <button 
                key={type}
                onClick={() => setUserType(type)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 
                  ${userType === type 
                    ? 'bg-white/50 ring-2 ring-blue-300 shadow-lg' 
                    : 'hover:bg-white/20 opacity-70'}`}
              >
                {icon}
                <span className="mt-2 font-medium text-gray-700">{type}</span>
                <span className="text-xs text-gray-500">{description}</span>
              </button>
            ))}
          </div>
        </div>

        {userType && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input 
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <textarea 
              name="bio"
              placeholder="Brief Bio"
              rows={3}
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            ></textarea>
            <input 
              type="text"
              name="location"
              placeholder="Location"
              className="w-full px-4 py-2 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            
            <button 
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserRegistrationFlow;