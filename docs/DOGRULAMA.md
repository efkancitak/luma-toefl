# Teslim doğrulaması — v0.2 · 16 Kasım 2026

Bu teslim, v4 belgelerindeki (REQUIREMENTS, CONTENT-SPEC, GRAMMAR, SOURCES, REVIEW) v0.2 taahhüdünü uygular: dil bilgisi öğretimi ve konuşma desteği. v0.1 teslimi (48 alıştırma, 126 kart, 36 mikro ders) aynı kimliklerle korunur. Planlama hedefi 15 Ocak 2027; kesin sınav rezervasyonu değildir.

## Otomatik doğrulama

- `npm test`: **58 test, 58 başarılı** (v0.1'in 28 testi + v0.2 için 24 test + v0.2.1 için 6 test).
- v0.2.1 (16 Kasım 2026): kayıtlı durumdaki tek bir geçersiz alan artık bütün ilerlemeyi sıfırlamaz. Yükleme önce katı doğrulamayı dener, olmazsa geçerli bölümleri koruyup yalnız geçersiz kayıtları atlar (`salvageBackup`); özgün kopya kurtarma yedeği olarak saklanır ve Ayarlar'dan aynı yolla geri yüklenebilir. Dış geri bildirim notu ve transkript sınırı 20.000 karaktere çıkarıldı; metin alanları doğrulayıcının kabul ettiği sınırla sınırlandı. Tarayıcıda denendi: 4.100 karakterlik notla yeniden yükleme (ilerleme korundu), sınırı aşan kayıtla yeniden yükleme (uyarı + geri kalan ilerleme korundu), aynı dosyanın Ayarlar'dan içe alınması.
- `npm run check`: bütün modüllerin sözdizimi başarılı.
- `npm run build`: statik `dist/` çıktısı başarılı.

Yeni testlerin kapsadığı kabul ölçütleri:

| Ölçüt | Test |
|---|---|
| 7 · Dil bilgisi | 11 modül, 69 ders (67 + 2 eşleme dersi), kodların benzersizliği; 36 mikro dersin her biri tam bir derse eşli; 69 dersin hepsinde Özet ve kontrol sorusu; her modülde 6–8 soruluk tarama; öncelikli 20 dersin Tam anlatımında şablonun bütün parçaları (işlev, yapı, kullanım, karşılaştırma, 1–3 sık hata, ≥4 örnek, 5–8 alıştırma tanıma → dönüştürme → üretim sırasıyla, her maddede cevap ve gerekçe, üretimde örnek ve kontrol listesi, tekrar maddeleri, sınav bağlantısı, konuşma kalıbı, özet); her maddenin kendi cevabının ve kabul edilen alternatiflerin doğru puanlanması; görev etiketi → ders kodu eşlemesi. |
| 8 · Konuşma | 4 × 7 cümlelik set, cümle başına 8–12 sn pencere, artan uzunluk, v0.1 cümlelerinin aynen korunması; 4 × 4 soruluk set (deneyimle başlayıp görüşle biten), 45 sn, v0.1 sorularının korunması; 48 ifade (40–60 aralığı); 12 telaffuz dersi. **Dikte karşılaştırması birim testleri:** büyük-küçük harf, noktalama, kısaltma (don't, it's, I'll, can't, eğik kesme işareti) ve sayı eşdeğerleri (2 = two, 200, 21, 10:30, 3rd), eksik/eklenen/değişen kelime raporu. |
| Kayıt ve yedek | Eski bir v0.1 yedeği yeni alanlar boş olarak yüklenir; v0.2 alanları JSON gidiş-dönüşünde korunur; geçersiz ders kodu, mod, öz değerlendirme ve dikte değerleri reddedilir. |
| Ölçüm ve öneri | Farklı gün tekrarı (yanlış madde aynı gün değil ertesi gün), haftalık konuşma günü sayımı, tek önerilen adımın öncelik sırası. |
| Çevrimdışı | Servis çalışanının önbellek listesinin bütün modülleri içerdiği. |

## Tarayıcıda gerçekten denenenler

Uygulama içi tarayıcı bölmesi bu oturumda localhost'a erişimi reddettiği için testler bilgisayardaki Google Chrome'un başsız (headless) modunda, DevTools protokolüyle yapıldı. Mikrofon için Chrome'un sahte ses cihazı kullanıldı.

| Akış | Sonuç |
|---|---|
| 390 px ve 320 px görünüm | 19 ekranın hepsinde yatay taşma yok (Bugün, Çalış, Konuşma, Dil bilgisi, dersler, taramalar, Kelimeler, İfade bankası, Rotam, Kaynaklar, Ayarlar, telaffuz dersleri, tekrar) |
| 1280 px masaüstü | Yan menü, ders okuyucu ve tablo düzeni incelendi |
| Ders ilerlemesi | G2.7 Tam anlatımında 4. ekrana geçildi, sayfa yeniden açılınca aynı ekrandan devam etti |
| Alıştırma | Yanlış seçenek → geri bildirim ve tekrar kuyruğu; eğik kesme işaretli dönüştürme cevabı doğru sayıldı; cümle dizme doğru puanlandı |
| Farklı gün tekrarı | Yanlış madde ertesi güne planlandı; tarihi geçmiş hâle getirilince tekrar yeni cümleyle açıldı, doğru cevap sonraki tekrarı ileri tarihe taşıdı |
| Eski bağlantı | `#lesson/g001` → `#lesson/G1.2` yönlendirmesi |
| Modül taraması | Modül 8'de yanlışlar ilgili derslere yönlendirdi; puan gösterilmedi |
| Bugün | Devam noktası (yarım ders, prova, tekrar) ve tek önerilen adım gösterildi |
| Listen and Repeat (öğrenme) | Dikte karşılaştırması "4/5 kelime eşleşti · dikte eşleşmesi"; öz değerlendirme; sonraki cümle; sahte mikrofonla kayıt alındı, IndexedDB'ye kaydedildi, oynatıcı göründü |
| Interview (prova) | Soru bir kez çaldı, 45 sn pencere otomatik başladı ve kayıt yapıldı, bitince metin, plan, inceleme araçları ve transkript alanı açıldı |
| İfade kartı | İfade destesi tekrar akışı ve puanlama |
| Yedek | Tarayıcıdaki gerçek durum `validateBackup` ile doğrulandı |

Test sırasında oluşan örnek yanıtlar ve ses dosyaları kaynak koduna veya ZIP'e dahil değildir.

## v0.3 · 16 Kasım 2026

Kapsam: veri güvenliği, yeniden çizimde metin koruma, deneme günlüğü, hata defteri, ses seçimi, mikrofon ön hazırlığı, yedek paylaşımı ve hatırlatması, ses kaydı yönetimi, güncelleme bildirimi, Konuşma sekmeleri. `schemaVersion: 1` korunur; yeni `itemReviews` ve `examLog` alanları isteğe bağlıdır ve eski yedekler yüklenir.

- `npm test`: **71 test, 71 başarılı** (58 + v0.3 için 13). Yeni testler: süreli oturumun dakikayı doldurması, tekrar çözümün bağımsız doğruluktan ayrılması, hata tekrarının farklı gün kuralı, deneme kaydının doğrulanması ve yalnız aynı koşulda karşılaştırma, yeni alanların yedek gidiş-dönüşü ve kurtarma, ses sıralaması, sürüm tutarlılığı, service worker'ın sahte önbellekle çalıştırılması (taze dosyalarla önbellek, yalnız istenince geçiş, çevrimdışı kabuk), yayın damgasının güncelliği.

Tarayıcıda 390 px ve 320 px'te denenenler:

| Akış | Sonuç |
|---|---|
| Mülakat transkripti ve dış geri bildirim notu | Öz değerlendirmeye dokununca metin, açık "Örnek cevap" ve kaydırma konumu korundu; metin yazarken kaydedildi; sonraki soru temiz açıldı |
| Telaffuz dersi diktesi | "Karşılaştır" sonrası metin ve açık bölüm korundu, sonuç göründü |
| 60 dakikalık oturum | 21 görev, 60 dakika |
| Hata tekrarı | Yanlış cevap kuyruğa girdi; ertesi güne alınmış durumda Bugün "1 soruyu yeniden deneme zamanı" önerdi; doğru cevap bir sonraki tekrarı ileri aldı; Reading kartı "1 bağımsız çalışma · 1 tekrar çözüm" gösterdi |
| Deneme sonuçların | Kayıt, form temizliği, değer türü değişince diğer alanların korunması, geçersiz girişte uyarı, "aynı koşuldaki önceki ilk çözüm" satırı |
| Ayarlar | Ses listesi (ilk sırada Samantha, yenilik sesleri sonda), ses kaydı kullanımı, son yedek satırı |
| Taşma | 12 ekranda 320 ve 390 px'te yatay taşma yok |

v0.3'te doğrulanmayanlar: **güncelleme bildirimi ve çevrimdışı açılış gerçek tarayıcıda denenmedi** (test tarayıcısı service worker kaydetmiyor; mantık birim testiyle çalıştırıldı). Paylaşım menüsüyle yedek, mikrofon ön hazırlığı ve ses seçimi yalnız gerçek iPhone'da doğrulanabilir.

## v0.8 · 26 Kasım 2026 · Antrenman, sekmeler, yazma döngüsü, gramer

- `npm test`: **121 test, 121 başarılı** (97 + 24). Yeni testler (`tests/v8.test.mjs`): plan tarihi ve gün sayısı, günlük payların her havuzu bitiş gününde tam bitirmesi (atlanan günün payı dağılır), görev türlerinin karışması, yedekte plan tarihi / günün listesi / yazma taslağı alanları ve eski yedeklerin yüklenmesi, yazma motorunun düzeltmeleri ve dört ölçüt, Tekrar şablonu, yan yana fark, dört adımlı AI istemi, kullanıcının 84 kelimesinin hepsi, AWL kapsamı (≥ 500 kart), kalıp ve bağlaç kartları, bağlaç şıklarının işleve göre ayrılması, parçacık ipuçları, 90 dersin hepsinde anlatım ve en az 5 alıştırma, alıştırmaların kendi cevabıyla doğru puanlanması ve düzeltme maddelerinin yalnız noktalama ile ayrışmaması, get tablosu, düzensiz fiiller, kullanım tabloları, puanlama rehberleri, araç kutuları, altı sekme.
- Tarayıcıda 375 px'te denenenler: Antrenman listesi (20 günde günde 67 kelime, 28 öbek fiil, 13 kalıp/bağlaç, 5 ders, 2 Reading, 2 Listening, 2 Writing, 1 Speaking), Başla → kelime adımı, adım ilerlemesi, bitiş tarihini değiştirince listenin yeniden bölünmesi (31 Aralık: 36 gün); Speaking sekmesindeki puanlama ve araç kutusu; öbek fiil kartının arkasında parçacık ipucu; Write an Email ile bütün döngü (değerlendirme, hatalar, yan yana karşılaştırma, Tekrar boşlukları ve karşılaştırma, kendi puanı, kaydetme, sonraki madde); G1.2 alıştırmalarıyla dersin kendiliğinden tamamlanması, yanlış maddenin tekrar kuyruğuna girmesi ve “Sıradaki ders” düğmesi; G6.7 get tablosu ve destedeki 32 get ifadesi; G7.10 that tablosu; V2/V3 alıştırması; Gramer programı (A1 → C2, sıradaki ders) ve altı başvuru tablosu. 320 px'te 14, 375 px'te 9 ekranda yatay taşma yok; konsol hatası yok.
- Gramer taraması: 184 maddelik A1–C2 kontrol listesi (zamanlar, modallar, koşullar, edilgen, fiil kalıpları, isim öbeği, zamirler, belirleyiciler, sıfat/zarf, karşılaştırma, edatlar, yan cümleler, dolaylı anlatım, soru, söylem, devrik yapı, kelime türetme, yazım) ders metinleri, alıştırmalar, tablolar ve başvuru tablolarında arandı; eksik 8 maddeden 7'si eklendi (gazete başlığı dili TOEFL'a katkısı olmadığı için eklenmedi). Arama anahtar kelimeyle yapıldı; bir konunun bulunması derinliğinin yeterli olduğunu kanıtlamaz.
- Günlük alternatifler: 33 grup, 180 kart; tarayıcıda Kelimeler → Günlük listesi, grup açma, “I want … yerine” kartının sorusu, şıkları (başka gruplardan) ve kart arkası denendi; taşma ve konsol hatası yok.
- Kart taraması: tekrar ve yakın tekrar (analyse/analyze), geçersiz konu, boş alan, örnek cümle ve anlam uzunluğu denetlendi; 45 kartlık rastgele örneklem elle okundu. Türkçesi aynı 34 çift eş anlamlı olarak işaretlendi; 29 öbek fiilin anlamı uzun ama doğru.
- Yazma motoru yalnız kesin bildiği hataları düzeltir (yazım listesi, I, büyük harf, unvan, kapanış, look forward to hearing, I am agree, a/an, although…but, since → for gibi); cümle yapısının tamamını denetleyemez. Bu yüzden ekranda “resmî puan değildir” ve “dil bilgisinin tamamını denetleyemez” uyarıları var; ayrıntılı geri bildirim için dört adımlı AI istemi kopyalanabilir.
- AWL listesi eapfoundation.com'daki 570 başlık kelimeden alındı (kelime listesi; tanım kopyalanmadı). 43 başlık destede yok: 41'i A1–A2 düzeyinde çok temel (area, job, team …), rely ve behalf ise “rely on” ve “on behalf of” kartlarıyla var.
- Yeni içerik (kalıplar, bağlaçlar, 18 ders, 347 alıştırma, puanlama özetleri, 240 kelime) AI yardımıyla özgün yazıldı ve dil uzmanı incelemesinden geçmedi. Puan bantları ETS ölçütlerinin özetidir, resmî metin değildir.

## v0.7 · 25 Kasım 2026 · öbek fiiller

Kaynak: kullanıcının `phrasal-verbs-tek-dosya.json` dosyası (şema 1.0.0; 554 ifade, 704 anlam, 12 dil bilgisi notu, 40 parçacık). Dosyanın üst verisine göre Türkçe açıklamalar ve örnekler o dosya için özgün yazılmış; içerik incelenmeden aktarıldı, `data/phrasal.js` biçimine dönüştürüldü (çekim tabloları dışarıda bırakıldı).

- `npm test`: **97 test, 97 başarılı** (91 + 6). Yeni testler: bütün ifade ve anlamların aktarılması, her ifadenin tek kart olarak seviye destelerine karışması ve ilk 20 kartta yer alması, mevcut 17 kartın kimliğinin korunması, öbek fiil kartlarına öbek fiil şıkları, G6.5 Tam anlatımının bütün maddelerinin kendi cevabıyla doğru puanlanması, kart arkası ve ders bağlantıları.
- Tarayıcıda 390 px'te denenenler: seviye ve konu kartları (B1 517 · B2 653 · C1 340 · C2 147; Öbek fiiller 554), “Öbek fiil” liste süzgeci, karışık B1 seti, öbek fiil kartının arkası (anlam, kalıp, nesne yeri, örnek, Türkçesi, not, ders bağlantısı), G6.5 Tam anlatım: parçacık tablosu, alıştırma, desteye geçiş düğmesi. 320 px'te 8 ekranda taşma yok, konsol hatası yok.

## v0.6 · 25 Kasım 2026 · Complete the Words, Speaking kalıpları, B1–C2 kelimeler

Kaynaklar: ETS Speaking Scoring Guide (Listen and Repeat, Take an Interview) ve 2026 Test Blueprint and Specifications PDF'leri okundu (puanlamada bakılanlar, Reading'de morfoloji ve söz dizimi ipuçlarıyla eksik kelime tamamlama, konuşma konularının alanları). ETS içerik sayfası ve Test Overview PDF'i otomatik okuyucuya açılmadı. Kullanıcının verdiği 14 Complete the Words ekran görüntüsü format ve boşluk türleri için incelendi; metinleri uygulamaya kopyalanmadı. Speaking ipuçları kullanıcının paylaştığı video notlarından genel öneri olarak özetlendi; oradaki örnek cevap kullanılmadı, bütün örnekler özgün.

- `npm test`: **91 test, 91 başarılı** (82 + 9). Yeni testler: konu desteleri, 24 metin ve her boşluğun Türkçesi, yeni metinlerde ilk yarının gösterilmesi, boşluk türü sınıflandırması ve rapor, Kolay mod ve ipuçlarının yardımlı sayılması, yeni taslak alanlarının (mod, ipucu) gidiş-dönüşü, 24 örnek cevabın 4 adımı ve 110–135 kelimesi, Speaking rehberi, yüksek değerli kalıplar.
- Tarayıcıda 390 px'te denenenler: B1–C2 seviye ve 10 konu kartı, konu destesinden şıklı set, Complete the Words rehberi, Öğrenme modunda ipucu (tür → anlam → harf), kontrol sonrası kelime tablosu, tür analizi ve “Odaklan” önerisi, ipucu alınan denemenin yardımlı kaydı; Speaking Öğren sekmesi (renkli örnek cevap, kalıplar), mülakatta renkli örnek cevap ve transkript kelime sayacı. 320 px'te 13 ekranda taşma yok, konsol hatası yok.
- Doğrulanmayanlar: yeni kelime, metin ve örnek cevapların dil incelemesi; gerçek iPhone'da görünüm.

## v0.5 · 19 Kasım 2026 · telefon geri bildirimi

Kelime destesi 1019 (A1 91 · A2 157 · B1 217 · B2 232 · C1 203 · C2 119), ifade bankası 119 (A1–C1), dört şıklı kelime ve ifade çalışması, A1→C2 tam setler (düzey, süre ve sayaç seçimi kaldırıldı), Complete the Words için harf sayısı, sonuç işaretleri ve Türkçe çeviri, yeni tasarım katmanı. `schemaVersion: 1` korunur; yeni isteğe bağlı alanlar `learned` ve `reviewSession.pick/right/wrong/scope`.

- `npm test`: **82 test, 82 başarılı** (73 + 9). Yeni testler: deste büyüklüğü ve seviye dağılımı, kelime ve kimlik tekilliği, her kartta sözcük türü, 1–3 anlam ve örnek cümle; şıkların dört ve tek doğrulu olması, doğru cevapla anlam paylaşmaması, her seferinde aynı çıkması ve doğru şıkkın konumunun dengeli dağılması; ifade şıklarında aynı işlevden ikinci kalıp olmaması; tam setin A1→C2 sırası, çözülenin tekrar gelmemesi, kaldığı yerden devam ve hepsi bitince tekrar turu; Türkçe çevirilerin varlığı; yeni kayıt alanlarının gidiş-dönüşü ve kurtarılması; kaldırılan kontrollerin kodda kalmaması.
- Tarayıcıda 390 px'te denenenler: Bugün ekranı, kelime seviye kartları, A1 setinde doğru ve yanlış cevap (renkler, sayaçlar, 10 dakikalık tekrar), “Öğrendim”, sayfa yenilemede cevaplanmış kartın korunması; Okuma seti (A2'den başlıyor, 24 soru), bir soru çözüldükten sonra yeniden açılınca kaldığı yerden devam, başka sete geçip dönünce çözülen sorunun gelmemesi; Complete the Words sonuç ekranı (6/10, işaretler, çeviri); ifade setinde Türkçe soru ve İngilizce şıklar. 320 px'te 12 ekranda yatay taşma yok; konsol hatası yok.
- Doğrulanmayanlar: yeni kelime ve ifadelerin dil incelemesi (AI yardımıyla yazıldı, `unreviewed`); gerçek iPhone'da yeni tasarım ve yuvarlak yazı tipi.

## v0.4 · 16 Kasım 2026 · içerik

Alıştırma 48 → 90 (tahmini 177 → 333 dakika), kelime kartı 126 → 180, konuşma seti 8 → 12. `npm test`: **73 test, 73 başarılı**. Her yeni cevap anahtarlı madde kendi cevabıyla puanlayıcıdan geçirildi; dört yeni cloze metni boşluklar doldurulmuş hâliyle okundu; her cümle dizme maddesinin tek doğru sırası olduğu test edildi. Yeni içerik `unreviewed`: ikinci okuma ve tercihen uzman incelemesi bekliyor. Tarayıcıda yeniden denenmedi (kod değişmedi, yalnız veri eklendi).

## Doğrulanmayanlar ve sınırlar

- **Fiziksel iPhone:** Safari/ana ekran kurulumu, mikrofon izni ve izin reddi, kilit ekranı, iOS klavye diktesi ve gerçek dikte çıktısı denenmedi. Dikte karşılaştırması birim testleriyle doğrulandı; iPhone'un ürettiği gerçek metinle ayrıca denenmeli.
- **TTS sesleri:** Başsız Chrome'da konuşma sesi yok; uygulama `end` olayı gelmezse tahmini süreyle devam eder. Telaffuz örneklerinin iPhone İngilizce sesiyle doğru seslendirildiği kontrol edilmedi (CONTENT-SPEC yayın kontrolü 5).
- **İçerik incelemesi:** Yeni içerik (20 Tam anlatım, 27 Özet, taramalar, konuşma setleri, ifade bankası, telaffuz dersleri) AI yardımıyla özgün yazıldı ve `unreviewed` olarak işaretli. Yapısal test bir dil incelemesi yerine geçmez; ikinci okuma ve tercihen uzman incelemesi gerekir.
- **Tam anlatım:** 49 dersin Tam anlatımı planlandı; uygulamada "planlandı" olarak görünür.
- **Ölçüm:** TOEFL bandı, CEFR seviyesi, telaffuz puanı veya Speaking bandı üretilmez. ETS deneme sonucunu uygulamada kaydetme sonraki sürüm özelliğidir.
- **Prova modu** sınav simülasyonu değildir; tarayıcı TTS'si ve dokunmayla başlatma gerektirir.
- GitHub push, dış barındırma ve yayımlama yapılmadı.

## Sonraki adımlar (REVIEW.md ile uyumlu)

1. Bu hafta başlangıç ölçümü (ETS dijital örnek veya PDF + resmî ses).
2. Gerçek iPhone'da kurulum, kayıt, dikte, TTS ve yedek geri yükleme kontrolü.
3. Başlangıç ölçümünde görülen hatalara göre sonraki Tam anlatım partisi; öncelikli 20 dersin ikinci okuması.
