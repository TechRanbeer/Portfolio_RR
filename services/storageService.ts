import { createClient } from '@supabase/supabase-js';
import { Project, Certificate, AnalyticsEvent, AuditLog, Blog, Experience, SiteConfig } from '../types';
import { INITIAL_PROJECTS, INITIAL_BLOGS } from '../constants';
import { getEnv } from './env';

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

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
  // --- Projects ---
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return INITIAL_PROJECTS;
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return INITIAL_PROJECTS;
      return data.map(mapProjectFromDb);
    } catch (err) { return INITIAL_PROJECTS; }
  },
  saveProject: async (project: Project) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('projects').upsert(mapProjectToDb(project));
    if (error) throw error;
    await storageService.logAudit('PROJECT_SYNC', `Project synced: ${project.title}`);
  },
  deleteProject: async (id: string) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    await storageService.logAudit('PROJECT_DELETE', `Project deleted: ${id}`);
  },

  // --- Certificates ---
  getCertificates: async (): Promise<Certificate[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('certificates').select('*').order('date', { ascending: false });
    return (data || []) as Certificate[];
  },
  saveCertificate: async (cert: Certificate) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('certificates').upsert(cert);
    if (error) throw error;
  },
  deleteCertificate: async (id: string) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Experience ---
  getExperience: async (): Promise<Experience[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('experience').select('*').order('order', { ascending: true });
    return (data || []) as Experience[];
  },
  saveExperience: async (exp: Experience) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('experience').upsert(exp);
    if (error) throw error;
  },
  deleteExperience: async (id: string) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Site Config ---
  getSiteConfig: async (): Promise<SiteConfig | null> => {
    if (!supabase) return null;
    const { data } = await supabase.from('site_config').select('*').limit(1).single();
    return data as SiteConfig;
  },
  saveSiteConfig: async (config: SiteConfig) => {
    if (!supabase) throw new Error("Database offline");
    const { error } = await supabase.from('site_config').upsert(config);
    if (error) throw error;
  },

  // --- Others ---
  getBlogs: (): Blog[] => INITIAL_BLOGS,
  trackEvent: async (type: AnalyticsEvent['eventType'], payload: any) => {
    if (!supabase) return;
    try { await supabase.from('analytics').insert({ event_type: type, payload }); } catch (e) {}
  },
  getAnalytics: async (): Promise<AnalyticsEvent[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('analytics').select('*').limit(100).order('created_at', { ascending: false });
    return (data || []).map(d => ({ id: d.id, eventType: d.event_type, payload: d.payload, createdAt: d.created_at }));
  },
  logAudit: async (action: string, details: string) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({ action, details, actor: user?.email || 'system' });
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).map(d => ({ id: d.id, action: d.action, actor: d.actor, details: d.details, timestamp: d.created_at }));
  },
  seedDatabase: async () => {
    if (!supabase) return;
    for (const p of INITIAL_PROJECTS) { await storageService.saveProject(p); }
    // Add default site config if empty
    const current = await storageService.getSiteConfig();
    if (!current) {
      await storageService.saveSiteConfig({
        id: 'default',
        logo_line1: 'Ranbeer',
        logo_line2: 'Raja',
        hero_headline_line1: 'Ranbeer',
        hero_headline_line2: 'Raja',
        hero_subtitle: 'Mechanical Engineer & Embedded Systems Specialist.',
        contact_email: 'ranbeerraja1@gmail.com',
        contact_phone: '+91 97692 20377',
        location: 'Thane, MH, India',
        bio_summary: 'High-impact Mechanical Engineering student...',
        social_links: { github: '', linkedin: '' }
      });
    }
  }
};