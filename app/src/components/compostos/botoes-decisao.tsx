import { CheckIcon, PencilSimpleIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

/** Decisões do cartão de aprovação (Fundações 6.4: aprovado, recusado, editado_e_aprovado). */
export type Decisao = 'aprovar' | 'recusar' | 'editar_e_aprovar'

/**
 * Aprovar / Editar e aprovar / Recusar. Em produção os três chamam
 * `aprovacao.decidir` (02, 9.3); não há botão de cartão que chame outra coisa.
 */
export function BotoesDecisao({
  onDecidir,
  lote,
  semEditar,
  tamanho = 'sm',
}: {
  onDecidir?: (d: Decisao) => void
  /** Quantidade num cartão em lote ("Aprovar os 14"). */
  lote?: number
  semEditar?: boolean
  tamanho?: 'sm' | 'default'
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size={tamanho} onClick={() => onDecidir?.('aprovar')}>
        <CheckIcon weight="bold" /> {lote ? `Aprovar os ${lote}` : 'Aprovar'}
      </Button>
      {!semEditar && (
        <Button size={tamanho} variant="outline" onClick={() => onDecidir?.('editar_e_aprovar')}>
          <PencilSimpleIcon /> Editar e aprovar
        </Button>
      )}
      <Button size={tamanho} variant="ghost" onClick={() => onDecidir?.('recusar')}>
        <XIcon /> Recusar
      </Button>
    </div>
  )
}

export function ResultadoDecisao({ decisao }: { decisao: Decisao }) {
  const textos: Record<Decisao, string> = {
    aprovar: 'Aprovado por você agora',
    recusar: 'Recusado por você agora',
    editar_e_aprovar: 'Aberto para editar; aprova ao salvar',
  }
  return (
    // Ocupa a mesma altura da linha de botões que substitui e entra com um esmaecer: o cartão não pula.
    <div className="surgir text-muted-foreground flex min-h-8 items-center gap-1.5 text-xs">
      {decisao === 'aprovar' ? <CheckIcon className="text-success size-3.5" /> : decisao === 'recusar' ? <XIcon className="size-3.5" /> : <PencilSimpleIcon className="size-3.5" />}
      {textos[decisao]}
    </div>
  )
}
