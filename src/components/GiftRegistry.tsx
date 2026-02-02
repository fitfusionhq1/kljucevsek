import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Gift } from 'lucide-react';

interface GiftItem {
  id: string;
  name: string;
  link?: string;
}

const giftItems: GiftItem[] = [
  { id: '1', name: 'Wok ponev' },
  { id: '2', name: 'Ponev za palačinke' },
  { id: '3', name: 'Kontaktni žar', link: 'https://www.mimovrste.com/kontaktni-kuhinjski-zari/gorenje-kr-1800-sdp-kontaktni-zar' },
  { id: '4', name: 'Likalna deska' },
  { id: '5', name: 'Sesalec' },
  { id: '6', name: 'Odcejevalna podloga', link: 'https://www.ikea.com/si/sl/p/nyskoeljd-odcejalna-podloga-temno-siva-00451059/' },
  { id: '7', name: 'Kopalniške brisače 50x100 cm - peščeno rjava barva 4x', link: 'https://www.svilanit.si/brisace/brisaca-svilanit-purity-pesceno-rjava.html' },
  { id: '8', name: 'Kopalniške brisače 65x140 cm - peščeno rjava barva 2x', link: 'https://www.svilanit.si/brisace/brisaca-svilanit-purity-pesceno-rjava.html' },
  { id: '9', name: 'Kopalniške brisače 50x100 cm - bela barva 4x', link: 'https://www.svilanit.si/brisace/brisaca-svilanit-purity-bela.html' },
  { id: '10', name: 'Kopalniške brisače 65x140 cm - bela barva 2x', link: 'https://www.svilanit.si/brisace/brisaca-svilanit-purity-bela.html' },
  { id: '11', name: 'Grelec za vodo' },
  { id: '12', name: 'Ročni mešalnik' },
  { id: '13', name: 'Palični mešalnik' },
  { id: '14', name: 'Set nožev' },
  { id: '15', name: 'Sobno kolo' },
];

const STORAGE_KEY = 'wedding-gift-registry-claimed';

const GiftRegistry = () => {
  const [claimedItems, setClaimedItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClaimedItems(JSON.parse(stored));
    }
  }, []);

  const handleClaimItem = (itemId: string) => {
    const newClaimed = claimedItems.includes(itemId)
      ? claimedItems.filter((id) => id !== itemId)
      : [...claimedItems, itemId];
    
    setClaimedItems(newClaimed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClaimed));
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-sage/10 rounded-full">
            <Gift className="w-8 h-8 text-sage" />
          </div>
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-4">
            Seznam daril
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Če želiš prinesti darilo, označi ga s kljukico. Ko je darilo izbrano, ga drugi gostje ne morejo več izbrati.
          </p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-elegant p-6 md:p-8 rounded-sm"
        >
          <ul className="space-y-4">
            {giftItems.map((item, index) => {
              const isClaimed = claimedItems.includes(item.id);
              
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${
                    isClaimed
                      ? 'bg-muted/50 border-sage/20'
                      : 'bg-background/50 border-sage-light/40 hover:border-sage/40'
                  }`}
                >
                  <Checkbox
                    id={`gift-${item.id}`}
                    checked={isClaimed}
                    onCheckedChange={() => handleClaimItem(item.id)}
                    className="border-sage data-[state=checked]:bg-sage data-[state=checked]:border-sage"
                  />
                  <label
                    htmlFor={`gift-${item.id}`}
                    className={`flex-1 font-body cursor-pointer transition-all ${
                      isClaimed
                        ? 'line-through text-muted-foreground/60'
                        : 'text-foreground'
                    }`}
                  >
                    {item.name}
                  </label>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 text-sm font-body transition-colors ${
                        isClaimed
                          ? 'text-muted-foreground/40 pointer-events-none'
                          : 'text-sage hover:text-sage/80'
                      }`}
                      onClick={(e) => isClaimed && e.preventDefault()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Povezava</span>
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground/70 mt-6 font-body"
        >
          * Izbire so shranjene lokalno na tej napravi
        </motion.p>
      </div>
    </section>
  );
};

export default GiftRegistry;
