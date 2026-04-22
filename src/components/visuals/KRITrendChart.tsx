import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface KRIProps {
  data: {
    history?: { date: string; value: number }[];
    threshold?: number;
    indicator?: string;
  };
  lang?: string;
}

export const KRITrendChart: React.FC<KRIProps> = ({ data, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const chartData = data?.history?.length ? data.history : [];

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {isAr ? 'اتجاه KRI:' : 'KRI Trend:'} {data.indicator || (isAr ? 'عتبات الأمن' : 'Security Thresholds')}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {isAr ? 'تحليل تنبؤي' : 'Predictive Analysis'}
        </span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} reversed={isAr} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} orientation={isAr ? 'right' : 'left'} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px', textAlign: isAr ? 'right' : 'left' }}
              itemStyle={{ color: '#ef4444' }}
            />
            <ReferenceLine y={data.threshold || 8} label={{ position: isAr ? 'left' : 'right', value: isAr ? 'عتبة' : 'Threshold', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#ef4444' }}
              activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
