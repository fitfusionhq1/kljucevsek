import { useEffect, useState } from "react";
import { Home, CheckCircle2, MapPin, Images, Gift, Settings } from "lucide-react";

type NavItem = {
  id: string;          // target section id
  label: string;
  Icon: any;
};

const items: NavItem[] = [
  { id: "top", label: "Domov", Icon: Home },
  { id: "rsvp", label: "RSVP", Icon: CheckCircle2 },
  { id: "details", label: "Podrobnosti", Icon: MapPin },
  { id: "gallery", label: "Galerija", Icon: Images },
  { id: "gifts", label: "Darila", Icon: Gift },
  // če želiš še nastavitev/jezik/… kasneje:
  // { id: "settings", label: "Nastavitve", Icon: Settings },
];

function scrollToId(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function IconNav() {
  const [active, setActive] = useState<string>("top");

  // preprost “active section” tracker
  useEffect(() => {
    const handler = () => {
      const candidates = items
        .filter((x) => x.id !== "top")
        .map((x) => ({ id: x.id, el: document.getElementById(x.id) }))
        .filter((x) => x.el) as { id: string; el: HTMLElement }[];

      const y = window.scrollY + 140; // offset zaradi headerja
      let current = "top";

      for (const c of candidates) {
        if (c.el.offsetTop <= y) current = c.id;
      }
      setActive(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl px-3 py-2">
        <div className="flex items-center gap-2">
          {items.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToId(id)}
                aria-label={label}
                title={label}
                className={[
                  "relative grid place-items-center rounded-full transition-all",
                  "h-11 w-11",
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-white/80" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
