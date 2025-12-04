'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { gameStateReducer, createInitialGameState } from './gameState';
import { saveGameState, loadSavedGameState, clearSavedGameState } from '../utils/localStorage';
import type { GameState, GameAction } from './types';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

/**
 * GameContext Provider
 * Provides game state and dispatch function to all child components
 */
export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameStateReducer, createInitialGameState());

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadSavedGameState();
    if (savedState) {
      dispatch({ type: 'LOAD_SAVED_STATE', state: savedState });
    }
  }, []);

  // Save state on changes (debounced)
  useEffect(() => {
    // Don't save initial state or completed games
    if (!state.startTime || state.gameComplete) {
      return;
    }

    const timeoutId = setTimeout(() => {
      saveGameState(state);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Clear saved state when game completes
  useEffect(() => {
    if (state.gameComplete) {
      clearSavedGameState();
    }
  }, [state.gameComplete]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Hook to access game context
 * Must be used within a GameProvider
 */
export function useGameContext() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  
  return context;
}
