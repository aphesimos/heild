/*
 * Apresentação da Heild — o conteúdo.
 *
 * Funciona como o site (app/src/site/paginas.ts, branch site): uma versão principal, genérica, com a marca
 * e o produto inteiro, e uma versão por plataforma, todas montadas no mesmo molde. Uma área nova (Jurídico,
 * Seguros…) é uma entrada a mais em `plataformas`; a versão dela aparece sozinha no menu e no endereço
 * (#juridico). Veja o exemplo comentado no fim de `plataformas` e o README da pasta.
 *
 * Regras do conteúdo (design system, seção Voz):
 * - Português do Brasil, frases curtas, voz ativa. Os integrantes falam na primeira pessoa.
 * - Nada inventado: a Heild não foi lançada; sem clientes, depoimentos ou números de uso.
 *   Os escritórios, empresas e pessoas das cenas são os fictícios do protótipo.
 * - Valores e datas no padrão brasileiro (R$ 8.420,00; 20/11).
 */
(function () {
  'use strict';

  /* ---------- os integrantes (design-system/orbs.md) ---------- */
  // `cor` e `olho` são nomes de tokens: a cor é lida do tema na hora (o Assistente troca no escuro).
  var integrantes = {
    assistente: { nome: 'Assistente', cor: '--orb-assistente', olho: '--olho-assistente', area: 'Todas as áreas', faz: 'Recebe qualquer pedido, divide entre o time e acompanha até o fim.' },
    consultor: { nome: 'Consultor', cor: '--orb-consultor', area: 'Lei e reforma', faz: 'Responde sobre a lei com o artigo, a data e o grau de segurança.' },
    fiscal: { nome: 'Fiscal', cor: '--orb-fiscal', area: 'Contábil', faz: 'Apura os tributos, gera as guias e prepara as transmissões.' },
    dp: { nome: 'DP', cor: '--orb-dp', area: 'Contábil', faz: 'Prepara admissões, a folha e os envios ao eSocial.' },
    contabil: { nome: 'Contábil', cor: '--orb-contabil', area: 'Contábil', faz: 'Concilia, classifica e fecha o mês com o balancete.' },
    societario: { nome: 'Societário', cor: '--orb-societario', area: 'Contábil', faz: 'Cuida do cadastro na Receita, dos certificados e das exigências da Junta.' },
    notas: { nome: 'Notas', cor: '--orb-notas', area: 'Contábil', faz: 'Captura as notas do mês e confere a tributação.' },
    atendimento: { nome: 'Atendimento', cor: '--orb-atendimento', area: 'Todas as áreas', faz: 'Fala com o cliente no WhatsApp, cobra documentos e tria as conversas.' },
    financeiro: { nome: 'Financeiro', cor: '--orb-financeiro', area: 'O financeiro do escritório', faz: 'Prepara as cobranças, os contratos e as contas do próprio escritório.' },
    bpo_pagar: { nome: 'Contas a Pagar', cor: '--orb-bpo-pagar', area: 'BPO', faz: 'Monta os lotes de pagamento e confere fornecedor novo.' },
    bpo_receber: { nome: 'Contas a Receber', cor: '--orb-bpo-receber', area: 'BPO', faz: 'Emite os boletos e acompanha os recebimentos de cada empresa.' },
    bpo_conciliacao: { nome: 'Conciliação', cor: '--orb-bpo-conciliacao', area: 'BPO', faz: 'Concilia o extrato e separa o que precisa de uma pessoa.' },
    bpo_gerencial: { nome: 'Gerencial', cor: '--orb-bpo-gerencial', area: 'BPO', faz: 'Fecha o relatório financeiro do mês de cada empresa.' }
  };

  /* ---------- as formas do I (design-system/README.md, "As formas") ---------- */
  var formas = [
    { id: 'centralizar', nome: 'Centralizar', forma: 'Grade de 9 pontos que volta a ser uma peça só', uso: 'A animação principal: hero, abertura, splash' },
    { id: 'orb', nome: 'Orb', forma: 'O I vira uma esfera com olhos recortados', uso: 'Presença do Assistente, telas de IA' },
    { id: 'orbs', nome: 'Orbs', forma: 'O orb se divide como uma célula em três', uso: 'Os integrantes, o time de IA' },
    { id: 'ia', nome: 'IA', forma: 'Três cópias do I em leque, girando 60°', uso: 'O agente começou a trabalhar' },
    { id: 'contabil', nome: 'Contábil', forma: 'Três barras crescentes na linha de base', uso: 'Módulo contábil, fechamento concluído' },
    { id: 'bpo', nome: 'BPO', forma: 'Duas cápsulas formam um check', uso: 'Rotina entregue, tarefa concluída' },
    { id: 'financeiro', nome: 'Financeiro', forma: 'Um $ em zigue-zague', uso: 'Financeiro, cobrança, pagamentos' },
    { id: 'juridico', nome: 'Jurídico', forma: 'O I tomba e vira um sinal de igual', uso: 'Jurídico e conformidade' },
    { id: 'painel', nome: 'Painel', forma: 'Grade bento: coluna alta, barras e pontos', uso: 'Painel, widgets' },
    { id: 'conversa', nome: 'Conversa', forma: 'Balão de fala com rabicho', uso: 'CRM, conversa com o cliente' },
    { id: 'atendimento', nome: 'Atendimento', forma: 'Três pontos pulando em onda', uso: 'Chat, alguém digitando' },
    { id: 'tempo', nome: 'Tempo', forma: 'Ampulheta que vira 180°', uso: 'Timesheet, prazos, horas' },
    { id: 'arquivos', nome: 'Arquivos', forma: 'Pasta em contorno, com aba', uso: 'Arquivos, documentos' },
    { id: 'celular', nome: 'Celular', forma: 'O aparelho, com um ponto como botão', uso: 'App do cliente' },
    { id: 'lupa', nome: 'Lupa', forma: 'Lente octogonal com cabo, que varre', uso: 'Consultor, análise, busca' },
    { id: 'equipe', nome: 'Equipe', forma: 'Três pessoas em onda de aceno', uso: 'Integrantes, o time' }
  ];

  /* ---------- peças comuns às versões ---------- */
  var comum = {
    principios: {
      tipo: 'regras', capitulo: 'Fecho', curto: 'Princípios',
      titulo: 'Quatro princípios do produto.',
      itens: [
        ['A IA faz e a pessoa aprova.', 'Tudo que tem efeito fora do escritório passa por um cartão.'],
        ['Um sistema, um fato.', 'O que acontece em um módulo aparece em todos os outros, sem digitar duas vezes.'],
        ['Afirmação legal só com fonte conferida.', 'Sem fonte, a resposta diz que não encontrou.'],
        ['Substituir, não somar.', 'Cada módulo existe para desligar uma ferramenta que o escritório paga hoje.']
      ],
      numerado: true,
      notas: 'Os quatro princípios do PRODUCT.md. Eles decidem o que entra e o que não entra no produto.'
    },
    marcabranca: {
      tipo: 'marcabranca', capitulo: 'O produto', curto: 'Marca branca',
      titulo: 'A marca do escritório, por dentro.',
      frase: 'No sistema e no app do cliente, cada escritório mostra o próprio nome, as cores e as fontes. Até o nome dos integrantes vem do tema. Fora do produto, é sempre Heild.',
      // Os temas de exemplo do protótipo (app/src/theme/temas.ts, branch prototipo).
      temas: [
        { id: 'fabrica', nome: 'Heild', rotulo: 'Heild, de fábrica', sigla: 'HE', titulo: 'var(--font-titulo)', texto: 'var(--font-texto)', raio: '17px',
          claro: { primaria: '#24211f', fundo: '#fefbf9', texto: '#2e2b28', destaque: '#4f5bf5' },
          escuro: { primaria: '#faf6f3', fundo: '#24211f', texto: '#faf6f3', destaque: '#4f5bf5' },
          dp: 'DP', dpCor: '#3d86f7' },
        { id: 'horizonte', nome: 'Horizonte Contábil', rotulo: 'Horizonte Contábil', sigla: 'H', titulo: 'Georgia, ui-serif, serif', texto: 'ui-sans-serif, system-ui, sans-serif', raio: '16px',
          claro: { primaria: '#1f4fd8', fundo: '#f7f8fb', texto: '#111827', destaque: '#f97316' },
          escuro: { primaria: '#6d8dff', fundo: '#0b1020', texto: '#e5e7eb', destaque: '#f97316' },
          dp: 'DP', dpCor: '#3d86f7' },
        { id: 'verde', nome: 'Verde Campo Assessoria', rotulo: 'Verde Campo Assessoria', sigla: 'VC', titulo: 'ui-rounded, ui-sans-serif, system-ui, sans-serif', texto: 'ui-sans-serif, system-ui, sans-serif', raio: '6px',
          claro: { primaria: '#166534', fundo: '#fbfaf6', texto: '#1c1917', destaque: '#ca8a04' },
          escuro: { primaria: '#4ade80', fundo: '#0c120e', texto: '#ecfdf5', destaque: '#ca8a04' },
          dp: 'Pessoal', dpCor: '#22c55e' }
      ],
      notas: 'Os três temas de exemplo do protótipo. No Verde Campo, o DP se chama Pessoal: o nome do integrante vem do tema.'
    },
    lei: {
      tipo: 'lei', capitulo: 'O time', curto: 'O Consultor',
      titulo: 'A lei, com o artigo e a data.',
      frase: 'O Consultor responde pela redação que vale na data do fato, com o trecho citado e o grau de segurança. Sem base, ele diz que não encontrou.',
      pergunta: 'A Clínica Sorriso pode usar o fator R em 2027?',
      resposta: 'Sim, se a Clínica optar pelo Simples Nacional em janeiro de 2027. Odontologia é atividade sujeita ao fator R e a folha da Clínica é 31,2% da receita dos últimos 12 meses, acima dos 28%. Com isso, ela seria tributada pelo Anexo III, e não pelo Anexo V.',
      trecho: 'As atividades de prestação de serviços a que se refere o § 5º-I serão tributadas na forma do Anexo III desta Lei Complementar caso a razão entre a folha de salários e a receita bruta da pessoa jurídica seja igual ou superior a 28% (vinte e oito por cento).',
      norma: 'LC 123/2006, art. 18, § 5º-J',
      vigencia: 'vigente desde 01/01/2018',
      hierarquia: 'Lei complementar',
      grau: 'Segurança alta',
      calculo: 'Folha ÷ receita em 12 meses: 31,2%',
      outra: { texto: 'O raciocínio do Consultor tem uma apresentação própria', href: 'https://claude.ai/artifact/KAoX3eHe3TXr3HmbLskqgU' },
      notas: 'A mesma resposta da demonstração do site. O método do Consultor (base legal por vigência, citação conferida, abstenção) tem a apresentação própria, no link.'
    }
  };

  /* ---------- as plataformas ---------- */
  var plataformas = {
    contabil: {
      id: 'contabil',
      nome: 'Heild Contábil',
      forma: 'contabil',
      resumo: 'Fiscal, DP, contábil, societário e notas, com o Painel de cada setor e o integrante que prepara o trabalho dele.',
      chamada: {
        titulo: 'Também cuida da contabilidade?',
        frase: 'A Heild Contábil entra no mesmo sistema, sobre o mesmo cadastro: o Painel de cada setor e um integrante para cada um.',
        itens: ['Fiscal, DP, contábil, societário e notas', 'O calendário de obrigações de cada cliente', 'O Consultor, com a lei e a data', 'Timesheet e rentabilidade por cliente']
      },
      abertura: {
        titulo: 'O escritório contábil inteiro, com um time que faz.',
        frase: 'Fiscal, DP, contábil, societário e notas, cada setor com o seu Painel e o seu integrante. Ele prepara, concilia, cobra e responde; você aprova.'
      },
      luz: ['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas'],
      legendas: [
        { quem: 'contabil', estado: 'trabalhando', texto: 'está conciliando os 214 lançamentos de outubro da Metalúrgica' },
        { quem: 'fiscal', estado: 'precisa_de_voce', texto: 'deixou as guias de outubro da Metalúrgica para você aprovar' },
        { quem: 'consultor', estado: 'pensando', texto: 'está lendo a LC 123 para o fator R da Clínica Sorriso' },
        { quem: 'dp', estado: 'concluido', texto: 'preparou os contratos de experiência da Padaria' },
        { quem: 'atendimento', estado: 'trabalhando', texto: 'está cobrando os documentos de admissão do João Batista' }
      ],
      problema: {
        titulo: 'Um escritório espalhado em vinte sistemas.',
        frase: 'Prazos num sistema, conversas no celular, horas numa planilha, guias em outro portal. Cada um com o seu cadastro e a sua senha.',
        ferramentas: ['HubStrom', 'Acessórias', 'Nibo Obrigações', 'Domínio Processos', 'Gestta', 'Onvio Portal', 'Qive', 'SIEG', 'Conexa', 'Omie', 'Conta Azul', 'WhatsApp', 'E-mail', 'Drive', 'Planilha de horas', 'e-CAC', 'eSocial', 'DTE estadual', 'Portal da prefeitura', 'Emissor de NFS-e']
      },
      camadas: ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'Arquivos', 'App do cliente'],
      time: [
        { nome: 'Fixos no topo', ids: ['assistente', 'consultor'] },
        { nome: 'Contábil', ids: ['fiscal', 'dp', 'contabil', 'societario', 'notas'] },
        { nome: 'De todas as áreas', ids: ['atendimento', 'financeiro'] }
      ],
      timeFrase: 'Um integrante em cada setor do escritório, com o Consultor para as perguntas sobre a lei. Cada um tem o seu chat, a sua fila e a memória do que já fez.',
      orbEstados: 'contabil',
      passagem: {
        pedido: 'Feche outubro da Metalúrgica Andrade',
        resposta: 'Dividi em duas partes: o Contábil concilia e gera o balancete; depois o Fiscal apura o ISS e o PIS/COFINS. Vou acompanhando aqui.',
        cadeia: [
          { quem: 'contabil', tarefa: 'Fechar outubro da Metalúrgica Andrade', etapas: ['Conciliando 214 lançamentos do Itaú', 'Classificando o que bateu com regra aprovada', 'Gerando o balancete de outubro'],
            fim: 'Conciliação fechada: 211 de 214 casados, os 3 restantes na tarefa CTB-016. Balancete gerado. Passei ao Fiscal para apurar o ISS e o PIS/COFINS.' },
          { quem: 'fiscal', tarefa: 'Apurar ISS e PIS/COFINS de outubro', etapas: ['Lendo as notas de saída e o balancete', 'Apurando ISS (São Paulo) e PIS/COFINS cumulativo', 'Gerando as guias'],
            fim: 'Apuração pronta: ISS R$ 4.812,40 (vence 20/11) e PIS/COFINS R$ 7.215,90 (vence 25/11). Aprove para eu enviar à Rita pelo app.' }
        ],
        final: 'Outubro da Metalúrgica está fechado e confere. Só falta você aprovar o envio das guias à Rita.',
        tabela: [['Conciliação Itaú', '211 de 214 casados'], ['Balancete 10/2026', 'gerado, nas pastas'], ['ISS municipal', 'R$ 4.812,40'], ['PIS/COFINS', 'R$ 7.215,90']],
        cartao: { quem: 'fiscal', titulo: 'Enviar as guias de outubro da Metalúrgica ao cliente', campos: [['ISS', 'R$ 4.812,40 · vence 20/11'], ['PIS/COFINS', 'R$ 7.215,90 · vence 25/11'], ['Para', 'Rita Campos, pelo app']] }
      },
      aprovacao: {
        quem: 'fiscal', estado: 'pede a sua aprovação · expira em 2 dias',
        titulo: 'Transmitir o PGDAS-D de outubro', sub: '14 clientes do Simples Nacional',
        campos: [['Competência', '10/2026'], ['Total de DAS', 'R$ 38.402,15']],
        aprovador: 'Ana Souza',
        depois: { tipo: 'progresso', total: 14, rotulo: 'transmitidas' }
      },
      lei: true,
      recursos: [
        {
          tipo: 'tela', curto: 'Painel',
          titulo: 'Cada setor com o seu Painel.',
          frase: 'Uma aba por setor, com as pendências, as ações e as tarefas de cada um, e o integrante do setor no cabeçalho. O calendário sai do perfil do cliente cruzado com as regras vigentes.',
          abas: [
            { nome: 'Fiscal', quem: 'fiscal', estado: 'trabalhando', fala: 'Conferi as DCTFWeb de outubro: cinco batem com a folha, uma corrigida.', linhas: [
              ['PGDAS-D de outubro', '14 clientes prontos; 2 de fora', 'atencao', 'Pede aprovação', ''],
              ['Guias de outubro da Metalúrgica', 'ISS e PIS/COFINS', 'atencao', 'Pede aprovação', 'R$ 12.028,30'],
              ['Conferir as DCTFWeb 10/2026', '6 clientes · 1 corrigida', 'sucesso', 'Concluído', ''],
              ['Ler o DTE da SEFAZ-SP', '12 clientes · nenhuma notificação nova', 'sucesso', 'Concluído', '']] },
            { nome: 'Trabalhista e DP', quem: 'dp', estado: 'concluido', fala: 'Os contratos de experiência da Padaria estão prontos.', linhas: [
              ['Admissão de 2 funcionários da Padaria', 'contratos prontos · S-2200 antes do 1º dia', 'atencao', 'Aguard. cliente', ''],
              ['Prévia da folha de novembro', '', 'neutro', 'Em andamento', ''],
              ['Documentos de admissão', 'João Batista · Padaria Pão Quente', 'neutro', 'Com o Atendimento', '']] },
            { nome: 'Contábil', quem: 'contabil', estado: 'trabalhando', fala: 'Fechei outubro da Metalúrgica: 211 de 214 casados.', linhas: [
              ['Fechamento de outubro · Metalúrgica', '211 de 214 lançamentos casados', 'sucesso', 'Concluído', ''],
              ['CTB-016 · 3 lançamentos fora do padrão', 'para classificar', 'atencao', 'Pede decisão', ''],
              ['Classificar o PIX de R$ 1.200', 'com a resposta da Rita', 'neutro', 'Em andamento', ''],
              ['Conciliar os 23 lançamentos do Itaú de hoje', '', 'neutro', 'Em andamento', '']] },
            { nome: 'Notas fiscais', quem: 'notas', estado: 'trabalhando', fala: 'Estou capturando as notas de entrada de outubro.', linhas: [
              ['Capturar as notas de entrada de outubro', 'SEFAZ e prefeituras', 'neutro', 'Em andamento', ''],
              ['Checagem semanal do ISS', '', 'sucesso', 'Concluído', '']] },
            { nome: 'Clientes e Societário', quem: 'societario', estado: 'precisa_de_voce', fala: 'Montei a resposta à exigência da JUCESP para você revisar.', linhas: [
              ['Resposta à exigência da JUCESP', 'pronta para revisar', 'atencao', 'Pede decisão', ''],
              ['Conferir o cadastro de 142 clientes na Receita', 'divergência Receita × cadastro', 'neutro', 'Em andamento', '']] },
            { nome: 'Consultoria e Reforma', quem: 'consultor', estado: 'concluido', fala: 'Respondi o fator R da Clínica Sorriso para 2027.', linhas: [
              ['Fator R da Clínica Sorriso em 2027', 'Anexo III, com folha de 31,2%', 'sucesso', 'Respondido', ''],
              ['Sublimite do Simples da Loja Bela Vista', 'projeção da receita de 2026', 'neutro', 'Em andamento', '']] }
          ],
          notas: 'O Painel do protótipo tem oito abas; aqui estão seis. As tarefas são as da demonstração viva.'
        },
        {
          tipo: 'conversa', curto: 'CRM',
          titulo: 'O WhatsApp, no fio do cliente.',
          frase: 'Um número por setor, a conversa ligada ao cadastro e o chat do app no mesmo fio. O Atendimento responde com o dado certo, e a conversa vira tarefa.',
          contato: 'Rita Campos', empresa: 'Metalúrgica Andrade Ltda', canal: 'WhatsApp · Fiscal',
          mensagens: [
            { de: 'cliente', texto: 'Minha guia saiu?', hora: '09:12' },
            { de: 'escritorio', quem: 'atendimento', texto: 'Saiu, Rita. Seguem as guias de outubro: ISS de R$ 4.812,40, vence 20/11, e PIS/COFINS de R$ 7.215,90, vence 25/11.', anexo: 'Guias 10-2026.pdf', hora: '09:12' },
            { de: 'cliente', texto: 'Obrigada! Já mando para o banco.', hora: '09:14' }
          ],
          ficha: [['Cliente', 'Metalúrgica Andrade Ltda'], ['Contato', 'Rita Campos · financeiro · opt-in'], ['Responsável', 'Fiscal: Fernanda']],
          funil: { etapas: ['Lead', 'Qualificado', 'Proposta', 'Contrato', 'Implantação'], de: 0, para: 1, rotulo: 'Lead que chegou pelo site' },
          notas: '"Minha guia saiu?" é o exemplo do subplano do CRM: a resposta vai com a guia do mês anexada.'
        },
        {
          tipo: 'timesheet', curto: 'Timesheet',
          titulo: 'O tempo se registra sozinho.',
          frase: 'A plataforma, os sistemas contábeis e a extensão contam o tempo de cada tarefa. A pessoa só confirma o que ficou estimado, e o custo de cada cliente aparece contra o honorário.',
          notas: 'A conta é o exemplo do plano: custo-hora de R$ 300, 2 horas por mês, honorário de R$ 500.'
        },
        {
          tipo: 'tela', curto: 'Financeiro',
          titulo: 'O financeiro do próprio escritório.',
          frase: 'Contratos, cobrança, contas a pagar, conciliação e resultado, com o custo vindo das horas medidas. Aprovar agenda no banco; a liberação final é sempre de uma pessoa.',
          abas: [
            { nome: 'Cobranças', quem: 'financeiro', estado: 'precisa_de_voce', fala: 'O ciclo de novembro está pronto para você revisar.', linhas: [
              ['Ciclo de cobrança de novembro', 'o que mudou desde outubro', 'atencao', 'Pede aprovação', ''],
              ['Preparar as cobranças de dezembro', '', 'neutro', 'Em andamento', ''],
              ['Quem está devendo', 'proposta de acordo dentro da política', 'neutro', 'Para revisar', '']] },
            { nome: 'Contratos', quem: 'financeiro', estado: 'trabalhando', fala: 'Separei quem passou da faixa contratada.', linhas: [
              ['Clientes acima da faixa', 'propor aditivo ou cobrar como extra', 'atencao', 'Pede decisão', ''],
              ['Campanha de reajuste', 'índice, carta e envio, com aprovação', 'neutro', 'Em preparo', '']] },
            { nome: 'Contas a pagar', quem: 'financeiro', estado: 'precisa_de_voce', fala: 'As contas da semana estão na sua alçada.', linhas: [
              ['Contas da semana', 'Gestor aprova até R$ 5 mil', 'atencao', 'Pede aprovação', ''],
              ['Liberação no banco', 'sempre de uma pessoa', 'neutro', 'Depois da aprovação', '']] },
            { nome: 'Conciliação', quem: 'financeiro', estado: 'concluido', fala: 'As sugestões seguras podem ser aceitas em lote.', linhas: [
              ['Sugestões seguras', 'aceite em lote', 'sucesso', 'Prontas', ''],
              ['Recebimentos sem cobrança', 'para vincular', 'atencao', 'Pede decisão', '']] },
            { nome: 'Resultado', quem: 'financeiro', estado: 'disponivel', fala: 'O DRE já usa o custo das horas do Timesheet.', linhas: [
              ['DRE gerencial por setor', 'custo vindo do Timesheet', 'neutro', 'Atualizado', ''],
              ['Orçado × realizado', 'por centro de custo', 'neutro', 'Atualizado', '']] }
          ],
          notas: 'As sete abas do Financeiro seguem o subplano 09. Alçada: Gestor até R$ 5 mil, Administrador acima.'
        },
        {
          tipo: 'app', curto: 'App do cliente',
          titulo: 'O cliente resolve pelo celular.',
          frase: 'Documentos, pendências, guias e a conversa com o escritório, no app com a marca do escritório. Abrir ou baixar fica registrado do lado de cá.',
          empresa: 'Metalúrgica Andrade', ola: 'Olá, Rita.',
          itens: [
            { titulo: 'Guias de outubro', linhas: [['ISS · vence 20/11', 'R$ 4.812,40'], ['PIS/COFINS · vence 25/11', 'R$ 7.215,90']], acao: 'Baixar as guias', evento: ['Rita baixou as guias de outubro', 'O registro de entrega está em Arquivos.'] },
            { titulo: 'Pendência: extrato de outubro do Itaú', sub: 'O Contábil precisa para fechar o mês.', acao: 'Enviar o extrato', evento: ['Rita enviou o extrato de outubro', 'A pendência ficou como recebida no Painel.'] }
          ],
          notas: 'No protótipo, o app abre num aparelho de 390 px e, ao lado, o que chega ao escritório.'
        }
      ],
      tambem: ['bpo'],
      umfato: {
        titulo: 'Um sistema, um fato.',
        frase: 'O cadastro é um só e todo efeito vira um evento. O que acontece num lado aparece em todos os outros, sem ninguém digitar de novo.',
        evento: 'A Rita baixou as guias de outubro no app.', sub: 'Metalúrgica Andrade · 14:10',
        destinos: [['Arquivos', 'Registro de entrega com data e hora'], ['Painel', 'Guia marcada como lida na aba Fiscal'], ['CRM', 'Aparece no fio da conversa da Metalúrgica'], ['Assistente', 'Aviso: guias de outubro entregues'], ['Tarefas', 'O envio das guias fica concluído']]
      },
      conectores: {
        titulo: 'Ligado ao que o escritório já usa.',
        frase: 'Governo, sistemas contábeis, bancos e WhatsApp. O caminho sem o certificado do cliente vem primeiro, e abrir uma caixa postal nunca é automático.',
        aneis: [
          ['Integra Contador', 'e-CAC', 'eSocial', 'EFD-Reinf', 'SEFAZ', 'NFS-e Nacional', 'DTE estadual', 'Prefeituras'],
          ['WhatsApp', 'E-mail', 'Domínio', 'Alterdata', 'Questor', 'Contmatic', 'Open Finance', 'Drive', 'OneDrive', 'ZapSign', 'Google Agenda']
        ],
        grupos: [
          ['Governo federal', 'Integra Contador (SERPRO) para PGDAS-D, DAS e DCTFWeb; e-CAC assistido; eSocial; EFD-Reinf.'],
          ['Estados e municípios', 'SEFAZ, DTEs estaduais, NFS-e Nacional e as prefeituras.'],
          ['Sistemas contábeis', 'Alterdata por API; Domínio, Questor e Contmatic por arquivo e relatório.'],
          ['Mercado', 'WhatsApp oficial com coexistência, e-mail, bancos, assinatura e as nuvens do escritório.']
        ]
      },
      fecho: 'Veja a Heild Contábil no seu escritório.'
    },

    bpo: {
      id: 'bpo',
      nome: 'Heild BPO',
      forma: 'bpo',
      resumo: 'Contas a pagar, lotes com a aprovação do cliente no app, conciliação e o relatório do mês, para quem faz o financeiro dos clientes.',
      // Como a plataforma aparece "por cima", dentro da versão de outra área (slide `outra`).
      chamada: {
        titulo: 'Também faz o financeiro dos clientes?',
        frase: 'A Heild BPO entra no mesmo sistema, sobre o mesmo cadastro: um integrante para cada função do financeiro e o lote aprovado pelo cliente no app.',
        itens: ['Contas a pagar com lote aprovado pelo cliente no app', 'Conciliação no ERP que cada empresa já usa', 'Relatório financeiro do mês, pelo Gerencial', 'Quem digita nunca confere']
      },
      abertura: {
        titulo: 'O financeiro dos seus clientes, num lugar só.',
        frase: 'Contas a pagar, contas a receber, conciliação e gerencial, cada função com o seu integrante. Eles montam, conferem e relatam; o cliente aprova no app, e quem digita nunca confere.'
      },
      luz: ['bpo_receber', 'bpo_pagar', 'atendimento', 'bpo_conciliacao', 'bpo_gerencial'],
      legendas: [
        { quem: 'bpo_pagar', estado: 'concluido', texto: 'montou o lote de sexta da Padaria: 4 contas, R$ 8.420' },
        { quem: 'atendimento', estado: 'trabalhando', texto: 'está avisando o João Batista do lote pelo WhatsApp' },
        { quem: 'bpo_conciliacao', estado: 'trabalhando', texto: 'está conciliando outubro do Studio Forma: 59 de 62 casados' },
        { quem: 'bpo_receber', estado: 'trabalhando', texto: 'está emitindo os boletos de convênio de novembro da Clínica Sorriso' },
        { quem: 'bpo_gerencial', estado: 'concluido', texto: 'entregou o relatório financeiro de outubro da Clínica Sorriso' }
      ],
      problema: {
        titulo: 'Cada cliente, um sistema diferente.',
        frase: 'Um ERP por empresa, o banco de cada uma, a aprovação por mensagem e o relatório do mês montado à mão.',
        ferramentas: ['Conta Azul', 'Omie', 'Bling', 'Nibo', 'Granatum', 'Internet banking', 'Extrato OFX', 'Arquivo CNAB', 'DDA', 'WhatsApp', 'E-mail', 'Planilha de lotes', 'Planilha de conciliação', 'Relatório do mês', 'Boletos', 'Pix', 'Comprovantes', 'Drive', 'Agenda de vencimentos', 'Aprovação por mensagem']
      },
      camadas: ['Fila', 'Rotinas', 'Aprovações', 'Conciliação', 'Entregas', 'App do cliente'],
      time: [
        { nome: 'Fixos no topo', ids: ['assistente', 'consultor'] },
        { nome: 'BPO financeiro', ids: ['bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'] },
        { nome: 'De todas as áreas', ids: ['atendimento'] }
      ],
      timeFrase: 'Um integrante por função do financeiro, como numa equipe de BPO: cada um com a sua fila e a sua memória. O Atendimento fala com o cliente no contato certo.',
      orbEstados: 'bpo_conciliacao',
      passagem: {
        pedido: 'Monte o lote de pagamentos de sexta da Padaria',
        resposta: 'Passei ao Contas a Pagar, que monta o lote e confere o fornecedor novo; depois o Atendimento avisa o João Batista. Vou acompanhando aqui.',
        cadeia: [
          { quem: 'bpo_pagar', tarefa: 'Montar o lote de sexta da Padaria', etapas: ['Lendo as contas capturadas (DDA, e-mail e WhatsApp)', 'Conferindo os dados bancários do fornecedor novo', 'Montando o lote e conferindo a alçada do João', 'Mandando o lote para aprovação no app'],
            fim: 'Lote montado: 4 contas, R$ 8.420. A Distribuidora Trigal é fornecedor novo: o Lucas digitou e a Marina conferiu por ligação. Mandei para o João aprovar no app.' },
          { quem: 'atendimento', tarefa: 'Avisar o João do lote de sexta', etapas: ['Abrindo a conversa da Padaria no CRM', 'Escrevendo o aviso com o valor e o prazo', 'Enviando pelo WhatsApp'],
            fim: 'Avisei o João Batista: o lote de sexta, de R$ 8.420, está no app esperando a aprovação dele. A resposta cai no CRM.' }
        ],
        final: 'O lote de sexta da Padaria está com o João no app. O banco só libera depois da aprovação dele.',
        tabela: [['Moinho Santa Clara', 'R$ 3.860,00'], ['Distribuidora Trigal (novo)', 'R$ 2.140,00'], ['Enel', 'R$ 1.490,00'], ['Embalagens Paulista', 'R$ 930,00']],
        cartao: { quem: 'bpo_pagar', titulo: 'Lote de sexta · Padaria Pão Quente', campos: [['Contas', '4 · vencem 20/11'], ['Total', 'R$ 8.420,00'], ['Aprova', 'João Batista, no app']], selo: 'Aguard. cliente' }
      },
      aprovacao: {
        quem: 'bpo_pagar', estado: 'aguarda a aprovação do cliente, no app',
        titulo: 'Aprovar o lote de sexta', sub: 'Padaria Pão Quente · 4 contas · vencem 20/11',
        campos: [['Fornecedor novo', 'conferido por duas pessoas'], ['Total', 'R$ 8.420,00']],
        aprovador: 'João Batista',
        depois: { tipo: 'texto', texto: 'Agora o João libera no banco. Pagar nunca é automático.' }
      },
      recursos: [
        {
          tipo: 'regras', curto: 'Três regras',
          titulo: 'Três regras que não se dobram.',
          itens: [
            ['A plataforma não toca o dinheiro.', 'O pagamento sai do banco da empresa. A Heild prepara, registra e acompanha.'],
            ['Quem digita não aprova, e quem aprova não paga.', 'O botão de conferir fica desligado para quem lançou a conta, com o motivo.'],
            ['Nenhum pagamento sai sem aprovação humana registrada.', 'Pagar e transferir nunca viram automáticos, nem com o tempo.']
          ],
          notas: 'As três regras do subplano 10. Pagar e transferir são "nunca promovíveis": o integrante não ganha autonomia para isso.'
        },
        {
          tipo: 'tela', curto: 'Gestão por exceção',
          titulo: 'Gestão por exceção.',
          frase: 'A Visão geral abre pelo que precisa de decisão, com o semáforo da auditoria de cada empresa. O resto anda sozinho, no ERP de cada uma.',
          abas: [
            { nome: 'Visão geral', quem: 'assistente', estado: 'disponivel', fala: 'Duas empresas pedem você hoje; as outras estão em dia.', linhas: [
              ['Studio Forma', '3 lançamentos para conferir', 'atencao', 'Pede decisão', ''],
              ['Padaria Pão Quente', 'lote de sexta no app', 'atencao', 'Aguard. cliente', 'R$ 8.420,00'],
              ['Mercado Bom Preço', 'extrato conciliado', 'sucesso', 'Em dia', ''],
              ['AutoPeças Rota 9', 'rotina do dia concluída', 'sucesso', 'Em dia', '']] },
            { nome: 'Fila', quem: 'bpo_pagar', estado: 'trabalhando', fala: 'Conferi o fornecedor novo da Padaria com a Marina.', linhas: [
              ['Lembrar o João Batista do lote', 'com o Atendimento', 'neutro', 'Em andamento', 'R$ 13.940,00'],
              ['Fornecedor novo: Distribuidora Trigal', 'Lucas digitou · Marina conferiu', 'sucesso', 'Conferido', '']] },
            { nome: 'Rotinas', quem: 'bpo_conciliacao', estado: 'precisa_de_voce', fala: 'Separei 3 lançamentos do Studio Forma para você conferir.', linhas: [
              ['Conciliar outubro do Studio Forma', '59 de 62 casados', 'atencao', 'Pede decisão', ''],
              ['Conciliar o extrato do Mercado Bom Preço', '', 'neutro', 'Em andamento', '']] },
            { nome: 'Aprovações', quem: 'bpo_pagar', estado: 'precisa_de_voce', fala: 'O lote de sexta está com o João no app.', linhas: [
              ['Lote de sexta · Padaria Pão Quente', '4 contas · o João aprova no app', 'atencao', 'Aguard. cliente', 'R$ 8.420,00']] },
            { nome: 'Entregas', quem: 'bpo_gerencial', estado: 'concluido', fala: 'Entreguei o relatório de outubro da Clínica Sorriso.', linhas: [
              ['Relatório financeiro de outubro', 'Clínica Sorriso', 'sucesso', 'Entregue', '']] }
          ],
          notas: 'As abas do BPO no protótipo: Visão geral, Carteira, Fila, Rotinas, Aprovações, Entregas, Volume, Rentabilidade e Configuração.'
        },
        {
          tipo: 'conversa', curto: 'O cliente no WhatsApp',
          titulo: 'O cliente sabe na hora.',
          frase: 'O Atendimento escreve no WhatsApp do contato de pagamentos da ficha. A resposta cai no CRM, ligada à empresa e ao lote.',
          contato: 'João Batista', empresa: 'Padaria Pão Quente ME', canal: 'WhatsApp · BPO',
          mensagens: [
            { de: 'escritorio', quem: 'atendimento', texto: 'Oi, João! O lote de pagamentos de sexta da Padaria (4 contas, R$ 8.420) está no app, em Aprovações. O banco só libera depois da sua aprovação.', hora: '14:05' },
            { de: 'cliente', texto: 'Vi aqui. Aprovo hoje à tarde.', hora: '14:08' }
          ],
          ficha: [['Empresa', 'Padaria Pão Quente ME'], ['Contato', 'João Batista · pagamentos · opt-in'], ['ERP', 'Conta Azul, por API']],
          notas: 'A mesma conversa da demonstração do BPO no site.'
        },
        {
          tipo: 'app', curto: 'App do cliente',
          titulo: 'O cliente aprova pelo celular.',
          frase: 'Quem tem alçada vê "Pagamentos para aprovar" no início do app: aprova, edita ou recusa. A decisão chega ao escritório com o nome dele.',
          empresa: 'Padaria Pão Quente', ola: 'Olá, João.',
          itens: [
            { titulo: 'Pagamentos para aprovar', sub: 'Lote de sexta · 4 contas · vencem 20/11', linhas: [['Total', 'R$ 8.420,00']], acao: 'Aprovar', evento: ['João aprovou o lote de sexta', 'Agora ele libera no banco.'] },
            { titulo: 'Fluxo de caixa', sub: 'Saldos e o previsto da semana.', acao: 'Ver o fluxo', evento: ['João abriu o fluxo de caixa', 'Fica no registro do escritório.'] }
          ],
          notas: 'No M1 o cliente libera no banco depois de aprovar e toca em "Já liberei no banco".'
        }
      ],
      tambem: [],
      umfato: {
        titulo: 'Um sistema, um fato.',
        frase: 'A aprovação do cliente vira um evento. Ela aparece na fila, na conversa e no aviso do Assistente, sem ninguém digitar de novo.',
        evento: 'O João aprovou o lote de sexta no app.', sub: 'Padaria Pão Quente · 16:40',
        destinos: [['Aprovações', 'Lote aprovado, com o nome dele e a hora'], ['CRM', 'A resposta cai na conversa da Padaria'], ['Fila', 'A tarefa do lote fica concluída'], ['Assistente', 'Aviso: lote de sexta aprovado']]
      },
      conectores: {
        titulo: 'No ERP que o cliente já usa.',
        frase: 'A Heild orquestra; o lançamento fica no ERP de cada empresa. Os extratos chegam pelo banco, e a conversa pelo WhatsApp.',
        aneis: [
          ['Conta Azul', 'Omie', 'Bling', 'Nibo', 'Granatum'],
          ['Open Finance', 'OFX', 'CNAB', 'Pluggy', 'Belvo', 'DDA', 'WhatsApp', 'E-mail', 'Drive']
        ],
        grupos: [
          ['ERPs por API', 'Conta Azul e Omie: leitura e escrita. Bling a confirmar.'],
          ['ERPs por arquivo', 'Nibo e Granatum. Empresa sem ERP usa o livro próprio.'],
          ['Bancos', 'Open Finance, OFX e CNAB, e agregadores como Pluggy e Belvo.'],
          ['Cliente', 'WhatsApp oficial, e-mail e o app com a marca do escritório.']
        ]
      },
      fecho: 'Veja a Heild BPO no seu escritório.'
    }

    /*
     * Uma área nova: copie uma das entradas acima, troque o id e preencha. Exemplo de esqueleto:
     *
     * juridico: {
     *   id: 'juridico', nome: 'Heild Jurídico', forma: 'juridico',   // a forma do I já existe no <heild-logo>
     *   resumo: '…', abertura: { titulo: '…', frase: '…' },
     *   luz: [...], legendas: [...], problema: {...}, camadas: [...], time: [...], timeFrase: '…',
     *   orbEstados: '…', passagem: {...}, aprovacao: {...}, recursos: [...], tambem: [],
     *   umfato: {...}, conectores: {...}, fecho: '…'
     * }
     *
     * Integrantes novos entram em `integrantes` (com a cor do orb como token em estilo.css).
     * Sem uma das peças (por exemplo, sem `lei`), o slide correspondente simplesmente não entra.
     */
  };

  /* ---------- o molde de uma versão de plataforma ---------- */
  // A ordem é a mesma para toda área. Peças que a área não tem ficam de fora.
  function moldePlataforma(p) {
    var s = [];
    s.push({ tipo: 'capa', capitulo: 'Abertura', curto: 'Capa', forma: p.forma, notas: 'A logo, sozinha, com a forma da ' + p.nome + '.' });
    s.push({ tipo: 'abertura', capitulo: 'Abertura', curto: p.nome, titulo: p.abertura.titulo, frase: p.abertura.frase, luz: p.luz, legendas: p.legendas, notas: p.resumo });
    s.push({ tipo: 'problema', capitulo: 'Abertura', curto: 'O problema', titulo: p.problema.titulo, frase: p.problema.frase, ferramentas: p.problema.ferramentas, notas: 'Aperte → para juntar as peças: tudo vira uma peça só.' });
    s.push({ tipo: 'camadas', capitulo: 'Abertura', curto: 'Tudo, num lugar só', titulo: 'Tudo, num lugar só.', frase: 'Os sistemas do escritório viram camadas de uma superfície só, sobre o mesmo cadastro. Um integrante faz o trabalho em cima dela.', planos: p.camadas, orb: 'assistente' });
    s.push({ tipo: 'nome', capitulo: 'A marca', curto: 'O nome' });
    s.push({ tipo: 'formas', capitulo: 'A marca', curto: 'A logo se transforma', destaque: p.forma });
    s.push({ tipo: 'time', capitulo: 'O time', curto: 'O time', titulo: 'Um integrante de IA em cada função.', frase: p.timeFrase, grupos: p.time });
    s.push({ tipo: 'orb', capitulo: 'O time', curto: 'O orb', quem: p.orbEstados });
    s.push(Object.assign({ tipo: 'passagem', capitulo: 'O time', curto: 'Um pedido, o time inteiro' }, p.passagem));
    s.push(Object.assign({ tipo: 'aprovacao', capitulo: 'O time', curto: 'O cartão de aprovação' }, p.aprovacao));
    if (p.lei) s.push(comum.lei);
    p.recursos.forEach(function (r) { s.push(Object.assign({ capitulo: 'O produto' }, r)); });
    (p.tambem || []).forEach(function (id) { var o = plataformas[id]; if (o) s.push({ tipo: 'outra', capitulo: 'O produto', curto: o.nome, plataforma: id }); });
    s.push(Object.assign({ tipo: 'umfato', capitulo: 'O produto', curto: 'Um sistema, um fato' }, p.umfato));
    s.push(Object.assign({ tipo: 'conectores', capitulo: 'O produto', curto: 'Conectores' }, p.conectores));
    s.push(comum.marcabranca);
    s.push(comum.principios);
    s.push({ tipo: 'fecho', capitulo: 'Fecho', curto: 'Fecho', titulo: p.fecho, luz: p.luz, forma: 'orbs' });
    return s;
  }

  /* ---------- a versão principal (como a página principal do site) ---------- */
  function roteiroPrincipal() {
    var c = plataformas.contabil;
    var todasAsLuzes = ['dp', 'contabil', 'fiscal', 'societario', 'consultor', 'notas', 'atendimento', 'bpo_pagar'];
    return [
      { tipo: 'capa', capitulo: 'Abertura', curto: 'Capa', forma: 'cycle', notas: 'A logo, sozinha, passando pelas formas da marca.' },
      { tipo: 'abertura', capitulo: 'Abertura', curto: 'Heild', titulo: 'Toda a sua operação num sistema só.', frase: 'A Heild junta as ferramentas da sua empresa num lugar só, com um time de integrantes de IA, um para cada área. Eles preparam o trabalho; uma pessoa aprova.', luz: todasAsLuzes,
        legendas: [c.legendas[0], c.legendas[1], plataformas.bpo.legendas[0], plataformas.bpo.legendas[1], c.legendas[2], c.legendas[3]] },
      { tipo: 'nome', capitulo: 'Abertura', curto: 'O nome' },
      { tipo: 'problema', capitulo: 'Abertura', curto: 'O problema', titulo: 'Uma empresa espalhada em vinte sistemas.', frase: 'Prazos num sistema, conversas no celular, horas numa planilha, o financeiro em outro lugar. Cada um com o seu cadastro.',
        ferramentas: ['HubStrom', 'Acessórias', 'Nibo', 'Domínio Processos', 'Gestta', 'Onvio Portal', 'Qive', 'SIEG', 'Conexa', 'Omie', 'Conta Azul', 'WhatsApp', 'E-mail', 'Drive', 'Planilha de horas', 'e-CAC', 'eSocial', 'Internet banking', 'Portal da prefeitura', 'Planilha de lotes'] },
      { tipo: 'camadas', capitulo: 'Abertura', curto: 'Tudo, num lugar só', titulo: 'Tudo, num lugar só.', frase: 'Painel, CRM, timesheet, financeiro, BPO e app do cliente viram camadas de uma superfície só, sobre o mesmo cadastro.', planos: ['Painel', 'CRM', 'Timesheet', 'Financeiro', 'BPO', 'App do cliente'], orb: 'assistente' },

      { tipo: 'logo', capitulo: 'A marca', curto: 'A logo' },
      { tipo: 'formas', capitulo: 'A marca', curto: 'A logo se transforma' },
      { tipo: 'movimento', capitulo: 'A marca', curto: 'O sistema de movimento' },
      { tipo: 'areia', capitulo: 'A marca', curto: 'A areia' },
      { tipo: 'claroescuro', capitulo: 'A marca', curto: 'Claro e escuro' },
      { tipo: 'tipografia', capitulo: 'A marca', curto: 'Tipografia' },
      { tipo: 'voz', capitulo: 'A marca', curto: 'A voz' },

      { tipo: 'time', capitulo: 'O time', curto: 'O time', titulo: 'Um integrante de IA em cada setor.', frase: 'Cada um conhece o trabalho do seu setor, conversa com você no próprio chat e passa o que é de outro setor para quem faz.',
        grupos: [
          { nome: 'Fixos no topo', ids: ['assistente', 'consultor'] },
          { nome: 'De todas as áreas', ids: ['atendimento', 'financeiro'] },
          { nome: 'Contábil', ids: ['fiscal', 'dp', 'contabil', 'societario', 'notas'] },
          { nome: 'BPO', ids: ['bpo_pagar', 'bpo_receber', 'bpo_conciliacao', 'bpo_gerencial'] }
        ] },
      { tipo: 'orb', capitulo: 'O time', curto: 'O orb', quem: 'contabil' },
      Object.assign({ tipo: 'passagem', capitulo: 'O time', curto: 'Um pedido, o time inteiro' }, c.passagem),
      Object.assign({ tipo: 'aprovacao', capitulo: 'O time', curto: 'O cartão de aprovação' }, c.aprovacao),
      comum.lei,

      { tipo: 'modulos', capitulo: 'O produto', curto: 'Os módulos', titulo: 'Um sistema no lugar de vinte.', frase: 'Cada módulo existe para desligar uma ferramenta que a empresa paga hoje, e todos ficam sobre o mesmo cadastro.',
        itens: [
          ['Painel', 'painel', 'Os prazos e as tarefas de cada setor'],
          ['CRM', 'conversa', 'WhatsApp, leads e comunicados'],
          ['Timesheet', 'tempo', 'O tempo medido e a rentabilidade'],
          ['Financeiro', 'financeiro', 'Contratos, cobrança e caixa'],
          ['BPO', 'bpo', 'O financeiro das empresas clientes'],
          ['Arquivos', 'arquivos', 'Uma árvore só, com registro de entrega'],
          ['App do cliente', 'celular', 'Pendências, guias e aprovações'],
          ['Assistente', 'orb', 'Recebe qualquer pedido'],
          ['Consultor', 'lupa', 'A lei com fonte conferida'],
          ['Integrantes', 'orbs', 'Um por setor, com aprovação humana']
        ] },
      Object.assign({ capitulo: 'O produto' }, c.recursos[2]),
      Object.assign({ capitulo: 'O produto' }, c.recursos[4]),
      Object.assign({ tipo: 'umfato', capitulo: 'O produto', curto: 'Um sistema, um fato' }, c.umfato),
      { tipo: 'plataformas', capitulo: 'O produto', curto: 'As plataformas', titulo: 'Uma Heild para cada operação.', frase: 'Uma base comum, com um pacote por área. Cada plataforma traz o seu Painel, o seu time e as suas rotinas.' },
      { tipo: 'conectores', capitulo: 'O produto', curto: 'Conectores', titulo: 'Ligado ao que a empresa já usa.', frase: 'Governo, sistemas contábeis, ERPs, bancos e WhatsApp. O caminho oficial vem primeiro, e o que dá ciência ou mexe em dinheiro espera uma pessoa.',
        aneis: [
          ['Integra Contador', 'e-CAC', 'eSocial', 'SEFAZ', 'NFS-e Nacional', 'Prefeituras', 'Domínio', 'Alterdata'],
          ['WhatsApp', 'E-mail', 'Conta Azul', 'Omie', 'Bling', 'Nibo', 'Open Finance', 'Pluggy', 'Drive', 'OneDrive', 'ZapSign']
        ],
        grupos: [
          ['Governo', 'Integra Contador (SERPRO), e-CAC assistido, eSocial, SEFAZ e prefeituras.'],
          ['Sistemas contábeis', 'Alterdata por API; Domínio, Questor e Contmatic por arquivo.'],
          ['ERPs e bancos', 'Conta Azul e Omie por API, Nibo por arquivo; Open Finance, OFX e CNAB.'],
          ['Conversa', 'WhatsApp oficial com coexistência e e-mail.']
        ] },
      comum.marcabranca,
      comum.principios,
      { tipo: 'fecho', capitulo: 'Fecho', curto: 'Fecho', titulo: 'Veja a sua operação inteira num lugar só.', luz: todasAsLuzes, forma: 'orbs' }
    ];
  }

  /* ---------- as versões (o menu e o endereço: #principal, #contabil, #bpo) ---------- */
  function versoes() {
    var lista = [{ id: 'principal', nome: 'Heild', descricao: 'A marca e o produto inteiro', slides: roteiroPrincipal() }];
    Object.keys(plataformas).forEach(function (id) {
      var p = plataformas[id];
      lista.push({ id: id, nome: p.nome, descricao: p.resumo, slides: moldePlataforma(p) });
    });
    return lista;
  }

  window.HEILD_APRESENTACAO = { integrantes: integrantes, formas: formas, plataformas: plataformas, versoes: versoes };
})();
