/**
 * Uygulamanin sunucu tarafiyla konustugu yollar.
 *
 * WebSocket yolu yapilandirilabilir olmak zorunda: webpack-dev-server kendi
 * hot-reload soketini "/ws" yolunda acar ve upgrade isteklerini proxy'den once
 * yakalar. Bu yuzden gelistirme ortaminda uygulamanin bildirim soketi "/ws"
 * uzerinden backend'e ulasamaz; .env.local icinde REACT_APP_WS_PATH ile
 * cakismayan bir yol (ornegin /wsapi) verilir. Uretimde dev-server olmadigi
 * icin varsayilan "/ws" oldugu gibi kullanilir.
 */

export const WS_PATH = process.env.REACT_APP_WS_PATH || '/ws'

/** Tarayicinin baglanacagi tam WebSocket adresi (sayfayla ayni host/protokol). */
export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}${WS_PATH}`
}
