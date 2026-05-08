import { PatientSubmission, PatientDetails, PatientStatus } from '../types';

/**
 * Safely parse JSON string with fallback
 */
export function safeJSONParse<T>(jsonString: string, fallback: T): T {
  try {
    const trimmed = jsonString.trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed) as T;
  } catch (error) {
    console.warn('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Generate queue number from ID
 */
export function generateQueueNumber(id: number): string {
  return `Q${String(id).padStart(3, '0')}`;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  // Handle format: "2026-01-13 04:22:41"
  const parsed = new Date(dateString.replace(' ', 'T'));
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Sort patient queue by priority
 * Priority order:
 * 1. Red-flag AND manually prioritized (isPriority)
 * 2. Red-flag (even if not manually prioritized)
 * 3. Status (In Progress > Waiting > Completed)
 * 4. Arrival time (earlier first)
 */
export function sortPatientQueue(submissions: PatientSubmission[]): PatientSubmission[] {
  return [...submissions].sort((a, b) => {
    // Priority 1: Manually prioritized red-flags
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    
    // Priority 2: Red-flags
    if (a.isRedFlag && !b.isRedFlag) return -1;
    if (!a.isRedFlag && b.isRedFlag) return 1;
    
    // Priority 3: Status ordering
    const statusOrder: Record<PatientStatus, number> = {
      'In Progress': 0,
      'Waiting': 1,
      'Completed': 2
    };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Priority 4: Arrival time (earlier = higher priority)
    return a.arrivalTime.getTime() - b.arrivalTime.getTime();
  });
}

/**
 * Extract patient name from details with fallback
 */
export function extractPatientName(details: PatientDetails): string {
  return (details.name as string) || (details.patientName as string) || 'Unknown Patient';
}

/**
 * Extract age with validation
 */
export function extractAge(details: PatientDetails): number {
  const age = details.age || details.patientAge;
  
  // Handle both string and number types
  let ageNum: number;
  if (typeof age === 'string') {
    ageNum = parseInt(age, 10);
  } else if (typeof age === 'number') {
    ageNum = age;
  } else {
    return 0; // Unknown age
  }
  
  // Validate age range
  if (!isNaN(ageNum) && ageNum > 0 && ageNum < 150) {
    return ageNum;
  }
  return 0; // Unknown age
}

/**
 * Extract gender with normalization
 */
export function extractGender(details: PatientDetails): 'Male' | 'Female' | 'Other' {
  const gender = ((details.gender as string) || (details.patientGender as string) || '').toLowerCase();
  if (gender.includes('male') && !gender.includes('female')) return 'Male';
  if (gender.includes('female')) return 'Female';
  return 'Other';
}

/**
 * Format time for display (e.g., "09:15 AM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Calculate time difference in minutes
 */
export function getMinutesSince(date: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60));
}

/**
 * Format relative time (e.g., "15 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  const minutes = getMinutesSince(date);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: PatientStatus): string {
  const colors = {
    'Waiting': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
    'Completed': 'bg-green-100 text-green-800 border-green-300'
  };
  return colors[status];
}

/**
 * Get triage zone color
 */
export function getTriageColor(zone: string): string {
  const colors = {
    'RED': 'bg-red-100 text-red-800 border-red-300',
    'YELLOW': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'GREEN': 'bg-green-100 text-green-800 border-green-300'
  };
  return colors[zone as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
}

/**
 * Format registration number by removing "RN" prefix if present
 */
export function formatRegistrationNumber(registrationNumber: string): string {
  if (!registrationNumber) return '';
  // Remove "RN" prefix if it exists at the start
  if (registrationNumber.startsWith('RN')) {
    return registrationNumber.substring(2);
  }
  return registrationNumber;
}
