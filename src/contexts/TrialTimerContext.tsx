"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSubscription } from "./SubscriptionContext";

interface TrialTimerContextType {
  trialStart: Date | null;
  timeRemaining: number;
  isActive: boolean;
  startTrial: () => void;
  getFormattedTime: () => string;
  hasUnlimitedAccess: boolean;
}

const TrialTimerContext = createContext<TrialTimerContextType | undefined>(undefined);

const TRIAL_DURATION_DAYS = 7;
const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export function TrialTimerProvider({ children }: { children: ReactNode }) {
  const [trialStart, setTrialStart] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const { hasUnlimitedAccess: isPro } = useSubscription();

  useEffect(() => {
    const storedTrialStart = localStorage.getItem("trialStart");
    if (storedTrialStart) {
      const startDate = new Date(storedTrialStart);
      const now = new Date();
      const elapsed = now.getTime() - startDate.getTime();
      
      if (elapsed < TRIAL_DURATION_MS) {
        setTrialStart(startDate);
        setTimeRemaining(TRIAL_DURATION_MS - elapsed);
        setIsActive(true);
      } else {
        localStorage.removeItem("trialStart");
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - trialStart!.getTime();
      const remaining = TRIAL_DURATION_MS - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsActive(false);
        localStorage.removeItem("trialStart");
        clearInterval(interval);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, trialStart]);

  const startTrial = () => {
    const now = new Date();
    setTrialStart(now);
    setTimeRemaining(TRIAL_DURATION_MS);
    setIsActive(true);
    localStorage.setItem("trialStart", now.toISOString());
  };

  const getFormattedTime = () => {
    if (timeRemaining <= 0) return "Trial expired";

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  const hasUnlimitedAccess = isActive || isPro;

  return (
    <TrialTimerContext.Provider
      value={{
        trialStart,
        timeRemaining,
        isActive,
        startTrial,
        getFormattedTime,
        hasUnlimitedAccess,
      }}
    >
      {children}
    </TrialTimerContext.Provider>
  );
}

export function useTrialTimer() {
  const context = useContext(TrialTimerContext);
  if (context === undefined) {
    throw new Error("useTrialTimer must be used within a TrialTimerProvider");
  }
  return context;
}
