import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, ChevronLeft, Globe, User, Sparkles } from 'lucide-react';
import { SiteConfig } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminSettingsProps {
  config: SiteConfig | null;
  onUpdate: (config: SiteConfig) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ config, onUpdate }) => {
  const [form, setForm] = useState<SiteConfig>(config || {
    id: 'default',
    logo_line1: 'Ranbeer', logo_line2: 'Raja',
    hero_headline_line1: 'Ranbeer', hero_headline_line2: 'Raja',
    hero_subtitle: '', contact_email: '', contact_phone: '', location: '', bio_summary: '',
    social_links: { github: '', linkedin: '' }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await storageService.saveSiteConfig(form);
    onUpdate(form);
    setSaving(false);
    alert("Saved Successfully");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/admin" className="flex items-center text-slate-500 hover:text-cyan-400 mb-8 font-black uppercase tracking-widest text-xs"><ChevronLeft size={20} className="mr-1" /> Dashboard</Link>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Site Core Configuration</h1>
        <button onClick={handleSave} disabled={saving} className="bg-cyan-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all flex items-center gap-2">
          {saving ? 'Syncing...' : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs"><Sparkles className="text-cyan-400 mr-3" size={18} /> Branding</h3>
            <div className="grid grid-cols-2 gap-6">
              <input type="text" value={form.logo_line1} onChange={e => setForm({...form, logo_line1: e.target.value})} placeholder="Logo Line 1" className="bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <input type="text" value={form.logo_line2} onChange={e => setForm({...form, logo_line2: e.target.value})} placeholder="Logo Line 2" className="bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <input type="text" value={form.hero_headline_line1} onChange={e => setForm({...form, hero_headline_line1: e.target.value})} placeholder="Hero Headline 1" className="bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <input type="text" value={form.hero_headline_line2} onChange={e => setForm({...form, hero_headline_line2: e.target.value})} placeholder="Hero Headline 2" className="bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
            </div>
            <textarea value={form.hero_subtitle} onChange={e => setForm({...form, hero_subtitle: e.target.value})} placeholder="Hero Subtitle" className="w-full h-24 bg-slate-950 border border-white/10 rounded-2xl p-4 mt-6 text-white focus:border-cyan-500 outline-none resize-none" />
          </section>
        </div>
        <div className="space-y-8">
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs"><User className="text-cyan-400 mr-3" size={18} /> Personal Info</h3>
            <div className="space-y-6">
              <input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} placeholder="Email" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <input type="text" value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} placeholder="Phone" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none" />
              <textarea value={form.bio_summary} onChange={e => setForm({...form, bio_summary: e.target.value})} placeholder="Bio Summary" className="w-full h-32 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none resize-none" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;