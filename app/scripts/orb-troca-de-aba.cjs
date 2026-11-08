const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(5000);
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await p.waitForTimeout(1500);
  // amostra: pixels do orb de 40px do cabeçalho
  const amostra = () => p.evaluate(() => { const os = [...document.querySelectorAll('main orb-avatar')].filter((x) => x.getAttribute('size') === '40'); const o = os[0]; return { n: os.length, ph: o._ph.toFixed(2), yaw: o._yaw.toFixed(2), pitch: o._pitch.toFixed(2), expr: o._expr, cw: o._cw } });
  const dif = (a, b) => JSON.stringify(a) + ' → ' + JSON.stringify(b);
  const res = [];
  for (const aba of ['Carteira', 'Fila', 'Rotinas', 'Aprovações']) {
    const antes = await amostra(); await p.getByRole('tab', { name: aba, exact: true }).click(); await p.waitForTimeout(16); const depois = await amostra();
    const a2 = await amostra(); await p.waitForTimeout(16); const a3 = await amostra();
    res.push(`${aba}: troca ${dif(antes, depois)} · referência 2 quadros parados ${dif(a2, a3)}`);
  }
  console.log(res.join('\n')); await b.close();
})();
