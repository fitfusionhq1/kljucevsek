import React, { createContext, useContext } from "react";
import { useGuest, type Guest } from "@/lib/useGuest";

type GuestContextValue = {
  guest: Guest | null;
  loading: boolean;
  token: string;
};

const GuestContext = createContext<GuestContextValue>({
  guest: null,
  loading: true,
  token: "",
});

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
  const { guest, loading, token } = useGuest();
  return (
    <GuestContext.Provider value={{ guest, loading, token }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuestContext = () => useContext(GuestContext);
