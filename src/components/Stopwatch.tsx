import React, { useState, useEffect } from 'react';

interface StopwatchProps {
  isRunning: boolean;
  targetDuration?: number;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ isRunning, targetDuration = 20 }) => {
  const [seconds, setSeconds] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          const minutes = Math.floor(newSeconds / 60);

          if (minutes >= targetDuration && !hasReachedTarget) {
            setHasReachedTarget(true);
          }

          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, targetDuration, hasReachedTarget]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">
              {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
            </div>
          </div>
        </div>
        {hasReachedTarget && (
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
        )}
      </div>

      {hasReachedTarget && (
        <div className="text-center text-yellow-600 font-semibold animate-pulse">
          Target duration reached!
        </div>
      )}
    </div>
  );
};
