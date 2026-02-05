import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CountdownTimerProps = {
  targetDate: Date;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calc(targetDate: Date): TimeLeft | null {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const pad = (n: number) => String(n).padStart(2, "0");

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calc(targetDate)
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft(calc(targetDate));
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center font-display text-3xl text-foreground"
      >
        Danes je najin dan 💍
      </motion.div>
    );
  }

  const Item = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="font-display text-4xl md:text-5xl text-foreground">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center gap-6 md:gap-10"
    >
      <Item value={String(timeLeft.days)} label="dni" />
      <Item value={pad(timeLeft.hours)} label="ur" />
      <Item value={pad(timeLeft.minutes)} label="minut" />
      <Item value={pad(timeLeft.seconds)} label="sekund" />
    </motion.div>
  );
};

export default CountdownTimer;
