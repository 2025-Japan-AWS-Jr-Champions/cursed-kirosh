import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveGameState,
  loadSavedGameState,
  hasSavedGameState,
  clearSavedGameState,
} from './localStorage';
import { createInitialGameState } from '../game/gameState';
import type { GameState } from '../game/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Game State Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save and load game state', () => {
    const state = createInitialGameState();
    state.startTime = Date.now();
    state.unlockedChars.add('a');
    state.unlockedChars.add('b');
    state.commandHistory.push('ls');
    state.completedCommands.add('ls');

    saveGameState(state);
    const loaded = loadSavedGameState();

    expect(loaded).not.toBeNull();
    expect(loaded?.unlockedChars).toEqual(new Set(['s', 'o', 'a', 'b']));
    expect(loaded?.commandHistory).toEqual(['ls']);
    expect(loaded?.completedCommands).toEqual(new Set(['ls']));
  });

  it('should not save completed games', () => {
    const state = createInitialGameState();
    state.startTime = Date.now();
    state.gameComplete = true;
    state.currentEnding = 'normal';

    saveGameState(state);
    const loaded = loadSavedGameState();

    expect(loaded).toBeNull();
  });

  it('should handle Set objects correctly', () => {
    const state = createInitialGameState();
    state.startTime = Date.now();
    state.unlockedChars.add('x');
    state.unlockedChars.add('y');
    state.unlockedChars.add('z');
    state.discoveredSecrets.add('secret1');
    state.hintsShown.add('hint1');

    saveGameState(state);
    const loaded = loadSavedGameState();

    expect(loaded?.unlockedChars).toBeInstanceOf(Set);
    expect(loaded?.unlockedChars?.has('x')).toBe(true);
    expect(loaded?.unlockedChars?.has('y')).toBe(true);
    expect(loaded?.unlockedChars?.has('z')).toBe(true);
    expect(loaded?.discoveredSecrets).toBeInstanceOf(Set);
    expect(loaded?.discoveredSecrets?.has('secret1')).toBe(true);
    expect(loaded?.hintsShown).toBeInstanceOf(Set);
    expect(loaded?.hintsShown?.has('hint1')).toBe(true);
  });

  it('should check if saved state exists', () => {
    expect(hasSavedGameState()).toBe(false);

    const state = createInitialGameState();
    state.startTime = Date.now();
    saveGameState(state);

    expect(hasSavedGameState()).toBe(true);
  });

  it('should clear saved state', () => {
    const state = createInitialGameState();
    state.startTime = Date.now();
    saveGameState(state);

    expect(hasSavedGameState()).toBe(true);

    clearSavedGameState();

    expect(hasSavedGameState()).toBe(false);
    expect(loadSavedGameState()).toBeNull();
  });

  it('should return null for corrupted data', () => {
    localStorageMock.setItem('cursed-kirosh-saved-state', 'invalid json');

    const loaded = loadSavedGameState();
    expect(loaded).toBeNull();
  });
});
