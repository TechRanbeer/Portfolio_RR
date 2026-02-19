
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Trash2, Star, ChevronLeft, X, Loader2, Save, Layers, 
  Globe, Command, Zap, Activity, Cpu, Server, Terminal, Tag, 
  Image as ImageIcon, Link as LinkIcon, Github, AlignLeft, Shield, HardDrive,
  BarChart3, ActivitySquare
} from 'lucide-react';
import { Project, ProjectCategory, ProjectDeploymentSpec } from '../../types';
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
  const [activeTab, setActiveTab] = useState<'base' | 'architecture' | 'performance' | 'protocols' | 'infrastructure' | 'metadata'>('base');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

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
      metrics: [],
      techStack: [],
      featureBlocks: [],
      deploymentSpecs: [],
      featured: false,
      status: 'published',
      isOngoing: false,
      createdAt: new Date().toISOString(),
      architectureImpact: '',
      scaleStrategyTitle: '',
      scaleStrategyDescription: '',
      latencyProfileTitle: '',
      latencyProfileDescription: ''
    } as Project;

    setEditingProject(projectData);
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
      alert("CRITICAL_SYNC_ERROR: " + (err as Error).message);
    }
  };

  const addTechWord = () => {
    if (!editingProject || !newTag.trim()) return;
    const cleanTag = newTag.trim();
    if (editingProject.techStack.includes(cleanTag)) {
      setNewTag('');
      return;
    }
    setEditingProject({
      ...editingProject,
      techStack: [...editingProject.techStack, cleanTag]
    });
    setNewTag('');
  };

  const removeTechWord = (word: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      techStack: editingProject.techStack.filter(w => w !== word)
    });
  };

  const addImage = () => {
    if (!editingProject || !newImageUrl.trim()) return;
    setEditingProject({
      ...editingProject,
      images: [...(editingProject.images || []), newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const removeImage = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      images: editingProject.images.filter((_, i) => i !== idx)
    });
  };

  const addInfraNode = () => {
    if (!editingProject) return;
    const newSpec: ProjectDeploymentSpec = {
      category: 'INFRA',
      label: 'New Protocol',
      value: 'Pending...',
      order_index: editingProject.deploymentSpecs.length
    };
    setEditingProject({
      ...editingProject,
      deploymentSpecs: [...editingProject.deploymentSpecs, newSpec]
    });
  };

  const updateInfraNode = (index: number, field: 'label' | 'value', value: string) => {
    if (!editingProject) return;
    const newSpecs = [...editingProject.deploymentSpecs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setEditingProject({ ...editingProject, deploymentSpecs: newSpecs });
  };

  const deleteInfraNode = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      deploymentSpecs: editingProject.deploymentSpecs.filter((_, i) => i !== index)
    });
  };

  const handleAiSynthesis = async () => {
    if (!editingProject) return;
    setAiLoading(true);
    try {
      const summary = await geminiService.generateTechnicalSummary(editingProject);
      setEditingProject({ ...editingProject, architectureImpact: summary });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-16">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Registry</h1>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Control Terminal Active
          </div>
        </div>
        <button onClick={() => startEdit(null)} className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-xl">
          <Plus size={16} /> Register New Node
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 bg-slate-950/20 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/30 transition-all font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/40 text-[9px] uppercase font-black text-slate-600 tracking-[0.3em] border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Node Identifier</th>
                <th className="px-8 py-6">Classification</th>
                <th className="px-8 py-6 text-center">Featured</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-9 bg-slate-950 rounded-lg overflow-hidden border border-white/5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{p.title}</div>
                        <div className="text-[9px] font-mono text-slate-600">ID: {p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={async () => {
                      const updated = { ...p, featured: !p.featured };
                      await storageService.saveProject(updated);
                      onUpdate(projects.map(x => x.id === p.id ? updated : x));
                    }} className={`p-2 rounded-lg transition-all ${p.featured ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-800'}`}>
                      <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => startEdit(p)} className="p-3 bg-slate-900 border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/10 transition-all"><Terminal size={16} /></button>
                      <button onClick={async () => { if(window.confirm('Terminate Node?')) { await storageService.deleteProject(p.id); onUpdate(projects.filter(x => x.id !== p.id)); } }} className="p-3 bg-slate-900 border border-white/5 rounded-xl text-slate-800 hover:text-red-500 hover:border-red-500/20 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && editingProject && (
          <div className="fixed inset-0 z-[100] bg-slate-950/98 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-7xl h-[90vh] bg-slate-900 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)]">
              
              <div className="px-10 py-8 border-b border-white/5 bg-slate-950/30 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/5 rounded-xl text-cyan-500"><Command size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Project Node Customization</h2>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Active System ID: {editingProject.id}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleSave} className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-3">
                    <Save size={16} /> Deploy Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-3 text-slate-600 hover:text-white transition-all"><X size={24} /></button>
                </div>
              </div>

              <div className="flex flex-grow overflow-hidden">
                <div className="w-72 border-r border-white/5 bg-slate-950/40 p-8 flex flex-col gap-3">
                  {[
                    { id: 'base', label: 'Identity', icon: <Layers size={14} /> },
                    { id: 'architecture', label: 'Architecture', icon: <AlignLeft size={14} /> },
                    { id: 'performance', label: 'Performance Deep Dive', icon: <ActivitySquare size={14} /> },
                    { id: 'protocols', label: 'Protocol Stack', icon: <Cpu size={14} /> },
                    { id: 'infrastructure', label: 'Infra Matrix', icon: <Server size={14} /> },
                    { id: 'metadata', label: 'Metadata', icon: <Globe size={14} /> }
                  ].map(tab => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveTab(tab.id as any)} 
                      className={`flex items-center gap-4 p-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white/5 text-white border border-white/10 shadow-inner' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-grow overflow-y-auto p-12 custom-scrollbar bg-slate-900/10 space-y-16">
                  {activeTab === 'base' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Name</label>
                          <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Classification</label>
                          <select value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value as ProjectCategory})} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none transition-all font-black uppercase">
                            {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Thumbnail Endpoint</label>
                          <div className="relative">
                            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                            <input type="text" value={editingProject.thumbnail} onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 pl-14 text-white focus:border-cyan-500/50 outline-none font-mono text-xs" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Repository Path</label>
                          <div className="relative">
                            <Github className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                            <input type="text" value={editingProject.githubUrl || ''} onChange={e => setEditingProject({...editingProject, githubUrl: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 pl-14 text-white focus:border-cyan-500/50 outline-none font-mono text-xs" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Showcase Images (Multiple)</label>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            placeholder="Append Image URL (HTTPS)..." 
                            value={newImageUrl} 
                            onChange={e => setNewImageUrl(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addImage()}
                            className="flex-grow bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none transition-all font-mono text-xs"
                          />
                          <button onClick={addImage} className="px-8 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2">
                            <Plus size={16} /> Append
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {(editingProject.images || []).map((img, idx) => (
                            <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                              <img src={img} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                              <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Abstract Overview</label>
                        <textarea value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl p-6 text-slate-400 focus:border-cyan-500/50 outline-none resize-none transition-all text-sm leading-relaxed" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'architecture' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="p-8 bg-slate-950/50 border border-white/5 rounded-[2rem] space-y-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-4">
                            <Layers className="text-cyan-500" size={20} /> System Architecture & Technical Impact
                          </h3>
                          <button onClick={handleAiSynthesis} disabled={aiLoading} className="px-5 py-2.5 bg-purple-600/10 text-purple-400 text-[9px] font-black uppercase tracking-widest border border-purple-500/20 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center gap-3">
                            {aiLoading ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} />} AI Synthesis
                          </button>
                        </div>
                        <div className="relative group/raw">
                          <textarea 
                            value={editingProject.architectureImpact} 
                            onChange={e => setEditingProject({...editingProject, architectureImpact: e.target.value})} 
                            placeholder="Input detailed architecture overview..." 
                            style={{ whiteSpace: 'pre-wrap' }}
                            className="w-full h-[32rem] bg-slate-950 border border-white/5 rounded-2xl p-8 text-slate-300 font-medium leading-relaxed outline-none focus:border-cyan-500/30 resize-none overflow-y-auto custom-scrollbar" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'performance' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 gap-12">
                        {/* Scale Strategy Group */}
                        <div className="p-8 bg-slate-950/50 border border-white/5 rounded-[2rem] space-y-8">
                           <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-4">
                            <BarChart3 className="text-cyan-500" size={20} /> Scale Strategy
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Strategy Label</label>
                              <input type="text" value={editingProject.scaleStrategyTitle || ''} onChange={e => setEditingProject({...editingProject, scaleStrategyTitle: e.target.value})} placeholder="e.g. Distributed Node Expansion" className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none transition-all font-bold" />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Strategy Abstract</label>
                              <textarea value={editingProject.scaleStrategyDescription || ''} onChange={e => setEditingProject({...editingProject, scaleStrategyDescription: e.target.value})} placeholder="Technical details of scaling logic..." className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl p-6 text-slate-400 focus:border-cyan-500/50 outline-none resize-none transition-all text-sm leading-relaxed" />
                            </div>
                          </div>
                        </div>

                        {/* Latency Profile Group */}
                        <div className="p-8 bg-slate-950/50 border border-white/5 rounded-[2rem] space-y-8">
                           <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-4">
                            <Zap className="text-cyan-500" size={20} /> Latency Profile
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Latency Signature</label>
                              <input type="text" value={editingProject.latencyProfileTitle || ''} onChange={e => setEditingProject({...editingProject, latencyProfileTitle: e.target.value})} placeholder="e.g. Sub-200ms Inference" className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none transition-all font-bold" />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Performance Specifications</label>
                              <textarea value={editingProject.latencyProfileDescription || ''} onChange={e => setEditingProject({...editingProject, latencyProfileDescription: e.target.value})} placeholder="Dynamic latency benchmarks and optimization paths..." className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl p-6 text-slate-400 focus:border-cyan-500/50 outline-none resize-none transition-all text-sm leading-relaxed" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'protocols' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-4">
                        <Cpu className="text-cyan-400" size={24} /> Core Protocol Stack
                      </h3>
                      <div className="p-10 bg-slate-950 rounded-[2rem] border border-white/5 space-y-10">
                        <div className="flex gap-4">
                          <div className="relative flex-grow">
                             <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                             <input 
                              type="text" 
                              value={newTag} 
                              onChange={e => setNewTag(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addTechWord()}
                              placeholder="Append Protocol (e.g. JWT, Docker)..." 
                              className="w-full bg-slate-900 border border-white/10 rounded-xl p-5 pl-14 text-white outline-none focus:border-cyan-500/50 transition-all font-mono text-sm" 
                            />
                          </div>
                          <button onClick={addTechWord} className="px-10 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-cyan-400 transition-all">Append Node</button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {editingProject.techStack.map(word => (
                            <div key={word} className="flex items-center gap-4 px-6 py-4 bg-slate-900 border border-white/5 rounded-xl group hover:border-cyan-500/40 transition-all">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{word}</span>
                              <button onClick={() => removeTechWord(word)} className="text-slate-700 hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'infrastructure' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-black uppercase tracking-tight text-xl flex items-center gap-4">
                          <Server className="text-cyan-400" size={24} /> Infrastructure Matrix
                        </h3>
                        <button onClick={addInfraNode} className="px-6 py-3 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">+ New Matrix Entry</button>
                      </div>
                      <div className="space-y-4">
                        {(editingProject.deploymentSpecs || []).map((spec, i) => (
                          <div key={i} className="flex items-center gap-6 p-6 bg-slate-950 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                            <div className="shrink-0 p-3 bg-slate-900 rounded-xl text-slate-700"><HardDrive size={18} /></div>
                            <input 
                              type="text" 
                              placeholder="Parameter" 
                              value={spec.label} 
                              onChange={e => updateInfraNode(i, 'label', e.target.value)} 
                              className="w-48 bg-slate-900 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-cyan-500/30" 
                            />
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={spec.value} 
                              onChange={e => updateInfraNode(i, 'value', e.target.value)} 
                              className="flex-grow bg-slate-900 border border-white/5 rounded-xl p-4 text-[10px] font-mono text-cyan-400 outline-none focus:border-cyan-500/30" 
                            />
                            <button onClick={() => deleteInfraNode(i)} className="p-3 text-slate-800 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'metadata' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <h3 className="text-white font-black uppercase tracking-tight text-xl">Discovery Registry Meta</h3>
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Meta Title Override</label>
                          <input type="text" value={editingProject.metaTitle || ''} onChange={e => setEditingProject({...editingProject, metaTitle: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-xl p-5 text-white focus:border-cyan-500/50 outline-none font-bold" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Meta Description Entry</label>
                          <textarea value={editingProject.metaDescription || ''} onChange={e => setEditingProject({...editingProject, metaDescription: e.target.value})} className="w-full h-32 bg-slate-950 border border-white/5 rounded-xl p-6 text-slate-400 focus:border-cyan-500/50 outline-none resize-none leading-relaxed" />
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
