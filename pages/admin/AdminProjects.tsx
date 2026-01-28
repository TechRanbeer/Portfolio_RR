import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, ChevronLeft, Upload, X } from 'lucide-react';
import { Project, ProjectCategory } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminProjectsProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: ProjectCategory.SYSTEM_DESIGN,
    techStack: [],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  });

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFeatured = (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
    onUpdate(updated);
    storageService.saveProjects(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : (p as Project));
    onUpdate(updated as Project[]);
    storageService.saveProjects(updated as Project[]);
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Confirm permanent deletion of this system entry?')) {
      const updated = projects.filter(p => p.id !== id);
      onUpdate(updated);
      storageService.saveProjects(updated);
    }
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) return;
    
    const project: Project = {
      id: Math.random().toString(36).substr(2, 9),
      slug: (newProject.title || '').toLowerCase().replace(/ /g, '-'),
      title: newProject.title || '',
      description: newProject.description || '',
      longDescription: newProject.description || '',
      category: newProject.category as ProjectCategory,
      tags: [],
      thumbnail: newProject.thumbnail || '',
      images: [newProject.thumbnail || ''],
      techStack: newProject.techStack || ['General Engineering'],
      metrics: [{ label: 'Performance', value: 'Optimized' }],
      featured: false,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    const updated = [project, ...projects];
    onUpdate(updated);
    storageService.saveProjects(updated);
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-6">
        <ChevronLeft size={20} />
        <span className="ml-1 text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Project Registry</h1>
          <p className="text-slate-400">Technical documentation and asset management.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white uppercase">System Configuration</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                  <input 
                    type="text" 
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" 
                    placeholder="Project Name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select 
                    value={newProject.category}
                    onChange={e => setNewProject({...newProject, category: e.target.value as ProjectCategory})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                  >
                    {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Technical Summary</label>
                  <textarea 
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white h-32 focus:border-cyan-500 outline-none" 
                    placeholder="Architecture overview..."
                  ></textarea>
                </div>
                <button 
                  onClick={handleAddProject}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  Publish to Registry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">System Node</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Class</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-center">Featured</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded bg-slate-800 overflow-hidden shrink-0">
                        <img src={project.thumbnail} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{project.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">{project.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 font-medium">{project.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleFeatured(project.id)}
                      className={`p-1.5 rounded-lg transition-all ${project.featured ? 'text-yellow-500 bg-yellow-500/10 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <Star size={18} fill={project.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => toggleStatus(project.id)} className={`p-2 rounded hover:bg-slate-700 transition-colors ${project.status === 'published' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {project.status === 'published' ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button onClick={() => deleteProject(project.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;