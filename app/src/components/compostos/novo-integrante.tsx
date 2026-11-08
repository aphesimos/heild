import { ArrowLeftIcon, CheckIcon, EyeIcon, LockSimpleIcon, SparkleIcon } from '@phosphor-icons/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Orb } from '@/components/ui/orb'
import type { Integrante } from '@/dados/tipos'
import { cn } from '@/lib/utils'

type Passo = 'descrever' | 'propondo' | 'proposta' | 'revisao'

interface Ferramenta {
  nome: string
  nivel: 'ler' | 'rascunhar' | 'executar'
  descricao: string
  /** O usuário não tem esta ferramenta ou este nível: vem marcada e removida (02, 11.1). */
  semPermissao?: boolean
}

/** Proposta de exemplo; em produção vem de `integrante.propor(texto)`. */
const propostaExemplo = {
  nome: 'Vigia de retenções',
  funcao: 'Toda segunda, aponta notas tomadas do Presumido com ISS retido sem a retenção lançada e prepara o aviso ao cliente.',
  setores: ['Fiscal', 'Notas'],
  ferramentas: [
    { nome: 'nota.listar_tomadas', nivel: 'ler', descricao: 'Lista as notas tomadas por competência' },
    { nome: 'calculo.retencao_iss', nivel: 'ler', descricao: 'Calcula a retenção devida' },
    { nome: 'tarefa.criar', nivel: 'executar', descricao: 'Abre tarefa para quem cuida do cliente' },
    { nome: 'conversa.rascunhar_resposta', nivel: 'rascunhar', descricao: 'Prepara o aviso ao cliente (você aprova o envio)' },
    { nome: 'lancamento.corrigir', nivel: 'executar', descricao: 'Corrigir o lançamento contábil', semPermissao: true },
  ] as Ferramenta[],
  gatilhos: ['Toda segunda, às 7h, com checagem sem modelo antes de acordar', 'Quando uma nota tomada com ISS retido chegar'],
}

const cores = ['#e86a8a', '#f7a335', '#4fc9a8', '#3d86f7', '#6e5cf2', '#f2d04b', '#5bc0eb', '#9bc53d']

const exemplos = [
  'Toda segunda, me diga quais clientes do Presumido têm nota tomada com ISS retido sem a retenção lançada, e prepare o aviso ao cliente.',
  'Quando um cliente do Simples passar de 80% do sublimite, me avise com a projeção do ano.',
]

interface Props {
  aberto: boolean
  onFechar: () => void
  onAtivar?: (i: Integrante) => void
}

/**
 * Criar integrante (02, 11.1): descrever em texto → proposta (nome, avatar,
 * função, setores, ferramentas só entre as que o usuário tem, gatilhos) →
 * revisão → ativação, com 14 dias de observação.
 */
export function NovoIntegrante({ aberto, onFechar, onAtivar }: Props) {
  const [passo, setPasso] = useState<Passo>('descrever')
  const [descricao, setDescricao] = useState('')
  const [nome, setNome] = useState(propostaExemplo.nome)
  const [cor, setCor] = useState(cores[0])
  const [ferramentas, setFerramentas] = useState(() => new Set(propostaExemplo.ferramentas.filter((f) => !f.semPermissao).map((f) => f.nome)))

  // Simula o tempo do modelo propondo.
  useEffect(() => {
    if (passo !== 'propondo') return
    const t = window.setTimeout(() => setPasso('proposta'), 1600)
    return () => window.clearTimeout(t)
  }, [passo])

  const fechar = () => {
    onFechar()
    window.setTimeout(() => {
      setPasso('descrever')
      setDescricao('')
    }, 200)
  }

  const ativar = () => {
    onAtivar?.({
      id: `i-novo-${Date.now()}`,
      setor: 'fiscal',
      tipo: 'criado_pelo_usuario',
      nome,
      cor,
      setorRotulo: `${propostaExemplo.setores.join(' e ')} · criado por você`,
      funcao: propostaExemplo.funcao,
      estado: 'disponivel',
      resumo: 'Em observação · acabou de ser ativado',
      fila: 0,
      pendentes: 0,
      emObservacao: true,
      sugestoes: ['Rode a checagem desta semana agora', 'Quais clientes você vigia?'],
    })
    fechar()
  }

  const etapas: { id: Passo[]; rotulo: string }[] = [
    { id: ['descrever'], rotulo: 'Descrever' },
    { id: ['propondo', 'proposta'], rotulo: 'Proposta' },
    { id: ['revisao'], rotulo: 'Revisar e ativar' },
  ]

  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && fechar()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo integrante</DialogTitle>
          <DialogDescription>Descreva o que ele deve fazer. O sistema propõe a configuração, você revisa e ativa.</DialogDescription>
        </DialogHeader>

        <ol className="flex items-center gap-2 text-xs">
          {etapas.map((e, i) => {
            const atual = e.id.includes(passo)
            const feito = etapas.findIndex((x) => x.id.includes(passo)) > i
            return (
              <li key={e.rotulo} className="flex items-center gap-2">
                {i > 0 && <span className="bg-border h-px w-6" />}
                <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', atual ? 'bg-primary text-primary-foreground' : feito ? 'bg-sunken text-foreground' : 'text-muted-foreground')}>
                  {feito ? <CheckIcon weight="bold" className="size-3" /> : <span className="tabular-nums">{i + 1}</span>}
                  {e.rotulo}
                </span>
              </li>
            )
          })}
        </ol>

        {passo === 'descrever' && (
          <div className="flex flex-col gap-3">
            <Label htmlFor="descricao-integrante">O que ele deve fazer?</Label>
            <Textarea id="descricao-integrante" autoFocus rows={5} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: toda segunda, me diga quais clientes…" />
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">Exemplos</span>
              {exemplos.map((x) => (
                <button key={x} type="button" onClick={() => setDescricao(x)} className="bg-surface hover:bg-sunken cursor-pointer rounded-[12px] px-3 py-2 text-left text-sm transition-colors">
                  {x}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button disabled={descricao.trim().length < 10} onClick={() => setPasso('propondo')}>
                <SparkleIcon weight="fill" /> Propor
              </Button>
            </div>
          </div>
        )}

        {passo === 'propondo' && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Orb reacao="thinking" cor={cor} tamanho={64} animado modo="wander" cutucavel={false} />
            <p className="text-muted-foreground text-sm">Montando a proposta: função, setores, ferramentas e gatilhos…</p>
          </div>
        )}

        {passo === 'proposta' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Orb cor={cor} tamanho={56} animado reacao="happy" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label htmlFor="nome-integrante">Nome</Label>
                <Input id="nome-integrante" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Cor do orb</span>
              <div className="flex flex-wrap gap-2">
                {cores.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    aria-pressed={c === cor}
                    onClick={() => setCor(c)}
                    className={cn('size-8 cursor-pointer rounded-full transition', c === cor ? 'ring-foreground ring-2 ring-offset-2 ring-offset-[var(--popover)]' : 'hover:scale-110')}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <Secao titulo="Função">
              <p className="text-sm">{propostaExemplo.funcao}</p>
            </Secao>
            <Secao titulo="Setores">
              <div className="flex gap-2">
                {propostaExemplo.setores.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </Secao>
            <Secao titulo="Ferramentas" ajuda="Só as que você tem, até o nível que você tem.">
              <ul className="flex flex-col gap-1.5">
                {propostaExemplo.ferramentas.map((f) => (
                  <li key={f.nome}>
                    <label className={cn('flex items-start gap-3 rounded-[12px] px-3 py-2', f.semPermissao ? 'text-muted-foreground bg-sunken/60' : 'hover:bg-sunken cursor-pointer')}>
                      <input
                        type="checkbox"
                        className="accent-primary mt-1"
                        disabled={f.semPermissao}
                        checked={!f.semPermissao && ferramentas.has(f.nome)}
                        onChange={(e) =>
                          setFerramentas((s) => {
                            const n = new Set(s)
                            if (e.target.checked) n.add(f.nome)
                            else n.delete(f.nome)
                            return n
                          })
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-sm">
                          <code className="text-xs">{f.nome}</code>
                          <Badge variant="outline">{f.nivel}</Badge>
                        </span>
                        <span className="block text-xs">
                          {f.semPermissao ? (
                            <span className="flex items-center gap-1">
                              <LockSimpleIcon className="size-3" /> Você não tem isso; removido.
                            </span>
                          ) : (
                            f.descricao
                          )}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </Secao>
            <Secao titulo="Gatilhos">
              <ul className="list-disc pl-5 text-sm">
                {propostaExemplo.gatilhos.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </Secao>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setPasso('descrever')}>
                <ArrowLeftIcon /> Voltar
              </Button>
              <Button onClick={() => setPasso('revisao')}>Revisar</Button>
            </div>
          </div>
        )}

        {passo === 'revisao' && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface flex items-center gap-4 rounded-[18px] p-4">
              <Orb cor={cor} tamanho={48} />
              <div className="min-w-0">
                <div className="font-medium">{nome}</div>
                <div className="text-muted-foreground text-sm">{propostaExemplo.setores.join(' e ')} · {ferramentas.size} ferramentas · {propostaExemplo.gatilhos.length} gatilhos</div>
              </div>
            </div>
            <div className="bg-sunken flex gap-3 rounded-[14px] p-3 text-sm">
              <EyeIcon weight="duotone" className="mt-0.5 size-5 shrink-0" />
              <p>
                <strong className="font-medium">14 dias de observação.</strong> Nesse período, tudo o que ele faria sozinho vira cartão para você aprovar. Ao fim, você decide o que ele passa a fazer sem perguntar.
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setPasso('proposta')}>
                <ArrowLeftIcon /> Voltar
              </Button>
              <Button onClick={ativar}>
                <CheckIcon weight="bold" /> Ativar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Secao({ titulo, ajuda, children }: { titulo: string; ajuda?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-medium">{titulo}</h3>
        {ajuda && <span className="text-muted-foreground text-xs">{ajuda}</span>}
      </div>
      {children}
    </section>
  )
}
