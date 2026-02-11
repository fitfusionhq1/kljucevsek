// src/components/EventDetails.tsx

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { TEXTS } from "@/content/texts";
import { useGuestContext } from "@/lib/GuestContext";

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
    address: "Sveti Andrej 38, Škofja Loka, Slovenia",
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

export default function EventDetails() {
  const { guest, loading, token } = useGuestContext();

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
    <section className="py-20 px-6" id="gifts">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            {TEXTS.sections.detailsTitle}
          </h2>
          <p className="text-body text-muted-foreground">
            {TEXTS.sections.detailsSubtitle}
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            {TEXTS.sections.loadingInvite}
          </p>
        ) : !token ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            {TEXTS.sections.invalidLink}
          </p>
        ) : !guest ? (
          <p className="text-center text-sm text-muted-foreground font-body">
            {TEXTS.sections.invalidLink}
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
}
