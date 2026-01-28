
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

const Certificates: React.FC = () => {
  const certifications = [
    {
      title: "Black Belt - 1st Dan",
      issuer: "National Karate Association",
      date: "2023",
      id: "CERT-KRT-2023",
      category: "Personal Discipline",
      icon: <ShieldCheck className="text-yellow-500" />
    },
    {
      title: "Embedded Systems Certification",
      issuer: "Hardware Mastery Institute",
      date: "2024",
      id: "EMB-SYS-9921",
      category: "Engineering",
      icon: <Award className="text-cyan-400" />
    },
    {
      title: "Java Full Stack Development",
      issuer: "Global Tech Academy",
      date: "2024",
      id: "JFS-2024-8812",
      category: "Software",
      icon: <Award className="text-blue-500" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Certifications & Awards</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Verified credentials, technical certifications, and recognition for academic and extra-curricular excellence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certifications.map((cert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-8 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-sm hover:border-cyan-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-800 rounded-2xl">
                {cert.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{cert.category}</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{cert.title}</h3>
            <div className="text-sm font-medium text-slate-400 mb-6">{cert.issuer}</div>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center text-xs text-slate-500">
                <Calendar size={14} className="mr-2" />
                {cert.date}
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                {cert.id}
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={16} className="text-slate-500 cursor-pointer hover:text-cyan-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-slate-900/20 border border-white/5 rounded-[32px] text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Academic Recognition</h3>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Currently pursuing Bachelor of Technology at KJ Somaiya College. Active participant in technical symposiums and hardware hacking competitions.
        </p>
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold uppercase text-xs tracking-widest cursor-pointer hover:underline">
          <span>View Detailed Academic Transcript</span>
          <ExternalLink size={14} />
        </div>
      </div>
    </div>
  );
};

export default Certificates;
