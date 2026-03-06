"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SubscriptionContextType {
  isPro: boolean;
  hasUnlimitedAccess: boolean;
  setProStatus: (isPro: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    const storedProStatus = localStorage.getItem("isPro");
    if (storedProStatus) {
      setIsPro(storedProStatus === "true");
    }
  }, []);

  const setProStatus = (proStatus: boolean) => {
    setIsPro(proStatus);
    localStorage.setItem("isPro", proStatus.toString());
  };

  const hasUnlimitedAccess = isPro;

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        hasUnlimitedAccess,
        setProStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
