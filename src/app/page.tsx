"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-linear-to-b from-black via-zinc-950 to-black px-4">
      <div className="w-full max-w-5xl">
        <SignedOut>
          <section className="relative w-full overflow-hidden rounded-3xl bg-white/5 px-8 py-12 text-white shadow-2xl ring-1 ring-white/10 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.85)_0,transparent_60%)]" />
              <div className="absolute -top-20 left-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="absolute bottom-[-40px] right-[-40px] h-40 w-40 rounded-full bg-cyan-400/25 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center justify-center gap-6 text-center">
              <div className="h-1 w-20 rounded-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" />

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300/80">
                  GREETING
                </p>
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  WELCOME TO{" "}
                  <span className="bg-linear-to-r from-indigo-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                    YOUR STUDY SPACE
                  </span>
                </h1>
                <p className="mx-auto max-w-xl text-sm leading-6 text-zinc-200/80">
                  A clean starting screen where you can sign in, sign up, and
                  jump straight into building flashcard decks.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <SignUpButton mode="modal">
                    <button className="inline-flex h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-900 shadow-sm shadow-black/30 transition hover:bg-zinc-100">
                      Get started
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 bg-transparent px-8 text-sm font-semibold text-zinc-100 transition hover:bg-white/10">
                      Sign in
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </section>
        </SignedOut>

        <SignedIn>
          <section className="w-full rounded-3xl bg-white/5 px-8 py-12 text-white shadow-2xl ring-1 ring-white/10 sm:px-12 sm:py-14">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300/80">
                Dashboard
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back to your decks
              </h2>
              <p className="max-w-md text-sm leading-6 text-zinc-200/80">
                You’re signed in. Soon this will show your recent decks and
                study stats.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <UserButton />
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/40 bg-transparent px-5 text-xs font-semibold text-zinc-100 transition hover:bg-white/10"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
          </section>
        </SignedIn>
      </div>
    </main>
  );
}
