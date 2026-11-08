const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/a-${n}.png` });
  const lab = async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await p.waitForTimeout(300) };
  const nav = async (n) => { await p.getByRole('navigation', { name: 'Menu do app' }).getByRole('button', { name: n }).click(); await p.waitForTimeout(300) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await lab(); await dlg().getByRole('button', { name: /App do cliente/ }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(400); await shot('login');
  // login real: toca em João Batista, recebe código
  await p.getByRole('button', { name: /^João Batista/ }).click(); await p.getByRole('button', { name: 'Receber código' }).click();
  await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(500); await shot('inicio');
  ok(await p.getByText(/O escritório precisa de você/).count() > 0, 'Início da Padaria mostra pendências');
  const n0 = await p.getByRole('button', { name: 'Enviar', exact: false }).count();
  await nav('Pendências'); await shot('pendencias');
  await p.locator('section', { hasText: 'Notas de outubro' }).getByRole('button', { name: /Enviar arquivo/ }).click(); await p.waitForTimeout(400);
  ok(await p.getByText(/Recebido. Protocolo/).count() > 0, 'enviar pendência confirma protocolo'); await shot('enviado');
  await nav('Conversa'); await shot('conversas');
  await p.getByRole('button', { name: /^Fiscal/ }).first().click(); await p.waitForTimeout(300);
  ok(await p.getByText(/Enviei pelo app/).count() > 0, 'mensagem do envio aparece na conversa fiscal'); 
  await p.getByLabel('Mensagem').fill('A nota 1450 foi cancelada, mando o XML junto.'); await p.getByRole('button', { name: 'Enviar', exact: true }).click(); await p.waitForTimeout(300); await shot('conversa');
  await nav('Mais'); await p.getByRole('button', { name: 'Pedidos' }).click(); await p.getByRole('button', { name: 'Novo pedido' }).click();
  await p.getByLabel('Tipo de pedido').selectOption('Férias'); await p.getByLabel('Detalhes').fill('Carla (balconista), 01/12, 20 dias'); await p.getByRole('button', { name: 'Abrir pedido' }).click(); await p.waitForTimeout(400); await shot('pedido');
  ok(await p.getByText(/Férias: Carla/).count() > 0, 'pedido aparece em andamento');
  // troca para Café Central
  await p.getByRole('button', { name: 'Trocar empresa' }).click(); await p.getByRole('button', { name: /Café Central/ }).click(); await p.waitForTimeout(300); await shot('cafe');
  await nav('Mais'); await p.getByRole('button', { name: /Financeiro/ }).click(); await p.waitForTimeout(300); await shot('financeiro');
  await nav('Mais'); await p.getByRole('button', { name: 'Empresa', exact: true }).click(); await p.waitForTimeout(300); await shot('empresa');
  await nav('Docs'); await shot('docs');
  ok(await p.getByText(/Chegou ao escritório/).count() > 0 && await p.getByText(/Abriu o pedido DP-024/).count() > 0, 'painel lateral mostra o que chegou');
  // escritório: Rafael (fiscal da Padaria) vê aviso e mensagem
  await p.getByRole('button', { name: 'Ver no painel do escritório' }).click(); await p.waitForTimeout(600);
  await lab(); await dlg().getByRole('button', { name: /Rafael Nunes/ }).click(); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: /Notificações/ }).first().click(); await p.waitForTimeout(400); await shot('sino-rafael');
  const aviso = p.getByRole('button', { name: /pelo app/ }).first();
  ok(await aviso.count() > 0, 'Rafael recebe aviso do app');
  await aviso.click(); await p.waitForTimeout(1000); await shot('crm-rafael');
  ok(await p.getByText(/A nota 1450 foi cancelada/).count() > 0, 'mensagem do app aparece no CRM do escritório');
  // Ana (DP) recebe o pedido de férias
  await lab(); await dlg().getByRole('button', { name: /Ana Souza/ }).click(); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: /Notificações/ }).first().click(); await p.waitForTimeout(400);
  ok(await p.getByText(/Pedido novo pelo app: Férias/).count() > 0, 'responsável do DP recebe o pedido'); await shot('sino-ana');
  await p.getByText(/Pedido novo pelo app: Férias/).first().click(); await p.waitForTimeout(600); await shot('ficha-pedido');
  ok(await dlg().getByText(/Férias: Carla/).count() > 0, 'aviso abre a ficha da tarefa do pedido');
  // escritório responde → aparece no app
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
