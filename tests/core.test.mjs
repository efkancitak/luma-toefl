import test from "node:test";
import assert from "node:assert/strict";

import {
  createSession,
  createState,
  daysUntil,
  dueVocabulary,
  gradeAnswer,
  MAX_BACKUP_BYTES,
  planWeek,
  scheduleReview,
  selectExercises,
  skillStats,
  validateBackup,
} from "../core.js";

test("createState uses the caller's local calendar date and isolated collections", () => {
  const state = createState(new Date(2026, 10, 15, 23, 55));
  assert.deepEqual(state.profile, {
    examDate: "2027-01-15",
    startDate: "2026-11-15",
    targetBand: "",
    planEnd: "",
    extras: false,
  });
  assert.deepEqual(state.fills, {});
  assert.deepEqual(state.transfers, []);
  assert.equal(state.schemaVersion, 1);
  assert.deepEqual(state.attempts, []);
  assert.deepEqual(state.reviews, {});
});

test("selectExercises respects filters, quiet mode, budget, weakness and diversity", () => {
  const bank = [
    { id: "r1", type: "mcq", skill: "reading", taskType: "daily", level: "B1", estimatedMinutes: 4, answer: 0 },
    { id: "r2", type: "gaps", skill: "reading", taskType: "words", level: "B1", estimatedMinutes: 4, gaps: [] },
    { id: "l1", type: "mcq", skill: "listening", taskType: "talk", level: "B1", estimatedMinutes: 4, answer: 1 },
    { id: "w1", type: "order", skill: "writing", taskType: "sentence", level: "B1", estimatedMinutes: 4, answer: "Hello." },
    { id: "s1", type: "speaking", skill: "speaking", taskType: "interview", level: "B1", estimatedMinutes: 4 },
    { id: "w2", type: "writing", skill: "writing", taskType: "email", level: "B2", estimatedMinutes: 9 },
  ];
  const attempts = [
    { itemId: "old-r", skill: "reading", correct: false, selfAssessed: false },
    { itemId: "old-w", skill: "writing", correct: true, selfAssessed: false },
  ];

  const queue = selectExercises(bank, attempts, { level: "B1", minutes: 15, quiet: true });
  assert.ok(queue.length > 1);
  assert.ok(queue.every((item) => item.level === "B1"));
  assert.ok(queue.every((item) => !["listening", "speaking"].includes(item.skill)));
  assert.ok(queue.reduce((sum, item) => sum + item.estimatedMinutes, 0) <= 15);
  assert.equal(queue[0].skill, "reading", "the sampled weaker skill wins the initial tie");
  assert.ok(new Set(queue.map((item) => item.taskType)).size > 1);

  const filtered = selectExercises(bank, [], { skill: "writing", taskType: "email", level: "B2", minutes: 0 });
  assert.deepEqual(filtered.map((item) => item.id), ["w2"]);
});

test("selectExercises learns weakness only from independent fractional scores", () => {
  const bank = [
    { id: "w-new", type: "mcq", skill: "writing", taskType: "sentence", level: "B1", estimatedMinutes: 2, answer: 0 },
    { id: "r-new", type: "mcq", skill: "reading", taskType: "daily", level: "B1", estimatedMinutes: 2, answer: 0 },
  ];
  const attempts = [
    { itemId: "w-old", skill: "writing", correct: true, score: 1, selfAssessed: false, assisted: false },
    { itemId: "r-helped", skill: "reading", correct: true, score: 1, selfAssessed: false, assisted: true },
  ];
  const queue = selectExercises(bank, attempts, { minutes: 15 });
  assert.equal(queue[0].id, "r-new", "an assisted success must not make Reading look independently mastered");
});

test("selectExercises caps a free session at twelve items", () => {
  const bank = Array.from({ length: 20 }, (_, index) => ({
    id: `r${index}`,
    type: "mcq",
    skill: "reading",
    taskType: index % 2 ? "daily" : "academic",
    level: "all",
    estimatedMinutes: 1,
    answer: 0,
  }));
  assert.equal(selectExercises(bank, [], { minutes: 0 }).length, 12);
});

test("createSession captures ids, options and a valid timestamp", () => {
  const now = new Date("2026-11-15T12:00:00.000Z");
  const session = createSession([{ id: "one" }, { id: "two" }], { minutes: 15 }, now);
  assert.match(session.id, /^session-/);
  assert.deepEqual(session.itemIds, ["one", "two"]);
  assert.equal(session.createdAt, now.toISOString());
  assert.deepEqual(session.answers, {});
  assert.equal(session.completedAt, null);
});

test("gradeAnswer treats option zero as an answer and handles empty responses", () => {
  const item = { type: "mcq", answer: 0 };
  assert.deepEqual(gradeAnswer(item, 0).correct, true);
  assert.equal(gradeAnswer(item, "0").score, 1);
  assert.equal(gradeAnswer(item, "").score, 0);
  assert.equal(gradeAnswer(item, undefined).correct, false);
});

test("gradeAnswer normalizes gaps and terminal punctuation but never auto-grades production", () => {
  const gaps = gradeAnswer(
    { type: "gaps", gaps: [{ prefix: "lea", answer: "rning" }, { prefix: "to", answer: "DAY" }] },
    [" RNING ", " day  "],
  );
  assert.equal(gaps.correct, true);
  assert.equal(gaps.score, 1);

  const ordered = gradeAnswer({ type: "order", answer: "What time does it start?" }, " what  time does it START. ");
  assert.equal(ordered.correct, true);

  for (const type of ["writing", "speaking"]) {
    const result = gradeAnswer({ type }, "A fluent-looking response");
    assert.equal(result.correct, null);
    assert.equal(result.score, null);
    assert.equal(result.needsSelfAssessment, true);
  }
});

test("skillStats excludes self-assessments from objective accuracy", () => {
  const stats = skillStats([
    { skill: "reading", correct: true, score: 1, selfAssessed: false },
    { skill: "reading", correct: false, score: 0.8, selfAssessed: false },
    { skill: "reading", correct: true, selfAssessed: true },
    { skill: "reading", correct: true, score: 1, selfAssessed: false, assisted: true },
    { skill: "speaking", correct: null, selfAssessed: true },
  ]);
  assert.deepEqual(stats.reading, {
    count: 2,
    correct: 1,
    accuracy: 90,
    selfCount: 1,
    assistedCount: 1,
    repeatCount: 0,
  });
  assert.deepEqual(stats.speaking, {
    count: 0,
    correct: 0,
    accuracy: null,
    selfCount: 1,
    assistedCount: 0,
    repeatCount: 0,
  });
  assert.equal(stats.listening.accuracy, null);
});

test("scheduleReview uses a ten-minute retry and transparent growing intervals", () => {
  const now = new Date("2026-11-15T12:00:00.000Z");
  const again = scheduleReview({ repetitions: 3, intervalDays: 12 }, "again", now);
  assert.equal(again.repetitions, 0);
  assert.equal(new Date(again.dueAt).getTime() - now.getTime(), 10 * 60 * 1000);

  const good1 = scheduleReview(null, "good", now);
  const good2 = scheduleReview(good1, "good", now);
  const easy = scheduleReview(good2, "easy", now);
  assert.equal(good1.intervalDays, 1);
  assert.equal(good2.intervalDays, 3);
  assert.ok(easy.intervalDays > good2.intervalDays);
  assert.throws(() => scheduleReview(null, "magic", now), /again/);
});

test("dueVocabulary separates overdue and unseen words with stable sorting", () => {
  const now = new Date("2026-11-15T12:00:00.000Z");
  const vocabulary = [
    { id: "z", word: "zebra" },
    { id: "a", word: "apple" },
    { id: "d2", word: "second due" },
    { id: "d1", word: "first due" },
    { id: "future", word: "later" },
  ];
  const reviews = {
    d2: { dueAt: "2026-11-15T11:00:00.000Z" },
    d1: { dueAt: "2026-11-14T11:00:00.000Z" },
    future: { dueAt: "2026-11-16T11:00:00.000Z" },
  };
  const result = dueVocabulary(vocabulary, reviews, now);
  assert.deepEqual(result.due.map((item) => item.id), ["d1", "d2"]);
  assert.deepEqual(result.new.map((item) => item.id), ["a", "z"]);
});

test("calendar helpers compare date-only values without DST-hour arithmetic", () => {
  const late = new Date(2026, 2, 28, 23, 59);
  assert.equal(daysUntil("2026-03-29", late), 1);
  assert.equal(daysUntil("2026-03-27", late), -1);
  assert.equal(planWeek("2026-11-15", new Date(2026, 10, 15)), 1);
  assert.equal(planWeek("2026-11-15", new Date(2026, 10, 29)), 3);
  assert.equal(planWeek("2026-11-15", new Date(2027, 5, 1)), 8);
  assert.equal(planWeek("2026-11-15", new Date(2026, 9, 1)), 1);
});

function validBackup() {
  const answer = {
    id: "s1:w1",
    itemId: "w1",
    skill: "writing",
    taskType: "email",
    level: "B1",
    response: "Draft",
    recordingId: "",
    assisted: true,
    correct: null,
    score: null,
    selfAssessed: true,
    selfRating: 3,
    feedback: "Rubriğe göre öz değerlendirme.",
    at: "2026-11-15T12:01:00.000Z",
  };
  return {
    schemaVersion: 1,
    profile: { examDate: "2027-01-15", startDate: "2026-11-15", targetBand: "5" },
    session: {
      id: "s1",
      itemIds: ["w1"],
      index: 0,
      answers: { w1: answer },
      createdAt: "2026-11-15T12:00:00.000Z",
      options: { minutes: 15 },
      completedAt: null,
    },
    attempts: [{
      id: "a1",
      itemId: "w1",
      skill: "writing",
      taskType: "email",
      level: "B1",
      response: "Draft",
      recordingId: "",
      assisted: false,
      correct: null,
      score: null,
      selfAssessed: true,
      selfRating: 3,
      feedback: "Rubriğe göre öz değerlendirme.",
      at: "2026-11-15T12:01:00.000Z",
    }],
    reviews: {
      word1: {
        repetitions: 1,
        intervalDays: 1,
        dueAt: "2026-11-16T12:00:00.000Z",
        lastReviewedAt: "2026-11-15T12:00:00.000Z",
      },
    },
    drafts: {
      w1: {
        response: ["one", "two"],
        checked: true,
        result: { correct: true, score: 1 },
        selfRating: 3,
        showTranscript: false,
        modelViewed: true,
        timerStartedAt: 123,
        timerSeconds: 60,
      },
    },
    readLessons: ["intro", "intro"],
  };
}

test("validateBackup restores JSON-only session and draft data into fresh objects", () => {
  const original = validBackup();
  const restored = validateBackup(JSON.stringify(original));
  assert.equal(restored.schemaVersion, 1);
  assert.deepEqual(restored.session.answers.w1.response, "Draft");
  assert.equal(restored.session.answers.w1.selfRating, 3);
  assert.equal(restored.session.answers.w1.feedback, "Rubriğe göre öz değerlendirme.");
  assert.equal(restored.attempts[0].selfRating, 3);
  assert.equal(restored.attempts[0].feedback, "Rubriğe göre öz değerlendirme.");
  assert.deepEqual(restored.drafts.w1.response, ["one", "two"]);
  assert.deepEqual(restored.readLessons, ["intro"]);
  assert.notEqual(restored.drafts, original.drafts);
  assert.equal(Object.getPrototypeOf(restored.drafts), null);
});

test("validateBackup preserves a half-filled sparse cloze draft after JSON round-trip", () => {
  const backup = validBackup();
  const response = new Array(8);
  response[7] = "ing";
  backup.drafts.w1 = { response };

  const restored = validateBackup(JSON.stringify(backup));
  assert.equal(restored.drafts.w1.response.length, 8);
  assert.deepEqual(restored.drafts.w1.response, ["", "", "", "", "", "", "", "ing"]);

  const completedAttempt = validBackup();
  completedAttempt.attempts[0].response = [null, "ing"];
  assert.throws(() => validateBackup(completedAttempt), /response\[0\].*metin/);
});

test("validateBackup round-trips the UI shape for objective attempts with a null selfRating", () => {
  const backup = validBackup();
  const objective = {
    id: "s1:r1",
    itemId: "r1",
    skill: "reading",
    taskType: "daily-reading",
    level: "B1",
    response: 0,
    recordingId: "",
    assisted: false,
    correct: true,
    score: 1,
    selfAssessed: false,
    selfRating: null,
    feedback: "Doğru.",
    at: "2026-11-15T12:02:00.000Z",
  };
  backup.session.itemIds.push("r1");
  backup.session.answers.r1 = objective;
  backup.attempts.push(objective);
  const restored = validateBackup(backup);
  assert.equal(restored.attempts[1].correct, true);
  assert.equal(restored.attempts[1].selfRating, null);
});

test("validateBackup preserves an optional vocabulary review session", () => {
  const backup = validBackup();
  backup.reviewSession = { itemIds: ["word-1", "word-2"], index: 1, revealed: true };
  assert.deepEqual(validateBackup(backup).reviewSession, {
    itemIds: ["word-1", "word-2"],
    index: 1,
    revealed: true,
  });
  delete backup.reviewSession;
  assert.equal(validateBackup(backup).reviewSession, null, "older schema-v1 backups remain valid");
});

test("validateBackup rejects bad versions, dates, executable values and prototype keys", () => {
  const wrongVersion = validBackup();
  wrongVersion.schemaVersion = 2;
  assert.throws(() => validateBackup(wrongVersion), /schemaVersion/);

  const wrongDate = validBackup();
  wrongDate.profile.examDate = "2027-02-31";
  assert.throws(() => validateBackup(wrongDate), /examDate/);

  const executable = validBackup();
  executable.drafts.w1.run = () => "no";
  assert.throws(() => validateBackup(executable), /desteklenmiyor/);

  const polluted = JSON.parse(JSON.stringify(validBackup()));
  Object.defineProperty(polluted.drafts, "__proto__", { value: "bad", enumerable: true });
  assert.throws(() => validateBackup(polluted), /güvenli olmayan/);
  assert.equal({}.bad, undefined);
});

test("validateBackup enforces semantic draft, answer, band and timestamp shapes", () => {
  const malformedOrder = validBackup();
  malformedOrder.drafts.w1.order = "0,1";
  assert.throws(() => validateBackup(malformedOrder), /order/);

  const malformedRating = validBackup();
  malformedRating.drafts.w1.selfRating = 4;
  assert.throws(() => validateBackup(malformedRating), /selfRating/);

  const malformedAnswer = validBackup();
  malformedAnswer.session.answers.w1 = null;
  assert.throws(() => validateBackup(malformedAnswer), /session\.answers\.w1/);

  const wrongAnswerKey = validBackup();
  wrongAnswerKey.session.answers.other = wrongAnswerKey.session.answers.w1;
  delete wrongAnswerKey.session.answers.w1;
  assert.throws(() => validateBackup(wrongAnswerKey), /oturumda bulunmuyor/);

  const wrongBand = validBackup();
  wrongBand.profile.targetBand = "7";
  assert.throws(() => validateBackup(wrongBand), /targetBand/);

  const looseTimestamp = validBackup();
  looseTimestamp.attempts[0].at = "November 15, 2026";
  assert.throws(() => validateBackup(looseTimestamp), /ISO/);
});

test("validateBackup applies the exported twenty-megabyte limit to strings and parsed objects", () => {
  const oversized = validBackup();
  const chunk = "x".repeat(50_000);
  const recordsNeeded = Math.ceil(MAX_BACKUP_BYTES / chunk.length) + 1;
  oversized.drafts = Object.fromEntries(
    Array.from({ length: recordsNeeded }, (_, index) => [`draft-${index}`, { response: chunk }]),
  );
  const raw = JSON.stringify(oversized);
  assert.ok(new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES);
  assert.throws(() => validateBackup(oversized), /çok büyük/);
  assert.throws(() => validateBackup(raw), /çok büyük/);
});
