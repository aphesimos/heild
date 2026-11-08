import { ArrowRightIcon, ArrowBendDownRightIcon, ShieldCheckIcon, TableIcon } from '@phosphor-icons/react'
import { ArrowsLeftRightIcon, ChatCircleTextIcon, FileTextIcon, ReceiptIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { useDocumentos } from '@/ambiente/documentos'
import { useEfeitosCartao } from '@/ambiente/efeitos'
import { clientePorNome, integranteDoSetor, useFluxos } from '@/ambiente/fluxos'
import { usePedirIntegrante } from '@/ambiente/pedir'
import { useLoja, useNavegacao } from '@/ambiente/loja'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import type { Cartao } from '@/dados/tipos'
import type { SetorIntegrante } from '@/theme/tipos'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { AvisoIntegrante } from './aviso-integrante'
import { CartaoRespostaLegal } from './cartoes-legal'
import { ProgressoTrabalho } from './progresso-trabalho'
import { BotoesDecisao, ResultadoDecisao, type Decisao } from './botoes-decisao'
import { CartaoTarefa } from './cartao-tarefa'

type Por<T extends Cartao['tipo']> = Extract<Cartao, { tipo: T }>

const casca = 'bg-card flex flex-col gap-3 rounded-xl border p-4'

/** Cartão de aprovação (Fundações 6.4): resumo, argumentos, sim / editar / não, expira em. */
export function CartaoAprovacao({ cartao, onDecidir, semEditar, className }: { cartao: Por<'aprovacao'>; onDecidir?: (d: Decisao) => void; semEditar?: boolean; className?: string }) {
  const loja = useLoja()
  const [local, setDecidido] = useState<Decisao | null>(null)
  const decidido = (loja.estado.decisoes[cartao.id] as Decisao | undefined) ?? local
  return (
    <div data-cartao-pendente={!decidido || undefined} className={cn(casca, !decidido && 'border-warning/60', className)}>
      <div className="flex items-start gap-2">
        <ShieldCheckIcon className="text-warning mt-0.5 size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground text-xs">Pede sua aprovação{cartao.lote ? ` · lote de ${cartao.lote}` : ''}</div>
          <div className="text-sm font-medium">{cartao.resumo}</div>
        </div>
        {cartao.expiraEm && !decidido && <span className="text-muted-foreground shrink-0 text-xs">{cartao.expiraEm}</span>}
      </div>
      {cartao.argumentos && (
        <dl className="bg-muted/60 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg px-3 py-2 text-xs">
          {cartao.argumentos.map((a) => (
            <div key={a.rotulo} className="contents">
              <dt className="text-muted-foreground">{a.rotulo}</dt>
              <dd className="font-medium tabular-nums">{a.valor}</dd>
            </div>
          ))}
        </dl>
      )}
      {decidido ? (
        <ResultadoDecisao decisao={decidido} />
      ) : (
        <BotoesDecisao
          lote={cartao.lote}
          semEditar={semEditar}
          onDecidir={(d) => {
            if (d !== 'editar_e_aprovar') setDecidido(d)
            onDecidir?.(d)
          }}
        />
      )}
    </div>
  )
}

/** "Encaminhei para X", com a resposta do integrante como citação (02, 9.1). */
export function CartaoEncaminhamento({ cartao, onAbrir, className }: { cartao: Por<'encaminhamento'>; onAbrir?: () => void; className?: string }) {
  const { integrante } = useTema()
  const i = integrante(cartao.para)
  if (cartao.de) return <PassagemAnimada cartao={cartao as Por<'encaminhamento'> & { de: SetorIntegrante }} onAbrir={onAbrir} className={className} />
  return (
    <div className={cn(casca, className)}>
      <div className="flex items-center gap-2 text-sm">
        <ArrowBendDownRightIcon className="text-muted-foreground size-4" />
        <span>
          Encaminhei para <strong>{i.nome}</strong>
        </span>
        {onAbrir && (
          <Button size="sm" variant="link" className="ml-auto h-auto px-0" onClick={onAbrir}>
            Abrir chat <ArrowRightIcon />
          </Button>
        )}
      </div>
      <div className="text-muted-foreground text-xs">Pedido: {cartao.pedido}</div>
      {cartao.resposta && (
        <blockquote className="flex gap-2.5 border-l-2 pl-3" style={{ borderColor: i.cor }}>
          <Orb cor={i.cor} corOlhos={i.corOlhos} tamanho={22} extras={false} />
          <p className="text-sm">{cartao.resposta}</p>
        </blockquote>
      )}
    </div>
  )
}

/**
 * Passagem de trabalho entre integrantes (demonstração): o pedido sai do orb de
 * quem passa e chega ao de quem recebe, em ~1,6 s; depois fica o registro.
 * O tempo sai de `em`, então voltar à aba no meio mostra o ponto certo.
 */
function PassagemAnimada({ cartao, onAbrir, className }: { cartao: Por<'encaminhamento'> & { de: SetorIntegrante }; onAbrir?: () => void; className?: string }) {
  const { integrante } = useTema()
  const de = integrante(cartao.de)
  const para = integrante(cartao.para)
  const DUR = 1600
  const [agora, setAgora] = useState(Date.now())
  const inicio = cartao.em ?? 0
  const passando = agora < inicio + DUR
  useEffect(() => {
    if (!passando) return
    const id = window.setInterval(() => setAgora(Date.now()), 50)
    return () => window.clearInterval(id)
  }, [passando])
  const p = Math.max(0, Math.min(1, (agora - inicio) / DUR))
  const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2
  return (
    <div className={cn(casca, className)}>
      <div className="flex items-center gap-2">
        <Orb cor={de.cor} corOlhos={de.corOlhos} tamanho={26} estado="trabalhando" animado={passando} extras={false} cutucavel={false} />
        <div className="bg-sunken relative h-1 flex-1 rounded-full">
          <span className="bg-foreground/70 absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow" style={{ left: `${ease * 100}%`, opacity: passando ? 1 : 0, transition: 'opacity .3s' }} />
          <span className="bg-foreground/25 absolute inset-y-0 left-0 rounded-full" style={{ width: `${ease * 100}%` }} />
        </div>
        <Orb cor={para.cor} corOlhos={para.corOlhos} tamanho={26} estado={p >= 1 ? 'trabalhando' : 'disponivel'} animado={p > 0.85} extras={false} cutucavel={false} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="min-w-0 flex-1">
          {passando ? (
            <>
              Passando para <strong>{para.nome}</strong>…
            </>
          ) : (
            <>
              <strong>{de.nome}</strong> passou para <strong>{para.nome}</strong>
            </>
          )}
          <span className="text-muted-foreground block text-xs">{cartao.pedido}</span>
        </span>
        {!passando && onAbrir && (
          <Button size="sm" variant="link" className="h-auto shrink-0 px-0" onClick={onAbrir}>
            Abrir chat <ArrowRightIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

/** Tabela de resultado de consulta (M2), com "ver na aba". */
export function CartaoTabela({ cartao, onVerNaAba, className }: { cartao: Por<'tabela'>; onVerNaAba?: () => void; className?: string }) {
  return (
    <div className={cn('bg-card overflow-hidden rounded-xl border', className)}>
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <TableIcon className="text-muted-foreground size-4" />
        <span className="text-sm font-medium">{cartao.titulo}</span>
        {cartao.total != null && <Badge variant="secondary">{cartao.total}</Badge>}
        {onVerNaAba && (
          <Button size="sm" variant="link" className="ml-auto h-auto px-0" onClick={onVerNaAba}>
            Ver na aba <ArrowRightIcon />
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs">
              {cartao.colunas.map((c) => (
                <th key={c.chave} className={cn('px-4 py-2 font-medium', c.alinhamento === 'direita' ? 'text-right' : 'text-left')}>
                  {c.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {cartao.linhas.map((l, idx) => (
              <tr key={idx}>
                {cartao.colunas.map((c) => (
                  <td key={c.chave} className={cn('px-4 py-2', c.alinhamento === 'direita' && 'text-right tabular-nums')}>
                    {l[c.chave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Documento ou guia (02, 9.3): nome, competência, valor, vencimento, abrir. */
export function CartaoDocumento({ cartao, onAbrir, onBaixar, onVer, className }: { cartao: Por<'documento'>; onAbrir?: () => void; onBaixar?: () => void; /** Abre o documento no visualizador. */ onVer?: () => void; className?: string }) {
  const Icone = cartao.especie === 'guia' ? ReceiptIcon : FileTextIcon
  return (
    <div className={cn(casca, 'flex-row items-center gap-4', className)}>
      <span className="bg-sunken flex size-11 shrink-0 items-center justify-center rounded-[14px]">
        <Icone weight="duotone" className="text-muted-foreground size-6" />
      </span>
      <div className="min-w-0 flex-1">
        {onVer ? (
          <button type="button" onClick={onVer} className="block max-w-full cursor-pointer truncate text-left text-sm font-medium underline-offset-2 hover:underline">
            {cartao.nome}
          </button>
        ) : (
          <div className="truncate text-sm font-medium">{cartao.nome}</div>
        )}
        <div className="text-muted-foreground flex flex-wrap gap-x-3 text-xs">
          <span>competência {cartao.competencia}</span>
          {cartao.valor && <span className="text-foreground tabular-nums">{cartao.valor}</span>}
          {cartao.vencimento && <span>vence {cartao.vencimento}</span>}
          {cartao.pago != null && <Badge variant={cartao.pago ? 'sucesso' : 'outline'}>{cartao.pago ? 'paga' : 'não paga'}</Badge>}
        </div>
      </div>
      <span className="flex shrink-0 gap-1">
        {onVer && (
          <Button size="sm" variant="ghost" onClick={onVer}>
            Abrir
          </Button>
        )}
        {onBaixar && (
          <Button size="sm" variant="ghost" onClick={onBaixar}>
            Baixar
          </Button>
        )}
        {onAbrir && (
          <Button size="sm" variant="outline" onClick={onAbrir}>
            Enviar ao cliente
          </Button>
        )}
      </span>
    </div>
  )
}

const rotuloCrm = { aberta: 'aberta', aguardando: 'aguardando cliente', resolvida: 'resolvida' } as const

/** Conversa do CRM (subplano 04): cliente, pessoa, canal, status, abrir no CRM. */
export function CartaoConversaCrm({ cartao, onAbrir, className }: { cartao: Por<'conversa_crm'>; onAbrir?: () => void; className?: string }) {
  return (
    <div className={cn(casca, className)}>
      <div className="flex items-start gap-3">
        <span className="bg-sunken flex size-11 shrink-0 items-center justify-center rounded-[14px]">
          <ChatCircleTextIcon weight="duotone" className="text-muted-foreground size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{cartao.pessoa}</span>
            <Badge variant={cartao.status === 'aguardando' ? 'destaque' : cartao.status === 'resolvida' ? 'sucesso' : 'outline'}>{rotuloCrm[cartao.status]}</Badge>
          </div>
          <div className="text-muted-foreground text-xs">
            {cartao.cliente} · {cartao.canal}
          </div>
          <p className="bg-sunken mt-2 rounded-[12px] px-3 py-2 text-sm">“{cartao.ultima}”</p>
        </div>
      </div>
      {onAbrir && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={onAbrir}>
            Abrir no CRM <ArrowRightIcon />
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Passagem de trabalho entre integrantes de usuários diferentes (02, 8.4):
 * "Fiscal (de Fernanda) passou Sublimite da Padaria para DP (Ana Souza)".
 */
export function CartaoPassagem({ cartao, onAbrir, className }: { cartao: Por<'passagem'>; onAbrir?: () => void; className?: string }) {
  const { integrante } = useTema()
  const de = integrante(cartao.de.setor)
  const para = integrante(cartao.para.setor)
  return (
    <div className={cn('bg-surface flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[18px] px-4 py-3 text-sm shadow-contorno', className)}>
      <ArrowsLeftRightIcon className="text-muted-foreground size-4 shrink-0" />
      <span className="flex items-center gap-1.5">
        <Orb cor={de.cor} corOlhos={de.corOlhos} tamanho={18} extras={false} cutucavel={false} />
        <strong className="font-medium">{cartao.de.pessoa}</strong>
        <span className="text-muted-foreground">(de {cartao.de.dono})</span>
      </span>
      <span className="text-muted-foreground">passou</span>
      <strong className="font-medium">{cartao.assunto}</strong>
      <span className="text-muted-foreground">da {cartao.cliente} para</span>
      <span className="flex items-center gap-1.5">
        <Orb cor={para.cor} corOlhos={para.corOlhos} tamanho={18} extras={false} cutucavel={false} />
        <strong className="font-medium">{cartao.para.pessoa}</strong>
        <span className="text-muted-foreground">(de {cartao.para.dono})</span>
      </span>
      {onAbrir && (
        <Button size="sm" variant="link" className="ml-auto h-auto px-0" onClick={onAbrir}>
          Ver tarefa <ArrowRightIcon />
        </Button>
      )}
    </div>
  )
}

/** O integrante devolve a quem pediu (o Assistente) o resultado em uma frase (02, 9.1: a resposta como citação). */
export function CartaoRetorno({ cartao, className }: { cartao: Por<'retorno'>; className?: string }) {
  const { integrante } = useTema()
  const de = integrante(cartao.de)
  const geral = integrante('geral')
  return (
    <div className={cn('bg-sunken flex flex-col gap-1.5 rounded-[16px] px-4 py-3 text-sm', className)}>
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <ArrowBendDownRightIcon className="size-3.5 -scale-x-100" />
        {de.nome} devolveu ao {geral.nome}
      </span>
      <p className="leading-relaxed">“{cartao.texto}”</p>
    </div>
  )
}

export interface AcoesCartao {
  onDecidir?: (cartaoId: string, d: Decisao) => void
  onAbrirIntegrante?: (setor: Por<'encaminhamento'>['para']) => void
  onVerNaAba?: (cartaoId: string) => void
}

/** Escolhe o cartão certo pelo tipo. Sem ações de fora, usa os fluxos do escritório (abrir tarefa, CRM, enviar, aprovar com efeito). */
export function CartaoChat({ cartao, acoes }: { cartao: Cartao; acoes?: AcoesCartao }) {
  const fluxos = useFluxos()
  const docs = useDocumentos()
  const nav = useNavegacao()
  const loja = useLoja()
  const pedirIntegrante = usePedirIntegrante()
  const efeitos = useEfeitosCartao()
  const decidir = (id: string, d: Decisao) => (acoes?.onDecidir ? acoes.onDecidir(id, d) : efeitos(id, d))
  // Vitrine (o site): sem os destinos de fora do Início, os cartões não mostram botões que não levariam a lugar nenhum.
  const vitrine = !!nav.vitrine
  const leitura = nav.vitrine === 'leitura'
  switch (cartao.tipo) {
    case 'aprovacao':
      return <CartaoAprovacao cartao={cartao} semEditar={vitrine} onDecidir={(d) => decidir(cartao.id, d)} />
    case 'encaminhamento':
      if (leitura) return <CartaoEncaminhamento cartao={cartao} />
      return <CartaoEncaminhamento cartao={cartao} onAbrir={() => (acoes?.onAbrirIntegrante ? acoes.onAbrirIntegrante(cartao.para) : nav.irPara({ modulo: 'inicio', aba: 'time', integrante: integranteDoSetor(cartao.para) }))} />
    case 'tabela':
      return <CartaoTabela cartao={cartao} onVerNaAba={vitrine ? undefined : () => (acoes?.onVerNaAba ? acoes.onVerNaAba(cartao.id) : nav.irPara({ modulo: 'painel', aba: 'fiscal' }))} />
    case 'tarefa': {
      const atual = loja.tarefas.find((t) => t.id === cartao.tarefa.id) ?? cartao.tarefa
      if (vitrine) return <CartaoTarefa tarefa={atual} />
      return (
        <CartaoTarefa
          tarefa={atual}
          onAbrir={() => fluxos.abrirTarefa(atual.id)}
          onIniciar={() => {
            loja.atualizarTarefa(atual.id, { status: 'em_andamento' })
            loja.toast(`${atual.codigo} · ${atual.cliente}: iniciada.`)
          }}
          pedir={pedirIntegrante(atual)}
        />
      )
    }
    case 'aviso':
      return <AvisoIntegrante aviso={cartao.aviso} embutido idDecisao={cartao.id} onDecidir={(d) => decidir(cartao.id, d)} />
    case 'documento':
      if (vitrine) return <CartaoDocumento cartao={cartao} />
      return (
        <CartaoDocumento
          cartao={cartao}
          onVer={() => docs.abrir(cartao.nome, { clienteNome: cartao.cliente, origem: 'gerado_plataforma', por: 'integrante' })}
          onBaixar={() => fluxos.baixar(cartao.nome)}
          onAbrir={() =>
            fluxos.enviar({
              cliente: cartao.cliente,
              setor: cartao.especie === 'guia' ? 'fiscal' : clientePorNome(cartao.cliente) && cartao.nome.toLowerCase().includes('contrato') ? 'dp' : 'fiscal',
              texto: '',
              anexo: cartao.nome,
              assunto: cartao.nome,
            })
          }
        />
      )
    case 'conversa_crm': {
      const alvo = cartao.conversa ?? loja.conversas.find((c) => c.cliente === cartao.cliente && cartao.pessoa.startsWith(c.pessoa.nome))?.id
      return <CartaoConversaCrm cartao={cartao} onAbrir={vitrine ? undefined : () => nav.irPara({ modulo: 'crm', aba: 'conversas', conversa: alvo })} />
    }
    case 'trabalho': {
      const t = loja.estado.trabalhos.find((x) => x.uid === cartao.uid)
      if (!t) return null
      if (leitura) return <ProgressoTrabalho trabalho={t} />
      return (
        <button type="button" className="w-full cursor-pointer text-left" onClick={() => nav.irPara({ modulo: 'inicio', aba: 'time', integrante: t.integrante })} aria-label={`Abrir o chat de quem está fazendo: ${t.titulo}`}>
          <ProgressoTrabalho trabalho={t} />
        </button>
      )
    }
    case 'retorno':
      return <CartaoRetorno cartao={cartao} />
    case 'resposta_legal':
      return <CartaoRespostaLegal resposta={cartao.resposta} />
    case 'passagem':
      return <CartaoPassagem cartao={cartao} onAbrir={vitrine ? undefined : () => nav.irPara({ modulo: 'inicio', aba: 'time', integrante: integranteDoSetor(cartao.para.setor) })} />
  }
}
