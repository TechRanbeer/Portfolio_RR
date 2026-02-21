import React from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export type Mode = 'ai' | 'human';

interface CareerStatsProps {
  mode: Mode;
}

export const CareerStats: React.FC<CareerStatsProps> = ({ mode }) => {
  const radarData = [
    { subject: 'Design', A: 95, fullMark: 100 },
    { subject: 'Analysis', A: 85, fullMark: 100 },
    { subject: 'Coding', A: 82, fullMark: 100 },
    { subject: 'Systems', A: 86, fullMark: 100 },
    { subject: 'Innovation', A: 90, fullMark: 100 },
  ];

  const metrics = [
    { label: 'ENGINEERING HOURS', value: '14,500+' },
    { label: 'FEA RUNS', value: '100+' },
    { label: 'MAJOR PROJECTS', value: '12+' },
    { label: 'ML HOURS', value: '60+' },
    { label: 'CODE COMMITS', value: '300+' },
    { label: 'GEAR RATIO ITERATIONS', value: '20+' }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase">CAREER_METRICS // AGGREGATED</div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">PERFORMANCE DASHBOARD</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="p-6 border border-white/5 bg-slate-900/20 backdrop-blur-sm rounded-2xl">
                <div className="text-3xl font-black text-white tracking-tighter">{m.value}</div>
                <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[450px] w-full border border-white/5 bg-slate-900/20 backdrop-blur-sm rounded-[2.5rem] p-8 relative overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
