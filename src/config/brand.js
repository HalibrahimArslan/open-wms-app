/**
 * Uygulamanin marka katmani.
 *
 * Urun beyaz etiketli (white-label) calisir: varsayilan degerler notr "WMS"
 * markasidir, her kurulum bu degerleri build sirasinda REACT_APP_* ortam
 * degiskenleri ile ezebilir. Kod icinde firma ismi sabit yazilmaz, daima
 * buradaki BRAND uzerinden okunur.
 */

const readEnv = (key, fallback) => {
  const value = import.meta.env[key]
  return value === undefined || value === '' ? fallback : value
}

const BRAND = {
  /** Kisa urun adi. Sekme basligi, manifest ve rozetlerde kullanilir. */
  shortName: readEnv('REACT_APP_BRAND_SHORT_NAME', 'WMS'),

  /** Tam urun adi. Giris ekrani ve dashboard basliklarinda kullanilir. */
  name: readEnv('REACT_APP_BRAND_NAME', 'WMS'),

  /** Urun adinin altinda gosterilen aciklama. */
  tagline: readEnv('REACT_APP_BRAND_TAGLINE', 'Depo Yönetim Sistemi'),

  /**
   * Dashboard'da kullanici adinin onunde gosterilen selamlama. Ad henuz
   * yuklenmediyse ya da hic yoksa tek basina gosterilir.
   */
  greeting: readEnv('REACT_APP_BRAND_GREETING', 'Merhaba'),

  /** <title> ve meta description icin kullanilan uzun ad. */
  productName: readEnv('REACT_APP_BRAND_PRODUCT_NAME', 'WMS · Depo Yönetim Sistemi'),

  /**
   * Musteriye ozel logo dosyasinin URL'i. Bos birakilirsa uygulama kendi
   * vektorel markasini cizer (bkz. components/Brand/BrandLogo).
   */
  logoUrl: readEnv('REACT_APP_BRAND_LOGO_URL', ''),

  /** Geri bildirim kayitlarinin numara oneki: ornegin WMS-42. */
  ticketPrefix: readEnv('REACT_APP_BRAND_TICKET_PREFIX', 'WMS'),

  /**
   * Sunucu tarafindaki pug yazdirma sablonlarinin adlari. Sablon dosyasi
   * dokuman servisinde bulundugu icin kuruluma gore degisebilir.
   */
  printTemplates: {
    orderList: readEnv('REACT_APP_PRINT_TEMPLATE_ORDER_LIST', 'siparis-listesi.pug'),
  },
}

export default BRAND
