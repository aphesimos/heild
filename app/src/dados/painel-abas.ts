import { contratos, totalContrato } from './financeiro'
/**
 * Dados das cinco abas do Painel desenhadas como widgets depois de Fiscal,
 * Contábil e DP (03, seção 6): Clientes e Societário, Obrigações e Prazos,
 * Notas fiscais, Consultoria e Reforma, Gestão. Fictícios, coerentes com o
 * resto (Metalúrgica Andrade é o cliente de exemplo).
 */

export type Situacao = 'ok' | 'atencao' | 'erro' | 'neutro'

/** Clientes e Societário (03, 6.1). */
export const societarioDetalhe = {
  /** Linha de versões do perfil (SOC-034). */
  versoes: [
    { desde: '01/01/2026', motivo: 'Mudança para Lucro Presumido', atual: true },
    { desde: '14/06/2024', motivo: '3ª alteração contratual · endereço da filial', atual: false },
    { desde: '02/03/2021', motivo: 'Abertura', atual: false },
  ],
  divergencia: { campo: 'CNAE secundário', receita: '2512-8/00', cadastro: 'não informado' },
  pessoas: [
    { nome: 'Marcos Andrade', papel: 'Sócio administrador · 60%', app: 'aprovador', optin: true },
    { nome: 'Helena Andrade', papel: 'Sócia · 40%', app: 'leitura', optin: true },
    { nome: 'Rita Campos', papel: 'Financeiro · contato de guias e notas', app: 'envia documentos', optin: true },
    { nome: 'Paulo Nunes', papel: 'RH · contato de folha', app: 'sem acesso', optin: false },
  ],
  acessos: [
    { orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '12/2027', situacao: 'ok' as Situacao },
    { orgao: 'SEFAZ SP', servico: 'Posto Fiscal Eletrônico', validade: 'sem validade', situacao: 'ok' as Situacao },
    { orgao: 'DET', servico: 'Domicílio Eletrônico Trabalhista', validade: 'pendente', situacao: 'atencao' as Situacao },
    { orgao: 'Prefeitura SP', servico: 'Senha web · NFS-e', validade: 'sem validade', situacao: 'ok' as Situacao },
    { orgao: 'gov.br', servico: 'Conta prata do sócio', validade: 'confirmada', situacao: 'ok' as Situacao },
  ],
  certificados: [
    { tipo: 'e-CNPJ A1', titular: 'Metalúrgica Andrade', validade: '11/12/2026', dias: 23, usos: 'e-CAC, SEFAZ, NF-e' },
    { tipo: 'e-CPF A3', titular: 'Marcos Andrade', validade: '29/08/2027', dias: 284, usos: 'assinatura de atos' },
  ],
  contrato: { honorario: 'R$ 7.500,00/mês', reajuste: 'INPC em janeiro', proposta: 'aceita em 12/2025', contrato: 'assinado', lgpd: 'assinado', vencimento: 'dia 20' },
  processos: [
    { orgao: 'JUCESP', processo: '4ª alteração contratual · entrada de sócio', etapa: 'em exigência: falta a assinatura de Helena', prazo: 'responder até 21/11', situacao: 'atencao' as Situacao },
    { orgao: 'Prefeitura de Guarulhos', processo: 'Alvará de funcionamento da filial', etapa: 'protocolado', prazo: 'sem prazo', situacao: 'neutro' as Situacao },
    { orgao: 'Bombeiros', processo: 'AVCB da matriz', etapa: 'vence em 03/2027', prazo: 'renovar em 01/2027', situacao: 'ok' as Situacao },
  ],
  ciclo: { estados: ['Prospecção', 'Implantação', 'Ativo', 'Em saída', 'Encerrado'], atual: 2, marcos: ['Contrato em 12/2025', 'Implantação concluída em 02/2026', 'Paralelo encerrado em 04/2026'] },
  carteira: {
    certificados: [
      { cliente: 'Metalúrgica Andrade Ltda', tipo: 'e-CNPJ A1', dias: 23 },
      { cliente: 'Padaria Pão Quente ME', tipo: 'e-CNPJ A1', dias: 9 },
      { cliente: 'Clínica Sorriso Ltda', tipo: 'e-CNPJ A1', dias: 3 },
      { cliente: 'Transportes Rota Sul S.A.', tipo: 'e-CNPJ A3', dias: 61 },
    ],
    estados: [
      { estado: 'Prospecção', n: 3 },
      { estado: 'Implantação', n: 1 },
      { estado: 'Ativo', n: 5 },
      { estado: 'Em saída', n: 0 },
    ],
  },
}

/** Obrigações e Prazos (03, 6.2). */
export const obrigacoesDetalhe = {
  calendario: [
    { obrigacao: 'DCTFWeb 10/2026', setor: 'Fiscal', legal: '14/11', interno: '12/11', status: 'entregue', recibo: 'b7e1c04' },
    { obrigacao: 'EFD-Reinf 10/2026', setor: 'Fiscal', legal: '14/11', interno: '12/11', status: 'entregue', recibo: '91fa2d3' },
    { obrigacao: 'GIA-SP 10/2026', setor: 'Fiscal', legal: '18/11', interno: '16/11', status: 'em risco', recibo: undefined },
    { obrigacao: 'eSocial S-1299 10/2026', setor: 'DP', legal: '15/11', interno: '13/11', status: 'atrasada', recibo: undefined },
    { obrigacao: 'PIS/COFINS 10/2026', setor: 'Fiscal', legal: '25/11', interno: '21/11', status: 'pendente', recibo: undefined },
    { obrigacao: 'EFD-Contribuições 09/2026', setor: 'Fiscal', legal: '10/11', interno: '07/11', status: 'atrasada', recibo: undefined },
  ] as { obrigacao: string; setor: string; legal: string; interno: string; status: 'entregue' | 'pendente' | 'em risco' | 'atrasada'; recibo?: string }[],
  riscos: { hoje: 1, atrasadas: 2, emRisco: 1, multa: 'R$ 1.140,00' },
  prerequisitos: [
    { item: 'Certificado A1 válido', ok: true, detalhe: 'vence em 23 dias' },
    { item: 'Procuração e-CAC', ok: true, detalhe: 'até 12/2027' },
    { item: 'Procuração do DET', ok: false, detalhe: 'pedida há 6 dias' },
    { item: 'Notas de outubro completas', ok: false, detalhe: '3 compras sem XML' },
    { item: 'Folha de outubro fechada', ok: true, detalhe: 'DP · 05/11' },
  ],
  semRecibo: 2,
  prorrogacoes: [
    { regra: 'GIA-SP', mudanca: 'Sem mudança neste mês', quando: 'conferido hoje' },
    { regra: 'DeSTDA', mudanca: 'Prazo de 10/2026 prorrogado para 30/11 (Ajuste SINIEF)', quando: 'detectado em 05/11' },
  ],
  /** Carteira: obrigações da semana por cliente. */
  carteira: [
    { cliente: 'Metalúrgica Andrade Ltda', entregues: 2, pendentes: 3, risco: 1, atrasadas: 1 },
    { cliente: 'Padaria Pão Quente ME', entregues: 1, pendentes: 2, risco: 0, atrasadas: 0 },
    { cliente: 'Loja Bela Vista Eireli', entregues: 1, pendentes: 2, risco: 1, atrasadas: 0 },
    { cliente: 'Transportes Rota Sul S.A.', entregues: 5, pendentes: 4, risco: 0, atrasadas: 0 },
    { cliente: 'Clínica Sorriso Ltda', entregues: 0, pendentes: 3, risco: 1, atrasadas: 1 },
  ],
}

/** Notas fiscais (03, 6.3). */
export const notasDetalhe = {
  captura: [
    { item: 'CNPJs monitorados', valor: '2 (matriz e filial)', situacao: 'ok' as Situacao },
    { item: 'Inscrições estaduais', valor: 'SP 2 · ativas', situacao: 'ok' as Situacao },
    { item: 'Certificado', valor: 'A1 · vence em 23 dias', situacao: 'atencao' as Situacao },
    { item: 'autXML nas vendas', valor: 'escritório incluído', situacao: 'ok' as Situacao },
    { item: 'Última captura', valor: 'ontem 03:12 · NSU 18.442', situacao: 'ok' as Situacao },
  ],
  competencia: '10/2026',
  fluxos: [
    { tipo: 'Entradas (NF-e)', qtd: 214, fonte: 'SEFAZ · DF-e', paridade: 214 },
    { tipo: 'Serviços tomados (NFS-e)', qtd: 31, fonte: 'Padrão nacional', paridade: 30 },
    { tipo: 'Saídas (NF-e)', qtd: 167, fonte: 'SEFAZ · autXML', paridade: 167 },
  ],
  manifestacao: { semCiencia: 6, semConclusao: 4, prazo: 'conclusão até 01/12' },
  completude: [
    { item: 'Buracos na sequência de saídas', valor: 'nenhum', situacao: 'ok' as Situacao },
    { item: 'Compras sem XML (só no extrato)', valor: '3 · R$ 7.410,00', situacao: 'atencao' as Situacao },
    { item: 'Receita das notas × declarada', valor: 'R$ 1.284.300 × R$ 1.284.300', situacao: 'ok' as Situacao },
    { item: 'Notas canceladas fora do prazo', valor: '1', situacao: 'atencao' as Situacao },
  ],
  tributaria: [
    { nota: 'NF-e 4.512 · Aço Brasil', alerta: 'CST 060 com ICMS destacado', tipo: 'ICMS-ST' },
    { nota: 'NF-e 4.498 · Ferragens Sul', alerta: 'NCM 7308.90.10 sem benefício aplicado', tipo: 'NCM' },
    { nota: 'NF-e 9.120 · venda para MG', alerta: 'DIFAL não recolhido (consumidor final)', tipo: 'DIFAL' },
  ],
  lotes: [
    { lote: '10/2026 · entradas', situacao: 'enviado ao core', erros: 0 },
    { lote: '10/2026 · saídas', situacao: 'enviado ao core', erros: 0 },
    { lote: '10/2026 · serviços', situacao: '1 erro de layout', erros: 1 },
  ],
  carteira: [
    { cliente: 'Metalúrgica Andrade Ltda', ultima: 'ontem 03:12', entradas: 214, saidas: 167, situacao: 'ok' as Situacao },
    { cliente: 'Padaria Pão Quente ME', ultima: 'ontem 03:15', entradas: 88, saidas: 1290, situacao: 'ok' as Situacao },
    { cliente: 'Loja Bela Vista Eireli', ultima: 'há 3 dias', entradas: 41, saidas: 312, situacao: 'atencao' as Situacao },
    { cliente: 'Transportes Rota Sul S.A.', ultima: 'ontem 03:20', entradas: 602, saidas: 1840, situacao: 'ok' as Situacao },
    { cliente: 'Clínica Sorriso Ltda', ultima: 'ontem 03:18 · certificado vence em 3 dias', entradas: 58, saidas: 0, situacao: 'atencao' as Situacao },
  ],
}

/** Consultoria e Reforma (03, 6.7). */
export const consultoriaDetalhe = {
  perguntas: [
    { id: 'q1', pergunta: 'A filial de Guarulhos pode ter regime diferente da matriz?', canal: 'WhatsApp', quem: 'Marcos Andrade', status: 'rascunho pronto', quando: 'hoje 09:40' },
    { id: 'q2', pergunta: 'Vale a pena antecipar a distribuição de lucros antes de 2027?', canal: 'app', quem: 'Helena Andrade', status: 'enviada', quando: 'ontem' },
    { id: 'q3', pergunta: 'Crédito de PIS/COFINS sobre frete de compra', canal: 'e-mail', quem: 'Rita Campos', status: 'enviada', quando: '28/10' },
  ],
  pareceres: [
    { titulo: 'Fator R em 2027 e o efeito da Reforma', data: '05/11/2026', base: 'base de 04/11', citacoes: 4 },
    { titulo: 'Distribuição de lucros e a tributação de dividendos', data: '06/11/2026', base: 'base de 06/11', citacoes: 6 },
    { titulo: 'Crédito de PIS/COFINS sobre fretes', data: '29/10/2026', base: 'base de 28/10', citacoes: 3 },
  ],
  vigilancia: [
    { aviso: 'LC 214/2025: cronograma da CBS confirmado para 2027', impacto: 'muda preço de venda e crédito', nivel: 'atencao' as Situacao },
    { aviso: 'Lucro Presumido: receita dentro do limite com folga', impacto: 'nada a fazer', nivel: 'ok' as Situacao },
    { aviso: 'Dividendos acima de R$ 50 mil/mês passam a ter retenção', impacto: 'sócio recebe R$ 80 mil/mês', nivel: 'atencao' as Situacao },
  ],
  carteira: [
    { cliente: 'Metalúrgica Andrade Ltda', abertas: 1, avisos: 2 },
    { cliente: 'Padaria Pão Quente ME', abertas: 0, avisos: 1 },
    { cliente: 'Transportes Rota Sul S.A.', abertas: 2, avisos: 3 },
    { cliente: 'Carlos Menezes', abertas: 1, avisos: 0 },
  ],
}

/** Gestão (03, 6.8): visão do escritório; não muda com o cliente. */
export const gestaoDetalhe = {
  equipe: [
    { nome: 'Fernanda Lima', papel: 'Gestora', setores: 'Fiscal, Notas, DP, Contábil', clientes: 6, abertas: 9 },
    { nome: 'João Pereira', papel: 'Analista', setores: 'Contábil, Fiscal', clientes: 4, abertas: 14 },
    { nome: 'Ana Souza', papel: 'Analista', setores: 'DP', clientes: 3, abertas: 6 },
    { nome: 'Bruno Costa', papel: 'Assistente', setores: 'Societário', clientes: 5, abertas: 3 },
  ],
  /** Matriz de permissões calculada (GES-021). */
  abas: ['Societário', 'Obrigações', 'Notas', 'Fiscal', 'DP', 'Contábil', 'Gestão'],
  permissoes: [
    { nome: 'Fernanda Lima', niveis: ['E', 'E', 'E', 'E', 'E', 'E', 'E'] },
    { nome: 'João Pereira', niveis: ['L', 'E', 'L', 'E', '·', 'E', '·'] },
    { nome: 'Ana Souza', niveis: ['L', 'L', '·', '·', 'E', '·', '·'] },
    { nome: 'Bruno Costa', niveis: ['E', 'L', '·', '·', '·', '·', '·'] },
  ],
  produtividade: [
    { setor: 'Fiscal', feitas: 42, abertas: 11, atrasadas: 2 },
    { setor: 'Contábil', feitas: 31, abertas: 9, atrasadas: 0 },
    { setor: 'DP', feitas: 27, abertas: 6, atrasadas: 1 },
    { setor: 'Notas', feitas: 18, abertas: 3, atrasadas: 0 },
    { setor: 'Societário', feitas: 6, abertas: 4, atrasadas: 0 },
  ],
  semResposta: 5,
  ia: { sozinhos: 318, aprovados: 86, editados: 11, recusados: 3, custo: 'R$ 412,80', custoAnterior: 'R$ 398,10' },
  migracao: [
    { ferramenta: 'Domínio (escrita fiscal)', onda: 'Onda 2', paralelo: 'em paralelo desde 09/2026', criterio: '99,4% de paridade · meta 99,5%', pronto: false },
    { ferramenta: 'Planilhas de obrigações', onda: 'Onda 1', paralelo: 'encerrado em 04/2026', criterio: '100% das obrigações no calendário', pronto: true },
    { ferramenta: 'Captura antiga de XML', onda: 'Onda 1', paralelo: 'encerrado em 05/2026', criterio: 'paridade de 3 meses', pronto: true },
    { ferramenta: 'Folha (sistema atual)', onda: 'Onda 3', paralelo: 'começa em 01/2027', criterio: 'a medir', pronto: false },
  ],
}

type DetalheSocietario = typeof societarioDetalhe
type DetalheNotas = typeof notasDetalhe
const ok = 'ok' as Situacao
const atencao = 'atencao' as Situacao

/** Contrato do cliente, tirado do Financeiro (a mesma assinatura estruturada). */
function contratoDe(clienteId: string): DetalheSocietario['contrato'] {
  const nome = { c1: 'Metalúrgica Andrade Ltda', c2: 'Padaria Pão Quente ME', c3: 'Loja Bela Vista Eireli', c4: 'Clínica Sorriso Ltda', c5: 'Transportes Rota Sul S.A.', c6: 'Carlos Menezes' }[clienteId]
  const c = contratos.find((x) => x.cliente === nome)
  if (!c || !c.itens.length) return { honorario: 'não informado', reajuste: '—', proposta: '—', contrato: 'sem contrato estruturado', lgpd: 'pendente', vencimento: '—' }
  return {
    honorario: `${totalContrato(c).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês`,
    reajuste: `${c.indice} em ${c.dataBase}`,
    proposta: `aceita · v${c.versao}`,
    contrato: 'assinado',
    lgpd: 'assinado',
    vencimento: `dia ${c.vencimentoDia}`,
  }
}

const societarioPorCliente: Record<string, Partial<DetalheSocietario>> = {
  c2: {
    versoes: [
      { desde: '01/02/2026', motivo: 'Faixa de funcionários revista no contrato', atual: true },
      { desde: '10/05/2019', motivo: 'Abertura', atual: false },
    ],
    divergencia: undefined as unknown as DetalheSocietario['divergencia'],
    acessos: [
      { orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '05/2027', situacao: ok },
      { orgao: 'Prefeitura SP', servico: 'Senha web · NFS-e', validade: 'sem validade', situacao: ok },
    ],
    certificados: [{ tipo: 'e-CNPJ A1', titular: 'Padaria Pão Quente', validade: '27/11/2026', dias: 9, usos: 'e-CAC, NFC-e' }],
    processos: [],
  },
  c3: {
    versoes: [
      { desde: '05/05/2025', motivo: 'Contrato com faixa de 120 notas', atual: true },
      { desde: '22/09/2017', motivo: 'Abertura', atual: false },
    ],
    divergencia: { campo: 'Situação cadastral', receita: 'inapta (ECF 2025)', cadastro: 'ativa' },
    acessos: [{ orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '09/2027', situacao: ok }],
    certificados: [{ tipo: 'e-CNPJ A1', titular: 'Loja Bela Vista', validade: '25/04/2027', dias: 158, usos: 'e-CAC, NF-e' }],
    processos: [{ orgao: 'Receita Federal', processo: 'Regularizar inaptidão (entregar ECF 2025)', etapa: 'em preparo', prazo: 'até 20/11', situacao: atencao }],
  },
  c4: {
    versoes: [{ desde: '01/10/2026', motivo: 'Entrada no escritório (implantação)', atual: true }],
    divergencia: undefined as unknown as DetalheSocietario['divergencia'],
    acessos: [
      { orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '10/2027', situacao: ok },
      { orgao: 'Prefeitura SP', servico: 'Senha web · NFS-e', validade: 'pedida ao cliente', situacao: atencao },
    ],
    certificados: [{ tipo: 'e-CNPJ A1', titular: 'Clínica Sorriso', validade: '21/11/2026', dias: 3, usos: 'captura de notas, e-CAC' }],
    processos: [{ orgao: 'Contador anterior', processo: 'Entrega do acervo e balancete', etapa: 'aguardando', prazo: 'cobrado 3 vezes', situacao: atencao }],
  },
  c5: {
    versoes: [
      { desde: '01/03/2026', motivo: 'Filial em Caxias do Sul', atual: true },
      { desde: '01/01/2020', motivo: 'Lucro Real', atual: false },
    ],
    divergencia: undefined as unknown as DetalheSocietario['divergencia'],
    acessos: [
      { orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '03/2027', situacao: ok },
      { orgao: 'SEFAZ-RS', servico: 'Procuração', validade: '03/2027', situacao: ok },
    ],
    certificados: [{ tipo: 'e-CNPJ A3', titular: 'Transportes Rota Sul', validade: '18/01/2027', dias: 61, usos: 'e-CAC, CT-e, SPED' }],
    processos: [],
  },
  c7: {
    versoes: [{ desde: '15/03/2024', motivo: 'Abertura', atual: true }],
    divergencia: undefined as unknown as DetalheSocietario['divergencia'],
    acessos: [{ orgao: 'e-CAC', servico: 'Procuração eletrônica', validade: '03/2027', situacao: ok }],
    certificados: [{ tipo: 'e-CNPJ A1', titular: 'Café Central', validade: '31/08/2027', dias: 286, usos: 'NFC-e' }],
    processos: [],
  },
  c6: {
    versoes: [{ desde: '01/01/2026', motivo: 'Carnê-leão (aluguéis)', atual: true }],
    divergencia: undefined as unknown as DetalheSocietario['divergencia'],
    acessos: [{ orgao: 'gov.br', servico: 'Conta ouro do titular', validade: 'confirmada', situacao: ok }],
    certificados: [],
    processos: [],
  },
}

export function societarioDe(clienteId?: string): DetalheSocietario {
  return { ...societarioDetalhe, ...(clienteId ? { contrato: contratoDe(clienteId), ...societarioPorCliente[clienteId] } : {}) }
}

const notasPorCliente: Record<string, Partial<DetalheNotas>> = {
  c2: {
    captura: [
      { item: 'CNPJs monitorados', valor: '1', situacao: ok },
      { item: 'Certificado', valor: 'A1 · vence em 9 dias', situacao: atencao },
      { item: 'Última captura', valor: 'ontem 03:15', situacao: ok },
    ],
    fluxos: [
      { tipo: 'Entradas (NF-e)', qtd: 88, fonte: 'SEFAZ · DF-e', paridade: 88 },
      { tipo: 'Saídas (NFC-e)', qtd: 1290, fonte: 'SEFAZ · autXML', paridade: 1290 },
    ],
    completude: [
      { item: 'Receita das notas × declarada', valor: 'R$ 34.600 × R$ 31.480', situacao: atencao },
      { item: 'Notas canceladas', valor: '2 · aguardando o cliente', situacao: atencao },
    ],
    tributaria: [],
    lotes: [{ lote: '10/2026 · saídas', situacao: 'aguardando a correção do PGDAS-D', erros: 0 }],
  },
  c3: {
    captura: [
      { item: 'CNPJs monitorados', valor: '1', situacao: ok },
      { item: 'Última captura', valor: 'há 3 dias', situacao: atencao },
    ],
    fluxos: [
      { tipo: 'Entradas (NF-e)', qtd: 41, fonte: 'SEFAZ · DF-e', paridade: 38 },
      { tipo: 'Saídas (NF-e)', qtd: 168, fonte: 'SEFAZ · autXML', paridade: 168 },
    ],
    completude: [
      { item: 'Saídas acima da faixa do contrato', valor: '168 de 120', situacao: atencao },
      { item: 'Compras sem XML', valor: '3', situacao: atencao },
    ],
    tributaria: [],
    lotes: [],
  },
  c4: {
    captura: [
      { item: 'Certificado', valor: 'A1 · vence em 3 dias', situacao: atencao },
      { item: 'Última captura', valor: 'ontem 03:18', situacao: ok },
    ],
    fluxos: [{ tipo: 'Serviços prestados (NFS-e)', qtd: 58, fonte: 'Prefeitura SP', paridade: 58 }],
    completude: [{ item: 'ISS retido pelos tomadores', valor: '12 notas', situacao: ok }],
    tributaria: [],
    lotes: [],
  },
  c5: {
    captura: [
      { item: 'CNPJs monitorados', valor: '2 (matriz e filial)', situacao: ok },
      { item: 'Última captura', valor: 'ontem 03:20', situacao: ok },
    ],
    fluxos: [
      { tipo: 'Entradas (NF-e)', qtd: 602, fonte: 'SEFAZ · DF-e', paridade: 602 },
      { tipo: 'CT-e emitidos', qtd: 1840, fonte: 'SEFAZ-RS', paridade: 1839 },
    ],
    completude: [{ item: 'CT-e 0912 sob intimação', valor: 'tarefa FIS-038', situacao: atencao }],
    tributaria: [{ nota: 'CT-e 0912 · Porto Alegre → Curitiba', alerta: 'base do ICMS questionada pela SEFAZ-RS', tipo: 'ICMS' }],
    lotes: [{ lote: '10/2026 · CT-e', situacao: 'enviado ao core', erros: 0 }],
  },
  c7: { captura: [{ item: 'Última captura', valor: 'ontem 03:16', situacao: ok }], fluxos: [{ tipo: 'Saídas (NFC-e)', qtd: 620, fonte: 'SEFAZ · autXML', paridade: 620 }], completude: [], tributaria: [], lotes: [] },
  c6: { captura: [{ item: 'Pessoa física', valor: 'sem captura de notas', situacao: ok }], fluxos: [], completude: [], tributaria: [], lotes: [] },
}

export function notasDe(clienteId?: string): DetalheNotas {
  return { ...notasDetalhe, ...(clienteId ? notasPorCliente[clienteId] : {}) }
}
