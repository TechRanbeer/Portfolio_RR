
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, Save, X, ShieldCheck } from 'lucide-react';
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
      id: Math.random().toString(36).substr(2, 9),
      slug: (form.title || '').toLowerCase().replace(/ /g, '-'),
      title: form.title || '',
      issuer: form.issuer || '',
      // Corrected property mapping to issueDate
      issueDate: form.issueDate || '2025',
      category: form.category || 'Engineering',
      featured: false,
      status: 'published'
    };
    // Corrected call to saveCertificate
    await storageService.saveCertificate(cert);
    onUpdate([...certificates, cert]);
    setIsAdding(false);
  };

  const deleteCert = async (id: string) => {
    if (window.confirm("Delete record?")) {
      // Corrected call to deleteCertificate
      await storageService.deleteCertificate(id);
      onUpdate(certificates.filter(x => x.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/admin" className="flex items-center text-slate-500 hover:text-cyan-400 mb-8 font-black uppercase tracking-widest text-xs">
        <ChevronLeft size={20} className="mr-1" /> Dashboard
      </Link>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Credential Vault</h1>
        <button onClick={() => setIsAdding(true)} className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all flex items-center gap-2"><Plus size={18} /> Add Cert</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map(c => (
          <div key={c.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <ShieldCheck className="text-cyan-400" size={28} />
              <button onClick={() => deleteCert(c.id)} className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{c.title}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase mb-6">{c.issuer}</p>
            {/* Corrected property access to issueDate */}
            <div className="pt-6 border-t border-white/5 text-[10px] font-black text-cyan-500 uppercase tracking-widest">{c.issueDate}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">New Credential</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-6 mb-10">
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                <input type="text" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} placeholder="Issuer" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
                {/* Corrected property binding to issueDate */}
                <input type="text" value={form.issueDate} onChange={e => setForm({...form, issueDate: e.target.value})} placeholder="Year" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              </div>
              <button onClick={handleSave} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 flex items-center justify-center gap-2"><Save size={18} /> Issue Certificate</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
