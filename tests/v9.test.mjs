// v0.9: findings report fixes and the learner's decisions (27 Nov 2026).
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { autoFix, analyzeWriting, ingForm } from "../writing.js";
import { newCardBudget, splitBudget, defaultPlanEnd, legacyPlanEnd, planDaysLeft, gradeAnswer, buildResponse, noteFill, scheduleLessonCheck, createState, validateBackup, salvageBackup, DAILY_STEP_KEYS } from "../core.js";
import { fillItem, gradeFill, wordForms } from "../fill.js";
import { exercises, EXAM_TIMING, examSeconds } from "../data/content.js";
import { BUILD_ITEMS } from "../data/build.js";
import { DECK } from "../data/vocab.js";
import { EVERYDAY } from "../data/everyday.js";
import { SPEAKING_GUIDE } from "../data/speaking-models.js";
import { GRAMMAR_REFS } from "../data/grammar-ref.js";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

test("F15: the coach keeps correct text and fixes what the report found", () => {
  const cases = [
    ["I study STEM. The CEO uses GPS at UCLA.", "I study STEM. The CEO uses GPS at UCLA."],
    ["COVID changed everything.", "COVID changed everything."],
    ["I apologise for the delay.", "I apologise for the delay."],
    ["I have worked here since two years ago.", "I have worked here for two years."],
    ["I need an x-ray tomorrow.", "I need an x-ray tomorrow."],
    ["I look forward to see you next week.", "I look forward to seeing you next week."],
    ["She is married with two children.", "She is married with two children."],
    ["We discussed about the project.", "We discussed the project."],
    ["It is a honour to be here.", "It is an honour to be here."],
    ["Dear MR CARTER", "Dear Mr. Carter"],
  ];
  for (const [input, expected] of cases) assert.equal(autoFix(input, "discussion").fixed.split("\n")[0], expected, input);
  assert.equal(ingForm("see"), "seeing");
  assert.equal(ingForm("make"), "making");
  assert.equal(ingForm("get"), "getting");
  assert.equal(ingForm("lie"), "lying");
});

test("F16: an opinion need not use fixed phrases; no green badge for unchecked grammar; she go is flagged", () => {
  const r = analyzeWriting("Universities should generally record lectures because students can review difficult ideas.", { kind: "discussion" });
  assert.ok(r.checks.find((c) => c.id === "opinion").ok);
  const plain = analyzeWriting("She go to school every day.", { kind: "discussion" });
  assert.ok(plain.warnings.some((w) => /she go/iu.test(w.wrong)), "subject–verb agreement warning");
  const clean = analyzeWriting("I believe that libraries matter because they give students a quiet place.", { kind: "discussion" });
  assert.equal(clean.criteria.find((c) => c.id === "accuracy").status, "check", "no error found ≠ correct");
  assert.ok(!analyzeWriting("Does she go to school?", { kind: "discussion" }).warnings.some((w) => /she go/iu.test(w.wrong)));
});

test("F17: every model answer meets the app's own target and passes its own checks", () => {
  for (const item of exercises.filter((x) => x.type === "writing")) {
    const r = analyzeWriting(item.modelAnswer, { kind: item.taskType, prompt: item.prompt });
    assert.ok(r.words >= (item.taskType === "email" ? 80 : 100), `${item.id}: ${r.words} words`);
    for (const c of r.criteria) assert.ok(["ok", "check"].includes(c.status), `${item.id} ${c.id}: ${c.status}`);
  }
});

test("F01: 20–30 new cards in total, fewer as reviews pile up, none at 140; missed days do not add up", () => {
  assert.equal(newCardBudget(0), 30);
  assert.equal(newCardBudget(40), 30);
  assert.equal(newCardBudget(80), 20);
  assert.equal(newCardBudget(140), 0);
  for (let due = 0; due < 200; due += 5) assert.ok(newCardBudget(due + 5) <= newCardBudget(due), `monotonic at ${due}`);
  assert.deepEqual(splitBudget(30, [900, 500, 400]).reduce((a, b) => a + b, 0), 30);
  assert.deepEqual(splitBudget(30, [2, 0, 1]), [2, 0, 1]);
  assert.match(app, /const budget=newCardBudget\(dueAll\.length\)/u);
  assert.match(app, /data-action="more-cards"/u, "the quota never locks: more cards on demand");
});

test("F22 + user: the plan runs to the exam date (15 January); the old default is read as unset", () => {
  assert.equal(defaultPlanEnd("2027-01-15"), "2027-01-15");
  assert.equal(legacyPlanEnd("2027-01-15"), "2026-12-15");
  assert.equal(planDaysLeft("2027-01-15", "2027-01-15", new Date(2026, 10, 27, 9)), 50);
  assert.match(app, /state\.profile\.planEnd===legacyPlanEnd\(state\.profile\.examDate\)/u);
});

test("F02: core and extra pools — priority 3 phrasal verbs and C2 academic words wait in an optional pool", () => {
  const pv = DECK.filter((c) => c.phrasal);
  const count = (p) => pv.filter((c) => c.priority === p).length;
  assert.deepEqual([count(1), count(2), count(3)], [251, 264, 39]);
  assert.match(app, /function isExtra\(card\)\{if\(card\.phrasal\)return card\.priority===3;/u);
  assert.match(app, /data-action="toggle-extras"/u);
  const state = createState();
  assert.equal(state.profile.extras, false);
  assert.equal(validateBackup({ ...state, profile: { ...state.profile, extras: true } }).profile.extras, true);
});

test("A2 words are back (A1 stays out)", () => {
  assert.ok(DECK.filter((c) => c.level === "A2").length >= 100);
  assert.ok(!DECK.some((c) => c.level === "A1"));
});

test("F04–F05: typed completion uses the sentence form, splits multi-word targets and is tolerant of case only", () => {
  const card = (word) => DECK.find((c) => c.word === word);
  const terrain = fillItem(card("terrain"));
  assert.equal(terrain.gaps.length, 1);
  assert.equal(terrain.gaps[0].shown + terrain.gaps[0].hidden, "terrain");
  assert.equal(gradeFill(terrain, ["  RAIN "]).correct, true);
  assert.equal(gradeFill(terrain, ["terrain"]).correct, true, "the whole word is accepted too");
  assert.equal(gradeFill(terrain, ["rains"]).correct, false);
  const carried = fillItem(card("carry out"));
  assert.deepEqual(carried.gaps.map((g) => g.full), ["carried", "out"]);
  const turnOff = fillItem(card("turn off"));
  assert.equal(turnOff.gaps.length, 2, "turn … off: two gaps around the object");
  assert.equal(fillItem(card("put up with")).gaps.length, 3);
  assert.ok(wordForms("analyze").has("analyzes"));
  const share = DECK.filter((c) => fillItem(c)).length / DECK.length;
  assert.ok(share > 0.95, `${Math.round(share * 100)}% of cards have a completion item`);
  // Recognition, hinted and free completion are kept apart.
  const one = noteFill(undefined, "hint");
  const two = noteFill(one, "free");
  assert.deepEqual([two.hint, two.free, two.wrong, two.last], [1, 1, 0, "free"]);
  assert.match(app, /if\(fill\.length\)steps\.push\(\{key:'fill'/u, "a completion round follows today's new cards");
});

test("F04: card options change between study sessions; F07: wrong cards come back the same day", () => {
  assert.match(app, /const round=state\.reviewSession\?\.seed\?\?0;/u);
  assert.match(app, /function relearnIds\(\)/u);
  assert.ok(DAILY_STEP_KEYS.includes("fill") && DAILY_STEP_KEYS.includes("transfer"));
});

test("F08–F09: reading and listening texts carry full question sets with a reason for every option", () => {
  const sets = exercises.filter((x) => x.type === "set");
  const want = { "daily-reading": [2, 3], "academic-reading": [5, 5], conversation: [2, 2], announcement: [2, 2], "academic-talk": [4, 4] };
  for (const item of sets) {
    const [min, max] = want[item.taskType];
    assert.ok(item.questions.length >= min && item.questions.length <= max, `${item.id}: ${item.questions.length}`);
    for (const q of item.questions) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4, `${item.id} options unique`);
      assert.equal(q.why.length, 4);
      q.why.forEach((why, i) => assert.ok(i === q.answer ? why === "" : why.length > 5, `${item.id}: why ${i}`));
      assert.ok(q.focus && q.explanation, item.id);
    }
    const right = gradeAnswer(item, item.questions.map((q) => String(q.answer)));
    assert.equal(right.correct, true);
    assert.equal(gradeAnswer(item, item.questions.map((q) => String((q.answer + 1) % 4))).score, 0);
  }
  for (const item of sets.filter((x) => x.taskType === "academic-reading")) {
    const words = item.passage.split(/\s+/u).length;
    assert.ok(words >= 175 && words <= 230, `${item.id}: ${words} words`);
  }
  assert.ok(sets.length === 40);
});

test("F12: the right answer is not systematically the longest option", () => {
  const qs = exercises.flatMap((x) => (x.type === "set" ? x.questions : x.type === "mcq" ? [x] : []));
  const longest = qs.filter((q) => { const L = q.options.map((o) => o.length); return L.indexOf(Math.max(...L)) === q.answer; }).length;
  assert.ok(longest / qs.length <= 0.3, `${longest}/${qs.length} answered by picking the longest option`);
  assert.ok(!qs.some((q) => q.options.some((o) => /look green|control the weather/u.test(o))), "the easy-to-rule-out distractors are gone");
});

test("F10: Build a Sentence has a context, a frame with fixed words, one extra tile and exactly one right order", () => {
  assert.ok(BUILD_ITEMS.length >= 20);
  const perms = (n, k, pre = []) => (pre.length === k ? [pre] : Array.from({ length: n }, (_, i) => i).filter((i) => !pre.includes(i)).flatMap((i) => perms(n, k, [...pre, i])));
  for (const item of BUILD_ITEMS) {
    assert.ok(item.context && item.slots.some((s) => s !== null), item.id);
    const blanks = item.slots.filter((s) => s === null).length;
    assert.equal(item.tokens.length, blanks + 1, `${item.id}: one extra tile`);
    const right = perms(item.tokens.length, blanks).filter((p) => gradeAnswer(item, p).correct);
    assert.ok(right.length >= 1 && right.length <= 1 + item.alts.length, `${item.id}: ${right.length} right orders`);
    assert.equal(buildResponse(item, right[0]) !== null, true);
  }
});

test("F09 + user: tasks run on exam time from the ETS section averages; time-up reveals the answer every 10 s", () => {
  assert.equal(EXAM_TIMING.fixed.email, 420);
  assert.equal(EXAM_TIMING.fixed.discussion, 600);
  assert.equal(EXAM_TIMING.fixed.interview, 45);
  const byId = (id) => exercises.find((x) => x.id === id);
  assert.equal(examSeconds(byId("ar-01")), 5 * 36);
  assert.equal(examSeconds(byId("conv-01")), 2 * 37);
  assert.equal(examSeconds(byId("cw-01")), 10 * 36);
  assert.equal(examSeconds(byId("bs-01")), 36);
  assert.match(app, /Math\.floor\(\(Date\.now\(\)-d\.revealAt\)\/10000\)\+1/u);
  assert.match(app, /assisted:[^,]*!!d\.revealAt/u, "an answer after the reveal counts as assisted");
});

test("F11: a measurement pool of unseen sets stays out of practice and the daily plan", () => {
  const measure = exercises.filter((x) => x.measure);
  assert.equal(measure.length, 5);
  assert.match(app, /practiceBank=exercises\.filter\(x=>!x\.measure\)/u);
  assert.match(app, /data-action="measure-start"/u);
});

test("F18: writing transfer — corrected structures come back in a different task the next day", () => {
  assert.match(app, /function noteTransfer\(item,d\)/u);
  const state = createState();
  const transfer = { id: "tr-1", fromItemId: "email-01", kind: "email", createdAt: new Date().toISOString(), dueDay: "2026-11-28", targets: [{ rule: "look forward to + -ing", wrong: "look forward to hear", right: "look forward to hearing", why: "…" }] };
  assert.equal(validateBackup({ ...state, transfers: [transfer] }).transfers.length, 1);
  assert.equal(salvageBackup({ ...state, transfers: [transfer, { bad: true }] }).state.transfers.length, 1);
});

test("F19–F20: no word-count target in speaking; intonation and linkers explained by meaning", () => {
  assert.doesNotMatch(SPEAKING_GUIDE.pace, /110/u);
  assert.ok(!SPEAKING_GUIDE.scoring.some(([, text]) => /çoğu zaman bağlaçlardır/u.test(text)));
});

test("F22: lessons get a delayed check even when every answer was right", () => {
  const check = scheduleLessonCheck(undefined, new Date(2026, 10, 27, 10));
  assert.ok(check.dueAt > new Date(2026, 10, 29).toISOString());
  const kept = { repetitions: 0, intervalDays: 1, dueAt: "2026-11-28T00:00:00.000Z", lastReviewedAt: "2026-11-27T10:00:00.000Z", missed: ["x"], seen: [], successes: 0 };
  assert.equal(scheduleLessonCheck(kept), kept);
});

test("F24: rules come with their exceptions; equivalents are labelled honestly", () => {
  const cond = GRAMMAR_REFS.find((r) => r.id === "conditionals");
  assert.match(cond.intro, /İstisna/u);
  const agree = EVERYDAY.find((g) => g.id === "agree").items.map(([p]) => p);
  assert.ok(!agree.includes("I see what you mean."), "understanding is not agreeing");
  assert.ok(EVERYDAY.find((g) => g.id === "understand").items.some(([p]) => p === "I see what you mean."));
});

test("F25: the library outage uses exact times", () => {
  const ann = exercises.find((x) => x.id === "ann-07");
  assert.match(ann.audioText, /11:59 p\.m\. on Saturday until 6:00 a\.m\. on Sunday/u);
});

test("v0.9.1: the as … as family is taught (G8.1 table and drills) and studied as cards", async () => {
  const { LESSON_BY_CODE } = await import("../data/grammar.js");
  const lesson = LESSON_BY_CODE.get("G8.1");
  const table = lesson.table.find(([title]) => /as ile/u.test(title));
  assert.ok(table, "a table for the as patterns");
  const rows = table[1].map(([form]) => form).join(" | ");
  for (const form of ["as much", "as many", "as soon as", "as long as", "as far as", "as well as", "as if"]) assert.ok(rows.includes(form), form);
  assert.ok(lesson.drills.some((d) => /as much|as many/u.test(JSON.stringify(d))));
  for (const word of ["as soon as", "as much as", "as many as", "as if", "as … as possible", "as far as I know", "as long as", "as well as"]) {
    const card = DECK.find((c) => c.word === word);
    assert.ok(card, `${word} card`);
    assert.ok(fillItem(card), `${word} has a typed completion item`);
  }
});
