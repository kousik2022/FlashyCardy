"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { CreateCardModal } from "@/components/CreateCardModal";
import { DeleteCardModal } from "@/components/DeleteCardModal";
import { EditCardModal } from "@/components/EditCardModal";
import { GenerateAIModal } from "@/components/GenerateAIModal";

interface Deck {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [deckCards, setDeckCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId) {
        setLoading(false);
        return;
      }

      try {
        const { id } = await params;
        
        // Fetch deck and cards via API
        const response = await fetch(`/api/decks/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
            return;
          }
          throw new Error('Failed to fetch deck');
        }

        const data = await response.json();
        setDeck(data.deck);
        setDeckCards(data.cards);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, userId, isLoaded]);

  const refreshCards = async () => {
    if (!deck) return;
    
    try {
      const response = await fetch(`/api/decks/${deck.id}`);
      if (!response.ok) throw new Error('Failed to refresh cards');
      
      const data = await response.json();
      setDeckCards(data.cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh cards");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <div className="text-center text-zinc-400">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!isLoaded || !userId) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <div className="text-center text-zinc-400">
          <p>Sign in to view this deck.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-zinc-300 underline">
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <div className="text-center text-red-400">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  if (!deck) {
    return null; // notFound() was called
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-start justify-center bg-linear-to-b from-black via-zinc-950 to-black px-4 py-8">
      <div className="w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          ← Back to dashboard
        </Link>

        <section className="rounded-3xl bg-white/5 px-8 py-8 text-white shadow-2xl ring-1 ring-white/10 sm:px-10 sm:py-10">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">{deck.name}</h1>
              {deck.description && (
                <p className="mt-1 text-zinc-400">{deck.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/decks/${deck.id}/study`}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white shadow-lg shadow-green-500/20 transition hover:opacity-90"
              >
                Study Session
              </Link>
              <CreateCardModal deckId={deck.id} deckName={deck.name} />
              <GenerateAIModal 
                deckId={deck.id} 
                deckName={deck.name}
                deckDescription={deck.description || ""}
                onCardsGenerated={refreshCards}
              />
            </div>
          </header>

          <p className="mt-2 text-xs text-zinc-500">
            {deckCards.length} card{deckCards.length !== 1 ? "s" : ""}
          </p>

          {deckCards.length === 0 ? (
            <p className="rounded-2xl bg-white/5 px-4 py-8 text-center text-sm text-zinc-500 ring-1 ring-white/10">
              No cards in this deck yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {deckCards.map((card, index) => {
                const gradients = [
                  "bg-linear-to-br from-indigo-500/20 to-fuchsia-500/20 ring-indigo-400/30 hover:ring-indigo-400/50",
                  "bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 ring-fuchsia-400/30 hover:ring-fuchsia-400/50",
                  "bg-linear-to-br from-cyan-500/20 to-emerald-500/20 ring-cyan-400/30 hover:ring-cyan-400/50",
                  "bg-linear-to-br from-emerald-500/20 to-lime-500/20 ring-emerald-400/30 hover:ring-emerald-400/50",
                  "bg-linear-to-br from-lime-500/20 to-yellow-500/20 ring-lime-400/30 hover:ring-lime-400/50",
                  "bg-linear-to-br from-yellow-500/20 to-orange-500/20 ring-yellow-400/30 hover:ring-yellow-400/50",
                  "bg-linear-to-br from-orange-500/20 to-red-500/20 ring-orange-400/30 hover:ring-orange-400/50",
                  "bg-linear-to-br from-red-500/20 to-pink-500/20 ring-red-400/30 hover:ring-red-400/50",
                  "bg-linear-to-br from-pink-500/20 to-purple-500/20 ring-pink-400/30 hover:ring-pink-400/50",
                  "bg-linear-to-br from-purple-500/20 to-indigo-500/20 ring-purple-400/30 hover:ring-purple-400/50",
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <li
                    key={card.id}
                    className={`rounded-2xl px-4 py-4 ring-1 transition-all hover:scale-[1.02] ${gradient}`}
                  >
                    <div className="flex gap-4">
                      <span className={`shrink-0 text-xs font-medium ${
                        index % 2 === 0 ? "text-indigo-300" : "text-fuchsia-300"
                      }`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <p className={`text-[11px] font-semibold uppercase tracking-wider ${
                            index % 2 === 0 ? "text-indigo-400" : "text-fuchsia-400"
                          }`}>
                            Front
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-100">
                            {card.front}
                          </p>
                        </div>
                        <div>
                          <p className={`text-[11px] font-semibold uppercase tracking-wider ${
                            index % 2 === 0 ? "text-cyan-400" : "text-emerald-400"
                          }`}>
                            Back
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-200">
                            {card.back}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <EditCardModal 
                          cardId={card.id}
                          cardFront={card.front}
                          cardBack={card.back}
                          deckId={deck.id}
                        />
                        <DeleteCardModal 
                          cardId={card.id} 
                          cardFront={card.front}
                          deckId={deck.id}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
