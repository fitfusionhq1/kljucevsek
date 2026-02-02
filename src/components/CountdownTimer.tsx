import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Dni', value: timeLeft.days },
    { label: 'Ur', value: timeLeft.hours },
    { label: 'Minut', value: timeLeft.minutes },
    { label: 'Sekund', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/60 backdrop-blur-sm border border-sage-light/30 rounded-sm shadow-sm">
            <span className="text-2xl md:text-3xl font-display font-light text-foreground">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <p className="mt-2 text-xs tracking-widest uppercase font-body text-muted-foreground">
            {unit.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
