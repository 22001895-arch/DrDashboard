import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { PatientSubmission, PatientStatus, AppState, AppActions } from '../types';
import { apiService } from '../services/api';
import { parseSubmissions } from '../services/parser';
import { sortPatientQueue } from '../utils/helpers';
import { useAuth } from './AuthContext';

interface AppContextValue extends AppState, AppActions {}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Restore status overrides from localStorage
const loadStatusOverrides = (): Map<number | string, PatientStatus> => {
  try {
    const stored = localStorage.getItem('statusOverrides');
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(parsed);
    }
  } catch (err) {
    console.error('Failed to load status overrides:', err);
  }
  return new Map();
};

// Restore checkout times from localStorage
const loadCheckoutTimes = (): Map<number | string, string> => {
  try {
    const stored = localStorage.getItem('checkoutTimes');
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(parsed);
    }
  } catch (err) {
    console.error('Failed to load checkout times:', err);
  }
  return new Map();
};

export function AppProvider({ children }: AppProviderProps) {
  const { doctor } = useAuth();
  const [submissions, setSubmissions] = useState<PatientSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [newRedFlags, setNewRedFlags] = useState<PatientSubmission[]>([]);
  // Track local status overrides to preserve them across refreshes (including page reloads)
  const [statusOverrides, setStatusOverrides] = useState<Map<number | string, PatientStatus>>(loadStatusOverrides());
  // Track checkout times to preserve them across refreshes
  const [checkoutTimes, setCheckoutTimes] = useState<Map<number | string, string>>(loadCheckoutTimes());

  /**
   * Fetch submissions from API
   */
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawData = await apiService.fetchSubmissions();
      const parsedData = parseSubmissions(rawData);
      
      // Merge with local status overrides and checkout times to preserve user actions across refreshes
      const dataWithLocalStatus = parsedData.map(patient => {
        const localStatus = statusOverrides.get(patient.id);
        const checkoutTimeStr = checkoutTimes.get(patient.id);
        const updates: Partial<PatientSubmission> = {};
        
        if (localStatus) {
          updates.status = localStatus;
        }
        if (checkoutTimeStr) {
          updates.checkoutTime = new Date(checkoutTimeStr);
        }
        
        return { ...patient, ...updates };
      });
      
      const sortedData = sortPatientQueue(dataWithLocalStatus);
      
      // Detect new red flags
      setSubmissions(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const newPatients = sortedData.filter(p => p.isRedFlag && !existingIds.has(p.id));
        
        if (newPatients.length > 0) {
          setNewRedFlags(curr => [...curr, ...newPatients]);
        }
        
        return sortedData;
      });
      
      setLastRefresh(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [statusOverrides, checkoutTimes]);

  /**
   * Start consultation — stamps the doctor onto the patient record in DB
   */
  const attendFirst = useCallback((id: number | string) => {
    setSubmissions(prev => {
      const updated = prev.map(sub =>
        sub.id === id
          ? { 
              ...sub, 
              isPriority: true, 
              status: 'In Progress' as PatientStatus,
              seen_by_doctor_name: doctor?.name
            }
          : sub
      );
      return sortPatientQueue(updated);
    });

    if (doctor) {
      apiService.startConsultation(id, doctor.id).catch(err =>
        console.error('[API] startConsultation failed:', err)
      );
    }
  }, [doctor]);

  /**
   * Remove red-flag and priority status — records which doctor cleared it in DB
   */
  const markNotUrgent = useCallback((id: number | string) => {
    setSubmissions(prev => {
      const updated = prev.map(sub =>
        sub.id === id
          ? { ...sub, isPriority: false, isRedFlag: false }
          : sub
      );
      return sortPatientQueue(updated);
    });

    if (doctor) {
      apiService.overrideRedFlag(id, doctor.id).catch(err =>
        console.error('[API] overrideRedFlag failed:', err)
      );
    }
  }, [doctor]);

  /**
   * Update patient status
   */
  const updateStatus = useCallback((id: number | string, status: PatientStatus) => {
    // Track status override locally to persist across refreshes
    setStatusOverrides(prev => {
      const updated = new Map(prev);
      updated.set(id, status);
      return updated;
    });
    
    // Capture checkout time when marking as Completed
    if (status === 'Completed') {
      setCheckoutTimes(prev => {
        const updated = new Map(prev);
        const checkoutTimeStr = new Date().toISOString();
        updated.set(id, checkoutTimeStr);
        return updated;
      });
    }
    
    // Update UI immediately
    setSubmissions(prev => {
      const updated = prev.map(sub => {
        if (sub.id === id) {
          const extraUpdates: Partial<PatientSubmission> = {};
          
          if (status === 'Completed' && !sub.checkoutTime) {
            extraUpdates.checkoutTime = new Date();
          }
          
          // Optimistically show doctor name when starting consultation
          if (status === 'In Progress' && doctor) {
            extraUpdates.seen_by_doctor_name = doctor.name;
          }
          
          return { ...sub, status, ...extraUpdates };
        }
        return sub;
      });
      return sortPatientQueue(updated);
    });
    
    // API calls based on status
    if (status === 'In Progress' && doctor) {
      apiService.startConsultation(id, doctor.id).catch(err =>
        console.error('[API] startConsultation failed:', err)
      );
    }
    
    // Future: API call to persist generic status
    apiService.updateStatus(id, status).catch(err => console.error(err));
  }, [doctor]);

  /**
   * Toggle auto-refresh
   */
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
  }, []);

  /**
   * Manual refresh
   */
  const manualRefresh = useCallback(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  /**
   * Dismiss red flag notification
   */
  const dismissRedFlag = useCallback((id: number) => {
    setNewRedFlags(prev => prev.filter(p => p.id !== id));
  }, []);

  /**
   * Dismiss all red flag notifications
   */
  const dismissAllRedFlags = useCallback(() => {
    setNewRedFlags([]);
  }, []);

  /**
   * Persist status overrides to localStorage
   */
  useEffect(() => {
    const statusArray = Array.from(statusOverrides.entries());
    localStorage.setItem('statusOverrides', JSON.stringify(statusArray));
  }, [statusOverrides]);

  /**
   * Persist checkout times to localStorage
   */
  useEffect(() => {
    const checkoutArray = Array.from(checkoutTimes.entries());
    localStorage.setItem('checkoutTimes', JSON.stringify(checkoutArray));
  }, [checkoutTimes]);

  /**
   * Auto-refresh every 30 seconds
   */
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const intervalId = setInterval(() => {
      fetchSubmissions();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, fetchSubmissions]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const value: AppContextValue = {
    submissions,
    loading,
    error,
    lastRefresh,
    autoRefreshEnabled,
    newRedFlags,
    fetchSubmissions,
    attendFirst,
    markNotUrgent,
    updateStatus,
    toggleAutoRefresh,
    manualRefresh,
    dismissRedFlag,
    dismissAllRedFlags
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
