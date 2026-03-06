"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateCardModalProps {
  deckId: string;
  deckName: string;
}

export function CreateCardModal({ deckId, deckName }: CreateCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          front: front.trim(),
          back: back.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create card");
      }

      const card = await response.json();
      setIsOpen(false);
      setFront("");
      setBack("");
      router.refresh();
    } catch (error) {
      console.error("Error creating card:", error);
      alert("Failed to create card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-linear-to-r from-emerald-600 via-cyan-600 to-blue-600 px-4 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90"
      >
        Add Card
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white/10 px-8 py-8 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur">
        <h2 className="text-xl font-semibold text-zinc-100">Add New Card</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Adding to: <span className="font-medium text-zinc-300">{deckName}</span>
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
              className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-white ring-1 ring-white/20 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
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
              className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-white ring-1 ring-white/20 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              placeholder="e.g., Hola"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setFront("");
                setBack("");
              }}
              className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-zinc-300 ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!front.trim() || !back.trim() || isLoading}
              className="flex-1 rounded-lg bg-linear-to-r from-emerald-600 via-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
