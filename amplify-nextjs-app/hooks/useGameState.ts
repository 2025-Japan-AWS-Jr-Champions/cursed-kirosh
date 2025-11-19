'use client';

import { useCallback } from 'react';
import { useGameContext } from '@/lib/game/GameContext';
import { createOutputLine } from '@/lib/game/gameState';
import { getAllAlphabeticCharacters } from '@/lib/game/morseCode';
import { getGameStatistics, getProgressSummary, createLeaderboardEntry } from '@/lib/game/progressTracking';
import type { EndingType, OutputLine } from '@/lib/game/types';

/**
 * Custom hook for game state management
 * Provides convenient methods for game state operations
 */
export function useGameState() {
  const { state, dispatch } = useGameContext();

  // Character lock/unlock operations
  const unlockCharacter = useCallback((character: string) => {
    dispatch({ type: 'UNLOCK_CHARACTER', character: character.toLowerCase() });
  }, [dispatch]);

  const lockCharacter = useCallback((character: string) => {
    dispatch({ type: 'LOCK_CHARACTER', character: character.toLowerCase() });
  }, [dispatch]);

  const unlockAllAlphabetic = useCallback(() => {
    const allChars = getAllAlphabeticCharacters();
    allChars.forEach((char) => {
      dispatch({ type: 'UNLOCK_CHARACTER', character: char });
    });
  }, [dispatch]);

  const resetToInitialChars = useCallback(() => {
    // Lock all characters except initial ones
    const allChars = getAllAlphabeticCharacters();
    allChars.forEach((char) => {
      if (!state.initialChars.has(char)) {
        dispatch({ type: 'LOCK_CHARACTER', character: char });
      }
    });
  }, [dispatch, state.initialChars]);

  // Morse input operations
  const addMorseInput = useCallback((input: 'dot' | 'dash') => {
    dispatch({ type: 'ADD_MORSE_INPUT', input });
  }, [dispatch]);

  const clearMorseInput = useCallback(() => {
    dispatch({ type: 'CLEAR_MORSE_INPUT' });
  }, [dispatch]);

  const completeMorse = useCallback((character: string) => {
    dispatch({ type: 'COMPLETE_MORSE', character });
  }, [dispatch]);

  // Command operations
  const submitCommand = useCallback((command: string) => {
    dispatch({ type: 'SUBMIT_COMMAND', command });
  }, [dispatch]);

  const addOutput = useCallback((text: string, type: OutputLine['type'] = 'output') => {
    const line = createOutputLine(text, type);
    dispatch({ type: 'ADD_OUTPUT', line });
  }, [dispatch]);

  // Game lifecycle operations
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const endGame = useCallback((ending: EndingType) => {
    dispatch({ type: 'END_GAME', ending });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  // Ghost event operations
  const triggerGhostEvent = useCallback(() => {
    dispatch({ type: 'TRIGGER_GHOST_EVENT' });
  }, [dispatch]);

  const resolveGhostEvent = useCallback((success: boolean) => {
    dispatch({ type: 'RESOLVE_GHOST_EVENT', success });
  }, [dispatch]);

  // Computed values
  const isCharacterUnlocked = useCallback((character: string) => {
    return state.unlockedChars.has(character.toLowerCase());
  }, [state.unlockedChars]);

  const getElapsedTime = useCallback(() => {
    if (!state.startTime) return 0;
    const endTime = state.endTime || Date.now();
    return endTime - state.startTime;
  }, [state.startTime, state.endTime]);

  const getCompletionTime = useCallback(() => {
    if (!state.startTime || !state.endTime) return null;
    return state.endTime - state.startTime;
  }, [state.startTime, state.endTime]);

  // Progress tracking
  const getStatistics = useCallback(() => {
    return getGameStatistics(state);
  }, [state]);

  const getProgress = useCallback(() => {
    return getProgressSummary(state);
  }, [state]);

  const getLeaderboardEntry = useCallback(() => {
    return createLeaderboardEntry(state);
  }, [state]);

  const hasCompletedCommand = useCallback((command: string) => {
    return state.completedCommands.has(command.toLowerCase());
  }, [state.completedCommands]);

  const hasDiscoveredSecret = useCallback((secret: string) => {
    return state.discoveredSecrets.has(secret.toLowerCase());
  }, [state.discoveredSecrets]);

  return {
    // State
    state,
    
    // Character operations
    unlockCharacter,
    lockCharacter,
    unlockAllAlphabetic,
    resetToInitialChars,
    isCharacterUnlocked,
    
    // Morse operations
    addMorseInput,
    clearMorseInput,
    completeMorse,
    
    // Command operations
    submitCommand,
    addOutput,
    
    // Game lifecycle
    startGame,
    endGame,
    resetGame,
    
    // Ghost events
    triggerGhostEvent,
    resolveGhostEvent,
    
    // Computed values
    getElapsedTime,
    getCompletionTime,
    
    // Progress tracking
    getStatistics,
    getProgress,
    getLeaderboardEntry,
    hasCompletedCommand,
    hasDiscoveredSecret,
  };
}
