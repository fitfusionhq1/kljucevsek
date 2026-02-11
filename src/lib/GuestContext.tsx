// src/lib/GuestContext.tsx
import React, { createContext, useContext } from "react";
import { useGuest, type Guest } from "@/lib/useGuest";

type GuestContextValue = {
  guest: Guest | null;
  loading: boolean;
  token: string;
};

const GuestContext = createContext<GuestContextValue | null>(null);

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const { guest, loading, token } = useGuest();

  return (
    <GuestContext.Provider value={{ guest, loading, token }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuestContext() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuestContext must be used inside GuestProvider");
  return ctx;
}
