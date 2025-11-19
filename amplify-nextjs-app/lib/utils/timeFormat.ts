/**
 * Time formatting utilities for game timer and leaderboard
 */

/**
 * Formats milliseconds to MM:SS format
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "05:23")
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats milliseconds to HH:MM:SS format for longer durations
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "01:05:23")
 */
export function formatLongTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats milliseconds to a human-readable string
 * @param ms - Time in milliseconds
 * @returns Human-readable time string (e.g., "5 minutes 23 seconds")
 */
export function formatTimeHuman(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes === 0) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  if (seconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Calculates elapsed time between two timestamps
 * @param startTime - Start timestamp in milliseconds
 * @param endTime - End timestamp in milliseconds (defaults to now)
 * @returns Elapsed time in milliseconds
 */
export function calculateElapsedTime(startTime: number, endTime?: number): number {
  const end = endTime || Date.now();
  return end - startTime;
}
