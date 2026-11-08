import { perfilDoCliente } from '@/dados/perfil-cliente'
import { useFluxos } from '@/ambiente/fluxos'
import { AbaCtx, CabecalhoAba } from '@/components/compostos/painel-aba'
import type { DefWidget, ItemGrade } from '@/components/widgets/tipos'
import { GradeWidgets } from '@/components/widgets/grade'
import { abasPainel } from '@/dados/painel'
import type { Cliente, Integrante, Tarefa } from '@/dados/tipos'
import { widgetsComuns } from './painel/comuns'
import { widgetsContabil } from './painel/contabil'
import { widgetsConsultoria } from './painel/consultoria'
import { widgetsDP } from './painel/dp'
import { widgetsFiscal } from './painel/fiscal'
import { widgetsGestao } from './painel/gestao'
import { widgetsNotas } from './painel/notas'
import { widgetsObrigacoes } from './painel/obrigacoes'
import { chavePadrao, padroes } from './painel/padroes'
import { widgetsSocietario } from './painel/societario'
import type { CtxAba, WidgetsAba } from './painel/tipos'

interface Props {
  abaId: string
  /** Cliente selecionado; ausente = carteira. */
  cliente?: Cliente
  clientesNaCarteira: number
  tarefas: Tarefa[]
  integrantes: Integrante[]
  onFalar?: (setor: Integrante['setor']) => void
}

/** Widgets próprios (bloco C) de cada aba. */
const porAba: Record<string, (ctx: CtxAba) => WidgetsAba> = {
  societario: widgetsSocietario,
  obrigacoes: widgetsObrigacoes,
  notas: widgetsNotas,
  fiscal: widgetsFiscal,
  dp: widgetsDP,
  contabil: widgetsContabil,
  consultoria: widgetsConsultoria,
  gestao: widgetsGestao,
}

/** Catálogo e arranjo padrão de uma aba (exportado para a story de todos os tamanhos). */
export function gradePainel(ctx: CtxAba): { catalogo: DefWidget[]; padrao: ItemGrade[] } {
  const { aba, cliente } = ctx
  const catalogo = [...widgetsComuns(ctx), ...(porAba[aba.id]?.(ctx).catalogo ?? [])]
  const padrao = padroes[chavePadrao(aba.id, !cliente, cliente?.regime === 'Simples Nacional')] ?? []
  return { catalogo, padrao }
}

/**
 * Aba interna do Painel, com a anatomia do subplano 03, seção 5: o cabeçalho
 * (A) fica fixo em cima; o resto vira widgets na grade personalizável, na
 * ordem da anatomia por padrão: B pendências · E ações · C blocos da aba ·
 * F tarefas · D documentos · G relatórios. Cada aba guarda o seu arranjo,
 * separado para cliente e carteira (os widgets mudam entre um e outro).
 */
export function PainelTela({ abaId, cliente, clientesNaCarteira, tarefas, integrantes, onFalar }: Props) {
  const fluxos = useFluxos()
  const aba = abasPainel.find((a) => a.id === abaId) ?? abasPainel[0]
  const integrante = integrantes.find((i) => i.setor === aba.setor && i.tipo !== 'criado_pelo_usuario')
  // O regime vem do cliente selecionado; o resto do perfil é de exemplo.
  // O perfil do cabeçalho vem do cliente selecionado (regime, UF, empregados, certificado...).
  const perfil = cliente ? perfilDoCliente(aba.perfil, cliente.id, cliente.regime) : aba.perfil

  const { catalogo, padrao } = gradePainel({ aba, cliente, clientesNaCarteira, tarefas, integrante })
  // Arranjo salvo por aba e variante (cliente, carteira, cliente do Simples na Fiscal).
  const chave = `painel-${chavePadrao(aba.id, !cliente, cliente?.regime === 'Simples Nacional')}`

  return (
    <div className="area-rolagem h-full overflow-y-auto px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        {/* A */}
        <CabecalhoAba
          titulo={aba.rotulo}
          cliente={cliente ? `${cliente.codigo} - ${cliente.nome} · ${cliente.regime}` : undefined}
          perfil={perfil}
          vigencia={aba.vigencia}
          faixa={aba.faixa}
          integrante={integrante}
          statusIntegrante={
            integrante && (integrante.estado === 'trabalhando' || integrante.pendentes > 0) ? (integrante.resumo ?? aba.statusIntegrante) : cliente ? aba.statusIntegrante : `Na carteira: ${aba.statusIntegrante.toLowerCase()}`
          }
          onFalar={() => onFalar?.(aba.setor)}
          onFicha={cliente ? () => fluxos.fichaCliente(cliente.id) : undefined}
        />
        <AbaCtx.Provider value={{ cliente: cliente?.nome, setor: aba.setor }}>
          <GradeWidgets key={chave} chave={chave} catalogo={catalogo} padrao={padrao} />
        </AbaCtx.Provider>
      </div>
    </div>
  )
}
