import type { SetorIntegrante } from '@/theme/tipos'

/**
 * Configuração das abas internas do Painel (subplano 03, seções 5 e 6).
 * Cada aba repete a mesma anatomia (A a G); aqui ficam só o que muda por aba.
 * Dados fictícios, coerentes com o Início (Metalúrgica Andrade, Padaria Pão Quente...).
 */

export type NivelAcao = 'preparar' | 'executar com aprovação' | 'executar'

export interface CampoPerfil {
  rotulo: string
  valor: string
  /** Destaque de alerta (ex.: sublimite perto do teto). */
  alerta?: boolean
}

export interface BlocoAbaCfg {
  titulo: string
  /** IDs do mapa, como no subplano ("SOC-001, 002 (S)"). */
  atividades: string
  descricao: string
}

export interface AcaoCfg {
  rotulo: string
  nivel: NivelAcao
  /** Pré-requisito faltando: o botão vira "falta X" (03, 6.4). */
  falta?: string
}

export interface PendenciaSetor {
  id: string
  item: string
  desde: string
  cobrancas: number
  /** Pendência de terceiro (órgão), em vez do cliente. */
  orgao?: string
}

export interface DocumentoAba {
  id: string
  nome: string
  tipo: string
  competencia: string
  origem: 'app' | 'e-mail' | 'WhatsApp' | 'captura' | 'integrante' | 'nuvem'
  enviadoPor: string
  hash: string
  visivelNoApp: boolean
  pasta: string
}

export interface AbaPainel {
  id: string
  rotulo: string
  setor: SetorIntegrante
  /** O que o integrante do setor está fazendo para o cliente (integrante.status). */
  statusIntegrante: string
  perfil: CampoPerfil[]
  vigencia: string
  /** Faixa de aviso no cabeçalho (ex.: divergência com a Receita). */
  faixa?: string
  blocos: BlocoAbaCfg[]
  acoes: AcaoCfg[]
  pendencias: PendenciaSetor[]
  documentos: DocumentoAba[]
  relatorios: string[]
}

const doc = (id: string, nome: string, tipo: string, competencia: string, origem: DocumentoAba['origem'], enviadoPor: string, visivelNoApp: boolean, pasta: string): DocumentoAba => ({
  id,
  nome,
  tipo,
  competencia,
  origem,
  enviadoPor,
  hash: id.padEnd(7, 'a3f9c2e').slice(0, 7),
  visivelNoApp,
  pasta,
})

export const abasPainel: AbaPainel[] = [
  {
    id: 'societario',
    rotulo: 'Clientes e Societário',
    setor: 'societario',
    statusIntegrante: 'Conferiu o cadastro na Receita hoje às 06:10; tudo igual.',
    perfil: [
      { rotulo: 'Situação', valor: 'Ativo' },
      { rotulo: 'Natureza', valor: 'Sociedade limitada' },
      { rotulo: 'Sócios', valor: '2' },
      { rotulo: 'Certificado A1', valor: 'vence em 23 dias', alerta: true },
      { rotulo: 'Procuração e-CAC', valor: 'confirmada' },
    ],
    vigencia: 'perfil vigente desde 01/01/2026',
    blocos: [
      { titulo: 'Ficha e perfil temporal', atividades: 'SOC-001, 002, 003, 034', descricao: 'Versão vigente e linha de versões; divergência Receita × cadastro' },
      { titulo: 'Pessoas e identidades', atividades: 'SOC-004, GES-041', descricao: 'Sócios, contatos por assunto, papel no app, opt-in' },
      { titulo: 'Acessos e procurações', atividades: 'SOC-011 a 014, PF-002', descricao: 'Órgão, serviço, validade, situação' },
      { titulo: 'Certificados', atividades: 'SOC-008, 009, 010', descricao: 'Tipo, validade, serviços, trilha de uso; nunca mostra o arquivo' },
      { titulo: 'Contratos e honorários', atividades: 'SOC-015, 016, 019, 020', descricao: 'Proposta, contrato, termo LGPD, honorário' },
      { titulo: 'Legalização e processos', atividades: 'SOC-025 a 043', descricao: 'Processos por órgão, exigências, licenças, atas' },
      { titulo: 'Ciclo de vida', atividades: 'CIC-001 a 010', descricao: 'Estado, trilha de entrada e saída, marcos' },
    ],
    acoes: [
      { rotulo: 'Versionar perfil', nivel: 'executar com aprovação' },
      { rotulo: 'Gerar proposta e contrato', nivel: 'preparar' },
      { rotulo: 'Pedir certificado A1 pelo app', nivel: 'executar' },
      { rotulo: 'Mudar estado do cliente', nivel: 'executar com aprovação' },
    ],
    pendencias: [{ id: 'ps1', item: 'Renovação do certificado A1', desde: 'há 4 dias', cobrancas: 1 }],
    documentos: [
      doc('s1', 'Contrato social · 3ª alteração', 'contrato social', '2026', 'nuvem', 'Fernanda Lima', true, 'Societário/Atos'),
      doc('s2', 'Cartão CNPJ', 'cadastro', '11/2026', 'integrante', 'Societário (integrante)', true, 'Societário/Cadastro'),
    ],
    relatorios: ['Certificados a vencer', 'Procurações por situação', 'Clientes por estado do ciclo de vida'],
  },
  {
    id: 'obrigacoes',
    rotulo: 'Obrigações e Prazos',
    setor: 'fiscal',
    statusIntegrante: 'Gerou o calendário de novembro; 11 obrigações, 2 em risco.',
    perfil: [
      { rotulo: 'Regime', valor: 'Lucro Presumido' },
      { rotulo: 'UF', valor: 'SP' },
      { rotulo: 'Obrigações em 11/2026', valor: '11' },
      { rotulo: 'Em risco', valor: '2', alerta: true },
    ],
    vigencia: 'regras vigentes em 11/2026',
    blocos: [
      { titulo: 'Calendário por cliente', atividades: 'FIS-001, 003', descricao: 'Prazo legal, interno, status, recibo, setor' },
      { titulo: 'Atrasos e riscos', atividades: 'FIS-047', descricao: 'Vence hoje, atrasado, em risco, multa estimada' },
      { titulo: 'Pré-requisitos da semana', atividades: 'FIS-046', descricao: 'Certificado, procuração, gov.br, documentos' },
      { titulo: 'Comprovação', atividades: 'FIS-003, 023', descricao: 'Recibo por obrigação com hash; obrigações sem recibo' },
      { titulo: 'Regras por UF e prorrogações', atividades: 'FIS-002, 024', descricao: 'Declarações estaduais; mudanças de prazo detectadas' },
    ],
    acoes: [
      { rotulo: 'Gerar calendário do mês', nivel: 'executar' },
      { rotulo: 'Reprogramar prazo interno', nivel: 'executar' },
    ],
    pendencias: [{ id: 'po1', item: 'Procuração do DET', desde: 'há 6 dias', cobrancas: 2 }],
    documentos: [doc('o1', 'Recibo DCTFWeb 10/2026', 'recibo', '10/2026', 'captura', 'Fiscal (integrante)', false, 'Fiscal/Recibos')],
    relatorios: ['Obrigação × cliente do mês', 'Entregues × pendentes por setor', 'Multas estimadas'],
  },
  {
    id: 'notas',
    rotulo: 'Notas fiscais',
    setor: 'notas',
    statusIntegrante: 'Captura ok ontem 03:12 · NSU 18.442 · 412 XMLs em outubro.',
    perfil: [
      { rotulo: 'Captura', valor: 'ok ontem 03:12' },
      { rotulo: 'NSU', valor: '18.442' },
      { rotulo: 'XMLs 10/2026', valor: '412' },
      { rotulo: 'Divergências', valor: '3', alerta: true },
    ],
    vigencia: 'configuração de captura desde 03/2026',
    blocos: [
      { titulo: 'Configuração de captura', atividades: 'NFE-001, 003, 503, 504', descricao: 'CNPJs, IEs, certificado, autXML, situação diária' },
      { titulo: 'Captura de entradas, serviços e saídas', atividades: 'NFE-004 a 013', descricao: 'Por competência e fonte; paridade com a ferramenta antiga' },
      { titulo: 'Manifestação', atividades: 'NFE-014, 015, 016', descricao: 'Resumos sem ciência, notas sem conclusão' },
      { titulo: 'Completude e conferência', atividades: 'NFE-020 a 035', descricao: 'Buracos de sequência, compras sem XML, receita × declarada' },
      { titulo: 'Conferência tributária', atividades: 'NFE-023 a 027', descricao: 'NCM, CST, CFOP, ST, DIFAL, ISS' },
      { titulo: 'Envio ao core e guarda', atividades: 'NFE-033, 034, 036', descricao: 'Lotes por competência, erros, pacote de guarda' },
    ],
    acoes: [
      { rotulo: 'Forçar captura', nivel: 'executar' },
      { rotulo: 'Manifestar evento conclusivo', nivel: 'executar com aprovação' },
      { rotulo: 'Orientar cliente sobre autXML', nivel: 'preparar' },
    ],
    pendencias: [{ id: 'pn1', item: '3 notas de compra sem XML', desde: 'há 2 dias', cobrancas: 0 }],
    documentos: [doc('n1', 'Lote de XMLs 10/2026 (412)', 'lote XML', '10/2026', 'captura', 'Notas (integrante)', false, 'Notas/2026-10')],
    relatorios: ['Última captura por cliente', 'Divergências tributárias', 'Paridade com a ferramenta antiga'],
  },
  {
    id: 'fiscal',
    rotulo: 'Fiscal',
    setor: 'fiscal',
    statusIntegrante: 'Leu a caixa postal do e-CAC hoje às 06:30; nada novo para este cliente.',
    perfil: [
      { rotulo: 'Regime', valor: 'Lucro Presumido' },
      { rotulo: 'UF', valor: 'SP · IE ativa' },
      { rotulo: 'Inscrição municipal', valor: 'São Paulo' },
      { rotulo: 'Situação fiscal', valor: 'regular · CND até 12/01' },
    ],
    vigencia: 'perfil vigente desde 01/01/2026',
    blocos: [
      { titulo: 'Caixas postais', atividades: 'FIS-005, 026, 029', descricao: 'Mensagens novas, resumo, prazo de ciência, tarefa aberta' },
      { titulo: 'Situação fiscal', atividades: 'FIS-006, 027, 030, 008', descricao: 'RFB/PGFN atual × anterior, débitos estaduais' },
      { titulo: 'Simples e MEI', atividades: 'FIS-009 a 018', descricao: 'Receita segregada, PGDAS-D, DAS, sublimite, fator R' },
      { titulo: 'DCTFWeb, Reinf, federais, estaduais, municipais', atividades: 'FIS-019 a 028', descricao: 'Totalizadores, divergências, retenções, guias' },
      { titulo: 'Guias e pagamentos', atividades: 'FIS-031, 032, 034, 201', descricao: 'Central de guias: enviada, lida, paga' },
      { titulo: 'Certidões, malhas, intimações', atividades: 'FIS-036 a 040', descricao: 'Certidões e vencimentos; intimação com prazo' },
    ],
    acoes: [
      { rotulo: 'Conferir DCTFWeb 10/2026', nivel: 'preparar' },
      { rotulo: 'Transmitir DCTFWeb 10/2026', nivel: 'executar com aprovação', falta: 'conferência FIS-004' },
      { rotulo: 'Emitir certidão', nivel: 'executar' },
      { rotulo: 'Enviar guias ao cliente', nivel: 'executar com aprovação' },
    ],
    pendencias: [
      { id: 'pf1', item: 'Resposta à intimação 1234 (documentos do cliente)', desde: 'há 3 dias', cobrancas: 1 },
      { id: 'pf2', item: 'Processo de restituição', desde: 'há 21 dias', cobrancas: 0, orgao: 'Receita Federal' },
    ],
    documentos: [
      doc('f1', 'DARF IRPJ 3º trimestre', 'guia', '09/2026', 'integrante', 'Fiscal (integrante)', true, 'Fiscal/Guias'),
      doc('f2', 'Recibo DCTFWeb 09/2026', 'recibo', '09/2026', 'captura', 'Fiscal (integrante)', false, 'Fiscal/Recibos'),
      doc('f3', 'Intimação 1234 · e-CAC', 'intimação', '11/2026', 'captura', 'Fiscal (integrante)', false, 'Fiscal/Fiscalização'),
      doc('f4', 'Notas de serviço tomadas 10/2026', 'documento', '10/2026', 'app', 'Rita Campos (cliente)', true, 'Fiscal/Entradas'),
    ],
    relatorios: ['Resumo fiscal do mês', 'Guias enviadas × pagas', 'Certidões a vencer'],
  },
  {
    id: 'dp',
    rotulo: 'Trabalhista e DP',
    setor: 'dp',
    statusIntegrante: 'Abriu as 2 admissões da Metalúrgica pelo pedido do app; documentos pedidos.',
    perfil: [
      { rotulo: 'Empregados ativos', valor: '38' },
      { rotulo: 'Sindicato', valor: 'Metalúrgicos de SP' },
      { rotulo: 'Data-base', valor: 'novembro', alerta: true },
      { rotulo: 'Ponto', valor: 'eletrônico (REP-P)' },
    ],
    vigencia: 'CCT 2025/2026',
    blocos: [
      { titulo: 'Quadro de empregados', atividades: 'DP-056, 060, 045', descricao: 'Ativos por estabelecimento, cota, ponto' },
      { titulo: 'Admissão', atividades: 'DP-001 a 008', descricao: 'Pedidos em andamento, prazo do S-2200' },
      { titulo: 'Fechamento da folha', atividades: 'DP-009 a 015', descricao: 'Variáveis recebidas × esperadas, prévia aprovada' },
      { titulo: 'eSocial e DCTFWeb', atividades: 'DP-016, 017, 038, 039, 043, 057', descricao: 'Eventos pendentes e rejeitados; totalizadores' },
      { titulo: 'Guias, holerites, pagamento', atividades: 'DP-018 a 022', descricao: 'GFD, DARF, holerites com prova' },
      { titulo: 'Férias, afastamentos, SST', atividades: 'DP-023 a 025, 046 a 050', descricao: 'Períodos e dobra; atestados, CAT, PGR' },
      { titulo: 'Rescisão', atividades: 'DP-026 a 032', descricao: 'Prazo de 10 dias contado, TRCT, GFD rescisória' },
    ],
    acoes: [
      { rotulo: 'Gerar contrato de experiência', nivel: 'preparar' },
      { rotulo: 'Pedir variáveis da folha', nivel: 'executar' },
      { rotulo: 'Transmitir S-2200', nivel: 'executar com aprovação' },
    ],
    pendencias: [{ id: 'pd1', item: 'Documentos das 2 admissões (RG, CTPS, ASO)', desde: 'há 1 dia', cobrancas: 1 }],
    documentos: [doc('d1', 'Folha de ponto 10/2026', 'ponto', '10/2026', 'app', 'Carlos (RH do cliente)', true, 'DP/Ponto')],
    relatorios: ['Admissões e rescisões do mês', 'Férias a vencer', 'eSocial pendente'],
  },
  {
    id: 'contabil',
    rotulo: 'Contábil',
    setor: 'contabil',
    statusIntegrante: '10/26: coleta 80% · extratos ok · classificação 412/430 · conciliação pendente.',
    perfil: [
      { rotulo: 'Competência aberta', valor: '10/2026' },
      { rotulo: 'Contas bancárias', valor: '3 (Itaú, BB, Inter)' },
      { rotulo: 'Etapa', valor: 'classificação 412/430' },
      { rotulo: 'Fora do padrão', valor: '3', alerta: true },
    ],
    vigencia: 'lista do que deve chegar desde 01/2026',
    blocos: [
      { titulo: 'O que deve chegar e pendências', atividades: 'CTB-001, 002, 003, 005, 201', descricao: 'Lista mensal; chegou × falta; régua' },
      { titulo: 'Triagem e extratos', atividades: 'CTB-004, 007 a 014', descricao: 'Documentos com cliente e competência inferidos; extratos sem buracos' },
      { titulo: 'Classificação e de-para', atividades: 'CTB-006, 015, 016', descricao: 'Linhas com confiança; Pix e débitos sem nota' },
      { titulo: 'Conciliação', atividades: 'CTB-013, 018 a 022', descricao: 'Saldos de terceiros, impostos × fiscal × extrato' },
      { titulo: 'Fechamento', atividades: 'CTB-017, 024 a 027, 046, 047, 052', descricao: 'Etapas por cliente; lote ao core' },
      { titulo: 'Relatórios ao cliente e anuais', atividades: 'CTB-028 a 051', descricao: 'Balancete, DRE, ECD, ECF' },
    ],
    acoes: [
      { rotulo: 'Cobrar extratos', nivel: 'executar' },
      { rotulo: 'Perguntar ao cliente sobre Pix sem nota', nivel: 'preparar' },
      { rotulo: 'Enviar competência ao core', nivel: 'executar com aprovação' },
    ],
    pendencias: [{ id: 'pc1', item: 'Extrato Inter 10/2026', desde: 'há 6 dias', cobrancas: 2 }],
    documentos: [doc('c1', 'Extrato Itaú 10/2026', 'extrato', '10/2026', 'app', 'Rita Campos (cliente)', true, 'Contábil/Extratos')],
    relatorios: ['Clientes por etapa de fechamento', 'Balancete', 'DRE comparativa'],
  },
  {
    id: 'consultoria',
    rotulo: 'Consultoria e Reforma',
    setor: 'consultor',
    statusIntegrante: 'Nada novo na legislação que afete este cliente desde ontem.',
    perfil: [
      { rotulo: 'Perguntas abertas', valor: '1' },
      { rotulo: 'Pareceres enviados', valor: '4' },
      { rotulo: 'Reforma', valor: 'impacto estimado em 2027' },
    ],
    vigencia: 'base legal atualizada hoje',
    blocos: [
      { titulo: 'Perguntas técnicas', atividades: 'CON-001, 002', descricao: 'Por canal, cliente, status; rascunho sempre revisado por pessoa' },
      { titulo: 'Pareceres do cliente', atividades: 'CON-002', descricao: 'Enviados, com citação, data e versão da base' },
      { titulo: 'Vigilância e enquadramento', atividades: 'CON-004, 010', descricao: 'Avisos do Consultor: norma nova, fator R, sublimite' },
      { titulo: 'Simulações', atividades: 'fase 4', descricao: 'Disponível na fase 4' },
    ],
    acoes: [
      { rotulo: 'Pedir rascunho de parecer', nivel: 'preparar' },
      { rotulo: 'Revisar e enviar parecer', nivel: 'executar com aprovação' },
    ],
    pendencias: [],
    documentos: [doc('k1', 'Parecer · fator R em 2027', 'parecer', '11/2026', 'integrante', 'Consultor (integrante)', true, 'Consultoria/Pareceres')],
    relatorios: ['Perguntas por status', 'Pareceres enviados'],
  },
  {
    id: 'gestao',
    rotulo: 'Gestão',
    setor: 'gestao_atendimento',
    statusIntegrante: '5 conversas sem resposta há mais de 24 h; 3 no Fiscal.',
    perfil: [
      { rotulo: 'Equipe', valor: '9 pessoas' },
      { rotulo: 'Carteira', valor: '6 clientes' },
      { rotulo: 'Atrasadas', valor: '3', alerta: true },
      { rotulo: 'IA · aprovação sem edição', valor: '86%' },
    ],
    vigencia: 'dados de hoje',
    blocos: [
      { titulo: 'Equipe e carteira', atividades: 'GES-017, 018, 021', descricao: 'Usuários, papel, setores, carga por pessoa' },
      { titulo: 'Permissões', atividades: 'GES-021, 041', descricao: 'Matriz usuário × aba × nível efetivo (calculada)' },
      { titulo: 'Produtividade e atrasos', atividades: 'GES-047, 048', descricao: 'Tarefas por setor e pessoa; conversas sem resposta' },
      { titulo: 'Governança da IA', atividades: 'GES-056, 062', descricao: 'O que os integrantes fizeram sozinhos, taxa de aprovação, custo' },
      { titulo: 'Plano mestre de migração', atividades: 'GES-608', descricao: 'Por ferramenta antiga: onda, paralelo, critério medido' },
      { titulo: 'Relatórios consolidados e auditoria', atividades: 'GES-601 a 607', descricao: 'Os relatórios de cada aba lado a lado' },
    ],
    acoes: [
      { rotulo: 'Redistribuir carteira em lote', nivel: 'executar com aprovação' },
      { rotulo: 'Simular "o que Fulano vê?"', nivel: 'executar' },
    ],
    pendencias: [],
    documentos: [],
    relatorios: ['Produtividade por pessoa', 'Governança da IA', 'Auditoria de eventos'],
  },
]

/** Dados próprios da aba Fiscal desenhada por completo (03, 6.4). */
export const fiscalDetalhe = {
  simples: { receita12m: 'R$ 3.240.000', sublimite: 3600000, usado: 3240000, fatorR: 0.31, das: 'R$ 4.812,30', pgdas: 'preparado, aguardando conferência' },
  caixaPostal: [
    { id: 'cp1', orgao: 'e-CAC', assunto: 'Pendência na DCTFWeb 09/2026', recebida: '04/11', ciencia: 'prazo de ciência 19/11', tarefa: 'FIS-019' },
    { id: 'cp2', orgao: 'DEC SP', assunto: 'Comunicado sobre DIFAL', recebida: '02/11', ciencia: 'lida', tarefa: undefined },
  ],
  guias: [
    { id: 'g1', tributo: 'PIS/COFINS', competencia: '10/2026', valor: 'R$ 18.204,11', vencimento: '25/11', enviada: true, lida: true, paga: false },
    { id: 'g2', tributo: 'IRPJ/CSLL 3º tri', competencia: '09/2026', valor: 'R$ 41.870,00', vencimento: '31/10', enviada: true, lida: true, paga: true },
    { id: 'g3', tributo: 'ISS (a apurar · FIS-022)', competencia: '10/2026', valor: '—', vencimento: '20/11', enviada: false, lida: false, paga: false },
  ],
  /** Situação fiscal e certidões (FIS-006, 027, 030, 036). */
  situacao: [
    { orgao: 'Receita Federal / PGFN', atual: 'regular', anterior: 'regular', mudou: false },
    { orgao: 'SEFAZ SP', atual: '1 débito de ICMS', anterior: 'regular', mudou: true },
    { orgao: 'Prefeitura de São Paulo', atual: 'regular', anterior: 'regular', mudou: false },
  ],
  certidoes: [
    { nome: 'CND federal', validade: '14/02/2027', dias: 99 },
    { nome: 'CRF (FGTS)', validade: '02/12/2026', dias: 14 },
    { nome: 'CND estadual', validade: 'não emitida (débito)', dias: -1 },
  ],
  /** Visão de carteira: guias do mês por situação (FIS-034). */
  carteiraGuias: { enviadas: 64, lidas: 51, pagas: 38, vencidas: 3 },
}

/** Dados da aba Contábil desenhada (03, 6.6), competência 10/2026 da Metalúrgica Andrade. */
export const contabilDetalhe = {
  competencia: '10/2026',
  /** Etapas do fechamento (CTB-026), na ordem. */
  etapas: [
    { id: 'coleta', rotulo: 'Coleta', situacao: 'andamento', detalhe: '80% · falta extrato Inter' },
    { id: 'extratos', rotulo: 'Extratos', situacao: 'feito', detalhe: '3 contas sem buracos' },
    { id: 'classificacao', rotulo: 'Classificação', situacao: 'andamento', detalhe: '412 de 430 linhas' },
    { id: 'conciliacao', rotulo: 'Conciliação', situacao: 'pendente', detalhe: '3 diferenças abertas' },
    { id: 'core', rotulo: 'Envio ao core', situacao: 'pendente', detalhe: 'depois da conciliação' },
  ] as { id: string; rotulo: string; situacao: 'feito' | 'andamento' | 'pendente'; detalhe: string }[],
  /** O que deve chegar no mês (CTB-001, 002, 201). */
  deveChegar: [
    { item: 'Extrato Itaú', chegou: true, quando: 'app · 03/11' },
    { item: 'Extrato Banco do Brasil', chegou: true, quando: 'Open Finance · 01/11' },
    { item: 'Extrato Inter', chegou: false, quando: 'cobrado 2 vezes · há 6 dias' },
    { item: 'Notas de entrada e saída', chegou: true, quando: 'captura · 412 XMLs' },
    { item: 'Folha de outubro', chegou: true, quando: 'DP · 05/11' },
    { item: 'Comprovantes de despesas da diretoria', chegou: false, quando: 'cobrado 1 vez · há 3 dias' },
  ],
  /** Linhas a classificar (CTB-015, 016): confiança abaixo de 0,7 vem marcada. */
  linhas: [
    { id: 'l1', data: '04/10', descricao: 'PIX RECEBIDO JOSE R SILVA', valor: 'R$ 2.400,00', sugestao: 'Clientes · a identificar', confianca: 0.42 },
    { id: 'l2', data: '11/10', descricao: 'TAR PACOTE SERVICOS', valor: '-R$ 89,90', sugestao: 'Despesas bancárias', confianca: 0.96 },
    { id: 'l3', data: '15/10', descricao: 'PIX ENVIADO MARCOS ANDRADE', valor: '-R$ 15.000,00', sugestao: 'Conta corrente de sócio', confianca: 0.61 },
    { id: 'l4', data: '20/10', descricao: 'PAG BOLETO ACO BRASIL LTDA', valor: '-R$ 48.320,00', sugestao: 'Fornecedores · Aço Brasil', confianca: 0.93 },
    { id: 'l5', data: '28/10', descricao: 'TAR PACOTE SERVICOS', valor: '-R$ 89,90', sugestao: 'Despesas bancárias · duplicidade?', confianca: 0.55 },
  ],
  /** Conciliações (CTB-018 a 022). */
  conciliacoes: [
    { id: 'c1', conta: 'Impostos a recolher × fiscal × extrato', diferenca: 'R$ 0,00', ok: true },
    { id: 'c2', conta: 'Folha × contábil', diferenca: 'R$ 0,00', ok: true },
    { id: 'c3', conta: 'Fornecedores × títulos pagos', diferenca: 'R$ 1.230,00', ok: false },
    { id: 'c4', conta: 'Conta corrente de sócio', diferenca: 'R$ 15.000,00', ok: false },
    { id: 'c5', conta: 'Adquirentes (cartão) × vendas', diferenca: 'R$ 87,40', ok: false },
  ],
  /** Visão de carteira (CTB-026): clientes por etapa e analista. */
  carteira: [
    { cliente: 'Metalúrgica Andrade Ltda', analista: 'João Pereira', etapa: 'Classificação', parado: 'extrato Inter há 6 dias' },
    { cliente: 'Padaria Pão Quente ME', analista: 'João Pereira', etapa: 'Coleta', parado: 'aguardando extrato há 8 dias' },
    { cliente: 'Loja Bela Vista Eireli', analista: 'João Pereira', etapa: 'Conciliação', parado: undefined },
    { cliente: 'Transportes Rota Sul S.A.', analista: 'João Pereira', etapa: 'Envio ao core', parado: undefined },
    { cliente: 'Clínica Sorriso Ltda', analista: 'João Pereira', etapa: 'Balanço de abertura', parado: 'em implantação' },
  ],
}

/** Dados da aba Trabalhista e DP desenhada (03, 6.5), Metalúrgica Andrade. */
export const dpDetalhe = {
  quadro: {
    ativos: 38,
    estabelecimentos: [
      { nome: 'Matriz · São Paulo', ativos: 31 },
      { nome: 'Filial · Guarulhos', ativos: 7 },
    ],
    cotaPcd: { exigida: 0, tem: 1 },
    aprendizes: { exigida: 2, tem: 1 },
    ponto: 'REP-P · fechamento dia 25',
  },
  /** Admissões em andamento (DP-001 a 008), com o prazo do S-2200 contado. */
  admissoes: [
    {
      id: 'ad1',
      nome: 'Rafael Moura',
      cargo: 'Soldador',
      inicio: '23/11',
      prazoS2200: 'até 22/11',
      diasS2200: 4,
      etapas: [
        { rotulo: 'Dados', feito: true },
        { rotulo: 'Documentos', feito: false },
        { rotulo: 'ASO', feito: true },
        { rotulo: 'Contrato', feito: false, decisao: true },
        { rotulo: 'S-2200', feito: false },
      ],
    },
    {
      id: 'ad2',
      nome: 'Juliana Prado',
      cargo: 'Auxiliar administrativa',
      inicio: '23/11',
      prazoS2200: 'até 22/11',
      diasS2200: 4,
      etapas: [
        { rotulo: 'Dados', feito: true },
        { rotulo: 'Documentos', feito: true },
        { rotulo: 'ASO', feito: false },
        { rotulo: 'Contrato', feito: false, decisao: true },
        { rotulo: 'S-2200', feito: false },
      ],
    },
  ],
  /** Variáveis da folha de novembro: recebidas × esperadas (DP-009, 014). */
  variaveis: [
    { item: 'Horas extras', esperado: 'até 25/11', recebido: true },
    { item: 'Faltas e atrasos', esperado: 'até 25/11', recebido: true },
    { item: 'Comissões da equipe comercial', esperado: 'até 25/11', recebido: false },
    { item: 'Adiantamentos', esperado: 'até 20/11', recebido: true },
  ],
  previa: 'aguardando variáveis · prévia em 26/11',
  /** eSocial (DP-038, 039, 043). */
  esocial: [
    { evento: 'S-1200 · remuneração 10/2026', situacao: 'aceito' },
    { evento: 'S-2230 · afastamento de Carlos Lima', situacao: 'rejeitado', motivo: 'data de início anterior à admissão' },
    { evento: 'S-1299 · fechamento 10/2026', situacao: 'pendente' },
  ] as { evento: string; situacao: 'aceito' | 'rejeitado' | 'pendente'; motivo?: string }[],
  /** Férias e afastamentos (DP-023, 024, 046). */
  ferias: [
    { nome: 'Carlos Lima', detalhe: 'período vence em 28/12 · risco de dobra', dias: 41, alerta: true },
    { nome: 'Patrícia Gomes', detalhe: 'férias programadas de 01/12 a 20/12', dias: 17, alerta: false },
    { nome: 'Edson Ramos', detalhe: 'atestado de 3 dias recebido pelo app', dias: 0, alerta: false },
  ],
  /** Rescisões com prazo de 10 dias contado (DP-026 a 032). */
  rescisoes: [{ nome: 'Wagner Teles', motivo: 'pedido de demissão em 10/11', prazo: 'pagamento até 20/11', dias: 2 }],
  /** Visão de carteira: clientes por situação da folha. */
  carteira: [
    { cliente: 'Metalúrgica Andrade Ltda', empregados: 38, folha: 'aguardando variáveis', admissoes: 2 },
    { cliente: 'Padaria Pão Quente ME', empregados: 8, folha: 'admissões em curso', admissoes: 2 },
    { cliente: 'Loja Bela Vista Eireli', empregados: 4, folha: 'ponto recebido · fechando', admissoes: 0 },
    { cliente: 'Transportes Rota Sul S.A.', empregados: 112, folha: 'importada no core', admissoes: 0 },
  ],
}

type DetalheFiscal = typeof fiscalDetalhe
const guia = (id: string, tributo: string, competencia: string, valor: string, vencimento: string, enviada: boolean, lida: boolean, paga: boolean) => ({ id, tributo, competencia, valor, vencimento, enviada, lida, paga })
const regular = (orgaos: string[]) => orgaos.map((orgao) => ({ orgao, atual: 'regular', anterior: 'regular', mudou: false }))

/** Aba Fiscal por cliente: a Metalúrgica tem a ficha completa; os demais, o que cabe ao regime e ao momento de cada um. */
const fiscalPorCliente: Record<string, Partial<DetalheFiscal>> = {
  c2: {
    simples: { receita12m: 'R$ 1.120.000', sublimite: 3600000, usado: 1120000, fatorR: 0.22, das: 'R$ 4.812,30', pgdas: 'parado: receita R$ 3.120 abaixo das notas, aguardando o cliente' },
    caixaPostal: [{ id: 'cp1', orgao: 'DTE SP', assunto: 'Nenhuma mensagem nova', recebida: '06/11', ciencia: 'lida', tarefa: undefined }],
    guias: [
      guia('g1', 'DAS', '10/2026', 'R$ 4.812,30', '20/11', false, false, false),
      guia('g2', 'DAS', '09/2026', 'R$ 4.590,12', '20/10', true, true, true),
      guia('g3', 'FGTS Digital', '10/2026', 'R$ 2.104,00', '20/11', true, true, false),
    ],
    situacao: regular(['Receita Federal / PGFN', 'SEFAZ SP', 'Prefeitura de São Paulo']),
    certidoes: [
      { nome: 'CND federal', validade: '30/03/2027', dias: 143 },
      { nome: 'CRF (FGTS)', validade: '02/12/2026', dias: 25 },
    ],
  },
  c7: {
    simples: { receita12m: 'R$ 278.000', sublimite: 3600000, usado: 278000, fatorR: 0.15, das: 'R$ 1.390,00', pgdas: 'pronto para transmitir (cartão com você)' },
    caixaPostal: [{ id: 'cp1', orgao: 'DTE SP', assunto: 'Nenhuma mensagem nova', recebida: '06/11', ciencia: 'lida', tarefa: undefined }],
    guias: [guia('g1', 'DAS', '10/2026', 'R$ 1.390,00', '20/11', false, false, false), guia('g2', 'DAS', '09/2026', 'R$ 1.244,60', '20/10', true, true, true)],
    situacao: regular(['Receita Federal / PGFN', 'SEFAZ SP', 'Prefeitura de São Paulo']),
    certidoes: [{ nome: 'CND federal', validade: '11/05/2027', dias: 185 }],
  },
  c3: {
    simples: { receita12m: 'R$ 2.480.000', sublimite: 3600000, usado: 2480000, fatorR: 0.09, das: 'R$ 2.104,77', pgdas: 'aguardando 3 notas sem XML' },
    caixaPostal: [{ id: 'cp1', orgao: 'e-CAC', assunto: 'Cadastro inapto: falta a ECF de 2025', recebida: '05/11', ciencia: 'prazo de ciência 20/11', tarefa: 'FIS-005' }],
    guias: [guia('g1', 'DAS', '10/2026', 'R$ 2.104,77', '20/11', false, false, false), guia('g2', 'DAS', '09/2026', 'R$ 1.980,33', '20/10', true, true, true)],
    situacao: [{ orgao: 'Receita Federal / PGFN', atual: 'inapta (falta ECF 2025)', anterior: 'regular', mudou: true }, ...regular(['SEFAZ SP', 'Prefeitura de São Paulo'])],
    certidoes: [{ nome: 'CND federal', validade: 'não emitida (inapta)', dias: -1 }],
  },
  c4: {
    caixaPostal: [{ id: 'cp1', orgao: 'NFS-e SP', assunto: 'Certificado da captura vence em 3 dias', recebida: '18/11', ciencia: 'tarefa NFE-503', tarefa: 'NFE-503' }],
    guias: [guia('g1', 'PIS/COFINS', '10/2026', 'R$ 3.412,80', '25/11', false, false, false), guia('g2', 'ISS retido (tomadores)', '10/2026', 'R$ 1.180,00', '10/11', true, true, true)],
    situacao: regular(['Receita Federal / PGFN', 'Prefeitura de São Paulo']),
    certidoes: [{ nome: 'CND federal', validade: '19/01/2027', dias: 73 }],
  },
  c5: {
    caixaPostal: [{ id: 'cp1', orgao: 'SEFAZ-RS', assunto: 'Intimação sobre o CT-e 0912', recebida: '05/11', ciencia: 'prazo 18/11', tarefa: 'FIS-038' }],
    guias: [
      guia('g1', 'PIS/COFINS (não cumulativo)', '10/2026', 'R$ 64.210,40', '25/11', true, true, false),
      guia('g2', 'IRPJ/CSLL estimativa', '10/2026', 'R$ 92.330,00', '28/11', true, false, false),
      guia('g3', 'ICMS-RS', '10/2026', 'R$ 38.904,15', '12/11', true, true, true),
    ],
    situacao: [...regular(['Receita Federal / PGFN']), { orgao: 'SEFAZ-RS', atual: 'intimação em aberto (CT-e 0912)', anterior: 'regular', mudou: true }],
    certidoes: [
      { nome: 'CND federal', validade: '08/04/2027', dias: 152 },
      { nome: 'CND estadual RS', validade: '30/11/2026', dias: 12 },
    ],
  },
  c6: {
    caixaPostal: [{ id: 'cp1', orgao: 'e-CAC (CPF)', assunto: 'Nenhuma mensagem nova', recebida: '01/11', ciencia: 'lida', tarefa: undefined }],
    guias: [guia('g1', 'Carnê-leão', '10/2026', 'R$ 1.874,22', '28/11', true, false, false), guia('g2', 'IRPF 2026 · 7ª quota', '10/2026', 'R$ 612,40', '28/11', true, true, false)],
    situacao: regular(['Receita Federal / PGFN']),
    certidoes: [{ nome: 'CND federal (CPF)', validade: '12/03/2027', dias: 125 }],
  },
}

export function fiscalDe(clienteId?: string): DetalheFiscal {
  return { ...fiscalDetalhe, ...(clienteId ? fiscalPorCliente[clienteId] : {}) }
}

type DetalheDP = typeof dpDetalhe
type DetalheContabil = typeof contabilDetalhe
const etapasAdm = (dados: boolean, docs: boolean, aso: boolean) => [
  { rotulo: 'Dados', feito: dados },
  { rotulo: 'Documentos', feito: docs },
  { rotulo: 'ASO', feito: aso },
  { rotulo: 'Contrato', feito: false, decisao: false },
  { rotulo: 'S-2200', feito: false },
]

/** DP por cliente: as admissões, a folha e o eSocial de cada um (o resto vem vazio, não da Metalúrgica). */
const dpPorCliente: Record<string, Partial<DetalheDP>> = {
  c2: {
    quadro: { ativos: 8, estabelecimentos: [{ nome: 'Loja · São Paulo', ativos: 8 }], cotaPcd: { exigida: 0, tem: 0 }, aprendizes: { exigida: 0, tem: 0 }, ponto: 'cartão · fechamento dia 30' },
    admissoes: [
      { id: 'ad1', nome: 'Padeiro (nome a receber)', cargo: 'Padeiro', inicio: '23/11', prazoS2200: 'até 22/11', diasS2200: 4, etapas: etapasAdm(false, false, false) },
      { id: 'ad2', nome: 'Atendente (nome a receber)', cargo: 'Atendente', inicio: '23/11', prazoS2200: 'até 22/11', diasS2200: 4, etapas: etapasAdm(false, false, false) },
    ],
    variaveis: [{ item: 'Faltas e atrasos', esperado: 'até 30/11', recebido: false }],
    previa: 'depois das admissões · prévia em 01/12',
    esocial: [{ evento: 'S-1200 · remuneração 10/2026', situacao: 'aceito' }],
    ferias: [],
    rescisoes: [],
  },
  c3: {
    quadro: { ativos: 4, estabelecimentos: [{ nome: 'Loja · São Paulo', ativos: 4 }], cotaPcd: { exigida: 0, tem: 0 }, aprendizes: { exigida: 0, tem: 0 }, ponto: 'app · enviado pela Ana Prates' },
    admissoes: [],
    variaveis: [
      { item: 'Ponto de outubro', esperado: 'até 15/11', recebido: true },
      { item: 'Comissões de vendas', esperado: 'até 25/11', recebido: false },
    ],
    previa: 'ponto recebido · prévia em 20/11',
    esocial: [{ evento: 'S-1200 · remuneração 10/2026', situacao: 'aceito' }],
    ferias: [{ nome: 'Sônia Prates', detalhe: 'férias de 05/01 a 24/01', dias: 59, alerta: false }],
    rescisoes: [],
  },
  c4: {
    quadro: { ativos: 6, estabelecimentos: [{ nome: 'Clínica · São Paulo', ativos: 6 }], cotaPcd: { exigida: 0, tem: 0 }, aprendizes: { exigida: 0, tem: 0 }, ponto: 'em implantação' },
    admissoes: [],
    variaveis: [{ item: 'Folha do contador anterior (09/2026)', esperado: 'implantação', recebido: false }],
    previa: 'primeira folha em 12/2026',
    esocial: [],
    ferias: [],
    rescisoes: [],
  },
  c5: {
    quadro: {
      ativos: 112,
      estabelecimentos: [
        { nome: 'Matriz · Porto Alegre', ativos: 78 },
        { nome: 'Filial · Caxias do Sul', ativos: 34 },
      ],
      cotaPcd: { exigida: 3, tem: 3 },
      aprendizes: { exigida: 6, tem: 5 },
      ponto: 'REP-A · importado do sistema da empresa',
    },
    admissoes: [],
    variaveis: [
      { item: 'Horas extras (motoristas)', esperado: 'até 25/11', recebido: true },
      { item: 'Diárias de viagem', esperado: 'até 25/11', recebido: true },
    ],
    previa: 'importada no core · conferência em 27/11',
    esocial: [
      { evento: 'S-1200 · remuneração 10/2026', situacao: 'aceito' },
      { evento: 'S-1299 · fechamento 10/2026', situacao: 'aceito' },
    ],
    ferias: [{ nome: '9 motoristas', detalhe: 'períodos vencendo até 31/12', dias: 54, alerta: true }],
    rescisoes: [],
  },
  c7: {
    quadro: { ativos: 3, estabelecimentos: [{ nome: 'Café · São Paulo', ativos: 3 }], cotaPcd: { exigida: 0, tem: 0 }, aprendizes: { exigida: 0, tem: 0 }, ponto: 'cartão' },
    admissoes: [],
    variaveis: [],
    previa: 'prévia enviada ao João Batista',
    esocial: [{ evento: 'S-1200 · remuneração 10/2026', situacao: 'aceito' }],
    ferias: [],
    rescisoes: [],
  },
  c6: {
    quadro: { ativos: 0, estabelecimentos: [], cotaPcd: { exigida: 0, tem: 0 }, aprendizes: { exigida: 0, tem: 0 }, ponto: 'pessoa física, sem empregados' },
    admissoes: [],
    variaveis: [],
    previa: 'sem folha',
    esocial: [],
    ferias: [],
    rescisoes: [],
  },
}

export function dpDe(clienteId?: string): DetalheDP {
  return { ...dpDetalhe, ...(clienteId ? dpPorCliente[clienteId] : {}) }
}

/** Contábil por cliente: o fechamento de cada um, ligado às conversas e tarefas. */
const contabilPorCliente: Record<string, Partial<DetalheContabil>> = {
  c2: {
    etapas: [
      { id: 'coleta', rotulo: 'Coleta', situacao: 'andamento', detalhe: 'falta o extrato de outubro (8 dias)' },
      { id: 'extratos', rotulo: 'Extratos', situacao: 'pendente', detalhe: 'aguardando' },
      { id: 'classificacao', rotulo: 'Classificação', situacao: 'pendente', detalhe: '—' },
      { id: 'conciliacao', rotulo: 'Conciliação', situacao: 'pendente', detalhe: '—' },
      { id: 'core', rotulo: 'Envio ao core', situacao: 'pendente', detalhe: '—' },
    ],
    deveChegar: [
      { item: 'Extrato Bradesco', chegou: false, quando: 'cobrado 2 vezes · há 8 dias' },
      { item: 'Notas de entrada e saída', chegou: true, quando: 'captura · 96 XMLs' },
      { item: 'Folha de outubro', chegou: true, quando: 'DP · 05/11' },
    ],
    linhas: [],
    conciliacoes: [{ id: 'c1', conta: 'Impostos a recolher × fiscal', diferenca: 'R$ 3.120,00', ok: false }],
  },
  c3: {
    etapas: [
      { id: 'coleta', rotulo: 'Coleta', situacao: 'feito', detalhe: 'tudo recebido' },
      { id: 'extratos', rotulo: 'Extratos', situacao: 'feito', detalhe: '1 conta' },
      { id: 'classificacao', rotulo: 'Classificação', situacao: 'feito', detalhe: '188 de 188' },
      { id: 'conciliacao', rotulo: 'Conciliação', situacao: 'andamento', detalhe: '1 diferença de cartão' },
      { id: 'core', rotulo: 'Envio ao core', situacao: 'pendente', detalhe: 'depois da conciliação' },
    ],
    deveChegar: [
      { item: 'Extrato Itaú', chegou: true, quando: 'Open Finance · 01/11' },
      { item: 'Relatório da maquininha', chegou: true, quando: 'app · 04/11' },
    ],
    linhas: [],
    conciliacoes: [{ id: 'c1', conta: 'Adquirentes (cartão) × vendas', diferenca: 'R$ 214,90', ok: false }],
  },
  c4: {
    etapas: [
      { id: 'coleta', rotulo: 'Balanço de abertura', situacao: 'andamento', detalhe: 'conferindo o do contador anterior' },
      { id: 'extratos', rotulo: 'Extratos', situacao: 'feito', detalhe: '2 contas' },
      { id: 'classificacao', rotulo: 'Classificação', situacao: 'pendente', detalhe: 'depois da abertura' },
      { id: 'conciliacao', rotulo: 'Conciliação', situacao: 'pendente', detalhe: '—' },
      { id: 'core', rotulo: 'Envio ao core', situacao: 'pendente', detalhe: '—' },
    ],
    deveChegar: [
      { item: 'Balancete do contador anterior', chegou: false, quando: 'cobrado 3 vezes · há 9 dias' },
      { item: 'Extratos de outubro', chegou: true, quando: 'Open Finance · 01/11' },
    ],
    linhas: [],
    conciliacoes: [],
  },
  c5: {
    etapas: [
      { id: 'coleta', rotulo: 'Coleta', situacao: 'feito', detalhe: 'tudo recebido' },
      { id: 'extratos', rotulo: 'Extratos', situacao: 'feito', detalhe: '4 contas' },
      { id: 'classificacao', rotulo: 'Classificação', situacao: 'feito', detalhe: '2.940 linhas' },
      { id: 'conciliacao', rotulo: 'Conciliação', situacao: 'feito', detalhe: 'sem diferenças' },
      { id: 'core', rotulo: 'Envio ao core', situacao: 'andamento', detalhe: 'lote enviado às 09:10' },
    ],
    deveChegar: [{ item: 'Extratos (4 bancos)', chegou: true, quando: 'Open Finance · 01/11' }],
    linhas: [],
    conciliacoes: [{ id: 'c1', conta: 'Impostos a recolher × fiscal × extrato', diferenca: 'R$ 0,00', ok: true }],
  },
  c7: {
    deveChegar: [{ item: 'Extrato Sicoob', chegou: true, quando: 'app · 02/11' }],
    linhas: [],
    conciliacoes: [{ id: 'c1', conta: 'Impostos a recolher × fiscal', diferenca: 'R$ 0,00', ok: true }],
  },
  c6: { etapas: [{ id: 'coleta', rotulo: 'Livro-caixa (carnê-leão)', situacao: 'andamento', detalhe: 'recibos de outubro' }], deveChegar: [{ item: 'Recibos de aluguel', chegou: true, quando: 'app · 03/11' }], linhas: [], conciliacoes: [] },
}

export function contabilDe(clienteId?: string): DetalheContabil {
  return { ...contabilDetalhe, ...(clienteId ? contabilPorCliente[clienteId] : {}) }
}
