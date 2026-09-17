const { createProxyMiddleware } = require('http-proxy-middleware')

const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:8080'
const PRINT_TARGET = process.env.PRINT_PROXY_TARGET || 'http://localhost:3200'
const WS_TARGET = process.env.WS_PROXY_TARGET || API_TARGET.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws'
const WS_PATH = process.env.REACT_APP_WS_PATH || '/ws'

const wsTarget = new URL(WS_TARGET)
const wsTargetOrigin = `${wsTarget.protocol}//${wsTarget.host}`
const wsTargetPath = wsTarget.pathname === '/' ? '' : wsTarget.pathname

module.exports = function (app) {
  app.use(
    '/api/print',
    createProxyMiddleware({
      target: PRINT_TARGET,
      headers: {
        Connection: 'keep-alive',
      },
      changeOrigin: true,
      secure: false,
    })
  )

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

  const wsProxy = createProxyMiddleware(WS_PATH, {
    target: wsTargetOrigin,
    changeOrigin: true,
    secure: false,
    ws: true,
    pathRewrite: { [`^${WS_PATH}`]: wsTargetPath },
  })

  app.use(wsProxy)

  let upgradeBound = false
  app.use((req, res, next) => {
    if (!upgradeBound && req.socket && req.socket.server) {
      req.socket.server.on('upgrade', wsProxy.upgrade)
      upgradeBound = true
    }
    next()
  })
}
