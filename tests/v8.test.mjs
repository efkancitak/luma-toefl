import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { createState, validateBackup, salvageBackup, defaultPlanEnd, planDaysLeft, dailyQuota, spreadMerge, normalizeSentence, gradeLessonItem, DAILY_STEP_KEYS } from "../core.js";
import { analyzeWriting, autoFix, repeatTemplate, wordDiff, splitSentences } from "../writing.js";
import { DECK, POS_TR, TOPICS, choicesFor, meaningsOf, particleHints } from "../data/vocab.js";
import { AWL_SUBLISTS } from "../data/awl.js";
import { EXPRESSIONS } from "../data/expressions.js";
import { LINKERS, LINK_FUNCTIONS, WRITING_FRAMES, SPEAKING_TOOLKIT, PRACTICE_TIPS } from "../data/toolkit.js";
import { TASK_GUIDE, BANDS, SECTION_GUIDE } from "../data/scoring.js";
import { LESSONS, LESSON_BY_CODE } from "../data/grammar.js";
import { TASK_TYPES } from "../data/content.js";
import { PROMPTS } from "../data/speaking.js";

// ── Daily plan ─────────────────────────────────────────────────────────────

test("the plan runs to the exam date by default (v0.9) and counts today", () => {
  assert.equal(defaultPlanEnd("2027-01-15"), "2027-01-15");
  assert.equal(planDaysLeft("2026-12-15", "2027-01-15", new Date(2026, 10, 26, 9)), 20);
  assert.equal(planDaysLeft("2026-12-15", "2027-01-15", new Date(2026, 11, 15, 23)), 1);
  // Past the end date the rest is spread until the day before the exam.
  assert.equal(planDaysLeft("2026-12-15", "2027-01-15", new Date(2026, 11, 20, 9)), 26);
  assert.equal(planDaysLeft("", "2026-01-01", new Date(2026, 11, 20, 9)), 1);
});

test("daily quotas divide every pool so it finishes exactly by the end date", () => {
  assert.equal(dailyQuota(1340, 20), 67);
  assert.equal(dailyQuota(7, 20), 1);
  assert.equal(dailyQuota(0, 20), 0);
  for (const [pool, days] of [[1340, 20], [554, 20], [83, 20], [7, 20], [26, 3], [5, 1], [1999, 37]]) {
    let left = pool;
    let maxDay = 0;
    for (let day = days; day >= 1; day -= 1) {
      const take = dailyQuota(left, day);
      maxDay = Math.max(maxDay, take);
      left -= take;
      assert.ok(left >= 0);
    }
    assert.equal(left, 0, `${pool} over ${days} days`);
    assert.ok(maxDay <= Math.ceil(pool / days), "no day is heavier than the first");
  }
  // A skipped day spreads its share over the remaining days.
  assert.equal(dailyQuota(1340, 19), 71);
});

test("spreadMerge keeps every item and alternates the task types", () => {
  const merged = spreadMerge([["a1", "a2", "a3", "a4"], ["b1", "b2"]]);
  assert.deepEqual([...merged].sort(), ["a1", "a2", "a3", "a4", "b1", "b2"]);
  assert.deepEqual(merged.slice(0, 3), ["a1", "b1", "a2"]);
});

test("backups keep the plan date, today's list and the writing loop drafts; old backups still load", () => {
  const state = createState(new Date(2026, 10, 26));
  state.profile.planEnd = "2026-12-15";
  state.daily = { date: "2026-11-26", createdAt: new Date().toISOString(), steps: [{ key: "words", ids: ["w-format"] }, { key: "grammar", ids: ["G1.1", "G4.6"] }] };
  state.drafts["email-01"] = { response: "Dear Ms. Chen,", stage: "review", improved: "Dear Ms. Chen,", repeat: ["I am writing.", ""], repeatChecked: true, reqs: [0, 2], selfRating: 2 };
  const restored = validateBackup(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.profile.planEnd, "2026-12-15");
  assert.deepEqual(restored.daily.steps[1].ids, ["G1.1", "G4.6"]);
  assert.equal(restored.drafts["email-01"].stage, "review");
  assert.deepEqual(restored.drafts["email-01"].reqs, [0, 2]);
  const old = JSON.parse(JSON.stringify(createState()));
  delete old.daily;
  delete old.profile.planEnd;
  assert.equal(validateBackup(old).profile.planEnd, "");
  assert.equal(validateBackup(old).daily, null);
  assert.throws(() => validateBackup({ ...state, daily: { ...state.daily, steps: [{ key: "nope", ids: [] }] } }));
  const salvaged = salvageBackup({ ...JSON.parse(JSON.stringify(state)), daily: { date: "bad" } });
  assert.equal(salvaged.state.daily, null);
  assert.equal(salvaged.state.profile.planEnd, "2026-12-15");
  assert.deepEqual(DAILY_STEP_KEYS.slice(0, 2), ["due", "words"]);
});

// ── Writing loop ───────────────────────────────────────────────────────────

const SAMPLE = `Dear MR CARTER

i hope this email finds you well , i am writing to thank you for allowing me to participate in job fair. i am really intrested in having job oppurtunity in your company . would it be possible to send me more information about the internship

Thank you very much for your help and looking forward to hear your response

sincerely,
A J`;

test("the coach fixes only what it is sure about and explains each fix", () => {
  const { fixed, issues } = autoFix(SAMPLE, "email");
  for (const [wrong, right] of [["intrested", "interested"], ["oppurtunity", "opportunity"], ["looking forward to hear", "looking forward to hearing"], ["i", "I"], ["MR", "Mr."], ["CARTER", "Carter"]]) {
    assert.ok(issues.some((x) => x.wrong === wrong && x.right === right), `${wrong} → ${right}`);
  }
  assert.match(fixed, /^Dear Mr\. Carter,\n\nI hope/u);
  assert.match(fixed, /internship\?\n/u, "a question gets a question mark");
  assert.match(fixed, /\nSincerely,\nA J$/u);
  assert.equal(issues[0].rank, 1, "grammar fixes come before spacing");
  assert.ok(issues.every((x) => x.why));
  assert.equal(autoFix("Although it was late, but we kept working.", "discussion").fixed, "Although it was late, we kept working.");
  assert.equal(autoFix("I am agree with Maria because people is busy.", "discussion").fixed, "I agree with Maria because people are busy.");
  assert.equal(autoFix("I have lived here since five years.", "discussion").fixed, "I have lived here for five years.");
  assert.equal(autoFix("It was an useful hour and a interesting talk.", "discussion").fixed, "It was a useful hour and an interesting talk.");
});

test("the evaluation follows the four rubric criteria", () => {
  const report = analyzeWriting(SAMPLE, { kind: "email", academic: ["participate", "significant"] });
  assert.deepEqual(report.criteria.map((c) => c.id), ["content", "conventions", "range", "accuracy"]);
  assert.ok(report.criteria.every((c) => ["ok", "warn", "miss"].includes(c.status) && c.notes.length));
  assert.equal(report.criteria.find((c) => c.id === "accuracy").status, "miss");
  assert.ok(report.checks.find((c) => c.id === "request").ok);
  assert.ok(report.warnings.some((w) => /comma splice/u.test(w.why)), "a comma splice is flagged");
  assert.deepEqual(report.academicUsed, ["participate"]);
  const discussion = analyzeWriting("In my opinion, universities should record lectures. The main reason is that students can review difficult ideas. For example, when I was sick last year, I watched the recordings. While I see Ken's point about attendance, short in-class activities can solve it. Therefore, I support recordings.", { kind: "discussion" });
  assert.ok(discussion.checks.every((c) => c.ok), JSON.stringify(discussion.checks));
  assert.ok(discussion.linkers.includes("for example") && discussion.linkers.includes("therefore"));
});

test("repeat keeps the greeting and closing and blanks every second sentence", () => {
  const text = "Dear Ms. Chen,\n\nI hope you are well. I am writing about Tuesday. I cannot attend. Could I join another session?\n\nBest regards,\nJordan";
  const parts = repeatTemplate(text);
  const kept = parts.filter((p) => p.type === "keep").map((p) => p.text);
  const blanks = parts.filter((p) => p.type === "blank");
  assert.deepEqual(kept, ["Dear Ms. Chen,", "I hope you are well.", "I cannot attend.", "Best regards,", "Jordan"]);
  assert.deepEqual(blanks.map((b) => [b.n, b.text]), [[1, "I am writing about Tuesday."], [2, "Could I join another session?"]]);
  assert.deepEqual(splitSentences("Mr. Lee arrived at 9 a.m. today. He left."), ["Mr. Lee arrived at 9 a.m. today.", "He left."]);
});

test("the side-by-side view marks what was added and removed, line breaks included", () => {
  const { left, right } = wordDiff("i like it.\nThanks", "I really like it.\nThanks a lot");
  assert.ok(right.some((t) => t.type === "add" && t.t === "really"));
  assert.ok(left.some((t) => t.type === "del" && t.t === "i"));
  assert.ok(right.some((t) => t.t === "\n" && t.type === "same"));
});

test("the AI prompt asks for the four steps: evaluate, mistakes, improve, repeat", () => {
  const prompt = PROMPTS.writing("Write an Email", "task", "my answer", "7 dk");
  for (const step of ["1. EVALUATE", "2. IDENTIFY MISTAKES", "3. IMPROVE", "4. REPEAT"]) assert.ok(prompt.includes(step), step);
  assert.match(prompt, /every second sentence/u);
  assert.match(prompt, /social conventions/u);
});

// ── Vocabulary ─────────────────────────────────────────────────────────────

test("every word of the learner's academic list is a card", () => {
  const list = "modify allocate apparent approach complement component comprehensive concept conduct considerable constraint consume contemporary convert cooperate coordinate criteria cycle deduce demonstrate derive detect deviate differentiate diminish display distinct domain dominate duration dynamic enable encounter enforce enhance format framework fundamental ideology implement implicit indicate induce inherent inhibit initiate integral interval invoke isolate maintain mechanism monitor mutual notion obtain occupy offset ongoing output parameter phenomenon precede precise predominant preliminary proportion qualitative refine relevant resource restrict rigid scenario scope significant simulate sufficient sustain transmit undergo utilize welfare widespread".split(" ");
  const words = new Set(DECK.map((c) => c.word.toLowerCase()));
  assert.deepEqual(list.filter((w) => !words.has(w)), []);
});

test("the Academic Word List is covered except very basic A1–A2 headwords", () => {
  const all = AWL_SUBLISTS.flat();
  assert.equal(all.length, 570);
  const marked = new Set(DECK.filter((c) => c.awl).map((c) => c.word.toLowerCase()));
  assert.ok(marked.size >= 500, `${marked.size} AWL cards`);
  for (const w of ["significant", "framework", "scenario", "differentiate", "notwithstanding"]) assert.ok(marked.has(w), w);
  assert.ok(DECK.length >= 2000);
  const words = new Set(DECK.map((c) => c.word.toLowerCase()));
  for (const w of ["thrive", "fragile", "prone", "sediment", "erosion", "abundant", "vulnerable"]) assert.ok(words.has(w), `TOEFL word ${w}`);
  assert.equal(new Set(DECK.map((c) => c.id)).size, DECK.length);
  assert.equal(new Set(DECK.map((c) => c.word.toLowerCase())).size, DECK.length, "no duplicate words");
});

test("kalıplar and linkers are cards with their pattern, example and note", () => {
  assert.ok(EXPRESSIONS.length >= 50 && EXPRESSIONS.length <= 60);
  const expr = DECK.filter((c) => c.expr);
  assert.equal(expr.length, EXPRESSIONS.length);
  for (const word of ["feel like", "be interested in", "take a break", "have a look", "be used to", "get used to"]) assert.ok(expr.some((c) => c.word === word), word);
  const links = DECK.filter((c) => c.link);
  assert.equal(links.length, LINKERS.length);
  for (const card of links) assert.ok(LINK_FUNCTIONS[card.link.func] && card.link.pattern && card.link.example, card.word);
  assert.ok(POS_TR.expr && POS_TR.link && TOPICS.expr && TOPICS.link);
  // A linker question never offers two options with the same function.
  const however = DECK.find((c) => c.word === "however");
  const { options } = choicesFor(however, links, { key: (c) => [c.link.func] });
  assert.equal(new Set(options.map((o) => o.link.func)).size, 4);
  assert.ok(meaningsOf(however).length >= 1);
});

test("phrasal cards explain their particle with other expressions that share it", () => {
  const card = DECK.find((c) => c.word === "give up");
  const hints = particleHints(card);
  assert.equal(hints[0].particle, "up");
  assert.ok(hints[0].hint && hints[0].examples.length >= 3);
  assert.ok(!hints[0].examples.includes("give up"));
  assert.ok(particleHints(DECK.find((c) => c.word === "look forward to")).map((h) => h.particle).includes("forward"));
  assert.deepEqual(particleHints(DECK.find((c) => c.word === "however")), []);
});

// ── Grammar ────────────────────────────────────────────────────────────────

test("every grammar lesson, A1 to C2, has teaching and practice", () => {
  assert.equal(LESSONS.length, 90);
  for (const lesson of LESSONS) {
    const practice = (lesson.full?.exercises.length ?? 0) + lesson.drills.length;
    assert.ok(practice >= 5, `${lesson.code} practice`);
    assert.ok(lesson.full || lesson.ozet || lesson.legacy.length || lesson.checks.length, `${lesson.code} teaching`);
  }
  for (const code of ["G1.6", "G1.7", "G2.14", "G2.15", "G3.11", "G3.12", "G3.13", "G4.6", "G4.7", "G5.8", "G6.6", "G6.7", "G7.8", "G7.9", "G7.10", "G8.4", "G9.4", "G11.3", "G1.8", "G8.5", "G10.10"]) assert.ok(LESSON_BY_CODE.get(code)?.isNew, code);
  assert.match(LESSON_BY_CODE.get("G4.6").title, /would/u);
  assert.match(LESSON_BY_CODE.get("G3.11").title, /be used to/u);
});

test("drill items are gradable: valid options, and a rewrite never differs from its source only by punctuation", () => {
  for (const lesson of LESSONS) {
    for (const item of lesson.drills) {
      assert.match(item.id, /^G\d+\.\d+-d\d+$/u);
      if (item.type === "mcq") {
        assert.ok(item.options.length === 4 && item.options[item.answer], item.id);
        assert.equal(gradeLessonItem(item, item.answer).correct, true);
      } else {
        assert.ok(String(item.answer).trim(), item.id);
        assert.equal(gradeLessonItem(item, item.answer).correct, true, item.id);
        if (item.type === "rewrite") assert.notEqual(normalizeSentence(item.source), normalizeSentence(item.answer), `${item.id} must change words`);
      }
      assert.ok(item.why, item.id);
    }
  }
});

test("G6.7 teaches every use of get and lists all get expressions of the deck", () => {
  const lesson = LESSON_BY_CODE.get("G6.7");
  assert.equal(lesson.family, "get");
  const rows = lesson.table.flatMap(([, list]) => list.map(([en]) => en));
  for (const phrase of ["get stressed", "get lost", "get home", "get back", "get my laptop fixed", "get to know sb"]) assert.ok(rows.includes(phrase), phrase);
  assert.ok(DECK.filter((c) => c.word.startsWith("get ")).length >= 30);
});

// ── Scoring guides and toolkits ────────────────────────────────────────────

test("every task has a scoring guide; rubric tasks have bands 5 to 0", () => {
  for (const task of TASK_TYPES) {
    const guide = TASK_GUIDE[task.id];
    assert.ok(guide && guide.measures && guide.scoring && guide.do.length >= 2 && guide.avoid.length >= 1 && guide.time, task.id);
  }
  for (const kind of ["email", "discussion", "interview", "listen-repeat"]) assert.deepEqual(BANDS[kind].map(([band]) => band), [5, 4, 3, 2, 1, 0]);
  assert.deepEqual(Object.keys(SECTION_GUIDE).sort(), ["listening", "reading", "speaking", "writing"]);
});

test("the toolkits cover openers, time-buyers, fillers, conditionals and both writing tasks", () => {
  assert.deepEqual(SPEAKING_TOOLKIT.map((g) => g.id), ["open", "time", "fill", "reason", "if", "wrap", "fix"]);
  assert.ok(SPEAKING_TOOLKIT.find((g) => g.id === "if").items.some(([en]) => /If I had/u.test(en)));
  assert.ok(PRACTICE_TIPS.length >= 5);
  assert.ok(WRITING_FRAMES.email.steps.length >= 6 && WRITING_FRAMES.discussion.steps.length >= 5);
  for (const func of ["sequence", "addition", "contrast", "result", "example", "opinion", "conclusion"]) assert.ok(LINKERS.some((row) => row[1] === func), func);
});

test("the app shows the six tabs and the daily start button", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /\['home','home','Antrenman'/u);
  for (const tab of ["'reading','book','Reading'", "'listening','headphones','Listening'", "'speaking','mic','Speaking'", "'writing','pen','Writing'", "'library','layers','Gramer'"]) assert.ok(app.includes(tab), tab);
  assert.match(app, /data-action="daily-next"/u);
});

test("irregular verbs: three forms, four patterns and forgiving answers (learned/learnt)", async () => {
  const { IRREGULAR_VERBS, verbPattern, formMatches } = await import("../data/irregular.js");
  assert.ok(IRREGULAR_VERBS.length >= 100);
  assert.equal(new Set(IRREGULAR_VERBS.map(([v1]) => v1)).size, IRREGULAR_VERBS.length, "no duplicate verbs");
  assert.equal(verbPattern(["cut", "cut", "cut"]), "AAA");
  assert.equal(verbPattern(["buy", "bought", "bought"]), "ABB");
  assert.equal(verbPattern(["come", "came", "come"]), "ABA");
  assert.equal(verbPattern(["go", "went", "gone"]), "ABC");
  assert.ok(formMatches("learned/learnt", " Learnt ") && formMatches("was/were", "were") && !formMatches("gone", "went"));
  for (const pattern of ["AAA", "ABB", "ABA", "ABC"]) assert.ok(IRREGULAR_VERBS.some((row) => verbPattern(row) === pattern), pattern);
  assert.ok(LESSON_BY_CODE.get("G3.13").verbs);
});

test("usage tables: that, who/whom/whose, modal + have + V3, very/so/too, a few/a little, supposed to", () => {
  const rows = (code) => LESSON_BY_CODE.get(code).table.flatMap(([, list]) => list.map(([en]) => en)).join(" | ");
  assert.match(rows("G7.10"), /fact that/u);
  assert.match(rows("G7.10"), /so that/u);
  assert.match(rows("G7.9"), /whom/u);
  assert.match(rows("G4.4"), /could have done/u);
  assert.match(rows("G4.4"), /would have done/u);
  assert.match(rows("G4.2"), /be supposed to/u);
  assert.match(rows("G8.3"), /too long \/ so long/u);
  assert.match(rows("G8.3"), /very big/u);
  assert.match(rows("G2.4"), /a few/u);
  assert.match(rows("G11.3"), /affect \/ effect/u);
});

test("the grammar program runs A1 → C2 over every lesson, with reference tables for every rule set", async () => {
  const { GRAMMAR_REFS } = await import("../data/grammar-ref.js");
  const rank = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /left:PROGRAM\.filter\(/u, "the daily plan follows the program order");
  const ordered = [...LESSONS].sort((a, b) => rank[a.level.split(/[–-]/u)[0]] - rank[b.level.split(/[–-]/u)[0]]);
  assert.equal(ordered[0].level.slice(0, 2), "A1");
  assert.equal(ordered.at(-1).level.slice(0, 2), "C2");
  assert.deepEqual(GRAMMAR_REFS.map((r) => r.id), ["tenses", "passive", "conditionals", "modals", "reported", "questions"]);
  assert.equal(GRAMMAR_REFS[0].rows.length, 13, "all tenses");
  for (const ref of GRAMMAR_REFS) {
    for (const row of ref.rows) assert.equal(row.length, ref.head.length, `${ref.id} row shape`);
    for (const code of ref.lessons) assert.ok(LESSON_BY_CODE.get(code), `${ref.id} → ${code}`);
  }
});

test("the syllabus audit points are all taught somewhere (gerund lists, correlatives, degree adverbs, dates, future in the past)", () => {
  const text = JSON.stringify(LESSONS).toLowerCase();
  for (const probe of ["can't stand", "it's no use", "both x and y", "neither x nor y", "as if", "absolutely", "was going to", "twice", "no sooner", "each other", "a friend of mine", "how often", "compound", "ordinal".replace("ordinal", "sıra sayıları"), "supposing", "apart from", "be made to"]) {
    assert.ok(text.includes(probe), probe);
  }
});

test("günlük alternatifler: each basic phrase has natural replacements with tone and example", async () => {
  const { EVERYDAY, TONES } = await import("../data/everyday.js");
  assert.ok(EVERYDAY.length >= 30);
  const phrases = EVERYDAY.flatMap((g) => g.items.map(([phrase]) => phrase));
  assert.equal(new Set(phrases.map((p) => p.toLowerCase())).size, phrases.length, "no duplicates");
  assert.equal(new Set(EVERYDAY.map((g) => g.id)).size, EVERYDAY.length);
  for (const group of EVERYDAY) {
    assert.ok(group.base && group.tr && group.items.length >= 4, group.id);
    for (const [phrase, tr, example, tone] of group.items) {
      assert.ok(phrase && tr && TONES[tone], `${group.id}: ${phrase}`);
      assert.match(example, /^[A-Z].*[.?!]$/u, `${phrase} example`);
    }
  }
  const want = EVERYDAY.find((g) => g.id === "want").items.map(([p]) => p);
  for (const p of ["I'd like …", "I could go for …", "I feel like …-ing", "I'd love to …"]) assert.ok(want.includes(p), p);
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /everydayCards\.filter\(p=>p\.group!==card\.group\)/u, "distractors come from other groups");
  assert.match(app, /spreadMerge\(\[DECK\.filter\(c=>\(c\.expr\|\|c\.link\)&&!c\.phrasal\),phraseCards,everydayCards\]\)/u, "they are part of the daily plan");
});
