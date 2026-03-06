"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  currentUsage: number;
}

export function UpgradeModal({ isOpen, onClose, currentLimit, currentUsage }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsLoading(true);
    // In a real app, this would redirect to payment processing
    window.location.href = "/pricing";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-8 text-white shadow-2xl ring-2 ring-gray-600 backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 ring-4 ring-cyan-400/20">
            <Crown className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-zinc-100">Upgrade to Pro</h2>
          <p className="mt-2 text-sm text-zinc-400">
            You've reached your limit of {currentLimit} decks ({currentUsage}/{currentLimit})
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Unlock unlimited decks and powerful AI features
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-4 ring-1 ring-cyan-400/20">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">Pro Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">Unlimited decks</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">Unlimited flashcards</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">AI-powered card generation</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">Advanced study algorithms</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">Spaced repetition</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-zinc-300">Export to PDF</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-gray-800/50 p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-300">Pro Plan</span>
              <span className="text-lg font-bold text-zinc-100">$9.99<span className="text-xs text-zinc-400">/month</span></span>
            </div>
            <p className="text-xs text-zinc-500">14-day free trial • Cancel anytime</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-sm font-medium text-gray-200 ring-1 ring-gray-500 transition hover:bg-gray-600"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </span>
            ) : (
              "Upgrade Now"
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link 
            href="/pricing" 
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            onClick={onClose}
          >
            View all pricing plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
