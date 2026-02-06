export enum Sector {
  LICENCE_S1 = 'Licence S1',
  LICENCE_S2 = 'Licence S2',
  MASTER_S1 = 'Master S1',
  MASTER_S2 = 'Master S2',
  LAB = 'Black Mesa Lab',
  AI = 'HEV AI Link'
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

export interface TeamMember {
  name: string;
  role: string;
}

export const TEAM_CREDITS: TeamMember[] = [
  { name: "Dr. Wadoud", role: "Administrator" },
  { name: "Maria", role: "Ops Director" },
  { name: "Chaouki", role: "Tech Lead" },
  { name: "Chifaa", role: "Head of Research" },
  { name: "Hadil", role: "Logistics" }
];
