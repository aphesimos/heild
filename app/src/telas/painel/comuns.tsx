import { ClipboardTextIcon, FileTextIcon, ListChecksIcon, LightningIcon, ChartBarIcon } from '@phosphor-icons/react'
import { BlocoTarefas } from '@/components/compostos/bloco-tarefas'
import { fichas } from '@/ambiente/clientes'
import { AcoesAba, DocumentosAba, PendenciasAba, RelatoriosAba } from '@/components/compostos/painel-aba'
import type { DocumentoAba, PendenciaSetor } from '@/dados/painel'
import type { Tarefa } from '@/dados/tipos'
import type { SetorIntegrante } from '@/theme/tipos'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import type { CtxAba } from './tipos'

/**
 * Widgets que toda aba tem (03, seção 5): B pendências, E ações,
 * F tarefas deste setor, D documentos, G relatórios.
 */
/** Pendências do cliente: a ficha detalhada da Metalúrgica; dos outros, as tarefas paradas esperando o cliente. */
function pendenciasDe(aba: CtxAba['aba'], cliente: CtxAba['cliente'], tarefas: Tarefa[]): PendenciaSetor[] {
  if (!cliente) return []
  if (cliente.id === 'c1') return aba.pendencias
  return tarefas
    .filter((t) => t.cliente === cliente.nome && t.setor === aba.setor && t.status === 'aguardando_cliente')
    .map((t) => ({ id: t.id, item: t.titulo, desde: t.diasAguardando ? `há ${t.diasAguardando} ${t.diasAguardando === 1 ? 'dia' : 'dias'}` : 'hoje', cobrancas: 1 }))
}

const docsPorSetor: Partial<Record<SetorIntegrante, [string, string, string][]>> = {
  fiscal: [
    ['Notas de saída 10/2026', 'notas', 'Fiscal/Saídas'],
    ['DAS 09/2026 (pago)', 'guia', 'Entregáveis/Fiscal'],
  ],
  notas: [['XML de entrada 10/2026', 'xml', 'Notas/Entradas']],
  dp: [
    ['Folha 10/2026', 'folha', 'Entregáveis/Folha'],
    ['Holerites 10/2026', 'holerite', 'Entregáveis/Folha'],
  ],
  contabil: [
    ['Extrato bancário 10/2026', 'extrato', 'Contábil/Extratos'],
    ['Balancete 09/2026', 'balancete', 'Entregáveis/Contábil'],
  ],
  societario: [
    ['Contrato social consolidado', 'contrato social', 'Societário/Atos'],
    ['Cartão CNPJ', 'cadastro', 'Societário/Cadastro'],
  ],
  consultor: [['Parecer de planejamento 2027', 'parecer', 'Consultoria']],
}

/** Documentos do cliente: os da ficha da Metalúrgica; dos outros, os da pasta do setor (com o contato que mandou). */
function documentosDe(aba: CtxAba['aba'], cliente: CtxAba['cliente']): DocumentoAba[] {
  if (!cliente) return []
  if (cliente.id === 'c1') return aba.documentos
  const contato = fichas[cliente.id]?.contatos[0]?.nome ?? 'cliente'
  return (docsPorSetor[aba.setor] ?? []).map(([nome, tipo, pasta], i) => ({
    id: `${cliente.id}-${aba.id}-${i}`,
    nome,
    tipo,
    competencia: nome.match(/\d{2}\/\d{4}/)?.[0] ?? '2026',
    origem: i === 0 ? 'app' : 'integrante',
    enviadoPor: i === 0 ? `${contato} (cliente)` : `${aba.rotulo} (integrante)`,
    hash: `${cliente.codigo}${i}a7f`,
    visivelNoApp: true,
    pasta,
  }))
}

export function widgetsComuns({ aba, cliente, clientesNaCarteira, tarefas, integrante }: CtxAba): DefWidget[] {
  const pendencias = pendenciasDe(aba, cliente, tarefas)
  const documentos = documentosDe(aba, cliente)
  const doSetor = tarefas.filter((t) => t.setor === aba.setor && (!cliente || aba.id === 'gestao' || t.cliente === cliente.nome))
  const cartoes = integrante?.pendentes ?? 0
  return [
    {
      id: 'pendencias',
      titulo: 'Pendências do setor',
      descricao: 'Do cliente e de terceiros, com cobrar e marcar recebida',
      icone: ClipboardTextIcon,
      tamanhos: ['M', 'G'],
      conteudo: (t) => <PendenciasAba compacto={t === 'M'} itens={pendencias} />,
    },
    {
      id: 'acoes',
      titulo: 'Ações',
      descricao: 'O que dá para fazer nesta aba, com o nível no rótulo',
      icone: LightningIcon,
      tamanhos: ['G'],
      acao:
        cartoes > 0 ? (
          <Badge variant="destaque">
            {cartoes} {cartoes === 1 ? 'cartão' : 'cartões'}
          </Badge>
        ) : undefined,
      conteudo: () => <AcoesAba itens={aba.acoes} carteira={cliente ? undefined : clientesNaCarteira} />,
    },
    {
      id: 'tarefas',
      titulo: `Tarefas · ${cliente?.nome ?? 'Carteira'}`,
      descricao: 'Tarefas deste setor, com filtro por responsável e status',
      icone: ListChecksIcon,
      tamanhos: ['G', 'XL'],
      conteudo: () => <BlocoTarefas semCasca setor={aba.rotulo} setorId={aba.setor} cliente={cliente?.nome} tarefas={doSetor} />,
    },
    {
      id: 'documentos',
      titulo: 'Documentos da aba',
      descricao: 'Com origem, pasta e se aparece no app do cliente',
      icone: FileTextIcon,
      tamanhos: ['M', 'G', 'XL'],
      conteudo: (t) => <DocumentosAba compacto={t !== 'XL'} limite={t === 'M' ? (documentos.length > 2 ? 1 : 2) : undefined} itens={documentos} />,
    },
    {
      id: 'relatorios',
      titulo: 'Relatórios',
      descricao: 'Gerar, exportar em CSV ou PDF, agendar',
      icone: ChartBarIcon,
      tamanhos: ['M', 'G'],
      conteudo: (t) => <RelatoriosAba compacto={t === 'M'} itens={aba.relatorios} />,
    },
  ]
}
