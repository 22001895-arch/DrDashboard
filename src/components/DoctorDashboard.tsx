import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PatientSubmission } from '../types';
import { Header } from './Header';
import { AlertBanner } from './AlertBanner';
import { QueueStats } from './QueueStats';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { PatientRow } from './PatientRow';
import { PatientDetailView } from './PatientDetailView';
import { CompletedPatientsTable } from './CompletedPatientsTable';
import { Clock, CheckCircle2, Stethoscope } from 'lucide-react';
import { isPendingPatient } from '../utils/helpers';


export function DoctorDashboard() {
  const { submissions, loading, error, manualRefresh, newRedFlags, dismissRedFlag, dismissAllRedFlags } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<PatientSubmission | null>(null);
  const [activeView, setActiveView] = useState<'waiting' | 'in-progress' | 'completed'>('waiting');

  // If a patient is selected, show the detail view
  if (selectedPatient) {
    return (
      <PatientDetailView
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-clinical-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Red Flag Notifications */}
        {newRedFlags.length > 0 && (
          <div className="mb-6 space-y-2">
            {newRedFlags.map(patient => (
              <AlertBanner
                key={patient.id}
                message={`🚨 NEW RED FLAG: ${patient.patientName} (${patient.age}/${patient.gender}) - ${patient.complaints.join(', ')}`}
                type="warning"
                onDismiss={() => dismissRedFlag(patient.id)}
              />
            ))}
            {newRedFlags.length > 1 && (
              <button
                onClick={dismissAllRedFlags}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Dismiss all red flag alerts
              </button>
            )}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <AlertBanner
            message={error}
            type="error"
            onRetry={manualRefresh}
            onDismiss={() => { }}
          />
        )}

        {/* Queue Statistics */}
        {!loading && submissions.length > 0 && <QueueStats />}

        {/* Loading State */}
        {loading && submissions.length === 0 && <LoadingState />}

        {/* Empty State */}
        {!loading && submissions.length === 0 && !error && <EmptyState />}

        {/* Patient Queue Table */}
        {!loading && submissions.length > 0 && (
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-300">
              <button
                onClick={() => setActiveView('waiting')}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeView === 'waiting'
                  ? 'border-clinical-600 text-clinical-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Clock className="w-5 h-5" />
                Waiting for Consultation
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {submissions.filter(s => s.status === 'Waiting' && !isPendingPatient(s)).length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('in-progress')}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeView === 'in-progress'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Stethoscope className="w-5 h-5" />
                In Consultation
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {submissions.filter(s => s.status === 'In Progress').length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('completed')}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeView === 'completed'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Completed Consultations
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {submissions.filter(s => s.status === 'Completed').length}
                </span>
              </button>
            </div>

            {/* Tab Content - Waiting Patients */}
            {activeView === 'waiting' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Patient Queue ({submissions.filter(s => s.status === 'Waiting' && !isPendingPatient(s)).length})
                  </h2>
                  <div className="text-sm text-gray-600">
                    {submissions.filter(s => s.isRedFlag).length > 0 && (
                      <span className="text-red-600 font-semibold">
                        ⚠️ {submissions.filter(s => s.isRedFlag).length} Red Flag{submissions.filter(s => s.isRedFlag).length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Waiting Patients Table */}
                <div className="bg-white rounded-xl shadow-clinical overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-clinical-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Queue #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          RN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions
                        .filter(p => p.status === 'Waiting' && !isPendingPatient(p))
                        .map((patient, index) => (
                          <PatientRow
                            key={patient.id}
                            patient={patient}
                            index={index}
                            onViewDetails={setSelectedPatient}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Content - In Progress Patients */}
            {activeView === 'in-progress' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    In Consultation ({submissions.filter(s => s.status === 'In Progress').length})
                  </h2>
                </div>

                <div className="bg-white rounded-xl shadow-clinical overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Queue #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          RN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions
                        .filter(p => p.status === 'In Progress')
                        .map((patient, index) => (
                          <PatientRow
                            key={patient.id}
                            patient={patient}
                            index={index}
                            onViewDetails={setSelectedPatient}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Content - Completed Patients */}
            {activeView === 'completed' && (
              <CompletedPatientsTable
                patients={submissions}
                onViewDetails={setSelectedPatient}
              />
            )}
          </div>
        )}

        {/* Subtle Loading Indicator During Refresh */}
        {loading && submissions.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-clinical-600 rounded-full animate-pulse"></div>
              Refreshing...
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-6 mt-12 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>Emergency Department EMR System - Green Zone</p>
          <p className="mt-1">For clinical use only • Auto-refreshes every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
}
