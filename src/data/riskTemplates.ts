
export interface RiskTemplate {
  asset: string;
  asset_ar: string;
  threat: string;
  threat_ar: string;
  vulnerability: string;
  vulnerability_ar: string;
  riskStatement: string;
  riskStatement_ar: string;
  likelihood: number;
  impact: number;
}

export const RISK_TEMPLATES: Record<string, RiskTemplate[]> = {
  ohsa: [
    { 
      asset: "Factory Floor", asset_ar: "أرضية المصنع",
      threat: "Machinery Malfunction", threat_ar: "عطل في الآلات",
      vulnerability: "Lack of regular maintenance", vulnerability_ar: "نقص الصيانة الدورية",
      riskStatement: "Injury to worker due to equipment failure", riskStatement_ar: "إصابة العامل بسبب فشل المعدات",
      likelihood: 3, impact: 5 
    },
    { 
      asset: "Construction Site", asset_ar: "موقع بناء",
      threat: "Falls from Height", threat_ar: "السقوط من المرتفعات",
      vulnerability: "Inadequate safety harnesses", vulnerability_ar: "أحزمة أمان غير كافية",
      riskStatement: "Fatal injury or severe disability", riskStatement_ar: "إصابة قاتلة أو إعاقة شديدة",
      likelihood: 2, impact: 5 
    }
  ],
  production: [
    { 
      asset: "Assembly Line", asset_ar: "خط التجميع",
      threat: "Supply Chain Disruption", threat_ar: "تعطل سلسلة التوريد",
      vulnerability: "Single source supplier", vulnerability_ar: "مورد مصدر واحد",
      riskStatement: "Production halt leading to revenue loss", riskStatement_ar: "توقف الإنتاج مما يؤدي إلى خسارة الإيرادات",
      likelihood: 4, impact: 4 
    }
  ],
  iso31000: [
    { 
      asset: "Strategic Objectives", asset_ar: "الأهداف الاستراتيجية",
      threat: "Market Competition", threat_ar: "المنافسة في السوق",
      vulnerability: "Lack of innovation", vulnerability_ar: "نقص الابتكار",
      riskStatement: "Loss of market share and revenue", riskStatement_ar: "خسارة الحصة السوقية والإيرادات",
      likelihood: 3, impact: 4 
    },
    { 
      asset: "Supply Chain", asset_ar: "سلسلة التوريد",
      threat: "Supply Chain Disruption", threat_ar: "تعطل سلسلة التوريد",
      vulnerability: "Single source supplier", vulnerability_ar: "مورد مصدر واحد",
      riskStatement: "Production halt leading to revenue loss", riskStatement_ar: "توقف الإنتاج مما يؤدي إلى خسارة الإيرادات",
      likelihood: 4, impact: 4 
    },
    {
      asset: "Reputation", asset_ar: "السمعة",
      threat: "Negative Publicity", threat_ar: "دعاية سلبية",
      vulnerability: "Poor crisis communication", vulnerability_ar: "ضعف التواصل في الأزمات",
      riskStatement: "Loss of brand value and customer trust", riskStatement_ar: "فقدان قيمة العلامة التجارية وثقة العملاء",
      likelihood: 2, impact: 5
    }
  ],
  ncacscc: [
    {
      asset: "Cloud Infrastructure", asset_ar: "البنية التحتية السحابية",
      threat: "Data Breach in Cloud", threat_ar: "خرق البيانات في السحاب",
      vulnerability: "Misconfigured S3 buckets", vulnerability_ar: "سوء تكوين حاويات S3",
      riskStatement: "Exposure of sensitive citizen data", riskStatement_ar: "تعرض بيانات المواطنين الحساسة",
      likelihood: 3, impact: 5
    }
  ],
  pdpl: [
    {
      asset: "Personal Data", asset_ar: "البيانات الشخصية",
      threat: "Unauthorized Processing", threat_ar: "معالجة غير مصرح بها",
      vulnerability: "Lack of data processing consent", vulnerability_ar: "نقص الموافقة على معالجة البيانات",
      riskStatement: "Legal penalties under PDPL", riskStatement_ar: "عقوبات قانونية بموجب نظام حماية البيانات الشخصية",
      likelihood: 3, impact: 5
    }
  ],
  sama: [
    {
      asset: "Banking Systems", asset_ar: "الأنظمة المصرفية",
      threat: "Fraudulent Transactions", threat_ar: "معاملات احتيالية",
      vulnerability: "Weak transaction monitoring", vulnerability_ar: "ضعف مراقبة المعاملات",
      riskStatement: "Financial loss and SAMA non-compliance", riskStatement_ar: "خسارة مالية وعدم الالتزام بضوابط ساما",
      likelihood: 2, impact: 5
    }
  ],
  financial: [
    { 
      asset: "Cash Flow", asset_ar: "التدفق النقدي",
      threat: "Currency Volatility", threat_ar: "تعلب العملات",
      vulnerability: "High exposure to foreign markets", vulnerability_ar: "تعرض عالٍ للأسواق الخارجية",
      riskStatement: "Significant loss in exchange rates", riskStatement_ar: "خسارة كبيرة في أسعار الصرف",
      likelihood: 4, impact: 3 
    }
  ],
  cybersecurity: [
    { 
      asset: "Customer Data", asset_ar: "بيانات العملاء",
      threat: "Data Breach", threat_ar: "خرق البيانات",
      vulnerability: "Weak encryption", vulnerability_ar: "تشفير ضعيف",
      riskStatement: "PDPL non-compliance and reputational damage", riskStatement_ar: "عدم الالتزام بنظام حماية البيانات الشخصية وتضرر السمعة",
      likelihood: 2, impact: 5 
    }
  ],
  iso27001: [
    { 
      asset: "Information Assets", asset_ar: "أصول المعلومات",
      threat: "Unauthorized Disclosure", threat_ar: "إفشاء غير مصرح به",
      vulnerability: "Lack of access control policy", vulnerability_ar: "نقص سياسة التحكم في الوصول",
      riskStatement: "Loss of confidentiality", riskStatement_ar: "فقدان السرية",
      likelihood: 2, impact: 5 
    },
    { 
      asset: "Physical Security", asset_ar: "الأمن المادي",
      threat: "Physical Theft", threat_ar: "السرقة المادية",
      vulnerability: "Unsecured entry points", vulnerability_ar: "نقاط دخول غير مؤمنة",
      riskStatement: "Loss of hardware and sensitive data", riskStatement_ar: "فقدان الأجهزة والبيانات الحساسة",
      likelihood: 2, impact: 4 
    },
    { 
      asset: "Mobile Devices", asset_ar: "الأجهزة المحمولة",
      threat: "Device Loss", threat_ar: "فقدان الجهاز",
      vulnerability: "No MDM solution", vulnerability_ar: "لا يوجد حل لإدارة الأجهزة المحمولة",
      riskStatement: "Unauthorized access to corporate email", riskStatement_ar: "الوصول غير المصرح به إلى البريد الإلكتروني للشركة",
      likelihood: 4, impact: 3 
    }
  ],
  ncaecc: [
    { 
      asset: "Government Systems", asset_ar: "الأنظمة الحكومية",
      threat: "Cyber Espionage", threat_ar: "التجسس السيبراني",
      vulnerability: "Non-compliance with NCA ECC controls", vulnerability_ar: "عدم الالتزام بضوابط الهيئة الوطنية للأمن السيبراني",
      riskStatement: "National security risk", riskStatement_ar: "خطر على الأمن القومي",
      likelihood: 2, impact: 5 
    },
    { 
      asset: "Critical Infrastructure", asset_ar: "البنية التحتية الحيوية",
      threat: "Sabotage", threat_ar: "تخريب",
      vulnerability: "Weak physical perimeter", vulnerability_ar: "محيط مادي ضعيف",
      riskStatement: "Disruption of essential services", riskStatement_ar: "تعطل الخدمات الأساسية",
      likelihood: 1, impact: 5 
    },
    { 
      asset: "Network Infrastructure", asset_ar: "البنية التحتية للشبكة",
      threat: "DDoS Attack", threat_ar: "هجوم حجب الخدمة الموزع",
      vulnerability: "Lack of traffic filtering", vulnerability_ar: "نقص تصفية حركة المرور",
      riskStatement: "Service unavailability for citizens", riskStatement_ar: "عدم توفر الخدمة للمواطنين",
      likelihood: 3, impact: 4 
    }
  ],
  nistcsf: [
    {
      asset: "Critical Infrastructure", asset_ar: "البنية التحتية الحيوية",
      threat: "Ransomware Attack", threat_ar: "هجوم برامج الفدية",
      vulnerability: "Insufficient incident response plan", vulnerability_ar: "خطة استجابة للحوادث غير كافية",
      riskStatement: "Extended downtime and data loss", riskStatement_ar: "توقف طويل وفقدان للبيانات",
      likelihood: 3, impact: 5
    },
    {
      asset: "Supply Chain", asset_ar: "سلسلة التوريد",
      threat: "Compromised Vendor", threat_ar: "مورد مخترق",
      vulnerability: "No third-party risk assessment", vulnerability_ar: "لا يوجد تقييم لمخاطر الطرف الثالث",
      riskStatement: "Malicious code injected into system", riskStatement_ar: "حقن كود ضار في النظام",
      likelihood: 2, impact: 5
    },
    {
      asset: "User Credentials", asset_ar: "بيانات اعتماد المستخدم",
      threat: "Phishing", threat_ar: "التصيد الاحتيالي",
      vulnerability: "Lack of MFA", vulnerability_ar: "نقص المصادقة الثنائية",
      riskStatement: "Account takeover and data exfiltration", riskStatement_ar: "الاستيلاء على الحساب وتسريب البيانات",
      likelihood: 5, impact: 4
    },
    {
      asset: "Cloud Services", asset_ar: "خدمات السحاب",
      threat: "Misconfiguration", threat_ar: "سوء التكوين",
      vulnerability: "Inadequate cloud security training", vulnerability_ar: "تدريب غير كافٍ على أمن السحاب",
      riskStatement: "Public exposure of sensitive data", riskStatement_ar: "التعرض العام للبيانات الحساسة",
      likelihood: 4, impact: 5
    }
  ],
  iso22301: [
    { 
      asset: "Business Operations", asset_ar: "العمليات التجارية",
      threat: "Service Outage", threat_ar: "انقطاع الخدمة",
      vulnerability: "No business continuity plan", vulnerability_ar: "لا توجد خطة استمرارية الأعمال",
      riskStatement: "Inability to meet customer SLAs", riskStatement_ar: "عدم القدرة على تلبية اتفاقيات مستوى الخدمة",
      likelihood: 2, impact: 4 
    }
  ],
  operational: [
    { 
      asset: "IT Infrastructure", asset_ar: "البنية التحتية لتكنولوجيا المعلومات",
      threat: "System Downtime", threat_ar: "توقف النظام",
      vulnerability: "Single point of failure", vulnerability_ar: "نقطة فشل واحدة",
      riskStatement: "Business operations interrupted", riskStatement_ar: "انقطاع العمليات التجارية",
      likelihood: 3, impact: 4 
    }
  ],
  saudistandards: [
    { 
      asset: "Financial Data", asset_ar: "البيانات المالية",
      threat: "Data Leakage", threat_ar: "تسرب البيانات",
      vulnerability: "Non-compliance with SAMA Cyber Security Framework", 
      vulnerability_ar: "عدم الالتزام بإطار الأمن السيبراني لمؤسسة النقد العربي السعودي (ساما)",
      riskStatement: "Regulatory penalties and financial loss", riskStatement_ar: "عقوبات تنظيمية وخسارة مالية",
      likelihood: 2, impact: 5 
    }
  ]
};
