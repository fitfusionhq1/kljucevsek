// src/lib/invitationText.ts

function splitPeople(raw: string): string[] {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return [];

  // Razbijanje po vejicah + " in "
  return s
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) =>
      p
        .split(" in ")
        .map((x) => x.trim())
        .filter(Boolean)
    );
}

function isGroupAlwaysPlural(raw: string): boolean {
  const s = raw.trim().toLowerCase();
  return s.startsWith("družina ") || s === "bend";
}

function formatNames(raw: string): string {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return s;

  if (isGroupAlwaysPlural(s)) return s;

  const parts = splitPeople(s);

  // Če sta 1 ali 2, pustimo original (ker je običajno že lep zapis).
  if (parts.length <= 2) return s;

  // Lepši zapis za 3+ : "A, B in C"
  return parts.slice(0, -1).join(", ") + " in " + parts[parts.length - 1];
}

function countPeople(raw: string): number {
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return 1;

  if (isGroupAlwaysPlural(s)) return 3; // treat as plural

  const parts = splitPeople(s);
  return Math.max(1, parts.length);
}

export function invitationSentence(displayName: string): string {
  const name = formatNames(displayName);
  const n = countPeople(displayName);

  if (n === 1) {
    return `${name}, vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!`;
  }

  if (n === 2) {
    return `${name}, vesela bova, če se nama pridružita, da lahko najin dan praznujeva še z vama!`;
  }

  return `${name}, vesela bova, če se nam pridružite, da lahko najin dan praznujeva še z vami!`;
}
