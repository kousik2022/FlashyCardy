import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashyCardy",
  description: "Learn faster with flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark h-screen overflow-hidden">
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex h-screen flex-col overflow-hidden`}
        >
          <header className="shrink-0 border-b border-white/10 bg-black/30 backdrop-blur z-50">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-indigo-500/70 via-fuchsia-500/60 to-cyan-500/60 ring-1 ring-white/10">
                  <span className="text-sm font-semibold text-white">FC</span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight text-white">
                    FlashyCardy
                  </div>
                  <div className="text-xs text-white/60">
                    Learn faster with flashcards
                  </div>
                </div>
              </div>

              <nav className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
