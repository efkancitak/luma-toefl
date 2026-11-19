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

## İlk gün

1. Ayarlar'dan 15 Ocak 2027 planlama tarihini kontrol et; hedef bant boşken hedefin en yüksek performanstır.
2. Çalış ekranında her beceriden bir örnek dene. Bütün içerik düzeyleri açık; A1'den sırayla ilerlemen gerekmiyor.
3. Yazma ve konuşma yanıtlarını kontrol listesiyle değerlendir. Bu sürüm otomatik dil düzeltmesi yapmaz.
4. Kelimeler'de seviyeni seç (A1–C2) ve 20 kartlık seti çöz: her kelimeye dört Türkçe seçenekten birini seç. Bildiğin kelimeyi “Öğrendim” ile setlerden çıkar.
5. Bugün veya Çalış ekranından bir set seç: karışık ya da tek beceri. Set kolaydan zora ilerler; kapatıp açtığında kaldığın sorudan devam eder ve çözdüğün soru tekrar gelmez.
6. Düzenli olarak Ayarlar'dan ilerleme yedeği al (telefonda paylaşım menüsü açılır; **Dosyalara Kaydet** seç). Ses kayıtlarını ayrıca indir. Ayarlar → **Ses ve dinleme**'den doğal bir İngilizce ses seç.
9. Rotam → **Deneme sonuçların** bölümüne 1., 4. ve 7. haftadaki ETS deneme sonuçlarını koşuluyla kaydet.
7. **Konuşma** bölümünde haftada en az üç gün kısa bir set çalış: kısa günlerde Listen and Repeat (öğrenme modu, gölgeleme, dikte kontrolü), uzun günlerde bir Interview seti ve kendi kaydını inceleme. iPhone'da dikte: Ayarlar → Genel → Klavye → Dikte'yi Etkinleştir.
8. **Dil bilgisi**'nde 2–3. haftalarda öncelikli 20 dersten başla. Yanlış yaptığın maddeler ertesi gün yeni cümlelerle karşına çıkar.

Gereksinimler: `docs/REQUIREMENTS.md`. Ders haritası: `docs/GRAMMAR.md`. İçerik sözleşmesi: `docs/CONTENT-SPEC.md`. Kaynaklar: `docs/SOURCES.md`. Yapılan testler ve sınırlar: `docs/DOGRULAMA.md`.

Bu sürüm (v0.5) 90 özgün alıştırma, 1019 kelime, 119 konuşma ifadesi, 69 dil bilgisi dersi (20 Tam anlatım), 12 konuşma prova seti ve 12 telaffuz dersi içerir. İki aylık eksiksiz kurs değildir; resmî ETS kaynakları ve genişletilecek içerik bankasıyla birlikte kullanılmalıdır.
