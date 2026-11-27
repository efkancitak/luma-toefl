import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { gapKind, clozeReport, GAP_KINDS, createState, validateBackup, gradeAnswer } from "../core.js";
import { exercises } from "../data/content.js";
import { DECK, TOPICS } from "../data/vocab.js";
import { WORD_BANK } from "../data/words.js";
import { PHRASES, INTERVIEW_SETS, ANSWER_PLAN, SPEAKING_GUIDE } from "../data/speaking.js";
import { MODEL_SEGMENTS, plainModel, STEPS } from "../data/speaking-models.js";

const cloze = exercises.filter((item) => item.type === "gaps");

// ── Vocabulary topics ──────────────────────────────────────────────────────

test("every card belongs to one of the TOEFL subject topics, and each topic deck has real content", () => {
  for (const rows of Object.values(WORD_BANK)) for (const row of rows) assert.ok(TOPICS[row[4]], `${row[0]} topic ${row[4]}`);
  for (const card of DECK) assert.ok(TOPICS[card.topicKey], `${card.id} topic`);
  for (const key of Object.keys(TOPICS)) assert.ok(DECK.filter((card) => card.topicKey === key).length >= 20, `${key} deck size`);
  for (const word of ["photosynthesis", "sediment", "excavation", "inflation", "dissertation", "hypothesize"]) {
    assert.ok(DECK.some((card) => card.word === word), `${word} is in the deck`);
  }
});

// ── Complete the Words ─────────────────────────────────────────────────────

test("24 Complete the Words passages, each with a Turkish meaning for every gap", () => {
  assert.ok(cloze.length >= 24, `${cloze.length} passages`);
  for (const item of cloze) {
    assert.equal(item.gapsTr?.length, 10, `${item.id} gap meanings`);
    for (const meaning of item.gapsTr) assert.ok(typeof meaning === "string" && meaning.trim(), item.id);
    assert.ok(item.passageTr?.length > 150, `${item.id} translation`);
    // From cw-09 on, the shown part is exactly the first half, as on the test (the first eight keep their v0.1 split so old answers still match).
    if (Number(item.id.slice(3)) >= 9) assert.ok(item.gaps.every((gap) => gap.prefix.length === Math.floor((gap.prefix + gap.answer).length / 2)), `${item.id} shows the first half`);
  }
  const levels = new Set(cloze.map((item) => item.level));
  for (const level of ["B1", "B2", "C1"]) assert.ok(levels.has(level), `${level} passages exist`);
});

test("gaps are classified as structure words, suffixed words or plain words", () => {
  assert.equal(gapKind("which"), "function");
  assert.equal(gapKind("through"), "function");
  assert.equal(gapKind("The"), "function");
  assert.equal(gapKind("surfaces"), "form");
  assert.equal(gapKind("slowly"), "form");
  assert.equal(gapKind("carried"), "form");
  assert.equal(gapKind("summer"), "word", "an ending that only looks like a suffix");
  assert.equal(gapKind("sand"), "word");
  const counts = { function: 0, form: 0, word: 0 };
  for (const item of cloze) for (const gap of item.gaps) counts[gapKind(gap.prefix + gap.answer)] += 1;
  for (const [kind, n] of Object.entries(counts)) assert.ok(n >= 40, `${kind}: ${n} gaps across the bank`);
  assert.deepEqual(Object.keys(GAP_KINDS).sort(), ["form", "function", "word"]);
});

test("the cloze report marks each gap and totals results by kind", () => {
  const item = cloze.find((entry) => entry.id === "cw-10");
  const answers = item.gaps.map((gap) => gap.answer);
  answers[3] = "ey"; // "the" → wrong structure word
  answers[0] = "CKS"; // case does not matter
  const report = clozeReport(item, answers);
  assert.equal(report.rows.length, 10);
  assert.equal(report.rows.filter((row) => row.correct).length, 9);
  assert.equal(report.rows[3].correct, false);
  assert.equal(report.rows[3].kind, "function");
  assert.equal(report.rows[0].word, "picks");
  const sum = Object.values(report.byKind).reduce((acc, b) => acc + b.total, 0);
  assert.equal(sum, 10);
  assert.equal(gradeAnswer(item, answers).score, 0.9, "the report agrees with grading");
});

test("easy-mode letters are stored with the typed ending, so grading stays the same", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /d\.response\[Number\(el\.dataset\.gap\)\]=\(el\.dataset\.shown\|\|''\)\+el\.value/);
  assert.match(app, /cwMode\(d\)==='easy'\|\|Object\.keys\(d\.hints\|\|\{\}\)\.length>0/, "easy mode and hints make the attempt assisted");
});

test("Complete the Words mode and hint levels round-trip in drafts and reject bad values", () => {
  const state = createState(new Date("2026-11-25T10:00:00Z"));
  state.drafts["cw-10"] = { response: ["cks", "", "nd"], mode: "learn", hints: { 0: 1, 3: 4 } };
  const restored = validateBackup(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.drafts["cw-10"].mode, "learn");
  assert.deepEqual({ ...restored.drafts["cw-10"].hints }, { 0: 1, 3: 4 });
  const bad = JSON.parse(JSON.stringify(state));
  bad.drafts["cw-10"].mode = "turbo";
  assert.throws(() => validateBackup(bad), /mode/);
  const bad2 = JSON.parse(JSON.stringify(state));
  bad2.drafts["cw-10"].hints = { x: 1 };
  assert.throws(() => validateBackup(bad2), /hints/);
});

// ── Speaking ───────────────────────────────────────────────────────────────

test("every interview model answer is annotated in four steps at a 45-second pace", () => {
  const questions = INTERVIEW_SETS.flatMap((set) => set.questions);
  assert.equal(Object.keys(MODEL_SEGMENTS).length, questions.length);
  for (const q of questions) {
    const segments = MODEL_SEGMENTS[q.id];
    assert.ok(segments, `${q.id} has an annotated model`);
    assert.deepEqual(segments.map(([step]) => step), Object.keys(STEPS));
    assert.equal(q.model, plainModel(segments));
    const words = q.model.split(/\s+/).length;
    assert.ok(words >= 110 && words <= 135, `${q.id}: ${words} words`);
    assert.ok(segments.flatMap(([, text]) => text.match(/\{[^}]+\}/g) ?? []).length >= 2, `${q.id} highlights reusable phrases`);
    assert.ok(!/[{}]/.test(q.model), `${q.id} spoken text has no markup`);
  }
  assert.deepEqual(ANSWER_PLAN.map((step) => step.key), ["answer", "explain", "example", "result"]);
});

test("the speaking guide covers scoring, pace, openers, ways to expand and delivery", () => {
  assert.equal(SPEAKING_GUIDE.scoring.length, 4);
  // v0.9: no word-count target; the guide explains why (F19).
  assert.doesNotMatch(SPEAKING_GUIDE.pace, /110/);
  assert.match(SPEAKING_GUIDE.pace, /kelime sayısı belirtmez/u);
  assert.ok(SPEAKING_GUIDE.openers.length >= 3);
  assert.equal(SPEAKING_GUIDE.expand.length, 3);
  assert.ok(SPEAKING_GUIDE.expand.some(([, text]) => /mixed feelings/.test(text)));
  assert.ok(SPEAKING_GUIDE.delivery.some((line) => /anlama göre/u.test(line)), "intonation follows meaning, not punctuation");
  assert.ok(!SPEAKING_GUIDE.delivery.some((line) => /virgülden önce/u.test(line)), "no rule tied to commas");
});

test("the phrase bank includes the high-value speaking phrases", () => {
  const phrases = PHRASES.map((p) => p.phrase);
  for (const phrase of ["Honestly, …", "I definitely think …", "I have to admit …", "Even though …", "Recently, …", "As a matter of fact, …", "Except when …", "Another way to think about it is …", "I hardly ever …", "Well, to be honest, I have mixed feelings about this question."]) {
    assert.ok(phrases.includes(phrase), phrase);
  }
  assert.ok(PHRASES.every((p) => !["A1", "A2"].includes(p.level)), "phrase levels start at B1 like the word deck");
  assert.equal(new Set(PHRASES.map((p) => p.phrase)).size, PHRASES.length, "no duplicate phrases");
});
