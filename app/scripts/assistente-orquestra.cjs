// Assistente orquestra o pedido (pedido, trabalho, retorno, passagem, fechamento), chats sem "foto" e perguntas jurídicas.
const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const shot = (n) => p.screenshot({ path: `${out}/orq-${n}.png` });
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(400) };
  const espera = async (f, ms) => { for (let i = 0; i < ms / 400; i++) { if (await f()) return true; await p.waitForTimeout(400) } return false };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // Chat do BPO: rotinas andando, fila e cartões contados de verdade
  await aba('Time'); await p.locator('main').getByText('Conciliação', { exact: true }).first().click(); await p.waitForTimeout(600);
  ok(await p.getByText(/Conciliação está fazendo: Conciliar o extrato/).count() > 0, 'Conciliação (BPO): rotina andando no chat'); await shot('1-bpo');
  const cab = await p.locator('header').filter({ hasText: 'fila:' }).first().innerText(); console.log('   cabeçalho:', cab.replace(/\n/g, ' | '));
  // Assistente: pedido completo
  await aba('Assistente');
  { const ab = p.getByRole('button', { name: 'Abrir sugestões' }); if (await ab.count()) { await ab.click(); await p.waitForTimeout(350) } } await p.getByRole('button', { name: /Feche outubro da Metalúrgica/ }).click();
  ok(await espera(async () => (await p.getByText(/Contábil está fazendo: Fechar outubro/).count()) > 0, 15000), 'trabalho do Contábil aparece no chat do Assistente'); await shot('2-contabil-fazendo');
  ok(await espera(async () => (await p.getByText(/Contábil devolveu ao Assistente/).count()) > 0, 25000), 'Contábil devolve ao Assistente');
  ok(await p.getByText(/Contábil fez: Fechar outubro/).count() > 0, 'cartão do Contábil fica concluído');
  ok(await espera(async () => (await p.getByText(/Fiscal está fazendo: Apurar/).count()) > 0, 25000), 'Assistente passa ao Fiscal e o trabalho dele aparece'); await shot('3-fiscal-fazendo');
  ok(await espera(async () => (await p.getByText(/Outubro da Metalúrgica está fechado e confere/).count()) > 0, 40000), 'Assistente fecha com o resultado');
  await p.waitForTimeout(8000);
  ok(await p.getByText('Fechamento de outubro · Metalúrgica Andrade').count() > 0, 'tabela do fechamento no fim');
  ok(await p.getByText('Enviar as guias de outubro da Metalúrgica ao cliente').count() > 0, 'aprovação das guias no fim');
  const toasts = await p.locator('[data-toast], [role="status"]').filter({ hasText: /Ver no Time/ }).count(); ok(toasts === 0, `sem toast enquanto acompanha no Assistente (${toasts})`);
  await shot('4-fim');
  await p.screenshot({ path: `${out}/orq-4-fim-inteiro.png`, fullPage: true });
  // Pergunta jurídica
  await p.getByRole('button', { name: 'Nova conversa' }).click(); await p.waitForTimeout(500);
  { const ab = p.getByRole('button', { name: 'Abrir sugestões' }); if (await ab.count()) { await ab.click(); await p.waitForTimeout(350) } } await p.getByRole('button', { name: /fator R em 2027/ }).click();
  ok(await espera(async () => (await p.getByText(/Consultor está fazendo/).count()) > 0, 15000), 'Consultor trabalha (cascata)'); await shot('5-consultor');
  ok(await espera(async () => (await p.getByText('Trechos citados').count()) > 0, 50000), 'resposta jurídica no modelo');
  await p.waitForTimeout(1000);
  for (const t of ['Fundamento', 'Cálculo', 'Divergências', 'Grau de segurança: alto', 'Data considerada: 01/01/2027', 'LC 123/2006, art. 18, § 5º-J']) ok(await p.getByText(t, { exact: false }).count() > 0, 'modelo: ' + t);
  await shot('6-legal');
  // Notificação: no chat do Consultor, sem toast ao terminar
  await aba('Time'); await p.locator('main').getByText('Consultor', { exact: true }).first().click(); await p.waitForTimeout(500);
  await p.getByPlaceholder(/Escreva para Consultor/).fill('A Loja Bela Vista vai passar do sublimite?'); await p.getByPlaceholder(/Escreva para Consultor/).press('Enter');
  ok(await espera(async () => (await p.getByText(/Grau de segurança: médio/).count()) > 0, 50000), 'Consultor responde no chat dele');
  const t2 = await p.getByText('Consultor respondeu sobre o sublimite da Loja Bela Vista').count(); ok(t2 === 0, `sem toast no chat de quem terminou (${t2})`);
  await shot('7-consultor-chat');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
