
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, MessageSquare, Download, ArrowUp, ArrowDown, ExternalLink, Briefcase, FileText, Settings, Lock, Key } from 'lucide-react';
import { Project } from '../../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  projects: Project[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simplified secure gateway - in production, use Supabase/Netlify Identity
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ranbeer-rr-2024') { // Secret key
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Unauthorized access detected.');
    }
  };

  const stats = [
    { label: 'Total Views', value: localStorage.getItem('rr_total_views') || '1,240', change: '+12%', positive: true, icon: <Users size={20} /> },
    { label: 'AI Queries', value: '458', change: '+25%', positive: true, icon: <MessageSquare size={20} /> },
    { label: 'Resume Downloads', value: '89', change: '-2%', positive: false, icon: <Download size={20} /> },
    { label: 'Project Clicks', value: '2,840', change: '+8%', positive: true, icon: <Briefcase size={20} /> },
  ];

  const recentMessages = [
    { id: 1, user: 'CTO @ ScaleForce', subject: 'System Design Consultation', date: '2h ago' },
    { id: 2, user: 'Sarah Miller', subject: 'Inquiry regarding Distributed Engine', date: '5h ago' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-slate-800 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Restricted Area</h1>
          <p className="text-slate-500 mb-8">This portal is for authorized eyes only. Please verify your credentials.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="System Key"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
            <button type="submit" className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors">
              Access Core
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white">Console Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, Ranbeer Raja.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/admin/projects" className="px-4 py-2 bg-cyan-600 text-white text-sm font-bold rounded-lg hover:bg-cyan-500 transition-colors">
            Projects Registry
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.positive ? <ArrowUp size={12} className="ml-0.5" /> : <ArrowDown size={12} className="ml-0.5" />}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-bold flex items-center">
                <BarChart3 className="text-cyan-400 mr-2" size={18} />
                Engagement Stats
              </h3>
            </div>
            <div className="flex-grow flex items-end justify-between gap-2">
              {[40, 65, 30, 85, 45, 100, 75].map((val, i) => (
                <div key={i} className="flex-grow flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-600/20 to-cyan-400 rounded-t" 
                    style={{ height: `${val}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center">
              <MessageSquare className="text-cyan-400 mr-2" size={18} />
              Recent Contact
            </h3>
            <div className="space-y-6">
              {recentMessages.map(msg => (
                <div key={msg.id} className="group cursor-pointer">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cyan-400 font-bold">{msg.user}</span>
                    <span className="text-slate-500">{msg.date}</span>
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white transition-colors">{msg.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
