import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as skillnetIdlFactory } from '../../../declarations/skill_net_backend/skill_net_backend.did.js';
import courses from '../../../data/courses.json';

const agent = new HttpAgent();
const skillnetActor = Actor.createActor(skillnetIdlFactory, {
  agent,
  canisterId: process.env.CANISTER_ID || 'your-default-canister-id',
});

export const api = {
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

  getAllCourses: () => {
    return courses.categories.flatMap(category => 
      category.courses.map(course => ({
        ...course,
        category: category.name
      }))
    );
  },

  getCourseById: (courseId) => {
    for (let category of courses.categories) {
      const course = category.courses.find(c => c.id === courseId);
      if (course) return { ...course, category: category.name };
    }
    return null;
  },

  getCourseModules: (courseId) => {
    const course = api.getCourseById(courseId);
    return course ? course.modules : [];
  },

  unlockNextModule: (courseId, currentModuleId) => {
    const course = api.getCourseById(courseId);
    if (!course) return null;

    const moduleIndex = course.modules.findIndex(m => m.id === currentModuleId);
    return moduleIndex < course.modules.length - 1 
      ? course.modules[moduleIndex + 1] 
      : null;
  },

  calculateCourseProgress: (courseId, completedModules) => {
    const course = api.getCourseById(courseId);
    if (!course) return 0;

    const totalModules = course.modules.length;
    const completedCount = completedModules.length;

    return (completedCount / totalModules) * 100;
  },

  submitCourseProject: async (courseId, projectData) => {
    try {
      const result = await skillnetActor.submitCourseProject({
        courseId,
        ...projectData
      });

      return {
        success: result.Ok ? true : false,
        message: result.Ok || result.Err
      };
    } catch (error) {
      console.error('Project submission error:', error);
      throw error;
    }
  },

  calculateXP: (courseId, modulesCompleted) => {
    const course = api.getCourseById(courseId);
    if (!course) return 0;

    const xpEarned = modulesCompleted.reduce((total, moduleId) => {
      const module = course.modules.find(m => m.id === moduleId);
      return total + (module ? module.xpPoints : 0);
    }, 0);

    return xpEarned;
  },

  // Forum-related methods
  createForum: async (forumData) => {
    try {
      const result = await skillnetActor.createForum(forumData);
      return result;
    } catch (error) {
      console.error('Error creating forum:', error);
      throw new Error('Failed to create forum');
    }
  },

  listForums: async () => {
    try {
      const forums = await skillnetActor.listForums();
      return forums;
    } catch (error) {
      console.error('Error fetching forums:', error);
      return [];
    }
  },

  // Existing methods for other functionalities
  enrollInCourse: async (courseId) => {
    try {
      return await skillnetActor.enrollInCourse(courseId);
    } catch (error) {
      console.error('Error enrolling in course:', error.message);
      throw new Error('Enrollment failed.');
    }
  },

  requestMentorMatch: async (menteeId, skills, availability, mentorshipStyle, location) => {
    try {
      const result = await skillnetActor.requestMentorMatch(
        menteeId, 
        skills, 
        availability || '', 
        mentorshipStyle || '', 
        location || ''
      );
      if ('Ok' in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error fetching mentor matches:', error.message);
      throw new Error('Failed to fetch mentor matches.');
    }
  },
};

// Utility function to get courses directly if needed
export const getAllCoursesFromJson = () => courses;

export default api;
