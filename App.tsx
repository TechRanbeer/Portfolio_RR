import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Github, Linkedin, Mail, Instagram,
  Briefcase, Sparkles, Settings, FileText, Award
} from 'lucide-react';

// Components
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ChatAssistant from './pages/ChatAssistant';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import BlogList from './pages/BlogList';
import Resume from './pages/Resume';
import Certificates from './pages/Certificates';
import CloudBackground from './components/ui/CloudBackground';

// Types & Services
import { Project, Blog } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(storageService.getProjects());
  const [blogs] = useState<Blog[]>(storageService.getBlogs());
  const location = useLocation();

  useEffect(() => {
    const views = parseInt(localStorage.getItem('rr_total_views') || '0');
    localStorage.setItem('rr_total_views', (views + 1).toString());
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Projects', path: '/projects', icon: <Briefcase size={18} /> },
    { name: 'Resume', path: '/resume', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
    { name: 'AI Assistant', path: '/chat', icon: <Sparkles size={18} /> },
  ];

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500/30 bg-slate-950">
      <CloudBackground />
      
      <nav className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <span className="text-xl font-bold tracking-tight text-white uppercase">Ranbeer<span className="text-cyan-400">Raja</span></span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-all hover:text-cyan-400 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-400'}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              <Link to="/admin" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors" title="Admin Control Center">
                <Settings size={20} />
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-slate-300 rounded-lg"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-slate-500 rounded-lg"
                >
                  <Settings size={18} />
                  <span>Admin Console</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home projects={projects} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetail projects={projects} />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/blog" element={<BlogList blogs={blogs} />} />
          <Route path="/chat" element={<ChatAssistant projects={projects} blogs={blogs} />} />
          <Route path="/admin" element={<AdminDashboard projects={projects} />} />
          <Route path="/admin/projects" element={<AdminProjects projects={projects} onUpdate={setProjects} />} />
        </Routes>
      </main>

      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-12 relative z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-xl font-bold text-white uppercase">Ranbeer Raja</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                Mechanical Engineer & Embedded Systems Specialist. Bridging the gap between hardware precision and intelligent software.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-full hover:bg-slate-700 transition-colors"><Github size={20} /></a>
                <a href="https://www.linkedin.com/in/ranbeer-raja-10626532a/" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition-colors"><Linkedin size={20} /></a>
                <a href="https://www.instagram.com/ranbe3r.24_/" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded-full hover:bg-pink-600 transition-colors"><Instagram size={20} /></a>
                <a href="mailto:ranbeerraja1@gmail.com" className="p-2 bg-slate-900 rounded-full hover:bg-red-600 transition-colors"><Mail size={20} /></a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Navigation</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/projects" className="hover:text-cyan-400 transition-colors">Engineering Projects</Link></li>
                <li><Link to="/resume" className="hover:text-cyan-400 transition-colors">Interactive Resume</Link></li>
                <li><Link to="/certificates" className="hover:text-cyan-400 transition-colors">Certifications</Link></li>
                <li><Link to="/chat" className="hover:text-cyan-400 transition-colors">AI Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Based in India</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Available for remote global opportunities in IoT, Embedded Systems, and Mechanical Design.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Ranbeer Raja | KJ Somaiya College. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;