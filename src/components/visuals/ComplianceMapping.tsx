import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComplianceProps {
  risks: any[];
  lang?: string;
}

export const ComplianceMapping: React.FC<ComplianceProps> = ({ risks, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const data = [
    { name: 'NCA ECC', coverage: 85, color: '#3b82f6' },
    { name: 'ISO 27001', coverage: 72, color: '#10b981' },
    { name: 'NIST CSF', coverage: 64, color: '#8b5cf6' },
    { name: 'SAMA CSF', coverage: 91, color: '#f59e0b' },
  ];

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isAr ? 'رسم جاهزية الامتثال العالمي' : 'Global Compliance Readiness Mapping'}
        </span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={isAr ? 80 : 70} orientation={isAr ? 'right' : 'left'} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', textAlign: isAr ? 'right' : 'left' }}
              cursor={{ fill: 'transparent' }}
            />
            <Bar dataKey="coverage" radius={isAr ? [4, 0, 0, 4] : [0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <rect key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-[10px] text-slate-500 text-center italic">
        {isAr ? 'محسوب بناءً على الضوابط المرتبطة وحالة المعالجة' : 'Calculated based on linked controls and mitigation status'}
      </div>
    </div>
  );
};
