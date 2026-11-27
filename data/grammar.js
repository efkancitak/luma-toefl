// Grammar map (GRAMMAR.md v4): 11 modules, 67 core lessons + 2 lessons opened
// while mapping the v0.1 micro lessons (G3.10, G10.9). Every text is original.
// Layers: Özet (summary) for every lesson; Tam anlatım (full) for the priority
// batch, stored in grammar-full-*.js.

import { grammar as microLessons } from "./library.js";
import { FULL_LESSONS_A } from "./grammar-full-1.js";
import { FULL_LESSONS_B } from "./grammar-full-2.js";
import { EXTRA_LESSONS, LESSON_TABLES } from "./grammar-extra.js";
import { DRILLS } from "./grammar-drills.js";

export const GRAMMAR_META = Object.freeze({
  version: 2,
  mapVersion: "GRAMMAR.md v4 · 16 Kasım 2026",
  provenance: "original-ai-assisted",
  reviewStatus: "unreviewed",
});

export const TASK_LABELS = Object.freeze({
  CW: "Complete the Words",
  RD: "Okuma görevleri",
  LS: "Dinleme görevleri",
  BS: "Build a Sentence",
  EM: "Write an Email",
  AD: "Academic Discussion",
  LR: "Listen and Repeat",
  INT: "Take an Interview",
});

export const MODULES = Object.freeze([
  { id: 1, title: "Cümlenin temeli" },
  { id: 2, title: "İsim öbeği (isim tamlamaları)" },
  { id: 3, title: "Zamanlar ve fiil öbeği" },
  { id: 4, title: "Kipler (modals)" },
  { id: 5, title: "Koşul ve varsayım (conditionals)" },
  { id: 6, title: "Fiil kalıpları" },
  { id: 7, title: "Yan cümleler" },
  { id: 8, title: "Karşılaştırma ve derece" },
  { id: 9, title: "Edatlar" },
  { id: 10, title: "Söylem ve akademik dil" },
  { id: 11, title: "Yazım mekaniği" },
]);

export const PRIORITY_CODES = Object.freeze([
  "G1.3", "G2.1", "G2.2", "G2.3", "G2.7", "G2.10", "G2.11", "G3.2", "G3.3", "G3.7",
  "G5.1", "G5.2", "G5.3", "G6.1", "G6.4", "G7.1", "G7.3", "G9.1", "G10.1", "G10.3",
]);
const PRIORITY = new Set(PRIORITY_CODES);

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const ozet = (summary, explanation, examples, examUse, quiz) => ({
  summary,
  explanation,
  examples: examples.map(([en, tr]) => ({ en, tr })),
  examUse,
  quiz,
});
const L = (code, title, level, mistakes, tasks, extra = {}) => ({
  code,
  module: Number(code.slice(1).split(".")[0]),
  title,
  level,
  mistakes: mistakes.map(([wrong, right]) => ({ wrong, right })),
  tasks,
  priority: PRIORITY.has(code),
  addedInMapping: extra.added === true,
  legacy: extra.legacy ?? [],
  ozet: extra.ozet ?? null,
  checks: extra.checks ?? [],
});

const LESSON_LIST = [
  // ── Modül 1 — Cümlenin temeli ───────────────────────────────────────────
  L("G1.1", "Cümle öğeleri, söz dizimi (SVO) ve zarf yeri", "A1–B1", [["I every day study English", "I study English every day"]], ["BS", "LR"], {
    ozet: ozet(
      "İngilizcede temel sıra özne + fiil + nesnedir; zarflar çoğunlukla sona veya fiilin önüne gelir.",
      "Türkçede fiil genellikle sondadır ve öğelerin sırası esnektir; İngilizcede ise anlamı özne–fiil–nesne (SVO) sırası taşır. Yer ve zaman zarfları çoğunlukla cümlenin sonuna gelir: önce yer, sonra zaman (at the library every evening). Sıklık zarfları (always, usually, never) ana fiilin önüne, be fiilinin ve yardımcı fiilin arkasına yerleşir. Fiil ile nesnesinin arasına zarf girmez: 'I read carefully the text' değil, 'I read the text carefully'.",
      [["Maya studies chemistry at the library every evening.", "Maya her akşam kütüphanede kimya çalışır."], ["Our professor usually posts the slides before class.", "Hocamız slaytları genellikle dersten önce paylaşır."]],
      "Build a Sentence görevinde öbekleri doğru dizmenin ve Listen and Repeat'te cümleyi doğru hatırlamanın temelidir.",
      q("Choose the correct sentence.", ["I every day check my email.", "I check every day my email.", "I check my email every day.", "Every day check I my email."], 2, "Fiil ile nesnesi (check my email) bölünmez; zaman zarfı every day sona gelir."),
    ),
  }),
  L("G1.2", "be ve there is / there are", "A1", [["I very tired", "I am very tired"], ["There is many students", "There are many students"]], ["INT", "LR"], { legacy: ["g001"] }),
  L("G1.3", "Olumsuz ve soru cümleleri (do/does/did, özne soruları)", "A1–A2", [["Where you live?", "Where do you live?"], ["Who did call you?", "Who called you?"]], ["BS", "LS"], {
    checks: [
      q("Choose the correct question.", ["Where you live?", "Where do you live?", "Where you do live?", "Where does you live?"], 1, "Soru kelimesinden sonra yardımcı fiil (do) ve özne gelir."),
      q("Choose the correct subject question.", ["Who did call you last night?", "Who called you last night?", "Who did called you last night?", "Who calling you last night?"], 1, "Özne soruluyorsa (arayan kişi) did kullanılmaz: Who called you?"),
    ],
  }),
  L("G1.4", "Kısa cevaplar ve question tags", "B1", [["You're coming, no?", "You're coming, aren't you?"]], ["LS"], {
    ozet: ozet(
      "Kısa cevapta ve soru ekinde cümlenin yardımcı fiili tekrarlanır.",
      "İngilizcede evet/hayır cevabı çoğu zaman yalnız yes/no ile bırakılmaz; yardımcı fiil tekrar edilir: 'Did you finish?' – 'Yes, I did.' Question tag, Türkçedeki 'değil mi?' karşılığıdır; olumlu cümleye olumsuz, olumsuz cümleye olumlu tag gelir ve cümledeki yardımcı fiil kullanılır: 'You're coming, aren't you?', 'She didn't call, did she?' Yardımcı fiil yoksa do/does/did gelir. Ses sonda alçalırsa onay, yükselirse gerçek soru beklenir.",
      [["The lab closes at six, doesn't it?", "Laboratuvar altıda kapanıyor, değil mi?"], ["Have you registered yet? — No, I haven't.", "Kaydını yaptırdın mı? — Hayır, yaptırmadım."]],
      "Listen and Choose a Response görevinde konuşmacının onay mı yoksa bilgi mi beklediğini anlamaya yardım eder.",
      q("Complete: 'You submitted the form, ___?'", ["didn't you", "don't you", "weren't you", "did you"], 0, "Cümle geçmiş zaman ve olumlu; tag olumsuz ve did ile kurulur: didn't you?"),
    ),
  }),
  L("G1.5", "Rica, teklif ve kibar istek kalıpları", "A2–B1", [["I want an extension", "Could I possibly have an extension?"]], ["EM", "LS"], {
    ozet: ozet(
      "Rica ve teklifte 'I want' yerine Could/Would/Would it be possible kalıpları kullanılır.",
      "Türkçede 'istiyorum' kibar bir bağlamda doğal olabilir, ama İngilizcede 'I want…' bir hocaya veya görevliye söylendiğinde sert duyulur. Rica için 'Could you…?', 'Would you mind + -ing?', 'I was wondering if I could…', 'Would it be possible to…?' kullanılır. Teklif için 'Would you like…?', 'Shall I…?', 'I'd be happy to…'. Cümle dolaylılaştıkça kibarlık artar; yine de e-postada amacı ilk iki cümlede açıkça söylemek gerekir.",
      [["Would it be possible to move my presentation to Thursday?", "Sunumumu perşembeye almak mümkün olur mu?"], ["Would you mind sending me the reading list?", "Okuma listesini bana gönderebilir misiniz?"]],
      "Write an Email görevinde tonu, Listening'de konuşmacının rica mı teklif mi yaptığını ayırt etmeyi sağlar.",
      q("Which request is most appropriate in an email to a professor?", ["I want an extension.", "Give me more time, please.", "Could I possibly have a two-day extension?", "You must give me an extension."], 2, "Could I possibly… dolaylı ve kibardır; diğerleri talep veya emir gibi duyulur."),
    ),
  }),

  // ── Modül 2 — İsim öbeği ────────────────────────────────────────────────
  L("G2.1", "Sayılabilir/sayılamaz isimler ve çoğul", "A1–A2", [["three book", "three books"], ["informations", "information"]], ["CW", "EM"], { legacy: ["g003"] }),
  L("G2.2", "Artikeller: temel kullanım", "A1", [["I am student", "I am a student"]], ["BS", "EM", "AD"], { legacy: ["g002"] }),
  L("G2.3", "Artikeller: genel–özel anlam ve akademik kullanım", "B1–B2", [["The technology changes the life", "Technology changes life"]], ["AD", "CW"], {
    checks: [q("Choose the best sentence for a general statement.", ["The technology changes the life.", "Technology changes life.", "A technology changes the life.", "The technologies changes life."], 1, "Genel anlamdaki soyut ve sayılamaz isimler artikelsiz kullanılır.")],
  }),
  L("G2.4", "Belirleyiciler ve miktar: some/any, much/many, (a) few/(a) little, each/every, both/either/neither", "A2–B1", [["Each students", "Each student"]], ["CW", "RD"], {
    ozet: ozet(
      "each/every + tekil isim; many/(a) few + sayılabilir çoğul; much/(a) little + sayılamaz.",
      "Belirleyici, isimden önce gelip miktarı veya kapsamı gösterir. Each ve every tekil isim ve tekil fiil alır: 'Each student has a locker.' Many ve (a) few sayılabilir çoğulla, much ve (a) little sayılamazla kullanılır. A few / a little 'biraz, yeterince' anlamında olumludur; few / little 'pek az, yetersiz' anlamında olumsuzdur. Both iki şey için çoğul fiil alır; either ve neither ise ikisinden biri/hiçbiri anlamında tekil isimle gelir: 'Neither answer is correct.'",
      [["Every participant receives a short survey.", "Her katılımcı kısa bir anket alır."], ["Few students attended, so the session was cancelled.", "Çok az öğrenci katıldı, bu yüzden oturum iptal edildi."]],
      "Complete the Words görevinde isim/fiil uyumunu, Reading'de 'few' gibi olumsuz miktarın anlamı nasıl değiştirdiğini fark ettirir.",
      q("Choose the correct sentence.", ["Each students has a locker.", "Each student has a locker.", "Each student have a locker.", "Every students have a locker."], 1, "Each tekil isim (student) ve tekil fiil (has) ister."),
    ),
  }),
  L("G2.5", "a number of / the number of ve çoğunluk ifadeleri", "B2", [["The number of students are rising", "The number of students is rising"]], ["AD", "CW"], {
    ozet: ozet(
      "A number of + çoğul fiil (birçok); the number of + tekil fiil (sayısı).",
      "'A number of students' birçok öğrenci demektir; özne öğrencilerdir ve fiil çoğul olur: 'A number of students are absent.' 'The number of students' ise öğrenci sayısı demektir; özne sayıdır ve fiil tekil olur: 'The number of students is rising.' Benzer biçimde 'the majority of + çoğul isim' genellikle çoğul fiil, 'a large proportion of + sayılamaz isim' tekil fiil alır. Grafik ve eğilim anlatırken bu ayrım sık sınanır.",
      [["The number of online courses has doubled since 2020.", "Çevrim içi derslerin sayısı 2020'den bu yana iki katına çıktı."], ["A number of researchers have questioned this result.", "Birçok araştırmacı bu sonucu sorguladı."]],
      "Academic Discussion'da veri ve eğilim anlatırken, Complete the Words'te fiil eki seçerken gereklidir.",
      q("Complete: 'The number of applicants ___ increased this year.'", ["have", "has", "are", "were"], 1, "Özne 'the number' (tekil) olduğu için has kullanılır."),
    ),
  }),
  L("G2.6", "Zamirler, iyelik sıfatları, -self, one/ones", "A1–B1", [["Sara forgot his keys (Sara kadın)", "Sara forgot her keys"]], ["INT", "LR"], {
    ozet: ozet(
      "he/she ve his/her ayrımı zorunludur; tekrarı önlemek için one/ones, kendi kendine için -self.",
      "Türkçede 'o' ve 'onun' cinsiyet belirtmez; İngilizcede kişi için he/she, his/her ayrımı zorunludur ve konuşurken en sık kayan noktalardandır. İyelik sıfatı isimden önce gelir (her notes), iyelik zamiri tek başına durur (the notes are hers). -self zamirleri eylemi yapanla etkilenen aynı olduğunda kullanılır: 'She taught herself Python.' Aynı ismi tekrar etmemek için one/ones kullanılır: 'I prefer the quieter room, not the big one.'",
      [["My roommate left her laptop in the lab, so I brought it to her.", "Ev arkadaşım dizüstü bilgisayarını laboratuvarda unuttu, ben de ona getirdim."], ["These chairs are broken; let's take the ones near the window.", "Bu sandalyeler kırık; pencerenin yanındakileri alalım."]],
      "Interview cevabında bir kişiyi anlatırken ve Listen and Repeat'te zamirleri eksiksiz tekrar ederken önemlidir.",
      q("Choose the correct sentence about a woman named Sara.", ["Sara forgot his keys.", "Sara forgot her keys.", "Sara forgot hers keys.", "Sara forgot herself keys."], 1, "Sara kadın olduğu için iyelik sıfatı her; isimden önce 'hers' değil 'her' gelir."),
    ),
  }),
  L("G2.7", "İsim tamlaması 1: 's, of ve isim + isim", "A2–B1", [["my brother car", "my brother's car"]], ["CW", "RD"], {
    checks: [q("Choose the most natural phrase.", ["the table's leg", "the table leg", "the leg's table", "table of leg"], 1, "Cansız nesnelerde isim + isim (the table leg) veya of yapısı daha yaygındır. The table's leg yanlış değildir ama daha az doğaldır; insan ve hayvanda 's kullanılır.")],
  }),
  L("G2.8", "Sıfatlar: sıra, sıfat–zarf ayrımı, -ed/-ing", "A2–B1", [["I am boring in class", "I am bored in class"], ["He speaks very good", "He speaks very well"]], ["INT", "AD"], {
    ozet: ozet(
      "Sıfat ismi, zarf fiili niteler; -ed hisseden kişi, -ing hissi yaratan şeydir.",
      "Sıfat ismi niteler (a careful reader), zarf ise fiili veya sıfatı niteler (read carefully). Türkçede 'iyi konuşuyor' derken 'iyi' iki işi de görür; İngilizcede good sıfat, well zarftır: 'He speaks well.' -ed biçimli sıfatlar kişinin hissini (I am bored), -ing biçimli sıfatlar o hissi yaratan şeyi anlatır (the lecture is boring). Birden çok sıfat varsa sıra genellikle görüş–boyut–yaş–şekil–renk–köken–malzeme–amaçtır: 'a useful small wooden desk'.",
      [["The results were surprising, so the team was surprised too.", "Sonuçlar şaşırtıcıydı, bu yüzden ekip de şaşırdı."], ["She explained the method clearly and patiently.", "Yöntemi açıkça ve sabırla anlattı."]],
      "Interview'da duygu anlatırken ve Academic Discussion'da değerlendirme yaparken doğru biçimi seçtirir.",
      q("Choose the correct sentence.", ["I was very interesting in the talk.", "I was very interested in the talk.", "The talk was very interested.", "I was very interestingly in the talk."], 1, "İlgiyi hisseden kişidir: interested. Konuşmanın kendisi için interesting kullanılır."),
    ),
  }),
  L("G2.9", "İsim tamlaması 2: önden niteleme, isim zincirleri ve bileşik sıfatlar", "B1–B2", [["a ten-years study", "a ten-year study"]], ["RD", "AD"], {
    ozet: ozet(
      "İsim zincirinde son isim baş isimdir; sayı + isim bileşik sıfatında isim tekil kalır: a ten-year study.",
      "Akademik metinlerde isimler birbirini önden niteleyerek zincir oluşturur: 'student housing costs' = öğrenci konutu maliyetleri. Son isim baş isimdir; öndekiler onu sınıflandırır ve genellikle tekil kalır (a book store; books store değil). Sayı + isim kalıbı isimden önce sıfat gibi kullanıldığında tireyle bağlanır ve çoğul eki almaz: 'a ten-year study', 'a two-hour exam'. Aynı bilgi fiilden sonra çoğul olur: 'The study lasted ten years.' Zinciri sondan başa doğru çevirmek anlamı açar.",
      [["The team published a five-year climate study.", "Ekip beş yıllık bir iklim çalışması yayımladı."], ["Campus parking fees will rise next term.", "Kampüs otopark ücretleri gelecek dönem artacak."]],
      "Read an Academic Passage'taki uzun isim zincirlerinde baş ismi bulmak ve Academic Discussion'da yoğun ama doğru öbek kurmak için gerekir.",
      q("Choose the correct phrase.", ["a three-weeks course", "a three-week course", "a three weeks' course of", "a course three-week"], 1, "Sayı + isim bileşik sıfatında isim tekildir ve tireyle bağlanır."),
    ),
  }),
  L("G2.10", "İsim tamlaması 3: arkadan niteleme (edat öbeği, -ing/-ed, to-infinitive)", "B2", [["the in 2020 published report", "the report published in 2020"]], ["RD", "AD"], {
    checks: [q("Choose the correct phrase.", ["the in 2020 published report", "the report published in 2020", "the report which published in 2020", "the published in 2020 report"], 1, "Çok kelimeli niteleme ismin arkasına geçer; rapor yayımlanmıştır (edilgen): published.")],
  }),
  L("G2.11", "Karmaşık isim öbeğinde baş isim ve özne-fiil uyumu", "B2–C1", [["The impact of social media on teenagers are…", "…is…"]], ["AD", "CW"], {
    checks: [q("Complete: 'The impact of social media on teenagers ___ widely debated.'", ["are", "is", "have", "were being"], 1, "Baş isim impact tekildir; fiil is.")],
  }),
  L("G2.12", "Apposition (açıklayıcı ek)", "B2–C1", [["Dr. Lee a biologist said", "Dr. Lee, a biologist, said"]], ["RD", "LS"], {
    ozet: ozet(
      "Bir ismi hemen ardından açıklayan ikinci isim öbeği; ek bilgiyse virgüllerle ayrılır.",
      "Apposition, bir isim öbeğinin hemen ardından onu tanımlayan başka bir isim öbeği koymaktır: 'Dr. Lee, a marine biologist, studies coral.' Ek bilgi niteliğindeyse iki yanına virgül konur; konuşmada kısa duraklama ve biraz alçak tonla söylenir. Ayırt edici (tanımlayıcı) ise virgülsüz kullanılır: 'the biologist Dr. Lee'. Apposition, relative clause'un kısalmış hali gibi düşünülebilir: 'Dr. Lee, who is a marine biologist,…'.",
      [["Ankara, the capital of Turkey, hosts many universities.", "Türkiye'nin başkenti Ankara pek çok üniversiteye ev sahipliği yapar."], ["Our guest speaker, an expert on urban heat, will start at noon.", "Kentsel ısı uzmanı olan konuğumuz öğlen başlayacak."]],
      "Listening'de konuşmacının bir terimi veya kişiyi tanıtan ek bilgisini yakalamak, Reading'de tanım cümlelerini fark etmek için kullanılır.",
      q("Choose the correctly punctuated sentence.", ["Professor Kaya a historian will lead the tour.", "Professor Kaya, a historian will lead the tour.", "Professor Kaya, a historian, will lead the tour.", "Professor Kaya a historian, will lead the tour."], 2, "Ek bilgi veren 'a historian' iki virgül arasına alınır."),
    ),
  }),
  L("G2.13", "Nominalisation", "C1", [["the analyze of the data", "the analysis of the data"]], ["RD", "AD"], { legacy: ["g026"] }),

  // ── Modül 3 — Zamanlar ve fiil öbeği ────────────────────────────────────
  L("G3.1", "Present simple ve continuous; durum fiilleri", "A1–A2", [["She go", "She goes"], ["I am knowing", "I know"]], ["INT"], { legacy: ["g004", "g005"] }),
  L("G3.2", "Past simple ve continuous; used to / would", "A2–B1", [["I didn't went", "I didn't go"], ["I am used to play (geçmiş alışkanlık)", "I used to play"]], ["INT"], { legacy: ["g007", "g008"] }),
  L("G3.3", "Present perfect (simple/continuous) ve past simple", "B1", [["I have seen him yesterday", "I saw him yesterday"], ["I am here since 2023", "I have been here since 2023"]], ["INT", "EM"], { legacy: ["g009"] }),
  L("G3.4", "Past perfect", "B1–B2", [["When I arrived, the lecture already started", "…had already started"]], ["LS", "INT"], { legacy: ["g019"] }),
  L("G3.5", "Gelecek biçimleri: will, going to, present continuous, programlı present simple, future continuous/perfect", "A2–B2", [["I will meet my advisor at 3 tomorrow (plan)", "I'm meeting my advisor at 3 tomorrow"]], ["EM"], { legacy: ["g010"] }),
  L("G3.6", "Anlatı zamanları ve zaman tutarlılığı", "B1", [["Yesterday I go to the lab and I see…", "Yesterday I went to the lab and I saw…"]], ["INT"], {
    ozet: ozet(
      "Geçmişi anlatırken past simple çizgisini koru; şimdiki zamana kaymak anlatıyı bulanıklaştırır.",
      "Bir deneyimi anlatırken ana olaylar past simple ile sıralanır (I joined, I noticed, I decided). Arka plan veya o sırada süren durum past continuous ile verilir (it was raining), olaydan önce olmuş şey past perfect ile (I had already left). Türkçe anlatıda canlandırmak için şimdiki zamana geçmek doğaldır, ama TOEFL mülakatında bu kayma zaman hatası gibi duyulur. Bugüne bağlanan sonuç kapanışta present ile söylenir: 'Since then, I always check…'.",
      [["Last spring, I joined a study group because I was struggling with statistics.", "Geçen bahar istatistikte zorlandığım için bir çalışma grubuna katıldım."], ["By the time the exam started, we had reviewed every chapter.", "Sınav başladığında her bölümü gözden geçirmiştik."]],
      "Take an Interview'daki deneyim sorularında ('Tell me about a time…') cevabın tutarlı ve anlaşılır olmasını sağlar.",
      q("Choose the best continuation: 'Last year I volunteered at a museum. On my first day, I ___ a group of children.'", ["guide", "am guiding", "guided", "have guided"], 2, "Anlatı geçmişte; ana olay past simple ile sürer: guided."),
    ),
  }),
  L("G3.7", "Passive: temel", "B1", [["The experiment was conduct", "was conducted"], ["It is happened", "It happened"]], ["RD", "AD"], { legacy: ["g013"] }),
  L("G3.8", "Passive: ileri (modal passive, 'It is believed that…', 'X is thought to…')", "B2–C1", [["This is believed it causes…", "This is believed to cause…"]], ["RD", "AD"], { legacy: ["g028"] }),
  L("G3.9", "Causative: have/get something done", "B2", [["I cut my hair at the barber's (kendin kesmediysen)", "I had my hair cut"]], ["INT"], {
    ozet: ozet(
      "Bir işi başkasına yaptırmak: have/get + nesne + V3 (I had my laptop repaired).",
      "Türkçedeki ettirgen ekin (-tır/-dır) karşılığı causative yapıdır: 'I had my laptop repaired' = Dizüstümü tamir ettirdim. Kalıp have/get + nesne + geçmiş ortaçtır (V3). 'I repaired my laptop' dersen işi kendin yapmış olursun. Get daha gündelik, have biraz daha nötrdür. Bir kişiye iş yaptırmak için 'have someone do' (I had the technician check it) veya 'get someone to do' (I got my friend to proofread it) kullanılır.",
      [["I'm getting my eyes tested before the semester starts.", "Dönem başlamadan gözlerimi test ettireceğim."], ["The department had the old lab renovated last summer.", "Bölüm eski laboratuvarı geçen yaz yeniletti."]],
      "Interview'da gündelik deneyim anlatırken kimin neyi yaptığını açık söylemeyi sağlar.",
      q("You paid a barber to cut your hair. Which sentence is correct?", ["I cut my hair yesterday.", "I had my hair cut yesterday.", "I had cut my hair yesterday.", "I made my hair cut yesterday."], 1, "İşi başkası yaptığı için causative: had my hair cut."),
    ),
  }),
  L("G3.10", "Akademik yazıda zaman ve görünüş seçimi", "C2", [["The study finds… (belirli geçmiş bulgu)", "The study found…"]], ["AD", "RD"], { legacy: ["g036"], added: true }),

  // ── Modül 4 — Kipler ────────────────────────────────────────────────────
  L("G4.1", "can / could / may: yetenek, izin, rica", "A2", [["can to go", "can go"]], ["EM", "LS"], {
    ozet: ozet(
      "Modal + yalın fiil: can go, could help, may leave — 'to' eklenmez, -s almaz.",
      "Can yetenek ve gündelik izin, could geçmişteki genel yetenek ve daha kibar rica, may ise resmî izin veya olasılık anlatır. Modal fiilden sonra fiil her zaman yalın gelir ve 'to' almaz: 'can go' (can to go değil). Modallar üçüncü tekil şahısta -s almaz: 'She can' (She cans değil). Ricada 'Could you…?' 'Can you…?'dan daha naziktir; resmî bir izin isteğinde 'May I…?' kullanılabilir.",
      [["Could you explain the last step again?", "Son adımı tekrar açıklayabilir misiniz?"], ["Students may borrow up to five books.", "Öğrenciler en fazla beş kitap ödünç alabilir."]],
      "Write an Email'de rica cümlesini, Listening'de izin ve kural duyurularını doğru anlamayı sağlar.",
      q("Choose the correct sentence.", ["She can to join us later.", "She cans join us later.", "She can join us later.", "She can joins us later."], 2, "Modal fiilden sonra yalın fiil gelir: can join."),
    ),
    checks: [q("Which is a polite and correct request to a librarian?", ["Can I to renew this book?", "May I renew this book?", "Must I renew this book?", "I renew this book?"], 1, "May I + yalın fiil kibar bir izin isteğidir; ilk seçenekte gereksiz 'to', üçüncüde zorunluluk anlamı var.")],
  }),
  L("G4.2", "must, have to, should, need; mustn't ile don't have to farkı", "A2–B1", [["Gerek yok anlamında: You mustn't come", "You don't have to come"]], ["EM", "LS"], { legacy: ["g006"] }),
  L("G4.3", "Şimdiye dair çıkarım: must / might / can't be", "B2", [["Çıkarımda: He mustn't be at home", "He can't be at home"]], ["LS"], { legacy: ["g018"] }),
  L("G4.4", "Geçmişe dair çıkarım ve pişmanlık: must have done, should have done", "B2–C1", [["He must went", "He must have gone"], ["I should study more (geçmiş için)", "I should have studied more"]], ["LS", "INT"], {
    ozet: ozet(
      "Geçmişe dair çıkarım: must/might/can't have + V3; pişmanlık veya eleştiri: should have + V3.",
      "Geçmişe dair güçlü tahminde 'must have + V3', olasılıkta 'might/may/could have + V3', imkânsızlıkta 'can't/couldn't have + V3' kullanılır: 'The lights are off; they must have left.' Gerçekleşmemiş bir beklenti veya pişmanlık için 'should have + V3': 'I should have started earlier' (Daha erken başlamalıydım). Modal'dan sonra geçmiş zaman eki gelmez; geçmişi 'have + V3' taşır: 'must went' değil 'must have gone'.",
      [["Maria isn't answering; she must have turned off her phone.", "Maria açmıyor; telefonunu kapatmış olmalı."], ["We should have booked the room earlier.", "Odayı daha önce ayırtmalıydık."]],
      "Listening'de konuşmacının çıkarımını ve pişmanlığını anlamak, Interview'da deneyimden ders çıkarmak için kullanılır.",
      q("Complete: 'I failed the quiz. I ___ more.'", ["should study", "should have studied", "must study", "must have study"], 1, "Geçmişte yapılmayan şey için pişmanlık: should have studied."),
    ),
  }),
  L("G4.5", "Hedging: may, tend to, appear to, it is likely that", "C1", [["This proves that…", "This suggests that…"]], ["AD"], { legacy: ["g025"] }),

  // ── Modül 5 — Koşul ve varsayım ─────────────────────────────────────────
  L("G5.1", "Zero ve first conditional; unless; if ile when farkı", "A2–B1", [["If I will have time", "If I have time"], ["Unless you don't hurry", "Unless you hurry"]], ["INT", "EM"], { legacy: ["g012"] }),
  L("G5.2", "Second conditional ve 'If I were you'", "B1", [["If I would have money", "If I had money"]], ["INT"], { legacy: ["g015"] }),
  L("G5.3", "Third conditional", "B2", [["If I would have known", "If I had known"]], ["INT", "AD"], { legacy: ["g020"] }),
  L("G5.4", "Mixed conditionals", "B2", [["If I had studied harder, I would have been fluent now", "…I would be fluent now"]], ["INT", "AD"], { legacy: ["g021"] }),
  L("G5.5", "Koşul bağlaçları: as long as, provided that, in case, otherwise", "B2", [["Take an umbrella if it rains (önlem anlamında)", "…in case it rains"]], ["EM", "AD"], {
    ozet: ozet(
      "in case = önlem (olur diye); as long as / provided that = şart (yeter ki); otherwise = aksi hâlde.",
      "If koşul bildirir; başka bağlaçlar koşulun türünü inceltir. As long as ve provided (that) 'yeter ki, şartıyla' anlamında güçlü koşuldur: 'You can join as long as you register.' In case 'olur diye, ihtimaline karşı' anlamında önlem bildirir ve olayın gerçekleşmesine bağlı değildir: 'Take an umbrella in case it rains' (yağmur yağmasa da şemsiyeyi alırsın). Otherwise 'aksi hâlde' demektir ve çoğunlukla yeni bir cümle başlatır. Bu bağlaçlardan sonra gelecek anlamı için de present simple kullanılır.",
      [["Save a copy on your laptop in case the server goes down.", "Sunucu çöker diye bilgisayarına bir kopya kaydet."], ["You may use the studio provided that you book it in advance.", "Önceden ayırtmak şartıyla stüdyoyu kullanabilirsin."]],
      "Write an Email'de koşul ve önlemleri net yazmak, Reading'de kural metinlerindeki şartları doğru anlamak için gerekir.",
      q("Choose the best option: 'Bring your student ID ___ the guard asks for it.'", ["in case", "unless", "as long as", "otherwise"], 0, "Kimliği önlem olarak getirirsin, görevli istese de istemese de: in case."),
    ),
  }),
  L("G5.6", "wish, if only, would rather, it's time", "B2", [["I wish I can", "I wish I could"]], ["INT"], {
    ozet: ozet(
      "wish + past (şimdiye dair), wish + past perfect (geçmişe dair), wish I could (yetenek).",
      "Şimdiki bir durumun farklı olmasını isterken wish + past simple kullanılır: 'I wish I had more time' (Keşke daha çok vaktim olsa). Geçmişe dair pişmanlıkta wish + past perfect: 'I wish I had studied abroad.' Yetenek için 'wish I could'. 'If only' aynı yapıyı daha güçlü duyguyla kurar. 'Would rather' tercih bildirir: 'I'd rather work alone.' 'It's time + past simple' bir şeyin artık yapılması gerektiğini söyler: 'It's time we started.'",
      [["I wish I could attend both workshops.", "Keşke iki atölyeye de katılabilsem."], ["I'd rather present first than wait until the end.", "Sona kadar beklemektense ilk sunmayı tercih ederim."]],
      "Interview'da tercih ve pişmanlık anlatırken doğal ve doğru kalıplar sunar.",
      q("Complete: 'I wish I ___ speak Japanese.'", ["can", "could", "will", "am able"], 1, "wish'ten sonra yetenek için could gelir."),
    ),
  }),
  L("G5.7", "Devrik koşul: Had I known, Should you need, Were it not for", "C1", [["If should you need", "Should you need"]], ["EM", "AD"], { legacy: ["g033"] }),

  // ── Modül 6 — Fiil kalıpları ────────────────────────────────────────────
  L("G6.1", "Gerund ve infinitive", "B1", [["enjoy to read", "enjoy reading"], ["look forward to see", "look forward to seeing"]], ["EM"], { legacy: ["g017"] }),
  L("G6.2", "Anlamı değişen fiiller: remember / stop / try + -ing veya to", "B1–B2", [["Bırakmak anlamında: I stopped to smoke", "I stopped smoking"]], ["INT"], {
    ozet: ozet(
      "stop doing = bırakmak; stop to do = bir şey yapmak için durmak. remember/forget/try da anlam değiştirir.",
      "Bazı fiillerden sonra -ing mi to mu geldiği anlamı değiştirir. Stop + -ing bir eylemi bırakmak, stop + to bir şey yapmak için durmaktır: 'I stopped smoking' / 'I stopped to buy water'. Remember/forget + to gelecekte yapılacak görevi (Remember to submit the form), + -ing geçmişte yapılmış bir anıyı anlatır (I remember submitting it). Try + to çaba göstermek (I tried to open the file), try + -ing bir çözüm denemek demektir (Try restarting the computer).",
      [["Please remember to bring your ID tomorrow.", "Lütfen yarın kimliğini getirmeyi unutma."], ["If the file won't open, try saving it as a PDF.", "Dosya açılmazsa PDF olarak kaydetmeyi dene."]],
      "Interview'da alışkanlık değişikliği anlatırken ve Listening'de talimat duyurularını anlamada önemlidir.",
      q("You quit coffee last year. Which sentence fits?", ["I stopped to drink coffee last year.", "I stopped drinking coffee last year.", "I stopped drink coffee last year.", "I stopped to drinking coffee last year."], 1, "Bırakmak anlamı stop + -ing ile kurulur."),
    ),
  }),
  L("G6.3", "Fiil + nesne + to / yalın fiil: want sb to, make/let sb do", "B1", [["My professor wants that I revise it", "…wants me to revise it"], ["made me to wait", "made me wait"]], ["EM", "INT"], {
    ozet: ozet(
      "want/ask/expect + nesne + to do; make/let + nesne + yalın fiil (to'suz).",
      "Türkçedeki 'benim … yapmamı istiyor' yapısı İngilizcede that cümlesiyle değil, nesne + to-infinitive ile kurulur: 'My professor wants me to revise it.' Ask, tell, expect, allow, encourage, remind gibi fiiller aynı kalıbı alır. Make (yaptırmak, zorlamak) ve let (izin vermek) ise nesneden sonra to'suz yalın fiil alır: 'She made us wait', 'They let me use the lab'. Help iki kalıbı da kabul eder: 'help me (to) carry'.",
      [["My advisor encouraged me to apply for the grant.", "Danışmanım bursa başvurmam için beni teşvik etti."], ["The librarian let us stay after closing time.", "Kütüphaneci kapanıştan sonra kalmamıza izin verdi."]],
      "Write an Email'de rica ve talimatları, Interview'da başkasının etkisini anlatırken kullanılır.",
      q("Choose the correct sentence.", ["The coach made us to run again.", "The coach made us run again.", "The coach made that we run again.", "The coach made us running again."], 1, "Make + nesne + yalın fiil: made us run."),
    ),
  }),
  L("G6.4", "Bağımlı edatlar", "B1–B2", [["discuss about", "discuss"], ["depend from", "depend on"]], ["CW", "EM"], {
    checks: [
      q("Choose the correct sentence.", ["We discussed about the results.", "We discussed the results.", "We discussed on the results.", "We discussed for the results."], 1, "discuss doğrudan nesne alır; about eklenmez."),
      q("Complete: 'Your grade depends ___ the final project.'", ["from", "of", "on", "to"], 2, "Kalıp: depend on."),
    ],
  }),
  L("G6.5", "Phrasal verbs (kampüs ve akademik)", "B1–B2", [["turn off it", "turn it off"]], ["LS", "LR"], {
    ozet: ozet(
      "Ayrılabilen phrasal verb'lerde zamir nesne ortaya girer: turn it off, fill it out.",
      "Phrasal verb, fiil + edat/zarf birleşimiyle yeni anlam kazanır: figure out (çözmek), drop off (bırakmak), hand in (teslim etmek). Ayrılabilen türlerde isim nesne ortaya da sona da gelebilir (turn off the light / turn the light off), ama nesne zamirse mutlaka ortaya girer: 'turn it off' (turn off it değil). Ayrılamayan türlerde (look after, go over) nesne hep sondadır. Kampüs konuşmalarında phrasal verb'ler sık ve hızlı söylenir; anlamı bağlamdan çıkarmak gerekir.",
      [["Could you hand in your forms by Friday?", "Formlarınızı cumaya kadar teslim edebilir misiniz?"], ["I couldn't figure it out, so I asked the TA.", "Çözemedim, bu yüzden asistana sordum."]],
      "Listening'deki konuşma ve duyurularda ve Listen and Repeat cümlelerinde sık görülür.",
      q("Choose the correct sentence.", ["Please fill out it before class.", "Please fill it out before class.", "Please fill out before class it.", "Please out fill it before class."], 1, "Nesne zamir (it) olduğunda ayrılabilen phrasal verb'ün ortasına girer."),
    ),
  }),

  // ── Modül 7 — Yan cümleler ──────────────────────────────────────────────
  L("G7.1", "Relative clauses: defining/non-defining, whose, where, edat + which", "B1–B2", [["the book which I read it", "the book which I read"]], ["RD", "BS"], { legacy: ["g014"] }),
  L("G7.2", "Kısaltılmış relative ve participle clauses", "C1", [["Walking to class, the rain started", "While I was walking to class, it started to rain"]], ["RD", "AD"], { legacy: ["g023", "g032"] }),
  L("G7.3", "Dolaylı sorular", "B1", [["Can you tell me where is the library?", "…where the library is?"]], ["BS", "EM"], {
    checks: [q("Choose the correct sentence.", ["Can you tell me where is the library?", "Can you tell me where the library is?", "Can you tell me where does the library is?", "Can you tell me the library where is?"], 1, "Dolaylı soruda düz cümle sırası: where the library is.")],
  }),
  L("G7.4", "Noun clauses: that, whether/if, wh-", "B2", [["Is important that…", "It is important that…"]], ["AD", "BS"], { legacy: ["g022"] }),
  L("G7.5", "Reported speech ve rapor fiilleri", "B2", [["He said me", "He told me"], ["She suggested me to go", "She suggested that I go"]], ["LS"], { legacy: ["g016"] }),
  L("G7.6", "Zaman, neden ve amaç yan cümleleri (when, because, so that, in order to)", "B1", [["for to learn", "to learn ya da in order to learn"]], ["AD", "INT"], {
    ozet: ozet(
      "Amaç: to / in order to / so that; neden: because + cümle, because of + isim; zaman cümlesinde gelecek için present.",
      "Amaç bildirmek için Türkçedeki '-mek için' yapısının karşılığı to-infinitive veya daha resmî 'in order to'dur: 'I came early to get a seat.' 'for to' veya 'for getting' yanlıştır. Amaç cümlesinde farklı bir özne varsa 'so that + can/could/will' kullanılır: 'She spoke slowly so that everyone could follow.' Neden için because + tam cümle, because of / due to + isim öbeği gelir. Zaman yan cümlesinde (when, after, as soon as) gelecek anlamı için present simple kullanılır: 'When I finish, I'll call you.'",
      [["I record my answers so that I can hear my mistakes.", "Hatalarımı duyabilmek için cevaplarımı kaydediyorum."], ["As soon as the results arrive, we will share them.", "Sonuçlar gelir gelmez paylaşacağız."]],
      "Interview cevabında 'neden' adımını ve Academic Discussion'da gerekçeyi bağlamak için temel araçtır.",
      q("Choose the correct sentence.", ["I joined the club for to meet people.", "I joined the club for meet people.", "I joined the club to meet people.", "I joined the club for meeting to people."], 2, "Amaç to-infinitive ile bildirilir: to meet people."),
    ),
  }),
  L("G7.7", "Karşıtlık ve sonuç: although, despite, whereas; so…that, such…that", "B1–B2", [["Although…, but…", "Although…, …"], ["despite of", "despite"]], ["AD"], { legacy: ["g034"] }),

  // ── Modül 8 — Karşılaştırma ve derece ───────────────────────────────────
  L("G8.1", "Comparatives ve superlatives", "A2", [["more better", "better"]], ["AD", "INT"], {
    legacy: ["g011"],
    checks: [q("Choose the correct sentence.", ["This is the more difficult course in the program.", "This is the most difficult course in the program.", "This is the difficultest course in the program.", "This is most difficult course of all program."], 1, "Üç veya daha çok şey arasında en üst derece: the most difficult.")],
  }),
  L("G8.2", "as…as, the more…the more, much/far + comparative", "B1–B2", [["very more important", "much more important"]], ["AD"], {
    ozet: ozet(
      "Comparative'i güçlendirmek için much/far/a lot kullanılır; 'very more' yanlıştır.",
      "Eşitlik as + sıfat + as ile kurulur: 'The new lab is as large as the old one.' Olumsuzda 'not as… as' 'kadar değil' demektir. Comparative'i güçlendirmek için much, far, a lot veya considerably kullanılır: 'much more important' (very more değil). İki değişkenin birlikte değiştiğini anlatmak için 'the + comparative…, the + comparative' kalıbı vardır: 'The more you practice, the more confident you become.' Akademik metinlerde 'slightly / significantly higher' gibi derece ifadeleri sık geçer.",
      [["Online classes are not as interactive as face-to-face ones.", "Çevrim içi dersler yüz yüze dersler kadar etkileşimli değil."], ["The earlier you start, the less stressed you'll feel.", "Ne kadar erken başlarsan o kadar az stres hissedersin."]],
      "Academic Discussion'da seçenekleri karşılaştırırken ve Reading'de derece ifadelerinin anlamını çözerken kullanılır.",
      q("Choose the correct sentence.", ["This method is very more effective.", "This method is much more effective.", "This method is more effectiver.", "This method is much effective than that."], 1, "Comparative'i güçlendirmek için much kullanılır."),
    ),
    checks: [q("Complete: 'The more you read, ___ your vocabulary becomes.'", ["the richer", "richer", "the more rich", "more richer"], 0, "Kalıp: the + comparative…, the + comparative.")],
  }),
  L("G8.3", "too / enough, so / such", "B1", [["enough good", "good enough"], ["too much expensive", "too expensive"]], ["INT"], {
    ozet: ozet(
      "too + sıfat (fazla), sıfat + enough (yeterince); so + sıfat, such + (a) sıfat + isim.",
      "Too 'gereğinden fazla' anlamında sıfattan önce gelir ve çoğu zaman olumsuz sonuç ima eder: 'too expensive to buy'. Enough sıfattan sonra, isimden önce gelir: 'good enough', 'enough time'. 'too much expensive' yanlıştır; much yalnız isimle kullanılır (too much noise). So sıfat veya zarftan önce (so tired), such ise (a) + sıfat + isim öbeğinden önce gelir (such a long day). Sonuç eklemek için 'so/such… that' kalıbı kullanılır.",
      [["The room was too small for forty students.", "Oda kırk öğrenci için fazla küçüktü."], ["It was such a clear explanation that everyone understood.", "O kadar açık bir açıklamaydı ki herkes anladı."]],
      "Interview'da yorum ve değerlendirme yaparken doğal ve doğru derece ifadeleri kurmayı sağlar.",
      q("Choose the correct sentence.", ["The answer was enough clear.", "The answer was clear enough.", "The answer was too much clear.", "The answer was such clear."], 1, "Enough sıfattan sonra gelir: clear enough."),
    ),
    checks: [q("Choose the correct sentence.", ["It was so a long lecture.", "It was such a long lecture.", "It was such long lecture.", "It was too much long lecture."], 1, "such + a + sıfat + isim: such a long lecture.")],
  }),

  // ── Modül 9 — Edatlar ───────────────────────────────────────────────────
  L("G9.1", "Zaman ve yer: in / on / at", "A2", [["in Monday", "on Monday"], ["at 2025", "in 2025"]], ["CW", "LR"], {
    checks: [
      q("Complete: 'The seminar is ___ Monday ___ 10 a.m.'", ["in / at", "on / at", "at / on", "on / in"], 1, "Gün on, saat at."),
      q("Choose the correct sentence.", ["I was born in 15 May.", "I was born on 15 May.", "I was born at 15 May.", "I was born at May 15th in."], 1, "Tam tarih (gün) on alır."),
    ],
  }),
  L("G9.2", "for / since / during / while, by / until", "B1", [["during two hours", "for two hours"], ["Son tarih için: until Friday", "by Friday"]], ["EM", "LS"], {
    ozet: ozet(
      "for + süre, since + başlangıç, during + isim, while + cümle; by = en geç, until = -e kadar sürekli.",
      "For bir sürenin uzunluğunu (for two hours), since başlangıç noktasını (since Monday) verir ve çoğunlukla present perfect ile kullanılır. During bir isimden önce gelir ve 'süresince' demektir (during the lecture); while ise bir cümleden önce gelir (while I was studying). 'during two hours' yanlıştır. By 'en geç' anlamında son tarih bildirir (Submit it by Friday); until ise bir durumun o ana kadar sürdüğünü söyler (The library is open until Friday).",
      [["Please send your slides by noon on Thursday.", "Lütfen slaytlarını en geç perşembe öğlen gönder."], ["I fell asleep during the film.", "Film sırasında uyuyakaldım."]],
      "Write an Email'de son tarih yazarken ve Listening duyurularında tarih/saat bilgisini doğru anlamak için kritik.",
      q("Choose the correct option: 'The report must be submitted ___ Friday at 5 p.m.'", ["until", "by", "during", "since"], 1, "Son tarih (en geç) by ile verilir."),
    ),
    checks: [q("Complete: 'I have lived in this dorm ___ September.'", ["for", "since", "during", "by"], 1, "Başlangıç noktası: since September.")],
  }),
  L("G9.3", "Akademik edat öbekleri: due to, because of, in terms of, with regard to", "B2", [["because of it rained", "because it rained"]], ["AD"], {
    ozet: ozet(
      "Edat öbeğinden sonra isim öbeği gelir: because of the rain; tam cümleden önce because.",
      "Because of, due to, owing to ve as a result of edattır; arkalarından isim öbeği veya -ing gelir: 'because of the delay'. Ardından tam cümle gelecekse because, since veya as kullanılır: 'because the flight was delayed'. In terms of 'açısından', with regard to / regarding 'ile ilgili olarak' anlamındadır ve akademik e-posta ile tartışmada konuyu çerçeveler. 'regarding to' yanlıştır. Bu öbekleri aşırı kullanmak üslubu ağırlaştırır.",
      [["The event was postponed due to the storm.", "Etkinlik fırtına nedeniyle ertelendi."], ["In terms of cost, the second plan is more realistic.", "Maliyet açısından ikinci plan daha gerçekçi."]],
      "Academic Discussion'da neden-sonuç kurarken ve Reading'de akademik bağlantı öbeklerini tanırken gerekir.",
      q("Choose the correct sentence.", ["The class was cancelled because of the teacher was sick.", "The class was cancelled because the teacher was sick.", "The class was cancelled due to the teacher was sick.", "The class was cancelled because of sick teacher was."], 1, "Tam cümleden önce because gelir; because of'tan sonra isim öbeği gerekir."),
    ),
    checks: [q("Complete: '___ cost, the bus is the best option.'", ["In terms of", "Because", "Due", "Regarding to"], 0, "In terms of + isim: maliyet açısından. 'Regarding to' yanlış bir kalıptır.")],
  }),

  // ── Modül 10 — Söylem ve akademik dil ───────────────────────────────────
  L("G10.1", "Bağlaçlar ve söylem işaretleri", "B1–C1", [["Ekleme anlamında: On the other hand", "In addition"]], ["AD", "LS"], { legacy: ["g024"] }),
  L("G10.2", "Referans ve bağdaşıklık: this + isim, such, the former / the latter", "C1", [["Belirsiz: This is important", "This change is important"]], ["AD", "RD"], {
    ozet: ozet(
      "Belirsiz 'this' yerine 'this + isim' kullan: This change, This approach; iki seçenekte the former / the latter.",
      "Akademik yazıda önceki cümleye geri dönmek için this, that, such ve the former / the latter kullanılır. Tek başına 'This is important' okuru hangi fikrin kastedildiğini tahmin etmeye zorlar; 'This change' veya 'This approach' demek bağı netleştirir. 'Such + isim' 'bu tür' anlamında bir kategoriye gönderme yapar. The former birinci, the latter ikinci seçeneği gösterir ve yalnız iki öğe varken kullanılır. İyi referans aynı ismi tekrar etmeden fikri izlenebilir kılar.",
      [["Some schools ban phones, while others teach responsible use. The latter seems more realistic.", "Bazı okullar telefonu yasaklar, bazıları sorumlu kullanımı öğretir. İkincisi daha gerçekçi görünüyor."], ["Prices rose by 20 percent. This increase surprised local businesses.", "Fiyatlar yüzde 20 arttı. Bu artış yerel işletmeleri şaşırttı."]],
      "Academic Discussion'da fikirleri bağlarken ve Read an Academic Passage'ta 'this' ifadesinin neye gönderme yaptığı sorularında kullanılır.",
      q("Which continuation is clearest? 'The city added bike lanes and reduced parking.'", ["This is good.", "This change encouraged more cycling.", "It is that good.", "These is helpful."], 1, "'This change' hangi fikre gönderme yapıldığını açıkça gösterir."),
    ),
  }),
  L("G10.3", "Register: e-posta tonu ve resmiyet düzeyi", "B1–C1", [["Hey professor, I want…", "Dear Professor Lee, I was wondering if…"]], ["EM"], {
    checks: [q("Which opening is best for an email to a professor?", ["Hey professor, I want the slides.", "Dear Professor Lee, I was wondering if you could share the slides.", "Professor! Send slides.", "Hi Lee, give me the slides pls."], 1, "Resmî selamlama ve dolaylı rica: Dear Professor Lee, I was wondering if…")],
  }),
  L("G10.4", "Bilgi odağı: cleft, fronting, vurgulayıcı do", "C1–C2", [["Important is that…", "What is important is that…"]], ["AD", "INT"], { legacy: ["g029"] }),
  L("G10.5", "Inversion", "C1", [["Not only he studied…", "Not only did he study…"]], ["AD"], { legacy: ["g027"] }),
  L("G10.6", "Ellipsis ve substitution", "C1–C2", [["I think yes", "I think so"]], ["INT"], { legacy: ["g035"] }),
  L("G10.7", "Tutum ve olasılık nüansı: arguably, is bound to, is unlikely to", "C2", [["'maybe' aşırı kullanımı", "it is likely that, perhaps"]], ["AD", "INT"], { legacy: ["g031"] }),
  L("G10.8", "Üslup düzenleme: sadeleştirme, tekrar azaltma, cümle uzunluğu", "C2", [["Anlamı bulanıklaştıran aşırı uzun cümle", "İki kısa, açık cümle"]], ["AD", "EM"], {
    ozet: ozet(
      "Uzun cümleyi böl, tekrarı ve dolgu ifadelerini azalt; her cümleye bir ana iş ver.",
      "C2 düzeyinde amaç daha karmaşık değil, daha açık yazmaktır. Bir cümle iki üç ana fikri taşıyorsa ikiye bölmek okumayı kolaylaştırır. Aynı ismi tekrarlamak yerine zamir, 'this + isim' veya eşanlamlı kullanılabilir. Boş dolgu ifadeleri (it is a fact that, in today's world) çıkarılır. Cümle uzunluğunu değiştirmek ritim katar: kısa bir cümle önemli bir noktayı vurgular. Academic Discussion'da açık bir iddia ve somut bir gerekçe, süslü ama bulanık bir paragraftan daha etkilidir.",
      [["The plan is cheap. More importantly, it can start next month.", "Plan ucuz. Daha önemlisi, gelecek ay başlayabilir."], ["Many students are tired by Friday.", "Pek çok öğrenci cumaya kadar yorgun düşüyor. ('It is a fact that…' gibi bir dolgu gerekmez.)"]],
      "Write for an Academic Discussion ve Write an Email'de sınırlı sürede anlaşılır metin üretmek için kullanılır.",
      q("Which revision is clearest?", ["In today's modern world of today, it is a fact that technology is important.", "Technology plays a central role in how students study.", "It can be said that technology is a thing that is important.", "Technology, which is important, is important for students."], 1, "Doğrudan iddia ve somut alan içeren tek cümle en açık olanıdır."),
    ),
  }),
  L("G10.9", "Akademik eşdizimler ve kalıp öbekler", "C1", [["make a research", "conduct research"]], ["AD", "CW"], { legacy: ["g030"], added: true }),

  // ── Modül 11 — Yazım mekaniği ───────────────────────────────────────────
  L("G11.1", "Noktalama: virgül, run-on ve comma splice", "B1", [["I was tired, I went home", "I was tired, so I went home"]], ["EM", "AD"], {
    ozet: ozet(
      "İki tam cümleyi yalnız virgülle bağlama; nokta, noktalı virgül veya virgül + bağlaç kullan.",
      "İki bağımsız cümleyi yalnızca virgülle birleştirmek (comma splice) İngilizcede hatadır: 'I was tired, I went home.' Düzeltmenin üç yolu vardır: nokta (I was tired. I went home.), virgül + bağlaç (I was tired, so I went home.) veya noktalı virgül (I was tired; I went home.). However ve therefore bağlaç değil zarftır; önlerine nokta veya noktalı virgül gelir: 'I was tired; however, I finished.' Giriş öbeğinden sonra virgül kullanılır: 'After class, I studied.'",
      [["The deadline was close, so we divided the tasks.", "Son tarih yaklaşıyordu, bu yüzden görevleri paylaştık."], ["The data looked strong; however, the sample was small.", "Veriler güçlü görünüyordu; ancak örneklem küçüktü."]],
      "Write an Email ve Academic Discussion'da cümle sınırlarını doğru çizmek anlaşılırlığı doğrudan etkiler.",
      q("Choose the correctly punctuated sentence.", ["The bus was late, I missed the start.", "The bus was late, so I missed the start.", "The bus was late, however I missed the start.", "The bus was late so, I missed the start."], 1, "İki tam cümle virgül + bağlaç (so) ile doğru bağlanır."),
    ),
    checks: [
      q("Which sentence is a comma splice?", ["I finished the essay, and I submitted it.", "I finished the essay. I submitted it.", "I finished the essay, I submitted it.", "After I finished the essay, I submitted it."], 2, "İki tam cümle yalnızca virgülle bağlanmış."),
      q("Choose the correct punctuation.", ["The results were clear, therefore we stopped.", "The results were clear; therefore, we stopped.", "The results were clear therefore, we stopped.", "The results were clear, therefore, we stopped."], 1, "therefore bir zarftır: önünde noktalı virgül, arkasında virgül."),
    ],
  }),
  L("G11.2", "Büyük harf, sık yazım hataları ve e-posta biçimi", "A2–B1", [["english, i think", "English, I think"]], ["EM"], {
    ozet: ozet(
      "I, dil/milliyet/ülke, gün ve ay adları büyük harfle; e-postada selamlama ve kapanış biçimi.",
      "İngilizcede 'I' zamiri her zaman büyük yazılır. Dil, milliyet, ülke, gün ve ay adları da büyük harfle başlar: English, Turkish, Monday, January — Türkçeden farklı olarak 'english' veya 'monday' yanlıştır. Ders ve kurum adları özel isim olarak büyük harf alır (Introduction to Biology). E-postada 'Dear Professor Lee,' ile başlanır; son paragraftan sonra 'Best regards,' ve ad gelir. Sık yazım hataları: recieve → receive, definately → definitely, untill → until.",
      [["I will finish the English essay by Monday.", "İngilizce makaleyi pazartesiye kadar bitireceğim."], ["Dear Dr. Aydın, I am writing to ask about the lab schedule.", "Sayın Dr. Aydın, laboratuvar programını sormak için yazıyorum."]],
      "Write an Email görevinde biçim ve doğruluk izlenimini doğrudan etkiler.",
      q("Choose the correct sentence.", ["i think the english class starts on monday.", "I think the English class starts on Monday.", "I think the english class starts on Monday.", "I think the English class starts on monday."], 1, "I, English ve Monday büyük harfle yazılır."),
    ),
    checks: [
      q("Which word is spelled correctly?", ["recieve", "receive", "receeve", "riceive"], 1, "Kural: c'den sonra ei (receive)."),
      q("Choose the best email closing.", ["Best regards, Deniz Yılmaz", "bye!!", "best regards deniz", "Regards. deniz yılmaz"], 0, "Resmî kapanış büyük harfle ve virgülle: Best regards, + ad soyad."),
    ],
  }),
];

// v0.8: topics that had no lesson of their own (would, used to, get, subjunctive …).
const EXTRA_DRILLS = {};
for (const [code, title, level, mistakes, tasks, summary, drills, extra = {}] of EXTRA_LESSONS) {
  LESSON_LIST.push({ ...L(code, title, level, mistakes, tasks, { ozet: summary, added: false }), family: extra.family ?? null, table: extra.table ?? null, verbs: extra.verbs === true });
  EXTRA_DRILLS[code] = drills;
}
const minor = (code) => code.slice(1).split(".").map(Number);
LESSON_LIST.sort((a, b) => minor(a.code)[0] - minor(b.code)[0] || minor(a.code)[1] - minor(b.code)[1]);
const drillsFor = (code) => (DRILLS[code] ?? EXTRA_DRILLS[code] ?? []).map((item, index) => Object.freeze({ id: `${code}-d${index + 1}`, ...item }));
const NEW_IN_V08 = new Set(EXTRA_LESSONS.map(([code]) => code));

const FULL = { ...FULL_LESSONS_A, ...FULL_LESSONS_B };
const MICRO = new Map(microLessons.map((lesson) => [lesson.id, lesson]));

export const LESSONS = Object.freeze(LESSON_LIST.map((lesson) => Object.freeze({ ...lesson, table: lesson.table ?? LESSON_TABLES[lesson.code] ?? null, family: lesson.family ?? null, verbs: lesson.verbs === true, full: FULL[lesson.code] ?? null, drills: drillsFor(lesson.code), isNew: NEW_IN_V08.has(lesson.code) })));
export const LESSON_BY_CODE = new Map(LESSONS.map((lesson) => [lesson.code, lesson]));

/** v0.1 micro lesson id → G code. The micro lesson is the lesson's Özet layer. */
export const LEGACY_TO_CODE = Object.freeze(Object.fromEntries(
  LESSONS.flatMap((lesson) => lesson.legacy.map((id) => [id, lesson.code])),
));

export function microLesson(id) {
  return MICRO.get(id) ?? null;
}

/** Normalised Özet blocks: one per mapped micro lesson, or the new written Özet. */
export function summaryBlocks(lesson) {
  if (lesson.legacy.length) return lesson.legacy.map((id) => MICRO.get(id)).filter(Boolean);
  if (lesson.ozet) return [{ id: lesson.code, title: lesson.title, level: lesson.level, ...lesson.ozet, commonMistake: lesson.mistakes.map((m) => `${m.wrong} → ${m.right}`).join(" · ") }];
  if (lesson.full) {
    return [{
      id: lesson.code,
      title: lesson.title,
      level: lesson.level,
      summary: lesson.full.function,
      explanation: lesson.full.recap.join(" "),
      examples: lesson.full.examples.slice(0, 2).map(([en, tr]) => ({ en, tr })),
      commonMistake: lesson.full.mistakes.map(([wrong, right]) => `${wrong} → ${right}`).join(" · "),
      examUse: lesson.full.exam,
      quiz: lesson.checks[0] ?? null,
    }];
  }
  return [];
}

/** Every check question tied to a lesson (Özet quiz(zes) + extra checks). */
export function lessonChecks(lesson) {
  const fromSummary = summaryBlocks(lesson).map((block) => block.quiz).filter(Boolean);
  const all = [...fromSummary, ...lesson.checks];
  const seen = new Set();
  return all.filter((check) => {
    const key = check.question + check.options.join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Optional module screening: 6–8 questions, round-robin across the module's
 * lessons (priority lessons first). It routes to lessons; it never scores.
 */
export function screeningFor(moduleId, limit = 8) {
  const lessons = LESSONS.filter((lesson) => lesson.module === Number(moduleId));
  const ordered = [...lessons.filter((l) => l.priority), ...lessons.filter((l) => !l.priority)];
  const pools = ordered.map((lesson) => ({ lesson, checks: lessonChecks(lesson) }));
  const picked = [];
  for (let round = 0; picked.length < limit; round += 1) {
    let added = false;
    for (const { lesson, checks } of pools) {
      if (picked.length >= limit) break;
      if (checks[round]) {
        picked.push({ id: `${lesson.code}#${round}`, code: lesson.code, ...checks[round] });
        added = true;
      }
    }
    if (!added) break;
  }
  return picked;
}

/** Task-item grammar tags → lesson codes (CONTENT-SPEC "Etiketleme"). */
export const GRAMMAR_TAGS = Object.freeze({
  "indirect-question": ["G7.3"],
  "subject-verb-agreement": ["G2.11"],
  article: ["G2.2", "G2.3"],
  "word-order": ["G1.1"],
  preposition: ["G9.1"],
  passive: ["G3.7"],
  "passive-infinitive": ["G3.8"],
  "academic-grammar": ["G3.8"],
  concession: ["G7.7"],
  "clause-order": ["G7.7"],
  condition: ["G5.1"],
  conditions: ["G5.5"],
  counterfactual: ["G5.3"],
  cause: ["G9.3"],
  "cause-effect": ["G7.6"],
  reasons: ["G7.6"],
  politeness: ["G1.5"],
  request: ["G1.5"],
  email: ["G10.3"],
  qualification: ["G4.5"],
  argument: ["G10.1"],
  "balanced-argument": ["G10.1"],
  narrative: ["G3.6"],
  pronoun: ["G2.6"],
  suffixes: ["G2.1", "G2.8"],
  "word-forms": ["G2.1", "G2.8"],
  morphology: ["G2.1", "G2.13"],
  "word-formation": ["G2.13"],
  "relative-clause": ["G7.1"],
  "present-perfect": ["G3.3"],
  "gerund-infinitive": ["G6.1"],
  "conditional-second": ["G5.2"],
  "past-modal": ["G4.4"],
  inversion: ["G10.5"],
});

export function lessonsForTags(tags = []) {
  const codes = [];
  for (const tag of tags) for (const code of GRAMMAR_TAGS[tag] ?? []) if (!codes.includes(code)) codes.push(code);
  return codes.map((code) => LESSON_BY_CODE.get(code)).filter(Boolean);
}

/** Screens of the Tam anlatım reader (3–5 short phone screens). */
export const FULL_SCREENS = Object.freeze([
  { id: "core", label: "İşlev ve yapı" },
  { id: "use", label: "Kullanım ve karşılaştırma" },
  { id: "mistakes", label: "Sık hatalar ve örnekler" },
  { id: "practice", label: "Alıştırma" },
  { id: "wrap", label: "Sınav, konuşma, özet" },
]);
