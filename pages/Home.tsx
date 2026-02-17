
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
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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
          primary: { text: "View Work", onClick: () => navigate('/projects') },
          secondary: { text: "Consult AI", onClick: () => navigate('/chat') }
        }}
      />

      {/* Expertise Section */}
      <section className="py-32 max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
          {[
            { icon: <Cpu />, title: "Embedded Systems", desc: "Expertise in ARM microcontrollers and Raspberry Pi 5 architecture." },
            { icon: <Terminal />, title: "Systems Engineering", desc: "Linux environments, containerization, and IoT networking." },
            { icon: <ShieldCheck />, title: "Mechanical Design", desc: "Advanced SolidWorks CAD and structural validation via ANSYS." },
            { icon: <Layers />, title: "Interface Design", desc: "Crafting intuitive high-performance software for hardware control." }
          ].map((skill, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-12 bg-slate-950 hover:bg-slate-900/50 transition-premium group"
            >
              <div className="text-slate-600 mb-8 group-hover:text-cyan-400 transition-premium">
                {React.cloneElement(skill.icon as React.ReactElement<LucideProps>, { size: 28 })}
              </div>
              <h3 className="text-white font-extrabold text-lg mb-4 uppercase tracking-tight">{skill.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed text-balance">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 border-y border-white/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Selected Artifacts</h2>
              <p className="text-slate-500 font-mono text-[11px] uppercase tracking-[0.3em]">Engineering Intelligence Repository</p>
            </div>
            <Link to="/projects" className="group flex items-center space-x-3 py-3 px-6 rounded-full border border-white/10 hover:border-white/20 transition-premium">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Access Archive</span>
              <ArrowUpRight size={14} className="text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {featured.map((p) => (
              <motion.div key={p.id} variants={itemVariants} className="group relative">
                <Link to={`/projects/${p.slug}`} className="block space-y-8">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900">
                    <img 
                      src={p.thumbnail} 
                      alt={p.title} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-premium uppercase tracking-tighter">
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[9px] font-bold text-slate-600 uppercase border border-slate-800 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 max-w-5xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Initiate Dialogue</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed text-balance">
            Available for collaboration on high-integrity systems engineering and mechanical architecture projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <a 
              href={`mailto:${config?.contact_email || 'ranbeerraja1@gmail.com'}`} 
              className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-premium shadow-xl"
            >
              Deploy Inquiry
            </a>
            <a 
              href={config?.social_links.linkedin}
              target="_blank"
              className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:border-white/30 transition-premium"
            >
              Connect LinkedIn
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
