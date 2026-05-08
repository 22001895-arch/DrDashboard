import { Users } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Users className="w-20 h-20 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients in Queue</h3>
      <p className="text-gray-500 text-center max-w-md">
        There are currently no patients waiting. New submissions will appear here automatically.
      </p>
    </div>
  );
}
