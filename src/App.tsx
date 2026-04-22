import React, { Component, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { 
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User, deleteUser,
  updateProfile, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "firebase/auth";
import { auth, masterDb, getTenantDb, storage } from "./firebase";
import { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, onSnapshot, getDocs,
  query, orderBy, limit, getDocFromServer, Firestore
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getLocalMitigation } from "./localLlm";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as docx from "docx";
import { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  WidthType, HeadingLevel, AlignmentType, BorderStyle 
} from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { GoogleGenAI, GenerateContentResponse, Modality, FunctionDeclaration, Type, ThinkingLevel } from "@google/genai";
import { 
  ShieldCheck, ShieldAlert, FileUp, ClipboardCheck, Camera, Eye, Download, Search, History, 
  AlertTriangle, CheckCircle2, Info, X, Menu, ChevronRight, ChevronLeft, LayoutDashboard, 
  FileText, Settings, LogOut, User as UserIcon, Globe, Moon, Sun, RefreshCw, ArrowRight, Mic, Key,
  BarChart3, Zap
} from "lucide-react";
import Markdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { RootCauseAnalysis } from "./components/RootCauseAnalysis";
import { SWOTAnalysis } from "./components/SWOTAnalysis";
import { SPRETZELMapping } from "./components/SPRETZELMapping";
import { StakeholderManagement } from "./components/StakeholderManagement";
import { KRIModule } from "./components/KRIModule";
import { RiskDescription } from "./components/RiskDescription";
import { Heatmap } from "./components/visuals/Heatmap";
import { KRITrendChart } from "./components/visuals/KRITrendChart";
import { ParetoChart } from "./components/visuals/ParetoChart";
import { IshikawaDiagram } from "./components/visuals/IshikawaDiagram";
import { FiveWhysFlow } from "./components/visuals/FiveWhysFlow";
import { SWOTGrid } from "./components/visuals/SWOTGrid";
import { SPRETZELRadial } from "./components/visuals/SPRETZELRadial";
import { StakeholderMatrix } from "./components/visuals/StakeholderMatrix";
import { RiskLifecycle } from "./components/visuals/RiskLifecycle";
import { ComplianceMapping } from "./components/visuals/ComplianceMapping";
// Home Dashboard
import { ExecutiveSummary } from "./components/home/ExecutiveSummary";
import { TopRisksPareto } from "./components/home/TopRisksPareto";
import { MiniHeatmap } from "./components/home/MiniHeatmap";
import { KRISnapshot } from "./components/home/KRISnapshot";
import { RootCauseInsights } from "./components/home/RootCauseInsights";
import { SWOTHighlights } from "./components/home/SWOTHighlights";
import { StakeholderOverview } from "./components/home/StakeholderOverview";
import { ComplianceStatus } from "./components/home/ComplianceStatus";
import { EmergingAlerts } from "./components/home/EmergingAlerts";
import { SPRETZELSnapshot } from "./components/home/SPRETZELSnapshot";

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    title: "RiskGuard ISO 31000",
    subtitle: "Enterprise Risk Management",
    assessment: "Assessment",
    matrix: "Risk Matrix",
    history: "History",
    signIn: "Sign In",
    signOut: "Sign Out",
    establishContext: "1. Establish Context",
    organization: "Organization Name",
    companyLogo: "Company Logo",
    scope: "Scope & Boundaries",
    frameworks: "Applicable Frameworks",
    riskAppetite: "Risk Appetite",
    process: "2–5. Identify, Analyze, Evaluate & Treat Risk",
    asset: "Asset / Process",
    threat: "Threat",
    vulnerability: "Vulnerability",
    riskStatement: "Risk Statement",
    inherentScoring: "Inherent Risk Scoring",
    likelihood: "Likelihood (1-5)",
    impact: "Impact (1-5)",
    score: "Score",
    level: "Level",
    existingControls: "Existing Controls",
    treatmentOption: "Treatment Option",
    status: "Status",
    treatmentPlan: "Treatment Plan",
    owner: "Owner",
    dueDate: "Due Date",
    addRisk: "Add to Risk Register",
    updateRisk: "Update Risk Item",
    aiSuggestion: "AI Suggestion",
    suggestMitigation: "Suggest Mitigation",
    riskRegisterTitle: "Risk Register",
    audit: "Audit & Compliance",
    evidence: "Evidence of Compliance",
    inherent: "Inherent",
    residual: "Residual",
    actions: "Actions",
    exportReports: "Export Reports",
    saveToCloud: "Save to Cloud",
    vision: "Doc Analysis",
    visionReview: "Document Review & Validation",
    uploadDoc: "Upload Document",
    analysisResults: "Analysis Results",
    templates: "Risk Templates",
    selectTemplate: "Select a Template",
    operational: "Operational Risk",
    ohsa: "OHSA (Health & Safety)",
    production: "Production / Industrial",
    financial: "Financial Risk",
    saudiStandards: "Saudi Standards (MHRSD, SASO, SAMA)",
    nca: "NCA Standards (ECC, CSCC, OT)",
    cybersecurity: "Cybersecurity (ISO 27001, PDPL, NDMO)",
    continuity: "Business Continuity (ISO 22301)",
    deployment: "Deployment",
    deploymentGuide: "Deployment & Operations Guide",
    dockerVersion: "Docker Version",
    dockerInstructions: "To run the application using Docker, use the following commands:",
    dockerEnvNote: "Ensure environment variables (Firebase API Key) are set in a .env file.",
    desktopVersion: "Desktop Version (Windows)",
    desktopInstructions: "To build the desktop version for Windows machines:",
    desktopNote: "The installer (.exe) will be generated in the dist-desktop folder.",
    importantNote: "Important Note",
    connectivityNote: "This application is designed to always connect to Firebase as a backend. In case of no connectivity, it will automatically use the Local LLM to provide risk mitigation suggestions based on a local knowledge base.",
    strategicIntelligence: "Strategic Intelligence",
    rootCauseAnalysis: "Root Cause Analysis (RCA)",
    ishikawa: "Ishikawa (Fishbone)",
    fiveWhys: "5 Whys Chain",
    spretzel: "SPRETZEL Framework",
    swot: "SWOT Strategic Matrix",
    stakeholders: "Stakeholder Management",
    complianceMapping: "Compliance Mapping",
    email: "Email",
    password: "Password",
    register: "Register",
    login: "Login",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    googleSignIn: "Sign in with Google",
    next: "Next",
    back: "Back",
    startAssessment: "Start Assessment",
    intelligence: "Strategic Intelligence",
    dashboard: "Strategic Command Dashboard",
    vitalFew: "Vital Few Analysis",
    riskDistribution: "Risk Distribution",
    kriTrend: "KRI Trend Alerts",
    strategicPulse: "Strategic Pulse",
    governanceReach: "Governance Reach",
    newAssessment: "New Assessment",
    exportReport: "Export Report",
    auditorsEye: "Auditor's Eye",
    complianceTarget: "Compliance Target",
    emergingAlerts: "Emerging Alerts",
    auditHeader: "Auditor's Eye - Intelligent Audit & Compliance",
    auditSubHeader: "Digital Compliance Evidence",
    auditUploadTitle: "Upload Supporting Evidence",
    auditUploadDesc: "Upload implementation documents, signed approvals, or photos of controls in place. The AI Auditor will validate signatures, stamps, and compliance details.",
    auditUploadPlaceholder: "Click to upload or drag & drop",
    auditAnalyzing: "Analyzing...",
    auditRunBtn: "Run Auditor's Eye",
    auditReportTitle: "Audit Report",
    auditNoReport: "No audit report generated yet.",
    auditDownloadBtn: "Download Audit Report",
    intelligenceHeader: "Advanced Risk Intelligence",
    intelligenceSubHeader: "Enterprise Strategic Dashboard",
    intelligenceSelectRisk: "Select a risk to view Deep Intelligence",
    intelligenceSelectDesc: "Specific visualizations (Ishikawa, SPRETZEL, SWOT) require a selected risk record from the register.",
    intelligenceBrowseBtn: "Browse Records",
    visionHeader: "Intelligent Document Analysis",
    visionSubHeader: "AI-Powered Review & Extraction",
    visionUploadDesc: "Upload an image of a document (e.g., ISO certificate, report, or policy) to analyze and extract potential risks.",
    visionAnalyzing: "Analyzing Document...",
    visionBtn: "Start AI Analysis",
    visionResultTitle: "Analysis Results",
    visionNoResult: "No analysis performed yet.",
    complianceTimeline: "Compliance Timeline & Reminders",
    noHighRisks: "No high-priority risks requiring immediate audit.",
    profile: "Profile",
    editProfile: "Edit Profile",
    deleteAccount: "Delete Account",
    accountDeleted: "Account Deleted",
    confirmDelete: "Are you sure you want to delete your account? This action cannot be undone.",
    updateSuccess: "Profile updated successfully!",
    photoUrl: "Photo URL",
    displayName: "Display Name"
  },
  ar: {
    title: "ريسك جارد ISO 31000",
    subtitle: "إدارة المخاطر المؤسسية",
    assessment: "التقييم",
    matrix: "مصفوفة المخاطر",
    history: "السجل",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    establishContext: "1. تحديد السياق",
    organization: "اسم المنظمة",
    companyLogo: "شعار الشركة",
    scope: "النطاق والحدود",
    frameworks: "الأطر المعمول بها",
    riskAppetite: "القدرة على تحمل المخاطر",
    process: "2-5. تحديد وتحليل وتقييم ومعالجة المخاطر",
    asset: "الأصل / العملية",
    threat: "التهديد",
    vulnerability: "نقطة الضعف",
    riskStatement: "بيان المخاطر",
    inherentScoring: "تقييم المخاطر المتأصلة",
    likelihood: "الاحتمالية (1-5)",
    impact: "الأثر (1-5)",
    score: "الدرجة",
    level: "المستوى",
    existingControls: "الضوابط الحالية",
    treatmentOption: "خيار المعالجة",
    status: "الحالة",
    treatmentPlan: "خطة المعالجة",
    owner: "المالك",
    dueDate: "تاريخ الاستحقاق",
    addRisk: "إضافة إلى سجل المخاطر",
    updateRisk: "تحديث بند المخاطر",
    aiSuggestion: "اقتراح الذكاء الاصطناعي",
    suggestMitigation: "اقتراح معالجة",
    riskRegisterTitle: "سجل المخاطر",
    audit: "التدقيق والامتثال",
    evidence: "أدلة الامتثال",
    inherent: "المتأصلة",
    residual: "المتبقية",
    actions: "الإجراءات",
    exportReports: "تصدير التقارير",
    saveToCloud: "حفظ في السحابة",
    vision: "تحليل الوثائق",
    visionReview: "مراجعة وتحقق الوثائق",
    uploadDoc: "تحميل الوثيقة",
    analysisResults: "نتائج التحليل",
    templates: "قوالب المخاطر",
    selectTemplate: "اختر قالباً",
    operational: "المخاطر التشغيلية",
    ohsa: "الصحة والسلامة المهنية (OHSA)",
    production: "الإنتاج / الصناعة",
    financial: "المخاطر المالية",
    saudiStandards: "المعايير السعودية (MHRSD, SASO, SAMA)",
    nca: "معايير الهيئة الوطنية للأمن السيبراني (ECC, CSCC, OT)",
    cybersecurity: "الأمن السيبراني (ISO 27001, PDPL, NDMO)",
    continuity: "استمرارية الأعمال (ISO 22301)",
    deployment: "النشر",
    deploymentGuide: "تعليمات النشر والتشغيل",
    dockerVersion: "نسخة دوكر (Docker)",
    dockerInstructions: "لتشغيل التطبيق باستخدام Docker، استخدم الأوامر التالية:",
    dockerEnvNote: "تأكد من إعداد متغيرات البيئة (Firebase API Key) في ملف .env",
    desktopVersion: "نسخة سطح المكتب (Windows)",
    desktopInstructions: "لبناء نسخة سطح المكتب لنظام ويندوز:",
    desktopNote: "سيتم إنشاء ملف التثبيت (.exe) في مجلد dist-desktop.",
    importantNote: "ملاحظة هامة",
    connectivityNote: "هذا التطبيق مصمم ليعمل دائماً مع Firebase كخلفية برمجية. في حالة عدم وجود اتصال بالإنترنت، سيقوم التطبيق تلقائياً بالتحول إلى وضع \"Local LLM\" لتقديم توصيات التخفيف من المخاطر بناءً على قاعدة معرفية محلية.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    register: "تسجيل",
    login: "دخول",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    googleSignIn: "تسجيل الدخول باستخدام جوجل",
    next: "التالي",
    back: "السابق",
    startAssessment: "بدء التقييم",
    intelligence: "الذكاء الاستراتيجي",
    dashboard: "لوحة القيادة الإستراتيجية",
    vitalFew: "تحليل القلة الحيوية",
    riskDistribution: "توزيع المخاطر",
    kriTrend: "التحليل التنبؤي",
    strategicPulse: "النبض الاستراتيجي",
    governanceReach: "نطاق الحوكمة",
    newAssessment: "تقييم جديد",
    exportReport: "تصدير التقرير",
    auditorsEye: "عين المدقق",
    complianceTarget: "هدف الامتثال",
    emergingAlerts: "التنبيهات الناشئة",
    auditHeader: "عين المدقق - التدقيق والامتثال الذكي",
    auditSubHeader: "أدلة الامتثال الرقمية",
    auditUploadTitle: "تحميل أدلة الإثبات",
    auditUploadDesc: "قم بتحميل وثائق التنفيذ، أو الموافقات الموقعة، أو صور الضوابط المطبقة. سيقوم مدقق الذكاء الاصطناعي بالتحقق من التوقيعات والأختام وتفاصيل الامتثال.",
    auditUploadPlaceholder: "انقر للتحميل أو سحب وإسقاط الملفات",
    auditAnalyzing: "جاري التحليل...",
    auditRunBtn: "تشغيل عين المدقق",
    auditReportTitle: "تقرير التدقيق",
    auditNoReport: "لم يتم إنشاء تقرير تدقيق بعد.",
    auditDownloadBtn: "تحميل تقرير التدقيق",
    intelligenceHeader: "الذكاء المتقدم للمخاطر",
    intelligenceSubHeader: "لوحة القيادة الاستراتيجية للمؤسسة",
    intelligenceSelectRisk: "اختر مخاطرة لعرض الذكاء العميق",
    intelligenceSelectDesc: "تتطلب التصورات المحددة (إيشيكاوا، SPRETZEL، SWOT) اختيار سجل مخاطر من السجل.",
    intelligenceBrowseBtn: "تصفح السجلات",
    visionHeader: "تحليل الوثائق الذكي",
    visionSubHeader: "مراجعة وتحليل الوثائق بالذكاء الاصطناعي",
    visionUploadDesc: "قم بتحميل صورة للوثيقة (مثل شهادة ISO، تقرير فحص، أو سياسة) لتحليلها واستخراج المخاطر المحتملة.",
    visionAnalyzing: "جاري تحليل الوثيقة...",
    visionBtn: "بدء التحليل الذكي",
    visionResultTitle: "نتائج التحليل",
    visionNoResult: "لم يتم إجراء تحليل بعد.",
    complianceTimeline: "الجدول الزمني للامتثال والتنبيهات",
    noHighRisks: "لا توجد مخاطر عالية الأولوية تتطلب تدقيقاً فورياً.",
    profile: "الملف الشخصي",
    editProfile: "تعديل الملف الشخصي",
    deleteAccount: "حذف الحساب",
    accountDeleted: "تم حذف الحساب",
    confirmDelete: "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
    updateSuccess: "تم تحديث الملف الشخصي بنجاح!",
    photoUrl: "رابط الصورة",
    displayName: "الاسم المعروض"
  }
};

import { RISK_TEMPLATES } from "./data/riskTemplates";

// --- TYPES ---
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type RiskStatus = "Open" | "In Progress" | "Mitigated" | "Closed";
export type TreatmentOption = "Avoid" | "Mitigate" | "Transfer" | "Accept";

export interface RiskItem {
  id: string;
  asset: string;
  asset_ar: string;
  threat: string;
  threat_ar: string;
  vulnerability: string;
  vulnerability_ar: string;
  riskStatement: string;
  riskStatement_ar: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  score: number;      // likelihood * impact
  level: RiskLevel;
  existingControls: string;
  existingControls_ar: string;
  treatmentOption: TreatmentOption;
  treatmentPlan: string;
  treatmentPlan_ar: string;
  owner: string;
  dueDate: string;
  status: RiskStatus;
  residualLikelihood: number;
  residualImpact: number;
  residualScore: number;
  residualLevel: RiskLevel;
  aiMitigation?: string;
  aiMitigation_ar?: string;
  // SPRETZEL Framework
  spretzel?: {
    people: string;
    resources: string;
    legal: string;
    opportunities: string;
    technology: string;
    strategy: string;
    engagement: string;
    lifecycle: string;
    marketing: string;
  };
  // Stakeholder Layer
  stakeholders?: {
    internal: string;
    external: string;
    influence: 'Low' | 'Medium' | 'High';
    interest: 'Low' | 'Medium' | 'High';
  };
  // Root Cause Analysis (RCA) - 5 Whys & Ishikawa
  rca?: {
    fiveWhys: string[];
    ishikawa: {
      people: string;
      process: string;
      technology: string;
      environment: string;
      management: string;
    };
    primaryRootCause: string;
    aiConfidence: number;
    explanation: string;
  };
  // SWOT Analysis
  swot?: {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
    strategicActions: string[];
  };
  // Compliance Mapping
  compliance?: {
    iso27001?: string;
    nca_ecc?: string;
    nist?: string;
    gaap_score: number;
  };
  // Enhanced Description Layer (NEW)
  enhancedDescription?: {
    riskStatement: string;
    context: string;
    impactDescription: string;
    likelihoodReasoning: string;
    aiSuggestions?: string;
  };
  // Key Risk Indicators (KRI) Layer (NEW)
  kri?: {
    indicator: string;
    threshold: number;
    currentValue: number;
    trend: 'up' | 'down' | 'stable';
    alertLevel: 'Normal' | 'Warning' | 'Critical';
    history: { date: string; value: number }[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentContext {
  organization: string;
  logoUrl?: string;
  scope: string;
  frameworks: string[];
  risk_appetite: string;
}

// --- UTILS ---
const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 20) return "Critical";
  if (score >= 12) return "High";
  if (score >= 5) return "Medium";
  return "Low";
};

const getLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case "Critical": return "text-red-500 bg-red-500/10 border-red-500/50";
    case "High": return "text-orange-500 bg-orange-500/10 border-orange-500/50";
    case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/50";
    case "Low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/50";
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/50";
  }
};

// --- ERROR HANDLING ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState;
  props: ErrorBoundaryProps;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let displayMessage = "An unexpected error occurred.";
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.operationType) {
          displayMessage = `Firebase Error (${parsed.operationType}): ${parsed.error}`;
        }
      } catch (e) {
        displayMessage = error.message || String(error);
      }
      return (
        <div className="p-6 bg-red-900/20 border border-red-900/30 rounded-xl text-center">
          <h2 className="text-base font-normal text-red-400 mb-2">Application Error</h2>
          <p className="text-slate-300 mb-4">{displayMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- MAIN APP ---
const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [hasValidLicense, setHasValidLicense] = useState<boolean>(false);
  const [showLicenseGate, setShowLicenseGate] = useState<boolean>(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [adminUsersReg, setAdminUsersReg] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; photo_file_name: string } | null>(null);

  // --- AUTH HANDLERS ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleCreateTenant = async () => {
    if (!user || !companyName) {
      alert("Company name is required.");
      return;
    }
    setIsTenantLoading(true);
    try {
      const tenantId = companyName.toLowerCase().replace(/\s+/g, '-');
      const databaseId = `db-${tenantId}`;
      
      await setDoc(doc(masterDb, "tenants", tenantId), {
        name: companyName,
        databaseId: databaseId,
        logoUrl: companyLogoUrl,
        ownerUid: user.uid,
        createdAt: new Date().toISOString()
      });

      await setDoc(doc(masterDb, "users", user.uid), {
        name: user.displayName || companyName,
        email: user.email,
        tenantId: tenantId,
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const tenantInfo = { id: tenantId, name: companyName, databaseId: databaseId };
      setTenant(tenantInfo);
      setContext(prev => ({ 
        ...prev, 
        organization: companyName,
        logoUrl: companyLogoUrl || prev.logoUrl 
      }));
      const tDb = getTenantDb(databaseId);
      setTenantDb(tDb);

      await setDoc(doc(tDb, "users", user.uid), {
        name: user.displayName || companyName,
        email: user.email,
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      alert("Secure company database created successfully!");
    } catch (err: any) {
      console.error("Error creating tenant:", err);
      alert("Failed to create secure database: " + err.message);
    } finally {
      setIsTenantLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      let u: User;
      if (isRegistering) {
        if (!companyName) {
          setAuthError("Company name is required for registration.");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        u = userCredential.user;

        const tenantId = companyName.toLowerCase().replace(/\s+/g, '-');
        const databaseId = `db-${tenantId}`;
        
        await setDoc(doc(masterDb, "tenants", tenantId), {
          name: companyName,
          databaseId: databaseId,
          logoUrl: companyLogoUrl,
          ownerUid: u.uid,
          createdAt: new Date().toISOString()
        });

        await setDoc(doc(masterDb, "users", u.uid), {
          name: u.displayName || companyName,
          email: u.email,
          tenantId: tenantId,
          role: 'admin',
          updatedAt: new Date().toISOString()
        });

        const tenantInfo = { id: tenantId, name: companyName, databaseId: databaseId };
        setTenant(tenantInfo);
        setContext(prev => ({ 
          ...prev, 
          organization: companyName,
          logoUrl: companyLogoUrl || prev.logoUrl 
        }));
        const tDb = getTenantDb(databaseId);
        setTenantDb(tDb);

        await setDoc(doc(tDb, "users", u.uid), {
          name: u.displayName || companyName,
          email: u.email,
          role: 'admin',
          updatedAt: new Date().toISOString()
        });

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        u = userCredential.user;
      }
      setShowAuthModal(false);
    } catch (err: any) {
      console.error("Critical Auth Failure:", err);
      let msg = err.message;
      if (err.code === 'auth/unauthorized-domain') {
        msg = "DOMAIN AUTHORIZATION REQUIRED: The domain '" + (typeof window !== 'undefined' ? window.location.hostname : 'this domain') + "' is not whitelisted in Firebase. Add it in Firebase Console > Auth > Settings > Authorized Domains.";
      } else if (err.code === 'auth/invalid-credential') {
        msg = "INVALID CREDENTIALS: The email or password provided is incorrect. Please verify your login details. If you are sure they are correct, check if the Firebase API Key is restricted in the Google Cloud Console.";
      } else {
        msg = `System Error [${err.code}]: ${err.message}`;
      }
      setAuthError(msg);
    }
  };

  // App State
  const [context, setContext] = useState<AssessmentContext>(() => {
    try {
      const saved = localStorage.getItem('risk_guard_context');
      return saved ? JSON.parse(saved) : {
        organization: "",
        logoUrl: "",
        scope: "",
        frameworks: [],
        risk_appetite: ""
      };
    } catch (e) {
      return { organization: "", logoUrl: "", scope: "", frameworks: [], risk_appetite: "" };
    }
  });
  const [contextStep, setContextStep] = useState(1);

  const [riskRegister, setRiskRegister] = useState<RiskItem[]>(() => {
    try {
      const saved = localStorage.getItem('risk_guard_register');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('risk_guard_context', JSON.stringify(context));
  }, [context]);

  useEffect(() => {
    localStorage.setItem('risk_guard_register', JSON.stringify(riskRegister));
  }, [riskRegister]);

  // Sync Context to Firestore (Account Persistence)
  useEffect(() => {
    if (user && context.organization) {
      const timeout = setTimeout(() => {
        const userRef = doc(masterDb, "users", user.uid);
        updateDoc(userRef, {
          lastContext: context,
          updatedAt: new Date().toISOString()
        }).catch(e => console.error("Context Auto-Sync Error:", e));
      }, 3000); // 3s debounce
      return () => clearTimeout(timeout);
    }
  }, [context, user]);

  const [selectedRiskIndex, setSelectedRiskIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'landing' | 'assessment' | 'matrix' | 'analytics' | 'history' | 'audit' | 'vision' | 'deployment' | 'profile'>('landing');
  const [assessmentView, setAssessmentView] = useState<'core' | 'advanced'>('core');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = TRANSLATIONS[lang];

  // Form State
  const [formData, setFormData] = useState<Partial<RiskItem>>({
    asset: "",
    asset_ar: "",
    threat: "",
    threat_ar: "",
    vulnerability: "",
    vulnerability_ar: "",
    riskStatement: "",
    riskStatement_ar: "",
    likelihood: 3,
    impact: 3,
    existingControls: "",
    existingControls_ar: "",
    treatmentOption: "Mitigate",
    treatmentPlan: "",
    treatmentPlan_ar: "",
    owner: "",
    dueDate: new Date().toISOString().split('T')[0],
    status: "Open",
    residualLikelihood: 2,
    residualImpact: 2,
    spretzel: { people: "", resources: "", legal: "", opportunities: "", technology: "", strategy: "", engagement: "", lifecycle: "", marketing: "" },
    stakeholders: { internal: "", external: "", influence: 'Medium', interest: 'Medium' },
    rca: { fiveWhys: ["", "", "", "", ""], ishikawa: { people: "", process: "", technology: "", environment: "", management: "" }, primaryRootCause: "", aiConfidence: 0.85, explanation: "" },
    swot: { strengths: "", weaknesses: "", opportunities: "", threats: "", strategicActions: [] },
    enhancedDescription: { riskStatement: "", context: "", impactDescription: "", likelihoodReasoning: "", aiSuggestions: "" },
    kri: { indicator: "", threshold: 0, currentValue: 0, trend: 'stable', alertLevel: 'Normal', history: [] }
  });

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [isGeneratingRisks, setIsGeneratingRisks] = useState(false);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  const loadFullLibrary = async () => {
    if (context.frameworks.length === 0) {
      alert(lang === 'ar' ? "يرجى اختيار إطار عمل أولاً." : "Please select a framework first.");
      return;
    }

    setIsLoadingLibrary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const selectedFrameworks = context.frameworks.join(', ');
      
      const prompt = `Generate a comprehensive risk register library for the following frameworks: ${selectedFrameworks}.
      For EACH framework, provide at least 100 unique and realistic risk items.
      Return the result as a single JSON array of objects with these fields:
      asset (string), asset_ar (string), threat (string), threat_ar (string), 
      vulnerability (string), vulnerability_ar (string), riskStatement (string), riskStatement_ar (string), 
      likelihood (number 1-5), impact (number 1-5), framework (string).
      Ensure the risks are highly specific to the frameworks and include accurate Arabic translations.
      Provide ONLY the JSON array. Do not include any other text or markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json\n?|```/g, '').trim();

      const libraryRisks = JSON.parse(text);
      const formattedRisks: RiskItem[] = libraryRisks.filter((r: any) => r).map((r: any, i: number) => {
        const likelihood = r.likelihood || 3;
        const impact = r.impact || 3;
        const score = likelihood * impact;
        return {
          ...r,
          id: `LIB-${Date.now()}-${i}`,
          likelihood,
          impact,
          score,
          level: getRiskLevel(score),
          status: "Open",
          owner: "TBD",
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          existingControls: "Library Standard Controls",
          existingControls_ar: "ضوابط المكتبة القياسية",
          residualScore: score,
          residualLevel: getRiskLevel(score),
          treatmentOption: "Mitigate",
          treatmentPlan: "Standard treatment based on framework guidelines.",
          treatmentPlan_ar: "معالجة قياسية بناءً على إرشادات إطار العمل."
        };
      });

      setRiskRegister(prev => [...prev, ...formattedRisks]);

      // Automatic Cloud Sync for Account Persistence
      if (user && tenantDb) {
        const { writeBatch, doc } = await import("firebase/firestore");
        const batch = writeBatch(tenantDb);
        formattedRisks.forEach(risk => {
          const riskData = formatRiskForFirestore(risk);
          const riskRef = doc(tenantDb, "risks", risk.id);
          batch.set(riskRef, {
            ...riskData,
            uid: user.uid,
            createdAt: new Date().toISOString()
          }, { merge: true });
        });
        await batch.commit();
      }

      alert(lang === 'ar' ? `تم تحميل ${formattedRisks.length} مخاطر من المكتبة وتخزينها سحابياً.` : `Loaded ${formattedRisks.length} risks from the library and saved to cloud.`);
    } catch (err: any) {
      console.error("Library Load Error:", err);
      alert(lang === 'ar' ? "فشل تحميل المكتبة. يرجى المحاولة مرة أخرى." : "Failed to load library. Please try again.");
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const [useLocalLlm, setUseLocalLlm] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatRiskForFirestore = (risk: RiskItem) => {
    if (!risk) return {};
    return {
      risk_id: risk.id || `R-${Date.now()}`,
      asset: risk.asset || "",
      asset_ar: risk.asset_ar || "",
      threat: risk.threat || "",
      threat_ar: risk.threat_ar || "",
      vulnerability: risk.vulnerability || "",
      vulnerability_ar: risk.vulnerability_ar || "",
      risk_statement: risk.riskStatement || "",
      risk_statement_ar: risk.riskStatement_ar || "",
      likelihood_score: risk.likelihood || 3,
      impact_score: risk.impact || 3,
      inherent_risk: risk.score || 9,
      risk_level: risk.level || "Medium",
      existing_controls: risk.existingControls || "",
      existing_controls_ar: risk.existingControls_ar || "",
      treatment_option: risk.treatmentOption || "Mitigate",
      treatment_details: risk.treatmentPlan || "",
      treatment_details_ar: risk.treatmentPlan_ar || "",
      action_owner: risk.owner || "TBD",
      timeline: risk.dueDate || "",
      status: risk.status || "Open",
      residual_likelihood: risk.residualLikelihood || risk.likelihood || 2,
      residual_impact: risk.residualImpact || risk.impact || 2,
      residual_risk: risk.residualScore || 4,
      mitigation_actions: risk.aiMitigation || "",
      spretzel: risk.spretzel || null,
      stakeholders: risk.stakeholders || null,
      rca: risk.rca || null,
      swot: risk.swot || null,
      enhancedDescription: risk.enhancedDescription || null,
      kri: risk.kri || null,
      uid: user?.uid,
      updatedAt: new Date().toISOString()
    };
  };

  const generateAIRisks = async () => {
    if (!context.frameworks) {
      alert("Please select a framework first.");
      return;
    }

    setIsGeneratingRisks(true);
    let text = "";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Generate 100 realistic risk assessment items for the ${context.frameworks} framework. 
      Return the result as a JSON array of objects with these fields:
      asset (string), asset_ar (string), threat (string), threat_ar (string), 
      vulnerability (string), vulnerability_ar (string), riskStatement (string), riskStatement_ar (string), 
      likelihood (number 1-5), impact (number 1-5).
      Ensure the risks are specific to ${context.frameworks} and include Arabic translations.
      Provide ONLY the JSON array. Do not include any other text or markdown formatting.`;

      if (useLocalLlm || isOffline) {
        // Fallback/Mock for "Local LLM" or Offline
        text = JSON.stringify(Array.from({ length: 20 }).map((_, i) => ({
          asset: `Asset ${i + 1}`,
          asset_ar: `الأصل ${i + 1}`,
          threat: `Threat ${i + 1}`,
          threat_ar: `التهديد ${i + 1}`,
          vulnerability: `Vulnerability ${i + 1}`,
          vulnerability_ar: `الثغرة ${i + 1}`,
          riskStatement: `Risk statement for asset ${i + 1} under ${context.frameworks}`,
          riskStatement_ar: `بيان المخاطر للأصل ${i + 1} تحت إطار ${context.frameworks}`,
          likelihood: Math.floor(Math.random() * 5) + 1,
          impact: Math.floor(Math.random() * 5) + 1
        })));
      } else {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text().replace(/```json\n?|```/g, '').trim();
      }

      const newRisks = JSON.parse(text.replace(/```json\n?|```/g, ''));
      const formattedRisks: RiskItem[] = newRisks.map((r: any, i: number) => {
        const score = r.likelihood * r.impact;
        return {
          ...r,
          id: `AI-${Date.now()}-${i}`,
          score,
          level: getRiskLevel(score),
          status: "Open",
          owner: "TBD",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          existingControls: "Pending Review",
          existingControls_ar: "قيد المراجعة",
          residualScore: score,
          residualLevel: getRiskLevel(score),
          treatmentOption: "Mitigate",
          treatmentPlan: "AI Suggested: Review and implement controls.",
          treatmentPlan_ar: "مقترح الذكاء الاصطناعي: مراجعة وتنفيذ الضوابط."
        };
      });

      setRiskRegister(prev => [...prev, ...formattedRisks]);
      
      if (user && tenantDb) {
        // Automatic Cloud Sync
        const { writeBatch, doc } = await import("firebase/firestore");
        const batch = writeBatch(tenantDb);
        formattedRisks.forEach(risk => {
          const riskData = formatRiskForFirestore(risk);
          const riskRef = doc(tenantDb, "risks", risk.id);
          batch.set(riskRef, {
            ...riskData,
            uid: user.uid,
            createdAt: new Date().toISOString()
          }, { merge: true });
        });
        await batch.commit();
      }
    } catch (error) {
      console.error("Error generating risks:", error);
      alert("Failed to generate risks. Please try again.");
    } finally {
      setIsGeneratingRisks(false);
    }
  };

  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const isLiveConnectedRef = useRef(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [tenant, setTenant] = useState<{ id: string, name: string, databaseId: string } | null>(null);
  const [tenantDb, setTenantDb] = useState<Firestore>(masterDb);
  const [isTenantLoading, setIsTenantLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  // --- VISION MONITORING ---
  useEffect(() => {
    let interval: any;
    if (isLiveConnected && liveSessionRef.current) {
      interval = setInterval(async () => {
        const appElement = document.getElementById('root');
        if (appElement && liveSessionRef.current) {
          try {
            const canvas = await html2canvas(appElement, {
              scale: 0.4,
              logging: false,
              useCORS: true
            });
            const base64Data = canvas.toDataURL('image/jpeg', 0.4).split(',')[1];
            if (liveSessionRef.current) {
              liveSessionRef.current.sendRealtimeInput({
                video: { data: base64Data, mimeType: 'image/jpeg' }
              });
            }
          } catch (e) {
            // Silent fail for vision frames
          }
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLiveConnected]);
  const [auditEvidence, setAuditEvidence] = useState<string | null>(null);
  const auditEvidenceRef = useRef<string | null>(null);
  const [auditMimeType, setAuditMimeType] = useState<string>("image/jpeg");
  const auditMimeTypeRef = useRef<string>("image/jpeg");
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [historyRisks, setHistoryRisks] = useState<RiskItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Admin State
  const [adminLicenses, setAdminLicenses] = useState<any[]>([]);

  // Vision State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionMimeType, setVisionMimeType] = useState<string>("image/jpeg");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  const analyzeDocument = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setVisionError(null);
    setVisionResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Analyze this document image for risk assessment purposes. 
              1. Extract key information (Asset, Threat, Vulnerability).
              2. Review the document for compliance with ${context.frameworks.join(', ')}.
              3. Validate if the information provided is sufficient for a risk assessment.
              4. Suggest potential risks or improvements.
              Provide the response in a structured markdown format. Use ${lang === 'ar' ? 'Arabic' : 'English'} for the analysis.` },
              { inlineData: { data: base64Data, mimeType: visionMimeType } }
            ]
          }
        ]
      });

      setVisionResult(response.text || "No analysis result returned.");
    } catch (err: any) {
      console.error("Vision Analysis Error:", err);
      setVisionError(err.message || "Failed to analyze document.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVisionMimeType(file.type || "image/jpeg");
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'history') {
      fetchHistory();
    }
  }, [user, activeTab]);

  const fetchHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const q = query(collection(tenantDb, "risks"));
      const querySnapshot = await getDocs(q);
      const risks: RiskItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        risks.push({
          id: data.risk_id || doc.id,
          asset: data.asset,
          asset_ar: data.asset_ar || "",
          threat: data.threat,
          threat_ar: data.threat_ar || "",
          vulnerability: data.vulnerability,
          vulnerability_ar: data.vulnerability_ar || "",
          riskStatement: data.risk_statement,
          riskStatement_ar: data.risk_statement_ar || "",
          likelihood: data.likelihood_score,
          impact: data.impact_score,
          score: data.inherent_risk,
          level: data.risk_level,
          existingControls: data.existing_controls,
          existingControls_ar: data.existing_controls_ar || "",
          treatmentOption: data.treatment_option,
          treatmentPlan: data.treatment_details,
          treatmentPlan_ar: data.treatment_details_ar || "",
          owner: data.action_owner,
          dueDate: data.timeline,
          status: data.status,
          residualLikelihood: data.residual_likelihood || data.likelihood_score,
          residualImpact: data.residual_impact || data.impact_score,
          residualScore: data.residual_risk,
          residualLevel: getRiskLevel(data.residual_risk),
          aiMitigation: data.mitigation_actions || "",
          rca: data.rca || null,
          swot: data.swot || null,
          spretzel: data.spretzel || null,
          enhancedDescription: data.enhancedDescription || null,
          kri: data.kri || null,
          stakeholders: data.stakeholders || null,
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      // Perform JS-level sort to avoid Firestore index requirement failures
      risks.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      const allRisksMap = new Map();
      [...risks, ...riskRegister].forEach(r => allRisksMap.set(r.id, r));
      const mergedRisks = Array.from(allRisksMap.values()).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      setHistoryRisks(mergedRisks);
    } catch (err) {
      console.error("Firestore history fetch failed. Falling back to local state.", err);
      // Fallback to local state so the app doesn't freeze on Loading History...
      const localRisks = [...riskRegister].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setHistoryRisks(localRisks);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (!isLiveConnected) {
      setActiveVoiceField(null);
    }
  }, [isLiveConnected]);

  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

  const stopAudio = () => {
    audioQueueRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    audioQueueRef.current = [];

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    nextStartTimeRef.current = 0;
  };

  const testAudio = () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
    alert("Test tone played. If you didn't hear it, check your speakers and browser permissions.");
  };

  const playAudioChunk = (base64Data: string, sampleRate: number = 24000) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      nextStartTimeRef.current = audioContextRef.current.currentTime;
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => console.error("Resume error:", e));
    }

    try {
      const binary = atob(base64Data);
      const buffer = new ArrayBuffer(binary.length);
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      
      const alignedLength = Math.floor(buffer.byteLength / 2) * 2;
      const pcmData = new Int16Array(buffer.slice(0, alignedLength));
      const floatData = new Float32Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) floatData[i] = pcmData[i] / 32768;

      const audioBuffer = ctx.createBuffer(1, floatData.length, sampleRate);
      audioBuffer.getChannelData(0).set(floatData);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
      audioQueueRef.current.push(source);
      
      source.onended = () => {
        audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
      };
    } catch (err) {
      console.error("Play Error:", err);
    }
  };

  const startMic = (session: any, stream: MediaStream) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    streamRef.current = stream;
    setIsMicActive(true);
    
    const source = ctx.createMediaStreamSource(stream);
    
    // Setup Analyser for visual feedback
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateVolume = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setMicVolume(average / 128); // Normalize to 0-1
      if (isMicActive) requestAnimationFrame(updateVolume);
    };
    updateVolume();

    // Use a smaller buffer for lower latency
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (!liveSessionRef.current || !isLiveConnectedRef.current) return;
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Resample to 16000
      const ratio = ctx.sampleRate / 16000;
      const newLength = Math.floor(inputData.length / ratio);
      const pcm16 = new Int16Array(newLength);
      
      for (let i = 0; i < newLength; i++) {
        const sampleIndex = Math.floor(i * ratio);
        const s = Math.max(-1, Math.min(1, inputData[sampleIndex]));
        pcm16[i] = Math.round(s < 0 ? s * 0x8000 : s * 0x7FFF);
      }
      
      // Efficient base64 conversion
      const uint8 = new Uint8Array(pcm16.buffer);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
      }
      const base64 = btoa(binary);
      
      try {
        if (liveSessionRef.current && liveSessionRef.current.sendRealtimeInput) {
          liveSessionRef.current.sendRealtimeInput({
            audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      } catch (err) {
        console.error("Send Error:", err);
      }
    };

    source.connect(processor);
    const gain = ctx.createGain();
    gain.gain.value = 0; // Silent but connected
    processor.connect(gain);
    gain.connect(ctx.destination);
  };

  // --- EFFECTS ---
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(masterDb, 'test', 'connection'));
        console.log("Firebase Connection: Success");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase Connection: Failed (Client is offline). Please check your configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        setIsTenantLoading(true);
        try {
          const userDoc = await getDoc(doc(masterDb, "users", u.uid));
          const userData = userDoc.data();
          if (userData) {
            setUserProfile({
              name: userData.name || u.displayName || "",
              email: userData.email || u.email || "",
              photo_file_name: userData.photo_file_name || u.photoURL || ""
            });
            
            // Check if user is missing essential fields and update
            if (!userData.name || !userData.email || !userData.photo_file_name) {
              await updateDoc(doc(masterDb, "users", u.uid), {
                name: userData.name || u.displayName || "Anonymous",
                email: userData.email || u.email || "",
                photo_file_name: userData.photo_file_name || u.photoURL || "",
                updatedAt: new Date().toISOString()
              });
            }
          } else {
            // Register new user doc if missing
            const newProfile = {
              name: u.displayName || "Anonymous",
              email: u.email || "",
              photo_file_name: u.photoURL || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(doc(masterDb, "users", u.uid), newProfile);
            setUserProfile({
              name: newProfile.name,
              email: newProfile.email,
              photo_file_name: newProfile.photo_file_name
            });
          }

          let isSysAdmin = (u.email?.toLowerCase() === 'aaroomi@gmail.com' || u.email?.toLowerCase() === 'admin@metaworks.com');
          let isValidLicense = isSysAdmin;

          if (!isSysAdmin && userData?.licenseKey) {
            const lDoc = await getDoc(doc(masterDb, "licenses", userData.licenseKey));
            if (lDoc.exists() && new Date(lDoc.data()?.expiresAt) > new Date()) {
              isValidLicense = true;
            }
          }

          setHasValidLicense(isValidLicense);
          setShowLicenseGate(!isValidLicense);

          if (userData?.tenantId) {
            const tenantDoc = await getDoc(doc(masterDb, "tenants", userData.tenantId));
            if (tenantDoc.exists()) {
              const tData = tenantDoc.data();
              setTenant({ id: tenantDoc.id, name: tData.name, databaseId: tData.databaseId });
              setTenantDb(getTenantDb(tData.databaseId));
              
              // Hydrate context
              if (userData.lastContext) {
                setContext(prev => ({ 
                  ...prev, 
                  ...userData.lastContext,
                  organization: tData.name || userData.lastContext.organization
                }));
              }
            }
          }
        } catch (err) {
          console.error("Auth hydration error:", err);
        } finally {
          setIsTenantLoading(false);
        }
      } else {
        setTenant(null);
        setUserProfile(null);
        setTenantDb(masterDb);
      }
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dedicated Risk Sync Effect
  useEffect(() => {
    if (!user || !tenant || !tenantDb || tenantDb === masterDb) return;

    console.log("Starting Real-time Sync for Account:", user.email);
    const q = query(collection(tenantDb, "risks"), limit(500));
    const unsub = onSnapshot(q, (snapshot) => {
      const risks: RiskItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.risk_id || doc.id,
          asset: data.asset || data.asset_category || "",
          asset_ar: data.asset_ar || "",
          threat: data.threat || data.threat_text || "",
          threat_ar: data.threat_ar || "",
          vulnerability: data.vulnerability || "",
          vulnerability_ar: data.vulnerability_ar || "",
          riskStatement: data.riskStatement || data.risk_statement || "",
          riskStatement_ar: data.riskStatement_ar || data.risk_statement_ar || "",
          likelihood: Number(data.likelihood || data.likelihood_score || 3),
          impact: Number(data.impact || data.impact_score || 3),
          score: Number(data.score || data.inherent_risk || 9),
          level: data.level || data.risk_level || "Medium",
          existingControls: data.existingControls || data.existing_controls || "",
          existingControls_ar: data.existingControls_ar || data.existing_controls_ar || "",
          treatmentOption: data.treatmentOption || data.treatment_option || "Mitigate",
          treatmentPlan: data.treatmentPlan || data.treatment_details || data.mitigation_actions || "",
          treatmentPlan_ar: data.treatmentPlan_ar || data.treatment_details_ar || "",
          owner: data.owner || data.action_owner || "",
          dueDate: data.dueDate || data.timeline || "",
          status: data.status || "Open",
          residualLikelihood: Number(data.residualLikelihood || data.residual_likelihood || 2),
          residualImpact: Number(data.residualImpact || data.residual_impact || 2),
          residualScore: Number(data.residualScore || data.residual_risk || 4),
          residualLevel: data.residualLevel || data.residual_risk_level || "Low",
          aiMitigation: data.aiMitigation || data.mitigation_actions || "",
          // Advanced Strategic Data
          spretzel: data.spretzel || undefined,
          rca: data.rca || undefined,
          swot: data.swot || undefined,
          compliance: data.compliance || undefined,
          stakeholders: data.stakeholders || undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as RiskItem;
      });
      risks.sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      
      setRiskRegister(current => {
        // If cloud is empty but we have local work, preserve local but mark for sync
        if (risks.length === 0 && !snapshot.metadata.fromCache && current.length > 0) {
          return current;
        }
        // Merge Cloud & Local (Cloud wins on ID conflict)
        const mergedMap = new Map();
        current.forEach(r => mergedMap.set(r.id, r));
        risks.forEach(r => mergedMap.set(r.id, r));
        return Array.from(mergedMap.values()) as RiskItem[];
      });
    }, (err) => {
      console.error("Sync Error:", err);
      if (err.code === 'permission-denied') {
        alert("Database access denied. Please check your account permissions.");
      }
    });

    return () => unsub();
  }, [user, tenant, tenantDb]);

  useEffect(() => {
     if (activeTab === 'admin' && user && (user.email?.toLowerCase() === 'aaroomi@gmail.com' || user.email?.toLowerCase() === 'admin@metaworks.com')) {
        const fetchAllUsers = async () => {
           try {
             const uSnap = await getDocs(collection(masterDb, 'users'));
             setAdminUsersReg(uSnap.docs.map(d => ({uid: d.id, ...d.data()})));
           } catch(e) {
             console.error("Failed fetching users: ", e);
           }
        };
        fetchAllUsers();
     }
  }, [activeTab, user]);

  const loadLatestAssessment = async (uid: string, currentDb: Firestore = tenantDb) => {
    try {
      // Risks are stored in tenant database
      const q = query(collection(currentDb, "risks"), orderBy("createdAt", "desc"), limit(50));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const risks: RiskItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            asset: data.asset || "",
            asset_ar: data.asset_ar || "",
            threat: data.threat || "",
            threat_ar: data.threat_ar || "",
            vulnerability: data.vulnerability || "",
            vulnerability_ar: data.vulnerability_ar || "",
            riskStatement: data.riskStatement || data.risk_statement || "",
            riskStatement_ar: data.riskStatement_ar || "",
            likelihood: data.likelihood || data.likelihood_score || 3,
            impact: data.impact || data.impact_score || 3,
            score: data.score || data.inherent_risk || 9,
            level: data.level || data.risk_level || "Medium",
            existingControls: data.existingControls || data.existing_controls || "",
            existingControls_ar: data.existingControls_ar || "",
            treatmentOption: data.treatmentOption || data.treatment_option || "Mitigate",
            treatmentPlan: data.treatmentPlan || data.treatment_details || "",
            treatmentPlan_ar: data.treatmentPlan_ar || "",
            owner: data.owner || data.action_owner || "",
            dueDate: data.dueDate || data.timeline || "",
            status: data.status || "Open",
            residualLikelihood: data.residualLikelihood || data.likelihood_score || 2,
            residualImpact: data.residualImpact || data.impact_score || 2,
            residualScore: data.residualScore || data.residual_risk || 4,
            residualLevel: data.residualLevel || data.risk_level || "Low",
            aiMitigation: data.aiMitigation || data.mitigation_actions || "",
            aiMitigation_ar: data.aiMitigation_ar || ""
          } as RiskItem;
        });
        setRiskRegister(risks);
      }
    } catch (err) {
      console.error("Error loading risks:", err);
    }
  };

  // --- HANDLERS ---
  const handleContextChange = (field: keyof AssessmentContext, value: any) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const handleTenantLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 500KB for Base64 storage in Firestore)
    if (file.size > 512 * 1024) {
      alert("Logo file is too large. Please select an image under 500KB.");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCompanyLogoUrl(base64String);
        setIsUploadingLogo(false);
      };
      reader.onerror = () => {
        console.error("FileReader error");
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Logo processing error:", err);
      setIsUploadingLogo(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingLogo(true);
    try {
      const storageRef = ref(storage, `tenants/${tenant?.id || 'unknown'}/logos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleContextChange("logoUrl", url);
    } catch (err) {
      console.error("Logo upload error:", err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const selectFramework = (fw: string) => {
    // Check if there are unsaved risks or current data
    if (riskRegister.length > 0) {
      const confirmClear = window.confirm(lang === 'ar' ? "اختيار إطار عمل جديد سيؤدي إلى بدء تقييم جديد. هل تريد المتابعة؟" : "Selecting a new framework will start a new assessment session. Existing items in this session will be archived to History. Continue?");
      if (!confirmClear) return;
    }
    
    setRiskRegister([]);
    
    setContext(prev => ({
      ...prev,
      frameworks: [fw] // Single selection
    }));

    // Auto-load full risks for the selected framework
    const templateKey = fw.toLowerCase().replace(/\s+/g, '') as keyof typeof RISK_TEMPLATES;
    if (RISK_TEMPLATES[templateKey]) {
      const newRisks: RiskItem[] = RISK_TEMPLATES[templateKey].map((t, i) => ({
        ...t,
        id: `R-${fw}-${Date.now()}-${i}`,
        score: t.likelihood * t.impact,
        level: getRiskLevel(t.likelihood * t.impact),
        existingControls: "",
        existingControls_ar: "",
        treatmentOption: "Mitigate",
        treatmentPlan: "",
        treatmentPlan_ar: "",
        owner: "TBD",
        dueDate: new Date().toISOString().split('T')[0],
        status: "Open",
        residualLikelihood: t.likelihood,
        residualImpact: t.impact,
        residualScore: t.likelihood * t.impact,
        residualLevel: getRiskLevel(t.likelihood * t.impact)
      }));
      setRiskRegister(newRisks);
      
      // If user is logged in, save these to cloud
      if (user) {
        newRisks.forEach(risk => {
          const riskRef = doc(tenantDb, "risks", risk.id);
          setDoc(riskRef, { ...risk, uid: user.uid, createdAt: new Date().toISOString() }).catch(e => console.error(e));
        });
      }
    }
  };

  const applyTemplate = (category: keyof typeof RISK_TEMPLATES, index: number) => {
    const template = RISK_TEMPLATES[category] ? RISK_TEMPLATES[category][index] : null;
    if (!template) return;
    
    setFormData(prev => ({
      ...prev,
      ...template,
      score: (template.likelihood || 3) * (template.impact || 3),
      level: getRiskLevel((template.likelihood || 3) * (template.impact || 3)),
      existingControls: "",
      existingControls_ar: "",
      treatmentPlan: "",
      treatmentPlan_ar: ""
    }));
  };

  const handleFormChange = (field: keyof RiskItem, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate scores
      if (field === "likelihood" || field === "impact") {
        const l = field === "likelihood" ? Number(value) : (prev.likelihood || 0);
        const i = field === "impact" ? Number(value) : (prev.impact || 0);
        updated.score = l * i;
        updated.level = getRiskLevel(updated.score);
      }
      
      if (field === "residualLikelihood" || field === "residualImpact") {
        const rl = field === "residualLikelihood" ? Number(value) : (prev.residualLikelihood || 0);
        const ri = field === "residualImpact" ? Number(value) : (prev.residualImpact || 0);
        updated.residualScore = rl * ri;
        updated.residualLevel = getRiskLevel(updated.residualScore);
      }

      return updated;
    });
  };

  const addOrUpdateRisk = () => {
    const score = (formData.likelihood || 0) * (formData.impact || 0);
    const rScore = (formData.residualLikelihood || 0) * (formData.residualImpact || 0);
    
    const newRisk: RiskItem = {
      ...formData as RiskItem,
      id: formData.id || `R-${Date.now()}`,
      score,
      level: getRiskLevel(score),
      residualScore: rScore,
      residualLevel: getRiskLevel(rScore),
      aiMitigation: aiOutput || formData.aiMitigation
    };

    setRiskRegister(prev => {
      const updated = [...prev];
      if (selectedRiskIndex !== null) {
        updated[selectedRiskIndex] = newRisk;
      } else {
        updated.push(newRisk);
      }
      return updated;
    });

    // Side Effect: Save to Firestore if logged in
    if (user) {
      const riskData = formatRiskForFirestore(newRisk);
      const riskRef = doc(tenantDb, "risks", newRisk.id);
      setDoc(riskRef, {
        ...riskData,
        uid: user.uid,
        createdAt: newRisk.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `risks/${newRisk.id}`));
    }

    setSelectedRiskIndex(null);
    setAiOutput("");
    setFormData({
      asset: "",
      asset_ar: "",
      threat: "",
      threat_ar: "",
      vulnerability: "",
      vulnerability_ar: "",
      riskStatement: "",
      riskStatement_ar: "",
      likelihood: 3,
      impact: 3,
      existingControls: "",
      existingControls_ar: "",
      treatmentOption: "Mitigate",
      treatmentPlan: "",
      treatmentPlan_ar: "",
      owner: "",
      dueDate: new Date().toISOString().split('T')[0],
      status: "Open",
      residualLikelihood: 2,
      residualImpact: 2
    });
  };

  const deleteRisk = (index: number) => {
    const riskToDelete = riskRegister[index];
    setRiskRegister(riskRegister.filter((_, i) => i !== index));
    if (selectedRiskIndex === index) setSelectedRiskIndex(null);
    
    // Delete from Firestore if logged in
    if (user && tenant && riskToDelete.id) {
      const riskRef = doc(tenantDb, "risks", riskToDelete.id);
      deleteDoc(riskRef).catch(err => handleFirestoreError(err, OperationType.DELETE, `risks/${riskToDelete.id}`));
    }
  };

  const editRisk = (index: number) => {
    setSelectedRiskIndex(index);
    const raw: any = riskRegister[index];
    setFormData({
      id: raw.id || raw.risk_id || "",
      asset: raw.asset || raw.asset_category || "",
      asset_ar: raw.asset_ar || "",
      threat: raw.threat || raw.threat_text || "",
      threat_ar: raw.threat_ar || "",
      vulnerability: raw.vulnerability || "",
      vulnerability_ar: raw.vulnerability_ar || "",
      riskStatement: raw.riskStatement || raw.risk_statement || "",
      riskStatement_ar: raw.riskStatement_ar || raw.risk_statement_ar || "",
      likelihood: raw.likelihood || raw.likelihood_score || 3,
      impact: raw.impact || raw.impact_score || 3,
      existingControls: raw.existingControls || raw.existing_controls || "",
      existingControls_ar: raw.existingControls_ar || raw.existing_controls_ar || "",
      treatmentOption: raw.treatmentOption || raw.treatment_option || "Mitigate",
      treatmentPlan: raw.treatmentPlan || raw.treatment_details || raw.mitigation_actions || "",
      treatmentPlan_ar: raw.treatmentPlan_ar || raw.treatment_details_ar || "",
      owner: raw.owner || raw.action_owner || "",
      dueDate: raw.dueDate || raw.timeline || new Date().toISOString().split('T')[0],
      status: raw.status || "Open",
      residualLikelihood: raw.residualLikelihood || raw.residual_likelihood || 2,
      residualImpact: raw.residualImpact || raw.residual_impact || 2,
      score: raw.score || raw.inherent_risk || ((raw.likelihood || 3) * (raw.impact || 3)) || 9,
      level: raw.level || raw.risk_level || "Medium",
      spretzel: raw.spretzel || { people: "", resources: "", legal: "", opportunities: "", technology: "", strategy: "", engagement: "", lifecycle: "", marketing: "" },
      stakeholders: raw.stakeholders || { internal: "", external: "", influence: 'Medium', interest: 'Medium' },
      rca: raw.rca || { fiveWhys: ["", "", "", "", ""], ishikawa: { people: "", process: "", technology: "", environment: "", management: "" }, primaryRootCause: "", aiConfidence: 0.85, explanation: "" },
      swot: raw.swot || { strengths: "", weaknesses: "", opportunities: "", threats: "", strategicActions: [] },
      enhancedDescription: raw.enhancedDescription || { riskStatement: raw.riskStatement || "", context: "", impactDescription: "", likelihoodReasoning: "", aiSuggestions: "" },
      kri: raw.kri || { indicator: "", threshold: 0, currentValue: 0, trend: 'stable', alertLevel: 'Normal', history: [] },
      compliance: raw.compliance || null
    });
    setAiOutput(raw.aiMitigation || raw.treatmentPlan || raw.treatment_details || raw.mitigation_actions || "");
    setAssessmentView('core'); 
  };

  const exportFullReportImageToPDF = async () => {
    setIsSaving(true);
    try {
      const element = document.getElementById("hidden-pdf-template");
      if (!element) throw new Error("Template missing");
      element.style.left = "0px";
      element.style.visibility = "visible";
      
      // Give the DOM a moment to render 100+ items
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(element, { 
        scale: 1.5, 
        useCORS: true, 
        backgroundColor: '#0f172a',
        logging: false
      });
      
      element.style.left = "-10000px";
      element.style.visibility = "hidden";
      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Comprehensive_Risk_Report_${Date.now()}.pdf`);
    } catch(e) {
      console.error(e);
      alert("Failed to render comprehensive visual PDF.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportToPDF = () => exportFullReportImageToPDF();

  const exportToWord = () => {
    const children: any[] = [
      new Paragraph({ 
        children: [new TextRun({ text: "ISO 31000 Risk Assessment Report", bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({ text: `Organization: ${context.organization || 'N/A'}`, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: `Date generated: ${new Date().toLocaleDateString()}`, alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
      new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
      new Paragraph({ text: `This report contains a detailed analysis of ${riskRegister.length} identified risks within the scope: ${context.scope || 'General Enterprise'}.` }),
      new Paragraph({ text: "", spacing: { after: 400 } }),
      new Paragraph({ text: "Risk Register Details", heading: HeadingLevel.HEADING_2, spacing: { after: 400 } }),
    ];

    riskRegister.forEach((r, i) => {
      children.push(new Paragraph({ text: `Risk #${i + 1}: ${r.asset}`, heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }));
      children.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Threat: ", bold: true }),
          new TextRun({ text: r.threat })
        ]
      }));
      children.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Risk Level: ", bold: true }),
          new TextRun({ text: `${r.level} (Score: ${r.score})` })
        ]
      }));
      children.push(new Paragraph({ 
        children: [
          new TextRun({ text: "Treatment Plan: ", bold: true }),
          new TextRun({ text: r.treatmentPlan || r.aiMitigation || 'Pending mitigation plan' })
        ],
        spacing: { after: 200 }
      }));
    });

    const docObj = new Document({ sections: [{ children }] });
    Packer.toBlob(docObj).then(blob => {
      saveAs(blob, `Full_Risk_Report_${Date.now()}.docx`);
    });
  };

  const callGemini = async () => {
    if (!formData.riskStatement && !formData.threat) return;
    setAiLoading(true);
    
    try {
      if (isOffline || useLocalLlm) {
        const localResult = getLocalMitigation({
          asset: formData.asset || "",
          threat: formData.threat || "",
          vulnerability: formData.vulnerability || "",
          risk_statement: formData.riskStatement || "",
          asset_category: ""
        }, lang);
        setAiOutput(localResult);
        setAiLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = `
        As an ISO 31000 Risk Consultant, analyze this risk:
        Asset: ${formData.asset}
        Threat: ${formData.threat}
        Vulnerability: ${formData.vulnerability}
        Statement: ${formData.riskStatement}
        Inherent Score: ${formData.likelihood} (L) x ${formData.impact} (I) = ${(formData.likelihood || 0) * (formData.impact || 0)}
        
        Applicable Frameworks: ${context.frameworks}
        
        Provide 3-5 specific, actionable mitigation controls and a recommended treatment plan. 
        Ensure the controls align with the selected frameworks if applicable.
        Keep it professional and concise.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setAiOutput(text || "No suggestion generated.");
    } catch (err) {
      console.error("AI Error:", err);
      const localResult = getLocalMitigation({
        asset: formData.asset || "",
        threat: formData.threat || "",
        vulnerability: formData.vulnerability || "",
        risk_statement: formData.riskStatement || "",
        asset_category: ""
      }, lang);
      setAiOutput(localResult + (lang === 'ar' ? "\n\n(ملاحظة: تم استخدام الوضع المحلي بسبب خطأ في الاتصال)" : "\n\n(Note: Fallback used due to connection error)"));
    } finally {
      setAiLoading(false);
    }
  };

  const generateAdvancedInsights = async () => {
    if (!formData.asset || !formData.threat) {
      alert("Please provide Asset and Threat details first.");
      return;
    }
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = `
        As a Strategic Risk Intelligence AI, perform a deep analysis of this risk to populate a diagnostic dashboard.
        Operating Language: ${lang === 'ar' ? 'Arabic (العربية)' : 'English'}
        ${lang === 'ar' ? 'IMPORTANT: All descriptive text values MUST be in Arabic.' : ''}
        
        Asset: ${lang === 'ar' && formData.asset_ar ? formData.asset_ar : formData.asset}
        Threat: ${lang === 'ar' && formData.threat_ar ? formData.threat_ar : formData.threat}
        Vulnerability: ${lang === 'ar' && formData.vulnerability_ar ? formData.vulnerability_ar : formData.vulnerability}
        Statement: ${lang === 'ar' && formData.riskStatement_ar ? formData.riskStatement_ar : formData.riskStatement}
        Context: ${context.organization} | Scope: ${context.scope}

        Return a JSON object with the following fields (provide realistic, high-quality data):
        {
          "rca": {
            "fiveWhys": ["Cause 1", "Cause 2", "Cause 3", "Cause 4", "Root Cause"],
            "ishikawa": { "people": "...", "process": "...", "technology": "...", "environment": "...", "management": "..." },
            "primaryRootCause": "...",
            "explanation": "...",
            "aiConfidence": 0.95
          },
          "swot": {
            "strengths": "...",
            "weaknesses": "...",
            "opportunities": "...",
            "threats": "...",
            "strategicActions": ["Action 1", "Action 2", "Action 3"]
          },
          "spretzel": {
             "people": "...", 
             "resources": "...", 
             "legal": "...", 
             "opportunities": "...", 
             "technology": "...", 
             "strategy": "...", 
             "engagement": "...", 
             "lifecycle": "...", 
             "marketing": "..."
          },
          "enhancedDescription": {
            "riskStatement": "...",
            "context": "...",
            "impactDescription": "...",
            "likelihoodReasoning": "...",
            "aiSuggestions": "..."
          },
          "kri": {
            "indicator": "...",
            "threshold": 10
          }
        }
        IMPORTANT: Provide ONLY the raw JSON object. No preamble, no markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Powerful JSON extraction logic to handle LLM conversational noise
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI response did not contain a valid metadata structure.");
      }
      
      const data = JSON.parse(jsonMatch[0]);
      
      // Ensure we have a deep update that React picks up immediately
      setFormData(prev => {
        const updated = {
          ...prev,
          rca: { 
            ...(prev.rca || {}), 
            ...data.rca,
            fiveWhys: data.rca?.fiveWhys || prev.rca?.fiveWhys || ["","","","",""],
            ishikawa: data.rca?.ishikawa || prev.rca?.ishikawa || { people: "", process: "", technology: "", environment: "", management: "" }
          },
          swot: { ...(prev.swot || {}), ...data.swot },
          spretzel: { ...(prev.spretzel || {}), ...data.spretzel },
          enhancedDescription: { 
            ...(prev.enhancedDescription || {}), 
            ...data.enhancedDescription,
            // Ensure specific fields mentioned by user are explicitly handled if possible
            riskStatement: data.enhancedDescription?.riskStatement || prev.enhancedDescription?.riskStatement,
            context: data.enhancedDescription?.context || prev.enhancedDescription?.context,
            impactDescription: data.enhancedDescription?.impactDescription || prev.enhancedDescription?.impactDescription,
            likelihoodReasoning: data.enhancedDescription?.likelihoodReasoning || prev.enhancedDescription?.likelihoodReasoning
          },
          kri: { 
            ...(prev.kri || {}), 
            ...data.kri, 
            currentValue: Math.floor(Math.random() * 8), 
            trend: 'stable'
          }
        };
        console.log("Strategic Intelligence Synced:", updated);
        return updated;
      });
      
      setAiOutput("Advanced Strategic Intelligence generated. All diagnostic modules (Ishikawa, SWOT, SPRETZEL, KRI) have been updated.");
    } catch (err) {
      console.error("Advanced AI Error:", err);
      alert("Strategic Analysis Error: The AI response could not be parsed. Please try again. Detailed error: " + (err instanceof Error ? err.message : "Parsing Failed"));
    } finally {
      setAiLoading(false);
    }
  };

  const speakAiOutput = async () => {
    if (!aiOutput) return;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: aiOutput }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        playAudioChunk(base64Audio, 24000);
        return;
      }
    } catch (err) {
      console.error("Gemini TTS Error, falling back to browser TTS:", err);
    }

    const utterance = new SpeechSynthesisUtterance(aiOutput);
    window.speechSynthesis.speak(utterance);
  };

  const handleAudit = async (riskId: string) => {
    const activeEvidence = auditEvidenceRef.current || auditEvidence;
    const activeMime = auditMimeTypeRef.current || auditMimeType;
    
    if (!activeEvidence) {
      alert("Please upload evidence first.");
      return "No evidence uploaded.";
    }
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `You are the 'Eye of the Auditor' (CNN-based Compliance Validator). 
      Analyze the provided evidence document (image) for the risk ID: ${riskId}.
      Check for:
      1. Authorized Signatures (Is it signed by authority?)
      2. Official Stamps (Does it have an organizational seal?)
      3. Compliance Details (Does it match the treatment plan for this risk?)
      
      Provide a structured audit report including:
      - Status: (Approved/Rejected)
      - Findings: (List specific details found)
      - Signature Validation: (Confirmed/Missing)
      - Stamp Validation: (Confirmed/Missing)
      - Recommendations: (Next steps)`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { text: prompt },
          { inlineData: { data: activeEvidence.split(',')[1], mimeType: activeMime } }
        ]
      });

      const report = response.text || "Audit failed to generate report.";
      setAuditReport(report);
      return report;
    } catch (error) {
      console.error("Audit Error:", error);
      return "Audit failed due to technical error.";
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleLiveConsultant = async () => {
    if (isLiveConnected) {
      liveSessionRef.current?.close();
      stopAudio();
      setIsLiveConnected(false);
      isLiveConnectedRef.current = false;
      liveSessionRef.current = null;
      return;
    }

    if (isLiveConnecting) return;

    setIsLiveConnecting(true);
    try {
      // 1. Request Microphone Permission IMMEDIATELY on user gesture
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Initialize AudioContext on user gesture
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const updateRiskField: FunctionDeclaration = {
        name: "updateRiskField",
        description: "Updates a specific field in the risk assessment form based on the conversation.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            fieldName: {
              type: Type.STRING,
              description: "The name of the field to update.",
              enum: ["asset", "threat", "vulnerability", "riskStatement", "likelihood", "impact", "existingControls", "treatmentOption", "treatmentPlan", "owner", "dueDate", "status"]
            },
            value: {
              type: Type.STRING,
              description: "The value to set for the field in English (default) or primary spoken language."
            },
            value_ar: {
              type: Type.STRING,
              description: "The Arabic translation of the value. MUST be provided simultaneously for textual fields."
            }
          },
          required: ["fieldName", "value"]
        }
      };

      const getFormState: FunctionDeclaration = {
        name: "getFormState",
        description: "Retrieves the current state of all fields in the risk assessment form.",
        parameters: { type: Type.OBJECT, properties: {} }
      };

      const focusField: FunctionDeclaration = {
        name: "focusField",
        description: "Highlights or focuses on a specific field in the UI to show the user what is being discussed.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            fieldName: {
              type: Type.STRING,
              description: "The name of the field to focus on.",
              enum: ["asset", "threat", "vulnerability", "riskStatement", "likelihood", "impact", "existingControls", "treatmentOption", "treatmentPlan", "owner", "dueDate", "status"]
            }
          },
          required: ["fieldName"]
        }
      };

      const setFramework: FunctionDeclaration = {
        name: "setFramework",
        description: "Selects or toggles a risk management framework (e.g., ISO 31000, NCA ECC, etc.).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            framework: {
              type: Type.STRING,
              description: "The name of the framework to select.",
              enum: ["ISO 31000", "NCA ECC", "NCA CSCC", "ISO 27001", "OHSA", "SASO", "SAMA", "CMA", "PDPL", "NDMO", "ISO 22301", "OT Standard", "Financial", "Operational", "NIST CSF"]
            }
          },
          required: ["framework"]
        }
      };

      const applyRiskTemplate: FunctionDeclaration = {
        name: "applyRiskTemplate",
        description: "Generates a risk library by applying a pre-defined risk template based on a category.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The category of the risk template.",
              enum: ["ohsa", "production", "financial", "cybersecurity", "nca", "continuity", "saudiStandards", "nist", "operational"]
            },
            index: {
              type: Type.NUMBER,
              description: "The index of the template within the category (usually 0, 1, or 2)."
            }
          },
          required: ["category", "index"]
        }
      };

      const addRiskToRegister: FunctionDeclaration = {
        name: "addRiskToRegister",
        description: "Programmatically clicks the 'Add to Risk Register' button to save the current assessment.",
        parameters: { type: Type.OBJECT, properties: {} }
      };

      const navigateToTab: FunctionDeclaration = {
        name: "navigateToTab",
        description: "Switches the application view to a different tab.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            tab: {
              type: Type.STRING,
              description: "The tab to navigate to.",
              enum: ["assessment", "matrix", "history", "audit", "deployment"]
            }
          },
          required: ["tab"]
        }
      };

      const exportReport: FunctionDeclaration = {
        name: "exportReport",
        description: "Triggers the export of the risk assessment report.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            format: {
              type: Type.STRING,
              description: "The format of the report.",
              enum: ["pdf", "word"]
            }
          },
          required: ["format"]
        }
      };

      const performAudit: FunctionDeclaration = {
        name: "performAudit",
        description: "Acts as the 'Eye of the Auditor' using a CNN-like analysis to review uploaded evidence documents for compliance.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            riskId: {
              type: Type.STRING,
              description: "The ID of the risk being audited."
            }
          },
          required: ["riskId"]
        }
      };

      const setContextStepTool: FunctionDeclaration = {
        name: "setContextStep",
        description: "Changes the current step in the context establishment process (1-4).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            step: {
              type: Type.NUMBER,
              description: "The step number to navigate to (1, 2, 3, or 4)."
            }
          },
          required: ["step"]
        }
      };

      const updateContextField: FunctionDeclaration = {
        name: "updateContextField",
        description: "Updates a field in the assessment context (e.g., organization name, scope).",
        parameters: {
          type: Type.OBJECT,
          properties: {
            fieldName: {
              type: Type.STRING,
              description: "The field to update (organization, scope, risk_appetite)."
            },
            value: {
              type: Type.STRING,
              description: "The value to set."
            }
          },
          required: ["fieldName", "value"]
        }
      };

      const getAppState: FunctionDeclaration = {
        name: "getAppState",
        description: "Returns the current state of the application, including the current context step, organization name, and selected frameworks.",
        parameters: {
          type: Type.OBJECT,
          properties: {}
        }
      };

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          systemInstruction: `You are a professional ISO 31000 Risk Management Consultant. You are interacting via VOICE and VISION. 
          Respond in the user's language (English or Arabic). 

          WORKFLOW (FOLLOW STRICTLY):
          1. ESTABLISH CONTEXT (4 STEPS):
             - You MUST complete all 4 steps of "Establish Context" before proceeding to risk identification.
             - Step 1: Identify Organization Name & Logo. IF ALREADY SET, HAPPILY ACKNOWLEDGE IT AND MOVE TO STEP 2!
             - Step 2: Framework Selection. Use 'setFramework' to select frameworks. Ask the user's preference.
             - Step 3: Scope & Boundaries. Ask for the scope of the assessment.
             - Step 4: Risk Appetite & Risk Description. Define what risks are being analyzed.
             - ONLY AFTER STEP 4 IS COMPLETED, click "Start Assessment" tool or logic.

          2. STEP-BY-STEP ASSESSMENT:
             - You MUST guide the user through the risk assessment form ONE FIELD AT A TIME. 
             - Do not ask for multiple fields at once. Start with 'Asset', then 'Threat', then 'Vulnerability', then 'Risk Statement', then 'Scoring', then 'Controls'.
             - When filling ANY textual field, you MUST immediately extract/translate the content into BOTH English and Arabic and use both 'value' and 'value_ar' parameters in 'updateRiskField' simultaneously.

          3. NAVIGATION & SCREEN AWARENESS:
             - You are "watching" the application screen via Vision.
             - You MUST be aware of the 'activeTab'. If the user is on 'History', do not talk about 'Assessment' fields unless you are helping them edit a record.
             - Use 'getAppState' frequently to synchronize your internal state with the live application state.

          4. AUTO-SAVE & NAVIGATE:
             - Once ALL fields in the assessment form are completed, you MUST automatically call 'addRiskToRegister' and then 'navigateToTab' to 'history'.

          Your goal:
          Current Status: Organization is ${context.organization ? 'SET to "'+context.organization+'"' : 'NOT SET'}. Logo is ${context.logoUrl ? 'UPLOADED' : 'NOT UPLOADED'}. activeTab is ${activeTab}.
          
          Use 'setContextStep' to navigate through Step 1 to 4 precisely.
          Use 'getAppState' for real-time status.
          Use 'updateRiskField' to fill forms.
          Use 'addRiskToRegister' to save.
          Use 'navigateToTab' to switch views.

          Be concise to reduce latency. Ask one question at a time. 
          Respond naturally and conversationally.
          Current form: ${JSON.stringify(formData)}
          Register size: ${riskRegister.length}`,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [updateRiskField, getFormState, focusField, setFramework, applyRiskTemplate, addRiskToRegister, navigateToTab, exportReport, performAudit, getAppState, updateContextField, setContextStepTool] }]
        },
        callbacks: {
          onopen: () => {
            console.log("Live API Session Opened");
            setIsLiveConnected(true);
            isLiveConnectedRef.current = true;
            setIsLiveConnecting(false);
            setActiveTab('assessment');
            
            sessionPromise.then(s => {
              liveSessionRef.current = s;
              startMic(s, stream);
              
              // Send a welcome message to trigger initial audio response
              let welcomeText = "";
              if (contextStep === 1) {
                welcomeText = lang === 'ar' 
                  ? "مرحباً! أنا مستشارك لإدارة المخاطر. لنبدأ بتحديد السياق. ما هو اسم منظمتك؟"
                  : "Hello! I am your Risk Management Consultant. Let's start by establishing the context. What is the name of your organization?";
              } else if (contextStep === 2) {
                welcomeText = lang === 'ar'
                  ? "مرحباً! نحن الآن في الخطوة الثانية. أي إطار عمل تود اختياره؟"
                  : "Hello! We are now at Step 2. Which framework would you like to select?";
              } else {
                welcomeText = lang === 'ar' 
                  ? "مرحباً! أنا مستشارك لإدارة المخاطر. كيف يمكنني مساعدتك اليوم؟"
                  : "Hello! I am your Risk Management Consultant. How can I assist you today?";
              }
              
              s.sendRealtimeInput({ text: welcomeText });
            });
          },
          onmessage: (msg) => {
            console.log("Live API Message:", msg);

            if (msg.toolCall) {
              msg.toolCall.functionCalls.forEach(call => {
                if (call.name === "updateRiskField") {
                  const fieldName = call.args.fieldName as string;
                  const value = call.args.value as string;
                  const value_ar = call.args.value_ar as string;
                  setFormData(prev => ({
                    ...prev,
                    [fieldName]: (fieldName === 'likelihood' || fieldName === 'impact') ? parseInt(value) : value,
                    ...(value_ar ? { [`${fieldName}_ar`]: value_ar } : {})
                  }));
                  
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "updateRiskField",
                        response: { success: true, field: fieldName },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "getFormState") {
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "getFormState",
                        response: { state: formData },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "focusField") {
                  const fieldName = call.args.fieldName as string;
                  setActiveVoiceField(fieldName);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "focusField",
                        response: { success: true, focused: fieldName },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "updateContextField") {
                  const fieldName = call.args.fieldName as keyof AssessmentContext;
                  const value = call.args.value as string;
                  handleContextChange(fieldName, value);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "updateContextField",
                        response: { success: true, field: fieldName },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "getAppState") {
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "getAppState",
                        response: { 
                          step: contextStep, 
                          organization: context.organization, 
                          frameworks: context.frameworks,
                          logoUrl: context.logoUrl,
                          activeTab: activeTab,
                          tenant: tenant ? { id: tenant.id, name: tenant.name } : null
                        },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "setContextStep") {
                  const step = call.args.step as number;
                  setContextStep(step);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "setContextStep",
                        response: { success: true, step },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "setFramework") {
                  const fw = call.args.framework as string;
                  selectFramework(fw);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "setFramework",
                        response: { success: true, framework: fw },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "applyRiskTemplate") {
                  const category = call.args.category as keyof typeof RISK_TEMPLATES;
                  const index = call.args.index as number;
                  applyTemplate(category, index);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "applyRiskTemplate",
                        response: { success: true, category, index },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "addRiskToRegister") {
                  addOrUpdateRisk();
                  setActiveTab('history'); // Auto-navigate to history after save
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "addRiskToRegister",
                        response: { success: true, navigated: 'history' },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "navigateToTab") {
                  const tab = call.args.tab as any;
                  setActiveTab(tab);
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "navigateToTab",
                        response: { success: true, tab },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "exportReport") {
                  const format = call.args.format as string;
                  if (format === 'pdf') exportToPDF();
                  else exportToWord();
                  sessionPromise.then(s => {
                    s.sendToolResponse({
                      functionResponses: [{
                        name: "exportReport",
                        response: { success: true, format },
                        id: call.id
                      }]
                    });
                  });
                } else if (call.name === "performAudit") {
                  const riskId = call.args.riskId as string;
                  handleAudit(riskId).then(report => {
                    sessionPromise.then(s => {
                      s.sendToolResponse({
                        functionResponses: [{
                          name: "performAudit",
                          response: { success: true, report },
                          id: call.id
                        }]
                      });
                    });
                  });
                }
              });
            }

            // Handle multiple parts in a single message
            if (msg.serverContent?.modelTurn?.parts) {
              msg.serverContent.modelTurn.parts.forEach(part => {
                if (part.inlineData?.data) {
                  playAudioChunk(part.inlineData.data);
                }
                if (part.text) {
                  console.log("AI Consultant:", part.text);
                }
              });
            }

            // Handle user transcription for debugging/UI
            const userTurn = (msg.serverContent as any)?.userTurn;
            if (userTurn?.parts) {
              userTurn.parts.forEach((part: any) => {
                if (part.text) {
                  console.log("User said:", part.text);
                }
              });
            }

            if (msg.serverContent?.interrupted) {
              // Stop current audio playback on interruption
              audioQueueRef.current.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              audioQueueRef.current = [];
              if (audioContextRef.current) {
                nextStartTimeRef.current = audioContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            setIsLiveConnected(false);
            isLiveConnectedRef.current = false;
            setIsMicActive(false);
            setIsLiveConnecting(false);
            liveSessionRef.current = null;
            stopAudio();
          },
          onerror: (err: any) => {
            // Ignore "The operation was aborted" error if it's just a connection close or expected abort
            if (err?.message?.includes("aborted") || err?.message?.includes("closed")) {
              console.log("Live API connection closed or aborted.");
            } else {
              console.error("Live API Error:", err);
            }
            setIsLiveConnected(false);
            isLiveConnectedRef.current = false;
            setIsMicActive(false);
            setIsLiveConnecting(false);
            liveSessionRef.current = null;
            stopAudio();
          }
        }
      });
      sessionPromise.then(s => { 
        liveSessionRef.current = s; 
      }).catch(err => {
        if (!err?.message?.includes("aborted")) {
          console.error("Live Session Promise Error:", err);
        }
        setIsLiveConnecting(false);
      });
    } catch (err) {
      console.error("Failed to connect Live API or Mic:", err);
      setIsLiveConnecting(false);
      setIsLiveConnected(false);
      isLiveConnectedRef.current = false;
      alert("Microphone access is required for the voice agent. Please allow access and try again.");
    }
  };

  // --- CLOUD SAVE ---
  const saveToCloud = async () => {
    if (!user || !tenant) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      // Save each risk to the tenant database: /risks/{riskId}
      const savePromises = riskRegister.map(async (risk) => {
        const riskData = formatRiskForFirestore(risk);
        const riskDocRef = doc(tenantDb, "risks", risk.id);
        await setDoc(riskDocRef, {
          ...riskData,
          uid: user.uid,
          createdAt: new Date().toISOString()
        }, { merge: true });
      });

      await Promise.all(savePromises);

      // Also save the full context to user profile in tenant database
      const userRef = doc(tenantDb, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        lastContext: context,
        tenantId: tenant.id,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      alert("All risk items synced to your company's secure database successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "risks");
    } finally {
      setIsSaving(false);
    }
  };

  // --- EXPORTS ---
  const generatePDF = () => exportFullReportImageToPDF();

  const generateWord = () => {
    exportToWord();
  };

  const generateJson = () => {
    const data = { context, riskRegister, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, `Risk_Assessment_${Date.now()}.json`);
  };

  // --- UI HELPERS ---
  const getFieldClass = (id: string) => {
    const idToField: Record<string, string> = {
      'risk_asset': 'asset',
      'risk_threat': 'threat',
      'risk_vuln': 'vulnerability',
      'risk_statement': 'riskStatement',
      'risk_controls': 'existingControls',
      'risk_treatment': 'treatmentOption',
      'risk_status': 'status',
      'risk_plan': 'treatmentPlan',
      'risk_owner': 'owner',
      'risk_due': 'dueDate'
    };
    const isActive = activeVoiceField === idToField[id] || activeVoiceField === id;
    return `w-full bg-slate-800 border ${isActive ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-700'} rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all`;
  };

  // --- RENDER ---
  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
            {context.logoUrl ? (
              <img src={context.logoUrl} alt="Company Logo" className="w-8 h-8 object-contain rounded-lg bg-white/5" />
            ) : (
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950">R</div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm leading-tight font-bold">{t.title}</h1>
              </div>
              {tenant ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-medium">{tenant.name} Secure DB</p>
                  </div>
                  {(useLocalLlm || isOffline) && (
                    <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>
                      <p className="text-[8px] text-amber-500 uppercase tracking-widest font-bold">Local LLM Redundancy Active</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">{t.subtitle}</p>
              )}
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'landing' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutDashboard size={14} /> {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            {user && tenant && (
              <>
                <button 
                  onClick={() => setActiveTab('assessment')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'assessment' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <FileText size={14} /> {t.assessment}
                </button>
                <button 
                  onClick={() => setActiveTab('matrix')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <BarChart3 size={14} /> {t.matrix}
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Zap size={14} /> {lang === 'ar' ? t.intelligence : 'Intelligence'}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <History size={14} /> {t.history}
                </button>
                <button 
                  onClick={() => setActiveTab('audit')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'audit' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <ShieldCheck size={14} /> {t.audit}
                </button>
                <button 
                  onClick={() => setActiveTab('vision')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'vision' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Eye size={14} /> {t.vision}
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <UserIcon size={14} /> {t.profile}
                </button>
                <button 
                  onClick={() => setActiveTab('deployment')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'deployment' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Settings size={14} /> {t.deployment}
                </button>
                {(user?.email?.toLowerCase() === 'aaroomi@gmail.com' || user?.email?.toLowerCase() === 'admin@metaworks.com') && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-normal transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-400 hover:text-indigo-200'}`}
                  >
                    <Key size={14} /> Admin
                  </button>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs hover:bg-slate-700 transition-all"
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-normal">{userProfile?.name || user.displayName || user.email?.split('@')[0]}</p>
                  <button onClick={() => signOut(auth)} className="text-[10px] text-slate-400 hover:text-red-400">{t.signOut}</button>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-8 h-8 rounded-full bg-slate-700 border flex items-center justify-center overflow-hidden transition-all ${activeTab === 'profile' ? 'border-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-slate-600 hover:border-slate-400'}`}
                >
                  {userProfile?.photo_file_name || user.photoURL ? (
                    <img src={userProfile?.photo_file_name || user.photoURL || ""} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">{user.email?.[0].toUpperCase()}</span>
                  )}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-sky-500 text-slate-950 text-xs font-normal rounded-lg hover:bg-sky-400 transition-all"
              >
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {showLicenseGate && activeTab !== 'landing' && activeTab !== 'admin' && (
          <section className="bg-slate-900/90 w-full rounded-2xl border border-slate-800 p-12 text-center flex flex-col items-center mt-12 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"></div>
             <Key className="w-16 h-16 text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
             <h2 className="text-3xl font-bold mb-4 text-white">Commercial License Required</h2>
             <p className="text-slate-400 mb-8 max-w-lg leading-relaxed">
               Your account is currently restricted. Please input a valid Administrator-generated Enterprise License Key to unlock the complete ISO 31000 suite.
             </p>
             <div className="flex flex-col gap-2 relative z-10 w-full max-w-xs">
               <input 
                 type="text" 
                 value={licenseInput} 
                 onChange={(e) => setLicenseInput(e.target.value.toUpperCase())} 
                 placeholder="ISO-XXXX-XXXX" 
                 className="bg-slate-950 border border-slate-700 px-4 py-4 rounded-xl text-white mb-2 text-center font-mono tracking-[0.2em] outline-none focus:border-sky-500 transition-colors shadow-inner" 
               />
               {licenseError && <p className="text-red-400 text-[10px] mb-2 uppercase tracking-widest">{licenseError}</p>}
               <button 
                 disabled={isSaving || !licenseInput} 
                 onClick={async () => {
                  setIsSaving(true);
                  try {
                    const lDoc = await getDoc(doc(masterDb, "licenses", licenseInput));
                    if (!lDoc.exists()) {
                       setLicenseError("License key does not exist.");
                    } else {
                       const ldt = lDoc.data();
                       if (new Date(ldt.expiresAt) < new Date()) {
                         setLicenseError("This license has expired.");
                       } else {
                         await setDoc(doc(masterDb, "users", user!.uid), { licenseKey: licenseInput, email: user!.email }, { merge: true });
                         setHasValidLicense(true);
                         setShowLicenseGate(false);
                         setLicenseError("");
                       }
                    }
                  } catch(e) {
                    setLicenseError("Validation configuration error. Please ensure you are online.");
                  } finally { setIsSaving(false); }
                 }} 
                 className="bg-emerald-600 outline-none hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all uppercase"
               >
                 {isSaving ? "Validating..." : "Activate Account"}
               </button>
             </div>
          </section>
        )}

        {authLoading || isTenantLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black animate-pulse">Initializing Secure Environment...</p>
            </div>
          </div>
        ) : (!showLicenseGate || activeTab === 'landing' || activeTab === 'admin') && activeTab === 'landing' && (
          <section className="space-y-12 py-6 min-h-[80vh] flex flex-col">
            {!user ? (
               <div className="flex-1 flex items-center justify-center py-20">
                  <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] max-w-md w-full shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-8 text-left animate-in fade-in zoom-in-95 duration-700">
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <ShieldCheck className="text-emerald-500" size={40} />
                      </div>
                      <h3 className="text-3xl font-light text-white tracking-tight">{isRegistering ? t.register : t.login}</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">{t.subtitle}</p>
                    </div>
                    
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      {isRegistering && (
                        <div className="space-y-4">
                          <label className="block space-y-2">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Company Name</span>
                            <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700" placeholder="Acme Corp" />
                          </label>
                          <div className="h-[52px] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center gap-3 hover:border-emerald-500/50 transition-all cursor-pointer bg-slate-950" onClick={() => document.getElementById('base-logo-upload')?.click()}>
                             {companyLogoUrl ? <img src={companyLogoUrl} alt="Logo" className="h-6" /> : <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Upload Brand Identity</span>}
                             <input id="base-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleTenantLogoUpload} />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder={t.email} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                        <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder={t.password} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all" />
                      </div>

                      {authError && (
                        <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-3xl space-y-3">
                          <div className="flex items-center gap-2 text-red-500">
                             <ShieldAlert size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Mission Readiness Check Failed</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                            The Firebase security layer rejected the credentials. This is typically due to an unauthorized domain or inactive project settings.
                          </p>
                          <div className="pt-2 space-y-2 border-t border-red-500/10">
                            <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                               <span className="text-[9px] text-slate-600 font-bold uppercase">Current Domain</span>
                               <span className="text-[10px] text-slate-300 font-mono">{typeof window !== 'undefined' ? window.location.hostname : 'Detecting...'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                               <span className="text-[9px] text-slate-600 font-bold uppercase">Target ID</span>
                               <span className="text-[10px] text-slate-300 font-mono">metaworks-7cfc5</span>
                            </div>
                          </div>
                          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                             <p className="text-[9px] text-red-400 font-bold italic">FIX IN REALITY: Go to Firebase Console &gt; Auth &gt; Settings &gt; Authorized Domains and add the "Current Domain" listed above.</p>
                          </div>
                          

                        </div>
                      )}

                      <div className="space-y-4 pt-4">
                        <button type="submit" className="w-full py-4 bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 shadow-xl shadow-emerald-500/20">{isRegistering ? t.register : t.login}</button>
                      </div>
                    </form>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-slate-900 px-2 text-slate-600">Or</span></div>
                    </div>

                    <button 
                      onClick={handleGoogleSignIn}
                      className="w-full py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t.googleSignIn}
                    </button>

                    <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-center text-[10px] text-slate-500 hover:text-emerald-400 font-bold uppercase tracking-widest">{isRegistering ? t.alreadyHaveAccount : t.dontHaveAccount}</button>
                  </div>
               </div>
            ) : user && !tenant ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-12 rounded-[40px] text-center space-y-8 max-w-2xl shadow-3xl">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20"><ShieldCheck size={40} /></div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-light text-white tracking-tight">Enterprise Identity Required</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">To activate multi-tenant isolation and dedicated AI modeling, please provide your organizational details.</p>
                  </div>
                  <div className="space-y-4 max-w-sm mx-auto">
                    <input type="text" placeholder="Organizational Name" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500 transition-all" />
                    <div className="h-[60px] border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center gap-3 hover:border-emerald-500/50 transition-all cursor-pointer bg-slate-950" onClick={() => document.getElementById('final-logo-upload')?.click()}>
                       {companyLogoUrl ? <img src={companyLogoUrl} alt="Logo" className="h-8" /> : <span className="text-xs text-slate-500">Upload Enterprise Logo</span>}
                       <input id="final-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleTenantLogoUpload} />
                    </div>
                    <button onClick={handleCreateTenant} className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20 mt-4">Initialize Isolated Database</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-light text-white tracking-tight">{t.dashboard}</h2>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">{lang === 'ar' ? 'نظام ذكاء المخاطر يعمل بكامل طاقته' : 'Real-time Risk Intelligence Operational'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('assessment')} className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5">{t.newAssessment}</button>
                    <button onClick={() => window.print()} className="px-6 py-3 bg-slate-800 text-slate-300 border border-slate-700/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">{t.exportReport}</button>
                  </div>
                </div>

                {/* Dashboard Grid Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Row 1: Executive Core */}
                  <div className="lg:col-span-1 h-full">
                    <ExecutiveSummary risks={riskRegister} lang={lang} />
                  </div>
                  <div className="lg:col-span-2 h-full">
                    <TopRisksPareto risks={riskRegister} lang={lang} onDrillDown={(idx) => { setSelectedRiskIndex(idx); setActiveTab('assessment'); }} title={lang === 'ar' ? 'توزيع المخاطر' : 'Risk Distribution'} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                    <MiniHeatmap risks={riskRegister} lang={lang} onExpand={() => setActiveTab('matrix')} />
                  </div>

                  {/* Row 2: Analytics & Deep Insights */}
                  <div className="lg:col-span-1 h-full">
                    <KRISnapshot risks={riskRegister} lang={lang} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                    <RootCauseInsights risks={riskRegister} lang={lang} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                     <SWOTHighlights risks={riskRegister} lang={lang} />
                  </div>
                  <div className="lg:col-span-1 h-full">
                     <SPRETZELSnapshot risks={riskRegister} lang={lang} />
                  </div>

                  {/* Row 3: Governance & Regulatory */}
                  <div className="lg:col-span-2 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                       <StakeholderOverview risks={riskRegister} lang={lang} />
                       <ComplianceStatus risks={riskRegister} frameworks={context.frameworks} lang={lang} />
                    </div>
                  </div>
                  <div className="lg:col-span-2 h-full">
                    <EmergingAlerts risks={riskRegister} lang={lang} />
                  </div>
                </div>

                {/* Master Risk Inventory Table */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{lang === 'ar' ? 'مخزون المخاطر الرئيسي' : 'Master Risk Inventory'}</h3>
                    <button onClick={() => setActiveTab('assessment')} className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors font-black uppercase tracking-widest">{lang === 'ar' ? 'السجل الكامل ←' : 'Full Registry →'}</button>
                  </div>
                  <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/50 text-slate-600 uppercase tracking-widest font-black text-[9px] border-b border-slate-800">
                        <tr>
                          <th className="px-8 py-4">{t.asset}</th>
                          <th className="px-8 py-4">{t.threat}</th>
                          <th className="px-8 py-4">{lang === 'ar' ? 'مستوى الذكاء' : 'Intelligence Level'}</th>
                          <th className="px-8 py-4">{lang === 'ar' ? 'حالة القرار' : 'Decision Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {riskRegister.slice(0, 10).map((risk) => (
                          <tr key={risk.id} className="hover:bg-slate-800/10 transition-colors group">
                            <td className="px-8 py-5 text-white font-medium group-hover:text-emerald-400 transition-colors">{lang === 'ar' && risk.asset_ar ? risk.asset_ar : risk.asset}</td>
                            <td className="px-8 py-5 text-slate-500">{lang === 'ar' && risk.threat_ar ? risk.threat_ar : risk.threat}</td>
                            <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${getLevelColor(risk.level)}`}>{risk.level}</span></td>
                            <td className="px-8 py-5"><span className="flex items-center gap-2 text-slate-500 font-bold tracking-tight"><span className={`w-2 h-2 rounded-full ${risk.status === 'Closed' ? 'bg-slate-700' : risk.status === 'Mitigated' ? 'bg-emerald-500/60' : 'bg-orange-500/60'}`} />{risk.status}</span></td>
                          </tr>
                        ))}
                        {riskRegister.length === 0 && (
                          <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic text-sm">{lang === 'ar' ? 'لم يتم تسجيل أي ذكاء تكتيكي.' : 'No tactical intelligence recorded.'}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* PERSISTENT VERSION INDICATOR */}
        {!user && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="px-6 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
               <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                 {lang === 'ar' ? 'الإصدار 4.0 مفعل - الذكاء الاستراتيجي' : 'v4.0 Strategic Intelligence Active'}
               </span>
            </div>
          </div>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'assessment' && (
        <>
        {/* CONTEXT SECTION */}
        <section id="context-section" className="bg-slate-900/70 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-normal flex items-center gap-3">
                {t.establishContext}
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    Step {contextStep} of 4
                </span>
              </h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-8 h-1 rounded-full ${contextStep >= s ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {contextStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block text-slate-300">
                      <span className="text-sm font-medium mb-2 block">{t.organization}</span>
                      <input
                          id="ctx_org"
                          className={`w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-lg ${tenant ? 'opacity-70 cursor-not-allowed' : ''}`}
                          placeholder="e.g., Saudi Ceramics Company"
                          value={context.organization}
                          readOnly={!!tenant}
                          onChange={(e) => handleContextChange("organization", e.target.value)}
                      />
                      {tenant && <p className="text-[10px] text-emerald-500 mt-1 uppercase tracking-widest">Verified from Company Registration</p>}
                    </label>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-slate-300 block">{t.companyLogo}</span>
                      <div 
                        className="h-[52px] border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center gap-3 hover:border-emerald-500/50 transition-all cursor-pointer bg-slate-800/50 relative overflow-hidden"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        {context.logoUrl ? (
                          <img src={context.logoUrl} alt="Logo" className="h-8 object-contain" />
                        ) : isUploadingLogo ? (
                          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FileUp size={18} className="text-slate-500" />
                            <span className="text-xs text-slate-500">{lang === 'ar' ? 'تحميل الشعار' : 'Upload Logo'}</span>
                          </>
                        )}
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setContextStep(2)}
                      disabled={!context.organization || !context.logoUrl}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
                    >
                      {t.next} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {contextStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="block text-slate-300 mb-1 font-medium text-sm">{t.frameworks}</div>
                  <div className="flex gap-2 flex-wrap mb-3">
                      {["ISO 31000", "NCA ECC", "NCA CSCC", "ISO 27001", "NIST CSF", "OHSA", "SASO", "SAMA", "CMA", "PDPL", "NDMO", "ISO 22301", "OT Standard", "Financial", "Operational"].map(fw => (
                        <button 
                            key={fw}
                            onClick={() => selectFramework(fw)}
                            className={`px-4 py-2 rounded-xl text-xs border transition-all ${context.frameworks.includes(fw) ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
                        >
                            {fw}
                        </button>
                      ))}
                  </div>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setContextStep(1)}
                      className="px-6 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2"
                    >
                      <ChevronLeft size={18} /> {t.back}
                    </button>
                    <button 
                      onClick={() => setContextStep(3)}
                      disabled={context.frameworks.length === 0}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
                    >
                      {t.next} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {contextStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="block text-slate-300">
                    <span className="text-sm font-medium mb-2 block">{t.scope}</span>
                    <textarea
                        id="ctx_scope"
                        rows={4}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g., Enterprise IT, Cybersecurity & GRC environment..."
                        value={context.scope}
                        onChange={(e) => handleContextChange("scope", e.target.value)}
                    />
                  </label>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setContextStep(2)}
                      className="px-6 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2"
                    >
                      <ChevronLeft size={18} /> {t.back}
                    </button>
                    <button 
                      onClick={() => setContextStep(4)}
                      disabled={!context.scope}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2"
                    >
                      {t.next} <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {contextStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="block text-slate-300">
                    <span className="text-sm font-medium mb-2 block">{t.riskAppetite}</span>
                    <textarea
                        id="ctx_appetite"
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g., Low appetite for compliance risks..."
                        value={context.risk_appetite}
                        onChange={(e) => handleContextChange("risk_appetite", e.target.value)}
                    />
                  </label>
                  <label className="block text-slate-300">
                    <span className="text-sm font-medium mb-2 block">{lang === 'ar' ? 'وصف المخاطر' : 'Risk Description'}</span>
                    <textarea
                        id="ctx_risk_desc"
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder={lang === 'ar' ? 'حدد المخاطر التي يتم تحليلها...' : 'Define the risks being analyzed...'}
                        value={(context as any).risk_description || ""}
                        onChange={(e) => handleContextChange("risk_description" as any, e.target.value)}
                    />
                  </label>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setContextStep(3)}
                      className="px-6 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2"
                    >
                      <ChevronLeft size={18} /> {t.back}
                    </button>
                    <button 
                      onClick={() => {
                        // Scroll to form section
                        document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {t.startAssessment}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </section>

        {/* RISK FORM */}
        <section id="form-section" className="bg-slate-900/70 rounded-xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h2 className="text-base font-normal flex items-center gap-2">
                {t.process}
                </h2>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button 
                    onClick={() => setAssessmentView('core')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${assessmentView === 'core' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Core Analysis
                  </button>
                  <button 
                    onClick={() => setAssessmentView('advanced')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${assessmentView === 'advanced' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Advanced Intelligence
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{t.templates}:</span>
                <select 
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px]"
                  onChange={(e) => {
                    const [cat, idx] = e.target.value.split(':');
                    if (cat && idx !== undefined) applyTemplate(cat as any, parseInt(idx));
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>{t.selectTemplate}</option>
                  <optgroup label={t.ohsa}>
                    {RISK_TEMPLATES.ohsa.map((r, i) => <option key={i} value={`ohsa:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label={t.production}>
                    {RISK_TEMPLATES.production.map((r, i) => <option key={i} value={`production:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label={t.financial}>
                    {RISK_TEMPLATES.financial.map((r, i) => <option key={i} value={`financial:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label={t.cybersecurity}>
                    {RISK_TEMPLATES.cybersecurity.map((r, i) => <option key={i} value={`cybersecurity:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label={t.nca}>
                    {RISK_TEMPLATES.ncaecc.map((r, i) => <option key={i} value={`ncaecc:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label={t.continuity}>
                    {RISK_TEMPLATES.iso22301.map((r, i) => <option key={i} value={`iso22301:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label="NIST CSF">
                    {RISK_TEMPLATES.nistcsf.map((r, i) => <option key={i} value={`nistcsf:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label="NCA ECC">
                    {RISK_TEMPLATES.ncaecc.map((r, i) => <option key={i} value={`ncaecc:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label="ISO 27001">
                    {RISK_TEMPLATES.iso27001.map((r, i) => <option key={i} value={`iso27001:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label="ISO 22301 (BCM)">
                    {RISK_TEMPLATES.iso22301.map((r, i) => <option key={i} value={`iso22301:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                  <optgroup label="Saudi Standards">
                    {RISK_TEMPLATES.saudistandards.map((r, i) => <option key={i} value={`saudistandards:${i}`}>{lang === 'ar' ? r.threat_ar : r.threat}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            {assessmentView === 'core' ? (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.asset} (EN)
                    <input
                    id="risk_asset"
                    className={getFieldClass('risk_asset')}
                    placeholder="e.g., Customer Database"
                    value={formData.asset}
                    onChange={(e) => handleFormChange("asset", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.asset} (AR)
                    <input
                    id="risk_asset_ar"
                    className={getFieldClass('risk_asset_ar')}
                    placeholder="مثال: قاعدة بيانات العملاء"
                    value={formData.asset_ar}
                    onChange={(e) => handleFormChange("asset_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.threat} (EN)
                    <input
                    id="risk_threat"
                    className={getFieldClass('risk_threat')}
                    placeholder="e.g., SQL Injection"
                    value={formData.threat}
                    onChange={(e) => handleFormChange("threat", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.threat} (AR)
                    <input
                    id="risk_threat_ar"
                    className={getFieldClass('risk_threat_ar')}
                    placeholder="مثال: حقن SQL"
                    value={formData.threat_ar}
                    onChange={(e) => handleFormChange("threat_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.vulnerability} (EN)
                    <input
                    id="risk_vuln"
                    className={getFieldClass('risk_vuln')}
                    placeholder="e.g., Unpatched web server"
                    value={formData.vulnerability}
                    onChange={(e) => handleFormChange("vulnerability", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.vulnerability} (AR)
                    <input
                    id="risk_vuln_ar"
                    className={getFieldClass('risk_vuln_ar')}
                    placeholder="مثال: خادم ويب غير محدث"
                    value={formData.vulnerability_ar}
                    onChange={(e) => handleFormChange("vulnerability_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.riskStatement} (EN)
                    <textarea
                    id="risk_statement"
                    rows={2}
                    className={getFieldClass('risk_statement')}
                    placeholder="e.g., Potential data breach leading to regulatory fines..."
                    value={formData.riskStatement}
                    onChange={(e) => handleFormChange("riskStatement", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.riskStatement} (AR)
                    <textarea
                    id="risk_statement_ar"
                    rows={2}
                    className={getFieldClass('risk_statement_ar')}
                    placeholder="مثال: خرق محتمل للبيانات يؤدي إلى غرامات تنظيمية..."
                    value={formData.riskStatement_ar}
                    onChange={(e) => handleFormChange("riskStatement_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                <p className="text-xs font-normal text-slate-400 uppercase tracking-wider">{t.inherentScoring}</p>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`block text-slate-300 p-2 rounded-lg transition-all ${activeVoiceField === 'likelihood' ? 'bg-emerald-500/10 ring-1 ring-emerald-500' : ''}`}>
                    {t.likelihood}
                    <input
                        type="range" min="1" max="5" step="1"
                        className="w-full accent-emerald-500"
                        value={formData.likelihood}
                        onChange={(e) => handleFormChange("likelihood", e.target.value)}
                    />
                    <div className="flex justify-between text-[10px] mt-1 text-slate-500">
                        <span>{lang === 'ar' ? 'نادر' : 'Rare'}</span><span>{lang === 'ar' ? 'مؤكد' : 'Certain'}</span>
                    </div>
                    </label>
                    <label className={`block text-slate-300 p-2 rounded-lg transition-all ${activeVoiceField === 'impact' ? 'bg-emerald-500/10 ring-1 ring-emerald-500' : ''}`}>
                    {t.impact}
                    <input
                        type="range" min="1" max="5" step="1"
                        className="w-full accent-red-500"
                        value={formData.impact}
                        onChange={(e) => handleFormChange("impact", e.target.value)}
                    />
                    <div className="flex justify-between text-[10px] mt-1 text-slate-500">
                        <span>{lang === 'ar' ? 'ضئيل' : 'Negligible'}</span><span>{lang === 'ar' ? 'كارثي' : 'Catastrophic'}</span>
                    </div>
                    </label>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-xs">{t.score}: <b className="text-base font-normal">{(formData.likelihood || 0) * (formData.impact || 0)}</b></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${getLevelColor(getRiskLevel((formData.likelihood || 0) * (formData.impact || 0)))}`}>
                    {getRiskLevel((formData.likelihood || 0) * (formData.impact || 0))}
                    </span>
                </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.existingControls} (EN)
                    <textarea
                        id="risk_controls"
                        rows={2}
                        className={getFieldClass('risk_controls')}
                        placeholder="e.g., WAF, Monthly patching..."
                        value={formData.existingControls}
                        onChange={(e) => handleFormChange("existingControls" as any, e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.existingControls} (AR)
                    <textarea
                        id="risk_controls_ar"
                        rows={2}
                        className={getFieldClass('risk_controls_ar')}
                        placeholder="مثال: جدار حماية تطبيقات الويب، التحديثات الشهرية..."
                        value={formData.existingControls_ar}
                        onChange={(e) => handleFormChange("existingControls_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.treatmentOption}
                    <select
                    className={getFieldClass('risk_treatment')}
                    value={formData.treatmentOption}
                    onChange={(e) => handleFormChange("treatmentOption", e.target.value)}
                    >
                    <option value="Avoid">{lang === 'ar' ? 'تجنب' : 'Avoid'}</option>
                    <option value="Mitigate">{lang === 'ar' ? 'تخفيف' : 'Mitigate'}</option>
                    <option value="Transfer">{lang === 'ar' ? 'نقل' : 'Transfer'}</option>
                    <option value="Accept">{lang === 'ar' ? 'قبول' : 'Accept'}</option>
                    </select>
                </label>
                <label className="block text-slate-300">
                    {t.status}
                    <select
                    className={getFieldClass('risk_status')}
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    >
                    <option value="Open">{lang === 'ar' ? 'مفتوح' : 'Open'}</option>
                    <option value="In Progress">{lang === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                    <option value="Mitigated">{lang === 'ar' ? 'تم التخفيف' : 'Mitigated'}</option>
                    <option value="Closed">{lang === 'ar' ? 'مغلق' : 'Closed'}</option>
                    </select>
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.treatmentPlan} (EN)
                    <textarea
                        id="risk_plan"
                        rows={2}
                        className={getFieldClass('risk_plan')}
                        placeholder="e.g., Implement MFA, Upgrade encryption..."
                        value={formData.treatmentPlan}
                        onChange={(e) => handleFormChange("treatmentPlan", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300 text-right" dir="rtl">
                    {t.treatmentPlan} (AR)
                    <textarea
                        id="risk_plan_ar"
                        rows={2}
                        className={getFieldClass('risk_plan_ar')}
                        placeholder="مثال: تنفيذ المصادقة الثنائية، ترقية التشفير..."
                        value={formData.treatmentPlan_ar}
                        onChange={(e) => handleFormChange("treatmentPlan_ar", e.target.value)}
                    />
                </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <label className="block text-slate-300">
                    {t.owner}
                    <input
                    className={getFieldClass('risk_owner')}
                    placeholder="e.g., IT Manager"
                    value={formData.owner}
                    onChange={(e) => handleFormChange("owner", e.target.value)}
                    />
                </label>
                <label className="block text-slate-300">
                    {t.dueDate}
                    <input
                    type="date"
                    className={getFieldClass('risk_due')}
                    value={formData.dueDate}
                    onChange={(e) => handleFormChange("dueDate", e.target.value)}
                    />
                </label>
                </div>
            </div>
            </div>
            ) : (
              <div className="space-y-12 pb-10">
                <RiskDescription 
                  data={formData.enhancedDescription} 
                  onChange={(d) => setFormData(p => ({ ...p, enhancedDescription: d }))} 
                  lang={lang} 
                />
                
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                     <div className="space-y-6">
                        <RootCauseAnalysis 
                          data={formData.rca} 
                          onChange={(d) => setFormData(p => ({ ...p, rca: d }))} 
                          lang={lang} 
                        />
                        <FiveWhysFlow data={formData.rca?.fiveWhys || []} />
                     </div>
                     <IshikawaDiagram data={formData.rca} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                     <SWOTAnalysis 
                       data={formData.swot} 
                       onChange={(d) => setFormData(p => ({ ...p, swot: d }))} 
                       lang={lang} 
                     />
                     <SWOTGrid data={formData.swot} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <SPRETZELMapping 
                      data={formData.spretzel} 
                      onChange={(d) => setFormData(p => ({ ...p, spretzel: d }))} 
                      lang={lang} 
                    />
                    <SPRETZELRadial data={formData.spretzel} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                      <StakeholderManagement 
                        data={formData.stakeholders} 
                        onChange={(d) => setFormData(p => ({ ...p, stakeholders: d }))} 
                        lang={lang} 
                      />
                      <StakeholderMatrix data={formData.stakeholders} />
                    </div>
                    <div className="space-y-6">
                      <KRIModule 
                        data={formData.kri} 
                        onChange={(d) => setFormData(p => ({ ...p, kri: d }))} 
                        lang={lang} 
                      />
                      <KRITrendChart data={formData.kri} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col md:flex-row gap-4 items-start">
            <button
                onClick={addOrUpdateRisk}
                className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
                {selectedRiskIndex !== null ? t.updateRisk : t.addRisk}
            </button>

            {/* AI PANEL */}
            <div className="flex-1 w-full bg-slate-800/30 rounded-xl border border-slate-700 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-700">
                    <img 
                      src="https://picsum.photos/seed/cyber-humanoid/100/100" 
                      alt="AI" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-normal text-sm">{t.aiSuggestion}</h3>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={speakAiOutput}
                    disabled={!aiOutput}
                    className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
                    title="Speak Suggestion"
                    >
                    🔊
                    </button>
                    <button
                    onClick={assessmentView === 'advanced' ? generateAdvancedInsights : callGemini}
                    disabled={aiLoading || (!formData.asset || !formData.threat)}
                    className={`px-3 py-1.5 rounded-lg text-slate-950 text-xs font-normal disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${assessmentView === 'advanced' ? 'bg-indigo-400 hover:bg-indigo-300' : 'bg-sky-500 hover:bg-sky-400'}`}
                    >
                    {aiLoading ? "Thinking..." : assessmentView === 'advanced' ? "✨ AI Strategic Analysis" : t.suggestMitigation}
                    </button>
                    <button 
                      onClick={() => setUseLocalLlm(!useLocalLlm)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-normal border transition-all ${useLocalLlm || isOffline ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                      title={isOffline ? "Offline Mode Active" : "Toggle Local LLM"}
                    >
                      {isOffline ? "OFFLINE" : useLocalLlm ? "LOCAL" : "AUTO"}
                    </button>
                </div>
                </div>
                <p className="text-xs text-slate-400">
                {aiLoading ? "Analyzing risk factors and ISO 31000 best practices..." : aiOutput || "Select a risk from the register to get AI-powered mitigation suggestions."}
                </p>
            </div>
            </div>
        </section>

        {/* RISK REGISTER */}
        <section id="register-section" className="bg-slate-900/70 rounded-xl border border-slate-800 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div>
                <h2 className="text-base font-normal">{t.riskRegisterTitle} ({riskRegister.length} Items)</h2>
                <span className="text-xs text-slate-400">Click a row to edit & analyze</span>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={loadFullLibrary}
                  disabled={isLoadingLibrary || context.frameworks.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-normal hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isLoadingLibrary ? "Loading Library..." : "📚 Load Full Library (100+ Risks)"}
                </button>
                <button
                  onClick={generateAIRisks}
                  disabled={isGeneratingRisks || !context.frameworks}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 text-xs font-normal hover:bg-sky-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isGeneratingRisks ? "Generating..." : "✨ AI: Load 100 Risks"}
                </button>
                <div className="relative flex-1 md:w-64">
                <input 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs"
                    placeholder="Search risks..."
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                </div>
            </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider">
                <tr>
                    <th className="px-4 py-3 border-b border-slate-700">ID</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.asset}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.threat}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.inherent}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.residual}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.status}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.treatmentOption}</th>
                    <th className="px-4 py-3 border-b border-slate-700">{t.actions}</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {riskRegister.length === 0 ? (
                    <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 italic">
                        No risks identified yet. Use the form above to start your assessment.
                    </td>
                    </tr>
                ) : (
                    riskRegister.map((risk, idx) => (
                    <tr 
                        key={risk.id} 
                        onClick={() => editRisk(idx)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedRiskIndex === idx ? 'bg-sky-500/5 border-l-2 border-l-sky-500' : ''}`}
                    >
                        <td className="px-4 py-3 font-mono text-slate-400">{risk.id}</td>
                        <td className="px-4 py-3 font-normal">{lang === 'ar' && risk.asset_ar ? risk.asset_ar : risk.asset}</td>
                        <td className="px-4 py-3 text-slate-300">{lang === 'ar' && risk.threat_ar ? risk.threat_ar : risk.threat}</td>
                        <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${getLevelColor(risk.level)}`}>
                            {risk.score} {risk.level}
                        </span>
                        </td>
                        <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${getLevelColor(risk.residualLevel)}`}>
                            {risk.residualScore} {risk.residualLevel}
                        </span>
                        </td>
                        <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${risk.status === 'Closed' ? 'bg-slate-500' : risk.status === 'Mitigated' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            {risk.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{risk.treatmentOption}</td>
                        <td className="px-4 py-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteRisk(idx); }}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        >
                            🗑️
                        </button>
                </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>

            {/* EXPORTS */}
            <div className="mt-6 p-4 bg-slate-800/20 rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between gap-2">
                <h3 className="font-normal text-sm">{t.exportReports}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={generatePDF}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-normal hover:bg-red-500 transition-colors"
                    >
                        Export PDF
                    </button>
                    <button
                        onClick={generateWord}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-normal hover:bg-blue-500 transition-colors"
                    >
                        Export Word
                    </button>
                    <button
                        onClick={() => generateJson()}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-normal hover:bg-emerald-400 transition-all"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={saveToCloud}
                        disabled={isSaving}
                        className={`px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-normal hover:bg-indigo-500 transition-colors flex items-center gap-1 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!user ? "Sign in to save" : "Save to Cloud"}
                    >
                         {isSaving ? "Saving..." : `☁️ ${t.saveToCloud}`}
                    </button>
                </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                Reports include full context, risk register, and AI-suggested treatments. Cloud saves are stored in your private Firebase vault.
                </p>
            </div>
        </section>
        </>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'matrix' && (
          <div className="space-y-8 pb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <Heatmap risks={riskRegister} />
              <ParetoChart risks={riskRegister} />
            </div>
            
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Predictive Performance Indicators</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {riskRegister.filter(r => r.kri).slice(0, 3).map((r, i) => (
                  <KRITrendChart key={i} data={r.kri!} />
                ))}
                {riskRegister.filter(r => r.kri).length === 0 && (
                   <div className="col-span-3">
                     <KRITrendChart data={{ indicator: 'Systemic Security Risk', threshold: 7 }} />
                   </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/60 rounded-[40px] border border-slate-800 p-10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Shield size={120} className="text-emerald-500" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-light text-white tracking-tight">{lang === 'ar' ? 'سجل تصنيف المخاطر' : 'Risk Categorization Registry'}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mt-1">Cross-referencing Intelligence & Mapping</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-black uppercase">{riskRegister.length} Total Risks</span>
                   </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/50 backdrop-blur-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-500 uppercase tracking-widest text-[9px] font-black border-b border-slate-800">
                    <tr>
                      <th className="px-8 py-5">#</th>
                      <th className="px-8 py-5">Risk ID</th>
                      <th className="px-8 py-5">Asset / Category</th>
                      <th className="px-8 py-5">Inherent Level</th>
                      <th className="px-8 py-5">Treatment</th>
                      <th className="px-8 py-5">Residual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {riskRegister.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-12 text-center text-slate-600 italic">No risks available in the active registry cluster.</td>
                      </tr>
                    ) : riskRegister.map((r, i) => (
                      <tr key={r.id || i} className="hover:bg-white/5 transition-all group/row">
                        <td className="px-8 py-5 text-slate-600 font-mono">{i + 1}</td>
                        <td className="px-8 py-5 font-bold text-white tracking-wider font-mono">{(r.id || `R-${i+1}`).split('-').pop()}</td>
                        <td className="px-8 py-5">
                          <div className="text-slate-300 font-medium">{(lang === 'ar' && r.asset_ar) ? r.asset_ar : (r.asset || r.asset_category)}</div>
                          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{(lang === 'ar' && r.threat_ar) ? r.threat_ar : r.threat}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-1 rounded text-[10px] border font-black uppercase tracking-tighter ${getLevelColor(r.level || "Medium")}`}>
                            {r.level}
                          </span>
                        </td>
                        <td className="px-8 py-5 font-medium text-slate-400">
                           {r.treatmentOption || 'Mitigate'}
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-2 py-1 rounded text-[10px] border font-black opacity-60 ${getLevelColor(r.residualLevel || "Low")}`}>
                             {r.residualLevel || "Low"}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'analytics' && (
          <div className="space-y-12 pb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col gap-2">
               <h2 className="text-xl font-light tracking-tight text-white">{lang === 'ar' ? t.intelligenceHeader : 'Advanced Risk Intelligence'}</h2>
               <p className="text-xs text-slate-500 uppercase tracking-widest">{t.intelligenceSubHeader}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <RiskLifecycle lang={lang} />
                <div className="grid md:grid-cols-2 gap-8">
                  <StakeholderMatrix data={formData.stakeholders || {}} lang={lang} />
                  <ComplianceMapping risks={riskRegister} lang={lang} />
                </div>
              </div>
              
              <div className="space-y-8">
                 {selectedRiskIndex !== null ? (
                   <>
                     <IshikawaDiagram data={formData.rca || {}} lang={lang} />
                     <div className="grid md:grid-cols-2 gap-8">
                       <SPRETZELRadial data={formData.spretzel || {}} lang={lang} />
                       <SWOTGrid data={formData.swot || {}} lang={lang} />
                     </div>
                     <FiveWhysFlow data={formData.rca?.fiveWhys || []} lang={lang} />
                   </>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl text-center space-y-4">
                     <div className="p-4 bg-purple-500/10 rounded-full text-purple-400">
                       <Zap size={32} />
                     </div>
                     <h3 className="text-sm font-bold text-slate-300">{t.intelligenceSelectRisk}</h3>
                     <p className="text-xs text-slate-500 max-w-xs">{t.intelligenceSelectDesc}</p>
                     <button 
                       onClick={() => setActiveTab('history')}
                       className="px-6 py-2 bg-purple-500 text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-widest hover:bg-purple-400 transition-all"
                     >
                       {t.intelligenceBrowseBtn}
                     </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'history' && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-normal tracking-tight">{t.history}</h2>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{lang === 'ar' ? 'السجلات المحفوظة في السحابة' : 'Saved Cloud Records'}</p>
              </div>
              <button 
                onClick={fetchHistory}
                className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Refresh History"
              >
                <RefreshCw size={18} className={isLoadingHistory ? 'animate-spin' : ''} />
              </button>
            </div>

            {!user ? (
              <div className="py-20 text-center">
                <span className="text-4xl mb-4 block">🔒</span>
                <h3 className="text-base font-normal mb-2">{lang === 'ar' ? 'سجل الدخول للمتابعة' : 'Sign In to View History'}</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  {lang === 'ar' ? 'يتم تخزين سجل المخاطر الخاص بك بشكل آمن في السحابة. سجل الدخول للوصول إلى بياناتك.' : 'Your risk history is securely stored in the cloud. Sign in to access your data.'}
                </p>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 bg-sky-500 text-slate-950 text-xs font-normal rounded-lg hover:bg-sky-400 transition-all"
                >
                  {t.signIn}
                </button>
              </div>
            ) : isLoadingHistory ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 tracking-widest uppercase">{lang === 'ar' ? 'جاري تحميل السجلات...' : 'Loading History...'}</p>
              </div>
            ) : historyRisks.length === 0 ? (
              <div className="py-20 text-center">
                <span className="text-4xl mb-4 block">📂</span>
                <h3 className="text-base font-normal mb-2">{lang === 'ar' ? 'لا توجد سجلات' : 'No Records Found'}</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  {lang === 'ar' ? 'لم تقم بحفظ أي مخاطر في السحابة بعد. ابدأ تقييمك الآن وقم بمزامنة بياناتك.' : 'You haven\'t saved any risks to the cloud yet. Start your assessment and sync your data.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/50 text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-3 font-normal">{lang === 'ar' ? 'الأصل' : 'Asset'}</th>
                      <th className="px-6 py-3 font-normal">{lang === 'ar' ? 'التهديد' : 'Threat'}</th>
                      <th className="px-6 py-3 font-normal">{lang === 'ar' ? 'المستوى' : 'Level'}</th>
                      <th className="px-6 py-3 font-normal">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="px-6 py-3 font-normal">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {historyRisks.map((risk) => (
                      <tr 
                        key={risk.id} 
                        onClick={() => { 
                          const idx = riskRegister.findIndex(x => x.id === risk.id);
                          if (idx !== -1) {
                            editRisk(idx);
                          } else {
                            // If not in current register, add it and then edit
                            setRiskRegister(prev => [...prev, risk]);
                            // Wait for state update to find the new index
                            setTimeout(() => {
                              const newIdx = riskRegister.length; // Approximate, but better to use id
                              setSelectedRiskIndex(newIdx); 
                              setFormData(risk);
                            }, 100);
                          }
                          setActiveTab('assessment'); 
                        }}
                        className="hover:bg-slate-700/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-white">{lang === 'ar' && risk.asset_ar ? risk.asset_ar : risk.asset}</td>
                        <td className="px-6 py-4 text-slate-400">{lang === 'ar' && risk.threat_ar ? risk.threat_ar : risk.threat}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${getLevelColor(risk.level)}`}>
                            {risk.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span className={`w-1.5 h-1.5 rounded-full ${risk.status === 'Closed' ? 'bg-slate-500' : risk.status === 'Mitigated' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                            {risk.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {risk.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'audit' && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-6 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={`flex items-center justify-between border-b border-slate-800 pb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={lang === 'ar' ? 'text-right' : ''}>
                <h2 className="text-lg font-normal tracking-tight">{lang === 'ar' ? t.auditHeader : 'Auditor\'s Eye - Intelligent Audit & Compliance'}</h2>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{t.auditSubHeader}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-normal text-slate-300 flex items-center gap-2">
                  <FileUp size={14} className="text-emerald-500" />
                  {t.auditUploadTitle}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {t.auditUploadDesc}
                </p>
                
                <div 
                  className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 transition-all cursor-pointer bg-slate-900/50 group"
                  onClick={() => document.getElementById('evidence-upload')?.click()}
                >
                  {auditEvidence ? (
                    auditMimeType === "application/pdf" ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        <FileUp size={40} className="text-emerald-500 mb-2" />
                        <span className="text-xs text-emerald-400 font-medium">{lang === 'ar' ? 'تم تحميل PDF' : 'PDF Uploaded'}</span>
                      </div>
                    ) : (
                      <img src={auditEvidence} alt="Evidence" className="max-h-32 rounded shadow-xl" />
                    )
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
                        <Camera size={20} />
                      </div>
                      <span className="text-[10px] text-slate-500">{t.auditUploadPlaceholder}</span>
                    </>
                  )}
                  <input 
                    id="evidence-upload" 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const mime = file.type || "image/jpeg";
                        setAuditMimeType(mime);
                        auditMimeTypeRef.current = mime;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAuditEvidence(reader.result as string);
                          auditEvidenceRef.current = reader.result as string;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {auditEvidence && (
                  <button 
                    onClick={() => handleAudit('current-risk')}
                    disabled={isAuditing}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 rounded-lg text-xs font-normal hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isAuditing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        {t.auditAnalyzing}
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        {t.auditRunBtn}
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-normal text-slate-300 flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-emerald-500" />
                  {t.auditReportTitle}
                </h3>
                <div className="min-h-[180px] bg-slate-950/50 rounded-lg p-3 border border-slate-800 overflow-y-auto max-h-[300px] text-[11px] leading-relaxed">
                  {auditReport ? (
                    <div className="prose prose-invert prose-xs max-w-none">
                      <Markdown>{auditReport}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-2 py-10">
                      <Search size={24} strokeWidth={1} />
                      <p className="text-[10px]">{t.auditNoReport}</p>
                    </div>
                  )}
                </div>
                {auditReport && (
                  <button 
                    onClick={() => generatePDF()}
                    className="w-full py-2 border border-slate-700 text-slate-400 rounded-lg text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={12} />
                    {t.auditDownloadBtn}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-normal text-slate-300 mb-4 flex items-center gap-2">
                <History size={14} className="text-emerald-500" />
                {t.complianceTimeline}
              </h3>
              <div className="space-y-2">
                {riskRegister.filter(r => r.level === 'High' || r.level === 'Critical').map(risk => (
                  <div key={risk.id} className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${risk.level === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                      <div>
                        <p className="text-[11px] text-slate-200 font-normal">{lang === 'ar' && risk.asset_ar ? risk.asset_ar : risk.asset}: {lang === 'ar' && risk.threat_ar ? risk.threat_ar : risk.threat}</p>
                        <p className="text-[9px] text-slate-500">{lang === 'ar' ? 'تاريخ الاستحقاق' : 'Due'}: {risk.dueDate} | {lang === 'ar' ? 'المالك' : 'Owner'}: {risk.owner}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const idx = riskRegister.findIndex(x => x.id === risk.id);
                        if (idx !== -1) editRisk(idx); 
                        setActiveTab('assessment');
                      }}
                      className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[9px] hover:bg-slate-700 transition-all"
                    >
                      {lang === 'ar' ? 'إعادة التقييم' : 'Re-Assess'}
                    </button>
                  </div>
                ))}
                {riskRegister.filter(r => r.level === 'High' || r.level === 'Critical').length === 0 && (
                  <p className="text-[10px] text-slate-600 text-center py-4 italic">{t.noHighRisks}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'vision' && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-6 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className={`flex items-center justify-between border-b border-slate-800 pb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={lang === 'ar' ? 'text-right' : ''}>
                <h2 className="text-lg font-normal tracking-tight">{lang === 'ar' ? t.visionHeader : t.visionReview}</h2>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{t.visionSubHeader}</p>
              </div>
              <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500">
                <Eye size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-normal text-slate-300 flex items-center gap-2">
                  <FileUp size={14} className="text-sky-500" />
                  {t.uploadDoc}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {t.visionUploadDesc}
                </p>
                
                <div 
                  className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-sky-500/50 transition-all cursor-pointer bg-slate-900/50 group"
                  onClick={() => document.getElementById('vision-upload')?.click()}
                >
                  {selectedImage ? (
                    visionMimeType === "application/pdf" ? (
                      <div className="relative group w-full h-48 flex items-center justify-center bg-slate-800 rounded">
                        <div className="flex flex-col items-center justify-center">
                          <FileUp size={48} className="text-sky-500 mb-2" />
                          <span className="text-sm font-medium text-sky-400">{lang === 'ar' ? 'تم تحديد PDF' : 'PDF Selected'}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <span className="text-white text-[10px]">{lang === 'ar' ? 'تغيير الوثيقة' : 'Change Document'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <img src={selectedImage} alt="Selected" className="max-h-48 rounded shadow-xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <span className="text-white text-[10px]">{lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 group-hover:text-sky-500 transition-colors">
                        <Camera size={24} />
                      </div>
                      <span className="text-[10px] text-slate-500">{lang === 'ar' ? 'انقر للتحميل أو اسحب وأفلت' : 'Click to upload or drag & drop'}</span>
                    </>
                  )}
                  <input 
                    id="vision-upload" 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </div>

                {selectedImage && (
                  <button 
                    onClick={analyzeDocument}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-sky-500 text-slate-950 rounded-lg text-xs font-normal hover:bg-sky-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        {lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        {lang === 'ar' ? 'بدء تحليل الوثيقة' : 'Start Doc Analysis'}
                      </>
                    )}
                  </button>
                )}

                {visionError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-[10px]">
                    <AlertTriangle size={14} />
                    {visionError}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-normal text-slate-300 flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-sky-500" />
                  {t.analysisResults}
                </h3>
                <div className="min-h-[250px] bg-slate-950/50 rounded-lg p-4 border border-slate-800 overflow-y-auto max-h-[400px] text-[11px] leading-relaxed">
                  {visionResult ? (
                    <div className="prose prose-invert prose-xs max-w-none">
                      <Markdown>{visionResult}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-3 py-16">
                      <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center">
                        <Search size={24} strokeWidth={1} />
                      </div>
                      <p className="text-[10px]">{lang === 'ar' ? 'لم يتم إجراء تحليل بعد. قم بتحميل وثيقة للبدء.' : 'No analysis performed yet. Upload a document to start.'}</p>
                    </div>
                  )}
                </div>
                {visionResult && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Logic to import findings into risk register could go here
                        alert(lang === 'ar' ? 'تم نسخ النتائج إلى الحافظة' : 'Results copied to clipboard');
                        navigator.clipboard.writeText(visionResult);
                      }}
                      className="flex-1 py-2 border border-slate-700 text-slate-400 rounded-lg text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      {lang === 'ar' ? 'نسخ النتائج' : 'Copy Results'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {user && tenant && (!showLicenseGate || activeTab === 'admin') && activeTab === 'deployment' && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-6 space-y-6">
            <h2 className="text-base font-normal border-b border-slate-800 pb-2">
              {t.deploymentGuide}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <h3 className="text-sky-400 font-normal flex items-center gap-2">
                  <span>🐳</span> {t.dockerVersion}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.dockerInstructions}
                </p>
                <pre className="bg-slate-950 p-3 rounded text-[10px] font-mono text-emerald-400 overflow-x-auto">
                  {`# Build the image\ndocker build -t risk-manager .\n\n# Run the container\ndocker run -p 3000:3000 risk-manager`}
                </pre>
                <p className="text-[10px] text-slate-500">
                  {t.dockerEnvNote}
                </p>
              </div>

              <div className="space-y-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <h3 className="text-sky-400 font-normal flex items-center gap-2">
                  <span>🖥️</span> {t.desktopVersion}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.desktopInstructions}
                </p>
                <pre className="bg-slate-950 p-3 rounded text-[10px] font-mono text-emerald-400 overflow-x-auto">
                  {`# Install dependencies\nnpm install\n\n# Build the installer\nnpm run build:desktop`}
                </pre>
                <p className="text-[10px] text-slate-500">
                  {t.desktopNote}
                </p>
              </div>
            </div>

            <div className="p-4 bg-sky-500/10 rounded-lg border border-sky-500/30 mb-4">
              <h3 className="text-sky-400 text-sm font-normal mb-2">📚 {lang === 'ar' ? 'دليل المستخدم' : 'User Guide'}</h3>
              <p className="text-xs text-slate-400 mb-3">
                {lang === 'ar' ? 'قم بتنزيل دليل المستخدم الكامل باللغتين الإنجليزية والعربية.' : 'Download the full user guide in both English and Arabic.'}
              </p>
              <button 
                onClick={() => {
                  const guideContent = document.getElementById('guide-content')?.textContent || '';
                  const blob = new Blob([guideContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'USER_GUIDE.md';
                  a.click();
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs transition-colors"
              >
                {lang === 'ar' ? 'تنزيل الدليل' : 'Download Guide'}
              </button>
              <div id="guide-content" className="hidden">
                {`# RiskGuard ISO 31000 - User Guide / دليل المستخدم

## English Version

### 1. Introduction
RiskGuard is an AI-powered Enterprise Risk Management (ERM) platform designed to align with ISO 31000 standards. It helps organizations identify, analyze, evaluate, and treat risks with the assistance of Generative AI.

### 2. Prerequisites
- **Node.js**: Version 20 or higher.
- **Firebase**: A configured Firebase project (Firestore & Auth).
- **API Key**: A valid Google AI Studio (Gemini) API key.
- **Browser**: Modern browser (Chrome, Edge, Safari).

### 3. Getting Started
1. **Authentication**: Sign in using Google or Email to enable cloud syncing.
2. **Establish Context**: Define your Organization, Scope, and select Frameworks (ISO 31000, NCA, etc.).
3. **Risk Assessment**:
   - Use the **Assessment** tab to add risks.
   - Fill in Asset, Threat, and Vulnerability.
   - Score the risk using Likelihood and Impact (1-5).
4. **AI Mitigation**: Select a risk and click "Suggest Mitigation" to get AI-powered treatment plans.
5. **Doc Analysis**: Use the **Vision** tab to upload document images for automated risk extraction and validation.
6. **Audit**: Upload evidence (photos/docs) in the **Audit** tab for AI-driven compliance verification.

### 4. Exporting Reports
- Export your risk register as **PDF**, **Word**, or **JSON** from the Assessment tab.

---

## النسخة العربية (Arabic Version)

### 1. مقدمة
"ريسك جارد" هي منصة لإدارة مخاطر المؤسسات مدعومة بالذكاء الاصطناعي، مصممة لتتوافق مع معايير ISO 31000. تساعد المنظمات على تحديد وتحليل وتقييم ومعالجة المخاطر بمساعدة الذكاء الاصطناعي التوليدي.

### 2. المتطلبات الأساسية
- **Node.js**: الإصدار 20 أو أعلى.
- **Firebase**: مشروع Firebase مهيأ (Firestore & Auth).
- **مفتاح API**: مفتاح صالح من Google AI Studio (Gemini).
- **المتصفح**: متصفح حديث (Chrome, Edge, Safari).

### 3. البدء في الاستخدام
1. **المصادقة**: سجل الدخول باستخدام Google أو البريد الإلكتروني لتمكين المزامنة السحابية.
2. **تحديد السياق**: حدد اسم المنظمة، النطاق، واختر الأطر المعمول بها (ISO 31000، NCA، إلخ).
3. **تقييم المخاطر**:
   - استخدم علامة تبويب **التقييم** لإضافة المخاطر.
   - املأ بيانات الأصل، التهديد، ونقطة الضعف.
   - قيم الخطر باستخدام الاحتمالية والأثر (1-5).
4. **معالجة الذكاء الاصطناعي**: اختر خطراً وانقر على "اقتراح معالجة" للحصول على خطط معالجة مدعومة بالذكاء الاصطناعي.
5. **تحليل الوثائق**: استخدم علامة تبويب **الرؤية** لتحميل صور الوثائق لاستخراج المخاطر والتحقق منها تلقائياً.
6. **التدقيق**: قم بتحميل الأدلة (صور/وثائق) في علامة تبويب **التدقيق** للتحقق من الامتثال بواسطة الذكاء الاصطناعي.

### 4. تصدير التقارير
- يمكنك تصدير سجل المخاطر بصيغة **PDF** أو **Word** أو **JSON** من علامة تبويب التقييم.`}
              </div>
            </div>

            <div className="p-4 bg-sky-500/10 rounded-lg border border-sky-500/30 mb-4">
              <h3 className="text-sky-400 text-sm font-normal mb-2">🔊 Audio Diagnostics</h3>
              <p className="text-xs text-slate-400 mb-3">
                Use this to verify your speakers are working correctly within the application.
              </p>
              <button 
                onClick={testAudio}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs transition-colors"
              >
                Play Test Tone
              </button>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <h3 className="text-amber-400 text-sm font-normal mb-2">⚠️ {t.importantNote}</h3>
              <p className="text-xs text-slate-400">
                {t.connectivityNote}
              </p>
            </div>
          </section>
        )}

        {user && activeTab === 'profile' && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 border-b border-slate-800 pb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
                  {userProfile?.photo_file_name || user.photoURL ? (
                    <img src={userProfile?.photo_file_name || user.photoURL || ""} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={40} className="text-slate-600" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile?.name || user.displayName || 'Anonymous'}</h2>
                <p className="text-slate-500 text-sm">{user.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded text-[10px] uppercase tracking-widest font-bold">
                    {tenant?.name || 'Standard User'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.displayName}</label>
                  <input 
                    type="text" 
                    value={userProfile?.name || ""} 
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:border-sky-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.photoUrl}</label>
                  <input 
                    type="text" 
                    value={userProfile?.photo_file_name || ""} 
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, photo_file_name: e.target.value } : null)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:border-sky-500 outline-none transition-all"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button 
                  onClick={async () => {
                    if (!user || !userProfile) return;
                    setIsSaving(true);
                    try {
                      await updateDoc(doc(masterDb, "users", user.uid), {
                        name: userProfile.name,
                        photo_file_name: userProfile.photo_file_name,
                        updatedAt: new Date().toISOString()
                      });
                      alert(t.updateSuccess);
                    } catch (e) {
                      console.error("Profile update failed:", e);
                      alert("Update failed. Please try again.");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-sky-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-sky-400 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <ClipboardCheck size={14} />}
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm(t.confirmDelete)) {
                      try {
                        await deleteDoc(doc(masterDb, "users", user!.uid));
                        await deleteUser(user!);
                        alert(t.accountDeleted);
                        window.location.reload();
                      } catch (e: any) {
                        if (e.code === 'auth/requires-recent-login') {
                          alert("Please log out and log back in to delete your account for security reasons.");
                        } else {
                          alert("Failed to delete account. Please contact support.");
                        }
                      }
                    }
                  }}
                  className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <X size={14} />
                  {t.deleteAccount}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'admin' && (user?.email?.toLowerCase() === 'aaroomi@gmail.com' || user?.email?.toLowerCase() === 'admin@metaworks.com' || (user as any)?.role === 'sysadmin') && (
          <section className="bg-slate-900/70 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-normal tracking-tight text-indigo-400 flex items-center gap-2">
                  <Key size={20} />
                  Admin License Portal
                </h2>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">Generate & Manage Customer Licenses</p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const lq = query(collection(masterDb, 'licenses'), orderBy('createdAt', 'desc'));
                    const lsnap = await getDocs(lq);
                    setAdminLicenses(lsnap.docs.map(d => ({id: d.id, ...d.data()})));
                  } catch (e) {}
                }}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-xs flex items-center gap-2 transition-colors"
                title="Refresh Licenses"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="mb-8 p-6 bg-slate-800/20 border border-slate-700/50 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Generate Customer Key</h3>
                <p className="text-[10px] text-slate-500 max-w-sm mt-1">
                  Create single-use license codes to distribute to enterprise customers for tenant registration.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Select Tier:</span>
                  <select 
                    id="licenseTierDropdown"
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none"
                  >
                    <option value="trial">Trial (14 Days)</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half-Yearly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={async () => {
                  const tierEl = document.getElementById('licenseTierDropdown') as HTMLSelectElement;
                  const tier = tierEl ? tierEl.value : 'monthly';
                  let days = 30;
                  if (tier === 'trial') days = 14;
                  if (tier === 'quarterly') days = 90;
                  if (tier === 'half-yearly') days = 180;
                  if (tier === 'yearly') days = 365;

                  const expirationDate = new Date();
                  expirationDate.setDate(expirationDate.getDate() + days);

                  const newCode = ((tier === 'trial') ? 'TRL-' : 'ISO-') + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                  try {
                    await setDoc(doc(masterDb, 'licenses', newCode), {
                      code: newCode,
                      status: 'active',
                      tier: tier,
                      createdAt: new Date().toISOString(),
                      expiresAt: expirationDate.toISOString()
                    });
                    setAdminLicenses(prev => [{id: newCode, code: newCode, status: 'active', tier: tier, createdAt: new Date().toISOString(), expiresAt: expirationDate.toISOString()}, ...prev]);
                  } catch(e) {
                    alert("Failed to generate license. Ensure you have admin write permissions.");
                  }
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow text-xs font-medium transition-all"
              >
                + Create License
              </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">License Key</th>
                    <th className="px-6 py-4 font-medium">Tier</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Expiration / Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {adminLicenses.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No licenses generated yet. Click generate or refresh list.</td></tr>
                  ) : adminLicenses.map(lic => (
                    <tr key={lic.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-indigo-400 font-bold tracking-wider">{lic.code}</td>
                      <td className="px-6 py-4 text-slate-300 capitalize">{lic.tier || 'Legacy'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] ${lic.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                          {lic.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {lic.expiresAt ? <span className="text-amber-400/80 block mb-1">Exp: {new Date(lic.expiresAt).toLocaleDateString()}</span> : null}
                        <span className="text-[9px]">Gen: {new Date(lic.createdAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Registered Users Map</h3>
                <p className="text-[10px] text-slate-500 max-w-sm mt-1">
                  Complete directory of all registered authenticated users hitting the vault.
                </p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const uSnap = await getDocs(collection(masterDb, 'users'));
                    setAdminUsersReg(uSnap.docs.map(d => ({uid: d.id, ...d.data()})));
                  } catch(e) {}
                }}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 text-[10px] flex items-center gap-2 transition-colors border border-slate-700"
              >
                <RefreshCw size={12} /> Sync Directory
              </button>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">User Email</th>
                    <th className="px-6 py-4 font-medium">Tenant ID</th>
                    <th className="px-6 py-4 font-medium">Commercial License</th>
                    <th className="px-6 py-4 font-medium">Role / Access</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {adminUsersReg.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Retrieving users cluster...</td></tr>
                  ) : adminUsersReg.map(usr => (
                    <tr key={usr.uid} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">{usr.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">{usr.tenantId || 'No Corp Data'}</td>
                      <td className="px-6 py-4">
                        {usr.licenseKey ? (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
                            {usr.licenseKey}
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded">
                            Unlicensed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${usr.role === 'admin' || usr.role === 'sysadmin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                            {usr.role || 'User'}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={async () => {
                                try {
                                  await updateDoc(doc(masterDb, 'users', usr.uid), { role: usr.role === 'admin' ? 'user' : 'admin' });
                                  setAdminUsersReg(prev => prev.map(u => u.uid === usr.uid ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
                                } catch (e) { alert("Sovereign privilege required."); }
                              }}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                              title="Toggle Admin Role"
                            >
                              <ShieldCheck size={12} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={async () => {
                            if (confirm(`Decommission access for ${usr.email}? This cannot be undone.`)) {
                              try {
                                await deleteDoc(doc(masterDb, 'users', usr.uid));
                                setAdminUsersReg(prev => prev.filter(u => u.uid !== usr.uid));
                              } catch (e) { alert("Failed to decommission user."); }
                            }
                          }}
                          className="text-red-500/50 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Decommission User"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Floating Live Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
        <div className={`transition-all duration-300 origin-bottom-right bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl mb-2 max-w-xs text-xs text-slate-300 ${isLiveConnected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="font-normal text-sky-400">{lang === 'ar' ? 'المستشار المباشر نشط' : 'Live Consultant Active'}</p>
            {isMicActive && (
              <div className="flex gap-0.5 items-end h-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className="w-1 bg-emerald-500 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(20, micVolume * 100 * (1 - Math.abs(3-i)*0.2))}%` }}
                  />
                ))}
              </div>
            )}
          </div>
          <p>{lang === 'ar' ? 'سأقوم بإرشادك خطوة بخطوة. تحدث بوضوح للإجابة على أسئلتي.' : 'I will guide you step-by-step. Speak clearly to answer my questions.'}</p>
        </div>
        
        <button
          onClick={toggleLiveConsultant}
          disabled={isLiveConnecting}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 relative ${
            isLiveConnected 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-sky-500 hover:bg-sky-600"
          }`}
        >
          {isLiveConnecting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <div className="relative">
              <span className={`text-2xl ${isLiveConnected ? 'animate-pulse' : ''}`}>{isLiveConnected ? "■" : "🎙️"}</span>
              {isMicActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-normal text-white">{isRegistering ? t.register : t.login}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.title}</p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isRegistering && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Company Name</label>
                        <input 
                          type="text" 
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Company Logo</label>
                        <div 
                          className="h-[42px] border border-dashed border-slate-700 rounded-lg flex items-center justify-center gap-2 hover:border-sky-500/50 transition-all cursor-pointer bg-slate-800/50 relative overflow-hidden"
                          onClick={() => document.getElementById('auth-logo-upload')?.click()}
                        >
                          {companyLogoUrl ? (
                            <img src={companyLogoUrl} alt="Logo" className="h-6 object-contain" />
                          ) : isUploadingLogo ? (
                            <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <FileUp size={14} className="text-slate-500" />
                              <span className="text-[10px] text-slate-500">Upload Logo</span>
                            </>
                          )}
                          <input id="auth-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleTenantLogoUpload} />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.email}</label>
                    <input 
                      type="email" 
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">{t.password}</label>
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {authError && <p className="text-[10px] text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">{authError}</p>}

                  <button 
                    type="submit"
                    disabled={isRegistering && (!companyName || !companyLogoUrl)}
                    className="w-full py-3 bg-sky-500 text-slate-950 rounded-xl text-xs font-normal hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
                  >
                    {isRegistering ? t.register : t.login}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-slate-900 px-2 text-slate-600">Or</span></div>
                </div>

                <button 
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 bg-white text-slate-950 rounded-xl text-xs font-normal hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.googleSignIn}
                </button>

                <div className="text-center">
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-[10px] text-slate-500 hover:text-sky-400 transition-colors"
                  >
                    {isRegistering ? t.alreadyHaveAccount : t.dontHaveAccount}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Full Comprehensive PDF Template */}
      <div 
        id="hidden-pdf-template" 
        className="fixed -left-[10000px] top-0 w-[1200px] min-h-[800px] bg-black border border-slate-900 text-white p-12 flex flex-col font-sans"
        style={{ zIndex: -999 }}
      >
        <div className="flex justify-between items-start mb-12 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-sky-400">Risk Assessment Report</h1>
            <h2 className="text-2xl text-slate-300 mb-2">تقرير التقييم الشامل</h2>
            <p className="text-slate-400">{context.organization || 'Organization'} | {new Date().toLocaleDateString()}</p>
          </div>
          {context.logoUrl && <img src={context.logoUrl} className="h-20 object-contain" alt="Logo" />}
        </div>

        <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-slate-800 text-emerald-400">Identified Risks</h3>
        <div className="grid grid-cols-1 gap-6 mb-16">
          {riskRegister.map((r, i) => (
            <div key={r.id || i} className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-slate-700 rounded text-sm font-mono text-slate-300">{r.id || `RSK-${i+1}`}</span>
                  <span className={`px-3 py-1 rounded text-sm font-semibold border border-current 
                    ${r.level === 'Critical' ? 'text-red-400 bg-red-500/10' : 
                      r.level === 'High' ? 'text-orange-400 bg-orange-500/10' : 
                      r.level === 'Medium' ? 'text-yellow-400 bg-yellow-500/10' : 
                      'text-emerald-400 bg-emerald-500/10'}`}
                  >
                    {r.level} Score: {r.score}
                  </span>
                </div>
                <div className="text-slate-400 text-sm">Owner: {r.owner || 'Unassigned'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1">English Details</h4>
                  <div className="mb-2"><strong className="text-slate-300">Asset:</strong> {(r as any).asset || (r as any).asset_category || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">Threat:</strong> {(r as any).threat || (r as any).threat_text || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">Vulnerability:</strong> {(r as any).vulnerability || '-'}</div>
                  <div className="mb-2 text-sm"><strong className="text-slate-300 block mb-1">Risk Statement:</strong> {(r as any).riskStatement || (r as any).risk_statement || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">Existing Controls:</strong> {(r as any).existingControls || (r as any).existing_controls || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">Action Owner:</strong> {(r as any).owner || (r as any).action_owner || '-'} | <strong className="text-slate-300">Due:</strong> {(r as any).dueDate || (r as any).timeline || '-'}</div>
                  <div className="mb-2"><strong className="text-sky-400 block mb-1">Mitigation Plan:</strong> {(r as any).treatmentPlan || (r as any).treatment_details || (r as any).aiMitigation || (r as any).mitigation_actions || '-'}</div>
                </div>
                <div className="text-right" dir="rtl">
                  <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1 text-left" dir="ltr">Arabic Details (التفاصيل)</h4>
                  <div className="mb-2"><strong className="text-slate-300">الأصل:</strong> {(r as any).asset_ar || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">التهديد:</strong> {(r as any).threat_ar || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">نقطة الضعف:</strong> {(r as any).vulnerability_ar || '-'}</div>
                  <div className="mb-2 text-sm"><strong className="text-slate-300 block mb-1">بيان المخاطر:</strong> {(r as any).riskStatement_ar || (r as any).risk_statement_ar || '-'}</div>
                  <div className="mb-2"><strong className="text-slate-300">الضوابط الحالية:</strong> {(r as any).existingControls_ar || (r as any).existing_controls_ar || '-'}</div>
                  <div className="mb-2"><strong className="text-sky-400 block mb-1">خطة التخفيف:</strong> {(r as any).treatmentPlan_ar || (r as any).treatment_details_ar || '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 break-before-page">
          <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-slate-800 text-amber-500">Risk Matrix Topography</h3>
          <div className="grid grid-cols-5 gap-1 w-full max-w-xl mx-auto aspect-square border-l-2 border-b-2 border-slate-600 p-4 relative bg-slate-950">
            <span className="absolute -left-12 top-1/2 -rotate-90 text-sm text-slate-400 tracking-widest text-center">Likelihood (1-5)</span>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-slate-400 tracking-widest text-center">Impact (1-5)</span>
            {[5, 4, 3, 2, 1].map(l => (
              <React.Fragment key={`pdf-L-${l}`}>
                {[1, 2, 3, 4, 5].map(i => {
                  const score = l * i;
                  const rx = riskRegister.filter(r => r.likelihood === l && r.impact === i);
                  let colorClass = score >= 20 ? 'bg-red-900/60' : score >= 12 ? 'bg-orange-800/50' : score >= 5 ? 'bg-yellow-900/40' : 'bg-emerald-900/30';
                  return (
                    <div key={`pdf-C-${l}-${i}`} className={`relative items-center justify-center flex border-2 border-slate-900 ${colorClass}`}>
                       <span className="absolute opacity-20 inset-0 m-auto flex items-center justify-center font-bold text-2xl">{score}</span>
                       <div className="flex flex-wrap gap-1 z-10 p-1">
                          {rx.map((r, ri) => <div key={`pdf-R-${ri}`} className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] text-black font-bold">{r.id?.split('-').pop()?.substring(0, 3) || (ri+1)}</div>)}
                       </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default App;
