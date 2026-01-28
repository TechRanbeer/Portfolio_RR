
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Github, Globe, ArrowUpRight, Cpu, Zap, Activity, MessageSquare } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailProps {
  projects: Project[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.slug === slug);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">System Node Not Found</h2>
        <Link to="/projects" className="text-cyan-400 hover:underline">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/projects" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-12">
        <ChevronLeft size={20} />
        <span className="ml-1 text-sm font-bold uppercase tracking-widest">Back to Fleet</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Content */}
        <div className="lg:col-span-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 bg-cyan-600/10 border border-cyan-500/20 rounded-full">
                {project.category}
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-xs text-slate-500 font-mono">v{Math.floor(Math.random()*2)+1}.{Math.floor(Math.random()*9)} (Stable)</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
              {project.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </motion.div>

          {/* Media Showcase */}
          <div className="space-y-4">
            <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img src={project.images[activeImage]} alt={project.title} className="w-full h-full object-cover" />
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {project.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-32 aspect-video shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-cyan-500 scale-105' : 'border-slate-800 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technical Deep Dive */}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4 mb-8">System Architecture & Impact</h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>{project.longDescription}</p>
              <p>
                The primary challenge in this deployment was managing the high-concurrency 
                bottlenecks inherent in traditional centralized architectures. By implementing 
                a decentralized mesh topology, we reduced cross-service communication overhead 
                by approximately 40%.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="flex items-start bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <Activity className="text-cyan-400 mr-4 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold m-0 mb-1">Scale Strategy</h4>
                    <p className="m-0 text-sm">Horizontally auto-scaling clusters based on real-time VPC pressure metrics.</p>
                  </div>
                </li>
                <li className="flex items-start bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <Zap className="text-cyan-400 mr-4 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold m-0 mb-1">Latency Profile</h4>
                    <p className="m-0 text-sm">Optimized hot-paths using custom zero-copy serialization protocols.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Action Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24">
            <h3 className="text-white font-bold mb-6 flex items-center">
              <Cpu className="text-cyan-400 mr-2" size={20} />
              Deployment Specs
            </h3>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {project.metrics.map(metric => (
                <div key={metric.label} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="text-cyan-400 font-black text-lg">{metric.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-4">Core Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="space-y-3 mb-8">
              {project.githubUrl && (
                <a href={project.githubUrl} className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors text-white text-sm">
                  <span className="flex items-center"><Github size={18} className="mr-3" /> Repository</span>
                  <ArrowUpRight size={16} className="text-slate-500" />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} className="flex items-center justify-between p-4 bg-cyan-600/10 hover:bg-cyan-600/20 rounded-xl transition-colors text-cyan-400 text-sm border border-cyan-500/20">
                  <span className="flex items-center"><Globe size={18} className="mr-3" /> Live Instance</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>

            {/* AI Callout */}
            <button 
              onClick={() => navigate('/chat', { state: { initialPrompt: `Tell me more about ${project.title}` } })}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center hover:bg-cyan-400 transition-colors group"
            >
              <MessageSquare size={18} className="mr-2" />
              Ask AI about this
              <ArrowUpRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
