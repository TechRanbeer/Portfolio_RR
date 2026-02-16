import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, BrainCircuit, Download, Briefcase, FileText, Award, Settings, Database, LayoutDashboard } from 'lucide-react';
import { Project, AnalyticsEvent, AuditLog } from '../../types';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';

interface DashboardProps {
  projects: Project[];
}

const AdminDashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [a, l] = await Promise.all([storageService.getAnalytics(), storageService.getAuditLogs()]);
      setAnalytics(a);
      setLogs(l);
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
    if (window.confirm("Initialize Cloud Database with codebase constants?")) {
      setSeeding(true);
      await storageService.seedDatabase();
      setSeeding(false);
      window.location.reload();
    }
  };

  const stats = [
    { label: 'Total Events', value: analytics.length, icon: <Activity className="text-cyan-400" /> },
    { label: 'AI Sessions', value: analytics.filter(e => e.eventType === 'AI_QUERY').length, icon: <BrainCircuit className="text-purple-400" /> },
    { label: 'CV Prints', value: analytics.filter(e => e.eventType === 'RESUME_DOWNLOAD').length, icon: <Download className="text-green-400" /> },
    { label: 'Audit Points', value: logs.length, icon: <Shield className="text-red-400" /> },
  ];

  const menu = [
    { label: 'Registry', path: '/admin/projects', icon: <Briefcase />, desc: 'Deploy & Modify Projects' },
    { label: 'Resume', path: '/admin/resume', icon: <FileText />, desc: 'Engineer Work History' },
    { label: 'Credentials', path: '/admin/certificates', icon: <Award />, desc: 'Verified Achievements' },
    { label: 'Core Config', path: '/admin/settings', icon: <Settings />, desc: 'Identity Overrides' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Mission Control</h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-1">Status: Operational</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSeed} disabled={seeding} className="px-6 py-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2">
            <Database size={14} /> {seeding ? 'Syncing...' : 'Seed Cloud DB'}
          </button>
          <Link to="/admin/ai-inspector" className="px-6 py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 flex items-center gap-2">
            <BrainCircuit size={14} /> AI Context
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {menu.map((item, i) => (
          <Link key={i} to={item.path} className="group p-8 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all backdrop-blur-sm">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{item.label}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-8 bg-slate-900 border border-white/5 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem]">
        <h3 className="text-white font-black mb-8 flex items-center uppercase tracking-widest text-sm"><Shield className="text-cyan-400 mr-3" size={20} /> System Audit Logs</h3>
        <div className="space-y-4">
          {logs.slice(0, 10).map(log => (
            <div key={log.id} className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex justify-between items-center group">
              <div>
                <span className="text-[9px] font-black text-cyan-500 uppercase block mb-1 tracking-widest">{log.action}</span>
                <p className="text-sm text-slate-300">{log.details}</p>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono text-slate-600 uppercase mb-1">{log.actor}</div>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;