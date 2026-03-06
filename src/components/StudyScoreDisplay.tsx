"use client";

import { useState, useEffect } from "react";

interface StudyScoreDisplayProps {
  deckId: string;
}

export function StudyScoreDisplay({ deckId }: StudyScoreDisplayProps) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedScore = localStorage.getItem(`study-score-${deckId}`);
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
  }, [deckId]);

  if (score === 0) return null;

  return (
    <div className="rounded-lg bg-yellow-500/10 px-2 py-1 ring-1 ring-yellow-500/30">
      <p className="text-xs font-semibold text-yellow-400">Score: {score}</p>
    </div>
  );
}
