import { CheckCircleIcon, LockSimpleIcon, PaperPlaneTiltIcon, SparkleIcon, WarningIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { fichas } from '@/ambiente/clientes'
import { useConversaDe } from '@/ambiente/fluxos'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { Button } from '@/components/ui/button'
import { CampoEscolha } from '@/components/ui/formulario'
import { dpDe, fiscalDe } from '@/dados/painel'
import { catalogoServicos, certidoesDe, emissorDe, painelSocioDe, rotuloEstadoServico, type EstadoServico, type ServicoExtra } from '@/dados/servicos-extras'
import { cn } from '@/lib/utils'
import { Bloco, idDoUsuario, primeiroNome, TituloTela, type Ctx } from './ClienteApp'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const campo = 'bg-raised shadow-contorno h-10 rounded-[12px] px-3 text-sm outline-none'

/** Estado do serviço nesta empresa (ficha do cliente, editável pelo escritório). */
export function useServicos(ctx: Ctx) {
  const loja = useLoja()
  const sv = loja.fichaDe(ctx.clienteId)?.servicos ?? {}
  const estado = (id: string): EstadoServico => sv[id] ?? 'disponivel'
  const podeUsar = (s: ServicoExtra) => s.area === 'todos' || ctx.areas.includes(s.area)
  const visiveis = catalogoServicos.filter((s) => estado(s.id) !== 'oculto')
  const ativos = visiveis.filter((s) => estado(s.id) === 'ativo' && podeUsar(s))
  return { estado, podeUsar, visiveis, ativos }
}

/* ---------- Catálogo (06, 3.10 e 8) ---------- */

export function Servicos({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const conversaDe = useConversaDe()
  const { estado, podeUsar, visiveis } = useServicos(ctx)
  const ehSocio = ctx.areas.includes('societario')
  const pedido = (s: ServicoExtra) => loja.tarefas.find((t) => t.cliente === ctx.clienteNome && t.titulo === `Interesse em ${s.nome}`)
  const interesse = (s: ServicoExtra) => {
    loja.criarTarefa({
      codigo: 'GES-002',
      titulo: `Interesse em ${s.nome}`,
      cliente: ctx.clienteNome,
      setor: 'gestao_atendimento',
      prazo: '24/11',
      status: 'a_fazer',
      origem: 'pedido_cliente',
      responsavel: { tipo: 'pessoa', nome: 'Bruno Costa' },
    })
    const conversa = conversaDe(ctx.clienteNome, 'gestao_atendimento', ctx.contato.nome)
    loja.mensagemCrm(conversa, { tipo: 'mensagem', de: 'cliente', autor: primeiroNome(ctx.contato.nome), canal: 'app', texto: `Tenho interesse em: ${s.nome}.` })
    loja.avisar({
      para: ['u1', 'u4'],
      tipo: 'cliente',
      setor: 'gestao_atendimento',
      titulo: `${ctx.clienteNome} quer ${s.nome}`,
      detalhe: `${ctx.contato.nome} pelo app · ative na ficha do cliente depois de confirmar`,
      destino: { modulo: 'crm', aba: 'conversas', conversa },
    })
    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Pediu o serviço “${s.nome}” (${ctx.clienteNome})`)
    ctx.avisarApp('Interesse enviado. O escritório responde com a proposta na conversa.')
  }
  const grupos: [string, ServicoExtra[]][] = [
    ['Ativos nesta empresa', visiveis.filter((s) => estado(s.id) === 'ativo')],
    ['Disponíveis', visiveis.filter((s) => estado(s.id) === 'disponivel' && s.grupo === 'principal')],
    ['Mais serviços do escritório', visiveis.filter((s) => estado(s.id) === 'disponivel' && s.grupo === 'ideia')],
  ]
  return (
    <div className="flex flex-col gap-3">
      <TituloTela voltar={() => ctx.ir('mais')}>Serviços</TituloTela>
      <p className="text-muted-foreground text-xs">O escritório liga cada serviço para a sua empresa. Pedir aqui não contrata nada: vem uma proposta na conversa.</p>
      {grupos.map(
        ([titulo, lista]) =>
          lista.length > 0 && (
            <div key={titulo} className="flex flex-col gap-2">
              <p className="text-muted-foreground px-1 text-xs font-medium">{titulo}</p>
              {lista.map((s) => {
                const e = estado(s.id)
                const ped = pedido(s)
                return (
                  <Bloco
                    key={s.id}
                    titulo={s.nome}
                    acao={<span className={cn('rounded-full px-2 py-0.5 text-xs whitespace-nowrap', e === 'ativo' ? 'bg-success/15' : 'bg-sunken')}>{ped && e !== 'ativo' ? 'pedido enviado' : rotuloEstadoServico[e]}</span>}
                  >
                    <p className="text-muted-foreground text-xs">{s.entrega}</p>
                    <p className="text-muted-foreground text-[11px]">
                      Precisa: {s.exige} · Cobrança: {s.cobranca}
                    </p>
                    {e === 'ativo' &&
                      (podeUsar(s) && s.atalho ? (
                        <Button size="sm" className="w-fit rounded-full" onClick={() => ctx.abrirServico(s.id)}>
                          {s.atalho}
                        </Button>
                      ) : (
                        !podeUsar(s) && (
                          <p className="text-muted-foreground flex items-center gap-1 text-xs">
                            <LockSimpleIcon className="size-3" /> Ativo; o seu papel ({ctx.contato.papel}) não usa este serviço.
                          </p>
                        )
                      ))}
                    {e === 'disponivel' &&
                      !ped &&
                      (ehSocio || podeUsar(s) ? (
                        <Button size="sm" variant="outline" className="w-fit rounded-full" onClick={() => interesse(s)}>
                          <SparkleIcon /> Tenho interesse
                        </Button>
                      ) : (
                        <p className="text-muted-foreground text-xs">Quem contrata é o sócio.</p>
                      ))}
                  </Bloco>
                )
              })}
            </div>
          ),
      )}
    </div>
  )
}

/* ---------- Telas dos serviços ativos ---------- */

export function TelaServico({ ctx, id }: { ctx: Ctx; id: string }) {
  const s = catalogoServicos.find((x) => x.id === id)!
  const voltar = () => ctx.ir('servicos')
  const corpo = {
    nfse: <Emissor ctx={ctx} />,
    consultor: <Consultor ctx={ctx} />,
    certidoes: <Certidoes ctx={ctx} />,
    painel_socio: <PainelSocio ctx={ctx} />,
    simulador_dp: <SimuladorFolha ctx={ctx} />,
    irpf: <Irpf ctx={ctx} />,
    recalculo: <Recalculo ctx={ctx} />,
    agenda_tributaria: <AgendaTributaria ctx={ctx} />,
    licitacao: <Licitacao ctx={ctx} />,
    certificado_a1: <CompraCertificado ctx={ctx} />,
    reforma: <Reforma ctx={ctx} />,
    conciliacao: <Conciliacao ctx={ctx} />,
    cobranca_clientes: <CobrancaClientes ctx={ctx} />,
    relatorio_anual: <RelatorioAnual ctx={ctx} />,
    conta_digital: <ContaDigital ctx={ctx} />,
  }[id]
  return (
    <div className="flex min-h-full flex-col gap-3">
      <TituloTela voltar={voltar}>{s.nome}</TituloTela>
      {corpo}
    </div>
  )
}

function useRegistro(ctx: Ctx) {
  const loja = useLoja()
  return (texto: string) => loja.registrar(`${ctx.contato.nome} (cliente, app)`, `${texto} (${ctx.clienteNome})`)
}

function Emissor({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const registrar = useRegistro(ctx)
  const cad = emissorDe(ctx.clienteId)
  const notas = loja.notasDe(ctx.clienteId)
  const [tomador, setTomador] = useState(cad.tomadores[0].nome)
  const [servico, setServico] = useState(cad.servicos[0].id)
  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [conferir, setConferir] = useState(false)
  const [cancelar, setCancelar] = useState<number | null>(null)
  const [motivo, setMotivo] = useState('')
  const sv = cad.servicos.find((x) => x.id === servico)!
  const v = Number(valor.replace(/\./g, '').replace(',', '.')) || 0
  const cert = fichas[ctx.clienteId] ? 'certificado A1 no cofre' : 'certificado'
  const resp = idDoUsuario(fichas[ctx.clienteId]?.responsaveis.notas) ?? 'u7'
  const emitir = () => {
    const numero = (notas[0]?.numero ?? 0) + 1
    loja.emitirNota({ numero, tomador, servico: sv.descricao, valor: v, data: '18/11', situacao: 'emitida', clienteId: ctx.clienteId })
    loja.mensagemTime('i-notas', {
      autor: { tipo: 'integrante', setor: 'notas' },
      texto: `${ctx.contato.nome} emitiu pelo app a NFS-e ${numero} da ${ctx.clienteNome}: ${brl(v)} para ${tomador} (${sv.codigo}, ISS ${sv.iss}%). Já entrou na apuração de 11/2026.`,
    })
    loja.avisar({ para: [resp], tipo: 'cliente', setor: 'notas', titulo: `NFS-e ${numero} emitida pelo app`, detalhe: `${ctx.clienteNome} · ${brl(v)} · ${tomador}`, destino: { modulo: 'inicio', aba: 'time', integrante: 'i-notas' } })
    registrar(`Emitiu a NFS-e ${numero} de ${brl(v)} para ${tomador}`)
    ctx.avisarApp(`NFS-e ${numero} autorizada. PDF e XML enviados ao tomador.`)
    setConferir(false)
    setValor('')
    setDescricao('')
  }
  return (
    <>
      <Bloco titulo="Nova nota">
        <CampoEscolha rotulo="Tomador" valor={tomador} onMudar={setTomador} opcoes={cad.tomadores.map((t) => ({ valor: t.nome, rotulo: t.nome }))} />
        <CampoEscolha rotulo="Serviço" valor={servico} onMudar={setServico} opcoes={cad.servicos.map((x) => ({ valor: x.id, rotulo: x.descricao }))} />
        <input aria-label="Valor" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" className={campo} />
        <input aria-label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição na nota (opcional)" className={campo} />
        <p className="text-muted-foreground flex items-start gap-1 text-[11px]">
          <LockSimpleIcon className="mt-0.5 size-3 shrink-0" /> Travado pelo escritório: {sv.codigo}, ISS {sv.iss}%{v ? ` (${brl((v * sv.iss) / 100)})` : ''}, retenções e IBS/CBS pela regra do cadastro. Emite com o {cert}.
        </p>
        {!conferir ? (
          <Button className="rounded-full" disabled={!v} onClick={() => setConferir(true)}>
            Conferir e emitir
          </Button>
        ) : (
          <div className="bg-sunken/60 flex flex-col gap-2 rounded-[14px] p-3 text-sm">
            <p>
              {brl(v)} para {tomador}, {sv.descricao.toLowerCase()}. Depois de emitida, só cancela ou substitui.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full" onClick={emitir}>
                Emitir agora
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConferir(false)}>
                Corrigir
              </Button>
            </div>
          </div>
        )}
      </Bloco>
      <Bloco titulo="Notas de novembro">
        {notas.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma nota ainda.</p>}
        {notas.map((n) => (
          <div key={n.numero} className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <span className={cn('block', n.situacao === 'cancelada' && 'line-through opacity-60')}>
                  NFS-e {n.numero} · {brl(n.valor)}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {n.tomador} · {n.data} · {n.situacao}
                </span>
              </span>
              {n.situacao === 'emitida' && cancelar !== n.numero && (
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setCancelar(n.numero)}>
                  Cancelar
                </Button>
              )}
            </div>
            {cancelar === n.numero && (
              <div className="bg-sunken/60 flex flex-col gap-2 rounded-[12px] p-2.5">
                <input aria-label="Motivo do cancelamento" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo (vai para a prefeitura)" className={campo} />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={motivo.trim().length < 5}
                    onClick={() => {
                      loja.cancelarNota(ctx.clienteId, n.numero)
                      loja.avisar({
                        para: [resp],
                        tipo: 'cliente',
                        setor: 'notas',
                        titulo: `NFS-e ${n.numero} cancelada pelo app`,
                        detalhe: `${ctx.clienteNome} · motivo: ${motivo.trim()}`,
                        destino: { modulo: 'inicio', aba: 'time', integrante: 'i-notas' },
                      })
                      registrar(`Cancelou a NFS-e ${n.numero} (${motivo.trim()})`)
                      ctx.avisarApp(`NFS-e ${n.numero} cancelada. A apuração já foi refeita.`)
                      setCancelar(null)
                      setMotivo('')
                    }}
                  >
                    Confirmar cancelamento
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setCancelar(null)}>
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <p className="text-muted-foreground text-xs">Total emitido: {brl(notas.filter((n) => n.situacao === 'emitida').reduce((a, n) => a + n.valor, 0))}</p>
      </Bloco>
    </>
  )
}

type MsgConsultor = { de: 'eu' | 'consultor'; texto: string; fonte?: string; tarefa?: boolean }

function Consultor({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const { estado } = useServicos(ctx)
  const fis = fiscalDe(ctx.clienteId)
  const ps = painelSocioDe[ctx.clienteId]
  const [msgs, setMsgs] = useState<MsgConsultor[]>([
    {
      de: 'consultor',
      texto: `Oi, ${primeiroNome(ctx.contato.nome)}. Sou o assistente da ${ctx.clienteNome} aqui no app: respondo sobre guias, prazos, documentos e números da empresa. Opinião (regime, demissão, planejamento) eu passo para o contador.`,
    },
  ])
  const [texto, setTexto] = useState('')
  const sugestoes = ['Minha guia de outubro saiu?', 'Quando vence o FGTS?', 'Quanto faturei este mês?', 'O que é DCTFWeb?', 'Posso pagar menos imposto mudando de regime?']
  const responder = (p: string): MsgConsultor => {
    const q = p.toLowerCase()
    const aberta = fis.guias.find((g) => !g.paga && g.valor !== '—')
    if (/regime|pagar menos|demitir|devo|vale a pena|planejamento/.test(q)) {
      const resp = fichas[ctx.clienteId]?.responsaveis.consultor ?? 'Fernanda Lima'
      loja.criarTarefa({ codigo: 'CON-001', titulo: `Pergunta pelo Consultor: ${p}`, cliente: ctx.clienteNome, setor: 'consultor', prazo: '23/11', status: 'a_fazer', origem: 'pedido_cliente', responsavel: { tipo: 'pessoa', nome: resp } })
      loja.avisar({
        para: [idDoUsuario(resp) ?? 'u1'],
        tipo: 'cliente',
        setor: 'consultor',
        titulo: `${ctx.contato.nome} perguntou ao Consultor: precisa do contador`,
        detalhe: `${ctx.clienteNome} · “${p}”`,
        destino: { modulo: 'painel', aba: 'consultoria' },
      })
      return { de: 'consultor', texto: `Isso é planejamento, então não opino. Passei a pergunta para ${resp}, que cuida da consultoria da empresa; a resposta chega em Pedidos e na conversa.`, tarefa: true }
    }
    if (/fgts/.test(q)) {
      const g = fis.guias.find((x) => /FGTS/.test(x.tributo))
      return g
        ? { de: 'consultor', texto: `O FGTS Digital de ${g.competencia} é ${g.valor} e vence em ${g.vencimento}.${g.paga ? ' Já consta pago.' : ''}`, fonte: 'da guia emitida pelo escritório' }
        : { de: 'consultor', texto: 'Não há guia de FGTS em aberto para a empresa neste mês.', fonte: 'do calendário da empresa' }
    }
    if (/guia|das|imposto|pagar/.test(q))
      return aberta
        ? {
            de: 'consultor',
            texto: `O ${aberta.tributo} de ${aberta.competencia} é ${aberta.valor}, vence em ${aberta.vencimento}. ${aberta.enviada ? 'Já está em Documentos.' : 'Está em preparo no escritório; aviso quando sair.'}`,
            fonte: 'da central de guias',
          }
        : { de: 'consultor', texto: 'Nenhuma guia em aberto agora.', fonte: 'da central de guias' }
    if (/fatur|vend|receita/.test(q)) {
      if (!ps || (estado('painel_socio') !== 'ativo' && !ctx.areas.includes('financeiro'))) return { de: 'consultor', texto: 'Esse número fica no Painel do sócio, que não está ligado para a sua empresa. Posso pedir ao escritório.' }
      return { de: 'consultor', texto: `Em 10/2026 a empresa faturou ${brl(ps.faturamento)}, ${ps.faturamento >= ps.anterior ? 'acima' : 'abaixo'} de setembro (${brl(ps.anterior)}).`, fonte: 'das notas emitidas (XML)' }
    }
    if (/dctf|o que é|o que e/.test(q))
      return { de: 'consultor', texto: 'A DCTFWeb é a declaração mensal que informa à Receita as contribuições sobre a folha (INSS). O escritório entrega até o dia 15; dela sai a guia DARF que você paga.', fonte: 'explicação geral' }
    return { de: 'consultor', texto: 'Não achei isso nos dados da empresa. Quer que eu passe para o escritório? Toque em "Pedidos" ou escreva na Conversa.' }
  }
  const enviar = (p: string) => {
    if (!p.trim()) return
    setMsgs((m) => [...m, { de: 'eu', texto: p }, responder(p)])
    loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Perguntou ao Consultor: “${p}” (${ctx.clienteNome})`)
    setTexto('')
  }
  return (
    <>
      <div className="flex flex-1 flex-col gap-2">
        {msgs.map((m, i) => (
          <div key={i} className={cn('max-w-[88%] rounded-[18px] px-3.5 py-2.5 text-sm', m.de === 'eu' ? 'bg-foreground text-background self-end' : 'bg-surface shadow-cartao self-start')}>
            {m.texto}
            {m.fonte && <span className="text-muted-foreground mt-1 block text-[11px]">Fonte: {m.fonte}</span>}
            {m.tarefa && (
              <button type="button" className="mt-1 block cursor-pointer text-xs underline underline-offset-2" onClick={() => ctx.ir('pedidos')}>
                Acompanhar em Pedidos
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {sugestoes.map((s) => (
          <button key={s} type="button" onClick={() => enviar(s)} className="bg-sunken cursor-pointer rounded-full px-3 py-1.5 text-xs whitespace-nowrap">
            {s}
          </button>
        ))}
      </div>
      <div className="bg-surface shadow-cartao sticky bottom-0 flex items-center gap-2 rounded-full py-1 pr-1 pl-4">
        <input
          aria-label="Pergunta ao Consultor"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar(texto)}
          placeholder="Pergunte sobre a sua empresa"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <Button size="icon-sm" className="rounded-full" aria-label="Perguntar" onClick={() => enviar(texto)} disabled={!texto.trim()}>
          <PaperPlaneTiltIcon />
        </Button>
      </div>
      <p className="text-muted-foreground text-center text-[11px]">Uso do mês: 18% do limite da empresa</p>
    </>
  )
}

function Certidoes({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const [emitidas, setEmitidas] = usePersistente<string[]>(`app.emitidas.${ctx.clienteId}`, [])
  const lista = certidoesDe(ctx.clienteId)
  return (
    <>
      <Bloco titulo="Certidões da empresa">
        {lista.map((c) => {
          const nova = emitidas.includes(c.id)
          const dias = nova ? 180 : c.dias
          return (
            <div key={c.id} className="flex items-center gap-2 text-sm">
              {dias < 0 ? (
                <WarningIcon className="text-destructive size-4 shrink-0" weight="fill" />
              ) : dias < 15 ? (
                <WarningIcon className="text-warning size-4 shrink-0" />
              ) : (
                <CheckCircleIcon className="text-success size-4 shrink-0" weight="fill" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block">{c.nome}</span>
                <span className="text-muted-foreground block text-xs">{dias < 0 ? `vencida há ${-dias} dias` : `vale por mais ${dias} dias`}</span>
              </span>
              <Button
                size="sm"
                variant={dias < 15 ? 'default' : 'ghost'}
                className="rounded-full"
                onClick={() => {
                  setEmitidas((x) => [...x, c.id])
                  registrar(`Emitiu ${c.nome}`)
                  ctx.avisarApp(`${c.nome} emitida e salva em Documentos.`)
                }}
              >
                {nova ? 'Baixar' : 'Emitir'}
              </Button>
            </div>
          )
        })}
      </Bloco>
      <p className="text-muted-foreground text-xs">Se uma certidão sair positiva, o Fiscal do escritório é avisado e explica o que falta.</p>
    </>
  )
}

function PainelSocio({ ctx }: { ctx: Ctx }) {
  const p = painelSocioDe[ctx.clienteId]
  if (!p) return <p className="text-muted-foreground text-sm">Ainda sem números para esta empresa.</p>
  const varia = ((p.faturamento - p.anterior) / p.anterior) * 100
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ['Faturamento 10/2026', brl(p.faturamento), `${varia >= 0 ? '+' : ''}${varia.toFixed(1).replace('.', ',')}% sobre setembro`],
            ['Impostos do mês', brl(p.impostos), `${((p.impostos / p.faturamento) * 100).toFixed(1).replace('.', ',')}% do faturamento`],
            ['Folha', brl(p.folha), 'salários e encargos'],
            ['Resultado', brl(p.resultado), 'antes do pró-labore'],
          ] as const
        ).map(([r, v, d]) => (
          <div key={r} className="bg-surface shadow-cartao flex flex-col rounded-[18px] p-3">
            <span className="text-muted-foreground text-[11px]">{r}</span>
            <span className="text-lg font-light tabular-nums">{v}</span>
            <span className="text-muted-foreground text-[11px]">{d}</span>
          </div>
        ))}
      </div>
      {p.limite && (
        <Bloco titulo="Limite do Simples (12 meses)">
          <div className="bg-sunken h-2 overflow-hidden rounded-full">
            <div className={cn('h-full rounded-full', p.limite.usado / p.limite.teto > 0.8 ? 'bg-destructive' : 'bg-foreground')} style={{ width: `${(p.limite.usado / p.limite.teto) * 100}%` }} />
          </div>
          <p className="text-muted-foreground text-xs">
            {brl(p.limite.usado)} de {brl(p.limite.teto)} (sublimite estadual). {p.limite.usado / p.limite.teto > 0.6 ? 'O Fiscal acompanha e avisa antes de passar.' : 'Folga confortável.'}
          </p>
        </Bloco>
      )}
      <p className="text-muted-foreground text-xs">Mesmos números do escritório: notas (XML), guias e folha de outubro.</p>
    </>
  )
}

function SimuladorFolha({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const conversaDe = useConversaDe()
  const [salario, setSalario] = useState('2500')
  const [tipo, setTipo] = useState<'contratar' | 'aumentar' | 'desligar'>('contratar')
  const s = Number(salario.replace(/\./g, '').replace(',', '.')) || 0
  const simples = ['c2', 'c3', 'c7'].includes(ctx.clienteId)
  const encargos = simples ? 0.08 : 0.358
  const provisoes = 0.0833 + 0.1111
  const mensal = s * (1 + encargos + provisoes * (1 + encargos))
  const rescisao = s * 1.4 + s * 0.4
  const quadro = dpDe(ctx.clienteId).quadro.ativos
  return (
    <>
      <div className="bg-sunken grid grid-cols-3 gap-1 rounded-full p-1 text-xs">
        {(['contratar', 'aumentar', 'desligar'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)} className={cn('cursor-pointer rounded-full py-1.5', tipo === t && 'bg-raised shadow-pilula font-medium')}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <Bloco titulo={tipo === 'aumentar' ? 'Aumento mensal' : 'Salário'}>
        <input aria-label="Salário" inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} className={campo} />
        {tipo !== 'desligar' ? (
          <p className="text-sm">
            Custo para a empresa: <strong className="font-medium">{brl(mensal)}/mês</strong> ({brl(mensal * 12)} no ano), com {simples ? 'FGTS (Simples: INSS patronal no DAS)' : 'INSS patronal, RAT, terceiros e FGTS'}, 13º e férias.
          </p>
        ) : (
          <p className="text-sm">
            Rescisão sem justa causa, estimada: <strong className="font-medium">{brl(rescisao)}</strong> (aviso, férias, 13º proporcionais e multa de 40% do FGTS).
          </p>
        )}
        <p className="text-muted-foreground text-xs">Estimativa com a folha de {quadro} empregados. O valor exato sai do DP.</p>
        <Button
          size="sm"
          variant="outline"
          className="w-fit rounded-full"
          onClick={() => {
            const conversa = conversaDe(ctx.clienteNome, 'dp', ctx.contato.nome)
            loja.mensagemCrm(conversa, {
              tipo: 'mensagem',
              de: 'cliente',
              autor: primeiroNome(ctx.contato.nome),
              canal: 'app',
              texto: `Simulei ${tipo} com ${brl(s)}: deu ${tipo === 'desligar' ? brl(rescisao) : `${brl(mensal)}/mês`}. Podem confirmar?`,
            })
            ctx.avisarApp('Simulação enviada ao DP. A resposta chega na conversa.')
          }}
        >
          Mandar ao DP para confirmar
        </Button>
      </Bloco>
    </>
  )
}

function Irpf({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const itens = ['Informe de rendimentos dos bancos', 'Informe da previdência privada', 'Recibos médicos e odontológicos', 'Escritura ou contrato do imóvel novo', 'Informe de pró-labore e lucros (o escritório já tem)']
  const [feitos, setFeitos] = useState<string[]>([itens[4]])
  return (
    <>
      <Bloco titulo="IRPF 2027 · checklist">
        {itens.map((i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={feitos.includes(i)} onChange={(e) => setFeitos((x) => (e.target.checked ? [...x, i] : x.filter((y) => y !== i)))} className="accent-foreground size-4" />
            <span className={cn(feitos.includes(i) && 'text-muted-foreground line-through')}>{i}</span>
          </label>
        ))}
        <p className="text-muted-foreground text-xs">A lista muda com o que você responde: comprou imóvel em 2026, então entra a escritura.</p>
        <Button
          size="sm"
          className="w-fit rounded-full"
          disabled={feitos.length < 3}
          onClick={() => {
            registrar(`Enviou ${feitos.length} documentos do IRPF`)
            ctx.avisarApp('Documentos do IRPF enviados. A declaração fica pronta em março.')
          }}
        >
          Enviar o que tenho
        </Button>
      </Bloco>
    </>
  )
}

function Recalculo({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const fis = fiscalDe(ctx.clienteId)
  const [feitas, setFeitas] = usePersistente<Record<string, string>>(`app.feitas.${ctx.clienteId}`, {})
  const guias = fis.guias.filter((g) => g.valor !== '—')
  return (
    <Bloco titulo="Escolha a guia">
      {guias.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma guia para recalcular.</p>}
      {guias.map((g) => {
        const base = Number(g.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0
        return (
          <div key={g.id} className="flex items-center gap-2 text-sm">
            <span className="min-w-0 flex-1">
              <span className="block">
                {g.tributo} {g.competencia}
              </span>
              <span className="text-muted-foreground block text-xs">{feitas[g.id] ?? `${g.valor} · vence ${g.vencimento}${g.paga ? ' · paga' : ''}`}</span>
            </span>
            {!g.paga && !feitas[g.id] && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  const nova = brl(base * 1.0233)
                  setFeitas((x) => ({ ...x, [g.id]: `nova guia: ${nova} · pagar até 30/11` }))
                  loja.registrar(`${ctx.contato.nome} (cliente, app)`, `Recalculou ${g.tributo} ${g.competencia} para 30/11 (${ctx.clienteNome})`)
                  ctx.avisarApp('Guia recalculada para 30/11 e salva em Documentos.')
                }}
              >
                Recalcular p/ 30/11
              </Button>
            )}
          </div>
        )
      })}
    </Bloco>
  )
}

function AgendaTributaria({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const [ligada, setLigada] = useState(false)
  const fis = fiscalDe(ctx.clienteId)
  return (
    <>
      <Bloco titulo="Próximos vencimentos">
        {fis.guias
          .filter((g) => !g.paga)
          .map((g) => (
            <p key={g.id} className="text-sm">
              {g.vencimento} · {g.tributo} {g.competencia} <span className="text-muted-foreground text-xs">· {g.valor}</span>
            </p>
          ))}
        <p className="text-sm">
          25/11 · Variáveis da folha <span className="text-muted-foreground text-xs">· enviar ao DP</span>
        </p>
      </Bloco>
      <Button
        className="rounded-full"
        variant={ligada ? 'outline' : 'default'}
        onClick={() => {
          setLigada(!ligada)
          registrar(ligada ? 'Tirou a agenda tributária do calendário' : 'Assinou a agenda tributária no calendário do celular')
          ctx.avisarApp(ligada ? 'Agenda removida do calendário.' : 'Agenda adicionada. Vencimentos novos entram sozinhos.')
        }}
      >
        {ligada ? 'Tirar do calendário' : 'Adicionar ao calendário do celular'}
      </Button>
    </>
  )
}

function Licitacao({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const certs = certidoesDe(ctx.clienteId)
  const vencidas = certs.filter((c) => c.dias < 15)
  return (
    <Bloco titulo="Pacote para licitação">
      {['Contrato social consolidado', 'Balanço 2025 e índices (liquidez, endividamento)', 'Cartão CNPJ', ...certs.map((c) => c.nome)].map((i) => (
        <p key={i} className="flex items-center gap-2 text-sm">
          {vencidas.some((v) => v.nome === i) ? <WarningIcon className="text-warning size-4" /> : <CheckCircleIcon className="text-success size-4" weight="fill" />} {i}
        </p>
      ))}
      {vencidas.length > 0 && <p className="text-muted-foreground text-xs">Renovamos {vencidas.map((v) => v.nome).join(' e ')} antes de montar o pacote.</p>}
      <Button
        size="sm"
        className="w-fit rounded-full"
        onClick={() => {
          registrar('Gerou o pacote para licitação')
          ctx.avisarApp('Pacote gerado (PDF único com índice) e salvo em Documentos.')
        }}
      >
        Gerar pacote
      </Button>
    </Bloco>
  )
}

function CompraCertificado({ ctx }: { ctx: Ctx }) {
  const loja = useLoja()
  const [passo, setPasso] = useState(0)
  return (
    <Bloco titulo="e-CNPJ A1 · 12 meses · R$ 189,00">
      <p className="text-muted-foreground text-xs">Emitido pela certificadora parceira; o escritório guarda no cofre com o seu termo.</p>
      {passo === 0 && (
        <Button size="sm" className="w-fit rounded-full" onClick={() => setPasso(1)}>
          Quero comprar
        </Button>
      )}
      {passo === 1 && (
        <div className="flex flex-col gap-2">
          {['qui 19/11 · 10:00', 'seg 23/11 · 16:30'].map((h) => (
            <Button
              key={h}
              size="sm"
              variant="outline"
              className="w-fit rounded-full"
              onClick={() => {
                setPasso(2)
                loja.criarTarefa({
                  codigo: 'SOC-201',
                  titulo: `Certificado A1 vendido · videoconferência ${h}`,
                  cliente: ctx.clienteNome,
                  setor: 'societario',
                  prazo: h.slice(4, 9),
                  status: 'a_fazer',
                  origem: 'pedido_cliente',
                  responsavel: { tipo: 'pessoa', nome: fichas[ctx.clienteId]?.responsaveis.societario ?? 'Bruno Costa' },
                })
                loja.avisar({
                  para: [idDoUsuario(fichas[ctx.clienteId]?.responsaveis.societario) ?? 'u3'],
                  tipo: 'cliente',
                  setor: 'societario',
                  titulo: `${ctx.clienteNome} comprou o certificado A1`,
                  detalhe: `videoconferência ${h}`,
                  destino: { modulo: 'painel', aba: 'societario' },
                })
                ctx.avisarApp(`Videoconferência marcada: ${h}. O boleto chega no WhatsApp.`)
              }}
            >
              Videoconferência {h}
            </Button>
          ))}
        </div>
      )}
      {passo === 2 && <p className="text-sm">Pedido feito. Depois da videoconferência o certificado vai direto para o cofre.</p>}
    </Bloco>
  )
}

function Reforma({ ctx }: { ctx: Ctx }) {
  const p = painelSocioDe[ctx.clienteId]
  const hoje = p ? p.impostos : 0
  const anos: [string, number][] = [
    ['2026', 1],
    ['2027', 1.01],
    ['2029', 1.03],
    ['2031', 1.05],
    ['2033', 1.06],
  ]
  return (
    <Bloco titulo="Imposto do mês, hoje × transição (versão revisada pelo contador em 04/11)">
      {anos.map(([a, f]) => (
        <div key={a} className="flex items-center gap-2 text-sm">
          <span className="w-12">{a}</span>
          <div className="bg-sunken h-2 flex-1 overflow-hidden rounded-full">
            <div className="bg-foreground h-full rounded-full" style={{ width: `${(f / 1.1) * 100}%` }} />
          </div>
          <span className="w-24 text-right tabular-nums">{brl(hoje * f)}</span>
        </div>
      ))}
      <p className="text-muted-foreground text-xs">Cenário com o seu mix de vendas de outubro. Mudanças grandes, a Consultoria explica em reunião.</p>
    </Bloco>
  )
}

function Conciliacao({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const [resp, setResp] = usePersistente<Record<string, string>>(`app.resp.${ctx.clienteId}`, {})
  const itens = [
    { id: 'l1', texto: 'PIX enviado · R$ 1.200,00 · 04/11 · "M. SILVA"', ok: false },
    { id: 'l2', texto: 'TED recebida · R$ 8.400,00 · 05/11 · cliente', ok: true },
    { id: 'l3', texto: 'Débito automático · R$ 389,90 · 06/11 · "TELEF"', ok: true },
  ]
  return (
    <Bloco titulo="Novembro · extratos pelo Open Finance">
      {itens.map((i) => (
        <div key={i.id} className="flex flex-col gap-1 text-sm">
          <span>{i.texto}</span>
          {i.ok ? (
            <span className="text-muted-foreground text-xs">classificado pelo Contábil</span>
          ) : resp[i.id] ? (
            <span className="text-muted-foreground text-xs">você disse: {resp[i.id]}</span>
          ) : (
            <div className="flex gap-1.5">
              {['Fornecedor', 'Retirada do sócio', 'Não sei'].map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setResp((x) => ({ ...x, [i.id]: o }))
                    registrar(`Classificou um lançamento como “${o}”`)
                  }}
                  className="bg-sunken cursor-pointer rounded-full px-2.5 py-1 text-xs"
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </Bloco>
  )
}

function CobrancaClientes({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  const [quem, setQuem] = useState('')
  const [valor, setValor] = useState('')
  return (
    <Bloco titulo="Nova cobrança">
      <input aria-label="Cliente a cobrar" value={quem} onChange={(e) => setQuem(e.target.value)} placeholder="Nome ou CNPJ do seu cliente" className={campo} />
      <input aria-label="Valor da cobrança" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" className={campo} />
      <Button
        size="sm"
        className="w-fit rounded-full"
        disabled={!quem.trim() || !valor.trim()}
        onClick={() => {
          registrar(`Gerou boleto/Pix de R$ ${valor} para ${quem}`)
          ctx.avisarApp('Boleto e Pix gerados e enviados. A régua lembra antes do vencimento.')
          setQuem('')
          setValor('')
        }}
      >
        Gerar boleto e Pix
      </Button>
    </Bloco>
  )
}

function RelatorioAnual({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  return (
    <Bloco titulo="2026 com o escritório">
      {['132 guias entregues, nenhuma em atraso', '12 folhas fechadas e 4 admissões', 'R$ 18.400 de créditos de PIS/COFINS recuperados', 'Para 2027: reforma tributária e renovação do certificado'].map((l) => (
        <p key={l} className="text-sm">
          · {l}
        </p>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="w-fit rounded-full"
        onClick={() => {
          registrar('Baixou o relatório anual')
          ctx.avisarApp('Relatório anual baixado.')
        }}
      >
        Baixar PDF
      </Button>
    </Bloco>
  )
}

function ContaDigital({ ctx }: { ctx: Ctx }) {
  const registrar = useRegistro(ctx)
  return (
    <Bloco titulo="Conta PJ parceira">
      <p className="text-sm">Sem mensalidade, Pix e boletos ilimitados. O extrato cai direto na contabilidade.</p>
      <p className="text-muted-foreground text-xs">Transparência: o escritório recebe comissão do parceiro por conta aberta.</p>
      <Button
        size="sm"
        className="w-fit rounded-full"
        onClick={() => {
          registrar('Pediu a abertura da conta digital')
          ctx.avisarApp('Pedido enviado ao parceiro. O link de abertura chega no seu e-mail.')
        }}
      >
        Abrir conta
      </Button>
    </Bloco>
  )
}
