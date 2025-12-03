'use client';

import { useEffect, useCallback } from 'react';
import { useGameContext } from '@/lib/game/GameContext';

interface UseGhostEventOptions {
  minInterval?: number; // Minimum time between ghost events (ms)
  maxInterval?: number; // Maximum time between ghost events (ms)
  warningTime?: number; // Time to show warning before ghost appears (ms)
  enabled?: boolean; // Whether ghost events are enabled
}

/**
 * Hook to manage ghost event triggering
 * Triggers ghost appearance at random intervals with visual warning
 * Requirements: 9.4
 */
export function useGhostEvent({
  minInterval = 60000, // 1 minute
  maxInterval = 180000, // 3 minutes
  warningTime = 3000, // 3 seconds
  enabled = true,
}: UseGhostEventOptions = {}) {
  const { state, dispatch } = useGameContext();

  const triggerGhostEvent = useCallback(() => {
    // Don't trigger if game is complete or ghost is already active
    if (state.gameComplete || state.ghostEventActive) {
      return;
    }

    // Show warning first
    dispatch({
      type: 'ADD_OUTPUT',
      line: {
        id: `warning-${Date.now()}`,
        text: '⚠️ Something approaches... ⚠️',
        type: 'system',
        timestamp: Date.now(),
      },
    });

    // Trigger ghost event after warning time
    setTimeout(() => {
      dispatch({ type: 'TRIGGER_GHOST_EVENT' });
    }, warningTime);
  }, [state.gameComplete, state.ghostEventActive, dispatch, warningTime]);

  const scheduleNextGhostEvent = useCallback(() => {
    if (!enabled || state.gameComplete) {
      return;
    }

    // Calculate random interval between min and max
    const interval = Math.random() * (maxInterval - minInterval) + minInterval;
    
    const timeoutId = setTimeout(() => {
      triggerGhostEvent();
    }, interval);

    return timeoutId;
  }, [enabled, state.gameComplete, minInterval, maxInterval, triggerGhostEvent]);

  useEffect(() => {
    // Don't schedule if game hasn't started or is complete
    if (!state.startTime || state.gameComplete || !enabled) {
      return;
    }

    // Schedule the next ghost event
    const timeoutId = scheduleNextGhostEvent();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.startTime, state.gameComplete, enabled, scheduleNextGhostEvent]);

  // Reschedule after ghost event is resolved
  useEffect(() => {
    if (!state.ghostEventActive && state.ghostEventCount > 0 && enabled && !state.gameComplete) {
      const timeoutId = scheduleNextGhostEvent();
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [state.ghostEventActive, state.ghostEventCount, enabled, state.gameComplete, scheduleNextGhostEvent]);

  return {
    isGhostActive: state.ghostEventActive,
    ghostEventCount: state.ghostEventCount,
  };
}
