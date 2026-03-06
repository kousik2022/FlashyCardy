"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Fragment } from "react";

const FREE_DECK_LIMIT = 999999; // Set to very high number for unlimited decks

export function CreateDeckModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deckCount, setDeckCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchDeckCount();
    }
  }, [userId]);

  // Refetch deck count when window gains focus (user returns from deleting deck)
  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        fetchDeckCount();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId]);

  // Refetch deck count periodically (every 30 seconds) to keep it in sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchDeckCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  // Listen for deck deletion events
  useEffect(() => {
    const handleDeckDeleted = () => {
      if (userId) {
        fetchDeckCount();
      }
    };

    window.addEventListener('deckDeleted', handleDeckDeleted);
    return () => window.removeEventListener('deckDeleted', handleDeckDeleted);
  }, [userId]);

  const fetchDeckCount = async () => {
    try {
      setIsCheckingLimit(true);
      const response = await fetch("/api/decks/count");
      if (response.ok) {
        const data = await response.json();
        setDeckCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching deck count:", error);
    } finally {
      setIsCheckingLimit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please fill in both deck name and description.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deck");
      }

      const deck = await response.json();
      setIsOpen(false);
      setName("");
      setDescription("");
      setDeckCount(prev => prev + 1); // Update local count
      router.refresh();
    } catch (error) {
      console.error("Error creating deck:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create deck. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {!isOpen ? (
        (() => {
          const isLimitReached = deckCount >= FREE_DECK_LIMIT;
          
          if (isCheckingLimit) {
            return (
              <button
                disabled
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-600 px-6 text-sm font-semibold text-white/50 cursor-not-allowed"
              >
                Loading...
              </button>
            );
          }

          // Always show create button for unlimited decks
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
              >
                Create New Deck
              </button>
            </div>
          );
        })()
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-black px-8 py-8 text-white shadow-2xl ring-2 ring-gray-800 backdrop-blur">
            <h2 className="text-xl font-semibold text-zinc-100">Create New Deck</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Start by giving your deck a name and description
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
                  className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g., Spanish Vocabulary"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-lg bg-gray-900 px-3 py-2 text-white ring-1 ring-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  placeholder="What's this deck about? Provide details for AI card generation..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setName("");
                    setDescription("");
                  }}
                  className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-gray-600 transition hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !description.trim() || isLoading}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-950/50 transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Deck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* No upgrade modal needed for unlimited decks */}
    </Fragment>
  );
}
