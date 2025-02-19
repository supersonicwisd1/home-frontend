import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js'
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5173,
    host: true
  }
})