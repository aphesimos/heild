// Detector de buracos em telas (fora da grade de widgets): em cada grid com 2+ colunas,
// mede quanto cada filho da última linha fica acima do fim do contêiner.
const { chromium } = require('playwright');
(async () => { const ids = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const id of ids) {
    await p.goto(`http://localhost:6099/iframe.html?id=${id}&viewMode=story`); await p.waitForTimeout(900);
    const r = await p.evaluate(() => { const out = [];
      document.querySelectorAll('*').forEach((g) => { const cs = getComputedStyle(g); if (cs.display !== 'grid') return; const cols = cs.gridTemplateColumns.split(' ').length; if (cols < 2) return;
        const kids = [...g.children].filter((k) => k.getBoundingClientRect().height > 0); if (kids.length < 2) return;
        const gb = g.getBoundingClientRect(); if (gb.height < 150) return;
        const rs = kids.map((k) => k.getBoundingClientRect());
        kids.forEach((k, i) => { const kb = rs[i]; const abaixo = rs.some((o, j) => j !== i && o.top >= kb.bottom - 2 && o.left < kb.right - 4 && o.right > kb.left + 4); const vao = gb.bottom - kb.bottom; if (vao > 48 && !abaixo) out.push(`${Math.round(vao)}px abaixo de "${(k.innerText || '').trim().split('\n')[0].slice(0, 50)}"`) }) });
      // colunas esticadas: o vazio fica dentro do contêiner flex em coluna
      document.querySelectorAll('*').forEach((c) => { const cs = getComputedStyle(c); if (cs.display !== 'flex' || cs.flexDirection !== 'column' || !c.parentElement || getComputedStyle(c.parentElement).display !== 'grid') return;
        const kids = [...c.children].filter((k) => k.getBoundingClientRect().height > 0); if (kids.length < 2) return; const cb = c.getBoundingClientRect(); const ult = kids[kids.length - 1].getBoundingClientRect();
        const vao = cb.bottom - parseFloat(cs.paddingBottom) - ult.bottom; if (vao > 48) out.push(`${Math.round(vao)}px no fim da coluna que termina em "${(kids[kids.length - 1].innerText || '').trim().split('\n')[0].slice(0, 50)}"`) });
      return out });
    console.log(id, r.length ? r : 'ok');
  }
  await b.close() })();
