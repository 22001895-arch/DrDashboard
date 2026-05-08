import { RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../utils/helpers';

export function Header() {
  const { lastRefresh, autoRefreshEnabled, toggleAutoRefresh, manualRefresh, loading } = useApp();

  return (
    <div className="bg-gradient-to-r from-clinical-600 to-clinical-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold">Currently Queuing Patients</h1>
            <p className="text-clinical-100 mt-1">
              Emergency Department - Green Zone
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex items-center gap-4">
            {/* Last Refresh Info */}
            {lastRefresh && (
              <div className="text-sm text-clinical-100">
                Last updated: {formatRelativeTime(lastRefresh)}
              </div>
            )}

            {/* Auto-refresh Toggle */}
            <button
              onClick={toggleAutoRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title={autoRefreshEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            >
              {autoRefreshEnabled ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                Auto-refresh {autoRefreshEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={manualRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-clinical-700 hover:bg-clinical-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
