import { BotaoAba } from '@/components/compostos/painel-aba'
import { CheckIcon, EnvelopeSimpleIcon, ReceiptIcon, ScalesIcon, SealCheckIcon, WarningIcon, ChartLineUpIcon } from '@phosphor-icons/react'
import { MedidorSublimite } from '@/components/compostos/painel-aba'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import { cabe } from '@/components/widgets/widget'
import { fiscalDe } from '@/dados/painel'
import { cn } from '@/lib/utils'
import { Linha, Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/** Fiscal (03, 6.4): Simples (só para cliente do Simples), caixas postais, situação, certidões e guias. */
export function widgetsFiscal({ cliente }: CtxAba): WidgetsAba {
  const d = fiscalDe(cliente?.id)
  const simples = cliente?.regime === 'Simples Nacional'
  const s = d.simples
  const simplesDef: DefWidget = {
    id: 'simples',
    titulo: 'Simples e MEI',
    atividades: 'FIS-009 a 018',
    descricao: 'Sublimite, fator R, DAS e PGDAS-D do mês',
    icone: ChartLineUpIcon,
    tamanhos: ['M', 'G', 'XL'],
    conteudo: (t) => (
      <div className="flex h-full flex-col justify-between gap-3">
        <MedidorSublimite rotulo="Receita 12 meses × sublimite" usado={s.usado} teto={s.sublimite} semAviso={t === 'M'} />
        {t !== 'M' && (
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-raised rounded-[12px] px-3 py-2">
              <dt className="text-muted-foreground text-[11px]">Fator R</dt>
              <dd className="font-medium tabular-nums">{Math.round(s.fatorR * 100)}%</dd>
            </div>
            <div className="bg-raised rounded-[12px] px-3 py-2">
              <dt className="text-muted-foreground text-[11px]">DAS 10/2026</dt>
              <dd className="font-medium tabular-nums">{s.das}</dd>
            </div>
          </dl>
        )}
        {(t === 'G' || t === 'XL') && <p className="text-muted-foreground text-xs">PGDAS-D 10/2026: {s.pgdas}. Transmitir é "executar com aprovação".</p>}
      </div>
    ),
  }
  const g = d.carteiraGuias
  return {
    catalogo: [
      ...(simples ? [simplesDef] : []),
      {
        id: 'caixas',
        titulo: 'Caixas postais',
        atividades: 'FIS-005, 026, 029',
        descricao: 'e-CAC, DEC e domicílios eletrônicos, com prazo de ciência',
        icone: EnvelopeSimpleIcon,
        tamanhos: ['P', 'G', 'XL'],
        conteudo: (t) =>
          t === 'P' ? (
            <Numero valor={d.caixaPostal.filter((m) => m.ciencia !== 'lida').length} legenda="mensagem com prazo" alerta />
          ) : (
            <ul className="flex flex-col gap-2">
              {d.caixaPostal.map((m) => (
                <li key={m.id} className="bg-raised flex items-start gap-3 rounded-[14px] px-3 py-2.5">
                  <EnvelopeSimpleIcon weight="duotone" className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{m.assunto}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {m.orgao} · recebida {m.recebida} · {m.ciencia}
                    </div>
                  </div>
                  {m.tarefa && <Badge variant="outline">{m.tarefa}</Badge>}
                </li>
              ))}
            </ul>
          ),
      },
      {
        id: 'situacao',
        titulo: 'Situação fiscal',
        atividades: 'FIS-006, 027, 030',
        descricao: 'Receita, PGFN, estado e município: atual × consulta anterior',
        icone: ScalesIcon,
        tamanhos: ['M', 'G'],
        conteudo: (t) => (
          <ul className="divide-border/70 flex flex-col divide-y">
            {d.situacao.slice(0, t === 'M' ? 2 : 3).map((x) => (
              <Linha
                key={x.orgao}
                inicio={x.atual === 'regular' ? <CheckIcon weight="bold" className="text-success size-4 shrink-0" /> : <WarningIcon weight="fill" className="text-warning size-4 shrink-0" />}
                titulo={x.orgao}
                detalhe={x.mudou ? `${x.atual} · antes: ${x.anterior}` : x.atual}
                fim={
                  x.mudou && cabe(t, { colunas: 2, linhas: 2 }) ? (
                    <BotaoAba acao={{ tipo: 'tarefa', codigo: 'FIS-005', titulo: `Tratar mudança na situação: ${x.orgao}` }} size="sm" variant="ghost">
                      Abrir tarefa
                    </BotaoAba>
                  ) : undefined
                }
              />
            ))}
          </ul>
        ),
      },
      {
        id: 'certidoes',
        titulo: 'Certidões',
        atividades: 'FIS-036, 037',
        descricao: 'Validade das certidões, emitir ou renovar',
        icone: SealCheckIcon,
        tamanhos: ['M', 'G'],
        conteudo: (t) => (
          <ul className="divide-border/70 flex flex-col divide-y">
            {d.certidoes.slice(0, t === 'M' ? 2 : 3).map((c) => (
              <Linha
                key={c.nome}
                titulo={c.nome}
                detalhe={c.validade}
                fim={
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] tabular-nums', c.dias < 0 ? 'bg-destructive/12 text-destructive' : c.dias <= 30 ? 'bg-warning/15' : 'bg-sunken text-muted-foreground')}>
                    {c.dias < 0 ? 'irregular' : `${c.dias} dias`}
                  </span>
                }
              />
            ))}
          </ul>
        ),
      },
      {
        id: 'guias',
        titulo: cliente ? 'Guias e pagamentos' : 'Guias da carteira',
        atividades: 'FIS-031, 032, 034',
        descricao: 'Central de guias: enviada, lida, paga',
        icone: ReceiptIcon,
        tamanhos: ['M', 'XL'],
        acao: (
          <BotaoAba acao={{ tipo: 'cobrar', assunto: 'o pagamento das guias em aberto' }} size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs">
            Cobrar pagamento
          </BotaoAba>
        ),
        conteudo: (t) =>
          t === 'M' || !cliente ? (
            <div className="grid h-full grid-cols-4 items-end gap-2">
              {(cliente
                ? [
                    { r: 'enviadas', v: d.guias.filter((x) => x.enviada).length },
                    { r: 'lidas', v: d.guias.filter((x) => x.lida).length },
                    { r: 'pagas', v: d.guias.filter((x) => x.paga).length },
                    { r: 'a pagar', v: d.guias.filter((x) => !x.paga).length },
                  ]
                : [
                    { r: 'enviadas', v: g.enviadas },
                    { r: 'lidas', v: g.lidas },
                    { r: 'pagas', v: g.pagas },
                    { r: 'vencidas', v: g.vencidas },
                  ]
              ).map((x) => (
                <div key={x.r} className="flex flex-col">
                  <span className="font-heading text-2xl font-light tabular-nums">{x.v}</span>
                  <span className="text-muted-foreground text-[11px]">{x.r}</span>
                </div>
              ))}
            </div>
          ) : (
            <Tabela colunas={[{ rotulo: 'Tributo' }, { rotulo: 'Valor', direita: true }, { rotulo: 'Vence' }, { rotulo: 'Situação' }]} minimo={460}>
              {d.guias.map((x) => (
                <tr key={x.id}>
                  <td className="py-2 pr-2">
                    {x.tributo} <span className="text-muted-foreground text-xs">{x.competencia}</span>
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">{x.valor}</td>
                  <td className="py-2 pr-2 tabular-nums">{x.vencimento}</td>
                  <td className="py-2">
                    <span className="flex flex-wrap gap-1">
                      <Etapa feito={x.enviada}>enviada</Etapa>
                      <Etapa feito={x.lida}>lida</Etapa>
                      <Etapa feito={x.paga}>paga</Etapa>
                    </span>
                  </td>
                </tr>
              ))}
            </Tabela>
          ),
      },
    ],
  }
}

function Etapa({ feito, children }: { feito: boolean; children: string }) {
  return (
    <span className={cn('flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px]', feito ? 'bg-success/15' : 'bg-sunken text-muted-foreground')}>
      {feito && <CheckIcon weight="bold" className="text-success size-3" />}
      {children}
    </span>
  )
}
