const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const shot = (n) => p.screenshot({ path: `${out}/s2-${n}.png` });
  const mod = async (m) => { await p.getByRole('button', { name: m, exact: true }).first().click(); await p.waitForTimeout(400) };
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(400) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // Assistente
  { const ab = p.getByRole('button', { name: 'Abrir sugestões' }); if (await ab.count()) { await ab.click(); await p.waitForTimeout(350) } } await p.getByRole('button', { name: /Feche outubro da Metalúrgica/ }).click(); await p.waitForTimeout(800); await shot('1-pensando');
  await p.waitForTimeout(6000); await shot('2-passando'); ok(await p.getByText(/Passando para|passou para/).count() > 0, 'Assistente: passagem animada');
  await p.waitForTimeout(3000); await shot('3-andamento'); ok(await p.getByText(/Contábil está fazendo/).count() > 0, 'Assistente mostra o trabalho em andamento no próprio chat');
  // DP sugestão
  await aba('Time'); await p.locator('main').getByText('DP', { exact: true }).first().click(); await p.waitForTimeout(400);
  await p.getByPlaceholder('Escreva para DP').fill('Gere a prévia da folha de novembro'); await p.getByPlaceholder('Escreva para DP').press('Enter'); await p.waitForTimeout(500);
  ok(await p.getByText(/está fazendo: Prévia da folha/).count() > 0, 'sugestão do DP vira trabalho'); await shot('4-dp');
  // CRM: cliente responde, digitando antes
  await mod('CRM'); await p.getByText('Transportes Rota Sul S.A.').first().click(); await p.waitForTimeout(500);
  await p.getByPlaceholder(/Responder/).fill('Oi, Paula! Já estamos vendo a intimação. Você tem o DACTE?'); await p.getByRole('button', { name: 'Enviar' }).click();
  let dig = false; for (let i = 0; i < 24 && !dig; i++) { if (await p.getByText(/está digitando/).count()) dig = true; else await p.waitForTimeout(400) }
  await shot('5-digitando'); ok(dig, 'cliente digitando antes de responder');
  await p.waitForTimeout(4500); ok(await p.getByText('Deixa eu ver aqui e já te respondo.').count() > 0, 'cliente respondeu'); await shot('6-resposta');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
