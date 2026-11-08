import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CabecalhoSecao, Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Segmentado } from '@/components/ui/formulario'
import { atividadesAtendimento, coresEtiqueta, etiquetasCrm, respostasRapidas, rotuloSetor, type EtiquetaCrm, type RespostaRapida } from '@/dados/crm'
import { cn } from '@/lib/utils'
import type { SetorIntegrante } from '@/theme/tipos'

const opcoesSetor = [{ valor: '' as const, rotulo: 'Todos os setores' }, ...(Object.keys(rotuloSetor) as SetorIntegrante[]).map((s) => ({ valor: s, rotulo: rotuloSetor[s]! }))]

/** Etiquetas (04, 4.3): as de assunto organizam; as de tipo definem a atividade no timesheet. */
export function Etiquetas() {
  const [lista, setLista] = useState(etiquetasCrm)
  const [ed, setEd] = useState<EtiquetaCrm | null>(null)
  const salvar = (e: EtiquetaCrm) => {
    const n = { ...e, id: e.id || `e${Date.now()}` }
    setLista((xs) => (xs.some((x) => x.id === n.id) ? xs.map((x) => (x.id === n.id ? n : x)) : [...xs, n]))
    setEd(null)
  }
  const grupos: EtiquetaCrm['tipo'][] = ['assunto', 'tipo de atendimento']
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoSecao
        titulo="Etiquetas"
        descricao="De assunto, para organizar e filtrar; de tipo de atendimento, para contar o tempo na atividade certa do timesheet."
        acao={
          <Button size="sm" className="rounded-full" onClick={() => setEd({ id: '', nome: '', cor: coresEtiqueta[3], tipo: 'assunto' })}>
            <PlusIcon /> Nova etiqueta
          </Button>
        }
      />
      {grupos.map((g) => (
        <div key={g} className="flex flex-col gap-2">
          <h4 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{g === 'assunto' ? 'Assunto' : 'Tipo de atendimento'}</h4>
          <div className="flex flex-wrap gap-2">
            {lista
              .filter((e) => e.tipo === g)
              .map((e) => (
                <button key={e.id} type="button" onClick={() => setEd(e)} className="bg-sunken hover:bg-accent flex cursor-pointer items-center gap-2 rounded-full py-1 pr-3 pl-2 text-sm">
                  <span className="size-2.5 rounded-full" style={{ background: e.cor }} />#{e.nome}
                  <span className="text-muted-foreground text-[11px]">{e.atividade ?? (e.setor ? rotuloSetor[e.setor] : 'todos')}</span>
                </button>
              ))}
          </div>
        </div>
      ))}
      {ed && (
        <EditorEtiqueta
          key={ed.id || 'nova'}
          inicial={ed}
          existentes={lista}
          onFechar={() => setEd(null)}
          onSalvar={salvar}
          onExcluir={(id) => {
            setLista((xs) => xs.filter((x) => x.id !== id))
            setEd(null)
          }}
        />
      )}
    </div>
  )
}

function EditorEtiqueta({ inicial, existentes, onFechar, onSalvar, onExcluir }: { inicial: EtiquetaCrm; existentes: EtiquetaCrm[]; onFechar: () => void; onSalvar: (e: EtiquetaCrm) => void; onExcluir: (id: string) => void }) {
  const [e, setE] = useState(inicial)
  const repetida = existentes.some((x) => x.nome === e.nome.trim() && x.id !== e.id)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={inicial.id ? `#${inicial.nome}` : 'Nova etiqueta'}
      descricao="Etiqueta em uso não some das conversas antigas ao ser apagada; só deixa de ser oferecida."
      acao="Salvar"
      onAcao={() => onSalvar({ ...e, nome: e.nome.trim().toLowerCase(), atividade: e.tipo === 'tipo de atendimento' ? (e.atividade ?? 'GES-025') : undefined })}
      acaoDesabilitada={!e.nome.trim() || repetida}
      secundaria={
        inicial.id ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => onExcluir(e.id)}>
            <TrashIcon /> Apagar
          </Button>
        ) : undefined
      }
    >
      <Campo rotulo="Nome" erro={repetida ? 'Já existe.' : undefined}>
        {(id) => <CampoTexto id={id} valor={e.nome} onMudar={(v) => setE({ ...e, nome: v })} placeholder="ex.: parcelamento" />}
      </Campo>
      <Campo rotulo="Cor">
        {() => (
          <div className="flex gap-2" role="radiogroup" aria-label="Cor">
            {coresEtiqueta.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={e.cor === c}
                aria-label={c}
                onClick={() => setE({ ...e, cor: c })}
                className={cn('size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-[var(--popover)]', e.cor === c && 'ring-foreground ring-2')}
                style={{ background: c }}
              />
            ))}
          </div>
        )}
      </Campo>
      <Campo rotulo="Tipo">
        {() => (
          <Segmentado
            rotulo="Tipo"
            valor={e.tipo}
            onMudar={(v) => setE({ ...e, tipo: v })}
            opcoes={[
              { valor: 'assunto', rotulo: 'Assunto' },
              { valor: 'tipo de atendimento', rotulo: 'Tipo de atendimento' },
            ]}
          />
        )}
      </Campo>
      {e.tipo === 'tipo de atendimento' ? (
        <Campo rotulo="Atividade no timesheet" ajuda="O tempo da conversa com esta etiqueta conta nesta atividade.">
          {(id) => <CampoEscolha id={id} valor={e.atividade ?? 'GES-025'} onMudar={(v) => setE({ ...e, atividade: v })} opcoes={atividadesAtendimento.map((a) => ({ valor: a.id, rotulo: a.rotulo }))} />}
        </Campo>
      ) : (
        <Campo rotulo="Setor" ajuda="Só aparece para quem atende esse setor.">
          {(id) => <CampoEscolha id={id} valor={(e.setor ?? '') as SetorIntegrante | ''} onMudar={(v) => setE({ ...e, setor: v || undefined })} opcoes={opcoesSetor} />}
        </Campo>
      )}
    </GavetaFormulario>
  )
}

/** Respostas rápidas: lista interna, sem a Meta, com atalho "/" no campo da conversa. */
export function RespostasRapidas() {
  const [lista, setLista] = useState(respostasRapidas)
  const [ed, setEd] = useState<RespostaRapida | null>(null)
  const repetido = ed ? lista.some((x) => x.atalho === ed.atalho && x.id !== ed.id) : false
  return (
    <div className="flex flex-col gap-3">
      <CabecalhoSecao
        titulo="Respostas rápidas"
        descricao='Textos prontos que a equipe chama digitando "/" na conversa. Não passam pela Meta: valem só dentro da janela de 24 h.'
        acao={
          <Button size="sm" className="rounded-full" onClick={() => setEd({ id: '', atalho: '/', texto: '' })}>
            <PlusIcon /> Nova resposta
          </Button>
        }
      />
      <ul className="divide-border/70 flex flex-col divide-y">
        {lista.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => setEd(r)} className="hover:bg-sunken/60 flex w-full cursor-pointer gap-3 rounded-[12px] px-2 py-2.5 text-left text-sm">
              <code className="text-muted-foreground w-20 shrink-0">{r.atalho}</code>
              <span className="min-w-0 flex-1">{r.texto}</span>
              <span className="text-muted-foreground shrink-0 text-[11px]">{r.setor ? rotuloSetor[r.setor] : 'todos'}</span>
            </button>
          </li>
        ))}
      </ul>
      {ed && (
        <GavetaFormulario
          aberta
          onFechar={() => setEd(null)}
          titulo={ed.id ? ed.atalho : 'Nova resposta rápida'}
          acao="Salvar"
          acaoDesabilitada={ed.atalho.length < 2 || !ed.texto.trim() || repetido}
          onAcao={() => {
            const n = { ...ed, id: ed.id || `rr${Date.now()}` }
            setLista((xs) => (xs.some((x) => x.id === n.id) ? xs.map((x) => (x.id === n.id ? n : x)) : [...xs, n]))
            setEd(null)
          }}
          secundaria={
            ed.id ? (
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setLista((xs) => xs.filter((x) => x.id !== ed.id))
                  setEd(null)
                }}
              >
                <TrashIcon /> Apagar
              </Button>
            ) : undefined
          }
        >
          <Campo rotulo="Atalho" ajuda='Começa com "/", sem espaço.' erro={repetido ? 'Atalho já usado.' : undefined}>
            {(id) => <CampoTexto id={id} mono valor={ed.atalho} onMudar={(v) => setEd({ ...ed, atalho: '/' + v.replace(/^\/+/, '').replace(/\s/g, '').toLowerCase() })} />}
          </Campo>
          <Campo rotulo="Texto">{(id) => <CampoArea id={id} valor={ed.texto} onMudar={(v) => setEd({ ...ed, texto: v })} />}</Campo>
          <Campo rotulo="Setor">{(id) => <CampoEscolha id={id} valor={(ed.setor ?? '') as SetorIntegrante | ''} onMudar={(v) => setEd({ ...ed, setor: v || undefined })} opcoes={opcoesSetor} />}</Campo>
        </GavetaFormulario>
      )}
    </div>
  )
}
