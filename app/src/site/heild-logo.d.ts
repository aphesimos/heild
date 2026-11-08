import type { CSSProperties, Ref } from 'react'

/** O componente <heild-logo> do design system da Heild (src/site/heild-logo.js). */
export interface HeildLogoElement extends HTMLElement {
  play(nome?: string): Promise<HeildLogoElement>
  stop(): HeildLogoElement
  /**
   * Leva o I, de onde ele estiver desenhado agora, até a forma `nome` (sem nome, ou 'orb': volta à pílula).
   * Pode ser chamado a qualquer momento e em rajada: as cápsulas trocam de alvo por molas, sem corte.
   */
  morph(nome?: string | null): HeildLogoElement
  /** Atalho de morph para estados (hover, foco): ligado vai à forma; desligado volta à pílula só se `nome` for o alvo atual. */
  follow(nome: string, ligado: boolean): HeildLogoElement
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'heild-logo': { animation?: string; loop?: boolean | ''; label?: string; class?: string; className?: string; style?: CSSProperties; ref?: Ref<HeildLogoElement> }
    }
  }
}
