import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export type Mode = 'ai' | 'human';

interface CapabilitiesProps {
  mode: Mode;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({ mode }) => {
  const skills = [
    { name: 'MECHANICAL DESIGN', rating: 92, tools: ['SolidWorks', 'Fusion 360', 'Manufacturing'] },
    { name: 'FEA & STRUCTURAL VALIDATION', rating: 88, tools: ['ANSYS', 'Materials', 'Optimization'] },
    { name: 'POWERTRAIN INTEGRATION', rating: 87, tools: ['Powertrain', 'Mounts', 'Gear Ratios'] },
    { name: 'SYSTEMS & INFRASTRUCTURE', rating: 89, tools: ['Linux', 'Docker', 'Raspberry Pi'] },
    { name: 'SOFTWARE DEVELOPMENT', rating: 86, tools: ['C++', 'MySQL', 'APIs', 'Python'] },
    { name: 'AI / ML & INTELLIGENT SYSTEMS', rating: 84, tools: ['HuggingFace', 'Gemini API', 'NLP'] }
  ];

  const label = mode === 'ai' ? 'CAPABILITIES' : 'PERFORMANCE_RATINGS';

  return (
    <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div className="space-y-2">
          <div className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase">{label}</div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">SYSTEM CAPABILITIES</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="flex justify-between items-end mb-2 px-2">
              <span className="text-xs font-mono tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                {skill.name}
              </span>
              <span className="text-xl font-black text-cyan-500">
                {skill.rating}
              </span>
            </div>
            
            <div className="h-16 w-full bg-slate-950 border border-white/5 relative overflow-hidden flex items-center px-6">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.rating}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="absolute inset-y-0 left-0 bg-cyan-500/10 border-r border-cyan-500"
              />
              
              <div className="relative z-10 flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                {skill.tools.map(tool => (
                  <span key={tool} className="text-[13px] font-mono font-black bg-cyan-600/20 text-cyan-400 px-3 py-1 rounded-sm border border-cyan-500/30 uppercase tracking-wider">
                    {tool}
                  </span>
                ))}
              </div>

              {/* Grid lines inside bar */}
              <div className="absolute inset-0 pointer-events-none flex justify-between px-2 opacity-10">
                {[...Array(10)].map((_, j) => (
                  <div key={j} className="w-[1px] h-full bg-slate-400" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
