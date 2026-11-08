import { BankIcon, CheckCircleIcon, DownloadSimpleIcon, FileArrowUpIcon, PlusIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { usePersistente } from '@/ambiente/loja'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Campo, CampoArea, CampoEscolha, CampoTexto, Fichas, GavetaFormulario, Interruptor, Passos, Segmentado } from '@/components/ui/formulario'
import { alcadas as alcadasIniciais, importacaoOrigens, nfseEscritorio, planoContas as planoInicial, politicaInadimplencia, provedorCobranca, type PassoRegua } from '@/dados/financeiro'
import { cn } from '@/lib/utils'

type Fechar = { onFechar: () => void }

/** Conectar ou trocar o provedor de cobrança (FIN-013, FIN-604): sem perder as autorizações de Pix Automático. */
export function ConectarProvedor({ onFechar, troca }: Fechar & { troca?: boolean }) {
  const passos = ['Provedor', 'Credenciais', 'Conta', 'Testar', 'Pronto']
  const [passo, setPasso] = useState(0)
  const [prov, setProv] = useState('Banco Inter (API PJ)')
  const [token, setToken] = useState('')
  const [cert, setCert] = useState(false)
  const [testado, setTestado] = useState<'nao' | 'testando' | 'ok'>('nao')
  const [migrar, setMigrar] = useState(true)
  const precisaCert = prov.includes('Inter') || prov.includes('Efí') || prov.includes('Itaú')
  const pode = passo === 1 ? token.length >= 8 && (!precisaCert || cert) : passo === 3 ? testado === 'ok' : true
  const ultimo = passo === passos.length - 1
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo={troca ? 'Trocar o provedor de cobrança' : 'Conectar provedor de cobrança'}
      descricao="Gera boleto e Pix, recebe a baixa sozinho e guarda as autorizações de Pix Automático. A credencial fica no cofre; ninguém a vê depois de salva."
      acao={ultimo ? 'Concluir' : 'Continuar'}
      acaoDesabilitada={!pode}
      onAcao={() => (ultimo ? onFechar() : setPasso((p) => p + 1))}
      secundaria={
        passo > 0 && !ultimo ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      <Passos passos={passos} atual={passo} />
      {passo === 0 && (
        <>
          <Campo rotulo="Provedor">
            {(id) => <CampoEscolha id={id} valor={prov} onMudar={setProv} opcoes={['Banco Inter (API PJ)', 'Efí (Gerencianet)', 'Asaas', 'Itaú (API Cobrança)', 'Sicredi'].map((x) => ({ valor: x, rotulo: x }))} />}
          </Campo>
          <div className="bg-sunken/60 grid grid-cols-2 gap-2 rounded-[14px] p-3 text-xs sm:grid-cols-4">
            <span>
              <span className="text-muted-foreground block">Boleto</span>
              {prov.includes('Asaas') ? 'R$ 2,15' : prov.includes('Efí') ? 'R$ 3,45' : 'R$ 1,90'}
            </span>
            <span>
              <span className="text-muted-foreground block">Pix</span>
              {prov.includes('Asaas') ? 'R$ 2,15' : 'grátis'}
            </span>
            <span>
              <span className="text-muted-foreground block">Pix Automático</span>
              {prov.includes('Efí') ? 'R$ 3,50' : 'R$ 0,90'}
            </span>
            <span>
              <span className="text-muted-foreground block">Crédito</span>
              {prov.includes('Asaas') ? 'D+1' : 'D+0'}
            </span>
          </div>
          {troca && (
            <Interruptor
              ligado={migrar}
              onMudar={setMigrar}
              rotulo={`Levar as ${provedorCobranca.autorizacoesPix} autorizações de Pix Automático`}
              detalhe="Os títulos em aberto continuam no provedor atual até a baixa; os novos saem pelo novo. Quem não puder ser levado recebe um pedido de nova autorização no app."
            />
          )}
        </>
      )}
      {passo === 1 && (
        <>
          <Campo rotulo="Token da API" ajuda="Criado no internet banking da conta PJ, com escopo de cobrança e consulta de extrato.">
            {(id) => <CampoTexto id={id} valor={token} onMudar={setToken} mono placeholder="cole aqui" />}
          </Campo>
          {precisaCert && (
            <Campo rotulo="Certificado da API (mTLS)" ajuda="Arquivo .crt e .key que o banco gera junto com o token.">
              {() => (
                <Button type="button" variant="outline" className="w-fit rounded-full" onClick={() => setCert(true)}>
                  <FileArrowUpIcon /> {cert ? 'certificado.crt e chave.key enviados' : 'Enviar arquivos'}
                </Button>
              )}
            </Campo>
          )}
        </>
      )}
      {passo === 2 && (
        <>
          <Campo rotulo="Conta que recebe">{(id) => <CampoEscolha id={id} valor="0001 · 1234567-8" onMudar={() => {}} opcoes={[{ valor: '0001 · 1234567-8', rotulo: 'ag 0001 · cc 1234567-8 (PJ)' }]} />}</Campo>
          <Campo rotulo="Juros e multa no boleto" ajuda="Vêm da política de inadimplência; mudam lá.">
            {() => (
              <p className="text-sm">
                {politicaInadimplencia.juros} · multa de {politicaInadimplencia.multa}
              </p>
            )}
          </Campo>
        </>
      )}
      {passo === 3 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">Emitimos um boleto e um Pix de R$ 1,00 em homologação, consultamos e cancelamos. Nada chega a cliente.</p>
          <Button
            type="button"
            variant="outline"
            className="w-fit rounded-full"
            disabled={testado === 'testando'}
            onClick={() => {
              setTestado('testando')
              setTimeout(() => setTestado('ok'), 1200)
            }}
          >
            {testado === 'testando' ? 'Testando…' : 'Testar conexão'}
          </Button>
          {testado === 'ok' && (
            <ul className="flex flex-col gap-1">
              {['Token aceito', 'Boleto de teste emitido e cancelado', 'Pix de teste com QR Code', 'Webhook de baixa respondendo'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircleIcon className="text-success size-4" weight="fill" /> {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {passo === 4 && (
        <p className="bg-success/10 rounded-[14px] px-3 py-2.5 text-sm">
          {prov} conectado. As cobranças do próximo ciclo (01/12) já saem por ele. {troca && migrar ? 'As autorizações de Pix Automático estão sendo levadas; você acompanha em Cobrança.' : ''}
        </p>
      )}
    </GavetaFormulario>
  )
}

/** NFS-e do próprio escritório (GES-007, GES-008). */
export function ConfigNfse({ onFechar }: Fechar) {
  const [emissor, setEmissor] = useState(nfseEscritorio.emissor)
  const [codigo, setCodigo] = useState(nfseEscritorio.codigoServico)
  const [envio, setEnvio] = useState<'junto' | 'apos_pagamento' | 'manual'>('junto')
  const [retencao, setRetencao] = useState(true)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="NFS-e do escritório" descricao="A nota de cada honorário, mensal e extra. Erro na prefeitura volta como cartão para corrigir e reemitir." acao="Salvar" onAcao={onFechar}>
      <Campo rotulo="Onde emite">
        {(id) => <CampoEscolha id={id} valor={emissor} onMudar={setEmissor} opcoes={[nfseEscritorio.emissor, 'Prefeitura de São Paulo (NFS-e paulistana)', 'Integrador (Focus NFe)'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
      <Campo rotulo="Código do serviço">{(id) => <CampoTexto id={id} valor={codigo} onMudar={setCodigo} />}</Campo>
      <Campo rotulo="Certificado">{() => <p className="text-sm">{nfseEscritorio.certificado}</p>}</Campo>
      <Campo rotulo="Quando emitir">
        {() => (
          <Segmentado
            rotulo="Quando emitir"
            valor={envio}
            onMudar={setEnvio}
            opcoes={[
              { valor: 'junto', rotulo: 'Com a cobrança' },
              { valor: 'apos_pagamento', rotulo: 'Após o pagamento' },
              { valor: 'manual', rotulo: 'À mão' },
            ]}
          />
        )}
      </Campo>
      <Interruptor ligado={retencao} onMudar={setRetencao} rotulo="Destacar retenções do contrato" detalhe="IRRF, CSRF e ISS de cada cliente vêm do contrato; o líquido cobrado já desconta." />
    </GavetaFormulario>
  )
}

/** Um passo da régua de cobrança (GES-004). */
export function EditarPassoRegua({ p, onFechar, onSalvar, onExcluir }: Fechar & { p?: PassoRegua; onSalvar: (p: PassoRegua) => void; onExcluir?: () => void }) {
  const [d, setD] = useState<PassoRegua>(p ?? { id: `p${Date.now()}`, quando: '', dias: 15, canal: 'WhatsApp', tom: 'firme', texto: '', ativo: true })
  const quando = d.dias < 0 ? `${-d.dias} dias antes` : d.dias === 0 ? 'no vencimento' : `${d.dias} dias depois`
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo={p ? 'Editar passo da régua' : 'Novo passo da régua'}
      descricao="Vale para todos os clientes; quem está em acordo ou contestou sai da régua até resolver."
      acao="Salvar"
      acaoDesabilitada={!d.texto.trim()}
      onAcao={() => onSalvar({ ...d, quando })}
      secundaria={
        onExcluir ? (
          <Button type="button" variant="ghost" className="text-destructive rounded-full" onClick={onExcluir}>
            <TrashIcon /> Excluir
          </Button>
        ) : undefined
      }
    >
      <Campo rotulo={`Quando: ${quando}`}>{(id) => <input id={id} type="range" min={-7} max={45} value={d.dias} onChange={(e) => setD({ ...d, dias: Number(e.target.value) })} className="accent-foreground w-full" />}</Campo>
      <Campo rotulo="Canal">{(id) => <CampoEscolha id={id} valor={d.canal} onMudar={(v) => setD({ ...d, canal: v })} opcoes={(['WhatsApp', 'e-mail', 'WhatsApp e e-mail', 'app'] as const).map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
      <Campo rotulo="Tom">
        {() => (
          <Segmentado
            rotulo="Tom"
            valor={d.tom}
            onMudar={(v) => setD({ ...d, tom: v })}
            opcoes={[
              { valor: 'lembrete', rotulo: 'Lembrete' },
              { valor: 'cordial', rotulo: 'Cordial' },
              { valor: 'firme', rotulo: 'Firme' },
              { valor: 'formal', rotulo: 'Formal' },
            ]}
          />
        )}
      </Campo>
      <Campo rotulo="Mensagem" ajuda="Variáveis: {{contato}}, {{competencia}}, {{vencimento}}, {{valor}}, {{link_2via}}. A 2ª via sempre vai com juros e multa atualizados.">
        {(id) => <CampoArea id={id} valor={d.texto} onMudar={(v) => setD({ ...d, texto: v })} />}
      </Campo>
      <Interruptor ligado={d.ativo} onMudar={(v) => setD({ ...d, ativo: v })} rotulo="Passo ativo" />
    </GavetaFormulario>
  )
}

/** Política de inadimplência (FIN-009, GES-005, GES-006). */
export function PoliticaInadimplencia({ onFechar }: Fechar) {
  const [d, setD] = useState(politicaInadimplencia)
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Política de inadimplência"
      descricao="O que acontece, e quando, com quem não paga. Documentos e obrigações em curso nunca são retidos: só extras e pedidos novos pausam."
      acao="Salvar"
      onAcao={onFechar}
    >
      <Campo rotulo={`Pausar extras e pedidos novos no app após ${d.pausarExtrasApos} dias`}>
        {(id) => <input id={id} type="range" min={15} max={90} step={5} value={d.pausarExtrasApos} onChange={(e) => setD({ ...d, pausarExtrasApos: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <Campo rotulo={`Suspensão escalonada após ${d.suspenderApos} dias`} ajuda="Aviso formal com prazo antes; reativa sozinho quando o pagamento compensa.">
        {(id) => <input id={id} type="range" min={30} max={120} step={5} value={d.suspenderApos} onChange={(e) => setD({ ...d, suspenderApos: Number(e.target.value) })} className="accent-foreground w-full" />}
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Juros">{(id) => <CampoTexto id={id} valor={d.juros} onMudar={(v) => setD({ ...d, juros: v })} />}</Campo>
        <Campo rotulo="Multa">{(id) => <CampoTexto id={id} valor={d.multa} onMudar={(v) => setD({ ...d, multa: v })} />}</Campo>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo={`Desconto máximo no acordo: ${d.descontoMaxAcordo}%`}>
          {(id) => <input id={id} type="range" min={0} max={30} value={d.descontoMaxAcordo} onChange={(e) => setD({ ...d, descontoMaxAcordo: Number(e.target.value) })} className="accent-foreground w-full" />}
        </Campo>
        <Campo rotulo={`Até ${d.parcelasMax} parcelas`}>
          {(id) => <input id={id} type="range" min={1} max={12} value={d.parcelasMax} onChange={(e) => setD({ ...d, parcelasMax: Number(e.target.value) })} className="accent-foreground w-full" />}
        </Campo>
      </div>
      <Campo rotulo="Quem aprova acordo fora desses limites">
        {(id) => <CampoEscolha id={id} valor={d.alcadaAcordo} onMudar={(v) => setD({ ...d, alcadaAcordo: v })} opcoes={['Gestor com o setor Financeiro', 'Administrador'].map((x) => ({ valor: x, rotulo: x }))} />}
      </Campo>
    </GavetaFormulario>
  )
}

/** Conectar conta por Open Finance (FIN-004). */
export function ConectarConta({ onFechar, onConectar }: Fechar & { onConectar: (nome: string) => void }) {
  const passos = ['Banco', 'Consentimento', 'Contas', 'Pronto']
  const [passo, setPasso] = useState(0)
  const [banco, setBanco] = useState('Bradesco')
  const [ok, setOk] = useState(false)
  const [contas, setContas] = useState(['conta corrente PJ'])
  const ultimo = passo === passos.length - 1
  return (
    <GavetaFormulario
      aberta
      onFechar={onFechar}
      titulo="Conectar conta do escritório"
      descricao="Extrato e saldo pelo Open Finance, só leitura. Pagamentos continuam no banco, com a aprovação daqui."
      acao={ultimo ? 'Concluir' : 'Continuar'}
      acaoDesabilitada={passo === 1 && !ok}
      onAcao={() => (ultimo ? onConectar(`${banco} PJ`) : setPasso((p) => p + 1))}
    >
      <Passos passos={passos} atual={passo} />
      {passo === 0 && (
        <Campo rotulo="Banco">{(id) => <CampoEscolha id={id} valor={banco} onMudar={setBanco} opcoes={['Bradesco', 'Banco do Brasil', 'Caixa', 'Santander', 'Sicoob', 'Nubank PJ'].map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
      )}
      {passo === 1 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">Você é levado ao {banco} para autorizar por 12 meses: saldos, extratos e faturas de cartão. Dá para revogar lá ou aqui.</p>
          <Button type="button" variant="outline" className="w-fit rounded-full" onClick={() => setOk(true)}>
            <BankIcon /> {ok ? 'Autorizado no banco' : `Autorizar no ${banco}`}
          </Button>
        </div>
      )}
      {passo === 2 && (
        <Campo rotulo="O que trazer">{() => <Fichas rotulo="Contas" valores={contas} onMudar={setContas} opcoes={['conta corrente PJ', 'conta de investimento', 'cartão empresarial'].map((x) => ({ valor: x, rotulo: x }))} />}</Campo>
      )}
      {passo === 3 && <p className="bg-success/10 rounded-[14px] px-3 py-2.5 text-sm">{banco} conectado. Os últimos 90 dias de extrato entram para conciliar; daqui em diante, atualiza 4 vezes ao dia.</p>}
    </GavetaFormulario>
  )
}

/** Plano de contas gerencial (FIN-004, FIN-006). */
export function PlanoContas({ onFechar }: Fechar) {
  const [plano, setPlano] = usePersistente('fin.cfg.plano', planoInicial)
  const [novo, setNovo] = useState<Record<string, string>>({})
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Plano de contas gerencial"
      descricao="As categorias da conciliação e da DRE. O centro de custo (setor) vem do contrato e do timesheet, não daqui."
      acao="Salvar"
      onAcao={onFechar}
    >
      {plano.map((g) => (
        <section key={g.grupo} className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{g.grupo}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {g.categorias.map((c) => (
              <li key={c} className="bg-sunken/70 flex items-center gap-1 rounded-full py-1 pr-1 pl-3 text-xs">
                {c}
                <button
                  type="button"
                  aria-label={`Tirar ${c}`}
                  className="hover:bg-raised cursor-pointer rounded-full p-1"
                  onClick={() => setPlano((xs) => xs.map((x) => (x.grupo === g.grupo ? { ...x, categorias: x.categorias.filter((y) => y !== c) } : x)))}
                >
                  <TrashIcon className="size-3" />
                </button>
              </li>
            ))}
          </ul>
          <span className="flex gap-2">
            <CampoTexto valor={novo[g.grupo] ?? ''} onMudar={(v) => setNovo({ ...novo, [g.grupo]: v })} placeholder={`Nova categoria em ${g.grupo}`} className="flex-1" />
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={!novo[g.grupo]?.trim()}
              onClick={() => {
                setPlano((xs) => xs.map((x) => (x.grupo === g.grupo ? { ...x, categorias: [...x.categorias, novo[g.grupo].trim()] } : x)))
                setNovo({ ...novo, [g.grupo]: '' })
              }}
            >
              <PlusIcon /> Adicionar
            </Button>
          </span>
        </section>
      ))}
    </GavetaFormulario>
  )
}

/** Alçadas de aprovação das contas a pagar (FIN-003). */
export function Alcadas({ onFechar }: Fechar) {
  const [d, setD] = useState(alcadasIniciais)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Alçadas de aprovação" descricao="Quem aprova cada conta antes de pagar. O integrante Financeiro captura e classifica; pagar é sempre de uma pessoa." acao="Salvar" onAcao={onFechar}>
      {d.map((a, i) => (
        <div key={i} className="grid grid-cols-[7rem_1fr] items-end gap-3">
          <Campo rotulo={i === d.length - 1 ? 'Acima de' : 'Até'}>{(id) => <CampoTexto id={id} valor={a.ate} onMudar={(v) => setD((xs) => xs.map((x, k) => (k === i ? { ...x, ate: v } : x)))} />}</Campo>
          <Campo rotulo="Quem aprova">
            {(id) => (
              <CampoEscolha
                id={id}
                valor={a.quem}
                onMudar={(v) => setD((xs) => xs.map((x, k) => (k === i ? { ...x, quem: v } : x)))}
                opcoes={['Gestor com o setor Financeiro', 'Administrador', 'Administrador + segundo sócio'].map((x) => ({ valor: x, rotulo: x }))}
              />
            )}
          </Campo>
        </div>
      ))}
    </GavetaFormulario>
  )
}

/** Trazer o financeiro atual (FIN-014, FIN-601 a 603). */
export function ImportarFinanceiro({ onFechar }: Fechar) {
  const passos = ['Origem', 'Arquivos', 'Conferir', 'Virada']
  const [passo, setPasso] = useState(0)
  const [origem, setOrigem] = useState<string>(importacaoOrigens[0])
  const [enviado, setEnviado] = useState(false)
  const [data, setData] = useState('01/12/2026')
  const ultimo = passo === passos.length - 1
  return (
    <GavetaFormulario
      aberta
      largura="lg"
      onFechar={onFechar}
      titulo="Trazer o financeiro atual"
      descricao="Contratos, cobranças em aberto, histórico e autorizações de débito. Nada é cobrado em dobro: as recorrências da origem são encerradas na data da virada."
      acao={ultimo ? 'Agendar virada' : 'Continuar'}
      acaoDesabilitada={passo === 1 && !enviado}
      onAcao={() => (ultimo ? onFechar() : setPasso((p) => p + 1))}
      secundaria={
        passo > 0 ? (
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => setPasso((p) => p - 1)}>
            Voltar
          </Button>
        ) : undefined
      }
    >
      <Passos passos={passos} atual={passo} />
      {passo === 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {importacaoOrigens.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={origem === o}
              onClick={() => setOrigem(o)}
              className={cn('cursor-pointer rounded-[14px] px-3 py-3 text-left text-sm', origem === o ? 'bg-raised shadow-cartao ring-foreground/30 ring-2' : 'bg-sunken/60')}
            >
              {o}
            </button>
          ))}
        </div>
      )}
      {passo === 1 && (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-muted-foreground">{origem.startsWith('Planilha') ? 'Baixe o modelo, preencha e envie.' : `No ${origem}, exporte "clientes", "contratos ou vendas recorrentes" e "contas a receber" em CSV ou Excel.`}</p>
          <Button type="button" variant="outline" className="w-fit rounded-full" onClick={() => setEnviado(true)}>
            <FileArrowUpIcon /> {enviado ? '3 arquivos enviados' : 'Enviar arquivos'}
          </Button>
        </div>
      )}
      {passo === 2 && (
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="text-success size-4" weight="fill" /> 139 clientes casados pelo CNPJ ou CPF
          </li>
          <li className="flex items-center gap-2">
            <WarningIcon className="text-warning size-4" weight="fill" /> 3 sem casamento: entram como tarefa para você escolher o cliente
          </li>
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="text-success size-4" weight="fill" /> 137 contratos: itens, valor, vencimento e índice
          </li>
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="text-success size-4" weight="fill" /> Em aberto na origem: R$ 9.420,00 em 9 títulos; aqui: R$ 9.420,00
          </li>
        </ul>
      )}
      {passo === 3 && (
        <>
          <Campo rotulo="Data da virada" ajuda="Daí em diante, as cobranças saem daqui. Os títulos já emitidos na origem seguem lá até a baixa.">
            {(id) => <CampoTexto id={id} valor={data} onMudar={setData} />}
          </Campo>
          <p className="bg-sunken/60 rounded-[14px] px-3 py-2.5 text-sm">Na véspera, o integrante Financeiro prepara a lista de recorrências a encerrar no {origem}; você confirma e ele encerra.</p>
        </>
      )}
    </GavetaFormulario>
  )
}

/** Exportar do Financeiro. */
export function ExportarFin({ onFechar }: Fechar) {
  const [o, setO] = useState('contratos')
  const [formato, setFormato] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx')
  const [pronto, setPronto] = useState(false)
  return (
    <GavetaFormulario aberta onFechar={onFechar} titulo="Exportar" acao={pronto ? 'Fechar' : 'Gerar arquivo'} onAcao={() => (pronto ? onFechar() : setPronto(true))}>
      <Campo rotulo="O quê">
        {(id) => (
          <CampoEscolha
            id={id}
            valor={o}
            onMudar={setO}
            opcoes={[
              { valor: 'contratos', rotulo: 'Contratos e itens' },
              { valor: 'faturas', rotulo: 'Faturas e recebimentos' },
              { valor: 'caixa', rotulo: 'Extrato conciliado' },
              { valor: 'dre', rotulo: 'DRE gerencial' },
              { valor: 'informe', rotulo: 'Informes de retenção (anual)' },
            ]}
          />
        )}
      </Campo>
      <Campo rotulo="Formato">
        {() => (
          <Segmentado
            rotulo="Formato"
            valor={formato}
            onMudar={setFormato}
            opcoes={[
              { valor: 'xlsx', rotulo: 'Excel' },
              { valor: 'csv', rotulo: 'CSV' },
              { valor: 'pdf', rotulo: 'PDF' },
            ]}
          />
        )}
      </Campo>
      {pronto && (
        <p className="bg-success/10 flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm">
          <DownloadSimpleIcon className="size-4" /> {o}.{formato} pronto para baixar.
        </p>
      )}
    </GavetaFormulario>
  )
}
