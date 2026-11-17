import test from "node:test";
import assert from "node:assert/strict";

import { EXAM_SPEC, TASK_TYPES, exercises } from "../data/content.js";
import { CONTENT_META, grammar, vocabulary } from "../data/library.js";

const SKILLS = ["listening", "reading", "speaking", "writing"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const TASK_CONTRACT = new Map([
  ["complete-words", { skill: "reading", type: "gaps" }],
  ["daily-reading", { skill: "reading", type: "mcq" }],
  ["academic-reading", { skill: "reading", type: "mcq" }],
  ["choose-response", { skill: "listening", type: "mcq" }],
  ["conversation", { skill: "listening", type: "mcq" }],
  ["announcement", { skill: "listening", type: "mcq" }],
  ["academic-talk", { skill: "listening", type: "mcq" }],
  ["build-sentence", { skill: "writing", type: "order" }],
  ["email", { skill: "writing", type: "writing" }],
  ["discussion", { skill: "writing", type: "writing" }],
  ["listen-repeat", { skill: "speaking", type: "speaking" }],
  ["interview", { skill: "speaking", type: "speaking" }],
]);

function normalized(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/gu, " ")
    .toLocaleLowerCase("en-US");
}

function lexicalTokens(value) {
  return (
    String(value ?? "")
      .normalize("NFKC")
      .replace(/’/gu, "'")
      .toLocaleLowerCase("en-US")
      .match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? []
  );
}

function tokenMultiset(values) {
  const counts = new Map();
  for (const token of values) counts.set(token, (counts.get(token) ?? 0) + 1);
  return Object.fromEntries([...counts].sort(([left], [right]) => left.localeCompare(right)));
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be blank`);
}

function assertUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    assertNonEmptyString(item?.id, `${label}.id`);
    assert.ok(!seen.has(item.id), `${label} contains duplicate id ${item.id}`);
    seen.add(item.id);
  }
}

function assertFourUniqueOptions(options, label) {
  assert.ok(Array.isArray(options), `${label}.options must be an array`);
  assert.equal(options.length, 4, `${label} must have exactly four options`);
  options.forEach((option, index) => assertNonEmptyString(option, `${label}.options[${index}]`));
  assert.equal(
    new Set(options.map(normalized)).size,
    4,
    `${label} options must remain distinct after normalization`,
  );
}

function collectNetworkUrls(value, path = "$", findings = []) {
  if (typeof value === "string") {
    if (/\b(?:https?|wss?|ftp):\/\/\S+|\bwww\.[^\s]+/iu.test(value)) {
      findings.push(`${path}: ${value}`);
    }
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectNetworkUrls(entry, `${path}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      collectNetworkUrls(entry, `${path}.${key}`, findings);
    }
  }
  return findings;
}

test("all content-bank identifiers are unique, including across banks", () => {
  assertUniqueIds(TASK_TYPES, "task types");
  assertUniqueIds(exercises, "exercises");
  assertUniqueIds(vocabulary, "vocabulary");
  assertUniqueIds(grammar, "grammar");

  const allItemIds = [...exercises, ...vocabulary, ...grammar].map((item) => item.id);
  assert.equal(
    new Set(allItemIds).size,
    allItemIds.length,
    "exercise, vocabulary, and grammar ids must not collide",
  );
});

test("the twelve-task taxonomy is complete, skill-aligned, and covered by exercises", () => {
  assert.equal(TASK_TYPES.length, 12, "the current exam taxonomy must expose twelve task types");
  assert.deepEqual(
    TASK_TYPES.map((task) => task.id).sort(),
    [...TASK_CONTRACT.keys()].sort(),
    "declared task ids drifted from the supported twelve-type contract",
  );

  const declarations = new Map(TASK_TYPES.map((task) => [task.id, task]));
  for (const [taskId, expected] of TASK_CONTRACT) {
    const declaration = declarations.get(taskId);
    assert.equal(declaration.skill, expected.skill, `${taskId} is assigned to the wrong skill`);
    assert.ok(
      exercises.some((item) => item.taskType === taskId),
      `${taskId} has no exercise coverage`,
    );
  }

  for (const item of exercises) {
    const expected = TASK_CONTRACT.get(item.taskType);
    assert.ok(expected, `${item.id} uses undeclared task type ${item.taskType}`);
    assert.equal(item.skill, expected.skill, `${item.id} contradicts its task type's skill`);
    assert.equal(item.type, expected.type, `${item.id} uses the wrong interaction format`);
  }
});

test("exam spec, task declarations, and exercise bank all cover the four skills", () => {
  const expected = [...SKILLS].sort();
  const specSkills = EXAM_SPEC.sections.map((section) => section.skill).sort();
  const declaredSkills = [...new Set(TASK_TYPES.map((task) => task.skill))].sort();
  const exerciseSkills = [...new Set(exercises.map((item) => item.skill))].sort();

  assert.deepEqual(specSkills, expected, "exam spec must contain each skill exactly once");
  assert.deepEqual(declaredSkills, expected, "task taxonomy does not cover all skills");
  assert.deepEqual(exerciseSkills, expected, "exercise bank does not cover all skills");
  for (const section of EXAM_SPEC.sections) {
    assert.ok(Number.isInteger(section.items) && section.items > 0, `${section.skill} item count is invalid`);
    assert.ok(Number.isFinite(section.minutes) && section.minutes > 0, `${section.skill} duration is invalid`);
  }
});

test("every multiple-choice item has four distinct options and a valid zero-based answer", () => {
  const items = exercises.filter((item) => item.type === "mcq");
  assert.ok(items.length > 0, "the exercise bank unexpectedly has no MCQs");

  for (const item of items) {
    assertFourUniqueOptions(item.options, item.id);
    assert.ok(Number.isInteger(item.answer), `${item.id}.answer must be an integer`);
    assert.ok(
      item.answer >= 0 && item.answer < item.options.length,
      `${item.id}.answer is outside its option array`,
    );
    assertNonEmptyString(item.explanation, `${item.id}.explanation`);
  }
});

test("gap exercises have ten unique matching placeholders and reconstruct full words", () => {
  const items = exercises.filter((item) => item.type === "gaps");
  assert.ok(items.length > 0, "the exercise bank unexpectedly has no gap tasks");

  for (const item of items) {
    assert.ok(Array.isArray(item.gaps), `${item.id}.gaps must be an array`);
    assert.equal(item.gaps.length, 10, `${item.id} must contain exactly ten gap definitions`);
    assertNonEmptyString(item.passage, `${item.id}.passage`);

    const placeholders = [...item.passage.matchAll(/([\p{L}]+)\{\{(\d+)\}\}/gu)];
    assert.equal(placeholders.length, 10, `${item.id} must contain exactly ten inline placeholders`);

    const indices = placeholders.map((match) => Number(match[2]));
    assert.equal(new Set(indices).size, 10, `${item.id} repeats a placeholder index`);
    assert.deepEqual(
      [...indices].sort((left, right) => left - right),
      Array.from({ length: 10 }, (_, index) => index),
      `${item.id} placeholders must be the complete 0-9 range`,
    );

    for (const match of placeholders) {
      const index = Number(match[2]);
      const gap = item.gaps[index];
      assert.ok(gap && typeof gap === "object", `${item.id} has no gap definition for {{${index}}}`);
      assert.equal(match[1], gap.prefix, `${item.id} prefix before {{${index}}} does not match gap data`);
      assert.match(gap.prefix, /^\p{L}+$/u, `${item.id}.gaps[${index}].prefix must contain letters only`);
      assert.match(gap.answer, /^\p{L}+$/u, `${item.id}.gaps[${index}].answer must contain letters only`);

      const fullWord = `${gap.prefix}${gap.answer}`;
      assert.match(fullWord, /^\p{L}{2,}$/u, `${item.id} reconstructs an invalid word at gap ${index}`);
    }

    const reconstructed = item.passage.replace(/\{\{(\d+)\}\}/gu, (_, rawIndex) => {
      return item.gaps[Number(rawIndex)].answer;
    });
    assert.doesNotMatch(reconstructed, /\{\{|\}\}/u, `${item.id} leaves placeholder syntax behind`);
    for (const gap of item.gaps) {
      assert.ok(
        reconstructed.includes(`${gap.prefix}${gap.answer}`),
        `${item.id} does not contain reconstructed word ${gap.prefix}${gap.answer}`,
      );
    }
  }
});

test("sentence-order tokens have the same punctuation-neutral multiset as the answer", () => {
  const items = exercises.filter((item) => item.type === "order");
  assert.ok(items.length > 0, "the exercise bank unexpectedly has no order tasks");

  for (const item of items) {
    assert.ok(Array.isArray(item.tokens) && item.tokens.length > 0, `${item.id}.tokens must be populated`);
    assertNonEmptyString(item.answer, `${item.id}.answer`);

    const suppliedTokens = item.tokens.flatMap(lexicalTokens);
    const answerTokens = lexicalTokens(item.answer);
    assert.deepEqual(
      tokenMultiset(suppliedTokens),
      tokenMultiset(answerTokens),
      `${item.id} tokens cannot reconstruct its answer without adding, dropping, or duplicating words`,
    );
  }
});

test("grammar bank has six lessons per editorial level and valid quizzes", () => {
  assert.equal(grammar.length, 36, "grammar bank must contain thirty-six lessons");
  for (const level of LEVELS) {
    assert.equal(
      grammar.filter((lesson) => lesson.level === level).length,
      6,
      `${level} must have exactly six grammar lessons`,
    );
  }

  for (const lesson of grammar) {
    assert.ok(LEVELS.includes(lesson.level), `${lesson.id} has unsupported level ${lesson.level}`);
    for (const field of ["title", "summary", "explanation", "commonMistake", "examUse"]) {
      assertNonEmptyString(lesson[field], `${lesson.id}.${field}`);
    }
    assert.ok(Array.isArray(lesson.examples), `${lesson.id}.examples must be an array`);
    assert.equal(lesson.examples.length, 2, `${lesson.id} must have two bilingual examples`);
    lesson.examples.forEach((example, index) => {
      assertNonEmptyString(example?.en, `${lesson.id}.examples[${index}].en`);
      assertNonEmptyString(example?.tr, `${lesson.id}.examples[${index}].tr`);
    });

    assertNonEmptyString(lesson.quiz?.question, `${lesson.id}.quiz.question`);
    assertFourUniqueOptions(lesson.quiz?.options, `${lesson.id}.quiz`);
    assert.ok(Number.isInteger(lesson.quiz?.answer), `${lesson.id}.quiz.answer must be an integer`);
    assert.ok(
      lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.options.length,
      `${lesson.id}.quiz.answer is outside its option array`,
    );
    assertNonEmptyString(lesson.quiz?.explanation, `${lesson.id}.quiz.explanation`);
  }
});

test("vocabulary bank exposes complete records and all editorial levels", () => {
  const requiredFields = [
    "id",
    "word",
    "level",
    "partOfSpeech",
    "meaning",
    "definition",
    "example",
    "collocations",
    "family",
    "topic",
  ];
  assert.ok(vocabulary.length >= 120, "vocabulary bank must contain at least 120 entries");
  assert.deepEqual([...new Set(vocabulary.map((entry) => entry.level))].sort(), [...LEVELS].sort());
  assert.equal(
    new Set(vocabulary.map((entry) => normalized(entry.word))).size,
    vocabulary.length,
    "vocabulary headwords and phrases must be unique after normalization",
  );

  for (const entry of vocabulary) {
    for (const field of requiredFields) {
      assert.ok(Object.hasOwn(entry, field), `${entry.id ?? "unknown vocabulary item"} lacks ${field}`);
    }
    assert.ok(LEVELS.includes(entry.level), `${entry.id} has unsupported level ${entry.level}`);
    for (const field of ["word", "partOfSpeech", "meaning", "definition", "example", "topic"]) {
      assertNonEmptyString(entry[field], `${entry.id}.${field}`);
    }
    for (const field of ["collocations", "family"]) {
      assert.ok(Array.isArray(entry[field]) && entry[field].length > 0, `${entry.id}.${field} must be populated`);
      entry[field].forEach((value, index) => assertNonEmptyString(value, `${entry.id}.${field}[${index}]`));
    }
  }
});

test("content items contain no embedded network URLs", () => {
  const findings = [
    ...collectNetworkUrls(TASK_TYPES, "TASK_TYPES"),
    ...collectNetworkUrls(exercises, "exercises"),
    ...collectNetworkUrls(vocabulary, "vocabulary"),
    ...collectNetworkUrls(grammar, "grammar"),
  ];
  assert.deepEqual(
    findings,
    [],
    "content records must stay self-contained; keep external references outside individual items",
  );
});

test("original-content provenance metadata remains explicit", () => {
  assert.deepEqual(CONTENT_META, {
    version: 1,
    provenance: "original-ai-assisted",
    reviewStatus: "editorial-review-pending",
  });
  for (const item of exercises) {
    assert.equal(item.provenance, "original-ai-assisted", `${item.id} has no original-content marker`);
  }
});
