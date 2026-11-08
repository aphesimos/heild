import { PauseCircleIcon, TimerIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { escritorio } from '@/dados/configuracoes'
import { useLoja } from './loja'
import { useSessao } from './sessao'

/** Evento do painel da demonstração para não esperar 3 minutos de verdade. */
export const EVENTO_SIMULAR_ESPERA = 'ui-lab:simular-espera'

const hora = (t: number) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

/**
 * Registro automático de tempo (Fundações 5.4; 05) e o modo de espera.
 * Só conta onde o trabalho vira sessão do Timesheet: Painel com um cliente
 * aberto e CRM. Início (o que a IA faz já é contado como sessão do integrante),
 * Painel na carteira, Timesheet, Financeiro e Configurações não contam e
 * nunca entram em espera. Sem ação por `inatividade_min`, a tela entra em
 * espera: não desloga, só para o contador no último evento. Mexer o mouse não
 * conta como ação; clique, tecla, rolagem e digitação contam.
 */
export function useRegistroTempo(conta: boolean, onde: string) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const ultima = useRef(Date.now())
  const [espera, setEspera] = useState<{ desde: number; onde: string } | null>(null)

  // Ao entrar numa tela que conta, o relógio recomeça; ao sair, a espera some.
  useEffect(() => {
    ultima.current = Date.now()
    if (!conta) setEspera(null)
  }, [conta, onde])

  useEffect(() => {
    if (!conta) return
    const acao = () => {
      if (!espera) ultima.current = Date.now()
    }
    const eventos = ['pointerdown', 'keydown', 'wheel', 'input'] as const
    eventos.forEach((e) => window.addEventListener(e, acao, { passive: true }))
    const relogio = window.setInterval(() => {
      if (!espera && Date.now() - ultima.current >= escritorio.inatividadeMin * 60_000) setEspera({ desde: ultima.current, onde })
    }, 5_000)
    const simular = () => {
      ultima.current = Date.now() - escritorio.inatividadeMin * 60_000
      setEspera({ desde: ultima.current, onde })
    }
    window.addEventListener(EVENTO_SIMULAR_ESPERA, simular)
    return () => {
      eventos.forEach((e) => window.removeEventListener(e, acao))
      window.clearInterval(relogio)
      window.removeEventListener(EVENTO_SIMULAR_ESPERA, simular)
    }
  }, [conta, onde, espera])

  useEffect(() => {
    if (espera) loja.registrar(usuario.nome, `Modo de espera em ${espera.onde}: tempo registrado até ${hora(espera.desde)} (último evento)`)
    // só no instante em que entra em espera
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [espera?.desde])

  const retomar = useCallback(() => {
    if (!espera) return
    loja.registrar(usuario.nome, `Voltou da espera em ${espera.onde}: nova sessão de tempo; o intervalo desde ${hora(espera.desde)} não conta`)
    ultima.current = Date.now()
    setEspera(null)
  }, [espera, loja, usuario.nome])

  return { conta, espera, retomar }
}

/** Selo no cabeçalho: só o ícone (o cabeçalho com todas as abas não tem folga); o texto vai na dica. */
export function SeloTempo({ conta, espera, onde }: { conta: boolean; espera: boolean; onde: string }) {
  if (!conta) return null
  const texto = espera ? 'Em espera: o tempo parou no último evento' : `Contando tempo no Timesheet (${onde}). Para depois de ${escritorio.inatividadeMin} min sem ação.`
  return (
    <Tooltip conteudo={texto}>
      <span role="img" aria-label={espera ? 'em espera' : 'contando tempo'} className="text-muted-foreground relative flex size-9 shrink-0 items-center justify-center">
        <TimerIcon className="size-5" weight="duotone" />
        {!espera && <span className="bg-success absolute top-2 right-2 size-1.5 rounded-full" />}
      </span>
    </Tooltip>
  )
}

/** Cobre só a área de trabalho (a barra lateral e o cabeçalho seguem usáveis). */
export function ModoEspera({ desde, onde, onRetomar }: { desde: number; onde: string; onRetomar: () => void }) {
  useEffect(() => {
    const tecla = () => onRetomar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onRetomar])
  return (
    <div role="dialog" aria-modal="false" aria-label="Modo de espera" onPointerDown={onRetomar} className="bg-background/70 absolute inset-0 z-20 flex cursor-pointer items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface shadow-painel flex max-w-sm flex-col items-center gap-3 rounded-[24px] p-6 text-center">
        <PauseCircleIcon className="text-muted-foreground size-10" weight="duotone" />
        <p className="text-2xl font-light tracking-tight">Em espera</p>
        <p className="text-muted-foreground text-sm">
          {escritorio.inatividadeMin} min sem ação em {onde}. O tempo foi registrado até {hora(desde)}, a última ação, e parou. Sua sessão continua aberta: nada foi fechado.
        </p>
        <Button className="rounded-full" onClick={onRetomar}>
          Continuar
        </Button>
        <p className="text-muted-foreground text-xs">Se trabalhou fora do sistema nesse intervalo (telefone, portal sem a extensão), confirme em Timesheet › Confirmações.</p>
      </div>
    </div>
  )
}
