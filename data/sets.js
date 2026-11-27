// Question sets (v0.9). Each existing Reading/Listening text gets its full set:
// 2–3 questions for daily texts, 5 for academic passages (which are also
// lengthened toward ~200 words), 2 for conversations and announcements, 4 for
// academic talks. Every option has a short reason (why), so a wrong choice gets
// feedback about that choice, and every question has a focus (the reading or
// listening skill it tests) for the mistake notebook. Original, AI-assisted.
// provenance: original-ai-assisted · review: unreviewed

const Q = (prompt, options, answer, explanation, why, focus) => ({ prompt, options, answer, explanation, why, focus });

export const SET_DATA = {
  // ── Read in Daily Life ──────────────────────────────────────────────────
  "dr-01": {
    options: ["Pick it up from the North Desk by 6:00 p.m. on Thursday", "Return it to the North Desk on Thursday", "Call the next person on the waiting list", "Pay for the book online before the desk closes on Thursday"],
    focus: "eylem",
    why: ["", "Kitap iade edilmiyor, teslim alınıyor: collect = almak.", "Sıradaki kişiyi kütüphane arayacak; Maya'dan böyle bir şey istenmiyor.", "Ödeme yok; yalnız kart veya kimlik isteniyor."],
    more: [
      Q("What happens if Maya does not come by Thursday evening?", ["The library will hold the book for one more day", "The book will go to someone else who is waiting", "Maya will have to pay a late fee", "The North Desk will mail the book to her"], 1,
        "After that time, it will be offered to the next person on the waiting list.", ["Ek süre verilmiyor; saatten sonra kitap başkasına teklif ediliyor.", "", "Ücret yok; gecikmiş iade ile karıştırma.", "Postayla gönderme yok; kitap masada bekliyor."], "sonuç"),
      Q("What does Maya need to bring?", ["A receipt for the book", "The book she borrowed last week", "A form of identification", "A note from the desk staff"], 2,
        "Bring your library card or a photo ID: kütüphane kartı veya fotoğraflı kimlik.", ["Fiş istenmiyor.", "Önceki bir kitaptan söz edilmiyor.", "", "Görevliden not istenmiyor."], "ayrıntı"),
    ],
  },
  "dr-02": {
    options: ["Room 4B is unavailable at 9:00", "The client cannot arrive early enough for the original time", "Lena needs more time to prepare the budget before the meeting starts", "The team requested a shorter meeting"],
    focus: "neden",
    why: ["Oda değişmiyor: We will still use Room 4B.", "", "Lena soruları gündeme ekleyecek; hazırlık süresi neden olarak söylenmiyor.", "Toplantının uzunluğundan söz edilmiyor; yalnız başlangıç saati değişiyor."],
    more: [
      Q("What are team members asked to do tonight?", ["Send Lena their questions about the budget", "Meet the client at the train station", "Prepare a short presentation for 10:30", "Book a larger meeting room"], 0,
        "Please send your budget questions to Lena tonight.", ["", "Tren geçiyor ama karşılama istenmiyor.", "Sunum istenmiyor; 10:30 yalnız yeni başlangıç saati.", "Oda aynı kalıyor: still use Room 4B."], "eylem"),
    ],
  },
  "dr-03": {
    options: ["To recruit volunteers to remove branches", "To warn visitors that the entire park will be closed permanently from May 12", "To explain a temporary closure and provide an alternate route", "To announce that the visitor center has moved to East Bridge"],
    focus: "amaç",
    why: ["Gönüllü aranmıyor; işi ekipler (crews) yapıyor.", "Kapanış geçici (12–16 Mayıs) ve yalnız bir bölümde.", "", "Merkez taşınmıyor; yalnız Mill Road tarafından giriliyor."],
    more: [
      Q("How can visitors reach the visitor center during the closure?", ["Through Oak Park", "From East Bridge", "Only from Mill Road", "Along the river trail"], 2,
        "Access to the visitor center remains open from Mill Road only.", ["Oak Park yürüyüş ve bisiklet için sapak; merkezin girişi değil.", "East Bridge kapalı bölümün bir ucu.", "", "Nehir yolu bu bölümde kapalı."], "ayrıntı"),
      Q("The word \"unstable\" in the sign is closest in meaning to", ["likely to fall", "very old", "recently planted", "hard to see"], 0,
        "Unstable branches: sağlam olmayan, düşebilecek dallar; fırtına hasarıyla birlikte anılıyor.", ["", "Yaşla değil, sağlamlıkla ilgili.", "Yeni dikilen dal kaldırılmaz; anlam ters.", "Görünürlükten söz edilmiyor."], "kelime"),
    ],
  },
  "dr-04": {
    focus: "uygulama",
    why: ["", "Üç-altı gün kala iptal yüzde 50 iade alır.", "48 saat içinde iade yok; yalnız devretme var.", "Devretme iade değildir ve atölyeden sonra yapılmaz."],
    more: [
      Q("What can someone do if the workshop starts tomorrow and they cannot attend?", ["Get half of the fee back", "Give their place to another person for free", "Move to a later workshop for a small fee", "Ask for a full refund in writing"], 1,
        "Yarın başlıyorsa 48 saatin içindesin: iade yok, ama kayıt ücretsiz olarak başka birine devredilebilir.", ["Yüzde 50 için en az üç gün gerekir.", "", "Başka tarihe geçişten söz edilmiyor.", "Yazılı istemek kuralı değiştirmez."], "çıkarım"),
      Q("How is the information organized?", ["From the earliest cancellation to the latest", "From the cheapest workshop to the most expensive", "By the type of participant", "As steps for registering"], 0,
        "Yedi gün önce → üç-altı gün → 48 saat: iptal zamanına göre sıralanmış.", ["", "Fiyatlar karşılaştırılmıyor.", "Ölçüt katılımcı türü değil, iptal zamanı.", "Kayıt adımları anlatılmıyor."], "yapı"),
    ],
  },
  "dr-05": {
    focus: "ayrıntı",
    why: ["Kıyafetleri almak makine durduktan sonraki 10 dakikayla ilgili, saat 17 ile değil.", "", "Rezervasyon sistemi yok.", "Deterjan satılmıyor; masada jeton satılıyor."],
    more: [
      Q("How many tokens does a resident need for two washes?", ["Two", "Three", "Four", "Ten"], 2,
        "Each wash costs two tokens: iki yıkama = dört jeton.", ["İki, tek yıkamanın fiyatı.", "Metinde üç yok; hesap hatası.", "", "On, dakika sayısı (ten minutes)."], "hesap"),
    ],
  },
  "dr-06": {
    focus: "amaç",
    why: ["Oturum iptal değil; aynı saatte başka yerde.", "Boyayı üyeler yapmıyor; yardım istenmiyor.", "", "Soruları yazan kişi kendisi basacak; bu bir hatırlatma değil."],
    more: [
      Q("Why can the group not use the library room?", ["Dana did not book it in time", "It is closed on Thursdays", "It is being painted", "It has no screen for the slides"], 2,
        "The room we booked in the library is being repainted.", ["Oda ayrılmıştı: the room we booked.", "Perşembe kapanışı söylenmiyor.", "", "Eksik olan ekran değil laptop; Dana'nın durumuyla karıştırma."], "neden"),
      Q("What will the writer do?", ["Bring a laptop", "Print the practice questions", "Book the lounge for another day", "Help repaint the room"], 1,
        "I'll print the practice questions.", ["Laptop başka birinden isteniyor.", "", "Başka gün için ayırma yok; saat aynı.", "Boyama kütüphanenin işi."], "kim ne yapacak"),
    ],
  },
  "dr-07": {
    measure: true,
    focus: "çıkarım",
    why: ["Taşıma ücreti istasyon dışına bırakılan bisiklet için; burada istasyona bırakılıyor.", "İlk 30 dakika ücretsiz; 20 dakika bu süreyi aşmıyor.", "Dönem kartı gerekmiyor; kayıtlı öğrenci olmak yeterli.", ""],
    more: [
      Q("What will happen to students who already have a semester pass?", ["They must exchange it for ride credit on 1 March", "They can keep using it until it expires", "They will get a refund for the unused days", "They will pay only the relocation fee"], 1,
        "Current semester passes stay valid until they expire.", ["Değiştirme zorunluluğu yok.", "", "İade söylenmiyor.", "Taşıma ücreti kartla değil, bisikleti istasyon dışında bırakmakla ilgili."], "ayrıntı"),
      Q("A registered student rides for 50 minutes. How many charged periods will there be?", ["None", "One", "Two", "Three"], 2,
        "İlk 30 dakika ücretsiz; kalan 20 dakika iki 15 dakikalık dilime girer (15 + 5).", ["50 dakika ücretsiz 30 dakikayı aşıyor.", "Kalan 20 dakika tek dilime sığmaz.", "", "Üç dilim 45 ek dakika demek."], "hesap"),
    ],
  },
  "dr-08": {
    options: ["Their applications will be reviewed first", "They may leave this round and apply again later without disadvantage", "They must move their travel dates to the autumn round instead of the summer", "They will automatically receive partial funding"],
    focus: "çıkarım",
    why: ["Öncelik sırası söylenmiyor.", "", "Seyahat dönemi değişmiyor: June–September aynı.", "Kısmi destek otomatik verilmiyor."],
    more: [
      Q("Why will the decisions be sent later than planned?", ["The committee lost some of the applications it received", "The travel period has changed", "There were far more applications than last year", "Some applicants withdrew from the round"], 2,
        "We received nearly three times as many applications as last year.", ["Kayıp başvuru yok.", "Tam tersi: seyahat dönemi değişmiyor.", "", "Çekilmek bir seçenek; gecikmenin nedeni değil."], "neden"),
      Q("The phrase \"without penalty\" is closest in meaning to", ["without losing anything", "without permission", "without a written letter", "without paying travel costs"], 0,
        "Without penalty: ceza veya kayıp olmadan.", ["", "İzin değil, cezanın yokluğu.", "Mektupla ilgisi yok.", "Seyahat masrafı başka bir konu."], "kelime"),
    ],
  },

  // ── Read an Academic Passage (lengthened toward ~200 words, five questions) ──
  "ar-01": {
    options: ["To show one mechanism by which fire initiates germination", "To argue that all seeds survive intense fires", "To explain why seedlings require less water after a fire", "To show that hard seed coats cause competition between neighboring plants"],
    focus: "amaç (retorik)",
    passageAdd: "Scientists call plants with this strategy fire-adapted. In parts of Australia and California, some shrubs produce cones that stay sealed until they are heated, and they release thousands of seeds only after a fire has passed. Ash left on the ground also returns minerals such as potassium to the soil, which can briefly improve its fertility. Land managers sometimes use small, controlled burns to imitate this natural cycle. If fires are suppressed for decades, however, dead material builds up, and the next fire may be hot enough to destroy even fire-adapted seeds.",
    why: ["", "Metin tersini söylüyor: çok şiddetli yangın tohumları öldürebilir.", "Suya daha az ihtiyaç söylenmiyor; kabuk çatlayınca tohum su alabiliyor.", "Rekabeti azaltan, yüzeydeki bitkilerin yanması; kabuk rekabete yol açmıyor."],
    more: [
      Q("The word \"dormant\" in the passage is closest in meaning to", ["damaged", "inactive", "hidden", "scattered"], 1,
        "Dormant = uykuda, etkin değil: tohum yıllarca toprakta bekler, sonra çimlenir.", ["Zarar görmüş değil; tohum canlı ama bekliyor.", "", "Toprakta olduğu için 'saklı' akla gelir, ama anlam uyku hâli.", "Dağılmış anlamı yok."], "kelime"),
      Q("According to the passage, how does fire help young seedlings?", ["It removes plants that would block sunlight", "It warms the soil during cold nights", "It kills insects that eat young plants", "It slowly softens seed coats over many years"], 0,
        "Fire also clears dense surface plants, so young seedlings receive more sunlight and face less competition.", ["", "Gece sıcaklığından söz edilmiyor.", "Böcekler metinde yok; makul görünse de kanıt yok.", "Kabuk ısıyla bir anda çatlıyor; yıllar içinde yumuşamıyor."], "ayrıntı"),
      Q("What can be inferred about long periods without any fire?", ["They help fire-adapted species spread faster", "They can make a later fire more dangerous for seeds", "They return more minerals to the soil", "They have no effect on fire-adapted plants"], 1,
        "If fires are suppressed for decades, dead material builds up, and the next fire may be hot enough to destroy even fire-adapted seeds.", ["Tersine: yangın olmadan çimlenme tetiklenmez.", "", "Mineraller külle döner; yangın yoksa kül de yok.", "Metin etkisini açıkça anlatıyor: ölü madde birikir."], "çıkarım"),
      Q("All of the following are mentioned as effects of fire EXCEPT", ["cracking hard seed coats", "returning minerals to the soil", "opening sealed cones", "increasing rainfall in burned areas"], 3,
        "Yağışın arttığı söylenmiyor; diğer üçü metinde geçiyor.", ["Metinde var: heat cracks that coat.", "Metinde var: ash returns minerals.", "Metinde var: cones stay sealed until heated.", ""], "olumsuz ayrıntı (EXCEPT)"),
    ],
  },
  "ar-02": {
    focus: "çıkarım",
    passageAdd: "Planners in hot cities often combine reflective roofs with other measures. Street trees provide shade and cool the air as water evaporates from their leaves, while parks create pockets of cooler air that can spread into nearby blocks. Some researchers have also tested reflective pavement, but early trials found that it can bounce sunlight onto pedestrians and nearby walls, making people feel hotter even when the surface itself stays cooler. These findings show that a material that works well on a roof will not necessarily work in every part of a city.",
    why: ["Metin tersini söylüyor: sokak düzeyindeki etki şehre göre değişir.", "", "Soğuk bölgelerde kış ısınması biraz artabilir; 'yalnız alçak binalarda' denmiyor.", "Maliyetleri ortadan kaldırmıyor; kışın ısınmayı artırabiliyor."],
    more: [
      Q("According to the passage, why are cities often warmer than rural areas?", ["Cities receive more hours of direct sunlight", "Air-conditioning units heat the streets", "Dark roofs and pavement store solar energy and release it slowly", "Tall buildings block the cooling winds that would otherwise reach the streets"], 2,
        "Dark roofs and pavement absorb solar energy and release it slowly as heat.", ["Güneş daha fazla değil; koyu yüzeyler enerjiyi tutuyor.", "Klimalar ısınmanın nedeni olarak geçmiyor.", "", "Rüzgâr, etkiyi değiştiren bir etken; ısınmanın nedeni değil."], "neden"),
      Q("Why does the author mention reflective pavement?", ["To recommend it as the cheapest cooling method", "To show that a solution that works on roofs may fail in other places", "To explain how trees cool the air", "To argue that roofs in hot cities should be painted dark again to save energy"], 1,
        "Kaplamalı kaldırım insanları daha sıcak hissettirebiliyor: çatıda işe yarayan her yerde yaramaz.", ["Maliyetten söz edilmiyor.", "", "Ağaçlar ayrı bir örnek.", "Koyu çatı önerisi yok."], "amaç (retorik)"),
      Q("The word \"substantially\" in the passage is closest in meaning to", ["slightly", "considerably", "temporarily", "unexpectedly"], 1,
        "Substantially = önemli ölçüde.", ["Zıt anlam: biraz.", "", "Süreyle ilgili değil.", "Şaşırtıcılıkla ilgili değil."], "kelime"),
      Q("What would the author most likely recommend for a city with cold winters?", ["Covering every roof with reflective material at once", "Replacing parks with reflective pavement", "Removing street trees to let in more sunlight", "Weighing winter heating needs before using reflective roofs"], 3,
        "Yazar, değerin yerel iklime göre değerlendirilmesini söylüyor; soğuk bölgede kış ısınması artabilir.", ["Evrensel çözüm olarak görülmemeli deniyor.", "Kaldırım kaplamasının sorunları anlatılıyor; parklar serinletici.", "Ağaçlar gölge ve serinlik sağlıyor.", ""], "uygulama"),
    ],
  },
  "ar-03": {
    focus: "ana fikir",
    passageAdd: "The metric system, introduced in France in the 1790s, is a well-known example. Its designers defined units in relation to one another, so converting between them required only moving a decimal point. Adoption, however, was slow. Many people continued to use familiar local units for decades, and the government eventually had to require the new system by law. The French case suggests that a standard does not spread simply because it is logical; it spreads when enough institutions have reasons to rely on it.",
    why: ["Bilimsel ilgi tek neden değil deniyor; keşiflerin zorladığı söylenmiyor.", "Ticaret imkânsız olmadı: such variation did not prevent trade.", "", "Vergiyi azaltmak değil, yönetmeyi kolaylaştırmak: simpler to administer."],
    more: [
      Q("According to the passage, what problem did local units create?", ["They prevented any trade between towns", "They forced governments to stop collecting taxes", "They made checking quantities costly and caused disputes", "They made the later metric system hard for people to understand"], 2,
        "It raised the cost of verifying quantity and created opportunities for dispute.", ["Ticaret sürdü; yalnız zorlaştı.", "Vergi durmadı; standart onu kolaylaştırdı.", "", "Metrik sistem sonraki örnek; yerel birimlerin sorunu bu değil."], "ayrıntı"),
      Q("The word \"predictable\" in the passage is closest in meaning to", ["ancient", "consistent", "expensive", "flexible"], 1,
        "Predictable units: değeri her yerde aynı, önceden bilinen birimler.", ["Eskilikle ilgisi yok.", "", "Fiyatla ilgisi yok.", "Esnek değil; standart birim sabittir."], "kelime"),
      Q("Why does the author mention that France had to require the metric system by law?", ["To show that a logical standard did not spread on its own", "To argue that the metric system was badly designed", "To prove that merchants chose local units because they were cheaper", "To explain how decimal conversion works"], 0,
        "Mantıklı bir sistem bile kendiliğinden yayılmadı; kurumların ona dayanması gerekti.", ["", "Tasarım mantıklı olarak anlatılıyor.", "Ucuzluktan değil, alışkanlıktan söz ediliyor.", "Ondalık dönüşüm başka bir cümlede; yasa örneğinin amacı bu değil."], "amaç (retorik)"),
      Q("Which best describes how the passage is organized?", ["Two scientific theories are compared and one is rejected", "A laboratory process for measuring grain is described step by step, from the first test to the last", "An opinion is stated and then shown to be false", "A problem is described, reasons for a change are given, and an example supports the point"], 3,
        "Sorun (yerel birimler) → değişimin nedenleri (ticaret, vergi) → Fransa örneği.", ["Kuram karşılaştırması yok.", "Laboratuvar süreci yok.", "Görüş çürütülmüyor, destekleniyor.", ""], "yapı"),
    ],
  },
  "ar-04": {
    options: ["To demonstrate that all proxies measure temperature directly", "To illustrate why converging independent evidence strengthens a reconstruction", "To prove that biological proxies are always more reliable than physical proxies of past climate", "To argue that instrumental records should no longer be collected"],
    focus: "amaç (retorik)",
    passageAdd: "Ice cores from Greenland and Antarctica illustrate the approach. As snow accumulates, it traps tiny bubbles of air, and layers of ice preserve a chemical signature of the temperature at which the snow formed. When researchers compared ice-core temperatures with pollen preserved in lake sediments from the same period, the two records showed similar cold and warm phases. That agreement made scientists more confident that the changes were real and not the product of one unusual site.",
    why: ["Metin tersini söylüyor: neither record is a direct thermometer.", "", "Bir türün daima üstün olduğu söylenmiyor; önemli olan bağımsız kayıtların uyumu.", "Cihaz kayıtlarının bırakılması önerilmiyor; yalnız kısa oldukları söyleniyor."],
    more: [
      Q("The word \"converge\" in the passage is closest in meaning to", ["come together", "disagree", "change quickly", "disappear"], 0,
        "Converge on a similar pattern = benzer bir örüntüde buluşmak.", ["", "Zıt anlam.", "Hızla ilgisi yok.", "Yok olma anlamı yok."], "kelime"),
      Q("According to the passage, why are proxies needed?", ["Thermometers give unreliable readings", "Tree rings measure temperature directly", "Instrumental records cover only a short part of climatic history", "Marine shells are too rare in older rocks to give reliable temperature data"], 2,
        "Instrumental weather records cover only a small fraction of Earth's climatic history.", ["Termometreler güvenilmez değil; kayıtları kısa.", "Metin bunu reddediyor: not a direct thermometer.", "", "Kabukların nadirliğinden söz edilmiyor."], "neden"),
      Q("What does the ice-core example show?", ["That a single spectacular record is enough to prove a claim about past climate", "That agreement between independent records strengthens a reconstruction", "That pollen in lake sediments is always more accurate than ice", "That ice cores record only the air pressure of the past"], 1,
        "İki bağımsız kayıt aynı soğuk ve sıcak dönemleri gösterince güven arttı.", ["Tersini söylüyor: tek bir çarpıcı kayıt yetmez.", "", "Biri diğerinden üstün denmiyor.", "Buz sıcaklığın kimyasal izini tutuyor; basınçtan söz edilmiyor."], "örnek ve destek"),
      Q("All of the following are mentioned as sources of evidence EXCEPT", ["tree-ring width", "the chemistry of marine shells", "pollen in lake sediments", "farmers' written diaries"], 3,
        "Çiftçi günlükleri metinde yok; diğerleri geçiyor.", ["Metinde var.", "Metinde var.", "Metinde var.", ""], "olumsuz ayrıntı (EXCEPT)"),
    ],
  },

  "ar-05": {
    options: ["They can avoid bright city lights", "They can rest in cooler air", "They can eat and restore their energy stores", "They can watch more easily for hawks and other predators"],
    focus: "ayrıntı",
    passageAdd: "Researchers have learned much of this from small radio tags and from weather radar, which can detect large groups of birds in the night sky. Radar studies show that most migrants take off shortly after sunset and land before dawn. On some spring nights, millions of birds pass over a single region. Birds also appear to choose their nights carefully: they tend to depart when winds are blowing in the direction they want to travel, which lets them cover more distance with the same amount of energy.",
    why: ["Şehir ışıkları gece yolculuğunun bir maliyeti; gündüzü boş tutmanın nedeni değil.", "Serin hava gece uçuşunun bir yararı; gündüz dinlenmekle karıştırma.", "", "Yırtıcılardan korunma karanlıkla ilgili; gündüz gözcülükten söz edilmiyor."],
    more: [
      Q("The word \"essential\" in the passage is closest in meaning to", ["optional", "necessary", "difficult", "dangerous"], 1,
        "Essential = zorunlu, çok gerekli.", ["Zıt anlam.", "", "Zorlukla ilgisi yok.", "Tehlikeyle ilgisi yok."], "kelime"),
      Q("According to the passage, how do scientists know when most migrants take off?", ["From counting birds in city parks", "From reports by airline pilots", "From measuring the fat reserves of birds caught at each stop", "From weather radar that detects groups of birds"], 3,
        "Radar studies show that most migrants take off shortly after sunset.", ["Park sayımından söz edilmiyor.", "Pilot raporu yok.", "Yağ depoları beslenmeyle ilgili; kalkış zamanını göstermiyor.", ""], "ayrıntı"),
      Q("What can be inferred about the nights birds choose for departure?", ["Birds leave only on nights with no wind", "Birds prefer nights when the wind helps carry them", "Birds fly against the wind to build strength", "Birds wait for the brightest moonlight"], 1,
        "They depart when winds are blowing in the direction they want to travel.", ["Rüzgârsız gece şartı yok; rüzgârın yönü önemli.", "", "Tersine: rüzgârı arkalarına alıyorlar.", "Ay ışığından söz edilmiyor."], "çıkarım"),
      Q("Why do some cities switch off building lights during migration?", ["Because bright lights can lead birds off course", "To save money on electricity in spring", "To help radar detect birds more clearly", "Because birds hunt insects near the lights"], 0,
        "Bright city lights can confuse birds and draw them off course.", ["", "Tasarruf nedeni söylenmiyor.", "Radar ile ışık arasında bir bağ kurulmuyor.", "Böcek avından söz edilmiyor."], "neden"),
    ],
  },
  "ar-06": {
    measure: true,
    focus: "ana fikir",
    options: ["Printing mainly increased the number of people who could read scientific books", "Hand-copied texts were usually more accurate than the first printed books", "Identical printed copies let scholars check and build on each other's work", "Astronomers in different cities stopped sharing data after printing began"],
    answer: 2,
    passageAdd: "Printing also changed how mistakes were handled. When an error was found in a printed table, the printer could publish a list of corrections, and every owner of the book could fix the same page. Some publishers invited readers to send in errors they had discovered, so a book could improve from one edition to the next. In this way, readers became part of the process of checking knowledge, not only its audience.",
    why: ["Okuryazarlığı kabul ediyor ama asıl etkinin daha özel olduğunu söylüyor.", "Tersine: el kopyaları küçük hatalar içeriyordu.", "", "Paylaşımın durduğu söylenmiyor; karşılaştırma kolaylaştı."],
    more: [
      Q("According to the passage, what problem did hand copying create?", ["Copies were too expensive for most scholars", "Scholars were not allowed to copy scientific texts", "Copies took too long to reach distant cities", "Each copy could contain its own small errors"], 3,
        "Each copy introduced small errors into tables, diagrams, and calculations.", ["Maliyetten söz edilmiyor.", "Yasak yok.", "Hız sorun olarak anlatılmıyor; vurgulanan hatalar.", ""], "ayrıntı"),
      Q("The phrase \"build on\" in the passage is closest in meaning to", ["use as a starting point for further work", "construct a new building on top of an old one", "criticize strongly", "copy without changes"], 0,
        "Build on one another's results = birbirinin sonuçlarının üzerine eklemek.", ["", "Gerçek inşaat değil; mecaz anlam.", "Eleştirmek değil.", "Değiştirmeden kopyalamak değil; üzerine eklemek."], "kelime"),
      Q("Why does the author mention lists of corrections?", ["To show that printed books usually contained more errors than handwritten manuscripts", "To give another example of how printing made shared checking possible", "To explain why early printers became wealthy", "To warn readers not to trust printed tables"], 1,
        "Düzeltme listeleri herkesin aynı sayfayı düzeltmesini sağladı: ortak denetimin bir örneği.", ["Daha fazla hata içerdiği söylenmiyor.", "", "Zenginlikten söz edilmiyor.", "Güvenmeme uyarısı yok; düzeltilebilirlik vurgulanıyor."], "amaç (retorik)"),
      Q("What can be inferred about two astronomers using the same printed book?", ["They had to correct every table by hand before using it", "They were still unable to compare observations", "They could refer to one page and see the same figures", "They deliberately used different editions"], 2,
        "A researcher could refer to a particular page and expect distant readers to see exactly the same figures.", ["Kopyalar aynıydı; elle düzeltme gerekmiyordu.", "Tersine: karşılaştırma mümkün oldu.", "", "Farklı baskı kullanmaktan söz edilmiyor."], "çıkarım"),
    ],
  },
  "ar-07": {
    focus: "amaç (retorik)",
    options: ["To show that sea otters are not really a keystone species in any coastal region", "To argue that warmer water mainly benefits sea urchins", "To show that a keystone effect has to be proven in each system", "To explain why otters were hunted to near extinction"],
    answer: 2,
    passageAdd: "Other proposed keystone species include wolves, which can change where deer feed, and certain fig trees, which produce fruit when little other food is available. In each case, researchers look for the same kind of evidence: what happens to the rest of the system when the species is removed or returns.",
    why: ["'Hiçbir yerde' demiyor; her sistemde kanıt istiyor.", "Sıcak su yosun azalmasının bir nedeni; denizkestanesine yararından söz edilmiyor.", "", "Avlanma geçmişteki bir olgu; bu cümlenin amacı değil."],
    more: [
      Q("According to the passage, what happened when otters were hunted to near extinction?", ["Kelp forests grew more quickly", "Sea urchins increased and stripped much of the kelp", "Fish populations moved away to warmer water farther from the coast", "Sea urchins disappeared from the coast"], 1,
        "Urchin populations expanded and stripped the seafloor of kelp.", ["Tersine: yosun yok oldu.", "", "Balıklar göç etmedi; sığınaklarını kaybetti.", "Denizkestaneleri arttı."], "neden-sonuç"),
      Q("The word \"instructive\" in the passage is closest in meaning to", ["unusual", "informative", "harmful", "complicated"], 1,
        "Instructive = öğretici, bilgi veren.", ["Sıradışılıkla ilgisi yok.", "", "Zararlı anlamı yok.", "Karmaşık anlamı yok."], "kelime"),
      Q("What is the role of sea urchins in the otter example?", ["They hunt young otters", "They provide shelter for many fish and invertebrates", "They raise the water temperature", "They are eaten by otters and feed on kelp"], 3,
        "Otters feed on sea urchins, which in turn graze on kelp.", ["Tersine: su samurları denizkestanesini yer.", "Sığınak sağlayan yosun.", "Su sıcaklığı ayrı bir etken.", ""], "ilişki"),
      Q("Which would the author most likely accept as evidence that a species is a keystone species?", ["Removing the species leads to large changes elsewhere in the system", "The species is the most numerous animal in the area where it lives", "The species looks similar to sea otters", "The species lives along a northern coast"], 0,
        "Araştırmacılar türün yokluğunda ve dönüşünde sistemin geri kalanına ne olduğuna bakıyor.", ["", "Sayıca çok olmak ölçüt değil: far greater than its numbers.", "Benzetme yetmez: rather than analogy alone.", "Yer ölçüt değil."], "uygulama"),
    ],
  },
  "ar-08": {
    focus: "çıkarım",
    options: ["Mathematics exams should never contain written text", "Validity stays the same no matter how a test is used", "Whether a test feature is an obstacle depends on the test's purpose", "Strong readers always reason better in mathematics"],
    answer: 2,
    passageAdd: "Validity evidence can come from several sources: experts may judge whether the questions match the skill, researchers may check whether scores predict later performance, and designers may compare how different groups of students respond. No single source is enough; together they support or weaken the claim that the scores mean what they are said to mean.",
    why: ["Metin bunu reddediyor: bütün metni çıkarmak sınavı daraltabilir.", "Tersine: aynı sınav bir kullanım için uygun, diğeri için yanıltıcı olabilir.", "", "Okuma ile matematik arasında böyle kesin bir bağ kurulmuyor."],
    more: [
      Q("The word \"irrelevant\" in the passage is closest in meaning to", ["too difficult for most students to answer in time", "added at the last moment", "not connected to what is being measured", "required by law"], 2,
        "Irrelevant obstacles: ölçülen beceriyle ilgisi olmayan engeller.", ["Zorlukla değil, ilgisizlikle ilgili.", "Zamanla ilgisi yok.", "", "Yasayla ilgisi yok."], "kelime"),
      Q("Why does the author describe a mathematics exam written in long paragraphs?", ["To show how a score can partly measure a different ability", "To argue that mathematics exams are too easy", "To recommend removing mathematics from tests", "To describe how the design of mathematics tests has changed over history"], 0,
        "Uzun paragraflar puanın bir kısmının okumayı ölçmesine yol açar.", ["", "Kolaylıktan söz edilmiyor.", "Matematiği kaldırma önerisi yok.", "Tarih anlatılmıyor."], "amaç (retorik)"),
      Q("According to the passage, why might removing all text from a math exam be a problem?", ["Students would finish the exam too quickly to show their reasoning", "Real mathematical tasks often involve interpreting text", "Text always makes questions easier", "Teachers prefer exams with paragraphs"], 1,
        "If real-world mathematical tasks normally involve interpreting text, removing all text would narrow what the exam represents.", ["Süreden söz edilmiyor.", "", "Metnin her zaman kolaylaştırdığı söylenmiyor.", "Öğretmen tercihi yok."], "ayrıntı"),
      Q("All of the following are mentioned as sources of validity evidence EXCEPT", ["expert judgment of the questions", "whether scores predict later performance", "how different groups respond", "the number of pages in the test"], 3,
        "Sayfa sayısı metinde yok; diğer üçü geçiyor.", ["Metinde var.", "Metinde var.", "Metinde var.", ""], "olumsuz ayrıntı (EXCEPT)"),
    ],
  },

  // ── Listen to a Conversation (two questions) ────────────────────────────
  "conv-01": {
    options: ["Walk toward the fountain and turn left", "Wait in the café for ten minutes", "Enter the library to attend class", "Ask the staff member about a bus to another campus"],
    focus: "sonraki eylem",
    why: ["", "Kafe yalnız yol tarifinde geçiyor; beklemek için değil.", "Fen binası kütüphanenin yanında; ders kütüphanede değil.", "Başka kampüsten veya otobüsten söz edilmiyor."],
    more: [Q("How long will it take the student to reach the building?", ["About ten minutes", "About four minutes", "About fourteen minutes", "Less than a minute"], 1,
      "It takes about four minutes from here.", ["On dakika, dersin başlamasına kalan süre.", "", "İki sayıyı toplamak gerekmiyor.", "Böyle bir süre söylenmiyor."], "ayrıntı (sayı)")],
  },
  "conv-02": {
    focus: "amaç",
    why: ["", "Cuma şubesi iptal değil; bir boş yer var.", "Deneyde yardım istenmiyor; başka şubeye geçmek isteniyor.", "Randevu öğrencinin kendisinin."],
    more: [Q("What will the student do next?", ["Call the clinic to move the medical appointment to another day", "Email the instructor and copy the lab assistant", "Go to Friday's lab without approval", "Ask another student to switch sections"], 1,
      "Student: Should I email her? Assistant: Yes, copy me on the message. Student: I'll send it now.", ["Randevu değişmiyor.", "", "Onay şart: you need your instructor's approval.", "Öğrenciyle yer değiştirmekten söz edilmiyor."], "sonraki eylem")],
  },
  "conv-03": {
    focus: "öneri",
    why: ["Kişisel abonelik önerilmiyor.", "Tarama, portal işe yaramazsa ikinci seçenek.", "", "Yayıncıya gitmek söylenmiyor."],
    more: [Q("What is the disadvantage of the interlibrary scan?", ["It costs a small fee", "It works only on campus", "It needs a professor's approval", "It takes a few days"], 3,
      "We can request a scan through interlibrary services, though that takes a few days.", ["Ücret söylenmiyor.", "Kampüs şartı portal girişiyle karıştırma.", "Hoca onayı yok.", ""], "ayrıntı")],
  },
  "conv-04": {
    focus: "ana endişe",
    why: ["Şehirlerde ulaşım olmadığı söylenmiyor.", "", "On şehir şartı yok; tersine kapsam daraltılmalı.", "Gece erişimi, hocanın önerdiği daha dar soru."],
    more: [Q("Why does the professor mention shift workers?", ["To suggest interviewing transportation companies", "To show that late-night service is unpopular", "To give an example of a group the paper could focus on", "To recommend a new topic about jobs"], 2,
      "Decide whose access you mean—for example, shift workers: soru belirli bir gruba daralır.", ["Şirketlerle görüşmekten söz edilmiyor.", "Popülerlik konusu yok.", "", "Konu değişmiyor; yalnız daralıyor."], "konuşmacının amacı")],
  },
  "conv-05": {
    focus: "sonraki eylem",
    why: ["Öğrencide bozuk para yok; yalnız telefonu var.", "Kütüphaneci yazdırmayı teklif etmiyor.", "", "Arkadaştan kart almaktan söz edilmiyor."],
    more: [Q("Why can't the student print the essay at first?", ["The printer is broken", "The student's print account is empty", "The essay file is too large", "The library website is down for maintenance"], 1,
      "The printer says my account is empty.", ["Yazıcı bozuk değil; hesap boş.", "", "Dosya boyutu söylenmiyor.", "Web sitesi çalışıyor; çözüm orada."], "sorun")],
  },
  "conv-06": {
    options: ["It is easier than the programming course", "It is directly relevant to the student's career plans", "The programming course is already full for next term", "The student has already studied programming"],
    focus: "neden",
    why: ["Kolaylıktan söz edilmiyor.", "", "Programlama dersinin dolu olduğu söylenmiyor; sonraki dönem alınabilir.", "Öğrencinin programlama bildiği söylenmiyor."],
    more: [Q("What does the professor say about programming?", ["It can wait until the following term", "It is not useful in public health", "It must be taken before statistics", "It is offered only in summer"], 0,
      "It is helpful, and you can take it the following term.", ["", "Faydalı olduğunu söylüyor: It is helpful.", "Önce alma şartı yok.", "Yaz dönemi söylenmiyor."], "konuşmacının görüşü")],
  },
  "conv-07": {
    measure: true,
    focus: "öneri",
    why: ["Kadın bunu istemiyor: I'd rather not.", "Hocaya söylemek, Marcus son tarihi kaçırırsa.", "Sunumu ertelemekten söz edilmiyor.", ""],
    more: [Q("Why does the woman not want to write Marcus's section?", ["She does not understand his topic", "She has no time to write it before the presentation on Monday", "She thinks the same problem would happen again", "The instructor told them not to"], 2,
      "If we do his work, the same thing will happen next time.", ["Konuyu anlamamaktan söz edilmiyor.", "Zaman nedeni söylenmiyor.", "", "Hocanın böyle bir talimatı yok."], "neden")],
  },
  "conv-08": {
    options: ["The survey included too few students to show any relationship at all", "Another factor may account for the relationship the student found", "The writing center keeps inaccurate records", "First-semester grades were not recorded"],
    focus: "ana endişe",
    why: ["Örneklem büyüklüğü sorun edilmiyor.", "", "Kayıtların yanlışlığından söz edilmiyor.", "İlk dönem notları kaydedilmiş: I recorded first-semester grades."],
    more: [Q("What does the professor imply about comparing students who started at a similar level?", ["It would prove that visiting the writing center raises students' grades", "It cannot be done with the student's data", "It would make the survey unnecessary", "It would strengthen the argument without proving cause"], 3,
      "That wouldn't prove causation, but it would make your argument considerably more careful.", ["Hoca açıkça söylüyor: wouldn't prove causation.", "Veri var: ilk dönem notları.", "Anketi gereksiz kılmıyor.", ""], "çıkarım")],
  },
  // ── Listen to an Announcement (two questions) ───────────────────────────
  "ann-01": {
    options: ["The entire recreation center will close at six", "The pool will close two hours earlier than usual", "The indoor track will be closed this evening for maintenance work", "The pool will open at eight tomorrow morning"],
    focus: "değişiklik",
    why: ["Yalnız havuz kapanıyor; spor salonu ve pist açık.", "", "Pist normal saatinde açık.", "Yarın sabah açılıştan söz edilmiyor."],
    more: [Q("Why will the pool close early?", ["Because of a swimming competition", "Because few people use it in the evening", "Because of maintenance work", "Because the gym needs the staff"], 2,
      "Because of maintenance.", ["Yarışma yok.", "Katılım söylenmiyor.", "", "Personel nedeni yok."], "neden")],
  },
  "ann-02": {
    focus: "ayrıntı (yer)",
    why: ["Mason Hall eski yer; yeni yer Student Union'daki salon.", "Laboratuvardan söz edilmiyor; konu kıyı restorasyonu.", "", "Saat dört buçuk; misafir ofisi yok."],
    more: [Q("What will people find at Mason Hall?", ["The lecture at a later time", "Signs about the new location", "A second lecture on the same topic", "Staff handing out campus maps"], 1,
      "Signs will be posted at Mason Hall.", ["Saat değişmiyor; ders orada değil.", "", "İkinci ders yok.", "Harita dağıtılmıyor."], "ayrıntı")],
  },
  "ann-03": {
    focus: "öneri",
    why: ["Acil telefonlar etkilenmiyor; acil servisi aramak gerekmiyor.", "Router değiştirmek değil, gerekirse yeniden başlatmak.", "", "Saat üçte değil; önce router yeniden başlatılır."],
    more: [Q("What should residents do if the connection does not return after three?", ["Call the emergency phone", "Restart their router before calling support", "Wait until Thursday", "Move for one night to another residence hall with working internet"], 1,
      "Restart your router before contacting technical support.", ["Acil telefon bu iş için değil.", "", "Perşembe söylenmiyor.", "Taşınmaktan söz edilmiyor."], "koşullu eylem")],
  },
  "ann-04": {
    focus: "neden",
    why: ["Girişte içecek yasağı söylenmiyor.", "", "Bütün gün aç kalmak istenmiyor: Eat your normal evening meal.", "Her ilaçla etkileşim söylenmiyor; yeni ilaç alanlar arayacak."],
    more: [Q("What should someone who has started a new medication do?", ["Stop taking it the day before", "Bring it into the laboratory", "Check in at a different entrance of the clinic", "Call the study coordinator before arriving"], 3,
      "Anyone taking a new medication should call the study coordinator before arriving.", ["İlacı bırakmak söylenmiyor.", "Laboratuvara bir şey getirmek istenmiyor; dışarıdan yiyecek de yasak.", "Herkes batı girişinden giriyor.", ""], "koşullu eylem")],
  },
  "ann-05": {
    focus: "ayrıntı (yer)",
    why: ["Ana kafeterya bütün gün kapalı.", "", "Öğrenci merkezinden söz edilmiyor.", "Kütüphane kafesi açık."],
    more: [Q("When will the main cafeteria open again?", ["Friday afternoon", "Saturday morning", "Monday morning", "Friday at three"], 1,
      "Regular cafeteria hours start again on Saturday morning.", ["Cuma bütün gün kapalı.", "", "Pazartesi söylenmiyor.", "Saat üç, kütüphane kafesinin kapanışı."], "ayrıntı (zaman)")],
  },
  "ann-06": {
    focus: "değişiklik",
    why: ["Saat değişmiyor: still begin at ten.", "Tarih değişmiyor: yarın.", "", "Süreden söz edilmiyor."],
    more: [Q("Why should students arrive fifteen minutes early?", ["To show their student ID at the door", "To pick up a printed map", "To collect a new exam schedule", "To review notes with the instructor"], 0,
      "You will need to show your student ID at the door.", ["", "Harita söylenmiyor.", "Program dağıtılmıyor.", "Hocayla tekrar yok."], "neden")],
  },
  "ann-07": {
    measure: true,
    focus: "koşullu eylem",
    // v0.9 (F25): exact times, so "midnight" cannot be read two ways.
    audio: "This is a reminder from the university library. Our online catalog and loan system will be unavailable from 11:59 p.m. on Saturday until 6:00 a.m. on Sunday while we install a new version. During this time you will not be able to renew books online, so if any of your loans are due this weekend, please renew them before 11:59 p.m. on Saturday. No late fees will be charged for items due on Sunday itself.",
    why: ["", "Ücretsiz olan yalnız pazar günü süresi dolanlar.", "Pazartesiye beklemek gecikme olur.", "Bakım sırasında arama önerilmiyor; yenileme çevrim içi yapılamıyor."],
    more: [Q("Which items will not receive a late fee?", ["Items due on Saturday", "Items due on Sunday", "Items returned on Monday", "Items renewed by phone"], 1,
      "No late fees will be charged for items due on Sunday itself.", ["Cumartesi olanlar önceden yenilenmeli.", "", "Pazartesi iadesi için muafiyet yok.", "Telefonla yenilemeden söz edilmiyor."], "ayrıntı")],
  },
  "ann-08": {
    focus: "neden",
    why: ["Haftalık dosya sınırı yok.", "Basılı kopya artık kabul edilmiyor.", "Biçim kontrolünden söz edilmiyor.", ""],
    more: [Q("What has changed about thesis submission?", ["The deadline has moved to May fifteenth", "Printed copies are no longer accepted", "Supervisors no longer approve theses", "Theses must be sent by email"], 1,
      "The graduate office will no longer accept printed copies.", ["Tarih değil, yöntem değişiyor.", "", "Tersine: onay şart.", "E-posta değil, portal."], "değişiklik")],
  },

  // ── Listen to an Academic Talk (four questions) ─────────────────────────
  "talk-01": {
    focus: "ana fikir",
    options: ["Lotus leaves absorb rainwater through microscopic holes in their wax", "The leaf's tiny surface structure makes water roll off, an effect engineers copy", "Engineers copy the lotus leaf mainly for its color and shape", "Dust on the leaf makes water spread into a thin sheet"],
    answer: 1,
    why: ["Su emilmiyor; damlalar yuvarlanıp gidiyor.", "", "Tersine: The goal is not to copy the leaf's appearance.", "Toz damlalarla birlikte gidiyor; suyu yaymıyor."],
    more: [
      Q("According to the talk, why do water drops move easily on the leaf?", ["The leaf is perfectly smooth", "The leaf absorbs part of each drop", "Tiny bumps and wax reduce the area the water touches", "Wind constantly blows across the surface of the leaf and dries it"], 2,
        "These structures reduce the area where water touches the leaf, so droplets move easily.", ["Tersine: The leaf is not perfectly smooth.", "Emme söylenmiyor.", "", "Rüzgârdan söz edilmiyor."], "neden"),
      Q("What happens to dust on the leaf?", ["It makes the leaf heavier over time", "It blocks the microscopic bumps", "It mixes with the wax", "Rolling drops pick it up"], 3,
        "Droplets move easily and collect dust as they roll.", ["Ağırlıktan söz edilmiyor.", "Tıkama söylenmiyor.", "Mumla karışmak söylenmiyor.", ""], "ayrıntı"),
      Q("What does the speaker say about the engineers' goal?", ["They want glass that looks like a leaf", "They want to copy how surface structure affects water", "They want to grow lotus plants on the roofs of buildings", "They want fabric that absorbs more water"], 1,
        "To reproduce the relationship between its tiny surface structure and the behavior of water.", ["Görünüş değil: not to copy the leaf's appearance.", "", "Binalarda lotus yetiştirmek yok.", "Tersine: amaç suyu itmek."], "konuşmacının vurgusu"),
    ],
  },
  "talk-02": {
    focus: "amaç (retorik)",
    options: ["To show that farmers set the price of beans themselves", "To illustrate how a price change can guide what producers decide to grow", "To show that beans are usually more profitable than corn", "To argue that farmers should talk directly with consumers"],
    answer: 1,
    why: ["Fiyatı çiftçi koymuyor; talep değişince fiyat yükseliyor.", "", "Fasulyenin hep daha kârlı olduğu söylenmiyor; örnek bir fiyat artışı.", "Tersine: tüketiciyle hiç konuşmadan karar verebiliyor."],
    more: [
      Q("What happens when the price of beans rises because demand has increased?", ["Farmers must stop growing corn completely", "Consumers stop buying beans", "Farmers get a reason to grow more beans", "The government sets a new bean price"], 2,
        "That price gives the farmer a reason to grow more beans.", ["Tamamen bırakmak söylenmiyor.", "Tüketici davranışı anlatılmıyor.", "", "Devletten söz edilmiyor."], "neden-sonuç"),
      Q("Why does the speaker say the price signal is imperfect?", ["A short-term shortage can raise a price without a lasting change in demand", "Farmers never pay attention to prices", "Prices are always set too high", "Consumers often hide what they really want, so prices cannot reflect their wishes"], 0,
        "A temporary shortage may raise a price without indicating a lasting change in demand.", ["", "Tersine: fiyat çiftçiye bir neden veriyor.", "Fiyatların hep yüksek olduğu söylenmiyor.", "Gizlemekten söz edilmiyor."], "ayrıntı"),
      Q("What can be inferred about the farmer and the consumers?", ["They negotiate the price together", "They do not need to communicate directly", "They live in the same town", "They sign a contract every year"], 1,
        "A price can coordinate decisions among people who do not communicate directly.", ["Pazarlık yok; fiyat sinyal olarak işliyor.", "", "Uzak tüketiciler: distant consumers.", "Sözleşme yok."], "çıkarım"),
    ],
  },
  "talk-03": {
    options: ["Each source has limitations that other evidence may help correct", "Chemical evidence identifies every single meal but is difficult to translate", "Plant remains never survive at archaeological sites", "Modern menus accurately describe ancient food practices"],
    focus: "neden",
    why: ["", "Kimyasal iz belirli bir yemeği nadiren gösterir.", "Kömürleşmiş tohumlar bitkileri tanımlıyor; hiç kalmadığı söylenmiyor.", "Modern menü yalnız karşılaştırma için geçiyor."],
    more: [
      Q("What limitation of animal bones does the speaker mention?", ["Bones cannot show which species were eaten", "Some kinds of bones survive better than others", "Bones are too costly to analyze", "Bones disappear whenever food is cooked"], 1,
        "Preservation favors some bones over others.", ["Tersine: hangi türlerin yendiğini gösterebilir.", "", "Maliyetten söz edilmiyor.", "Pişirme tohumlarla ilgili bir sınırlılık."], "ayrıntı"),
      Q("What do chemical patterns in teeth and bones show?", ["The exact last meal of a person", "The tools a community used", "How food was stored", "A person's diet over a long period"], 3,
        "Chemical patterns provide a broader signal of long-term diet.", ["Belirli yemeği nadiren gösterir.", "Aletler ayrı bir kanıt türü.", "Depolama kapları ayrı bir kanıt.", ""], "ayrıntı"),
      Q("How does the speaker compare the combined record with a modern menu?", ["It is more detailed than a modern menu because chemical tests are precise", "It is exactly like a modern menu", "It is less detailed, but more reliable than any single source", "It is less reliable than one source"], 2,
        "Usually less detailed than a modern menu, but more reliable than any single source.", ["Tersine: daha az ayrıntılı.", "Aynı değil.", "", "Tersine: tek kaynaktan daha güvenilir."], "karşılaştırma"),
    ],
  },
  "talk-04": {
    options: ["Predators select peacocks according to tail color", "All expensive biological traits evolved mainly for communication between animals", "A condition-dependent cost can make a quality signal reliable", "Reliable signals must provide a direct survival advantage"],
    focus: "örnek ve destek",
    why: ["Yırtıcıların renge göre seçtiği söylenmiyor.", "Konuşmacı bunu reddediyor: not every costly trait is a signal.", "", "Doğrudan hayatta kalma avantajı şartı yok; kuyruk kaçmayı zorlaştırıyor."],
    more: [
      Q("Why can a weak peacock not easily display an elaborate tail?", ["Other males in the group stop it from growing such a tail", "It lacks the right color", "It cannot bear the cost of growing and carrying it", "It lives where there are no predators"], 2,
        "A weak individual could not bear those costs as successfully as a strong one.", ["Diğer erkeklerden söz edilmiyor.", "Renk konu değil.", "", "Tersine: yırtıcılar maliyeti artırıyor."], "neden"),
      Q("The word \"burdensome\" in the talk is closest in meaning to", ["beautiful", "costly to carry", "rare", "helpful for escape"], 1,
        "Burdensome = yük olan, külfetli.", ["Güzellikle ilgili değil.", "", "Nadirlikle ilgili değil.", "Tersine: kaçmayı zorlaştırıyor."], "kelime"),
      Q("According to the talk, when does cost help keep a signal honest?", ["When every individual is equally strong", "When predators cannot see the signal from a distance at all", "When the signal costs nothing to produce", "When individuals have reasons to exaggerate their quality"], 3,
        "When individuals have incentives to exaggerate their quality, a cost that differs according to condition can help keep a signal honest.", ["Herkes eşitse sinyal bilgi taşımaz.", "Görünmezlik söylenmiyor.", "Maliyetsiz sinyal kolayca taklit edilir.", ""], "koşul"),
    ],
  },
  "talk-05": {
    focus: "ayrıntı",
    why: ["Nektar miktarı dansın uzunluğuyla bağlanmıyor.", "", "Kaç arının gideceği söylenmiyor.", "Güneş, düz koşunun yönüyle ilgili."],
    more: [
      Q("What does the direction of the straight run show?", ["How sweet the nectar is", "Where to fly in relation to the sun", "How many flowers there are at the food source", "When the bees should return"], 1,
        "The direction of the straight line shows the other bees where to fly in relation to the sun.", ["Tatlılıktan söz edilmiyor.", "", "Çiçek sayısı söylenmiyor.", "Dönüş zamanı söylenmiyor."], "ayrıntı"),
      Q("What do other bees do after following the dancer?", ["They fly to the same food source", "They perform the same dance right away", "They guard the hive entrance", "They answer with a buzzing sound"], 0,
        "They leave the hive and fly to the same place.", ["", "Aynı dansı yaptıkları söylenmiyor.", "Bekçilik yok.", "Ses yok: without any sound or words."], "sonraki eylem"),
      Q("What is the speaker's main point?", ["Bees use sound to locate flowers", "Only one bee in each hive can find food", "Bees share the location of food through movement", "Bees always fly directly toward the sun to find food"], 2,
        "Without any sound or words, one bee can send hundreds of others to a good source of food.", ["Ses yok.", "Tek arı şartı yok; bulan arı başkalarına gösteriyor.", "", "Yön güneşe göre veriliyor; hep güneşe uçmuyorlar."], "ana fikir"),
    ],
  },
  "talk-06": {
    focus: "amaç (retorik)",
    measure: true,
    why: ["İlacın tehlikeli olduğu söylenmiyor.", "Hastaya söylenmemesi yöntemin parçası; genel bir öneri değil.", "", "Baş ağrısının tedavisiz geçtiği iddia edilmiyor."],
    more: [
      Q("Why do some patients feel better after a pill with no active ingredient?", ["The pill contains a small amount of medicine", "Doctors tell them which pill they got", "They take the pill more often", "They expect the treatment to work"], 3,
        "Others feel better simply because they expect the treatment to work.", ["Etkin madde yok.", "Tersine: kimse hangi hapı aldığını bilmiyor.", "Doz sıklığı söylenmiyor.", ""], "neden"),
      Q("Why does neither group know which pill it received?", ["Because the pills have different colors", "So that expectations affect both groups in the same way", "To lower the cost of the study", "Because the company wants to keep the drug's name secret"], 1,
        "Beklenti etkisi iki grupta eşit olursa aradaki fark ilacın etkisini gösterir.", ["Haplar aynı görünüyor.", "", "Maliyetten söz edilmiyor.", "Gizli isimden söz edilmiyor."], "çıkarım"),
      Q("If 70 percent improve with the drug and 60 percent with the placebo, what does this suggest?", ["The drug works for 70 percent of patients", "The placebo is stronger than the drug", "The drug's real benefit is much smaller than 70 percent", "The study gave no useful information about the drug's effect at all"], 2,
        "Gerçek fark yaklaşık 10 puan: the real benefit of the drug is much smaller than it first appeared.", ["%70'in hepsi ilacın etkisi değil.", "Plasebo %60; ilaçtan düşük.", "", "Tersine: plasebo grubu gerçek etkiyi gösterdi."], "hesap"),
    ],
  },
  "talk-07": {
    options: ["It can be avoided when users create and enforce their own rules", "It occurs only when a resource is privately owned", "It proves that government control always fails", "It affects small fishing communities but not other kinds of shared resources"],
    focus: "çıkarım",
    why: ["", "Özel mülkiyet bir çözüm olarak düşünülmüştü; trajedinin koşulu değil.", "Devletin hep başarısız olduğu söylenmiyor.", "Örnek balıkçılık, ama ilke bütün ortak kaynaklar için."],
    more: [
      Q("Why does each family have a reason to catch more fish?", ["The government pays for extra fish", "The lake's fish supply is unlimited", "It gets the whole benefit while the cost is shared by all", "Other families had already agreed to catch fewer fish each season"], 2,
        "Each family gains the full benefit of every extra fish, while the cost is shared by all twenty.", ["Devlet ödemesi yok.", "Tersine: göl boşalabilir.", "", "Böyle bir anlaşma yok."], "neden"),
      Q("What did later field research show?", ["All shared resources are eventually destroyed", "Some communities manage shared resources well with their own rules", "Only private owners or the government can successfully protect a lake", "Penalties never work in small groups"], 1,
        "Many communities manage shared resources successfully through their own rules.", ["Tersine: başarılı örnekler var.", "", "Bu eski varsayımdı.", "Adil cezalar çözümün parçası."], "ayrıntı"),
      Q("All of the following are mentioned as features of successful community rules EXCEPT", ["agreed limits", "mutual monitoring", "penalties members see as fair", "selling fishing rights to outsiders"], 3,
        "Dışarıya avlanma hakkı satmak söylenmiyor.", ["Söyleniyor.", "Söyleniyor.", "Söyleniyor.", ""], "olumsuz ayrıntı (EXCEPT)"),
    ],
  },
  "talk-08": {
    focus: "neden",
    why: ["Fosil kanıtı vardı: identical fossils.", "Kıyılar uyuşuyordu: matching coastlines.", "", "Deniz tabanı verisi kuramı sonradan destekledi."],
    more: [
      Q("Why does the professor call the geologists' objection reasonable?", ["Wegener had no evidence that continents moved", "Geologists already had seafloor data in 1912", "Wegener wrote in a language they could not read", "The forces Wegener suggested were far too weak"], 3,
        "He could not explain what force could push continents, and the forces he suggested were far too weak.", ["Kanıtı vardı; eksik olan mekanizma.", "Deniz tabanı verisi 1950'lerde geldi.", "Dilden söz edilmiyor.", ""], "konuşmacının görüşü"),
      Q("What did seafloor data show in the 1950s and 1960s?", ["Continents are made mostly of fossils", "Ocean crust is created and spreads apart", "Coastlines change shape every year", "The ocean floor never moves"], 1,
        "The ocean crust itself is created and spreads apart.", ["Böyle bir şey söylenmiyor.", "", "Her yıl değişen kıyı yok.", "Tersine: yayılıyor."], "ayrıntı"),
      Q("What lesson does the professor draw from this episode?", ["Geologists are usually stubborn", "Fossils are the strongest kind of evidence because they appear on several continents", "Scientists may accept that something happens once they see how it could happen", "New theories are accepted immediately"], 2,
        "Scientists may accept that something happens only when they understand how it could happen.", ["Hoca bu yorumu reddediyor: tempting … but reasonable.", "Fosiller kanıtlardan biri; en güçlüsü denmiyor.", "", "Tersine: kabul onlarca yıl sonra geldi."], "ana fikir"),
    ],
  },

  // ── Listen and Choose a Response (single item; every option explained) ──
  "cr-01": { focus: "uygun tepki", why: ["", "Dünkü otobüs bugünkü gecikmeye cevap değil.", "Durak bilgisi gecikmeyle ilgili bir tepki değil.", "Genel bir bilgi; söyleneni karşılamıyor."] },
  "cr-02": { focus: "ricaya cevap", why: ["Kendi eksiğini söylüyor ama ricaya evet/hayır demiyor.", "", "Dersle ilgili ama ricayı karşılamıyor.", "Başka günün notları; istenen dün."] },
  "cr-03": { focus: "övgüye cevap", why: ["", "Başlık konusu söylenenle bağlantısız.", "Sonuç bölümü ayrı bir konu; övgüye tepki değil.", "Teslim tarihi bilgisi; övgüye cevap değil."] },
  "cr-04": {
    options: ["The seminar starts at two o'clock tomorrow.", "I usually prefer rooms with larger windows.", "Let's check whether the smaller room is still available.", "The reservation form is on the department website, under room booking."], focus: "pişmanlığa çözüm", why: ["Saat bilgisi sorunu çözmüyor.", "Kişisel tercih; duruma cevap değil.", "", "Form yeri yardımcı gibi ama asıl çözüm küçük odanın boş olup olmadığı."] },
  "cr-05": { focus: "izin isteme kalıbı", why: ["Do you mind …? sorusuna 'Yes' = sakıncası var demektir; ayrıca cevap anlamsız.", "", "Pencerenin yerini söylemek izin vermek değil.", "'Mind' kelimesini tekrar ediyor ama yağmurla ilgisi yok."] },
  "cr-06": {
    options: ["She usually wonders about that, too.", "Yes, I posted them on the course page yesterday afternoon.", "Not yet, but she said they'd be up by Friday.", "The post office closes at five."], focus: "dolaylı soru", why: ["'Wonder' kelimesini tekrar ediyor; tuzak.", "Notları konuşan öğrenci yayınlamadı; hoca yayınlıyor.", "", "'Post' kelimesinin başka anlamıyla tuzak."] },
  "cr-07": { focus: "sitem / özür", why: ["", "'Could' ve 'move' tekrarı; sitemi karşılamıyor.", "Oda bilgisi alakasız.", "Tell kelimesini tekrar ediyor; anlam yanlış."] },
  "cr-08": {
    options: ["Thank you, I'm glad you agree with it.", "The data were collected in March and April from two different labs.", "I drew the chart with new software.", "Which part do you think goes beyond the evidence?"], focus: "itiraza cevap", why: ["Konuşan aynı fikirde değil; teşekkür yanlış anlama.", "Veri tarihi itirazı karşılamıyor.", "Grafik yazılımı konu dışı.", ""] },
};
