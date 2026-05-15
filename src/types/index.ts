// API Response Types
export interface VitalSigns {
  ppi: number;               // Pulse/Pulse Pressure Index
  heartRate: number;         // Heart rate in bpm (from central server)
  respiratoryRate: number;   // Breaths per minute
  hrv: number;               // Heart Rate Variability
}

export interface APISubmission {
  id: number | string;
  complaints: string;           // Stringified JSON array
  details: string;              // Stringified JSON object
  ai_summary: string;
  triage_zone: TriageZone;
  redflag?: 'No' | 'Yes';        // Can also be red_flag for backward compatibility
  red_flag?: 'YES' | 'NO';
  final_notes_raw?: string;      // Raw patient notes
  final_note_summarized?: string; // Summarized notes
  final_notes_ai?: string;       // AI-processed patient notes
  // Vital signs - supports multiple field name variations
  ppi?: number;
  heart_rate?: number;           // Primary heart rate field from central server
  respiratory_rate?: number;
  hrv?: number;
  spo2?: string;
  created_at: string;            // ISO format: "2026-01-13 04:22:41"
  // Doctor tracking fields
  seen_by_doctor_id?: string;
  seen_by_doctor_name?: string;
  consultation_started_at?: string;
  consultation_status?: 'Waiting' | 'In Progress' | 'Completed'; // DB-persisted status
  consultation_completed_at?: string;                             // DB-persisted completion time
  clinical_history_formatted?: string;
  redflag_override?: boolean;
  redflag_overridden_by_doctor_id?: string;
  redflag_overridden_at?: string;
  is_active_redflag?: boolean;  // Computed by v_patient_queue: redflag='Yes' AND override=FALSE

  // Support any additional fields
  [key: string]: any;
}

// Application Types
export interface PatientSubmission {
  id: number | string;
  queueNumber: string;
  registrationNumber: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  complaints: string[];
  details: PatientDetails;
  aiSummary: string;
  patientNotes?: string;     // AI-processed patient notes
  notesRaw?: string;         // Raw notes from intake
  triageZone: TriageZone;
  isRedFlag: boolean;
  isPriority: boolean;       // Local state for "Attend First"
  status: PatientStatus;
  arrivalTime: Date;
  checkoutTime?: Date;       // Time when consultation was completed
  createdAt: string;
  // Vital signs
  vitals: VitalSigns;
  clinicalHistoryFormatted?: string;
  // Doctor tracking fields (from DB)
  seen_by_doctor_id?: string;
  seen_by_doctor_name?: string;
  consultation_started_at?: string;
  consultation_completed_at?: string; // DB-persisted completion timestamp
  redflag_override?: boolean;
  redflag_overridden_by_doctor_id?: string;
  redflag_overridden_at?: string;
}

export interface PatientDetails {
  name?: string;
  age?: number | string;
  gender?: string;
  registrationNumber?: string;
  rn?: string;
  patientName?: string;
  patientAge?: number | string;
  patientGender?: string;
  triggeredRedFlagRuleIds?: string[] | string;
  triggeredRedFlagRules?: Array<{ id: string; label: string; priority: string }>;

  // Additional fields from EMR form can be added here
  [key: string]: unknown;
}

export type TriageZone = 'RED' | 'YELLOW' | 'GREEN';
export type PatientStatus = 'Waiting' | 'In Progress' | 'Completed';

// Error Types
export interface APIError {
  message: string;
  code?: string;
  timestamp: Date;
}

// Context State
export interface AppState {
  submissions: PatientSubmission[];
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  autoRefreshEnabled: boolean;
  newRedFlags: PatientSubmission[];
}

// Context Actions
export interface AppActions {
  fetchSubmissions: () => Promise<void>;
  attendFirst: (id: number | string) => void;
  markNotUrgent: (id: number | string) => void;
  updateStatus: (id: number | string, status: PatientStatus) => void;
  toggleAutoRefresh: () => void;
  manualRefresh: () => void;
  dismissRedFlag: (id: number | string) => void;
  dismissAllRedFlags: () => void;
}
