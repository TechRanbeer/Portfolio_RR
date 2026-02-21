import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LogOut, Loader2, LayoutDashboard
} from 'lucide-react';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ChatAssistant from './pages/ChatAssistant';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminResume from './pages/admin/AdminResume';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminSettings from './pages/admin/AdminSettings';
import AiInspector from './pages/admin/AiInspector';
import Resume from './pages/Resume';
import Certificates from './pages/Certificates';
import Thanks from './pages/Thanks';
import CloudBackground from './components/ui/CloudBackground';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Services
import { Project, Blog, Experience, SiteConfig, Certificate } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const check = async () => {
      const auth = await authService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    check();
  }, []);

  if (isAuthenticated === null) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-cyan-500" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSequenceComplete, setLoadingSequenceComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const admin = await authService.isAdmin();
      setIsAdmin(admin);
      
      const [p, b, e, c, s] = await Promise.all([
        storageService.getProjects(),
        Promise.resolve(storageService.getBlogs()),
        storageService.getExperience(),
        storageService.getCertificates(),
        storageService.getSiteConfig()
      ]);
      
      setProjects(p);
      setBlogs(b);
      setExperience(e);
      setCertificates(c);
      setSiteConfig(s);
    } catch (err) {
      console.error("Hydration Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    setIsAdmin(false);
    navigate('/');
  };

  if (!loadingSequenceComplete) {
    return <LoadingScreen onComplete={() => setLoadingSequenceComplete(true)} />;
  }

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-cyan-500" size={32} /></div>;

  const navLinks = [
    { name: 'Projects', path: '/projects' },
    { name: 'Resume', path: '/resume' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'AI', path: '/chat' },
  ];

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      <CloudBackground />
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHome ? 'h-24' : 'h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-white font-black text-2xl uppercase tracking-tighter leading-none">
              RANBEER<span className="text-cyan-500">RAJA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((l) => (
              <Link 
                key={l.path} 
                to={l.path} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-premium hover:text-white ${location.pathname === l.path ? 'text-white border-b-2 border-cyan-500 pb-1' : 'text-slate-500'}`}
              >
                {l.name}
              </Link>
            ))}
            {isAdmin && (
              <div className="flex items-center space-x-6 border-l border-white/10 pl-6 ml-2">
                <Link to="/admin" className="text-cyan-400 hover:text-white transition-premium"><LayoutDashboard size={18} /></Link>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-premium"><LogOut size={18} /></button>
              </div>
            )}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            className="fixed inset-0 z-40 bg-slate-950 flex flex-col justify-center items-center space-y-8 md:hidden p-6"
          >
            {navLinks.map((l) => (
              <Link 
                key={l.path} 
                to={l.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-4xl font-black uppercase tracking-tighter text-white hover:text-cyan-400"
              >
                {l.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-cyan-400 text-2xl font-black uppercase tracking-tighter">
                Dashboard
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(false)} className="mt-12 text-slate-500"><X size={48} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Routes>
          <Route path="/" element={<Home projects={projects} config={siteConfig} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetail projects={projects} />} />
          <Route path="/chat" element={<ChatAssistant projects={projects} blogs={blogs} />} />
          <Route path="/resume" element={<Resume experience={experience} config={siteConfig} />} />
          <Route path="/certificates" element={<Certificates certificates={certificates} />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/login" element={<Login onLoginSuccess={loadData} />} />
          
          <Route path="/admin" element={<AdminGuard><AdminDashboard projects={projects} /></AdminGuard>} />
          <Route path="/admin/projects" element={<AdminGuard><AdminProjects projects={projects} onUpdate={setProjects} /></AdminGuard>} />
          <Route path="/admin/resume" element={<AdminGuard><AdminResume experience={experience} onUpdate={setExperience} /></AdminGuard>} />
          <Route path="/admin/certificates" element={<AdminGuard><AdminCertificates certificates={certificates} onUpdate={setCertificates} /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminSettings config={siteConfig} onUpdate={setSiteConfig} /></AdminGuard>} />
          <Route path="/admin/ai-inspector" element={<AdminGuard><AiInspector projects={projects} /></AdminGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="py-20 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white font-black text-2xl uppercase tracking-tighter">
              RANBEER<span className="text-cyan-500">RAJA</span>
            </span>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-2">
              Engineering the Physical & Digital Frontier
            </span>
          </div>
          <div className="flex space-x-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href={siteConfig?.social_links.github} className="hover:text-white transition-premium" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={siteConfig?.social_links.linkedin} className="hover:text-white transition-premium" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${siteConfig?.contact_email}`} className="hover:text-white transition-premium">Email</a>
          </div>
          <p className="text-[11px] font-mono text-slate-400 font-medium uppercase tracking-widest">
            &copy; 2026 RANBEER RAJA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;