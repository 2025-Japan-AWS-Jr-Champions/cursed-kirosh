/**
 * Custom hook for managing hint display
 */

import { useEffect, useCallback } from 'react';
import { useGameContext } from '@/lib/game/GameContext';
import { 
  getNextHint, 
  shouldShowHintForInactivity,
  INACTIVITY_TIMEOUT 
} from '@/lib/game/hintSystem';
import { createOutputLine } from '@/lib/game/gameState';

/**
 * Hook to automatically show hints based on game state and inactivity
 */
export function useHints() {
  const { state, dispatch } = useGameContext();

  // Check for hints periodically
  const checkForHints = useCallback(() => {
    // Only check if hints are enabled and game is not complete
    if (!state.hintsEnabled || state.gameComplete) {
      return;
    }

    // Check if player has been inactive
    if (shouldShowHintForInactivity(state)) {
      const hint = getNextHint(state);
      
      if (hint) {
        // Add hint to output
        dispatch({
          type: 'ADD_OUTPUT',
          line: createOutputLine(hint.message, 'system'),
        });
        
        // Mark hint as shown
        dispatch({
          type: 'SHOW_HINT',
          hintId: hint.id,
        });
      }
    }
  }, [state, dispatch]);

  // Set up interval to check for hints
  useEffect(() => {
    // Check every 5 seconds
    const interval = setInterval(checkForHints, 5000);
    
    return () => clearInterval(interval);
  }, [checkForHints]);

  // Update activity time on user interactions
  const updateActivity = useCallback(() => {
    dispatch({ type: 'UPDATE_ACTIVITY' });
  }, [dispatch]);

  return {
    updateActivity,
  };
}
