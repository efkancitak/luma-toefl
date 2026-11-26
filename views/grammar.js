// Grammar map, two-layer lesson reader (Özet + Tam anlatım), module screening
// and the different-day review queue.

import { gradeLessonItem, noteLessonMistake, scheduleGrammarReview, dueGrammarCodes, LESSON_TEXT_LIMIT } from "../core.js";
import { LESSONS, LESSON_BY_CODE, MODULES, TASK_LABELS, FULL_SCREENS, LEGACY_TO_CODE, summaryBlocks, lessonChecks, screeningFor, GRAMMAR_META } from "../data/grammar.js";
import { e, icon, head, LEVELS, levelInRange } from "../ui.js";
import { PARTICLES } from "../data/phrasal.js";
import { DECK, POS_TR } from "../data/vocab.js";
import { IRREGULAR_VERBS, VERB_PATTERNS, verbPattern, formMatches } from "../data/irregular.js";
import { GRAMMAR_REFS, REF_BY_ID } from "../data/grammar-ref.js";

const RANK = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
const startLevel = (lesson) => String(lesson.level).split(/[–-]/u)[0].trim();
/** The grammar program: every lesson from A1 to C2 (by starting level, then by module order). The daily plan uses the same order. */
export const PROGRAM = Object.freeze([...LESSONS].sort((a, b) => (RANK[startLevel(a)] ?? 9) - (RANK[startLevel(b)] ?? 9)));
const lessonDoneIn = (ctx, code) => { const p = ctx.state.lessonProgress[code]; return Boolean(p?.readAt || p?.completedAt); };

function programSection(ctx) {
  const done = PROGRAM.filter((lesson) => lessonDoneIn(ctx, lesson.code)).length;
  const next = PROGRAM.find((lesson) => !lessonDoneIn(ctx, lesson.code));
  const pct = Math.round((done / PROGRAM.length) * 100);
  const stages = Object.keys(RANK).map((level) => {
    const lessons = PROGRAM.filter((lesson) => startLevel(lesson) === level);
    if (!lessons.length) return "";
    const stageDone = lessons.filter((lesson) => lessonDoneIn(ctx, lesson.code)).length;
    const current = next && startLevel(next) === level;
    return `<details class="stage ${current ? "current" : ""}" ${current ? "open" : ""}><summary><span class="stage-level">${level}</span><span class="stage-main"><span class="meter" aria-hidden="true"><i style="width:${Math.round((stageDone / lessons.length) * 100)}%"></i></span><small>${stageDone}/${lessons.length} ders</small></span></summary><div class="lesson-rows">${lessons.map((lesson) => lessonRow(ctx, lesson)).join("")}</div></details>`;
  }).join("");
  return `<section class="card program-card"><span class="eyebrow muted">GRAMER PROGRAMI · A1 → C2</span><h2>${done} / ${PROGRAM.length} ders tamam</h2><div class="meter big" aria-hidden="true"><i style="width:${pct}%"></i></div>${next ? `<a class="btn big wide" href="#lesson/${e(next.code)}">Sıradaki ders: ${e(next.code)} · ${e(next.title)} ${icon("arrow")}</a>` : '<p class="ok-text">Programın bütün dersleri tamam. Tekrarlar farklı günlerde gelmeye devam eder.</p>'}<p class="small muted">Her ders anlatım + alıştırmadır; yanlışlar farklı günde yeni cümleyle geri gelir. Antrenman her gün bu sıradan ders verir.</p><div class="stages">${stages}</div></section>
  <div class="section-title"><h2>Başvuru tabloları</h2><span class="small muted">kuralların hepsi bir bakışta</span></div>
  <div class="tool-grid">${GRAMMAR_REFS.map((ref) => `<a class="tool-tile" href="#ref/${e(ref.id)}">${icon("layers")}<strong>${e(ref.title)}</strong><small>${ref.rows.length} satır</small></a>`).join("")}</div>`;
}

export function refView(ctx, id) {
  const ref = REF_BY_ID.get(id);
  if (!ref) return `<div class="empty">Tablo bulunamadı. <a href="#library">Gramer'e dön</a></div>`;
  return `<a class="text-button" href="#library">${icon("back")} Gramer</a>${head(e(ref.title), e(ref.intro))}
  <section class="card"><div class="ref-table">${ref.rows.map((row) => `<div class="ref-row">${row.map((cell, i) => `<div class="ref-cell ${i === 0 ? "ref-key" : ""}"><small class="muted">${e(ref.head[i])}</small><span ${/[A-Za-z]/u.test(cell) && i !== 0 && !/[ğüşıöçİ]/u.test(cell) ? 'lang="en"' : ""}>${e(cell)}</span></div>`).join("")}</div>`).join("")}</div></section>
  <div class="section-title"><h3>Bu tabloyu öğreten dersler</h3></div><div class="lesson-rows card">${ref.lessons.map((code) => LESSON_BY_CODE.get(code)).filter(Boolean).map((lesson) => lessonRow(ctx, lesson)).join("")}</div>`;
}

/** Every deck expression built on one verb (get back, get over, get rid of …). */
export function verbFamily(verb) {
  const prefix = `${verb} `;
  return DECK.filter((card) => card.word.toLowerCase().startsWith(prefix));
}
export const FAMILY_VERBS = Object.freeze(["get", "take", "come", "go", "look", "put", "keep", "give", "make", "turn", "have", "do"]);

const STAGES = { recognition: "Tanıma", transformation: "Dönüştürme", production: "Üretim" };
const CTX_LABEL = { kampüs: "kampüs", akademik: "akademik", konuşma: "konuşma" };

const now = () => new Date();
const lp = (ctx, code) => ctx.state.lessonProgress[code];
function ensureProgress(ctx, code) {
  const existing = ctx.state.lessonProgress[code];
  if (existing) return existing;
  const created = { layer: LESSON_BY_CODE.get(code)?.full ? "full" : "summary", screen: 0, answers: {}, results: {}, updatedAt: now().toISOString() };
  ctx.state.lessonProgress[code] = created;
  return created;
}
const touch = (progress) => { progress.updatedAt = now().toISOString(); };
const sayButton = (text, label = "Dinle", rate) => `<button class="icon-button say" data-action="say" data-say="${e(text)}"${rate ? ` data-rate="${rate}"` : ""} aria-label="${e(label)}">${icon("sound")}</button>`;

export function legacyRedirect(id) {
  return LEGACY_TO_CODE[id] ?? null;
}

export function lessonStatus(ctx, lesson) {
  const progress = lp(ctx, lesson.code);
  const review = ctx.state.grammarReviews[lesson.code];
  const due = review && review.dueAt <= now().toISOString();
  const parts = [];
  if (progress?.completedAt) parts.push("✓ tamamlandı");
  else if (progress?.layer === "full" && progress.screen > 0) parts.push(`ekran ${progress.screen + 1}/${FULL_SCREENS.length}`);
  else if (progress?.readAt) parts.push("✓ Özet okundu");
  if (review?.successes) parts.push(`${review.successes} farklı günde doğru`);
  return { text: parts.join(" · "), due };
}

// ── Library ────────────────────────────────────────────────────────────────

function lessonMatches(ctx, lesson) {
  const { lessonQuery: query, lessonFilter: filter } = ctx.ui;
  if (filter === "priority" && !lesson.priority) return false;
  if (filter === "full" && !lesson.full) return false;
  if (LEVELS.includes(filter) && !levelInRange(lesson.level, filter)) return false;
  if (!query) return true;
  const haystack = `${lesson.code} ${lesson.title} ${lesson.mistakes.map((m) => `${m.wrong} ${m.right}`).join(" ")} ${summaryBlocks(lesson).map((b) => `${b.title} ${b.summary}`).join(" ")}`.toLocaleLowerCase("tr");
  return haystack.includes(query.toLocaleLowerCase("tr"));
}

function lessonRow(ctx, lesson) {
  const status = lessonStatus(ctx, lesson);
  return `<a class="lesson-row" href="#lesson/${e(lesson.code)}"><span class="code">${e(lesson.code)}</span><span class="lesson-row-main"><strong>${e(lesson.title)}</strong><small>${e(lesson.level)} · ${lesson.tasks.map((t) => e(t)).join(", ")}${status.text ? ` · ${e(status.text)}` : ""}</small></span><span class="lesson-row-tags">${lesson.priority ? `<span class="tag star" title="Öncelikli 20">${icon("star")}</span>` : ""}${status.due ? '<span class="tag due">tekrar</span>' : ""}${lesson.isNew ? '<span class="tag due">yeni</span>' : ""}<span class="tag ${lesson.full ? "full" : "plain"}">${lesson.full ? "Tam anlatım" : "Özet"}</span></span></a>`;
}

export function libraryResults(ctx) {
  const blocks = MODULES.map((module) => {
    const lessons = LESSONS.filter((lesson) => lesson.module === module.id && lessonMatches(ctx, lesson));
    if (!lessons.length) return "";
    const total = LESSONS.filter((lesson) => lesson.module === module.id).length;
    const screened = ctx.state.screenings[String(module.id)];
    const fullCount = LESSONS.filter((lesson) => lesson.module === module.id && lesson.full).length;
    const open = ctx.ui.lessonQuery || ctx.ui.lessonFilter !== "all" || ctx.ui.openModules.has(module.id);
    return `<details class="card module-block" data-module="${module.id}" ${open ? "open" : ""}><summary class="module-head"><div><span class="eyebrow muted">MODÜL ${module.id}</span><h2>${e(module.title)}</h2><small class="muted">${lessons.length === total ? `${total} ders` : `${lessons.length}/${total} ders`} · ${fullCount} Tam anlatım${screened ? ` · tarama ${new Date(screened.at).toLocaleDateString("tr-TR")}` : ""}</small></div><span class="module-toggle" aria-hidden="true">${icon("arrow")}</span></summary><div class="module-actions"><a class="btn small secondary" href="#screen/${module.id}">${icon("check")} Modül taraması · ${screeningFor(module.id).length} soru</a></div><div class="lesson-rows">${lessons.map((lesson) => lessonRow(ctx, lesson)).join("")}</div></details>`;
  }).join("");
  return blocks || '<div class="empty">Bu aramada ders bulunamadı. Başka bir kelime veya filtre dene.</div>';
}

export function libraryView(ctx) {
  const full = LESSONS.filter((lesson) => lesson.full).length;
  const due = dueGrammarCodes(ctx.state.grammarReviews);
  const program = programSection(ctx);
  const filters = [["all", "Tümü"], ["priority", "Öncelikli 20"], ["full", "Tam anlatım"], ...LEVELS.map((l) => [l, l])];
  return `${head("Dilin yapı taşları.", `${MODULES.length} modül · ${LESSONS.length} ders · isim öbeğinden koşul cümlelerine, Türkçe anlatım.`)}
  ${due.length ? `<div class="notice row between wrap"><span><strong>Dil bilgisi tekrarı:</strong> ${due.length} ders bugün yeni cümlelerle seni bekliyor.</span><button class="btn small" data-action="greview-start">Tekrara başla ${icon("arrow")}</button></div>` : ""}
  ${program}
  <div class="section-title"><h2>Konulara göre harita</h2><span class="small muted">${MODULES.length} modül</span></div>
  <section class="card grammar-intro"><div class="stats-strip left"><div><strong>${LESSONS.length}</strong><span>ders · A1'den C2'ye</span></div><div><strong>${full}</strong><span>Tam anlatım</span></div><div><strong>${LESSONS.reduce((sum, lesson) => sum + (lesson.full?.exercises.length ?? 0) + lesson.drills.length, 0)}</strong><span>alıştırma</span></div></div><p class="small muted">Her derste anlatım ve alıştırma var: <strong>Özet</strong> tek ekranlık anlatım + 5 alıştırma, <strong>Tam anlatım</strong> 5 kısa ekran + 7 alıştırma. Dersler kilitsiz; modül sırası öneridir. Yanlış cevapların farklı bir günde yeni cümlelerle yeniden sorulur. Dersi okumak veya bir kez doğru cevaplamak “öğrenildi” sayılmaz.</p></section>
  <div class="section-title"><h2>Fiil aileleri</h2><span class="small muted">get back, take over, come up with …</span></div>
  <div class="level-grid">${FAMILY_VERBS.map((verb) => [verb, verbFamily(verb).length]).filter(([, count]) => count).map(([verb, count]) => `<button class="level-tile topic-tile" data-action="study" data-scope="v:${verb}"><span class="topic-name" lang="en">${verb} …</span><span class="level-count"><strong>${count}</strong> ifade</span><small>${verb === "get" ? "G6.7'de bütün kullanımlar" : "kartlarla çalış"}</small></button>`).join("")}</div>
  <div class="tool-grid spaced"><a class="tool-tile" href="#lesson/G3.13">${icon("book")}<strong>Düzensiz fiiller (3 hâl)</strong><small>${IRREGULAR_VERBS.length} fiil, kalıplara göre</small></a><a class="tool-tile" href="#verbs">${icon("pen")}<strong>V2 · V3 alıştırması</strong><small>yaz, kontrol et, yanlışlar geri gelir</small></a><a class="tool-tile" href="#lesson/G11.3">${icon("check")}<strong>Sık karıştırılanlar</strong><small>affect/effect, its/it's, than/then …</small></a></div>
  <label class="search spaced">${icon("search")}<input id="grammar-search" type="search" aria-label="Dil bilgisi konusu ara" placeholder="Tamlama, conditional, passive, G7.3…" value="${e(ctx.ui.lessonQuery)}"></label>
  <div class="filter-row">${filters.map(([value, label]) => `<button class="chip ${ctx.ui.lessonFilter === value ? "active" : ""}" data-action="glib-filter" data-value="${value}" aria-pressed="${ctx.ui.lessonFilter === value}">${label}</button>`).join("")}</div>
  <div id="grammar-results" class="module-list">${libraryResults(ctx)}</div>
  <p class="small muted spaced">Düzeyler editoryaldir. “Sık hata” örnekleri Türkçe konuşanlarda yaygın görülen hatalardır; her kullanıcıda görüleceği varsayılmaz. İçerik özgündür ve dil uzmanı incelemesi beklemektedir (${e(GRAMMAR_META.reviewStatus)}).</p>`;
}

// ── Lesson: Özet ───────────────────────────────────────────────────────────

function summaryQuiz(ctx, block) {
  if (!block.quiz) return "";
  const state = ctx.ui.summaryQuiz[block.id] ?? {};
  const correct = state.answer === block.quiz.answer;
  return `<div class="ozet-quiz"><span class="eyebrow muted">KENDİNİ YOKLA</span><h3 class="spaced" lang="en">${e(block.quiz.question)}</h3><div class="quiz-options">${block.quiz.options.map((option, index) => `<button class="option ${state.answer === index ? "selected" : ""} ${state.checked && index === block.quiz.answer ? "correct" : ""} ${state.checked && state.answer === index && index !== block.quiz.answer ? "incorrect" : ""}" data-action="ozet-option" data-block="${e(block.id)}" data-value="${index}" ${state.checked ? "disabled" : ""}><span class="letter">${String.fromCharCode(65 + index)}</span><span lang="en">${e(option)}</span></button>`).join("")}</div>${state.checked ? `<div class="feedback ${correct ? "" : "incorrect"}"><strong>${correct ? "Doğru." : "Bu ayrıntıya yeniden bakalım."}</strong><p>${e(block.quiz.explanation)}</p></div>` : `<button class="btn small" data-action="ozet-check" data-block="${e(block.id)}" ${state.answer === undefined ? "disabled" : ""}>Kontrol et</button>`}</div>`;
}

function summaryLayer(ctx, lesson) {
  const blocks = summaryBlocks(lesson);
  const progress = lp(ctx, lesson.code);
  return `${blocks.map((block) => `<section class="card spaced"><span class="badge">${block.id === lesson.code ? "ÖZET" : `ÖZET · v0.1 dersi ${e(block.id)}`}</span><h2 class="spaced" ${block.id === lesson.code ? "" : 'lang="en"'}>${e(block.title)}</h2><p class="muted spaced">${e(block.summary)}</p><p class="explain spaced">${e(block.explanation)}</p><h3 class="spaced">Bağlamda gör</h3>${block.examples.map((example) => `<div class="example-box example-row"><div><p class="english" lang="en">${e(example.en)}</p><p>${e(example.tr)}</p></div>${sayButton(example.en, "Örneği dinle")}</div>`).join("")}<div class="notice warn"><strong>Sık yapılan hata</strong><br>${e(block.commonMistake)}</div><div class="notice"><strong>Sınavla bağlantısı</strong><br>${e(block.examUse)}</div>${summaryQuiz(ctx, block)}</section>`).join("")}
  ${tableSection(lesson)}
  ${lesson.family ? familySection(lesson.family) : ""}
  ${lesson.verbs ? verbsTable() : ""}
  ${drillSection(ctx, lesson, progress)}
  <section class="card spaced"><h3>Haritadaki sık hata</h3><ul class="mistake-list">${lesson.mistakes.map((m) => `<li><span class="wrong" lang="en">${e(m.wrong)}</span> → <span class="right" lang="en">${e(m.right)}</span></li>`).join("")}</ul><div class="row wrap spaced"><button class="btn ${progress?.readAt ? "secondary" : "soft"}" data-action="ozet-read" data-code="${e(lesson.code)}">${icon("check")} ${progress?.readAt ? "Özet okundu olarak kayıtlı" : "Özeti okudum"}</button>${lesson.full ? `<button class="btn" data-action="lesson-layer" data-code="${e(lesson.code)}" data-value="full">Tam anlatıma geç ${icon("arrow")}</button>` : ""}</div><p class="small muted spaced">Okundu işareti bir seviye ölçümü değildir.</p></section>`;
}

/** "Bütün kullanımlar" table of a lesson: shown in the Özet and on screen 2 of a Tam anlatım. */
function tableSection(lesson) {
  if (!lesson.table) return "";
  return `<section class="card spaced"><span class="eyebrow muted">BÜTÜN KULLANIMLAR</span>${lesson.table.map(([heading, rows]) => `<h3 class="spaced">${e(heading)}</h3><div class="pair-list">${rows.map(([en, tr]) => `<div class="pair-row compact"><span lang="en">${e(en)}</span><span class="muted">${e(tr)}</span>${sayButton(en.split(/ [·/] /u)[0].replace(/[+…]/gu, " "))}</div>`).join("")}</div>`).join("")}</section>`;
}

function familySection(verb) {
  const cards = verbFamily(verb);
  if (!cards.length) return "";
  return `<section class="card spaced"><span class="eyebrow muted">DESTEDEKİ “${e(verb.toUpperCase())} …” İFADELERİ · ${cards.length}</span><p class="small muted spaced">Hepsi kelime destesinde seviyelerin içinde de karşına çıkar; buradan hepsini birlikte çalışabilirsin.</p><div class="pair-list">${cards.map((card) => `<div class="pair-row compact"><span lang="en">${e(card.word)}</span><span class="muted">${e(card.meaning)}</span><span class="badge">${e(card.level)}</span></div>`).join("")}</div><button class="btn spaced" data-action="study" data-scope="v:${e(verb)}">“${e(verb)} …” kartlarını çalış ${icon("arrow")}</button></section>`;
}

function verbsTable() {
  return `<section class="card spaced"><div class="row between wrap"><span class="eyebrow muted">${IRREGULAR_VERBS.length} DÜZENSİZ FİİL · V1 · V2 · V3</span><a class="btn small" href="#verbs">V2/V3 alıştırması ${icon("arrow")}</a></div>${VERB_PATTERNS.map(([key, label, example]) => `<h3 class="spaced">${e(label)} <small class="muted" lang="en">· ${e(example)}</small></h3><div class="verb-list">${IRREGULAR_VERBS.filter((row) => verbPattern(row) === key).map(([v1, v2, v3, tr]) => `<div class="verb-row"><span lang="en"><strong>${e(v1)}</strong></span><span lang="en">${e(v2)}</span><span lang="en">${e(v3)}</span><small class="muted">${e(tr)}</small></div>`).join("")}</div>`).join("")}</section>`;
}

/** V2/V3 practice: ten verbs, type both forms, wrong ones come back at the end of the round. */
export function verbsView(ctx) {
  const quiz = ctx.ui.verbQuiz;
  const chips = `<div class="filter-row">${[["all", "Hepsi"], ...VERB_PATTERNS.map(([key, label]) => [key, label])].map(([key, label]) => `<button class="chip" data-action="vq-start" data-value="${key}">${e(label)}</button>`).join("")}</div>`;
  if (!quiz || quiz.index >= quiz.queue.length) {
    const done = quiz && quiz.queue.length;
    return `<a class="text-button" href="#lesson/G3.13">${icon("back")} G3.13 Düzensiz fiiller</a>${head("V2 · V3 alıştırması", "Fiilin geçmiş (V2) ve üçüncü hâlini (V3) yaz. Yanlış yaptıkların turun sonunda yeniden gelir.")}
    ${done ? `<section class="card summary-card">${icon("leaf")}<h2>Tur bitti.</h2><div class="stats-strip"><div><strong class="ok-text">${quiz.right}</strong><span>ilk denemede doğru</span></div><div><strong class="bad-text">${quiz.wrong}</strong><span>yanlış</span></div></div></section>` : ""}
    <section class="card spaced"><h3>${done ? "Yeni tur" : "Başla"}: hangi grup?</h3><p class="small muted">10 fiil · ${IRREGULAR_VERBS.length} fiil içinden rastgele.</p>${chips}</section>`;
  }
  const [v1, v2, v3, tr] = IRREGULAR_VERBS[quiz.queue[quiz.index]];
  const result = quiz.result;
  const field = (id, label, expected) => `<label class="field">${label}<input id="${id}" class="vq-input ${result ? (formMatches(expected, result[id]) ? "ok" : "no") : ""}" lang="en" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" value="${e(result?.[id] ?? "")}" ${result ? "readonly" : ""}></label>`;
  return `<div class="session-header"><a class="text-button" href="#lesson/G3.13">${icon("back")} G3.13</a><span class="small muted">${quiz.index + 1} / ${quiz.queue.length}</span></div><div class="progress-track"><span style="width:${Math.round((quiz.index / quiz.queue.length) * 100)}%"></span></div>
  <section class="card quiz-card"><span class="badge">${e(tr)}</span><h2 class="quiz-word" lang="en">${e(v1)}</h2>${sayButton(v1, "Fiili dinle")}</section>
  <section class="card spaced"><div class="form-grid">${field("vq-v2", "V2 · geçmiş", v2)}${field("vq-v3", "V3 · üçüncü hâl", v3)}</div>
  ${result ? `<div class="feedback ${result.ok ? "" : "incorrect"}"><strong>${result.ok ? "Doğru." : "Doğrusu:"}</strong><p lang="en">${e(v1)} – ${e(v2)} – ${e(v3)}</p><p class="small">${e(VERB_PATTERNS.find(([key]) => key === verbPattern([v1, v2, v3]))[1])}</p></div><button class="btn" data-action="vq-next">${quiz.index + 1 === quiz.queue.length ? "Turu bitir" : "Sonraki"} ${icon("arrow")}</button>${sayButton(`${v1}, ${v2.split("/")[0]}, ${v3.split("/")[0]}`, "Üç hâli dinle")}` : `<button class="btn spaced" data-action="vq-check">Kontrol et ${icon("check")}</button>`}</section>`;
}

function drillSection(ctx, lesson, progress) {
  if (!lesson.drills?.length) return "";
  const done = lesson.drills.filter((item) => progress?.results?.[item.id]).length;
  const right = lesson.drills.filter((item) => progress?.results?.[item.id] === "correct").length;
  return `<section class="card spaced drill-head"><span class="eyebrow muted">ALIŞTIRMA · ${done}/${lesson.drills.length}</span><p class="small spaced">Önce seç, sonra yaz, en sonda hatayı düzelt.${done ? ` İlk denemede ${right} doğru.` : ""} Yanlış yaptığın madde farklı bir günde tekrar kuyruğuna girer.</p></section>${lesson.drills.map((item, index) => exerciseCard(lesson.code, item, index, progress)).join("")}`;
}

// ── Lesson: Tam anlatım ────────────────────────────────────────────────────

function particleTable() {
  return `<section class="card spaced"><span class="eyebrow muted">PARÇACIKLARIN ÇAĞRIŞIMI</span><p class="small muted spaced">İpucudur, kesin çeviri kuralı değildir: her fiile her parçacık eklenmez. Birleşimi örnek cümlesiyle öğren.</p><div class="particle-list">${PARTICLES.map(([particle, hint, examples, caution]) => `<details class="particle"><summary><strong lang="en">${e(particle)}</strong><span>${e(hint)}</span></summary><p class="small" lang="en">${examples.map(e).join(" · ")}</p>${caution ? `<p class="small muted">${e(caution)}</p>` : ""}</details>`).join("")}</div></section>`;
}

function exerciseInput(code, item, response, answered) {
  const data = `data-code="${e(code)}" data-item="${e(item.id)}"`;
  if (item.type === "mcq") {
    return `<div class="quiz-options">${item.options.map((option, index) => `<button class="option ${response === index ? "selected" : ""} ${answered && index === item.answer ? "correct" : ""} ${answered && response === index && index !== item.answer ? "incorrect" : ""}" data-action="lx-option" ${data} data-value="${index}" ${answered ? "disabled" : ""}><span class="letter">${String.fromCharCode(65 + index)}</span><span lang="en">${e(option)}</span></button>`).join("")}</div>`;
  }
  if (item.type === "gap") {
    return `<input class="lx-input" ${data} lang="en" maxlength="300" value="${e(response ?? "")}" aria-label="Boşluğa gelecek ifade" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Cevabını yaz" ${answered ? "disabled" : ""}>`;
  }
  if (item.type === "rewrite") {
    return `<textarea class="lx-input" ${data} lang="en" rows="2" maxlength="${LESSON_TEXT_LIMIT}" aria-label="Yeniden yazılmış cümle" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="Rewrite the sentence…" ${answered ? "disabled" : ""}>${e(response ?? "")}</textarea>`;
  }
  if (item.type === "order") {
    const order = Array.isArray(response) ? response : [];
    return `<div class="token-row" aria-label="Oluşturduğun cümle">${order.length ? order.map((tokenIndex, position) => `<button class="token token-answer" lang="en" data-action="lx-remove" ${data} data-value="${position}" ${answered ? "disabled" : ""}>${e(item.tokens[tokenIndex])}</button>`).join("") : '<span class="muted small">Cümlen burada oluşacak…</span>'}</div><div class="token-row" aria-label="Kullanılabilir sözcükler">${item.tokens.map((token, index) => `<button class="token" lang="en" data-action="lx-add" ${data} data-value="${index}" ${answered || order.includes(index) ? "disabled" : ""}>${e(token)}</button>`).join("")}</div>`;
  }
  return `<textarea class="lx-input" ${data} lang="en" rows="4" maxlength="${LESSON_TEXT_LIMIT}" aria-label="Kendi cümlen" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Write your own sentences…" ${answered ? "readonly" : ""}>${e(response ?? "")}</textarea><ul class="checklist">${item.checklist.map((c) => `<li>${e(c)}</li>`).join("")}</ul><details><summary class="model-summary">Örnek cevabı göster</summary><div class="model" lang="en">${e(item.model)}</div>${sayButton(item.model, "Örnek cevabı dinle")}</details>`;
}

function exerciseFeedback(code, item, result) {
  if (!result) return "";
  if (item.type === "free") return '<div class="feedback"><strong>Öz kontrolün kaydedildi.</strong><p>Serbest üretim otomatik puanlanmaz. Örnek cevabı ve kontrol listesini kendi cümlenle karşılaştır.</p></div>';
  if (result === "correct") return `<div class="feedback"><strong>Doğru.</strong><p>${e(item.why)}</p></div>`;
  if (result === "self") return `<div class="feedback"><strong>Öz kontrolle doğru sayıldı.</strong><p>Beklenen: <span lang="en">${e(item.answer)}</span>. ${e(item.why)}</p></div>`;
  const answer = item.type === "mcq" ? item.options[item.answer] : item.answer;
  return `<div class="feedback incorrect"><strong>Bu ayrıntıya yeniden bakalım.</strong><p>Beklenen: <strong lang="en">${e(answer)}</strong></p><p>${e(item.why)}</p><p class="small">Bu ders yarın veya sonraki bir günde yeni cümlelerle yeniden sorulacak.</p>${item.type === "mcq" ? "" : `<button class="text-button" data-action="lx-self-accept" data-code="${e(code)}" data-item="${e(item.id)}">Cevabım da doğru, anlam aynı (öz kontrol)</button>`}</div>`;
}

function exerciseCard(code, item, index, progress) {
  const result = progress?.results?.[item.id];
  const response = progress?.answers?.[item.id];
  const badge = result === "correct" ? '<span class="tag full">doğru</span>' : result === "wrong" ? '<span class="tag due">tekrar kuyruğunda</span>' : result ? '<span class="tag plain">kaydedildi</span>' : "";
  const action = result
    ? ""
    : item.type === "free"
      ? `<div class="rating-row three">${[["0", "Yeniden yazmalıyım"], ["1", "Kısmen karşıladım"], ["2", "Listeyi karşıladım"]].map(([value, label]) => `<button class="rating" data-action="lx-free-done" data-code="${e(code)}" data-item="${e(item.id)}" data-value="${value}">${label}</button>`).join("")}</div>`
      : `<button class="btn small" data-action="lx-check" data-code="${e(code)}" data-item="${e(item.id)}">Kontrol et ${icon("check")}</button>`;
  return `<section class="card lx-item" id="lx-${e(item.id)}"><div class="row between"><span class="badge">${index + 1} · ${STAGES[item.stage]}</span>${badge}</div><p class="lx-prompt" lang="en">${e(item.prompt)}</p>${item.source ? `<div class="example-box english" lang="en">${e(item.source)}</div>` : ""}${exerciseInput(code, item, response, !!result)}<div class="inline-error" role="alert" id="lx-error-${e(item.id)}"></div>${action}${exerciseFeedback(code, item, result)}</section>`;
}

function fullScreen(ctx, lesson, screen) {
  const full = lesson.full;
  const progress = lp(ctx, lesson.code);
  if (screen === 0) {
    return `<section class="card"><span class="eyebrow muted">İŞLEV</span><p class="explain spaced">${e(full.function)}</p></section><section class="card spaced"><span class="eyebrow muted">YAPI</span><div class="table-wrap spaced"><table class="format-table struct-table"><thead><tr>${full.structure.head.map((h) => `<th>${e(h)}</th>`).join("")}</tr></thead><tbody>${full.structure.rows.map((row) => `<tr>${row.map((cell, i) => `<td data-label="${e(full.structure.head[i])}" ${i === row.length - 1 ? 'lang="en"' : ""}>${e(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  }
  if (screen === 1) {
    return `<section class="card"><span class="eyebrow muted">ANLAM VE KULLANIM</span><p class="explain spaced">${e(full.usage)}</p></section><section class="card spaced"><span class="eyebrow muted">KARŞILAŞTIRMA</span><h3 class="spaced">${e(full.contrast.title)}</h3><p class="spaced">${e(full.contrast.text)}</p><div class="pair-list spaced">${full.contrast.pairs.map(([left, right]) => `<div class="pair-row"><span lang="en">${e(left)}</span><span class="muted">${e(right)}</span>${sayButton(left)}</div>`).join("")}</div></section>${full.particles ? particleTable() : ""}${tableSection(lesson)}`;
  }
  if (screen === 2) {
    return `<section class="card"><span class="eyebrow muted">SIK HATALAR</span><div class="mistake-cards spaced">${full.mistakes.map(([wrong, right, why]) => `<div class="mistake-card"><p class="wrong" lang="en">✗ ${e(wrong)}</p><p class="right" lang="en">✓ ${e(right)}</p><p class="small">${e(why)}</p></div>`).join("")}</div><p class="small muted spaced">Bu hatalar Türkçe konuşanlarda sık görülür; her kullanıcıda görüleceği varsayılmaz.</p></section><section class="card spaced"><span class="eyebrow muted">ÖRNEKLER · DİNLE</span>${full.examples.map(([en, tr, context]) => `<div class="example-box example-row"><div><span class="tag plain">${e(CTX_LABEL[context] ?? context)}</span><p class="english" lang="en">${e(en)}</p><p>${e(tr)}</p></div>${sayButton(en, "Örneği dinle")}</div>`).join("")}</section>`;
  }
  if (screen === 3) {
    const done = full.exercises.filter((item) => progress?.results?.[item.id]).length;
    const firstRight = full.exercises.filter((item) => progress?.results?.[item.id] === "correct").length;
    return `<div class="notice">Sıra: tanıma → dönüştürme → üretim. ${done}/${full.exercises.length} madde tamamlandı${done ? ` · ${firstRight} madde ilk denemede doğru` : ""}. Yanlış maddeler farklı bir günde yeni cümlelerle tekrar sorulur.</div>${full.exercises.map((item, index) => exerciseCard(lesson.code, item, index, progress)).join("")}`;
  }
  return `<section class="card"><span class="eyebrow muted">SINAV BAĞLANTISI</span><p class="spaced">${e(full.exam)}</p><div class="row wrap spaced">${lesson.tasks.map((task) => `<span class="badge">${e(TASK_LABELS[task] ?? task)}</span>`).join("")}</div></section>
  <section class="card spaced"><span class="eyebrow muted">KONUŞMA KALIBI</span><h3 class="spaced" lang="en">${e(full.speaking.pattern)}</h3><div class="example-box example-row"><p class="english" lang="en">${e(full.speaking.model)}</p>${sayButton(full.speaking.model, "Kalıbı dinle")}</div><p class="small">${e(full.speaking.step)}</p><a class="text-button" href="#speaking">Konuşma provalarına git ${icon("arrow")}</a></section>${full.deck ? `<section class="card spaced"><span class="eyebrow muted">KELİME KARTLARI</span><p class="spaced">Bu dersin ifadeleri Kelimeler destesinde seviyelerin içinde de karşına çıkar. Hepsini birlikte çalışmak için:</p><button class="btn spaced" data-action="study" data-scope="${e(full.deck.scope)}">${e(full.deck.label)} ${icon("arrow")}</button></section>` : ""}
  <section class="card spaced"><span class="eyebrow muted">ÖZET</span><ul class="checklist spaced">${full.recap.map((line) => `<li>${e(line)}</li>`).join("")}</ul><div class="row wrap spaced"><button class="btn ${progress?.completedAt ? "secondary" : ""}" data-action="lesson-done" data-code="${e(lesson.code)}">${icon("check")} ${progress?.completedAt ? "Ders tamamlandı olarak kayıtlı" : "Dersi tamamladım"}</button></div><p class="small muted spaced">Tamamlandı işareti “öğrenildi” anlamına gelmez; tekrarlar farklı günlerde gelir.</p></section>`;
}

function fullLayer(ctx, lesson) {
  const progress = lp(ctx, lesson.code);
  const screen = Math.min(FULL_SCREENS.length - 1, progress?.layer === "full" ? progress.screen ?? 0 : 0);
  const dots = FULL_SCREENS.map((s, index) => `<button class="screen-dot ${index === screen ? "active" : ""} ${index < screen ? "seen" : ""}" data-action="lesson-screen" data-code="${e(lesson.code)}" data-value="${index}" aria-label="${index + 1}. ekran: ${e(s.label)}" ${index === screen ? 'aria-current="step"' : ""}><span>${index + 1}</span></button>`).join("");
  return `<div class="screen-nav spaced"><div class="screen-dots">${dots}</div><p class="small muted">${screen + 1}/${FULL_SCREENS.length} · ${e(FULL_SCREENS[screen].label)}</p></div>
  <div class="full-screen">${fullScreen(ctx, lesson, screen)}</div>
  <div class="lesson-pager">${screen > 0 ? `<button class="btn secondary" data-action="lesson-screen" data-code="${e(lesson.code)}" data-value="${screen - 1}">${icon("back")} Önceki</button>` : "<span></span>"}${screen < FULL_SCREENS.length - 1 ? `<button class="btn" data-action="lesson-screen" data-code="${e(lesson.code)}" data-value="${screen + 1}">Sonraki ekran ${icon("arrow")}</button>` : `<a class="btn secondary" href="#library">Haritaya dön</a>`}</div>
  <p class="small muted spaced">İlerlemen kaydedilir; ders ortasında bırakırsan aynı ekrandan devam edersin.</p>`;
}

export function lessonView(ctx, code) {
  const lesson = LESSON_BY_CODE.get(code);
  if (!lesson) return `<div class="empty">Ders bulunamadı. <a href="#library">Dil bilgisi haritasına dön</a></div>`;
  const progress = lp(ctx, code);
  const layer = lesson.full ? (progress?.layer ?? "full") : "summary";
  const module = MODULES.find((m) => m.id === lesson.module);
  return `<article class="lesson-body"><a class="text-button" href="#library">${icon("back")} Dil bilgisi haritası</a>
  <div class="row wrap spaced"><span class="badge">${e(lesson.code)} · ${e(lesson.level)}</span><span class="badge">Modül ${lesson.module} · ${e(module.title)}</span>${lesson.priority ? '<span class="badge">Öncelikli 20</span>' : ""}${lesson.addedInMapping ? '<span class="badge">v0.1 eşlemesinden eklendi</span>' : ""}</div>
  <div class="page-head spaced"><div><h1>${e(lesson.title)}</h1><p>Sınavda: ${lesson.tasks.map((task) => e(TASK_LABELS[task] ?? task)).join(" · ")}</p></div></div>
  ${lesson.full ? `<div class="layer-tabs" role="tablist"><button role="tab" class="layer-tab ${layer === "summary" ? "active" : ""}" aria-selected="${layer === "summary"}" data-action="lesson-layer" data-code="${e(code)}" data-value="summary">Özet</button><button role="tab" class="layer-tab ${layer === "full" ? "active" : ""}" aria-selected="${layer === "full"}" data-action="lesson-layer" data-code="${e(code)}" data-value="full">Tam anlatım</button></div>` : ""}
  ${layer === "full" && lesson.full ? fullLayer(ctx, lesson) : summaryLayer(ctx, lesson)}
  ${GRAMMAR_REFS.filter((ref) => ref.lessons.includes(code)).map((ref) => `<a class="lesson-chip" href="#ref/${e(ref.id)}">${icon("layers")} ${e(ref.title)}</a>`).join("")}
  ${ctx.dailyLessonNav ? ctx.dailyLessonNav(code) : ""}</article>`;
}

// ── Module screening ───────────────────────────────────────────────────────

export function screeningView(ctx, moduleId) {
  const module = MODULES.find((m) => m.id === Number(moduleId));
  if (!module) return '<div class="empty">Modül bulunamadı. <a href="#library">Haritaya dön</a></div>';
  const questions = screeningFor(module.id);
  const run = ctx.ui.screening?.module === module.id ? ctx.ui.screening : { module: module.id, answers: {}, done: false };
  ctx.ui.screening = run;
  const answeredAll = questions.every((q) => Number.isInteger(run.answers[q.id]));
  let result = "";
  if (run.done) {
    const wrongCodes = [...new Set(questions.filter((q) => run.answers[q.id] !== q.answer).map((q) => q.code))];
    result = `<section class="card spaced"><h2>Tarama sonucu</h2><p class="small muted spaced">Tarama seviye veya puan üretmez; yalnız seni ilgili derslere yönlendirir.</p>${wrongCodes.length ? `<p class="spaced">Şu derslere bakman faydalı olabilir:</p><div class="lesson-rows spaced">${wrongCodes.map((c) => lessonRow(ctx, LESSON_BY_CODE.get(c))).join("")}</div>` : '<p class="spaced">Bu taramada yönlendirilecek ders çıkmadı. Modülün Tam anlatımlı derslerinden dilediğini çalışabilirsin.</p>'}<a class="btn secondary spaced" href="#library">Haritaya dön</a></section>`;
  }
  return `<a class="text-button" href="#library">${icon("back")} Dil bilgisi haritası</a>${head(`Modül ${module.id} taraması`, `${e(module.title)} · ${questions.length} soru · isteğe bağlı`)}
  <div class="notice">Her soru bir derse bağlıdır. Yanlış cevaplar seni o derse yönlendirir; sonuç bir seviye veya puan değildir.</div>
  ${questions.map((q, index) => `<section class="card spaced"><span class="badge">${index + 1} · ${e(q.code)}</span><h3 class="spaced" lang="en">${e(q.question)}</h3><div class="quiz-options">${q.options.map((option, i) => `<button class="option ${run.answers[q.id] === i ? "selected" : ""} ${run.done && i === q.answer ? "correct" : ""} ${run.done && run.answers[q.id] === i && i !== q.answer ? "incorrect" : ""}" data-action="screen-option" data-q="${e(q.id)}" data-value="${i}" ${run.done ? "disabled" : ""}><span class="letter">${String.fromCharCode(65 + i)}</span><span lang="en">${e(option)}</span></button>`).join("")}</div>${run.done ? `<p class="small spaced">${e(q.explanation)}</p>` : ""}</section>`).join("")}
  ${run.done ? result : `<button class="btn spaced" data-action="screen-finish" data-module="${module.id}" ${answeredAll ? "" : "disabled"}>Yönlendirmeyi göster ${icon("arrow")}</button>`}`;
}

// ── Grammar review on a different day ──────────────────────────────────────

function reviewItem(id) {
  if (/-d\d+$/u.test(id)) {
    const lesson = LESSON_BY_CODE.get(id.replace(/-d\d+$/u, ""));
    const item = lesson?.drills?.find((d) => d.id === id);
    return item ? { lesson, item } : null;
  }
  const [code, rest] = id.includes("#") ? id.split("#") : [id.replace(/-r\d+$/, ""), null];
  const lesson = LESSON_BY_CODE.get(code);
  if (!lesson) return null;
  if (rest !== null) {
    const check = lessonChecks(lesson)[Number(rest.replace("c", ""))];
    return check ? { lesson, item: { id, type: "mcq", prompt: check.question, options: check.options, answer: check.answer, why: check.explanation } } : null;
  }
  const item = lesson.full?.review.find((r) => r.id === id);
  return item ? { lesson, item } : null;
}

export function buildReviewQueue(ctx) {
  return dueGrammarCodes(ctx.state.grammarReviews).map((code) => {
    const lesson = LESSON_BY_CODE.get(code);
    const review = ctx.state.grammarReviews[code];
    const pool = lesson?.full?.review.map((r) => r.id) ?? [...lessonChecks(lesson ?? { legacy: [], checks: [] }).map((_, i) => `${code}#c${i}`), ...(lesson?.drills ?? []).map((d) => d.id)];
    // A new sentence, not the very item that was missed.
    const fresh = pool.filter((id) => !review.seen.includes(id) && !(review.missed ?? []).includes(id));
    return (fresh.length ? fresh : pool)[0];
  }).filter(Boolean);
}

export function grammarReviewView(ctx) {
  const session = ctx.state.grammarSession;
  if (!session || session.index >= session.queue.length) {
    const reviewed = session?.queue.length ?? 0;
    return `<section class="summary-card card">${icon("leaf")}<h1>${reviewed ? "Tekrar tamamlandı." : "Bugün dil bilgisi tekrarı yok."}</h1><p class="muted">${reviewed ? `${reviewed} ders farklı bir günde yeni cümlelerle tekrar edildi. Doğru olanlar daha ileri bir tarihe, yanlışlar yarına planlandı.` : "Ders alıştırmalarında yanlış yaptığın maddeler ertesi günden itibaren burada yeni cümlelerle karşına çıkar."}</p><div class="spaced row wrap" style="justify-content:center"><a class="btn" href="#library">Dil bilgisi haritası</a><a class="btn secondary" href="#home">Bugün</a></div></section>`;
  }
  const id = session.queue[session.index];
  const found = reviewItem(id);
  if (!found) return '<div class="notice warn">Bu tekrar maddesi bulunamadı. <button class="text-button" data-action="gr-next">Sonrakine geç</button></div>';
  const { lesson, item } = found;
  const response = session.answers[id];
  const result = session.results[id];
  const input = item.type === "mcq"
    ? `<div class="quiz-options">${item.options.map((option, index) => `<button class="option ${response === index ? "selected" : ""} ${result && index === item.answer ? "correct" : ""} ${result && response === index && index !== item.answer ? "incorrect" : ""}" data-action="gr-option" data-value="${index}" ${result ? "disabled" : ""}><span class="letter">${String.fromCharCode(65 + index)}</span><span lang="en">${e(option)}</span></button>`).join("")}</div>`
    : `<input class="gr-input" lang="en" maxlength="300" value="${e(response ?? "")}" aria-label="Boşluğa gelecek ifade" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" ${result ? "disabled" : ""}>`;
  const answerText = item.type === "mcq" ? item.options[item.answer] : item.answer;
  return `<div class="session-header"><a class="text-button" href="#library">${icon("back")} Kaydet ve çık</a><span class="small muted">${session.index + 1} / ${session.queue.length}</span></div><div class="progress-track"><span style="width:${Math.round((session.index / session.queue.length) * 100)}%"></span></div>
  <section class="card spaced"><div class="row between wrap"><span class="badge">${e(lesson.code)} · ${e(lesson.title)}</span><span class="small muted">Farklı gün tekrarı · yeni cümle</span></div><h2 class="spaced" lang="en">${e(item.prompt)}</h2>${input}<div class="inline-error" role="alert" id="gr-error"></div>
  ${result ? `<div class="feedback ${result === "correct" ? "" : "incorrect"}"><strong>${result === "correct" ? "Doğru — bir sonraki tekrar daha ileri bir güne planlandı." : "Yarın yeniden sorulacak."}</strong><p>Beklenen: <strong lang="en">${e(answerText)}</strong></p><p>${e(item.why)}</p><a class="text-button" href="#lesson/${e(lesson.code)}">Dersi aç ${icon("arrow")}</a></div><button class="btn" data-action="gr-next">${session.index === session.queue.length - 1 ? "Tekrarı bitir" : "Sonraki"} ${icon("arrow")}</button>` : `<button class="btn" data-action="gr-check">Kontrol et ${icon("check")}</button>`}</section>`;
}

// ── Actions ────────────────────────────────────────────────────────────────

function findExercise(code, itemId) {
  const lesson = LESSON_BY_CODE.get(code);
  return lesson?.full?.exercises.find((item) => item.id === itemId) ?? lesson?.drills?.find((item) => item.id === itemId) ?? null;
}

export function handleGrammarAction(ctx, action, button) {
  const { code, item: itemId, value } = button.dataset;
  const state = ctx.state;
  switch (action) {
    case "vq-start": {
      const pool = IRREGULAR_VERBS.map((row, index) => [row, index]).filter(([row]) => value === "all" || verbPattern(row) === value).map(([, index]) => index);
      for (let i = pool.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      ctx.ui.verbQuiz = { queue: pool.slice(0, 10), index: 0, right: 0, wrong: 0, missed: [], result: null };
      ctx.go("verbs");
      ctx.render();
      return true;
    }
    case "vq-check": {
      const quiz = ctx.ui.verbQuiz;
      if (!quiz || quiz.result) return true;
      const [, v2, v3] = IRREGULAR_VERBS[quiz.queue[quiz.index]];
      const typed = { "vq-v2": document.getElementById("vq-v2")?.value ?? "", "vq-v3": document.getElementById("vq-v3")?.value ?? "" };
      const ok = formMatches(v2, typed["vq-v2"]) && formMatches(v3, typed["vq-v3"]);
      const verbIndex = quiz.queue[quiz.index];
      if (!quiz.missed.includes(verbIndex)) { if (ok) quiz.right += 1; else quiz.wrong += 1; }
      if (!ok && !quiz.missed.includes(verbIndex)) { quiz.missed.push(verbIndex); quiz.queue.push(verbIndex); }
      quiz.result = { ...typed, ok };
      ctx.activity("grammar");
      ctx.render();
      return true;
    }
    case "vq-next": {
      const quiz = ctx.ui.verbQuiz;
      if (!quiz) return true;
      quiz.index += 1;
      quiz.result = null;
      ctx.persist();
      ctx.render();
      document.getElementById("vq-v2")?.focus();
      return true;
    }
    case "glib-filter":
      ctx.ui.lessonFilter = value;
      ctx.render();
      return true;
    case "lesson-layer": {
      const lesson = LESSON_BY_CODE.get(code);
      if (value === "full" && !lesson?.full) return true;
      const progress = ensureProgress(ctx, code);
      progress.layer = value === "summary" ? "summary" : "full";
      touch(progress);
      ctx.persist();
      ctx.render();
      window.scrollTo(0, 0);
      return true;
    }
    case "lesson-screen": {
      const progress = ensureProgress(ctx, code);
      progress.layer = "full";
      progress.screen = Math.max(0, Math.min(FULL_SCREENS.length - 1, Number(value)));
      touch(progress);
      ctx.persist();
      ctx.render();
      window.scrollTo(0, 0);
      return true;
    }
    case "lesson-done": {
      const progress = ensureProgress(ctx, code);
      progress.completedAt ??= now().toISOString();
      touch(progress);
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      ctx.toast("Ders tamamlandı olarak kaydedildi. Tekrarlar farklı günlerde gelecek.");
      return true;
    }
    case "ozet-read": {
      const lesson = LESSON_BY_CODE.get(code);
      const progress = state.lessonProgress[code] ?? (state.lessonProgress[code] = { layer: "summary", screen: 0, answers: {}, results: {}, updatedAt: now().toISOString() });
      progress.readAt ??= now().toISOString();
      touch(progress);
      for (const id of lesson.legacy) if (!state.readLessons.includes(id)) state.readLessons.push(id);
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      ctx.toast("Özet okundu olarak kaydedildi; bu bir seviye ölçümü değildir.");
      return true;
    }
    case "ozet-option":
      ctx.ui.summaryQuiz[button.dataset.block] = { answer: Number(value), checked: false };
      ctx.render();
      return true;
    case "ozet-check":
      if (ctx.ui.summaryQuiz[button.dataset.block]) ctx.ui.summaryQuiz[button.dataset.block].checked = true;
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      return true;
    case "lx-option": {
      const progress = ensureProgress(ctx, code);
      if (progress.results[itemId]) return true;
      progress.answers[itemId] = Number(value);
      touch(progress);
      ctx.persist();
      ctx.render();
      return true;
    }
    case "lx-add":
    case "lx-remove": {
      const progress = ensureProgress(ctx, code);
      if (progress.results[itemId]) return true;
      const order = Array.isArray(progress.answers[itemId]) ? progress.answers[itemId] : [];
      if (action === "lx-add" && !order.includes(Number(value))) order.push(Number(value));
      if (action === "lx-remove") order.splice(Number(value), 1);
      progress.answers[itemId] = order;
      touch(progress);
      ctx.persist();
      ctx.render();
      return true;
    }
    case "lx-check": {
      const item = findExercise(code, itemId);
      const progress = ensureProgress(ctx, code);
      const result = gradeLessonItem(item, progress.answers[itemId]);
      if (result.empty || (item.type === "order" && (progress.answers[itemId]?.length ?? 0) !== item.tokens.length)) {
        const error = document.getElementById(`lx-error-${itemId}`);
        if (error) error.textContent = item.type === "order" ? "Bütün sözcükleri kullanarak cümleyi tamamla." : "Önce cevabını gir.";
        return true;
      }
      progress.results[itemId] = result.correct ? "correct" : "wrong";
      if (!result.correct) state.grammarReviews[code] = noteLessonMistake(state.grammarReviews[code], itemId);
      // An Özet lesson counts as done once all of its practice items are answered.
      const owner = LESSON_BY_CODE.get(code);
      if (!owner?.full && owner?.drills.length && owner.drills.every((d) => progress.results[d.id]) && !progress.readAt) {
        progress.readAt = now().toISOString();
        ctx.toast("Ders tamamlandı: anlatım ve alıştırmalar bitti.");
      }
      touch(progress);
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      document.getElementById(`lx-${itemId}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return true;
    }
    case "lx-self-accept": {
      const progress = ensureProgress(ctx, code);
      progress.results[itemId] = "self";
      const review = state.grammarReviews[code];
      if (review) {
        review.missed = review.missed.filter((id) => id !== itemId);
        if (!review.missed.length && !review.successes && review.repetitions === 0) delete state.grammarReviews[code];
      }
      touch(progress);
      ctx.persist();
      ctx.render();
      return true;
    }
    case "lx-free-done": {
      const progress = ensureProgress(ctx, code);
      if (!String(progress.answers[itemId] ?? "").trim()) {
        const error = document.getElementById(`lx-error-${itemId}`);
        if (error) error.textContent = "Önce kendi cümleni yaz; sonra kontrol listesine göre işaretle.";
        return true;
      }
      progress.results[itemId] = "done";
      touch(progress);
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      return true;
    }
    case "screen-option":
      if (ctx.ui.screening && !ctx.ui.screening.done) ctx.ui.screening.answers[button.dataset.q] = Number(value);
      ctx.render();
      return true;
    case "screen-finish": {
      const moduleId = Number(button.dataset.module);
      const questions = screeningFor(moduleId);
      const run = ctx.ui.screening;
      run.done = true;
      const wrong = [...new Set(questions.filter((q) => run.answers[q.id] !== q.answer).map((q) => q.code))];
      state.screenings[String(moduleId)] = { at: now().toISOString(), wrong, total: questions.length };
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      return true;
    }
    case "greview-start": {
      const queue = buildReviewQueue(ctx);
      if (!queue.length) { ctx.toast("Bugün tekrar zamanı gelen dil bilgisi dersi yok."); return true; }
      state.grammarSession = { queue, index: 0, answers: {}, results: {} };
      ctx.persist();
      ctx.go("greview");
      return true;
    }
    case "gr-option": {
      const session = state.grammarSession;
      const id = session?.queue[session.index];
      if (!id || session.results[id]) return true;
      session.answers[id] = Number(value);
      ctx.persist();
      ctx.render();
      return true;
    }
    case "gr-check": {
      const session = state.grammarSession;
      const id = session?.queue[session.index];
      const found = id && reviewItem(id);
      if (!found || session.results[id]) return true;
      const result = gradeLessonItem(found.item, session.answers[id]);
      if (result.empty) { const error = document.getElementById("gr-error"); if (error) error.textContent = "Önce cevabını gir."; return true; }
      session.results[id] = result.correct ? "correct" : "wrong";
      const code = found.lesson.code;
      const updated = scheduleGrammarReview(state.grammarReviews[code], result.correct);
      updated.seen = [...new Set([...(updated.seen ?? []), id])].slice(-50);
      state.grammarReviews[code] = updated;
      ctx.activity("grammar");
      ctx.persist();
      ctx.render();
      return true;
    }
    case "gr-next": {
      const session = state.grammarSession;
      if (session) session.index = Math.min(session.queue.length, session.index + 1);
      ctx.persist();
      ctx.render();
      window.scrollTo(0, 0);
      return true;
    }
    default:
      return false;
  }
}

export function handleGrammarToggle(ctx, element) {
  if (!element.classList?.contains("module-block")) return false;
  const id = Number(element.dataset.module);
  if (element.open) ctx.ui.openModules.add(id); else ctx.ui.openModules.delete(id);
  return true;
}

export function handleGrammarInput(ctx, element) {
  if (element.id === "grammar-search") {
    ctx.ui.lessonQuery = element.value;
    const results = document.getElementById("grammar-results");
    if (results) results.innerHTML = libraryResults(ctx);
    return true;
  }
  if (element.classList.contains("lx-input")) {
    const progress = ensureProgress(ctx, element.dataset.code);
    progress.answers[element.dataset.item] = element.value.slice(0, LESSON_TEXT_LIMIT);
    touch(progress);
    ctx.persistSoon();
    return true;
  }
  if (element.classList.contains("gr-input")) {
    const session = ctx.state.grammarSession;
    const id = session?.queue[session.index];
    if (id && !session.results[id]) { session.answers[id] = element.value.slice(0, LESSON_TEXT_LIMIT); ctx.persistSoon(); }
    return true;
  }
  return false;
}
