import { ethers } from 'ethers';
import { SkillNetToken, SkillNetDAO, SkillNetMentorship } from '../contracts';

export const initializeContracts = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    
    const tokenContract = new ethers.Contract(SkillNetToken.address, SkillNetToken.abi, signer);
    const daoContract = new ethers.Contract(SkillNetDAO.address, SkillNetDAO.abi, signer);
    const mentorshipContract = new ethers.Contract(SkillNetMentorship.address, SkillNetMentorship.abi, signer);

    return { provider, signer, contracts: { tokenContract, daoContract, mentorshipContract } };
  } catch (error) {
    console.error("Failed to initialize contracts:", error);
    throw error;
  }
};

export const loadUserData = async (address) => {
  try {
    // In a real-world scenario, this would fetch data from the blockchain or a backend service
    return {
      name: 'John Doe',
      skills: ['JavaScript', 'React', 'Blockchain'],
      badges: [{ id: 1, name: 'JavaScript Master' }, { id: 2, name: 'React Guru' }]
    };
  } catch (error) {
    console.error("Failed to load user data:", error);
    throw error;
  }
};

export const loadCourses = async (tokenContract) => {
  try {
    // In a real-world scenario, this would fetch course data from the blockchain
    return [
      { id: 1, title: 'Advanced JavaScript', description: 'Master JS concepts', progress: 60 },
      { id: 2, title: 'Blockchain Basics', description: 'Learn blockchain fundamentals', progress: 30 },
    ];
  } catch (error) {
    console.error("Failed to load courses:", error);
    throw error;
  }
};