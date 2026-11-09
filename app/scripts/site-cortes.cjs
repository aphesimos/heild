// Site da Heild: nenhum texto passa da caixa que o recorta (cartão, painel) nem da tela, em todas as páginas,
// larguras e abas. Animações no estado final (movimento reduzido). Servir o build do site em 6101. Sai com código 1 se achar corte.
const { chromium } = require('playwright')
const paginas=JSON.parse(process.env.PAGINAS||'[["inicio",""],["contabil","#contabil"],["bpo","#bpo"],["contato","#contato"]]')
const larguras=JSON.parse(process.env.LARGURAS||'[360,390,768,1024,1440]')
const medir = () => {
  const W = innerWidth, achados = []
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.textContent.trim()) continue
    if (n.parentElement && n.parentElement.closest('.sr-only,[class*="sr-only"]')) continue
    const el = n.parentElement; if (!el || el.closest('[aria-hidden=true],[inert],svg,script,style')) continue
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
    const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect(); if (!b.width || !b.height) continue
    let corte = null, intencional = false
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a)
      if (s.display === 'none' || s.visibility === 'hidden') { intencional = true; break }
      if (s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none' && s.webkitLineClamp) { intencional = true; break }
      if (/(auto|scroll)/.test(s.overflowX)) { intencional = true; break }
      if (/(hidden|clip)/.test(s.overflowX)) { corte = a; break }
    }
    if (intencional) continue
    const cx = corte ? corte.getBoundingClientRect() : { left: 0, right: W }
    const dir = Math.max(b.right - Math.min(cx.right, W), 0), esq = Math.max(Math.max(cx.left, 0) - b.left, 0)
    if (dir > 1.5 || esq > 1.5) achados.push(`${(el.closest('section')||{}).id||'?'} | "${n.textContent.trim().slice(0,50)}" | passa ${Math.round(Math.max(dir,esq))}px`)
  }
  return [...new Set(achados)]
}
;(async()=>{ const b=await chromium.launch(); let total=0
 for (const [nome,h] of paginas) for (const w of larguras) {
  const c = await b.newContext({ viewport:{width:w,height:900}, reducedMotion:'reduce', hasTouch: w<1024 }); const p = await c.newPage()
  await p.goto('http://localhost:6101/'+h); await p.waitForTimeout(900)
  const H = await p.evaluate(()=>document.documentElement.scrollHeight); for (let y=0;y<H;y+=600){ await p.evaluate(v=>scrollTo(0,v),y); await p.waitForTimeout(60) }
  await p.waitForTimeout(600)
  const achados = new Set(await p.evaluate(medir))
  // cada aba de cada seletor visível (guardadas antes: clicar numa pode criar outras e deslocar a lista)
  const todas = await p.locator('[role=tab]').elementHandles()
  const abas = []
  for (const h of todas) if (await h.isVisible()) abas.push(h)
  const nt = abas.length
  let erros = 0
  for (const t of abas) {
    try {
      await t.evaluate((e) => { e.scrollIntoView({ block: 'center' }); e.click() })
      await p.waitForTimeout(450)
      for (const a of await p.evaluate(medir)) achados.add(a)
    } catch (err) { erros++ }
  }
  console.log(`${nome} ${w}: ${nt} abas, ${erros} cliques falharam`)
  if (achados.size) { console.log(`${nome} ${w}:`); for (const a of achados) console.log('   ', a); total += achados.size }
  await c.close() }
 console.log('TOTAL', total); await b.close(); process.exit(total ? 1 : 0) })()
