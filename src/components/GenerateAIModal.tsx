"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateAIModalProps {
  deckId: string;
  deckName: string;
  deckDescription: string;
  onCardsGenerated: () => void;
}

export function GenerateAIModal({ deckId, deckName, deckDescription, onCardsGenerated }: GenerateAIModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please specify a topic for card generation");
      return;
    }

    if (cardCount < 1 || cardCount > 50) {
      setError("Number of cards must be between 1 and 50");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          deckId,
          topic: topic.trim(),
          cardCount,
          deckName,
          deckDescription
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cards");
      }

      setIsOpen(false);
      setTopic("");
      setCardCount(10);
      onCardsGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 via-pink-600 to-red-600 px-4 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90"
      >
        <Sparkles className="h-3 w-3" />
        Generate with AI
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">
            Generate AI Cards
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Create flashcards for "{deckName}" using AI
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-zinc-300 mb-2">
              Topic/Description *
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
              placeholder="e.g., 'Bengali to English translations', 'IPL history', 'Physics formulas', 'French vocabulary'"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Be specific about what you want to learn (e.g., language pairs, historical events, formulas, etc.)
            </p>
          </div>

          <div>
            <label htmlFor="cardCount" className="block text-sm font-medium text-zinc-300 mb-2">
              Number of Cards: {cardCount}
            </label>
            <input
              type="range"
              id="cardCount"
              min="1"
              max="50"
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setIsOpen(false);
              setTopic("");
              setCardCount(10);
              setError(null);
            }}
            disabled={isGenerating}
            className="flex-1 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 via-pink-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate {cardCount} Cards
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
