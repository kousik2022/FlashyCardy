"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
  loginDates: string[];
  alreadyLoggedInToday?: boolean;
}

export function StreakDisplay() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: null,
    loginDates: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      updateStreak();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const updateStreak = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/streaks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: StreakData = await response.json();
        setStreakData(data);
      } else {
        // If POST fails, try GET to fetch existing data
        const getResponse = await fetch("/api/streaks");
        if (getResponse.ok) {
          const data: StreakData = await getResponse.json();
          setStreakData(data);
        }
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🔥";
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    return "🔥";
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak!";
    if (streak === 1) return "Great start!";
    if (streak >= 30) return "Amazing! Month-long streak!";
    if (streak >= 14) return "Two weeks! Keep it up!";
    if (streak >= 7) return "One week! You're on fire!";
    if (streak >= 3) return "3 days in a row!";
    return `${streak} days in a row!`;
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 px-6 py-4 ring-2 ring-orange-400/30">
        <div className="text-center">
          <div className="mb-2 text-4xl">⏳</div>
          <h3 className="text-xl font-bold text-zinc-100">--</h3>
          <p className="text-sm font-medium text-orange-400">Day Streak</p>
          <p className="mt-2 text-xs text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 px-6 py-4 ring-2 ring-orange-400/30">
      <div className="text-center">
        <div className="mb-2 text-4xl">
          {getStreakEmoji(streakData.currentStreak)}
        </div>
        <h3 className="text-xl font-bold text-zinc-100">
          {streakData.currentStreak}
        </h3>
        <p className="text-sm font-medium text-orange-400">
          Day Streak
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          {getStreakMessage(streakData.currentStreak)}
        </p>
        
        {streakData.alreadyLoggedInToday && (
          <div className="mt-2 rounded-lg bg-green-500/20 px-2 py-1">
            <p className="text-xs text-green-400">✓ Already logged in today</p>
          </div>
        )}
        
        {streakData.longestStreak > 0 && (
          <div className="mt-3 rounded-lg bg-black/20 px-3 py-2">
            <p className="text-xs text-zinc-400">Longest: {streakData.longestStreak} days</p>
          </div>
        )}
      </div>
    </div>
  );
}
