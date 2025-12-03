import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGhostEvent } from './useGhostEvent';
import { GameProvider } from '@/lib/game/GameContext';
import type { ReactNode } from 'react';

// Mock the GameContext
vi.mock('@/lib/game/GameContext', async () => {
  const actual = await vi.importActual('@/lib/game/GameContext');
  return {
    ...actual,
    useGameContext: vi.fn(),
  };
});

describe('useGhostEvent Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return ghost event state', () => {
    const mockDispatch = vi.fn();
    const mockState = {
      ghostEventActive: false,
      ghostEventCount: 0,
      gameComplete: false,
      startTime: Date.now(),
      unlockedChars: new Set(['s', 'o']),
      initialChars: new Set(['s', 'o']),
      currentMorseSequence: '',
      morseHistory: [],
      commandHistory: [],
      outputLines: [],
      currentInput: '',
      endTime: null,
      completedCommands: new Set(),
      discoveredSecrets: new Set(),
      lastGhostEventTime: 0,
      currentEnding: null,
      audioEnabled: true,
      hintsEnabled: true,
      lightMode: false,
    };

    const { useGameContext } = require('@/lib/game/GameContext');
    useGameContext.mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result } = renderHook(() => useGhostEvent({ enabled: true }), {
      wrapper,
    });

    expect(result.current.isGhostActive).toBe(false);
    expect(result.current.ghostEventCount).toBe(0);
  });

  it('should not schedule ghost events when game is not started', () => {
    const mockDispatch = vi.fn();
    const mockState = {
      ghostEventActive: false,
      ghostEventCount: 0,
      gameComplete: false,
      startTime: null, // Game not started
      unlockedChars: new Set(['s', 'o']),
      initialChars: new Set(['s', 'o']),
      currentMorseSequence: '',
      morseHistory: [],
      commandHistory: [],
      outputLines: [],
      currentInput: '',
      endTime: null,
      completedCommands: new Set(),
      discoveredSecrets: new Set(),
      lastGhostEventTime: 0,
      currentEnding: null,
      audioEnabled: true,
      hintsEnabled: true,
      lightMode: false,
    };

    const { useGameContext } = require('@/lib/game/GameContext');
    useGameContext.mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    renderHook(() => useGhostEvent({ enabled: true }), { wrapper });

    // Advance time significantly
    vi.advanceTimersByTime(200000);

    // Should not have dispatched any ghost events
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'TRIGGER_GHOST_EVENT' })
    );
  });

  it('should not schedule ghost events when disabled', () => {
    const mockDispatch = vi.fn();
    const mockState = {
      ghostEventActive: false,
      ghostEventCount: 0,
      gameComplete: false,
      startTime: Date.now(),
      unlockedChars: new Set(['s', 'o']),
      initialChars: new Set(['s', 'o']),
      currentMorseSequence: '',
      morseHistory: [],
      commandHistory: [],
      outputLines: [],
      currentInput: '',
      endTime: null,
      completedCommands: new Set(),
      discoveredSecrets: new Set(),
      lastGhostEventTime: 0,
      currentEnding: null,
      audioEnabled: true,
      hintsEnabled: true,
      lightMode: false,
    };

    const { useGameContext } = require('@/lib/game/GameContext');
    useGameContext.mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    renderHook(() => useGhostEvent({ enabled: false }), { wrapper });

    // Advance time significantly
    vi.advanceTimersByTime(200000);

    // Should not have dispatched any ghost events
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'TRIGGER_GHOST_EVENT' })
    );
  });
});
