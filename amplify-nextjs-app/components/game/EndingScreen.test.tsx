/**
 * EndingScreen component tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EndingScreen from "./EndingScreen";
import type { EndingType } from "@/lib/game/types";

describe("EndingScreen", () => {
  const mockOnRestart = vi.fn();
  const mockOnViewLeaderboard = vi.fn();

  it("should render Normal Ending", () => {
    render(
      <EndingScreen
        ending="normal"
        completionTime={60000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Normal Ending")).toBeDefined();
    expect(screen.getByText(/simplest path/i)).toBeDefined();
    expect(screen.getByText("01:00")).toBeDefined();
  });

  it("should render Kirosh Domination Ending", () => {
    render(
      <EndingScreen
        ending="sudo"
        completionTime={120000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Kirosh Domination Ending")).toBeDefined();
    expect(screen.getByText(/became one with Kirosh/i)).toBeDefined();
    expect(screen.getByText("02:00")).toBeDefined();
  });

  it("should render Kiroween Ending", () => {
    render(
      <EndingScreen
        ending="kiroween"
        completionTime={90000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Kiroween Ending")).toBeDefined();
    expect(screen.getByText(/treats to the spirits/i)).toBeDefined();
    expect(screen.getByText("01:30")).toBeDefined();
  });

  it("should render Kiro Editor Ending", () => {
    render(
      <EndingScreen
        ending="kiro"
        completionTime={45000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Kiro Editor Ending")).toBeDefined();
    expect(screen.getByText(/AI-powered editor/i)).toBeDefined();
    expect(screen.getByText("00:45")).toBeDefined();
  });

  it("should render Engineer Ending", () => {
    render(
      <EndingScreen
        ending="engineer"
        completionTime={75000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Engineer Ending")).toBeDefined();
    expect(screen.getByText(/Hello, world!/i)).toBeDefined();
    expect(screen.getByText("01:15")).toBeDefined();
  });

  it("should render True Ending", () => {
    render(
      <EndingScreen
        ending="true"
        completionTime={180000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("True Ending")).toBeDefined();
    expect(screen.getByText(/saved Kiro/i)).toBeDefined();
    expect(screen.getByText("03:00")).toBeDefined();
  });

  it("should display Play Again and View Leaderboard buttons", () => {
    render(
      <EndingScreen
        ending="normal"
        completionTime={60000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("Play Again")).toBeDefined();
    expect(screen.getByText("View Leaderboard")).toBeDefined();
  });

  it("should format time correctly", () => {
    render(
      <EndingScreen
        ending="normal"
        completionTime={125000}
        onRestart={mockOnRestart}
        onViewLeaderboard={mockOnViewLeaderboard}
      />
    );

    expect(screen.getByText("02:05")).toBeDefined();
  });
});
