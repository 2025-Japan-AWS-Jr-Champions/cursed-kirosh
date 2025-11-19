'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  startTime: number | null;
  endTime: number | null;
  updateInterval?: number; // milliseconds
}

/**
 * Custom hook for game timer
 * Tracks elapsed time from start to completion
 */
export function useTimer({ startTime, endTime, updateInterval = 100 }: UseTimerOptions) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsedTime(0);
      return;
    }

    // If game is complete, show final time
    if (endTime) {
      setElapsedTime(endTime - startTime);
      return;
    }

    // Update elapsed time periodically while game is running
    const intervalId = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [startTime, endTime, updateInterval]);

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }, []);

  const formatTimeShort = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    formattedTimeShort: formatTimeShort(elapsedTime),
    isRunning: !!startTime && !endTime,
    isComplete: !!endTime,
  };
}
