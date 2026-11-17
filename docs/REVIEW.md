# Luma — v3 kontrolü ve v4 değişiklikleri

16 Kasım 2026 · Belge v4. Önceki karşılaştırmalı inceleme (v3) bu dosyanın yerini aldı; v3'ün kararları aşağıda korunan yerlerde geçerlidir.

## v3 dosyaları tam mı?

Evet. Dört dosya yarım kalmamış: satır sayıları düzenleme özetindeki değerlerle uyuşuyor (REQUIREMENTS 77, CONTENT-SPEC 91, SOURCES 49, REVIEW 28 satır), her dosya kendi kapanış bölümüyle bitiyor ve dosyalar arası sayılar tutarlı (48 alıştırma, 126 kart, 36 mikro ders, 20 MB yedek sınırı). Kullanım limiti yalnız son sohbet özetini kesmiş; belge içeriği kaybolmamış. Tek düzeltme REQUIREMENTS'ın başındaki boş satırdı.

Yeniden kontrol edilen bağlantılar: ETS Preparing Students sayfasında Practice Test 1 ve 2 için "Download Audio" ZIP bağlantıları var; ETS dijital örnek 1 sayfası, testi kısa bir formla başlatan bir açılış sayfası (ücret, hesap ve puan bilgisi sayfada yazmıyor).

## Kullanıcının sorusu: dil bilgisini tamamen anlatacak ve konuşmaya yardım edecek mi?

v3 haliyle hayır, bu söylenemezdi.

| Konu | v3'teki durum | v4'teki karar |
|---|---|---|
| Dil bilgisi anlatımı | 36 mikro ders; yeni ders için "yapı, anlam, kullanım, bir hata, iki kısa örnek ve bir soru yeterli başlangıçtır". Bu hatırlatma düzeyidir. Konu listesi yalnız düzey tablosu halindeydi; isim tamlamasının temel konuları (iyelik 's/of, isim + isim, sıfat sırası, belirleyiciler) ayrı ders olarak yoktu. | [GRAMMAR.md](GRAMMAR.md): 11 modül, 67 ders. İsim öbeği 13 ders, koşul cümleleri 7 ders. Her ders Özet + Tam anlatım; Tam anlatım şablonu CONTENT-SPEC'te. Öncelikli 20 ders ilk parti. Görev hatasından derse yönlendirme. |
| Konuşma | Kayıt, geri dinleme, kontrol listesi ve örnek cevap vardı. V0.1'de yalnız tek cümlelik tekrar ve tek mülakat sorusu var. Cevap yapısı, telaffuz ve ifade öğretimi yoktu. Transkript üzerinden geri bildirim önerilmiş ama transkripti elde etme yolu tanımlanmamıştı. | 7 cümlelik ve 4 soruluk prova setleri, 45 saniyelik cevap yapısı, ifade bankası, 12 telaffuz mikro dersi, kayıt–model karşılaştırması, iPhone dikte ile kelime kontrolü, konuşma transkripti istemi ve isteğe bağlı sesli prova istemi. |

Sınırlar açık yazıldı: "bütün dil bilgisi" tanımlı 67 derslik listedir ve eksik bulunan eklenir; uygulama telaffuzu puanlamaz; dikte tanıma hatası telaffuz hatası sayılmaz; 67 dersin hepsini sekiz haftada bitirmek hedef değildir; bu belgeler hedefi tanımlar, Tam anlatımlı dersler henüz yazılmadı.

## v3'ün v2'ye göre haklı olduğu ve korunan kararlar

- V2 planlanan özellikleri teslim edilmiş gibi okutuyordu; v3 gerçek v0.1 kapsamını ayırdı.
- ETS PDF denemelerinin resmî sesleri var; metni TTS ile okutmak yardımlı çalışmadır.
- Bir cloze metninin 10 boşluğu 10 bağımsız örnek değildir; v2'deki 12 cevap ve %80/%50 eşikleri dayanaksızdı.
- Öğrenme modu ile prova modunu ayırmak doğrudur.
- Her dosyada ağ önceliği tek başına sürüm tutarlılığı sağlamaz; sürümlü önbellek korunur.
- Mevcut kimlikler ve alan adları yedek uyumu için korunur; SRS'in mevcut dört yanıtı geçerlidir.

## v4 değişiklik tablosu

| Dosya | Değişiklik |
|---|---|
| GRAMMAR.md (yeni) | 67 derslik harita, sık hatalar, sınav bağlantısı, öncelikli 20 ders, tarama ve hatadan derse yönlendirme, v0.1 mikro derslerle ilişki. |
| REQUIREMENTS.md | V4 taahhüt notu; durum tablosuna "v0.2 · kullanıcı talebi" satırı; "Dil bilgisi öğretimi" ve "Konuşma desteği" bölümleri; rotaya haftalık konuşma ve dil bilgisi teması; dikte için iPhone notu; kabul ölçütü 7 ve 8. |
| CONTENT-SPEC.md | Bankanın kapsamına v0.2 içerik taahhüdü; Tam anlatım ders şablonu; yeni "Konuşma içeriği" bölümü (cevap yapısı, ifade bankası, 12 telaffuz dersi, dikte karşılaştırma kuralları); konuşma transkripti ve sesli prova istemleri; yayın kontrolüne 5. madde. |
| SOURCES.md | Ses ZIP bağlantılarının yeniden kontrolü; iPhone dikte kaynağı ve gizlilik notu; telaffuz için sözlük bağlantıları; dış geri bildirimde yalnız kendi cevabını paylaşma kuralının konuşmaya genişletilmesi. |

## Sıradaki adım

1. Bu hafta başlangıç ölçümü (v3 rotası aynen geçerli).
2. Gerçek iPhone'da kurulum, kayıt ve yedek kontrolü.
3. İçerik üretimi: öncelikli 20 dil bilgisi dersinin Tam anlatımı ile Listen and Repeat ve Interview setleri; ardından telaffuz dersleri ve ifade bankası. Kalan dersler başlangıç ölçümünde görülen hatalara göre sıralanır.

## v0.2 uygulama notu (16 Kasım 2026)

Bu belgelerdeki v0.2 taahhüdü uygulamaya işlendi; ayrıntılı test kaydı [DOGRULAMA.md](DOGRULAMA.md) dosyasındadır.

- Dil bilgisi: 11 modül, 69 ders (67 + v0.1 eşlemesinden G3.10 ve G10.9). Öncelikli 20 dersin Tam anlatımı, 69 dersin Özeti, modül taramaları, görev hatasından derse yönlendirme ve farklı gün tekrarı çalışıyor. 49 dersin Tam anlatımı planlandı.
- Konuşma: 4 × 7 cümlelik Listen and Repeat, 4 × 4 soruluk Interview seti; öğrenme ve prova modu; kayıt–model karşılaştırması; dikte karşılaştırması; transkript ve sesli prova istemleri; 48 kayıtlık ifade bankası (kelime tekrarına bağlı); 12 telaffuz dersi.
- Bugün ekranı önce devam noktasını, sonra tek önerilen adımı gösteriyor; haftalık konuşma (en az 3 gün) ve dört beceri teması izleniyor.
- Açık kalanlar: gerçek iPhone'da kurulum, mikrofon, dikte ve TTS sesleri; içeriğin dil uzmanı incelemesi; ETS deneme sonucu kaydı (sonraki sürüm).
