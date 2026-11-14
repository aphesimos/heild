import type { Tema } from '../tipos'
import logoCompleta from '@/assets/marcas/condesp/logo-completa.png'
import logoCompletaBranca from '@/assets/marcas/condesp/logo-completa-branca.png'
import logotipo from '@/assets/marcas/condesp/logotipo.png'
import logotipoBranco from '@/assets/marcas/condesp/logotipo-branco.png'

/**
 * Condesp Contabilidade: marca real de um escritório parceiro, usada com a
 * permissão dele, só no wireframe (não entra no site nem no GitHub Pages).
 * Origem de cada cor, fonte e logo, decisões e contrastes: ../TEMAS-ESCRITORIOS.md.
 *
 * Cores da marca (condespcontabilidade.com.br):
 * - azul-marinho #00304f: o "CONDESP" da logo (no CSS do site, #0a314f);
 * - azul #0090ff: botão primário do site (.btn-primary) e brilho do degradê da logo;
 * - azul #1073bf: .btn-info do site;
 * - laranja #ff6c00: botão secundário do site (no "contabilidade consultiva" da logo, #ff6a13);
 * - dourado #f6c519: a esfera da logo.
 */

/**
 * Neutros no matiz do azul-marinho da logo (OKLCH h 244), com as mesmas
 * luminosidades em todos os passos e croma baixo (0,016 até o 650; 0,03 do 700
 * em diante, para o escuro puxar para o marinho). Gerados em scripts, não
 * escolhidos a olho; as camadas dos dois modos saem só daqui.
 */
export const nevoaCondesp = {
  50: '#f8fcff',
  100: '#f0f7fc',
  150: '#e9f0f6',
  200: '#e0e8ef',
  300: '#ccd6df',
  400: '#afb9c1',
  500: '#8d979f',
  600: '#717a82',
  650: '#5f676f',
  700: '#475765',
  800: '#293945',
  850: '#1e2d39',
  900: '#15232f',
  925: '#0d1b26',
  950: '#06131e',
} as const

const n = nevoaCondesp

/**
 * | camada        | claro          | escuro         |
 * | fundo         | 50 → 200       | 900 → 950      |
 * | barra lateral | 100 → 300      | 850 → 925      |
 * | rebaixada     | 150 → 200      | 925 → 950      |
 * | superfície    | 100            | 850            |
 * | elevada       | branco         | 800            |
 * | borda         | 300            | 800            |
 * | texto suave   | 700            | 400            |
 * | texto         | 900            | 100            |
 * | primária      | #00304f        | #0090ff        |
 */
export const temaCondesp: Tema = {
  id: 'condesp',
  nome_produto: 'Condesp',
  sigla: 'C',
  logotipo_ref: logotipo,
  logotipo_ref_escuro: logotipoBranco,
  logo_completa_ref: logoCompleta,
  logo_completa_ref_escuro: logoCompletaBranca,
  tokens: {
    primaria: '#00304f',
    fundo: n[50],
    texto: n[900],
    // #1073bf do site, escurecido no mesmo matiz até 4,5:1 em todas as camadas.
    destaque: '#0867ad',
    // Laranja da marca (#ff6c00) escurecido no mesmo matiz: texto legível sobre o claro.
    atencao: '#ab4703',
    erro: '#ba3222',
    sucesso: '#077450',
    fonte_titulo: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    fonte_texto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
    // Site com botões de 3 px e caixas de 10 px; a logo é toda curva. 8 px fica entre os dois.
    raio_borda: '0.5rem',
    superficie: n[100],
    elevada: '#ffffff',
    rebaixada: n[150],
    rebaixada_fim: n[200],
    borda: n[300],
    texto_suave: n[700],
    fundo_fim: n[200],
    lateral: n[100],
    lateral_fim: n[300],
  },
  modo_escuro: {
    // O azul do botão do site, exato; sobre ele, texto escuro (o branco daria 3,3:1).
    primaria: '#0090ff',
    texto_sobre_primaria: n[950],
    fundo: n[900],
    texto: n[100],
    destaque: '#89c0fe',
    atencao: '#ffa67d',
    erro: '#ffa494',
    sucesso: '#67d0a1',
    superficie: n[850],
    elevada: n[800],
    rebaixada: n[925],
    rebaixada_fim: n[950],
    borda: n[800],
    texto_suave: n[400],
    fundo_fim: n[950],
    lateral: n[850],
    lateral_fim: n[925],
  },
  // Paleta padrão dos integrantes, com os setores que brigavam com a marca puxados para ela.
  integrantes_padrao: {
    geral: { nome: 'Assistente', avatar: { cor: n[900] } },
    fiscal: { nome: 'Fiscal', avatar: { cor: '#ff6c00' } },
    dp: { nome: 'DP', avatar: { cor: '#0090ff' } },
    contabil: { nome: 'Contábil', avatar: { cor: '#2fae8f' } },
    consultor: { nome: 'Consultor', avatar: { cor: '#00304f', cor_olhos: '#ffffff', cor_escuro: '#9ccaf5', cor_olhos_escuro: '#00304f' } },
    societario: { nome: 'Societário', avatar: { cor: '#e86a8a' } },
    notas: { nome: 'Notas', avatar: { cor: '#f6c519' } },
    gestao_atendimento: { nome: 'Atendimento', avatar: { cor: '#8b7cf6' } },
    financeiro_escritorio: { nome: 'Financeiro', avatar: { cor: '#9bc53d' } },
    bpo_financeiro: { nome: 'BPO', avatar: { cor: '#f08a5d' } },
    bpo_pagar: { nome: 'Contas a Pagar', avatar: { cor: '#f08a5d' } },
    bpo_receber: { nome: 'Contas a Receber', avatar: { cor: '#4cb782' } },
    bpo_conciliacao: { nome: 'Conciliação', avatar: { cor: '#5b8def' } },
    bpo_gerencial: { nome: 'Gerencial', avatar: { cor: '#c46fd6' } },
  },
}
