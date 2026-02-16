import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, MessageSquare, Download, Activity, Shield, BrainCircuit, 
  ExternalLink, Briefcase, Database, RefreshCw, FileText, Award, Settings 
} from 'lucide-react';
import { Project, AnalyticsEvent, AuditLog } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface DashboardProps {
  projects: Project[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [a, l] = await Promise.all([
        storageService.getAnalytics(),
        storageService.getAuditLogs()
      ]);
      setAnalytics(a);
      setLogs(l);
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
    if (window.confirm("Initialize Cloud DB with baseline data?")) {
      setIsSeeding(true);
      await storageService.seedDatabase();
      setIsSeeding(false);
      window.location.reload();
    }
  };

  const menuItems = [
    { label: 'Registry', path: '/admin/projects', icon: <Briefcase size={18} />, desc: 'Manage hardware & software projects.' },
    { label: 'Resume', path: '/admin/resume', icon: <FileText size={18} />, desc: 'Edit professional work history.' },
    { label: 'Credentials', path: '/admin/certificates', icon: <Award size={18} />, desc: 'Manage verified certifications.' },
    { label: 'Site Config', path: '/admin/settings', icon: <Settings size={18} />, desc: 'Global branding & contact overrides.' },
  ];

  const stats = [
    { label: 'Total Events', value: analytics.length, icon: <Activity className="text-cyan-400" /> },
    { label: 'AI Queries', value: analytics.filter(e => e.eventType === 'AI_QUERY').length, icon: <BrainCircuit className="text-purple-400" /> },
    { label: 'CV Downloads', value: analytics.filter(e => e.eventType === 'RESUME_DOWNLOAD').length, icon: <Download className="text-green-400" /> },
    { label: 'System Logs', value: logs.length, icon: <Shield className="text-red-400" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Mission Control</h1>
          <p className="text-slate-500 text-sm font-mono mt-1 uppercase tracking-widest">Admin Node: Live Telemetry</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-6 py-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center space-x-2"
          >
            <Database size={14} />
            <span>{isSeeding ? 'Syncing...' : 'Seed Cloud Data'}</span>
          </button>
          <Link to="/admin/ai-inspector" className="px-6 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all flex items-center space-x-2">
            <BrainCircuit size={14} />
            <span>AI Knowledge</span>
          </Link>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {menuItems.map((item, i) => (
          <Link key={i} to={item.path} className="group p-8 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all backdrop-blur-sm">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{item.label}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-slate-900 border border-white/5 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
            <h3 className="text-white font-black mb-8 flex items-center uppercase tracking-widest text-sm">
              <Shield className="text-cyan-400 mr-3" size={20} />
              Recent System Audit
            </h3>
            <div className="space-y-4">
              {logs.length > 0 ? logs.slice(0, 8).map(log => (
                <div key={log.id} className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-slate-900 transition-colors">
                  <div>
                    <span className="text-[9px] font-black text-cyan-500 uppercase block mb-1 tracking-widest">{log.action}</span>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{log.details}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-slate-600 uppercase mb-1">{log.actor}</div>
                    <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-600 text-sm italic font-mono uppercase tracking-widest">Awaiting system events...</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-sm h-full">
            <h3 className="text-white font-black mb-8 flex items-center uppercase tracking-widest text-sm">
              <Activity className="text-purple-400 mr-3" size={20} />
              Live Telemetry
            </h3>
            <div className="space-y-4">
              {analytics.length > 0 ? analytics.slice(0, 12).map(e => (
                <div key={e.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:translate-x-1 transition-transform">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{e.eventType}</span>
                  <span className="text-[10px] text-slate-600 font-mono">{new Date(e.createdAt).toLocaleTimeString()}</span>
                </div>
              )) : (
                <div className="text-center py-20 text-slate-600 text-sm italic font-mono uppercase tracking-widest">Scanning traffic...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;