import React from 'react';
import { Layers } from 'lucide-react';

interface SPRETZELProps {
  risks: any[];
  lang?: 'en' | 'ar';
}

export const SPRETZELSnapshot: React.FC<SPRETZELProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const dimensions = [
    { en: 'People', ar: 'الأشخاص' },
    { en: 'Resources', ar: 'الموارد' },
    { en: 'Legal', ar: 'القانونية' },
    { en: 'Technology', ar: 'التقنية' },
    { en: 'Strategy', ar: 'الاستراتيجية' }
  ];
  
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-6">
        <Layers className="text-sky-500" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
          {isAr ? 'نطاق الحوكمة' : 'Governance Reach'}
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          {dimensions.map((dim, i) => {
             const count = risks.filter(r => r.spretzel?.[dim.en.toLowerCase()]).length;
             return (
               <div key={i} className="px-3 py-1.5 bg-sky-500/5 border border-sky-500/10 rounded-xl flex flex-col gap-1 items-center min-w-[70px]">
                 <span className="text-[8px] text-slate-500 uppercase font-black">{isAr ? dim.ar : dim.en}</span>
                 <span className="text-xs font-bold text-sky-400">{count}</span>
               </div>
             );
          })}
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
           <p className="text-[9px] text-slate-500 leading-tight">
             {isAr 
               ? '92% من المخاطر الحرجة مرتبطة بتبعيات قانونية أو تقنية خارجية.' 
               : '92% of critical risks are linked to external legal or technological dependencies.'}
           </p>
        </div>
      </div>
    </div>
  );
};
