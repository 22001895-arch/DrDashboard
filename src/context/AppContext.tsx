import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { PatientSubmission, PatientStatus, AppState, AppActions } from '../types';
import { apiService } from '../services/api';
import { parseSubmissions } from '../services/parser';
import { sortPatientQueue } from '../utils/helpers';
import { useAuth } from './AuthContext';

const DOCTOR_STORAGE_KEY = 'idp_logged_in_doctor';

/** Read doctor.id reliably — React state OR sessionStorage fallback */
function getStoredDoctorId(): string | null {
  try {
    const raw = sessionStorage.getItem(DOCTOR_STORAGE_KEY);
    if (raw) return JSON.parse(raw)?.id ?? null;
  } catch { /* ignore */ }
  return null;
}

interface AppContextValue extends AppState, AppActions {}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { doctor } = useAuth();
  const [submissions, setSubmissions] = useState<PatientSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [newRedFlags, setNewRedFlags] = useState<PatientSubmission[]>([]);

  /**
   * Fetch submissions from API
   */
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawData = await apiService.fetchSubmissions();
      const parsedData = parseSubmissions(rawData);
      
      // Status now comes directly from the DB via deriveStatus() in parser.ts.
      // No sessionStorage merge needed.
      const sortedData = sortPatientQueue(parsedData);
      
      // Detect new red flags
      setSubmissions(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        
        // Read dismissed alerts from localStorage
        const dismissedAlertsRaw = localStorage.getItem('idp_dismissed_red_flags');
        const dismissedAlertIds = dismissedAlertsRaw ? new Set(JSON.parse(dismissedAlertsRaw) as string[]) : new Set<string>();
        
        // Only trigger alerts for patients who are RED FLAG and currently WAITING and not dismissed
        const newPatients = sortedData.filter(
          p => p.isRedFlag && p.status === 'Waiting' && !existingIds.has(p.id) && !dismissedAlertIds.has(String(p.id))
        );
        
        setNewRedFlags(curr => {
          // Keep currently alerted red flags only if they are still active waiting red flags
          const activeAlertIds = new Set(
            sortedData
              .filter(p => p.isRedFlag && p.status === 'Waiting')
              .map(p => p.id)
          );
          const filteredCurr = curr.filter(p => activeAlertIds.has(p.id));
          
          const merged = [...filteredCurr];
          newPatients.forEach(p => {
            if (!merged.some(existing => existing.id === p.id)) {
              merged.push(p);
            }
          });
          return merged;
        });
        
        // Auto-clean stale dismissed IDs from localStorage (keep only currently active ones)
        const currentPatientIds = new Set(sortedData.map(p => String(p.id)));
        const activeDismissedIds = Array.from(dismissedAlertIds).filter(id => currentPatientIds.has(id));
        localStorage.setItem('idp_dismissed_red_flags', JSON.stringify(activeDismissedIds));
        
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
  }, []);

  /**
   * Start consultation — stamps the doctor onto the patient record in DB
   */
  const attendFirst = useCallback((id: number | string) => {
    // Optimistic update
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
    setNewRedFlags(curr => curr.filter(p => String(p.id) !== String(id)));

    const doctorId = doctor?.id ?? getStoredDoctorId();
    if (doctorId) {
      apiService.startConsultation(id, doctorId).catch((err: any) => {
        console.error('[API] startConsultation failed:', err);
        // Revert optimistic update on conflict/error
        alert(err.message || 'Failed to start consultation.');
        fetchSubmissions(); // Force refresh to get true DB state
      });
    } else {
      console.warn('[AppContext] attendFirst: no doctor ID available, DB not updated');
    }
  }, [doctor, fetchSubmissions]);

  /**
   * Remove red-flag and priority status — records which doctor cleared it in DB
   */
  const markNotUrgent = useCallback((id: number | string) => {
    // Optimistic update
    setSubmissions(prev => {
      const updated = prev.map(sub =>
        sub.id === id
          ? { ...sub, isPriority: false, isRedFlag: false }
          : sub
      );
      return sortPatientQueue(updated);
    });
    setNewRedFlags(curr => curr.filter(p => String(p.id) !== String(id)));

    if (doctor) {
      apiService.overrideRedFlag(id, doctor.id).catch((err: any) => {
        console.error('[API] overrideRedFlag failed:', err);
        // Revert on conflict (e.g. already dismissed by another doctor — harmless, just notify)
        alert(err.message || 'Failed to dismiss red flag.');
        fetchSubmissions();
      });
    }
  }, [doctor, fetchSubmissions]);

  /**
   * Update patient status
   */
  const updateStatus = useCallback((id: number | string, status: PatientStatus) => {
    // Optimistic UI update — show the change immediately before the API responds
    setSubmissions(prev => {
      const updated = prev.map(sub => {
        if (sub.id !== id) return sub;
        const extraUpdates: Partial<PatientSubmission> = {};
        if (status === 'Completed' && !sub.checkoutTime) {
          extraUpdates.checkoutTime = new Date();
        }
        if (status === 'In Progress' && doctor) {
          extraUpdates.seen_by_doctor_name = doctor.name;
        }
        return { ...sub, status, ...extraUpdates };
      });
      return sortPatientQueue(updated);
    });
    setNewRedFlags(curr => curr.filter(p => String(p.id) !== String(id)));

    // Use doctor from React state, fall back to sessionStorage to avoid race condition
    const doctorId = doctor?.id ?? getStoredDoctorId();

    if (!doctorId) {
      console.warn('[AppContext] updateStatus: no doctor ID — DB will not be updated!');
      return;
    }

    // Persist to DB via dedicated endpoints — revert optimistic update on conflict
    if (status === 'In Progress') {
      apiService.startConsultation(id, doctorId).catch((err: any) => {
        console.error('[API] startConsultation failed:', err);
        alert(err.message || 'Failed to start consultation.');
        fetchSubmissions(); // Force-refresh to restore true DB state
      });
    }
    if (status === 'Completed') {
      apiService.completeConsultation(id, doctorId).catch((err: any) => {
        console.error('[API] completeConsultation failed:', err);
        alert(err.message || 'Failed to complete consultation.');
        fetchSubmissions();
      });
    }
  }, [doctor, fetchSubmissions]);

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
  const dismissRedFlag = useCallback((id: number | string) => {
    setNewRedFlags(prev => prev.filter(p => String(p.id) !== String(id)));
    
    // Persist manual dismissal to localStorage
    const dismissedAlertsRaw = localStorage.getItem('idp_dismissed_red_flags');
    const dismissedAlertIds = dismissedAlertsRaw ? (JSON.parse(dismissedAlertsRaw) as string[]) : [];
    if (!dismissedAlertIds.includes(String(id))) {
      dismissedAlertIds.push(String(id));
      localStorage.setItem('idp_dismissed_red_flags', JSON.stringify(dismissedAlertIds));
    }
  }, []);

  /**
   * Dismiss all red flag notifications
   */
  const dismissAllRedFlags = useCallback(() => {
    setNewRedFlags([]);
    
    const dismissedAlertsRaw = localStorage.getItem('idp_dismissed_red_flags');
    const dismissedAlertIds = dismissedAlertsRaw ? (JSON.parse(dismissedAlertsRaw) as string[]) : [];
    
    submissions.forEach(p => {
      if (p.isRedFlag && p.status === 'Waiting' && !dismissedAlertIds.includes(String(p.id))) {
        dismissedAlertIds.push(String(p.id));
      }
    });
    localStorage.setItem('idp_dismissed_red_flags', JSON.stringify(dismissedAlertIds));
  }, [submissions]);

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
