import React, { useState } from 'react';
import { Edit2, Trash2, Clock, ArrowUpDown } from 'lucide-react';
import { Activity } from '../types/Activity';

interface ActivityTableProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  onEdit,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<keyof Activity>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Activity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Body': 'bg-green-100 text-green-800 border-green-200',
      'Home': 'bg-blue-100 text-blue-800 border-blue-200',
      'Finances': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Job': 'bg-orange-100 text-orange-800 border-orange-200',
      'Projects': 'bg-red-100 text-red-800 border-red-200',
      'Music': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center space-x-1">
                <span>Category</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort('activity')}
            >
              <div className="flex items-center space-x-1">
                <span>Activity</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort('startTime')}
            >
              <div className="flex items-center space-x-1">
                <span>Start</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort('endTime')}
            >
              <div className="flex items-center space-x-1">
                <span>End</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort('duration')}
            >
              <div className="flex items-center space-x-1">
                <span>Duration</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedActivities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(activity.category)}`}>
                  {activity.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{activity.activity}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatTime(activity.startTime)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatTime(activity.endTime)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                {activity.notes || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(activity)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activities.length === 0 && (
        <div className="text-center py-12 bg-gray-50">
          <div className="text-gray-500 text-lg">No activities recorded yet</div>
          <div className="text-sm text-gray-400 mt-1">Click "Add Activity" to get started</div>
        </div>
      )}
    </div>
  );
};
