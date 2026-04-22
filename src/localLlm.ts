
interface Risk {
    asset_category: string;
    asset: string;
    threat: string;
    vulnerability: string;
    risk_statement: string;
}

const KNOWLEDGE_BASE: Record<string, { en: string[], ar: string[] }> = {
    "Phishing": {
        en: [
            "Implement Multi-Factor Authentication (MFA).",
            "Conduct regular employee security awareness training.",
            "Use advanced email filtering and anti-phishing solutions.",
            "Establish a clear reporting process for suspicious emails."
        ],
        ar: [
            "تنفيذ المصادقة الثنائية (MFA).",
            "إجراء تدريبات دورية للتوعية الأمنية للموظفين.",
            "استخدام حلول متقدمة لتصفية البريد الإلكتروني ومكافحة التصيد.",
            "إنشاء عملية إبلاغ واضحة لرسائل البريد الإلكتروني المشبوهة."
        ]
    },
    "Ransomware": {
        en: [
            "Maintain offline, immutable backups of critical data.",
            "Implement network segmentation to contain potential infections.",
            "Keep all software and systems updated with latest security patches.",
            "Use endpoint detection and response (EDR) tools."
        ],
        ar: [
            "الاحتفاظ بنسخ احتياطية غير قابلة للتغيير وغير متصلة بالإنترنت للبيانات الحساسة.",
            "تنفيذ تقسيم الشبكة لاحتواء الإصابات المحتملة.",
            "تحديث جميع البرامج والأنظمة بأحدث التصحيحات الأمنية.",
            "استخدام أدوات الكشف عن التهديدات والاستجابة لها (EDR)."
        ]
    },
    "Data Breach": {
        en: [
            "Encrypt sensitive data at rest and in transit.",
            "Implement strict access controls (Principle of Least Privilege).",
            "Monitor for unauthorized access attempts.",
            "Develop and test an incident response plan."
        ],
        ar: [
            "تشفير البيانات الحساسة أثناء التخزين والنقل.",
            "تنفيذ ضوابط وصول صارمة (مبدأ الحد الأدنى من الصلاحيات).",
            "مراقبة محاولات الوصول غير المصرح بها.",
            "تطوير واختبار خطة الاستجابة للحوادث."
        ]
    },
    "Hardware Failure": {
        en: [
            "Implement redundant hardware components (RAID, dual power supplies).",
            "Regularly test hardware health and replace aging components.",
            "Maintain a stock of critical spare parts.",
            "Use Uninterruptible Power Supplies (UPS)."
        ],
        ar: [
            "تنفيذ مكونات أجهزة زائدة عن الحاجة (RAID، مصادر طاقة مزدوجة).",
            "اختبار صحة الأجهزة بانتظام واستبدال المكونات القديمة.",
            "الاحتفاظ بمخزون من قطع الغيار الحيوية.",
            "استخدام مزودات الطاقة غير المنقطعة (UPS)."
        ]
    },
    "Natural Disaster": {
        en: [
            "Establish a geographically redundant disaster recovery site.",
            "Develop a comprehensive business continuity plan.",
            "Store critical backups in a secure, off-site location.",
            "Regularly conduct disaster recovery drills."
        ],
        ar: [
            "إنشاء موقع للتعافي من الكوارث زائد عن الحاجة جغرافياً.",
            "تطوير خطة شاملة لاستمرارية الأعمال.",
            "تخزين النسخ الاحتياطية الحيوية في موقع آمن خارج الموقع.",
            "إجراء تمارين التعافي من الكوارث بانتظام."
        ]
    },
    "Insider Threat": {
        en: [
            "Implement separation of duties for critical processes.",
            "Conduct background checks for employees with sensitive access.",
            "Monitor user activity and behavior for anomalies.",
            "Establish a clear 'whistleblower' policy."
        ],
        ar: [
            "تنفيذ الفصل بين المهام للعمليات الحيوية.",
            "إجراء فحص خلفية للموظفين الذين لديهم وصول حساس.",
            "مراقبة نشاط المستخدم وسلوكه بحثاً عن أي شذوذ.",
            "إنشاء سياسة واضحة لـ 'الإبلاغ عن المخالفات'."
        ]
    },
    "Cloud Outage": {
        en: [
            "Use a multi-cloud strategy for critical services.",
            "Implement local caching or offline modes where possible.",
            "Regularly test failover to other regions or providers.",
            "Ensure clear SLAs with cloud providers."
        ],
        ar: [
            "استخدام استراتيجية السحابة المتعددة للخدمات الحيوية.",
            "تنفيذ التخزين المؤقت المحلي أو أوضاع عدم الاتصال حيثما أمكن ذلك.",
            "اختبار فشل الخدمة بانتظام في مناطق أو مزودين آخرين.",
            "ضمان اتفاقيات مستوى خدمة (SLAs) واضحة مع مزودي السحابة."
        ]
    },
    "OHSA": {
        en: [
            "Conduct regular workplace safety audits (MHRSD/GOSI compliance).",
            "Provide mandatory Personal Protective Equipment (PPE).",
            "Implement 'Lockout/Tagout' (LOTO) procedures for machinery.",
            "Establish a clear Emergency Response and First Aid protocol."
        ],
        ar: [
            "إجراء عمليات تدقيق منتظمة لسلامة مكان العمل (الامتثال لوزارة الموارد البشرية/التأمينات الاجتماعية).",
            "توفير معدات الحماية الشخصية الإلزامية (PPE).",
            "تنفيذ إجراءات 'الإغلاق والوسم' (LOTO) للآلات.",
            "إنشاء بروتوكول واضح للاستجابة للطوارئ والإسعافات الأولية."
        ]
    },
    "Financial": {
        en: [
            "Adhere to SAMA and CMA regulations.",
            "Implement robust internal audit and financial reconciliation processes.",
            "Use hedging strategies to mitigate currency volatility.",
            "Establish strict credit limits and regular counterparty risk assessments."
        ],
        ar: [
            "الالتزام بلوائح البنك المركزي السعودي (SAMA) وهيئة السوق المالية (CMA).",
            "تنفيذ عمليات تدقيق داخلي وتسوية مالية قوية.",
            "استخدام استراتيجيات التحوط للتخفيف من تقلبات العملة.",
            "وضع حدود ائتمانية صارمة وتقييمات منتظمة لمخاطر الأطراف المقابلة."
        ]
    }
};

export const getLocalMitigation = (risk: Risk, lang: 'en' | 'ar' = 'en'): string => {
    const text = `${risk.threat} ${risk.asset} ${risk.vulnerability} ${risk.risk_statement}`.toLowerCase();
    
    let suggestions: string[] = [];
    
    for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
        if (text.includes(key.toLowerCase())) {
            suggestions = [...suggestions, ...data[lang]];
        }
    }
    
    if (suggestions.length === 0) {
        return lang === 'ar'
            ? "توصية محلية: تنفيذ ضوابط وصول قوية، ونسخ احتياطي منتظم، ومراقبة مستمرة. تأكد من الامتثال للمعايير المحلية ذات الصلة."
            : "Local LLM Fallback: No specific matches found. General advice: Implement strong access controls, regular backups, and continuous monitoring. Ensure compliance with relevant local standards.";
    }
    
    const unique = Array.from(new Set(suggestions));
    const header = lang === 'ar'
        ? "توصية محلية (وضع عدم الاتصال):\n\nبناءً على التهديد والأصول، إليك إجراءات التخفيف الموصى بها:"
        : "Local LLM Fallback (Offline Mode):\n\nBased on the threat and asset, here are recommended mitigation actions:";
        
    return `${header}\n\n${unique.map(s => `- ${s}`).join('\n')}`;
};
