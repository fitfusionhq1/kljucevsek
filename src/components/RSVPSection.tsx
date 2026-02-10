import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { invitationSentence } from "@/lib/invitationText";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbw831bYeeoXiHa2h_dyS6Yj06e2Ge-s11ade-QxgEREW8tiO-6GFV3Jt0oPsozNXfIg/exec";

type Guest = {
  token: string;

  // New (family / couple invites)
  groupName?: string;
  maxGuests?: number;
  likelyGuests?: number;
  cerkvenaInvited?: boolean;
  civilnaInvited?: boolean;
  ohcetInvited?: boolean;

  // Legacy (single-person invites)
  ime?: string;
  priimek?: string;

  invitedLabel?: string;
};

type GuestNormalized = {
  token: string;
  displayName: string;
  maxGuests: number;
  likelyGuests: number;
  invites: {
    cerkvena: boolean;
    civilna: boolean;
    ohcet: boolean;
  };
  invitedLabel?: string;
};

function normalizeGuest(g: Guest): GuestNormalized {
  const displayName =
    (g.groupName && g.groupName.trim()) ||
    [g.ime, g.priimek].filter(Boolean).join(" ").trim() ||
    "Gost";

  const maxGuests = Math.max(1, Number(g.maxGuests ?? 1) || 1);
  const likelyGuests = Math.min(
    maxGuests,
    Math.max(1, Number(g.likelyGuests ?? maxGuests) || maxGuests)
  );

  // backwards compatible defaults
  const cerkvena = g.cerkvenaInvited ?? true;
  const civilna = g.civilnaInvited ?? false;
  const ohcet = g.ohcetInvited ?? false;

  return {
    token: g.token,
    displayName,
    maxGuests,
    likelyGuests,
    invites: { cerkvena, civilna, ohcet },
    invitedLabel: g.invitedLabel,
  };
}

function getTokenFromUrl(): string {
  const t1 = new URLSearchParams(window.location.search).get("t");
  if (t1) return t1.trim();

  const hash = window.location.hash || "";
  if (hash.includes("?")) {
    const query = hash.substring(hash.indexOf("?") + 1);
    const t2 = new URLSearchParams(query).get("t");
    if (t2) return t2.trim();
  }

  return "";
}

const RSVPSection = () => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  const [guest, setGuest] = useState<GuestNormalized | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(true);

  const message = guest?.displayName
    ? invitationSentence(guest.displayName)
    : "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!";

  const [formData, setFormData] = useState({
    udelezba: "da",
    stOseb: "1",
    igra: "60",
    opombe: "",
  });

  useEffect(() => {
    if (!guest) return;
    setFormData((prev) => ({
      ...prev,
      stOseb: String(guest.likelyGuests),
    }));
  }, [guest]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingGuest(true);
      try {
        if (!token) {
          setGuest(null);
          return;
        }

        const res = await fetch(
          `${ENDPOINT}?op=guest&t=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok || data?.ok !== true) {
          throw new Error(data?.error || `HTTP ${res.status}`);
        }

        setGuest(normalizeGuest(data.guest as Guest));
      } catch (err: any) {
        toast.error("Neveljavna RSVP povezava.", {
          description: err?.message || "Uporabi osebni link iz vabila.",
        });
        setGuest(null);
      } finally {
        setLoadingGuest(false);
      }
    };

    load();
  }, [token]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;

    const coming = formData.udelezba === "da";

    const stOsebNum = Math.max(
      0,
      Math.min(guest.maxGuests, Number(formData.stOseb || 0) || 0)
    );

    // implicitno po vabilu (po tokenu)
    const cerkvena = coming ? guest.invites.cerkvena : false;
    const civilna = coming ? guest.invites.civilna : false;
    const ohcet = coming ? guest.invites.ohcet : false;

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          op: "rsvp",
          token: guest.token,
          ime: guest.displayName,
          udelezba: coming ? "da" : "ne",
          stOseb: coming ? stOsebNum : 0,
          cerkvena: cerkvena ? "da" : "ne",
          civilna: civilna ? "da" : "ne",
          ohcet: ohcet ? "da" : "ne",
          // igro ohranimo samo za vabljene na cerkveno
          igra: coming && guest.invites.cerkvena ? formData.igra : "",
          opombe: formData.opombe,
          source: "github-pages",
        }),
      });

      const text = await res.text();
      const parsed = JSON.parse(text);

      if (!res.ok || parsed?.ok === false) {
        throw new Error(parsed?.error || `HTTP ${res.status}`);
      }

      setIsSubmitted(true);
      toast.success("Hvala!", { description: "Tvoj odgovor je shranjen." });
    } catch (err: any) {
      toast.error("Prišlo je do napake.", {
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
              <div className="text-center space-y-2">
                <div className="font-display text-foreground text-lg md:text-xl">
                  {guest.displayName}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-base md:text-lg font-body text-foreground/90 max-w-xl mx-auto"
                >
                  {message}
                </motion.p>
              </div>

              <motion.form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label>Ali prideš?</Label>
                  <RadioGroup
                    value={formData.udelezba}
                    onValueChange={(v) => handleChange("udelezba", v)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="da" id="da" />
                      <Label htmlFor="da">Pridem</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ne" id="ne" />
                      <Label htmlFor="ne">Ne pridem</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.udelezba === "da" && (
                  <div className="space-y-2">
                    <Label>Koliko vas pride? (največ {guest.maxGuests})</Label>
                    <Input
                      type="number"
                      min="1"
                      max={String(guest.maxGuests)}
                      value={formData.stOseb}
                      onChange={(e) => handleChange("stOseb", e.target.value)}
                      required
                      className="w-40"
                    />
                    {guest.invitedLabel && (
                      <p className="text-xs text-muted-foreground font-body">
                        {guest.invitedLabel}
                      </p>
                    )}
                  </div>
                )}

                {formData.udelezba === "da" && guest.invites.cerkvena && (
                  <div className="space-y-2">
                    <Label>
                      Koliko časa misliš, da bo trajala cerkvena poroka? (v
                      minutah)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="240"
                      value={formData.igra}
                      onChange={(e) => handleChange("igra", e.target.value)}
                      required
                      className="w-40"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Opombe (neobvezno)</Label>
                  <Textarea
                    value={formData.opombe}
                    onChange={(e) => handleChange("opombe", e.target.value)}
                    placeholder="Alergije, posebne želje…"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 uppercase tracking-widest"
                >
                  {isLoading ? "Pošiljam…" : "Pošlji odgovor"}
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
