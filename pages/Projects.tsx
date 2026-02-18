
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight uppercase leading-none">Registry</h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            An archive of platforms, mechanical systems, and digital deployments across the embedded frontier.
          </p>
        </div>
        <div className="flex p-1 bg-slate-900/50 border border-white/5 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-lg transition-premium ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-lg transition-premium ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-16 items-center">
        <div className="relative w-full md:max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-premium" size={18} />
          <input 
            type="text" 
            placeholder="Filter systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-premium placeholder:text-slate-600 font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full no-scrollbar px-1 py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-premium border ${
                selectedCategory === cat 
                  ? 'bg-white border-white text-black shadow-xl shadow-white/5' 
                  : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map(project => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 hover:bg-slate-900/40 hover:border-white/10 transition-premium flex flex-col h-full"
              >
                <Link to={`/projects/${project.slug}`} className="flex flex-col h-full space-y-6">
                  <div className="aspect-[16/11] relative overflow-hidden rounded-2xl bg-slate-950">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  </div>
                  <div className="flex-grow space-y-2">
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-premium leading-none">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center text-cyan-500 text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-premium">
                    View System <ArrowUpRight size={14} className="ml-1" />
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
                className="group bg-slate-900/20 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 hover:border-white/10 hover:bg-slate-900/40 transition-premium"
              >
                <div className="w-full md:w-56 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border border-white/5 bg-slate-950">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-cyan-500">{project.category}</span>
                    <span className="text-slate-700 font-mono">/</span>
                    <span className="text-slate-500">{project.techStack.slice(0, 3).join(' • ')}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-premium leading-none">{project.title}</h3>
                  <p className="text-slate-400 text-base max-w-2xl leading-relaxed font-medium">{project.description}</p>
                </div>
                <Link to={`/projects/${project.slug}`} className="px-10 py-4 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-premium shadow-xl shrink-0">
                  Analyze
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
