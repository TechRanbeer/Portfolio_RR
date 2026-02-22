
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, BrainCircuit, Download, Briefcase, FileText, Award, Settings, Database, ArrowRight } from 'lucide-react';
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
    { label: 'Event Total', value: analytics.length, icon: <Activity className="text-slate-500" /> },
    { label: 'AI Inference', value: analytics.filter(e => e.eventType === 'AI_QUERY').length, icon: <BrainCircuit className="text-slate-500" /> },
    { label: 'CV Extraction', value: analytics.filter(e => e.eventType === 'RESUME_DOWNLOAD').length, icon: <Download className="text-slate-500" /> },
    { label: 'Integrity Logs', value: logs.length, icon: <Shield className="text-slate-500" /> },
  ];

  const menu = [
    { label: 'System Registry', path: '/admin/projects', icon: <Briefcase />, desc: 'Configure deployments' },
    { label: 'Experience Manager', path: '/admin/resume', icon: <FileText />, desc: 'Modify work records' },
    { label: 'Verified Credentials', path: '/admin/certificates', icon: <Award />, desc: 'Awards & certs' },
    { label: 'Core Parameters', path: '/admin/settings', icon: <Settings />, desc: 'Identity overrides' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Command Center</h1>
          <div className="flex items-center space-x-3 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Systems Functional</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleSeed} disabled={seeding} className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-premium flex items-center gap-3">
            <Database size={14} /> {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
          <Link to="/admin/ai-inspector" className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-premium flex items-center gap-3">
            <BrainCircuit size={14} /> Knowledge Graph
          </Link>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden mb-20">
        {menu.map((item, i) => (
          <Link key={i} to={item.path} className="group p-12 bg-slate-950 hover:bg-slate-900 transition-premium">
            <div className="w-10 h-10 bg-slate-900 text-slate-600 rounded-lg flex items-center justify-center mb-8 group-hover:text-cyan-400 group-hover:bg-slate-800 transition-premium">
              {item.icon}
            </div>
            <h3 className="text-white font-bold uppercase tracking-tight mb-2 flex items-center group-hover:text-cyan-400">
              {item.label} <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-premium" />
            </h3>
            <p className="text-slate-600 text-[11px] font-medium uppercase tracking-widest">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((s, i) => (
          <div key={i} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Logs Table-Like UI */}
      <div className="space-y-8">
        <h3 className="text-white font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
          <Shield className="text-slate-600" size={16} /> Integrity Manifest
        </h3>
        <div className="bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {logs.slice(0, 8).map(log => (
              <div key={log.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.02] transition-premium">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">{log.action}</span>
                  <p className="text-sm text-slate-400 font-medium">{log.details}</p>
                </div>
                <div className="flex items-center space-x-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-600 font-mono block">{log.actor}</span>
                    <span className="text-[9px] text-slate-700 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
