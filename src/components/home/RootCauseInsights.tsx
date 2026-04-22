import React from 'react';
import { Network } from 'lucide-react';

interface RCAProps {
  risks: any[];
  lang?: string;
}

export const RootCauseInsights: React.FC<RCAProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const categories = isAr 
    ? [
        { en: 'People', ar: 'الأشخاص' },
        { en: 'Process', ar: 'العمليات' },
        { en: 'Technology', ar: 'التقنية' },
        { en: 'Environment', ar: 'البيئة' },
        { en: 'Management', ar: 'الإدارة' }
      ]
    : [
        { en: 'People', ar: 'People' },
        { en: 'Process', ar: 'Process' },
        { en: 'Technology', ar: 'Technology' },
        { en: 'Environment', ar: 'Environment' },
        { en: 'Management', ar: 'Management' }
      ];

  const distribution = categories.map(cat => ({
    name: isAr ? cat.ar : cat.en,
    count: risks.filter(r => r.rca?.[cat.en.toLowerCase()] && r.rca[cat.en.toLowerCase()].trim() !== '').length
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-6">
        <Network className="text-purple-500" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
          {isAr ? 'الأسباب الجذرية النظامية' : 'Systemic Root Causes'}
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        {distribution.map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight">
              <span className="text-slate-400">{item.name}</span>
              <span className="text-slate-500">
                {item.count} {isAr ? 'تكرارات' : 'Occurrences'}
              </span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-purple-500/50 transition-all duration-1000" 
                 style={{ width: `${risks.length > 0 ? (item.count / risks.length) * 100 : 0}%` }} 
               />
            </div>
          </div>
        ))}
        {distribution.length === 0 && (
          <div className="text-[10px] text-slate-600 italic">
            {isAr ? 'لا يوجد بيانات متاحة' : 'No data available'}
          </div>
        )}
      </div>
    </div>
  );
};
