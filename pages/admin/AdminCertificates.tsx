import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ChevronLeft, Save, X, ShieldCheck, Award, 
  Calendar, Loader2, Settings, Globe
} from 'lucide-react';
import { Certificate } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminCertProps {
  certificates: Certificate[];
  onUpdate: (certs: Certificate[]) => void;
}

const AdminCertificates: React.FC<AdminCertProps> = ({ certificates, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Partial<Certificate>>({ category: 'Engineering' });

  const handleSave = async () => {
    if (!form.title) return;
    setIsSaving(true);
    try {
      // Ensure all fields map correctly to the interface
      const cert: Certificate = {
        id: form.id || crypto.randomUUID(),
        slug: form.slug || (form.title || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
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
      const updated = await storageService.getCertificates();
      onUpdate(updated);
      setIsAdding(false);
      setForm({ category: 'Engineering' });
    } catch (err) {
      alert("Persistence Fault: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCert = async (id: string) => {
    if (window.confirm("Permanently erase credential record from cloud registry?")) {
      await storageService.deleteCertificate(id);
      onUpdate(certificates.filter(x => x.id !== id));
    }
  };

  const startEdit = (c: Certificate) => {
    setForm(JSON.parse(JSON.stringify(c)));
    setIsAdding(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link to="/admin" className="flex items-center text-slate-500 hover:text-white mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
        <ChevronLeft size={16} className="mr-3" /> Dashboard Access
      </Link>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Credential Vault</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Operational Technical Recognition Repository</p>
        </div>
        <button 
          onClick={() => { setForm({ category: 'Engineering' }); setIsAdding(true); }} 
          className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-premium flex items-center gap-3 shadow-2xl"
        >
          <Plus size={18} /> Provision Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {certificates.map(c => (
          <div key={c.id} className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] relative group overflow-hidden hover:border-cyan-500/30 transition-premium backdrop-blur-md">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-cyan-400"><ShieldCheck size={28} /></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-premium">
                <button onClick={() => startEdit(c)} className="p-3 bg-slate-950 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-premium"><Settings size={16} /></button>
                <button onClick={() => deleteCert(c.id)} className="p-3 bg-slate-950 border border-white/5 rounded-xl text-slate-800 hover:text-red-500 transition-premium"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-cyan-400 transition-premium leading-tight">{c.title}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">{c.issuer}</p>
            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                  <Calendar size={14} className="mr-2" /> {c.issueDate}
                </div>
                <span className="text-[9px] font-mono text-slate-700 uppercase">{c.category}</span>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <Award className="mx-auto text-slate-800 mb-6" size={48} />
            <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest">Zero Credentials Registered</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/5 rounded-2xl text-cyan-400"><Award size={28} /></div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{form.id ? 'Modify Credential' : 'New Credential'}</h2>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Registry Node ID: {form.id || 'AUTO_PROVISIONED'}</p>
                  </div>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-3 text-slate-500 hover:text-white transition-premium"><X size={32} /></button>
              </div>
              
              <div className="space-y-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Official Designation</label>
                        <input 
                          type="text" 
                          value={form.title || ''} 
                          onChange={e => setForm({...form, title: e.target.value})} 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/30 outline-none transition-premium font-bold" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Issuing Authority</label>
                        <input 
                          type="text" 
                          value={form.issuer || ''} 
                          onChange={e => setForm({...form, issuer: e.target.value})} 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/30 outline-none transition-premium font-bold" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Issue Date (Chronology)</label>
                        <input 
                          type="date" 
                          value={form.issueDate || ''} 
                          onChange={e => setForm({...form, issueDate: e.target.value})} 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/30 outline-none transition-premium uppercase font-mono" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Node Category</label>
                        <input 
                          type="text" 
                          value={form.category || ''} 
                          onChange={e => setForm({...form, category: e.target.value})} 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/30 outline-none transition-premium font-bold" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Credential ID</label>
                        <input 
                          type="text" 
                          value={form.credentialId || ''} 
                          onChange={e => setForm({...form, credentialId: e.target.value})} 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/30 outline-none transition-premium font-mono text-sm" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verification Link</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                          <input 
                            type="text" 
                            value={form.verificationUrl || ''} 
                            onChange={e => setForm({...form, verificationUrl: e.target.value})} 
                            placeholder="https://..." 
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 pl-12 text-white focus:border-cyan-500/30 outline-none transition-premium text-sm" 
                          />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Scope Abstract</label>
                    <textarea 
                      value={form.description || ''} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                      className="w-full h-32 bg-slate-950 border border-white/5 rounded-2xl p-6 text-slate-400 text-sm outline-none resize-none transition-premium leading-relaxed" 
                    />
                </div>

                <div className="flex items-center gap-5 p-6 bg-slate-950 rounded-[1.5rem] border border-white/5 group hover:border-cyan-500/20 transition-premium">
                    <input 
                      type="checkbox" 
                      checked={form.featured || false} 
                      onChange={e => setForm({...form, featured: e.target.checked})} 
                      className="w-6 h-6 rounded-lg accent-cyan-500 cursor-pointer" 
                    />
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group-hover:text-white transition-premium">Highlight on primary showcase</label>
                </div>
              </div>
              
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full py-6 bg-white text-black font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-cyan-400 flex items-center justify-center gap-3 transition-premium shadow-2xl disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                Commit Credential to Registry
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;