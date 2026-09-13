# Unique Barcode ve Sipariş Toplama Geliştirmesi

## Amaç

Mevcut sipariş toplama yapısının sadece `ADET` stok birimi için çalışması nedeniyle yeni stok birimleri (`METRE`, `METREKARE`, `METRETÜL`, `KG`) desteklenecektir.

Bu geliştirme ile:

* Farklı stok birimlerine göre barkod oluşturulabilecek.
* Oluşturulan barkodlar üzerinden sipariş toplama yapılabilecek.
* Teslim miktarı barkodun temsil ettiği miktar kadar düşülecek.
* Daha önce toplanmış barkodların tekrar işlenmesi engellenecek.
* Barkod oluşturma popup'ı tek komponent üzerinden yönetilecek.

---

## Netleşen Kararlar (2026-06-15)

Aşağıdaki kararlar geliştirme öncesi netleştirildi:

1. **Payload her zaman array olacak.** Tek barkod (ADET dahil) gönderilse bile body bir array (`[ { ... } ]`) olarak gönderilecek.
2. **`stokBirimi` değerleri** DB'de şu kodlarla kayıtlı (backend bu kodları döner):
   `ADET` (adet), `M2` (metrekare), `MT` (metre), `KG` (kilogram), `MTÜL` (metretül).
   * ✅ **Netleşti (2026-06-16):** tül birimi `MTÜL` olarak kesinleşti (önceki taslaklardaki `METREKÜP`/`METREKÜL` yanlıştı). Frontend `normalizeUnit` hem kısa kodu hem açık adı kabul eder.
3. **Status güncellemesini backend yapar.** Barkod toplandığında `RECEIVING_SCANNED` durumuna geçişi backend kendisi günceller; frontend ayrıca `PATCH/PUT` isteği atmaz.
4. **Toplama kayıt endpoint'i:** `api/aur-tmp-detail` (önceki dokümandaki `aur-order-tmp` eksik/yanlış yazımdı).
5. **Toplamada veri kaynağı:** Okutulan unique barkod, `api/unique-barcodes`'a query param olarak gönderilir; `quantity`, `status`, `stokKodu` gibi değerler bu response'tan gelir. Frontend hesaplama yapmaz, dönen `quantity` kullanılır.
6. **ADET ürünlerde de toplama unique barkod okutarak yapılır.** Okutmada artık `OrderQuantityInput` popup'ı açılmaz; `api/unique-barcodes`'tan dönen `quantity` doğrudan teslim miktarına eklenir ve barkod okutuldu sayılır.
7. **`lastModifiedDate` / son barkod gösterimi (Bölüm 1) şimdilik ERTELENDİ.** `aur-tmp-order` response modeli henüz netleşmediği için bu parça yapılmayacak — **unutulmayacak**, model netleşince ele alınacak.

---

# 1. Sayfa İlk Açılış Akışı

> ⏸️ **ERTELENDİ:** `aur-tmp-order` response modeli netleşene kadar bu bölüm uygulanmayacak (bkz. Karar #7).

## Mevcut Durum

Sayfa açıldığında aşağıdaki endpointlere istek atılmaktadır:

```text
api/orderDetail
api/aur-tmp-order
```

## Yeni Durum (ertelendi)

`api/aur-tmp-order` endpointinden gelen veriye aşağıdaki alan eklenecektir:

```json
{
    "lastModifiedDate": "2026-06-15T11:30:00"
}
```

### Yapılacaklar (ertelendi)

* Her satırda en son oluşturulan `uniqueBarcode` gösterilecek.
* Gösterilecek barkod bilgisi `lastModifiedDate` alanına göre belirlenecek.
* Kullanıcı ilgili ürün için oluşturulan son barkodu görebilecek.

---

# 2. Barkod Oluşturma Süreci

## Endpoint

```text
POST api/unique-barcodes
```

* **Body her zaman array'dir** (bkz. Karar #1) — tek barkod oluşturulsa bile.
* Barkod oluşturulduktan sonra mevcut süreçte olduğu gibi print servisine gönderilecektir.

---

# 3. Stok Birimi Bazlı Barkod Oluşturma

Desteklenecek stok birimleri (backend `stokBirimi` değerleri):

```text
ADET
KG
METRE
METREKARE
METRETÜL
```

### Birim → Popup Alanı → Payload Eşlemesi

| stokBirimi  | Popup Alanı       | adet | quantity              |
| ----------- | ----------------- | ---- | --------------------- |
| ADET        | Miktar            | N    | 1                     |
| METRE       | Metre             | 1    | Girilen metre         |
| METRETÜL    | Metretül          | 1    | Girilen metretül      |
| KG          | Kilogram          | 1    | Girilen kilogram      |
| METREKARE   | En + Boy          | 1    | En × Boy              |

---

## 3.1 ADET

### Davranış

Kullanıcı popup içerisinde miktar girer.

Örnek:

```text
5
```

Sistem:

* Tek bir array elemanı gönderir; `adet: 5`.
* Backend bu tek elemandan 5 adet unique barcode oluşturur.
* Her barkod 1 adet ürünü temsil eder (`quantity: 1`).

Örnek payload (array):

```json
[
    {
        "product": {},
        "customerCode": "320.01.015",
        "erpOrderNo": "-17203",
        "receivingDate": "260615",
        "adet": 5,
        "quantity": 1
    }
]
```

---

## 3.2 METRE / METRETÜL / KG

### Davranış

Bu stok birimlerinde kullanıcı barkod adedi değil, temsil ettiği miktarı girer.

Örnek:

```text
50 METRE
```

Sistem:

* Tek bir unique barcode oluşturur (`adet: 1`).
* Oluşan barkod 50 METRE temsil eder (`quantity: 50`).

Payload (array):

```json
[
    {
        "product": {},
        "customerCode": "320.01.015",
        "erpOrderNo": "-17203",
        "receivingDate": "260615",
        "adet": 1,
        "quantity": 50
    }
]
```

### Önemli

Sipariş miktarı:

```text
1000 METRE
```

olsa bile kullanıcı:

```text
50 METRE
```

toplayabilir.

Bu durumda:

* Tek barkod oluşur.
* Barkod quantity değeri 50 olur.
* Sipariş toplama sırasında teslim miktarından 50 düşülür.

---

## 3.3 METREKARE (En × Boy)

### Davranış

METREKARE ürünlerde kullanıcı:

* En
* Boy

bilgilerini girer.

Popup örneği:

```text
En : 20
Boy : 20
```

Hesaplama:

```text
Metrekare = En × Boy
```

Örnek:

```text
20 × 20 = 400 METREKARE
```

Payload (array):

```json
[
    {
        "product": {},
        "customerCode": "320.01.015",
        "erpOrderNo": "-17203",
        "receivingDate": "260615",
        "adet": 1,
        "quantity": 400
    }
]
```

### Sonuç

* Tek bir unique barcode oluşur.
* Barkod 400 METREKARE temsil eder.
* Sipariş toplama sırasında teslim miktarından 400 düşülür.

---

# 4. Ortak Barkod Oluşturma Popup'ı

## Gereksinim

Tüm stok birimleri aynı popup komponentini kullanmalıdır. Popup, satırın `stokBirimi` değerine göre uygun alan(lar)ı gösterir.

### ADET

Alanlar:

```text
Miktar
```

→ `adet = Miktar`, `quantity = 1`

---

### METRE

Alanlar:

```text
Metre
```

→ `adet = 1`, `quantity = Metre`

---

### METRETÜL

Alanlar:

```text
Metretül
```

→ `adet = 1`, `quantity = Metretül`

---

### KG

Alanlar:

```text
Kilogram
```

→ `adet = 1`, `quantity = Kilogram`

---

### METREKARE

Alanlar:

```text
En
Boy
```

ve otomatik hesaplanan:

```text
Metrekare = En × Boy
```

→ `adet = 1`, `quantity = En × Boy`

---

# 5. Sipariş Toplama Süreci

## Yeni Akış

Tüm stok birimlerinde (ADET dahil) sipariş toplama, **unique barkod okutarak** yapılır. Toplama yapılmadan önce:

```text
GET api/unique-barcodes
```

endpointine sorgu atılır. Okutulan barkod query param olarak gönderilir; `quantity` / `status` / `stokKodu` bu response'tan gelir (bkz. Karar #5).

---

## Adım 1

Kullanıcı unique barcode okutur.

Örnek:

```text
UB123456789
```

---

## Adım 2

Sorgu yapılır:

```text
GET api/unique-barcodes?uniqueBarcode=UB123456789
```

---

## Adım 3

Dönen veri kontrol edilir.

Örnek:

```json
{
    "uniqueBarcode": "UB123456789",
    "quantity": 400,
    "status": "RECEIVING_SCANNED"
}
```

---

## Adım 4

Status kontrolü yapılır.

### Eğer

```text
status === RECEIVING_SCANNED
```

ise:

* `api/aur-tmp-detail` çağrılmaz.
* Kullanıcıya hata mesajı gösterilir.

Mesaj:

```text
Bu barkod daha önce toplandı.
```

---

### Eğer

```text
status !== RECEIVING_SCANNED
```

ise:

* Toplama işlemine devam edilir.
* Response'tan dönen `quantity` değeri **doğrudan** teslim miktarına eklenir.
* `OrderQuantityInput` popup'ı **açılmaz**; frontend miktar hesaplaması yapmaz (bkz. Karar #6).

Örnek:

```json
{
    "quantity": 400
}
```

Bu durumda:

```text
teslimMiktar += 400
```

olarak gönderilir.

Sonrasında:

```text
api/aur-tmp-detail
```

endpointine istek atılır.

* Barkodun `RECEIVING_SCANNED` durumuna geçişini **backend kendisi yapar**; frontend ayrıca status güncelleme isteği atmaz (bkz. Karar #3).

---

# 6. Teslim Miktarı Güncelleme Kuralları

| Stok Birimi | Barkod Sayısı          | Teslim Miktarı           |
| ----------- | ---------------------- | ------------------------ |
| ADET        | Oluşturulan adet kadar | Okutulan barkod başına 1 |
| METRE       | 1                      | Girilen metre kadar      |
| METRETÜL    | 1                      | Girilen metretül kadar   |
| KG          | 1                      | Girilen kilogram kadar   |
| METREKARE   | 1                      | En × Boy sonucu kadar    |

> Her stok biriminde teslim miktarı, okutulan barkodun `api/unique-barcodes` response'undaki `quantity` değeri kadar artar.

---

# Acceptance Criteria

## AC-1

Sayfa açıldığında:

```text
api/orderDetail
api/aur-tmp-order
```

çağrıları devam etmelidir.

---

## AC-2  *(ERTELENDİ — Karar #7)*

`aur-tmp-order` dönüşündeki `lastModifiedDate` kullanılarak son oluşturulan barkod satırda gösterilmelidir. *(Model netleşince yapılacak.)*

---

## AC-3

ADET ürünlerde mevcut barkod oluşturma davranışı korunmalıdır (`adet = N`, `quantity = 1`). Body array olarak gönderilmelidir.

---

## AC-4

METRE, METRETÜL ve KG ürünlerde tek barkod oluşturulmalı ve `quantity` girilen değeri temsil etmelidir.

---

## AC-5

METREKARE ürünlerde en ve boy alınmalı, `quantity` değeri en × boy olarak hesaplanmalıdır.

---

## AC-6

Tüm stok birimleri ortak popup komponentini kullanmalıdır.

---

## AC-7

Sipariş toplama öncesinde tüm stok birimlerinde (ADET dahil) `GET api/unique-barcodes` sorgusu yapılmalıdır.

---

## AC-8

Status değeri `RECEIVING_SCANNED` olan barkodlar tekrar toplanamamalıdır (backend status'ü kendisi günceller).

---

## AC-9

Status değeri `RECEIVING_SCANNED` olmayan barkodlarda response'tan dönen `quantity` değeri teslim miktarı olarak kullanılmalıdır; `OrderQuantityInput` açılmaz.

---

## AC-10

Sipariş toplama sırasında `api/aur-tmp-detail` çağrısı yalnızca barkod daha önce toplanmamışsa yapılmalıdır.
