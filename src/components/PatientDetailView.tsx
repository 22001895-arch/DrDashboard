import { useState } from 'react';
import { PatientSubmission } from '../types';
import { X, Calendar, User, Activity, AlertTriangle, FileText, Brain, Edit3, Check, Copy, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VitalSignsDisplay } from './VitalSigns';

import {
  formatTime,
  getStatusColor,
  getMinutesSince,
  getTriageColor
} from '../utils/helpers';

interface PatientDetailViewProps {
  patient: PatientSubmission;
  onClose: () => void;
}

export function PatientDetailView({ patient: initialPatient, onClose }: PatientDetailViewProps) {
  const { submissions, updateStatus, attendFirst, markNotUrgent } = useApp();

  // Get the fresh patient data from context to ensure status updates are reflected immediately
  const patient = submissions.find(p => p.id === initialPatient.id) || initialPatient;
  const waitingMinutes = getMinutesSince(patient.arrivalTime);

  // Edit mode state for AI summary
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSummary, setEditedSummary] = useState(patient.aiSummary);
  const [isCopied, setIsCopied] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedSummary(patient.aiSummary);
  };

  const handleConfirmEdit = () => {
    // Update the patient's AI summary (in a real app, this would call an API)
    patient.aiSummary = editedSummary;
    setIsEditMode(false);
    // Future: API call to save the edited summary
    console.log('Summary updated:', editedSummary);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedSummary(patient.aiSummary);
  };

  const handleValidateAndCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = editedSummary;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-clinical-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-clinical-600 to-clinical-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Patient {patient.queueNumber}</h1>
                <p className="text-clinical-100 mt-1">
                  {patient.registrationNumber} • Patient Details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {patient.isRedFlag && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg font-semibold">
                  <AlertTriangle className="w-5 h-5" />
                  RED FLAG
                </div>
              )}
              <span className={`px-4 py-2 rounded-lg font-semibold border-2 ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Demographics Card */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-clinical-600" />
                <h2 className="text-xl font-bold text-gray-900">Demographics</h2>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-lg font-semibold text-gray-900">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-lg font-semibold text-gray-900">{patient.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.registrationNumber}</p>
                </div>
              </div>
            </div>

            {/* Check In Info Card */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-clinical-600" />
                <h2 className="text-xl font-bold text-gray-900">Check In Info</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Check In Time</p>
                  <p className="text-lg font-semibold text-gray-900">{formatTime(patient.arrivalTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waiting Time</p>
                  <p className={`text-lg font-semibold ${waitingMinutes > 30 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {waitingMinutes} minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Vital Signs Card */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <VitalSignsDisplay vitals={patient.vitals} layout="detailed" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-clinical-600" />
                <h2 className="text-xl font-bold text-gray-900">Actions</h2>
              </div>
              <div className="space-y-2">
                {patient.status === 'Waiting' && (
                  <button
                    onClick={() => updateStatus(patient.id, 'In Progress')}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Start Consultation
                  </button>
                )}
                {patient.status === 'In Progress' && (
                  <button
                    onClick={() => updateStatus(patient.id, 'Completed')}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
                {patient.status === 'Waiting' && patient.isRedFlag && !patient.isPriority && (
                  <button
                    onClick={() => {
                      attendFirst(patient.id);
                      onClose();
                    }}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Attend First (Priority)
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Back to Queue
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Clinical Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chief Complaints */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-clinical-600" />
                <h2 className="text-xl font-bold text-gray-900">Chief Complaints</h2>
              </div>
              {patient.complaints.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.complaints.map((complaint, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                    >
                      {complaint}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No complaints listed</p>
              )}
            </div>

            {/* Red Flag Causes */}
            {patient.isRedFlag && (patient.details?.triggeredRedFlagRules || patient.details?.triggeredRedFlagRuleIds) && (
              <div className="bg-red-50 rounded-xl shadow-clinical p-6 border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-xl font-bold text-red-700">Red Flag Causes</h2>
                  </div>
                  {patient.status === 'Waiting' && (
                    <button
                      onClick={() => markNotUrgent(patient.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Mark Not Urgent
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {patient.details.triggeredRedFlagRules ? (
                    patient.details.triggeredRedFlagRules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100">
                        <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded text-xs font-bold ${
                          rule.priority === 'Critical'
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-400 text-white'
                        }`}>
                          {rule.priority?.toUpperCase()}
                        </span>
                        <span className="text-sm text-red-800 font-medium">{rule.label}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-white rounded-lg border border-red-100">
                      <p className="text-sm text-red-700 font-mono">
                        {Array.isArray(patient.details.triggeredRedFlagRuleIds)
                          ? patient.details.triggeredRedFlagRuleIds.join(', ')
                          : String(patient.details.triggeredRedFlagRuleIds)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div className="bg-white rounded-xl shadow-clinical p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-clinical-600" />
                  <h2 className="text-xl font-bold text-gray-900">AI Clinical Summary</h2>
                  {patient.isRedFlag && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      ⚠️ Red Flag Detected
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {!isEditMode ? (
                    <>
                      <button
                        onClick={handleEditClick}
                        className="flex items-center gap-2 px-4 py-2 bg-clinical-100 hover:bg-clinical-200 text-clinical-700 rounded-lg font-medium transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={handleValidateAndCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isCopied
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                      >
                        {isCopied ? (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Validate & Copy
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Confirm Edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                {isEditMode ? (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    className="w-full min-h-[200px] p-4 border-2 border-clinical-300 rounded-lg focus:border-clinical-500 focus:ring-2 focus:ring-clinical-200 text-gray-700 leading-relaxed resize-y"
                    placeholder="Enter clinical summary..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {editedSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Patient Notes */}
            {patient.patientNotes && (
              <div className="bg-white rounded-xl shadow-clinical p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-clinical-600" />
                  <h2 className="text-xl font-bold text-gray-900">Patient Notes</h2>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {patient.patientNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Patient History & Details - Clinical Format */}
            {patient.details && Object.keys(patient.details).length > 0 && (
              <div className="bg-white rounded-xl shadow-clinical p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-clinical-600" />
                  <h2 className="text-xl font-bold text-gray-900">Clinical History</h2>
                </div>

                <div className="space-y-6 text-gray-800 leading-relaxed text-sm">
                  {patient.clinicalHistoryFormatted ? (
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 whitespace-pre-wrap font-sans text-gray-700 shadow-sm">
                      {patient.clinicalHistoryFormatted}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-medium">No formatted clinical history available.</p>
                      <p className="text-xs mt-2 px-6 text-center">The processing for this patient record may still be in progress.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
