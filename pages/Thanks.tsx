import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Terminal, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Thanks: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
              className="w-32 h-32 bg-cyan-500/10 rounded-[2.5rem] border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              <Check size={56} strokeWidth={3} />
            </motion.div>
            
            {/* HUD Elements */}
            <div className="absolute -top-4 -right-4">
              <div className="p-2 bg-slate-900 border border-white/10 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4">
              <div className="p-2 bg-slate-900 border border-white/10 rounded-xl">
                <Cpu size={16} className="text-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-cyan-600 uppercase tracking-[0.5em] block">Status: Transmission_Confirmed</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Signal <span className="text-cyan-500">Received</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
            Your inquiry has been successfully logged into the core registry. An engineering response will be dispatched within 24 hours.
          </p>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/" 
            className="group flex items-center space-x-4 py-5 px-10 rounded-2xl border border-white/10 bg-slate-900 hover:bg-white hover:text-black transition-premium shadow-2xl"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Return to Console</span>
          </Link>
          <div className="flex items-center space-x-3 px-6 py-4 rounded-2xl border border-white/5 bg-slate-950/50">
            <Terminal size={14} className="text-slate-600" />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">ACK_CODE: 0x7F4B2E</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Thanks;