// Site da Heild: a demonstração guiada (Contábil e BPO) segue as dicas até o resumo, a página não pula, o menu Soluções abre e o contato valida. Servir o build do site em 6101.
const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.setDefaultTimeout(8000); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const ok = (r, m) => console.log((r ? 'ok   ' : 'FALHA') + ' ' + m);
  const espera = async (f, ms) => { for (let i = 0; i < ms / 300; i++) { if (await f()) return true; await p.waitForTimeout(300) } return false };
  const dica = (t) => espera(async () => (await p.locator('.demo-guiada .dica', { hasText: t }).count()) > 0, 40000);
  await p.goto('http://localhost:6101/'); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: 'Soluções' }).click(); await p.waitForTimeout(300);
  ok(await p.locator('#menu-solucoes[data-aberto=true]').count() === 1, 'menu Soluções abre'); await p.keyboard.press('Escape');
  const demo = p.locator('#demo');
  const alturas = () => p.evaluate(() => [...document.querySelectorAll('#demo, #demo .revela > *')].map((e) => Math.round(e.getBoundingClientRect().height)).join(','));
  await demo.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  for (const [plat, dono, segundo] of [['Contábil', 'Contábil', 'Fiscal'], ['BPO', 'Contas a Pagar', 'Atendimento']]) {
    if (plat === 'BPO') { await demo.getByRole('tab', { name: 'BPO' }).click(); await p.waitForTimeout(500) }
    const h0 = await alturas();
    ok(await dica('Clique aqui para pedir'), `${plat}: dica na caixa`);
    await demo.locator('button[aria-label^="Pedir"]').click();
    ok(await dica(`O ${dono} começou`), `${plat}: dica aponta o Time`);
    await demo.getByRole('tab', { name: 'Time' }).click();
    ok(await espera(async () => (await demo.locator('.demo-guiada [aria-label=Integrantes]').count()) > 0, 3000), `${plat}: Time aberto com o ${dono}`);
    ok(await dica(`Agora é o ${segundo}`), `${plat}: dica aponta o ${segundo}`);
    await demo.locator('[aria-label=Integrantes] [role=tab]', { hasText: segundo }).click();
    if (plat === 'Contábil') {
      ok(await dica('Isto passa por você'), `${plat}: cartão de aprovação chega`);
      await demo.locator('[data-cartao-pendente] button').first().click({ noWaitAfter: true });
      ok(await espera(async () => (await demo.locator('[data-cartao-pendente]').count()) === 0, 5000), `${plat}: aprovado`);
    } else ok(await espera(async () => (await demo.locator('.dica', { hasText: 'Assistente' }).count()) > 0, 40000), `${plat}: Atendimento terminou`);
    ok(await dica('Assistente'), `${plat}: dica volta ao Assistente`);
    await demo.getByRole('tab', { name: 'Assistente' }).click();
    ok(await espera(async () => (await demo.getByRole('button', { name: 'Ver de novo' }).count()) > 0, 30000), `${plat}: resumo e "Ver de novo"`);
    const h1 = await alturas(); ok(h1 === h0, `${plat}: nada mudou de altura na seção (${h0} -> ${h1}; o Playwright rola sozinho ao clicar, então medimos as alturas e não o scrollY)`);
    await demo.screenshot({ path: `${out}/lp-demo-${plat}.png` });
  }
  await p.goto('http://localhost:6101/#contabil'); await p.waitForTimeout(2500); await p.screenshot({ path: `${out}/lp-contabil-hero.png` });
  await p.goto('http://localhost:6101/#contato'); await p.waitForTimeout(1500); await p.getByRole('button', { name: 'Pedir a demonstração' }).click(); await p.waitForTimeout(300);
  ok(await p.getByText('Escreva o seu nome.').count() > 0, 'formulário valida');
  console.log('erros', JSON.stringify(errs.slice(0, 5))); await b.close(); })();
