import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
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
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="h-10 rounded-full px-4 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/5 hover:text-white">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="h-10 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90">
                      Sign up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
