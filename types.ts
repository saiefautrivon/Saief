
export enum PipelineStage {
  NEW_LEAD = 'New Lead',
  MESSAGE_SENT = 'Message Sent',
  REPLIED = 'Replied',
  QUALIFIED = 'Qualified',
  BOOKED = 'Booked',
  WON = 'Closed (Won)',
  LOST = 'Lost'
}

export type SocialPlatform = 'LinkedIn' | 'Instagram' | 'Email' | 'WhatsApp' | 'Facebook' | 'Twitter' | 'Generic';

export interface LeadHistoryEvent {
  id: string;
  type: string;
  timestamp: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  body: string;
  platform?: SocialPlatform;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  platform: SocialPlatform;
  url: string;
  directMessageUrl: string;
  notes?: string;
  status: PipelineStage;
  nextActionDate?: string | null;
  history: LeadHistoryEvent[];
  createdAt: string;
}

export interface StrictModeSettings {
  startDate: string;
  durationDays: number;
  dailyTarget: number;
  isConfigured: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  strictMode: StrictModeSettings;
  streak: number;
  lastSessionDate?: string;
  templates: MessageTemplate[];
}

export type ViewMode = 'LANDING' | 'AUTH' | 'ONBOARDING' | 'HOME' | 'LEAD_ENTRY' | 'SESSION_ACTIVE' | 'SESSION_FINISHED' | 'MANAGE_TEMPLATES';

export interface AppState {
  user: User | null;
  leads: Lead[];
  currentIndex: number;
  viewMode: ViewMode;
}
