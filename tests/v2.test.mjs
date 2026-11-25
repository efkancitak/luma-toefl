import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

import {
  compareDictation,
  createState,
  dueGrammarCodes,
  gradeLessonItem,
  logActivity,
  normalizeSentence,
  noteLessonMistake,
  numberToWords,
  recommendNext,
  scheduleGrammarReview,
  validateBackup,
  weeklySummary,
  weekWindow,
} from "../core.js";
import { exercises } from "../data/content.js";
import { grammar as microLessons, vocabulary } from "../data/library.js";
import {
  GRAMMAR_TAGS,
  LEGACY_TO_CODE,
  LESSONS,
  LESSON_BY_CODE,
  MODULES,
  PRIORITY_CODES,
  lessonChecks,
  lessonsForTags,
  screeningFor,
  summaryBlocks,
} from "../data/grammar.js";
import { INTERVIEW_SETS, INTERVIEW_TYPES, PHRASES, PHRASE_FUNCTIONS, PRONUNCIATION, PROMPTS, REPEAT_SETS } from "../data/speaking.js";

const words = (text) => String(text).trim().split(/\s+/).filter(Boolean);
const rawWords = (text) => words(String(text).replace(/[.,!?;:]/gu, "").toLowerCase());
const nonEmpty = (value, label) => {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be blank`);
};
const fourOptions = (options, answer, label) => {
  assert.equal(options.length, 4, `${label} needs four options`);
  assert.equal(new Set(options.map((o) => o.trim())).size, 4, `${label} options must be distinct`);
  assert.ok(Number.isInteger(answer) && answer >= 0 && answer < 4, `${label} answer index`);
};

// ── Grammar map ────────────────────────────────────────────────────────────

test("grammar map: 11 modules, 67 core lessons plus 2 opened from v0.1 mapping", () => {
  assert.equal(MODULES.length, 11);
  assert.equal(LESSONS.length, 69);
  assert.equal(LESSONS.filter((l) => !l.addedInMapping).length, 67, "GRAMMAR.md v4 lists 67 lessons");
  assert.deepEqual(LESSONS.filter((l) => l.addedInMapping).map((l) => l.code).sort(), ["G10.9", "G3.10"]);
  assert.equal(new Set(LESSONS.map((l) => l.code)).size, LESSONS.length, "codes are unique");
  for (const lesson of LESSONS) {
    assert.match(lesson.code, /^G\d{1,2}\.\d{1,2}$/u);
    assert.equal(lesson.module, Number(lesson.code.slice(1).split(".")[0]));
    nonEmpty(lesson.title, `${lesson.code}.title`);
    assert.match(lesson.level, /^(A1|A2|B1|B2|C1|C2)(–(A1|A2|B1|B2|C1|C2))?$/u, `${lesson.code}.level`);
    assert.ok(lesson.mistakes.length >= 1 && lesson.tasks.length >= 1, `${lesson.code} has mistakes and exam tasks`);
  }
  assert.equal(LESSONS.filter((l) => l.module === 2).length, 13, "noun phrase module has 13 lessons");
  assert.equal(LESSONS.filter((l) => l.module === 5).length, 7, "conditionals module has 7 lessons");
});

test("every v0.1 micro lesson maps to exactly one lesson and keeps its id", () => {
  const mapped = LESSONS.flatMap((l) => l.legacy);
  assert.equal(mapped.length, microLessons.length);
  assert.deepEqual([...new Set(mapped)].sort(), microLessons.map((m) => m.id).sort());
  for (const micro of microLessons) assert.ok(LESSON_BY_CODE.has(LEGACY_TO_CODE[micro.id]), `${micro.id} mapped`);
});

test("every lesson opens with an Özet and a check; screenings route with 6–8 questions", () => {
  for (const lesson of LESSONS) {
    assert.ok(summaryBlocks(lesson).length >= 1, `${lesson.code} has an Özet`);
    assert.ok(lessonChecks(lesson).length >= 1, `${lesson.code} has a check question`);
    for (const block of summaryBlocks(lesson)) {
      nonEmpty(block.summary, `${lesson.code} summary`);
      nonEmpty(block.explanation, `${lesson.code} explanation`);
      assert.ok(block.examples.length >= 2, `${lesson.code} Özet examples`);
    }
  }
  for (const module of MODULES) {
    const questions = screeningFor(module.id);
    assert.ok(questions.length >= 6 && questions.length <= 8, `module ${module.id} screening has ${questions.length}`);
    for (const q of questions) {
      fourOptions(q.options, q.answer, q.id);
      assert.ok(LESSON_BY_CODE.has(q.code), `${q.id} routes to a lesson`);
    }
  }
});

test("priority 20 lessons have a complete Tam anlatım (acceptance 7 / CONTENT-SPEC check 5)", () => {
  assert.equal(PRIORITY_CODES.length, 20);
  const order = { recognition: 0, transformation: 1, production: 2 };
  for (const code of PRIORITY_CODES) {
    const lesson = LESSON_BY_CODE.get(code);
    assert.ok(lesson?.priority && lesson.full, `${code} has a full lesson`);
    const full = lesson.full;
    nonEmpty(full.function, `${code}.function`);
    assert.ok(full.structure.head.length >= 2 && full.structure.rows.length >= 3, `${code}.structure`);
    for (const row of full.structure.rows) assert.equal(row.length, full.structure.head.length, `${code} structure row width`);
    nonEmpty(full.usage, `${code}.usage`);
    nonEmpty(full.contrast.title, `${code}.contrast.title`);
    nonEmpty(full.contrast.text, `${code}.contrast.text`);
    assert.ok(full.contrast.pairs.length >= 2, `${code}.contrast.pairs`);
    assert.ok(full.mistakes.length >= 1 && full.mistakes.length <= 3, `${code} has 1–3 mistakes`);
    for (const [wrong, right, why] of full.mistakes) { nonEmpty(wrong, "wrong"); nonEmpty(right, "right"); nonEmpty(why, "why"); }
    assert.ok(full.examples.length >= 4, `${code} has at least four examples`);
    for (const [en, tr, context] of full.examples) { nonEmpty(en, "example en"); nonEmpty(tr, "example tr"); assert.ok(["kampüs", "akademik", "konuşma"].includes(context)); }
    assert.ok(full.exercises.length >= 5 && full.exercises.length <= 8, `${code} has 5–8 exercises`);
    const stages = full.exercises.map((item) => order[item.stage]);
    assert.deepEqual(stages, [...stages].sort((a, b) => a - b), `${code} exercises go recognition → transformation → production`);
    assert.deepEqual([...new Set(stages)], [0, 1, 2], `${code} uses all three stages`);
    for (const item of [...full.exercises, ...full.review]) {
      nonEmpty(item.prompt, `${item.id}.prompt`);
      if (item.type === "free") {
        nonEmpty(item.model, `${item.id}.model`);
        assert.ok(item.checklist.length >= 2, `${item.id}.checklist`);
        continue;
      }
      nonEmpty(item.why, `${item.id}.why`);
      if (item.type === "mcq") fourOptions(item.options, item.answer, item.id);
      if (item.type === "gap") assert.match(item.prompt, /___/u, `${item.id} shows its blank`);
      if (item.type === "rewrite") nonEmpty(item.source, `${item.id}.source`);
      if (item.type === "order") {
        const tokens = item.tokens.map((t) => t.toLowerCase()).sort();
        const answer = rawWords(item.answer).sort();
        assert.deepEqual(tokens, answer, `${item.id} tokens rebuild the answer`);
      }
    }
    assert.ok(full.exercises.some((item) => item.type === "free"), `${code} ends with own production`);
    assert.ok(full.review.length >= 2, `${code} has new-sentence review items`);
    nonEmpty(full.exam, `${code}.exam`);
    nonEmpty(full.speaking.pattern, `${code}.speaking.pattern`);
    nonEmpty(full.speaking.model, `${code}.speaking.model`);
    nonEmpty(full.speaking.step, `${code}.speaking.step`);
    assert.ok(full.recap.length >= 2, `${code}.recap`);
  }
});

test("each lesson item's own answer and accepted alternatives grade as correct", () => {
  for (const lesson of LESSONS.filter((l) => l.full)) {
    for (const item of [...lesson.full.exercises, ...lesson.full.review]) {
      if (item.type === "free") continue;
      if (item.type === "mcq") {
        assert.equal(gradeLessonItem(item, item.answer).correct, true, item.id);
        assert.equal(gradeLessonItem(item, (item.answer + 1) % 4).correct, false, item.id);
        continue;
      }
      if (item.type === "order") {
        const used = new Set();
        const indices = rawWords(item.answer).map((word) => {
          const index = item.tokens.findIndex((t, i) => !used.has(i) && t.toLowerCase() === word);
          used.add(index);
          return index;
        });
        assert.equal(gradeLessonItem(item, indices).correct, true, item.id);
      }
      assert.equal(gradeLessonItem(item, item.answer).correct, true, `${item.id} answer`);
      for (const alt of item.accept ?? []) assert.equal(gradeLessonItem(item, alt).correct, true, `${item.id} accepts ${alt}`);
    }
  }
});

test("task grammar tags map to existing lessons and a wrong task can suggest a lesson", () => {
  for (const [tag, codes] of Object.entries(GRAMMAR_TAGS)) for (const code of codes) assert.ok(LESSON_BY_CODE.has(code), `${tag} → ${code}`);
  assert.deepEqual(GRAMMAR_TAGS["indirect-question"], ["G7.3"]);
  assert.deepEqual(GRAMMAR_TAGS["subject-verb-agreement"], ["G2.11"]);
  const linked = exercises.filter((item) => lessonsForTags(item.tags).length > 0);
  assert.ok(linked.length >= 12, "a meaningful share of v0.1 items link to lessons");
  assert.ok(lessonsForTags(["passive"]).some((l) => l.code === "G3.7"));
});

// ── Speaking content ───────────────────────────────────────────────────────

test("Listen and Repeat: six 7-sentence sets, 8–12 s windows, growing length, v0.1 sentences kept", () => {
  assert.equal(REPEAT_SETS.length, 6);
  for (const set of REPEAT_SETS) {
    assert.equal(set.sentences.length, 7, `${set.id} has seven sentences`);
    const lengths = set.sentences.map((s) => words(s.text).length);
    assert.ok(lengths.at(-1) > lengths[0] + 6, `${set.id} grows in length`);
    for (const sentence of set.sentences) {
      assert.ok(sentence.seconds >= 8 && sentence.seconds <= 12, `${sentence.id} window`);
      assert.equal(sentence.chunks.replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim(), sentence.text);
    }
  }
  for (const id of ["rep-01", "rep-02", "rep-03", "rep-04"]) {
    const legacy = exercises.find((x) => x.id === id);
    assert.ok(REPEAT_SETS.some((set) => set.sentences.some((s) => s.legacyId === id && s.text === legacy.audioText)), `${id} kept`);
  }
});

test("Interview: six 4-question sets from experience to opinion, 45 s, v0.1 questions kept", () => {
  assert.equal(INTERVIEW_SETS.length, 6);
  for (const set of INTERVIEW_SETS) {
    assert.equal(set.questions.length, 4, `${set.id} has four questions`);
    assert.equal(set.questions[0].type, "experience", `${set.id} starts with experience`);
    assert.equal(set.questions.at(-1).type, "opinion", `${set.id} ends with a reasoned opinion`);
    for (const q of set.questions) {
      assert.ok(INTERVIEW_TYPES[q.type], `${q.id} type`);
      assert.equal(q.seconds, 45);
      const length = words(q.model).length;
      assert.ok(length >= 105 && length <= 135, `${q.id} model fits a fluent 45-second pace (${length} words)`);
      assert.deepEqual(q.segments.map(([step]) => step), ["answer", "explain", "example", "result"], `${q.id} follows the four steps`);
      for (const code of INTERVIEW_TYPES[q.type].grammar) assert.ok(LESSON_BY_CODE.has(code));
    }
  }
  for (const id of ["int-01", "int-02", "int-03", "int-04"]) {
    assert.ok(INTERVIEW_SETS.some((set) => set.questions.some((q) => q.legacyId === id)), `${id} kept`);
  }
});

test("phrase bank has at least 100 levelled records that do not collide with vocabulary ids", () => {
  assert.ok(PHRASES.length >= 100, `${PHRASES.length} phrases`);
  for (const phrase of PHRASES) assert.ok(["A1", "A2", "B1", "B2", "C1", "C2"].includes(phrase.level), `${phrase.id} level`);
  const ids = new Set(vocabulary.map((v) => v.id));
  for (const phrase of PHRASES) {
    assert.ok(!ids.has(phrase.id), `${phrase.id} unique across decks`);
    ids.add(phrase.id);
    assert.ok(PHRASE_FUNCTIONS[phrase.function], `${phrase.id} function`);
    for (const field of ["phrase", "tr", "example"]) nonEmpty(phrase[field], `${phrase.id}.${field}`);
    assert.ok(["speech", "both"].includes(phrase.register));
  }
  for (const fn of Object.keys(PHRASE_FUNCTIONS)) assert.ok(PHRASES.filter((p) => p.function === fn).length >= 6, `${fn} coverage`);
});

test("12 pronunciation lessons with 6–10 items, three sentences and a self-check", () => {
  assert.deepEqual(PRONUNCIATION.map((p) => p.id), Array.from({ length: 12 }, (_, i) => `P${i + 1}`));
  for (const lesson of PRONUNCIATION) {
    assert.ok(lesson.items.length >= 6 && lesson.items.length <= 10, `${lesson.id} items`);
    assert.equal(lesson.sentences.length, 3);
    nonEmpty(lesson.focus, `${lesson.id}.focus`);
    nonEmpty(lesson.selfCheck, `${lesson.id}.selfCheck`);
    if (lesson.kind === "pairs") for (const [a, b] of lesson.items) assert.notEqual(a.toLowerCase(), b.toLowerCase());
  }
});

test("copied prompts carry only the learner's own text and never ask for a score", () => {
  const transcript = PROMPTS.transcript("Q?", "my answer");
  assert.match(transcript, /Soru: Q\?/u);
  assert.match(transcript, /Transkriptim: my answer/u);
  for (const text of [transcript, PROMPTS.rehearsal("theme"), PROMPTS.writing("e-posta", "özet", "yanıt", "yardım yok")]) {
    assert.match(text, /TOEFL puanı/u, "prompt explicitly refuses a TOEFL score");
    assert.doesNotMatch(text, /https?:\/\//u);
  }
});

test("new content contains no embedded network URLs", () => {
  const blob = JSON.stringify({ LESSONS, REPEAT_SETS, INTERVIEW_SETS, PHRASES, PRONUNCIATION });
  assert.doesNotMatch(blob, /\b(?:https?|wss?|ftp):\/\/|\bwww\./iu);
});

test("service worker caches every shipped module", async () => {
  const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  const listed = new Set([...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]));
  const files = [
    ...(await readdir(new URL("../", import.meta.url))).filter((f) => f.endsWith(".js") && f !== "sw.js"),
    ...(await readdir(new URL("../views/", import.meta.url))).map((f) => `views/${f}`),
    ...(await readdir(new URL("../data/", import.meta.url))).map((f) => `data/${f}`),
  ];
  for (const file of files) assert.ok(listed.has(file), `${file} is in the offline cache list`);
});

// ── Dictation comparison (acceptance 8) ────────────────────────────────────

test("dictation compare ignores case, punctuation and extra spaces", () => {
  const result = compareDictation("Please bring your draft to my office hours tomorrow.", "  please BRING your draft, to my office-hours   tomorrow ");
  assert.equal(result.label, "dikte eşleşmesi");
  assert.equal(result.total, 9);
  assert.equal(result.matched, 9);
  assert.deepEqual([result.missing, result.extra, result.changed], [[], [], []]);
});

test("dictation compare treats contractions as equivalent, including curly apostrophes", () => {
  assert.equal(compareDictation("I do not think it is ready.", "I don’t think it’s ready").matched, 7);
  assert.equal(compareDictation("I am sure we will finish.", "I'm sure we'll finish.").matched, 6);
  assert.equal(compareDictation("They cannot come.", "They can't come").matched, 4);
  assert.equal(compareDictation("I'll give you a few articles.", "I will give you a few articles").matched, 7);
});

test("dictation compare treats digits and number words as equivalent", () => {
  assert.equal(compareDictation("The sample included two hundred students.", "The sample included 200 students").matched, 6);
  assert.equal(compareDictation("Twenty-one people came at 10:30.", "21 people came at ten thirty").matched, 7);
  assert.equal(compareDictation("It is on the 3rd floor.", "It's on the third floor").matched, 6);
  assert.equal(numberToWords(0), "zero");
  assert.equal(numberToWords(45), "forty five");
  assert.equal(numberToWords(2027), "two thousand twenty seven");
});

test("dictation compare reports missing, extra and changed words with a minimum alignment", () => {
  const result = compareDictation("Before you leave, I will give you a few articles.", "before you leave I'll give you few article please");
  assert.equal(result.total, 10);
  assert.equal(result.matched, 8);
  assert.deepEqual(result.missing, ["a"]);
  assert.deepEqual(result.extra, ["please"]);
  assert.deepEqual(result.changed, [{ expected: "articles", heard: "article" }]);
  const empty = compareDictation("Office hours are on Tuesdays.", "");
  assert.equal(empty.matched, 0);
  assert.equal(empty.missing.length, 5);
});

// ── Lesson grading and different-day review ────────────────────────────────

test("lesson grading accepts short forms, keeps possessives and never auto-grades free text", () => {
  assert.equal(normalizeSentence("If I’d known, I’d have called you."), normalizeSentence("If I had known, I would have called you."));
  assert.equal(gradeLessonItem({ type: "gap", answer: "parents'" }, "parents").correct, false);
  assert.equal(gradeLessonItem({ type: "gap", answer: "parents'" }, "Parents’").correct, true);
  assert.equal(gradeLessonItem({ type: "rewrite", answer: "He didn't study for the quiz." }, "He did not study for the quiz").correct, true);
  assert.equal(gradeLessonItem({ type: "rewrite", answer: "my advisor's opinion" }, "my advisors opinion").correct, false);
  assert.equal(gradeLessonItem({ type: "gap", answer: "The" }, "").empty, true);
  assert.deepEqual(gradeLessonItem({ type: "free" }, "anything"), { correct: null, self: true });
  assert.equal(gradeLessonItem({ type: "mcq", answer: 0 }, 0).correct, true);
});

test("a lesson mistake is reviewed on a different day and grows after correct reviews", () => {
  const morning = new Date(2026, 10, 16, 9, 30);
  const review = noteLessonMistake(undefined, "G2.7-e1", morning);
  assert.deepEqual(review.missed, ["G2.7-e1"]);
  assert.deepEqual(dueGrammarCodes({ "G2.7": review }, new Date(2026, 10, 16, 23, 59)), [], "not due the same day");
  assert.deepEqual(dueGrammarCodes({ "G2.7": review }, new Date(2026, 10, 17, 0, 1)), ["G2.7"]);
  const second = noteLessonMistake(review, "G2.7-e3", new Date(2026, 10, 16, 20));
  assert.deepEqual(second.missed, ["G2.7-e1", "G2.7-e3"]);
  const correct = scheduleGrammarReview(second, true, new Date(2026, 10, 17, 10));
  assert.equal(correct.successes, 1);
  assert.ok(new Date(correct.dueAt) >= new Date(2026, 10, 18, 0, 0), "next review at least one day later");
  const wrong = scheduleGrammarReview(correct, false, new Date(2026, 10, 18, 10));
  assert.equal(wrong.repetitions, 0);
  assert.equal(wrong.successes, 1, "earlier different-day successes stay visible");
  assert.equal(new Date(wrong.dueAt).getTime(), new Date(2026, 10, 19, 0, 0).getTime());
});

// ── Weekly activity and the single recommendation ──────────────────────────

test("weekly summary counts distinct speaking days inside the plan week", () => {
  let activity = [];
  activity = logActivity(activity, "speaking", new Date(2026, 10, 16, 8));
  activity = logActivity(activity, "speaking", new Date(2026, 10, 16, 21));
  activity = logActivity(activity, "speaking", new Date(2026, 10, 18, 9));
  activity = logActivity(activity, "reading", new Date(2026, 10, 18, 9));
  activity = logActivity(activity, "speaking", new Date(2026, 10, 23, 9));
  assert.equal(activity.length, 4, "one entry per day and kind");
  const week = weeklySummary(activity, "2026-11-16", new Date(2026, 10, 19, 12));
  assert.equal(week.week, 1);
  assert.equal(week.speakingDays, 2);
  assert.equal(week.skills.reading, true);
  assert.equal(week.skills.writing, false);
  assert.deepEqual(weekWindow("2026-11-16", new Date(2026, 10, 23, 1)), { week: 2, from: "2026-11-23", to: "2026-11-30" });
  assert.equal(logActivity(activity, "unknown").length, 4);
});

test("recommendation shows due reviews first, then grammar review, speaking, mistakes, untouched skill", () => {
  assert.equal(recommendNext({ dueCards: 3, grammarDue: ["G2.7"] }).kind, "review");
  assert.equal(recommendNext({ grammarDue: ["G2.7"], speakingDays: 0 }).kind, "grammar-review");
  assert.equal(recommendNext({ speakingDays: 1 }).kind, "speaking");
  assert.equal(recommendNext({ speakingDays: 1, spokeToday: true, mistakeLessons: ["G7.3"] }).code, "G7.3");
  assert.deepEqual(recommendNext({ speakingDays: 3, skillTouched: { reading: true, listening: true } }), { kind: "practice", skill: "writing" });
  assert.deepEqual(recommendNext({ speakingDays: 3, skillTouched: { reading: true, listening: true, writing: true, speaking: true } }), { kind: "practice", skill: "all" });
});

// ── Backup compatibility ───────────────────────────────────────────────────

const OLD_V01_BACKUP = {
  schemaVersion: 1,
  profile: { examDate: "2027-01-15", startDate: "2026-11-15", targetBand: "" },
  session: null,
  attempts: [{ id: "session-a:dr-01", itemId: "dr-01", skill: "reading", taskType: "daily-reading", level: "A2", at: "2026-11-15T20:00:00.000Z", correct: true, score: 1, selfAssessed: false, selfRating: null, response: 1, recordingId: "", assisted: false, feedback: "Doğru." }],
  reviews: { v001: { repetitions: 1, intervalDays: 1, dueAt: "2026-11-16T20:00:00.000Z", lastReviewedAt: "2026-11-15T20:00:00.000Z" } },
  drafts: {},
  readLessons: ["g001"],
  reviewSession: null,
};

test("an old v0.1 backup restores with empty v0.2 collections", () => {
  const restored = validateBackup(JSON.stringify(OLD_V01_BACKUP));
  assert.equal(restored.attempts.length, 1);
  assert.deepEqual(restored.readLessons, ["g001"]);
  for (const key of ["lessonProgress", "grammarReviews", "pronunciation", "screenings"]) assert.deepEqual({ ...restored[key] }, {}, key);
  assert.deepEqual(restored.speakingLog, []);
  assert.deepEqual(restored.activity, []);
  assert.equal(restored.speakingRun, null);
  assert.equal(restored.grammarSession, null);
  assert.deepEqual(Object.keys(createState()).sort(), Object.keys(restored).sort());
});

test("v0.2 progress round-trips through a JSON backup", () => {
  const state = {
    ...OLD_V01_BACKUP,
    lessonProgress: { "G2.7": { layer: "full", screen: 3, answers: { "G2.7-e1": 0, "G2.7-e3": "my advisor's opinion", "G2.7-e5": [7, 1, 5] }, results: { "G2.7-e1": "wrong", "G2.7-e3": "correct" }, updatedAt: "2026-11-16T10:00:00.000Z" } },
    grammarReviews: { "G2.7": { repetitions: 0, intervalDays: 1, dueAt: "2026-11-16T21:00:00.000Z", lastReviewedAt: "2026-11-16T10:00:00.000Z", missed: ["G2.7-e1"], seen: [], successes: 0 } },
    grammarSession: { queue: ["G2.7-r1"], index: 0, answers: { "G2.7-r1": 1 }, results: {} },
    speakingRun: { id: "run-1", setId: "lr-1", kind: "repeat", mode: "rehearsal", index: 2, createdAt: "2026-11-16T10:00:00.000Z", completedAt: null, items: { "lr-1-1": { recordingId: "run-1:lr-1-1", dictation: "office hours are on tuesdays", revealed: true, plays: 1, self: { clarity: 2, task: 3 }, done: true } } },
    speakingLog: [{ id: "run-1:lr-1-1", runId: "run-1", setId: "lr-1", itemId: "lr-1-1", kind: "repeat", mode: "rehearsal", at: "2026-11-16T10:01:00.000Z", recordingId: "run-1:lr-1-1", dictation: { matched: 5, total: 5 }, self: { clarity: 2, task: 3 }, assisted: false, external: false }],
    pronunciation: { P1: { at: "2026-11-16T10:05:00.000Z", selfRating: 2 } },
    screenings: { 2: { at: "2026-11-16T10:06:00.000Z", wrong: ["G2.7"], total: 8 } },
    activity: [{ d: "2026-11-16", k: "speaking" }, { d: "2026-11-16", k: "grammar" }],
  };
  const restored = validateBackup(JSON.parse(JSON.stringify(validateBackup(state))));
  assert.equal(restored.lessonProgress["G2.7"].screen, 3);
  assert.deepEqual(restored.lessonProgress["G2.7"].answers["G2.7-e5"], [7, 1, 5]);
  assert.equal(restored.speakingRun.items["lr-1-1"].self.task, 3);
  assert.deepEqual(restored.speakingLog[0].dictation, { matched: 5, total: 5 });
  assert.equal(restored.screenings["2"].wrong[0], "G2.7");
  assert.equal(restored.activity.length, 2);
});

test("v0.2 backup fields reject unsafe or impossible values", () => {
  const bad = (patch) => assert.throws(() => validateBackup({ ...OLD_V01_BACKUP, ...patch }), /Geçersiz yedek/u);
  bad({ lessonProgress: { "not-a-code": { layer: "full", screen: 0, answers: {}, results: {} } } });
  bad({ lessonProgress: { "G2.7": { layer: "full", screen: 0, answers: {}, results: { x: "learned" } } } });
  bad({ speakingRun: { id: "r", setId: "lr-1", kind: "repeat", mode: "exam", index: 0, createdAt: "2026-11-16T10:00:00.000Z", completedAt: null, items: {} } });
  bad({ speakingLog: [{ id: "a", runId: "r", setId: "s", itemId: "i", kind: "repeat", mode: "learn", at: "2026-11-16T10:00:00.000Z", dictation: { matched: 6, total: 5 } }] });
  bad({ speakingLog: [{ id: "a", runId: "r", setId: "s", itemId: "i", kind: "repeat", mode: "learn", at: "2026-11-16T10:00:00.000Z", self: { clarity: 4 } }] });
  bad({ activity: [{ d: "2026-13-01", k: "speaking" }] });
  bad({ pronunciation: { P1: { at: "2026-11-16T10:00:00.000Z", selfRating: 9 } } });
});
