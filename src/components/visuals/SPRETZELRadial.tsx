import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, RadarChartProps, ResponsiveContainer } from 'recharts';

interface SPRETZELProps {
  data: {
    people?: string;
    resources?: string;
    legal?: string;
    opportunities?: string;
    technology?: string;
    strategy?: string;
    engagement?: string;
    lifecycle?: string;
    marketing?: string;
  };
  lang?: string;
}

export const SPRETZELRadial: React.FC<SPRETZELProps> = ({ data, lang = 'en' }) => {
  const isAr = lang === 'ar';
  
  const chartData = [
    { subject: isAr ? 'الأشخاص' : 'People', value: data.people ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'الموارد' : 'Resources', value: data.resources ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'القانون' : 'Legal', value: data.legal ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'الفرص' : 'Opportunity', value: data.opportunities ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'التقنية' : 'Tech', value: data.technology ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'الاستراتيجية' : 'Strategy', value: data.strategy ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'المشاركة' : 'Engage', value: data.engagement ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'دورة الحياة' : 'Lifecycle', value: data.lifecycle ? 100 : 0, fullMark: 100 },
    { subject: isAr ? 'التسويق' : 'Market', value: data.marketing ? 100 : 0, fullMark: 100 },
  ];

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isAr ? 'تخطيط حوكمة SPRETZEL' : 'SPRETZEL Governance Mapping'}
        </span>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Radar
              name={isAr ? 'سياق المخاطر' : 'Risk Context'}
              dataKey="value"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
