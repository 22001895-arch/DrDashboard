import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-clinical-600 animate-spin mb-4" />
      <p className="text-lg text-gray-600 font-medium">Loading patient queue...</p>
      <p className="text-sm text-gray-400 mt-2">Please wait while we fetch the latest data</p>
    </div>
  );
}
