import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, ArrowLeftRight } from "lucide-react";

type Photo = { src: string; alt: string };

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

const GallerySection = () => {
  const photos: Photo[] = useMemo(
    () => [
      { src: `${import.meta.env.BASE_URL}gallery/01.jpg`, alt: "27 Jun 2022" },
      { src: `${import.meta.env.BASE_URL}gallery/02.jpg`, alt: "1 Jan 2023" },
      { src: `${import.meta.env.BASE_URL}gallery/03.jpg`, alt: "21 Apr 2023" },
      { src: `${import.meta.env.BASE_URL}gallery/04.jpg`, alt: "29 Apr 2023" },
      { src: `${import.meta.env.BASE_URL}gallery/05.jpg`, alt: "5 Sep 2023" },
      { src: `${import.meta.env.BASE_URL}gallery/06.jpg`, alt: "1 Nov 2023" },
      { src: `${import.meta.env.BASE_URL}gallery/07.jpg`, alt: "24 Sep 2022" },
      { src: `${import.meta.env.BASE_URL}gallery/10.jpg`, alt: "30 Dec 2024" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Swipe hint (mobile)
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const AUTOPLAY = true;
  const AUTOPLAY_MS = 6500;
  const isHovering = useRef(false);

  const goTo = (i: number) => {
    const next = clampIndex(i, photos.length);
    setDirection(next > index ? 1 : -1);
    setIndex(next);
    setShowSwipeHint(false);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((i) => clampIndex(i - 1, photos.length));
    setShowSwipeHint(false);
  };

  const goNext = () => {
    setDirection(1);
    setIndex((i) => clampIndex(i + 1, photos.length));
    setShowSwipeHint(false);
  };

  useEffect(() => {
    if (!AUTOPLAY || photos.length <= 1) return;
    const id = window.setInterval(() => {
      if (isHovering.current) return;
      goNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length, AUTOPLAY]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length]);

  // Auto-hide swipe hint after a few seconds
  useEffect(() => {
    const t = window.setTimeout(() => setShowSwipeHint(false), 6000);
    return () => window.clearTimeout(t);
  }, []);

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
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-black/5 group">
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

              {/* HOVER: show full image (contain) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="absolute inset-0 bg-black/55" />
                <img
                  src={current?.src}
                  alt={current?.alt}
                  className="absolute inset-0 w-full h-full object-contain p-6"
                  draggable={false}
                />
              </div>

              {/* GRADIENT */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

              {/* Swipe hint (mobile only) */}
              {photos.length > 1 && showSwipeHint && (
                <motion.div
                  className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  <div className="flex items-center gap-2 bg-black/45 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full shadow">
                    <Hand className="w-4 h-4 opacity-90" />
                    <span>Podrsaj</span>
                    <motion.span
                      className="inline-flex items-center"
                      animate={{ x: [0, 10, 0, -10, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowLeftRight className="w-4 h-4 opacity-90" />
                    </motion.span>
                  </div>
                </motion.div>
              )}

              {/* Swipe (mobile + desktop trackpad) */}
              {photos.length > 1 && (
                <motion.div
                  className="absolute inset-0 z-10"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onPointerDown={() => setShowSwipeHint(false)}
                  onDragStart={() => setShowSwipeHint(false)}
                  onDragEnd={(_, info) => {
                    setShowSwipeHint(false);
                    const threshold = 60;
                    if (info.offset.x > threshold) goPrev();
                    if (info.offset.x < -threshold) goNext();
                  }}
                  style={{ touchAction: "pan-y" }}
                />
              )}
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
                    i === index
                      ? "border-foreground/50"
                      : "border-foreground/15 hover:border-foreground/30",
                  ].join(" ")}
                  aria-label={`Odpri sliko ${i + 1}`}
                >
                  <div className="relative h-20 group">
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      draggable={false}
                    />
                    {/* hover full thumbnail */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                      <div className="absolute inset-0 bg-black/55" />
                      <img
                        src={p.src}
                        alt={p.alt}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                        draggable={false}
                      />
                    </div>
                  </div>
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
