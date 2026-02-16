import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Briefcase, GraduationCap, 
  Mail, MapPin, Phone, ExternalLink,
  ChevronRight, Terminal, Box, Target
} from 'lucide-react';
import { Experience, SiteConfig } from '../types';

interface ResumeProps {
  experience: Experience[];
  config: SiteConfig | null;
}

const Resume: React.FC<ResumeProps> = ({ experience, config }) => {
  const skills = [
    { 
      label: "Engineering", 
      items: ["SolidWorks", "ANSYS", "Chassis Design", "Powertrain Systems", "Mechanical Testing", "Prototyping"] 
    },
    { 
      label: "Software & Systems", 
      items: ["Linux (CLI)", "Docker", "Raspberry Pi", "NAS Infrastructure", "Networking", "Tailscale", "API Integration"] 
    },
    { 
      label: "Programming & Data", 
      items: ["Java IDE", "MySQL", "React", "TypeScript", "AI/ML", "Google Cloud"] 
    }
  ];

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-end mb-10 no-print">
        <button 
          onClick={handleDownload}
          className="flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 font-black tracking-widest rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl uppercase text-xs"
        >
          <Download size={18} />
          <span>Generate PDF</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900/40 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-sm print:bg-white print:text-black print:border-none print:shadow-none"
      >
        <div className="p-12 md:p-20 border-b border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent print:bg-none print:border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none print:text-black">
                {config?.logo_line1 || 'Ranbeer'} <span className="text-cyan-500">{config?.logo_line2 || 'Raja'}</span>
              </h1>
              <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase font-bold print:text-cyan-700">
                {config?.hero_subtitle || 'Mechanical Engineer | Systems Specialist'}
              </p>
              <div className="flex flex-wrap gap-y-4 gap-x-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-white/5 pt-8 print:border-slate-100 print:text-slate-600">
                <span className="flex items-center"><Mail size={16} className="mr-3 text-cyan-500" /> {config?.contact_email}</span>
                <span className="flex items-center"><Phone size={16} className="mr-3 text-cyan-500" /> {config?.contact_phone}</span>
                <span className="flex items-center"><MapPin size={16} className="mr-3 text-cyan-500" /> {config?.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 md:p-20 space-y-20 print:space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700">
                <Target size={16} className="mr-3" /> Summary
              </h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-slate-300 text-base leading-relaxed text-justify border-l-4 border-cyan-500/20 pl-8 print:text-slate-800 print:border-cyan-200">
                {config?.bio_summary || 'High-impact engineer specialized in systems design and validation.'}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700">
                <Briefcase size={16} className="mr-3" /> Experience
              </h2>
            </div>
            <div className="md:col-span-3 space-y-16 print:space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight print:text-black group-hover:text-cyan-400 transition-colors">{exp.title}</h3>
                    <span className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-[0.2em] print:text-cyan-700">{exp.period}</span>
                  </div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 italic print:text-slate-600">
                    {exp.company}
                  </div>
                  <ul className="space-y-4">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start leading-relaxed print:text-slate-800">
                        <ChevronRight size={16} className="text-cyan-600 mr-3 mt-0.5 shrink-0 print:text-cyan-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700">
                <Terminal size={16} className="mr-3" /> Stack
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 print:gap-6">
                {skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 border-b border-white/10 pb-4 print:border-slate-100 print:text-slate-800">
                      {skillGroup.label}
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {skillGroup.items.map((skill, i) => (
                        <span key={i} className="text-[11px] font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg hover:text-cyan-400 transition-colors print:bg-slate-50 print:text-slate-800 print:border print:border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] flex items-center print:text-slate-700">
                <GraduationCap size={16} className="mr-3" /> Academy
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="border-l-4 border-slate-800 pl-8 print:border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight print:text-black">B.Tech. Mechanical Engineering</h4>
                  <span className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-widest print:text-cyan-700">Expected 2028</span>
                </div>
                <p className="text-slate-300 font-bold text-lg mb-2 print:text-slate-900 uppercase tracking-tight">K. J. Somaiya College of Engineering</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Resume;