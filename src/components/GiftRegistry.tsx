import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { TEXTS } from "@/content/texts";

export default function GiftRegistry() {
  return (
    <section id="gifts" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <Gift className="w-7 h-7 text-white" />
          </div>

          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            {TEXTS.sections.giftsTitle}
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            {TEXTS.sections.giftsSubtitle}
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        {/* Tukaj ohraniš tvojo obstoječo logiko seznama daril */}
        <div className="card-elegant p-8 md:p-10 rounded-sm">
          <p className="text-muted-foreground">
            Tukaj ostane tvoja obstoječa implementacija seznama daril.
          </p>
        </div>
      </div>
    </section>
  );
}
