/**
 * Browser localStorage utilities for game persistence
 */

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

const STORAGE_KEY = 'cursed-kirosh-game-data';

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
