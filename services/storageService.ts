
import { createClient } from '@supabase/supabase-js';
import { Project, Certificate, AnalyticsEvent, AuditLog, Blog } from '../types';
import { INITIAL_PROJECTS, INITIAL_BLOGS } from '../constants';

// Fix: Use process.env for environment variables to avoid Property 'env' does not exist on type 'ImportMeta' errors
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

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
      
      if (error) {
        console.error("Supabase Error:", error);
        return INITIAL_PROJECTS;
      }

      if (!data || data.length === 0) return INITIAL_PROJECTS;
      return data.map(mapProjectFromDb);
    } catch (err) {
      console.error("Failed to connect to storage:", err);
      return INITIAL_PROJECTS;
    }
  },

  saveProject: async (project: Project) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('projects')
      .upsert(mapProjectToDb(project));
    
    if (error) throw error;
    await storageService.logAudit('PROJECT_SYNC', `Project synced: ${project.title}`);
  },

  deleteProject: async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  seedDatabase: async () => {
    if (!supabase) return;
    for (const p of INITIAL_PROJECTS) {
      await storageService.saveProject(p);
    }
    console.log("Database seeded with initial fleet data.");
  },

  getCertificates: async (): Promise<Certificate[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('certificates').select('*');
    return (data || []) as Certificate[];
  },

  getBlogs: (): Blog[] => INITIAL_BLOGS,

  trackEvent: async (type: AnalyticsEvent['eventType'], payload: any) => {
    if (!supabase) return;
    await supabase.from('analytics').insert({
      event_type: type,
      payload: payload
    });
  },

  getAnalytics: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('analytics').select('*').limit(50).order('created_at', { ascending: false });
    return (data || []).map(d => ({
      id: d.id,
      eventType: d.event_type,
      payload: d.payload,
      createdAt: d.created_at
    })) as AnalyticsEvent[];
  },

  logAudit: async (action: string, details: string) => {
    if (!supabase) return;
    await supabase.from('audit_logs').insert({
      action,
      actor: 'Admin_Portal',
      details,
      created_at: new Date().toISOString()
    });
  },

  getAuditLogs: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
    return (data || []).map(d => ({
      id: d.id,
      action: d.action,
      actor: d.actor,
      details: d.details,
      timestamp: d.created_at
    })) as AuditLog[];
  }
};
