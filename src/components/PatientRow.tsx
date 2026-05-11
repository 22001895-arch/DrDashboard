import { PatientSubmission } from '../types';
import { 
  AlertTriangle, 
  ChevronRight,
  Flag,
  FlagOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  formatTime, 
  getStatusColor,
  getMinutesSince,
  formatRegistrationNumber
} from '../utils/helpers';

interface PatientRowProps {
  patient: PatientSubmission;
  index: number;
  onViewDetails: (patient: PatientSubmission) => void;
}

export function PatientRow({ patient, index, onViewDetails }: PatientRowProps) {
  const { attendFirst, markNotUrgent } = useApp();

  const handleAttendFirst = () => {
    attendFirst(patient.id);
  };

  const handleMarkNotUrgent = () => {
    markNotUrgent(patient.id);
  };

  const waitingMinutes = getMinutesSince(patient.arrivalTime);
  const isLongWait = waitingMinutes > 30;

  return (
    <tr
      className={`
        border-b border-gray-200 hover:bg-gray-50 transition-colors
        ${patient.isRedFlag ? 'bg-red-100 border-l-8 border-l-red-600 shadow-red-flag' : ''}
        ${patient.isPriority ? 'bg-clinical-50' : ''}
      `}
    >
      {/* Queue Number */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {patient.queueNumber}
          </span>
          {patient.isRedFlag && (
            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
          )}
        </div>
      </td>

      {/* RN */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">
          {formatRegistrationNumber(patient.registrationNumber)}
        </span>
      </td>

      {/* Age */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <span className="text-sm text-gray-700">{patient.age}</span>
      </td>

      {/* Gender */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700">{patient.gender}</span>
      </td>

      {/* Arrival Time */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatTime(patient.arrivalTime)}
          {isLongWait && (
            <p className="text-xs text-orange-600 mt-0.5">
              {waitingMinutes} min wait
            </p>
          )}
        </div>
      </td>

      {/* Doctor */}
      <td className="px-4 py-4 whitespace-nowrap">
        {patient.seen_by_doctor_name ? (
          <span className="text-sm font-medium text-clinical-700 bg-clinical-50 px-2 py-1 rounded">
            {patient.seen_by_doctor_name}
          </span>
        ) : (
          <span className="text-sm text-gray-400 italic">Unassigned</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patient.status)}`}>
          {patient.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(patient)}
            className="flex items-center gap-1 px-4 py-2 bg-clinical-600 hover:bg-clinical-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>

          {patient.status === 'Waiting' && patient.isRedFlag && !patient.isPriority && (
            <button
              onClick={handleAttendFirst}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
              title="Move to front of queue"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}

          {patient.status === 'Waiting' && patient.isRedFlag && (
            <button
              onClick={handleMarkNotUrgent}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              title="Remove red-flag status"
            >
              <FlagOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
