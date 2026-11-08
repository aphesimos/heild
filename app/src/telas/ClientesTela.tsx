import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useFluxos } from '@/ambiente/fluxos'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Caixa, Numero } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, Fichas, GavetaFormulario } from '@/components/ui/formulario'
import { empresaBpo } from '@/dados/bpo'
import type { Cliente } from '@/dados/tipos'

type Pacote = 'contabil' | 'bpo'
const rotuloPacote: Record<Pacote, string> = { contabil: 'Contabilidade', bpo: 'BPO financeiro' }
const pacotesDe = (c: Cliente): Pacote[] => c.servicos ?? ['contabil']
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/**
 * Clientes (10, 2.2): o cadastro dos clientes para quem não tem o Painel
 * (quem é só do BPO, ou o escritório só de BPO). Cada cliente com os pacotes
 * que contratou, quem atende e a ficha (contatos por assunto, alçadas, app).
 * É o mesmo cadastro do Painel › Societário: um cliente existe uma vez só.
 */
export function ClientesTela({ aba, clientes }: { aba: string; clientes: Cliente[] }) {
  const loja = useLoja()
  const fluxos = useFluxos()
  const { usuario } = useSessao()
  const [busca, setBusca] = useState('')
  const [novos, setNovos] = usePersistente<Cliente[]>('clientes.novos', [])
  const [gaveta, setGaveta] = useState(false)
  const [rascunho, setRascunho] = useState({ nome: '', documento: '', regime: 'Simples Nacional' as Cliente['regime'], pacotes: ['bpo'] as Pacote[] })
  const todos = [...novos, ...clientes]
  const q = busca.trim().toLowerCase()
  const lista = todos.filter((c) => !q || c.nome.toLowerCase().includes(q) || c.codigo.includes(q) || c.documento.includes(q))
  const pode = usuario.papel !== 'colaborador'

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <header className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{aba === 'contatos' ? 'Contatos dos clientes' : 'Clientes'}</h1>
            <p className="text-muted-foreground text-sm">
              {aba === 'contatos' ? 'Quem fala com o escritório, o que recebe, se usa o app e até quanto aprova' : 'O mesmo cadastro em todos os pacotes: cada cliente com o que contratou e quem atende'}
            </p>
          </div>
          <label className="bg-raised shadow-contorno flex h-9 w-full items-center gap-2 rounded-full px-3 sm:w-64">
            <MagnifyingGlassIcon className="text-muted-foreground size-4" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome, código ou CNPJ" aria-label="Buscar cliente" className="w-full bg-transparent text-sm outline-none" />
          </label>
          {pode && aba === 'cadastro' && (
            <Button size="sm" className="rounded-full" onClick={() => setGaveta(true)}>
              <PlusIcon /> Novo cliente
            </Button>
          )}
        </header>

        {aba === 'cadastro' ? (
          <>
            <Caixa>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Numero valor={todos.length} rotulo="clientes" />
                <Numero valor={todos.filter((c) => pacotesDe(c).includes('bpo')).length} rotulo="com BPO financeiro" />
                <Numero valor={todos.filter((c) => pacotesDe(c).length > 1).length} rotulo="com mais de um pacote" />
                <Numero valor={todos.filter((c) => c.situacao === 'implantacao').length} rotulo="em implantação" />
              </div>
            </Caixa>
            <Caixa className="gap-0 p-0 sm:p-0">
              <ul className="divide-border/70 flex flex-col divide-y">
                {lista.map((c) => {
                  const ficha = loja.fichaDe(c.id)
                  const e = empresaBpo(c.id)
                  const resp = [ficha?.responsaveis.contabil && `Contábil: ${ficha.responsaveis.contabil}`, ficha?.responsaveis.bpo_financeiro && `BPO: ${ficha.responsaveis.bpo_financeiro}`].filter(Boolean).join(' · ')
                  return (
                    <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
                      <span className="min-w-0 flex-1 basis-64">
                        <span className="block truncate text-sm font-medium">
                          {c.codigo} - {c.nome}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {c.documento} · {c.regime}
                          {c.situacao === 'implantacao' && ' · em implantação'}
                          {resp && ` · ${resp}`}
                        </span>
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {pacotesDe(c).map((p) => (
                          <Badge key={p} variant="outline">
                            {rotuloPacote[p]}
                          </Badge>
                        ))}
                      </span>
                      <span className="text-muted-foreground w-36 text-xs">
                        {ficha?.contatos.length ?? 0} contato{(ficha?.contatos.length ?? 0) === 1 ? '' : 's'} · {ficha?.contatos.filter((x) => x.app).length ?? 0} no app
                        {e && <span className="block">ERP: {e.erp.provedor}</span>}
                      </span>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => fluxos.fichaCliente(c.id)}>
                        Ficha
                      </Button>
                    </li>
                  )
                })}
                {lista.length === 0 && <li className="text-muted-foreground px-5 py-6 text-sm">Nenhum cliente encontrado.</li>}
              </ul>
            </Caixa>
          </>
        ) : (
          <Caixa className="gap-0 p-0 sm:p-0">
            <ul className="divide-border/70 flex flex-col divide-y">
              {lista.flatMap((c) =>
                (loja.fichaDe(c.id)?.contatos ?? []).map((p) => (
                  <li key={`${c.id}-${p.nome}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm sm:px-5">
                    <span className="min-w-0 flex-1 basis-56">
                      <span className="block truncate">{p.nome}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {c.nome} · {p.papel}
                      </span>
                    </span>
                    <span className="text-muted-foreground w-44 truncate text-xs">{p.whatsapp ?? p.email ?? 'sem canal'}</span>
                    <span className="text-muted-foreground w-28 text-xs">{p.app ? 'usa o app' : 'sem app'}</span>
                    <span className="w-40 text-right text-xs">{p.alcadaPagamento ? `aprova até ${brl(p.alcadaPagamento)}${p.reforcada ? ' · reforçada' : ''}` : <span className="text-muted-foreground">não aprova pagamentos</span>}</span>
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => fluxos.fichaCliente(c.id)}>
                      Editar
                    </Button>
                  </li>
                )),
              )}
            </ul>
          </Caixa>
        )}
      </div>

      <GavetaFormulario
        aberta={gaveta}
        onFechar={() => setGaveta(false)}
        titulo="Novo cliente"
        descricao="O cadastro é um só; os pacotes dizem em que módulos o cliente aparece."
        acao="Cadastrar"
        acaoDesabilitada={!rascunho.nome.trim() || rascunho.pacotes.length === 0}
        onAcao={() => {
          const c: Cliente = {
            id: `cn${Date.now()}`,
            codigo: String(800 + novos.length),
            nome: rascunho.nome.trim(),
            documento: rascunho.documento || 'CNPJ a confirmar',
            regime: rascunho.regime,
            situacao: 'implantacao',
            servicos: rascunho.pacotes,
          }
          setNovos((xs) => [c, ...xs])
          setGaveta(false)
          setRascunho({ nome: '', documento: '', regime: 'Simples Nacional', pacotes: ['bpo'] })
          loja.registrar(usuario.nome, `Cadastrou o cliente ${c.nome} (${c.servicos?.map((p) => rotuloPacote[p]).join(' e ')})`)
          loja.toast(`${c.nome} cadastrado em implantação. A ficha pede contatos e, no BPO, o ERP e as alçadas.`)
        }}
      >
        <Campo rotulo="Razão social">{(id) => <CampoTexto id={id} valor={rascunho.nome} onMudar={(v) => setRascunho((r) => ({ ...r, nome: v }))} />}</Campo>
        <Campo rotulo="CNPJ ou CPF">{(id) => <CampoTexto id={id} mono valor={rascunho.documento} onMudar={(v) => setRascunho((r) => ({ ...r, documento: v }))} />}</Campo>
        <Campo rotulo="Regime">
          {(id) => (
            <CampoEscolha
              id={id}
              valor={rascunho.regime}
              onMudar={(v) => setRascunho((r) => ({ ...r, regime: v }))}
              opcoes={(['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI', 'Pessoa física'] as const).map((x) => ({ valor: x, rotulo: x }))}
            />
          )}
        </Campo>
        <Campo rotulo="Pacotes contratados">
          {() => (
            <Fichas
              rotulo="Pacotes"
              valores={rascunho.pacotes}
              onMudar={(v) => setRascunho((r) => ({ ...r, pacotes: v }))}
              opcoes={(loja.estado.cenario === 'bpo_puro' ? (['bpo'] as Pacote[]) : (['contabil', 'bpo'] as Pacote[])).map((p) => ({ valor: p, rotulo: rotuloPacote[p] }))}
            />
          )}
        </Campo>
      </GavetaFormulario>
    </AreaRolagem>
  )
}
