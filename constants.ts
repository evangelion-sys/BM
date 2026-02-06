import { Sector } from "./types";

export const THEME_COLOR = "#ff9900";
export const ADMIN_PASSWORD = "FREEMAN";

export const DEFAULT_POSTS = [
  {
    id: '1',
    title: 'WELCOME TO BLACK MESA',
    content: 'Welcome to the collaborative uplink. All personnel must report to their respective sectors. Do not discuss the anomaly.',
    author: 'Dr. Wadoud',
    timestamp: Date.now() - 100000
  }
];

export const NAV_ITEMS = [
  { id: Sector.LICENCE_S1, label: 'LICENCE SEC 1' },
  { id: Sector.LICENCE_S2, label: 'LICENCE SEC 2' },
  { id: Sector.MASTER_S1, label: 'MASTER SEC 1' },
  { id: Sector.MASTER_S2, label: 'MASTER SEC 2' },
  { id: 'divider', label: '--- RESOURCES ---' },
  { id: Sector.LAB, label: 'BM LAB' },
  { id: Sector.AI, label: 'HEV AI LINK' },
];
