"use client";

/**
 * Leaderboard page - displays top scores sorted by completion time
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/game/leaderboard";

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
 * Get ending display name
 */
function getEndingDisplayName(endingType: string): string {
  const endingNames: Record<string, string> = {
    normal: "Normal",
    sudo: "Kirosh Domination",
    kiroween: "Kiroween",
    kiro: "Kiro Editor",
    engineer: "Engineer",
    true: "True Ending",
  };
  return endingNames[endingType] || endingType;
}

/**
 * Get ending emoji
 */
function getEndingEmoji(endingType: string): string {
  const endingEmojis: Record<string, string> = {
    normal: "🚪",
    sudo: "👑",
    kiroween: "🎃",
    kiro: "⌨️",
    engineer: "💻",
    true: "⭐",
  };
  return endingEmojis[endingType] || "❓";
}

type CategoryType = 'all' | 'normal' | 'sudo' | 'kiroween' | 'kiro' | 'engineer' | 'true' | 'unlocked' | 'secrets';

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  useEffect(() => {
    loadLeaderboard();
    // Try to submit any pending scores
    retryPendingSubmissions();
  }, []);

  const retryPendingSubmissions = async () => {
    const { retryPendingSubmission } = await import("@/lib/game/leaderboard");
    const success = await retryPendingSubmission();
    if (success) {
      // Reload leaderboard if submission succeeded
      loadLeaderboard();
    }
  };

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard(50);
      setEntries(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Failed to load leaderboard. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTop = () => {
    router.push("/");
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    
    switch (activeCategory) {
      case 'all':
        // Just sort by time, no filters
        return filtered;
      case 'unlocked':
        // Sort by unlocked chars first, then by time
        return filtered.sort((a, b) => {
          const aChars = a.unlockedCharCount ?? 0;
          const bChars = b.unlockedCharCount ?? 0;
          if (bChars !== aChars) return bChars - aChars;
          return a.completionTime - b.completionTime;
        });
      case 'secrets':
        // Sort by secrets found first, then by time
        return filtered.sort((a, b) => {
          const aSecrets = a.secretsFound ?? 0;
          const bSecrets = b.secretsFound ?? 0;
          if (bSecrets !== aSecrets) return bSecrets - aSecrets;
          return a.completionTime - b.completionTime;
        });
      default:
        // Filter by ending type
        return filtered.filter(e => e.endingType === activeCategory);
    }
  };

  const filteredEntries = getFilteredEntries();

  const categories: { id: CategoryType; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🌟' },
    { id: 'normal', label: 'Normal', emoji: '🚪' },
    { id: 'sudo', label: 'Kirosh Domination', emoji: '👑' },
    { id: 'kiroween', label: 'Kiroween', emoji: '🎃' },
    { id: 'kiro', label: 'Kiro Editor', emoji: '⌨️' },
    { id: 'engineer', label: 'Engineer', emoji: '💻' },
    { id: 'true', label: 'True Ending', emoji: '⭐' },
    { id: 'unlocked', label: 'Most Unlocked', emoji: '🔓' },
    { id: 'secrets', label: 'Most Secrets', emoji: '🔍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-500 mb-2">
            🏆 Leaderboard 🏆
          </h1>
          <p className="text-gray-400 font-bold">
            Top players who escaped the cursed terminal
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBackToTop}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors duration-200"
          >
            ← Back to Top
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/50'
                  : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50 border border-purple-700/50'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadLeaderboard}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEntries.length === 0 && (
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-8 text-center">
            <p className="text-gray-400 font-bold text-lg">
              No scores in this category yet. Be the first!
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <div className="bg-black/50 border-2 border-orange-500 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-600/20 border-b-2 border-orange-500">
                    <th className="px-4 py-3 text-left text-orange-400 font-semibold">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-orange-400 font-semibold">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-orange-400 font-semibold">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-orange-400 font-semibold">
                      Ending
                    </th>
                    <th className="px-4 py-3 text-center text-orange-400 font-semibold">
                      Stats
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-purple-500/30 hover:bg-purple-900/20 transition-colors ${
                        index < 3 ? "bg-yellow-900/10" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-bold ${
                            index === 0
                              ? "text-yellow-400 text-xl"
                              : index === 1
                                ? "text-gray-300 text-lg"
                                : index === 2
                                  ? "text-orange-600 text-lg"
                                  : "text-gray-500"
                          }`}
                        >
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                      </td>

                      {/* Player Name */}
                      <td className="px-4 py-3">
                        <span className="text-orange-300 font-medium">
                          {entry.playerName}
                        </span>
                      </td>

                      {/* Completion Time */}
                      <td className="px-4 py-3">
                        <span className="text-purple-300 font-mono font-semibold">
                          {formatTime(entry.completionTime)}
                        </span>
                      </td>

                      {/* Ending Type */}
                      <td className="px-4 py-3">
                        <span className="text-gray-300">
                          {getEndingEmoji(entry.endingType)}{" "}
                          {getEndingDisplayName(entry.endingType)}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-3 justify-center text-sm">
                          {entry.unlockedCharCount !== null &&
                            entry.unlockedCharCount !== undefined && (
                              <span className="text-gray-400 font-bold">
                                🔓 {entry.unlockedCharCount}
                              </span>
                            )}
                          {entry.secretsFound !== null &&
                            entry.secretsFound !== undefined && (
                              <span className="text-gray-400 font-bold">
                                🔍 {entry.secretsFound}/6
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 font-bold">
          <p>Showing {filteredEntries.length} player{filteredEntries.length !== 1 ? 's' : ''} in {categories.find(c => c.id === activeCategory)?.label} category</p>
        </div>

        {/* Attribution Footer */}
        <footer className="mt-12 pt-6 border-t border-purple-500/30 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-gray-400">
            <div>
              <span className="text-orange-400 font-semibold">Game Design:</span>{" "}
              <a
                href="https://x.com/amixedcolor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                @amixedcolor
              </a>
              {" & "}
              <a
                href="https://x.com/ryudai_dayo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                @ryudai
              </a>
            </div>
            <span className="text-purple-500">•</span>
            <div>
              <span className="text-orange-400 font-semibold">Sound Effects:</span>{" "}
              <a
                href="https://otologic.jp/free/license.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                OtoLogic
              </a>
            </div>
            <span className="text-purple-500">•</span>
            <div>
              <span className="text-orange-400 font-semibold">Ghost Image:</span>{" "}
              <span className="text-orange-500">©DESIGNALIKIE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
