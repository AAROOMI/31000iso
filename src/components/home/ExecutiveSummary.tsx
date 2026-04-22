import React from 'react';
import { TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';

interface ExecutiveSummaryProps {
  risks: any[];
  lang?: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const total = risks.length;
  const critical = risks.filter(r => r.level === 'Critical').length;
  const high = risks.filter(r => r.level === 'High').length;
  const medium = risks.filter(r => r.level === 'Medium').length;
  const avgScore = total > 0 ? Math.round(risks.reduce((acc, r) => acc + (r.score || 0), 0) / total) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden group" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            {isAr ? 'ملخص تنفيذي' : 'Executive Summary'}
          </h3>
          <p className="text-2xl font-light text-white">
            {isAr ? 'التعرض للمخاطر' : 'Risk Exposure'}
          </p>
        </div>
        <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
          <ShieldCheck className="text-sky-400" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/30 rounded-2xl border border-white/5">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2">
            {isAr ? 'متوسط الدرجات' : 'Total Score'}
          </span>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white font-mono">{avgScore}</span>
            <div className={`flex items-center text-red-400 text-[10px] mb-1 ${isAr ? 'flex-row-reverse' : ''}`}>
              <TrendingUp size={12} />
              <span>+4%</span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 bg-slate-800/30 rounded-2xl border border-white/5 ${isAr ? 'text-left' : 'text-right'}`}>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2">
            {isAr ? 'إجمالي المخاطر' : 'Total Risks'}
          </span>
          <span className="text-3xl font-bold text-white font-mono">{total}</span>
        </div>
      </div>

      <div className={`mt-6 flex items-center justify-between gap-1 overflow-hidden ${isAr ? 'flex-row-reverse' : ''}`}>
        <div className="h-1.5 bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${total ? (critical/total)*100 : 0}%` }} title="Critical" />
        <div className="h-1.5 bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${total ? (high/total)*100 : 0}%` }} title="High" />
        <div className="h-1.5 bg-yellow-500 rounded-full transition-all duration-1000" style={{ width: `${total ? (medium/total)*100 : 0}%` }} title="Medium" />
        <div className="h-1.5 bg-slate-700 rounded-full flex-1" title="Low" />
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
        <div className="flex items-center gap-1.5 text-red-500">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {critical} {isAr ? 'حسب الأهمية' : 'Critical'}
        </div>
        <div className="flex items-center gap-1.5 text-orange-500">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          {high} {isAr ? 'عالية' : 'High'}
        </div>
        <div className="text-slate-500">
          {total - (critical + high)} {isAr ? 'مخاطر منخفضة' : 'Lower Severity'}
        </div>
      </div>
    </div>
  );
};
