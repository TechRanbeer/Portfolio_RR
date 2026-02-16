
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ChevronLeft, Save, X } from 'lucide-react';
import { Experience, EmploymentType } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminResumeProps {
  experience: Experience[];
  onUpdate: (exp: Experience[]) => void;
}

const AdminResume: React.FC<AdminResumeProps> = ({ experience, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({});

  const startEdit = (e: Experience) => {
    setEditingId(e.id);
    setForm(e);
  };

  const handleSave = async () => {
    if (!form.title) return;
    const final = form as Experience;
    await storageService.saveExperience(final);
    onUpdate(experience.some(x => x.id === final.id) ? experience.map(x => x.id === final.id ? final : x) : [...experience, final]);
    setEditingId(null);
  };

  const deleteExp = async (id: string) => {
    if (window.confirm("Delete record?")) {
      // Corrected call to deleteExperience
      await storageService.deleteExperience(id);
      onUpdate(experience.filter(x => x.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/admin" className="flex items-center text-slate-500 hover:text-cyan-400 mb-8 font-black uppercase tracking-widest text-xs">
        <ChevronLeft size={20} className="mr-1" /> Dashboard
      </Link>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Experience Node Manager</h1>
        {/* Corrected order property name to orderIndex */}
        <button onClick={() => { setEditingId('new'); setForm({ id: Math.random().toString(36).substr(2,9), title: '', achievements: [], employmentType: 'FULL_TIME', startDate: '', isCurrent: false, orderIndex: experience.length }); }} className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all flex items-center gap-2">
          <Plus size={18} /> New Entry
        </button>
      </div>

      <div className="space-y-6">
        {experience.map(e => (
          <div key={e.id} className="p-8 bg-slate-900 border border-white/5 rounded-3xl flex justify-between items-center group">
            <div>
              {/* Corrected property access to startDate */}
              <div className="text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-1">{e.startDate}</div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{e.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{e.company}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(e)} className="p-3 bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => deleteExp(e.id)} className="p-3 bg-slate-800 rounded-xl text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Modify Node</h2>
                <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6 mb-10">
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                {/* Corrected property binding to startDate */}
                <input type="text" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} placeholder="Start Date (e.g. 2024-01-01)" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                <textarea value={form.achievements?.join('\n')} onChange={e => setForm({...form, achievements: e.target.value.split('\n')})} placeholder="Achievements (One per line)" className="w-full h-48 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none resize-none" />
              </div>
              <button onClick={handleSave} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 flex items-center justify-center gap-2"><Save size={18} /> Save Entry</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminResume;
