import { useEffect, useMemo, useState } from "react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbw831bYeeoXiHa2h_dyS6Yj06e2Ge-s11ade-QxgEREW8tiO-6GFV3Jt0oPsozNXfIg/exec";

export type Guest = {
  token: string;
  groupName: string;     // iz stolpca "Gost"
  displayName: string;   // alias (isto kot groupName)
  maxGuests: number;
  likelyGuests: number;
  cerkvenaInvited: boolean;
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

        const res = await fetch(
          `${ENDPOINT}?op=guest&t=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok || data?.ok !== true) {
          throw new Error(data?.error || "Guest lookup failed");
        }

        setGuest(data.guest as Guest);
      } catch (err) {
        console.error("useGuest error:", err);
        setGuest(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  return { token, guest, loading };
}
