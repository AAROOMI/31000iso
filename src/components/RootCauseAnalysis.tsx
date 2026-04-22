import React from 'react';
import { HelpCircle, Layers, Activity } from 'lucide-react';

interface RCAProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const RootCauseAnalysis: React.FC<RCAProps> = ({ data, onChange, lang }) => {
  const t = {
    en: {
      title: "Root Cause Analysis (RCA)",
      fiveWhys: "5 Whys Chain",
      ishikawa: "Ishikawa (Fishbone)",
      people: "People",
      process: "Process",
      technology: "Technology",
      environment: "Environment",
      management: "Management",
      primaryRootCause: "Primary Root Cause",
      explanation: "AI Explanation",
      confidence: "Confidence Score"
    },
    ar: {
      title: "تحليل الأسباب الجذرية (RCA)",
      fiveWhys: "سلسلة لماذا الخمسة",
      ishikawa: "إيشيكاوا (عظمة السمكة)",
      people: "الأفراد",
      process: "العمليات",
      technology: "التقنية",
      environment: "البيئة",
      management: "الإدارة",
      primaryRootCause: "السبب الجذري الأساسي",
      explanation: "شرح الذكاء الاصطناعي",
      confidence: "درجة الثقة"
    }
  }[lang];

  const updateFiveWhys = (index: number, value: string) => {
    const newWhys = [...(data?.fiveWhys || ['', '', '', '', ''])];
    newWhys[index] = value;
    onChange({ ...data, fiveWhys: newWhys });
  };

  const updateIshikawa = (field: string, value: string) => {
    onChange({
      ...data,
      ishikawa: { ...data?.ishikawa, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <HelpCircle size={20} className="text-sky-400" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 5 Whys */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-emerald-400" />
            <h4 className="text-sm font-medium text-slate-300">{t.fiveWhys}</h4>
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                <input
                  type="text"
                  placeholder={`Why ${i + 1}?`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none transition-all"
                  value={data?.fiveWhys?.[i] || ''}
                  onChange={(e) => updateFiveWhys(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fishbone */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-amber-400" />
            <h4 className="text-sm font-medium text-slate-300">{t.ishikawa}</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {['people', 'process', 'technology', 'environment', 'management'].map((field) => (
              <label key={field} className="block">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{(t as any)[field]}</span>
                <input
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none transition-all"
                  value={data?.ishikawa?.[field] || ''}
                  onChange={(e) => updateIshikawa(field, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <label className="block">
          <span className="text-sm font-medium text-slate-300 mb-2 block">{t.primaryRootCause}</span>
          <textarea
            rows={2}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none transition-all"
            placeholder="What is the single most significant cause?"
            value={data?.primaryRootCause || ''}
            onChange={(e) => onChange({ ...data, primaryRootCause: e.target.value })}
          />
        </label>
      </div>

      {data?.explanation && (
        <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-medium text-sky-400">{t.explanation}</h5>
            {data?.aiConfidence && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase">{t.confidence}</span>
                <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500" 
                    style={{ width: `${data.aiConfidence * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-sky-400 font-mono">{(data.aiConfidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">{data.explanation}</p>
        </div>
      )}
    </div>
  );
};
