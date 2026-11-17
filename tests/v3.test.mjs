import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  createState,
  validateBackup,
  salvageBackup,
  selectExercises,
  skillStats,
  noteItemResult,
  dueReviewKeys,
  recommendNext,
  createExamEntry,
  comparableExamEntry,
} from "../core.js";
import { voiceScore } from "../media.js";
import { exercises } from "../data/content.js";

const at = (text) => new Date(text);

// ── Session length ─────────────────────────────────────────────────────────

test("a timed session is filled by its minutes; only the free session keeps the twelve-item cap", () => {
  const minutes = (items) => items.reduce((sum, item) => sum + item.estimatedMinutes, 0);
  const hour = selectExercises(exercises, [], { minutes: 60 });
  const half = selectExercises(exercises, [], { minutes: 30 });
  const free = selectExercises(exercises, [], { minutes: 0 });
  assert.ok(minutes(hour) > 50 && minutes(hour) <= 60, `60 dk seti ${minutes(hour)} dk`);
  assert.ok(minutes(half) > 24 && minutes(half) <= 30, `30 dk seti ${minutes(half)} dk`);
  assert.ok(hour.length > free.length);
  assert.equal(free.length, 12);
  assert.equal(new Set(hour.map((item) => item.id)).size, hour.length);
});

// ── Measurement: repeats apart from independent accuracy ───────────────────

test("an item solved before counts as a repeat and never raises independent accuracy", () => {
  const stats = skillStats([
    { itemId: "dr-01", skill: "reading", correct: false, score: 0, selfAssessed: false },
    { itemId: "dr-02", skill: "reading", correct: true, score: 1, selfAssessed: false },
    { itemId: "dr-01", skill: "reading", correct: true, score: 1, selfAssessed: false },
    { itemId: "dr-01", skill: "reading", correct: true, score: 1, selfAssessed: false },
  ]);
  assert.equal(stats.reading.count, 2);
  assert.equal(stats.reading.accuracy, 50);
  assert.equal(stats.reading.repeatCount, 2);
});

// ── Wrong task items come back on a different day ──────────────────────────

test("a wrong item is due the next day and grows only after a correct answer on a later day", () => {
  const monday = at("2026-11-16T15:00:00");
  assert.equal(noteItemResult(undefined, true, monday), undefined, "a first-time correct answer is not queued");

  const missed = noteItemResult(undefined, false, monday);
  assert.equal(missed.lapses, 1);
  assert.deepEqual(dueReviewKeys({ "dr-01": missed }, monday), []);
  assert.deepEqual(dueReviewKeys({ "dr-01": missed }, at("2026-11-17T08:00:00")), ["dr-01"]);

  // Same-day retry and assisted success are not progress.
  assert.equal(noteItemResult(missed, true, at("2026-11-16T20:00:00")), missed);
  assert.equal(noteItemResult(missed, true, at("2026-11-17T08:00:00"), { assisted: true }), missed);

  const first = noteItemResult(missed, true, at("2026-11-17T08:00:00"));
  assert.equal(first.successes, 1);
  assert.equal(first.intervalDays, 1);
  const second = noteItemResult(first, true, at("2026-11-18T08:00:00"));
  assert.equal(second.intervalDays, 3);
  assert.ok(second.dueAt > first.dueAt);

  const again = noteItemResult(second, false, at("2026-11-21T08:00:00"));
  assert.equal(again.lapses, 2);
  assert.equal(again.successes, 2);
  assert.deepEqual(dueReviewKeys({ a: again }, at("2026-11-22T00:00:01")), ["a"]);
});

test("due mistakes are recommended after card and grammar reviews, before a new speaking set", () => {
  assert.equal(recommendNext({ dueCards: 2, dueMistakes: 3 }).kind, "review");
  assert.equal(recommendNext({ grammarDue: ["G2.7"], dueMistakes: 3 }).kind, "grammar-review");
  assert.deepEqual(recommendNext({ dueMistakes: 3 }), { kind: "mistakes", count: 3 });
  assert.equal(recommendNext({ dueMistakes: 0 }).kind, "speaking");
});

// ── External practice results ──────────────────────────────────────────────

const form = (extra = {}) => ({ date: "2026-11-18", source: "ets-digital-1", section: "reading", attempt: "first", condition: "timed", valueType: "raw", correct: "31", total: "50", label: "", note: "", ...extra });

test("an exam result is stored as given, with its source and conditions, and never converted", () => {
  const entry = createExamEntry(form({ note: " son 5 soruya süre yetmedi " }), at("2026-11-18T19:00:00Z"));
  assert.equal(entry.correct, 31);
  assert.equal(entry.total, 50);
  assert.equal(entry.note, "son 5 soruya süre yetmedi");
  assert.ok(!("value" in entry) && !("band" in entry) && !("label" in entry));

  const estimate = createExamEntry(form({ valueType: "estimate", value: " 4.5 ", correct: "", total: "" }), at("2026-11-18T19:05:00Z"));
  assert.equal(estimate.value, "4.5");
  assert.ok(!("correct" in estimate));

  assert.throws(() => createExamEntry(form({ correct: "51" })), /Doğru sayısı/);
  assert.throws(() => createExamEntry(form({ total: "0" })), /Doğru sayısı/);
  assert.throws(() => createExamEntry(form({ date: "18.11.2026" })), /tarih/);
  assert.throws(() => createExamEntry(form({ valueType: "estimate", value: "" })), /değeri yaz/);
  assert.throws(() => createExamEntry(form({ section: "grammar" })), /kontrol et/);
});

test("results are compared only with an earlier first attempt under the same conditions", () => {
  const baseline = createExamEntry(form({ date: "2026-11-18" }), at("2026-11-18T19:00:00Z"));
  const pdf = createExamEntry(form({ date: "2026-12-01", source: "ets-pdf-1", correct: "40" }), at("2026-12-01T19:00:00Z"));
  const repeat = createExamEntry(form({ date: "2026-12-05", attempt: "repeat", correct: "45" }), at("2026-12-05T19:00:00Z"));
  const listening = createExamEntry(form({ date: "2026-12-06", section: "listening" }), at("2026-12-06T19:00:00Z"));
  const untimed = createExamEntry(form({ date: "2026-12-07", source: "ets-digital-2", condition: "untimed" }), at("2026-12-07T19:00:00Z"));
  const final = createExamEntry(form({ date: "2026-12-30", source: "ets-digital-2", correct: "38" }), at("2026-12-30T19:00:00Z"));
  const log = [baseline, pdf, repeat, listening, untimed, final];
  assert.equal(comparableExamEntry(final, log)?.id, baseline.id, "digital sample 2 compares with digital sample 1");
  assert.equal(comparableExamEntry(baseline, log), null, "nothing earlier");
  assert.equal(comparableExamEntry(pdf, log), null, "a paper adaptation is not compared with a digital form");
  assert.equal(comparableExamEntry(repeat, log), null, "a repeat is never the measured attempt");
  assert.equal(comparableExamEntry(untimed, log), null);
});

test("new v0.3 fields round-trip through a backup and are optional in older ones", () => {
  const state = createState(at("2026-11-16T10:00:00Z"));
  assert.deepEqual(state.itemReviews, {});
  assert.deepEqual(state.examLog, []);
  state.itemReviews["dr-01"] = noteItemResult(undefined, false, at("2026-11-16T10:00:00Z"));
  state.examLog.push(createExamEntry(form(), at("2026-11-18T19:00:00Z")));
  const restored = validateBackup(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(JSON.parse(JSON.stringify(restored.itemReviews)), JSON.parse(JSON.stringify(state.itemReviews)));
  assert.deepEqual(restored.examLog, state.examLog);

  const older = JSON.parse(JSON.stringify(state));
  delete older.itemReviews;
  delete older.examLog;
  const fromOlder = validateBackup(older);
  assert.deepEqual(Object.keys(fromOlder.itemReviews), []);
  assert.deepEqual(fromOlder.examLog, []);

  const tampered = JSON.parse(JSON.stringify(state));
  tampered.examLog[0].band = "5.5";
  tampered.examLog.push({ ...state.examLog[0], id: "exam-2", correct: 60 });
  assert.throws(() => validateBackup(tampered), /Geçersiz yedek/);
  const salvaged = salvageBackup(tampered);
  assert.equal(salvaged.state.examLog.length, 0);
  assert.deepEqual(salvaged.dropped, [{ field: "examLog", label: "deneme sonucu", count: 2 }]);
  assert.equal(Object.keys(salvaged.state.itemReviews).length, 1);
});

// ── Voice choice ───────────────────────────────────────────────────────────

test("natural offline voices outrank novelty voices that some devices list first", () => {
  const voice = (name, lang = "en-US", localService = true) => ({ name, lang, localService, default: false });
  const ranked = [voice("Albert"), voice("Bad News"), voice("Samantha"), voice("Daniel", "en-GB"), voice("Ava (Premium)"), voice("Google US English", "en-US", false)]
    .sort((a, b) => voiceScore(b) - voiceScore(a))
    .map((entry) => entry.name);
  assert.equal(ranked[0], "Ava (Premium)");
  assert.equal(ranked[1], "Samantha");
  assert.deepEqual(ranked.slice(-2).sort(), ["Albert", "Bad News"]);
  assert.ok(voiceScore(voice("Samantha")) > voiceScore(voice("Google US English", "en-US", false)), "an offline voice wins for offline study");
});

// ── Release consistency ────────────────────────────────────────────────────

test("app, service worker cache and package share one version", async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
  const [app, sw, pkg] = await Promise.all([read("../app.js"), read("../sw.js"), read("../package.json")]);
  const appVersion = app.match(/const APP_VERSION = '([^']+)'/)[1];
  const swVersion = sw.match(/const VERSION = '([^']+)'/)[1];
  assert.equal(swVersion, `v${appVersion}`);
  assert.equal(JSON.parse(pkg).version, appVersion);
});

test("the service worker builds a version from fresh files and switches only when asked", async () => {
  const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.match(sw, /cache: 'reload'/);
  assert.match(sw, /'skip-waiting'/);
  const install = sw.slice(sw.indexOf("addEventListener('install'"), sw.indexOf("addEventListener('message'"));
  assert.doesNotMatch(install, /skipWaiting\(\)/, "no forced switch during install");
});

test("typed text is saved or kept: speaking fields autosave and every re-render restores unsaved input", async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
  const [app, speaking] = await Promise.all([read("../app.js"), read("../views/speaking.js")]);
  assert.match(speaking, /export function handleSpeakingInput/);
  assert.match(app, /if\(handleSpeakingInput\(ctx,el\)\)return;/);
  assert.match(app, /restoreView\(keep\);/);
  assert.match(app, /snapshotView\(\)/);
});

test("service worker run: caches every asset fresh, switches only on request, serves offline from its own cache", async () => {
  const { runInNewContext } = await import("node:vm");
  const code = await readFile(new URL("../sw.js", import.meta.url), "utf8");
  const scope = "https://example.test/luma/";
  const handlers = {};
  const stores = new Map();
  let skipped = 0;
  let claimed = 0;
  const makeCache = () => {
    const map = new Map();
    return {
      map,
      async addAll(requests) { for (const request of requests) map.set(request.url, { request, body: `cached:${request.url}` }); },
      async match(request) { return map.get(typeof request === "string" ? request : request.url)?.body; },
    };
  };
  const caches = {
    async open(name) { if (!stores.has(name)) stores.set(name, makeCache()); return stores.get(name); },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
  const self = {
    registration: { scope },
    addEventListener: (type, handler) => { handlers[type] = handler; },
    skipWaiting: () => { skipped += 1; },
    clients: { claim: async () => { claimed += 1; } },
  };
  runInNewContext(code, { self, caches, URL, Request, fetch: async () => { throw new Error("offline"); } });
  stores.set(`luma:${scope}:v0.0.1`, makeCache());
  stores.set("another-app", makeCache());

  let pending;
  handlers.install({ waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.equal(skipped, 0, "installing never takes over a running lesson");
  const current = [...stores.keys()].find((name) => name.startsWith(`luma:${scope}:`) && !name.endsWith("v0.0.1"));
  const cached = stores.get(current).map;
  assert.ok(cached.size >= 20);
  for (const { request } of cached.values()) assert.equal(request.cache, "reload");
  for (const path of ["", "index.html", "app.js", "data/content.js", "views/speaking.js"]) assert.ok(cached.has(scope + path), `${path || "./"} cached`);

  handlers.message({ data: "anything-else" });
  assert.equal(skipped, 0);
  handlers.message({ data: "skip-waiting" });
  assert.equal(skipped, 1);

  handlers.activate({ waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.deepEqual([...stores.keys()].sort(), [current, "another-app"].sort(), "only this app's old caches are removed");
  assert.equal(claimed, 1);

  let response;
  handlers.fetch({ request: { method: "GET", url: `${scope}app.js`, mode: "cors" }, respondWith: (promise) => { response = promise; } });
  assert.equal(await response, `cached:${scope}app.js`);
  response = undefined;
  handlers.fetch({ request: { method: "GET", url: `${scope}some/deep/link`, mode: "navigate" }, respondWith: (promise) => { response = promise; } });
  assert.equal(await response, `cached:${scope}index.html`, "an offline launch falls back to the cached shell");
  response = undefined;
  handlers.fetch({ request: { method: "GET", url: "https://elsewhere.test/x.js", mode: "cors" }, respondWith: (promise) => { response = promise; } });
  assert.equal(response, undefined, "requests outside the app are left alone");
});

test("the service worker's build stamp matches the files it caches (run `npm run release` before pushing)", async () => {
  const { computeAssetHash, stampedBuild, cachedAssets } = await import("../scripts/asset-hash.mjs");
  assert.ok((await cachedAssets()).includes("index.html"));
  assert.equal(await stampedBuild(), await computeAssetHash(), "Dosyalar değişti: pushlamadan önce `npm run release` çalıştır.");
});

// ── v0.4 content volume ────────────────────────────────────────────────────

test("the bank holds at least eight items for every answer-keyed task and every cloze blanks strictly every second word", async () => {
  const { vocabulary } = await import("../data/library.js");
  const counts = {};
  for (const item of exercises) counts[item.taskType] = (counts[item.taskType] ?? 0) + 1;
  for (const task of ["complete-words", "daily-reading", "academic-reading", "choose-response", "conversation", "announcement", "academic-talk", "build-sentence"]) {
    assert.ok(counts[task] >= 8, `${task}: ${counts[task]}`);
  }
  assert.ok(counts.email >= 7 && counts.discussion >= 7);
  assert.ok(exercises.length >= 90);
  assert.ok(vocabulary.length >= 180);
  for (const item of exercises.filter((entry) => entry.type === "gaps")) {
    const words = item.passage.split(/\s+/);
    const first = words.findIndex((word) => word.includes("{{"));
    const last = words.map((word) => word.includes("{{")).lastIndexOf(true);
    const pattern = words.slice(first - 1, last + 1).map((word) => (word.includes("{{") ? "G" : "w")).join("");
    assert.match(pattern, /^(wG){10}$/, `${item.id} blanks every second word`);
    assert.ok(!words.slice(0, first - 1).some((word) => word.includes("{{")), `${item.id} keeps its first sentence complete`);
  }
});

test("every sentence-order item has exactly one token sequence that rebuilds its answer", () => {
  for (const item of exercises.filter((entry) => entry.type === "order")) {
    const target = item.answer.replace(/[.!?]+$/u, "").toLowerCase();
    // Two identical tokens (e.g. "the" twice) are the same sentence, so sequences are compared as text.
    const found = new Set();
    const walk = (remaining, used) => {
      if (used.size === item.tokens.length) { if (remaining === "") found.add([...used].map((index) => item.tokens[index]).join(" ")); return; }
      item.tokens.forEach((token, index) => {
        if (used.has(index)) return;
        const text = token.replace(/[.!?]+$/u, "").toLowerCase();
        const last = used.size === item.tokens.length - 1;
        if (remaining === text || (!last && remaining.startsWith(`${text} `))) walk(remaining.slice(text.length).trimStart(), new Set([...used, index]));
      });
    };
    walk(target, new Set());
    assert.equal(found.size, 1, `${item.id} has ${found.size} rebuilding orders`);
  }
});
