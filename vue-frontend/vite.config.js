import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    plugins: [vue()],
    server: {
      proxy: {
        '/backend': {
          target: env.VITE_API_PROXY_TARGET || 'https://smartlearn.westus.cloudapp.azure.com',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
