import { VitalSigns } from '../types';
import { Heart, Wind, Activity, Droplets, HeartPulse } from 'lucide-react';

interface VitalSignsProps {
  vitals: VitalSigns;
  layout?: 'compact' | 'detailed';
}

export function VitalSignsDisplay({ vitals, layout = 'compact' }: VitalSignsProps) {
  const getVitalStatus = (metric: string, value: number | string): 'critical' | 'warning' | 'normal' => {
    if (metric === 'heartRate') {
      const val = typeof value === 'string' ? parseInt(value) : value;
      if (val < 60 || val > 100) return val < 50 || val > 120 ? 'critical' : 'warning';
      return 'normal';
    }
    if (metric === 'respiratoryRate') {
      const val = typeof value === 'string' ? parseInt(value) : value;
      if (val < 12 || val > 20) return val < 10 || val > 25 ? 'critical' : 'warning';
      return 'normal';
    }
    if (metric === 'spo2') {
      const val = typeof value === 'string' ? parseFloat(value) : value;
      if (val < 95) return val < 90 ? 'critical' : 'warning';
      return 'normal';
    }
    if (metric === 'rhythm') {
      if (!value) return 'normal';
      const valLower = String(value).toLowerCase();
      if (valLower.includes('irregular') || valLower.includes('arrhythmia') || valLower.includes('abnormal')) {
        return 'critical';
      }
      return 'normal';
    }
    return 'normal';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default:
        return 'bg-green-50 border-green-300 text-green-800';
    }
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const showSPO2 = typeof vitals.spo2 === 'number' && !isNaN(vitals.spo2);
  const showRhythm = typeof vitals.heartBeatRhythm === 'string' && vitals.heartBeatRhythm.trim() !== '';
  const rhythmValue = showRhythm ? vitals.heartBeatRhythm! : 'Normal';

  if (layout === 'compact') {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
        {/* Heart Rate */}
        <div className={`p-3 rounded-lg border overflow-hidden ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <Heart className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-xs font-semibold truncate">HR</span>
          </div>
          <p className="text-lg font-bold">{vitals.heartRate}</p>
          <p className="text-xs opacity-75">bpm</p>
        </div>

        {/* Respiratory Rate */}
        <div className={`p-3 rounded-lg border overflow-hidden ${getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <Wind className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs font-semibold truncate">RR</span>
          </div>
          <p className="text-lg font-bold">{vitals.respiratoryRate}</p>
          <p className="text-xs opacity-75">/min</p>
        </div>

        {/* Blood Oxygen (SPO2) */}
        {showSPO2 && (
          <div className={`p-3 rounded-lg border overflow-hidden ${getStatusColor(getVitalStatus('spo2', vitals.spo2!))}`}>
            <div className="flex items-center gap-2 mb-1 min-w-0">
              <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="text-xs font-semibold truncate">SpO2</span>
            </div>
            <p className="text-lg font-bold">{vitals.spo2}%</p>
            <p className="text-xs opacity-75">oxygen</p>
          </div>
        )}

        {/* Blood Pressure (BP) */}
        <div className="p-3 rounded-lg border bg-green-50 border-green-300 text-green-800 overflow-hidden">
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <HeartPulse className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold truncate">BP</span>
          </div>
          <p className="text-lg font-bold">{vitals.bpSbp} / {vitals.bpDbp}</p>
          <p className="text-xs opacity-75">mmHg</p>
        </div>

        {/* Heart Beat Rhythm */}
        <div className={`p-3 rounded-lg border overflow-hidden ${getStatusColor(getVitalStatus('rhythm', rhythmValue))}`}>
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <Activity className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-xs font-semibold truncate">Rhythm</span>
          </div>
          <p className="text-lg font-bold truncate" title={rhythmValue}>{rhythmValue}</p>
          <p className="text-xs opacity-75">status</p>
        </div>
      </div>
    );
  }

  // Detailed layout with status indicators - optimized for narrow parent containers
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Vital Signs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Heart Rate */}
        <div className={`p-4 rounded-lg border-2 overflow-hidden ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
              <span className="font-semibold text-sm truncate">HR</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getStatusBadge(getVitalStatus('heartRate', vitals.heartRate))}`}>
              {getVitalStatus('heartRate', vitals.heartRate)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{vitals.heartRate} <span className="text-xs font-normal text-gray-500">bpm</span></p>
        </div>

        {/* Respiratory Rate */}
        <div className={`p-4 rounded-lg border-2 overflow-hidden ${getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Wind className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="font-semibold text-sm truncate">RR</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getStatusBadge(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
              {getVitalStatus('respiratoryRate', vitals.respiratoryRate)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{vitals.respiratoryRate} <span className="text-xs font-normal text-gray-500">/min</span></p>
        </div>

        {/* Blood Oxygen (SPO2) */}
        {showSPO2 && (
          <div className={`p-4 rounded-lg border-2 overflow-hidden ${getStatusColor(getVitalStatus('spo2', vitals.spo2!))}`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Droplets className="w-5 h-5 text-sky-500 shrink-0" />
                <span className="font-semibold text-sm truncate">SpO2</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getStatusBadge(getVitalStatus('spo2', vitals.spo2!))}`}>
                {getVitalStatus('spo2', vitals.spo2!)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{vitals.spo2} <span className="text-xs font-normal text-gray-500">%</span></p>
          </div>
        )}

        {/* Blood Pressure (BP) */}
        <div className="p-4 rounded-lg border-2 bg-green-50 border-green-300 text-green-800 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <HeartPulse className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-sm truncate">BP</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 bg-green-500 text-white">
              NORMAL
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{vitals.bpSbp} / {vitals.bpDbp} <span className="text-xs font-normal text-gray-500">mmHg</span></p>
        </div>

        {/* Heart Beat Rhythm */}
        <div className={`p-4 rounded-lg border-2 overflow-hidden sm:col-span-2 lg:col-span-1 xl:col-span-2 ${getStatusColor(getVitalStatus('rhythm', rhythmValue))}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Activity className="w-5 h-5 text-purple-500 shrink-0" />
              <span className="font-semibold text-sm">Heart Beat Rhythm</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${getStatusBadge(getVitalStatus('rhythm', rhythmValue))}`}>
              {getVitalStatus('rhythm', rhythmValue)}
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900" title={rhythmValue}>{rhythmValue}</p>
        </div>
      </div>
    </div>
  );
}
