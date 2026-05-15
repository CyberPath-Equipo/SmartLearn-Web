import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/smartlearn': {
        target: 'http://marco-des.mexicocentral.cloudapp.azure.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
