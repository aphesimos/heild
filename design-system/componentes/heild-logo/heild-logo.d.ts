/** Formas em que o I da logo se transforma. `cycle` passa por todas, em ordem. */
export type HeildAnimation = 'none' | 'centralizar' | 'orb' | 'contabil' | 'juridico' | 'bpo' | 'ia' | 'atendimento' | 'cycle'

/** O elemento <heild-logo>. */
export interface HeildLogoElement extends HTMLElement {
  animation: HeildAnimation
  /** Toca uma forma uma vez. Resolve quando o I volta ao repouso. */
  play(nome?: Exclude<HeildAnimation, 'none'>): Promise<HeildLogoElement>
  /** Para e volta ao repouso. */
  stop(): HeildLogoElement
  /**
   * Leva o I até a forma `nome` partindo do que está desenhado agora (no meio de outra
   * transição, na volta, em repouso). Sem nome, com nome desconhecido ou com 'orb', volta à
   * pílula. Feito para hover, foco e troca de forma: chamadas seguidas nunca cortam.
   */
  morph(nome?: string | null): HeildLogoElement
  /** Atalho de morph para estados (hover, foco): ligado vai à forma; desligado volta à pílula só se `nome` for o alvo atual. */
  follow(nome: string, ligado: boolean): HeildLogoElement
}

export interface HeildLogoProps {
  /** Forma do I. Padrão: 'none' (estático). */
  animation?: HeildAnimation
  /** Repete com 1,3 s de repouso entre as vezes. Sem ele, toca uma vez ao aparecer. */
  loop?: boolean
  /** Nome lido por leitores de tela. Padrão: 'Heild'. */
  label?: string
  className?: string
  /** Defina ao menos `width`; a altura acompanha (1259 × 387). */
  style?: Record<string, string | number>
}

/** O wordmark HEILD com o I animado, para React (window.Heild.HeildLogo). Renderiza <heild-logo>. */
export declare function HeildLogo(props: HeildLogoProps): unknown

declare global {
  interface HTMLElementTagNameMap {
    'heild-logo': HeildLogoElement
  }
}
