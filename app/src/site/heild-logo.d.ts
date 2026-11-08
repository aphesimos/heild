import type { CSSProperties, Ref } from 'react'

/**
 * Formas do I (window.Heild.animations). Todas só com cápsulas e círculos de 96, dentro da altura das letras:
 * centralizar (grade 3x3), contabil (barras), juridico (=), bpo (check), ia (asterisco), atendimento (3 pontos),
 * orb (esfera), financeiro ($), tempo (ampulheta), arquivos (pasta), conversa (balão de fala),
 * celular (aparelho), painel (grade bento), lupa (lente com cabo), equipe (três pessoas).
 */
export type HeildLogoAnimation =
  | 'centralizar' | 'contabil' | 'juridico' | 'bpo' | 'ia' | 'atendimento' | 'orb'
  | 'financeiro' | 'tempo' | 'arquivos' | 'conversa' | 'celular' | 'painel' | 'lupa' | 'equipe'

/** Uma forma conhecida, ou qualquer string (nome desconhecido é ignorado por play e volta à pílula no morph). */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NomeForma = HeildLogoAnimation | (string & {})

/** O componente <heild-logo> do design system da Heild (src/site/heild-logo.js). */
export interface HeildLogoElement extends HTMLElement {
  /** Toca a forma uma vez (ou 'cycle', ou a do atributo `animation`); resolve quando o I volta ao repouso. */
  play(nome?: NomeForma | 'cycle'): Promise<HeildLogoElement>
  stop(): HeildLogoElement
  /**
   * Leva o I, de onde ele estiver desenhado agora, até a forma `nome` (sem nome, ou 'orb': volta à pílula).
   * Pode ser chamado a qualquer momento e em rajada: as cápsulas trocam de alvo por molas, sem corte.
   */
  morph(nome?: NomeForma | null): HeildLogoElement
  /** Atalho de morph para estados (hover, foco): ligado vai à forma; desligado volta à pílula só se `nome` for o alvo atual. */
  follow(nome: NomeForma, ligado: boolean): HeildLogoElement
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'heild-logo': { animation?: NomeForma | 'cycle' | 'none'; loop?: boolean | ''; label?: string; class?: string; className?: string; style?: CSSProperties; ref?: Ref<HeildLogoElement> }
    }
  }
}
