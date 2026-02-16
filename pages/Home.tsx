import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Cpu, Layers, Mail, LucideProps, Terminal, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Project, SiteConfig } from '../types';
import Hero from '../components/ui/animated-shader-hero';

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
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Home: React.FC<HomeProps> = ({ projects, config }) => {
  const navigate = useNavigate();
  const featured = projects.filter(p => p.featured && p.status === 'published').slice(0, 3);

  return (
    <div className="relative">
      <Hero 
        headline={{ line1: config?.hero_headline_line1 || "Ranbeer", line2: config?.hero_headline_line2 || "Raja" }}
        subtitle={config?.hero_subtitle || "Mechanical Engineer & Embedded Systems Specialist."}
        buttons={{
          primary: { text: "Explore Projects", onClick: () => navigate('/projects') },
          secondary: { text: "AI Assistant", onClick: () => navigate('/chat') }
        }}
      />

      <section className="py-24 max-w-7xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Cpu />, title: "ARM & Embedded", desc: "Expertise in ARM microcontrollers and Raspberry Pi development." },
            { icon: <Terminal />, title: "Systems Engineer", desc: "Linux server administration and containerized IoT ecosystems." },
            { icon: <ShieldCheck />, title: "Mechanical Design", desc: "SolidWorks chassis engineering and structural validation." },
            { icon: <Layers />, title: "Full Stack", desc: "Building intelligent software interfaces for hardware control." }
          ].map((skill, i) => (
            <motion.div key={i} variants={itemVariants} className="p-10 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:border-cyan-500/30 transition-all group">
              <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform">{React.cloneElement(skill.icon as React.ReactElement<LucideProps>, { size: 36 })}</div>
              <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tight">{skill.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{skill.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-24 border-t border-white/5 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Featured Work</h2>
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Active Engineering Registry</p>
          </div>
          <Link to="/projects" className="text-cyan-400 font-black uppercase tracking-widest text-xs flex items-center hover:underline gap-2 group">
            All Projects <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/30 transition-all">
              <Link to={`/projects/${p.slug}`}>
                <img src={p.thumbnail} alt={p.title} className="aspect-video w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8">
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{p.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/60 border border-white/5 backdrop-blur-xl p-16 rounded-[3rem] text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Let's Connect</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Actively seeking high-impact opportunities in ARM development, mechanical chassis design, and IoT architecture.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href={`mailto:${config?.contact_email || 'ranbeerraja1@gmail.com'}`} className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl flex items-center gap-3">
              <Mail size={20} /> Deploy Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;