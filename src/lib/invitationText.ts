// src/lib/invitationText.ts
import { invitationSentence } from "@/lib/invitationText";


function formatNames(raw: string) {
  const s = raw.trim();
  const lower = s.toLowerCase();

  if (lower.startsWith("družina ") || lower === "bend") return s;

  const parts = s
    .replace(/\s+/g, " ")
    .split(",")
    .map(p => p.trim())
    .filter(Boolean)
    .flatMap(p => p.split(" in ").map(x => x.trim()).filter(Boolean));

  if (parts.length <= 2) return s;

  return parts.slice(0, -1).join(", ") + " in " + parts[parts.length - 1];
}

function groupCount(raw: string) {
  const s = raw.trim();
  const lower = s.toLowerCase();

  if (lower.startsWith("družina ") || lower === "bend") return 3;

  const parts = s
    .replace(/\s+/g, " ")
    .split(",")
    .map(p => p.trim())
    .filter(Boolean)
    .flatMap(p => p.split(" in ").map(x => x.trim()).filter(Boolean));

  return Math.max(1, parts.length);
}

export function invitationSentence(rawGroupLine: string) {
  const namesText = formatNames(rawGroupLine);
  const n = groupCount(rawGroupLine);

  if (n === 1) {
    return `${namesText}, vesela bova, če se nama pridružiš, da lahko najin dan praznujeva še s tabo!`;
  }
  if (n === 2) {
    return `${namesText}, vesela bova, če se nama pridružita, da lahko najin dan praznujeva še z vama!`;
  }
  return `${namesText}, vesela bova, če se nam pridružite, da lahko najin dan praznujeva še z vami!`;
}
