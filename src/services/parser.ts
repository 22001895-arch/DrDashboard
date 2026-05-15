import { APISubmission, PatientSubmission, PatientDetails, VitalSigns } from '../types';
import {
  safeJSONParse,
  generateQueueNumber,
  parseDate,
  extractPatientName,
  extractAge,
  extractGender
} from '../utils/helpers';

/**
 * Parse vital signs from API submission
 * Handles multiple possible field name variations from different API versions
 */
function parseVitals(raw: APISubmission): VitalSigns {
  // Parse PPI - use parseFloat to preserve decimals (e.g., 0.91)
  let ppiValue = raw.ppi;
  if (typeof ppiValue === 'string') {
    ppiValue = parseFloat(ppiValue);
  }
  const ppi = typeof ppiValue === 'number' && !isNaN(ppiValue) ? ppiValue : 0;
  
  // Extract heart_rate - this is the PRIMARY field from central server
  let heartRateValue = raw.heart_rate;
  
  // Convert to number if string
  if (typeof heartRateValue === 'string') {
    heartRateValue = parseInt(heartRateValue, 10);
  }
  
  // Ensure it's a number
  const heartRate = typeof heartRateValue === 'number' && !isNaN(heartRateValue) ? heartRateValue : 0;
  
  // Parse respiratory rate
  let respiratoryValue = raw.respiratory_rate;
  if (typeof respiratoryValue === 'string') {
    respiratoryValue = parseInt(respiratoryValue, 10);
  }
  const respiratoryRate = typeof respiratoryValue === 'number' && !isNaN(respiratoryValue) ? respiratoryValue : 0;
  
  // Parse HRV
  let hrvValue = raw.hrv;
  if (typeof hrvValue === 'string') {
    hrvValue = parseInt(hrvValue, 10);
  }
  const hrv = typeof hrvValue === 'number' && !isNaN(hrvValue) ? hrvValue : 0;
  
  const vitals: VitalSigns = {
    ppi,
    heartRate,
    respiratoryRate,
    hrv
  };
  
  // Detailed debug logging
  console.log(`[Vitals Parser] Patient ${raw.id}:`, {
    raw_fields: {
      ppi: raw.ppi,
      heart_rate: raw.heart_rate,
      respiratory_rate: raw.respiratory_rate,
      hrv: raw.hrv
    },
    parsed_vitals: vitals
  });
  
  return vitals;
}

/**
 * Derive patient status from the DB-persisted consultation_status field.
 * This replaces the old sessionStorage approach so status survives
 * page reloads, new tabs, and different devices.
 */
function deriveStatus(raw: APISubmission): PatientStatus {
  if (raw.consultation_status === 'In Progress') return 'In Progress';
  if (raw.consultation_status === 'Completed')   return 'Completed';
  return 'Waiting';
}

/**
 * Parse raw API submission into typed PatientSubmission
 * Returns null if data is invalid or incomplete
 */
export function parseSubmission(raw: APISubmission): PatientSubmission | null {
  try {
    // Parse stringified JSON fields with fallbacks
    const complaints = safeJSONParse<string[]>(raw.complaints, []);
    const details = safeJSONParse<PatientDetails>(raw.details, {});
    
    // Store triggered red flag rule IDs in details if present
    if (raw.TriggeredRedFlagRuleIds) {
      details.triggeredRedFlagRuleIds = raw.TriggeredRedFlagRuleIds;
    }
    
    // Extract patient information
    const patientName = extractPatientName(details);
    const age = extractAge(details);
    const gender = extractGender(details);
    
    // Validation: Must have at least name
    if (!patientName || patientName === 'Unknown Patient') {
      console.warn(`Submission ${raw.id} missing patient name`);
      // Still include but mark as incomplete
    }
    
    // Generate registration number
    const registrationNumber = (details.registrationNumber as string) || 
                               (details.rn as string) || 
                               `RN${String(raw.id).padStart(7, '0')}`;
    
    // Determine red flag status using the SQL view's computed column is_active_redflag.
    // This already accounts for redflag_override=TRUE, so a doctor's "Mark Not Urgent"
    // action persists across page refreshes and auto-refresh cycles.
    // Fallback to raw redflag field for API versions that don't include is_active_redflag.
    const isRedFlag = raw.is_active_redflag === true || raw.is_active_redflag === 'true'
      || (raw.is_active_redflag === undefined && (raw.redflag === 'Yes' || raw.redflag === 'YES'));
    
    const qNum = raw.queue_number != null ? raw.queue_number : 0;

    return {
      id: raw.id,
      queueNumber: `Q${String(qNum).padStart(3, '0')}`,
      registrationNumber,
      patientName,
      age,
      gender,
      complaints: Array.isArray(complaints) ? complaints : [],
      details,
      aiSummary: raw.ai_summary || 'No AI summary available',
      patientNotes: raw.final_notes_ai || raw.final_note_summarized,
      notesRaw: raw.final_notes_raw,
      triageZone: raw.triage_zone,
      isRedFlag,
      isPriority: isRedFlag, // Initially prioritized if red-flag
      status: deriveStatus(raw), // Read from DB — source of truth
      arrivalTime: parseDate(raw.created_at),
      createdAt: raw.created_at,
      vitals: parseVitals(raw),
      clinicalHistoryFormatted: raw.clinical_history_formatted,
      seen_by_doctor_id: raw.seen_by_doctor_id,
      seen_by_doctor_name: raw.seen_by_doctor_name,
      consultation_started_at: raw.consultation_started_at,
      consultation_completed_at: raw.consultation_completed_at,
    };
  } catch (error) {
    console.error(`Failed to parse submission ${raw.id}:`, error);
    return null;
  }
}

/**
 * Parse array of API submissions
 * Filters out invalid/unparseable records
 */
export function parseSubmissions(rawSubmissions: APISubmission[]): PatientSubmission[] {
  return rawSubmissions
    .map((raw) => parseSubmission(raw))
    .filter((submission): submission is PatientSubmission => submission !== null);
}
