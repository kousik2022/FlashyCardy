"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-linear-to-b from-black via-zinc-950 to-black px-4">
      <div className="w-full max-w-5xl">
        <SignedOut>
          <section className="w-full rounded-3xl bg-white/5 px-8 py-12 text-white shadow-2xl ring-1 ring-white/10 sm:px-12 sm:py-14">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300/80">
                Dashboard
              </p>
              <p className="max-w-md text-sm leading-6 text-zinc-200/80">
                You need to sign in to view your dashboard.
              </p>
              <SignInButton>
                <button className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-xs font-semibold text-slate-900 shadow-sm shadow-black/30 transition hover:bg-zinc-100">
                  Sign in
                </button>
              </SignInButton>
              <Link
                href="/"
                className="text-xs font-medium text-zinc-300/80 underline-offset-4 hover:underline"
              >
                Back to home
              </Link>
            </div>
          </section>
        </SignedOut>

        <SignedIn>
          <section className="w-full rounded-3xl bg-white/5 px-8 py-12 text-white shadow-2xl ring-1 ring-white/10 sm:px-12 sm:py-14">
            <div className="flex flex-col gap-6">
              <header className="flex flex-col gap-1 text-sm text-zinc-200/90 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300/80">
                    Dashboard
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Your flashcard overview
                  </h1>
                  <p className="mt-1 text-xs text-zinc-300/80">
                    This is a placeholder dashboard. You can plug real data here
                    later.
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-full border border-white/30 px-4 text-[11px] font-medium text-zinc-100 transition hover:bg-white/10 sm:mt-0"
                >
                  Back to home
                </Link>
              </header>

              <div className="grid gap-4 text-xs text-zinc-200/90 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300/90">
                    Today&apos;s cards
                  </p>
                  <p className="mt-2 text-2xl font-semibold">0</p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Number of cards to review.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300/90">
                    Decks
                  </p>
                  <p className="mt-2 text-2xl font-semibold">0</p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    You can list decks here.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300/90">
                    Streak
                  </p>
                  <p className="mt-2 text-2xl font-semibold">0</p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Days in a row studied.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </SignedIn>
      </div>
    </main>
  );
}

