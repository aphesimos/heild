const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch();
 for (const esquema of ['dark']) {
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, colorScheme: esquema }); p.setDefaultTimeout(5000);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${esquema}-${n}.png` });
  const passo = async (n, f, esc = true) => { try { await f(); await p.waitForTimeout(450); await shot(n) } catch (e) { console.log('falhou', esquema, n, e.message.split('\n')[0]) } if (esc) { await p.keyboard.press('Escape'); await p.waitForTimeout(250) } };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(900); await shot('login');
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(300); await shot('2fa');
  await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  await passo('sino', () => p.getByRole('button', { name: /Notificações/ }).first().click());
  await passo('menu-usuario', () => p.getByRole('button', { name: 'Conta', exact: true }).click());
  await passo('minha-conta', async () => { await p.getByRole('button', { name: 'Conta', exact: true }).click(); await p.getByText('Minha conta').first().click() });
  await passo('lab', () => p.getByRole('button', { name: /Demonstração/ }).click());
  await passo('lab-escondido', () => p.getByRole('button', { name: 'Esconder a aba da demonstração' }).click(), false);
  try { await p.getByRole('button', { name: /Mostrar controles/ }).click() } catch {}
  await passo('ficha-tarefa', async () => { await p.getByRole('tab', { name: /^Time/ }).click(); await p.waitForTimeout(500); await p.locator('button:not([role=tab]):visible', { hasText: 'Fiscal' }).first().click(); await p.waitForTimeout(500); await p.getByRole('button', { name: /Abrir no CRM/ }).first().click(); await p.waitForTimeout(800); await shot('crm'); await p.getByRole('button', { name: /FIS-009/ }).first().click() });
  await passo('cobrar', async () => { await p.getByRole('button', { name: /FIS-009/ }).first().click(); await p.waitForTimeout(300); await dlg().getByRole('button', { name: 'Cobrar o cliente' }).click() }, false);
  await passo('toast', async () => { await dlg().getByRole('button', { name: 'Enviar', exact: true }).click() });
  await passo('ficha-cliente', async () => { await p.getByRole('button', { name: 'Ficha do cliente' }).first().click() });
  await passo('app-login', async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await dlg().getByRole('button', { name: /App do cliente/ }).click(); await p.keyboard.press('Escape') });
  await passo('app-inicio', async () => { await p.getByRole('button', { name: /^João Batista/ }).click(); await p.getByRole('button', { name: 'Receber código' }).click(); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Entrar', exact: true }).click() });
  await passo('ref-config', async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await dlg().getByRole('button', { name: /Painel do escritório/ }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(600); await p.getByRole('button', { name: 'Configurações', exact: true }).first().click() });
  await p.close();
 }
 const m = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'light' }); await m.goto('http://localhost:6100/'); await m.waitForTimeout(800); await m.screenshot({ path: `${out}/mobile-login.png`, fullPage: true });
 await b.close();
})();
