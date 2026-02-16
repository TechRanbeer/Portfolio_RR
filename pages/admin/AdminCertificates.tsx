import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, Save, X, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { Certificate } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminCertificatesProps {
  certificates: Certificate[];
  onUpdate: (certs: Certificate[]) => void;
}

const AdminCertificates: React.FC<AdminCertificatesProps> = ({ certificates, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Certificate>>({
    title: '', issuer: '', date: '', category: 'Engineering', status: 'published'
  });

  const handleSave = async () => {
    if (!newItem.title || !newItem.issuer) return;
    const cert: Certificate = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem.title,
      issuer: newItem.issuer,
      date: newItem.date || '2025',
      category: newItem.category || 'Engineering',
      status: 'published'
    };
    await storageService.saveCertificate(cert);
    onUpdate([...certificates, cert]);
    setIsAdding(false);
    setNewItem({ title: '', issuer: '', date: '', category: 'Engineering' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete certificate entry?")) {
      await storageService.deleteCertificate(id);
      onUpdate(certificates.filter(x => x.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-cyan-400 transition-colors mb-8">
        <ChevronLeft size={20} />
        <span className="ml-2 text-[10px] font-black uppercase tracking-widest">Dashboard</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Credential Vault</h1>
          <p className="text-slate-500 font-mono text-sm uppercase mt-1 tracking-widest">Verified Technical Achievements</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center space-x-2 px-8 py-4 bg-cyan-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-500 transition-all shadow-lg">
          <Plus size={18} /><span>Issue New Cert</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
              <Award size={100} />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-800 rounded-2xl text-cyan-400">
                <ShieldCheck size={24} />
              </div>
              <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{cert.title}</h3>
            <p className="text-sm font-bold text-slate-500 mb-6">{cert.issuer}</p>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{cert.date}</span>
              <span className="text-[9px] font-mono text-slate-600 uppercase">UID: {cert.id}</span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">New Credential</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Certification Title</label>
                  <input 
                    type="text" 
                    value={newItem.title} 
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g. AWS Certified Developer"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Issuing Authority</label>
                  <input 
                    type="text" 
                    value={newItem.issuer} 
                    onChange={e => setNewItem({...newItem, issuer: e.target.value})}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Issue Date</label>
                    <input 
                      type="text" 
                      value={newItem.date} 
                      onChange={e => setNewItem({...newItem, date: e.target.value})}
                      placeholder="2024"
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Category</label>
                    <select 
                      value={newItem.category} 
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                    >
                      <option>Engineering</option>
                      <option>Software</option>
                      <option>Personal Discipline</option>
                      <option>Academic</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                <span>Save Credential</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;