
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Github, Linkedin, Mail, Instagram,
  Briefcase, Sparkles, Settings, FileText, Award, LogOut, Loader2, ShieldAlert
} from 'lucide-react';

// Components
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ChatAssistant from './pages/ChatAssistant';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AiInspector from './pages/admin/AiInspector';
import BlogList from './pages/BlogList';
import Resume from './pages/Resume';
import Certificates from './pages/Certificates';
import CloudBackground from './components/ui/CloudBackground';

// Services
import { Project, Blog } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';

/**
 * AdminGuard Component
 * Strictly enforces production authentication via Auth0.
 */
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'loading' | 'unauthorized' | 'authorized'>('loading');

  useEffect(() => {
    const checkAccess = async () => {
      const isConfigured = authService.isConfigured();
      if (!isConfigured) {
        setStatus('unauthorized');
        return;
      }
      
      const authenticated = await authService.isAuthenticated();
      if (!authenticated) {
        await authService.login();
        return;
      }
      
      const admin = await authService.isAdmin();
      setStatus(admin ? 'authorized' : 'unauthorized');
    };
    checkAccess();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 size={40} className="animate-spin text-cyan-500 mb-4" />
        <p className="text-slate-500 font-mono text-sm tracking-widest uppercase text-center">Authenticating Secure Session...</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center">
        <div className="p-6 bg-red-500/10 rounded-full mb-8">
          <ShieldAlert size={64} className="text-red-500" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Access Denied</h2>
        <p className="text-slate-400 max-w-md mb-12">
          Your credentials do not possess the required <b>administrative</b> clearance for this node.
        </p>
        <Link to="/" className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all">
          Exit Terminal
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await authService.init();
        const authenticated = await authService.isAuthenticated();
        if (authenticated) {
          const userData = await authService.getUser();
          const adminStatus = await authService.isAdmin();
          setUser(userData);
          setIsAdmin(adminStatus);
        }
        
        const p = await storageService.getProjects();
        const b = await storageService.getBlogs();
        setProjects(p);
        setBlogs(b);
      } catch (err) {
        console.error("App synchronization failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppData();
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };

  const navLinks = [
    { name: 'Projects', path: '/projects', icon: <Briefcase size={18} /> },
    { name: 'Resume', path: '/resume', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
    { name: 'AI Assistant', path: '/chat', icon: <Sparkles size={18} /> },
  ];

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
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              
              {!isLoading && (
                <>
                  {isAdmin ? (
                    <div className="flex items-center space-x-2">
                      <Link 
                        to="/admin" 
                        className={`p-2 transition-colors ${location.pathname.startsWith('/admin') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`} 
                        title="Admin Console"
                      >
                        <Settings size={20} />
                      </Link>
                      <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                      </button>
                    </div>
                  ) : user ? (
                    <button onClick={handleLogout} className="text-xs font-black uppercase text-slate-500 hover:text-white transition-colors">
                      Logout
                    </button>
                  ) : (
                    <button onClick={() => authService.login()} className="p-2 text-slate-500 hover:text-cyan-400 transition-colors" title="Admin Login">
                      <Settings size={20} />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white transition-colors">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 text-sm font-medium ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-400'}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/5">
                   <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 text-sm text-slate-400">
                    <Settings size={18} />
                    <span>Admin System</span>
                   </Link>
                </div>
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
          <Route path="/chat" element={<ChatAssistant projects={projects} blogs={blogs} />} />
          
          <Route path="/admin/*" element={
            <AdminGuard>
              <Routes>
                <Route index element={<AdminDashboard projects={projects} />} />
                <Route path="projects" element={<AdminProjects projects={projects} onUpdate={setProjects} />} />
                <Route path="ai-inspector" element={<AiInspector projects={projects} />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminGuard>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Ranbeer Raja | Production Environment
        </div>
      </footer>
    </div>
  );
};

export default App;
