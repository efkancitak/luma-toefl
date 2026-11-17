# Luma — İçerik gereksinimleri ve sözleşmesi

16 Kasım 2026 · Belge v4. Ürün kararları [REQUIREMENTS.md](REQUIREMENTS.md), dil bilgisi ders haritası [GRAMMAR.md](GRAMMAR.md), dış kaynaklar [SOURCES.md](SOURCES.md) dosyasında.

## Bankanın kapsamı

V0.1'de 12 görev türüne dörder kayıt düşer. Toplam **48 tekil alıştırma**, **126 kelime ve ifade kartı** ve **36 gramer mikro dersi** vardır. Kelime kartı ve içinde görünen tamlamalar ayrı kartlar gibi sayılmaz. Bir metne bağlı beş soru, bir görev kümesi ve beş cevap maddesi olarak raporlanır. Yazma ve konuşma üretimleri de ayrı sayılır.

Genişletmede ilk amaç, başlangıç ölçümünde öne çıkan bir veya iki görev türü için daha önce görülmemiş örnekler ve mevcut hatalara bağlanan destek dersleridir. Her yeni küme için amaç, senaryo, zorluk ve cevap gerekçesi belirlenir. Ölçüm için ayrılan içerik, öğretici tekrar kuyruğuna alınmaz. Kapsamı büyütme kararı, kullanılan ve eksik kalan görevlerden çıkarılır. Önceki 300/800–1200 kart ve 600+ madde sayıları teslim şartı olarak kullanılmaz.

V0.2 içerik taahhüdü kullanıcı talebinden gelir: dil bilgisinde GRAMMAR.md'deki 67 derslik harita (ilk parti öncelikli 20 dersin Tam anlatımı), konuşmada 7 cümlelik Listen and Repeat ve 4 soruluk Interview setleri, 12 telaffuz mikro dersi ve 40–60 kayıtlık konuşma ifade bankası. Bunlar hedeftir; yapılmış içerik sayıları teslimde ayrıca raporlanır.

## Ortak veri ve kalite kuralları

| Alan | V0.1 sözleşmesi ve genişletme kuralı |
|---|---|
| Kimlik | Benzersiz, sabit `id`. Mevcut `cw-01`, `dr-01` ve benzeri kimlikler yedek ve ilerleme uyumu için korunur. |
| Sınıflandırma | `skill`, `taskType`, `type`, editoryal `level`, hata/beceri ve konu `tags` etiketleri. |
| Sunum | `title`, İngilizce `prompt`, Türkçe `explanation`, gerçekçi `estimatedMinutes`. Prova süresi ve öğrenme süresi ayrı tutulur. |
| Kaynak ve sürüm | Mevcut özgün banka `original-ai-assisted` kökenine sahiptir. Yeni içerik sözleşmesinde madde/banka sürümü ve inceleme durumu tutulur. Sonuçları etkileyen düzenlemede sürüm artar. Eski deneme eski sürümle ilişkilendirilir veya tarihsel sonuç olarak işaretlenir. |
| Cevap | `mcq` için anlamca farklı seçenekler ve tek savunulabilir doğru indeks. `gaps` için sıra, önek, beklenen sonek ve varsa doğrulanmış alternatif. `order` için sözcük dizisi veya doğrulanmış eşdeğer diziler. Üretim görevlerinde örnek yaklaşım ve kontrol listesi. |

V0.1 tekil MCQ kayıtlarında `options` ve `answer`, cloze kayıtlarında `passage` ve `gaps`, dinlemede `audioText`, cümle kurmada `tokens` ve `answer`, üretimde `checklist` ve `modelAnswer` kullanır. Birden çok maddeli prova gerektiğinde tek metin/ses girdisi ile ona bağlı, her biri sabit kimlikli maddeler tanımlanır. Çok maddeli sözleşme ve alternatifi değerlendirme desteği sonraki geliştirmedir.

Metinler, ses metinleri, örnekler, sorular ve gerekçeler özgün hazırlanır. ETS kaynakları için bağlantı verilir. İçerik kopyası ve yayın koşulları [SOURCES.md](SOURCES.md) dosyasındadır.

## On iki görevin tasarımı

Aşağıdaki sağ sütun ileride üretilecek format odaklı görevler içindir. V0.1'de tek sorulu okuma/dinleme, tek cümleli tekrar ve tek mülakat sorusu gibi kısa çalışmalar vardır. ETS biçimiyle örtüşen uzunluk ve süreler ilgili kaynakta kontrol edilir. [ETS Updated Test Overview](https://www.ets.org/pdfs/toefl/toefl-ibt-test-overview.pdf).

| Görev / mevcut kimlik | Format odaklı içerik kuralı |
|---|---|
| Complete the Words · `complete-words` | Yaklaşık 70–100 sözcüklü akademik paragraf. İlk cümle tam. Ardından her ikinci sözcüğün ikinci yarısından 10 boşluk. Önekin beklenen sözcükle gerçekten eşleştiğini ve alternatiflerin bağlamı bozmadığını denetle. |
| Read in Daily Life · `daily-reading` | Yaklaşık 15–150 sözcüklü mesaj, ilan, duyuru, çizelge veya e-posta. Metne göre 2–3 soru. Amaç, ayrıntı veya çıkarımı ölç. |
| Read an Academic Passage · `academic-reading` | Yaklaşık 200 sözcük ve 5 soru. Ana fikir, sözcüğün bağlamı, kanıt/ayrıntı, çıkarım ve metin düzeni arasında çeşitlilik. Alan bilgisi önkoşulu olmamalı. |
| Listen and Choose a Response · `choose-response` | Kısa sesli istem ve dört yazılı seçenek. En uygun tepkiyi iletişim amacı ve bağlam belirler. Prova modunda yazılı istem gizlenir. |
| Listen to a Conversation · `conversation` | İki konuşmacılı kısa akademik veya gündelik diyalog ve 2 soru. Amaç, ima ve sonraki eylem gibi farklı becerilerden seçim yap. |
| Listen to an Announcement · `announcement` | Yaklaşık 40–85 sözcüklü eğitim bağlamı. Ana mesaj ve kullanıcıyı etkileyen ayrıntı veya ima. Luma'da iki soru üretim tercihi olabilir. |
| Listen to an Academic Talk · `academic-talk` | Yaklaşık 100–250 sözcük ve 4 soru. Konuşmacının amacı, örnek, düzen ve çıkarım. Yanıt yalnız kayıttan çıkarılabilmeli. |
| Build a Sentence · `build-sentence` | Tam bir bağlam cümlesi ve ona uygun yanıtı kurduracak sözcük/öbekler. Gerektiğinde sabit baş/son ve kullanılmayan öbek. Aynı öbeklerle kurulabilen diğer uygun yanıtları kontrol et. |
| Write an Email · `email` | Alıcı, ilişki, durum, amaç ve karşılanması gereken noktalar. Resmî görev için 7 dakika. Örnek, görev maddelerini, tonu ve açık kapanışı gösterir. |
| Write for an Academic Discussion · `discussion` | Hocanın sorusu ve farklı görüşleri olan iki öğrenci katkısı. 10 dakika. Yaklaşık 100 sözcük ve üzeri ETS örnek yönergesindeki hedef olarak kullanılabilir. Geri bildirimde ilgililik, özgün katkı ve gerekçe temel, kelime sayısı yardımcı bilgidir. |
| Listen and Repeat · `listen-repeat` | Prova için aynı senaryoda giderek uzayan ve karmaşıklaşan 7 cümle. Cümle başına 8–12 saniyelik yanıt penceresi. Önce ses, sonra kayıt, sonra karşılaştırma. |
| Take an Interview · `interview` | Ortak tema üzerinde deneyimden gerekçeli görüşe geçen 4 soru. Soru başına 45 saniye. Örnek cevap, konuşanın kendi örneğini geliştirmesine yardımcı olur. |

Çeldiriciler metne ya da ses kaydına göre yanlış olmalı. Aynı anlama gelen seçenek veya birden çok savunulabilir yanıt varsa soruyu yeniden yaz ya da kabul edilen alternatifleri açıkça tanımla. Türkçe açıklama, doğru cevabın kanıtını gösterir. Yaygın yanıltıcı seçeneklere kısa gerekçe eklemek özellikle yararlıdır. Dinleme provasında tek oynatım ve ses sonrası soru sırası uygulanır. Öğrenme modunda tekrar ve transkript, erişim ve öğretim amacıyla bulunabilir.

## Kelime ve tamlama

Akademik metin, kampüs hizmetleri, günlük bildirimler, araştırma yöntemi, neden-sonuç, değerlendirme ve resmî iletişim temel kapsamı oluşturur. Kelime kaydı başlık, kelime türü, hedef anlam, kısa özgün İngilizce tanım, Türkçe karşılık, aile, yaygın tamlamalar, bağlam ve özgün örnek taşır. Farklı anlamlar karışıyorsa ayrı örnek veya kart kullanılır. Academic Word List akademik aday seçiminde başvuru kaynağıdır. [Victoria University of Wellington](https://www.wgtn.ac.nz/lals/resources/academicwordlist).

Öncelik kullanıcının görevlerde duyduğu veya yanlış kullandığı sözcüklerdir. Örneğin `evidence` kartı, `provide evidence` ve `the evidence suggests` ifadelerini iki ayrı iletişim işleviyle gösterir. Anlamı hatırlamak, uygun tamlamayı seçmek ve yeni cümlede kullanmak ayrı alıştırmalardır. Yeni kart alımı, vadesi gelen tekrar yükü ve farklı günlerdeki hatırlamaya göre ayarlanır. Kart görmek veya kuyruğa eklemek öğrenme göstergesi sayılmaz.

## Dil bilgisi ve akademik dil

Ders listesi, düzeyleri ve sık hatalar [GRAMMAR.md](GRAMMAR.md) dosyasındadır: 11 modül, 67 çekirdek ders (v0.1 eşlemesinden açılan G3.10 ve G10.9 ile 69); isim öbeği (isim tamlamaları) için 13, koşul cümleleri için 7 ders. Düzeyler editoryaldir; aynı yapı bağlama ve işlevine göre farklı zorlukta işlenebilir. CEFR düzeyleri iletişim becerisi tanımlar. [Council of Europe CEFR tanımları](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).

Her ders iki katmandan oluşur. V0.1 mikro dersleri **Özet** katmanına karşılık gelir; **Tam anlatım** aşağıdaki şablonla yazılır.

| Parça | İçerik kuralı |
|---|---|
| İşlev | Yapının iletişimde ne işe yaradığı, 1–2 Türkçe cümle. |
| Yapı | Biçim tablosu veya kalıp: olumlu/olumsuz/soru ya da öbek sırası. |
| Anlam ve kullanım | Ne zaman kullanıldığı ve Türkçedeki karşılığından farkı. |
| Karşılaştırma | En çok karıştırılan yapıyla fark (ör. present perfect – past simple, if – when, 's – of). |
| Sık hata | Türkçe konuşanlarda görülen 1–3 hata: yanlış → doğru → neden. Her kullanıcıda görüleceği varsayılmaz. |
| Örnekler | En az 4 özgün örnek: kampüs, akademik metin ve konuşma bağlamından; TTS ile dinlenebilir. |
| Alıştırma | 5–8 madde, sırayla tanıma (seçme, boşluk) → dönüştürme → üretim (kendi cümlesi veya cümle dizme). Her maddede cevap ve Türkçe gerekçe; serbest üretimde örnek cevap ve kontrol listesi. |
| Sınav bağlantısı | Yapının hangi TOEFL görevinde nasıl karşına çıktığı. |
| Konuşma kalıbı | Mülakatta kullanılabilecek bir hazır cümle kalıbı ve onu sesli söyleme adımı. |
| Özet | Tek ekranlık hatırlatma; tekrar ve hızlı bakış için. |

Etiketleme: görev maddelerinin dil bilgisi etiketi GRAMMAR.md ders koduna eşlenir (ör. `indirect-question` → G7.3, `subject-verb-agreement` → G2.11). Ders sonu alıştırmaları tekrar kuyruğuna girer; ölçüm için ayrılan görev içeriği kuyruğa alınmaz.

## Konuşma içeriği

**Mülakat cevap yapısı.** 45 saniyelik genel plan: doğrudan cevap (1 cümle) → neden (1–2 cümle) → kişisel örnek veya deneyim (2–3 cümle) → kısa kapanış. Her Interview setinde soru türü işaretlenir ve aşağıdaki kalıba bağlanır.

| Soru türü | 45 saniyelik plan | İlgili dersler |
|---|---|---|
| Deneyim ("Tell me about a time…") | Ne oldu → ne yaptın → ne öğrendin | G3.2, G3.4, G3.6 |
| Alışkanlık ve tercih ("How do you usually…", "Do you prefer…") | Tercih → neden → kısa örnek | G3.1, G8.1 |
| Görüş ("Do you think… should…?") | Net görüş → gerekçe ve örnek → kapanış | G4.2, G4.5, G10.1 |
| Varsayım ("What would you do if…?") | Ne yapardın → neden → olası sonuç | G5.2, G5.4 |

**İfade bankası.** 40–60 kayıt. Alanlar: `phrase`, `function` (görüş, örnek, neden, karşılaştırma, zaman kazanma, kapanış), `tr`, `example`, `register` (konuşma/yazı). Örnekler: "From my experience, …", "The main reason is that …", "For instance, last semester …", "That's an interesting question — I'd say …", "Overall, …". Kalıplar ezber cevap değildir; her cevapta bir-iki tanesi yeterlidir, aşırı kalıp doğallığı düşürür.

**Telaffuz mikro dersleri.**

| # | Konu | Örnek |
|---|---|---|
| P1 | /θ/ ve /ð/ (t, d, s, z ile değiştirmeme) | think – sink, they – day |
| P2 | /w/ ve /v/ | west – vest |
| P3 | /æ/ ve /e/ | bad – bed, man – men |
| P4 | Kısa ve uzun ünlüler | live – leave, full – fool |
| P5 | Zayıf ünlü (schwa) ve vurgusuz heceler | about, problem, today |
| P6 | -ed sonu: /t/, /d/, /ɪd/ | asked, played, needed |
| P7 | Kelime sonu ünsüzler: kümeler ve /ŋ/ | tests, months; thinking (sona "g" eklememe) |
| P8 | Kelime vurgusu ve kelime ailesi | PHOtograph – phoTOgraphy; REcord (isim) – reCORD (fiil) |
| P9 | Cümle vurgusu ve zayıf biçimler | to, for, can, and, of |
| P10 | Bağlama (linking) | turn it off, an apple |
| P11 | Tonlama: soru türleri, liste, emin olmama | "You're coming?" ↗, "red, green, and blue" |
| P12 | Anlam öbekleri ve duraklama | Uzun cümleyi doğru yerden bölme (Listen and Repeat ile doğrudan bağlantılı) |

Her telaffuz dersinde kısa Türkçe açıklama, 6–10 minimal çift ya da örnek kelime, 3 kısa cümle, TTS ile dinle → kaydet → art arda karşılaştır adımı ve bir öz değerlendirme maddesi bulunur. Fonetik simgeler en aza indirilir; Türkçe benzetmeyle desteklenir.

**Dikte karşılaştırma kuralları.** Karşılaştırmadan önce iki metin de küçük harfe çevrilir, noktalama ve fazla boşluk silinir. Kısaltmalar eşdeğer sayılır (it's = it is, don't = do not, I'm = I am). Sayılar yazı ve rakam olarak eşdeğerdir (two = 2). Hizalama kelime düzeyinde en kısa düzenleme mesafesiyle yapılır ve sonuç eksik, eklenen ve değişen kelimeler olarak işaretlenir ("14/16 kelime eşleşti"). Etiket her zaman "dikte eşleşmesi"dir ve objektif doğruluk ya da telaffuz puanıyla birleştirilmez.

## Üretim geri bildirimi

| Görev | Kendi yanıtını inceleme |
|---|---|
| E-posta | İstenen noktaların her biri, amaç, ton, işe yarar ayrıntı, anlaşılabilir cümleler. |
| Akademik tartışma | Soruyla bağlantı, açık görüş, somut gerekçe, tartışmaya katkı ve fikirlerin bağlanması. |
| Dinle ve tekrarla | Kayıttan yeniden dinleyip eksik, eklenmiş veya değişmiş kelimeyi işaretle; istersen dikte karşılaştırmasını kullan. Anlaşılabilirliği ayrı değerlendir. |
| Mülakat | Doğrudan cevap, gerekçe veya örnek, 45 saniyelik yapıya uyum, konuşma temposu ve anlaşılabilirlik. Transkript varsa dil bilgisi ve kelime için aşağıdaki konuşma istemi. |

V0.1 kontrol listesi, örnek yaklaşım ve öz değerlendirme sunar. ETS'nin 0–5 görev ölçütleri referans olarak dışarıdan açılabilir. Uygulama ve dış geri bildirimde bu ölçeğe benzeyen otomatik puanlar yerine cevap içinden örnek ve düzeltme istenir. [Writing ölçütleri](https://www.ets.org/pdfs/toefl/writing-rubrics.pdf), [Speaking ölçütleri](https://www.ets.org/pdfs/toefl/speaking-rubrics.pdf).

İsteğe bağlı manuel istem, kişinin kendi metni için herhangi bir geri bildirim aracında kullanılabilir. Resmî ETS soru metnini veya kişisel tanımlayıcı bilgileri ekleme.

> Aşağıda özgün bir TOEFL iBT yazma pratiğinin görev özeti ve kendi İngilizce yanıtım var. Geri bildirimi Türkçe yaz. Önce görevin hangi noktalarını karşıladığımı belirt. Metnimden kısa örneklerle en önemli iki veya üç dil ya da yapı hatasını açıkla. Her hata için düzeltme ve bir yeniden yazma önerisi ver. Anlamımı koru. TOEFL puanı veya CEFR seviyesi verme.  
> Görev türü: [e-posta / akademik tartışma]  
> Görev özeti: […]  
> Yanıtım: […]  
> Süre ve kullandığım yardım: […]

Konuşma için ses inceleme imkânı yoksa, transkript üzerinden sözcük, gramer ve fikir örgüsüyle sınırlı geri bildirim iste. Telaffuz, tempo ve anlaşılabilirlik için kendi kaydını dinle veya bir dinleyiciden yorum al. Transkript, cevabı iPhone klavyesinin dikte özelliğiyle metin alanına söyleyerek elde edilir.

> Aşağıda özgün bir TOEFL iBT mülakat pratiği sorusu ve yaklaşık 45 saniyelik cevabımın dikteyle elde edilmiş transkripti var. Transkript dikte hatası içerebilir; yalnız açıkça dil bilgisi veya kelime seçimi olan hataları belirt. Geri bildirimi Türkçe yaz. Soruya doğrudan cevap verip vermediğimi, gerekçe ve örneğimin yeterliliğini ve fikir sırasını değerlendir. En önemli iki veya üç hatayı düzeltmesiyle göster. Aynı fikri daha doğal anlatan, 45 saniyede söylenebilecek bir yeniden konuşma önerisi ver. Telaffuz, akıcılık, TOEFL puanı veya CEFR seviyesi hakkında yorum yapma.  
> Soru: […]  
> Transkriptim: […]

İsteğe bağlı sesli prova istemi (sesli bir asistanda kullanılır; asistan duraklamalarda araya girebilir, bu yüzden sınav simülasyonu değildir):

> Benimle TOEFL iBT "Take an Interview" provası yap. Konu: [tema]. Bir kampüs araştırmacısı gibi davran ve kişisel deneyimden görüşe ilerleyen dört soruyu birer birer İngilizce sor. Her sorudan sonra yaklaşık 45 saniye konuşmama izin ver ve cevaplarım sırasında yorum yapma. Dört soru bitince Türkçe olarak her cevap için doğrudan cevap, gerekçe/örnek ve dil kullanımı hakkında kısa geri bildirim ver; duyduğun en önemli üç dil hatasını düzeltmesiyle yaz. Telaffuz puanı, TOEFL puanı veya CEFR seviyesi verme.

## Yayına alma kontrolü

1. Gerekli alanları, benzersiz kimliği, cevap indeksini, boşluk ve öbek eşleşmesini otomatik kontrol et. Mevcut `npm test` içerik testlerini içerir. Çok maddeli şema geldiğinde aynı testlere yeni kurallar eklenir.
2. İkinci okumada soruyu cevabı görmeden çöz. Çeldiricileri, doğallığı, açıklamayı ve örnek cevabın amaca uygunluğunu kontrol et. Yapısal test bir dil incelemesi yerine geçmez.
3. İnceleme durumunu açık tut. `unreviewed`, `self-checked` veya doğrulanmış `expert-reviewed` etiketini yalnız ilgili kontrol yapıldıysa kullan.
4. Şüpheli soruyu ölçümden çıkar. Düzeltme ve sürüm kaydı sonrasında tekrar kullan. Soru işaretleme arayüzü eklenene kadar kısa bir kişisel not yeterlidir.
5. Dil bilgisi Tam anlatımında şablonun bütün parçaları bulunur; her alıştırma maddesinin cevabı ve gerekçesi vardır; üretim maddesinde örnek cevap ve kontrol listesi vardır. Telaffuz dersinde minimal çiftlerin gerçekten tek ses farkı taşıdığı kontrol edilir ve örnekler cihaz TTS'siyle dinlenir; TTS'nin yanlış seslendirdiği kelime örnekten çıkarılır.