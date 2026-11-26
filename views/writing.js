// v0.8 writing loop for Write an Email and Academic Discussion:
// write (timer) → 1 Değerlendir → 2 Hatalar → 3 Geliştir → 4 Tekrar → own rating.

import { analyzeWriting, repeatTemplate, wordDiff, countWords } from "../writing.js";
import { compareDictation } from "../core.js";
import { e, icon } from "../ui.js";
import { DECK } from "../data/vocab.js";
import { bandsList, framesCompact } from "./skills.js";

const ACADEMIC = [...new Set(DECK.filter((card) => !card.word.includes(" ") && ["B2", "C1", "C2"].includes(card.level)).map((card) => card.word.toLowerCase()))];
const STATUS = { ok: ["✓", "Karşılandı"], warn: ["!", "Geliştir"], miss: ["✗", "Eksik"] };

export const isWritingLoop = (item) => item?.type === "writing" && ["email", "discussion"].includes(item.taskType);
export const writingTarget = (item) => (item.taskType === "email" ? 80 : 100);

export function analysisFor(item, d) {
  return analyzeWriting(String(d.response ?? ""), { kind: item.taskType, target: writingTarget(item), academic: ACADEMIC });
}

function diffView(original, improved) {
  const { left, right } = wordDiff(original, improved);
  const render = (tokens) => tokens.map(({ t, type }) => (t === "\n" ? "<br>" : type === "same" ? e(t) : `<mark class="d-${type}">${e(t)}</mark>`)).join(" ").replace(/ <br> /gu, "<br>");
  return `<div class="side-by-side"><div><span class="eyebrow muted">İLK METNİN</span><p class="diff-text" lang="en">${render(left)}</p></div><div><span class="eyebrow muted">GELİŞTİRİLMİŞ</span><p class="diff-text" lang="en">${render(right)}</p></div></div><p class="small muted">Yeşil: eklenen veya değişen. Kırmızı: çıkarılan.</p>`;
}

function repeatResult(target, typed) {
  if (!String(typed ?? "").trim()) return '<p class="small muted">Boş bıraktın. Doğrusu: <span lang="en">' + e(target) + "</span></p>";
  const result = compareDictation(target, typed);
  const parts = result.ops.map((op) => {
    if (op.type === "match") return `<span class="w w-match">${e(op.expected)}</span>`;
    if (op.type === "missing") return `<span class="w w-missing" title="Eksik">${e(op.expected)}</span>`;
    if (op.type === "extra") return `<span class="w w-extra" title="Fazla">+${e(op.heard)}</span>`;
    return `<span class="w w-changed"><s>${e(op.expected)}</s> ${e(op.heard)}</span>`;
  });
  return `<div class="diff-box"><p class="diff-score"><strong>${result.matched}/${result.total}</strong> kelime aynı</p><p class="diff-words" lang="en">${parts.join(" ")}</p></div>`;
}

function issueRow(issue) {
  return issue.right
    ? `<div class="fix"><p lang="en"><s class="wrong">${e(issue.wrong)}</s> → <strong class="right">${e(issue.right)}</strong></p><small>${e(issue.why)}</small></div>`
    : `<div class="fix warn"><p lang="en">${e(issue.wrong)}</p><small>${e(issue.why)}</small></div>`;
}

/** The answer area of a writing item in a session. */
export function writingTask(ctx, item, answered, d) {
  const kind = item.taskType;
  const stage = answered || d.stage === "review" ? "review" : "write";
  if (stage === "write") {
    return `${framesCompact(kind)}<label class="field">İngilizce yanıtın<textarea id="writing-response" lang="en" maxlength="12000" spellcheck="false" autocomplete="off" autocapitalize="sentences" placeholder="${kind === "email" ? "Dear …," : "In my opinion, …"}">${e(d.response || "")}</textarea></label><div class="row between draft-note"><span id="draft-status">Taslak bu cihazda otomatik kaydedilir.</span><span id="word-count">${countWords(d.response)} kelime · hedef ${writingTarget(item)}+</span></div>`;
  }
  const report = analysisFor(item, d);
  const improved = typeof d.improved === "string" && d.improved.trim() ? d.improved : report.fixed;
  const reqs = new Set(d.reqs ?? []);
  const issues = report.issues;
  const warnings = report.warnings;
  const missing = report.criteria.flatMap((c) => c.notes.filter((n) => n.startsWith("Eksik:")));
  const template = repeatTemplate(improved);
  const typed = Array.isArray(d.repeat) ? d.repeat : [];
  const blanks = template.filter((part) => part.type === "blank");
  return `<div class="w-original"><span class="eyebrow muted">METNİN · ${report.words} kelime</span><div class="model" lang="en">${e(d.response || "")}</div>${answered ? "" : '<button class="text-button" data-action="w-edit">Metnime dön ve düzelt</button>'}</div>
  <section class="card w-block"><div class="w-head"><span class="w-num">1</span><div><h3>Değerlendir</h3><small class="muted">TOEFL yazma ölçütlerine göre · resmî puan değildir</small></div></div>
  <div class="criteria-grid">${report.criteria.map((c) => `<div class="criterion ${c.status}"><div class="row between"><strong>${e(c.label)}</strong><span class="status-pill ${c.status}" title="${STATUS[c.status][1]}">${STATUS[c.status][0]} ${STATUS[c.status][1]}</span></div><small class="muted">${e(c.sub)}</small><ul>${c.notes.map((n) => `<li>${e(n)}</li>`).join("")}</ul></div>`).join("")}</div>
  <h4 class="spaced">Görevin maddeleri · karşıladıklarını işaretle</h4><div class="req-list">${item.checklist.map((line, i) => `<button class="req ${reqs.has(i) ? "on" : ""}" data-action="w-req" data-value="${i}" aria-pressed="${reqs.has(i)}">${icon(reqs.has(i) ? "check" : "close")}<span>${e(line)}</span></button>`).join("")}</div>
  ${reqs.size < item.checklist.length ? `<p class="small muted">${item.checklist.length - reqs.size} madde işaretsiz. Eksik madde rubrikte en pahalı hatadır; Geliştir adımında ekle.</p>` : '<p class="small ok-text">Bütün maddeler karşılandı.</p>'}
  <details class="guide"><summary class="model-summary">Puan bantları (0–5)</summary>${bandsList(kind)}</details></section>
  <section class="card w-block"><div class="w-head"><span class="w-num">2</span><div><h3>Hatalar</h3><small class="muted">kırmızı: senin yazdığın · yeşil: doğrusu</small></div></div>
  ${issues.length || warnings.length ? `${issues.slice(0, 3).map(issueRow).join("")}${warnings.slice(0, Math.max(0, 3 - Math.min(3, issues.length))).map(issueRow).join("")}${issues.length + warnings.length > 3 ? `<details class="spaced"><summary class="model-summary">Diğer ${issues.length + warnings.length - 3} not</summary>${[...issues.slice(3), ...warnings.slice(Math.max(0, 3 - Math.min(3, issues.length)))].map(issueRow).join("")}</details>` : ""}` : '<p class="small">Kesin bir hata bulunmadı. Uygulama yalnız emin olduğu hataları gösterir; cümle yapısını Geliştir adımında kendin de oku.</p>'}
  </section>
  <section class="card w-block"><div class="w-head"><span class="w-num">3</span><div><h3>Geliştir</h3><small class="muted">fikrini ve kelimelerini koru; düzelt ve eksikleri ekle</small></div></div>
  <p class="small">Aşağıdaki metne kesin düzeltmeler uygulandı. ${missing.length ? `Ekle: ${missing.map((m) => e(m.replace(/^Eksik: /u, ""))).join(" · ")}.` : "Yapıyı ve bağlaçları zenginleştir."} AI'dan geliştirilmiş bir metin aldıysan buraya yapıştırabilirsin.</p>
  <textarea id="writing-improved" class="improved" lang="en" maxlength="12000" spellcheck="false" autocomplete="off" aria-label="Geliştirilmiş metin">${e(improved)}</textarea>
  <div class="row wrap spaced"><button class="btn small" data-action="w-diff">${ctx.ui.wDiff === item.id ? "Karşılaştırmayı gizle" : "Yan yana karşılaştır"}</button><button class="btn small secondary" data-action="w-reset-improved">Düzeltilmiş hâle döndür</button><button class="btn small secondary" data-action="copy-writing">${icon("copy")} AI istemini kopyala</button></div>
  <div id="w-diff">${ctx.ui.wDiff === item.id ? diffView(d.response || "", improved) : ""}</div>
  <details class="spaced"><summary class="model-summary">Örnek cevabı aç (yardımlı sayılır)</summary><div class="model" lang="en">${e(item.modelAnswer)}</div></details></section>
  <section class="card w-block"><div class="w-head"><span class="w-num">4</span><div><h3>Tekrar</h3><small class="muted">geliştirilmiş metnin her ikinci cümlesi boş</small></div></div>
  <p class="small">Geliştirilmiş metni bir kez oku, sonra boşlukları anlamı hatırlayarak yaz. Kelimesi kelimesine olmasa da olur; düzeltilmiş yapıları kullanmaya çalış.</p>
  <div class="repeat-text" lang="en">${template.map((part) => part.type === "break" ? '<div class="r-break"></div>' : part.type === "keep" ? `<span class="r-keep">${e(part.text)}</span> ` : `<div class="r-blank"><label for="w-repeat-${part.n}"><span class="r-num">${part.n}.</span></label><textarea id="w-repeat-${part.n}" class="w-repeat" data-n="${part.n}" rows="2" maxlength="2000" spellcheck="false" autocomplete="off" aria-label="${part.n}. boşluk">${e(typed[part.n - 1] ?? "")}</textarea>${d.repeatChecked ? repeatResult(part.text, typed[part.n - 1]) : ""}</div>`).join("")}</div>
  ${blanks.length ? `<div class="row wrap spaced"><button class="btn small" data-action="w-repeat-check">${d.repeatChecked ? "Yeniden karşılaştır" : "Karşılaştır"} ${icon("check")}</button>${d.repeatChecked ? '<button class="btn small secondary" data-action="w-repeat-reset">Temizle ve yeniden dene</button>' : ""}</div>` : '<p class="small muted">Metin tek cümle; tekrar için en az iki cümle gerekir.</p>'}
  </section>`;
}

/** Click actions of the loop. Returns true when handled. */
export function handleWritingAction(ctx, action, button, item, d) {
  if (!item || !isWritingLoop(item)) return false;
  if (action === "w-evaluate") {
    const error = document.getElementById("answer-error");
    if (!String(d.response || "").trim()) { if (error) error.textContent = "Önce bir yanıt yaz."; return true; }
    d.stage = "review";
    d.improved = analysisFor(item, d).fixed;
    d.repeat = [];
    d.repeatChecked = false;
    ctx.persist();
    ctx.render();
    document.querySelector(".w-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  if (action === "w-edit") { d.stage = "write"; ctx.persist(); ctx.render(); return true; }
  if (action === "w-req") {
    const index = Number(button.dataset.value);
    const reqs = new Set(d.reqs ?? []);
    if (reqs.has(index)) reqs.delete(index); else reqs.add(index);
    d.reqs = [...reqs].sort((a, b) => a - b);
    ctx.persist();
    ctx.render();
    return true;
  }
  if (action === "w-diff") { ctx.ui.wDiff = ctx.ui.wDiff === item.id ? null : item.id; ctx.render(); return true; }
  if (action === "w-reset-improved") { d.improved = analysisFor(item, d).fixed; d.repeat = []; d.repeatChecked = false; ctx.persist(); ctx.render(); return true; }
  if (action === "w-repeat-check") { d.repeatChecked = true; ctx.persist(); ctx.render(); return true; }
  if (action === "w-repeat-reset") { d.repeat = []; d.repeatChecked = false; ctx.persist(); ctx.render(); return true; }
  return false;
}

/** Typing in the improved text or in a repeat blank. Returns true when handled. */
export function handleWritingInput(ctx, element, d) {
  if (element.id === "writing-improved") {
    d.improved = element.value;
    // A new improved text changes the blanks; earlier answers no longer match.
    d.repeat = [];
    d.repeatChecked = false;
    ctx.persistSoon();
    return true;
  }
  if (element.classList?.contains("w-repeat")) {
    const n = Number(element.dataset.n);
    const list = Array.isArray(d.repeat) ? [...d.repeat] : [];
    while (list.length < n) list.push("");
    list[n - 1] = element.value;
    d.repeat = list.slice(0, 40);
    ctx.persistSoon();
    return true;
  }
  return false;
}
