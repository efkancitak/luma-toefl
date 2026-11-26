// Speaking hub, rehearsal/learning set runner, pronunciation lessons.
// No pronunciation or Speaking score is produced. Self-assessment, dictation
// match and external feedback are stored and shown separately.

import { compareDictation, weeklySummary, WEEKLY_SPEAKING_TARGET, SPEAKING_TEXT_LIMIT, MAX_PLAYS } from "../core.js";
import { REPEAT_SETS, INTERVIEW_SETS, INTERVIEW_TYPES, ANSWER_PLAN, STEPS, SPEAKING_GUIDE, REPEAT_TECHNIQUE, PRONUNCIATION, PRONUNCIATION_BY_ID, PHRASE_BY_ID, PROMPTS, SET_BY_ID, SPEAKING_META } from "../data/speaking.js";
import { LESSON_BY_CODE } from "../data/grammar.js";
import { e, icon, head, dictationDiff, legend, speakable, dictionaryUrl, shortDate } from "../ui.js";
import { speak, speakChunks, cancelSpeech, startRecording, stopRecording, recorderStatus, micSupported, modelThenRecording, isBusy, prepareMic } from "../media.js";

const SELF_LABELS = { clarity: "Anlaşılabilirlik", task: "Görevi karşılama", development: "Geliştirme" };
const KIND_LABEL = { repeat: "Listen and Repeat", interview: "Take an Interview" };

const runItem = (run, id) => (run.items[id] ||= {});
const PACE_TARGET = 110;

/** Four-step colour legend. */
export function stepLegend() {
  return `<div class="step-legend">${Object.entries(STEPS).map(([key, step]) => `<span class="step-chip step-${key}">${e(step.label)}</span>`).join("")}</div>`;
}

/** A model answer split into the four steps, with reusable phrases highlighted. */
export function annotatedModel(item, { listen = true } = {}) {
  if (!item.segments) return `<div class="model" lang="en">${e(item.model)}</div>`;
  const words = item.model.split(/\s+/).filter(Boolean).length;
  const body = item.segments.map(([key, text]) => `<span class="seg step-${key}" title="${e(STEPS[key]?.label ?? "")}">${e(text).replace(/\{([^}]+)\}/g, '<b class="kp">$1</b>')}</span>`).join(" ");
  return `${stepLegend()}<p class="model annotated" lang="en">${body}</p><p class="small muted">${words} kelime · 45 saniyede söylenebilecek hız (hedef ${PACE_TARGET}+). Kalın yazılanlar başka sorularda da kullanabileceğin kalıplar.</p>${listen ? `<button class="btn small secondary" data-action="say" data-say="${e(item.model)}">${icon("sound")} Örnek cevabı dinle</button>` : ""}`;
}

function paceLine(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "Cevabını dikteyle yazınca kelime sayın burada görünür.";
  return `${words} kelime · 45 saniyelik bir cevap için hedef ${PACE_TARGET}+${words >= PACE_TARGET ? " ✓" : ` (${PACE_TARGET - words} eksik)`}. Dikte kelime sayısıdır; puan değildir.`;
}
const currentSet = (run) => (run ? SET_BY_ID.get(run.setId) : null);
const currentItem = (run) => currentSet(run)?.items[run.index] ?? null;
const recordingId = (run, item) => `${run.id}:${item.id}`;

function setStats(ctx, setId) {
  const entries = ctx.state.speakingLog.filter((entry) => entry.setId === setId);
  const runs = new Set(entries.map((entry) => entry.runId)).size;
  const last = entries.at(-1);
  return { runs, last: last ? shortDate(last.at) : null };
}

function weekCard(ctx, compact = false) {
  const week = weeklySummary(ctx.state.activity, ctx.state.profile.startDate);
  const dots = Array.from({ length: WEEKLY_SPEAKING_TARGET }, (_, i) => `<i class="${i < week.speakingDays ? "on" : ""}"></i>`).join("");
  return `<section class="card week-target ${compact ? "compact" : ""}"><div class="row between"><div><span class="eyebrow muted">BU HAFTA · ${week.week}. HAFTA</span><h3>${week.speakingDays}/${WEEKLY_SPEAKING_TARGET} konuşma günü</h3></div><div class="target-dots" aria-label="${week.speakingDays} / ${WEEKLY_SPEAKING_TARGET}">${dots}</div></div>${compact ? "" : '<p class="small muted spaced">Kısa günlerde 5 dakika gölgeleme veya bir telaffuz dersi; uzun günlerde bir mülakat seti ve kendi kaydını inceleme. Haftada en az üç konuşma teması hedeflenir.</p>'}</section>`;
}

// ── Hub ────────────────────────────────────────────────────────────────────

export function speakingHubView(ctx) {
  const run = ctx.state.speakingRun;
  const active = run && !run.completedAt ? currentSet(run) : null;
  const mode = ctx.ui.speakMode;
  const themeSet = INTERVIEW_SETS.find((set) => set.id === ctx.ui.rehearsalTheme) ?? INTERVIEW_SETS[0];
  const tab = ["learn", "tools"].includes(ctx.param()) ? ctx.param() : "practice";
  const tabs = `<div class="layer-tabs" role="tablist">${[["practice", "", "Prova"], ["learn", "/learn", "Öğren"], ["tools", "/tools", "Araçlar"]].map(([id, path, label]) => `<a class="layer-tab ${tab === id ? "active" : ""}" role="tab" aria-selected="${tab === id}" href="#speaking${path}">${label}</a>`).join("")}</div>`;
  const top = `${head("Speaking", "Konuşma · görev provası, konuşma öğretimi, puanlama ölçütleri ve kendi konuşmanı inceleme araçları.")}${tabs}`;
  if (tab === "learn") return `${top}${learnTab(ctx)}`;
  if (tab === "tools") return `${top}${toolsTab(ctx, themeSet)}`;
  return `${top}
  ${ctx.speakingExtras ? ctx.speakingExtras() : ""}
  ${active ? `<section class="card resume-card row between wrap"><div><span class="eyebrow muted">YARIM KALAN PROVA</span><h3>${e(active.title)} · ${run.index + 1}/${active.items.length}</h3><p class="small muted">${KIND_LABEL[active.kind]} · ${run.mode === "rehearsal" ? "Prova modu" : "Öğrenme modu"}</p></div><a class="btn" href="#speak-run">Devam et ${icon("arrow")}</a></section>` : ""}
  ${weekCard(ctx)}
  <section class="card spaced"><span class="eyebrow muted">ÇALIŞMA MODU</span><div class="mode-toggle spaced" role="radiogroup" aria-label="Çalışma modu"><button class="chip ${mode === "learn" ? "active" : ""}" role="radio" aria-checked="${mode === "learn"}" data-action="sp-mode" data-value="learn">Öğrenme modu</button><button class="chip ${mode === "rehearsal" ? "active" : ""}" role="radio" aria-checked="${mode === "rehearsal"}" data-action="sp-mode" data-value="rehearsal">Prova modu</button></div><p class="small muted spaced">${mode === "rehearsal" ? "Prova: ses bir kez çalar, cevap penceresi otomatik başlar (cümle başına 8–12 sn, soru başına 45 sn), metin cevaptan sonra açılır. Sınav simülasyonu değildir; son haftalarda ETS dijital denemesiyle bilgisayarda çalış." : "Öğrenme: yavaş dinleme, öbek öbek dinleme, tekrar dinleme ve metni açma serbest. Kaydı istediğin zaman başlatırsın."}</p></section>
  <div class="section-title"><h2>Listen and Repeat · 7 cümle</h2><span class="small muted">${REPEAT_SETS.length} set</span></div>
  <div class="set-grid">${REPEAT_SETS.map((set) => setCard(ctx, set, "repeat")).join("")}</div>
  <div class="section-title"><h2>Take an Interview · 4 soru</h2><span class="small muted">${INTERVIEW_SETS.length} set</span></div>
  <div class="set-grid">${INTERVIEW_SETS.map((set) => setCard(ctx, set, "interview")).join("")}</div>
  <p class="small muted spaced">Luma telaffuz puanı veya Speaking bandı üretmez. Öz değerlendirme, dikte eşleşmesi ve dış geri bildirim ayrı tutulur ve tek bir sayıda birleştirilmez. Cevap yapısı ve telaffuz dersleri <a href="#speaking/learn">Öğren</a>, inceleme araçları <a href="#speaking/tools">Araçlar</a> sekmesinde.</p>`;
}

function guideSection() {
  const g = SPEAKING_GUIDE;
  const sample = INTERVIEW_SETS.flatMap((set) => set.questions).find((q) => q.id === "int-2-4");
  const sample2 = INTERVIEW_SETS.flatMap((set) => set.questions).find((q) => q.id === "int-1-1");
  return `<div class="section-title"><h2>Speaking'de puanı ne belirler?</h2></div>
  <section class="card"><ul class="score-list">${g.scoring.map(([title, text]) => `<li><strong>${e(title)}</strong><span>${e(text)}</span></li>`).join("")}</ul><p class="small muted spaced">ETS'nin Take an Interview puanlama rehberinden özetlendi. Her cevap 0–5 arası puanlanır.</p></section>
  <div class="section-title"><h2>Hız hedefi: 45 saniyede 110+ kelime</h2></div>
  <section class="card"><p>${e(g.pace)}</p><p class="small muted spaced">${e(g.scenario)}</p></section>
  <div class="section-title"><h2>Basit tut: 4 adım</h2></div>
  <section class="card">${stepLegend()}<ol class="plan-steps spaced">${ANSWER_PLAN.map((step) => `<li class="step-${e(step.key)}"><strong>${e(step.step)}</strong><span>${e(step.detail)}</span><small>${e(step.seconds)}</small></li>`).join("")}</ol>
  <h3 class="spaced" lang="en">${e(sample2.text)}</h3>${annotatedModel(sample2)}</section>
  <div class="section-title"><h2>Düşünmek için zaman kazan</h2></div>
  <section class="card"><ul class="checklist">${g.openers.map((line) => `<li lang="en">${e(line)}</li>`).join("")}</ul><p class="small muted spaced">${e(g.openersTip)}</p></section>
  <div class="section-title"><h2>Cevabını genişletmenin 3 yolu</h2></div>
  <section class="card"><ol class="tool-list">${g.expand.map(([title, text]) => `<li><strong>${e(title)}.</strong> ${e(text)}</li>`).join("")}</ol>
  <h3 class="spaced" lang="en">${e(sample.text)}</h3><p class="small muted">Karışık duygular şablonu:</p>${annotatedModel(sample)}</section>
  <div class="section-title"><h2>Söyleyiş ipuçları</h2></div>
  <section class="card"><ul class="checklist">${g.delivery.map((line) => `<li>${e(line)}</li>`).join("")}</ul><p class="small spaced"><strong>Listen and Repeat:</strong> ${e(g.repeat)}</p><div class="row wrap spaced"><a class="btn small secondary" href="#words/phrases">İfade bankası</a><a class="btn small secondary" href="#pron/P11">Tonlama dersi</a><a class="btn small secondary" href="#pron/P12">Anlam öbekleri dersi</a></div></section>`;
}

function learnTab(ctx) {
  return `${guideSection()}<div class="section-title"><h2>Soru türüne göre 45 saniyelik plan</h2></div>
  <section class="card"><ol class="plan-steps">${ANSWER_PLAN.map((step) => `<li><strong>${e(step.step)}</strong><span>${e(step.detail)}</span><small>${e(step.seconds)}</small></li>`).join("")}</ol>
  <div class="table-wrap spaced"><table class="format-table struct-table"><thead><tr><th>Soru türü</th><th>Plan</th><th>Açılış</th><th>Dersler</th></tr></thead><tbody>${Object.values(INTERVIEW_TYPES).map((type) => `<tr><td data-label="Soru türü"><strong>${e(type.label)}</strong><br><small lang="en">${e(type.example)}</small></td><td data-label="Plan">${type.plan.map(e).join(" → ")}</td><td data-label="Açılış" lang="en">${e(type.opener)}</td><td data-label="Dersler">${type.grammar.map((code) => `<a href="#lesson/${e(code)}">${e(code)}</a>`).join(" ")}</td></tr>`).join("")}</tbody></table></div>
  <p class="small muted spaced">Kalıplar ezber cevap değildir; her cevapta bir-iki ifade yeterlidir. <a href="#words/phrases">İfade bankası</a> 48 kalıbı kelime tekrarına kart olarak ekler.</p></section>
  <div class="section-title"><h2>Listen and Repeat tekniği</h2></div>
  <section class="card"><ul class="checklist">${REPEAT_TECHNIQUE.map((line) => `<li>${e(line)}</li>`).join("")}</ul></section>
  <div class="section-title"><h2>Telaffuz mikro dersleri</h2><span class="small muted">12 ders</span></div>
  <div class="pron-grid">${PRONUNCIATION.map((lesson) => { const done = ctx.state.pronunciation[lesson.id]; return `<a class="pron-tile" href="#pron/${lesson.id}"><span class="badge">${lesson.id}</span><strong>${e(lesson.title)}</strong><small>${done ? `✓ ${shortDate(done.at)}${Number.isInteger(done.selfRating) ? ` · öz değ. ${done.selfRating}/3` : ""}` : "Dinle → kaydet → karşılaştır"}</small></a>`; }).join("")}</div>`;
}

function toolsTab(ctx, themeSet) {
  return `<div class="section-title"><h2>Kendi konuşmanı incele</h2></div>
  <section class="card"><ol class="tool-list"><li><strong>Kayıt + model art arda.</strong> Her prova adımında “Model + kaydım” düğmesi önce cihaz sesini, sonra kendi kaydını çalar.</li><li><strong>Dikte ile kelime kontrolü.</strong> iPhone'da Ayarlar → Genel → Klavye → Dikte'yi Etkinleştir. Prova sonrası metin alanına dokun, klavyedeki mikrofonla cümleyi söyle; Luma hedef cümleyle kelime kelime karşılaştırır. Sonuç “dikte eşleşmesi”dir; dikte tanıma hatası telaffuz hatası sayılmaz. Dikte alanı arama alanı değildir.</li><li><strong>Mülakat transkripti.</strong> Cevabını dikteyle metne çevir, “Transkript istemini kopyala” ile istediğin geri bildirim aracına yalnız kendi cevabını yapıştır. Telaffuz ve tempo transkriptten değerlendirilmez.</li></ol>
  <h3 class="spaced">İsteğe bağlı sesli prova istemi</h3><p class="small muted">Sesli bir asistanla dört soruluk prova için. Asistan duraklamalarda araya girebilir; bu bir konuşma pratiği ve içerik geri bildirimidir, sınav simülasyonu veya telaffuz puanı değildir.</p><label class="field spaced">Tema<select id="rehearsal-theme">${INTERVIEW_SETS.map((set) => `<option value="${e(set.id)}" ${set.id === themeSet.id ? "selected" : ""}>${e(set.title)} (${e(set.theme)})</option>`).join("")}</select></label><details class="spaced"><summary class="model-summary">İstemi göster</summary><textarea class="prompt-box" readonly rows="7" aria-label="Sesli prova istemi">${e(PROMPTS.rehearsal(themeSet.theme))}</textarea></details><button class="btn secondary" data-action="copy-prompt" data-kind="rehearsal">${icon("copy")} Sesli prova istemini kopyala</button>
  <p class="small muted spaced">Telaffuz için en güvenilir dış kontrol: ayda bir–iki kez bir insan dinleyicinin (öğretmen, arkadaş) kaydını yorumlaması.</p></section>
  <p class="small muted spaced">${e(SPEAKING_META.ttsCheck)} Yanlış seslendirilen bir kelimeyi sözlük bağlantısından kontrol et.</p>`;
}

function setCard(ctx, set, kind) {
  const stats = setStats(ctx, set.id);
  const items = kind === "repeat" ? set.sentences : set.questions;
  const meta = kind === "repeat" ? `${items.length} cümle · ${Math.min(...items.map((s) => s.seconds))}–${Math.max(...items.map((s) => s.seconds))} sn` : `${items.length} soru · 45 sn · ${[...new Set(items.map((q) => INTERVIEW_TYPES[q.type].label))].join(", ")}`;
  return `<section class="card set-card"><div class="row between"><span class="badge speaking">${e(set.level)}</span><small class="muted">${stats.runs ? `${stats.runs} kez · son ${stats.last}` : "Henüz denenmedi"}</small></div><h3>${e(set.title)}</h3><p class="small muted">${e(set.scenario ?? set.researcher)}</p><p class="small">${meta}</p><div class="row wrap"><button class="btn small" data-action="sp-start" data-set="${e(set.id)}">${ctx.ui.speakMode === "rehearsal" ? "Prova et" : "Öğrenerek çalış"} ${icon("arrow")}</button></div></section>`;
}

// ── Run ────────────────────────────────────────────────────────────────────

function phaseFor(ctx, run, item) {
  const state = runItem(run, item.id);
  if (ctx.ui.phase?.itemId === item.id) return ctx.ui.phase.phase;
  if (state.revealed) return "review";
  if (run.mode === "rehearsal" && state.plays) return "interrupted";
  return "ready";
}

function recordButton(run, item, seconds) {
  const status = recorderStatus();
  const mine = status.id === recordingId(run, item);
  if (mine && status.active) return `<button class="btn recording" data-action="sp-stop">${icon("stop")} Kaydı durdur</button>`;
  if (status.saving || status.pending) return `<button class="btn" disabled>${icon("mic")} Kayıt hazırlanıyor…</button>`;
  return `<button class="btn secondary" data-action="sp-record" data-seconds="${seconds}">${icon("mic")} ${runItem(run, item.id).recordingId ? "Yeniden kaydet" : "Kaydet"}${item.seconds === 45 ? " (45 sn)" : ""}</button>`;
}

function reviewTools(ctx, run, set, item) {
  const state = runItem(run, item.id);
  const repeat = set.kind === "repeat";
  const comparison = ctx.ui.dictation[item.id] ?? (repeat && state.dictation ? compareDictation(item.text, state.dictation) : null);
  const selfDims = repeat ? ["clarity", "task"] : ["clarity", "task", "development"];
  return `<div class="tool-block"><h3>Kendi kaydını incele</h3>${state.recordingId ? `<audio class="recording-player" controls data-recording-id="${e(state.recordingId)}" aria-label="Kendi kaydın"></audio><div class="row wrap"><button class="btn small soft" data-action="sp-model-mine">${icon("repeat")} Model + kaydım art arda</button></div>` : `<p class="small muted">Bu adımda ses kaydı yok. ${micSupported() ? "" : "Bu tarayıcıda kayıt desteklenmiyor; "}Sesli söyleyip aşağıdaki dikte alanıyla kelimeleri kontrol edebilirsin.</p>`}<div class="row wrap"><button class="btn small secondary" data-action="say" data-say="${e(item.text)}">${icon("sound")} ${repeat ? "Modeli dinle" : "Soruyu dinle"}</button>${recordButton(run, item, repeat ? item.seconds + 5 : 45)}</div></div>
  ${repeat ? `<div class="tool-block"><h3>Dikte ile kelime kontrolü</h3><p class="small muted">Alana dokun, klavyedeki mikrofonla cümleyi söyle (veya yaz), sonra karşılaştır.</p><textarea id="dict-${e(item.id)}" class="dictation-input" lang="en" rows="2" maxlength="${SPEAKING_TEXT_LIMIT}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dikte edilen cümle">${e(state.dictation ?? "")}</textarea><button class="btn small" data-action="sp-compare">Karşılaştır</button>${comparison ? dictationDiff(comparison) + legend() : ""}</div>`
    : `<div class="tool-block"><h3>Transkript ve dış geri bildirim</h3><p class="small muted">Cevabını dikteyle bu alana söyle. Transkript yalnız cihazında kalır; kopyalama düğmesi istemi yalnız senin cevabınla hazırlar.</p><textarea id="dict-${e(item.id)}" class="dictation-input" lang="en" rows="4" maxlength="${SPEAKING_TEXT_LIMIT}" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Cevabının transkripti">${e(state.dictation ?? "")}</textarea><p class="small pace-line" id="pace-${e(item.id)}">${e(paceLine(state.dictation))}</p><div class="row wrap"><button class="btn small secondary" data-action="sp-save-transcript">Transkripti kaydet</button><button class="btn small" data-action="copy-prompt" data-kind="transcript">${icon("copy")} Transkript istemini kopyala</button></div><label class="field spaced">Dış geri bildirimden aldığın not (isteğe bağlı)<textarea id="ext-${e(item.id)}" rows="2" maxlength="${SPEAKING_TEXT_LIMIT}" aria-label="Dış geri bildirim notu">${e(state.external ?? "")}</textarea></label><button class="btn small secondary" data-action="sp-save-external">Notu kaydet</button></div>`}
  <div class="tool-block"><h3>Öz değerlendirme</h3><p class="small muted">0 = yeniden denemeliyim · 3 = rahatça yaptım. Resmî puan değildir.</p>${selfDims.map((dim) => `<div class="self-dim"><span>${SELF_LABELS[dim]}</span><div class="mini-rating">${[0, 1, 2, 3].map((value) => `<button class="rating ${state.self?.[dim] === value ? "selected" : ""}" data-action="sp-self" data-dim="${dim}" data-value="${value}" aria-pressed="${state.self?.[dim] === value}">${value}</button>`).join("")}</div></div>`).join("")}</div>`;
}

function interviewHelp(set, item, open) {
  const type = INTERVIEW_TYPES[item.type];
  const phrases = (item.phrases ?? []).map((id) => PHRASE_BY_ID.get(id)).filter(Boolean);
  return `<details class="help-block" ${open ? "open" : ""}><summary class="model-summary">${e(type.label)} sorusu · 45 sn planı</summary><ol class="plan-steps compact">${type.plan.map((step) => `<li><strong>${e(step)}</strong></li>`).join("")}</ol><p class="small">Açılış: <span lang="en">${e(type.opener)}</span></p>${phrases.length ? `<p class="small">İşe yarayabilecek kalıplar: ${phrases.map((p) => `<span lang="en">${e(p.phrase)}</span>`).join(" · ")}</p>` : ""}<p class="small">İlgili dersler: ${type.grammar.map((code) => `<a href="#lesson/${e(code)}">${e(code)} ${e(LESSON_BY_CODE.get(code)?.title ?? "")}</a>`).join(" · ")}</p></details>`;
}

export function runView(ctx) {
  const run = ctx.state.speakingRun;
  const set = currentSet(run);
  if (!run || !set) return `<div class="empty">Açık bir konuşma provası yok. <a href="#speaking">Konuşma sayfasına dön</a></div>`;
  if (run.completedAt || run.index >= set.items.length) return runSummary(ctx, run, set);
  const item = currentItem(run);
  const state = runItem(run, item.id);
  const phase = phaseFor(ctx, run, item);
  const repeat = set.kind === "repeat";
  const rehearsal = run.mode === "rehearsal";
  const countdown = ctx.ui.countdown;
  const showText = !rehearsal ? ctx.ui.showText[item.id] ?? false : phase === "review";
  let stage = "";
  if (rehearsal && phase === "ready") {
    stage = `<div class="stage-card"><p class="small muted">${repeat ? `Ses bir kez çalar. Bittiğinde ${item.seconds} saniyelik cevap penceresi başlar.` : "Soru bir kez çalar. Bittiğinde 45 saniyelik cevap penceresi başlar."}</p><button class="btn big" data-action="sp-play">${icon("play")} ${repeat ? "Cümleyi dinle" : "Soruyu dinle"} (bir kez)</button><label class="quiet-toggle"><input type="checkbox" id="auto-record" ${ctx.ui.autoRecord ? "checked" : ""}> Cevap penceresinde ses kaydet</label>${!micSupported() ? '<p class="small muted">Bu tarayıcıda kayıt yok; pencere süresince sesli söyle, sonra dikteyle kontrol et.</p>' : ""}</div>`;
  } else if (phase === "playing") {
    stage = `<div class="stage-card"><div class="wave live" aria-hidden="true">${Array.from({ length: 18 }, () => "<i></i>").join("")}</div><p>Dinle…</p></div>`;
  } else if (phase === "responding") {
    const remaining = countdown ? Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 1000)) : 0;
    const status = recorderStatus();
    stage = `<div class="stage-card responding"><span class="countdown" id="countdown" aria-live="off">${remaining}</span><p>${status.active ? '<span class="rec-dot"></span> Kaydediliyor — şimdi söyle.' : ctx.ui.micError ? e(ctx.ui.micError) : "Şimdi sesli söyle."}</p><button class="btn secondary" data-action="sp-finish">Bitirdim</button></div>`;
  } else if (phase === "interrupted") {
    stage = `<div class="notice warn"><strong>Bu deneme yarıda kesildi.</strong> Ses zaten bir kez çalındı. Metni açarsan veya yeniden dinlersen deneme yardımlı/yarım olarak kaydedilir.</div><div class="row wrap"><button class="btn secondary" data-action="sp-reveal">Metni göster</button><button class="btn" data-action="sp-play" data-assisted="1">${icon("play")} Yeniden dinle (yardımlı)</button></div>`;
  }
  const learnControls = !rehearsal ? `<div class="stage-card learn"><div class="row wrap"><button class="btn" data-action="say" data-say="${e(item.text)}">${icon("play")} Dinle</button><button class="btn secondary" data-action="say" data-say="${e(item.text)}" data-rate="0.75">Yavaş dinle</button>${repeat ? `<button class="btn secondary" data-action="sp-chunks">Öbek öbek (gölgeleme)</button>` : ""}<button class="btn secondary" data-action="sp-toggle-text">${showText ? "Metni gizle" : "Metni göster"}</button></div>${countdown && phase === "responding" ? `<p class="small">Kalan: <strong id="countdown">${Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 1000))}</strong> sn</p>` : ""}</div>` : "";
  const text = showText
    ? `<div class="target-text" lang="en">${repeat ? `<p class="english">${e(item.text)}</p><p class="chunks">${e(item.chunks).replace(/\|/g, '<span class="chunk-bar">|</span>')}</p>` : `<p class="english">${e(item.text)}</p>`}</div>`
    : "";
  const after = (rehearsal && phase === "review") || !rehearsal;
  return `<div class="exercise"><div class="session-header"><a class="text-button" href="#speaking">${icon("back")} Kaydet ve çık</a><span class="small muted">${run.index + 1} / ${set.items.length}</span><span class="pill">${rehearsal ? "Prova modu" : "Öğrenme modu"}</span></div><div class="progress-track"><span style="width:${Math.round((run.index / set.items.length) * 100)}%"></span></div>
  <div class="row between wrap spaced"><span class="badge speaking">${KIND_LABEL[set.kind]} · ${e(set.level)}</span>${state.assisted ? '<span class="tag due">yardımlı / yarım</span>' : ""}</div>
  <h1>${e(set.title)}</h1><p class="small muted">${e(set.scenario ?? set.researcher)}</p>
  ${!repeat ? `<p class="small spaced">Soru türü: <strong>${e(INTERVIEW_TYPES[item.type].label)}</strong></p>` : ""}
  ${stage}${learnControls}${text}
  ${!repeat && (!rehearsal || phase === "review") ? interviewHelp(set, item, !rehearsal) : ""}
  ${!repeat && phase === "review" ? `<details class="spaced" open><summary class="model-summary">Örnek cevap · 4 adım</summary>${annotatedModel(item)}<p class="small muted">Örnek, kendi örneğini geliştirmen için; ezberlenecek bir cevap değildir. Yapıyı ve kalıpları al, içeriği kendi hayatından doldur.</p></details>` : ""}
  ${!rehearsal && !repeat ? `<details class="spaced"><summary class="model-summary">Örnek cevap · 4 adım</summary>${annotatedModel(item)}</details>` : ""}
  ${after ? reviewTools(ctx, run, set, item) : ""}
  <div id="speak-error" class="inline-error" role="alert">${ctx.ui.micError && phase !== "responding" ? e(ctx.ui.micError) : ""}</div>
  <div class="bottom-actions"><a class="btn secondary" href="#speaking">Şimdilik bırak</a>${after ? `<button class="btn" data-action="sp-next" ${isBusy() ? "disabled" : ""}>${run.index === set.items.length - 1 ? "Seti bitir" : repeat ? "Sonraki cümle" : "Sonraki soru"} ${icon("arrow")}</button>` : ""}</div>
  <p class="draft-note">${rehearsal ? "Prova modu sınav koşullarına yaklaşır ama dijital adaptif sınavın yerini tutmaz." : "Öğrenme modunda tekrar dinlemek ve metni açmak serbesttir."} Kayıtlar bu cihazda kalır.</p></div>`;
}

function runSummary(ctx, run, set) {
  const rows = set.items.map((item, index) => {
    const state = run.items[item.id] ?? {};
    const comparison = set.kind === "repeat" && state.dictation ? compareDictation(item.text, state.dictation) : null;
    const self = Object.entries(state.self ?? {}).map(([dim, value]) => `${SELF_LABELS[dim]} ${value}/3`).join(" · ");
    return `<div class="mistake-item"><div><p>${index + 1}. <span lang="en">${e(item.text)}</span></p><small>${state.recordingId ? "Kayıt var" : "Kayıt yok"}${comparison ? ` · dikte eşleşmesi ${comparison.matched}/${comparison.total}` : ""}${self ? ` · öz değ.: ${self}` : ""}${state.external ? " · dış geri bildirim notu" : ""}${state.assisted ? " · yardımlı/yarım" : ""}</small></div>${state.recordingId ? `<button class="btn small secondary" data-action="download-recording" data-id="${e(state.recordingId)}">${icon("download")}</button>` : ""}</div>`;
  }).join("");
  return `<section class="card summary-card wide">${icon("leaf")}<h1>Set tamamlandı.</h1><p class="muted">${e(set.title)} · ${KIND_LABEL[set.kind]} · ${run.mode === "rehearsal" ? "Prova modu" : "Öğrenme modu"}</p></section><section class="card">${rows}<p class="small muted spaced">Öz değerlendirme, dikte eşleşmesi ve dış geri bildirim ayrı gösterilir; tek bir puanda birleştirilmez.</p></section><div class="row wrap spaced"><button class="btn" data-action="sp-start" data-set="${e(set.id)}" data-mode="${run.mode}">Aynı seti tekrar ${icon("repeat")}</button><a class="btn secondary" href="#speaking">Konuşma sayfası</a></div>`;
}

// ── Pronunciation lesson ───────────────────────────────────────────────────

export function pronunciationView(ctx, id) {
  const lesson = PRONUNCIATION_BY_ID.get(id);
  if (!lesson) return `<div class="empty">Ders bulunamadı. <a href="#speaking">Konuşma sayfasına dön</a></div>`;
  const saved = ctx.state.pronunciation[id];
  const status = recorderStatus();
  const items = lesson.items.map(([a, b]) => {
    if (lesson.kind === "pairs") {
      return `<div class="pair-row pron"><button class="word-button" data-action="say" data-say="${e(speakable(a))}" lang="en">${icon("sound")} ${e(a)}</button><button class="word-button" data-action="say" data-say="${e(speakable(b))}" lang="en">${icon("sound")} ${e(b)}</button><button class="icon-button" data-action="sp-pair" data-a="${e(speakable(a))}" data-b="${e(speakable(b))}" aria-label="Çifti art arda dinle">${icon("repeat")}</button><a class="icon-button" href="${e(dictionaryUrl(a))}" target="_blank" rel="noopener noreferrer" aria-label="${e(speakable(a))} sözlükte">${icon("external")}</a></div>`;
    }
    const single = !/\s/.test(speakable(a));
    return `<div class="pair-row pron"><button class="word-button" data-action="say" data-say="${e(speakable(a))}" lang="en">${icon("sound")} ${e(a)}</button><span class="muted small">${e(b)}</span>${single ? `<a class="icon-button" href="${e(dictionaryUrl(a))}" target="_blank" rel="noopener noreferrer" aria-label="${e(a)} sözlükte">${icon("external")}</a>` : ""}</div>`;
  }).join("");
  const sentences = lesson.sentences.map((sentence, index) => {
    const recId = `pron:${id}:${index}`;
    const mine = status.id === recId && status.active;
    const has = ctx.ui.pronRecorded[recId];
    const comparison = ctx.ui.dictation[recId];
    return `<div class="example-box pron-sentence"><p class="english" lang="en">${e(sentence).replace(/\|/g, '<span class="chunk-bar">|</span>')}</p><div class="row wrap"><button class="btn small secondary" data-action="say" data-say="${e(speakable(sentence))}">${icon("sound")} Dinle</button><button class="btn small secondary" data-action="say" data-say="${e(speakable(sentence))}" data-rate="0.75">Yavaş</button>${mine ? `<button class="btn small recording" data-action="pr-stop">${icon("stop")} Durdur</button>` : `<button class="btn small" data-action="pr-record" data-index="${index}" ${isBusy() ? "disabled" : ""}>${icon("mic")} Kaydet</button>`}${has ? `<button class="btn small soft" data-action="pr-model-mine" data-index="${index}">${icon("repeat")} Model + kaydım</button>` : ""}</div><details><summary class="model-summary">Dikte ile kontrol et</summary><textarea id="dict-${e(recId)}" class="dictation-input" lang="en" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dikte edilen cümle"></textarea><button class="btn small" data-action="pr-compare" data-index="${index}">Karşılaştır</button>${comparison ? dictationDiff(comparison) : ""}</details></div>`;
  }).join("");
  return `<article class="lesson-body"><a class="text-button" href="#speaking">${icon("back")} Konuşma</a><div class="row wrap spaced"><span class="badge speaking">${e(lesson.id)} · TELAFFUZ</span></div><div class="page-head spaced"><div><h1>${e(lesson.title)}</h1><p>Dinle → kaydet → art arda karşılaştır. Uygulama telaffuzu puanlamaz.</p></div></div>
  <section class="card"><p class="explain">${e(lesson.focus)}</p><div class="notice"><strong>İpucu</strong><br>${e(lesson.tip)}</div></section>
  <div class="section-title"><h2>${lesson.kind === "pairs" ? "Minimal çiftler" : "Örnekler"}</h2><span class="small muted">${lesson.items.length} örnek</span></div><section class="card pair-list">${items}</section>
  <div class="section-title"><h2>Kısa cümleler</h2></div><section class="card">${sentences}<div id="speak-error" class="inline-error" role="alert">${ctx.ui.micError ? e(ctx.ui.micError) : ""}</div></section>
  <section class="card spaced"><h3>Öz değerlendirme</h3><p class="spaced">${e(lesson.selfCheck)}</p><div class="rating-row">${["Yeniden denemeliyim", "Desteğe ihtiyacım var", "Büyük ölçüde", "Rahatça"].map((label, value) => `<button class="rating ${saved?.selfRating === value ? "selected" : ""}" data-action="pr-rate" data-id="${e(id)}" data-value="${value}"><strong>${value}</strong>${label}</button>`).join("")}</div><p class="small muted">Kendi değerlendirmen · resmî puan değildir. TTS'nin yanlış seslendirdiği bir kelime fark edersen sözlük bağlantısıyla kontrol et.</p></section></article>`;
}

// ── Actions ────────────────────────────────────────────────────────────────

function uniqueRunId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `run-${uuid ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}`;
}

function startRun(ctx, setId, mode) {
  const set = SET_BY_ID.get(setId);
  if (!set) return;
  if (isBusy()) { ctx.toast("Önce ses kaydını durdur ve saklanmasını bekle."); return; }
  const existing = ctx.state.speakingRun;
  if (existing && !existing.completedAt && Object.keys(existing.items).length && !window.confirm("Yarım kalan bir konuşma provası var. Yeni seti açarsan yarım set kapanır; tamamlanan adımların kaydı korunur. Devam edilsin mi?")) return;
  ctx.state.speakingRun = { id: uniqueRunId(), setId, kind: set.kind, mode, index: 0, createdAt: new Date().toISOString(), completedAt: null, items: {} };
  ctx.ui.phase = null;
  ctx.ui.countdown = null;
  ctx.ui.micError = "";
  ctx.ui.dictation = {};
  ctx.persist();
  ctx.go("speak-run");
}

function logItem(ctx, run, set, item) {
  const state = run.items[item.id] ?? {};
  const comparison = set.kind === "repeat" && state.dictation ? compareDictation(item.text, state.dictation) : null;
  const entry = {
    id: `${run.id}:${item.id}`, runId: run.id, setId: set.id, itemId: item.id, kind: set.kind, mode: run.mode,
    at: new Date().toISOString(), assisted: !!state.assisted, external: !!state.external,
  };
  if (state.recordingId) entry.recordingId = state.recordingId;
  if (comparison) entry.dictation = { matched: comparison.matched, total: comparison.total };
  if (state.self && Object.keys(state.self).length) entry.self = { ...state.self };
  ctx.state.speakingLog = [...ctx.state.speakingLog.filter((existing) => existing.id !== entry.id), entry];
}

function beginResponse(ctx, run, item, seconds) {
  const set = currentSet(run);
  ctx.ui.phase = { itemId: item.id, phase: "responding" };
  ctx.ui.countdown = { endsAt: Date.now() + seconds * 1000, itemId: item.id };
  ctx.ui.micError = "";
  if (ctx.ui.autoRecord && micSupported()) {
    recordInto(ctx, run, item, seconds + 1);
  }
  ctx.activity("speaking");
  ctx.persist();
  ctx.render();
  return set;
}

function recordInto(ctx, run, item, seconds) {
  const id = recordingId(run, item);
  startRecording({
    id,
    itemId: item.id,
    maxSeconds: seconds,
    onStart: () => ctx.renderIf("speak-run"),
    onSaved: (savedId) => {
      if (ctx.state.speakingRun?.id === run.id) { runItem(ctx.state.speakingRun, item.id).recordingId = savedId; ctx.persist(); }
      ctx.toast("Ses kaydın bu cihaza kaydedildi.");
    },
    onError: (message) => { ctx.ui.micError = message; ctx.renderIf("speak-run"); },
    onDone: () => ctx.renderIf("speak-run"),
  });
}

function finishResponse(ctx) {
  const run = ctx.state.speakingRun;
  const item = currentItem(run);
  if (!run || !item) return;
  stopRecording();
  ctx.ui.countdown = null;
  ctx.ui.phase = { itemId: item.id, phase: "review" };
  runItem(run, item.id).revealed = true;
  ctx.persist();
  ctx.render();
}

/** Called by the app every 250 ms. Updates the countdown and closes the window. */
export function speakingTick(ctx) {
  const countdown = ctx.ui.countdown;
  if (!countdown) return;
  const remaining = Math.max(0, Math.ceil((countdown.endsAt - Date.now()) / 1000));
  const node = document.getElementById("countdown");
  if (node) node.textContent = String(remaining);
  if (remaining <= 0) {
    const run = ctx.state.speakingRun;
    if (run?.mode === "rehearsal") finishResponse(ctx);
    else { stopRecording(); ctx.ui.countdown = null; ctx.ui.phase = null; ctx.render(); }
  }
}

export function stopSpeakingActivity(ctx) {
  stopRecording();
  cancelSpeech();
  if (ctx.ui.countdown) {
    const run = ctx.state.speakingRun;
    if (run?.mode === "rehearsal" && ctx.ui.phase?.phase === "responding") {
      // Leaving during the response window ends the attempt; the text opens on return.
      runItem(run, ctx.ui.phase.itemId).revealed = true;
      ctx.persist();
    }
  }
  ctx.ui.countdown = null;
  ctx.ui.phase = null;
}

export function copyPromptText(ctx, kind) {
  if (kind === "rehearsal") {
    const set = INTERVIEW_SETS.find((s) => s.id === ctx.ui.rehearsalTheme) ?? INTERVIEW_SETS[0];
    return PROMPTS.rehearsal(set.theme);
  }
  const run = ctx.state.speakingRun;
  const item = currentItem(run);
  const transcript = (document.getElementById(`dict-${item?.id}`)?.value?.trim() || runItem(run, item.id).dictation || "").slice(0, SPEAKING_TEXT_LIMIT);
  if (!transcript) return null;
  runItem(run, item.id).dictation = transcript;
  ctx.persist();
  return PROMPTS.transcript(item.text, transcript);
}

export async function handleSpeakingAction(ctx, action, button) {
  const run = ctx.state.speakingRun;
  const set = currentSet(run);
  const item = run ? currentItem(run) : null;
  const errorTo = (message) => { ctx.ui.micError = message; ctx.render(); };
  switch (action) {
    case "sp-mode":
      ctx.ui.speakMode = button.dataset.value;
      ctx.rememberPrefs();
      ctx.render();
      return true;
    case "sp-start":
      startRun(ctx, button.dataset.set, button.dataset.mode ?? ctx.ui.speakMode);
      // Ask for the microphone now, in this tap, so the dialog never eats a timed response window.
      if ((button.dataset.mode ?? ctx.ui.speakMode) === "rehearsal" && ctx.ui.autoRecord && micSupported()) {
        prepareMic().then((result) => { if (!result.ok) { ctx.ui.micError = result.message; ctx.renderIf("speak-run"); } });
      }
      return true;
    case "sp-play": {
      if (!item) return true;
      const state = runItem(run, item.id);
      if (button.dataset.assisted) state.assisted = true;
      state.plays = Math.min(MAX_PLAYS, (state.plays ?? 0) + 1);
      ctx.ui.phase = { itemId: item.id, phase: "playing" };
      ctx.persist();
      ctx.render();
      const heard = await speak(item.text, { rate: 1, onError: (m) => ctx.toast(m) });
      if (ctx.state.speakingRun?.id !== run.id || currentItem(ctx.state.speakingRun)?.id !== item.id || ctx.page() !== "speak-run") return true;
      if (!heard) {
        // No audio was played: do not open a response window for a prompt that was never heard.
        ctx.ui.phase = null;
        ctx.ui.micError = "Ses çalınamadı. Cihazın sesini ve Ayarlar’daki İngilizce ses seçimini kontrol et; istersen metni açarak devam et.";
        ctx.render();
        return true;
      }
      beginResponse(ctx, run, item, set.kind === "repeat" ? item.seconds : 45);
      return true;
    }
    case "sp-finish":
      finishResponse(ctx);
      return true;
    case "sp-reveal":
      if (item) { const state = runItem(run, item.id); state.revealed = true; state.assisted = true; ctx.ui.phase = { itemId: item.id, phase: "review" }; ctx.persist(); ctx.render(); }
      return true;
    case "sp-toggle-text":
      if (item) { ctx.ui.showText[item.id] = !ctx.ui.showText[item.id]; ctx.render(); }
      return true;
    case "sp-chunks":
      if (item?.chunks) await speakChunks(item.chunks.split("|").map((c) => c.trim()).filter(Boolean), { onError: (m) => ctx.toast(m) });
      return true;
    case "sp-record": {
      if (!item) return true;
      const seconds = Number(button.dataset.seconds) || 20;
      if (set.kind === "interview" || run.mode === "learn") {
        ctx.ui.countdown = { endsAt: Date.now() + seconds * 1000, itemId: item.id };
        ctx.ui.phase = run.mode === "learn" ? { itemId: item.id, phase: "responding" } : ctx.ui.phase;
      }
      ctx.ui.micError = "";
      recordInto(ctx, run, item, seconds);
      ctx.activity("speaking");
      ctx.persist();
      return true;
    }
    case "sp-stop":
      stopRecording();
      if (run?.mode === "learn") { ctx.ui.countdown = null; ctx.ui.phase = null; }
      ctx.render();
      return true;
    case "sp-model-mine": {
      const state = item && runItem(run, item.id);
      if (state?.recordingId) await modelThenRecording(item.text, state.recordingId, { onError: (m) => ctx.toast(m) });
      return true;
    }
    case "sp-compare": {
      if (!item) return true;
      const value = document.getElementById(`dict-${item.id}`)?.value ?? "";
      if (!value.trim()) { errorTo("Önce dikte alanına cümleyi söyle veya yaz."); return true; }
      runItem(run, item.id).dictation = value.slice(0, SPEAKING_TEXT_LIMIT);
      ctx.ui.dictation[item.id] = compareDictation(item.text, value);
      ctx.ui.micError = "";
      ctx.activity("speaking");
      ctx.persist();
      ctx.render();
      return true;
    }
    case "sp-save-transcript":
      if (item) { runItem(run, item.id).dictation = (document.getElementById(`dict-${item.id}`)?.value ?? "").slice(0, SPEAKING_TEXT_LIMIT); ctx.persist(); ctx.toast("Transkript bu cihaza kaydedildi."); }
      return true;
    case "sp-save-external":
      if (item) { runItem(run, item.id).external = (document.getElementById(`ext-${item.id}`)?.value ?? "").slice(0, SPEAKING_TEXT_LIMIT); ctx.persist(); ctx.toast("Dış geri bildirim notu ayrı olarak kaydedildi."); }
      return true;
    case "sp-self":
      if (item) { const state = runItem(run, item.id); state.self = { ...(state.self ?? {}), [button.dataset.dim]: Number(button.dataset.value) }; ctx.persist(); ctx.render(); }
      return true;
    case "sp-next": {
      if (!item || isBusy()) return true;
      runItem(run, item.id).done = true;
      logItem(ctx, run, set, item);
      ctx.activity("speaking");
      run.index += 1;
      if (run.index >= set.items.length) run.completedAt = new Date().toISOString();
      ctx.ui.phase = null;
      ctx.ui.countdown = null;
      ctx.ui.micError = "";
      ctx.persist();
      ctx.render();
      window.scrollTo(0, 0);
      return true;
    }
    case "sp-pair":
      await speakChunks([button.dataset.a, button.dataset.b], { rate: 0.9, pause: 600, onError: (m) => ctx.toast(m) });
      return true;
    case "pr-record": {
      const lessonId = ctx.param();
      const recId = `pron:${lessonId}:${button.dataset.index}`;
      ctx.ui.micError = "";
      startRecording({
        id: recId, itemId: lessonId, maxSeconds: 15,
        onStart: () => ctx.renderIf("pron"),
        onSaved: () => { ctx.ui.pronRecorded[recId] = true; ctx.activity("speaking"); ctx.persist(); },
        onError: (message) => { ctx.ui.micError = message; ctx.renderIf("pron"); },
        onDone: () => ctx.renderIf("pron"),
      });
      return true;
    }
    case "pr-stop":
      stopRecording();
      ctx.render();
      return true;
    case "pr-model-mine": {
      const lesson = PRONUNCIATION_BY_ID.get(ctx.param());
      const index = Number(button.dataset.index);
      await modelThenRecording(speakable(lesson.sentences[index]), `pron:${lesson.id}:${index}`, { onError: (m) => ctx.toast(m) });
      return true;
    }
    case "pr-compare": {
      const lesson = PRONUNCIATION_BY_ID.get(ctx.param());
      const index = Number(button.dataset.index);
      const recId = `pron:${lesson.id}:${index}`;
      const value = document.getElementById(`dict-${recId}`)?.value ?? "";
      if (!value.trim()) { ctx.toast("Önce dikte alanına cümleyi söyle veya yaz."); return true; }
      ctx.ui.dictation[recId] = compareDictation(speakable(lesson.sentences[index]), value);
      ctx.activity("speaking");
      ctx.persist();
      ctx.render();
      return true;
    }
    case "pr-rate": {
      ctx.state.pronunciation[button.dataset.id] = { at: new Date().toISOString(), selfRating: Number(button.dataset.value) };
      ctx.activity("speaking");
      ctx.persist();
      ctx.render();
      ctx.toast("Öz değerlendirmen kaydedildi; resmî puan değildir.");
      return true;
    }
    default:
      return false;
  }
}

export function handleSpeakingChange(ctx, element) {
  if (element.id === "auto-record") {
    ctx.ui.autoRecord = element.checked;
    ctx.rememberPrefs();
    if (element.checked && micSupported()) prepareMic().then((result) => { if (!result.ok) { ctx.ui.micError = result.message; ctx.renderIf("speak-run"); } });
    return true;
  }
  if (element.id === "rehearsal-theme") { ctx.ui.rehearsalTheme = element.value; ctx.render(); return true; }
  return false;
}

/** Interview transcripts and feedback notes are saved while typing, so a tap elsewhere or a reload never loses them. */
export function handleSpeakingInput(ctx, element) {
  if (ctx.page() !== "speak-run") return false;
  const run = ctx.state.speakingRun;
  const item = run ? currentItem(run) : null;
  if (!item || run.completedAt) return false;
  if (element.id === `ext-${item.id}`) {
    runItem(run, item.id).external = element.value.slice(0, SPEAKING_TEXT_LIMIT);
    ctx.persistSoon();
    return true;
  }
  if (element.id === `dict-${item.id}` && run.kind === "interview") {
    runItem(run, item.id).dictation = element.value.slice(0, SPEAKING_TEXT_LIMIT);
    const pace = document.getElementById(`pace-${item.id}`);
    if (pace) pace.textContent = paceLine(element.value);
    ctx.persistSoon();
    return true;
  }
  return false;
}
