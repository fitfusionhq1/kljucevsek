import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Gift } from "lucide-react";
import { toast } from "sonner";

type WishlistItem = {
  id: string;
  name: string;
  url: string;
  taken: boolean;
  takenBy: string; // tukaj bo anon "guestId"
};

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzcMpYDM-lz_n6w3d54yqN-Wt7v4YDEop7jp-BtPHxVXd_4Nos5MFaVulKtkpoQPoru/exec";

const GUEST_ID_KEY = "wedding-guest-id";

function getOrCreateGuestId(): string {
  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) return existing;

  // enostaven anon id (dovolj za ta namen)
  const id =
    (crypto?.randomUUID?.() ||
      `gid_${Math.random().toString(16).slice(2)}_${Date.now()}`);

  localStorage.setItem(GUEST_ID_KEY, id);
  return id;
}

const GiftRegistry = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const guestId = getOrCreateGuestId();

  const loadWishlist = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch(`${ENDPOINT}?op=wishlist`);
      const data = await res.json();

      if (!res.ok || data?.ok !== true) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setItems(
        (data.wishlistOrdered || []).map((x: any) => ({
          id: String(x.id),
          name: String(x.name || ""),
          url: String(x.url || ""),
          taken: !!x.taken,
          takenBy: String(x.takenBy || ""),
        }))
      );
    } catch (err: any) {
      toast.error("Ne morem prebrati seznama daril.", {
        description: err?.message || "Poskusi osvežiti stran.",
      });
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist(false);
    const t = setInterval(() => loadWishlist(true), 20000);
    return () => clearInterval(t);
  }, []);

  const setGiftTaken = async (id: string, nextTaken: boolean) => {
    // optimistic update
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, taken: nextTaken, takenBy: nextTaken ? guestId : "" }
          : x
      )
    );

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          op: "toggle",
          id,
          taken: nextTaken,
          takenBy: nextTaken ? guestId : "", // če odznačiš, sprazni
        }),
      });

      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {}

      if (!res.ok || (parsed && parsed.ok === false)) {
        throw new Error(parsed?.error || `HTTP ${res.status}`);
      }

      await loadWishlist(true);
      toast.success(nextTaken ? "Darilo označeno." : "Darilo odznačeno.");
    } catch (err: any) {
      await loadWishlist(false);
      toast.error("Ni uspelo shraniti spremembe.", {
        description: err?.message || "Poskusi znova.",
      });
    }
  };

  return (
    <section className="py-20 px-6" id="gifts">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-sage/10 rounded-full">
            <Gift className="w-8 h-8 text-sage" />
          </div>
          <h2 className="heading-display text-4xl md:text-5xl mb-4">
            Seznam daril
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Ko izbereš darilo, se prečrta. Odznačiti ga lahko samo ista naprava,
            ki ga je označila.
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-elegant p-6 md:p-8 rounded-sm"
        >
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Nalagam seznam daril…
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Trenutno ni daril v seznamu (preveri tab WISHLIST v Sheets).
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item, index) => {
                const isMine = item.taken && item.takenBy === guestId;
                const locked = item.taken && !isMine;

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${
                      item.taken
                        ? "bg-muted/50 border-sage/20"
                        : "bg-background/50 border-sage-light/40 hover:border-sage/40"
                    }`}
                  >
                    <Checkbox
                      checked={item.taken}
                      disabled={locked}
                      onCheckedChange={(v) => setGiftTaken(item.id, !!v)}
                      className="border-sage data-[state=checked]:bg-sage data-[state=checked]:border-sage"
                    />

                    <span
                      className={`flex-1 font-body ${
                        item.taken ? "line-through text-muted-foreground/60" : ""
                      }`}
                      title={
                        locked
                          ? "Darilo je že izbrano."
                          : item.taken
                          ? "Klikni za odznačiti."
                          : "Klikni za označiti."
                      }
                    >
                      {item.name}
                      {isMine ? (
                        <span className="ml-2 text-xs text-muted-foreground/70">
                          (tvoja izbira)
                        </span>
                      ) : null}
                    </span>

                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-sm ${
                          item.taken
                            ? "text-muted-foreground/40"
                            : "text-sage hover:text-sage/80"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Povezava</span>
                      </a>
                    ) : null}
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GiftRegistry;
