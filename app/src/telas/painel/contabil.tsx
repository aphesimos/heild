import { BotaoAba } from '@/components/compostos/painel-aba'
import { ArrowsLeftRightIcon, ChatCircleDotsIcon, CheckIcon, FlagCheckeredIcon, PencilSimpleLineIcon, TrayArrowDownIcon, WarningIcon, TagIcon } from '@phosphor-icons/react'
import { Confianca, Selo } from '@/components/compostos/painel-aba'
import { Badge } from '@/components/ui/badge'
import type { DefWidget, TamanhoWidget } from '@/components/widgets/tipos'
import { contabilDe } from '@/dados/painel'

// Dados da aba do cliente aberto; a função da aba troca antes de os widgets renderizarem.
let d = contabilDe()
import { cn } from '@/lib/utils'
import { Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

const ordemEtapas = ['Coleta', 'Extratos', 'Classificação', 'Conciliação', 'Envio ao core']

/**
 * Contábil (03, 6.6): fechar a competência. Com cliente: etapas do fechamento,
 * o que deve chegar, classificação com confiança, conciliação. Em carteira:
 * clientes por etapa e analista (CTB-026).
 */
export function widgetsContabil({ cliente }: CtxAba): WidgetsAba {
  d = contabilDe(cliente?.id)
  if (!cliente) return { catalogo: [carteira] }
  return {
    catalogo: [fechamento, deveChegar, classificacao, conciliacao],
  }
}

const fechamento: DefWidget = {
  id: 'fechamento',
  titulo: `Fechamento · ${d.competencia}`,
  atividades: 'CTB-017, 024 a 027',
  descricao: 'As cinco etapas do fechamento do mês',
  icone: FlagCheckeredIcon,
  tamanhos: ['M', 'L', 'XL'],
  conteudo: (t) => {
    if (t === 'M') {
      const feitas = d.etapas.filter((e) => e.situacao === 'feito').length
      const atual = d.etapas.find((e) => e.situacao !== 'feito')
      return (
        <div className="flex h-full flex-col justify-end gap-2">
          <div className="flex gap-1">
            {d.etapas.map((e) => (
              <span key={e.id} className={cn('h-1.5 flex-1 rounded-full', e.situacao === 'feito' ? 'bg-success' : e.situacao === 'andamento' ? 'bg-foreground/70' : 'bg-sunken')} />
            ))}
          </div>
          <span className="text-sm">
            {feitas} de {d.etapas.length} · agora: <strong className="font-medium">{atual?.rotulo}</strong>
          </span>
        </div>
      )
    }
    return (
      <ol className="grid h-full grid-cols-5 gap-2">
        {d.etapas.map((e, i) => (
          <li key={e.id} className={cn('flex min-w-0 flex-col gap-0.5 rounded-[14px] px-2.5 py-1.5', e.situacao === 'feito' ? 'bg-success/10' : e.situacao === 'andamento' ? 'bg-raised shadow-contorno' : 'bg-sunken/60')}>
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
              {e.situacao === 'feito' ? <CheckIcon weight="bold" className="text-success size-3" /> : <span className="tabular-nums">{i + 1}</span>}
              {e.situacao === 'feito' ? 'feito' : e.situacao === 'andamento' ? 'em andamento' : 'a fazer'}
            </span>
            <span className="truncate text-sm font-medium">{e.rotulo}</span>
            <span className="text-muted-foreground line-clamp-2 text-xs leading-tight">{e.detalhe}</span>
          </li>
        ))}
      </ol>
    )
  },
}

const deveChegar: DefWidget = {
  id: 'deve-chegar',
  titulo: 'O que deve chegar',
  atividades: 'CTB-001, 002, 201',
  descricao: 'Lista do mês: chegou × falta, com cobrar',
  icone: TrayArrowDownIcon,
  tamanhos: ['P', 'G'],
  acao: (
    <BotaoAba acao={{ tipo: 'cobrar', assunto: 'os documentos do mês que ainda não chegaram' }} size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs">
      Cobrar
    </BotaoAba>
  ),
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.deveChegar.filter((x) => !x.chegou).length} legenda="faltando" alerta />
    ) : (
      <ul className="flex flex-col gap-1.5">
        {d.deveChegar.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nada esperado neste mês.</li>}
        {d.deveChegar.map((x) => (
          <li key={x.item} className="flex items-center gap-3 text-sm">
            <Selo feito={x.chegou} alerta={!x.chegou}>
              {x.chegou ? 'chegou' : 'falta'}
            </Selo>
            <span className="min-w-0 flex-1 truncate">{x.item}</span>
            <span className="text-muted-foreground hidden shrink-0 text-xs @sm:inline">{x.quando}</span>
          </li>
        ))}
      </ul>
    ),
}

const classificacao: DefWidget = {
  id: 'classificacao',
  titulo: 'Classificação e de-para',
  atividades: 'CTB-006, 015, 016',
  descricao: 'Linhas do extrato com a sugestão do integrante e a confiança',
  icone: TagIcon,
  tamanhos: ['M', 'XL'],
  acao: <span className="text-muted-foreground text-xs tabular-nums">412 de 430</span>,
  conteudo: (t: TamanhoWidget) => {
    const baixas = d.linhas.filter((l) => l.confianca < 0.7)
    if (t === 'M')
      return (
        <div className="flex h-full flex-col justify-end">
          <span className="font-heading text-3xl font-light tabular-nums">{baixas.length}</span>
          <span className="text-muted-foreground text-xs">linhas com confiança baixa para conferir</span>
        </div>
      )
    return (
      <div className="flex h-full flex-col gap-2">
        <Tabela colunas={[{ rotulo: 'Lançamento' }, { rotulo: 'Valor', direita: true }, { rotulo: 'Sugestão do integrante' }, { rotulo: 'Confiança' }, { rotulo: '' }]} minimo={600}>
          {(t === 'L' ? baixas : d.linhas).map((l) => (
            <tr key={l.id} className={cn(l.confianca < 0.7 && 'bg-warning/5')}>
              <td className="py-1.5 pr-2">
                <div className="font-mono text-xs">{l.descricao}</div>
                <div className="text-muted-foreground text-[11px]">{l.data}</div>
              </td>
              <td className="py-1.5 pr-2 text-right tabular-nums">{l.valor}</td>
              <td className="py-1.5 pr-2">{l.sugestao}</td>
              <td className="py-1.5 pr-2">
                <Confianca valor={l.confianca} />
              </td>
              <td className="py-1.5 text-right whitespace-nowrap">
                {l.confianca < 0.7 ? (
                  <>
                    <BotaoAba acao={{ tipo: 'feito', texto: 'De-para corrigido: o integrante Contábil aprende e usa nos próximos lançamentos parecidos.' }} size="icon-sm" variant="ghost" aria-label="Corrigir de-para (ensina o integrante)">
                      <PencilSimpleLineIcon />
                    </BotaoAba>
                    <BotaoAba acao={{ tipo: 'cobrar', assunto: 'a identificação de um lançamento do extrato' }} size="icon-sm" variant="ghost" aria-label="Perguntar ao cliente (preparar)">
                      <ChatCircleDotsIcon />
                    </BotaoAba>
                  </>
                ) : (
                  <BotaoAba acao={{ tipo: 'feito', texto: 'Classificação aceita com a sugestão do integrante.' }} size="sm" variant="ghost">
                    Aceitar
                  </BotaoAba>
                )}
              </td>
            </tr>
          ))}
        </Tabela>
      </div>
    )
  },
}

const conciliacao: DefWidget = {
  id: 'conciliacao',
  titulo: 'Conciliação',
  atividades: 'CTB-013, 018 a 022',
  descricao: 'Saldos de terceiros, impostos × fiscal × extrato',
  icone: ArrowsLeftRightIcon,
  tamanhos: ['P', 'G', 'XL'],
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.conciliacoes.filter((c) => !c.ok).length} legenda="diferenças abertas" alerta />
    ) : (
      <ul className={cn('grid gap-1.5', t === 'XL' && 'grid-cols-2')}>
        {d.conciliacoes.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhuma conta para conciliar.</li>}
        {d.conciliacoes.map((c) => (
          <li key={c.id} className={cn('flex items-center gap-3 rounded-[12px] px-3 py-1', c.ok ? 'bg-raised' : 'bg-warning/10')}>
            {c.ok ? <CheckIcon weight="bold" className="text-success size-4 shrink-0" /> : <WarningIcon weight="fill" className="text-warning size-4 shrink-0" />}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{c.conta}</span>
              <span className="text-muted-foreground block text-xs tabular-nums">{c.ok ? 'conciliada' : `diferença de ${c.diferenca}`}</span>
            </span>
            {!c.ok && (
              <BotaoAba acao={{ tipo: 'tarefa', codigo: 'CTB-020', titulo: `Conciliar ${c.conta}` }} size="sm" variant="ghost">
                Tarefa
              </BotaoAba>
            )}
          </li>
        ))}
      </ul>
    ),
}

const carteira: DefWidget = {
  id: 'carteira-fechamento',
  titulo: `Fechamento da carteira · ${d.competencia}`,
  atividades: 'CTB-026',
  descricao: 'Clientes por etapa do fechamento e analista',
  icone: FlagCheckeredIcon,
  tamanhos: ['XL'],
  conteudo: () => (
    <Tabela colunas={[{ rotulo: 'Cliente' }, { rotulo: 'Analista' }, ...ordemEtapas.map((e) => ({ rotulo: e, centro: true }))]} minimo={640}>
      {d.carteira.map((c) => {
        const idx = ordemEtapas.indexOf(c.etapa)
        return (
          <tr key={c.cliente}>
            <td className="py-2 pr-2">
              <div>{c.cliente}</div>
              {c.parado && (
                <Badge variant="destaque" className="mt-0.5">
                  {c.parado}
                </Badge>
              )}
            </td>
            <td className="text-muted-foreground py-2 pr-2">{c.analista}</td>
            {ordemEtapas.map((e, i) => (
              <td key={e} className="py-2 pr-2 text-center">
                <span className={cn('mx-auto block size-3 rounded-full', i < idx ? 'bg-success' : i === idx ? (c.parado ? 'bg-warning' : 'bg-foreground') : 'bg-sunken')} aria-label={i < idx ? 'feito' : i === idx ? 'atual' : 'a fazer'} />
              </td>
            ))}
          </tr>
        )
      })}
    </Tabela>
  ),
}
