import { Sector } from "./types";

export const THEME_COLOR = "#ff9900";
export const ADMIN_PASSWORD = "FREEMAN";

export const DEFAULT_POSTS = [
  {
    id: '1',
    title: 'ADMINISTRATOR OVERRIDE',
    content: 'The border world, Xen, is in our control for the time being, thanks to you. Proceed with your research.',
    author: 'G-MAN',
    timestamp: Date.now()
  }
];

export const NAV_ITEMS = [
  { id: Sector.LICENCE_L1, label: 'LICENCE YEAR 1' },
  { id: Sector.LICENCE_L2, label: 'LICENCE YEAR 2' },
  { id: Sector.LICENCE_L3, label: 'LICENCE YEAR 3' },
  { id: Sector.MASTER_S1, label: 'MASTER SEC 1' },
  { id: Sector.MASTER_S2, label: 'MASTER SEC 2' },
  { id: 'divider', label: '--- ACADEMIC ---' },
  { id: Sector.TIMETABLE, label: 'CLASS SCHEDULE' },
  { id: Sector.EXAMS, label: 'EXAM PROTOCOL' },
  { id: Sector.CALCULATOR, label: 'LMD SIMULATOR' },
  { id: Sector.FACULTY, label: 'FACULTY DIR' },
  { id: Sector.TRAINING, label: 'NEURAL TRAINING' },
  { id: 'divider', label: '--- SYSTEMS ---' },
  { id: Sector.MISSIONS, label: 'OBJECTIVES' },
  { id: Sector.DATA, label: 'DATA CORE' },
  { id: Sector.LAB, label: 'BM LAB' },
  { id: Sector.AI, label: 'HEV AI LINK' },
  { id: Sector.LOGS, label: 'AUDIO LOGS' },
  { id: 'divider', label: '--- PERSONNEL ---' },
  { id: Sector.ABOUT, label: 'ABOUT / TEAM' },
  { id: Sector.GUIDE, label: 'MANUAL / HELP' },
];
