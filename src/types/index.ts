export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  score: number;
  // Updated status type for Kanban stages
  status: 'new' | 'contacted' | 'qualified' | 'proposal sent' | 'negotiation' | 'closed won' | 'closed lost'; 
  lastContact: Date;
  source: string;
  notes?: string;
  customFields?: Record<string, string>;
  createdAt: Date;
}

export interface SalesMetric {
  id: string;
  name: string;
  value: number;
  trend: number;
  icon: string;
  linkTo?: string;
  graphData?: { name: string; value: number }[]; // Optional graph data
}

export interface ScoringRule {
  id: string;
  name: string;
  description: string;
  criteria: {
    field: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number;
  }[];
  points: number;
  isActive: boolean;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
}

export interface LeadsTableSort {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

export interface LeadsFilter {
  status?: Lead['status'][];
  scoreRange?: [number, number];
  source?: string[];
  dateRange?: [Date, Date];
}

// --- Call Types ---
export interface Call {
  id: string;
  leadName: string; 
  agentName: string;
  timestamp: Date;
  duration: string; 
  insights?: CallInsights; 
}

export interface CallInsights {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  todoList: string[];
  overallScore: number; 
  scriptAdherenceScore: number; 
  dealClosureProbability: number; 
  transcription: { timestamp: string; speaker: string; text: string }[];
}
// --- End Call Types ---

// --- Meeting Type ---
export interface Meeting {
  id: string;
  leadName: string;
  agentName: string;
  timestamp: Date;
  duration: string; // e.g., "0:45" for 45 minutes
  platform: 'Google Meet' | 'Zoom' | 'Phone'; // Example platforms
  insights?: CallInsights; // Add optional insights for meetings too
}
// --- End Meeting Type ---
