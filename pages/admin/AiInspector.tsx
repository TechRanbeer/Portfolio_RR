
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, RefreshCw, AlertTriangle, CheckCircle, Database, Terminal, Search } from 'lucide-react';
import { Project } from '../../types';
import { storageService } from '../../services/storageService';

interface AiInspectorProps {
  projects: Project[];
}

const AiInspector: React.FC<AiInspectorProps> = ({ projects }) => {
  const [syncing, setSyncing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSyncAll = async () => {
    setSyncing(true);
    // Logic to update lastAiSync on all projects
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
    storageService.logAudit('AI_SYNC_ALL', 'Triggered full knowledge graph re-index');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">AI Knowledge Inspector</h1>
          <p className="text-slate-500">Manage the data vectors used by the Gemini Assistant.</p>
        </div>
        <button 
          onClick={handleSyncAll}
          disabled={syncing}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
          <span>Re-Sync Knowledge Graph</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input type="text" placeholder="Filter nodes..." className="w-full bg-slate-900 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs" />
          </div>
          {projects.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`w-full text-left p-3 rounded-xl transition-all border ${selectedProject?.id === p.id ? 'bg-purple-600/20 border-purple-500/50 text-white' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10'}`}
            >
              <div className="text-xs font-bold truncate">{p.title}</div>
              <div className="text-[9px] font-mono mt-1 opacity-50 flex items-center">
                <Database size={8} className="mr-1" /> Vector ID: {p.id.slice(0, 8)}
              </div>
            </button>
          ))}
        </div>

        {/* Inspector Panel */}
        <div className="lg:col-span-3">
          {selectedProject ? (
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] flex items-center text-green-400 font-bold uppercase tracking-widest">
                      <CheckCircle size={10} className="mr-1" /> Knowledge Synced
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                      Last Sync: {selectedProject.lastAiSync || 'Never'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <BrainCircuit className="text-purple-400" size={24} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">AI Hidden Persona Context</label>
                  <textarea 
                    value={selectedProject.aiContext || ''}
                    placeholder="Enter additional details for the AI to know about this project (e.g., hidden challenges, specific team dynamics)..."
                    className="w-full h-48 bg-slate-950/80 border border-white/10 rounded-2xl p-6 text-slate-300 font-mono text-sm focus:border-purple-500 outline-none resize-none"
                  ></textarea>
                </div>

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This context is added to the system prompt when users ask about this specific project. Use it to provide depth that isn't publicly visible on the main page.
                  </p>
                </div>

                <button className="w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 transition-all">
                  Update AI Knowledge Node
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-20 text-center">
              <Terminal className="text-slate-700 mb-6" size={48} />
              <h3 className="text-lg font-bold text-slate-500">Select a project node to inspect AI context</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInspector;
