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
    
    // Determine red flag status - handle both new (redflag) and old (red_flag) formats
    const redFlagValue = raw.redflag || raw.red_flag || 'No';
    const isRedFlag = redFlagValue === 'Yes' || redFlagValue === 'YES';
    
    return {
      id: raw.id,
      queueNumber: generateQueueNumber(raw.id),
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
      status: 'Waiting', // Default status
      arrivalTime: parseDate(raw.created_at),
      createdAt: raw.created_at,
      vitals: parseVitals(raw),
      clinicalHistoryFormatted: raw.clinical_history_formatted,
      seen_by_doctor_id: raw.seen_by_doctor_id,
      seen_by_doctor_name: raw.seen_by_doctor_name,
      consultation_started_at: raw.consultation_started_at
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
    .map((raw, index) => {
      const submission = parseSubmission(raw);
      if (submission) {
        // Assign a sequential queue number based on arrival order (index in API response)
        submission.queueNumber = `Q${String(index + 1).padStart(3, '0')}`;
      }
      return submission;
    })
    .filter((submission): submission is PatientSubmission => submission !== null);
}
