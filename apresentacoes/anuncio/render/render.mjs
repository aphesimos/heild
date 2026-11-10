#!/usr/bin/env node
/*
 * Anúncio da Heild — o render: quadro a quadro, com o relógio falso do Playwright, até o MP4.
 *
 *   node apresentacoes/anuncio/render/render.mjs                    # tudo: os 3 formatos e as 2 vinhetas
 *   node apresentacoes/anuncio/render/render.mjs --peca principal --formato 9x16
 *   node apresentacoes/anuncio/render/render.mjs --peca vinheta     # 16x9 e 9x16
 *   node apresentacoes/anuncio/render/render.mjs --peca principal --formato 4x5 --quadros 0-749/25 --pasta saida/quadros/a
 *
 * Opções: --paralelo N (padrão 3), --sem-build, --sem-som, --quadros A-B[/passo] (só PNGs, para conferir),
 * --pasta (onde ficam os PNGs de --quadros).
 *
 * Como funciona:
 * 1. Monta a página com o build comum (apresentacoes/build.py anuncio) e a embrulha num documento completo.
 * 2. Gera o som de cada peça com render/som.py, a partir do mesmo roteiro (src/roteiro.json).
 * 3. Para cada formato: Chromium com a janela no tamanho exato do vídeo e deviceScaleFactor 1; o relógio
 *    falso (page.clock) controla requestAnimationFrame, performance.now, Date e os timers, de que o
 *    <heild-logo> e o <orb-avatar> dependem. A página é montada com o relógio parado; depois, a cada
 *    quadro, o relógio anda 1/30 s (33 ou 34 ms, sem acumular erro), a página desenha o instante exato
 *    (ANUNCIO.quadro(i / 30)) e sai um PNG, que vai direto para o ffmpeg.
 * 4. O ffmpeg grava H.264 High, yuv420p (BT.709), 30 fps, CRF 18, faststart, com o som em AAC 48 kHz estéreo.
 *
 * Determinismo: Math.random com semente, o IntersectionObserver sempre "visível" (os orbs nunca param por
 * estarem fora da tela) e o devicePixelRatio em 3 para os orbs (canvas) saírem nítidos no palco ampliado.
 * Do lado do Chromium: o compositor termina a rasterização antes de desenhar, cada quadro rasteriza a página
 * inteira de novo (sem ladrilhos guardados de quadros anteriores) e um quadro de assentamento vem antes da
 * captura. O estado da página é idêntico entre renders; a imagem também, com a exceção descrita no README
 * (anti-serrilhado de uma letra em movimento, em poucos quadros).
 */
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/* O Playwright local, se houver; senão, o instalado globalmente (npm i -g playwright). */
async function carregarPlaywright() {
  try { return await import('playwright'); } catch (e) { /* tenta o global */ }
  const raiz = spawnSync('npm', ['root', '-g'], { encoding: 'utf8' }).stdout.trim();
  return import(pathToFileURL(path.join(raiz, 'playwright', 'index.mjs')).href);
}
const { chromium } = await carregarPlaywright();

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANUNCIO = path.resolve(AQUI, '..');
const APRESENTACOES = path.resolve(ANUNCIO, '..');
const SAIDA = path.join(ANUNCIO, 'saida');
const TMP = path.join(SAIDA, '.tmp');
const ROTEIRO = JSON.parse(fs.readFileSync(path.join(ANUNCIO, 'src', 'roteiro.json'), 'utf8'));
const FPS = ROTEIRO.fps;
const TAMANHOS = { '9x16': [1080, 1920], '4x5': [1080, 1350], '16x9': [1920, 1080] };
const FORMATOS_DA_PECA = { principal: ['9x16', '4x5', '16x9'], vinheta: ['16x9', '9x16'] };
const NOME = { principal: 'heild-anuncio', vinheta: 'heild-vinheta-6s' };

/* ---------- opções ---------- */
const args = process.argv.slice(2);
function opcao(nome, padrao) { const i = args.indexOf('--' + nome); return i < 0 ? padrao : args[i + 1]; }
function chave(nome) { return args.includes('--' + nome); }
const pecas = (opcao('peca', 'todas') === 'todas' ? ['principal', 'vinheta'] : [opcao('peca')]);
const formatoPedido = opcao('formato', 'todos');
const PARALELO = Math.max(1, parseInt(opcao('paralelo', '3'), 10));
const QUADROS = opcao('quadros', null);
const PASTA = opcao('pasta', null);

function log(...m) { console.log(new Date().toISOString().slice(11, 19), ...m); }
function rodar(cmd, a, o = {}) {
  const r = spawnSync(cmd, a, { stdio: 'inherit', ...o });
  if (r.status !== 0) throw new Error(`${cmd} ${a.join(' ')} saiu com ${r.status}`);
}
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 1. a página ---------- */
fs.mkdirSync(TMP, { recursive: true });
if (!chave('sem-build')) rodar('python3', [path.join(APRESENTACOES, 'build.py'), 'anuncio']);
const montado = fs.readFileSync(path.join(APRESENTACOES, 'dist', 'heild-anuncio.html'), 'utf8');
const PAGINA = path.join(TMP, 'anuncio.html');
fs.writeFileSync(PAGINA, '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n' + montado + '\n</body>\n</html>\n');

/* ---------- 2. o som ---------- */
const sons = {};
for (const peca of pecas) {
  sons[peca] = path.join(TMP, `som-${peca}.wav`);
  if (!chave('sem-som') && !QUADROS) rodar('python3', [path.join(AQUI, 'som.py'), '--peca', peca, '--saida', sons[peca]]);
}

/* ---------- 3. os quadros ---------- */
function intervalo() {
  if (!QUADROS) return null;
  const m = /^(\d+)-(\d+)(?:\/(\d+))?$/.exec(QUADROS);
  if (!m) throw new Error('--quadros A-B[/passo]');
  return { de: +m[1], ate: +m[2], passo: +(m[3] || 1) };
}

/* roda na página antes de tudo (só no render) */
function preparo() {
  Object.defineProperty(window, 'devicePixelRatio', { get: () => 3, configurable: true });
  let a = 0x9e3779b9 >>> 0;
  Math.random = function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { queueMicrotask(() => this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this)); }
    unobserve() {} disconnect() {} takeRecords() { return []; }
  };
}

async function renderizar(peca, formato) {
  const [w, h] = TAMANHOS[formato];
  const dur = ROTEIRO.pecas[peca].duracao;
  const total = Math.round(dur * FPS);
  const faixa = intervalo();
  const nome = `${NOME[peca]}-${formato}`;
  const erros = [];
  const browser = await chromium.launch({ args: [
    '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb',
    // o compositor termina tudo (inclusive a rasterização) antes de desenhar: nada de ladrilho atrasado ou de baixa resolução
    '--run-all-compositor-stages-before-draw', '--disable-checker-imaging', '--disable-threaded-animation',
    '--disable-image-animation-resync', '--disable-new-content-rendering-timeout',
    ...(process.env.CHROMIUM_FLAGS ? process.env.CHROMIUM_FLAGS.split(/\s+/).filter(Boolean) : [])] });
  const contexto = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'no-preference' });
  const page = await contexto.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') erros.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => erros.push(`pageerror: ${e.message}`));
  await page.addInitScript(preparo);
  await page.clock.install({ time: 0 });
  await page.goto('file://' + PAGINA + `?formato=${formato}&peca=${peca}&render`);
  for (let i = 0; !(await page.evaluate(() => window.ANUNCIO && window.ANUNCIO.fontes)); i++) {
    if (i > 400) throw new Error(`${nome}: as fontes não carregaram`);
    await dormir(25);
  }
  // relógio parado num instante fixo: a montagem (e cada orb criado) começa no mesmo tempo em todo render
  await page.clock.pauseAt(100000);
  await page.evaluate(() => window.ANUNCIO.montar());
  await page.screenshot({ type: 'png' });
  for (let i = 0; !(await page.evaluate(() => [...document.querySelectorAll('orb-avatar')].every((o) => o._cw > 0))); i++) {
    if (i > 400) throw new Error(`${nome}: os orbs não ganharam tamanho`);
    await dormir(25);
  }
  await page.evaluate(() => window.ANUNCIO.comecar());

  let ff = null;
  const destino = path.join(SAIDA, `${nome}.mp4`);
  if (!faixa) {
    const som = sons[peca] && fs.existsSync(sons[peca]) ? sons[peca] : null;
    const a = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-'];
    if (som) a.push('-i', som);
    a.push('-map', '0:v:0');
    if (som) a.push('-map', '1:a:0');
    a.push('-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p',
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-g', String(FPS * 2), '-threads', '2',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv');
    if (som) a.push('-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2');
    a.push('-t', dur.toFixed(3), '-movflags', '+faststart', destino);
    ff = spawn('ffmpeg', a, { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  const pastaPng = faixa ? path.resolve(PASTA || path.join(SAIDA, 'quadros', nome)) : null;
  if (pastaPng) fs.mkdirSync(pastaPng, { recursive: true });
  const capa = Math.round(ROTEIRO.pecas[peca].capa * FPS);
  const t0 = Date.now();
  let antes = 0;
  const ultimo = faixa ? Math.min(faixa.ate, total - 1) : total - 1;
  for (let i = 0; i <= ultimo; i++) {
    const alvo = Math.round(i * 1000 / FPS);
    if (alvo > antes) await page.clock.runFor(alvo - antes);
    antes = alvo;
    const t = i / FPS;
    // o fundo da página (coberto pelo quadro) muda um nível de cor a cada quadro: isso invalida a camada inteira e
    // obriga a rasterizar tudo de novo, sem reaproveitar ladrilhos de quadros anteriores
    await page.evaluate(([tt, k]) => { window.ANUNCIO.quadro(tt); document.body.style.backgroundColor = k % 2 ? 'rgb(19, 17, 15)' : 'rgb(19, 17, 14)'; }, [t, i]);
    const quer = faixa ? i >= faixa.de && (i - faixa.de) % faixa.passo === 0 : true;
    if (!quer) continue;
    await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1, height: 1 } }); // um quadro de assentamento
    const png = await page.screenshot({ type: 'png' });
    if (ff) { if (!ff.stdin.write(png)) await once(ff.stdin, 'drain'); }
    else fs.writeFileSync(path.join(pastaPng, `q${String(i).padStart(4, '0')}.png`), png);
    if (!faixa && peca === 'principal' && i === capa) fs.writeFileSync(path.join(SAIDA, `heild-anuncio-capa-${formato}.png`), png);
    if (i % 150 === 0) log(`${nome}: quadro ${i}/${total}`);
  }
  await browser.close();
  if (ff) {
    ff.stdin.end();
    const [codigo] = await once(ff, 'close');
    if (codigo !== 0) throw new Error(`${nome}: o ffmpeg saiu com ${codigo}`);
  }
  log(`${nome}: pronto em ${((Date.now() - t0) / 1000).toFixed(0)} s${faixa ? ' (PNGs em ' + pastaPng + ')' : ' → ' + destino}`);
  return { nome, erros };
}

const tarefas = [];
for (const peca of pecas) for (const f of FORMATOS_DA_PECA[peca]) if (formatoPedido === 'todos' || formatoPedido === f) tarefas.push([peca, f]);
const resultados = [];
let proxima = 0;
async function trabalhador() {
  while (proxima < tarefas.length) {
    const [peca, f] = tarefas[proxima++];
    resultados.push(await renderizar(peca, f));
  }
}
await Promise.all(Array.from({ length: Math.min(PARALELO, tarefas.length) }, trabalhador));
let falhou = false;
for (const r of resultados) {
  if (r.erros.length) { falhou = true; console.log(`\n${r.nome}: ${r.erros.length} mensagens no console:\n  ` + r.erros.slice(0, 20).join('\n  ')); }
  else console.log(`${r.nome}: console limpo`);
}
process.exit(falhou ? 1 : 0);
