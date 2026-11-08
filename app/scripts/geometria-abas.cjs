const { chromium } = require('playwright');
(async () => { const W = +process.argv[2] || 1600; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } }); p.setDefaultTimeout(5000);
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  const mods = ['Início', 'Painel', 'Clientes', 'CRM', 'Arquivos', 'Timesheet', 'Financeiro', 'BPO', 'Configurações'];
  const medir = () => p.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const h1 = main.querySelector('h1');
    const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right), Math.round(b.width)] };
    // contêiner centralizado: primeiro ancestral do h1 com mx-auto
    let c = h1; while (c && !(c.className && typeof c.className === 'string' && c.className.includes('mx-auto'))) c = c.parentElement;
    const caixas = [...main.querySelectorAll('section')].slice(0, 1).map(r);
    const tl = document.querySelector('[role=tablist]'); const sel = document.querySelector('header [aria-haspopup=dialog], header button[aria-expanded]'); return { tl: r(tl), h1: h1?.textContent?.slice(0, 30), h1x: r(h1), cont: r(c), contCls: c?.className?.match(/max-w-\S+/g)?.join(' '), sec: caixas[0], top: h1 ? Math.round(h1.getBoundingClientRect().top) : null };
  });
  for (const m of mods) {
    const btn = p.getByRole('button', { name: m, exact: true }).first(); if (!(await btn.count())) continue; await btn.click(); await p.waitForTimeout(500);
    const abas = await p.getByRole('tab').allInnerTexts();
    for (const a of abas) { await p.getByRole('tab', { name: a, exact: true }).first().click().catch(() => {}); await p.waitForTimeout(450); const g = await medir(); console.log([m, a.replace(/\d+$/, ''), 'TL'+JSON.stringify(g.tl), JSON.stringify(g.h1x), JSON.stringify(g.cont), g.contCls, JSON.stringify(g.sec), g.top, g.h1].join(' | ')); }
  }
  await b.close();
})();
