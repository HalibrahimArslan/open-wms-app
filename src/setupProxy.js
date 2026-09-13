const { createProxyMiddleware } = require('http-proxy-middleware')

/**
 * Gelistirme sunucusunun API hedefi kuruluma gore degisir, bu yuzden sabit
 * yazilmaz. Yerel calisirken .env.local icine API_PROXY_TARGET (ve gerekiyorsa
 * WS_PROXY_TARGET) yazin; ornekler icin .env.example dosyasina bakin.
 */
const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8080'
const WS_TARGET = process.env.WS_PROXY_TARGET || API_TARGET.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws'

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

  app.use(
    '/ws',
    createProxyMiddleware({
      target: WS_TARGET,
      changeOrigin: true,
      secure: false,
      ws: true,
      headers: {
        Connection: 'keep-alive',
      },
    })
  )
}
