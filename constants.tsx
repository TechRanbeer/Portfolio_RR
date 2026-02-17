import { Project, ProjectCategory, Blog, Experience, SiteConfig } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'moneo-ai',
    slug: 'moneo-budgeting',
    title: 'Moneo – AI-Driven Budgeting Platform',
    description: 'Lead Developer | Hackathon Project (Nov. 2025)',
    longDescription: 'Architected a production-ready web application leveraging the Google Gemini API to provide real-time financial insights and automated expense categorization. Implemented a responsive frontend using React and TypeScript, ensuring high performance and a seamless user experience across devices. Deployed the final product on Netlify, managing environment variables and API security for live user traffic.',
    category: ProjectCategory.AI_ML,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
    ],
    deploymentSpecs: [
      { category: 'HOST', label: 'Deployment', value: 'Netlify', order_index: 0 },
      { category: 'SECURITY', label: 'Auth Protocol', value: 'JWT / OAuth2', order_index: 1 },
      { category: 'INFRA', label: 'Runtime', value: 'Node.js 20.x', order_index: 2 }
    ],
    techStack: ['React', 'TypeScript', 'Gemini API', 'Tailwind', 'Supabase'],
    featureBlocks: [
      {
        title: 'Neural Categorization',
        description: 'Utilizes Gemini 3 Flash to analyze raw transaction strings and map them to localized tax-compliant categories with 98% confidence.',
        order_index: 0
      },
      {
        title: 'Reactive Projections',
        description: 'Real-time calculation of burn rates and future wealth forecasting using dynamic state management and persistent cloud storage.',
        order_index: 1
      }
    ],
    metrics: [
      { label: 'Accuracy', value: '98.4%' },
      { label: 'Latency', value: '<200ms' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Throughput', value: '10k TPS' }
    ],
    architectureImpact: 'Implemented a stateless micro-frontend architecture that reduced initial load times by 40% while maintaining absolute data consistency across high-concurrency user sessions.',
    scaleStrategyTitle: 'Distributed Context Management',
    scaleStrategyDescription: 'Leverages edge-computing for localized data processing, minimizing round-trip latency for global users.',
    latencyProfileTitle: 'Zero-Wait Processing',
    latencyProfileDescription: 'Optimized API polling with optimistic UI updates to ensure a lag-free financial management experience.',
    featured: true,
    status: 'published',
    isOngoing: false,
    createdAt: '2025-11-01T00:00:00.000Z'
  },
  {
    id: 'inventory-system',
    slug: 'inventory-management-system',
    title: 'Precision Inventory Node',
    description: 'Java Systems Developer | Personal Project (Mar. 2025 – Apr. 2025)',
    longDescription: 'Developed a high-reliability desktop application using Java Swing, featuring a GUI for efficient warehouse resource tracking. Built a relational database backend using MySQL and JDBC to handle persistent storage with full CRUD functionality and data integrity constraints.',
    category: ProjectCategory.FULL_STACK,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
    deploymentSpecs: [
      { category: 'CUSTOM', label: 'Platform', value: 'Windows/Linux', order_index: 0 },
      { category: 'INFRA', label: 'Relational DB', value: 'MySQL 8.0', order_index: 1 },
      { category: 'SECURITY', label: 'Access Control', value: 'RBAC (Role Based)', order_index: 2 }
    ],
    techStack: ['Java', 'Swing', 'JDBC', 'MySQL', 'Maven'],
    featureBlocks: [
      {
        title: 'ACID Transactions',
        description: 'Ensures absolute financial and resource integrity through robust database transaction management.',
        order_index: 0
      }
    ],
    metrics: [
      { label: 'Data Integrity', value: '100%' },
      { label: 'Query Speed', value: 'O(log n)' },
      { label: 'Capacity', value: '1M+ SKU' },
      { label: 'Recovery', value: '<1s' }
    ],
    architectureImpact: 'Designed a strictly decoupled MVC architecture for the desktop client, allowing for seamless backend migration from MySQL to PostgreSQL without modifying UI logic.',
    featured: true,
    status: 'published',
    isOngoing: false,
    createdAt: '2025-03-01T00:00:00.000Z'
  }
];

export const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: 'tachyon-moto',
    title: 'Senior Chassis Engineer',
    company: 'Tachyon Moto India, KJSCE',
    location: 'Mumbai, India',
    employmentType: 'FULL_TIME',
    startDate: '2025-09-01',
    isCurrent: true,
    achievements: [
      'Engineered vehicle chassis from first principles, managing full lifecycle from geometry definition to material selection and manufacturability.',
      'Optimized frame stiffness and weight via iterative ANSYS structural validation, ensuring safety margins met competition standards.',
      'Led cross-functional integration of engine, suspension, and braking subsystems using FMEA to preemptively mitigate design flaws.'
    ],
    orderIndex: 0
  },
  {
    id: 'team-eta',
    title: 'EV Powertrain Engineer',
    company: 'Team ETA India, KJSCE',
    location: 'Mumbai, India',
    employmentType: 'FULL_TIME',
    startDate: '2024-10-01',
    endDate: '2025-09-30',
    isCurrent: false,
    achievements: [
      'Engineered a drivetrain system and optimized gear ratios, increasing torque delivery by 15% and enhancing data accuracy for performance mapping.',
      'Authored 20+ pages of technical compliance for Shell Eco-marathon, achieving a 100% pass rate during safety and technical inspections.'
    ],
    orderIndex: 1
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  id: 1,
  logo_line1: 'Ranbeer',
  logo_line2: 'Raja',
  hero_headline_line1: 'Ranbeer',
  hero_headline_line2: 'Raja',
  hero_subtitle: 'Systems Specialist & Mechanical Engineer',
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