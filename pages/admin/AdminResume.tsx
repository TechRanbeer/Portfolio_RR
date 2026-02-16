import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ChevronLeft, Save, X, List, Briefcase, GripVertical } from 'lucide-react';
import { Experience } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminResumeProps {
  experience: Experience[];
  onUpdate: (exp: Experience[]) => void;
}

const AdminResume: React.FC<AdminResumeProps> = ({ experience, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<Experience>>({});
  const [newAchievement, setNewAchievement] = useState('');

  const handleEdit = (item: Experience) => {
    setIsEditing(item.id);
    setEditItem({ ...item });
  };

  const handleAddNew = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newItem: Experience = {
      id: newId,
      title: 'New Position',
      company: 'New Company',
      period: '2025 - Present',
      achievements: [],
      order: experience.length
    };
    setIsEditing(newId);
    setEditItem(newItem);
  };

  const handleSave = async () => {
    if (!editItem.title) return;
    const finalItem = editItem as Experience;
    await storageService.saveExperience(finalItem);
    
    const exists = experience.find(x => x.id === finalItem.id);
    if (exists) {
      onUpdate(experience.map(x => x.id === finalItem.id ? finalItem : x));
    } else {
      onUpdate([...experience, finalItem]);
    }
    setIsEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this experience record?")) {
      await storageService.deleteExperience(id);
      onUpdate(experience.filter(x => x.id !== id));
    }
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setEditItem({
      ...editItem,
      achievements: [...(editItem.achievements || []), newAchievement.trim()]
    });
    setNewAchievement('');
  };

  const removeAchievement = (idx: number) => {
    setEditItem({
      ...editItem,
      achievements: (editItem.achievements || []).filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-8 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="ml-2 text-[10px] font-black uppercase tracking-widest">Dashboard</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Resume Manager</h1>
          <p className="text-slate-500 font-mono text-sm uppercase mt-1 tracking-widest">Professional Experience Registry</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center space-x-2 px-8 py-4 bg-cyan-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-500 transition-all shadow-lg">
          <Plus size={18} /><span>Add Node</span>
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((item, idx) => (
          <div key={item.id} className="p-8 bg-slate-900 border border-white/5 rounded-3xl flex items-center gap-6 group">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{item.period}</span>
                <span className="text-slate-700">/</span>
                <span className="text-sm font-bold text-white">{item.company}</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-2 italic">{item.achievements.length} Achievements recorded</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-3 bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-3 bg-slate-800 rounded-xl text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Experience Entry Node</h2>
                <button onClick={() => setIsEditing(null)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Title / Role</label>
                    <input 
                      type="text" 
                      value={editItem.title || ''} 
                      onChange={e => setEditItem({...editItem, title: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Company / Org</label>
                    <input 
                      type="text" 
                      value={editItem.company || ''} 
                      onChange={e => setEditItem({...editItem, company: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Period (e.g. 2024 - 2025)</label>
                    <input 
                      type="text" 
                      value={editItem.period || ''} 
                      onChange={e => setEditItem({...editItem, period: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Achievements / Responsibilities</label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                    {editItem.achievements?.map((ach, i) => (
                      <div key={i} className="flex gap-3 items-start group">
                        <div className="flex-grow p-4 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-400">
                          {ach}
                        </div>
                        <button onClick={() => removeAchievement(i)} className="p-2 text-slate-600 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newAchievement}
                      onChange={e => setNewAchievement(e.target.value)}
                      placeholder="Add achievement point..."
                      className="flex-grow bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      onKeyDown={e => e.key === 'Enter' && addAchievement()}
                    />
                    <button onClick={addAchievement} className="p-3 bg-slate-800 rounded-xl text-cyan-400 hover:bg-slate-700 transition-all">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                <span>Save Node Changes</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminResume;