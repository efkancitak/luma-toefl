// One vocabulary deck for study: the rich cards of v0.1–v0.4 (data/library.js)
// plus the level word bank (data/words.js), with deterministic multiple-choice
// options in the style of a word-list app: English word → four Turkish options.

import { vocabulary } from "./library.js";
import { WORD_BANK } from "./words.js";

export const LEVEL_ORDER = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);
export const POS_TR = Object.freeze({ n: "i.", v: "f.", adj: "s.", adv: "zf.", phr: "ifade", prep: "ed.", conj: "bağ." });

function richPos(text) {
  const value = String(text).toLowerCase();
  if (value.includes("phrase")) return "phr";
  if (value.startsWith("noun")) return "n";
  if (value.startsWith("verb")) return "v";
  if (value.startsWith("adj")) return "adj";
  if (value.startsWith("adv")) return "adv";
  if (value.startsWith("conj")) return "conj";
  if (value.startsWith("prep")) return "prep";
  return "phr";
}

const slug = (word) => word.normalize("NFKC").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function buildDeck() {
  const cards = [];
  for (const level of LEVEL_ORDER) {
    for (const item of vocabulary.filter((entry) => entry.level === level)) {
      cards.push({ ...item, pos: richPos(item.partOfSpeech), rich: true });
    }
    for (const [word, pos, meaning, example] of WORD_BANK[level] ?? []) {
      cards.push({ id: `w-${slug(word)}`, word, level, pos, partOfSpeech: pos, meaning, example, definition: "", collocations: [], family: [], topic: "", rich: false });
    }
  }
  return Object.freeze(cards);
}

export const DECK = buildDeck();
export const DECK_BY_ID = new Map(DECK.map((card) => [card.id, card]));

/** Up to three Turkish meanings, split from "a; b; c". */
export function meaningsOf(card) {
  return String(card?.meaning ?? "").split(/\s*;\s*/u).map((part) => part.trim()).filter(Boolean).slice(0, 3);
}

function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function random(seed) {
  let state = seed || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(list, next) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Four options for a card. Distractors come first from the same level and part
 * of speech, then the same level, then neighbouring levels. A distractor never
 * shares a meaning with the answer or another option. The result is the same
 * every time for the same card and round, so a re-render never reshuffles.
 */
export function choicesFor(card, pool, { key = (entry) => meaningsOf(entry).map((m) => m.toLocaleLowerCase("tr")), round = 0 } = {}) {
  const next = random(hash(`${card.id}:${round}`));
  const taken = new Set(key(card));
  const levelIndex = LEVEL_ORDER.indexOf(card.level);
  const near = (entry) => Math.abs(LEVEL_ORDER.indexOf(entry.level) - levelIndex) <= 1;
  const tiers = [
    (entry) => entry.level === card.level && entry.pos === card.pos,
    (entry) => entry.level === card.level,
    (entry) => near(entry) && entry.pos === card.pos,
    near,
    () => true,
  ];
  const picked = [];
  const used = new Set([card.id]);
  for (const tier of tiers) {
    if (picked.length === 3) break;
    for (const entry of shuffled(pool.filter((candidate) => !used.has(candidate.id) && tier(candidate)), next)) {
      if (picked.length === 3) break;
      const keys = key(entry);
      if (!keys.length || keys.some((value) => taken.has(value))) continue;
      picked.push(entry);
      used.add(entry.id);
      keys.forEach((value) => taken.add(value));
    }
  }
  const options = shuffled([card, ...picked], next);
  return { options, answer: options.indexOf(card) };
}
