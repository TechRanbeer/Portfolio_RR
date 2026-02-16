import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap, Mail, MapPin, Phone, ChevronRight, Terminal, Target, BookOpen, Layers } from 'lucide-react';
import { Experience, SiteConfig } from '../types';

interface ResumeProps {
  experience: Experience[];
  config: SiteConfig | null;
}

const Resume: React.FC<ResumeProps> = ({ experience, config }) => {
  const skills = [
    { label: "Mechanical Engineering", items: ["SolidWorks (Advanced)", "ANSYS Structural Analysis", "Chassis Geometry", "Powertrain Design", "Mechanical Testing", "FMEA", "Prototyping", "Manufacturing Processes"] },
    { label: "Software & Systems", items: ["Linux (CLI)", "Docker", "Raspberry Pi", "NAS Infrastructure", "Networking", "Tailscale", "API Integration"] },
    { label: "Programming & Data", items: ["Java (Swing, JDBC)", "MySQL", "React", "TypeScript", "Data Analysis", "AI/ML", "Rapid Prototyping", "Full-Stack Development", "Netlify Deployment"] }
  ];

  const handleGeneratePDF = () => {
    window.print();
  };

  const formatDateRange = (start: string, end?: string, current?: boolean) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (current) return `${s} – Present`;
    if (!end) return s;
    const e = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${s} – ${e}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-10 no-print">
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={16} /> Professional Dossier
        </h2>
        <button 
          onClick={handleGeneratePDF} 
          className="px-8 py-4 bg-white text-black font-black tracking-widest rounded-2xl hover:bg-cyan-400 transition-all uppercase text-xs shadow-2xl flex items-center gap-2"
        >
          <Download size={18} /> Generate PDF
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-slate-900/40 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-sm print:bg-white print:text-black print:border-none print:shadow-none print:rounded-none"
      >
        {/* Header */}
        <div className="p-12 md:p-20 border-b border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent print:bg-none print:p-8 print:border-b-2 print:border-slate-200">
          <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none print:text-black print:text-5xl mb-4 text-center md:text-left">
            {config?.logo_line1 || 'Ranbeer'} <span className="text-cyan-500">{config?.logo_line2 || 'Raja'}</span>
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-400 text-[10px] font-bold uppercase tracking-widest print:text-slate-600">
             <span className="flex items-center"><Phone size={12} className="mr-2 text-cyan-500" /> {config?.contact_phone}</span>
             <span className="text-slate-700 print:hidden">|</span>
             <span className="flex items-center"><Mail size={12} className="mr-2 text-cyan-500" /> {config?.contact_email}</span>
             <span className="text-slate-700 print:hidden">|</span>
             <span className="flex items-center"><MapPin size={12} className="mr-2 text-cyan-500" /> {config?.location}</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 text-[10px] font-bold uppercase tracking-widest text-cyan-500">
            <a href={config?.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">linkedin.com/in/ranbeerraja</a>
            <span className="text-slate-700 print:hidden">|</span>
            <a href={config?.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github.com/TechRanbeer</a>
          </div>
        </div>

        <div className="p-12 md:p-16 space-y-16 print:p-8 print:space-y-8">
          
          {/* Summary */}
          <section className="space-y-4">
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] border-b border-white/10 pb-2 print:text-black print:border-slate-800">Professional Summary</h2>
            <p className="text-slate-300 text-sm leading-relaxed text-justify print:text-slate-800">
              {config?.bio_summary}
            </p>
          </section>

          {/* Education */}
          <section className="space-y-4">
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] border-b border-white/10 pb-2 print:text-black print:border-slate-800">Education</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight print:text-black">K. J. Somaiya College of Engineering</h3>
                <p className="text-slate-400 text-sm italic print:text-slate-700">Bachelor of Technology in Mechanical Engineering</p>
                <p className="text-slate-500 text-xs mt-1 print:text-slate-600">Relevant Coursework: Engineering Design, Thermodynamics, Robotics and AI (Minor), Materials Science.</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-black text-white uppercase tracking-widest print:text-black">Mumbai, India</div>
                <div className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-widest mt-1 print:text-slate-700">Expected Apr. 2028</div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="space-y-8">
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] border-b border-white/10 pb-2 print:text-black print:border-slate-800">Experience</h2>
            <div className="space-y-12 print:space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight print:text-black">{exp.company}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest print:text-black hidden sm:inline">{exp.location || 'Mumbai, India'}</span>
                      <span className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-widest print:text-slate-700">{formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 print:text-slate-700">{exp.title}</div>
                  <ul className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start leading-relaxed print:text-slate-800">
                        <ChevronRight size={14} className="text-cyan-600 mr-2 mt-1 shrink-0 print:text-black" /> 
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section className="space-y-6">
            <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] border-b border-white/10 pb-2 print:text-black print:border-slate-800">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:gap-4">
              {skills.map((g, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 print:text-black">
                    <Layers size={12} className="text-cyan-500" /> {g.label}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed print:text-slate-800">
                    {g.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </motion.div>
      
      <div className="mt-12 text-center no-print">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          Last Synchronized: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default Resume;