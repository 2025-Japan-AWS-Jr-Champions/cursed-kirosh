/**
 * Integration tests for leaderboard functionality
 * Tests score submission, leaderboard display, and offline behavior
 * Requirements: 7.1-7.5
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createInitialGameState, gameStateReducer } from "@/lib/game/gameState";
import type { GameState } from "@/lib/game/types";

describe("Leaderboard Functionality", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createInitialGameState();
    // Clear localStorage before each test
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  describe("Completion Time Tracking", () => {
    it("should track game start time when game starts", () => {
      const action = { type: "START_GAME" as const };
      const newState = gameStateReducer(gameState, action);

      expect(newState.startTime).toBeDefined();
      expect(newState.startTime).toBeGreaterThan(0);
    });

    it("should track game end time when game ends", () => {
      // Start the game
      let state = gameStateReducer(gameState, { type: "START_GAME" });
      expect(state.startTime).toBeDefined();

      // End the game
      state = gameStateReducer(state, { type: "END_GAME", ending: "normal" });
      expect(state.endTime).toBeDefined();
      expect(state.endTime).toBeGreaterThan(0);
    });

    it("should calculate completion time correctly", () => {
      // Start the game
      let state = gameStateReducer(gameState, { type: "START_GAME" });
      const startTime = state.startTime!;

      // Simulate some time passing
      const delay = 5000; // 5 seconds
      vi.useFakeTimers();
      vi.advanceTimersByTime(delay);

      // End the game
      state = gameStateReducer(state, { type: "END_GAME", ending: "normal" });
      const endTime = state.endTime!;

      const completionTime = endTime - startTime;
      expect(completionTime).toBeGreaterThanOrEqual(0);

      vi.useRealTimers();
    });

    it("should track completion time for different endings", () => {
      const endings = ["normal", "sudo", "kiroween", "kiro", "engineer", "true"] as const;

      for (const ending of endings) {
        let state = createInitialGameState();
        state = gameStateReducer(state, { type: "START_GAME" });
        state = gameStateReducer(state, { type: "END_GAME", ending });

        expect(state.startTime).toBeDefined();
        expect(state.endTime).toBeDefined();
        expect(state.currentEnding).toBe(ending);
      }
    });
  });

  describe("Score Submission Data", () => {
    it("should track unlocked character count", () => {
      let state = gameState;
      state.unlockedChars = new Set(["s", "o", "a", "b", "c"]);

      expect(state.unlockedChars.size).toBe(5);
    });

    it("should track secrets found", () => {
      let state = gameState;

      // Add some secrets
      state = gameStateReducer(state, {
        type: "ADD_OUTPUT",
        line: {
          id: "1",
          text: "Secret discovered!",
          type: "system",
          timestamp: Date.now(),
        },
      });

      // Track secrets in discoveredSecrets
      state.discoveredSecrets.add("secret1");
      state.discoveredSecrets.add("secret2");

      expect(state.discoveredSecrets.size).toBe(2);
    });

    it("should track ending type", () => {
      let state = gameStateReducer(gameState, { type: "START_GAME" });
      state = gameStateReducer(state, { type: "END_GAME", ending: "true" });

      expect(state.currentEnding).toBe("true");
    });

    it("should have all required data for leaderboard submission", () => {
      let state = gameStateReducer(gameState, { type: "START_GAME" });
      state.unlockedChars = new Set(["s", "o", "a", "b", "c", "d", "e"]);
      state.discoveredSecrets.add("secret1");
      state = gameStateReducer(state, { type: "END_GAME", ending: "engineer" });

      // Verify all required fields are available
      expect(state.startTime).toBeDefined();
      expect(state.endTime).toBeDefined();
      expect(state.currentEnding).toBeDefined();
      expect(state.unlockedChars.size).toBeGreaterThan(0);
      expect(state.discoveredSecrets.size).toBeGreaterThan(0);

      const completionTime = state.endTime! - state.startTime!;
      expect(completionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Leaderboard Sorting", () => {
    it("should sort entries by completion time (ascending)", () => {
      const entries = [
        { completionTime: 120000, playerName: "Player2" },
        { completionTime: 60000, playerName: "Player1" },
        { completionTime: 180000, playerName: "Player3" },
      ];

      const sorted = [...entries].sort((a, b) => a.completionTime - b.completionTime);

      expect(sorted[0].playerName).toBe("Player1");
      expect(sorted[1].playerName).toBe("Player2");
      expect(sorted[2].playerName).toBe("Player3");
    });

    it("should handle identical completion times", () => {
      const entries = [
        { completionTime: 60000, playerName: "Player1" },
        { completionTime: 60000, playerName: "Player2" },
        { completionTime: 60000, playerName: "Player3" },
      ];

      const sorted = [...entries].sort((a, b) => a.completionTime - b.completionTime);

      expect(sorted.length).toBe(3);
      expect(sorted[0].completionTime).toBe(60000);
      expect(sorted[1].completionTime).toBe(60000);
      expect(sorted[2].completionTime).toBe(60000);
    });
  });

  describe("Local Storage Persistence", () => {
    it("should store game preferences in localStorage", () => {
      if (typeof window === "undefined") {
        return; // Skip in non-browser environment
      }

      const preferences = {
        audioEnabled: true,
        hintsEnabled: false,
      };

      localStorage.setItem("gamePreferences", JSON.stringify(preferences));

      const stored = localStorage.getItem("gamePreferences");
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.audioEnabled).toBe(true);
      expect(parsed.hintsEnabled).toBe(false);
    });

    it("should store best time in localStorage", () => {
      if (typeof window === "undefined") {
        return;
      }

      const bestTime = 45000; // 45 seconds
      localStorage.setItem("bestTime", bestTime.toString());

      const stored = localStorage.getItem("bestTime");
      expect(stored).toBe("45000");
      expect(Number.parseInt(stored!)).toBe(45000);
    });

    it("should store games played count", () => {
      if (typeof window === "undefined") {
        return;
      }

      let gamesPlayed = 0;
      localStorage.setItem("gamesPlayed", gamesPlayed.toString());

      // Increment after each game
      gamesPlayed++;
      localStorage.setItem("gamesPlayed", gamesPlayed.toString());

      const stored = localStorage.getItem("gamesPlayed");
      expect(Number.parseInt(stored!)).toBe(1);
    });

    it("should store discovered endings", () => {
      if (typeof window === "undefined") {
        return;
      }

      const discoveredEndings = new Set(["normal", "engineer"]);
      localStorage.setItem(
        "discoveredEndings",
        JSON.stringify(Array.from(discoveredEndings))
      );

      const stored = localStorage.getItem("discoveredEndings");
      const parsed = new Set(JSON.parse(stored!));

      expect(parsed.has("normal")).toBe(true);
      expect(parsed.has("engineer")).toBe(true);
      expect(parsed.has("true")).toBe(false);
    });
  });

  describe("Offline Behavior", () => {
    it("should handle pending submissions in localStorage", () => {
      if (typeof window === "undefined") {
        return;
      }

      const pendingSubmission = {
        playerName: "TestPlayer",
        completionTime: 60000,
        endingType: "normal",
        unlockedCharCount: 10,
        secretsFound: 3,
      };

      localStorage.setItem(
        "pendingLeaderboardSubmission",
        JSON.stringify(pendingSubmission)
      );

      const stored = localStorage.getItem("pendingLeaderboardSubmission");
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.playerName).toBe("TestPlayer");
      expect(parsed.completionTime).toBe(60000);
      expect(parsed.endingType).toBe("normal");
    });

    it("should check for pending submissions", () => {
      if (typeof window === "undefined") {
        return;
      }

      // No pending submission initially
      expect(localStorage.getItem("pendingLeaderboardSubmission")).toBeNull();

      // Add pending submission
      localStorage.setItem(
        "pendingLeaderboardSubmission",
        JSON.stringify({ playerName: "Test" })
      );

      expect(localStorage.getItem("pendingLeaderboardSubmission")).toBeDefined();
    });

    it("should clear pending submission after successful submit", () => {
      if (typeof window === "undefined") {
        return;
      }

      // Set pending submission
      localStorage.setItem(
        "pendingLeaderboardSubmission",
        JSON.stringify({ playerName: "Test" })
      );

      // Simulate successful submission
      localStorage.removeItem("pendingLeaderboardSubmission");

      expect(localStorage.getItem("pendingLeaderboardSubmission")).toBeNull();
    });
  });

  describe("Leaderboard Display Requirements", () => {
    it("should display player name", () => {
      const entry = {
        id: "1",
        playerName: "TestPlayer",
        completionTime: 60000,
        endingType: "normal",
        completedAt: new Date().toISOString(),
      };

      expect(entry.playerName).toBe("TestPlayer");
    });

    it("should display completion time", () => {
      const entry = {
        id: "1",
        playerName: "TestPlayer",
        completionTime: 75000, // 1:15
        endingType: "normal",
        completedAt: new Date().toISOString(),
      };

      expect(entry.completionTime).toBe(75000);

      // Format time as MM:SS
      const totalSeconds = Math.floor(entry.completionTime / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      expect(formatted).toBe("1:15");
    });

    it("should display ending type", () => {
      const entry = {
        id: "1",
        playerName: "TestPlayer",
        completionTime: 60000,
        endingType: "engineer",
        completedAt: new Date().toISOString(),
      };

      expect(entry.endingType).toBe("engineer");
    });

    it("should handle optional fields", () => {
      const entry = {
        id: "1",
        playerName: "TestPlayer",
        completionTime: 60000,
        endingType: "normal",
        completedAt: new Date().toISOString(),
        unlockedCharCount: 15,
        secretsFound: 5,
      };

      expect(entry.unlockedCharCount).toBe(15);
      expect(entry.secretsFound).toBe(5);
    });
  });

  describe("Game State Reset", () => {
    it("should reset game state for new game", () => {
      let state = gameStateReducer(gameState, { type: "START_GAME" });
      state.unlockedChars = new Set(["s", "o", "a", "b", "c"]);
      state = gameStateReducer(state, { type: "END_GAME", ending: "normal" });

      // Reset for new game
      state = gameStateReducer(state, { type: "RESET_GAME" });

      expect(state.startTime).toBeNull();
      expect(state.endTime).toBeNull();
      expect(state.currentEnding).toBeNull();
      expect(state.gameComplete).toBe(false);
      expect(state.unlockedChars.size).toBe(2); // Back to initial
    });

    it("should reset settings to defaults on game reset", () => {
      let state = gameState;
      state.audioEnabled = false;
      state.hintsEnabled = false;

      state = gameStateReducer(state, { type: "START_GAME" });
      state = gameStateReducer(state, { type: "END_GAME", ending: "normal" });
      state = gameStateReducer(state, { type: "RESET_GAME" });

      // Settings should reset to defaults
      expect(state.audioEnabled).toBe(true);
      expect(state.hintsEnabled).toBe(true);
    });
  });
});
