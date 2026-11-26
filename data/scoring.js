// Scoring guides per task, in our own words (v0.8). These summarise what the
// official TOEFL iBT scoring looks at and turn it into "do this / avoid this"
// coaching. They are NOT the ETS rubric text; the official rubrics are linked
// on the Sources page (writing-rubrics.pdf, speaking-rubrics.pdf).

export const SCORE_NOTE = "Bant açıklamaları ETS ölçütlerinin bizim kısa özetimizdir; resmî rubrik metni değildir. Resmî metinler Kaynaklar sayfasındaki PDF'lerde.";

export const SECTION_GUIDE = Object.freeze({
  reading: { scale: "Bölüm puanı 1–6 (yarım adımlı). İki aşamalı adaptif: ilk aşamadaki başarın ikinci aşamanın zorluğunu belirler.", focus: "Her görev doğru/yanlış puanlanır. Hız da önemlidir: Complete the Words'e fazla zaman harcarsan uzun metinlere süre kalmaz." },
  listening: { scale: "Bölüm puanı 1–6. İki aşamalı adaptif. Ses yalnız bir kez çalar.", focus: "Her soru doğru/yanlış. Kelimeyi değil işlevi dinle: rica mı, öneri mi, şikâyet mi, değişiklik mi?" },
  writing: { scale: "Bölüm puanı 1–6. Build a Sentence doğru/yanlış; Email ve Academic Discussion 0–5 rubrikle puanlanır.", focus: "Rubrik dört şeye bakar: görevi karşılamak, gelişim (gerekçe, örnek, ayrıntı), dilin çeşitliliği ve doğruluğu, e-postada sosyal kurallar (nezaket, ton)." },
  speaking: { scale: "Bölüm puanı 1–6. Listen and Repeat ve Interview cevapları 0–5 ölçekle değerlendirilir.", focus: "Anlaşılırlık ve akıcılık, dil kullanımı, konuyu geliştirme. Listen and Repeat'te cümlenin eksiksiz tekrarı belirleyicidir." },
});

/** Band summaries (0–5) for the rubric-scored tasks. */
export const BANDS = Object.freeze({
  email: [
    [5, "Tam başarılı: görevdeki her madde açık ve eksiksiz; selamlama, kibar rica, teşekkür ve kapanış yerinde; cümle yapıları çeşitli, kelime seçimi isabetli; hata yok denecek kadar az."],
    [4, "Genel olarak başarılı: maddelerin hepsi var ama biri az gelişmiş; ton çoğunlukla uygun; birkaç küçük hata anlamı bozmuyor."],
    [3, "Kısmen başarılı: bir madde eksik veya belirsiz; ton yer yer uygunsuz (I want …); fark edilen dil hataları, sınırlı çeşitlilik."],
    [2, "Çoğunlukla başarısız: amaç belirsiz, maddelerin çoğu eksik; sık hatalar okumayı zorlaştırıyor."],
    [1, "Başarısız: çok kısa veya görevle bağı zayıf; ciddi hatalar anlamı engelliyor."],
    [0, "Boş, konu dışı, görev metninden kopya ya da İngilizce değil."],
  ],
  discussion: [
    [5, "Tartışmaya ilgili ve çok açık bir katkı; gerekçe, örnek ve ayrıntıyla iyi geliştirilmiş; yapı çeşitliliği ve doğal kelime seçimi; neredeyse hatasız."],
    [4, "İlgili ve kolay anlaşılan katkı; yeterli gelişim; yapı ve kelime çeşitliliği var; az sayıda hata."],
    [3, "Çoğunlukla ilgili ve anlaşılır; gelişim kısmen eksik veya belirsiz; biraz çeşitlilik; fark edilen hatalar."],
    [2, "Sınırlı veya kısmen ilgisiz katkı; zayıf gelişim; sık hatalar."],
    [1, "Konuyla zayıf bağ, çok kısa; ciddi hatalar anlamı engelliyor."],
    [0, "Boş, konu dışı veya kopya."],
  ],
  interview: [
    [5, "Soruya doğrudan ve tam cevap; doğal hızda, akıcı ve kolay anlaşılır; doğru ve çeşitli dil; gerekçe ve örnekle bağlantılı gelişim."],
    [4, "İyi cevap; küçük duraksama veya telaffuz sorunları anlamı bozmuyor; gelişim yeterli ama yer yer sınırlı."],
    [3, "Konuya uygun ama gelişim sınırlı; duraksamalar ve hatalar dinleyiciyi zorluyor."],
    [2, "Kısa veya eksik; sık duraksama; anlaşılırlık sorunları."],
    [1, "Çok sınırlı; büyük kısmı anlaşılmıyor."],
    [0, "Cevap yok veya konu dışı."],
  ],
  "listen-repeat": [
    [5, "Cümle tam ve doğru; anlaşılır, doğal ritimle."],
    [4, "Anlam tam; bir-iki küçük kelime veya ek (a, the, -s, -ed) düşmüş."],
    [3, "Ana anlam var ama birkaç kelime eksik ya da değişmiş."],
    [2, "Cümlenin önemli bir kısmı eksik; anlam bozuk."],
    [1, "Yalnız birkaç kelime."],
    [0, "Cevap yok veya ilgisiz."],
  ],
});

/** Per task: what is measured, how it is scored, what to do, what to avoid, time. */
export const TASK_GUIDE = Object.freeze({
  "complete-words": {
    measures: "Kelime bilgisi, ek bilgisi (-s, -ed, -ly, -tion) ve paragrafı bağlamla okuma.",
    scoring: "Her boşluk ayrı bir madde: tam doğru yazım = 1 puan. Yarım doğru puan almaz.",
    do: ["İlk cümleden konuyu ve zamanı çıkar.", "Önce 2–4 harfli yapı kelimelerini doldur (the, which, from).", "Çizgi sayısını say: kelimenin uzunluğu cevabı eler.", "Bitirince paragrafı bir kez baştan oku; tekil/çoğul ve -s uyumunu kontrol et."],
    avoid: ["Tek bir boşlukta takılıp kalmak: geç, sonra dön.", "Kökü doğru bulup eki atlamak (form → forms, formed)."],
    time: "Metin başına yaklaşık 3 dakika.",
    link: ["#cw-guide", "5 adımlı yöntem"],
  },
  "daily-reading": {
    measures: "Günlük metinlerde (e-posta, duyuru, ilan, program) amaç, ayrıntı ve okuyucunun ne yapması gerektiği.",
    scoring: "Her soru doğru/yanlış.",
    do: ["Önce soruyu oku, sonra metinde ilgili yeri tara (tarih, saat, koşul).", "Metindeki ifadenin başka kelimelerle söylenmiş halini (paraphrase) ara.", "'Why did the writer…' sorularında amacı ilk ve son cümlede ara."],
    avoid: ["Metindeki kelimeyi aynen tekrar eden şıkka hemen atlamak; çoğu zaman tuzaktır.", "Metinde yazmayan ama mantıklı görünen şıkkı seçmek."],
    time: "Metin başına 1–2 dakika.",
  },
  "academic-reading": {
    measures: "Akademik metinde ana fikir, ayrıntı, çıkarım, bağlamda kelime anlamı ve bir cümlenin metindeki işlevi.",
    scoring: "Her soru doğru/yanlış; metin ilk aşamadaki başarına göre zorlaşabilir.",
    do: ["Her paragrafın tek cümlelik özetini aklında tut.", "Kelime sorularında şıkkı cümleye koyup anlamı kontrol et.", "Çıkarım sorularında metnin açıkça desteklediği en temkinli şıkkı seç."],
    avoid: ["Çok genel ya da çok dar 'ana fikir' şıkları.", "always, never, only gibi kesin kelimeler içeren şıklar (metin desteklemiyorsa)."],
    time: "Metin başına 4–5 dakika.",
  },
  "choose-response": {
    measures: "Kısa bir ifadeye bağlama uygun, doğal cevabı seçme (dilin işlevini anlama).",
    scoring: "Her soru doğru/yanlış.",
    do: ["Cümlenin işlevini belirle: rica, öneri, şikâyet, davet, haber.", "Doğru cevap çoğu zaman dolaylıdır: 'Is the library open?' → 'It closes at six today.'"],
    avoid: ["Duyduğun kelimeyi tekrar eden ya da sesçe benzeyen şık (sound-alike) tuzağı.", "Dil bilgisi doğru ama işlevi yanlış cevap."],
    time: "Her soru birkaç saniye; tereddüt etme.",
  },
  conversation: {
    measures: "Kampüs veya günlük konuşmada amaç, ayrıntı, konuşmacının tutumu ve sonraki adım.",
    scoring: "Her soru doğru/yanlış.",
    do: ["Not: sorun → öneri → karar.", "Ton kelimelerine dikkat: actually, I'm not sure, to be honest.", "'What will the man probably do next?' için son cümleleri dinle."],
    avoid: ["Konuşmanın başında geçen ama sonra değişen bilgiyi seçmek."],
    time: "Ses bir kez çalar; not al.",
  },
  announcement: {
    measures: "Duyurudaki değişiklik, dinleyiciden istenen eylem ve zaman bilgisi.",
    scoring: "Her soru doğru/yanlış.",
    do: ["Ne değişiyor, kim etkileniyor, ne yapmalı, ne zamana kadar: dört soruyu not al.", "however, instead, starting next week gibi değişiklik işaretlerini yakala."],
    avoid: ["Eski bilgi ile yeni bilgiyi karıştırmak."],
    time: "Kısa; tek dinleme.",
  },
  "academic-talk": {
    measures: "Derste ana konu, örneğin amacı, neden-sonuç ve anlatımın düzeni.",
    scoring: "Her soru doğru/yanlış.",
    do: ["Yol işaretlerini dinle: First, Another reason, However, For example, So.", "Her kelimeyi değil yapıyı not et: konu → nokta 1 → örnek → nokta 2.", "'Why does the professor mention X?' = örneğin hangi noktayı desteklediği."],
    avoid: ["Örneğin ayrıntısını ana fikir sanmak."],
    time: "Tek dinleme; kısa notlar.",
  },
  "build-sentence": {
    measures: "Söz dizimi: konuşmadaki bir cümleye uygun cevabı kelimeleri sıralayarak kurmak.",
    scoring: "Cümlenin tamamı doğruysa puan; tek kelime yanlış yerde = puan yok.",
    do: ["Önce özne + fiili bul, sonra nesne ve tamamlayıcıları ekle.", "Dolaylı soruda düz sıra: Do you know where the library is?", "Zaman ve yer ifadeleri genelde sonda: at the library every evening."],
    avoid: ["Dolaylı soruda soru sırası (where is the library).", "Fiil ile nesnenin arasına zarf koymak."],
    time: "Madde başına yaklaşık 30–40 saniye.",
    link: ["#lesson/G7.3", "G7.3 Dolaylı sorular"],
  },
  email: {
    measures: "Görevin her maddesini karşılamak, uygun ton ve sosyal kurallar, dil çeşitliliği ve doğruluk.",
    scoring: "0–5 rubrik.",
    do: ["İlk cümlede amacı söyle: I am writing to …", "Görevdeki her maddeye ayrı 1–2 cümle ayır.", "Kibar rica kalıpları: Would it be possible …? Could you please …?", "Selamlama ve kapanış: Dear Ms. Chen, … Best regards,"],
    avoid: ["I want … ile talep etmek.", "Küçük i, büyük harfsiz cümle başı, eksik noktalama.", "Bir maddeyi atlamak (en pahalı hata)."],
    time: "7 dakika: 1 dk plan, 5 dk yaz, 1 dk kontrol.",
    link: ["#toolkit/writing", "E-posta kalıpları"],
  },
  discussion: {
    measures: "Tartışmaya ilgili ve özgün katkı, gerekçe ve örnekle gelişim, dil çeşitliliği ve doğruluk.",
    scoring: "0–5 rubrik. Önerilen uzunluk en az 100 kelime.",
    do: ["İlk cümlede tarafını seç.", "Diğer öğrencilerden birine bağlan ama aynı fikri tekrarlama; yeni bir gerekçe ekle.", "Bir gerekçe + kısa somut örnek + bitiriş cümlesi.", "Bağlaç çeşitliliği: In addition, However, For example, Therefore."],
    avoid: ["Hocanın sorusunu ya da öğrencilerin cümlelerini kopyalamak.", "Ezber, konuya uymayan giriş cümleleri.", "Gerekçesiz liste halinde fikirler."],
    time: "10 dakika: 2 dk plan, 7 dk yaz, 1 dk kontrol.",
    link: ["#toolkit/writing", "Tartışma kalıpları"],
  },
  "listen-repeat": {
    measures: "Duyduğun cümleyi anlam, kelime ve ek kaybı olmadan, anlaşılır biçimde tekrar etmek.",
    scoring: "Her cümle 0–5: eksiksizlik ve anlaşılırlık.",
    do: ["Cümleyi anlam öbekleri halinde aklında tut (who / did what / where / when).", "Küçük kelimeleri koru: a, the, to, -s, -ed.", "Duyduğun ritim ve vurguyla söyle."],
    avoid: ["Anlamı kendi kelimelerinle değiştirmek (paraphrase puan kaybettirir).", "Yarıda durup baştan başlamak; devam et."],
    time: "Cümle başına 8–12 saniye.",
  },
  interview: {
    measures: "Soruya doğrudan cevap, gerekçe ve örnekle gelişim, akıcılık, anlaşılırlık ve dil kullanımı.",
    scoring: "Her cevap 0–5.",
    do: ["4 adım: cevap → neden → örnek → toparlama.", "Açılış kalıbıyla 2 saniye kazan, sonra cevabını hemen söyle.", "Varsayım sorularında second conditional: If I had …, I would …"],
    avoid: ["Sorunun cümlesini aynen tekrar edip zaman doldurmak.", "Uzun sessizlik; bunun yerine zaman kazanma kalıbı kullan."],
    time: "45 saniye; yaklaşık 100–120 kelime akıcı bir hızdır.",
    link: ["#toolkit/speaking", "Konuşma araç kutusu"],
  },
});
