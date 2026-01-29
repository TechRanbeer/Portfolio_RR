
import { createClient } from '@supabase/supabase-js';
import { Project, Certificate, AnalyticsEvent, AuditLog, Blog } from '../types';
import { INITIAL_PROJECTS, INITIAL_BLOGS } from '../constants';
import { getEnv } from './env';

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Mapper to convert DB snake_case to UI camelCase
const mapProjectFromDb = (d: any): Project => ({
  id: d.id,
  slug: d.slug,
  title: d.title,
  description: d.description,
  longDescription: d.long_description || d.description,
  category: d.category,
  tags: d.tags || [],
  thumbnail: d.thumbnail,
  images: d.images || [],
  githubUrl: d.github_url,
  liveUrl: d.live_url,
  metrics: d.metrics || [],
  techStack: d.tech_stack || [],
  featured: d.featured || false,
  status: d.status || 'published',
  createdAt: d.created_at,
  aiContext: d.ai_context,
  lastAiSync: d.updated_at
});

const mapProjectToDb = (p: Project) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  description: p.description,
  long_description: p.longDescription,
  category: p.category,
  tags: p.tags,
  thumbnail: p.thumbnail,
  images: p.images,
  github_url: p.githubUrl,
  live_url: p.liveUrl,
  metrics: p.metrics,
  tech_stack: p.techStack,
  featured: p.featured,
  status: p.status,
  ai_context: p.aiContext,
  updated_at: new Date().toISOString()
});

export const storageService = {
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return INITIAL_PROJECTS;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) return INITIAL_PROJECTS;
      return data.map(mapProjectFromDb);
    } catch (err) {
      return INITIAL_PROJECTS;
    }
  },

  saveProject: async (project: Project) => {
    if (!supabase) throw new Error("Supabase connection offline. Save failed.");
    
    const { error } = await supabase.from('projects').upsert(mapProjectToDb(project));
    if (error) throw error;
    
    await storageService.logAudit('PROJECT_SYNC', `Project updated: ${project.title}`);
  },

  deleteProject: async (id: string) => {
    if (!supabase) throw new Error("Supabase connection offline. Delete failed.");
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;

    await storageService.logAudit('PROJECT_DELETE', `Project deleted: ${id}`);
  },

  seedDatabase: async () => {
    if (!supabase) return;
    for (const p of INITIAL_PROJECTS) {
      await storageService.saveProject(p);
    }
  },

  getCertificates: async (): Promise<Certificate[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('certificates').select('*');
      return (data || []) as Certificate[];
    } catch (e) {
      return [];
    }
  },

  getBlogs: (): Blog[] => INITIAL_BLOGS,

  trackEvent: async (type: AnalyticsEvent['eventType'], payload: any) => {
    if (!supabase) return;
    try {
      await supabase.from('analytics').insert({
        event_type: type,
        payload: payload
      });
    } catch (e) {
      // Fail silently for analytics
    }
  },

  getAnalytics: async (): Promise<AnalyticsEvent[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('analytics').select('*').limit(50).order('created_at', { ascending: false });
      return (data || []).map(d => ({
        id: d.id,
        eventType: d.event_type,
        payload: d.payload,
        createdAt: d.created_at
      }));
    } catch (e) {
      return [];
    }
  },

  logAudit: async (action: string, details: string) => {
    if (!supabase) return;
    try {
      await supabase.from('audit_logs').insert({
        action,
        details,
        actor: 'admin'
      });
    } catch (e) {
      // Fail silently
    }
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
      return (data || []).map(d => ({
        id: d.id,
        action: d.action,
        actor: d.actor,
        details: d.details,
        timestamp: d.created_at
      }));
    } catch (e) {
      return [];
    }
  }
};
