import { FileTextIcon, ListChecksIcon, ChatCircleIcon, TableIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { BlocoTarefas } from '@/components/compostos/bloco-tarefas'
import { CampoChat } from '@/components/compostos/campo-chat'
import { ListaIntegrantes } from '@/components/compostos/lista-integrantes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Integrante, Mensagem, Tarefa } from '@/dados/tipos'
import { useTema } from '@/theme/ThemeProvider'
import { ListaMensagens } from './ListaMensagens'
import { useConversa } from './useConversa'

interface Props {
  /** Módulo (Painel, CRM...). */
  titulo: string
  /** Aba interna ativa, por extenso. As abas em si ficam no cabeçalho. */
  aba?: string
  /** Nome do cliente selecionado; ausente = carteira. */
  cliente?: string
  /** Tarefas do setor da aba; quando vier, mostra o bloco fixo (03, 2.4). */
  tarefas?: Tarefa[]
  /** Gaveta do chat (03, 2.5). */
  chat?: { nomeUsuario: string; conversaGeral: Mensagem[]; integrantes: Integrante[]; onAbrirIntegrante?: (s: Integrante['setor']) => void }
  children?: ReactNode
}

/**
 * Esqueleto genérico de módulo: conteúdo da aba, bloco de tarefas quando é aba
 * de setor, gaveta do chat no canto. As abas internas ficam no cabeçalho.
 * O conteúdo de cada aba é desenhado depois; aqui ficam os lugares (03, seção 5).
 */
export function ModuloTela({ titulo, aba, cliente, tarefas, chat, children }: Props) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="area-rolagem flex-1 overflow-y-auto px-3 py-4 sm:px-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 ultra:max-w-[1600px]">
          <header>
            <h1 className="text-3xl font-light tracking-tight">{aba ?? titulo}</h1>
            <p className="text-muted-foreground text-sm">
              {titulo} · {cliente ?? 'Carteira'}
            </p>
          </header>
          {children ?? (
            <div className="grid gap-4 md:grid-cols-3">
              <Lugar icone={<TableIcon />} titulo="Dados da aba" texto="Perfil do cliente e capturas" />
              <Lugar icone={<ListChecksIcon />} titulo="Pendências do setor" texto="O que está aguardando e de quem" />
              <Lugar icone={<FileTextIcon />} titulo="Documentos da aba" texto="Índice único de documentos" />
            </div>
          )}
          {tarefas && <BlocoTarefas className="bg-surface rounded-[24px]" setor={aba ?? titulo} cliente={cliente} tarefas={tarefas} />}
        </div>
      </div>
      {chat && <GavetaChat {...chat} contexto={cliente ?? 'Carteira'} />}
    </div>
  )
}

function Lugar({ icone, titulo, texto }: { icone: ReactNode; titulo: string; texto: string }) {
  return (
    <div className="border-foreground/15 bg-surface/60 flex min-h-32 flex-col gap-2 rounded-[24px] border border-dashed p-5">
      <span className="text-muted-foreground [&_svg]:size-5">{icone}</span>
      <span className="text-sm font-medium">{titulo}</span>
      <span className="text-muted-foreground text-xs">{texto}</span>
    </div>
  )
}

const AUTOR_GERAL = { setor: 'geral' as const }

/** Gaveta do chat: abre sempre no Geral; integrantes em ícones à direita (03, 2.5). */
export function GavetaChat({ nomeUsuario, conversaGeral, integrantes, onAbrirIntegrante, contexto }: NonNullable<Props['chat']> & { contexto: string }) {
  const { integrante } = useTema()
  const geral = integrante('geral')
  const { mensagens, enviar, pensando } = useConversa(AUTOR_GERAL, conversaGeral, nomeUsuario)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="absolute right-4 bottom-4 rounded-full shadow-lg sm:right-6 sm:bottom-6" size="lg">
          <ChatCircleIcon /> Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{geral.nome}</SheetTitle>
          <SheetDescription>contexto: {contexto}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <ListaMensagens mensagens={mensagens} acoes={{ onAbrirIntegrante }} />
            </div>
            <CampoChat className="p-3" onEnviar={enviar} desabilitado={pensando} />
          </div>
          <div className="border-l px-2 py-4">
            <ListaIntegrantes variante="icones" integrantes={integrantes} selecionado={integrantes[0]?.id} onSelecionar={(i) => i.setor !== 'geral' && onAbrirIntegrante?.(i.setor)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
