# Revisão das regras de negócio sobre as telas

Passada feita com o escritório de demonstração montado (Contábil Andrade & Lima, sete
contas, sete clientes nomeados e o resto da carteira agregado). Para cada regra: de onde
vem, onde aparece no wireframe e em que pé está. "Corrigido" quer dizer que a tela fazia
outra coisa antes desta revisão.

## 1. Quem vê o quê (Fundações 3; 03, 3.1 e 9; 04, 10.1; 05, 8.1; revisão 00)

| Regra | Fonte | Onde | Situação |
| --- | --- | --- | --- |
| Configurações só para o Administrador | 03, 2.0 e 6 | Item no pé da barra só para a Fernanda | ok |
| Abas do Painel pelo vínculo ao setor; Obrigações para quem tem setor com equipe; Gestão para Administrador e Gestor nos setores que gere | 03, 3.1 | Ana vê Obrigações e DP; João vê Obrigações, Fiscal, Contábil e Gestão; Bruno vê Societário e Obrigações; Rafael vê Obrigações, Notas e Fiscal | corrigido (antes todos viam as 8) |
| Exceção por tela bloqueia ou libera uma aba inteira, com nível máximo | Fundações 3.5 | Bruno tem `aba.societario.contratos` bloqueada (fica registrada em Usuários); João tem `aba.financeiro.honorarios` liberada em leitura | corrigido: o João vê Financeiro › Contratos sem botões de edição |
| Financeiro do escritório: Administrador e Gestor com o setor; Colaborador só por exceção (ler) | 03, 6.8 | Fernanda vê as quatro abas; João, só Contratos em leitura; os demais não veem o item | corrigido |
| Conversas do CRM só dos próprios setores; de outro setor, nem na busca | 04, 10.1 | Lista filtrada pelos setores da conta; um link vindo do Time abre a conversa mesmo assim (ela foi transferida ou citada) | corrigido |
| Leads só com o setor Gestão e Atendimento | 04, 5 | Fernanda e Bruno | corrigido |
| Comunicados: o Colaborador rascunha e envia com aprovação do Gestor | 04, 10.1 | Para Colaborador, o botão vira "Mandar para aprovação" e o aviso chega no sino da Fernanda | corrigido |
| Números e configuração do atendimento: Administrador; o Gestor configura o próprio setor | 04, 10.1 | Fernanda e João | corrigido |
| Timesheet: Colaborador vê Meu tempo e Confirmações; Gestor, também a Equipe dos setores que gere | 05, 8.1 | Ana, Bruno e Rafael veem duas abas; João, três | corrigido (antes todos eram "admin") |
| Rentabilidade (fase 3) só para Administrador e Gestor com Gestão ou Financeiro | revisão 00 | Só a Fernanda | corrigido |
| Colaborador vê a porcentagem do próprio limite de IA, nunca tokens nem custo | 03 P10; 05 H6 | Meu tempo mostra "% do limite"; custo só em Equipe | ok |
| Cada pessoa tem os próprios integrantes (Assistente + um por setor) | 02, 3 | O Time de cada conta só mostra os integrantes dos setores dela; o Vigia do ISS é da Fernanda | corrigido (faltavam Notas, Societário e Atendimento) |
| Segundo fator obrigatório para administradores | Fundações 2.1 | Login pede o código à Fernanda e ao João (que ligou o dele); a regra aparece em Minha conta | ok |
| Inatividade: só onde o tempo é registrado sozinho (Painel com cliente e CRM, menos Números) e sem deslogar | decisão do usuário, 7/11 (muda Fundações 2.1, item 1) | Selo “contando tempo” no cabeçalho dessas telas; 3 min sem clique, tecla, rolagem ou digitação cobre a área de trabalho com “Em espera”, o tempo para no último evento e “Continuar” abre sessão nova. Início (só a IA conta, como sessão do integrante), Painel na carteira, Timesheet, Financeiro e Configurações não contam nem entram em espera | corrigido (antes o login dizia que a sessão fechava) |
| Conta desativada e convite pendente não entram | Fundações 2.1 | Rodrigo e Carla aparecem no login e são barrados com o motivo | ok |

## 2. O que a IA pode e não pode fazer (Fundações 6; 02, 3.3)

| Regra | Onde | Situação |
| --- | --- | --- |
| Transmitir, pagar e assinar sempre passam por uma pessoa | Gaveta Transmitir pede "conferi os valores"; Contas a pagar aprova e agenda, e a liberação final é no banco; contratos vão para assinatura pela pessoa | ok |
| Ação "executar com aprovação" vira cartão no chat do integrante | Botões com esse nível no Painel postam o cartão no Time e avisam com link | corrigido (antes os botões não faziam nada) |
| Aprovar executa de verdade: a tarefa anda, o cliente recebe, o evento fica com o nome de quem aprovou | PGDAS-D do Café Central, lote de 14 PGDAS-D, contrato de experiência da Metalúrgica, assinatura da Helena | corrigido (antes só mudava o visual do cartão) |
| Recusar devolve à pessoa; editar e aprovar fica registrado como edição | Efeitos dos cartões | ok |
| Preço nunca é citado pelo integrante de Atendimento | Conversa do lead e chat do Atendimento | ok |

## 3. Mesmo fato visto de todos os lados

O que cada módulo mostra agora sai do mesmo registro:

- **Tarefa:** a ficha da tarefa (abre de qualquer lista, cartão ou aviso) mostra a conversa
  do CRM em que o assunto corre, o integrante, as sessões de tempo, a aba do Painel, o
  honorário em aberto e a ficha do cliente, cada um com o botão que leva até lá.
- **Conversa:** a lateral do CRM mostra os responsáveis por setor (da ficha do cliente), as
  tarefas abertas (clicáveis), a tarefa que segura a conversa, e leva ao Painel, ao Time e à
  ficha.
- **Envio:** cobrar, enviar documento e transmitir gravam a mensagem na conversa certa do
  CRM, pelo contato que recebe aquele assunto, e o aviso de confirmação leva até ela.
- **Documento preparado:** aparece como cartão no chat do integrante, com "Enviar ao cliente".
- **Avisos:** o sino de cada conta tem os avisos dela, e cada um abre o item exato (conversa,
  integrante, tarefa, fatura).

Contradições de dados corrigidas nesta revisão:

| Antes | Depois |
| --- | --- |
| "Café Central ME" aparecia no Time sem existir como cliente | Cliente 615, do mesmo sócio da Padaria (o CRM já dizia que João Batista "também fala por" ela) |
| O cartão de tarefa do Café Central mostrava a tarefa da Padaria | Tarefa própria (FIS-009 · Café Central) |
| O Fiscal citava "Marta (financeiro)" da Padaria e uma conversa que não existia | A conversa fiscal com João Batista existe no CRM (cv9), com a divergência de R$ 3.120 |
| Intimação do CT-e: Rota Sul no CRM, Metalúrgica na tarefa | Tarefa FIS-038 é da Rota Sul e aponta para a conversa |
| Financeiro da Metalúrgica: "Rita Campos" no CRM, "Joana" no Financeiro, "Marta" no Painel | Rita Campos em todos |
| Cartão do Contábil apontava para a tarefa "t9", que não existia | Aponta para CTB-016 da lista |
| Tarefas citadas nas conversas não existiam (FIS-022, CTB-047, CON-008, admissões da Padaria) | Criadas e ligadas às conversas |
| Responsáveis da lateral do CRM divergiam do resto (Padaria: Fiscal com o João) | Saem da ficha do cliente; Fiscal da Padaria é o Rafael |
| Meu tempo mostrava o dia da Fernanda para qualquer conta | Cada pessoa tem o próprio dia, com as tarefas dela |
| "Poupadas −31,5 h" (o til lia como sinal de menos) | "31,5 h" com "(estim.)" no título da coluna |

## 4. Coisas usadas pelo sistema sem lugar para configurar

| O quê | Quem usa | Agora |
| --- | --- | --- |
| Quem recebe cada assunto no cliente (guias, folha, honorários...) | Cobrança, entrega de guias, régua, comunicados | Ficha do cliente: contatos com assuntos, WhatsApp, e-mail e app. Assunto sem ninguém vai ao sócio (04 A1) |
| Responsável de cada setor por cliente | Lateral do CRM, ficha da tarefa, distribuição | Ficha do cliente: responsáveis por setor (Gestor e Administrador editam; Colaborador vê) |
| Preferências de aviso da pessoa | Sino, resumo diário, WhatsApp urgente | Minha conta (menu do usuário e "Preferências" no sino) |
| Senha, segundo fator e sessões abertas | Login | Minha conta; o segundo fator obrigatório aparece travado com o motivo |
| Histórico do perfil do cliente (versões) | Cabeçalho de cada aba do Painel | Gaveta de histórico com as versões e as datas |
| Relatórios da aba (período, formato, agendamento) | Widget de relatórios | Gaveta "Gerar relatório" |
| Tarefa criada à mão | Listas de tarefas | Gaveta "Nova tarefa" (prazo interno, responsável pessoa ou integrante) |

Já tinham configuração (conferido): horário, feriados, SLA, etiquetas, modelos, mensagens
automáticas e números (CRM); jornada, inatividade, itens por dia, custo-hora, portais da
extensão, sistemas contábeis (Timesheet); provedor de cobrança, NFS-e, política de
inadimplência, contas, plano de contas, alçadas, importação (Financeiro); escritório, setores,
usuários e exceções, armazenamento, tema, integrantes, limites e assinatura (Configurações).

## 5. App do cliente (06)

| Regra | Fonte | Onde | Situação |
| --- | --- | --- | --- |
| Entrada sem senha, por código no WhatsApp ou e-mail cadastrado | 06, 2.1 | Contato fora da ficha é barrado ("peça o convite") | ok |
| Uma pessoa, várias empresas | 06, 2.2 | João Batista troca entre Padaria e Café Central | ok |
| Papel define as áreas; RH não vê guias nem honorários | 06, 2.4 | `areasDo` no app; Serviços e Societário só para sócio | ok |
| Pendência respondida pelo app vira item recebido, sem o escritório redigitar | 06, 4.1 | Tarefa volta a "em andamento", mensagem com anexo na conversa do setor, aviso ao responsável da ficha | ok |
| Pedido do cliente vira tarefa com origem marcada | 06, 4.3 | Tipos limitados ao papel; aviso abre a ficha da tarefa | ok |
| Certificado: termo antes do arquivo, senha nunca exibida | 06, 5 | Empresa › Certificado digital | ok |
| Serviço extra: o escritório liga por cliente (ativo, disponível, oculto); o cliente só pede | 06, 3.10 e 8 | Ficha do cliente › Serviços extras; no app, “tenho interesse” vira GES-002, mensagem no Atendimento e aviso | ok |
| Emissor de NFS-e: tributação travada pelo escritório; cliente só preenche tomador, valor e descrição | 06, 8 (NFE-201) | Código de serviço e ISS travados; conferência antes de emitir; cancelar pede motivo; Notas é avisado | ok |
| Consultor: factual direto, opinião ao contador | 06, 9 | Pergunta de regime ou demissão vira CON-001 para o responsável da Consultoria | ok |
| Contestar fatura pausa a régua | 06, 4.5; 07 | Aviso ao Financeiro com link para a fatura | ok |

## 6. Documentos (Fundações 4.11 e 7)

| Regra | Onde | Situação |
| --- | --- | --- |
| Um arquivo, um lugar na árvore; menções diferentes apontam para o mesmo documento | Índice único; anexo do CRM, cartão do Time, aba do Painel e Arquivos abrem o mesmo | corrigido (antes cada tela tinha a sua lista e o Painel usava pastas próprias) |
| A visibilidade ao cliente vem da pasta, com exceção forçada por arquivo e registro de quem forçou | Visualizador (Gestor e Administrador) e o selo da pasta em Arquivos | ok |
| Conector antigo em somente leitura continua consultável | Arquivos do Drive antigo com selo e sem ações de mudança | ok |
| Registro de entrega: o "baixou" do cliente fica no arquivo | App do cliente grava; o visualizador do escritório mostra | ok |
| Documento abre na marca do escritório, nunca no provedor | Visualizador e app | ok |

## 7. BPO Financeiro (10)

| Regra | Onde | Situação |
| --- | --- | --- |
| Nenhum pagamento sem aprovação humana registrada; pagar e transferir nunca automáticos (B3) | Aprovações do BPO e cartão do app; no M1 o cliente libera no banco | ok |
| Quem digita não confere (3.8) | Aprovações: "Conferir" desligado para quem digitou | ok |
| Alçada por empresa e por pessoa; acima da faixa 2, duas pessoas (3.7) | Configuração do BPO (gaveta de alçadas, salva na ficha) e o cartão do app | ok |
| BPO só com o setor e o módulo ligado (2.5) | Lateral e Assinatura › Módulos extras | ok |
| Rentabilidade só Administrador (e Gestor com Gestão ou Financeiro); Gestor do BPO sem margem (5.4) | Abas por conta | ok |
| O mesmo registro em CRM, Time, Painel, app (5.6) | Tarefas do setor BPO na loja, integrante BPO no Time, aviso do app no sino | ok |
| Empresa só de BPO não recebe documentos nem áreas da contabilidade | Índice de Arquivos e áreas do app | ok |

## 7.1 Demonstração viva: o que conferir (8/11/2026)

- O contador de cartões pendentes, o selo "Precisa de você" e a faixa acima do campo contam só os cartões que aparecem naquela conversa. Antes eram números do cadastro: o BPO mostrava 2 cartões que não existiam no chat dele; agora mostra 0.
- A fila do integrante é o que ele está fazendo mais as tarefas do Painel com ele. Antes, "fila: 7" não batia com nada na tela.
- O aviso de decisão da Visão geral está ligado ao cartão do chat (`cartaoChat`): decidido em um, some do outro.
- As respostas jurídicas citam a LC 123/2006 com o texto cortado por reticências. Antes de mostrar a especialistas, vale um contador conferir a redação literal e a vigência de cada trecho.

## 8. O que ainda é limitação do wireframe

- O conteúdo detalhado das abas do Painel (blocos próprios de cada setor: guias, folha,
  conciliação, certificados) é o da Metalúrgica Andrade. Para os outros clientes, o cabeçalho
  (regime), as pendências (tarefas esperando o cliente), as tarefas, os documentos e as pessoas
  já são do cliente; os blocos específicos continuam com os números de exemplo.
- Equipe, Rentabilidade e Confirmações do Timesheet e os indicadores da Visão geral usam os
  números do escritório inteiro, iguais para quem pode vê-los.
- Ações em lote do Painel na visão da carteira registram e avisam, mas não geram um item por
  cliente.
- No app, "Já paguei" e os downloads registram o evento mas não mudam a guia no Painel.
- Mover e renomear arquivos, versões lado a lado e o mapeamento inicial do Drive antigo (Fundações 7.3) ainda não têm tela em Arquivos; a configuração continua em Armazenamento.
- No BPO, o espelho do ERP, as rotinas e a conciliação são de exemplo; o "Abrir no ERP" só avisa. Lote novo montado pela equipe ("Pôr no próximo lote") não gera um cartão novo no app.
- O estado da demonstração vive na memória da página: recarregar ou "Recomeçar a
  demonstração" volta ao começo do dia.
