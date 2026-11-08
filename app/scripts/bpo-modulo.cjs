const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(6000); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${n}.png` });
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(600) };
  const lab = async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await p.waitForTimeout(300) };
  const conta = async (n) => { await lab(); await dlg().getByRole('button', { name: new RegExp(n) }).click(); await p.waitForTimeout(1500) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Marina Teixeira/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400);
  if (await p.getByLabel('Código').count()) { await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); }
  await p.waitForTimeout(1200);
  const lat = await p.getByRole('navigation').first().allTextContents(); console.log('lateral', lat.join(' ').slice(0, 200));
  await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await p.waitForTimeout(800);
  const abas = await p.getByRole('tab').allInnerTexts(); console.log('abas Marina', JSON.stringify(abas)); ok(abas.length === 8, 'Gestor BPO: 8 abas (sem Rentabilidade)');
  await shot('visao'); ok(await p.getByText('Precisa de decisão').count() > 0, 'Visão geral abre pelo que precisa de decisão');
  await aba('Carteira'); await shot('carteira'); ok(await p.getByText(/credencial vencida/).count() > 0 && await p.getByText(/modo arquivo/).count() > 0, 'Carteira mostra ERP e sincronização');
  await p.getByRole('button', { name: /Padaria Pão Quente/ }).first().click(); await p.waitForTimeout(700); await shot('visao-padaria');
  ok(await p.getByText(/titular: /).count() > 0, 'empresa com selo de titular');
  await aba('Fila'); await shot('fila');
  await aba('Rotinas'); await shot('rotinas'); ok(await p.getByText('Calendário da empresa').count() > 0, 'calendário único');
  await aba('Aprovações'); await shot('aprovacoes');
  // Marina confere a do Lucas
  const conf = p.getByRole('button', { name: 'Conferir' }); console.log('conferir', await conf.count());
  await conf.first().click(); await p.waitForTimeout(300); ok(await p.getByRole('button', { name: 'Pôr no próximo lote' }).count() > 0, 'conferida vira "pôr no próximo lote"');
  await aba('Entregas'); await shot('entregas');
  await aba('Volume'); await shot('volume');
  await aba('Configuração'); await shot('config');
  await p.getByRole('button', { name: 'Editar' }).first().click(); await p.waitForTimeout(400); await shot('alcadas'); await p.keyboard.press('Escape');
  // Lucas: não confere o que digitou
  await conta('Lucas Prado'); await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await p.waitForTimeout(600);
  const abasL = await p.getByRole('tab').allInnerTexts(); console.log('abas Lucas', JSON.stringify(abasL)); ok(abasL.length === 6, 'Colaborador: 6 abas');
  await aba('Aprovações'); const desab = await p.getByRole('button', { name: 'Conferir' }).evaluateAll((bs) => bs.map((b) => b.disabled)); console.log('conferir Lucas', JSON.stringify(desab)); ok(desab.includes(true), 'Lucas não confere o que digitou');
  const lateralL = await p.getByRole('button', { name: 'Painel', exact: true }).count(); ok(lateralL === 0, 'Lucas (só BPO) sem Painel');
  // App do cliente: João aprova o lote
  await lab(); await dlg().getByRole('button', { name: /App do cliente/ }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /^João Batista/ }).click(); await p.getByRole('button', { name: 'Receber código' }).click(); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(500);
  ok(await p.getByText(/Pagamentos para aprovar/).count() > 0, 'Início do app mostra pagamentos para aprovar'); await shot('app-inicio');
  await p.getByRole('button', { name: 'Ver', exact: true }).click(); await p.waitForTimeout(300); await shot('app-aprovacoes');
  await p.getByRole('button', { name: /Editar e aprovar/ }).click(); await p.getByLabel('Manter Gráfica Nova').uncheck(); await p.getByRole('button', { name: /Aprovar o que ficou/ }).click(); await p.waitForTimeout(400); await shot('app-aprovado');
  ok(await p.getByText(/libere no seu banco|Já liberei/).count() > 0, 'M1: depois de aprovar, cliente libera no banco');
  await p.getByRole('button', { name: /Já liberei no banco/ }).click(); await p.waitForTimeout(300);
  await p.getByRole('navigation', { name: 'Menu do app' }).getByRole('button', { name: 'Mais' }).click(); await p.getByRole('button', { name: 'Fluxo de caixa' }).click(); await p.waitForTimeout(300); await shot('app-caixa');
  // Patrícia (Mercado): segunda aprovação
  await lab(); await dlg().getByRole('button', { name: /App do cliente/ }).click().catch(()=>{}); await p.keyboard.press('Escape');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
