import React from 'react';

interface HeatmapProps {
  risks: any[];
  lang?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ risks, lang = 'en' }) => {
  const getRiskLevel = (score: number) => {
    if (score >= 20) return "Critical";
    if (score >= 12) return "High";
    if (score >= 5) return "Medium";
    return "Low";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-500/20 border-red-500 text-red-400";
      case "High": return "bg-orange-500/20 border-orange-500 text-orange-400";
      case "Medium": return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
      default: return "bg-emerald-500/20 border-emerald-500 text-emerald-400";
    }
  };

  const grid = [5, 4, 3, 2, 1].map(l => (
    [1, 2, 3, 4, 5].map(i => {
      const score = l * i;
      const cellRisks = risks.filter(r => r.likelihood === l && r.impact === i);
      const level = getRiskLevel(score);
      return { l, i, score, risks: cellRisks, color: getLevelColor(level) };
    })
  ));

  const isAr = lang === 'ar';

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {isAr ? 'مصفوفة المخاطر المتقدمة' : 'Enhanced Risk Matrix Heatmap'}
          </span>
        </div>
        <div className="flex gap-2 text-[8px] uppercase font-bold">
          <span className="text-red-400">{isAr ? 'حسب الأهمية' : 'Critical'}</span>
          <span className="text-orange-400">{isAr ? 'عالي' : 'High'}</span>
          <span className="text-yellow-400">{isAr ? 'متوسط' : 'Med'}</span>
          <span className="text-emerald-400">{isAr ? 'منخفض' : 'Low'}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-1 relative border-l border-b border-slate-700">
        <div className={`absolute ${isAr ? '-right-12' : '-left-12'} top-1/2 -rotate-90 text-[8px] text-slate-500 font-bold uppercase tracking-widest`}>
          {isAr ? 'الاحتمالية' : 'Likelihood'}
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 font-bold uppercase tracking-widest">
          {isAr ? 'الأثر' : 'Impact'}
        </div>

        {grid.flat().map((cell, idx) => (
          <div key={idx} className={`relative flex flex-wrap gap-0.5 p-1 border border-slate-800/10 transition-all hover:bg-white/5 ${cell.color}`}>
            {cell.risks.map((r, ri) => {
              const globalIndex = risks.findIndex(gr => gr.id === r.id);
              return (
                <div 
                  key={ri} 
                  className="w-4 h-4 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center text-[7px] text-white font-black shadow-lg hover:scale-125 transition-transform z-10"
                  title={`${r.id}: ${r.riskStatement}`}
                >
                  {globalIndex !== -1 ? globalIndex + 1 : ri + 1}
                </div>
              );
            })}
            {cell.risks.length === 0 && <span className="absolute inset-0 m-auto flex items-center justify-center text-[10px] opacity-10 font-bold">{cell.score}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
