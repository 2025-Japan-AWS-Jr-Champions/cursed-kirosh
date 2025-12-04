/**
 * Leaderboard service for submitting and retrieving scores
 */

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { EndingType } from "./types";
import outputs from "@/amplify_outputs.json";

// Configure Amplify for client-side usage
if (typeof window !== "undefined") {
  Amplify.configure(outputs, { ssr: true });
}

const client = generateClient<Schema>();

export interface LeaderboardSubmission {
  playerName: string;
  completionTime: number;
  endingType: EndingType;
  unlockedCharCount?: number;
  secretsFound?: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  completionTime: number;
  endingType: string;
  completedAt: string;
  unlockedCharCount?: number | null;
  secretsFound?: number | null;
}

/**
 * Submit a score to the leaderboard
 * Handles network errors gracefully and stores pending submissions locally if offline
 */
export async function submitScore(
  submission: LeaderboardSubmission,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use API Key for public write access
    await client.models.LeaderboardEntry.create(
      {
        playerName: submission.playerName,
        completionTime: submission.completionTime,
        endingType: submission.endingType,
        completedAt: new Date().toISOString(),
        unlockedCharCount: submission.unlockedCharCount,
        secretsFound: submission.secretsFound,
      },
      {
        authMode: "apiKey",
      },
    );

    // Clear any pending submissions on success
    if (typeof window !== "undefined") {
      localStorage.removeItem("pendingLeaderboardSubmission");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit score:", error);

    // Store pending submission locally for later retry
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "pendingLeaderboardSubmission",
          JSON.stringify(submission),
        );
      } catch (storageError) {
        console.error("Failed to store pending submission:", storageError);
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit score",
    };
  }
}

/**
 * Retry submitting a pending score from localStorage
 */
export async function retryPendingSubmission(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const pendingData = localStorage.getItem("pendingLeaderboardSubmission");
    if (!pendingData) return false;

    const submission: LeaderboardSubmission = JSON.parse(pendingData);
    const result = await submitScore(submission);

    return result.success;
  } catch (error) {
    console.error("Failed to retry pending submission:", error);
    return false;
  }
}

/**
 * Get top leaderboard entries sorted by completion time
 */
export async function getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  try {
    // Use API Key for public read access
    const { data, errors } = await client.models.LeaderboardEntry.list({
      authMode: "apiKey",
    });

    if (errors) {
      console.error("Errors fetching leaderboard:", errors);
      return [];
    }

    if (!data) return [];

    // Sort by completion time (ascending - fastest first)
    const sorted = [...data].sort(
      (a, b) => a.completionTime - b.completionTime,
    );

    // Return top entries
    return sorted.slice(0, limit) as LeaderboardEntry[];
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}

/**
 * Check if there's a pending submission in localStorage
 */
export function hasPendingSubmission(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("pendingLeaderboardSubmission") !== null;
}
