import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Star, ChevronLeft, BrainCircuit, Sparkles, X, Loader2, Save, Layout, Settings, Layers, BarChart3, Globe } from 'lucide-react';
import { Project, ProjectCategory, MainTag, TechStackTag } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { geminiService } from '../../services/geminiService';

interface AdminProjectsProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'base' | 'features' | 'specs' | 'seo'>('base');
  
  const [mainTags, setMainTags] = useState<MainTag[]>([]);
  const [techTags, setTechTags] = useState<TechStackTag[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const [m, t] = await Promise.all([storageService.getMainTags(), storageService.getTechStackTags()]);
      setMainTags(m);
      setTechTags(t);
    };
    fetchTags();
  }, []);

  const startEdit = (p: Project | null) => {
    setEditingProject(p || {
      id: crypto.randomUUID(),
      slug: '',
      title: '',
      description: '',
      longDescription: '',
      category: ProjectCategory.SYSTEM_DESIGN,
      thumbnail: '',
      images: [],
      metrics: [],
      techStack: [],
      featureBlocks: [],
      deploymentSpecs: [],
      featured: false,
      status: 'published',
      isOngoing: false,
      createdAt: new Date().toISOString()
    });
    setIsEditing(true);
    setActiveTab('base');
  };

  const handleSave = async () => {
    if (!editingProject || !editingProject.title) return;
    try {
      await storageService.saveProject(editingProject);
      const updated = await storageService.getProjects();
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Error saving: " + (err as Error).message);
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Erase node? (Soft delete applied)')) {
      await storageService.deleteProject(id);
      onUpdate(projects.filter(p => p.id !== id));
    }
  };

  const toggleTechTag = (tagName: string) => {
    if (!editingProject) return;
    const exists = editingProject.techStack.includes(tagName);
    setEditingProject({
      ...editingProject,
      techStack: exists 
        ? editingProject.techStack.filter(t => t !== tagName) 
        : [...editingProject.techStack, tagName]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-6">
        <ChevronLeft size={20} />
        <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-xs">Mission Dashboard</span>
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Registry Management</h1>
          <p className="text-slate-400 text-sm">Centralized node control for your engineering fleet.</p>
        </div>
        <button onClick={() => startEdit(null)} className="flex items-center space-x-2 px-8 py-4 bg-cyan-600 text-white font-black rounded-xl hover:bg-cyan-500 transition-all uppercase text-xs tracking-widest shadow-lg">
          <Plus size={18} /><span>Provision Node</span>
        </button>
      </div>

      <AnimatePresence>
        {isEditing && editingProject && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400"><Settings size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Configuration Engine</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{editingProject.title || 'New Node Definition'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleSave} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2">
                    <Save size={14} /> Commit Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-3 text-slate-500 hover:text-white"><X size={24} /></button>
                </div>
              </div>

              <div className="flex flex-grow overflow-hidden">
                <div className="w-64 border-r border-white/5 bg-slate-950/20 p-6 flex flex-col gap-2">
                  {[
                    { id: 'base', label: 'Identity', icon: <Layers size={16} /> },
                    { id: 'features', label: 'Blocks', icon: <Layout size={16} /> },
                    { id: 'specs', label: 'Specs', icon: <BarChart3 size={16} /> },
                    { id: 'seo', label: 'SEO', icon: <Globe size={16} /> }
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                  {activeTab === 'base' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Project Title</label>
                          <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Registry Class</label>
                          <select value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value as ProjectCategory})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none">
                            {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Main Tag</label>
                          <select value={editingProject.mainTagId} onChange={e => setEditingProject({...editingProject, mainTagId: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none">
                            <option value="">None</option>
                            {mainTags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Lead Image URL</label>
                          <input type="text" value={editingProject.thumbnail} onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Tech Stack Matrix</label>
                        <div className="flex flex-wrap gap-2 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                          {techTags.map(tag => (
                            <button key={tag.id} onClick={() => toggleTechTag(tag.name)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editingProject.techStack.includes(tag.name) ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 hover:text-slate-400'}`}>
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Layout size={16} className="text-cyan-400" /> System Modules</h3>
                        <button onClick={() => setEditingProject({...editingProject, featureBlocks: [...editingProject.featureBlocks, { title: 'New Module', description: '', order_index: editingProject.featureBlocks.length }]})} className="px-4 py-2 bg-slate-800 text-[10px] text-white font-black uppercase tracking-widest rounded-lg">+ Add Block</button>
                      </div>
                      <div className="space-y-4">
                        {editingProject.featureBlocks.map((block, i) => (
                          <div key={i} className="p-8 bg-slate-950 border border-white/5 rounded-[2rem] space-y-4 relative">
                            <button onClick={() => setEditingProject({...editingProject, featureBlocks: editingProject.featureBlocks.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 p-2 text-slate-600 hover:text-red-500"><Trash2 size={16} /></button>
                            <input type="text" placeholder="Block Title" value={block.title} onChange={e => {
                                const newBlocks = [...editingProject.featureBlocks];
                                newBlocks[i].title = e.target.value;
                                setEditingProject({...editingProject, featureBlocks: newBlocks});
                            }} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" />
                            <textarea placeholder="Technical details..." value={block.description} onChange={e => {
                                const newBlocks = [...editingProject.featureBlocks];
                                newBlocks[i].description = e.target.value;
                                setEditingProject({...editingProject, featureBlocks: newBlocks});
                            }} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2"><BarChart3 size={16} className="text-cyan-400" /> Infrastructure Manifest</h3>
                        <button onClick={() => setEditingProject({...editingProject, deploymentSpecs: [...editingProject.deploymentSpecs, { category: 'CUSTOM', label: '', value: '', order_index: editingProject.deploymentSpecs.length }]})} className="px-4 py-2 bg-slate-800 text-[10px] text-white font-black uppercase tracking-widest rounded-lg">+ New Entry</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {editingProject.deploymentSpecs.map((spec, i) => (
                          <div key={i} className="flex gap-2 items-center bg-slate-950 p-4 border border-white/5 rounded-2xl">
                            <input type="text" placeholder="Key" value={spec.label} onChange={e => {
                              const newSpecs = [...editingProject.deploymentSpecs];
                              newSpecs[i].label = e.target.value;
                              setEditingProject({...editingProject, deploymentSpecs: newSpecs});
                            }} className="w-1/3 bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-white outline-none" />
                            <input type="text" placeholder="Value" value={spec.value} onChange={e => {
                              const newSpecs = [...editingProject.deploymentSpecs];
                              newSpecs[i].value = e.target.value;
                              setEditingProject({...editingProject, deploymentSpecs: newSpecs});
                            }} className="flex-grow bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-cyan-400 outline-none" />
                            <button onClick={() => setEditingProject({...editingProject, deploymentSpecs: editingProject.deploymentSpecs.filter((_, idx) => idx !== i)})} className="p-2 text-slate-700 hover:text-red-500"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Globe size={16} className="text-cyan-400" /> Public Discovery Data</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Meta Title Override</label>
                          <input type="text" value={editingProject.metaTitle} onChange={e => setEditingProject({...editingProject, metaTitle: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Meta Description</label>
                          <textarea value={editingProject.metaDescription} onChange={e => setEditingProject({...editingProject, metaDescription: e.target.value})} className="w-full h-24 bg-slate-950 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none resize-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Locate node..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">
              <tr>
                <th className="px-8 py-5">System Identity</th>
                <th className="px-8 py-5">Class</th>
                <th className="px-8 py-5 text-center">Featured</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-white/5">
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{p.title}</span>
                        <span className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">OID: {p.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><span className="text-xs text-slate-400 font-medium">{p.category}</span></td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={async () => {
                      const updated = { ...p, featured: !p.featured };
                      await storageService.saveProject(updated);
                      onUpdate(projects.map(x => x.id === p.id ? updated : x));
                    }} className={`p-2 rounded-lg transition-all ${p.featured ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-700 hover:text-slate-400'}`}>
                      <Star size={18} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end space-x-2">
                    <button onClick={() => startEdit(p)} className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 transition-all"><Settings size={18} /></button>
                    <button onClick={() => deleteProject(p.id)} className="p-3 bg-slate-800 rounded-xl text-slate-600 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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