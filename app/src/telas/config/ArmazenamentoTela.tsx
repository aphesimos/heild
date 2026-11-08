import { ArrowsLeftRightIcon, CheckCircleIcon, CloudIcon, DatabaseIcon, EyeIcon, EyeSlashIcon, FolderIcon, FolderOpenIcon, PlusIcon, SpinnerIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { BarraUso, Caixa, TituloBloco } from '@/components/compostos/blocos'
import { useNavegacao, usePersistente } from '@/ambiente/loja'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { arvoreModelo, conectoresArmazenamento, destinoPorTipo as destinosIniciais, pastasSemCasamento, rotuloTipoArmazenamento, type ConectorArmazenamento } from '@/dados/configuracoes'
import { clientes } from '@/dados/exemplo'
import { cn } from '@/lib/utils'
import { CabecalhoConfig } from './EscritorioTela'

/**
 * Configurações › Armazenamento (Fundações 7): onde ficam os documentos
 * (mais de um conector; um é o padrão para novos), a árvore-modelo com as
 * pastas visíveis ao cliente, o destino de cada tipo de documento, a
 * migração entre backends e a cota.
 */
const opcoesCliente = [{ valor: 'ignorar', rotulo: 'ignorar esta pasta' }, ...clientes.map((c) => ({ valor: c.nome, rotulo: c.nome }))]

export function ArmazenamentoTela() {
  const nav = useNavegacao()
  const [conectores, setConectores] = usePersistente('cfg.arm.conectores', conectoresArmazenamento)
  const [arvore, setArvore] = usePersistente('cfg.arm.arvore', arvoreModelo)
  const [destinos, setDestinos] = usePersistente('cfg.arm.destinos', destinosIniciais)
  const [modal, setModal] = useState<'conectar' | 'migrar' | 'destino' | null>(null)
  const [destinoEd, setDestinoEd] = useState<number | null>(null)
  const plataforma = conectores.find((c) => c.tipo === 'plataforma')
  const [semCliente, setSemCliente] = usePersistente('cfg.arm.semCliente', pastasSemCasamento.map((p) => ({ ...p, escolha: p.sugestao })))

  // Marcar uma pasta: as filhas herdam.
  const alternar = (i: number) =>
    setArvore((xs) => {
      const alvo = xs[i]
      const novo = !alvo.visivel
      return xs.map((p, k) => {
        if (k === i) return { ...p, visivel: novo, herdada: false }
        const filha = k > i && p.nivel > alvo.nivel && xs.slice(i + 1, k).every((q) => q.nivel > alvo.nivel)
        return filha ? { ...p, visivel: novo, herdada: true } : p
      })
    })

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig
          titulo="Armazenamento"
          sub="A nuvem é uma só; o cliente vê o recorte que você marca."
          acao={
            <>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => nav.irPara({ modulo: 'arquivos', aba: 'pastas' })}>
                <FolderOpenIcon /> Ver os arquivos
              </Button>
              <Button size="sm" className="rounded-full" onClick={() => setModal('conectar')}>
                <PlusIcon /> Conectar nuvem
              </Button>
            </>
          }
        />

        <Caixa>
          <TituloBloco
            acao={
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('migrar')}>
                <ArrowsLeftRightIcon /> Migrar
              </Button>
            }
            descricao="Cada documento aponta para o lugar onde está. Os novos vão para o padrão."
          >
            Onde ficam os documentos
          </TituloBloco>
          <ul className="flex flex-col gap-3">
            {conectores.map((c) => (
              <li key={c.id} className="bg-sunken/50 flex flex-col gap-2 rounded-[16px] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {c.tipo === 'plataforma' ? <DatabaseIcon className="text-muted-foreground size-5" /> : <CloudIcon className="text-muted-foreground size-5" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{c.nome}</span>
                    <span className="text-muted-foreground block text-xs">
                      {rotuloTipoArmazenamento[c.tipo]} · raiz {c.raiz} · {c.arquivos.toLocaleString('pt-BR')} arquivos · sincronização: {c.sincronizacao}
                    </span>
                  </span>
                  {c.padrao && <Badge variant="sucesso">padrão para novos</Badge>}
                  {c.situacao === 'somente_leitura' && <Badge variant="outline">somente leitura</Badge>}
                  {c.situacao === 'migrando' && <Badge variant="destaque">migrando</Badge>}
                  {!c.padrao && c.situacao === 'ativo' && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setConectores((xs) => xs.map((x) => ({ ...x, padrao: x.id === c.id })))}>
                      Tornar padrão
                    </Button>
                  )}
                </div>
                {c.cotaGb && <BarraUso rotulo="Cota da plataforma" usado={c.usadoGb!} total={c.cotaGb} unidade=" GB" />}
              </li>
            ))}
          </ul>
          <div className="bg-sunken/50 flex flex-col gap-2.5 rounded-[14px] p-3">
            <span className="text-sm">
              <span className="font-medium">Drive antigo: pastas sem cliente</span>
              <span className="text-muted-foreground block text-xs">Não casaram com nenhum cliente pelo nome ou CNPJ. Até você decidir, ficam fora da busca.</span>
            </span>
            <ul className="grid gap-2.5 md:grid-cols-3">
              {semCliente.map((p, i) => (
                <li key={p.pasta} className="flex min-w-0 flex-col gap-1">
                  <label htmlFor={`sem-cliente-${i}`} className="text-muted-foreground truncate font-mono text-[11px]">
                    {p.pasta}
                  </label>
                  <CampoEscolha id={`sem-cliente-${i}`} valor={p.escolha} onMudar={(v) => setSemCliente((xs) => xs.map((x, k) => (k === i ? { ...x, escolha: v } : x)))} opcoes={opcoesCliente} />
                </li>
              ))}
            </ul>
          </div>
          {plataforma?.usadoGb && plataforma.cotaGb && plataforma.usadoGb / plataforma.cotaGb > 0.8 && (
            <p className="text-muted-foreground text-xs">A 90% você recebe um aviso; a 100% a gravação segue por uma tolerância e depois para. Arquivos repetidos (mesmo conteúdo) contam uma vez.</p>
          )}
        </Caixa>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Caixa>
            <TituloBloco descricao="Vale para clientes novos; dá para ajustar por cliente. Marcar uma pasta vale para tudo dentro dela, por qualquer caminho que o arquivo chegue.">Árvore-modelo e o que o cliente vê</TituloBloco>
            <ul className="flex flex-col">
              {arvore.map((p, i) => (
                <li key={p.caminho} className="flex items-center gap-2 py-1.5 text-sm" style={{ paddingLeft: p.nivel * 20 }}>
                  {p.nivel === 0 ? <FolderOpenIcon className="text-muted-foreground size-4" /> : <FolderIcon className="text-muted-foreground size-4" />}
                  <span className={cn('min-w-0 flex-1 truncate', p.caminho.startsWith('<') && 'font-mono text-xs')}>{p.caminho}</span>
                  {p.nivel > 0 && (
                    <button
                      type="button"
                      onClick={() => alternar(i)}
                      aria-pressed={p.visivel}
                      className={cn('flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px]', p.visivel ? 'bg-success/15' : 'bg-sunken text-muted-foreground')}
                    >
                      {p.visivel ? <EyeIcon className="size-3.5" /> : <EyeSlashIcon className="size-3.5" />}
                      {p.visivel ? (p.herdada ? 'visível (herda)' : 'visível') : 'privada'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">
              Quem vê dentro da empresa segue o papel: a pasta de folha aparece para o RH e o sócio, não para o financeiro. Um arquivo pode ser forçado (ocultar ou mostrar) com registro de quem forçou.
            </p>
          </Caixa>
          <Caixa>
            <TituloBloco descricao="Gerar uma guia ou um holerite já grava na pasta certa; é assim que “entregar” vira só gravar.">Para onde vai cada tipo</TituloBloco>
            <ul className="divide-border/70 flex flex-col divide-y">
              {destinos.map((d, i) => (
                <li key={d.tipo}>
                  <button
                    type="button"
                    onClick={() => {
                      setDestinoEd(i)
                      setModal('destino')
                    }}
                    className="hover:bg-sunken/60 -mx-2 flex w-[calc(100%+1rem)] cursor-pointer flex-col rounded-[10px] px-2 py-2 text-left text-sm"
                  >
                    <span>{d.tipo}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {d.setor} → {d.pasta}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Caixa>
        </div>
      </div>

      {modal === 'conectar' && (
        <ConectarNuvem
          onFechar={() => setModal(null)}
          onConectar={(c) => {
            setConectores((xs) => [...xs, c])
            setModal(null)
          }}
        />
      )}
      {modal === 'migrar' && (
        <Migrar
          conectores={conectores}
          onFechar={() => setModal(null)}
          onMigrar={(origem) => {
            setConectores((xs) => xs.map((x) => (x.id === origem ? { ...x, situacao: 'migrando' } : x)))
            setModal(null)
          }}
        />
      )}
      {modal === 'destino' && destinoEd != null && (
        <EditarDestino
          d={destinos[destinoEd]}
          pastas={arvore.filter((p) => p.nivel > 0).map((p) => p.caminho)}
          onFechar={() => setModal(null)}
          onSalvar={(n) => {
            setDestinos((xs) => xs.map((x, k) => (k === destinoEd ? n : x)))
            setModal(null)
          }}
        />
      )}
    </AreaRolagem>
  )
}

const passos = ['Tipo', 'Autorizar', 'Raiz', 'Mapear pastas', 'Pronto'] as const

/** Conectar uma nuvem (Fundações 7.1 e 7.3): autoriza, escolhe a raiz e casa as pastas com os clientes. */
function ConectarNuvem({ onFechar, onConectar }: { onFechar: () => void; onConectar: (c: ConectorArmazenamento) => void }) {
  const [passo, setPasso] = useState(0)
  const [tipo, setTipo] = useState<ConectorArmazenamento['tipo']>('onedrive_sharepoint')
  const [autorizado, setAutorizado] = useState(false)
  const [autorizando, setAutorizando] = useState(false)
  const [raiz, setRaiz] = useState('Documentos compartilhados/Clientes')
  const [mapas, setMapas] = useState(pastasSemCasamento.map((p) => ({ ...p, escolha: p.sugestao })))
  const [padrao, setPadrao] = useState(false)
  const credencial = tipo === 's3_compativel' || tipo === 'webdav' || tipo === 'sftp'
  const ok = [true, autorizado, raiz.trim().length > 1, true, true][passo]
  const ultimo = passo === passos.length - 1
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Conectar nuvem"
      descricao="A plataforma nunca renomeia pastas existentes nem apaga nada na sua nuvem."
      acao={ultimo ? 'Concluir' : 'Continuar'}
      acaoDesabilitada={!ok}
      onAcao={() =>
        ultimo
          ? onConectar({
              id: `a${Date.now()}`,
              nome: rotuloTipoArmazenamento[tipo],
              tipo,
              raiz,
              padrao,
              situacao: 'ativo',
              sincronizacao: credencial ? 'varredura a cada 15 min' : 'notificação da nuvem',
              arquivos: 0,
            })
          : setPasso((p) => p + 1)
      }
      secundaria={
        passo > 0 && !ultimo ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      <ol className="flex gap-1.5" aria-label="Passos">
        {passos.map((p, i) => (
          <li key={p} className="flex min-w-0 flex-1 flex-col gap-1">
            <span className={cn('h-1.5 rounded-full', i < passo ? 'bg-success' : i === passo ? 'bg-foreground' : 'bg-sunken')} />
            <span className={cn('truncate text-[11px]', i === passo ? 'font-medium' : 'text-muted-foreground')}>{p}</span>
          </li>
        ))}
      </ol>
      {passo === 0 && (
        <Campo rotulo="Onde estão os arquivos">
          {(id) => (
            <CampoEscolha
              id={id}
              valor={tipo}
              onMudar={setTipo}
              opcoes={(Object.keys(rotuloTipoArmazenamento) as ConectorArmazenamento['tipo'][]).filter((t) => t !== 'plataforma').map((t) => ({ valor: t, rotulo: rotuloTipoArmazenamento[t] }))}
            />
          )}
        </Campo>
      )}
      {passo === 1 &&
        (autorizado ? (
          <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm">
            <CheckCircleIcon weight="fill" className="text-success size-5" /> Acesso autorizado. A credencial fica no cofre.
          </p>
        ) : credencial ? (
          <>
            <Campo rotulo="Endereço">{(id) => <CampoTexto id={id} valor="" onMudar={() => {}} placeholder={tipo === 'sftp' ? 'sftp.escritorio.com.br' : 'https://…'} />}</Campo>
            <Button type="button" variant="outline" className="w-fit rounded-full" onClick={() => setAutorizado(true)}>
              Testar acesso
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3 text-sm">
            <p>Abre a janela da {tipo === 'google_drive' ? 'Google' : 'Microsoft'} para você entrar com a conta do escritório e permitir acesso só à pasta escolhida.</p>
            <Button
              type="button"
              className="w-fit rounded-full"
              disabled={autorizando}
              onClick={() => {
                setAutorizando(true)
                setTimeout(() => {
                  setAutorizando(false)
                  setAutorizado(true)
                }, 1200)
              }}
            >
              {autorizando ? <SpinnerIcon className="animate-spin" /> : <CloudIcon />} {autorizando ? 'Aguardando…' : 'Autorizar acesso'}
            </Button>
          </div>
        ))}
      {passo === 2 && (
        <Campo rotulo="Pasta raiz dos clientes" ajuda="Tudo abaixo dela é lido; nada acima.">
          {(id) => <CampoTexto id={id} mono valor={raiz} onMudar={setRaiz} />}
        </Campo>
      )}
      {passo === 3 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="bg-success/10 rounded-[14px] px-3 py-2.5">
            <strong className="font-medium">412 pastas casaram sozinhas</strong> pelo CNPJ no nome, pelo ano (4 dígitos) e pela competência (AAAA-MM, MM-AAAA ou nome do mês).
          </p>
          <span className="font-medium">Não casaram ({mapas.length}):</span>
          {mapas.map((m, i) => (
            <div key={m.pasta} className="grid gap-1.5 sm:grid-cols-[1fr_14rem] sm:items-center">
              <code className="text-muted-foreground truncate text-xs">{m.pasta}</code>
              <CampoEscolha
                valor={m.escolha}
                onMudar={(v) => setMapas((xs) => xs.map((x, k) => (k === i ? { ...x, escolha: v } : x)))}
                opcoes={[{ valor: 'ignorar', rotulo: 'ignorar esta pasta' }, ...clientes.map((c) => ({ valor: c.nome, rotulo: c.nome }))]}
              />
            </div>
          ))}
          <p className="text-muted-foreground text-xs">Pastas novas que seguirem a regra entram sozinhas. A indexação calcula o hash de cada arquivo; leva alguns minutos.</p>
        </div>
      )}
      {passo === 4 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <CheckCircleIcon weight="fill" className="text-success size-5" /> {rotuloTipoArmazenamento[tipo]} conectado
          </p>
          <Interruptor ligado={padrao} onMudar={setPadrao} rotulo="Usar como padrão para documentos novos" detalhe="Desligado, a nuvem fica para consulta e os novos continuam no padrão atual." />
        </div>
      )}
    </GavetaFormulario>
  )
}

/** Migrar entre backends (Fundações 7.5): copia, confere o hash, marca a origem como somente leitura. */
function Migrar({ conectores, onFechar, onMigrar }: { conectores: ConectorArmazenamento[]; onFechar: () => void; onMigrar: (origem: string) => void }) {
  const [origem, setOrigem] = useState(conectores.find((c) => !c.padrao)?.id ?? conectores[0].id)
  const [destino, setDestino] = useState(conectores.find((c) => c.padrao)?.id ?? conectores[0].id)
  const [filtro, setFiltro] = useState<'tudo' | 'ativos' | 'ano'>('ativos')
  const n = { tudo: 96210, ativos: 41380, ano: 12904 }[filtro]
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Migrar documentos"
      descricao="Copia os arquivos, confere o hash no destino e só então muda o apontamento. Nada é apagado na origem; os documentos ficam disponíveis durante a migração."
      acao={`Migrar ${n.toLocaleString('pt-BR')} arquivos`}
      acaoDesabilitada={origem === destino}
      onAcao={() => onMigrar(origem)}
    >
      <Campo rotulo="De">{(id) => <CampoEscolha id={id} valor={origem} onMudar={setOrigem} opcoes={conectores.map((c) => ({ valor: c.id, rotulo: c.nome }))} />}</Campo>
      <Campo rotulo="Para" erro={origem === destino ? 'Escolha outro destino.' : undefined}>
        {(id) => <CampoEscolha id={id} valor={destino} onMudar={setDestino} opcoes={conectores.map((c) => ({ valor: c.id, rotulo: c.nome }))} />}
      </Campo>
      <Campo rotulo="Quais">
        {() => (
          <Segmentado
            rotulo="Filtro"
            valor={filtro}
            onMudar={setFiltro}
            opcoes={[
              { valor: 'ativos', rotulo: 'Clientes ativos' },
              { valor: 'ano', rotulo: 'Só 2026' },
              { valor: 'tudo', rotulo: 'Tudo' },
            ]}
          />
        )}
      </Campo>
      <p className="text-muted-foreground text-xs">Se o hash não bater em algum arquivo, a migração para naquele ponto e avisa. Ao terminar, a origem vira somente leitura.</p>
    </GavetaFormulario>
  )
}

function EditarDestino({ d, pastas, onFechar, onSalvar }: { d: (typeof destinosIniciais)[number]; pastas: string[]; onFechar: () => void; onSalvar: (d: (typeof destinosIniciais)[number]) => void }) {
  const [pasta, setPasta] = useState(d.pasta)
  const opcoes = [...new Set([d.pasta, 'Entregáveis/Fiscal', 'Entregáveis/Folha', 'Entregáveis/Contábil', '<ano>/<competência>/trabalho interno', ...pastas])]
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={d.tipo} descricao={`Gerado pelo setor ${d.setor}.`} acao="Salvar" onAcao={() => onSalvar({ ...d, pasta })}>
      <Campo rotulo="Gravar em" ajuda="Se a pasta for visível, o documento aparece no app do cliente na hora.">
        {(id) => <CampoEscolha id={id} valor={pasta} onMudar={setPasta} opcoes={opcoes.map((p) => ({ valor: p, rotulo: p }))} />}
      </Campo>
    </GavetaFormulario>
  )
}
