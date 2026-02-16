
import { createClient } from '@supabase/supabase-js';
import { Project, Certificate, AnalyticsEvent, AuditLog, Blog, Experience, SiteConfig } from '../types';
import { INITIAL_PROJECTS, INITIAL_BLOGS, INITIAL_EXPERIENCE, INITIAL_SITE_CONFIG } from '../constants';
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
  category: d.category || 'General',
  tags: d.tags || [],
  thumbnail: d.thumbnail,
  images: d.images || [],
  githubUrl: d.github_url,
  liveUrl: d.live_url,
  deploymentSpecs: (d.project_deployment_specs || []).map((s: any) => ({
    category: s.category,
    label: s.label,
    value: s.value,
    order_index: s.order_index
  })),
  techStack: (d.project_tech_stack || []).map((t: any) => t.tech_stack_tags.name),
  // Mapping metrics from database
  metrics: d.metrics || [],
  featured: d.featured || false,
  status: d.status || 'published',
  startDate: d.start_date,
  endDate: d.end_date,
  isOngoing: d.is_ongoing || false,
  role: d.role,
  createdAt: d.created_at,
  aiContext: d.ai_context,
  lastAiSync: d.updated_at
});

const mapExperienceFromDb = (e: any): Experience => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  company: e.company,
  location: e.location,
  employmentType: e.employment_type,
  startDate: e.start_date,
  endDate: e.end_date,
  isCurrent: e.is_current,
  achievements: e.achievements || [],
  description: e.description,
  orderIndex: e.order_index
});

export const storageService = {
  // --- Projects ---
  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return INITIAL_PROJECTS;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_deployment_specs(*),
          project_tech_stack(tech_stack_tags(name))
        `)
        .order('created_at', { ascending: false });
        
      if (error || !data || data.length === 0) return INITIAL_PROJECTS;
      return data.map(mapProjectFromDb);
    } catch (err) { return INITIAL_PROJECTS; }
  },

  saveProject: async (project: Project) => {
    if (!supabase) throw new Error("Supabase offline.");
    const { error } = await supabase.from('projects').upsert({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      long_description: project.longDescription,
      thumbnail: project.thumbnail,
      images: project.images,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      featured: project.featured,
      status: project.status,
      ai_context: project.aiContext,
      start_date: project.startDate,
      end_date: project.endDate,
      is_ongoing: project.isOngoing,
      role: project.role,
      // Saving metrics
      metrics: project.metrics
    });
    if (error) throw error;
    await storageService.logAudit('PROJECT_UPDATE', `Project: ${project.title}`);
  },

  // --- Experience ---
  getExperience: async (): Promise<Experience[]> => {
    if (!supabase) return INITIAL_EXPERIENCE;
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });
      if (error || !data || data.length === 0) return INITIAL_EXPERIENCE;
      return data.map(mapExperienceFromDb);
    } catch (e) { return INITIAL_EXPERIENCE; }
  },

  saveExperience: async (exp: Experience) => {
    if (!supabase) throw new Error("Supabase offline.");
    const { error } = await supabase.from('experience').upsert({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      employment_type: exp.employmentType,
      start_date: exp.startDate,
      end_date: exp.endDate,
      is_current: exp.isCurrent,
      achievements: exp.achievements,
      description: exp.description,
      order_index: exp.orderIndex
    });
    if (error) throw error;
  },

  // Added missing deleteExperience method
  deleteExperience: async (id: string) => {
    if (!supabase) throw new Error("Supabase offline.");
    await supabase.from('experience').delete().eq('id', id);
  },

  // --- Site Config ---
  getSiteConfig: async (): Promise<SiteConfig | null> => {
    if (!supabase) return INITIAL_SITE_CONFIG;
    try {
      const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single();
      if (error || !data) return INITIAL_SITE_CONFIG;
      return data as SiteConfig;
    } catch (e) { return INITIAL_SITE_CONFIG; }
  },

  saveSiteConfig: async (config: SiteConfig) => {
    if (!supabase) throw new Error("Supabase offline.");
    const { error } = await supabase.from('site_config').upsert({ ...config, id: 1 });
    if (error) throw error;
  },

  // --- Certificates ---
  getCertificates: async (): Promise<Certificate[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false });
      return (data || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issue_date,
        expiryDate: c.expiry_date,
        category: c.category,
        verificationUrl: c.verification_url,
        imageUrl: c.image_url,
        featured: c.featured,
        status: c.status
      }));
    } catch (e) { return []; }
  },

  // Added missing saveCertificate method
  saveCertificate: async (cert: Certificate) => {
    if (!supabase) throw new Error("Supabase offline.");
    const { error } = await supabase.from('certificates').upsert({
      id: cert.id,
      slug: cert.slug,
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issueDate,
      expiry_date: cert.expiryDate,
      category: cert.category,
      verification_url: cert.verificationUrl,
      image_url: cert.imageUrl,
      featured: cert.featured,
      status: cert.status
    });
    if (error) throw error;
  },

  // Added missing deleteCertificate method
  deleteCertificate: async (id: string) => {
    if (!supabase) throw new Error("Supabase offline.");
    await supabase.from('certificates').delete().eq('id', id);
  },

  deleteProject: async (id: string) => {
    if (!supabase) throw new Error("Supabase offline.");
    await supabase.from('projects').delete().eq('id', id);
    await storageService.logAudit('PROJECT_DELETE', `ID: ${id}`);
  },

  getBlogs: (): Blog[] => INITIAL_BLOGS,
  trackEvent: async (type: string, payload: any) => {
    if (!supabase) return;
    try { await supabase.from('analytics').insert({ event_type: type, payload }); } catch (e) {}
  },
  getAnalytics: async (): Promise<AnalyticsEvent[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('analytics').select('*').limit(50).order('created_at', { ascending: false });
    return (data || []).map(d => ({ id: d.id, eventType: d.event_type, payload: d.payload, createdAt: d.created_at }));
  },
  logAudit: async (action: string, details: any) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert({ action, details, actor: user?.email || 'system' });
  },
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
    return (data || []).map(d => ({ id: d.id, action: d.action, actor: d.actor, details: d.details, timestamp: d.created_at }));
  },
  seedDatabase: async () => {
    if (!supabase) return;
    for (const p of INITIAL_PROJECTS) { await storageService.saveProject(p); }
    for (const e of INITIAL_EXPERIENCE) { await storageService.saveExperience(e); }
    await storageService.saveSiteConfig(INITIAL_SITE_CONFIG);
  }
};
