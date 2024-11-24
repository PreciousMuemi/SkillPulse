import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as skillnetIdlFactory } from '../../../declarations/skillnet_backend/skillnet_backend.did.js';

const agent = new HttpAgent();
const skillnetActor = Actor.createActor(skillnetIdlFactory, { 
    agent, 
    canisterId: process.env.CANISTER_ID 
});

const api = {
    // Course Management
    listCourses: async () => {
      try {
        return await skillnetActor.listCourses();
      } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
      }
    },

    getCourse: async (courseId) => {
      try {
        return await skillnetActor.getCourse(courseId);
      } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
    },

    // User Management
    getUser: async () => {
      try {
        return await skillnetActor.getUser();
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    // Mentor Management
    requestMentorMatch: async (menteeId, skills) => {
      try {
        return await skillnetActor.requestMentorMatch({ menteeId, skills });
      } catch (error) {
        throw new Error('Failed to fetch mentor matches');
      }
    },

    enrollInCourse: async (courseId) => {
      try {
        return await skillnetActor.enrollInCourse(courseId);
      } catch (error) {
        console.error('Error enrolling in course:', error);
        throw error;
      }
    },

    getUserNFTs: async () => {
      try {
        return await skillnetActor.getUserNFTs();
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
        throw error;
      }
    },

    becomeMentor: async () => {
      try {
        return await skillnetActor.becomeMentor();
      } catch (error) {
        console.error('Error becoming mentor:', error);
        throw error;
      }
    }
};

export default api;