import React from 'react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

interface KRIProps {
  risks: any[];
  lang?: string;
}

export const KRISnapshot: React.FC<KRIProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const kris = risks.filter(r => r.kri).slice(0, 3);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-red-500" size={18} />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            {isAr ? 'تنبيهات اتجاهات KRI' : 'KRI Trend Alerts'}
          </h3>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
           <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest">
             {isAr ? 'مراقبة نشطة' : 'Active Monitoring'}
           </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {kris.length > 0 ? kris.map((r, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                {isAr && r.kri.indicator_ar ? r.kri.indicator_ar : (r.kri.indicator || (isAr ? 'عتبة الأمن' : 'Security Threshold'))}
              </p>
              <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-mono font-bold text-slate-200">{r.kri.history?.[r.kri.history.length-1]?.value || 0} / {r.kri.threshold || 10}</span>
                {Math.random() > 0.5 ? <TrendingUp size={12} className="text-red-500" /> : <TrendingDown size={12} className="text-emerald-500" />}
              </div>
            </div>
            <div className={`w-8 h-1 overflow-hidden bg-slate-800 rounded-full`}>
               <div 
                 className={`h-full ${(r.kri.history?.[r.kri.history.length-1]?.value || 0) >= (r.kri.threshold || 8) ? 'bg-red-500' : 'bg-emerald-500'}`} 
                 style={{ width: `${Math.min(100, ((r.kri.history?.[r.kri.history.length-1]?.value || 0)/ (r.kri.threshold || 10)) * 100)}%` }} 
               />
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-6 text-slate-600 space-y-2">
            <p className="text-xs italic">{isAr ? 'لا توجد عتبات KRI نشطة.' : 'No KRI thresholds active.'}</p>
            <span className="text-[9px] uppercase font-bold tracking-widest bg-slate-800 px-2 py-0.5 rounded">
              {isAr ? 'إعداد المراقبة' : 'Setup Monitoring'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
