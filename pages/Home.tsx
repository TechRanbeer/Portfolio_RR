import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Cpu, Layers, Mail, LucideProps, Terminal, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Project, SiteConfig } from '../types';
import Hero from '../components/ui/animated-shader-hero';

interface HomeProps {
  projects: Project[];
  config: SiteConfig | null;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  }
};

const Home: React.FC<HomeProps> = ({ projects, config }) => {
  const navigate = useNavigate();
  const featuredProjects = projects.filter(p => p.featured && p.status === 'published').slice(0, 3);

  return (
    <div className="relative">
      <Hero 
        headline={{
          line1: config?.hero_headline_line1 || "Ranbeer",
          line2: config?.hero_headline_line2 || "Raja"
        }}
        subtitle={config?.hero_subtitle || "Mechanical Engineer & Embedded Systems Specialist."}
        buttons={{
          primary: {
            text: "Explore Systems",
            onClick: () => navigate('/projects')
          },
          secondary: {
            text: "Talk to AI Me",
            onClick: () => navigate('/chat')
          }
        }}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: <Cpu />, title: "ARM & Embedded", desc: "Expertise in ARM microcontrollers and Raspberry Pi development." },
              { icon: <Terminal />, title: "Linux & Docker", desc: "Enterprise server administration and containerized IoT clusters." },
              { icon: <ShieldCheck />, title: "Mechanical", desc: "Designing and validating physical systems with a focus on structure." },
              { icon: <Layers />, title: "Software", desc: "Developing modern software systems that simulate and automate engineering." }
            ].map((skill, i) => (
              <motion.div key={i} variants={itemVariants} className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-sm rounded-[2rem] hover:border-cyan-500/30 transition-all group">
                <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(skill.icon as React.ReactElement<LucideProps>, { size: 36 })}
                </div>
                <h3 className="text-white font-black text-xl mb-3 uppercase tracking-tight">{skill.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">Featured Deployments</h2>
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Active Engineering Initiatives</p>
            </div>
            <Link to="/projects" className="text-cyan-400 text-xs font-black uppercase tracking-widest flex items-center hover:underline group">
              View Registry <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative bg-slate-900/50 border border-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden hover:border-cyan-500/30 transition-all"
              >
                <Link to={`/projects/${project.slug}`}>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-slate-950/20"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[9px] uppercase font-black tracking-widest px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{project.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 border border-white/5 backdrop-blur-xl p-16 rounded-[3rem] text-center relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Engineering Sync</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Actively seeking high-impact opportunities in ARM development, mechanical chassis design, and IoT architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href={`mailto:${config?.contact_email || 'ranbeerraja1@gmail.com'}`} className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all flex items-center shadow-2xl">
                <Mail className="mr-3" size={20} /> Deploy Inquiry
              </a>
              <Link to="/projects" className="px-12 py-5 bg-slate-800 backdrop-blur-sm text-white font-black border border-white/10 rounded-2xl hover:border-cyan-400 transition-all uppercase tracking-[0.2em]">
                Registry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;