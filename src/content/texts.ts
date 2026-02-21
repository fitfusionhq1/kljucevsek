// src/content/texts.ts

export const TEXTS = {
  hero: {
    togetherLine: "Skupaj s prijatelji in družino",
    inviteLine1: "Vabilo na praznovanje",
    inviteLine2: "najinega skupnega začetka poti",
    dateLine: "Sobota, 11. julij 2026",
    introPersonal: {
      introPersonalLine1: "Kot je apostol Pavel zapisal v pismu Korinčanom",
      introPersonalLine2: "",
      introPersonalLine3: "- NAJVEČJA OD TEH JE LJUBEZEN -",
      introPersonalLine4: "",
      introPersonalLine5: "bi rada tudi midva poudarila, da je največja od vseh stvari, ki naju povezujejo, prav ljubezen.",
    }
  },

  sections: {
    detailsTitle: "Podrobnosti",
    detailsSubtitle:
      "Vse, kar moraš vedeti o najinem dnevu - Lokacija, čas in še več.",
    giftsTitle: "Seznam daril",
    giftsSubtitle:{
      giftsSubtitleLine1: "Ob začetku najine skupne poti bova vesela finančne pomoči.",
      giftsSubtitleLine2: "",
      giftsSubtitleLine3: "Če pa bi nama radi kaj podarili, pa ne veste kaj, si lahko pomagate s spodnjim seznamom.",
      giftsSubtitleLine4: "",
      giftsSubtitleLine5: "Ko izbereš darilo, se prečrta. Odznači ga lahko samo ista naprava, ki ga je označila.",
    },
    rsvpTitle: "Prosim sporoči",
    rsvpSubtitle: "Sporoči svojo udeležbo do 20. 5. 2026, drugače bova mislila, da te ne bo.",
    rsvpThankYouTitle: "Hvala!",
    rsvpThankYouText:
      "Tvoj odgovor sva prejela. Komaj čakava, da praznujeva skupaj!",
    invalidLink: "Ta povezava ni veljavna. Prosim uporabi osebni link iz vabila.",
    loadingInvite: "Nalagam tvoje vabilo…",
  },
  rsvp: {
  generalMessage:
    "Vesela bova, če se nama pridružite, da lahko najin dan praznujeva še z vami!",

  fallbackMessage:
    "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!",

  notesPlaceholder: "Alergije, posebne želje…",

  buttons: {
    submit: "Pošlji odgovor",
    submitting: "Pošiljam…",
  },

  labels: {
    coming: "Ali prideš?",
    yes: "Pridem",
    no: "Ne pridem",
    howMany: "Koliko vas pride?",
    churchGame:
      "Koliko časa misliš, da bo trajala cerkvena poroka? (Oddaj svojo v minutah stavo, samo za zabavo)",
    notes: "Opombe (neobvezno)",
  },
},


 gifts: {
  showList: "Prikaži darila",
  hideList: "Skrij darila",

  loading: "Nalagam seznam daril…",
  empty: "Trenutno ni daril v seznamu (preveri tab WISHLIST v Sheets).",
  readErrorTitle: "Ne morem prebrati seznama daril.",
  readErrorDesc: "Poskusi osvežiti stran.",
  saveErrorTitle: "Ni uspelo shraniti spremembe.",
  saveErrorDesc: "Poskusi znova.",
  marked: "Darilo označeno.",
  unmarked: "Darilo odznačeno.",
  linkLabel: "Povezava",
  mineTag: "(tvoja izbira)",
  tooltipTaken: "Darilo je že izbrano.",
  tooltipUnmark: "Klikni za odznačiti.",
  tooltipMark: "Klikni za označiti.",
  },
} as const;
