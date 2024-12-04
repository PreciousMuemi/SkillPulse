import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as skillnetIdlFactory } from '../../../declarations/skill_net_backend/skill_net_backend.did.js';

const agent = new HttpAgent();
const skillnetActor = Actor.createActor(skillnetIdlFactory, {
  agent,
  canisterId: process.env.CANISTER_ID || 'your-default-canister-id',
});

const api = {
  listCourses: async () => {
    try {
      return await skillnetActor.listCourses();
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      return [];
    }
  },

  getCourse: async (courseId) => {
    try {
      return await skillnetActor.getCourse(courseId);
    } catch (error) {
      console.error('Error fetching course:', error.message);
      throw new Error('Could not retrieve course details.');
    }
  },

  getUser: async () => {
    try {
      return await skillnetActor.getUser();
    } catch (error) {
      console.error('Error fetching user:', error.message);
      throw new Error('Failed to fetch user details.');
    }
  },

  requestMentorMatch: async (menteeId, skills) => {
    try {
      const result = await skillnetActor.requestMentorMatch(menteeId, skills);
      if ('Ok' in result) {
        return result.Ok;  // Successfully found mentors
      } else {
        throw new Error(result.Err);  // Error in finding mentors
      }
    } catch (error) {
      console.error('Error fetching mentor matches:', error.message);
      throw new Error('Failed to fetch mentor matches.');
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      return await skillnetActor.enrollInCourse(courseId);
    } catch (error) {
      console.error('Error enrolling in course:', error.message);
      throw new Error('Enrollment failed.');
    }
  },

  getUserNFTs: async () => {
    try {
      return await skillnetActor.getUserNFTs();
    } catch (error) {
      console.error('Error fetching user NFTs:', error.message);
      throw new Error('Could not retrieve user NFTs.');
    }
  },

  becomeMentor: async () => {
    try {
      return await skillnetActor.becomeMentor();
    } catch (error) {
      console.error('Error becoming mentor:', error.message);
      throw new Error('Failed to become a mentor.');
    }
  },
};
const fetchStudyJams = async () => {
  const jams = await backendActor.getAllStudyJams();
  setStudyJams(jams);
};

const joinStudyJam = async (jamId) => {
  const result = await backendActor.joinStudyJam(currentUser.principal, jamId);
  if (result) alert("Joined Study Jam!");
};

const fetchForums = async () => {
  const forums = await backendActor.getAllForums();
  setForums(forums);
};

const openForum = async (forumId) => {
  const posts = await backendActor.getForumPosts(forumId);
  setCurrentForumPosts(posts);
};


export default api;
