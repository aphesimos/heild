import { useState, type CSSProperties, type ReactNode } from 'react'
import { Tooltip } from '@/components/ui/tooltip'
import { fmtH, min, rotuloConfianca, type Confianca, type SessaoTs } from '@/dados/timesheet'
import { cn } from '@/lib/utils'

/**
 * Codificação da confiança, igual em todo o Timesheet. Um tom só (a cor do
 * texto do tema) em degraus de intensidade, do mais certo ao menos certo, mais
 * textura na estimada e contorno tracejado no sem classificação: funciona em
 * qualquer tema de marca branca e não depende só de cor (daltonismo, impressão).
 */
export function estiloConfianca(c: Confianca): { className: string; style?: CSSProperties } {
  const tinta = (p: number) => `color-mix(in oklab, var(--foreground) ${p}%, transparent)`
  switch (c) {
    case 'automatica':
      return { className: '', style: { background: tinta(78) } }
    case 'confirmada':
      return { className: '', style: { background: tinta(48) } }
    case 'estimada':
      return { className: '', style: { background: `repeating-linear-gradient(135deg, ${tinta(30)} 0 4px, ${tinta(14)} 4px 8px)` } }
    case 'contestada':
      return { className: '', style: { background: `repeating-linear-gradient(135deg, color-mix(in oklab, var(--destructive) 55%, transparent) 0 4px, color-mix(in oklab, var(--destructive) 20%, transparent) 4px 8px)` } }
    default:
      return { className: 'border border-dashed', style: { borderColor: tinta(38), background: tinta(4) } }
  }
}

export function Amostra({ c, className }: { c: Confianca; className?: string }) {
  const e = estiloConfianca(c)
  return <span className={cn('inline-block size-3 shrink-0 rounded-[3px]', e.className, className)} style={e.style} aria-hidden />
}

export function Legenda({ itens, extra }: { itens: Confianca[]; extra?: ReactNode }) {
  return (
    <ul className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      {itens.map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <Amostra c={c} /> {rotuloConfianca[c]}
        </li>
      ))}
      {extra}
    </ul>
  )
}

/** Título do gráfico é a pergunta que ele responde (05, 8.1). */
export function Pergunta({ children, acao }: { children: ReactNode; acao?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center gap-2">
      <h3 className="min-w-0 flex-1 text-sm font-medium">{children}</h3>
      {acao}
    </header>
  )
}

/** Linha do dia: blocos por confiança sobre a régua de horas; o agente numa faixa à parte. */
export function LinhaDoDia({ sessoes, agente, onAbrir }: { sessoes: SessaoTs[]; agente?: { hora: string; minutos: number; cor: string; texto: string }[]; onAbrir?: (s: SessaoTs) => void }) {
  // A escala cobre as sessões e o trabalho dos integrantes: com filtro de cliente, o agente pode cair fora das sessões visíveis.
  const inicios = [...sessoes.map((s) => min(s.inicio)), ...(agente ?? []).map((a) => min(a.hora))]
  const fins = [...sessoes.map((s) => min(s.fim)), ...(agente ?? []).map((a) => min(a.hora) + a.minutos)]
  const ini = Math.floor(Math.min(...inicios) / 60)
  const fim = Math.max(ini + 1, Math.ceil(Math.max(...fins) / 60))
  const total = (fim - ini) * 60
  const pos = (h: string) => ((min(h) - ini * 60) / total) * 100
  const horas = Array.from({ length: fim - ini + 1 }, (_, i) => ini + i)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-11">
        {sessoes.map((s) => {
          const e = estiloConfianca(s.confianca)
          return (
            <Tooltip key={s.id} conteudo={`${s.inicio}–${s.fim} · ${s.atividade ? `${s.atividade} ${s.rotulo}` : s.rotulo}${s.cliente ? ` · ${s.cliente}` : ''} · ${rotuloConfianca[s.confianca]}`}>
              <button
                type="button"
                onClick={() => onAbrir?.(s)}
                aria-label={`${s.inicio} a ${s.fim}, ${s.rotulo}, ${rotuloConfianca[s.confianca]}`}
                className={cn('absolute inset-y-0 cursor-pointer rounded-[4px] transition-opacity hover:opacity-80', e.className, s.foraJornada && 'ring-warning ring-2 ring-inset')}
                style={{ ...e.style, left: `calc(${pos(s.inicio)}% + 1px)`, width: `calc(${pos(s.fim) - pos(s.inicio)}% - 2px)` }}
              />
            </Tooltip>
          )
        })}
      </div>
      {agente && agente.length > 0 && (
        <div className="relative h-3 overflow-hidden" aria-label="Trabalho dos integrantes (série separada)">
          {agente.map((a) => (
            <Tooltip key={a.hora} conteudo={`agente · ${a.hora} · ${a.texto} · ${a.minutos} min de máquina`}>
              <span className="absolute inset-y-0 rounded-full" style={{ left: `${pos(a.hora)}%`, width: `max(6px, ${(a.minutos / total) * 100}%)`, background: a.cor }} />
            </Tooltip>
          ))}
        </div>
      )}
      <div className="text-muted-foreground relative h-4 text-[11px] tabular-nums">
        {horas.map((h) => (
          <span key={h} className="absolute -translate-x-1/2" style={{ left: `${((h - ini) / (fim - ini)) * 100}%` }}>
            {String(h).padStart(2, '0')}
          </span>
        ))}
      </div>
    </div>
  )
}

type Pilha = { rotulo: string; partes: { c: Confianca; v: number }[] }

/** Barras verticais empilhadas por confiança (ex.: horas por dia). */
export function ColunasEmpilhadas({ dados, unidade = 'min', altura = 150, onClicar }: { dados: Pilha[]; unidade?: 'min' | 'h' | '%'; altura?: number; onClicar?: (rotulo: string) => void }) {
  const max = Math.max(...dados.map((d) => d.partes.reduce((s, p) => s + p.v, 0)))
  const fmt = (v: number) => (unidade === 'min' ? fmtH(v) : unidade === '%' ? `${Math.round(v)}%` : `${Math.round(v)} h`)
  return (
    <div className="flex items-end gap-3" style={{ height: altura + 36 }}>
      {dados.map((d) => {
        const tot = d.partes.reduce((s, p) => s + p.v, 0)
        return (
          <button key={d.rotulo} type="button" disabled={!onClicar} onClick={() => onClicar?.(d.rotulo)} className="group flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 disabled:cursor-default">
            <span className="text-muted-foreground text-[11px] tabular-nums">{fmt(tot)}</span>
            <Tooltip conteudo={d.partes.filter((p) => p.v).map((p) => `${rotuloConfianca[p.c]} ${fmt(p.v)}`).join(' · ')}>
              <span className="flex w-full max-w-12 flex-col-reverse gap-[2px]" style={{ height: (tot / max) * altura }}>
                {d.partes.map((p, i) => {
                  const e = estiloConfianca(p.c)
                  return p.v ? <span key={p.c} className={cn('w-full group-hover:opacity-85', e.className, i === d.partes.findLastIndex((x) => x.v) && 'rounded-t-[4px]')} style={{ ...e.style, height: `${(p.v / tot) * 100}%` }} /> : null
                })}
              </span>
            </Tooltip>
            <span className="text-muted-foreground text-[11px]">{d.rotulo}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Barras horizontais empilhadas por confiança, uma linha por pessoa. */
export function LinhasEmpilhadas({ dados, unidade = 'h' }: { dados: Pilha[]; unidade?: 'h' }) {
  const max = Math.max(...dados.map((d) => d.partes.reduce((s, p) => s + p.v, 0)))
  return (
    <ul className="flex flex-col gap-2.5">
      {dados.map((d) => {
        const tot = d.partes.reduce((s, p) => s + p.v, 0)
        return (
          <li key={d.rotulo} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-sm">
            <span className="truncate">{d.rotulo}</span>
            <Tooltip conteudo={d.partes.map((p) => `${rotuloConfianca[p.c]} ${p.v} ${unidade}`).join(' · ')}>
              <span className="flex h-4 gap-[2px]" style={{ width: `${(tot / max) * 100}%` }}>
                {d.partes.map((p, i) => {
                  const e = estiloConfianca(p.c)
                  return p.v ? <span key={p.c} className={cn(e.className, i === d.partes.length - 1 && 'rounded-r-[4px]')} style={{ ...e.style, width: `${(p.v / tot) * 100}%` }} /> : null
                })}
              </span>
            </Tooltip>
            <span className="text-right tabular-nums">
              {tot} {unidade}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Barras horizontais de uma série (os maiores + outros). */
export function Barras({ dados, unidade = 'h', destacar }: { dados: { nome: string; h: number }[]; unidade?: string; destacar?: string }) {
  const max = Math.max(...dados.map((d) => d.h))
  return (
    <ul className="flex flex-col gap-2">
      {dados.map((d) => (
        <li key={d.nome} className="grid grid-cols-[minmax(0,11rem)_1fr_3rem] items-center gap-3 text-sm">
          <span className={cn('truncate', d.nome === 'outros' || d.nome === 'Interno' ? 'text-muted-foreground' : '', destacar === d.nome && 'font-medium')}>{d.nome}</span>
          <Tooltip conteudo={`${d.nome}: ${d.h} ${unidade}`}>
            <span className="h-3 rounded-r-[4px]" style={{ width: `${(d.h / max) * 100}%`, background: `color-mix(in oklab, var(--foreground) ${destacar === d.nome ? 78 : d.nome === 'outros' || d.nome === 'Interno' ? 25 : 55}%, transparent)` }} />
          </Tooltip>
          <span className="text-right tabular-nums">
            {d.h} {unidade}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Barras divergentes de margem: prejuízo à esquerda, lucro à direita, ordenadas. */
export function Divergente({ dados, selecionado, onSelecionar }: { dados: { nome: string; valor: number; pct: number; detalhe: string }[]; selecionado?: string; onSelecionar?: (n: string) => void }) {
  const max = Math.max(...dados.map((d) => Math.abs(d.valor)))
  const brl = (v: number) => `${v < 0 ? '−' : '+'}R$ ${Math.abs(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
  return (
    <ul className="flex flex-col gap-1">
      {dados.map((d) => (
        <li key={d.nome}>
          <button type="button" onClick={() => onSelecionar?.(d.nome)} className={cn('grid w-full cursor-pointer grid-cols-[minmax(0,13rem)_1fr_1fr_minmax(0,9rem)] items-center gap-2 rounded-[10px] px-2 py-1.5 text-left text-sm', selecionado === d.nome ? 'bg-raised shadow-cartao' : 'hover:bg-sunken/60')}>
            <span className={cn('truncate', selecionado === d.nome && 'font-medium')}>{d.nome}</span>
            <span className="flex h-4 justify-end border-r" style={{ borderColor: 'color-mix(in oklab, var(--foreground) 35%, transparent)' }}>
              {d.valor < 0 && <span className="bg-destructive/75 h-full rounded-l-[4px]" style={{ width: `${(Math.abs(d.valor) / max) * 100}%` }} />}
            </span>
            <span className="flex h-4">{d.valor >= 0 && <span className="bg-success/75 h-full rounded-r-[4px]" style={{ width: `${(d.valor / max) * 100}%` }} />}</span>
            <span className="text-right text-xs tabular-nums">
              <span className={cn('font-medium', d.valor < 0 && 'text-destructive')}>
                {brl(d.valor)} ({d.pct > 0 ? '+' : d.pct < 0 ? '−' : ''}
                {Math.abs(d.pct)}%)
              </span>
              <span className="text-muted-foreground block truncate">{d.detalhe}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Linha de 12 meses com a linha do zero, marcos e cursor com o valor. */
export function Linha12({ valores, rotulos, marcos = [], sufixo = '%' }: { valores: number[]; rotulos: string[]; marcos?: { mes: number; texto: string }[]; sufixo?: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600
  const H = 160
  const pad = 16
  const lo = Math.min(0, ...valores)
  const hi = Math.max(0, ...valores)
  const x = (i: number) => pad + (i / (valores.length - 1)) * (W - pad * 2)
  const y = (v: number) => pad + ((hi - v) / (hi - lo || 1)) * (H - pad * 2)
  const pontos = valores.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full overflow-visible" onMouseLeave={() => setHover(null)} role="img" aria-label={`Margem mês a mês: ${valores.map((v, i) => `${rotulos[i]} ${v}${sufixo}`).join(', ')}`}>
        <line x1={pad} x2={W - pad} y1={y(0)} y2={y(0)} stroke="currentColor" className="text-muted-foreground" strokeOpacity={0.4} strokeDasharray="4 4" />
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={pad} y2={H - pad} stroke="currentColor" strokeOpacity={0.25} />}
        <polyline points={pontos} fill="none" stroke="var(--foreground)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {marcos.map((m) => (
          <circle key={m.mes} cx={x(m.mes)} cy={y(valores[m.mes])} r={5} fill="var(--warning)" stroke="var(--surface)" strokeWidth={2} />
        ))}
        {hover != null && <circle cx={x(hover)} cy={y(valores[hover])} r={5} fill="var(--foreground)" stroke="var(--surface)" strokeWidth={2} />}
        {valores.map((_, i) => (
          <rect key={i} x={x(i) - (W - pad * 2) / (valores.length - 1) / 2} y={0} width={(W - pad * 2) / (valores.length - 1)} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
      </svg>
      <div className="text-muted-foreground flex justify-between px-1 text-[11px]">
        {rotulos.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
      {hover != null && (
        <div className="bg-popover pointer-events-none absolute top-0 rounded-md border px-2 py-1 text-xs shadow-md" style={{ left: `min(calc(${(x(hover) / W) * 100}% + 8px), calc(100% - 9rem))` }}>
          <div className="font-medium tabular-nums">
            {rotulos[hover]}: {valores[hover] > 0 ? '+' : ''}
            {valores[hover]}
            {sufixo}
          </div>
          {marcos.find((m) => m.mes === hover) && <div className="text-muted-foreground">{marcos.find((m) => m.mes === hover)!.texto}</div>}
        </div>
      )}
    </div>
  )
}

/** Capacidade: registrada × disponível por pessoa, com a faixa saudável de 85 a 100%. */
export function Capacidade({ dados }: { dados: { nome: string; usadas: number; disponivel: number; ausencia: number }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {dados.map((d) => {
        const pct = Math.round((d.usadas / d.disponivel) * 100)
        const acima = pct > 100
        return (
          <li key={d.nome} className="grid grid-cols-[7.5rem_1fr_6.5rem] items-center gap-3 text-sm">
            <span className="truncate">{d.nome}</span>
            <span className="bg-sunken relative h-3 rounded-full">
              <span className="bg-success/20 absolute inset-y-0 rounded-sm" style={{ left: '85%', width: '15%' }} title="faixa de 85 a 100%" />
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: acima ? 'var(--warning)' : 'color-mix(in oklab, var(--foreground) 65%, transparent)' }} />
            </span>
            <span className="text-right text-xs tabular-nums">
              <span className={cn('font-medium', acima && 'text-warning')}>{pct}%</span>
              <span className="text-muted-foreground"> · {d.usadas}/{d.disponivel} h</span>
              {d.ausencia > 0 && <span className="text-muted-foreground block">−{d.ausencia} h de ausência</span>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
