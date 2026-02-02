import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    ceremonyDuration: '60',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    toast.success('Hvala za tvoj odgovor!', {
      description: 'Komaj čakava, da praznujeva s teboj.',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-elegant p-12 rounded-sm"
          >
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-sage/10 rounded-full">
              <Heart className="w-8 h-8 text-sage fill-sage" />
            </div>
            <h2 className="heading-display text-3xl md:text-4xl text-foreground mb-4">
              Hvala!
            </h2>
            <p className="text-muted-foreground font-body">
              Tvoj odgovor sva prejela. Komaj čakava, da praznujeva s teboj!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Prosim sporoči
          </h2>
          <p className="text-body text-muted-foreground">
            Sporoči tvojo udeležbo do 20. 5. 2026
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="card-elegant p-8 md:p-12 rounded-sm space-y-8"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-body">
              Ime in priimek
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage"
              placeholder="Tvoje polno ime"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-body">
              E-poštni naslov
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage"
              placeholder="tvoj@email.com"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-body">Ali se boš udeležil/a?</Label>
            <RadioGroup
              value={formData.attending}
              onValueChange={(value) => handleChange('attending', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="border-sage text-sage" />
                <Label htmlFor="yes" className="font-body font-light cursor-pointer">
                  Z veseljem sprejmem
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="border-sage text-sage" />
                <Label htmlFor="no" className="font-body font-light cursor-pointer">
                  Žal ne morem
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.attending === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="ceremonyDuration" className="text-body">
                Koliko časa misliš, da bo trajala cerkvena poroka? (v minutah)
              </Label>
              <Input
                id="ceremonyDuration"
                type="number"
                min="1"
                max="180"
                value={formData.ceremonyDuration}
                onChange={(e) => handleChange('ceremonyDuration', e.target.value)}
                className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage w-32"
              />
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message" className="text-body">
              Sporočilo za mladoporočenca (neobvezno)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage min-h-[100px]"
              placeholder="Deli svoje želje..."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-sage hover:bg-sage/90 text-primary-foreground font-body tracking-widest uppercase py-6"
          >
            Pošlji odgovor
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVPSection;
