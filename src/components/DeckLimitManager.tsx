"use client";

import { useTrialTimer } from "@/contexts/TrialTimerContext";
import { CreateDeckModal } from "@/components/CreateDeckModal";
import { Crown, Plus } from "lucide-react";
import Link from "next/link";

interface DeckLimitManagerProps {
  userDecksLength: number;
  freeDeckLimit: number;
}

export function DeckLimitManager({ userDecksLength, freeDeckLimit }: DeckLimitManagerProps) {
  const { isActive, hasUnlimitedAccess } = useTrialTimer();
  const isAtLimit = !hasUnlimitedAccess && userDecksLength >= freeDeckLimit;

  // Always show during trial, regardless of deck count
  if (isActive) {
    return (
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-4 ring-1 ring-green-400/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Crown className="h-6 w-6 text-green-400" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-100">🎉 Free Trial Active</p>
              <p className="text-sm text-zinc-300">Create unlimited decks during your trial period!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreateDeckModal />
            <div className="text-xs text-green-400 font-medium">
              No Limits • {userDecksLength} decks created
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show for Pro users when they have decks
  if (hasUnlimitedAccess && userDecksLength > 0) {
    return (
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-3 ring-1 ring-green-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Crown className="h-5 w-5 text-green-400" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">Pro Plan Active</p>
              <p className="text-xs text-zinc-400">Enjoy unlimited decks with your Pro subscription</p>
            </div>
          </div>
          <CreateDeckModal />
        </div>
      </div>
    );
  }

  // Show upgrade prompt only for free users at limit
  if (isAtLimit) {
    return (
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-4 py-3 ring-1 ring-cyan-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-zinc-100">Deck limit reached</p>
              <p className="text-xs text-zinc-400">Upgrade to Pro for unlimited decks and AI features</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-indigo-600"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
