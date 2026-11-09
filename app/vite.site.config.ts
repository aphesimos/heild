import { rmSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * O README de public/ explica de onde vêm as páginas geradas (diretrizes.html, inteiro.html, fontes/). O Vite
 * copia public/ inteira para o build; o README fica de fora, para não ir parar no gh-pages por cima do dele.
 */
const semReadmeDoPublic = (): Plugin => {
  let saida = ''
  return {
    name: 'heild-sem-readme-do-public',
    apply: 'build',
    configResolved(c) {
      saida = path.resolve(c.root, c.build.outDir)
    },
    closeBundle() {
      rmSync(path.join(saida, 'README.md'), { force: true })
    },
  }
}

/** Build do site da Heild (site.html), separado do protótipo. */
export default defineConfig({
  plugins: [react(), tailwindcss(), semReadmeDoPublic()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: { rollupOptions: { input: path.resolve(import.meta.dirname, 'site.html') } },
})
