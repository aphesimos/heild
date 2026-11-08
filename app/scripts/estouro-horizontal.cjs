const { chromium } = require('playwright');
(async () => { const W = +process.argv[2] || 390; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 844 } }); p.setDefaultTimeout(5000);
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // fecha a aba Demonstração para não atrapalhar
  await p.keyboard.press('Control+Shift+D').catch(() => {});
  const mods = ['Início', 'Painel', 'CRM', 'Arquivos', 'Timesheet', 'Financeiro', 'BPO', 'Configurações'];
  const medir = () => p.evaluate((W) => {
    const main = document.querySelector('main'); if (!main) return [];
    const fora = [];
    for (const el of main.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      // ignora o que está dentro de uma rolagem horizontal própria
      let a = el.parentElement, rola = false; while (a && a !== main) { const cs = getComputedStyle(a); if (/(auto|scroll|hidden)/.test(cs.overflowX)) { rola = true; break } a = a.parentElement }
      if (rola) continue;
      if (r.right > W + 1 || r.left < -1) fora.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')} [${Math.round(r.left)},${Math.round(r.right)}] "${(el.textContent || '').trim().slice(0, 30)}"`);
    }
    return fora.slice(0, 3);
  }, W);
  const abrirMenu = async () => { const m = p.getByRole('button', { name: /Abrir menu|Menu/ }).first(); if (await m.count()) { await m.click().catch(() => {}); await p.waitForTimeout(300) } };
  for (const m of mods) {
    if (W < 768) await abrirMenu();
    const btn = p.getByRole('button', { name: m, exact: true }).first(); if (!(await btn.count())) continue; await btn.click().catch(() => {}); await p.waitForTimeout(500);
    const abas = await p.getByRole('tab').allInnerTexts(); console.log('visitou', m, abas.length);
    for (const a of abas) { await p.getByRole('tab', { name: a, exact: true }).first().click().catch(() => {}); await p.waitForTimeout(400); const f = await medir(); if (f.length) console.log(`${m} › ${a}:`, f.join(' | ')) }
  }
  console.log('fim', W); await b.close();
})();
