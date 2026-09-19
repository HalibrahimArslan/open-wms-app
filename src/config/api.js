/**
 * Uygulamanin sunucu tarafiyla konustugu yollar.
 *
 * WebSocket yolu varsayilan olarak "/ws"dir; gerekirse REACT_APP_WS_PATH ile
 * degistirilir. Gelistirmede Vite proxy'si ayni degiskeni okudugu icin tarayici
 * ve proxy her zaman ayni yolu kullanir (bkz. vite.config.js).
 */

export const WS_PATH = import.meta.env.REACT_APP_WS_PATH || '/ws'

/** Tarayicinin baglanacagi tam WebSocket adresi (sayfayla ayni host/protokol). */
export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}${WS_PATH}`
}
