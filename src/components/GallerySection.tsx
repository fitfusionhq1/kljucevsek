import { motion } from "framer-motion";
import floralDivider from "@/assets/floral-divider.png";

const images = [
  "/kljucevsek/gallery/01.jpg",
  "/kljucevsek/gallery/02.jpg",
  "/kljucevsek/gallery/03.jpg",
  "/kljucevsek/gallery/04.jpg",
  "/kljucevsek/gallery/05.jpg",
  "/kljucevsek/gallery/06.jpg",
  // dodaj do 10
];

const GallerySection = () => {
  return (
    <section className="py-20 px-6" id="gallery">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <img
            src={floralDivider}
            alt="Divider"
            className="w-48 md:w-64 mx-auto mb-8 opacity-80"
          />
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Utrinki
          </h2>
          <p className="text-body text-muted-foreground">
            Nekaj najinih najljubših trenutkov.
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="card-elegant overflow-hidden rounded-sm"
            >
              <img
                src={src}
                alt={`Galerija ${i + 1}`}
                loading="lazy"
                className="w-full h-44 md:h-56 object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
