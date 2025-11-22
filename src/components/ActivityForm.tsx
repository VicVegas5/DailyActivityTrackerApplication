import React, { useState } from 'react';
import { Save, X, Play } from 'lucide-react';
import { Activity } from '../types/Activity';
import { CATEGORIES, CategoryName } from '../config/categories';
import { StopwatchScreen } from './StopwatchScreen';

interface ActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
  editingActivity?: Activity | null;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onAdd, onCancel, isOpen, editingActivity }) => {
  const [formData, setFormData] = useState<{
    category: CategoryName | '';
    activity: string;
    startTime: string;
    endTime: string;
    notes: string;
    targetDuration: number;
  }>({
    category: editingActivity?.category || '',
    activity: editingActivity?.activity || '',
    startTime: editingActivity?.startTime || '',
    endTime: editingActivity?.endTime || '',
    notes: editingActivity?.notes || '',
    targetDuration: 2,
  });

  const [showStopwatch, setShowStopwatch] = useState(false);

  React.useEffect(() => {
    if (editingActivity) {
      setFormData({
        category: editingActivity.category,
        activity: editingActivity.activity,
        startTime: editingActivity.startTime.includes('T') ? new Date(editingActivity.startTime).toTimeString().slice(0, 5) : editingActivity.startTime,
        endTime: editingActivity.endTime.includes('T') ? new Date(editingActivity.endTime).toTimeString().slice(0, 5) : editingActivity.endTime,
        notes: editingActivity.notes || '',
        targetDuration: 20,
      });
    } else {
      const savedSession = localStorage.getItem('stopwatch_session');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          setFormData({
            category: session.category,
            activity: session.activityName,
            startTime: new Date(session.startTime).toTimeString().slice(0, 5),
            endTime: '',
            notes: session.notes || '',
            targetDuration: session.targetDuration,
          });
          setShowStopwatch(true);
          return;
        } catch (e) {
          console.error('Failed to restore session', e);
        }
      }

      const now = new Date();
      const later = new Date(now.getTime() + 2 * 60 * 1000);
      setFormData({
        category: '',
        activity: '',
        startTime: now.toTimeString().slice(0, 5),
        endTime: later.toTimeString().slice(0, 5),
        notes: '',
        targetDuration: 2,
      });
    }
  }, [editingActivity]);

  const handleStartStopwatch = () => {
    if (!formData.category || !formData.activity || !formData.targetDuration) {
      alert('Please select a category, activity, and set a target duration');
      return;
    }
    setShowStopwatch(true);
  };

  const handleStopwatchSave = (activity: Omit<Activity, 'id'>) => {
    onAdd(activity);
    setShowStopwatch(false);

    const now = new Date();
    const later = new Date(now.getTime() + 50 * 60 * 1000);
    setFormData({
      category: '',
      activity: '',
      startTime: now.toTimeString().slice(0, 5),
      endTime: later.toTimeString().slice(0, 5),
      notes: '',
      targetDuration: 2,
    });
  };

  const handleStopwatchCancel = () => {
    setShowStopwatch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.activity.trim() || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const activityDate = editingActivity ? editingActivity.date : new Date().toISOString().split('T')[0];
    const startIso = new Date(`${activityDate}T${formData.startTime}:00`).toISOString();
    const endIso = new Date(`${activityDate}T${formData.endTime}:00`).toISOString();

    const startObj = new Date(startIso);
    const endObj = new Date(endIso);

    let duration = Math.max(0, (endObj.getTime() - startObj.getTime()) / (1000 * 60));
    duration = parseFloat(duration.toFixed(2));

    const activity: Omit<Activity, 'id'> = {
      category: formData.category as CategoryName,
      activity: formData.activity.trim(),
      startTime: startIso,
      endTime: endIso,
      duration,
      notes: formData.notes,
      date: activityDate,
    };

    onAdd(activity);

    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 1000);
    setFormData({
      category: '',
      activity: '',
      startTime: now.toTimeString().slice(0, 5),
      endTime: later.toTimeString().slice(0, 5),
      notes: '',
      targetDuration: 2,
    });
  };

  if (!isOpen) return null;

  if (showStopwatch && formData.category && formData.activity) {
    return (
      <>
        <StopwatchScreen
          category={formData.category as CategoryName}
          activityName={formData.activity as string}
          targetDuration={formData.targetDuration}
          onSave={handleStopwatchSave}
          onCancel={handleStopwatchCancel}
        />
      </>
    );
  }

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
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryName, activity: '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity *
            </label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter activity name"
              disabled={!formData.category}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Duration (minutes) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.targetDuration}
              onChange={(e) => {
                const duration = parseInt(e.target.value) || 2;
                const activityDate = editingActivity ? editingActivity.date : new Date().toISOString().split('T')[0];
                const startIso = new Date(`${activityDate}T${formData.startTime}:00`).toISOString();
                const startObj = new Date(startIso);
                const endObj = new Date(startObj.getTime() + duration * 60 * 1000);
                const endTime = endObj.toTimeString().slice(0, 5);

                setFormData({
                  ...formData,
                  targetDuration: duration,
                  endTime: endTime
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {!editingActivity && (
              <button
                type="button"
                onClick={handleStartStopwatch}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Play size={18} />
                <span>Start</span>
              </button>
            )}
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
