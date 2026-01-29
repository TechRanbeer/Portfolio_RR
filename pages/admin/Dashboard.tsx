
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, MessageSquare, Download, Activity, Shield, BrainCircuit, ExternalLink, Briefcase, Database, RefreshCw } from 'lucide-react';
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
      const a = await storageService.getAnalytics();
      const l = await storageService.getAuditLogs();
      setAnalytics(a);
      setLogs(l);
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
    if (window.confirm("This will push all INITIAL_PROJECTS from code to your Supabase cloud. Proceed?")) {
      setIsSeeding(true);
      await storageService.seedDatabase();
      setIsSeeding(false);
      window.location.reload();
    }
  };

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
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Core Dashboard</h1>
          <p className="text-slate-500 text-sm font-mono mt-1">Admin Session: Secure Supabase Connection</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center space-x-2"
          >
            <Database size={14} />
            <span>{isSeeding ? 'Seeding...' : 'Seed Cloud DB'}</span>
          </button>
          <Link to="/admin/projects" className="px-4 py-2 bg-slate-900 border border-white/5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 flex items-center space-x-2">
            <Briefcase size={14} /> <span>Registry</span>
          </Link>
          <Link to="/admin/ai-inspector" className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-xs font-bold uppercase tracking-widest text-cyan-400 hover:bg-cyan-600/30 flex items-center space-x-2">
            <BrainCircuit size={14} /> <span>AI Inspector</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-white relative z-10">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-sm">
            <h3 className="text-white font-bold mb-6 flex items-center">
              <Shield className="text-cyan-400 mr-2" size={20} />
              Recent Audit Logs
            </h3>
            <div className="space-y-4">
              {logs.length > 0 ? logs.slice(0, 6).map(log => (
                <div key={log.id} className="p-4 bg-slate-950/50 rounded-xl border border-white/5 flex justify-between items-center group">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-500 uppercase block mb-1">{log.action}</span>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{log.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-600 text-sm italic">No system events recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-sm h-full">
            <h3 className="text-white font-bold mb-6 flex items-center">
              <Activity className="text-purple-400 mr-2" size={20} />
              Live Traffic
            </h3>
            <div className="space-y-3">
              {analytics.length > 0 ? analytics.slice(0, 10).map(e => (
                <div key={e.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-400 font-medium">{e.eventType}</span>
                  <span className="text-[10px] text-slate-600 font-mono">{new Date(e.createdAt).toLocaleTimeString()}</span>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-600 text-sm italic">Waiting for traffic telemetry...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
