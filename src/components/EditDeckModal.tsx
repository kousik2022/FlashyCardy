"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditDeckModalProps {
  deckId: string;
  deckName: string;
  deckDescription: string | null;
}

export function EditDeckModal({ deckId, deckName, deckDescription }: EditDeckModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(deckName);
  const [description, setDescription] = useState(deckDescription || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update deck");
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating deck:", error);
      alert("Failed to update deck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600/20 px-3 text-xs font-medium text-blue-400 ring-1 ring-blue-400/30 transition hover:bg-blue-600/30 hover:text-blue-300"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-black px-8 py-8 text-white shadow-2xl ring-2 ring-gray-800 backdrop-blur">
        <h2 className="text-xl font-semibold text-zinc-100">Edit Deck</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Update your deck information
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Deck Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Spanish Vocabulary"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="What's this deck about?"
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
              disabled={!name.trim() || isLoading}
              className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-950/50 transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
