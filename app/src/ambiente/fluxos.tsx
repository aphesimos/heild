import { ArrowSquareOutIcon, ChatCircleDotsIcon, CheckCircleIcon, ClockIcon, FileTextIcon, PaperPlaneTiltIcon, ShieldCheckIcon, SparkleIcon, TimerIcon, UserIcon } from '@phosphor-icons/react'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import * as exemplo from '@/dados/exemplo'
import { catalogoServicos, rotuloEstadoServico, type EstadoServico } from '@/dados/servicos-extras'
import { faturas } from '@/dados/financeiro'
import { sessoesDia } from '@/dados/timesheet'
import type { Tarefa } from '@/dados/tipos'
import { useAparencia } from '@/hooks/useAparencia'
import type { SetorIntegrante } from '@/theme/tipos'
import type { ContatoCliente } from './clientes'
import { usuariosCfg } from '@/dados/configuracoes'
import { usePedirIntegrante } from './pedir'
import { NavegacaoProvider, useLoja, useNavegacao, type Destino } from './loja'
import { rotuloSetorCurto, useSessao } from './sessao'

/** Cliente pelo nome (os dados de exemplo guardam o nome). */
export const clientePorNome = (nome?: string) => exemplo.clientes.find((c) => c.nome === nome)
/** Integrante padrão de um setor. */
export const integranteDoSetor = (s: SetorIntegrante) => exemplo.integrantes.find((i) => i.setor === s && i.tipo !== 'criado_pelo_usuario')?.id ?? 'i-geral'
const rotuloStatus: Record<Tarefa['status'], string> = { a_fazer: 'a fazer', em_andamento: 'em andamento', aguardando_cliente: 'aguardando cliente', concluida: 'concluída' }
/** Quem recebe o assunto: o contato com ele; sem ninguém, o sócio ou titular (04 A1). */
const contatoPorAssunto = (contatos: ContatoCliente[], assunto: string) => contatos.find((x) => x.assuntos.includes(assunto)) ?? contatos.find((x) => x.papel.startsWith('sóci') || x.papel === 'titular')
const assuntoDoSetor = (s: SetorIntegrante) => (s === 'dp' ? 'folha' : s === 'societario' ? 'societario' : s === 'fiscal' ? 'guias' : 'documentos_pendentes')

interface PedidoCobrar {
  cliente: string
  setor: SetorIntegrante
  texto: string
  /** O que se pede (para o título). */
  assunto?: string
  tarefa?: string
  anexo?: string
}
interface PedidoPreparar {
  cliente: string
  setor: SetorIntegrante
  documento: string
  tarefa?: string
}
interface PedidoTransmitir {
  cliente: string
  setor: SetorIntegrante
  documento: string
  orgao: string
  valor?: string
  tarefa?: string
}

interface Fluxos {
  abrirTarefa: (id: string) => void
  cobrar: (p: PedidoCobrar) => void
  enviar: (p: PedidoCobrar & { anexo: string }) => void
  preparar: (p: PedidoPreparar) => void
  transmitir: (p: PedidoTransmitir) => void
  baixar: (nome: string) => void
  novaTarefa: (p: { cliente?: string; setor: SetorIntegrante }) => void
  fichaCliente: (clienteId: string) => void
  /** Ação feita direto, sem gaveta: registra, avisa e devolve o link. */
  feito: (texto: string, destino?: Destino, rotulo?: string) => void
}

const Ctx = createContext<Fluxos | null>(null)

type Aberto =
  | { tipo: 'ficha'; clienteId: string }
  | { tipo: 'nova'; cliente?: string; setor: SetorIntegrante }
  | { tipo: 'tarefa'; id: string }
  | { tipo: 'cobrar'; p: PedidoCobrar }
  | { tipo: 'preparar'; p: PedidoPreparar }
  | { tipo: 'transmitir'; p: PedidoTransmitir }
  | null

export function FluxosProvider({ children }: { children: ReactNode }) {
  const loja = useLoja()
  const nav = useNavegacao()
  const [aberto, setAberto] = useState<Aberto>(null)

  const fluxos = useMemo<Fluxos>(
    () => ({
      abrirTarefa: (id) => setAberto({ tipo: 'tarefa', id }),
      cobrar: (p) => setAberto({ tipo: 'cobrar', p }),
      enviar: (p) => setAberto({ tipo: 'cobrar', p }),
      preparar: (p) => setAberto({ tipo: 'preparar', p }),
      transmitir: (p) => setAberto({ tipo: 'transmitir', p }),
      baixar: (nome) => loja.toast(`${nome} baixado.`),
      novaTarefa: (p) => setAberto({ tipo: 'nova', ...p }),
      fichaCliente: (clienteId) => setAberto({ tipo: 'ficha', clienteId }),
      feito: (texto, destino, rotulo) => loja.toast(texto, destino, rotulo),
    }),
    [loja],
  )

  // Links para "tarefa" abrem a ficha por cima; o resto segue para o módulo.
  const navInterna = useMemo(
    () => ({
      irPara: (d: Destino) => {
        if (d.tarefa) setAberto({ tipo: 'tarefa', id: d.tarefa })
        if (d.tarefa && !d.aba) return
        nav.irPara(d)
      },
      // A vitrine (o site) passa adiante: os cartões lá dentro continuam sem os botões que levariam para fora.
      vitrine: nav.vitrine,
    }),
    [nav],
  )

  return (
    <NavegacaoProvider value={navInterna}>
      <Ctx.Provider value={fluxos}>
        {children}
        {aberto?.tipo === 'tarefa' && <FichaTarefa id={aberto.id} onFechar={() => setAberto(null)} onFluxo={setAberto} />}
        {aberto?.tipo === 'ficha' && <GavetaFichaCliente clienteId={aberto.clienteId} onFechar={() => setAberto(null)} />}
        {aberto?.tipo === 'nova' && <NovaTarefa cliente={aberto.cliente} setor={aberto.setor} onFechar={() => setAberto(null)} onCriada={(id) => setAberto({ tipo: 'tarefa', id })} />}
        {aberto?.tipo === 'cobrar' && <GavetaCobrar p={aberto.p} onFechar={() => setAberto(null)} />}
        {aberto?.tipo === 'preparar' && <GavetaPreparar p={aberto.p} onFechar={() => setAberto(null)} />}
        {aberto?.tipo === 'transmitir' && <GavetaTransmitir p={aberto.p} onFechar={() => setAberto(null)} />}
      </Ctx.Provider>
    </NavegacaoProvider>
  )
}

/** Fluxos compartilhados. Fora do provider, abre nada (stories isoladas). */
export function useFluxos(): Fluxos {
  const f = useContext(Ctx)
  if (f) return f
  const nada = () => {}
  return { abrirTarefa: nada, cobrar: nada, enviar: nada, preparar: nada, transmitir: nada, baixar: nada, novaTarefa: nada, fichaCliente: nada, feito: nada }
}

/** Acha (ou abre) a conversa do cliente naquele setor e devolve o id. */
export function useConversaDe() {
  const loja = useLoja()
  return (clienteNome: string, setor: SetorIntegrante, contatoNome?: string) => {
    const c = clientePorNome(clienteNome)
    const fixa = loja.fichaDe(c?.id)?.conversas[setor]
    if (fixa) return fixa
    const existente = loja.conversas.find((x) => x.cliente === clienteNome && x.setor === setor)
    if (existente) return existente.id
    const contato = contatoPorAssunto(loja.fichaDe(c?.id)?.contatos ?? [], assuntoDoSetor(setor))
    const id = `cvn-${c?.id ?? 'x'}-${setor}`
    loja.novaConversa({
      id,
      clienteId: c?.id,
      cliente: clienteNome,
      pessoa: { nome: contatoNome ?? contato?.nome ?? 'Contato', papel: contato?.papel ?? 'contato', contato: contato?.whatsapp ?? contato?.email ?? 'app' },
      setor,
      status: 'aguardando_cliente',
      canal: contato?.whatsapp ? 'whatsapp' : contato?.app ? 'app' : 'email',
      prazoMin: null,
      prazoTexto: 'aguardando cliente',
      etiquetas: [],
      previa: '',
      janelaAberta: false,
      itens: [{ tipo: 'dia', texto: 'Hoje' }],
    })
    return id
  }
}

/** Ficha da tarefa: o mesmo fato visto de todos os lados (conversa, integrante, tempo, fatura). */
function FichaTarefa({ id, onFechar, onFluxo }: { id: string; onFechar: () => void; onFluxo: (a: Aberto) => void }) {
  const loja = useLoja()
  const nav = useNavegacao()
  const { usuario } = useSessao()
  const aparencia = useAparencia()
  const pedirIntegrante = usePedirIntegrante()
  const t = loja.tarefas.find((x) => x.id === id)
  if (!t) return null
  const c = clientePorNome(t.cliente)
  const ficha = loja.fichaDe(c?.id)
  const conversa = ficha?.conversas[t.setor] ?? loja.conversas.find((x) => x.cliente === t.cliente && x.setor === t.setor)?.id
  const sessoes = sessoesDia.filter((s) => s.cliente === t.cliente && s.atividade === t.codigo)
  const fatura = faturas.find((f) => f.cliente === t.cliente && f.situacao !== 'paga')
  const integrante = integranteDoSetor(t.setor)
  const eventos = loja.estado.eventos.filter((e) => e.texto.includes(t.codigo) && e.texto.includes(t.cliente))
  const ir = (d: Destino) => {
    onFechar()
    nav.irPara(d)
  }
  const mudar = (status: Tarefa['status'], texto: string) => {
    loja.atualizarTarefa(t.id, { status, atrasada: status === 'concluida' ? false : t.atrasada })
    loja.registrar(usuario.nome, `${texto}: ${t.codigo} · ${t.cliente}`)
    loja.toast(`${t.codigo} · ${t.cliente}: ${texto.toLowerCase()}.`)
  }
  const tom = aparencia({ setor: t.setor })
  const pedido = pedirIntegrante(t)
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={`${t.codigo} · ${t.titulo}`}
      descricao={`${t.cliente} · ${tom.nome} · prazo ${t.prazo}`}
      acao={t.status === 'concluida' ? 'Fechar' : 'Concluir tarefa'}
      onAcao={() => (t.status === 'concluida' ? onFechar() : (mudar('concluida', 'Concluída'), onFechar()))}
      secundaria={
        pedido && !pedido.fazendo ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              pedido.pedir()
              onFechar()
            }}
          >
            {t.status === 'aguardando_cliente' ? `${pedido.nome} cobra o cliente` : `Pedir ao ${pedido.nome}`}
          </Button>
        ) : t.status === 'a_fazer' ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => mudar('em_andamento', 'Iniciada')}>
            Iniciar
          </Button>
        ) : t.status === 'em_andamento' ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => mudar('aguardando_cliente', 'Aguardando cliente')}>
            Aguardar cliente
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant={t.status === 'concluida' ? 'sucesso' : t.atrasada ? 'erro' : 'outline'}>{t.atrasada && t.status !== 'concluida' ? 'atrasada' : rotuloStatus[t.status]}</Badge>
        <span className="text-muted-foreground flex items-center gap-1">
          <UserIcon className="size-4" /> {t.responsavel ? (t.responsavel.tipo === 'integrante' ? `integrante ${t.responsavel.nome}` : t.responsavel.nome) : 'sem responsável'}
        </span>
        {t.cartaoPendente && <Badge variant="destaque">cartão aguardando aprovação</Badge>}
      </div>

      <section className="flex flex-col gap-1.5">
        <h3 className="text-sm font-medium">Ligado a esta tarefa</h3>
        <ul className="divide-border/70 flex flex-col divide-y text-sm">
          <Ligacao
            icone={<ChatCircleDotsIcon />}
            titulo="Conversa com o cliente"
            detalhe={conversa ? `${loja.conversas.find((x) => x.id === conversa)?.pessoa.nome ?? ''} · CRM` : 'nenhuma ainda'}
            rotulo={conversa ? 'Abrir no CRM' : 'Escrever ao cliente'}
            onClick={() => (conversa ? ir({ modulo: 'crm', aba: 'conversas', conversa }) : onFluxo({ tipo: 'cobrar', p: { cliente: t.cliente, setor: t.setor, texto: '', tarefa: t.id, assunto: t.titulo } }))}
          />
          <Ligacao
            icone={<SparkleIcon />}
            titulo={`Integrante ${tom.nome}`}
            detalhe={t.responsavel?.tipo === 'integrante' ? 'é o responsável; o histórico está no chat dele' : 'pode preparar o documento desta tarefa'}
            rotulo="Abrir no Time"
            onClick={() => ir({ modulo: 'inicio', aba: 'time', integrante, cliente: c?.id })}
          />
          <Ligacao
            icone={<TimerIcon />}
            titulo="Tempo registrado"
            detalhe={sessoes.length ? sessoes.map((s) => `${s.inicio}–${s.fim} (${s.confianca})`).join(' · ') : 'nenhuma sessão hoje'}
            rotulo="Ver no Timesheet"
            onClick={() => ir({ modulo: 'timesheet', aba: 'meu', cliente: c?.id })}
          />
          <Ligacao
            icone={<FileTextIcon />}
            titulo={`Aba ${tom.nome} do cliente`}
            detalhe={`${t.cliente}: o que está aberto no setor`}
            rotulo="Abrir no Painel"
            onClick={() => ir({ modulo: 'painel', aba: t.setor === 'consultor' ? 'consultoria' : t.setor === 'gestao_atendimento' ? 'gestao' : t.setor, cliente: c?.id })}
          />
          {c && (
            <Ligacao
              icone={<UserIcon />}
              titulo="Ficha do cliente"
              detalhe={ficha?.contatos.map((x) => `${x.nome} (${x.papel})`).join(', ') || 'sem contatos'}
              rotulo="Abrir ficha"
              onClick={() => onFluxo({ tipo: 'ficha', clienteId: c.id })}
            />
          )}
          {fatura && (
            <Ligacao icone={<ClockIcon />} titulo="Honorário em aberto" detalhe={`${fatura.competencia} · vence ${fatura.vencimento}`} rotulo="Ver fatura" onClick={() => ir({ modulo: 'financeiro', aba: 'cobranca', fatura: fatura.id })} />
          )}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => onFluxo({ tipo: 'cobrar', p: { cliente: t.cliente, setor: t.setor, texto: '', tarefa: t.id, assunto: t.titulo } })}>
          <PaperPlaneTiltIcon /> Cobrar o cliente
        </Button>
        <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => onFluxo({ tipo: 'preparar', p: { cliente: t.cliente, setor: t.setor, documento: t.titulo, tarefa: t.id } })}>
          <SparkleIcon /> Pedir ao integrante
        </Button>
      </div>

      {(eventos.length > 0 || ficha?.observacao) && (
        <section className="flex flex-col gap-1.5 text-sm">
          <h3 className="font-medium">Histórico</h3>
          {eventos.map((e) => (
            <p key={e.id} className="text-muted-foreground text-xs">
              {e.quando} · {e.ator}: {e.texto}
            </p>
          ))}
          {ficha?.observacao && <p className="text-muted-foreground text-xs">Sobre o cliente: {ficha.observacao}</p>}
        </section>
      )}
    </GavetaFormulario>
  )
}

function Ligacao({ icone, titulo, detalhe, rotulo, onClick }: { icone: ReactNode; titulo: string; detalhe: string; rotulo: string; onClick: () => void }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span className="text-muted-foreground [&_svg]:size-4">{icone}</span>
      <span className="min-w-0 flex-1">
        <span className="block">{titulo}</span>
        <span className="text-muted-foreground block truncate text-xs">{detalhe}</span>
      </span>
      <Button type="button" size="sm" variant="ghost" className="shrink-0 rounded-full" onClick={onClick}>
        {rotulo} <ArrowSquareOutIcon />
      </Button>
    </li>
  )
}

/** Cobrar ou enviar ao cliente: vai para a conversa do CRM do setor, pelo contato com o assunto. */
function GavetaCobrar({ p, onFechar }: { p: PedidoCobrar; onFechar: () => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const conversaDe = useConversaDe()
  const c = clientePorNome(p.cliente)
  const contatos = loja.fichaDe(c?.id)?.contatos ?? []
  const sugerido = contatoPorAssunto(contatos, assuntoDoSetor(p.setor))
  const [contato, setContato] = useState(sugerido?.nome ?? contatos[0]?.nome ?? '')
  const atual = contatos.find((x) => x.nome === contato)
  const [canal, setCanal] = useState<'whatsapp' | 'email' | 'app'>(atual?.whatsapp ? 'whatsapp' : atual?.app ? 'app' : 'email')
  const primeiro = contato.split(' ')[contato.startsWith('Dra.') ? 1 : 0]
  const [texto, setTexto] = useState(
    p.texto ||
      (p.anexo ? `Oi, ${primeiro}! Segue ${p.anexo}. Qualquer dúvida, é só responder aqui.` : `Oi, ${primeiro}! Para seguirmos com ${p.assunto ?? 'a competência'}, precisamos de um retorno seu. Consegue nos enviar ainda esta semana?`),
  )
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={p.anexo ? `Enviar a ${p.cliente}` : `Cobrar ${p.cliente}`}
      descricao="Vai pela conversa do setor no CRM, com o seu nome. A resposta do cliente volta para lá."
      acao="Enviar"
      acaoDesabilitada={!texto.trim()}
      onAcao={() => {
        const conversa = conversaDe(p.cliente, p.setor, contato)
        loja.mensagemCrm(conversa, { tipo: 'mensagem', de: 'atendente', autor: usuario.nome, canal, texto: texto.trim(), entrega: 'enviada', anexos: p.anexo ? [{ nome: p.anexo, tipo: 'pdf' }] : undefined })
        loja.statusConversa(conversa, 'aguardando_cliente')
        if (p.tarefa) loja.atualizarTarefa(p.tarefa, { status: 'aguardando_cliente' })
        loja.registrar(usuario.nome, `${p.anexo ? 'Enviou' : 'Cobrou'} ${contato} (${p.cliente})${p.assunto ? `: ${p.assunto}` : ''}`)
        loja.toast(`Enviado a ${contato} pelo ${canal === 'whatsapp' ? 'WhatsApp' : canal === 'email' ? 'e-mail' : 'app'}.`, { modulo: 'crm', aba: 'conversas', conversa }, 'Ver conversa')
        onFechar()
      }}
    >
      <Campo rotulo="Para" ajuda={sugerido ? `Sugerido: ${sugerido.nome} recebe o assunto “${assuntoDoSetor(p.setor)}”.` : undefined}>
        {(id) => <CampoEscolha id={id} valor={contato} onMudar={setContato} opcoes={contatos.map((x) => ({ valor: x.nome, rotulo: `${x.nome} · ${x.papel}` }))} />}
      </Campo>
      <Campo rotulo="Canal">
        {() => (
          <Segmentado
            rotulo="Canal"
            valor={canal}
            onMudar={setCanal}
            opcoes={[
              ...(atual?.whatsapp ? [{ valor: 'whatsapp' as const, rotulo: 'WhatsApp' }] : []),
              ...(atual?.email ? [{ valor: 'email' as const, rotulo: 'E-mail' }] : []),
              ...(atual?.app ? [{ valor: 'app' as const, rotulo: 'App' }] : []),
            ]}
          />
        )}
      </Campo>
      {p.anexo && (
        <p className="bg-sunken/60 flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm">
          <FileTextIcon className="size-4" /> {p.anexo}
        </p>
      )}
      <Campo rotulo="Mensagem">{(id) => <CampoArea id={id} linhas={5} valor={texto} onMudar={setTexto} />}</Campo>
    </GavetaFormulario>
  )
}

/** Pedir ao integrante que prepare o documento: o resultado chega como cartão no chat dele. */
function GavetaPreparar({ p, onFechar }: { p: PedidoPreparar; onFechar: () => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const aparencia = useAparencia()
  const tom = aparencia({ setor: p.setor })
  const [instrucoes, setInstrucoes] = useState('')
  const [estado, setEstado] = useState<'pedir' | 'preparando'>('pedir')
  const integrante = integranteDoSetor(p.setor)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Pedir ao ${tom.nome}`}
      descricao={`${p.documento} · ${p.cliente}. O integrante prepara; enviar, transmitir e assinar continuam com você.`}
      acao={estado === 'preparando' ? 'Preparando…' : 'Pedir'}
      acaoDesabilitada={estado === 'preparando'}
      onAcao={() => {
        setEstado('preparando')
        setTimeout(() => {
          loja.mensagemTime(integrante, { autor: { tipo: 'usuario', nome: usuario.nome }, texto: `Prepare ${p.documento.toLowerCase()} de ${p.cliente}.${instrucoes ? ` ${instrucoes}` : ''}` })
          loja.mensagemTime(integrante, {
            autor: { tipo: 'integrante', setor: p.setor },
            texto: `Pronto. Preparei ${p.documento.toLowerCase()} de ${p.cliente} com os dados do cadastro e da competência. Revise antes de enviar.`,
            cartoes: [{ tipo: 'documento', id: `doc-${Date.now()}`, nome: `${p.documento} · ${p.cliente}.pdf`, especie: 'documento', cliente: p.cliente, competencia: '11/2026' }],
          })
          if (p.tarefa) loja.atualizarTarefa(p.tarefa, { status: 'em_andamento', cartaoPendente: true })
          loja.registrar(`integrante ${tom.nome}`, `Preparou ${p.documento} (${p.cliente}) a pedido de ${usuario.nome}`)
          loja.toast(`${tom.nome} preparou ${p.documento.toLowerCase()}.`, { modulo: 'inicio', aba: 'time', integrante, cliente: clientePorNome(p.cliente)?.id }, 'Ver no Time')
          onFechar()
        }, 1100)
      }}
    >
      <Campo rotulo="Instruções (opcional)" ajuda="Vão junto com o pedido, no chat do integrante.">
        {(id) => <CampoArea id={id} linhas={3} valor={instrucoes} onMudar={setInstrucoes} placeholder="Ex.: usar a convenção de 2026" />}
      </Campo>
      {estado === 'preparando' && (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <SparkleIcon className="size-4 animate-pulse" /> {tom.nome} está preparando…
        </p>
      )}
    </GavetaFormulario>
  )
}

/** Transmitir ou entregar a um órgão: sempre de uma pessoa, com o certificado do escritório. */
function GavetaTransmitir({ p, onFechar }: { p: PedidoTransmitir; onFechar: () => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const conversaDe = useConversaDe()
  const [conferi, setConferi] = useState(false)
  const [enviarCliente, setEnviarCliente] = useState(true)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Transmitir ${p.documento}`}
      descricao={`${p.cliente} · ${p.orgao}. Transmitir é sempre de uma pessoa: o integrante prepara e confere, você envia.`}
      acao="Transmitir"
      acaoDesabilitada={!conferi}
      onAcao={() => {
        loja.registrar(usuario.nome, `Transmitiu ${p.documento} de ${p.cliente} (${p.orgao})`)
        if (p.tarefa) loja.atualizarTarefa(p.tarefa, { status: 'concluida', cartaoPendente: false, atrasada: false })
        let conversa: string | undefined
        if (enviarCliente) {
          conversa = conversaDe(p.cliente, p.setor)
          loja.mensagemCrm(conversa, {
            tipo: 'mensagem',
            de: 'atendente',
            autor: usuario.nome,
            canal: 'whatsapp',
            texto: `${p.documento} transmitido hoje.${p.valor ? ` A guia de ${p.valor} segue anexa.` : ' O recibo segue anexo.'}`,
            entrega: 'enviada',
            anexos: [{ nome: `Recibo ${p.documento}.pdf`, tipo: 'pdf' }],
          })
        }
        loja.toast(`${p.documento} de ${p.cliente} transmitido. Recibo salvo na pasta do cliente.`, conversa ? { modulo: 'crm', aba: 'conversas', conversa } : undefined, conversa ? 'Ver o envio ao cliente' : undefined)
        onFechar()
      }}
    >
      <dl className="bg-sunken/60 grid grid-cols-2 gap-2 rounded-[14px] p-3 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs">Órgão</dt>
          <dd>{p.orgao}</dd>
        </div>
        {p.valor && (
          <div>
            <dt className="text-muted-foreground text-xs">Valor</dt>
            <dd className="tabular-nums">{p.valor}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted-foreground text-xs">Certificado</dt>
          <dd className="flex items-center gap-1">
            <ShieldCheckIcon className="text-success size-4" /> e-CNPJ do escritório (procuração)
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Conferência do integrante</dt>
          <dd className="flex items-center gap-1">
            <CheckCircleIcon className="text-success size-4" weight="fill" /> sem divergência
          </dd>
        </div>
      </dl>
      <Interruptor ligado={conferi} onMudar={setConferi} rotulo="Conferi os valores" detalhe="Fica no evento com o seu nome." />
      <Interruptor ligado={enviarCliente} onMudar={setEnviarCliente} rotulo="Enviar recibo e guia ao cliente" detalhe="Pela conversa do setor, ao contato com o assunto." />
    </GavetaFormulario>
  )
}

/** Nova tarefa à mão (03, 7): código do catálogo, cliente, prazo interno e responsável. */
function NovaTarefa({ cliente, setor, onFechar, onCriada }: { cliente?: string; setor: SetorIntegrante; onFechar: () => void; onCriada: (id: string) => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const aparencia = useAparencia()
  const [titulo, setTitulo] = useState('')
  const [cli, setCli] = useState(cliente ?? exemplo.clientes[0].nome)
  const [prazo, setPrazo] = useState('20/11')
  const [resp, setResp] = useState<'eu' | 'integrante'>('eu')
  const prefixo: Partial<Record<SetorIntegrante, string>> = { fiscal: 'FIS', notas: 'NFE', dp: 'DP', contabil: 'CTB', societario: 'SOC', consultor: 'CON', gestao_atendimento: 'GES' }
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Nova tarefa · ${aparencia({ setor }).nome}`}
      descricao="Aparece na aba do setor, na lista do responsável e na ficha do cliente."
      acao="Criar"
      acaoDesabilitada={!titulo.trim()}
      onAcao={() => {
        const id = loja.criarTarefa({
          codigo: `${prefixo[setor] ?? 'GES'}-0${Math.floor(Math.random() * 90 + 10)}`,
          titulo: titulo.trim(),
          cliente: cli,
          setor,
          prazo,
          status: 'a_fazer',
          responsavel: resp === 'eu' ? { tipo: 'pessoa', nome: usuario.nome } : { tipo: 'integrante', nome: aparencia({ setor }).nome, setor },
        })
        loja.registrar(usuario.nome, `Criou a tarefa “${titulo.trim()}” (${cli})`)
        onCriada(id)
      }}
    >
      <Campo rotulo="O que fazer">{(id) => <CampoArea id={id} linhas={2} valor={titulo} onMudar={setTitulo} placeholder="Ex.: Conferir retenções de novembro" />}</Campo>
      <Campo rotulo="Cliente">{(id) => <CampoEscolha id={id} valor={cli} onMudar={setCli} opcoes={exemplo.clientes.map((c) => ({ valor: c.nome, rotulo: c.nome }))} />}</Campo>
      <Campo rotulo="Prazo interno" ajuda="O prazo legal vem do calendário; este é o combinado da equipe.">
        {(id) => <CampoEscolha id={id} valor={prazo} onMudar={setPrazo} opcoes={['19/11', '20/11', '23/11', '25/11', '27/11', '30/11'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <Campo rotulo="Responsável">
        {() => (
          <Segmentado
            rotulo="Responsável"
            valor={resp}
            onMudar={setResp}
            opcoes={[
              { valor: 'eu', rotulo: usuario.nome },
              { valor: 'integrante', rotulo: `Integrante ${aparencia({ setor }).nome}` },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

const papeis: ContatoCliente['papel'][] = ['sócio', 'sócia', 'titular', 'financeiro', 'RH', 'fiscal da empresa', 'diretor financeiro']
const assuntos = [
  { valor: 'guias', rotulo: 'guias' },
  { valor: 'folha', rotulo: 'folha' },
  { valor: 'documentos_pendentes', rotulo: 'documentos' },
  { valor: 'honorarios', rotulo: 'honorários' },
  { valor: 'societario', rotulo: 'societário' },
  { valor: 'comunicados', rotulo: 'comunicados' },
]

/**
 * Ficha do cliente (03, 6.1 e 04 A1): quem recebe cada assunto, quem usa o app
 * e quem responde por cada setor no escritório. É daqui que a cobrança, a
 * entrega de guias e a lateral do CRM tiram o contato e o responsável.
 */
function GavetaFichaCliente({ clienteId, onFechar }: { clienteId: string; onFechar: () => void }) {
  const loja = useLoja()
  const { usuario } = useSessao()
  const cliente = exemplo.clientes.find((c) => c.id === clienteId)
  const base = loja.fichaDe(clienteId) ?? { id: clienteId, contatos: [], responsaveis: {}, conversas: {} }
  const [contatos, setContatos] = useState(base.contatos)
  const [resp, setResp] = useState(base.responsaveis)
  const [servicos, setServicos] = useState(base.servicos ?? {})
  const pode = usuario.papel !== 'colaborador'
  // Responsáveis pelos pacotes que o cliente contratou (o BPO só onde há BPO).
  const pacotes = cliente?.servicos ?? ['contabil']
  const setoresEquipe: SetorIntegrante[] = [...(pacotes.includes('contabil') && loja.estado.cenario !== 'bpo_puro' ? (['societario', 'fiscal', 'notas', 'dp', 'contabil', 'consultor'] as const) : []), ...(pacotes.includes('bpo') ? (['bpo_financeiro'] as const) : [])]
  const pessoasDo = (s: SetorIntegrante) => usuariosCfg.filter((u) => u.situacao === 'ativo' && (u.papel === 'administrador' || u.vinculos.some((v) => v.setor === s))).map((u) => u.nome)
  const muda = (i: number, p: Partial<ContatoCliente>) => setContatos((xs) => xs.map((x, k) => (k === i ? { ...x, ...p } : x)))
  const semAssunto = assuntos.filter((a) => !contatos.some((c) => c.assuntos.includes(a.valor)))
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={`Ficha · ${cliente?.nome ?? ''}`}
      descricao={`${cliente?.codigo ?? ''} · ${cliente?.regime ?? ''} · ${cliente?.documento ?? ''}. Contatos por assunto e responsáveis por setor.`}
      acao={pode ? 'Salvar' : 'Fechar'}
      acaoDesabilitada={pode && contatos.some((c) => !c.nome.trim())}
      onAcao={() => {
        if (pode) {
          loja.salvarFicha({ ...base, contatos, responsaveis: resp, servicos })
          loja.registrar(usuario.nome, `Atualizou a ficha de ${cliente?.nome}`)
          loja.toast(`Ficha de ${cliente?.nome} salva. Cobranças e entregas já usam os contatos novos.`)
        }
        onFechar()
      }}
    >
      <fieldset disabled={!pode} className="contents">
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Contatos e o que cada um recebe</h3>
          {contatos.map((c, i) => (
            <div key={i} className="bg-sunken/50 flex flex-col gap-2 rounded-[14px] p-3">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <CampoTexto valor={c.nome} onMudar={(v) => muda(i, { nome: v })} placeholder="Nome" aria-label={`Nome do contato ${i + 1}`} />
                <CampoEscolha rotulo={`Papel de ${c.nome || 'contato'}`} valor={c.papel} onMudar={(v) => muda(i, { papel: v })} opcoes={papeis.map((x) => ({ valor: x, rotulo: x }))} />
                <CampoTexto valor={c.whatsapp ?? ''} onMudar={(v) => muda(i, { whatsapp: v || undefined })} placeholder="WhatsApp" aria-label={`WhatsApp de ${c.nome || 'contato'}`} />
                <CampoTexto valor={c.email ?? ''} onMudar={(v) => muda(i, { email: v || undefined })} placeholder="E-mail" aria-label={`E-mail de ${c.nome || 'contato'}`} />
              </div>
              <Fichas rotulo={`Assuntos de ${c.nome || 'contato'}`} valores={c.assuntos} onMudar={(v) => muda(i, { assuntos: v })} opcoes={assuntos} />
              <div className="flex items-center gap-2">
                <Interruptor ligado={!!c.app} onMudar={(v) => muda(i, { app: v })} rotulo="Usa o app do cliente" />
                <Button type="button" size="sm" variant="ghost" className="text-destructive ml-auto rounded-full" onClick={() => setContatos((xs) => xs.filter((_, k) => k !== i))}>
                  Tirar
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setContatos((xs) => [...xs, { nome: '', papel: 'financeiro', assuntos: [] }])}>
            Adicionar contato
          </Button>
          {semAssunto.length > 0 && <p className="text-muted-foreground text-xs">Sem ninguém: {semAssunto.map((a) => a.rotulo).join(', ')}. Esses assuntos vão para o sócio.</p>}
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Responsáveis no escritório</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {setoresEquipe.map((s) => (
              <Campo key={s} rotulo={rotuloSetorCurto[s]}>
                {(id) => <CampoEscolha id={id} valor={resp[s] ?? ''} onMudar={(v) => setResp({ ...resp, [s]: v || undefined })} opcoes={[{ valor: '', rotulo: 'padrão do setor' }, ...pessoasDo(s).map((n) => ({ valor: n, rotulo: n }))]} />}
              </Campo>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Serviços extras no app do cliente</h3>
          <p className="text-muted-foreground text-xs">Ativo: o cliente usa. Disponível: aparece com “tenho interesse”. Oculto: não aparece. O cliente nunca ativa sozinho (06, 8).</p>
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {catalogoServicos.map((sv) => (
              <div key={sv.id} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 text-sm">
                  {sv.nome} <span className="text-muted-foreground text-[11px]">· fase {sv.fase}</span>
                </span>
                <div className="w-32 shrink-0">
                  <CampoEscolha
                    rotulo={`Estado de ${sv.nome}`}
                    valor={servicos[sv.id] ?? 'disponivel'}
                    onMudar={(v) => setServicos({ ...servicos, [sv.id]: v as EstadoServico })}
                    opcoes={(['ativo', 'disponivel', 'oculto'] as const).map((e) => ({ valor: e, rotulo: rotuloEstadoServico[e] }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </fieldset>
      {!pode && <p className="text-muted-foreground text-xs">Só Gestor e Administrador mudam a ficha; você vê.</p>}
    </GavetaFormulario>
  )
}
