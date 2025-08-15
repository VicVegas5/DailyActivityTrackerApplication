import React from 'react';
import { Activity } from '../types/Activity';
import { Clock, CheckCircle, BarChart3, Calendar } from 'lucide-react';

interface StatsCardProps {
  activities: Activity[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ activities }) => {
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.completed).length;
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const avgDuration = totalActivities > 0 ? totalDuration / totalActivities : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const stats = [
    {
      title: 'Total Activities',
      value: totalActivities,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: completedActivities,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Time',
      value: formatDuration(totalDuration),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};