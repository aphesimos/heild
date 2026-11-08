import { CheckIcon, DownloadSimpleIcon, PencilSimpleIcon, PlusIcon, WarningIcon } from '@phosphor-icons/react'
import { BotaoBaixar } from '@/ambiente/interface'
import { useState } from 'react'
import { BarraUso, Caixa, Propriedade, TituloBloco } from '@/components/compostos/blocos'
import { AreaRolagem } from '@/components/ui/area-rolagem'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Campo, CampoTexto, GavetaFormulario, Interruptor, Segmentado } from '@/components/ui/formulario'
import { useLoja, usePersistente } from '@/ambiente/loja'
import { useSessao } from '@/ambiente/sessao'
import { assinatura as inicial, modulosAssinatura, planos } from '@/dados/configuracoes'
import { cn } from '@/lib/utils'
import { CabecalhoConfig } from './EscritorioTela'

/**
 * Configurações › Assinatura (Fundações 2.2; 06, saída do escritório): plano e
 * módulos, uso dos limites, troca de plano (nova versão a partir da data),
 * dados de cobrança, faturas e a saída do escritório.
 */
export function AssinaturaTela() {
  const [a, setA] = usePersistente('cfg.ass.a', inicial)
  const loja = useLoja()
  const { usuario } = useSessao()
  const [modulos, setModulos] = usePersistente('cfg.ass.modulos', modulosAssinatura)
  const [modal, setModal] = useState<'plano' | 'cobranca' | 'modulo' | 'saida' | null>(null)
  const [modulo, setModulo] = useState<string | null>(null)
  const plano = planos.find((p) => p.id === a.plano)!

  return (
    <AreaRolagem className="h-full px-3 pb-10 sm:px-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-1 ultra:max-w-[1600px]">
        <CabecalhoConfig
          titulo="Assinatura"
          sub={`Plano ${plano.nome} · ${plano.preco} · próxima cobrança ${a.proximaCobranca}`}
          acao={
            <Button size="sm" className="rounded-full" onClick={() => setModal('plano')}>
              Trocar plano
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Caixa>
            <TituloBloco descricao="Módulo fora do plano some do menu; as ferramentas dele respondem “módulo não contratado”.">Módulos</TituloBloco>
            <ul className="divide-border/70 flex flex-col divide-y">
              {modulos.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full', m.contratado ? 'bg-success/15' : 'bg-sunken')}>{m.contratado && <CheckIcon weight="bold" className="text-success size-3.5" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{m.nome}</span>
                    <span className="text-muted-foreground block text-xs">{m.descricao}</span>
                  </span>
                  {!m.contratado && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setModulo(m.id)
                        setModal('modulo')
                      }}
                    >
                      <PlusIcon /> Adicionar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <TituloBloco descricao="Pacotes que o escritório vende aos clientes além da contabilidade.">Módulos extras</TituloBloco>
            {loja.estado.cenario === 'bpo_puro' ? (
              <p className="text-muted-foreground text-sm">O BPO financeiro é o pacote principal deste escritório: não há contabilidade, e Clientes ocupa o lugar do Painel.</p>
            ) : (
              <Interruptor
                ligado={loja.estado.bpoModulo}
                onMudar={(v) => {
                  loja.ligarBpo(v)
                  loja.registrar(usuario.nome, v ? 'Ligou o módulo BPO Financeiro' : 'Desligou o módulo BPO Financeiro')
                  loja.toast(v ? 'BPO ligado: o item aparece no menu de quem tem o setor BPO Financeiro' : 'BPO desligado: o item sai do menu; os dados ficam guardados')
                }}
                rotulo="BPO Financeiro"
                detalhe="contas a pagar, conciliação, caixa e aprovações das empresas clientes, sobre o ERP que elas já usam"
              />
            )}
          </Caixa>
          <div className="flex flex-col gap-4">
            <Caixa>
              <TituloBloco>Uso do plano</TituloBloco>
              <div className="flex flex-col gap-3">
                <BarraUso rotulo="Usuários" usado={a.uso.usuarios} total={plano.usuarios} />
                <BarraUso rotulo="Clientes" usado={a.uso.clientes} total={plano.clientes} />
                <BarraUso rotulo="Armazenamento" usado={a.uso.gb} total={plano.gb} unidade=" GB" />
                <BarraUso rotulo="Uso de IA no mês (milhões de tokens)" usado={a.uso.tokens} total={parseInt(plano.tokens)} />
              </div>
              <p className="text-muted-foreground text-xs">A 90% de qualquer limite você recebe um aviso. Uso de IA acima do plano é cobrado à parte, com teto que você define em Integrantes › Limites.</p>
            </Caixa>
            <Caixa>
              <TituloBloco
                acao={
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setModal('cobranca')}>
                    <PencilSimpleIcon /> Editar
                  </Button>
                }
              >
                Cobrança
              </TituloBloco>
              <dl className="divide-border/70 flex flex-col divide-y">
                <Propriedade rotulo="CNPJ da nota">{a.cobranca.cnpj}</Propriedade>
                <Propriedade rotulo="E-mail financeiro">{a.cobranca.email}</Propriedade>
                <Propriedade rotulo="Forma">{a.cobranca.forma === 'boleto' ? 'Boleto' : a.cobranca.forma === 'pix' ? 'Pix automático' : 'Cartão'}</Propriedade>
              </dl>
            </Caixa>
          </div>
        </div>

        <Caixa>
          <TituloBloco>Faturas</TituloBloco>
          <ul className="flex flex-col gap-1.5 text-sm">
            {a.faturas.map((f) => (
              <li key={f.mes} className="flex items-center gap-3">
                <span className="flex-1">
                  {f.mes} {f.obs && <span className="text-muted-foreground text-xs">· {f.obs}</span>}
                </span>
                <span className="tabular-nums">{f.valor}</span>
                <Badge variant="sucesso">{f.status}</Badge>
                <BotaoBaixar nome={`Fatura da plataforma · ${f.mes}.pdf`} size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Baixar fatura de ${f.mes}`}>
                  <DownloadSimpleIcon />
                </BotaoBaixar>
              </li>
            ))}
          </ul>
          <div className="border-t pt-2">
            <span className="text-muted-foreground text-xs">Histórico do plano: {a.historico.map((h) => `${h.plano} desde ${h.de}`).join(' · ')}</span>
          </div>
        </Caixa>

        <section className="border-destructive/30 flex flex-col gap-2 rounded-[24px] border border-dashed p-4 text-sm">
          <h2 className="flex items-center gap-2 font-medium">
            <WarningIcon className="text-destructive size-4" /> Encerrar a assinatura
          </h2>
          <p className="text-muted-foreground">
            O escritório recebe a exportação completa (clientes, documentos, tarefas, conversas, horas e eventos) e fica 90 dias em modo leitura. Clientes podem ser transferidos para outro escritório da plataforma, com aceite dos dois
            lados.
          </p>
          <Button size="sm" variant="outline" className="text-destructive w-fit rounded-full" onClick={() => setModal('saida')}>
            Encerrar…
          </Button>
        </section>
      </div>

      {modal === 'plano' && (
        <TrocarPlano
          atual={a.plano}
          uso={a.uso}
          onFechar={() => setModal(null)}
          onTrocar={(p) => {
            setA({
              ...a,
              plano: p,
              historico: [
                {
                  de: '01/12/2026',
                  plano: planos.find((x) => x.id === p)!.nome,
                  motivo: 'troca de plano',
                },
                ...a.historico,
              ],
            })
            setModal(null)
          }}
        />
      )}
      {modal === 'cobranca' && (
        <EditarCobranca
          c={a.cobranca}
          onFechar={() => setModal(null)}
          onSalvar={(c) => {
            setA({ ...a, cobranca: c })
            setModal(null)
          }}
        />
      )}
      {modal === 'modulo' && modulo && (
        <GavetaFormulario
          aberta
          onFechar={() => setModal(null)}
          titulo={`Adicionar ${modulos.find((m) => m.id === modulo)!.nome}`}
          descricao="Entra na próxima fatura, proporcional aos dias do mês. Aparece no menu na hora para quem tiver permissão."
          acao="Adicionar por R$ 290/mês"
          onAcao={() => {
            setModulos((xs) => xs.map((x) => (x.id === modulo ? { ...x, contratado: true } : x)))
            setModal(null)
          }}
        >
          <ul className="text-muted-foreground list-disc pl-5 text-sm">
            <li>Convites para as pessoas dos clientes, pelo WhatsApp ou e-mail.</li>
            <li>Pastas visíveis ao cliente já configuradas em Armazenamento.</li>
            <li>Ícone, nome e cores do app saem do Tema.</li>
          </ul>
        </GavetaFormulario>
      )}
      {modal === 'saida' && <Encerrar onFechar={() => setModal(null)} />}
    </AreaRolagem>
  )
}

function TrocarPlano({ atual, uso, onFechar, onTrocar }: { atual: string; uso: typeof inicial.uso; onFechar: () => void; onTrocar: (p: string) => void }) {
  const [p, setP] = useState(atual)
  const escolhido = planos.find((x) => x.id === p)!
  const estoura = uso.usuarios > escolhido.usuarios || uso.clientes > escolhido.clientes || uso.gb > escolhido.gb
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Trocar plano"
      descricao="A troca cria uma nova versão da assinatura a partir de 01/12. Nada se perde ao mudar."
      acao={p === atual ? 'Plano atual' : `Trocar para ${escolhido.nome}`}
      acaoDesabilitada={p === atual || estoura}
      onAcao={() => onTrocar(p)}
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {planos.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setP(x.id)}
            aria-pressed={p === x.id}
            className={cn('flex cursor-pointer flex-col gap-1 rounded-[16px] p-3 text-left text-sm', p === x.id ? 'bg-raised shadow-cartao ring-foreground/30 ring-2' : 'bg-sunken/60')}
          >
            <span className="font-medium">
              {x.nome} {x.id === atual && <Badge variant="outline">atual</Badge>}
            </span>
            <span className="font-heading text-lg font-light">{x.preco}</span>
            <span className="text-muted-foreground text-xs">
              {x.usuarios} usuários · {x.clientes} clientes · {x.gb} GB · {x.tokens} tokens/mês
            </span>
          </button>
        ))}
      </div>
      {estoura && (
        <p className="bg-destructive/8 flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
          <WarningIcon className="text-destructive mt-0.5 size-4 shrink-0" /> O escritório já usa mais do que esse plano permite ({uso.clientes} clientes, {uso.gb.toLocaleString('pt-BR')} GB). Reduza antes de trocar.
        </p>
      )}
    </GavetaFormulario>
  )
}

function EditarCobranca({ c, onFechar, onSalvar }: { c: typeof inicial.cobranca; onFechar: () => void; onSalvar: (c: typeof inicial.cobranca) => void }) {
  const [d, setD] = useState(c)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Dados de cobrança" acao="Salvar" acaoDesabilitada={!/^\S+@\S+\.\S+$/.test(d.email)} onAcao={() => onSalvar(d)}>
      <Campo rotulo="CNPJ para a nota fiscal">{(id) => <CampoTexto id={id} valor={d.cnpj} onMudar={(v) => setD({ ...d, cnpj: v })} />}</Campo>
      <Campo rotulo="E-mail que recebe as faturas">{(id) => <CampoTexto id={id} tipo="email" valor={d.email} onMudar={(v) => setD({ ...d, email: v })} />}</Campo>
      <Campo rotulo="Forma de pagamento">
        {() => (
          <Segmentado
            rotulo="Forma"
            valor={d.forma}
            onMudar={(v) => setD({ ...d, forma: v })}
            opcoes={[
              { valor: 'boleto', rotulo: 'Boleto' },
              { valor: 'pix', rotulo: 'Pix automático' },
              { valor: 'cartao', rotulo: 'Cartão' },
            ]}
          />
        )}
      </Campo>
    </GavetaFormulario>
  )
}

function Encerrar({ onFechar }: { onFechar: () => void }) {
  const [texto, setTexto] = useState('')
  const [pedido, setPedido] = useState(false)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Encerrar a assinatura"
      descricao="Não é imediato: você recebe a exportação e segue 90 dias em modo leitura. Só depois disso os dados saem da plataforma, salvo o que a lei obriga a guardar."
      acao={pedido ? 'Fechar' : 'Pedir encerramento'}
      acaoDesabilitada={!pedido && texto.trim().toUpperCase() !== 'ENCERRAR'}
      onAcao={() => (pedido ? onFechar() : setPedido(true))}
    >
      {pedido ? (
        <p className="bg-sunken rounded-[14px] px-3 py-2.5 text-sm">
          Pedido registrado. A exportação completa fica pronta em até 24 h e chega ao e-mail dos administradores. Até 01/03/2027, o escritório funciona só para leitura. Dá para desistir até lá.
        </p>
      ) : (
        <>
          <ul className="text-muted-foreground list-disc pl-5 text-sm">
            <li>Integrantes, réguas, comunicados e captura de notas param no dia do pedido.</li>
            <li>O app dos clientes mostra um aviso e continua só para baixar documentos.</li>
            <li>Clientes podem ser transferidos para outro escritório da plataforma.</li>
          </ul>
          <Campo rotulo='Para confirmar, escreva "ENCERRAR"'>{(id) => <CampoTexto id={id} valor={texto} onMudar={setTexto} />}</Campo>
        </>
      )}
    </GavetaFormulario>
  )
}
