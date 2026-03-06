"use client";

import { useTrialTimer } from "@/contexts/TrialTimerContext";
import { Clock, Crown } from "lucide-react";

export function TrialTimer() {
  const { isActive, getFormattedTime } = useTrialTimer();

  if (!isActive) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-4 py-3 ring-1 ring-cyan-400/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Crown className="h-5 w-5 text-cyan-400" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">Free Trial Active</p>
            <p className="text-xs text-zinc-400">{getFormattedTime()} remaining</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-cyan-400">
          <Clock className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
