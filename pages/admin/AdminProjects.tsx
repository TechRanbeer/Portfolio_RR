import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Trash2, Star, ChevronLeft, X, Loader2, Save, Layout, Settings, 
  Layers, BarChart3, Globe, Command, Zap, Activity, Cpu, Server, Shield, 
  Terminal, Tag, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { Project, ProjectCategory, MainTag, TechStackTag, SpecCategory, ProjectFeatureBlock, ProjectDeploymentSpec } from '../../types';
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
  const [activeTab, setActiveTab] = useState<'base' | 'tech' | 'features' | 'specs' | 'seo'>('base');
  
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

  const groupedTechTags = useMemo(() => {
    const groups: Record<string, TechStackTag[]> = {};
    techTags.forEach(tag => {
      const cat = tag.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(tag);
    });
    return groups;
  }, [techTags]);

  const startEdit = (p: Project | null) => {
    const projectData = p ? (JSON.parse(JSON.stringify(p)) as Project) : {
      id: crypto.randomUUID(),
      slug: '',
      title: '',
      description: '',
      longDescription: '',
      category: ProjectCategory.SYSTEM_DESIGN,
      thumbnail: '',
      images: [],
      metrics: Array(4).fill({ label: '', value: '' }),
      techStack: [],
      featureBlocks: [],
      deploymentSpecs: [],
      featured: false,
      status: 'published',
      isOngoing: false,
      createdAt: new Date().toISOString()
    } as Project;

    // Ensure metrics array always has 4 slots for the UI
    if (projectData.metrics.length < 4) {
      const currentLen = projectData.metrics.length;
      for (let i = 0; i < 4 - currentLen; i++) {
        projectData.metrics.push({ label: '', value: '' });
      }
    }

    setEditingProject(projectData);
    setIsEditing(true);
    setActiveTab('base');
  };

  const handleSave = async () => {
    if (!editingProject || !editingProject.title) return;
    try {
      // Clean up empty metrics before saving
      const cleanedProject = {
        ...editingProject,
        metrics: editingProject.metrics.filter(m => m.label.trim() !== '' || m.value.trim() !== ''),
        images: editingProject.images.filter(img => img.trim() !== '')
      };
      await storageService.saveProject(cleanedProject);
      const updated = await storageService.getProjects();
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      alert("System Registry Error: " + (err as Error).message);
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Terminate project node in database?')) {
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

  const handleAiDeepDive = async () => {
    if (!editingProject) return;
    setAiLoading(true);
    try {
      const summary = await geminiService.generateTechnicalSummary(editingProject);
      setEditingProject({ ...editingProject, architectureImpact: summary });
    } finally {
      setAiLoading(false);
    }
  };

  const updateMetric = (idx: number, field: 'label' | 'value', value: string) => {
    if (!editingProject) return;
    const newMetrics = [...editingProject.metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };
    setEditingProject({ ...editingProject, metrics: newMetrics });
  };

  const updateImage = (idx: number, value: string) => {
    if (!editingProject) return;
    const newImages = [...editingProject.images];
    newImages[idx] = value;
    setEditingProject({ ...editingProject, images: newImages });
  };

  const addImageSlot = () => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, images: [...editingProject.images, ''] });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-white transition-premium mb-12">
        <ChevronLeft size={16} />
        <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em]">Exit Control</span>
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Registry Console</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Operational Node Deployment Manager</p>
        </div>
        <button onClick={() => startEdit(null)} className="flex items-center space-x-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 transition-premium uppercase text-[11px] tracking-widest shadow-2xl">
          <Plus size={16} /><span>Register New Node</span>
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-10 border-b border-white/5">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-premium" size={18} />
            <input 
              type="text" 
              placeholder="Search registry indices..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-8 py-4 text-sm text-slate-200 focus:outline-none focus:border-white/10 transition-premium placeholder:text-slate-700" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-white/5 text-[10px] uppercase font-black text-slate-600 tracking-[0.3em]">
              <tr>
                <th className="px-10 py-8">Node Identity / Slug</th>
                <th className="px-10 py-8">Classification</th>
                <th className="px-10 py-8 text-center">Showcase</th>
                <th className="px-10 py-8 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-premium group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-12 rounded-xl bg-slate-950 overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-premium">
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-30 group-hover:opacity-100 transition-premium" />
                      </div>
                      <div>
                        <span className="text-base font-black text-white block tracking-tight">{p.title}</span>
                        <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">SLUG: {p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8"><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{p.category}</span></td>
                  <td className="px-10 py-8 text-center">
                    <button onClick={async () => {
                      const updated = { ...p, featured: !p.featured };
                      await storageService.saveProject(updated);
                      onUpdate(projects.map(x => x.id === p.id ? updated : x));
                    }} className={`p-2.5 rounded-xl transition-premium ${p.featured ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-800 hover:text-slate-600'}`}>
                      <Star size={18} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-10 py-8 text-right flex justify-end space-x-4">
                    <button onClick={() => startEdit(p)} className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-600 hover:text-white transition-premium"><Settings size={18} /></button>
                    <button onClick={() => deleteProject(p.id)} className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-800 hover:text-red-500 transition-premium"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && editingProject && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-7xl bg-slate-900 border border-white/10 rounded-[3rem] flex flex-col max-h-[95vh] overflow-hidden shadow-2xl">
              
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-white/5 rounded-2xl text-cyan-400 shadow-inner"><Command size={28} /></div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Configuration Kernel</h2>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Active Node Index: {editingProject.id}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleSave} className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-premium flex items-center gap-3 shadow-xl">
                    <Save size={18} /> Commit Manifest
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-4 text-slate-500 hover:text-white transition-premium"><X size={32} /></button>
                </div>
              </div>

              <div className="flex flex-grow overflow-hidden">
                <div className="w-80 border-r border-white/5 bg-slate-950/50 p-10 flex flex-col gap-4">
                  {[
                    { id: 'base', label: 'Identity', icon: <Layers size={18} /> },
                    { id: 'tech', label: 'Deep Dive', icon: <Cpu size={18} /> },
                    { id: 'features', label: 'Manifest', icon: <Layout size={18} /> },
                    { id: 'specs', label: 'Infrastructure', icon: <BarChart3 size={18} /> },
                    { id: 'seo', label: 'Index Data', icon: <Globe size={18} /> }
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-5 p-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-premium ${activeTab === tab.id ? 'bg-white/5 text-white shadow-inner border border-white/10' : 'text-slate-600 hover:text-slate-400'}`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-grow overflow-y-auto p-16 space-y-16 custom-scrollbar bg-slate-900/10">
                  
                  {activeTab === 'base' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Registry Title</label>
                          <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white focus:border-cyan-500/50 outline-none transition-premium font-bold" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Classification</label>
                          <select value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value as ProjectCategory})} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white focus:border-cyan-500/50 outline-none transition-premium font-black uppercase">
                            {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Thumbnail Asset URL</label>
                          <div className="relative">
                             <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                             <input type="text" value={editingProject.thumbnail} onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 pl-12 text-white focus:border-cyan-500/50 outline-none transition-premium" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Lead Repository</label>
                          <div className="relative">
                             <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                             <input type="text" value={editingProject.githubUrl} onChange={e => setEditingProject({...editingProject, githubUrl: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 pl-12 text-white focus:border-cyan-500/50 outline-none transition-premium" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Showcase Image Gallery</label>
                        <div className="grid grid-cols-1 gap-4">
                          {editingProject.images.map((img, idx) => (
                            <div key={idx} className="flex gap-4">
                              <input type="text" value={img} onChange={e => updateImage(idx, e.target.value)} className="flex-grow bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-slate-400 outline-none" placeholder={`Gallery Image ${idx + 1} URL`} />
                              <button onClick={() => setEditingProject({...editingProject, images: editingProject.images.filter((_, i) => i !== idx)})} className="p-4 text-slate-800 hover:text-red-500 transition-premium"><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={addImageSlot} className="py-4 border border-dashed border-white/10 rounded-xl text-[10px] uppercase font-black tracking-widest text-slate-600 hover:border-white/20 hover:text-slate-400 transition-premium">
                             + Add Showcase Image
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Project Abstract</label>
                        <textarea value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/5 rounded-2xl p-6 text-white focus:border-cyan-500/50 outline-none resize-none transition-premium leading-relaxed" />
                      </div>

                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Operational Metrics</label>
                        <div className="grid grid-cols-2 gap-4">
                          {(editingProject.metrics as any[]).map((m, idx) => (
                            <div key={idx} className="flex gap-3">
                              <input type="text" placeholder="Metric" value={m.label || ''} onChange={e => updateMetric(idx, 'label', e.target.value)} className="w-1/2 bg-slate-950 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none" />
                              <input type="text" placeholder="Value" value={m.value || ''} onChange={e => updateMetric(idx, 'value', e.target.value)} className="w-1/2 bg-slate-950 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-cyan-400 outline-none" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="p-10 bg-slate-950 rounded-3xl border border-white/5 space-y-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-black uppercase tracking-tight text-2xl flex items-center gap-4">
                            <Layers className="text-cyan-400" size={24} /> System Architecture & Impact
                          </h3>
                          <button onClick={handleAiDeepDive} disabled={aiLoading} className="px-6 py-3 bg-purple-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-purple-500 transition-premium flex items-center gap-3">
                            {aiLoading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} Synthesize Impact
                          </button>
                        </div>
                        <textarea value={editingProject.architectureImpact} onChange={e => setEditingProject({...editingProject, architectureImpact: e.target.value})} placeholder="Describe the high-level system impact and architectural choices..." className="w-full h-48 bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-slate-300 font-medium leading-relaxed outline-none focus:border-cyan-500/30 resize-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-12">
                        <div className="p-10 bg-slate-950 rounded-3xl border border-white/5 space-y-6">
                          <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                            <Activity className="text-cyan-500" size={18} /> Scale Strategy
                          </h4>
                          <input type="text" placeholder="Strategy Title" value={editingProject.scaleStrategyTitle || ''} onChange={e => setEditingProject({...editingProject, scaleStrategyTitle: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-bold outline-none" />
                          <textarea placeholder="Implementation details for scale..." value={editingProject.scaleStrategyDescription || ''} onChange={e => setEditingProject({...editingProject, scaleStrategyDescription: e.target.value})} className="w-full h-32 bg-slate-900 border border-white/5 rounded-xl p-4 text-slate-400 text-sm outline-none resize-none" />
                        </div>
                        <div className="p-10 bg-slate-950 rounded-3xl border border-white/5 space-y-6">
                          <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                            <Zap className="text-cyan-500" size={18} /> Latency Profile
                          </h4>
                          <input type="text" placeholder="Latency Title" value={editingProject.latencyProfileTitle || ''} onChange={e => setEditingProject({...editingProject, latencyProfileTitle: e.target.value})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-bold outline-none" />
                          <textarea placeholder="Bottleneck mitigation and throughput details..." value={editingProject.latencyProfileDescription || ''} onChange={e => setEditingProject({...editingProject, latencyProfileDescription: e.target.value})} className="w-full h-32 bg-slate-900 border border-white/5 rounded-xl p-4 text-slate-400 text-sm outline-none resize-none" />
                        </div>
                      </div>

                      <div className="space-y-8">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                          <Tag size={14} /> Protocol Stack Matrix
                        </label>
                        <div className="space-y-10">
                          {(Object.entries(groupedTechTags) as [string, TechStackTag[]][]).map(([cat, tags]) => (
                            <div key={cat} className="space-y-4">
                              <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] border-l-2 border-slate-800 pl-4">{cat}</h4>
                              <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                  <button 
                                    key={tag.id} 
                                    onClick={() => toggleTechTag(tag.name)} 
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-premium border ${
                                      editingProject.techStack.includes(tag.name) 
                                        ? 'bg-white border-white text-black shadow-lg shadow-white/10' 
                                        : 'bg-slate-950 border-white/5 text-slate-600 hover:text-white'
                                    }`}
                                  >
                                    {tag.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-black uppercase tracking-tight text-3xl">Module Manifest</h3>
                        <button onClick={() => setEditingProject({...editingProject, featureBlocks: [...editingProject.featureBlocks, { title: 'New Module', description: '', order_index: editingProject.featureBlocks.length }]})} className="px-8 py-4 bg-slate-800 text-[10px] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-premium shadow-xl">+ Provision Block</button>
                      </div>
                      <div className="space-y-8">
                        {(editingProject.featureBlocks as ProjectFeatureBlock[]).map((block, i) => (
                          <div key={i} className="p-12 bg-slate-950 border border-white/5 rounded-[2.5rem] space-y-8 relative group">
                            <button onClick={() => setEditingProject({...editingProject, featureBlocks: editingProject.featureBlocks.filter((_, idx) => idx !== i)})} className="absolute top-10 right-10 p-3 text-slate-800 hover:text-red-500 transition-premium"><Trash2 size={20} /></button>
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/5"><Terminal size={24} /></div>
                              <input type="text" placeholder="Module Functional Title" value={block.title} onChange={e => {
                                  const newBlocks = [...editingProject.featureBlocks];
                                  newBlocks[i].title = e.target.value;
                                  setEditingProject({...editingProject, featureBlocks: newBlocks});
                              }} className="flex-grow bg-transparent border-b border-white/5 pb-4 text-white text-2xl font-black outline-none focus:border-cyan-500 transition-premium" />
                            </div>
                            <textarea placeholder="Technical specifics and impact statement..." value={block.description} onChange={e => {
                                const newBlocks = [...editingProject.featureBlocks];
                                newBlocks[i].description = e.target.value;
                                setEditingProject({...editingProject, featureBlocks: newBlocks});
                            }} className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 text-slate-400 text-sm outline-none h-32 resize-none leading-relaxed" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-black uppercase tracking-tight text-3xl">Infrasctructure Configuration</h3>
                        <button onClick={() => setEditingProject({...editingProject, deploymentSpecs: [...editingProject.deploymentSpecs, { category: 'CUSTOM', label: '', value: '', order_index: editingProject.deploymentSpecs.length }]})} className="px-8 py-4 bg-slate-800 text-[10px] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-premium shadow-xl">+ New Protocol Definition</button>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {(editingProject.deploymentSpecs as ProjectDeploymentSpec[]).map((spec, i) => (
                          <div key={i} className="flex gap-4 items-center bg-slate-950 p-6 border border-white/5 rounded-[2rem] hover:border-white/10 transition-premium">
                            <div className="shrink-0 p-3 bg-slate-900 rounded-xl text-slate-700">
                              {spec.category === 'HOST' ? <Server size={18} /> : spec.category === 'SECURITY' ? <Shield size={18} /> : <Cpu size={18} />}
                            </div>
                            <select value={spec.category} onChange={e => {
                              const newSpecs = [...editingProject.deploymentSpecs];
                              newSpecs[i].category = e.target.value as SpecCategory;
                              setEditingProject({...editingProject, deploymentSpecs: newSpecs});
                            }} className="w-32 bg-slate-900 border border-white/5 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none">
                              {['HOST', 'SECURITY', 'INFRA', 'CUSTOM'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="text" placeholder="Protocol/Label" value={spec.label} onChange={e => {
                              const newSpecs = [...editingProject.deploymentSpecs];
                              newSpecs[i].label = e.target.value;
                              setEditingProject({...editingProject, deploymentSpecs: newSpecs});
                            }} className="w-1/3 bg-slate-900 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-white outline-none" />
                            <input type="text" placeholder="Value/Status" value={spec.value} onChange={e => {
                              const newSpecs = [...editingProject.deploymentSpecs];
                              newSpecs[i].value = e.target.value;
                              setEditingProject({...editingProject, deploymentSpecs: newSpecs});
                            }} className="flex-grow bg-slate-900 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-cyan-400 outline-none" />
                            <button onClick={() => setEditingProject({...editingProject, deploymentSpecs: editingProject.deploymentSpecs.filter((_, idx) => idx !== i)})} className="p-3 text-slate-800 hover:text-red-500 transition-premium"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-white font-black uppercase tracking-tight text-3xl">Search Discovery Manifest</h3>
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Meta Title Index Override</label>
                          <input type="text" value={editingProject.metaTitle || ''} onChange={e => setEditingProject({...editingProject, metaTitle: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white focus:border-cyan-500/50 outline-none transition-premium font-bold" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Public Description Manifest</label>
                          <textarea value={editingProject.metaDescription || ''} onChange={e => setEditingProject({...editingProject, metaDescription: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/5 rounded-2xl p-6 text-white focus:border-cyan-500/50 outline-none resize-none transition-premium leading-relaxed" />
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
    </div>
  );
};

export default AdminProjects;