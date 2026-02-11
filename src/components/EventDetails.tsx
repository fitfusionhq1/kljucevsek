import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { TEXTS } from "@/content/texts";

export default function EventDetails() {
  return (
    <section id="details" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            {TEXTS.sections.detailsTitle}
          </h2>
          <p className="text-body text-muted-foreground">{TEXTS.sections.detailsSubtitle}</p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        {/* Tukaj pustiš tvoje obstoječe “cards” z lokacijo/časom */}
        {/* Če imaš že svoj EventDetails, samo zamenjaj title+subtitle z TEXTS */}
        <div className="card-elegant p-8 md:p-10 rounded-sm">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>Dodaj svoje podrobnosti tukaj (lokacija, čas, naslov...).</span>
          </div>
        </div>
      </div>
    </section>
  );
}
