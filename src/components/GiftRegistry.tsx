import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Gift, ChevronDown } from "lucide-react";
import {
  Home,
  Utensils,
  Plane,
  Baby,
  Shirt,
  Sofa,
  Sparkles,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import { TEXTS } from "@/content/texts";
import { Button } from "@/components/ui/button";

type WishlistItem = {
  id: string;
  name: string;
  url: string;
  taken: boolean;
  takenBy: string;
  category?: string;
};

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzGhuAmP-CWj16mgWMKwmTte602VXsBq527D3LTN3hPIEIIKJZ5KelGqb1hi38dac5e/exec";

const GUEST_ID_KEY = "wedding-guest-id";

function getOrCreateGuestId(): string {
  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) return existing;
  const id =
    crypto?.randomUUID?.() ||
    `gid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  localStorage.setItem(GUEST_ID_KEY, id);
  return id;
}

function normalizeCategory(v: unknown): string {
  const s = String(v ?? "").trim();
  return s ? s : "Ostalo";
}

// Ikone po kategoriji (heuristika po imenu)
function iconForCategory(name: string) {
  const n = name.toLowerCase();

  if (n.includes("dom") || n.includes("hiša") || n.includes("his")) return Home;
  if (n.includes("kuhin") || n.includes("posod") || n.includes("krož"))
    return Utensils;
  if (n.includes("potov") || n.includes("dopust") || n.includes("honeymoon"))
    return Plane;
  if (n.includes("otrok") || n.includes("baby") || n.includes("dojen"))
    return Baby;
  if (n.includes("oble") || n.includes("teksti") || n.includes("moda"))
    return Shirt;
  if (n.includes("pohi") || n.includes("kavč") || n.includes("soba"))
    return Sofa;
  if (n.includes("spom") || n.includes("poseb") || n.includes("izkuš"))
    return Sparkles;

  return Package; // default
}

export default function GiftRegistry() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // glavni collapse
  const [isOpen, setIsOpen] = useState(false);

  // katera kategorija je izbrana
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const guestId = getOrCreateGuestId();

  const listTopRef = useRef<HTMLDivElement | null>(null);

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
          category: normalizeCategory(x.category),
        }))
      );
    } catch (err: any) {
      toast.error(TEXTS.gifts.readErrorTitle, {
        description: err?.message || TEXTS.gifts.readErrorDesc,
      });
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist(false);
    const t = setInterval(() => loadWishlist(true), 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGiftTaken = async (id: string, nextTaken: boolean) => {
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
          takenBy: nextTaken ? guestId : "",
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
      toast.success(nextTaken ? TEXTS.gifts.marked : TEXTS.gifts.unmarked);
    } catch (err: any) {
      await loadWishlist(false);
      toast.error(TEXTS.gifts.saveErrorTitle, {
        description: err?.message || TEXTS.gifts.saveErrorDesc,
      });
    }
  };

  // grupiranje po kategorijah
  const grouped = useMemo(() => {
    const m = new Map<string, WishlistItem[]>();
    for (const it of items) {
      const cat = normalizeCategory(it.category);
      if (!m.has(cat)) m.set(cat, []);
      m.get(cat)!.push(it);
    }

    const arr = Array.from(m.entries()).map(([category, list]) => ({
      category,
      list,
      count: list.length,
    }));

    // sort: po A-Z (lahko spremeniva na ročni vrstni red)
    arr.sort((a, b) => a.category.localeCompare(b.category));
    return arr;
  }, [items]);

  // ko odpreš seznam prvič, izberi prvo kategorijo
  useEffect(() => {
    if (isOpen && !activeCategory && grouped.length > 0) {
      setActiveCategory(grouped[0].category);
    }
  }, [isOpen, activeCategory, grouped]);

  const activeList = useMemo(() => {
    if (!activeCategory) return [];
    const found = grouped.find((g) => g.category === activeCategory);
    return found ? found.list : [];
  }, [grouped, activeCategory]);

  function openCategory(cat: string) {
    setActiveCategory(cat);

    // nežno scroll do začetka seznama (tako ne rabiš gor scrollat)
    setTimeout(() => {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <section className="py-20 px-6" id="gifts">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-sage/10 rounded-full">
            <Gift className="w-8 h-8 text-sage" />
          </div>

          <h2 className="heading-display text-4xl md:text-5xl mb-4">
            {TEXTS.sections.giftsTitle}
          </h2>

          <p className="text-body text-muted-foreground max-w-xl mx-auto whitespace-pre-line">
            {TEXTS.sections.giftsSubtitle.giftsSubtitleLine1}
            <br />
            {TEXTS.sections.giftsSubtitle.giftsSubtitleLine2}
            <br />
            {TEXTS.sections.giftsSubtitle.giftsSubtitleLine3}
            <br />
            {TEXTS.sections.giftsSubtitle.giftsSubtitleLine4}
            <br />
            {TEXTS.sections.giftsSubtitle.giftsSubtitleLine5}
          </p>

          <div className="divider-ornament mt-6" />
        </motion.div>

        {/* Collapse button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen((v) => !v)}
            className="uppercase tracking-widest"
          >
            <span className="mr-2">
              {isOpen ? TEXTS.gifts.hideList : TEXTS.gifts.showList}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="gift-content"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="card-elegant p-6 md:p-8 rounded-sm space-y-5">
                {isLoading ? (
                  <p className="text-center text-sm text-muted-foreground">
                    {TEXTS.gifts.loading}
                  </p>
                ) : items.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    {TEXTS.gifts.empty}
                  </p>
                ) : (
                  <>
                    {/* anchor za scroll */}
                    <div ref={listTopRef} />

                    {/* ✅ Sticky icon nav */}
                    <div className="sticky top-3 z-10">
                      <div className="mx-auto max-w-2xl rounded-full border bg-background/70 backdrop-blur px-3 py-2 shadow-sm">
                        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                          {grouped.map((g) => {
                            const Icon = iconForCategory(g.category);
                            const isActive = g.category === activeCategory;

                            return (
                              <button
                                key={g.category}
                                type="button"
                                onClick={() => openCategory(g.category)}
                                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition
                                  ${
                                    isActive
                                      ? "bg-sage/20 text-foreground"
                                      : "text-foreground/70 hover:bg-sage/10"
                                  }
                                `}
                                title={g.category}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  {g.category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({g.list.length})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ✅ Active category list only (no huge scroll) */}
                    <div className="pt-2">
                      <div className="text-center mb-4">
                        <div className="font-display text-xl md:text-2xl">
                          {activeCategory}
                        </div>
                      </div>

                      <ul className="space-y-4">
                        {activeList.map((item, index) => {
                          const isMine = item.taken && item.takenBy === guestId;
                          const locked = item.taken && !isMine;

                          return (
                            <motion.li
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.25,
                                delay: index * 0.02,
                              }}
                              className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${
                                item.taken
                                  ? "bg-muted/50 border-sage/20"
                                  : "bg-background/50 border-sage-light/40 hover:border-sage/40"
                              }`}
                            >
                              <Checkbox
                                checked={item.taken}
                                disabled={locked}
                                onCheckedChange={(v) =>
                                  setGiftTaken(item.id, !!v)
                                }
                                className="border-sage data-[state=checked]:bg-sage data-[state=checked]:border-sage"
                              />

                              <span
                                className={`flex-1 font-body ${
                                  item.taken
                                    ? "line-through text-muted-foreground/60"
                                    : ""
                                }`}
                                title={
                                  locked
                                    ? TEXTS.gifts.tooltipTaken
                                    : item.taken
                                    ? TEXTS.gifts.tooltipUnmark
                                    : TEXTS.gifts.tooltipMark
                                }
                              >
                                {item.name}
                                {isMine ? (
                                  <span className="ml-2 text-xs text-muted-foreground/70">
                                    {TEXTS.gifts.mineTag}
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
                                  <span className="hidden sm:inline">
                                    {TEXTS.gifts.linkLabel}
                                  </span>
                                </a>
                              ) : null}
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
