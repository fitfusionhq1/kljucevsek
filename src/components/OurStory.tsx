import { motion } from "framer-motion";

const story = [
  { year: "2019", title: "Prvič sva se ujela", text: "Naključno srečanje, ki ni bilo čisto naključno." },
  { year: "2020", title: "Prvi dejt", text: "Smeh, sprehod in občutek, da je to to." },
  { year: "2022", title: "Skupni dom", text: "Ustvarjanje najinega ritma in malih ritualov." },
  { year: "2025", title: "Zaročena!", text: "Najin ‘ja’ in začetek novega poglavja." },
];

const OurStory = () => {
  return (
    <section className="py-20 px-6" id="story">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Kako sva se spoznala
          </h2>
          <p className="text-body text-muted-foreground">
            Najini najljubši trenutki – na hitro.
          </p>
          <div className="divider-ornament mt-6" />
        </div>

        <div className="space-y-6">
          {story.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.06 }}
              className="card-elegant p-6 md:p-8 rounded-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="font-display text-sage text-xl">{item.year}</div>
                <div className="heading-display text-2xl md:text-3xl">{item.title}</div>
              </div>
              <p className="mt-3 text-body text-muted-foreground font-body">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
