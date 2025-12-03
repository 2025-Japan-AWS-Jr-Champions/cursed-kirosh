/**
 * Hint system logic for Cursed Kirosh
 * Provides contextual hints based on game progress
 */

import type { GameState } from './types';

export interface Hint {
  id: string;
  message: string;
  condition: (state: GameState) => boolean;
  priority: number; // Higher priority hints shown first
}

/**
 * All available hints in the game
 */
export const HINTS: Hint[] = [
  // Initial hints for new players
  {
    id: 'morse-basics',
    message: "💡 Hint: Use the Morse Code Input buttons (DOT and DASH) to unlock new characters. Try spelling 'SOS' with what you have!",
    condition: (state) => 
      state.morseHistory.length === 0 && 
      state.unlockedChars.size === 2,
    priority: 100,
  },
  
  // Hint about help command
  {
    id: 'help-command',
    message: "💡 Hint: Type 'help' to see available commands and get started.",
    condition: (state) => 
      state.commandHistory.length === 0 && 
      !state.completedCommands.has('help'),
    priority: 90,
  },
  
  // Hint about unlocking more characters
  {
    id: 'unlock-more',
    message: "💡 Hint: You've unlocked some characters! Keep using Morse code to unlock more. Each letter has a unique pattern.",
    condition: (state) => 
      state.unlockedChars.size > 2 && 
      state.unlockedChars.size < 10 &&
      state.morseHistory.length > 0,
    priority: 80,
  },
  
  // Hint about special commands
  {
    id: 'special-commands',
    message: "💡 Hint: Some commands are hidden secrets. Try combinations of 'S' and 'O' like 'SOS', 'OS', 'OSS', 'SSO', or 'SOSO'.",
    condition: (state) => 
      state.completedCommands.has('help') &&
      !state.completedCommands.has('sos') &&
      state.unlockedChars.size <= 5,
    priority: 75,
  },
  
  // Hint about heartbeat command
  {
    id: 'heartbeat-unlock',
    message: "💡 Hint: There's a special command that can unlock all characters at once. It's related to the sound you hear when clicking DOT...",
    condition: (state) => 
      state.morseHistory.length >= 5 &&
      state.unlockedChars.size < 26 &&
      !state.completedCommands.has('heartbeat'),
    priority: 70,
  },
  
  // Hint about endings
  {
    id: 'multiple-endings',
    message: "💡 Hint: This game has multiple endings! Try different commands like 'exit', 'sudo', 'treat', or 'kiro' to discover them.",
    condition: (state) => 
      state.unlockedChars.size >= 10 &&
      state.completedCommands.size >= 3 &&
      !state.gameComplete,
    priority: 65,
  },
  
  // Hint about echo command
  {
    id: 'echo-secret',
    message: "💡 Hint: The 'echo' command can do more than just repeat text. Try echoing a classic programmer's greeting...",
    condition: (state) => 
      state.completedCommands.has('echo') &&
      !state.completedCommands.has('echo Hello, world!') &&
      state.unlockedChars.size >= 15,
    priority: 60,
  },
  
  // Hint about save command
  {
    id: 'save-kiro',
    message: "💡 Hint: You can save things in this terminal. What if you tried to save... Kiro?",
    condition: (state) => 
      state.completedCommands.has('kiro') ||
      (state.unlockedChars.size >= 20 && state.completedCommands.size >= 5),
    priority: 55,
  },
  
  // Hint when stuck with few unlocked characters
  {
    id: 'stuck-few-chars',
    message: "💡 Hint: Feeling stuck? Focus on unlocking more characters through Morse code. Start with common letters like 'E' (.) or 'T' (-).",
    condition: (state) => 
      state.unlockedChars.size < 8 &&
      state.commandHistory.length >= 5 &&
      state.morseHistory.length < 3,
    priority: 85,
  },
  
  // Hint about light mode
  {
    id: 'light-mode',
    message: "💡 Hint: The darkness getting to you? Try the 'light' command to brighten things up.",
    condition: (state) => 
      state.commandHistory.length >= 10 &&
      !state.lightMode &&
      !state.completedCommands.has('light'),
    priority: 50,
  },
];

/**
 * Inactivity timeout in milliseconds (30 seconds)
 */
export const INACTIVITY_TIMEOUT = 30000;

/**
 * Minimum time between hints in milliseconds (60 seconds)
 */
export const HINT_COOLDOWN = 60000;

/**
 * Check if player has been inactive
 */
export function isPlayerInactive(state: GameState): boolean {
  const now = Date.now();
  const timeSinceActivity = now - state.lastActivityTime;
  return timeSinceActivity >= INACTIVITY_TIMEOUT;
}

/**
 * Check if enough time has passed since last hint
 */
export function canShowHint(state: GameState): boolean {
  if (!state.hintsEnabled) {
    return false;
  }
  
  const now = Date.now();
  const timeSinceLastHint = now - state.lastHintTime;
  return timeSinceLastHint >= HINT_COOLDOWN;
}

/**
 * Get the next appropriate hint based on game state
 * Returns null if no hint is appropriate
 */
export function getNextHint(state: GameState): Hint | null {
  // Don't show hints if game is complete
  if (state.gameComplete) {
    return null;
  }
  
  // Don't show hints if disabled
  if (!state.hintsEnabled) {
    return null;
  }
  
  // Don't show hints if cooldown hasn't passed
  if (!canShowHint(state)) {
    return null;
  }
  
  // Find all applicable hints that haven't been shown yet
  const applicableHints = HINTS.filter(
    hint => !state.hintsShown.has(hint.id) && hint.condition(state)
  );
  
  // Return the highest priority hint
  if (applicableHints.length === 0) {
    return null;
  }
  
  applicableHints.sort((a, b) => b.priority - a.priority);
  return applicableHints[0];
}

/**
 * Determine if a hint should be shown based on inactivity
 */
export function shouldShowHintForInactivity(state: GameState): boolean {
  return (
    isPlayerInactive(state) &&
    canShowHint(state) &&
    !state.gameComplete &&
    state.hintsEnabled
  );
}
