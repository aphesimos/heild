import { ArrowCounterClockwiseIcon, PaperPlaneTiltIcon, PlusIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CabecalhoSecao, Campo, CampoArea, CampoTexto, Fichas, GavetaFormulario, Segmentado } from '@/components/ui/formulario'
import { canaisSetor, modelosMensagem, rotuloSetor, variaveisModelo, type ModeloMensagem, type StatusModelo } from '@/dados/crm'
import { cn } from '@/lib/utils'

const corStatus: Record<StatusModelo, 'sucesso' | 'destaque' | 'erro' | 'secondary' | 'outline'> = { aprovado: 'sucesso', 'em aprovação': 'destaque', rejeitado: 'erro', rascunho: 'secondary', pausado: 'outline' }

const vazio = (): ModeloMensagem => ({ id: '', nome: '', categoria: 'utilidade', idioma: 'pt_BR', texto: '', botoes: [], setores: ['gestao_atendimento'], status: 'rascunho', versao: 1 })

/** Nome no formato que a Meta aceita: minúsculas, números e sublinhado. */
const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')

/**
 * Biblioteca de modelos (04, 3.3): o escritório escreve, a plataforma submete
 * à Meta e acompanha. Fora da janela de 24 h só sai modelo aprovado. Rejeitado
 * mostra o motivo e volta para correção; editar um aprovado cria nova versão.
 */
export function Modelos() {
  const [modelos, setModelos] = usePersistente('crm.cfg.modelos', modelosMensagem)
  const [editando, setEditando] = useState<ModeloMensagem | null>(null)

  const salvar = (m: ModeloMensagem, enviar: boolean) => {
    const novo = { ...m, id: m.id || `mm${Date.now()}`, status: (enviar ? 'em aprovação' : 'rascunho') as StatusModelo, motivo: undefined }
    setModelos((xs) => (xs.some((x) => x.id === novo.id) ? xs.map((x) => (x.id === novo.id ? novo : x)) : [novo, ...xs]))
    setEditando(null)
    // No lab, a Meta "aprova" em alguns segundos; em produção chega por webhook (modelo.status).
    if (enviar) setTimeout(() => setModelos((xs) => xs.map((x) => (x.id === novo.id && x.status === 'em aprovação' && !/reforma/.test(x.nome) ? { ...x, status: 'aprovado' } : x))), 4000)
  }

  return (
    <div className="flex flex-col gap-3">
      <CabecalhoSecao
        titulo="Modelos (templates)"
        descricao="Mensagens pré-aprovadas pela Meta. São as únicas que saem fora da janela de 24 h e nos comunicados."
        acao={
          <Button size="sm" className="rounded-full" onClick={() => setEditando(vazio())}>
            <PlusIcon /> Novo modelo
          </Button>
        }
      />
      <ul className="divide-border/70 flex flex-col divide-y">
        {modelos.map((m) => (
          <li key={m.id}>
            <button type="button" onClick={() => setEditando(m)} className="hover:bg-sunken/60 flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 rounded-[12px] px-2 py-2.5 text-left">
              <code className="text-sm">{m.nome}</code>
              <span className="text-muted-foreground text-xs">
                {m.categoria} · v{m.versao}
                {m.evento && ` · ${m.evento}`}
              </span>
              <Badge variant={corStatus[m.status]} className="ml-auto">
                {m.status}
              </Badge>
              {m.motivo && (
                <span className="text-destructive flex w-full items-center gap-1 text-xs">
                  <WarningIcon className="size-3.5" /> {m.motivo}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {editando && (
        <EditorModelo
          key={editando.id || 'novo'}
          inicial={editando}
          existentes={modelos}
          onFechar={() => setEditando(null)}
          onSalvar={salvar}
          onExcluir={(id) => {
            setModelos((xs) => xs.filter((x) => x.id !== id))
            setEditando(null)
          }}
        />
      )}
    </div>
  )
}

function EditorModelo({
  inicial,
  existentes,
  onFechar,
  onSalvar,
  onExcluir,
}: {
  inicial: ModeloMensagem
  existentes: ModeloMensagem[]
  onFechar: () => void
  onSalvar: (m: ModeloMensagem, enviar: boolean) => void
  onExcluir: (id: string) => void
}) {
  const [m, setM] = useState(inicial)
  const novo = !inicial.id
  const aprovado = inicial.status === 'aprovado'
  const set = <K extends keyof ModeloMensagem>(k: K, v: ModeloMensagem[K]) => setM((x) => ({ ...x, [k]: v }))
  const usadas = [...m.texto.matchAll(/\{(\w+)\}/g)].map((x) => x[1])
  const desconhecidas = usadas.filter((u) => !variaveisModelo.some((v) => v.nome === u))
  const nomeRepetido = existentes.some((x) => x.nome === m.nome && x.id !== m.id)
  const erroBotoes = m.botoes.filter(Boolean).length > 3 ? 'A Meta aceita até 3 botões de resposta rápida.' : undefined
  const invalido = !m.nome || !m.texto.trim() || !!desconhecidas.length || nomeRepetido || !!erroBotoes || !m.setores.length
  const previa = m.texto.replace(/\{(\w+)\}/g, (_, n) => variaveisModelo.find((v) => v.nome === n)?.exemplo ?? `{${n}}`)
  const comNumero = canaisSetor.filter((c) => c.numero)

  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={novo ? 'Novo modelo' : m.nome}
      descricao={aprovado ? 'Editar um modelo aprovado cria uma nova versão, que volta para a aprovação da Meta. A versão atual continua valendo até lá.' : 'Rascunho fica só aqui; enviar submete à Meta, que aprova em minutos ou horas.'}
      acao="Enviar à Meta"
      onAcao={() => onSalvar({ ...m, versao: aprovado ? m.versao + 1 : m.versao }, true)}
      acaoDesabilitada={invalido}
      secundaria={
        <>
          {!novo && !aprovado && (
            <Button type="button" size="icon" variant="ghost" className="rounded-full" aria-label="Excluir modelo" onClick={() => onExcluir(m.id)}>
              <TrashIcon />
            </Button>
          )}
          <Button type="button" variant="outline" className="rounded-full" disabled={invalido} onClick={() => onSalvar(m, false)}>
            Salvar rascunho
          </Button>
        </>
      }
    >
      {inicial.status === 'rejeitado' && inicial.motivo && (
        <div className="bg-destructive/8 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
          <WarningIcon className="text-destructive mt-0.5 size-4 shrink-0" />
          <span>
            <strong className="font-medium">Rejeitado pela Meta:</strong> {inicial.motivo}
          </span>
        </div>
      )}
      <Campo rotulo="Nome" ajuda="Minúsculas e sublinhado; é como a Meta identifica o modelo." erro={nomeRepetido ? 'Já existe um modelo com esse nome.' : undefined}>
        {(id) => <CampoTexto id={id} mono valor={m.nome} onMudar={(v) => set('nome', normalizar(v))} placeholder="ex.: lembrete_extrato" />}
      </Campo>
      <Campo rotulo="Categoria" ajuda={m.categoria === 'marketing' ? 'Marketing só vai para quem deu opt-in e custa mais por conversa.' : 'Utilidade: aviso ligado a um serviço já contratado (guia, prazo, documento).'}>
        {() => (
          <Segmentado
            rotulo="Categoria"
            valor={m.categoria}
            onMudar={(v) => set('categoria', v)}
            opcoes={[
              { valor: 'utilidade', rotulo: 'Utilidade' },
              { valor: 'marketing', rotulo: 'Marketing' },
            ]}
          />
        )}
      </Campo>
      <Campo rotulo="Texto" erro={desconhecidas.length ? `Variável desconhecida: ${desconhecidas.map((d) => `{${d}}`).join(', ')}` : undefined} ajuda="Toque numa variável para inserir. O sistema preenche no envio.">
        {(id) => (
          <div className="flex flex-col gap-2">
            <CampoArea id={id} valor={m.texto} onMudar={(v) => set('texto', v)} placeholder="Olá, {nome}! …" />
            <div className="flex flex-wrap gap-1">
              {variaveisModelo.map((v) => (
                <button
                  key={v.nome}
                  type="button"
                  title={v.descricao}
                  onClick={() => set('texto', `${m.texto}{${v.nome}}`)}
                  className={cn('bg-sunken hover:bg-accent cursor-pointer rounded-full px-2 py-0.5 font-mono text-[11px]', usadas.includes(v.nome) && 'ring-foreground/30 ring-1')}
                >
                  {`{${v.nome}}`}
                </button>
              ))}
            </div>
          </div>
        )}
      </Campo>
      <Campo rotulo="Botões de resposta (opcional)" erro={erroBotoes} ajuda="Até 3. O toque do cliente vira mensagem na conversa (ex.: “Recebi”).">
        {() => (
          <div className="flex flex-col gap-1.5">
            {m.botoes.map((b, i) => (
              <div key={i} className="flex gap-1.5">
                <CampoTexto
                  valor={b}
                  onMudar={(v) =>
                    set(
                      'botoes',
                      m.botoes.map((x, k) => (k === i ? v.slice(0, 25) : x)),
                    )
                  }
                  placeholder={`Botão ${i + 1}`}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 rounded-full"
                  aria-label={`Tirar botão ${i + 1}`}
                  onClick={() =>
                    set(
                      'botoes',
                      m.botoes.filter((_, k) => k !== i),
                    )
                  }
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" variant="ghost" className="w-fit rounded-full" onClick={() => set('botoes', [...m.botoes, ''])}>
              <PlusIcon /> Botão
            </Button>
          </div>
        )}
      </Campo>
      <Campo rotulo="Vale nos números de" ajuda="Setores sem número próprio usam o principal.">
        {() => <Fichas rotulo="Números" valores={m.setores} onMudar={(v) => set('setores', v)} opcoes={comNumero.map((c) => ({ valor: c.setor, rotulo: `${rotuloSetor[c.setor]}${c.principal ? ' (principal)' : ''}` }))} />}
      </Campo>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Prévia</span>
        <div className="bg-sunken flex flex-col items-start gap-1.5 rounded-[16px] p-3">
          <div className="bg-raised shadow-contorno max-w-[90%] rounded-[16px] rounded-tl-[6px] px-3.5 py-2.5 text-sm leading-relaxed">
            {previa || <span className="text-muted-foreground">O texto aparece aqui com os dados de exemplo.</span>}
          </div>
          {m.botoes.filter(Boolean).length > 0 && (
            <div className="flex max-w-[90%] flex-wrap gap-1.5">
              {m.botoes.filter(Boolean).map((b) => (
                <span key={b} className="bg-raised shadow-contorno rounded-full px-3 py-1 text-xs">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {aprovado && (
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ArrowCounterClockwiseIcon className="size-3.5" /> v{m.versao} em uso; ao enviar, vira v{m.versao + 1} em aprovação.
        </p>
      )}
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <PaperPlaneTiltIcon className="size-3.5" /> Só o Administrador submete (modelo.submeter).
      </p>
    </GavetaFormulario>
  )
}
