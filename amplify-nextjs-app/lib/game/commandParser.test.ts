/**
 * Command parser tests
 */

import { describe, it, expect } from "vitest";
import {
  parseCommand,
  isValidCommand,
  executeCommand,
  getUnknownCommandMessage,
} from "./commandParser";
import { createInitialGameState } from "./gameState";

describe("parseCommand", () => {
  it("should parse simple command", () => {
    const result = parseCommand("ls");
    expect(result.command).toBe("ls");
    expect(result.args).toEqual([]);
    expect(result.rawInput).toBe("ls");
  });

  it("should parse command with arguments", () => {
    const result = parseCommand("echo hello world");
    expect(result.command).toBe("echo");
    expect(result.args).toEqual(["hello", "world"]);
  });

  it("should handle extra whitespace", () => {
    const result = parseCommand("  cd   secrets  ");
    expect(result.command).toBe("cd");
    expect(result.args).toEqual(["secrets"]);
  });

  it("should convert command to lowercase", () => {
    const result = parseCommand("SOS");
    expect(result.command).toBe("sos");
  });
});

describe("isValidCommand", () => {
  it("should recognize basic commands", () => {
    expect(isValidCommand("ls")).toBe(true);
    expect(isValidCommand("cd")).toBe(true);
    expect(isValidCommand("echo")).toBe(true);
    expect(isValidCommand("help")).toBe(true);
  });

  it("should recognize special commands", () => {
    expect(isValidCommand("sos")).toBe(true);
    expect(isValidCommand("heartbeat")).toBe(true);
    expect(isValidCommand("light")).toBe(true);
  });

  it("should reject invalid commands", () => {
    expect(isValidCommand("invalid")).toBe(false);
    expect(isValidCommand("rm")).toBe(false);
  });
});

describe("getUnknownCommandMessage", () => {
  it("should suggest alternatives for common mistakes", () => {
    const message = getUnknownCommandMessage("dir");
    expect(message).toContain("ls");
  });

  it("should provide generic help for unknown commands", () => {
    const message = getUnknownCommandMessage("unknown");
    expect(message).toContain("help");
  });
});

describe("executeCommand - basic commands", () => {
  const gameState = createInitialGameState();

  it("should execute ls command", () => {
    const parsed = parseCommand("ls");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("secrets.txt");
  });

  it("should execute echo command", () => {
    const parsed = parseCommand("echo test message");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toBe("test message");
  });

  it("should execute cd command", () => {
    const parsed = parseCommand("cd secrets");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("secrets");
  });

  it("should handle cd to non-existent directory", () => {
    const parsed = parseCommand("cd nonexistent");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(false);
    expect(result.type).toBe("error");
  });
});

describe("executeCommand - special commands", () => {
  const gameState = createInitialGameState();

  it("should execute SOS command", () => {
    const parsed = parseCommand("sos");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("DISTRESS SIGNAL");
  });

  it("should execute OS command", () => {
    const parsed = parseCommand("os");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("KIROSH OS");
  });

  it("should execute OSS command", () => {
    const parsed = parseCommand("oss");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("Linux");
  });

  it("should execute SSO command", () => {
    const parsed = parseCommand("sso");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("GAME OVER");
  });

  it("should execute SOSO command", () => {
    const parsed = parseCommand("soso");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("give up");
  });
});

describe("executeCommand - heartbeat", () => {
  it("should unlock all alphabetic characters", () => {
    const gameState = createInitialGameState();
    const parsed = parseCommand("heartbeat");
    const result = executeCommand(parsed, gameState);

    expect(result.success).toBe(true);
    expect(result.output).toContain("unlocked");
    expect(result.actions).toBeDefined();
    expect(result.actions?.length).toBe(26); // a-z

    // Check that all actions are UNLOCK_CHARACTER
    result.actions?.forEach((action) => {
      expect(action.type).toBe("UNLOCK_CHARACTER");
    });
  });
});

describe("executeCommand - light", () => {
  it("should toggle light mode on", () => {
    const gameState = createInitialGameState();
    const parsed = parseCommand("light");
    const result = executeCommand(parsed, gameState);

    expect(result.success).toBe(true);
    expect(result.output).toContain("Light floods");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("TOGGLE_LIGHT_MODE");
  });

  it("should toggle light mode off", () => {
    const gameState = createInitialGameState();
    gameState.lightMode = true;
    const parsed = parseCommand("light");
    const result = executeCommand(parsed, gameState);

    expect(result.success).toBe(true);
    expect(result.output).toContain("Darkness returns");
  });
});

describe("executeCommand - help", () => {
  it("should display help information", () => {
    const gameState = createInitialGameState();
    const parsed = parseCommand("help");
    const result = executeCommand(parsed, gameState);

    expect(result.success).toBe(true);
    expect(result.output).toContain("Available Commands");
    expect(result.output).toContain("ls");
    expect(result.output).toContain("echo");
  });
});

describe("executeCommand - error handling", () => {
  const gameState = createInitialGameState();

  it("should handle empty command", () => {
    const parsed = parseCommand("");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(false);
    expect(result.type).toBe("error");
  });

  it("should handle unknown command", () => {
    const parsed = parseCommand("invalid");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(false);
    expect(result.type).toBe("error");
    expect(result.output).toContain("not found");
  });
});

describe("executeCommand - endings", () => {
  const gameState = createInitialGameState();

  it("should trigger Normal Ending with exit command", () => {
    const parsed = parseCommand("exit");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("NORMAL ENDING");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "normal" });
  });

  it("should trigger Kirosh Domination Ending with sudo command", () => {
    const parsed = parseCommand("sudo");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("KIROSH DOMINATION ENDING");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "sudo" });
  });

  it("should trigger Kiroween Ending with treat command", () => {
    const parsed = parseCommand("treat");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("KIROWEEN ENDING");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "kiroween" });
  });

  it("should trigger Kiro Editor Ending with kiro command", () => {
    const parsed = parseCommand("kiro");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("KIRO EDITOR ENDING");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "kiro" });
  });

  it("should trigger Engineer Ending with echo Hello, world!", () => {
    const parsed = parseCommand("echo Hello, world!");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("ENGINEER ENDING");
    expect(result.output).toContain("Hello, world!");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "engineer" });
  });

  it("should trigger True Ending with save kiro command", () => {
    const parsed = parseCommand("save kiro");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(true);
    expect(result.output).toContain("TRUE ENDING");
    expect(result.actions).toBeDefined();
    expect(result.actions?.[0]?.type).toBe("END_GAME");
    expect(result.actions?.[0]).toMatchObject({ ending: "true" });
  });

  it("should handle save command without kiro argument", () => {
    const parsed = parseCommand("save");
    const result = executeCommand(parsed, gameState);
    expect(result.success).toBe(false);
    expect(result.output).toContain("missing file operand");
  });
});
