import React from 'react';

interface StakeholderProps {
  data: {
    influence?: string;
    interest?: string;
    internal?: string;
    external?: string;
  };
}

export const StakeholderMatrix: React.FC<StakeholderProps> = ({ data }) => {
  const isHighPower = data.influence === 'High';
  const isHighInterest = data.interest === 'High';

  return (
    <div className="w-full h-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stakeholder Influence Grid</span>
      </div>

      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 relative border-l-2 border-b-2 border-slate-700">
        {/* Axis Labels */}
        <div className="absolute -left-10 top-1/2 -rotate-90 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Power (Influence)</div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Interest</div>

        {/* Quadrants */}
        <div className={`p-4 rounded-lg border flex items-center justify-center text-center transition-all ${isHighPower && !isHighInterest ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/20' : 'bg-slate-800/30 border-slate-800'}`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Keep Satisfied</span>
            {isHighPower && !isHighInterest && <div className="text-xs text-blue-400 font-medium">Risk Owner: {data.internal || 'TBD'}</div>}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border flex items-center justify-center text-center transition-all ${isHighPower && isHighInterest ? 'bg-red-500/20 border-red-500/50 ring-2 ring-red-500/20' : 'bg-slate-800/30 border-slate-800'}`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Manage Closely</span>
            {isHighPower && isHighInterest && <div className="text-xs text-red-400 font-medium">{data.internal || data.external || 'Assigned'}</div>}
          </div>
        </div>

        <div className={`p-4 rounded-lg border flex items-center justify-center text-center transition-all ${!isHighPower && !isHighInterest ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/20' : 'bg-slate-800/30 border-slate-800'}`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Monitor Only</span>
            {!isHighPower && !isHighInterest && <div className="text-xs text-emerald-400 font-medium">Standard Review</div>}
          </div>
        </div>

        <div className={`p-4 rounded-lg border flex items-center justify-center text-center transition-all ${!isHighPower && isHighInterest ? 'bg-amber-500/20 border-amber-500/50 ring-2 ring-amber-500/20' : 'bg-slate-800/30 border-slate-800'}`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Keep Informed</span>
            {!isHighPower && isHighInterest && <div className="text-xs text-amber-400 font-medium">{data.external || 'Public/Internal'}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
