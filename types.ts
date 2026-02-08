
export enum Sector {
  PROFILE = 'Student Profile',
  LICENCE_L1 = 'Licence Year 1',
  LICENCE_L2 = 'Licence Year 2',
  LICENCE_L3 = 'Licence Year 3',
  MASTER_S1 = 'Master S1',
  MASTER_S2 = 'Master S2',
  LAB = 'Black Mesa Lab',
  DATA = 'Data Core',
  AI = 'HEV AI Link',
  MISSIONS = 'Mission Objectives',
  CALCULATOR = 'LMD Simulator',
  FACULTY = 'Faculty Directory',
  TIMETABLE = 'Sector Schedule',
  EXAMS = 'Exam Protocol',
  TRAINING = 'Neural Training',
  LOGS = 'Research Audio Logs',
  ABOUT = 'Clearance / About',
  GUIDE = 'System Manual',
  ENTERTAINMENT = 'Break Room / Media',
  PEER_REVIEW = 'Peer Review System',
  UTILITIES = 'System Extensions'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  files?: { name: string; url: string; type: string }[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  sector: string;
  isAdmin?: boolean;
}

export interface LabResource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'TOOL' | 'LINK';
  url: string;
  addedBy: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: 'JS' | 'PYTHON' | 'TEXT' | 'HTML' | 'SQL';
  code: string;
  author: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'PENDING' | 'ACTIVE' | 'RESOLVED';
  priority: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  module: string;
  email: string;
  status: 'OFFICE' | 'LECTURE' | 'OFF-SITE';
}

export interface TimetableEntry {
  id: string; 
  subject: string;
  room: string;
}

export interface ExamEntry {
  id: string;
  date: string;
  time: string;
  module: string;
  room: string;
  seat: string;
}

export interface LogEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  clearance: string;
  iconType: 'KNULL' | 'CROWN' | 'VIKING' | 'GIRLY_FLOWER' | 'GIRLY_HEART';
}

export const OWNERS: TeamMember[] = [
  { name: "B. Wadoud", role: "CEO & Administrator", clearance: "LEVEL 5", iconType: 'KNULL' },
  { name: "A. Maria", role: "Ops Director", clearance: "LEVEL 4", iconType: 'CROWN' },
  { name: "A. Chaouki", role: "Tech Lead", clearance: "LEVEL 4", iconType: 'VIKING' },
  { name: "F. Chifaa", role: "Head of Research", clearance: "LEVEL 4", iconType: 'GIRLY_FLOWER' },
  { name: "K. Hadil", role: "Logistics", clearance: "LEVEL 4", iconType: 'GIRLY_HEART' },
  { name: "S. Manel", role: "Communications", clearance: "LEVEL 4", iconType: 'GIRLY_FLOWER' }
];

export interface Assignment {
  id: string;
  title: string;
  description: string;
  studentName: string;
  content: string; // Text or Link
  reviews: Review[];
  timestamp: number;
}

export interface Review {
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
}

export interface AppSettings {
  theme: 'CYBERPUNK' | 'GIRLY';
  language: 'EN' | 'FR' | 'AR';
  fontSize: 'SMALL' | 'NORMAL' | 'LARGE';
  reduceMotion: boolean;
  isPwaMode: boolean;
}
