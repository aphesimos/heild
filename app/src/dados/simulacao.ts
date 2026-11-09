import type { SetorIntegrante } from '@/theme/tipos'
import type { Cartao, RespostaLegal, Tarefa } from './tipos'

/*
 * Trabalho simulado (pedido do usuário, 8/11/2026): na demonstração, os
 * integrantes "fazem" o que se pede, com etapas, espera, aviso ao terminar e
 * passagens entre eles, como seria o fluxo real. Nada acontece de fato: as
 * etapas e o resultado vêm daqui. O motor fica na loja do escritório, então o
 * trabalho continua mesmo trocando de aba.
 */

/** O que sai no fim: mensagem no chat, cartão, tarefa, mensagem ao cliente no CRM, passagem a outro integrante. */
export interface FimFluxo {
  texto: string
  cartoes?: Cartao[]
  /** Muda a tarefa de origem (se houver). */
  tarefaStatus?: Tarefa['status']
  /** Cria uma tarefa nova (aparece no Painel e vira cartão no chat). */
  tarefaNova?: Omit<Tarefa, 'id'>
  /** Mensagem do integrante ao cliente, na conversa do CRM (passa por enviada, entregue e lida). */
  crm?: {
    conversa: string
    texto: string
    /** O cliente responde: aparece digitando antes; a resposta pode destravar outro fluxo. */
    resposta?: { autor: string; texto: string; digitarSeg: number; depoisDeSeg: number; fluxo?: string }
  }
  /** Muda uma tarefa pelo código (quando o fluxo não nasceu dela). */
  tarefaPorCodigo?: { codigo: string; status: Tarefa['status'] }
  /** Aviso no sino (título curto). Rotina sem aviso só escreve no chat. */
  aviso?: string
  /** Próximos fluxos, de outros integrantes (passagem de trabalho). */
  depois?: string[]
  /** O que o integrante devolve ao Assistente, em uma frase (padrão: o texto do fim). */
  retorno?: string
  /** O que o Assistente diz ao usuário quando este integrante termina e o trabalho segue para o próximo. */
  paraAssistente?: string
}

export interface FluxoSimulado {
  id: string
  integrante: string
  setor: SetorIntegrante
  titulo: string
  cliente?: string
  /** O que o integrante responde ao receber o pedido. */
  inicio: string
  etapas: string[]
  /** Segundos por etapa. */
  seg: number
  fim: FimFluxo
  /** Frase que dispara o fluxo no chat do integrante (as sugestões dele). */
  gatilho?: RegExp
}

/** Nome do integrante padrão de cada setor, para as frases do Assistente. */
const nomes: Partial<Record<SetorIntegrante, string>> = {
  geral: 'Assistente',
  fiscal: 'Fiscal',
  dp: 'DP',
  contabil: 'Contábil',
  consultor: 'Consultor',
  societario: 'Societário',
  notas: 'Notas',
  gestao_atendimento: 'Atendimento',
  financeiro_escritorio: 'Financeiro',
  bpo_financeiro: 'BPO',
  bpo_pagar: 'Contas a Pagar',
  bpo_receber: 'Contas a Receber',
  bpo_conciliacao: 'Conciliação',
  bpo_gerencial: 'Gerencial',
}
export const nomeDoSetor = (s: SetorIntegrante) => nomes[s] ?? s

const ap = (id: string, resumo: string, argumentos: [string, string][], expiraEm = 'expira em 2 dias'): Cartao => ({ tipo: 'aprovacao', id, resumo, argumentos: argumentos.map(([rotulo, valor]) => ({ rotulo, valor })), expiraEm })

const LC123 = 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm'

const respostaFatorR =
  'Sim, se a Clínica optar pelo Simples Nacional em janeiro de 2027: hoje ela está no Lucro Presumido. Odontologia é atividade sujeita ao fator R e a folha da Clínica é 31,2% da receita dos últimos 12 meses, acima dos 28%. Com isso, ela seria tributada pelo Anexo III, e não pelo Anexo V.'

const legalFatorR: RespostaLegal = {
  afirmacoes: [
    { texto: 'Odontologia e prótese dentária estão no § 5º-B, XX, do art. 18, entre as atividades tributadas pelo Anexo III.', trecho: 't1', grau: 'alto' },
    { texto: 'Com folha de salários abaixo de 28% da receita bruta, essas atividades vão para o Anexo V.', trecho: 't2', grau: 'alto' },
    { texto: 'Com folha igual ou maior que 28%, ficam no Anexo III.', trecho: 't2', grau: 'alto' },
    { texto: 'A folha da Clínica nos últimos 12 meses é 31,2% da receita bruta.', calculo: true, grau: 'alto' },
    { texto: 'A opção pelo Simples para 2027 é feita até o último dia útil de janeiro e vale desde 1º de janeiro.', trecho: 't3', grau: 'alto' },
  ],
  trechos: [
    {
      id: 't1',
      // Odontologia: § 5º-B, XX, com o § 5º-M, I (LC 155/2016, efeitos desde 01/01/2018). O § 5º-J vale só
      // para as atividades do § 5º-I; de 2015 a 2017 a odontologia estava no § 5º-I, III, no Anexo VI.
      norma: 'LC 123/2006, art. 18, § 5º-B, XX',
      redacao:
        'Sem prejuízo do disposto no § 1º do art. 17 desta Lei Complementar, serão tributadas na forma do Anexo III desta Lei Complementar as seguintes atividades de prestação de serviços: (…) XX - odontologia e prótese dentária;',
      vigenteDe: '01/01/2018',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
    {
      id: 't2',
      norma: 'LC 123/2006, art. 18, § 5º-M, I',
      redacao:
        'Quando a relação entre a folha de salários e a receita bruta da microempresa ou da empresa de pequeno porte for inferior a 28% (vinte e oito por cento), serão tributadas na forma do Anexo V desta Lei Complementar as atividades previstas: I - nos incisos XVI, XVIII, XIX, XX e XXI do § 5º-B deste artigo;',
      vigenteDe: '01/01/2018',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
    {
      id: 't3',
      norma: 'LC 123/2006, art. 16, § 2º',
      redacao: 'A opção de que trata o caput deste artigo deverá ser realizada no mês de janeiro, até o seu último dia útil, produzindo efeitos a partir do primeiro dia do ano-calendário da opção (…).',
      vigenteDe: '01/07/2007',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
  ],
  calculo: {
    titulo: 'Fator R da Clínica Sorriso (nov/2025 a out/2026)',
    resultado: '31,2% · Anexo III',
    formula: 'folha de salários dos 12 meses ÷ receita bruta dos 12 meses',
    linhas: [
      ['Folha de salários, com pró-labore e FGTS', 'R$ 524.160,00'],
      ['Receita bruta', 'R$ 1.680.000,00'],
      ['Razão', '31,2%'],
      ['Mínimo para o Anexo III', '28%'],
    ],
    origem: 'Folha do DP (eSocial) e notas de saída do módulo Notas, lidas em 18/11/2026',
  },
  divergencias: [],
  lacunas: ['Novembro e dezembro de 2026 ainda não aconteceram: se a folha cair abaixo de 28% da receita até a opção, o anexo muda. Refaço o cálculo em janeiro.'],
  grau: 'alto',
  dataConsiderada: '01/01/2027',
  versaoBase: '2026-11-07.3',
}

const respostaSublimite =
  'Deve passar, por pouco. A receita projetada de 2026 é R$ 3,84 milhões, 6,7% acima do sublimite de R$ 3,6 milhões. Como o excesso fica abaixo de 20%, nada muda este ano: a partir de 1º de janeiro de 2027 a Loja continua no Simples, mas o ICMS deixa de ir no DAS e passa a ser recolhido pelas regras de São Paulo.'

const legalSublimite: RespostaLegal = {
  afirmacoes: [
    { texto: 'Para recolher o ICMS e o ISS dentro do Simples, o limite de receita bruta anual é R$ 3,6 milhões.', trecho: 't1', grau: 'alto' },
    { texto: 'A receita projetada da Loja para 2026 é R$ 3,84 milhões, 6,7% acima desse limite.', calculo: true, grau: 'médio' },
    { texto: 'Quem passa do sublimite fica impedido de recolher o ICMS e o ISS pelo Simples; os demais tributos continuam no DAS.', trecho: 't2', grau: 'alto' },
    { texto: 'Se o excesso não passa de 20%, o impedimento só produz efeito no ano seguinte; acima disso, já no mês seguinte ao excesso.', trecho: 't3', grau: 'alto' },
  ],
  trechos: [
    {
      id: 't1',
      norma: 'LC 123/2006, art. 13-A',
      redacao: 'Para efeito de recolhimento do ICMS e do ISS no Simples Nacional, o limite máximo de que trata o inciso II do caput do art. 3º será de R$ 3.600.000,00 (três milhões e seiscentos mil reais) (…).',
      vigenteDe: '01/01/2018',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
    {
      id: 't2',
      norma: 'LC 123/2006, art. 20, § 1º',
      redacao:
        'A empresa de pequeno porte que ultrapassar os limites a que se referem o caput e o § 4º deste artigo estará automaticamente impedida de recolher o ICMS e o ISS na forma do Simples Nacional, a partir do mês subsequente ao que tiver ocorrido o excesso (…).',
      vigenteDe: '01/01/2018',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
    {
      id: 't3',
      norma: 'LC 123/2006, art. 20, § 1º-A',
      redacao: 'Os efeitos do impedimento previsto no § 1º ocorrerão no ano-calendário subsequente se o excesso verificado não for superior a 20% (vinte por cento) dos limites referidos.',
      vigenteDe: '01/01/2018',
      hierarquia: 'Lei complementar',
      link: LC123,
    },
  ],
  calculo: {
    titulo: 'Receita bruta de 2026 da Loja Bela Vista (projeção)',
    resultado: 'R$ 3.840.000 · 6,7% acima do sublimite',
    formula: 'receita de janeiro a outubro + 2 × média de agosto a outubro',
    linhas: [
      ['Receita de janeiro a outubro', 'R$ 3.180.000,00'],
      ['Média de agosto a outubro', 'R$ 330.000,00'],
      ['Projeção de 2026', 'R$ 3.840.000,00'],
      ['Sublimite', 'R$ 3.600.000,00'],
      ['Excesso', 'R$ 240.000,00 (6,7%)'],
      ['Teto para o efeito só em 2027 (20%)', 'R$ 4.320.000,00'],
    ],
    origem: 'Notas de saída do módulo Notas e PGDAS-D transmitidos, lidos em 18/11/2026',
  },
  divergencias: [],
  lacunas: ['É projeção: se dezembro repetir 2025 (18% acima da média), o excesso vai a 9,1%, ainda abaixo de 20%. O Fiscal acompanha mês a mês.'],
  grau: 'médio',
  dataConsiderada: '31/12/2026',
  versaoBase: '2026-11-07.3',
}

export const fluxos: Record<string, FluxoSimulado> = {
  // Contábil: a tarefa da imagem (CTB-016), com passagem ao Atendimento para o PIX sem identificação.
  'ctb-classificar': {
    id: 'ctb-classificar',
    integrante: 'i-contabil',
    setor: 'contabil',
    titulo: 'Classificar 3 lançamentos fora do padrão',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'Começando. Vou olhar os 3 lançamentos contra o histórico e as regras de conciliação da Metalúrgica.',
    etapas: ['Lendo os 3 lançamentos do extrato Itaú', 'Procurando o mesmo padrão nos últimos 12 meses', 'Conferindo com as regras aprovadas e o plano de contas', 'Separando o que eu decido e o que precisa do cliente'],
    seg: 2.6,
    fim: {
      texto:
        'Classifiquei 2 dos 3: a tarifa em duplicidade virou estorno pedido ao banco, e o PIX da Fundição Lima é recebimento de cliente (nota 1452). O PIX de R$ 1.200 de "M. SILVA" não tem pista: passei para o Atendimento perguntar à Rita.',
      tarefaStatus: 'aguardando_cliente',
      aviso: 'Contábil classificou 2 lançamentos da Metalúrgica; 1 foi ao cliente',
      depois: ['atd-pix'],
    },
  },
  'atd-pix': {
    id: 'atd-pix',
    integrante: 'i-atendimento',
    setor: 'gestao_atendimento',
    titulo: 'Perguntar à Rita sobre o PIX de R$ 1.200',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'Recebi do Contábil. Vou perguntar à Rita pelo WhatsApp, no tom do escritório.',
    etapas: ['Abrindo a conversa da Metalúrgica no CRM', 'Escrevendo a pergunta com o comprovante', 'Enviando pelo WhatsApp (canal Contábil)'],
    seg: 2,
    fim: {
      texto: 'Perguntei à Rita Campos sobre o PIX de R$ 1.200 de 04/11. Quando ela responder, a resposta volta para o Contábil classificar.',
      crm: {
        conversa: 'cv1',
        texto: 'Oi, Rita! No extrato do Itaú de 04/11 tem um PIX de R$ 1.200,00 de "M. SILVA" que não achamos a origem. Sabe dizer do que é? Se tiver comprovante ou nota, pode mandar por aqui.',
        resposta: { autor: 'Rita Campos', texto: 'Oi! É do Marcos Silva, cliente nosso: adiantamento do pedido 3381. A nota sai semana que vem.', digitarSeg: 4.5, depoisDeSeg: 3, fluxo: 'ctb-pix-final' },
      },
      aviso: 'Atendimento perguntou à Rita (Metalúrgica) sobre o PIX',
    },
  },

  'ctb-pix-final': {
    id: 'ctb-pix-final',
    integrante: 'i-contabil',
    setor: 'contabil',
    titulo: 'Classificar o PIX de R$ 1.200 com a resposta da Rita',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'A Rita respondeu no CRM: é adiantamento do cliente Marcos Silva (pedido 3381). Classificando.',
    etapas: ['Lendo a resposta da Rita no CRM', 'Lançando como adiantamento de cliente', 'Fechando a tarefa CTB-016'],
    seg: 2,
    fim: {
      texto: 'Pronto: o PIX de R$ 1.200 virou adiantamento de cliente (Marcos Silva, pedido 3381); quando a nota sair, eu baixo o adiantamento. Os 3 lançamentos fora do padrão estão resolvidos e a CTB-016 foi concluída.',
      tarefaPorCodigo: { codigo: 'CTB-016', status: 'concluida' },
      aviso: 'Contábil concluiu a CTB-016 da Metalúrgica',
    },
  },

  // DP: prévia da folha (sugestão do integrante), com envio aos clientes pelo Atendimento depois de aprovada.
  'dp-previa': {
    id: 'dp-previa',
    integrante: 'i-dp',
    setor: 'dp',
    titulo: 'Prévia da folha de novembro',
    inicio: 'Vou gerar as prévias de novembro dos 9 clientes com folha. Leva uns instantes.',
    etapas: ['Lendo ponto, faltas e horas extras de 9 clientes', 'Calculando INSS, IRRF e FGTS de 87 funcionários', 'Comparando com outubro (variação acima de 10%)', 'Montando as prévias em PDF'],
    seg: 2.4,
    gatilho: /pr[ée]via da folha/i,
    fim: {
      texto: 'Prévias prontas: 9 clientes, 87 funcionários, R$ 312.480 de bruto. Duas passaram de 10% sobre outubro: a Padaria (2 admissões) e a Rota Sul (horas extras). Aprove para eu mandar aos clientes conferirem.',
      cartoes: [
        ap('sim-dp1', 'Enviar as prévias de novembro aos clientes para conferência', [
          ['Clientes', '9'],
          ['Bruto', 'R$ 312.480'],
          ['Variação > 10%', '2'],
        ]),
      ],
      aviso: 'DP: prévias da folha de novembro prontas para aprovar',
      retorno: 'Prévias prontas: 9 clientes, 87 funcionários, R$ 312.480 de bruto; 2 variaram mais de 10%.',
    },
  },

  // Fiscal: caixa postal do e-CAC (sugestão), cria tarefa da intimação.
  'fis-ecac': {
    id: 'fis-ecac',
    integrante: 'i-fiscal',
    setor: 'fiscal',
    titulo: 'Ler a caixa postal do e-CAC da Metalúrgica',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'Abrindo o e-CAC com a procuração da Metalúrgica.',
    etapas: ['Entrando no e-CAC com a procuração eletrônica', 'Lendo 6 mensagens novas', 'Classificando por prazo e risco'],
    seg: 2.4,
    gatilho: /caixa postal/i,
    fim: {
      texto: 'Li as 6 mensagens. Quatro são informativas. Uma é aviso de divergência na DCTFWeb de setembro (prazo 30 dias): abri a tarefa FIS-041. A outra é a confirmação do parcelamento, já arquivada nas pastas.',
      tarefaNova: {
        codigo: 'FIS-041',
        titulo: 'Responder divergência da DCTFWeb 09/2026',
        cliente: 'Metalúrgica Andrade Ltda',
        setor: 'fiscal',
        prazo: '08/12',
        responsavel: { tipo: 'integrante', nome: 'Fiscal', setor: 'fiscal' },
        status: 'em_andamento',
      },
      aviso: 'Fiscal leu o e-CAC da Metalúrgica: 1 divergência virou tarefa',
    },
  },

  // Financeiro: cobranças de dezembro (sugestão), termina em cartão de aprovação.
  'fin-cobrancas': {
    id: 'fin-cobrancas',
    integrante: 'i-financeiro',
    setor: 'financeiro_escritorio',
    titulo: 'Preparar as cobranças de dezembro',
    inicio: 'Preparando as cobranças de dezembro com os contratos vigentes e os extras do mês.',
    etapas: ['Lendo 142 contratos vigentes', 'Somando 9 extras e reembolsos', 'Separando os serviços em linhas e as notas por serviço', 'Conferindo o 13º de 61 contratos'],
    seg: 2.2,
    gatilho: /cobran[çc]as de dezembro/i,
    fim: {
      texto: 'Cobranças prontas: 142 clientes, R$ 203.120. Quem tem contabilidade e BPO recebe uma cobrança só, com os serviços em linhas e uma NFS-e por serviço. Saem em 01/12 às 06:00 depois da sua aprovação.',
      cartoes: [
        ap(
          'sim-fin1',
          'Gerar as cobranças de dezembro',
          [
            ['Clientes', '142'],
            ['Total', 'R$ 203.120'],
            ['Saem em', '01/12 às 06:00'],
          ],
          'expira em 5 dias',
        ),
      ],
      aviso: 'Financeiro: cobranças de dezembro prontas para aprovar',
    },
  },

  // Vigia do ISS (integrante criado pela Fernanda).
  'iss-checagem': {
    id: 'iss-checagem',
    integrante: 'i-iss',
    setor: 'fiscal',
    titulo: 'Checagem semanal do ISS',
    inicio: 'Rodando a checagem agora, nos 6 municípios dos clientes que vigio.',
    etapas: ['Consultando as leis e portarias de 6 municípios', 'Comparando alíquotas e prazos com o cadastro'],
    seg: 2.4,
    gatilho: /checagem/i,
    fim: { texto: 'Nada mudou nas alíquotas. Porto Alegre adiantou o vencimento do ISS de dezembro para o dia 10: avisei o Fiscal e ajustei a agenda da Rota Sul.', aviso: 'Vigia do ISS: 1 prazo mudou (Porto Alegre)' },
  },

  // Atendimento: cobrar documentos pendentes (pedido do Assistente), com mensagens no CRM.
  'atd-docs': {
    id: 'atd-docs',
    integrante: 'i-atendimento',
    setor: 'gestao_atendimento',
    titulo: 'Cobrar os documentos pendentes',
    inicio: 'Vou cobrar quem está devendo documento há mais de 5 dias, cada um no canal e no contato certo.',
    etapas: ['Listando as tarefas aguardando cliente', 'Escolhendo o contato de cada assunto na ficha', 'Enviando as mensagens (WhatsApp e app)'],
    seg: 2.2,
    fim: {
      texto: 'Cobrei 5 clientes: Padaria (documentos das admissões), Metalúrgica (extrato de outubro), Loja Bela Vista (XML de 3 compras), Rota Sul (CT-e 0912) e Clínica (certificado A1). As respostas caem no CRM e destravam as tarefas.',
      crm: {
        conversa: 'cv2',
        texto: 'Oi, João! Para fechar as 2 admissões, faltam RG, CPF, CTPS e o exame admissional de cada um. Pode mandar por aqui ou pelo app, em Pendências.',
        resposta: { autor: 'João Batista', texto: 'Bom dia! Os exames ficam prontos amanhã. Mando tudo junto de manhã pelo app.', digitarSeg: 5, depoisDeSeg: 4 },
      },
      aviso: 'Atendimento cobrou 5 clientes por documentos',
      retorno: 'Cobrei 5 clientes, cada um no contato do assunto. As respostas chegam no CRM.',
    },
  },

  // Admissão (pedido do Assistente): DP prepara e passa ao Atendimento.
  'dp-admissao': {
    id: 'dp-admissao',
    integrante: 'i-dp',
    setor: 'dp',
    titulo: 'Admissão dos 2 funcionários da Padaria',
    cliente: 'Padaria Pão Quente ME',
    inicio: 'Abrindo as duas admissões da Padaria a partir do áudio do João Batista.',
    etapas: ['Lendo o áudio: cargos, salários e início', 'Preparando contratos de experiência e ficha de registro', 'Conferindo convenção (Padeiros de SP) e o piso'],
    seg: 2.4,
    fim: {
      texto: 'Contratos de experiência prontos (atendente e auxiliar de padeiro, piso da convenção). Faltam os documentos dos dois: pedi ao Atendimento para cobrar o João. O eSocial (S-2200) sai assim que chegarem.',
      cartoes: [{ tipo: 'documento', id: 'sim-dpdoc', nome: 'Contratos de experiência · Padaria.pdf', especie: 'documento', cliente: 'Padaria Pão Quente ME', competencia: '11/2026' }],
      aviso: 'DP preparou as admissões da Padaria; documentos com o cliente',
      retorno: 'Contratos de experiência prontos (atendente e auxiliar de padeiro). Faltam os documentos dos dois funcionários.',
      paraAssistente: 'O DP preparou os dois contratos de experiência, no piso da convenção dos padeiros. Faltam os documentos dos funcionários: o Atendimento vai cobrar o João Batista.',
      depois: ['atd-docs'],
    },
  },

  // Fechamento de outubro (pedido do Assistente): Contábil, depois Fiscal.
  'ctb-fechamento': {
    id: 'ctb-fechamento',
    integrante: 'i-contabil',
    setor: 'contabil',
    titulo: 'Fechar outubro da Metalúrgica Andrade',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'Começando o fechamento de outubro da Metalúrgica pela conciliação.',
    etapas: ['Conciliando 214 lançamentos do Itaú', 'Classificando o que bateu com regra aprovada', 'Gerando o balancete de outubro'],
    seg: 2.4,
    fim: {
      texto: 'Conciliação fechada (211 de 214 casados; 3 na tarefa CTB-016) e balancete de outubro gerado. Passei ao Fiscal para apurar o ISS e o PIS/COFINS.',
      cartoes: [{ tipo: 'documento', id: 'sim-bal', nome: 'Balancete 10-2026.pdf', especie: 'documento', cliente: 'Metalúrgica Andrade Ltda', competencia: '10/2026' }],
      aviso: 'Contábil fechou a conciliação de outubro da Metalúrgica',
      retorno: 'Conciliação fechada: 211 de 214 lançamentos casados (os 3 restantes estão na CTB-016). Balancete de outubro gerado.',
      paraAssistente: 'O Contábil terminou a primeira parte: conciliação fechada, com 211 de 214 lançamentos casados, e o balancete de outubro gerado. Agora o Fiscal apura o ISS e o PIS/COFINS com esse balancete.',
      depois: ['fis-apuracao'],
    },
  },
  'fis-apuracao': {
    id: 'fis-apuracao',
    integrante: 'i-fiscal',
    setor: 'fiscal',
    titulo: 'Apurar ISS e PIS/COFINS de outubro da Metalúrgica',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: 'Recebi o balancete do Contábil. Apurando os tributos de outubro.',
    etapas: ['Lendo as notas de saída e o balancete', 'Apurando ISS (São Paulo) e PIS/COFINS cumulativo', 'Gerando as guias'],
    seg: 2.4,
    fim: {
      texto: 'Apuração pronta: ISS R$ 4.812,40 (vence 20/11) e PIS/COFINS R$ 7.215,90 (vence 25/11). As guias estão prontas; aprove para eu enviar à Rita pelo app.',
      retorno: 'Apuração pronta: ISS R$ 4.812,40 e PIS/COFINS R$ 7.215,90, guias geradas. O envio à Rita espera aprovação.',
      cartoes: [
        ap('sim-fis1', 'Enviar as guias de outubro da Metalúrgica ao cliente', [
          ['ISS', 'R$ 4.812,40 · vence 20/11'],
          ['PIS/COFINS', 'R$ 7.215,90 · vence 25/11'],
          ['Para', 'Rita Campos, pelo app'],
        ]),
      ],
      aviso: 'Fiscal: guias de outubro da Metalúrgica prontas para aprovar',
    },
  },

  // BPO (landing, 18/11/2026): o lote de pagamentos com aprovação do cliente no app, e a conciliação.
  'bpo-lote': {
    id: 'bpo-lote',
    integrante: 'i-bpo',
    setor: 'bpo_pagar',
    titulo: 'Montar o lote de sexta da Padaria',
    cliente: 'Padaria Pão Quente ME',
    inicio: 'Vou montar o lote de sexta da Padaria com as contas capturadas esta semana.',
    etapas: ['Lendo as contas capturadas (DDA, e-mail e WhatsApp)', 'Conferindo os dados bancários do fornecedor novo', 'Montando o lote e conferindo a alçada do João', 'Mandando o lote para aprovação no app do cliente'],
    seg: 2.4,
    fim: {
      texto: 'Lote de sexta montado: 4 contas, R$ 8.420. A Distribuidora Trigal é fornecedor novo: o Lucas digitou e a Marina conferiu os dados bancários por ligação. Mandei para o João aprovar no app; o banco só libera depois disso.',
      retorno: 'Lote de R$ 8.420 montado e enviado ao João no app. O fornecedor novo foi conferido por duas pessoas.',
      paraAssistente: 'O Contas a Pagar montou o lote de sexta: 4 contas, R$ 8.420, com o fornecedor novo conferido por duas pessoas. O Atendimento vai avisar o João pelo WhatsApp.',
      aviso: 'Contas a Pagar montou o lote de sexta da Padaria (R$ 8.420)',
      depois: ['atd-lote'],
    },
  },
  'atd-lote': {
    id: 'atd-lote',
    integrante: 'i-atendimento',
    setor: 'gestao_atendimento',
    titulo: 'Avisar o João do lote de sexta',
    cliente: 'Padaria Pão Quente ME',
    inicio: 'Recebi do Contas a Pagar. Vou avisar o João pelo WhatsApp, no contato de pagamentos da ficha.',
    etapas: ['Abrindo a conversa da Padaria no CRM', 'Escrevendo o aviso com o valor e o prazo', 'Enviando pelo WhatsApp'],
    seg: 2,
    fim: {
      texto: 'Avisei o João Batista: o lote de sexta, de R$ 8.420, está no app esperando a aprovação dele. A resposta cai no CRM.',
      retorno: 'João avisado pelo WhatsApp. A aprovação é dele, no app.',
      crm: {
        conversa: 'cv2',
        texto: 'Oi, João! O lote de pagamentos de sexta da Padaria (4 contas, R$ 8.420) está no app, em Aprovações. O banco só libera depois da sua aprovação.',
        resposta: { autor: 'João Batista', texto: 'Vi aqui. Aprovo hoje à tarde.', digitarSeg: 3.5, depoisDeSeg: 3 },
      },
      aviso: 'Atendimento avisou o João do lote de sexta',
    },
  },
  'bpo-conciliar': {
    id: 'bpo-conciliar',
    integrante: 'i-bpo-conciliacao',
    setor: 'bpo_conciliacao',
    titulo: 'Conciliar outubro do Studio Forma',
    cliente: 'Studio Forma Arquitetura Ltda',
    inicio: 'Vou conciliar o extrato de outubro do Studio Forma contra as contas pagas e os recebimentos.',
    etapas: ['Lendo o extrato do Itaú de outubro (62 lançamentos)', 'Casando com as contas pagas e os recebimentos', 'Separando o que precisa de conferência'],
    seg: 2.4,
    fim: {
      texto: 'Conciliei outubro do Studio Forma: 59 de 62 lançamentos casaram. Sobraram 2 recebimentos sem nota e uma tarifa nova do banco; deixei os 3 para a Marina conferir em Operação.',
      retorno: '59 de 62 lançamentos casados; 3 separados para a Marina conferir.',
      aviso: 'Conciliação fechou outubro do Studio Forma',
    },
  },

  // Consultor (pedido do usuário, 8/11/2026): duas perguntas com o raciocínio jurídico da cascata (07, 3.1),
  // respondidas no modelo de `legal.consultar`: resposta direta, fundamento com trechos e vigência,
  // cálculo com origem, divergências, grau de segurança, data considerada e versão da base.
  'con-fator-r': {
    id: 'con-fator-r',
    integrante: 'i-consultor',
    setor: 'consultor',
    titulo: 'Fator R da Clínica Sorriso em 2027',
    cliente: 'Clínica Sorriso Ltda',
    inicio: 'Vou responder pela regra que vale em 01/01/2027, com o perfil e os números da Clínica.',
    etapas: [
      'Entendendo a pergunta: Simples Nacional, fator R, data do fato 01/01/2027',
      'Lendo o perfil da Clínica: Lucro Presumido, odontologia (CNAE 8630-5/04), São Paulo',
      'Buscando na base só o que vale em 2027: LC 123/2006 e Resolução CGSN 140/2018',
      'Calculando o fator R com a folha e a receita dos últimos 12 meses',
      'Conferindo cada afirmação contra o texto citado',
    ],
    seg: 2.4,
    gatilho: /fator R/i,
    fim: {
      texto: respostaFatorR,
      cartoes: [{ tipo: 'resposta_legal', id: 'leg-fator-r', resposta: legalFatorR }],
      aviso: 'Consultor respondeu sobre o fator R da Clínica Sorriso',
      retorno: 'Respondido com 3 trechos da LC 123/2006 conferidos e o cálculo do fator R. Grau de segurança alto.',
    },
  },
  'con-sublimite': {
    id: 'con-sublimite',
    integrante: 'i-consultor',
    setor: 'consultor',
    titulo: 'Sublimite do Simples da Loja Bela Vista em 2026',
    cliente: 'Loja Bela Vista Eireli',
    inicio: 'Vou projetar a receita de 2026 da Loja e conferir na base quando os efeitos começam.',
    etapas: [
      'Entendendo a pergunta: Simples Nacional, sublimite do ICMS, ano-calendário 2026',
      'Lendo o perfil e as notas de saída da Loja: comércio varejista, São Paulo',
      'Projetando a receita de 2026 com janeiro a outubro e a média dos últimos 3 meses',
      'Buscando na base o sublimite e quando o impedimento produz efeito (LC 123/2006)',
      'Conferindo cada afirmação contra o texto citado',
    ],
    seg: 2.4,
    gatilho: /sublimite/i,
    fim: {
      texto: respostaSublimite,
      cartoes: [{ tipo: 'resposta_legal', id: 'leg-sublimite', resposta: legalSublimite }],
      aviso: 'Consultor respondeu sobre o sublimite da Loja Bela Vista',
      retorno: 'Respondido com 2 trechos da LC 123/2006 conferidos e a projeção da receita. Grau de segurança médio, por ser projeção.',
    },
  },
}

export interface PedidoAssistente {
  texto: string
  /** Primeira resposta do Assistente: como dividiu e para quem passou. */
  resposta: string
  fluxos: string[]
  /** O que o Assistente diz quando o último integrante devolve (com os dados que valem a pena ver). */
  final: { texto: string; cartoes?: Cartao[] }
  /** Pergunta sobre a lei (vai ao Consultor). */
  juridico?: boolean
  /** Pedido de BPO (fica fora das sugestões do Assistente contábil). */
  bpo?: boolean
}

/** Pedidos prontos no Assistente: ele divide, passa ao time, acompanha cada parte e fecha com o resultado. */
export const pedidosAssistente: PedidoAssistente[] = [
  {
    texto: 'Feche outubro da Metalúrgica Andrade',
    resposta: 'Dividi em duas partes: o Contábil concilia e gera o balancete; depois o Fiscal apura o ISS e o PIS/COFINS. Vou acompanhando aqui.',
    fluxos: ['ctb-fechamento'],
    final: {
      texto: 'Outubro da Metalúrgica está fechado e confere: conciliação com 211 de 214 lançamentos casados (os 3 restantes estão na CTB-016), balancete gerado e tributos apurados. Só falta você aprovar o envio das guias à Rita.',
      cartoes: [
        {
          tipo: 'tabela',
          id: 'fech-out-meta',
          titulo: 'Fechamento de outubro · Metalúrgica Andrade',
          colunas: [
            { chave: 'item', rotulo: 'Item' },
            { chave: 'resultado', rotulo: 'Resultado' },
            { chave: 'quem', rotulo: 'Quem fez' },
          ],
          linhas: [
            { item: 'Conciliação Itaú', resultado: '211 de 214 casados', quem: 'Contábil' },
            { item: 'Balancete 10/2026', resultado: 'gerado, nas pastas', quem: 'Contábil' },
            { item: 'ISS municipal', resultado: 'R$ 4.812,40 · vence 20/11', quem: 'Fiscal' },
            { item: 'PIS/COFINS cumulativo', resultado: 'R$ 7.215,90 · vence 25/11', quem: 'Fiscal' },
          ],
        },
        ap('sim-fis1', 'Enviar as guias de outubro da Metalúrgica ao cliente', [
          ['ISS', 'R$ 4.812,40 · vence 20/11'],
          ['PIS/COFINS', 'R$ 7.215,90 · vence 25/11'],
          ['Para', 'Rita Campos, pelo app'],
        ]),
      ],
    },
  },
  {
    texto: 'Prepare a admissão dos 2 funcionários da Padaria',
    resposta: 'Passei ao DP, que prepara os contratos; depois o Atendimento cobra os documentos do João Batista. Vou acompanhando aqui.',
    fluxos: ['dp-admissao'],
    final: {
      texto: 'As duas admissões estão encaminhadas: contratos de experiência prontos e o João Batista já foi cobrado pelos documentos. Assim que chegarem, o DP manda o S-2200 ao eSocial antes do primeiro dia de trabalho.',
      cartoes: [{ tipo: 'documento', id: 'sim-dpdoc', nome: 'Contratos de experiência · Padaria.pdf', especie: 'documento', cliente: 'Padaria Pão Quente ME', competencia: '11/2026' }],
    },
  },
  {
    texto: 'Cobre os documentos pendentes dos clientes',
    resposta: 'Passei ao Atendimento, que cobra cada cliente no contato certo. Vou acompanhando aqui.',
    fluxos: ['atd-docs'],
    final: {
      texto: 'Cobrança feita: 5 clientes, cada um no contato do assunto. As respostas caem no CRM e destravam as tarefas sozinhas.',
      cartoes: [
        {
          tipo: 'tabela',
          id: 'cobr-docs',
          titulo: 'Documentos cobrados',
          colunas: [
            { chave: 'cliente', rotulo: 'Cliente' },
            { chave: 'falta', rotulo: 'O que falta' },
            { chave: 'canal', rotulo: 'Canal' },
          ],
          linhas: [
            { cliente: 'Padaria Pão Quente', falta: 'documentos das 2 admissões', canal: 'WhatsApp' },
            { cliente: 'Metalúrgica Andrade', falta: 'extrato de outubro', canal: 'WhatsApp' },
            { cliente: 'Loja Bela Vista', falta: 'XML de 3 compras', canal: 'App' },
            { cliente: 'Rota Sul', falta: 'CT-e 0912', canal: 'E-mail' },
            { cliente: 'Clínica Sorriso', falta: 'certificado A1', canal: 'App' },
          ],
        },
      ],
    },
  },
  {
    texto: 'Gere a prévia da folha de novembro',
    resposta: 'Passei ao DP, que gera as prévias dos 9 clientes com folha. Vou acompanhando aqui.',
    fluxos: ['dp-previa'],
    final: {
      texto: 'Prévias de novembro prontas: 9 clientes, 87 funcionários e R$ 312.480 de bruto. A Padaria (2 admissões) e a Rota Sul (horas extras) variaram mais de 10% sobre outubro. Aprove para o DP mandar aos clientes conferirem.',
      cartoes: [
        ap('sim-dp1', 'Enviar as prévias de novembro aos clientes para conferência', [
          ['Clientes', '9'],
          ['Bruto', 'R$ 312.480'],
          ['Variação > 10%', '2'],
        ]),
      ],
    },
  },
  {
    texto: 'Monte o lote de pagamentos de sexta da Padaria',
    resposta: 'Passei ao Contas a Pagar, que monta o lote e confere o fornecedor novo; depois o Atendimento avisa o João Batista. Vou acompanhando aqui.',
    fluxos: ['bpo-lote'],
    bpo: true,
    final: {
      texto: 'O lote de sexta da Padaria está com o João no app: 4 contas, R$ 8.420. O banco só libera depois da aprovação dele, e o fornecedor novo foi conferido por duas pessoas.',
      cartoes: [
        {
          tipo: 'tabela',
          id: 'lote-sexta-padaria',
          titulo: 'Lote de sexta · Padaria Pão Quente',
          colunas: [
            { chave: 'fornecedor', rotulo: 'Fornecedor' },
            { chave: 'vence', rotulo: 'Vence' },
            { chave: 'valor', rotulo: 'Valor', alinhamento: 'direita' },
          ],
          linhas: [
            { fornecedor: 'Moinho Santa Clara', vence: '20/11', valor: 'R$ 3.860,00' },
            { fornecedor: 'Distribuidora Trigal (novo)', vence: '20/11', valor: 'R$ 2.140,00' },
            { fornecedor: 'Enel', vence: '20/11', valor: 'R$ 1.490,00' },
            { fornecedor: 'Embalagens Paulista', vence: '20/11', valor: 'R$ 930,00' },
          ],
          total: 4,
        },
      ],
    },
  },
  {
    texto: 'Concilie outubro do Studio Forma',
    resposta: 'Passei ao BPO, que concilia o extrato de outubro e separa o que precisa de uma pessoa. Vou acompanhando aqui.',
    fluxos: ['bpo-conciliar'],
    bpo: true,
    final: {
      texto: 'Outubro do Studio Forma está conciliado: 59 de 62 lançamentos casaram. Os 3 que sobraram estão em Operação para a Marina conferir.',
      cartoes: [
        {
          tipo: 'tabela',
          id: 'conc-studio-out',
          titulo: 'Conciliação de outubro · Studio Forma',
          colunas: [
            { chave: 'item', rotulo: 'Item' },
            { chave: 'qtd', rotulo: 'Lançamentos', alinhamento: 'direita' },
          ],
          linhas: [
            { item: 'Casados com conta ou recebimento', qtd: '59' },
            { item: 'Recebimentos sem nota', qtd: '2' },
            { item: 'Tarifa nova do banco', qtd: '1' },
          ],
        },
      ],
    },
  },
  {
    texto: 'A Clínica Sorriso pode usar o fator R em 2027?',
    resposta: 'É uma pergunta sobre a lei, com os números da Clínica. Passei ao Consultor, que responde pela regra vigente em 2027 e confere cada citação.',
    fluxos: ['con-fator-r'],
    juridico: true,
    final: { texto: respostaFatorR, cartoes: [{ tipo: 'resposta_legal', id: 'leg-fator-r', resposta: legalFatorR }] },
  },
  {
    texto: 'A Loja Bela Vista vai passar do sublimite do Simples?',
    resposta: 'É uma pergunta sobre a lei, com a receita da Loja. Passei ao Consultor, que projeta 2026 e confere na base quando os efeitos começam.',
    fluxos: ['con-sublimite'],
    juridico: true,
    final: { texto: respostaSublimite, cartoes: [{ tipo: 'resposta_legal', id: 'leg-sublimite', resposta: legalSublimite }] },
  },
]

/**
 * Rotinas do time (pedido do usuário, 8/11/2026): o que cada integrante já está
 * fazendo quando a demonstração abre. Andam de verdade, terminam com o resultado
 * no chat dele e, sem nada novo, ele fica disponível. Nada de "fazendo" parado.
 * `feitoSeg`: quanto já andou ao abrir; o total é etapas × seg.
 */
export const rotinas: (FluxoSimulado & { feitoSeg: number })[] = [
  {
    id: 'r-fis-dctf',
    integrante: 'i-fiscal',
    setor: 'fiscal',
    titulo: 'Conferir as DCTFWeb 10/2026 de 6 clientes',
    inicio: '',
    etapas: ['Lendo as DCTFWeb transmitidas', 'Comparando com a folha e os créditos', 'Separando as divergências'],
    seg: 14,
    feitoSeg: 16,
    fim: {
      texto: 'Conferi as DCTFWeb de outubro dos 6 clientes. Cinco batem com a folha; a da Rota Sul tem R$ 312,40 a menos de INSS. Corrigi o rascunho e deixei na fila de transmissão.',
      aviso: 'Fiscal conferiu 6 DCTFWeb de outubro; 1 corrigida',
    },
  },
  {
    id: 'r-fis-dte',
    integrante: 'i-fiscal',
    setor: 'fiscal',
    titulo: 'Ler o DTE da SEFAZ-SP de 12 clientes',
    inicio: '',
    etapas: ['Entrando no DTE com o certificado do escritório', 'Lendo as mensagens de 12 clientes'],
    seg: 30,
    feitoSeg: 8,
    fim: { texto: 'Li o Domicílio Tributário Eletrônico da SEFAZ-SP de 12 clientes: nenhuma notificação nova.' },
  },
  {
    id: 'r-notas-entrada',
    integrante: 'i-notas',
    setor: 'notas',
    titulo: 'Capturar as notas de entrada de outubro',
    inicio: '',
    etapas: ['Baixando as notas pelo certificado de cada cliente', 'Conferindo XML e chave de acesso', 'Separando as notas sem XML'],
    seg: 12,
    feitoSeg: 14,
    fim: { texto: 'Capturei 1.284 notas de entrada de outubro em 31 clientes. Faltam os XML de 3 compras da Loja Bela Vista: já pedi ao cliente pelo app.', aviso: 'Notas: 1.284 notas de entrada de outubro capturadas' },
  },
  {
    id: 'r-soc-cadastro',
    integrante: 'i-societario',
    setor: 'societario',
    titulo: 'Conferir o cadastro de 142 clientes na Receita',
    inicio: '',
    etapas: ['Consultando os 142 CNPJs e CPFs', 'Comparando endereço, CNAE e quadro societário'],
    seg: 22,
    feitoSeg: 12,
    fim: { texto: 'Conferi o cadastro de 142 clientes na Receita: só o Café Central mudou o endereço sem avisar. Pedi ao Atendimento para confirmar com o cliente antes de eu ajustar a ficha.' },
  },
  {
    id: 'r-soc-jucesp',
    integrante: 'i-societario',
    setor: 'societario',
    titulo: 'Montar a resposta à exigência da JUCESP',
    cliente: 'Metalúrgica Andrade Ltda',
    inicio: '',
    etapas: ['Lendo a exigência', 'Ajustando a cláusula de administração', 'Montando o requerimento'],
    seg: 18,
    feitoSeg: 30,
    fim: {
      texto: 'A resposta à exigência da JUCESP da Metalúrgica está montada (cláusula de administração ajustada). Falta a assinatura dos dois sócios, que já está pedida no app.',
      aviso: 'Societário montou a resposta à JUCESP da Metalúrgica',
    },
  },
  {
    id: 'r-atd-triagem',
    integrante: 'i-atendimento',
    setor: 'gestao_atendimento',
    titulo: 'Triar 3 conversas novas',
    inicio: '',
    etapas: ['Lendo as 3 conversas', 'Descobrindo assunto e setor de cada uma'],
    seg: 10,
    feitoSeg: 6,
    fim: { texto: 'Triei as 3 conversas novas: duas foram para o Fiscal e uma para o DP, cada uma com o contato do assunto.' },
  },
  {
    id: 'r-atd-lead',
    integrante: 'i-atendimento',
    setor: 'gestao_atendimento',
    titulo: 'Qualificar o lead que chegou pelo site',
    inicio: '',
    etapas: ['Lendo o formulário do site', 'Consultando o CNPJ e o regime', 'Montando a ficha do lead'],
    seg: 16,
    feitoSeg: 10,
    fim: { texto: 'Qualifiquei o lead do site: clínica veterinária no Simples, 6 funcionários, quer contabilidade e folha. Está no funil como "proposta a enviar".', aviso: 'Atendimento qualificou um lead do site' },
  },
  {
    id: 'r-fin-itau',
    integrante: 'i-financeiro',
    setor: 'financeiro_escritorio',
    titulo: 'Conciliar os 23 lançamentos do Itaú de hoje',
    inicio: '',
    etapas: ['Lendo o extrato do Itaú', 'Casando com as faturas em aberto'],
    seg: 15,
    feitoSeg: 9,
    fim: { texto: 'Conciliei os 23 lançamentos de hoje: 22 casaram com faturas e 1 é tarifa do banco, já lançada.' },
  },
  {
    id: 'r-bpo-mercado',
    integrante: 'i-bpo-conciliacao',
    setor: 'bpo_conciliacao',
    titulo: 'Conciliar o extrato do Mercado Bom Preço',
    cliente: 'Mercado Bom Preço Ltda',
    inicio: '',
    etapas: ['Lendo o arquivo do Nibo de 07:40', 'Casando 44 lançamentos com as contas', 'Separando o que precisa de conferência'],
    seg: 13,
    feitoSeg: 15,
    fim: { texto: 'Conciliei o extrato do Mercado Bom Preço: 41 de 44 lançamentos casaram. Os 3 que sobraram estão em Operação, para a Marina conferir.', aviso: 'Conciliação fechou o extrato do Mercado Bom Preço' },
  },
  {
    id: 'r-bpo-lembrete',
    integrante: 'i-bpo',
    setor: 'bpo_pagar',
    titulo: 'Lembrar o João Batista do lote de R$ 13.940',
    cliente: 'Padaria Pão Quente ME',
    inicio: '',
    etapas: ['Conferindo o lote e o horário de corte (17h)', 'Escrevendo o lembrete', 'Enviando pelo WhatsApp'],
    seg: 12,
    feitoSeg: 4,
    fim: {
      texto: 'Lembrei o João Batista pelo WhatsApp: o lote de R$ 13.940 da Padaria vence hoje às 17h e espera a aprovação dele no app.',
      crm: {
        conversa: 'cv2',
        texto: 'Oi, João! Passando para lembrar: o lote de pagamentos de R$ 13.940 da Padaria vence hoje às 17h e está esperando sua aprovação no app, em Aprovações.',
        resposta: { autor: 'João Batista', texto: 'Vi agora, aprovo depois do almoço.', digitarSeg: 3.5, depoisDeSeg: 5 },
      },
    },
  },
]

/** Fluxo para "Pedir ao integrante" numa tarefa: o específico, se houver; senão, um genérico pelo setor e situação. */
export function fluxoDaTarefa(t: Tarefa, integrante: string, nomeIntegrante: string): FluxoSimulado {
  if (t.codigo === 'CTB-016') return { ...fluxos['ctb-classificar'] }
  const aguardando = t.status === 'aguardando_cliente'
  return {
    id: `tarefa-${t.id}`,
    integrante,
    setor: t.setor,
    titulo: aguardando ? `Cobrar o cliente: ${t.titulo}` : t.titulo,
    cliente: t.cliente,
    inicio: aguardando ? `Vou cobrar ${t.cliente} pelo canal e contato do assunto.` : `Começando ${t.codigo} para ${t.cliente}.`,
    etapas: aguardando
      ? ['Vendo o que falta e há quanto tempo', 'Escolhendo o contato do assunto na ficha', 'Enviando a cobrança e marcando o retorno']
      : ['Abrindo a tarefa e o histórico do cliente', 'Juntando os documentos que já estão nas pastas', `Fazendo: ${t.titulo.toLowerCase()}`, 'Conferindo contra as regras do escritório'],
    seg: 2.2,
    fim: aguardando
      ? { texto: `Cobrei ${t.cliente} sobre "${t.titulo}". A tarefa continua aguardando o cliente; a resposta chega no CRM.`, aviso: `${nomeIntegrante} cobrou ${t.cliente}` }
      : { texto: `Concluí ${t.codigo} (${t.titulo}) de ${t.cliente}. O resultado está na tarefa e nas pastas do cliente.`, tarefaStatus: 'concluida', aviso: `${nomeIntegrante} concluiu ${t.codigo} · ${t.cliente}` },
  }
}

/** Respostas prontas para as perguntas das sugestões (no lugar do "resposta de exemplo"). */
export const respostasProntas: { re: RegExp; texto: string }[] = [
  { re: /fora do padr[ãa]o na concilia/i, texto: 'Na Metalúrgica, 3 de 214: 2 PIX sem identificação e 1 tarifa em duplicidade. Estão na tarefa CTB-016; posso classificar o que dá e perguntar o resto ao cliente.' },
  { re: /n[ãa]o mandaram extrato/i, texto: 'Faltam 3: Metalúrgica (Itaú), Café Central e Carlos Menezes. Posso pedir ao Atendimento para cobrar.' },
  { re: /PGDAS-D de outubro/i, texto: '14 prontos para transmitir (cartão aguardando você) e 2 esperando notas: Café Central e Padaria.' },
  { re: /guias que vencem/i, texto: 'Esta semana: 6 DAS (dia 20), ISS da Metalúrgica (dia 20) e o FGTS de 9 clientes (dia 20). Todas já enviadas; 2 ainda não foram vistas.' },
  { re: /admiss[õo]es da Metal/i, texto: 'Duas em andamento: o contrato de experiência do soldador está assinado; o do auxiliar espera o exame admissional.' },
  { re: /f[ée]rias vencendo/i, texto: '4 pessoas com férias vencendo em dezembro: 2 na Rota Sul e 2 na Metalúrgica. Posso propor as datas aos clientes.' },
  { re: /sem XML/i, texto: '3 notas de compra da Loja Bela Vista sem XML. Pedi ao cliente pelo app há 2 dias.' },
  { re: /certificado/i, texto: 'O A1 da Clínica Sorriso vence em 3 dias e o da Padaria em 9. A renovação da Clínica está como pendência no app.' },
  { re: /altera[çc][ãa]o contratual/i, texto: 'Minuta revisada; falta a assinatura dos dois sócios pelo app. Depois vai à Junta (prazo de 5 dias úteis).' },
  { re: /sem resposta h[áa] mais de 1 hora/i, texto: 'Duas: Rita Campos (ISS, 38 min fora do SLA) e um lead do site. Assumi o lead; a da Rita está com o Rafael.' },
  { re: /funil de leads/i, texto: 'Novembro: 11 leads, 4 em proposta, 2 fechados (R$ 2.900 de honorário somado). O site trouxe 6.' },
  { re: /honor[áa]rio vencido/i, texto: 'Loja Bela Vista (R$ 6.116, 3 dias) e a parcela do acordo da Padaria. A régua segue; o D+3 da Loja sai amanhã.' },
  { re: /caixa at[ée] o fim do m[êe]s/i, texto: 'Sobra projetada de R$ 41 mil no fim de novembro, com as cobranças de dezembro saindo dia 01. O ponto mais baixo é dia 20 (folha e impostos).' },
  { re: /no vermelho/i, texto: 'Duas: Loja Bela Vista (Bling parado há 26 h e caixa abaixo do mínimo) e AutoPeças Rota 9 (credencial do Conta Azul vencida).' },
  { re: /vence hoje sem aprova/i, texto: 'O lote da Padaria (R$ 13.940) vence hoje às 17h e ainda espera o João Batista. Lembrei por WhatsApp às 13h.' },
  { re: /caixa do Mercado/i, texto: 'R$ 96.400 nas duas contas, mínimo de R$ 40 mil. O lote de R$ 31.200 de amanhã cabe; depois dele sobram R$ 65.200.' },
  { re: /time fez ontem/i, texto: 'Ontem: 41 tarefas concluídas sozinhas, 12 preparadas para aprovação, 6 conversas respondidas e 2 passagens entre setores.' },
  { re: /aguardando documento/i, texto: '5 clientes: Padaria, Metalúrgica, Loja Bela Vista, Rota Sul e Clínica. Quer que o Atendimento cobre todos?' },
]
