// Renderiza os posts da Heild: cada quadro no tamanho exato, as legendas, as folhas de contato e o mock da grade.
//
// Uso (da raiz do repositório):
//   git fetch origin design-system prototipo
//   python3 redes-sociais/render/montar.py          # monta render/dist/posts.html
//   node redes-sociais/render/render.mjs            # renderiza tudo
//   node redes-sociais/render/render.mjs 05 F1      # só alguns posts (pelo id)
//
// Saída:
//   redes-sociais/posts/<grupo>/<id>-<nome>/NN.jpg   os quadros (JPG 4:4:4, qualidade 92)
//   redes-sociais/posts/legendas.md                   legenda, hashtags e texto alternativo de cada post
//   redes-sociais/revisao/                            folhas de contato e o mock da grade (PNG, fora do que se publica)
//
// Playwright já instalado no ambiente: chromium.launch() sem opções, deviceScaleFactor 1, movimento reduzido (a
// logo para direto na forma pedida e os orbs ficam parados).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
function carregarPlaywright() {
  try { return require('playwright'); } catch { /* fora de um projeto: o Playwright global do ambiente */ }
  const raiz = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  for (const p of [path.join(raiz, 'playwright'), '/opt/node-tools/node_modules/playwright']) {
    try { return require(p); } catch { /* tenta o próximo */ }
  }
  throw new Error('Playwright não encontrado');
}
const { chromium } = carregarPlaywright();

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RS = path.resolve(AQUI, '..');
const POSTS = path.join(RS, 'posts');
const REVISAO = path.join(RS, 'revisao');
const PAGINA = path.join(AQUI, 'dist', 'posts.html');
if (!fs.existsSync(PAGINA)) throw new Error('Rode antes: python3 redes-sociais/render/montar.py');

const PASTA = { fixado: 'fixados', feed: 'feed', reels: 'feed', stories: 'stories', perfil: 'perfil' };
const slug = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const so = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1800, height: 2000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('erro na página:', e.message));
await page.goto('file://' + PAGINA);

const lista = await page.evaluate(() => HP.posts().map(p => ({
  id: p.id, grupo: p.grupo || 'feed', tipo: p.tipo, desenho: p.desenho || '', formato: p.formato || 'feed', tema: p.tema, serie: p.serie || '',
  pilar: p.pilar || '', n: p.slides.length, legenda: p.legenda || '', hashtags: p.hashtags || [], alt: p.alt || [], video: p.video || '',
  fontes: p.fontes || [], lei: !!p.lei, titulo: (p.titulo || p.slides[0].titulo || p.slides[0].frase || p.slides[0].texto || '').replace(/\*/g, '')
})));

// confere o básico de cada post antes de renderizar
for (const p of lista) {
  if (p.alt.length !== p.n) console.warn(`aviso: ${p.id} tem ${p.n} quadros e ${p.alt.length} textos alternativos`);
  if (p.hashtags.length > 5) console.warn(`aviso: ${p.id} tem ${p.hashtags.length} hashtags (o Instagram aceita 5)`);
}

// renderizando tudo, começa de pastas limpas (um post renomeado não deixa a pasta antiga para trás)
if (!so.length) for (const g of new Set(Object.values(PASTA))) fs.rmSync(path.join(POSTS, g), { recursive: true, force: true });

const feitos = {};
for (const p of lista) {
  const nome = `${p.id}-${slug(p.serie === 'Reels' ? p.titulo : (p.desenho || p.serie))}`.replace(/-+$/, '');
  const pasta = path.join(POSTS, PASTA[p.grupo] || 'feed', p.grupo === 'perfil' || p.grupo === 'stories' ? '' : nome);
  feitos[p.id] = [];
  if (so.length && !so.includes(p.id)) {
    // mantém os caminhos dos já renderizados, para as legendas e a revisão
    for (let i = 0; i < p.n; i++) feitos[p.id].push(path.join(pasta, p.grupo === 'perfil' || p.grupo === 'stories' ? `${p.id}${p.n > 1 ? '-' + (i + 1) : ''}.jpg` : `${String(i + 1).padStart(2, '0')}.jpg`));
    continue;
  }
  fs.mkdirSync(pasta, { recursive: true });
  for (let i = 0; i < p.n; i++) {
    const r = await page.evaluate(([id, n]) => HP.montar(id, n), [p.id, i]);
    const arq = path.join(pasta, p.grupo === 'perfil' || p.grupo === 'stories' ? `${p.id}${p.n > 1 ? '-' + (i + 1) : ''}.jpg` : `${String(i + 1).padStart(2, '0')}.jpg`);
    const png = await page.locator('.quadro').screenshot({ type: 'png' });
    fs.writeFileSync(arq + '.png', png);
    // JPG 4:4:4 (sem subamostragem de cor), para o texto e os pontos não borrarem
    execFileSync('python3', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
assert im.size == (${r.w}, ${r.h}), im.size
im.save(sys.argv[2], 'JPEG', quality=92, subsampling=0, optimize=True, progressive=True)
`, arq + '.png', arq]);
    fs.unlinkSync(arq + '.png');
    feitos[p.id].push(arq);
  }
  console.log(`${p.id}: ${p.n} quadro(s) em ${path.relative(RS, pasta) || '.'}`);
}
await browser.close();

// ---------- as legendas ----------
const rel = f => path.relative(POSTS, f).split(path.sep).join('/');
const md = ['# Legendas dos posts da Heild', '',
  'Gerado por `redes-sociais/render/render.mjs` a partir de `redes-sociais/modelos/src/posts.js`. Não edite à mão: mude o post e renderize de novo.', '',
  'Ordem de publicação: os três fixados no dia do lançamento, depois de 01 a 21 (o calendário está em `docs/planos/Plano_Redes_Sociais.md`). Cada post tem a legenda pronta, as hashtags (no máximo 5) e um texto alternativo por imagem, para o campo "Escrever texto alternativo" do Instagram e do Facebook.', ''];
const titulos = { fixado: 'Os três fixados', feed: 'O feed', reels: 'O feed', stories: 'Stories (modelos)', perfil: 'Perfil' };
let grupoAtual = '';
for (const p of lista) {
  const g = titulos[p.grupo] || 'O feed';
  if (g !== grupoAtual) { md.push(`## ${g}`, ''); grupoAtual = g; }
  const tipo = { carrossel: `carrossel de ${p.n} (${p.desenho.toLowerCase()})`, estatico: 'imagem única', reels: 'Reel (capa)', story: 'Story', perfil: 'perfil', destaque: 'capa de destaque' }[p.tipo] || p.tipo;
  md.push(`### ${p.id} · ${p.titulo || p.serie}`, '', `${tipo} · ${p.tema} · ${p.pilar || p.serie}`, '');
  md.push(feitos[p.id].map((f, i) => `[${String(i + 1).padStart(2, '0')}](${rel(f)})`).join(' · '), '');
  if (p.video) md.push(`**Vídeo:** ${p.video}`, '');
  if (p.grupo === 'perfil' || p.grupo === 'stories') {
    md.push(p.legenda, '');
  } else {
    md.push('**Legenda**', '', '```text', p.legenda + (p.hashtags.length ? '\n\n' + p.hashtags.join(' ') : ''), '```', '');
  }
  md.push('**Texto alternativo**', '', ...p.alt.map((a, i) => `${i + 1}. ${a}`), '');
  if (p.fontes.length) md.push('**Fontes conferidas**', '', ...p.fontes.map(f => `- <${f}>`), '');
}
fs.writeFileSync(path.join(POSTS, 'legendas.md'), md.join('\n'));

// ---------- a revisão: folhas de contato e o mock da grade ----------
fs.mkdirSync(REVISAO, { recursive: true });
fs.writeFileSync(path.join(REVISAO, 'manifesto.json'), JSON.stringify(lista.map(p => ({ ...p, arquivos: feitos[p.id].map(f => path.relative(RS, f).split(path.sep).join('/')) })), null, 2));
console.log('legendas.md e revisao/manifesto.json prontos. Para as folhas de contato e a grade: node redes-sociais/render/revisao.mjs');
