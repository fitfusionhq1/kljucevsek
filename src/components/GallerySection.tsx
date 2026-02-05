import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Photo = { src: string; alt: string };

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

const GallerySection = () => {
  // 1) Tukaj dodaj/uredi slike (iz public/gallery)
  const photos: Photo[] = useMemo(
    () => [
      { src: `${import.meta.env.BASE_URL}gallery/01.jpg`, alt: "Galerija 01" },
      { src: `${import.meta.env.BASE_URL}gallery/02.jpg`, alt: "Galerija 02" },
      { src: `${import.meta.env.BASE_URL}gallery/03.jpg`, alt: "Galerija 03" },
      { src: `${import.meta.env.BASE_URL}gallery/04.jpg`, alt: "Galerija 04" },
      { src: `${import.meta.env.BASE_URL}gallery/05.jpg`, alt: "Galerija 05" },
      { src: `${import.meta.env.BASE_URL}gallery/06.jpg`, alt: "Galerija 06" },
      { src: `${import.meta.env.BASE_URL}gallery/07.jpg`, alt: "Galerija 07" },
      { src: `${import.meta.env.BASE_URL}gallery/09.jpg`, alt: "Galerija 09" },
      { src: `${import.meta.env.BASE_URL}gallery/10.jpg`, alt: "Galerija 10" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // 2) Autoplay (po želji)
  const AUTOPLAY = true;
  const AUTOPLAY_MS = 6500;
  const isHovering = useRef(false);

  useEffect(() => {
    if (!AUTOPLAY || photos.length <= 1) return;

    const id = window.setInterval(() => {
      if (isHovering.current) return;
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length, AUTOPLAY]);

  // 3) Keyboard (levo/desno)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length]);

  const goTo = (i: number) => {
    const next = clampIndex(i, photos.length);
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((i) => clampIndex(i - 1, photos.length));
  };

  const goNext = () => {
    setDirection(1);
    setIndex((i) => clampIndex(i + 1, photos.length));
  };

  const current = photos[index];

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
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Galerija
          </h2>
          <p className="text-body text-muted-foreground">
            Nekaj utrinkov in najinih trenutkov.
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => (isHovering.current = true)}
          onMouseLeave={() => (isHovering.current = false)}
        >
          {/* MAIN SLIDE */}
          <div className="card-elegant rounded-sm overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={current?.src}
                  src={current?.src}
                  alt={current?.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </AnimatePresence>

              {/* GRADIENT for elegance */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

              {/* ARROWS */}
              {photos.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full w-11 h-11 p-0 opacity-90"
                    onClick={goPrev}
                    aria-label="Prejšnja slika"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-11 h-11 p-0 opacity-90"
                    onClick={goNext}
                    aria-label="Naslednja slika"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Swipe (mobile) */}
              <motion.div
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  const threshold = 60;
                  if (info.offset.x > threshold) goPrev();
                  if (info.offset.x < -threshold) goNext();
                }}
                style={{ touchAction: "pan-y" }}
              />
            </div>

            {/* CAPTION / COUNTER */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-body">
                {current?.alt}
              </div>
              <div className="text-xs text-muted-foreground font-body">
                {index + 1} / {photos.length}
              </div>
            </div>
          </div>

          {/* DOTS */}
          {photos.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => goTo(i)}
                  aria-label={`Pojdi na sliko ${i + 1}`}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    i === index ? "w-8 bg-foreground/70" : "w-2.5 bg-foreground/25",
                  ].join(" ")}
                />
              ))}
            </div>
          )}

          {/* THUMBNAILS */}
          {photos.length > 1 && (
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => goTo(i)}
                  className={[
                    "overflow-hidden rounded-sm border transition-all",
                    i === index ? "border-foreground/50" : "border-foreground/15 hover:border-foreground/30",
                  ].join(" ")}
                  aria-label={`Odpri sliko ${i + 1}`}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
