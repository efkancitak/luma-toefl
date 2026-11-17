import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  createState,
  validateBackup,
  salvageBackup,
  salvageSummary,
  SPEAKING_TEXT_LIMIT,
  LESSON_TEXT_LIMIT,
  MAX_PLAYS,
} from "../core.js";

const NOW = "2026-11-16T10:00:00.000Z";
const review = () => ({ repetitions: 1, intervalDays: 1, dueAt: "2026-11-17T10:00:00.000Z", lastReviewedAt: NOW });
const attempt = (id, extra = {}) => ({ id, itemId: "dr-01", skill: "reading", correct: true, score: 1, selfAssessed: false, selfRating: null, at: NOW, ...extra });
const run = (items) => ({ id: "run-1", setId: "int-set-1", kind: "interview", mode: "learn", index: 0, createdAt: NOW, completedAt: null, items });

function progressState() {
  const state = createState(new Date(NOW));
  state.reviews["w-001"] = review();
  state.attempts.push(attempt("s1:dr-01"), attempt("s2:dr-01", { correct: false, score: 0 }));
  state.lessonProgress["G2.7"] = { layer: "full", screen: 3, answers: { a: "the table leg" }, results: { a: "correct" }, updatedAt: NOW };
  state.activity.push({ d: "2026-11-16", k: "vocab" });
  return state;
}

test("a long pasted feedback note or transcript no longer invalidates the saved state", () => {
  const state = progressState();
  state.speakingRun = run({ q1: { external: "a".repeat(6_000), dictation: "b".repeat(6_000), plays: MAX_PLAYS } });
  const restored = validateBackup(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.speakingRun.items.q1.external.length, 6_000);
  assert.equal(Object.keys(restored.reviews).length, 1);
});

test("salvage keeps valid progress and drops only the entries that do not validate", () => {
  const state = progressState();
  state.speakingRun = run({ q1: { external: "a".repeat(SPEAKING_TEXT_LIMIT + 1) }, q2: { dictation: "I usually study in the library.", plays: 1 } });
  state.lessonProgress["G5.1"] = { layer: "full", screen: 3, answers: { free: "x".repeat(LESSON_TEXT_LIMIT + 1) }, results: {}, updatedAt: NOW };
  state.attempts.push({ id: "broken" });
  state.reviews["w-002"] = { repetitions: -1 };
  const raw = JSON.stringify(state);

  assert.throws(() => validateBackup(raw), /Geçersiz yedek/);

  const { state: restored, dropped } = salvageBackup(raw);
  assert.equal(restored.attempts.length, 2);
  assert.deepEqual(Object.keys(restored.reviews), ["w-001"]);
  assert.deepEqual(Object.keys(restored.lessonProgress), ["G2.7"]);
  assert.deepEqual(Object.keys(restored.speakingRun.items), ["q2"]);
  assert.equal(restored.activity.length, 1);
  assert.equal(restored.profile.examDate, state.profile.examDate);
  assert.deepEqual(Object.fromEntries(dropped.map((entry) => [entry.field, entry.count])), { attempts: 1, reviews: 1, lessonProgress: 1, speakingRun: 1 });
  assert.match(salvageSummary(dropped), /çalışma kaydı/);
  // The salvaged state is itself a valid backup.
  assert.doesNotThrow(() => validateBackup(JSON.parse(JSON.stringify(restored))));
});

test("salvage resets a broken resumable session without touching finished work", () => {
  const state = progressState();
  state.session = { id: "s9", itemIds: ["dr-01", "dr-01"], index: 0, answers: {}, createdAt: NOW, options: {}, completedAt: null };
  state.profile.targetBand = "9";
  const { state: restored, dropped } = salvageBackup(JSON.stringify(state));
  assert.equal(restored.session, null);
  assert.equal(restored.profile.targetBand, "");
  assert.equal(restored.attempts.length, 2);
  assert.deepEqual(dropped.map((entry) => entry.field).sort(), ["profile", "session"]);
});

test("salvage accepts an already valid state unchanged and still rejects foreign data", () => {
  const state = progressState();
  const { state: restored, dropped } = salvageBackup(JSON.stringify(state));
  assert.deepEqual(dropped, []);
  assert.deepEqual(JSON.parse(JSON.stringify(restored)), JSON.parse(JSON.stringify(validateBackup(JSON.parse(JSON.stringify(state))))));
  assert.throws(() => salvageBackup("not json"), /JSON okunamadı/);
  assert.throws(() => salvageBackup("[]"), /kök değer/);
  assert.throws(() => salvageBackup(JSON.stringify({ ...state, schemaVersion: 2 })), /schemaVersion/);
  // Prototype-pollution keys are dropped, never copied.
  const hostile = JSON.parse(JSON.stringify(state));
  hostile.reviews = JSON.parse('{"__proto__":{"repetitions":1},"w-001":' + JSON.stringify(review()) + "}");
  const cleaned = salvageBackup(hostile);
  assert.deepEqual(Object.keys(cleaned.state.reviews), ["w-001"]);
});

test("every text field the interface saves is capped at the limit the saved state accepts", async () => {
  const speaking = await readFile(new URL("../views/speaking.js", import.meta.url), "utf8");
  const grammar = await readFile(new URL("../views/grammar.js", import.meta.url), "utf8");
  const textareas = [...speaking.matchAll(/<textarea id="(?:dict|ext)-\$\{e\(item\.id\)\}"[^>]*>/g)].map((match) => match[0]);
  assert.equal(textareas.length, 3);
  for (const tag of textareas) assert.match(tag, /maxlength="\$\{SPEAKING_TEXT_LIMIT\}"/);
  assert.match(speaking, /Math\.min\(MAX_PLAYS,/);
  const lessonInputs = [...grammar.matchAll(/<(?:textarea|input) class="(?:lx|gr)-input"[^>]*>/g)].map((match) => match[0]);
  assert.equal(lessonInputs.length, 4);
  for (const tag of lessonInputs) assert.match(tag, /maxlength="/);
});

test("the loader salvages before it gives up on saved data", async () => {
  const storage = await readFile(new URL("../storage.js", import.meta.url), "utf8");
  const salvageAt = storage.indexOf("salvageBackup(recoveryRaw)");
  const resetAt = storage.lastIndexOf("return createState();");
  assert.ok(salvageAt > 0 && salvageAt < resetAt);
});
