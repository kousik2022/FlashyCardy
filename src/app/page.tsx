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
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Flashy-Cardy
        </h1>
        <p className="text-lg text-zinc-500 sm:text-xl">
          Your personal flashcard platform
        </p>

        <SignedOut>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <SignInButton mode="modal">
              <button className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="inline-flex h-11 items-center justify-center rounded-lg bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="mt-6 flex items-center gap-3">
            <UserButton />
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Go to dashboard
            </Link>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
