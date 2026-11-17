# Kişisel TOEFL çalışma uygulaması — ürün ve teknik gereksinimler

Hazırlanma/doğrulama: 15 Kasım 2026. Kullanıcı: tek kişi. Birincil cihaz: iPhone. Hedef: Ocak 2027 ortasında TOEFL iBT'de mümkün olan en yüksek performans. Kesin sınav tarihi yok; planlama varsayımı 15 Ocak 2027, kullanıcı tarafından değiştirilebilir. Bu tarih bir sınav rezervasyonu değildir.

## 1. Ürün kararı

Mobil öncelikli, ana ekrana eklenebilir, yerel veri saklayan PWA. Türkçe arayüz/açıklamalar, İngilizce sorular/örnekler. Kayıt, ödeme, sosyal lig ve zorunlu günlük süre yok. İlerleme cezası yok. 15, 30, 60 dakika önerileri ve serbest çalışma vardır; süre seçimi otomatik oturum sonlandırmaz. Her soru sonrası ve yazma taslağında kayıt; istediğin an bırak/devam et.

Başarı hedefi dört becerideki darboğazları azaltmaktır. “İki ayda C2” veya belirli puan garantisi verilmez. A1–C2, erişilebilir içerik kapsamıdır; bütün konular sırayla bitirilmesi gereken bir başlangıç seviyesi değildir. CEFR etiketleri bu uygulamada editoryal zorluk göstergesidir; kısa testlerden resmî CEFR seviyesi çıkarılmaz.

## 2. Doğrulanan sınav formatı

Esas sürüm: TOEFL iBT, 21 Ocak 2026 ve sonrası. TOEFL ITP/Essentials kapsam dışıdır.

| Bölüm | Görevler | Yaklaşık temel madde/süre |
|---|---|---|
| Reading | Complete the Words; Read in Daily Life; Read an Academic Passage | 50 / 30 dk |
| Listening | Listen and Choose a Response; Listen to a Conversation; Listen to an Announcement; Listen to an Academic Talk | 47 / 29 dk |
| Writing | Build a Sentence; Write an Email; Write for an Academic Discussion | 12 / 23 dk |
| Speaking | Listen and Repeat; Take an Interview | 11 / 8 dk |

Reading ve Listening çok aşamalı adaptiftir. Yukarıdakiler yaklaşık temel değerlerdir; gerçek madde sayısı/süre değişebilir. ETS bütün sınav için yaklaşık iki saat ayırmayı belirtir. Bölüm sırası Reading → Listening → Writing → Speaking. Resmî kaynak: https://www.ets.org/toefl/test-takers/ibt/about/content.html?version=after-jan-2026

Writing: 10 cümle kurma, 1 e-posta (7 dk), 1 akademik tartışma (10 dk). Speaking: 7 tekrar cümlesi (cümle başına 8–12 sn), 4 mülakat sorusu (45 sn). Görev ayrıntıları/süreleri: https://www.ets.org/pdfs/toefl/toefl-ibt-test-overview.pdf ve https://www.ets.org/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf

Yeni puan ölçeği 1–6, yarım puan adımlıdır; dört bölüm ve toplam için kullanılır. İki yıllık geçiş döneminde karşılaştırılabilir 0–120 toplam da raporlanır. Uygulama doğruluk yüzdesini TOEFL puanına çevirmeyecek. Kaynak: https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html

## 3. Kullanıcı deneyimi ve ekranlar

- Bugün: kaldığın yer, tekrar kuyruğu, seçilen süre, önerilen beceri ve kalan gün.
- Çalış: dört beceri, 12 güncel görev tipi, süreli/serbest pratik, düzey filtresi.
- Kelimeler: akademik kelimeler, kampüs/günlük dil, tamlamalar; aktif hatırlama ve aralıklı tekrar.
- Dil bilgisi: A1–C2 konu kütüphanesi; Türkçe açıklama, özgün örnek, küçük alıştırma, sınav bağlantısı.
- Plan/ilerleme: sekiz haftalık odaklar, beceri başına gözlenen veri, yanlışlar ve kaynaklar.
- Ayarlar: hedef tarih/puan, veri yedekleme/geri yükleme, iPhone kurulum bilgisi.

Duolingo'dan alınabilecek davranışlar: tek net eylem, kısa görevler, hızlı geri bildirim, devam edebilme. Görsel tasarım daha sakin ve yetişkin odaklı olacaktır. Can/kalp, çalışma kilidi, sosyal sıralama ve seri kaybetme cezası yok.

Dokunma hedefi en az 44×44 CSS px; görünür klavye odağı; ekran okuyucu isimleri; yeterli kontrast; durumlarda metin+ikon; reduced-motion desteği; 320 px ve üstünde taşmayan düzen; iPhone safe-area ve klavye davranışı testleri.

## 4. Öğretim sistemi

Tek genel seviye yerine Reading, Listening, Writing ve Speaking ayrı tutulur. Vocabulary ve Grammar destek alanlarıdır. Kullanıcı bütün düzeylere erişir. İlk oturumlarda beceri başına kısa örnekler toplanır; veri azsa “henüz yeterli veri yok” gösterilir. Speaking/Writing öz değerlendirmesi, doğru cevabı belirli Reading/Listening verisinden ayrı gösterilir.

Öğrenme döngüsü: kısa açıklama → aktif cevap → neden/örnek → hatayı yeniden deneme → sonraki güne tekrar → başka bağlamda uygulama. Hata kaydı soru kimliği, görev tipi, etiket, cevap, zaman ve içerik sürümünü taşır. Tek doğru cevap “ustalık” anlamına gelmez.

Öneri motoru önce zamanı gelen tekrarları, sonra yeterince çalışılmamış/yanlış yapılan becerileri seçer. Bütün beceriler görünür kalır. Kullanıcı öneriyi değiştirebilir. Yerel öneri algoritması ETS'nin adaptif test algoritması değildir.

### Sekiz haftalık omurga

1. Başlangıç profili, yeni sınavın görevlerini tanıma, ilk dil bilgisi/kelime açıkları.
2. Kelime aileleri, cümle yapısı, dinleyerek tekrar ve temel ifade doğruluğu.
3. Akademik/daily-life okuma, bağlamdan anlam, tamlamalar ve kelime biçimleri.
4. Dinleme, konuşmanın amacı/çıkarım, not alma; zayıf alanı yeniden ölçme.
5. E-posta, akademik tartışma, mülakat cevapları; gerekçe ve örnek geliştirme.
6. Süreli görev setleri, doğruluk-hız dengesi ve yanlışların tekrar çalışılması.
7. ETS'nin güncel resmî denemeleri; sonuçların beceri bazlı incelenmesi.
8. Tekrarlayan hatalar, hafif tekrar ve sınav koşullarına alışma.

15 Kasım–15 Ocak yaklaşık iki takvim ayıdır; sekiz hafta temel program, kalan günler tampon/tekrar olarak kullanılır. Kaçırılan gün ceza üretmez. Az çalışılan haftalarda eksik işin kendiliğinden tamamlandığı varsayılmaz.

Telefon kısa pratikler için ana araçtır. Gerçek TOEFL bilgisayarda yapıldığı için son haftalarda resmî denemeler bilgisayar, klavye ve kulaklıkla uygulanmalıdır.

## 5. İçerik gereksinimleri

### Kelimeler ve tamlamalar

Kesin “sınavda çıkacak kelimeler” listesi yoktur. Kütüphane akademik kullanım, kampüs yaşamı ve görevler açısından yararlı sözcüklerden oluşturulur. AWL akademik seçim referansıdır; tek başına tüm yeni sınavı kapsamaz. Özgün İngilizce tanım, Türkçe anlam, kelime türü, aile, tamlama, örnek ve konu etiketi gerekir.

Örnek alanlar: eğitim, araştırma, çevre, biyoloji, toplum, psikoloji, tarih/sanat, teknoloji, kampüs hizmetleri. Örnek yapılar: conduct research, draw a conclusion, meet a deadline, account for, be consistent with. Cümle ezberletmenin yanında sözcüğü bağlam içinde kullanma gerekir.

### Dil bilgisi

| İçerik düzeyi | Temel başlıklar |
|---|---|
| A1 | be, temel söz dizimi, articles, çoğullar, present simple, zamirler |
| A2 | past/future, karşılaştırma, sayılabilirlik, modals, temel bağlaçlar |
| B1 | perfect tenses, passive, relative clauses, gerund/infinitive, conditionals 0/1/2 |
| B2 | third/mixed conditionals, reported speech, noun clauses, modal deduction, karmaşık noun phrases |
| C1 | hedging, nominalisation, participle clauses, inversion, academic cohesion, register |
| C2 | nüanslı tutum/olasılık, ellipsis, bilgi odağı, karmaşık yapıların kontrollü kullanımı, üslup düzenleme |

Her derste yapı + anlam + kullanım + tipik hata + örnek + alıştırma + sınav bağlantısı bulunur. C2 desteği başlangıçta seçilmiş konulardan oluşur; bir tam C2 kursu olduğu iddia edilmez.

### Kalite ve üretim hedefi

İlk çalışan sürüm, çekirdek öğrenme sistemi ve özgün başlangıç bankasıdır. Kapsamlı iki aylık sürüm için editör kontrolünden geçmiş hedef: 800–1200 kelime/anlam kaydı, 200+ tamlama, 60–90 dil bilgisi mikro dersi, görev tiplerine dengeli dağılmış 600+ alıştırma, farklı konuşmacılarla kayıtlı sesler. Bunlar yapılmış içerik sayıları değil üretim hedefleridir. Son teslim notunda gerçek sayılar ayrı raporlanacaktır.

Her soru: tek anlamlı yönerge, savunulabilir cevap/alternatifler, gerekçe, zorluk, beceri, görev tipi, kaynak/sahiplik ve sürüm taşır. Her yanlış seçenek dil uzmanı tarafından gözden geçirilmelidir. İlk özgün banka AI yardımıyla hazırlanır; uzman incelemesinden geçmiş resmî materyal olarak tanıtılmaz.

## 6. Teknik gereksinimler ve ilk mimari

İlk sürüm: bağımlılıksız HTML/CSS ve ES modules; Node.js 22+ yalnız yerel sunucu/test/paketleme için. Çalışan uygulama üçüncü taraf CDN'ye bağlı olmayacak. Service Worker uygulama dosyalarını çevrimdışı tutacak; metin ilerlemesi yerel depoda, ses kayıtları IndexedDB'de tutulacak. Arayüz, öğrenme kuralları ve içerik ayrı dosyalarda olacak.

Kaynak kodu düzeni:

```text
toefl-studio/
  index.html, styles.css, app.js
  core.js                 # tekrar, oturum ve beceri ölçümleri
  storage.js              # yerel kayıt, ses ve yedekleme
  data/content.js         # özgün sınav görevleri + format bilgisi
  data/library.js         # kelimeler + dil bilgisi
  sw.js, manifest.webmanifest, icons/
  scripts/serve.mjs, scripts/build.mjs
  tests/
  docs/
  README.md, package.json, .gitignore
```

Örnek içerik sözleşmesi:

```json
{
  "id": "reading-academic-001",
  "version": 1,
  "skill": "reading",
  "taskType": "academic-passage",
  "level": "B2",
  "tags": ["inference", "environment"],
  "prompt": "Özgün yönerge",
  "passage": "Özgün İngilizce metin",
  "options": ["A", "B", "C", "D"],
  "answer": 1,
  "explanation": "Türkçe gerekçe",
  "provenance": "original-ai-assisted"
}
```

### Backend kararı

Tek kullanıcı ve tek ana cihaz için ilk sürüm sunucu hesabı gerektirmez. Uygulama kamuya açık barındırılsa bile kişisel ilerleme/ses kaynak koduna yazılmaz; ilgili cihaz/tarayıcıda kalır. Tarayıcı verisini temizlemek veri kaybına yol açabilir; düzenli dışa aktarma gerekir. Bu yapı otomatik cihazlar arası eşitleme sağlamaz.

Sonraki sunuculu sürüm gerekirse: tek kullanıcıya kapalı kimlik doğrulama; kullanıcıya özel veri tabanı; idempotent cevap olayı API'si; şemalı içerik sürümleri; ses dosyaları için özel nesne deposu; günlük yedek; silme/dışa aktarma; AI için sunucu tarafında anahtar ve maliyet sınırı. Çok kullanıcılı SaaS/mikroservis altyapısı bu ihtiyacın ön koşulu değildir.

### Ses ve AI

İlk sürüm: cihazın İngilizce text-to-speech özelliği, mikrofonla kayıt ve dinleme, görev bazlı öz değerlendirme. Safari/cihaz İngilizce sesi yoksa veya ses çevrimdışı çalışmıyorsa açık hata/alternatif gösterilir. TTS sesleri ETS kayıtlarının ve çeşitli aksanlarla doğal dinlemenin yerini tamamen tutmaz.

Serbest yazı/konuşmayı yalnız uzunluk veya kelime sayısından puanlamak yasaktır. İlk sürüm otomatik dil hatası analizi yapmaz; öz değerlendirme kontrol listesi ve örnek yaklaşım sunar. Güvenilir otomatik feedback için sonraki aşamada STT/LLM sağlayıcısı, ücret, açık veri gönderim tercihi ve insan değerlendirmesiyle karşılaştırmalı test gerekir. API anahtarları hiçbir zaman public GitHub'a veya frontend'e konmaz.

## 7. GitHub ve iPhone kullanımı

Kaynak kodu kullanıcıya klasör ve ZIP olarak verilecek; kullanıcı kendisi GitHub'a pushlayacak. Bu çalışma uzaktaki repoya push/deploy yapmayacak. Statik çıktı GitHub Pages ile uyumlu göreli yollar kullanacak. GitHub Pages'te sitenin erişimi ile repository'nin erişimi aynı şey değildir; private repo otomatik private site anlamına gelmez. Tam kapalı site istenirse erişim kontrollü barındırma gerekir.

iPhone: HTTPS üzerinden Safari'de aç → Paylaş → Ana Ekrana Ekle. İlk çevrimiçi açılış önbelleği hazırlar. Mikrofon kullanıcı isteğiyle açılır. Telefonda masaüstünün localhost adresi çalışmaz; HTTPS barındırma gerekir. Safari ve ana ekran uygulamasının depoları farklılaşabileceği için aynı giriş biçimini kullan ve yedek al.

## 8. Kabul kriterleri

1. 390 px iPhone genişliğinde temel eylemler erişilebilir, yatay taşma yok.
2. 15 dakikalık çalışma önerisi seçilebilir; çalışma istediğin süre devam eder.
3. Cevap ve taslak yeniden yüklemeden sonra korunur; tamamlanmış cevap iki kez sayılmaz.
4. İlk yüklemeden sonra metin dersleri ve tekrarlar çevrimdışı çalışır.
5. Reading/Listening objektif sonuçları ile Speaking/Writing öz değerlendirmesi ayrı etiketlenir.
6. Güncel 12 görev tipi kütüphanede görünür; mini pratik tam/kalibre deneme diye sunulmaz.
7. A1–C2 destek içeriğine kilitsiz erişilir; tek seviye dayatılmaz.
8. Yedek dışa/içe aktarımı şema kontrolü yapar; hatalı dosya mevcut veriyi bozmaz.
9. Ses izni reddi uygulamayı çökertmez; kullanıcı sessiz çalışabilir.
10. Kaynak, özgünlük, tamamlanan ve planlanan kapsam açıkça gösterilir.

## 9. Test ve devam aşamaları

İlk sürümde tekrar tarihleri, kuyruk seçimi, cevap değerlendirme, veri doğrulama için otomatik testler; tarayıcıda mobil görünüm, soru/geri bildirim, taslak/oturum devamı ve yedekleme akışları. Gerçek iPhone'da mikrofon, ana ekran kurulumu, kilit ekranı ve çevrimdışı ses davranışı ayrıca cihaz testi ister.

Sonraki işler: bankanın pedagojik kontrolü/genişletilmesi, gerçek sesler, daha derin tanılama, güvenilir otomatik üretim geri bildirimi ve gerekirse özel backend eşitlemesi. Kısa örnek banka tek başına iki aylık tam hazırlık programının yerini tutmaz; güncel ETS alıştırmaları programa bağlanır.
