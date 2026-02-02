import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-script text-4xl md:text-5xl text-foreground mb-4">
            Katarina & Vid
          </h2>
          <p className="font-display text-xl text-sage mb-8">
            11. julij 2026
          </p>
          <div className="divider-ornament mb-8" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm font-body tracking-wider">Ustvarjeno z</span>
            <Heart className="w-4 h-4 text-blush-dark fill-blush-dark" />
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-body tracking-wider">
            #KatarinaInVid2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
