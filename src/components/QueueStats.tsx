import { Users, Clock, Activity, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function QueueStats() {
  const { submissions } = useApp();

  const stats = {
    total: submissions.length,
    waiting: submissions.filter(s => s.status === 'Waiting').length,
    inProgress: submissions.filter(s => s.status === 'In Progress').length,
    redFlags: submissions.filter(s => s.isRedFlag).length
  };

  const statCards = [
    {
      label: 'Total Patients',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      label: 'Waiting',
      value: stats.waiting,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Activity,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      label: 'Red Flags',
      value: stats.redFlags,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700 border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.color} border-2 rounded-lg p-4 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className="w-10 h-10 opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
