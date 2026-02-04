import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGuestContext } from "@/lib/GuestContext"; // če še nimaš, glej opombo spodaj
import { Heart, MapPin, CheckCircle2 } from "lucide-react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const HeroSection = () => {
  const { guest, loading } = useGuestContext();

  const greeting = guest?.ime ? `Živjo, ${guest.ime} 👋` : "Živjo 👋";

  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-6">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sage/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Small badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage font-body text-sm"
        >
          <Heart className="w-4 h-4 fill-sage text-sage" />
          Najin dan
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="heading-display text-5xl md:text-6xl text-foreground mt-6"
        >
          Grega &amp; Mirjam
        </motion.h1>

        {/* Sub title */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="text-body text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          Vesela bova, če boš del najinega dne. Spodaj najdeš podrobnosti, lokacije
          in RSVP.
        </motion.p>

        {/* Personalization block */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8"
          >
            <div className="card-elegant rounded-sm px-6 py-6 md:px-10 md:py-8 max-w-3xl mx-auto space-y-3">
              <div className="font-display text-foreground text-xl md:text-2xl">
                {greeting}
              </div>

              <div className="text-base md:text-lg font-body text-foreground/90">
                {guest?.ime
                  ? `${guest.ime}, vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!`
                  : "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!"}
              </div>

              {guest && (
                <div className="text-sm md:text-base font-body text-muted-foreground flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage" />
                  <span>
                    Tvoje povabilo vključuje:{" "}
                    <span className="text-foreground/90 font-display">
                      {guest.invitedLabel}
                    </span>
                  </span>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                <Button
                  className="bg-sage hover:bg-sage/90 text-primary-foreground font-body tracking-widest uppercase py-6"
                  onClick={() => scrollToId("rsvp")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Potrdi udeležbo
                </Button>

                <Button
                  variant="outline"
                  className="border-sage/40 hover:bg-sage/10 font-body tracking-widest uppercase py-6"
                  onClick={() => scrollToId("details")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Poglej lokacije
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* divider ornament if you have it */}
        <div className="divider-ornament mt-10" />
      </div>
    </section>
  );
};

export default HeroSection;
