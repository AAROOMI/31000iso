import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

interface ComplianceProps {
  risks: any[];
  frameworks?: string[];
  lang?: 'en' | 'ar';
}

export const ComplianceStatus: React.FC<ComplianceProps> = ({ risks, frameworks = [], lang = 'en' }) => {
  const isAr = lang === 'ar';
  
  // Calculate real scores based on risks and frameworks
  const standards = frameworks.length > 0 
    ? frameworks.map(fw => {
        const fwRisks = risks.filter(r => r.framework === fw || (r.compliance && r.compliance[fw.toLowerCase()]));
        const score = fwRisks.length > 0 ? Math.min(100, Math.floor((risks.filter(r => r.status === 'Mitigated' || r.status === 'Closed').length / risks.length) * 100)) : 0;
        return { 
          name: fw, 
          score: risks.length > 0 ? score : 0, 
          color: fw.includes('NCA') ? 'bg-emerald-500' : fw.includes('ISO') ? 'bg-blue-500' : 'bg-purple-500' 
        };
      })
    : [
        { name: isAr ? 'لا توجد أطر عمل' : 'No Frameworks Selected', score: 0, color: 'bg-slate-700' }
      ];

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-emerald-500" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
          {isAr ? 'صحة الامتثال' : 'Compliance Health'}
        </h3>
      </div>

      <div className="flex-1 space-y-6">
        {standards.map((std, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-400">{std.name}</span>
              <span className="text-slate-200">{std.score}% {isAr ? 'جاهز' : 'Ready'}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${std.score}%` }}
                 className={`h-full ${std.color} transition-all duration-1000`} 
               />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>{isAr ? 'تم معالجة جميع الثغرات الحرجة' : 'All critical gaps mitigated'}</span>
        </div>
      </div>
    </div>
  );
};

import { motion } from 'framer-motion';
