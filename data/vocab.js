// One vocabulary deck for study: the rich cards of v0.1–v0.4 (data/library.js)
// plus the level word bank (data/words.js), with deterministic multiple-choice
// options in the style of a word-list app: English word → four Turkish options.

import { vocabulary } from "./library.js";
import { WORD_BANK } from "./words.js";
import { WORD_BANK_EXTRA } from "./words-extra.js";
import { PHRASAL, PARTICLES } from "./phrasal.js";
import { EXPRESSIONS } from "./expressions.js";
import { LINKERS, LINK_FUNCTIONS } from "./toolkit.js";
import { AWL_SUBLISTS } from "./awl.js";

// The study deck starts at B1 (v0.6): A1–A2 cards were removed at the learner's request.
export const LEVEL_ORDER = Object.freeze(["B1", "B2", "C1", "C2"]);
export const TOPICS = Object.freeze({
  biology: "Biyoloji ve ekoloji",
  earth: "Yer bilimi ve iklim",
  space: "Astronomi ve fizik",
  history: "Tarih ve arkeoloji",
  society: "Psikoloji ve toplum",
  economy: "Ekonomi ve iş",
  arts: "Sanat ve dil",
  tech: "Teknoloji",
  campus: "Kampüs yaşamı",
  academic: "Akademik dil",
  phrasal: "Öbek fiiller (phrasal verbs)",
  expr: "Kalıplar (sık ifadeler)",
  link: "Bağlaçlar ve geçiş ifadeleri",
});
const richTopic = (text) => (/campus|course|study planning|study routine|time management|people on campus/.test(String(text)) ? "campus" : "academic");
export const POS_TR = Object.freeze({ n: "i.", v: "f.", adj: "s.", adv: "zf.", phr: "ifade", prep: "ed.", conj: "bağ.", pv: "öbek f.", expr: "kalıp", link: "bağlaç" });
export const OBJECT_PATTERNS = Object.freeze({ separable: "Ayrılabilir: nesne ortaya da girebilir; zamir mutlaka ortaya (turn it off)", inseparable: "Nesne yeri sabit: nesne edattan sonra gelir (look after it)", intransitive: "Bu anlamda nesnesiz (the plane took off)" });
export const PHRASAL_LESSON = "G6.5";
// Editorial mapping of the phrasal file's study priority to deck levels.
const PRIORITY_LEVEL = { 1: "B1", 2: "B2", 3: "C1" };

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

/** One card per phrasal expression; every sense keeps its pattern, example and note for the card back. */
const gloss = (text) => String(text).trim().replace(/\.$/u, "").replace(/^./u, (ch) => ch.toLocaleLowerCase("tr"));
function phrasalDetails([, id, , senses]) {
  return { id, senses: senses.map(([meaning, pattern, object, example, exampleTr, note, category]) => ({ meaning: meaning.split(/\s*;\s*/).map(gloss).join("; "), pattern, object, example, exampleTr, note, category })) };
}
function phrasalMeaning(senses) {
  // One sense: all its glosses (Tureng-style lines). Several senses: the first gloss of each.
  if (senses.length === 1) return senses[0][0].split(/\s*;\s*/).map(gloss).join("; ");
  return senses.map(([meaning]) => gloss(meaning.split(/\s*;\s*/)[0])).join("; ");
}

/** Merges two lists keeping each in order, spacing the second evenly through the first. */
function interleave(words, phrasal) {
  const out = [];
  let i = 0, j = 0;
  while (i < words.length || j < phrasal.length) {
    const nextWord = (i + 1) / (words.length + 1), nextPhrasal = (j + 1) / (phrasal.length + 1);
    if (j < phrasal.length && (i >= words.length || nextPhrasal < nextWord)) out.push(phrasal[j++]);
    else out.push(words[i++]);
  }
  return out;
}

function buildDeck() {
  const cards = [];
  for (const level of LEVEL_ORDER) {
    for (const item of vocabulary.filter((entry) => entry.level === level)) {
      cards.push({ ...item, pos: richPos(item.partOfSpeech), topicKey: richTopic(item.topic), rich: true });
    }
    for (const [word, pos, meaning, example, topic = "academic"] of [...(WORD_BANK[level] ?? []), ...(WORD_BANK_EXTRA[level] ?? [])]) {
      if (cards.some((card) => card.word.toLowerCase() === word.toLowerCase())) continue;
      cards.push({ id: `w-${slug(word)}`, word, level, pos, partOfSpeech: pos, meaning, example, definition: "", collocations: [], family: [], topic, topicKey: topic, rich: false });
    }
  }
  // Phrasal verbs are woven into the level decks (and grouped under one topic), not kept as a separate kit.
  const byWord = new Map(cards.map((card) => [card.word.toLowerCase(), card]));
  for (const row of PHRASAL) {
    const [expression, , priority, senses] = row;
    const existing = byWord.get(expression);
    if (existing) {
      Object.assign(existing, { pos: "pv", topicKey: "phrasal", phrasal: phrasalDetails(row) });
      continue;
    }
    const level = PRIORITY_LEVEL[priority];
    const card = { id: `pv-${row[1]}`, word: expression, level, pos: "pv", partOfSpeech: "pv", meaning: phrasalMeaning(senses), example: senses[0][3], definition: "", collocations: [], family: [], topic: "phrasal", topicKey: "phrasal", rich: false, phrasal: phrasalDetails(row) };
    cards.push(card);
    byWord.set(expression, card);
  }
  // Kalıplar (fixed expressions): an existing card keeps its id and gains the details.
  for (const [expression, meaning, pattern, example, exampleTr, note] of EXPRESSIONS) {
    const details = { pattern, example, exampleTr, note };
    const existing = byWord.get(expression);
    if (existing) {
      existing.expr = details;
      if (!existing.phrasal) Object.assign(existing, { pos: "expr", topicKey: "expr" });
      continue;
    }
    const card = { id: `ex-${slug(expression)}`, word: expression, level: "B1", pos: "expr", partOfSpeech: "expr", meaning, example, definition: "", collocations: [], family: [], topic: "expr", topicKey: "expr", rich: false, expr: details };
    cards.push(card);
    byWord.set(expression, card);
  }
  // Linking words: the quiz asks for the function, so options never share one.
  for (const [linker, func, meaning, pattern, example, exampleTr, note, level] of LINKERS) {
    const details = { func, pattern, example, exampleTr, note };
    const existing = byWord.get(linker.toLowerCase());
    if (existing) {
      Object.assign(existing, { pos: "link", topicKey: "link", link: details });
      continue;
    }
    const card = { id: `ln-${slug(linker)}`, word: linker, level, pos: "link", partOfSpeech: "link", meaning, example, definition: "", collocations: [], family: [], topic: "link", topicKey: "link", rich: false, link: details };
    cards.push(card);
    byWord.set(linker.toLowerCase(), card);
  }
  markAwl(cards);
  // Spread phrasal verbs, expressions and linkers evenly through each level, so a level set mixes them with other words.
  const special = (card) => Boolean(card.phrasal || card.expr || card.link);
  const mixed = LEVEL_ORDER.flatMap((level) => interleave(
    cards.filter((card) => card.level === level && !special(card)),
    cards.filter((card) => card.level === level && special(card)),
  ));
  return Object.freeze(mixed);
}

/** AWL headword families → sublist number; a card is marked when its word belongs to a family. */
function awlFamilies() {
  const map = new Map();
  const add = (form, list) => { if (!map.has(form)) map.set(form, list); };
  AWL_SUBLISTS.forEach((words, index) => {
    for (const head of words) {
      const us = head.replace(/ise$/u, "ize").replace(/yse$/u, "yze").replace(/our$/u, "or").replace(/ence$/u, "ense");
      for (const base of new Set([head, us])) {
        const stem = base.replace(/e$/u, "");
        const forms = [base, `${base}s`, `${base}d`, `${base}ed`, `${stem}ing`];
        if (base.length > 3) {
          forms.push(...["al", "ion", "ation", "ment", "ity", "ive", "ance", "ence", "ic", "ure", "ent", "ant", "er", "ial", "ly"].map((suffix) => `${stem}${suffix}`));
          forms.push(base.replace(/ate$/u, "ation"), base.replace(/ent$/u, "ence"), base.replace(/ant$/u, "ance"), base.replace(/y$/u, "ies"));
        }
        for (const form of forms) add(form, index + 1);
      }
    }
  });
  return map;
}
function markAwl(cards) {
  const families = awlFamilies();
  for (const card of cards) {
    const list = families.get(card.word.toLowerCase());
    if (list) card.awl = list;
  }
}

export const DECK = buildDeck();
export const DECK_BY_ID = new Map(DECK.map((card) => [card.id, card]));
export { LINK_FUNCTIONS };

const PARTICLE_BY_WORD = new Map(PARTICLES.map(([particle, hint, examples]) => [particle, { particle, hint, examples }]));
/**
 * Particle hints for a phrasal card: what "up", "off", "down" … usually add,
 * with other deck expressions that share the particle (fill up → give up, use up …).
 */
export function particleHints(card) {
  if (!card?.phrasal) return [];
  const words = card.word.toLowerCase().split(/\s+/u).slice(1).filter((word) => PARTICLE_BY_WORD.has(word));
  return [...new Set(words)].map((word) => {
    const { particle, hint, examples } = PARTICLE_BY_WORD.get(word);
    const others = DECK.filter((other) => other.phrasal && other.id !== card.id && other.word.toLowerCase().split(/\s+/u).slice(1).includes(word)).map((other) => other.word);
    const seen = [...new Set([...examples.map((x) => String(x).toLowerCase()), ...others])].filter((x) => x !== card.word.toLowerCase()).slice(0, 6);
    return { particle, hint, examples: seen };
  });
}

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
