# Luma'yı aç

Bu klasör uygulamanın kaynak kodudur. `dist/` barındırmaya hazır statik çıktıdır. Ücretli API anahtarı gerekmez.

## Bilgisayarda

Node.js 22+ yüklüyken bu klasörde terminal aç:

```sh
npm run dev
```

Tarayıcıda `http://localhost:4173` adresine git. `npm install` gerekmez. Sayfayı dosyaya çift tıklayarak açma.

## iPhone'da

Kaynak kodunu kendi GitHub repona pushladıktan sonra README'deki Pages yönergesiyle HTTPS adresi oluştur. Bu adresi iPhone Safari'de aç, **Paylaş → Ana Ekrana Ekle** seç. İlk açılışta internet olsun; "Uygulama dosyaları çevrimdışı çalışma için hazır" bildirimini gördükten sonra internetsiz de açılır. Telefon, bilgisayarın `localhost` adresini kullanamaz.

Her değişiklikten sonra pushlamadan önce `npm run release` çalıştır. Telefon yeni sürümü internet varken arka planda indirir ve üstte **Güncelle** bildirimi gösterir.

Verilerin yalnız telefonda durur. Ana ekran simgesini silmek veya Safari verilerini temizlemek ilerlemeyi de siler; Ayarlar'dan düzenli yedek al ve Dosyalar'a kaydet.

## Her gün

1. Uygulamayı aç: ana ekran **Antrenman**. **Başla**'ya bas; günün ilk adımı açılır. Her adım bitince “Antrenmana devam” sıradakini açar. Bütün adımlar bitince gün tamamlanır.
2. Günün listesi bütün içerikten pay alır: tekrar kartları, yeni kelimeler, öbek fiiller, kalıp ve bağlaçlar, gramer dersleri, Reading, Listening, Writing ve Speaking. Kalan içerik bitiş tarihine kadar günlere eşit bölünür; bir gün atlarsan pay kalan günlere dağılır. Bitiş tarihi: Ayarlar → **Antrenman bitiş tarihi** (varsayılan sınavdan 31 gün önce).
3. Writing adımında yazdıktan sonra **Bitirdim · değerlendir**: Değerlendir → Hatalar → Geliştir → Tekrar. Tekrar bölümünde geliştirilmiş metnin boş bırakılan cümlelerini yaz ve karşılaştır. İstersen **AI istemini kopyala** ile metnini dört adımlı istemle bir AI'a yapıştır, geliştirilmiş metni Geliştir kutusuna geri koy.
4. Sekmeler ekstra çalışma içindir: Reading, Listening, Speaking, Writing (görevler, puanlama rehberi, araçlar) ve Gramer (A1 → C2 gramer programı ve “Sıradaki ders”, bütün zamanlar / koşullar / modallar gibi başvuru tabloları, fiil aileleri, düzensiz fiiller ve V2/V3 alıştırması).
5. Ayarlar'dan düzenli yedek al (paylaşım menüsü → **Dosyalara Kaydet**). Ayarlar → **Ses ve dinleme**'den doğal bir İngilizce ses seç. iPhone'da dikte: Ayarlar → Genel → Klavye → Dikte'yi Etkinleştir.
6. Rotam'a (sol menü ya da Antrenman ekranının altı) 1., 4. ve 7. haftadaki ETS deneme sonuçlarını koşuluyla kaydet.

Gereksinimler: `docs/REQUIREMENTS.md`. Ders haritası: `docs/GRAMMAR.md`. İçerik sözleşmesi: `docs/CONTENT-SPEC.md`. Kaynaklar: `docs/SOURCES.md`. Yapılan testler ve sınırlar: `docs/DOGRULAMA.md`.

Bu sürüm (v0.8) 106 özgün alıştırma, 2001 kart (kelime, öbek fiil, kalıp, bağlaç), 134 konuşma ifadesi, 90 dil bilgisi dersi (21 Tam anlatım, 368 ek alıştırma, 112 düzensiz fiil), 12 konuşma prova seti ve 12 telaffuz dersi içerir. İki aylık eksiksiz kurs değildir; resmî ETS kaynaklarıyla birlikte kullanılmalıdır.
