
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Calendar } from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-20">
        <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Credential Vault</h1>
        <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">Verified credentials and recognition for technical excellence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {certificates.map((cert, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group relative p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-md hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-800 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cert.category}</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-tight">{cert.title}</h3>
            <div className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest">{cert.issuer}</div>
            <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {/* Corrected property access to issueDate */}
              <span className="flex items-center"><Calendar size={14} className="mr-2 text-cyan-500" /> {cert.issueDate}</span>
              <span className="font-mono text-slate-700">{cert.id}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
