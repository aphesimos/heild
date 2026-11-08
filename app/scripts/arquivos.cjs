const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(6000); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${n}.png` });
  const passo = async (n, f) => { try { await f() } catch (e) { console.log('ERRO', n, e.message.split('\n')[0]) } };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  await passo('financeiro', async () => {
    await p.getByRole('button', { name: 'Financeiro', exact: true }).first().click(); await p.waitForTimeout(600); await p.getByRole('tab', { name: /^Contratos/ }).click(); await p.waitForTimeout(700); await shot('fin-contratos');
    ok(await p.getByText(/passaram da faixa de notas/).count() > 0, 'Financeiro mostra o integrante com o que faz na aba');
    await p.getByRole('button', { name: 'Falar', exact: true }).click(); await p.waitForTimeout(900); await shot('fin-time');
    ok(await p.getByText(/cobranças de dezembro estão prontas/).count() > 0, 'Falar abre o chat do Financeiro no Time');
    await p.getByRole('button', { name: /^Aprovar/ }).last().click(); await p.waitForTimeout(400);
    ok(await p.getByText(/Cobranças de dezembro aprovadas/).count() > 0, 'aprovar as cobranças avisa');
  });
  await passo('arquivos', async () => {
    await p.getByRole('button', { name: 'Arquivos', exact: true }).first().click(); await p.waitForTimeout(800); await shot('arq-raiz');
    await p.getByRole('button', { name: /^Entregáveis/ }).first().click(); await p.waitForTimeout(300);
    await p.getByRole('button', { name: /^Fiscal \(guias/ }).first().click(); await p.waitForTimeout(400); await shot('arq-fiscal');
    const n = await p.getByText(/PIS\/COFINS 10-2026\.pdf/).count(); ok(n > 0, 'pasta Entregáveis/Fiscal da Metalúrgica tem a guia do CRM');
    await p.getByText(/PIS\/COFINS 10-2026\.pdf/).first().click(); await p.waitForTimeout(600); await shot('viewer-arq');
    ok(await dlg().getByText('Registro de entrega').count() > 0, 'arquivo abre no visualizador');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    await p.getByLabel('Buscar arquivo').fill('holerites'); await p.waitForTimeout(400); await shot('arq-busca');
    ok(await p.getByText(/resultado\(s\)/).count() > 0, 'busca em todas as pastas');
    await p.getByLabel('Buscar arquivo').fill('');
  });
  await passo('crm', async () => {
    await p.getByRole('button', { name: 'CRM', exact: true }).first().click(); await p.waitForTimeout(800);
    await p.getByRole('button', { name: /Rita Campos/ }).first().click().catch(() => {}); await p.waitForTimeout(700);
    const an = p.getByRole('button', { name: /PIS-COFINS-10-2026/ }).first();
    if (await an.count()) { await an.click(); await p.waitForTimeout(600); await shot('viewer-crm');
      ok(await dlg().getByText(/Fiscal \(guias, recibos\)/).count() > 0, 'anexo do CRM abre o mesmo arquivo da pasta');
      await dlg().getByRole('button', { name: /Entregáveis/ }).click(); await p.waitForTimeout(800); await shot('viewer-para-pasta');
      ok(await p.getByRole('heading', { name: 'Arquivos' }).count() > 0, 'trilha do visualizador leva a Arquivos'); }
    else console.log('sem anexo visível na conversa aberta');
  });
  await passo('painel', async () => {
    await p.getByRole('button', { name: 'Painel', exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByRole('tab', { name: /^Fiscal/ }).click(); await p.waitForTimeout(500);
    await p.getByRole('button', { name: /Carteira/ }).first().click(); await p.getByRole('option', { name: /Metalúrgica/ }).click(); await p.waitForTimeout(900);
    const ab = p.getByRole('button', { name: 'Abrir', exact: true }).first();
    if (await ab.count()) { await ab.click(); await p.waitForTimeout(600); await shot('viewer-painel'); ok(await dlg().getByText('Registro de entrega').count() > 0, 'documento do Painel abre no visualizador') }
    else { const it = p.getByText(/DARF IRPJ 3º trimestre/).first(); await it.click(); await p.waitForTimeout(600); await shot('viewer-painel'); ok(await dlg().getByText('Registro de entrega').count() > 0, 'documento do Painel abre no visualizador (lista compacta)') }
    await p.keyboard.press('Escape');
  });
  await passo('app', async () => {
    await p.getByRole('button', { name: /Demonstração/ }).click(); await dlg().getByRole('button', { name: /App do cliente/ }).click(); await dlg().getByRole('button', { name: /João Batista/ }).click(); await p.waitForTimeout(600);
    await p.getByRole('navigation', { name: 'Menu do app' }).getByRole('button', { name: 'Docs' }).click(); await p.waitForTimeout(400); await shot('app-docs');
    await p.getByRole('button', { name: /Holerites 10-2026/ }).first().click(); await p.waitForTimeout(500); await shot('app-viewer');
    ok(await p.getByRole('button', { name: /Baixar/ }).count() > 0, 'app abre o documento dentro do app');
    await p.getByRole('button', { name: 'Baixar', exact: true }).click(); await p.waitForTimeout(300);
    await p.getByRole('button', { name: /Demonstração/ }).click(); await dlg().getByRole('button', { name: /Painel do escritório/ }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
    await p.getByRole('button', { name: 'Arquivos', exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByLabel('Buscar arquivo').fill('Holerites 10-2026'); await p.waitForTimeout(400);
    await p.locator('li', { hasText: 'Padaria' }).getByRole('button', { name: /Holerites 10-2026/ }).first().click(); await p.waitForTimeout(600); await shot('viewer-entrega');
    ok(await dlg().getByText(/João Batista · baixado/).count() > 0 && await dlg().getByText(/hoje/).count() > 0, 'escritório vê no registro de entrega o que o cliente baixou pelo app');
  });
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
