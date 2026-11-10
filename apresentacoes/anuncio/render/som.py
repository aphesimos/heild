#!/usr/bin/env python3
"""Anúncio da Heild — a trilha, sintetizada do zero com numpy, a partir de src/roteiro.json.

  python3 apresentacoes/anuncio/render/som.py --peca principal --saida saida/.tmp/som-principal.wav
  python3 apresentacoes/anuncio/render/som.py --peca vinheta   --saida saida/.tmp/som-vinheta.wav

Nada de música de terceiros: cada som é feito aqui, com senos, ruído e envelopes.
- O leito: um pulso eletrônico a 120 BPM (o bpm do roteiro), em ré menor (Dm, Bb, F, C, um acorde por
  compasso), com bombo, grave com sidechain, chimbal, palmas, arpejo em pizzicato e, no trecho escuro, um
  pad mais grave. A batida entra em musica.entra (a pílula), muda de cor no trecho escuro e para em
  musica.para; o acorde final (Fmaj9) soa no cartão final.
- Os efeitos saem dos 'eventos' do roteiro, presos às mesmas marcas que a animação usa: impactos nos
  cortes e nas palavras, tiques nas fichas, sucção, whooshes nos chicotes, risers, o estalo de cada
  tecla, o clique em Aprovar, o carimbo, as 14 transmissões, o sino da segurança alta, a varredura da onda
  do tema e a cascata de notas quando a logo se divide (os 55 ms de cascata do <heild-logo>).
- Mixagem em estéreo, 48 kHz, reverb por convolução com uma resposta sintética, e normalização em
  -14 LUFS integrado com pico real de -1,5 dBTP (loudnorm do ffmpeg, em duas passadas).
Só precisa de numpy e do ffmpeg.
"""
import argparse
import json
import pathlib
import subprocess
import tempfile
import wave

import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent
ROTEIRO = json.loads((AQUI.parent / 'src' / 'roteiro.json').read_text(encoding='utf-8'))
SR = 48000
RNG = np.random.default_rng(20261110)


# ----------------------------------------------------------------------------------------------
# utilidades
# ----------------------------------------------------------------------------------------------
def n_de(s: float) -> int:
    return int(round(s * SR))


def tempo(dur: float) -> np.ndarray:
    return np.arange(n_de(dur)) / SR


def ruido(dur: float) -> np.ndarray:
    return RNG.standard_normal(n_de(dur))


def hz(nota: float) -> float:
    """Nota MIDI para frequência."""
    return 440.0 * 2 ** ((nota - 69) / 12)


def filtro(x: np.ndarray, lo: float | None = None, hi: float | None = None, suave: float = 0.25) -> np.ndarray:
    """Passa-faixa estático pela FFT (fase zero), com bordas em rampa de 'suave' oitavas."""
    if len(x) < 8:
        return x
    n = 1 << int(np.ceil(np.log2(len(x) + 1024)))
    X = np.fft.rfft(x, n)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    oit = np.log2(np.maximum(f, 1.0))
    if lo:
        g *= np.clip((oit - (np.log2(lo) - suave)) / suave, 0, 1)
    if hi:
        g *= np.clip(((np.log2(hi) + suave) - oit) / suave, 0, 1)
    return np.fft.irfft(X * g, n)[:len(x)]


def filtro_variavel(x: np.ndarray, lo_t, hi_t, janela: int = 1024) -> np.ndarray:
    """Passa-faixa que muda no tempo (STFT com máscara por quadro). lo_t e hi_t: funções de u em [0, 1]."""
    hop = janela // 4
    w = np.hanning(janela)
    pad = np.concatenate([np.zeros(janela), x, np.zeros(janela)])
    y = np.zeros_like(pad)
    norma = np.zeros_like(pad)
    f = np.fft.rfftfreq(janela, 1 / SR)
    oit = np.log2(np.maximum(f, 1.0))
    total = len(x)
    for i in range(0, len(pad) - janela, hop):
        u = np.clip((i - janela + janela / 2) / max(1, total), 0, 1)
        lo, hi = lo_t(u), hi_t(u)
        g = np.clip((oit - (np.log2(lo) - 0.35)) / 0.35, 0, 1) * np.clip(((np.log2(hi) + 0.35) - oit) / 0.35, 0, 1)
        q = np.fft.irfft(np.fft.rfft(pad[i:i + janela] * w) * g, janela)
        y[i:i + janela] += q * w
        norma[i:i + janela] += w * w
    y = y / np.maximum(norma, 1e-6)
    return y[janela:janela + total]


def env(dur: float, ataque: float, queda: float, curva: float = 1.0) -> np.ndarray:
    t = tempo(dur)
    a = np.clip(t / max(ataque, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - ataque, 0) / max(queda, 1e-4)) ** curva


def fade(x: np.ndarray, ini: float = 0.002, fim: float = 0.01) -> np.ndarray:
    x = x.copy()
    a, b = n_de(ini), n_de(fim)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def seno_glide(f0: float, f1: float, dur: float, curva: str = 'exp') -> np.ndarray:
    t = tempo(dur)
    u = t / dur
    f = f0 * (f1 / f0) ** u if curva == 'exp' else f0 + (f1 - f0) * u
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def serra(f: float, dur: float, harm: int = 24) -> np.ndarray:
    t = tempo(dur)
    x = np.zeros_like(t)
    for k in range(1, harm + 1):
        if f * k > SR / 2.2:
            break
        x += np.sin(2 * np.pi * f * k * t) / k
    return x * 0.6


class Mix:
    """Os barramentos: seco e envio para o reverb, em estéreo."""

    def __init__(self, dur: float):
        self.n = n_de(dur) + SR * 3
        self.seco = np.zeros((2, self.n))
        self.envio = np.zeros((2, self.n))
        self.grave = np.zeros((2, self.n))   # o que sofre sidechain do bombo
        self.dur = dur

    def por(self, x: np.ndarray, t: float, ganho: float = 1.0, pan: float = 0.0, rev: float = 0.0, bus: str = 'seco'):
        i = n_de(t)
        if i >= self.n or len(x) == 0:
            return
        if i < 0:
            x = x[-i:]
            i = 0
        x = x[:self.n - i]
        if x.ndim == 1:
            ang = (pan + 1) * np.pi / 4
            st = np.vstack([x * np.cos(ang), x * np.sin(ang)]) * ganho
        else:
            st = x[:, :] * ganho
        alvo = self.grave if bus == 'grave' else self.seco
        alvo[:, i:i + st.shape[1]] += st
        if rev:
            self.envio[:, i:i + st.shape[1]] += st * rev


def reverb_ir(rt: float = 1.6) -> np.ndarray:
    t = tempo(rt * 1.2)
    ir = np.vstack([ruido(rt * 1.2), ruido(rt * 1.2)]) * np.exp(-t * 6.9 / rt)
    ir = np.vstack([filtro(ir[0], 180, 7000), filtro(ir[1], 180, 7000)])
    ir[:, :n_de(0.012)] = 0
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def convolver(x: np.ndarray, ir: np.ndarray) -> np.ndarray:
    n = 1 << int(np.ceil(np.log2(x.shape[1] + ir.shape[1])))
    out = np.zeros_like(x)
    for c in range(2):
        out[c] = np.fft.irfft(np.fft.rfft(x[c], n) * np.fft.rfft(ir[c], n), n)[:x.shape[1]]
    return out


# ----------------------------------------------------------------------------------------------
# os instrumentos
# ----------------------------------------------------------------------------------------------
def bombo(forca: float = 1.0) -> np.ndarray:
    d = 0.5
    t = tempo(d)
    f = 52 + 130 * np.exp(-t / 0.035)
    corpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    clique = filtro(ruido(0.012), 1200, 7000) * np.exp(-tempo(0.012) / 0.004) * 0.9
    x = np.tanh(1.6 * corpo) * 0.9
    x[:len(clique)] += clique
    return fade(x * forca, 0.0005, 0.02)


def chimbal(aberto: bool = False) -> np.ndarray:
    d = 0.22 if aberto else 0.06
    x = filtro(ruido(d), 7000, 16000) * env(d, 0.001, 0.07 if aberto else 0.018)
    return fade(x * 0.5, 0.0005, 0.005)


def palma() -> np.ndarray:
    d = 0.35
    x = np.zeros(n_de(d))
    for k, atraso in enumerate([0.0, 0.011, 0.023]):
        r = filtro(ruido(0.3), 900, 5000) * env(0.3, 0.0008, 0.012 if k < 2 else 0.11)
        i = n_de(atraso)
        x[i:i + len(r)] += r[:len(x) - i]
    corpo = np.sin(2 * np.pi * 185 * tempo(d)) * np.exp(-tempo(d) / 0.05) * 0.4
    return fade((x * 0.55 + corpo) * 0.8, 0.0005, 0.02)


def pluck(nota: float, dur: float = 0.45, brilho: float = 1.0) -> np.ndarray:
    f = hz(nota)
    t = tempo(dur)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.22)
         + 0.5 * brilho * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.09)
         + 0.25 * brilho * np.sin(2 * np.pi * 3 * f * t + 0.3) * np.exp(-t / 0.05))
    return fade(x * 0.45, 0.002, 0.03)


def grave(nota: float, dur: float, escuro: bool = False) -> np.ndarray:
    f = hz(nota)
    x = serra(f, dur, 18) + serra(f * 1.006, dur, 18) * 0.7 + np.sin(2 * np.pi * f * tempo(dur)) * 0.4
    x = filtro(x, 60, 900 if not escuro else 600)
    return fade(np.tanh(x * 1.2) * env(dur, 0.006, dur * 0.9, 0.6) * 0.5, 0.003, 0.03)


def pad(notas: list[float], dur: float, brilho: float = 1800, ataque: float = 0.25) -> np.ndarray:
    x = np.zeros(n_de(dur))
    for k, nota in enumerate(notas):
        for det in (-0.07, 0.07):
            x += serra(hz(nota + det), dur, 18) * (0.5 if k else 0.7)
    x = filtro(x, 80, brilho)
    t = tempo(dur)
    e = np.clip(t / ataque, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    return x * e * 0.12


def sino(nota: float, dur: float = 1.8) -> np.ndarray:
    f = hz(nota)
    t = tempo(dur)
    x = np.zeros_like(t)
    for k, (m, a, q) in enumerate([(1.0, 1.0, 0.9), (2.0, 0.45, 0.6), (2.76, 0.35, 0.4), (4.07, 0.2, 0.25), (5.4, 0.1, 0.15)]):
        x += a * np.sin(2 * np.pi * f * m * t + k) * np.exp(-t / q)
    return fade(x * 0.32, 0.001, 0.05)


# ----------------------------------------------------------------------------------------------
# os efeitos (um por tipo de evento do roteiro)
# ----------------------------------------------------------------------------------------------
def fx_impacto(m: Mix, t: float, f: float):
    d = 1.4
    tt = tempo(d)
    fr = 50 + 90 * np.exp(-tt / 0.06)
    boom = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.32)
    corpo = filtro(ruido(d), 150, 2500) * np.exp(-tt / 0.08) * 0.9
    ar = filtro(ruido(d), 2500, 12000) * np.exp(-tt / 0.06) * 0.3
    x = np.tanh((boom * 1.4 + corpo + ar) * 1.2) * 0.85
    m.por(fade(x, 0.0005, 0.05), t, 0.9 * f, 0, rev=0.25)


def fx_baque(m: Mix, t: float, f: float):
    d = 0.4
    tt = tempo(d)
    fr = 60 + 90 * np.exp(-tt / 0.03)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / 0.13) + filtro(ruido(d), 200, 3000) * np.exp(-tt / 0.02) * 0.4
    m.por(fade(np.tanh(x * 1.3) * 0.7, 0.0005, 0.03), t, 0.85 * f, 0, rev=0.12)


def fx_tique(m: Mix, t: float, f: float, pan: float = 0.0):
    d = 0.06
    tt = tempo(d)
    fr = 1500 + RNG.random() * 1600
    x = np.sin(2 * np.pi * fr * tt) * np.exp(-tt / 0.012) * 0.5 + filtro(ruido(d), 2500, 9000) * np.exp(-tt / 0.003) * 0.6
    corpo = np.sin(2 * np.pi * (180 + RNG.random() * 60) * tt) * np.exp(-tt / 0.02) * 0.5
    m.por(fade(x + corpo, 0.0003, 0.005), t, 0.55 * f, pan, rev=0.08)


def fx_clique(m: Mix, t: float, f: float):
    d = 0.08
    tt = tempo(d)
    x = filtro(ruido(d), 1800, 8000) * np.exp(-tt / 0.004) * 0.8 + np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt / 0.01) * 0.35
    x += np.sin(2 * np.pi * 140 * tt) * np.exp(-tt / 0.025) * 0.6 * f
    m.por(fade(x, 0.0002, 0.01), t, 0.7 * f, 0.05, rev=0.06)


def fx_tecla(m: Mix, t: float, f: float, espaco: bool = False):
    d = 0.05
    tt = tempo(d)
    x = filtro(ruido(d), 1500 if not espaco else 600, 7000) * np.exp(-tt / (0.004 if not espaco else 0.007))
    x += np.sin(2 * np.pi * (2400 + RNG.random() * 900) * tt) * np.exp(-tt / 0.006) * 0.25
    m.por(fade(x, 0.0002, 0.005), t, (0.32 if not espaco else 0.25) * f, RNG.uniform(-0.25, 0.25), rev=0.03)


def fx_whoosh(m: Mix, t: float, f: float, dur: float, pan0: float = -0.6, pan1: float = 0.6):
    d = dur * 1.6
    x = ruido(d)
    u = tempo(d) / d
    x = filtro_variavel(x, lambda v: 300 + 1600 * np.sin(np.pi * min(v * 1.2, 1)) ** 2, lambda v: 1500 + 7000 * np.sin(np.pi * min(v * 1.2, 1)) ** 2)
    e = np.sin(np.pi * np.clip(u / 0.62, 0, 1)) ** 2 * np.where(u < 0.62, 1, np.exp(-(u - 0.62) / 0.1))
    x = x * e * 0.55
    ang = (pan0 + (pan1 - pan0) * u + 1) * np.pi / 4
    st = np.vstack([x * np.cos(ang), x * np.sin(ang)])
    m.por(st, t - dur * 0.38, f, rev=0.18)


def fx_aspira(m: Mix, t: float, f: float, dur: float):
    """Sucção: cresce até a marca seguinte (o impacto da pílula), com o filtro abrindo e o tom subindo."""
    d = dur + 0.08
    u = tempo(d) / d
    x = filtro_variavel(ruido(d), lambda v: 200 + 2500 * v ** 2, lambda v: 900 + 9000 * v ** 1.5)
    tom = seno_glide(110, 440, d) * 0.25 + seno_glide(165, 660, d) * 0.12
    e = (u ** 2.2) * np.where(u < 0.96, 1, np.clip((1 - u) / 0.04, 0, 1))
    m.por(fade((x * 0.6 + tom) * e, 0.01, 0.004), t, 0.75 * f, 0, rev=0.2)


def fx_riser(m: Mix, t_fim: float, f: float, dur: float):
    d = dur
    u = tempo(d) / d
    x = filtro_variavel(ruido(d), lambda v: 600 + 4000 * v ** 2, lambda v: 3000 + 10000 * v)
    tom = seno_glide(220, 880, d) * 0.3 * (1 + 0.5 * np.sin(2 * np.pi * (4 + 14 * u) * tempo(d)))
    e = u ** 2.4
    m.por(fade((x * 0.45 + tom * 0.6) * e, 0.01, 0.01), t_fim - d, 0.5 * f, 0, rev=0.3)


def fx_pop(m: Mix, t: float, f: float):
    for k, (atraso, nota) in enumerate([(0.0, 74), (0.022, 79), (0.041, 86)]):
        d = 0.2
        tt = tempo(d)
        x = seno_glide(hz(nota) * 0.5, hz(nota), 0.03)
        x = np.concatenate([x, np.sin(2 * np.pi * hz(nota) * tempo(d - 0.03) + np.arcsin(np.clip(x[-1], -1, 1)))])[:len(tt)]
        x = x * np.exp(-tt / 0.06)
        m.por(fade(x, 0.0005, 0.02), t + atraso, 0.4 * f, (k - 1) * 0.4, rev=0.25)
        if f < 0.6:
            break
    if f >= 0.8:
        fx_baque(m, t, 0.6 * f)


def fx_brilho(m: Mix, t: float, f: float):
    notas = [74, 77, 81, 84, 86, 89, 93]
    for k, n in enumerate(notas):
        m.por(pluck(n, 0.6, 0.6), t + k * 0.055, 0.22 * f * (1 - k * 0.06), -0.6 + k * 0.2, rev=0.5)


def fx_viagem(m: Mix, t: float, f: float, dur: float):
    x = seno_glide(520, 1250, dur) * np.sin(np.pi * np.clip(tempo(dur) / dur, 0, 1)) ** 1.5
    w = filtro(ruido(dur), 1500, 6000) * np.sin(np.pi * np.clip(tempo(dur) / dur, 0, 1)) ** 2 * 0.15
    u = tempo(dur) / dur
    ang = (-0.5 + u + 1) * np.pi / 4
    s = (x * 0.18 + w)
    m.por(np.vstack([s * np.cos(ang), s * np.sin(ang)]), t, f, rev=0.3)


def fx_carimbo(m: Mix, t: float, f: float):
    fx_baque(m, t, 1.0 * f)
    m.por(sino(84, 1.2), t + 0.01, 0.35 * f, 0.1, rev=0.35)
    m.por(filtro(ruido(0.12), 400, 3500) * env(0.12, 0.0005, 0.02), t, 0.6 * f, 0, rev=0.1)


def fx_contagem(m: Mix, ts: list[float], f: float, n: int):
    a, b = ts
    for k in range(n):
        tk = a + (b - a) * (k + 1) / n
        d = 0.05
        tt = tempo(d)
        x = np.sin(2 * np.pi * (1200 + k * 75) * tt) * np.exp(-tt / 0.012)
        m.por(fade(x, 0.0003, 0.005), tk, 0.18 * f, -0.4 + 0.8 * k / n, rev=0.12)


def fx_sino(m: Mix, t: float, f: float):
    m.por(sino(88, 2.2), t, 0.55 * f, 0.15, rev=0.5)
    m.por(sino(81, 2.0), t + 0.07, 0.3 * f, -0.15, rev=0.5)


def fx_onda(m: Mix, t: float, f: float, para: str, dur: float):
    d = dur + 0.4
    u = tempo(d) / d
    if para == 'escuro':
        x = filtro_variavel(ruido(d), lambda v: 300, lambda v: 9000 * (1 - v) ** 2 + 500)
        tom = seno_glide(880, 220, d)
    else:
        x = filtro_variavel(ruido(d), lambda v: 200 + 2000 * v, lambda v: 600 + 11000 * v ** 1.2)
        tom = seno_glide(220, 880, d)
    e = np.sin(np.pi * np.clip(u, 0, 1)) ** 1.3
    s = (x * 0.4 + tom * 0.12) * e
    ang = (np.linspace(-0.7, 0.7, len(s)) + 1) * np.pi / 4
    m.por(np.vstack([s * np.cos(ang), s * np.sin(ang)]), t, 0.8 * f, rev=0.45)


def fx_cascata(m: Mix, t: float, f: float, volta: float | None):
    """As nove cápsulas do centralizar: contração (140 ms), depois uma por vez, de 55 em 55 ms."""
    notas = [62, 65, 69, 72, 74, 77, 81, 84, 86]
    for k, n in enumerate(notas):
        m.por(pluck(n + 12, 0.5, 0.5), t + 0.14 + k * 0.055, 0.2 * f, -0.5 + k / 8, rev=0.45)
    if volta:
        for k, n in enumerate(reversed(notas)):
            m.por(pluck(n + 12, 0.4, 0.4), t + volta + k * 0.04, 0.12 * f, 0.5 - k / 8, rev=0.45)


def fx_acorde(m: Mix, t: float, f: float, dur: float):
    """O cartão final: Fmaj9, com o sino no topo e um grave que se apoia."""
    m.por(pad([41, 48, 57, 64, 67, 72], dur, 2600, 0.06), t, 1.5 * f, 0, rev=0.5)
    m.por(grave(41, min(dur, 3.0)), t, 0.7 * f, 0)
    m.por(sino(81, 3.0), t + 0.02, 0.28 * f, -0.2, rev=0.6)
    m.por(sino(76, 3.0), t + 0.1, 0.18 * f, 0.2, rev=0.6)


# ----------------------------------------------------------------------------------------------
# o leito musical
# ----------------------------------------------------------------------------------------------
ACORDES = [  # ré menor: Dm, Bb, F, C (raiz no grave e as notas do arpejo)
    (38, [62, 65, 69, 74]),
    (34, [58, 62, 65, 70]),
    (41, [60, 65, 69, 72]),
    (36, [60, 64, 67, 72]),
]


def leito(m: Mix, p: dict):
    mus = p['musica']
    beat = 60.0 / ROTEIRO['bpm']
    entra, para = mus['entra'], mus['para']
    escuro = mus.get('escuro') or []
    no_escuro = (lambda tt: len(escuro) == 2 and escuro[0] <= tt < escuro[1])
    kicks = []
    i = 0
    while True:
        tb = entra + i * beat
        if tb >= para - 1e-6:
            break
        compasso = int(i // 4)
        pos = i % 4
        raiz, arp = ACORDES[compasso % 4]
        esc = no_escuro(tb)
        intensidade = 0.75 if tb < 3.5 else 1.0
        m.por(bombo(1.0), tb, 0.78 * intensidade)
        kicks.append(tb)
        # grave em colcheias (raiz, oitava) com sidechain do bombo
        for k, desl in enumerate((0, beat / 2)):
            nota = raiz - (12 if esc else 0) + (12 if (k == 1 and not esc) else 0)
            m.por(grave(nota + 12, beat / 2 * 0.95, esc), tb + desl, 0.55, 0, bus='grave')
        if tb >= 3.5:
            m.por(chimbal(False), tb + beat / 2, 0.5, 0.3)
            if tb >= 7.0:
                m.por(chimbal(False), tb + beat / 4, 0.22, -0.3)
                m.por(chimbal(False), tb + 3 * beat / 4, 0.22, -0.3)
            if pos == 3:
                m.por(chimbal(True), tb + beat / 2, 0.28, 0.4, rev=0.1)
        if tb >= 7.0 and pos in (1, 3):
            m.por(palma(), tb, 0.55, 0.0, rev=0.25)
        # arpejo em semicolcheias (mais escuro e mais baixo no trecho escuro)
        if tb >= 3.5:
            for s in range(4):
                nota = arp[(pos * 4 + s) % 4] + (-12 if esc else 0) + (12 if s == 3 and not esc else 0)
                m.por(pluck(nota, 0.4, 0.5 if esc else 0.9), tb + s * beat / 4, 0.17 if not esc else 0.13, -0.6 + s * 0.4, rev=0.35)
        if esc and pos == 0:
            m.por(pad([raiz + 12, arp[0] - 12, arp[1] - 12, arp[2] - 12], beat * 4, 1100, 0.4), tb, 0.9, 0, rev=0.4, bus='grave')
        i += 1
    # sidechain: o grave e o pad abaixam a cada bombo
    g = np.ones(m.n)
    tt = np.arange(n_de(0.5)) / SR
    curva = 1 - 0.65 * np.exp(-tt / 0.11)
    for tb in kicks:
        a = n_de(tb)
        b = min(m.n, a + len(curva))
        g[a:b] = np.minimum(g[a:b], curva[:b - a])
    m.seco += m.grave * g
    m.envio += m.grave * g * 0.15


# ----------------------------------------------------------------------------------------------
# os eventos do roteiro
# ----------------------------------------------------------------------------------------------
def marca(p: dict, nome: str):
    return p['marcas'][nome]


def eventos(m: Mix, p: dict):
    for e in p['eventos']:
        som, forca = e['som'], e.get('forca', 1.0)
        if som == 'tecla':
            dig = p['digitacao']
            for k, ch in enumerate(ROTEIRO['conteudo']['pedido']):
                fx_tecla(m, dig['de'] + k * dig['passo'], forca, ch == ' ')
            continue
        ts = [e['t']] if 't' in e else marca(p, e['em'])
        ts = ts if isinstance(ts, list) else [ts]
        if som == 'contagem':
            fx_contagem(m, ts, forca, e.get('n', 14))
            continue
        if 'indices' in e:
            ts = [ts[i] for i in e['indices']]
        for k, t in enumerate(ts):
            t += e.get('mais', 0.0)
            if t < 0:
                continue
            if som == 'impacto':
                fx_impacto(m, t, forca)
            elif som == 'baque':
                fx_baque(m, t, forca)
            elif som == 'tique':
                fx_tique(m, t, forca, float(np.sin(k * 2.39996) * 0.7))
            elif som == 'aspira':
                fx_aspira(m, t, forca, e.get('dur', 0.4))
            elif som == 'whoosh':
                fx_whoosh(m, t, forca, e.get('dur', 0.3))
            elif som == 'riser':
                fx_riser(m, t, forca, e.get('dur', 0.8))
            elif som == 'pop':
                fx_pop(m, t, forca)
            elif som == 'brilho':
                fx_brilho(m, t, forca)
            elif som == 'clique':
                fx_clique(m, t, forca)
            elif som == 'viagem':
                fx_viagem(m, t, forca, e.get('dur', 0.6))
            elif som == 'carimbo':
                fx_carimbo(m, t, forca)
            elif som == 'sino':
                fx_sino(m, t, forca)
            elif som == 'onda':
                fx_onda(m, t, forca, e.get('para', 'escuro'), ROTEIRO['onda'])
            elif som == 'cascata':
                fx_cascata(m, t, forca, e.get('volta'))
            elif som == 'acorde':
                fx_acorde(m, t, forca, e.get('dur', 4.0))
            else:
                raise SystemExit(f'som desconhecido no roteiro: {som}')


# ----------------------------------------------------------------------------------------------
# mixagem e loudness
# ----------------------------------------------------------------------------------------------
def gravar_wav(caminho: pathlib.Path, x: np.ndarray):
    y = np.clip(x, -1, 1)
    pcm = (y.T * 32767).astype('<i2')
    with wave.open(str(caminho), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def loudnorm(entrada: pathlib.Path, saida: pathlib.Path, dur: float, alvo: float = -14.0, tp: float = -1.5):
    filtro1 = f'loudnorm=I={alvo}:TP={tp}:LRA=11:print_format=json'
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(entrada), '-af', filtro1, '-f', 'null', '-'], capture_output=True, text=True, check=True)
    txt = r.stderr
    med = json.loads(txt[txt.rindex('{'):txt.rindex('}') + 1])
    filtro2 = (f"loudnorm=I={alvo}:TP={tp}:LRA=11:measured_I={med['input_i']}:measured_TP={med['input_tp']}:"
               f"measured_LRA={med['input_lra']}:measured_thresh={med['input_thresh']}:offset={med['target_offset']}:linear=true:print_format=summary")
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(entrada), '-af', filtro2 + ',aresample=48000',
                    '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', '-t', f'{dur:.3f}', str(saida)], check=True)


def principal():
    ap = argparse.ArgumentParser()
    ap.add_argument('--peca', default='principal', choices=list(ROTEIRO['pecas']))
    ap.add_argument('--saida', type=pathlib.Path, required=True)
    a = ap.parse_args()
    p = ROTEIRO['pecas'][a.peca]
    dur = p['duracao']
    m = Mix(dur)
    leito(m, p)
    eventos(m, p)
    mix = m.seco + convolver(m.envio, reverb_ir()) * 0.5
    mix = np.vstack([filtro(mix[0], 40, None), filtro(mix[1], 40, None)])  # nada abaixo de ~40 Hz: o celular não toca e só gastaria margem
    mix = mix[:, :n_de(dur)]
    # fim limpo: os últimos 0,6 s descem, e o primeiro quadro não começa com estalo
    mix[:, -n_de(0.6):] *= np.linspace(1, 0, n_de(0.6)) ** 1.5
    mix[:, :n_de(0.003)] *= np.linspace(0, 1, n_de(0.003))
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.9
    mix = np.tanh(mix * 1.4) / np.tanh(1.4)       # saturação leve, que segura os picos
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.7
    a.saida.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        cru = pathlib.Path(tmp) / 'cru.wav'
        gravar_wav(cru, mix)
        loudnorm(cru, a.saida, dur)
    print(f'{a.saida} ({dur:.1f} s, -14 LUFS)')


if __name__ == '__main__':
    principal()
