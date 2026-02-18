
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Github, Globe, ArrowUpRight, Cpu, MessageSquare, Layers, Server, Terminal, Zap, Activity } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <Link to="/projects" className="inline-flex items-center text-slate-500 hover:text-white transition-premium mb-12">
        <ChevronLeft size={16} />
        <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]">Return to Registry</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left: Content */}
        <div className="lg:col-span-8 space-y-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-4 py-1.5 bg-cyan-600/10 border border-cyan-500/20 rounded-full">
                {project.category}
              </span>
              <span className="text-slate-800 font-mono text-xs">/</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">DEPLOYMENT_STABLE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight">
              {project.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl text-balance">
              {project.description}
            </p>
          </motion.div>

          {/* Media Showcase */}
          <div className="space-y-6">
            <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-2xl relative group">
              <img src={project.images[activeImage] || project.thumbnail} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-premium duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[project.thumbnail, ...project.images].map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-40 aspect-video shrink-0 rounded-2xl overflow-hidden border-2 transition-premium ${activeImage === idx ? 'border-cyan-500 scale-105 shadow-lg shadow-cyan-500/20' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <section className="space-y-20">
            {/* Architecture Section with absolute formatting preservation */}
            <div className="space-y-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                <Layers className="text-cyan-500" size={24} /> System Architecture & Technical Overview
              </h2>
              <div 
                className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap font-medium"
                style={{ fontFamily: 'inherit', wordBreak: 'break-word', tabSize: 4 }}
              >
                {project.architectureImpact || project.longDescription}
              </div>
            </div>

            {/* Scale Strategy & Latency Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(project.scaleStrategyTitle || project.scaleStrategyDescription) && (
                <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6 backdrop-blur-sm">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
                    <Activity className="text-cyan-500" size={20} /> Scale Strategy
                  </h3>
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">{project.scaleStrategyTitle || "Node Expansion"}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.scaleStrategyDescription}</p>
                  </div>
                </div>
              )}
              {(project.latencyProfileTitle || project.latencyProfileDescription) && (
                <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6 backdrop-blur-sm">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
                    <Zap className="text-cyan-500" size={20} /> Latency Profile
                  </h3>
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">{project.latencyProfileTitle || "Inference Dynamics"}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.latencyProfileDescription}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 sticky top-32 space-y-12 backdrop-blur-md">
            
            {/* Core Protocol Stack */}
            <div className="space-y-8">
              <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-3">
                <Cpu className="text-cyan-400" size={20} /> Core Protocol Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-4 py-2 bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Infrastructure Matrix */}
            <div className="space-y-8">
               <h4 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-3">
                 <Server className="text-cyan-400" size={20} /> Infrastructure Matrix
               </h4>
               <div className="space-y-4">
                  {project.deploymentSpecs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <Terminal size={18} className="text-slate-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase text-right">{s.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* GitHub Repo Access */}
            <div className="space-y-6">
              <h4 className="text-[10px] text-slate-600 uppercase font-black tracking-[0.3em] mb-2 px-1">GitHub Repo</h4>
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-white text-black hover:bg-cyan-400 rounded-2xl transition-premium shadow-2xl group">
                  <div className="flex items-center gap-5">
                    <Github size={24} />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest">Repository</span>
                      <span className="text-[9px] text-slate-500 font-mono truncate max-w-[140px] lowercase">{project.githubUrl.split('github.com/')[1]}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-black transition-all" />
                </a>
              ) : (
                <div className="p-6 bg-slate-900/30 rounded-2xl border border-dashed border-white/5 text-center">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Private Infrastructure</span>
                </div>
              )}
              
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-cyan-600/10 hover:bg-cyan-600/20 rounded-2xl transition-premium text-cyan-400 border border-cyan-500/20 group">
                  <div className="flex items-center gap-5">
                    <Globe size={24} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Deployment Node</span>
                  </div>
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>

            <button 
              onClick={() => navigate('/chat', { state: { initialPrompt: `Deconstruct the architectural specifications of ${project.title}.` } })}
              className="w-full py-5 bg-slate-800 text-white border border-white/10 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-premium group shadow-2xl"
            >
              <MessageSquare size={18} className="mr-3" />
              AI Technical Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
