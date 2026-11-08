import { ArrowRightIcon, CheckCircleIcon, QuestionIcon, InfoIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import type { Aviso } from '@/dados/tipos'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'
import { useLoja } from '@/ambiente/loja'
import { BotoesDecisao, ResultadoDecisao, type Decisao } from './botoes-decisao'

interface Props {
  aviso: Aviso
  onDecidir?: (d: Decisao) => void
  onAbrirChat?: () => void
  /** Dentro do chat do integrante: sem cabeçalho nem "abrir chat" (a mensagem já diz quem é). */
  embutido?: boolean
  /** Id do registro da decisão na loja (o cartão no chat): decidir aqui vale na contagem de pendentes e em toda tela. */
  idDecisao?: string
  className?: string
}

/**
 * Aviso do integrante com os três blocos: fiz, decisão, informação
 * (subplano 02, 3.2; Home, subplano 03, 4.1). Decidido some da Home; aqui
 * mostra o resultado para o laboratório.
 */
export function AvisoIntegrante({ aviso, onDecidir, onAbrirChat, embutido, idDecisao, className }: Props) {
  const { integrante } = useTema()
  const i = integrante(aviso.setor)
  const loja = useLoja()
  const [local, setDecidido] = useState<Decisao | null>(null)
  const decidido = (idDecisao ? (loja.estado.decisoes[idDecisao] as Decisao | undefined) : undefined) ?? local
  const pedeDecisao = !!aviso.decisao && !decidido

  return (
    <article data-cartao-pendente={pedeDecisao || undefined} className={cn('bg-card flex flex-col gap-3 rounded-xl border p-4', aviso.urgente && pedeDecisao && 'border-warning', className)}>
      {!embutido && (
        <header className="flex items-center gap-3">
          <Orb cor={i.cor} corOlhos={i.corOlhos} tamanho={32} estado={pedeDecisao ? 'precisa_de_voce' : decidido ? 'concluido' : 'disponivel'} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{i.nome}</div>
            <div className="text-muted-foreground text-xs">{aviso.quando}</div>
          </div>
          {aviso.urgente && pedeDecisao && <Badge variant="destaque">urgente</Badge>}
        </header>
      )}

      <div className="flex flex-col gap-2">
        {aviso.fiz && <Bloco icone={<CheckCircleIcon className="text-success" />} rotulo="Fiz" texto={aviso.fiz} />}
        {aviso.decisao && (
          <Bloco
            icone={<QuestionIcon className="text-warning" />}
            rotulo="Decisão"
            texto={aviso.decisao.texto}
            extra={aviso.decisao.expiraEm && !decidido ? <span className="text-muted-foreground text-xs">{aviso.decisao.expiraEm}</span> : undefined}
          />
        )}
        {aviso.informacao && <Bloco icone={<InfoIcon className="text-muted-foreground" />} rotulo="Informação" texto={aviso.informacao} />}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2">
        {aviso.decisao ? (
          decidido ? (
            <ResultadoDecisao decisao={decidido} />
          ) : (
            <BotoesDecisao
              lote={aviso.decisao.lote}
              onDecidir={(d) => {
                if (d !== 'editar_e_aprovar') setDecidido(d)
                onDecidir?.(d)
              }}
            />
          )
        ) : (
          <span />
        )}
        {!embutido && (
          <Button size="sm" variant="link" className="px-0" onClick={onAbrirChat}>
            Abrir chat <ArrowRightIcon />
          </Button>
        )}
      </footer>
    </article>
  )
}

function Bloco({ icone, rotulo, texto, extra }: { icone: ReactNode; rotulo: string; texto: string; extra?: ReactNode }) {
  return (
    <div className="flex gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0 [&_svg]:size-4">{icone}</span>
      <p className="min-w-0">
        <span className="font-medium">{rotulo}: </span>
        {texto} {extra}
      </p>
    </div>
  )
}
