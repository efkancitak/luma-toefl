// Tam anlatım — priority batch, part 2 (CONTENT-SPEC v4 lesson template).
// Original, AI-assisted text. reviewStatus: unreviewed (see GRAMMAR_META).

import { F, R, T, P, V } from "./grammar-full-1.js";

export const FULL_LESSONS_B = {
  "G5.1": F("G5.1", {
    function: "Genel gerçekleri ve gelecekteki gerçek olasılıkları bir koşula bağlamak için zero ve first conditional kullanırız.",
    structure: {
      head: ["Tür", "Kalıp", "Örnek"],
      rows: [
        ["Zero", "If + present, present", "If you heat ice, it melts."],
        ["First", "If + present, will + V1", "If it rains, we will stay inside."],
        ["unless", "unless + olumlu present (= if … not)", "Unless you hurry, you'll miss the bus."],
        ["when", "when + present, will (olacağı kesin)", "When I finish, I'll call you."],
        ["Emir ile", "If + present, emir", "If you have questions, email me."],
      ],
    },
    usage: "Türkçede 'Vaktim olursa gelirim' derken koşul kısmında gelecek anlamı vardır; İngilizcede if'li kısım gelecek anlamında olsa bile present simple ile kurulur: 'If I have time, I will come.' Will yalnız sonuç kısmına gelir. Unless 'if not' demektir ve kendisi olumsuz anlam taşıdığı için arkasından olumsuz fiil gelmez. If bir olasılığı (olabilir de olmayabilir de), when ise olacağından emin olduğun bir anı anlatır.",
    contrast: {
      title: "if – when",
      text: "If belirsiz bir koşul, when beklenen bir zaman bildirir.",
      pairs: [["If I see Ali, I'll tell him.", "Görebilirim de görmeyebilirim de"], ["When I see Ali, I'll tell him.", "Onu göreceğim; o zaman söyleyeceğim"]],
    },
    mistakes: [
      ["If I will have time, I will help.", "If I have time, I will help.", "if kısmında will kullanılmaz."],
      ["Unless you don't hurry, you'll be late.", "Unless you hurry, you'll be late.", "unless zaten olumsuz anlam taşır."],
      ["If you will need help, ask me.", "If you need help, ask me.", "Koşul kısmı present simple ile kurulur."],
    ],
    examples: [
      ["If you submit the form late, the system rejects it automatically.", "Formu geç gönderirsen sistem otomatik olarak reddeder.", "kampüs"],
      ["If the temperature rises above 40 degrees, the enzyme stops working.", "Sıcaklık 40 derecenin üstüne çıkarsa enzim çalışmayı durdurur.", "akademik"],
      ["If I get the internship, I'll move to Istanbul in June.", "Stajı alırsam haziranda İstanbul'a taşınacağım.", "konuşma"],
      ["You won't get a refund unless you keep the receipt.", "Fişi saklamazsan para iadesi alamazsın.", "kampüs"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["If it will snow, classes will be cancelled.", "If it snows, classes will be cancelled.", "If it snows, classes are cancel.", "If it snowed, classes will be cancelled."], 1, "Koşul present (snows), sonuç will."),
      R.gap("If you mix blue and yellow, you ___ green. (one word)", "get", "Genel gerçek: zero conditional; iki taraf da present."),
      T.rw("Rewrite with 'unless'.", "If you don't book a room, you won't have a place to study.", "Unless you book a room, you won't have a place to study.", "unless = if not; arkasından olumlu fiil gelir.", ["Unless you book a room, you will not have a place to study."]),
      T.mc("You are sure the bus will come. Which sentence is best?", ["If the bus comes, I'll get on.", "When the bus comes, I'll get on.", "Unless the bus comes, I'll get on.", "If the bus will come, I'll get on."], 1, "Olacağından eminsen when kullanılır."),
      P.order("Build the sentence.", ["exam", "will", "I", "pass", "if", "celebrate", "the", "I"], "If I pass the exam, I will celebrate.", "If + present, will + V1. Virgül kelime dizmede yok sayılır.", ["I will celebrate if I pass the exam."]),
      P.free("Write two sentences about your plans for this weekend: one with if and one with unless.", "If the weather is nice, I'll go hiking. Unless I finish my essay on Saturday, I won't go out.", ["if/unless kısmında present simple", "Sonuç kısmında will", "unless sonrası olumlu fiil"]),
    ],
    review: [
      V.mc("Choose the correct option: 'If you ___ early, you'll get a good seat.'", ["will arrive", "arrive", "arrived", "would arrive"], 1, "Koşul kısmı present simple."),
      V.gap("___ you study, you won't pass. (one word meaning 'if … not')", "Unless", "Unless = if not."),
      V.mc("Which sentence is a general truth (zero conditional)?", ["If I see her, I'll say hello.", "If you press this button, the light turns on.", "If I had time, I'd help.", "If it rains tomorrow, we'll stay home."], 1, "Her zaman geçerli bir sonuç: present + present."),
    ],
    exam: "Take an Interview'daki plan ve tercih sorularında (What will you do if…?) bu yapı doğrudan gerekir. Write an Email'de 'If you need any further information, please let me know' gibi kalıplar sık kullanılır.",
    speaking: { pattern: "If I have the chance, I'll…", model: "If I have the chance, I'll study abroad for a semester.", step: "Kalıbı kendi planınla üç kez söyle; if kısmından sonra kısa bir duraklama yap." },
    recap: ["if kısmında will kullanılmaz: If I have time…", "Zero: genel gerçek (present + present). First: gerçek olasılık (present + will).", "unless = if not; when = olacağından eminsin."],
  }),

  "G5.2": F("G5.2", {
    function: "Şimdiki zamanda gerçek dışı veya düşük olasılıklı durumları hayal etmek ve tavsiye vermek için second conditional kullanırız.",
    structure: {
      head: ["Kullanım", "Kalıp", "Örnek"],
      rows: [
        ["Gerçek dışı şimdi", "If + past simple, would + V1", "If I had a car, I would drive to campus."],
        ["Düşük olasılık (gelecek)", "If + past simple, would + V1", "If I won a scholarship, I would travel."],
        ["be", "If I/he/she/it were …", "If she were here, she would help."],
        ["Tavsiye", "If I were you, I'd …", "If I were you, I'd ask the professor."],
        ["Olasılık / yetenek", "could / might + V1", "If I had time, I could join you."],
      ],
    },
    usage: "Second conditional'da if kısmı geçmiş zaman biçimindedir ama anlam şimdiki veya gelecektir: 'If I had more time' = Şu an daha çok vaktim olsa. Türkçedeki '-sa/-se … -ardı' yapısıyla karşılanır. Sonuçta will yerine would gelir. Be fiili sınav dilinde bütün kişilerde were olur: 'If I were', 'If it were'. Gündelik konuşmada 'If I was' da duyulur, ama 'If I were you' kalıbı sabittir. if kısmına would gelmez.",
    contrast: {
      title: "first – second conditional",
      text: "Fark olasılık algısındadır: first gerçekçi, second hayal veya düşük olasılık.",
      pairs: [["If I get the scholarship, I'll study in Berlin.", "Mümkün, bekliyorum"], ["If I got the scholarship, I'd study in Berlin.", "Pek beklemiyorum; hayal ediyorum"]],
    },
    mistakes: [
      ["If I would have money, I would buy it.", "If I had money, I would buy it.", "if kısmında would kullanılmaz; past simple gerekir."],
      ["If I am you, I'd talk to her.", "If I were you, I'd talk to her.", "Tavsiye kalıbı sabittir: If I were you."],
      ["If I had time, I will help.", "If I had time, I would help.", "Second conditional'ın sonucu would ile kurulur."],
    ],
    examples: [
      ["If the library were open 24 hours, I would study there at night.", "Kütüphane 24 saat açık olsa orada gece çalışırdım.", "kampüs"],
      ["If I were you, I'd start the project this week.", "Senin yerinde olsam projeye bu hafta başlardım.", "konuşma"],
      ["If cities had more trees, summer temperatures would be lower.", "Şehirlerde daha çok ağaç olsa yaz sıcaklıkları daha düşük olurdu.", "akademik"],
      ["What would you change if you were the head of your department?", "Bölüm başkanı olsan neyi değiştirirdin?", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["If I knew the answer, I would tell you.", "If I would know the answer, I would tell you.", "If I know the answer, I would tell you.", "If I knew the answer, I will tell you."], 0, "If + past simple, would + V1."),
      R.gap("If I ___ you, I would apply for the job. (form of 'be')", "were", "Tavsiye kalıbı: If I were you."),
      T.rw("Rewrite as a second conditional.", "I don't have a bike, so I don't cycle to class.", "If I had a bike, I would cycle to class.", "Gerçek dışı şimdi: had + would.", ["If I had a bike, I'd cycle to class."]),
      T.mc("Which sentence shows a less likely, imagined situation?", ["If I find your keys, I'll call you.", "If I found a wallet in the street, I'd take it to the police.", "If you heat water, it boils.", "When I find your keys, I'll call you."], 1, "Second conditional düşük olasılığı veya hayali gösterir."),
      P.order("Build the question.", ["time", "you", "free", "if", "would", "had", "do", "more", "you", "what"], "What would you do if you had more free time?", "Soru: What would you do + if + past simple."),
      P.free("Answer: 'If you could change one thing about your school or city, what would it be?' (2–3 sentences)", "If I could change one thing, I would add more bike lanes. Students would get to class faster, and the air would be cleaner.", ["if + past simple (could/had/were)", "Sonuçta would + V1", "Bir neden veya sonuç eklendi"]),
    ],
    review: [
      V.mc("Complete: 'If it ___ cheaper, more students would use the gym.'", ["is", "were", "will be", "would be"], 1, "Gerçek dışı şimdi; be → were."),
      V.gap("If I had more money, I ___ a new laptop. (would + 'buy')", "would buy", "Sonuç: would + V1.", ["'d buy"]),
      V.mc("Choose the best advice.", ["If I am you, I'll rest.", "If I were you, I'd rest.", "If I was you, I will rest.", "If I would be you, I'd rest."], 1, "Sabit tavsiye kalıbı: If I were you, I'd…"),
    ],
    exam: "Take an Interview'daki varsayım soruları (What would you do if…?) doğrudan second conditional ister. Cevaba 'If I were in that situation, I would…' ile başlamak soruya doğrudan cevap verir.",
    speaking: { pattern: "If I were in that situation, I would… because…", model: "If I were in that situation, I would talk to my teammates first, because they might have the same problem.", step: "Kalıbı yüksek sesle söyle; doğal konuşmada 'I would'u 'I'd' olarak kısalt." },
    recap: ["If + past simple, would + V1: gerçek dışı şimdi veya düşük olasılık.", "if kısmında would yok; be → were.", "Tavsiye: If I were you, I'd…"],
  }),

  "G5.3": F("G5.3", {
    function: "Geçmişte olmamış bir durumu ve onun olası sonucunu hayal etmek, pişmanlık veya eleştiri bildirmek için third conditional kullanırız.",
    structure: {
      head: ["Parça", "Kalıp", "Örnek"],
      rows: [
        ["Koşul", "If + had + V3", "If I had known about the change,"],
        ["Sonuç", "would have + V3", "I would have come earlier."],
        ["Olasılık", "could / might have + V3", "we might have won."],
        ["Olumsuz", "If + hadn't + V3 …, wouldn't have + V3", "If it hadn't rained, we wouldn't have stayed home."],
        ["Kısa biçim", "I'd (= I had) … I'd have (= I would have)", "If I'd known, I'd have helped."],
      ],
    },
    usage: "Third conditional geçmişe dönüp 'öyle olsaydı böyle olurdu' demektir; iki taraf da gerçekleşmemiştir. Türkçedeki '-saydı … -ırdı' yapısına denk gelir: 'Erken çıksaydım treni kaçırmazdım' = 'If I had left early, I wouldn't have missed the train.' if kısmında had + V3, sonuçta would have + V3 gelir. if kısmına would girmez. Konuşmada 'I'd' hem had hem would'un kısaltmasıdır: 'If I'd known (had), I'd have (would) told you.'",
    contrast: {
      title: "second – third conditional",
      text: "Second şimdi/gelecek için, third geçmiş için hayal kurar.",
      pairs: [["If I had time, I would help you.", "Şu an vaktim yok"], ["If I had had time, I would have helped you.", "O zaman vaktim yoktu"]],
    },
    mistakes: [
      ["If I would have known, I would have come.", "If I had known, I would have come.", "if kısmında would kullanılmaz."],
      ["If I knew, I would have come. (geçmiş)", "If I had known, I would have come.", "Geçmiş koşul past perfect ister."],
      ["I would came if…", "I would have come if…", "would'dan sonra have + V3 gelir."],
    ],
    examples: [
      ["If I had checked the email, I wouldn't have missed the meeting.", "E-postayı kontrol etseydim toplantıyı kaçırmazdım.", "kampüs"],
      ["If the sample had been larger, the results might have been different.", "Örneklem daha büyük olsaydı sonuçlar farklı olabilirdi.", "akademik"],
      ["If my friend hadn't encouraged me, I wouldn't have joined the team.", "Arkadaşım beni cesaretlendirmeseydi takıma katılmazdım.", "konuşma"],
      ["The bridge would have collapsed if engineers had not reinforced it.", "Mühendisler güçlendirmeseydi köprü çökerdi.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["If I had seen the sign, I would have stopped.", "If I would have seen the sign, I would stop.", "If I saw the sign, I would have stopped.", "If I had saw the sign, I would have stop."], 0, "If + had + V3, would have + V3."),
      R.gap("If we ___ earlier, we would have caught the bus. (past perfect of 'leave')", "had left", "Geçmiş koşul: had + V3.", ["'d left"]),
      T.rw("Rewrite as a third conditional.", "I didn't study, so I failed the quiz.", "If I had studied, I wouldn't have failed the quiz.", "Gerçekleşmeyen geçmiş: had studied → wouldn't have failed.", ["If I had studied, I would not have failed the quiz.", "If I had studied, I would have passed the quiz."]),
      T.rw("Correct the sentence.", "If she would have asked me, I would have helped.", "If she had asked me, I would have helped.", "if kısmında would yok; had + V3."),
      P.order("Build the sentence.", ["called", "known", "would", "I", "you", "had", "I", "if", "have"], "If I had known, I would have called you.", "had known + would have called.", ["I would have called you if I had known."]),
      P.free("Write about a past decision: what would have happened if you had chosen differently? (2 sentences)", "If I hadn't chosen this school, I wouldn't have met my best friend. I might have studied engineering instead.", ["if + had + V3", "Sonuçta would/might have + V3", "Gerçek bir geçmiş olaya dayanıyor"]),
    ],
    review: [
      V.mc("Complete: 'If the alarm ___, I would have woken up on time.'", ["rang", "had rung", "would ring", "has rung"], 1, "Geçmiş koşul: had rung."),
      V.gap("If you had told me, I ___ you. (would have + 'help')", "would have helped", "Sonuç: would have + V3.", ["'d have helped"]),
      V.mc("Which sentence talks about the past?", ["If I had a map, I'd find it.", "If I had had a map, I'd have found it.", "If I have a map, I'll find it.", "When I have a map, I'll find it."], 1, "had had + would have found: geçmişe dair hayal."),
    ],
    exam: "Interview'da 'Tell me about a time…' cevabının kapanışında 'If I had known…, I would have…' cümlesi deneyimden ders çıkardığını gösterir. Listening'de third conditional duyduğunda olayın gerçekleşmediğini anlamak çıkarım sorularında belirleyicidir.",
    speaking: { pattern: "Looking back, if I had…, I would have…", model: "Looking back, if I had asked for help earlier, I would have finished on time.", step: "Kalıbı söylerken 'would have'ı bağlı ve hafif söyle (/wʊdəv/)." },
    recap: ["If + had + V3, would have + V3: geçmişte olmamış durum.", "if kısmında would yok.", "I'd = I had veya I would; bağlamdan ayırt et."],
  }),

  "G6.1": F("G6.1", {
    function: "Bir fiilden sonra başka bir eylemi anlatırken -ing mi to mu geleceğini birinci fiil belirler. Bu seçim kalıplaşmıştır.",
    structure: {
      head: ["Durum", "Kalıp", "Örnek"],
      rows: [
        ["Fiil + -ing", "enjoy, avoid, finish, mind, consider, suggest, keep", "I enjoy reading. I avoid driving."],
        ["Fiil + to + V1", "want, decide, plan, hope, agree, refuse, need", "I decided to apply."],
        ["Edat + -ing", "in, on, about, of, without, before, after + V-ing", "I'm interested in joining."],
        ["Edat olan to + -ing", "look forward to, be used to, object to", "I look forward to hearing from you."],
        ["Özne olarak", "-ing (genel eylem)", "Learning a language takes time."],
      ],
    },
    usage: "Türkçede '-mek/-mayı' tek bir ekle karşılanırken İngilizcede iki seçenek vardır. Enjoy, avoid, finish, mind, suggest gibi fiillerden sonra -ing; want, decide, plan, hope, agree gibi fiillerden sonra to + V1 gelir. Bir edattan sonra fiil her zaman -ing olur: 'interested in learning', 'before leaving'. Dikkat: 'look forward to' kalıbındaki to bir edattır; bu yüzden 'look forward to seeing you' doğrudur. Cümlenin öznesi bir eylemse genellikle -ing kullanılır.",
    contrast: {
      title: "to + V1 – to + V-ing",
      text: "To bazen infinitive işaretidir (want to go), bazen edattır (look forward to going). Edat olan to'dan sonra isim de gelebilir: 'I look forward to the trip.'",
      pairs: [["I want to see you.", "to = infinitive"], ["I look forward to seeing you.", "to = edat"]],
    },
    mistakes: [
      ["I enjoy to read.", "I enjoy reading.", "enjoy -ing alır."],
      ["I look forward to see you.", "I look forward to seeing you.", "look forward to + -ing."],
      ["She decided going abroad.", "She decided to go abroad.", "decide to + V1 alır."],
    ],
    examples: [
      ["I avoid checking my phone while I study.", "Çalışırken telefonuma bakmaktan kaçınırım.", "konuşma"],
      ["The committee agreed to extend the deadline.", "Komite son tarihi uzatmayı kabul etti.", "kampüs"],
      ["Reducing sugar intake can improve long-term health.", "Şeker alımını azaltmak uzun vadeli sağlığı iyileştirebilir.", "akademik"],
      ["I look forward to hearing your feedback on my draft.", "Taslağım hakkındaki geri bildiriminizi bekliyorum.", "kampüs"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["I finished to write the essay.", "I finished writing the essay.", "I finished write the essay.", "I finished to writing the essay."], 1, "finish + -ing."),
      R.gap("We plan ___ the museum on Saturday. (to + 'visit')", "to visit", "plan + to + V1."),
      T.rw("Correct the sentence.", "Thank you for help me with the project.", "Thank you for helping me with the project.", "Edat (for) sonrası -ing."),
      T.gap("I'm thinking about ___ my major. (form of 'change')", "changing", "about edatından sonra -ing."),
      P.order("Build the sentence.", ["you", "to", "next", "forward", "I", "week", "meeting", "look"], "I look forward to meeting you next week.", "look forward to + -ing."),
      P.free("Write two sentences about your study habits: one with a verb + -ing (enjoy/avoid) and one with a verb + to (want/plan).", "I enjoy studying with background music. This term, I plan to start my assignments earlier.", ["-ing alan fiil doğru", "to + V1 alan fiil doğru", "Edattan sonra -ing"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["Would you mind to close the door?", "Would you mind closing the door?", "Would you mind close the door?", "Would you mind to closing the door?"], 1, "mind + -ing."),
      V.gap("She refused ___ the question. (to + 'answer')", "to answer", "refuse + to + V1."),
      V.mc("Choose the correct sentence.", ["He left without say goodbye.", "He left without saying goodbye.", "He left without to say goodbye.", "He left without said goodbye."], 1, "without (edat) + -ing."),
    ],
    exam: "Write an Email'in kapanış cümlelerinde (I look forward to hearing from you) ve Interview'daki tercih cevaplarında (I enjoy working in groups) bu seçim sürekli gerekir. Build a Sentence'ta to ve -ing biçimleri doğru fiille eşleşmelidir.",
    speaking: { pattern: "I really enjoy… but I try to avoid…", model: "I really enjoy working in small groups, but I try to avoid meeting late at night.", step: "Kendi tercihlerinle söyle; -ing'i /ɪŋ/ ile bitir, sona 'g' ekleme." },
    recap: ["enjoy, avoid, finish, mind, suggest + -ing.", "want, decide, plan, hope, agree + to + V1.", "Edattan sonra -ing; look forward to + -ing."],
  }),

  "G6.4": F("G6.4", {
    function: "Bazı fiil, sıfat ve isimler belirli bir edatla birlikte kullanılır. Yanlış edat seçmek ya da gereksiz edat eklemek dikkat çeken bir hatadır.",
    structure: {
      head: ["Tür", "Kalıp", "Örnek"],
      rows: [
        ["Fiil + edat", "depend on, focus on, apply for, belong to, consist of", "It depends on the weather."],
        ["Edatsız fiil", "discuss, enter, contact, attend, answer, reach", "We discussed the plan."],
        ["Sıfat + edat", "interested in, responsible for, good at, aware of, similar to", "She is good at statistics."],
        ["İsim + edat", "reason for, effect on, increase in, solution to, access to", "an increase in prices"],
      ],
    },
    usage: "Türkçedeki hâl ekleri (-e, -de, -den) İngilizce edatlara birebir çevrilemez: 'bağlı olmak' = depend on (from değil). Bazı fiiller Türkçede ek alsa da İngilizcede doğrudan nesne alır: 'toplantıya katılmak' = attend the meeting, 'konuyu tartışmak' = discuss the topic (about yok). Bu öbekler tek bir kurala dayanmaz; en verimli yöntem onları bütün hâlinde öğrenmek ve kendi cümlende kullanmaktır.",
    contrast: {
      title: "Türkçe ek → İngilizce edat",
      text: "Aynı Türkçe ek farklı İngilizce edatlara karşılık gelebilir veya hiç edat gerektirmeyebilir.",
      pairs: [["-e bağlı olmak", "depend on"], ["bir işe başvurmak / bir kuruma başvurmak", "apply for a job / apply to a university"], ["-i tartışmak", "discuss (edatsız)"], ["-e katılmak", "attend / join (edatsız)"]],
    },
    mistakes: [
      ["discuss about the problem", "discuss the problem", "discuss doğrudan nesne alır."],
      ["depend from", "depend on", "Kalıp: depend on."],
      ["I am interested about history.", "I am interested in history.", "interested in sabit öbektir."],
    ],
    examples: [
      ["Your final grade depends on three projects.", "Final notun üç projeye bağlı.", "kampüs"],
      ["The study focuses on the effect of noise on concentration.", "Çalışma gürültünün konsantrasyon üzerindeki etkisine odaklanıyor.", "akademik"],
      ["I'm applying for a summer internship at a research lab.", "Bir araştırma laboratuvarında yaz stajına başvuruyorum.", "konuşma"],
      ["We need to contact the IT office about the login problem.", "Giriş sorunu için bilgi işlem ofisiyle iletişime geçmemiz gerekiyor.", "kampüs"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["We discussed about the schedule.", "We discussed the schedule.", "We discussed on the schedule.", "We discussed for the schedule."], 1, "discuss edatsız kullanılır."),
      R.gap("Who is responsible ___ the lab equipment? (one word)", "for", "responsible for sabit öbektir."),
      T.rw("Correct the sentence.", "I want to attend to the workshop.", "I want to attend the workshop.", "attend (katılmak) edatsız kullanılır."),
      T.gap("There has been a sharp increase ___ the number of applicants. (one word)", "in", "increase in + artan şey."),
      P.order("Build the sentence.", ["biology", "in", "she", "studying", "interested", "marine", "is"], "She is interested in studying marine biology.", "interested in + -ing."),
      P.free("Write two sentences about your goals using two of these: apply for, focus on, interested in, depend on.", "I'm interested in data science, so I'm applying for an online course. My plan depends on my exam results.", ["Edatlar doğru", "Edattan sonra isim veya -ing", "discuss/attend gibi fiillere gereksiz edat eklenmedi"]),
    ],
    review: [
      V.mc("Choose the correct option: 'The class consists ___ twenty students.'", ["from", "of", "in", "with"], 1, "consist of."),
      V.gap("I'm not aware ___ any changes to the schedule. (one word)", "of", "aware of."),
      V.mc("Choose the correct sentence.", ["Please answer to the email.", "Please answer the email.", "Please answer at the email.", "Please answer for the email."], 1, "answer doğrudan nesne alır."),
    ],
    exam: "Complete the Words görevinde edatlar çoğu zaman tam verilir ve kelimenin geri kalanını tahmin etmeni kolaylaştırır. Write an Email'de 'apply for', 'contact', 'discuss' gibi fiiller çok sık gerekir; edat hatası doğallığı düşürür.",
    speaking: { pattern: "I'm really interested in… and I'd like to focus on…", model: "I'm really interested in psychology, and I'd like to focus on how sleep affects learning.", step: "Öbekleri tek parça gibi söyle: 'interested in' iki kelime değil, tek ritim." },
    recap: ["depend on, focus on, apply for, consist of, interested in, responsible for.", "discuss, attend, contact, answer, enter edatsız kullanılır.", "Öbekleri bütün hâlinde öğren ve kendi cümlende kullan."],
  }),

  "G7.1": F("G7.1", {
    function: "Bir ismi tanımlamak veya ona ek bilgi eklemek için ismin hemen arkasına who, which, that, whose, where ile başlayan bir yan cümle koyarız.",
    structure: {
      head: ["Bağlaç", "Ne için", "Örnek"],
      rows: [
        ["who / that", "insan", "The student who sits next to me is from Brazil."],
        ["which / that", "şey, hayvan", "The app that I use is free."],
        ["whose", "sahiplik", "The professor whose class I took retired."],
        ["where", "yer", "This is the café where we meet."],
        ["edat + which/whom", "resmî", "the topic about which we spoke"],
        ["Virgüllü (non-defining)", "ek bilgi; that kullanılmaz", "My brother, who lives in Izmir, is a nurse."],
      ],
    },
    usage: "Türkçede niteleyici cümle ismin önüne gelir ('benim kullandığım uygulama'); İngilizcede ismin arkasına gelir: 'the app that I use'. Relative pronoun (that/which) zaten nesnenin yerini tutar; bu yüzden cümle sonuna tekrar 'it' konmaz. Tanımlayıcı (defining) cümle hangi kişi/şey olduğunu belirler ve virgül almaz. Ek bilgi veren (non-defining) cümle virgülle ayrılır ve that ile kurulamaz. Nesne konumundaki who/which/that konuşmada çoğu zaman düşer: 'the app (that) I use'.",
    contrast: {
      title: "Defining – non-defining",
      text: "Virgül anlamı değiştirir: virgülsüz cümle sınırlar, virgüllü cümle ek bilgi verir.",
      pairs: [["My sister who lives in Ankara is a doctor.", "Birden çok kız kardeşim var; Ankara'daki doktor."], ["My sister, who lives in Ankara, is a doctor.", "Tek kız kardeşim var; Ankara'da yaşadığı ek bilgi."]],
    },
    mistakes: [
      ["the book which I read it", "the book which I read", "Relative pronoun nesneyi zaten karşılar; it tekrarlanmaz."],
      ["My father, that is a teacher, …", "My father, who is a teacher, …", "Virgüllü cümlede that kullanılmaz."],
      ["the city which I was born", "the city where I was born", "Yer için where veya edat gerekir (the city which I was born in)."],
    ],
    examples: [
      ["The TA who grades our labs gives very detailed feedback.", "Laboratuvarlarımızı notlayan asistan çok ayrıntılı geri bildirim veriyor.", "kampüs"],
      ["Plants that grow in dry regions often have thick leaves.", "Kurak bölgelerde yetişen bitkilerin çoğu zaman kalın yaprakları vardır.", "akademik"],
      ["The town where I grew up has changed a lot.", "Büyüdüğüm kasaba çok değişti.", "konuşma"],
      ["The researcher whose paper we read will visit next week.", "Makalesini okuduğumuz araştırmacı gelecek hafta ziyarete gelecek.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["The course which I took it was useful.", "The course which I took was useful.", "The course I took it was useful.", "The course which took I was useful."], 1, "which nesneyi karşılar; it tekrarlanmaz."),
      R.gap("That's the student ___ laptop was stolen. (one word)", "whose", "Sahiplik: whose."),
      T.rw("Combine the sentences with 'who'.", "I met a woman. She works at the museum.", "I met a woman who works at the museum.", "She yerine who gelir; zamir tekrarlanmaz.", ["I met a woman that works at the museum."]),
      T.rw("Combine the sentences with 'where'.", "This is the lab. We do our experiments there.", "This is the lab where we do our experiments.", "Yer için where; there tekrarlanmaz.", ["This is the lab in which we do our experiments.", "This is the lab that we do our experiments in.", "This is the lab which we do our experiments in."]),
      P.order("Build the sentence.", ["really", "you", "the", "helpful", "was", "recommended", "that", "book"], "The book that you recommended was really helpful.", "isim + that + özne + fiil; ardından ana fiil was."),
      P.free("Describe a person who influenced you, using one relative clause (who / whose / where).", "My high school chemistry teacher, who always stayed after class to help us, made me love science.", ["Relative clause ismin hemen arkasında", "Gereksiz zamir tekrarı yok", "Ek bilgiyse virgül kullanıldı"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["The people who I met them were friendly.", "The people who I met were friendly.", "The people which I met were friendly.", "The people I met them were friendly."], 1, "who nesneyi karşılar; them tekrar edilmez."),
      V.gap("Paris, ___ is the capital of France, attracts millions of visitors. (one word)", "which", "Virgüllü ek bilgi; şey için which (that olmaz)."),
      V.mc("Choose the correct sentence.", ["This is the hospital where I was born.", "This is the hospital which I was born.", "This is the hospital where I was born there.", "This is the hospital that I was born."], 0, "Yer için where."),
    ],
    exam: "Read an Academic Passage'taki uzun cümlelerde ana fiili bulmak için relative clause'u ayırırsın. Build a Sentence'ta 'the person who…' gibi öbekler doğru sırayla kurulmalıdır.",
    speaking: { pattern: "One person who really helped me was…, who…", model: "One person who really helped me was my older cousin, who taught me how to plan my week.", step: "Kalıbı kendi örneğinle söyle; virgülde kısa bir duraklama yap." },
    recap: ["Relative clause ismin arkasına gelir: the app that I use.", "that/which/who nesneyi karşılar; it/them tekrarlanmaz.", "Virgüllü (ek bilgi) cümlede that kullanılmaz."],
  }),

  "G7.3": F("G7.3", {
    function: "Bir soruyu daha kibar sormak veya bir sorunun cevabından söz etmek için soruyu başka bir cümlenin içine yerleştiririz. İçerideki soru düz cümle sırasına döner.",
    structure: {
      head: ["Giriş", "Kalıp", "Örnek"],
      rows: [
        ["Can/Could you tell me…", "+ wh- + özne + fiil?", "Could you tell me where the library is?"],
        ["Do you know…", "+ if/whether + özne + fiil?", "Do you know if the shop is open?"],
        ["I'm not sure / I wonder", "+ wh-/whether + özne + fiil.", "I wonder why the bus is late."],
        ["do/does/did kalkar", "wh- + özne + V2 / V1-s", "Do you know when the meeting started?"],
      ],
    },
    usage: "Doğrudan soruda yardımcı fiil özneden önce gelir: 'Where is the library?'. Bu soru 'Can you tell me…' gibi bir girişin içine girince düz cümle sırası gelir: 'Can you tell me where the library is?'. Do/does/did kaybolur ve zaman ana fiile geçer: 'When did it start?' → 'Do you know when it started?'. Evet/hayır sorusu dolaylı olurken if veya whether eklenir: 'Is it open?' → 'Do you know if it is open?'. Soru işareti en baştaki cümleye göre konur.",
    contrast: {
      title: "Doğrudan – dolaylı",
      text: "Dolaylı soruda yardımcı fiil öznenin arkasına geçer veya kaybolur.",
      pairs: [["Where does she work?", "Do you know where she works?"], ["Is the lab open?", "Could you tell me if the lab is open?"], ["Why did they cancel it?", "I wonder why they cancelled it."]],
    },
    mistakes: [
      ["Can you tell me where is the library?", "Can you tell me where the library is?", "Dolaylı soruda düz cümle sırası kullanılır."],
      ["Do you know what time does the class start?", "Do you know what time the class starts?", "does kalkar; -s ana fiile geçer."],
      ["I wonder that he is coming.", "I wonder if he is coming.", "Evet/hayır dolaylı sorusu if/whether ile kurulur."],
    ],
    examples: [
      ["Could you tell me where I can print my documents?", "Belgelerimi nereden yazdırabileceğimi söyler misiniz?", "kampüs"],
      ["I'm not sure whether the results are reliable.", "Sonuçların güvenilir olup olmadığından emin değilim.", "akademik"],
      ["Do you know if the professor has office hours today?", "Hocanın bugün ofis saati olup olmadığını biliyor musun?", "kampüs"],
      ["I was wondering how you prepared for the interview.", "Mülakata nasıl hazırlandığını merak ediyordum.", "konuşma"],
    ],
    exercises: [
      R.mc("Choose the correct sentence.", ["Do you know where is the gym?", "Do you know where the gym is?", "Do you know where does the gym is?", "Do you know the gym where is?"], 1, "Düz sıra: the gym is."),
      R.gap("Can you tell me ___ the bus stops here? (yes/no question; one word)", "if", "Evet/hayır sorusu: if/whether.", ["whether"]),
      T.rw("Make it indirect. Start with 'Can you tell me…'.", "Where did you buy that?", "Can you tell me where you bought that?", "did kalkar; fiil geçmiş biçimini alır (bought)."),
      T.rw("Make it indirect. Start with 'Do you know…'.", "Is the exam on Friday?", "Do you know if the exam is on Friday?", "if + düz sıra: the exam is.", ["Do you know whether the exam is on Friday?"]),
      P.order("Build the question.", ["opens", "you", "office", "tell", "when", "me", "could", "the"], "Could you tell me when the office opens?", "Giriş + wh- + özne + fiil (opens)."),
      P.free("Write two polite indirect questions you could ask a university staff member.", "Could you tell me where I can find the scholarship form? Do you know if the deadline has changed?", ["Giriş kalıbı (Could you tell me / Do you know)", "İçerideki soru düz sırada", "Evet/hayır için if/whether"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["I wonder why is she upset.", "I wonder why she is upset.", "I wonder why does she upset.", "I wonder she is why upset."], 1, "Düz sıra: she is."),
      V.gap("Do you know what time the library ___ ? (present of 'close')", "closes", "does kalkar; üçüncü tekil -s fiile geçer."),
      V.mc("Choose the correct sentence.", ["Could you tell me how much does it cost?", "Could you tell me how much it costs?", "Could you tell me how much costs it?", "Could you tell me how much it does cost?"], 1, "Düz sıra ve -s fiilde: it costs."),
    ],
    exam: "Build a Sentence görevinde dolaylı soru en sık sınanan yapılardandır; 'Do you know where…' ile başlayan öbeklerde düz sırayı bulmak gerekir. Write an Email'de rica cümlelerini kibar kılar.",
    speaking: { pattern: "I'm not sure whether…, but I think…", model: "I'm not sure whether online classes are better, but I think they save a lot of time.", step: "Kalıbı kendi görüşünle söyle; whether'ı kısa ve hafif söyle." },
    recap: ["Dolaylı soruda düz cümle sırası: where the library is.", "do/does/did kalkar; zaman ana fiile geçer.", "Evet/hayır soruları if/whether ile."],
  }),

  "G9.1": F("G9.1", {
    function: "Zamanı ve yeri en sık in, on, at ile belirtiriz. Doğru seçim genel–özel ve alan–nokta ayrımına dayanır.",
    structure: {
      head: ["Edat", "Zaman", "Yer"],
      rows: [
        ["in", "ay, yıl, mevsim, yüzyıl, günün bölümleri: in May, in 2025, in the morning", "şehir, ülke, kapalı alan: in Ankara, in the library"],
        ["on", "gün ve tarih: on Monday, on 3 March, on my birthday", "yüzey, kat, cadde: on the table, on the second floor, on Main Street"],
        ["at", "saat ve kesin an: at 9 a.m., at noon, at night", "nokta, adres, etkinlik: at the bus stop, at 25 Park Road, at a conference"],
      ],
    },
    usage: "Kabaca in en geniş, on orta, at en dar zaman/yer içindir. Zaman için: yıl ve aylar in, günler on, saatler at. 'in the morning' ama 'on Monday morning' (gün belirtilince on). Yer için: içinde olunan alan in, yüzey ve kat on, belirli nokta veya etkinlik at. 'at school', 'at work', 'at home' kalıplaşmıştır. Next, last, this, every önünde edat kullanılmaz: 'next Monday' (on yok).",
    contrast: {
      title: "in – at (yer)",
      text: "Binanın içinde olmayı vurgularsan in, orayı bir buluşma noktası veya etkinlik yeri olarak görürsen at kullanılır.",
      pairs: [["I'm in the library.", "Binanın içindeyim"], ["I'll meet you at the library.", "Kütüphane buluşma noktası"]],
    },
    mistakes: [
      ["in Monday", "on Monday", "Günler on alır."],
      ["at 2025", "in 2025", "Yıllar in alır."],
      ["on next week", "next week", "next/last/this önünde edat yok."],
    ],
    examples: [
      ["The workshop starts at 10 a.m. on Thursday.", "Atölye perşembe günü saat 10'da başlıyor.", "kampüs"],
      ["The survey was conducted in 2024 in three cities.", "Anket 2024'te üç şehirde yapıldı.", "akademik"],
      ["I usually study at home in the evening.", "Genellikle akşamları evde çalışırım.", "konuşma"],
      ["The lost-and-found office is on the ground floor.", "Kayıp eşya ofisi zemin katta.", "kampüs"],
    ],
    exercises: [
      R.mc("Complete: 'The lecture is ___ Wednesday ___ 2 p.m.'", ["in / at", "on / at", "at / on", "on / in"], 1, "Gün on, saat at."),
      R.gap("My birthday is ___ July. (one word)", "in", "Aylar in alır."),
      T.rw("Correct the sentence.", "We will meet on next Friday at the morning.", "We will meet next Friday in the morning.", "next önünde edat yok; günün bölümü in the morning."),
      T.gap("Turn left; the office is ___ the third floor. (one word)", "on", "Katlar on alır."),
      P.order("Build the sentence.", ["March", "is", "in", "conference", "the", "Istanbul", "in"], "The conference is in Istanbul in March.", "Şehir in, ay in.", ["In March the conference is in Istanbul."]),
      P.free("Describe your typical Monday with three time or place expressions.", "On Mondays, I wake up at seven. I have classes in the morning, and in the afternoon I study at the library.", ["Günler on, saatler at, aylar/günün bölümleri in", "Yerler: şehir/bina içi in, nokta at, kat on", "next/every önünde edat yok"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["I was born on 2003.", "I was born in 2003.", "I was born at 2003.", "I was born 2003 in."], 1, "Yıllar in alır."),
      V.gap("Let's meet ___ the bus stop. (one word)", "at", "Belirli nokta: at."),
      V.mc("Choose the correct sentence.", ["See you at Monday morning.", "See you on Monday morning.", "See you in Monday morning.", "See you Monday on morning."], 1, "Gün belirtilince on Monday morning."),
    ],
    exam: "Listening'deki duyurularda (Announcement) saat, gün ve yer bilgileri bu edatlarla gelir ve çoğu zaman sorunun cevabıdır. Complete the Words'te kısa edatlar tam verilir, ama kendi yazında doğru seçmen gerekir.",
    speaking: { pattern: "I usually… at… in the…, but on…", model: "I usually study at the library in the morning, but on weekends I study at home.", step: "Kendi rutininle söyle; at/in/on'u hafif, zaman bilgisini vurgulu söyle." },
    recap: ["Zaman: in + ay/yıl/günün bölümü, on + gün/tarih, at + saat.", "Yer: in + alan/şehir, on + yüzey/kat, at + nokta/etkinlik.", "next, last, this, every önünde edat yok."],
  }),

  "G10.1": F("G10.1", {
    function: "Fikirler arasındaki ilişkiyi (ekleme, karşıtlık, neden-sonuç, örnek) açıkça göstermek için bağlaç ve söylem işaretleri kullanırız. Doğru işaret, dinleyicinin seni izlemesini kolaylaştırır.",
    structure: {
      head: ["İşlev", "Cümle içinde (bağlaç)", "Cümleler arası (zarf)"],
      rows: [
        ["Ekleme", "and, as well as", "In addition, Moreover, Also,"],
        ["Karşıtlık", "but, although, while, whereas", "However, On the other hand, In contrast,"],
        ["Neden / sonuç", "because, since, so", "Therefore, As a result, Consequently,"],
        ["Örnek", "such as, like", "For example, For instance,"],
        ["Kapanış", "—", "Overall, In short, To sum up,"],
      ],
    },
    usage: "Bağlaçlar (and, but, so, because, although) iki parçayı aynı cümle içinde bağlar. Söylem işaretleri (However, Therefore, In addition) ise yeni bir cümlenin başında gelir ve arkalarından virgül alır. 'On the other hand' bir karşıtlık işaretidir; ekleme için kullanılmaz. Çok fazla işaret metni mekanik yapar; her geçişte değil, ilişkinin belirsiz olabileceği yerde kullan. Although bir yan cümle başlatır ve aynı cümlede 'but' ile birlikte kullanılmaz.",
    contrast: {
      title: "However – but – although",
      text: "Üçü de karşıtlık bildirir ama cümledeki yerleri farklıdır.",
      pairs: [["The plan is cheap, but it is slow.", "but: iki cümleyi virgülle bağlar"], ["The plan is cheap. However, it is slow.", "However: yeni cümle başında, virgülle"], ["Although the plan is cheap, it is slow.", "although: yan cümle başlatır; but eklenmez"]],
    },
    mistakes: [
      ["On the other hand, it is also cheap. (ekleme anlamında)", "In addition, it is also cheap.", "On the other hand karşıtlık bildirir."],
      ["Although it was late, but we continued.", "Although it was late, we continued.", "although ve but birlikte kullanılmaz."],
      ["I was tired, however I continued.", "I was tired; however, I continued.", "However zarftır: önünde nokta/noktalı virgül, arkasında virgül."],
    ],
    examples: [
      ["Online classes save time. However, they can feel isolating.", "Çevrim içi dersler zaman kazandırır. Ancak yalnızlaştırıcı olabilir.", "akademik"],
      ["I chose this course because it includes a lot of fieldwork.", "Bu dersi çok fazla saha çalışması içerdiği için seçtim.", "konuşma"],
      ["The bus is cheaper; on the other hand, the train is faster.", "Otobüs daha ucuz; öte yandan tren daha hızlı.", "kampüs"],
      ["Rainfall decreased sharply. As a result, crop yields fell by 20 percent.", "Yağış keskin biçimde azaldı. Sonuç olarak ürün verimi yüzde 20 düştü.", "akademik"],
    ],
    exercises: [
      R.mc("Choose the best connector: 'The library is quiet. ___, it closes too early for me.'", ["Therefore", "However", "For example", "In addition"], 1, "İkinci cümle karşıtlık bildiriyor: However."),
      R.gap("I missed the bus, ___ I was late for class. (one word)", "so", "Sonuç: so."),
      T.rw("Correct the sentence.", "Although the test was hard, but I passed.", "Although the test was hard, I passed.", "although ile but birlikte kullanılmaz.", ["The test was hard, but I passed."]),
      T.mc("Choose the best connector to add a second advantage: 'Cycling is healthy. ___, it is cheap.'", ["On the other hand", "In addition", "However", "In contrast"], 1, "Ekleme: In addition."),
      P.order("The deadline moved forward. Build the next sentence.", ["start", "decided", "therefore", "earlier", "to", "we"], "Therefore we decided to start earlier.", "Sonuç zarfı cümle başında; yazıda arkasına virgül konur: Therefore, we…", ["We therefore decided to start earlier."]),
      P.free("Write a 3-sentence opinion on 'Should students work part-time?' using one contrast connector and one result connector.", "Part-time jobs teach students useful skills. However, they can reduce study time. Therefore, I think ten hours a week is a reasonable limit.", ["Bir karşıtlık işareti doğru yerde", "Bir sonuç işareti doğru yerde", "Cümle başı işaretlerden sonra virgül"]),
    ],
    review: [
      V.mc("Choose the correct sentence.", ["I like the city. On the other hand, it has great food.", "I like the city. In addition, it has great food.", "I like the city. However, it has great food too.", "I like the city. In contrast, it has great food."], 1, "Ekleme: In addition."),
      V.gap("___ the weather was bad, the event went ahead. (one word)", "Although", "Yan cümle başlatan karşıtlık: Although.", ["Though"]),
      V.mc("Which connector introduces an example?", ["Consequently", "For instance", "Nevertheless", "Moreover"], 1, "For instance = örneğin."),
    ],
    exam: "Write for an Academic Discussion'da fikrini gerekçe ve örnekle bağlarken; Listen to an Academic Talk'ta konuşmacının 'however' veya 'as a result' dediği noktalar çoğu zaman soruların cevabını işaretler. Interview cevabında 'The main reason is…', 'For example…', 'Overall…' 45 saniyelik yapıyı taşır.",
    speaking: { pattern: "The main reason is… For example,… Overall,…", model: "I prefer studying in the morning. The main reason is that I'm more focused. For example, I finished my essay in two hours last Monday. Overall, mornings work best for me.", step: "45 saniyelik bir cevabı bu üç işaretle sesli kur; işaretlerden sonra kısa bir duraklama yap." },
    recap: ["İşlevi doğru seç: ekleme (In addition), karşıtlık (However), sonuç (Therefore), örnek (For example).", "However/Therefore cümle başında ve virgülle; but/so cümle içinde.", "although ile but birlikte kullanılmaz."],
  }),

  "G10.3": F("G10.3", {
    function: "Kime yazdığına göre dilini ayarlamak (register), e-postanın amacına ulaşmasını sağlar. Hocaya, görevliye veya arkadaşa aynı tonla yazılmaz.",
    structure: {
      head: ["Parça", "Resmî / yarı resmî", "Gündelik"],
      rows: [
        ["Selamlama", "Dear Professor Lee, / Dear Ms. Kaya,", "Hi Deniz,"],
        ["Amaç", "I am writing to ask about…", "Just a quick question about…"],
        ["Rica", "I was wondering if you could… / Would it be possible to…?", "Can you…?"],
        ["Özür", "I apologize for… / I'm sorry for any inconvenience.", "Sorry about…"],
        ["Kapanış", "I look forward to hearing from you. Best regards,", "See you soon! Cheers,"],
      ],
    },
    usage: "TOEFL Write an Email görevinde alıcı genellikle hoca, kurum görevlisi veya kulüp yöneticisidir; bu yüzden nazik ve yarı resmî bir ton gerekir. Türkçede 'Hocam, … istiyorum' doğal gelse de İngilizcede 'I want' sert duyulur; 'I was wondering if…' veya 'Would it be possible…' tercih edilir. Kısaltmalar (I'm, don't) yarı resmî e-postada kabul edilebilir, ama argo, emoji ve 'pls' kullanılmaz. Amaç ilk iki cümlede açıkça söylenmeli; kibarlık açıklığın yerini almaz.",
    contrast: {
      title: "Doğrudan – kibar",
      text: "Aynı istek, cümle yapısı değişince farklı tonda duyulur.",
      pairs: [["I want the slides.", "Talep gibi"], ["Could you share the slides?", "Kibar rica"], ["I was wondering if you could share the slides.", "Daha dolaylı ve resmî"]],
    },
    mistakes: [
      ["Hey professor, I want…", "Dear Professor Lee, I was wondering if…", "Hocaya yazarken resmî selamlama ve dolaylı rica."],
      ["Give me an extension.", "Would it be possible to have a short extension?", "Emir kipi ricada kaba duyulur."],
      ["Thanks!!! bye", "Thank you for your time. Best regards, [Ad]", "Kapanış nazik ve tam olmalı."],
    ],
    examples: [
      ["Dear Professor Aydın, I am writing to ask about the deadline for the final paper.", "Sayın Hocam, final ödevinin son tarihi hakkında sormak için yazıyorum.", "kampüs"],
      ["I was wondering if it would be possible to meet during your office hours on Thursday.", "Perşembe günkü ofis saatinizde görüşmemizin mümkün olup olmadığını merak ediyordum.", "kampüs"],
      ["I apologize for missing the meeting; I had a medical appointment.", "Toplantıyı kaçırdığım için özür dilerim; doktor randevum vardı.", "kampüs"],
      ["Thank you for your help. I look forward to hearing from you.", "Yardımınız için teşekkür ederim. Sizden haber bekliyorum.", "kampüs"],
    ],
    exercises: [
      R.mc("Which opening fits an email to a department secretary?", ["Hey!", "Dear Ms. Demir,", "Yo Ms. Demir", "Hello dear,"], 1, "Resmî selamlama: Dear + unvan + soyadı."),
      R.mc("Which request is the most appropriate for a professor?", ["Send me the reading list.", "I want the reading list now.", "Could you please send me the reading list?", "Reading list pls."], 2, "Could you please… kibar bir ricadır."),
      T.rw("Make it more polite.", "I want to change my presentation date.", "I was wondering if I could change my presentation date.", "Dolaylı rica kalıbı kullanılır.", ["Would it be possible to change my presentation date?", "Could I change my presentation date?", "Could I possibly change my presentation date?"]),
      T.rw("Rewrite the closing so it suits an email to a professor.", "ok thx bye", "Thank you for your time. Best regards,", "Teşekkür + resmî kapanış.", ["Thank you for your help. Best regards,", "Thank you. Best regards,", "Thank you for your time. Kind regards,", "Thank you for your time. Best regards"]),
      P.order("Build the opening sentence.", ["lab", "to", "am", "about", "writing", "the", "ask", "I", "schedule"], "I am writing to ask about the lab schedule.", "Amaç cümlesi: I am writing to + fiil."),
      P.free("Write a 4–5 sentence email to a professor asking to submit an assignment two days late. Give a reason and suggest a new date.", "Dear Professor Lee, I am writing to ask whether I could submit my lab report two days late. I was ill on Monday and Tuesday and could not finish the analysis. Would it be possible to submit it on Friday instead of Wednesday? I can send a doctor's note if needed. Thank you for your understanding. Best regards, Ece Yılmaz", ["Resmî selamlama ve kapanış", "Amaç ilk iki cümlede", "Kibar rica kalıbı ve somut öneri", "Gerekçe kısa ve net"]),
    ],
    review: [
      V.mc("Which sentence is most appropriate in an email to a librarian?", ["Fix my account.", "My account is broken, do something.", "Could you please check why I cannot log in to my account?", "Account not working!!!"], 2, "Kibar rica + açık sorun."),
      V.gap("I look forward ___ hearing from you. (one word)", "to", "look forward to + -ing."),
      V.mc("Which closing is best for a formal email?", ["Love,", "Best regards,", "Bye bye,", "xx"], 1, "Resmî kapanış: Best regards,"),
    ],
    exam: "Write an Email görevi doğrudan bu beceriyi ölçer: alıcıya uygun ton, istenen noktaların hepsi ve açık bir kapanış. Listen to a Conversation'da öğrencinin bir görevliye nasıl rica ettiğini anlaman da gerekir.",
    speaking: { pattern: "I was wondering if I could…", model: "I was wondering if I could join the study group this semester.", step: "Kalıbı kibar bir tonla, sonu hafifçe alçalarak söyle." },
    recap: ["Selamlama: Dear + unvan + soyadı; kapanış: Best regards, + ad.", "Rica: I was wondering if… / Would it be possible…; 'I want' yerine.", "Amaç ilk iki cümlede; argo ve emoji yok."],
  }),
  // Built from the learner's phrasal verbs file (v0.7); its cards live in the word deck under the same lesson.
  "G6.5": F("G6.5", {
    function: "Fiil + parçacık (up, out, off…) ya da fiil + edat birleşimiyle tek kelimelik fiilden farklı, yeni bir anlam kurarız: figure out (çözmek), carry out (yürütmek), look into (araştırmak). Konuşmada ve dinleme metinlerinde çok sık geçer; anlamı çoğu zaman parçaların toplamından tahmin edilemez.",
    structure: {
      head: ["Tür", "Kalıp", "Örnek"],
      rows: [
        ["Ayrılabilir (separable)", "fiil + isim + parçacık / fiil + parçacık + isim", "Turn the lamp off. / Turn off the lamp."],
        ["Ayrılabilir + zamir", "fiil + zamir + parçacık (zorunlu)", "Turn it off. (Turn off it değil)"],
        ["Nesne yeri sabit (inseparable)", "fiil + edat + nesne", "Look after her. / Look into the problem."],
        ["Üç parçalı", "fiil + parçacık + edat + nesne", "I can't put up with the noise."],
        ["Nesnesiz (intransitive)", "fiil + parçacık", "The plane took off. / Practice paid off."],
        ["Edat + -ing", "… to / about / on + V-ing", "I'm looking forward to meeting you."],
      ],
    },
    usage: "Önce kartın kalıbına (pattern) bak: “carry something out / carry it out” ayrılabilir demektir; “look after someone” nesnenin edattan sonra geldiğini söyler; “take off” tek başına ise o anlamda nesne almaz. Aynı ifadenin farklı anlamları farklı kalıplara sahip olabilir: Practice paid off (karşılığını verdi, nesnesiz) – We paid the loan off (borcu kapattık, ayrılabilir). Zaman değişince yalnız fiil çekimlenir, parçacık aynı kalır: pay off → pays off → paid off → paying off. Parçacıkların çağrışımları (up = tamamlama/artış, out = sona kadar/ortaya çıkarma, off = ayrılma/durdurma) hatırlamaya yardım eder ama kesin çeviri kuralı değildir. Akademik yazıda bazı phrasal verb'lerin tek kelimelik karşılığı daha resmîdir: look into → investigate, carry out → conduct, find out → discover.",
    contrast: {
      title: "ayrılabilir – nesne yeri sabit",
      text: "Ayrılabilir ifadelerde isim nesne iki yere de gelebilir, zamir ise mutlaka ortaya girer. Nesne yeri sabit ifadelerde (look after, look into, go over, put up with) nesne hep son edattan sonra gelir; zamir de öyle.",
      pairs: [
        ["We carried out the survey. / We carried the survey out.", "Ayrılabilir: iki sıra da doğru"],
        ["We carried it out.", "Zamir ortaya girer"],
        ["Let's go over the notes. / Let's go over them.", "Sabit: nesne hep sonda"],
        ["Our plan finally paid off.", "Nesnesiz anlam: arkasına nesne gelmez"],
      ],
    },
    mistakes: [
      ["Turn off it.", "Turn it off.", "Ayrılabilir ifadede zamir nesne parçacıktan önce gelir."],
      ["Could you look her after?", "Could you look after her?", "look after nesne yeri sabit: nesne edattan sonra."],
      ["I'm looking forward to meet you.", "I'm looking forward to meeting you.", "Buradaki to edattır; ardından fiil -ing alır."],
    ],
    examples: [
      ["The researchers carried out a survey of 300 students.", "Araştırmacılar 300 öğrenciyle bir anket yürüttü.", "akademik"],
      ["The professor pointed out a mistake in my graph.", "Hoca grafiğimdeki bir hataya dikkat çekti.", "kampüs"],
      ["We couldn't figure out the last question, so we asked the TA.", "Son soruyu çözemedik, bu yüzden asistana sorduk.", "kampüs"],
      ["The committee is looking into the cause of the delay.", "Komite gecikmenin nedenini araştırıyor.", "akademik"],
      ["I came up with a simpler way to study vocabulary.", "Kelime çalışmak için daha basit bir yol buldum.", "konuşma"],
      ["All that speaking practice finally paid off.", "O kadar konuşma çalışması sonunda karşılığını verdi.", "konuşma"],
    ],
    exercises: [
      { stage: "recognition", type: "mcq", prompt: "Choose the correct sentence.", options: ["Please turn off it.", "Please turn it off.", "Please turn it of.", "Please off turn it."], answer: 1, why: "turn off ayrılabilir; zamir (it) parçacıktan önce gelir." },
      { stage: "recognition", type: "mcq", prompt: "‘The library is looking into the problem.’ What does ‘look into’ mean here?", options: ["to ignore", "to investigate", "to repair quickly", "to look inside a room"], answer: 1, why: "look into = bir konuyu incelemek, araştırmak." },
      { stage: "recognition", type: "gap", prompt: "We ___ the experiment last week. (past simple of 'carry out')", answer: "carried out", accept: [], why: "Geçmiş zamanda yalnız fiil çekimlenir: carry → carried; out aynı kalır." },
      { stage: "transformation", type: "rewrite", prompt: "Replace the noun with a pronoun: ‘She filled out the form.’", source: "She filled out the form.", answer: "She filled it out.", accept: [], why: "Zamir nesne ayrılabilir ifadenin ortasına girer: filled it out." },
      { stage: "transformation", type: "gap", prompt: "I'm looking forward to ___ my results. (get)", answer: "getting", accept: [], why: "look forward to: to edat; ardından -ing." },
      { stage: "production", type: "order", prompt: "Build the sentence.", tokens: ["She", "came", "up", "with", "a", "better", "idea"], answer: "She came up with a better idea.", accept: [], why: "come up with üç parçalıdır; nesne (a better idea) en sona gelir." },
      { stage: "production", type: "free", prompt: "Write 2–3 sentences about a problem you solved. Use ‘figure out’ and one other phrasal verb.", model: "Last month my laptop kept freezing during online classes. I looked into the problem and figured out that an old program was using all the memory. I uninstalled it, and the laptop hasn't broken down since.", checklist: ["figure out doğru kalıpla kullanıldı", "Zamir nesne varsa doğru yerde (figure it out)", "Geçmiş zamanda yalnız fiil çekimlendi"] },
    ],
    review: [
      { type: "mcq", prompt: "Choose the correct sentence.", options: ["Can you look my dog after?", "Can you look after my dog?", "Can you look after of my dog?", "Can you after look my dog?"], answer: 1, why: "look after nesne yeri sabit: look after my dog." },
      { type: "gap", prompt: "The puzzle was hard, but we finally ___ the answer. (past simple of 'work out')", answer: "worked out", accept: [], why: "Geçmiş zamanda yalnız fiil çekimlenir: worked out; zamirle ‘worked it out’ olurdu." },
      { type: "mcq", prompt: "Which sentence uses the phrasal verb WITHOUT an object correctly?", options: ["The plane took off at noon.", "The plane took off the runway it.", "The plane took it off.", "The plane off took."], answer: 0, why: "take off (havalanmak) bu anlamda nesnesizdir." },
    ],
    exam: "Dinleme görevlerinde (konuşmalar, duyurular, dersler) phrasal verb'ler çok sık geçer: figure out, sign up, drop off, look into, point out, come up with. Konuşmada doğal ve akıcı duyulmanı sağlarlar. Akademik yazıda bazılarının tek kelimelik karşılığı daha resmîdir (look into → investigate). Complete the Words'te ‘up, out, off’ gibi kısa boşluklar çoğu zaman bir phrasal verb'ün parçasıdır.",
    speaking: { pattern: "At first I couldn't figure out …, but then I came up with …", model: "At first I couldn't figure out how to manage my time, but then I came up with a simple weekly plan.", step: "Kalıbı kendi deneyiminle sesli söyle; figure it out, set it up gibi zamirli biçimleri de dene." },
    recap: ["Önce kartın kalıbına bak: ayrılabilir mi, nesne yeri sabit mi, nesnesiz mi?", "Ayrılabilir ifadede zamir ortaya girer: turn it off, fill it out.", "Zaman değişince yalnız fiil çekimlenir: carried out, came up with.", "Edat olan to'dan sonra -ing: look forward to meeting."],
    particles: true,
    deck: { scope: "t:phrasal", label: "Öbek fiil kartlarını çalış" },
  }),
};
