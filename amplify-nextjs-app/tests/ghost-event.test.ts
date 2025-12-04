/**
 * Integration tests for ghost event mechanic
 * Tests ghost appearance, treat/trick responses, and character re-locking
 * Requirements: 9.1-9.5
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createInitialGameState, gameStateReducer } from "@/lib/game/gameState";
import type { GameState, GameAction } from "@/lib/game/types";
import { lockAllExceptInitial } from "@/lib/game/characterUnlock";

describe("Ghost Event Mechanic", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createInitialGameState();
    // Unlock some additional characters for testing
    gameState.unlockedChars = new Set(["s", "o", "a", "b", "c", "d", "e"]);
  });

  describe("Ghost Event Triggering", () => {
    it("should activate ghost event when TRIGGER_GHOST_EVENT action is dispatched", () => {
      const action: GameAction = { type: "TRIGGER_GHOST_EVENT" };
      const newState = gameStateReducer(gameState, action);

      expect(newState.ghostEventActive).toBe(true);
    });

    it("should track ghost event count", () => {
      expect(gameState.ghostEventCount).toBe(0);

      const action: GameAction = { type: "TRIGGER_GHOST_EVENT" };
      const newState = gameStateReducer(gameState, action);

      expect(newState.ghostEventCount).toBe(0); // Count increments on RESOLVE, not TRIGGER
    });

    it("should update last ghost event time", () => {
      const beforeTime = Date.now();
      const action: GameAction = { type: "TRIGGER_GHOST_EVENT" };
      const newState = gameStateReducer(gameState, action);
      const afterTime = Date.now();

      expect(newState.lastGhostEventTime).toBeGreaterThanOrEqual(beforeTime);
      expect(newState.lastGhostEventTime).toBeLessThanOrEqual(afterTime);
    });

    it("should allow multiple ghost events", () => {
      let state = gameState;

      // First ghost event
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventCount).toBe(0); // Count increments on RESOLVE

      // Resolve it
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.ghostEventCount).toBe(1);

      // Second ghost event
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.ghostEventCount).toBe(2);
    });
  });

  describe("Successful Treat Response", () => {
    it("should maintain unlocked characters when treat is successful", () => {
      const unlockedBefore = new Set(gameState.unlockedChars);

      // Trigger ghost event
      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);

      // Resolve with success (treat)
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });

      expect(state.ghostEventActive).toBe(false);
      expect(state.unlockedChars.size).toBe(unlockedBefore.size);

      // Verify all characters are still unlocked
      for (const char of unlockedBefore) {
        expect(state.unlockedChars.has(char)).toBe(true);
      }
    });

    it("should deactivate ghost event after successful treat", () => {
      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);

      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.ghostEventActive).toBe(false);
    });

    it("should track successful treat responses", () => {
      let state = gameState;

      // First successful treat
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });

      // Second successful treat
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });

      // Both should have been successful
      expect(state.ghostEventCount).toBe(2);
    });
  });

  describe("Failed Trick Response", () => {
    it("should re-lock characters when trick occurs (timeout or typo)", () => {
      const initialChars = new Set(gameState.initialChars);

      // Trigger ghost event
      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);
      expect(state.unlockedChars.size).toBeGreaterThan(initialChars.size);

      // Resolve with failure (trick)
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });

      expect(state.ghostEventActive).toBe(false);
      expect(state.unlockedChars.size).toBe(initialChars.size);

      // Verify only initial characters remain
      for (const char of initialChars) {
        expect(state.unlockedChars.has(char)).toBe(true);
      }
    });

    it("should preserve initial characters (s, o) after trick", () => {
      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });

      expect(state.unlockedChars.has("s")).toBe(true);
      expect(state.unlockedChars.has("o")).toBe(true);
    });

    it("should remove all non-initial characters after trick", () => {
      const nonInitialChars = ["a", "b", "c", "d", "e"];

      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });

      for (const char of nonInitialChars) {
        expect(state.unlockedChars.has(char)).toBe(false);
      }
    });

    it("should deactivate ghost event after trick", () => {
      let state = gameStateReducer(gameState, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);

      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });
      expect(state.ghostEventActive).toBe(false);
    });
  });

  describe("Character Lock/Unlock Utility", () => {
    it("should correctly lock all except initial characters", () => {
      const initialChars = new Set(["s", "o"]);
      const result = lockAllExceptInitial(initialChars);

      expect(result.size).toBe(2);
      expect(result.has("s")).toBe(true);
      expect(result.has("o")).toBe(true);
    });

    it("should not include any non-initial characters", () => {
      const initialChars = new Set(["s", "o"]);
      const result = lockAllExceptInitial(initialChars);

      const alphabet = "abcdefghijklmnpqrtuvwxyz".split(""); // excluding s and o
      for (const char of alphabet) {
        expect(result.has(char)).toBe(false);
      }
    });
  });

  describe("Ghost Event State Transitions", () => {
    it("should handle complete ghost event cycle with success", () => {
      let state = gameState;
      const initialUnlocked = state.unlockedChars.size;

      // Not active initially
      expect(state.ghostEventActive).toBe(false);

      // Trigger ghost event
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);
      expect(state.ghostEventCount).toBe(0); // Count increments on RESOLVE

      // Resolve successfully
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.ghostEventActive).toBe(false);
      expect(state.ghostEventCount).toBe(1);
      expect(state.unlockedChars.size).toBe(initialUnlocked);
    });

    it("should handle complete ghost event cycle with failure", () => {
      let state = gameState;
      const initialCharsSize = state.initialChars.size;

      // Trigger ghost event
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.ghostEventActive).toBe(true);

      // Resolve with failure
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });
      expect(state.ghostEventActive).toBe(false);
      expect(state.unlockedChars.size).toBe(initialCharsSize);
    });

    it("should handle multiple ghost events with mixed outcomes", () => {
      let state = gameState;

      // First ghost event - success
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      const unlockedAfterFirst = state.unlockedChars.size;
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.unlockedChars.size).toBe(unlockedAfterFirst);

      // Second ghost event - failure
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });
      expect(state.unlockedChars.size).toBe(state.initialChars.size);

      // Third ghost event - success (but characters already locked)
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });
      expect(state.unlockedChars.size).toBe(state.initialChars.size);

      expect(state.ghostEventCount).toBe(3);
    });
  });

  describe("Ghost Event Timing", () => {
    it("should track time between ghost events", () => {
      let state = gameState;

      // First ghost event
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      const firstEventTime = state.lastGhostEventTime;

      // Resolve it
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: true });

      // Wait a bit (simulated) - in real tests, time would pass
      // For this test, we just verify the time was recorded
      expect(firstEventTime).toBeGreaterThan(0);

      // Second ghost event (would normally check if enough time has passed)
      state = gameStateReducer(state, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.lastGhostEventTime).toBeGreaterThanOrEqual(firstEventTime);
    });
  });

  describe("Edge Cases", () => {
    it("should handle ghost event when only initial characters are unlocked", () => {
      const minimalState = createInitialGameState();
      expect(minimalState.unlockedChars.size).toBe(2);

      let state = gameStateReducer(minimalState, { type: "TRIGGER_GHOST_EVENT" });
      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });

      expect(state.unlockedChars.size).toBe(2);
      expect(state.unlockedChars.has("s")).toBe(true);
      expect(state.unlockedChars.has("o")).toBe(true);
    });

    it("should handle ghost event when all characters are unlocked", () => {
      const fullState = createInitialGameState();
      fullState.unlockedChars = new Set("abcdefghijklmnopqrstuvwxyz".split(""));

      let state = gameStateReducer(fullState, { type: "TRIGGER_GHOST_EVENT" });
      expect(state.unlockedChars.size).toBe(26);

      state = gameStateReducer(state, { type: "RESOLVE_GHOST_EVENT", success: false });
      expect(state.unlockedChars.size).toBe(2); // Back to initial
    });

    it("should not affect game state if ghost event is not active", () => {
      const stateBefore = { ...gameState };

      const state = gameStateReducer(gameState, {
        type: "RESOLVE_GHOST_EVENT",
        success: true,
      });

      // Should not change much if ghost wasn't active
      expect(state.ghostEventActive).toBe(false);
    });
  });
});
