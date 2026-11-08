import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { CalendarBlankIcon, CheckIcon, EnvelopeSimpleIcon, EyeIcon, PaperPlaneTiltIcon, PencilSimpleIcon, PlusIcon, TrashIcon, ShieldCheckIcon, SparkleIcon, UsersIcon, WhatsappLogoIcon, XIcon } from '@phosphor-icons/react'
import { BotaoFeito } from '@/ambiente/interface'
import { useState, type ReactNode } from 'react'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor } from '@/components/ui/formulario'
import { comunicados as iniciais, reguas as reguasIniciais, segmentoExemplo as seg, type Comunicado, type Regua } from '@/dados/crm'
import { cn } from '@/lib/utils'

/**
 * CRM › Comunicados (04, 7): comunicados segmentados pelo perfil, com opt-in,
 * limite do número e envio com aprovação; e as réguas de cobrança que o
 * integrante de Atendimento executa.
 */
export function ComunicadosTela({ clientes }: { clientes: { id: string; nome: string; regime: string }[] }) {
  const [lista, setLista] = usePersistente('crm.lista', iniciais)
  const [novo, setNovo] = useState(false)
  const [reguas, setReguas] = usePersistente('crm.reguas', reguasIniciais)
  const [editando, setEditando] = useState<Regua | null>(null)

  return (
    <AreaRolagem className="h-full px-3 pb-8 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-1 ultra:max-w-[1600px]">
        <section className="flex flex-col gap-3">
          <header className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Comunicados</h1>
              <p className="text-muted-foreground text-sm">Para um segmento da carteira, por modelo aprovado. Fora da janela de 24 h, só para quem deu opt-in.</p>
            </div>
            {!novo && (
              <Button size="sm" className="rounded-full" onClick={() => setNovo(true)}>
                <PlusIcon /> Novo comunicado
              </Button>
            )}
          </header>

          {novo && (
            <NovoComunicado
              clientes={clientes}
              onFechar={() => setNovo(false)}
              onEnviar={(c) => {
                setLista((xs) => [c, ...xs])
                setNovo(false)
              }}
            />
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {lista.map((c) => (
              <CartaoComunicado key={c.id} c={c} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <header className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-light">Réguas</h2>
              <p className="text-muted-foreground text-sm">Cobranças em etapas, no fio da pessoa certa e no canal dela. Param sozinhas quando o cliente responde ou o item chega; três etapas sem resposta avisam o responsável.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setEditando({ id: '', nome: '', dispara: gatilhosRegua[0], etapas: ['D0 aviso'], paraQuando: 'resposta do cliente', ativa: true, emCurso: 0, atividades: '' })}
            >
              <PlusIcon /> Nova régua
            </Button>
          </header>
          <ul className="grid gap-3 lg:grid-cols-2">
            {reguas.map((r) => (
              <li key={r.id} className={cn('bg-surface shadow-cartao flex flex-col gap-3 rounded-[24px] p-4', !r.ativa && 'opacity-70')}>
                <div className="flex items-start gap-3">
                  <button type="button" onClick={() => r.id !== 'r6' && setEditando(r)} className="min-w-0 flex-1 cursor-pointer text-left disabled:cursor-default" disabled={r.id === 'r6'}>
                    <h3 className="flex items-center gap-1.5 text-sm font-medium">
                      {r.nome} {r.id !== 'r6' && <PencilSimpleIcon className="text-muted-foreground size-3.5" />}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      dispara: {r.dispara} · para quando: {r.paraQuando}
                    </p>
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={r.ativa}
                    aria-label={`Régua ${r.nome}`}
                    disabled={r.id === 'r6'}
                    onClick={() => setReguas((xs) => xs.map((x) => (x.id === r.id ? { ...x, ativa: !x.ativa } : x)))}
                    className={cn('relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed', r.ativa ? 'bg-foreground' : 'bg-sunken')}
                  >
                    <span className={cn('bg-background shadow-pilula absolute top-0.5 size-5 rounded-full transition-all', r.ativa ? 'left-[18px]' : 'left-0.5')} />
                  </button>
                </div>
                <ol className="flex flex-wrap items-center gap-1 text-[11px]">
                  {r.etapas.map((e, i) => (
                    <li key={e} className="flex items-center gap-1">
                      <span className="bg-sunken rounded-full px-2 py-0.5">{e}</span>
                      {i < r.etapas.length - 1 && <span className="text-muted-foreground">→</span>}
                    </li>
                  ))}
                </ol>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{r.ativa ? `${r.emCurso} em curso agora` : r.id === 'r6' ? 'chega com o Financeiro (fase 3)' : 'desligada'}</span>
                  <code className="ml-auto text-[11px]">{r.atividades}</code>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {editando && (
        <EditorRegua
          key={editando.id || 'nova'}
          inicial={editando}
          onFechar={() => setEditando(null)}
          onSalvar={(r) => {
            const n = { ...r, id: r.id || `r${Date.now()}` }
            setReguas((xs) => (xs.some((x) => x.id === n.id) ? xs.map((x) => (x.id === n.id ? n : x)) : [...xs, n]))
            setEditando(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

const gatilhosRegua = ['dia 1 e tarefa aguardando cliente', 'guia registrada', 'vence em 30 dias', 'tarefa com prazo legal', 'último contato', 'documento pedido pelo integrante']

type EtapaEd = { dia: number; descricao: string; modelo: string; para: string }

const lerEtapa = (e: string): EtapaEd => {
  const m = e.match(/^D([+-]?\d+)\s*(.*)$/)
  return { dia: m ? Number(m[1]) : 0, descricao: m ? m[2] : e, modelo: 'documento_faltando', para: /sócio/.test(e) ? 'sócio' : /Gestor/.test(e) ? 'Gestor do setor' : 'pessoa com o assunto' }
}
const escreverEtapa = (e: EtapaEd) => `D${e.dia > 0 ? '+' : ''}${e.dia === 0 ? '0' : e.dia} ${e.descricao}`.trim()

/** Editor de régua (04, 7.2): gatilho, etapas com dia relativo, modelo e destinatário, parada e escalonamento. */
function EditorRegua({ inicial, onFechar, onSalvar }: { inicial: Regua; onFechar: () => void; onSalvar: (r: Regua) => void }) {
  const [nome, setNome] = useState(inicial.nome)
  const [dispara, setDispara] = useState(inicial.dispara)
  const [etapas, setEtapas] = useState<EtapaEd[]>(inicial.etapas.map(lerEtapa))
  const [paraQuando, setParaQuando] = useState(inicial.paraQuando)
  const [horario, setHorario] = useState('09:00')
  const [escalar, setEscalar] = useState(true)
  const set = (i: number, p: Partial<EtapaEd>) => setEtapas((xs) => xs.map((x, k) => (k === i ? { ...x, ...p } : x)))
  const ordenadas = [...etapas].sort((a, b) => a.dia - b.dia)
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={inicial.id ? inicial.nome : 'Nova régua'}
      descricao="Cada envio é uma mensagem na conversa da pessoa, pelo canal dela; fora da janela de 24 h, pelo modelo aprovado."
      acao="Salvar"
      acaoDesabilitada={!nome.trim() || !etapas.length || etapas.some((e) => !e.descricao.trim())}
      onAcao={() => onSalvar({ ...inicial, nome: nome.trim(), dispara, paraQuando, etapas: ordenadas.map(escreverEtapa) })}
    >
      <Campo rotulo="Nome">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} placeholder="ex.: Ponto do mês" />}</Campo>
      <Campo rotulo="Começa quando">{(id) => <CampoEscolha id={id} valor={dispara} onMudar={setDispara} opcoes={gatilhosRegua.map((g) => ({ valor: g, rotulo: g }))} />}</Campo>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Etapas</span>
        <p className="text-muted-foreground -mt-1 text-xs">Dia relativo ao gatilho (negativo = antes do vencimento).</p>
        {etapas.map((e, i) => (
          <div key={i} className="bg-sunken/60 grid grid-cols-[4.5rem_1fr_auto] items-start gap-2 rounded-[14px] p-2.5 sm:grid-cols-[4.5rem_1fr_1fr_auto]">
            <CampoTexto tipo="number" valor={String(e.dia)} onMudar={(v) => set(i, { dia: Number(v) || 0 })} className="tabular-nums" />
            <CampoTexto valor={e.descricao} onMudar={(v) => set(i, { descricao: v })} placeholder="o que diz" />
            <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-1 sm:col-start-3">
              <CampoEscolha valor={e.para} onMudar={(v) => set(i, { para: v })} opcoes={['pessoa com o assunto', 'sócio', 'Gestor do setor', 'responsável do cliente'].map((p) => ({ valor: p, rotulo: p }))} />
            </span>
            <Button type="button" size="icon" variant="ghost" className="rounded-full" aria-label={`Tirar etapa ${i + 1}`} onClick={() => setEtapas((xs) => xs.filter((_, k) => k !== i))}>
              <TrashIcon />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="w-fit rounded-full"
          onClick={() => setEtapas((xs) => [...xs, { dia: (xs.at(-1)?.dia ?? 0) + 3, descricao: 'lembrete', modelo: 'documento_faltando', para: 'pessoa com o assunto' }])}
        >
          <PlusIcon /> Etapa
        </Button>
        <ol className="flex flex-wrap items-center gap-1 text-[11px]">
          {ordenadas.map((e, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="bg-raised shadow-contorno rounded-full px-2 py-0.5">{escreverEtapa(e)}</span>
              {i < ordenadas.length - 1 && <span className="text-muted-foreground">→</span>}
            </li>
          ))}
        </ol>
      </div>
      <Campo rotulo="Para quando">{(id) => <CampoTexto id={id} valor={paraQuando} onMudar={setParaQuando} />}</Campo>
      <Campo rotulo="Horário de envio" ajuda="Dentro do horário do setor; em feriado, passa para o próximo dia útil.">
        {(id) => <CampoTexto id={id} tipo="time" valor={horario} onMudar={setHorario} className="w-32" />}
      </Campo>
      <Interruptor ligado={escalar} onMudar={setEscalar} rotulo="Avisar o responsável após 3 etapas sem resposta" detalhe="E devolver a conversa a uma pessoa quando o cliente responder “já mandei”." />
    </GavetaFormulario>
  )
}

const corStatus: Record<Comunicado['status'], 'sucesso' | 'outline' | 'destaque' | 'secondary'> = { enviado: 'sucesso', agendado: 'outline', 'em aprovação': 'destaque', rascunho: 'secondary' }

function CartaoComunicado({ c }: { c: Comunicado }) {
  const pct = (n?: number) => (n != null ? Math.round((n / c.destinatarios) * 100) : 0)
  return (
    <article className="bg-surface shadow-cartao flex flex-col gap-3 rounded-[24px] p-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium">{c.titulo}</h3>
          <p className="text-muted-foreground truncate text-xs">
            {c.segmento} · {c.canal}
          </p>
        </div>
        <Badge variant={corStatus[c.status]}>{c.status}</Badge>
      </div>
      {c.status === 'enviado' ? (
        <div className="grid grid-cols-4 gap-2">
          {[
            ['entregues', c.entregues],
            ['lidas', c.lidas],
            ['respostas', c.respostas],
            ['falharam', c.falhas],
          ].map(([r, v]) => (
            <div key={r as string} className="flex flex-col">
              <span className={cn('font-heading text-2xl font-light tabular-nums', r === 'falharam' && (v as number) > 0 && 'text-destructive')}>{v as number}</span>
              <span className="text-muted-foreground text-[11px]">
                {r as string}
                {r !== 'falharam' && ` · ${pct(v as number)}%`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <UsersIcon className="size-4" /> {c.destinatarios} destinatários · {c.status === 'agendado' ? `sai ${c.quando}` : 'modelo aguardando a Meta'}
        </p>
      )}
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <code className="text-[11px]">{c.modelo}</code>
        <span className="ml-auto">{c.quando}</span>
        {c.status === 'enviado' && (c.falhas ?? 0) > 0 && (
          <BotaoFeito size="sm" variant="ghost" className="h-6 rounded-full px-2 text-xs" texto={`Reenviado por e-mail aos ${c.falhas} contatos em que o WhatsApp falhou.`}>
            Reenviar por e-mail aos {c.falhas}
          </BotaoFeito>
        )}
      </div>
    </article>
  )
}

/** Pessoas com o assunto "comunicados" e, delas, com opt-in no WhatsApp, por cliente (exemplo). */
const pessoasPorCliente: Record<string, [number, number]> = { c1: [4, 3], c2: [2, 2], c3: [2, 1], c4: [1, 0], c5: [3, 3], c6: [1, 1] }

type Alcance = 'todos' | 'segmento' | 'clientes'

function NovoComunicado({ clientes, onFechar, onEnviar }: { clientes: { id: string; nome: string; regime: string }[]; onFechar: () => void; onEnviar: (c: Comunicado) => void }) {
  const { usuario } = useSessao()
  const loja = useLoja()
  // 04, 10.1: o Colaborador rascunha; quem envia é o Gestor (ou o Administrador).
  const precisaAprovacao = usuario.papel === 'colaborador'
  const [alcance, setAlcance] = useState<Alcance>('segmento')
  const [escolhidos, setEscolhidos] = useState<string[]>(['c1', 'c5'])
  const [emailSemOptIn, setEmailSemOptIn] = useState(true)
  const [quando, setQuando] = useState<'agora' | 'agendar'>('agendar')
  const [exemplos, setExemplos] = useState(false)
  const [aprovando, setAprovando] = useState(false)
  const preencher = (e: (typeof seg.exemplos)[number]) => seg.texto.replace('{nome}', e.nome).replace('{competencia}', e.competencia).replace('{data}', e.data)
  // Quem recebe, pelo alcance escolhido: todos os clientes, um segmento do perfil ou clientes a dedo.
  const soma = (ids: string[]) => ids.reduce((a, id) => [a[0] + (pessoasPorCliente[id]?.[0] ?? 1), a[1] + (pessoasPorCliente[id]?.[1] ?? 0)], [0, 0])
  const [pessoas, optIn] = alcance === 'todos' ? [168, 151] : alcance === 'segmento' ? [seg.pessoas, seg.optIn] : soma(escolhidos)
  const nClientes = alcance === 'todos' ? 142 : alcance === 'segmento' ? seg.clientes : escolhidos.length
  const descricao =
    alcance === 'todos'
      ? 'Todos os clientes ativos'
      : alcance === 'segmento'
        ? 'Simples · SP · setor Fiscal'
        : clientes
            .filter((c) => escolhidos.includes(c.id))
            .map((c) => c.nome)
            .join(', ')
  const total = optIn + (emailSemOptIn ? pessoas - optIn : 0)

  return (
    <section className="bg-surface shadow-painel flex flex-col gap-4 rounded-[28px] p-4 sm:p-5">
      <header className="flex items-center gap-2">
        <h2 className="text-base font-medium">Novo comunicado</h2>
        <Button size="icon-sm" variant="ghost" className="ml-auto rounded-full" onClick={onFechar} aria-label="Fechar">
          <XIcon />
        </Button>
      </header>
      <Linha rotulo="Para quem">
        <div className="bg-sunken flex w-fit rounded-full p-0.5 text-xs">
          {(
            [
              ['todos', 'Todos os clientes'],
              ['segmento', 'Segmento'],
              ['clientes', 'Escolher clientes'],
            ] as [Alcance, string][]
          ).map(([id, r]) => (
            <button key={id} type="button" onClick={() => setAlcance(id)} className={cn('cursor-pointer rounded-full px-3 py-1', alcance === id ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground')}>
              {r}
            </button>
          ))}
        </div>
        {alcance === 'segmento' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {seg.filtros.map((f) => (
              <Badge key={f} variant="outline">
                {f}
              </Badge>
            ))}
            <BotaoFeito type="button" variant="ghost" size="sm" className="text-muted-foreground h-6 rounded-full px-2 text-xs" texto={`Segmento em texto: clientes com ${seg.filtros.join(', ').toLowerCase()}.`}>
              <SparkleIcon className="size-3.5" /> descrever em texto
            </BotaoFeito>
          </div>
        )}
        {alcance === 'clientes' && (
          <ul className="grid max-w-2xl gap-1 sm:grid-cols-2">
            {clientes.map((c) => (
              <li key={c.id}>
                <label className="hover:bg-sunken flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm">
                  <input type="checkbox" className="accent-foreground size-4" checked={escolhidos.includes(c.id)} onChange={(e) => setEscolhidos((xs) => (e.target.checked ? [...xs, c.id] : xs.filter((x) => x !== c.id)))} />
                  <span className="min-w-0 flex-1 truncate">{c.nome}</span>
                  <span className="text-muted-foreground text-[11px]">{c.regime}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <p className="text-muted-foreground text-xs">
          → {nClientes} {nClientes === 1 ? 'cliente' : 'clientes'} · {pessoas} pessoas com o assunto "comunicados" · {optIn} com opt-in no WhatsApp
        </p>
      </Linha>
      <Linha rotulo="Modelo">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <code>{seg.modelo}</code>
          <Badge variant="sucesso">
            <CheckIcon /> aprovado
          </Badge>
          <span className="text-muted-foreground text-xs">utilidade · WhatsApp</span>
        </p>
        <p className="bg-sunken rounded-[12px] px-3 py-2 text-sm">{seg.texto}</p>
      </Linha>
      <Linha rotulo="Canal">
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-2">
            <WhatsappLogoIcon className="size-4" /> WhatsApp para {optIn}
          </span>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={emailSemOptIn} onChange={(e) => setEmailSemOptIn(e.target.checked)} className="accent-foreground size-4" />
            <EnvelopeSimpleIcon className="size-4" /> e-mail para {pessoas - optIn === 1 ? 'quem está' : `os ${pessoas - optIn}`} sem opt-in
          </label>
        </div>
      </Linha>
      <Linha rotulo="Quando">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="bg-sunken flex rounded-full p-0.5 text-xs">
            {(['agora', 'agendar'] as const).map((q) => (
              <button key={q} type="button" onClick={() => setQuando(q)} className={cn('cursor-pointer rounded-full px-3 py-1', quando === q ? 'bg-raised shadow-pilula font-medium' : 'text-muted-foreground')}>
                {q === 'agora' ? 'Agora' : 'Agendar'}
              </button>
            ))}
          </div>
          {quando === 'agendar' && (
            <span className="flex items-center gap-1.5">
              <CalendarBlankIcon className="size-4" /> 10/12 às 09:00
            </span>
          )}
          <span className="text-muted-foreground text-xs">limite do número: 2.000 / 24 h ✓ · dentro do horário</span>
        </div>
      </Linha>

      {exemplos && (
        <div className="grid gap-2 sm:grid-cols-3">
          {seg.exemplos.map((e) => (
            <div key={e.nome} className="bg-raised shadow-contorno rounded-[14px] px-3 py-2 text-sm">
              <div className="text-muted-foreground text-[11px]">para {e.nome}</div>
              {preencher(e)}
            </div>
          ))}
        </div>
      )}

      {aprovando ? (
        <div className="bg-sunken flex flex-col gap-2 rounded-[18px] p-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <ShieldCheckIcon className="size-4" /> Enviar para {total} {total === 1 ? 'pessoa' : 'pessoas'}? Não dá para desfazer.
          </p>
          <p className="text-muted-foreground text-xs">Respostas abrem conversa no Fiscal, etiquetadas com o comunicado. Quem responder "PARAR" sai da lista.</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                if (precisaAprovacao) {
                  loja.avisar({
                    para: ['u1'],
                    tipo: 'cartao',
                    setor: 'gestao_atendimento',
                    titulo: `${usuario.nome} pediu aprovação de um comunicado`,
                    detalhe: `PGDAS-D de dezembro · ${total} destinatários`,
                    destino: { modulo: 'crm', aba: 'comunicados' },
                  })
                  loja.toast('Comunicado enviado para aprovação da Fernanda Lima. Você é avisado quando sair.')
                  return onEnviar({
                    id: `co${Date.now()}`,
                    titulo: 'PGDAS-D de dezembro',
                    segmento: descricao,
                    modelo: seg.modelo,
                    canal: emailSemOptIn ? 'WhatsApp + e-mail' : 'WhatsApp',
                    quando: 'aguardando aprovação',
                    status: 'agendado',
                    destinatarios: total,
                  })
                }
                onEnviar({
                  id: `co${Date.now()}`,
                  titulo: 'PGDAS-D de dezembro',
                  segmento: descricao,
                  modelo: seg.modelo,
                  canal: emailSemOptIn ? 'WhatsApp + e-mail' : 'WhatsApp',
                  quando: quando === 'agora' ? 'agora' : '10/12 09:00',
                  status: quando === 'agora' ? 'enviado' : 'agendado',
                  destinatarios: total,
                  ...(quando === 'agora' ? { entregues: 0, lidas: 0, respostas: 0, falhas: 0 } : {}),
                })
              }}
            >
              {precisaAprovacao ? 'Mandar para aprovação' : `Aprovar e ${quando === 'agora' ? 'enviar' : 'agendar'}`}
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setAprovando(false)}>
              Voltar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setExemplos((v) => !v)}>
            <EyeIcon /> {exemplos ? 'Esconder exemplos' : 'Pré-visualizar 3 exemplos'}
          </Button>
          <Button size="sm" className="rounded-full" onClick={() => setAprovando(true)} disabled={!total}>
            <PaperPlaneTiltIcon /> Enviar com aprovação
          </Button>
        </div>
      )}
    </section>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
      <span className="text-muted-foreground pt-0.5 text-xs font-medium">{rotulo}</span>
      <div className="flex min-w-0 flex-col gap-1.5">{children}</div>
    </div>
  )
}
