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
  takenBy: string;
  takenAt: string;
};

type WishlistMap = Record<string, WishlistItem>;

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzcMpYDM-lz_n6w3d54yqN-Wt7v4YDEop7jp-BtPHxVXd_4Nos5MFaVulKtkpoQPoru/exec";

const NAME_STORAGE_KEY = "wishlist-taken-by-name";

function getStoredName() {
  return (localStorage.getItem(NAME_STORAGE_KEY) || "").trim();
}

function ensureName(): string | null {
  const existing = getStoredName();
  if (existing) return existing;

  const name = window
    .prompt("Vpiši svoje ime (da se zabeleži izbira darila):", "")
    ?.trim();

  if (!name) return null;
  localStorage.setItem(NAME_STORAGE_KEY, name);
  return name;
}

const GiftRegistry = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [wishlistMap, setWishlistMap] = useState<WishlistMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch(`${ENDPOINT}?op=wishlist`);
      const data = await res.json();

      if (!res.ok || data?.ok !== true) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setWishlistMap(data.wishlist || {});
      setItems(data.wishlistOrdered || []);
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
    // Auto-refresh, da vsi hitro vidijo spremembe
    const t = setInterval(() => loadWishlist(true), 20000);
    return () => clearInterval(t);
  }, []);

  const toggleGift = async (id: string, nextTaken: boolean) => {
    const myName = ensureName();
    if (!myName) return;

    const current = wishlistMap[id];

    // Če je že izbrano in ni moje ime -> zaklenjeno
    if (current?.taken && current?.takenBy && current.takenBy !== myName) {
      toast.error("To darilo je že izbral nekdo drug.", {
        description: `Izbral: ${current.takenBy}`,
      });
      return;
    }

    // Optimistic UI: takoj prečrta/odprečrta
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              taken: nextTaken,
              takenBy: nextTaken ? myName : "",
              takenAt: nextTaken ? new Date().toISOString() : "",
            }
          : x
      )
    );
    setWishlistMap((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { id, name: "", url: "", takenAt: "", takenBy: "", taken: false }),
        taken: nextTaken,
        takenBy: nextTaken ? myName : "",
        takenAt: nextTaken ? new Date().toISOString() : "",
      },
    }));

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          op: "toggle",
          id,
          taken: nextTaken,
          takenBy: myName,
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
      toast.success(nextTaken ? "Darilo označeno!" : "Oznaka odstranjena.");
    } catch (err: any) {
      await loadWishlist(false);
      toast.error("Ni uspelo shraniti izbire.", {
        description: err?.message || "Poskusi še enkrat.",
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
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Seznam daril
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Darila se nalagajo iz skupnega seznama. Ko je darilo izbrano, ostane
            prečrtano, da ga drugi ne izberejo.
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
            <p className="text-center text-sm text-muted-foreground font-body">
              Nalagam seznam daril…
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground font-body">
              Trenutno ni daril v seznamu (preveri tab WISHLIST v Sheets).
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item, index) => {
                const isTaken = !!item.taken;
                const takenBy = item.takenBy || "";

                const myName = getStoredName();
                const canUncheck = isTaken && takenBy && myName && takenBy === myName;

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${
                      isTaken
                        ? "bg-muted/50 border-sage/20"
                        : "bg-background/50 border-sage-light/40 hover:border-sage/40"
                    }`}
                  >
                    <Checkbox
                      id={`gift-${item.id}`}
                      checked={isTaken}
                      disabled={isTaken && !canUncheck}
                      onCheckedChange={(v) => toggleGift(item.id, !!v)}
                      className="border-sage data-[state=checked]:bg-sage data-[state=checked]:border-sage"
                    />

                    <label
                      htmlFor={`gift-${item.id}`}
                      className={`flex-1 font-body cursor-pointer transition-all ${
                        isTaken
                          ? "line-through text-muted-foreground/60"
                          : "text-foreground"
                      }`}
                      title={isTaken && takenBy ? `Izbral: ${takenBy}` : undefined}
                    >
                      {item.name}
                      {isTaken && takenBy ? (
                        <span className="ml-2 text-xs text-muted-foreground/70">
                          (izbral: {takenBy})
                        </span>
                      ) : null}
                    </label>

                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 text-sm font-body transition-colors ${
                          isTaken ? "text-muted-foreground/40" : "text-sage hover:text-sage/80"
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground/70 mt-6 font-body"
        >
          * Seznam se osveži avtomatsko (vsakih ~20 s).
        </motion.p>
      </div>
    </section>
  );
};

export default GiftRegistry;
