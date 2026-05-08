import { APISubmission } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const API_HEADERS = {
  'Content-Type': 'application/json'
};

class APIService {
  /**
   * Fetch all patient submissions
   */
  async fetchSubmissions(): Promise<APISubmission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/view`, {
        method: 'GET',
        headers: API_HEADERS
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
   * Future: Update patient status
   */
  async updateStatus(id: number, status: string): Promise<void> {
    // POST /api/submissions/{id}/status
    console.log(`[Future API] Update status for patient ${id} to ${status}`);
  }
  
  /**
   * Future: Set priority flag
   */
  async setPriority(id: number, isPriority: boolean): Promise<void> {
    // POST /api/submissions/{id}/priority
    console.log(`[Future API] Set priority for patient ${id} to ${isPriority}`);
  }
  
  /**
   * Future: Mark patient as not urgent
   */
  async removeRedFlag(id: number): Promise<void> {
    // POST /api/submissions/{id}/remove-red-flag
    console.log(`[Future API] Remove red flag for patient ${id}`);
  }
}

export const apiService = new APIService();
