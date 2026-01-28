
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Cpu, Layers, Mail, LucideProps, Terminal, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import Hero from '../components/ui/animated-shader-hero';

interface HomeProps {
  projects: Project[];
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

const Home: React.FC<HomeProps> = ({ projects }) => {
  const navigate = useNavigate();
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="relative">
      <Hero 
        headline={{
          line1: "Ranbeer",
          line2: "Raja"
        }}
        subtitle="Mechanical Engineer & Embedded Systems Specialist. Crafting intelligent hardware solutions and high-performance IoT ecosystems."
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
              { icon: <ShieldCheck />, title: "Mechanical", desc: "Designing and validating physical systems with a focus on structure, constraints, and behavior." },
              { icon: <Layers />, title: "Software", desc: "Developing modern software systems that simulate, automate, and integrate engineering workflows." }
            ].map((skill, i) => (
              <motion.div key={i} variants={itemVariants} className="p-8 bg-slate-900/40 border border-white/5 backdrop-blur-sm rounded-2xl hover:border-cyan-500/30 transition-all group">
                <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(skill.icon as React.ReactElement<LucideProps>, { size: 32 })}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{skill.title}</h3>
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
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Deployments</h2>
              <p className="text-slate-500">Core engineering initiatives and hardware integrations.</p>
            </div>
            <Link to="/projects" className="text-cyan-400 text-sm font-bold flex items-center hover:underline uppercase tracking-widest">
              View Registry <ArrowUpRight className="ml-1" size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative bg-slate-900/50 border border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all"
              >
                <Link to={`/projects/${project.slug}`}>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-slate-800 text-slate-400 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
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
            className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-white/5 backdrop-blur-md p-12 rounded-[32px] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Discuss Engineering</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Based in India and a student at KJ Somaiya College, I am actively seeking remote opportunities where I can apply my skills in ARM, Java, and IoT server architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:ranbeerraja1@gmail.com" className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center shadow-lg shadow-white/5">
                <Mail className="mr-2" size={18} /> Contact Me
              </a>
              <Link to="/projects" className="px-10 py-4 bg-slate-900/50 backdrop-blur-sm text-white font-bold border border-white/10 rounded-xl hover:border-cyan-400 transition-colors">
                View Tech Specs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
