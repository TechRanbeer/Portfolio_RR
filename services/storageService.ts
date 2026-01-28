import { Project, Blog } from '../types';
import { INITIAL_PROJECTS, INITIAL_BLOGS } from '../constants';

const KEYS = {
  PROJECTS: 'rr_registry_projects',
  BLOGS: 'rr_registry_blogs',
  ANALYTICS: 'rr_registry_analytics'
};

export const storageService = {
  getProjects: (): Project[] => {
    const data = localStorage.getItem(KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(data);
  },

  saveProjects: (projects: Project[]) => {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  },

  getBlogs: (): Blog[] => {
    const data = localStorage.getItem(KEYS.BLOGS);
    if (!data) {
      localStorage.setItem(KEYS.BLOGS, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    return JSON.parse(data);
  },

  saveBlogs: (blogs: Blog[]) => {
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(blogs));
  },

  logView: (id: string) => {
    const views = JSON.parse(localStorage.getItem(`views_${id}`) || '0');
    localStorage.setItem(`views_${id}`, JSON.stringify(views + 1));
  }
};