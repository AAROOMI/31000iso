import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

interface TopRisksProps {
  risks: any[];
  lang?: string;
  onDrillDown: (idx: number) => void;
  title?: string;
}

export const TopRisksPareto: React.FC<TopRisksProps> = ({ risks, lang = 'en', onDrillDown, title }) => {
  const isAr = lang === 'ar';
  const displayTitle = title || (isAr ? 'أعلى المخاطر الحرجة' : 'Top Critical Risks');
  const topRisks = [...risks]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="text-orange-500" size={18} />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            {displayTitle}
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {isAr ? 'تحليل القلة الحيوية' : 'Vital Few Analysis'}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {topRisks.map((risk, i) => (
          <div 
            key={risk.id}
            onClick={() => onDrillDown(risks.findIndex(r => r.id === risk.id))}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 w-2/3">
              <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-500 text-[10px] font-bold flex items-center justify-center border border-orange-500/20">
                #{i+1}
              </span>
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-200 truncate">
                  {isAr && risk.asset_ar ? risk.asset_ar : risk.asset}
                </p>
                <p className="text-[9px] text-slate-500 truncate">
                  {isAr && risk.riskStatement_ar ? risk.riskStatement_ar : risk.riskStatement}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${risk.score >= 20 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'}`}>
                {risk.score}
              </span>
              <ArrowRight size={14} className={`text-slate-700 group-hover:text-orange-500 transition-colors ${isAr ? 'rotate-180' : ''}`} />
            </div>
          </div>
        ))}

        {topRisks.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">
            {isAr ? 'لم يتم تسجيل أي مخاطر حتى الآن.' : 'No risks recorded yet.'}
          </div>
        )}
      </div>

      <button className="mt-6 w-full py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors border-t border-slate-800 pt-4">
        {isAr ? 'عرض كافة السجلات' : 'View All Records'}
      </button>
    </div>
  );
};
