"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteDeckModalProps {
  deckId: string;
  deckName: string;
  cardCount: number;
}

export function DeleteDeckModal({ deckId, deckName, cardCount }: DeleteDeckModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete deck");
      }

      setIsOpen(false);
      
      // Dispatch event to notify other components that a deck was deleted
      window.dispatchEvent(new CustomEvent('deckDeleted'));
      
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting deck:", error);
      alert("Failed to delete deck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center justify-center rounded-lg bg-red-600/20 px-3 text-xs font-medium text-red-400 ring-1 ring-red-400/30 transition hover:bg-red-600/30 hover:text-red-300"
      >
        Delete Deck
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-gray-800 px-8 py-8 text-white shadow-2xl ring-2 ring-gray-600 backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 ring-2 ring-gray-500">
            <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-zinc-100">Delete Deck</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Are you sure you want to delete <span className="font-medium text-zinc-300">"{deckName}"</span>?
          </p>
          <p className="mt-1 text-xs text-gray-400">
            This will permanently delete {cardCount} card{cardCount !== 1 ? "s" : ""} and cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 ring-1 ring-gray-500 transition hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-950/50 transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : "Delete Deck"}
          </button>
        </div>
      </div>
    </div>
  );
}
