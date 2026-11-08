import { BotaoAba } from '@/components/compostos/painel-aba'
import { CalendarCheckIcon, ChecksIcon, ListChecksIcon, ReceiptIcon, SirenIcon, MapTrifoldIcon } from '@phosphor-icons/react'
import type { DefWidget } from '@/components/widgets/tipos'
import { obrigacoesDetalhe as d } from '@/dados/painel-abas'
import { cn } from '@/lib/utils'
import { IconeSituacao, Linha, Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

const corStatus = {
  entregue: 'bg-success/15',
  pendente: 'bg-sunken text-muted-foreground',
  'em risco': 'bg-warning/15',
  atrasada: 'bg-destructive/12 text-destructive',
} as const

/**
 * Obrigações e Prazos (03, 6.2): o que vence, o que falta para entregar e a
 * prova da entrega. Em carteira: a semana por cliente.
 */
export function widgetsObrigacoes({ cliente }: CtxAba): WidgetsAba {
  return {
    catalogo: [cliente ? calendario : semanaCarteira, riscos, prerequisitos, ...(cliente ? [comprovacao] : []), prorrogacoes],
  }
}

const calendario: DefWidget = {
  id: 'calendario',
  titulo: 'Calendário do cliente · 11/2026',
  atividades: 'FIS-001, 003',
  descricao: 'Prazo legal, prazo interno, status e recibo de cada obrigação',
  icone: CalendarCheckIcon,
  tamanhos: ['G', 'XL'],
  conteudo: (t) =>
    t === 'G' ? (
      <div className="flex flex-col gap-1.5">
        <ul className="divide-border/70 flex flex-col divide-y">
          {d.calendario
            .filter((o) => o.status !== 'entregue')
            .map((o) => (
              <Linha key={o.obrigacao} titulo={o.obrigacao} detalhe={`legal ${o.legal} · interno ${o.interno}`} fim={<span className={cn('rounded-full px-2 py-0.5 text-[11px]', corStatus[o.status])}>{o.status}</span>} />
            ))}
        </ul>
        <p className="text-muted-foreground text-xs">{d.calendario.filter((o) => o.status === 'entregue').length} já entregues, com recibo</p>
      </div>
    ) : (
      <Tabela colunas={[{ rotulo: 'Obrigação' }, { rotulo: 'Setor' }, { rotulo: 'Legal' }, { rotulo: 'Interno' }, { rotulo: 'Status' }, { rotulo: 'Recibo' }]} minimo={560}>
        {d.calendario.map((o) => (
          <tr key={o.obrigacao}>
            <td className="py-1.5 pr-2">{o.obrigacao}</td>
            <td className="text-muted-foreground py-1.5 pr-2">{o.setor}</td>
            <td className="py-1.5 pr-2 tabular-nums">{o.legal}</td>
            <td className="py-1.5 pr-2 tabular-nums">{o.interno}</td>
            <td className="py-1.5 pr-2">
              <span className={cn('rounded-full px-2 py-0.5 text-[11px]', corStatus[o.status])}>{o.status}</span>
            </td>
            <td className="py-1.5">{o.recibo ? <code className="text-muted-foreground text-[11px]">{o.recibo}</code> : <span className="text-muted-foreground">·</span>}</td>
          </tr>
        ))}
      </Tabela>
    ),
}

const riscos: DefWidget = {
  id: 'riscos',
  titulo: 'Atrasos e riscos',
  atividades: 'FIS-047',
  descricao: 'Vence hoje, atrasadas, em risco e multa estimada',
  icone: SirenIcon,
  tamanhos: ['P', 'M', 'G'],
  conteudo: (t) =>
    t === 'P' ? (
      <Numero valor={d.riscos.atrasadas + d.riscos.emRisco} legenda="atrasadas ou em risco" alerta />
    ) : (
      <div className="flex h-full flex-col justify-end gap-2">
        <div className="grid grid-cols-3 gap-2">
          {[
            { r: 'vence hoje', v: d.riscos.hoje },
            { r: 'atrasadas', v: d.riscos.atrasadas, erro: true },
            { r: 'em risco', v: d.riscos.emRisco, alerta: true },
          ].map((x) => (
            <div key={x.r} className="flex flex-col">
              <span className={cn('font-heading text-2xl font-light tabular-nums', x.erro && 'text-destructive', x.alerta && 'text-warning')}>{x.v}</span>
              <span className="text-muted-foreground text-[11px]">{x.r}</span>
            </div>
          ))}
        </div>
        {t === 'G' && (
          <p className="text-sm">
            Multa estimada se nada mudar: <strong className="font-medium tabular-nums">{d.riscos.multa}</strong>
          </p>
        )}
      </div>
    ),
}

const prerequisitos: DefWidget = {
  id: 'prerequisitos',
  titulo: 'Pré-requisitos da semana',
  atividades: 'FIS-046',
  descricao: 'Certificado, procurações, gov.br e documentos para entregar',
  icone: ListChecksIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className={cn('flex flex-col gap-1.5', t === 'L' && 'grid grid-cols-2 gap-x-4')}>
      {(t === 'M' ? d.prerequisitos.filter((p) => !p.ok) : d.prerequisitos).map((p) => (
        <li key={p.item} className="flex items-center gap-2.5 text-sm">
          <IconeSituacao s={p.ok ? 'ok' : 'atencao'} />
          <span className="min-w-0 flex-1 truncate">{p.item}</span>
          <span className="text-muted-foreground shrink-0 text-xs">{p.detalhe}</span>
        </li>
      ))}
    </ul>
  ),
}

const comprovacao: DefWidget = {
  id: 'comprovacao',
  titulo: 'Comprovação',
  atividades: 'FIS-003, 023',
  descricao: 'Recibo com hash por obrigação; as que ainda não têm',
  icone: ReceiptIcon,
  tamanhos: ['P', 'M', 'G'],
  conteudo: (t) => {
    const com = d.calendario.filter((o) => o.recibo)
    if (t === 'P') return <Numero valor={d.semRecibo} legenda="entregues sem recibo" alerta />
    return (
      <div className="flex h-full flex-col justify-end gap-2">
        <span className="text-sm">
          <strong className="font-heading text-2xl font-light tabular-nums">{com.length}</strong> <span className="text-muted-foreground">recibos guardados · {d.semRecibo} sem recibo</span>
        </span>
        {t === 'G' && (
          <ul className="flex flex-col gap-1 text-sm">
            {com.map((o) => (
              <li key={o.obrigacao} className="flex items-center gap-2">
                <ChecksIcon className="text-success size-4" />
                <span className="flex-1 truncate">{o.obrigacao}</span>
                <code className="text-muted-foreground text-[11px]">{o.recibo}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
}

const prorrogacoes: DefWidget = {
  id: 'prorrogacoes',
  titulo: 'Regras por UF e prorrogações',
  atividades: 'FIS-002, 024',
  descricao: 'Declarações estaduais e mudanças de prazo detectadas',
  icone: MapTrifoldIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {(t === 'M' ? d.prorrogacoes.slice(-1) : d.prorrogacoes).map((p) => (
        <li key={p.regra} className="flex flex-col py-2 first:pt-0 last:pb-0">
          <span className="text-sm">
            <strong className="font-medium">{p.regra}</strong> · {p.mudanca}
          </span>
          <span className="text-muted-foreground text-xs">{p.quando}</span>
        </li>
      ))}
    </ul>
  ),
}

const semanaCarteira: DefWidget = {
  id: 'carteira-semana',
  titulo: 'Semana da carteira',
  atividades: 'FIS-001, 047',
  descricao: 'Obrigações da semana por cliente: entregues, pendentes, em risco, atrasadas',
  icone: CalendarCheckIcon,
  tamanhos: ['XL'],
  acao: (
    <BotaoAba acao={{ tipo: 'feito', texto: 'Calendário de novembro gerado para a carteira: prazo interno em D-5 de cada obrigação.' }} size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs">
      Gerar calendário
    </BotaoAba>
  ),
  conteudo: () => (
    <Tabela colunas={[{ rotulo: 'Cliente' }, { rotulo: 'Entregues', direita: true }, { rotulo: 'Pendentes', direita: true }, { rotulo: 'Em risco', direita: true }, { rotulo: 'Atrasadas', direita: true }]} minimo={520}>
      {d.carteira.map((c) => (
        <tr key={c.cliente}>
          <td className="py-2 pr-2">{c.cliente}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.entregues}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.pendentes}</td>
          <td className={cn('py-2 pr-2 text-right tabular-nums', c.risco > 0 && 'text-warning font-medium')}>{c.risco || '·'}</td>
          <td className={cn('py-2 pr-2 text-right tabular-nums', c.atrasadas > 0 && 'text-destructive font-medium')}>{c.atrasadas || '·'}</td>
        </tr>
      ))}
    </Tabela>
  ),
}
