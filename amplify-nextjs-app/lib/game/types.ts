/**
 * Core game state and interface types for Cursed Kirosh
 */

export type EndingType = 'normal' | 'sudo' | 'kiroween' | 'kiro' | 'engineer' | 'true';

export type OutputLineType = 'command' | 'output' | 'error' | 'system';

export interface OutputLine {
  id: string;
  text: string;
  type: OutputLineType;
  timestamp: number;
}

export interface MorseEntry {
  sequence: string;
  character: string;
  timestamp: number;
}

export interface GameState {
  // Character management
  unlockedChars: Set<string>;
  initialChars: Set<string>; // 's', 'o'
  
  // Morse input
  currentMorseSequence: string;
  morseHistory: MorseEntry[];
  
  // Terminal state
  commandHistory: string[];
  outputLines: OutputLine[];
  currentInput: string;
  
  // Game progress
  startTime: number | null;
  endTime: number | null;
  completedCommands: Set<string>;
  discoveredSecrets: Set<string>;
  
  // Events
  ghostEventActive: boolean;
  ghostEventCount: number;
  lastGhostEventTime: number;
  
  // Ending
  currentEnding: EndingType | null;
  gameComplete: boolean;
  
  // Settings
  audioEnabled: boolean;
  hintsEnabled: boolean;
  lightMode: boolean;
}

export type GameAction =
  | { type: 'UNLOCK_CHARACTER'; character: string }
  | { type: 'LOCK_CHARACTER'; character: string }
  | { type: 'ADD_MORSE_INPUT'; input: 'dot' | 'dash' }
  | { type: 'CLEAR_MORSE_INPUT' }
  | { type: 'COMPLETE_MORSE'; character: string }
  | { type: 'SUBMIT_COMMAND'; command: string }
  | { type: 'ADD_OUTPUT'; line: OutputLine }
  | { type: 'START_GAME' }
  | { type: 'END_GAME'; ending: EndingType }
  | { type: 'TRIGGER_GHOST_EVENT' }
  | { type: 'RESOLVE_GHOST_EVENT'; success: boolean }
  | { type: 'TOGGLE_LIGHT_MODE' }
  | { type: 'RESET_GAME' };

export interface CommandResult {
  success: boolean;
  output: string;
  type: OutputLineType;
}
