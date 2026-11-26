# Luma — kişisel çalışma alanı (v0.8)

iPhone öncelikli, çevrimdışı metin çalışmasını destekleyen, tek kullanıcılı TOEFL® hazırlık PWA'sı. Hedef tarih varsayılan olarak 15 Ocak 2027; Ayarlar'dan değişir. ETS ile bağlantılı veya ETS tarafından onaylanmış değildir.

## Çalıştır

Node.js 22 veya üstü yeterli. `npm install` gerekmez; üçüncü taraf paket ve API anahtarı yoktur.

```sh
npm run dev
```

Tarayıcıda http://localhost:4173 adresini aç. `index.html` dosyasına çift tıklamak ES modules, mikrofon ve service worker için uygun değildir. Telefonda bilgisayarının localhost adresi çalışmaz.

Yerel geliştirmede eski dosyaların önbellekte kalmaması için yeni service worker kaydı varsayılan olarak kapalıdır. Çevrimdışı testi için son sürüm hazır olduğunda `http://127.0.0.1:4173/?offline=1` açılır. Yayımlanan HTTPS sitede çevrimdışı hazırlık otomatik çalışır.

```sh
npm test
npm run check
npm run build
```

`dist/` sadece uygulamanın statik dosyalarını içerir. `icons/` çıktıları repoya dahildir; yeniden üretmek için `node scripts/icons.mjs`.

## iPhone'a ekle

1. `dist/` içeriğini HTTPS destekli statik barındırmaya yükle.
2. iPhone Safari'de yayımlanan adresi aç; ilk açılış çevrimiçi olmalı.
3. Paylaş → Ana Ekrana Ekle.
4. Çalışmalarına aynı giriş biçiminden devam et. Safari ile ana ekran uygulaması depoları farklılaşabilir.

Metinler, kelimeler, gramer ve ilerleme çevrimdışı kullanılabilir. İngilizce cihaz sesi/TTS'nin çevrimdışı çalışması cihaz ses paketine bağlıdır. Mikrofon HTTPS ve kullanıcı izni ister. Gerçek iPhone'da kayıt, kilit ekranı ve çevrimdışı ses ayrıca test edilmelidir.

## GitHub'a kendin yükle

Bu klasör kaynak köküdür. Henüz uzak repoya push veya deploy yapılmadı.

```sh
git init
git add .
git commit -m "Add personal study PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Repo adresindeki yer tutucuları kendi adresinle değiştir. `.gitignore` ilerleme yedeklerini, ses klasörünü ve `.env` dosyalarını dışlar. Kişisel veri elle kaynak dosyalarına eklenmemelidir.

GitHub Pages için `npm run build` çıktısını bir Pages dağıtımıyla yayımla veya depo kökünden statik yayın yap. Tüm uygulama bağlantıları göreli olduğu için `/repo-adi/` alt yolu desteklenir. Hash tabanlı sayfa yönlendirmesi sunucu rewrite kuralı istemez. Repository'nin private olması Pages sitesinin de private olduğu anlamına gelmez. Gerçek erişim kısıtı istiyorsan özel barındırma/auth eklenmelidir.

Bu bağımlılıksız proje için en kısa Pages kurulumu: kaynak kökünü pushladıktan sonra GitHub deposunda **Settings → Pages → Deploy from a branch → main → /(root)** seç. Kök dizindeki `.nojekyll`, dosyaların olduğu gibi yayımlanmasını sağlar. Kaynak dosyaları ve site public olabilir; kişisel ilerleme bunlarda bulunmaz. Kullanılabilir yayın seçenekleri hesabının planına bağlıdır.

## Yayımla ve güncelle (GitHub Pages)

```sh
npm test          # 97 test; yayın damgası eskiyse burada uyarır
npm run release   # önbellek damgasını yeniler ve dist/ üretir
git add -A && git commit -m "…" && git push
```

`npm run release`, service worker'a önbelleğe alınan dosyaların parmak izini (`BUILD`) yazar. İçerik veya kod değiştiğinde damga değişir; telefon yeni sürümü arka planda indirir ve üstte **Güncelle** bildirimi gösterir. Bildirime dokununca çalışman kaydedilir ve HTML, JS ve içerik birlikte yenilenir. Damgayı yenilemeden pushlarsan telefon eski sürümde kalır; `npm test` bu durumu yakalar. Ayarlar → **Güncellemeyi denetle** ile elle de bakabilirsin.

## v0.8'de yeni: günlük antrenman, beş sekme, yazma döngüsü

- **Antrenman (ana ekran):** her gün açılan tek liste ve **Başla** düğmesi. Bütün içerik (kelimeler, öbek fiiller, kalıp/bağlaç/ifadeler, 83 gramer dersi, Reading, Listening, Writing, Speaking görevleri ve prova setleri) bir bitiş tarihine kadar günlere bölünür: her havuzun kalanı kalan günlere bölünür ve yukarı yuvarlanır (`dailyQuota`), böylece bitiş tarihinde her şey bir kez çalışılmış olur; atlanan günün payı kalan günlere dağılır. Bitiş tarihi Ayarlar'dan değişir (varsayılan: sınavdan 31 gün önce, 15 Aralık). Listede ayrıca zamanı gelen kart tekrarı, hata tekrarı ve gramer tekrarı var. Bir adım bitince “Antrenmana devam” sıradakini açar; hepsi bitince gün tamamlanır.
- **Sekmeler:** Antrenman · Reading · Listening · Speaking · Writing · Gramer. Her beceri sekmesinde bölümün puanlanması, bütün set, her görevin puanlama rehberi (ölçülen, puanlama, yap / kaçın, süre; Email, Discussion, Interview ve Listen and Repeat için 0–5 bant özetleri, `data/scoring.js`) ve o beceriye ait araçlar. Rotam sol menüde ve Antrenman ekranının altında.
- **Yazma döngüsü (Write an Email, Academic Discussion):** yaz (7/10 dk sayaç) → **1 Değerlendir** (görev ve içerik, sosyal kurallar / tartışmaya katkı, çeşitlilik, doğruluk; görev maddelerini işaretleme; puan bantları) → **2 Hatalar** (kırmızı yanlış → yeşil doğru, en önemli üçü önce) → **3 Geliştir** (kesin düzeltmeler uygulanmış metin, yan yana karşılaştırma, AI istemi) → **4 Tekrar** (geliştirilmiş metnin her ikinci cümlesi boşluk; yazıp karşılaştır). Motor `writing.js`: yalnız emin olduğu hataları düzeltir (yazım, I, büyük harf, look forward to hearing, I am agree, a/an, although…but, since → for, unvan ve kapanış), virgülle bağlanmış cümle ve uzun cümleyi uyarır.
- **Kelimeler:** deste 2001 kart. Kullanıcının verdiği 84 akademik kelimenin 72'si vardı, 12'si eklendi. Academic Word List'in 570 ailesinin eksik olanları eklendi (A1–A2 düzeyindeki 41 çok temel aile hariç) ve AWL kartları işaretlendi (rozet, süzgeç, deste). TOEFL metinlerinde sık geçen 91 kelime eklendi (thrive, fragile, sediment …). 52 kalıp (feel like, be interested in, take a break …) ve 57 bağlaç (firstly, however, although …) öbek fiiller gibi kart oldu; bağlaç sorularında şıklar işleve göre ayrılır. Öbek fiil kartının arkasında parçacık ipucu ve aynı parçacıklı ifadeler (up → give up, use up …).
- **Gramer programı:** Gramer sekmesinin başında A1 → C2 sıralı program (90 ders, seviye seviye ilerleme, “Sıradaki ders” düğmesi; Antrenman da aynı sırayla ders verir) ve **başvuru tabloları** (`data/grammar-ref.js`): bütün zamanlar (13 zaman: yapı, kullanım, işaret kelimeleri), her zamanın edilgeni, bütün koşul cümleleri, anlamına göre modallar, dolaylı anlatımda kayma, soru kurma ve söz dizimi. Her tablo onu öğreten derslere, her ders ilgili tabloya bağlanır.
- **Gramer (90 ders, A1→C2):** 18 yeni ders: would'un bütün kullanımları, used to / be used to / get used to, just-already-yet, be able to / managed to, subjunctive, make/do – say/tell, get'in bütün kullanımları (get stressed, get lost, get back …), -ever kelimeleri, like/as, emir ve let's, So do I, belirsiz zamirler, kelime türetme, yön edatları, who/whom/whose/which/that farkları, that'in bütün kullanımları, sık karıştırılan kelimeler (affect/effect, its/it's, than/then …) ve düzensiz fiiller (112 fiil, V1–V2–V3, kalıplara göre; ayrı V2/V3 alıştırma ekranı `#verbs`). Mevcut derslere kullanım tabloları: modal + have + V3 (could/should/would/must/might have done), must / have to / supposed to / had better, very / so / too / enough (too long – so long, very big – so big), a few / a little / few / little. Tam anlatımı olmayan her derse 5–8 alıştırma (368 madde); alıştırmalar bitince ders tamamlanır, yanlışlar farklı günde tekrar gelir. “Fiil aileleri” (get, take, come, go …) destedeki bütün ifadeleriyle çalışılabilir.
- **Gramer taraması (v0.8 son):** dersler 184 maddelik A1–C2 kontrol listesine göre tarandı; eksik çıkanlar eklendi: soru kelimeleri ve ünlem (G1.8), derece zarfları quite / rather / absolutely (G8.5), basit–bileşik–karmaşık cümle (G10.10); G6.1'e bütün -ing / to fiil listeleri, it + sıfat + for/of sb + to, see sb do/doing, be made to; G3.5'e future in the past (was going to, was about to); G7.7'ye both … and / either … or / neither … nor / as if; G8.1'e less / fewer / twice as … as; G10.5'e no sooner / hardly / not until; G5.5'e supposing / what if / but for; G9.3'e apart from / except / regardless of; G9.1'e tarih, saat, yıl, yüzde ve kesir okuma; G2.6'ya zamir tablosu, each other, a friend of mine. Tablolar Tam anlatım derslerinde de görünür.
- **Günlük alternatifler (`data/everyday.js`):** “bunu demek yerine şunu de” — 33 temel ifade (I want, I think, I like, I don't know, Can you …?, Let's, Yes, No, Thank you, Sorry, I agree, What?, How are you?, very good, very important, I'm tired, I'm busy, It's difficult, Maybe, because, also …) için 180 doğal karşılık; her birinin tonu (kibar, resmî, günlük, samimi, güçlü, yumuşak), Türkçesi ve örneği var. Kelimeler → **Günlük** sekmesinde listelenir, kart olarak çalışılır (Türkçe → hangi İngilizce?), kartın arkasında aynı yerde kullanılabilecek diğer seçenekler görünür ve Antrenman'ın kalıp adımına girer.
- **Kart taraması:** 2001 kartta tekrar eden kart, geçersiz konu, eksik alan yok. Türkçesi aynı olan kartlar (source / resource, effect / impact …) kart arkasında “Benzer anlamlı kartlar” olarak gösterilir.
- **Araç kutuları:** Yazma (e-posta ve tartışma için adım adım kalıplar, işlevine göre bağlaçlar, rubrik ölçütleri) ve Konuşma (başlarken, zaman kazanma, araya sıkıştır, gerekçe ve örnek, koşul kalıpları, toparlama, kendini düzeltme; pratik önerileri).

## v0.7'de yeni: öbek fiiller (phrasal verbs)

Kullanıcının `phrasal-verbs-tek-dosya.json` dosyasındaki 554 ifade ve 704 anlam ayrı bir bölüm olarak değil, mevcut yapının içine kondu (`data/phrasal.js`):
- **Kelimeler destesi:** her ifade bir kart; dosyadaki öncelik seviyeye çevrildi (1 → B1, 2 → B2, 3 → C1; editoryal eşleme, CEFR değil) ve kartlar seviye destelerine eşit aralıklarla karıştırıldı. Destede zaten olan 17 ifade (carry out, rely on…) aynı kimlikle kaldı ve ayrıntıları eklendi. Deste 1657 kart. Şıklarda öbek fiile öbek fiil seçenekleri gelir; kartın arkasında her anlamın kalıbı, nesne yeri (ayrılabilir / sabit / nesnesiz), İngilizce ve Türkçe örneği ve notu, G6.5 dersine bağlantı. Kelime listesinde “Öbek fiil” süzgeci ve konu destesi.
- **Dil bilgisi G6.5:** Özet'in yanına Tam anlatım: yapı tablosu, ayrılabilir–sabit karşılaştırması, 40 parçacığın çağrışım tablosu, sık hatalar, 7 alıştırma ve 3 tekrar maddesi; son ekrandan öbek fiil kartlarına geçiş.

## v0.6'da yeni

- **Kelimeler B1–C2:** A1–A2 kartları çalışma destesinden çıkarıldı. Deste 1120 kelime (B1 280 · B2 392 · C1 301 · C2 147); sınav metinlerinin konularına göre 10 konu destesi: biyoloji, yer bilimi, astronomi, tarih ve arkeoloji, psikoloji ve toplum, ekonomi, sanat ve dil, teknoloji, kampüs, akademik dil. Temel ifadeler de B1'e alındı.
- **Complete the Words atölyesi:** 8 → 24 metin (B1→C1), her boşluğun Türkçe anlamı. Üç mod: *Kolay* (kelimenin yarısından fazlası verilir), *Öğrenme* (gerçek format, boşluğa dokununca ipucu: tür → Türkçe anlam → harf harf), *Sınav* (ipucusuz; ölçüm bunu sayar). Sonuçta kelime tablosu ve boşluk türüne göre analiz (yapı kelimesi / ekli kelime / kök kelime) ve en zayıf türe göre öneri; Rotam'da bütün denemelerin tür dağılımı. “Nasıl çözülür?” rehberi: 5 adımlı yöntem, kısa kelime ipuçları, ek tablosu.
- **Speaking kalıpları:** Öğren sekmesinde puanlamada bakılanlar (ETS puanlama rehberinden özet), 45 saniyede 110+ kelime hız hedefi, 4 adımlı yapı (Cevap → Açıkla → Örnek → Sonuç), zaman kazandıran açılışlar, cevabı genişletmenin 3 yolu (örnek, karşı görüş, karışık duygular şablonu), tonlama ipuçları. 24 mülakat sorusunun örnek cevabı 110–131 kelimeye çıkarıldı ve adımlara göre renklendirildi; tekrar kullanılabilir kalıplar vurgulu. Transkript alanında canlı kelime sayacı. İfade bankasına 15 yüksek değerli kalıp eklendi (134).

## v0.5'te yeni (telefonda kullanım geri bildirimi)

- **Kelimeler:** 180 → **1019 kelime**, seviyelere göre (A1 91, A2 157, B1 217, B2 232, C1 203, C2 119). Ağırlık sınavda sık geçen kampüs ve akademik kelimelerde. Çalışma artık **dört şıklı**: İngilizce kelime, dört Türkçe seçenek (her birinde 1–3 anlam ve sözcük türü), anında doğru/yanlış, ✓/✗ sayaçları, örnek cümle ve “Öğrendim” işareti. Seviye kartlarında öğrenilen/toplam ilerleme görünür.
- **İfade bankası:** 48 → **119 ifade**, A1–C1 seviyelerine ayrıldı; üç yeni işlev (katılma ve karşı çıkma, ekleme ve sıralama, temkinli konuşma). Çalışma dört şıklı: Türkçe karşılık, dört İngilizce kalıp.
- **Tam setler:** İçerik düzeyi seçimi, 15/30/60 dakika önerisi ve görev sayacı anahtarı kaldırıldı. Her set (karışık, tek beceri veya tek görev türü) A1'den C2'ye bütün soruları sırayla verir; çözdüğün soru aynı sette tekrar gelmez, set kaldığın yerden devam eder. Hepsi çözülünce set “tekrar çözüm” olarak baştan açılır.
- **Complete the Words:** her kutuda eksik harf sayısı kadar çizgi; cevaptan sonra metin üzerinde doğru (yeşil) ve yanlış (kırmızı, doğrusuyla) kelimeler ve metnin Türkçesi.
- **Tasarım:** sade ve net görünüm: yuvarlak sistem yazı tipi, basıldığında içeri giren kalın düğmeler, tek ana renk, doğru/yanlış için yeşil/kırmızı. Logodaki yıldız iPhone'da yeşil emoji kutusu olarak görünüyordu; yerine düz bir nokta kondu.

## v0.4'te yeni: içerik

- **Alıştırma bankası 48 → 90** (tahmini 177 → 333 dakika): cevap anahtarlı sekiz görev türünün her birinde en az 8 soru (Build a Sentence 12), 7 e-posta ve 7 akademik tartışma görevi. Yeni Build a Sentence maddeleri tek bir yapıyı hedefler (dolaylı soru, Present Perfect, sıfat cümlesi, koşul, -ing kalıbı, edilgen, devrik yapı) ve yanlış cevapta ilgili derse yönlendirir.
- **Kelime kartı 126 → 180:** kampüs sözcükleri (semester, tuition, prerequisite…) ve akademik sözcükler (contribute, correlation, mitigate…).
- **Konuşma seti 8 → 12:** iki yeni Listen and Repeat seti (kütüphane tanıtımı, araştırma sunumu) ve iki yeni Interview seti (kampüste yaşam, teknoloji ve öğrenme).
- Yeni içerik de AI yardımıyla özgün yazıldı ve dil uzmanı incelemesi bekliyor. Yapısal testler her cloze'un ikinci sözcükleri boşalttığını ve her cümle dizme maddesinin tek doğru sırası olduğunu denetler.

## v0.3'te yeni

- **Veri güvenliği:** kayıtlı durumdaki tek bir geçersiz alan artık ilerlemeyi sıfırlamaz; geçerli bölümler korunur. Yazarken girilen metin (transkript, dış geri bildirim notu, dikte) yeniden çizimde ve sayfa yenilemede kaybolmaz. Telefonda yedek, paylaşım menüsüyle Dosyalar'a kaydedilir; 7 gündür yedek yoksa Bugün ekranı hatırlatır.
- **Deneme sonuçların (Rotam):** ETS denemelerini kaynak, bölüm, ilk/tekrar çözüm, koşul ve değer türüyle kaydet. Yalnız aynı koşuldaki ilk çözümler yan yana gösterilir; bant veya seviye üretilmez.
- **Hata defteri:** yanlış yapılan cevap anahtarlı sorular ertesi günden itibaren, doğrular uzayan aralıklarla geri gelir ve Bugün ekranında önerilir. Daha önce çözülmüş soru "tekrar çözüm" olarak ayrı sayılır ve bağımsız doğruluğu yükseltmez.
- **Ses:** Ayarlar'da İngilizce ses ve hız seçimi; çevrimdışı çalışan doğal sesler öne alınır. Prova modunda mikrofon izni set başlarken istenir, cevap penceresini yemez; ses çalınamazsa pencere açılmaz.
- **Oturum:** 30 ve 60 dakikalık oturumlar süreyi gerçekten doldurur (60 dk ≈ 21 görev).
- **Arayüz:** Konuşma sayfası üç sekme (Prova, Öğren, Araçlar); boş "Kaldığın yer" kartı gizlenir; dokunma hedefleri en az 44 px.
- **Ses kayıtları:** Ayarlar'da kayıt sayısı ve kapladığı alan; eski veya tüm kayıtları silme.

## v0.2'de yeni (v4 belgeleri)

- **Dil bilgisi haritası:** 11 modül, 69 ders (GRAMMAR.md'nin 67 dersi + v0.1 eşlemesinde açılan G3.10 ve G10.9). Her dersin **Özet** katmanı var; öncelikli 20 dersin **Tam anlatımı** 5 kısa ekranda: işlev ve yapı, kullanım ve karşılaştırma, sık hatalar ve dinlenebilir örnekler, tanıma → dönüştürme → üretim alıştırmaları, sınav bağlantısı + konuşma kalıbı + özet. Ders ortasında bırakılıp aynı ekrandan devam edilir.
- **Farklı gün tekrarı:** ders alıştırmasındaki yanlışlar ertesi günden itibaren yeni cümlelerle yeniden sorulur. Okumak veya bir kez doğru cevaplamak "öğrenildi" sayılmaz.
- **Modül taraması** (6–8 soru) ve **görev hatasından derse yönlendirme** (görev etiketi → ders kodu). Puan veya seviye üretilmez.
- **Konuşma bölümü:** 4 × 7 cümlelik Listen and Repeat ve 4 × 4 soruluk Interview seti; öğrenme modu (yavaş/öbek öbek dinleme, metni açma) ve prova modu (ses bir kez çalar, 8–12 sn / 45 sn pencere otomatik başlar, metin sonra açılır); kayıt + model art arda; iPhone diktesiyle kelime karşılaştırması ("dikte eşleşmesi"); transkript ve sesli prova istemleri; 45 saniyelik cevap yapısı; 12 telaffuz mikro dersi; 48 kayıtlık ifade bankası (kelime tekrarına kart olarak girer).
- **Bugün ekranı:** önce kaldığın yer, sonra tek önerilen adım (vadesi gelen tekrar → dil bilgisi tekrarı → haftalık konuşma → hatadan gelen ders → az çalışılan beceri); haftalık konuşma (en az 3 gün) ve dört beceri teması.
- **Rotam:** REQUIREMENTS'taki sekiz haftalık rota tarihleriyle; ölçümler ayrı ayrı (bağımsız doğruluk, yardımlı çalışma, öz değerlendirme, dikte eşleşmesi, dış geri bildirim notu, dil bilgisi ilk deneme / farklı gün doğruları).
- Yedek geriye uyumlu: v0.1 yedekleri yüklenir; yeni alanlar `schemaVersion: 1` içinde isteğe bağlıdır. Geri yüklemeden önce mevcut yedek otomatik indirilir.

## Bu sürümde çalışanlar

- Tam setler: karışık, tek beceri veya tek görev türü; A1'den C2'ye, kaldığın yerden.
- Yanıtlar ve yazma taslakları için yerel kayıt; seti bırakarak devam etme.
- Dört beceri ve yeni sınavın 12 görev türüne göre filtreleme.
- 90 özgün mikro alıştırma: 24 Reading, 32 Listening, 26 Writing, 8 Speaking (v0.2'de 48).
- 180 kelime/tamlama kartı (v0.2'de 126) ve 48 konuşma ifadesi; 69 dersin Özeti (36 v0.1 mikro dersi Özet olarak eşlendi); A1–C2 etiketleri.
- Aktif hatırlama, hatırlama zorluğuna göre tekrar tarihi.
- Görev sayacı, sesli okuma, mikrofon kaydı, geri dinleme/indirme.
- Writing/Speaking kontrol listeleri ve öz değerlendirme; örnek yaklaşımlar.
- Sekiz haftalık çalışma omurgası, beceri istatistikleri ve yanlışları yeniden çalışma.
- İlerleme JSON yedeği, doğrulanmış geri yükleme ve resmî kaynak bağlantıları.

## Bu sürümün sınırları

- Başlangıç bankasıdır; iki aylık tam müfredat veya eksiksiz A1–C2 kursu değildir. Bankanın genişletilmesi ve dil uzmanı kontrolü gerekir.
- Cevap anahtarlı alıştırmalarda doğruluk hesaplanır. Speaking/Writing serbest üretim otomatik puanlanmaz; öz değerlendirme saklanır. TOEFL puanı tahmini ve resmî CEFR seviye tespiti yoktur.
- R/L öneri seçimi öğretici bir yerel algoritmadır; ETS'nin çok aşamalı adaptif testi veya puanlama sistemi değildir.
- Sayaçlı mikro pratik tam sınav simülasyonu değildir. Gerçek sınavda burada sunulan duraklatma/yeniden dinleme olanakları geçerli olmayabilir. Son aşamada ETS kaynaklarıyla bilgisayarda çalışılmalıdır.
- Dinleme cihaz TTS'si kullanır; doğal konuşmacı çeşitliliği ve bağımsız sesli değerlendirme gelecek işlerdir.
- Bulut backend, otomatik cihaz eşitlemesi, bildirim servisi veya AI API aktif değildir. Dış geri bildirim istemleri yalnız panoya kopyalanır; uygulama veri göndermez.
- Uygulama telaffuz puanı vermez; dikte tanıma hatası telaffuz hatası sayılmaz. 49 dersin Tam anlatımı planlandı.
- JSON yedek ses dosyalarını içermez. Sesler Rotam veya ilgili soru ekranından ayrı indirilebilir.

## Veri ve dosya yapısı

`app.js` kabuk, yönlendirme ve genel ekranlar; `views/grammar.js` dil bilgisi haritası, ders okuyucu, tarama ve tekrar; `views/speaking.js` konuşma merkezi, set oynatıcı ve telaffuz dersleri; `media.js` cihaz TTS'si ve mikrofon kaydı; `ui.js` ortak görünüm yardımcıları; `core.js` saf öğrenme kuralları (puanlama, dikte karşılaştırması, tekrar planı, haftalık özet, öneri, yedek doğrulama); `storage.js` yerel kayıt/IndexedDB ses deposu. Veri: `data/content.js` sınav biçimi ve 48 alıştırma; `data/library.js` kelimeler ve 36 v0.1 mikro dersi; `data/grammar.js` 69 derslik harita, Özetler, taramalar ve etiket eşlemesi; `data/grammar-full-1.js` / `-2.js` öncelikli 20 dersin Tam anlatımı; `data/speaking.js` konuşma setleri, ifade bankası, telaffuz dersleri ve istemler. `sw.js` sürümlü uygulama önbelleğidir. Yeni kod/içerik yayımlarken service worker `VERSION` değerini artır. Devam eden oturuma zorla yeni sürüm uygulanmaz; tüm uygulama sekmelerini kapatıp yeniden açmak yeni sürümü etkinleştirir.

v0.8 dosyaları: `writing.js` yazma koçu (kesin düzeltmeler, dört ölçüt, Tekrar şablonu, fark); `views/skills.js` beceri sekmeleri ve araç kutuları; `views/writing.js` yazma döngüsü ekranı; `data/scoring.js` görev ve bölüm puanlama rehberleri; `data/toolkit.js` bağlaçlar, yazma kalıpları, konuşma araç kutusu; `data/expressions.js` 52 kalıp; `data/words-extra.js` AWL ve TOEFL ek kelimeleri; `data/awl.js` AWL başlık listesi; `data/grammar-extra.js` 18 yeni ders ve kullanım tabloları; `data/grammar-drills.js` Özet derslerin alıştırmaları; `data/irregular.js` düzensiz fiiller; `data/grammar-ref.js` başvuru tabloları. Günlük plan matematiği `core.js` içinde (`dailyQuota`, `planDaysLeft`, `spreadMerge`).

İlerleme `localStorage`, sesler `IndexedDB` içindedir. İki aylık kişisel metin verisi için bu basit yapı seçildi. Depolama sınırına gelindiğinde kayıt hatası gösterilir. Büyük soru bankası veya cihaz eşitlemesi için metin verisini de IndexedDB/sunucu veri tabanına taşı.

`docs/REQUIREMENTS.md`: ürün ve teknik gereksinimler (v4). `docs/CONTENT-SPEC.md`: içerik sözleşmesi ve ders şablonu. `docs/GRAMMAR.md`: 69 derslik harita ve v0.1 eşleme tablosu. `docs/SOURCES.md`: resmî bağlantılar ve içerik kullanım planı. `docs/REVIEW.md`: v3 → v4 değişiklikleri. v0.1 belgeleri `docs/arsiv-v0.1/` içinde. `THIRD_PARTY_NOTICES.md`: kaynak ve marka açıklaması. Test sonuçları ve gerçek cihaz sınırları `docs/DOGRULAMA.md` içinde.

## Yeni içerik ekle

İlgili data dosyasındaki şemaya uyarak benzersiz ID ekle. İçerik düzeyleri editoryaldir. Her cevap için Türkçe gerekçe yaz. `npm test` ile bankanın yapısını kontrol et ve cevapların pedagojik doğruluğunu ayrıca gözden geçir. ETS pasaj/soru/rubriklerini kopyalama. Kullanım hakkı doğrulanmış dış içerikte ayrı kaynak ve lisans kaydı tut.

Kod ve içerik için kullanıcı adına otomatik bir dağıtım lisansı seçilmemiştir. Public dağıtımdan önce kendi kod lisansını belirleyebilirsin. Üçüncü taraf referansları bu projenin kodu sayılmaz.
