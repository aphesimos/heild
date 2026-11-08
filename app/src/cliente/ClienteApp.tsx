import {
  ArrowLeftIcon,
  BellIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  ChartBarIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  CopyIcon,
  DotsThreeOutlineIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  HouseIcon,
  ListChecksIcon,
  PaperclipIcon,
  PaperPlaneTiltIcon,
  PlusIcon,
  ReceiptIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SparkleIcon,
  StorefrontIcon,
  WalletIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { fichas, type ContatoCliente, type FichaCliente } from '@/ambiente/clientes'
import { useConversaDe } from '@/ambiente/fluxos'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { SiglaMarca } from '@/components/compostos/barra-lateral'
import { ehHeild, Marca } from '@/components/compostos/marca'
import { Button } from '@/components/ui/button'
import { CampoEscolha, CampoTexto } from '@/components/ui/formulario'
import { usuariosCfg } from '@/dados/configuracoes'
import type { ItemConversa } from '@/dados/crm'
import * as exemplo from '@/dados/exemplo'
import { faturasDoCenario, rotuloFatura } from '@/dados/financeiro'
import { fiscalDe } from '@/dados/painel'
import { societarioDe } from '@/dados/painel-abas'
import type { Tarefa } from '@/dados/tipos'
import { PaginaDocumento } from '@/components/compostos/visualizador-documento'
import { P, tipoPeloNome, visivelAoCliente, type Documento } from '@/dados/arquivos'
import { cn } from '@/lib/utils'
import { Servicos, TelaServico, useServicos } from './servicos'
import { AprovacoesApp, CaixaApp, PropostaAlcadaApp, useLotesAbertos } from './bpo'
import { useTema } from '@/theme/ThemeProvider'
import type { SetorIntegrante } from '@/theme/tipos'

/* ---------- Quem usa o app (06, 2): as pessoas dos clientes com acesso, e as empresas de cada uma ---------- */

export interface PessoaApp {
  nome: string
  empresas: { clienteId: string; contato: ContatoCliente }[]
}

/** Pessoas com acesso, pela ficha atual (o escritório liga e desliga o app de cada contato). */
export function pessoasDoApp(fichaDe: (id: string) => FichaCliente | undefined = (id) => fichas[id]): PessoaApp[] {
  const mapa = new Map<string, PessoaApp>()
  for (const id of Object.keys(fichas)) {
    const f = fichaDe(id)
    if (!f) continue
    for (const c of f.contatos) {
      if (!c.app) continue
      const p = mapa.get(c.nome) ?? { nome: c.nome, empresas: [] }
      p.empresas.push({ clienteId: f.id, contato: c })
      mapa.set(c.nome, p)
    }
  }
  return [...mapa.values()]
}

export type Area = 'guias' | 'folha' | 'financeiro' | 'societario' | 'documentos' | 'bpo'
/**
 * 06, 2.4: o papel define as áreas; o RH não vê guias nem honorários; o financeiro não vê folha.
 * BPO (10, 3.6): quem tem alçada de pagamento vê Aprovações e Fluxo de caixa; a empresa só de BPO
 * não tem as áreas da contabilidade.
 */
function areasDo(c: ContatoCliente, servicos?: ('contabil' | 'bpo')[]): Area[] {
  const bpo: Area[] = servicos?.includes('bpo') && (c.alcadaPagamento ?? 0) > 0 ? ['bpo'] : []
  if (servicos && !servicos.includes('contabil')) return [...(c.papel === 'financeiro' ? [] : (['financeiro'] as Area[])), 'documentos', ...bpo]
  if (c.papel === 'RH') return ['folha']
  if (c.papel === 'financeiro' || c.papel === 'diretor financeiro') return ['guias', 'financeiro', 'documentos', ...bpo]
  if (c.papel === 'fiscal da empresa') return ['guias', 'documentos']
  return ['guias', 'folha', 'financeiro', 'societario', 'documentos', ...bpo]
}
const setoresDas = (areas: Area[]): SetorIntegrante[] => [
  ...(areas.includes('guias') ? (['fiscal', 'notas', 'contabil'] as const) : []),
  ...(areas.includes('folha') ? (['dp'] as const) : []),
  ...(areas.includes('societario') ? (['societario', 'consultor'] as const) : []),
  ...(areas.includes('bpo') ? (['bpo_financeiro'] as const) : []),
  'gestao_atendimento',
]
const nomeSetor: Partial<Record<SetorIntegrante, string>> = {
  fiscal: 'Fiscal',
  notas: 'Notas fiscais',
  contabil: 'Contábil',
  dp: 'Departamento Pessoal',
  societario: 'Societário',
  consultor: 'Consultoria',
  gestao_atendimento: 'Atendimento',
  bpo_financeiro: 'BPO Financeiro',
}
export const primeiroNome = (n: string) => n.replace('Dra. ', '').split(' ')[0]
export const idDoUsuario = (nome?: string) => usuariosCfg.find((u) => u.nome === nome)?.id

export type Tela = 'inicio' | 'documentos' | 'pendencias' | 'conversa' | 'mais' | 'pedidos' | 'financeiro' | 'empresa' | 'agenda' | 'servicos' | 'servico' | 'aprovacoes' | 'caixa'

/* ---------- Casca: login, seletor de empresa, menu inferior ---------- */

/**
 * App do cliente (subplano 06), web instalável. Usa a mesma loja do escritório:
 * o que o cliente envia vira mensagem na conversa do CRM, item recebido na
 * tarefa e aviso para quem responde; o que o escritório manda aparece aqui.
 */
export function ClienteApp({ pessoa, onEntrar, onSair }: { pessoa: string | null; onEntrar: (nome: string) => void; onSair: () => void }) {
  const loja = useLoja()
  const p = pessoasDoApp(loja.fichaDe).find((x) => x.nome === pessoa)
  if (!p) return <LoginApp onEntrar={onEntrar} />
  return <AppDaPessoa key={p.nome} pessoa={p} onSair={onSair} />
}

function LoginApp({ onEntrar }: { onEntrar: (nome: string) => void }) {
  const { tema } = useTema()
  const pessoas = pessoasDoApp(useLoja().fichaDe)
  const [contato, setContato] = useState('')
  const [passo, setPasso] = useState<'contato' | 'codigo'>('contato')
  const [codigo, setCodigo] = useState('')
  const alvo = pessoas.find((x) => x.empresas.some((e) => e.contato.whatsapp === contato || e.contato.email === contato))
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-6 py-10 [&>*]:shrink-0">
      <div className="-ml-2 flex items-center gap-2.5">
        {ehHeild(tema) ? <Marca /> : <SiglaMarca />}
        <span>
          {!ehHeild(tema) && <span className="block font-medium">{tema.nome_produto}</span>}
          <span className="text-muted-foreground block text-xs">app.contabilandrade.com.br</span>
        </span>
      </div>
      {passo === 'contato' ? (
        <>
          <h1 className="text-2xl font-light tracking-tight">Entrar</h1>
          <p className="text-muted-foreground text-sm">Use o WhatsApp ou o e-mail que o escritório tem de você. Mandamos um código de 6 números.</p>
          <input
            aria-label="WhatsApp ou e-mail"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            placeholder="+55 11 9…  ou  voce@empresa.com.br"
            className="bg-raised shadow-contorno h-11 rounded-[12px] px-3 text-sm outline-none"
          />
          <Button className="rounded-full" disabled={!alvo} onClick={() => setPasso('codigo')}>
            Receber código
          </Button>
          {contato && !alvo && <p className="text-destructive text-xs">Não achamos esse contato. Peça o convite ao escritório.</p>}
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="text-muted-foreground text-xs">Na demonstração, toque em uma pessoa:</p>
            {pessoas.map((x) => (
              <button
                key={x.nome}
                type="button"
                onClick={() => setContato(x.empresas[0].contato.whatsapp ?? x.empresas[0].contato.email ?? '')}
                className="bg-raised shadow-cartao flex cursor-pointer flex-col rounded-[14px] px-3 py-2 text-left text-sm"
              >
                <span className="font-medium">{x.nome}</span>
                <span className="text-muted-foreground text-xs">{x.empresas.map((e) => `${exemplo.clientes.find((c) => c.id === e.clienteId)?.nome} (${e.contato.papel})`).join(' · ')}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-light tracking-tight">Código</h1>
          <p className="text-muted-foreground text-sm">Enviamos para {contato}. Vale por 10 minutos. Na demonstração, qualquer sequência de 6 números entra.</p>
          <input
            aria-label="Código"
            inputMode="numeric"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="bg-raised shadow-contorno h-11 rounded-[12px] px-3 font-mono text-lg tracking-[0.4em] outline-none"
          />
          <Button className="rounded-full" disabled={codigo.length !== 6} onClick={() => alvo && onEntrar(alvo.nome)}>
            Entrar
          </Button>
          <button type="button" className="text-muted-foreground cursor-pointer text-sm" onClick={() => setPasso('contato')}>
            Voltar
          </button>
        </>
      )}
    </div>
  )
}

export interface Ctx {
  clienteId: string
  clienteNome: string
  contato: ContatoCliente
  areas: Area[]
  setores: SetorIntegrante[]
  avisarApp: (t: string) => void
  ir: (t: Tela) => void
  abrirConversa: (setor: SetorIntegrante) => void
  abrirServico: (id: string) => void
}

function AppDaPessoa({ pessoa, onSair }: { pessoa: PessoaApp; onSair: () => void }) {
  const loja = useLoja()
  const [empresaIdx, setEmpresaIdx] = useState(0)
  const [tela, setTela] = useState<Tela>('inicio')
  const [seletor, setSeletor] = useState(false)
  const [sino, setSino] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [setorConversa, setSetorConversa] = useState<SetorIntegrante | null>(null)
  const [servicoId, setServicoId] = useState<string | null>(null)
  const emp = pessoa.empresas[empresaIdx]
  const cliente = exemplo.clientes.find((c) => c.id === emp.clienteId)!
  const areas = areasDo(emp.contato, cliente.servicos)
  const ctx: Ctx = {
    clienteId: cliente.id,
    clienteNome: cliente.nome,
    contato: emp.contato,
    areas,
    setores: setoresDas(areas),
    avisarApp: (t) => {
      setAviso(t)
      setTimeout(() => setAviso(null), 4000)
    },
    ir: (t) => {
      setTela(t)
      setSetorConversa(null)
    },
    abrirConversa: (s) => {
      setTela('conversa')
      setSetorConversa(s)
    },
    abrirServico: (id) => {
      setServicoId(id)
      setTela('servico')
    },
  }
  // Notificações: o que o escritório mandou nas conversas da empresa.
  const recebidas = loja.conversas
    .filter((c) => c.clienteId === cliente.id && ctx.setores.includes(c.setor))
    .flatMap((c) => c.itens.filter((i): i is Extract<ItemConversa, { tipo: 'mensagem' }> => i.tipo === 'mensagem' && i.de !== 'cliente').map((i) => ({ ...i, setor: c.setor })))
    .slice(-6)
    .reverse()
  const outras = pessoa.empresas.filter((_, i) => i !== empresaIdx)

  return (
    <div className="relative flex h-full flex-col">
      <header className="flex items-center gap-2 border-b px-4 pt-3 pb-2.5">
        <button type="button" onClick={() => setSeletor(!seletor)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left" aria-label="Trocar empresa">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{cliente.nome}</span>
            <span className="text-muted-foreground block text-[11px]">
              {pessoa.nome} · {emp.contato.papel}
            </span>
          </span>
          {pessoa.empresas.length > 1 && <CaretDownIcon className="size-4 shrink-0" />}
        </button>
        <button type="button" aria-label="Notificações" onClick={() => setSino(!sino)} className="hover:bg-sunken relative cursor-pointer rounded-full p-2">
          <BellIcon className="size-5" weight="duotone" />
          {recebidas.length > 0 && <span className="bg-destructive absolute top-1.5 right-1.5 size-2 rounded-full" />}
        </button>
      </header>

      {seletor && pessoa.empresas.length > 1 && (
        <div className="bg-surface shadow-painel absolute top-14 right-3 left-3 z-20 flex flex-col rounded-[16px] p-1.5">
          {pessoa.empresas.map((e, i) => (
            <button
              key={e.clienteId}
              type="button"
              onClick={() => {
                setEmpresaIdx(i)
                setSeletor(false)
                setTela('inicio')
              }}
              className={cn('cursor-pointer rounded-[12px] px-3 py-2 text-left text-sm', i === empresaIdx ? 'bg-sunken font-medium' : 'hover:bg-sunken/60')}
            >
              {exemplo.clientes.find((c) => c.id === e.clienteId)?.nome} <span className="text-muted-foreground text-xs">· {e.contato.papel}</span>
            </button>
          ))}
        </div>
      )}
      {sino && (
        <div className="bg-surface shadow-painel absolute top-14 right-3 left-3 z-20 flex max-h-[60%] flex-col overflow-y-auto rounded-[16px] p-2">
          <p className="px-2 py-1 text-sm font-medium">Do escritório</p>
          {recebidas.length === 0 && <p className="text-muted-foreground px-2 py-4 text-sm">Nada novo.</p>}
          {recebidas.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSino(false)
                ctx.abrirConversa(m.setor)
              }}
              className="hover:bg-sunken/60 cursor-pointer rounded-[12px] px-2 py-2 text-left text-sm"
            >
              <span className="text-muted-foreground block text-[11px]">
                {nomeSetor[m.setor]} · {m.hora}
              </span>
              <span className="line-clamp-2">{m.texto}</span>
            </button>
          ))}
        </div>
      )}

      <main className="area-rolagem-dupla min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {tela === 'inicio' && <Inicio ctx={ctx} pessoa={pessoa.nome} outras={outras.map((o) => exemplo.clientes.find((c) => c.id === o.clienteId)?.nome ?? '')} />}
        {tela === 'documentos' && <Documentos ctx={ctx} />}
        {tela === 'pendencias' && <Pendencias ctx={ctx} />}
        {tela === 'conversa' && <Conversa ctx={ctx} setor={setorConversa} onSetor={setSetorConversa} />}
        {tela === 'pedidos' && <Pedidos ctx={ctx} />}
        {tela === 'financeiro' && <Financeiro ctx={ctx} />}
        {tela === 'empresa' && <Empresa ctx={ctx} />}
        {tela === 'agenda' && <Agenda ctx={ctx} />}
        {tela === 'servicos' && <Servicos ctx={ctx} />}
        {tela === 'servico' && servicoId && <TelaServico key={servicoId} ctx={ctx} id={servicoId} />}
        {tela === 'mais' && <Mais ctx={ctx} onSair={onSair} />}
        {tela === 'aprovacoes' && <AprovacoesApp ctx={ctx} />}
        {tela === 'caixa' && <CaixaApp ctx={ctx} />}
      </main>

      {aviso && (
        <div className="bg-foreground text-background absolute right-3 bottom-20 left-3 z-30 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm shadow-lg">
          <CheckCircleIcon className="mt-0.5 size-4 shrink-0" weight="fill" /> {aviso}
        </div>
      )}

      <nav className="grid grid-cols-5 border-t px-1 pt-1.5 pb-2" aria-label="Menu do app">
        {(
          [
            ['inicio', 'Início', HouseIcon],
            ['documentos', 'Docs', FileTextIcon],
            ['pendencias', 'Pendências', ListChecksIcon],
            ['conversa', 'Conversa', ChatCircleDotsIcon],
            ['mais', 'Mais', DotsThreeOutlineIcon],
          ] as const
        ).map(([id, rotulo, I]) => {
          const ativo = tela === id || (id === 'mais' && ['pedidos', 'financeiro', 'empresa', 'agenda', 'servicos', 'servico', 'aprovacoes', 'caixa'].includes(tela))
          return (
            <button
              key={id}
              type="button"
              onClick={() => ctx.ir(id)}
              aria-current={ativo || undefined}
              className={cn('flex cursor-pointer flex-col items-center gap-0.5 rounded-[12px] py-1 text-[11px]', ativo ? 'text-foreground font-medium' : 'text-muted-foreground')}
            >
              <I className="size-5" weight={ativo ? 'fill' : 'regular'} /> {rotulo}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* ---------- Peças ---------- */

export function Bloco({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-surface shadow-cartao flex flex-col gap-2 rounded-[20px] p-3.5">
      <header className="flex items-center gap-2">
        <h2 className="flex-1 text-sm font-medium">{titulo}</h2>
        {acao}
      </header>
      {children}
    </section>
  )
}

export function TituloTela({ children, voltar }: { children: ReactNode; voltar?: () => void }) {
  return (
    <h1 className="mb-3 flex items-center gap-2 text-xl font-light tracking-tight">
      {voltar && (
        <button type="button" aria-label="Voltar" onClick={voltar} className="hover:bg-sunken cursor-pointer rounded-full p-1">
          <ArrowLeftIcon className="size-5" />
        </button>
      )}
      {children}
    </h1>
  )
}

/** Como o cliente lê a pendência: o que mandar, não o nome interno da tarefa. */
const pedidoPorCodigo: Record<string, string> = {
  'DP-001': 'Documentos das 2 admissões (RG, CPF, CTPS e exame admissional)',
  'FIS-009': 'Notas de outubro, para fechar o PGDAS-D',
  'CTB-002': 'Extrato bancário de outubro',
  'NFE-021': 'XML das 3 compras sem nota',
  'FIS-038': 'Documentos do CT-e 0912 para a resposta à SEFAZ',
  'SOC-009': 'Certificado digital novo (A1)',
}
export const oQueMandar = (t: Tarefa) => pedidoPorCodigo[t.codigo] ?? t.titulo.replace(/^(Cobrar|Pedir) /, '').replace(/^./, (c) => c.toUpperCase())

/** Pendências da empresa: tarefas do escritório esperando o cliente, nos setores que o papel vê (06, 4.1). */
function usePendencias(ctx: Ctx) {
  const loja = useLoja()
  return loja.tarefas.filter((t) => t.cliente === ctx.clienteNome && t.status === 'aguardando_cliente' && ctx.setores.includes(t.setor))
}

/** Responder a uma pendência: arquivo recebido, tarefa volta a andar, conversa e aviso ao responsável. */
function useEnviarPendencia(ctx: Ctx) {
  const loja = useLoja()
  const conversaDe = useConversaDe()
  return (t: Tarefa, oQue: string) => {
    const conversa = t.conversa ?? conversaDe(ctx.clienteNome, t.setor, ctx.contato.nome)
    const arquivo = `${oQue.split(/[,(]/)[0].trim()}.pdf`
    // O arquivo entra no índice (trabalho interno da competência): é o mesmo que abre do anexo no CRM e de Arquivos.
    loja.adicionarDocumento({
      nome: arquivo,
      clienteId: ctx.clienteId,
      pasta: P.interno(),
      tipo: tipoPeloNome(oQue),
      competencia: '10/2026',
      origem: 'upload_cliente_app',
      conector: 'a1',
      tamanho: '320 KB',
      quando: 'hoje',
      por: `${ctx.contato.nome} (cliente)`,
    })
    loja.mensagemCrm(conversa, {
      tipo: 'mensagem',
      de: 'cliente',
      autor: primeiroNome(ctx.contato.nome),
      canal: 'app',
      texto: `Enviei pelo app: ${oQue.charAt(0).toLowerCase() + oQue.slice(1)}.`,
      anexos: [{ nome: arquivo, tipo: 'pdf' }],
    })
    loja.statusConversa(conversa, 'em_atendimento')
    loja.atualizarTarefa(t.id, { status: 'em_andamento', diasAguardando: undefined })
    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Enviou “${oQue}” para ${t.codigo} · ${ctx.clienteNome}`)
    const resp = fichas[ctx.clienteId]?.responsaveis[t.setor]
    loja.avisar({
      para: [idDoUsuario(resp) ?? 'u1'],
      tipo: 'cliente',
      setor: t.setor,
      titulo: `${ctx.contato.nome} enviou pelo app: ${oQue.split(/[,(]/)[0].trim().toLowerCase()}`,
      detalhe: `${ctx.clienteNome} · ${t.codigo} voltou a andar`,
      destino: { modulo: 'crm', aba: 'conversas', conversa },
    })
    ctx.avisarApp(`Recebido. Protocolo ${Math.floor(Math.random() * 90000 + 10000)} · o escritório já foi avisado.`)
  }
}

function Inicio({ ctx, pessoa, outras }: { ctx: Ctx; pessoa: string; outras: string[] }) {
  const servicosAtivos = useServicos(ctx).ativos
  const pend = usePendencias(ctx)
  const enviar = useEnviarPendencia(ctx)
  const loja = useLoja()
  const [pagas, setPagas] = usePersistente<string[]>(`app.pagas.${ctx.clienteId}`, [])
  const fis = fiscalDe(ctx.clienteId)
  const cert = societarioDe(ctx.clienteId).certificados[0]
  const guias = ctx.areas.includes('guias') ? fis.guias.filter((g) => !g.paga && g.valor !== '—' && !pagas.includes(g.id)) : []
  const pedidos = loja.tarefas.filter((t) => t.cliente === ctx.clienteNome && t.origem === 'pedido_cliente' && t.status !== 'concluida')
  const lotes = useLotesAbertos(ctx)
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-light">Olá, {primeiroNome(pessoa)}. Hoje é 18/11.</p>
      {servicosAtivos.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {servicosAtivos.map((sv) => (
            <button key={sv.id} type="button" onClick={() => ctx.abrirServico(sv.id)} className="bg-surface shadow-cartao flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs whitespace-nowrap">
              <SparkleIcon className="size-3.5" /> {sv.atalho ?? sv.nome}
            </button>
          ))}
        </div>
      )}
      {pend.length > 0 && (
        <Bloco titulo={`O escritório precisa de você (${pend.length})`}>
          {pend.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block">{oQueMandar(t)}</span>
                <span className="text-muted-foreground block text-xs">{t.diasAguardando ? `há ${t.diasAguardando} dias` : 'hoje'}</span>
              </span>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => enviar(t, oQueMandar(t))}>
                <PaperclipIcon /> Enviar
              </Button>
            </div>
          ))}
        </Bloco>
      )}
      {ctx.areas.includes('bpo') && <PropostaAlcadaApp ctx={ctx} />}
      {ctx.areas.includes('bpo') && lotes.length > 0 && (
        <Bloco titulo={`Pagamentos para aprovar (${lotes.length})`}>
          {lotes.map((l) => (
            <div key={l.id} className="flex items-center gap-2 text-sm">
              <SealCheckIcon className="text-muted-foreground size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block">{l.titulo}</span>
                <span className="text-muted-foreground block text-xs">{l.itens.reduce((t, i) => t + i.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })} · preparado pelo escritório</span>
              </span>
              <Button size="sm" className="rounded-full" onClick={() => ctx.ir('aprovacoes')}>
                Ver
              </Button>
            </div>
          ))}
        </Bloco>
      )}
      {cert && cert.dias < 30 && ctx.areas.includes('societario') && (
        <Bloco titulo="Certificado digital">
          <p className="text-sm">
            O {cert.tipo} vence em <strong className="font-medium">{cert.dias} dias</strong>. Sem ele, a captura de notas para.
          </p>
          <Button size="sm" className="w-fit rounded-full" onClick={() => ctx.ir('empresa')}>
            <ShieldCheckIcon /> Renovar agora
          </Button>
        </Bloco>
      )}
      {guias.length > 0 && (
        <Bloco titulo="Próximos vencimentos">
          {guias.map((g) => (
            <div key={g.id} className="flex items-center gap-2 text-sm">
              <ReceiptIcon className="text-muted-foreground size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block">
                  {g.tributo} {g.competencia}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {g.valor} · vence {g.vencimento}
                  {!g.enviada && ' · em preparo no escritório'}
                </span>
              </span>
              {g.enviada && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => {
                    setPagas((x) => [...x, g.id])
                    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Informou pagamento de ${g.tributo} ${g.competencia} (${ctx.clienteNome})`)
                    ctx.avisarApp('Anotado. A régua de cobrança desta guia para; a baixa confirma na conciliação.')
                  }}
                >
                  Já paguei
                </Button>
              )}
            </div>
          ))}
        </Bloco>
      )}
      <Bloco titulo="Aviso do escritório">
        <p className="text-sm">Feriado em 20/11 (Consciência Negra): sem expediente. Variáveis da folha até 25/11.</p>
      </Bloco>
      {pedidos.length > 0 && (
        <button type="button" onClick={() => ctx.ir('pedidos')} className="text-muted-foreground cursor-pointer text-left text-sm underline-offset-2 hover:underline">
          Pedidos em andamento ({pedidos.length}) ›
        </button>
      )}
      {outras.length > 0 && <p className="text-muted-foreground text-xs">Outras empresas: {outras.join(', ')} (troque no topo).</p>}
      {pend.length === 0 && guias.length === 0 && lotes.length === 0 && <p className="text-muted-foreground text-center text-sm">Tudo em dia por aqui. Nada pendente com você este mês.</p>}
    </div>
  )
}

/** Área do papel que vê cada tipo (06, 2.4; segundo filtro sobre a pasta visível, Fundações 7.8). */
const areaDoTipo = (t: Documento['tipo']): Area =>
  t === 'guia' || t === 'recibo' ? 'guias' : t === 'holerite' || t === 'folha' ? 'folha' : t === 'contrato' || t === 'procuracao' || t === 'certidao' || t === 'cadastro' ? 'societario' : 'documentos'
const grupoDoc = (t: Documento['tipo']) => (t === 'guia' || t === 'recibo' ? 'guias' : t === 'holerite' || t === 'folha' ? 'folha' : t === 'contrato' || t === 'procuracao' || t === 'certidao' || t === 'cadastro' ? 'empresa' : 'relatorios')
const rotuloGrupo = { todos: 'Todos', guias: 'Guias', folha: 'Folha', relatorios: 'Relatórios', empresa: 'Empresa' } as const

/** Documentos visíveis desta empresa para o papel da pessoa: os mesmos arquivos das pastas do escritório. */
function useDocsDoCliente(ctx: Ctx) {
  const loja = useLoja()
  return loja.documentos.filter((d) => d.clienteId === ctx.clienteId && visivelAoCliente(d) && ctx.areas.includes(areaDoTipo(d.tipo)))
}

/** Registro de entrega (Fundações 7.7): abrir e baixar pelo app ficam no arquivo, para o escritório ver. */
function useEntrega(ctx: Ctx) {
  const loja = useLoja()
  return (d: Documento, acao: 'visto' | 'baixado') => {
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    loja.ajustarDocumento(d.id, { entregas: [...(d.entregas ?? []), { quem: ctx.contato.nome, acao, quando: `hoje ${agora}` }] })
    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `${acao === 'visto' ? 'Abriu' : 'Baixou'} ${d.nome} (${ctx.clienteNome})`)
  }
}

function Documentos({ ctx }: { ctx: Ctx }) {
  const docs = useDocsDoCliente(ctx)
  const entrega = useEntrega(ctx)
  const [filtro, setFiltro] = useState<keyof typeof rotuloGrupo>('todos')
  const [aberto, setAberto] = useState<Documento | null>(null)
  const lista = docs.filter((d) => filtro === 'todos' || grupoDoc(d.tipo) === filtro)
  if (aberto)
    return (
      <div className="flex flex-col gap-3">
        <TituloTela voltar={() => setAberto(null)}>{aberto.nome.replace(/\.\w+$/, '')}</TituloTela>
        <PaginaDocumento d={aberto} />
        <div className="flex gap-2">
          <Button
            className="flex-1 rounded-full"
            onClick={() => {
              entrega(aberto, 'baixado')
              ctx.avisarApp(`${aberto.nome} baixado. O escritório vê que chegou.`)
            }}
          >
            <DownloadSimpleIcon /> Baixar
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => ctx.avisarApp('Enviado para o seu e-mail.')}>
            Mandar por e-mail
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          {aberto.competencia ? `Competência ${aberto.competencia} · ` : ''}enviado em {aberto.quando} · impressão digital {aberto.hash.slice(0, 8)}
        </p>
      </div>
    )
  return (
    <div className="flex flex-col gap-3">
      <TituloTela>Documentos</TituloTela>
      <div className="flex gap-1.5 overflow-x-auto text-xs">
        {(Object.keys(rotuloGrupo) as (keyof typeof rotuloGrupo)[])
          .filter((f) => f === 'todos' || docs.some((d) => grupoDoc(d.tipo) === f))
          .map((f) => (
            <button key={f} type="button" onClick={() => setFiltro(f)} aria-pressed={filtro === f} className={cn('cursor-pointer rounded-full px-3 py-1.5 whitespace-nowrap', filtro === f ? 'bg-foreground text-background' : 'bg-sunken')}>
              {rotuloGrupo[f]}
            </button>
          ))}
      </div>
      <Bloco titulo="Da sua empresa">
        {lista.length === 0 && <p className="text-muted-foreground text-sm">Nada nesta área para o seu papel.</p>}
        {lista.map((d) => {
          const visto = (d.entregas ?? []).some((e) => e.quem === ctx.contato.nome && (e.acao === 'visto' || e.acao === 'baixado'))
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setAberto(d)
                if (!visto) entrega(d, 'visto')
              }}
              className="hover:bg-sunken/50 -mx-1.5 flex cursor-pointer items-center gap-2 rounded-[12px] px-1.5 py-1 text-left text-sm"
            >
              <FileTextIcon className="text-muted-foreground size-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{d.nome}</span>
                <span className="text-muted-foreground block text-xs">
                  {d.competencia ?? d.quando} · {visto ? 'aberto' : 'novo'}
                </span>
              </span>
              {!visto && <span className="bg-destructive size-2 shrink-0 rounded-full" aria-label="novo" />}
            </button>
          )
        })}
      </Bloco>
    </div>
  )
}

function Pendencias({ ctx }: { ctx: Ctx }) {
  const pend = usePendencias(ctx)
  const enviar = useEnviarPendencia(ctx)
  const loja = useLoja()
  return (
    <div className="flex flex-col gap-3">
      <TituloTela>Pendências</TituloTela>
      {pend.length === 0 && <p className="text-muted-foreground text-sm">Nada pendente com você. Quando o escritório precisar de algo, aparece aqui e no seu WhatsApp.</p>}
      {pend.map((t) => (
        <Bloco key={t.id} titulo={oQueMandar(t)}>
          <p className="text-muted-foreground text-xs">
            {nomeSetor[t.setor]} · prazo {t.prazo}
            {t.diasAguardando ? ` · pedido há ${t.diasAguardando} dias` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="rounded-full" onClick={() => enviar(t, oQueMandar(t))}>
              <PaperclipIcon /> Enviar arquivo ou foto
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                const conversa = t.conversa
                if (conversa) loja.mensagemCrm(conversa, { tipo: 'mensagem', de: 'cliente', autor: primeiroNome(ctx.contato.nome), canal: 'app', texto: `Sobre “${oQueMandar(t)}”: não tenho isso. Podemos conversar?` })
                ctx.avisarApp('Avisamos o escritório; a resposta chega na conversa.')
              }}
            >
              Não tenho isso
            </Button>
          </div>
        </Bloco>
      ))}
    </div>
  )
}

function Conversa({ ctx, setor, onSetor }: { ctx: Ctx; setor: SetorIntegrante | null; onSetor: (s: SetorIntegrante | null) => void }) {
  const loja = useLoja()
  const conversaDe = useConversaDe()
  const [texto, setTexto] = useState('')
  const fios = loja.conversas.filter((c) => c.clienteId === ctx.clienteId && ctx.setores.includes(c.setor) && (c.pessoa.nome === ctx.contato.nome || ctx.contato.papel.startsWith('sóci')))
  if (!setor)
    return (
      <div className="flex flex-col gap-3">
        <TituloTela>Conversa</TituloTela>
        {fios.map((c) => (
          <button key={c.id} type="button" onClick={() => onSetor(c.setor)} className="bg-surface shadow-cartao flex cursor-pointer flex-col rounded-[18px] px-3.5 py-3 text-left">
            <span className="text-sm font-medium">{nomeSetor[c.setor]}</span>
            <span className="text-muted-foreground line-clamp-1 text-xs">{c.previa}</span>
          </button>
        ))}
        <Button className="rounded-full" onClick={() => onSetor('gestao_atendimento')}>
          <ChatCircleDotsIcon /> Falar com o escritório
        </Button>
      </div>
    )
  const fio = fios.find((c) => c.setor === setor) ?? loja.conversas.find((c) => c.clienteId === ctx.clienteId && c.setor === setor)
  const itens = (fio?.itens ?? []).filter((i): i is Extract<ItemConversa, { tipo: 'mensagem' }> => i.tipo === 'mensagem' && !i.apagada)
  const enviar = () => {
    const t = texto.trim()
    if (!t) return
    const id = fio?.id ?? conversaDe(ctx.clienteNome, setor, ctx.contato.nome)
    loja.mensagemCrm(id, { tipo: 'mensagem', de: 'cliente', autor: primeiroNome(ctx.contato.nome), canal: 'app', texto: t })
    loja.statusConversa(id, fio?.responsavel ? 'em_atendimento' : 'nova')
    const resp = fichas[ctx.clienteId]?.responsaveis[setor] ?? fio?.responsavel
    loja.avisar({ para: [idDoUsuario(resp) ?? 'u4'], tipo: 'conversa', setor, titulo: `${ctx.contato.nome} (${ctx.clienteNome}) escreveu pelo app`, detalhe: t.slice(0, 80), destino: { modulo: 'crm', aba: 'conversas', conversa: id } })
    setTexto('')
  }
  return (
    <div className="flex min-h-full flex-col gap-2">
      <TituloTela voltar={() => onSetor(null)}>{nomeSetor[setor]}</TituloTela>
      <div className="flex flex-1 flex-col gap-2">
        {itens.length === 0 && <p className="text-muted-foreground text-sm">Escreva sua dúvida ou pedido. Quem cuida do seu {nomeSetor[setor]?.toLowerCase()} responde aqui.</p>}
        {itens.map((m) => (
          <div key={m.id} className={cn('max-w-[85%] rounded-[18px] px-3.5 py-2.5 text-sm', m.de === 'cliente' ? 'bg-foreground text-background self-end' : 'bg-surface shadow-cartao self-start')}>
            {m.de !== 'cliente' && <span className="text-muted-foreground block text-[11px]">{m.de === 'integrante' ? `${m.autor} (assistente do escritório)` : m.autor}</span>}
            {m.texto ?? (m.audio ? `🎤 ${m.audio.transcricao}` : '')}
            {m.anexos?.map((a) => (
              <span key={a.nome} className="mt-1 flex items-center gap-1 text-xs opacity-80">
                <PaperclipIcon className="size-3" /> {a.nome}
              </span>
            ))}
            <span className="mt-0.5 block text-right text-[10px] opacity-60">{m.hora}</span>
          </div>
        ))}
      </div>
      <div className="bg-surface shadow-cartao sticky bottom-0 flex items-center gap-2 rounded-full py-1 pr-1 pl-4">
        <input
          aria-label="Mensagem"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Escreva para o escritório"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <Button size="icon-sm" className="rounded-full" aria-label="Enviar" onClick={enviar} disabled={!texto.trim()}>
          <PaperPlaneTiltIcon />
        </Button>
      </div>
    </div>
  )
}

function Mais({ ctx, onSair }: { ctx: Ctx; onSair: () => void }) {
  const { ativos } = useServicos(ctx)
  const itens: [Tela, string, typeof HouseIcon, boolean][] = [
    ['aprovacoes', 'Aprovações de pagamento', SealCheckIcon, ctx.areas.includes('bpo')],
    ['caixa', 'Fluxo de caixa', ChartBarIcon, ctx.areas.includes('bpo')],
    ['pedidos', 'Pedidos', ListChecksIcon, true],
    ['financeiro', 'Financeiro com o escritório', WalletIcon, ctx.areas.includes('financeiro')],
    ['empresa', 'Empresa', BuildingsIcon, true],
    ['agenda', 'Agendar conversa', CalendarBlankIcon, true],
    ['servicos', 'Serviços', StorefrontIcon, true],
  ]
  return (
    <div className="flex flex-col gap-2">
      <TituloTela>Mais</TituloTela>
      {itens
        .filter((i) => i[3])
        .map(([id, rotulo, I]) => (
          <button key={id} type="button" onClick={() => ctx.ir(id)} className="bg-surface shadow-cartao flex cursor-pointer items-center gap-3 rounded-[16px] px-3.5 py-3 text-left text-sm">
            <I className="size-5" /> {rotulo}
          </button>
        ))}
      {ativos.length > 0 && <p className="text-muted-foreground mt-2 px-1 text-xs font-medium">Seus serviços</p>}
      {ativos.map((sv) => (
        <button key={sv.id} type="button" onClick={() => ctx.abrirServico(sv.id)} className="bg-surface shadow-cartao flex cursor-pointer items-center gap-3 rounded-[16px] px-3.5 py-3 text-left text-sm">
          <SparkleIcon className="size-5" /> {sv.atalho ?? sv.nome}
        </button>
      ))}
      <button type="button" onClick={onSair} className="text-muted-foreground mt-3 flex cursor-pointer items-center gap-2 px-1 text-sm">
        <SignOutIcon className="size-4" /> Sair deste aparelho
      </button>
    </div>
  )
}

const tiposPedido: { tipo: string; codigo: string; setor: SetorIntegrante; area: Area | 'todos'; campo: string }[] = [
  { tipo: 'Admissão', codigo: 'DP-001', setor: 'dp', area: 'folha', campo: 'Cargo e data de início' },
  { tipo: 'Férias', codigo: 'DP-024', setor: 'dp', area: 'folha', campo: 'Quem, início e quantos dias' },
  { tipo: 'Rescisão', codigo: 'DP-026', setor: 'dp', area: 'folha', campo: 'Quem, data e tipo' },
  { tipo: 'Certidão', codigo: 'FIS-036', setor: 'fiscal', area: 'guias', campo: 'Qual e para quê' },
  { tipo: 'Recálculo de guia vencida', codigo: 'FIS-201', setor: 'fiscal', area: 'guias', campo: 'Qual guia e nova data' },
  { tipo: 'Documento da empresa', codigo: 'SOC-034', setor: 'societario', area: 'societario', campo: 'Cartão CNPJ, contrato social, alvará…' },
  { tipo: 'Alteração da empresa', codigo: 'SOC-002', setor: 'societario', area: 'societario', campo: 'O que muda' },
  { tipo: 'Dúvida', codigo: 'CON-001', setor: 'consultor', area: 'todos', campo: 'Sua pergunta' },
]
const statusPedido: Record<Tarefa['status'], string> = { a_fazer: 'em andamento no escritório', em_andamento: 'em andamento no escritório', aguardando_cliente: 'aguardando você', concluida: 'concluído' }

function Pedidos({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const conversaDe = useConversaDe()
  const [novo, setNovo] = useState(false)
  const permitidos = tiposPedido.filter((t) => t.area === 'todos' || ctx.areas.includes(t.area))
  const [tipo, setTipo] = useState(permitidos[0]?.tipo ?? 'Dúvida')
  const [detalhe, setDetalhe] = useState('')
  const meus = loja.tarefas.filter((t) => t.cliente === ctx.clienteNome && t.origem === 'pedido_cliente')
  const abrir = () => {
    const def = tiposPedido.find((t) => t.tipo === tipo)!
    const id = loja.criarTarefa({
      codigo: def.codigo,
      titulo: `${def.tipo}: ${detalhe.trim()}`,
      cliente: ctx.clienteNome,
      setor: def.setor,
      prazo: '24/11',
      status: 'a_fazer',
      origem: 'pedido_cliente',
      responsavel: { tipo: 'integrante', nome: nomeSetor[def.setor] ?? 'Atendimento', setor: def.setor },
    })
    const conversa = conversaDe(ctx.clienteNome, def.setor, ctx.contato.nome)
    loja.atualizarTarefa(id, { conversa })
    loja.mensagemCrm(conversa, { tipo: 'mensagem', de: 'cliente', autor: primeiroNome(ctx.contato.nome), canal: 'app', texto: `Pedido pelo app · ${def.tipo}: ${detalhe.trim()}` })
    const resp = fichas[ctx.clienteId]?.responsaveis[def.setor]
    loja.avisar({ para: [idDoUsuario(resp) ?? 'u1'], tipo: 'cliente', setor: def.setor, titulo: `Pedido novo pelo app: ${def.tipo}`, detalhe: `${ctx.clienteNome} · ${ctx.contato.nome}`, destino: { modulo: 'painel', tarefa: id } })
    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Abriu o pedido ${def.codigo} · ${ctx.clienteNome}`)
    setNovo(false)
    setDetalhe('')
    ctx.avisarApp(`Pedido aberto (${def.codigo}). Previsão: 24/11. Você acompanha aqui.`)
  }
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Pedidos</TituloTela>
      {novo ? (
        <Bloco
          titulo="Novo pedido"
          acao={
            <button type="button" aria-label="Fechar" onClick={() => setNovo(false)} className="cursor-pointer">
              <XIcon className="size-4" />
            </button>
          }
        >
          <CampoEscolha rotulo="Tipo de pedido" valor={tipo} onMudar={setTipo} opcoes={permitidos.map((t) => ({ valor: t.tipo, rotulo: t.tipo }))} />
          <textarea
            aria-label="Detalhes"
            value={detalhe}
            onChange={(e) => setDetalhe(e.target.value)}
            rows={3}
            placeholder={tiposPedido.find((t) => t.tipo === tipo)?.campo}
            className="bg-raised shadow-contorno rounded-[12px] px-3 py-2 text-sm outline-none"
          />
          <Button className="rounded-full" disabled={!detalhe.trim()} onClick={abrir}>
            Abrir pedido
          </Button>
        </Bloco>
      ) : (
        <Button className="rounded-full" onClick={() => setNovo(true)}>
          <PlusIcon /> Novo pedido
        </Button>
      )}
      {meus.length === 0 && <p className="text-muted-foreground text-sm">Nenhum pedido ainda.</p>}
      {meus.map((t) => (
        <Bloco key={t.id} titulo={oQueMandar(t)}>
          <p className="text-muted-foreground text-xs">
            {t.codigo} · {nomeSetor[t.setor]} · {statusPedido[t.status]}
          </p>
          <button type="button" className="w-fit cursor-pointer text-xs underline-offset-2 hover:underline" onClick={() => ctx.abrirConversa(t.setor)}>
            Conversa deste pedido ›
          </button>
        </Bloco>
      ))}
    </div>
  )
}

function Financeiro({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  // As mesmas faturas do Financeiro do escritório, com o que foi pago ou corrigido lá nesta sessão.
  const [todas] = usePersistente(`fin.faturas.${loja.estado.cenario}`, () => faturasDoCenario(loja.estado.cenario))
  const minhas = todas.filter((f) => f.cliente === ctx.clienteNome)
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Financeiro com o escritório</TituloTela>
      {minhas.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma fatura neste ano.</p>}
      {minhas.map((f) => (
        <Bloco
          key={f.id}
          titulo={f.linhas ? `Fatura ${f.competencia}` : `Honorário ${f.competencia}`}
          acao={<span className={cn('rounded-full px-2 py-0.5 text-xs', f.situacao === 'paga' ? 'bg-success/15' : f.situacao === 'vencida' ? 'bg-destructive/15 text-destructive' : 'bg-sunken')}>{rotuloFatura[f.situacao]}</span>}
        >
          <p className="text-sm">
            {f.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · vence {f.vencimento}
          </p>
          {/* Um pagamento só no mês; os serviços em linhas e a nota de cada um (decisão de 8/11/2026). */}
          {f.linhas && (
            <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
              {f.linhas.map((l) => {
                const nota = f.notas?.find((n) => n.servicos.includes(l.servico))
                return (
                  <li key={l.servico} className="flex gap-2">
                    <span className="min-w-0 flex-1">
                      {l.servico}
                      {nota && ` · NFS-e ${nota.numero}`}
                    </span>
                    <span className="text-foreground tabular-nums">{l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </li>
                )
              })}
            </ul>
          )}
          {f.situacao !== 'paga' && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => ctx.avisarApp('Código Pix copiado.')}>
                <CopyIcon /> Copiar Pix
              </Button>
              {f.situacao === 'vencida' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Pediu 2ª via da fatura ${f.competencia} (${ctx.clienteNome})`)
                    ctx.avisarApp('2ª via com juros e multa gerada e enviada ao seu WhatsApp.')
                  }}
                >
                  2ª via atualizada
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  loja.avisar({
                    para: ['u1'],
                    tipo: 'cliente',
                    setor: 'financeiro_escritorio',
                    titulo: `${ctx.clienteNome} contestou a fatura ${f.competencia}`,
                    detalhe: `${ctx.contato.nome} pelo app`,
                    destino: { modulo: 'financeiro', aba: 'cobranca', fatura: f.id },
                  })
                  ctx.avisarApp('Contestação enviada; a régua desta fatura pausa até a resposta.')
                }}
              >
                Contestar
              </Button>
            </div>
          )}
        </Bloco>
      ))}
      <p className="text-muted-foreground text-xs">Um pagamento por mês. Cada serviço tem a sua NFS-e do escritório; o informe anual de retenções sai em fevereiro.</p>
    </div>
  )
}

function Empresa({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const cliente = exemplo.clientes.find((c) => c.id === ctx.clienteId)!
  const soc = societarioDe(ctx.clienteId)
  const cert = soc.certificados[0]
  const [senhaCert, setSenhaCert] = useState('')
  const [renovar, setRenovar] = useState<'nao' | 'termo' | 'arquivo' | 'pronto'>('nao')
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Empresa</TituloTela>
      <Bloco titulo="Dados">
        <p className="text-sm">{cliente.nome}</p>
        <p className="text-muted-foreground text-xs">
          {cliente.documento} · {cliente.regime}
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="w-fit rounded-full"
          onClick={() => {
            loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Pediu alteração de dados (${ctx.clienteNome})`)
            ctx.avisarApp('Pedido de alteração aberto; o Societário confere e responde na conversa.')
          }}
        >
          Pedir alteração
        </Button>
      </Bloco>
      <Bloco titulo="Pessoas com acesso">
        {(fichas[ctx.clienteId]?.contatos ?? []).map((c) => (
          <p key={c.nome} className="text-sm">
            {c.nome}{' '}
            <span className="text-muted-foreground text-xs">
              · {c.papel}
              {c.app ? ' · usa o app' : ''}
            </span>
          </p>
        ))}
      </Bloco>
      {ctx.areas.includes('societario') && (
        <Bloco titulo="Certificado digital">
          {cert ? (
            <>
              <p className="text-sm">
                {cert.tipo} · vence em {cert.validade} ({cert.dias} dias)
              </p>
              <p className="text-muted-foreground text-xs">Usado em: {cert.usos}. O app nunca mostra nem baixa o arquivo.</p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Sem certificado cadastrado.</p>
          )}
          {renovar === 'nao' && (
            <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={() => setRenovar('termo')}>
              <ShieldCheckIcon /> Enviar certificado novo
            </Button>
          )}
          {renovar === 'termo' && (
            <div className="bg-sunken/60 flex flex-col gap-2 rounded-[14px] p-3 text-sm">
              <p>Autorizo o escritório a usar o certificado para: captura de notas e consultas em portais, até o vencimento. Revogo quando quiser.</p>
              <Button size="sm" className="w-fit rounded-full" onClick={() => setRenovar('arquivo')}>
                Concordo
              </Button>
            </div>
          )}
          {renovar === 'arquivo' && (
            <div className="bg-sunken/60 flex flex-col gap-2 rounded-[14px] p-3 text-sm">
              <p>Escolha o arquivo .pfx e digite a senha. Os dois vão direto para o cofre; ninguém vê a senha.</p>
              <CampoTexto aria-label="Senha do certificado" tipo="password" valor={senhaCert} onMudar={setSenhaCert} placeholder="Senha do certificado" />
              <Button
                size="sm"
                className="w-fit rounded-full"
                onClick={() => {
                  setRenovar('pronto')
                  const t = loja.tarefas.find((x) => x.cliente === ctx.clienteNome && /certificado/i.test(x.titulo) && x.status !== 'concluida')
                  if (t) loja.atualizarTarefa(t.id, { status: 'concluida' })
                  loja.avisar({
                    para: [idDoUsuario(fichas[ctx.clienteId]?.responsaveis.societario) ?? 'u4'],
                    tipo: 'cliente',
                    setor: 'societario',
                    titulo: `${ctx.clienteNome} enviou o certificado novo`,
                    detalhe: 'validado: CNPJ confere, cadeia ICP-Brasil ok',
                    destino: t ? { modulo: 'painel', tarefa: t.id } : { modulo: 'painel', aba: 'societario' },
                  })
                  loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Enviou o certificado novo (${ctx.clienteNome})`)
                }}
              >
                Enviar certificado.pfx
              </Button>
            </div>
          )}
          {renovar === 'pronto' && (
            <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm">
              <CheckCircleIcon className="text-success size-4" weight="fill" /> Validado: o CNPJ confere e vale até 11/2027.
            </p>
          )}
        </Bloco>
      )}
      <Bloco titulo="Procurações">
        {soc.acessos.map((a) => (
          <p key={a.orgao + a.servico} className="text-sm">
            {a.orgao}{' '}
            <span className="text-muted-foreground text-xs">
              · {a.servico} · {a.validade}
            </span>
          </p>
        ))}
      </Bloco>
    </div>
  )
}

function Agenda({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const setores = ctx.setores.filter((s) => s !== 'gestao_atendimento' && fichas[ctx.clienteId]?.responsaveis[s])
  const [setor, setSetor] = useState<SetorIntegrante>(setores[0] ?? 'fiscal')
  const [hora, setHora] = useState<string | null>(null)
  const resp = fichas[ctx.clienteId]?.responsaveis[setor]
  const horarios = ['qui 19/11 · 10:00', 'qui 19/11 · 15:30', 'seg 23/11 · 09:00', 'ter 24/11 · 14:00']
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Agendar conversa</TituloTela>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {setores.map((s) => (
          <button key={s} type="button" onClick={() => setSetor(s)} aria-pressed={setor === s} className={cn('cursor-pointer rounded-full px-3 py-1.5', setor === s ? 'bg-foreground text-background' : 'bg-sunken')}>
            {nomeSetor[s]}
          </button>
        ))}
      </div>
      <Bloco titulo={`Horários de ${resp ?? 'quem atende'}`}>
        {horarios.map((h) => (
          <button key={h} type="button" onClick={() => setHora(h)} aria-pressed={hora === h} className={cn('cursor-pointer rounded-[12px] px-3 py-2 text-left text-sm', hora === h ? 'bg-foreground text-background' : 'bg-sunken/60')}>
            {h} · 30 min · vídeo
          </button>
        ))}
        <Button
          className="rounded-full"
          disabled={!hora}
          onClick={() => {
            loja.criarTarefa({
              codigo: 'GES-045',
              titulo: `Reunião com ${ctx.contato.nome} · ${hora}`,
              cliente: ctx.clienteNome,
              setor,
              prazo: hora!.slice(4, 9),
              status: 'a_fazer',
              origem: 'pedido_cliente',
              responsavel: { tipo: 'pessoa', nome: resp ?? 'Fernanda Lima' },
            })
            loja.avisar({
              para: [idDoUsuario(resp) ?? 'u1'],
              tipo: 'cliente',
              setor,
              titulo: `${ctx.contato.nome} marcou reunião: ${hora}`,
              detalhe: `${ctx.clienteNome} · pauta preparada pelo integrante`,
              destino: { modulo: 'painel', aba: setor === 'consultor' ? 'consultoria' : setor },
            })
            ctx.avisarApp(`Marcado: ${hora}. O convite chega no seu e-mail.`)
            setHora(null)
          }}
        >
          Marcar
        </Button>
      </Bloco>
    </div>
  )
}
