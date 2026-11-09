/*
 * O raciocínio do Consultor — o conteúdo.
 *
 * Usa o motor e os tipos da apresentação de produto (../produto/src) e troca as versões dela pelas desta:
 * a completa e a curta. Os tipos novos estão em tipos.js.
 *
 * Regras do conteúdo:
 * - Português do Brasil, frases curtas, voz ativa. Nada em caixa alta, sem emoji.
 * - Nada inventado: a Heild não foi lançada; sem clientes, depoimentos ou números de uso.
 *   Os escritórios e empresas das cenas são os fictícios do protótipo (Metalúrgica Andrade, Clínica Sorriso...).
 *   Os casos jurídicos são exemplos, sem nomes de pessoas.
 * - Toda norma, data e número foi conferido na fonte (texto compilado e publicação original na Câmara,
 *   arXiv, STJ, TST); a lista está no README da pasta.
 */
(function () {
  'use strict';
  var D = window.HEILD_APRESENTACAO;

  /* ---------- os textos de lei usados em mais de um slide (conferidos na Câmara, LEGIN) ---------- */
  var CLT_58_2_2001 = 'O tempo despendido pelo empregado até o local de trabalho e para o seu retorno, por qualquer meio de transporte, não será computado na jornada de trabalho, salvo quando, tratando-se de local de difícil acesso ou não servido por transporte público, o empregador fornecer a condução.';
  var CLT_58_2_2017 = 'O tempo despendido pelo empregado desde a sua residência até a efetiva ocupação do posto de trabalho e para o seu retorno, caminhando ou por qualquer meio de transporte, inclusive o fornecido pelo empregador, não será computado na jornada de trabalho, por não ser tempo à disposição do empregador.';

  var S = [

    /* ================= Abertura ================= */
    { tipo: 'capa', capitulo: 'Abertura', curto: 'Capa', forma: 'lupa', curta: true,
      notas: 'A logo na forma lupa, a do Consultor. Deixe tocar uma vez antes de começar.' },

    { tipo: 'abertura', capitulo: 'Abertura', curto: 'A lei certa, na data certa', curta: true,
      titulo: 'A lei certa, na data certa, com a prova.',
      frase: 'O Consultor da Heild responde pela redação que valia na data do fato, com o trecho citado e conferido. Sem base, diz que não encontrou.',
      luz: ['dp', 'consultor', 'fiscal', 'consultor', 'bpo_pagar'],
      legendas: [
        { quem: 'consultor', estado: 'pensando', texto: 'está lendo o art. 58 da CLT na redação vigente em 2016' },
        { quem: 'consultor', estado: 'trabalhando', texto: 'está seguindo a LC 123 até o anexo da Clínica Sorriso em 2019' },
        { quem: 'consultor', estado: 'concluido', texto: 'conferiu as três citações sobre a retenção da Metalúrgica Andrade' },
        { quem: 'consultor', estado: 'precisa_de_voce', texto: 'pergunta a data do fato: a regra mudou em 11/11/2017' }
      ],
      notas: 'A apresentação inteira cabe nesta frase. A lei certa: cada dispositivo guarda todas as suas redações. Na data certa: toda pergunta carrega a data do fato. Com a prova: cada citação é conferida no texto antes de sair; sem prova, o Consultor diz que não encontrou. O resto é como isso funciona e por que é diferente de uma IA comum.' },

    { tipo: 'tresareas', capitulo: 'Abertura', curto: 'Toda pergunta tem uma data', curta: true,
      titulo: 'Toda pergunta tem uma data.',
      frase: 'Na advocacia, na contabilidade e no BPO, a mesma pergunta tem respostas diferentes antes e depois de uma mudança na lei.',
      areas: [
        { area: 'Advocacia · trabalhista', pergunta: 'O tempo de trajeto no transporte da empresa conta na jornada?', corte: '11/11/2017',
          antes: { quando: 'Fato até 10/11/2017', resposta: 'Conta, se o local era de difícil acesso ou sem transporte público e a empresa fornecia a condução.', fonte: 'CLT, art. 58, § 2º, redação da Lei 10.243/2001' },
          depois: { quando: 'Fato desde 11/11/2017', resposta: 'Não conta: não é tempo à disposição do empregador.', fonte: 'CLT, art. 58, § 2º, redação da Lei 13.467/2017' } },
        { area: 'Contábil · Simples Nacional', pergunta: 'Uma clínica de odontologia no Simples fica em qual anexo?', corte: '01/01/2018',
          antes: { quando: 'Fato de 2015 a 2017', resposta: 'Anexo VI, sem fator R.', fonte: 'LC 123/2006, art. 18, § 5º-I, III, redação da LC 147/2014' },
          depois: { quando: 'Fato desde 01/01/2018', resposta: 'Anexo III com folha de 28% ou mais da receita; abaixo disso, Anexo V.', fonte: 'LC 123/2006, art. 18, §§ 5º-B, XX, e 5º-M, I (LC 155/2016)' } },
        { area: 'BPO · retenções', pergunta: 'A Metalúrgica Andrade pagou R$ 3.200 de manutenção a um fornecedor fora do Simples. Retém PIS, Cofins e CSLL?', corte: '22/06/2015',
          antes: { quando: 'Pagamento até 21/06/2015', resposta: 'Não: a retenção era dispensada para pagamentos de até R$ 5.000 no mês.', fonte: 'Lei 10.833/2003, art. 31, §§ 3º e 4º, redação da Lei 10.925/2004' },
          depois: { quando: 'Pagamento desde 22/06/2015', resposta: 'Sim: 4,65%, ou R$ 148,80. Só se dispensa retenção de até R$ 10.', fonte: 'Lei 10.833/2003, art. 31, caput e § 3º, redação da Lei 13.137/2015' } }
      ],
      notas: 'Três exemplos verdadeiros, um por área, e todos viram na mesma regra: o que vale é a redação da data do fato. Trabalhista: a reforma de 2017 reescreveu o § 2º do art. 58 da CLT, em vigor em 11/11/2017. Contábil: a LC 147/2014 pôs a odontologia no Anexo VI a partir de 2015; a LC 155/2016 a levou ao Anexo III, com o fator R, a partir de 2018. BPO: a Lei 13.137/2015, publicada em 22/06/2015, trocou a dispensa de R$ 5.000 no mês pela dispensa de retenção de até R$ 10. Quem pesquisa no Google vê muitas vezes a regra antiga, porque a internet não apaga páginas.' },

    /* ================= O problema ================= */
    { tipo: 'linhatempo', capitulo: 'O problema', curto: 'A data do fato escolhe o texto', curta: true,
      titulo: 'A data do fato escolhe o texto.',
      frase: 'O mesmo parágrafo da CLT teve duas redações. A base guarda as duas, com as datas, e responde pela que valia no dia.',
      norma: 'CLT, art. 58, § 2º',
      urn: 'urn:lex:br:federal:decreto.lei:1943-05-01;5452!art58_par2',
      de: '2000-01-01', ate: '2026-11-09',
      versoes: [
        { de: '2001-06-20', ate: '2017-11-10', texto: CLT_58_2_2001, fonte: 'Acrescido pela Lei 10.243/2001 (DOU de 20/06/2001), em vigor na publicação' },
        { de: '2017-11-11', ate: null, texto: CLT_58_2_2017, fonte: 'Redação da Lei 13.467/2017 (DOU de 14/07/2017), em vigor 120 dias depois' }
      ],
      vazio: 'Nesta data, o § 2º ainda não existia. Ele entrou na CLT em 20/06/2001.',
      marco: { data: '2024-11-25', rotulo: 'Tema 23 do TST', texto: 'Tese de 25/11/2024: a Lei 13.467 vale de imediato nos contratos em curso, para os fatos desde a sua vigência.' },
      faixa: { de: '2013-12-01', corte: '2017-11-11', ate: '2018-01-31', rotulo: 'O contrato do caso julgado no Tema 23', antes: 'trajeto pago', depois: 'não pago' },
      notas: 'Arraste o marcador. O texto muda quando a data cruza 11/11/2017, e some antes de 20/06/2001, quando o parágrafo ainda não existia. A faixa de baixo é o caso que o TST julgou no Tema 23 (IncJulgRREmbRep-528-80.2018.5.14.0004, 25/11/2024): um contrato de dezembro de 2013 a janeiro de 2018. O Pleno limitou as horas de trajeto até 10/11/2017. O mesmo contrato tem duas regras, e é a data de cada fato que decide.' },

    { tipo: 'duelo', capitulo: 'O problema', curto: 'A mesma pergunta, dois jeitos', curta: true,
      titulo: 'A mesma pergunta, dois jeitos.',
      frase: 'A IA comum escreve bem e aplica a reforma a quem já tinha o direito. O Consultor procura a regra da data.',
      exemplo: 'Caso de exemplo · previdenciário',
      pergunta: 'Um segurado completou 35 anos de contribuição em agosto de 2019, aos 58 anos. Ele pode se aposentar sem idade mínima?',
      comum: {
        texto: 'Não. Desde a reforma da Previdência, a aposentadoria exige idade mínima de 65 anos para homens. O tempo de contribuição sozinho não basta mais.',
        marcas: ['Aplica a regra de hoje a quem cumpriu os requisitos antes de 13/11/2019', 'Nenhuma citação para conferir']
      },
      consultor: {
        texto: 'Sim. Ele cumpriu os requisitos antes de 13/11/2019, quando a EC 103 entrou em vigor, e o direito fica assegurado pelos critérios da lei daquela data. Em agosto de 2019, bastavam 35 anos de contribuição, se homem.',
        citacoes: [
          { norma: 'EC 103/2019, art. 3º', vig: 'vigente desde 13/11/2019', trecho: '… desde que tenham sido cumpridos os requisitos para obtenção desses benefícios até a data de entrada em vigor desta Emenda Constitucional, observados os critérios da legislação vigente na data em que foram atendidos os requisitos …' },
          { norma: 'CF, art. 201, § 7º, I', vig: 'redação da EC 20/1998, vigente em 08/2019', trecho: 'I - trinta e cinco anos de contribuição, se homem, …' }
        ],
        grau: 'Segurança alta',
        rodape: 'O valor do benefício sai do motor de cálculo.'
      },
      notas: 'A resposta da IA comum é ilustrativa, mas é o erro típico: ela aprendeu o texto de hoje (CF, art. 201, § 7º, I, na redação da EC 103: 65 anos, se homem) e o aplica a um fato de 2019. O art. 3º da EC 103/2019 garante a quem cumpriu os requisitos até a entrada em vigor (13/11/2019) os critérios da legislação daquela data. O Consultor chega lá porque a pergunta tem data e a base tem a redação de 2019.' },

    { tipo: 'fatos', capitulo: 'O problema', curto: 'Citação errada nos tribunais', curta: true,
      titulo: 'Citação errada já chega aos tribunais.',
      frase: 'Nem as ferramentas jurídicas com busca resolveram. E o risco é de quem assina.',
      nota: 'A Recomendação 001/2024 do Conselho Federal da OAB pede supervisão humana do julgamento profissional e veracidade no levantamento de jurisprudência (itens 3.1 e 3.2; CPC, art. 77).',
      itens: [
        { numero: 17, ate: 33, sufixo: '%', texto: 'das respostas das ferramentas jurídicas de pesquisa com IA tinham alucinação, no teste de Stanford.', fonte: 'Magesh et al., 2024 (arXiv 2405.20362)' },
        { numero: 2286, texto: 'decisões no mundo trataram de conteúdo alucinado em processos. 41 delas no Brasil.', fonte: 'Banco de Damien Charlotin, consultado em 9/11/2026' },
        { numero: 50, sufixo: '%', texto: 'das respostas dos melhores modelos não tinham suporte completo nas citações, num teste de 2023.', fonte: 'Gao et al., EMNLP 2023 (ALCE, conjunto ELI5)' }
      ],
      notas: 'Stanford testou ferramentas jurídicas de editoras, com busca na base delas, e ainda assim mediu de 17% a 33% de respostas com alucinação. O banco de Damien Charlotin reúne decisões em que um tribunal tratou de conteúdo inventado por IA: 2.286 até hoje, 41 no Brasil, 907 com advogados. A Recomendação 001/2024 do CFOAB, item 3.2, liga o levantamento de jurisprudência ao dever de veracidade do art. 77 do CPC. Ou seja: o produto precisa baixar o custo de conferir, não pedir confiança.' },

    { tipo: 'armadilhas', capitulo: 'O problema', curto: 'Por que a IA comum erra',
      titulo: 'Por que a IA comum erra com lei.',
      frase: 'Achar o trecho mais parecido com a pergunta não basta. A lei tem armadilhas que a busca comum não vê.',
      itens: [
        { id: 'versoes', nome: 'Versões', texto: 'O mesmo artigo teve várias redações. A mais parecida com a pergunta nem sempre é a da data.' },
        { id: 'revogacao', nome: 'Revogações', texto: 'O texto revogado continua publicado, idêntico, e continua aparecendo na busca.' },
        { id: 'remissao', nome: 'Remissões', texto: '"Nos termos do art. X da Lei Y": a resposta mora em outra norma.' },
        { id: 'vocabulario', nome: 'Vocabulário', texto: 'O cliente fala em faturamento; a lei diz receita bruta.' },
        { id: 'chute', nome: 'O chute', texto: 'Treino e avaliação premiam o chute mais do que o "não sei" (Kalai et al., 2025).' }
      ],
      notas: 'As quatro primeiras são da lei. A quinta é do modelo: um artigo da OpenAI de 2025 (Kalai, Nachum, Vempala e Zhang) mostra que os modelos alucinam em parte porque o treino e as avaliações premiam o chute mais do que reconhecer a dúvida. Uma IA comum não foi feita para dizer "não encontrei". Cada armadilha tem uma resposta nos próximos slides.' },

    /* ================= A ideia ================= */
    { tipo: 'quatrocamadas', capitulo: 'A ideia', curto: 'A lei fica fora do modelo', curta: true,
      titulo: 'A lei fica fora do modelo.',
      frase: 'O Consultor não responde de memória: lê uma base legal organizada no tempo, que se audita. Saiu norma nova? Atualiza-se a base, não o modelo.',
      notas: 'Quatro camadas. A base legal no tempo é a fonte da verdade. O Consultor entende, pesquisa, confere e responde. A busca ao vivo vai às fontes oficiais quando a base ainda não tem a norma, e o que ela traz sai marcado como ainda não validado e entra na fila de ingestão. A melhoria contínua fica fora da produção: só volta ao ar uma versão aprovada por uma pessoa. É prova com consulta, não de memória.' },

    /* ================= A base no tempo ================= */
    { tipo: 'dispositivo', capitulo: 'A base no tempo', curto: 'Cada dispositivo, todas as redações',
      titulo: 'Cada dispositivo, todas as redações.',
      frase: 'A lei é guardada como se lê: artigo, parágrafo, inciso, alínea. Cada um tem um identificador que não muda e a lista das suas redações.',
      urnBase: 'urn:lex:br:federal:decreto.lei:1943-05-01;5452!art58',
      nos: [
        { id: 'caput', rotulo: 'caput', sufixo: '', texto: 'A duração normal do trabalho, para os empregados em qualquer atividade privada, não excederá de 8 (oito) horas diárias…',
          redacoes: [{ de: '1943', ate: 'hoje', norma: 'Redação original do Decreto-Lei 5.452/1943' }] },
        { id: 'p1', rotulo: '§ 1º', sufixo: '_par1', texto: 'Não serão descontadas nem computadas como jornada extraordinária as variações de horário no registro de ponto não excedentes de cinco minutos…',
          redacoes: [{ de: '20/06/2001', ate: 'hoje', norma: 'Acrescido pela Lei 10.243/2001' }] },
        { id: 'p2', rotulo: '§ 2º', sufixo: '_par2', texto: 'O tempo despendido pelo empregado desde a sua residência até a efetiva ocupação do posto de trabalho…',
          redacoes: [{ de: '20/06/2001', ate: '10/11/2017', norma: 'Acrescido pela Lei 10.243/2001' }, { de: '11/11/2017', ate: 'hoje', norma: 'Redação da Lei 13.467/2017' }] },
        { id: 'p3', rotulo: '§ 3º', sufixo: '_par3', revogado: true, texto: 'Revogado.',
          redacoes: [{ de: '15/12/2006', ate: '10/11/2017', norma: 'Acrescido pela LC 123/2006' }, { de: '11/11/2017', ate: '', norma: 'Revogado pela Lei 13.467/2017', revoga: true }] }
      ],
      notas: 'O jeito comum de montar uma busca é cortar o texto em blocos de tamanho fixo, que separam o parágrafo do caput e misturam redações. Aqui a unidade é o dispositivo, com identificador no padrão URN do LexML e a lista de redações: quando começou, quando terminou e qual norma causou a mudança. O § 3º do art. 58 é um bom exemplo: entrou com a LC 123/2006 e saiu com a reforma de 2017. Revogado não some da base; fica com a data em que deixou de valer.' },

    { tipo: 'consolidacao', capitulo: 'A base no tempo', curto: 'O texto compilado é calculado',
      titulo: 'O texto compilado é calculado.',
      frase: 'A IA não escreve a lei compilada. Registra eventos, cada um com o trecho que o prova, e um programa os aplica em ordem: o saldo não se digita, se apura.',
      eventos: [
        { data: '2001-06-20', rotulo: '20/06/2001', norma: 'Lei 10.243/2001', acao: 'acrescenta os §§ 1º e 2º', alvo: ['p1', 'p2a'] },
        { data: '2006-12-15', rotulo: '15/12/2006', norma: 'LC 123/2006', acao: 'acrescenta o § 3º', alvo: ['p3'] },
        { data: '2017-11-11', rotulo: '11/11/2017', norma: 'Lei 13.467/2017', acao: 'dá nova redação ao § 2º', alvo: ['p2b'], fecha: ['p2a'] },
        { data: '2017-11-11', rotulo: '11/11/2017', norma: 'Lei 13.467/2017', acao: 'revoga o § 3º', fecha: ['p3'] }
      ],
      barras: [
        { id: 'p1', rotulo: '§ 1º', de: '2001-06-20' },
        { id: 'p2a', rotulo: '§ 2º · 2001', de: '2001-06-20' },
        { id: 'p2b', rotulo: '§ 2º · 2017', de: '2017-11-11' },
        { id: 'p3', rotulo: '§ 3º', de: '2006-12-15' }
      ],
      estudo: 'Quando um modelo consolida sozinho: 50,3% de acerto exato numa alteração e 20,51% em cadeias de alterações, com 93% a 99% de semelhança no texto (908 pares de leis alemãs; Prior et al., NLLP 2025).',
      notas: 'Este é um dos princípios do Plano de Ingestão que não muda: a IA identifica o que mudou e aponta o trecho literal que prova; o código aplica os eventos em ordem de eficácia. O estudo da TUM mostra por quê: o texto gerado por modelo parece certo (93% a 99% de semelhança) e erra a redação exata na metade das vezes. Em lei, uma palavra muda o resultado.' },

    { tipo: 'tresdatas', capitulo: 'A base no tempo', curto: 'No direito, três datas', curta: true,
      titulo: 'No direito, são três datas.',
      frase: 'A lei material segue a data do fato; a processual, a data do ato; o precedente vale pelo que vincula hoje. O Consultor diz qual data usou em cada parte.',
      de: '2014-01-01', ate: '2026-11-09',
      faixas: [
        { nome: 'Data do fato', rege: 'lei material', corte: '2017-11-11', vai: ['2016-02-10', '2019-04-20'],
          antes: { norma: 'CLT, art. 58, § 2º · Lei 10.243/2001', texto: 'O trajeto conta, se o local era de difícil acesso ou sem transporte público e a empresa dava a condução.' },
          depois: { norma: 'CLT, art. 58, § 2º · Lei 13.467/2017', texto: 'O trajeto não conta na jornada.' } },
        { nome: 'Data do ato', rege: 'lei processual', corte: '2016-03-18', vai: ['2015-05-12', '2017-06-08'],
          antes: { norma: 'CPC/1973, art. 178', texto: 'O prazo é contínuo, não se interrompe nos feriados.' },
          depois: { norma: 'CPC/2015, art. 219', texto: 'Na contagem em dias, só os dias úteis. Em vigor em 18/03/2016.' } },
        { nome: 'Data de hoje', rege: 'precedentes', fixo: '2026-11-09',
          depois: { norma: 'Tema 23 do TST · 25/11/2024', texto: 'Vinculante: a reforma vale para os fatos desde 11/11/2017, também nos contratos anteriores.' } }
      ],
      rodape: 'A data final de um prazo vem da função de prazo, com a memória de cálculo. O modelo não conta dias.',
      notas: 'Esta é a principal diferença do jurídico para o contábil, no subplano JU-04: três datas. A norma material pela data do fato (a reforma trabalhista só alcança fatos desde 11/11/2017). A processual pela data do ato (o CPC/2015 entrou em vigor em 18/03/2016, data fixada pelo Pleno do STJ no Enunciado administrativo 1; o art. 219 conta só dias úteis, o art. 178 do CPC/1973 contava de forma contínua). E o precedente pelo estado de hoje: o Tema 23 do TST, de 25/11/2024. Os três exemplos são independentes, um por data. O prazo em si nunca é contado pelo modelo.' },

    { tipo: 'grafo', capitulo: 'A base no tempo', curto: 'A lei não vive sozinha', curta: true,
      titulo: 'A lei não vive sozinha.',
      frase: 'Quem altera, quem regulamenta, quem julga, quem remete a quem. A relevância parte dos artigos achados e se espalha pela rede, num passo só.',
      pergunta: 'Base de cálculo do ITBI numa compra de 2026',
      fatos: [
        'HippoRAG (NeurIPS 2024): um passo pelo grafo saiu de 10 a 30 vezes mais barato e de 6 a 13 vezes mais rápido que a busca em rodadas (IRCoT).',
        'HippoRAG 2 (ICML 2025): 7% acima do melhor modelo de embedding em memória associativa.',
        'Na Heild, as arestas são as da base, não extraídas por modelo. E o grafo só liga se vencer no benchmark.'
      ],
      nos: [
        { id: 'ctn38', rotulo: 'CTN, art. 38', sub: 'base: valor venal', x: 300, y: 196, semente: true },
        { id: 'lc227', rotulo: 'LC 227/2026', sub: 'acrescenta os §§ 1º a 4º', x: 118, y: 80 },
        { id: 'tema', rotulo: 'Tema 1.113 do STJ', sub: 'repetitivo · RE pendente', x: 520, y: 80 },
        { id: 'ctn148', rotulo: 'CTN, art. 148', sub: 'arbitramento', x: 600, y: 214 },
        { id: 'cf156', rotulo: 'CF, art. 156, II', sub: 'competência do município', x: 104, y: 300 },
        { id: 'leim', rotulo: 'Lei municipal do ITBI', sub: 'base e alíquota', x: 330, y: 368, semente: true },
        { id: 'dec', rotulo: 'Decreto municipal', sub: 'regulamenta', x: 580, y: 384 },
        { id: 'iptu', rotulo: 'Lei municipal do IPTU', sub: 'outro tributo', x: 640, y: 300, longe: true }
      ],
      arestas: [
        ['lc227', 'ctn38', 'altera'], ['tema', 'ctn38', 'interpreta'], ['tema', 'ctn148', 'remete a'],
        ['cf156', 'leim', 'fundamenta'], ['leim', 'ctn38', 'aplica'], ['dec', 'leim', 'regulamenta'], ['dec', 'iptu', 'mesmo ente']
      ],
      notas: 'A pergunta acha dois pontos de partida: o art. 38 do CTN e a lei municipal do ITBI. A partir deles, a relevância se espalha pelas ligações (o PageRank personalizado do HippoRAG) e chegam juntos a LC 227/2026, que acrescentou os §§ 1º a 4º ao art. 38 em 13/01/2026; o Tema 1.113 do STJ (REsp 1.937.821/SP, 24/02/2022), que hoje consta como acórdão publicado com RE pendente; o art. 148 do CTN, ao qual a tese remete; e o decreto que regulamenta a lei municipal. A lei do IPTU, que só está perto, fica para trás. Correção em relação à apresentação antiga: o "10 a 30 vezes mais barato" é do HippoRAG 1, contra o IRCoT, não do HippoRAG 2.' },

    /* ================= A cascata ================= */
    { tipo: 'cascata', capitulo: 'A cascata', curto: 'Do barato ao caro', curta: true,
      titulo: 'Do barato ao caro.',
      frase: 'Código, índices e modelos pequenos fazem quase tudo. O modelo principal lê só os poucos trechos que sobram, na redação da data.',
      pergunta: 'A Clínica Sorriso, de odontologia, tem folha de 31,2% da receita. Em que anexo do Simples ela ficava em março de 2019?',
      etapas: [
        { nome: 'Entender', quem: 'modelo barato', saida: 'Simples Nacional · anexo · fato em 03/2019 · odontologia' },
        { nome: 'Cache', quem: 'embedding', saida: 'Nenhuma resposta validada com as normas ainda vigentes' },
        { nome: 'Vigência', quem: 'código', saida: 'Só o que valia em 03/2019. O § 5º-I, III, do Anexo VI, fica de fora' },
        { nome: 'Palavras e significado', quem: 'índices', saida: '"odontologia", "28%" e "folha de salários" acham o art. 18' },
        { nome: 'Grafo', quem: 'código', saida: 'Traz os §§ 5º-K e 24 e a resolução do CGSN' },
        { nome: 'Revisor', quem: 'modelo pequeno', saida: '50 candidatos, 6 trechos, cada um com o motivo' },
        { nome: 'Redação', quem: 'modelo principal', saida: 'Resposta direta primeiro, depois o fundamento' },
        { nome: 'Verificação', quem: 'código e modelo barato', saida: '3 afirmações, 3 com suporte no trecho' },
        { nome: 'Saída', quem: 'código', saida: 'Segurança alta. Sem suporte, seria abstenção' }
      ],
      resposta: 'Anexo III. A odontologia é tributada pelo Anexo III e só vai ao Anexo V se a folha ficar abaixo de 28% da receita dos 12 meses anteriores. Com 31,2%, ficava no III.',
      citacoes: [
        { norma: 'LC 123/2006, art. 18, § 5º-B, XX', vig: 'vigente desde 01/01/2018' },
        { norma: 'LC 123/2006, art. 18, § 5º-M, I', vig: 'vigente desde 01/01/2018' },
        { norma: 'LC 123/2006, art. 18, § 5º-K', vig: 'os 12 meses anteriores' }
      ],
      notas: 'A cascata do Plano do Assistente, empacotada na ferramenta legal.consultar do subplano 07. Repare na etapa 3: o filtro de vigência é código, não IA, e tira do caminho a redação de 2015 a 2017, quando a odontologia estava no Anexo VI. O modelo principal entra uma vez, no fim. Um detalhe que a verificação pega: para odontologia, a regra é o § 5º-M, I, combinado com o § 5º-B, XX. O § 5º-J, citado com frequência, vale para as atividades do § 5º-I.' },

    { tipo: 'entender', capitulo: 'A cascata', curto: 'Antes de buscar, ele entende',
      titulo: 'Antes de buscar, ele entende.',
      frase: 'Tema, área, datas e lugar saem da pergunta. Se falta um dado que muda a resposta, ele pergunta de volta em vez de supor.',
      pergunta: 'Minha cliente quer as horas de trajeto do contrato inteiro. Cabe?',
      chips: [
        { rotulo: 'Tema', valor: 'horas de trajeto' },
        { rotulo: 'Área', valor: 'trabalhista' },
        { rotulo: 'Norma', valor: 'CLT, art. 58, § 2º' },
        { rotulo: 'Lugar', valor: 'não muda a regra' },
        { rotulo: 'Data do fato', valor: 'falta: a regra mudou no meio', falta: true }
      ],
      volta: 'Preciso do período do contrato. A regra mudou em 11/11/2017: antes, o trajeto podia contar; depois, não conta.',
      resposta: 'De 2015 a 2019.',
      final: 'Então são duas regras no mesmo contrato: até 10/11/2017, a redação da Lei 10.243/2001; depois, a da Lei 13.467/2017, como fixou o TST no Tema 23.',
      notas: 'O passo 1 da Camada 2. O Consultor extrai o que importa para escolher a norma. Aqui a data do fato não é um detalhe: a lei mudou no meio do contrato. Sem a data, ele não supõe a de hoje; pergunta. Pela regra do JU-04, se a lei material mudou entre as datas possíveis, ele pergunta; se não mudou, responde e avisa qual data considerou.' },

    { tipo: 'vigencia', capitulo: 'A cascata', curto: 'O filtro de vigência',
      titulo: 'O filtro de vigência é código.',
      frase: 'Antes de procurar qualquer palavra, o banco separa só o que valia na data: a esfera, o ente e a redação certos. O que não valia nem entra no caminho.',
      norma: 'LC 123/2006, art. 18 · odontologia',
      de: '2014-01-01', ate: '2027-01-01',
      barras: [
        { rotulo: '§ 5º-I, III · odontologia no Anexo VI', de: '2015-01-01', ate: '2017-12-31' },
        { rotulo: 'Anexo VI · a tabela', de: '2015-01-01', ate: '2017-12-31' },
        { rotulo: '§ 24 · redação da LC 147/2014', de: '2015-01-01', ate: '2017-12-31' },
        { rotulo: '§ 5º-B, XX · odontologia no Anexo III', de: '2018-01-01', ate: null },
        { rotulo: '§ 5º-M, I · Anexo V abaixo de 28%', de: '2018-01-01', ate: null },
        { rotulo: '§ 5º-K · os 12 meses anteriores', de: '2018-01-01', ate: null },
        { rotulo: '§ 24 · redação da LC 155/2016', de: '2018-01-01', ate: null }
      ],
      paradas: ['2016-06-15', '2019-03-15', '2026-11-09'],
      notas: 'Este passo é o que desarma as armadilhas das versões e das revogações. É uma consulta ao banco: esfera, ente e intervalo de vigência. A LC 147/2014 produziu efeitos para o § 5º-I e o Anexo VI a partir de 01/01/2015 (art. 15, I); a LC 155/2016, a partir de 01/01/2018. Em 2016, passam as três primeiras linhas; em 2019, as quatro últimas. Uma busca comum traria todas, e a mais parecida com a pergunta poderia ser a revogada.' },

    { tipo: 'hibrida', capitulo: 'A cascata', curto: 'Palavras e significado',
      titulo: 'Palavras exatas e significado.',
      frase: 'Uma busca acha o número da lei e a sigla. A outra acha receita bruta quando o cliente diz faturamento. As duas listas viram uma.',
      pergunta: 'Quanto do faturamento a folha precisa ser para a clínica sair do Anexo V?',
      palavras: ['§ 5º-M · 28%', '§ 5º-J · 28%', '§ 24 · folha de salários', 'Anexo V · tabela'],
      significado: ['§ 5º-M · relação folha e receita', 'art. 3º, § 1º · o que é receita bruta', '§ 5º-K · os 12 meses', '§ 24 · folha de salários'],
      fundida: ['§ 5º-M', '§ 24', '§ 5º-K', 'art. 3º, § 1º', '§ 5º-J', 'Anexo V'],
      fatos: [
        'A busca por palavras (BM25) segue uma base robusta (BEIR, NeurIPS 2021).',
        'Fundir as listas pela posição (RRF) supera cada sistema sozinho (Cormack, Clarke e Büttcher, SIGIR 2009).',
        'Um vetor só por texto tem limite matemático (LIMIT, ICLR 2026): por isso a busca por significado é multivetorial.'
      ],
      notas: 'A etapa 4 da cascata. O BM25 é a busca por palavras exatas, que dá mais peso a termos raros: número de lei, CFOP, sigla. A busca por significado acha "receita bruta" quando o cliente fala "faturamento"; na ingestão, um modelo ainda escreve as perguntas que cada artigo responde e as cola no artigo. As duas listas são fundidas pela posição de cada item (reciprocal rank fusion). O LIMIT, da Google DeepMind, mostrou que um vetor único por documento não consegue representar todas as combinações; daí a busca por significado com um vetor por termo.' },

    { tipo: 'revisor', capitulo: 'A cascata', curto: 'Um revisor que diz por quê',
      titulo: 'Um revisor que diz por quê.',
      frase: 'Das buscas saem uns 50 candidatos. O revisor lê cada um, decide e anota o motivo. Ficam de 5 a 10, e o porquê fica registrado.',
      ficam: [
        ['§ 5º-B, XX', 'põe a odontologia no Anexo III'],
        ['§ 5º-M, I', 'leva ao Anexo V abaixo de 28%'],
        ['§ 5º-K', 'define os 12 meses anteriores'],
        ['§ 24', 'define o que entra na folha']
      ],
      saem: [
        ['art. 18-A', 'é sobre o MEI'],
        ['§ 5º-J', 'vale para as atividades do § 5º-I, não para a odontologia'],
        ['Anexo IV', 'é de outras atividades']
      ],
      fato: 'Rank1 (COLM 2025): reranqueador que raciocina antes de julgar, destilado de mais de 600 mil raciocínios do DeepSeek R1 sobre o MS MARCO, em inglês. Para a lei brasileira, precisa ser destilado de novo em português, e só entra se vencer o reranqueador por API.',
      notas: 'A etapa 6. Um reranqueador comum dá uma nota e pronto. O Rank1 pensa antes de decidir e deixa o raciocínio. Num produto que mostra a base legal, esse porquê é auditável: dá para saber por que o § 5º-J saiu. Até o modelo nosso vencer no benchmark, fica o reranqueador por API, atrás de uma chave.' },

    { tipo: 'calculo', capitulo: 'A cascata', curto: 'A conta não é do modelo',
      titulo: 'A conta não é do modelo.',
      frase: 'Fator R, alíquota, juros e prazo saem de funções em código, com tabelas versionadas pela data. O modelo escolhe a função e explica os passos.',
      funcao: 'calculo.fator_r',
      entradas: [['Folha dos 12 meses anteriores', 'R$ 112.320,00', 'lida da folha do DP'], ['Receita bruta dos 12 meses', 'R$ 360.000,00', 'lida das notas do Fiscal']],
      passos: [['Razão', '112.320,00 ÷ 360.000,00 = 31,2%'], ['Regra', '§ 5º-M, I: Anexo V só abaixo de 28%'], ['Resultado', 'Anexo III']],
      frase_sem: 'O DAS de março fica em R$ 2.648,70',
      prazo: 'No jurídico, a data final de um prazo sai da função de prazo, com o calendário do tribunal e a memória de cálculo. Prazo fatal tem conferência humana.',
      notas: 'É o motor M3 do subplano 07. As entradas vêm de registros lidos (a folha do DP, as notas do Fiscal) e cada número da resposta carrega a origem. A verificação remove número sem origem e escreve "valor não conferido". A explicação é gerada depois, a partir dos passos, sem ver a pergunta. No jurídico vale o mesmo para prazos, juros e custas: cálculo de apoio, com a regra de cada linha.' },

    { tipo: 'modos', capitulo: 'A cascata', curto: 'O mesmo método em cada tarefa',
      titulo: 'O mesmo método em cada tarefa.',
      frase: 'Perguntar, redigir, pesquisar, revisar e vigiar. Em todos os modos, a mesma base, a mesma conferência e a mesma abstenção.',
      itens: [
        ['Perguntar', 'Resposta com o trecho citado e o grau de segurança, ou a abstenção com o que foi pesquisado.'],
        ['Parecer', 'Rascunho com fatos, normas, precedentes e ressalvas. Guarda as versões citadas; quem assina é o advogado.'],
        ['Pesquisa de jurisprudência', 'Mapa por órgão e data, com os tribunais cobertos declarados. Sem "chance de êxito".'],
        ['Revisão de contrato', 'Cada achado cita a cláusula. Achado sem citação é descartado, e ele diz quantos.'],
        ['Vigilância', 'Lei nova publicada: quais casos e clientes ela afeta, pela data de cada fato. Nada vai ao cliente sem uma pessoa.'],
        ['Segunda opinião', 'Confere a peça de risco, refaz as contas e anota "confere" ou "diverge". Nunca conclui.']
      ],
      nunca: 'Nunca assina, protocola, dá ciência de intimação ou conta prazo de cabeça.',
      notas: 'Os modos do Consultor no subplano 07 e no JU-04, ainda em planejamento para o jurídico. A vigilância é um bom exemplo do uso das datas: quando sai uma lei, o predicado que escolhe os casos afetados inclui a data do fato, porque lei nova só afeta fato posterior. O que ele nunca faz está no JU-04, seção 4.5.' },

    /* ================= A confiança ================= */
    { tipo: 'verificador', capitulo: 'A confiança', curto: 'Cada afirmação contra o trecho', curta: true,
      titulo: 'Cada afirmação contra o trecho.',
      frase: 'Depois de redigir, uma segunda etapa confere cada afirmação: o dispositivo existe? Valia na data? Diz mesmo o que a resposta afirma?',
      contexto: 'Metalúrgica Andrade · pagamento de R$ 3.200 por manutenção em 10/11/2026, a fornecedor fora do Simples',
      afirmacoes: [
        { texto: 'A retenção de PIS, Cofins e CSLL é de 4,65% do valor pago.', norma: 'Lei 10.833/2003, art. 31, caput', trecho: '… mediante a aplicação, sobre o montante a ser pago, do percentual de 4,65% …', r: [1, 1, 1] },
        { texto: 'Pagamentos de até R$ 5.000 no mês estão dispensados.', norma: 'Lei 10.833/2003, art. 31, § 3º', trecho: 'Redação da Lei 10.925/2004, vigente até 21/06/2015. Hoje: "Fica dispensada a retenção de valor igual ou inferior a R$ 10,00 …"', r: [1, 0, -1], motivo: 'redação que valeu até 21/06/2015' },
        { texto: 'Se o fornecedor fosse do Simples, não haveria retenção.', norma: 'Lei 10.833/2003, art. 32, III', trecho: 'A retenção de que trata o art. 30 não será exigida na hipótese de pagamentos efetuados a: … III - pessoas jurídicas optantes pelo SIMPLES.', r: [1, 1, 1] },
        { texto: 'O valor retido é R$ 148,80.', norma: 'calculo.retencao_csrf', trecho: 'R$ 3.200,00 × 4,65% = R$ 148,80, pelo motor de cálculo', r: [1, 1, 1], calculo: true }
      ],
      fato: 'Num teste de 2023, os melhores modelos deixaram metade das respostas sem suporte completo nas citações (ALCE, EMNLP 2023).',
      notas: 'A afirmação 2 é exatamente o que uma IA comum escreve, porque a regra de R$ 5.000 está em muitas páginas antigas. O dispositivo existe, mas aquela redação não valia na data do pagamento: valeu até 21/06/2015. A verificação remove a frase e registra a remoção para o benchmark. A conferência das três perguntas é por código (identificador, datas de vigência); um modelo barato só classifica se o trecho sustenta a frase.' },

    { tipo: 'abstencao', capitulo: 'A confiança', curto: 'Não encontrei base', curta: true,
      titulo: 'Não encontrei base para afirmar isso.',
      frase: 'Sem fundamento, o Consultor não completa com o que o modelo acha. Diz o que pesquisou, o que faltou e o que dá para fazer.',
      tipos: [
        { nome: 'Sem base legal', texto: 'Não encontrei base para afirmar isso.', pesquisei: ['LC 123/2006, art. 18 e anexos', 'Resoluções do CGSN', 'Soluções de consulta sobre fator R'] },
        { nome: 'Data do fato', texto: 'Preciso da data do fato: a lei mudou em 11/11/2017.', pesquisei: ['CLT, art. 58, § 2º, nas duas redações'] },
        { nome: 'Divergência', texto: 'Há posições diferentes e nenhuma vincula. Mostro cada uma; a escolha é sua.', pesquisei: ['Tema 1.113 do STJ', 'CTN, art. 38, com a LC 227/2026', 'Decisões posteriores'] },
        { nome: 'Precedente pendente', texto: 'O tema foi afetado e ainda não tem tese. Não aplico como regra.', pesquisei: ['Situação do tema no tribunal', 'Decisões com o tema afetado'] },
        { nome: 'Premissa falsa', texto: 'Essa premissa não se sustenta: a norma citada foi revogada.', pesquisei: ['Histórico de redações do dispositivo'] },
        { nome: 'Sem base local', texto: 'Sem base local. Ainda não tenho a legislação de Cantagalo sobre ISS. Respondo pela regra federal, de 2% a 5% (LC 116/2003, arts. 8º e 8º-A); Cantagalo pode ter regra própria. Já pedi a inclusão.', pesquisei: ['LC 116/2003', 'Cobertura de Cantagalo: sem base local'] }
      ],
      fato: 'Avaliações que dão nota ao chute ensinam o modelo a chutar (Kalai et al., 2025). Aqui a abstenção é medida nos dois sentidos: errar por inventar e errar por calar.',
      notas: 'Os tipos de abstenção são do JU-04, seção 2.7, e do subplano 07, seção 7.4. Depois de se abster, ele não completa com o conhecimento do modelo: foi esse o vício que a Vals mediu nos chatbots, que diziam "não achei" e respondiam mesmo assim. A meta do benchmark pune os dois erros: inventar e dizer "não sei" quando havia resposta. Cantagalo é o exemplo que o próprio plano usa para fonte local fora da base.' },

    { tipo: 'divergencia', capitulo: 'A confiança', curto: 'Mostra e não escolhe', curta: true,
      titulo: 'Quando diverge, mostra e não escolhe.',
      frase: 'Sem tese que vincule, o Consultor mostra cada posição com o órgão, a data, o estado e a força, e deixa a escolha com o advogado.',
      pergunta: 'Qual a base de cálculo do ITBI numa compra de 2026?',
      posicoes: [
        { titulo: 'Tema 1.113 do STJ', data: 'REsp 1.937.821/SP · 24/02/2022', texto: 'A base é o valor de mercado; o valor declarado se presume correto; o município não pode arbitrar antes, por valor de referência.', selos: [['destaque', 'repetitivo'], ['atencao', 'RE pendente']] },
        { titulo: 'LC 227/2026', data: 'CTN, art. 38, §§ 1º a 4º · 13/01/2026', texto: 'Valor venal é o preço à vista em condições normais de mercado, estimado por critérios técnicos que o município divulga; o contribuinte contesta em procedimento específico.', selos: [['sucesso', 'lei complementar vigente']] },
        { titulo: 'Depois da LC 227', data: 'tribunais estaduais e doutrina, 2026', texto: 'Há decisões e artigos que mantêm o Tema 1.113 e outros que o veem superado. Nenhuma tese nova vincula.', selos: [['neutro', 'sem tese vinculante']] }
      ],
      fecho: 'Há posições diferentes e nenhuma vincula. Mostro cada uma; a escolha é sua.',
      notas: 'Regra R-J3 do JU-04: sem tese vinculante e com divergência, apresenta e não escolhe. O exemplo é vivo: o Tema 1.113 do STJ (24/02/2022) fixou que a base do ITBI é o valor de mercado, com presunção para o valor declarado; no site do STJ, consta como acórdão publicado, com RE pendente. Em 13/01/2026, a LC 227 acrescentou ao art. 38 do CTN a definição de valor venal e o procedimento de contestação. Desde então há decisões e artigos nos dois sentidos. O Consultor mostraria cada decisão com órgão e data, a força de cada uma e os tribunais que a base cobre.' },

    { tipo: 'responsabilidade', capitulo: 'A confiança', curto: 'A IA prepara, o advogado assina',
      titulo: 'A IA prepara. O advogado assina.',
      frase: 'O Consultor é apoio de quem tem inscrição. O desenho segue o que a OAB já recomenda.',
      linhas: [
        ['2.2', 'Escolher fornecedor que proteja os dados e permita não usá-los para treinar.', 'O conteúdo de um caso nunca sai do escritório: não treina, não avalia, não alimenta cache global.'],
        ['3.1', 'O julgamento profissional não é feito pela IA sem supervisão; nada privativo é delegado.', 'Peça é rascunho até a revisão assinada. Assinar, protocolar e dar ciência são sempre de uma pessoa.'],
        ['3.2', 'Atenção ao levantamento de jurisprudência e à veracidade do art. 77 do CPC.', 'Citação conferida no texto. Precedente com estado e força; superado nunca aparece como vigente.']
      ],
      rodape: 'E nunca sugere aval da OAB nem que substitui o advogado.',
      notas: 'À esquerda, itens da Recomendação 001/2024 do Conselho Federal da OAB (lida no PDF oficial). À direita, regras do JU-04: R-J5 (conteúdo de caso nunca sai do escritório), R-J6 (peça é rascunho até revisão assinada; protocolo nunca é automático), R-J2 (precedente com estado e força) e R-J7 (uso por advogado inscrito, sem sugerir aval da OAB). No pacote jurídico, o aprendizado entre escritórios só vem da base pública e das correções de advogados do grupo.' },

    /* ================= A base municipal ================= */
    { tipo: 'municipal', capitulo: 'A base municipal', curto: 'O municipal é o desafio',
      titulo: 'O municipal é o desafio.',
      frase: 'Federal e estadual têm serviços abertos ou um coletor por fonte. No município, cada um publica do seu jeito, e quase nenhum mantém texto compilado.',
      esferas: [
        ['Federal', 'API de legislação do Senado, diário oficial em dados, LexML', '10 anos'],
        ['Estadual', '27 entes, cerca de 100 coletores (Sefaz, diário, assembleia, tribunal administrativo)', '5 anos'],
        ['Municipal', '5.571 entes com o DF; o fácil primeiro, o resto sob demanda', '5 anos']
      ],
      funil: [
        [97180, 'publicações nos diários municipais de SC em outubro de 2026'],
        [6319, 'leis e decretos'],
        [230, 'com tema tributário']
      ],
      formas: [['22,9%', 'das leis revogam "as disposições em contrário" sem dizer quais'], ['4,3%', 'marcam a nova redação com (NR)']],
      fonte: 'Contagem do plano sobre os dados abertos do DOM/SC (CIGA), outubro de 2026',
      notas: 'Do Plano da Base de Legislação Municipal (versão 0.4). Federal: API do Senado, INLABS e LexML. Estadual: o LexML padroniza só 6 assembleias e o DF, então são cerca de 100 coletores (estimativa). Municipal: 5.571 entes. Em outubro de 2026, 97.180 publicações nos diários de SC; 1.295 leis e 5.024 decretos; 97 leis e 133 decretos com tema tributário. E a técnica legislativa atrapalha: quase um quarto das leis revoga "as disposições em contrário", e o "(NR)" aparece em só 4,3%. Expressão regular sozinha não basta.' },

    { tipo: 'cobertura', capitulo: 'A base municipal', curto: 'Diz o que sabe e o que não sabe', curta: true,
      titulo: 'Ele diz o que sabe e o que não sabe.',
      frase: 'Cada ente e cada assunto têm um nível de cobertura. O rótulo aparece na citação e, quando limita a conclusão, na primeira linha da resposta.',
      niveis: [
        { id: 'C0', nome: 'Sem base local', texto: [['b', 'Sem base local.'], ['t', ' Ainda não tenho a legislação de '], ['v', 'ente'], ['t', ' sobre '], ['v', 'domínio'], ['t', '. Respondo pela regra federal; '], ['v', 'ente'], ['t', ' pode ter regra própria. Já pedi a inclusão.']] },
        { id: 'C1', nome: 'Só publicações novas', texto: [['b', 'Só publicações novas.'], ['t', ' Acompanho as publicações de '], ['v', 'ente'], ['t', ' desde '], ['v', 'data'], ['t', ', mas ainda não tenho o texto atualizado de '], ['v', 'norma'], ['t', '. Cito o ato publicado; não afirmo a regra vigente.']] },
        { id: 'C2', nome: 'Texto atual · sem histórico', texto: [['b', 'Texto atual · sem histórico.'], ['t', ' Tenho o texto atual de '], ['v', 'norma'], ['t', ' de '], ['v', 'ente'], ['t', ', conferido em '], ['v', 'data'], ['t', '. Para fatos antes de '], ['v', 'data da âncora'], ['t', ', não confirmo qual redação valia.']] },
        { id: 'C3', nome: 'Com histórico de 5 anos', texto: [['b', 'Com histórico desde '], ['v', 'data'], ['b', '.'], ['t', ' Redação vigente em '], ['v', 'data do fato'], ['t', '.'], ['d', ' Mais "certeza média" ou "certeza baixa" quando for o caso, com o motivo.']] },
        { id: 'C4', nome: 'Amplo', texto: [['d', 'Igual ao C3, com os domínios cobertos: urbanismo, posturas, servidores.']] }
      ],
      nfse: 'Variante da NFS-e: "{ente} cadastrou {X}% para este serviço no Sistema Nacional da NFS-e (consultado em {data}). É um parâmetro, não a lei."',
      notas: 'Os textos dos rótulos foram aprovados pelo dono em 9/11/2026 (seção 8.2 do plano). O nível sai de regras sobre o registro de cobertura: coletor parado rebaixa o nível sozinho. O grau de segurança da resposta é o menor entre o da afirmação, a certeza da versão citada e o nível de cobertura. A tabela da NFS-e Nacional, com alíquotas por subitem e vigência, entra como parâmetro rotulado, nunca como lei.' },

    { tipo: 'revisaoia', capitulo: 'A base municipal', curto: 'A revisão pela IA', curta: true,
      titulo: 'A IA revisa a IA, às cegas.',
      frase: 'Dois modelos de famílias diferentes leem cada ato sem ver um ao outro. O código compara, confere a evidência e consolida; um revisor de uma terceira família julga sem saber quem propôs o quê.',
      nos: [
        { id: 'ato', nome: 'Ato publicado', quem: 'original com hash' },
        { id: 'a', nome: 'Extração A', quem: 'família 1' },
        { id: 'b', nome: 'Extração B', quem: 'família 2, sem ver a A' },
        { id: 'cmp', nome: 'Comparação', quem: 'código' },
        { id: 'evi', nome: 'Evidência literal', quem: 'código' },
        { id: 'rec', nome: 'Reconciliação', quem: 'só o que divergiu' },
        { id: 'val', nome: 'Validação', quem: 'regras em código' },
        { id: 'rev', nome: 'Revisor final', quem: 'família 3, às cegas' },
        { id: 'con', nome: 'Consolidação', quem: 'código' },
        { id: 'ouro', nome: 'Conferência', quem: 'contra o ouro' }
      ],
      rodadas: [
        { titulo: 'A e B concordam já na comparação', caminho: ['ato', 'ab', 'cmp', 'evi', 'val', 'rev', 'con', 'ouro'], certeza: 'alta', texto: 'Evidência no original, validador sem falha, revisor aprova, ouro concorda.' },
        { titulo: 'A e B divergem num campo', caminho: ['ato', 'ab', 'cmp', 'evi', 'rec', 'val', 'rev', 'con', 'ouro'], certeza: 'média', texto: 'A reconciliação resolve com mais contexto; A e B conferem a proposta, cada um sem ver o outro.' },
        { titulo: 'A divergência persiste', caminho: ['ato', 'ab', 'cmp', 'evi', 'rec', 'val', 'rev'], certeza: 'baixa', texto: 'O evento não entra no texto. O dispositivo fica marcado "pode ter sido alterado por este ato", com o ato citado.' }
      ],
      notas: 'Decisão do dono em 9/11/2026 (seção 13 do plano): revisão pela IA como padrão em toda a ingestão, federal, estadual e municipal. Duas extrações independentes por famílias diferentes, comparação e conferência da evidência por código, reconciliação só nos campos divergentes, validação, revisor final de uma terceira família, consolidação por código e conferência contra o ouro automático (compilação do SAPL, consolidações oficiais, parâmetros da NFS-e). Divergência que persiste não vai para uma pessoa: rebaixa a certeza, que aparece no rótulo. A escolha das famílias sai do benchmark; a regra fixa é o revisor final nunca ser de quem extraiu.' },

    { tipo: 'limite', capitulo: 'A base municipal', curto: 'Concordar não é prova',
      titulo: 'Concordar não é prova.',
      frase: 'Modelos diferentes erram juntos. Por isso a concordância é só uma das travas, e o erro é medido contra um ouro que o processo nunca vê.',
      numero: '60%',
      numeroTexto: 'Quando dois modelos erravam, davam a mesma resposta errada em 60% dos casos, num dos conjuntos. Mais de 350 modelos avaliados (Kim et al., ICML 2025).',
      travas: ['Evidência literal', 'Famílias às cegas', 'Consolidação em código', 'Ouro reservado', 'NFS-e', 'Reportes', 'Certeza no rótulo'],
      notas: 'O limite dito com franqueza, na seção 13.6 do plano. Modelos maiores e mais precisos têm erros mais correlacionados, mesmo de fornecedores diferentes. Então nenhuma trava sozinha basta: evidência literal conferida por código elimina a invenção de texto; famílias diferentes às cegas reduzem o ponto cego comum; a consolidação por código pega leituras que quebram a estrutura; o ouro externo, com uma parte reservada só para medir, dá a taxa de erro; a NFS-e é segunda fonte para alíquotas; os reportes dos usuários, confirmados na publicação oficial, pegam o erro que todos os modelos compartilham; e a certeza visível avisa quem lê.' },

    { tipo: 'blocos', capitulo: 'A base municipal', curto: 'Blocos e pacotes', curta: true,
      titulo: 'Blocos que os pacotes dividem.',
      frase: 'A base é feita de 30 blocos, cada um construído uma vez. Os pacotes dividem os mesmos blocos: documentos fiscais está no Contábil, no BPO, no Tributário e no Empresarial.',
      pacotes: [['CTB', 'Contábil'], ['BPO', 'BPO'], ['CIV', 'Civil'], ['FAM', 'Família'], ['TRA', 'Trabalhista'], ['PRE', 'Previdenciário'], ['CON', 'Consumidor'], ['PEN', 'Penal'], ['EMP', 'Empresarial'], ['TRI', 'Tributário'], ['IMO', 'Imobiliário'], ['ADM', 'Administrativo']],
      // Colunas: CTB BPO CIV FAM TRA PRE CON PEN EMP TRI IMO ADM (I inteiro, F fatia, . não usa). Seção 6.4 do plano, versão 0.4.
      blocos: [
        ['B01', 'Fundamentos e prazos', 'FFIIIIIIIIII'], ['B02', 'Documentos fiscais', 'II......FI..'], ['B03', 'Retenções na fonte', 'II.......I..'],
        ['B04', 'Simples e MEI', 'IF......FI..'], ['B05', 'Tributos federais', 'I.......FI..'], ['B06', 'Reforma do consumo', 'IF......FI..'],
        ['B07', 'ICMS e IBS estadual', 'IF.......I..'], ['B08', 'ITCMD e IPVA', 'I..F.....IF.'], ['B09', 'ISS e IBS municipal', 'IF.......I..'],
        ['B10', 'IPTU e ITBI', 'I........II.'], ['B11', 'Taxas municipais', 'IF.......I.F'], ['B12', 'Processo tributário', 'F........I.F'],
        ['B13', 'Trabalho, DP e eSocial', 'IF..IF......'], ['B14', 'Previdência', 'I...FI......'], ['B15', 'Processo do trabalho', '....I.......'],
        ['B16', 'Societário e registro', 'IFF.....I...'], ['B17', 'Recuperação e falência', 'F.F.....IF..'], ['B18', 'Normas contábeis', 'IF......FF..'],
        ['B19', 'Pagamentos e títulos', 'FIF...F.I...'], ['B20', 'Juros, multa e correção', 'FIIFF.F.F...'], ['B21', 'Proteção de dados', 'FF....F....F'],
        ['B22', 'Civil material', 'FFIFF.F.F.F.'], ['B23', 'Processo civil', '.FIFFFF.FFFF'], ['B24', 'Família e sucessões', 'F..I......F.'],
        ['B25', 'Consumidor e bancário', '.FF...I.....'], ['B26', 'Penal', 'F......I.F..'], ['B27', 'Imobiliário', '..F.......I.'],
        ['B28', 'Administrativo', '...........I'], ['B29', 'Saúde suplementar', '............'], ['B30', 'Blocos da cauda', '............']
      ],
      rodape: 'Do lançamento contábil e BPO, Tributário e Empresarial saem quase prontos, e Trabalhista e Previdenciário com a parte material pronta: cerca de 30% dos advogados (estimativa do plano).',
      notas: 'Decisão do dono na versão 0.4 do plano: a base deixa de ser dividida em módulos estanques. Cada bloco tem as suas camadas federal, estadual e municipal, o seu coletor, a sua cobertura e a sua vigilância, e é construído e revisado uma vez. "Inteiro" é o bloco todo, com os avisos de mudança; "fatia" são só os dispositivos que o pacote cita, para leitura e citação. Um bloco pronto destrava todos os pacotes que o usam. Saúde e os blocos da cauda entram no pacote "demais", que não está nesta tela.' },

    /* ================= A melhoria ================= */
    { tipo: 'benchmark', capitulo: 'A melhoria', curto: 'Cada correção vira prova',
      titulo: 'Cada correção vira prova.',
      frase: 'Quem usa marca "correta" ou "incorreta" e corrige. A correção revisada vira caso de teste, com a data e as normas que precisam ser citadas.',
      etapas: [
        ['Correção', '"Na data do fato valia a redação anterior."'],
        ['Caso de teste', 'Pergunta, data, gabarito e os dispositivos a citar'],
        ['Benchmark', 'Uma parte fica reservada e nunca é vista pelo que evolui'],
        ['Métricas', 'Conclusão, citação, vigência, abstenção nos dois sentidos']
      ],
      metas: [['zero', 'citação inexistente'], ['zero', 'precedente superado citado como vigente'], ['menos de 17%', 'de respostas erradas ou mal fundamentadas nos pacotes grandes']],
      juridico: 'No jurídico, os casos são escritos por advogados do grupo em duplo cego, nunca com dados de clientes.',
      notas: 'Camada 4 do Plano do Assistente e seção 9 do subplano 07; para o jurídico, seções 6.2 e 6.3 do JU-04. A meta de "menos de 17%" vem do benchmark de Stanford: com 200 casos, 12% ou menos observado deixa o limite superior abaixo de 17%. Também se publica a taxa de abstenção, para o sistema não "vencer" se abstendo. Quando uma norma citada muda, o caso volta para revisão.' },

    { tipo: 'dgm', capitulo: 'A melhoria', curto: 'Um laço inspirado na DGM', curta: true,
      titulo: 'Um laço inspirado na DGM.',
      frase: 'Variantes do método fazem a mesma prova. Só entra no arquivo a que passa; as fracas ficam guardadas, porque às vezes o salto vem delas. Nenhuma vai ao ar sem uma pessoa aprovar.',
      artigo: [
        ['Modelos congelados', 'só o código do agente muda'],
        ['80 iterações', 'SWE-bench de 20,0% para 50,0%'],
        ['Polyglot', 'de 14,2% para 30,7%'],
        ['Por rodada', 'cerca de 2 semanas e US$ 22 mil']
      ],
      fonte: 'Darwin Gödel Machine, Zhang, Hu, Lu, Lange e Clune (arXiv 2505.22954; ICLR 2026)',
      laços: 'Na Heild, dois laços, ambos fora da produção: o do Consultor e o da ingestão.',
      notas: 'A Darwin Gödel Machine mantém um arquivo de agentes. A cada iteração, sorteia um, que lê os próprios registros de erro, propõe uma mudança no próprio código e faz a prova; se funcionar, entra no arquivo. Os modelos de base ficam congelados. Na Heild é um laço inspirado nela, não a DGM inteira: uma rodada da DGM no SWE-bench custou cerca de US$ 22 mil. No Consultor, a área editável é roteamento, instruções, quanto contexto montar e quando buscar de novo. Na ingestão, as instruções dos extratores e do reconciliador e os limiares, contra o ouro escondido.' },

    { tipo: 'burla', capitulo: 'A melhoria', curto: 'A métrica pode ser burlada',
      titulo: 'A métrica pode ser burlada.',
      frase: 'O artigo da DGM conta: uma variante apagou o registro dos marcadores que denunciavam o uso inventado de ferramentas, apesar da instrução, e passou no detector sem resolver o problema.',
      editavel: ['Roteamento', 'Instruções', 'Quanto contexto montar', 'Quando buscar de novo', 'Limiares da ingestão'],
      trancado: ['Base legal', 'Funções de cálculo e tabelas', 'A verificação', 'O ouro e as funções de medida', 'Permissões e limites'],
      notas: 'O próprio artigo chama isso de burla do objetivo (objective hacking): a nota subiu, o problema ficou. Por isso a verificação de citações não é editável pela DGM, o ouro de medição fica escondido e separado do ouro de conferência, as funções de medida ficam fora da área editável, e cada versão nova passa por revisão humana antes de ir ao ar. Se a variante não vencer a versão de partida no conjunto reservado, fica desligada e o custo não muda.' },

    /* ================= Fecho ================= */
    { tipo: 'diferenca', capitulo: 'Fecho', curto: 'O que muda', curta: true,
      titulo: 'O que muda em relação a uma IA comum.',
      linhas: [
        ['Data do fato', 'Responde pelo texto que viu no treino', 'Responde pela redação da data e diz qual data usou'],
        ['Citação', 'Cita de memória e pode inventar', 'Cita o trecho, conferido antes de sair'],
        ['Normas ligadas', 'Para no texto mais parecido', 'Segue quem altera, regulamenta e julga'],
        ['Quando não sabe', 'Chuta com segurança', 'Diz que não encontrou e o que pesquisou'],
        ['Divergência', 'Escolhe um lado', 'Mostra as posições e a força de cada uma'],
        ['Contas e prazos', 'Faz de cabeça', 'Funções em código, com a memória de cálculo'],
        ['Cobertura', 'Não diz o que não tem', 'Mostra o nível de cobertura do ente'],
        ['Melhoria', 'Espera o próximo modelo', 'Melhora medindo, com a métrica trancada']
      ],
      notas: 'O resumo. Se perguntarem qual é o principal: a data do fato com a citação conferida. É o que ataca as duas causas de erro que o estudo de Stanford descreve: autoridade inaplicável por tempo ou jurisdição, e concordar com premissa errada.' },

    { tipo: 'fecho', capitulo: 'Fecho', curto: 'Fecho', curta: true, forma: 'lupa',
      titulo: 'A lei certa, na data certa, com a prova.',
      luz: ['dp', 'consultor', 'fiscal', 'consultor', 'bpo_pagar'],
      notas: 'Termine aqui e abra para perguntas. A Heild ainda não foi lançada: não há clientes nem números de uso. O que existe é o método, os planos e a base sendo desenhada.' }
  ];

  D.versoes = function () {
    var curta = S.filter(function (s) { return s.curta; });
    return [
      { id: 'completa', nome: 'Completa', descricao: S.length + ' slides, com as cenas técnicas', slides: S },
      { id: 'curta', nome: 'Curta', descricao: curta.length + ' slides, para uns 20 minutos', slides: curta }
    ];
  };
})();
