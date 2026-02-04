import { useGuest } from "@/lib/useGuest";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";
import floralDivider from "@/assets/floral-divider.png";

const EventDetails = () => {
  const { guest, loading } = useGuest();

  const hasToken = !!guest;

  const events = [
    {
      key: "civilna",
      title: "Civilni obred",
      time: "12:00",
      venue: "Grad Rakovnik",
      address: "Rakovniška ulica 6",
      icon: Calendar,
      visible: hasToken && guest?.civilnaInvited === true,
    },
    {
      key: "cerkvena",
      title: "Cerkvena poroka",
      time: "14:00",
      venue: "Cerkev Marije Pomočnice na Rakovniku",
      address: "Rakovniška ulica 6",
      icon: Calendar,
      visible: true, // vedno
    },
    {
      key: "ohcet",
      title: "Ohcet",
      time: "18:30",
      venue: "Gostišče Rupar",
      address: "Škofja Loka",
      icon: Clock,
      visible: hasToken && guest?.ohcetInvited === true,
    },
  ].filter((e) => e.visible);

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <img
            src={floralDivider}
            alt="Floral divider"
            className="w-48 md:w-64 mx-auto mb-8 opacity-80"
          />
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Podrobnosti
          </h2>

          {loading && (
            <p className="text-sm text-muted-foreground font-body mt-2">
              Nalagam tvoje vabilo…
            </p>
          )}

          <div className="divider-ornament mt-4" />
        </motion.div>

        <div
          className={`grid gap-6 md:gap-8 ${
            events.length === 1
              ? "md:grid-cols-1"
              : events.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
          }`}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="card-elegant p-8 text-center rounded-sm"
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center bg-sage/10 rounded-full">
                <event.icon className="w-6 h-6 text-sage" />
              </div>
              <h3 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
                {event.title}
              </h3>
              <p className="font-display text-xl text-sage mb-4">
                {event.time}
              </p>
              <div className="space-y-2">
                <p className="font-display text-lg text-foreground">
                  {event.venue}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm font-body">{event.address}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
