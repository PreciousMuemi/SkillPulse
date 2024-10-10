import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as skillnetIdlFactory } from '../../../declarations/skillnet_backend/skillnet_backend.did.js';

const agent = new HttpAgent();
const skillnetActor = Actor.createActor(skillnetIdlFactory, { agent, canisterId: process.env.CANISTER_ID });

export async function listCourses() {
  try {
    return await skillnetActor.listCourses();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getCourse(courseId) {
  try {
    return await skillnetActor.getCourse(courseId);
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

export async function enrollInCourse(courseId) {
  try {
    return await skillnetActor.enrollInCourse(courseId);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    return await skillnetActor.getUser();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getUserNFTs() {
  try {
    return await skillnetActor.getUserNFTs();
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw error;
  }
}

export async function becomeMentor() {
  try {
    return await skillnetActor.becomeMentor();
  } catch (error) {
    console.error('Error becoming mentor:', error);
    throw error;
  }
}

export async function requestMentor() {
  try {
    return await skillnetActor.requestMentor();
  } catch (error) {
    console.error('Error requesting mentor:', error);
    throw error;
  }
}

export async function getLeaderboard() {
  try {
    return await skillnetActor.getLeaderboard();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

export async function getUserProgress(courseId) {
  try {
    return await skillnetActor.getUserProgress(courseId);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}