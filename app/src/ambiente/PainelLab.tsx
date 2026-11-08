import { ArrowCounterClockwiseIcon, ClockIcon, DeviceMobileIcon, FlaskIcon, MonitorIcon, MoonIcon, PauseCircleIcon, SignOutIcon, SunIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { usePreferencia } from '@/hooks/usePreferencia'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CampoEscolha, TextoFixo } from '@/components/ui/formulario'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { escritorio, usuariosCfg } from '@/dados/configuracoes'
import { cn } from '@/lib/utils'
import { temas } from '@/theme/temas'
import type { ModoCor } from '@/theme/tipos'
import { pessoasDoApp } from '@/cliente/ClienteApp'
import * as exemplo from '@/dados/exemplo'
import { EVENTO_SIMULAR_ESPERA } from './espera'
import { EVENTO_SUPORTE_HORARIO } from './suporte'
import { useLoja } from './loja'
import { papelExibido, useSessaoBruta } from './sessao'

export type Visao = 'escritorio' | 'cliente'

/**
 * Controles do wireframe (não fazem parte do produto): trocar de conta sem
 * passar pelo login, alternar entre o painel do escritório e o app do
 * cliente, trocar o tema do escritório e o modo, e recomeçar a demonstração.
 */
export function PainelLab({
  temaId,
  onTema,
  modo,
  onModo,
  visao,
  onVisao,
  pessoaApp,
  onPessoaApp,
  onReiniciar,
}: {
  temaId: string
  onTema: (id: string) => void
  modo: ModoCor
  onModo: (m: ModoCor) => void
  visao: Visao
  onVisao: (v: Visao) => void
  pessoaApp: string | null
  onPessoaApp: (n: string | null) => void
  onReiniciar: () => void
}) {
  const sessao = useSessaoBruta()
  const loja = useLoja()
  const [aberto, setAberto] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const [foraHorario, setForaHorario] = useState(false)
  const ativas = usuariosCfg.filter((u) => u.situacao === 'ativo')
  // Fechada, a aba vira uma alça fina na borda (não cobre o sistema); Ctrl+Shift+D alterna.
  const [escondida, setEscondida] = usePreferencia('ui-lab:demonstracao-escondida', false)
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setEscondida((v) => !v)
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [setEscondida])
  if (escondida)
    return (
      <button
        type="button"
        aria-label="Mostrar controles da demonstração (Ctrl+Shift+D)"
        title="Controles da demonstração (Ctrl+Shift+D)"
        onClick={() => setEscondida(false)}
        className="bg-foreground fixed top-1/2 right-0 z-40 h-16 w-1.5 -translate-y-1/2 cursor-pointer rounded-l-full opacity-30 transition-all hover:w-3 hover:opacity-80"
      />
    )
  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <div className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 flex-col items-end opacity-70 hover:opacity-100">
        <button
          type="button"
          aria-label="Esconder a aba da demonstração"
          title="Esconder (Ctrl+Shift+D reabre)"
          onClick={() => {
            setAberto(false)
            setEscondida(true)
          }}
          className="bg-foreground text-background mb-px flex cursor-pointer items-center justify-center rounded-tl-[10px] px-1.5 py-1.5"
        >
          <XIcon className="size-3.5" weight="bold" />
        </button>
        <PopoverTrigger asChild>
          <button type="button" className="bg-foreground text-background flex cursor-pointer items-center gap-1.5 rounded-bl-[10px] px-1.5 py-3 text-xs font-medium shadow-lg [writing-mode:vertical-rl]">
            <FlaskIcon className="size-3.5" weight="bold" /> Demonstração
            {visao === 'cliente' ? ` · app${pessoaApp ? ` · ${pessoaApp.replace('Dra. ', '').split(' ')[0]}` : ''}` : sessao?.usuario ? ` · ${sessao.usuario.nome.split(' ')[0]}` : ''}
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="center" side="left" collisionPadding={12} className="flex max-h-[calc(100dvh-1.5rem)] w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-3 overflow-y-auto p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Controles do wireframe</p>
            <p className="text-muted-foreground text-xs">Não fazem parte do produto: servem para ver o escritório por vários ângulos. Ctrl+Shift+D esconde e mostra a aba.</p>
          </div>
          <Button size="icon-sm" variant="ghost" className="-mt-1 -mr-1 rounded-full" aria-label="Fechar" onClick={() => setAberto(false)}>
            <XIcon />
          </Button>
        </div>
        <div className="bg-sunken grid grid-cols-2 gap-1 rounded-full p-1 text-xs">
          {(
            [
              ['escritorio', 'Painel do escritório', MonitorIcon],
              ['cliente', 'App do cliente', DeviceMobileIcon],
            ] as const
          ).map(([v, r, I]) => (
            <button
              key={v}
              type="button"
              onClick={() => onVisao(v)}
              aria-pressed={visao === v}
              className={cn('flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 py-1.5', visao === v && 'bg-raised shadow-pilula font-medium')}
            >
              <I className="size-3.5" /> {r}
            </button>
          ))}
        </div>
        {visao === 'escritorio' && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Cenário do escritório</span>
            <div role="radiogroup" aria-label="Cenário do escritório" className="bg-sunken flex rounded-full p-0.5 text-xs">
              {(
                [
                  ['contabil_bpo', 'Contábil com BPO'],
                  ['bpo_puro', 'Só BPO'],
                ] as const
              ).map(([c, r]) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={loja.estado.cenario === c}
                  onClick={() => loja.definirCenario(c)}
                  className={cn('flex-1 cursor-pointer rounded-full px-3 py-1.5', loja.estado.cenario === c ? 'bg-raised shadow-pilula' : 'text-muted-foreground hover:text-foreground')}
                >
                  <TextoFixo ativo={loja.estado.cenario === c}>{r}</TextoFixo>
                </button>
              ))}
            </div>
          </div>
        )}
        {visao === 'escritorio' && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Entrar como</span>
            {ativas.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  sessao?.entrar(u.id)
                  setAberto(false)
                }}
                className={cn('hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-left', sessao?.usuario?.id === u.id && 'bg-sunken')}
              >
                <Avatar nome={u.nome} tamanho="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{u.nome}</span>
                  <span className="text-muted-foreground block truncate text-[11px]">{papelExibido(u)}</span>
                </span>
              </button>
            ))}
            {sessao?.usuario && (
              <button type="button" onClick={() => sessao.sair()} className="text-muted-foreground hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm">
                <SignOutIcon className="size-4" /> Voltar para a tela de login
              </button>
            )}
            {sessao?.usuario && (
              <button
                type="button"
                aria-pressed={foraHorario}
                onClick={() => {
                  const v = !foraHorario
                  setForaHorario(v)
                  window.dispatchEvent(new CustomEvent(EVENTO_SUPORTE_HORARIO, { detail: v }))
                }}
                className="text-muted-foreground hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-sm"
              >
                <ClockIcon className="size-4 shrink-0" /> Suporte da plataforma: {foraHorario ? 'fora do horário' : 'no horário'} (alternar)
              </button>
            )}
            {sessao?.usuario && (
              <button
                type="button"
                onClick={() => {
                  setAberto(false)
                  window.dispatchEvent(new Event(EVENTO_SIMULAR_ESPERA))
                }}
                className="text-muted-foreground hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-sm"
              >
                <PauseCircleIcon className="size-4 shrink-0" /> Simular {escritorio.inatividadeMin} min parado (só no Painel com cliente e no CRM)
              </button>
            )}
          </div>
        )}
        {visao === 'cliente' && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Entrar no app como (pessoas dos clientes com acesso)</span>
            {pessoasDoApp(loja.fichaDe).map((p) => (
              <button
                key={p.nome}
                type="button"
                onClick={() => {
                  onPessoaApp(p.nome)
                  setAberto(false)
                }}
                className={cn('hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-left', pessoaApp === p.nome && 'bg-sunken')}
              >
                <Avatar nome={p.nome} tamanho="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{p.nome}</span>
                  <span className="text-muted-foreground block truncate text-[11px]">{p.empresas.map((e) => `${exemplo.clientes.find((c) => c.id === e.clienteId)?.nome} · ${e.contato.papel}`).join(' / ')}</span>
                </span>
              </button>
            ))}
            {pessoaApp && (
              <button type="button" onClick={() => onPessoaApp(null)} className="text-muted-foreground hover:bg-sunken/70 flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm">
                <SignOutIcon className="size-4" /> Voltar para a entrada do app
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-xs">
            <span className="text-muted-foreground">Tema</span>
            <span className="min-w-0 flex-1">
              <CampoEscolha rotulo="Tema" valor={temaId} onMudar={onTema} opcoes={temas.map((t) => ({ valor: t.id, rotulo: t.nome_produto }))} />
            </span>
          </label>
          <button type="button" aria-label={modo === 'claro' ? 'Modo escuro' : 'Modo claro'} onClick={() => onModo(modo === 'claro' ? 'escuro' : 'claro')} className="bg-sunken cursor-pointer rounded-full p-1.5">
            {modo === 'claro' ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
          </button>
        </div>
        {!confirmar ? (
          <Button variant="outline" className="rounded-full" onClick={() => setConfirmar(true)}>
            <ArrowCounterClockwiseIcon /> Resetar o ambiente
          </Button>
        ) : (
          <div className="bg-sunken flex flex-col gap-2 rounded-[14px] p-3 text-sm">
            <p>Volta tudo à configuração original: mensagens, tarefas, avisos, fichas, serviços e notas emitidas; sai das contas do escritório e do app e volta ao tema padrão.</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                onClick={() => {
                  setConfirmar(false)
                  setAberto(false)
                  onReiniciar()
                }}
              >
                Resetar agora
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConfirmar(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
