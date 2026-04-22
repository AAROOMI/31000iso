import React from 'react';
import { Target, AlertTriangle, Lightbulb } from 'lucide-react';

interface SWOTProps {
  risks: any[];
}

export const SWOTHighlights: React.FC<SWOTProps> = ({ risks }) => {
  const threats = risks.filter(r => r.swot?.threats).length;
  const opps = risks.filter(r => r.swot?.opportunities).length;

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-emerald-500" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Strategy Pulse</h3>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Threats</span>
          </div>
          <p className="text-2xl font-bold text-slate-200">{threats}</p>
        </div>
        
        <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={12} className="text-sky-400" />
            <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Growth</span>
          </div>
          <p className="text-2xl font-bold text-slate-200">{opps}</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
        <p className="text-[10px] text-slate-400 leading-relaxed italic">
          "Core vulnerability patterns suggest prioritizing technological resilience over immediate resource expansion."
        </p>
      </div>
    </div>
  );
};
