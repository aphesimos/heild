const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const dlg = () => p.getByRole('dialog');
  const shot = (n) => p.screenshot({ path: `${out}/${n}.png` });
  const lab = async () => { await p.getByRole('button', { name: /Demonstração/ }).click(); await p.waitForTimeout(300) };
  const aba = async (a) => { await p.getByRole('tab', { name: new RegExp('^' + a) }).click(); await p.waitForTimeout(600) };
  await p.goto('http://localhost:6100/'); await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Fernanda Lima/ }).first().click(); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(400); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Confirmar' }).click(); await p.waitForTimeout(1200);
  // 1. fatura única
  await p.getByRole('button', { name: 'Financeiro', exact: true }).first().click(); await aba('Cobranças');
  ok(await p.getByText(/2 serviços, 2 NFS-e/).count() > 0, 'lista mostra fatura com 2 serviços e 2 notas');
  await p.getByRole('button', { name: /Padaria Pão Quente ME nov\/26/ }).first().click(); await p.waitForTimeout(400); await shot('r-fatura');
  ok(await dlg().getByText('Notas fiscais por serviço').count() > 0 && await dlg().getByText(/NFS-e 2026\//).count() === 2, 'detalhe: linhas e duas NFS-e');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // 2. suporte
  await p.getByRole('button', { name: 'Suporte' }).first().click(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: 'Não recebo os avisos de conversas' }).click(); await p.waitForTimeout(3800);
  ok(await dlg().getByText(/somente leitura/).count() > 0, 'diagnóstico: olhando (somente leitura)'); await shot('r-diag-lendo');
  await p.waitForTimeout(3500); await shot('r-diag');
  await dlg().getByRole('button', { name: 'Aprovar' }).click(); await p.waitForTimeout(300); ok(await dlg().getByText(/Aprovada por você/).count() > 0, 'correção só com aprovação');
  await dlg().getByRole('radio', { name: 'Falar com a equipe' }).click(); await dlg().getByLabel('Mensagem para a equipe').fill('O aviso ainda não chegou'); await dlg().getByRole('button', { name: 'Enviar' }).click();
  await p.waitForTimeout(9000); await shot('r-pedido-tela'); ok(await dlg().getByText(/pede para ver a sua tela/).count() > 0, 'pedido de ver a tela');
  await dlg().getByRole('button', { name: /Deixar ver/ }).click(); await p.waitForTimeout(300); await p.keyboard.press('Escape'); await p.waitForTimeout(300); await shot('r-tela-ativa');
  ok(await p.getByRole('status').filter({ hasText: 'está vendo a sua tela' }).count() > 0, 'indicador na tela enquanto dura');
  await p.getByRole('status').filter({ hasText: 'está vendo' }).getByRole('button', { name: 'Encerrar' }).click(); await p.waitForTimeout(300); ok(await p.getByRole('status').filter({ hasText: 'está vendo' }).count() === 0, 'encerrar');
  // 3. alçada
  await p.getByRole('button', { name: 'BPO', exact: true }).first().click(); await p.waitForTimeout(500); await aba('Carteira'); await p.getByRole('button', { name: /Padaria Pão Quente/ }).first().click(); await p.waitForTimeout(500);
  await aba('Configuração'); await p.getByRole('button', { name: 'Editar' }).first().click(); await p.waitForTimeout(300); await dlg().getByRole('button', { name: 'Mandar para o aceite' }).click(); await p.waitForTimeout(400); await shot('r-proposta');
  ok(await p.getByText(/aguardando o aceite do cliente/).count() > 0, 'proposta espera o aceite');
  await aba('Aprovações'); await shot('r-alterou'); ok(await p.getByText(/alterou as alçadas desta empresa/).count() > 0, 'quem alterou a alçada não confere');
  await aba('Volume'); await shot('r-volume');
  // 4. app
  await lab(); await dlg().getByRole('button', { name: /App do cliente/ }).click(); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /^João Batista/ }).click(); await p.getByRole('button', { name: 'Receber código' }).click(); await p.getByLabel('Código').fill('123456'); await p.getByRole('button', { name: 'Entrar', exact: true }).click(); await p.waitForTimeout(500);
  await shot('r-app-inicio'); ok(await p.getByText(/propôs novas alçadas/).count() > 0, 'app: proposta de alçada para aceitar');
  ok(await p.getByText(/Pagamentos para aprovar/).count() > 0 && await p.getByText(/O escritório precisa de você/).count() > 0, 'um só app: contábil e BPO somados');
  await p.getByRole('button', { name: 'Aceitar' }).click(); await p.waitForTimeout(300);
  await p.getByRole('navigation', { name: 'Menu do app' }).getByRole('button', { name: 'Mais' }).click(); await p.getByRole('button', { name: /Financeiro com o escritório/ }).click(); await p.waitForTimeout(300); await shot('r-app-fatura');
  ok(await p.getByText('Mensalidade do BPO financeiro').count() > 0, 'app: linhas por serviço');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close();
})();
