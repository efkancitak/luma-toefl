import { createSession, selectExercises, gradeAnswer, skillStats, scheduleReview, dueVocabulary, daysUntil, planWeek, validateBackup, salvageBackup, salvageSummary, MAX_BACKUP_BYTES, logActivity, weeklySummary, recommendNext, dueGrammarCodes, compareDictation, WEEKLY_SPEAKING_TARGET, noteItemResult, dueReviewKeys, buildSet, gapKind, clozeReport, GAP_KINDS, createExamEntry, comparableExamEntry, EXAM_SOURCES, EXAM_SECTIONS, EXAM_ATTEMPTS, EXAM_CONDITIONS, EXAM_VALUE_TYPES, EXAM_TEXT_LIMITS, todayKey } from './core.js';
import { loadState, saveState, storageWarning, getRecording, downloadBlob, exportProgress, hasRecovery, exportRecovery, saveFile, lastBackupAt, listRecordings, deleteRecordings, loadPrefs, savePrefs } from './storage.js';
import { exercises, TASK_TYPES, EXAM_SPEC } from './data/content.js';
import { vocabulary, CONTENT_META } from './data/library.js';
import { DECK, LEVEL_ORDER, POS_TR, TOPICS, OBJECT_PATTERNS, PHRASAL_LESSON, meaningsOf, choicesFor } from './data/vocab.js';
import { LESSONS, LESSON_BY_CODE, lessonsForTags } from './data/grammar.js';
import { PHRASES, PHRASE_FUNCTIONS, REPEAT_SETS, INTERVIEW_SETS, PRONUNCIATION, PROMPTS, SET_BY_ID } from './data/speaking.js';
import { e, icon, SKILLS as skills, head, LEVELS, dateLabel, formatTime, countWords, shortDate, dictationDiff } from './ui.js';
import { speak, cancelSpeech, startRecording, stopRecording, isBusy, stopPlayback, setPreferredVoice, listVoices } from './media.js';
import { libraryView, lessonView, screeningView, grammarReviewView, handleGrammarAction, handleGrammarInput, handleGrammarToggle, legacyRedirect } from './views/grammar.js';
import { speakingHubView, runView, pronunciationView, handleSpeakingAction, handleSpeakingChange, handleSpeakingInput, speakingTick, stopSpeakingActivity, copyPromptText } from './views/speaking.js';

const APP_VERSION = '0.7.0';
const navItems = [['home','home','Bugün','Bugün'],['practice','play','Çalış','Çalış'],['speaking','mic','Konuşma','Konuş'],['library','layers','Dil bilgisi','Gramer'],['words','cards','Kelimeler','Kelime'],['plan','chart','Rotam','Rota']];
const phases = [
  {weeks:[1,1],title:'Başlangıç ölçümü',text:'Yeni görevleri kısaca tanı. Daha önce çözmediğin örneklerle dört beceriden ayrı başlangıç verisi al. Bilgisayarda güncel ETS dijital pratiğini kullanabiliyorsan ilk ölçümü orada yap; değilse başlangıç örneklerini ayrı oturumlara böl ve koşulu not et.',links:[['ETS dijital örnek 1','https://www.ets.org/toefl/test-takers/ibt/prepare/sample-test-jan-2026-1.html'],['Dört beceriden örnek','#practice']]},
  {weeks:[2,3],title:'Darboğaza odaklan',text:'Başlangıçta görülen bir veya iki darboğaza odaklan. Dolaylı sorular, cümle kurma, kelime biçimleri, ana fikir ve çıkarım iyi adaylar. Öncelikli 20 dil bilgisi dersinden başlamak uygundur.',links:[['Öncelikli dil bilgisi dersleri','#library/priority'],['Build a Sentence','#practice/writing']]},
  {weeks:[4,4],title:'Ara kontrol',text:'Yeni bir form veya daha önce çözmediğin bölümlerle ara kontrol. PDF seçildiyse eşleşen ETS sesini kullan. Hata türlerini ve süreyi ilk haftayla, koşulları dikkate alarak karşılaştır.',links:[['ETS Practice Test 2 (PDF)','https://www.ets.org/pdfs/toefl/toefl-ibt-full-length-practice-test-2.pdf'],['Resmî sesler (Preparing Students)','https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/preparing-students.html?version=after-jan-2026']]},
  {weeks:[5,6],title:'Kısa ama sık üretim',text:'Yazma ve konuşmada kısa ama sık üretim. Ardından süreli görev kümeleri ve yeni bağlamda hata doğrulama.',links:[['Konuşma provaları','#speaking'],['Yazma görevleri','#practice/writing']]},
  {weeks:[7,7],title:'Kesintisiz prova',text:'Daha önce görmediğin güncel ETS dijital örneğiyle bilgisayar, klavye ve kulaklıkta kesintisiz prova. Yalnız PDF varsa sonucu kâğıt uyarlaması olarak not et.',links:[['ETS dijital örnek 2','https://www.ets.org/toefl/test-takers/ibt/prepare/sample-test-jan-2026-2.html']]},
  {weeks:[8,8],title:'Son gözden geçirme ve tampon',text:'Tekrarlayan hataları, sınav yönergelerini ve süre yönetimini gözden geçir. Son günlerde yeni kart ve konu yükünü azalt.',links:[['Hatalarından dersler','#plan'],['Sınav yapısı','#sources']]},
];
const sources = [
  ['ETS · Güncel sınav yapısı (21 Ocak 2026 sonrası)','https://www.ets.org/toefl/test-takers/ibt/about/content.html?version=after-jan-2026'],
  ['ETS · Updated Test Overview (PDF)','https://www.ets.org/pdfs/toefl/toefl-ibt-test-overview.pdf'],
  ['ETS · 2026 Test Blueprint and Specifications (PDF)','https://www.ets.org/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf'],
  ['ETS · Dijital örnek 1','https://www.ets.org/toefl/test-takers/ibt/prepare/sample-test-jan-2026-1.html'],
  ['ETS · Dijital örnek 2','https://www.ets.org/toefl/test-takers/ibt/prepare/sample-test-jan-2026-2.html'],
  ['ETS · Practice Test 1 (PDF)','https://www.ets.org/pdfs/toefl/toefl-ibt-full-length-practice-test-1.pdf'],
  ['ETS · Practice Test 2 (PDF)','https://www.ets.org/pdfs/toefl/toefl-ibt-full-length-practice-test-2.pdf'],
  ['ETS · Preparing Students — PDF sesleri','https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/preparing-students.html?version=after-jan-2026'],
  ['ETS · Puan açıklaması','https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html'],
  ['ETS · Writing ölçütleri (PDF)','https://www.ets.org/pdfs/toefl/writing-rubrics.pdf'],
  ['ETS · Speaking ölçütleri (PDF)','https://www.ets.org/pdfs/toefl/speaking-rubrics.pdf'],
  ['ETS · Hazırlık merkezi','https://www.ets.org/toefl/test-takers/ibt/prepare.html'],
  ['ETS · Sınav kaydı','https://www.ets.org/toefl/test-takers/ibt/register.html'],
  ['Avrupa Konseyi · CEFR tanımları','https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors'],
  ['Academic Word List','https://www.wgtn.ac.nz/lals/resources/academicwordlist'],
  ['Cambridge Dictionary · telaffuz','https://dictionary.cambridge.org/'],
  ["Oxford Learner's Dictionaries · telaffuz",'https://www.oxfordlearnersdictionaries.com/'],
  ["Apple · iPhone'da dikte",'https://support.apple.com/guide/iphone/dictate-text-iph2c0651d2/ios'],
];
// term = id keeps the phrase deck in its designed order (dueVocabulary sorts unseen cards by word ?? term).
const phraseCards = PHRASES.map(p => ({...p, term:p.id, isPhrase:true}));
const allCards = [...DECK, ...phraseCards];
const REVIEW_SIZE = 20;
const cardById = new Map(allCards.map(c => [c.id, c]));

let state = loadState();
const ui = {skill:'all',wordLevel:'all',wordLimit:40,phraseLevel:'all',wordQuery:'',wordDeck:'words',reviewQueue:[],reviewIndex:0,reviewRevealed:false,speed:1,
  lessonQuery:'',lessonFilter:'all',summaryQuiz:{},screening:null,openModules:new Set([2,5]),
  speakMode:'learn',phase:null,countdown:null,micError:'',autoRecord:true,showText:{},dictation:{},pronRecorded:{},rehearsalTheme:INTERVIEW_SETS[0].id};
// Device preferences (not part of the progress backup): chosen voice, speed, session length, speaking mode.
const prefs=loadPrefs();
ui.cwMode='learn';
for(const key of ['speed','speakMode','autoRecord','cwMode'])if(typeof prefs[key]===typeof ui[key])ui[key]=prefs[key];
if(!['easy','learn','exam'].includes(ui.cwMode))ui.cwMode='learn';
if(![.8,1,1.2].includes(ui.speed))ui.speed=1;
if(!['learn','rehearsal'].includes(ui.speakMode))ui.speakMode='learn';
ui.voice=typeof prefs.voice==='string'?prefs.voice:'';ui.examType='raw';ui.updateReady=false;ui.sessionDiff=null;
setPreferredVoice(ui.voice);
function rememberPrefs(){savePrefs({speed:ui.speed,cwMode:ui.cwMode,speakMode:ui.speakMode,autoRecord:ui.autoRecord,voice:ui.voice});}
let toastTimeout, objectURLs = [], activePage = '', pendingImport = null, pendingDropped = '', persistTimer = null, lastViewKey = '', freshRender = false;
// A killed mobile tab may never emit pagehide; resume from the checkpoint and never count closed time.
for(const d of Object.values(state.drafts))if(d&&typeof d==='object')d.timerStartedAt=null;

function persist(){clearTimeout(persistTimer);persistTimer=null;const saved=saveState(state);if(!saved)toast(storageWarning());return saved;}
// Typing saves after a short pause instead of on every keystroke; leaving the page flushes it.
function persistSoon(after){clearTimeout(persistTimer);persistTimer=setTimeout(()=>{persist();after?.();},400);}
function toast(message){const node=document.getElementById('toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('show'),4500);}
function route(){const hash=location.hash.slice(1);return hash&&hash!=='main'?hash.split('/'):['home'];}
function go(path){if(location.hash===`#${path}`)render();else location.hash=path;}
const ctx = {
  get state(){return state;}, ui, persist, persistSoon, rememberPrefs, render, go, toast,
  activity(kind){state.activity=logActivity(state.activity,kind);},
  page:()=>route()[0], param:()=>route()[1],
  renderIf(page){if(route()[0]===page)render();},
};
function currentItem(){return state.session&&exercises.find(x=>x.id===state.session.itemIds[state.session.index]);}
function draft(item=currentItem()){if(!item)return {};return state.drafts[item.id]||={};}
function hasSession(){return state.session&&!state.session.completedAt&&state.session.index<state.session.itemIds.length;}
function sessionScopeLabel(o={}){const task=o.taskType&&o.taskType!=='all'?TASK_TYPES.find(t=>t.id===o.taskType)?.label:null;return o.retry?'Hata tekrarı':task||(o.skill&&o.skill!=='all'?`${skills[o.skill]?.name} seti`:'Karışık set');}
function setInfo(skill='all',taskType='all'){return buildSet(exercises,state.attempts,{skill,taskType});}
function learnedIds(){return new Set(state.learned);}
function dueCards(){const learned=learnedIds();return dueVocabulary(allCards,state.reviews).due.filter(c=>!learned.has(c.id));}
function dueMistakeItems(){return dueReviewKeys(state.itemReviews).map(id=>exercises.find(x=>x.id===id)).filter(Boolean);}
function progressSize(){return state.attempts.length+Object.keys(state.reviews).length+state.speakingLog.length+Object.keys(state.lessonProgress).length+state.examLog.length;}
function backupNow(){exportProgress(state).then(saved=>{if(saved){toast('Yedek dosyası hazır. Dosyalar’a veya güvendiğin bir yere kaydet.');render();}});}
function backupNotice(){
  if(progressSize()<5)return '';
  const last=lastBackupAt(),days=last?Math.floor((Date.now()-new Date(last).getTime())/86400000):null;
  if(days!==null&&days<7)return '';
  return `<div class="notice warn row between wrap"><span>${days===null?'Henüz yedek almadın.':`Son yedeğin ${days} gün önce.`} İlerlemen yalnız bu cihazda duruyor.</span><button class="btn small secondary" data-action="export">${icon('download')} Yedek al</button></div>`;
}
async function copyText(text){
  if(!text){toast('Önce kendi cevabını yaz veya dikte et.');return;}
  try{await navigator.clipboard.writeText(text);toast('İstem panoya kopyalandı. Yalnız kendi cevabını paylaştığını kontrol et.');}
  catch{toast('Kopyalanamadı. "İstemi göster" alanındaki metni seçip kopyalayabilirsin.');}
}

// ── Shared fragments ───────────────────────────────────────────────────────

function skillCards(){
  const stats=skillStats(state.attempts);
  return `<div class="skill-grid">${Object.entries(skills).map(([key,s])=>{
    const data=stats[key];
    const speakingRuns=key==='speaking'?state.speakingLog.length:0;
    const latestSelf=[...state.attempts].reverse().find(a=>a.skill===key&&a.selfAssessed&&Number.isInteger(a.selfRating));
    const meta=data.count?`${data.count} bağımsız çalışma`:data.selfCount?`${data.selfCount} öz değerlendirme`:speakingRuns?`${speakingRuns} prova adımı`:'İlk örneğini ekle';
    return `<a href="${key==='speaking'?'#speaking':`#practice/${key}`}" class="skill-card"><div class="row between"><span class="skill-icon ${key}">${icon(s.icon)}</span>${icon('arrow')}</div><h3>${s.name}</h3><div class="skill-meta">${meta}</div><div class="bar"><span style="width:${data.accuracy??0}%"></span></div><div class="skill-foot"><span>${data.accuracy===null?(latestSelf?'Son öz değerlendirmen':'Henüz ölçüm yok'):'Alıştırma doğruluğu'}</span><span>${data.accuracy===null?(latestSelf?`${latestSelf.selfRating}/3`:'—'):`%${data.accuracy}`}</span></div>${data.selfCount&&data.count?`<small class="muted">+ ${data.selfCount} öz değerlendirme</small>`:''}${data.assistedCount?`<small class="muted"> · ${data.assistedCount} yardımlı pratik</small>`:''}${data.repeatCount?`<small class="muted"> · ${data.repeatCount} tekrar çözüm</small>`:''}${speakingRuns&&data.count+data.selfCount?`<small class="muted"> · ${speakingRuns} prova adımı</small>`:''}</a>`;
  }).join('')}</div>`;
}
function weekPanel(){
  const week=weeklySummary(state.activity,state.profile.startDate);
  const dots=Array.from({length:WEEKLY_SPEAKING_TARGET},(_,i)=>`<i class="${i<week.speakingDays?'on':''}"></i>`).join('');
  return `<section class="card week-panel"><div class="row between"><span class="eyebrow muted">BU HAFTA · ${week.week}. HAFTA</span><small class="muted">${dateLabel(week.from,{day:'numeric',month:'short'})} – ${dateLabel(week.to,{day:'numeric',month:'short'})}</small></div>
  <div class="week-rows"><div class="week-row"><span>Konuşma günü</span><span class="target-dots">${dots}</span><strong>${week.speakingDays}/${WEEKLY_SPEAKING_TARGET}</strong></div><div class="week-row"><span>Dil bilgisi günü</span><span class="muted small">hatalardan 1–2 ders</span><strong>${week.grammarDays}</strong></div><div class="week-row"><span>Dört beceri</span><span class="skill-ticks">${Object.entries(skills).map(([k,s])=>`<span class="tick ${week.skills[k]?'on':''}" title="${s.tr}">${s.name[0]}</span>`).join('')}</span><strong>${Object.values(week.skills).filter(Boolean).length}/4</strong></div></div>
  ${[1,4,7].includes(week.week)&&!state.examLog.some(x=>x.date>=week.from&&x.date<week.to)?`<p class="small"><a href="#plan/log">Bu hafta ölçüm haftası: deneme sonucunu Rotam’a kaydet ${icon('arrow')}</a></p>`:''}
  <p class="small muted">Kaçırılan işler borç olarak birikmez. Hedef her hafta dört beceriyle temas ve en az üç kısa konuşma.</p></section>`;
}
function recentMistakeLessons(){
  const codes=[];
  for(const a of [...state.attempts].reverse().slice(0,40)){
    if(!(a.correct===false||(a.selfAssessed&&Number.isInteger(a.selfRating)&&a.selfRating<=1)))continue;
    const item=exercises.find(x=>x.id===a.itemId);
    for(const lesson of lessonsForTags(item?.tags)){if(!codes.includes(lesson.code))codes.push(lesson.code);}
  }
  for(const s of Object.values(state.screenings))for(const c of s.wrong)if(!codes.includes(c))codes.push(c);
  return codes.filter(code=>{const p=state.lessonProgress[code];return !p?.completedAt&&!p?.readAt;});
}
function leastPracticed(sets){return [...sets].sort((a,b)=>state.speakingLog.filter(x=>x.setId===a.id).length-state.speakingLog.filter(x=>x.setId===b.id).length)[0];}

// ── Bugün ──────────────────────────────────────────────────────────────────

function resumeItems(){
  const items=[];
  if(hasSession())items.push({label:'Çalışma seti',detail:`${state.session.index+1}/${state.session.itemIds.length}. adım · yanıtların ve taslağın kayıtlı`,attr:'data-action="resume"'});
  const run=state.speakingRun,set=run&&SET_BY_ID.get(run.setId);
  if(run&&set&&!run.completedAt)items.push({label:`Konuşma provası · ${set.title}`,detail:`${run.index+1}/${set.items.length} · ${run.mode==='rehearsal'?'Prova':'Öğrenme'} modu`,attr:'href="#speak-run"'});
  const lesson=Object.entries(state.lessonProgress).filter(([,p])=>p.layer==='full'&&!p.completedAt&&(p.screen>0||Object.keys(p.results).length)).sort((a,b)=>String(b[1].updatedAt).localeCompare(String(a[1].updatedAt)))[0];
  if(lesson&&LESSON_BY_CODE.get(lesson[0]))items.push({label:`${lesson[0]} · ${LESSON_BY_CODE.get(lesson[0]).title}`,detail:`Tam anlatım · ekran ${lesson[1].screen+1}/5`,attr:`href="#lesson/${e(lesson[0])}"`});
  if(state.grammarSession&&state.grammarSession.index<state.grammarSession.queue.length)items.push({label:'Dil bilgisi tekrarı',detail:`${state.grammarSession.index+1}/${state.grammarSession.queue.length}`,attr:'href="#greview"'});
  if(state.reviewSession&&state.reviewSession.index<state.reviewSession.itemIds.length)items.push({label:'Kelime ve ifade tekrarı',detail:`${state.reviewSession.index+1}/${state.reviewSession.itemIds.length}`,attr:'data-action="review"'});
  return items;
}
function recommendationCard(){
  const week=weeklySummary(state.activity,state.profile.startDate);
  const grammarDue=dueGrammarCodes(state.grammarReviews);
  const rec=recommendNext({dueCards:dueCards().length,grammarDue,dueMistakes:dueMistakeItems().length,speakingDays:week.speakingDays,spokeToday:week.today.has('speaking'),mistakeLessons:recentMistakeLessons(),skillTouched:week.skills});
  let title,detail,button;
  if(rec.kind==='review'){title=`${rec.count} kart tekrar zamanında.`;detail='Kelime ve konuşma ifadesi kartları. Önce hatırlamaya çalış, sonra cevaba bak; ifadeleri kendi cümlende sesli kullan.';button=`<button class="btn" data-action="review">Tekrara başla ${icon('arrow')}</button>`;}
  else if(rec.kind==='grammar-review'){title=`Dil bilgisi tekrarı: ${rec.codes.slice(0,3).join(', ')}${rec.codes.length>3?'…':''}`;detail='Daha önce yanlış yaptığın dersler bugün yeni cümlelerle soruluyor.';button=`<button class="btn" data-action="greview-start">Tekrara başla ${icon('arrow')}</button>`;}
  else if(rec.kind==='mistakes'){title=`${rec.count} soruyu yeniden deneme zamanı.`;detail='Daha önce yanlış yaptığın sorular farklı bir günde yeniden soruluyor. Doğru yaparsan bir sonraki tekrar daha ileri bir güne gider.';button=`<button class="btn" data-action="retry-due">Yeniden dene ${icon('arrow')}</button>`;}
  else if(rec.kind==='speaking'){const short=!state.speakingLog.some(x=>x.kind==='repeat'&&x.at.slice(0,10)>=week.from);const set=leastPracticed(short?REPEAT_SETS:INTERVIEW_SETS);title=short?`Kısa konuşma: ${set.title} · Listen and Repeat`:`Mülakat provası: ${set.title}`;detail=`Bu hafta ${week.speakingDays}/${WEEKLY_SPEAKING_TARGET} konuşma günü. ${short?'7 cümle, öğrenme modunda gölgeleme ve dikte kontrolü.':'4 soru, 45 saniyelik yapı ve kendi kaydını inceleme.'}`;button=`<button class="btn" data-action="sp-start" data-set="${e(set.id)}">Başla ${icon('arrow')}</button>`;}
  else if(rec.kind==='lesson'){const lesson=LESSON_BY_CODE.get(rec.code);title=`Hatandan gelen ders: ${lesson.code} ${lesson.title}`;detail=lesson.full?'Tam anlatım: 5 kısa ekran ve alıştırma.':'Özet: tek ekranlık hatırlatma ve kontrol sorusu.';button=`<a class="btn" href="#lesson/${e(lesson.code)}">Dersi aç ${icon('arrow')}</a>`;}
  else {const skill=rec.skill==='all'?null:skills[rec.skill];title=skill?`Bu hafta ${skill.tr} ile henüz çalışmadın.`:'Dört beceriden karışık bir set.';detail='Yeni sorular ve az çalışılan beceriler öncelik kazanır. Beceriyi veya zorluğu değiştirebilirsin.';button=`<button class="btn" data-action="start-set" data-value="${e(rec.skill)}">Seti başlat ${icon('arrow')}</button>`;}
  return `<section class="card reco-card"><span class="eyebrow muted">ÖNERİLEN TEK ADIM</span><h2>${e(title)}</h2><p class="small">${e(detail)}</p><div class="row wrap">${button}<a class="text-button" href="#practice">Başka bir şey seç ${icon('arrow')}</a></div></section>`;
}
function homeView(){
  const resume=resumeItems();
  const remaining=Math.max(0,daysUntil(state.profile.examDate));
  const dayIndex=Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000);
  const word=DECK[dayIndex%DECK.length];
  const phrase=PHRASES[dayIndex%PHRASES.length];
  return `${head('Her gün, biraz daha ileri.',`${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})} · Hedef tarihe ${remaining} gün`)}
  <div class="today-grid"><div class="today-main">
  ${backupNotice()}${resume.length?`<section class="card resume-card"><span class="eyebrow muted">KALDIĞIN YER</span><div class="resume-list">${resume.map(r=>`<a class="resume-row" ${r.attr}><span><strong>${e(r.label)}</strong><small>${e(r.detail)}</small></span>${icon('arrow')}</a>`).join('')}</div></section>`:''}
  ${recommendationCard()}
  <section class="card quick-sets"><span class="eyebrow muted">SET SEÇ</span><h3>Hangi beceriyi çalışacaksın?</h3><p class="small muted">Her set kolaydan zora ilerler ve kaldığın yerden devam eder. Vaktin azsa tek bir beceri seç.</p><div class="quick-grid">${[['all','Karışık','layers'],...Object.entries(skills).map(([k,v])=>[k,v.tr,v.icon])].map(([k,label,ic])=>{if(k==='speaking')return `<a class="quick-set speaking" href="#speaking">${icon(ic)}<strong>${label}</strong><small>prova setleri</small></a>`;const i=setInfo(k);return `<button class="quick-set ${k}" data-action="start-set" data-value="${k}">${icon(ic)}<strong>${label}</strong><small>${i.solved}/${i.total}</small></button>`;}).join('')}</div></section>
  </div><div class="today-side">${weekPanel()}
  <section class="card word-spot"><div class="row between"><span class="eyebrow muted">BUGÜNÜN KELİMESİ</span><span class="badge">${e(word.level)} · ${e(POS_TR[word.pos]||'')}</span></div><div class="row between"><p class="word" lang="en">${e(word.word)}</p><button class="icon-button" data-action="say" data-say="${e(word.word)}" aria-label="Kelimeyi dinle">${icon('sound')}</button></div><p class="small">${e(word.meaning)}</p><p class="example" lang="en">${e(word.example)}</p></section>
  <section class="card word-spot"><div class="row between"><span class="eyebrow muted">BUGÜNÜN İFADESİ</span><span class="badge">${e(PHRASE_FUNCTIONS[phrase.function])}</span></div><div class="row between"><p class="word phrase" lang="en">${e(phrase.phrase)}</p><button class="icon-button" data-action="say" data-say="${e(phrase.example)}" aria-label="Örneği dinle">${icon('sound')}</button></div><p class="small">${e(phrase.tr)}</p><p class="example" lang="en">${e(phrase.example)}</p></section>
  </div></div>
  <div class="section-title"><h2>Becerilerin, ayrı ayrı.</h2><a class="text-button" href="#plan">Ölçümleri gör ${icon('arrow')}</a></div>${skillCards()}`;
}

// ── Çalış ──────────────────────────────────────────────────────────────────

function practiceView(selectedSkill){
  if(selectedSkill&&(skills[selectedSkill]||selectedSkill==='all'))ui.skill=selectedSkill;
  const filtered=TASK_TYPES.filter(t=>ui.skill==='all'||t.skill===ui.skill);
  const info=setInfo(ui.skill);
  const o=state.session?.options||{};
  const open=hasSession()&&!o.retry&&(o.skill??'all')===ui.skill&&(o.taskType??'all')==='all';
  const pct=info.total?Math.round(info.solved/info.total*100):0;
  const label=ui.skill==='all'?'Karışık':skills[ui.skill].tr;
  return `${head('Bir beceri seç. Seti bitir.','Her set kolaydan zora, A1’den C2’ye ilerler. Çözdüğün sorular yeniden karşına çıkmaz.')}
  ${hasSession()&&!open?`<div class="notice row between wrap"><span>Yarım kalan set: <strong>${e(sessionScopeLabel(o))}</strong> · ${state.session.index+1}/${state.session.itemIds.length}</span><button class="text-button" data-action="resume">Devam et ${icon('arrow')}</button></div>`:''}
  <div class="filter-row">${[['all','Tümü'],...Object.entries(skills).map(([k,v])=>[k,v.name])].map(([k,v])=>`<button class="chip ${ui.skill===k?'active':''}" data-action="skill" data-value="${k}" aria-pressed="${ui.skill===k}">${v}</button>`).join('')}</div>
  ${ui.skill==='reading'||ui.skill==='all'?`<div class="notice row between wrap"><span><strong>Complete the Words</strong>’te zorlanıyorsan önce 5 adımlı yöntemi oku; Kolay, Öğrenme ve Sınav modları var.</span><a class="text-button" href="#cw-guide">Nasıl çözülür? ${icon('arrow')}</a></div>`:''}
  ${ui.skill==='speaking'?`<div class="notice row between wrap"><span>7 cümlelik Listen and Repeat ve 4 soruluk Interview prova setleri, telaffuz dersleri ve dikte kontrolü <strong>Konuşma</strong> bölümünde.</span><a class="text-button" href="#speaking">Konuşmaya git ${icon('arrow')}</a></div>`:''}
  <section class="card set-hero"><span class="eyebrow muted">${e(label)} seti</span><h2>${info.solved} / ${info.total} soru çözüldü</h2><div class="meter big" aria-hidden="true"><i style="width:${pct}%"></i></div><p class="small muted">${info.repeat?'Bu setin bütün sorularını çözdün. Yeniden başlarsan cevapların “tekrar çözüm” olarak ayrı sayılır.':open?`Kaldığın yer: ${state.session.index+1}. soru.`:`Sırada ${info.items.length} çözülmemiş soru var; ${e(info.items[0]?.level??'')} düzeyinden başlıyor.`}</p><button class="btn big wide" data-action="${open?'resume':'start-set'}" data-value="${e(ui.skill)}">${open?'Devam et':info.repeat?'Baştan tekrar çöz':info.solved?'Kaldığın yerden başla':'Seti başlat'} ${icon('arrow')}</button></section>
  <div class="section-title"><h2>Görev türüne göre</h2><span class="small muted">${filtered.length} görev türü</span></div><div class="task-grid">${filtered.map(t=>{const ti=setInfo(t.skill,t.id);return `<button class="task-tile" data-action="task" data-id="${e(t.id)}"><span class="badge ${t.skill}">${skills[t.skill].name}</span><h3 lang="en">${e(t.label)}</h3><p>${e(t.description)}</p><div class="row between"><span>${ti.solved}/${ti.total} çözüldü</span>${icon('arrow')}</div></button>`;}).join('')}</div><p class="bank-count">${exercises.length} özgün alıştırma. Bunlar kısa öğretici pratiklerdir; ETS'nin kalibre edilmiş tam sınavı değildir.</p>`;
}

// ── Kelimeler ve ifadeler ──────────────────────────────────────────────────

function cardStatus(card,learned){
  if(learned.has(card.id))return 'learned';
  const review=state.reviews[card.id];
  if(!review)return 'new';
  if(review.dueAt<=new Date().toISOString())return 'due';
  return (review.repetitions??0)>=3?'learned':'seen';
}
function deckStats(cards){
  const learned=learnedIds(),stats={total:cards.length,learned:0,due:0,seen:0,fresh:0};
  for(const card of cards){const status=cardStatus(card,learned);if(status==='learned')stats.learned++;else if(status==='due')stats.due++;else if(status==='seen')stats.seen++;else stats.fresh++;}
  return stats;
}
function levelTile(level,phrases){
  const cards=(phrases?phraseCards:DECK).filter(c=>c.level===level),st=deckStats(cards),pct=st.total?Math.round(st.learned/st.total*100):0;
  return `<button class="level-tile" data-action="study" data-scope="${phrases?'p':'w'}:${level}"><span class="level-name">${level}</span><span class="level-count"><strong>${st.learned}</strong> / ${st.total}</span><span class="meter" aria-hidden="true"><i style="width:${pct}%"></i></span><small>${st.due?`${st.due} kart tekrar zamanında`:st.seen?`${st.seen} kart çalışılıyor`:st.learned===st.total?'Tamamlandı':'Yeni'}</small></button>`;
}
function topicTile(key,label){
  const cards=DECK.filter(c=>c.topicKey===key),st=deckStats(cards),pct=st.total?Math.round(st.learned/st.total*100):0;
  return `<button class="level-tile topic-tile" data-action="study" data-scope="t:${key}"><span class="topic-name">${e(label)}</span><span class="level-count"><strong>${st.learned}</strong> / ${st.total}</span><span class="meter" aria-hidden="true"><i style="width:${pct}%"></i></span><small>${st.due?`${st.due} kart tekrar zamanında`:st.seen?`${st.seen} kart çalışılıyor`:'Yeni'}</small></button>`;
}
function wordsView(param){
  if(param==='phrases')ui.wordDeck='phrases';else if(param==='words')ui.wordDeck='words';
  const phrasesMode=ui.wordDeck==='phrases',cards=phrasesMode?phraseCards:DECK,st=deckStats(cards);
  const levels=LEVEL_ORDER.filter(l=>cards.some(c=>c.level===l));
  const rs=state.reviewSession,open=rs&&rs.index<rs.itemIds.length;
  return `${head(phrasesMode?'İfade bankası':'Kelimeler',phrasesMode?`${PHRASES.length} konuşma ve yazma kalıbı, seviyeye göre.`:`${DECK.length} kelime, B1’den C2’ye. Seviyeye ya da sınav metinlerinin konusuna göre çalış.`)}
  <div class="layer-tabs"><a class="layer-tab ${!phrasesMode?'active':''}" href="#words/words">Kelimeler · ${DECK.length}</a><a class="layer-tab ${phrasesMode?'active':''}" href="#words/phrases">İfadeler · ${PHRASES.length}</a></div>
  ${open?`<div class="notice row between wrap"><span>Yarım kalan set: ${rs.index+1}/${rs.itemIds.length}</span><button class="btn small" data-action="review">Devam et ${icon('arrow')}</button></div>`:''}
  <section class="card deck-summary"><div class="deck-numbers"><div><strong>${st.learned}</strong><span>öğrenildi</span></div><div><strong>${st.seen+st.due}</strong><span>çalışılıyor</span></div><div><strong>${st.fresh}</strong><span>yeni</span></div></div>${st.due?`<button class="btn wide" data-action="study" data-scope="${phrasesMode?'p':'w'}:due">${st.due} kartı tekrar et ${icon('arrow')}</button>`:''}</section>
  <div class="section-title"><h2>Seviyeler</h2><span class="small muted">Dokun: ${REVIEW_SIZE} kartlık set</span></div>
  <div class="level-grid">${levels.map(l=>levelTile(l,phrasesMode)).join('')}</div>
  ${phrasesMode?'':`<div class="section-title"><h2>Konular</h2><span class="small muted">Sınav metinlerinin konuları</span></div><div class="level-grid">${Object.entries(TOPICS).map(([k,label])=>topicTile(k,label)).join('')}</div>`}
  ${phrasesMode?phraseList():`<div class="section-title"><h2>Kelime listesi</h2></div><label class="search">${icon('search')}<input id="word-search" type="search" aria-label="Kelime veya Türkçe anlam ara" placeholder="Kelime veya anlam ara…" value="${e(ui.wordQuery)}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false"></label>
  <div class="filter-row">${['all',...LEVEL_ORDER,'pv'].map(l=>`<button class="chip ${ui.wordLevel===l?'active':''}" data-action="word-level" data-value="${l}" aria-pressed="${ui.wordLevel===l}">${l==='all'?'Tümü':l==='pv'?'Öbek fiil':l}</button>`).join('')}</div><div class="vocab-list" id="word-results">${wordResults()}</div>`}
  <p class="small muted spaced">Doğru bildiğin kartlar giderek uzayan aralıklarla, yanlışlar 10 dakika sonra yeniden gelir. “Öğrendim” işaretlediğin kartlar setlere girmez; işareti listeden kaldırabilirsin.</p>`;
}
function statusTag(status){return status==='learned'?'<span class="tag full">öğrenildi</span>':status==='due'?'<span class="tag due">tekrar</span>':status==='seen'?'<span class="tag plain">çalışılıyor</span>':'';}
function learnedButton(card,learned){const on=learned.has(card.id);return `<button class="icon-button ${on?'on':''}" data-action="learned-toggle" data-id="${e(card.id)}" aria-pressed="${on}" aria-label="${on?'Öğrendim işaretini kaldır':'Öğrendim olarak işaretle'}">${icon('check')}</button>`;}
function phraseList(){
  const learned=learnedIds(),items=PHRASES.filter(p=>ui.phraseLevel==='all'||p.level===ui.phraseLevel);
  return `<div class="section-title"><h2>İfade listesi</h2></div><div class="filter-row">${['all',...LEVEL_ORDER.filter(l=>PHRASES.some(p=>p.level===l))].map(l=>`<button class="chip ${ui.phraseLevel===l?'active':''}" data-action="phrase-level" data-value="${l}" aria-pressed="${ui.phraseLevel===l}">${l==='all'?'Tümü':l}</button>`).join('')}</div><p class="small muted">Kalıplar ezber cevap değildir; her cevapta bir-iki tanesi yeterlidir.</p>${Object.entries(PHRASE_FUNCTIONS).map(([fn,label])=>{const list=items.filter(p=>p.function===fn);if(!list.length)return '';return `<div class="section-title"><h3>${e(label)}</h3><span class="small muted">${list.length}</span></div><div class="vocab-list">${list.map(p=>`<article class="word-row"><div class="word-row-main"><div class="row gap8 wrap"><strong lang="en">${e(p.phrase)}</strong><span class="badge">${e(p.level)}</span>${statusTag(cardStatus(p,learned))}</div><p>${e(p.tr)}</p><p class="example" lang="en">${e(p.example)}</p></div><div class="word-row-actions"><button class="icon-button" data-action="say" data-say="${e(p.example)}" aria-label="Örneği dinle">${icon('sound')}</button>${learnedButton(p,learned)}</div></article>`).join('')}</div>`;}).join('')}`;
}
function wordResults(){
  const query=ui.wordQuery.trim().toLocaleLowerCase('tr'),learned=learnedIds();
  const items=DECK.filter(w=>(ui.wordLevel==='all'||(ui.wordLevel==='pv'?w.pos==='pv':w.level===ui.wordLevel))&&(!query||`${w.word} ${w.meaning}`.toLocaleLowerCase('tr').includes(query)));
  if(!items.length)return '<div class="empty">Bu aramada kelime bulunamadı. Başka bir sözcük veya seviye dene.</div>';
  const shown=items.slice(0,ui.wordLimit);
  return `<p class="small muted">${items.length} kelime</p>${shown.map(w=>`<article class="word-row"><div class="word-row-main"><div class="row gap8 wrap"><strong lang="en">${e(w.word)}</strong><span class="pos">${e(POS_TR[w.pos]||'')}</span><span class="badge">${e(w.level)}</span>${statusTag(cardStatus(w,learned))}</div><p>${e(w.meaning)}</p>${w.phrasal?`<p class="pv-pattern" lang="en">${w.phrasal.senses.map(s=>e(s.pattern)).join(' · ')}</p>`:''}<p class="example" lang="en">${e(w.example)}</p></div><div class="word-row-actions"><button class="icon-button" data-action="say" data-say="${e(w.word)}" aria-label="${e(w.word)} kelimesini dinle">${icon('sound')}</button>${learnedButton(w,learned)}</div></article>`).join('')}${items.length>shown.length?`<button class="btn secondary wide" data-action="word-more">${items.length-shown.length} kelime daha göster</button>`:''}`;
}
function phrasalBack(card){
  const senses=card.phrasal.senses;
  return `<div class="pv-back">${senses.map((s,i)=>`<div class="pv-sense">${senses.length>1?`<span class="pv-num">${i+1}</span>`:''}<div><p><strong>${e(s.meaning)}</strong></p><p class="pv-pattern" lang="en">${e(s.pattern)}</p><p class="small muted">${e(OBJECT_PATTERNS[s.object]??'')}</p><p class="quiz-example" lang="en">${e(s.example)} <button class="icon-button inline" data-action="say" data-say="${e(s.example)}" aria-label="Örneği dinle">${icon('sound')}</button></p><p class="small">${e(s.exampleTr)}</p>${s.note?`<p class="small muted">${e(s.note)}</p>`:''}</div></div>`).join('')}<a class="text-button" href="#lesson/${PHRASAL_LESSON}">Öbek fiiller dersi (${PHRASAL_LESSON}) ${icon('arrow')}</a></div>`;
}
function quizFor(card){
  if(card.isPhrase)return choicesFor(card,phraseCards.filter(p=>p.function!==card.function),{key:p=>[p.phrase.toLocaleLowerCase('en-US')]});
  return choicesFor(card,DECK);
}
function studyQueue(scope){
  const [kind,level]=String(scope).split(':');
  if(kind==='one')return cardById.has(level)?[level]:[];
  const learned=learnedIds(),now=new Date().toISOString();
  const pool=(kind==='p'?phraseCards:kind==='w'||kind==='t'?DECK:allCards).filter(c=>!learned.has(c.id)&&(level==='due'||(kind==='t'?c.topicKey===level:c.level===level)));
  const due=pool.filter(c=>state.reviews[c.id]?.dueAt<=now).sort((a,b)=>state.reviews[a.id].dueAt.localeCompare(state.reviews[b.id].dueAt));
  if(level==='due')return due.slice(0,REVIEW_SIZE).map(c=>c.id);
  const fresh=pool.filter(c=>!state.reviews[c.id]);
  // Nothing due and nothing new: practise the cards studied least recently, as Tureng-style lists allow.
  const extra=due.length+fresh.length?[]:pool.filter(c=>state.reviews[c.id]).sort((a,b)=>state.reviews[a.id].dueAt.localeCompare(state.reviews[b.id].dueAt));
  return [...due,...fresh,...extra].slice(0,REVIEW_SIZE).map(c=>c.id);
}
function startStudy(scope){
  const ids=studyQueue(scope);
  if(!ids.length){toast(String(scope).endsWith(':due')?'Şu an tekrar zamanı gelen kart yok.':'Bu seviyedeki bütün kartları “Öğrendim” olarak işaretledin. İşaretleri listeden kaldırabilirsin.');return;}
  state.reviewSession={itemIds:ids,index:0,revealed:false,right:0,wrong:0,scope:String(scope).slice(0,40)};persist();go('review');
}
function reviewSummary(){
  const rs=state.reviewSession,right=rs?.right??0,wrong=rs?.wrong??0,scope=rs?.scope&&!rs.scope.startsWith('one:')?rs.scope:null,phrases=String(rs?.scope).startsWith('p');
  return `<section class="summary-card card">${icon('leaf')}<h1>Set bitti.</h1><div class="stats-strip"><div><strong class="ok-text">${right}</strong><span>doğru</span></div><div><strong class="bad-text">${wrong}</strong><span>yanlış</span></div></div><p class="muted">Yanlışlar 10 dakika sonra, doğrular giderek uzayan aralıklarla yeniden gelir.</p><div class="spaced row wrap" style="justify-content:center">${scope?`<button class="btn" data-action="study" data-scope="${e(scope)}">Bir set daha ${icon('arrow')}</button>`:''}<a href="#words${phrases?'/phrases':''}" class="btn secondary">${phrases?'İfadelere':'Kelimelere'} dön</a></div></section>`;
}
function reviewView(){
  const rs=state.reviewSession,card=rs&&cardById.get(rs.itemIds[rs.index]);
  if(!card)return reviewSummary();
  const {options,answer}=quizFor(card);
  const picked=rs.revealed&&Number.isInteger(rs.pick)?rs.pick:null,done=picked!==null,ok=picked===answer;
  const learned=learnedIds().has(card.id);
  const choice=(option,i)=>{
    const state=done?(i===answer?'right':i===picked?'wrong':'dim'):'';
    const lines=card.isPhrase?[option.phrase]:meaningsOf(option);
    const tag=!card.isPhrase&&POS_TR[option.pos]?` <em>[${e(POS_TR[option.pos])}]</em>`:'';
    return `<button class="choice ${state}" data-action="pick-word" data-value="${i}" ${done?'disabled':''}><span class="choice-mark" aria-hidden="true">${state==='right'?icon('check'):state==='wrong'?icon('close'):''}</span><span class="choice-text" ${card.isPhrase?'lang="en"':''}>${lines.map((line,n)=>`<span>${e(line)}${n===0?tag:''}</span>`).join('')}</span></button>`;
  };
  const front=card.isPhrase
    ?`<span class="badge">İfade · ${e(PHRASE_FUNCTIONS[card.function]??'')} · ${e(card.level)}</span><h2 class="quiz-word">${e(card.tr)}</h2><p class="small muted">İngilizcesi hangisi?</p>`
    :`<span class="badge">${e(card.level)} · ${e(POS_TR[card.pos]||'')}</span><h2 class="quiz-word" lang="en">${e(card.word)}</h2><button class="icon-button say-big" data-action="say" data-say="${e(card.word)}" aria-label="Kelimeyi dinle">${icon('sound')}</button>`;
  const after=done?`<div class="quiz-after ${ok?'ok':'no'}" role="status"><strong>${ok?'Doğru!':picked===-1?'Bu kart 10 dakika sonra yeniden gelecek.':'Doğrusu yeşil olan.'}</strong>${card.phrasal?phrasalBack(card):`<p class="quiz-example" lang="en">${e(card.example)}</p><div class="row wrap gap8"><button class="btn small secondary" data-action="say" data-say="${e(card.example)}">${icon('sound')} Örneği dinle</button></div>`}</div>`:'';
  return `<div class="quiz"><div class="quiz-top"><a href="#words${card.isPhrase?'/phrases':''}" class="text-button">${icon('back')} ${card.isPhrase?'İfadeler':'Kelimeler'}</a><span class="quiz-count">${rs.index+1} / ${rs.itemIds.length}</span></div>
  <div class="progress-track"><span style="width:${Math.round(rs.index/rs.itemIds.length*100)}%"></span></div>
  <section class="quiz-card">${front}</section>
  <div class="choices">${options.map(choice).join('')}</div>
  ${after}
  <div class="quiz-bar"><span class="score ok">${icon('check')}<b>${rs.right??0}</b></span>${done?`<button class="btn" data-action="next-word">${rs.index+1===rs.itemIds.length?'Seti bitir':'Devam'} ${icon('arrow')}</button>`:`<button class="btn secondary" data-action="pick-word" data-value="-1">Bilmiyorum</button>`}<span class="score no">${icon('close')}<b>${rs.wrong??0}</b></span></div>
  <label class="learned-toggle"><input type="checkbox" id="learned-box" data-id="${e(card.id)}" ${learned?'checked':''}> Öğrendim · bu kartı setlere bir daha koyma</label></div>`;
}

// ── Practice session (v0.1 items) ──────────────────────────────────────────

function taskMeta(item){return TASK_TYPES.find(t=>t.id===item.taskType);}
function audioPanel(item){
  return `<div class="audio-panel"><div class="row between"><div class="wave" aria-hidden="true">${Array.from({length:18},()=>'<i></i>').join('')}</div><div class="row"><button class="btn small" data-action="listen">${icon('play')} Dinle</button><select id="audio-speed" aria-label="Dinleme hızı">${[.8,1,1.2].map(v=>`<option value="${v}" ${ui.speed===v?'selected':''}>${v}× hız</option>`).join('')}</select></div></div><p>Cihazın İngilizce sesi kullanılır. Çevrimdışı ses desteği cihaza bağlıdır.</p><button class="text-button" data-action="transcript">${draft(item).showTranscript?'Metni gizle':'Dinledikten sonra metni göster'}</button>${draft(item).showTranscript?`<div class="transcript" lang="en">${e(item.audioText)}</div><small>Bu yanıt yardım alınmış çalışma olarak kaydedilir.</small>`:''}</div>`;
}
function exerciseContent(item,answered){
  const d=draft(item),response=d.response;
  if(item.type==='mcq')return `${item.passage?`<div class="passage english" lang="en">${e(item.passage)}</div>`:''}<div class="quiz-options">${item.options.map((o,i)=>`<button class="option ${response===i?'selected':''} ${answered&&i===item.answer?'correct':''} ${answered&&response===i&&i!==item.answer?'incorrect':''}" data-action="option" data-value="${i}" ${answered?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span lang="en">${e(o)}</span></button>`).join('')}</div>`;
  if(item.type==='gaps')return clozeContent(item,answered,d);
  if(item.type==='order'){const order=d.order||[];return `<p class="small muted">Sözcüklere sırayla dokun. Yerini değiştirmek için seçtiğin sözcüğe tekrar dokun.</p><div class="token-row" aria-label="Oluşturduğun cümle">${order.length?order.map((index,i)=>`<button class="token token-answer" lang="en" data-action="remove-token" data-value="${i}" ${answered?'disabled':''}>${e(item.tokens[index])}</button>`).join(''):'<span class="muted small">Cümlen burada oluşacak…</span>'}</div><div class="token-row" aria-label="Kullanılabilir sözcükler">${item.tokens.map((word,i)=>`<button class="token" lang="en" data-action="add-token" data-value="${i}" ${answered||order.includes(i)?'disabled':''}>${e(word)}</button>`).join('')}</div>${answered?`<div class="example-box english" lang="en">${e(item.answer)}</div>`:''}`;}
  if(item.type==='writing')return `<label class="field">İngilizce yanıtın<textarea id="writing-response" lang="en" maxlength="12000" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Write your response here…" ${answered?'readonly':''}>${e(response||'')}</textarea></label><div class="row between draft-note"><span id="draft-status">Taslak bu cihazda otomatik kaydedilir.</span><span id="word-count">${countWords(response)} kelime</span></div>${selfAssessment(item,answered)}`;
  if(item.type==='speaking'){const busy=isBusy();return `<div class="card"><h3>Yanıtını sesli ver.</h3><p class="small muted" style="margin:8px 0 18px">Kayıt bu cihazda kalır. Telaffuz puanlaması yapılmaz. 7 cümlelik ve 4 soruluk setler için <a href="#speaking">Konuşma</a> bölümünü kullan.</p><div class="row wrap"><button class="btn ${busy?'recording':''}" data-action="${busy?'stop-recording':'record'}" ${answered?'disabled':''}>${icon(busy?'stop':'mic')}${busy?'Kaydı durdur':'Mikrofonla kaydet'}</button><span class="small muted">En çok 90 saniye</span></div><div id="record-error" class="inline-error" role="alert"></div>${d.recordingId?`<audio class="recording-player" controls data-recording-id="${e(d.recordingId)}" aria-label="Kendi yanıtını dinle"></audio><button class="text-button" data-action="download-recording" data-id="${e(d.recordingId)}">${icon('download')} Ses kaydını indir</button>`:''}${item.taskType==='listen-repeat'?`<details><summary class="model-summary">Dikte ile kelime kontrolü</summary><textarea id="session-dictation" class="dictation-input" lang="en" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dikte edilen cümle"></textarea><button class="btn small" data-action="session-compare">Karşılaştır</button><div id="session-diff">${ui.sessionDiff?.itemId===item.id?ui.sessionDiff.html:''}</div></details>`:''}<p class="small muted">Mikrofon kullanamıyorsan sesli denedikten sonra kısa bir not yazabilirsin.</p><textarea id="speaking-note" rows="2" style="min-height:90px;margin-top:10px" maxlength="4000" aria-label="Konuşma denemesi notu" placeholder="Örneğin: ikinci cümlede zaman uyumunda zorlandım…" ${answered?'readonly':''}>${e(response||'')}</textarea></div>${selfAssessment(item,answered)}`;}
  return '';
}
const CW_MODES={easy:['Kolay','Her kelimenin yarısından fazlası verilir; ipucu açık.'],learn:['Öğrenme','Gerçek format; boşluğa dokun, gerekirse ipucu al.'],exam:['Sınav','Gerçek format; ipucu yok. Ölçüm için bunu kullan.']};
const CW_KIND_TIPS={
  function:'Kısa yapı kelimelerinde zorlandın. Boşluğun önüne ve arkasına bak: isimden önce the/this/their, fiilden önce to/can/will, iki fikri bağlarken and/but/which/while/because. 2–4 harfli kelimeler çoğu zaman yapı kelimesidir.',
  form:'Kökü buldun ama ek tutmadı. Özne tekilse fiil -s alır; geçmiş anlatımda -ed; to’dan sonra yalın fiil; isimden önce sıfat (-al, -ous, -ive); fiili niteleyen zarf (-ly); çoğul isim -s. Çizgi sayısı ekin uzunluğunu söyler.',
  word:'Kök kelimeyi tanımadın. Bunlar konu kelimeleridir: ilk cümleden konuyu çıkar ve o konudaki sık kelimeleri düşün. Kelimeler bölümündeki konu desteleri (biyoloji, yer bilimi, tarih…) burada doğrudan işe yarar.'};
const CW_HINTS={function:'Yapı kelimesi: bağlaç, edat, zamir, belirleyici ya da yardımcı fiil. Önündeki ve arkasındaki kelimeye bak.',form:'Ekli kelime: kökü tanı, sonra eki dil bilgisinden seç (-s, -ed, -ing, -ly, -tion…).',word:'Kök kelime: paragrafın konusundan ve ilk cümleden tahmin et.'};
function easyReveal(answer){return answer.length>1?answer.slice(0,Math.floor(answer.length/2)):'';}
function cwMode(d){return d.mode||ui.cwMode;}
function clozeContent(item,answered,d){
  const given=Array.isArray(d.response)?d.response:[],mode=answered?(d.mode||'exam'):ui.cwMode,hints=d.hints||{};
  const passage=e(item.passage).replace(/([A-Za-z]*)\{\{(\d+)\}\}/g,(_,prefix,raw)=>{
    const i=Number(raw),gap=item.gaps[i],n=gap.answer.length;
    if(answered){const ok=String(given[i]??'').trim().toLowerCase()===gap.answer.toLowerCase();return `<span class="gap-unit ${ok?'gap-ok':'gap-no'}">${e(prefix)}<b>${e(gap.answer)}</b>${ok?'':`<s aria-label="Senin cevabın">${e(given[i]||'—')}</s>`}<sup>${i+1}</sup></span>`;}
    const shown=mode==='easy'?easyReveal(gap.answer):'',typed=String(given[i]??'');
    const value=shown&&typed.startsWith(shown)?typed.slice(shown.length):typed;
    return `<span class="gap-unit">${e(prefix)}${shown?`<span class="gap-shown">${e(shown)}</span>`:''}<input class="gap-input" data-gap="${i}" data-shown="${e(shown)}" maxlength="${n-shown.length}" style="--n:${n-shown.length}" placeholder="${'_'.repeat(n-shown.length)}" aria-label="${i+1}. kelime: ${e(prefix+shown)} ile başlıyor, ${n-shown.length} harf eksik" value="${e(value)}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">${hints[i]?'<sup class="hinted" aria-label="ipucu alındı">ipucu</sup>':''}</span>`;});
  if(answered){
    const report=clozeReport(item,given),weak=Object.entries(report.byKind).filter(([,b])=>b.right<b.total).sort((a,b)=>a[1].right/a[1].total-b[1].right/b[1].total)[0];
    const rows=report.rows.map(r=>`<div class="cw-row ${r.correct?'ok':'no'}"><span class="cw-n">${r.index+1}</span><span class="cw-w" lang="en">${e(r.word)}</span><span class="cw-k">${e(GAP_KINDS[r.kind])}</span><span class="cw-t">${e(item.gapsTr?.[r.index]??'')}</span></div>`).join('');
    const kinds=Object.entries(GAP_KINDS).filter(([k])=>report.byKind[k]).map(([k,label])=>`<span class="cw-kind"><strong>${report.byKind[k].right}/${report.byKind[k].total}</strong> ${e(label)}</span>`).join('');
    return `<div class="passage cloze" lang="en">${passage}</div><div class="cloze-review"><p><strong>${report.rows.filter(r=>r.correct).length}/${report.rows.length}</strong> kelime doğru${d.mode==='easy'?' · Kolay mod':Object.keys(hints).length?` · ${Object.keys(hints).length} boşlukta ipucu`:''}. <span class="small muted">Yeşil: doğru. Kırmızı: üstü çizili olan senin cevabın, yanındaki doğrusu.</span></p><div class="cw-kinds">${kinds}</div>${weak?`<div class="notice"><strong>Odaklan: ${e(GAP_KINDS[weak[0]])}</strong><br>${e(CW_KIND_TIPS[weak[0]])}</div>`:'<div class="notice">Bütün türlerde doğru. Bir sonraki metni Sınav modunda dene.</div>'}<div class="section-title"><h3>Kelimeler</h3><a class="text-button" href="#cw-guide">Nasıl çözülür? ${icon('arrow')}</a></div><div class="cw-table">${rows}</div>${item.passageTr?`<details class="spaced"><summary class="model-summary">Metnin Türkçesi</summary><p class="small">${e(item.passageTr)}</p></details>`:''}</div>`;
  }
  const modeBar=`<div class="cw-modes" role="radiogroup" aria-label="Çalışma modu">${Object.entries(CW_MODES).map(([k,[label]])=>`<button class="chip ${mode===k?'active':''}" role="radio" aria-checked="${mode===k}" data-action="cw-mode" data-value="${k}">${label}</button>`).join('')}</div><p class="small muted">${e(CW_MODES[mode][1])} <a href="#cw-guide">Nasıl çözülür?</a></p>`;
  const hintBar=mode==='exam'?'':`<div class="cw-hint" id="cw-hint" aria-live="polite"><span class="small muted">İpucu için bir kutuya dokun.</span></div>`;
  return `${modeBar}<div class="passage cloze" lang="en">${passage}</div>${hintBar}`;
}
function hintPanel(item,i){
  const d=draft(item),gap=item.gaps[i],word=gap.prefix+gap.answer,kind=gapKind(word),level=(d.hints||{})[i]||0,missing=gap.answer.length-(cwMode(d)==='easy'?easyReveal(gap.answer).length:0);
  const lines=[`<strong>${i+1}. boşluk</strong> · ${missing} harf eksik`];
  if(level>=1)lines.push(e(CW_HINTS[kind]));
  if(level>=2&&item.gapsTr?.[i])lines.push(`Türkçesi: <strong>${e(item.gapsTr[i])}</strong>`);
  if(level>=3)lines.push(`Harf ipucu: ${Math.min(level-2,gap.answer.length)} harf yazıldı.`);
  const next=level===0?'Türü göster':level===1&&item.gapsTr?.[i]?'Anlamı göster':'Bir harf göster';
  return `<div class="cw-hint-text">${lines.map(l=>`<p class="small">${l}</p>`).join('')}</div>${level-2<gap.answer.length?`<button class="btn small soft" data-action="cw-hint" data-gap="${i}">${next}</button>`:''}`;
}
function selfAssessment(item,answered){
  const prompt=item.type==='writing'?`<details class="spaced"><summary class="model-summary">Dış geri bildirim istemi (isteğe bağlı)</summary><p class="small muted">Yalnız kendi cevabını paylaş; kişisel bilgi ekleme. Uygulama haricî servise veri göndermez.</p><button class="btn small secondary" data-action="copy-writing">${icon('copy')} İstemi kendi yanıtımla kopyala</button></details>`:'';
  return `<div class="self-panel"><h3>Yanıtına bir öğretmen gözüyle bak.</h3><ul class="checklist">${item.checklist.map(c=>`<li>${e(c)}</li>`).join('')}</ul><details><summary class="model-summary">Örnek yaklaşımı incele</summary><div class="model" lang="en">${e(item.modelAnswer)}</div></details>${prompt}<p class="small muted spaced">Kendi değerlendirmen · resmî puan değildir</p><div class="rating-row">${['Yeniden denemeliyim','Desteğe ihtiyacım var','Büyük ölçüde yaptım','Rahatça yaptım'].map((l,i)=>`<button class="rating ${draft(item).selfRating===i?'selected':''}" data-action="self-rate" data-value="${i}" ${answered?'disabled':''}><strong>${i}</strong>${l}</button>`).join('')}</div></div>`;
}
function relatedLessons(item,answered){
  const weak=answered&&(answered.correct===false||(answered.selfAssessed&&Number.isInteger(answered.selfRating)&&answered.selfRating<=1));
  if(!weak)return '';
  const lessons=lessonsForTags(item.tags);
  if(!lessons.length)return '';
  return `<div class="related-lessons"><span class="eyebrow muted">İLGİLİ DİL BİLGİSİ DERSİ</span>${lessons.map(l=>`<a class="lesson-chip" href="#lesson/${e(l.code)}"><strong>${e(l.code)}</strong> ${e(l.title)} <span class="tag ${l.full?'full':'plain'}">${l.full?'Tam anlatım':'Özet'}</span></a>`).join('')}</div>`;
}
function sessionView(){
  const s=state.session;
  if(!s||s.completedAt||s.index>=s.itemIds.length)return summaryView();
  const item=currentItem();
  if(!item)return '<div class="notice warn">Bu içerik güncellenmiş veya kaldırılmış. Yeni bir çalışma seti açabilirsin.</div><a href="#practice" class="btn">Çalışma alanı</a>';
  const answered=s.answers[item.id],d=draft(item),meta=taskMeta(item),secs=d.timerSeconds??item.practiceSeconds??meta?.practiceSeconds??120;
  return `<div class="exercise"><div class="session-header"><a class="text-button" href="#home">${icon('back')} Kaydet ve çık</a><span class="small muted">${s.index+1} / ${s.itemIds.length} adım</span><span class="pill">${e(sessionScopeLabel(s.options))}${s.options.repeat?' · tekrar':''}</span></div><div class="progress-track"><span style="width:${Math.round(s.index/s.itemIds.length*100)}%"></span></div><div class="row between wrap"><span class="badge ${item.skill}">${skills[item.skill].name} · ${e(item.level)}</span>${s.options.timed?`<div class="row gap8"><span class="timer" id="timer">${formatTime(secs)}</span><button class="btn small secondary" data-action="timer">${d.timerStartedAt?'Duraklat':secs===0?'Yeni süre başlat':'Sayacı başlat'}</button></div>`:''}</div><h1 lang="en">${e(meta?.label||item.title)}</h1><p class="small muted">${e(item.title)} · Özgün öğretici pratik</p><div class="prompt" lang="en">${e(item.prompt)}</div>${item.audioText?audioPanel(item):''}${exerciseContent(item,answered)}${answered?`<div class="feedback ${answered.correct===false?'incorrect':''}" role="status"><strong>${answered.selfAssessed?'Yanıtın ve öz değerlendirmen kaydedildi.':answered.correct?'İyi iş. Bağlantıyı kurdun.':'Bu ayrıntıyı birlikte inceleyelim.'}</strong><p>${e(answered.feedback||'')}</p><p>${e(item.explanation)}</p>${answered.assisted?'<small>Yardımlı pratik: metin veya örnek görüntülendi.</small>':''}</div>${relatedLessons(item,answered)}`:''}<div id="answer-error" class="inline-error" role="alert"></div><div class="bottom-actions"><a class="btn secondary" href="#home">Şimdilik bırak</a>${answered?`<button class="btn" data-action="next">${s.index===s.itemIds.length-1?'Oturumu tamamla':'Sonraki adım'} ${icon('arrow')}</button>`:`<button class="btn" data-action="check" ${isBusy()?'disabled':''}>${isBusy()?'Ses kaydediliyor…':['writing','speaking'].includes(item.type)?'Değerlendirmeyi kaydet':'Cevabı kontrol et'} ${icon('check')}</button>`}</div><p class="draft-note">${s.options.timed?'Sayaç pratik içindir; gerçek sınavda duraklatma yoktur. Sayfadan ayrılınca burada duraklar.':'Zaman sınırı yok. Her adımda ilerlemen saklanır.'}</p></div>`;
}
function summaryView(){
  const s=state.session,answers=s?Object.values(s.answers):[],objective=answers.filter(a=>!a.selfAssessed),correct=objective.filter(a=>a.correct).length;
  return `<section class="summary-card card"><span class="skill-icon reading" style="margin:auto">${icon('leaf')}</span><h1>Bir adım daha attın.</h1><p class="muted">${answers.length?`${answers.length} çalışma kaydedildi. İstersen devam edebilir, istersen burada bırakabilirsin.`:'Bir beceri seçerek ilk çalışmanı başlatabilirsin.'}</p><div class="stats-strip"><div><strong>${objective.length?`${correct}/${objective.length}`:'—'}</strong><span>Cevap anahtarlı görevler</span></div><div><strong>${answers.length-objective.length}</strong><span>Öz değerlendirme</span></div></div><p class="small muted spaced">Bu özet TOEFL puanı veya CEFR seviyesi değildir.</p><div class="spaced row wrap" style="justify-content:center">${s&&!s.options.retry?`<button class="btn" data-action="start-set" data-value="${e(s.options.skill||'all')}" data-task="${e(s.options.taskType||'all')}">Sıradaki sorularla devam ${icon('arrow')}</button>`:''}<a class="btn secondary" href="#practice">Setlere dön</a></div></section>`;
}

// ── Rotam ──────────────────────────────────────────────────────────────────

function addDays(key,days){const d=new Date(`${key}T12:00:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}
function examSection(){
  const log=[...state.examLog].sort((a,b)=>b.date.localeCompare(a.date)||b.at.localeCompare(a.at));
  const options=(map,selected)=>Object.entries(map).map(([k,v])=>`<option value="${k}" ${k===selected?'selected':''}>${e(v)}</option>`).join('');
  const value=x=>x.valueType==='raw'?`${x.correct}/${x.total}`:e(x.value);
  const row=x=>{const prev=comparableExamEntry(x,state.examLog);
    return `<div class="mistake-item exam-row"><div><p><strong>${value(x)}</strong> · ${e(EXAM_SECTIONS[x.section])} · ${e(x.label||EXAM_SOURCES[x.source])}</p><small>${dateLabel(x.date,{day:'numeric',month:'short',year:'numeric'})} · ${e(EXAM_ATTEMPTS[x.attempt])} · ${e(EXAM_CONDITIONS[x.condition])} · ${x.valueType==='raw'?'ham sonuç':'kaynağın tahmini'}${x.label?` · ${e(EXAM_SOURCES[x.source])}`:''}</small>${prev?`<small class="exam-compare">Aynı koşuldaki önceki ilk çözüm: ${value(prev)} · ${dateLabel(prev.date,{day:'numeric',month:'short'})}</small>`:''}${x.note?`<small>${e(x.note)}</small>`:''}</div><button class="icon-button" data-action="exam-delete" data-id="${e(x.id)}" aria-label="Bu deneme sonucunu sil">${icon('trash')}</button></div>`;};
  const raw=ui.examType==='raw';
  return `<div class="section-title" id="exam-log"><h2>Deneme sonuçların</h2><span class="small muted">${log.length} kayıt</span></div>
  <section class="card"><p class="small muted">ETS denemelerini kaynağı ve koşuluyla kaydet. Luma bu sayılardan TOEFL bandı veya CEFR seviyesi üretmez; yalnız aynı bölüm, kaynak türü ve koşuldaki ilk çözümleri yan yana gösterir.</p>
  <details class="spaced"><summary class="model-summary">Deneme sonucu ekle</summary><form id="exam-form" class="spaced"><div class="form-grid">
  <label class="field">Tarih<input type="date" id="exam-date" name="date" required value="${e(todayKey())}"></label>
  <label class="field">Kaynak<select id="exam-source" name="source">${options(EXAM_SOURCES,'ets-digital-1')}</select></label>
  <label class="field">Bölüm<select id="exam-section" name="section">${options(EXAM_SECTIONS,'reading')}</select></label>
  <label class="field">Çözüm<select id="exam-attempt" name="attempt">${options(EXAM_ATTEMPTS,'first')}</select><small>Daha önce gördüğün formu “tekrar” olarak kaydet.</small></label>
  <label class="field">Koşul<select id="exam-condition" name="condition">${options(EXAM_CONDITIONS,'timed')}</select><small>Transkript, sesli okutma veya ara verme “yardımlı” sayılır.</small></label>
  <label class="field">Değer türü<select id="exam-type" name="valueType">${options(EXAM_VALUE_TYPES,ui.examType)}</select></label>
  ${raw?`<label class="field">Doğru sayısı<input type="number" id="exam-correct" name="correct" inputmode="numeric" min="0" max="500" required></label><label class="field">Toplam madde<input type="number" id="exam-total" name="total" inputmode="numeric" min="1" max="500" required></label>`:`<label class="field">Kaynağın verdiği değer<input type="text" id="exam-value" name="value" maxlength="${EXAM_TEXT_LIMITS.value}" required autocomplete="off" placeholder="Örn. 4.5"><small>Kaynakta yazdığı gibi, dönüştürmeden.</small></label>`}
  <label class="field">Form veya ad (isteğe bağlı)<input type="text" id="exam-label" name="label" maxlength="${EXAM_TEXT_LIMITS.label}" autocomplete="off" placeholder="Örn. Practice Test 2 · Reading"></label>
  <label class="field">Not (isteğe bağlı)<input type="text" id="exam-note" name="note" maxlength="${EXAM_TEXT_LIMITS.note}" autocomplete="off" placeholder="Örn. son 5 soruya süre yetmedi"></label>
  </div><div id="exam-error" class="inline-error" role="alert"></div><button class="btn spaced" type="submit">Sonucu kaydet ${icon('check')}</button></form></details>
  ${log.length?log.map(row).join(''):'<div class="empty">Henüz deneme sonucu yok. 1., 4. ve 7. haftadaki ölçümlerini buraya kaydet.</div>'}</section>`;
}
function measurementSection(){
  const log=state.speakingLog;
  const dict=log.filter(x=>x.dictation).slice(-5).reverse();
  const selfEntries=log.filter(x=>x.self&&Object.keys(x.self).length).slice(-5).reverse();
  const progress=Object.values(state.lessonProgress);
  const firstTry=progress.reduce((acc,p)=>{for(const r of Object.values(p.results)){if(r==='correct')acc.right++;if(r==='correct'||r==='wrong'||r==='self')acc.total++;}return acc;},{right:0,total:0});
  const successes=Object.values(state.grammarReviews).reduce((sum,r)=>sum+(r.successes||0),0);
  return `<div class="section-title"><h2>Ölçümler · ayrı ayrı</h2></div>
  <div class="measure-grid">
  <section class="card"><h3>Konuşma</h3><p class="small muted">Öz değerlendirme, dikte eşleşmesi ve dış geri bildirim tek sayıda birleştirilmez.</p><ul class="measure-list"><li><span>Prova adımı</span><strong>${log.filter(x=>x.mode==='rehearsal').length} prova · ${log.filter(x=>x.mode==='learn').length} öğrenme</strong></li><li><span>Dikte eşleşmesi (son 5)</span><strong>${dict.length?dict.map(x=>`${x.dictation.matched}/${x.dictation.total}`).join(' · '):'—'}</strong></li><li><span>Öz değerlendirme (son 5)</span><strong>${selfEntries.length?selfEntries.map(x=>Object.entries(x.self).map(([k,v])=>`${({clarity:'A',task:'G',development:'D'})[k]}${v}`).join('')).join(' · '):'—'}</strong></li><li><span>Dış geri bildirim notu</span><strong>${log.filter(x=>x.external).length}</strong></li><li><span>Telaffuz dersi</span><strong>${Object.keys(state.pronunciation).length}/12</strong></li></ul><p class="small muted">A = anlaşılabilirlik, G = görevi karşılama, D = geliştirme (0–3).</p></section>
  ${(()=>{const c=clozeStats();const pct=b=>b.total?`%${Math.round(b.right/b.total*100)} (${b.right}/${b.total})`:'—';const weak=Object.entries(c.totals).filter(([,b])=>b.total).sort((a,b)=>a[1].right/a[1].total-b[1].right/b[1].total)[0];return `<section class="card"><h3>Complete the Words</h3><p class="small muted">${c.count} metin çözüldü · ${c.exam} tanesi ipuçsuz. Bütün denemeler, boşluk türüne göre:</p><ul class="measure-list">${Object.entries(GAP_KINDS).map(([k,label])=>`<li><span>${e(label)}</span><strong>${pct(c.totals[k])}</strong></li>`).join('')}</ul>${weak&&c.count?`<p class="small">En zayıf tür: <strong>${e(GAP_KINDS[weak[0]])}</strong>. ${e(CW_KIND_TIPS[weak[0]])}</p>`:''}<a class="text-button" href="#cw-guide">Nasıl çözülür? ${icon('arrow')}</a></section>`;})()}
  <section class="card"><h3>Dil bilgisi</h3><ul class="measure-list"><li><span>Tam anlatımı tamamlanan</span><strong>${progress.filter(p=>p.completedAt).length}</strong></li><li><span>Özeti okunan</span><strong>${progress.filter(p=>p.readAt).length}</strong></li><li><span>Ders alıştırması · ilk deneme</span><strong>${firstTry.total?`${firstTry.right}/${firstTry.total} doğru`:'—'}</strong></li><li><span>Farklı günde doğru tekrar</span><strong>${successes}</strong></li><li><span>Tekrar kuyruğunda</span><strong>${Object.keys(state.grammarReviews).length} ders</strong></li></ul><p class="small muted">Bir kez doğru cevap ustalık sayılmaz; farklı günde yeni cümlelerle doğrular ayrıca görünür.</p></section></div>
  <div class="notice">Uygulama TOEFL bandı veya resmî CEFR seviyesi üretmez. ETS deneme sonuçlarını “Deneme sonuçların” bölümüne kaynağı ve koşuluyla kaydet.</div>`;
}
function planView(){
  const week=planWeek(state.profile.startDate);
  const mistakes=[...state.attempts].reverse().filter(a=>a.correct===false).slice(0,8);
  const recordings=[...state.attempts.filter(a=>a.recordingId).map(a=>({id:a.recordingId,label:exercises.find(x=>x.id===a.itemId)?.title||'Konuşma çalışması',at:a.at})),...state.speakingLog.filter(x=>x.recordingId).map(x=>({id:x.recordingId,label:`${SET_BY_ID.get(x.setId)?.title||'Prova'} · ${x.itemId}`,at:x.at}))].sort((a,b)=>b.at.localeCompare(a.at)).slice(0,6);
  return `${head('Rotan belli. Hızın sana ait.',`${dateLabel(state.profile.examDate)} · Değiştirilebilir hedef tarih`,'<a class="icon-button" href="#settings" aria-label="Hedef ayarları">'+icon('settings')+'</a>')}
  ${skillCards()}<div class="notice">Doğruluk yalnız cevap anahtarlı, yardımsız ve ilk kez çözülen pratikleri gösterir. Yardımlı çalışma, tekrar çözüm ve öz değerlendirme ayrı sayılır.</div>
  <div class="section-title"><h2>Sekiz haftalık rota</h2><span class="badge">${week}. hafta</span></div>
  <div class="notice">Her hafta: en az üç kısa konuşma teması · görev hatalarından bir-iki dil bilgisi dersi · dört beceriyle temas. Kaçırılan işler borç olarak birikmez.</div>
  <div class="week-grid">${phases.map(p=>{const from=addDays(state.profile.startDate,(p.weeks[0]-1)*7);const to=p.weeks[1]===8?addDays(state.profile.examDate,-1):addDays(state.profile.startDate,p.weeks[1]*7-1);const current=week>=p.weeks[0]&&week<=p.weeks[1];return `<section class="card week-card ${current?'current':''}"><div class="row between"><span class="eyebrow muted">${p.weeks[0]===p.weeks[1]?`${p.weeks[0]}. HAFTA`:`${p.weeks[0]}–${p.weeks[1]}. HAFTALAR`}</span>${current?'<span class="badge">Şu anki odak</span>':''}</div><small class="muted">${dateLabel(from,{day:'numeric',month:'short'})} – ${dateLabel(to,{day:'numeric',month:'short'})}</small><h3>${e(p.title)}</h3><p>${e(p.text)}</p><div class="link-col">${p.links.map(([label,href])=>href.startsWith('http')?`<a class="text-button" href="${e(href)}" target="_blank" rel="noopener noreferrer">${e(label)} ${icon('external')}</a>`:`<a class="text-button" href="${e(href)}">${e(label)} ${icon('arrow')}</a>`).join('')}</div></section>`;}).join('')}</div>
  <p class="small muted spaced">Rota başlangıç tarihine göre ilerler; bir haftanın geçmesi o konuyu bitirdiğin anlamına gelmez. Form ve soruları tekrar çözmek faydalıdır, ama ilerleme ölçümü için ilk kez karşılaşılan örnekleri sakla.</p>
  ${examSection()}
  ${measurementSection()}
  <div class="section-title"><h2>Hata defterin</h2><span class="small muted">${Object.keys(state.itemReviews).length} soru tekrar planında</span></div>${dueMistakeItems().length?`<div class="notice row between wrap"><span><strong>${dueMistakeItems().length} soru</strong> yeniden deneme zamanında. Yanlışlar ertesi günden itibaren, doğrular giderek uzayan aralıklarla geri gelir.</span><button class="btn small" data-action="retry-due">Yeniden dene ${icon('arrow')}</button></div>`:''}<section class="card">${mistakes.length?mistakes.map(a=>{const item=exercises.find(x=>x.id===a.itemId);if(!item)return '';const lessons=lessonsForTags(item.tags);return `<div class="mistake-item"><div><p>${e(item.title)}</p><small>${skills[item.skill].name} · ${e(item.level)} · ${new Date(a.at).toLocaleDateString('tr-TR')}</small>${lessons.length?`<div class="row wrap">${lessons.map(l=>`<a class="lesson-chip small" href="#lesson/${e(l.code)}">${e(l.code)} ${e(l.title)}</a>`).join('')}</div>`:''}</div><button class="btn small soft" data-action="retry-item" data-id="${e(item.id)}">Yeniden dene</button></div>`;}).join(''):'<div class="empty">Henüz yanlış yanıt kaydı yok. Çalıştıkça dönmen gereken konular burada birikecek.</div>'}</section>
  <div class="section-title"><h2>Son konuşma kayıtların</h2></div><section class="card">${recordings.map(r=>`<div class="mistake-item"><span class="small">${e(r.label)} · ${shortDate(r.at)}</span><button class="btn small secondary" data-action="download-recording" data-id="${e(r.id)}">${icon('download')} İndir</button></div>`).join('')||'<p class="small muted">Ses kaydı aldığında burada görebilirsin. Sesler JSON yedeğine dahil değildir.</p>'}</section><div class="spaced"><a href="#sources" class="btn secondary">Sınav formatı ve kaynaklar ${icon('external')}</a></div>`;
}
function cwGuideView(){
  const fn=[['th__ / th___','the, that, they, them, then, than, this, these, those, their'],['wh___','which, while, where, when, whose, whole'],['a__ / an_','and, any, also, are, all / an'],['fo_ / fr__','for, form, four / from'],['wi__ / wit__','with, will, within, without'],['th____','through, though, these, those, three'],['bo__ / ea__','both / each'],['o_ / i_ / t_','on, of, or / in, is, it, if / to']];
  const sf=[['Çoğul isim','-s, -es, -ies','grain → grains, species'],['Tekil özneyle fiil','-s, -es','the brain stores'],['Geçmiş / edilgen','-ed (düzensiz: made, struck)','were formed, carried'],['Süreç / isim fiil','-ing','during the day, by adding'],['Zarf','-ly','slowly, usually, gradually'],['İsim','-tion, -sion, -ment, -ness, -ity, -ance','process → production, movement'],['Sıfat','-al, -ous, -ive, -ful, -able','environmental, various, active']];
  return `${head('Complete the Words nasıl çözülür?','Sınavda Reading bölümünün ilk görevi. Bir paragrafta 10 kelimenin ikinci yarısı eksik; her doğru harf dizisi bir puan.')}
  <section class="card"><h2>Görev nasıl görünür?</h2><ul class="checklist spaced"><li>Paragraf kısa ve akademiktir (biyoloji, yer bilimi, tarih, psikoloji, ekonomi…).</li><li>İlk cümle her zaman tamdır. İkinci cümleden itibaren her ikinci kelimenin ikinci yarısı silinir; sonraki cümleler yine tamdır.</li><li>Kelimenin ilk yarısı verilir (tek harfli kısa kelimeler atlanır). Ekranda eksik harf kadar çizgi vardır: çizgiyi say, kelimenin uzunluğunu bil.</li><li>Boşlukların yaklaşık üçte biri “the, which, through” gibi kısa yapı kelimeleri; geri kalanı ekli kelimeler (-s, -ed, -ly, -tion) ve konu kelimeleridir.</li></ul></section>
  <div class="section-title"><h2>5 adımlı yöntem</h2></div>
  <section class="card"><ol class="plan-steps"><li><strong>1 · Konuyu kur</strong><span>İlk cümleyi ve boşluklardan sonraki tam cümleleri oku. Konu ve zaman (geçmiş mi, genel gerçek mi) buradan çıkar.</span></li><li><strong>2 · Önce kısa kelimeler</strong><span>2–4 harfli boşlukları doldur. Bunlar cümlenin iskeleti; iskelet oturunca uzun kelimeler kolaylaşır.</span></li><li><strong>3 · Türü belirle</strong><span>Boşluğun önüne ve arkasına bak: the’dan sonra isim/sıfat, to’dan sonra yalın fiil, fiilden sonra çoğu zaman zarf veya nesne.</span></li><li><strong>4 · Eki seç</strong><span>Çizgi sayısına uyan eki seç: çoğul mu, -s alan fiil mi, -ed mi, -ly mi? Özne–fiil uyumunu kontrol et.</span></li><li><strong>5 · Baştan oku</strong><span>Bütün paragrafı bir kez daha oku; yazım ve tekil/çoğul hatalarını düzelt. Tek paragraf için yaklaşık 3 dakika ayır.</span></li></ol></section>
  <div class="section-title"><h2>Kısa kelime ipuçları</h2></div>
  <section class="card"><div class="table-wrap"><table class="format-table"><thead><tr><th>Görünen</th><th>Sık adaylar</th></tr></thead><tbody>${fn.map(([a,b])=>`<tr><td lang="en">${e(a)}</td><td lang="en">${e(b)}</td></tr>`).join('')}</tbody></table></div><p class="small muted spaced">Çizgi sayısı adayları eler: “th _ _ _” dört harf eksikse “through” olamaz, “their/these/those/there” olabilir; cümledeki yer seçimi yapar.</p></section>
  <div class="section-title"><h2>Ek tablosu</h2></div>
  <section class="card"><div class="table-wrap"><table class="format-table"><thead><tr><th>İhtiyaç</th><th>Ek</th><th>Örnek</th></tr></thead><tbody>${sf.map(([a,b,c])=>`<tr><td>${e(a)}</td><td lang="en">${e(b)}</td><td lang="en">${e(c)}</td></tr>`).join('')}</tbody></table></div></section>
  <div class="section-title"><h2>Uygulamada nasıl çalışmalı?</h2></div>
  <section class="card"><ol class="tool-list"><li><strong>Kolay mod:</strong> kelimenin yarısından fazlası verilir. Format yeni geliyorsa ilk 3–4 metni böyle çöz.</li><li><strong>Öğrenme modu:</strong> gerçek format. Takılınca kutuya dokun ve ipucu al: önce tür, sonra Türkçe anlam, sonra harf harf. İpucu alınan deneme “yardımlı” sayılır.</li><li><strong>Sınav modu:</strong> ipucu yok; Rotam’daki ölçüm bunu sayar. Haftada en az bir metni bu modda çöz.</li><li>Her denemeden sonra <strong>hata türüne</strong> bak (yapı kelimesi / ekli kelime / kök kelime) ve önerilen çalışmayı yap: kök kelimelerde zorlanıyorsan Kelimeler’deki konu destelerini, eklerde zorlanıyorsan dil bilgisindeki G2.1, G2.8, G2.13 derslerini çalış.</li><li>Yanlış yaptığın metin hata defterine girer ve ertesi gün yeniden sorulur.</li></ol><div class="row wrap spaced"><button class="btn" data-action="task" data-id="complete-words">Complete the Words setini başlat ${icon('arrow')}</button><a class="btn secondary" href="#words">Konu desteleri</a></div></section>
  <p class="small muted spaced">Resmî örnekler için ETS'nin dijital örnek testlerini kullan (Kaynaklar sayfasında). Bu uygulamadaki metinler format örnek alınarak özgün yazıldı; ETS soruları kopyalanmadı.</p>`;
}
function clozeStats(){
  const totals=Object.fromEntries(Object.keys(GAP_KINDS).map(k=>[k,{right:0,total:0}]));let count=0,exam=0;
  for(const a of state.attempts){const item=exercises.find(x=>x.id===a.itemId);if(item?.type!=='gaps'||!Array.isArray(a.response))continue;count++;if(!a.assisted)exam++;const r=clozeReport(item,a.response);for(const [k,b] of Object.entries(r.byKind)){totals[k].right+=b.right;totals[k].total+=b.total;}}
  return {count,exam,totals};
}
function sourcesView(){
  return `${head('Doğru kaynak, doğru hazırlık.','21 Ocak 2026 sonrası TOEFL iBT · Kaynak listesi kontrolü: 16 Kasım 2026')}<section class="card"><h2>Sınavın güncel yapısı</h2><div class="table-wrap"><table class="format-table"><thead><tr><th>Bölüm</th><th>Görevler</th><th>Madde</th><th>Yaklaşık süre</th></tr></thead><tbody>${EXAM_SPEC.sections.map(s=>`<tr><td>${e(s.label)}</td><td>${TASK_TYPES.filter(t=>t.skill===s.skill).map(t=>`<span lang="en">${e(t.label)}</span>`).join(', ')}</td><td>${s.items}</td><td>${s.minutes} dk</td></tr>`).join('')}</tbody></table></div><p class="small muted spaced">Reading ve Listening iki aşamalı adaptiftir; Writing ve Speaking doğrusal ilerler. Planlı ara yoktur. ETS soru ve sürelerin değişebileceğini belirtir ve bütün oturum için yaklaşık iki saat ayırmayı önerir. Rapor dört bölüm ve genel sonuç için yarım adımlı 1–6 ölçeğini kullanır; geçiş döneminde karşılaştırılabilir 0–120 toplam da raporlanır.</p></section>
  <section class="card spaced"><h3>ETS PDF denemeleriyle çalışırken</h3><ul class="checklist spaced"><li>Aynı numaralı ETS sesini aç; transkripti ve cevap anahtarını görev sonuna kadar kapalı tut.</li><li>Ses yoksa sesli okutma veya metin üzerinden çalışmayı yardımlı olarak not et.</li><li>Kâğıt uyarlamasının ham doğru sayısından adaptif sınav bandı hesaplama.</li><li>Daha önce görmediğin bir formu ölçüm için ayır; yeniden çözdüğünü tekrar olarak not et.</li></ul></section>
  <div class="source-links spaced">${sources.map(([title,url])=>`<a class="source-link" href="${e(url)}" target="_blank" rel="noopener noreferrer"><span>${e(title)}</span>${icon('external')}</a>`).join('')}</div>
  <section class="card spaced"><h3>Bu uygulamanın içerik sınırı</h3><p class="small muted spaced">${exercises.length} özgün alıştırma, ${DECK.length} kelime kartı, ${PHRASES.length} ifade kartı, ${LESSONS.length} dil bilgisi dersi (${LESSONS.filter(l=>l.full).length} Tam anlatım), ${REPEAT_SETS.length} Listen and Repeat seti, ${INTERVIEW_SETS.length} Interview seti ve ${PRONUNCIATION.length} telaffuz dersi. İçerik AI yardımıyla özgün hazırlandı; bağımsız dil uzmanı incelemesi bekliyor (${e(CONTENT_META.reviewStatus)}).</p><p class="small muted spaced">ETS soruları, sesleri, örnek yanıtları, rubrik metinleri ve PDF dosyaları uygulamaya eklenmez; resmî alıştırmaları kaynağında aç. Dış geri bildirim için yalnız kendi cevabını paylaş. Luma bağımsız bir çalışma aracıdır; TOEFL adı sınavı tanımlar.</p></section>`;
}
function voiceSection(){
  const voices=listVoices();
  return `<section class="card settings-section"><h2>Ses ve dinleme</h2><p class="small muted">Dinleme görevleri, model cümleler ve kelimeler cihazının İngilizce sesiyle okunur. Doğal bir ses, dinleme ve tekrar çalışmasının kalitesini doğrudan etkiler.</p>${voices.length?`<div class="form-grid spaced"><label class="field">İngilizce ses<select id="voice-select"><option value="">Otomatik · en uygun ses</option>${voices.map(v=>`<option value="${e(v.name)}" ${v.name===ui.voice?'selected':''}>${e(v.name)} · ${e(v.lang)}${v.local?'':' · yalnız çevrimiçi'}</option>`).join('')}</select><small>“Yalnız çevrimiçi” sesler internetsiz çalışmaz.</small></label><label class="field">Dinleme hızı<select id="voice-speed">${[.8,1,1.2].map(v=>`<option value="${v}" ${ui.speed===v?'selected':''}>${v}× hız</option>`).join('')}</select></label></div><div class="row wrap spaced"><button class="btn small secondary" data-action="voice-test">${icon('sound')} Sesi dene</button></div>`:'<div class="notice warn">Bu cihazda İngilizce ses bulunamadı. Metinle çalışmaya devam edebilirsin; ses için cihaz ayarlarından bir İngilizce ses indir.</div>'}<p class="small muted spaced">iPhone’da daha doğal bir ses için: Ayarlar → Erişilebilirlik → Seslendirilen İçerik → Sesler → İngilizce bölümünden “Geliştirilmiş” veya “Premium” bir ses indir, sonra burada seç. İndirilen sesler internetsiz de çalışır.</p></section>`;
}
function settingsView(){
  return `${head('Çalışma alanın, senin kontrolünde.','Tek profil. Bu cihazda saklanan veriler.')}<section class="card settings-section"><h2>Hedefin</h2><form id="settings-form"><div class="form-grid"><label class="field">Planlama için sınav tarihi<input type="date" name="examDate" required value="${e(state.profile.examDate)}"><small>Kesin rezervasyon değil; Ocak ortası varsayımı.</small></label><label class="field">İsteğe bağlı hedef bant<select name="targetBand"><option value="">Mümkün olan en yüksek skor</option>${[3,3.5,4,4.5,5,5.5,6].map(n=>`<option value="${n}" ${String(state.profile.targetBand)===String(n)?'selected':''}>${n} / 6</option>`).join('')}</select></label><label class="field">Çalışma başlangıcı<input type="date" name="startDate" required value="${e(state.profile.startDate)}"></label></div><button class="btn spaced" type="submit">Ayarları kaydet ${icon('check')}</button></form></section>
  ${voiceSection()}<section class="card settings-section"><h2>İlerleme yedeğin</h2><p class="small"><strong>${lastBackupAt()?`Son yedek: ${new Date(lastBackupAt()).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}`:'Bu cihazda henüz yedek alınmadı.'}</strong> Telefonda yedek, paylaşım menüsüyle Dosyalar’a (iCloud Drive) kaydedilir.</p><p class="small muted">İlerleme ve taslaklar bu tarayıcıda; sesler cihazın ayrı ses deposundadır. Tarayıcı verilerini silmek kayıtlarını da silebilir. Otomatik bulut eşitlemesi yok.</p><div class="row wrap spaced"><button class="btn" data-action="export">${icon('download')} İlerleme yedeği indir</button><label class="btn secondary" for="import-file">Yedekten geri yükle</label><input id="import-file" type="file" accept="application/json,.json" hidden></div><p class="small muted spaced">JSON yedeği: hedef, cevaplar, taslaklar, kelime/ifade tekrarları, dil bilgisi ilerlemesi ve tekrar kuyruğu, konuşma provası kayıtları (dikte metni, öz değerlendirme, notlar). <strong>Ses dosyaları bu yedeğe dahil değildir</strong>; Rotam ekranından ayrı indir. Eski (v0.1) yedekler de yüklenebilir.</p>${pendingImport?`<div class="notice warn"><p>Dosya doğrulandı: ${pendingImport.attempts.length} çalışma, ${Object.keys(pendingImport.lessonProgress).length} ders ilerlemesi, ${pendingImport.speakingLog.length} konuşma adımı. Geri yüklemek mevcut ilerlemeyi değiştirir; önce mevcut yedeğin indirilecek.</p>${pendingDropped?`<p><strong>Dosyanın bir bölümü okunamadı ve atlanacak:</strong> ${e(pendingDropped)}. Geri kalanı yüklenir.</p>`:''}<div class="row wrap spaced"><button class="btn" data-action="confirm-import">Mevcut yedeği indir ve geri yükle</button><button class="btn secondary" data-action="cancel-import">Vazgeç</button></div></div>`:''}</section>
  <section class="card settings-section"><h2>Ses kayıtların</h2><p class="small" id="rec-usage">Hesaplanıyor…</p><div class="row wrap spaced"><button class="btn small secondary" data-action="rec-clean" data-days="30">30 günden eski kayıtları sil</button><button class="btn small secondary" data-action="rec-clean" data-days="0">Tüm ses kayıtlarını sil</button></div><p class="small muted spaced">Kayıtlar yalnız bu cihazda durur ve yedeğe dahil değildir. Saklamak istediklerini önce Rotam ekranından indir.</p></section>
  <section class="card settings-section"><h2>iPhone'da uygulama gibi kullan</h2><ol class="steps"><li>HTTPS ile yayımlanmış adresi Safari'de aç.</li><li>Paylaş menüsünden <strong>Ana Ekrana Ekle</strong> seçeneğini kullan.</li><li>İlk açılışı internet varken yap; uygulama dosyalarının hazır olmasını bekle.</li><li>Aynı giriş biçiminden devam et ve düzenli yedek al.</li><li>Dikte için: Ayarlar → Genel → Klavye → Dikte'yi Etkinleştir. Luma dikte için ayrıca mikrofon izni istemez.</li></ol><p class="small muted">Masaüstünün localhost adresi telefonda açılmaz. Ana ekran kurulumu, mikrofon, dikte ve çevrimdışı ses gerçek iPhone'da ayrıca denenmelidir.</p></section>
  <section class="card settings-section"><h2>Veri ve içerik</h2><p class="small muted">Hesap, reklam ve analiz servisi yok. Mikrofon yalnız isteğinle açılır. Konuşma/yazma değerlendirmesi öz değerlendirmedir; uygulama haricî AI hizmetine veri göndermez. Kopyalama düğmeleri istemi yalnız senin cevabınla hazırlar; paylaşıp paylaşmamak sana kalır. Cihazın ses motoru kendi platformunun ses hizmetini kullanabilir.</p><div class="row wrap spaced"><span class="small muted">Sürüm ${APP_VERSION} · <a href="#sources">Kaynaklar ve sınav biçimi</a></span><button class="btn small secondary" data-action="check-update">Güncellemeyi denetle</button></div><p class="small muted">Yeni sürüm yayımladığında uygulama onu arka planda indirir ve üstte “Güncelle” bildirimi gösterir; çalışman önce kaydedilir.</p></section>`;
}

// ── Shell ──────────────────────────────────────────────────────────────────

const LIVE_PAGES=new Set(['session','speak-run','pron']);
// Same step on the same screen ⇒ a re-render must not throw away what the learner typed or opened.
function viewKey(page,param){
  const s=state.session,r=state.speakingRun,g=state.grammarSession,p=param?state.lessonProgress[param]:null;
  if(page==='session')return `session:${s?.id}:${s?.index}`;
  if(page==='speak-run')return `run:${r?.id}:${r?.index}`;
  if(page==='lesson')return `lesson:${param}:${p?.layer}:${p?.screen}`;
  if(page==='greview')return `greview:${g?.index}`;
  if(page==='review')return `review:${state.reviewSession?.index}:${state.reviewSession?.revealed}`;
  return `${page}:${param||''}`;
}
const defaultOf=el=>el.tagName==='SELECT'?([...el.options].find(o=>o.defaultSelected)?.value??el.options[0]?.value??''):el.defaultValue;
function snapshotView(){
  const main=document.getElementById('main');if(!main)return null;
  const fields={};
  for(const el of main.querySelectorAll('textarea[id],input[id],select[id]')){if(['checkbox','radio','file'].includes(el.type))continue;fields[el.id]={value:el.value,initial:defaultOf(el)};}
  const active=document.activeElement;
  const focus=active&&active.id&&main.contains(active)?{id:active.id,start:active.selectionStart,end:active.selectionEnd}:null;
  return {fields,open:[...main.querySelectorAll('details')].map(d=>d.open),focus,scroll:window.scrollY};
}
function restoreView(keep){
  const main=document.getElementById('main');if(!main||!keep)return;
  for(const [id,field] of Object.entries(keep.fields)){
    const el=document.getElementById(id);
    // Only when the app itself did not change the field: its rendered default is the same as before.
    if(el&&!el.readOnly&&!el.disabled&&defaultOf(el)===field.initial&&el.value!==field.value)el.value=field.value;
  }
  const details=[...main.querySelectorAll('details')];
  if(details.length===keep.open.length)details.forEach((d,i)=>{if(keep.open[i]&&!d.open&&!d.classList.contains('module-block'))d.open=true;});
  if(keep.focus){const el=document.getElementById(keep.focus.id);if(el&&!el.disabled){el.focus({preventScroll:true});try{el.setSelectionRange(keep.focus.start,keep.focus.end);}catch{}}}
  if(Math.abs(window.scrollY-keep.scroll)>1)window.scrollTo(0,keep.scroll);
}
function hydrateSettings(){
  const node=document.getElementById('rec-usage');if(!node)return;
  listRecordings().then(async list=>{
    if(!node.isConnected)return;
    const mb=bytes=>(bytes/1048576).toFixed(1).replace('.',',');
    let total='';try{const est=await navigator.storage?.estimate?.();if(est?.usage)total=` · uygulamanın toplam kullanımı ${mb(est.usage)} MB`;}catch{}
    node.textContent=list.length?`${list.length} ses kaydı · ${mb(list.reduce((sum,r)=>sum+r.size,0))} MB${total}`:`Bu cihazda ses kaydı yok${total}`;
  }).catch(()=>{if(node.isConnected)node.textContent='Ses deposu açılamadı.';});
}
function render(){
  objectURLs.forEach(URL.revokeObjectURL);objectURLs=[];
  let [page,param]=route();
  if(page==='lesson'&&/^g\d{3}$/.test(param||'')){const code=legacyRedirect(param);if(code){location.replace(`#lesson/${code}`);return;}}
  if(page==='library'&&param==='priority'){ui.lessonFilter='priority';}
  if(activePage!==page&&LIVE_PAGES.has(activePage)){pauseTimer();stopSpeakingActivity(ctx);stopPlayback();cancelSpeech();}
  if(page==='lesson'&&activePage!=='lesson')ui.summaryQuiz={};
  if(page==='screen'&&activePage!=='screen')ui.screening=null;
  if(page!=='speak-run'&&page!=='pron')ui.micError='';
  activePage=page;
  const key=viewKey(page,param),keep=key===lastViewKey&&!freshRender?snapshotView():null;
  lastViewKey=key;freshRender=false;
  const active={'cw-guide':'practice',session:'practice',lesson:'library',screen:'library',greview:'library',review:'words',sources:'plan','speak-run':'speaking',pron:'speaking'}[page]||page;
  let body;
  if(page==='home')body=homeView();
  else if(page==='practice')body=practiceView(param);
  else if(page==='words')body=wordsView(param);
  else if(page==='review')body=reviewView();
  else if(page==='library')body=libraryView(ctx);
  else if(page==='lesson')body=lessonView(ctx,param);
  else if(page==='screen')body=screeningView(ctx,param);
  else if(page==='greview')body=grammarReviewView(ctx);
  else if(page==='speaking')body=speakingHubView(ctx);
  else if(page==='speak-run')body=runView(ctx);
  else if(page==='pron')body=pronunciationView(ctx,param);
  else if(page==='session')body=sessionView();
  else if(page==='plan')body=planView();
  else if(page==='sources')body=sourcesView();
  else if(page==='cw-guide')body=cwGuideView();
  else if(page==='settings')body=settingsView();
  else body=homeView();
  if(page==='settings'&&hasRecovery())body=`<div class="notice warn"><p>Önceki okunamayan kayıt için bir kurtarma kopyası bulunuyor.</p><button class="btn secondary small" data-action="recovery">Kurtarma kopyasını indir</button></div>`+body;
  const remaining=Math.max(0,daysUntil(state.profile.examDate));
  const navLabel=navItems.find(x=>x[0]===active)?.[2]||'Ayarlar';
  document.title=`Luma · ${navLabel}`;
  document.getElementById('app').innerHTML=`<div class="shell"><aside class="sidebar"><a href="#home" class="brand wordmark">luma<span class="mark" aria-hidden="true"></span></a><p class="brand-sub">KENDİ RİTMİNDE, İLERİYE.</p><nav class="side-nav" aria-label="Ana menü">${navItems.map(([id,ic,label])=>`<a href="#${id}" class="nav-link ${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${icon(ic)}${label}</a>`).join('')}</nav><div class="side-bottom"><div class="goal-tile"><span class="eyebrow">OCAK HEDEFİN</span><strong>${remaining} gün kaldı.</strong><p class="small muted">Kısa da olsa, bugün<br>kendine bir alan aç.</p></div><a href="#settings" class="nav-link ${page==='settings'?'active':''}">${icon('settings')} Ayarlar ve yedek</a><p class="small muted" style="padding:14px;font-size:10px">Sana ait bir çalışma alanı.<br>Verilerin bu cihazda.</p></div></aside><div class="workspace"><header class="topbar"><a class="mobile-brand wordmark" href="#home">luma<span class="mark" aria-hidden="true"></span></a><span class="breadcrumb">Kişisel alanın <span style="margin:0 12px;color:#b3b9aa">/</span> ${navLabel}</span><div class="top-actions"><span class="small muted online-status"><i class="status-dot"></i>${navigator.onLine?'Çalışmaya hazır':'Çevrimdışı'}</span><a class="pill" href="#sources" style="text-decoration:none">TOEFL® · 2026</a><a href="#settings" class="avatar" aria-label="Profil ve ayarlar">${icon('user')}</a></div></header>${ui.updateReady?`<div class="update-bar" role="status"><span>Yeni sürüm hazır. Çalışman kaydedilip uygulama yenilenir.</span><button class="btn small" data-action="apply-update">Güncelle</button></div>`:''}${storageWarning()?`<div class="save-error" role="alert">${e(storageWarning())}</div>`:''}<main class="content" id="main" tabindex="-1">${body}<footer class="footer">Luma bağımsız bir çalışma aracıdır; ETS tarafından onaylanmış değildir. TOEFL®, ETS'nin markasıdır.<br><a href="#sources">Özgün içerikler ve kaynaklar</a> · Öğrenme verileri resmî sınav puanı değildir.</footer></main></div><nav class="bottom-nav" aria-label="Mobil ana menü">${navItems.map(([id,ic,,short])=>`<a href="#${id}" class="bottom-link ${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${icon(ic)}<span>${short}</span></a>`).join('')}</nav></div>`;
  restoreView(keep);
  hydrateAudio();
  if(page==='settings')hydrateSettings();
  if(page==='plan'&&param==='log'&&!keep)document.getElementById('exam-log')?.scrollIntoView({block:'start'});
}

// ── Session behaviour ──────────────────────────────────────────────────────

function beginSession(options={},onlyItem=null){
  if(isBusy()){toast('Önce ses kaydını durdur ve saklanmasını bekle.');return;}
  const opt={skill:'all',taskType:'all',...options};
  const current=state.session?.options||{};
  // The same set is already open: continue it instead of rebuilding it.
  if(!onlyItem&&hasSession()&&!current.retry&&(current.skill??'all')===opt.skill&&(current.taskType??'all')===opt.taskType){go('session');return;}
  if(hasSession()&&!window.confirm(`Yarım kalan “${sessionScopeLabel(current)}” setini kapatıp yenisini açmak istiyor musun? Verdiğin cevaplar kayıtlı kalır.`))return;
  const info=onlyItem?null:buildSet(exercises,state.attempts,opt);
  const items=onlyItem?[].concat(onlyItem):info.items;
  if(!items.length){toast('Bu sette soru yok.');return;}
  if(info?.repeat)opt.repeat=true;
  pauseTimer();stopRecording();
  // A repeat round starts clean; an unsolved item keeps any half-written draft.
  if(onlyItem||info.repeat)items.forEach(item=>{delete state.drafts[item.id];});
  state.session=createSession(items,opt);persist();go('session');
}
function reviewStart(id){
  const rs=state.reviewSession;
  if(id){startStudy(`one:${id}`);return;}
  if(rs&&rs.index<rs.itemIds.length){go('review');return;}
  startStudy('all:due');
}
function checkAnswer(){
  const item=currentItem();if(!item||state.session.answers[item.id])return;
  const d=draft(item),err=document.getElementById('answer-error');
  const fail=message=>{err.textContent=message;};
  if(item.type==='mcq'&&!Number.isInteger(d.response))return fail('Önce bir seçenek seç.');
  if(item.type==='gaps'&&(!Array.isArray(d.response)||item.gaps.some((_,i)=>!String(d.response[i]||'').trim())))return fail('Önce bütün eksik sözcükleri tamamla.');
  if(item.type==='order'&&d.order?.length!==item.tokens.length)return fail('Cümleyi bütün sözcükleri kullanarak tamamla.');
  const self=['writing','speaking'].includes(item.type);
  if(item.type==='writing'&&!String(d.response||'').trim())return fail('Önce bir yanıt yaz.');
  if(item.type==='speaking'&&!d.recordingId&&!String(d.response||'').trim())return fail('Önce bir ses kaydı al veya sesli denemen hakkında kısa bir not yaz.');
  if(self&&!Number.isInteger(d.selfRating))return fail('Kontrol listesini inceleyip kendi değerlendirmenden bir seçenek işaretle.');
  if(isBusy())return fail('Kaydı önce durdurup kaydedilmesini bekle.');
  if(item.type==='gaps')d.mode=cwMode(d);
  const result=gradeAnswer(item,d.response);
  const attempt={id:`${state.session.id}:${item.id}`,itemId:item.id,skill:item.skill,taskType:item.taskType,level:item.level,at:new Date().toISOString(),correct:result.correct,score:result.score,selfAssessed:self,selfRating:d.selfRating??null,response:d.response??'',recordingId:d.recordingId||'',assisted:!!d.transcriptViewed||!!d.modelViewed||(item.type==='gaps'&&(cwMode(d)==='easy'||Object.keys(d.hints||{}).length>0)),feedback:result.feedback};
  state.session.answers[item.id]=attempt;
  if(!state.attempts.some(a=>a.id===attempt.id))state.attempts.push(attempt);
  // Wrong answer-keyed items come back on a different day; a later correct answer pushes them further out.
  if(!self){const next=noteItemResult(state.itemReviews[item.id],result.correct===true,new Date(),{assisted:attempt.assisted});if(next)state.itemReviews[item.id]=next;}
  ctx.activity(item.skill);
  pauseTimer();persist();render();document.querySelector('.feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function sessionRecord(){
  const item=currentItem();if(!item||isBusy())return;
  const sessionId=state.session.id;
  startRecording({id:`${sessionId}:${item.id}`,itemId:item.id,maxSeconds:90,
    onStart:()=>ctx.renderIf('session'),
    onSaved:id=>{if(state.session?.id===sessionId)state.drafts[item.id]={...(state.drafts[item.id]||{}),recordingId:id};persist();toast('Ses kaydın bu cihaza kaydedildi.');},
    onError:message=>{const err=document.getElementById('record-error');if(err)err.textContent=message;else toast(message);},
    onDone:()=>ctx.renderIf('session')});
}
async function hydrateAudio(){
  for(const el of document.querySelectorAll('[data-recording-id]')){
    try{const r=await getRecording(el.dataset.recordingId);if(r&&el.isConnected){const url=URL.createObjectURL(r.blob);objectURLs.push(url);el.src=url;}else if(el.isConnected){el.replaceWith(Object.assign(document.createElement('p'),{className:'small muted',textContent:'Bu ses kaydı bu cihazda bulunamadı. Sesler ilerleme yedeğine dahil değildir.'}));}}
    catch{if(el.isConnected)el.replaceWith(Object.assign(document.createElement('p'),{className:'small muted',textContent:'Ses deposu açılamadı.'}));}
  }
}
function pauseTimer(){
  const item=currentItem();if(!item)return;
  const d=draft(item);if(!d.timerStartedAt)return;
  d.timerSeconds=Math.max(0,(d.timerSeconds??item.practiceSeconds??taskMeta(item)?.practiceSeconds??120)-(Date.now()-d.timerStartedAt)/1000);d.timerStartedAt=null;persist();
}
function toggleTimer(){const item=currentItem();if(!item)return;const d=draft(item);if(d.timerStartedAt)pauseTimer();else{if(!d.timerSeconds)d.timerSeconds=item.practiceSeconds||taskMeta(item)?.practiceSeconds||120;d.timerStartedAt=Date.now();persist();}render();}
setInterval(()=>{
  if(activePage!=='session')return;const item=currentItem();if(!item)return;const d=draft(item);if(!d.timerStartedAt)return;
  const remaining=(d.timerSeconds||0)-(Date.now()-d.timerStartedAt)/1000;const el=document.getElementById('timer');if(el)el.textContent=formatTime(remaining);
  if(remaining>0&&Date.now()-d.timerStartedAt>=5000){d.timerSeconds=remaining;d.timerStartedAt=Date.now();persist();}
  if(remaining<=0){pauseTimer();toast('Pratik süresi doldu. Yanıtını tamamlamaya devam edebilirsin.');render();}
},500);
setInterval(()=>{if(activePage==='speak-run'||activePage==='pron')speakingTick(ctx);},250);

// ── Events ─────────────────────────────────────────────────────────────────

document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action,id=button.dataset.id,value=button.dataset.value;
  // Saving a file must start inside the tap itself so the phone's share sheet is allowed to open.
  if(action==='export'){backupNow();return;}
  if(action==='confirm-import'){confirmImport();return;}
  if(handleGrammarAction(ctx,action,button))return;
  if(await handleSpeakingAction(ctx,action,button))return;
  if(action==='say')speak(button.dataset.say,{rate:Number(button.dataset.rate)||ui.speed,onError:toast});
  else if(action==='start-set'||action==='start-skill')beginSession({skill:value||'all',taskType:button.dataset.task||'all'});
  else if(action==='resume')go('session');
  else if(action==='skill'){ui.skill=value;go('practice');}
  else if(action==='task'){const t=TASK_TYPES.find(x=>x.id===id);beginSession({skill:t.skill,taskType:id});}
  else if(action==='retry-item')beginSession({retry:true},exercises.find(x=>x.id===id));
  else if(action==='retry-due'){const items=dueMistakeItems().slice(0,12);if(items.length)beginSession({retry:true},items);else toast('Bugün yeniden denenecek soru yok.');}
  else if(action==='option'){draft().response=Number(value);persist();render();}
  else if(action==='add-token'){const d=draft(),item=currentItem();d.order||=[];d.order.push(Number(value));d.response=d.order.map(i=>item.tokens[i]).join(' ');persist();render();}
  else if(action==='remove-token'){const d=draft(),item=currentItem();d.order.splice(Number(value),1);d.response=d.order.map(i=>item.tokens[i]).join(' ');persist();render();}
  else if(action==='check')checkAnswer();
  else if(action==='cw-mode'){const d=draft();if(Object.keys(d.hints||{}).length&&value==='exam'){toast('Bu metinde ipucu aldın; sınav modu bir sonraki metinde geçerli olur.');}ui.cwMode=value;d.mode=value;rememberPrefs();persist();render();}
  else if(action==='cw-hint'){
    const item=currentItem(),d=draft(item),i=Number(button.dataset.gap),gap=item?.gaps[i];if(!gap)return;
    d.hints={...(d.hints||{}),[i]:((d.hints||{})[i]||0)+1};
    let level=d.hints[i];if(level===2&&!item.gapsTr?.[i])level=d.hints[i]=3;
    if(level>=3){const shown=cwMode(d)==='easy'?easyReveal(gap.answer):'';const letters=gap.answer.slice(0,Math.min(gap.answer.length,shown.length+level-2));d.response||=[];d.response[i]=letters;const input=document.querySelector(`.gap-input[data-gap="${i}"]`);if(input)input.value=letters.slice(shown.length);}
    persist();const box=document.getElementById('cw-hint');if(box)box.innerHTML=hintPanel(item,i);
  }
  else if(action==='next'){pauseTimer();cancelSpeech();state.session.index++;if(state.session.index>=state.session.itemIds.length)state.session.completedAt=new Date().toISOString();persist();render();window.scrollTo(0,0);}
  else if(action==='listen')speak(currentItem().audioText,{rate:ui.speed,onError:toast});
  else if(action==='transcript'){draft().showTranscript=!draft().showTranscript;draft().transcriptViewed=true;persist();render();}
  else if(action==='self-rate'){draft().selfRating=Number(value);persist();render();}
  else if(action==='timer')toggleTimer();
  else if(action==='record')sessionRecord();
  else if(action==='stop-recording'){stopRecording();render();}
  else if(action==='session-compare'){const item=currentItem();const v=document.getElementById('session-dictation')?.value||'';const box=document.getElementById('session-diff');if(box&&item){ui.sessionDiff={itemId:item.id,html:v.trim()?dictationDiff(compareDictation(item.audioText,v)):'<p class="small">Önce cümleyi söyle veya yaz.</p>'};box.innerHTML=ui.sessionDiff.html;}}
  else if(action==='copy-writing'){const item=currentItem();const d=draft(item);await copyText(String(d.response||'').trim()?PROMPTS.writing(taskMeta(item)?.label||item.taskType,item.prompt,d.response,state.session.options.timed?'Görev sayacıyla; örnek cevaba bakmadan':'Süresiz; örnek cevaba bakmadan'):'');}
  else if(action==='copy-prompt'){await copyText(copyPromptText(ctx,button.dataset.kind));}
  else if(action==='download-recording'){try{const r=await getRecording(id);if(!r)return toast('Bu ses kaydı bu cihazda bulunamadı.');await saveFile(r.blob,`luma-speaking-${r.createdAt.slice(0,10)}.${r.blob.type.includes('mp4')?'m4a':'webm'}`);}catch{toast('Ses kaydı okunamadı.');}}
  else if(action==='review')reviewStart();
  else if(action==='review-word')reviewStart(id);
  else if(action==='study')startStudy(button.dataset.scope);
  else if(action==='pick-word'){
    const rs=state.reviewSession,card=rs&&cardById.get(rs.itemIds[rs.index]);if(!card||rs.revealed)return;
    const choice=Number(value),ok=choice===quizFor(card).answer;
    state.reviews[card.id]=scheduleReview(state.reviews[card.id],ok?'good':'again');
    rs.pick=choice;rs.revealed=true;rs[ok?'right':'wrong']=(rs[ok?'right':'wrong']??0)+1;
    ctx.activity('vocab');persist();render();
    if(!card.isPhrase&&ok)speak(card.word,{rate:ui.speed});
  }
  else if(action==='next-word'){const rs=state.reviewSession;if(!rs)return;rs.index++;rs.revealed=false;delete rs.pick;persist();render();window.scrollTo(0,0);}
  else if(action==='learned-toggle')toggleLearned(id);
  else if(action==='word-level'){ui.wordLevel=value;ui.wordLimit=40;render();}
  else if(action==='phrase-level'){ui.phraseLevel=value;render();}
  else if(action==='word-more'){ui.wordLimit+=60;const box=document.getElementById('word-results');if(box)box.innerHTML=wordResults();}
  else if(action==='recovery')exportRecovery();
  else if(action==='voice-test')speak('Office hours are on Tuesdays and Thursdays. Could you tell me where the library is?',{rate:ui.speed,onError:toast});
  else if(action==='check-update'){if(!swRegistration)toast('Çevrimdışı kip bu adreste kapalı; yayındaki adreste denetlenir.');else{try{await swRegistration.update();toast(swRegistration.waiting||swRegistration.installing?'Yeni sürüm bulundu; hazır olunca üstte bildirim çıkar.':'Uygulama güncel.');}catch{toast('Denetlenemedi. İnternet bağlantını kontrol et.');}}}
  else if(action==='apply-update'){persist();updateRequested=true;const waiting=swRegistration?.waiting;if(waiting)waiting.postMessage('skip-waiting');else location.reload();}
  else if(action==='exam-delete'){if(window.confirm('Bu deneme sonucu silinsin mi?')){state.examLog=state.examLog.filter(x=>x.id!==id);persist();render();}}
  else if(action==='rec-clean'){
    const days=Number(button.dataset.days)||0;
    if(!window.confirm(days?`${days} günden eski ses kayıtları bu cihazdan silinsin mi? Bu işlem geri alınamaz.`:'Bu cihazdaki bütün ses kayıtları silinsin mi? Bu işlem geri alınamaz.'))return;
    try{const limit=Date.now()-days*86400000;const old=(await listRecordings()).filter(r=>!days||new Date(r.createdAt).getTime()<limit);await deleteRecordings(old.map(r=>r.id));toast(old.length?`${old.length} ses kaydı silindi.`:'Silinecek kayıt yok.');render();}
    catch{toast('Ses kayıtları silinemedi.');}
  }
  else if(action==='cancel-import'){pendingImport=null;pendingDropped='';render();}
});
function toggleLearned(id){
  if(!cardById.has(id))return;
  state.learned=state.learned.includes(id)?state.learned.filter(x=>x!==id):[...state.learned,id];
  persist();render();
}
async function confirmImport(){
  const incoming=pendingImport;if(!incoming)return;
  const saved=await exportProgress(state);
  if(!saved){toast('Mevcut yedek kaydedilmediği için geri yükleme yapılmadı.');return;}
  if(saveState(incoming)){state=incoming;pendingImport=null;pendingDropped='';freshRender=true;render();toast('Mevcut yedek kaydedildi ve seçtiğin yedek geri yüklendi.');}else toast(storageWarning());
}
document.addEventListener('input',event=>{
  const el=event.target;
  if(handleGrammarInput(ctx,el))return;
  if(handleSpeakingInput(ctx,el))return;
  if(el.id==='word-search'){ui.wordQuery=el.value;ui.wordLimit=40;document.getElementById('word-results').innerHTML=wordResults();}
  else if(el.id==='writing-response'||el.id==='speaking-note'){draft().response=el.value;const writing=el.id==='writing-response';if(writing)document.getElementById('word-count').textContent=`${countWords(el.value)} kelime`;persistSoon(()=>{const status=document.getElementById('draft-status');if(writing&&status)status.textContent=storageWarning()||'Taslak kaydedildi.';});}
  else if(el.hasAttribute('data-gap')){const d=draft();d.response||=[];d.response[Number(el.dataset.gap)]=(el.dataset.shown||'')+el.value;persistSoon();}
});
document.addEventListener('change',async event=>{
  const el=event.target;
  if(handleSpeakingChange(ctx,el))return;
  if(el.id==='learned-box')toggleLearned(el.dataset.id);
  else if(el.id==='voice-select'){ui.voice=el.value;setPreferredVoice(ui.voice);rememberPrefs();}
  else if(el.id==='voice-speed'){ui.speed=Number(el.value);rememberPrefs();}
  else if(el.id==='exam-type'){ui.examType=el.value==='estimate'?'estimate':'raw';render();}
  else if(el.id==='audio-speed'){ui.speed=Number(el.value);rememberPrefs();}
  else if(el.id==='import-file'){
    const file=el.files[0];if(!file)return;
    if(file.size>MAX_BACKUP_BYTES){toast('Yedek dosyası 20 MB sınırını aşıyor.');return;}
    const text=await file.text();
    try{pendingImport=validateBackup(text);pendingDropped='';render();}
    catch(error){
      try{const salvaged=salvageBackup(text);pendingImport=salvaged.state;pendingDropped=salvageSummary(salvaged.dropped)||'bozuk alanlar';render();}
      catch{toast(`Yedek yüklenmedi: ${error.message}`);el.value='';}
    }
  }
});
document.addEventListener('submit',event=>{
  if(event.target.id==='exam-form'){
    event.preventDefault();
    try{const entry=createExamEntry(Object.fromEntries(new FormData(event.target)));state.examLog=[...state.examLog,entry];const saved=persist();ui.examType='raw';freshRender=true;render();if(saved)toast('Deneme sonucu kaydedildi.');}
    catch(error){const node=document.getElementById('exam-error');if(node)node.textContent=error.message;}
    return;
  }
  if(event.target.id!=='settings-form')return;event.preventDefault();
  const form=new FormData(event.target);
  try{const profile={...state.profile,examDate:form.get('examDate'),startDate:form.get('startDate'),targetBand:form.get('targetBand')};const candidate=validateBackup({...state,profile});state=candidate;const saved=persist();freshRender=true;render();if(saved)toast('Hedefin ve başlangıç tarihin kaydedildi.');}
  catch(error){toast(error.message);}
});
document.addEventListener('focusin',event=>{const el=event.target;if(!el.classList?.contains('gap-input'))return;const box=document.getElementById('cw-hint'),item=currentItem();if(box&&item)box.innerHTML=hintPanel(item,Number(el.dataset.gap));});
document.addEventListener('toggle',event=>{if(handleGrammarToggle(ctx,event.target))return;if(event.target.tagName==='DETAILS'&&event.target.open&&activePage==='session'&&event.target.querySelector('.model')){draft().modelViewed=true;persist();}},true);
window.addEventListener('hashchange',()=>{render();if(location.hash!=='#plan/log')window.scrollTo(0,0);document.getElementById('main')?.focus({preventScroll:true});});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseTimer();stopSpeakingActivity(ctx);stopPlayback();cancelSpeech();persist();}else{if(LIVE_PAGES.has(activePage)||activePage==='home')render();if(swRegistration&&Date.now()-lastUpdateCheck>1800000){lastUpdateCheck=Date.now();swRegistration.update().catch(()=>{});}}});
window.addEventListener('pagehide',()=>{pauseTimer();stopRecording();persist();});
window.addEventListener('online',()=>toast('Bağlantı geri geldi.'));
window.addEventListener('offline',()=>toast('Çevrimdışısın. İndirilen metin çalışmalarına devam edebilirsin.'));
if('speechSynthesis' in window){speechSynthesis.getVoices();try{speechSynthesis.addEventListener('voiceschanged',()=>ctx.renderIf('settings'));}catch{}}
const localDevelopment=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const enableOffline=!localDevelopment||new URLSearchParams(location.search).get('offline')==='1';
let swRegistration=null,updateRequested=false,lastUpdateCheck=Date.now();
// A new version waits until the learner taps "Güncelle": work is saved first, then HTML, JS and content switch together.
function watchWorker(worker){if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){ui.updateReady=true;render();}});}
if('serviceWorker' in navigator&&enableOffline){navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updateRequested)location.reload();});navigator.serviceWorker.register('./sw.js').then(reg=>{swRegistration=reg;if(reg.waiting&&navigator.serviceWorker.controller){ui.updateReady=true;render();}watchWorker(reg.installing);reg.addEventListener('updatefound',()=>watchWorker(reg.installing));if(globalThis.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone)navigator.storage?.persist?.().catch(()=>{});return navigator.serviceWorker.ready;}).then(()=>{if(!sessionStorage.getItem('luma-offline-ready')){sessionStorage.setItem('luma-offline-ready','1');toast('Uygulama dosyaları çevrimdışı çalışma için hazır.');}}).catch(()=>toast('Çevrimdışı hazırlık tamamlanamadı. Bağlantını kontrol edip sayfayı yenile.'));}
render();
