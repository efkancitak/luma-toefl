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
2. Günün listesi bütün içerikten pay alır: tekrar kartları, yeni kelimeler, öbek fiiller, kalıp ve bağlaçlar, yazarak tamamlama, gramer dersleri, Reading, Listening, Writing ve Speaking. Yeni kart günde en çok 30'dur; tekrarlar çoğaldıkça azalır ve kaçırılan gün yükü artırmaz. Gramer dersleri ve görevler bitiş tarihine kadar günlere bölünür (varsayılan: sınav günü, 15 Ocak; Ayarlar → **Antrenman bitiş tarihi**). Liste bir öneri: bitince **10 yeni kart daha** ile devam edebilirsin. C2 akademik kelimeler ve öncelik 3 öbek fiiller **ek havuzda**; Antrenman ekranının altındaki **Plana ekle** ile açarsın.
3. Yeni kartları dört şıkla tanıdıktan sonra **Yazarak tamamlama** turu gelir: örnek cümlede eksik harfleri yaz. Bugün yanlış yaptığın kartlar listede **Yeniden öğren** adımıyla aynı gün geri gelir.
4. Reading, Listening, Writing ve Speaking görevleri sınav süresiyle başlar; dinlemede süre sesle başlar. Süre bitince cevap 10 saniyede bir parça açılır.
5. Writing adımında yazdıktan sonra **Bitirdim · değerlendir**: Değerlendir → Hatalar → Geliştir → Tekrar. Tekrar bölümünde geliştirilmiş metnin boş bırakılan cümlelerini yaz ve karşılaştır. İstersen **AI istemini kopyala** ile metnini dört adımlı istemle bir AI'a yapıştır, geliştirilmiş metni Geliştir kutusuna geri koy.
6. Sekmeler ekstra çalışma içindir: Reading, Listening, Speaking, Writing (görevler, puanlama rehberi, araçlar) ve Gramer (A1 → C2 gramer programı ve “Sıradaki ders”, bütün zamanlar / koşullar / modallar gibi başvuru tabloları, fiil aileleri, düzensiz fiiller ve V2/V3 alıştırması).
7. Ayarlar'dan düzenli yedek al (paylaşım menüsü → **Dosyalara Kaydet**). Ayarlar → **Ses ve dinleme**'den doğal bir İngilizce ses seç. iPhone'da dikte: Ayarlar → Genel → Klavye → Dikte'yi Etkinleştir.
8. Rotam'a (sol menü ya da Antrenman ekranının altı) 1., 4. ve 7. haftadaki ETS deneme sonuçlarını koşuluyla kaydet. Rotam'daki **Ölçüm seti** hiç görmediğin sorularla ilerlemeni ölçer; **Hata türlerin** zorlandığın soru türünü gösterir.

Gereksinimler: `docs/REQUIREMENTS.md`. Ders haritası: `docs/GRAMMAR.md`. İçerik sözleşmesi: `docs/CONTENT-SPEC.md`. Kaynaklar: `docs/SOURCES.md`. Yapılan testler ve sınırlar: `docs/DOGRULAMA.md`.

Bu sürüm (v0.9.1) 116 özgün görev (40 metin/kayıt kümesinde 126 soru, 22 Build a Sentence), 2.156 kart (A2–C2 kelime, öbek fiil, kalıp, bağlaç), 134 konuşma ifadesi, 181 günlük alternatif, 90 dil bilgisi dersi (21 Tam anlatım, 368 ek alıştırma, 112 düzensiz fiil), 12 konuşma prova seti ve 12 telaffuz dersi içerir. Güncel sayımın tamamı README'deki **Güncel envanter** bölümündedir. İki aylık eksiksiz kurs değildir; resmî ETS kaynaklarıyla birlikte kullanılmalıdır.
