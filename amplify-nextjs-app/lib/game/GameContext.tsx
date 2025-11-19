'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { gameStateReducer, createInitialGameState } from './gameState';
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
