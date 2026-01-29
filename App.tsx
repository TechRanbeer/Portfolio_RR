
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Github, Linkedin, Mail, Instagram,
  Briefcase, Sparkles, Settings, FileText, Award, LogOut, Loader2
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
import { Project, Blog, Certificate } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]); // Initialize blogs state
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      // Safety timeout
      const timeout = setTimeout(() => {
        setIsAuthLoading(false);
      }, 5000);

      try {
        const client = await authService.init();
        if (client) {
          const authenticated = await authService.isAuthenticated();
          if (authenticated) {
            const userData = await authService.getUser();
            setUser(userData);
          }
        }
      } catch (err) {
        console.error("Auth initialization failed", err);
      } finally {
        clearTimeout(timeout);
        setIsAuthLoading(false);
      }
    };

    initAuth();

    // Initial Data Load
    const loadData = async () => {
      try {
        const p = await storageService.getProjects();
        setProjects(p);
        // Fix: Fetch blogs from storageService and update state to provide context for the AI Assistant
        const b = await storageService.getBlogs();
        setBlogs(b);
      } catch (err) {
        console.error("Data load failed", err);
      }
    };
    loadData();
    
    // Analytics tracking
    storageService.trackEvent('PAGE_VIEW', { path: location.pathname });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Projects', path: '/projects', icon: <Briefcase size={18} /> },
    { name: 'Resume', path: '/resume', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
    { name: 'AI Assistant', path: '/chat', icon: <Sparkles size={18} /> },
  ];

  const handleLogin = async () => {
    try {
      setIsAuthLoading(true);
      await authService.login();
    } catch (err) {
      console.error("Login failed", err);
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
              
              {/* Gear (Settings) / Auth Controls */}
              {isAuthLoading ? (
                <div className="p-2">
                  <Loader2 size={20} className="animate-spin text-cyan-400" />
                </div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/admin" 
                    className={`p-2 transition-colors ${location.pathname.startsWith('/admin') ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`} 
                    title="Admin Dashboard"
                  >
                    <Settings size={20} />
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors" 
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin} 
                  className="p-2 text-slate-500 hover:text-cyan-400 transition-colors" 
                  title="Admin Login"
                >
                  <Settings size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home projects={projects} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetail projects={projects} />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/chat" element={<ChatAssistant projects={projects} blogs={blogs} />} />
          
          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={
            isAuthLoading ? (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 size={40} className="animate-spin text-cyan-500 mb-4" />
                <p className="text-slate-500 font-mono text-sm">Validating Session...</p>
              </div>
            ) : user ? (
              <Routes>
                <Route index element={<AdminDashboard projects={projects} />} />
                <Route path="projects" element={<AdminProjects projects={projects} onUpdate={setProjects} />} />
                <Route path="ai-inspector" element={<AiInspector projects={projects} />} />
              </Routes>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
                <div className="p-4 bg-red-500/10 rounded-full mb-6">
                  <Settings size={48} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Denied</h2>
                <p className="text-slate-400 max-w-md mb-8">This module is locked. Administrative credentials are required to modify the system registry.</p>
                <button 
                  onClick={handleLogin} 
                  className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-500/20"
                >
                  Authenticate Admin
                </button>
              </div>
            )
          } />
        </Routes>
      </main>

      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Ranbeer Raja | KJ Somaiya College
        </div>
      </footer>
    </div>
  );
};

export default App;
