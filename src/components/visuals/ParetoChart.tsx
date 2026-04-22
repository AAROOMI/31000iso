import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface ParetoProps {
  risks: any[];
}

export const ParetoChart: React.FC<ParetoProps> = ({ risks }) => {
  // Process data for Pareto: sort by score descending
  const sortedRisks = [...risks]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10);

  const totalScore = sortedRisks.reduce((acc, r) => acc + (r.score || 0), 0);
  let cumulativeScore = 0;

  const chartData = sortedRisks.map(r => {
    cumulativeScore += (r.score || 0);
    return {
      name: r.id?.substring(0, 8) || 'Unknown',
      score: r.score || 0,
      cumulative: totalScore > 0 ? Math.round((cumulativeScore / totalScore) * 100) : 0
    };
  });

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pareto Analysis (Vital Few)</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">80/20 Rule Analysis</span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#f97316', fontSize: 10 }} unit="%" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Bar yAxisId="left" dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
