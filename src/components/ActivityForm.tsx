import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Activity } from '../types/Activity';
import { TimerScreen } from './TimerScreen';

interface ActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
  editingActivity?: Activity | null;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onAdd, onCancel, isOpen, editingActivity }) => {
  const [showTimer, setShowTimer] = useState(false);
  const [timerActivity, setTimerActivity] = useState<string>('');
  const [timerDuration, setTimerDuration] = useState<number>(50);

  const [formData, setFormData] = useState({
    name: editingActivity?.name || '',
    category: editingActivity?.category || '',
    startTime: editingActivity?.startTime || '',
    endTime: editingActivity?.endTime || '',
    priority: 'medium' as const,
    completed: editingActivity?.completed || false,
    notes: editingActivity?.notes || '',
  });

  // Auto-fill current time and 50 minutes later
  React.useEffect(() => {
    if (!editingActivity && isOpen) {
      const now = new Date();
      const later = new Date(now.getTime() + 50 * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        startTime: now.toTimeString().slice(0, 5),
        endTime: later.toTimeString().slice(0, 5),
      }));
    }
  }, [isOpen, editingActivity]);

  React.useEffect(() => {
    if (editingActivity) {
      setFormData({
        name: editingActivity.name,
        category: editingActivity.category,
        startTime: editingActivity.startTime,
        endTime: editingActivity.endTime,
        priority: editingActivity.priority,
        completed: editingActivity.completed,
        notes: editingActivity.notes || '',
      });
    } else {
      const now = new Date();
      const later = new Date(now.getTime() + 50 * 60 * 1000);
      setFormData({
        name: '',
        category: '',
        startTime: now.toTimeString().slice(0, 5),
        endTime: later.toTimeString().slice(0, 5),
        priority: 'medium',
        completed: false,
        notes: '',
      });
    }
  }, [editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const duration = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));

    const activity: Omit<Activity, 'id'> = {
      ...formData,
      duration,
      date: new Date().toISOString().split('T')[0],
    };

    onAdd(activity);
    
    // Start timer if this is a new activity
    if (!editingActivity) {
      setTimerActivity(formData.name);
      setTimerDuration(duration);
      setShowTimer(true);
    }
    
    setFormData({
      name: '',
      category: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
      completed: false,
      notes: '',
    });
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    // The timer will show a completion prompt automatically
  };

  const handleTimerStop = () => {
    setShowTimer(false);
  };

  // Show timer screen if active
  if (showTimer) {
    return (
      <TimerScreen
        isActive={showTimer}
        duration={timerDuration}
        activityName={timerActivity}
        onComplete={handleTimerComplete}
        onStop={handleTimerStop}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingActivity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Team meeting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Work, Personal, Health"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{editingActivity ? 'Update Activity' : 'Save Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};