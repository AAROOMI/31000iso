import React from 'react';
import { motion } from 'framer-motion';

interface IshikawaProps {
  data: {
    people?: string;
    process?: string;
    technology?: string;
    environment?: string;
    management?: string;
    primaryRootCause?: string;
  };
}

export const IshikawaDiagram: React.FC<IshikawaProps> = ({ data }) => {
  // Support both flat and nested structures for AI compatibility, add null checks to prevent crashes
  const ishikawa = (data as any)?.ishikawa || data || { people: '', process: '', technology: '', environment: '', management: '' };
  
  const categories = [
    { label: 'People', value: ishikawa.people, x: '20%', y: '10%', align: 'start' },
    { label: 'Process', value: ishikawa.process, x: '50%', y: '10%', align: 'start' },
    { label: 'Technology', value: ishikawa.technology, x: '80%', y: '10%', align: 'start' },
    { label: 'Environment', value: ishikawa.environment, x: '20%', y: '70%', align: 'end' },
    { label: 'Management', value: ishikawa.management, x: '50%', y: '70%', align: 'end' },
  ];

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 relative overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Root Cause Fishbone</span>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1000 400" className="mt-4">
        {/* Main Spine */}
        <line x1="50" y1="200" x2="850" y2="200" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <polygon points="850,185 920,200 850,215" fill="#334155" />
        
        {/* Head Label */}
        <rect x="830" y="160" width="160" height="80" rx="12" fill="#1e293b" stroke="#334155" />
        <text x="910" y="200" textAnchor="middle" dominantBaseline="middle" fill="#f8fafc" className="text-sm font-bold">
          {data.primaryRootCause ? 
            (data.primaryRootCause.length > 15 ? data.primaryRootCause.substring(0, 15) + '...' : data.primaryRootCause) 
            : 'Unidentified Risk'}
        </text>

        {/* Categories and Bones */}
        {categories.map((cat, idx) => {
          const isTop = cat.y === '10%';
          const y1 = isTop ? 50 : 350;
          const y2 = 200;
          const x = parseInt(cat.x) * 10;
          
          return (
            <g key={idx}>
              <line x1={x} y1={y1} x2={x + 100} y2={y2} stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
              <text 
                x={x} 
                y={isTop ? y1 - 10 : y1 + 25} 
                fill={isTop ? "#fbbf24" : "#38bdf8"} 
                className="text-xs font-bold uppercase tracking-tighter"
                textAnchor="middle"
              >
                {cat.label}
              </text>
              <foreignObject x={x - 50} y={isTop ? y1 + 10 : y1 - 40} width="120" height="40">
                <div className="text-[10px] text-slate-400 italic leading-tight text-center px-1">
                  {cat.value || 'None identified'}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
