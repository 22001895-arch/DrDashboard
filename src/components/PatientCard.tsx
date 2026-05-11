import { PatientSubmission } from '../types';
import { 
  AlertTriangle, 
  User, 
  Calendar,
  ChevronRight,
  Flag,
  FlagOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VitalSignsDisplay } from './VitalSigns';
import { 
  formatTime, 
  getStatusColor,
  getMinutesSince,
  formatRegistrationNumber
} from '../utils/helpers';

interface PatientCardProps {
  patient: PatientSubmission;
  index: number;
}

export function PatientCard({ patient, index }: PatientCardProps) {
  const { attendFirst, markNotUrgent, updateStatus } = useApp();

  const handleViewDetails = () => {
    // Future: Navigate to detailed view
    console.log('View details for patient:', patient.id);
  };

  const handleAttendFirst = () => {
    attendFirst(patient.id);
  };

  const handleMarkNotUrgent = () => {
    markNotUrgent(patient.id);
  };

  const handleStatusChange = (newStatus: typeof patient.status) => {
    updateStatus(patient.id, newStatus);
  };

  const waitingMinutes = getMinutesSince(patient.arrivalTime);
  const isLongWait = waitingMinutes > 30;

  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-clinical hover:shadow-lg transition-all duration-200
        ${patient.isRedFlag ? 'border-l-4 border-red-500 shadow-red-flag' : 'border border-gray-200'}
        ${patient.isPriority ? 'ring-2 ring-clinical-500' : ''}
      `}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Queue Number */}
          <div className="flex items-center justify-center w-12 h-12 bg-clinical-100 rounded-full">
            <span className="text-lg font-bold text-clinical-700">
              {patient.queueNumber}
            </span>
          </div>

          {/* Patient Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {patient.isRedFlag && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  <AlertTriangle className="w-3 h-3" />
                  RED FLAG
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{formatRegistrationNumber(patient.registrationNumber)}</span>
              <span>•</span>
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patient.status)}`}>
          {patient.status}
        </div>
      </div>

      {/* Patient Details */}
      <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Arrival Time</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {formatTime(patient.arrivalTime)}
            </span>
          </div>
          {isLongWait && (
            <p className="text-xs text-orange-600 mt-1">
              Waiting {waitingMinutes} min
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Complaints</p>
          <div className="flex flex-wrap gap-1">
            {patient.complaints.length > 0 ? (
              patient.complaints.slice(0, 2).map((complaint, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {complaint}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">None listed</span>
            )}
            {patient.complaints.length > 2 && (
              <span className="text-xs text-gray-500">
                +{patient.complaints.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Triage Zone</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            patient.triageZone === 'RED' ? 'bg-red-100 text-red-700' :
            patient.triageZone === 'YELLOW' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {patient.triageZone}
          </span>
        </div>
      </div>

      {/* Vital Signs Summary */}
      <div className="mb-4">
        <VitalSignsDisplay vitals={patient.vitals} layout="compact" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-clinical-600 hover:bg-clinical-700 text-white rounded-lg font-medium transition-colors"
        >
          <User className="w-4 h-4" />
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>

        {patient.isRedFlag && (
          <>
            {!patient.isPriority && (
              <button
                onClick={handleAttendFirst}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                title="Move to front of queue"
              >
                <Flag className="w-4 h-4 inline mr-1" />
                Attend First
              </button>
            )}
            <button
              onClick={handleMarkNotUrgent}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors whitespace-nowrap"
              title="Remove red-flag status"
            >
              <FlagOff className="w-4 h-4 inline mr-1" />
              Not Urgent
            </button>
          </>
        )}

        {/* Status Quick Actions */}
        {patient.status === 'Waiting' && !patient.isPriority && (
          <button
            onClick={() => handleStatusChange('In Progress')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Start
          </button>
        )}

        {patient.status === 'In Progress' && (
          <button
            onClick={() => handleStatusChange('Completed')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
