import { AddressBook, Briefcase, ChatsCircle, FolderSimple, GearSix, House, SquaresFour, Timer, Wallet, type Icon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { MinhaConta } from '@/ambiente/conta'
import { FluxosProvider } from '@/ambiente/fluxos'
import { CentralAvisos, Toasts } from '@/ambiente/interface'
import { LojaOpcional, NavegacaoProvider, useLoja, type Destino } from '@/ambiente/loja'
import { DocumentosProvider } from '@/ambiente/documentos'
import { integranteAoVivo } from '@/ambiente/integrante-vivo'
import { abrirSuporte, SuporteProvider } from '@/ambiente/suporte'
import { ModoEspera, SeloTempo, useRegistroTempo } from '@/ambiente/espera'
import { papelExibido, setoresContabeis, useSessao, useSessaoBruta } from '@/ambiente/sessao'
import { AbasSegmentadas } from '@/components/compostos/abas-segmentadas'
import { BarraLateral } from '@/components/compostos/barra-lateral'
import { CabecalhoModulo } from '@/components/compostos/cabecalho-modulo'
import { SeletorCliente, type SelecaoCliente } from '@/components/compostos/seletor-cliente'
import { Orb } from '@/components/ui/orb'
import * as exemplo from '@/dados/exemplo'
import { useTema } from '@/theme/ThemeProvider'
import type { SetorIntegrante } from '@/theme/tipos'
import { AssistenteTela } from './AssistenteTela'
import { GavetaChat, ModuloTela } from './ModuloTela'
import { ConversasTela } from './crm/ConversasTela'
import { leads } from '@/dados/crm'
import { ComunicadosTela } from './crm/ComunicadosTela'
import { LeadsTela } from './crm/LeadsTela'
import { NumerosTela } from './crm/NumerosTela'
import { ConfirmacoesTela } from './timesheet/ConfirmacoesTela'
import { EquipeTela } from './timesheet/EquipeTela'
import { MeuTempoTela } from './timesheet/MeuTempoTela'
import { RentabilidadeTela } from './timesheet/RentabilidadeTela'
import { ArmazenamentoTela } from './config/ArmazenamentoTela'
import { AssinaturaTela } from './config/AssinaturaTela'
import { EscritorioTela } from './config/EscritorioTela'
import { IntegrantesTela } from './config/IntegrantesTela'
import { TemaTela } from './config/TemaTela'
import { UsuariosTela } from './config/UsuariosTela'
import { CaixaTela } from './financeiro/CaixaTela'
import { CobrancaTela } from './financeiro/CobrancaTela'
import { ContratosTela } from './financeiro/ContratosTela'
import { ResultadoTela } from './financeiro/ResultadoTela'
import { PainelTela } from './PainelTela'
import { abasInternas, moduloConfig, modulosLaterais, nomeCompleto, type IdModulo } from './modulos'
import { ArquivosTela } from './ArquivosTela'
import { ClientesTela } from './ClientesTela'
import { ConciliacaoTela } from './financeiro/ConciliacaoTela'
import { ContasPagarTela } from './financeiro/ContasPagarTela'
import { VisaoFinTela } from './financeiro/VisaoFinTela'
import { AprovacoesBpoTela } from './bpo/AprovacoesBpo'
import { ConfigBpoTela } from './bpo/ConfigBpo'
import { EntregasBpoTela, RentabilidadeBpoTela, VolumeBpoTela } from './bpo/GestaoBpo'
import { FilaBpoTela, RotinasBpoTela } from './bpo/OperacaoBpo'
import { CarteiraBpoTela, VisaoBpoTela } from './bpo/VisaoBpo'
import { empresaBpo } from '@/dados/bpo'
import { Moldura } from './Moldura'
import { TimeTela } from './TimeTela'
import { useHistorico } from './useHistorico'
import { VisaoGeralTela } from './VisaoGeralTela'

/** Ícones dos módulos (Phosphor): duotone inativo, preenchido ativo. */
const icones: Record<IdModulo, Icon> = {
  inicio: House,
  painel: SquaresFour,
  crm: ChatsCircle,
  timesheet: Timer,
  financeiro: Wallet,
  arquivos: FolderSimple,
  bpo: Briefcase,
  clientes: AddressBook,
  config: GearSix,
}

interface Props {
  moduloInicial?: IdModulo
  abaInicial?: string
  /** Id do integrante aberto na aba Time. */
  integranteInicial?: string
  /** Cliente selecionado ao abrir; `null` = carteira. */
  clienteInicial?: SelecaoCliente
  /** Assistente com a conversa de exemplo (true) ou vazio (false). */
  comConversa?: boolean
  onAlternarModo?: () => void
}

/** O escritório de demonstração: a conta da sessão, com as permissões dela, sobre a loja compartilhada. */
export function Plataforma(props: Props) {
  return (
    <LojaOpcional>
      <PlataformaInterna {...props} />
    </LojaOpcional>
  )
}

function PlataformaInterna({ moduloInicial = 'inicio', abaInicial, integranteInicial = 'i-fiscal', clienteInicial = 'c1', comConversa = false, onAlternarModo }: Props) {
  const { integrante: doTema } = useTema()
  const { usuario, permissoes } = useSessao()
  const sessaoBruta = useSessaoBruta()
  const loja = useLoja()
  // BPO só com o setor e com o módulo ligado na assinatura (10, 2.5). No escritório só de BPO
  // (cenário C1 da demonstração) não há Painel: Clientes ocupa o lugar dele e o BPO é o pacote.
  const bpoPuro = loja.estado.cenario === 'bpo_puro'
  const modulosVisiveis: IdModulo[] = bpoPuro
    ? permissoes.modulos.flatMap((m): IdModulo[] => (m === 'painel' ? ['clientes'] : [m]))
    : permissoes.modulos.filter((m) => m !== 'bpo' || loja.estado.bpoModulo)
  const [modulo, setModulo] = useState<IdModulo>(modulosVisiveis.includes(moduloInicial) ? moduloInicial : 'inicio')
  // Trocar de cenário (ou desligar o módulo) com a tela aberta volta ao Início.
  useEffect(() => {
    if (!modulosVisiveis.includes(modulo)) setModulo('inicio')
  }, [modulosVisiveis, modulo])
  const [abaPorModulo, setAbaPorModulo] = useState<Partial<Record<IdModulo, string>>>(() => ({ painel: permissoes.abas.painel?.[0] ?? 'fiscal', ...(abaInicial ? { [moduloInicial]: abaInicial } : {}) }))
  const [clienteId, setClienteId] = useState<SelecaoCliente>(clienteInicial)
  useEffect(() => {
    if (bpoPuro && clienteId && !exemplo.clientes.find((c) => c.id === clienteId)?.servicos?.includes('bpo')) setClienteId(null)
  }, [bpoPuro, clienteId])
  const [conversaCrm, setConversaCrm] = useState<string | undefined>(undefined)
  const [faturaAberta, setFaturaAberta] = useState<string | undefined>(undefined)
  const [pastaAberta, setPastaAberta] = useState<Destino['pasta']>(undefined)
  const [integrante, setIntegrante] = useState<string>(integranteInicial)
  const [minhaConta, setMinhaConta] = useState(false)
  // Cada navegação por link reabre o item, mesmo que seja o mesmo de antes.
  const [nonce, setNonce] = useState(0)

  // Cada pessoa tem os próprios integrantes: o Assistente e um por setor em que trabalha.
  const integrantes = useMemo(
    () =>
      exemplo.integrantes
        .filter((i) => i.setor === 'geral' || (permissoes.setores.includes(i.setor) && !(bpoPuro && setoresContabeis.includes(i.setor)) && (i.tipo !== 'criado_pelo_usuario' || usuario.id === 'u1')))
        // Nada de "foto": estado, fila, cartões pendentes e o que está fazendo saem do que acontece na sessão.
        .map((i) => integranteAoVivo(i, loja.estado.trabalhos, loja.conversasTime[i.id] ?? [], loja.estado.decisoes, loja.tarefas)),
    [permissoes, usuario.id, bpoPuro, loja.estado.trabalhos, loja.conversasTime, loja.estado.decisoes, loja.tarefas],
  )
  const conversa = useHistorico(clienteId ?? 'todos', usuario.nome, exemplo.historicoAssistente, !comConversa)
  const cliente = exemplo.clientes.find((c) => c.id === clienteId)
  const contexto = cliente?.nome ?? 'Carteira'
  const pendentes = integrantes.reduce((s, i) => s + i.pendentes, 0)
  // Aviso cuja decisão já foi tomada no chat sai da Home e do Assistente (03, 4.1: decidido some).
  const avisosDoTime = exemplo.avisos.filter((a) => permissoes.setores.includes(a.setor) && !(a.cartaoChat && loja.estado.decisoes[a.cartaoChat]))
  const abasPermitidas = (m: IdModulo) => {
    const lista = permissoes.abas[m]
    return lista ? abasInternas[m].filter((a) => lista.includes(a.id)) : abasInternas[m]
  }
  const abaValida = (m: IdModulo, a?: string) => (a && abasPermitidas(m).some((x) => x.id === a) ? a : abasPermitidas(m)[0]?.id)
  const aba = abaValida(modulo, abaPorModulo[modulo]) ?? 'assistente'
  // O motor do trabalho simulado precisa saber o que a pessoa está vendo: aviso do que ela já vê não vira toast.
  const definirVista = loja.definirVista
  useEffect(() => definirVista({ modulo, aba, integrante, conversa: conversaCrm, usuario: usuario.id }), [definirVista, modulo, aba, integrante, conversaCrm, usuario.id])
  const irPara = (m: IdModulo, a?: string) => {
    if (!modulosVisiveis.includes(m)) {
      loja.toast('Sua conta não tem acesso a essa parte do sistema.')
      return
    }
    setModulo(m)
    if (a) setAbaPorModulo((x) => ({ ...x, [m]: a }))
  }
  const navegar = (d: Destino) => {
    if (d.cliente !== undefined) setClienteId(d.cliente)
    if (d.conversa) setConversaCrm(d.conversa)
    if (d.integrante) setIntegrante(d.integrante)
    setFaturaAberta(d.fatura)
    setPastaAberta(d.pasta)
    setNonce((n) => n + 1)
    irPara(d.modulo, d.aba)
  }
  // Cartões e avisos apontam para um setor; abre o integrante padrão daquele setor.
  const abrirIntegrante = (s: SetorIntegrante) => {
    const alvo = integrantes.find((i) => i.setor === s && i.tipo !== 'criado_pelo_usuario')
    if (alvo) setIntegrante(alvo.id)
    irPara('inicio', 'time')
  }
  const verNaAba = () => irPara('painel', abaValida('painel', 'fiscal'))

  // No Figma, a aba Time leva um orb pequeno com o estado do time.
  const estadoTime = integrantes.some((i) => i.estado === 'precisa_de_voce') ? 'precisa_de_voce' : 'trabalhando'
  const abas = abasPermitidas(modulo).map((a) =>
    modulo === 'inicio' && a.id === 'time'
      ? { ...a, adorno: <Orb estado={estadoTime} cor={doTema('contabil').cor} tamanho={16} extras={false} cutucavel={false} rotulo="Estado do time" />, contador: pendentes }
      : modulo === 'crm' && a.id === 'conversas'
        ? { ...a, contador: loja.conversas.filter((c) => permissoes.setores.includes(c.setor) && (c.status === 'nova' || (c.naoLidas ?? 0) > 0)).length }
        : modulo === 'painel'
          ? { ...a, contador: loja.tarefas.filter((t) => t.atrasada && t.status !== 'concluida' && (a.id === t.setor || (a.id === 'consultoria' && t.setor === 'consultor'))).length || undefined }
          : a,
  )
  const rotuloModulo = [...modulosLaterais, moduloConfig].find((m) => m.id === modulo)?.rotulo ?? ''
  const rotuloAba = nomeCompleto[aba] ?? abasInternas[modulo].find((a) => a.id === aba)?.rotulo
  const papel = permissoes.papelTimesheet
  const chaveCrm = `${conversaCrm ?? 'lista'}-${nonce}`
  // Só conta tempo onde o trabalho vira sessão do Timesheet: Painel com cliente e CRM (menos Números, que é configuração).
  const contaTempo = (modulo === 'painel' && !!cliente) || (modulo === 'crm' && aba !== 'numeros')
  const ondeTempo = modulo === 'painel' ? `Painel ${rotuloAba ?? ''} · ${cliente?.nome ?? ''}` : `CRM ${rotuloAba ?? ''}`
  const tempo = useRegistroTempo(contaTempo, ondeTempo)
  // O seletor mostra os clientes do pacote: no BPO, as empresas de BPO; no Painel, só as da contabilidade.
  // Quem não tem Painel (só BPO) vê no cadastro só os clientes do pacote dele.
  const clientesDoModulo = modulo === 'bpo' || bpoPuro || (modulo === 'clientes' && !permissoes.modulos.includes('painel')) ? exemplo.clientes.filter((c) => c.servicos?.includes('bpo')) : modulo === 'painel' ? exemplo.clientes.filter((c) => !c.servicos || c.servicos.includes('contabil')) : exemplo.clientes
  const empresa = modulo === 'bpo' ? empresaBpo(clienteId ?? undefined) : undefined
  const propsBpo = {
    empresa,
    onEscolher: (id: string | null, a?: string) => {
      setClienteId(id)
      if (a) irPara('bpo', a)
    },
  }
  const usuarioLateral = { nome: usuario.nome, papel: papelExibido(usuario), setores: [permissoes.resumo] }

  return (
    <NavegacaoProvider value={{ irPara: navegar }}>
      <FluxosProvider>
        <DocumentosProvider>
        <SuporteProvider>
        <Moldura
          lateral={({ aberta, onAlternar, aoNavegar }) => (
            <BarraLateral
              itens={modulosLaterais.filter((m) => modulosVisiveis.includes(m.id)).map((m) => ({ ...m, Icone: icones[m.id] }))}
              configuracoes={permissoes.modulos.includes('config') ? { ...moduloConfig, Icone: icones.config } : undefined}
              ativo={modulo}
              onTrocar={(id) => {
                setModulo(id as IdModulo)
                aoNavegar()
              }}
              aberta={aberta}
              onAlternar={onAlternar}
              usuario={usuarioLateral}
              onAlternarModo={onAlternarModo}
              onMinhaConta={() => setMinhaConta(true)}
              onSuporte={() => abrirSuporte()}
              onSair={() => (sessaoBruta ? sessaoBruta.sair() : loja.toast('Na demonstração isolada não há login.'))}
            />
          )}
          cabecalho={({ onAbrirMenu }) => (
            <CabecalhoModulo
              sino={
                <>
                  <SeloTempo conta={contaTempo} espera={!!tempo.espera} onde={ondeTempo} />
                  <CentralAvisos onPreferencias={() => setMinhaConta(true)} />
                </>
              }
              onAbrirMenu={onAbrirMenu}
              abas={<AbasSegmentadas rotulo={`Abas de ${rotuloModulo}`} abas={abas} ativa={aba} onTrocar={(id) => irPara(modulo, id)} className={abas.length > 7 ? '[&>button]:min-w-0 [&>button]:px-3.5' : undefined} />}
              // No CRM não há seletor: Conversas filtra por cliente na própria lista; Leads e
              // Números são do escritório; Comunicados escolhe os destinatários no envio.
              // Configurações e Financeiro valem para o escritório inteiro (o
              // Financeiro filtra por cliente nas próprias listas).
              cliente={
                modulo === 'crm' || modulo === 'config' || modulo === 'financeiro' || modulo === 'clientes' ? undefined : (
                  <SeletorCliente
                    clientes={clientesDoModulo}
                    selecionado={clientesDoModulo.some((c) => c.id === clienteId) ? clienteId : null}
                    onSelecionar={(id) => {
                      setPastaAberta(undefined)
                      setClienteId(id)
                    }}
                  />
                )
              }
            />
          )}
        >
          {modulo === 'inicio' && aba === 'assistente' && (
            <AssistenteTela
              contexto={contexto}
              conversa={conversa}
              sugestoes={exemplo.sugestoesGeral}
              avisos={avisosDoTime}
              limites={exemplo.limitesUso}
              plano={exemplo.planoUso.plano}
              onAbrirIntegrante={abrirIntegrante}
              onVerAvisos={() => irPara('inicio', 'visao')}
              onVerNaAba={verNaAba}
            />
          )}
          {modulo === 'inicio' && aba === 'time' && (
            <TimeTela
              key={usuario.id}
              nomeUsuario={usuario.nome}
              contexto={contexto}
              integrantes={integrantes}
              selecionado={integrante}
              onSelecionar={setIntegrante}
              conversas={loja.conversasTime}
              limite={exemplo.limiteUsuario}
              onVerNaAba={verNaAba}
            />
          )}
          {modulo === 'inicio' && aba === 'visao' && (
            <VisaoGeralTela
              contexto={contexto}
              onAbrirIntegrante={abrirIntegrante}
              dados={{
                indicadores: exemplo.indicadores,
                progressoMes: exemplo.progressoMes,
                avisos: avisosDoTime,
                dias: exemplo.diasSemana,
                agenda: exemplo.agenda.filter((a) => permissoes.setores.includes(a.setor)),
                hoje: 18,
                pendencias: exemplo.pendencias,
                linhaDoTempo: exemplo.linhaDoTempo,
                integrantes,
              }}
            />
          )}
          {modulo === 'painel' && (
            <div className="relative h-full">
              <PainelTela
                key={aba}
                abaId={aba}
                cliente={cliente && clientesDoModulo.includes(cliente) ? cliente : undefined}
                clientesNaCarteira={exemplo.clientes.length}
                tarefas={loja.tarefas.filter((t) => usuario.papel === 'administrador' || permissoes.setores.includes(t.setor))}
                integrantes={integrantes}
                onFalar={abrirIntegrante}
              />
              <GavetaChat nomeUsuario={usuario.nome} conversaGeral={[]} integrantes={integrantes} onAbrirIntegrante={abrirIntegrante} contexto={contexto} />
            </div>
          )}
          {modulo === 'crm' && aba === 'conversas' && (
            <ConversasTela
              key={chaveCrm}
              conversas={loja.conversas.filter((c) => permissoes.setores.includes(c.setor) || c.id === conversaCrm)}
              clientes={exemplo.clientes}
              clienteInicial={clienteId}
              tarefas={loja.tarefas}
              conversaInicial={conversaCrm}
              onAbrirLead={() => irPara('crm', 'leads')}
            />
          )}
          {modulo === 'crm' && aba === 'leads' && (
            <LeadsTela
              leads={leads}
              onAbrirConversa={(id) => {
                setConversaCrm(id)
                irPara('crm', 'conversas')
              }}
            />
          )}
          {modulo === 'crm' && aba === 'comunicados' && <ComunicadosTela clientes={exemplo.clientes} />}
          {modulo === 'crm' && aba === 'numeros' && <NumerosTela />}
          {modulo === 'timesheet' && aba === 'meu' && <MeuTempoTela key={clienteId ?? 'todos'} papel={papel} clienteNome={cliente?.nome} />}
          {modulo === 'timesheet' && aba === 'equipe' && papel !== 'colaborador' && <EquipeTela papel={papel} clienteNome={cliente?.nome} />}
          {modulo === 'timesheet' && aba === 'rentabilidade' && papel !== 'colaborador' && <RentabilidadeTela key={clienteId ?? 'todos'} papel={papel} clienteNome={cliente?.nome} />}
          {modulo === 'timesheet' && aba === 'confirmacoes' && <ConfirmacoesTela papel={papel} clienteNome={cliente?.nome} />}
          {modulo === 'config' && aba === 'escritorio' && <EscritorioTela />}
          {modulo === 'config' && aba === 'usuarios' && <UsuariosTela />}
          {modulo === 'config' && aba === 'armazenamento' && <ArmazenamentoTela />}
          {modulo === 'config' && aba === 'tema' && <TemaTela />}
          {modulo === 'config' && aba === 'integrantes' && <IntegrantesTela />}
          {modulo === 'config' && aba === 'assinatura' && <AssinaturaTela />}
          {modulo === 'financeiro' && aba === 'contratos' && <ContratosTela somenteLeitura={permissoes.financeiroSoLeitura} />}
          {modulo === 'financeiro' && aba === 'cobranca' && <CobrancaTela key={`${faturaAberta ?? 'lista'}-${nonce}`} faturaInicial={faturaAberta} />}
          {modulo === 'financeiro' && aba === 'visao' && <VisaoFinTela />}
          {modulo === 'financeiro' && aba === 'pagar' && <ContasPagarTela />}
          {modulo === 'financeiro' && aba === 'conciliacao' && <ConciliacaoTela />}
          {modulo === 'financeiro' && aba === 'caixa' && <CaixaTela />}
          {modulo === 'financeiro' && aba === 'resultado' && <ResultadoTela />}
          {modulo === 'arquivos' && <ArquivosTela key={`${aba}-${nonce}-${clienteId ?? ''}`} aba={aba === 'recentes' ? 'recentes' : 'pastas'} inicial={pastaAberta ?? (clienteId ? { clienteId, caminho: [] } : undefined)} onConfigurar={() => irPara('config', 'armazenamento')} />}
          {modulo === 'clientes' && <ClientesTela key={aba} aba={aba} clientes={clientesDoModulo} />}
          {modulo === 'bpo' && aba === 'visao' && <VisaoBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'carteira' && <CarteiraBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'fila' && <FilaBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'rotinas' && <RotinasBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'aprovacoes' && <AprovacoesBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'entregas' && <EntregasBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'volume' && <VolumeBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'rentabilidade' && <RentabilidadeBpoTela {...propsBpo} />}
          {modulo === 'bpo' && aba === 'configuracao' && <ConfigBpoTela {...propsBpo} />}
          {modulo !== 'inicio' && modulo !== 'painel' && modulo !== 'crm' && modulo !== 'timesheet' && modulo !== 'config' && modulo !== 'financeiro' && modulo !== 'arquivos' && modulo !== 'bpo' && modulo !== 'clientes' && (
            <ModuloTela key={`${modulo}-${aba}`} titulo={rotuloModulo} aba={rotuloAba} cliente={cliente?.nome} chat={{ nomeUsuario: usuario.nome, conversaGeral: [], integrantes, onAbrirIntegrante: abrirIntegrante }} />
          )}
          {tempo.espera && <ModoEspera desde={tempo.espera.desde} onde={tempo.espera.onde} onRetomar={tempo.retomar} />}
        </Moldura>
        <Toasts />
        {minhaConta && <MinhaConta onFechar={() => setMinhaConta(false)} />}
        </SuporteProvider>
        </DocumentosProvider>
      </FluxosProvider>
    </NavegacaoProvider>
  )
}
