/**
 * Browser localStorage utilities for game persistence
 */

import type { GameState, OutputLine, MorseEntry } from '../game/types';

export interface LocalGameData {
  bestTime: number | null;
  gamesPlayed: number;
  endingsDiscovered: string[];
  totalSecretsFound: number;
  preferences: {
    audioEnabled: boolean;
    hintsEnabled: boolean;
  };
}

/**
 * Serializable version of GameState for localStorage
 */
interface SerializableGameState {
  unlockedChars: string[];
  initialChars: string[];
  currentMorseSequence: string;
  morseHistory: MorseEntry[];
  commandHistory: string[];
  outputLines: OutputLine[];
  currentInput: string;
  startTime: number | null;
  endTime: number | null;
  completedCommands: string[];
  discoveredSecrets: string[];
  ghostEventActive: boolean;
  ghostEventCount: number;
  lastGhostEventTime: number;
  currentEnding: GameState['currentEnding'];
  gameComplete: boolean;
  lastActivityTime: number;
  lastHintTime: number;
  hintsShown: string[];
  audioEnabled: boolean;
  hintsEnabled: boolean;
  lightMode: boolean;
}

const STORAGE_KEY = 'cursed-kirosh-game-data';
const SAVED_STATE_KEY = 'cursed-kirosh-saved-state';

/**
 * Gets the default local game data
 */
function getDefaultLocalGameData(): LocalGameData {
  return {
    bestTime: null,
    gamesPlayed: 0,
    endingsDiscovered: [],
    totalSecretsFound: 0,
    preferences: {
      audioEnabled: true,
      hintsEnabled: true,
    },
  };
}

/**
 * Loads game data from localStorage
 */
export function loadLocalGameData(): LocalGameData {
  if (typeof window === 'undefined') {
    return getDefaultLocalGameData();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultLocalGameData();
    }
    
    const parsed = JSON.parse(stored);
    return {
      ...getDefaultLocalGameData(),
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load game data:', error);
    return getDefaultLocalGameData();
  }
}

/**
 * Saves game data to localStorage
 */
export function saveLocalGameData(data: Partial<LocalGameData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = loadLocalGameData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save game data:', error);
  }
}

/**
 * Updates best time if the new time is better
 */
export function updateBestTime(completionTime: number): boolean {
  const data = loadLocalGameData();
  
  if (data.bestTime === null || completionTime < data.bestTime) {
    saveLocalGameData({ bestTime: completionTime });
    return true;
  }
  
  return false;
}

/**
 * Adds a discovered ending
 */
export function addDiscoveredEnding(ending: string): void {
  const data = loadLocalGameData();
  
  if (!data.endingsDiscovered.includes(ending)) {
    saveLocalGameData({
      endingsDiscovered: [...data.endingsDiscovered, ending],
    });
  }
}

/**
 * Increments games played counter
 */
export function incrementGamesPlayed(): void {
  const data = loadLocalGameData();
  saveLocalGameData({ gamesPlayed: data.gamesPlayed + 1 });
}

/**
 * Updates user preferences
 */
export function updatePreferences(preferences: Partial<LocalGameData['preferences']>): void {
  const data = loadLocalGameData();
  saveLocalGameData({
    preferences: { ...data.preferences, ...preferences },
  });
}

/**
 * Clears all local game data
 */
export function clearLocalGameData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game data:', error);
  }
}

/**
 * Converts GameState to a serializable format
 */
function serializeGameState(state: GameState): SerializableGameState {
  return {
    unlockedChars: Array.from(state.unlockedChars),
    initialChars: Array.from(state.initialChars),
    currentMorseSequence: state.currentMorseSequence,
    morseHistory: state.morseHistory,
    commandHistory: state.commandHistory,
    outputLines: state.outputLines,
    currentInput: state.currentInput,
    startTime: state.startTime,
    endTime: state.endTime,
    completedCommands: Array.from(state.completedCommands),
    discoveredSecrets: Array.from(state.discoveredSecrets),
    ghostEventActive: state.ghostEventActive,
    ghostEventCount: state.ghostEventCount,
    lastGhostEventTime: state.lastGhostEventTime,
    currentEnding: state.currentEnding,
    gameComplete: state.gameComplete,
    lastActivityTime: state.lastActivityTime,
    lastHintTime: state.lastHintTime,
    hintsShown: Array.from(state.hintsShown),
    audioEnabled: state.audioEnabled,
    hintsEnabled: state.hintsEnabled,
    lightMode: state.lightMode,
  };
}

/**
 * Converts serializable format back to GameState
 */
function deserializeGameState(serialized: SerializableGameState): Partial<GameState> {
  return {
    unlockedChars: new Set(serialized.unlockedChars),
    initialChars: new Set(serialized.initialChars),
    currentMorseSequence: serialized.currentMorseSequence,
    morseHistory: serialized.morseHistory,
    commandHistory: serialized.commandHistory,
    outputLines: serialized.outputLines,
    currentInput: serialized.currentInput,
    startTime: serialized.startTime,
    endTime: serialized.endTime,
    completedCommands: new Set(serialized.completedCommands),
    discoveredSecrets: new Set(serialized.discoveredSecrets),
    ghostEventActive: serialized.ghostEventActive,
    ghostEventCount: serialized.ghostEventCount,
    lastGhostEventTime: serialized.lastGhostEventTime,
    currentEnding: serialized.currentEnding,
    gameComplete: serialized.gameComplete,
    lastActivityTime: serialized.lastActivityTime,
    lastHintTime: serialized.lastHintTime,
    hintsShown: new Set(serialized.hintsShown),
    audioEnabled: serialized.audioEnabled,
    hintsEnabled: serialized.hintsEnabled,
    lightMode: serialized.lightMode,
  };
}

/**
 * Saves current game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  
  // Don't save if game is complete
  if (state.gameComplete) {
    return;
  }
  
  try {
    const serialized = serializeGameState(state);
    localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Loads saved game state from localStorage
 */
export function loadSavedGameState(): Partial<GameState> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SAVED_STATE_KEY);
    if (!stored) {
      return null;
    }
    
    const serialized = JSON.parse(stored) as SerializableGameState;
    return deserializeGameState(serialized);
  } catch (error) {
    console.error('Failed to load saved game state:', error);
    return null;
  }
}

/**
 * Checks if there is a saved game state
 */
export function hasSavedGameState(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(SAVED_STATE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Clears saved game state from localStorage
 */
export function clearSavedGameState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SAVED_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear saved game state:', error);
  }
}
