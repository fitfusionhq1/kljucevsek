import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwys_V8pynyeR0x4D08vc7d8tPSNTdnrn70J1yF2uKZ2RnEo6rM1uPBe_9VRkjvrPw5/exec";

type Guest = {
  token: string;
  groupName?: string;
  maxGuests?: number;
  likelyGuests?: number;
  cerkvenaInvited?: boolean;
  civilnaInvited?: boolean;
  ohcetInvited?: boolean;
};

function getTokenFromUrl(): string {
  const t1 = new URLSearchParams(window.location.search).get("t");
  if (t1) return t1.trim();

  // support hash-router style too, just in case
  const hash = window.location.hash || "";
  if (hash.includes("?")) {
    const query = hash.substring(hash.indexOf("?") + 1);
    const t2 = new URLSearchParams(query).get("t");
    if (t2) return t2.trim();
  }

  return "";
}

type EventCard = {
  key: "cerkvena" | "civilna" | "ohcet";
  title: string;
  time: string;
  place: string;
  address: string;
};

const ALL_EVENTS: EventCard[] = [
  {
    key: "cerkvena",
    title: "Cerkvena poroka",
    time: "14:00",
    place: "Cerkev Marije Pomočnice na Rakovniku",
    address: "Rakovniška ulica 6",
  },
  {
    key: "civilna",
    title: "Civilna poroka",
    time: "12:00",
    place: "Grad Rakovnik",
    address: "Rakovniška ulica 6",
  },
  {
    key: "ohcet",
    title: "Ohcet",
    time: "18.30",
    place: "Gostišče Rupnik",
    address: "Sveti Andrej 38, Skofja Loka, Slovenia",
  },
];

function gridColsClass(n: number) {
  if (n <= 1) return "grid-cols-1";
  if (n === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
}

const Card = ({ title, time, place, address }: Omit<EventCard, "key">) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="card-elegant p-8 md:p-10 rounded-sm text-center space-y-4"
  >
    <div className="w-14 h-14 mx-auto flex items-center justify-center bg-sage/10 rounded-full">
      <Calendar className="w-6 h-6 text-sage" />
    </div>

    <h3 className="font-display text-3xl text-foreground">{title}</h3>

    <div className="font-body text-foreground/90">{time}</div>
    <div className="font-body text-foreground/90">{place}</div>

    <div className="flex items-center justify-center gap-2 text-foreground/80 font-body">
      <MapPin className="w-4 h-4" />
      <span>{address}</span>
    </div>
  </motion.div>
);

const EventDetails = () => {
  const [token, setToken] = useState("");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  useEffect(() => {
    const load = async () => {
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
          throw new Error(data?.error || `HTTP ${res.status}`);
        }

        setGuest(data.guest as Guest);
      } catch {
        setGuest(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const visibleEvents = useMemo(() => {
    if (!guest) return [];

    const invited = {
      cerkvena: !!guest.cerkvenaInvited,
      civilna: !!guest.civilnaInvited,
      ohcet: !!guest.ohcetInvited,
    };

    return ALL_EVENTS.filter((e) => invited[e.key]);
  }, [guest]);

  return (
    <section className="py-20 px-6" id="details">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Podrobnosti
          </h2>
          <p className="text-body text-muted-foreground">
            Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            Nalagam podrobnosti…
          </p>
        ) : !token ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            Za prikaz podrobnosti odpri stran preko osebnega linka iz vabila.
          </p>
        ) : !guest ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            Neveljavna povezava. Preveri, da uporabljaš pravi link iz vabila.
          </p>
        ) : visibleEvents.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            Za to vabilo trenutno ni označenih delov dogodka.
          </p>
        ) : (
          <div className={`grid ${gridColsClass(visibleEvents.length)} gap-8`}>
            {visibleEvents.map((ev) => (
              <Card
                key={ev.key}
                title={ev.title}
                time={ev.time}
                place={ev.place}
                address={ev.address}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventDetails;
