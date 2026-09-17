# Mikro `executeServiceMikro` Servisleri

Mikro ERP'ye yapılan tüm sorgular tek bir generic endpoint üzerinden geçer. Hangi Mikro
servisinin çalışacağı, HTTP yolu yerine request gövdesindeki `serviceName` alanıyla belirlenir.

Bu dokümanda projede kullanılan **6 farklı `serviceName`** ve her birinin request/response
yapısı yer alıyor.

> **Response alanları hakkında:** Backend sözleşmesi (DTO/şema) bu repoda bulunmuyor.
> Aşağıdaki response alanları, frontend'in dönen veriden fiilen okuduğu alanlardan
> türetilmiştir. Yani "kullanılan alanlar" listesidir; Mikro'nun döndürdüğü tam alan
> kümesi daha geniş olabilir.

---

## Ortak Zarf

Tüm çağrılar aynı POST zarfını kullanır. Zarf iki yardımcıdan biriyle üretilir:
`usePayload` hook'u (token'ı `AuthContainer`'dan alır) veya `generatePayload` fonksiyonu
(token'ı `localStorage`'dan alır).

```
POST /api/executeServiceMikro
```

**Headers**

| Header | Değer |
|---|---|
| `Authorization` | `Bearer <token>` |
| `Content-Type` | `application/json` |

**Request Body**

```json
{
  "serviceName": "<servisAdı>",
  "data": { }
}
```

**Response**

Her serviste **dizi** (`[]`) döner. Tekil sonuç beklenen yerlerde `res[0]` okunur, boş
dizi "kayıt bulunamadı" anlamına gelir. `response.ok` değilse gövde JSON hata olarak
parse edilip `Error` fırlatılır.

**İlgili dosyalar**

| Dosya | Rol |
|---|---|
| `src/services/MikroService.js` | `executeServiceMikro(payload)` — fetch sarmalayıcı |
| `src/hooks/usePayload.js` | Zarf üreticisi (React context token) |
| `src/utils/Utils.js` | `generatePayload(body)` — zarf üreticisi (localStorage token) |

---

## Servis Özeti

| # | `serviceName` | Amaç | Kullanım |
|---|---|---|---|
| 1 | `stokService.stokDetaySorgula` | Barkod/stok kodundan ürün detayı | 6 |
| 2 | `depoService.getOrderDetailList` | Sipariş kalemleri + sevk adresi | 3 |
| 3 | `depoService.getFirmListOrderExists` | Açık siparişi olan cari listesi | 2 |
| 4 | `irsaliyeService.irsaliyeSorgula` | İrsaliye kaynak dağılımı (dashboard) | 2 |
| 5 | `irsaliyeService.irsaliyeSorgula1` | İrsaliye kontrol listesi (detaylı) | 1 |
| 6 | `depoService.getFirmStockOrderList` | FMK sipariş kalemleri | 1 |

Servis grupları: `stokService` (1 servis), `depoService` (3 servis), `irsaliyeService` (2 servis).

---

## 1. `stokService.stokDetaySorgula`

Barkod veya stok kodundan Mikro ürün detayını getirir. Projede en çok kullanılan servis.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `stokKodu` | `String` | Stok kodu ile arama. Kullanılmıyorsa `''` |
| `stokAdi` | `String` | **Her çağrıda `''` gönderiliyor** — arama kriteri olarak hiç kullanılmamış |
| `barkod` | `String` | Tekil barkod ile arama. Kullanılmıyorsa `''` |
| `barkodList` | `String[]` | Toplu barkod sorgusu. Kullanılmıyorsa `['']` (boş string içeren dizi) |
| `depoNo` | `String \| Number` | Aktif depo kodu. Sayım ekranında `0` geçilir |

Üç arama modu vardır; hangi alanın dolu olduğu sorgu tipini belirler:

```js
// barkod ile
{ stokKodu: '', stokAdi: '', barkod: '8690000000000', barkodList: [''], depoNo: 1 }

// stok kodu ile
{ stokKodu: 'STK001', stokAdi: '', barkod: '', barkodList: [''], depoNo: 1 }

// toplu barkod listesi ile
{ stokKodu: '', stokAdi: '', barkod: '', barkodList: ['869...1', '869...2'], depoNo: 1 }
```

**Response**

```json
[
  {
    "stokKodu": "STK001",
    "stokAdi": "ÜRÜN ADI",
    "barkod": "8690000000000",
    "stokBirimi": "ADET",
    "depodakiMiktar": 120,
    "description": null
  }
]
```

| Alan | Açıklama |
|---|---|
| `stokKodu` | Mikro stok kodu |
| `stokAdi` | Ürün adı |
| `barkod` | Ürün barkodu (boş olabilir — "Barkodsuz" olarak gösterilir) |
| `stokBirimi` | Ölçü birimi; parça birimi olarak kullanılır, yoksa `ADET`'e düşülür |
| `depodakiMiktar` | Mikro'daki depo stok miktarı |
| `description` | Serbest ek bilgi |

**Kullanıldığı yerler**

| Dosya | Satır | Arama modu |
|---|---|---|
| `src/container/Product-Address-Process/ProductAddressSearchContainer.jsx` | 41 | `barkod` |
| `src/container/Search/GlobalSearch/useGlobalSearch.js` | 36 | `barkod` / `stokKodu` (dinamik alan) |
| `src/container/Search/GlobalSearch/useGlobalSearch.js` | 106 | `barkodList` (toplu) |
| `src/container/Product-Address-Definition/ProductBarcodeContainer.jsx` | 22 | `barkod` |
| `src/container/Sevk/AssignedDispatchmentContainer.jsx` | 168 | `stokKodu` |
| `src/container/Counting-Terminal/CountingBarcodeContainer.jsx` | 39 | `barkod`, `depoNo: 0` |

---

## 2. `depoService.getOrderDetailList`

Sipariş numarası listesinden kalem detaylarını ve sevk adresi bilgisini getirir.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `orderNoList` | `String[]` | Sorgulanacak sipariş numaraları |
| `sipTip` | `Number` | Sipariş tipi; bu servette her zaman `0` |
| `depoList` | `Number[]` | Depo kodları dizisi, örn. `[1]` |

```json
{
  "serviceName": "depoService.getOrderDetailList",
  "data": { "orderNoList": ["A-123", "A-124"], "sipTip": 0, "depoList": [1] }
}
```

**Response**

```json
[
  {
    "orderNo": "A-123",
    "sipUid": "…",
    "stokKodu": "STK001",
    "stokAdi": "ÜRÜN ADI",
    "barkod": "8690000000000",
    "siparisMiktar": 10,
    "teslimMiktar": 4,
    "stokMiktar": 120,
    "teslimTarihi": "2026-09-20T00:00:00",
    "kullaniciAdi": "AHMET",
    "sipDurum": "Hazırlanıyor",
    "onayDurum": "Onaysız",
    "aktif": false,
    "addressNo": 7,
    "sevkAddress": "İstanbul/Kadıköy",
    "sevkAcikAdres": "…",
    "sevkTel": "…",
    "sevkMuhatap": "…",
    "firmName": "…"
  }
]
```

| Alan | Açıklama |
|---|---|
| `orderNo` | Mikro sipariş no |
| `sipUid` | Sipariş kalemi tekil anahtarı |
| `stokKodu`, `stokAdi`, `barkod` | Ürün bilgisi |
| `siparisMiktar` | Sipariş miktarı |
| `teslimMiktar` | Sevk edilmiş miktar |
| `stokMiktar` | Mikro'daki mevcut stok |
| `teslimTarihi` | ISO tarih; ekranda ilk 10 karakter gösterilir |
| `kullaniciAdi` | Siparişe atanan kullanıcı (boş olabilir) |
| `sipDurum` | Sipariş durumu; boşsa `Hazırlanıyor` varsayılır |
| `onayDurum` | Onay durumu; boşsa `Onaysız` varsayılır |
| `aktif` | Satırın vurgulanıp vurgulanmayacağı |
| `addressNo` | Sevk adresi ID'si |
| `sevkAddress` | İl/İlçe |
| `sevkAcikAdres`, `sevkTel`, `sevkMuhatap` | Sevk adresi detayı |
| `firmName` | Firma adı |

**Not:** Tabloda görünen `sevkHazirMiktar` (Sevk Edilebilir Miktar) response'ta **yoktur**,
`min(stokMiktar, siparisMiktar)` ile hesaplanır ve `stokMiktar <= 0` ise `0` olur.

Sevk adresi bloğu (`addressNo`, `sevkAddress`, `sevkTel`, `sevkMuhatap`, `sevkAcikAdres`)
yalnızca **ilk satırdan** (`res[0]`) okunur; tüm kalemler aynı sevk adresine ait varsayılır.

**Kullanıldığı yerler**

| Dosya | Satır | Not |
|---|---|---|
| `src/components/Dialog/OrderDialog.jsx` | 26 | Dialog'da seçilen siparişler |
| `src/container/Sevk/FirmayaSevkiyat/OrderProgressSevkiyat.jsx` | 293 | Toplayıcı seçimi sonrası |
| `src/container/Sevk/FirmayaSevkiyat/OrderProgressSevkiyat.jsx` | 302 | URL'den gelen ilk yükleme |

---

## 3. `depoService.getFirmListOrderExists`

Açık siparişi bulunan cari (firma) listesini getirir.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `sipTip` | `Number` | Sipariş tipi; her iki çağrıda da `0` |
| `depoNo` | `String \| Number` | Aktif depo kodu |
| `cbt` | `Number` | Cari bağlantı tipi; her iki çağrıda da `2` |
| `cariKod` | `String` | `'ALL'` → tüm cariler; gerçek kod → tek cari |

İki kullanım arasındaki **tek fark `cariKod`**'dur:

```json
{ "sipTip": 0, "depoNo": 1, "cbt": 2, "cariKod": "ALL" }
{ "sipTip": 0, "depoNo": 1, "cbt": 2, "cariKod": "120.01" }
```

**Response**

```json
[{ "cariKod": "120.01", "cariUnvan": "ÖRNEK FİRMA A.Ş.", "bolgeAdi": "MARMARA" }]
```

| Alan | Açıklama |
|---|---|
| `cariKod` | Cari kodu; liste anahtarı ve yönlendirme parametresi |
| `cariUnvan` | Cari ünvanı; arama ve sıralama bu alan üzerinden yapılır |
| `bolgeAdi` | Bölge adı; ikinci sıralama seçeneği |

**Kullanıldığı yerler**

| Dosya | Satır | `cariKod` |
|---|---|---|
| `src/container/Sevk/SelectCari/CariSelect.jsx` | 49 | `'ALL'` — liste ekranı |
| `src/container/Sevk/FirmayaSevkiyat/OrderProgressSevkiyat.jsx` | 217 | Gerçek cari kodu — direkt cari akışı |

---

## 4. `irsaliyeService.irsaliyeSorgula`

Dashboard donut grafiği için irsaliye kaynak (ERP/DYS) dağılımını getirir.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `firmCode` | `String` | Her zaman `''` — firma filtresi uygulanmıyor |
| `evrakTip` | `Number` | `13` mal kabul, `1` sevkiyat |
| `beginDate` | `String` | `YYYY-MM-DD 00:00:00`; son 7 gün |
| `endDate` | `String` | `YYYY-MM-DD 23:59:00` |

Mal kabul ve sevkiyat sorguları `Promise.all` ile **paralel** çalıştırılır.

```json
{ "firmCode": "", "evrakTip": 13, "beginDate": "2026-09-09 00:00:00", "endDate": "2026-09-16 23:59:00" }
```

**Response**

```json
[{ "kaynak": "DYS" }]
```

| Alan | Açıklama |
|---|---|
| `kaynak` | `'ERP'` (Mikro) veya `'DYS'` (bu uygulama) |

Yalnızca `kaynak` okunur; `ERP`/`DYS` sayılıp DYS yüzdesi hesaplanır.

**Kullanıldığı yer**

| Dosya | Satır | `evrakTip` |
|---|---|---|
| `src/container/Dashboard/WaybillChartContainer.jsx` | 102 | `13` (mal kabul) |
| `src/container/Dashboard/WaybillChartContainer.jsx` | 112 | `1` (sevkiyat) |

---

## 5. `irsaliyeService.irsaliyeSorgula1`

İrsaliye kontrol listesi. `irsaliyeSorgula`'dan iki farkı var: **`kaynak` filtre
parametresi alır** ve satır bazında detaylı veri döner.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `firmCode` | `String` | Her zaman `''` |
| `evrakTip` | `Number \| null` | `1` sevkiyat, `13` mal kabul, `null` tümü |
| `kaynak` | `String` | `'DYS'`, `'ERP'` veya `''` (tümü) |
| `beginDate` | `String` | `YYYY-MM-DD HH:mm:ss` |
| `endDate` | `String` | `YYYY-MM-DD HH:mm:ss` |

Filtreler URL query string'ine serialize edilir; varsayılan `evrakTip: '1'`,
`kaynak: 'DYS'`, son 7 gün.

**Response**

```json
[
  {
    "evrakSeri": "A",
    "evrakSira": 1234,
    "siparisNo": "SIP-001",
    "cariKod": "120.01",
    "cariUnvan": "ÖRNEK FİRMA A.Ş.",
    "evrakTip": 1,
    "tarih": "2026-09-15T10:30:00",
    "kullanici": "AHMET",
    "kaynak": "DYS"
  }
]
```

| Alan | Açıklama |
|---|---|
| `evrakSeri`, `evrakSira` | İrsaliye no bileşenleri |
| `siparisNo` | İlişkili sipariş no |
| `cariKod`, `cariUnvan` | Cari bilgisi |
| `evrakTip` | `1` Sevkiyat, `13` Mal Kabul; chip olarak gösterilir |
| `tarih` | ISO tarih; `DD/MM/YYYY` olarak formatlanır |
| `kullanici` | İşlemi yapan kullanıcı |
| `kaynak` | `'ERP'` → "Mikro" etiketi, `'DYS'` → "DYS" etiketi |

**Not:** Response'ta **`irsaliyeNo` alanı yoktur**; `${evrakSeri}-${evrakSira}` olarak
birleştirilir. DataGrid satır `id`'si de `${evrakSeri}-${evrakSira}-${cariKod}-${index}`
şeklinde üretilir. Tüm alanlar `?? '-'` ile boşa karşı korunur.

**Kullanıldığı yer**

`src/container/WaybillControl/WaybillControlContainer.jsx:165`

---

## 6. `depoService.getFirmStockOrderList`

FMK (firma mal kabul) akışında sipariş kalemlerini getirir.

**Request `data`**

| Alan | Tip | Açıklama |
|---|---|---|
| `depoNo` | `Number` | Aktif depo kodu (`Number`'a çevrilir) |
| `firmCode` | `String` | Firma kodu |
| `sipTip` | `Number` | `orderType === 'FMK'` ise `1`, değilse `0` |

```json
{ "serviceName": "depoService.getFirmStockOrderList", "data": { "depoNo": 1, "firmCode": "F001", "sipTip": 1 } }
```

**Response**

```json
[
  {
    "stokKodu": "STK001",
    "stokAdi": "ÜRÜN ADI",
    "siparisMiktar": 10,
    "teslimMiktar": 4,
    "sipUid": "…",
    "orderNo": "A-123"
  }
]
```

| Alan | Açıklama |
|---|---|
| `stokKodu` | Stok kodu; FMK akışında liste anahtarı olarak kullanılır |
| `stokAdi` | Ürün adı; arama bu alan ve `stokKodu` üzerinden yapılır |
| `siparisMiktar` | Sipariş miktarı |
| `teslimMiktar` | Teslim edilmiş miktar |
| `sipUid` | MSK akışında liste anahtarı |
| `orderNo` | Sipariş no |

**Kullanıldığı yer**

`src/container/Order-Edit/OrderEditContainer.jsx:76`

---

## Gözlemler

- **`irsaliyeSorgula` ve `irsaliyeSorgula1` ayrı iki servis olarak çağrılıyor.** Sondaki
  `1` kasıtlı bir backend varyantı mı, yoksa artık bir isimlendirme mi netleştirilmeli.
  İşlevsel fark: `irsaliyeSorgula1` `kaynak` filtresi alır ve satır detayı döner.
- **`stokDetaySorgula` request'inde `stokAdi` her çağrıda `''`.** Servis ürün adıyla
  aramayı destekliyorsa bu kullanılmayan bir kapasite.
- **`barkodList: ['']`** boş string içeren dizi olarak gönderiliyor. Yalnızca
  `useGlobalSearch.js:105` gerçek bir toplu liste besliyor.
- **Tüm `serviceName` değerleri string literal.** Hiçbir yerde değişkenden gelmiyor,
  dolayısıyla bu liste eksiksizdir.
