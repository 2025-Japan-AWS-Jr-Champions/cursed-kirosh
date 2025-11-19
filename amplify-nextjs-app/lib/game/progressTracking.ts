/**
 * Game progress tracking utilities
 */

import type { GameState, EndingType } from './types';

/**
 * Gets the elapsed time in milliseconds
 */
export function getElapsedTime(startTime: number | null, endTime: number | null): number {
  if (!startTime) return 0;
  const end = endTime || Date.now();
  return end - startTime;
}

/**
 * Gets the completion time in milliseconds (only if game is complete)
 */
export function getCompletionTime(startTime: number | null, endTime: number | null): number | null {
  if (!startTime || !endTime) return null;
  return endTime - startTime;
}

/**
 * Formats time in milliseconds to MM:SS.ms format
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

/**
 * Formats time in a short human-readable format (e.g., "5m 23s" or "45s")
 */
export function formatTimeShort(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats time in a very short format for leaderboard (e.g., "5:23")
 */
export function formatTimeLeaderboard(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Checks if the game has started
 */
export function hasGameStarted(startTime: number | null): boolean {
  return startTime !== null;
}

/**
 * Checks if the game is complete
 */
export function isGameComplete(gameComplete: boolean, endTime: number | null): boolean {
  return gameComplete && endTime !== null;
}

/**
 * Gets the number of completed commands
 */
export function getCompletedCommandCount(completedCommands: Set<string>): number {
  return completedCommands.size;
}

/**
 * Gets the number of discovered secrets
 */
export function getDiscoveredSecretCount(discoveredSecrets: Set<string>): number {
  return discoveredSecrets.size;
}

/**
 * Checks if a specific command has been completed
 */
export function hasCompletedCommand(command: string, completedCommands: Set<string>): boolean {
  return completedCommands.has(command.toLowerCase());
}

/**
 * Checks if a specific secret has been discovered
 */
export function hasDiscoveredSecret(secret: string, discoveredSecrets: Set<string>): boolean {
  return discoveredSecrets.has(secret.toLowerCase());
}

/**
 * Gets game statistics for display
 */
export function getGameStatistics(state: GameState) {
  return {
    elapsedTime: getElapsedTime(state.startTime, state.endTime),
    completionTime: getCompletionTime(state.startTime, state.endTime),
    commandsCompleted: getCompletedCommandCount(state.completedCommands),
    secretsDiscovered: getDiscoveredSecretCount(state.discoveredSecrets),
    charactersUnlocked: state.unlockedChars.size,
    ghostEventsEncountered: state.ghostEventCount,
    isComplete: isGameComplete(state.gameComplete, state.endTime),
    hasStarted: hasGameStarted(state.startTime),
  };
}

/**
 * Gets a progress summary for the player
 */
export function getProgressSummary(state: GameState): string {
  const stats = getGameStatistics(state);
  
  if (!stats.hasStarted) {
    return 'Game not started';
  }
  
  if (stats.isComplete) {
    return `Completed in ${formatTimeShort(stats.completionTime!)} - ${state.currentEnding} ending`;
  }
  
  return `${stats.commandsCompleted} commands | ${stats.charactersUnlocked} chars unlocked | ${formatTimeShort(stats.elapsedTime)}`;
}

/**
 * Creates a leaderboard entry from game state
 */
export interface LeaderboardEntryData {
  completionTime: number;
  endingType: EndingType;
  unlockedCharCount: number;
  secretsFound: number;
  completedAt: Date;
}

export function createLeaderboardEntry(state: GameState): LeaderboardEntryData | null {
  const completionTime = getCompletionTime(state.startTime, state.endTime);
  
  if (!completionTime || !state.currentEnding) {
    return null;
  }
  
  return {
    completionTime,
    endingType: state.currentEnding,
    unlockedCharCount: state.unlockedChars.size,
    secretsFound: state.discoveredSecrets.size,
    completedAt: new Date(state.endTime!),
  };
}
