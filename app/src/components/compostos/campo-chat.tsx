import { ArrowUp, FileText, Microphone, Plus, Stop, X } from '@phosphor-icons/react'
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import type { Anexo } from '@/dados/tipos'
import { useDitado } from '@/hooks/useDitado'
import { cn } from '@/lib/utils'

interface Props {
  onEnviar?: (texto: string, anexos: Anexo[]) => void
  placeholder?: string
  /** Contexto mostrado abaixo do campo (cliente selecionado). */
  contexto?: string
  desabilitado?: boolean
  autoFocus?: boolean
  /** Algo a mais à direita, antes do microfone (ex.: limite de uso em tela estreita). */
  acessorio?: ReactNode
  className?: string
}

function tamanhoLegivel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Campo do chat no formato do Figma: texto em cima; anexar à esquerda;
 * ditar e enviar à direita. O ditado escreve no campo, para a pessoa revisar
 * antes de enviar. Enter envia; Shift+Enter quebra linha.
 * A conversa por voz (botão de ondas do Figma) está no backlog.
 */
export function CampoChat({ onEnviar, placeholder = 'Escreva aqui', contexto, desabilitado, autoFocus, acessorio, className }: Props) {
  const [texto, setTexto] = useState('')
  const [anexos, setAnexos] = useState<Anexo[]>([])
  const arquivo = useRef<HTMLInputElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)

  const ajustarAltura = () => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  const ditado = useDitado((frase) => {
    setTexto((t) => (t ? `${t.trimEnd()} ${frase}` : frase))
    requestAnimationFrame(ajustarAltura)
  })

  const podeEnviar = !desabilitado && (texto.trim() !== '' || anexos.length > 0)

  const enviar = () => {
    if (!podeEnviar) return
    if (ditado.ouvindo) ditado.parar()
    onEnviar?.(texto.trim(), anexos)
    setTexto('')
    setAnexos([])
    if (area.current) area.current.style.height = ''
  }

  const teclas = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enviar()
    }
  }

  const dicaMic = !ditado.suportado ? 'Ditado não disponível neste navegador' : ditado.ouvindo ? 'Parar ditado' : 'Ditar'

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        className={cn(
          'bg-card flex flex-col gap-1 rounded-[22px] p-2 shadow-campo transition focus-within:ring-2 focus-within:ring-ring/40',
          ditado.ouvindo && 'ring-destructive/40 ring-2',
        )}
      >
        {anexos.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 px-1 pt-1">
            {anexos.map((a) => (
              <li key={a.id} className="bg-muted flex items-center gap-1.5 rounded-lg py-1 pr-1 pl-2 text-xs">
                <FileText className="text-muted-foreground size-3.5" />
                <span className="max-w-40 truncate">{a.nome}</span>
                {a.tamanho && <span className="text-muted-foreground">{a.tamanho}</span>}
                <button
                  type="button"
                  aria-label={`Remover ${a.nome}`}
                  onClick={() => setAnexos((xs) => xs.filter((x) => x.id !== a.id))}
                  className="hover:bg-background cursor-pointer rounded p-0.5"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <textarea
          ref={area}
          rows={1}
          value={texto}
          autoFocus={autoFocus}
          disabled={desabilitado}
          aria-label={placeholder}
          placeholder={ditado.ouvindo ? 'Ouvindo…' : placeholder}
          onChange={(e) => {
            setTexto(e.target.value)
            ajustarAltura()
          }}
          onKeyDown={teclas}
          className="placeholder:text-muted-foreground max-h-[200px] min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none"
        />
        {ditado.ouvindo && ditado.parcial && <p className="text-muted-foreground -mt-1 px-3 text-sm italic">{ditado.parcial}</p>}
        <div className="flex items-center justify-between gap-2">
          <input
            ref={arquivo}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              const novos = Array.from(e.target.files ?? []).map((f) => ({ id: `${f.name}-${f.size}-${f.lastModified}`, nome: f.name, tamanho: tamanhoLegivel(f.size) }))
              setAnexos((xs) => [...xs, ...novos.filter((n) => !xs.some((x) => x.id === n.id))])
              e.target.value = ''
            }}
          />
          <Tooltip conteudo="Anexar arquivo">
            <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="Anexar arquivo" onClick={() => arquivo.current?.click()} disabled={desabilitado}>
              <Plus weight="bold" />
            </Button>
          </Tooltip>
          <div className="flex min-w-0 items-center gap-1.5">
            {ditado.ouvindo && (
              <span className="text-destructive flex items-center gap-1.5 text-xs" aria-live="polite">
                <span className="bg-destructive size-2 animate-pulse rounded-full" /> ouvindo
              </span>
            )}
            {ditado.erro && !ditado.ouvindo && <span className="text-destructive truncate text-xs">{ditado.erro}</span>}
            {acessorio}
            <Tooltip conteudo={dicaMic}>
              <span>
                <Button
                  type="button"
                  variant={ditado.ouvindo ? 'destructive' : 'outline'}
                  size="icon-sm"
                  className="rounded-full"
                  aria-label={dicaMic}
                  aria-pressed={ditado.ouvindo}
                  disabled={desabilitado || !ditado.suportado}
                  onClick={ditado.ouvindo ? ditado.parar : ditado.iniciar}
                >
                  {ditado.ouvindo ? <Stop weight="fill" /> : <Microphone weight="regular" />}
                </Button>
              </span>
            </Tooltip>
            <Button type="button" size="icon-sm" className="rounded-full" aria-label="Enviar" disabled={!podeEnviar} onClick={enviar}>
              <ArrowUp weight="bold" />
            </Button>
          </div>
        </div>
      </div>
      {contexto && <p className="text-muted-foreground truncate px-2 text-center text-xs">{contexto}</p>}
    </div>
  )
}
