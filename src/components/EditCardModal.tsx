"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditCardModalProps {
  cardId: string;
  cardFront: string;
  cardBack: string;
  deckId: string;
}

export function EditCardModal({ cardId, cardFront, cardBack, deckId }: EditCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState(cardFront);
  const [back, setBack] = useState(cardBack);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front: front.trim(),
          back: back.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update card");
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating card:", error);
      alert("Failed to update card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-6 w-6 items-center justify-center rounded text-blue-400 transition hover:bg-blue-600/20 hover:text-blue-300"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-11a2 2 0 00-2-2zm0 2h6a2 2 0 002 2v2a2 2 0 002 2v-2a2 2 0 00-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-black px-8 py-8 text-white shadow-2xl ring-2 ring-gray-800 backdrop-blur">
        <h2 className="text-xl font-semibold text-zinc-100">Edit Card</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Update your flashcard content
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="front" className="block text-sm font-medium text-zinc-300">
              Front (Question/Term) *
            </label>
            <textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="e.g., Hello"
              required
            />
          </div>

          <div>
            <label htmlFor="back" className="block text-sm font-medium text-zinc-300">
              Back (Answer/Definition) *
            </label>
            <textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="e.g., Hola"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-gray-600 transition hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!front.trim() || !back.trim() || isLoading}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-950/50 transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
