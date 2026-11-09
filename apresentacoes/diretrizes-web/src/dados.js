/*
 * Diretrizes da marca Heild — os dados das diretrizes.
 * Tudo vem do design system (branch design-system): README (as formas e os tempos), cores.md, orbs.md,
 * tipografia.md, forma.md, gradientes.md e tokens.json. As cores são sempre nomes de tokens, lidos do
 * tema na hora. Os exemplos de fala usam os escritórios e clientes fictícios do protótipo.
 */
(function () {
  'use strict';
  var G = window.Genealogia = window.Genealogia || {};

  /* os integrantes (orbs.md), na ordem do time */
  G.INTEGRANTES = [
    { id: 'assistente', nome: 'Assistente', cor: '--orb-assistente', olho: '--olho-assistente', faz: 'Recebe qualquer pedido, divide entre o time e acompanha até o fim.' },
    { id: 'consultor', nome: 'Consultor', cor: '--orb-consultor', faz: 'Responde sobre a lei com o artigo, a data e o grau de segurança.' },
    { id: 'atendimento', nome: 'Atendimento', cor: '--orb-atendimento', faz: 'Fala com o cliente no WhatsApp, cobra documentos e tria as conversas.' },
    { id: 'financeiro', nome: 'Financeiro', cor: '--orb-financeiro', faz: 'Prepara as cobranças, os contratos e as contas do próprio escritório.' },
    { id: 'fiscal', nome: 'Fiscal', cor: '--orb-fiscal', faz: 'Apura os tributos, gera as guias e prepara as transmissões.' },
    { id: 'dp', nome: 'DP', cor: '--orb-dp', faz: 'Prepara admissões, a folha e os envios ao eSocial.' },
    { id: 'contabil', nome: 'Contábil', cor: '--orb-contabil', faz: 'Concilia, classifica e fecha o mês com o balancete.' },
    { id: 'societario', nome: 'Societário', cor: '--orb-societario', faz: 'Cuida do cadastro na Receita, dos certificados e das exigências da Junta.' },
    { id: 'notas', nome: 'Notas', cor: '--orb-notas', faz: 'Captura as notas do mês e confere a tributação.' },
    { id: 'bpo_pagar', nome: 'Contas a Pagar', cor: '--orb-bpo-pagar', faz: 'Monta os lotes de pagamento e confere fornecedor novo.' },
    { id: 'bpo_receber', nome: 'Contas a Receber', cor: '--orb-bpo-receber', faz: 'Emite os boletos e acompanha os recebimentos de cada empresa.' },
    { id: 'bpo_conciliacao', nome: 'Conciliação', cor: '--orb-bpo-conciliacao', faz: 'Concilia o extrato e separa o que precisa de uma pessoa.' },
    { id: 'bpo_gerencial', nome: 'Gerencial', cor: '--orb-bpo-gerencial', faz: 'Fecha o relatório financeiro do mês de cada empresa.' }
  ];
  G.porId = {}; G.INTEGRANTES.forEach(function (it) { G.porId[it.id] = it; });

  /* os estados do orb (orbs.md) e a reação do <orb-avatar> que mostra cada um */
  G.ESTADOS = [
    { id: 'disponivel', nome: 'Disponível', reacao: 'idle', faz: 'parado, olhando', quando: 'Sem trabalho agora.' },
    { id: 'pensando', nome: 'Pensando', reacao: 'thinking', faz: 'olhos para cima, balanço lento', quando: 'Antes de responder.' },
    { id: 'trabalhando', nome: 'Trabalhando', reacao: 'working', faz: 'vaga e olha em volta', quando: 'Uma tarefa em andamento, ou escrevendo.' },
    { id: 'precisa_de_voce', nome: 'Precisa de você', reacao: 'needs', faz: 'chama a atenção', quando: 'Deixou um cartão esperando aprovação.' },
    { id: 'concluido', nome: 'Concluído', reacao: 'done', faz: 'contente', quando: 'Terminou e entregou.' },
    { id: 'dormindo', nome: 'Em pausa', reacao: 'sleeping', faz: 'olhos fechados', quando: 'Integrante pausado.' },
    { id: 'erro', nome: 'Com erro', reacao: 'error', faz: 'aflito', quando: 'Algo falhou e precisa de alguém.' }
  ];

  /* as 16 formas do I (README do design system, "As formas"): nome, a forma e quando usar */
  G.FORMAS = [
    { id: 'centralizar', nome: 'Centralizar', forma: 'grade de 9 pontos que volta a ser uma peça só', uso: 'animação principal da marca: hero do site, abertura, splash' },
    { id: 'orb', nome: 'Orb', forma: 'o I vira uma esfera com olhos recortados, olha para dois lados e volta', uso: 'presença do assistente; onboarding; telas de IA' },
    { id: 'contabil', nome: 'Contábil', forma: 'três barras crescentes na linha de base', uso: 'módulo contábil, relatórios, fechamento concluído' },
    { id: 'juridico', nome: 'Jurídico', forma: 'o I tomba e vira um sinal de igual', uso: 'jurídico e conformidade (fora do lançamento; a forma fica pronta)' },
    { id: 'bpo', nome: 'BPO', forma: 'duas cápsulas formam um check', uso: 'rotina entregue, tarefa concluída' },
    { id: 'ia', nome: 'IA', forma: 'três cópias do I em leque que giram 60°', uso: 'o agente começou a trabalhar' },
    { id: 'atendimento', nome: 'Atendimento', forma: 'três pontos pulando em onda', uso: 'chat, alguém digitando, carregamento' },
    { id: 'financeiro', nome: 'Financeiro', forma: 'um $: S em zigue-zague com a haste sobrando em cima e embaixo', uso: 'financeiro, cobrança, pagamentos' },
    { id: 'tempo', nome: 'Tempo', forma: 'ampulheta que vira 180° e cabe na própria caixa', uso: 'timesheet, prazos, horas' },
    { id: 'arquivos', nome: 'Arquivos', forma: 'pasta em contorno, com aba', uso: 'arquivos, documentos' },
    { id: 'conversa', nome: 'Conversa', forma: 'balão de fala com rabicho', uso: 'CRM, conversa com o cliente' },
    { id: 'celular', nome: 'Celular', forma: 'o aparelho, com um ponto como botão', uso: 'app do cliente' },
    { id: 'painel', nome: 'Painel', forma: 'grade bento: coluna alta, barras e pontos', uso: 'painel, dashboard, widgets' },
    { id: 'lupa', nome: 'Lupa', forma: 'lente octogonal com cabo a 45°, que varre', uso: 'consultor, análise, busca' },
    { id: 'equipe', nome: 'Equipe', forma: 'três pessoas, a do meio mais alta, em onda de aceno', uso: 'integrantes, o time' },
    { id: 'orbs', nome: 'Orbs', forma: 'o I vira o orb, que se divide como uma célula em três orbs com olhos e olhar próprio; na volta se fundem', uso: 'integrantes, o time de IA' }
  ];

  /* a escala de areia (tokens.json) */
  G.ESCALA = ['50', '100', '150', '200', '300', '400', '500', '600', '650', '700', '800', '850', '900', '925', '950'];

  /* as camadas (cores.md): nome, token, passo no claro e no escuro, onde */
  G.CAMADAS = [
    { nome: 'Fundo', token: '--fundo', claro: '50 → 300', escuro: '900 → 950', onde: 'a página, sempre em gradiente' },
    { nome: 'Lateral', token: '--lateral', claro: '150 → 400', escuro: '850 → 925', onde: 'a barra lateral' },
    { nome: 'Rebaixada', token: '--rebaixada', claro: '200 → 300', escuro: '925 → 950', onde: 'trilhos, faixas, citações' },
    { nome: 'Superfície', token: '--superficie', claro: '100', escuro: '850', onde: 'painéis e cartões' },
    { nome: 'Elevada', token: '--elevada', claro: '50', escuro: '800', onde: 'campo, menu, cartão dentro de painel' }
  ];
  /* os pares de contraste conferidos (cores.md, "Contraste conferido") */
  G.CONTRASTES = [
    { texto: '--texto', nome: 'Texto' }, { texto: '--texto-suave', nome: 'Texto suave' }, { texto: '--destaque-texto', nome: 'Destaque de texto' }
  ];
  G.CAMADAS_CONTRASTE = [['--fundo', 'Fundo'], ['--superficie', 'Superfície'], ['--elevada', 'Elevada'], ['--rebaixada', 'Rebaixada']];

  /* a escala de tipo (tipografia.md): estilo, família, tamanho, entrelinha, peso, espaçamento, exemplo, onde */
  G.ESCALA_TIPO = [
    ['hero', 'titulo', 72, 76, 500, '-0.04em', 'Tudo, num lugar só.', 'Hero do site e da capa; 44 px no celular'],
    ['display', 'titulo', 48, 48, 300, '-0.025em', 'No que posso ajudar?', 'Uma frase por tela; 36 px no celular'],
    ['número grande', 'titulo', 36, 40, 300, '0', '41/58', 'O número de um widget, tabular'],
    ['título da página', 'titulo', 30, 36, 300, '-0.025em', 'Hoje', 'Título da tela; 24 px no celular'],
    ['título de seção', 'titulo', 24, 32, 300, '-0.025em', 'Fechamento de outubro', 'Gaveta, seção longa'],
    ['título de bloco', 'texto', 18, 28, 600, '0', 'BPO', 'Cabeçalho do chat, cartão grande'],
    ['corpo grande', 'texto', 16, 24, 400, '0', 'O Contábil terminou a primeira parte.', 'Leitura longa fora do chat; raro'],
    ['corpo', 'texto', 14, 20, 400, '0', 'Conciliação fechada: 211 de 214 lançamentos casados.', 'O texto da interface'],
    ['rótulo', 'texto', 12, 16, 400, '0', 'contexto: Carteira', 'Metadado, legenda, chip'],
    ['micro', 'texto', 11, 16, 400, '0', '08:32', 'Só a hora da mensagem'],
    ['código', 'mono', 12, 16, 400, '0', 'FIN-201', 'Código de tarefa, chave, versão']
  ];

  /* forma (forma.md) */
  G.RAIOS = [['--raio-painel', '34 px', 'Painel grande'], ['--raio-xl', '25,5 px', 'Gaveta, diálogo'], ['--raio-campo', '24 px', 'Campo do chat'], ['--raio-cartao', '20 px', 'Cartão, widget'],
    ['--raio-lg', '17 px', 'Botão, campo'], ['--raio-md', '12,75 px', 'Item de menu'], ['--raio-sm', '8,5 px', 'Miniatura'], ['--raio-pilula', 'redondo', 'Sugestão, selo']];
  G.SOMBRAS = [['--sombra-contorno', 'Chip, botão solto'], ['--sombra-cartao', 'Cartão e widget'], ['--sombra-painel', 'O painel da tela'], ['--sombra-md', 'Popover, menu'], ['--sombra-lg', 'Gaveta, diálogo']];
  G.ESPACOS = [[1, 4, 'Ícone e rótulo colados'], [2, 8, 'Entre chips e botões'], [3, 12, 'Dentro de cartão pequeno'], [4, 16, 'Padding de cartão; margem no celular'],
    [5, 20, 'Padding de painel médio'], [6, 24, 'Padding de painel; a grade de pontos'], [8, 32, 'Entre seções']];

  /* a voz: falas de integrantes, escritas como no produto (cerca de 55 caracteres por segundo) */
  G.FALAS = [
    ['contabil', 'Conciliei 211 de 214 lançamentos da Metalúrgica. Faltam três, que precisam de uma pessoa.'],
    ['fiscal', 'As guias de outubro estão prontas para você aprovar.'],
    ['bpo_pagar', 'Montei o lote de sexta: 4 contas.'],
    ['consultor', 'Li a LC 123 para o fator R da Clínica Sorriso.']
  ];
})();
