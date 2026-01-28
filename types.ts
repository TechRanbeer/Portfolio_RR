
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

export interface AnalyticsData {
  views: number;
  aiQueries: number;
  resumeDownloads: number;
  conversionRate: number;
  dailyStats: { date: string; views: number }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}
