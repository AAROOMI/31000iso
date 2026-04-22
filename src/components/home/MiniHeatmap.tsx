import React from 'react';
import { Maximize2 } from 'lucide-react';

interface MiniHeatmapProps {
  risks: any[];
  onExpand: () => void;
}

export const MiniHeatmap: React.FC<MiniHeatmapProps> = ({ risks, onExpand }) => {
  const grid = [5, 4, 3, 2, 1].map(l => (
    [1, 2, 3, 4, 5].map(i => {
      const score = l * i;
      const count = risks.filter(r => r.likelihood === l && r.impact === i).length;
      let color = 'bg-slate-800/30';
      if (score >= 20) color = 'bg-red-500/40';
      else if (score >= 12) color = 'bg-orange-500/30';
      else if (score >= 5) color = 'bg-yellow-500/20';
      else if (score > 0) color = 'bg-emerald-500/10';
      
      return { score, count, color };
    })
  ));

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-full flex flex-col group cursor-pointer" onClick={onExpand}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Distribution</h3>
        <Maximize2 size={12} className="text-slate-700 group-hover:text-sky-400 transition-colors" />
      </div>

      <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-0.5">
        {grid.flat().map((cell, idx) => (
          <div 
            key={idx} 
            className={`rounded-sm flex items-center justify-center relative ${cell.color} transition-all border border-black/10`}
          >
            {cell.count > 0 && (
              <span className="text-[8px] font-bold text-white shadow-xl">{cell.count}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-[8px] text-slate-500 uppercase tracking-widest font-bold">
         <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-500 rounded-px" /> Critical</span>
         <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-orange-500 rounded-px" /> High</span>
      </div>
    </div>
  );
};
