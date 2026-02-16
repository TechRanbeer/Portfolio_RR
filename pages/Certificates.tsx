import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-20">
        <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Credential Vault</h1>
        <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">Verified credentials, technical certifications, and recognition for academic and hardware engineering excellence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {certificates.map((cert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-md hover:border-cyan-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-800 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{cert.category}</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-tight">{cert.title}</h3>
            <div className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest">{cert.issuer}</div>
            
            <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
              <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={14} className="mr-2 text-cyan-500" />
                {cert.date}
              </div>
              <div className="text-[9px] font-mono text-slate-700 uppercase tracking-tighter">
                {cert.id}
              </div>
            </div>

            {cert.verificationUrl && (
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} className="text-slate-500 cursor-pointer hover:text-cyan-400" />
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-16 bg-slate-900/20 border border-white/5 rounded-[3rem] text-center backdrop-blur-sm">
        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Academic Recognition</h3>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Currently pursuing Bachelor of Technology at K. J. Somaiya College of Engineering. Active lead in technical symposiums and vehicle validation initiatives.
        </p>
        <div className="inline-flex items-center space-x-3 text-cyan-400 font-black uppercase text-xs tracking-[0.2em] cursor-pointer hover:underline transition-all group">
          <span>View Detailed Academic Transcript</span>
          <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default Certificates;