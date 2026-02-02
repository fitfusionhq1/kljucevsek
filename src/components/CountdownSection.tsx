import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const CountdownSection = () => {
  // Wedding date: July 11, 2026 at 12:00 PM
  const weddingDate = new Date('2026-07-11T12:00:00');

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-display text-3xl md:text-4xl text-foreground mb-2">
            Skupaj odštevajmo do
          </h2>
          <p className="heading-script text-2xl md:text-3xl text-sage mb-12">
            najinega posebnega dne
          </p>
          <CountdownTimer targetDate={weddingDate} />
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownSection;
