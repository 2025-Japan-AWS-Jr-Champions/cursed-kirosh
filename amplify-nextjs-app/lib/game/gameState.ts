/**
 * Game state initialization and reducer logic
 */

import type { GameState, GameAction, OutputLine } from './types';

/**
 * Creates the initial game state
 */
export function createInitialGameState(): GameState {
  return {
    // Character management - start with 's' and 'o' unlocked
    unlockedChars: new Set(['s', 'o']),
    initialChars: new Set(['s', 'o']),
    
    // Morse input
    currentMorseSequence: '',
    morseHistory: [],
    
    // Terminal state
    commandHistory: [],
    outputLines: [],
    currentInput: '',
    
    // Game progress
    startTime: null,
    endTime: null,
    completedCommands: new Set(),
    discoveredSecrets: new Set(),
    
    // Events
    ghostEventActive: false,
    ghostEventCount: 0,
    lastGhostEventTime: 0,
    
    // Ending
    currentEnding: null,
    gameComplete: false,
    
    // Hints
    lastActivityTime: Date.now(),
    lastHintTime: 0,
    hintsShown: new Set(),
    
    // Settings
    audioEnabled: true,
    hintsEnabled: true,
    lightMode: false,
  };
}

/**
 * Game state reducer
 */
export function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UNLOCK_CHARACTER':
      return {
        ...state,
        unlockedChars: new Set([...state.unlockedChars, action.character.toLowerCase()]),
      };
      
    case 'LOCK_CHARACTER':
      const newUnlockedChars = new Set(state.unlockedChars);
      newUnlockedChars.delete(action.character.toLowerCase());
      return {
        ...state,
        unlockedChars: newUnlockedChars,
      };
      
    case 'ADD_MORSE_INPUT':
      return {
        ...state,
        currentMorseSequence: state.currentMorseSequence + (action.input === 'dot' ? '.' : '-'),
      };
      
    case 'CLEAR_MORSE_INPUT':
      return {
        ...state,
        currentMorseSequence: '',
      };
      
    case 'COMPLETE_MORSE':
      return {
        ...state,
        currentMorseSequence: '',
        morseHistory: [
          ...state.morseHistory,
          {
            sequence: state.currentMorseSequence,
            character: action.character,
            timestamp: Date.now(),
          },
        ],
      };
      
    case 'SUBMIT_COMMAND':
      return {
        ...state,
        commandHistory: [...state.commandHistory, action.command],
        completedCommands: new Set([...state.completedCommands, action.command]),
        currentInput: '',
      };
      
    case 'ADD_OUTPUT':
      return {
        ...state,
        outputLines: [...state.outputLines, action.line],
      };
      
    case 'START_GAME':
      return {
        ...state,
        startTime: Date.now(),
      };
      
    case 'END_GAME':
      return {
        ...state,
        currentEnding: action.ending,
        gameComplete: true,
        endTime: Date.now(),
      };
      
    case 'TRIGGER_GHOST_EVENT':
      return {
        ...state,
        ghostEventActive: true,
        lastGhostEventTime: Date.now(),
      };
      
    case 'RESOLVE_GHOST_EVENT':
      if (!action.success) {
        // Re-lock all characters except initial ones on failed treat
        return {
          ...state,
          ghostEventActive: false,
          ghostEventCount: state.ghostEventCount + 1,
          unlockedChars: new Set(state.initialChars),
        };
      }
      return {
        ...state,
        ghostEventActive: false,
        ghostEventCount: state.ghostEventCount + 1,
      };
      
    case 'TOGGLE_LIGHT_MODE':
      return {
        ...state,
        lightMode: !state.lightMode,
      };
      
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivityTime: Date.now(),
      };
      
    case 'SHOW_HINT':
      return {
        ...state,
        lastHintTime: Date.now(),
        hintsShown: new Set([...state.hintsShown, action.hintId]),
      };
      
    case 'DISCOVER_SECRET':
      return {
        ...state,
        discoveredSecrets: new Set([...state.discoveredSecrets, action.secret.toLowerCase()]),
      };
      
    case 'RESET_GAME':
      return createInitialGameState();
      
    default:
      return state;
  }
}

/**
 * Helper to create output lines
 */
export function createOutputLine(
  text: string,
  type: OutputLine['type'] = 'output'
): OutputLine {
  return {
    id: `${Date.now()}-${Math.random()}`,
    text,
    type,
    timestamp: Date.now(),
  };
}
