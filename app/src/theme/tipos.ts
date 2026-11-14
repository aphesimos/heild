/**
 * Tipos do tema de marca branca (subplano 01, seção 10).
 *
 * `TokensTema` repete os campos de `tema.tokens` das Fundações. Os componentes
 * nunca leem estes valores direto: o ThemeProvider os converte em variáveis CSS
 * e o Tailwind expõe as variáveis como classes (bg-primary, text-foreground...).
 */
export interface TokensTema {
  primaria: string
  fundo: string
  texto: string
  destaque: string
  erro: string
  sucesso: string
  fonte_titulo: string
  fonte_texto: string
  /** Raio base, em qualquer unidade CSS ("12px", "0.75rem"). */
  raio_borda: string
  /**
   * Opcionais, fora da lista mínima das Fundações. Sem eles, o provider deriva
   * cada um misturando `fundo` e `texto`. As camadas, de baixo para cima:
   * fundo (página) → rebaixada (trilhos, busca, coluna) → superfície (painéis)
   * → elevada (cartões, campo do chat, aba ativa).
   */
  /** Cor de estado para atenção (falta, urgente, perto do limite). Separada do destaque da marca. */
  atencao?: string
  /** Painéis grandes: área do chat, widgets, blocos. */
  superficie?: string
  /** Cartões, campo do chat, aba ativa, menus. */
  elevada?: string
  /** Trilho das abas, busca, coluna de integrantes, bolha do usuário: início e fim do degradê. */
  rebaixada?: string
  rebaixada_fim?: string
  borda?: string
  texto_suave?: string
  texto_sobre_primaria?: string
  /** Fim do degradê vertical do fundo (o Figma vai de branco a #d9d2cc). */
  fundo_fim?: string
  /** Barra lateral dos módulos: início e fim do degradê. */
  lateral?: string
  lateral_fim?: string
}

/** Setores com integrante padrão (subplano 02, seção 3.2) mais Consultor e Geral. */
export type SetorIntegrante =
  | 'geral'
  | 'societario'
  | 'fiscal'
  | 'notas'
  | 'dp'
  | 'contabil'
  | 'consultor'
  | 'financeiro_escritorio'
  | 'gestao_atendimento'
  /** Pacote BPO Financeiro (subplano 10, 2.6): o setor do escritório; não tem integrante próprio. */
  | 'bpo_financeiro'
  /** Integrantes do BPO, um por função (decisão do usuário, 8/11/2026): o setor é bpo_financeiro. */
  | 'bpo_pagar'
  | 'bpo_receber'
  | 'bpo_conciliacao'
  | 'bpo_gerencial'

/** Avatar do integrante: no lab, as cores do orb. Em produção vira `avatar_ref`. */
export interface AvatarIntegrante {
  cor: string
  cor_olhos?: string
  /** Cores no modo escuro, quando as do claro somem no fundo. */
  cor_escuro?: string
  cor_olhos_escuro?: string
}

export interface IntegrantePadraoTema {
  nome: string
  avatar: AvatarIntegrante
}

export interface Tema {
  id: string
  nome_produto: string
  /** Sigla curta usada quando não há logotipo carregado. */
  sigla: string
  /** Logotipo (a marca curta), usado com a barra lateral fechada e onde cabe pouco. */
  logotipo_ref?: string
  /** Logo completa do escritório, com a barra aberta, no login e no app. Sem ela, logotipo (ou sigla) e nome. */
  logo_completa_ref?: string
  /** Versões para o modo escuro (a logo em negativo), quando a do claro some no fundo escuro. */
  logotipo_ref_escuro?: string
  logo_completa_ref_escuro?: string
  /** A marca da própria Heild: wordmark animado (HE fechado, HEILD aberto). Marca branca não usa. */
  marca?: 'heild'
  tokens: TokensTema
  modo_escuro?: Partial<TokensTema>
  integrantes_padrao: Partial<Record<SetorIntegrante, IntegrantePadraoTema>>
}

export type ModoCor = 'claro' | 'escuro'
