import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap, Mail, MapPin, Phone, ChevronRight, Terminal, Target } from 'lucide-react';
import { Experience, SiteConfig } from '../types';

interface ResumeProps {
  experience: Experience[];
  config: SiteConfig | null;
}

const Resume: React.FC<ResumeProps> = ({ experience, config }) => {
  const skills = [
    { label: "Engineering", items: ["SolidWorks", "ANSYS", "Chassis Design", "Structural Testing"] },
    { label: "Systems", items: ["ARM Microcontrollers", "Linux CLI", "Docker", "Raspberry Pi 5", "Networking"] },
    { label: "Programming", items: ["Java", "MySQL", "React", "TypeScript", "AI API Integration"] }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex justify-end mb-10 no-print">
        <button onClick={() => window.print()} className="px-8 py-4 bg-white text-black font-black tracking-widest rounded-2xl hover:bg-cyan-400 transition-all uppercase text-xs shadow-2xl flex items-center gap-2">
          <Download size={18} /> Generate PDF
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900/40 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-sm print:bg-white print:text-black print:border-none">
        <div className="p-12 md:p-20 border-b border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent print:bg-none">
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none print:text-black mb-4">
            {config?.logo_line1 || 'Ranbeer'} <span className="text-cyan-500">{config?.logo_line2 || 'Raja'}</span>
          </h1>
          <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase font-bold mb-8 print:text-cyan-700">{config?.hero_subtitle}</p>
          <div className="flex flex-wrap gap-y-4 gap-x-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-white/5 pt-8 print:border-slate-100 print:text-slate-600">
            <span className="flex items-center"><Mail size={16} className="mr-3 text-cyan-500" /> {config?.contact_email}</span>
            <span className="flex items-center"><Phone size={16} className="mr-3 text-cyan-500" /> {config?.contact_phone}</span>
            <span className="flex items-center"><MapPin size={16} className="mr-3 text-cyan-500" /> {config?.location}</span>
          </div>
        </div>

        <div className="p-12 md:p-20 space-y-20 print:space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700"><Target size={16} className="mr-3" /> Summary</h2>
            <div className="md:col-span-3">
              <p className="text-slate-300 text-base leading-relaxed text-justify border-l-4 border-cyan-500/20 pl-8 print:text-slate-800 print:border-cyan-200">{config?.bio_summary}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700"><Briefcase size={16} className="mr-3" /> Experience</h2>
            <div className="md:col-span-3 space-y-16 print:space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight print:text-black">{exp.title}</h3>
                    <span className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-widest print:text-cyan-700">{exp.period}</span>
                  </div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 italic">{exp.company}</div>
                  <ul className="space-y-4">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start leading-relaxed print:text-slate-800"><ChevronRight size={16} className="text-cyan-600 mr-3 mt-0.5 shrink-0" /> {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700"><Terminal size={16} className="mr-3" /> Stack</h2>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12 print:gap-6">
              {skills.map((g, i) => (
                <div key={i}>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">{g.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s, j) => <span key={j} className="text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg print:text-black print:border print:border-slate-100">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700"><GraduationCap size={16} className="mr-3" /> Academy</h2>
            <div className="md:col-span-3 border-l-4 border-slate-800 pl-8 print:border-slate-100">
              <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2 print:text-black">Mechanical Engineering</h4>
              <p className="text-slate-300 font-bold text-lg mb-2 uppercase tracking-tight">K. J. Somaiya College of Engineering</p>
              <span className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-widest">Expected 2028</span>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Resume;