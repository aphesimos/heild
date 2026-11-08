const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(6000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${n}.png` });
  const lab = async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await p.waitForTimeout(300) };
  const lateral = async () => (await p.getByRole('navigation').first().allTextContents()).join(' ');
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Marina Teixeira/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400);
  if (await p.getByLabel('Código').count()) { await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); }
  await p.waitForTimeout(1200);
  let l = await lateral(); console.log('Marina (B):', l.slice(0, 120)); ok(/Clientes/.test(l) && !/Timesheet Financeiro|TimesheetFinanceiro/.test(l) && !/Painel/.test(l), 'Marina: Clientes no lugar do Painel, sem Financeiro (não tem o setor)');
  await p.getByRole('button', { name: 'Clientes', exact: true }).first().click(); await p.waitForTimeout(600); await shot('c-marina');
  ok(await p.getByText('Metalúrgica Andrade').count() === 0, 'cadastro da Marina só com clientes do BPO');
  await p.getByRole('button', { name: 'Ficha' }).first().click(); await p.waitForTimeout(400); await shot('c-ficha'); ok(await dlg().getByText('BPO Financeiro').count() > 0, 'ficha com responsável do BPO'); await p.keyboard.press('Escape');
  await p.getByRole('tab', { name: /^Contatos/ }).click(); await p.waitForTimeout(400); await shot('c-contatos');
  // Fernanda, cenário Só BPO
  await lab(); await dlg().getByRole('radio', { name: 'Só BPO' }).click(); await dlg().getByRole('button', { name: /Fernanda Lima/ }).click(); await p.waitForTimeout(1500);
  l = await lateral(); console.log('Fernanda (C1):', l.slice(0, 160)); ok(/Clientes/.test(l) && /Financeiro/.test(l) && /BPO/.test(l) && !/Painel/.test(l), 'Admin no só BPO: Clientes, Financeiro e BPO, sem Painel');
  await p.getByRole('button', { name: 'Financeiro', exact: true }).first().click(); await p.waitForTimeout(600); ok((await p.getByRole('tab').count()) === 7, 'Financeiro com sete abas');
  await p.getByRole('tab', { name: /^Contratos/ }).click(); await p.waitForTimeout(600); await shot('c-contratos'); ok(await p.getByText('Metalúrgica Andrade').count() === 0, 'contratos só do BPO');
  await p.getByRole('tab', { name: /^Cobranças/ }).click(); await p.waitForTimeout(600); await shot('c-cobrancas');
  await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await p.waitForTimeout(600); await p.getByRole('tab', { name: /^Volume/ }).click(); await p.waitForTimeout(500); await shot('c-volume');
  await p.getByRole('button', { name: /Faturar no Financeiro/ }).click(); await p.waitForTimeout(600); ok(await p.getByRole('tab', { name: /^Cobranças/, selected: true }).count() > 0, 'Volume leva às Cobranças do Financeiro');
  const t = await p.getByRole('tab').count();
  await p.getByRole('button', { name: 'Início', exact: true }).first().click(); await p.getByRole('tab', { name: /^Time/ }).click(); await p.waitForTimeout(600); await shot('c-time');
  await p.getByRole('button', { name: 'Configurações', exact: true }).first().click(); await p.getByRole('tab', { name: /^Assinatura/ }).click(); await p.waitForTimeout(500); await shot('c-assinatura');
  // volta ao cenário B
  await lab(); await dlg().getByRole('radio', { name: 'Contábil com BPO' }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  l = await lateral(); ok(/Painel/.test(l) && !/Clientes/.test(l), 'Contábil com BPO: admin volta a ter Painel');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
