# Luma — Ürün ve teknik gereksinimler

16 Kasım 2026 · Belge v4 · Tek kullanıcı · Birincil cihaz iPhone.

Hedef, Ocak 2027 ortasına kadar dört beceride mümkün olan en iyi sınav performansına ulaşmak. Plan 15 Ocak 2027'yi düzenlenebilir hedef tarih olarak kullanıyor. Kesin sınav günü ve yeri kullanıcıya ait. Hedef bant isteğe bağlı. Başvuru şartı netleşirse toplam hedef ve varsa bölüm alt sınırları ayrıca not edilir.

V4 ile iki kullanıcı talebi taahhüt olarak eklendi: Luma, isim öbeklerinden koşul cümlelerine kadar çekirdek dil bilgisini Türkçe anlatır ([GRAMMAR.md](GRAMMAR.md)) ve Speaking bölümü için prova, öğretim ve kendi konuşmanı inceleme desteği verir (aşağıda "Konuşma desteği").

## Teslim edilen sürüm ve geliştirme öncelikleri

| Durum | Kapsam |
|---|---|
| Teslim edilen v0.1 | iPhone odaklı PWA, dört becerinin ayrı görünümü, 12 görev türünde 48 tekil alıştırma, 126 birleşik kelime/tamlama kartı, 36 gramer mikro dersi, 15/30/60 dakika ve serbest setler, sessiz seçenek, görev sayacı, cevap/taslak ve kelime kuyruğu kaydı, cihaz TTS'si, ses kaydı, yerel JSON yedekleme. |
| Önce | Gerçek iPhone'da kurulum, kayıt ve geri yükleme kontrolü. İlk beceri profili ve ETS kontrol noktaları hemen çalışma planı olarak kullanılabilir. Uygulama içinde deneme sonuçlarını girme ve kaydetme, sonraki sürüm özelliğidir. |
| v0.2 · kullanıcı talebi | **Dil bilgisi:** GRAMMAR.md'deki 67 derslik haritanın (v0.1 eşlemesinde açılan 2 dersle 69) Özet + Tam anlatım katmanları; ilk parti öncelikli 20 ders. **Konuşma:** 7 cümlelik Listen and Repeat ve 4 soruluk Interview prova setleri, 45 saniyelik cevap yapısı, ifade bankası, 12 telaffuz mikro dersi, kayıt–model karşılaştırması, dikte ile kelime kontrolü ve transkript istemi. |
| Teslim edilen v0.3 | Aşağıda "sonraki sürüm" veya "ileride" denen dört madde uygulandı: uygulama içinde ETS deneme sonucu kaydı, yenileme bildirimi (etkin oturum önce kaydedilir), yedek hatırlatması ve gelişmiş ses ayarı. Ayrıca hata defteri (yanlış sorunun farklı günde tekrarı), tekrar çözümün bağımsız doğruluktan ayrılması ve kayıtlı verinin toleranslı yüklenmesi eklendi. Ayrıntı: [DOGRULAMA.md](DOGRULAMA.md). |
| Sonraki odak | Yeterli sayıda yeni soruyla görev bazlı ölçüm, öğrenme/prova ayrımı, hata etiketleri, yazma ve konuşma için daha somut geri bildirim. İçeriği ilk denemede görülen açıklar üzerinden genişlet. |
| İhtiyaca bağlı | Koyu tema, gelişmiş ses/kurulum ayarları, yedek hatırlatması, yerel içerik işaretleme, cihazlar arası eşitleme ve otomatik konuşma/yazma değerlendirmesi. Her biri gözlenen ihtiyaçla öncelik kazanır. |

Arayüz ve açıklamalar Türkçe, sınav görevleri ve örnekler İngilizce. A1–C2 destek içeriği kilitsiz. Düzey etiketi, çalışmanın tasarım zorluğunu gösterir. Kullanıcı her beceriye farklı düzeyden girebilir. Hesap, ödeme, çalışma serisi cezası ve sosyal sıralama kapsam dışı.

## Güncel TOEFL iBT

21 Ocak 2026 sonrası sürüm. Sınav bölüm sırası aşağıdaki gibidir.

| Bölüm | Görevler | ETS tablosundaki madde / yaklaşık temel süre |
|---|---|---|
| Reading | Complete the Words, Read in Daily Life, Read an Academic Passage | 50 / 30 dk |
| Listening | Listen and Choose a Response, Listen to a Conversation, Listen to an Announcement, Listen to an Academic Talk | 47 / 29 dk |
| Writing | Build a Sentence, Write an Email, Write for an Academic Discussion | 12 / 23 dk |
| Speaking | Listen and Repeat, Take an Interview | 11 / 8 dk |

Reading ve Listening iki aşamalı adaptiftir. Writing ve Speaking doğrusal ilerler. ETS, soru ve sürelerin değişebileceğini belirtir ve bütün oturum için yaklaşık iki saat ayırmayı önerir. Rapor dört bölüm ve genel sonuç için yarım adımlı 1–6 ölçeğini kullanır. ETS geçiş döneminde karşılaştırılabilir bir 0–120 **toplam** da raporlar. Resmî yapı ve erişim kayıtları [SOURCES.md](SOURCES.md) dosyasındadır. [ETS sınav yapısı](https://www.ets.org/toefl/test-takers/ibt/about/content.html?version=after-jan-2026), [ETS puan açıklaması](https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html).

## Oturum, öğretim ve ölçüm

- **15 dakika** için bir kısa tekrar ve tek öğretim odağı. **30–60 dakika** için birbirinden bağımsız görev blokları, bir üretim görevi ve hata incelemesi. **Serbest** kullanımda kullanıcı bir görevi bitirip yenisini seçebilir. Süre öneridir. Görev sayacı pratik aracıdır ve kullanıcıyı oturumdan çıkarmaz.
- Bugün ekranı önce devam noktasını, sonra önerilen tek adımı gösterir. Oturumu yeniden oluşturmak mevcut taslağı etkiliyorsa, işlem öncesi bu etki açıkça belirtilir. Kullanıcı önerilen beceriyi veya zorluğu değiştirebilir.
- Öğretim döngüsü kısa açıklama, aktif cevap, gerekçe, hata düzeltme ve yeni bağlamda yeniden denemedir. Bir denemede doğru cevap vermek ustalık sayılmaz. İlerleme için farklı günde ve yeni içerikte yapılan çalışmalar ayrıca görünür.
- Kelime tekrarında mevcut dört yanıt korunur. V0.1'de “hatırlamadım” 10 dakika sonraya, “zorlandım” en az 1 gün sonraya planlanır. Normal ilk iki aralık 1 ve 3 gün, kolay ilk iki aralık 3 ve 7 gündür. Sonraki aralıklar geçmişe göre uzar. Yeni kart miktarını tekrarlara yetişebildiğin kadar artır. Ayrı bir kutu algoritması veya günlük zorunlu kota tanımlanmıyor.
- Öneriler önce vadesi gelen tekrarları görünür kılar. Görev önerisinde güncel hatalar, az çalışılan beceri ve yeni sorular öncelik kazanır. V0.1 tekrar ve pratik setlerini ayrı başlatır. Haftanın odağını öneriye katmak sonraki geliştirmedir. Her hafta dört beceriyle temas hedeflenir.
- Cevap anahtarlı maddelerde bağımsız doğruluk, yardımlı çalışmalar ve daha önce çözülmüş maddeler ayırt edilir. Gösterimde benzersiz soru veya set sayısı, zor/kolay bağlam ve çalışma koşulu yer alır. Bir cloze metninin on boşluğu, on bağımsız okuma örneği sayılmaz. Az veri veya sadece tekrar varsa “ilk gözlem” gösterilir. Writing'de cümle dizme doğruluğu ile serbest metin değerlendirmesi ayrı kalır. Speaking öz değerlendirmesi anlaşılabilirlik, görevi karşılama ve geliştirme üzerinden ayrı tutulur. Eşikler ancak ölçüm verisi biriktikçe ayarlanır.
- ETS pratik sonucunu kaydetme eklenirse kaynak ve form, tarih, ilk/tekrar çözüm, bölüm, süre koşulu ve değer türü tutulur. Ham doğru/toplam yalnız karşılaştırılabilir koşullarda anlamlıdır. ETS'nin sağladığı pratik tahmini varsa kaynağıyla aynen kaydedilir. Uygulama gözlemlerinden TOEFL bandı veya resmî CEFR seviyesi üretilmez.
- **Öğrenme modu** hız ayarı, yeniden dinleme, transkript ve açıklama sunar. **Prova modu**, sonraki aşamada, sesin tek oynatımı, görev sırasına uygun soru gösterimi ve sonradan açılan metin/geri bildirim sağlar. Metne bakarak kurtarılan veya kesilen deneme, yardımlı/yarım olarak etiketlenir. Öğretici sayaç ve tekil görev provası dijital adaptif sınavın yerini tutmaz.
- Yazma ve konuşmada önce İngilizce cevabı üret, sonra örneği ve kontrol listesini incele. Daha ayrıntılı geri bildirim için [CONTENT-SPEC.md](CONTENT-SPEC.md) içindeki isteğe bağlı istem manuel kullanılabilir. Panoya kopyalama düğmesi öneridir. Kullanıcı kendi yanıtını isterse seçtiği hizmette paylaşır. Ses değerlendirilmiyorsa telaffuz ve akıcılık için tahmin yapılmaz.

## Dil bilgisi öğretimi

Taahhüt: Luma, isim öbeklerinden (isim tamlamaları) koşul cümlelerine kadar TOEFL için gereken çekirdek İngilizce dil bilgisini A1–C2 aralığında Türkçe anlatır. Kapsam [GRAMMAR.md](GRAMMAR.md)'deki 11 modül ve 67 derstir. "İngilizcenin bütün dil bilgisi" iddiası yerine bu tanımlı liste taahhüt edilir; çalışırken eksik görülen konu yeni ders olarak eklenir.

- Her dersin iki katmanı vardır. **Özet** tek ekranlık hatırlatmadır. **Tam anlatım** telefonda 3–5 kısa ekrana bölünür ve ekran ortasında bırakılıp aynı yerden devam edilebilir. Şablon [CONTENT-SPEC.md](CONTENT-SPEC.md) içindedir: işlev, yapı, anlam ve kullanım, karışan yapıyla karşılaştırma, sık hata, en az dört özgün ve sesli dinlenebilir örnek, tanıma → dönüştürme → üretim sırasıyla alıştırma, sınav bağlantısı ve konuşma kalıbı.
- Dersler kilitsizdir; modül sırası öneridir. Her modül isteğe bağlı 6–8 soruluk bir taramayla başlayabilir; tarama seviye veya puan üretmez, yalnız ilgili derslere yönlendirir.
- Görev maddesindeki dil bilgisi etiketi ders koduna eşlenir. Yanlış cevaptan sonra sonuç ekranında ilgili ders önerilir.
- Ders sonu yanlışları tekrar kuyruğuna girer ve farklı günde yeni cümlelerle yeniden sorulur. Dersi okumak veya bir kez doğru cevaplamak "öğrenildi" sayılmaz.
- V0.1'deki 36 mikro ders haritaya eşlenir, kimlikleri korunur ve Özet katmanı olarak kullanılır; Tam anlatım eklenir.
- Üretim sırası: önce öncelikli 20 ders, sonra başlangıç ölçümünde ve görevlerde görülen hatalara bağlı dersler, en son kalanlar. 67 dersin hepsini sekiz haftada bitirmek hedef değildir; kalanlar başvuru kaynağı olarak hazır durur.

## Konuşma desteği

Taahhüt: Luma, Speaking bölümünde üç şekilde yardım eder: görev provası, konuşma öğretimi ve kendi konuşmanı inceleme araçları. Uygulama telaffuz puanı veya Speaking bandı üretmez.

- **Görev provası.** Listen and Repeat 7 cümlelik, Interview 4 soruluk setlerle çalışılır. Prova modunda ETS süreleri (cümle başına 8–12 saniye, cevap başına 45 saniye) uygulanır, ses bir kez çalar ve metin cevaptan sonra açılır. Öğrenme modunda yavaş dinleme, tekrar dinleme ve metni açma serbesttir. V0.1'deki tek cümlelik tekrar ve tek mülakat sorusu bu setlerin ilk parçası olarak korunur.
- **Mülakat cevap yapısı.** 45 saniyelik plan: doğrudan cevap → neden → kişisel örnek veya deneyim → kısa kapanış. Soru türüne göre (deneyim, tercih, görüş, varsayım) kalıp ve ilgili dil bilgisi dersi bağlantısı verilir.
- **İfade bankası.** Görüş bildirme, örnek verme, neden-sonuç, karşılaştırma, doğal zaman kazanma ve toparlama ifadeleri kelime tekrar sistemine kart olarak girer ve cümle içinde sesli kullanma alıştırmasıyla çalışılır.
- **Telaffuz mikro dersleri.** Türkçe konuşanların sık zorlandığı sesler, vurgu, bağlama ve tonlama için 12 ders. Her derste açıklama, minimal çiftler ve TTS ile dinle → kaydet → karşılaştır adımı vardır.
- **Listen and Repeat tekniği.** Cümleyi anlam öbeklerine bölme, vurgu ve tonlamayı taklit, kısa işlev kelimelerini (a, the, to, -s, -ed) atlamama ve gölgeleme (shadowing).
- **Kendi konuşmanı inceleme.** (1) Kendi kaydını model sesle art arda dinleme. (2) Dikte ile kelime kontrolü: kullanıcı isterse Listen and Repeat cümlesini iPhone klavyesinin dikte özelliğiyle bir metin alanına söyler; uygulama hedef cümleyle kelime kelime karşılaştırıp eksik, eklenen ve değişen kelimeleri gösterir. Sonuç "dikte eşleşmesi" olarak ayrı etiketlenir; dikte tanıma hatası telaffuz hatası sayılmaz. (3) Mülakat transkripti: cevap dikteyle metne çevrilir ve CONTENT-SPEC.md'deki konuşma istemiyle sözcük, dil bilgisi ve fikir düzeni için dış geri bildirim alınabilir. Telaffuz ve tempo transkriptten değerlendirilmez.
- **İsteğe bağlı dış prova.** Sesli bir asistanla (ör. Claude'un sesli modu), uygulamanın kopyaladığı mülakat provası istemiyle dört soruluk prova yapılabilir. Bu bir konuşma pratiği ve içerik geri bildirimidir, sınav simülasyonu veya telaffuz puanı değildir. Telaffuz için en güvenilir dış kontrol, ayda bir–iki kez bir insan dinleyicinin (öğretmen, arkadaş) kaydı yorumlamasıdır.
- **Ölçüm.** Speaking'de öz değerlendirme, dikte eşleşmesi ve dış geri bildirim ayrı tutulur ve tek bir sayıda birleştirilmez.
- **Rutin önerisi.** Kısa günlerde 5 dakika tekrar veya gölgeleme; uzun günlerde bir mülakat seti ve kendi kaydını inceleme. Haftada en az üç konuşma teması.

## Sekiz haftalık çalışma rotası

16 Kasım 2026 başlangıcı ve 15 Ocak 2027 hedefi örneğidir. Kaydırılabilir. Kısa günlerde telefondan tek görev ve kelime tekrarı, uzun günlerde iki beceri, yanıt üretimi ve hata incelemesi uygundur. Kaçırılan işler borç olarak birikmez. Ana açığa öncelik verirken diğer becerilerde kısa tekrar sürer. Her hafta en az üç kısa konuşma teması ve görevlerdeki hatalardan gelen bir-iki dil bilgisi dersi rotaya eklenir; 2–3. haftalarda öncelikli dil bilgisi derslerinden başlamak uygundur.

| Zaman | Çalışma |
|---|---|
| 1. hafta · 16–22 Kasım | Yeni görevleri kısaca tanı. Daha önce çözmediğin örneklerle dört beceriden ayrı başlangıç verisi al. Bilgisayarda güncel ETS dijital pratiğini kullanabiliyorsan ilk ölçümü orada yap. Müsait değilsen başlangıç örneklerini ayrı oturumlara böl ve koşulu kaydet. |
| 2–3. haftalar · 23 Kasım–6 Aralık | Başlangıçta görülen bir veya iki darboğaza odaklan. Dolaylı sorular, cümle kurma, kelime biçimleri, ana fikir ve çıkarım iyi adaylar. |
| 4. hafta · 7–13 Aralık | Yeni bir form veya daha önce çözmediğin bölümlerle ara kontrol. PDF seçildiyse eşleşen ETS sesini kullan. Hata türlerini ve süreyi ilk haftayla koşulları dikkate alarak değerlendir. |
| 5–6. haftalar · 14–27 Aralık | Yazma ve konuşmada kısa ama sık üretim. Ardından süreli görev kümeleri ve yeni bağlamda hata doğrulama. |
| 7. hafta · 28 Aralık–3 Ocak | Daha önce görmediğin güncel ETS dijital örneğiyle bilgisayar, klavye ve kulaklıkta kesintisiz prova. Yalnız PDF varsa sonucu kâğıt uyarlaması olarak kaydet. |
| 8. hafta ve tampon · 4–14 Ocak | Tekrarlayan hataları, sınav yönergelerini ve süre yönetimini gözden geçir. Son günlerde yeni kart ve konu yükünü azalt. |

Form ve soruları tekrar çözmek faydalıdır. İlerleme ölçümü için ilk defa karşılaşılan örnekleri sakla. Dijital ve PDF sürümlerinde içerik örtüşebileceği için kaynak adından bağımsızlık varsayma. [ETS hazırlık kaynakları](https://www.ets.org/toefl/test-takers/ibt/prepare.html).

## Teknik sözleşme

- **Mevcut yığın.** HTML/CSS ve ES modules, Node.js 22+ yerel sunucu ve testler için. `npm run build` mevcut dosyaları `dist/` içine kopyalayan statik paketleme adımıdır. Kaynak dosyaları `app.js`, `core.js`, `storage.js`, `data/content.js`, `data/library.js`, `sw.js` ve manifesttir. Dosyaları ancak içerik hacmi veya bakım maliyeti bunu gerektirirse böl. Tam anlatımlı dil bilgisi dersleri `data/library.js`'yi belirgin büyütürse dersler ayrı bir veri dosyasına alınabilir; kimlikler korunur. `npm test` mevcut içerik kontrollerini de çalıştırır.
- **Kayıt.** Metin durumu `schemaVersion: 1` ile yerel depoda, ses Blob'ları IndexedDB'de. Tamamlanmış yanıtın sabit deneme kimliği tekrar kayıtta çift sayılmayı engeller. Taslak, set ve kelime kuyruğu yeniden açmada korunur. Yeni alanlar geriye uyumlu olmalı. Şema değişikliği eski bir gerçek yedekle geri yükleme testi gerektirir. Çoklu sekme eşzamanlılığı sorun olursa aynı anda yazan sekmeleri yönet. Yerel kayıt hatasını başarı olarak gösterme.
- **Çevrimdışı güncelleme.** V0.1 çekirdek varlıkları sürümlü önbelleğe alır. Yayında varlıklar değiştiğinde `sw.js` önbellek sürümü de artırılır. Yeni worker, önceki worker'ın kontrol ettiği sayfalar kapanana kadar bekleyebilir. İleride yenileme bildirimi eklenirse etkin oturum önce kaydedilir ve birbiriyle uyumlu HTML, JS ve içerik birlikte yüklenir. Her dosya için ağ önceliği, tek başına sürüm tutarlılığı sağlamaz.
- **Yedek.** Mevcut JSON `schemaVersion: 1` kök durumunu taşır. İçe alırken 20 MB dosya sınırı ve şema kontrolü vardır. Bu sınır, tarayıcı depolama kotasının ölçüsü değildir. Uygulama doğrulanmış değişiklik için onay ister. İçe aktarma öncesi mevcut yedek indirilir. Yerel geri alma ve haftalık hatırlatma ayrı geliştirme önerileridir. Ses dosyaları ayrıca dışa aktarılır. Uzun süreli veri büyümesi ölçülürse iş yükü IndexedDB'ye taşınabilir.
- **iPhone.** HTTPS, Safari'den ana ekrana kurulum, aynı giriş biçiminden devam ve düzenli yedek. TTS kullanıcı eylemiyle başlatılır. İngilizce ses ve çevrimdışı kullanılabilirlik cihazda denenir. Mikrofonda desteklenen kayıt biçimi çalışma zamanında seçilir. İzin reddinde notlu veya sessiz çalışma kullanılabilir. Dikte, iOS klavyesinin özelliğidir; uygulama yalnız metin alanı sağlar ve dikte için ayrıca mikrofon izni istemez. Dikte alanlarında otomatik düzeltme kapalı tutulur. Ana ekran web uygulaması için WebKit'in depolama politikası ayrıntıları [SOURCES.md](SOURCES.md) dosyasındadır. Kalıcılık isteği bir sonraki sürümde gerekirse eklenir ve sonucu saklama garantisi olarak gösterilmez.
- **Yayın ve gizlilik.** GitHub yüklemesi kullanıcıya ait. GitHub Pages depo görünürlüğü ve yayın erişimini ayrı yönetir. Kişisel yanıt, ses, yedek ve anahtarlar depoya konmaz. Proje verisi yereldir. Tam erişim kısıtı veya otomatik eşitleme ihtiyacı ortaya çıkarsa kontrollü barındırma ayrıca değerlendirilir.
- **Arayüz kalitesi.** Klavye açıldığında eylemler erişilebilir kalır. Form alanları ve dokunma hedefleri iPhone'da sınanır. Görünür odak, ekran okuyucu etiketleri, metinle durum belirtme, azaltılmış hareket ve yeterli renk kontrastı kabul ölçütleridir. Beceri renkleri sabit tutulabilir. Koyu tema ancak işlevi ve kontrastı ayrı doğrulanırsa eklenir.

## Kabul ve test

1. 320 ve 390 px görünümde taşma olmaz. Fiziksel iPhone'da ana ekrana kurulum, klavye, izin reddi, kayıt, geri dinleme, kilit ve arka plan davranışı denenir.
2. Kısa oturum uzun çalışmaya dönüştürülebilir. Son adımdan ve yarım metinden yenileme sonrası devam edilir. Aynı cevap iki kez sayılmaz.
3. İlk önbelleklemeden sonra metin dersleri açılır. Yeni sürümle eski dersin karışmadığı, iki sürüm ve yarım oturumla denenir.
4. Yedek indirilebilir ve uyumlu bir yedek yeniden yüklenebilir. Hatalı veya kotayı aşan içe aktarmada mevcut veri korunur. Ses dahil olmayan kapsam kullanıcıya gösterilir.
5. Bağımsız doğruluk, yardımlı çalışma, öz değerlendirme ve dış deneme sonuçları ayrı gösterilir. Henüz yapılmamış tanılama özellikleri kabul edilmiş gibi işaretlenmez.
6. On iki görev türü açılır. Yeni soru kümeleri [CONTENT-SPEC.md](CONTENT-SPEC.md) kurallarına göre doğrulanır. Test, cihaz ve içerik inceleme durumu ayrı kaydedilir.
7. Dil bilgisi: GRAMMAR.md'deki yayımlanmış her ders Özet ve Tam anlatım olarak açılır; Tam anlatım şablonun bütün parçalarını içerir (içerik testiyle kontrol edilir); ders ortasında bırakılıp aynı ekrandan devam edilir; yanlış görev maddesinden ilgili derse geçiş çalışır. Henüz yazılmamış dersler "planlandı" olarak gösterilir.
8. Konuşma: 7 cümlelik ve 4 soruluk prova setleri ETS sürelerine göre çalışır; prova modunda ses bir kez çalar; kayıt ile model ses art arda dinlenir; dikte karşılaştırması eksik, eklenen ve değişen kelimeleri doğru gösterir (birim test: büyük-küçük harf, noktalama, kısaltma ve sayı eşdeğerleri); mikrofon izni reddedildiğinde dikte ve metinle çalışma yolu açık kalır.

Önceki teslimde 28 otomatik test, mobil ekran incelemesi, tarayıcıda devam/yedek geri yükleme ve sunucu kapalıyken metin dersi doğrulandı. Fiziksel iPhone mikrofonu ve Safari/ana ekran kurulum testi açık durumdadır.