import { PatientSubmission } from '../types';
import { CheckCircle2, Calendar, Clock, Eye } from 'lucide-react';
import { formatTime, getMinutesSince } from '../utils/helpers';

interface CompletedPatientsTableProps {
  patients: PatientSubmission[];
  onViewDetails: (patient: PatientSubmission) => void;
}

export function CompletedPatientsTable({ patients, onViewDetails }: CompletedPatientsTableProps) {
  const completedPatients = patients.filter(p => p.status === 'Completed');

  if (completedPatients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-clinical p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Consultations</h3>
        <p className="text-gray-500">Patients will appear here after consultation is completed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-clinical overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-clinical-50 to-clinical-100 border-b-2 border-clinical-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Queue</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Registration</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Age</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Complaints</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check-in</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check-out</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {completedPatients.map((patient) => {
              const waitingMinutes = getMinutesSince(patient.arrivalTime);
              const hours = Math.floor(waitingMinutes / 60);
              const minutes = waitingMinutes % 60;
              const durationDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

              return (
                <tr 
                  key={patient.id}
                  onClick={() => onViewDetails(patient)}
                  className="hover:bg-green-50 transition-colors cursor-pointer"
                >
                  {/* Queue Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <span className="text-sm font-bold text-green-700">
                          {patient.queueNumber}
                        </span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </td>

                  {/* Registration Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {patient.registrationNumber}
                    </span>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-700">{patient.age}</span>
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{patient.gender}</span>
                  </td>

                  {/* Complaints */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {patient.complaints.length > 0 ? (
                        patient.complaints.slice(0, 2).map((complaint, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {complaint}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No complaints</span>
                      )}
                      {patient.complaints.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{patient.complaints.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Check-in Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {formatTime(patient.arrivalTime)}
                      </span>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.seen_by_doctor_name ? (
                      <span className="text-sm font-medium text-clinical-700 bg-clinical-50 px-2 py-1 rounded">
                        {patient.seen_by_doctor_name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Check-out Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {patient.checkoutTime ? formatTime(patient.checkoutTime) : '-'}
                      </span>
                    </div>
                  </td>

                  {/* Duration in Consultation */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {durationDisplay}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onViewDetails(patient)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-clinical-100 hover:bg-clinical-200 text-clinical-700 rounded-lg font-medium transition-colors text-sm"
                      title="View patient details"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-green-50 px-6 py-4 border-t border-green-200">
        <p className="text-sm text-gray-700">
          <strong className="text-green-700">{completedPatients.length}</strong> patients completed consultation
        </p>
      </div>
    </div>
  );
}
