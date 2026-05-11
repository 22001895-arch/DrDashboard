import { VitalSigns } from '../types';
import { Heart, Wind, Activity, Droplets } from 'lucide-react';

interface VitalSignsProps {
  vitals: VitalSigns;
  layout?: 'compact' | 'detailed';
}

export function VitalSignsDisplay({ vitals, layout = 'compact' }: VitalSignsProps) {
  const getVitalStatus = (metric: string, value: number | string): 'critical' | 'warning' | 'normal' => {
    if (metric === 'ppi') {
      // PPI (Pulse Pressure Index) is typically 0.5-1.0, so we just mark it as normal
      return 'normal';
    }
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
    if (metric === 'hrv') {
      return 'normal'; // HRV is informational
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

  if (layout === 'compact') {
    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {/* Pulse Rate (PPI) */}
        <div className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus('ppi', vitals.ppi))}`}>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-semibold truncate">PPI</span>
          </div>
          <p className="text-lg font-bold">{typeof vitals.ppi === 'number' ? vitals.ppi.toFixed(2) : vitals.ppi}</p>
          <p className="text-xs opacity-75"></p>
        </div>

        {/* Heart Rate */}
        <div className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-semibold truncate">HR</span>
          </div>
          <p className="text-lg font-bold">{vitals.heartRate}</p>
          <p className="text-xs opacity-75">bpm</p>
        </div>

        {/* Respiratory Rate */}
        <div className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-xs font-semibold truncate">RR</span>
          </div>
          <p className="text-lg font-bold">{vitals.respiratoryRate}</p>
          <p className="text-xs opacity-75">/min</p>
        </div>

        {/* Heart Rate Variability */}
        <div className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus('hrv', vitals.hrv))}`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold truncate">HRV</span>
          </div>
          <p className="text-lg font-bold">{vitals.hrv}</p>
          <p className="text-xs opacity-75">ms</p>
        </div>
      </div>
    );
  }

  // Detailed layout with status indicators
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Vital Signs</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Pulse Rate (PPI) */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('ppi', vitals.ppi))}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="font-semibold truncate">PPI</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${getStatusBadge(getVitalStatus('ppi', vitals.ppi))}`}>
              {getVitalStatus('ppi', vitals.ppi).toUpperCase()}
            </span>
          </div>
          <p className="text-2xl font-bold">{typeof vitals.ppi === 'number' ? vitals.ppi.toFixed(2) : vitals.ppi}</p>
          <p className="text-xs mt-1 opacity-75">Pulse Pressure Index</p>
        </div>

        {/* Heart Rate */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              <span className="font-semibold truncate">HR</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${getStatusBadge(getVitalStatus('heartRate', vitals.heartRate))}`}>
              {getVitalStatus('heartRate', vitals.heartRate).toUpperCase()}
            </span>
          </div>
          <p className="text-2xl font-bold">{vitals.heartRate} <span className="text-sm font-normal">bpm</span></p>
          <p className="text-xs mt-1 opacity-75">Normal range: 60-100 bpm</p>
        </div>

        {/* Respiratory Rate */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              <span className="font-semibold truncate">RR</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${getStatusBadge(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
              {getVitalStatus('respiratoryRate', vitals.respiratoryRate).toUpperCase()}
            </span>
          </div>
          <p className="text-2xl font-bold">{vitals.respiratoryRate} <span className="text-sm font-normal">/min</span></p>
          <p className="text-xs mt-1 opacity-75">Normal range: 12-20 /min</p>
        </div>

        {/* Heart Rate Variability */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(getVitalStatus('hrv', vitals.hrv))}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-semibold truncate">HRV</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${getStatusBadge(getVitalStatus('hrv', vitals.hrv))}`}>
              {getVitalStatus('hrv', vitals.hrv).toUpperCase()}
            </span>
          </div>
          <p className="text-2xl font-bold">{vitals.hrv} <span className="text-sm font-normal">ms</span></p>
          <p className="text-xs mt-1 opacity-75">Heart rate variability indicator</p>
        </div>
      </div>
    </div>
  );
}
