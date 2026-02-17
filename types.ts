export enum ProjectCategory {
  SYSTEM_DESIGN = 'System Design',
  AI_ML = 'AI & Machine Learning',
  FULL_STACK = 'Full Stack',
  RESEARCH = 'Research'
}

export type EmploymentType = 'FULL_TIME' | 'INTERN' | 'CONTRACT' | 'FREELANCE';
export type SpecCategory = 'HOST' | 'SECURITY' | 'INFRA' | 'CUSTOM';

export interface ProjectFeatureBlock {
  id?: string;
  project_id?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  image_url?: string;
  order_index: number;
}

export interface ProjectDeploymentSpec {
  id?: string;
  project_id?: string;
  category: SpecCategory;
  label: string;
  value: string;
  order_index: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  mainTagId?: string;
  thumbnail: string;
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  metrics: { label: string; value: string }[];
  techStack: string[]; 
  featureBlocks: ProjectFeatureBlock[];
  deploymentSpecs: ProjectDeploymentSpec[];
  featured: boolean;
  status: 'published' | 'draft';
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
  role?: string;
  teamSize?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: string;
  updatedAt?: string;
  aiContext?: string;
  lastAiSync?: string;
  // New technical deep-dive fields
  architectureImpact?: string;
  scaleStrategyTitle?: string;
  scaleStrategyDescription?: string;
  latencyProfileTitle?: string;
  latencyProfileDescription?: string;
}

export interface MainTag {
  id: string;
  name: string;
}

export interface TechStackTag {
  id: string;
  name: string;
  category: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  status: 'published' | 'draft';
}

export interface Certificate {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  category: string;
  description?: string;
  verificationUrl?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  featured: boolean;
  status: 'published' | 'draft';
  publishAt?: string;
  createdAt?: string;
}

export interface Experience {
  id: string;
  slug?: string;
  title: string;
  company: string;
  location?: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  achievements: string[];
  description?: string;
  orderIndex: number;
}

export interface SiteConfig {
  id: number;
  logo_line1: string;
  logo_line2: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  bio_summary: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  payload: any;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  details: any;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}