import { ArrowsClockwiseIcon, BankIcon, PencilSimpleIcon, PlugsConnectedIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { Button } from '@/components/ui/button'
import { Campo, CampoEscolha, CampoTexto, GavetaFormulario } from '@/components/ui/formulario'
import { cn } from '@/lib/utils'
import { empresasBpo, escalonamentoBpo, passosEscalonamento, rotuloModoErp, rotuloModoPagamento, titularDe, type EmpresaBpo, type ModoErp, type ModoPagamento } from '@/dados/bpo'
import { SeloTitular } from '../financeiro/pecas'
import { brl, CabecalhoBpo, PaginaBpo, Caixa, Propriedade, SeloAudit, SeloErp, TituloBloco, type PropsBpo } from './comum'

const provedores = ['Conta Azul', 'Omie', 'Bling', 'Nibo', 'Granatum', 'sem ERP']
const explicaModo: Record<ModoPagamento, string> = {
  M1: 'O BPO prepara e o cliente aprova no app; depois ele mesmo libera no banco. O padrão.',
  M2: 'Depois do cartão aprovado, o pagamento é agendado por API do banco no vencimento.',
  M3: 'O BPO liberaria no banco até um teto delegado por escrito. Fora da primeira versão.',
}
const modoPadrao: Record<string, ModoErp> = { 'Conta Azul': 'E1', Omie: 'E1', Bling: 'E1', Nibo: 'E2', Granatum: 'E2', 'sem ERP': 'E3' }

/**
 * BPO › Configuração (frente financeira; 10, 3.0, 3.7 e 3.9): por empresa, a
 * conexão com o ERP e o modo, as contas bancárias, o modo de pagamento, as
 * alçadas da empresa e de cada aprovador, e a janela de aprovação.
 */
export function ConfigBpoTela({ empresa, onEscolher }: PropsBpo) {
  if (!empresa)
    return (
      <PaginaBpo>
        <CabecalhoBpo titulo="Configuração" sub="Escolha a empresa: cada uma tem ERP, bancos, alçadas e janela próprios" />
        <Caixa className="gap-0">
          <ul className="divide-border/70 flex flex-col divide-y">
            {empresasBpo.map((e) => (
              <li key={e.clienteId}>
                <button
                  type="button"
                  onClick={() => onEscolher(e.clienteId, 'configuracao')}
                  className="hover:bg-raised/60 -mx-2 flex w-[calc(100%+1rem)] cursor-pointer flex-wrap items-center gap-3 rounded-[12px] px-2 py-2.5 text-left text-sm"
                >
                  <SeloAudit e={e} compacto />
                  <span className="min-w-0 flex-1 truncate">{e.nome}</span>
                  <SeloErp e={e} />
                </button>
              </li>
            ))}
          </ul>
        </Caixa>
      </PaginaBpo>
    )
  return <ConfigEmpresa key={empresa.clienteId} e={empresa} />
}

function ConfigEmpresa({ e }: { e: EmpresaBpo }) {
  const loja = useLoja()
  const { usuario, permissoes } = useSessao()
  const [erp, setErp] = usePersistente(`bpo.erp.${e.clienteId}`, e.erp)
  const [modoPg, setModoPg] = usePersistente<ModoPagamento>(`bpo.modoPg.${e.clienteId}`, e.modoPagamento)
  // Valem as alçadas aceitas pelo cliente no app; as do cadastro até lá.
  const aceitas = loja.estado.bpoAlcadas[e.clienteId]
  const alcadas = aceitas ? { ...e.alcadas, ...aceitas, vigencia: 'aceitas hoje no app' } : e.alcadas
  const proposta = loja.estado.bpoAlcadaProposta[e.clienteId]
  const [gaveta, setGaveta] = useState<'erp' | 'alcadas' | 'escalonamento' | null>(null)
  const [esc, setEsc] = usePersistente(`bpo.esc.${e.clienteId}`, escalonamentoBpo[e.clienteId])
  const [rascEsc, setRascEsc] = useState({ abertura: esc.abertura, lembreteH: String(esc.lembreteH), substitutoH: String(esc.substitutoH), substituto: esc.substituto ?? '' })
  const ficha = loja.fichaDe(e.clienteId)
  const [rascunho, setRascunho] = useState({
    provedor: erp.provedor,
    f1: String(alcadas.faixa1),
    f2: String(alcadas.faixa2),
    janela: alcadas.janela,
    pessoas: Object.fromEntries((ficha?.contatos ?? []).map((c) => [c.nome, String(c.alcadaPagamento ?? 0)])) as Record<string, string>,
  })
  const edita = permissoes.bpoEditaConfig
  const feito = (t: string) => (loja.registrar(usuario.nome, `BPO · ${e.nome}: ${t}`), loja.toast(t))

  return (
    <PaginaBpo>
      <CabecalhoBpo titulo="Configuração" sub={`${e.nome} · vale só para esta empresa`}>
        <SeloTitular titular={titularDe(e)} />
      </CabecalhoBpo>
      <div className="grid gap-4 lg:grid-cols-2">
        <Caixa>
          <TituloBloco
            descricao="A plataforma lê e escreve no ERP que a empresa já usa; o que não tem API entra por arquivo."
            acao={
              edita && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setGaveta('erp')}>
                  <PencilSimpleIcon /> Trocar
                </Button>
              )
            }
          >
            ERP
          </TituloBloco>
          <SeloErp e={{ ...e, erp }} />
          <dl className="divide-border/70 divide-y">
            <Propriedade rotulo="Modo">{rotuloModoErp[erp.modo]}</Propriedade>
            <Propriedade rotulo="Escopo da credencial">{erp.escopo}</Propriedade>
          </dl>
          {(erp.situacao === 'credencial_vencida' || erp.situacao === 'atrasada') && (
            <Button
              size="sm"
              className="w-fit rounded-full"
              onClick={() => {
                setErp((x) => ({ ...x, situacao: 'ok', ultima: 'agora' }))
                feito(erp.situacao === 'atrasada' ? `Sincronização com o ${erp.provedor} religada` : `Link de reautorização do ${erp.provedor} enviado ao cliente; conectado de novo`)
              }}
            >
              <ArrowsClockwiseIcon /> {erp.situacao === 'atrasada' ? 'Religar a sincronização' : 'Pedir nova autorização'}
            </Button>
          )}
        </Caixa>
        <Caixa>
          <TituloBloco
            descricao="Só leitura (Open Finance ou API do banco); consentimento vencendo vira tarefa."
            acao={
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => feito('Pedido de consentimento Open Finance enviado ao cliente pelo app')}>
                <BankIcon /> Conectar banco
              </Button>
            }
          >
            Contas bancárias
          </TituloBloco>
          <ul className="divide-border/70 flex flex-col divide-y">
            {e.bancos.map((b) => (
              <li key={b.id} className="flex items-center gap-2 py-2 text-sm">
                <PlugsConnectedIcon className="text-muted-foreground size-4" />
                <span className="min-w-0 flex-1 truncate">{b.nome}</span>
                <span className="text-muted-foreground text-xs">
                  {b.via} · {b.atualizado}
                </span>
              </li>
            ))}
          </ul>
        </Caixa>
        <Caixa>
          <TituloBloco descricao="Em todos os modos o cliente aprova antes; a diferença é quem aperta o botão no banco.">Modo de pagamento</TituloBloco>
          <div role="radiogroup" aria-label="Modo de pagamento" className="flex flex-col gap-1.5">
            {(['M1', 'M2', 'M3'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={modoPg === m}
                disabled={!edita || m === 'M3'}
                onClick={() => {
                  if (m === modoPg) return
                  setModoPg(m)
                  feito(`Modo de pagamento: ${rotuloModoPagamento[m]}`)
                }}
                className={cn('flex cursor-pointer items-start gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm disabled:cursor-default', m === 'M3' && 'opacity-50', modoPg === m ? 'bg-raised shadow-contorno' : 'hover:bg-sunken/60')}
              >
                <span className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border', modoPg === m && 'border-foreground')}>{modoPg === m && <span className="bg-foreground size-2 rounded-full" />}</span>
                <span className="min-w-0 flex-1">
                  <span className="block">{rotuloModoPagamento[m]}</span>
                  <span className="text-muted-foreground block text-xs">{explicaModo[m]}</span>
                </span>
              </button>
            ))}
          </div>
        </Caixa>
        <Caixa>
          <TituloBloco
            descricao={`Aceitas por ${alcadas.aceitoPor} · ${alcadas.vigencia}`}
            acao={
              edita && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setGaveta('alcadas')}>
                  <PencilSimpleIcon /> Editar
                </Button>
              )
            }
          >
            Alçadas e janela
          </TituloBloco>
          <dl className="divide-border/70 divide-y">
            <Propriedade rotulo="Faixa 1">{`até ${brl(alcadas.faixa1)}: 1 aprovador`}</Propriedade>
            <Propriedade rotulo="Faixa 2">{`até ${brl(alcadas.faixa2)}: 1 aprovador com alçada`}</Propriedade>
            <Propriedade rotulo="Acima">{`de ${brl(alcadas.faixa2)}: aprovação reforçada (2)`}</Propriedade>
            <Propriedade rotulo="Janela">{alcadas.janela}</Propriedade>
            {(ficha?.contatos ?? [])
              .filter((c) => c.alcadaPagamento)
              .map((c) => (
                <Propriedade key={c.nome} rotulo={c.nome}>
                  {`aprova até ${brl(c.alcadaPagamento ?? 0)}${c.reforcada ? ' · entra na reforçada' : ''}`}
                </Propriedade>
              ))}
          </dl>
          <p className="text-muted-foreground text-xs">Se a alçada da pessoa e a faixa da empresa divergem, vale a menor. Quem altera as alçadas de uma empresa não confere nem aprova pagamento nela.</p>
          {proposta && (
            <div className="bg-sunken/60 flex flex-col gap-1 rounded-[14px] px-3 py-2.5 text-sm">
              <span className="font-medium">Proposta aguardando o aceite do cliente no app</span>
              <span className="text-muted-foreground text-xs">
                faixa 1 até {brl(proposta.faixa1)} · faixa 2 até {brl(proposta.faixa2)} · {proposta.janela} · proposta por {proposta.por} às {proposta.quando}
              </span>
              <Button size="sm" variant="ghost" className="w-fit rounded-full" onClick={() => (loja.proporAlcada(e.clienteId, null), feito('Proposta de alçadas retirada'))}>
                Retirar a proposta
              </Button>
            </div>
          )}
        </Caixa>
        <Caixa className="lg:col-span-2">
          <TituloBloco
            descricao="O que acontece com o lote sem resposta. Pagar nunca é automático: no fim da cadeia só há alerta."
            acao={
              edita && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setGaveta('escalonamento')}>
                  <PencilSimpleIcon /> Editar
                </Button>
              )
            }
          >
            Janela e escalonamento do lote
          </TituloBloco>
          <ol className="grid gap-2 sm:grid-cols-5">
            {passosEscalonamento(esc).map((p, i) => (
              <li key={i} className="bg-sunken/50 flex flex-col gap-1 rounded-[14px] p-3 text-sm">
                <span className="text-muted-foreground text-xs">
                  {i + 1}. {p.quando}
                </span>
                {p.texto}
              </li>
            ))}
          </ol>
        </Caixa>
      </div>

      <GavetaFormulario
        aberta={gaveta === 'escalonamento'}
        onFechar={() => setGaveta(null)}
        titulo="Janela e escalonamento"
        descricao="Vale só para esta empresa. O sócio e o Gestor do BPO sempre recebem o alerta da véspera e o do vencido."
        acao="Salvar"
        onAcao={() => {
          setEsc((x) => ({ ...x, abertura: rascEsc.abertura, lembreteH: Number(rascEsc.lembreteH) || x.lembreteH, substitutoH: Number(rascEsc.substitutoH) || x.substitutoH, substituto: rascEsc.substituto || undefined }))
          setGaveta(null)
          feito('Escalonamento do lote atualizado')
        }}
      >
        <Campo rotulo="Abertura da janela">{(id) => <CampoTexto id={id} tipo="time" valor={rascEsc.abertura} onMudar={(v) => setRascEsc((r) => ({ ...r, abertura: v }))} />}</Campo>
        <Campo rotulo="Lembrete ao aprovador depois de (horas)">{(id) => <CampoTexto id={id} tipo="number" valor={rascEsc.lembreteH} onMudar={(v) => setRascEsc((r) => ({ ...r, lembreteH: v }))} />}</Campo>
        <Campo rotulo="Vai ao substituto depois de (horas)" ajuda="Se passar do expediente, vai na abertura do dia útil seguinte.">
          {(id) => <CampoTexto id={id} tipo="number" valor={rascEsc.substitutoH} onMudar={(v) => setRascEsc((r) => ({ ...r, substitutoH: v }))} />}
        </Campo>
        <Campo rotulo="Substituto do aprovador">
          {(id) => (
            <CampoEscolha
              id={id}
              valor={rascEsc.substituto}
              onMudar={(v) => setRascEsc((r) => ({ ...r, substituto: v }))}
              opcoes={[{ valor: '', rotulo: 'nenhum (alerta ao Gestor do BPO)' }, ...(ficha?.contatos ?? []).filter((c) => c.nome !== esc.aprovador).map((c) => ({ valor: c.nome, rotulo: `${c.nome} (${c.papel})` }))]}
            />
          )}
        </Campo>
      </GavetaFormulario>

      <GavetaFormulario
        aberta={gaveta === 'erp'}
        onFechar={() => setGaveta(null)}
        titulo="ERP da empresa"
        descricao="Conta Azul, Omie e Bling por API; Nibo e Granatum por arquivo; sem ERP, livro próprio."
        acao="Conectar"
        onAcao={() => {
          const modo = modoPadrao[rascunho.provedor]
          setErp({
            provedor: rascunho.provedor,
            modo,
            situacao: modo === 'E1' ? 'ok' : modo === 'E2' ? 'arquivo' : 'livro_proprio',
            ultima: 'agora',
            escopo: modo === 'E1' ? 'contas a pagar e a receber (leitura e escrita)' : modo === 'E2' ? 'exportação OFX e CSV' : 'livro próprio na plataforma',
          })
          setGaveta(null)
          feito(`ERP: ${rascunho.provedor} (${rotuloModoErp[modo]})`)
        }}
      >
        <Campo rotulo="Sistema" ajuda={rotuloModoErp[modoPadrao[rascunho.provedor]]}>
          {(id) => <CampoEscolha id={id} valor={rascunho.provedor} onMudar={(v) => setRascunho((r) => ({ ...r, provedor: v }))} opcoes={provedores.map((p) => ({ valor: p, rotulo: p }))} />}
        </Campo>
      </GavetaFormulario>

      <GavetaFormulario
        aberta={gaveta === 'alcadas'}
        onFechar={() => setGaveta(null)}
        titulo="Alçadas de pagamento"
        descricao="Nada muda até o cliente aceitar no app. Quem propõe deixa de conferir e aprovar pagamentos desta empresa."
        acao="Mandar para o aceite"
        onAcao={() => {
          loja.proporAlcada(e.clienteId, {
            faixa1: Number(rascunho.f1) || alcadas.faixa1,
            faixa2: Number(rascunho.f2) || alcadas.faixa2,
            janela: rascunho.janela,
            pessoas: Object.fromEntries(Object.entries(rascunho.pessoas).map(([k, v]) => [k, Number(v) || 0])),
            por: usuario.nome,
          })
          setGaveta(null)
          feito('Proposta de alçadas enviada: vale depois do aceite do cliente no app. Você não confere pagamentos desta empresa.')
        }}
      >
        <Campo rotulo="Faixa 1 (1 aprovador), até R$">{(id) => <CampoTexto id={id} tipo="number" valor={rascunho.f1} onMudar={(v) => setRascunho((r) => ({ ...r, f1: v }))} />}</Campo>
        <Campo rotulo="Faixa 2 (aprovador com alçada), até R$" ajuda="Acima disso, duas pessoas aprovam.">
          {(id) => <CampoTexto id={id} tipo="number" valor={rascunho.f2} onMudar={(v) => setRascunho((r) => ({ ...r, f2: v }))} />}
        </Campo>
        <Campo rotulo="Janela de aprovação">{(id) => <CampoTexto id={id} valor={rascunho.janela} onMudar={(v) => setRascunho((r) => ({ ...r, janela: v }))} />}</Campo>
        {(ficha?.contatos ?? []).map((c) => (
          <Campo key={c.nome} rotulo={`${c.nome} (${c.papel}) aprova até R$`} ajuda="0 = não aprova pagamentos">
            {(id) => <CampoTexto id={id} tipo="number" valor={rascunho.pessoas[c.nome] ?? '0'} onMudar={(v) => setRascunho((r) => ({ ...r, pessoas: { ...r.pessoas, [c.nome]: v } }))} />}
          </Campo>
        ))}
      </GavetaFormulario>
    </PaginaBpo>
  )
}
