import type { Tema } from './tipos'

/**
 * Temas de exemplo para o laboratório. Os escritórios são fictícios.
 * O "tema de fábrica" é o ponto de partida neutro (subplano 01, seção 10);
 * os outros dois existem para provar que trocar o tema troca a cara do sistema
 * inteiro sem tocar nos componentes.
 */

const integrantesBase: Tema['integrantes_padrao'] = {
  // Cor ignorada: o orb do Geral é sempre o contraste do tema (ThemeProvider).
  geral: { nome: 'Geral', avatar: { cor: '#f1efe9' } },
  fiscal: { nome: 'Fiscal', avatar: { cor: '#f7a335' } },
  dp: { nome: 'DP', avatar: { cor: '#3d86f7' } },
  contabil: { nome: 'Contábil', avatar: { cor: '#4fc9a8' } },
  consultor: { nome: 'Consultor', avatar: { cor: '#6e5cf2' } },
  societario: { nome: 'Societário', avatar: { cor: '#e86a8a' } },
  notas: { nome: 'Notas', avatar: { cor: '#f2d04b' } },
  gestao_atendimento: { nome: 'Atendimento', avatar: { cor: '#5bc0eb' } },
  financeiro_escritorio: { nome: 'Financeiro', avatar: { cor: '#9bc53d' } },
  bpo_financeiro: { nome: 'BPO', avatar: { cor: '#f08a5d' } },
  bpo_pagar: { nome: 'Contas a Pagar', avatar: { cor: '#f08a5d' } },
  bpo_receber: { nome: 'Contas a Receber', avatar: { cor: '#4cb782' } },
  bpo_conciliacao: { nome: 'Conciliação', avatar: { cor: '#7c8cf8' } },
  bpo_gerencial: { nome: 'Gerencial', avatar: { cor: '#c46fd6' } },
}

/**
 * Fontes do Figma: PP Neue Montreal nos títulos e a versão Text (desenhada para
 * tamanhos pequenos) no texto corrido. Arquivos em src/assets/fontes.
 */
const neueTitulo = "'PP Neue Montreal', ui-sans-serif, system-ui, sans-serif"
const neueTexto = "'PP Neue Montreal Text', 'PP Neue Montreal', ui-sans-serif, system-ui, sans-serif"

/**
 * Escala de areia do tema de fábrica: um matiz só (OKLCH h 63), do quase branco
 * ao quase preto. Passa exatamente pelas duas cores do Figma: 300 = #d9d2cc
 * (fim do fundo) e 650 = #696665 (texto suave). Todas as cores neutras dos
 * dois modos saem daqui; nenhuma é escolhida solta.
 */
export const areia = {
  50: '#fefbf9',
  100: '#faf6f3',
  150: '#f4efeb',
  200: '#ede7e1',
  300: '#d9d2cc',
  400: '#bdb6b0',
  500: '#9a948f',
  600: '#7e7975',
  650: '#696663',
  700: '#585552',
  800: '#3a3735',
  850: '#2e2b28',
  900: '#24211f',
  925: '#1b1917',
  950: '#13110f',
} as const

/**
 * Tema de fábrica: o visual do Figma do usuário, padronizado na escala de areia.
 *
 * | camada       | claro          | escuro         |
 * | fundo        | 50 → 300       | 900 → 950      |
 * | barra lateral| 150 → 400      | 850 → 925      |
 * | rebaixada    | 200 → 300      | 925 → 950      |
 * | superfície   | 100            | 850            |
 * | elevada      | 50             | 800            |
 * | borda        | 300            | 800            |
 * | texto suave  | 650            | 400            |
 * | texto        | 850            | 100            |
 * | primária     | 900            | 100            |
 */
export const temaFabrica: Tema = {
  id: 'fabrica',
  nome_produto: 'Heild',
  sigla: 'HE',
  marca: 'heild',
  tokens: {
    primaria: areia[900],
    fundo: areia[50],
    texto: areia[850],
    destaque: '#4f5bf5',
    erro: '#c8402f',
    sucesso: '#2f9e72',
    fonte_titulo: neueTitulo,
    fonte_texto: neueTexto,
    raio_borda: '1.0625rem',
    superficie: areia[100],
    elevada: areia[50],
    rebaixada: areia[200],
    rebaixada_fim: areia[300],
    borda: areia[300],
    texto_suave: areia[650],
    fundo_fim: areia[300],
    lateral: areia[150],
    lateral_fim: areia[400],
  },
  modo_escuro: {
    primaria: areia[100],
    fundo: areia[900],
    texto: areia[100],
    superficie: areia[850],
    elevada: areia[800],
    rebaixada: areia[925],
    rebaixada_fim: areia[950],
    borda: areia[800],
    texto_suave: areia[400],
    fundo_fim: areia[950],
    lateral: areia[850],
    lateral_fim: areia[925],
  },
  integrantes_padrao: {
    ...integrantesBase,
    // O avatar do Assistente vem do tema (texto e fundo); aqui só o nome.
    geral: { nome: 'Assistente', avatar: { cor: areia[850] } },
  },
}

export const temaContabilidadeHorizonte: Tema = {
  id: 'horizonte',
  nome_produto: 'Horizonte Contábil',
  sigla: 'H',
  tokens: {
    primaria: '#1f4fd8',
    fundo: '#f7f8fb',
    texto: '#111827',
    destaque: '#f97316',
    erro: '#dc2626',
    sucesso: '#059669',
    fonte_titulo: 'Georgia, ui-serif, serif',
    fonte_texto: 'ui-sans-serif, system-ui, sans-serif',
    raio_borda: '1rem',
    superficie: '#ffffff',
  },
  modo_escuro: {
    primaria: '#6d8dff',
    fundo: '#0b1020',
    texto: '#e5e7eb',
    superficie: '#121a30',
  },
  integrantes_padrao: {
    ...integrantesBase,
    fiscal: { nome: 'Fiscal', avatar: { cor: '#ff9f43' } },
    consultor: { nome: 'Consultor', avatar: { cor: '#1f4fd8', cor_olhos: '#ffffff' } },
  },
}

export const temaVerdeCampo: Tema = {
  id: 'verde-campo',
  nome_produto: 'Verde Campo Assessoria',
  sigla: 'VC',
  tokens: {
    primaria: '#166534',
    fundo: '#fbfaf6',
    texto: '#1c1917',
    destaque: '#ca8a04',
    erro: '#b91c1c',
    sucesso: '#15803d',
    fonte_titulo: 'ui-rounded, ui-sans-serif, system-ui, sans-serif',
    fonte_texto: 'ui-sans-serif, system-ui, sans-serif',
    raio_borda: '0.375rem',
  },
  modo_escuro: {
    primaria: '#4ade80',
    fundo: '#0c120e',
    texto: '#ecfdf5',
    superficie: '#141d17',
  },
  integrantes_padrao: {
    ...integrantesBase,
    dp: { nome: 'Pessoal', avatar: { cor: '#22c55e' } },
  },
}

export const temas = [temaFabrica, temaContabilidadeHorizonte, temaVerdeCampo]
