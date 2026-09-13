# Unique Barcode API Dokümantasyonu

## Endpoint'ler

### `POST /api/unique-barcodes`
Yeni tekil barkod(lar) oluşturur. `adet` sayısı kadar barkod üretir.

**Request Body:** `UniqueBarcodeCreateDTO`  
**Response:** `List<UniqueBarcodeResponseDTO>`

---

### `GET /api/unique-barcodes`
Tekil barkodları sayfalı ve filtreli listeler.

**Query Parameters:**

| Parametre | Tip | Açıklama |
|---|---|---|
| `erpOrderInfo` | `StringFilter` | ERP sipariş bilgisine göre filtre (equals, contains, vb.) |
| `page` | `int` | Sayfa numarası (0'dan başlar) |
| `size` | `int` | Sayfa başı kayıt sayısı |
| `sort` | `string` | Sıralama: `id,asc` / `id,desc` |

**Response:** `List<UniqueBarcodeResponseDTO>` (header'da pagination bilgisi)

---

## DTO'lar

### `UniqueBarcodeCreateDTO` — POST body

| Alan | Tip | Zorunlu | Kural | Açıklama |
|---|---|---|---|---|
| `product` | `ProductWithoutAddressDTO` | **Evet** | `@NotNull`, iç alanlar da valide edilir | Ürün bilgisi |
| `customerCode` | `String` | **Evet** | `@NotBlank` | Müşteri kodu |
| `erpOrderNo` | `String` | **Evet** | `@NotBlank` | ERP sipariş numarası |
| `receivingDate` | `String` | **Evet** | `@NotBlank`, `yyMMdd` formatı (örn: `251126`) | Giriş tarihi |
| `adet` | `Integer` | **Evet** | `@NotNull`, `@Positive`, max 9 hane, tam sayı | Üretilecek barkod adedi |
| `quantity` | `BigDecimal` | **Evet** | `@NotNull`, `@Positive` | Her barkodun miktarı |
| `status` | `UniqueBarcodeState` | Hayır | `CREATED` \| `RECEIVING_SCANNED` | Başlangıç durumu (verilmezse servis set eder) |
| `description` | `Map<String, Object>` | Hayır | — | Serbest ek bilgi alanı |

#### `product` alanı — `ProductWithoutAddressDTO`

| Alan | Tip | Zorunlu | Açıklama |
|---|---|---|---|
| `barcode` | `String` | **Evet** (`@NotNull`) | Ürün barkodu |
| `companyCode` | `String` | **Evet** (`@NotBlank`) | Firma kodu |
| `stokAdi` | `String` | **Evet** (`@NotBlank`) | Stok adı |
| `stokKodu` | `String` | **Evet** (`@NotBlank`) | Stok kodu |
| `anaGrup` | `String` | **Evet** (`@NotNull`) | Ana grup |
| `kategoriAdi` | `String` | **Evet** (`@NotNull`) | Kategori adı |
| `stokBirimi` | `String` | **Evet** (`@NotBlank`) | Stok birimi (kg, adet, vb.) |
| `miktar` | `Double` | Hayır | Miktar |
| `description` | `String` | Hayır | Ürün açıklaması |
| `sktFlag` | `Boolean` | Hayır | SKT takibi açık mı? (default: `false`) |

---

### `UniqueBarcodeResponseDTO` — Response

| Alan | Tip | Açıklama |
|---|---|---|
| `id` | `Long` | Barkod ID'si |
| `barcode` | `String` | Üretilen tekil barkod değeri |
| `partiCode` | `String` | Parti kodu |
| `lotNumber` | `Long` | Lot numarası |
| `status` | `UniqueBarcodeState` | Durum: `CREATED` \| `RECEIVING_SCANNED` |
| `quantity` | `BigDecimal` | Miktar |
| `receivingDate` | `Instant` | Giriş tarihi (ISO 8601) |
| `customerCode` | `String` | Müşteri kodu |
| `erpOrderInfo` | `String` | ERP sipariş bilgisi |
| `description` | `Map<String, Object>` | Ek bilgi |
| `stokKodu` | `String` | Stok kodu |
| `stokAdi` | `String` | Stok adı |
| `anaGrup` | `String` | Ana grup |
| `kategoriAdi` | `String` | Kategori adı |
| `stokBirimi` | `String` | Stok birimi |
| `barkod` | `String` | Ürünün orijinal barkodu |

---

### Örnek Request (POST)

```json
{
  "product": {
    "barcode": "8690123456789",
    "companyCode": "AUR",
    "stokAdi": "Örnek Ürün",
    "stokKodu": "STK001",
    "anaGrup": "HAMMADDE",
    "kategoriAdi": "KAT-A",
    "stokBirimi": "KG",
    "sktFlag": false
  },
  "customerCode": "MUS001",
  "erpOrderNo": "ERP-2025-001",
  "receivingDate": "251126",
  "adet": 5,
  "quantity": 10.500
}
```

> `adet: 5` ile çağrılırsa response'da 5 ayrı barkod dönecektir.