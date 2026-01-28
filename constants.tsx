
import { Project, ProjectCategory, Blog } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'moneo-ai',
    slug: 'moneo-budgeting',
    title: 'Moneo – AI-Driven Budgeting Platform',
    description: 'A production-ready web app delivering real-time financial insights via Google Gemini API.',
    longDescription: 'Built a production-ready web app delivering real-time financial insights via Google Gemini API. This platform allows users to track expenses and receive intelligent financial advice based on their spending patterns.',
    category: ProjectCategory.AI_ML,
    tags: ['React', 'TypeScript', 'Gemini API', 'Tailwind'],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'API Latency', value: '< 2s' },
      { label: 'Uptime', value: '99.9%' }
    ],
    techStack: ['React', 'TypeScript', 'Netlify', 'Gemini API'],
    featured: true,
    status: 'published',
    createdAt: '2025-11-01T00:00:00.000Z'
  },
  {
    id: 'pi5-nas',
    slug: 'home-nas-self-hosting',
    title: 'Home NAS & Self-Hosting (Raspberry Pi 5)',
    description: 'Docker-based NAS using CasaOS, Nextcloud, and Cockpit with secure remote access via Tailscale.',
    longDescription: 'Built a Docker-based NAS using CasaOS, Nextcloud, and Cockpit with secure remote access via Tailscale. Designed for high-speed local storage and private cloud services, utilizing the Raspberry Pi 5 architecture for optimal power-to-performance ratio.',
    category: ProjectCategory.SYSTEM_DESIGN,
    tags: ['Ubuntu', 'Docker', 'Tailscale', 'CasaOS', 'NVMe'],
    thumbnail: 'https://images.unsplash.com/photo-1629739884942-8678d138dd64?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1629739884942-8678d138dd64?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'Remote Speed', value: '1Gbps+' },
      { label: 'Security', value: 'VPN Layer' }
    ],
    techStack: ['Linux (CLI)', 'Docker', 'CasaOS', 'Tailscale', 'Networking'],
    featured: true,
    status: 'published',
    createdAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'inventory-system',
    slug: 'inventory-management-system',
    title: 'Inventory Management System (Java + MySQL)',
    description: 'Desktop system with Swing GUI and full CRUD operations using MySQL + JDBC.',
    longDescription: 'Designed a desktop system with Swing GUI and full CRUD operations using MySQL + JDBC. Implemented advanced stock tracking algorithms and secure database interactions for commercial-grade inventory monitoring.',
    category: ProjectCategory.FULL_STACK,
    tags: ['Java', 'MySQL', 'JDBC', 'Swing'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'DB Query', value: '12ms' },
      { label: 'Relational', value: 'ACID' }
    ],
    techStack: ['Java IDE', 'MySQL', 'JDBC', 'Swing'],
    featured: true,
    status: 'published',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'b1',
    slug: 'chassis-design-principles',
    title: 'Chassis Design: From First Principles to Validation',
    excerpt: 'An exploration of end-to-end vehicle chassis engineering using SolidWorks and ANSYS.',
    content: 'Full post coming soon...',
    author: 'Ranbeer Raja',
    tags: ['Mechanical', 'SolidWorks', 'ANSYS'],
    readingTime: '8 min',
    publishedAt: new Date().toISOString(),
    status: 'published'
  }
];
