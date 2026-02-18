
import { createClient } from '@supabase/supabase-js';
import { Project, Certificate, AnalyticsEvent, AuditLog, Blog, Experience, SiteConfig, MainTag, TechStackTag } from '../types';
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
  mainTagId: d.main_tag_id,
  thumbnail: d.thumbnail,
  images: d.images || [],
  githubUrl: d.github_url,
  liveUrl: d.live_url,
  metrics: d.metrics || [],
  techStack: (d.project_tech_stack || []).map((t: any) => t.tech_stack_tags?.name || ''),
  featureBlocks: (d.project_feature_blocks || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    description: b.description,
    icon: b.icon,
    image_url: b.image_url,
    order_index: b.order_index
  })).sort((a: any, b: any) => a.order_index - b.order_index),
  deploymentSpecs: (d.project_deployment_specs || []).map((s: any) => ({
    id: s.id,
    category: s.category,
    label: s.label,
    value: s.value,
    order_index: s.order_index
  })).sort((a: any, b: any) => a.order_index - b.order_index),
  featured: d.featured || false,
  status: d.status || 'published',
  startDate: d.start_date,
  endDate: d.end_date,
  isOngoing: d.is_ongoing || false,
  role: d.role,
  teamSize: d.team_size,
  metaTitle: d.meta_title,
  // Fix: Changed meta_description to metaDescription to match Project type definition
  metaDescription: d.meta_description,
  keywords: d.keywords || [],
  createdAt: d.created_at,
  updatedAt: d.updated_at,
  aiContext: d.ai_context,
  lastAiSync: d.last_ai_sync,
  architectureImpact: d.architecture_impact,
  scaleStrategyTitle: d.scale_strategy_title,
  scaleStrategyDescription: d.scale_strategy_description,
  latencyProfileTitle: d.latency_profile_title,
  latencyProfileDescription: d.latency_profile_description
});

export const storageService = {
  getMainTags: async (): Promise<MainTag[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('main_tags').select('*').order('name');
    return data || [];
  },

  getTechStackTags: async (): Promise<TechStackTag[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('tech_stack_tags').select('*').order('name');
    return data || [];
  },

  getProjects: async (): Promise<Project[]> => {
    if (!supabase) return INITIAL_PROJECTS;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_deployment_specs(*),
          project_feature_blocks(*),
          project_tech_stack(tech_stack_tags(name))
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
        
      if (error || !data) return INITIAL_PROJECTS;
      return data.map(mapProjectFromDb);
    } catch (err) { return INITIAL_PROJECTS; }
  },

  saveProject: async (project: Project) => {
    if (!supabase) throw new Error("Supabase connection missing.");

    // Update main project entry
    const { error: projectError } = await supabase.from('projects').upsert({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      long_description: project.longDescription,
      category: project.category,
      main_tag_id: project.mainTagId,
      thumbnail: project.thumbnail,
      images: project.images,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      metrics: project.metrics,
      featured: project.featured,
      status: project.status,
      ai_context: project.aiContext,
      last_ai_sync: project.lastAiSync,
      start_date: project.startDate,
      end_date: project.endDate,
      is_ongoing: project.isOngoing,
      role: project.role,
      team_size: project.teamSize,
      meta_title: project.metaTitle,
      meta_description: project.metaDescription,
      keywords: project.keywords,
      architecture_impact: project.architectureImpact,
      scale_strategy_title: project.scaleStrategyTitle,
      scale_strategy_description: project.scaleStrategyDescription,
      latency_profile_title: project.latencyProfileTitle,
      latency_profile_description: project.latencyProfileDescription
    });

    if (projectError) throw projectError;

    // Sync tech stack relation
    if (project.techStack) {
      // 1. Ensure all tags exist in tech_stack_tags
      for (const tagName of project.techStack) {
        const { data: existing } = await supabase.from('tech_stack_tags').select('id').eq('name', tagName).single();
        if (!existing) {
          await supabase.from('tech_stack_tags').insert({ name: tagName, category: 'general' });
        }
      }

      // 2. Delete existing associations
      await supabase.from('project_tech_stack').delete().eq('project_id', project.id);

      // 3. Create new associations
      const { data: tagData } = await supabase.from('tech_stack_tags').select('id, name').in('name', project.techStack);
      if (tagData && tagData.length > 0) {
        await supabase.from('project_tech_stack').insert(
          tagData.map(t => ({ project_id: project.id, tech_stack_id: t.id }))
        );
      }
    }

    // Sync specs
    await supabase.from('project_deployment_specs').delete().eq('project_id', project.id);
    if (project.deploymentSpecs && project.deploymentSpecs.length > 0) {
      await supabase.from('project_deployment_specs').insert(
        project.deploymentSpecs.map((s, idx) => ({
          project_id: project.id,
          category: s.category || 'CUSTOM',
          label: s.label,
          value: s.value,
          order_index: idx
        }))
      );
    }

    // Sync feature blocks
    await supabase.from('project_feature_blocks').delete().eq('project_id', project.id);
    if (project.featureBlocks && project.featureBlocks.length > 0) {
      await supabase.from('project_feature_blocks').insert(
        project.featureBlocks.map((b, idx) => ({
          project_id: project.id,
          title: b.title,
          subtitle: b.subtitle,
          description: b.description,
          icon: b.icon,
          image_url: b.image_url,
          order_index: idx
        }))
      );
    }
    
    await storageService.logAudit('PROJECT_PERSIST', `Updated: ${project.title}`);
  },

  deleteProject: async (id: string) => {
    if (supabase) await supabase.from('projects').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  },

  getCertificates: async (): Promise<Certificate[]> => {
    if (!supabase) return [];
    try {
      const { data } = await supabase.from('certificates').select('*').is('deleted_at', null).order('issue_date', { ascending: false });
      return (data || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issue_date,
        expiryDate: c.expiry_date,
        category: c.category,
        description: c.description,
        verificationUrl: c.verification_url,
        credentialId: c.credential_id,
        credentialUrl: c.credential_url,
        imageUrl: c.image_url,
        featured: c.featured,
        status: c.status
      }));
    } catch (e) { return []; }
  },

  saveCertificate: async (cert: Certificate) => {
    if (!supabase) throw new Error("Supabase connection missing.");
    
    const formatSqlDate = (dateStr?: string) => {
      if (!dateStr) return null;
      try {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
      } catch (e) { return null; }
    };

    const { error } = await supabase.from('certificates').upsert({
      id: cert.id,
      slug: cert.slug || cert.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
      title: cert.title,
      issuer: cert.issuer,
      issue_date: formatSqlDate(cert.issueDate) || new Date().toISOString().split('T')[0],
      expiry_date: formatSqlDate(cert.expiryDate),
      category: cert.category,
      description: cert.description,
      verification_url: cert.verificationUrl,
      credential_id: cert.credentialId,
      credential_url: cert.credentialUrl,
      image_url: cert.imageUrl,
      featured: cert.featured,
      status: cert.status,
      deleted_at: null
    });
    
    if (error) throw error;
    await storageService.logAudit('CERT_PERSIST', `Registered: ${cert.title}`);
  },

  deleteCertificate: async (id: string) => {
    if (supabase) await supabase.from('certificates').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  },

  getExperience: async (): Promise<Experience[]> => {
    if (!supabase) return INITIAL_EXPERIENCE;
    const { data } = await supabase.from('experience').select('*').order('order_index');
    return (data || []).map(e => ({
      id: e.id,
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
    }));
  },

  saveExperience: async (exp: Experience) => {
    if (supabase) await supabase.from('experience').upsert({
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
  },

  deleteExperience: async (id: string) => {
    if (supabase) await supabase.from('experience').delete().eq('id', id);
  },

  getSiteConfig: async (): Promise<SiteConfig | null> => {
    if (!supabase) return INITIAL_SITE_CONFIG;
    const { data } = await supabase.from('site_config').select('*').eq('id', 1).single();
    return data || INITIAL_SITE_CONFIG;
  },

  saveSiteConfig: async (config: SiteConfig) => {
    if (supabase) await supabase.from('site_config').upsert({ ...config, id: 1 });
  },

  getBlogs: (): Blog[] => INITIAL_BLOGS,
  trackEvent: async (type: string, payload: any) => {
    if (supabase) await supabase.from('analytics').insert({ event_type: type, payload });
  },
  getAnalytics: async (): Promise<AnalyticsEvent[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('analytics').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).map(d => ({ id: d.id, eventType: d.event_type, payload: d.payload, createdAt: d.created_at }));
  },
  logAudit: async (action: string, details: string) => {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({ action, details, actor: user?.email || 'system' });
    }
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
