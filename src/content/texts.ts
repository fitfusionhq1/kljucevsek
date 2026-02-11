// src/content/texts.ts

export const TEXTS = {
  hero: {
    togetherLine: "Skupaj s prijatelji in družino",
    inviteLine1: "Vabilo na praznovanje",
    inviteLine2: "najinega skupnega začetka poti",
    dateLine: "Sobota, 11. julij 2026",
    introPersonal:
      "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!",
    introGeneral:
      "Prisrčno vabljeni, da se nama pridružite pri cerkveni poroki in z nama delite ta poseben trenutek.",
  },

  sections: {
    detailsTitle: "Podrobnosti",
    detailsSubtitle:
      "Vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!",
    giftsTitle: "Seznam daril",
    giftsSubtitle:
      "Ko izbereš darilo, se prečrta. Odznačiti ga lahko samo ista naprava, ki ga je označila.",
    rsvpTitle: "Prosim sporoči",
    rsvpSubtitle: "Sporoči svojo udeležbo do 20. 5. 2026",
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
      "Koliko časa misliš, da bo trajala cerkvena poroka? (v minutah)",
    notes: "Opombe (neobvezno)",
  },
},


  gifts: {
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
