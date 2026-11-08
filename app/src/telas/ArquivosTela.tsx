import { CaretDownIcon, CaretRightIcon, CloudIcon, EyeIcon, FileTextIcon, FolderIcon, FolderOpenIcon, FolderPlusIcon, GearSixIcon, LockSimpleIcon, MagnifyingGlassIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useDocumentos } from '@/ambiente/documentos'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Caixa } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario } from '@/components/ui/formulario'
import { conectorDe, pastaDoCliente, pastaPeloTipo, rotuloOrigem, rotuloTipoDoc, visivelAoCliente, type Documento, type TipoDocumento } from '@/dados/arquivos'
import { arvoreModelo, conectoresArmazenamento, rotuloTipoArmazenamento } from '@/dados/configuracoes'
import * as exemplo from '@/dados/exemplo'
import { cn } from '@/lib/utils'

/** Pastas fixas da árvore-modelo (aparecem mesmo vazias). */
const pastasModelo: string[][] = [
  ['permanentes'],
  ['permanentes', 'contrato social e alterações'],
  ['permanentes', 'procurações e certidões'],
  ['2026'],
  ['2026', '2026-10'],
  ['2026', '2026-10', 'trabalho interno'],
  ['Entregáveis'],
  ['Entregáveis', 'Fiscal (guias, recibos)'],
  ['Entregáveis', 'Folha (holerites, guias)'],
  ['Entregáveis', 'Contábil (balancete, DRE)'],
]
const visiveis = arvoreModelo.filter((p) => p.visivel).map((p) => p.caminho)
const pastaVisivel = (caminho: string[]) => caminho.some((p) => visiveis.includes(p))
const igual = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i])
const comeca = (a: string[], prefixo: string[]) => prefixo.every((x, i) => a[i] === x)
const dataDe = (q: string) => {
  const m = q.match(/(\d{2})\/(\d{2})(?:\/(\d{4}))?/)
  return m ? Number(`${m[3] ?? '2026'}${m[2]}${m[1]}`) : q === 'hoje' ? 99999999 : 0
}

/**
 * Arquivos (Fundações 7): o "servidor" do escritório. Uma árvore só, a mesma
 * do Armazenamento (cliente/ano/competência/tipo, permanentes, Entregáveis),
 * espelhando os conectores ligados (plataforma, Drive antigo em leitura,
 * servidor próprio). Abrir um arquivo usa o visualizador com a marca do
 * escritório, o mesmo de qualquer menção no sistema.
 */
export function ArquivosTela({ aba, inicial, onConfigurar }: { aba: 'pastas' | 'recentes'; inicial?: { clienteId?: string; caminho: string[] }; onConfigurar?: () => void }) {
  const loja = useLoja()
  const docs = useDocumentos()
  const { usuario } = useSessao()
  const admin = usuario.papel === 'administrador'
  const [raiz, setRaiz] = useState<string | undefined>(inicial ? (inicial.clienteId ?? '_escritorio') : 'c1')
  const [caminho, setCaminho] = useState<string[]>(inicial?.caminho ?? [])
  const [abertos, setAbertos] = useState<string[]>([inicial?.clienteId ?? 'c1'])
  const [busca, setBusca] = useState('')
  const [extras, setExtras] = usePersistente<Record<string, string[][]>>('arq.extras', {})
  const [modal, setModal] = useState<'enviar' | 'pasta' | null>(null)

  const clienteId = raiz === '_escritorio' ? undefined : raiz
  const raizes = [...(admin ? [{ id: '_escritorio', nome: '_escritorio', sub: 'contratos, NFS-e emitidas' }] : []), ...exemplo.clientes.map((c) => ({ id: c.id, nome: `${c.codigo} · ${c.nome}`, sub: c.documento }))]
  const doRaiz = loja.documentos.filter((d) => (d.clienteId ?? '_escritorio') === (raiz ?? ''))

  // Pastas desta raiz: as do modelo (clientes), as dos arquivos e as criadas aqui.
  const pastas = useMemo(() => {
    const todas = new Map<string, string[]>()
    const add = (p: string[]) => p.forEach((_, i) => todas.set(p.slice(0, i + 1).join('/'), p.slice(0, i + 1)))
    if (raiz !== '_escritorio') pastasModelo.forEach(add)
    doRaiz.forEach((d) => add(d.pasta))
    ;(extras[raiz ?? ''] ?? []).forEach(add)
    return [...todas.values()]
  }, [raiz, doRaiz, extras])
  const filhas = (base: string[]) => pastas.filter((p) => p.length === base.length + 1 && comeca(p, base)).sort((a, b) => a[a.length - 1].localeCompare(b[b.length - 1], 'pt-BR'))
  const arquivosAqui = doRaiz.filter((d) => igual(d.pasta, caminho))
  const contagem = (p: string[]) => doRaiz.filter((d) => comeca(d.pasta, p)).length

  const resultados = busca.trim() ? loja.documentos.filter((d) => `${d.nome} ${pastaDoCliente(d.clienteId)} ${d.pasta.join(' ')}`.toLowerCase().includes(busca.trim().toLowerCase())).slice(0, 60) : null
  const recentes = [...loja.documentos].sort((a, b) => dataDe(b.quando) - dataDe(a.quando)).slice(0, 40)

  const irPara = (r: string | undefined, c: string[]) => {
    setRaiz(r)
    setCaminho(c)
    setBusca('')
    if (r) setAbertos((xs) => (xs.includes(r) ? xs : [...xs, r]))
  }

  const lista = aba === 'recentes' ? recentes : resultados
  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <header className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1 basis-72">
            <h1 className="text-2xl font-light tracking-tight sm:text-3xl">{aba === 'recentes' ? 'Recentes' : 'Arquivos'}</h1>
            <p className="text-muted-foreground text-sm">
              {conectoresArmazenamento.map((c) => `${c.nome} (${rotuloTipoArmazenamento[c.tipo]}${c.situacao === 'somente_leitura' ? ', só leitura' : ''})`).join(' · ')} · uma árvore só, por cliente
            </p>
          </div>
          <label className="bg-raised shadow-contorno flex h-9 w-full items-center gap-2 rounded-full px-3 sm:w-64">
            <MagnifyingGlassIcon className="text-muted-foreground size-4" />
            <input aria-label="Buscar arquivo" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar em todas as pastas" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          {aba === 'pastas' && (
            <>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => setModal('pasta')}>
                <FolderPlusIcon /> Nova pasta
              </Button>
              <Button size="sm" className="rounded-full" onClick={() => setModal('enviar')}>
                <UploadSimpleIcon /> Enviar arquivo
              </Button>
            </>
          )}
          {admin && onConfigurar && (
            <Button size="sm" variant="ghost" className="rounded-full" onClick={onConfigurar}>
              <GearSixIcon /> Armazenamento
            </Button>
          )}
        </header>

        {lista ? (
          <Caixa>
            <p className="text-muted-foreground text-xs">{aba === 'recentes' && !busca ? 'O que chegou por último, de qualquer origem (app, conversas, integrantes, equipe, nuvem)' : `${lista.length} resultado(s) para “${busca}”`}</p>
            <ListaArquivos itens={aba === 'recentes' && busca ? (resultados ?? []) : lista} comCaminho onAbrir={docs.abrirDoc} onPasta={(d) => irPara(d.clienteId ?? '_escritorio', d.pasta)} />
          </Caixa>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <Caixa className="max-h-[70vh] overflow-y-auto">
              <ul className="flex flex-col text-sm">
                {raizes.map((r) => {
                  const aberto = abertos.includes(r.id)
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setAbertos((xs) => (aberto && raiz === r.id ? xs.filter((x) => x !== r.id) : xs.includes(r.id) ? xs : [...xs, r.id]))
                          irPara(r.id, [])
                        }}
                        className={cn('hover:bg-sunken/60 flex w-full cursor-pointer items-center gap-1.5 rounded-[10px] px-1.5 py-1.5 text-left', raiz === r.id && caminho.length === 0 && 'bg-sunken font-medium')}
                      >
                        {aberto ? <CaretDownIcon className="size-3.5 shrink-0" /> : <CaretRightIcon className="size-3.5 shrink-0" />}
                        {aberto ? <FolderOpenIcon className="text-muted-foreground size-4 shrink-0" weight="duotone" /> : <FolderIcon className="text-muted-foreground size-4 shrink-0" weight="duotone" />}
                        <span className="min-w-0 flex-1 truncate">{r.nome}</span>
                      </button>
                      {aberto && raiz === r.id && <Ramo base={[]} filhas={filhas} caminho={caminho} onIr={(c) => irPara(r.id, c)} />}
                    </li>
                  )
                })}
              </ul>
            </Caixa>

            <Caixa className="min-h-[24rem]">
              <nav aria-label="Pasta atual" className="flex flex-wrap items-center gap-1 text-sm">
                {[pastaDoCliente(clienteId), ...caminho].map((p, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <CaretRightIcon className="text-muted-foreground size-3" />}
                    <button type="button" onClick={() => setCaminho(caminho.slice(0, i))} className={cn('cursor-pointer rounded-[8px] px-1.5 py-0.5', i === caminho.length ? 'font-medium' : 'text-muted-foreground hover:text-foreground')}>
                      {p}
                    </button>
                  </span>
                ))}
                {clienteId && caminho.length > 0 && (
                  <span className={cn('ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]', pastaVisivel(caminho) ? 'bg-success/15' : 'bg-sunken text-muted-foreground')}>
                    {pastaVisivel(caminho) ? <EyeIcon className="size-3.5" /> : <LockSimpleIcon className="size-3.5" />}
                    {pastaVisivel(caminho) ? 'visível no app do cliente' : 'privada do escritório'}
                  </span>
                )}
              </nav>
              <ul className="divide-border/70 flex flex-col divide-y">
                {filhas(caminho).map((p) => (
                  <li key={p.join('/')}>
                    <button type="button" onClick={() => setCaminho(p)} className="hover:bg-sunken/50 -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-[10px] px-2 py-2 text-left text-sm">
                      <FolderIcon className="text-muted-foreground size-5 shrink-0" weight="duotone" />
                      <span className="min-w-0 flex-1 truncate">{p[p.length - 1]}</span>
                      {clienteId && pastaVisivel(p) && <EyeIcon className="text-success size-4 shrink-0" aria-label="visível ao cliente" />}
                      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{contagem(p)} arquivo(s)</span>
                    </button>
                  </li>
                ))}
              </ul>
              <ListaArquivos itens={arquivosAqui} onAbrir={docs.abrirDoc} />
              {filhas(caminho).length === 0 && arquivosAqui.length === 0 && <p className="text-muted-foreground py-6 text-center text-sm">Pasta vazia. Arquivos que caírem aqui, por qualquer caminho, aparecem na hora.</p>}
            </Caixa>
          </div>
        )}
      </div>

      {modal === 'enviar' && (
        <EnviarArquivo
          destino={`${pastaDoCliente(clienteId)}/${caminho.join('/')}`}
          onFechar={() => setModal(null)}
          onEnviar={(nome, tipo) => {
            const pasta = caminho.length ? caminho : pastaPeloTipo(tipo)
            const d = loja.adicionarDocumento({ nome, clienteId, pasta, tipo, origem: 'upload_equipe', conector: 'a1', tamanho: '220 KB', quando: 'hoje', por: usuario.nome })
            setCaminho(pasta)
            loja.registrar(usuario.nome, `Enviou ${nome} para ${pastaDoCliente(clienteId)}/${pasta.join('/')}`)
            loja.toast(`${nome} guardado${pastaVisivel(pasta) && clienteId ? ' e já visível no app do cliente' : ''}.`)
            setModal(null)
            docs.abrirDoc(d)
          }}
        />
      )}
      {modal === 'pasta' && (
        <NovaPasta
          onFechar={() => setModal(null)}
          onCriar={(nome) => {
            setExtras((x) => ({ ...x, [raiz ?? '']: [...(x[raiz ?? ''] ?? []), [...caminho, nome]] }))
            loja.registrar(usuario.nome, `Criou a pasta ${[pastaDoCliente(clienteId), ...caminho, nome].join('/')}`)
            setModal(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

function Ramo({ base, filhas, caminho, onIr }: { base: string[]; filhas: (b: string[]) => string[][]; caminho: string[]; onIr: (c: string[]) => void }) {
  return (
    <ul className="flex flex-col">
      {filhas(base).map((p) => {
        const ativo = igual(p, caminho)
        const dentro = comeca(caminho, p)
        return (
          <li key={p.join('/')}>
            <button
              type="button"
              onClick={() => onIr(p)}
              className={cn('hover:bg-sunken/60 flex w-full cursor-pointer items-center gap-1.5 rounded-[10px] py-1 pr-1.5 text-left', ativo && 'bg-sunken font-medium')}
              style={{ paddingLeft: 10 + p.length * 14 }}
            >
              {dentro ? <FolderOpenIcon className="text-muted-foreground size-4 shrink-0" weight="duotone" /> : <FolderIcon className="text-muted-foreground size-4 shrink-0" weight="duotone" />}
              <span className="min-w-0 flex-1 truncate">{p[p.length - 1]}</span>
              {pastaVisivel(p) && p.length <= 2 && <EyeIcon className="text-success size-3.5 shrink-0" aria-label="visível ao cliente" />}
            </button>
            {dentro && <Ramo base={p} filhas={filhas} caminho={caminho} onIr={onIr} />}
          </li>
        )
      })}
    </ul>
  )
}

function ListaArquivos({ itens, comCaminho, onAbrir, onPasta }: { itens: Documento[]; comCaminho?: boolean; onAbrir: (d: Documento) => void; onPasta?: (d: Documento) => void }) {
  if (!itens.length) return null
  return (
    <ul className="divide-border/70 flex flex-col divide-y">
      {itens.map((d) => {
        const con = conectorDe(d.conector)
        return (
          <li key={d.id} className="hover:bg-sunken/50 -mx-2 flex items-center gap-3 rounded-[10px] px-2 py-2 text-sm">
            <FileTextIcon className="text-muted-foreground size-5 shrink-0" weight="duotone" />
            <button type="button" onClick={() => onAbrir(d)} className="min-w-0 flex-1 cursor-pointer text-left">
              <span className="block truncate">{d.nome}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {rotuloTipoDoc[d.tipo]}
                {d.competencia ? ` · ${d.competencia}` : ''} · {rotuloOrigem[d.origem]} · {d.por} · {d.quando}
              </span>
            </button>
            {comCaminho && onPasta && (
              <button type="button" onClick={() => onPasta(d)} className="text-muted-foreground hover:text-foreground hidden max-w-[16rem] shrink-0 cursor-pointer truncate text-xs underline-offset-2 hover:underline md:block">
                {[pastaDoCliente(d.clienteId).split(' - ').pop(), ...d.pasta].join(' / ')}
              </button>
            )}
            {con?.situacao === 'somente_leitura' && (
              <span className="bg-sunken text-muted-foreground flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px]">
                <CloudIcon className="size-3.5" /> {con.nome}
              </span>
            )}
            {d.clienteId && visivelAoCliente(d) && <EyeIcon className="text-success size-4 shrink-0" aria-label="visível ao cliente" />}
            <span className="text-muted-foreground hidden w-16 shrink-0 text-right text-xs tabular-nums sm:block">{d.tamanho}</span>
          </li>
        )
      })}
    </ul>
  )
}

const tiposEnvio: TipoDocumento[] = ['guia', 'holerite', 'folha', 'balancete', 'contrato', 'procuracao', 'certidao', 'extrato', 'recibo', 'relatorio', 'outro']

function EnviarArquivo({ destino, onFechar, onEnviar }: { destino: string; onFechar: () => void; onEnviar: (nome: string, tipo: TipoDocumento) => void }) {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<TipoDocumento>('outro')
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Enviar arquivo"
      descricao={`Para ${destino || 'a pasta do tipo'}. Na raiz do cliente, vai para a pasta do tipo (Configurações › Armazenamento).`}
      acao="Enviar"
      acaoDesabilitada={!nome.trim()}
      onAcao={() => onEnviar(/\.\w{2,4}$/.test(nome.trim()) ? nome.trim() : `${nome.trim()}.pdf`, tipo)}
    >
      <Campo rotulo="Arquivo" ajuda="Na demonstração, digite o nome; em produção, escolha ou arraste o arquivo.">
        {(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} placeholder="Ex.: Alteração contratual 2026.pdf" />}
      </Campo>
      <Campo rotulo="Tipo">{(id) => <CampoEscolha id={id} valor={tipo} onMudar={setTipo} opcoes={tiposEnvio.map((t) => ({ valor: t, rotulo: rotuloTipoDoc[t] }))} />}</Campo>
    </GavetaFormulario>
  )
}

function NovaPasta({ onFechar, onCriar }: { onFechar: () => void; onCriar: (nome: string) => void }) {
  const [nome, setNome] = useState('')
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Nova pasta"
      descricao="A plataforma nunca renomeia pastas existentes; pastas novas que seguem a regra (ano, competência, tipo) entram sozinhas."
      acao="Criar"
      acaoDesabilitada={!nome.trim()}
      onAcao={() => onCriar(nome.trim())}
    >
      <Campo rotulo="Nome">{(id) => <CampoTexto id={id} valor={nome} onMudar={setNome} placeholder="Ex.: Licitação 2027" />}</Campo>
    </GavetaFormulario>
  )
}
