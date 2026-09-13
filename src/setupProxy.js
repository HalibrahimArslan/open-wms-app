const { createProxyMiddleware } = require('http-proxy-middleware')

/**
 * Gelistirme sunucusunun API hedefi kuruluma gore degisir, bu yuzden sabit
 * yazilmaz. Yerel calisirken .env.local icine API_PROXY_TARGET (ve gerekiyorsa
 * WS_PROXY_TARGET) yazin; ornekler icin .env.example dosyasina bakin.
 *
 * WebSocket yolu da degisken: webpack-dev-server kendi hot-reload soketini
 * "/ws" yolunda acar ve upgrade isteklerini bu proxy'den once yakalar. Bu
 * yuzden gelistirmede uygulamanin soketi icin REACT_APP_WS_PATH ile cakismayan
 * bir yol verilir; ayni degiskeni tarayici tarafi da (src/config/api.js)
 * okudugu icin iki taraf otomatik olarak ayni yolda bulusur.
 */
const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8080'
const WS_TARGET = process.env.WS_PROXY_TARGET || API_TARGET.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws'
const WS_PATH = process.env.REACT_APP_WS_PATH || '/ws'

// Hedefin adresini ve yolunu ayiriyoruz: yol, pathRewrite ile uygulanmali.
// Express mount'u (app.use('/yol', ...)) upgrade isteklerinde devreye girmez,
// cunku upgrade olayi Express'i tamamen baypas eder; bu yuzden yolu hedefe
// birlestirmeyi http-proxy-middleware'in kendisine birakiyoruz.
const wsTarget = new URL(WS_TARGET)
const wsTargetOrigin = `${wsTarget.protocol}//${wsTarget.host}`
const wsTargetPath = wsTarget.pathname === '/' ? '' : wsTarget.pathname

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_TARGET,
      headers: {
        Connection: 'keep-alive',
      },
      changeOrigin: true,
      secure: false,
    })
  )

  // Context'i acikca veriyoruz: aksi halde proxy butun upgrade isteklerini
  // (webpack-dev-server'in kendi "/ws" hot-reload soketi dahil) yakalamaya
  // calisir ve hot reload ile yarisir.
  const wsProxy = createProxyMiddleware(WS_PATH, {
    target: wsTargetOrigin,
    changeOrigin: true,
    secure: false,
    ws: true,
    pathRewrite: { [`^${WS_PATH}`]: wsTargetPath },
    // Burada "Connection: keep-alive" gibi bir baslik TANIMLANMAMALI: proxy'nin
    // gonderdigi Connection basligini ezer, boylece istek artik bir protokol
    // yukseltme istegi olmaktan cikar ve sunucu el sikismayi reddeder.
  })

  app.use(wsProxy)

  /**
   * http-proxy-middleware "upgrade" dinleyicisini ancak proxy'lenen yoldan ilk
   * normal HTTP istegi gectiginde bagliyor. WebSocket yoluna hicbir zaman duz
   * bir HTTP istegi gitmedigi icin dinleyici kendiliginden baglanmaz ve el
   * sikisma cevapsiz kalir. Bu yuzden sunucu nesnesini ilk istekte yakalayip
   * dinleyiciyi kendimiz bagliyoruz; sayfanin kendisi her zaman soketten once
   * yuklendigi icin baglama zamaninda hazir oluyor.
   */
  let upgradeBound = false
  app.use((req, res, next) => {
    if (!upgradeBound && req.socket && req.socket.server) {
      req.socket.server.on('upgrade', wsProxy.upgrade)
      upgradeBound = true
    }
    next()
  })
}
