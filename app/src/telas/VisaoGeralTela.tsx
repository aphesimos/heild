import { CalendarBlankIcon, ChartBarIcon, ClockCounterClockwiseIcon, GaugeIcon, PaperPlaneTiltIcon, SparkleIcon, UsersThreeIcon, WarningIcon, type Icon } from '@phosphor-icons/react'
import { AvisoCompacto } from '@/components/compostos/aviso-compacto'
import { CalendarioSemana, ConteudoIndicador, LinhaDoTempo, LinkWidget, Medidor, PendenciasClientes } from '@/components/compostos/widgets'
import { Orb, GrupoOrbs } from '@/components/ui/orb'
import { GradeWidgets } from '@/components/widgets/grade'
import type { DefWidget, ItemGrade } from '@/components/widgets/tipos'
import { cabe } from '@/components/widgets/widget'
import type { Aviso, EventoLinhaDoTempo, Indicador, Integrante, ItemAgenda, Pendencia } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { rotuloDoEstado } from '@/lib/integrante'

export interface DadosVisaoGeral {
  indicadores: Indicador[]
  progressoMes: { entregues: number; total: number }
  avisos: Aviso[]
  dias: { dia: number; rotulo: string }[]
  agenda: ItemAgenda[]
  hoje?: number
  pendencias: Pendencia[]
  linhaDoTempo: EventoLinhaDoTempo[]
  integrantes?: Integrante[]
}

const iconeIndicador: Record<string, Icon> = { i1: WarningIcon, i2: CalendarBlankIcon, i3: ChartBarIcon, i4: PaperPlaneTiltIcon }

/** Arranjo padrão (Colaborador/Gestor, 03 4.2): indicadores, calendário e avisos em cima. */
const padrao: ItemGrade[] = [
  { id: 'i1', tamanho: 'P' },
  { id: 'i2', tamanho: 'P' },
  { id: 'i3', tamanho: 'P' },
  { id: 'i4', tamanho: 'P' },
  { id: 'medidor', tamanho: 'M' },
  { id: 'calendario', tamanho: 'XL' },
  { id: 'avisos', tamanho: 'G' },
  { id: 'pendencias', tamanho: 'G' },
  { id: 'linha', tamanho: 'G' },
  { id: 'time', tamanho: 'G' },
]

/** Catálogo da Visão geral (exportado para a story de todos os tamanhos). */
export function catalogoVisaoGeral(dados: DadosVisaoGeral, contexto: string, onAbrirIntegrante?: (s: Aviso['setor']) => void): DefWidget[] {
  return [
    ...dados.indicadores.map<DefWidget>((i) => ({
      id: i.id,
      titulo: i.rotulo,
      descricao: `Indicador: ${i.rotulo.toLowerCase()}`,
      icone: iconeIndicador[i.id] ?? ChartBarIcon,
      tamanhos: ['P', 'M'],
      conteudo: () => <ConteudoIndicador indicador={i} />,
    })),
    {
      id: 'medidor',
      titulo: 'Obrigações do mês',
      descricao: 'Entregues contra o total do mês, em barra',
      icone: GaugeIcon,
      tamanhos: ['M', 'L'],
      conteudo: () => (
        <div className="flex h-full flex-col justify-end">
          <Medidor rotulo="Entregues" valor={dados.progressoMes.entregues} total={dados.progressoMes.total} />
        </div>
      ),
    },
    {
      id: 'calendario',
      titulo: 'Calendário da semana',
      descricao: 'Tarefas e obrigações da semana, com o setor de cada uma',
      icone: CalendarBlankIcon,
      tamanhos: ['G', 'XL'],
      acao: <LinkWidget destino={{ modulo: 'painel', aba: 'obrigacoes' }}>Abrir</LinkWidget>,
      conteudo: (t) =>
        cabe(t, { colunas: 4 }) ? (
          <CalendarioSemana dias={dados.dias} itens={dados.agenda} hoje={dados.hoje} />
        ) : (
          <CalendarioSemana dias={dados.dias.filter((d) => d.dia === dados.hoje || d.dia === (dados.hoje ?? 0) + 1)} itens={dados.agenda} hoje={dados.hoje} colunas={2} />
        ),
    },
    {
      id: 'avisos',
      titulo: 'Avisos do time',
      descricao: 'O que os integrantes fizeram e o que pede sua decisão',
      icone: SparkleIcon,
      tamanhos: ['G', 'XL'],
      conteudo: (t) => (
        <GrupoOrbs divergente={dados.avisos.some((a) => a.decisao)}>
          {cabe(t, { colunas: 4 }) ? (
            <div className="grid grid-cols-2 gap-2">
              {dados.avisos.map((a) => (
                <AvisoCompacto key={a.id} aviso={a} className="bg-raised" onAbrir={() => onAbrirIntegrante?.(a.setor)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dados.avisos.map((a) => (
                <AvisoCompacto key={a.id} aviso={a} className="bg-raised" onAbrir={() => onAbrirIntegrante?.(a.setor)} />
              ))}
            </div>
          )}
        </GrupoOrbs>
      ),
    },
    {
      id: 'pendencias',
      titulo: 'Pendências por cliente',
      descricao: 'O que os clientes devem, há quantos dias, com cobrar',
      icone: PaperPlaneTiltIcon,
      tamanhos: ['G', 'XL'],
      acao: <LinkWidget destino={{ modulo: 'painel', aba: 'contabil' }}>Ver todas</LinkWidget>,
      conteudo: () => <PendenciasClientes itens={dados.pendencias} />,
    },
    {
      id: 'linha',
      titulo: `Linha do tempo · ${contexto}`,
      descricao: 'Últimos eventos do cliente selecionado',
      icone: ClockCounterClockwiseIcon,
      tamanhos: ['G'],
      conteudo: () => <LinhaDoTempo itens={dados.linhaDoTempo} />,
    },
    {
      id: 'time',
      titulo: 'Time agora',
      descricao: 'Estado de cada integrante e o que está fazendo',
      icone: UsersThreeIcon,
      tamanhos: ['M', 'G'],
      conteudo: (t) => <TimeAgora integrantes={dados.integrantes ?? []} compacto={!cabe(t, { linhas: 2 })} onAbrir={onAbrirIntegrante} />,
    },
  ]
}

/**
 * Visão geral: a Home do subplano 03, seção 4, numa grade de widgets
 * personalizável (ordem, tamanho, quais aparecem; 03 4.3).
 */
export function VisaoGeralTela({ dados, contexto, onAbrirIntegrante }: { dados: DadosVisaoGeral; contexto: string; onAbrirIntegrante?: (s: Aviso['setor']) => void }) {
  const catalogo = catalogoVisaoGeral(dados, contexto, onAbrirIntegrante)
  return (
    <div className="area-rolagem h-full overflow-y-auto px-3 pb-8 sm:px-5">
      <GradeWidgets
        chave="visao-geral"
        catalogo={catalogo}
        padrao={padrao}
        className="mx-auto max-w-6xl pt-1 ultra:max-w-[1600px]"
        titulo={
          <div>
            <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Hoje</h1>
            <p className="text-muted-foreground text-sm">{contexto} · quarta, 18 de novembro</p>
          </div>
        }
      />
    </div>
  )
}

/** Widget "Time agora": orbs com estado (todos animam se algum diverge do padrão); compacto mostra só os orbs. */
function TimeAgora({ integrantes, compacto, onAbrir }: { integrantes: Integrante[]; compacto: boolean; onAbrir?: (s: Integrante['setor']) => void }) {
  const aparencia = useAparencia()
  const divergente = integrantes.some((i) => i.estado !== 'disponivel')
  if (compacto)
    return (
      <GrupoOrbs divergente={divergente}>
        <div className="flex h-full items-center gap-2 overflow-x-auto px-2">
          {integrantes.map((i) => {
            const t = aparencia(i)
            return (
              <button key={i.id} type="button" onClick={() => onAbrir?.(i.setor)} aria-label={`${t.nome} · ${rotuloDoEstado[i.estado]}`} className="shrink-0 cursor-pointer">
                <Orb cor={t.cor} corOlhos={t.corOlhos} estado={i.estado} tamanho={40} cutucavel={false} extras={false} />
              </button>
            )
          })}
        </div>
      </GrupoOrbs>
    )
  return (
    <GrupoOrbs divergente={divergente}>
      <ul className="flex flex-col py-2">
        {integrantes.map((i) => {
          const t = aparencia(i)
          return (
            <li key={i.id}>
              <button type="button" onClick={() => onAbrir?.(i.setor)} className="hover:bg-raised flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] px-1.5 py-0.5 text-left">
                <Orb cor={t.cor} corOlhos={t.corOlhos} estado={i.estado} tamanho={28} cutucavel={false} extras={false} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{t.nome}</span>
                  <span className="text-muted-foreground block truncate text-xs">{i.resumo ?? rotuloDoEstado[i.estado]}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </GrupoOrbs>
  )
}
