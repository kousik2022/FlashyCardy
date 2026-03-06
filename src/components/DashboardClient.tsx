"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { CreateDeckModal } from "@/components/CreateDeckModal";
import { DeleteDeckModal } from "@/components/DeleteDeckModal";
import { EditDeckModal } from "@/components/EditDeckModal";
import { StudyProgressDisplay } from "@/components/StudyProgressDisplay";

interface DashboardClientProps {
  userId: string;
  userDecks: any[];
  cardCountsMap: Record<string, number>;
  totalCards: number;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function DashboardClient({ userId, userDecks, cardCountsMap, totalCards }: DashboardClientProps) {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center bg-linear-to-b from-indigo-950/30 via-zinc-950 to-cyan-950/30 px-4">
      <div className="w-full max-w-5xl">
        <section className="w-full rounded-3xl bg-white/5 px-8 py-12 pb-20 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur sm:px-12 sm:py-14 sm:pb-24">
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-1 text-sm text-zinc-200/90 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/90">
                  Dashboard
                </p>
                <h1 className="mt-1 bg-linear-to-r from-indigo-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                  Your flashcard overview
                </h1>
                <p className="mt-1 text-xs text-zinc-300/80">
                  Your decks and cards, ready to study.
                </p>
              </div>
            </header>

            <div className="grid gap-4 text-xs text-zinc-200/90 sm:grid-cols-2">
              <div className="rounded-2xl bg-indigo-500/10 px-4 py-3 ring-1 ring-indigo-400/30">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  Total cards
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-100">
                  {totalCards}
                </p>
              </div>
              <div className="rounded-2xl bg-fuchsia-500/10 px-4 py-3 ring-1 ring-fuchsia-400/30">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                  Total decks
                </p>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-zinc-100">
                    {userDecks.length}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                  Your decks
                </h2>
                <div className="flex gap-2">
                  <CreateDeckModal />
                </div>
              </div>
              
              {userDecks.length === 0 ? (
                <p className="rounded-2xl bg-white/5 px-4 py-6 text-center text-xs text-zinc-400 ring-1 ring-white/10">
                  No decks yet. Create your first deck to get started.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {userDecks.map((deck, i) => {
                    const accents = [
                    "bg-linear-to-br from-indigo-500/20 to-fuchsia-500/20 ring-indigo-400/20 hover:ring-indigo-400/40",
                      "bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 ring-fuchsia-400/20 hover:ring-fuchsia-400/40",
                    ];
                    const accent = accents[i % accents.length];
                    return (
                    <li key={deck.id}>
                      <div className={`block rounded-2xl px-4 py-3 ring-1 transition ${accent}`}>
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/decks/${deck.id}`}
                            className="min-w-0 flex-1"
                          >
                            <p className="font-medium text-zinc-100">{deck.name}</p>
                            {deck.description && (
                              <p className="mt-1 text-[11px] text-zinc-400 line-clamp-1">
                                {deck.description}
                              </p>
                            )}
                            <p className="mt-2 text-[11px] text-zinc-500">
                              {cardCountsMap[deck.id] ?? 0} cards
                            </p>
                            <p className="mt-1 text-[10px] text-zinc-600">
                              Created {formatDate(deck.createdAt)}
                            </p>
                          </Link>
                          <div className="flex flex-col gap-2">
                            <StudyProgressDisplay 
                              deckId={deck.id} 
                              totalCards={cardCountsMap[deck.id] ?? 0} 
                            />
                            <div className="flex gap-2">
                              <EditDeckModal 
                                deckId={deck.id}
                                deckName={deck.name}
                                deckDescription={deck.description}
                              />
                              <DeleteDeckModal 
                                deckId={deck.id} 
                                deckName={deck.name} 
                                cardCount={cardCountsMap[deck.id] ?? 0} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
