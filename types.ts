
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
  // New AI Context Fields
  aiContext?: string;
  lastAiSync?: string;
}

// Fix: Added missing Blog interface which was causing multiple module errors
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
