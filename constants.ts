
import { Sector } from "./types";

export const THEME_COLOR = "#ff9900";
export const ADMIN_PASSWORD = "FREEMAN";

export const DEFAULT_POSTS = [
  {
    id: '1',
    title: 'ADMINISTRATOR OVERRIDE',
    content: 'The border world, Xen, is in our control for the time being. Proceed with your research.',
    author: 'G-MAN',
    timestamp: Date.now()
  }
];

// Reorganized Navigation for better UX
export const NAV_ITEMS = [
  // Group 1: Academic Levels
  { id: 'divider', label: 'ACADEMIC_SECTORS' },
  { id: Sector.LICENCE_L1, label: 'LICENCE_L1' },
  { id: Sector.LICENCE_L2, label: 'LICENCE_L2' },
  { id: Sector.LICENCE_L3, label: 'LICENCE_L3' },
  { id: Sector.MASTER_S1, label: 'MASTER_S1' },
  { id: Sector.MASTER_S2, label: 'MASTER_S2' },

  // Group 2: Student Management Tools
  { id: 'divider', label: 'MANAGEMENT_TOOLS' },
  { id: Sector.TIMETABLE, label: 'TIMETABLE' },
  { id: Sector.EXAMS, label: 'EXAMS' },
  { id: Sector.CALCULATOR, label: 'CALCULATOR' },
  { id: Sector.PEER_REVIEW, label: 'PEER_REVIEW' },

  // Group 3: Research & Resources
  { id: 'divider', label: 'RESEARCH_DIV' },
  { id: Sector.LAB, label: 'LAB' },
  { id: Sector.DATA, label: 'DATA' },
  { id: Sector.AI, label: 'AI' },
  { id: Sector.TRAINING, label: 'TRAINING' },
  { id: Sector.LOGS, label: 'LOGS' },

  // Group 4: Facility & Extras
  { id: 'divider', label: 'FACILITY' },
  { id: Sector.FACULTY, label: 'FACULTY' },
  { id: Sector.ABOUT, label: 'ABOUT' },
  { id: Sector.ENTERTAINMENT, label: 'ENTERTAINMENT' },
  { id: Sector.GUIDE, label: 'GUIDE' },
  { id: Sector.UTILITIES, label: 'UTILITIES' },
];

export const DICTIONARY_DATA: Record<string, string> = {
  "semantics": "The branch of linguistics and logic concerned with meaning.",
  "pragmatics": "The branch of linguistics dealing with language in use and the contexts in which it is used.",
  "syntax": "The arrangement of words and phrases to create well-formed sentences in a language.",
  "phonology": "The system of relationships among the speech sounds that constitute the fundamental components of a language.",
  "literature": "Written works, especially those considered of superior or lasting artistic merit.",
  "cybernetics": "The science of communications and automatic control systems in both machines and living things.",
  "anomaly": "Something that deviates from what is standard, normal, or expected.",
  "resonance": "The reinforcement or prolongation of sound by reflection from a surface or by the synchronous vibration of a neighboring object.",
  "cascade": "A process whereby something, typically information or knowledge, is successively passed on."
};

export const ENTERTAINMENT_LINKS = [
  { title: "Project Gutenburg", url: "https://www.gutenberg.org/", type: "BOOK", category: "Literature" },
  { title: "TED-Ed: Language", url: "https://ed.ted.com/lessons?category=language-literature", type: "VIDEO", category: "Documentary" },
  { title: "Lofi Girl Radio", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", type: "AUDIO", category: "Music" },
  { title: "NASA e-Books", url: "https://www.nasa.gov/connect/ebooks/index.html", type: "BOOK", category: "Sci-Fi/Real" },
  { title: "Internet Archive", url: "https://archive.org/", type: "TOOL", category: "Research" }
];

export const TRANSLATIONS: any = {
  EN: {
    welcome: "WELCOME",
    offline: "OFFLINE",
    online: "ONLINE",
    settings: "SYSTEM CONFIG",
    conn_status: "CONNECTION STATUS",
    interface_style: "INTERFACE AESTHETICS",
    pwa_mode: "PWA MODE",
    pwa_desc: "Enable Progressive Web App installation features.",
    pwa_toast: "NEW CONTENT AVAILABLE: APP IS READY TO INSTALL.",
    language: "LANGUAGE",
    ACADEMIC_SECTORS: "// ACADEMIC SECTORS",
    MANAGEMENT_TOOLS: "// MANAGEMENT TOOLS",
    RESEARCH_DIV: "// RESEARCH DIV",
    FACILITY: "// FACILITY",
    LICENCE_L1: 'LICENCE 1',
    LICENCE_L2: 'LICENCE 2',
    LICENCE_L3: 'LICENCE 3',
    MASTER_S1: 'MASTER 1',
    MASTER_S2: 'MASTER 2',
    TIMETABLE: 'TIMETABLE',
    EXAMS: 'EXAM PROTOCOL',
    CALCULATOR: 'GRADE CALC',
    PEER_REVIEW: 'PEER REVIEWS',
    LAB: 'LAB ARCHIVES',
    DATA: 'DATA CORE',
    AI: 'HEV AI LINK',
    TRAINING: 'NEURAL TRAIN',
    LOGS: 'AUDIO LOGS',
    FACULTY: 'FACULTY DIR',
    ABOUT: 'ABOUT TEAM',
    ENTERTAINMENT: 'BREAK ROOM',
    GUIDE: 'USER GUIDE',
    UTILITIES: 'EXTENSIONS',
    theme_cyberpunk: "CYBERPUNK",
    theme_girly: "GIRLY / SOFT"
  },
  FR: {
    welcome: "BIENVENUE",
    offline: "HORS LIGNE",
    online: "EN LIGNE",
    settings: "CONFIGURATION SYSTÈME",
    conn_status: "ÉTAT DE CONNEXION",
    interface_style: "ESTHÉTIQUE DE L'INTERFACE",
    pwa_mode: "MODE PWA",
    pwa_desc: "Activer les fonctionnalités d'installation PWA.",
    pwa_toast: "NOUVEAU CONTENU : L'APPLICATION EST PRÊTE À ÊTRE INSTALLÉE.",
    language: "LANGUE",
    ACADEMIC_SECTORS: "// SECTEURS ACADÉMIQUES",
    MANAGEMENT_TOOLS: "// OUTILS DE GESTION",
    RESEARCH_DIV: "// DIV RECHERCHE",
    FACILITY: "// INSTALLATION",
    LICENCE_L1: 'LICENCE 1',
    LICENCE_L2: 'LICENCE 2',
    LICENCE_L3: 'LICENCE 3',
    MASTER_S1: 'MASTER 1',
    MASTER_S2: 'MASTER 2',
    TIMETABLE: 'EMPLOI DU TEMPS',
    EXAMS: 'PROTOCOLE EXAMEN',
    CALCULATOR: 'CALC NOTES',
    PEER_REVIEW: 'REVUE PAR PAIRS',
    LAB: 'ARCHIVES LABO',
    DATA: 'DATA CORE',
    AI: 'LIEN IA HEV',
    TRAINING: 'ENTRAÎNEMENT NEURAL',
    LOGS: 'JOURNAUX AUDIO',
    FACULTY: 'ANNUAIRE FAC',
    ABOUT: 'À PROPOS',
    ENTERTAINMENT: 'SALLE DE PAUSE',
    GUIDE: 'GUIDE UTILISATEUR',
    UTILITIES: 'EXTENSIONS',
    theme_cyberpunk: "CYBERPUNK",
    theme_girly: "GIRLY / DOUX"
  },
  AR: {
    welcome: "مرحباً",
    offline: "غير متصل",
    online: "متصل",
    settings: "إعدادات النظام",
    conn_status: "حالة الاتصال",
    interface_style: "جماليات الواجهة",
    pwa_mode: "وضع PWA",
    pwa_desc: "تفعيل ميزات تثبيت تطبيق الويب التقدمي.",
    pwa_toast: "محتوى جديد: التطبيق جاهز للتثبيت.",
    language: "لغة",
    ACADEMIC_SECTORS: "// القطاعات الأكاديمية",
    MANAGEMENT_TOOLS: "// أدوات الإدارة",
    RESEARCH_DIV: "// قسم البحث",
    FACILITY: "// المنشأة",
    LICENCE_L1: 'ليسانس 1',
    LICENCE_L2: 'ليسانس 2',
    LICENCE_L3: 'ليسانس 3',
    MASTER_S1: 'ماستر 1',
    MASTER_S2: 'ماستر 2',
    TIMETABLE: 'الجدول الزمني',
    EXAMS: 'بروتوكول الامتحانات',
    CALCULATOR: 'حاسبة المعدل',
    PEER_REVIEW: 'مراجعة الأقران',
    LAB: 'أرشيف المختبر',
    DATA: 'مركز البيانات',
    AI: 'رابط الذكاء الاصطناعي',
    TRAINING: 'تدريب عصبي',
    LOGS: 'سجلات صوتية',
    FACULTY: 'دليل الكلية',
    ABOUT: 'حول الفريق',
    ENTERTAINMENT: 'غرفة الاستراحة',
    GUIDE: 'دليل المستخدم',
    UTILITIES: 'الإضافات',
    theme_cyberpunk: "سايبربانك",
    theme_girly: "ناعم / بناتي"
  }
};
