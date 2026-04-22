import React from 'react';

interface SWOTProps {
  data?: {
    strengths?: string;
    weaknesses?: string;
    opportunities?: string;
    threats?: string;
  };
  lang?: string;
}

export const SWOTGrid: React.FC<SWOTProps> = ({ data = {}, lang = 'en' }) => {
  const isAr = lang === 'ar';
  
  const swot = [
    { label: isAr ? 'نقاط القوة' : 'Strengths', value: data.strengths, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    { label: isAr ? 'نقاط الضعف' : 'Weaknesses', value: data.weaknesses, color: 'bg-red-500/10 border-red-500/30 text-red-400' },
    { label: isAr ? 'الفرص' : 'Opportunities', value: data.opportunities, color: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
    { label: isAr ? 'التهديدات' : 'Threats', value: data.threats, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  ];

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-sky-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isAr ? 'مصفوفة SWOT الاستراتيجية' : 'SWOT Strategic Matrix'}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
        {swot.map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col transition-all cursor-default ${item.color}`}>
            <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-60">
              {item.label}
            </span>
            <div className="flex-1 text-[10px] italic leading-tight overflow-y-auto no-scrollbar">
              {item.value || (isAr ? 'لم يتم التحديد' : 'Not identified')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
