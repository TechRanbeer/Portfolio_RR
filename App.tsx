import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Briefcase, Settings, FileText, Award, LogOut, Loader2, ShieldAlert, Key, Lock, MessageSquare, LayoutDashboard
} from 'lucide-react';

// Components
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
import CloudBackground from './components/ui/CloudBackground';

// Services
import { Project, Blog, Experience, SiteConfig, Certificate } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';

/**
 * AdminGuard Component
 * Redirects to login if session is not found.
 */
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await authService.isAuthenticated();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadAppData = async () => {
    try {
      const adminStatus = await authService.isAdmin();
      setIsAdmin(adminStatus);
      
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
      console.error("Critical: Data hydration failed.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Projects', path: '/projects', icon: <Briefcase size={18} /> },
    { name: 'Resume', path: '/resume', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
    { name: 'AI Assistant', path: '/chat', icon: <MessageSquare size={18} /> },
  ];

  const handleLogout = async () => {
    await authService.logout();
    setIsAdmin(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 size={40} className="text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      <CloudBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-white font-black uppercase tracking-tighter text-xl">
                {siteConfig?.logo_line1 || 'Ranbeer'} <span className="text-cyan-400">{siteConfig?.logo_line2 || 'Raja'}</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-2 ${location.pathname === link.path ? 'text-white' : 'text-slate-500'}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAdmin && (
                <div className="flex items-center space-x-4 border-l border-white/10 pl-8">
                  <Link to="/admin" className="p-2 bg-slate-900 border border-white/10 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors" title="Admin Control">
                    <LayoutDashboard size={18} />
                  </Link>
                  <button onClick={handleLogout} className="p-2 bg-slate-900 border border-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-4 md:hidden"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-4 p-4 bg-slate-900 border border-white/5 rounded-2xl text-white font-bold"
                >
                  {link.icon}
                  <span className="uppercase tracking-widest text-sm">{link.name}</span>
                </Link>
              ))}
              {isAdmin && (
                <>
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-4 p-4 bg-slate-900 border border-white/5 rounded-2xl text-cyan-400 font-bold"
                  >
                    <LayoutDashboard size={18} />
                    <span className="uppercase tracking-widest text-sm">Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 bg-slate-900 border border-white/5 rounded-2xl text-red-400 font-bold"
                  >
                    <LogOut size={18} />
                    <span className="uppercase tracking-widest text-sm">Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home projects={projects} config={siteConfig} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetail projects={projects} />} />
          <Route path="/chat" element={<ChatAssistant projects={projects} blogs={blogs} />} />
          <Route path="/resume" element={<Resume experience={experience} config={siteConfig} />} />
          <Route path="/certificates" element={<Certificates certificates={certificates} />} />
          <Route path="/login" element={<Login onLoginSuccess={loadAppData} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminGuard><AdminDashboard projects={projects} /></AdminGuard>} />
          <Route path="/admin/projects" element={<AdminGuard><AdminProjects projects={projects} onUpdate={setProjects} /></AdminGuard>} />
          <Route path="/admin/resume" element={<AdminGuard><AdminResume experience={experience} onUpdate={setExperience} /></AdminGuard>} />
          <Route path="/admin/certificates" element={<AdminGuard><AdminCertificates certificates={certificates} onUpdate={setCertificates} /></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminSettings config={siteConfig} onUpdate={setSiteConfig} /></AdminGuard>} />
          <Route path="/admin/ai-inspector" element={<AdminGuard><AiInspector projects={projects} /></AdminGuard>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="py-12 border-t border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
            &copy; {new Date().getFullYear()} {siteConfig?.logo_line1 || 'Ranbeer'} {siteConfig?.logo_line2 || 'Raja'}. Engineered for Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;