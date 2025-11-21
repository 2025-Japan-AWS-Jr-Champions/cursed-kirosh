"use client";

/**
 * EndingScreen component - displays game ending with unique visuals for each ending type
 */

import type { EndingType } from "@/lib/game/types";

interface EndingScreenProps {
  ending: EndingType;
  completionTime: number;
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
  onRestart,
  onViewLeaderboard,
}: EndingScreenProps) {
  const content = getEndingContent(ending);

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
