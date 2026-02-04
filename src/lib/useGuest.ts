import { useEffect, useMemo, useState } from "react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxymiLpPqYbhq8D3XeMHIxBRuqWLwaNs-1e--0xbzHtndFlCLOwRnSR0jmkq0RqYvGY/exec"; // isti kot RSVP/Gifts

export type Guest = {
  token: string;
  ime: string;
  priimek: string;
  civilnaInvited: boolean;
  ohcetInvited: boolean;
  invitedLabel: string;
};

function getTokenFromUrl(): string {
  const t1 = new URLSearchParams(window.location.search).get("t");
  if (t1) return t1.trim();

  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  if (qIndex >= 0) {
    const q = hash.slice(qIndex + 1);
    const t2 = new URLSearchParams(q).get("t");
    if (t2) return t2.trim();
  }

  return "";
}

export function useGuest() {
  const token = useMemo(() => getTokenFromUrl(), []);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (!token) {
          setGuest(null);
          return;
        }
        const res = await fetch(`${ENDPOINT}?op=guest&t=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok || data?.ok !== true) throw new Error(data?.error || `HTTP ${res.status}`);
        setGuest(data.guest as Guest);
      } catch {
        setGuest(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  return { token, guest, loading };
}
