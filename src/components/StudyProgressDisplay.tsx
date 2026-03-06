"use client";

import { useState, useEffect } from "react";

interface StudyProgressDisplayProps {
  deckId: string;
  totalCards: number;
}

interface StudyProgress {
  studiedCards: number;
  lastStudied: string;
  score: number;
}

export function StudyProgressDisplay({ deckId, totalCards }: StudyProgressDisplayProps) {
  const [progress, setProgress] = useState<StudyProgress | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`study-progress-${deckId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [deckId]);

  if (!progress || progress.studiedCards === 0) {
    return null;
  }

  const progressPercentage = (progress.studiedCards / totalCards) * 100;
  const isCompleted = progress.studiedCards >= totalCards;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-400">Progress</p>
        <p className="text-xs font-semibold text-zinc-300">
          {progress.studiedCards}/{totalCards} cards
        </p>
      </div>
      
      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800">
        <div 
          className={`h-full transition-all duration-500 ${
            isCompleted 
              ? "bg-green-500" 
              : "bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-500"
          }`}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-zinc-500">
          {Math.round(progressPercentage)}% complete
        </p>
        {isCompleted && (
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] font-medium text-green-400">Complete</p>
          </div>
        )}
      </div>
      
      {progress.lastStudied && (
        <p className="text-[10px] text-zinc-600">
          Last studied: {new Date(progress.lastStudied).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
