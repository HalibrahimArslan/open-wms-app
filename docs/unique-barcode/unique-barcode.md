# Mal Kabul Sürecinde Tekil Barkod Üretimi ve Otomatik Mal Kabul

## Kullanıcı Hikayesi

### Amaç

Depo sorumlusu olarak, mal kabul sürecinde ürün bazlı miktar girerek tekil ve miktar temsil eden barkod üretmek ve bu barkodun el terminalinde okutulması ile otomatik mal kabul işleminin tetiklenmesini istiyorum.

### Bu Sayede

* Her ürün için kontrollü ve izlenebilir kabul süreci oluşturabilirim.
* Manuel mal kabul girişlerini minimize ederim.
* Satın alma siparişi ile fiziki ürün eşleşmesini garanti altına alırım.
* Süreci hızlandırırken hata oranını düşürürüm.

Bu geliştirme, yeni tekil barkod yapısının sistem genelinde etkin kullanılmasını ve mal kabul operasyonunun uçtan uca dijital olarak doğrulanmasını hedeflemektedir.

---

# Kabul Kriterleri

## 1. Barkod Yazdırma İşlemi

* Mal kabul ekranında her ürün satırının sonunda **"Barkod Yazdır"** butonu bulunur.

### Barkod Yazdır Pop-up

* Butona basıldığında pop-up ekran açılır.
* Ürün adı ve stok kodu otomatik olarak doldurulur.
* Kullanıcı yazdırılacak barkod miktarını girer.
* Girilen miktar 0 veya negatif olamaz.
* **Onayla** seçildiğinde sistem tekil barkod üretir ve yazıcıya gönderir.
* **İptal** seçildiğinde işlem iptal edilir ve barkod üretilmez.

### Barkod Numaralandırma

* Üretilen barkodlar sistemde loglanır.
* Aynı ürün için barkod sıra numaraları artan ve kesintisiz şekilde üretilir.
* Barkod sıra numarası yalnızca **okutulan barkodlar** üzerinden ilerler.
* Okutulmayan barkodların sıra numarası tüketilmiş sayılmaz.
* Okutma gerçekleştiğinde bir sonraki barkod son okutulan sıra numarasından devam eder.
* Okutulan barkod sıra numaraları sistemde kalıcı olarak saklanır.

---

## 2. El Terminali ile Barkod Okutma

* El terminalinde okutulan barkodun yeni tekil barkod formatında olduğu doğrulanır.

### Doğrulama Süreci

* Barkodun daha önce okutulup okutulmadığı kontrol edilir.
* Barkod ilgili ürün satırı, satın alma siparişi ve tedarikçi ile eşleştirilir.
* Doğrulama başarılı ise mal kabul kaydı otomatik oluşturulur.
* Ürün otomatik olarak ilgili **Geçici Depo Adresine** aktarılır.
* Kullanıcıya **"Başarılı kabul"** mesajı gösterilir.

### Hatalı Durumlar

* Aynı barkod ikinci kez okutulamaz.
* Tekrar okutma girişiminde sistem **"Bu barkod zaten kabul edildi"** uyarısı verir.
* Hatalı veya eşleşmeyen barkodlarda mal kabul işlemi oluşturulmaz.
* Okutulmayan barkodlar ekranda boş kalır ve işlem yapılmadığı net şekilde anlaşılır.

---

## 3. Barkod Zorunluluğu

* Barkod okutulmadan mal kabul veya sevkiyat işlemi tamamlanamaz.

### İşleyiş

* Üretilen barkodlar ürünlere yapıştırılır.
* Barkod okutulmadan ilgili barkod alanı dolu görünmez.
* Barkod okutulduğunda ilgili sipariş satırındaki **Teslim Miktarı** kolonu birer birer artar.

### Barkod Numaralandırma Kuralları

* Aynı ürün için barkod sıra numaraları artan ve kesintisiz şekilde üretilir.
* Barkod sıra numarası yalnızca **okutulan barkodlar** üzerinden ilerler.
* Okutulmayan barkodların sıra numarası tüketilmiş sayılmaz.
* Okutma gerçekleştiğinde bir sonraki barkod son okutulan sıra numarasından devam eder.
* Okutulan barkod sıra numaraları günlük olarak sistemde kalıcı şekilde saklanır.
* Barkod okutuldukça barkod alanı dolu hale gelir.

---

## 4. Loglama ve İzlenebilirlik

Tüm işlemler loglanmalıdır.

Mevcut **Adres Hareketleri İzleme** ekranında aşağıdaki hareketler bulunmaktadır:

* Adres Tanımlama
* Adres Yer Değiştirme
* Geçici Adresten Yerleştirme

Bu ekran aşağıdaki işlemleri de kapsayacak şekilde genişletilmelidir:

* Mal Kabul
* Sevkiyat
* Sayım
* Depolar Arası Transfer

Amaç, tüm operasyonel hareketlerin tek bir merkezi log ekranından izlenebilmesidir.

---

## 5. Alternatif Çözüm Önerisi

### Ana Başlıkta

* **Barkod Oluştur** butonu bulunur.
* Bu buton barkodu oluşturur ve yazdırır.
* Toplu barkod üretimi yapılabilir.

### Satır Bazında

* **Barkod Yazdır** butonu bulunur.
* Yalnızca daha önce oluşturulmuş barkodlar için görünür.
* Yeni barkod oluşturmaz.
* Mevcut barkodu yeniden yazdırır.

### Önerilen Davranış

* Üstteki **Barkod Oluştur** → oluştur + yazdır.
* Satırdaki **Barkod Yazdır** → yalnızca yazdır.
* Üstteki işlem toplu çalışır.
* Satırdaki işlem yalnızca ilgili ürün satırı için çalışır.
