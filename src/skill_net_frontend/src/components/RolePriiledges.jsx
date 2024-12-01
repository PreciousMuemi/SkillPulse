const rolePrivileges = {
    // MENTORS 👑
    mentor: {
      requirements: {
        minLevel: "Advanced",
        verificationNeeded: true,
        expertiseProof: true
      },
      rights: [
        "Create official courses",
        "Verify content quality",
        "Host masterclasses",
        "Award badges",
        "Unlimited daily posts"
      ]
    },
  
    // PEER TEACHERS 🌟
    peerTeacher: {
      requirements: {
        minLevel: "Intermediate",
        minEngagement: 100,
        successfulGuides: 5
      },
      rights: [
        "Create learning tracks",
        "Host study groups",
        "Provide verified answers",
        "Up to 15 daily posts"
      ]
    },
  
    // LEARNERS 🌱
    learner: {
      subLevels: {
        1: {
          title: "Rookie",
          rights: ["Basic posts", "Comments", "Likes"],
          dailyPosts: 2
        },
        2: {
          title: "Explorer",
          rights: ["Share notes", "Join groups"],
          dailyPosts: 3
        },
        3: {
          title: "Builder",
          rights: ["Code snippets", "Study guides"],
          dailyPosts: 5
        },
        4: {
          title: "Guide",
          rights: ["Basic tutorials", "Study sessions"],
          dailyPosts: 7
        },
        5: {
          title: "Expert",
          rights: ["Learning paths", "Mentoring"],
          dailyPosts: 10,
          canUpgradeToPeerTeacher: true
        }
      }
    }
  };
  