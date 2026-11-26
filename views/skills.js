// v0.8 skill tabs (Reading, Listening, Writing; extras for Speaking) and the
// writing / speaking toolkits. Each tab: how the section is scored, the full
// set, every task with its scoring guide, and the tools that belong to it.

import { e, icon, head, SKILLS } from "../ui.js";
import { exercises, TASK_TYPES, EXAM_SPEC } from "../data/content.js";
import { buildSet } from "../core.js";
import { SECTION_GUIDE, TASK_GUIDE, BANDS, SCORE_NOTE } from "../data/scoring.js";
import { WRITING_FRAMES, LINKERS, LINK_FUNCTIONS, SPEAKING_TOOLKIT, PRACTICE_TIPS } from "../data/toolkit.js";
import { DECK, TOPICS } from "../data/vocab.js";
import { PHRASES } from "../data/speaking.js";

const say = (text, label = "Dinle") => `<button class="icon-button" data-action="say" data-say="${e(text)}" aria-label="${e(label)}">${icon("sound")}</button>`;
const count = (filter) => DECK.filter(filter).length;
const lessonLink = (code, title) => `<a class="lesson-chip" href="#lesson/${e(code)}"><strong>${e(code)}</strong> ${e(title)}</a>`;

export function bandsList(kind) {
  const bands = BANDS[kind];
  if (!bands) return "";
  return `<ol class="band-list">${bands.map(([band, text]) => `<li><span class="band b${band}">${band}</span><span>${e(text)}</span></li>`).join("")}</ol><p class="small muted">${e(SCORE_NOTE)}</p>`;
}

/** The scoring guide of one task: what is measured, how it is scored, do / avoid, time. */
export function taskGuide(taskId, { open = false, title = "Nasıl puanlanır · ne yapmalı" } = {}) {
  const guide = TASK_GUIDE[taskId];
  if (!guide) return "";
  return `<details class="guide" ${open ? "open" : ""}><summary class="model-summary">${e(title)}</summary><div class="guide-body">
  <p class="small"><strong>Ölçülen:</strong> ${e(guide.measures)}</p><p class="small"><strong>Puanlama:</strong> ${e(guide.scoring)}</p>
  <ul class="do-list">${guide.do.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
  <ul class="avoid-list">${guide.avoid.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
  <p class="small"><strong>Süre:</strong> ${e(guide.time)}</p>
  ${BANDS[taskId] ? `<p class="small spaced"><strong>Puan bantları (0–5)</strong></p>${bandsList(taskId)}` : ""}
  ${guide.link ? `<a class="text-button" href="${e(guide.link[0])}">${e(guide.link[1])} ${icon("arrow")}</a>` : ""}</div></details>`;
}

function taskCard(ctx, task) {
  const info = buildSet(exercises, ctx.state.attempts, { skill: task.skill, taskType: task.id });
  const pct = info.total ? Math.round((info.solved / info.total) * 100) : 0;
  return `<section class="card task-card"><div class="row between wrap"><h3 lang="en">${e(task.label)}</h3><span class="small muted">${info.solved}/${info.total} çözüldü</span></div><p class="small">${e(task.description)}</p><div class="meter" aria-hidden="true"><i style="width:${pct}%"></i></div><div class="row wrap spaced"><button class="btn small" data-action="task" data-id="${e(task.id)}">${info.repeat ? "Tekrar çöz" : info.solved ? "Devam et" : "Başlat"} ${icon("arrow")}</button></div>${taskGuide(task.id)}</section>`;
}

function setHero(ctx, skill) {
  const info = buildSet(exercises, ctx.state.attempts, { skill });
  const session = ctx.state.session;
  const o = session?.options || {};
  const open = session && !session.completedAt && session.index < session.itemIds.length && !o.retry && !o.daily && (o.skill ?? "all") === skill && (o.taskType ?? "all") === "all";
  const pct = info.total ? Math.round((info.solved / info.total) * 100) : 0;
  return `<section class="card set-hero"><span class="eyebrow muted">${e(SKILLS[skill].name)} · bütün set</span><h2>${info.solved} / ${info.total} soru çözüldü</h2><div class="meter big" aria-hidden="true"><i style="width:${pct}%"></i></div><p class="small muted">${info.repeat ? "Bütün soruları çözdün; yeniden başlarsan tekrar çözüm olarak sayılır." : open ? `Kaldığın yer: ${session.index + 1}. soru.` : `Kolaydan zora; sırada ${info.items.length} çözülmemiş soru var.`}</p><button class="btn big wide" data-action="${open ? "resume" : "start-set"}" data-value="${e(skill)}">${open ? "Devam et" : info.repeat ? "Baştan tekrar çöz" : info.solved ? "Kaldığın yerden başla" : "Seti başlat"} ${icon("arrow")}</button></section>`;
}

function sectionGuide(skill) {
  const spec = EXAM_SPEC.sections.find((s) => s.skill === skill);
  const guide = SECTION_GUIDE[skill];
  return `<section class="card section-guide"><span class="eyebrow muted">SINAVDA · ${spec.items} madde · ~${spec.minutes} dk</span><p class="small spaced">${e(guide.scale)}</p><p class="small">${e(guide.focus)}</p></section>`;
}

function tools(skill) {
  if (skill === "reading") {
    const words = count((c) => !c.phrasal && !c.expr && !c.link);
    return `<div class="section-title"><h2>Okuma araçları</h2></div><div class="tool-grid">
    <a class="tool-tile" href="#cw-guide">${icon("book")}<strong>Complete the Words yöntemi</strong><small>5 adım, kısa kelime ve ek tabloları</small></a>
    <a class="tool-tile" href="#words/words">${icon("cards")}<strong>Akademik kelimeler</strong><small>${words} kelime · ${count((c) => c.awl)} AWL kartı</small></a>
    <button class="tool-tile" data-action="study" data-scope="t:awl">${icon("star")}<strong>Academic Word List</strong><small>sınav metinlerinin çekirdek kelimeleri</small></button>
    </div><div class="section-title"><h3>Konu desteleri</h3><span class="small muted">metinlerin konuları</span></div><div class="chip-row">${Object.entries(TOPICS).filter(([key]) => !["phrasal", "expr", "link"].includes(key)).map(([key, label]) => `<button class="chip" data-action="study" data-scope="t:${key}">${e(label)}</button>`).join("")}</div>
    <div class="row wrap spaced">${lessonLink("G2.15", "Kelime türetme: ön ve son ekler")}${lessonLink("G2.11", "Baş isim ve özne–fiil uyumu")}${lessonLink("G7.1", "Relative clauses")}</div>`;
  }
  if (skill === "listening") {
    return `<div class="section-title"><h2>Dinleme araçları</h2></div><section class="card"><h3>Not alma iskeleti</h3><ul class="checklist spaced"><li>Konuşma: sorun → öneri → karar → sonraki adım.</li><li>Duyuru: ne değişiyor · kim etkileniyor · ne yapmalı · ne zamana kadar.</li><li>Ders: konu → nokta 1 → örnek → nokta 2; yol işaretleri: First, Another, However, For example, So.</li><li>Choose a Response: önce işlevi bul (rica, öneri, şikâyet, davet), sonra ona uyan dolaylı cevabı seç.</li></ul></section>
    <div class="tool-grid spaced"><a class="tool-tile" href="#words/phrases">${icon("speech")}<strong>Konuşma ifadeleri</strong><small>${PHRASES.length} kalıp: rica, öneri, katılma …</small></a><button class="tool-tile" data-action="study" data-scope="t:phrasal">${icon("cards")}<strong>Öbek fiiller</strong><small>${count((c) => c.phrasal)} ifade · konuşmalarda çok geçer</small></button><a class="tool-tile" href="#settings">${icon("sound")}<strong>Ses ve hız</strong><small>daha doğal bir İngilizce ses seç</small></a></div>
    <div class="row wrap spaced">${lessonLink("G1.4", "Question tags")}${lessonLink("G1.7", "So do I / Neither do I")}${lessonLink("G9.4", "Yön edatları")}</div>`;
  }
  if (skill === "writing") {
    return `<div class="section-title"><h2>Yazma araçları</h2></div><div class="tool-grid">
    <a class="tool-tile" href="#toolkit/writing">${icon("pen")}<strong>Yazma araç kutusu</strong><small>e-posta ve tartışma kalıpları, bağlaçlar</small></a>
    <button class="tool-tile" data-action="study" data-scope="t:link">${icon("cards")}<strong>Bağlaç kartları</strong><small>${count((c) => c.link)} bağlaç: however, although, therefore …</small></button>
    <button class="tool-tile" data-action="study" data-scope="t:expr">${icon("layers")}<strong>Kalıp kartları</strong><small>${count((c) => c.expr)} kalıp: take into account, make progress …</small></button>
    <a class="tool-tile" href="#words/everyday">${icon("repeat")}<strong>Günlük alternatifler</strong><small>very good yerine excellent, I think yerine I'd say …</small></a>
    </div><div class="notice spaced"><strong>Yazma döngüsü:</strong> her e-posta ve tartışma yazısından sonra uygulama sırayla <em>Değerlendir → Hatalar → Geliştir → Tekrar</em> adımlarını açar. Gelişme, düzeltilmiş metni yeniden üretmekten gelir.</div>
    <div class="row wrap spaced">${lessonLink("G10.1", "Bağlaçlar ve söylem işaretleri")}${lessonLink("G10.3", "E-posta tonu")}${lessonLink("G1.5", "Kibar rica")}${lessonLink("G11.1", "Noktalama")}${lessonLink("G11.2", "Büyük harf ve yazım")}${lessonLink("G6.6", "make / do, say / tell")}</div>`;
  }
  return "";
}

export function skillTabView(ctx, skill) {
  const tasks = TASK_TYPES.filter((t) => t.skill === skill);
  const s = SKILLS[skill];
  return `${head(s.name, `${s.tr} · bütün görevler, puanlama ölçütleri ve araçlar`)}
  ${sectionGuide(skill)}${setHero(ctx, skill)}
  <div class="section-title"><h2>Görevler</h2><span class="small muted">${tasks.length} görev türü</span></div>
  ${tasks.map((task) => taskCard(ctx, task)).join("")}
  ${tools(skill)}`;
}

/** Shown above the speaking hub: scoring, toolkit and the decks that feed speaking. */
export function speakingExtras(ctx) {
  return `<section class="card section-guide"><span class="eyebrow muted">SINAVDA · ${EXAM_SPEC.sections.find((s) => s.skill === "speaking").items} madde · ~${EXAM_SPEC.sections.find((s) => s.skill === "speaking").minutes} dk</span><p class="small spaced">${e(SECTION_GUIDE.speaking.scale)}</p><p class="small">${e(SECTION_GUIDE.speaking.focus)}</p>${taskGuide("listen-repeat", { title: "Listen and Repeat · puanlama ve taktik" })}${taskGuide("interview", { title: "Take an Interview · puanlama ve taktik" })}</section>
  <div class="tool-grid spaced">
  <a class="tool-tile" href="#toolkit/speaking">${icon("mic")}<strong>Konuşma araç kutusu</strong><small>başlarken, zaman kazanma, araya sıkıştır, koşul kalıpları</small></a>
  <button class="tool-tile" data-action="study" data-scope="t:phrasal">${icon("cards")}<strong>Öbek fiiller</strong><small>${count((c) => c.phrasal)} ifade</small></button>
  <button class="tool-tile" data-action="study" data-scope="t:expr">${icon("layers")}<strong>Kalıplar</strong><small>${count((c) => c.expr)}: feel like, take a break …</small></button>
  <a class="tool-tile" href="#words/phrases">${icon("speech")}<strong>Konuşma ifadeleri</strong><small>${PHRASES.length} kalıp, seviyeye göre</small></a>
  <a class="tool-tile" href="#words/everyday">${icon("repeat")}<strong>Günlük alternatifler</strong><small>I want yerine I'd like, I feel like …</small></a>
  </div>
  <div class="row wrap spaced">${lessonLink("G4.6", "would'un bütün kullanımları")}${lessonLink("G3.11", "used to / be used to")}${lessonLink("G5.2", "Second conditional")}${lessonLink("G6.7", "get'in kullanımları")}</div>`;
}

function framesBlock(kind) {
  const frame = WRITING_FRAMES[kind];
  return `<section class="card spaced"><h2>${e(frame.title)}</h2><ol class="frame-steps">${frame.steps.map(([label, lines, tip]) => `<li><strong>${e(label)}</strong><div class="frame-lines">${lines.map((line) => `<span lang="en">${e(line)}</span>`).join("")}</div><small class="muted">${e(tip)}</small></li>`).join("")}</ol></section>`;
}

export function framesCompact(kind) {
  const frame = WRITING_FRAMES[kind];
  if (!frame) return "";
  return `<details class="frames"><summary class="model-summary">Kalıplar · yazarken bak</summary><ol class="frame-steps compact">${frame.steps.map(([label, lines]) => `<li><strong>${e(label)}</strong> <span lang="en">${lines.map(e).join(" · ")}</span></li>`).join("")}</ol></details>`;
}

export function toolkitView(ctx, kind) {
  if (kind === "speaking") {
    return `${head("Konuşma araç kutusu", "Nasıl başlanır, nasıl zaman kazanılır, araya ne sıkıştırılır, nasıl toparlanır.")}
    <section class="card"><h2>Pratikte ne yapmalı?</h2><ul class="tip-list spaced">${PRACTICE_TIPS.map(([title, text]) => `<li><strong>${e(title)}</strong><span>${e(text)}</span></li>`).join("")}</ul></section>
    ${SPEAKING_TOOLKIT.map((group) => `<section class="card spaced"><h2>${e(group.title)}</h2><p class="small muted">${e(group.tip)}</p><div class="pair-list spaced">${group.items.map(([en, tr]) => `<div class="pair-row compact"><span lang="en">${e(en)}</span><span class="muted">${e(tr)}</span>${say(en)}</div>`).join("")}</div></section>`).join("")}
    <div class="row wrap spaced"><a class="btn" href="#words/everyday">Günlük alternatifler ${icon("arrow")}</a><button class="btn secondary" data-action="study" data-scope="t:expr">Kalıp kartları</button><a class="btn secondary" href="#words/phrases">Konuşma ifadeleri</a><a class="btn secondary" href="#speaking">Provalara git</a></div>
    <div class="row wrap spaced">${lessonLink("G4.6", "would")}${lessonLink("G5.1", "Zero/first conditional")}${lessonLink("G5.2", "Second conditional")}${lessonLink("G5.3", "Third conditional")}${lessonLink("G3.11", "used to")}</div>`;
  }
  const groups = Object.entries(LINK_FUNCTIONS).map(([func, label]) => [label, LINKERS.filter((row) => row[1] === func)]).filter(([, rows]) => rows.length);
  return `${head("Yazma araç kutusu", "E-posta ve tartışma için adım adım kalıplar ve işlevine göre bağlaçlar.")}
  ${framesBlock("email")}${framesBlock("discussion")}
  <section class="card spaced"><h2>Puanlama ölçütleri</h2><p class="small spaced">Rubrik dört şeye bakar: <strong>görevi karşılamak</strong> (soruya cevap, her madde), <strong>gelişim</strong> (gerekçe, örnek, ayrıntı), <strong>dilin çeşitliliği</strong> (farklı yapılar ve kelimeler) ve <strong>doğruluk</strong> (az hata). E-postada buna <strong>sosyal kurallar</strong> eklenir: nezaket, uygun ton, selamlama ve kapanış.</p><details class="guide"><summary class="model-summary">Write an Email · puan bantları</summary>${bandsList("email")}</details><details class="guide"><summary class="model-summary">Academic Discussion · puan bantları</summary>${bandsList("discussion")}</details></section>
  <div class="section-title"><h2>Bağlaçlar · işlevine göre</h2><button class="btn small" data-action="study" data-scope="t:link">Kartlarla çalış ${icon("arrow")}</button></div>
  ${groups.map(([label, rows]) => `<section class="card spaced"><h3>${e(label)}</h3><div class="linker-list">${rows.map(([linker, , tr, pattern, example, exampleTr, note]) => `<div class="linker"><div class="row between"><strong lang="en">${e(linker)}</strong><span class="muted small">${e(tr)}</span></div><code lang="en">${e(pattern)}</code><p class="small" lang="en">${e(example)} ${say(example)}</p><p class="small muted">${e(exampleTr)}</p>${note ? `<p class="small note">${e(note)}</p>` : ""}</div>`).join("")}</div></section>`).join("")}`;
}
