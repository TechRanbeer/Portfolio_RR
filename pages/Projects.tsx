
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-white mb-4">Engineering Catalog</h1>
          <p className="text-slate-400 text-lg">
            A comprehensive look at the systems, platforms, and research initiatives I've led over the past decade.
          </p>
        </div>
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search stack, keywords, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full no-scrollbar pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedCategory === cat 
                  ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group"
            >
              <Link to={`/projects/${project.slug}`}>
                <div className="aspect-video relative overflow-hidden">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 px-2 py-1 bg-slate-950/80 backdrop-blur rounded text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[10px] bg-slate-800 text-slate-500 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Architecture <ArrowUpRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <motion.div
              layout
              key={project.id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-slate-700 transition-colors group"
            >
              <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden shrink-0">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-cyan-500">{project.category}</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-[10px] text-slate-500 uppercase">{project.techStack.join(', ')}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm max-w-2xl">{project.description}</p>
              </div>
              <Link to={`/projects/${project.slug}`} className="px-6 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors shrink-0">
                Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-6">
            <Search className="text-slate-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No systems found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
