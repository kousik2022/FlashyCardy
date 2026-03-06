"use client";

import { useTrialTimer } from "@/contexts/TrialTimerContext";

interface DeckCountDisplayProps {
  userDecksLength: number;
  freeDeckLimit: number;
  isNearLimit: boolean;
  deckUsagePercentage: number;
}

export function DeckCountDisplay({ 
  userDecksLength, 
  freeDeckLimit, 
  isNearLimit, 
  deckUsagePercentage 
}: DeckCountDisplayProps) {
  const { hasUnlimitedAccess, isActive } = useTrialTimer();

  return (
    <div className="rounded-2xl bg-fuchsia-500/10 px-4 py-3 ring-1 ring-fuchsia-400/30">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
        Total decks
      </p>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-zinc-100">
          {hasUnlimitedAccess ? `${userDecksLength}/∞` : `${userDecksLength}/${freeDeckLimit}`}
        </p>
        {!hasUnlimitedAccess && (
          <>
            <div className="mt-2 w-full bg-fuchsia-900/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isNearLimit ? 'bg-orange-500' : 'bg-fuchsia-500'
                }`}
                style={{ width: `${deckUsagePercentage}%` }}
              />
            </div>
            <p className={`mt-1 text-[10px] ${
              isNearLimit ? 'text-orange-400' : 'text-fuchsia-300/80'
            }`}>
              {userDecksLength >= freeDeckLimit 
                ? "Deck limit reached"
                : `${freeDeckLimit - userDecksLength} deck${freeDeckLimit - userDecksLength !== 1 ? 's' : ''} remaining`}
            </p>
          </>
        )}
        {hasUnlimitedAccess && (
          <p className="mt-1 text-[10px] text-green-400">
            {isActive ? "Unlimited decks during trial" : "Unlimited decks with Pro"}
          </p>
        )}
      </div>
    </div>
  );
}
