import type { Tema } from '../tipos'
import logoCompleta from '@/assets/marcas/requinte/logo-completa.svg'
import logoCompletaBranca from '@/assets/marcas/requinte/logo-completa-branca.svg'
import logotipo from '@/assets/marcas/requinte/logotipo.svg'
import logotipoBranco from '@/assets/marcas/requinte/logotipo-branco.svg'

/**
 * Requinte Contábil: marca real de um escritório parceiro, usada com a
 * permissão dele, só no wireframe (não entra no site nem no GitHub Pages).
 * Origem de cada cor, fonte e logo, decisões e contrastes: ../TEMAS-ESCRITORIOS.md.
 *
 * Cores das cores globais do Elementor do site (requintecontabil.com.br, post-6.css):
 * - azul #1e99d6: botões, ícones, bordas no hover (na logo SVG, #0098d6);
 * - cinza-azulado #394e57: títulos e texto corrido;
 * - azul-aço #3e7996, azul-claro #57c1eb, laranja #d6841f e #df9d36,
 *   verde #349321, vermelho #ad1e05, cinza #f4f4f4 (fundo das seções).
 */

/**
 * Neutros no matiz do cinza-azulado do texto do site (OKLCH h 226), com as
 * mesmas luminosidades da escala da Condesp e croma mais baixo nos claros (o
 * site usa fundos quase cinza, #f4f4f4). O 700 é exatamente o #394e57 do site.
 */
export const ardosiaRequinte = {
  50: '#f8fcfe',
  100: '#f2f7f9',
  150: '#ebf0f2',
  200: '#e2e8eb',
  300: '#cfd6d9',
  400: '#b2b9bc',
  500: '#909699',
  600: '#747a7d',
  650: '#61676a',
  700: '#394e57',
  800: '#2c393f',
  850: '#212e33',
  900: '#172429',
  925: '#0f1b21',
  950: '#081318',
} as const

const a = ardosiaRequinte

/**
 * | camada        | claro          | escuro         |
 * | fundo         | 50 → 200       | 900 → 950      |
 * | barra lateral | 100 → 300      | 850 → 925      |
 * | rebaixada     | 150 → 200      | 925 → 950      |
 * | superfície    | 100            | 850            |
 * | elevada       | branco         | 800            |
 * | borda         | 300            | 800            |
 * | texto suave   | 700 (#394e57)  | 400            |
 * | texto         | 900            | 100            |
 * | primária      | #0a74a4        | #1e99d6        |
 */
export const temaRequinte: Tema = {
  id: 'requinte',
  nome_produto: 'Requinte',
  sigla: 'R',
  logotipo_ref: logotipo,
  logotipo_ref_escuro: logotipoBranco,
  logo_completa_ref: logoCompleta,
  logo_completa_ref_escuro: logoCompletaBranca,
  tokens: {
    // O azul do site (#1e99d6) escurecido no mesmo matiz: com texto branco, 5,2:1 (o original dá 3,2:1).
    primaria: '#0a74a4',
    fundo: a[50],
    texto: a[900],
    // Azul-aço do site (#3e7996), um pouco mais escuro para passar em todas as camadas.
    destaque: '#326d8a',
    // Laranja do site (#d6841f) escurecido no mesmo matiz.
    atencao: '#935706',
    // Vermelho do site, exato.
    erro: '#ad1e05',
    // Verde do site (#349321) escurecido no mesmo matiz.
    sucesso: '#1f7608',
    fonte_titulo: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    fonte_texto: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    // Site: botões de 16 px, ícones de 18 px, cartões de 20 px.
    raio_borda: '1rem',
    superficie: a[100],
    elevada: '#ffffff',
    rebaixada: a[150],
    rebaixada_fim: a[200],
    borda: a[300],
    texto_suave: a[700],
    fundo_fim: a[200],
    lateral: a[100],
    lateral_fim: a[300],
  },
  modo_escuro: {
    // O azul do site, exato; sobre ele, texto escuro (o branco daria 3,2:1).
    primaria: '#1e99d6',
    texto_sobre_primaria: a[950],
    fundo: a[900],
    texto: a[100],
    destaque: '#60c9f3',
    atencao: '#f0ad49',
    erro: '#fea392',
    sucesso: '#74d264',
    superficie: a[850],
    elevada: a[800],
    rebaixada: a[925],
    rebaixada_fim: a[950],
    borda: a[800],
    texto_suave: a[400],
    fundo_fim: a[950],
    lateral: a[850],
    lateral_fim: a[925],
  },
  // Paleta padrão dos integrantes, com os setores que brigavam com a marca puxados para as cores do site.
  integrantes_padrao: {
    geral: { nome: 'Assistente', avatar: { cor: a[900] } },
    fiscal: { nome: 'Fiscal', avatar: { cor: '#df9d36' } },
    dp: { nome: 'DP', avatar: { cor: '#1e99d6' } },
    contabil: { nome: 'Contábil', avatar: { cor: '#4fc9a8' } },
    consultor: { nome: 'Consultor', avatar: { cor: '#394e57', cor_olhos: '#ffffff', cor_escuro: '#9eaaaf', cor_olhos_escuro: '#172429' } },
    societario: { nome: 'Societário', avatar: { cor: '#e86a8a' } },
    notas: { nome: 'Notas', avatar: { cor: '#f2d04b' } },
    gestao_atendimento: { nome: 'Atendimento', avatar: { cor: '#8b7cf6' } },
    financeiro_escritorio: { nome: 'Financeiro', avatar: { cor: '#9bc53d' } },
    bpo_financeiro: { nome: 'BPO', avatar: { cor: '#f08a5d' } },
    bpo_pagar: { nome: 'Contas a Pagar', avatar: { cor: '#f08a5d' } },
    bpo_receber: { nome: 'Contas a Receber', avatar: { cor: '#4cb782' } },
    bpo_conciliacao: { nome: 'Conciliação', avatar: { cor: '#7c8cf8' } },
    bpo_gerencial: { nome: 'Gerencial', avatar: { cor: '#c46fd6' } },
  },
}
