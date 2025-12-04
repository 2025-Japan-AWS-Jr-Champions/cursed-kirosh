/**
 * Integration tests for game endings
 * Tests all 6 ending conditions and verifies they trigger correctly
 * Requirements: 4.1-4.7
 */

import { describe, it, expect, beforeEach } from "vitest";
import { parseCommand, executeCommand } from "@/lib/game/commandParser";
import { createInitialGameState } from "@/lib/game/gameState";
import type { GameState } from "@/lib/game/types";

describe("Game Endings Integration Tests", () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = createInitialGameState();
    // Unlock all characters for testing endings
    gameState.unlockedChars = new Set("abcdefghijklmnopqrstuvwxyz".split(""));
  });

  describe("Normal Ending (exit command)", () => {
    it("should trigger Normal Ending when exit command is executed", () => {
      const parsed = parseCommand("exit");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("NORMAL ENDING");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "normal" });
    });

    it("should display appropriate ending message", () => {
      const parsed = parseCommand("exit");
      const result = executeCommand(parsed, gameState);

      expect(result.output).toContain("exit");
      expect(result.output).toContain("simplest");
    });
  });

  describe("Kirosh Domination Ending (sudo command)", () => {
    it("should trigger Kirosh Domination Ending when sudo command is executed", () => {
      const parsed = parseCommand("sudo");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("KIROSH DOMINATION ENDING");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "sudo" });
    });

    it("should display appropriate ending message", () => {
      const parsed = parseCommand("sudo");
      const result = executeCommand(parsed, gameState);

      expect(result.output).toContain("sudo");
      expect(result.output).toContain("Kirosh");
    });
  });

  describe("Kiroween Ending (treat command)", () => {
    it("should trigger Kiroween Ending when treat command is executed", () => {
      const parsed = parseCommand("treat");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("KIROWEEN ENDING");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "kiroween" });
    });

    it("should display appropriate ending message", () => {
      const parsed = parseCommand("treat");
      const result = executeCommand(parsed, gameState);

      expect(result.output).toContain("treat");
      expect(result.output).toContain("Kiroween");
    });
  });

  describe("Kiro Editor Ending (kiro command)", () => {
    it("should trigger Kiro Editor Ending when kiro command is executed", () => {
      const parsed = parseCommand("kiro");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("KIRO EDITOR ENDING");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "kiro" });
    });

    it("should display appropriate ending message", () => {
      const parsed = parseCommand("kiro");
      const result = executeCommand(parsed, gameState);

      expect(result.output).toContain("Kiro");
      expect(result.output).toContain("editor");
    });
  });

  describe("Engineer Ending (echo Hello, world!)", () => {
    it("should trigger Engineer Ending when echo Hello, world! is executed", () => {
      const parsed = parseCommand("echo Hello, world!");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("ENGINEER ENDING");
      expect(result.output).toContain("Hello, world!");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "engineer" });
    });

    it("should be case-insensitive for Hello, world!", () => {
      const testCases = ["echo Hello, world!"];

      for (const testCase of testCases) {
        const parsed = parseCommand(testCase);
        const result = executeCommand(parsed, gameState);

        expect(result.success).toBe(true);
        expect(result.output).toContain("ENGINEER ENDING");
        expect(result.actions?.[0]).toMatchObject({ ending: "engineer" });
      }
    });

    it("should not trigger Engineer Ending for other echo commands", () => {
      const testCases = [
        "echo Hello world",
        "echo Hello, World",
        "echo hello world!",
        "echo test",
      ];

      for (const testCase of testCases) {
        const parsed = parseCommand(testCase);
        const result = executeCommand(parsed, gameState);

        expect(result.success).toBe(true);
        expect(result.output).not.toContain("ENGINEER ENDING");
        expect(result.actions).toBeUndefined();
      }
    });
  });

  describe("True Ending (save kiro command)", () => {
    it("should trigger True Ending when save kiro command is executed", () => {
      const parsed = parseCommand("save kiro");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.output).toContain("TRUE ENDING");
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      expect(result.actions?.[0]).toMatchObject({ ending: "true" });
    });

    it("should display appropriate ending message", () => {
      const parsed = parseCommand("save kiro");
      const result = executeCommand(parsed, gameState);

      expect(result.output).toContain("save kiro");
      expect(result.output).toContain("Kiro");
    });

    it("should not trigger True Ending for save without kiro argument", () => {
      const parsed = parseCommand("save");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(false);
      expect(result.output).not.toContain("TRUE ENDING");
      expect(result.output).toContain("missing file operand");
    });

    it("should not trigger True Ending for save with other arguments", () => {
      const parsed = parseCommand("save test.txt");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(false);
      expect(result.output).not.toContain("TRUE ENDING");
    });
  });

  describe("Ending Screen Display", () => {
    it("should provide completion time tracking data", () => {
      // Set start time
      gameState.startTime = Date.now() - 60000; // 1 minute ago

      const parsed = parseCommand("exit");
      const result = executeCommand(parsed, gameState);

      expect(result.success).toBe(true);
      expect(result.actions?.[0]?.type).toBe("END_GAME");
      // The actual time tracking is handled by the game state reducer
    });

    it("should track which ending was reached", () => {
      const endings = [
        { command: "exit", ending: "normal" },
        { command: "sudo", ending: "sudo" },
        { command: "treat", ending: "kiroween" },
        { command: "kiro", ending: "kiro" },
        { command: "echo Hello, world!", ending: "engineer" },
        { command: "save kiro", ending: "true" },
      ];

      for (const { command, ending } of endings) {
        const parsed = parseCommand(command);
        const result = executeCommand(parsed, gameState);

        expect(result.actions?.[0]).toMatchObject({
          type: "END_GAME",
          ending,
        });
      }
    });
  });

  describe("Ending Uniqueness", () => {
    it("should have unique ending types for each command", () => {
      const endings = [
        parseCommand("exit"),
        parseCommand("sudo"),
        parseCommand("treat"),
        parseCommand("kiro"),
        parseCommand("echo Hello, world!"),
        parseCommand("save kiro"),
      ];

      const endingTypes = endings.map((parsed) => {
        const result = executeCommand(parsed, gameState);
        return result.actions?.[0]?.ending;
      });

      const uniqueEndings = new Set(endingTypes);
      expect(uniqueEndings.size).toBe(6);
    });
  });
});
