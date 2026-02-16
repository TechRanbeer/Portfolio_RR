export enum ProjectCategory {
  SYSTEM_DESIGN = 'System Design',
  AI_ML = 'AI & Machine Learning',
  FULL_STACK = 'Full Stack',
  RESEARCH = 'Research'
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  tags: string[];
  thumbnail: string;
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  aiContext?: string;
  lastAiSync?: string;
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
  title: string;
  issuer: string;
  date: string;
  category: string;
  verificationUrl?: string;
  imageUrl?: string;
  status: 'published' | 'draft';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  achievements: string[];
  order: number;
}

export interface SiteConfig {
  id: string;
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
  eventType: 'PAGE_VIEW' | 'AI_QUERY' | 'RESUME_DOWNLOAD' | 'PROJECT_CLICK';
  payload: any;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}