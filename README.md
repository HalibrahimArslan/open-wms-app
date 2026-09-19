# WMS · Depo Yönetim Sistemi

Depo operasyonlarının uçtan uca yönetildiği web arayüzü: mal kabul, adresleme,
toplama, sayım, sevkiyat ve raporlama. React (Vite) + MUI ile
geliştirilir, üretimde statik olarak build edilip Nginx üzerinden sunulur.

Ürün **white-label** çalışır: uygulama içinde hiçbir müşteri/firma adı sabit
yazılmaz, marka bilgileri build anında ortam değişkenleriyle verilir.

## Gereksinimler

- Node.js 22.22+ (önerilen sürüm `.nvmrc` içinde: 24)
- npm 10+
- Erişilebilir bir WMS API sunucusu (geliştirmede proxy ile bağlanılır)

## Kurulum

```bash
npm install
cp .env.example .env.local   # API adresini ve markayı buradan ayarlayın
npm start
```

Uygulama http://localhost:3000 adresinde açılır. `npm start` sırasında `/api` ve
WebSocket istekleri [vite.config.mjs](vite.config.mjs) içindeki proxy ile
`.env.local` dosyasındaki `API_PROXY_TARGET` / `WS_PROXY_TARGET` adreslerine
yönlendirilir. Yazdırma isteklerinin (`/api/print`) hedefi ayrıdır: döküman
servisi başka bir portta çalıştığı için bu yol `PRINT_PROXY_TARGET` (varsayılan
`http://localhost:3200`) adresine gider.

Bildirim soketi varsayılan olarak `/ws` yolunu kullanır. Farklı bir yol
gerekirse `REACT_APP_WS_PATH` ile verilir; hem tarayıcı tarafı
([src/config/api.js](src/config/api.js)) hem de geliştirme proxy'si aynı değeri
okur. (CRA döneminde webpack-dev-server `/ws` yolunu sahiplendiği için
geliştirmede `/wsapi` gibi bir yol gerekiyordu; Vite'ın hot-reload soketi bu
yolu kullanmadığı için artık zorunlu değil.)

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm start` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (`build/`) |
| `npm run preview` | Üretim derlemesini yerelde, proxy ile birlikte sunar |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` / `npm run format:check` | Prettier |

Commit öncesi husky + lint-staged, değişen dosyalarda ESLint ve Prettier
çalıştırır.

## Markalama (white-label)

Marka katmanı tek bir yerde toplanmıştır: [src/config/brand.js](src/config/brand.js).
Ekranlarda logo [src/components/Brand/BrandLogo.jsx](src/components/Brand/BrandLogo.jsx)
ile basılır; `REACT_APP_BRAND_LOGO_URL` verilmediğinde uygulama tema renklerini
kullanan vektörel markasını çizer, dolayısıyla yeni bir kurulum için görsel
üretmek zorunlu değildir.

Kullanılabilir değişkenler [.env.example](.env.example) dosyasında listelenmiştir.
`REACT_APP_*` değişkenleri **derleme anında** gömülür; müşteriye özel bir imaj
için değerleri `npm run build` / `docker build` adımında verin.

Favicon ve PWA ikonları `public/` altındadır (`favicon.ico`, `brand-mark.svg`,
`logo192.png`, `logo512.png`, `apple-touch-icon.png`); müşteriye özel imajda bu
dosyalar ve [index.html](index.html) içindeki `<title>` ile
`manifest.json` değerleri değiştirilir. Uygulama içi başlıklar Helmet ile
`BRAND` üzerinden yazıldığı için ayrıca elle düzenlenmez.

## Proje yapısı

```
src/
  components/   Paylaşılan sunum bileşenleri (Brand, Card, Table, Dialog, ...)
  config/       Ortam ve marka yapılandırması
  container/    Ekran bazlı iş mantığı (Receiving, Order-Tracing, Counting, ...)
  view/         Sayfa kabukları ve auth ekranları
  layout/       Uygulama iskeleti, menü ve sidebar
  services/     API çağrıları (dosya başına bir kaynak)
  store/        unstated-next container'ları ile global state
  shared/       Çapraz kullanılan yardımcı bileşenler
  theme/        MUI light/dark tema tanımları
```

Servis katmanında `fetch` ile başlayan fonksiyon adları ESLint kuralı ile
yasaklanmıştır; çağrı fonksiyonlarını `get*`, `post*`, `update*` gibi adlandırın.

## CI / CD

[.github/workflows/ci.yml](.github/workflows/ci.yml) her push ve pull request'te
Prettier, ESLint ve üretim derlemesini çalıştırır. `main` dalına push
edildiğinde ayrıca Docker imajını derleyip GitHub Container Registry'ye
(`ghcr.io/<org>/<repo>`) `latest` ve `<paket sürümü>-<run numarası>` etiketleriyle
gönderir.

Ek bir secret tanımlamak gerekmez; GHCR oturumu için Actions'ın kendi
`GITHUB_TOKEN`'ı kullanılır. İmajın yazılabilmesi için depo ayarlarında
Settings > Actions > General > Workflow permissions'ın "Read and write" olması
yeterlidir.

### Bağımlılık güncellemeleri

[.github/dependabot.yml](.github/dependabot.yml) her pazartesi npm paketlerini,
GitHub Actions adımlarını ve Dockerfile temel imajlarını kontrol edip pull
request açar. Küçük güncellemeler (minor/patch) tek PR'da toplanır; ana
sürümler kırıcı değişiklikleri tek tek incelenebilsin diye ayrı ayrı gelir.
Açılan PR'larda CI iş akışı çalışır, yani Prettier, ESLint ve üretim derlemesi
güncellemeyi birleştirmeden önce doğrular.

`xlsx` bunun dışındadır: npm'deki son sürüm (0.18.5) güvenlik açığı içerdiği ve
SheetJS artık npm'e yayın yapmadığı için paket CDN'deki tarball'dan kurulur
([cdn.sheetjs.com](https://cdn.sheetjs.com)). Dependabot bu tür bağımlılıkları
takip edemediğinden yeni sürümü elle kontrol etmek gerekir.

## Dağıtım

[Dockerfile](Dockerfile) çok aşamalı derleme yapar: React çıktısı Nginx imajına
kopyalanır ve [nginx.conf.template](nginx.conf.template) ile sunulur.

Bu Nginx yalnızca statik dosya sunmaz, **aynı zamanda ters vekildir**. Uygulama
`/api` ve `/ws` çağrılarını sayfayla aynı origin'e relative yapar
([src/config/api.js](src/config/api.js)), dolayısıyla bu yolların backend'e
iletilmesi gerekir. Yönlendirme tablosu geliştirmedeki
[vite.config.mjs](vite.config.mjs) proxy'si ile birebir aynıdır:

| Yol | Hedef |
| --- | --- |
| `/api/print` | Döküman (print) servisi — `PRINT_UPSTREAM` |
| `/api` | WMS API — `API_UPSTREAM` |
| `/ws` | WMS API, WebSocket upgrade ile — `API_UPSTREAM` |
| `/` | Statik build, SPA fallback ile |
| `/healthz` | Container'ın kendi sağlık yanıtı (backend'e dokunmaz) |

Hedefler **çalışma anında** verilir; `REACT_APP_*` değişkenlerinden farkı budur,
değiştirmek için imaj yeniden derlenmez:

| Değişken | Varsayılan | Açıklama |
| --- | --- | --- |
| `API_UPSTREAM` | `backend:3000` | WMS API adresi (`host:port`) |
| `PRINT_UPSTREAM` | `print:3200` | Döküman servisi adresi |
| `DNS_RESOLVER` | `127.0.0.11` | Docker'ın gömülü DNS'i; upstream adresleri periyodik yeniden çözülür, böylece backend yeniden başlayıp IP değiştirdiğinde 502 oluşmaz |
| `MAX_UPLOAD_SIZE` | `50m` | `client_max_body_size` (dosya yükleme uçları) |

```bash
docker build -t wms-web:latest .
docker run -p 8080:80 \
  -e API_UPSTREAM=backend:3000 \
  -e PRINT_UPSTREAM=print:3200 \
  wms-web:latest
```

Aynı ağdaki servis adlarıyla çalışır; Compose kullanılıyorsa `API_UPSTREAM`
değeri backend servisinin adı olur. TLS bu container'da sonlanmaz: önde bir
vekil varsa `X-Forwarded-Proto` başlığı olduğu gibi backend'e geçirilir.

Kubernetes'e dağıtım henüz pipeline'a bağlı değildir; imaj GHCR'dan çekilerek
hedef ortama elle ya da ayrı bir deploy workflow'u ile uygulanır.

## Yazdırma şablonları

PDF çıktıları sunucudaki pug şablonları ile üretilir. Şablon adları
`src/config/brand.js` içindeki `printTemplates` altında toplanmıştır ve
`REACT_APP_PRINT_TEMPLATE_*` değişkenleriyle kuruluma göre değiştirilebilir.
