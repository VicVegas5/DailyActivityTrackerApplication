import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity } from '../types/Activity';
import { Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface VisualReportsProps {
  activities: Activity[];
}

export const VisualReports: React.FC<VisualReportsProps> = ({ activities }) => {
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'quarter' | 'year'>('week');

  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899',
  };

  const chartColors = [colors.primary, colors.secondary, colors.accent, colors.purple, colors.pink, colors.danger];

  // Helper functions for date calculations
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getQuarter = (date: Date) => {
    return Math.ceil((date.getMonth() + 1) / 3);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Data processing for different time periods
  const processedData = useMemo(() => {
    const now = new Date();
    const currentYear = Math.max(now.getFullYear(), 2025); // Start from 2025 at minimum
    const startDate = new Date(2025, 3, 1); // April 1, 2025 (Q2 start)
    
    const weeklyData = [];
    const monthlyData = [];
    const quarterlyData = [];
    const yearlyData = [];

    // Generate data for the last 12 weeks (but not before Q2 2025)
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      
      // Skip weeks before Q2 2025
      if (weekStart < startDate) continue;
      
      const weekNumber = getWeekNumber(weekStart);
      const year = weekStart.getFullYear();
      
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        const activityWeek = getWeekNumber(activityDate);
        return activityWeek === weekNumber && activityDate.getFullYear() === year;
      });

      weeklyData.push({
        period: `Week ${weekNumber}`,
        totalActivities: weekActivities.length,
        completedActivities: weekActivities.filter(a => a.completed).length,
        totalDuration: weekActivities.reduce((sum, a) => sum + a.duration, 0),
        completionRate: weekActivities.length > 0 ? Math.round((weekActivities.filter(a => a.completed).length / weekActivities.length) * 100) : 0,
      });
    }

    // Generate data for the last 12 months (but not before Q2 2025)
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentYear, now.getMonth() - i, 1);
      
      // Skip months before Q2 2025
      if (monthDate < startDate) continue;
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      const monthActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getMonth() === monthDate.getMonth() && 
               activityDate.getFullYear() === monthDate.getFullYear();
      });

      monthlyData.push({
        period: monthName,
        totalActivities: monthActivities.length,
        completedActivities: monthActivities.filter(a => a.completed).length,
        totalDuration: monthActivities.reduce((sum, a) => sum + a.duration, 0),
        completionRate: monthActivities.length > 0 ? Math.round((monthActivities.filter(a => a.completed).length / monthActivities.length) * 100) : 0,
      });
    }

    // Generate data starting from Q2 2025
    const currentQuarter = getQuarter(now);
    const quartersToShow = [];
    
    // Start from Q2 2025
    let startYear = 2025;
    let startQuarter = 2; // Q2
    
    // Generate quarters from Q2 2025 to current quarter
    let tempYear = startYear;
    let tempQuarter = startQuarter;
    
    while (tempYear < currentYear || (tempYear === currentYear && tempQuarter <= currentQuarter)) {
      quartersToShow.push({ year: tempYear, quarter: tempQuarter });
      tempQuarter++;
      if (tempQuarter > 4) {
        tempQuarter = 1;
        tempYear++;
      }
    }
    
    // Take the last 8 quarters maximum for display
    const displayQuarters = quartersToShow.slice(-8);
    
    for (const { year, quarter } of displayQuarters) {
      const quarterDate = new Date(currentYear, now.getMonth() - (i * 3), 1);
      
      const quarterActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return getQuarter(activityDate) === quarter && activityDate.getFullYear() === year;
      });

      quarterlyData.push({
        period: `Q${quarter} ${year}`,
        totalActivities: quarterActivities.length,
        completedActivities: quarterActivities.filter(a => a.completed).length,
        totalDuration: quarterActivities.reduce((sum, a) => sum + a.duration, 0),
        completionRate: quarterActivities.length > 0 ? Math.round((quarterActivities.filter(a => a.completed).length / quarterActivities.length) * 100) : 0,
      });
    }

    // Generate data from 2025 to current year
    const yearsToShow = [];
    for (let year = 2025; year <= currentYear; year++) {
      yearsToShow.push(year);
    }
    
    for (const year of yearsToShow) {
      
      const yearActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getFullYear() === year;
      });

      yearlyData.push({
        period: year.toString(),
        totalActivities: yearActivities.length,
        completedActivities: yearActivities.filter(a => a.completed).length,
        totalDuration: yearActivities.reduce((sum, a) => sum + a.duration, 0),
        completionRate: yearActivities.length > 0 ? Math.round((yearActivities.filter(a => a.completed).length / yearActivities.length) * 100) : 0,
      });
    }

    return {
      week: weeklyData,
      month: monthlyData,
      quarter: quarterlyData,
      year: yearlyData,
    };
  }, [activities]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const categoryStats = activities.reduce((acc, activity) => {
      const category = activity.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, duration: 0 };
      }
      acc[category].count++;
      acc[category].duration += activity.duration;
      return acc;
    }, {} as Record<string, { count: number; duration: number }>);

    return Object.entries(categoryStats).map(([category, stats]) => ({
      name: category,
      value: stats.count,
      duration: stats.duration,
    }));
  }, [activities]);

  const tabs = [
    { key: 'week' as const, label: 'Weekly', icon: Calendar },
    { key: 'month' as const, label: 'Monthly', icon: TrendingUp },
    { key: 'quarter' as const, label: 'Quarterly', icon: BarChart3 },
    { key: 'year' as const, label: 'Yearly', icon: PieChartIcon },
  ];

  const currentData = processedData[activeTab];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'totalDuration' ? formatDuration(entry.value) : entry.value}
              {entry.name === 'completionRate' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Visual Reports</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Count Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="period" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalActivities" 
                fill={colors.primary}
                name="Total Activities"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="completedActivities" 
                fill={colors.secondary}
                name="Completed Activities"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rate Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Completion Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="period" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke={colors.accent}
                strokeWidth={3}
                dot={{ fill: colors.accent, strokeWidth: 2, r: 6 }}
                name="Completion Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time Spent Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Spent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="period" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalDuration" 
                fill={colors.purple}
                name="Total Duration"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  `${value} activities (${formatDuration(props.payload.duration)})`,
                  'Count'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentData.length > 0 && (
          <>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.reduce((sum, item) => sum + item.totalActivities, 0)}
              </div>
              <div className="text-sm text-blue-800">Total Activities</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData.reduce((sum, item) => sum + item.completedActivities, 0)}
              </div>
              <div className="text-sm text-green-800">Completed</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(currentData.reduce((sum, item) => sum + item.totalDuration, 0))}
              </div>
              <div className="text-sm text-purple-800">Total Time</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(currentData.reduce((sum, item) => sum + item.completionRate, 0) / currentData.length)}%
              </div>
              <div className="text-sm text-orange-800">Avg Completion</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};