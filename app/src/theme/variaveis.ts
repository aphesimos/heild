import type { ModoCor, Tema, TokensTema } from './tipos'

/**
 * Converte o tema do escritório em variáveis CSS. Esta é a única ponte entre
 * dados de marca e estilo: os componentes só conhecem as variáveis.
 *
 * Nomes seguem a convenção do shadcn/ui (--primary, --background...), para que
 * componentes novos adicionados pelo CLI do shadcn funcionem sem adaptação.
 */
export function tokensDoModo(tema: Tema, modo: ModoCor): TokensTema {
  if (modo === 'escuro') {
    const escuro = tema.modo_escuro ?? {}
    // No escuro, superfície/borda/texto suave derivam de novo, a menos que venham explícitos.
    const base = {
      ...tema.tokens,
      superficie: undefined,
      borda: undefined,
      texto_suave: undefined,
      texto_sobre_primaria: undefined,
      fundo_fim: undefined,
      lateral: undefined,
      lateral_fim: undefined,
      atencao: undefined,
      elevada: undefined,
      rebaixada: undefined,
      rebaixada_fim: undefined,
    }
    return { ...base, ...escuro }
  }
  return tema.tokens
}

const mix = (a: string, b: string, pctA: number) => `color-mix(in oklab, ${a} ${pctA}%, ${b})`

/** Escolhe texto claro ou escuro sobre uma cor hexadecimal (contraste WCAG simplificado). */
export function textoSobre(cor: string): string {
  const hex = cor.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff'
  const canal = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const lum = 0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4)
  return lum > 0.45 ? '#0b0b0f' : '#ffffff'
}

export function variaveisCss(tema: Tema, modo: ModoCor): Record<string, string> {
  const t = tokensDoModo(tema, modo)
  const escuro = modo === 'escuro'
  const superficie = t.superficie ?? mix(t.fundo, t.texto, escuro ? 94 : 97)
  const elevada = t.elevada ?? (escuro ? mix(t.fundo, t.texto, 89) : t.fundo)
  const rebaixada = t.rebaixada ?? mix(t.fundo, t.texto, escuro ? 97 : 90)
  const rebaixadaFim = t.rebaixada_fim ?? mix(t.fundo, t.texto, escuro ? 99 : 85)
  const borda = t.borda ?? mix(t.fundo, t.texto, modo === 'escuro' ? 82 : 88)
  const textoSuave = t.texto_suave ?? mix(t.texto, t.fundo, 60)
  const fundoFim = t.fundo_fim ?? mix(t.fundo, t.texto, modo === 'escuro' ? 92 : 90)
  const lateral = t.lateral ?? mix(t.fundo, t.texto, modo === 'escuro' ? 92 : 93)
  const lateralFim = t.lateral_fim ?? mix(t.fundo, t.texto, modo === 'escuro' ? 86 : 80)

  return {
    '--background': t.fundo,
    '--foreground': t.texto,
    '--surface': superficie,
    '--raised': elevada,
    '--sunken': rebaixada,
    '--sunken-end': rebaixadaFim,
    '--card': elevada,
    '--card-foreground': t.texto,
    '--popover': elevada,
    '--popover-foreground': t.texto,
    '--primary': t.primaria,
    '--primary-foreground': t.texto_sobre_primaria ?? textoSobre(t.primaria),
    '--secondary': rebaixada,
    '--secondary-foreground': t.texto,
    '--muted': rebaixada,
    '--muted-foreground': textoSuave,
    '--accent': rebaixada,
    '--accent-foreground': t.texto,
    '--warning': t.atencao ?? (escuro ? '#e2a845' : '#b7791f'),
    '--highlight': t.destaque,
    '--highlight-foreground': textoSobre(t.destaque),
    '--destructive': t.erro,
    '--destructive-foreground': textoSobre(t.erro),
    '--success': t.sucesso,
    '--success-foreground': textoSobre(t.sucesso),
    '--border': borda,
    '--input': borda,
    '--ring': mix(t.primaria, t.fundo, 60),
    '--background-end': fundoFim,
    '--sidebar': lateral,
    '--sidebar-end': lateralFim,
    // Tinta das sombras: o texto do tema no claro (sombra areia), preto no escuro.
    '--shadow-ink': escuro ? '#000000' : t.texto,
    // Tinta do contorno de 1px: no escuro, preto sobre fundo escuro some; o contorno passa a ser claro.
    '--contorno-ink': escuro ? '#ffffff' : t.texto,
    '--radius': t.raio_borda,
    '--font-heading': t.fonte_titulo,
    '--font-body': t.fonte_texto,
  }
}
