// Temas dos escritórios parceiros (Condesp e Requinte): capturas e contraste.
// Uso, com o app rodando (npm run app):
//   node scripts/temas-escritorios.cjs <pasta-das-capturas> [url, padrão http://localhost:5173/]
// Tira Início, Painel e Financeiro de cada tema, claro e escuro, em 1440x900, e mede o
// contraste WCAG nas variáveis CSS que o ThemeProvider aplicou de fato. Detalhes em
// src/theme/TEMAS-ESCRITORIOS.md.
const { chromium } = require('playwright')
const out = process.argv[2]
const url = process.argv[3] || 'http://localhost:5173/'
const temas = ['condesp', 'requinte']
const telas = ['Início', 'Painel', 'Financeiro']

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
const lum = (h) => {
  const [r, g, b] = rgb(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
/** A cor a 15% sobre a camada elevada: os selos (bg-destructive/12, bg-warning/15) com o texto na mesma cor. */
const tinta = (c, base) => '#' + rgb(c).map((v, i) => Math.round((0.15 * v + 0.85 * rgb(base)[i]) * 255).toString(16).padStart(2, '0')).join('')

;(async () => {
  const b = await chromium.launch()
  let falhas = 0
  for (const tema of temas)
    for (const modo of ['claro', 'escuro']) {
      const p = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: modo === 'escuro' ? 'dark' : 'light' })
      p.on('pageerror', (e) => console.log('ERRO', e.message))
      await p.goto(url)
      await p.getByRole('button', { name: /^Demonstração/ }).click()
      await p.locator('select[aria-label="Tema"]').selectOption(tema)
      await p.keyboard.press('Escape')
      await p.waitForTimeout(400)

      // Contraste: variáveis aplicadas em <html>.
      const v = await p.evaluate(() => {
        const s = document.documentElement.style
        const o = {}
        for (let i = 0; i < s.length; i++) o[s[i]] = s.getPropertyValue(s[i]).trim()
        return o
      })
      const conteudo = ['--background', '--background-end', '--surface', '--raised', '--sunken', '--sunken-end']
      const lateral = ['--sidebar', '--sidebar-end']
      const pior = (cor, fundos) => fundos.map((f) => [razao(v[cor], f.startsWith('#') ? f : v[f]), f]).sort((x, y) => x[0] - y[0])[0]
      const medidas = [
        ['texto', pior('--foreground', [...conteudo, ...lateral]), 4.5],
        ['texto suave', pior('--muted-foreground', [...conteudo, ...lateral]), 4.5],
        ...[['destaque', '--highlight'], ['atenção', '--warning'], ['erro', '--destructive'], ['sucesso', '--success']].map(([n, c]) => [n, pior(c, [...conteudo, tinta(v[c], v['--raised'])]), 4.5]),
        ['texto na primária', [razao(v['--primary'], v['--primary-foreground']), 'primária'], 4.5],
        ['texto no erro', [razao(v['--destructive'], v['--destructive-foreground']), 'erro'], 4.5],
        ['texto no sucesso', [razao(v['--success'], v['--success-foreground']), 'sucesso'], 4.5],
        ['primária x fundo', pior('--primary', ['--background', '--surface', '--raised']), 3],
        ['ícone suave x lateral', pior('--muted-foreground', lateral), 3],
      ]
      console.log(`\n${tema} ${modo}`)
      for (const [n, [r, onde], min] of medidas) {
        if (r < min) falhas++
        console.log(`  ${r < min ? 'FALHA' : 'ok   '} ${n}: ${r.toFixed(2)} (mín. ${min}; pior caso ${onde})`)
      }

      // Capturas.
      await p.screenshot({ path: `${out}/${tema}-${modo}-login.png` })
      await p.fill('input[type=email]', 'fernanda@contabilandrade.com.br')
      await p.fill('input[type=password]', 'demonstracao')
      await p.getByRole('button', { name: 'Entrar', exact: true }).click()
      await p.waitForTimeout(300)
      await p.locator('input').first().fill('123456')
      await p.getByRole('button', { name: 'Confirmar' }).click()
      await p.waitForTimeout(900)
      for (const tela of telas) {
        await p.getByRole('button', { name: tela, exact: true }).first().click()
        await p.waitForTimeout(1200)
        const nome = tela.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        await p.screenshot({ path: `${out}/${tema}-${modo}-${nome}.png` })
      }
      await p.close()
    }
  await b.close()
  console.log(falhas ? `\n${falhas} medida(s) abaixo do mínimo` : '\nTodas as medidas passam no WCAG AA')
  process.exitCode = falhas ? 1 : 0
})()
