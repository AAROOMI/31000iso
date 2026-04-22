import React from 'react';
import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KRIProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const KRIModule: React.FC<KRIProps> = ({ data, onChange, lang }) => {
  const t = {
    en: {
      title: "Key Risk Indicators (KRI)",
      indicator: "Indicator Name",
      threshold: "Threshold",
      current: "Current Value",
      trend: "Trend",
      alert: "Alert Level",
      placeholder: "e.g., Number of failed logins..."
    },
    ar: {
      title: "مؤشرات المخاطر الرئيسية (KRI)",
      indicator: "اسم المؤشر",
      threshold: "الحد المسموح",
      current: "القيمة الحالية",
      trend: "الاتجاه",
      alert: "مستوى التنبيه",
      placeholder: "مثال: عدد محاولات تسجيل الدخول الفاشلة..."
    }
  }[lang];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-red-400" />;
      case 'down': return <TrendingDown size={16} className="text-emerald-400" />;
      default: return <Minus size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Zap size={20} className="text-amber-500" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{t.indicator}</span>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
              placeholder={t.placeholder}
              value={data?.indicator || ''}
              onChange={(e) => onChange({ ...data, indicator: e.target.value })}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] text-slate-500 mb-1 block">{t.threshold}</span>
              <input
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
                value={data?.threshold || 0}
                onChange={(e) => onChange({ ...data, threshold: parseFloat(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-slate-500 mb-1 block">{t.current}</span>
              <input
                type="number"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
                value={data?.currentValue || 0}
                onChange={(e) => onChange({ ...data, currentValue: parseFloat(e.target.value) })}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t.trend}</span>
              <div className="flex gap-2">
                {['down', 'stable', 'up'].map(tr => (
                  <button
                    key={tr}
                    onClick={() => onChange({ ...data, trend: tr })}
                    className={`p-2 rounded-lg border transition-all ${data?.trend === tr ? 'bg-slate-700 border-amber-500/50' : 'bg-slate-800 border-slate-700'}`}
                  >
                    {getTrendIcon(tr)}
                  </button>
                ))}
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t.alert}</span>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                data?.currentValue > data?.threshold ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                data?.currentValue > data?.threshold * 0.8 ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              }`}>
                {data?.currentValue > data?.threshold ? 'CRITICAL ALERT' :
                 data?.currentValue > data?.threshold * 0.8 ? 'WARNING' : 'STABLE'}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
