/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import type { OutputLine } from "@/lib/game/types";
import React from "react";

// Create a mock GameContext module
const mockGameState = {
  lightMode: false,
  unlockedChars: new Set(["s", "o"]),
  initialChars: new Set(["s", "o"]),
  currentMorseSequence: "",
  morseHistory: [],
  commandHistory: [],
  outputLines: [],
  currentInput: "",
  startTime: null,
  endTime: null,
  completedCommands: new Set(),
  discoveredSecrets: new Set(),
  ghostEventActive: false,
  ghostEventCount: 0,
  lastGhostEventTime: 0,
  currentEnding: null,
  gameComplete: false,
  lastActivityTime: Date.now(),
  lastHintTime: 0,
  hintsShown: new Set(),
  audioEnabled: true,
  hintsEnabled: true,
};

// Mock the module before any imports
vi.mock("@/lib/game/GameContext", () => ({
  useGameContext: () => ({
    state: mockGameState,
    dispatch: vi.fn(),
  }),
}));

// Now import the component
import { OutputDisplay } from "@/components/game/OutputDisplay";

describe("CursedText in Endings", () => {
  const createOutputLine = (
    text: string,
    type: OutputLine["type"] = "output"
  ): OutputLine => ({
    id: `test-${Date.now()}-${Math.random()}`,
    text,
    type,
    timestamp: Date.now(),
  });

  it("should render text when no ending is active", () => {
    const lines = [createOutputLine("Test message")];
    render(<OutputDisplay lines={lines} currentEnding={null} />);
    
    // Text should be present (cursedText enabled by default)
    const textElement = document.body.textContent;
    expect(textElement).toContain("Test message");
  });

  it("should render text for normal ending", () => {
    const lines = [createOutputLine("Normal ending message")];
    render(<OutputDisplay lines={lines} currentEnding="normal" />);
    
    // Text should be present (cursedText disabled for normal ending)
    const textElement = document.body.textContent;
    expect(textElement).toContain("Normal ending message");
  });

  it("should render text for kiro ending", () => {
    const lines = [createOutputLine("Kiro ending message")];
    render(<OutputDisplay lines={lines} currentEnding="kiro" />);
    
    const textElement = document.body.textContent;
    expect(textElement).toContain("Kiro ending message");
  });

  it("should render text for true ending", () => {
    const lines = [createOutputLine("True ending message")];
    render(<OutputDisplay lines={lines} currentEnding="true" />);
    
    const textElement = document.body.textContent;
    expect(textElement).toContain("True ending message");
  });

  it("should render text for sudo ending", () => {
    const lines = [createOutputLine("Sudo ending message")];
    render(<OutputDisplay lines={lines} currentEnding="sudo" />);
    
    const textElement = document.body.textContent;
    expect(textElement).toContain("Sudo ending message");
  });

  it("should render text for kiroween ending", () => {
    const lines = [createOutputLine("Kiroween ending message")];
    render(<OutputDisplay lines={lines} currentEnding="kiroween" />);
    
    const textElement = document.body.textContent;
    expect(textElement).toContain("Kiroween ending message");
  });

  it("should render text for engineer ending", () => {
    const lines = [createOutputLine("Engineer ending message")];
    render(<OutputDisplay lines={lines} currentEnding="engineer" />);
    
    const textElement = document.body.textContent;
    expect(textElement).toContain("Engineer ending message");
  });

  it("should render text for SSO ending (cursedText still enabled)", () => {
    const lines = [createOutputLine("SSO ending message - VR death game!")];
    render(<OutputDisplay lines={lines} currentEnding="sso" />);
    
    // SSO ending should still render text (with cursed text enabled)
    const textElement = document.body.textContent;
    expect(textElement).toContain("SSO ending message - VR death game!");
  });

  it("should handle multi-line ending messages correctly", () => {
    const multiLineText = "Line 1\nLine 2\nLine 3";
    const lines = [createOutputLine(multiLineText)];
    render(<OutputDisplay lines={lines} currentEnding="normal" />);
    
    // All lines should be present
    const textElement = document.body.textContent;
    expect(textElement).toContain("Line 1");
    expect(textElement).toContain("Line 2");
    expect(textElement).toContain("Line 3");
  });

  it("should handle command type lines in endings", () => {
    const lines = [createOutputLine("exit", "command")];
    render(<OutputDisplay lines={lines} currentEnding="normal" />);
    
    // Command should be displayed
    const textElement = document.body.textContent;
    expect(textElement).toContain("exit");
    expect(textElement).toContain("cursed@kirosh:~$");
  });
});
