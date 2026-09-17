# WMS · Depo Yönetim Sistemi

Depo operasyonlarının uçtan uca yönetildiği web arayüzü: mal kabul, adresleme,
toplama, sayım, sevkiyat ve raporlama. React (Create React App) + MUI ile
geliştirilir, üretimde statik olarak build edilip Nginx üzerinden sunulur.

Ürün **white-label** çalışır: uygulama içinde hiçbir müşteri/firma adı sabit
yazılmaz, marka bilgileri build anında ortam değişkenleriyle verilir.

## Gereksinimler

- Node.js 18+
- npm 9+
- Erişilebilir bir WMS API sunucusu (geliştirmede proxy ile bağlanılır)

## Kurulum

```bash
npm install
cp .env.example .env.local   # API adresini ve markayı buradan ayarlayın
npm start
```

Uygulama http://localhost:3000 adresinde açılır. `npm start` sırasında `/api` ve
WebSocket istekleri [src/setupProxy.js](src/setupProxy.js) üzerinden `.env.local`
içindeki `API_PROXY_TARGET` / `WS_PROXY_TARGET` adreslerine yönlendirilir.
Yazdırma isteklerinin (`/api/print`) hedefi ayrıdır: döküman servisi başka bir
portta çalıştığı için bu yol `PRINT_PROXY_TARGET` (varsayılan
`http://localhost:3200`) adresine gider.

### WebSocket yolu hakkında

webpack-dev-server kendi hot-reload soketini `/ws` yolunda açar ve upgrade
isteklerini proxy'den **önce** yakalar. Bu yüzden geliştirmede uygulamanın
bildirim soketi `/ws` üzerinden backend'e ulaşamaz; sessizce hot-reload
soketine bağlanır. Çözüm olarak yol yapılandırılabilir yapılmıştır:
`.env.local` içine `REACT_APP_WS_PATH=/wsapi` yazıldığında hem tarayıcı tarafı
([src/config/api.js](src/config/api.js)) hem de proxy aynı yolu kullanır.
Üretimde dev-server olmadığı için değişken tanımlanmaz ve varsayılan `/ws`
geçerlidir.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm start` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (`build/`) |
| `npm test` | Testler |
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
dosyalar ve [public/index.html](public/index.html) içindeki `<title>` ile
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

## Dağıtım

[Dockerfile](Dockerfile) çok aşamalı derleme yapar ve çıktıyı
[nginx.conf](nginx.conf) ile Nginx üzerinden sunar:

```bash
docker build -t wms-web:latest .
docker run -p 8080:80 wms-web:latest
```

Kubernetes'e dağıtım henüz pipeline'a bağlı değildir; imaj GHCR'dan çekilerek
hedef ortama elle ya da ayrı bir deploy workflow'u ile uygulanır.

## Yazdırma şablonları

PDF çıktıları sunucudaki pug şablonları ile üretilir. Şablon adları
`src/config/brand.js` içindeki `printTemplates` altında toplanmıştır ve
`REACT_APP_PRINT_TEMPLATE_*` değişkenleriyle kuruluma göre değiştirilebilir.
