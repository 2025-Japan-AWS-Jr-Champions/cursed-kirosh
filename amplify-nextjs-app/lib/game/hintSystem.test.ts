/**
 * Tests for hint system logic
 */

import { describe, it, expect } from 'vitest';
import {
  getNextHint,
  canShowHint,
  isPlayerInactive,
  shouldShowHintForInactivity,
  INACTIVITY_TIMEOUT,
  HINT_COOLDOWN,
} from './hintSystem';
import { createInitialGameState } from './gameState';

describe('hintSystem', () => {
  describe('isPlayerInactive', () => {
    it('should return false for recent activity', () => {
      const state = createInitialGameState();
      expect(isPlayerInactive(state)).toBe(false);
    });

    it('should return true after inactivity timeout', () => {
      const state = createInitialGameState();
      state.lastActivityTime = Date.now() - INACTIVITY_TIMEOUT - 1000;
      expect(isPlayerInactive(state)).toBe(true);
    });
  });

  describe('canShowHint', () => {
    it('should return true when hints are enabled and cooldown passed', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      expect(canShowHint(state)).toBe(true);
    });

    it('should return false when hints are disabled', () => {
      const state = createInitialGameState();
      state.hintsEnabled = false;
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      expect(canShowHint(state)).toBe(false);
    });

    it('should return false when cooldown has not passed', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - 1000; // Only 1 second ago
      expect(canShowHint(state)).toBe(false); // Cooldown is 60 seconds
    });
  });

  describe('getNextHint', () => {
    it('should return null when game is complete', () => {
      const state = createInitialGameState();
      state.gameComplete = true;
      expect(getNextHint(state)).toBe(null);
    });

    it('should return null when hints are disabled', () => {
      const state = createInitialGameState();
      state.hintsEnabled = false;
      expect(getNextHint(state)).toBe(null);
    });

    it('should return a hint for new players', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      
      const hint = getNextHint(state);
      expect(hint).not.toBe(null);
      // Should be either morse-basics or help-command (both have high priority)
      expect(['morse-basics', 'help-command']).toContain(hint?.id);
    });

    it('should not return same hint twice', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      
      const hint1 = getNextHint(state);
      expect(hint1).not.toBe(null);
      
      // Mark hint as shown
      state.hintsShown.add(hint1!.id);
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      
      const hint2 = getNextHint(state);
      // Should get a different hint or null
      if (hint2) {
        expect(hint2.id).not.toBe(hint1!.id);
      }
    });

    it('should return morse basics hint when no morse history', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      state.hintsShown.add('help-command'); // Mark help hint as shown
      
      const hint = getNextHint(state);
      expect(hint).not.toBe(null);
      expect(hint?.id).toBe('morse-basics');
    });
  });

  describe('shouldShowHintForInactivity', () => {
    it('should return true when all conditions are met', () => {
      const state = createInitialGameState();
      state.lastActivityTime = Date.now() - INACTIVITY_TIMEOUT - 1000;
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      
      expect(shouldShowHintForInactivity(state)).toBe(true);
    });

    it('should return false when player is active', () => {
      const state = createInitialGameState();
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      
      expect(shouldShowHintForInactivity(state)).toBe(false);
    });

    it('should return false when game is complete', () => {
      const state = createInitialGameState();
      state.lastActivityTime = Date.now() - INACTIVITY_TIMEOUT - 1000;
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      state.gameComplete = true;
      
      expect(shouldShowHintForInactivity(state)).toBe(false);
    });

    it('should return false when hints are disabled', () => {
      const state = createInitialGameState();
      state.lastActivityTime = Date.now() - INACTIVITY_TIMEOUT - 1000;
      state.lastHintTime = Date.now() - HINT_COOLDOWN - 1000;
      state.hintsEnabled = false;
      
      expect(shouldShowHintForInactivity(state)).toBe(false);
    });
  });
});
