const ProfileContent = () => {
    const subLevelPrivileges = {
      1: {
        title: "Rookie 🌱",
        canPost: true,
        maxPostsPerDay: 2,
        features: ["Basic posts", "Can comment", "Can like"],
        unlockMessage: "Welcome to the community! Start by sharing your learning journey"
      },
      2: {
        title: "Rising Star ⭐",
        canPost: true,
        maxPostsPerDay: 5,
        features: ["Post tutorials", "Share code snippets", "Create study groups"],
        unlockMessage: "You're growing! Share more and help others learn"
      },
      3: {
        title: "Trendsetter 🔥",
        canPost: true,
        maxPostsPerDay: 10,
        features: ["Create challenges", "Host learning sessions", "Mentor newcomers"],
        unlockMessage: "You're making waves! Time to guide others"
      },
      4: {
        title: "Vibe Master 💫",
        canPost: true,
        maxPostsPerDay: 15,
        features: ["Create course paths", "Verified answers", "Community highlights"],
        unlockMessage: "Your expertise is recognized! Keep inspiring"
      },
      5: {
        title: "Legend 👑",
        canPost: true,
        maxPostsPerDay: "unlimited",
        features: ["Create learning tracks", "Official mentor status", "Feature spotlights"],
        unlockMessage: "You're a community pillar! Your impact is incredible"
      }
    };
  
    const checkPostingEligibility = async (userLevel, subLevel, contentType) => {
      const privileges = subLevelPrivileges[subLevel];
      const dailyPosts = await skill_net_backend.getUserDailyPosts();
      
      return {
        canPost: privileges.canPost && dailyPosts < privileges.maxPostsPerDay,
        features: privileges.features,
        message: privileges.unlockMessage
      };
    };
  
    const LevelProgress = () => (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Level {profile.subLevel} Vibes ✨</h3>
          <span className="text-sm bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full">
            {subLevelPrivileges[profile.subLevel].title}
          </span>
        </div>
  
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
              style={{width: `${(profile.xp / profile.nextLevelXp) * 100}%`}}
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            {subLevelPrivileges[profile.subLevel].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                {feature}
              </div>
            ))}
          </div>
  
          <div className="text-sm text-gray-600 italic">
            {subLevelPrivileges[profile.subLevel].unlockMessage}
          </div>
        </div>
      </div>
    );
  
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <LevelProgress />
        
        {/* Content Creation with Eligibility Check */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Share Your Magic ✨</h3>
          <div className="space-y-4">
            {checkPostingEligibility(profile.level, profile.subLevel, 'basic').then(eligibility => (
              eligibility.canPost ? (
                <>
                  <select className="w-full p-3 rounded-lg border border-gray-200">
                    <option>Choose Your Vibe 🎯</option>
                    {subLevelPrivileges[profile.subLevel].features.map((feature, index) => (
                      <option key={index}>{feature}</option>
                    ))}
                  </select>
                  <textarea 
                    placeholder="Drop your knowledge here..."
                    className="w-full p-3 rounded-lg border border-gray-200 h-32"
                  />
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Share with the Squad 🚀
                  </button>
                </>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p>Level up to unlock more posting powers! 🎯</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Next unlock at level {profile.subLevel + 1}: 
                    {subLevelPrivileges[profile.subLevel + 1]?.features[0]}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  };  