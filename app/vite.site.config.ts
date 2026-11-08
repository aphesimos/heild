import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Build do site da Heild (site.html), separado do protótipo. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: { rollupOptions: { input: path.resolve(import.meta.dirname, 'site.html') } },
})
