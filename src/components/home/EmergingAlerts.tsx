import React from 'react';
import { Eye, BellDot } from 'lucide-react';

interface AlertProps {
  risks: any[];
}

export const EmergingAlerts: React.FC<AlertProps> = ({ risks }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <BellDot className="text-amber-500 animate-pulse" size={18} />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Predictive Intelligence</h3>
      </div>

      <div className="flex-1 space-y-4">
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl relative group cursor-pointer hover:bg-amber-500/10 transition-all">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
             <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Early Trigger Warning</span>
          </div>
          <p className="text-[10px] text-slate-300 font-medium">Potential supply chain disruption forecasted for Q3 based on market volatility indices.</p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest border-t border-slate-800 pt-4">
           <span>Emerging Risks</span>
           <span className="text-amber-400">03 New</span>
        </div>
      </div>
    </div>
  );
};
