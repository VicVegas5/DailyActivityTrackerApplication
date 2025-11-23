import React, { useState, useEffect } from 'react';
import { X, Check, Play } from 'lucide-react';

import { Activity } from '../types/Activity';
import { CategoryName } from '../config/categories';

interface StopwatchScreenProps {
  category: CategoryName;
  activityName: string;
  targetDuration: number;
  onSave: (activity: Omit<Activity, 'id'>) => void;
  onCancel: () => void;
}

export const StopwatchScreen: React.FC<StopwatchScreenProps> = ({
  category,
  activityName,
  targetDuration,
  onSave,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const STORAGE_KEY = 'stopwatch_session';

  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Resume if it matches the current activity context
        if (session.category === category && session.activityName === activityName) {
          setStartTimestamp(session.startTime);
          setIsRunning(true);

          // Calculate elapsed time immediately
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - session.startTime) / 1000);
          setSeconds(elapsedSeconds);
        }
      } catch (e) {
        console.error('Failed to parse stopwatch session', e);
      }
    }
  }, [category, activityName]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && startTimestamp) {
      // Save session
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        startTime: startTimestamp,
        category,
        activityName,
        targetDuration
      }));

      const updateTimer = () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
        setSeconds(elapsedSeconds);

        const minutes = Math.floor(elapsedSeconds / 60);
        if (minutes >= targetDuration && !hasReachedTarget) {
          setHasReachedTarget(true);
        }
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTimestamp, category, activityName, targetDuration, hasReachedTarget]);



  useEffect(() => {
    if (hasReachedTarget) {
      setIsMinimized(false);
    }
  }, [hasReachedTarget]);

  const [isMinimized, setIsMinimized] = useState(false);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const getCategoryColor = (cat: CategoryName) => {
    const colors: Record<CategoryName, string> = {
      Body: 'from-red-500 to-red-600',
      Home: 'from-orange-500 to-orange-600',
      Finances: 'from-green-500 to-green-600',
      Job: 'from-blue-500 to-blue-600',
      Projects: 'from-purple-600 to-purple-700',
      Fun: 'from-pink-500 to-pink-600',
    };
    return colors[cat] || 'from-gray-500 to-gray-600';
  };

  const handleStart = () => {
    const now = Date.now();
    setStartTimestamp(now);
    setIsRunning(true);
    setIsMinimized(true);
  };

  const handleSave = () => {
    if (!isRunning || !startTimestamp) {
      alert('Please start stopwatch first.');
      return;
    }

    const endTimestamp = Date.now();
    const durationSeconds = (endTimestamp - startTimestamp) / 1000;
    const durationMinutes = durationSeconds / 60;

    // Round to 2 decimal places
    const roundedDuration = Math.round(durationMinutes * 100) / 100;

    localStorage.removeItem(STORAGE_KEY);

    const activity: Omit<Activity, 'id'> = {
      category,
      activity: activityName,
      startTime: new Date(startTimestamp).toISOString(),
      endTime: new Date(endTimestamp).toISOString(),
      duration: roundedDuration,
      notes: '',
      date: new Date().toISOString().split('T')[0],
    };

    onSave(activity);
  };

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY);
    onCancel();
  };

  if (isMinimized) {
    return (
      <div
        className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 w-72 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
        onClick={() => setIsMinimized(false)}
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${getCategoryColor(category)} rounded-full mb-3`} />

        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</div>
            <div className="font-bold text-gray-900 truncate max-w-[140px]">{activityName}</div>
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">
            {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
        </div>

        <div className="text-xs text-gray-400 flex justify-between items-center">
          <span>Target: {targetDuration}m</span>
          <span className="text-blue-600 hover:underline">Click to expand</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={() => setIsMinimized(true)}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
          title="Minimize"
          disabled={!isRunning}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 ml-8">Activity Timer</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <div className={`w-full bg-gradient-to-r ${getCategoryColor(category)} rounded-lg p-6 text-center shadow-lg`}>
            <div className="text-white">
              <div className="text-sm font-semibold opacity-90 mb-2">{category}</div>
              <div className="text-2xl font-bold">{activityName}</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900">
                    {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                  </div>
                </div>
              </div>
              {hasReachedTarget && (
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
              )}
            </div>

            {hasReachedTarget && (
              <div className="text-center">
                <div className="text-yellow-600 font-semibold text-lg animate-pulse">
                  Target duration reached!
                </div>
              </div>
            )}
          </div>

          <div className="w-full space-y-3">


            <div className="flex justify-end space-x-3 pt-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play size={18} />
                  <span>Start Stopwatch</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-4 py-2 text-white rounded-md flex items-center space-x-2 transition-all ${hasReachedTarget
                      ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                      : 'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    <Check size={18} />
                    <span>Save Activity</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
