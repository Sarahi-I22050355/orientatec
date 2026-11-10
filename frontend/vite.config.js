import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          // Configurable con VITE_PROXY_TARGET (ver .env.example).
          target: env.VITE_PROXY_TARGET || 'https://orientatec.sarahi-dev.com',
          changeOrigin: true,
        }
      }
    }
  }
})
