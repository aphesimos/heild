import { ArrowRightIcon, ChatsCircleIcon, CheckIcon, ClockIcon, EyeIcon, LifebuoyIcon, MagnifyingGlassIcon, MonitorIcon, PaperPlaneTiltIcon, QuestionIcon, ThumbsDownIcon, ThumbsUpIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Segmentado } from '@/components/ui/formulario'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { duracaoEscrita, useEscritaTexto } from '@/lib/escrita'
import { cn } from '@/lib/utils'
import { useLoja, useNavegacao, type Destino } from './loja'
import { useSessao } from './sessao'

/*
 * Suporte da plataforma (decisão do usuário, 8/11/2026): chat com a equipe da
 * plataforma (não do escritório) e, junto, a Ajuda do sistema, um assistente
 * barato que só responde sobre o sistema e as configurações dele. Vale para
 * todo usuário, com ou sem plano de IA; tem um limite próprio por mês e não
 * consome o limite de IA do plano. É da plataforma, não de um pacote de área.
 */

export const LIMITE_AJUDA = 30
export const EVENTO_SUPORTE_HORARIO = 'ui-lab:suporte-fora-do-horario'
const HORARIO = 'seg a sex, 8h às 20h'

type Secao = 'ajuda' | 'equipe' | 'historico'
interface MsgAjuda {
  de: 'eu' | 'ajuda'
  texto: string
  ir?: { rotulo: string; destino: Destino }
  paraEquipe?: boolean
  /** Diagnóstico (decisão de 8/11/2026): a ajuda lê, só para consulta, o que a conta de quem perguntou pode ver. */
  diagnostico?: Diagnostico
  id?: string
  /** Pensando; depois o texto aparece sendo escrito. */
  pendente?: boolean
  escrever?: boolean
}
interface Diagnostico {
  lendo: string[]
  naoViu: string[]
  estado: 'lendo' | 'pronto'
  achados: string[]
  correcao?: { texto: string; feito: string; decisao?: 'aprovada' | 'recusada' }
}
interface MsgEquipe {
  de: 'eu' | 'equipe' | 'sistema'
  texto: string
  hora: string
}
interface Chamado {
  id: string
  assunto: string
  quando: string
  situacao: 'resolvido' | 'aberto' | 'aguardando resposta'
  com: string
  msgs: MsgEquipe[]
}

/** Base da ajuda: só o sistema e as configurações dele, sempre com o caminho na tela. */
const base: { re: RegExp; texto: string; ir?: MsgAjuda['ir'] }[] = [
  {
    re: /libera|exce[çc]|permiss|acesso|aba/i,
    texto: 'Em Configurações › Usuários, abra a pessoa e, em Exceções, escolha a tela e o nível (ler, preparar, executar). Uma exceção libera ou bloqueia a aba inteira; fica registrada com o motivo.',
    ir: { rotulo: 'Abrir Usuários', destino: { modulo: 'config', aba: 'usuarios' } },
  },
  {
    re: /drive|armazen|nuvem|pasta|arquivo/i,
    texto: 'Em Configurações › Armazenamento você conecta a nuvem (Drive, OneDrive, servidor próprio), escolhe a árvore-modelo e marca as pastas que o cliente vê. Os arquivos ficam no módulo Arquivos.',
    ir: { rotulo: 'Abrir Armazenamento', destino: { modulo: 'config', aba: 'armazenamento' } },
  },
  {
    re: /r[ée]gua|cobran|boleto|inadimpl/i,
    texto: 'A régua dos honorários fica em Financeiro › Cobranças › Configurar › Política de inadimplência: etapas, canais e quando pausar. A régua de pendências dos clientes fica no CRM.',
    ir: { rotulo: 'Abrir Cobranças', destino: { modulo: 'financeiro', aba: 'cobranca' } },
  },
  {
    re: /tempo|timesheet|espera|parou|inativ/i,
    texto: 'O tempo só é contado no Painel com cliente aberto e no CRM. Depois de 3 minutos sem ação, a tela entra em espera: não desloga, só para o contador. O tempo ajusta em Configurações › Escritório.',
    ir: { rotulo: 'Abrir Meu tempo', destino: { modulo: 'timesheet', aba: 'meu' } },
  },
  {
    re: /integrante|orb|agente|limite de ia|time/i,
    texto: 'Os integrantes se ligam e se configuram em Configurações › Integrantes: o que fazem sozinhos, o que preparam para você aprovar e os limites de uso.',
    ir: { rotulo: 'Abrir Integrantes', destino: { modulo: 'config', aba: 'integrantes' } },
  },
  {
    re: /tema|logo|cor|marca|e-?mail do escrit/i,
    texto: 'A marca do escritório (logotipo, cores, domínio, remetente dos e-mails e modelos) fica em Configurações › Tema; o app do cliente usa o mesmo tema.',
    ir: { rotulo: 'Abrir Tema', destino: { modulo: 'config', aba: 'tema' } },
  },
  { re: /whats|n[úu]mero|canal/i, texto: 'Os números de WhatsApp e quem atende cada um ficam em CRM › Números.', ir: { rotulo: 'Abrir Números', destino: { modulo: 'crm', aba: 'numeros' } } },
  { re: /senha|segundo fator|2fa|sess/i, texto: 'Senha, segundo fator e sessões abertas ficam em Minha conta, no menu do seu nome, no pé da barra lateral.' },
  {
    re: /plano|assinatura|fatura da plataforma|pagamento da plataforma/i,
    texto: 'Plano, limites e a fatura da plataforma ficam em Configurações › Assinatura (só o Administrador vê).',
    ir: { rotulo: 'Abrir Assinatura', destino: { modulo: 'config', aba: 'assinatura' } },
  },
]
/** Sintomas que pedem diagnóstico (algo não funciona), e o que a ajuda acharia em cada caso. */
const sintoma = /n[ãa]o (recebo|chega|vejo|aparece|funciona|consigo)|sumiu|erro|por que .*n[ãa]o/i
const casos: { re: RegExp; lendo: string[]; achados: string[]; correcao?: { texto: string; feito: string } }[] = [
  {
    re: /aviso|notifica|sino/i,
    lendo: ['Minha conta › Preferências de aviso', 'Configurações › Usuários (seus setores)', 'Regras de aviso do CRM'],
    achados: ['Os avisos de “Conversas” estão desligados nas suas preferências desde 03/11.', 'Seus setores e as regras do CRM estão certos: o aviso é gerado, só não chega a você.'],
    correcao: { texto: 'Religar os avisos de Conversas nas suas preferências', feito: 'Avisos de Conversas religados nas suas preferências' },
  },
  {
    re: /cliente|app|documento|pasta/i,
    lendo: ['Configurações › Armazenamento (árvore-modelo)', 'Ficha do cliente (contatos e papéis)', 'Visibilidade das pastas'],
    achados: ['A pasta “Entregáveis/Contábil” está visível só para o papel sócio; quem é do financeiro da empresa não a vê no app.', 'O arquivo existe e está na pasta certa.'],
    correcao: { texto: 'Deixar “Entregáveis/Contábil” visível também ao papel financeiro', feito: 'Pasta Entregáveis/Contábil visível ao papel financeiro' },
  },
]

const foraDoEscopo = /imposto|\bdas\b|simples nacional|irpf|al[íi]quota|c[áa]lculo|folha de|lucro presumido|reforma tribut/i
/** Perguntas frequentes por módulo: primeiro degrau (FAQ → assistente → equipe); não contam no limite. */
const faq: { modulo: string; p: string; r: string }[] = [
  { modulo: 'Início', p: 'Qual a diferença entre o Assistente e o Time?', r: 'O Assistente é o chat geral, por cliente. O Time tem um integrante por setor, com fila, cartões de aprovação e estado.' },
  { modulo: 'Início', p: 'O que acontece quando aprovo um cartão?', r: 'A ação sai em seu nome, com registro de quem aprovou e quando. Editar e aprovar muda só aquele cartão.' },
  { modulo: 'Painel', p: 'Como reorganizo os widgets de uma aba?', r: 'Arraste pelo topo do widget, mude o tamanho pelo menu dele ou esconda. “Restaurar padrão” volta ao arranjo do escritório.' },
  { modulo: 'Painel', p: 'Por que não vejo uma aba do Painel?', r: 'Cada aba aparece para quem tem o setor. O Administrador libera exceções em Configurações › Usuários.' },
  { modulo: 'CRM', p: 'Como passo uma conversa para outra pessoa?', r: 'Na conversa, use Atribuir. O prazo de resposta continua contando e a pessoa recebe o aviso.' },
  { modulo: 'CRM', p: 'Onde crio respostas rápidas?', r: 'CRM › Números › Configurar › Respostas rápidas. Elas valem para todos os números do escritório.' },
  { modulo: 'Timesheet', p: 'Por que uma sessão ficou como estimada?', r: 'O sistema não teve evento suficiente naquele intervalo e estimou pelo que veio antes e depois. Confirme ou corrija em Meu tempo.' },
  { modulo: 'Timesheet', p: 'Como vejo as horas só do BPO?', r: 'Use o filtro Pacote (Todos, Contábil, BPO) no topo de Meu tempo, Equipe e Rentabilidade. O custo-hora continua o do escritório.' },
  { modulo: 'Financeiro', p: 'Por que a fatura do cliente veio com duas notas?', r: 'Cliente com mais de um serviço tem uma cobrança só, com os serviços em linhas, e uma NFS-e por serviço, pela regra do layout nacional.' },
  { modulo: 'Financeiro', p: 'Quem aprova uma conta a pagar?', r: 'Depende da alçada: até R$ 5 mil, o Gestor com o setor; acima, o Administrador. A liberação final é sempre no banco.' },
  { modulo: 'BPO', p: 'Por que não consigo conferir esta conta?', r: 'Quem digitou não confere, e quem alterou a alçada da empresa também não. No BPO de uma pessoa, confere a Gestora do escritório ou o cliente.' },
  { modulo: 'BPO', p: 'O sistema paga sozinho se o cliente não responder?', r: 'Nunca. O lote escalona: lembrete, substituto, alerta na véspera e, vencido, só alerta. Pagar sempre depende de uma aprovação registrada.' },
  { modulo: 'Configurações', p: 'Como libero uma tela para um colaborador?', r: 'Configurações › Usuários › a pessoa › Exceções: escolha a tela e o nível. Fica registrado com o motivo.' },
  { modulo: 'Configurações', p: 'Como mudo as cores e o logotipo?', r: 'Configurações › Tema. A prévia mostra o recorte antes de publicar; o app do cliente usa o mesmo tema.' },
  { modulo: 'Minha conta', p: 'Como troco a senha ou o segundo fator?', r: 'No menu do seu nome, no pé da barra lateral › Minha conta.' },
]
const MAX_LEITURAS = 5

const sugestoes = ['Como libero uma aba para um colaborador?', 'Como conecto o Google Drive?', 'Não recebo os avisos de conversas', 'Onde mudo a régua de cobrança?', 'Por que o meu tempo parou?']

const historicoInicial: Chamado[] = [
  {
    id: 'ch1',
    assunto: 'Trazer o financeiro do Conexa',
    quando: '22/10',
    situacao: 'resolvido',
    com: 'Mariana (suporte)',
    msgs: [
      { de: 'eu', texto: 'Exportei o Conexa em planilha; como subo?', hora: '10:02' },
      { de: 'equipe', texto: 'Em Financeiro › Configurar › Trazer o financeiro atual, escolha Conexa e envie o arquivo. Os contratos entram como versão 1.', hora: '10:07' },
      { de: 'sistema', texto: 'Chamado resolvido · avaliação: útil', hora: '10:20' },
    ],
  },
  {
    id: 'ch2',
    assunto: 'Erro ao conectar o Inter',
    quando: '03/11',
    situacao: 'resolvido',
    com: 'Rodrigo (suporte)',
    msgs: [
      { de: 'eu', texto: 'A conexão com o Inter dá erro de certificado.', hora: '15:40' },
      { de: 'equipe', texto: 'O Inter pede o certificado da API em .crt e .key; gere de novo no Internet Banking › API e envie os dois.', hora: '15:52' },
      { de: 'sistema', texto: 'Chamado resolvido · avaliação: útil', hora: '16:30' },
    ],
  },
]

const EVENTO_ABRIR = 'ui-lab:abrir-suporte'
/** Abre o suporte de qualquer lugar (barra lateral, ajuda do Assistente, menus). */
export const abrirSuporte = (secao?: Secao) => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR, { detail: secao }))

const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function SuporteProvider({ children }: { children: ReactNode }) {
  const loja = useLoja()
  const nav = useNavegacao()
  const { usuario } = useSessao()
  const primeiro = usuario.nome.split(' ')[0]
  const [aberto, setAberto] = useState(false)
  const [secao, setSecao] = useState<Secao>('ajuda')
  const [perguntas, setPerguntas] = useState(26)
  const [ajuda, setAjuda] = useState<MsgAjuda[]>([{ de: 'ajuda', texto: `Oi, ${primeiro}. Sou a ajuda do sistema: respondo como usar a plataforma e onde fica cada configuração. Para perguntas contábeis, use o Assistente.` }])
  const [equipe, setEquipe] = useState<MsgEquipe[]>([])
  const [estadoEquipe, setEstadoEquipe] = useState<'inicio' | 'fila' | 'atendendo' | 'deixada' | 'encerrado'>('inicio')
  const [historico, setHistorico] = useState(historicoInicial)
  const [visto, setVisto] = useState<Chamado | null>(null)
  const [foraHorario, setForaHorario] = useState(false)
  const [texto, setTexto] = useState('')
  const [equipeDigitando, setEquipeDigitando] = useState(false)
  const [buscaFaq, setBuscaFaq] = useState('')
  const [moduloFaq, setModuloFaq] = useState('todos')
  // Compartilhamento de tela com a equipe: só com pedido, consentimento, prazo e registro.
  const [pedidoTela, setPedidoTela] = useState<'nenhum' | 'pedido' | 'ativo' | 'recusado' | 'encerrado'>('nenhum')
  const [telaAte, setTelaAte] = useState('')
  const timers = useRef<number[]>([])
  const rolagem = useRef<HTMLDivElement>(null)
  // A conversa sempre mostra a última mensagem (e o aviso de limite, quando chega).
  useEffect(() => {
    const el = rolagem.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [ajuda, equipe.length, estadoEquipe, secao, perguntas, equipeDigitando])

  useEffect(() => {
    const alternar = (e: Event) => setForaHorario(!!(e as CustomEvent<boolean>).detail)
    const abrir = (e: Event) => {
      setSecao((e as CustomEvent<Secao | undefined>).detail ?? 'ajuda')
      setVisto(null)
      setAberto(true)
    }
    window.addEventListener(EVENTO_SUPORTE_HORARIO, alternar)
    window.addEventListener(EVENTO_ABRIR, abrir)
    return () => {
      window.removeEventListener(EVENTO_SUPORTE_HORARIO, alternar)
      window.removeEventListener(EVENTO_ABRIR, abrir)
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const esgotado = perguntas >= LIMITE_AJUDA

  const { permissoes } = useSessao()
  const ajustarUltimoDiagnostico = (f: (d: Diagnostico) => Diagnostico) =>
    setAjuda((ms) => {
      const i = ms.map((m) => !!m.diagnostico).lastIndexOf(true)
      return i < 0 ? ms : ms.map((m, k) => (k === i && m.diagnostico ? { ...m, diagnostico: f(m.diagnostico) } : m))
    })

  const perguntar = (p: string) => {
    if (!p.trim() || esgotado) return
    if (sintoma.test(p) && !foraDoEscopo.test(p)) {
      const caso = casos.find((c) => c.re.test(p))
      const naoViu = (['financeiro', 'config', 'bpo'] as const).filter((m) => !permissoes.modulos.includes(m)).map((m) => ({ financeiro: 'Financeiro', config: 'Configurações do escritório', bpo: 'BPO' })[m])
      const diag: Diagnostico = {
        lendo: (caso?.lendo ?? ['Configurações que a sua conta vê', 'Seus setores e exceções', 'Integrações conectadas']).slice(0, MAX_LEITURAS),
        naoViu,
        estado: 'lendo',
        achados: caso?.achados ?? ['Não achei nada errado nas configurações que a sua conta pode ver.'],
        correcao: caso?.correcao,
      }
      const id = crypto.randomUUID()
      const txt = 'Vou olhar as suas configurações para procurar o problema. Só leio: nada muda sem a sua aprovação.'
      setAjuda((m) => [...m, { de: 'eu', texto: p }, { de: 'ajuda', id, texto: '', pendente: true }])
      setPerguntas((n) => n + 1)
      setTexto('')
      // Pensa, escreve o aviso, lê as configurações e só então mostra o que achou.
      timers.current.push(window.setTimeout(() => setAjuda((m) => m.map((x) => (x.id === id ? { de: 'ajuda', id, texto: txt, escrever: true, diagnostico: diag, paraEquipe: !caso } : x))), 1300))
      timers.current.push(window.setTimeout(() => ajustarUltimoDiagnostico((d) => ({ ...d, estado: 'pronto' })), 1300 + duracaoEscrita(txt) + 2400))
      loja.registrar('Ajuda do sistema', `Leu, só para consulta, as configurações visíveis a ${usuario.nome} para diagnosticar: “${p.slice(0, 50)}”`)
      return
    }
    const achado = base.find((b) => b.re.test(p))
    const resposta: MsgAjuda =
      foraDoEscopo.test(p) && !achado
        ? {
            de: 'ajuda',
            texto: 'Essa é uma pergunta contábil, e eu só respondo sobre o sistema. Pergunte ao Assistente, no Início: ele usa a base legal e os dados dos clientes.',
            ir: { rotulo: 'Abrir o Assistente', destino: { modulo: 'inicio', aba: 'assistente' } },
          }
        : achado
          ? { de: 'ajuda', texto: achado.texto, ir: achado.ir }
          : { de: 'ajuda', texto: 'Não achei isso na ajuda do sistema. Quer que eu passe a pergunta para a equipe de suporte?', paraEquipe: true }
    const id = crypto.randomUUID()
    setAjuda((m) => [...m, { de: 'eu', texto: p }, { de: 'ajuda', id, texto: '', pendente: true }])
    setPerguntas((n) => n + 1)
    setTexto('')
    timers.current.push(window.setTimeout(() => setAjuda((m) => m.map((x) => (x.id === id ? { ...resposta, id, escrever: true } : x))), 1300))
  }

  /** A atendente aparece digitando antes de cada mensagem (pessoas não respondem de uma vez). */
  const equipeDiz = (texto: string, digitarMs: number) => {
    setEquipeDigitando(true)
    timers.current.push(
      window.setTimeout(() => {
        setEquipeDigitando(false)
        setEquipe((m) => [...m, { de: 'equipe', texto, hora: agora() }])
      }, digitarMs),
    )
  }

  const enviarEquipe = (p: string) => {
    if (!p.trim()) return
    setEquipe((m) => [...m, { de: 'eu', texto: p, hora: agora() }])
    setTexto('')
    loja.registrar(usuario.nome, `Abriu um chamado no suporte da plataforma: “${p.slice(0, 60)}”`)
    if (foraHorario) {
      setEstadoEquipe('deixada')
      setEquipe((m) => [...m, { de: 'sistema', texto: `Recebido. A equipe está fora do horário (${HORARIO}); responde amanhã a partir das 8h, aqui e por e-mail.`, hora: agora() }])
      return
    }
    if (estadoEquipe === 'atendendo') {
      equipeDiz('Anotado. Vou verificar e já te respondo por aqui.', 2600)
      return
    }
    setEstadoEquipe('fila')
    timers.current.push(
      window.setTimeout(() => {
        setEstadoEquipe('atendendo')
        setEquipe((m) => [...m, { de: 'sistema', texto: 'Mariana, do suporte da plataforma, entrou na conversa.', hora: agora() }])
      }, 2500),
      window.setTimeout(() => equipeDiz(`Oi, ${primeiro}! Já vi sua mensagem e o diagnóstico da ajuda. Se não resolver, posso ver a sua tela, mas só se você deixar.`, 2800), 2600),
      window.setTimeout(() => setPedidoTela((v) => (v === 'nenhum' ? 'pedido' : v)), 7200),
    )
  }

  const responderTela = (aceito: boolean) => {
    if (aceito) {
      const ate = new Date(Date.now() + 30 * 60_000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      setTelaAte(ate)
      setPedidoTela('ativo')
      setEquipe((m) => [...m, { de: 'sistema', texto: `Você deixou a Mariana ver a sua tela até ${ate}. Ela só vê; não clica nem digita.`, hora: agora() }])
      loja.registrar(usuario.nome, `Deixou o suporte da plataforma (Mariana) ver a tela até ${ate}`)
    } else {
      setPedidoTela('recusado')
      setEquipe((m) => [...m, { de: 'sistema', texto: 'Você recusou o compartilhamento de tela. A conversa segue por texto.', hora: agora() }])
    }
  }
  const encerrarTela = () => {
    setPedidoTela('encerrado')
    setEquipe((m) => [...m, { de: 'sistema', texto: 'Compartilhamento de tela encerrado.', hora: agora() }])
    loja.registrar(usuario.nome, 'Encerrou o compartilhamento de tela com o suporte da plataforma')
    loja.toast('Compartilhamento de tela encerrado. Fica registrado no histórico do suporte.')
  }

  const encerrar = (util: boolean) => {
    const assunto = equipe.find((m) => m.de === 'eu')?.texto ?? 'Conversa com o suporte'
    setHistorico((h) => [
      {
        id: `ch${Date.now()}`,
        assunto: assunto.slice(0, 48),
        quando: 'hoje',
        situacao: estadoEquipe === 'deixada' ? 'aguardando resposta' : 'resolvido',
        com: estadoEquipe === 'deixada' ? 'equipe (fora do horário)' : 'Mariana (suporte)',
        msgs: [...equipe, { de: 'sistema', texto: `Conversa encerrada · avaliação: ${util ? 'útil' : 'não ajudou'}`, hora: agora() }],
      },
      ...h,
    ])
    setEquipe([])
    setEstadoEquipe('encerrado')
    if (pedidoTela === 'ativo') setPedidoTela('encerrado')
    loja.toast('Conversa encerrada e guardada no histórico do suporte.')
  }

  const passarParaEquipe = (pergunta?: string) => {
    setSecao('equipe')
    if (pergunta) setTexto(pergunta)
  }

  const ir = (d: Destino) => {
    setAberto(false)
    nav.irPara(d)
  }

  return (
    <>
      {children}
      {pedidoTela === 'ativo' && (
        <div role="status" className="bg-foreground text-background fixed top-3 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full py-1.5 pr-1.5 pl-4 text-sm shadow-lg">
          <span className="bg-destructive size-2 animate-pulse rounded-full" />
          <MonitorIcon className="size-4" /> Mariana (suporte da plataforma) está vendo a sua tela · até {telaAte}
          <Button size="sm" variant="secondary" className="rounded-full" onClick={encerrarTela}>
            Encerrar
          </Button>
        </div>
      )}
      <Sheet open={aberto} onOpenChange={setAberto}>
        <SheetContent className="gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <LifebuoyIcon className="size-5" weight="duotone" /> Suporte da plataforma
            </SheetTitle>
            <SheetDescription>A equipe da plataforma e a ajuda do sistema. A ajuda lê, só para consulta, o que a sua conta pode ver; a equipe só vê a sua tela se você deixar.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 border-b px-4 py-3">
            <Segmentado
              rotulo="Seção do suporte"
              valor={secao}
              onMudar={(v) => {
                setSecao(v)
                setVisto(null)
              }}
              opcoes={[
                { valor: 'ajuda', rotulo: 'Ajuda do sistema' },
                { valor: 'equipe', rotulo: 'Falar com a equipe' },
                { valor: 'historico', rotulo: 'Histórico' },
              ]}
            />
            {secao === 'ajuda' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-sunken h-1.5 flex-1 overflow-hidden rounded-full">
                  <span className={cn('block h-full rounded-full', esgotado ? 'bg-destructive' : 'bg-foreground/60')} style={{ width: `${Math.min(100, (perguntas / LIMITE_AJUDA) * 100)}%` }} />
                </span>
                <span className="text-muted-foreground shrink-0 tabular-nums">
                  {perguntas} de {LIMITE_AJUDA} em novembro · não usa o limite de IA do plano
                </span>
              </div>
            )}
            {secao === 'equipe' && (
              <p className={cn('flex items-center gap-1.5 text-xs', foraHorario ? 'text-warning-foreground' : 'text-muted-foreground')}>
                <ClockIcon className="size-3.5" />
                {foraHorario ? `Fora do horário (${HORARIO}): deixe a mensagem, respondemos amanhã a partir das 8h.` : `Equipe online agora · ${HORARIO} · resposta em cerca de 5 min`}
              </p>
            )}
          </div>

          <div ref={rolagem} className="area-rolagem-dupla flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
            {secao === 'ajuda' && (
              <BlocoFaq
                aberto={ajuda.length === 1}
                busca={buscaFaq}
                onBusca={setBuscaFaq}
                modulo={moduloFaq}
                onModulo={setModuloFaq}
                onPerguntar={(q) => {
                  setBuscaFaq('')
                  perguntar(q)
                }}
                esgotado={esgotado}
              />
            )}
            {secao === 'ajuda' &&
              ajuda.map((m, i) => (
                <div key={i} className={cn('max-w-[88%] rounded-[18px] px-3.5 py-2.5 text-sm', m.de === 'eu' ? 'bg-foreground text-background self-end' : 'bg-surface shadow-cartao self-start')}>
                  {m.de === 'ajuda' && (
                    <span className="text-muted-foreground mb-0.5 flex items-center gap-1 text-[11px]">
                      <QuestionIcon className="size-3" /> Ajuda do sistema
                    </span>
                  )}
                  {m.pendente ? (
                    <Pensando />
                  ) : (
                    <TextoEscrito id={m.id ?? `a${i}`} texto={m.texto} escrever={!!m.escrever}>
                      {m.diagnostico && (
                        <BlocoDiagnostico
                          d={m.diagnostico}
                          onDecidir={(ok) => {
                            const c = m.diagnostico?.correcao
                            if (!c) return
                            ajustarUltimoDiagnostico((d) => ({ ...d, correcao: d.correcao && { ...d.correcao, decisao: ok ? 'aprovada' : 'recusada' } }))
                            if (ok) {
                              loja.registrar(usuario.nome, `Aprovou a correção proposta pela ajuda do sistema: ${c.texto}`)
                              loja.toast(`${c.feito}. Aprovado por você e registrado.`)
                            }
                          }}
                        />
                      )}
                      {m.ir && (
                        <Button size="sm" variant="outline" className="mt-2 flex rounded-full" onClick={() => ir(m.ir!.destino)}>
                          {m.ir.rotulo} <ArrowRightIcon />
                        </Button>
                      )}
                      {m.paraEquipe && (
                        <Button size="sm" variant="outline" className="mt-2 flex rounded-full" onClick={() => passarParaEquipe(ajuda[i - 1]?.texto)}>
                          <ChatsCircleIcon /> Passar para a equipe
                        </Button>
                      )}
                    </TextoEscrito>
                  )}
                </div>
              ))}
            {secao === 'ajuda' && ajuda.length === 1 && (
              <div className="flex flex-wrap gap-1.5">
                {sugestoes.map((s) => (
                  <button key={s} type="button" onClick={() => perguntar(s)} disabled={esgotado} className="bg-sunken cursor-pointer rounded-full px-3 py-1.5 text-left text-xs disabled:opacity-50">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {secao === 'ajuda' && esgotado && (
              <div className="bg-sunken/70 flex flex-col gap-2 rounded-[16px] p-3 text-sm">
                <p>Você usou as {LIMITE_AJUDA} perguntas de novembro da ajuda do sistema. Renovam em 01/12. Até lá, a equipe responde por aqui, sem limite.</p>
                <Button size="sm" className="w-fit rounded-full" onClick={() => passarParaEquipe()}>
                  <ChatsCircleIcon /> Falar com a equipe
                </Button>
              </div>
            )}

            {secao === 'equipe' && (
              <>
                {equipe.length === 0 && (
                  <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                    <ChatsCircleIcon className="size-8" weight="duotone" />
                    <p>Conte o que está acontecendo. Se for um erro, diga em que tela; a equipe vê a configuração do escritório, nunca os dados dos clientes.</p>
                  </div>
                )}
                {equipe.map((m, i) =>
                  m.de === 'sistema' ? (
                    <p key={i} className="text-muted-foreground self-center text-center text-xs">
                      {m.texto}
                    </p>
                  ) : (
                    <div key={i} className={cn('flex max-w-[88%] items-end gap-2', m.de === 'eu' ? 'self-end' : 'self-start')}>
                      {m.de === 'equipe' && <Avatar nome="Mariana Suporte" tamanho="sm" />}
                      <div className={cn('rounded-[18px] px-3.5 py-2.5 text-sm', m.de === 'eu' ? 'bg-foreground text-background' : 'bg-surface shadow-cartao')}>
                        {m.texto}
                        <span className="mt-0.5 block text-right text-[10px] opacity-60">{m.hora}</span>
                      </div>
                    </div>
                  ),
                )}
                {pedidoTela === 'pedido' && (
                  <div className="bg-surface shadow-cartao flex flex-col gap-2 self-stretch rounded-[16px] p-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <MonitorIcon className="size-4" /> Mariana pede para ver a sua tela
                    </span>
                    <span className="text-muted-foreground text-xs">Por até 30 minutos, sem gravação. Ela só vê o que aparece na sua tela; não clica nem digita. Você encerra quando quiser, e fica registrado no histórico.</span>
                    <span className="flex gap-1.5">
                      <Button size="sm" className="rounded-full" onClick={() => responderTela(true)}>
                        <CheckIcon /> Deixar ver por 30 min
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => responderTela(false)}>
                        <XIcon /> Recusar
                      </Button>
                    </span>
                  </div>
                )}
                {pedidoTela === 'ativo' && (
                  <div className="bg-sunken/70 flex items-center gap-2 self-stretch rounded-[14px] px-3 py-2 text-xs">
                    <EyeIcon className="size-4 shrink-0" /> <span className="flex-1">A Mariana está vendo a sua tela até {telaAte}.</span>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={encerrarTela}>
                      Encerrar
                    </Button>
                  </div>
                )}
                {equipeDigitando && (
                  <p className="text-muted-foreground flex items-center gap-2 self-start text-xs">
                    Mariana está digitando
                    <span className="flex gap-0.5" aria-hidden>
                      {[0, 1, 2].map((n) => (
                        <span key={n} className="bg-muted-foreground size-1 animate-bounce rounded-full" style={{ animationDelay: `${n * 120}ms` }} />
                      ))}
                    </span>
                  </p>
                )}
                {estadoEquipe === 'fila' && (
                  <p className="text-muted-foreground flex items-center gap-2 self-center text-xs">
                    <span className="bg-foreground/40 size-2 animate-pulse rounded-full" /> Na fila: 1 pessoa na sua frente · cerca de 2 min
                  </p>
                )}
                {(estadoEquipe === 'atendendo' || estadoEquipe === 'deixada') && equipe.length > 0 && (
                  <div className="text-muted-foreground mt-2 flex items-center justify-center gap-2 text-xs">
                    Resolveu?
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => encerrar(true)}>
                      <ThumbsUpIcon /> Sim, encerrar
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => encerrar(false)}>
                      <ThumbsDownIcon /> Não ajudou
                    </Button>
                  </div>
                )}
              </>
            )}

            {secao === 'historico' &&
              (visto ? (
                <>
                  <button type="button" className="text-muted-foreground w-fit cursor-pointer text-xs underline-offset-2 hover:underline" onClick={() => setVisto(null)}>
                    ← Voltar ao histórico
                  </button>
                  <p className="text-sm font-medium">{visto.assunto}</p>
                  {visto.msgs.map((m, i) => (
                    <p key={i} className={cn('text-sm', m.de === 'sistema' && 'text-muted-foreground text-xs')}>
                      <span className="text-muted-foreground text-xs">
                        {m.hora} · {m.de === 'eu' ? 'você' : m.de === 'equipe' ? visto.com : 'sistema'}:
                      </span>{' '}
                      {m.texto}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-xs">Conversas com a equipe. Perguntas à ajuda do sistema neste mês: {perguntas}.</p>
                  {historico.map((c) => (
                    <button key={c.id} type="button" onClick={() => setVisto(c)} className="bg-surface shadow-cartao flex cursor-pointer flex-col rounded-[16px] px-3.5 py-3 text-left">
                      <span className="text-sm">{c.assunto}</span>
                      <span className="text-muted-foreground text-xs">
                        {c.quando} · {c.com} · {c.situacao}
                      </span>
                    </button>
                  ))}
                </>
              ))}
          </div>

          {secao !== 'historico' && (
            <div className="border-t p-3">
              <div className="bg-surface shadow-cartao flex items-center gap-2 rounded-full py-1 pr-1 pl-4">
                <input
                  aria-label={secao === 'ajuda' ? 'Pergunta para a ajuda do sistema' : 'Mensagem para a equipe'}
                  value={texto}
                  disabled={secao === 'ajuda' && esgotado}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (secao === 'ajuda' ? perguntar(texto) : enviarEquipe(texto))}
                  placeholder={secao === 'ajuda' ? (esgotado ? 'Limite do mês atingido' : 'Como faço… / Onde fica…') : 'Escreva para a equipe'}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
                />
                <Button size="icon-sm" className="rounded-full" aria-label="Enviar" disabled={!texto.trim() || (secao === 'ajuda' && esgotado)} onClick={() => (secao === 'ajuda' ? perguntar(texto) : enviarEquipe(texto))}>
                  <PaperPlaneTiltIcon />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

/** Diagnóstico da ajuda: o que está lendo (somente leitura), o que achou e a correção proposta, que só vale aprovada. */
function BlocoDiagnostico({ d, onDecidir }: { d: Diagnostico; onDecidir: (ok: boolean) => void }) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="bg-sunken/60 flex flex-col gap-1 rounded-[12px] px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          {d.estado === 'lendo' ? <span className="bg-foreground/50 size-2 animate-pulse rounded-full" /> : <MagnifyingGlassIcon className="size-3.5" />}
          {d.estado === 'lendo' ? 'Olhando as suas configurações (somente leitura)…' : `Olhei, só para leitura (${d.lendo.length} de ${MAX_LEITURAS} leituras):`}
        </span>
        {d.lendo.map((l) => (
          <span key={l} className="text-muted-foreground">
            · {l}
          </span>
        ))}
        {d.naoViu.length > 0 && <span className="text-muted-foreground">Não olhei (sua conta não vê): {d.naoViu.join(', ')}.</span>}
      </div>
      {d.estado === 'pronto' && (
        <>
          <ul className="flex flex-col gap-1">
            {d.achados.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="bg-foreground/50 mt-2 size-1 shrink-0 rounded-full" />
                {a}
              </li>
            ))}
          </ul>
          {d.correcao && (
            <div className="border-border/70 flex flex-col gap-2 rounded-[12px] border p-2.5">
              <span className="text-xs font-medium">Correção proposta</span>
              <span>{d.correcao.texto}</span>
              {d.correcao.decisao ? (
                <span className="text-muted-foreground text-xs">{d.correcao.decisao === 'aprovada' ? 'Aprovada por você e aplicada.' : 'Recusada: nada foi mudado.'}</span>
              ) : (
                <span className="flex gap-1.5">
                  <Button size="sm" className="rounded-full" onClick={() => onDecidir(true)}>
                    <CheckIcon /> Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => onDecidir(false)}>
                    Recusar
                  </Button>
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** Perguntas frequentes por módulo, com busca. Sem resposta aqui, a pergunta vai ao assistente (e dele à equipe). */
function BlocoFaq({
  aberto,
  busca,
  onBusca,
  modulo,
  onModulo,
  onPerguntar,
  esgotado,
}: {
  aberto: boolean
  busca: string
  onBusca: (v: string) => void
  modulo: string
  onModulo: (v: string) => void
  onPerguntar: (q: string) => void
  esgotado: boolean
}) {
  const q = busca.trim().toLowerCase()
  const lista = faq.filter((f) => (modulo === 'todos' || f.modulo === modulo) && (!q || `${f.p} ${f.r}`.toLowerCase().includes(q)))
  const modulos = ['todos', ...new Set(faq.map((f) => f.modulo))]
  return (
    <details open={aberto} className="bg-surface shadow-cartao rounded-[16px] p-3 text-sm">
      <summary className="cursor-pointer font-medium select-none">Perguntas frequentes</summary>
      <div className="mt-2 flex flex-col gap-2">
        <label className="bg-raised shadow-contorno flex h-9 items-center gap-2 rounded-full px-3">
          <MagnifyingGlassIcon className="text-muted-foreground size-4" />
          <input value={busca} onChange={(e) => onBusca(e.target.value)} placeholder="Buscar nas perguntas frequentes" aria-label="Buscar nas perguntas frequentes" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex flex-wrap gap-1">
          {modulos.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={modulo === m}
              onClick={() => onModulo(m)}
              className={cn('cursor-pointer rounded-full px-2.5 py-1 text-xs', modulo === m ? 'bg-foreground text-background' : 'bg-sunken text-muted-foreground')}
            >
              {m === 'todos' ? 'Todos' : m}
            </button>
          ))}
        </div>
        <ul className="area-rolagem-dupla flex max-h-64 flex-col overflow-y-auto">
          {lista.map((f) => (
            <li key={f.p} className="border-border/70 border-b last:border-0">
              <details className="py-1.5">
                <summary className="cursor-pointer">{f.p}</summary>
                <p className="text-muted-foreground mt-1 text-xs">
                  {f.modulo} · {f.r}
                </p>
              </details>
            </li>
          ))}
          {lista.length === 0 && <li className="text-muted-foreground py-2 text-xs">Nada nas perguntas frequentes.</li>}
        </ul>
        {q && (
          <Button size="sm" variant="outline" className="w-fit rounded-full" disabled={esgotado} onClick={() => onPerguntar(busca)}>
            <QuestionIcon /> Perguntar ao assistente: “{busca.slice(0, 40)}”
          </Button>
        )}
        <p className="text-muted-foreground text-[11px]">Primeiro as perguntas frequentes (não contam no limite), depois o assistente e, se precisar, a equipe.</p>
      </div>
    </details>
  )
}

function Pensando() {
  return (
    <p className="text-muted-foreground flex items-center gap-1" aria-live="polite">
      pensando
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((n) => (
          <span key={n} className="bg-muted-foreground size-1 animate-bounce rounded-full" style={{ animationDelay: `${n * 120}ms` }} />
        ))}
      </span>
    </p>
  )
}

/** Resposta da ajuda escrita aos poucos; botões e diagnóstico só aparecem quando o texto termina. */
function TextoEscrito({ id, texto, escrever, children }: { id: string; texto: string; escrever: boolean; children?: ReactNode }) {
  const { visivel, escrevendo } = useEscritaTexto(id, texto, escrever)
  return (
    <>
      {visivel}
      {escrevendo && <span aria-hidden className="bg-foreground/70 ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse" />}
      {!escrevendo && <div className="surgir">{children}</div>}
    </>
  )
}
