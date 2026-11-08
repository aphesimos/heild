const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${n}.png` });
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(600) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // NFS-e
  await p.getByRole('button', { name: 'Financeiro', exact: true }).first().click(); await aba('Cobranças');
  await p.getByRole('button', { name: /Padaria Pão Quente ME nov\/26/ }).first().click(); await p.waitForTimeout(400);
  ok(await dlg().getByText(/layout nacional \(a confirmar na NT 007\/2026\)/).count() > 0 && await dlg().getByText(/São Paulo/).count() === 0, 'NFS-e: regra do layout nacional'); await p.keyboard.press('Escape');
  // Timesheet
  await p.getByRole('button', { name: 'Timesheet', exact: true }).first().click(); await p.waitForTimeout(500);
  await p.getByRole('radio', { name: 'BPO' }).click(); await p.waitForTimeout(400); await shot('d-meu-bpo');
  ok(await p.getByText(/Conferir o lote da Clínica/).count() > 0, 'Meu tempo filtra o BPO');
  await aba('Equipe'); await p.getByRole('radio', { name: 'BPO' }).click(); await p.waitForTimeout(400); await shot('d-equipe-bpo'); ok(await p.getByText('Marina Teixeira').count() > 0, 'Equipe filtra o BPO');
  await aba('Rentabilidade'); await p.getByRole('radio', { name: 'BPO' }).click(); await p.waitForTimeout(400); await shot('d-rent-bpo'); ok(await p.getByText('Mercado Bom Preço Ltda').count() > 0, 'Rentabilidade filtra o BPO');
  await p.getByRole('button', { name: /Custo-hora:/ }).click(); await p.waitForTimeout(400); ok(await dlg().getByText('Custo-hora por pacote (opcional)').count() > 0, 'custo-hora por pacote é opcional'); await shot('d-custo'); await p.keyboard.press('Escape');
  // BPO escalonamento
  await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await aba('Carteira'); await p.getByRole('button', { name: /Padaria Pão Quente/ }).first().click(); await p.waitForTimeout(400);
  await aba('Configuração'); await p.mouse.wheel(0, 900); await p.waitForTimeout(300); await shot('d-escalonamento'); ok(await p.getByText('Janela e escalonamento do lote').count() > 0, 'cadeia na Configuração');
  await aba('Aprovações'); await p.getByText(/Se ninguém responder/).first().click(); await p.waitForTimeout(300); await p.mouse.wheel(0, 900); await shot('d-linha-lote'); ok(await p.getByText(/vai ao substituto|sem substituto cadastrado/).count() > 0, 'linha do tempo no cartão');
  await aba('Rentabilidade'); await shot('d-bpo-rent');
  // FAQ
  await p.getByRole('button', { name: 'Suporte' }).first().click(); await p.waitForTimeout(400); await shot('d-faq');
  ok(await dlg().getByText('Perguntas frequentes').count() > 0, 'FAQ antes do assistente');
  await dlg().getByLabel('Buscar nas perguntas frequentes').fill('paga sozinho'); await p.waitForTimeout(200); ok(await dlg().getByText(/O sistema paga sozinho/).count() > 0, 'busca na FAQ');
  await dlg().getByLabel('Buscar nas perguntas frequentes').fill('exportar a DRE em excel'); await p.waitForTimeout(200); ok(await dlg().getByRole('button', { name: /Perguntar ao assistente/ }).count() > 0, 'sem resposta: vai ao assistente');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
