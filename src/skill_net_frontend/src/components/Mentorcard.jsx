const MentorCard = ({ mentor, onRequestMentorship }) => {
    return (
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-6 max-w-sm mx-auto">
        <img
          src={mentor.avatar || "/default-avatar.png"}
          alt={`${mentor.name}'s avatar`}
          className="w-24 h-24 rounded-full mx-auto shadow-lg"
        />
        <h3 className="text-xl font-semibold text-gray-800 text-center mt-4">{mentor.name}</h3>
        <p className="text-gray-500 text-center">{mentor.expertise}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {mentor.skills.map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-gradient-to-r from-green-400 to-blue-500 text-white py-1 px-3 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <button
          onClick={() => onRequestMentorship(mentor.id)}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
        >
          Request Mentorship
        </button>
      </div>
    );
  };
  
  export default MentorCard;
  