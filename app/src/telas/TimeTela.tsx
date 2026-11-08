import { HourglassMediumIcon, PauseCircleIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { ProgressoTrabalho } from '@/components/compostos/progresso-trabalho'
import { fluxos, respostasProntas } from '@/dados/simulacao'
import { CabecalhoIntegrante, FilaIntegrante } from '@/components/compostos/cabecalho-integrante'
import { CampoChat } from '@/components/compostos/campo-chat'
import { ListaIntegrantes, ordenarIntegrantes } from '@/components/compostos/lista-integrantes'
import { NovoIntegrante } from '@/components/compostos/novo-integrante'
import { Button } from '@/components/ui/button'
import { EspelhoOrbs, Orb } from '@/components/ui/orb'
import type { Anexo, Integrante, Mensagem } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import { ListaMensagens } from './ListaMensagens'
import { agora, respostaDeExemplo } from './useConversa'

interface Props {
  nomeUsuario: string
  contexto: string
  integrantes: Integrante[]
  /** Id do integrante aberto. */
  selecionado: string
  onSelecionar: (id: string) => void
  /** Conversas por id do integrante. */
  conversas: Record<string, Mensagem[]>
  /** Porcentagem usada do limite de 5 horas do usuário. */
  limite?: { usado: number; renova: string }
  onVerNaAba?: () => void
}

/**
 * Aba Time do Início (Figma; 02, 9.2): um painel com a coluna de integrantes
 * à esquerda (no celular, faixa de orbs em cima) e o chat do selecionado.
 * Estados: sem histórico, pausado, limite atingido.
 */
export function TimeTela({ nomeUsuario, contexto, integrantes: iniciais, selecionado, onSelecionar, conversas, limite, onVerNaAba }: Props) {
  // Criados e pausados ficam na memória da sessão; o estado (trabalhando, precisa de você) vem de fora, ao vivo.
  const [novos, setNovos] = usePersistente<Integrante[]>('time.novos', [])
  const [pausados, setPausados] = usePersistente<string[]>('time.pausados', [])
  const integrantes = [...iniciais, ...novos].map((i) => (pausados.includes(i.id) ? { ...i, situacao: 'pausado' as const } : i))
  const [criando, setCriando] = useState(false)
  const atual = integrantes.find((i) => i.id === selecionado) ?? ordenarIntegrantes(integrantes).fixos[0] ?? integrantes[0]
  const limiteAtingido = !!limite && limite.usado >= 100

  const alternarPausa = (id: string) => setPausados((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]))

  const abrirPorSetor = (setor: Integrante['setor']) => {
    const alvo = integrantes.find((i) => i.setor === setor && i.tipo !== 'criado_pelo_usuario')
    if (alvo) onSelecionar(alvo.id)
  }

  return (
    <EspelhoOrbs aberto={atual.id} dormeVivo={(conversas[atual.id] ?? []).length === 0}>
      <div className="h-full px-2 pb-2 sm:px-4 sm:pb-4">
        <div className="bg-surface shadow-painel flex h-full overflow-hidden rounded-[24px] sm:rounded-[34px]">
          <ListaIntegrantes variante="coluna" className="hidden w-72 shrink-0 md:flex lg:w-80 2xl:w-[360px]" integrantes={integrantes} selecionado={atual.id} onSelecionar={(i) => onSelecionar(i.id)} onCriar={() => setCriando(true)} />
          {/* key: cada integrante tem histórico próprio; trocar remonta a conversa. */}
          <ChatIntegrante
            key={atual.id}
            integrante={atual}
            nomeUsuario={nomeUsuario}
            contexto={contexto}
            inicial={conversas[atual.id] ?? []}
            limite={limite}
            limiteAtingido={limiteAtingido}
            onPausar={() => alternarPausa(atual.id)}
            onAbrirIntegrante={abrirPorSetor}
            onVerNaAba={onVerNaAba}
            faixa={
              <ListaIntegrantes variante="icones" orientacao="horizontal" className="border-b px-3 py-2 md:hidden" integrantes={integrantes} selecionado={atual.id} onSelecionar={(i) => onSelecionar(i.id)} onCriar={() => setCriando(true)} />
            }
          />
        </div>
        <NovoIntegrante
          aberto={criando}
          onFechar={() => setCriando(false)}
          onAtivar={(novo) => {
            setNovos((xs) => [...xs, novo])
            onSelecionar(novo.id)
          }}
        />
      </div>
    </EspelhoOrbs>
  )
}

function ChatIntegrante({
  integrante,
  nomeUsuario,
  contexto,
  inicial,
  limite,
  limiteAtingido,
  onPausar,
  onAbrirIntegrante,
  onVerNaAba,
  faixa,
}: {
  integrante: Integrante
  nomeUsuario: string
  contexto: string
  inicial: Mensagem[]
  limite?: { usado: number; renova: string }
  limiteAtingido: boolean
  onPausar: () => void
  onAbrirIntegrante: (s: Integrante['setor']) => void
  onVerNaAba?: () => void
  faixa?: ReactNode
}) {
  const aparencia = useAparencia()
  const t = aparencia(integrante)
  // A conversa mora na loja: sair e voltar da aba mantém o que foi dito, e o trabalho simulado escreve aqui.
  const loja = useLoja()
  const mensagens = inicial
  const [pensando, setPensando] = useState(false)
  const trabalhos = loja.estado.trabalhos.filter((x) => x.situacao === 'rodando' && x.integrante === integrante.id)
  const enviar = (texto: string, anexos: Anexo[]) => {
    loja.mensagemTimeComId(integrante.id, { id: crypto.randomUUID(), autor: { tipo: 'usuario', nome: nomeUsuario }, hora: agora(), texto, anexos })
    // Pedido que é trabalho (as sugestões do integrante): ele começa a fazer, com etapas e aviso ao terminar.
    const fluxo = Object.values(fluxos).find((f) => f.integrante === integrante.id && f.gatilho?.test(texto))
    if (fluxo && !anexos.length) return loja.iniciarTrabalho(fluxo)
    const id = crypto.randomUUID()
    loja.mensagemTimeComId(integrante.id, { id, autor: { tipo: 'integrante', setor: integrante.setor, nome: integrante.nome, cor: integrante.cor }, hora: agora(), pendente: true })
    setPensando(true)
    const pronta = respostasProntas.find((r) => r.re.test(texto))
    window.setTimeout(() => {
      setPensando(false)
      loja.ajustarMensagemTime(integrante.id, id, { pendente: false, escrever: true, escreverDesde: Date.now(), hora: agora(), texto: !anexos.length && pronta ? pronta.texto : respostaDeExemplo(anexos) })
    }, 2200)
  }
  const pausado = integrante.situacao === 'pausado'

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Em tela estreita a coluna some; os integrantes viram uma faixa de orbs. */}
      {faixa}
      <div className="px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3 baixa:pt-3 baixa:pb-1">
        <CabecalhoIntegrante className="mx-auto max-w-3xl ultra:max-w-4xl" integrante={pensando ? { ...integrante, estado: 'pensando' } : integrante} contexto={contexto} limite={limite} onPausar={onPausar} />
      </div>

      {(pausado || limiteAtingido) && (
        <div className="px-4 sm:px-6">
          <div className="bg-sunken mx-auto flex max-w-3xl items-center gap-3 rounded-[16px] px-4 py-3 text-sm ultra:max-w-4xl">
            {limiteAtingido ? (
              <>
                <HourglassMediumIcon weight="duotone" className="text-destructive size-5 shrink-0" />
                <p className="flex-1">
                  <strong className="font-medium">Cheguei ao limite desta janela.</strong> O chat continua; os trabalhos automáticos esperam e voltam {limite?.renova}.
                </p>
              </>
            ) : (
              <>
                <PauseCircleIcon weight="duotone" className="text-muted-foreground size-5 shrink-0" />
                <p className="flex-1">
                  <strong className="font-medium">{t.nome} está pausado.</strong> Não roda jobs nem gatilhos; o chat responde.
                </p>
                <Button size="sm" variant="outline" onClick={onPausar}>
                  Retomar
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="area-rolagem-dupla flex-1 overflow-y-auto px-4 pt-4 sm:px-6">
        {mensagens.length === 0 ? <Vazio integrante={integrante} onPedir={(s) => enviar(s, [])} /> : <ListaMensagens className="mx-auto max-w-3xl pb-6 ultra:max-w-4xl" mensagens={mensagens} acoes={{ onAbrirIntegrante, onVerNaAba }} />}
        {trabalhos.map((x) => (
          <ProgressoTrabalho key={x.uid} trabalho={x} className="mx-auto mb-6 max-w-3xl ultra:max-w-4xl" />
        ))}
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3 sm:px-6 sm:pb-5">
        <FilaIntegrante className="mx-auto w-full max-w-3xl ultra:max-w-4xl" integrante={integrante} />
        <CampoChat className="mx-auto w-full max-w-3xl ultra:max-w-4xl" onEnviar={enviar} desabilitado={pensando} placeholder={`Escreva para ${t.nome}`} />
      </div>
    </div>
  )
}

/**
 * Integrante sem histórico: quem ele é, o que faz e sugestões de pedido. O orb
 * funciona como o do "No que posso ajudar?" (segue o cursor, reage ao clique)
 * e mostra o estado real: dorme só quando o integrante está em espera.
 */
function Vazio({ integrante, onPedir }: { integrante: Integrante; onPedir: (s: string) => void }) {
  const aparencia = useAparencia()
  const t = aparencia(integrante)
  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center gap-4 py-8 text-center">
      <Orb cor={t.cor} corOlhos={t.corOlhos} tamanho={72} estado={integrante.situacao === 'pausado' ? 'dormindo' : integrante.estado} animado vivo modo="follow" espelho={{ id: integrante.id, papel: 'grande' }} />
      <div>
        <h3 className="text-xl font-light">Ainda não conversamos.</h3>
        <p className="text-muted-foreground mt-1 text-sm">{integrante.funcao}.</p>
        {integrante.emObservacao && <p className="text-muted-foreground mt-1 text-xs">Em observação: nos primeiros 14 dias, o que ele faria sozinho vira cartão para você.</p>}
      </div>
      {integrante.sugestoes && (
        <div className="flex flex-wrap justify-center gap-2">
          {integrante.sugestoes.map((s) => (
            <button key={s} type="button" onClick={() => onPedir(s)} className="bg-raised hover:bg-sunken shadow-contorno cursor-pointer rounded-full px-3.5 py-1.5 text-xs transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
