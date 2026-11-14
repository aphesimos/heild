# Subplano JU-06 · Time de agentes jurídicos (pacote Jurídico)

**Versão 0.1 · 9/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Valem as decisões de 8 e 9/11/2026 (escritórios pequenos primeiro; sigilo opção B com A como piso; regras unificadas 1 a 9; IA exige termo; cota ponderada). Adapta ao pacote Jurídico o [Time de agentes do Contábil (02)](../02-Time-de-Agentes.md), sobre a plataforma comum (DA-02, DA-02.1 do [Plano da Plataforma](../../Plano_Plataforma_do_Escritorio.md)). Fontes: [Conferência do pacote](../../Conferencia_Pacote_Juridico.md) (lacuna "time de agentes jurídicos", subplano JU-06), [Síntese](../../Sintese_Pacote_Juridico.md), JU-01 a JU-05 (cabeçalhos, decisões de 9/11/2026 e regras unificadas), pesquisa [J5](../../../pesquisa/juridico/J5-ia-juridica-e-etica.md) e o catálogo `pesquisa/juridico/atividades-juridico.json` (234 atividades: **48 "faz sozinho", 159 "prepara, pessoa conclui", 27 "organiza e lembra"**). **[a confirmar]** marca o que as fontes não verificaram. Valores em R$ e em UU são **estimativas de teste**, nunca cotação.

**Nomes fixos de entidades** (JU-01): Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato.

**Termos simples.** *Ciência*: abrir uma citação ou intimação no sistema do tribunal; dali em diante o prazo corre, sem volta. *Prazo fatal*: o que, se perdido, extingue o direito (definição a confirmar com a advogada). *Peça crítica*: contestação, recurso, tutela de urgência, parecer a cliente ou peça com prazo fatal. *Compartimento*: o "cofre" de um Caso restrito. *Cartão*: pedido de aprovação com resumo e três botões (aprovar, editar e aprovar, recusar). *UU*: unidade de uso de IA do plano (10 mil tokens). *Modo sombra*: o sistema calcula sem avisar ninguém, só para comparar com a advogada.

**Resumo para quem não é advogado.** O time é um conjunto de ajudantes de IA, um por área de trabalho (prazos, peças, pesquisa, atendimento, honorários, secretaria). Cada um pertence a uma pessoa e só enxerga o que ela enxerga. Eles **fazem sozinho** a rotina segura (juntar uma publicação ao processo certo, contar prazo por regra, avisar), **preparam** o que exige decisão (minuta, mensagem ao cliente) e **só organizam e lembram** o resto. Nunca fazem o que a lei reserva ao advogado: dar ciência de citação, confirmar prazo que não pode falhar, assinar, protocolar. Cada caso tem um "cofre": o ajudante nunca lê um caso restrito de que o dono não participa. Peça feita com IA passa por revisão de advogado, tem as citações conferidas por máquina (**citação não verificada bloqueia a peça**) e deixa registro de quem pediu, quem revisou e o que mudou. Peças importantes pedem **dois advogados**, porque a supervisão do uso de IA é responsabilidade dos sócios.

---

## 1. Escopo e princípios

**Dentro:** integrantes e o que cada um faz, prepara ou só organiza (2); supervisão por advogado responsável (3); memória e sigilo por Caso (4); filas, jobs e gatilhos (5); limites, cota ponderada e custo por integrante (6); fluxo da Peça com aprovação em dupla, bloqueio e log de revisão (7); promoção para "faz sozinho" (8); convivência com o Contábil (9); testes de vazamento (10); ajustes, ordem e perguntas (11).

**Fora:** campos das entidades (JU-01); telas (JU-02); contagem de prazo e conectores (JU-03); motor de pesquisa e verificação de citação por dentro (JU-04); regras de honorário e preço (JU-05); Audiência, Perícia e correspondente em detalhe (JU-09, a escrever); LGPD e política de segurança (JU-10, a escrever); preço do pacote (JU-12, a escrever; a seção 6 só entrega custos). Público inicial: 1 a 10 usuários.

### 1.1 O que herda do 02 e o que muda

| Tema | Contábil (02) | Jurídico |
| --- | --- | --- |
| Ato final | "Prepara, pessoa conclui" | Acrescenta **só pessoa**: ciência, fatal, assinatura, protocolo |
| Memória e isolamento | Por escritório | Acrescenta a **memória do Caso** e o isolamento **por Caso**; Jurídico invisível ao Contábil |
| Aprendizado | Cartões editados viram casos do benchmark | **Não vale**: nada de Caso treina, avalia ou alimenta cache global |
| Aprovação | Dupla só no BPO | Dupla também na Peça crítica e no prazo fatal |
| Cota de IA | Esgotou, jobs pausam | **Prazo não pode pausar**: regra roda sempre, com reserva |

### 1.2 Princípios

| # | Princípio | Consequência |
| --- | --- | --- |
| TJ1 | **Ato privativo é da pessoa** (JR1) | Ciência, fatal, assinatura, protocolo, acordo, levantar valor e aconselhar nunca são do integrante, nem por aprovação delegada |
| TJ2 | **Ciência nunca é delegável** (regra unificada 4) | `comunicacao.ciencia.registrar` é irreversível e `nao_promovivel`; titular e cartão a cada ciência; listar nunca dá ciência |
| TJ3 | **Só advogado inscrito confirma prazo fatal** (regra unificada 2) | Estagiário, secretária e integrante só propõem |
| TJ4 | **O agente nunca excede o usuário** (02, R4) | Escopo por interseção, mais o Caso: quem não é membro não lê |
| TJ5 | **IA exige termo do cliente** (Rec. CFOAB 001/2024, 4.1 a 4.3); **segredo de justiça com IA desligada por padrão** | Sem termo, `ia_permitida = falso`; o advogado liga por Caso, com registro |
| TJ6 | **Sigilo por Caso** | Memória, busca, resumo, notificação e transcript respeitam o compartimento antes de devolver |
| TJ7 | **Nenhum ato sem aprovação humana quando a regra de ética exige** | Peça só sai de rascunho com revisão registrada; protocolo nunca é automático |
| TJ8 | **Prazo é regra, não IA** (JR3) | O integrante nunca conta dia; usa a função do JU-03 |
| TJ9 | **Dado de Caso nunca sai do escritório** (R-J5) | Sem treino, benchmark ou cache global; só base pública e casos sintéticos de advogados do grupo |
| TJ10 | **Seguro e silencioso por padrão** | Na dúvida, "pode ter prazo"; sem novidade, sem aviso, mas sempre com a idade da última leitura; sem promessa de "zero perda de prazo" |

---

## 2. Os integrantes do time

### 2.1 Quem são

Um integrante por setor ativo (JU-01, 2.1). **Cada pessoa tem os próprios integrantes** (adendo 22 do 02), os dos setores dela, e o plano de IA é do usuário (DA-02.1, regra 7). Quem trabalha sozinho recebe todos os dos setores que ativar; o que não usa some e não custa.

| Integrante | Setor (JU-01) | Em uma frase | Fase de entrada (JU-01, 5.3) |
| --- | --- | --- | --- |
| **Controladoria de prazos** | `controladoria` | Captura, vincula, propõe e conta prazo; vigia a própria captura; faz a dupla checagem | 1 |
| **Contencioso (redator de peças)** | `contencioso` | Monta a Peça: modelo, checklist, minuta; prepara Audiência | 2 (minuta com IA: 4) |
| **Consultor jurídico (pesquisador)** | Consultoria; Legal e Cálculo são plug-ins do pacote | Pesquisa com vigência, citação conferida e abstenção; parecer; segunda opinião | 4 |
| **Consultivo e Contratos** | `consultivo` | Contrato, parecer, vigência e renovação | 4 |
| **Integrantes de área** | `trabalhista`, `familia`, `previdenciario`, `penal`, `tributario` | Mesma base do Contencioso, com módulo de lei, checklist e tabelas da área; só ligam com o módulo ativo | 4 e 5 (Penal só com o portão de JU-04) |
| **Atendimento ao cliente** | `gestao_atendimento` (plataforma) | Cliente no WhatsApp, andamento em linguagem simples, cobrança de documento | 0 a 2 |
| **Secretaria e Audiências** (proposta) | `gestao_atendimento` e Caso | Agenda, Mandato e assinatura, arquivamento; ciclo da Audiência | 2 |
| **Financeiro de honorários** | `financeiro_escritorio` (plataforma) | Honorário-Jurídico, êxito, repasse, despesa adiantada, conta de terceiros | 3 |
| **Geral** | Sem setor | Chat que roteia; contexto: cliente ou Processo | 0 |

Fora do Time: o **assistente de ajuda** do suporte (adendo 25 do 02), que não é integrante, não tem memória nem ferramenta de escrita e **nunca lê Caso restrito** (JU-01, 6.2, item 7). O departamento jurídico (`depto_juridico`, JUR-191 a 207) fica desativado: só plano.

O **modo cliente** (chat do app) segue o 02, 10.1: integrante **do próprio cliente**, serviço à parte, com termo de ciência de IA, escopo só do que o advogado liberou; nunca opina ("vou ganhar?" vira pedido ao advogado) e se identifica como máquina (Rec. 2.4).

### 2.2 O que cada um faz sozinho

O catálogo tem **48 "faz sozinho"**. As 35 primeiras vêm do JU-02 (5.1); as 13 em negrito **não tinham dono** e esta seção propõe um (ajuste ao JU-02, 11.1).

| Integrante | Faz sozinho (JUR) | Em palavras |
| --- | --- | --- |
| Controladoria | 032, 035, 039, 040, 043, 044, 047 a 051, 053, 054, 057, 218, 228 (16) | Capturar DJEN, vincular, contar dias úteis e recesso, data interna, escada, conferir juntada, dupla checagem, conciliar, achar processo novo, classificar Andamento |
| Contencioso | 019, 020, 082, 093, 221, **234** (6) | Abrir Caso, Partes na base de conflito, custas, banco de peças, **log de revisão da Peça** |
| Consultor jurídico | 061, 189 (2) | Pesquisar lei vigente e conferir citações; vigiar mudança legal |
| Consultivo e Contratos | 164 a 166 (3) | Comparar versões, arquivar assinado, vigência do Contrato |
| Atendimento | 001, 006, 024, 030, **012, 224, 225** (7) | Lead, reunião, cobrar documento, avaliação, cadastro com consentimento de IA, relatório, portal |
| Secretaria e Audiências | **011, 015, 029** (3) | Assinatura do contrato e da procuração; arquivar Caso |
| Financeiro de honorários | 208, 213, 214, 216, 217, **007** (6) | Parcelas, conta de terceiros (só registro), reembolso, faturar por hora, rentabilidade |
| Tributário (área) | **109, 112** (2) | e-CAC e certidões; **já são do Fiscal do Contábil** (9.3) |
| Dept. jurídico (desativado) e plataforma | **197, 203**; **027** (3) | 027 é o Timesheet registrando a sessão do integrante |

Soma: 16 + 6 + 2 + 3 + 7 + 3 + 6 + 2 + 3 = **48**. (O JU-01, 5.2, conta por setor, com as atividades "do caso" à parte: outra vista da mesma lista.) A 093 é Trabalhista: fica com o Contencioso até esse setor ser ativado.

### 2.3 Prepara, organiza e os quatro níveis

Os **159 "prepara, pessoa conclui"** vão até o cartão e param; os **27 "organiza e lembra"** viram tarefa, lembrete ou agenda. Por setor (JU-01, 5.2), prepara/organiza: Contencioso 41/4; Consultivo 21/3; Controladoria 9/2; Trabalhista 15/0; Família 8/1; Previdenciário 10/1; Penal 8/3; Tributário 8/1; departamento jurídico (desativado) 10/5; "do caso" 14/1; Gestão e Atendimento 10/5; Financeiro 5/1. Exemplos: "prepara" é propor o Prazo com norma e termo inicial (JUR-037, 038), minutar a Peça, preparar Audiência (JUR-066, 067), preparar a retenção no alvará (JUR-212); "organiza" é contratar correspondente (JUR-068), réu preso (JUR-126, alerta de horas e atendimento humano), certificados (JUR-229).

| Nível | Significa | Quem conclui |
| --- | --- | --- |
| **Faz sozinho** | Executa e registra | Ninguém precisa clicar |
| **Prepara** | Faz até o cartão; a pessoa lê, edita ou recusa | A pessoa |
| **Organiza e lembra** | Tarefa, agenda, aviso | A pessoa |
| **Só pessoa** (JU-02) | Não há botão de "aprovar": é ato do advogado inscrito | O advogado |

### 2.5 O que nunca fazem sozinhos

Soma as listas do JU-02 (5.2) e do JU-04 (4.5). Cada linha é uma ferramenta bloqueada no executor, não só uma instrução.

| Nunca | Ferramenta ou regra |
| --- | --- |
| Dar ciência ou abrir citação (abrir faz o prazo correr, sem volta) | `comunicacao.ciencia.registrar` |
| Confirmar ou conferir prazo fatal | `prazo.confirmar`, `prazo.conferir` (`condicao_pessoa`) |
| Assinar, protocolar (Estatuto, art. 1º **[a confirmar a numeração]**); liberar Peça sem revisão (Rec. 3.7) | `peca.registrar_protocolo`; `peca.aprovar_para_protocolo`; A3 nunca guardado |
| Aceitar acordo, aconselhar, estimar êxito (Res. CFOAB 16/26 **[a confirmar]**) | Sem ferramenta |
| Repassar valor ou reter honorário do alvará | `honorario.repassar`, `honorario.reter` |
| Decidir conflito; restringir ou abrir Caso restrito; revogar, renunciar ou substabelecer Mandato | `conflito.decidir`, `caso.restringir`, `caso.conceder_acesso`, `mandato.*` |
| Enviar ao cliente fora de modelo aprovado | `conversa.responder` com cartão |
| Ler Caso restrito de que o dono não é membro | `autorizar` com compartimento (seção 4) |
| Obedecer a texto de publicação, petição adversa ou e-mail | Envelope `<dado>` (02, 12.1) |
| Dizer "protocolei", "dei ciência", "confirmei" sem registro | Verificação final (02, 12.3) |

---

## 3. Supervisão por advogado responsável

### 3.1 Quem responde pelo quê

A norma que pesa é a **Recomendação CFOAB 001/2024** (lida na íntegra pela pesquisa J5, **confirmada**; esta sessão não reabriu o PDF): item 3.1, a IA não substitui o julgamento sem supervisão; **3.6, os sócios supervisionam** associados, estagiários e assistentes, com política, treinamento e monitoramento; **3.7, revisar integralmente** o que a IA produz antes de apresentar em juízo. A **decisão da OAB/SP** de que o sócio responde pela supervisão veio por notícia (Migalhas, via Conferência) **[a confirmar no texto oficial]**. Decisões noticiadas (TRT-2, TJPR, TSE, TST) tratam "foi o estagiário" e "foi a IA" como defesa fraca (J5, 2.2; **notícias não conferidas**). Em regras de produto:

| Papel | O que o sistema exige |
| --- | --- |
| **Advogado responsável** (`responsavel_id`) | Todo Caso e toda Peça têm um; libera a Peça e recebe os cartões de ato |
| **Supervisor** (`supervisor_id`, obrigatório para estagiário) | Revisa a Peça do estagiário; os cartões dele vão ao supervisor |
| **Sócio** | Define a política de IA, vê relatório e trilha, é o fim do escalonamento |
| **Estagiário e secretária** | Pedem ao integrante, nunca aprovam ato |
| **Integrante** | Age em nome do dono; **a responsabilidade é do advogado**, nunca do integrante (JR6) |

### 3.2 Política de uso de IA do escritório

A Rec. 3.6 pede política, treinamento e monitoramento. O sistema entrega: (1) **modelo de política**, editável e revisto por advogado de ética antes de vender; (2) **trilha curta** no primeiro uso do integrante (para onde vão os dados); (3) **relatório mensal ao sócio** com Peças feitas com IA, citações bloqueadas, quem revisou e quem liberou, cartões editados e recusados, **sem placar entre pessoas** (decisão 11 do JU-02); (4) lembrete semestral de revisão (Rec. 5.1) **[hipótese]**.

### 3.3 Ausência e substituto

Declarada a ausência (FX-004), o integrante do substituto herda a fila, **mas não herda ato pessoal**: a ciência continua do titular e o fatal continua de advogado inscrito. Sócio único indica **advogado de emergência** ou aceita o aviso de risco (JU-03, decisão de 9/11/2026). O substituto entra só nos Casos escolhidos e **não vê Caso restrito** sem ser incluído por quem pode.

---

## 4. Memória e sigilo por Caso

### 4.1 Quatro camadas

O 02 (5.1) tem três camadas. O pacote acrescenta a quarta.

| Camada | Quem lê | O que guarda | Limite (hipótese) |
| --- | --- | --- | --- |
| **Privada do integrante** | Só ele; o dono vê e edita | Preferências e hábitos do dono | 6.000 caracteres (02) |
| **Do escritório por setor** | Integrantes de quem tem o setor; Administrador revisa | Regras ("margem de 5 dias úteis em recurso"), modelos aprovados, **sem fato identificável de Caso** | 20.000 por setor |
| **Do Caso (nova)** | **Só membros do Caso** e seus integrantes | Preferências e decisões do Caso ("cliente só fala por e-mail"), pendências | 4.000 por Caso |
| **Notas diárias** | O integrante e o dono; Caso restrito vai ao compartimento | O que fez, para quem, o que ficou pendente | 600 por nota (02) |

A memória do escritório **recusa fato identificável de Caso** (JU-04, A7): número de Processo, nome de Parte e estratégia só vão na camada do Caso. Valem as regras do 02 (5.2 a 5.5): conteúdo em inglês estruturado, **identificadores e nunca nomes** (`caso-0142`), tipos de fato fixos, `memoria.*` como único caminho de escrita, "anotei" só depois do `ok`. **Nunca entra:** texto copiado de autos, peça ou mensagem; estratégia; dado de saúde ou de criança (JU-04); CPF, senha, certificado.

### 4.2 Como "um integrante nunca lê Caso restrito de que o usuário não participa"

JU-01 (6.2) define o compartimento: Caso restrito cobre Tarefa, Documento, Conversa, Evento, memória e índice de busca; só membros nominais entram; **o Administrador não entra automaticamente**. O integrante herda isso com sete amarras:

| # | Amarra | Como funciona |
| --- | --- | --- |
| 1 | **Autorizar antes de devolver** | Toda leitura passa por `autorizar` com `compartimento_id`; busca vetorial e textual filtram **antes** de buscar (R8) |
| 2 | **Prefixo sem dado de Caso** | As camadas 1 a 4 do prompt (02, 2.3) vão ao cache do provedor e **nunca** carregam fato de Caso; ele só entra na camada 6 (sessão), para membro |
| 3 | **Transcript no compartimento** | Só membros leem. **Muda o 02, 12.4** ("Administrador lê qualquer sessão"): em Caso restrito o Administrador vê **quem acessou e quando**, não o conteúdo (JU-01, 6.5) |
| 4 | **Consolidador por compartimento** | A consolidação diária (02, 5.4) roda uma vez por compartimento; nunca sobe fato do Caso para o setor |
| 5 | **Resumo e notificação** | Só "há novidade no Caso X", a membros; nunca o conteúdo em canal externo (JU-01, 6.2) |
| 6 | **Passagem de trabalho** | `integrante.resolver_destinatario` só devolve membro. Se o responsável do setor **não é membro**, a tarefa **não** cai no Gestor nem no Administrador (como no 02, 8.1): o responsável do Caso é avisado, sem conteúdo |
| 7 | **Filhos herdam** | O filho (até 5, 02, 4.4) herda o compartimento e nunca o amplia |

**Sócio:** o sócio não é membro automático (regra unificada 1). Pede acesso com motivo; o acesso fica registrado e os membros são avisados.

### 4.3 IA desligada: Caso sem termo e segredo de justiça

Dois casos em que o integrante **não lê o conteúdo**: `ia_permitida = falso` (cliente sem termo ou que recusou; JU-01, 3.3) e **segredo de justiça**, desligado por padrão (JU-04, pergunta 5). Aí o time continua só com regra: conta Prazo, alerta, agenda, cria tarefas, cuida de honorários, e classifica a Comunicação pela **lista fechada de atos que sempre geram prazo** (JU-03, 2.8), sem mandar o teor a modelo; o que a lista não reconhece sobe como "pode ter prazo, confira". Não faz minuta, resumo de autos, pesquisa sobre fatos do Caso nem tradução de Andamento por IA. A Peça é redigida por pessoa; o log registra "sem IA".

### 4.4 O que o aprendizado do time nunca faz

Opção B com A como piso (JU-04, 5.1): o que o time aprende **melhora só aquele escritório**. **Não vale** o 02, 14.2 (cartão editado vira caso de benchmark): cartão de Caso real nunca vira caso global. A avaliação usa contadores **sem texto**, dentro do escritório; os que saem (assunto, tipo de erro) só após o parecer de ética (JU-04, pergunta 3). A otimização automática lê só o benchmark de casos sintéticos de advogados do grupo.

### 4.5 Retenção

Como no JU-04 (5.4): log técnico longo e sem conteúdo; transcript por 90 dias, com a opção **"não guardar conteúdo"**; versões de Peça sem o prompt; exportação e exclusão no fim do contrato **[prazo a confirmar]**. Caso restrito segue a mesma política, dentro do compartimento (pergunta 3).

---

## 5. Filas, jobs e gatilhos

### 5.1 O ciclo

O ciclo do 02 (4.1) vale: **checagem sem modelo** primeiro (custa zero), depois acordar, carregar, raciocinar, agir, registrar, dormir. No Jurídico, **a maior parte do trabalho da Controladoria é regra** (contar, alertar, conciliar, conferir) e nem acorda modelo.

### 5.2 Gatilhos por evento

Parte vem do JU-01 (7.3); o resto é proposta. O destinatário resolve como no 02 (8.1), com a trava de Caso restrito (4.2, amarra 6). Recusa com comentário vira memória **privada ou do Caso**, nunca global.

| Evento | Integrante | O que faz | Limite |
| --- | --- | --- | --- |
| `comunicacao.receber` | Controladoria | Vincula, classifica, propõe Prazo e tarefa; agrupa o lote do dia | Não confirma fatal, não dá ciência |
| `ciencia.pendente_vencer_em_3_dias` (tácita) | Controladoria | Cartão de ciência com os dois cenários de data; reaviso em D-1 | Cartão ao titular; expira na véspera |
| `prazo.vencer_em_5_dias`, `_em_3_dias`, `_em_1_dia`, `.vencer_hoje` | Setor do Caso | Confere a Peça pronta, cobra o revisor; a escada é regra | `urgente` em D-1 e no dia; nunca agrupado |
| `prazo.vencer_sem_cumprimento` | Controladoria | Alerta urgente a todos os responsáveis; rascunho de pedido de devolução se há justa causa (JUR-052) | Só rascunho |
| `peca.enviar_revisao` | Consultor (conferência de citações) | Roda a verificação em camadas; devolve o resultado à Peça | Bloqueia se houver citação não verificada (seção 7) |
| `audiencia.designar` | Secretaria e Audiências | Agenda, tarefa de preparo, aviso ao cliente (cartão) | Cliente só com liberação |
| `captura.fonte.parar`, `captura.fonte.lacuna` | Controladoria | Avisa sócio e controladoria, urgente; sugere recaptura | Só avisa (FX-001) |
| `processo.transitar` | Financeiro de honorários | Avisa que há evento gerador de êxito ou sucumbência | Cartão; confirmar é do advogado |

### 5.3 Jobs agendados

Horários são **proposta** a validar com a advogada; todos têm checagem sem modelo (02, 7.1) e jobs não criam jobs.

| Integrante | Job | Agenda | Checagem sem modelo |
| --- | --- | --- | --- |
| Controladoria | Coleta do DJEN (`fora_do_horario_ok`) | Duas vezes ao dia | Inscrição monitorada ativa |
| Controladoria | Conciliação Andamento × Comunicação (JUR-051) | Diário | Intimação no Andamento sem Comunicação |
| Controladoria | **Dupla checagem** de fatais e publicações sem tratamento (JUR-048) | Diário | Fatal em 7 dias sem tarefa; Comunicação parada há 3 dias úteis |
| Controladoria | Saúde da captura | Cada leitura e diário | Última leitura há mais de 26 h |
| Consultor | Vigilância por módulo ativo | Diário | Norma nova que casa com Casos ativos |
| Secretaria | Audiências sem preparo | Diário | Audiência em 3 dias sem tarefa |

### 5.4 Silêncio, prioridade e anti-ruído

As prioridades do 02 (7.4) valem, com três trocas:

1. **Prazo fatal em D-1 e no dia é `urgente` e nunca é rebaixado nem agrupado** em resumo (JU-03, 8.1). A regra de rebaixar o integrante com mais de 20% de urgentes ignoradas **não se aplica**; no lugar dela, a urgente ignorada **escala**.
2. **Escalonamento** do cartão sem resposta, no modelo do BPO (adendo 23 do 02): aprovador, lembrete, substituto, alerta ao sócio; nunca executa por conta própria. Ciência tem expiração na véspera da tácita.
3. **Nenhuma tela diz "nada novo" sem a idade da última leitura** (JU-02, J5).

### 5.5 Primeira semana e modo sombra

Na **primeira semana de cada escritório** a lista do Domicílio roda com aprovação do gestor (regra unificada 4). No **modo sombra** (regra unificada 9) a Controladoria calcula em silêncio os prazos reais de uma advogada, sem alerta real; divergência vira caso do gabarito (JU-03, 2.9; duração: pergunta 11). Integrante criado pelo usuário passa 14 dias em observação (02, 11.1). **Antes de casos reais:** parecer de advogado especializado e zero vazamento na seção 10.

### 5.6 Limites por execução

Os do 02 (4.7): 25 passos por evento, 60 por job; 5 min por evento, 20 por job; 60 mil tokens por evento, 300 mil por job; 5 filhos. **Ajuste:** se a Controladoria estourar o limite, o que sobrou fica visível como **"sem tratamento"**, com alerta humano (JU-03, 3.4); nunca some.

---

## 6. Limites, cota e custo por integrante

### 6.1 O que vale do 02 e do Estudo

Por usuário, janela de **5 horas** e de **7 dias** (Essencial 25 e 100 UU; Operação 60 e 300; Intensivo 100 e 500; **1 UU = 10 mil tokens**, R$ 0,0882 no preço médio; Estudo 6.8); por integrante, 200 UU por dia; por escritório, cota mensal. Ao esgotar, jobs e eventos pausam e o chat segue em modelo barato. **Integrante proativo só roda se o dono tem Operação, Intensivo ou bolsa.** O Colaborador vê só a porcentagem; Gestor e Administrador veem UU por usuário, integrante e cliente.

### 6.2 Cota ponderada pelo modelo

Aprovada no JU-04 (pergunta 7): a UU deixa de contar igual qualquer modelo. **Hipótese de partida:** 1 UU por 10 mil tokens do modelo principal e por **100 mil** do modelo barato. O achado de JU-04 (7.1): um resumo de autos de 300 páginas gasta 25 a 40 UU (mais que a janela de 5 horas do Essencial) e custa centavos (R$ 0,40 a R$ 0,70 pelo custo real).

Exemplos, no **melhor caso** (tudo em modelo barato): resumo de autos de 300 páginas, de 25 a 40 UU para 2,5 a 4; classificar uma Comunicação (15 mil tokens), de 1,5 para 0,15. Minuta de Peça fica quase igual (a redação usa o modelo principal). Cálculo próprio, a medir: o ganho real fica entre os dois extremos.

### 6.3 O que fica fora da cota, e a reserva de prazos

Risco central: **a cota esgotar e a Controladoria parar.** Prazo perdido não se refaz. Desenho em três camadas:

| Camada | Regra |
| --- | --- |
| **Sem modelo, sempre roda** | Captura, vínculo exato, contagem, calendário, escada, dupla checagem, conciliação, saúde: custo de IA zero; **não dependem da cota nem de o dono ter plano de IA** |
| **Conferência de citações e busca de norma sem IA** | Fora da franquia em qualquer plano (JU-04, perguntas 6 e 11): é segurança |
| **Reserva de prazos para a parte com IA** | Classificar o ato e ler o número de dias usam modelo. Proposta: reserva do escritório por dia (**30 UU, a medir**), em modelo barato, que o consumo de resumo e minuta não pode tocar. Esgotada, a Comunicação sobe como **"pode ter prazo, classificar à mão"**: o alarme falso custa um clique, o falso negativo, um prazo (JU-03, 2.8) |

### 6.4 Custo por integrante (entrada para o JU-12)

**Ilustração de ordem de grandeza**, para um escritório pequeno, a medir no piloto. Fontes: tokens por execução do 02 (13) e do JU-04 (7.1); **volumes são premissa nossa**, exceto as 200 publicações por mês e a conta de R$ 0,0882 por UU, já usadas em JU-03 (6.1) e no Estudo.

| Integrante | Trabalho por mês (premissa) | UU por unidade | UU por mês | R$ no preço médio |
| --- | --- | --- | ---: | ---: |
| Controladoria | Classificar 200 Comunicações | 1,5 | 300 | 26 |
| Controladoria | Resumir autos de 10 Processos novos | 25 a 40 | 250 a 400 | 22 a 35 |
| Contencioso | 8 minutas de Peça | 8 a 16 | 64 a 128 | 5,6 a 11,3 |
| Contencioso | Conferência de citações das 8 Peças (**fora da cota**) | 0,4 a 0,8 | 3 a 6 | 0,3 a 0,6 |
| Consultor | 30 perguntas e 6 pesquisas de jurisprudência | 2 a 4 e 4 a 8 | 84 a 168 | 7,4 a 14,8 |
| Consultivo | 4 revisões de Contrato | 4 a 7 | 16 a 28 | 1,4 a 2,5 |
| Atendimento | 100 mensagens de Andamento ao cliente | 1,5 | 150 | 13,2 |
| Secretaria | 30 eventos de agenda e Audiência | 1,5 | 45 | 4,0 |
| Financeiro | 40 eventos geradores e cobranças | 1,5 | 60 | 5,3 |
| Todos | Consolidação de memória (8 integrantes, 21 dias, 1 UU) | 1 | 168 | 14,8 |
| **Total** | | | **cerca de 1.140 a 1.450** | **cerca de 100 a 128** |

Leituras: (1) o time inteiro gasta cerca de **uma IA Operação** por mês (1.290 UU), repartida entre os donos; (2) **a Controladoria sozinha (550 a 700 UU) estoura o IA Essencial (430 UU)** e, com a cota ponderada, no melhor caso, cai a cerca de 55 a 70 UU: é o argumento para ponderar e reservar; (3) em reais são dezenas por escritório: **o gargalo é a cota, não o dinheiro**; (4) a tabela não inclui o uso humano do Geral nem a compactação de sessões longas (02, 13).

**Entradas para o JU-12:** (a) a tabela como faixa inicial, medindo UU **por integrante, por tipo de tarefa e por Caso** (o custo de IA entra na rentabilidade do JU-05; só números, mesmo em Caso restrito); (b) custo fixo da reserva de prazos; (c) infraestrutura dos testes com canários (seção 10); (d) recomendação **[hipótese]**: quem opera a Controladoria tem IA Operação ou o escritório tem bolsa; (e) o que **não** se cobra nem limita: conferência de citações, regra de prazo e busca de norma sem IA.

---

## 7. O fluxo da Peça: supervisão, aprovação em dupla, bloqueio e log

### 7.1 Ponta a ponta

Estados da Peça (JU-01, 4.8): `rascunho` → `em_revisao` → `revisada` → `pronta_para_protocolo` → `protocolada` → `comprovada`; `devolvida`, `cancelada`.

| # | Quem | O que acontece | Humano obrigatório |
| --- | --- | --- | --- |
| 1 | Controladoria | Com o Prazo confirmado, cria a tarefa da Peça: modelo, checklist, documentos (JUR-045), data interna | Advogado, se fatal |
| 2 | Contencioso ou de área | Rascunha; cada fato com **origem** (autos, Caso ou "informado pelo advogado") | |
| 3 | Consultor | **Conferência de citações** em camadas (existe, órgão e data, vigente, hierarquia, sustenta a tese, fatos comparáveis; JU-04, 6.1) e recálculo de prazos e valores. **Bloqueio** se houver citação não verificada (7.3) | Advogado corrige |
| 4 | **Revisor** (advogado inscrito) | Lê a Peça **inteira**, resolve avisos, preenche o checklist (citações, pedidos, anexos, assinatura, preparo); em peça crítica lê também a segunda opinião do Consultor | **Sim** (Rec. 3.7) |
| 5 | **Responsável** (advogado inscrito, outro que o revisor) | Cartão **Liberar para protocolo** (7.4) | **Sim** (dupla) |
| 6 | **Advogado** | Protocola no tribunal com o A3 dele e registra o recibo; **a plataforma não protocola nem guarda o A3** | **Só pessoa** |
| 7 | Controladoria | Confere a juntada e dá baixa no Prazo | |

### 7.2 Aprovação em dupla

**Dois papéis, duas assinaturas.** O **revisor** atesta que leu e conferiu; o **responsável** libera. Onde houver dois advogados, não podem ser a mesma pessoa. Reaproveita a **dupla aprovação** do cartão do BPO (Fundações, A7 do 10): "quem digita não aprova, quem revisa não libera".

| Peça | Exigência |
| --- | --- |
| **Peça crítica** (`risco = true`: contestação, recursos, tutela de urgência, parecer a cliente, prazo fatal; JU-04, 4.4) | **Dupla:** revisor e responsável, dois advogados inscritos distintos; segunda opinião; conferência de citações |
| **Peça de rotina** (manifestação simples, juntada) | Uma revisão assinada de advogado inscrito; cartão em lote ao responsável |
| **Peça de estagiário** | Revisor é o supervisor; nunca vai a protocolo sem advogado; estagiário nunca aprova |
| **Um só advogado** | Dois atos no mesmo cartão (revisar; liberar), checklist completo no segundo; **recontagem independente do Prazo**, confirmação do advogado e **segundo aviso no dia seguinte** (regra unificada 2) |

Fundamento: Rec. 3.6 e 3.7 e a decisão da OAB/SP sobre o sócio **[a confirmar nos textos oficiais]**. A **dupla em peça crítica é escolha de produto**, não exigência normativa verificada; o sócio pode estendê-la a todas as Peças (pergunta 4).

### 7.3 Bloqueio de Peça com citação não verificada

Citação inexistente já rendeu multa por má-fé e ofício à OAB (J5, 2.2, notícias não conferidas; CPC, art. 77 **[a confirmar]**). Cada citação tem um estado:

| Estado | Efeito |
| --- | --- |
| **Conferida** | Segue |
| **Conferida com aviso** (divergência entre tribunais, afetada, modulada) | Segue com marca no cartão; o advogado lê |
| **Fora da cobertura da base** | **Bloqueia.** O advogado confere na fonte oficial, anexa o link e **atesta com o nome dele** (vai ao log), ou remove |
| **Não encontrada**; **superada apresentada como vigente**; **não sustenta a tese** | **Bloqueia, sem atestado**: corrigir ou remover |

Com bloqueio, ficam desabilitados **enviar para revisão final, liberar para protocolo e exportar o PDF final**. Bloqueiam também: fato sem origem; Prazo sem memória de cálculo; valor que não veio do motor de cálculo; Mandato sem poder especial para Peça que transige ou desiste (JU-01, 4.7); Caso sem termo de IA (bloqueio brando, com atestado do advogado). Peça de Caso sem IA passa pelo mesmo checklist humano.

### 7.4 Cartão de aprovação da Peça

Exemplo ilustrativo com dados fictícios (campos de JU-01 e do cartão das Fundações, 6.4):

```
LIBERAR PEÇA PARA PROTOCOLO                         expira em 24/11 (véspera)
Contestação · Processo 0000000-00.0000.0.00.0000 · Caso 2026-014 (restrito)
Prazo fatal: 02/12/2026 · data interna: 25/11/2026   [ver a conta]  versão 3
Feita por: Contencioso (de Ana)    Revisada por: Ana, OAB/UF, em 23/11 14:10
Citações: 14 conferidas · 1 conferida com aviso (divergência) · 0 bloqueadas
Fatos: 22 com origem nos autos · 2 "informado pelo advogado"
Valores: 3, todos do motor de cálculo
Termo de IA do cliente: aceito em 05/10 · Peça com IA: sim · Trechos mudados pela pessoa: 31%
Segunda opinião: confere
[ Aprovar como responsável ]  [ Devolver à revisão ]  [ Recusar ]
O sistema não protocola. Depois de aprovar, protocole no tribunal e registre o recibo.
```

**Aprovar** só aparece a advogado inscrito que **não** foi o revisor (havendo dois); o cartão expira na véspera do prazo e avisa (Fundações, 6.4); cartão de Caso restrito só chega a membro; aprovar executa de verdade e grava o nome de quem aprovou (adendo 22 do 02). Cartões novos além dos do JU-02 (5.3): **Citação fora da cobertura: atestar**, **Promover atividade a "faz sozinho"** (seção 8) e **Pedir acesso a Caso restrito**.

### 7.5 Log de revisão (JUR-234)

É a defesa do escritório e o instrumento de monitoramento do sócio: **só inserção, com hash em cadeia** (Fundações 5.2; JU-01, 6.5). Cada Peça guarda: quem pediu a minuta, o integrante, a **versão do programa operacional** e do motor; as fontes e a **versão de cada citação** (data considerada, estado e força do precedente), para refazer a conferência; a origem de cada fato; cada versão (autor pessoa, integrante ou modelo; `gerada_com_ia`; **hash**; trechos mudados), que prova a revisão integral; revisor (OAB, UF), horário e checklist, e o responsável que liberou; os atestados de citação fora da cobertura, com link e nome; e a versão e a data do termo de IA do cliente (Rec. 4.3). **Fica de fora** o prompt (JU-04, 5.4). O sócio exporta o **relatório de uso de IA** da Peça, do Caso ou do mês; em Caso restrito o Administrador vê **quem acessou**, não o conteúdo. Retenção: a da vida do Processo **[a confirmar]**.

---

## 8. Promoção para "faz sozinho"

### 8.1 O critério e os ajustes

Do 02 (3.3): a atividade é **reversível**; nos últimos 90 dias, **30 cartões** dela no escritório com **95% aprovados sem edição**; então o integrante **pergunta uma vez** ("posso passar a fazer X sozinho?"). "Sim" libera para sempre no escritório, com quem e quando registrados; "não" silencia por 90 dias; o responsável rebaixa quando quiser. No Jurídico:

1. A pergunta vai ao **sócio ou ao advogado responsável**, porque a decisão toca responsabilidade profissional.
2. Trinta cartões em 90 dias é **raro em escritório pequeno**: sem massa crítica, não pergunta (aceito).
3. **Um erro de prazo** atribuível ao integrante rebaixa a atividade a cartão e abre incidente.
4. A promoção vale pelo escritório, mas **nunca** para Caso restrito nem para Caso sem termo de IA.

### 8.2 O que nunca sobe

`comunicacao.ciencia.registrar`; `prazo.confirmar` e `prazo.conferir`; `peca.registrar_protocolo` e `peca.aprovar_para_protocolo`; `honorario.repassar` e `honorario.reter`; `conflito.decidir`, `caso.restringir`, `mandato.revogar` e afins. O JU-01 (6.3) já fixa ciência, fatal e protocolo como `nao_promovivel`; o resto é **proposta** (ajuste ao 02 e às Fundações, 11.1).

### 8.3 Candidatas

| Atividade | Condição |
| --- | --- |
| **Traduzir Andamento relevante por modelo de texto aprovado** (JUR-057, parte de avisar o cliente) | Modelo aprovado por tipo; cliente com termo de IA; JU-02 (pergunta 8) já admite envio automático só nesse caso |
| **Vincular publicação ao Processo com número "sugerido"** | JUR-035 já é "faz sozinho" no vínculo exato; a candidata é o número truncado (JU-03, 2.8) |
| Lembrete de Audiência e de renovação de Mandato por modelo; régua de cobrança de parcela vencida | Reversíveis; valor igual ao do Contrato de honorários; **reajuste é sempre cartão** (adendo 21 do 02) |

---

## 9. Convivência com o time do pacote Contábil (DA-02.1)

### 9.1 Uma assinatura, um time

Valem as regras do DA-02.1: **um Time de agentes**, com integrantes padrão **por setor de cada pacote ativo**; Geral e Consultor únicos; plano de IA do usuário, não do pacote; um Timesheet; uma lista de tarefas com filtro de pacote. **Compartilhados:** Geral, Atendimento, Financeiro do escritório, assistente de ajuda, Timesheet, cadastro, WhatsApp por setor, agenda, app do cliente. **Separados:** Societário, Fiscal, Notas, DP e Contábil de um lado; Controladoria, Contencioso, Consultivo, de área e Secretaria do outro; e a parte contábil e a parte jurídica do perfil do cliente.

### 9.2 Quem lê o quê

**O integrante do Contábil nunca lê dado do Jurídico, e vice-versa** (JU-04, 5.6: "o contador não lê o sigilo do advogado"). Mesmo que uma pessoa tenha setores dos dois pacotes, a leitura segue o **setor e o pacote da sessão**.

| Situação | Regra |
| --- | --- |
| **Consultor** | Um por usuário, com dois plug-ins (Legal contábil e jurídico); o roteador escolhe pelo serviço do cliente; **escopo e memória separados por pacote**: o Consultor de um contador não lê Caso |
| **Tarefa ou mensagem entre pacotes** | Usa `bola`, `visibilidade` e `bloqueada_por` (Fundações, A7 do 10) e **descrição neutra** ("cliente X precisa de certificado A1 válido para o Domicílio"), nunca o Caso; o filtro de escopo do destinatário (02, 8.3) remove referência a Caso |
| **Caso restrito** | Não gera tarefa nem mensagem em outro pacote com texto do Caso; só tarefa neutra **criada por pessoa** (pergunta 10) |
| **Financeiro único** | Uma fatura por cliente, com linha de Honorário-Jurídico e linha contábil (DA-02.1, regra 5); linha de Caso restrito com **descrição neutra** **[a confirmar com a advogada]** |
| **Cota de IA** | Uma só por usuário; o consumo do Contábil não toca a **reserva de prazos** (6.3) |

### 9.3 Onde o desenho evita duplicar

O catálogo jurídico tem `JUR-109` (caixa do e-CAC e DTE) e `JUR-112` (certidões), que o **Fiscal do Contábil já faz** (FIS-005; ciência tácita, nunca abre a mensagem). Regra do DA-02.1: **duplicar função em dois pacotes é erro de desenho.** Proposta: o conector e o integrante ficam na **plataforma**; o pacote Jurídico só recebe o evento e abre tarefa no setor Tributário. Se o escritório tem **só** o Jurídico, usa o mesmo conector da plataforma, sem montar outro (ajuste a JU-01 e 08, 11.1). O contato contrário também existe: **cadastrar o CNPJ do cliente no Domicílio Judicial** vira tarefa do Contábil (Síntese, seção 2).

### 9.4 Exemplo ponta a ponta

Empresa X tem Contábil e Jurídico; o Caso é `normal`. Datas do G01 do JU-03 (calculadas pela sessão, **não validadas por advogado**); nomes fictícios.

| # | Quem | O que |
| --- | --- | --- |
| 1 | Controladoria (de Beatriz) | Recebe a publicação do DJEN; vincula pelo número exato, classifica pela lista fechada e propõe o Prazo de contestação: 15 dias úteis, disponibilização 09/11/2026, vencimento 02/12/2026, com memória de cálculo |
| 2 | Sócio (pessoa) | Lê a conta e confirma o fatal (só advogado inscrito confirma) |
| 3 | Controladoria | Cria a tarefa da Peça e uma tarefa **neutra** ao Contábil ("juntar balanço da Empresa X"); o Contábil (de Beltrano) junta e **não vê o Caso** |
| 4 | Contencioso (de Ana) | Rascunha com fatos de origem conhecida; o Consultor acha 13 citações conferidas e 1 **não encontrada**: **bloqueio** |
| 5 | Ana (pessoa) | Remove a citação, relê tudo e marca revisada |
| 6 | Sócio (pessoa) | Cartão **Liberar para protocolo** (peça crítica: dupla); aprova; protocola com o A3 dele e registra o recibo |
| 7 | Controladoria | Confere a juntada, baixa o Prazo e fecha o log de revisão |

Cadeia de profundidade 3; nada irreversível sem pessoa; nenhum prazo ou valor saiu do modelo.

---

## 10. Segurança e testes de vazamento

### 10.1 Riscos próprios do jurídico

(1) **Texto hostil em autos:** peça adversa, decisão e PDF de terceiro são **dado**, nunca instrução (02, 12.1; JU-02, H6); autos longos passam por **filho leitor sem ferramenta de efeito**. (2) **Efeito fantasma:** "protocolei", "dei ciência", "confirmei o prazo" só aparecem com registro de pessoa; senão a verificação final troca por "não consegui fazer X" (`integrante.afirmacao_sem_origem`). (3) **Cadeia entre integrantes** de profundidade máxima 4 (02, 8.5). (4) **Falha silenciosa:** três falhas seguidas pausam o job e avisam dono e Administrador; robô parado é evento (JU-02, J5).

### 10.2 Testes

Somam-se aos das Fundações (11), de JU-01 (6.5) e de JU-04 (5.6). **Rodam a cada mudança**; os de canário também toda semana. Um teste que falha **bloqueia a entrega**.

| # | Teste | Passa quando |
| --- | --- | --- |
| V1 | **Entre Casos restritos:** usuário de fora e integrante dele pedem ao Caso restrito por chat, busca vetorial e textual, memória, resumo, notificação e transcript | Nada volta; "não encontrei", sem dizer se existe |
| V2 | **Passagem de trabalho** com responsável não-membro, e **filho** do integrante | Tarefa não cai no Gestor nem no Administrador; filho não amplia compartimento, ferramenta nem nível |
| V3 | **Administrador e suporte** em Caso restrito | Veem quem acessou e quando, nunca o conteúdo; `suporte.diagnosticar` não lê |
| V4 | **Entre escritórios, com canários** plantados no A e procurados no B, nos caches de prefixo e semântico, no benchmark, nos prompts e nos artefatos de ajuste | Zero ocorrência |
| V5 | **Entre pacotes:** integrante e Consultor do Contábil tentam ler Caso, Processo e Honorário-Jurídico | Zero |
| V6 | `ia_permitida = falso` e segredo de justiça; gravar fato identificável de Caso na memória do escritório | Integrante não lê o conteúdo, só regra roda; gravação recusada |
| V7 | **Ciência sem cartão**, também por integrante "promovido" | Recusada |
| V8 | **Dupla aprovação:** mesmo usuário revisa e libera; estagiário aprova | Recusado onde houver dois advogados; estagiário sempre recusado |
| V9 | **Citação plantada** (inexistente, superada ou que não sustenta) em Peça de teste | Peça bloqueada; PDF final não exporta |
| V10 | **Cota esgotada** com Comunicação nova; **cartão de prazo** expirado | A regra roda e o que a IA não classificou sobe como "pode ter prazo"; expirado avisa e não executa |
| V11 | **Efeito fantasma**; contadores de avaliação | Frase de ato sem registro é removida; nada com texto de Caso sai do escritório |

**Gate (JU-04, E5):** nenhum dado real de cliente antes de **zero vazamento** em V1 a V6; parecer de advogado especializado e modo sombra antes do primeiro alerta real (regra unificada 9).

---

## 11. Ajustes pedidos, ordem de construção e perguntas

### 11.1 Ajustes pedidos a outros documentos

| Onde | Ajuste |
| --- | --- |
| **02** | Quarta camada de memória, a do Caso; 12.4: Administrador não lê transcript de Caso restrito; 8.1: fallback para Gestor e Administrador não vale para Caso restrito; 14.2: cartão de Caso não vira benchmark; 3.3: pergunta de promoção ao sócio, erro de prazo rebaixa, lista "nunca" de 8.2; 7.4: rebaixar urgente ignorada não vale para fatal e ciência; 12.2: reserva de prazos e trilha sem modelo fora da pausa por cota; integrantes e gatilhos da seção 5 |
| **Fundações** | `nao_promovivel` e `condicao_pessoa` nas ferramentas de 8.2; dupla aprovação do cartão em `peca.aprovar_para_protocolo` (revisor distinto de responsável); `compartimento_id` na Sessão, Memória e Item de fila; `caso_id` na sessão de trabalho; cache de prefixo sem dado de Caso |
| **JU-01** | Dono das 13 atividades de 2.2; Secretaria e Audiências no setor `gestao_atendimento`; Peça com `liberado_por` distinto de `revisor_id`, estado e atestado de citação; retirar `JUR-109` e `112` quando o Fiscal já os cobre (9.3) |
| **JU-02, JU-03, JU-04** | JU-02: lista de 5.1 com os donos de 2.2, cartões de 7.4, relatório de uso de IA sem placar. JU-03: reserva de prazos em 2.8, duração do modo sombra. JU-04: estados da citação (7.3) na saída de `legal.consultar(conferir)`, cota ponderada com reserva |
| **JU-05, JU-12, Estudo** | Custo de IA por Caso na rentabilidade; entradas de 6.4 (UU por integrante, reserva, plano mínimo da Controladoria) |
| **07, 06, JU-09, JU-10** | 07: sem benchmark de cartões de escritório; Consultor com dois plug-ins. 06: modo cliente com termo e escopo liberado pelo advogado. JU-09 (a escrever): Audiência, Perícia e correspondente da Secretaria. JU-10 (a escrever): política de IA, retenção, treino do usuário |

### 11.2 Ordem de construção

**Nada é desenvolvido agora.** A ordem vale depois do BPO. O que não é código (parecer, programas operacionais, política-modelo) pode andar antes.

| Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- |
| **TJ0** Sem código | Programas operacionais (seções 2 a 7), lista "nunca", política-modelo, parecer de ética | Nada | A advogada da família lê programas e lista "nunca"; parecer registrado |
| **TJ1** Executor e Controladoria só com regra | Fila, checagem sem modelo, jobs de 5.3 sem IA; escada, dupla checagem, saúde | 02 T1; JU-01 J1 e J2; JU-03 E1 e E2 | Checagem vazia custa zero; prazo e escada sem modelo |
| **TJ2** Memória por Caso e escopo | Quatro camadas, compartimento nos integrantes, amarras de 4.2 | TJ1; 02 T5 | V1 a V3 e V6 com zero vazamento, **antes de qualquer dado real** |
| **TJ3** Controladoria com IA e modo sombra | Classificação e proposta; reserva de prazos; cota ponderada | TJ1; JU-03 E4; JU-04 E4 | Gabarito de classificação (zero falso negativo); V10; modo sombra |
| **TJ4** Cartões e `nao_promovivel` | Ciência, fatal, liberação, atestado; escalonamento | TJ3; Fundações 6.4; JU-03 E5 | V7; 1ª semana com aprovação do gestor |
| **TJ5** Contencioso e fluxo da Peça | Minuta, conferência, bloqueio, dupla, log | TJ4; JU-04 E10; JU-02 T9 | V8, V9, V11; Peça de teste da advogada |
| **TJ6** Consultor jurídico | Perguntar, pesquisa, vigilância, segunda opinião | JU-04 E8 | Benchmark com a advogada; piloto fechado |
| **TJ7** Atendimento e Secretaria | Andamento traduzido, agenda, Mandato, Audiência | JU-02 T10; 06; JU-09 | Texto de modelo aprovado pela advogada |
| **TJ8** Financeiro de honorários | Eventos geradores, régua, conta de terceiros (só registro) | JU-05; 09 | Contador confere os tributos |
| **TJ9** Integrantes de área e Consultivo | Um por onda de J9 | JU-04 E9 e E14 | Gate por módulo |
| **TJ10** Convivência e avaliação | Testes V4, V5, V11; painel de métricas; limites | TJ2, TJ4; 02 T11 | Zero vazamento entre pacotes e escritórios |

### 11.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | **Secretaria e Audiências** é integrante próprio? | Sim, no setor Gestão e Atendimento, ligado só com Audiências; detalhe no JU-09 | "A agenda e as audiências ganham um ajudante só delas?" |
| 2 | **Integrantes de área** (Trabalhista, Família etc.) | Ligam só com o módulo de lei ativo, com o programa do Contencioso | "O ajudante de cada área só aparece quando você contrata o módulo dela?" |
| 3 | **Memória do Caso** e transcript de Caso restrito | Quarta camada de 4.000 caracteres no compartimento; o Administrador vê quem acessou, não o conteúdo; "não guardar conteúdo" opcional | "O ajudante lembra de cada caso num caderno trancado que nem o administrador abre?" |
| 4 | **Dupla aprovação** | Obrigatória em peça crítica e prazo fatal; peça de rotina tem uma revisão assinada | "Peças importantes pedem dois advogados; as simples, um. Serve?" |
| 5 | **Um só advogado** na dupla | Dois atos no cartão, recontagem independente e segundo aviso no dia seguinte | "Com um só advogado, ele revisa e libera em dois passos e o sistema confere por conta própria?" |
| 6 | **Citação fora da cobertura** da base | Libera com atestado do advogado, link e nome; "não encontrada", "superada" e "não sustenta" nunca liberam | "Se o sistema não tem a fonte, o advogado confere na oficial e assume; se a citação não existe, trava?" |
| 7 | Quem responde à **promoção** "faz sozinho" | O sócio ou o advogado responsável; 30 cartões, 95%, 90 dias; erro de prazo rebaixa; lista "nunca" de 8.2 | "Quem decide que o ajudante pode parar de pedir licença é o sócio?" |
| 8 | **Reserva de prazos** com a cota de IA esgotada | Regra roda sempre; reserva de 30 UU por dia por escritório (a medir); sem reserva, "pode ter prazo, classificar à mão" | "Se a cota acabar, os prazos continuam sendo contados e avisados?" |
| 9 | **Consultor** com dois plug-ins | Um por usuário; escopo e memória separados por pacote | "O mesmo consultor serve à contabilidade e ao jurídico sem misturar os assuntos?" |
| 10 | **Caso restrito** e outros pacotes | Só tarefa neutra, criada por pessoa | "Se o caso é sigiloso, quem pede um documento à contabilidade escreve de forma neutra?" |
| 11 | **Modo sombra** do time | 4 semanas de cálculo em silêncio sobre os prazos reais de uma advogada **[a definir com ela]** | "Quantas semanas o sistema calcula em silêncio antes de avisar de verdade?" |
| 12 | **Política de IA, relatório e aprendizado** | Modelo de política e relatório mensal por Peça ao sócio, sem placar; cartões editados de Caso real nunca viram caso global | "O relatório de uso de IA chega sem ranking, e o que o escritório corrige fica nele?" |
| 13 | **Plano mínimo** de quem opera a Controladoria | IA Operação, ou bolsa do escritório; o Essencial não basta | "Quem cuida dos prazos precisa de um plano de IA mais forte que o básico?" |

---

## Ressalvas

- **Nada foi medido.** Volumes (200 Comunicações, 10 resumos, 8 minutas por mês), UU e custos de 6.4, reserva de 30 UU, ponderação de 100 mil tokens, limites de memória e horários de jobs são **premissas nossas**; a ponderação é **hipótese** do JU-04 e o ganho real depende de quanto do trabalho exige o modelo principal.
- **Normas não relidas.** A Rec. CFOAB 001/2024 vem da leitura da J5; a **decisão da OAB/SP**, a **Res. CFOAB 16/26**, o Estatuto (art. 1º e 34, VII), o Código de Ética, o CPC (art. 77) e o Provimento 205/2021 estão por notícia ou resumo de busca **[a confirmar nos textos oficiais]**; sanções por citação falsa vêm de notícias não conferidas.
- **A dupla aprovação em peça crítica é escolha de produto**, não exigência verificada; um advogado de ética deve opinar antes de a vendermos como "conformidade com a OAB" (a Res. 16/26 proíbe sugerir aval da OAB).
- A divisão dos 48 "faz sozinho" por integrante e as 13 atribuições novas são proposta (a vista por setor do JU-01 é a referência). **Secretaria e Audiências** depende da pergunta 1 e do JU-09; o escopo do e-CAC no Fiscal (9.3) é do 08 **[a confirmar]**.
- Os exemplos (7.4, 9.4) usam **dados fictícios**; as datas vêm do gabarito do JU-03, **não validadas por advogado**. Os testes V1 a V11 são especificação: nenhum foi escrito ou executado. Antes de dado real: parecer de advogado especializado (sigilo, LGPD, termos, responsabilidade, seguro) e modo sombra.

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].
