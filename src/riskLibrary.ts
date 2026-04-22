
export interface LibraryRisk {
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

export const RISK_LIBRARY: Record<string, LibraryRisk[]> = {
  "ISO 31000": [
    {
      asset: "Strategic Planning Process",
      asset_ar: "عملية التخطيط الاستراتيجي",
      threat: "Inaccurate market data",
      threat_ar: "بيانات السوق غير الدقيقة",
      vulnerability: "Lack of data validation controls",
      vulnerability_ar: "نقص ضوابط التحقق من البيانات",
      riskStatement: "Inaccurate market data may lead to flawed strategic decisions.",
      riskStatement_ar: "قد تؤدي بيانات السوق غير الدقيقة إلى قرارات استراتيجية خاطئة.",
      likelihood: 3,
      impact: 4
    },
    {
      asset: "Corporate Governance",
      asset_ar: "الحوكمة المؤسسية",
      threat: "Lack of transparency",
      threat_ar: "نقص الشفافية",
      vulnerability: "Insufficient reporting mechanisms",
      vulnerability_ar: "آليات إبلاغ غير كافية",
      riskStatement: "Lack of transparency in governance can lead to loss of stakeholder trust.",
      riskStatement_ar: "يمكن أن يؤدي نقص الشفافية في الحوكمة إلى فقدان ثقة أصحاب المصلحة.",
      likelihood: 2,
      impact: 5
    }
  ],
  "ISO 27001": [
    {
      asset: "Customer Personal Data",
      asset_ar: "البيانات الشخصية للعملاء",
      threat: "Data breach",
      threat_ar: "خرق البيانات",
      vulnerability: "Unencrypted storage",
      vulnerability_ar: "تخزين غير مشفر",
      riskStatement: "Unencrypted storage of personal data increases the risk of a data breach.",
      riskStatement_ar: "يزيد التخزين غير المشفر للبيانات الشخصية من خطر خرق البيانات.",
      likelihood: 3,
      impact: 5
    },
    {
      asset: "Network Infrastructure",
      asset_ar: "البنية التحتية للشبكة",
      threat: "DDoS Attack",
      threat_ar: "هجوم حجب الخدمة الموزع",
      vulnerability: "Lack of traffic filtering",
      vulnerability_ar: "نقص تصفية حركة المرور",
      riskStatement: "A DDoS attack could lead to prolonged service unavailability.",
      riskStatement_ar: "يمكن أن يؤدي هجوم حجب الخدمة الموزع إلى عدم توفر الخدمة لفترة طويلة.",
      likelihood: 4,
      impact: 4
    }
  ],
  "NCA ECC": [
    {
      asset: "Critical Information Infrastructure",
      asset_ar: "البنية التحتية للمعلومات الحساسة",
      threat: "Cyber espionage",
      threat_ar: "التجسس السيبراني",
      vulnerability: "Weak network segmentation",
      vulnerability_ar: "ضعف تقسيم الشبكة",
      riskStatement: "Cyber espionage could lead to the theft of sensitive national data.",
      riskStatement_ar: "قد يؤدي التجسس السيبراني إلى سرقة بيانات وطنية حساسة.",
      likelihood: 2,
      impact: 5
    },
    {
      asset: "Government Cloud Services",
      asset_ar: "الخدمات السحابية الحكومية",
      threat: "Unauthorized access",
      threat_ar: "وصول غير مصرح به",
      vulnerability: "Weak authentication protocols",
      vulnerability_ar: "بروتوكولات مصادقة ضعيفة",
      riskStatement: "Unauthorized access to cloud services could compromise government secrets.",
      riskStatement_ar: "الوصول غير المصرح به إلى الخدمات السحابية قد يعرض الأسرار الحكومية للخطر.",
      likelihood: 3,
      impact: 5
    }
  ]
};
