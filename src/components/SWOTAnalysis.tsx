import React from 'react';
import { Target, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface SWOTProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const SWOTAnalysis: React.FC<SWOTProps> = ({ data, onChange, lang }) => {
  const t = {
    en: {
      title: "SWOT Strategic Matrix",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      opportunities: "Opportunities",
      threats: "Threats",
      strategicActions: "Strategic AI Insights",
      placeholder: "Enter observations..."
    },
    ar: {
      title: "مصفوفة SWOT الاستراتيجية",
      strengths: "نقاط القوة",
      weaknesses: "نقاط الضعف",
      opportunities: "الفرص",
      threats: "التهديدات",
      strategicActions: "رؤى استراتيجية (ذكاء اصطناعي)",
      placeholder: "أدخل الملاحظات..."
    }
  }[lang];

  const updateSWOT = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Target size={20} className="text-emerald-400" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Zap size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t.strengths}</span>
          </div>
          <textarea
            rows={3}
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none"
            placeholder={t.placeholder}
            value={data?.strengths || ''}
            onChange={(e) => updateSWOT('strengths', e.target.value)}
          />
        </div>

        {/* Weaknesses */}
        <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-orange-400">
            <TrendingUp size={16} className="rotate-180" />
            <span className="text-sm font-medium uppercase tracking-wider">{t.weaknesses}</span>
          </div>
          <textarea
            rows={3}
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none"
            placeholder={t.placeholder}
            value={data?.weaknesses || ''}
            onChange={(e) => updateSWOT('weaknesses', e.target.value)}
          />
        </div>

        {/* Opportunities */}
        <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-sky-400">
            <TrendingUp size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t.opportunities}</span>
          </div>
          <textarea
            rows={3}
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none"
            placeholder={t.placeholder}
            value={data?.opportunities || ''}
            onChange={(e) => updateSWOT('opportunities', e.target.value)}
          />
        </div>

        {/* Threats */}
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{t.threats}</span>
          </div>
          <textarea
            rows={3}
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none"
            placeholder={t.placeholder}
            value={data?.threats || ''}
            onChange={(e) => updateSWOT('threats', e.target.value)}
          />
        </div>
      </div>

      {data?.strategicActions?.length > 0 && (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{t.strategicActions}</h4>
          <ul className="space-y-2">
            {data.strategicActions.map((action: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                <span className="text-sky-400 font-bold">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
