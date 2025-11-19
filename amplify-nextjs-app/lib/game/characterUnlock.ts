/**
 * Character unlock utilities and logic
 */

import { getAllAlphabeticCharacters } from './morseCode';
import type { GameState } from './types';

/**
 * Unlocks all alphabetic characters (a-z)
 * Used for the "heartbeat" command
 */
export function unlockAllCharacters(currentUnlockedChars: Set<string>): Set<string> {
  const allChars = getAllAlphabeticCharacters();
  return new Set([...currentUnlockedChars, ...allChars]);
}

/**
 * Locks all characters except the initial ones (s, o)
 * Used when ghost event fails (trick)
 */
export function lockAllExceptInitial(initialChars: Set<string>): Set<string> {
  return new Set(initialChars);
}

/**
 * Checks if a character is unlocked
 */
export function isCharacterUnlocked(character: string, unlockedChars: Set<string>): boolean {
  return unlockedChars.has(character.toLowerCase());
}

/**
 * Filters a string to only include unlocked characters
 * Used for command input validation
 */
export function filterUnlockedCharacters(text: string, unlockedChars: Set<string>): string {
  return text
    .split('')
    .filter((char) => {
      // Allow spaces and special characters
      if (char === ' ' || /[^a-zA-Z0-9]/.test(char)) {
        return true;
      }
      return unlockedChars.has(char.toLowerCase());
    })
    .join('');
}

/**
 * Gets the count of unlocked characters
 */
export function getUnlockedCharacterCount(unlockedChars: Set<string>): number {
  return unlockedChars.size;
}

/**
 * Gets the percentage of characters unlocked (out of 26 alphabetic characters)
 */
export function getUnlockProgress(unlockedChars: Set<string>): number {
  const alphabeticChars = Array.from(unlockedChars).filter((char) => /[a-z]/.test(char));
  return Math.round((alphabeticChars.length / 26) * 100);
}

/**
 * Checks if all alphabetic characters are unlocked
 */
export function areAllCharactersUnlocked(unlockedChars: Set<string>): boolean {
  const allChars = getAllAlphabeticCharacters();
  return Array.from(allChars).every((char) => unlockedChars.has(char));
}
