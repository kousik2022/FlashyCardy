"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export function DashboardSignedOut() {
  return (
    <section className="w-full rounded-3xl bg-white/5 px-8 py-12 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur sm:px-12 sm:py-14">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/90">
          Dashboard
        </p>
        <p className="max-w-md text-sm leading-6 text-zinc-200/80">
          You need to sign in to view your dashboard.
        </p>
        <SignInButton>
          <button className="inline-flex h-10 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 px-6 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90">
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
  );
}
