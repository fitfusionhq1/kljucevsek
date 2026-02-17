import { motion } from "framer-motion";
import floralHeader from "@/assets/floral-header.png";
import coupleHero from "@/assets/couple-hero.webp";
import vidPhoto from "@/assets/vid.jpg";
import katarinaPhoto from "@/assets/katarina.jpg";
import { useGuestContext } from "@/lib/GuestContext";
import { TEXTS } from "@/content/texts";

const HeroSection = () => {
  const { guest, loading } = useGuestContext();

  const isGeneralInvite = guest?.displayName === "SPLOSNO_CERKVENA";
  const greeting =
    !isGeneralInvite && guest?.displayName ? `Živjo, ${guest.displayName}` : "Živjo";

  return (
    <section className="relative overflow-hidden">
      {/* Floral Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 w-full"
      >
        <img
          src={floralHeader}
          alt="Floral decoration"
          className="w-full h-40 sm:h-48 md:h-64 object-cover object-bottom opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-32 md:pt-40 pb-24 sm:pb-28">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4 text-center"
        >
          <span className="uppercase tracking-widest text-sm sm:text-lg md:text-xl font-bold text-white drop-shadow-sm">
            {TEXTS.hero.togetherLine}
          </span>
        </motion.p>

        {/* Couple Photos and Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-6 md:gap-12"
        >
          {/* Center Hero Photo FIRST on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-gold/40 shadow-2xl">
              <img src={coupleHero} alt="Katarina in Vid" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-full ring-2 ring-gold/20 ring-offset-4 ring-offset-background" />
          </motion.div>

          {/* Names row on mobile, 2 columns; 2 side columns on desktop */}
          <div className="w-full max-w-xl grid grid-cols-2 md:grid-cols-3 items-start gap-4 md:gap-12">
            {/* Vid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col items-center md:items-center md:col-start-1"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-sage/30 shadow-lg mb-3 md:mb-4">
                <img src={vidPhoto} alt="Vid" className="w-full h-full object-cover object-top" />
              </div>
              <h1 className="heading-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Vid
              </h1>
            </motion.div>

            {/* Spacer column only on desktop to keep layout centered */}
            <div className="hidden md:block" />

            {/* Katarina */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col items-center md:items-center md:col-start-3"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-sage/30 shadow-lg mb-3 md:mb-4">
                <img
                  src={katarinaPhoto}
                  alt="Katarina"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h1 className="heading-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Katarina
              </h1>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-6 sm:mt-8 text-center"
        >
          <div className="divider-ornament mb-6 sm:mb-8" />
          <p className="text-body text-muted-foreground">{TEXTS.hero.inviteLine1}</p>
          <p className="text-body text-muted-foreground mt-1">{TEXTS.hero.inviteLine2}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-light">
            {TEXTS.hero.dateLine}
          </p>
        </motion.div>

        {/* Intro card */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            className="mt-8 sm:mt-10"
          >
            <div className="card-elegant rounded-2xl px-5 py-6 sm:px-6 sm:py-8 md:px-12 md:py-10 max-w-2xl mx-auto text-center backdrop-blur-sm space-y-3 sm:space-y-4">
              <div className="font-display text-foreground text-xl sm:text-2xl md:text-3xl tracking-wide">
                {greeting}
              </div>

              <p className="text-base sm:text-lg md:text-xl font-body text-foreground/90 leading-relaxed">
                {TEXTS.hero.introPersonal.introPersonalLine1}
                <br />
                {TEXTS.hero.introPersonal.introPersonalLine2}
                <br />
                {TEXTS.hero.introPersonal.introPersonalLine3}
                <br />
                {TEXTS.hero.introPersonal.introPersonalLine4}
                <br />
                {TEXTS.hero.introPersonal.introPersonalLine5}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator (hide on very small screens to reduce clutter) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-sage-light rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-sage rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
