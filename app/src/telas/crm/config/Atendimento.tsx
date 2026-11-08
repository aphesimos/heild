import { PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CabecalhoSecao, Campo, CampoArea, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Interruptor } from '@/components/ui/formulario'
import { diasSemana, equipeCrm, feriados as feriadosIniciais, horarios as horariosIniciais, mensagensAutomaticas, regrasSla, rotuloSetor, type HorarioSetor, type MensagemAutomatica, type RegraSla } from '@/dados/crm'
import type { SetorIntegrante } from '@/theme/tipos'

/** "seg a sex" quando os dias são seguidos; senão, a lista. */
const resumoDias = (d: string[]) => {
  const idx = d.map((x) => diasSemana.indexOf(x as (typeof diasSemana)[number]))
  const seguidos = idx.length > 2 && idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)
  return seguidos ? `${d[0]} a ${d[d.length - 1]}` : d.join(', ')
}

/** Horário de atendimento por setor, feriados e plantão (04, 4.5). */
export function Horario() {
  const [horarios, setHorarios] = usePersistente('crm.cfg.atend.horarios', horariosIniciais)
  const [feriados, setFeriados] = usePersistente('crm.cfg.atend.feriados', feriadosIniciais)
  const [ed, setEd] = useState<HorarioSetor | null>(null)
  const [novoFeriado, setNovoFeriado] = useState<{ data: string; nome: string } | null>(null)
  const semHorario = (Object.keys(rotuloSetor) as SetorIntegrante[]).filter((s) => !horarios.some((h) => h.setor === s))

  return (
    <div className="flex flex-col gap-5">
      <CabecalhoSecao titulo="Horário de atendimento" descricao="Por setor. Fora do horário sai a mensagem automática, o integrante responde o que é status e o prazo de resposta só começa na abertura." />
      <ul className="divide-border/70 flex flex-col divide-y">
        {horarios.map((h) => (
          <li key={h.setor}>
            <button type="button" onClick={() => setEd(h)} className="hover:bg-sunken/60 flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-[12px] px-2 py-2.5 text-left text-sm">
              <span className="w-40 font-medium">{rotuloSetor[h.setor]}</span>
              <span>
                {resumoDias(h.dias)} · {h.inicio} às {h.fim}
                {h.intervalo && (
                  <span className="text-muted-foreground">
                    {' '}
                    · intervalo {h.intervalo[0]} às {h.intervalo[1]}
                  </span>
                )}
              </span>
              {h.plantao && <Badge variant="outline">plantão: {h.plantao}</Badge>}
              <PencilSimpleIcon className="text-muted-foreground ml-auto size-4" />
            </button>
          </li>
        ))}
        {semHorario.length > 0 && <li className="text-muted-foreground px-2 py-2.5 text-xs">{semHorario.map((s) => rotuloSetor[s]).join(', ')}: seguem o horário do Gestão e Atendimento.</li>}
      </ul>

      <div className="flex flex-col gap-2">
        <CabecalhoSecao
          titulo="Feriados"
          descricao="No dia, sai a mensagem de feriado com a data de volta."
          acao={
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setNovoFeriado({ data: '', nome: '' })}>
              <PlusIcon /> Feriado
            </Button>
          }
        />
        <ul className="flex flex-wrap gap-2">
          {feriados.map((f) => (
            <li key={f.data} className="bg-sunken flex items-center gap-2 rounded-full py-1 pr-1 pl-3 text-sm">
              <span className="tabular-nums">{f.data}</span> {f.nome}
              <Button size="icon-sm" variant="ghost" className="size-6 rounded-full" aria-label={`Tirar ${f.nome}`} onClick={() => setFeriados((xs) => xs.filter((x) => x.data !== f.data))}>
                <TrashIcon className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {ed && (
        <GavetaFormulario
          aberta
          onFechar={() => setEd(null)}
          titulo={`Horário · ${rotuloSetor[ed.setor]}`}
          acao="Salvar"
          acaoDesabilitada={!ed.dias.length || ed.inicio >= ed.fim}
          onAcao={() => {
            setHorarios((xs) => xs.map((x) => (x.setor === ed.setor ? ed : x)))
            setEd(null)
          }}
        >
          <Campo rotulo="Dias">{() => <Fichas rotulo="Dias" valores={ed.dias} onMudar={(v) => setEd({ ...ed, dias: diasSemana.filter((d) => v.includes(d)) })} opcoes={diasSemana.map((d) => ({ valor: d, rotulo: d }))} />}</Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Abre">{(id) => <CampoTexto id={id} tipo="time" valor={ed.inicio} onMudar={(v) => setEd({ ...ed, inicio: v })} />}</Campo>
            <Campo rotulo="Fecha" erro={ed.inicio >= ed.fim ? 'Fecha antes de abrir.' : undefined}>
              {(id) => <CampoTexto id={id} tipo="time" valor={ed.fim} onMudar={(v) => setEd({ ...ed, fim: v })} />}
            </Campo>
          </div>
          <Interruptor ligado={!!ed.intervalo} onMudar={(v) => setEd({ ...ed, intervalo: v ? ['12:00', '13:00'] : undefined })} rotulo="Intervalo de almoço" detalhe="O prazo de resposta pausa no intervalo." />
          {ed.intervalo && (
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="De">{(id) => <CampoTexto id={id} tipo="time" valor={ed.intervalo![0]} onMudar={(v) => setEd({ ...ed, intervalo: [v, ed.intervalo![1]] })} />}</Campo>
              <Campo rotulo="Até">{(id) => <CampoTexto id={id} tipo="time" valor={ed.intervalo![1]} onMudar={(v) => setEd({ ...ed, intervalo: [ed.intervalo![0], v] })} />}</Campo>
            </div>
          )}
          <Interruptor
            ligado={!!ed.plantao}
            onMudar={(v) => setEd({ ...ed, plantao: v ? equipeCrm.find((p) => p.setores.includes(ed.setor))?.nome : undefined })}
            rotulo="Plantão fora do horário"
            detalhe='Uma pessoa recebe alerta urgente para conversas com etiqueta urgente (ex.: "intimação").'
          />
          {ed.plantao && (
            <Campo rotulo="Quem fica de plantão">
              {(id) => <CampoEscolha id={id} valor={ed.plantao!} onMudar={(v) => setEd({ ...ed, plantao: v })} opcoes={equipeCrm.filter((p) => p.setores.includes(ed.setor)).map((p) => ({ valor: p.nome, rotulo: p.nome }))} />}
            </Campo>
          )}
        </GavetaFormulario>
      )}
      {novoFeriado && (
        <GavetaFormulario
          aberta
          onFechar={() => setNovoFeriado(null)}
          titulo="Novo feriado"
          descricao="Vale para todos os setores. Feriados nacionais já vêm do calendário do escritório."
          acao="Adicionar"
          acaoDesabilitada={!/^\d{2}\/\d{2}$/.test(novoFeriado.data) || !novoFeriado.nome.trim()}
          onAcao={() => {
            setFeriados((xs) => [...xs, novoFeriado].sort((a, b) => a.data.split('/').reverse().join().localeCompare(b.data.split('/').reverse().join())))
            setNovoFeriado(null)
          }}
        >
          <Campo rotulo="Data" ajuda="dd/mm">
            {(id) => <CampoTexto id={id} valor={novoFeriado.data} onMudar={(v) => setNovoFeriado({ ...novoFeriado, data: v.replace(/[^\d/]/g, '').slice(0, 5) })} placeholder="15/11" />}
          </Campo>
          <Campo rotulo="Nome">{(id) => <CampoTexto id={id} valor={novoFeriado.nome} onMudar={(v) => setNovoFeriado({ ...novoFeriado, nome: v })} placeholder="Aniversário da cidade" />}</Campo>
        </GavetaFormulario>
      )}
    </div>
  )
}

const fmtMin = (m: number) => (m < 60 ? `${m} min` : `${m / 60} h`)

/** Prazos de resposta (SLA) por setor e por etiqueta (04, 4.6). */
export function Sla() {
  const [regras, setRegras] = usePersistente('crm.cfg.atend.regras', regrasSla)
  const [ed, setEd] = useState<RegraSla | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <CabecalhoSecao
        titulo="Prazos de resposta (SLA)"
        descricao="Ordenam a caixa e avisam quando estouram. Correm só no horário do setor e pausam em “aguardando cliente”."
        acao={
          <Button size="sm" className="rounded-full" onClick={() => setEd({ id: '', onde: 'Etiqueta #', respostaMin: 30, resolucaoDias: 1, tipo: 'etiqueta' })}>
            <PlusIcon /> Regra por etiqueta
          </Button>
        }
      />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-left text-xs">
            <th className="pb-2 font-medium">Onde</th>
            <th className="pb-2 font-medium">Primeira resposta</th>
            <th className="pb-2 font-medium">Resolução</th>
            <th />
          </tr>
        </thead>
        <tbody className="divide-border/70 divide-y">
          {regras.map((r) => (
            <tr key={r.id} className="hover:bg-sunken/60 cursor-pointer" onClick={() => setEd(r)}>
              <td className="py-2.5 pr-3">{r.onde}</td>
              <td className="py-2.5 pr-3 tabular-nums">{fmtMin(r.respostaMin)}</td>
              <td className="py-2.5 pr-3 tabular-nums">{r.resolucaoDias == null ? 'etapa do funil' : `${r.resolucaoDias} ${r.resolucaoDias === 1 ? 'dia útil' : 'dias úteis'}`}</td>
              <td className="py-2.5 text-right">
                <PencilSimpleIcon className="text-muted-foreground ml-auto size-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ed && (
        <GavetaFormulario
          aberta
          onFechar={() => setEd(null)}
          titulo={ed.id ? ed.onde : 'Nova regra por etiqueta'}
          descricao="Etiqueta com prazo próprio vence o do setor quando for mais curta."
          acao="Salvar"
          acaoDesabilitada={ed.respostaMin < 5 || (ed.tipo === 'etiqueta' && ed.onde.trim().length < 11)}
          onAcao={() => {
            const n = { ...ed, id: ed.id || `s${Date.now()}` }
            setRegras((xs) => (xs.some((x) => x.id === n.id) ? xs.map((x) => (x.id === n.id ? n : x)) : [...xs, n]))
            setEd(null)
          }}
          secundaria={
            ed.id && ed.tipo === 'etiqueta' ? (
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setRegras((xs) => xs.filter((x) => x.id !== ed.id))
                  setEd(null)
                }}
              >
                <TrashIcon /> Apagar
              </Button>
            ) : undefined
          }
        >
          {ed.tipo === 'etiqueta' && <Campo rotulo="Etiqueta">{(id) => <CampoTexto id={id} valor={ed.onde} onMudar={(v) => setEd({ ...ed, onde: v.startsWith('Etiqueta #') ? v : 'Etiqueta #' })} />}</Campo>}
          <Campo rotulo="Primeira resposta humana" ajuda="Em minutos úteis. A resposta do integrante não conta.">
            {(id) => <CampoTexto id={id} tipo="number" min={5} valor={String(ed.respostaMin)} onMudar={(v) => setEd({ ...ed, respostaMin: Number(v) || 0 })} />}
          </Campo>
          {ed.resolucaoDias != null && (
            <Campo rotulo="Resolução" ajuda="Em dias úteis, descontando o tempo aguardando o cliente.">
              {(id) => <CampoTexto id={id} tipo="number" min={1} valor={String(ed.resolucaoDias)} onMudar={(v) => setEd({ ...ed, resolucaoDias: Math.max(1, Number(v) || 1) })} />}
            </Campo>
          )}
        </GavetaFormulario>
      )}
    </div>
  )
}

/** Mensagens automáticas (04, 4.5): textos do tema por momento, liga/desliga e a espera. */
export function MensagensAutomaticas() {
  const [lista, setLista] = usePersistente('crm.cfg.atend.lista', mensagensAutomaticas)
  const [espera, setEspera] = useState('2')
  const [ed, setEd] = useState<MensagemAutomatica | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <CabecalhoSecao titulo="Mensagens automáticas" descricao="O que sai sem ninguém escrever. Nunca contam como primeira resposta. E-mail não recebe mensagem automática." />
      <div className="bg-sunken flex flex-wrap items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm">
        <span>Espera antes do “já vamos atender”:</span>
        <CampoTexto tipo="number" min={0} valor={espera} onMudar={setEspera} className="h-8 w-20" />
        <span className="text-muted-foreground text-xs">minutos · 0 = na hora (se alguém responder antes, não sai)</span>
      </div>
      <ul className="divide-border/70 flex flex-col divide-y">
        {lista.map((m) => (
          <li key={m.id} className="flex items-start gap-3 py-2.5">
            <button type="button" onClick={() => setEd(m)} className="hover:bg-sunken/60 -mx-2 min-w-0 flex-1 cursor-pointer rounded-[12px] px-2 py-1 text-left">
              <span className="block text-sm font-medium">{m.momento}</span>
              <span className="text-muted-foreground block text-xs">{m.quando.replace('{espera}', espera)}</span>
              <span className="mt-1 block text-sm">{m.texto}</span>
            </button>
            <Interruptor ocultarRotulo rotulo={`Mensagem de ${m.momento.toLowerCase()}`} ligado={m.ligada} onMudar={(v) => setLista((xs) => xs.map((x) => (x.id === m.id ? { ...x, ligada: v } : x)))} />
          </li>
        ))}
      </ul>
      {ed && (
        <GavetaFormulario
          aberta
          onFechar={() => setEd(null)}
          titulo={ed.momento}
          descricao={`Usa o modelo ${ed.modelo}. Mudar o texto submete uma nova versão à Meta.`}
          acao="Salvar"
          acaoDesabilitada={!ed.texto.trim()}
          onAcao={() => {
            setLista((xs) => xs.map((x) => (x.id === ed.id ? ed : x)))
            setEd(null)
          }}
        >
          <Campo rotulo="Quando sai">{() => <p className="text-sm">{ed.quando.replace('{espera}', espera)}</p>}</Campo>
          <Campo rotulo="Texto" ajuda="Variáveis entre chaves: {nome}, {setor}, {horario}, {retorno}.">
            {(id) => <CampoArea id={id} valor={ed.texto} onMudar={(v) => setEd({ ...ed, texto: v })} />}
          </Campo>
          <Interruptor ligado={ed.ligada} onMudar={(v) => setEd({ ...ed, ligada: v })} rotulo="Ligada" />
        </GavetaFormulario>
      )}
    </div>
  )
}
