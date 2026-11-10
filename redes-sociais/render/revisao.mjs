// A revisão visual: folhas de contato de cada grupo e o mock do perfil, com a grade no corte 3:4.
//
// Uso (depois do render.mjs):  node redes-sociais/render/revisao.mjs
// Saída em redes-sociais/revisao/: folha-fixados.png, folha-feed.png, folha-stories-perfil.png e grade.png (em 2×)
// (e grade.html, a mesma grade para abrir no navegador). Lê revisao/manifesto.json, escrito pelo render.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
function carregarPlaywright() {
  try { return require('playwright'); } catch { /* usa o global */ }
  const raiz = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  for (const p of [path.join(raiz, 'playwright'), '/opt/node-tools/node_modules/playwright']) { try { return require(p); } catch { /* próximo */ } }
  throw new Error('Playwright não encontrado');
}
const { chromium } = carregarPlaywright();

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RS = path.resolve(AQUI, '..');
const REV = path.join(RS, 'revisao');
const lista = JSON.parse(fs.readFileSync(path.join(REV, 'manifesto.json'), 'utf8'));
const url = f => 'file://' + path.join(RS, f);
const tokens = fs.readFileSync(path.resolve(RS, '../apresentacoes/comum/tokens.css'), 'utf8');
const base = `<meta charset="utf-8"><style>${tokens}
  body { margin: 0; padding: 32px; background: var(--rebaixada); color: var(--texto); font: 15px/20px ui-sans-serif, system-ui, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 20px; font-weight: 500; } .linha { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 22px; }
  .rot { width: 150px; flex: none; font-size: 13px; line-height: 18px; } .rot b { display: block; font-size: 16px; }
  img { display: block; border-radius: 4px; box-shadow: var(--sombra-cartao); }
  .id { opacity: 0; transition: opacity .15s; } .cel:hover .id { opacity: 1; }  /* o número de ordem só ao passar o mouse: a grade fica como o perfil real */
</style>`;

function folha(titulo, posts, alt = 300) {
  return base + `<h1>${titulo}</h1>` + posts.map(p => `<div class="linha"><div class="rot"><b>${p.id}</b>${p.tipo}${p.desenho ? ' · ' + p.desenho : ''}<br>${p.tema}</div>` +
    p.arquivos.map(a => `<img src="${url(a)}" style="height:${p.formato === 'capa-fb' ? alt * 0.45 : alt}px">`).join('') + '</div>').join('');
}

// ---------- o perfil: cabeçalho, destaques e a grade (fixados em cima, depois do mais novo ao mais velho) ----------
const feed = lista.filter(p => p.grupo === 'feed' || p.grupo === 'reels').reverse();
const fixados = lista.filter(p => p.grupo === 'fixado');
const grade = [...fixados, ...feed];
const foto = lista.find(p => p.id === 'perfil-foto');
const destaques = lista.filter(p => p.tipo === 'destaque');
const NOMES = { 'destaque-o-que-e': 'O que é', 'destaque-time': 'O time', 'destaque-a-lei': 'A lei', 'destaque-contabil': 'Contábil', 'destaque-bpo': 'BPO' };
const bio = fs.readFileSync(path.join(AQUI, 'bio.txt'), 'utf8').trim().split('\n');
const pino = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;top:8px;right:8px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))"><path d="M9 4h6l-1 5 3 3H7l3-3z"/><path d="M12 12v8"/></svg>';
const reel = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" style="position:absolute;top:8px;right:8px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 8.5v7l6-3.5z" fill="#fff"/></svg>';
const multi = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" style="position:absolute;top:8px;right:8px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))"><rect x="7" y="7" width="13" height="13" rx="3"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';
function perfilHtml(larg) {
  const cel = (larg - 4) / 3;
  return base.replace('padding: 32px', 'padding: 0') + `<div style="width:${larg}px;background:#fff;color:#111;font-family:ui-sans-serif,system-ui,sans-serif">
  <div style="display:flex;gap:28px;align-items:center;padding:24px 20px 12px">
    <img src="${url(foto.arquivos[0])}" style="width:96px;height:96px;border-radius:50%;box-shadow:none">
    <div style="display:flex;gap:28px;text-align:center;font-size:14px"><div><b style="font-size:17px">${grade.length}</b><br>posts</div><div><b style="font-size:17px">—</b><br>seguidores</div><div><b style="font-size:17px">—</b><br>seguindo</div></div>
  </div>
  <div style="padding:0 20px 14px;font-size:14px;line-height:19px">${bio.map((l, i) => i === 0 ? `<b>${l}</b>` : l).join('<br>')}</div>
  <div style="display:flex;gap:16px;padding:4px 20px 18px">${destaques.map(d => `<div style="text-align:center;font-size:12px"><div style="width:64px;height:64px;border-radius:50%;padding:3px;border:1px solid #ddd"><img src="${url(d.arquivos[0])}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;box-shadow:none"></div>${NOMES[d.id]}</div>`).join('')}</div>
  <div style="display:grid;grid-template-columns:repeat(3,${cel}px);gap:2px">${grade.map(p => `<div class="cel" style="position:relative;width:${cel}px;aspect-ratio:3/4;overflow:hidden">
    <img src="${url(p.arquivos[0])}" style="width:100%;height:100%;object-fit:cover;border-radius:0;box-shadow:none">${p.grupo === 'fixado' ? pino : p.tipo === 'reels' ? reel : p.tipo === 'carrossel' ? multi : ''}
    <span class="id" style="position:absolute;left:6px;top:6px;font:11px ui-monospace,monospace;color:#fff;background:rgba(0,0,0,.45);padding:1px 5px;border-radius:4px">${p.id}</span></div>`).join('')}</div></div>`;
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 })).newPage();
async function foto_(html, arq) {
  const tmp = path.join(REV, '_tmp.html');
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(REV, arq), fullPage: true });
  fs.unlinkSync(tmp);
  console.log(arq);
}
await foto_(folha('Os três fixados', fixados), 'folha-fixados.png');
await foto_(folha('O feed, de 01 a 21', lista.filter(p => p.grupo === 'feed' || p.grupo === 'reels'), 260), 'folha-feed.png');
await foto_(folha('Stories, perfil e destaques', lista.filter(p => p.grupo === 'stories' || p.grupo === 'perfil'), 360), 'folha-stories-perfil.png');
// a grade em resolução dobrada (deviceScaleFactor 2), para ler os detalhes
const page2 = await (await browser.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 })).newPage();
{
  const tmp = path.join(REV, '_tmp.html');
  fs.writeFileSync(tmp, perfilHtml(430));
  await page2.goto('file://' + tmp);
  await page2.waitForLoadState('networkidle');
  await page2.screenshot({ path: path.join(REV, 'grade.png'), fullPage: true });
  fs.unlinkSync(tmp);
  console.log('grade.png');
}
fs.writeFileSync(path.join(REV, 'grade.html'), perfilHtml(430).replaceAll('file://' + RS + '/', '../'));
await browser.close();
