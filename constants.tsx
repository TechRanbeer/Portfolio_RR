
import { Project, ProjectCategory, Blog, Experience, SiteConfig } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'moneo-ai',
    slug: 'moneo-budgeting',
    title: 'Moneo – AI-Driven Budgeting Platform',
    description: 'Lead Developer | Hackathon Project (Nov. 2025)',
    longDescription: 'Architected a production-ready web application leveraging the Google Gemini API to provide real-time financial insights and automated expense categorization. Implemented a responsive frontend using React and TypeScript, ensuring high performance and a seamless user experience across devices. Deployed the final product on Netlify, managing environment variables and API security for live user traffic.',
    category: ProjectCategory.AI_ML,
    tags: ['React', 'TypeScript', 'Gemini API', 'Tailwind'],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'Deployment', value: 'Netlify' },
      { label: 'Category', value: 'Hackathon' }
    ],
    techStack: ['React', 'TypeScript', 'Gemini API', 'Tailwind'],
    featured: true,
    status: 'published',
    createdAt: '2025-11-01T00:00:00.000Z'
  },
  {
    id: 'inventory-system',
    slug: 'inventory-management-system',
    title: 'Inventory Management System',
    description: 'Java Developer | Personal Project (Mar. 2025 – Apr. 2025)',
    longDescription: 'Developed a desktop application using Java Swing, featuring a GUI for efficient warehouse resource tracking. Built a relational database backend using MySQL and JDBC to handle persistent storage with full CRUD functionality and data integrity constraints.',
    category: ProjectCategory.FULL_STACK,
    tags: ['Java', 'MySQL', 'JDBC', 'Swing'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'Type', value: 'Desktop' },
      { label: 'Database', value: 'MySQL' }
    ],
    techStack: ['Java', 'Swing', 'JDBC', 'MySQL'],
    featured: true,
    status: 'published',
    createdAt: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 'pi5-nas',
    slug: 'home-nas-self-hosting',
    title: 'Home NAS and Self-Hosting Lab',
    description: 'Systems Administrator | Personal Lab (Feb. 2025 – Present)',
    longDescription: 'Configured a localized cloud environment using a Raspberry Pi 5 and Docker, deploying services like CasaOS, Nextcloud, and Cockpit for automated data backups. Established a secure Mesh VPN using Tailscale, enabling encrypted remote access to the server without exposing ports to the public internet.',
    category: ProjectCategory.SYSTEM_DESIGN,
    tags: ['Ubuntu', 'Docker', 'Tailscale', 'CasaOS', 'Pi 5'],
    thumbnail: 'https://images.unsplash.com/photo-1629739884942-8678d138dd64?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1629739884942-8678d138dd64?q=80&w=1200&auto=format&fit=crop'],
    metrics: [
      { label: 'Host', value: 'Raspberry Pi 5' },
      { label: 'Security', value: 'Tailscale VPN' }
    ],
    techStack: ['Linux (CLI)', 'Docker', 'CasaOS', 'Tailscale', 'Networking'],
    featured: true,
    status: 'published',
    createdAt: '2025-02-01T00:00:00.000Z'
  }
];

export const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: 'tachyon-moto',
    title: 'Senior Chassis Engineer',
    company: 'Tachyon Moto India, KJSCE',
    period: 'Sep. 2025 – Present',
    achievements: [
      'Engineered vehicle chassis from first principles, managing full lifecycle from geometry definition to material selection and manufacturability.',
      'Optimized frame stiffness and weight via iterative ANSYS structural validation, ensuring safety margins met competition standards.',
      'Led cross-functional integration of engine, suspension, and braking subsystems using FMEA to preemptively mitigate design flaws.'
    ],
    order: 0
  },
  {
    id: 'team-eta',
    title: 'EV Powertrain Engineer',
    company: 'Team ETA India, KJSCE',
    period: 'Oct. 2024 – Sep. 2025',
    achievements: [
      'Engineered a drivetrain system and optimized gear ratios, increasing torque delivery by 15% and enhancing data accuracy for performance mapping.',
      'Authored 20+ pages of technical compliance for Shell Eco-marathon, achieving a 100% pass rate during safety and technical inspections.'
    ],
    order: 1
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  id: 'default',
  logo_line1: 'Ranbeer',
  logo_line2: 'Raja',
  hero_headline_line1: 'Ranbeer',
  hero_headline_line2: 'Raja',
  hero_subtitle: 'Mechanical Engineer & Systems Specialist',
  contact_email: 'ranbeerraja1@gmail.com',
  contact_phone: '+91 97692 20377',
  location: 'Thane, Maharashtra, India',
  bio_summary: 'High-impact Mechanical Engineering student with full design ownership of vehicle systems in competitive engineering environments. Specialized in end-to-end chassis architecture, powertrain optimization, and structural validation using ANSYS. Proven track record of bridging the gap between hardware engineering and modern software stacks, including AI/ML integration, Linux systems, and full-stack development.',
  social_links: {
    github: 'https://github.com/TechRanbeer',
    linkedin: 'https://linkedin.com/in/ranbeerraja'
  }
};

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
