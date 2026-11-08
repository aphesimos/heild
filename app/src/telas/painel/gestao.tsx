import { ChartBarHorizontalIcon, LockKeyIcon, RobotIcon, SignpostIcon, UsersIcon } from '@phosphor-icons/react'
import type { DefWidget } from '@/components/widgets/tipos'
import { gestaoDetalhe as d } from '@/dados/painel-abas'
import { cn } from '@/lib/utils'
import { IconeSituacao, Linha, Numero, Tabela } from './Tabela'
import type { CtxAba, WidgetsAba } from './tipos'

/**
 * Gestão (03, 6.8): a visão do escritório, igual com ou sem cliente. Equipe e
 * carga, permissões calculadas, produtividade, governança da IA e o plano de
 * migração das ferramentas antigas.
 */
export function widgetsGestao(_ctx: CtxAba): WidgetsAba {
  return {
    catalogo: [produtividade, ia, equipe, permissoes, migracao],
  }
}

const equipe: DefWidget = {
  id: 'equipe',
  titulo: 'Equipe e carteira',
  atividades: 'GES-017, 018, 021',
  descricao: 'Pessoas, papel, setores e a carga de cada uma',
  icone: UsersIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => {
    const max = Math.max(...d.equipe.map((p) => p.abertas))
    return (
      <ul className="flex flex-col gap-2">
        {d.equipe.slice(0, t === 'M' ? 2 : 4).map((p) => (
          <li key={p.nome} className="flex items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm">{p.nome}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {p.papel} · {p.clientes} clientes{t === 'L' ? ` · ${p.setores}` : ''}
              </span>
            </span>
            <span className="flex w-24 shrink-0 items-center gap-2">
              <span className="bg-sunken h-1.5 flex-1 overflow-hidden rounded-full">
                <span className={cn('block h-full rounded-full', p.abertas / max > 0.8 ? 'bg-warning' : 'bg-foreground/60')} style={{ width: `${(p.abertas / max) * 100}%` }} />
              </span>
              <span className="w-5 text-right text-xs tabular-nums">{p.abertas}</span>
            </span>
          </li>
        ))}
      </ul>
    )
  },
}

const permissoes: DefWidget = {
  id: 'permissoes',
  titulo: 'Permissões',
  atividades: 'GES-021, 041',
  descricao: 'Pessoa × aba × nível efetivo, calculado do papel e dos setores',
  icone: LockKeyIcon,
  tamanhos: ['XL'],
  conteudo: () => (
    <div className="flex h-full flex-col gap-1.5">
      <Tabela colunas={[{ rotulo: '' }, ...d.abas.map((a) => ({ rotulo: a, centro: true }))]} minimo={560}>
        {d.permissoes.map((p) => (
          <tr key={p.nome}>
            <td className="py-1 pr-2 whitespace-nowrap">{p.nome}</td>
            {p.niveis.map((n, i) => (
              <td key={i} className="py-1 pr-2 text-center">
                <span className={cn('inline-flex size-6 items-center justify-center rounded-md text-[11px] font-medium', n === 'E' ? 'bg-foreground/80 text-background' : n === 'L' ? 'bg-sunken' : 'text-muted-foreground')}>{n}</span>
              </td>
            ))}
          </tr>
        ))}
      </Tabela>
      <p className="text-muted-foreground text-[11px]">E edita · L lê · · sem acesso. "O que Fulano vê?" simula a tela da pessoa.</p>
    </div>
  ),
}

const produtividade: DefWidget = {
  id: 'produtividade',
  titulo: 'Produtividade e atrasos',
  atividades: 'GES-047, 048',
  descricao: 'Tarefas por setor e conversas sem resposta',
  icone: ChartBarHorizontalIcon,
  tamanhos: ['P', 'G'],
  conteudo: (t) => {
    if (t === 'P') return <Numero valor={d.produtividade.reduce((s, x) => s + x.atrasadas, 0)} legenda="tarefas atrasadas" alerta />
    const max = Math.max(...d.produtividade.map((x) => x.feitas + x.abertas))
    return (
      <div className="flex flex-col gap-2">
        <ul className="flex flex-col gap-1.5">
          {d.produtividade.map((x) => (
            <li key={x.setor} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-sm">
              <span className="truncate">{x.setor}</span>
              <span className="bg-sunken flex h-2 overflow-hidden rounded-full">
                <span className="bg-foreground/70 h-full" style={{ width: `${(x.feitas / max) * 100}%` }} />
                <span className="bg-foreground/25 h-full" style={{ width: `${(x.abertas / max) * 100}%` }} />
              </span>
              <span className={cn('w-14 text-right text-xs tabular-nums', x.atrasadas ? 'text-destructive font-medium' : 'text-muted-foreground')}>{x.atrasadas ? `${x.atrasadas} atras.` : `${x.abertas} abertas`}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-xs">feitas no mês · abertas · {d.semResposta} conversas sem resposta há mais de 24 h</p>
      </div>
    )
  },
}

const ia: DefWidget = {
  id: 'ia',
  titulo: 'Governança da IA',
  atividades: 'GES-056, 062',
  descricao: 'O que os integrantes fizeram sozinhos, aprovação e custo do mês',
  icone: RobotIcon,
  tamanhos: ['M', 'G'],
  conteudo: (t) => (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="flex items-end gap-4">
        <div className="flex flex-col">
          <span className="font-heading text-3xl font-light tabular-nums">{d.ia.aprovados}%</span>
          <span className="text-muted-foreground text-[11px]">cartões aprovados sem edição</span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-xl font-light tabular-nums">{d.ia.custo}</span>
          <span className="text-muted-foreground text-[11px]">custo no mês</span>
        </div>
      </div>
      {t === 'G' && (
        <>
          <div className="flex h-2 overflow-hidden rounded-full" aria-label="Decisões sobre os cartões">
            <span className="bg-success h-full" style={{ width: `${d.ia.aprovados}%` }} />
            <span className="bg-warning h-full" style={{ width: `${d.ia.editados}%` }} />
            <span className="bg-destructive h-full" style={{ width: `${d.ia.recusados}%` }} />
          </div>
          <p className="text-muted-foreground text-xs">
            {d.ia.aprovados}% aprovados · {d.ia.editados}% editados · {d.ia.recusados}% recusados · {d.ia.sozinhos} ações feitas sozinhas (nível executar) · mês passado {d.ia.custoAnterior}
          </p>
        </>
      )}
    </div>
  ),
}

const migracao: DefWidget = {
  id: 'migracao',
  titulo: 'Plano mestre de migração',
  atividades: 'GES-608',
  descricao: 'Por ferramenta antiga: onda, paralelo e o critério medido',
  icone: SignpostIcon,
  tamanhos: ['G', 'XL'],
  conteudo: (t) => (
    <ul className={cn('divide-border/70 flex flex-col divide-y', t === 'XL' && 'grid grid-cols-2 gap-x-6 divide-y-0')}>
      {d.migracao.map((m) => (
        <Linha key={m.ferramenta} inicio={<IconeSituacao s={m.pronto ? 'ok' : 'neutro'} />} titulo={`${m.ferramenta} · ${m.onda}`} detalhe={`${m.paralelo} · ${m.criterio}`} />
      ))}
    </ul>
  ),
}
