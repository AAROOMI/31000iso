import React from 'react';
import { motion } from 'framer-motion';
import { Search, ClipboardCheck, Activity, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface RiskLifecycleProps {
  lang?: 'en' | 'ar';
}

export const RiskLifecycle: React.FC<RiskLifecycleProps> = ({ lang = 'en' }) => {
  const isAr = lang === 'ar';
  
  const stages = [
    { label: isAr ? 'تحديد' : 'Identify', icon: <Search size={14} />, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: isAr ? 'تقييم' : 'Assess', icon: <ClipboardCheck size={14} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: isAr ? 'تحليل' : 'Analyze', icon: <Activity size={14} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: isAr ? 'معالجة' : 'Mitigate', icon: <ShieldCheck size={14} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: isAr ? 'مراقبة' : 'Monitor', icon: <Zap size={14} />, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: isAr ? 'مراجعة' : 'Review', icon: <RefreshCw size={14} />, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ];

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex flex-col items-center" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-10 w-full">
        <div className="w-2 h-2 rounded-full bg-sky-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isAr ? 'دورة حياة إدارة المخاطر ISO 31000' : 'ISO 31000 Risk Management Lifecycle'}
        </span>
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        
        {stages.map((stage, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 ${stage.bg} ${stage.color} rounded-full border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm`}
            >
              {stage.icon}
            </motion.div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{stage.label}</span>
            {idx < stages.length - 1 && (
              <div className={`absolute top-1/2 ${isAr ? '-left-full' : '-right-full'} w-full h-0.5 bg-sky-500/20 z-[-1]`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
