
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...Object.values(ProjectCategory)];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter">System Index</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A technical archive of platforms, mechanical systems, and research deployments across the embedded and digital frontier.
          </p>
        </div>
        <div className="flex p-1 bg-slate-900/50 border border-white/5 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-lg transition-premium ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-lg transition-premium ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-16 items-center border-b border-white/5 pb-12">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-premium" size={16} />
          <input 
            type="text" 
            placeholder="Search registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-premium placeholder:text-slate-600"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full no-scrollbar px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-premium border ${
                selectedCategory === cat 
                  ? 'bg-white border-white text-black shadow-lg shadow-white/5' 
                  : 'bg-transparent border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {viewMode === 'grid' ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {filteredProjects.map(project => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group flex flex-col h-full"
              >
                <Link to={`/projects/${project.slug}`} className="flex flex-col h-full space-y-6">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest px-2 py-1 bg-slate-950/80 backdrop-blur rounded border border-cyan-500/20">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow space-y-3">
                    <h3 className="text-xl font-extrabold text-white uppercase tracking-tight group-hover:text-cyan-400 transition-premium">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center text-cyan-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-premium">
                    Deployment Details <ArrowUpRight size={14} className="ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="space-y-6"
          >
            {filteredProjects.map(project => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group bg-slate-900/30 border border-white/5 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-10 hover:border-white/10 hover:bg-slate-900/50 transition-premium"
              >
                <div className="w-full md:w-56 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border border-white/5 bg-slate-950">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-premium" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">{project.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                    <span className="text-[9px] text-slate-600 font-mono uppercase truncate max-w-[200px]">{project.techStack.join(' // ')}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-cyan-400 transition-premium">{project.title}</h3>
                  <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">{project.description}</p>
                </div>
                <Link to={`/projects/${project.slug}`} className="px-8 py-3 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-premium shadow-lg">
                  Analyze
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <div className="py-40 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900/50 rounded-full mb-4 border border-white/5">
            <Search className="text-slate-700" size={32} />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Zero Nodes Found</h3>
          <p className="text-slate-500 text-sm">Expand search parameters or clear filters.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
