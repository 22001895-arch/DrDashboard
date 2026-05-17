import { APISubmission } from '../types';
import { Doctor } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const HOSPITAL_API_KEY = import.meta.env.VITE_HOSPITAL_API_KEY || '';

const PUBLIC_HEADERS = {
  'Content-Type': 'application/json'
};

const PROTECTED_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': HOSPITAL_API_KEY
};

class APIService {
  /**
   * Authenticate a doctor by email and password
   */
  async login(email: string, password: string): Promise<Doctor> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: PUBLIC_HEADERS,
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data.doctor as Doctor;
  }

  /**
   * Fetch all patient submissions
   */
  async fetchSubmissions(): Promise<APISubmission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/view`, {
        method: 'GET',
        headers: PUBLIC_HEADERS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate response is an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response: Expected array');
      }
      
      // Debug: Log first record to see structure
      if (data.length > 0) {
        console.log('[API Response] First patient record:', data[0]);
      }
      
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Network error: Unable to reach server. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Mark a patient as "In Progress" and record which doctor started the consultation
   */
  async startConsultation(patientId: number | string, doctorId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/start-consultation`, {
      method: 'POST',
      headers: PROTECTED_HEADERS,
      body: JSON.stringify({ doctorId }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to start consultation');
    }
  }

  /**
   * Override the red flag status and record which doctor cleared it
   */
  async overrideRedFlag(patientId: number | string, doctorId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/override-redflag`, {
      method: 'POST',
      headers: PROTECTED_HEADERS,
      body: JSON.stringify({ doctorId }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to override red flag');
    }
  }

  /**
   * Mark a consultation as completed and persist the timestamp to DB
   */
  async completeConsultation(patientId: number | string, doctorId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/complete-consultation`, {
      method: 'POST',
      headers: PROTECTED_HEADERS,
      body: JSON.stringify({ doctorId }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to complete consultation');
    }
  }

  /**
   * Update patient status (kept for compatibility — no-op for generic calls)
   */
  async updateStatus(id: number | string, status: string): Promise<void> {
    // Status is now persisted via startConsultation() and completeConsultation()
    // This method is retained for interface compatibility only.
    console.log(`[API] Status update routed via dedicated endpoints for patient ${id} → ${status}`);
  }

  /**
   * Save edited clinical history to the database
   */
  async updateClinicalHistory(patientId: number | string, clinical_history_edited: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/update-history`, {
      method: 'POST',
      headers: PROTECTED_HEADERS,
      body: JSON.stringify({ clinical_history_edited }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update clinical history');
    }
  }

  /**
   * Save edited AI clinical summary to the database
   */
  async updateAiSummary(patientId: number | string, ai_summary: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}/update-summary`, {
      method: 'POST',
      headers: PROTECTED_HEADERS,
      body: JSON.stringify({ ai_summary }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update AI summary');
    }
  }
}

export const apiService = new APIService();

