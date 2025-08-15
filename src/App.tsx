import React, { useState } from 'react';
import { Plus, Calendar, Download } from 'lucide-react';
import { ActivityForm } from './components/ActivityForm';
import { ActivityTable } from './components/ActivityTable';
import { StatsCard } from './components/StatsCard';
import { VisualReports } from './components/VisualReports';
import { TimerScreen } from './components/TimerScreen';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Activity } from './types/Activity';

function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('daily-activities', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activeTimer, setActiveTimer] = useState<{
    activity: Activity;
    isActive: boolean;
  } | null>(null);

  const handleAddActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);
    setIsFormOpen(false);
    
    // Start timer for new activities
    if (!editingActivity) {
      setActiveTimer({
        activity: newActivity,
        isActive: true,
      });
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleUpdateActivity = (activityData: Omit<Activity, 'id'>) => {
    if (editingActivity) {
      const updatedActivities = activities.map(activity =>
        activity.id === editingActivity.id
          ? { ...activityData, id: editingActivity.id }
          : activity
      );
      setActivities(updatedActivities);
      setEditingActivity(null);
      setIsFormOpen(false);
    }
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter(activity => activity.id !== id));
    }
  };

  const handleToggleComplete = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  const handleExportCSV = () => {
    const headers = ['Activity Name', 'Category', 'Start Time', 'End Time', 'Duration (minutes)', 'Priority', 'Completed', 'Notes', 'Date'];
    const csvContent = [
      headers.join(','),
      ...activities.map(activity => [
        `"${activity.name}"`,
        `"${activity.category || ''}"`,
        activity.startTime,
        activity.endTime,
        activity.duration,
        activity.priority,
        activity.completed,
        `"${activity.notes || ''}"`,
        activity.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `daily-activities-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const todayActivities = activities.filter(activity => 
    activity.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daily Activity Tracker</h1>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleExportCSV}
                disabled={activities.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Activity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCard activities={todayActivities} />

        {/* Visual Reports */}
        <VisualReports activities={activities} />

        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Activities ({todayActivities.length})
            </h2>
            {todayActivities.length > 0 && (
              <div className="text-sm text-gray-500">
                Total time: {Math.round(todayActivities.reduce((sum, activity) => sum + activity.duration, 0) / 60 * 10) / 10} hours
              </div>
            )}
          </div>
          
          <ActivityTable
            activities={todayActivities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        </div>

        {/* Activity Form Modal */}
        <ActivityForm
          isOpen={isFormOpen}
          onAdd={editingActivity ? handleUpdateActivity : handleAddActivity}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
          editingActivity={editingActivity}
        />
      </div>
    </div>
  );
}

export default App;