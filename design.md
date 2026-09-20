# Tasarım Rehberi

Bu dosya open-wms-app arayüzünün tasarım kurallarını anlatır. Amaç, ekranlar
farklı kişiler tarafından yazıldığında bile aynı görünmesi ve tema
değiştiğinde hiçbir ekranın bozulmamasıdır.

Tek kaynak [src/theme/theme.js](src/theme/theme.js) dosyasıdır. Aşağıdaki
değerler oradan alınmıştır; bir değer değişecekse önce orada değişir, bu dosya
sonra güncellenir.

## Temel kural: sabit renk yazma

Bileşenlerde `#ffffff`, `grey[100]` gibi sabit renkler kullanılmaz. Renk her
zaman palet token'ından okunur:

```jsx
// yanlış — karanlık temada zemin beyaz kalır
<Paper sx={{ backgroundColor: '#FFFFFF' }} />

// doğru
<Paper sx={{ backgroundColor: (theme) => theme.palette.surface.card }} />
```

Sebep: uygulama iki temada da çalışır ve sabit renkler yalnızca birinde
doğrudur. Karanlık tema daha önce bu yüzden okunamaz haldeydi.

## Renk paleti

### Marka renkleri

| Token                    | Açık tema | Karanlık tema | Kullanım                              |
| ------------------------ | --------- | ------------- | ------------------------------------- |
| `primary.main`           | `#582931` | `#9F606A`     | Dolgulu butonlar, seçili durum, vurgu |
| `primary.light`          | `#7A3D47` | `#C58791`     | Karanlıkta metin ve ikon rengi        |
| `primary.dark`           | `#3D1B22` | `#7A4750`     | Hover                                 |
| `secondary.main`         | `#F2E4E6` | `#1E1E1E`     | Sayfa gövdesi, header                 |
| `secondary.contrastText` | `#3D1B22` | `#EDEDED`     | Gövde üzerindeki metin                |

Marka bordosu karanlık temada açıltılır (`#9F606A`). Koyu zeminde orijinal
bordo hem seçilmiyor hem de üzerindeki beyaz yazı okunmuyordu. Dolgusuz
butonlarda (`outlined`, `text`) ve ikonlarda daha açık ton (`primary.light`)
kullanılır; bu MUI bileşen ayarlarında zaten tanımlıdır, ekranda tekrar
yazmaya gerek yoktur.

### Yüzeyler

Uygulamanın üç yüzey basamağı vardır: en altta `background.default`, üzerinde
sayfa gövdesi, en üstte kartlar. Basamaklar aşağıdan yukarı açılır.

| Token                | Açık tema | Karanlık tema            | Kullanım             |
| -------------------- | --------- | ------------------------ | -------------------- |
| `background.default` | `#FBF5F6` | `#121212`                | Uygulama zemini      |
| `surface.panel`      | `#FFFFFF` | `#1E1E1E`                | Sayfa paneli         |
| `surface.card`       | `#FFFFFF` | `#2D2D2D`                | Panel içindeki kart  |
| `surface.subtle`     | `#F5F5F5` | `#262626`                | İkincil kutu         |
| `surface.filter`     | `#F2F5FF` | `#262626`                | Filtre paneli zemini |
| `surface.hover`      | `#F2E4E6` | `rgba(255,255,255,0.08)` | Liste ve menü hover  |

Karanlık temada basamaklar arasındaki fark küçüktür, bu yüzden `Paper`
bileşenlerine ince bir `border.subtle` kenarlığı eklenir ve MUI'nin elevation
overlay'i kapatılır. Bu ayar temada tanımlıdır.

### Kenarlıklar

| Token           | Açık tema          | Karanlık tema            | Kullanım                |
| --------------- | ------------------ | ------------------------ | ----------------------- |
| `border.rest`   | `#D9C0C3`          | `rgba(255,255,255,0.18)` | Input ve kart çerçevesi |
| `border.hover`  | `#7A3D47`          | `#C58791`                | Hover                   |
| `border.focus`  | `#582931`          | `#9F606A`                | Odak                    |
| `border.subtle` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` | Kart ayırıcı            |

### Metin

| Token            | Açık tema | Karanlık tema |
| ---------------- | --------- | ------------- |
| `text.primary`   | `#2A1519` | `#EDEDED`     |
| `text.secondary` | `#6B4047` | `#A6A6A6`     |

### Durum renkleri

| Token          | Açık tema | Karanlık tema | Anlam                  |
| -------------- | --------- | ------------- | ---------------------- |
| `success.main` | `#CAD8BE` | `#A5C9A1`     | Tamamlanan işlem       |
| `warning.main` | `#D4845A` | `#E0A170`     | Dikkat, bekleyen işlem |
| `error.main`   | `#F88379` | `#E98D86`     | Hata, iptal            |

Durum yalnızca renkle anlatılmaz; yanında metin ya da ikon bulunur. Renk körü
kullanıcılar ve düşük kontrastlı ekranlar için gereklidir.

### Kontrast

Metin ve zemin arasında en az WCAG AA (normal metin 4.5:1, büyük metin 3:1)
oranı aranır. Yeni bir renk eklerken oran kontrol edilir; karanlık temadaki
sorunların tamamı bu kontrolün atlanmasından çıkmıştı.

## Tipografi

Yazı tipi Roboto'dur ve [index.html](index.html) içinde Google Fonts'tan
yüklenir (300, 400, 500, 700).

| Ayar                | Değer |
| ------------------- | ----- |
| `fontSize`          | 12    |
| `letterSpacing`     | 0.25  |
| `fontWeightLight`   | 100   |
| `fontWeightRegular` | 400   |
| `fontWeightMedium`  | 500   |
| `fontWeightBold`    | 700   |

Boyut `variant` üzerinden verilir (`h6`, `subtitle2`, `body2`), `fontSize` ile
piksel yazılmaz. Ekran başlıkları `ActionHeader` içinden gelir, ekranda ayrıca
başlık yazılmaz.

## Köşe yarıçapı

`theme.radius` ölçeği dıştan içe azalır. İç kutu dış kutudan daha oval
olmamalıdır.

| Token            | Değer  | Kullanım             |
| ---------------- | ------ | -------------------- |
| `radius.panel`   | `24px` | Sayfa gövdesi        |
| `radius.section` | `16px` | Gövde içindeki panel |
| `radius.card`    | `12px` | Panel içindeki kart  |
| `radius.control` | `8px`  | Buton, input, chip   |

Değerler bilerek string tutulur. MUI'nin `sx` prop'u `borderRadius`'a verilen
sayıyı `theme.shape.borderRadius` ile çarpar; sayı verilseydi aynı token `sx`
ve `styled()` içinde farklı sonuç üretirdi.

## İkonografi

- İkonlar `@mui/icons-material` setinden gelir. Aynı ekranda başka bir ikon
  seti (`react-icons` gibi) ile karıştırılmaz.
- Bir eylemin ikonu tüm ekranlarda aynıdır: filtre `FilterList`, filtre kapat
  `Close`, ekle `AddCircle`, yazdır `Print`, çıkış `Logout`.
- İkon boyutu `fontSize` prop'u ile verilir (`small`, `medium`), piksel
  yazılmaz. Tek istisna `ActionHeader`'ın kendi ekle düğmesidir.
- Yalnızca ikondan oluşan her düğmede `aria-label` ve `Tooltip` bulunur.
  Ekran okuyucu için metin, fare kullanıcısı için ipucu gerekir.

## Ekran düzeni

### Başlık ve ekran aksiyonları

Her liste ekranı [ActionHeader](src/shared/components/ActionHeader.jsx) ile
başlar. Ekrana ait aksiyonlar — filtre aç/kapa, dışa aktarma, ekle — başlığın
**tam karşısında, aynı satırda** durur. Başlığın altında ayrı bir aksiyon
satırı açılmaz; ekrandan ekrana değişen yerleşim bu yüzden ortaya çıkıyordu.

```jsx
<ActionHeader
  title={'İrsaliye Kontrol'}
  hide={true}
  actions={
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Button variant="outlined" onClick={handleExportExcel}>
        Excel
      </Button>
      <FilterToggleButton open={filtersOpen} onToggle={() => setFiltersOpen((p) => !p)} />
    </Stack>
  }
/>
```

`actions` içinde sıralama soldan sağa: önce dışa aktarma ve ikincil düğmeler,
en sağda filtre düğmesi, ondan sonra `ActionHeader`'ın kendi ekle düğmesi.

### Filtre

Filtre açıp kapatan düğme her ekranda
[FilterToggleButton](src/shared/components/FilterToggleButton.jsx) bileşenidir:
aynı ikon, aynı ipucu, aynı yer. Kendi `IconButton`'ını yazan ekran olmaz.

Filtre alanı `Collapse` içinde, `surface.filter` zeminli bir `Paper` olarak
başlığın hemen altında açılır. Sorgu parametresine bağlı filtreler için
[QueryFilterPanel](src/components/Filter/QueryFilterPanel.jsx) kullanılır.

### Boş durum

Liste boşken tablo boş bırakılmaz;
[EmptyState](src/shared/components/EmptyState/EmptyState.jsx) gösterilir.
Bileşen `title`, `description`, `icon`, `action` alır. Metin kullanıcıya ne
yapacağını söyler ("Filtreleri temizleyerek tekrar deneyin"), yalnızca "Kayıt
bulunamadı" demez.

### Sık kullanılan bileşenler

| Bileşen                                                                           | Ne zaman                                |
| --------------------------------------------------------------------------------- | --------------------------------------- |
| [ActionHeader](src/shared/components/ActionHeader.jsx)                            | Her liste ekranının başlığı             |
| [FilterToggleButton](src/shared/components/FilterToggleButton.jsx)                | Filtre aç/kapa                          |
| [EmptyState](src/shared/components/EmptyState/EmptyState.jsx)                     | Boş liste, sonuçsuz arama               |
| [SplitButton](src/components/Button/SplitButton.jsx)                              | Birincil eylem + yanında alternatifleri |
| [SearchBox](src/components/SearchBox.jsx)                                         | Liste içi arama kutusu                  |
| [ImageViewer](src/shared/components/ImageViewer/ImageViewer.jsx)                  | Görsel önizleme                         |
| [SwipeableDrawerWrapper](src/shared/components/Slider/SwipeableDrawerWrapper.jsx) | Mobilde alttan açılan panel             |

Yeni bir düğme ya da kutu yazmadan önce bu listeye bakılır. Aynı işi yapan
ikinci bir bileşen eklendiğinde iki ekran birbirinden ayrışır.

## Tema değiştirme

Tema `ThemeContainer` store'unda tutulur
([src/store/ThemeContainer.js](src/store/ThemeContainer.js)) ve header'daki
menüden değiştirilir. Anahtar
([ThemeSwitchButton](src/components/Switch/ThemeSwitchButton.jsx)) hangi
temada olunduğunu hem konumu hem rengiyle gösterir: açık temada turuncu zemin
üzerinde güneş, karanlık temada lacivert zemin üzerinde sarı ay.

Yeni bir ekran yazıldığında iki temada da açılıp bakılır. Karanlık tema
sonradan kontrol edilen bir şey değildir.

## Yeni ekran açarken kontrol listesi

- [ ] Başlık `ActionHeader` ile verildi, ekran aksiyonları `actions` içinde.
- [ ] Filtre düğmesi `FilterToggleButton`.
- [ ] Hiçbir yerde sabit renk yok, hepsi palet token'ı.
- [ ] Köşe yarıçapları `theme.radius` ölçeğinden ve dıştan içe azalıyor.
- [ ] Yalnızca ikondan oluşan düğmelerde `aria-label` ve `Tooltip` var.
- [ ] Boş liste durumu `EmptyState` ile karşılandı.
- [ ] Ekran hem açık hem karanlık temada açılıp kontrol edildi.
- [ ] Mobil genişlikte yatay kaydırma oluşmuyor.

---

Not: Bu rehberde ekran görüntüsü yoktur. Görüntüler ilk tema değişikliğinde
eskiyip yanıltıcı hale geldiği için, kurallar kod referanslarıyla
anlatılmıştır; güncel hali görmek için ilgili dosya açılır.
