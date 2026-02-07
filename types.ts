export enum Sector {
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
  GUIDE = 'System Manual'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
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
  idName: string; // Funny ID
}

export const OWNERS: TeamMember[] = [
  { name: "B. Wadoud", role: "CEO & Administrator", clearance: "LEVEL 5", idName: "The G-Man" },
  { name: "A. Maria", role: "Ops Director", clearance: "LEVEL 4", idName: "Headcrab Whisperer" },
  { name: "A. Chaouki", role: "Tech Lead", clearance: "LEVEL 4", idName: "Crowbar Specialist" },
  { name: "F. Chifaa", role: "Head of Research", clearance: "LEVEL 4", idName: "Xen Biologist" },
  { name: "K. Hadil", role: "Logistics", clearance: "LEVEL 4", idName: "Vortigaunt Diplomat" }
];
