const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(6000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(500) };
  const mod = async (m) => { await p.getByRole('button', { name: m, exact: true }).first().click(); await p.waitForTimeout(500) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // 1. Timesheet: Confirmações → Meu tempo
  await mod('Timesheet'); const est0 = await p.getByText(/^estimada · /).count();
  await aba('Confirmações'); await p.getByRole('button', { name: /Confirmar tudo marcado/ }).click(); await p.waitForTimeout(300);
  await aba('Meu tempo'); const est1 = await p.getByText(/^estimada · /).count(); console.log('estimadas em Meu tempo', est0, '→', est1); ok(est1 < est0, 'confirmar em Confirmações aparece em Meu tempo');
  await mod('Início'); await mod('Timesheet'); await aba('Confirmações'); ok(await p.getByRole('button', { name: /Confirmar tudo marcado/ }).count() === 0 || await p.getByText(/0 pendentes/).count() > 0, 'Confirmações continuam feitas ao voltar');
  // 2. Financeiro: aprovar contas → Visão geral
  await mod('Financeiro'); const tit = async () => (await p.getByText(/contas a pagar esperando aprovação/).first().textContent().catch(() => '')) || ''; const v0 = await tit();
  await aba('Contas a pagar'); await p.getByRole('button', { name: /Marcar as/ }).click(); await p.getByRole('button', { name: /Aprovar e agendar/ }).click(); await p.waitForTimeout(300);
  const ag = await p.getByRole('radio', { name: /^A aprovar/ }).textContent();
  await aba('Visão geral'); const v1 = await tit(); console.log('Visão:', v0, '→', v1); ok(v0 !== v1, 'Visão geral reflete as contas aprovadas');
  await aba('Contas a pagar'); const ag2 = await p.getByRole('radio', { name: /^A aprovar/ }).textContent(); ok(ag === ag2, 'Contas a pagar continuam aprovadas ao voltar (' + ag2 + ')');
  // 3. BPO: Fila → Carteira
  await mod('BPO'); await aba('Fila'); const n0 = await p.getByRole('button', { name: 'Resolvido' }).count(); await p.getByRole('button', { name: 'Resolvido' }).first().click(); await p.waitForTimeout(200);
  await aba('Carteira'); await aba('Fila'); const n1 = await p.getByRole('button', { name: 'Resolvido' }).count(); ok(n1 === n0 - 1, `Fila lembra o resolvido (${n0} → ${n1})`);
  // 4. Conciliação
  await mod('Financeiro'); await aba('Conciliação'); await p.getByRole('button', { name: /Aprovar regra/ }).first().click(); const r0 = await p.getByRole('button', { name: /Aprovar regra/ }).count();
  await aba('Resultado'); await aba('Conciliação'); ok(await p.getByRole('button', { name: /Aprovar regra/ }).count() === r0, 'regra aprovada continua aprovada');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
