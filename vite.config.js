import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),          // ← Tailwind shu yerda qo‘shiladi
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://app.dentago.uz',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
