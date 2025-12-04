"use client";

/**
 * EndingScreen component - displays game ending with unique visuals for each ending type
 */

import { useState, useEffect } from "react";
import type { EndingType } from "@/lib/game/types";
import { submitScore } from "@/lib/game/leaderboard";

interface EndingScreenProps {
  ending: EndingType;
  completionTime: number;
  unlockedCharCount: number;
  secretsFound: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

/**
 * Format milliseconds to MM:SS format
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get ending-specific content
 */
function getEndingContent(ending: EndingType): {
  title: string;
  message: string;
  artwork: string;
  color: string;
} {
  switch (ending) {
    case "normal":
      return {
        title: "Normal Ending",
        message:
          "You escaped the cursed terminal through the exit. Sometimes the simplest path is the right one.",
        artwork: "🚪",
        color: "text-gray-400",
      };

    case "sudo":
      return {
        title: "Kirosh Domination Ending",
        message:
          "You invoked sudo and became one with Kirosh. You are no longer trapped—you ARE the trap.",
        artwork: "👑",
        color: "text-purple-500",
      };

    case "kiroween":
      return {
        title: "Kiroween Ending",
        message:
          "You offered treats to the spirits. The ghosts are satisfied, and Halloween magic has set you free.",
        artwork: "🎃",
        color: "text-orange-500",
      };

    case "kiro":
      return {
        title: "Kiro Editor Ending",
        message:
          "You invoked Kiro, the AI-powered editor. The curse was just a feature request all along. Freedom through code.",
        artwork: "⌨️",
        color: "text-blue-400",
      };

    case "engineer":
      return {
        title: "Engineer Ending",
        message:
          'You typed "Hello, world!" and remembered the fundamentals. The curse cannot hold an engineer who knows the basics.',
        artwork: "💻",
        color: "text-green-400",
      };

    case "true":
      return {
        title: "True Ending",
        message:
          "You saved Kiro. The curse wasn't meant to trap you—it was meant to trap Kiro. You freed everyone.",
        artwork: "⭐",
        color: "text-yellow-400",
      };

    default:
      return {
        title: "Unknown Ending",
        message: "You've reached an ending...",
        artwork: "❓",
        color: "text-gray-400",
      };
  }
}

export default function EndingScreen({
  ending,
  completionTime,
  unlockedCharCount,
  secretsFound,
  onRestart,
  onViewLeaderboard,
}: EndingScreenProps) {
  const content = getEndingContent(ending);
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle score submission
  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      setSubmitError("Please enter your name");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitScore({
      playerName: playerName.trim(),
      completionTime,
      endingType: ending,
      unlockedCharCount,
      secretsFound,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setShowNamePrompt(false);
    } else {
      setSubmitError(
        result.error || "Failed to submit score. Your score has been saved locally and will be submitted when you're back online."
      );
    }
  };

  // Handle skip submission
  const handleSkip = () => {
    setShowNamePrompt(false);
  };

  // Handle Enter key in name input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitScore();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="max-w-2xl w-full mx-4 p-8 bg-gradient-to-br from-purple-900/50 to-orange-900/50 border-2 border-orange-500 rounded-lg shadow-2xl animate-scale-in">
        {/* Artwork */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-4 animate-bounce-slow">{content.artwork}</div>
        </div>

        {/* Title */}
        <h1 className={`text-4xl font-bold text-center mb-4 ${content.color}`}>
          {content.title}
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-300 text-center mb-6 leading-relaxed">
          {content.message}
        </p>

        {/* Completion Time */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-1">Completion Time</div>
          <div className="text-3xl font-mono text-orange-400">
            {formatTime(completionTime)}
          </div>
        </div>

        {/* Name Prompt for Leaderboard */}
        {showNamePrompt && !submitSuccess && (
          <div className="mb-8 p-4 bg-black/30 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3 text-center">
              Submit to Leaderboard
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                maxLength={30}
                className="px-4 py-2 bg-black/50 border border-orange-500/50 rounded text-orange-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                disabled={isSubmitting}
              />
              {submitError && (
                <p className="text-sm text-red-400 text-center">{submitError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmitScore}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Submit Score"}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded transition-colors duration-200"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 p-4 bg-green-900/30 rounded-lg border border-green-500/30 text-center">
            <p className="text-green-400 font-semibold">
              ✓ Score submitted successfully!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-orange-500/50"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onViewLeaderboard}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-purple-500/50"
          >
            View Leaderboard
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Thank you for playing Cursed Kirosh!
        </div>
      </div>
    </div>
  );
}
