import { ArrowSquareOutIcon, CalculatorIcon, ScalesIcon, SealCheckIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import type { RespostaLegal } from '@/dados/tipos'
import { cn } from '@/lib/utils'

const tomGrau = { alto: 'sucesso', médio: 'destaque', baixo: 'erro' } as const

/**
 * Resposta com base legal no modelo de `legal.consultar` (07, 3.2; Plano do
 * Assistente, Camada 2, passo 5): a resposta direta vem no texto da mensagem;
 * aqui ficam o fundamento (cada afirmação ligada ao trecho e à vigência), os
 * trechos citados (cartão de citação, 02, 9.3), o cálculo com a origem dos
 * números, divergências, ressalvas e o grau de segurança, com a data
 * considerada e a versão da base.
 */
export function CartaoRespostaLegal({ resposta: r, className }: { resposta: RespostaLegal; className?: string }) {
  const trecho = (id?: string) => r.trechos.find((t) => t.id === id)
  return (
    <div className={cn('bg-card flex flex-col gap-4 rounded-xl border p-4 text-sm', className)}>
      <Secao titulo="Fundamento" icone={<ScalesIcon />}>
        <ol className="flex flex-col gap-2">
          {r.afirmacoes.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground w-4 shrink-0 text-right tabular-nums">{i + 1}.</span>
              <span className="min-w-0 flex-1">
                {a.texto}{' '}
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {a.calculo ? '(cálculo abaixo)' : `(${trecho(a.trecho)?.norma ?? ''})`}
                  {a.grau !== 'alto' && ` · grau ${a.grau}`}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao titulo="Trechos citados" icone={<SealCheckIcon />}>
        <div className="flex flex-col gap-2">
          {r.trechos.map((t) => (
            <figure key={t.id} className="bg-sunken flex flex-col gap-1.5 rounded-[12px] px-3 py-2.5">
              <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <strong className="font-medium">{t.norma}</strong>
                <span className="text-muted-foreground text-xs">
                  {t.hierarquia} · vigente desde {t.vigenteDe}
                  {t.vigenteAte ? ` até ${t.vigenteAte}` : ''}
                </span>
              </figcaption>
              <blockquote className="text-foreground/85 leading-relaxed">“{t.redacao}”</blockquote>
              <a href={t.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-xs underline-offset-4 hover:underline">
                ver no Planalto <ArrowSquareOutIcon className="size-3" />
              </a>
            </figure>
          ))}
        </div>
      </Secao>

      {r.calculo && (
        <Secao titulo="Cálculo" icone={<CalculatorIcon />}>
          <div className="bg-sunken flex flex-col gap-2 rounded-[12px] px-3 py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-muted-foreground text-xs">{r.calculo.titulo}</span>
              <strong className="text-base font-semibold tabular-nums">{r.calculo.resultado}</strong>
            </div>
            <p className="text-muted-foreground text-xs">{r.calculo.formula}</p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs">
              {r.calculo.linhas.map(([rotulo, valor]) => (
                <div key={rotulo} className="contents">
                  <dt className="text-muted-foreground">{rotulo}</dt>
                  <dd className="text-right font-medium tabular-nums">{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="text-muted-foreground border-t pt-1.5 text-[11px]">Origem dos números: {r.calculo.origem}</p>
          </div>
        </Secao>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Secao titulo="Divergências">
          <p className="text-muted-foreground">{r.divergencias.length ? r.divergencias.join(' ') : 'Nenhuma entre as fontes consultadas.'}</p>
        </Secao>
        {r.lacunas && r.lacunas.length > 0 && (
          <Secao titulo="Ressalvas">
            <p className="text-muted-foreground">{r.lacunas.join(' ')}</p>
          </Secao>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t pt-3 text-xs">
        <Badge variant={tomGrau[r.grau]}>Grau de segurança: {r.grau}</Badge>
        <span className="text-muted-foreground">
          Data considerada: {r.dataConsiderada}
          {r.dataInferida ? ' (suposta; mude se for outra)' : ''}
        </span>
        <span className="text-muted-foreground">Base legal: versão {r.versaoBase}</span>
      </div>
    </div>
  )
}

function Secao({ titulo, icone, children }: { titulo: string; icone?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium [&_svg]:size-3.5">
        {icone}
        {titulo}
      </h4>
      {children}
    </section>
  )
}
