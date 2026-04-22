import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface FiveWhysProps {
  data: string[];
}

export const FiveWhysFlow: React.FC<FiveWhysProps> = ({ data = [] }) => {
  const whys = data.filter(w => w.trim() !== '');

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-8 w-full">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">5 Whys Sequential Chain</span>
      </div>

      <div className="space-y-4 w-full max-w-md">
        {whys.length > 0 ? whys.map((why, idx) => (
          <React.Fragment key={idx}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center gap-4 group hover:border-emerald-500/30 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-500">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Why?</p>
                <p className="text-xs text-slate-200 font-medium italic">"{why}"</p>
              </div>
            </motion.div>
            {idx < whys.length - 1 && (
              <div className="flex justify-center -my-2 relative z-10">
                <ArrowDown size={20} className="text-slate-600 animate-bounce" />
              </div>
            )}
          </React.Fragment>
        )) : (
          <div className="text-center py-10 text-slate-600 italic text-xs">No analysis data available. Perform AI Strategic Analysis to generate.</div>
        )}
      </div>
    </div>
  );
};
