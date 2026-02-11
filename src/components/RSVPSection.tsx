import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useGuest } from "@/lib/useGuest";
import { invitationSentence } from "@/lib/invitationText";
import { TEXTS } from "@/content/texts";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbw831bYeeoXiHa2h_dyS6Yj06e2Ge-s11ade-QxgEREW8tiO-6GFV3Jt0oPsozNXfIg/exec";

type RSVPFormState = {
  udelezba: "da" | "ne";
  stOseb: string;
  igra: string;
  opombe: string;
};

export default function RSVPSection() {
  const { guest, loading } = useGuest();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isGeneralInvite = guest?.displayName === "SPLOSNO_CERKVENA";

  const maxGuests = useMemo(() => {
    return guest?.maxGuests && Number.isFinite(guest.maxGuests) ? guest.maxGuests : 1;
  }, [guest]);

  const likelyGuests = useMemo(() => {
    const v =
      guest?.likelyGuests && Number.isFinite(guest.likelyGuests)
        ? guest.likelyGuests
        : maxGuests;
    return Math.min(maxGuests, Math.max(1, v));
  }, [guest, maxGuests]);

  const [form, setForm] = useState<RSVPFormState>({
    udelezba: "da",
    stOseb: "1",
    igra: "60",
    opombe: "",
  });

  useEffect(() => {
    if (!guest) return;
    setForm((prev) => ({ ...prev, stOseb: String(likelyGuests) }));
  }, [guest, likelyGuests]);

  const message = useMemo(() => {
    if (isGeneralInvite) return TEXTS.rsvp.generalMessage;
    if (guest?.displayName) return invitationSentence(guest.displayName);
    return TEXTS.rsvp.fallbackMessage;
  }, [guest, isGeneralInvite]);

  const setField = (key: keyof RSVPFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guest) return;

    const coming = form.udelezba === "da";
    const stOsebNumRaw = Number(form.stOseb || 0) || 0;
    const stOsebNum = coming ? Math.min(maxGuests, Math.max(1, stOsebNumRaw)) : 0;

    const igraMinutes =
      coming && guest.cerkvenaInvited ? String(Number(form.igra || 0) || "") : "";

    setIsSending(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          op: "rsvp",
          token: guest.token,
          ime: isGeneralInvite ? "SPLOSNO_CERKVENA" : guest.displayName,
          udelezba: coming ? "da" : "ne",
          stOseb: stOsebNum,
          cerkvena: coming && guest.cerkvenaInvited ? "da" : "ne",
          civilna: coming && guest.civilnaInvited ? "da" : "ne",
          ohcet: coming && guest.ohcetInvited ? "da" : "ne",
          igra: igraMinutes,
          opombe: form.opombe,
          source: "github-pages",
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!res.ok || data?.ok !== true) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setIsSubmitted(true);
      toast.success(TEXTS.sections.rsvpThankYouTitle, {
        description: "Tvoj odgovor je shranjen.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Prišlo je do napake.", {
        description: err?.message || "Poskusi še enkrat.",
      });
    } finally {
      setIsSending(false);
    }
  }

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-elegant p-10 md:p-12 rounded-sm">
            <h2 className="heading-display text-3xl md:text-4xl text-foreground mb-4">
              {TEXTS.sections.rsvpThankYouTitle}
            </h2>
            <p className="text-muted-foreground font-body">
              {TEXTS.sections.rsvpThankYouText}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-3">
            {TEXTS.sections.rsvpTitle}
          </h2>
          <p className="text-body text-muted-foreground">{TEXTS.sections.rsvpSubtitle}</p>
          <div className="divider-ornament mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-elegant p-8 md:p-12 rounded-sm space-y-8"
        >
          {loading ? (
            <p className="text-center text-sm text-muted-foreground font-body">
              {TEXTS.sections.loadingInvite}
            </p>
          ) : !guest ? (
            <p className="text-center text-sm text-muted-foreground font-body">
              {TEXTS.sections.invalidLink}
            </p>
          ) : (
            <>
              <div className="text-center space-y-2">
                {!isGeneralInvite && (
                  <div className="font-display text-foreground text-lg md:text-xl">
                    {guest.displayName}
                  </div>
                )}

                <p className="text-base md:text-lg font-body text-foreground/90 max-w-xl mx-auto">
                  {message}
                </p>

                {guest.invitedLabel ? (
                  <p className="text-xs md:text-sm text-muted-foreground font-body">
                    {guest.invitedLabel}
                  </p>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label>{TEXTS.rsvp.labels.coming}</Label>
                  <RadioGroup
                    value={form.udelezba}
                    onValueChange={(v) => setField("udelezba", v)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="da" id="rsvp-da" />
                      <Label htmlFor="rsvp-da">{TEXTS.rsvp.labels.yes}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ne" id="rsvp-ne" />
                      <Label htmlFor="rsvp-ne">{TEXTS.rsvp.labels.no}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {form.udelezba === "da" && (
                  <div className="space-y-2">
                    <Label>
                      {TEXTS.rsvp.labels.howMany} (največ {maxGuests})
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={maxGuests}
                      value={form.stOseb}
                      onChange={(e) => setField("stOseb", e.target.value)}
                      className="w-40"
                      required
                    />
                  </div>
                )}

                {form.udelezba === "da" && guest.cerkvenaInvited && (
                  <div className="space-y-2">
                    <Label>{TEXTS.rsvp.labels.churchGame}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={240}
                      value={form.igra}
                      onChange={(e) => setField("igra", e.target.value)}
                      className="w-40"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{TEXTS.rsvp.labels.notes}</Label>
                  <Textarea
                    value={form.opombe}
                    onChange={(e) => setField("opombe", e.target.value)}
                    placeholder={TEXTS.rsvp.notesPlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-6 uppercase tracking-widest"
                >
                  {isSending ? TEXTS.rsvp.buttons.submitting : TEXTS.rsvp.buttons.submit}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
