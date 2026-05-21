import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/web/',
  plugins: [vue()],
  server: {
    proxy: {
      '/backend': {
        target: 'http://marco-des.mexicocentral.cloudapp.azure.com',
        changeOrigin: true,
        secure: false
       }
    }
  }
})
