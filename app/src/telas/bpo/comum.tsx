import { ArrowSquareOutIcon, CircleIcon, PlugsConnectedIcon, WarningIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { type DecisaoLote, useLoja, useNavegacao } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { Tooltip } from '@/components/ui/tooltip'
import { corAudit, rotuloAbrirErp, rotuloSync, type EmpresaBpo } from '@/dados/bpo'
import { integrantes } from '@/dados/exemplo'
import { integranteAoVivo } from '@/ambiente/integrante-vivo'
import { useAparencia } from '@/hooks/useAparencia'
import { cn } from '@/lib/utils'

export { brl } from '../financeiro/comum'
export { Caixa, Numero, Propriedade, TituloBloco } from '@/components/compostos/blocos'

/**
 * Moldura de toda aba do BPO, a mesma do Painel: rolagem com as mesmas margens
 * e coluna de largura fixa. Nenhuma aba monta a sua própria, para trocar de aba
 * não mexer na largura nem no topo do conteúdo.
 */
export function PaginaBpo({ children }: { children: ReactNode }) {
  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">{children}</div>
    </AreaRolagem>
  )
}

/**
 * Cabeçalho das abas do BPO: título, de quem são os dados (carteira ou a
 * empresa escolhida no seletor) e o integrante da função da aba com "Falar", no mesmo
 * desenho do Financeiro e das abas do Painel.
 *
 * Posições fixas entre as abas: no desktop o cartão do integrante fica à direita,
 * alinhado ao título, com largura e altura fixas (o resumo de uma ou duas linhas não
 * muda a altura nem a posição do "Falar"); no celular ele vem logo abaixo do título,
 * antes do subtítulo e das ações, que variam de tamanho de uma aba para outra.
 */
export function CabecalhoBpo({ titulo, sub, status, integrante = 'i-bpo', children }: { titulo: string; sub: string; status?: string; integrante?: string; children?: ReactNode }) {
  const nav = useNavegacao()
  const aparencia = useAparencia()
  const loja = useLoja()
  // Cada aba mostra o integrante da função dela (Contas a Pagar, Conciliação, Gerencial…).
  const base = integrantes.find((i) => i.id === integrante)
  const bpo = base && integranteAoVivo(base, loja.estado.trabalhos, loja.conversasTime[base.id] ?? [], loja.estado.decisoes, loja.tarefas)
  const { usuario, permissoes } = useSessao()
  const temIntegrante = usuario.papel === 'administrador' || permissoes.setores.includes('bpo_financeiro')
  const t = bpo ? aparencia(bpo) : undefined
  return (
    <header className="grid grid-cols-1 gap-x-4 gap-y-3 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_auto_1fr] lg:gap-y-0">
      <h1 className="text-2xl font-light tracking-tight sm:text-3xl lg:col-start-1 lg:row-start-1">{titulo}</h1>
      {bpo && t && (
        <div className="bg-surface shadow-cartao flex min-h-19 w-full items-center gap-3 rounded-[20px] p-3 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <Orb cor={t.cor} corOlhos={t.corOlhos} estado={bpo.estado} tamanho={40} animado modo="wander" cutucavel={false} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{t.nome}</div>
            <p className="text-muted-foreground line-clamp-2 text-xs">{status ?? bpo.resumo}</p>
          </div>
          {temIntegrante && (
            <Button size="sm" variant="outline" className="shrink-0 rounded-full" onClick={() => nav.irPara({ modulo: 'inicio', aba: 'time', integrante: bpo.id })}>
              Falar
            </Button>
          )}
        </div>
      )}
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <p className="text-muted-foreground text-sm">{sub}</p>
        {children && <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </header>
  )
}

/** Semáforo da auditoria contínua (10, 5.1): cor com rótulo, nunca cor sozinha. */
export function SeloAudit({ e, compacto }: { e: EmpresaBpo; compacto?: boolean }) {
  const rotulo = { verde: 'em dia', amarelo: 'atenção', vermelho: 'agir hoje' }[e.audit.cor]
  return (
    <Tooltip conteudo={`Auditoria: ${e.audit.motivos.join('; ')}`}>
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
        <CircleIcon weight="fill" className="size-2.5 shrink-0" style={{ color: corAudit[e.audit.cor] }} />
        {!compacto && rotulo}
      </span>
    </Tooltip>
  )
}

/** ERP e estado da sincronização do espelho (10, 3.0 e 5.2). */
export function SeloErp({ e }: { e: EmpresaBpo }) {
  const ruim = e.erp.situacao === 'atrasada' || e.erp.situacao === 'credencial_vencida'
  return (
    <span className={cn('bg-sunken inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs', ruim ? 'text-destructive' : 'text-muted-foreground')}>
      {ruim ? <WarningIcon className="size-3.5 shrink-0" weight="fill" /> : <PlugsConnectedIcon className="size-3.5 shrink-0" />}
      <span className="truncate">
        <span className={ruim ? undefined : 'text-foreground'}>{e.erp.provedor}</span> · {rotuloSync[e.erp.situacao]}
        {e.erp.situacao !== 'livro_proprio' && ` · ${e.erp.ultima}`}
      </span>
    </span>
  )
}

/** "Abrir no ERP": atalho para o registro no sistema do cliente (na demonstração, um aviso). */
export function useAbrirErp() {
  const loja = useLoja()
  return (e: EmpresaBpo, oque: string) =>
    loja.toast(
      e.erp.modo === 'E3'
        ? `${oque}: aberto no livro próprio da plataforma`
        : e.erp.modo === 'E2'
          ? `${e.erp.provedor} em modo arquivo: ${oque} entra no checklist “lançar no ERP”`
          : `Abriria ${oque} no ${e.erp.provedor} (link direto do registro)`,
    )
}

export function BotaoErp({ e, oque, rotulo }: { e: EmpresaBpo; oque: string; rotulo?: boolean }) {
  const abrir = useAbrirErp()
  return rotulo ? (
    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => abrir(e, oque)}>
      <ArrowSquareOutIcon /> {rotuloAbrirErp(e)}
    </Button>
  ) : (
    <Button size="icon-sm" variant="ghost" className="shrink-0 rounded-full" aria-label={`${rotuloAbrirErp(e)}: ${oque}`} title={rotuloAbrirErp(e)} onClick={() => abrir(e, oque)}>
      <ArrowSquareOutIcon />
    </Button>
  )
}

/** Props comuns: a empresa do seletor (ou nenhuma = carteira) e como escolher uma. */
export interface PropsBpo {
  empresa?: EmpresaBpo
  onEscolher: (clienteId: string | null, aba?: string) => void
}

/** Contas da empresa com o que a equipe já mudou (conferência, inclusão em lote). */
export function useContasBpo() {
  const loja = useLoja()
  return (e: EmpresaBpo) => e.contas.map((c) => ({ ...c, ...loja.estado.bpoContas[c.id] }))
}

/** Estado do lote como o cliente o deixou no app (10, 3.6). */
export function useLotes() {
  const loja = useLoja()
  return (id: string): DecisaoLote => loja.estado.bpoLotes[id] ?? { situacao: 'aguardando', aprovacoes: [], removidos: [] }
}
