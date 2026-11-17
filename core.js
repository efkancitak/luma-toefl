const SKILLS = Object.freeze(["reading", "listening", "writing", "speaking"]);
const RATINGS = new Set(["again", "hard", "good", "easy"]);
const DAY_MS = 86_400_000;
const MAX_ITEMS = 12;
// A timed session is bounded by its minutes, not by the short free-session cap.
const MAX_TIMED_ITEMS = 40;
export const MAX_BACKUP_BYTES = 20_000_000;

function validDate(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError("Geçerli bir tarih gerekli.");
  return date;
}

function localDateKey(value) {
  const date = validDate(value);
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calendarSerial(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new TypeError("Geçerli bir YYYY-MM-DD tarihi gerekli.");
    }
    return Date.UTC(year, month - 1, day) / DAY_MS;
  }

  const date = validDate(value);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS;
}

function normalizedText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

function normalizedOrderedText(value) {
  return normalizedText(value).replace(/[.!?…]+$/u, "").trim();
}

function safeMinutes(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 1;
}

function matchesFilter(value, filter) {
  return filter === "all" || normalizedText(value) === normalizedText(filter);
}

function uniqueId(prefix, now) {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `${prefix}-${uuid}`;
  return `${prefix}-${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createState(now = new Date()) {
  return {
    schemaVersion: 1,
    profile: {
      examDate: "2027-01-15",
      startDate: localDateKey(now),
      targetBand: "",
    },
    session: null,
    attempts: [],
    reviews: {},
    drafts: {},
    readLessons: [],
    reviewSession: null,
    lessonProgress: {},
    grammarReviews: {},
    grammarSession: null,
    speakingRun: null,
    speakingLog: [],
    pronunciation: {},
    screenings: {},
    activity: [],
    itemReviews: {},
    examLog: [],
  };
}

/**
 * Builds a short, varied queue. This is intentionally a transparent heuristic:
 * unattempted material comes first, weak skills get a modest boost, and repeated
 * skills/task types receive a diversity penalty.
 */
export function selectExercises(bank, attempts, options = {}) {
  if (!Array.isArray(bank)) return [];
  const history = Array.isArray(attempts) ? attempts : [];
  const skill = options.skill ?? "all";
  const taskType = options.taskType ?? "all";
  const level = options.level ?? "all";
  const requestedMinutes = [0, 15, 30, 60].includes(Number(options.minutes))
    ? Number(options.minutes)
    : 15;
  const quiet = options.quiet === true;

  const itemAttempts = new Map();
  const skillHistory = Object.fromEntries(SKILLS.map((name) => [name, { count: 0, scoreTotal: 0 }]));
  for (const attempt of history) {
    if (!attempt || typeof attempt !== "object") continue;
    if (typeof attempt.itemId === "string") {
      itemAttempts.set(attempt.itemId, (itemAttempts.get(attempt.itemId) ?? 0) + 1);
    }
    if (
      SKILLS.includes(attempt.skill) &&
      attempt.selfAssessed !== true &&
      attempt.assisted !== true &&
      typeof attempt.correct === "boolean"
    ) {
      skillHistory[attempt.skill].count += 1;
      const score = Number.isFinite(attempt.score) && attempt.score >= 0 && attempt.score <= 1
        ? attempt.score
        : attempt.correct ? 1 : 0;
      skillHistory[attempt.skill].scoreTotal += score;
    }
  }

  const candidates = bank
    .filter((item) => item && typeof item === "object" && typeof item.id === "string")
    .filter((item) => SKILLS.includes(item.skill))
    .filter((item) => matchesFilter(item.skill, skill))
    .filter((item) => matchesFilter(item.taskType, taskType))
    .filter((item) => matchesFilter(item.level, level))
    .filter((item) => !(quiet && (item.skill === "listening" || item.skill === "speaking")))
    .map((item, sourceIndex) => ({ item, sourceIndex }));

  const selected = [];
  const used = new Set();
  const selectedSkills = new Map();
  const selectedTasks = new Map();
  let spent = 0;

  const maxItems = requestedMinutes > 0 ? MAX_TIMED_ITEMS : MAX_ITEMS;
  while (selected.length < maxItems) {
    let best = null;
    let bestScore = -Infinity;

    for (const candidate of candidates) {
      const { item, sourceIndex } = candidate;
      if (used.has(sourceIndex)) continue;
      const duration = safeMinutes(item.estimatedMinutes);
      if (requestedMinutes > 0 && spent + duration > requestedMinutes) continue;

      const priorCount = itemAttempts.get(item.id) ?? 0;
      const sampled = skillHistory[item.skill];
      const accuracy = sampled.count ? sampled.scoreTotal / sampled.count : 0.5;
      const weaknessBoost = (1 - accuracy) * 30;
      const noveltyBoost = priorCount === 0 ? 100 : 0;
      const skillPenalty = (selectedSkills.get(item.skill) ?? 0) * 22;
      const taskPenalty = (selectedTasks.get(item.taskType) ?? 0) * 8;
      const repeatPenalty = priorCount * 4;
      const score = noveltyBoost + weaknessBoost - skillPenalty - taskPenalty - repeatPenalty;

      if (score > bestScore || (score === bestScore && sourceIndex < best.sourceIndex)) {
        best = candidate;
        bestScore = score;
      }
    }

    if (!best) break;
    const item = best.item;
    selected.push(item);
    used.add(best.sourceIndex);
    spent += safeMinutes(item.estimatedMinutes);
    selectedSkills.set(item.skill, (selectedSkills.get(item.skill) ?? 0) + 1);
    selectedTasks.set(item.taskType, (selectedTasks.get(item.taskType) ?? 0) + 1);
  }

  return selected;
}

export function createSession(items, options = {}, now = new Date()) {
  const date = validDate(now);
  return {
    id: uniqueId("session", date),
    itemIds: Array.isArray(items)
      ? items.filter((item) => item && typeof item.id === "string").map((item) => item.id)
      : [],
    index: 0,
    answers: {},
    createdAt: date.toISOString(),
    options: options && typeof options === "object" ? { ...options } : {},
    completedAt: null,
  };
}

export function gradeAnswer(item, response) {
  if (!item || typeof item !== "object") {
    return { correct: false, score: 0, feedback: "Soru bulunamadı." };
  }

  if (item.type === "writing" || item.type === "speaking") {
    return {
      correct: null,
      score: null,
      feedback: "Bu yanıt otomatik puanlanmaz; rubriğe göre öz değerlendirme yap.",
      needsSelfAssessment: true,
    };
  }

  if (item.type === "mcq") {
    if (response === undefined || response === null || response === "") {
      return { correct: false, score: 0, feedback: "Bir seçenek seçmelisin." };
    }
    const selected = typeof response === "string" && /^\d+$/.test(response.trim())
      ? Number(response)
      : response;
    const correct = selected === item.answer;
    return {
      correct,
      score: correct ? 1 : 0,
      feedback: correct ? "Doğru." : "Henüz değil; açıklamayı inceleyip yeniden dene.",
    };
  }

  if (item.type === "gaps") {
    const gaps = Array.isArray(item.gaps) ? item.gaps : [];
    const responses = Array.isArray(response) ? response : [];
    if (gaps.length === 0) {
      return { correct: false, score: 0, feedback: "Boşluk verisi bulunamadı." };
    }
    let correctCount = 0;
    gaps.forEach((gap, index) => {
      if (normalizedText(responses[index]) === normalizedText(gap?.answer)) correctCount += 1;
    });
    const score = correctCount / gaps.length;
    return {
      correct: correctCount === gaps.length,
      score,
      feedback: `${correctCount}/${gaps.length} boşluk doğru.`,
    };
  }

  if (item.type === "order") {
    if (response === undefined || response === null || normalizedText(response) === "") {
      return { correct: false, score: 0, feedback: "Cümleyi oluşturmalısın." };
    }
    const correct = normalizedOrderedText(response) === normalizedOrderedText(item.answer);
    return {
      correct,
      score: correct ? 1 : 0,
      feedback: correct ? "Doğru cümle." : "Sözcük sırasını ve cümle yapısını yeniden kontrol et.",
    };
  }

  return { correct: false, score: 0, feedback: "Bu soru türü puanlanamıyor." };
}

export function skillStats(attempts) {
  const result = Object.fromEntries(
    SKILLS.map((skill) => [skill, {
      count: 0,
      correct: 0,
      accuracy: null,
      selfCount: 0,
      assistedCount: 0,
      repeatCount: 0,
    }]),
  );
  const scoreTotals = Object.fromEntries(SKILLS.map((skill) => [skill, 0]));
  if (!Array.isArray(attempts)) return result;

  // An answer-keyed item solved before is a repeat: it is shown separately and
  // never raises the independent accuracy (REQUIREMENTS "Oturum, öğretim ve ölçüm").
  const seenItems = new Set();
  for (const attempt of attempts) {
    if (!attempt || !SKILLS.includes(attempt.skill)) continue;
    const bucket = result[attempt.skill];
    const objective = attempt.selfAssessed !== true && typeof attempt.correct === "boolean";
    const repeated = objective && typeof attempt.itemId === "string" && seenItems.has(attempt.itemId);
    if (objective && typeof attempt.itemId === "string") seenItems.add(attempt.itemId);
    if (attempt.selfAssessed === true) {
      bucket.selfCount += 1;
    } else if (repeated) {
      bucket.repeatCount += 1;
    } else if (attempt.assisted === true && typeof attempt.correct === "boolean") {
      bucket.assistedCount += 1;
    } else if (typeof attempt.correct === "boolean") {
      bucket.count += 1;
      if (attempt.correct) bucket.correct += 1;
      scoreTotals[attempt.skill] += Number.isFinite(attempt.score) && attempt.score >= 0 && attempt.score <= 1
        ? attempt.score
        : attempt.correct ? 1 : 0;
    }
  }

  for (const skill of SKILLS) {
    const bucket = result[skill];
    bucket.accuracy = bucket.count ? Math.round((scoreTotals[skill] / bucket.count) * 100) : null;
  }
  return result;
}

export function scheduleReview(previous, rating, now = new Date()) {
  if (!RATINGS.has(rating)) throw new RangeError("Tekrar puanı again, hard, good veya easy olmalı.");
  const date = validDate(now);
  const priorRepetitions = Number.isInteger(previous?.repetitions) && previous.repetitions >= 0
    ? previous.repetitions
    : 0;
  const priorInterval = Number.isFinite(previous?.intervalDays) && previous.intervalDays > 0
    ? previous.intervalDays
    : 0;

  let repetitions;
  let intervalDays;
  if (rating === "again") {
    repetitions = 0;
    intervalDays = 10 / 1_440;
  } else if (rating === "hard") {
    repetitions = priorRepetitions + 1;
    intervalDays = Math.max(1, Math.ceil(priorInterval * 1.3));
  } else if (rating === "good") {
    repetitions = priorRepetitions + 1;
    intervalDays = priorRepetitions === 0 ? 1 : priorRepetitions === 1 ? 3 : Math.max(4, Math.ceil(priorInterval * 2));
  } else {
    repetitions = priorRepetitions + 1;
    intervalDays = priorRepetitions === 0 ? 3 : priorRepetitions === 1 ? 7 : Math.max(8, Math.ceil(priorInterval * 2.5));
  }

  return {
    repetitions,
    intervalDays,
    dueAt: new Date(date.getTime() + intervalDays * DAY_MS).toISOString(),
    lastReviewedAt: date.toISOString(),
  };
}

/** Returns original vocabulary records separated into due and unseen queues. */
export function dueVocabulary(vocabulary, reviews, now = new Date()) {
  const date = validDate(now);
  const reviewMap = reviews && typeof reviews === "object" ? reviews : {};
  const due = [];
  const fresh = [];

  for (const item of Array.isArray(vocabulary) ? vocabulary : []) {
    if (!item || typeof item.id !== "string") continue;
    const review = reviewMap[item.id];
    if (!review) {
      fresh.push(item);
      continue;
    }
    const dueTime = new Date(review.dueAt).getTime();
    if (!Number.isFinite(dueTime) || dueTime <= date.getTime()) {
      due.push({ item, dueTime: Number.isFinite(dueTime) ? dueTime : -Infinity });
    }
  }

  due.sort((a, b) => a.dueTime - b.dueTime || a.item.id.localeCompare(b.item.id));
  fresh.sort((a, b) => {
    const aLabel = normalizedText(a.word ?? a.term ?? a.id);
    const bLabel = normalizedText(b.word ?? b.term ?? b.id);
    return aLabel.localeCompare(bLabel) || a.id.localeCompare(b.id);
  });
  return { due: due.map((entry) => entry.item), new: fresh };
}

export function daysUntil(date, now = new Date()) {
  return calendarSerial(date) - calendarSerial(now);
}

export function planWeek(startDate, now = new Date()) {
  const elapsedDays = calendarSerial(now) - calendarSerial(startDate);
  return Math.min(8, Math.max(1, Math.floor(elapsedDays / 7) + 1));
}

// ── v0.2: text normalisation, dictation comparison and lesson grading ──────

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** English cardinal words for 0–999 999 (no "and"), e.g. 21 → "twenty one". */
export function numberToWords(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 999_999) return String(value);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberToWords(n % 100)}` : ""}`;
  return `${numberToWords(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberToWords(n % 1000)}` : ""}`;
}

function ordinalWords(n) {
  const words = numberToWords(n).split(" ");
  const last = words.pop();
  const special = { one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth" };
  const ordinal = special[last] ?? (last.endsWith("y") ? `${last.slice(0, -1)}ieth` : `${last}th`);
  return [...words, ordinal].join(" ");
}

const CONTRACTIONS = [
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/\bwon't\b/g, "will not"],
  [/\bshan't\b/g, "shall not"],
  [/\bain't\b/g, "is not"],
  [/n't\b/g, " not"],
  [/\bi'm\b/g, "i am"],
  [/'re\b/g, " are"],
  [/'ve\b/g, " have"],
  [/'ll\b/g, " will"],
  [/\blet's\b/g, "let us"],
  [/\b(it|he|she|that|there|what|who|where|here|how|when|why)'s\b/g, "$1 is"],
];
const PRONOUN_D = /\b(i|you|he|she|it|we|they|that|there|who)(?:'d|\s+would|\s+had)\b/g;

/**
 * Comparable form of an English sentence.
 * mode "grade": keeps apostrophes (possessives matter) and treats "I'd",
 *   "I had" and "I would" alike, so short forms are never marked wrong.
 * mode "dictation": CONTENT-SPEC rules — lower case, punctuation removed,
 *   contractions expanded ('d → would), digits read as words (two = 2).
 */
export function normalizeSentence(value, mode = "grade") {
  let text = String(value ?? "")
    .normalize("NFKC")
    .replace(/[‘’ʼ`´]/gu, "'")
    .replace(/[“”]/gu, '"')
    .toLocaleLowerCase("en-US");
  text = text
    .replace(/(\d+)(?:st|nd|rd|th)\b/g, (_, d) => ` ${ordinalWords(Number(d))} `)
    .replace(/(\d+):00\b/g, "$1")
    .replace(/(\d+):(\d{2})\b/g, "$1 $2")
    .replace(/(\d),(?=\d{3}\b)/g, "$1")
    .replace(/(\d+)\s*%/g, "$1 percent")
    .replace(/\b(\d+)\b/g, (_, d) => ` ${numberToWords(Number(d))} `);
  for (const [pattern, replacement] of CONTRACTIONS) text = text.replace(pattern, replacement);
  text = text.replace(/\b([a-z])\.(?=[a-z]\.)/g, "$1").replace(/\b([a-z])\.(?=\s|$)/g, "$1");
  text = text.replace(/[-‐‑–—/]+/gu, " ");
  if (mode === "dictation") {
    text = text.replace(/\b(i|you|he|she|it|we|they|that|there|who)'d\b/g, "$1 would");
    text = text.replace(/[^\p{L}\p{N}\s]/gu, " ");
  } else {
    text = text.replace(PRONOUN_D, "$1'd");
    text = text.replace(/[^\p{L}\p{N}'\s]/gu, " ");
    // Quote marks around words are dropped; a plural possessive (parents') keeps its apostrophe.
    text = text.split(/\s+/).map((token) => token.replace(/^'+/, "").replace(/'+$/, (tail, offset, whole) => (whole.slice(0, offset).endsWith("s") ? "'" : ""))).join(" ");
  }
  return text.replace(/\s+/g, " ").trim();
}

export function dictationTokens(text) {
  const normal = normalizeSentence(text, "dictation");
  return normal ? normal.split(" ") : [];
}

/**
 * Word-level minimum-edit alignment between the target sentence and the
 * dictated text. Result is a "dikte eşleşmesi" — never a pronunciation score.
 */
export function compareDictation(target, spoken) {
  const a = dictationTokens(target);
  const b = dictationTokens(spoken);
  const rows = a.length + 1;
  const cols = b.length + 1;
  // Lexicographic cost: fewest edits, then most matches, then substitutions
  // between similar words (article ↔ articles) over unrelated ones.
  const L = rows + cols;
  const K = L * L + 1;
  const similar = (x, y) => x.startsWith(y) || y.startsWith(x) || (x.length >= 3 && y.length >= 3 && x.slice(0, 3) === y.slice(0, 3));
  const step = (x, y) => (x === y ? -L : similar(x, y) ? K - 1 : K);
  const dp = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j * K : j === 0 ? i * K : 0)));
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j - 1] + step(a[i - 1], b[j - 1]), dp[i - 1][j] + K, dp[i][j - 1] + K);
    }
  }
  const ops = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1] - L) {
      ops.push({ type: "match", expected: a[i - 1], heard: b[j - 1] });
      i -= 1; j -= 1;
    } else if (i > 0 && j > 0 && a[i - 1] !== b[j - 1] && dp[i][j] === dp[i - 1][j - 1] + step(a[i - 1], b[j - 1])) {
      ops.push({ type: "changed", expected: a[i - 1], heard: b[j - 1] });
      i -= 1; j -= 1;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + K) {
      ops.push({ type: "missing", expected: a[i - 1] });
      i -= 1;
    } else {
      ops.push({ type: "extra", heard: b[j - 1] });
      j -= 1;
    }
  }
  ops.reverse();
  return {
    label: "dikte eşleşmesi",
    total: a.length,
    matched: ops.filter((op) => op.type === "match").length,
    missing: ops.filter((op) => op.type === "missing").map((op) => op.expected),
    extra: ops.filter((op) => op.type === "extra").map((op) => op.heard),
    changed: ops.filter((op) => op.type === "changed").map(({ expected, heard }) => ({ expected, heard })),
    ops,
  };
}

const NO_ARTICLE = new Set(["-", "—", "–", "ø", "0", "x", "no article", "none", "zero"]);

function gradeForm(value) {
  const raw = String(value ?? "").trim();
  if (NO_ARTICLE.has(raw.toLocaleLowerCase("en-US"))) return "-";
  return normalizeSentence(raw, "grade");
}

/** Grades one Tam anlatım exercise or review item. Free production is never auto-graded. */
export function gradeLessonItem(item, response) {
  if (!item || typeof item !== "object") return { correct: false };
  if (item.type === "free") return { correct: null, self: true };
  if (item.type === "mcq") {
    if (!Number.isInteger(response)) return { correct: false, empty: true };
    return { correct: response === item.answer };
  }
  const text = Array.isArray(response) && item.type === "order"
    ? response.map((index) => item.tokens?.[index] ?? "").join(" ")
    : String(response ?? "");
  if (!text.trim()) return { correct: false, empty: true };
  const given = gradeForm(text);
  const accepted = [item.answer, ...(Array.isArray(item.accept) ? item.accept : [])].map(gradeForm);
  return { correct: accepted.includes(given) };
}

// ── v0.2: grammar review on a different day ───────────────────────────────

export function startOfNextDay(now = new Date()) {
  const date = validDate(now);
  date.setHours(24, 0, 0, 0);
  return date;
}

/** A wrong lesson item brings the lesson's review forward to tomorrow. */
export function noteLessonMistake(previous, itemId, now = new Date()) {
  const date = validDate(now);
  const missed = [...new Set([...(previous?.missed ?? []), itemId])].slice(-50);
  const tomorrow = startOfNextDay(date).toISOString();
  return {
    repetitions: 0,
    intervalDays: 1,
    dueAt: previous?.dueAt && previous.dueAt < tomorrow ? previous.dueAt : tomorrow,
    lastReviewedAt: previous?.lastReviewedAt ?? date.toISOString(),
    missed,
    seen: previous?.seen ?? [],
    successes: previous?.successes ?? 0,
  };
}

/** Result of a review item answered on a later day: correct → growing interval, wrong → tomorrow. */
export function scheduleGrammarReview(previous, correct, now = new Date()) {
  const date = validDate(now);
  const base = { missed: previous?.missed ?? [], seen: previous?.seen ?? [], successes: previous?.successes ?? 0 };
  if (!correct) {
    return { ...base, repetitions: 0, intervalDays: 1, dueAt: startOfNextDay(date).toISOString(), lastReviewedAt: date.toISOString() };
  }
  const next = scheduleReview(previous, "good", date);
  const earliest = startOfNextDay(date).toISOString();
  return { ...base, ...next, dueAt: next.dueAt < earliest ? earliest : next.dueAt, successes: base.successes + 1 };
}

export function dueGrammarCodes(reviews, now = new Date()) {
  const time = validDate(now).toISOString();
  return Object.entries(reviews && typeof reviews === "object" ? reviews : {})
    .filter(([, review]) => review && typeof review.dueAt === "string" && review.dueAt <= time)
    .sort((a, b) => a[1].dueAt.localeCompare(b[1].dueAt) || a[0].localeCompare(b[0]))
    .map(([code]) => code);
}

// ── v0.3: wrong task items come back on a different day ───────────────────

/**
 * Review state of an answer-keyed practice item. A wrong answer queues the
 * item for the next day; a correct answer on a later day grows the interval.
 * A first-time correct answer creates no entry, and a correct answer on the
 * same day as the last attempt (or with help) does not count as progress.
 */
export function noteItemResult(previous, correct, now = new Date(), { assisted = false } = {}) {
  const date = validDate(now);
  if (!correct) {
    return {
      repetitions: 0,
      intervalDays: 1,
      dueAt: startOfNextDay(date).toISOString(),
      lastReviewedAt: date.toISOString(),
      lapses: Math.min(10_000, (previous?.lapses ?? 0) + 1),
      successes: previous?.successes ?? 0,
    };
  }
  if (!previous) return undefined;
  if (assisted || localDateKey(previous.lastReviewedAt) === localDateKey(date)) return previous;
  const next = scheduleReview(previous, "good", date);
  const earliest = startOfNextDay(date).toISOString();
  return {
    ...next,
    dueAt: next.dueAt < earliest ? earliest : next.dueAt,
    lapses: previous.lapses ?? 0,
    successes: Math.min(10_000, (previous.successes ?? 0) + 1),
  };
}

/** Keys of any review map ({ dueAt }) that are due, earliest first. */
export function dueReviewKeys(reviews, now = new Date()) {
  return dueGrammarCodes(reviews, now);
}

// ── v0.3: external (ETS) practice results — recorded as given, never converted ──

export const EXAM_SOURCES = Object.freeze({
  "ets-digital-1": "ETS dijital örnek 1",
  "ets-digital-2": "ETS dijital örnek 2",
  "ets-pdf-1": "ETS Practice Test 1 (PDF)",
  "ets-pdf-2": "ETS Practice Test 2 (PDF)",
  testready: "TOEFL TestReady",
  other: "Başka kaynak",
});
export const EXAM_SECTIONS = Object.freeze({ reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking", overall: "Genel" });
export const EXAM_ATTEMPTS = Object.freeze({ first: "İlk çözüm", repeat: "Tekrar çözüm" });
export const EXAM_CONDITIONS = Object.freeze({ timed: "Süreli, kesintisiz", untimed: "Süresiz", assisted: "Yardımlı veya bölünmüş" });
export const EXAM_VALUE_TYPES = Object.freeze({ raw: "Ham doğru / toplam", estimate: "Kaynağın verdiği tahmin" });
const EXAM_LOG_LIMIT = 500;

/** Two results can be compared only under the same section, source, condition and first attempt. */
export function comparableExamEntry(entry, log) {
  if (!entry || entry.attempt !== "first") return null;
  const kind = (source) => (source.startsWith("ets-digital") ? "digital" : source.startsWith("ets-pdf") ? "pdf" : source);
  return (Array.isArray(log) ? log : [])
    .filter((other) => other.id !== entry.id && other.attempt === "first" && other.section === entry.section
      && other.valueType === entry.valueType && other.condition === entry.condition && kind(other.source) === kind(entry.source)
      && (other.date < entry.date || (other.date === entry.date && other.at < entry.at)))
    .sort((a, b) => b.date.localeCompare(a.date) || b.at.localeCompare(a.at))[0] ?? null;
}

// ── v0.2: weekly activity and the single recommended step ─────────────────

export const ACTIVITY_KINDS = Object.freeze(["reading", "listening", "writing", "speaking", "grammar", "vocab"]);
const ACTIVITY_LIMIT = 3_000;

export function todayKey(now = new Date()) {
  return localDateKey(now);
}

function serialKey(serial) {
  const date = new Date(serial * DAY_MS);
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

/** Adds one {d, k} entry per local day and kind (idempotent). */
export function logActivity(list, kind, now = new Date()) {
  const entries = Array.isArray(list) ? list : [];
  if (!ACTIVITY_KINDS.includes(kind)) return entries;
  const d = localDateKey(now);
  if (entries.some((entry) => entry.d === d && entry.k === kind)) return entries;
  return [...entries, { d, k: kind }].slice(-ACTIVITY_LIMIT);
}

/** Plan-week window (7 days from the study start date) containing `now`. */
export function weekWindow(startDate, now = new Date()) {
  const start = calendarSerial(startDate);
  const index = Math.max(0, Math.floor((calendarSerial(now) - start) / 7));
  return { week: Math.min(8, index + 1), from: serialKey(start + index * 7), to: serialKey(start + index * 7 + 7) };
}

export function weeklySummary(activity, startDate, now = new Date()) {
  const { from, to, week } = weekWindow(startDate, now);
  const today = localDateKey(now);
  const inWeek = (Array.isArray(activity) ? activity : []).filter((entry) => entry.d >= from && entry.d < to);
  const days = (kind) => new Set(inWeek.filter((entry) => entry.k === kind).map((entry) => entry.d)).size;
  return {
    week,
    from,
    to,
    speakingDays: days("speaking"),
    grammarDays: days("grammar"),
    vocabDays: days("vocab"),
    skills: Object.fromEntries(SKILLS.map((skill) => [skill, inWeek.some((entry) => entry.k === skill)])),
    today: new Set(inWeek.filter((entry) => entry.d === today).map((entry) => entry.k)),
  };
}

export const WEEKLY_SPEAKING_TARGET = 3;

/**
 * One recommended step (REQUIREMENTS "Bugün"): due reviews first, then the
 * grammar review, then the weekly speaking contact, then lessons tied to
 * recent mistakes, then the skill not touched this week.
 */
export function recommendNext(input = {}) {
  const { dueCards = 0, grammarDue = [], dueMistakes = 0, speakingDays = 0, spokeToday = false, mistakeLessons = [], skillTouched = {} } = input;
  if (dueCards > 0) return { kind: "review", count: dueCards };
  if (grammarDue.length > 0) return { kind: "grammar-review", codes: [...grammarDue] };
  if (dueMistakes > 0) return { kind: "mistakes", count: dueMistakes };
  if (speakingDays < WEEKLY_SPEAKING_TARGET && !spokeToday) return { kind: "speaking", remaining: WEEKLY_SPEAKING_TARGET - speakingDays };
  if (mistakeLessons.length > 0) return { kind: "lesson", code: mistakeLessons[0] };
  const untouched = SKILLS.find((skill) => !skillTouched[skill]);
  return { kind: "practice", skill: untouched ?? "all" };
}

const BACKUP_LIMITS = Object.freeze({
  attempts: 10_000,
  records: 10_000,
  itemIds: 200,
  answerKeys: 300,
  string: 50_000,
  id: 200,
  depth: 8,
  array: 500,
  objectKeys: 500,
});
const TARGET_BANDS = new Set(["", "3", "3.5", "4", "4.5", "5", "5.5", "6"]);
const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

function failBackup(message) {
  throw new TypeError(`Geçersiz yedek: ${message}`);
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function safeKey(key) {
  return key !== "__proto__" && key !== "prototype" && key !== "constructor";
}

function boundedString(value, label, max = BACKUP_LIMITS.string, allowEmpty = true) {
  if (typeof value !== "string") failBackup(`${label} metin olmalı`);
  if (!allowEmpty && value.length === 0) failBackup(`${label} boş olamaz`);
  if (value.length > max) failBackup(`${label} çok uzun`);
  return value;
}

function isoDate(value, label) {
  const text = boundedString(value, label, 50, false);
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(text);
  if (!match) failBackup(`${label} geçerli bir ISO tarihi değil`);
  const [, y, mo, d, h, mi, s, fraction = "0"] = match;
  const parts = [y, mo, d, h, mi, s].map(Number);
  const milliseconds = Number(fraction.padEnd(3, "0"));
  const timestamp = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], milliseconds);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== parts[0] ||
    parsed.getUTCMonth() !== parts[1] - 1 ||
    parsed.getUTCDate() !== parts[2] ||
    parsed.getUTCHours() !== parts[3] ||
    parsed.getUTCMinutes() !== parts[4] ||
    parsed.getUTCSeconds() !== parts[5] ||
    parsed.getUTCMilliseconds() !== milliseconds
  ) {
    failBackup(`${label} geçerli bir ISO tarihi değil`);
  }
  return new Date(timestamp).toISOString();
}

function dateKey(value, label) {
  const text = boundedString(value, label, 10, false);
  try {
    calendarSerial(text);
  } catch {
    failBackup(`${label} YYYY-MM-DD biçiminde değil`);
  }
  return text;
}

function cloneJson(value, label = "veri", depth = 0, seen = new Set()) {
  if (depth > BACKUP_LIMITS.depth) failBackup(`${label} fazla derin`);
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "string") return boundedString(value, label);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) failBackup(`${label} sonlu bir sayı olmalı`);
    return value;
  }
  if (typeof value !== "object") failBackup(`${label} yalnız JSON verisi içerebilir`);
  if (seen.has(value)) failBackup(`${label} döngüsel olamaz`);
  seen.add(value);

  let copy;
  if (Array.isArray(value)) {
    if (value.length > BACKUP_LIMITS.array) failBackup(`${label} dizisi çok büyük`);
    copy = value.map((entry, index) => cloneJson(entry, `${label}[${index}]`, depth + 1, seen));
  } else {
    if (!isPlainObject(value)) failBackup(`${label} düz bir nesne olmalı`);
    const keys = Object.keys(value);
    if (keys.length > BACKUP_LIMITS.objectKeys) failBackup(`${label} çok fazla alan içeriyor`);
    copy = Object.create(null);
    for (const key of keys) {
      if (!safeKey(key)) failBackup(`${label} güvenli olmayan bir alan içeriyor`);
      boundedString(key, `${label} alan adı`, BACKUP_LIMITS.id, false);
      copy[key] = cloneJson(value[key], `${label}.${key}`, depth + 1, seen);
    }
  }
  seen.delete(value);
  return copy;
}

function jsonByteLength(text) {
  return new TextEncoder().encode(text).byteLength;
}

function sanitizeResponse(value, label, { allowSparse = false } = {}) {
  if (typeof value === "string") return boundedString(value, label);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) failBackup(`${label} sonlu bir sayı olmalı`);
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > BACKUP_LIMITS.array) failBackup(`${label} dizisi çok büyük`);
    return Array.from({ length: value.length }, (_, index) => {
      const entry = value[index];
      if (allowSparse && (entry === null || entry === undefined)) return "";
      return boundedString(entry, `${label}[${index}]`);
    });
  }
  failBackup(`${label} metin, sayı veya metin dizisi olmalı`);
}

function sanitizeResult(value, label) {
  if (!isPlainObject(value)) failBackup(`${label} nesne olmalı`);
  for (const key of Object.keys(value)) {
    if (!["correct", "score"].includes(key)) failBackup(`${label}.${key} desteklenmiyor`);
  }
  const correct = value.correct == null ? null : value.correct;
  const score = value.score == null ? null : value.score;
  if (correct !== null && typeof correct !== "boolean") failBackup(`${label}.correct geçersiz`);
  if (score !== null && (!Number.isFinite(score) || score < 0 || score > 1)) {
    failBackup(`${label}.score geçersiz`);
  }
  return { correct, score };
}

function sanitizeDraft(value, key) {
  if (!isPlainObject(value)) failBackup(`drafts.${key} nesne olmalı`);
  const allowed = new Set([
    "response",
    "order",
    "checked",
    "result",
    "selfRating",
    "recordingId",
    "timerStartedAt",
    "timerSeconds",
    "showTranscript",
    "transcriptViewed",
    "modelViewed",
  ]);
  for (const field of Object.keys(value)) {
    if (!safeKey(field) || !allowed.has(field)) failBackup(`drafts.${key}.${field} desteklenmiyor`);
  }

  const clean = Object.create(null);
  if (Object.hasOwn(value, "response")) {
    clean.response = sanitizeResponse(value.response, `drafts.${key}.response`, { allowSparse: true });
  }
  if (Object.hasOwn(value, "order")) {
    if (!Array.isArray(value.order) || value.order.length > BACKUP_LIMITS.array) {
      failBackup(`drafts.${key}.order tamsayı dizisi olmalı`);
    }
    clean.order = value.order.map((entry, index) => {
      if (!Number.isInteger(entry) || entry < 0 || entry > 10_000) {
        failBackup(`drafts.${key}.order[${index}] geçersiz`);
      }
      return entry;
    });
    if (new Set(clean.order).size !== clean.order.length) failBackup(`drafts.${key}.order yinelenen değer içeriyor`);
  }
  for (const field of ["checked", "showTranscript", "transcriptViewed", "modelViewed"]) {
    if (Object.hasOwn(value, field)) {
      if (typeof value[field] !== "boolean") failBackup(`drafts.${key}.${field} boolean olmalı`);
      clean[field] = value[field];
    }
  }
  if (Object.hasOwn(value, "result")) clean.result = sanitizeResult(value.result, `drafts.${key}.result`);
  // Live state objects can contain an optional property with value `undefined`;
  // JSON export naturally omits it, so object validation must do the same.
  if (Object.hasOwn(value, "selfRating") && value.selfRating !== undefined) {
    if (!Number.isInteger(value.selfRating) || value.selfRating < 0 || value.selfRating > 3) {
      failBackup(`drafts.${key}.selfRating 0–3 arasında olmalı`);
    }
    clean.selfRating = value.selfRating;
  }
  if (Object.hasOwn(value, "recordingId")) {
    clean.recordingId = boundedString(value.recordingId, `drafts.${key}.recordingId`, BACKUP_LIMITS.id);
  }
  if (Object.hasOwn(value, "timerStartedAt")) {
    if (value.timerStartedAt !== null && (!Number.isFinite(value.timerStartedAt) || value.timerStartedAt < 0)) {
      failBackup(`drafts.${key}.timerStartedAt geçersiz`);
    }
    clean.timerStartedAt = value.timerStartedAt;
  }
  if (Object.hasOwn(value, "timerSeconds")) {
    if (!Number.isFinite(value.timerSeconds) || value.timerSeconds < 0 || value.timerSeconds > DAY_MS / 1_000) {
      failBackup(`drafts.${key}.timerSeconds geçersiz`);
    }
    clean.timerSeconds = value.timerSeconds;
  }
  return clean;
}

function sanitizeRecordMap(value, label, sanitizeValue) {
  if (!isPlainObject(value)) failBackup(`${label} nesne olmalı`);
  const entries = Object.entries(value);
  if (entries.length > BACKUP_LIMITS.records) failBackup(`${label} çok büyük`);
  const result = Object.create(null);
  for (const [key, entry] of entries) {
    if (!safeKey(key)) failBackup(`${label} güvenli olmayan bir anahtar içeriyor`);
    boundedString(key, `${label} anahtarı`, BACKUP_LIMITS.id, false);
    result[key] = sanitizeValue(entry, key);
  }
  return result;
}

function sanitizeSession(value) {
  if (value === null) return null;
  if (!isPlainObject(value)) failBackup("session nesne veya null olmalı");
  const itemIds = value.itemIds;
  if (!Array.isArray(itemIds) || itemIds.length > BACKUP_LIMITS.itemIds) {
    failBackup("session.itemIds geçerli bir dizi değil");
  }
  const cleanIds = itemIds.map((id, index) => boundedString(id, `session.itemIds[${index}]`, BACKUP_LIMITS.id, false));
  if (new Set(cleanIds).size !== cleanIds.length) failBackup("session.itemIds yinelenen değer içeriyor");
  if (!Number.isInteger(value.index) || value.index < 0 || value.index > cleanIds.length) {
    failBackup("session.index geçersiz");
  }
  if (!isPlainObject(value.answers) || Object.keys(value.answers).length > BACKUP_LIMITS.answerKeys) {
    failBackup("session.answers geçerli bir nesne değil");
  }
  const answers = Object.create(null);
  for (const [itemId, answer] of Object.entries(value.answers)) {
    if (!safeKey(itemId) || !cleanIds.includes(itemId)) failBackup(`session.answers.${itemId} oturumda bulunmuyor`);
    const cleanAnswer = sanitizeAttempt(answer, `session.answers.${itemId}`);
    if (cleanAnswer.itemId !== itemId) failBackup(`session.answers.${itemId}.itemId eşleşmiyor`);
    answers[itemId] = cleanAnswer;
  }
  return {
    id: boundedString(value.id, "session.id", BACKUP_LIMITS.id, false),
    itemIds: cleanIds,
    index: value.index,
    answers,
    createdAt: isoDate(value.createdAt, "session.createdAt"),
    options: cloneJson(isPlainObject(value.options) ? value.options : {}, "session.options"),
    completedAt: value.completedAt == null ? null : isoDate(value.completedAt, "session.completedAt"),
  };
}

function sanitizeReviewSession(value) {
  if (value == null) return null;
  if (!isPlainObject(value)) failBackup("reviewSession nesne veya null olmalı");
  if (!Array.isArray(value.itemIds) || value.itemIds.length > BACKUP_LIMITS.itemIds) {
    failBackup("reviewSession.itemIds geçerli bir dizi değil");
  }
  const itemIds = value.itemIds.map((id, index) =>
    boundedString(id, `reviewSession.itemIds[${index}]`, BACKUP_LIMITS.id, false));
  if (new Set(itemIds).size !== itemIds.length) failBackup("reviewSession.itemIds yinelenen değer içeriyor");
  if (!Number.isInteger(value.index) || value.index < 0 || value.index > itemIds.length) {
    failBackup("reviewSession.index geçersiz");
  }
  if (typeof value.revealed !== "boolean") failBackup("reviewSession.revealed boolean olmalı");
  return { itemIds, index: value.index, revealed: value.revealed };
}

function sanitizeAttempt(value, label) {
  if (!isPlainObject(value)) failBackup(`${label} nesne olmalı`);
  const skill = boundedString(value.skill, `${label}.skill`, 20, false);
  if (!SKILLS.includes(skill)) failBackup(`${label}.skill geçersiz`);
  const correct = value.correct == null ? null : value.correct;
  if (correct !== null && typeof correct !== "boolean") failBackup(`${label}.correct geçersiz`);
  const score = value.score == null ? null : value.score;
  if (score !== null && (!Number.isFinite(score) || score < 0 || score > 1)) {
    failBackup(`${label}.score geçersiz`);
  }

  const clean = {
    id: boundedString(value.id, `${label}.id`, BACKUP_LIMITS.id, false),
    itemId: boundedString(value.itemId, `${label}.itemId`, BACKUP_LIMITS.id, false),
    skill,
    correct,
    score,
    selfAssessed: value.selfAssessed === true,
    at: isoDate(value.at, `${label}.at`),
  };
  if (Object.hasOwn(value, "response")) clean.response = sanitizeResponse(value.response, `${label}.response`);
  if (Object.hasOwn(value, "taskType")) {
    clean.taskType = boundedString(value.taskType, `${label}.taskType`, 100, false);
  }
  if (Object.hasOwn(value, "level")) {
    const level = boundedString(value.level, `${label}.level`, 10, false);
    if (!LEVELS.has(level)) failBackup(`${label}.level geçersiz`);
    clean.level = level;
  }
  if (Object.hasOwn(value, "recordingId")) {
    clean.recordingId = boundedString(value.recordingId, `${label}.recordingId`, BACKUP_LIMITS.id);
  }
  if (Object.hasOwn(value, "assisted")) {
    if (typeof value.assisted !== "boolean") failBackup(`${label}.assisted boolean olmalı`);
    clean.assisted = value.assisted;
  } else {
    clean.assisted = false;
  }
  const hasSelfRating = Object.hasOwn(value, "selfRating") && value.selfRating !== undefined;
  if (clean.selfAssessed) {
    if (!hasSelfRating || !Number.isInteger(value.selfRating) || value.selfRating < 0 || value.selfRating > 3) {
      failBackup(`${label}.selfRating öz değerlendirmede 0–3 arasında olmalı`);
    }
    clean.selfRating = value.selfRating;
  } else if (hasSelfRating) {
    if (value.selfRating !== null) failBackup(`${label}.selfRating bağımsız görevde null olmalı`);
    clean.selfRating = null;
  }
  if (Object.hasOwn(value, "feedback")) {
    clean.feedback = boundedString(value.feedback, `${label}.feedback`, 2_000);
  }
  return clean;
}

function sanitizeReview(value, key) {
  if (!isPlainObject(value)) failBackup(`reviews.${key} nesne olmalı`);
  const repetitions = value.repetitions;
  const intervalDays = value.intervalDays;
  if (!Number.isInteger(repetitions) || repetitions < 0 || repetitions > 100_000) {
    failBackup(`reviews.${key}.repetitions geçersiz`);
  }
  if (!Number.isFinite(intervalDays) || intervalDays < 0 || intervalDays > 100_000) {
    failBackup(`reviews.${key}.intervalDays geçersiz`);
  }
  return {
    repetitions,
    intervalDays,
    dueAt: isoDate(value.dueAt, `reviews.${key}.dueAt`),
    lastReviewedAt: isoDate(value.lastReviewedAt, `reviews.${key}.lastReviewedAt`),
  };
}

// ── v0.2 backup fields (all optional; older backups restore with defaults) ──

const LESSON_CODE = /^G\d{1,2}\.\d{1,2}$/u;
const LESSON_RESULTS = new Set(["correct", "wrong", "self", "done"]);
const SPEAKING_KINDS = new Set(["repeat", "interview"]);
const SPEAKING_MODES = new Set(["learn", "rehearsal"]);
const SELF_DIMENSIONS = ["clarity", "task", "development"];
// Limits shared with the views: a field the interface lets you fill must never
// be larger than what the saved state accepts on the next launch.
export const SPEAKING_TEXT_LIMIT = 20_000;
export const LESSON_TEXT_LIMIT = 8_000;
export const MAX_PLAYS = 50;

function allowOnly(value, label, keys) {
  if (!isPlainObject(value)) failBackup(`${label} nesne olmalı`);
  for (const key of Object.keys(value)) {
    if (!safeKey(key) || !keys.includes(key)) failBackup(`${label}.${key} desteklenmiyor`);
  }
}

function boundedInt(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) failBackup(`${label} ${min}–${max} arasında tamsayı olmalı`);
  return value;
}

function optionalIso(value, label) {
  return value == null ? undefined : isoDate(value, label);
}

function idList(value, label, max = 50) {
  if (!Array.isArray(value) || value.length > max) failBackup(`${label} geçerli bir dizi değil`);
  return [...new Set(value.map((entry, index) => boundedString(entry, `${label}[${index}]`, BACKUP_LIMITS.id, false)))];
}

function lessonResponse(value, label) {
  if (Array.isArray(value)) {
    if (value.length > 60) failBackup(`${label} dizisi çok büyük`);
    return value.map((entry, index) => boundedInt(entry, `${label}[${index}]`, 0, 200));
  }
  if (typeof value === "number") return boundedInt(value, label, 0, 20);
  return boundedString(value, label, LESSON_TEXT_LIMIT);
}

function sanitizeLessonProgress(value, code) {
  if (!LESSON_CODE.test(code)) failBackup(`lessonProgress.${code} geçerli bir ders kodu değil`);
  const label = `lessonProgress.${code}`;
  allowOnly(value, label, ["layer", "screen", "answers", "results", "readAt", "completedAt", "updatedAt"]);
  const clean = { layer: value.layer === "summary" ? "summary" : "full", screen: boundedInt(value.screen ?? 0, `${label}.screen`, 0, 10) };
  if (value.layer !== undefined && !["summary", "full"].includes(value.layer)) failBackup(`${label}.layer geçersiz`);
  clean.answers = sanitizeRecordMap(value.answers ?? {}, `${label}.answers`, (entry, key) => lessonResponse(entry, `${label}.answers.${key}`));
  clean.results = sanitizeRecordMap(value.results ?? {}, `${label}.results`, (entry, key) => {
    if (!LESSON_RESULTS.has(entry)) failBackup(`${label}.results.${key} geçersiz`);
    return entry;
  });
  for (const field of ["readAt", "completedAt", "updatedAt"]) {
    const date = optionalIso(value[field], `${label}.${field}`);
    if (date) clean[field] = date;
  }
  return clean;
}

function sanitizeGrammarReview(value, code) {
  if (!LESSON_CODE.test(code)) failBackup(`grammarReviews.${code} geçerli bir ders kodu değil`);
  const label = `grammarReviews.${code}`;
  allowOnly(value, label, ["repetitions", "intervalDays", "dueAt", "lastReviewedAt", "missed", "seen", "successes"]);
  return {
    ...sanitizeReview({ repetitions: value.repetitions, intervalDays: value.intervalDays, dueAt: value.dueAt, lastReviewedAt: value.lastReviewedAt }, code),
    missed: idList(value.missed ?? [], `${label}.missed`),
    seen: idList(value.seen ?? [], `${label}.seen`),
    successes: boundedInt(value.successes ?? 0, `${label}.successes`, 0, 10_000),
  };
}

function sanitizeGrammarSession(value) {
  if (value == null) return null;
  allowOnly(value, "grammarSession", ["queue", "index", "answers", "results"]);
  const queue = idList(value.queue, "grammarSession.queue", 60);
  return {
    queue,
    index: boundedInt(value.index, "grammarSession.index", 0, queue.length),
    answers: sanitizeRecordMap(value.answers ?? {}, "grammarSession.answers", (entry, key) => lessonResponse(entry, `grammarSession.answers.${key}`)),
    results: sanitizeRecordMap(value.results ?? {}, "grammarSession.results", (entry, key) => {
      if (entry !== "correct" && entry !== "wrong") failBackup(`grammarSession.results.${key} geçersiz`);
      return entry;
    }),
  };
}

function sanitizeSelf(value, label) {
  allowOnly(value, label, SELF_DIMENSIONS);
  const clean = {};
  for (const key of SELF_DIMENSIONS) if (value[key] != null) clean[key] = boundedInt(value[key], `${label}.${key}`, 0, 3);
  return clean;
}

function sanitizeRunItem(value, key) {
  const label = `speakingRun.items.${key}`;
  allowOnly(value, label, ["recordingId", "dictation", "external", "revealed", "plays", "assisted", "done", "self"]);
  const clean = {};
  if (value.recordingId != null) clean.recordingId = boundedString(value.recordingId, `${label}.recordingId`, BACKUP_LIMITS.id);
  for (const field of ["dictation", "external"]) if (value[field] != null) clean[field] = boundedString(value[field], `${label}.${field}`, SPEAKING_TEXT_LIMIT);
  for (const field of ["revealed", "assisted", "done"]) {
    if (value[field] != null) {
      if (typeof value[field] !== "boolean") failBackup(`${label}.${field} boolean olmalı`);
      clean[field] = value[field];
    }
  }
  if (value.plays != null) clean.plays = boundedInt(value.plays, `${label}.plays`, 0, MAX_PLAYS);
  if (value.self != null) clean.self = sanitizeSelf(value.self, `${label}.self`);
  return clean;
}

function sanitizeSpeakingRun(value) {
  if (value == null) return null;
  allowOnly(value, "speakingRun", ["id", "setId", "kind", "mode", "index", "createdAt", "completedAt", "items"]);
  if (!SPEAKING_KINDS.has(value.kind)) failBackup("speakingRun.kind geçersiz");
  if (!SPEAKING_MODES.has(value.mode)) failBackup("speakingRun.mode geçersiz");
  return {
    id: boundedString(value.id, "speakingRun.id", BACKUP_LIMITS.id, false),
    setId: boundedString(value.setId, "speakingRun.setId", BACKUP_LIMITS.id, false),
    kind: value.kind,
    mode: value.mode,
    index: boundedInt(value.index, "speakingRun.index", 0, 20),
    createdAt: isoDate(value.createdAt, "speakingRun.createdAt"),
    completedAt: value.completedAt == null ? null : isoDate(value.completedAt, "speakingRun.completedAt"),
    items: sanitizeRecordMap(value.items ?? {}, "speakingRun.items", sanitizeRunItem),
  };
}

function sanitizeSpeakingEntry(value, index) {
  const label = `speakingLog[${index}]`;
  allowOnly(value, label, ["id", "runId", "setId", "itemId", "kind", "mode", "at", "recordingId", "dictation", "self", "assisted", "external"]);
  if (!SPEAKING_KINDS.has(value.kind)) failBackup(`${label}.kind geçersiz`);
  if (!SPEAKING_MODES.has(value.mode)) failBackup(`${label}.mode geçersiz`);
  const clean = {
    id: boundedString(value.id, `${label}.id`, BACKUP_LIMITS.id, false),
    runId: boundedString(value.runId, `${label}.runId`, BACKUP_LIMITS.id, false),
    setId: boundedString(value.setId, `${label}.setId`, BACKUP_LIMITS.id, false),
    itemId: boundedString(value.itemId, `${label}.itemId`, BACKUP_LIMITS.id, false),
    kind: value.kind,
    mode: value.mode,
    at: isoDate(value.at, `${label}.at`),
    assisted: value.assisted === true,
    external: value.external === true,
  };
  if (value.recordingId != null) clean.recordingId = boundedString(value.recordingId, `${label}.recordingId`, BACKUP_LIMITS.id);
  if (value.dictation != null) {
    allowOnly(value.dictation, `${label}.dictation`, ["matched", "total"]);
    const total = boundedInt(value.dictation.total, `${label}.dictation.total`, 0, 500);
    clean.dictation = { matched: boundedInt(value.dictation.matched, `${label}.dictation.matched`, 0, total), total };
  }
  if (value.self != null) clean.self = sanitizeSelf(value.self, `${label}.self`);
  return clean;
}

function sanitizeOptionalArray(value, label, limit, sanitize) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > limit) failBackup(`${label} geçerli bir dizi değil`);
  return value.map((entry, index) => sanitize(entry, index));
}

function sanitizeActivityEntry(value, index) {
  allowOnly(value, `activity[${index}]`, ["d", "k"]);
  if (!ACTIVITY_KINDS.includes(value.k)) failBackup(`activity[${index}].k geçersiz`);
  return { d: dateKey(value.d, `activity[${index}].d`), k: value.k };
}

function sanitizePronunciationEntry(value, key) {
  if (!/^P\d{1,2}$/u.test(key)) failBackup(`pronunciation.${key} geçersiz`);
  allowOnly(value, `pronunciation.${key}`, ["at", "selfRating"]);
  const clean = { at: isoDate(value.at, `pronunciation.${key}.at`) };
  if (value.selfRating != null) clean.selfRating = boundedInt(value.selfRating, `pronunciation.${key}.selfRating`, 0, 3);
  return clean;
}

function sanitizeScreening(value, key) {
  if (!/^\d{1,2}$/u.test(key)) failBackup(`screenings.${key} geçersiz`);
  allowOnly(value, `screenings.${key}`, ["at", "wrong", "total"]);
  const wrong = idList(value.wrong ?? [], `screenings.${key}.wrong`, 20);
  if (wrong.some((code) => !LESSON_CODE.test(code))) failBackup(`screenings.${key}.wrong geçersiz`);
  return { at: isoDate(value.at, `screenings.${key}.at`), wrong, total: boundedInt(value.total, `screenings.${key}.total`, 0, 20) };
}

function sanitizeItemReview(value, key) {
  const label = `itemReviews.${key}`;
  allowOnly(value, label, ["repetitions", "intervalDays", "dueAt", "lastReviewedAt", "lapses", "successes"]);
  return {
    ...sanitizeReview({ repetitions: value.repetitions, intervalDays: value.intervalDays, dueAt: value.dueAt, lastReviewedAt: value.lastReviewedAt }, key),
    lapses: boundedInt(value.lapses ?? 0, `${label}.lapses`, 0, 10_000),
    successes: boundedInt(value.successes ?? 0, `${label}.successes`, 0, 10_000),
  };
}

export const EXAM_TEXT_LIMITS = Object.freeze({ label: 80, value: 20, note: 500 });

function sanitizeExamEntry(value, index) {
  const label = `examLog[${index}]`;
  allowOnly(value, label, ["id", "at", "date", "source", "label", "section", "attempt", "condition", "valueType", "correct", "total", "value", "note"]);
  const pick = (field, options) => {
    if (!Object.hasOwn(options, value[field])) failBackup(`${label}.${field} geçersiz`);
    return value[field];
  };
  const clean = {
    id: boundedString(value.id, `${label}.id`, BACKUP_LIMITS.id, false),
    at: isoDate(value.at, `${label}.at`),
    date: dateKey(value.date, `${label}.date`),
    source: pick("source", EXAM_SOURCES),
    section: pick("section", EXAM_SECTIONS),
    attempt: pick("attempt", EXAM_ATTEMPTS),
    condition: pick("condition", EXAM_CONDITIONS),
    valueType: pick("valueType", EXAM_VALUE_TYPES),
  };
  if (clean.valueType === "raw") {
    clean.total = boundedInt(value.total, `${label}.total`, 1, 500);
    clean.correct = boundedInt(value.correct, `${label}.correct`, 0, clean.total);
  } else {
    clean.value = boundedString(value.value, `${label}.value`, EXAM_TEXT_LIMITS.value, false);
  }
  if (value.label != null && value.label !== "") clean.label = boundedString(value.label, `${label}.label`, EXAM_TEXT_LIMITS.label);
  if (value.note != null && value.note !== "") clean.note = boundedString(value.note, `${label}.note`, EXAM_TEXT_LIMITS.note);
  return clean;
}

/** Validates one new result typed into the form; throws a Turkish message for the first problem. */
export function createExamEntry(input, now = new Date()) {
  const date = validDate(now);
  const raw = input?.valueType === "raw";
  try {
    return sanitizeExamEntry({
      id: uniqueId("exam", date),
      at: date.toISOString(),
      date: input?.date,
      source: input?.source,
      section: input?.section,
      attempt: input?.attempt,
      condition: input?.condition,
      valueType: input?.valueType,
      ...(raw ? { correct: Number(input?.correct), total: Number(input?.total) } : { value: String(input?.value ?? "").trim() }),
      label: String(input?.label ?? "").trim(),
      note: String(input?.note ?? "").trim(),
    }, 0);
  } catch (error) {
    const text = String(error.message);
    if (/\.date/.test(text)) throw new TypeError("Geçerli bir tarih seç.");
    if (/\.(total|correct)/.test(text)) throw new TypeError("Doğru sayısı 0 ile toplam arasında, toplam en az 1 olmalı.");
    if (/\.value/.test(text)) throw new TypeError("Kaynağın verdiği değeri yaz (en çok 20 karakter).");
    throw new TypeError("Formdaki alanları kontrol et.");
  }
}

export function validateBackup(input) {
  let value = input;
  if (typeof input === "string") {
    if (jsonByteLength(input) > MAX_BACKUP_BYTES) failBackup("dosya çok büyük");
    try {
      value = JSON.parse(input);
    } catch {
      failBackup("JSON okunamadı");
    }
  } else {
    let serialized;
    try {
      serialized = JSON.stringify(input);
    } catch {
      failBackup("veri JSON biçimine dönüştürülemedi");
    }
    if (serialized === undefined || jsonByteLength(serialized) > MAX_BACKUP_BYTES) {
      failBackup("dosya çok büyük");
    }
  }
  if (!isPlainObject(value)) failBackup("kök değer nesne olmalı");
  for (const key of Object.keys(value)) {
    if (!safeKey(key)) failBackup("güvenli olmayan kök alanı");
  }
  if (value.schemaVersion !== 1) failBackup("desteklenmeyen schemaVersion");
  if (!isPlainObject(value.profile)) failBackup("profile nesne olmalı");
  if (!Array.isArray(value.attempts) || value.attempts.length > BACKUP_LIMITS.attempts) {
    failBackup("attempts geçerli bir dizi değil");
  }
  if (!Array.isArray(value.readLessons) || value.readLessons.length > BACKUP_LIMITS.records) {
    failBackup("readLessons geçerli bir dizi değil");
  }

  const profile = {
    examDate: dateKey(value.profile.examDate, "profile.examDate"),
    startDate: dateKey(value.profile.startDate, "profile.startDate"),
    targetBand: boundedString(value.profile.targetBand, "profile.targetBand", 30),
  };
  if (!TARGET_BANDS.has(profile.targetBand)) failBackup("profile.targetBand geçersiz");
  const readLessons = [...new Set(value.readLessons.map((id, index) =>
    boundedString(id, `readLessons[${index}]`, BACKUP_LIMITS.id, false),
  ))];

  return {
    schemaVersion: 1,
    profile,
    session: sanitizeSession(value.session),
    attempts: value.attempts.map((attempt, index) => sanitizeAttempt(attempt, `attempts[${index}]`)),
    reviews: sanitizeRecordMap(value.reviews, "reviews", sanitizeReview),
    drafts: sanitizeRecordMap(value.drafts, "drafts", sanitizeDraft),
    readLessons,
    reviewSession: sanitizeReviewSession(value.reviewSession),
    lessonProgress: sanitizeRecordMap(value.lessonProgress ?? {}, "lessonProgress", sanitizeLessonProgress),
    grammarReviews: sanitizeRecordMap(value.grammarReviews ?? {}, "grammarReviews", sanitizeGrammarReview),
    grammarSession: sanitizeGrammarSession(value.grammarSession),
    speakingRun: sanitizeSpeakingRun(value.speakingRun),
    speakingLog: sanitizeOptionalArray(value.speakingLog, "speakingLog", BACKUP_LIMITS.attempts, sanitizeSpeakingEntry),
    pronunciation: sanitizeRecordMap(value.pronunciation ?? {}, "pronunciation", sanitizePronunciationEntry),
    screenings: sanitizeRecordMap(value.screenings ?? {}, "screenings", sanitizeScreening),
    activity: sanitizeOptionalArray(value.activity, "activity", 3_000, sanitizeActivityEntry),
    itemReviews: sanitizeRecordMap(value.itemReviews ?? {}, "itemReviews", sanitizeItemReview),
    examLog: sanitizeOptionalArray(value.examLog, "examLog", EXAM_LOG_LIMIT, sanitizeExamEntry),
  };
}

// ── Tolerant restore ──────────────────────────────────────────────────────

const SALVAGE_LABELS = Object.freeze({
  profile: "hedef ayarı",
  session: "yarım çalışma seti",
  attempts: "çalışma kaydı",
  reviews: "kelime tekrarı",
  drafts: "taslak",
  reviewSession: "kelime tekrar oturumu",
  lessonProgress: "ders ilerlemesi",
  grammarReviews: "dil bilgisi tekrarı",
  grammarSession: "dil bilgisi tekrar oturumu",
  speakingRun: "konuşma provası adımı",
  speakingLog: "konuşma kaydı",
  pronunciation: "telaffuz kaydı",
  screenings: "tarama sonucu",
  activity: "etkinlik kaydı",
  itemReviews: "hata tekrarı",
  examLog: "deneme sonucu",
});

/**
 * Tolerant restore: keeps every part of a saved state that validates and
 * drops only the entries that do not, so one unexpected value can never
 * reset all progress. Kept parts pass the same sanitizers as validateBackup,
 * and the assembled state is validated once more before it is returned.
 * Returns { state, dropped: [{ field, label, count }] }.
 */
export function salvageBackup(input) {
  let value = input;
  if (typeof input === "string") {
    if (jsonByteLength(input) > MAX_BACKUP_BYTES) failBackup("dosya çok büyük");
    try {
      value = JSON.parse(input);
    } catch {
      failBackup("JSON okunamadı");
    }
  }
  if (!isPlainObject(value)) failBackup("kök değer nesne olmalı");
  if (value.schemaVersion !== 1) failBackup("desteklenmeyen schemaVersion");

  const base = createState();
  const counts = new Map();
  const drop = (field, count = 1) => counts.set(field, (counts.get(field) ?? 0) + count);
  const whole = (field, sanitize) => {
    try {
      return sanitize(value[field] ?? null);
    } catch {
      drop(field);
      return null;
    }
  };
  const records = (field, sanitize) => {
    const result = Object.create(null);
    const source = value[field];
    if (source == null) return result;
    if (!isPlainObject(source)) {
      drop(field);
      return result;
    }
    const entries = Object.entries(source);
    if (entries.length > BACKUP_LIMITS.records) drop(field, entries.length - BACKUP_LIMITS.records);
    for (const [key, entry] of entries.slice(0, BACKUP_LIMITS.records)) {
      try {
        if (!safeKey(key)) throw new TypeError("unsafe key");
        boundedString(key, field, BACKUP_LIMITS.id, false);
        result[key] = sanitize(entry, key);
      } catch {
        drop(field);
      }
    }
    return result;
  };
  const list = (field, sanitize, limit) => {
    const source = value[field];
    if (source == null) return [];
    if (!Array.isArray(source)) {
      drop(field);
      return [];
    }
    if (source.length > limit) drop(field, source.length - limit);
    const result = [];
    for (const [index, entry] of source.slice(-limit).entries()) {
      try {
        result.push(sanitize(entry, index));
      } catch {
        drop(field);
      }
    }
    return result;
  };

  const profile = { ...base.profile };
  const savedProfile = isPlainObject(value.profile) ? value.profile : {};
  const profileFields = {
    examDate: (entry) => dateKey(entry, "profile.examDate"),
    startDate: (entry) => dateKey(entry, "profile.startDate"),
    targetBand: (entry) => {
      const band = boundedString(entry, "profile.targetBand", 30);
      if (!TARGET_BANDS.has(band)) failBackup("profile.targetBand geçersiz");
      return band;
    },
  };
  for (const [key, sanitize] of Object.entries(profileFields)) {
    try {
      profile[key] = sanitize(savedProfile[key]);
    } catch {
      drop("profile");
    }
  }

  // A run keeps its valid steps; only the steps that do not validate are dropped.
  let speakingRun = null;
  try {
    speakingRun = sanitizeSpeakingRun(value.speakingRun);
  } catch {
    try {
      const items = Object.create(null);
      const savedItems = isPlainObject(value.speakingRun?.items) ? value.speakingRun.items : {};
      for (const [key, entry] of Object.entries(savedItems)) {
        try {
          if (!safeKey(key)) throw new TypeError("unsafe key");
          items[key] = sanitizeRunItem(entry, key);
        } catch {
          drop("speakingRun");
        }
      }
      speakingRun = sanitizeSpeakingRun({ ...value.speakingRun, items });
    } catch {
      speakingRun = null;
      drop("speakingRun");
    }
  }

  const readLessons = [...new Set((Array.isArray(value.readLessons) ? value.readLessons : [])
    .filter((id) => typeof id === "string" && id.length > 0 && id.length <= BACKUP_LIMITS.id))]
    .slice(0, BACKUP_LIMITS.records);

  const state = validateBackup({
    schemaVersion: 1,
    profile,
    session: whole("session", sanitizeSession),
    attempts: list("attempts", (entry, index) => sanitizeAttempt(entry, `attempts[${index}]`), BACKUP_LIMITS.attempts),
    reviews: records("reviews", sanitizeReview),
    drafts: records("drafts", sanitizeDraft),
    readLessons,
    reviewSession: whole("reviewSession", sanitizeReviewSession),
    lessonProgress: records("lessonProgress", sanitizeLessonProgress),
    grammarReviews: records("grammarReviews", sanitizeGrammarReview),
    grammarSession: whole("grammarSession", sanitizeGrammarSession),
    speakingRun,
    speakingLog: list("speakingLog", sanitizeSpeakingEntry, BACKUP_LIMITS.attempts),
    pronunciation: records("pronunciation", sanitizePronunciationEntry),
    screenings: records("screenings", sanitizeScreening),
    activity: list("activity", sanitizeActivityEntry, ACTIVITY_LIMIT),
    itemReviews: records("itemReviews", sanitizeItemReview),
    examLog: list("examLog", sanitizeExamEntry, EXAM_LOG_LIMIT),
  });
  const dropped = [...counts].map(([field, count]) => ({ field, label: SALVAGE_LABELS[field] ?? field, count }));
  return { state, dropped };
}

/** "taslak, çalışma kaydı ×2" — short Turkish list of what a tolerant restore left out. */
export function salvageSummary(dropped) {
  return (Array.isArray(dropped) ? dropped : [])
    .map((entry) => `${entry.label}${entry.count > 1 ? ` ×${entry.count}` : ""}`)
    .join(", ");
}
