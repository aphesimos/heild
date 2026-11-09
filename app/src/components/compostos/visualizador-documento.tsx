import { CaretRightIcon, CopyIcon, DownloadSimpleIcon, EyeIcon, EyeSlashIcon, FolderOpenIcon, LockSimpleIcon, PaperPlaneTiltIcon, XIcon } from '@phosphor-icons/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { SiglaMarca } from '@/components/compostos/barra-lateral'
import { Button } from '@/components/ui/button'
import { conectorDe, pastaDoCliente, rotuloOrigem, rotuloTipoDoc, visivelAoCliente, type Documento } from '@/dados/arquivos'
import { rotuloTipoArmazenamento } from '@/dados/configuracoes'
import * as exemplo from '@/dados/exemplo'
import { cn } from '@/lib/utils'
import { useTema } from '@/theme/ThemeProvider'

/* ---------- A folha (pré-visualização, com a marca do tema) ---------- */

function Linhas({ n = 3, larguras = ['100%', '92%', '78%'] }: { n?: number; larguras?: string[] }) {
  return (
    <span className="flex flex-col gap-1.5">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="h-1.5 rounded bg-black/10" style={{ width: larguras[i % larguras.length] }} />
      ))}
    </span>
  )
}

function Tabela({ linhas }: { linhas: [string, string][] }) {
  return (
    <table className="w-full text-[11px]">
      <tbody>
        {linhas.map(([a, b]) => (
          <tr key={a} className="border-b border-black/10">
            <td className="py-1.5 pr-2 text-black/55">{a}</td>
            <td className="py-1.5 text-right font-medium tabular-nums">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Conteúdo resumido de cada tipo; o documento real é o PDF guardado no conector. */
function Conteudo({ d }: { d: Documento }) {
  const cliente = exemplo.clientes.find((c) => c.id === d.clienteId)
  const x = d.dados ?? {}
  switch (d.tipo) {
    case 'guia':
      return (
        <>
          <p className="text-[13px] font-semibold">
            {x.tributo ?? d.nome.split(' ')[0]} · competência {x.competencia ?? d.competencia}
          </p>
          <Tabela
            linhas={[
              ['Contribuinte', `${cliente?.nome ?? ''} · ${cliente?.documento ?? ''}`],
              ['Vencimento', x.vencimento ?? '—'],
              ['Valor principal', x.valor ?? '—'],
              ['Multa e juros', 'R$ 0,00'],
              ['Total a pagar', x.valor ?? '—'],
            ]}
          />
          <span className="mt-2 block h-9 w-full bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_4px,#000_4px_5px,transparent_5px_8px)] opacity-80" aria-label="código de barras" />
          <span className="font-mono text-[9px] text-black/55">85800000048 1 12300328202 6 61120260001 3 23456789000 1</span>
        </>
      )
    case 'holerite':
    case 'folha':
      return (
        <>
          <p className="text-[13px] font-semibold">
            {d.tipo === 'holerite' ? 'Recibos de pagamento' : 'Folha de pagamento'} · {d.competencia ?? '10/2026'}
          </p>
          <Tabela
            linhas={[
              ['Empregados', x.empregados ?? '—'],
              ['Proventos', 'conforme recibos'],
              ['INSS segurados', 'retido'],
              ['FGTS do mês', 'na guia FGTS Digital'],
            ]}
          />
          <Linhas n={6} />
        </>
      )
    case 'balancete':
      return (
        <>
          <p className="text-[13px] font-semibold">Balancete de verificação · {d.competencia}</p>
          <Tabela
            linhas={[
              ['1 Ativo', 'R$ 2.412.880,00'],
              ['2 Passivo', 'R$ 1.180.340,00'],
              ['3 Receitas', 'R$ 1.284.300,00'],
              ['4 Custos e despesas', 'R$ 1.166.100,00'],
              ['Resultado', 'R$ 118.200,00'],
            ]}
          />
        </>
      )
    case 'contrato':
      return (
        <>
          <p className="text-[13px] font-semibold">{d.nome.replace(/\.\w+$/, '')}</p>
          <p className="text-[11px] text-black/60">Partes: {x.partes ?? cliente?.nome}</p>
          <Linhas n={9} larguras={['100%', '96%', '99%', '88%', '100%', '72%']} />
          <span className="mt-6 flex justify-between text-[10px] text-black/50">
            <span className="w-2/5 border-t border-black/30 pt-1">Contratante</span>
            <span className="w-2/5 border-t border-black/30 pt-1">Contratada</span>
          </span>
        </>
      )
    case 'xml':
      return (
        <pre className="overflow-hidden font-mono text-[9.5px] leading-relaxed text-black/70">{`<nfeProc versao="4.00">\n  <NFe>\n    <infNFe Id="NFe3526...">\n      <emit><CNPJ>${(cliente?.documento ?? '').replace(/\D/g, '')}</CNPJ></emit>\n      <det nItem="1">...</det>\n      <total><ICMSTot><vNF>...</vNF></ICMSTot></total>\n    </infNFe>\n  </NFe>\n</nfeProc>`}</pre>
      )
    default:
      return (
        <>
          <p className="text-[13px] font-semibold">{d.nome.replace(/\.\w+$/, '')}</p>
          <Linhas n={8} larguras={['100%', '90%', '97%', '70%']} />
        </>
      )
  }
}

/**
 * A folha do documento, sempre clara como papel, com o cabeçalho do tema do
 * escritório (marca branca): é o mesmo arquivo de qualquer menção no sistema.
 */
export function PaginaDocumento({ d, className }: { d: Documento; className?: string }) {
  const { tema } = useTema()
  const cliente = exemplo.clientes.find((c) => c.id === d.clienteId)
  return (
    <div className={cn('mx-auto flex aspect-[1/1.414] w-full max-w-[560px] flex-col gap-3 bg-white p-[7%] text-black shadow-[0_1px_2px_rgba(0,0,0,.12),0_12px_32px_-12px_rgba(0,0,0,.35)]', className)}>
      <header className="flex items-center gap-2 border-b border-black/10 pb-2">
        <span className="font-heading text-lg leading-none font-semibold tracking-tighter">{tema.sigla}</span>
        <span className="text-[11px] text-black/60">{tema.nome_produto}</span>
        <span className="ml-auto text-right text-[10px] text-black/50">
          {cliente ? cliente.nome : 'Documento do escritório'}
          {d.competencia && <span className="block">{d.competencia}</span>}
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <Conteudo d={d} />
      </div>
      <footer className="flex justify-between border-t border-black/10 pt-1.5 font-mono text-[8.5px] text-black/45">
        <span>SHA-256 {d.hash}…</span>
        <span>v{d.versao}</span>
      </footer>
    </div>
  )
}

/* ---------- O visualizador ---------- */

export interface AcoesVisualizador {
  onBaixar: () => void
  onEnviar?: () => void
  onAbrirPasta: (caminho: string[]) => void
  onForcarVisivel?: (v: boolean | undefined) => void
  onCopiarLink: () => void
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-2 text-sm">
      <dt className="text-muted-foreground text-xs leading-5">{rotulo}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  )
}

/** Abre o documento dentro da marca do escritório (nunca na interface do Drive ou do servidor). */
export function VisualizadorDocumento({ d, onFechar, acoes }: { d: Documento; onFechar: () => void; acoes: AcoesVisualizador }) {
  const { tema } = useTema()
  const conector = conectorDe(d.conector)
  const visivel = visivelAoCliente(d)
  const raiz = pastaDoCliente(d.clienteId)
  const trilha = [raiz, ...d.pasta]
  return (
    <DialogPrimitive.Root open onOpenChange={(v) => !v && onFechar()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/45" />
        <DialogPrimitive.Content aria-describedby={undefined} className="bg-background text-foreground fixed inset-2 z-[60] flex flex-col overflow-hidden rounded-[24px] shadow-2xl outline-none sm:inset-6 lg:inset-x-[6vw]">
          <header className="flex shrink-0 items-center gap-2 border-b px-3 py-2 sm:px-4">
            <SiglaMarca />
            <span className="hidden text-sm font-medium sm:block">{tema.nome_produto}</span>
            <span className="text-muted-foreground hidden text-sm sm:block">· Documentos</span>
            <DialogPrimitive.Title className="ml-2 min-w-0 flex-1 truncate text-sm font-medium sm:text-base">{d.nome}</DialogPrimitive.Title>
            <Button size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex" onClick={acoes.onCopiarLink}>
              <CopyIcon /> Copiar link
            </Button>
            <Button size="sm" variant="outline" className="rounded-full" onClick={acoes.onBaixar}>
              <DownloadSimpleIcon /> Baixar
            </Button>
            {acoes.onEnviar && d.clienteId && (
              <Button size="sm" className="rounded-full" onClick={acoes.onEnviar}>
                <PaperPlaneTiltIcon /> Enviar ao cliente
              </Button>
            )}
            <DialogPrimitive.Close asChild>
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Fechar">
                <XIcon />
              </Button>
            </DialogPrimitive.Close>
          </header>
          <nav aria-label="Pasta do documento" className="text-muted-foreground flex shrink-0 items-center gap-1 overflow-x-auto px-4 py-2 text-xs">
            <FolderOpenIcon className="size-4 shrink-0" />
            {trilha.map((p, i) => (
              <span key={i} className="flex shrink-0 items-center gap-1">
                {i > 0 && <CaretRightIcon className="size-3" />}
                <button type="button" className="hover:text-foreground cursor-pointer underline-offset-2 hover:underline" onClick={() => acoes.onAbrirPasta(d.pasta.slice(0, i))}>
                  {p}
                </button>
              </span>
            ))}
          </nav>
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="bg-sunken/60 area-rolagem-dupla min-h-0 overflow-y-auto p-4 sm:p-8">
              <PaginaDocumento d={d} />
            </div>
            <aside className="area-rolagem-dupla flex min-h-0 flex-col gap-4 overflow-y-auto border-t p-4 lg:border-t-0 lg:border-l">
              <dl className="flex flex-col gap-2">
                <Linha rotulo="Tipo">{rotuloTipoDoc[d.tipo]}</Linha>
                {d.competencia && <Linha rotulo="Competência">{d.competencia}</Linha>}
                <Linha rotulo="Origem">
                  {rotuloOrigem[d.origem]} · {d.por}
                </Linha>
                <Linha rotulo="Quando">{d.quando}</Linha>
                <Linha rotulo="Tamanho">{d.tamanho}</Linha>
                <Linha rotulo="Guardado em">
                  {conector ? `${conector.nome} (${rotuloTipoArmazenamento[conector.tipo]})` : d.conector}
                  {conector?.situacao === 'somente_leitura' && (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <LockSimpleIcon className="size-3" /> somente leitura: espelhado, não muda por aqui
                    </span>
                  )}
                </Linha>
                <Linha rotulo="Versão">v{d.versao}</Linha>
                <Linha rotulo="Impressão digital">
                  <code className="text-xs">{d.hash}</code>
                </Linha>
              </dl>
              {d.clienteId && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">No app do cliente</h3>
                  <p className="flex items-center gap-2 text-sm">
                    {visivel ? <EyeIcon className="text-success size-4" /> : <EyeSlashIcon className="text-muted-foreground size-4" />}
                    {visivel ? 'Visível' : 'Oculto'}
                    <span className="text-muted-foreground text-xs">{d.forcarVisivel !== undefined ? '· forçado neste arquivo' : '· pela pasta'}</span>
                  </p>
                  {acoes.onForcarVisivel && conector?.situacao !== 'somente_leitura' && (
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => acoes.onForcarVisivel?.(!visivel)}>
                        {visivel ? 'Ocultar este arquivo' : 'Mostrar este arquivo'}
                      </Button>
                      {d.forcarVisivel !== undefined && (
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => acoes.onForcarVisivel?.(undefined)}>
                          Voltar ao da pasta
                        </Button>
                      )}
                    </div>
                  )}
                </section>
              )}
              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Registro de entrega</h3>
                {(d.entregas ?? []).length === 0 && <p className="text-muted-foreground text-sm">Ainda não foi entregue nem aberto pelo cliente.</p>}
                <ol className="flex flex-col gap-1.5">
                  {(d.entregas ?? []).map((e, i) => (
                    <li key={i} className="text-sm">
                      {e.quem} · {e.acao} <span className="text-muted-foreground text-xs">· {e.quando}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
