import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function AlertBanner({ message, type = 'error', onRetry, onDismiss }: AlertBannerProps) {
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    error: <WifiOff className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-6 border-l-4 rounded-r-lg ${colors[type]}`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="font-medium">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium bg-white rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1 text-sm font-medium bg-white rounded-md hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
