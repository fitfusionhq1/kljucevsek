import { useGuestContext } from "@/lib/GuestContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const InviteBar = () => {
  const { guest, loading } = useGuestContext();

  const message = guest?.ime
    ? `${guest.ime}, vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!`
    : "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!";

  return (
    <div className="mt-10">
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-elegant rounded-sm px-6 py-6 md:px-10 md:py-8 max-w-3xl mx-auto text-center space-y-3"
        >
          <div className="font-display text-foreground text-xl md:text-2xl">
            {guest?.ime ? `Živjo, ${guest.ime} 👋` : "Živjo 👋"}
          </div>

          <div className="text-base md:text-lg font-body text-foreground/90">
            {message}
          </div>

          {guest && (
            <div className="text-sm md:text-base font-body text-muted-foreground">
              Tvoje povabilo vključuje:{" "}
              <span className="text-foreground/90 font-display">
                {guest.invitedLabel}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
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
        </motion.div>
      )}
    </div>
  );
};

export default InviteBar;
