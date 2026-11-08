import { fichas } from '@/ambiente/clientes'
import { arvoreModelo, conectoresArmazenamento } from './configuracoes'
import * as exemplo from './exemplo'
import { contratos } from './financeiro'
import { abasPainel, dpDe, fiscalDe } from './painel'

/**
 * Índice de documentos do escritório (Fundações 4.11 e 7): cada arquivo tem um
 * lugar só na árvore (7.2) e é esse arquivo que abre de qualquer menção no
 * sistema (cartão do Time, aba do Painel, anexo do CRM, app do cliente).
 * A visibilidade ao cliente vem da pasta (7.8), da árvore-modelo do Armazenamento.
 */

export type TipoDocumento = 'guia' | 'holerite' | 'folha' | 'balancete' | 'contrato' | 'procuracao' | 'certidao' | 'cadastro' | 'extrato' | 'recibo' | 'xml' | 'nfse' | 'relatorio' | 'intimacao' | 'parecer' | 'outro'
export type OrigemDocumento = 'gerado_plataforma' | 'upload_equipe' | 'upload_cliente_app' | 'conversa' | 'captura_governo' | 'nuvem_escritorio' | 'core'

export interface Entrega {
  quem: string
  acao: 'enviado' | 'visto' | 'baixado' | 'confirmado'
  quando: string
}

export interface Documento {
  id: string
  nome: string
  /** Sem cliente: documento do escritório (_escritorio). */
  clienteId?: string
  /** Caminho a partir da pasta do cliente (ou de _escritorio). */
  pasta: string[]
  tipo: TipoDocumento
  competencia?: string
  origem: OrigemDocumento
  /** Conector onde os bytes estão (Configurações › Armazenamento). */
  conector: string
  tamanho: string
  quando: string
  por: string
  versao: number
  hash: string
  /** Conteúdo resumido para a pré-visualização. */
  dados?: Record<string, string>
  entregas?: Entrega[]
  /** Visibilidade forçada no arquivo (7.8); sem isso, vale a da pasta. */
  forcarVisivel?: boolean
}

export const rotuloOrigem: Record<OrigemDocumento, string> = {
  gerado_plataforma: 'gerado pela plataforma',
  upload_equipe: 'enviado pela equipe',
  upload_cliente_app: 'enviado pelo cliente no app',
  conversa: 'anexo de conversa',
  captura_governo: 'capturado do governo',
  nuvem_escritorio: 'posto direto na nuvem',
  core: 'sistema contábil',
}

export const rotuloTipoDoc: Record<TipoDocumento, string> = {
  guia: 'guia',
  holerite: 'holerites',
  folha: 'folha',
  balancete: 'demonstração contábil',
  contrato: 'contrato',
  procuracao: 'procuração',
  certidao: 'certidão',
  cadastro: 'cadastro',
  extrato: 'extrato',
  recibo: 'recibo',
  xml: 'XML',
  nfse: 'NFS-e',
  relatorio: 'relatório',
  intimacao: 'intimação',
  parecer: 'parecer',
  outro: 'documento',
}

/* ---------- Árvore (7.2 e a árvore-modelo do Armazenamento) ---------- */

export const P = {
  contratoSocial: ['permanentes', 'contrato social e alterações'],
  procuracoes: ['permanentes', 'procurações e certidões'],
  interno: (comp = '2026-10') => ['2026', comp, 'trabalho interno'],
  fiscal: ['Entregáveis', 'Fiscal (guias, recibos)'],
  folha: ['Entregáveis', 'Folha (holerites, guias)'],
  contabil: ['Entregáveis', 'Contábil (balancete, DRE)'],
  bpo: ['Entregáveis', 'BPO financeiro (relatórios, comprovantes)'],
}

/** Nome da pasta do cliente na raiz: "CNPJ - Nome" (7.2). */
export const pastaDoCliente = (clienteId?: string) => {
  const c = exemplo.clientes.find((x) => x.id === clienteId)
  return c ? `${c.documento} - ${c.nome}` : '_escritorio'
}

/** Visível ao cliente pela pasta (marcas da árvore-modelo), salvo forçado no arquivo. */
export function visivelAoCliente(d: Documento) {
  if (d.forcarVisivel !== undefined) return d.forcarVisivel
  if (!d.clienteId) return false
  const visiveis = arvoreModelo.filter((p) => p.visivel).map((p) => p.caminho)
  return d.pasta.some((p) => visiveis.includes(p))
}

/** Tipo pelo nome do arquivo (para menções que chegam só com o nome). */
export function tipoPeloNome(nome: string): TipoDocumento {
  const n = nome.toLowerCase()
  if (/nfs-?e/.test(n)) return 'nfse'
  if (/\b(das|darf|fgts|pis|cofins|iss|inss|icms|gps|dae)\b/.test(n)) return 'guia'
  if (/holerite/.test(n)) return 'holerite'
  if (/folha|ponto|admiss|experiência|rescis/.test(n)) return 'folha'
  if (/balancete|dre|balanço|sped|ecd/.test(n)) return 'balancete'
  if (/contrato/.test(n)) return 'contrato'
  if (/procura/.test(n)) return 'procuracao'
  if (/certid|cnd|crf|cndt/.test(n)) return 'certidao'
  if (/cartão cnpj|cadastro/.test(n)) return 'cadastro'
  if (/extrato/.test(n)) return 'extrato'
  if (/recibo/.test(n)) return 'recibo'
  if (/xml|lote/.test(n)) return 'xml'
  if (/intima/.test(n)) return 'intimacao'
  if (/parecer/.test(n)) return 'parecer'
  if (/relat/.test(n)) return 'relatorio'
  return 'outro'
}

/** Pasta pelo tipo (o "Para onde vai cada tipo" do Armazenamento). */
export function pastaPeloTipo(tipo: TipoDocumento, competencia = '2026-10'): string[] {
  switch (tipo) {
    case 'guia':
      return P.fiscal
    case 'holerite':
    case 'folha':
      return P.folha
    case 'balancete':
      return P.contabil
    case 'contrato':
      return P.contratoSocial
    case 'procuracao':
    case 'certidao':
    case 'cadastro':
      return P.procuracoes
    default:
      return P.interno(competencia)
  }
}

/** Chave para achar um documento pelo nome em qualquer grafia ("DAS 10/2026" = "das-10-2026.pdf"). */
export const chaveNome = (nome: string) =>
  nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\.(pdf|xml|zip|xlsx?|docx?|png|jpe?g|ofx)$/, '')
    .replace(/[^a-z0-9]+/g, '')

const hashDe = (s: string) => {
  let h = 2166136261
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return (h >>> 0).toString(16).padStart(8, '0') + 'c3e1'
}
const kb = (n: number) => (n > 1024 ? `${(n / 1024).toFixed(1).replace('.', ',')} MB` : `${n} KB`)

/* ---------- Documentos que já existem nas outras telas ---------- */

function base(): Documento[] {
  const l: Documento[] = []
  // Um documento existe uma vez só: o mesmo nome (em qualquer grafia) no mesmo cliente é o mesmo arquivo.
  const add = (d: Omit<Documento, 'id' | 'hash' | 'versao' | 'conector'> & Partial<Pick<Documento, 'versao' | 'conector'>>) => {
    if (l.some((x) => x.clienteId === d.clienteId && chaveNome(x.nome) === chaveNome(d.nome))) return
    l.push({ versao: 1, conector: 'a1', ...d, id: `doc${l.length + 1}`, hash: hashDe(`${d.clienteId}/${d.pasta.join('/')}/${d.nome}`) })
  }

  for (const c of exemplo.clientes) {
    const contato = fichas[c.id]?.contatos[0]?.nome ?? 'cliente'
    const pf = c.regime === 'Pessoa física'
    // BPO (10): relatório do mês em Entregáveis; a empresa só de BPO não tem os documentos da contabilidade.
    if (c.servicos?.includes('bpo'))
      add({ clienteId: c.id, nome: 'Relatório financeiro 10-2026.pdf', pasta: P.bpo, tipo: 'relatorio', competencia: '10/2026', origem: 'gerado_plataforma', tamanho: kb(320), quando: '05/11/2026', por: 'BPO (integrante)' })
    if (c.servicos && !c.servicos.includes('contabil')) {
      add({ clienteId: c.id, nome: 'Contrato de BPO financeiro.pdf', pasta: ['permanentes'], tipo: 'contrato', origem: 'nuvem_escritorio', tamanho: kb(410), quando: '01/09/2026', por: 'Marina Teixeira', dados: { partes: contato } })
      continue
    }
    if (!pf) {
      add({ clienteId: c.id, nome: 'Contrato social consolidado.pdf', pasta: P.contratoSocial, tipo: 'contrato', origem: 'nuvem_escritorio', tamanho: kb(840), quando: '12/03/2025', por: 'Bruno Costa', dados: { partes: contato } })
      add({ clienteId: c.id, nome: 'Cartão CNPJ.pdf', pasta: P.procuracoes, tipo: 'cadastro', origem: 'captura_governo', tamanho: kb(96), quando: '03/11/2026', por: 'Societário (integrante)' })
    }
    add({ clienteId: c.id, nome: 'Procuração e-CAC.pdf', pasta: P.procuracoes, tipo: 'procuracao', origem: 'captura_governo', tamanho: kb(120), quando: '15/01/2026', por: 'Societário (integrante)' })

    // Guias da central de guias (as mesmas do Painel Fiscal e do app).
    for (const g of fiscalDe(c.id).guias.filter((x) => x.valor !== '—')) {
      const comp = g.competencia.split('/').reverse().join('-')
      add({
        clienteId: c.id,
        nome: `${g.tributo} ${g.competencia.replace('/', '-')}.pdf`,
        pasta: g.enviada ? P.fiscal : P.interno(comp),
        tipo: 'guia',
        competencia: g.competencia,
        origem: 'gerado_plataforma',
        tamanho: kb(88),
        quando: g.enviada ? `0${3 + (l.length % 5)}/11/2026` : 'em preparo',
        por: 'Fiscal (integrante)',
        dados: { tributo: g.tributo, competencia: g.competencia, valor: g.valor, vencimento: g.vencimento },
        entregas: g.enviada ? [{ quem: contato, acao: g.lida ? 'visto' : 'enviado', quando: g.lida ? '04/11 09:12' : '03/11 08:00' }, ...(g.paga ? [{ quem: contato, acao: 'confirmado' as const, quando: '19/10 16:40' }] : [])] : [],
      })
    }

    // Folha (mesmo quadro do Painel DP).
    const q = dpDe(c.id).quadro.ativos
    if (q > 0) {
      add({
        clienteId: c.id,
        nome: 'Holerites 10-2026.pdf',
        pasta: P.folha,
        tipo: 'holerite',
        competencia: '10/2026',
        origem: 'gerado_plataforma',
        tamanho: kb(60 * q),
        quando: '05/11/2026',
        por: 'DP (integrante)',
        dados: { empregados: String(q) },
        entregas: [{ quem: contato, acao: 'baixado', quando: '05/11 18:22' }],
      })
      add({
        clienteId: c.id,
        nome: 'Folha analítica 10-2026.pdf',
        pasta: P.folha,
        tipo: 'folha',
        competencia: '10/2026',
        origem: 'gerado_plataforma',
        tamanho: kb(40 * q),
        quando: '05/11/2026',
        por: 'DP (integrante)',
        dados: { empregados: String(q) },
      })
    }

    // Contábil.
    if (!pf) {
      add({ clienteId: c.id, nome: 'Balancete 09-2026.pdf', pasta: P.contabil, tipo: 'balancete', competencia: '09/2026', origem: 'core', tamanho: kb(210), quando: '20/10/2026', por: 'João Pereira' })
      add({ clienteId: c.id, nome: 'Extrato bancário 10-2026.pdf', pasta: P.interno(), tipo: 'extrato', competencia: '10/2026', origem: 'upload_cliente_app', tamanho: kb(180), quando: '02/11/2026', por: `${contato} (cliente)` })
    }
  }

  // Documentos das abas do Painel da Metalúrgica, cada um na pasta real da árvore.
  for (const aba of abasPainel) {
    for (const d of aba.documentos) {
      const tipo = tipoPeloNome(d.nome)
      const comp = d.competencia.includes('/') ? d.competencia.split('/').reverse().join('-') : '2026-10'
      add({
        clienteId: 'c1',
        nome: `${d.nome}.pdf`,
        pasta: d.visivelNoApp && tipo === 'outro' ? P.fiscal : pastaPeloTipo(tipo, comp),
        tipo,
        competencia: d.competencia,
        origem: d.origem === 'app' ? 'upload_cliente_app' : d.origem === 'captura' ? 'captura_governo' : d.origem === 'nuvem' ? 'nuvem_escritorio' : d.origem === 'integrante' ? 'gerado_plataforma' : 'conversa',
        tamanho: kb(150),
        quando: '06/11/2026',
        por: d.enviadoPor,
        forcarVisivel: d.visivelNoApp,
      })
    }
  }

  // Anexos que já estão nas conversas do CRM.
  add({
    clienteId: 'c1',
    nome: 'PIS-COFINS-10-2026.pdf',
    pasta: P.fiscal,
    tipo: 'guia',
    competencia: '10/2026',
    origem: 'gerado_plataforma',
    tamanho: kb(86),
    quando: '06/11/2026',
    por: 'Fiscal (integrante)',
    dados: { tributo: 'PIS/COFINS', competencia: '10/2026', valor: 'R$ 3.412,80', vencimento: '25/11' },
  })
  add({ clienteId: 'c3', nome: 'ponto-outubro.pdf', pasta: P.interno(), tipo: 'folha', competencia: '10/2026', origem: 'conversa', tamanho: kb(230), quando: '06/11/2026', por: 'Ana Prates (cliente)' })
  add({ clienteId: 'c5', nome: 'intimacao-sefaz-0912.pdf', pasta: P.interno('2026-11'), tipo: 'intimacao', competencia: '11/2026', origem: 'conversa', tamanho: kb(310), quando: '05/11/2026', por: 'Paula Reis (cliente)' })

  // Drive antigo (somente leitura), espelhado na mesma árvore.
  add({ clienteId: 'c1', nome: 'Balanço 2024.pdf', pasta: ['2024', 'Balanço'], tipo: 'balancete', competencia: '2024', origem: 'nuvem_escritorio', conector: 'a2', tamanho: kb(1900), quando: '28/03/2025', por: 'Drive antigo' })
  add({
    clienteId: 'c2',
    nome: 'Alvará de funcionamento 2023.pdf',
    pasta: ['permanentes', 'procurações e certidões'],
    tipo: 'certidao',
    origem: 'nuvem_escritorio',
    conector: 'a2',
    tamanho: kb(140),
    quando: '10/02/2023',
    por: 'Drive antigo',
  })

  // Do escritório.
  for (const ct of contratos) {
    add({
      nome: `Contrato de honorários - ${ct.cliente}.pdf`,
      pasta: ['2026', 'contratos de honorários'],
      tipo: 'contrato',
      origem: 'gerado_plataforma',
      tamanho: kb(160),
      quando: `v${ct.versao} · ${ct.vigenteDesde}`,
      por: 'Fernanda Lima',
      dados: { partes: ct.cliente },
    })
  }
  add({ nome: 'NFS-e de honorários 10-2026 (lote).zip', pasta: ['2026', 'NFS-e emitidas'], tipo: 'nfse', competencia: '10/2026', origem: 'gerado_plataforma', tamanho: kb(2300), quando: '01/10/2026', por: 'Financeiro (integrante)' })
  return l
}

let cache: Documento[] | null = null
export const documentosBase = () => (cache ??= base())

export const conectorDe = (id: string) => conectoresArmazenamento.find((c) => c.id === id)
