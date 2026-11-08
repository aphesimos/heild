const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const shot = (n) => p.screenshot({ path: `${out}/s-${n}.png` });
  const mod = async (m) => { await p.getByRole('button', { name: m, exact: true }).first().click(); await p.waitForTimeout(400) };
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(400) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  await aba('Time'); await p.locator('main').getByText('Contábil', { exact: true }).first().click(); await p.waitForTimeout(500);
  await p.getByRole('button', { name: /Pedir ao Contábil/ }).first().click(); await p.waitForTimeout(500); await shot('1-pensando');
  ok(await p.getByText(/está fazendo: Classificar 3/).count() > 0, 'progresso aparece (preparando)');
  await p.waitForTimeout(4000); await shot('2-etapas');
  await mod('Painel'); await p.waitForTimeout(1500); await mod('Início'); await aba('Time'); await p.locator('main').getByText('Contábil', { exact: true }).first().click(); await p.waitForTimeout(300);
  ok(await p.getByText(/etapa \d de 4/).count() > 0, 'voltou da outra aba e o progresso seguiu');
  await p.waitForTimeout(17000); await shot('3-passagem');
  ok(await p.getByText(/Classifiquei 2 dos 3/).count() > 0, 'resultado do Contábil');
  ok(await p.getByText(/Passando para|passou para/).count() > 0, 'passagem animada ao Atendimento');
  await p.waitForTimeout(18000);
  await mod('CRM'); await p.getByRole('button', { name: /Rita Campos/ }).first().click().catch(() => {}); await p.waitForTimeout(600); await shot('4-crm');
  ok(await p.getByText(/M. SILVA/).count() > 0, 'mensagem do integrante no CRM');
  let digitou = false; for (let i = 0; i < 40 && !digitou; i++) { if (await p.getByText(/Rita Campos está digitando/).count()) digitou = true; else await p.waitForTimeout(500) }
  await shot('5-digitando'); ok(digitou, 'Rita aparece digitando');
  await p.waitForTimeout(6000); await shot('6-resposta'); ok(await p.getByText(/adiantamento do pedido 3381/).count() > 0, 'Rita respondeu');
  await p.waitForTimeout(24000); await mod('Início'); await aba('Time'); await p.locator('main').getByText('Contábil', { exact: true }).first().click(); await p.waitForTimeout(500); await shot('7-fim');
  let fechou = false; for (let i = 0; i < 40 && !fechou; i++) { if (await p.getByText(/CTB-016 foi concluída/).count()) fechou = true; else await p.waitForTimeout(500) }
  ok(fechou, 'Contábil fechou a tarefa com a resposta da Rita');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
