import { BotaoAba } from '@/components/compostos/painel-aba'
import { AirplaneTiltIcon, CheckIcon, DoorOpenIcon, MoneyIcon, UserPlusIcon, UsersThreeIcon, WarningIcon, XCircleIcon, BroadcastIcon } from '@phosphor-icons/react'
import { Contagem, Selo } from '@/components/compostos/painel-aba'
import { Badge } from '@/components/ui/badge'
import type { DefWidget } from '@/components/widgets/tipos'
import { dpDe } from '@/dados/painel'

// Dados da aba do cliente aberto; a função da aba troca antes de os widgets renderizarem.
let d = dpDe()
import { cn } from '@/lib/utils'
import { Linha, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/**
 * Trabalhista e DP (03, 6.5): ciclo do empregado e eSocial, com prazos legais
 * em contagem regressiva (S-2200, rescisão). Em carteira: clientes pela
 * situação da folha.
 */
export function widgetsDP({ cliente }: CtxAba): WidgetsAba {
  d = dpDe(cliente?.id)
  if (!cliente) return { catalogo: [carteira] }
  return {
    catalogo: [quadro, admissoes, folha, esocial, ferias, rescisoes],
  }
}

const quadro: DefWidget = {
  id: 'quadro',
  titulo: 'Quadro de empregados',
  atividades: 'DP-045, 056, 060',
  descricao: 'Ativos por estabelecimento, cotas e ponto',
  icone: UsersThreeIcon,
  tamanhos: ['P', 'M', 'G'],
  conteudo: (t) => (
    <div className="flex h-full flex-col justify-end gap-2">
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-4xl font-light tabular-nums">{d.quadro.ativos}</span>
        <span className="text-muted-foreground text-sm">ativos</span>
      </div>
      {t !== 'P' && (
        <div className="flex flex-wrap gap-1.5">
          <Selo feito={d.quadro.cotaPcd.tem >= d.quadro.cotaPcd.exigida}>cota PCD ok</Selo>
          <Selo feito={d.quadro.aprendizes.tem >= d.quadro.aprendizes.exigida} alerta>
            aprendizes {d.quadro.aprendizes.tem} de {d.quadro.aprendizes.exigida}
          </Selo>
        </div>
      )}
      {t === 'G' && (
        <>
          <ul className="flex flex-col gap-1 text-sm">
            {d.quadro.estabelecimentos.map((e) => (
              <li key={e.nome} className="flex justify-between gap-2">
                <span>{e.nome}</span>
                <span className="tabular-nums">{e.ativos}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-xs">Ponto: {d.quadro.ponto}</p>
        </>
      )}
    </div>
  ),
}

const admissoes: DefWidget = {
  id: 'admissoes',
  titulo: 'Admissões',
  atividades: 'DP-001 a 008',
  descricao: 'Pedidos em andamento com o prazo do S-2200 contado',
  icone: UserPlusIcon,
  tamanhos: ['G', 'XL'],
  acao: <Badge variant="destaque">sua decisão</Badge>,
  conteudo: (t) =>
    t === 'G' ? (
      <ul className="divide-border/70 flex flex-col divide-y">
        {d.admissoes.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhuma admissão em andamento.</li>}
        {d.admissoes.map((a) => (
          <li key={a.id} className="flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{a.nome}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {a.cargo} · início {a.inicio}
                </span>
              </span>
              <Contagem dias={a.diasS2200} rotulo="S-2200" />
            </div>
            <div className="flex flex-wrap gap-1">
              {a.etapas.map((e) => (
                <Selo key={e.rotulo} feito={e.feito} alerta={e.decisao}>
                  {e.rotulo}
                </Selo>
              ))}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <ul className="grid grid-cols-2 gap-2">
        {d.admissoes.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhuma admissão em andamento.</li>}
        {d.admissoes.map((a) => (
          <li key={a.id} className="bg-raised flex flex-col gap-2 rounded-[16px] p-3 @md:flex-row @md:items-center">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{a.nome}</div>
              <div className="text-muted-foreground text-xs">
                {a.cargo} · início {a.inicio}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {a.etapas.map((e) => (
                  <Selo key={e.rotulo} feito={e.feito} alerta={e.decisao}>
                    {e.rotulo}
                  </Selo>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1.5 @md:items-end">
              <Contagem dias={a.diasS2200} rotulo={`S-2200 ${a.prazoS2200}`} />
              <BotaoAba acao={{ tipo: 'preparar', documento: 'Contrato de experiência' }} size="sm" variant="outline" className="rounded-full">
                Gerar contrato
              </BotaoAba>
            </div>
          </li>
        ))}
      </ul>
    ),
}

const folha: DefWidget = {
  id: 'folha',
  titulo: 'Fechamento da folha · 11/2026',
  atividades: 'DP-009 a 015',
  descricao: 'Variáveis recebidas × esperadas e a prévia',
  icone: MoneyIcon,
  tamanhos: ['M', 'G'],
  acao: (
    <BotaoAba acao={{ tipo: 'cobrar', assunto: 'as variáveis da folha de novembro (horas extras, faltas e comissões)' }} size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs">
      Pedir variáveis
    </BotaoAba>
  ),
  conteudo: (t) =>
    t === 'M' ? (
      <div className="flex h-full flex-col justify-end gap-1">
        <span className="text-sm">
          <strong className="font-heading text-3xl font-light tabular-nums">{d.variaveis.filter((v) => v.recebido).length}</strong>
          <span className="text-muted-foreground"> de {d.variaveis.length} variáveis</span>
        </span>
        <span className="text-muted-foreground truncate text-xs">{d.previa}</span>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <ul className="flex flex-col gap-1.5">
          {d.variaveis.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhuma variável esperada.</li>}
          {d.variaveis.map((v) => (
            <li key={v.item} className="flex items-center gap-3 text-sm">
              <Selo feito={v.recebido} alerta={!v.recebido}>
                {v.recebido ? 'recebida' : 'falta'}
              </Selo>
              <span className="min-w-0 flex-1 truncate">{v.item}</span>
              <span className="text-muted-foreground hidden shrink-0 text-xs @xs:inline">{v.esperado}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-xs">Prévia: {d.previa}</p>
      </div>
    ),
}

const esocial: DefWidget = {
  id: 'esocial',
  titulo: 'eSocial',
  atividades: 'DP-016, 017, 038, 039, 043',
  descricao: 'Eventos aceitos, rejeitados e pendentes',
  icone: BroadcastIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) =>
    t === 'M' ? (
      <div className="grid h-full grid-cols-3 items-end gap-2">
        {(['aceito', 'rejeitado', 'pendente'] as const).map((s) => (
          <div key={s} className="flex flex-col">
            <span className={cn('font-heading text-2xl font-light tabular-nums', s === 'rejeitado' && 'text-destructive')}>{d.esocial.filter((e) => e.situacao === s).length}</span>
            <span className="text-muted-foreground text-[11px]">{s === 'aceito' ? 'aceitos' : s === 'rejeitado' ? 'rejeitados' : 'pendentes'}</span>
          </div>
        ))}
      </div>
    ) : (
      <ul className="flex flex-col gap-2">
        {d.esocial.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhum evento pendente no eSocial.</li>}
        {d.esocial.map((e) => (
          <li key={e.evento} className={cn('flex items-start gap-3 rounded-[14px] px-3 py-2', e.situacao === 'rejeitado' ? 'bg-destructive/8' : 'bg-raised')}>
            {e.situacao === 'aceito' ? (
              <CheckIcon weight="bold" className="text-success mt-0.5 size-4 shrink-0" />
            ) : e.situacao === 'rejeitado' ? (
              <XCircleIcon weight="fill" className="text-destructive mt-0.5 size-4 shrink-0" />
            ) : (
              <WarningIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{e.evento}</span>
              <span className="text-muted-foreground block truncate text-xs">{e.motivo ?? e.situacao}</span>
            </span>
            {e.situacao !== 'aceito' && (
              <BotaoAba acao={{ tipo: 'transmitir', documento: e.evento, orgao: 'eSocial' }} size="sm" variant="ghost">
                {e.situacao === 'rejeitado' ? 'Corrigir' : 'Transmitir'}
              </BotaoAba>
            )}
          </li>
        ))}
      </ul>
    ),
}

const ferias: DefWidget = {
  id: 'ferias',
  titulo: 'Férias e afastamentos',
  atividades: 'DP-023, 024, 025, 046',
  descricao: 'Períodos com risco de dobra, programadas, atestados',
  icone: AirplaneTiltIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <ul className="divide-border/70 flex flex-col divide-y">
      {d.ferias.length === 0 && <li className="text-muted-foreground py-2 text-sm">Nenhum período vencendo nem afastamento.</li>}
      {(t === 'M' ? d.ferias.filter((f) => f.alerta) : d.ferias).map((f) => (
        <Linha
          key={f.nome}
          titulo={f.nome}
          detalhe={<span className={cn(f.alerta && 'text-foreground font-medium')}>{f.detalhe}</span>}
          fim={
            f.alerta && t !== 'M' ? (
              <BotaoAba acao={{ tipo: 'preparar', documento: `Aviso e recibo de férias · ${f.nome}` }} size="sm" variant="outline" className="rounded-full">
                Programar
              </BotaoAba>
            ) : undefined
          }
        />
      ))}
    </ul>
  ),
}

const rescisoes: DefWidget = {
  id: 'rescisoes',
  titulo: 'Rescisões',
  atividades: 'DP-026 a 032',
  descricao: 'Prazo de 10 dias contado, TRCT, guia rescisória',
  icone: DoorOpenIcon,
  tamanhos: ['M', 'L'],
  conteudo: (t) => (
    <div className="flex h-full flex-col justify-end gap-2">
      {d.rescisoes.map((r) => (
        <div key={r.nome} className={cn('flex gap-2', t === 'L' ? 'items-center' : 'flex-col')}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{r.nome}</div>
            <div className="text-muted-foreground truncate text-xs">{r.motivo}</div>
          </div>
          <Contagem dias={r.dias} rotulo={r.prazo} />
          {t === 'L' && (
            <BotaoAba acao={{ tipo: 'preparar', documento: `TRCT · ${r.nome}` }} size="sm" variant="outline" className="rounded-full">
              Gerar TRCT
            </BotaoAba>
          )}
        </div>
      ))}
    </div>
  ),
}

const carteira: DefWidget = {
  id: 'carteira-folha',
  titulo: 'Folha da carteira · 11/2026',
  atividades: 'DP-009, 014',
  descricao: 'Clientes pela situação da folha do mês',
  icone: MoneyIcon,
  tamanhos: ['XL'],
  conteudo: () => (
    <Tabela colunas={[{ rotulo: 'Cliente' }, { rotulo: 'Empregados', direita: true }, { rotulo: 'Folha' }, { rotulo: 'Admissões abertas' }]} minimo={520}>
      {d.carteira.map((c) => (
        <tr key={c.cliente}>
          <td className="py-2 pr-2">{c.cliente}</td>
          <td className="py-2 pr-2 text-right tabular-nums">{c.empregados}</td>
          <td className="py-2 pr-2">
            <Selo feito={c.folha === 'importada no core'} alerta={c.folha.startsWith('aguardando')}>
              {c.folha}
            </Selo>
          </td>
          <td className="py-2 tabular-nums">{c.admissoes || '·'}</td>
        </tr>
      ))}
    </Tabela>
  ),
}
