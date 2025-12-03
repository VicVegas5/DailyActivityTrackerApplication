import React, { useState, useMemo } from 'react';
import { X, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from '../types/Activity';
import { getLocalDateString } from '../utils/dateUtils';

interface GraphicalViewProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

type TimeFilter = 'day' | 'week' | 'quarter' | 'year';

export const GraphicalView: React.FC<GraphicalViewProps> = ({ isOpen, onClose, activities }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());

  const getDateRange = (filter: TimeFilter, date: string): { start: Date; end: Date } => {
    const selectedDate = new Date(date);
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    switch (filter) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week': {
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'quarter': {
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(quarter * 3 + 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  };

  const filteredActivities = useMemo(() => {
    const { start, end } = getDateRange(timeFilter, selectedDate);
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= start && activityDate <= end;
    });
  }, [activities, timeFilter, selectedDate]);

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    filteredActivities.forEach(activity => {
      categoryTotals[activity.category] = (categoryTotals[activity.category] || 0) + activity.duration;
    });

    return Object.entries(categoryTotals).map(([category, duration]) => ({
      category,
      duration: Math.round(duration),
      hours: Math.round((duration / 60) * 10) / 10,
    }));
  }, [filteredActivities]);

  const activityBreakdown = useMemo(() => {
    const activityTotals: Record<string, { count: number; duration: number; category: string }> = {};
    filteredActivities.forEach(activity => {
      if (!activityTotals[activity.activity]) {
        activityTotals[activity.activity] = { count: 0, duration: 0, category: activity.category };
      }
      activityTotals[activity.activity].count += 1;
      activityTotals[activity.activity].duration += activity.duration;
    });

    return Object.entries(activityTotals)
      .map(([activity, data]) => ({
        activity,
        count: data.count,
        duration: Math.round(data.duration),
        hours: Math.round((data.duration / 60) * 10) / 10,
        category: data.category,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }, [filteredActivities]);



  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Body': '#10b981',
      'Home': '#3b82f6',
      'Finances': '#f59e0b',
      'Job': '#f97316',
      'Projects': '#ef4444',
      'Music': '#ec4899',
    };
    return colors[category] || '#6b7280';
  };

  const totalHours = useMemo(() => {
    return Math.round((filteredActivities.reduce((sum, a) => sum + a.duration, 0) / 60) * 10) / 10;
  }, [filteredActivities]);

  const formatDateRange = () => {
    const { start, end } = getDateRange(timeFilter, selectedDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    if (timeFilter === 'day') {
      return start.toLocaleDateString('en-US', options);
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Activity Analytics</h2>
                <p className="text-sm text-gray-500">{formatDateRange()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              {(['day', 'week', 'quarter', 'year'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${timeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="ml-auto text-sm text-gray-600">
              <span className="font-semibold">{filteredActivities.length}</span> activities
              <span className="mx-2">•</span>
              <span className="font-semibold">{totalHours}h</span> total
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No activities found for this time period</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different date or time range</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        formatter={(value: number) => [`${value} hours`, 'Duration']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="duration"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${Math.round(value / 60 * 10) / 10} hours`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Activities</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Activity</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Count</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Hours</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{item.activity}</td>
                          <td className="py-3 px-4">
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                              style={{
                                backgroundColor: `${getCategoryColor(item.category)}20`,
                                color: getCategoryColor(item.category),
                              }}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.count}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.hours}h</td>
                          <td className="py-3 px-4 text-sm text-gray-900 text-right">
                            {Math.round((item.duration / item.count / 60) * 10) / 10}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{filteredActivities.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Activities</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{totalHours}h</p>
                    <p className="text-sm text-gray-600 mt-1">Total Time</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round((totalHours / Math.max(1, filteredActivities.length)) * 10) / 10}h
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Avg per Activity</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{categoryData.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Categories Used</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
