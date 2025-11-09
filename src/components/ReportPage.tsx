import React, { useMemo } from 'react';
import { X, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from '../types/Activity';

interface ReportPageProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

export const ReportPage: React.FC<ReportPageProps> = ({ isOpen, onClose, activities }) => {
  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dailyData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const durations = [0, 0, 0, 0, 0, 0, 0];

    activities.forEach(activity => {
      const date = new Date(activity.date);
      const dayOfWeek = date.getDay();
      counts[dayOfWeek]++;
      durations[dayOfWeek] += activity.duration;
    });

    return dayOfWeekNames.map((day, index) => ({
      day,
      activities: counts[index],
      hours: Math.round((durations[index] / 60) * 10) / 10,
      duration: durations[index],
    }));
  }, [activities]);

  const monthlyData = useMemo(() => {
    const monthCounts: Record<number, { count: number; duration: number }> = {};

    activities.forEach(activity => {
      const date = new Date(activity.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = year * 100 + month;

      if (!monthCounts[key]) {
        monthCounts[key] = { count: 0, duration: 0 };
      }
      monthCounts[key].count++;
      monthCounts[key].duration += activity.duration;
    });

    return Object.entries(monthCounts)
      .map(([key, data]) => {
        const keyNum = parseInt(key);
        const year = Math.floor(keyNum / 100);
        const month = keyNum % 100;
        const date = new Date(year, month);
        const monthName = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });

        return {
          month: monthName,
          activities: data.count,
          hours: Math.round((data.duration / 60) * 10) / 10,
          duration: data.duration,
          sortKey: key,
        };
      })
      .sort((a, b) => parseInt(a.sortKey) - parseInt(b.sortKey));
  }, [activities]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const getActivityColor = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  const totalActivities = activities.length;
  const totalHours = Math.round((activities.reduce((sum, a) => sum + a.duration, 0) / 60) * 10) / 10;
  const avgDailyActivities = Math.round((dailyData.reduce((sum, d) => sum + d.activities, 0) / 7) * 10) / 10;
  const busyDay = dailyData.reduce((max, d) => (d.activities > max.activities ? d : max));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Activity Reports</h2>
                <p className="text-sm text-gray-500">Comprehensive activity breakdown by day and month</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No activities to report</p>
              <p className="text-gray-400 text-sm mt-2">Add activities to see reports and statistics</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-3xl font-bold text-blue-600">{totalActivities}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Activities</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-3xl font-bold text-green-600">{totalHours}h</p>
                    <p className="text-sm text-gray-600 mt-1">Total Hours</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-3xl font-bold text-orange-600">{avgDailyActivities}</p>
                    <p className="text-sm text-gray-600 mt-1">Avg per Day</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-3xl font-bold text-purple-600">{busyDay.day}</p>
                    <p className="text-sm text-gray-600 mt-1">Busiest Day</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities by Day of Week</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" label={{ value: 'Activities', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Hours', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="activities" fill="#3b82f6" name="Count" radius={[8, 8, 0, 0]} />
                        <Bar yAxisId="right" dataKey="hours" fill="#10b981" name="Hours" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Day</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Activities</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Hours</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyData.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.day}</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                {item.activities}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{item.hours}h</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {item.activities > 0
                                ? `${Math.round((item.duration / item.activities / 60) * 10) / 10}h`
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities by Month</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" label={{ value: 'Activities', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Hours', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="activities"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 5 }}
                          name="Count"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="hours"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 5 }}
                          name="Hours"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Activities</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Hours</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg per Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((item, index) => {
                          const daysInMonth = new Date(
                            parseInt(item.month.split(' ')[1]),
                            parseInt(item.month.split(' ')[0]) === 1 ? 1 : 0
                          ).getDate();
                          return (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.month}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold text-white`}
                                  style={{ backgroundColor: getActivityColor(index) }}>
                                  {item.activities}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{item.hours}h</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                {Math.round((item.activities / daysInMonth) * 10) / 10}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">•</span>
                    <span>
                      Your busiest day is <span className="font-semibold">{busyDay.day}</span> with{' '}
                      <span className="font-semibold">{busyDay.activities}</span> activities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">•</span>
                    <span>
                      You average <span className="font-semibold">{avgDailyActivities}</span> activities per day
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-3">•</span>
                    <span>
                      Total time tracked is <span className="font-semibold">{totalHours} hours</span> across{' '}
                      <span className="font-semibold">{totalActivities}</span> activities
                    </span>
                  </li>
                  {monthlyData.length > 0 && (
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-3">•</span>
                      <span>
                        Your most active month was{' '}
                        <span className="font-semibold">
                          {monthlyData.reduce((max, m) => (m.activities > max.activities ? m : max)).month}
                        </span>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
