import React, { useState } from 'react';
import { skill_net_backend } from '../../../declarations/skill_net_backend';

const MentorRequestForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    skillLevel: 'beginner',
    availability: [],
    timezone: '',
    goals: '',
    preferredLanguage: '',
    commitment: '',
    projectIdeas: ''
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    'Monday Morning', 'Monday Evening',
    'Tuesday Morning', 'Tuesday Evening',
    'Wednesday Morning', 'Wednesday Evening',
    'Thursday Morning', 'Thursday Evening',
    'Friday Morning', 'Friday Evening',
    'Saturday', 'Sunday'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const mentorRequest = {
        ...formData,
        requestDate: Date.now(),
        status: 'pending'
      };

      const result = await skill_net_backend.matchMentor(mentorRequest);
      
      if ('ok' in result) {
        onSuccess(result.ok);
      }
    } catch (error) {
      console.error('Error requesting mentor:', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Request a Mentor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Subject Area*</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="e.g., JavaScript, React, Python"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Skill Level*</label>
            <select
              required
              className="w-full p-2 border rounded-md"
              value={formData.skillLevel}
              onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Availability*</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <label key={slot} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(slot)}
                    onChange={(e) => {
                      const newAvailability = e.target.checked
                        ? [...formData.availability, slot]
                        : formData.availability.filter(s => s !== slot);
                      setFormData({...formData, availability: newAvailability});
                    }}
                    className="rounded"
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone*</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              placeholder="e.g., UTC+1, EST"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Learning Goals*</label>
            <textarea
              required
              className="w-full p-2 border rounded-md"
              rows="3"
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              placeholder="What do you want to achieve with your mentor?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Ideas</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              value={formData.projectIdeas}
              onChange={(e) => setFormData({...formData, projectIdeas: e.target.value})}
              placeholder="Any specific projects you'd like to work on?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Commitment*</label>
            <select
              required
              className="w-full p-2 border rounded-md"
              value={formData.commitment}
              onChange={(e) => setFormData({...formData, commitment: e.target.value})}
            >
              <option value="">Select commitment</option>
              <option value="1-2">1-2 hours/week</option>
              <option value="3-5">3-5 hours/week</option>
              <option value="5+">5+ hours/week</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Matching...' : 'Find Mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorRequestForm;
