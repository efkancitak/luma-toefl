import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { buildSet, createState, validateBackup, salvageBackup } from "../core.js";
import { exercises } from "../data/content.js";
import { WORD_BANK } from "../data/words.js";
import { DECK, DECK_BY_ID, LEVEL_ORDER, POS_TR, meaningsOf, choicesFor } from "../data/vocab.js";
import { PHRASES } from "../data/speaking.js";

// ── Vocabulary deck ────────────────────────────────────────────────────────

test("the deck holds over a thousand unique B1–C2 words, more at each level up to B2", () => {
  assert.ok(DECK.length >= 1100, `${DECK.length} cards`);
  assert.deepEqual(LEVEL_ORDER, ["B1", "B2", "C1", "C2"]);
  assert.ok(!DECK.some((card) => card.level === "A1" || card.level === "A2"), "no A1–A2 cards in the study deck");
  const count = Object.fromEntries(LEVEL_ORDER.map((level) => [level, DECK.filter((card) => card.level === level).length]));
  assert.ok(count.B1 >= 250 && count.B2 >= 350 && count.C1 >= 280 && count.C2 >= 140, JSON.stringify(count));
  assert.ok(count.B1 < count.B2, JSON.stringify(count));
  const words = DECK.map((card) => card.word.trim().toLowerCase());
  assert.equal(new Set(words).size, words.length, "no word appears twice");
  assert.equal(new Set(DECK.map((card) => card.id)).size, DECK.length, "ids are unique");
});

test("every card has a part of speech, one to three Turkish meanings and an English example", () => {
  for (const [level, rows] of Object.entries(WORD_BANK)) {
    assert.ok(LEVEL_ORDER.includes(level));
    for (const row of rows) assert.equal(row.length, 5, JSON.stringify(row));
  }
  for (const card of DECK) {
    assert.ok(POS_TR[card.pos], `${card.id} part of speech ${card.pos}`);
    const meanings = meaningsOf(card);
    assert.ok(meanings.length >= 1 && meanings.length <= 3, `${card.id} meanings`);
    assert.match(card.example, /^[A-Z0-9"'].*[.?!]["']?$/u, `${card.id} example is a sentence`);
    // Phrasal verbs often use irregular past forms (broke out, came across): check the particle instead of the verb stem.
    // Multi-word cards (phrasal verbs, kalıplar, linkers) are checked by their last word.
    const head = card.word.toLowerCase().replace(/\s*\(.*?\)\s*/gu, " ").trim();
    const probe = head.includes(" ") || card.pos === "pv" ? head.split(" ").at(-1) : head.slice(0, 3);
    assert.ok(card.example.toLowerCase().includes(probe), `${card.id} example uses the word`);
  }
});

test("word ids are stable: derived from the word, so progress survives later edits", () => {
  assert.equal(DECK_BY_ID.get("w-achieve")?.word, "achieve");
  assert.equal(DECK_BY_ID.get("w-cope-with")?.word, "cope with");
  assert.equal(DECK_BY_ID.get("v031")?.word, "analyze", "v0.1 ids are kept");
  assert.equal(DECK_BY_ID.get("v001"), undefined, "A1 cards are no longer in the deck");
});

test("multiple-choice options: four, one correct, no shared meaning, same every time", () => {
  for (const card of DECK) {
    const first = choicesFor(card, DECK);
    assert.equal(first.options.length, 4, card.id);
    assert.equal(first.options[first.answer], card);
    assert.equal(new Set(first.options.map((option) => option.id)).size, 4);
    const own = new Set(meaningsOf(card).map((m) => m.toLocaleLowerCase("tr")));
    for (const option of first.options) {
      if (option === card) continue;
      assert.ok(!meaningsOf(option).some((m) => own.has(m.toLocaleLowerCase("tr"))), `${card.id}: ${option.id} shares a meaning`);
    }
    const again = choicesFor(card, DECK);
    assert.deepEqual(again.options.map((option) => option.id), first.options.map((option) => option.id));
  }
  const sameLevel = DECK.filter((card) => card.level === "B1").map((card) => choicesFor(card, DECK)).flatMap((r) => r.options).filter((o) => o.level === "B1").length;
  assert.ok(sameLevel / (DECK.filter((card) => card.level === "B1").length * 4) > 0.95, "distractors come from the same level");
  const positions = [0, 0, 0, 0];
  for (const card of DECK) positions[choicesFor(card, DECK).answer] += 1;
  for (const n of positions) assert.ok(n > DECK.length * 0.18, `answer positions are balanced: ${positions}`);
});

test("phrase options never offer a phrase with the same function as the answer", () => {
  for (const phrase of PHRASES) {
    const pool = PHRASES.filter((other) => other.function !== phrase.function);
    const { options, answer } = choicesFor(phrase, pool, { key: (p) => [p.phrase.toLowerCase()] });
    assert.equal(options[answer], phrase);
    assert.equal(options.filter((option) => option.function === phrase.function).length, 1, phrase.id);
  }
});

// ── Full practice sets ─────────────────────────────────────────────────────

test("a set covers its whole scope from A1 to C2 and never repeats a solved item until all are solved", () => {
  const rank = (level) => LEVEL_ORDER.indexOf(level);
  const all = buildSet(exercises, []);
  assert.equal(all.items.length, exercises.length);
  assert.equal(all.repeat, false);
  for (let i = 1; i < all.items.length; i += 1) assert.ok(rank(all.items[i - 1].level) <= rank(all.items[i].level), "ordered by level");

  const reading = buildSet(exercises, [], { skill: "reading" });
  assert.ok(reading.items.every((item) => item.skill === "reading"));
  const solved = reading.items.slice(0, 5).map((item) => ({ itemId: item.id }));
  const next = buildSet(exercises, solved, { skill: "reading" });
  assert.equal(next.items.length, reading.items.length - 5);
  assert.equal(next.solved, 5);
  assert.ok(!next.items.some((item) => solved.some((a) => a.itemId === item.id)), "solved items are not presented again");
  assert.equal(next.items[0].id, reading.items[5].id, "the set resumes at the first unsolved item");

  const everything = reading.items.map((item) => ({ itemId: item.id }));
  const round = buildSet(exercises, everything, { skill: "reading" });
  assert.equal(round.repeat, true);
  assert.equal(round.items.length, reading.items.length);

  const task = buildSet(exercises, [], { skill: "reading", taskType: "complete-words" });
  assert.ok(task.items.length >= 8 && task.items.every((item) => item.taskType === "complete-words"));
});

test("every Complete the Words passage has a Turkish translation", () => {
  for (const item of exercises.filter((entry) => entry.type === "gaps")) {
    assert.ok(typeof item.passageTr === "string" && item.passageTr.length > 200, `${item.id} translation`);
  }
});

// ── Saved state ────────────────────────────────────────────────────────────

test("learned words and the multiple-choice session round-trip and stay optional", () => {
  const state = createState(new Date("2026-11-19T10:00:00Z"));
  assert.deepEqual(state.learned, []);
  state.learned = ["w-achieve", "v001"];
  state.reviewSession = { itemIds: ["w-achieve", "w-adapt"], index: 1, revealed: true, pick: 2, right: 1, wrong: 0, scope: "w:B1" };
  const restored = validateBackup(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.learned, ["w-achieve", "v001"]);
  assert.deepEqual(restored.reviewSession, state.reviewSession);

  const older = JSON.parse(JSON.stringify(state));
  delete older.learned;
  older.reviewSession = { itemIds: ["v001"], index: 0, revealed: false };
  const fromOlder = validateBackup(older);
  assert.deepEqual(fromOlder.learned, []);
  assert.deepEqual(fromOlder.reviewSession, { itemIds: ["v001"], index: 0, revealed: false });

  const bad = JSON.parse(JSON.stringify(state));
  bad.reviewSession.pick = 7;
  assert.throws(() => validateBackup(bad), /reviewSession\.pick/);
  const salvaged = salvageBackup(bad);
  assert.equal(salvaged.state.reviewSession, null);
  assert.deepEqual(salvaged.state.learned, ["w-achieve", "v001"]);
});

test("the app no longer offers a level filter, a session length or a task timer switch", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const removed of ["practice-level", "data-action=\"duration\"", "id=\"timed\"", "id=\"quiet\"", "BUGÜN NE KADAR VAKTİN VAR"]) {
    assert.ok(!app.includes(removed), `${removed} removed`);
  }
  assert.ok(!app.includes("✳") && !(await readFile(new URL("../index.html", import.meta.url), "utf8")).includes("✳"), "the logo is not an emoji character");
});
