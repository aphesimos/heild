import { CaretDownIcon, LifebuoyIcon, QuestionIcon, ScalesIcon, SparkleIcon } from '@phosphor-icons/react'
import { useLoja } from '@/ambiente/loja'
import { pedidosAssistente, respostasProntas } from '@/dados/simulacao'
import type { Anexo } from '@/dados/tipos'
import { abrirSuporte } from '@/ambiente/suporte'
import { useState } from 'react'
import { GavetaFormulario } from '@/components/ui/formulario'
import { AvisoCompacto } from '@/components/compostos/aviso-compacto'
import { BarraConversa } from '@/components/compostos/barra-conversa'
import { CampoChat } from '@/components/compostos/campo-chat'
import type { AcoesCartao } from '@/components/compostos/cartoes-chat'
import { BotaoLimiteUso } from '@/components/compostos/limite-uso'
import { Button } from '@/components/ui/button'
import { Orb, GrupoOrbs } from '@/components/ui/orb'
import { Tooltip } from '@/components/ui/tooltip'
import type { Aviso, Integrante, LimiteUso } from '@/dados/tipos'
import { useMedia } from '@/hooks/useMedia'
import { useTema } from '@/theme/ThemeProvider'
import { cn } from '@/lib/utils'
import { ListaMensagens } from './ListaMensagens'
import { mensagensComTime, pedirAoTime } from './pedidoAoTime'
import type { useHistorico } from './useHistorico'

interface Props {
  contexto: string
  /** Conversas do cliente atual (estado guardado na Plataforma). */
  conversa: ReturnType<typeof useHistorico>
  sugestoes: string[]
  avisos: Aviso[]
  limites: LimiteUso[]
  plano?: string
  onAbrirIntegrante?: (setor: Integrante['setor']) => void
  onVerAvisos?: () => void
  onVerNaAba?: () => void
  /** Só estes pedidos prontos (textos de `pedidosAssistente`); sem a lista, todos. A landing usa para mostrar os da plataforma. */
  pedidos?: string[]
}

/**
 * Aba Assistente do Início: o chat Geral grande (Figma; 02, 9.1).
 * Em cima, a barra da conversa (histórico do cliente, temporária, limpar, nova).
 * Vazio: "No que posso ajudar?" com o orb que segue o cursor, sugestões e os
 * avisos básicos. No pé, o campo; limite de uso e ajuda ficam na barra de ações do campo.
 */
export function AssistenteTela({ contexto, conversa, sugestoes, avisos, limites, plano, onAbrirIntegrante, onVerAvisos, onVerNaAba, pedidos: soEstes }: Props) {
  const pedidosVisiveis = soEstes ? pedidosAssistente.filter((p) => soEstes.includes(p.texto)) : pedidosAssistente
  const [ajuda, setAjuda] = useState(false)
  // Na demonstração os pedidos de fluxo são muitos: começam recolhidos atrás de "Abrir sugestões".
  const [abertas, setAbertas] = useState(false)
  const { integrante } = useTema()
  const geral = integrante('geral')
  const largo = useMedia('(min-width: 640px)')
  const { atual, historico, enviar: enviarBase, pensando, abrir, criar, limpar } = conversa
  const loja = useLoja()
  // O que o time escreve aqui enquanto faz o pedido (trabalho, retorno, passagens, fechamento) mora na loja.
  const doTime = loja.estado.assistente[atual.id]
  const mensagens = mensagensComTime(atual.mensagens, doTime)
  // Pedido ao time (demonstração): o Assistente divide, passa aos integrantes, acompanha cada parte aqui e fecha com o resultado.
  const enviar = (texto: string, anexos: Anexo[]) => {
    const pedido = pedidosAssistente.find((p) => p.texto.toLowerCase() === texto.trim().toLowerCase())
    const pronta = respostasProntas.find((r) => r.re.test(texto))
    if (pedido) {
      pedirAoTime(pedido, atual.id, enviarBase, loja)
      return
    }
    enviarBase(texto, anexos, !anexos.length && pronta ? { texto: pronta.texto } : undefined)
  }
  const vazia = mensagens.length === 0
  const acoes: AcoesCartao = { onAbrirIntegrante, onVerNaAba }

  return (
    <div className="flex h-full flex-col">
      <BarraConversa className="mx-auto w-full max-w-3xl px-3 pb-1 sm:px-5 ultra:max-w-4xl" atual={atual} historico={historico} contexto={contexto} onAbrir={abrir} onNova={criar} onLimpar={limpar} />
      <div className="area-rolagem-dupla flex-1 overflow-y-auto px-3 sm:px-5">
        {vazia ? (
          <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-6 py-8 sm:gap-8 baixa:gap-4 baixa:py-4">
            <h1 className="text-muted-foreground flex items-center gap-3 text-center text-3xl font-light tracking-tight sm:gap-4 sm:text-4xl lg:text-5xl baixa:lg:text-4xl">
              No que posso ajudar?
              {/* Orb principal: segue o cursor e reage ao clique. */}
              <Orb cor={geral.cor} corOlhos={geral.corOlhos} reacao="idle" tamanho={largo ? 64 : 48} modo="follow" animado vivo />
            </h1>
            <div className="flex flex-wrap justify-center gap-2">
              {sugestoes.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  data-extra={i >= 2 || undefined}
                  onClick={() => enviar(s, [])}
                  className="bg-surface hover:bg-raised cursor-pointer rounded-full px-3.5 py-1.5 text-xs shadow-contorno transition-colors data-extra:max-sm:hidden baixa:data-extra:hidden"
                >
                  {s}
                </button>
              ))}
            </div>
            {pedidosVisiveis.length > 0 && (
              <button
                type="button"
                aria-expanded={abertas}
                aria-controls="sugestoes-fluxos"
                onClick={() => setAbertas((v) => !v)}
                className="text-muted-foreground hover:text-foreground -my-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors"
              >
                {abertas ? 'Fechar sugestões' : 'Abrir sugestões'}
                <CaretDownIcon className={cn('size-3.5 transition-transform duration-300', abertas && 'rotate-180')} />
              </button>
            )}
            <div id="sugestoes-fluxos" inert={!abertas} aria-hidden={!abertas} className={cn('grid w-full max-w-xl transition-[grid-template-rows,opacity] duration-300 ease-out', abertas ? 'grid-rows-[1fr] opacity-100' : '-mt-6 grid-rows-[0fr] opacity-0 sm:-mt-8')}>
            <div className="flex min-h-0 flex-col items-center gap-2 overflow-hidden">
              <span className="text-muted-foreground text-xs">Peça ao time (o pedido vira trabalho entre os integrantes)</span>
              <div className="flex flex-wrap justify-center gap-2">
                {pedidosVisiveis
                  .filter((p) => !p.juridico)
                  .map((p, i) => (
                    <button
                      key={p.texto}
                      type="button"
                      data-extra={i >= 2 || undefined}
                      onClick={() => enviar(p.texto, [])}
                      className="bg-surface hover:bg-raised flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs shadow-contorno transition-colors data-extra:max-sm:hidden baixa:data-extra:hidden"
                    >
                      <SparkleIcon className="size-3.5" /> {p.texto}
                    </button>
                  ))}
              </div>
              {pedidosVisiveis.some((p) => p.juridico) && <span className="text-muted-foreground mt-1 text-xs">Pergunte sobre a lei (resposta com fundamento e citação)</span>}
              <div className="flex flex-wrap justify-center gap-2">
                {pedidosVisiveis
                  .filter((p) => p.juridico)
                  .map((p) => (
                    <button
                      key={p.texto}
                      type="button"
                      onClick={() => enviar(p.texto, [])}
                      className="bg-surface hover:bg-raised flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs shadow-contorno transition-colors"
                    >
                      <ScalesIcon className="size-3.5" /> {p.texto}
                    </button>
                  ))}
              </div>
            </div>
            </div>
            {avisos.length > 0 && (
              <section className="flex w-full max-w-xl flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-muted-foreground text-xs">Avisos do time</h2>
                  <button type="button" onClick={onVerAvisos} className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-4 hover:underline">
                    ver na Visão geral
                  </button>
                </div>
                <GrupoOrbs divergente={avisos.slice(0, 3).some((a) => a.decisao)}>
                  {avisos.slice(0, 3).map((a, i) => (
                    <AvisoCompacto key={a.id} aviso={a} className={i > 0 ? 'baixa:hidden' : undefined} onAbrir={() => onAbrirIntegrante?.(a.setor)} />
                  ))}
                </GrupoOrbs>
              </section>
            )}
          </div>
        ) : (
          <ListaMensagens className="mx-auto max-w-3xl pt-6 pb-8 ultra:max-w-4xl" mensagens={mensagens} acoes={acoes} />
        )}
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-1.5 px-3 pb-3 sm:px-5 sm:pb-5 ultra:max-w-4xl">
        <div className="relative">
          <CampoChat
            onEnviar={enviar}
            desabilitado={pensando}
            placeholder={`Pergunte ao ${geral.nome} ou peça uma ação`}
            // Abaixo de 1024px não há margem: limite e ajuda entram na barra do campo.
            acessorio={
              <span className="flex items-center gap-1.5 lg:hidden">
                <BotaoLimiteUso limites={limites} plano={plano} />
                <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="Ajuda" onClick={() => setAjuda(true)}>
                  <QuestionIcon />
                </Button>
              </span>
            }
          />
          {/* Na margem, centrados na altura do campo, os dois no mesmo tamanho e peso. */}
          <div className="absolute inset-y-0 left-full ml-3 hidden flex-col items-center justify-center gap-2 lg:flex">
            <BotaoLimiteUso limites={limites} plano={plano} className="bg-card shadow-campo hover:bg-raised size-10" tamanhoAnel={22} />
            <Tooltip conteudo="Ajuda" lado="left">
              <Button type="button" variant="ghost" size="icon" className="bg-card shadow-campo hover:bg-raised size-10 rounded-full" aria-label="Ajuda" onClick={() => setAjuda(true)}>
                <QuestionIcon className="size-6" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <p className="text-foreground truncate px-2 text-center text-xs">contexto: {contexto}</p>
      </div>
      {ajuda && (
        <GavetaFormulario
          aberta
          onFechar={() => setAjuda(false)}
          titulo="Como usar o Assistente"
          descricao="Ele responde pela carteira ou pelo cliente do seletor e chama o integrante certo para fazer."
          acao="Entendi"
          onAcao={() => setAjuda(false)}
          secundaria={
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                setAjuda(false)
                abrirSuporte()
              }}
            >
              <LifebuoyIcon /> Suporte da plataforma
            </Button>
          }
        >
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm">
            <li>Pergunte em português: “quem ainda não mandou o extrato?”, “o que vence esta semana na Padaria?”.</li>
            <li>Peça uma ação: o pedido vai ao integrante do setor, que prepara e devolve um cartão para você aprovar.</li>
            <li>Transmitir, pagar e assinar sempre passam por uma pessoa.</li>
            <li>Cada cliente tem a própria conversa; “Nova conversa” começa do zero, “Limpar” apaga esta.</li>
            <li>Atalhos: Ctrl+B abre e fecha a barra lateral; Enter envia; Shift+Enter quebra a linha.</li>
          </ul>
        </GavetaFormulario>
      )}
    </div>
  )
}
