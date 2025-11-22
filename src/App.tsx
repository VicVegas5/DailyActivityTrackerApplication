import React, { useState, useEffect } from 'react';
import { Plus, List, Download, BarChart3, FileBarChart } from 'lucide-react';
import { ActivityForm } from './components/ActivityForm';
import { ActivityTable } from './components/ActivityTable';
import { StatsCard } from './components/StatsCard';
import { GraphicalView } from './components/GraphicalView';
import { ReportPage } from './components/ReportPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Activity } from './types/Activity';
import { exportToCSV } from './utils/fileExport';

function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('daily-activities', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGraphViewOpen, setIsGraphViewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('stopwatch_session');
    if (savedSession) {
      setIsFormOpen(true);
    }
  }, []);

  const handleAddActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);
    setIsFormOpen(false);
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

  const todayActivities = activities.filter(activity =>
    activity.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <List className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
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
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => setIsReportOpen(true)}
                disabled={activities.length === 0}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="View detailed reports"
              >
                <FileBarChart size={20} />
                <span className="font-medium">Reports</span>
              </button>
              <button
                onClick={() => setIsGraphViewOpen(true)}
                disabled={activities.length === 0}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="View analytics and graphs"
              >
                <BarChart3 size={20} />
                <span className="font-medium">Analytics</span>
              </button>
              <button
                onClick={() => exportToCSV(activities, 'activity-log.csv')}
                disabled={activities.length === 0}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download CSV file"
              >
                <Download size={20} />
                <span className="font-medium">Export CSV</span>
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span className="font-medium">Add Activity</span>
              </button>
            </div>
          </div>
        </div>

        <StatsCard activities={todayActivities} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Activities
            </h2>
            {todayActivities.length > 0 && (
              <div className="text-sm text-gray-500">
                {todayActivities.length} {todayActivities.length === 1 ? 'activity' : 'activities'}
              </div>
            )}
          </div>

          <ActivityTable
            activities={todayActivities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        </div>

        <ActivityForm
          isOpen={isFormOpen}
          onAdd={editingActivity ? handleUpdateActivity : handleAddActivity}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
          editingActivity={editingActivity}
        />

        <GraphicalView
          isOpen={isGraphViewOpen}
          onClose={() => setIsGraphViewOpen(false)}
          activities={activities}
        />

        <ReportPage
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          activities={activities}
        />
      </div>
    </div>
  );
}

export default App;
