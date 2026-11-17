// Tam anlatım — priority batch, part 1 (CONTENT-SPEC v4 lesson template).
// Original, AI-assisted text. reviewStatus: unreviewed (see GRAMMAR_META).

const R = {
  mc: (prompt, options, answer, why) => ({ stage: "recognition", type: "mcq", prompt, options, answer, why }),
  gap: (prompt, answer, why, accept = []) => ({ stage: "recognition", type: "gap", prompt, answer, accept, why }),
};
const T = {
  mc: (prompt, options, answer, why) => ({ stage: "transformation", type: "mcq", prompt, options, answer, why }),
  gap: (prompt, answer, why, accept = []) => ({ stage: "transformation", type: "gap", prompt, answer, accept, why }),
  rw: (prompt, source, answer, why, accept = []) => ({ stage: "transformation", type: "rewrite", prompt, source, answer, accept, why }),
};
const P = {
  order: (prompt, tokens, answer, why, accept = []) => ({ stage: "production", type: "order", prompt, tokens, answer, accept, why }),
  free: (prompt, model, checklist) => ({ stage: "production", type: "free", prompt, model, checklist }),
};
const V = {
  mc: (prompt, options, answer, why) => ({ type: "mcq", prompt, options, answer, why }),
  gap: (prompt, answer, why, accept = []) => ({ type: "gap", prompt, answer, accept, why }),
};
export function F(code, lesson) {
  return {
    ...lesson,
    exercises: lesson.exercises.map((item, index) => ({ id: `${code}-e${index + 1}`, ...item })),
    review: lesson.review.map((item, index) => ({ id: `${code}-r${index + 1}`, ...item })),
  };
}
export { R, T, P, V };

export const FULL_LESSONS_A = {
  "G1.3": F("G1.3", {
    function: "Bilgi istemek, bir şeyi reddetmek ve konuşmayı sürdürmek için soru ve olumsuz cümle kurarız. İngilizcede bunun anahtarı yardımcı fiildir.",
    structure: {
      head: ["Tür", "Kalıp", "Örnek"],
      rows: [
        ["Olumsuz (present)", "özne + do/does + not + yalın fiil", "She doesn't live on campus."],
        ["Olumsuz (past)", "özne + did + not + yalın fiil", "We didn't finish the lab."],
        ["Evet/hayır sorusu", "Do/Does/Did + özne + yalın fiil?", "Did you get my email?"],
        ["Wh- sorusu", "Wh- + do/does/did + özne + yalın fiil?", "Where do you usually study?"],
        ["Özne sorusu", "Who/What + fiil? (yardımcı yok)", "Who sent the message?"],
        ["be / modal", "be veya modal öne geçer; do eklenmez", "Is the office open? Can you help?"],
      ],
    },
    usage: "Türkçede soru '-mı' ekiyle ve tonlamayla yapılır; kelime sırası değişmez. İngilizcede ise yardımcı fiil öznenin önüne geçer. Cümlede be veya can/will gibi bir modal varsa o öne alınır; yoksa do, does veya did eklenir. Yardımcı fiil zamanı ve kişiyi taşıdığı için ana fiil yalın kalır: 'Does she study?' (studies değil), 'Did you go?' (went değil). Olumsuzda da aynı kural geçerlidir: 'I didn't see it.'",
    contrast: {
      title: "Nesne sorusu – özne sorusu",
      text: "Who/What öznenin kendisini soruyorsa yardımcı fiil kullanılmaz ve cümle düz sıradadır. Nesneyi soruyorsa did/do gelir. Türkçede ayrım eklerle (kim / kimi) yapılır; İngilizcede did'in varlığıyla.",
      pairs: [["Who called you?", "Seni kim aradı? (özne)"], ["Who did you call?", "Sen kimi aradın? (nesne)"], ["What happened?", "Ne oldu? (özne; did yok)"]],
    },
    mistakes: [
      ["Where you live?", "Where do you live?", "Wh- sorusunda yardımcı fiil (do) özneden önce gelmeli."],
      ["Who did call you?", "Who called you?", "Özne sorulduğunda did eklenmez."],
      ["She doesn't works here.", "She doesn't work here.", "does zaten -s bilgisini taşır; ana fiil yalın kalır."],
    ],
    examples: [
      ["Does this bus stop at the library?", "Bu otobüs kütüphanede duruyor mu?", "kampüs"],
      ["Why didn't the experiment work the second time?", "Deney ikinci seferde neden işe yaramadı?", "akademik"],
      ["Who organized the conference last year?", "Geçen yıl konferansı kim düzenledi?", "akademik"],
      ["I don't usually study at night, but this week I did.", "Genelde gece çalışmam ama bu hafta çalıştım.", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the correct question.", ["What time the lab opens?", "What time does the lab open?", "What time does the lab opens?", "What time do the lab open?"], 1, "Wh- + does + özne + yalın fiil: does the lab open."),
      R.gap("___ you finish the reading yesterday? (one word)", "Did", "Geçmiş zamanda evet/hayır sorusu Did ile başlar."),
      T.rw("Make the sentence negative.", "He studied for the quiz.", "He didn't study for the quiz.", "Geçmiş olumsuzda didn't + yalın fiil: studied → didn't study.", ["He did not study for the quiz."]),
      T.rw("Ask a question about the person who did the action. Start with 'Who'.", "Lena booked the room.", "Who booked the room?", "Özne sorulduğu için did kullanılmaz; fiil geçmiş biçimini korur."),
      P.order("Build the question.", ["study", "you", "where", "usually", "do"], "Where do you usually study?", "Wh- + do + özne + sıklık zarfı + yalın fiil."),
      P.free("Write two questions you could ask a classmate about their study routine: one yes/no question and one wh- question.", "Do you study better in the morning? What do you do when you feel tired?", ["Bir evet/hayır, bir wh- sorusu var", "Yardımcı fiil özneden önce", "does/did sonrası ana fiil yalın"]),
    ],
    review: [
      V.mc("Choose the correct question.", ["Why you didn't come?", "Why didn't you come?", "Why didn't you came?", "Why you not came?"], 1, "Wh- + didn't + özne + yalın fiil."),
      V.gap("What ___ your sister do? — She's a nurse. (one word)", "does", "Üçüncü tekil özne (your sister) için does."),
      V.mc("Choose the correct subject question.", ["What did happen next?", "What happened next?", "What does happened next?", "What happen next?"], 1, "What özne olduğunda yardımcı fiil gelmez: What happened?"),
    ],
    exam: "Build a Sentence görevinde sık sık bir soru veya soruya cevap kurarsın; yardımcı fiilin yeri en çok sınanan noktadır. Listen and Choose a Response'ta soru türünü (evet/hayır mı, wh- mi) hızla tanımak doğru cevabı seçtirir.",
    speaking: { pattern: "What do you usually do when…?", model: "What do you usually do when you have a difficult assignment? — I usually start with the easiest part.", step: "Kalıbı yüksek sesle üç kez söyle, sonra kendi cevabını tek cümleyle ver." },
    recap: ["Soru ve olumsuzda yardımcı fiil (do/does/did) zamanı taşır; ana fiil yalın kalır.", "be ve modallar öne geçer; do eklenmez.", "Özne sorusunda (Who called?) yardımcı fiil kullanılmaz."],
  }),

  "G2.1": F("G2.1", {
    function: "Bir şeyin sayısını ya da miktarını doğru belirtmek, ismin sayılabilir mi sayılamaz mı olduğunu bilmeye bağlıdır.",
    structure: {
      head: ["İsim türü", "Kalıp", "Örnek"],
      rows: [
        ["Sayılabilir tekil", "a/an/the/one + isim", "a lecture, one task"],
        ["Sayılabilir çoğul", "sayı / many / (a) few + isim-s", "three lectures, many tasks"],
        ["Sayılamaz", "some / much / (a) little + isim (çoğul eki yok)", "some information, much advice"],
        ["Sayılamazı saymak", "a piece of / an item of + isim", "two pieces of advice"],
        ["Düzensiz çoğul", "ezber gerekir", "person → people, analysis → analyses, criterion → criteria"],
      ],
    },
    usage: "Türkçede sayıdan sonra isim tekil kalır ('üç kitap'); İngilizcede birden fazla sayılabilir isim -s alır: 'three books'. Information, advice, equipment, research, homework, feedback, furniture gibi isimler İngilizcede sayılamaz; -s almaz ve a/an ile kullanılmaz. Bunları saymak için 'a piece of feedback', 'an item of equipment' gibi ölçü ifadeleri kullanılır. Bazı isimler iki türde de kullanılır ama anlam değişir: 'paper' (kâğıt, sayılamaz) – 'a paper' (bir makale).",
    contrast: {
      title: "many / much, a few / a little",
      text: "Many ve (a) few sayılabilir çoğulla, much ve (a) little sayılamazla gelir. Olumlu cümlede much yerine çoğunlukla 'a lot of' daha doğal duyulur.",
      pairs: [["many questions", "much information"], ["a few tips", "a little advice"], ["How many tasks?", "How much time?"]],
    },
    mistakes: [
      ["three book", "three books", "Sayıdan sonra sayılabilir isim çoğul olur."],
      ["informations / advices", "information / advice", "Bu isimler sayılamaz; -s almaz."],
      ["a research", "a study / some research", "research sayılamaz; tek bir çalışma için a study kullanılır."],
    ],
    examples: [
      ["The professor gave us some useful feedback on our drafts.", "Hoca taslaklarımız hakkında bize faydalı geri bildirim verdi.", "kampüs"],
      ["Two criteria were used to select the participants.", "Katılımcıları seçmek için iki ölçüt kullanıldı.", "akademik"],
      ["Can I ask you a few questions about the course?", "Ders hakkında size birkaç soru sorabilir miyim?", "konuşma"],
      ["The lab needs new equipment, but there isn't much money left.", "Laboratuvarın yeni ekipmana ihtiyacı var ama fazla para kalmadı.", "kampüs"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["She gave me two advices.", "She gave me two pieces of advice.", "She gave me two advice.", "She gave me an advices."], 1, "advice sayılamaz; saymak için pieces of kullanılır."),
      R.gap("How ___ homework do we have this week? (one word)", "much", "homework sayılamaz: How much."),
      T.rw("Correct the sentence.", "We need more informations about the three course.", "We need more information about the three courses.", "information sayılamaz (‑s yok); three'den sonra courses çoğul."),
      T.gap("One analysis was not enough, so the team ran two more ___ . (plural of 'analysis')", "analyses", "analysis → analyses düzensiz çoğuldur."),
      P.order("Build the sentence.", ["questions", "reading", "a", "the", "I", "about", "few", "have"], "I have a few questions about the reading.", "a few + sayılabilir çoğul (questions)."),
      P.free("Write two sentences about your study space: one with a countable noun and one with an uncountable noun.", "There are three desks near the window. There isn't much noise in the afternoon.", ["Sayılabilir isim doğru tekil/çoğul", "Sayılamaz isim -s almadan", "many/much veya a few/a little doğru eşleşmiş"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["There are many equipments in the lab.", "There is a lot of equipment in the lab.", "There is many equipment in the lab.", "There are a lot of equipments in the lab."], 1, "equipment sayılamaz; tekil fiil ve -s'siz."),
      V.gap("I only need a ___ minutes to finish. (one word)", "few", "minutes sayılabilir çoğul: a few."),
      V.mc("Which word is uncountable?", ["assignment", "furniture", "chair", "lecture"], 1, "furniture sayılamaz; diğerleri sayılabilir."),
    ],
    exam: "Complete the Words görevinde kelimenin sonunu tamamlarken -s'nin gerekip gerekmediğini çoğu zaman bu kural belirler. Write an Email'de 'some information', 'a few questions' gibi doğru öbekler dili daha doğal gösterir.",
    speaking: { pattern: "There are a few… but there isn't much…", model: "There are a few quiet rooms on campus, but there isn't much space during exams.", step: "Kendi kampüsün veya evin için aynı kalıpla iki cümle söyle; çoğul -s seslerini net çıkar." },
    recap: ["Sayıdan sonra sayılabilir isim çoğul olur: three books.", "information, advice, research, equipment, feedback sayılamaz; -s ve a/an almaz.", "many/a few sayılabilir, much/a little sayılamaz isimle gelir."],
  }),

  "G2.2": F("G2.2", {
    function: "Artikel, dinleyiciye ismin yeni mi yoksa bilinen bir şey mi olduğunu söyler. Türkçede bu bilgi çoğu zaman bağlamda kalır; İngilizcede tekil sayılabilir isim artikelsiz kalamaz.",
    structure: {
      head: ["Durum", "Artikel", "Örnek"],
      rows: [
        ["Tekil; ilk kez veya herhangi biri", "a / an", "I have a question."],
        ["Ünlü SES ile başlayan kelime", "an", "an hour, an essay (ama a university)"],
        ["Dinleyicinin bildiği, tek olan veya daha önce anılan", "the", "The question is about the deadline."],
        ["Meslek, kimlik", "a / an", "She is a student. He's an engineer."],
        ["Genel çoğul veya sayılamaz", "artikel yok", "Students need sleep."],
      ],
    },
    usage: "Tekil sayılabilir bir isim cümlede tek başına duramaz: 'I am student' değil, 'I am a student'. A/an seçimi yazılışa değil sese göre yapılır: 'an hour' (h okunmaz), 'a university' (/juː/ ile başlar). Bir şeyi ilk kez anarken a/an, ikinci kez veya herkesin bildiği bir şey olarak anarken the kullanılır: 'I found a book. The book was in Spanish.' Tek olan şeyler (the sun, the main library) ve sıra sayıları (the first) da the alır.",
    contrast: {
      title: "a – the",
      text: "A 'herhangi bir', the 'ikimizin de bildiği' demektir. Aynı cümle artikel değişince farklı anlam taşır.",
      pairs: [["Can you open a window?", "Herhangi bir pencere"], ["Can you open the window?", "Hangisi olduğunu ikimiz de biliyoruz"]],
    },
    mistakes: [
      ["I am student.", "I am a student.", "Meslek ve kimlik bildiren tekil isim a/an ister."],
      ["an university", "a university", "university /juː/ ünsüz sesiyle başlar."],
      ["The students need sleep. (genel anlamda)", "Students need sleep.", "Genel bir doğru söylerken çoğul isim artikelsiz kullanılır."],
    ],
    examples: [
      ["I'm a first-year student in the biology department.", "Biyoloji bölümünde birinci sınıf öğrencisiyim.", "konuşma"],
      ["There's a problem with the printer on the second floor.", "İkinci kattaki yazıcıda bir sorun var.", "kampüs"],
      ["The meeting lasted an hour, but the decision took a minute.", "Toplantı bir saat sürdü ama karar bir dakika aldı.", "kampüs"],
      ["A sample of 200 adults was surveyed. The sample included two age groups.", "200 yetişkinden oluşan bir örneklemle anket yapıldı. Örneklem iki yaş grubunu içeriyordu.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["My brother is engineer.", "My brother is a engineer.", "My brother is an engineer.", "My brother is the engineer job."], 2, "Meslek için a/an; engineer ünlü sesle başlar: an."),
      R.gap("I waited for ___ hour at the office. (one word)", "an", "hour'da h okunmaz; ünlü ses: an hour."),
      T.rw("Add the missing articles.", "I read article about sleep. Article was very useful.", "I read an article about sleep. The article was very useful.", "İlk anışta an (article ünlü sesle başlar), ikinci anışta the."),
      T.mc("Choose the best sentence for a general statement.", ["The books are expensive these days.", "Books are expensive these days.", "A books are expensive these days.", "Book are expensive these days."], 1, "Genel anlamda çoğul isim artikelsiz kullanılır."),
      P.order("Build the sentence.", ["near", "a", "there", "house", "university", "my", "is"], "There is a university near my house.", "university ünsüz /j/ sesiyle başlar: a university.", ["Near my house there is a university."]),
      P.free("Introduce yourself in two sentences: your role (student, worker…) and one place you often go.", "I'm a second-year economics student. I often study at a small café near the station.", ["Rol/meslek a veya an ile", "a/an seçimi sese göre", "İkinci kez anılan isim için the"]),
    ],
    review: [
      V.mc("Choose the correct option: 'She bought ___ umbrella because it was raining.'", ["a", "an", "the", "no article"], 1, "umbrella ünlü sesle başlar ve ilk kez anılıyor: an."),
      V.gap("Excuse me, where is ___ nearest bus stop? (one word)", "the", "En yakın durak tek ve belirlidir (superlative): the."),
      V.mc("Choose the correct sentence.", ["He is a honest person.", "He is an honest person.", "He is honest a person.", "He is the honest person always."], 1, "honest'ta h okunmaz: an honest."),
    ],
    exam: "Writing görevlerinin hepsinde artikel hataları anlamı çok bozmaz ama sık tekrarlanınca dil kontrolü izlenimini düşürür. Build a Sentence'ta a/an/the öbeğin başına gelir; doğru isimle eşleştirmek sırayı bulmanı kolaylaştırır.",
    speaking: { pattern: "I'm a… and I usually… at the…", model: "I'm a computer science student, and I usually study at the main library.", step: "Kalıbı kendi bilginle üç kez söyle; a/an'ı yutmadan ama kısa ve hafif söyle." },
    recap: ["Tekil sayılabilir isim artikelsiz kalmaz: a student.", "a/an sese göre seçilir: an hour, a university.", "İlk anış a/an, ikinci anış veya bilinen şey the; genel çoğulda artikel yok."],
  }),

  "G2.3": F("G2.3", {
    function: "Akademik metinde bir kavramdan genel olarak mı yoksa belirli bir örnekten mi söz ettiğini artikel gösterir. Yanlış seçim iddianın kapsamını değiştirir.",
    structure: {
      head: ["Anlam", "Kalıp", "Örnek"],
      rows: [
        ["Genel kavram (sayılamaz)", "Ø + isim", "Technology changes how we learn."],
        ["Genel sınıf (çoğul)", "Ø + çoğul isim", "Smartphones affect sleep."],
        ["Türün temsilcisi (resmî)", "the + tekil isim", "The smartphone has changed communication."],
        ["Sınırlandırılmış, belirli", "the + isim + of/that…", "The technology used in this study was new."],
        ["Tek örnek", "a/an + tekil isim", "A recent study found…"],
      ],
    },
    usage: "Türkçede 'teknoloji hayatı değiştiriyor' derken genel anlam kastedilir ve isim yalın kalır. İngilizcede de genel anlamdaki sayılamaz ve çoğul isimler artikelsiz kullanılır: 'Technology changes life.' Ama isim bir öbek veya yan cümleyle sınırlandırıldığında belirli hâle gelir ve the alır: 'the technology used in classrooms', 'the life of a student'. Akademik dilde 'the + tekil isim' bir türün tamamını temsil edebilir (The honeybee is a social insect); bu kullanım resmî ve sınırlıdır.",
    contrast: {
      title: "Genel – sınırlandırılmış",
      text: "Aynı isim, arkasına of veya bir yan cümle eklenince çoğunlukla the alır; çünkü artık hangi kısmından söz edildiği bellidir.",
      pairs: [["Education is important.", "Genel olarak eğitim"], ["The education of girls improved.", "Kızların eğitimi (sınırlı)"], ["Research takes time.", "Genel olarak araştırma"], ["The research that we read was outdated.", "Okuduğumuz araştırma"]],
    },
    mistakes: [
      ["The technology changes the life.", "Technology changes life.", "Genel anlamdaki sayılamaz isimler the almaz."],
      ["The people are more stressed today. (genel)", "People are more stressed today.", "Genel çoğul isim artikelsizdir."],
      ["Population of the city grew.", "The population of the city grew.", "of ile sınırlandırılan isim belirlidir."],
    ],
    examples: [
      ["Sleep plays a key role in memory.", "Uyku bellekte önemli bir rol oynar.", "akademik"],
      ["The sleep of first-year students is often irregular.", "Birinci sınıf öğrencilerinin uykusu çoğu zaman düzensizdir.", "akademik"],
      ["I think social media makes people compare themselves too much.", "Bence sosyal medya insanların kendilerini çok fazla kıyaslamasına yol açıyor.", "konuşma"],
      ["The bikes that the university lends are free for students.", "Üniversitenin ödünç verdiği bisikletler öğrenciler için ücretsiz.", "kampüs"],
    ],
    exercises: [
      R.mc("Choose the best sentence.", ["The music helps many people relax.", "Music helps many people relax.", "A music helps many people relax.", "Musics help many people relax."], 1, "Genel anlamda sayılamaz isim artikelsiz: Music."),
      R.gap("___ water in this river is not safe to drink. (Write 'The' or '-' for no article.)", "The", "'in this river' ile sınırlandırıldığı için belirli: The water."),
      T.rw("Rewrite as a general statement (remove unnecessary articles).", "The children need the attention of the adults.", "Children need attention from adults.", "Genel çocuklar ve yetişkinler artikelsiz kullanılır.", ["Children need the attention of adults.", "Children need attention from adults."]),
      T.gap("We studied ___ history of the local port. (Write 'the' or '-' for no article.)", "the", "'of the local port' ile sınırlandırılmış: the history of…"),
      P.order("Build the sentence.", ["housing", "the", "worries", "of", "students", "cost"], "The cost of housing worries students.", "The cost of housing (sınırlandırılmış) + genel çoğul students (artikelsiz)."),
      P.free("Write a two-sentence opinion about public transport: one general statement and one specific statement.", "Public transport reduces traffic. The buses in my city, however, are often late.", ["Genel cümlede çoğul/sayılamaz isim artikelsiz", "Belirli cümlede the + sınırlandırma", "İki cümle aynı konuyu bağlıyor"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["The nature is beautiful in spring.", "Nature is beautiful in spring.", "A nature is beautiful in spring.", "Natures are beautiful in spring."], 1, "nature genel anlamda artikelsiz kullanılır."),
      V.gap("___ results of the second experiment were surprising. (Write 'The' or '-')", "The", "of the second experiment ile belirli."),
      V.mc("Which sentence is a general statement?", ["The coffee in this café is cold.", "Coffee contains caffeine.", "The coffee you made is strong.", "The coffee on the table is mine."], 1, "Genel bir doğru; sınırlandırma ve artikel yok."),
    ],
    exam: "Academic Discussion'da genel iddiadan (Technology helps students…) kendi örneğine (The app I use…) geçişi artikel gösterir. Complete the Words metinleri çoğunlukla genel akademik ifadeler içerir; the'nin yokluğu kavramın genel olduğunu işaretler.",
    speaking: { pattern: "In general, … But the … I know…", model: "In general, online courses are flexible. But the course I took last year was hard to follow.", step: "Bir genel, bir özel cümleyle kendi konunu söyle; the'yi zayıf ve hafif söyle." },
    recap: ["Genel anlamda sayılamaz ve çoğul isim artikelsiz: Technology, Students.", "of/that ile sınırlandırılan isim the alır: the cost of housing.", "the + tekil isim türün tamamını temsil edebilir; bu resmî bir kullanımdır."],
  }),

  "G2.7": F("G2.7", {
    function: "Türkçedeki '-in … -i' tamlamasını İngilizcede üç yolla kurarız. Doğru seçim cümleyi doğal ve anlaşılır kılar.",
    structure: {
      head: ["Kalıp", "Ne zaman", "Örnek"],
      rows: [
        ["sahip + 's + isim", "İnsan, hayvan, kurum, zaman", "the student's notes, the university's policy, today's lecture"],
        ["isim + of + sahip", "Cansız şey, soyut ilişki, bölüm-parça", "the end of the semester, the cause of the problem"],
        ["isim + isim (sınıflayıcı)", "Tür, amaç, malzeme; ilk isim sıfat gibi", "a history class, the table leg, a coffee cup"],
        ["çoğul + '", "-s ile biten çoğul sahip", "the students' lounge"],
      ],
    },
    usage: "Türkçede 'masanın ayağı', 'öğrencinin notu', 'tarih dersi' hepsi tamlamadır. İngilizcede kişi ve canlılar için genellikle 's kullanılır (the professor's office). Cansız nesnelerde ve soyut ilişkilerde of daha doğaldır (the title of the book, the end of the day). Bir isim diğerini sınıflandırıyorsa, yani 'ne tür' sorusuna cevap veriyorsa, isim + isim kullanılır: 'a history class', 'a bus stop'. Bu yapıda ilk isim tekil kalır ve vurgu çoğunlukla ilk isme düşer.",
    contrast: {
      title: "'s – of – isim + isim",
      text: "Üç yapı bazen birbirinin yerine geçebilir ama her birinin doğal alanı farklıdır.",
      pairs: [["the teacher's book", "Öğretmenin sahip olduğu kitap"], ["a teacher's book / a teacher book", "Öğretmenler için hazırlanmış kitap (tür)"], ["the cover of the book", "Kitabın kapağı (cansız, parça)"]],
    },
    mistakes: [
      ["the table's leg", "the table leg / the leg of the table", "Cansız nesnelerde 's yerine isim + isim veya of daha doğaldır."],
      ["a books store", "a bookstore / a book store", "Sınıflayıcı isim tekil kalır."],
      ["the car of my brother", "my brother's car", "Sahip kişi olduğunda 's daha doğaldır."],
    ],
    examples: [
      ["My roommate's laptop stopped working before the exam.", "Oda arkadaşımın dizüstü bilgisayarı sınavdan önce bozuldu.", "kampüs"],
      ["The results of the survey surprised the research team.", "Anketin sonuçları araştırma ekibini şaşırttı.", "akademik"],
      ["I need a library card to borrow these books.", "Bu kitapları ödünç almak için kütüphane kartına ihtiyacım var.", "kampüs"],
      ["The best part of my week is Friday's study group.", "Haftamın en güzel kısmı cuma günkü çalışma grubu.", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the most natural phrase.", ["the window's frame", "the window frame", "the frame window", "the frame's window"], 1, "Cansız nesne; sınıflayıcı isim + isim: the window frame."),
      R.mc("Choose the most natural phrase.", ["the office of the professor of mine", "my professor's office", "my professor office's", "the office professor"], 1, "Sahip kişi: my professor's office."),
      T.rw("Rewrite using 's.", "the opinion of my advisor", "my advisor's opinion", "Sahip kişi olduğu için 's doğaldır."),
      T.rw("Rewrite using of.", "the problem's cause", "the cause of the problem", "Soyut/cansız ilişkilerde of daha doğaldır."),
      P.order("Build the sentence.", ["January", "of", "the", "is", "semester", "end", "in", "the"], "The end of the semester is in January.", "Zaman dilimi ve parça ilişkisi: the end of the semester.", ["The end of the semester is in january."]),
      P.free("Describe your study space in two sentences using one 's phrase and one noun + noun phrase.", "My sister's desk is next to mine. We share a desk lamp and a phone charger.", ["Kişi sahip için 's", "İsim + isim yapısında ilk isim tekil", "Gerekirse cansız ilişki için of"]),
    ],
    review: [
      V.mc("Choose the most natural phrase.", ["a shoes shop", "a shoe shop", "a shoe's shop", "a shop of shoes for"], 1, "Sınıflayıcı isim tekil: a shoe shop."),
      V.gap("This is my ___ house. (possessive of 'parents')", "parents'", "-s ile biten çoğul sahipte yalnız kesme işareti eklenir: parents'."),
      V.mc("Choose the most natural phrase.", ["the meeting's beginning", "the beginning of the meeting", "the meeting beginning of", "the begin of meeting"], 1, "Olayın bir bölümü: the beginning of the meeting."),
    ],
    exam: "Complete the Words ve Read an Academic Passage'ta 'the rate of change' gibi isim öbeklerini doğru ayrıştırmak cümleyi hızlı anlamanı sağlar. Interview'da 'my friend's advice' gibi doğal tamlamalar dili akıcı gösterir.",
    speaking: { pattern: "One of my favorite… is my …'s …", model: "One of my favorite places is my grandmother's garden.", step: "Kendi örneğini söyle; 's sesini kısa ve net çıkar (/s/ veya /z/)." },
    recap: ["Kişi ve canlı sahip: 's (the student's notes).", "Cansız ve soyut ilişki: of (the end of the day).", "Tür/sınıf: isim + isim, ilk isim tekil (a history class)."],
  }),

  "G2.10": F("G2.10", {
    function: "Uzun bilgileri ismin önüne yığmak yerine ismin arkasına ekleriz. Akademik İngilizcede isim öbeği büyük ölçüde arkadan genişler.",
    structure: {
      head: ["Arkadan niteleyen", "Kalıp", "Örnek"],
      rows: [
        ["Edat öbeği", "isim + edat + isim", "a study on sleep, students from Turkey"],
        ["-ing (etken)", "isim + V-ing …", "students living on campus"],
        ["V3 (edilgen)", "isim + V3 …", "the report published in 2020"],
        ["to-infinitive (amaç, sıra)", "isim + to + fiil", "a place to study, the first person to arrive"],
        ["Relative clause", "isim + that/who/which …", "the lab that we use"],
      ],
    },
    usage: "Türkçede niteleyici her zaman ismin önündedir: '2020'de yayımlanan rapor'. İngilizcede tek kelimelik sıfatlar önde kalır, ama birden fazla kelimeden oluşan nitelemeler ismin arkasına geçer: 'the report published in 2020'. -ing biçimi etken anlam taşır (students taking the course = dersi alan öğrenciler), V3 edilgen anlam taşır (data collected online = çevrim içi toplanan veriler). Bunlar relative clause'un kısalmış hâlidir: 'the report which was published' → 'the report published'.",
    contrast: {
      title: "-ing – V3",
      text: "İsim eylemi yapıyorsa -ing, eylemden etkileniyorsa V3 kullanılır.",
      pairs: [["the students interviewing staff", "Personelle görüşen öğrenciler (öğrenciler yapıyor)"], ["the students interviewed by staff", "Personelin görüştüğü öğrenciler (öğrenciler etkileniyor)"]],
    },
    mistakes: [
      ["the in 2020 published report", "the report published in 2020", "Çok kelimeli niteleme ismin arkasına geçer."],
      ["the students lived on campus", "the students living on campus", "Etken anlamda kısaltmada -ing kullanılır."],
      ["a study about sleep of students", "a study on student sleep", "Öbek içinde edat ve sıra korunur; isim + isim kısaltması doğaldır."],
    ],
    examples: [
      ["Students living off campus can apply for a parking permit.", "Kampüs dışında yaşayan öğrenciler otopark izni için başvurabilir.", "kampüs"],
      ["The data collected in the first phase were incomplete.", "İlk aşamada toplanan veriler eksikti.", "akademik"],
      ["The fastest way to learn new words is to use them.", "Yeni kelimeleri öğrenmenin en hızlı yolu onları kullanmaktır.", "konuşma"],
      ["A survey of 300 nurses found high levels of fatigue.", "300 hemşireyle yapılan bir anket yüksek yorgunluk düzeyi buldu.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the correct phrase.", ["the yesterday sent email", "the email sent yesterday", "the email sending yesterday", "the sent yesterday email"], 1, "Çok kelimeli niteleme arkaya geçer; e-posta gönderilmiştir (edilgen): sent."),
      R.gap("Anyone ___ to join the trip should sign up today. (form of 'want')", "wanting", "Etken anlam: katılmak isteyen herkes → anyone wanting.", ["who wants"]),
      T.rw("Shorten the relative clause.", "The books which are listed on the website are required.", "The books listed on the website are required.", "which are + V3 → V3 (edilgen kısaltma)."),
      T.rw("Shorten the relative clause.", "Researchers who work in this field disagree.", "Researchers working in this field disagree.", "who + etken fiil → -ing."),
      P.order("Build the sentence.", ["by", "won", "the", "written", "professor", "article", "our", "an", "award"], "The article written by our professor won an award.", "the article + written by… (edilgen arkadan niteleme) + ana fiil won."),
      P.free("Write one sentence about a place or thing on your campus or at work using -ing or V3 after the noun.", "The café located behind the library is the quietest place to study.", ["Niteleme ismin arkasında", "Etken için -ing, edilgen için V3", "Cümlenin ayrıca bir ana fiili var"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["The man standing at the door is my tutor.", "The standing at the door man is my tutor.", "The man stood at the door is my tutor.", "The man is standing at the door my tutor."], 0, "Etken arkadan niteleme: the man standing…"),
      V.gap("This is the best place ___ before exams. (to + 'study')", "to study", "to-infinitive ismi amaçla niteler: a place to study."),
      V.mc("Choose the correct phrase.", ["the photos taking in Rome", "the photos taken in Rome", "the taken in Rome photos", "the photos took in Rome"], 1, "Fotoğraflar çekilmiştir (edilgen): taken."),
    ],
    exam: "Read an Academic Passage'taki uzun cümlelerde ana fiili bulmak için arkadan nitelemeyi ayırırsın: 'The samples collected near the river showed…' cümlesinde fiil showed'dur. Academic Discussion'da bu yapı bilgiyi kısa ve yoğun aktarır.",
    speaking: { pattern: "The best way to… is…", model: "The best way to stay focused is to put my phone in another room.", step: "Kendi cevabını üret ve 'the best way to' öbeğini tek nefeste söyle." },
    recap: ["Çok kelimeli niteleme ismin arkasına geçer: the report published in 2020.", "-ing etken (students living…), V3 edilgen (data collected…).", "to-infinitive amaç/sıra bildirir: a place to study, the first to arrive."],
  }),

  "G2.11": F("G2.11", {
    function: "Uzun bir öznede fiilin hangi isme uyacağını baş isim belirler. Bu, akademik yazıda en sık görülen uyum hatasının çözümüdür.",
    structure: {
      head: ["Özne", "Baş isim", "Doğru fiil"],
      rows: [
        ["The impact of social media on teenagers", "impact (tekil)", "is"],
        ["The results of the study", "results (çoğul)", "are / were"],
        ["One of the students", "one (tekil)", "has"],
        ["Each of the groups", "each (tekil)", "was"],
        ["The students in the back row", "students (çoğul)", "were"],
        ["Neither the teacher nor the students", "en yakın isim (students)", "were"],
      ],
    },
    usage: "İngilizcede özne ile fiil kişi ve sayıda uyuşmalıdır. Uzun öznelerde fiile en yakın isim değil, öbeğin başındaki asıl isim (baş isim) belirleyicidir. Of, in, on, with ile başlayan öbekleri ve relative clause'ları zihninde parantez içine al: 'The impact [of social media on teenagers] is…'. 'One of the…' ve 'Each of the…' tekil fiil alır. 'Neither… nor' ve 'either… or' yapısında fiil, kendisine en yakın isme uyar.",
    contrast: {
      title: "En yakın isim tuzağı",
      text: "Fiile en yakın isim çoğul olsa bile baş isim tekilse fiil tekil olur.",
      pairs: [["The list of names is long.", "Baş isim: list"], ["The names on the list are long.", "Baş isim: names"]],
    },
    mistakes: [
      ["The impact of social media on teenagers are…", "The impact of social media on teenagers is…", "Baş isim impact tekildir."],
      ["One of my friends live in Izmir.", "One of my friends lives in Izmir.", "One of… tekil fiil alır."],
      ["The number of students are rising.", "The number of students is rising.", "Baş isim number tekildir (bkz. G2.5)."],
    ],
    examples: [
      ["The quality of the recordings was surprisingly good.", "Kayıtların kalitesi şaşırtıcı derecede iyiydi.", "akademik"],
      ["One of the reasons I chose this university is its location.", "Bu üniversiteyi seçme nedenlerimden biri konumu.", "konuşma"],
      ["Students who work part-time often need flexible schedules.", "Yarı zamanlı çalışan öğrenciler çoğu zaman esnek programa ihtiyaç duyar.", "kampüs"],
      ["The effect of these changes on local farms remains unclear.", "Bu değişikliklerin yerel çiftliklere etkisi belirsizliğini koruyor.", "akademik"],
    ],
    exercises: [
      R.mc("Complete: 'The cost of textbooks ___ increased.'", ["have", "has", "are", "were"], 1, "Baş isim cost (tekil): has."),
      R.gap("The students in my study group ___ from four countries. (form of 'be', present)", "are", "Baş isim students (çoğul)."),
      T.rw("Correct the agreement error.", "Each of the participants were given a code.", "Each of the participants was given a code.", "Each of… tekil fiil alır."),
      T.rw("Correct the agreement error.", "The main problem with these apps are the notifications.", "The main problem with these apps is the notifications.", "Baş isim problem tekildir; fiil is."),
      P.order("Build the sentence.", ["job", "of", "has", "classmates", "one", "part-time", "a", "my"], "One of my classmates has a part-time job.", "One of + çoğul isim; fiil tekil: has."),
      P.free("Write one sentence that starts with 'The main advantage of…' and one that starts with 'One of the…'.", "The main advantage of online classes is flexibility. One of the problems is the lack of contact.", ["Baş ismi bul ve fiili ona uydur", "of öbeğini parantez gibi düşün", "One of… + tekil fiil"]),
    ],
    review: [
      V.mc("Complete: 'The opinions of the committee ___ divided.'", ["is", "was", "were", "has"], 2, "Baş isim opinions (çoğul): were."),
      V.gap("Neither the manager nor the employees ___ the answer. (form of 'know', present)", "know", "Neither… nor yapısında fiil en yakın isme (employees, çoğul) uyar."),
      V.mc("Complete: 'A list of useful websites ___ on the course page.'", ["are", "is", "were", "have been"], 1, "Baş isim list (tekil): is."),
    ],
    exam: "Academic Discussion'da 'The biggest benefit of…' gibi cümlelerle başlarsın; uyum hatası dil kontrolü izlenimini düşürür. Complete the Words'te fiil ekini tamamlarken baş ismi bulman gerekir.",
    speaking: { pattern: "The main reason I… is that…", model: "The main reason I study in the morning is that my mind is fresh.", step: "Kalıbı söylerken 'reason … is' bağını koparma; aradaki bilgiyi hafif ve hızlı söyle." },
    recap: ["Fiil baş isme uyar, en yakın isme değil.", "of/in/on öbeklerini parantez içine al: The impact [of…] is.", "One of… ve Each of… tekil fiil alır."],
  }),

  "G3.2": F("G3.2", {
    function: "Geçmişteki olayları sıralamak, arka planı vermek ve artık süren olmayan alışkanlıkları anlatmak için bu biçimleri kullanırız.",
    structure: {
      head: ["Biçim", "Kalıp", "Örnek"],
      rows: [
        ["Past simple", "V2 / didn't + V1 / Did … V1?", "I met my advisor. I didn't go. Did you call?"],
        ["Past continuous", "was/were + V-ing", "I was reading when you called."],
        ["used to", "used to + V1 (geçmiş alışkanlık/durum)", "I used to live in a dorm."],
        ["would", "would + V1 (geçmişte tekrarlanan eylem)", "Every summer we would visit my uncle."],
        ["be used to (farklı!)", "be used to + V-ing / isim (alışkın olmak)", "I'm used to waking up early."],
      ],
    },
    usage: "Past simple tamamlanmış olayları sırayla anlatır. Past continuous o sırada süren arka plan eylemini verir ve çoğunlukla when/while ile kısa bir olayla birleşir: 'I was walking to class when it started to rain.' Used to, artık geçerli olmayan geçmiş alışkanlık ve durumları anlatır: 'I used to play football' (eskiden oynardım, artık değil). Would yalnız tekrarlanan eylemler için kullanılır, durumlar için değil: 'I would live there' yanlış, 'I used to live there' doğru. Be used to ise tamamen farklıdır: bir şeye alışkın olmak.",
    contrast: {
      title: "used to – be used to",
      text: "Türkçede 'eskiden yapardım' ile 'alışkınım' karışabilir. used to + V1 geçmiş alışkanlık; be used to + V-ing bugünkü alışkanlık durumu.",
      pairs: [["I used to study at night.", "Eskiden gece çalışırdım (artık değil)."], ["I'm used to studying at night.", "Gece çalışmaya alışkınım."]],
    },
    mistakes: [
      ["I didn't went.", "I didn't go.", "did geçmiş zamanı taşır; ana fiil yalın kalır."],
      ["I am used to play basketball. (eskiden oynardım)", "I used to play basketball.", "Geçmiş alışkanlık used to + V1 ile."],
      ["When I arrived, they ate. (o sırada yiyorlardı)", "When I arrived, they were eating.", "Varış anında süren eylem past continuous ile."],
    ],
    examples: [
      ["I was studying in the library when the fire alarm went off.", "Yangın alarmı çaldığında kütüphanede çalışıyordum.", "kampüs"],
      ["When I was in high school, I used to take the bus every morning.", "Lisedeyken her sabah otobüse binerdim.", "konuşma"],
      ["The researchers recorded the temperature twice a day.", "Araştırmacılar sıcaklığı günde iki kez kaydetti.", "akademik"],
      ["On Sundays, my father would cook breakfast for everyone.", "Pazar günleri babam herkes için kahvaltı hazırlardı.", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["She didn't finished the essay.", "She didn't finish the essay.", "She not finished the essay.", "She doesn't finished the essay."], 1, "didn't + yalın fiil."),
      R.gap("I ___ home when I saw the accident. (past continuous of 'walk')", "was walking", "Arka planda süren eylem: was walking; kısa olay: saw."),
      T.rw("Rewrite with 'used to'.", "In the past, I drank a lot of coffee, but now I don't.", "I used to drink a lot of coffee.", "Artık süren olmayan alışkanlık: used to + V1.", ["I used to drink a lot of coffee, but now I don't."]),
      T.mc("Which sentence is NOT correct?", ["We would play chess after dinner.", "We used to play chess after dinner.", "We would have a big garden.", "We used to have a big garden."], 2, "would durum fiilleriyle (have = sahip olmak) kullanılmaz; used to gerekir."),
      P.order("Build the sentence.", ["notes", "the", "I", "stopped", "was", "when", "taking", "professor"], "I was taking notes when the professor stopped.", "Süren eylem past continuous, kesen olay past simple.", ["When the professor stopped, I was taking notes."]),
      P.free("Describe a habit you had as a child and how it changed (2–3 sentences).", "When I was a child, I used to read comics every night. My mother would bring me a new one every Friday. Now I mostly read on my phone.", ["used to ile eski alışkanlık", "would yalnız tekrarlanan eylem için", "Geçmiş olaylar past simple, bugün present"]),
    ],
    review: [
      V.mc("Choose the correct option: 'While we ___ dinner, the lights went out.'", ["had", "were having", "have", "are having"], 1, "While + süren eylem: were having."),
      V.gap("I ___ to live near the sea, but now I live in Ankara. (one word)", "used", "Geçmiş durum: used to live."),
      V.mc("Choose the correct sentence.", ["Did you saw the email?", "Did you see the email?", "Do you saw the email?", "Did you seen the email?"], 1, "Did + yalın fiil: see."),
    ],
    exam: "Take an Interview'daki deneyim sorularında cevabın omurgası past simple'dır; arka planı past continuous, eski alışkanlığı used to ile vermek cevabı zenginleştirir. Listening'de 'used to' duyduğunda artık değişmiş bir durumun anlatıldığını fark et.",
    speaking: { pattern: "When I was…, I used to… but now…", model: "When I was in high school, I used to study with music, but now I prefer silence.", step: "Kalıbı kendi deneyiminle söyle; 'used to'yu tek kelime gibi bağlayarak (/juːstə/) söyle." },
    recap: ["did/didn't sonrası fiil yalın: didn't go.", "Süren arka plan past continuous, kısa olay past simple.", "used to = eskiden (artık değil); be used to + -ing = alışkın olmak."],
  }),

  "G3.3": F("G3.3", {
    function: "Geçmişte başlayıp bugüne uzanan durumlar ve zamanı önemli olmayan deneyimler için present perfect; zamanı belli, bitmiş olaylar için past simple kullanırız.",
    structure: {
      head: ["Kullanım", "Kalıp", "Örnek"],
      rows: [
        ["Deneyim (zaman belirsiz)", "have/has + V3", "I have visited Paris twice."],
        ["Bugüne uzanan durum", "have/has + V3 + for/since", "I have lived here since 2023."],
        ["Bugüne uzanan süreç", "have/has been + V-ing", "I have been studying for three hours."],
        ["Yeni biten, sonucu şimdi önemli", "have/has + just/already/yet", "I have just submitted the form."],
        ["Bitmiş, zamanı belli", "V2 + geçmiş zaman ifadesi", "I submitted it yesterday."],
      ],
    },
    usage: "Türkçede 'Paris'e iki kez gittim' ve 'Dün Paris'e gittim' aynı zamanla söylenir; İngilizcede ilki present perfect, ikincisi past simple'dır. Kural: yesterday, last week, in 2022, ago gibi bitmiş bir zaman söylüyorsan past simple kullan. Since/for ile bugüne uzanan bir süre söylüyorsan present perfect kullan: 'I have been here since 2023' (2023'ten beri buradayım). Türkçedeki 'beri' cümlesi şimdiki zamanla kurulduğu için 'I am here since…' hatası çok yaygındır.",
    contrast: {
      title: "present perfect – past simple",
      text: "Zaman ifadesi belirleyicidir: bitmiş zaman → past simple; bugünü içeren veya belirsiz zaman → present perfect.",
      pairs: [["I have read three articles this week.", "Hafta bitmedi"], ["I read three articles last week.", "Geçen hafta bitti"], ["Have you ever been to London?", "Hayatın boyunca (belirsiz)"], ["When did you go to London?", "Belirli zaman soruluyor"]],
    },
    mistakes: [
      ["I have seen him yesterday.", "I saw him yesterday.", "yesterday bitmiş zaman; past simple gerekir."],
      ["I am here since 2023.", "I have been here since 2023.", "since ile bugüne uzanan süre present perfect ister."],
      ["How long are you studying English?", "How long have you been studying English?", "Süre sorusu present perfect continuous ile."],
    ],
    examples: [
      ["I have been working on this project since September.", "Eylülden beri bu proje üzerinde çalışıyorum.", "konuşma"],
      ["Several studies have examined the link between sleep and memory.", "Birçok çalışma uyku ile bellek arasındaki bağı inceledi.", "akademik"],
      ["Have you registered for next semester yet?", "Gelecek dönem için kaydını yaptırdın mı?", "kampüs"],
      ["I joined the debate club two years ago, and I have learned a lot.", "Münazara kulübüne iki yıl önce katıldım ve çok şey öğrendim.", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["I have finished the report last night.", "I finished the report last night.", "I have finish the report last night.", "I am finishing the report last night."], 1, "last night bitmiş zaman: past simple."),
      R.gap("She ___ in this city since she was ten. (present perfect of 'live')", "has lived", "since ile bugüne uzanan durum: has lived.", ["has been living"]),
      T.rw("Correct the sentence.", "I know my roommate for two years.", "I have known my roommate for two years.", "Bugüne uzanan süre + durum fiili (know): have known.", ["I've known my roommate for two years."]),
      T.gap("We ___ the new advisor last Monday. (past of 'meet')", "met", "last Monday belli ve bitmiş: met."),
      P.order("Build the question.", ["a", "you", "English", "presentation", "ever", "in", "given", "have"], "Have you ever given a presentation in English?", "Deneyim sorusu: Have + özne + ever + V3."),
      P.free("Answer: 'How long have you been learning English, and what has helped you most?' (2–3 sentences)", "I have been learning English since middle school. Watching series with subtitles has helped me most. Last year I started reading short articles too.", ["since/for ile present perfect (continuous)", "Belli geçmiş zaman için past simple", "have/has + V3 biçimi doğru"]),
    ],
    review: [
      V.mc("Choose the correct question.", ["When have you arrived?", "When did you arrive?", "When you arrived?", "When have you arrive?"], 1, "When sorusu belli bir zamanı sorar: past simple."),
      V.gap("I ___ the reading yet. (negative present perfect of 'finish')", "haven't finished", "yet ile present perfect olumsuz.", ["have not finished"]),
      V.mc("Choose the correct sentence.", ["He works here since May.", "He has worked here since May.", "He worked here since May.", "He is working here since May."], 1, "since May → bugüne uzanan: has worked."),
    ],
    exam: "Take an Interview'da 'How long…?' ve deneyim sorularında doğru zaman, cevabın ilk cümlesini sağlam kılar. Write an Email'de 'I have attached…', 'I have not received…' gibi kalıplar çok sık gerekir.",
    speaking: { pattern: "I've been … since …, and so far …", model: "I've been learning to cook since last summer, and so far I've made five new dishes.", step: "Kalıbı kendi deneyiminle söyle; I've, you've kısaltmalarını doğal biçimde kullan." },
    recap: ["Bitmiş zaman ifadesi (yesterday, ago, in 2022) → past simple.", "since/for ile bugüne uzanan süre → present perfect (continuous).", "Deneyim ve sonucu şimdi önemli olay → have/has + V3."],
  }),

  "G3.7": F("G3.7", {
    function: "Eylemi kimin yaptığından çok eylemin kendisi veya etkilenen şey önemliyse edilgen (passive) yapı kullanılır. Akademik ve resmî dilde çok yaygındır.",
    structure: {
      head: ["Zaman", "Kalıp", "Örnek"],
      rows: [
        ["Present simple", "am/is/are + V3", "The lab is cleaned every day."],
        ["Past simple", "was/were + V3", "The experiment was conducted in 2024."],
        ["Present perfect", "has/have been + V3", "The deadline has been extended."],
        ["Future / modal", "will be / can be + V3", "Results will be posted online."],
        ["Yapanı belirtmek", "… by + kişi", "The survey was designed by students."],
      ],
    },
    usage: "Edilgen yapı be + V3 ile kurulur; zamanı be fiili taşır. Türkçedeki '-ıl/-ın' ekinin karşılığıdır: 'Deney 2024'te yapıldı' = 'The experiment was conducted in 2024.' Yapan kişi bilinmiyorsa, önemsizse veya açıksa söylenmez; gerekiyorsa by ile eklenir. Yalnız nesne alan (geçişli) fiiller edilgen olabilir: happen, arrive, die gibi fiiller edilgen yapılmaz ('It is happened' yanlıştır).",
    contrast: {
      title: "Etken – edilgen",
      text: "Aynı olay odak değişince farklı söylenir. Akademik metinde süreç ve sonuç öne çıktığı için edilgen sık görülür.",
      pairs: [["Researchers collected the samples in May.", "Etken: odak araştırmacılarda"], ["The samples were collected in May.", "Edilgen: odak örneklerde"]],
    },
    mistakes: [
      ["The experiment was conduct.", "The experiment was conducted.", "be'den sonra V3 gerekir."],
      ["It is happened yesterday.", "It happened yesterday.", "happen nesne almaz; edilgen olmaz."],
      ["The results published last week.", "The results were published last week.", "Edilgen yapıda be fiili unutulmamalı."],
    ],
    examples: [
      ["The library will be closed on Monday for repairs.", "Kütüphane pazartesi onarım için kapalı olacak.", "kampüs"],
      ["Participants were asked to keep a sleep diary for two weeks.", "Katılımcılardan iki hafta boyunca uyku günlüğü tutmaları istendi.", "akademik"],
      ["My bike was stolen last year, so now I walk to class.", "Bisikletim geçen yıl çalındı, bu yüzden artık derse yürüyorum.", "konuşma"],
      ["Coffee is grown in more than fifty countries.", "Kahve elliden fazla ülkede yetiştirilir.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["The report was write by two students.", "The report was written by two students.", "The report written by two students.", "The report is wrote by two students."], 1, "was + V3 (written)."),
      R.gap("The new schedule ___ to all students yesterday. (passive of 'send')", "was sent", "Geçmiş, edilgen: was sent."),
      T.rw("Make it passive. Do not mention the agent.", "Someone has cancelled the meeting.", "The meeting has been cancelled.", "has + been + V3; yapan önemsiz.", ["The meeting has been canceled."]),
      T.rw("Correct the sentence.", "The accident was happened at night.", "The accident happened at night.", "happen geçişsizdir; edilgen olmaz."),
      P.order("Build the sentence.", ["announced", "week", "results", "be", "next", "will", "the"], "The results will be announced next week.", "Gelecek edilgen: will be + V3.", ["Next week the results will be announced."]),
      P.free("Describe a process you know (for example, how tea is produced or how students register for a course) in two passive sentences.", "First, the leaves are picked by hand. Then they are dried and packed in small boxes.", ["be + V3 kullanıldı", "Zaman be fiilinde doğru", "Gerekmiyorsa yapan (by…) söylenmedi"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["English is speak in many countries.", "English is spoken in many countries.", "English spoken in many countries.", "English is speaking in many countries."], 1, "is + V3: spoken."),
      V.gap("The windows ___ every Friday. (present passive of 'clean')", "are cleaned", "Düzenli, edilgen, çoğul özne: are cleaned."),
      V.mc("Which verb cannot be used in the passive?", ["build", "arrive", "write", "invite"], 1, "arrive nesne almaz; edilgen yapılmaz."),
    ],
    exam: "Read an Academic Passage ve Academic Talk'larda yöntem ve süreç anlatımı çoğunlukla edilgendir (was measured, were divided). Build a Sentence'ta be + V3'ü tek bir öbek olarak görmek sırayı kolaylaştırır.",
    speaking: { pattern: "It was built / It is used for…", model: "The building was renovated last year, and now it is used for student clubs.", step: "Kendi kampüsünden veya şehrinden bir yer seç ve aynı kalıpla söyle; was/were'i hafif, V3'ü vurgulu söyle." },
    recap: ["Edilgen = be + V3; zamanı be fiili taşır.", "Yapan önemsizse söylenmez; gerekirse by + kişi.", "happen, arrive gibi nesnesiz fiiller edilgen olmaz."],
  }),
};
