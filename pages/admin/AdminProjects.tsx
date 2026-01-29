
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, ChevronLeft, BrainCircuit, Sparkles, X, Loader2 } from 'lucide-react';
import { Project, ProjectCategory } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { geminiService } from '../../services/geminiService';

interface AdminProjectsProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: ProjectCategory.SYSTEM_DESIGN,
    techStack: [],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  });

  const generateAiSummary = async () => {
    if (!newProject.title) return;
    setAiLoading(true);
    const summary = await geminiService.generateTechnicalSummary(newProject as Project);
    setNewProject({ ...newProject, description: summary });
    setAiLoading(false);
  };

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleFeatured = async (id: string) => {
    const p = projects.find(x => x.id === id);
    if (p) {
      const updated = { ...p, featured: !p.featured };
      await storageService.saveProject(updated);
      onUpdate(projects.map(x => x.id === id ? updated : x));
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Erase node from registry?')) {
      await storageService.deleteProject(id);
      onUpdate(projects.filter(p => p.id !== id));
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title) return;
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
      metrics: [{ label: 'Performance', value: 'Verified' }],
      featured: false,
      status: 'published',
      createdAt: new Date().toISOString()
    };
    await storageService.saveProject(project);
    onUpdate([project, ...projects]);
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-6">
        <ChevronLeft size={20} />
        <span className="ml-1 text-[10px] font-black uppercase tracking-widest">Core Command</span>
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Project Registry</h1>
          <p className="text-slate-400 text-sm">Hardware & Software Deployments</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-all">
          <Plus size={18} /><span>Deploy New Node</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-12 p-10 bg-slate-900 border border-white/5 rounded-3xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center">
                <Sparkles size={20} className="text-cyan-400 mr-3" /> Project Configuration
              </h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Project Title</label>
                  <input type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Category</label>
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as ProjectCategory})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none">
                    {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical Summary</label>
                    <button onClick={generateAiSummary} disabled={aiLoading || !newProject.title} className="text-[9px] font-black text-cyan-400 uppercase flex items-center hover:text-cyan-300 disabled:opacity-30">
                      {aiLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : <BrainCircuit size={12} className="mr-1" />} 
                      AI Generate
                    </button>
                  </div>
                  <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none resize-none" />
                </div>
                <button onClick={handleAddProject} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors">Confirm Deployment</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Filter registry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">
              <tr>
                <th className="px-8 py-5">Node Entry</th>
                <th className="px-8 py-5">Class</th>
                <th className="px-8 py-5 text-center">Featured</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-white/5">
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{p.title}</span>
                        <span className="text-[9px] text-slate-600 font-mono uppercase">OID: {p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="text-xs text-slate-400 font-medium">{p.category}</span></td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={() => toggleFeatured(p.id)} className={`p-2 rounded-lg transition-all ${p.featured ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-700'}`}>
                      <Star size={18} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end space-x-2">
                    <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
