import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbztoSoziwbuINadPTo2PN9tNqGz1QI4--WyoDUoAOhtqIHk92mBOYUi6wBQW0VXAVEd/exec"; // <-- zamenjaj z dejanskim URL

type Guest = {
  token: string;
  ime: string;
  priimek: string;
  civilnaInvited: boolean;
  ohcetInvited: boolean;
  invitedLabel: string; // "cerkvena + civilna + ohcet"
};

function getTokenFromUrl(): string {
  // 1. klasični query (?t=...)
  const search = window.location.search || "";
  const t1 = new URLSearchParams(search).get("t");
  if (t1) return t1.trim();

  // 2. query v hash (#rsvp?t=...)
  const hash = window.location.hash || "";
  if (hash.includes("?")) {
    const query = hash.substring(hash.indexOf("?") + 1);
    const t2 = new URLSearchParams(query).get("t");
    if (t2) return t2.trim();
  }

  return "";
}


const RSVPSection = () => {
  const token = useMemo(() => getTokenFromUrl(), []);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(true);

  const [formData, setFormData] = useState({
    udelezba: "da", // "da" | "ne"
    igra: "60", // minute
    opombe: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingGuest(true);
      try {
        if (!token) throw new Error("Manjka osebna povezava (token).");

        const res = await fetch(`${ENDPOINT}?op=guest&t=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok || data?.ok !== true) {
          throw new Error(data?.error || `HTTP ${res.status}`);
        }

        setGuest(data.guest as Guest);
      } catch (err: any) {
        toast.error("Neveljavna RSVP povezava.", {
          description: err?.message || "Preveri, da uporabljaš pravi link.",
        });
        setGuest(null);
      } finally {
        setLoadingGuest(false);
      }
    };

    load();
  }, [token]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          op: "rsvp",
          token: guest.token,
          udelezba: formData.udelezba,
          igra: formData.udelezba === "da" ? formData.igra : "",
          opombe: formData.opombe,
          source: "github-pages",
        }),
      });

      const text = await res.text();
      let parsed: any = null;
      try { parsed = JSON.parse(text); } catch {}

      if (!res.ok || (parsed && parsed.ok === false)) {
        throw new Error(parsed?.error || `HTTP ${res.status}`);
      }

      setIsSubmitted(true);
      toast.success("Hvala za tvoj odgovor!", { description: "Odgovor je shranjen." });
    } catch (err: any) {
      toast.error("Ups, prišlo je do napake.", {
        description: err?.message || "Poskusi še enkrat.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-6" id="rsvp">
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
    <section className="py-20 px-6" id="rsvp">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-elegant p-8 md:p-12 rounded-sm space-y-8"
        >
          {loadingGuest ? (
            <p className="text-center text-sm text-muted-foreground font-body">
              Nalagam tvoje vabilo…
            </p>
          ) : !guest ? (
            <p className="text-center text-sm text-muted-foreground font-body">
              Ta povezava ni veljavna. Prosim uporabi osebni link iz vabila.
            </p>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground font-body">
                <div className="mb-1">
                  <strong>{guest.ime} {guest.priimek}</strong>
                </div>
                <div>Povabljen/a si na: <strong>{guest.invitedLabel}</strong></div>
              </div>

              <motion.form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-body">Ali prideš?</Label>
                  <RadioGroup
                    value={formData.udelezba}
                    onValueChange={(v) => handleChange("udelezba", v)}
                    className="flex flex-col md:flex-row gap-4 md:gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="da" id="da" className="border-sage text-sage" />
                      <Label htmlFor="da" className="font-body font-light cursor-pointer">
                        Pridem
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ne" id="ne" className="border-sage text-sage" />
                      <Label htmlFor="ne" className="font-body font-light cursor-pointer">
                        Ne pridem
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.udelezba === "da" && (
                  <div className="space-y-2">
                    <Label htmlFor="igra" className="text-body">
                      Koliko časa misliš, da bo trajala cerkvena poroka? (v minutah)
                    </Label>
                    <Input
                      id="igra"
                      type="number"
                      min="1"
                      max="240"
                      step="1"
                      required
                      value={formData.igra}
                      onChange={(e) => handleChange("igra", e.target.value)}
                      className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage w-40"
                      placeholder="npr. 60"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="opombe" className="text-body">
                    Opombe (neobvezno)
                  </Label>
                  <Textarea
                    id="opombe"
                    value={formData.opombe}
                    onChange={(e) => handleChange("opombe", e.target.value)}
                    className="bg-background/50 border-sage-light/40 focus:border-sage focus:ring-sage min-h-[100px]"
                    placeholder="Alergije, posebne želje..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sage hover:bg-sage/90 text-primary-foreground font-body tracking-widest uppercase py-6 disabled:opacity-60"
                >
                  {isLoading ? "Pošiljam..." : "Pošlji odgovor"}
                </Button>
              </motion.form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RSVPSection;
