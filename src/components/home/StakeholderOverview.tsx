import React from 'react';
import { Users, UserCheck } from 'lucide-react';

interface StakeholderProps {
  risks: any[];
  lang?: 'en' | 'ar';
}

export const StakeholderOverview: React.FC<StakeholderProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const owners = Array.from(new Set(risks.map(r => r.owner).filter(Boolean)));
  const criticalOwners = risks.filter(r => r.level === 'Critical').map(r => r.owner).filter(Boolean);

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-blue-500" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
          {isAr ? 'المساءلة' : 'Accountability'}
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            {isAr ? 'مسؤولو المخاطر النشطين' : 'Active Risk Owners'}
          </span>
          <span className="text-sm font-bold text-slate-200">{owners.length}</span>
        </div>

        <div className="space-y-2">
           <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1">
             {isAr ? 'خريطة المسؤوليات الرئيسية' : 'Key Responsibility Map'}
           </span>
           <div className="flex flex-wrap gap-1">
             {owners.slice(0, 4).map((owner: any, i) => (
               <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                 <UserCheck size={10} className="text-blue-400" />
                 <span className="text-[9px] font-medium text-blue-300">{owner}</span>
               </div>
             ))}
             {owners.length > 4 && <span className="text-[9px] text-slate-600 self-center">+{owners.length - 4} {isAr ? 'آخرين' : 'more'}</span>}
           </div>
        </div>

        <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
           <div className="flex justify-between items-center">
             <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
               {isAr ? 'مسؤولون عالي التأثير' : 'High-Impact Owners'}
             </span>
             <span className="text-xs font-bold text-slate-200">{criticalOwners.length}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
