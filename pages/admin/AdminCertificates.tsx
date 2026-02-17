
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, Save, X, ShieldCheck, Award, Link as LinkIcon, Calendar } from 'lucide-react';
import { Certificate } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminCertProps {
  certificates: Certificate[];
  onUpdate: (certs: Certificate[]) => void;
}

const AdminCertificates: React.FC<AdminCertProps> = ({ certificates, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Certificate>>({ category: 'Engineering' });

  const handleSave = async () => {
    if (!form.title) return;
    const cert: Certificate = {
      id: form.id || crypto.randomUUID(),
      slug: (form.title || '').toLowerCase().replace(/ /g, '-'),
      title: form.title || '',
      issuer: form.issuer || '',
      issueDate: form.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: form.expiryDate,
      category: form.category || 'Engineering',
      description: form.description,
      verificationUrl: form.verificationUrl,
      credentialId: form.credentialId,
      credentialUrl: form.credentialUrl,
      imageUrl: form.imageUrl,
      featured: form.featured || false,
      status: form.status || 'published'
    };
    await storageService.saveCertificate(cert);
    onUpdate(certificates.some(c => c.id === cert.id) ? certificates.map(c => c.id === cert.id ? cert : c) : [...certificates, cert]);
    setIsAdding(false);
    setForm({ category: 'Engineering' });
  };

  const deleteCert = async (id: string) => {
    if (window.confirm("Delete record?")) {
      await storageService.deleteCertificate(id);
      onUpdate(certificates.filter(x => x.id !== id));
    }
  };

  const startEdit = (c: Certificate) => {
    setForm(c);
    setIsAdding(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/admin" className="flex items-center text-slate-500 hover:text-cyan-400 mb-8 font-black uppercase tracking-widest text-xs">
        <ChevronLeft size={20} className="mr-1" /> Dashboard
      </Link>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Credential Vault</h1>
          <p className="text-slate-500 text-sm">Managing verified technical recognition</p>
        </div>
        <button onClick={() => { setForm({ category: 'Engineering' }); setIsAdding(true); }} className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all flex items-center gap-2"><Plus size={18} /> Provision Certificate</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map(c => (
          <div key={c.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative group overflow-hidden hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <ShieldCheck className="text-cyan-400" size={28} />
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(c)} className="p-2 text-slate-400 hover:text-white"><Plus size={16} /></button>
                <button onClick={() => deleteCert(c.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{c.title}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase mb-6">{c.issuer}</p>
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{c.issueDate}</span>
                <span className="text-[9px] font-mono text-slate-700">{c.category}</span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{form.id ? 'Modify Credential' : 'New Credential'}</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Title</label>
                        <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Issuer</label>
                        <input type="text" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Issue Date</label>
                        <input type="date" value={form.issueDate} onChange={e => setForm({...form, issueDate: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Category</label>
                        <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Verification URL</label>
                    <input type="text" value={form.verificationUrl} onChange={e => setForm({...form, verificationUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-24 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none resize-none" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-white/5">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-5 h-5 accent-cyan-500" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feature on showcase</label>
                </div>
              </div>
              <button onClick={handleSave} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all"><Save size={18} /> Commit Credential</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
