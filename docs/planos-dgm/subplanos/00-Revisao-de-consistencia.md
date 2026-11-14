# Revisão de consistência · Desenho e subplanos 01 a 06

**7/11/2026.** Leitura do [Desenho do Sistema](../Desenho_do_Sistema.md) (v0.3) e dos subplanos 01 a 06, com as respostas e os adendos. Critério: a decisão mais recente vence; o que contradiz uma decisão registrada ou um texto mais novo do mesmo documento foi corrigido no lugar, sem mudar decisão nem acrescentar conteúdo. O que não é claro ficou listado para aval.

## 1. Correções feitas

| Arquivo | Seção | O que dizia | O que passou a dizer |
| --- | --- | --- | --- |
| Desenho | 3.2, Triagem automática | "cai na fila certa" | "vai para o setor certo" (decisão: sem filas) |
| Desenho | 4.4, Extensão de navegador | "Sem conteúdo de página." | A extensão pode ler a página só para identificar o cliente e envia apenas o identificador (05, 3.3) |
| Desenho | 5.1, Integrantes padrão | Lista de setores (Fiscal, DP, Contábil, Societário, Atendimento, Financeiro, Gestão) | Os oito setores com equipe de Fundações 4.1 (Societário, Fiscal, Notas, DP, Contábil, Consultoria, Gestão e Atendimento, Financeiro do escritório) |
| Desenho | 5.2, Operação pelo chat | Agente só faz sozinho se "o Administrador tenha liberado" | Se o Administrador não tirou a atividade da lista, que vem preenchida (01, 3.3) |
| Desenho | 7.1, Chat | "o resto cai na fila" | "o resto fica como conversa 'nova' no setor" |
| Desenho | 8, passo 2 | "manda para a fila do Fiscal" | "manda para o Fiscal (sem responsável)" |
| 01 | 2.2, Usuário | Campo `custo_hora` por usuário, "só Administrador lê" | `cargo_id` opcional; o custo-hora é do escritório, não da pessoa (adendo 16) |
| 01 | 2.3, Conta de cliente | `papel_cliente` com `funcionario`; "funcionário vê só o portal do funcionário" | Sem `funcionario`; frase removida (adendo 17; portal fora do escopo) |
| 01 | 4.1, Setor | `responsavel_padrao_id` opcional | Obrigatório para setor com equipe; a abertura preenche com o Administrador (adendo 13) |
| 01 | 4.6, Configuração local | `horas_padrao_cliente` "sobrescreve `horas_100`", sem dizer a origem | Calculada pelo timesheet, nunca informada (adendo 16; 05, 11.2) |
| 02 | 5.2, Tradução para a pessoa | `memoria.patch` | `memoria.corrigir` (nome do catálogo, 01 6.5 e 02 5.3) |
| 02 | 7.2, nota após a tabela | "pedido A8" | "pedido A7" (A7 é o de eventos; A8 é o de ferramentas) |
| 02 | 15.3, P7 | "Respondido: Consultor do cliente … Sessão do responsável" (resto da hipótese antiga) | "não roda como sessão do responsável" |
| 02 | 15.3, P10 | "Pendente (reformulada em 15.4)" | "Respondido: escreve e vale; o Administrador revisa depois" (decisão registrada) |
| 03 | 7.3, Iniciar e concluir | Frase truncada "A partir da abertura, a partir dele a tarefa fica…" | "A partir da abertura, a tarefa fica 'aberta por Fulano'…" |
| 03 | 10.3, horas | "horas: vira `horas_padrao_cliente`" | Calibra `horas_100` da atividade; a hora por cliente é calculada pelo timesheet |
| 04 | 3.1, regra 1 | "O Desenho chama isso de setor 'Geral'" | "Não existe setor 'Geral' (Desenho 3.1)" |
| 05 | 2 (fonte 3), 3.1, 3.5, 10.4 | "sem conteúdo", "não vê conteúdo", "nunca captura conteúdo de página" | Lê a página só para identificar o cliente e envia apenas o identificador (3.3); quatro trechos alinhados |
| 05 | 5.1, duração padrão | "quando o escritório ou a calibração definiu outro valor; cliente grande pode ter padrão próprio no perfil" | Só a calibração; não é informada nem fica no perfil (P4, 11.2) |
| 05 | 8.4, tabela, Fonte | "`custo_hora` por cargo" | "`custo_hora` do escritório, por cargo opcional" |
| 05 | 12.3, P2 | "Sim: só esse elemento, só nesses portais" (resto da hipótese antiga, contradiz "pode ler a página") | "só nos domínios da lista, com a regra visível na lista e no termo" |
| 05 | 12.3, P4 | "Sim, campo opcional por atividade, raro" (resto da hipótese antiga) | "não há campo no perfil" |
| 05 | 12.3, P5 | "Sim; … sem o termo aprovado" (contradiz "não passa por advogado") | "sem o termo aceito" |
| 05 | 12.3, P7 | "Sim (GES-055)" (sim ao custo por cargo) | Removido o "Sim" |
| 06 | 12.1, consentimentos | "portal do funcionário (opt-in do empregado, DP-019)" | Removido (2.6) |
| 06 | 12.3, Isolamento | "três casos … funcionário chama qualquer ferramenta fora do portal" | "dois casos"; caso do funcionário removido |

Total: 26 itens (30 trechos).

## 2. Divergências não corrigidas

| Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- |
| 02 | 3.2 | "Oito integrantes padrão mais o Consultor e o Geral", mas a tabela tem oito linhas já contando o Consultor (que ocupa o setor Consultoria) | Escrever "sete integrantes de setor, o Consultor (responde pelo setor Consultoria) e o Geral", ou definir integrante próprio de Consultoria |
| Desenho × 02, 01 | Desenho 5.1; 02 5.1; 01 9 | Desenho fala em "memória em dois níveis"; 02 e 01 têm três camadas (privada, escritório por setor, notas diárias) | Desenho citar as notas diárias como terceira camada operacional, ou 02 descrevê-las como parte da privada |
| 01 × 02, 06 | 01 9 (Integrante); 01 adendo 13; 02 10.1; 06 9 | `usuario_dono_id` é obrigatório, mas o Consultor da empresa tem como dono "a Conta de cliente" (pessoa × cliente). Não está dito se há um Consultor por cliente ou por conta, nem que entidade é o dono | Acrescentar `dono_tipo` (usuario, cliente) e `dono_id`; um Consultor por cliente; escopo calculado pela conta de quem pergunta |
| 04 × 01, 03 | 04 6.1 (Implantação); 01 4.9; 03 8.2 | 04 diz que fechar contrato cria o Cliente em `em_implantacao`; 01 diz `aceito` e 03 diz que a pré-entrada termina em `aceito` | Definir: `lead.fechar_contrato` cria em `aceito` e `cliente.mudar_estado(em_implantacao)` dispara a trilha, ou fechar contrato já leva a `em_implantacao` |
| 03 × 05 | 03 4.2, 6.9, 9.2; 05 8.1, 8.4, T8 | 03 põe rentabilidade e custo-hora na fase 3; 05 entrega a aba Rentabilidade (T8) sem fase. Quem vê: 05 8.1 "Gestor vê as quatro abas"; 05 8.4 "Gestor com o setor Gestão ou Financeiro"; 03 9.2 Gestor só "Equipe do setor" | Fixar a fase (depende de FIN-001 e de `custo_hora`) e uma regra única de quem vê Rentabilidade |
| 03 | 2.0, 2.2, 6.9 | Usuários, setores e exceções são editados em "Gestão" (2.2, 6.9) e também em "Configurações › Usuários e setores" (2.0) | Um lugar só; decidir com o esqueleto de design |
| 04 | 5.5 × 7.2 | Lead que não responde à triagem é perdido em 7 dias; régua "Lead sem resposta" marca perdido em D+14 | Dizer que 7 dias vale para quem nunca respondeu e 14 para quem já conversou, ou unificar |
| 05 × 01 | 05 A10; 01 adendo 16; 05 11.2 | `origem` da hora padrão: 05 lista `escritorio, calibracao, catalogo`; o adendo das Fundações aceitou só `calibração ou catálogo`; 05 11.2 diz que o Gestor pode corrigir | Manter uma origem `gestor` (correção) e alinhar o adendo |
| 01 × 03 | 01 3.5 (`tela:honorarios`); 03 A6 e 01 adendo 14 (`aba.fiscal.guias`) | Dois formatos de identificador de tela | Um formato só (`aba.*`) e trocar o exemplo de 3.5 |
| 05 × 01 | 05 1.2; 01 adendo 14 | 05 lista `tarefa.concluir_por_evidencia` como ferramenta; nas Fundações é evento | Ferramenta é `tarefa.concluir` com `criterio_conclusao`; o evento é `tarefa.concluir_por_evidencia` |
| 01 | 3.1, 6.1 | Ferramentas transversais têm setor `geral`; "Geral" também é o chat e não existe setor "Geral" | Renomear para `transversal` |
| 02 | 15.3 P5; 11.1 passo 5 | Observação de 14 dias para integrante criado pelo usuário continua "Pendente", mas 11.1 assume | Responder P5 |
| 05 | 12.1, T11 | T11 depende de "P2 decidida"; P2 já foi respondida (pode ler a página) | Tirar a condição; T11 passa a depender só de T4 |
| 03 | 2.1 | O wireframe antigo (navegação vertical com Home, abas, Financeiro, Gestão, Atendimento, Timesheet) ficou após a decisão 2.0; 2.0 avisa que vale só como conteúdo | Redesenhar quando o esqueleto do usuário chegar |

## 3. Lacunas (assumidas por um subplano, definidas por nenhum)

1. **Subplano de conectores.** 01 (1.1, 6.5) remete ferramentas de governo (transmitir, e-CAC) e de core a "subplanos dos conectores", que não existem na lista do Desenho 9. Dependem disso: conector de calendário Google/Microsoft (04 `reuniao.agendar`; 06 `agenda.*`; 05 GES-050), assinatura eletrônica externa (04 6.1; 06 5.5), agregador bancário (06 8), provedor de cobrança (06 8; 03 6.8).
2. **Catálogo `calculo.*` e motores.** `calculo.rbt12`, `fator_r`, `folha_12m`, `projetar_receita`, `retencao_iss`, multa e juros, `legal.diff_norma` são usados por 02, 03, 04 e 06; só existem como "`calculo.*` (ler)". Fica para o subplano 07, ainda não escrito.
3. **Catálogo de identificadores de tela** (03 A6, aceito no adendo 14 das Fundações): nenhum documento lista os identificadores nem a declaração "tela → ferramentas" que 01 6.2 exige.
4. **Origem dos gastos do `custo_hora`** em v1: "o Administrador informa os gastos ou o valor direto" (05 A7); não há tela nem campos para os gastos, e o Financeiro do escritório é fase 3.
5. **Saída e transferência entre escritórios** (06 12.6; 01 adendo 17): exportação completa, modo leitura de 90 dias e transferência com aceite dos dois lados não têm ferramenta, fluxo nem dono.
6. **Atividades internas** (reunião, treinamento, administrativo, deslocamento): aceitas no adendo 16, usadas em 01 5.4 e 05 5.2, sem IDs no catálogo.
7. **Dicionário para leigo** dos nomes exibidos no app (06 1.3): não está no Tema (01 10) nem em 06 11.
8. **Formulário do site** como canal (01 4.10; 04 3.1): ninguém define quem hospeda o formulário nem como ele chega ao CRM.

## 4. Resoluções das divergências abertas (sessão-mãe, 7/11/2026)

| Divergência | Resolução |
| --- | --- |
| Contagem de integrantes padrão (02 3.2) | Corrigido no texto: sete integrantes de setor, mais o Consultor (responde pelo setor Consultoria) e o Geral |
| Memória em dois ou três níveis | Valem as três camadas do 02 e do 01 (privada, escritório por setor, notas diárias); o Desenho 5.1 fala em "dois níveis" no sentido de propriedade (do usuário e do escritório); as notas diárias são a camada operacional |
| Dono do Consultor da empresa | Integrante ganha `dono_tipo` (`usuario` ou `conta_cliente`) e `dono_id`; há **um Consultor por empresa cliente**, não por pessoa; as pessoas da conta conversam com o mesmo, cada uma dentro das próprias `areas` |
| Estado do cliente ao fechar contrato | `lead.fechar_contrato` cria o Cliente em `aceito`; a trilha de implantação, ao criar a primeira tarefa, muda para `em_implantacao`; o 04 passa a dizer isso |
| Rentabilidade: fase e visibilidade | Aba Rentabilidade é **fase 3** (depende de honorário em FIN-001 e do custo-hora do escritório); até lá o item Timesheet mostra as outras três abas. Vê: Administrador e Gestor com o setor Gestão ou Financeiro |
| Onde se editam usuários e setores | Hipótese até o esqueleto de design: em **Configurações** (só Administrador); Gestão mostra equipe, permissões e relatórios em leitura |
| Lead sem resposta: 7 ou 14 dias | 7 dias para quem nunca respondeu à triagem; 14 dias (régua) para quem já conversou |
| `origem` da hora padrão | `calibracao`, `catalogo` ou `gestor` (correção manual registrada); o adendo 16 das Fundações passa a incluir `gestor` |
| Formato do identificador de tela | Um só: `aba.<modulo>.<tela>`; exemplo de 01 3.5 corrigido para `aba.financeiro.honorarios` |
| `tarefa.concluir_por_evidencia` | É **evento**; a ferramenta é `tarefa.concluir` com `criterio_conclusao`; o 05 1.2 deve ler assim |
| Setor `geral` nas ferramentas transversais | Renomear para `transversal` quando o catálogo for formalizado; "Geral" fica só para o chat |
| P5 do 02 | Já respondida pelo usuário (segue a hipótese); tabela corrigida |
| T11 do 05 depende de "P2 decidida" | Corrigido: depende só de T4 |
| Wireframe antigo do 03 2.1 | Fica como conteúdo até o esqueleto de design do usuário; 2.0 manda |

## 5. Lacunas: encaminhamento

| Lacuna | Encaminhamento |
| --- | --- |
| Subplano de **conectores** (governo, cores, calendário, assinatura, cobrança, nuvens) não existe, mas 01, 04, 05 e 06 dependem dele | Propor **subplano 08 · Conectores**, com o perfil de captura por UF e documento (plano, seção 2), os conectores dos cores (05, seção 4), nuvens (01, seção 7), agenda, cobrança e assinatura |
| Catálogo `calculo.*`, `legal.consultar` e os motores usados em quatro subplanos e definidos em nenhum | É o **subplano 07 · Consultor e motores** previsto no Desenho (seção 9): cascata legal, motor de cálculo com tabelas versionadas, roteador da etapa 0, verificação de origem |
| Catálogo de identificadores de tela aceito no adendo 14 das Fundações, nunca listado | Produzido na etapa P4/P5 do Painel, junto com os wireframes em texto, quando o esqueleto de design chegar |

## 6. Segunda revisão (7/11/2026): subplanos 07 e 08

Leitura de 07 e 08 inteiros, dos adendos de 01 a 06 e das seções que eles alteram, contra as decisões recentes (captura sem o cliente configurar nada, ciência, Open Finance, custos em estudo de precificação, motores). Mesmo critério da primeira revisão: só contradição clara foi corrigida, sem mudar decisão nem acrescentar conteúdo.

### 6.1 Correções feitas

| Arquivo | Seção | De | Para |
| --- | --- | --- | --- |
| 08 | 5.5, ordem de captura | "(2) e-mail e agente de pasta do emissor; (3) A1; (4) upload" | "(2) portais municipais pelo conector e fornecedor de captura (nível B); (3) A1; (4) upload e e-mail de XML (complemento)" (13.4: sem agente de pasta) |
| 08 | 7.2, uso 2 | Caixa de XML como caminho comum | "complemento opcional (13.4)" |
| 08 | 12.2, A7 | `origem` ganha `email_xml` e `agente_pasta` | `email_xml` (complemento opcional; sem `agente_pasta`), como no adendo 19 das Fundações |
| 08 | 12.3, P11 (hipótese) | "v1 só com a caixa de e-mail de XML; agente na fase 2" | "sem agente de pasta; e-mail de XML só como complemento" |
| 08 | 7.3, tabela (Pluggy, Belvo) | Fase 4 | Fase 3 (13.3) |
| 08 | 9.5, extrato | "Fase 4 … serviço extra com custo repassado" | "Fase 3 … cobrado do escritório à parte (13.3)" |
| 08 | 10.2, linha Open Finance | "fase 4" | "fase 3" |
| 08 | 12.1, C16 | "Fase 4, contrato" | "Fase 3, contrato" |
| 08 | 10.3, linha Open Finance | "Serviço extra com repasse ao cliente final (06 8) ou rateio" | "Cobrado do escritório à parte (13.3)" |
| 08 | 10.3, linha Integra e InfoSimples | "Repassado por consumo, por cliente, na fatura do escritório" | "Entram na precificação do módulo (13.2), sem repasse avulso; consumo por cliente visível em Gestão" |
| 08 | 12.3, P6 (hipótese) | "Sim, como em 10.3; WhatsApp embutido até um teto por número" (após "não em repasse avulso") | Cauda removida |
| 08 | 2.4, Gestão › custo por cliente | "base do repasse (seção 10)" | "base da precificação (13.2)" |
| 08 | 12.1, C4 | "repasse por cliente" | "custo por cliente" |
| 07 | 12.3, P6 (hipótese) | "Só com opt-in, anonimização por regra…" (após "sem opt-in do escritório") | "Anonimização por regra e revisão por contador do grupo" |
| 02 | 4.4 (roteador, tabela M1) | `data_fato`; `legal.consultar(pergunta, data_fato, perfil)` | `data_de_referencia`; contrato do 07, 3.2 (adendo 19 do 02) |
| 02 | 10.2, assinatura, esquema de retorno e "Vigência" | `legal.consultar(pergunta, data_fato, perfil?, uf?, municipio?)` e retorno antigo, que o adendo 19 manda substituir | Assinatura e campos do 07, 3.2 (`data_de_referencia`, `perfil_do_cliente`, `escopo`, `afirmacoes[]` com `trecho_id`, `grau_confianca`, `versao_base`…) |
| 02 | 11.1, passo 2 | `calculo.retencao_iss` | `calculo.retencoes_nota` (nome do catálogo, 07 5.4 nº 14) |
| 06 | 9, regra 2 | "`calculo.*` em leitura são factuais" | Só `calculo.multa_juros`, `rbt12`, `sublimite` e `mei_limite` (07, 8.2; adendo 15 do 06) |
| 06 | 8, Conciliação simplificada | Fase 4 | Fase 3 (08, 13.3) |

Total: 19 itens (22 trechos).

### 6.2 Divergências não corrigidas

| Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- |
| 08 × 02 | 08 12.2 A8; 02 7.2 (gatilho 15) e adendo 20 | `consentimento.vencer` e `certificado.vencer_em_30_dias` acordam o Societário (08 A8, 02 gatilho 15) ou o Atendimento (adendo 20 do 02) | Societário abre SOC-009 e o Atendimento pede ao cliente pelo app; escrever as duas etapas, ou escolher um |
| 08 | 5.2 item 1 × 13.1 | 13.1 diz "listar nunca dá ciência"; 5.2 ainda trata como pergunta aberta à InfoSimples se `dte.listar` estadual dá ciência, com aprovação do Gestor na primeira semana | Manter a cautela só para os DTEs estaduais pelo agregador (a regra de 13.1 foi confirmada para o e-CAC) e dizer isso em 13.1 |
| 01 × 07 | 01 adendo 18; 07 12.2 A5 | Eventos: 01 lista `plano.executar`; 07 lista `plano.retomar`, `plano.desfazer`, `tabela.aprovar`, `roteador.*` completos | Alinhar a lista do adendo 18 com a de A5 |
| 01 × 08 | 01 adendo 19; 08 12.2 A3 | 01 não recebeu `ciencia.registrar`, `webhook.receber`, `pagamento.receber`, `assinatura.concluir`, `core.documento.receber`, `core.envio.*`, `robo.*` | Completar o adendo 19 |
| 02 × 07 | 02 14.2; 07 9.1 | 02 fala em três tipos de caso (mais o roteador); 07 tem seis (acrescenta Cálculo e Modo cliente) | 02 14.2 citar os seis tipos do 07 |
| 02 × 07 | 02 14.2; 07 9.4, R-M8 | DGM edita "roteador, programas, planejador, regra de silêncio, resumo" (02); 07 9.4 inclui a **verificação** na área editável, mas a verificação é a camada que impõe R-M1 a R-M3 | Tirar a verificação da área editável, ou limitar a DGM ao que classifica frases, sem tocar as regras de origem |
| 03 × 08 | 03 6.3 (NFE-504, em "S"); 08 4.3 e 8.3 | 03 apoia a configuração de XML-semente (NFE-504); 08 a coloca fora da v1 (robô C-cert na fila) | Marcar NFE-504 como "depois" em 03 6.3 |
| 05 × 07 | 05 (calibração, linha 522) | "Agregado anonimizado entre escritórios (opt-in do Administrador)"; a decisão de melhoria contínua do 07 é sem opt-in | Dizer se a regra "sem opt-in" vale também para o agregado do catálogo de atividades |
| 08 | 10.3, linha WhatsApp; 7.7 | "excedente repassado" depois do teto por número contraria "sem repasse avulso" (13.2) | Deixar o excedente para o estudo de precificação |
| 08 | 9.3 × 12.2 A4 | Ferramentas `das.emitir` e `darf.emitir` (9.3) contra a família `integra.*` (A4) | Um formato só (`integra.das_emitir`…) quando o catálogo for formalizado |
| 06 | 8, Conciliação simplificada | "Custo do agregador repassado" ao cliente; 08 13.3 diz "cobrado do escritório à parte" (o escritório pode repassar, mas não está dito) | Dizer que o escritório decide se repassa ao cliente |

### 6.3 Lacunas restantes

1. **Estudo de precificação por módulo** (08 13.2; Desenho 9): documento a fazer; é a entrada de todos os custos de conector, de modelo e de infraestrutura.
2. **Catálogo de identificadores de tela** (lacuna 3 da primeira revisão): continua sem dono, agora também para a tela Configurações › Conectores.
3. **Lacunas 4 a 8 da primeira revisão** (gastos do `custo_hora`, saída e transferência entre escritórios, atividades internas, dicionário para leigo, formulário do site): nem 07 nem 08 as tratam.
4. **Planos fora desta revisão** (Plano da Plataforma, Plano do Assistente, pesquisas): podem ainda dizer Open Finance na fase 4 ou agente de pasta; não foram lidos nesta passada.
5. **Pendências externas declaradas como [a confirmar]**: contrato-padrão do SERPRO (modelo A ou B), procuração do ADN (PoC), licença da Calculadora da RFB, parecer jurídico por portal para qualquer robô, resposta da InfoSimples sobre ciência na listagem de DTE.
6. **Numeração**: 07 e 08 usam "C1 a C18" para etapas, e 08 usa "C1 a C10" para as regras da seção 1.2; citar sempre "etapa" ou "regra" ao referenciar.

### 6.4 Resoluções das divergências abertas (sessão-mãe, 7/11/2026)

| Divergência | Resolução |
| --- | --- |
| Gatilho de certificado e consentimento (Societário ou Atendimento) | Duas etapas: o Societário abre a tarefa (SOC-009), o Atendimento pede a renovação ao cliente pelo app; texto do 02 corrigido |
| `dte.listar` estadual e ciência | "Listar nunca dá ciência" vale confirmado para o e-CAC; para DTEs estaduais pelo agregador a cautela continua até a resposta da InfoSimples; 08 5.2 diz isso |
| Eventos dos adendos 18 e 19 do 01 | Complemento acrescentado ao fim do 01 com os eventos que faltavam |
| Três ou seis tipos de caso no benchmark | Seis (07, 9.1); 02 14.2 e T11 corrigidos |
| DGM editar a verificação | **Não edita**: a verificação impõe R-M1 a R-M3; o 07 9.4 passa a dizer isso |
| NFE-504 no 03 | Marcada "depois" (robô C-cert na fila futura) |
| Agregado do catálogo com opt-in (05) | Sem opt-in, pela regra da melhoria contínua; 05 corrigido |
| Excedente do WhatsApp repassado (08 10.3) | Fica para o estudo de precificação por módulo |
| `das.emitir` e `darf.emitir` × família `integra.*` | Um formato só (`integra.das_emitir`, `integra.darf_emitir`) quando o catálogo de ferramentas for formalizado; os nomes soltos do 08 9.3 valem como apelido até lá |
| Custo do agregador repassado ao cliente (06) | Cobrado do escritório; o escritório decide se repassa; 06 corrigido |

## 7. Revisão do subplano 09 (7/11/2026)

Leitura do 09 inteiro contra os adendos de 01 a 07, 08 (7.4 e 13.7) e as respostas "Respondido". Critério das revisões anteriores: só contradição clara foi corrigida, sem mudar decisão.

### 7.1 Correções feitas

| Arquivo | Seção | De | Para |
| --- | --- | --- | --- |
| 09 | 2, linha Boleto, Pix | "Asaas primeiro, Efí depois (08 7.4)" | Banco do escritório (API Pix, boleto por API ou CNAB), Asaas e Efí como alternativa, agregador como segundo caminho |
| 09 | 2, linha Conciliação | "Open Finance depois" | Fase 3b, cobrado à parte |
| 09 | 12, ordem de grandeza | Tarifa "entre R$ 159 e R$ 215" | R$ 79 (promocional) a R$ 159; no banco do escritório, a do convênio |
| 09 | 3.1, Despesa adiantada; 4.6 | "Separada do honorário na cobrança"; "linha separada do honorário" | Vira cobrança avulsa, combinável ao honorário ao faturar ou à parte; política de nota configurável por escritório e município |
| 09 | 4.4 | `calcular_13o_proporcional` | `calculo.proporcional_13o` (07, adendo 14; 09 A14) |
| 09 | 5.2 | Dias da régua "por escritório" | Gerais do escritório e ajustáveis por cliente |
| 09 | 3.1, 7.4, 10.5, 11, 13.1 (FN3) | Orçamento, remuneração e sócios "fase 4" | Montados e desligados desde a v1; ligam na fase 4 (13.5) |
| 09 | 10.6, Colaborador | "Exceção por tela" | Adição nas configurações da conta do usuário (exceção por tela) |
| 09 | 13.3 P1, P3, P6, P8 | Remissões "5.4", "5.5", "4.5", "12"; "Não: recibo separado" | 4.5 e 8.2; 5.2 e 5.6; 4.6 e 13.5; 12.1; recibo separado fica como padrão até o contador decidir |
| 09 | 13.4 P2, P6, P9 | P2: "vale a mesma regra do P1 (automático depois)"; P6 e P9 só com a hipótese antiga | P2: reajuste é sempre cartão; P6 e P9 ganham a resposta de 13.5 |
| 01 | 3.5, exemplo de exceção | `aba.financeiro.honorarios` | `aba.financeiro.contratos` (09 10.1) |
| 03 | 6.8 | `tela:honorarios`; "Editar (versiona o perfil)" | `aba.financeiro.contratos`; edição por aditivo, `honorario` do perfil vira resumo derivado |
| 03 | 9.2, linha Financeiro | Gestor "lê e edita contratos"; Colaborador "só por exceção (ler)" | Tabela do 09 10.6; Colaborador por adição na conta, Resultado e remuneração nunca |
| 04 | 7.2, régua Honorários | "D-5; D0; D+3; D+10; D+20"; parada só por baixa | Mais D+30 aviso formal e D+45 pausa parcial (configuráveis); parada também por `cobranca.pagamento.informado` |
| 08 | 10.3, custo mensal | Cobrança Asaas 100 clientes "R$ 215 (R$ 108 nos 3 primeiros meses)" | Gateway: R$ 159 (R$ 79 promocional); banco do escritório: tarifa do convênio |
| 08 | 12.1, C15 | "`cobranca.*` Asaas" | Banco do escritório (13.7), Asaas e Efí como alternativa |

Total: 16 itens (27 trechos).

### 7.2 Divergências abertas

| Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- |
| 09 × 04 × 02 | 09 5.2 e 8.1 (GES-004); 04 7.2 (régua) | 09 diz que o integrante do Financeiro manda D-5 a D+3; 04 diz que a régua `conversa.cobrar_pendencias` é executada pelo integrante de Atendimento (gatilho 11 do 02) | Dizer quem executa: Financeiro decide e prepara, Atendimento envia pelo fio da pessoa, ou o contrário |
| 09 | 8.1 × 10.6 | "Só serve a Administrador e Gestor", mas o auxiliar Colaborador pode operar cobranças e conciliação | Dizer que o integrante serve também o Colaborador com a adição, dentro do escopo dele (H6) |
| 09 | 11 (3b) × 8.1 e 13.2 A9 | 11 põe "integrante do Financeiro ligado" na 3b; 8.1, A8, A9 e o adendo 21 do 02 dizem "liga na fase 3"; a 3a já tem lote e régua preparados por ele | Ligar na 3a em modo pseudomanual (cartão em lote), ou dizer na 3a quem prepara o lote |
| 09 | 8.2 × decisão P1 | Promoção por critério (30 cartões, 95% sem edição, 90 dias) e só com valor igual ao contrato; decisão é "automática depois que o usuário confirmar" | Dizer que a pergunta ao Administrador é a confirmação do usuário e que o critério é o gatilho dela |
| 09 × 01 | 3.1 (Cobrança, `provedor_id`); 01 6.5 (`honorario.listar`, `honorario.alterar`) | `provedor_id` não cobre o banco do escritório com CNAB; `honorario.*` do 01 ficou sem equivalente em `contrato.*` | Chamar de `conexao_cobranca_id` (banco ou gateway); trocar `honorario.*` por `contrato.*` no 01 |
| 05 | 8.4, A7 (linha 576) | Texto antigo: "o Administrador informa os gastos ou o valor direto" | Manter como regra de v1; a partir da 3b o custo-hora é proposto pelo Financeiro (adendo 15), dizer isso na A7 |
| 03 | 6.8, P5 (linha 784) | "v1 só contratos e honorários", sem as telas desligadas de orçamento, remuneração e sócios | Citar o adendo 18 (e 09 13.5) na P5 |
| 09 | 5.3 × 8.5 | Sem fonte de confirmação, a régua só volta com decisão da pessoa; o exemplo da Empresa X retoma a régua porque o extrato não mostra crédito | Esclarecer que "sem fonte" (nenhuma consultada) difere de "fonte consultada sem crédito" |
| 09 | 5.5, 4.6 | Reembolso na base da NFS-e e retenções IRRF e CSRF `[a confirmar]` | Parecer do contador do grupo, por município |

### 7.3 Lacunas

1. **Tabela de bancos suportados** (08 13.7): os formatos de autenticação, a tarifa informada pelo escritório e a situação de cada banco não existem como dado; o 09 3.1 também não tem entidade para a conexão de cobrança.
2. **Estudo de precificação modular**: recebe agora os custos do Open Finance (rateio R$ 25 por cliente), do gateway (R$ 79 a 159 por 100 clientes), da assinatura avançada e do WhatsApp excedente; continua a fazer.
3. **Critério de ativação** do orçamento, comissões e sócios ("6 meses de fechamentos", 13.5): é exemplo, falta fixar o número e quem liga (Administrador).
4. **Regras da política de nota por município** para despesa adiantada: o padrão existe (recibo separado), mas ninguém monta a tabela por município.
5. **Lacuna 4 da primeira revisão** (gastos do `custo_hora` em v1): segue só no 05 A7; o 09 resolve a partir da fase 3b.
6. **Lei 10.101/2000 (PLR)** e NBC PG 01 (R6): continuam `[a confirmar]`.

### 7.4 Resoluções das divergências abertas (sessão-mãe, 7/11/2026)

| Divergência | Resolução |
| --- | --- |
| Régua: Financeiro ou Atendimento | O Financeiro decide e prepara; o Atendimento envia pelo fio da pessoa (09, 13.6) |
| Integrante serve só Administrador e Gestor | Serve também o Colaborador com a adição de acesso, dentro do escopo (09, 13.6) |
| Fase de ligação do integrante (3a ou 3b) | Liga na 3a em modo pseudomanual (cartão em lote); ganha conciliação e automático na 3b |
| Promoção por critério × "automático depois da confirmação" | A pergunta ao Administrador é a confirmação; o critério é o gatilho dela |
| `provedor_id` e `honorario.*` | `conexao_cobranca_id` no 09; `contrato.listar` e `contrato.alterar` no 01 |
| Custo-hora informado pelo Administrador (05 A7) | Na v1 sim; a partir da 3b proposto pelo Financeiro; 05 corrigido |
| 03 P5 sem as telas desligadas | Citado o adendo 18; 03 corrigido |
| "Sem fonte" × "fonte sem crédito" | Esclarecido no 09, 13.6 |
| Reembolso na base da NFS-e e retenções | Continua [a confirmar], parecer do contador do grupo por município |

## 8. Revisão geral (8/11/2026): incorporação do UI lab e do subplano 10

Leitura do Desenho, do Plano da Plataforma (DA-01, DA-02, DA-02.1), dos dez subplanos e do estudo de precificação, depois de três entradas: as decisões do usuário no UI lab (7/11/2026, `ui-lab/PLANO.md` e `REVISAO.md`), o subplano 10 (BPO) e os ajustes de 07, 08 e 09. Mesmo critério das passadas anteriores: só contradição clara com uma decisão listada ou com texto mais recente do mesmo documento foi corrigida no lugar; o que não é claro ficou listado.

**O que entrou.** UI lab: as 19 linhas de "O que muda nos subplanos" mais a decisão de inatividade, em adendos "Adendo: decisões do UI lab (8/11/2026)" em 01 (22), 02 (22), 03 (20), 04 (18), 05 (16), 06 (18) e 09 (14), mais dez itens da REVISAO.md que mudam regra (contatos com assuntos, responsáveis por setor, Minha conta, gaveta de histórico, gaveta de relatório, nova tarefa à mão, documento na marca do escritório, link do Time que abre conversa citada, ficha da tarefa, saída). Subplano 10: os ajustes A1 a A21 (11.2) como adendos "ajustes recebidos do subplano 10" em 01 (23), 02 (23), 03 (21), 04 (19), 05 (17), 06 (19), 07 (15), 08 (15), 09 (15) e no Estudo; **A14** já estava feito na v0.6 (falta a seleção "produto" no configurador) e **A15** não foi aplicado (edita `atividades.json` e B10, fora desta passada; ver 8.3). **A0** não existe na tabela 11.2 (começa em A1). Ajustes antigos que estavam sem adendo e foram aplicados: 05 A12 em 02 (adendo 24), 05 A13 em 03 (adendo 22), 05 A14 em 04 (adendo 20) e 09 A15, parte, em 08 (adendo 14). Os demais pedidos de 02 a 09 conferidos já tinham adendo.

### 8.1 Correções feitas

| Arquivo | Seção | De | Para |
| --- | --- | --- | --- |
| 01 | 2.2, `inatividade_min` | "Minutos até desligar a sessão" | Minutos até o **modo de espera**, só nas telas que registram tempo; não desloga |
| 01 | 2.5, tabela e regras 1 a 3 | Sessão "bloqueada", tela "pede nova autenticação", `bloqueada_em`, "cada uma desliga sozinha" | **Modo de espera**, sem logout e sem senha; vale só no Painel com cliente aberto e no CRM (menos Números); "Continuar" abre sessão nova; `em_espera_desde`; Início, Painel na carteira, Timesheet, Financeiro e Configurações não entram em espera |
| 01 | 5.4, regras 1 a 3 | Fim por "bloqueio por inatividade"; qualquer evento com cliente abre sessão "sem tarefa" | Fim por entrada em espera (no último evento); sessão "sem tarefa" só em tela que registra tempo; no Início conta só a IA |
| 01 | 11, teste "Inatividade"; adendo 14 | "Autenticação bloqueada"; evento `sessao.bloquear` | "Espera, sem nova autenticação"; `sessao.espera` (também em 03, 12 e A3) |
| 01 | 2.1, 2.2 (Subinquilino), 2.5, 3 (teste), 11 | Subinquilino com "Assinatura própria"; `visivel_para_mae`; `subinquilino_id` "nunca muda" | Sem assinatura própria (o BPO assina); `escopo_mae` (só os departamentos contratados); contexto muda por `sessao.trocar_contexto` (10 4.1, A1 e A6) |
| 01 | 4.1, código do setor | `bpo` listado como setor "de perfil" (sem equipe) | `bpo` e `bpo_financeiro` têm equipe (10, A2) |
| Desenho | 4.4 e 10 (linha 12) | "O sistema inteiro se desliga", tela bloqueada, nova autenticação | Modo de espera, sem logout, só onde o tempo é registrado sozinho |
| Desenho | 10, linha 14 (Chat inicial) | "Integrantes em ícones à direita" | Geral na aba Assistente; integrantes na aba Time, lista à esquerda |
| Desenho | 1.9, 2.1, 2.2 | Tokens "primária, fundo, texto, destaque, erro"; seletor de cliente global sem exceção; Home sem aba | Cor de estado separada do destaque; seletor some em CRM, Financeiro e Configurações; Home é a aba Visão geral do Início |
| Desenho | 1.1 (regras 1 e 7, tupla) | Assinatura "define os módulos"; mãe vê subinquilino "se o contrato permitir"; tupla sem titular | Pacotes de área e módulos; subinquilino sem assinatura e `escopo_mae`; titular na tupla (DA-02.1) |
| Desenho | 9 | "Os oito subplanos"; estudo de precificação "a fazer" | Dez subplanos; o estudo existe (v0.6) |
| 03 | 1.3 H5, 1.2, 7.3 | Inatividade "bloqueia e pede autenticação" | Modo de espera, sem senha, só onde conta tempo |
| 03 | 2.0 | Aguardava o esqueleto do usuário; Início sem abas; CRM "Configuração dos números"; cliente selecionado global | Esqueleto confirmado (barra expansível, abas centralizadas); Início com Assistente, Time e Visão geral; aba Números; seletor some em CRM, Financeiro e Configurações; Financeiro "pendente de decisão" |
| 03 | 2.2, 3.2, 3.5, 4, 4.3, 6.8, 6.10 | Conta "bloquear"; seletor sempre; BPO "setor de perfil"; Home sem widgets; "visão do cliente" é o seletor | Minha conta; seletor com exceções; BPO é pacote e modo; Home em widgets (arranjo por tela, cliente e carteira); filtro por cliente na lista de Conversas |
| 03, 09 | 03 2.2 e 9.3; 09 R9 e 8.x | `visivel_para_mae` | `escopo_mae`; troca de contexto sem novo login |
| 02 | 3.1 | Setores de perfil (incluindo BPO) "não têm integrante próprio" | O BPO é exceção: `bpo_financeiro` e `bpo` com dois integrantes |
| 02 | 9.1, 9.2 | Geral na gaveta; integrantes em ícones à direita | Aba Assistente; aba Time com lista à esquerda |
| 04 | 3.2, 4.1, 4.2, 5.4, 7.1 | "Configuração dos números"; lista filtrada pelo cliente do topo; dois botões Responder e Nota; assuntos sem dizer onde se editam; "segmento" | Aba Números; filtro por cliente na lista; campo que alterna; lateral em gaveta abaixo de 1.536 px; assuntos na ficha do cliente; destinatários (todos, segmento ou a dedo) |
| 05 | H3, 3.4, 3.7, 6, 11.1, P1 | "Desliga", "bloqueio" | Modo de espera; "esperas por hora" |
| 09 | 1.1 (não entrega), 2, 11, 12.1, 13.1 (FN15) | BPO financeiro "FIN-201, fase 5" | Fase 3c (10 11.3); nova linha 3c na tabela de fases; cobrança dos clientes do cliente fica na 5 (B13) |
| 09 | 8.1 | Integrante "só serve a Administrador e Gestor"; "liga na fase 3" | Serve também o Colaborador com a adição; liga na 3a em modo pseudomanual (13.6) |
| 09 | 10.1 | Cabeçalho "cliente selecionado (ou Todos)"; sete abas sem ressalva | Filtro por cliente (decisão 24); sete abas **pendente de decisão** (adendo 14; **decidido em 8/11/2026: sete abas**, ver seção 9) |
| Plano | DA-02, tabela de camadas | CRM, Timesheet, App e Financeiro na "Plataforma (núcleo, obrigatória)"; BPO como "módulo extra" | Novo quadro "Módulos da plataforma (opcionais)" com CRM, Timesheet, App, Financeiro, Open Finance e marca branca (10, P6 e 9.1); o BPO financeiro é pacote (DA-02.1) |
| Estudo | 6.2 e regras de proteção, 6.4 | "Painel (obrigatório)", "Painel obrigatório" | O pacote de área obrigatório (hoje o Painel contábil; DA-02) e dependências só as técnicas |
| Estudo | 2.2, linha Modo BPO | "fora dos pacotes" | "Fora dos atalhos Essencial, Operação e Completo; modo da plataforma" (evita confundir com pacote de área) |
| Estudo | 10.4, caso 3 | "P9, hipótese" | "P9, respondida" |
| README | Pesquisas; Planos | "420 atividades"; revisão "dos seis subplanos (07 e 08)" | 589 atividades; revisão em quatro passadas; linha da branch `claude/ui-lab` |

Total: 27 linhas (cerca de 60 trechos, em 10 arquivos).

### 8.2 Divergências abertas

| Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- |
| 03 × 09 × UI lab | 03 2.0 e 6.8; 09 10.1 | Financeiro: sete abas (09, adendo 18 do 03) contra quatro no wireframe; onde ficaram contas a pagar, conciliação e Visão geral depende da resposta do UI lab | Decidir A (sete) ou B (quatro, com contas a pagar e conciliação dentro de Cobrança e Caixa); depois ajustar `aba.financeiro.*` e 09 10.6 (pendência U1) **[Resolvida em 8/11/2026: ver a seção 9]** |
| 10 × UI lab × DA-02.1 | 10 2.5 e A10; Plano DA-02.1 item 9; 03 6.1; PLANO do UI lab | O 10 põe o item **Clientes** no núcleo e divide "Clientes e Societário"; a barra do UI lab não tem Clientes e tem um módulo **Arquivos** fora da lista | Decidir onde ficam ficha do cliente, legalização (SOC-025 a 043) e Arquivos; atualizar DA-02.1 item 9 e 03 6.1 (pendência U4) **[Resolvida em 8/11/2026: ver a seção 9]** |
| 10 | 2.2 × 5.1 (e DA-02.1 item 9) | 2.2 lista o item BPO antes de CRM; 5.1 diz "entre Financeiro e Configurações"; DA-02.1 põe os itens de pacote logo após o Início | Uma ordem só; sugestão: Início, Clientes, Painel, BPO, CRM, Timesheet, Financeiro, Configurações **[Resolvida em 8/11/2026: ver a seção 9]** |
| 01 × 10 × Desenho | 01 adendo 21 e 22; 10 A2 | O adendo 21 chama o campo do Setor de `pacote_area`; o 10 pede `pacote_id` | Usar `pacote_id` em todo lugar (a assinatura segue com `pacotes_area`) **[Resolvida em 8/11/2026: ver a seção 9]** |
| 09 × 10 | 09 3.1 e 5 (`pagamento.receber`, `pagamento.baixar`); 10 3.11 (`pagamento.liberar`, `executar_api`, `estornar`) | Mesmo prefixo `pagamento.*` para recebimento (09) e para pagamento de saída (10); também `cobranca_cliente.emitir` (10) × `cobranca.criar` (09) | Separar nomes ao formalizar o catálogo: `recebimento.*` ou `pagamento_recebido.*` no 09, ou `pagamento_saida.*` no 10 **[Resolvida em 8/11/2026: ver a seção 9]** |
| 10 × 08 × 09 × 06 | 10 3.1 e 3.10 × 11.1 (B13); 08 7.4; 09 11; 06 8 | A cobrança dos clientes do cliente é rotina diária do BPO financeiro (3.1) e parte de FIN-201, mas B13 fica fora da ordem de construção do B e do C1 (e 08, 06, 09 a põem na fase 5) | Dizer se a cobrança dos clientes do cliente entra no B ou fica depois; alinhar 3.1 e as fases **[Resolvida em 8/11/2026: ver a seção 9]** |
| `atividades.json`, B10 | FIN-201, BPO-017 (fase 5), BPO-019, BPO-020 (fase 2) | O 10 (11.3) antecipa FIN-201 para a 3c e BPO-017; o JSON e o B10 ainda trazem as fases antigas (pedido A15) | Editar o JSON e o B10 numa sessão que tenha esses arquivos; o mapa HTML lê o JSON **[Resolvida em 8/11/2026: ver a seção 9]** |
| Plano da Plataforma × subplanos | Plano 7 (fases 0a a 6) | O Plano tem numeração própria (fase 2 com cobrança Asaas; fase 4 Timesheet; fase 5 Consultoria; "BPO fase 5" em DA-01); os subplanos usam as fases do catálogo (3a, 3b e 3c) | Acrescentar ao Plano uma tabela de correspondência entre as duas numerações |
| Estudo e `parametros.json` × 10, DA-02 | Estudo 2.2 e 6.2; `modo_bpo.exige = painel`; configurador | "Exige Painel" em CRM, Timesheet, App, Financeiro e modo BPO; o 10 diz núcleo mais um pacote de área, e o modo BPO exige um pacote com setor executado; falta a seleção "produto" (A14) | Trocar "Painel" por "núcleo e pacote de área" nas tabelas e no JSON; implementar a seleção "produto" no configurador **[Parcial em 8/11/2026: "Exige" corrigido para "pacote de área"; falta a seleção "produto" no configurador; ver a seção 9]** |
| Estudo × 10 | Estudo 6.4 (Modo BPO) | "Tema, domínio e app de cada subescritório" por R$ 120, anterior à P5 e à P10 (portal de convidado, PWA primeiro, app com marca na loja cobrado à parte) | Reescrever a linha do Modo BPO com o portal de convidado e o app como opção |
| UI lab × 09 | `REVISAO.md`, seção 1 | O wireframe chama a exceção do João de `aba.financeiro.honorarios`; o identificador do plano é `aba.financeiro.contratos` (revisão 7) | Corrigir no UI lab |
| 03 (U3) | 2.4, 5 | "Tarefas deste setor" é bloco fixo em toda aba; com widgets o usuário pode escondê-lo | Decidir se é widget obrigatório ou escondível |
| 05 (U5) | 8.1 | Ordem das abas: Meu tempo · Equipe · Rentabilidade · Confirmações (05) contra Meu tempo · Confirmações · Equipe · Rentabilidade (UI lab) | Escolher uma ordem |
| 01 × UI lab | 5.4 regra 1 | O UI lab diz que no Início só conta a IA, e Financeiro e Configurações não contam; tarefa aberta nessas telas continua contando (corrigido assim na 5.4), mas o 09 e o 05 não dizem como o tempo de operar o Financeiro é registrado quando não há tarefa | Dizer se operar cobrança e conciliação conta por tarefa (FIN) ou por evento; ver 05 5.1 |
| 10 | 3.15 e 3.15.1 | O texto "Luana" ficou depois da resposta de P11 (é a Sofia) | Apagar a leitura da categoria ou mover para S5 |
| 04, 03 | 04 13.2 A13; 03 adendo 14 | Textos históricos ("Configuração dos números", "visão do cliente é o seletor") contradizem o adendo 18 do 04 e o 20 do 03 | Nada a fazer enquanto os adendos mandam; limpar na próxima versão |
| 10 | 4.1 × 10 2.7 e 5.4 | O convidado do contratante não é "Cliente" nem usuário comum: não está na tabela de papéis do Desenho 1.1 (quatro tipos de conta) | Incluir o convidado como quinto tipo de conta no Desenho 1.1 |
| 02 | 3.2 e 15.3 P11 | O integrante do Financeiro "só serve a Administrador e Gestor" (P11) | Atualizar P11 com a resposta de 09 13.6 |

### 8.3 Lacunas

1. **Edição de dados fora desta passada:** `atividades.json` e B10 (A15), `configurador.html` e `parametros.json` (seleção "produto", `exige`), `ui-lab/` (identificador de exceção).
2. **Telas do UI lab sem regra no plano:** o módulo **Arquivos** (mover, renomear, versões lado a lado, mapeamento inicial do Drive antigo) não tem especificação em Fundações 7; **registro de ausência** (Timesheet, Equipe) pede a entidade `ausencia`, que nenhuma Fundação define; **ditado** (transcrição no servidor) não tem custo no estudo de precificação.
3. **Catálogo de identificadores de tela** (lacuna 3 da primeira revisão): continua sem dono, agora também para `aba.bpo.*` e para as abas do Financeiro (U1).
4. **Fases do BPO:** 3c é nova; o 09 passou a ter a linha, mas o Plano da Plataforma, o Desenho 9 e o README não mostram a numeração a, b, c.
5. **Pendências externas do 10** seguem `[a confirmar]` (API de ERPs, escrita e condições de parceiro, bancos com API de pagamento, Apple Apps Personalizados, pareceres); o UI lab confirmou a licença da fonte.
6. **Limitações do wireframe** (não são regra): blocos do Painel só detalhados para a Metalúrgica Andrade; indicadores do Timesheet e da Visão geral usam o escritório inteiro; ações em lote do Painel não geram item por cliente; "Já paguei" não muda a guia no Painel; o estado vive na memória da página.

## 9. Rodada de decisões (8/11/2026): suporte, teto, implantação, Financeiro em sete abas e nomes

Decisões do usuário em 8/11/2026, aplicadas por esta sessão nos documentos de `docs/`, em `parametros.json`, no `configurador.html` e em `teste_configurador.js` (299 verificações, todas passam; a calculadora abre sem erro e sem rolagem horizontal a 390 px). `ui-lab/` não foi tocado (outra sessão).

### 9.1 Decisões aplicadas

| Decisão | O que foi feito | Onde |
| --- | --- | --- |
| **P25, suporte geral com assistente de ajuda: sim** | Chat de suporte com pessoas e, dentro dele, assistente de ajuda padrão e barato: só sobre o sistema, limite de 30 perguntas por usuário por mês (hipótese), todo usuário (com ou sem plano de IA), sem consumir UU, encaminha para a equipe ao atingir o limite; da plataforma, não de pacote de área. Custo no sistema-base: chat com pessoas R$ 2 por assento (premissa nova, a medir) e assistente R$ 0,15 (R$ 0,47 no limite), sobre os R$ 12,50 de suporte humano. Contribuição do sistema-base: **68,5% / 42,0% / 7,8% para 67,5% / 39,9% / 4,3%** (P / M / G) | Desenho 1.10; Fundações, adendo 24 (Chamado de suporte, contador mensal, `suporte.perguntar_ajuda`, `suporte.abrir_chamado`, eventos `suporte.*`); 02, adendo 25; 03, 2.0 e adendo 23; Estudo 6.8.9 |
| **P26, teto dos conectores: 130% do uso provável** | Teto de R$ 2,93 (Integra e CNPJ) e R$ 1,78 (InfoSimples) por cliente por mês, era R$ 3,64 e R$ 2,20 (162%). Uso alto do médio: **−13,5% para −3,7%** só pelo teto (R$ 191 de excedente contra R$ 55); −7,5% com o chat de suporte. Risco: R$ 86 por mês de extra no médio se o uso real for 150% do provável | `parametros.json` (`conectores_teto`); Estudo 3.11 e 6.9 |
| **P27, implantação: piso é a margem zero** | Piso = custo de entrega: R$ 2.520 / 5.400 / 13.500 (28, 60 e 150 horas a R$ 90); tabela mantida (R$ 4.500 / 8.500 / 19.500); desconto máximo 44% / 36,5% / 30,8%. A calculadora limita o campo de desconto ao piso (30,7%) e mostra aviso vermelho quando o valor digitado levaria um porte abaixo do custo. **P28 (custo real da hora) segue aberta** | `parametros.json` (`implantacao.margem_piso` 0); `configurador.html`; Estudo 8.3 a 8.7 |
| **Financeiro em sete abas** | "Pendente de decisão, sete ou quatro" virou "**decidido: sete abas**" (Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado); o UI lab foi instruído a acrescentar as três que faltam | 03 (2.0, adendos 20 e 23); 09 (10.1 e adendo 14); esta revisão (8.1 e 8.2) |
| **Audit score e gestão por exceção na primeira versão da tela BPO** | Semáforo por empresa (verde, amarelo, vermelho) com motivo, e visões por exceção (Visão geral, Fila, Rotinas só com o que está fora do verde); nascem na etapa B3 | 10 (5.2 e 11.1) |
| **Pendências do UI lab fechadas** | Aprovados pelo usuário: arranjo padrão dos widgets, oito abas do Painel e Timesheet | 03, adendo 23 |

### 9.2 Divergências abertas da seção 8 resolvidas

| Divergência (8.2) | Resolução | Onde |
| --- | --- | --- |
| Financeiro: sete ou quatro abas | **Decidido: sete abas** | 03, 09 |
| Item BPO na barra (ordem) | **Financeiro, BPO, Configurações**; corrigidos o 10 (2.2) e o DA-02.1, item 9, no Plano | 10 2.2; Plano |
| Clientes, Arquivos e a ficha do cliente | Cenário B: a ficha do cliente continua no Painel (Societário) e **Arquivos** é módulo da plataforma na barra; o item **Clientes** só existe no BPO puro (C1), a tratar na fase do C1 | 10 (2.2, 2.5, A10); 03 (adendo 21 e 23); Plano |
| Cobrança dos clientes do cliente (B13) | Fica **depois**, fora da ordem de construção do B e do C1 | 10 (3.1, 3.10, 11.1) |
| `pagamento.*` com dois sentidos | **`recebimento.*` para entradas** (`pagamento.receber` do 08 vira `recebimento.receber`; `pagamento.baixar` do 09, `recebimento.baixar`; entidade Pagamento do 09 vira Recebimento) e **`pagamento.*` só para saídas** (10). Nomes `cobranca.pagamento.informado` e `guia.pagamento.informado` não mudam (prefixo próprio) | 01, 08, 09 |
| `pacote_id` ou `pacote_area` | **`pacote_area`** | 01 (4.1, adendo 23), 10 |
| "Exige: Painel" no Estudo e em `parametros.json` | Trocado por "Exige: pacote de área" (DA-02). A chave técnica `painel` do JSON segue sendo o pacote Contábil | Estudo (2.2, 6.2, adendo); `parametros.json` |
| A15: `atividades.json` e B10 | FIN-201 da fase 5 para a **3** (3c); BPO-017 da 5 para a **4**, com CIC-005 (de que depende); B10 alinhado ao JSON em BPO-005, 009, 010, 012, 017, 019 e 020. O mapa HTML lê o JSON e **não foi regerado** | `atividades.json`; B10; 10 (11.3, A15) |

### 9.3 Continua aberto (sem decisão)

| Arquivo | Seção | Problema |
| --- | --- | --- |
| Plano da Plataforma × subplanos | Plano 7 (fases 0a a 6) | Numeração própria do Plano contra as fases a, b, c do catálogo; falta a tabela de correspondência |
| Estudo × 10 | Estudo 6.4 (linha do Modo BPO) | "Tema, domínio e app de cada subescritório" por R$ 120, anterior à P5 e à P10 (portal de convidado, PWA primeiro, app com marca na loja à parte) |
| UI lab × 09 | `REVISAO.md`, seção 1 | O wireframe chama a exceção do João de `aba.financeiro.honorarios`; o identificador é `aba.financeiro.contratos` (corrigir no UI lab) |
| 03 (U3) | 2.4, 5 | "Tarefas deste setor" como bloco fixo ou widget escondível |
| 05 (U5) | 8.1 | Ordem das abas do Timesheet (05: Meu tempo · Equipe · Rentabilidade · Confirmações; UI lab: Meu tempo · Confirmações · Equipe · Rentabilidade); o usuário aprovou o Timesheet do UI lab, mas a ordem não foi decidida em texto |
| 01 × UI lab | 5.4 regra 1 | Como o tempo de operar o Financeiro é registrado quando não há tarefa (09 e 05 não dizem) |
| 10 | 3.15 e 3.15.1 | O texto "Luana" ficou depois da resposta de P11 (é a Sofia) |
| 04, 03 | 04 13.2 A13; 03 adendo 14 | Textos históricos ("Configuração dos números", "visão do cliente é o seletor") contradizem os adendos mais novos |
| 10 × Desenho | 4.1 × 10 2.7 e 5.4; Desenho 1.1 | O convidado do contratante não está na tabela de papéis do Desenho 1.1 (quatro tipos de conta); falta o quinto tipo |
| 02 | 3.2 e 15.3 P11 | O integrante do Financeiro "só serve a Administrador e Gestor" (P11) contra a resposta de 09 13.6 |

### 9.4 Lacunas e itens novos

1. **Seleção "produto" no configurador** (núcleo e pacotes separados, A14): segue pendência de código; o preço não muda.
2. **Hipóteses novas a medir:** chat de suporte com pessoas em R$ 2 por assento (era premissa deste ajuste, sem base de mercado), limite de 30 perguntas por mês do assistente, uso real dos conectores contra o teto de 130%, e as horas e o custo da hora de implantação (P28).
3. **Fases do catálogo:** a escolha de BPO-017 e CIC-005 na fase 4 é desta rodada (o 10 só dizia "antecipada"); o mapa HTML precisa ser regerado.
4. **Telas do UI lab sem regra** (Arquivos em detalhe, `ausencia`, ditado), **catálogo de identificadores de tela** e **fases a, b, c do BPO** no Desenho 9 e no README: seguem como na seção 8.3.
5. **UI lab:** três abas do Financeiro por acrescentar, posição do item Arquivos na barra e identificador `aba.financeiro.contratos`: dependem da outra sessão.

## 10. Segunda rodada do UI lab (8/11/2026)

Entrada: `ui-lab/PLANO.md` e `REVISAO.md` atualizados (decisões 25 a 34, respostas à sessão-mãe, seção BPO, regras conferidas). Incorporados em 01, 02, 03, 04, 05, 06, 09, 10, Desenho, Plano, Estudo e README. `ui-lab/` não foi tocado. Mesmo critério: contradição clara com decisão listada foi corrigida no lugar; o resto ficou listado.

**O que entrou.** **15 linhas:** as 12 de "O que muda no 10" (abas curtas; Visão geral por "Precisa de decisão"; Carteira com ERP; conferência antes do lote; faixas e aprovação reforçada; cartão do app; B3; Configuração por empresa; cruzamentos; excedente; abas por papel; subpasta de Entregáveis) e as 3 novas de "O que muda nos subplanos" (03 6.8 e 09: Financeiro com sete abas e titular; Fundações 7: Arquivos, índice, visualizador e subpasta; Suporte da plataforma). Reagrupamentos do 03 (resposta 2) em 03 2.0, 2.3, 3.2, 6.2 e 6.8 e no Desenho 2.1. Suporte conferido em Desenho 1.10, Fundações (adendos 24 e 25), 02 (adendos 25 e 26), 03 (2.0 e adendo 23) e Estudo (6.8.9 e adendo). Adendos "decisões do UI lab, segunda rodada" novos em 01 (25), 02 (26), 03 (24), 04 (21), 05 (18), 06 (20), 09 (16) e no Estudo; o 10 recebeu a seção 12.

### 10.1 Correções feitas

| Arquivo | Seção | De | Para |
| --- | --- | --- | --- |
| Desenho | 2.1 (barra) | Seis módulos (Início a Configurações), sem Arquivos, BPO nem Suporte | Início, Painel, CRM, Timesheet, Arquivos, Financeiro, BPO e, no pé, Suporte e Configurações; Início com três abas; Painel com oito, só para quem tem setor contábil, com Obrigações própria; Financeiro, Arquivos e BPO módulos laterais |
| Desenho | 2.1 (seletor) | Seletor global, exceto CRM, Financeiro e Configurações | Seletor **por módulo**: no BPO só as empresas de BPO, no Painel só as da contabilidade |
| Desenho | 1.10 | Entrada "Suporte" sem a tela | Ajuda do sistema, Falar com a equipe (fila e fora do horário) e Histórico |
| Plano | DA-02.1, item 9 | Ordem sem Suporte; sem regra do Painel nem do seletor | Suporte e Configurações no pé; Painel só com setor contábil; seletor por módulo |
| 03 | 2.0 (esquema e tabela) | Painel com nomes longos; sem Arquivos, BPO e Suporte; Financeiro "o wireframe tinha quatro" | Oito abas (nome curto na aba, completo no título); Arquivos, BPO (nove abas) e Suporte na tabela; Financeiro com as sete desenhadas; Obrigações própria |
| 03 | 2.0, 2.3, 3.2 | Seletor "global, some em CRM, Financeiro e Configurações" | Por módulo (BPO só empresas de BPO; Painel só as da contabilidade) |
| 03 | 6.2 | Sem a regra da agenda | Com cliente, a agenda de todas as áreas; na carteira, a semana por cliente |
| 03 | 6.8; adendos 20 e 23 | Quatro ou sete abas "pendente"; "UI lab instruído a acrescentar" | Sete, decididas e desenhadas; peças com titular que servem ao BPO |
| 03 | adendos 21 e 23 | Ordem com "BPO" duas vezes (item do pacote e antes de Configurações) | Início, Painel, CRM, Timesheet, Arquivos, Financeiro, BPO, Configurações |
| 09 | 10.1 e adendo 14 | "UI lab desenhou quatro e foi instruído a acrescentar três" | Sete desenhadas na segunda rodada (adendo 16) |
| 10 | 2.2 | Posição de Arquivos "segue o UI lab"; sem Suporte nem regra do Painel e do seletor | Ordem do plano, divergência registrada; Suporte no pé; Painel só com setor contábil; seletor por módulo |
| 10 | 2.4 | Calendário "com cor própria"; app sem regra da empresa só de BPO; sem seletor | Calendário único com uma cor por pacote; empresa só de BPO sem documentos nem áreas da contabilidade; linha do seletor |
| 10, 01 | F8, A8; 01 7.8 e adendo 23 | `Entregáveis/BPO` | Subpasta `Entregáveis/BPO financeiro` na árvore-modelo, visível a quem aprova pagamentos |
| 10 | 3.0 | Configuração por empresa só implícita | Lista da Configuração (ERP e modo, escopo, religar, bancos, M1 a M3, alçadas, janela) |
| 10 | 3.5 | Conta conferida entra no lote | Conferência por outra pessoa antes do lote; conta conferida depois da janela vai ao próximo lote |
| 10 | 3.6 | Botões "Aprovar todas / deixar 1 de fora / Recusar / Perguntar" | Aprovar, Editar e aprovar, Recusar com motivo; quem e quando; sino; "Já liberei no banco" (M1); linha da invariante B3; "Home do BPO" vira Visão geral |
| 10 | 3.7 | "2 aprovadores" acima de R$ 20 mil; faixa 2 "1 aprovador com a alçada" | Faixas 1 e 2 nomeadas; faixa 2 com alçada para o total; acima, aprovação reforçada com 2 pessoas marcadas na ficha |
| 10 | 3.8 | "Em operação pequena, uma pessoa digita e confere (conferência única)"; configuração só do Administrador | Quem digita não confere, botão desligado com o motivo, sem exceção; configurar alçada, janela e modo é do Gestor ou do Administrador, com aceite do sócio no app |
| 10 | 3.9 | Alçada da pessoa "na Conta de cliente"; editada só pelo Administrador do BPO | No contato da ficha (o mesmo do CRM e do app); mudança vai ao aceite do cliente no app; editada pelo Gestor ou Administrador |
| 10 | 5.1, 5.2 | Nove nomes inteiros; Visão geral sem ordem; Carteira só com score e ERP; Configuração geral | Nome curto na aba e completo no título; "Precisa de decisão" primeiro; auditoria com cor e rótulo; Carteira com sincronização, caixa × mínimo, lotes e SLA; Configuração por empresa |
| 10 | 5.4 | Configuração "só o Administrador edita"; sem contagem de abas; alçada "adição na Conta de cliente" | Gestor edita; Colaborador 6, Gestor 8, Administrador 9; alçada no contato da ficha |
| 10 | 7.3 | Excedente "propõe excedente ou aditivo" | Excedente vira extra na fatura do escritório, com o ok de uma pessoa (a referência "4.2" do UI lab é esta seção) |

Total: 22 linhas (cerca de 40 trechos, em 6 arquivos: Desenho, Plano, 01, 03, 09 e 10).

### 10.2 Divergências abertas

| # | Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- | --- |
| D1 | Plano, 10 × UI lab | DA-02.1 item 9; 10 2.2 | O plano põe CRM, Timesheet, Arquivos; o UI lab desenhou CRM, Arquivos, Timesheet | Escolher uma ordem (a do plano exige mudar o UI lab) |
| D2 | 10 | 3.8 e 5.4 | **Fechada em 8/11/2026 (seção 11):** quem altera a alçada de uma empresa não confere nem libera pagamento nessa empresa, e a mudança vai ao aceite do cliente. O Gestor do BPO edita a Configuração (alçada, janela, modo) e também confere e libera na mesma empresa; a segregação diz que quem configura não opera pagamentos | Confirmar se o Gestor edita só com aceite do sócio, ou se a edição fica com o Administrador |
| D3 | 10 | 3.8 | **Fechada (seção 11):** conferência pelo Gestor do escritório ou, na falta, pelo cliente na aprovação. A exceção "conferência única" foi retirada para seguir "quem digita não confere"; um BPO de uma só pessoa fica sem como conferir | Confirmar a retirada ou aceitar a conferência por outra pessoa do cliente |
| D4 | 10 | 3.4, 3.7 e Q5 | **Fechada (seção 11):** M3 fora da primeira versão, marcado nos lugares do 10. O M3 segue descrito (e na faixa 1) enquanto a hipótese o deixa fora da primeira versão | Decidir Q5; depois marcar o M3 como "fase posterior" nos três lugares |
| D5 | 10 | 5.2 e Q1 | **Fechada (seção 11):** critérios e pesos fixos, Gestor ajusta; regra aplicada em 5.2. A regra inicial do score (parâmetros do inquilino, 2 dias úteis) difere da hipótese (critérios e pesos fixos, Gestor ajusta) | Decidir Q1 |
| D6 | 10 × 08 × Fundações | 3.0, 3.4, A16 e Q2 | **Fechada (seção 11):** cofre do escritório, leitura a cada 15 minutos; aplicado em 3.0, 01 e 08. Credencial do ERP "no cofre da empresa" contra a hipótese "no cofre do escritório"; consulta periódica sem intervalo (hipótese: 15 minutos) | Decidir Q2 |
| D7 | 05 × 10 | 05 adendo 17; 10 7.1 e A11; Q7 | **Fechada (seção 11):** um custo-hora do escritório com opção por pacote; aplicado em 10 7.1, A11 e 05. Custo-hora "por departamento" contra a hipótese "do escritório, com opção por pacote" | Decidir Q7 |
| D8 | Fundações × 10 × 06 | 2.3; 10 3.9; 06 2.4; Q8 | **Fechada (seção 11):** chave (pessoa, cliente, serviço); aplicado em Fundações 2.3, 06 e 10. `papel_cliente` é um por (pessoa, cliente); a hipótese pede papel por serviço contratado | Decidir Q8; depois mudar a chave da Conta de cliente |
| D9 | 10 × UI lab | 10 7.3; `PLANO.md` | O UI lab cita "4.2" para o excedente; no 10 a regra está em 7.3 (4.2 é visibilidade entre escritórios) | Corrigir a referência no UI lab |
| D10 | Fundações × 10 | 7.8, F8 | "Visível a quem aprova pagamentos" assumido como a área `pagamentos_aprovar`; não há tela de pastas por área | Confirmar o mapeamento |
| D11 | Desenho, Estudo | 1.10; 6.8.9 | O horário de atendimento da equipe (para a fila e o "fora do horário") não está definido; o custo de R$ 2 supõe horário comercial | Definir o horário e a promessa de resposta |
| D12 | 03 (U3) | 2.4 | "Tarefas deste setor" obrigatório ou escondível | Continua aberta |
| D13 | 05 (U5) | 8.1 | Ordem das abas do Timesheet (05 e 03 2.0: Meu tempo · Equipe · Rentabilidade · Confirmações; UI lab: Confirmações antes) | Continua aberta |
| D14 | 03, Desenho | 03 1.1, 2.1 (esquema), 6 (661, 663); Desenho 2.1 | Textos históricos (Home como aba, "onze abas", esquema antigo da barra) contradizem o esqueleto novo | Limpar na próxima versão; vale a tabela de 03 2.0 |

As divergências 9.3 (Plano 7 × fases a, b, c; Estudo 6.4 do Modo BPO; identificador `aba.financeiro.contratos`; tempo no Financeiro sem tarefa; "Luana"; convidado do contratante no Desenho 1.1; P11 do 02) **continuam abertas**, sem mudança nesta rodada.

### 10.3 As 11 perguntas que o UI lab devolveu

Registradas no [10, seção 12](10-BPO.md). **Respondidas pelo usuário em 8/11/2026** (nove; Q10 e Q11 não eram perguntas a ele); o resultado está na coluna da direita e na [seção 11](#11-respostas-finais-8112026) deste relatório.

| # | Tema | Resposta |
| --- | --- | --- |
| Q1 | Auditoria do BPO | **Respondido: segue a hipótese (padrão de mercado).** Critérios e pesos fixos do sistema (sincronização, caixa mínimo, vencido sem aprovação, fornecedor novo, modo arquivo); recalculada a cada sincronização e uma vez por dia; o Gestor ajusta os pesos |
| Q2 | Espelho do ERP | **Respondido: segue a hipótese (padrão de mercado).** Leitura a cada 15 minutos; credencial no cofre do escritório; sem escrita (Nibo, Granatum), a baixa manual conta no SLA com a marca "manual" |
| Q3 | Lote | **Respondido: segue a hipótese (padrão de mercado).** Janela fixa configurável por empresa (exemplo 9h); cartão expirado nunca paga e escala: aprovador, substituto cadastrado, Gestor do BPO, sócio |
| Q4 | Alçada | **Respondido: segue a hipótese (padrão de mercado).** Vale a menor; na aprovação reforçada, se um dos dois está ausente, entra o substituto cadastrado, nunca alguém do BPO |
| Q5 | M2 e M3 | **Respondido: segue a hipótese (padrão de mercado).** M3 fora da primeira versão; só M1 e M2 até haver parecer jurídico |
| Q6 | Faturamento do BPO | **Respondido (mudou).** Uma fatura e uma cobrança por mês, serviços em linhas, **NFS-e por serviço** (item com código próprio na mesma nota se o município permite; notas separadas se não) |
| Q7 | Custo-hora | **Respondido: segue a hipótese (padrão de mercado).** Um do escritório, com opção por pacote quando o custo diferir |
| Q8 | Mesmo contato, dois pacotes | **Respondido (mudou).** Um só app e um só acesso; papel e áreas por serviço contratado, somados na tela; chave (pessoa, cliente, serviço) |
| Q9 | Suporte | **Respondido (mudou).** O assistente de ajuda lê, só pelo escopo de quem perguntou, sem alterar nada sem aprovação (correção vira cartão); se não resolver, a equipe pede para ver a tela, com consentimento, prazo e registro |
| Q10 | Persistência, tempo real e offline | **Não é pergunta ao usuário.** Decisão de engenharia da stack; lacuna para a fase de stack |
| Q11 | Blocos do Painel por cliente | **Sem pergunta.** Limitação do wireframe, sem pergunta |

### 10.4 Lacunas

1. **Identificadores de tela** (`aba.bpo.*`, `aba.financeiro.*`): sem catálogo, e o 10 não diz se o identificador usa o nome curto ou o completo da aba.
2. **Telas do UI lab sem regra:** as de 8.3 continuam (Arquivos em detalhe, `ausencia`, ditado); novas: pedido e consentimento de tela compartilhada no Suporte e o histórico de sessões (Q9, decidida) e o histórico de chamados como lista própria.
3. **Dependem do UI lab:** ordem de Arquivos e Timesheet na barra (D1), referência "4.2" (D9) e identificador `aba.financeiro.contratos`.

## 11. Respostas finais (8/11/2026)

Entrada: as respostas finais do usuário sobre BPO, faturamento conjunto, papel por serviço e suporte. Foram marcadas como respondidas as **nove perguntas Q1 a Q9** (10, seção 12): seis seguem a hipótese de mercado (Q1, Q2, Q3, Q4, Q5, Q7); **Q6, Q8 e Q9 mudaram**. Seguem também a hipótese, por não terem sido objetadas, **D2 a D8** (10.2) e as três divergências da sessão-mãe (BPO de uma pessoa, quem altera a alçada, chave da Conta de cliente). Q10 e Q11 continuam como estavam (engenharia e limitação do wireframe). `ui-lab/` não foi tocado.

### 11.1 Correções feitas

| Arquivo | Seção | De | Para |
| --- | --- | --- | --- |
| 10 | 12 | Onze perguntas com hipótese, "nenhuma é decisão" | Respostas finais (Q1 a Q9 respondidas; Q6, Q8 e Q9 mudaram); adendo 13 |
| 10 | 2.4, 7.3, A13 | "Uma fatura, linhas por serviço" | Uma fatura e uma cobrança por mês; notas por serviço |
| 10 | 3.0, 3.13 e A16 (e 01 adendo 23, 08 adendo 15) | Credencial no "cofre da empresa"; consulta sem intervalo | Cofre do escritório (por titular empresa); leitura a cada 15 minutos; baixa manual conta no SLA |
| 10 | B3, 2.4, 3.0, 3.4, 3.7, 5.2 | M3 descrito como modo possível | M1 e M2; M3 descrito e desligado na primeira versão |
| 10 | 3.5, 3.6, 3.7 | Janela e expiração sem regra; aprovação reforçada sem ausência | Janela fixa por empresa; cartão expirado escala (aprovador, substituto, Gestor, sócio); substituto cadastrado |
| 10 | 3.8, 3.9 | BPO de uma pessoa "divergência a confirmar"; alçada sem o papel por serviço | Conferência do Gestor ou do cliente na aprovação; quem altera a alçada não opera pagamento da empresa; alçada na linha `bpo_financeiro` |
| 10 | 5.2 | Score com parâmetros do inquilino e 2 dias úteis | Critérios e pesos fixos; recálculo por sincronização e diário; Gestor ajusta os pesos |
| 10, 05 | 7.1, A11; 05 adendo 17 | Custo-hora "por departamento", hipótese | Do escritório, com opção por pacote |
| Fundações | 2.3, adendos 24 e 25 | Chave (pessoa, cliente); assistente "sem ferramenta de dados"; equipe "nunca" vê dados | Chave (pessoa, cliente, serviço); assistente só lê, pelo escopo de quem perguntou; tela da equipe só com consentimento; adendo 26 |
| 06, 04 | 06 2.3, 2.4, adendo 20; 04 5.4 e adendo 21 | "Papel por pacote é hipótese"; "cada empresa tem o próprio papel" | Um só app e acesso; papel e áreas por serviço, somados; adendo 21 |
| 09 | 4.5, 5.5, 10.8 (Notas), adendos 15 e 16 | "Uma fatura", NFS-e "de cada fatura"; excedente "hipótese Q6" | Uma cobrança por mês, NFS-e por serviço; Q6 decidida; adendo 17 |
| 06, Plano | 06 3.8 (Financeiro); Plano DA-02.1, item 5 | NFS-e "de cada fatura"; "fatura uma vez" | NFS-e por serviço |
| Desenho | 1.10 | Assistente "sem acesso a dados do cliente" | Leitura pelo escopo de quem perguntou; sessão de tela com consentimento; R$ 0,16 |
| 02, 03 | 02 adendo 25; 03 2.0 e adendo 23 | Assistente "sem ferramentas de dados", "não acessa dados" | `suporte.diagnosticar` (ler); adendos 27 e 25 |
| Estudo | 3.3, 6.8.8, 6.8.9, adendos | Ajuda a R$ 0,15 e R$ 0,47, "não acessa dados"; diagnóstico "sem custo" | Premissa de diagnóstico (+R$ 0,011 no provável; +R$ 0,18 no alto); NFS-e por serviço |
| README | tabela | Descrições antigas | Suporte com leitura e tela sob consentimento; respostas finais |

Total: **17 linhas** (cerca de 45 trechos, em 14 arquivos).

### 11.2 Divergências abertas

| # | Arquivo | Seção | Problema | Sugestão |
| --- | --- | --- | --- | --- |
| N1 | 09 × 08 | 5.5 | "Item com código de serviço próprio na mesma NFS-e" depende do município e do leiaute; o Emissor Nacional pode aceitar um serviço por DPS, o que força notas separadas, e isso não foi pesquisado | Confirmar o leiaute com o contador do grupo, por município |
| N2 | Fundações × 10 | 2.3; 3.9 | "Edita o sócio" a alçada da pessoa: com papel por serviço, é o sócio do BPO ou o da contabilidade | Dizer que a edição é de quem tem papel `socio` na linha `bpo_financeiro` |
| N3 | Estudo | 3 a 7, 10; `parametros.json` | Os totais seguem com R$ 0,15 e R$ 0,47 de ajuda; o acréscimo do diagnóstico está só na linha à parte e no adendo | Refazer os totais na próxima versão (v0.8) |
| N4 | Fundações × Desenho | adendo 26; 1.10 | Prazo padrão de 30 minutos, limite de 5 chamadas por pergunta e "sem gravação" são premissas minhas, sem decisão; falta base legal LGPD da sessão de tela | Confirmar os três e pedir parecer do advogado do grupo |
| N5 | Desenho, Estudo | 1.10; 6.8.9 | D11 (horário de atendimento e promessa de resposta) continua aberto, e agora também pesa no pedido de tela | Definir o horário |
| N6 | UI lab | Suporte, ficha, Cobranças | Sem tela para o pedido e consentimento de tela, a linha por serviço na ficha e a cobrança única com notas por serviço | Pedir ao UI lab |
| N7 | 10 × 09 R1 | B1; 3.0 | "Conta, token e certificado são da empresa, no cofre" (B1) e agora "cofre do escritório": a posse é da empresa, o cofre é do inquilino; o texto de B1 não diz | Reescrever B1 com a distinção |
| N8 | 06 | 2.4 | O papel `contador_interno` por serviço e a união das áreas: se um serviço revoga a linha, a outra continua; o app deve avisar a pessoa | Definir o aviso no app |
| N9 | 00 | 9.3 e 10.2 | D1 e D9 a D14, e as divergências 9.3, seguem como estavam | Sem mudança |

## 12. Últimas decisões (8/11/2026)

Entrada: as respostas do usuário às divergências N1 a N9 da seção 11.2 e uma decisão da sessão-mãe (escalonamento do lote). **Atenção à numeração:** o enunciado desta rodada chamou de N3 as premissas do suporte e de N4 os custos do diagnóstico, o inverso da tabela 11.2 (N3 = totais do estudo; N4 = premissas do suporte); abaixo vale o conteúdo, com os dois números. `ui-lab/` não foi tocado.

### 12.1 Resolvido

| Divergência | Decisão | Onde ficou |
| --- | --- | --- |
| **N1** (NFS-e) | O layout da NFS-e é o nacional, o mesmo em toda a federação: "o município decide" virou **"o layout nacional decide"**. **Uma NFS-e por serviço** é o padrão; parâmetro **`nfse_por_servico`** (padrão `verdadeiro`) para quando o layout confirmar vários itens por DPS. **[a confirmar na NT 007/2026]**: a nota técnica não foi lida | 09 5.5 e adendo 18; 10 7.3, Q6 e adendo 14; Fundações 2.3 (tabela do adendo 26) e adendo 27; Plano DA-02.1; Desenho 7.2; 06 adendo 22; estudo |
| **N2** (quem edita a alçada) | Mantida a hipótese: o **sócio com papel de aprovador no BPO** (`papel_cliente = socio` na linha `bpo_financeiro`) | 10 3.9; Fundações 2.3 e adendo 27 |
| **N4 da tabela** (premissas do suporte: 30 minutos, 5 leituras por pergunta, sem gravação) | "Mantém". Segue aberto o parecer do advogado do grupo sobre a base legal (LGPD) | Desenho 1.10; Fundações adendo 27 |
| **N3 da tabela** (totais do estudo com o diagnóstico) | "Parece bom". **Totais refeitos** (ajuda R$ 0,06 / 0,16 / 0,65); `parametros.json`, calculadora e teste (304 verificações) atualizados; Playwright: abre sem erros e sem rolagem a 390 px | estudo (adendo do topo, 3.3, 6.4, 6.8.10, 6.9, 9.2, 10.4); `docs/precificacao/` |
| **N6 da tabela** (telas do UI lab) | "Ok": podem ser pedidas (suporte com FAQ e pedido de tela, linha por serviço na ficha, cobrança única com notas por serviço, chip de pacote, cartão com escalonamento) | pedido ao UI lab, pendente de envio pela sessão-mãe |
| **Suporte: FAQ** | Seções básicas de FAQ na Ajuda; **ordem FAQ, assistente, equipe**; custo desprezível (R$ 0 nos totais) | Desenho 1.10; Fundações adendo 27; 02 adendo 28; 03 adendo 26; estudo 6.8.10 |
| **Custo-hora** | Único, do escritório, **incluindo todos os pacotes**; por pacote é extra opcional, desligado por padrão; **BPO é filtro** ("Pacote: Contábil / BPO / Todos") no Timesheet e na Rentabilidade. Q7 da segunda rodada corrigida | 05 8.4, A7, adendo 17 corrigido e adendo 19; 10 7.1, 7.4, A11 e Q7; estudo 6.8.10; 03 adendo 26 |
| **Escalonamento do lote** (decisão da sessão-mãe, **premissa de mercado**) | 9h cartão ao aprovador designado; +4 h lembrete; +8 h (ou abertura do dia útil seguinte) ao substituto; véspera do vencimento mais próximo, alerta ao Gestor do BPO e ao sócio com a lista; vencido sem aprovação, só alerta, nunca paga, empresa vermelha na auditoria. Unifica as sequências de 3.6, 3.7 e Q3 | 10 3.5, 3.6, Q3 e adendo 14; Fundações adendo 27; 02 adendo 28; 06 adendo 22 |

**Efeito dos custos do diagnóstico (sistema-base sem IA, P / M / G):** custo provável R$ 321,79 / 827,88 / 2.214,34 por mês (+R$ 0,05 / 0,16 / 0,43); margem de contribuição **67,5% / 39,9% / 4,3%**, sem mudança na primeira casa; no uso alto 35,3% / −7,7% / −54,2% (era 35,4% / −7,5% / −53,9%). **Comparação com o suporte humano de R$ 25 por usuário:** a ajuda por IA custa R$ 0,16 contra R$ 12,50 de suporte humano no provável (1,3%); se o suporte ficasse em R$ 25, a margem seria 61,2% / 26,2% / −17,3%.

### 12.2 Correções de texto (resumo)

Cerca de 40 trechos em 12 arquivos: onde o plano dizia "o município permite" para a NFS-e (09, 10, Fundações, Plano, Desenho); "custo-hora por departamento" e "trabalho do BPO nunca entra" (05 adendo 17); "alerta ao responsável e ao sócio" (10, 02); ajuda a R$ 0,15 e R$ 0,47 (estudo, 02, Desenho); 25 números do estudo de precificação (6.4, 6.9, 9.2, 10.4 e textos) pelos novos valores.

### 12.3 Segue aberto

| # | Assunto | Observação |
| --- | --- | --- |
| N1 | NT 007/2026 e o Emissor Nacional: aceitam vários serviços por DPS? | Ler a nota técnica; até lá, uma NFS-e por serviço |
| N5 | D11: horário de atendimento e promessa de resposta | Pesa também no pedido de tela |
| N7 | Redação de B1 (10): posse da empresa, cofre do escritório | Reescrever B1 com a distinção |
| N8 | Aviso no app quando um serviço revoga a linha e a outra continua (06 2.4) | Definir o aviso |
| N9 | D1, D9 a D14 e as divergências 9.3 | Sem mudança |
| Novo | Escalonamento do lote: o sócio só recebe alerta ou também pode aprovar no lugar do aprovador? | Hoje só alerta; confirmar com o usuário |
| Novo | Base legal LGPD da sessão de tela | Parecer do advogado do grupo |
| Novo | Resolução do FAQ (quantas perguntas evita) e custo real da hora de suporte (R$ 12,50) | Medir no piloto |
| Novo | `ui-lab/` não reflete o FAQ, o chip de pacote, o escalonamento nem o `nfse_por_servico` | Pedir ao UI lab |


## 13. Revisão dos subplanos do pacote Jurídico (JU-01 a JU-05)

Leitura cruzada das tabelas de perguntas. Nada foi desenvolvido; são só ajustes de texto a fazer depois das respostas.

**Divergências a unificar**

1. **Sócio e caso restrito.** JU-01 (P2) diz que o sócio *não* vê automaticamente e entra com motivo; JU-02 (12) diz que o sócio pode abrir, com registro e aviso. Mesma regra, duas redações: fica "o sócio pede acesso com motivo, o acesso é registrado e os membros do caso são avisados".
2. **Segunda conferência do prazo fatal (escritório de um só advogado).** Aparece três vezes (JU-01 P3, JU-02 5, JU-03 P4) com três variantes (reconfirma em outro horário, cálculo independente mais aviso no dia seguinte, assistente ou recontagem). Fica uma só: recontagem independente do motor, confirmação do advogado e segundo aviso no dia seguinte; colega de fora é opcional.
3. **Margem interna.** JU-01 P5 (D-2 útil, de D0 a D-5) e JU-03 P5 (5 dias úteis em recurso e contestação, 2 em manifestação simples) não são excludentes: o padrão por tipo de peça é o de JU-03, e D-2 vale como padrão geral onde não houver regra do tipo.
4. **Ciência no Domicílio.** JU-01 P6, JU-02 7 e JU-03 P3 concordam: nunca delegável, autorização geral mais cartão a cada ciência, e a primeira semana de cada escritório roda com aprovação do gestor.
5. **Cache global de respostas.** JU-04 (2) restringe o cache global às perguntas canônicas da base e muda o que o subplano 07 (P3) dizia. Precisa de ajuste no 07 e no Estudo de Precificação.
6. **Preço.** JU-04 (7 e 8) muda a cota (ponderada pelo modelo, franquia por documentos) e cobra o módulo de lei por escritório; JU-05 (a, b, d) dá preço próprio por pacote e piso de R$ 250. O Estudo de Precificação e a calculadora ainda não refletem nada disso.
7. **Contrato (cláusulas, vigência).** JU-01 P12 deixa a entidade Contrato para JU-04, que a trata na onda do consultivo; conferir que o nome continua "Contrato" e não colide com o contrato de honorários do JU-05.
8. **Gestão sem Painel.** JU-02 (10) põe a Gestão dentro do Jurídico; já combina com DA-02.1 (item 10, simetria) e com o Clientes para quem não tem Painel.

**Perguntas que dependem de gente de fora**

- Parecer de advogado especializado (sigilo, LGPD, termos, responsabilidade, seguro) antes de usar casos reais: JU-03 P10.
- Contador da família confere a base e os tributos; advogada da família confere ética e prazos; só advogado especialista aprova para vender: JU-04 13 e JU-05 h.
- Calendário forense: quem cura e com que custo (JU-01 P9, JU-03 P7).
- Contrato com o CNJ para andamentos (JU-03 P2) e se o monitoramento por agregador vale a pena (JU-05 d).

### 13.1 Resolução (9/11/2026)

O usuário respondeu "segue hipótese em todas". As oito divergências foram resolvidas como propostas e as **regras unificadas** estão escritas ao fim de cada JU-01 a JU-05, em "Decisões do usuário (9/11/2026)". Adendos feitos em Fundações (28), 05, 07 (cache), 09, Estudo de Precificação e Plano da Plataforma. A calculadora e `parametros.json` **não** mudaram: ficam para quando o Jurídico for construído.

## 14. Revisão dos subplanos JU-06 a JU-12 (9/11/2026)

Sete subplanos novos do pacote Jurídico (time de agentes, CRM e app, documentos e assinatura, agenda e correspondentes, segurança e LGPD, migração e lançamento, estudo de preço). **Nenhuma norma foi lida no texto oficial** em nenhum deles; tudo que cita OAB, LGPD, CNJ e Lei 14.063 está [a confirmar]. As perguntas somam 90 (JU-06: 13; JU-07: 13; JU-08: 14; JU-09: 12; JU-10: 12; JU-11: 13; JU-12: 13), cada uma com hipótese.

**Divergências resolvidas (valem como regra unificada, em conflito vale esta lista)**

1. **Nome do estado da Peça:** `pronta_para_protocolo` (JU-01). O JU-03 usava `pronta_para_conferir`; corrigido.
2. **Guarda de quem consultou e não contratou:** JU-07 dizia "pela guarda do Caso (5 anos)"; JU-10 dizia 12 meses para narrativa e documentos. Vale o JU-10: **lead sem consulta, 90 dias; consulta sem contratar, 12 meses para narrativa e documentos; registro mínimo de conflito, 5 anos; nenhuma lista de reativação.** O JU-07 passa a seguir isso.
3. **Citação inicial de empresa aberta pelo representante no app** (JU-03 P11, JU-07 P12): tratada como ato do próprio titular, com aviso, **e a advogada confere** a compatibilidade com "ciência nunca delegável" antes de ligar.
4. **Os 48 "faz sozinho":** o JU-06 atribui dono aos 13 que o JU-02 deixou sem dono; o JU-02 e o JU-01 seguem o JU-06.
5. **JUR-109 e JUR-112 (e-CAC):** duplicam o Fiscal do Contábil; vale um conector único na plataforma (DA-02.1).
6. **JUR-029 (descarte):** agendar pode ser "faz sozinho"; descartar é "prepara, pessoa conclui" (JU-10).
7. **Plantão de prazo fatal:** sem plantão humano no lançamento; monitor automático 24 horas, escada de alertas e fila prioritária no horário comercial (JU-11). O JU-03 e o JU-06 não prometem mais que isso.
8. **Caso restrito:** o Administrador não lê a conversa do integrante, o fallback para Gestor ou Administrador não vale, cartões editados não alimentam o benchmark, prazo fatal não é rebaixado (JU-06; ajustes pedidos ao 02 e às Fundações).

**Pontos que precisam de decisão do usuário (não resolvidos)**

- **Fixos do pacote:** R$ 6 mil (aprovado) ou R$ 11,3 mil com calendário forense, encarregado de dados e seguros (JU-12 P1). Com R$ 6 mil o equilíbrio é 14 a 18 escritórios; com R$ 11,3 mil, 27 a 34, e o caixa-base não fecha o ano.
- **CRM e App abaixo do custo:** R$ 0,40 e R$ 0,15 por cliente contra custo provável de R$ 0,43 e R$ 0,20 (JU-12 P2). Proposta: R$ 0,60 e R$ 0,30.
- **Capital antes da primeira venda:** R$ 66 mil a R$ 148 mil (pareceres de JU-10 mais piloto grátis de JU-11), fora do fluxo mensal.
- **Correspondentes:** JU-09 recomenda cadastro interno e nunca rede aberta; JU-12 propõe taxa fixa de R$ 5 por demanda, que só faz sentido se houver marketplace (opção C). Decidir junto com o parecer de ética.
- **Pareceres:** oito (JU-10), sete bloqueiam o uso de casos reais.

**Correções que o JU-12 faz ao JU-05:** margem após fixos do Pequeno Essencial é −7,8% (não 5,6%); equilíbrio do Integrado é 20 escritórios pequenos (não 19); o custo dos 15 GB por usuário entra nas margens; a margem de 60% na IA com suporte da IA só vale até cerca de 44% a 47% do teto de uso.

### 14.1 Respostas do usuário (9/11/2026)

- **Segue a hipótese em todas** as perguntas de JU-06 a JU-12, exceto as três abaixo e a regra de preço.
- **Citação inicial de empresa aberta pelo representante no app:** segue a hipótese (ato do próprio titular, com aviso), mas só liga depois que a advogada confirmar que não fere "ciência nunca delegável".
- **Pendentes de explicação ao usuário:** fixos do pacote (R$ 6 mil ou R$ 11,3 mil), de onde sai o capital inicial (R$ 66 mil a R$ 148 mil) e a decisão sobre correspondentes (JU-09 contra JU-12).
- **Regra geral de preço de CRM e App (todos os pacotes):** o CRM fica incluso e o preço escala por cliente (com as faixas), podendo subir se o custo exigir; o **App é vendido à parte**, com valor fixo mensal por padrão e um extra por cliente que cresce com a quantidade. Aplicada ao Jurídico no JU-12; o Contábil já cobra o App à parte (R$ 80 fixo mais R$ 0,30 por cliente) e o CRM por cliente, a conferir no JU-12.

### 14.2 Respostas do usuário (9/11/2026, terceira rodada)

- **P1 fixos do pacote Jurídico:** automatizar com a IA da plataforma o que for possível: calendário forense (agente propõe, pessoa ratifica), encarregado de dados (sócio no início, IA redige), seguros só com cliente pagante (JU-12 v0.3).
- **P3 capital inicial:** **sem parecer pago**; revisão escrita por advogados conhecidos; piloto de **1 a 5 escritórios** com cobrança simbólica possível; custo mantido, mas reduzido expressivamente (JU-10, JU-11, JU-12).
- **P4 correspondentes:** vale o JU-09 (cadastro interno; sistema organiza despesas e paga a partir da conta do escritório, com aprovação humana). **Não é marketplace**; sem taxa por demanda.
- **Painel do Leandro:** de acordo com a lista de decisão; **implementação agentificada**, não cópia crua das rotinas dele (ver `docs/Lista_de_Decisao_Painel_do_Leandro.md`).

### 14.3 Resultado do JU-12 v0.3 (9/11/2026)

Fixos do Jurídico (valores de teste, IA fazendo calendário e encarregado): R$ 3,5 mil / **8,1 mil** / 9,6 mil por mês (baixo, provável, alto); equilíbrio de 18 escritórios antes de tributos e 23 depois; capital inicial em dinheiro de R$ 5,4 mil a 9,5 mil para um piloto de 1 a 5 escritórios (antes R$ 66 mil a 148 mil); caixa no mês 12 do cenário base −R$ 3,8 mil. As perguntas 3 (módulo de lei por advogado dentro de contrato por escritório) e 4 (manter a IA a R$ 79 e R$ 189) do JU-12 seguem a hipótese.

### 14.4 App e preço (9/11/2026)

- **Contábil e BPO:** o App do cliente segue **incluído por padrão** nos pacotes e atalhos; o preço por cliente subiu de R$ 0,30 para **R$ 0,60** (Estudo v0.9; 310 verificações passando). Marca branca e App na loja continuam complementos pagos. O CRM não mudou.
- **Jurídico (JU-12 v0.5):** App incluído nos atalhos **Integrado e Completo** (R$ 40 fixos mais R$ 0,60 por cliente); o **Essencial fica sem App** (R$ 250 / 395 / 682), com o App como complemento opcional, porque no mercado jurídico o portal do cliente não vem nos planos de entrada (Astrea só a partir do Smart; Projuris só no ADV completo; busca nova inconclusiva, [a confirmar] nas páginas oficiais). É **exceção do Jurídico**; o Contábil não foi reavaliado.

## 15. Segundo escritório, aba Obrigações e comunicação interna (14/11/2026)

- **Societário** continua o nome do setor (E-01 recusado); "Legal" e "Legalização" são sinônimos. O cruzamento com o segundo escritório e o relatório de pesquisa confirmam que é o mesmo setor.
- **Aba Obrigações dinâmica por setor** (adendo no 03): resolve a reclamação dos contadores de que as obrigações estavam "fora do Fiscal". A tabela da seção 2 do 03 que diz `fiscal` como dono da projeção passa a valer como "dono por obrigação"; em conflito, vale o adendo.
- **Itens C2 aprovados** distribuídos em adendos nos subplanos 01 a 09; o C2-08 foi ampliado: o conector de e-mail lê tudo (entrada, enviados e anexos), como o painel do Leandro.
- **Comunicação interna:** subplano 11 novo; sem exclusão de mensagens; ponto de LGPD marcado para revisão jurídica.
- **Protótipo no repositório Heild:** aba Obrigações e comunicação interna ainda não refletidas; este repositório não tem acesso de escrita ao Heild.
