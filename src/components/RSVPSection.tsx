import { motion } from "framer-motion";

const RSVPSection = () => {
  const FORM_EMBED_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSc2r4h_iDLunOoZleCGmVvyyjt_9JA-zH_KMuhXBAECUlsVEQ/viewform?embedded=true";

  return (
    <section className="py-20 px-6" id="rsvp">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Prosim sporoči
          </h2>
          <p className="text-body text-muted-foreground">
            Sporoči tvojo udeležbo do 20. 5. 2026
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-elegant p-2 md:p-4 rounded-sm overflow-hidden"
        >
          <iframe
            src={FORM_EMBED_URL}
            className="w-full h-[1030px] border-0"
            loading="lazy"
            title="RSVP obrazec"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;
