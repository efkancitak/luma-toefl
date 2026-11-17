# Kaynak ve kullanım planı

Doğrulama: 15 Kasım 2026. Uygulama ETS'nin ürünü değildir. TOEFL adı sınavı tanımlamak için kullanılır. Resmî kaynaklara bağlantı verilir; ETS soru kitapları, sesleri ve değerlendirme tablolarının tamamı GitHub'a kopyalanmaz. Ücretsiz okunabilen kaynak açık yeniden dağıtım lisansı anlamına gelmez.

## Sınavın esas kaynakları

| Kaynak | Bağlantı | Kullanım |
|---|---|---|
| ETS canlı sınav yapısı | https://www.ets.org/toefl/test-takers/ibt/about/content.html?version=after-jan-2026 | Görev türleri, temel süre/sayı; sürümlü format kaydı |
| ETS 2026 specifications | https://www.ets.org/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf | Adaptif bölümler ve soru tasarımı referansı |
| Updated test overview | https://www.ets.org/pdfs/toefl/toefl-ibt-test-overview.pdf | Görev yönergeleri, alt süreler ve örnekler |
| Yeni puan sistemi | https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html | 1–6 ölçeği ve 0–120 geçiş açıklaması |
| ETS hazırlık merkezi | https://www.ets.org/toefl/test-takers/ibt/prepare.html | Güncel resmî hazırlık araçlarına giriş |
| Resmî 2026 practice test 1 | https://www.ets.org/pdfs/toefl/toefl-ibt-full-length-practice-test-1.pdf | Kullanıcının kaynakta açacağı deneme; repo içine alınmaz |
| Speaking rubrics | https://www.ets.org/pdfs/toefl/speaking-rubrics.pdf | Görev bazlı değerlendirme ölçütlerini kaynakta inceleme |
| Writing rubrics | https://www.ets.org/pdfs/toefl/writing-rubrics.pdf | E-posta/akademik tartışma beklentilerini kaynakta inceleme |

Eski format materyalleri genel beceri desteği için kullanılabilse de “2026 tam deneme” olarak işaretlenmeyecek. ETS teknik dokümanındaki ön lansman notları nedeniyle canlı sayfa ve güncel resmî hazırlık araçları yeniden kontrol noktasıdır. Kaynak kaydında URL, son kontrol tarihi, kullanım türü ve ilgili sınav sürümü bulunmalı.

## İngilizce içerik referansları

- Council of Europe, CEFR: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions — A1–C2 beceri tanımları. CEFR belirli bir İngilizce gramer konu listesi değildir. Uygulamadaki konu seviyeleri editoryaldir.
- Victoria University of Wellington, Academic Word List: https://www.wgtn.ac.nz/lals/resources/academicwordlist — akademik kelime seçimi referansı; TOEFL'da çıkacak kesin liste değildir. İlk sürüm bağımsız seçilmiş kelimeler için özgün tanım/örnekler içerir, AWL veri seti kopyalanmaz.
- British Council LearnEnglish Grammar: https://learnenglish.britishcouncil.org/grammar — ek açıklama/çalışma bağlantısı. Sayfa bu ortamda 403 döndürdüğünden otomatik içerik alınmadı.
- Cambridge English Grammar Today: https://dictionary.cambridge.org/grammar/british-grammar/ — kullanım/gramer danışma bağlantısı. Sayfa bu ortamda 403 döndürdüğünden otomatik içerik alınmadı.

Uygulama içindeki Türkçe açıklamalar, örnek cümleler, görevler ve kelime açıklamaları bu proje için özgün hazırlanacaktır. Bunlar resmî ETS soruları değildir; AI yardımıyla hazırlanmış başlangıç içeriği olarak işaretlenecektir. Kaynak tanımlarını veya makale metinlerini toplu scraping ile almak gerekmiyor.

## Teknik kaynaklar

- MDN Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers — HTTPS ve çevrimdışı önbellek.
- MDN IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API — kalıcı yerel kayıt/ses deposu.
- MDN MediaRecorder: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder — desteklenen tarayıcılarda ses kaydı.
- MDN Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API — cihaz sesleri; çevrimdışı kullanılabilirlik cihaza bağlıdır.
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site — statik barındırma ve erişim farkları.

## Dosya/kaynak ayrımı

GitHub'a girer: kaynak kodu, özgün içerik, kaynak bağlantıları, şema/sürüm bilgisi, testler, kurulum dokümanı.

GitHub'a girmez: kişisel ilerleme yedekleri, ses kayıtları, erişim anahtarları, satın alınmış soru bankaları, kullanım izni olmayan ETS/üçüncü taraf içerik kopyaları.

İlk sürüm için ücretli API veya hesap gerekmiyor. İleride otomatik konuşma/yazma analizi eklemek istenirse sağlayıcı seçimi ve kullanım maliyeti ayrı karardır; bu sürümde böyle bir hizmet aktif değildir.
