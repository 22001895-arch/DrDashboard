// fieldTranslations.js

export const FIELD_TRANSLATIONS = {
  // ============================================
  // PATIENT IDENTIFICATION & NOTES
  // ============================================
  patientId: "Patient ID",
  p_final_notes: "Patient Comments/Additional Notes",

  // ============================================
  // DEMOGRAPHICS
  // ============================================
  age: "Age",
  gender: "Gender",
  lmp: "Last Menstrual Period",
  comorbids: "Existing Medical Conditions",
  surgical_history: "Past Surgical History",
  allergy_history: "Allergy History",
  medications: "Current Medications",

  // ============================================
  // PAIN MODULE (Shared Questions)
  // ============================================
  p_loc: "Pain Location(s)",
  p_sub_loc: "Pain Sub-location",
  p_onset_type: "Pain Onset Timing",
  p_current: "Currently Experiencing Pain",
  p_overall_duration: "Overall Pain Duration",
  p_pattern: "Pain Pattern (Constant vs Intermittent)",
  p_score: "Pain Severity (1-10 Scale)",
  p_progression: "Pain Progression (Improving/Worsening)",
  p_speed: "Pain Onset Speed (Sudden vs Gradual)",
  p_character: "Pain Character/Quality",
  p_spread: "Pain Radiation/Spreading",

  // ============================================
  // ABDOMEN-SPECIFIC QUESTIONS
  // ============================================
  abd_meal: "Pain Relation to Eating",
  abd_posture: "Pain Relief with Forward Lean",
  abd_assoc: "Associated Abdominal Symptoms",
  abd_med: "Previous Abdominal Surgery",

  // ============================================
  // CHEST-SPECIFIC QUESTIONS
  // ============================================
  cp_precipitate: "Chest Pain Triggers/Precipitants",
  cp_factor: "Chest Pain Relief Factors",
  cp_assoc: "Associated Chest Symptoms",

  // ============================================
  // HEAD-SPECIFIC QUESTIONS
  // ============================================
  h_assoc: "Associated Headache Symptoms",

  // ============================================
  // FEVER COMPLAINT
  // ============================================
  f_onset: "Fever Start Date",
  f_duration: "Fever Duration (Days)",
  f_pattern: "Highest Temperature Recorded",
  f_assoc: "Associated Fever Symptoms",
  f_infect: "Recent Infection/Hospital/Immunocompromised",
  f_contact: "Contact with Sick Person",
  f_travel: "Recent Travel",
  f_vaccine: "Vaccination Status Up to Date",
  f_visit: "Doctor Visit for Fever",

  // ============================================
  // HEADACHE COMPLAINT
  // ============================================
  h_onset: "Headache Onset (Gradual vs Sudden)",
  h_location: "Headache Location(s)",
  h_feel: "Headache Quality/Character",
  h_score: "Headache Severity (1-10 Scale)",

  // ============================================
  // DIZZINESS COMPLAINT
  // ============================================
  dz_onset: "Dizziness Onset",
  dz_duration: "Dizziness Duration",
  dz_feel: "Dizziness Character/Type",
  dz_trigger: "Dizziness Triggers",
  dz_assoc: "Associated Dizziness Symptoms",
  dz_med: "Medication for Dizziness",

  // ============================================
  // CHEST PAIN COMPLAINT (Alternative Module)
  // ============================================
  cp_onset: "Chest Pain Onset",
  cp_duration: "Chest Pain Duration",
  cp_location: "Chest Pain Location",
  cp_rad: "Chest Pain Radiation",
  cp_feel: "Chest Pain Quality",

  // ============================================
  // ABDOMINAL PAIN COMPLAINT (Alternative Module)
  // ============================================
  abd_onset: "Abdominal Pain Onset",
  abd_location: "Abdominal Pain Location",
  abd_rad: "Abdominal Pain Radiation",
  abd_char: "Abdominal Pain Character",
  abd_score: "Abdominal Pain Severity",
  abd_fam: "Family History of Cancer",

  // ============================================
  // SYNCOPE/FAINTING COMPLAINT
  // ============================================
  syn_trigger: "Syncope Trigger Activity",
  syn_prodrome: "Pre-Syncope Warning Signs",
  syn_duration: "Syncope Duration",
  syn_assoc: "Associated Syncope Symptoms",
  syn_witnessed: "Syncope Witnessed",
  syn_episodes: "Previous Syncope Episodes",

  // ============================================
  // BODY WEAKNESS/LETHARGY COMPLAINT
  // ============================================
  let_onset: "Weakness/Lethargy Onset",
  let_rad: "Weakness Distribution",
  let_assoc: "Associated Weakness Symptoms",
  let_med: "Current Medications",

  // ============================================
  // SORE THROAT COMPLAINT
  // ============================================
  sore_onset: "Sore Throat Onset",
  sore_score: "Sore Throat Severity (1-10 Scale)",
  sore_assoc: "Associated Sore Throat Symptoms",

  // ============================================
  // ALTERED MENTAL STATUS COMPLAINT
  // ============================================
  mental_onset: "Mental Status Change Onset",
  mental_status: "Baseline Functional Status",
  mental_assoc: "Associated Mental Status Symptoms",
  mental_history: "Psychiatric History",

  // ============================================
  // SYSTEM FIELDS (Database metadata)
  // ============================================
  id: "Patient ID",
  complaints: "Chief Complaints",
  details: "Patient Details/History",
  ai_summary: "AI Triage Summary",
  triage_zone: "Triage Zone (RED/YELLOW/GREEN)",
  red_flag: "Red Flag Triggered",
  final_notes_raw: "Raw Patient Notes",
  final_notes_ai: "AI-Summarized Patient Notes",
  created_at: "Submission Timestamp"
};