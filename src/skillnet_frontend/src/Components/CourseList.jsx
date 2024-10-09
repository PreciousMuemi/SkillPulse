// Sample courses for SkillNet
const sampleCourses = [
    {
      title: "Digital Marketing for Kenyan Businesses",
      description: "Learn how to effectively market your business online in the Kenyan context.",
      skillsGained: ["Social Media Marketing", "SEO", "Content Creation"],
      duration: 20,
      tokenReward: 100,
      nftReward: true
    },
    {
      title: "Sustainable Agriculture Techniques",
      description: "Explore modern, sustainable farming methods suitable for Kenyan agriculture.",
      skillsGained: ["Crop Rotation", "Water Conservation", "Organic Farming"],
      duration: 30,
      tokenReward: 150,
      nftReward: true
    },
    {
      title: "Mobile App Development with Flutter",
      description: "Build cross-platform mobile apps to address local Kenyan needs.",
      skillsGained: ["Dart Programming", "UI Design", "App Publishing"],
      duration: 40,
      tokenReward: 200,
      nftReward: true
    },
    {
      title: "Renewable Energy Solutions for Kenya",
      description: "Learn about implementing solar and wind energy solutions in Kenya.",
      skillsGained: ["Solar Panel Installation", "Wind Turbine Basics", "Energy Storage"],
      duration: 25,
      tokenReward: 125,
      nftReward: true
    },
    {
      title: "Effective Communication in Business",
      description: "Enhance your communication skills for the Kenyan business environment.",
      skillsGained: ["Public Speaking", "Business Writing", "Negotiation"],
      duration: 15,
      tokenReward: 75,
      nftReward: false
    },
    {
      title: "Financial Technology (FinTech) in Kenya",
      description: "Explore the growing FinTech industry and opportunities in Kenya.",
      skillsGained: ["Mobile Money Systems", "Blockchain Basics", "Financial Regulations"],
      duration: 35,
      tokenReward: 175,
      nftReward: true
    }
  ];
  
  // Function to add sample courses to the SkillNet canister
  async function addSampleCourses(actor) {
    for (const course of sampleCourses) {
      const nftId = course.nftReward ? await actor.createNFT(
        `${course.title} Completion NFT`,
        `NFT awarded for completing the ${course.title} course`,
        `https://example.com/nft/${course.title.replace(/\s+/g, '-').toLowerCase()}.png`
      ) : null;
  
      await actor.createCourse(
        course.title,
        course.description,
        course.skillsGained,
        course.duration,
        course.tokenReward,
        nftId
      );
    }
    console.log("Sample courses");
  }
  export default courselist;