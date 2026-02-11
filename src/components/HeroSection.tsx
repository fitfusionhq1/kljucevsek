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

  const introText = isGeneralInvite ? TEXTS.hero.introPersonal : TEXTS.hero.introPersonal;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-32">
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
          className="w-full h-48 md:h-64 object-cover object-bottom opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 pt-32 md:pt-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4"
        >
          <span className="uppercase tracking-widest text-lg md:text-xl font-bold text-white drop-shadow-sm">
            {TEXTS.hero.togetherLine}
          </span>
        </motion.p>

        {/* Couple Photos and Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
        >
          {/* Vid */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-sage/30 shadow-lg mb-4"
            >
              <img src={vidPhoto} alt="Vid" className="w-full h-full object-cover object-top" />
            </motion.div>
            <h1 className="heading-script text-4xl md:text-5xl lg:text-6xl text-foreground">
              Vid
            </h1>
          </div>

          {/* Center Hero Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative order-first md:order-none"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-gold/40 shadow-2xl">
              <img src={coupleHero} alt="Katarina in Vid" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-full ring-2 ring-gold/20 ring-offset-4 ring-offset-background" />
          </motion.div>

          {/* Katarina */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-sage/30 shadow-lg mb-4"
            >
              <img
                src={katarinaPhoto}
                alt="Katarina"
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
            <h1 className="heading-script text-4xl md:text-5xl lg:text-6xl text-foreground">
              Katarina
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8"
        >
          <div className="divider-ornament mb-8" />
          <p className="text-body text-muted-foreground">{TEXTS.hero.inviteLine1}</p>
          <p className="text-body text-muted-foreground mt-1">{TEXTS.hero.inviteLine2}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <p className="font-display text-3xl md:text-4xl text-foreground font-light">
            {TEXTS.hero.dateLine}
          </p>
        </motion.div>

        {/* Intro card */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            className="mt-10"
          >
            <div className="card-elegant rounded-2xl px-6 py-8 md:px-12 md:py-10 max-w-2xl mx-auto text-center backdrop-blur-sm space-y-4">
              <div className="font-display text-foreground text-2xl md:text-3xl tracking-wide">
                {greeting}
              </div>

              <p className="text-lg md:text-xl font-body text-foreground/90 leading-relaxed">
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8"
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
