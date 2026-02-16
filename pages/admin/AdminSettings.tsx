import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, ChevronLeft, Globe, Phone, Mail, MapPin, User, Sparkles } from 'lucide-react';
import { SiteConfig } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface AdminSettingsProps {
  config: SiteConfig | null;
  onUpdate: (config: SiteConfig) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ config, onUpdate }) => {
  const [formData, setFormData] = useState<SiteConfig>(config || {
    id: 'default',
    logo_line1: 'Ranbeer',
    logo_line2: 'Raja',
    hero_headline_line1: 'Ranbeer',
    hero_headline_line2: 'Raja',
    hero_subtitle: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    bio_summary: '',
    social_links: { github: '', linkedin: '' }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storageService.saveSiteConfig(formData);
      onUpdate(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert("Failed to update site configuration.");
    } finally {
      setIsSaving(false);
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
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Site Core Config</h1>
          <p className="text-slate-500 font-mono text-sm uppercase mt-1 tracking-widest">Global Identity Overrides</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`flex items-center space-x-2 px-10 py-4 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg ${saveSuccess ? 'bg-green-600 text-white' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
        >
          {isSaving ? <span className="animate-pulse">Syncing...</span> : (saveSuccess ? 'Saved' : 'Save Changes')}
          <Save size={18} className="ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* Brand Identity */}
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs">
              <Sparkles className="text-cyan-400 mr-3" size={18} />
              Brand Identity
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Logo Line 1</label>
                <input 
                  type="text" 
                  value={formData.logo_line1} 
                  onChange={e => setFormData({...formData, logo_line1: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Logo Line 2 (Accent)</label>
                <input 
                  type="text" 
                  value={formData.logo_line2} 
                  onChange={e => setFormData({...formData, logo_line2: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs">
              <Globe className="text-cyan-400 mr-3" size={18} />
              Hero Environment
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Headline Line 1</label>
                  <input 
                    type="text" 
                    value={formData.hero_headline_line1} 
                    onChange={e => setFormData({...formData, hero_headline_line1: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Headline Line 2 (Accent)</label>
                  <input 
                    type="text" 
                    value={formData.hero_headline_line2} 
                    onChange={e => setFormData({...formData, hero_headline_line2: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Hero Subtitle</label>
                <textarea 
                  value={formData.hero_subtitle} 
                  onChange={e => setFormData({...formData, hero_subtitle: e.target.value})}
                  className="w-full h-24 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Contact & Bio */}
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs">
              <User className="text-cyan-400 mr-3" size={18} />
              Personal Info & Contact
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Email</label>
                  <input 
                    type="email" 
                    value={formData.contact_email} 
                    onChange={e => setFormData({...formData, contact_email: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Phone</label>
                  <input 
                    type="text" 
                    value={formData.contact_phone} 
                    onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Location (City, Country)</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Global Bio Summary (Resume)</label>
                <textarea 
                  value={formData.bio_summary} 
                  onChange={e => setFormData({...formData, bio_summary: e.target.value})}
                  className="w-full h-32 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem]">
            <h3 className="text-white font-bold mb-8 flex items-center uppercase tracking-widest text-xs">
              <Globe className="text-cyan-400 mr-3" size={18} />
              External Links (URLs)
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">GitHub Profile URL</label>
                <input 
                  type="text" 
                  value={formData.social_links.github} 
                  onChange={e => setFormData({...formData, social_links: {...formData.social_links, github: e.target.value}})}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">LinkedIn Profile URL</label>
                <input 
                  type="text" 
                  value={formData.social_links.linkedin} 
                  onChange={e => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;