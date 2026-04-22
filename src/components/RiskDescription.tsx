import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface DescriptionProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const RiskDescription: React.FC<DescriptionProps> = ({ data, onChange, lang }) => {
  const t = {
    en: {
      title: "Enhanced Risk Statement",
      statement: "Principal Risk Statement",
      context: "Operating Context",
      impact: "Potential Impact",
      reasoning: "Likelihood Reasoning",
      aiPrompt: "Generate AI Clarity"
    },
    ar: {
      title: "بيان المخاطر المعزز",
      statement: "بيان المخاطر الرئيسي",
      context: "سياق التشغيل",
      impact: "الأثر المحتمل",
      reasoning: "تبرير الاحتمالية",
      aiPrompt: "توليد وضوح بالذكاء الاصطناعي"
    }
  }[lang];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <FileText size={20} className="text-sky-400" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.statement}</span>
          <textarea
            rows={2}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:border-sky-500 outline-none"
            value={data?.riskStatement || ''}
            onChange={(e) => onChange({ ...data, riskStatement: e.target.value })}
          />
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.context}</span>
            <textarea
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 focus:border-sky-500 outline-none"
              value={data?.context || ''}
              onChange={(e) => onChange({ ...data, context: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.impact}</span>
            <textarea
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 focus:border-sky-500 outline-none"
              value={data?.impactDescription || ''}
              onChange={(e) => onChange({ ...data, impactDescription: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.reasoning}</span>
            <textarea
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 focus:border-sky-500 outline-none"
              value={data?.likelihoodReasoning || ''}
              onChange={(e) => onChange({ ...data, likelihoodReasoning: e.target.value })}
            />
          </label>
        </div>
      </div>

      {data?.aiSuggestions && (
        <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 text-sky-500/20 group-hover:text-sky-500/40 transition-colors">
            <Sparkles size={40} />
          </div>
          <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles size={12} /> AI Suggested Clarity
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed italic">{data.aiSuggestions}</p>
        </div>
      )}
    </div>
  );
};
