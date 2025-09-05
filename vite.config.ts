// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fancy-seating-chart/',     // <-- REQUIRED for GitHub Pages under a repo path
  plugins: [react()],
  server: { port: 5173 },
  resolve: { alias: { '@': '/src' } },
})
