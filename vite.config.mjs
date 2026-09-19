import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Proxy hedefleri REACT_APP_ onekli olmadigi icin bundle'a girmez; burada
  // onek filtresi olmadan .env dosyalari ve kabuk ortamindan okunur.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  const API_TARGET = env.API_PROXY_TARGET || 'http://localhost:8080'
  const PRINT_TARGET = env.PRINT_PROXY_TARGET || 'http://localhost:3200'
  const WS_TARGET = env.WS_PROXY_TARGET || API_TARGET.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws'
  const WS_PATH = env.REACT_APP_WS_PATH || '/ws'

  const wsTarget = new URL(WS_TARGET)
  const wsTargetPath = wsTarget.pathname === '/' ? '' : wsTarget.pathname

  return {
    plugins: [react()],
    // Mevcut kurulumlarin .env dosyalari ve build ortam degiskenleri
    // degismeden calissin diye CRA'daki REACT_APP_ oneki korunur.
    envPrefix: 'REACT_APP_',
    server: {
      port: 3000,
      // Anahtar sirasi onemli: ilk eslesen kural kullanilir, bu yuzden
      // /api/print genel /api kuralindan once gelmeli.
      proxy: {
        '/api/print': {
          target: PRINT_TARGET,
          headers: { Connection: 'keep-alive' },
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: API_TARGET,
          headers: { Connection: 'keep-alive' },
          changeOrigin: true,
          secure: false,
        },
        [WS_PATH]: {
          target: `${wsTarget.protocol}//${wsTarget.host}`,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^${WS_PATH}`), wsTargetPath),
        },
      },
    },
    preview: {
      port: 3000,
    },
    build: {
      // Dockerfile ve nginx imaji derleme ciktisini build/ altinda bekler.
      outDir: 'build',
    },
  }
})
