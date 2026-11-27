// Typed completion of a card's example sentence (v0.9): after recognising a card
// with four options, the learner types the hidden end of the target word in its
// own sentence, Complete-the-Words style (ter____ → rain). The sentence form is
// matched, not the dictionary form: carry out → "carried out", turn off → "turn
// the light off" (two gaps), put up with → three gaps. Pure functions, no DOM.

import { IRREGULAR_VERBS } from "./data/irregular.js";

const PLACEHOLDERS = new Set(["someone", "something", "somebody", "sb", "sth", "doing", "one's", "someone's", "somewhere", "…", "...", "etc"]);
const BE = ["be", "am", "is", "are", "was", "were", "been", "being", "'m", "'s", "'re"];
const HAVE = ["have", "has", "had", "having", "'ve", "'d"];
const DO = ["do", "does", "did", "done", "doing"];
const IRREGULAR = new Map();
for (const [v1, v2, v3] of IRREGULAR_VERBS) {
  const forms = new Set([v1, ...v2.split("/"), ...v3.split("/")]);
  for (const base of v1.split("/")) IRREGULAR.set(base, forms);
}

const clean = (text) => String(text ?? "").toLowerCase().replace(/[’‘]/gu, "'").trim();

/** Every inflected form a word can take in a sentence (verb, noun or adjective endings). */
export function wordForms(word) {
  const w = clean(word);
  const forms = new Set([w]);
  if (w === "be") BE.forEach((f) => forms.add(f));
  if (w === "have") HAVE.forEach((f) => forms.add(f));
  if (w === "do") DO.forEach((f) => forms.add(f));
  for (const f of IRREGULAR.get(w) ?? []) forms.add(f);
  if (w.length < 2) return forms;
  const stem = w.replace(/e$/u, "");
  const last = w.at(-1);
  forms.add(`${w}s`).add(`${w}es`).add(`${w}d`).add(`${w}ed`).add(`${w}ing`).add(`${stem}ing`).add(`${stem}ed`);
  if (/[^aeiou]y$/u.test(w)) forms.add(`${w.slice(0, -1)}ies`).add(`${w.slice(0, -1)}ied`);
  if (/ie$/u.test(w)) forms.add(`${w.slice(0, -2)}ying`);
  if (/[^aeiou][aeiou][bdgklmnprt]$/u.test(w)) forms.add(`${w}${last}ed`).add(`${w}${last}ing`).add(`${w}${last}er`);
  forms.add(`${w}er`).add(`${w}est`).add(`${stem}er`).add(`${stem}est`).add(`${w}ly`);
  for (const form of [...forms]) forms.add(`${form}'s`);
  forms.add(`${w}s'`);
  return forms;
}

/** The word to look for: the card's word or phrase without "…", alternatives or brackets. */
export function targetWords(card) {
  let text = String(card?.phrase ?? card?.word ?? "");
  text = text.split(/\s+\/\s+|\s*;\s*/u)[0];
  text = text.replace(/\([^)]*\)/gu, " ").replace(/[…?!.,]/gu, " ").replace(/(^|\s)-\S*/gu, " ").replace(/\s+/gu, " ").trim();
  // Articles change in real sentences (make a mistake → makes mistakes), so they are not gaps.
  // Subject pronouns (I, I'd, we'll) and suffix notes (-ing) are not gaps either.
  return text.split(" ").map(clean).filter((t) => t && !PLACEHOLDERS.has(t) && !["a", "an", "the"].includes(t)
    && !/^(i|you|we|they|he|she|it)('[a-z]+)?$/u.test(t) && !t.startsWith("-"));
}
const AUXILIARY = new Set(["be", "have", "had", "would", "will", "get"]);

function exampleOf(card) {
  return String(card?.example ?? card?.expr?.example ?? card?.phrasal?.senses?.[0]?.example ?? "").trim();
}

const TOKEN = /[A-Za-z]+(?:['’][A-Za-z]+)*(?:-[A-Za-z]+)*/gu;

/** How many letters stay visible: CW style, roughly the first half. */
export function visibleLength(word) {
  const n = word.length;
  if (n <= 2) return 0;
  if (n === 3) return 1;
  return Math.floor(n / 2);
}

/**
 * A completion item for a card, or null when its example sentence does not
 * contain the target. Returns { sentence, parts, gaps } where parts mixes plain
 * text and { gap: index }, and each gap is { shown, hidden, full }.
 */
export function fillItem(card) {
  const sentence = exampleOf(card);
  const words = targetWords(card);
  const item = locate(sentence, words);
  // "be interested in" in "I'm interested in …": the contracted auxiliary is not a gap.
  if (!item && words.length > 1 && AUXILIARY.has(words[0])) return locate(sentence, words.slice(1));
  return item;
}

function locate(sentence, targets) {
  if (!sentence || !targets.length || targets.length > 5) return null;
  const tokens = [...sentence.matchAll(TOKEN)].map((m) => ({ text: m[0], start: m.index, end: m.index + m[0].length, low: clean(m[0]) }));
  const multi = targets.length > 1;
  // Multi-word targets: the first word is inflected, the rest (particles, articles) are exact.
  const matchesAt = (tokenIndex, targetIndex) => {
    const token = tokens[tokenIndex]?.low;
    if (!token) return false;
    const target = targets[targetIndex];
    if (!multi || targetIndex === 0) return wordForms(target).has(token);
    return token === target || (target === "one's" && /^(my|your|his|her|its|our|their)$/u.test(token)) || wordForms(target).has(token) && target.length > 3;
  };
  let found = null;
  for (let i = 0; i < tokens.length && !found; i += 1) {
    if (!matchesAt(i, 0)) continue;
    const picked = [i];
    let cursor = i;
    for (let t = 1; t < targets.length; t += 1) {
      let next = -1;
      // Up to four words may come between (turn the kitchen light off).
      for (let j = cursor + 1; j <= Math.min(tokens.length - 1, cursor + 5); j += 1) if (matchesAt(j, t)) { next = j; break; }
      if (next < 0) break;
      picked.push(next);
      cursor = next;
    }
    if (picked.length === targets.length) found = picked;
  }
  if (!found) return null;
  const parts = [];
  const gaps = [];
  let at = 0;
  for (const index of found) {
    const token = tokens[index];
    if (token.start > at) parts.push(sentence.slice(at, token.start));
    const keep = visibleLength(token.text);
    gaps.push({ shown: token.text.slice(0, keep), hidden: token.text.slice(keep), full: token.text });
    parts.push({ gap: gaps.length - 1 });
    at = token.end;
  }
  if (at < sentence.length) parts.push(sentence.slice(at));
  return { sentence, parts, gaps };
}

/**
 * Grades typed answers: each gap accepts the missing letters or the whole word.
 * Capital letters, outer spaces and curly apostrophes never make an answer wrong;
 * a wrong ending (tense, plural) does.
 */
export function gradeFill(item, responses) {
  const list = Array.isArray(responses) ? responses : [];
  const results = item.gaps.map((gap, index) => {
    const typed = clean(list[index]);
    return Boolean(typed) && (typed === clean(gap.hidden) || typed === clean(gap.full));
  });
  return { correct: results.every(Boolean), results };
}
