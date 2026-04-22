import React from 'react';
import { Users, Info, ShieldAlert } from 'lucide-react';

interface StakeholderProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const StakeholderManagement: React.FC<StakeholderProps> = ({ data, onChange, lang }) => {
  const t = {
    en: {
      title: "Stakeholder Management",
      internal: "Internal Stakeholders",
      external: "External Stakeholders",
      influence: "Influence",
      interest: "Interest",
      escalation: "Escalation Workflow",
      placeholder: "List stakeholders..."
    },
    ar: {
      title: "إدارة أصحاب المصلحة",
      internal: "أصحاب المصلحة الداخليين",
      external: "أصحاب المصلحة الخارجيين",
      influence: "النفوذ",
      interest: "الاهتمام",
      escalation: "مسار التصعيد",
      placeholder: "قائمة أصحاب المصلحة..."
    }
  }[lang];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Users size={20} className="text-amber-400" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.internal}</span>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
              placeholder={t.placeholder}
              value={data?.internal || ''}
              onChange={(e) => onChange({ ...data, internal: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.external}</span>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
              placeholder={t.placeholder}
              value={data?.external || ''}
              onChange={(e) => onChange({ ...data, external: e.target.value })}
            />
          </label>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-tight">
            <Info size={14} /> Power / Interest Mapping
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] text-slate-500 mb-1 block">{t.influence}</span>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                value={data?.influence || 'Medium'}
                onChange={(e) => onChange({ ...data, influence: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] text-slate-500 mb-1 block">{t.interest}</span>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none"
                value={data?.interest || 'Medium'}
                onChange={(e) => onChange({ ...data, interest: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
          <div className="pt-2">
            <div className={`p-2 rounded border text-[10px] text-center font-bold uppercase tracking-widest ${
              data?.influence === 'High' && data?.interest === 'High' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
              data?.influence === 'High' || data?.interest === 'High' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
              'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            }`}>
              {data?.influence === 'High' && data?.interest === 'High' ? 'Manage Closely' :
               data?.influence === 'High' ? 'Keep Satisfied' :
               data?.interest === 'High' ? 'Keep Informed' : 'Monitor Only'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-orange-400 mb-1">
          <ShieldAlert size={16} />
          <h4 className="text-sm font-medium">{t.escalation}</h4>
        </div>
        <p className="text-[11px] text-slate-400 italic leading-relaxed">
          If residual risk exceeds threshold, escalate to {data?.influence === 'High' ? 'Executive Board' : 'Department Head'} within 24 hours.
        </p>
      </div>
    </div>
  );
};
