import React from 'react';
import { Network } from 'lucide-react';

interface SPRETZELProps {
  data: any;
  onChange: (data: any) => void;
  lang: 'en' | 'ar';
}

export const SPRETZELMapping: React.FC<SPRETZELProps> = ({ data, onChange, lang }) => {
  const categories = [
    { id: 'people', label: 'People', label_ar: 'الأفراد', icon: '👥' },
    { id: 'resources', label: 'Resources', label_ar: 'الموارد', icon: '📦' },
    { id: 'legal', label: 'Legal & Regulatory', label_ar: 'القانونية والتنظيمية', icon: '⚖️' },
    { id: 'opportunities', label: 'Supporting Opportunities', label_ar: 'الفرص الداعمة', icon: '🌟' },
    { id: 'technology', label: 'Technology', label_ar: 'التقنية', icon: '💻' },
    { id: 'strategy', label: 'Strategy', label_ar: 'الاستراتيجية', icon: '🎯' },
    { id: 'engagement', label: 'Engagement', label_ar: 'المشاركة', icon: '🤝' },
    { id: 'lifecycle', label: 'Lifecycle', label_ar: 'دورة الحياة', icon: '♻️' },
    { id: 'marketing', label: 'Marketing', label_ar: 'التسويق', icon: '📢' }
  ];

  const t = {
    en: { title: "SPRETZEL Multi-Dimensional Mapping" },
    ar: { title: "تخطيط SPRETZEL متعدد الأبعاد" }
  }[lang];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Network size={20} className="text-purple-400" />
        <h3 className="text-lg font-medium text-white">{t.title}</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {lang === 'ar' ? cat.label_ar : cat.label}
              </span>
            </div>
            <textarea
              rows={2}
              className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-700 focus:outline-none resize-none"
              placeholder="..."
              value={data?.[cat.id] || ''}
              onChange={(e) => onChange({ ...data, [cat.id]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
