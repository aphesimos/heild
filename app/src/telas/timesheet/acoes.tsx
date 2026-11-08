import { ScissorsIcon, SparkleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, GavetaFormulario, Segmentado } from '@/components/ui/formulario'
import { atividadesInternas, atividadesTs, fmtH, min, rotuloConfianca, rotuloOrigem, type Contestacao, type ItemConfirmacao, type LinhaCalibracao, type Rentabilidade, type SessaoTs } from '@/dados/timesheet'
import { Amostra } from './graficos'

const clientesTs = ['Metalúrgica Andrade Ltda', 'Padaria Pão Quente ME', 'Loja Bela Vista Eireli', 'Clínica Sorriso Ltda', 'Transportes Rota Sul S.A.', 'Carlos Menezes']
const opcoes = (xs: string[]) => xs.map((x) => ({ valor: x, rotulo: x }))
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** Detalhe da sessão com as evidências e a contestação (05, 8.2; motivos em lista, nota opcional). */
export function DetalheSessao({ s, onFechar, onContestar }: { s: SessaoTs; onFechar: () => void; onContestar: (motivo: string, correcao: string) => void }) {
  const [contestando, setContestando] = useState(false)
  const [motivo, setMotivo] = useState<'cliente' | 'atividade' | 'tempo' | 'nao'>('cliente')
  const [cliente, setCliente] = useState(clientesTs.find((c) => c !== s.cliente) ?? clientesTs[0])
  const [atividade, setAtividade] = useState(atividadesTs[0])
  const [ini, setIni] = useState(s.inicio)
  const [fim, setFim] = useState(s.fim)
  const [nota, setNota] = useState('')
  const rotMotivo = { cliente: 'cliente errado', atividade: 'atividade errada', tempo: 'tempo errado', nao: 'não era trabalho' }
  const correcao = motivo === 'cliente' ? cliente : motivo === 'atividade' ? atividade : motivo === 'tempo' ? `${ini}–${fim}` : 'descartar'
  const podeContestar = s.confianca !== 'sem' && !s.contestacao
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`${s.inicio}–${s.fim} · ${s.atividade ? `${s.atividade} ${s.rotulo}` : s.rotulo}`}
      descricao={`${s.cliente ?? 'sem cliente'} · ${fmtH(min(s.fim) - min(s.inicio))}`}
      acao={contestando ? 'Enviar contestação' : 'Fechar'}
      acaoDesabilitada={contestando && motivo === 'tempo' && ini >= fim}
      onAcao={() => (contestando ? onContestar(rotMotivo[motivo], correcao) : onFechar())}
      secundaria={
        !contestando && podeContestar ? (
          <Button type="button" variant="outline" className="rounded-full" onClick={() => setContestando(true)}>
            Contestar
          </Button>
        ) : undefined
      }
    >
      <div className="flex items-center gap-2 text-sm">
        <Amostra c={s.confianca} /> {rotuloConfianca[s.confianca]} · origem: {rotuloOrigem[s.origem]}
        {s.foraJornada && <span className="text-warning">· fora da jornada</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Evidências</span>
        <ul className="flex flex-col gap-1">
          {s.evidencias.map((e) => (
            <li key={e} className="bg-sunken/60 rounded-[10px] px-3 py-1.5 text-sm">
              {e}
            </li>
          ))}
        </ul>
      </div>
      {s.contestacao && (
        <p className="bg-sunken rounded-[14px] px-3 py-2.5 text-sm">
          Contestada: {s.contestacao.motivo} · {s.contestacao.status === 'pendente' ? 'aguardando o Gestor' : s.contestacao.decisao}
        </p>
      )}
      {contestando && (
        <>
          <Campo rotulo="O que está errado">
            {() => (
              <Segmentado
                rotulo="Motivo"
                valor={motivo}
                onMudar={setMotivo}
                opcoes={[
                  { valor: 'cliente', rotulo: 'Cliente' },
                  { valor: 'atividade', rotulo: 'Atividade' },
                  { valor: 'tempo', rotulo: 'Tempo' },
                  { valor: 'nao', rotulo: 'Não era trabalho' },
                ]}
              />
            )}
          </Campo>
          {motivo === 'cliente' && <Campo rotulo="Era o cliente">{(id) => <CampoEscolha id={id} valor={cliente} onMudar={setCliente} opcoes={opcoes(clientesTs.filter((c) => c !== s.cliente))} />}</Campo>}
          {motivo === 'atividade' && <Campo rotulo="Era a atividade">{(id) => <CampoEscolha id={id} valor={atividade} onMudar={setAtividade} opcoes={opcoes([...atividadesTs, ...atividadesInternas])} />}</Campo>}
          {motivo === 'tempo' && (
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Começou">{(id) => <CampoTexto id={id} tipo="time" valor={ini} onMudar={setIni} />}</Campo>
              <Campo rotulo="Terminou" erro={ini >= fim ? 'Termina antes de começar.' : undefined}>
                {(id) => <CampoTexto id={id} tipo="time" valor={fim} onMudar={setFim} />}
              </Campo>
            </div>
          )}
          <Campo rotulo="Nota (opcional)" ajuda="Ninguém é obrigado a explicar. O Gestor decide com as evidências.">
            {(id) => <CampoArea id={id} linhas={2} valor={nota} onMudar={setNota} />}
          </Campo>
        </>
      )}
    </GavetaFormulario>
  )
}

/** Corrigir ou dividir um item de confirmação (05, 5.2): tudo em lista, nunca texto livre. */
export function CorrigirItem({ item, onFechar, onSalvar }: { item: ItemConfirmacao; onFechar: () => void; onSalvar: (texto: string) => void }) {
  const [modo, setModo] = useState<'cliente' | 'interno' | 'dividir'>('cliente')
  const [cliente, setCliente] = useState(item.sugestao.cliente ?? clientesTs[0])
  const [atividade, setAtividade] = useState(item.sugestao.atividade || atividadesTs[0])
  const [interno, setInterno] = useState(atividadesInternas[0])
  const [ini, setIni] = useState(item.inicio)
  const [fim, setFim] = useState(item.fim ?? item.inicio)
  const [corte, setCorte] = useState(item.fim ? `${String(Math.floor((min(item.inicio) + min(item.fim)) / 120)).padStart(2, '0')}:${String(Math.round(((min(item.inicio) + min(item.fim)) / 2) % 60)).padStart(2, '0')}` : item.inicio)
  const [cliente2, setCliente2] = useState(item.alternativa ?? clientesTs[1])
  const temIntervalo = !!item.fim
  const invalido = temIntervalo && (ini >= fim || (modo === 'dividir' && (corte <= ini || corte >= fim)))
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={`Corrigir · ${item.inicio}${item.fim ? `–${item.fim}` : ''}`}
      descricao={`${item.texto}. Pista: ${item.pista}.`}
      acao="Confirmar"
      acaoDesabilitada={invalido}
      onAcao={() => onSalvar(modo === 'interno' ? `${interno} (interno)` : modo === 'dividir' ? `${ini}–${corte} ${cliente} · ${corte}–${fim} ${cliente2}` : `${atividade.split(' ·')[0]} ${cliente}`)}
    >
      <Campo rotulo="Era">
        {() => (
          <Segmentado
            rotulo="Tipo"
            valor={modo}
            onMudar={setModo}
            opcoes={[
              { valor: 'cliente', rotulo: 'Trabalho de cliente' },
              { valor: 'interno', rotulo: 'Interno' },
              ...(temIntervalo ? [{ valor: 'dividir' as const, rotulo: 'Dois clientes' }] : []),
            ]}
          />
        )}
      </Campo>
      {modo === 'interno' ? (
        <Campo rotulo="Atividade interna" ajuda="Entra na capacidade, não na rentabilidade de cliente.">
          {(id) => <CampoEscolha id={id} valor={interno} onMudar={setInterno} opcoes={opcoes(atividadesInternas)} />}
        </Campo>
      ) : (
        <>
          <Campo rotulo={modo === 'dividir' ? 'Primeiro cliente' : 'Cliente'}>{(id) => <CampoEscolha id={id} valor={cliente} onMudar={setCliente} opcoes={opcoes(clientesTs)} />}</Campo>
          <Campo rotulo="Atividade">{(id) => <CampoEscolha id={id} valor={atividade} onMudar={setAtividade} opcoes={opcoes(atividadesTs)} />}</Campo>
          {modo === 'dividir' && (
            <>
              <Campo rotulo="Troca de cliente às" ajuda={`Entre ${ini} e ${fim}.`}>
                {(id) => <CampoTexto id={id} tipo="time" valor={corte} onMudar={setCorte} className="w-32" />}
              </Campo>
              <Campo rotulo="Segundo cliente">{(id) => <CampoEscolha id={id} valor={cliente2} onMudar={setCliente2} opcoes={opcoes(clientesTs.filter((c) => c !== cliente))} />}</Campo>
            </>
          )}
        </>
      )}
      {temIntervalo && modo !== 'dividir' && (
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Começou">{(id) => <CampoTexto id={id} tipo="time" valor={ini} onMudar={setIni} />}</Campo>
          <Campo rotulo="Terminou" erro={ini >= fim ? 'Termina antes de começar.' : undefined}>
            {(id) => <CampoTexto id={id} tipo="time" valor={fim} onMudar={setFim} />}
          </Campo>
        </div>
      )}
      {modo === 'dividir' && (
        <p className="bg-sunken flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm">
          <ScissorsIcon className="size-4" /> {ini}–{corte} {cliente} · {corte}–{fim} {cliente2}
        </p>
      )}
    </GavetaFormulario>
  )
}

/** Decidir uma contestação (Gestor; 05, 8.3): aceitar vira confirmada com a correção; recusar pede motivo em lista. */
export function DecidirContestacao({ c, onFechar, onDecidir }: { c: Contestacao; onFechar: () => void; onDecidir: (aceita: boolean, motivo?: string) => void }) {
  const [decisao, setDecisao] = useState<'aceitar' | 'recusar'>('aceitar')
  const [motivo, setMotivo] = useState('as evidências mostram a tarefa certa')
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={`Contestação de ${c.pessoa}`} descricao={c.sessao} acao={decisao === 'aceitar' ? 'Aceitar' : 'Recusar'} onAcao={() => onDecidir(decisao === 'aceitar', decisao === 'recusar' ? motivo : undefined)}>
      <div className="bg-sunken flex flex-col gap-1 rounded-[14px] px-3 py-2.5 text-sm">
        <span>
          <strong className="font-medium">Motivo:</strong> {c.motivo} → {c.correcao}
        </span>
        {c.nota && <span className="text-muted-foreground">“{c.nota}”</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Evidências</span>
        <ul className="flex flex-col gap-1">
          {c.evidencias.map((e) => (
            <li key={e} className="bg-sunken/60 rounded-[10px] px-3 py-1.5 text-sm">
              {e}
            </li>
          ))}
        </ul>
      </div>
      <Campo rotulo="Decisão">
        {() => (
          <Segmentado
            rotulo="Decisão"
            valor={decisao}
            onMudar={setDecisao}
            opcoes={[
              { valor: 'aceitar', rotulo: 'Aceitar a correção' },
              { valor: 'recusar', rotulo: 'Recusar' },
            ]}
          />
        )}
      </Campo>
      {decisao === 'recusar' && <Campo rotulo="Motivo da recusa">{(id) => <CampoEscolha id={id} valor={motivo} onMudar={setMotivo} opcoes={opcoes(['as evidências mostram a tarefa certa', 'o horário bate com os eventos', 'era trabalho do cliente', 'outro (conversar com a pessoa)'])} />}</Campo>}
      <p className="text-muted-foreground text-xs">A pessoa vê a decisão no Meu tempo. Nada se apaga: a correção é uma sessão nova que substitui a anterior.</p>
    </GavetaFormulario>
  )
}

/** Atribuir um artefato sem pessoa (05, 5.1, regra 5). */
export function AtribuirArtefato({ texto, sugestao, onFechar, onAtribuir }: { texto: string; sugestao: string; onFechar: () => void; onAtribuir: (p: string) => void }) {
  const [p, setP] = useState(sugestao)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Quem fez?" descricao={texto} acao="Atribuir" onAcao={() => onAtribuir(p)}>
      <Campo rotulo="Pessoa" ajuda="A pessoa recebe um item de confirmação (“foi você?”); se recusar, volta para cá.">
        {(id) => <CampoEscolha id={id} valor={p} onMudar={setP} opcoes={opcoes(['Fernanda Lima', 'João Pereira', 'Ana Souza', 'Bruno Costa', 'Rafael Nunes'])} />}
      </Campo>
    </GavetaFormulario>
  )
}

/** Registrar ausência (capacidade, GES-403): férias, licença, folga. */
export function RegistrarAusencia({ onFechar, onSalvar }: { onFechar: () => void; onSalvar: (a: { pessoa: string; tipo: string; de: string; ate: string }) => void }) {
  const [a, setA] = useState({ pessoa: 'João Pereira', tipo: 'férias', de: '', ate: '' })
  const ok = /^\d{2}\/\d{2}$/.test(a.de) && /^\d{2}\/\d{2}$/.test(a.ate)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Registrar ausência" descricao="Sai das horas disponíveis da pessoa; a capacidade e a carga prevista se ajustam. Os substitutos aparecem na Gestão." acao="Registrar" acaoDesabilitada={!ok} onAcao={() => onSalvar(a)}>
      <Campo rotulo="Pessoa">{(id) => <CampoEscolha id={id} valor={a.pessoa} onMudar={(v) => setA({ ...a, pessoa: v })} opcoes={opcoes(['Fernanda Lima', 'João Pereira', 'Ana Souza', 'Bruno Costa', 'Rafael Nunes'])} />}</Campo>
      <Campo rotulo="Tipo">
        {() => <Segmentado rotulo="Tipo" valor={a.tipo} onMudar={(v) => setA({ ...a, tipo: v })} opcoes={opcoes(['férias', 'licença', 'folga', 'treinamento externo'])} />}
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="De" ajuda="dd/mm">{(id) => <CampoTexto id={id} valor={a.de} onMudar={(v) => setA({ ...a, de: v.replace(/[^\d/]/g, '').slice(0, 5) })} placeholder="17/11" />}</Campo>
        <Campo rotulo="Até" ajuda="dd/mm">{(id) => <CampoTexto id={id} valor={a.ate} onMudar={(v) => setA({ ...a, ate: v.replace(/[^\d/]/g, '').slice(0, 5) })} placeholder="21/11" />}</Campo>
      </div>
    </GavetaFormulario>
  )
}

/** Adotar a mediana medida como duração padrão (05, 11.2). */
export function AdotarCalibracao({ linha, onFechar, onAdotar }: { linha: LinhaCalibracao; onFechar: () => void; onAdotar: (minutos: number) => void }) {
  const [valor, setValor] = useState(String(linha.medianaMin))
  const dif = Math.round(((linha.medianaMin - linha.catalogoMin) / linha.catalogoMin) * 100)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={`Calibrar ${linha.atividade}`} descricao={`Catálogo: ${linha.catalogoMin} min por cliente-mês · medido: ${linha.medianaMin} min (mediana de ${linha.n} sessões, ${dif > 0 ? '+' : ''}${dif}%).`} acao="Adotar" acaoDesabilitada={!(Number(valor) > 0)} onAcao={() => onAdotar(Number(valor))}>
      <Campo rotulo="Duração padrão do escritório (min)" ajuda="Usada nas estimativas por artefato desta atividade. Clientes com 5 ou mais sessões medidas usam a mediana própria.">
        {(id) => <CampoTexto id={id} tipo="number" valor={valor} onMudar={setValor} className="w-32 tabular-nums" />}
      </Campo>
      <p className="text-muted-foreground text-xs">Sessões confirmadas não mudam; as estimadas futuras usam o novo valor.</p>
    </GavetaFormulario>
  )
}

/** Propor reajuste (GES-014): o integrante de Gestão rascunha; a pessoa revisa e leva ao Financeiro. */
export function ProporReajuste({ r, custoHora, onFechar, onCriar }: { r: Rentabilidade; custoHora: number; onFechar: () => void; onCriar: () => void }) {
  const custo = r.horas * custoHora + r.variaveis
  const [margem, setMargem] = useState('25')
  const sugerido = Math.round(custo / (1 - Number(margem) / 100) / 50) * 50
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo={`Propor reajuste · ${r.cliente}`} descricao="Vira um cartão para o integrante de Gestão montar a proposta com o histórico; nada é enviado ao cliente sem você." acao="Criar cartão" onAcao={onCriar}>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        {[
          ['Honorário atual', r.honorario ? brl(r.honorario) : 'não informado'],
          ['Custo medido no mês', brl(custo)],
          ['Horas no mês', `${r.horas} h × ${brl(custoHora)}`],
          ['Variáveis (agentes, serviços)', brl(r.variaveis)],
        ].map(([k, v]) => (
          <div key={k} className="bg-sunken/60 rounded-[12px] px-3 py-2">
            <dt className="text-muted-foreground text-[11px]">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <Campo rotulo="Margem alvo (%)">{(id) => <CampoTexto id={id} tipo="number" valor={margem} onMudar={setMargem} className="w-28 tabular-nums" />}</Campo>
      <p className="bg-sunken flex items-start gap-2 rounded-[14px] px-3 py-2.5 text-sm">
        <SparkleIcon className="mt-0.5 size-4 shrink-0" /> Honorário sugerido: <strong className="font-medium tabular-nums">{brl(sugerido)}</strong>
        {r.honorario ? ` (${sugerido > r.honorario ? '+' : ''}${Math.round(((sugerido - r.honorario) / r.honorario) * 100)}%)` : ''}. O integrante junta os marcos do ano (admissões, faixa estourada) como justificativa.
      </p>
    </GavetaFormulario>
  )
}

