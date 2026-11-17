import { createSession, selectExercises, gradeAnswer, skillStats, scheduleReview, dueVocabulary, daysUntil, planWeek, validateBackup, salvageBackup, salvageSummary, MAX_BACKUP_BYTES, logActivity, weeklySummary, recommendNext, dueGrammarCodes, compareDictation, WEEKLY_SPEAKING_TARGET, noteItemResult, dueReviewKeys, createExamEntry, comparableExamEntry, EXAM_SOURCES, EXAM_SECTIONS, EXAM_ATTEMPTS, EXAM_CONDITIONS, EXAM_VALUE_TYPES, EXAM_TEXT_LIMITS, todayKey } from './core.js';
import { loadState, saveState, storageWarning, getRecording, downloadBlob, exportProgress, hasRecovery, exportRecovery, saveFile, lastBackupAt, listRecordings, deleteRecordings, loadPrefs, savePrefs } from './storage.js';
import { exercises, TASK_TYPES, EXAM_SPEC } from './data/content.js';
import { vocabulary, CONTENT_META } from './data/library.js';
import { LESSONS, LESSON_BY_CODE, lessonsForTags } from './data/grammar.js';
import { PHRASES, PHRASE_FUNCTIONS, REPEAT_SETS, INTERVIEW_SETS, PRONUNCIATION, PROMPTS, SET_BY_ID } from './data/speaking.js';
import { e, icon, SKILLS as skills, head, LEVELS, dateLabel, formatTime, countWords, shortDate, dictationDiff } from './ui.js';
import { speak, cancelSpeech, startRecording, stopRecording, isBusy, stopPlayback, setPreferredVoice, listVoices } from './media.js';
import { libraryView, lessonView, screeningView, grammarReviewView, handleGrammarAction, handleGrammarInput, handleGrammarToggle, legacyRedirect } from './views/grammar.js';
import { speakingHubView, runView, pronunciationView, handleSpeakingAction, handleSpeakingChange, handleSpeakingInput, speakingTick, stopSpeakingActivity, copyPromptText } from './views/speaking.js';

const APP_VERSION = '0.4.0';
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
const allCards = [...vocabulary, ...phraseCards];
const cardById = new Map(allCards.map(c => [c.id, c]));

let state = loadState();
const ui = {minutes:15,quiet:false,skill:'all',level:'all',timed:false,wordLevel:'all',wordQuery:'',wordDeck:'words',reviewQueue:[],reviewIndex:0,reviewRevealed:false,speed:1,
  lessonQuery:'',lessonFilter:'all',summaryQuiz:{},screening:null,openModules:new Set([2,5]),
  speakMode:'learn',phase:null,countdown:null,micError:'',autoRecord:true,showText:{},dictation:{},pronRecorded:{},rehearsalTheme:INTERVIEW_SETS[0].id};
// Device preferences (not part of the progress backup): chosen voice, speed, session length, speaking mode.
const prefs=loadPrefs();
for(const key of ['minutes','speed','timed','speakMode','autoRecord'])if(typeof prefs[key]===typeof ui[key])ui[key]=prefs[key];
if(![0,15,30,60].includes(ui.minutes))ui.minutes=15;
if(![.8,1,1.2].includes(ui.speed))ui.speed=1;
if(!['learn','rehearsal'].includes(ui.speakMode))ui.speakMode='learn';
ui.voice=typeof prefs.voice==='string'?prefs.voice:'';ui.examType='raw';ui.updateReady=false;ui.sessionDiff=null;
setPreferredVoice(ui.voice);
function rememberPrefs(){savePrefs({minutes:ui.minutes,speed:ui.speed,timed:ui.timed,speakMode:ui.speakMode,autoRecord:ui.autoRecord,voice:ui.voice});}
let toastTimeout, objectURLs = [], activePage = '', pendingImport = null, pendingDropped = '', persistTimer = null, lastViewKey = '', freshRender = false;
if(state.reviewSession){ui.reviewQueue=state.reviewSession.itemIds;ui.reviewIndex=state.reviewSession.index;ui.reviewRevealed=state.reviewSession.revealed;}
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
function saveReviewSession(){state.reviewSession={itemIds:[...ui.reviewQueue],index:ui.reviewIndex,revealed:ui.reviewRevealed};persist();}
function currentItem(){return state.session&&exercises.find(x=>x.id===state.session.itemIds[state.session.index]);}
function draft(item=currentItem()){if(!item)return {};return state.drafts[item.id]||={};}
function hasSession(){return state.session&&!state.session.completedAt&&state.session.index<state.session.itemIds.length;}
function durationLabel(minutes){return minutes?`${minutes} dk`:'Serbest';}
function dueCards(){return dueVocabulary(allCards,state.reviews).due;}
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
function durationPicker(){return `<div class="duration-picker">${[15,30,60,0].map(n=>`<button class="duration ${ui.minutes===n?'active':''}" data-action="duration" data-value="${n}" aria-pressed="${ui.minutes===n}">${n||'∞'}<small>${n?'dakika':'serbest'}</small></button>`).join('')}</div>`;}
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
  else if(rec.kind==='speaking'){const short=ui.minutes&&ui.minutes<=15;const set=leastPracticed(short?REPEAT_SETS:INTERVIEW_SETS);title=short?`Kısa konuşma: ${set.title} · Listen and Repeat`:`Mülakat provası: ${set.title}`;detail=`Bu hafta ${week.speakingDays}/${WEEKLY_SPEAKING_TARGET} konuşma günü. ${short?'7 cümle, öğrenme modunda gölgeleme ve dikte kontrolü.':'4 soru, 45 saniyelik yapı ve kendi kaydını inceleme.'}`;button=`<button class="btn" data-action="sp-start" data-set="${e(set.id)}">Başla ${icon('arrow')}</button>`;}
  else if(rec.kind==='lesson'){const lesson=LESSON_BY_CODE.get(rec.code);title=`Hatandan gelen ders: ${lesson.code} ${lesson.title}`;detail=lesson.full?'Tam anlatım: 5 kısa ekran ve alıştırma.':'Özet: tek ekranlık hatırlatma ve kontrol sorusu.';button=`<a class="btn" href="#lesson/${e(lesson.code)}">Dersi aç ${icon('arrow')}</a>`;}
  else {const skill=rec.skill==='all'?null:skills[rec.skill];title=skill?`Bu hafta ${skill.tr} ile henüz çalışmadın.`:'Dört beceriden karışık bir set.';detail='Yeni sorular ve az çalışılan beceriler öncelik kazanır. Beceriyi veya zorluğu değiştirebilirsin.';button=`<button class="btn" data-action="start-skill" data-value="${e(rec.skill)}">Seti başlat ${icon('arrow')}</button>`;}
  return `<section class="card reco-card"><span class="eyebrow muted">ÖNERİLEN TEK ADIM</span><h2>${e(title)}</h2><p class="small">${e(detail)}</p><div class="row wrap">${button}<a class="text-button" href="#practice">Başka bir şey seç ${icon('arrow')}</a></div></section>`;
}
function homeView(){
  const resume=resumeItems();
  const remaining=Math.max(0,daysUntil(state.profile.examDate));
  const dayIndex=Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000);
  const word=vocabulary[dayIndex%vocabulary.length];
  const phrase=PHRASES[dayIndex%PHRASES.length];
  return `${head('Her gün, biraz daha ileri.',`${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})} · Hedef tarihe ${remaining} gün`)}
  <div class="today-grid"><div class="today-main">
  ${backupNotice()}${resume.length?`<section class="card resume-card"><span class="eyebrow muted">KALDIĞIN YER</span><div class="resume-list">${resume.map(r=>`<a class="resume-row" ${r.attr}><span><strong>${e(r.label)}</strong><small>${e(r.detail)}</small></span>${icon('arrow')}</a>`).join('')}</div></section>`:''}
  ${recommendationCard()}
  <section class="card session-setup"><span class="eyebrow muted">BUGÜN NE KADAR VAKTİN VAR?</span><h3>Bir pencere aç.</h3><p>Süre bir öneri. Görev sayacı seni oturumdan çıkarmaz.</p>${durationPicker()}<label class="quiet-toggle"><input type="checkbox" id="quiet" ${ui.quiet?'checked':''}> Sessiz çalışacağım</label><button class="btn secondary wide" data-action="start">Bana bir oturum hazırla ${icon('arrow')}</button></section>
  </div><div class="today-side">${weekPanel()}
  <section class="card word-spot"><div class="row between"><span class="eyebrow muted">BUGÜNÜN KELİMESİ</span><span class="badge">${e(word.level)}</span></div><div class="row between"><p class="word" lang="en">${e(word.word)}</p><button class="icon-button" data-action="say" data-say="${e(word.word)}" aria-label="Kelimeyi dinle">${icon('sound')}</button></div><p class="small">${e(word.meaning)}</p><p class="example" lang="en">${e(word.example)}</p></section>
  <section class="card word-spot"><div class="row between"><span class="eyebrow muted">BUGÜNÜN İFADESİ</span><span class="badge">${e(PHRASE_FUNCTIONS[phrase.function])}</span></div><div class="row between"><p class="word phrase" lang="en">${e(phrase.phrase)}</p><button class="icon-button" data-action="say" data-say="${e(phrase.example)}" aria-label="Örneği dinle">${icon('sound')}</button></div><p class="small">${e(phrase.tr)}</p><p class="example" lang="en">${e(phrase.example)}</p></section>
  </div></div>
  <div class="section-title"><h2>Becerilerin, ayrı ayrı.</h2><a class="text-button" href="#plan">Ölçümleri gör ${icon('arrow')}</a></div>${skillCards()}`;
}

// ── Çalış ──────────────────────────────────────────────────────────────────

function practiceView(selectedSkill){
  if(selectedSkill&&(skills[selectedSkill]||selectedSkill==='all'))ui.skill=selectedSkill;
  const filtered=TASK_TYPES.filter(t=>ui.skill==='all'||t.skill===ui.skill);
  return `${head('Bir beceri seç. Derinleş.','Yeni TOEFL görevleriyle, ihtiyacın olan yerden çalış.')}
  ${hasSession()?`<div class="notice row between wrap"><span>Yarım kalan bir oturumun var. İlerlemen kayıtlı.</span><button class="text-button" data-action="resume">Devam et ${icon('arrow')}</button></div>`:''}
  <div class="filter-row">${[['all','Tüm beceriler'],...Object.entries(skills).map(([k,v])=>[k,v.name])].map(([k,v])=>`<button class="chip ${ui.skill===k?'active':''}" data-action="skill" data-value="${k}" aria-pressed="${ui.skill===k}">${v}</button>`).join('')}</div>
  ${ui.skill==='speaking'?`<div class="notice row between wrap"><span>7 cümlelik Listen and Repeat ve 4 soruluk Interview prova setleri, telaffuz dersleri ve dikte kontrolü <strong>Konuşma</strong> bölümünde.</span><a class="text-button" href="#speaking">Konuşmaya git ${icon('arrow')}</a></div>`:''}
  <section class="card"><div class="form-grid"><label class="field">İçerik düzeyi<select id="practice-level"><option value="all">Karışık · tüm düzeyler açık</option>${LEVELS.map(l=>`<option ${ui.level===l?'selected':''}>${l}</option>`).join('')}</select><small>Etiketler içerik zorluğunu anlatır; resmî seviye ölçümü değildir.</small></label><div><span class="field">Oturum önerisi</span>${durationPicker()}</div></div><div class="row between wrap"><label class="quiet-toggle"><input id="timed" type="checkbox" ${ui.timed?'checked':''}> Görev sayacı göster</label><button class="btn" data-action="start-filtered">Karışık seti başlat ${icon('arrow')}</button></div></section>
  <div class="section-title"><h2>Görev atölyeleri</h2><span class="small muted">${filtered.length} görev türü</span></div><div class="task-grid">${filtered.map(t=>`<button class="task-tile" data-action="task" data-id="${e(t.id)}"><span class="badge ${t.skill}">${skills[t.skill].name}</span><h3 lang="en">${e(t.label)}</h3><p>${e(t.description)}</p><div class="row between"><span>${exercises.filter(x=>x.taskType===t.id).length} özgün pratik</span>${icon('arrow')}</div></button>`).join('')}</div><p class="bank-count">${exercises.length} özgün başlangıç alıştırması. Bunlar kısa öğretici pratiklerdir; ETS'nin kalibre edilmiş tam sınavı değildir.</p>`;
}

// ── Kelimeler ve ifadeler ──────────────────────────────────────────────────

function wordsView(param){
  if(param==='phrases')ui.wordDeck='phrases';else if(param==='words')ui.wordDeck='words';
  const due=dueCards();
  const phrasesMode=ui.wordDeck==='phrases';
  const deck=phrasesMode?phraseCards:vocabulary;
  const unseen=dueVocabulary(deck,state.reviews).new;
  return `${head(phrasesMode?'İfadeyi bil. Cümlende kullan.':'Kelimeyi tanı. Bağlamda kullan.',phrasesMode?'Konuşmada görüş, örnek, neden, karşılaştırma ve toparlama kalıpları.':'Akademik İngilizce, kampüs yaşamı ve doğal tamlamalar.')}
  <div class="layer-tabs"><a class="layer-tab ${!phrasesMode?'active':''}" href="#words/words">Kelimeler · ${vocabulary.length}</a><a class="layer-tab ${phrasesMode?'active':''}" href="#words/phrases">İfade bankası · ${PHRASES.length}</a></div>
  <section class="card row between wrap spaced"><div><h3>${due.length?`${due.length} kart seni yeniden bekliyor.`:'Bir sonraki kartınla tanış.'}</h3><p class="small muted">${Object.keys(state.reviews).length} kart çalışıldı · bu destede ${unseen.length} yeni kart</p></div><div class="row wrap">${due.length?`<button class="btn" data-action="review">Tekrarı başlat ${icon('arrow')}</button>`:''}<button class="btn ${due.length?'secondary':''}" data-action="review-deck" data-value="${phrasesMode?'phrases':'words'}">${phrasesMode?'Yeni ifadelerle çalış':'Yeni kelimelerle çalış'}</button></div></section>
  ${phrasesMode?phraseList():`<div class="section-title"><h2>Kelime kütüphanen</h2><span class="small muted">${vocabulary.length} kart</span></div><label class="search">${icon('search')}<input id="word-search" type="search" aria-label="Kelime veya Türkçe anlam ara" placeholder="Kelime, anlam veya tamlama ara…" value="${e(ui.wordQuery)}"></label>
  <div class="filter-row">${['all',...LEVELS].map(l=>`<button class="chip ${ui.wordLevel===l?'active':''}" data-action="word-level" data-value="${l}">${l==='all'?'Tümü':l}</button>`).join('')}</div><div class="vocab-list" id="word-results">${wordResults()}</div>`}
  <p class="small muted spaced">Kart görmek veya kuyruğa eklemek öğrenme göstergesi sayılmaz. Yeni kart miktarını tekrarlara yetişebildiğin kadar artır.</p>`;
}
function phraseList(){
  return `<p class="small muted spaced">Kalıplar ezber cevap değildir; her cevapta bir-iki tanesi yeterlidir. Aşırı kalıp doğallığı düşürür.</p>${Object.entries(PHRASE_FUNCTIONS).map(([fn,label])=>`<div class="section-title"><h2>${e(label)}</h2></div><div class="vocab-list">${PHRASES.filter(p=>p.function===fn).map(p=>`<article class="card vocab-item"><div class="row between"><h3 lang="en">${e(p.phrase)}</h3><span class="badge">${p.register==='speech'?'konuşma':'konuşma + yazı'}</span></div><p>${e(p.tr)}</p><p class="example" lang="en">${e(p.example)}</p><div class="word-actions"><span class="small muted">${state.reviews[p.id]?'Tekrar planında':'Yeni'}</span><div class="row gap8"><button class="icon-button" data-action="say" data-say="${e(p.example)}" aria-label="Örneği dinle">${icon('sound')}</button><button class="btn small soft" data-action="review-word" data-id="${e(p.id)}">Çalış</button></div></div></article>`).join('')}</div>`).join('')}`;
}
function wordResults(){
  const query=ui.wordQuery.toLocaleLowerCase('tr');
  const items=vocabulary.filter(w=>(ui.wordLevel==='all'||w.level===ui.wordLevel)&&`${w.word} ${w.meaning} ${w.collocations.join(' ')}`.toLocaleLowerCase('tr').includes(query));
  return items.length?items.map(w=>`<article class="card vocab-item"><div class="row between"><h3 lang="en">${e(w.word)}</h3><span class="badge">${e(w.level)}</span></div><p>${e(w.meaning)} <small class="muted">· ${e(w.partOfSpeech)}</small></p><p class="example" lang="en">${e(w.example)}</p><div class="collocations" lang="en">${w.collocations.map(e).join(' · ')}</div><div class="word-actions"><span class="small muted">${state.reviews[w.id]?'Tekrar planında':'Yeni'}</span><div class="row gap8"><button class="icon-button" data-action="say" data-say="${e(w.word)}" aria-label="${e(w.word)} kelimesini dinle">${icon('sound')}</button><button class="btn small soft" data-action="review-word" data-id="${e(w.id)}">Çalış</button></div></div></article>`).join(''):'<div class="empty">Bu aramada kart bulunamadı. Başka bir sözcük veya düzey dene.</div>';
}
function reviewView(){
  const card=cardById.get(ui.reviewQueue[ui.reviewIndex]);
  if(!card)return `<div class="summary-card card">${icon('leaf')}<h1>Biraz daha kalıcı.</h1><p class="muted">Bu sette ${ui.reviewIndex} kart çalıştın. Yanıtlarına göre tekrar zamanları kaydedildi.</p><div class="spaced row wrap" style="justify-content:center"><button class="btn" data-action="review">Bir set daha ${icon('arrow')}</button><a href="#words" class="btn secondary">Kütüphaneye dön</a></div></div>`;
  const ratings=`<p class="small muted">Cevabı görmeden ne kadarını hatırladın?</p><div class="review-rating">${[['again','Hatırlamadım','10 dakika'],['hard','Zorlandım','En az 1 gün'],['good','Hatırladım','Normal tekrar'],['easy','Çok kolay','Daha sonra']].map(([k,l,t])=>`<button class="btn secondary" data-action="rate-word" data-value="${k}"><span>${l}<br><small>${t}</small></span></button>`).join('')}</div>`;
  const top=`<div class="row between"><a href="#words${card.isPhrase?'/phrases':''}" class="text-button">${icon('back')} ${card.isPhrase?'İfade bankası':'Kelimeler'}</a><span class="small muted">${ui.reviewIndex+1} / ${ui.reviewQueue.length}</span></div>`;
  if(card.isPhrase)return `${top}<section class="card review-card"><span class="badge">İFADE · ${e(PHRASE_FUNCTIONS[card.function])}</span><h2>${e(card.tr)}</h2><p class="muted small">Bunu İngilizce konuşmada nasıl söylersin? Önce sesli söyle, sonra kontrol et.</p>${ui.reviewRevealed?`<div class="review-answer"><strong lang="en">${e(card.phrase)}</strong><p class="english" lang="en">${e(card.example)}</p><button class="btn small secondary" data-action="say" data-say="${e(card.example)}">${icon('sound')} Örneği dinle</button><p class="small">Şimdi bu kalıpla kendi cümleni sesli söyle.</p></div>${ratings}`:`<button class="btn spaced" data-action="reveal-word">İfadeyi ve örneği göster</button>`}</section>`;
  return `${top}<section class="card review-card"><span class="badge">${e(card.level)} · ${e(card.partOfSpeech)}</span><h2 lang="en">${e(card.word)}</h2><button class="icon-button" data-action="say" data-say="${e(card.word)}" aria-label="Kelimeyi dinle">${icon('sound')}</button><p class="muted small">Anlamını hatırla, ardından kendi cümleni düşün.</p>${ui.reviewRevealed?`<div class="review-answer"><strong>${e(card.meaning)}</strong><p lang="en">${e(card.definition)}</p><p class="english" lang="en">${e(card.example)}</p><p class="small" lang="en">${card.collocations.map(e).join(' · ')}</p><small class="muted">Kelime ailesi: ${card.family.map(e).join(', ')||'—'}</small></div>${ratings}`:`<button class="btn spaced" data-action="reveal-word">Anlamı ve örneği göster</button>`}</section>`;
}

// ── Practice session (v0.1 items) ──────────────────────────────────────────

function taskMeta(item){return TASK_TYPES.find(t=>t.id===item.taskType);}
function audioPanel(item){
  return `<div class="audio-panel"><div class="row between"><div class="wave" aria-hidden="true">${Array.from({length:18},()=>'<i></i>').join('')}</div><div class="row"><button class="btn small" data-action="listen">${icon('play')} Dinle</button><select id="audio-speed" aria-label="Dinleme hızı">${[.8,1,1.2].map(v=>`<option value="${v}" ${ui.speed===v?'selected':''}>${v}× hız</option>`).join('')}</select></div></div><p>Cihazın İngilizce sesi kullanılır. Çevrimdışı ses desteği cihaza bağlıdır.</p><button class="text-button" data-action="transcript">${draft(item).showTranscript?'Metni gizle':'Dinledikten sonra metni göster'}</button>${draft(item).showTranscript?`<div class="transcript" lang="en">${e(item.audioText)}</div><small>Bu yanıt yardım alınmış çalışma olarak kaydedilir.</small>`:''}</div>`;
}
function exerciseContent(item,answered){
  const d=draft(item),response=d.response;
  if(item.type==='mcq')return `${item.passage?`<div class="passage english" lang="en">${e(item.passage)}</div>`:''}<div class="quiz-options">${item.options.map((o,i)=>`<button class="option ${response===i?'selected':''} ${answered&&i===item.answer?'correct':''} ${answered&&response===i&&i!==item.answer?'incorrect':''}" data-action="option" data-value="${i}" ${answered?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span lang="en">${e(o)}</span></button>`).join('')}</div>`;
  if(item.type==='gaps')return `<p class="small muted">Verilen başlangıcın sonuna yalnız eksik harfleri yaz.</p><div class="passage english" lang="en">${e(item.passage).replace(/([A-Za-z]*)\{\{(\d+)\}\}/g,(_,prefix,i)=>`<span class="gap-unit">${prefix||e(item.gaps[i]?.prefix)}<input class="gap-input" data-gap="${i}" aria-label="${Number(i)+1}. kelimenin eksik harfleri, başlangıç ${e(item.gaps[i]?.prefix)}" value="${e(response?.[i]||'')}" autocomplete="off" autocapitalize="none" spellcheck="false" ${answered?'disabled':''}></span>`)}</div>${answered?`<p class="small">Doğru sözcükler: ${item.gaps.map(g=>`<strong lang="en">${e(g.prefix+g.answer)}</strong>`).join(' · ')}</p>`:''}`;
  if(item.type==='order'){const order=d.order||[];return `<p class="small muted">Sözcüklere sırayla dokun. Yerini değiştirmek için seçtiğin sözcüğe tekrar dokun.</p><div class="token-row" aria-label="Oluşturduğun cümle">${order.length?order.map((index,i)=>`<button class="token token-answer" lang="en" data-action="remove-token" data-value="${i}" ${answered?'disabled':''}>${e(item.tokens[index])}</button>`).join(''):'<span class="muted small">Cümlen burada oluşacak…</span>'}</div><div class="token-row" aria-label="Kullanılabilir sözcükler">${item.tokens.map((word,i)=>`<button class="token" lang="en" data-action="add-token" data-value="${i}" ${answered||order.includes(i)?'disabled':''}>${e(word)}</button>`).join('')}</div>${answered?`<div class="example-box english" lang="en">${e(item.answer)}</div>`:''}`;}
  if(item.type==='writing')return `<label class="field">İngilizce yanıtın<textarea id="writing-response" lang="en" maxlength="12000" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Write your response here…" ${answered?'readonly':''}>${e(response||'')}</textarea></label><div class="row between draft-note"><span id="draft-status">Taslak bu cihazda otomatik kaydedilir.</span><span id="word-count">${countWords(response)} kelime</span></div>${selfAssessment(item,answered)}`;
  if(item.type==='speaking'){const busy=isBusy();return `<div class="card"><h3>Yanıtını sesli ver.</h3><p class="small muted" style="margin:8px 0 18px">Kayıt bu cihazda kalır. Telaffuz puanlaması yapılmaz. 7 cümlelik ve 4 soruluk setler için <a href="#speaking">Konuşma</a> bölümünü kullan.</p><div class="row wrap"><button class="btn ${busy?'recording':''}" data-action="${busy?'stop-recording':'record'}" ${answered?'disabled':''}>${icon(busy?'stop':'mic')}${busy?'Kaydı durdur':'Mikrofonla kaydet'}</button><span class="small muted">En çok 90 saniye</span></div><div id="record-error" class="inline-error" role="alert"></div>${d.recordingId?`<audio class="recording-player" controls data-recording-id="${e(d.recordingId)}" aria-label="Kendi yanıtını dinle"></audio><button class="text-button" data-action="download-recording" data-id="${e(d.recordingId)}">${icon('download')} Ses kaydını indir</button>`:''}${item.taskType==='listen-repeat'?`<details><summary class="model-summary">Dikte ile kelime kontrolü</summary><textarea id="session-dictation" class="dictation-input" lang="en" rows="2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Dikte edilen cümle"></textarea><button class="btn small" data-action="session-compare">Karşılaştır</button><div id="session-diff">${ui.sessionDiff?.itemId===item.id?ui.sessionDiff.html:''}</div></details>`:''}<p class="small muted">Mikrofon kullanamıyorsan sesli denedikten sonra kısa bir not yazabilirsin.</p><textarea id="speaking-note" rows="2" style="min-height:90px;margin-top:10px" maxlength="4000" aria-label="Konuşma denemesi notu" placeholder="Örneğin: ikinci cümlede zaman uyumunda zorlandım…" ${answered?'readonly':''}>${e(response||'')}</textarea></div>${selfAssessment(item,answered)}`;}
  return '';
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
  return `<div class="exercise"><div class="session-header"><a class="text-button" href="#home">${icon('back')} Kaydet ve çık</a><span class="small muted">${s.index+1} / ${s.itemIds.length} adım</span><span class="pill">${s.options.retry?'Hata tekrarı':durationLabel(s.options.minutes)} · esnek</span></div><div class="progress-track"><span style="width:${Math.round(s.index/s.itemIds.length*100)}%"></span></div><div class="row between wrap"><span class="badge ${item.skill}">${skills[item.skill].name} · ${e(item.level)}</span>${s.options.timed?`<div class="row gap8"><span class="timer" id="timer">${formatTime(secs)}</span><button class="btn small secondary" data-action="timer">${d.timerStartedAt?'Duraklat':secs===0?'Yeni süre başlat':'Sayacı başlat'}</button></div>`:''}</div><h1 lang="en">${e(meta?.label||item.title)}</h1><p class="small muted">${e(item.title)} · Özgün öğretici pratik</p><div class="prompt" lang="en">${e(item.prompt)}</div>${item.audioText?audioPanel(item):''}${exerciseContent(item,answered)}${answered?`<div class="feedback ${answered.correct===false?'incorrect':''}" role="status"><strong>${answered.selfAssessed?'Yanıtın ve öz değerlendirmen kaydedildi.':answered.correct?'İyi iş. Bağlantıyı kurdun.':'Bu ayrıntıyı birlikte inceleyelim.'}</strong><p>${e(answered.feedback||'')}</p><p>${e(item.explanation)}</p>${answered.assisted?'<small>Yardımlı pratik: metin veya örnek görüntülendi.</small>':''}</div>${relatedLessons(item,answered)}`:''}<div id="answer-error" class="inline-error" role="alert"></div><div class="bottom-actions"><a class="btn secondary" href="#home">Şimdilik bırak</a>${answered?`<button class="btn" data-action="next">${s.index===s.itemIds.length-1?'Oturumu tamamla':'Sonraki adım'} ${icon('arrow')}</button>`:`<button class="btn" data-action="check" ${isBusy()?'disabled':''}>${isBusy()?'Ses kaydediliyor…':['writing','speaking'].includes(item.type)?'Değerlendirmeyi kaydet':'Cevabı kontrol et'} ${icon('check')}</button>`}</div><p class="draft-note">${s.options.timed?'Sayaç pratik içindir; gerçek sınavda duraklatma yoktur. Sayfadan ayrılınca burada duraklar.':'Zaman sınırı yok. Her adımda ilerlemen saklanır.'}</p></div>`;
}
function summaryView(){
  const s=state.session,answers=s?Object.values(s.answers):[],objective=answers.filter(a=>!a.selfAssessed),correct=objective.filter(a=>a.correct).length;
  return `<section class="summary-card card"><span class="skill-icon reading" style="margin:auto">${icon('leaf')}</span><h1>Bir adım daha attın.</h1><p class="muted">${answers.length?`${answers.length} çalışma kaydedildi. İstersen devam edebilir, istersen burada bırakabilirsin.`:'Bir beceri seçerek ilk çalışmanı başlatabilirsin.'}</p><div class="stats-strip"><div><strong>${objective.length?`${correct}/${objective.length}`:'—'}</strong><span>Cevap anahtarlı görevler</span></div><div><strong>${answers.length-objective.length}</strong><span>Öz değerlendirme</span></div></div><p class="small muted spaced">Bu özet TOEFL puanı veya CEFR seviyesi değildir.</p><div class="spaced row wrap" style="justify-content:center"><button class="btn" data-action="start">Bir set daha ${icon('arrow')}</button><a class="btn secondary" href="#plan">İlerlemeye bak</a></div></section>`;
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
function sourcesView(){
  return `${head('Doğru kaynak, doğru hazırlık.','21 Ocak 2026 sonrası TOEFL iBT · Kaynak listesi kontrolü: 16 Kasım 2026')}<section class="card"><h2>Sınavın güncel yapısı</h2><div class="table-wrap"><table class="format-table"><thead><tr><th>Bölüm</th><th>Görevler</th><th>Madde</th><th>Yaklaşık süre</th></tr></thead><tbody>${EXAM_SPEC.sections.map(s=>`<tr><td>${e(s.label)}</td><td>${TASK_TYPES.filter(t=>t.skill===s.skill).map(t=>`<span lang="en">${e(t.label)}</span>`).join(', ')}</td><td>${s.items}</td><td>${s.minutes} dk</td></tr>`).join('')}</tbody></table></div><p class="small muted spaced">Reading ve Listening iki aşamalı adaptiftir; Writing ve Speaking doğrusal ilerler. Planlı ara yoktur. ETS soru ve sürelerin değişebileceğini belirtir ve bütün oturum için yaklaşık iki saat ayırmayı önerir. Rapor dört bölüm ve genel sonuç için yarım adımlı 1–6 ölçeğini kullanır; geçiş döneminde karşılaştırılabilir 0–120 toplam da raporlanır.</p></section>
  <section class="card spaced"><h3>ETS PDF denemeleriyle çalışırken</h3><ul class="checklist spaced"><li>Aynı numaralı ETS sesini aç; transkripti ve cevap anahtarını görev sonuna kadar kapalı tut.</li><li>Ses yoksa sesli okutma veya metin üzerinden çalışmayı yardımlı olarak not et.</li><li>Kâğıt uyarlamasının ham doğru sayısından adaptif sınav bandı hesaplama.</li><li>Daha önce görmediğin bir formu ölçüm için ayır; yeniden çözdüğünü tekrar olarak not et.</li></ul></section>
  <div class="source-links spaced">${sources.map(([title,url])=>`<a class="source-link" href="${e(url)}" target="_blank" rel="noopener noreferrer"><span>${e(title)}</span>${icon('external')}</a>`).join('')}</div>
  <section class="card spaced"><h3>Bu uygulamanın içerik sınırı</h3><p class="small muted spaced">${exercises.length} özgün alıştırma, ${vocabulary.length} kelime kartı, ${PHRASES.length} ifade kartı, ${LESSONS.length} dil bilgisi dersi (${LESSONS.filter(l=>l.full).length} Tam anlatım), ${REPEAT_SETS.length} Listen and Repeat seti, ${INTERVIEW_SETS.length} Interview seti ve ${PRONUNCIATION.length} telaffuz dersi. İçerik AI yardımıyla özgün hazırlandı; bağımsız dil uzmanı incelemesi bekliyor (${e(CONTENT_META.reviewStatus)}).</p><p class="small muted spaced">ETS soruları, sesleri, örnek yanıtları, rubrik metinleri ve PDF dosyaları uygulamaya eklenmez; resmî alıştırmaları kaynağında aç. Dış geri bildirim için yalnız kendi cevabını paylaş. Luma bağımsız bir çalışma aracıdır; TOEFL adı sınavı tanımlar.</p></section>`;
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
  if(page==='review')return `review:${ui.reviewIndex}`;
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
  const active={session:'practice',lesson:'library',screen:'library',greview:'library',review:'words',sources:'plan','speak-run':'speaking',pron:'speaking'}[page]||page;
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
  else if(page==='settings')body=settingsView();
  else body=homeView();
  if(page==='settings'&&hasRecovery())body=`<div class="notice warn"><p>Önceki okunamayan kayıt için bir kurtarma kopyası bulunuyor.</p><button class="btn secondary small" data-action="recovery">Kurtarma kopyasını indir</button></div>`+body;
  const remaining=Math.max(0,daysUntil(state.profile.examDate));
  const navLabel=navItems.find(x=>x[0]===active)?.[2]||'Ayarlar';
  document.title=`Luma · ${navLabel}`;
  document.getElementById('app').innerHTML=`<div class="shell"><aside class="sidebar"><a href="#home" class="brand wordmark">luma<span>✳</span></a><p class="brand-sub">KENDİ RİTMİNDE, İLERİYE.</p><nav class="side-nav" aria-label="Ana menü">${navItems.map(([id,ic,label])=>`<a href="#${id}" class="nav-link ${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${icon(ic)}${label}</a>`).join('')}</nav><div class="side-bottom"><div class="goal-tile"><span class="eyebrow">OCAK HEDEFİN</span><strong>${remaining} gün kaldı.</strong><p class="small muted">Kısa da olsa, bugün<br>kendine bir alan aç.</p></div><a href="#settings" class="nav-link ${page==='settings'?'active':''}">${icon('settings')} Ayarlar ve yedek</a><p class="small muted" style="padding:14px;font-size:10px">Sana ait bir çalışma alanı.<br>Verilerin bu cihazda.</p></div></aside><div class="workspace"><header class="topbar"><a class="mobile-brand wordmark" href="#home">luma<span>✳</span></a><span class="breadcrumb">Kişisel alanın <span style="margin:0 12px;color:#b3b9aa">/</span> ${navLabel}</span><div class="top-actions"><span class="small muted online-status"><i class="status-dot"></i>${navigator.onLine?'Çalışmaya hazır':'Çevrimdışı'}</span><a class="pill" href="#sources" style="text-decoration:none">TOEFL® · 2026</a><a href="#settings" class="avatar" aria-label="Profil ve ayarlar">${icon('user')}</a></div></header>${ui.updateReady?`<div class="update-bar" role="status"><span>Yeni sürüm hazır. Çalışman kaydedilip uygulama yenilenir.</span><button class="btn small" data-action="apply-update">Güncelle</button></div>`:''}${storageWarning()?`<div class="save-error" role="alert">${e(storageWarning())}</div>`:''}<main class="content" id="main" tabindex="-1">${body}<footer class="footer">Luma bağımsız bir çalışma aracıdır; ETS tarafından onaylanmış değildir. TOEFL®, ETS'nin markasıdır.<br><a href="#sources">Özgün içerikler ve kaynaklar</a> · Öğrenme verileri resmî sınav puanı değildir.</footer></main></div><nav class="bottom-nav" aria-label="Mobil ana menü">${navItems.map(([id,ic,,short])=>`<a href="#${id}" class="bottom-link ${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${icon(ic)}<span>${short}</span></a>`).join('')}</nav></div>`;
  restoreView(keep);
  hydrateAudio();
  if(page==='settings')hydrateSettings();
  if(page==='plan'&&param==='log'&&!keep)document.getElementById('exam-log')?.scrollIntoView({block:'start'});
}

// ── Session behaviour ──────────────────────────────────────────────────────

function beginSession(options={},onlyItem=null){
  if(isBusy()){toast('Önce ses kaydını durdur ve saklanmasını bekle.');return;}
  if(hasSession()&&!window.confirm('Yarım kalan seti değiştirip yeni bir set açmak istiyor musun? Tamamlanan yanıtların korunur; yeni setteki aynı soruların yarım taslakları sıfırlanır.'))return;
  const opt={skill:'all',taskType:'all',level:'all',minutes:ui.minutes,quiet:ui.quiet,timed:ui.timed,...options};
  const items=onlyItem?[].concat(onlyItem):selectExercises(exercises,state.attempts,opt);
  if(!items.length){toast('Bu filtrede alıştırma yok. Düzeyi veya sessiz çalışma seçimini değiştir.');return;}
  pauseTimer();stopRecording();
  items.forEach(item=>{delete state.drafts[item.id];});
  state.session=createSession(items,opt);persist();go('session');
}
function reviewStart(id,deck){
  const previous=state.reviewSession;
  if(!id&&!deck&&previous&&previous.index<previous.itemIds.length){ui.reviewQueue=[...previous.itemIds];ui.reviewIndex=previous.index;ui.reviewRevealed=previous.revealed;go('review');return;}
  const pool=deck==='phrases'?phraseCards:deck==='words'?vocabulary:allCards;
  const {due}=dueVocabulary(pool,state.reviews);
  const unseen=dueVocabulary(deck?pool:vocabulary,state.reviews).new;
  ui.reviewQueue=id?[id]:[...due,...unseen].slice(0,20).map(w=>w.id);
  if(!ui.reviewQueue.length){toast('Bu destede tekrar zamanı gelen veya yeni kart yok. Listeden istediğin kartı çalışabilirsin.');return;}
  ui.reviewIndex=0;ui.reviewRevealed=false;saveReviewSession();go('review');
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
  const result=gradeAnswer(item,d.response);
  const attempt={id:`${state.session.id}:${item.id}`,itemId:item.id,skill:item.skill,taskType:item.taskType,level:item.level,at:new Date().toISOString(),correct:result.correct,score:result.score,selfAssessed:self,selfRating:d.selfRating??null,response:d.response??'',recordingId:d.recordingId||'',assisted:!!d.transcriptViewed||!!d.modelViewed,feedback:result.feedback};
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
  else if(action==='duration'){ui.minutes=Number(value);rememberPrefs();render();}
  else if(action==='start')beginSession();
  else if(action==='start-filtered')beginSession({skill:ui.skill,level:ui.level,quiet:false});
  else if(action==='start-skill')beginSession({skill:value||'all',quiet:value==='listening'||value==='speaking'?false:ui.quiet});
  else if(action==='resume')go('session');
  else if(action==='skill'){ui.skill=value;go('practice');}
  else if(action==='task'){const t=TASK_TYPES.find(x=>x.id===id);beginSession({skill:t.skill,taskType:id,level:ui.level,quiet:false});}
  else if(action==='retry-item')beginSession({minutes:0,quiet:false,retry:true},exercises.find(x=>x.id===id));
  else if(action==='retry-due'){const items=dueMistakeItems().slice(0,12);if(items.length)beginSession({minutes:0,quiet:false,retry:true},items);else toast('Bugün yeniden denenecek soru yok.');}
  else if(action==='option'){draft().response=Number(value);persist();render();}
  else if(action==='add-token'){const d=draft(),item=currentItem();d.order||=[];d.order.push(Number(value));d.response=d.order.map(i=>item.tokens[i]).join(' ');persist();render();}
  else if(action==='remove-token'){const d=draft(),item=currentItem();d.order.splice(Number(value),1);d.response=d.order.map(i=>item.tokens[i]).join(' ');persist();render();}
  else if(action==='check')checkAnswer();
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
  else if(action==='review-deck')reviewStart(null,value);
  else if(action==='review-word')reviewStart(id);
  else if(action==='reveal-word'){ui.reviewRevealed=true;saveReviewSession();render();}
  else if(action==='rate-word'){const wordId=ui.reviewQueue[ui.reviewIndex];state.reviews[wordId]=scheduleReview(state.reviews[wordId],value);ctx.activity('vocab');ui.reviewIndex++;ui.reviewRevealed=false;saveReviewSession();render();}
  else if(action==='word-level'){ui.wordLevel=value;render();}
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
async function confirmImport(){
  const incoming=pendingImport;if(!incoming)return;
  const saved=await exportProgress(state);
  if(!saved){toast('Mevcut yedek kaydedilmediği için geri yükleme yapılmadı.');return;}
  if(saveState(incoming)){state=incoming;pendingImport=null;pendingDropped='';ui.reviewQueue=state.reviewSession?.itemIds||[];ui.reviewIndex=state.reviewSession?.index||0;ui.reviewRevealed=state.reviewSession?.revealed||false;freshRender=true;render();toast('Mevcut yedek kaydedildi ve seçtiğin yedek geri yüklendi.');}else toast(storageWarning());
}
document.addEventListener('input',event=>{
  const el=event.target;
  if(handleGrammarInput(ctx,el))return;
  if(handleSpeakingInput(ctx,el))return;
  if(el.id==='word-search'){ui.wordQuery=el.value;document.getElementById('word-results').innerHTML=wordResults();}
  else if(el.id==='writing-response'||el.id==='speaking-note'){draft().response=el.value;const writing=el.id==='writing-response';if(writing)document.getElementById('word-count').textContent=`${countWords(el.value)} kelime`;persistSoon(()=>{const status=document.getElementById('draft-status');if(writing&&status)status.textContent=storageWarning()||'Taslak kaydedildi.';});}
  else if(el.hasAttribute('data-gap')){const d=draft();d.response||=[];d.response[Number(el.dataset.gap)]=el.value;persistSoon();}
});
document.addEventListener('change',async event=>{
  const el=event.target;
  if(handleSpeakingChange(ctx,el))return;
  if(el.id==='quiet')ui.quiet=el.checked;
  else if(el.id==='timed'){ui.timed=el.checked;rememberPrefs();}
  else if(el.id==='voice-select'){ui.voice=el.value;setPreferredVoice(ui.voice);rememberPrefs();}
  else if(el.id==='voice-speed'){ui.speed=Number(el.value);rememberPrefs();}
  else if(el.id==='exam-type'){ui.examType=el.value==='estimate'?'estimate':'raw';render();}
  else if(el.id==='practice-level')ui.level=el.value;
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
