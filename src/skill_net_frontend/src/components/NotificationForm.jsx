import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';

const NotificationSetupForm = () => {
  const [selectedNotifications, setSelectedNotifications] = useState({
    mentorshipMatch: false,
    skillEndorsement: false,
    achievements: false,
    projectInvites: false,
    messages: false
  });

  const handleToggle = (type) => {
    setSelectedNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#191970] via-[#1c1c5e] to-[#15155e] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 transition-all duration-500 hover:scale-[1.01]">
        <div className="flex items-center justify-center mb-6 animate-bounce">
          <Bell className="w-12 h-12 text-blue-300 mr-3" />
          <h2 className="text-3xl font-bold text-white">Notification Setup</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(selectedNotifications).map(([type, active]) => (
            <div 
              key={type} 
              className="flex items-center justify-between p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
            >
              <span className="text-white capitalize">
                {type.replace(/([A-Z])/g, ' $1')}
              </span>
              <button 
                onClick={() => handleToggle(type)}
                className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                  active ? 'bg-green-500' : 'bg-gray-500'
                } relative`}
              >
                <span 
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    active ? 'right-1' : 'right-7'
                  }`}
                />
              </button>
            </div>
          ))}
          <button 
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Check className="mr-2" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetupForm;