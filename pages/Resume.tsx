import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Briefcase, GraduationCap, 
  Mail, MapPin, Phone, ExternalLink,
  ChevronRight, Terminal, Box, Target
} from 'lucide-react';

const Resume: React.FC = () => {
  const experiences = [
    {
      title: "Senior Chassis Engineer",
      company: "Tachyon Moto India, KJSCE | Mumbai",
      period: "09/2025 – Present",
      achievements: [
        "Designed and engineered a complete vehicle chassis end-to-end, owning geometry, materials, and manufacturability.",
        "Performed structural validation using ANSYS, improving stiffness, safety margins, and design confidence.",
        "Led integration with engine, suspension, and braking systems; reduced rework via FMEA-driven decisions."
      ]
    },
    {
      title: "Powertrain Engineer",
      company: "Team ETA India, KJSCE | Mumbai",
      period: "10/2024 – 09/2025",
      achievements: [
        "Contributed to powertrain and electrification efforts through testing and data-driven design improvements.",
        "Reviewed technical documentation for compliance and collaborated across drivetrain, electronics, and chassis teams."
      ]
    }
  ];

  const resumeProjects = [
    {
      title: "Moneo – AI-Driven Budgeting Platform",
      period: "11/2025",
      description: "Built a production-ready web app delivering real-time financial insights via Google Gemini API.",
      link: "https://itsmoneo.netlify.app/",
      stack: ["React", "Gemini API", "TypeScript"]
    },
    {
      title: "Inventory Management System",
      period: "01/2025 – 04/2025",
      description: "Designed a desktop system with Swing GUI and full CRUD operations using MySQL + JDBC.",
      stack: ["Java", "MySQL", "JDBC"]
    },
    {
      title: "Home NAS & Self-Hosting",
      period: "02/2025 – Present",
      description: "Built a Docker-based NAS using Raspberry Pi 5, CasaOS, and Tailscale for secure remote access.",
      stack: ["Docker", "Linux", "Tailscale"]
    }
  ];

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
      items: ["Java IDE", "MySQL", "React", "TypeScript", "Data Analysis", "AI/ML", "Netlify", "Google Cloud"] 
    }
  ];

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-end mb-8 no-print">
        <button 
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 text-slate-900 text-sm font-bold rounded hover:bg-cyan-400 transition-all active:scale-95 shadow-lg"
        >
          <Download size={16} />
          <span>DOWNLOAD PDF</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/10 rounded-sm shadow-2xl overflow-hidden backdrop-blur-sm print:bg-white print:text-black print:border-none print:shadow-none"
      >
        <div className="p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent print:bg-none print:border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none print:text-black">
                Ranbeer <span className="text-cyan-500">Raja</span>
              </h1>
              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase font-bold print:text-cyan-700">
                Mechanical Engineering Student | Chassis & Powertrain Engineer | AI/ML & Systems
              </p>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-slate-400 text-xs font-medium border-t border-white/5 pt-4 print:border-slate-100 print:text-slate-600">
                <span className="flex items-center"><Mail size={12} className="mr-2 text-slate-500" /> ranbeerraja1@gmail.com</span>
                <span className="flex items-center"><Phone size={12} className="mr-2 text-slate-500" /> +91 97692 20377</span>
                <span className="flex items-center"><MapPin size={12} className="mr-2 text-slate-500" /> Thane, MH, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-16 print:space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center print:text-slate-700">
                <Target size={14} className="mr-2" /> Summary
              </h2>
            </div>
            <div className="md:col-span-3">
              <p className="text-slate-300 text-sm leading-relaxed text-justify border-l-2 border-cyan-500/20 pl-6 print:text-slate-800 print:border-cyan-200">
                High-impact Mechanical Engineering student with end-to-end ownership of vehicle system design in competitive teams. 
                Senior Chassis Engineer at Tachyon Moto India, independently designing and validating a complete vehicle chassis from 
                first principles using SolidWorks and ANSYS. Strong foundation in CAD, powertrain systems, and structural optimization.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center print:text-slate-700">
                <Briefcase size={14} className="mr-2" /> Experience
              </h2>
            </div>
            <div className="md:col-span-3 space-y-10 print:space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <h3 className="text-lg font-bold text-white tracking-tight print:text-black">{exp.title}</h3>
                    <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase print:text-cyan-700">{exp.period}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic print:text-slate-600">
                    {exp.company}
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start leading-relaxed print:text-slate-800">
                        <ChevronRight size={14} className="text-cyan-600 mr-2 mt-0.5 shrink-0 print:text-cyan-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center print:text-slate-700">
                <Terminal size={14} className="mr-2" /> Tech Stack
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 print:gap-4">
                {skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 border-b border-white/5 pb-2 print:border-slate-100 print:text-slate-800">
                      {skillGroup.label}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skillGroup.items.map((skill, i) => (
                        <span key={i} className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-sm hover:text-cyan-400 transition-colors print:bg-slate-50 print:text-slate-800 print:border print:border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center print:text-slate-700">
                <Box size={14} className="mr-2" /> Projects
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-6 print:gap-4">
                {resumeProjects.map((proj, idx) => (
                  <div key={idx} className="p-5 bg-white/[0.01] border border-white/5 hover:border-cyan-500/30 transition-all group print:border-slate-100 print:bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-bold text-white group-hover:text-cyan-400 transition-colors print:text-black">{proj.title}</h4>
                      <span className="text-[9px] font-mono text-slate-600 uppercase font-bold">{proj.period}</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-4 leading-relaxed print:text-slate-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center print:text-slate-700">
                <GraduationCap size={14} className="mr-2" /> Education
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="border-l-2 border-slate-800 pl-6 print:border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight print:text-black">B.Tech. Mechanical Engineering</h4>
                  <span className="text-xs font-mono text-cyan-500 font-bold uppercase print:text-cyan-700">Expected Apr 2028</span>
                </div>
                <p className="text-slate-300 font-bold text-sm mb-2 print:text-slate-900">K. J. Somaiya College of Engineering — Mumbai</p>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Resume;