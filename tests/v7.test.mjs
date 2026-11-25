import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { DECK, DECK_BY_ID, TOPICS, POS_TR, OBJECT_PATTERNS, PHRASAL_LESSON, meaningsOf, choicesFor } from "../data/vocab.js";
import { PHRASAL, PHRASAL_GRAMMAR, PARTICLES, PHRASAL_META } from "../data/phrasal.js";
import { LESSON_BY_CODE } from "../data/grammar.js";
import { gradeLessonItem } from "../core.js";

test("all 554 phrasal expressions and their 704 senses come through from the learner's file", () => {
  assert.equal(PHRASAL.length, 554);
  assert.equal(PHRASAL.reduce((sum, row) => sum + row[3].length, 0), 704);
  assert.equal(PHRASAL_META.expressions, 554);
  assert.equal(PHRASAL_GRAMMAR.length, 12);
  assert.equal(PARTICLES.length, 40);
  for (const [expression, id, priority, senses] of PHRASAL) {
    assert.match(expression, /^[a-z]+( [a-z]+)+$/u, expression);
    assert.ok(id && [1, 2, 3].includes(priority), expression);
    for (const [meaning, pattern, object, example, exampleTr, , category] of senses) {
      for (const value of [meaning, pattern, example, exampleTr, category]) assert.ok(String(value).trim(), `${expression} field`);
      assert.ok(OBJECT_PATTERNS[object], `${expression} object pattern ${object}`);
    }
  }
});

test("phrasal verbs are woven into the level decks, not kept apart", () => {
  const cards = DECK.filter((card) => card.phrasal);
  assert.equal(cards.length, 554, "one card per expression");
  for (const card of cards) {
    assert.equal(card.pos, "pv");
    assert.equal(card.topicKey, "phrasal");
    assert.ok(["B1", "B2", "C1"].includes(card.level), card.id);
    assert.ok(meaningsOf(card).length >= 1 && meaningsOf(card).length <= 3, card.id);
  }
  assert.ok(POS_TR.pv && TOPICS.phrasal);
  for (const level of ["B1", "B2", "C1"]) {
    const atLevel = DECK.filter((card) => card.level === level);
    assert.ok(atLevel.some((card) => card.phrasal) && atLevel.some((card) => !card.phrasal), `${level} mixes both`);
  }
  // Expressions that were already in the deck keep their id (and progress) and gain the details.
  assert.equal(DECK_BY_ID.get("w-carry-out")?.phrasal?.senses.length >= 1, true);
  assert.equal(DECK.filter((card) => card.word === "carry out").length, 1);
  assert.equal(new Set(DECK.map((card) => card.word)).size, DECK.length);
  // Multi-sense cards keep every sense for the card back.
  const takeOff = DECK.find((card) => card.word === "take off");
  assert.ok(takeOff.phrasal.senses.length >= 3);
  assert.ok(takeOff.phrasal.senses.every((sense) => !/\.$/u.test(sense.meaning) && sense.meaning[0] === sense.meaning[0].toLocaleLowerCase("tr")));
});

test("phrasal cards get phrasal distractors", () => {
  const cards = DECK.filter((card) => card.phrasal && card.level === "B1");
  let phrasalOptions = 0, total = 0;
  for (const card of cards) {
    const { options, answer } = choicesFor(card, DECK);
    assert.equal(options[answer], card);
    total += 3;
    phrasalOptions += options.filter((option) => option !== card && option.pos === "pv").length;
  }
  assert.ok(phrasalOptions / total > 0.95, `${phrasalOptions}/${total}`);
});

test("lesson G6.5 is a complete Tam anlatım built on the same material and links to the cards", () => {
  const lesson = LESSON_BY_CODE.get(PHRASAL_LESSON);
  const full = lesson.full;
  assert.ok(full && full.particles === true);
  assert.equal(full.deck.scope, "t:phrasal");
  assert.ok(full.structure.rows.length >= 5 && full.examples.length >= 4);
  assert.ok(full.mistakes.length >= 1 && full.mistakes.length <= 3);
  const order = { recognition: 0, transformation: 1, production: 2 };
  const stages = full.exercises.map((item) => order[item.stage]);
  assert.deepEqual(stages, [...stages].sort((a, b) => a - b));
  for (const item of [...full.exercises, ...full.review]) {
    if (item.type === "free") continue;
    const response = item.type === "mcq" ? item.answer : item.type === "order" ? item.answer.replace(/\.$/, "").split(" ").map((word) => item.tokens.indexOf(word)) : item.answer;
    assert.equal(gradeLessonItem(item, response).correct, true, item.id);
  }
});

test("the card back and the word list show the phrasal pattern, and the lesson shows the particle table", async () => {
  const [app, grammar] = await Promise.all([readFile(new URL("../app.js", import.meta.url), "utf8"), readFile(new URL("../views/grammar.js", import.meta.url), "utf8")]);
  assert.match(app, /card\.phrasal\?phrasalBack\(card\)/);
  assert.match(app, /w\.phrasal\.senses\.map\(s=>e\(s\.pattern\)\)/);
  assert.match(grammar, /full\.particles \? particleTable\(\) : ""/);
  assert.match(grammar, /data-action="study" data-scope="\$\{e\(full\.deck\.scope\)\}"/);
});

test("a level set mixes phrasal verbs with other words from the first card on", () => {
  for (const level of ["B1", "B2", "C1"]) {
    const firstTwenty = DECK.filter((card) => card.level === level).slice(0, 20);
    const phrasal = firstTwenty.filter((card) => card.phrasal).length;
    assert.ok(phrasal >= 1 && phrasal <= 17, `${level}: ${phrasal}/20 phrasal in the first set`);
  }
});
