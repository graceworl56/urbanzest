import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: []
    }
  },
  server: {
    port: 3000,
    host: true
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #root { width: 100%; min-height: 100vh; }
        `
      }
    }
  }
})