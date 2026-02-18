import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowUpRight, Cpu, Layers, Mail, LucideProps, Terminal, ShieldCheck, 
  MessageSquare, Send, X, Check, Loader2, User, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Project, SiteConfig } from '../types';
import Hero from '../components/ui/animated-shader-hero';
import { useForm, ValidationError } from '@formspree/react';

interface HomeProps {
  projects: Project[];
  config: SiteConfig | null;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [state, handleSubmit] = useForm("mjgerdvp");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 text-slate-500 hover:text-white transition-premium p-2"
            >
              <X size={28} />
            </button>

            {state.succeeded ? (
              <div className="text-center py-16 space-y-8">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <Check size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Transmission Successful</h3>
                  <p className="text-slate-400 font-medium mt-4 max-w-sm mx-auto">Your inquiry has been successfully logged. Response incoming within 24 standard hours.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-base rounded-2xl hover:bg-cyan-400 transition-premium shadow-xl"
                >
                  Return to Console
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                <div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Deploy Inquiry</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Initialize Professional protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="full-name" className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Identity</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                        <input 
                          id="full-name" 
                          type="text" 
                          name="name" 
                          required 
                          placeholder="Full Name"
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 pl-14 text-white focus:border-cyan-500/50 outline-none transition-premium text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Endpoint</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                        <input 
                          id="email" 
                          type="email" 
                          name="email" 
                          required 
                          placeholder="Email Address"
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 pl-14 text-white focus:border-cyan-500/50 outline-none transition-premium text-sm font-medium"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="purpose" className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Mission Type</label>
                    <select 
                      id="purpose" 
                      name="purpose" 
                      required
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white focus:border-cyan-500/50 outline-none transition-premium text-sm font-bold uppercase tracking-widest"
                    >
                      <option value="Connect">Connection / Networking</option>
                      <option value="Consult">Technical Consultation</option>
                      <option value="Project">Project Collaboration</option>
                      <option value="Career">Career Opportunity</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Specifications</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      required
                      placeholder="Details of your vision..."
                      className="w-full h-40 bg-slate-950 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm outline-none resize-none focus:border-cyan-500/50 transition-premium leading-relaxed font-medium" 
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-[10px] mt-1" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={state.submitting}
                    className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-base rounded-2xl hover:bg-cyan-400 transition-premium flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                  >
                    {state.submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                    Broadcast Signal
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Home: React.FC<HomeProps> = ({ projects, config }) => {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const featured = projects.filter(p => p.featured && p.status === 'published').slice(0, 3);

  const expertise = [
    { 
      icon: <Cpu />, 
      title: "Embedded Systems", 
      desc: "Architecting logic on ARM and Pi-5 platforms with enterprise-grade automation protocols.",
      code: "SYS_ARCH_v1.0.4",
      span: "md:col-span-2"
    },
    { 
      icon: <Terminal />, 
      title: "Systems Engineering", 
      desc: "Infrastructure ownership: Linux deployments, high-availability clusters, and secure IoT nodes.",
      code: "NET_INFRA_STABLE",
      span: "md:col-span-1"
    },
    { 
      icon: <ShieldCheck />, 
      title: "Mechanical Design", 
      desc: "Full geometry ownership & ANSYS validation for high-performance chassis systems.",
      code: "MECH_GEO_PRIME",
      span: "md:col-span-1"
    },
    { 
      icon: <Layers />, 
      title: "Hybrid Integration", 
      desc: "The critical interface between bare-metal hardware and modern microservice software architecture.",
      code: "INTG_BRIDGE_OS",
      span: "md:col-span-2"
    }
  ];

  return (
    <div className="relative">
      <Hero 
        headline={{ line1: "RANBEER", line2: "RAJA" }}
        subtitle={config?.hero_subtitle || "Systems Specialist & Mechanical Engineer"}
        buttons={{
          primary: { text: "The Registry", onClick: () => navigate('/projects') },
          secondary: { text: "AI Consultant", onClick: () => navigate('/chat') }
        }}
      />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Expertise Section - Bento Grid Technical Design */}
      <section className="py-40 max-w-7xl mx-auto px-6 relative">
        <motion.div 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {expertise.map((skill, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className={`${skill.span} group relative p-10 bg-slate-900/10 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl hover:bg-slate-900/30 hover:border-white/10 transition-premium shadow-2xl`}
            >
              {/* Corner Metadata Brackets */}
              <div className="absolute top-6 left-6 w-2 h-2 border-l border-t border-slate-700 group-hover:border-cyan-500 transition-colors"></div>
              <div className="absolute top-6 right-6 w-2 h-2 border-r border-t border-slate-700 group-hover:border-cyan-500 transition-colors"></div>
              
              <div className="relative mb-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-slate-950 rounded-2xl text-slate-600 group-hover:text-cyan-400 group-hover:scale-110 transition-premium border border-white/5">
                    {React.cloneElement(skill.icon as React.ReactElement<LucideProps>, { size: 28 })}
                  </div>
                  <span className="font-mono text-[8px] text-slate-700 uppercase tracking-[0.4em] group-hover:text-cyan-600 transition-colors">
                    {skill.code}
                  </span>
                </div>
                
                <h3 className="text-white font-black text-2xl mb-4 tracking-tighter uppercase leading-none">
                  {skill.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-premium max-w-sm">
                  {skill.desc}
                </p>
              </div>

              {/* Status Indicator Bar */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-700 group-hover:text-slate-500 uppercase tracking-widest">Active System</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500/50 w-0 group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>

              {/* Light Sweep Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects - Refined Scaling */}
      <section className="py-48 border-y border-white/5 bg-slate-900/5 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-28 gap-10">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-cyan-600 uppercase tracking-[0.5em] block ml-1">Archive_Index_v2</span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">The Registry</h2>
            </div>
            <Link to="/projects" className="group flex items-center space-x-6 py-6 px-12 rounded-2xl border border-white/10 bg-slate-950 hover:bg-white hover:text-black transition-premium shadow-2xl">
              <span className="text-sm font-black uppercase tracking-widest">Access Node Database</span>
              <ArrowUpRight size={22} className="text-cyan-400 group-hover:text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20"
          >
            {featured.slice(0, 2).map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="group">
                <Link to={`/projects/${p.slug}`} className="block space-y-12">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[3.5rem] bg-slate-950 border border-white/5 shadow-2xl">
                    <img 
                      src={p.thumbnail} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-all duration-1000 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-10 right-10">
                      <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                        <ArrowUpRight size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 px-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
                        {p.category}
                      </span>
                      <span className="w-12 h-px bg-slate-800"></span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-cyan-400 transition-premium">
                      {p.title}
                    </h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                      {p.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Professional & High Impact */}
      <section className="py-60 relative">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <h2 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
              Ready to <br/><span className="text-cyan-500">Initialize?</span>
            </h2>
            
            <p className="text-slate-400 text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-medium text-balance">
              Seeking high-integrity mechanical architecture or seamless full-stack integration? Let's deploy your next vision.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
              <button 
                onClick={() => setIsContactOpen(true)} 
                className="w-full sm:w-auto px-20 py-8 bg-white text-black font-black uppercase tracking-widest text-base rounded-[2.5rem] hover:bg-cyan-400 transition-all hover:scale-105 shadow-2xl active:scale-95"
              >
                Initialize Inquiry
              </button>
              <Link 
                to="/chat"
                className="w-full sm:w-auto px-20 py-8 border border-white/10 bg-slate-900/50 text-white font-black uppercase tracking-widest text-base rounded-[2.5rem] hover:border-cyan-500/50 transition-premium flex items-center justify-center gap-4 shadow-2xl backdrop-blur-xl"
              >
                <MessageSquare size={24} className="text-cyan-500" /> Consult Assistant
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;