// Varre todos os botões de cada tela e aponta os que não mudam nada.
const { chromium } = require('playwright');
const telas = [
  ['Início', ['Assistente', 'Time', 'Visão geral']],
  ['Painel', ['Societário', 'Obrigações', 'Notas', 'Fiscal', 'DP', 'Contábil', 'Consultoria', 'Gestão']],
  ['CRM', ['Conversas', 'Leads', 'Comunicados', 'Números']],
  ['Timesheet', ['Meu tempo', 'Equipe', 'Rentabilidade', 'Confirmações']],
  ['Financeiro', ['Contratos', 'Cobrança', 'Caixa', 'Resultado']],
  ['Configurações', ['Escritório', 'Usuários', 'Armazenamento', 'Tema', 'Integrantes', 'Assinatura']],
];
const pular = /^(Início|Painel|CRM|Timesheet|Financeiro|Configurações|Conta|Recolher|Expandir|Demonstração|Abrir menu)/;
(async () => {
  const filtroModulo = process.argv[2]; const comCliente = process.argv[3] === 'cliente';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  await p.evaluate(() => { window.__m = 0; new MutationObserver((ms) => { for (const m of ms) { const el = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (el && el.closest && el.closest('[role=tooltip],[data-slot=tooltip-content]')) continue; if (m.type === 'attributes' && (m.attributeName === 'data-state' || m.attributeName === 'style' || m.attributeName === 'class') && el && el.closest && el.closest('[data-radix-popper-content-wrapper]')) continue; window.__m++ } }).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true }) });
  const mortos = [];
  for (const [mod, abas] of telas) {
    if (filtroModulo && mod !== filtroModulo) continue;
    for (const aba of abas) {
      const ir = async () => { await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.getByRole('button', { name: mod, exact: true }).first().click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(300); await p.getByRole('tab', { name: new RegExp('^' + aba) }).first().click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(500);
        if (comCliente && !['CRM', 'Financeiro', 'Configurações'].includes(mod)) { const sel = p.getByRole('button', { name: /Carteira|Metalúrgica/ }).first(); if (await sel.count()) { await sel.click(); await p.getByRole('option', { name: /Metalúrgica/ }).first().click().catch(() => {}); await p.waitForTimeout(400) } } };
      await ir();
      const total = await p.locator('main button:visible').count();
      for (let i = 0; i < total; i++) {
        const bt = p.locator('main button:visible').nth(i);
        if (!(await bt.count())) break;
        const nome = ((await bt.getAttribute('aria-label')) || (await bt.innerText().catch(() => '')) || '').trim().replace(/\s+/g, ' ').slice(0, 60);
        if (!nome || pular.test(nome) || (await bt.isDisabled())) continue;
        await p.mouse.move(5, 5); await p.waitForTimeout(80); await p.evaluate(() => (window.__m = 0));
        await bt.click({ timeout: 1500 }).catch(() => {});
        await p.waitForTimeout(220);
        const m = await p.evaluate(() => window.__m);
        if (m === 0) mortos.push(`${mod} › ${aba}: "${nome}"`);
        const dlg = await p.getByRole('dialog').count(); const menu = await p.getByRole('menu').count();
        if (dlg || menu) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
        // se saiu da aba, volta
        const ativo = await p.getByRole('tab', { name: new RegExp('^' + aba) }).first().getAttribute('aria-selected', { timeout: 1000 }).catch(() => null);
        if (ativo !== 'true') await ir();
      }
      console.log(`varrido ${mod} › ${aba} (${total} botões)`);
    }
  }
  console.log('\nSEM EFEITO:\n' + mortos.join('\n')); console.log('erros', erros.slice(0, 5)); await b.close();
})();
