export interface Mantra {
  id: string;
  name: string;
  totalCount: number;
  isPinned: boolean;
  createdAt: string;
  targetCount?: number;
  color?: string; // Hex color code for display
  // targetDate moved to global setting
}

export interface LogEntry {
  id: string;
  mantraId: string;
  mantraName: string;
  amount: number;
  timestamp: string; // ISO String
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Quote {
  text: string;
  source?: string;
}

// For the Google Sheets Payload
export interface SyncPayload {
  action: 'ADD_LOG' | 'SYNC_STATE';
  userName?: string;
  userGroup?: string;
  data: any;
}