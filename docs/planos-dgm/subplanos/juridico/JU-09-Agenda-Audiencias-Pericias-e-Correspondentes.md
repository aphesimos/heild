# Subplano JU-09 · Agenda, audiências, perícias, diligências e correspondentes (pacote Jurídico)

**Versão 0.1 · 9/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Pacote de área sobre a plataforma comum (DA-02, DA-02.1). Fontes: [Conferência do pacote Jurídico](../../Conferencia_Pacote_Juridico.md), [Síntese](../../Sintese_Pacote_Juridico.md), [JU-01](JU-01-Modelo-de-Dados-e-Catalogo.md), [JU-02](JU-02-Painel-e-Telas.md), [JU-03](JU-03-Prazos-Comunicacoes-e-Conectores.md), [JU-05](JU-05-Honorarios-Financeiro-e-Preco.md), [Painel (03)](../03-Painel.md), [Timesheet (05)](../05-Timesheet.md), [Conectores (08)](../08-Conectores.md), pesquisa J3 e `atividades-juridico.json` (JUR-017, 065 a 068, 094, 096, 103, 116, 120, 126, 146, 150, 202, 211, 214, 228, 232, 233), J7 (SG-028) e J8 (FX-015). **[a confirmar]** marca o que as fontes não verificaram. **Nada do mercado de correspondentes foi lido em página oficial:** o que se diz dele vem de resumos de busca e de textos de fornecedores (marcado "não verificado").

**Nomes fixos:** Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato, Contrato de honorários (JU-05). **Entidades novas propostas aqui:** Perícia, Diligência, Correspondente, Avaliação. As regras unificadas de 9/11/2026 (caso restrito e sócio, segunda conferência de prazo fatal, margem interna, ciência no Domicílio, parecer e modo sombra antes de casos reais) valem sem mudança.

**Resumo para quem não é advogado.** O escritório vive de datas marcadas por outros: o juiz marca a audiência, nomeia o perito e dá prazo para tudo. Este subplano cuida de quatro coisas. (1) **Uma agenda só**, com prazo, audiência, perícia, visita ao cartório e reunião juntos, avisando conflito e copiando para Google ou Outlook sem vazar segredo. (2) **A audiência do começo ao fim**, até a ata e os prazos novos que nascem do que foi dito. (3) **A perícia**: um laudo que muitas vezes decide o caso, com prazos curtos e um depósito que, se esquecido, perde a prova. (4) **Diligências e correspondentes**: tarefas fora do escritório feitas por alguém da casa ou por um **advogado correspondente** contratado por serviço. Proposta: **começar só com o cadastro de correspondentes do próprio escritório**, com sigilo por ordem e pagamento feito pelo escritório depois de conferir o serviço; marketplace e rede aberta ficam para quando houver prova de que valem o risco.

---

## 1. Escopo e princípios

### 1.1 O que cobre e o que fica em outros documentos

| Dentro | Fica em |
| --- | --- |
| Agenda do advogado e do escritório; conflito; calendário por cliente e por Caso; sincronização com Google e Outlook | Calendário e tarefas: 03; conector `agenda`: 08 (7.7 e 13.5) |
| Ciclo da **Audiência** | Campos básicos: JU-01 4.6; prazos que nascem: JU-03 |
| **Perícia** (nomeação, quesitos, assistente técnico, honorários, laudo, manifestação) | Cálculo e impugnação de cálculo: JU-04; valores: JU-05 |
| **Diligência** (cópia, protocolo, carga, certidão) | Protocolo eletrônico e certificado A3: JU-03 (5) |
| **Correspondente**: cadastro, ordem, relato, avaliação, decisão entre três modelos, repasse, sigilo | Conta a pagar, despesa adiantada, conta de terceiros: JU-05 e 09 |

**Fora (seção 8):** contencioso de massa e departamento jurídico, rede aberta, marketplace próprio, pagamento intermediado, trânsito e rota.

### 1.2 Glossário curto

| Termo | O que é |
| --- | --- |
| **Preposto** | Quem representa a empresa na audiência; na Justiça do Trabalho a falta pode gerar revelia (JUR-094) |
| **Perito** / **assistente técnico** | O perito é do juiz; o assistente é contratado por uma parte para acompanhar e contestar |
| **Quesitos** / **laudo** | Perguntas das partes ao perito / relatório final do perito |
| **Diligência** | Tarefa curta fora do escritório. Não confundir com *due diligence* (auditoria de compra de empresa), que é do consultivo |
| **Correspondente** | Advogado ou escritório de outra cidade contratado por serviço |
| **Substabelecer** | Passar os poderes da procuração a outro advogado, com ou sem reserva (JUR-017) |

### 1.3 Princípios

| # | Princípio | Consequência |
| --- | --- | --- |
| AG1 | **A data do juízo é do juízo.** O sistema nunca remarca nem cancela audiência, perícia ou prazo sozinho | Só Comunicação lida ou pessoa muda; edição no Google ou Outlook vira sugestão |
| AG2 | **Uma agenda só; Google e Outlook são espelho** | Se a sincronização falha, vale a plataforma |
| AG3 | **Sigilo antes de comodidade** | Título neutro fora; Caso restrito sem detalhe (2.4) |
| AG4 | **Ato privativo é da pessoa** (JR1): comparecer pelo cliente, transigir, levantar valor, protocolar e dar ciência | O agente prepara; o correspondente atua só com substabelecimento e poderes |
| AG5 | **O que se diz na audiência pode criar prazo** (decisão proferida em audiência pode contar prazo dali **[a confirmar: CPC art. 1.003 §1º]**) | Relato estruturado no mesmo dia, mesmo se foi correspondente |
| AG6 | **A plataforma não segura dinheiro** (H3; R1 do 09) e **o do cliente não se mistura** (H5) | O escritório paga na própria conta, depois de validar; provisão do cliente sai da Conta do cliente, saldo nunca negativo |
| AG7 | **O correspondente vê só o necessário, por ordem, por tempo limitado** | 6.7 |
| AG8 | **Nada se apaga** (JR8); conflito e prazo de perícia são regra, não IA | Relato, ata, Avaliação e quesitos só crescem; a IA só prepara |
| AG9 | **Preço previsível** (H10) | Sem pedágio por audiência, perícia ou correspondente (9) |

---

## 2. Agenda do escritório e do advogado

### 2.1 O que entra na agenda

| Tipo | Origem | Quem muda a data | Como aparece |
| --- | --- | --- | --- |
| **Prazo** (legal e interno) | Prazo (JU-03) | Motor ou `prazo.corrigir` com motivo; arrastar muda só a data interna | Dia inteiro; fatal com rótulo, não só cor |
| **Audiência** | Audiência (JU-01) | Tribunal (Comunicação) ou advogado, com registro | Hora marcada, fuso do juízo, modalidade |
| **Perícia** (exame) | Perícia (4) | Perito ou juízo | Hora marcada; cliente e assistente convidados |
| **Diligência** | Diligência (5) | Quem pediu | Janela ou hora |
| **Reunião** | Plataforma e Timesheet (GES-050) | Quem organiza | O cliente marca horário pelo app (06 3.7) |
| **Compromisso externo** | Manual ou agenda pessoal | O usuário | "Ocupado", sem título |
| **Ausência** | Timesheet › Equipe (FX-004) | Gestor ou a pessoa | Faixa de dias; pede cobertura |

O calendário do Painel é feito de `tarefa.listar` (03, 4.6). Audiência, Perícia e Diligência geram Tarefas (origem `audiencia`, `pericia`, `diligencia`) **e** um evento de agenda com hora e fuso (pedido ao núcleo, 10.1).

### 2.2 Quem vê o quê

| Visão | Quem | Regra de sigilo |
| --- | --- | --- |
| **Minha agenda** | Cada usuário: itens em que é responsável, revisor ou convocado, em hora local e do juízo | Caso restrito só para membros |
| **Equipe** | Gestor jurídico e sócio, com carga por pessoa (contagem, sem placar, decisão 11 do JU-02) | Caso restrito aparece como "Compromisso restrito" a quem não é membro (regra unificada 1) |
| **Por cliente** | Equipe com o cliente na carteira; o cliente no app só vê o que o advogado liberar | Segredo de justiça só com liberação (JU-02 7) |
| **Por Caso** | Equipe nominal do Caso | Herda o compartimento; busca e resumo respeitam o sigilo (JU-01 6.2) |

O cliente nunca vê data interna, alçada de acordo, correspondente, custo, conflito de agenda nem notas internas.

### 2.3 Conflito de agenda

Detecção por **regra** a cada criação ou mudança e uma vez por dia, sem IA. O sistema avisa e propõe saídas; **não decide** e não mexe na data do juízo.

| Conflito | Detecção | Gravidade | Saídas propostas |
| --- | --- | --- | --- |
| **Mesmo responsável em dois compromissos sobrepostos** | Intervalos que se cruzam, na hora do juízo | Alta: bloqueia "confirmar" até escolher | Outro advogado; **ordem a correspondente**; pedir redesignação (minuta de Peça; adiamento por motivo justificado e comprovado **[a confirmar: CPC art. 362]**); manter e justificar |
| **Deslocamento insuficiente** entre presenciais em locais diferentes | Tempo estimado mais margem do escritório maior que a folga | Média | As mesmas; ou virtualizar um, se o juízo admitir |
| **Audiência dentro de ausência** | Cruza com a faixa de ausência | Alta | Cobertura de ausência: substituto ou correspondente |
| **Compromisso pessoal ocupado** (livre ou ocupado do calendário externo) | Faixa que cruza | Baixa: só aviso | Seguir ou ajustar |

Conflito aberto fica em "A conferir" (como os prazos, JU-02 4.2) e volta como lembrete no D-3 e no D-1. Fuso: toda comparação usa a hora do juízo (3.4).

### 2.4 Sincronização com Google e Outlook

Conector `agenda` do 08 (7.7): Google Calendar e Microsoft Graph, `oauth` **por usuário**, opcional; o Administrador pode conectar uma agenda do setor. Sem Google nem Outlook, vale `.ics` ou link revogável com título neutro (SG-029). Cotas dos provedores **[a confirmar]**.

| Ponto | Regra |
| --- | --- |
| **Sentido** | Plataforma → externo: prazos (dia inteiro), audiências, perícias, diligências. Externo → plataforma: **só livre ou ocupado** (para o conflito) e reuniões com cliente (Timesheet, GES-050). Título e descrição de eventos pessoais não são lidos |
| **Título que sai** | Padrão **neutro**: "Audiência · Caso 2026-0123 · 14h" (número interno, JUR-019). O usuário pode escolher "completo" (cliente e vara), **nunca** em Caso restrito ou segredo de justiça: ali só "Compromisso restrito" e link de volta à plataforma. O link de audiência virtual só vai no modo completo |
| **Mudança feita fora** | A plataforma **mantém a data do ato** e mostra "alteração detectada", oferecendo abrir pedido de remarcação (AG1). Apagar o evento externo não apaga a Audiência |
| **Fuso** | Sai com o fuso do juízo, não o do aparelho |
| **Convidados** | O sistema **não convida cliente, testemunha ou perito sozinho**: o aviso ao cliente sai pelo app ou WhatsApp com texto-modelo após o advogado confirmar a Audiência (decisão 8 do JU-02); testemunha recebe só data, local e "comparecer à audiência", com aprovação |
| **Duplicidade e falha** | `id_externo` de ida e volta; token revogado detectado no uso (08 3); sincronização parada vira evento e alerta ao usuário e ao Gestor, como a saúde da captura (FX-001) |

### 2.5 Calendário compartilhado por cliente e por Caso

O 08 (13.5) define o **calendário compartilhado de atividades de cada cliente**: dado da plataforma, sem conector, visível ao cliente na Agenda do app. O jurídico acrescenta o recorte **por Caso**: prazos, audiência, perícia, diligências e o retorno do correspondente, para a equipe nominal, com o sigilo do compartimento. No app, a Agenda mostra audiência com local, link e instruções e "o que falta você fazer" (levar documentos, ir à perícia), liberado pelo advogado; pedido do cliente vira tarefa. Cliente com Contábil e Jurídico tem **um só calendário** (cadastro único), com cor por pacote; cada item segue o sigilo do seu pacote.

**Tempo e deslocamento.** O deslocamento para audiência em outra comarca é atividade própria do Timesheet, faturável ou não conforme o Contrato de honorários **[a confirmar com a advogada]**; reunião lida do calendário vira sessão `estimada` (05, GES-050); viagem ou audiência fora pede **cobertura de ausência** (JU-02 5.4); passagem e quilometragem são despesa adiantada (FIN-002).

---

## 3. Audiência: do aviso à ata

### 3.1 Extensão do JU-01 4.6

Ficam **todos os campos e estados do JU-01** (`designada`, `confirmada`, `realizada`, `adiada`, `redesignada`, `cancelada`, `ausencia_registrada`). Pedidos (10.1):

| Campo novo | Descrição |
| --- | --- |
| `tipo` ampliado | Mediação, justificação, saneamento e sustentação oral em sessão de julgamento **[a confirmar a lista]** |
| `fuso_do_juizo` | Por tribunal e comarca, em dado, com fonte; a hora do juízo é a que vale |
| `convocados` | Por pessoa: Parte (cliente, preposto, testemunha), `modalidade_de_participacao`, `aviso_enviado_em`, `confirmou_em` |
| `deslocamento` | Origem, destino, tempo estimado, margem, `despesa_id` |
| `presenca` | Usuário do escritório **ou** **Diligência** de comparecimento (correspondente), com `mandato_id` (substabelecimento) |
| `alcada_de_acordo` | Intervalo **autorizado pelo cliente**, quem e quando; **não vai ao correspondente sem decisão expressa do advogado** |
| `contato_do_juizo`, `redesignada_de_id` | Telefone do cartório para contingência; cadeia de remarcações |
| marcas | `relato_pendente`, `ata_pendente`, `acordo`, `urgente`; **sem novos estados** |

### 3.2 Do aviso do tribunal à agenda

1. A Comunicação chega e o agente da Controladoria a **classifica** como designação de audiência (JUR-036), mostrando o trecho.
2. O agente cria a Audiência em `designada` com a marca **"lida do ato, não conferida"** (SG-018). **Só a pessoa a leva a `confirmada`**, conferindo data, hora, local ou link, modalidade e fuso; se faltam dados, o cartão diz "faltam dados", sem inventar.
3. Ao confirmar nascem: o evento de agenda, as tarefas de preparo (JUR-066, 067, 094, 120, 150), o aviso ao cliente (modelo aprovado) e os alertas.
4. **Escada** própria: D-7, D-3, D-1 e no dia (D-7 **[a confirmar com a advogada]**); D-1 e o dia são urgentes (JU-03 2.5).
5. Nova Comunicação que muda ou cancela: o agente propõe `adiada`, `redesignada` (nova Audiência ligada) ou `cancelada`; a pessoa confirma.
6. **Custódia e plantão** (JUR-116, 126): marca `urgente`, alerta em **horas**, atendimento humano; o agente só organiza e lembra.

### 3.3 Preparação

Checklist por tipo e por área, aberto como tarefas; o agente prepara e a pessoa conclui (JUR-066, 067, 094, 120, 150).

| Item | O que o sistema faz | Quem decide |
| --- | --- | --- |
| **Roteiro** | Resume o Caso e monta roteiro de perguntas ou de proposta, com fontes | Advogado |
| **Procuração e poderes** | Confere vigência e poderes especiais (transigir, receber e dar quitação) do advogado que vai; alerta se faltam | Advogado |
| **Preposto** (JUR-094, 150, 202) | Modelo de carta (Peça), confirmação de comparecimento; ausência tem consequência grave no trabalhista **[a confirmar: CLT arts. 843 e 844]** | Advogado e cliente |
| **Testemunhas** | Lista e contatos; se vão por intimação ou por conta própria; prazos do rol **[a confirmar: CPC arts. 357 §4º e 455]**; lembrete D-3 e D-1 | Advogado |
| **Proposta de acordo** (JUR-066) | Calcula **faixas** pelo motor (JU-04); o cliente autoriza por escrito e `alcada_de_acordo` registra; o agente **nunca negocia valores** (SG-035) | Cliente e advogado |
| **Quem comparece** | Advogado do escritório ou correspondente (6) | Advogado |

### 3.4 Presencial, virtual, híbrida; deslocamento e fuso

- **Presencial:** local, deslocamento mais margem, alerta "sair às HH:MM" por regra simples, sem prometer trânsito; mapa e rota fora do v1.
- **Virtual:** link e instruções; a plataforma de videoconferência **varia por tribunal** **[a confirmar]**; teste de conexão no D-1 (câmera, microfone, documento) e plano B com o contato do juízo; normas do CNJ sobre atos telepresenciais **[a confirmar: Res. 354/2020 e 345/2020]**.
- **Híbrida:** a modalidade é **por convocado** (cliente presente, advogado e testemunha remotos), cada um com sua instrução.
- **Fuso:** o Brasil tem mais de um fuso e o horário de verão acabou em 2019 **[a confirmar]**. O desenho **não grava tabela de fuso no código**: o fuso do juízo vem de dado por tribunal e comarca, com fonte. A tela mostra **as duas horas** ("14h no juízo · 13h na sua agenda"). Prazos eletrônicos contam no horário do juízo **[a confirmar: CPC art. 213]**; isso é também entrada do calendário forense (JU-03).

### 3.5 No dia

Se comparece o advogado do escritório, abre o roteiro no tablet e registra o resultado com poucos toques. Se comparece o correspondente, já tem briefing, substabelecimento e a orientação sobre acordo, e manda o **relato estruturado** antes do fim do expediente; a marca `relato_pendente` alerta o advogado ao fim do dia. Atraso ou impedimento de última hora abre o plano B (outro correspondente, pedido de justificativa **[a confirmar prazo legal]**). `ausencia_registrada` é registro, não confissão: o sistema anota e alerta sobre a consequência provável (revelia, multa) para a pessoa decidir.

### 3.6 Ata, resultado e desdobramentos

**Ata.** O sistema **não presume** que a ata está nos autos (o DataJud não traz teor, JU-01 4.3). O resultado é registrado no mesmo dia; `ata_pendente` fica aberta com tarefa de conferir a juntada; quando a ata chega vira Documento da Audiência e o agente **a compara com o relato do dia**, mostrando diferenças.

**Relato estruturado** (perguntas fixas, não texto livre): a audiência ocorreu (senão, por quê e nova data)? Houve **acordo** (valor e condições)? O juiz **proferiu decisão ou deu prazo** (qual e a quem)? Quem foi ouvido e houve indeferimento? Foi determinada **perícia, diligência ou documento novo**? Houve pedido de vista, adiamento ou juntada? A ata foi entregue e gravada? Alguma ocorrência (atraso do juízo, falha técnica: insumo de justa causa, JUR-052)?

| Resultado | O que o sistema propõe (tudo "proposto") | Quem decide |
| --- | --- | --- |
| **Decisão ou prazo dado em audiência** | **Prazo avulso** com data-base na audiência (JU-03 2.7), com "lido no texto" ou "sugerido"; fatal exige advogado inscrito e segunda conferência (regras unificadas 2 e 3) | Advogado |
| **Acordo** | `honorario.registrar_evento_gerador` como cartão ao Financeiro (êxito ou sucumbência, JU-05); cumprimento do acordo vira tarefas e Prazos | Advogado e sócio |
| **Redesignação** | Nova Audiência ligada; aviso a cliente, testemunhas e correspondente | Advogado |
| **Perícia determinada** | Cria a Perícia em `nomeada` com os prazos do ato (4) | Advogado |
| **Sentença** | Prazo recursal; preparo vira Custa (JU-01 4.9); marca `processo.transitar` depois | Advogado |

---

## 4. Perícia

### 4.1 Entidade Perícia

| Campo | Descrição |
| --- | --- |
| `caso_id`, `processo_id`, `natureza` | Judicial ou administrativa (p. ex., perícia médica do INSS, JUR-146) |
| `tipo` | Médica, engenharia, contábil, insalubridade e periculosidade (JUR-103), grafotécnica, avaliação, social (JEF), outra **[a confirmar lista]** |
| `nomeacao` | `comunicacao_id`, data, prazo para impedimento, assistente técnico e quesitos **[a confirmar: CPC art. 465]** |
| `perito`, `assistente_tecnico` | Parte com esses papéis (JU-01 4.2); o assistente também é fornecedor no Financeiro |
| `quesitos` | Versões ligadas a Peça, com autor (pessoa, modelo ou IA); suplementares |
| `honorarios` | Proposta, manifestação, valor fixado, quem adianta, `custa_id` (`honorarios_periciais`, JU-01 4.9) |
| `exame` | Data, local, quem comparece, documentos a levar (evento de agenda) |
| `laudo`, `manifestacao`, `resultado` | Documento e prazo de manifestação; Peça de manifestação e parecer do assistente; resultado informado por pessoa (jurimetria **só do escritório**, JR4) |
| `prazos` | Os `prazo_id` gerados em cada etapa |

**Estados:** `nomeada` → `quesitos_e_assistente_definidos` → `honorarios_em_discussao` → `honorarios_depositados` → `agendada` → `realizada` → `laudo_entregue` → `manifestada` → `esclarecimentos` (opcional) → `encerrada`; lados `substituida`, `dispensada`, `cancelada`. Nenhum estado avança por IA; a data de cada prazo vem do motor (JU-03).

### 4.2 Ciclo e prazos

| Etapa | O que acontece | Prazo ou risco |
| --- | --- | --- |
| **Nomeação** | A Comunicação "nomeia perito"; o agente cria a Perícia e propõe os prazos do ato | Impedimento, assistente e quesitos: 15 dias **[a confirmar: CPC art. 465 §1º]**; advogado confirma |
| **Quesitos** | Modelo por tipo (JUR-065, 103), IA propõe, advogado edita; Peça com revisão e protocolo humano (JR5) | Prazo da nomeação |
| **Honorários** | Ver 4.3 | Depósito perdido pode perder a prova (JUR-233) |
| **Laudo** | O agente resume e compara com os quesitos ("respondeu a todos?") | Manifestação em 15 dias **[a confirmar: CPC art. 477 §1º]** |
| **Manifestação e esclarecimentos** | Concordar, impugnar, pedir esclarecimentos, quesitos suplementares, parecer do assistente; impugnar cálculo com o motor (JUR-096) | Prazo fatal confirmado pelo advogado |

Dias e artigos vêm do catálogo J3 e da memória do desenho e **estão a confirmar com a advogada**; entram no motor como **Regra de prazo versionada com caso de gabarito** (JU-01 4.5), nunca como texto solto.

### 4.3 Honorários periciais

Ponto de maior risco financeiro e processual: o depósito tem prazo e, se não for feito, a prova pode se perder.

| Etapa | Registro e regra |
| --- | --- |
| **Proposta e fixação** | Comunicação com Prazo para manifestar. A decisão fixa o valor e **quem adianta** (em regra quem requereu; no trabalhista, o sucumbente no objeto da perícia **[a confirmar: CPC art. 95; CLT art. 790-B]**). O sistema mostra a regra provável; **não decide** |
| **Gratuidade** | Se o Processo tem gratuidade deferida (JU-01 4.1), aviso "a regra de pagamento da perícia é outra; confirme" |
| **Depósito** | Custa `honorarios_periciais`: `a_calcular` → `guia_emitida` → `paga` → `comprovada`, com escada D-5, D-3, D-1 (como preparo recursal, JUR-075) |
| **Quem paga** | Provisão do cliente na **Conta do cliente** ou **despesa adiantada** do escritório, reembolsável (JU-05 2.4); depósito já feito em juízo é registro em **Valores em juízo** (JU-05 2.6). Saída de conta de terceiros exige cartão do sócio |
| **Assistente técnico** | Não é honorário pericial: é Conta a pagar (fornecedor), com documento fiscal ou recibo **[a confirmar com o contador]**, aprovação por alçada e cartão, e só com aval do cliente |
| **Não reembolsado** | Vira custo direto do Caso (JU-05 4.1) |

### 4.4 Papel da IA

**Faz sozinho:** criar a Perícia em rascunho a partir da Comunicação, alertar o depósito, lembrar convocações. **Prepara, pessoa conclui:** quesitos (do histórico só do próprio escritório, piso A; quesito é estratégia e fica no compartimento), resumo e comparação do laudo, minuta de manifestação. **Nunca:** confirmar prazo fatal, aceitar honorário, contratar assistente técnico, pagar depósito ou concordar com o laudo. Ideia fora do v1: na perícia contábil, o pacote Contábil poderia dar apoio documental, só no mesmo escritório e com consentimento **[a confirmar]**.

---

## 5. Diligência

### 5.1 O que é e tipos

Tarefa **fora do escritório, com data, local e entrega verificável**, feita por usuário interno ou por Correspondente. A mesma entidade carrega a ordem ao correspondente.

| Tipo | Entrega que prova | Sensibilidade e observação |
| --- | --- | --- |
| **Cópia ou vista de autos** (físico) | Cópias digitalizadas e recibo | Média; em segredo de justiça só com substabelecimento (6.7) |
| **Carga dos autos** | Recibo de carga e **comprovante de devolução** | Alta: a devolução vira **Prazo avulso** com escada (JU-03 2.7) |
| **Protocolo físico ou em órgão** | Protocolo carimbado | **Alta se ligado a prazo fatal.** Protocolar é ato de advogado (JR1): só correspondente inscrito com substabelecimento; o Prazo fecha quando o advogado do escritório **valida o recibo** (JU-03 2.6) |
| **Acompanhar oficial de justiça ou despacho com magistrado** | Relato | Média; despacho é ato do advogado inscrito |
| **Retirada de alvará, mandado ou guia** | Comprovante | **Muito alta** (dinheiro): exige poder de receber e dar quitação e cartão do sócio; padrão: **o escritório faz** |
| **Comparecimento a audiência** | Relato estruturado e ata | Muito alta; checa poderes no Mandato (6.4) |

### 5.2 Campos e estados

| Campo | Descrição |
| --- | --- |
| Ligações | `caso_id`, `processo_id`, `audiencia_id`, `pericia_id`, `prazo_id`, `mandato_id` (opcionais) |
| `tipo`, `instrucoes`, `local`, `janela` | O que fazer, em passos, com o mínimo de dados (6.7); órgão, comarca, data e hora limite |
| `executor`, `modo` | Usuário **ou** `correspondente_id`; `interna` ou `terceirizada` |
| `valor_combinado`, `custos_previstos`, `adiantamento` | Só `terceirizada` (6.6) |
| `entregaveis_exigidos`, `relato`, `entregue_em` | O que provar e o que voltou |
| `validada_por/em`, `motivo_rejeicao`, `avaliacao_id` | Conferência do advogado e Avaliação (6.5) |
| `custa_id`, `despesa_id`, `conta_a_pagar_id` | JU-05 e 09 |

**Estados:** `rascunho` → `solicitada` → `aceita` → `em_execucao` → `entregue` → `validada` → `paga` (só terceirizada). Lados: `recusada`, `expirada`, `devolvida` (volta a `em_execucao` com motivo), `falhou` (abre plano B), `cancelada`, `contestada` (disputa de valor ou entrega, vai ao sócio). A diligência **interna** (estagiário, paralegal) segue o mesmo fluxo sem `aceita` e sem `paga`, o que a mantém no histórico e na rentabilidade do Caso.

---

## 6. Correspondentes

### 6.1 O modelo do mercado (não verificado)

**Aviso:** nenhuma página oficial foi lida. O que segue vem dos resumos de busca da conferência de 9/11/2026, de textos de fornecedores (J1, J2, J7, J8) e da leitura da sessão. **A advogada da família deve dizer como contrata correspondentes hoje.**

| Elemento | O que as fontes sugerem (não verificado, fontes de fornecedor) |
| --- | --- |
| **Demanda e propostas** | O contratante publica pedido com **tipo, comarca, prazo e honorário proposto**; correspondentes respondem; o contratante escolhe |
| **Entrega e pagamento** | Relato e prova; **pagamento liberado depois da validação** (o Jurídico Certo cita um produto "Jurídico Pag" **[a confirmar]**) |
| **Gestão com correspondente embutido** | eLaw Starter e Integration Office: cadastro, solicitação e faturamento auditado (J1, J2); SGJur: processo compartilhado com **prazo de acesso, valor combinado, entrega com prova, aceite que libera pagamento e despesa lançada** (SG-028); EasyJur vende audiências e diligências junto com o software (conferência) |

**O que ensina, mesmo sem confirmação:** o ciclo é ordem → aceite → execução → relato com prova → validação → pagamento → avaliação; o ponto frágil é o correspondente que falta ou não manda o relato (J3, JUR-068 e 232); os sistemas de gestão oferecem **cadastro próprio com acesso limitado**, e o marketplace aberto é outro negócio (FX-015 tem prioridade baixa em J8; o JU-01 5.5 deixou marketplace como **Não**).

### 6.2 Três opções e a decisão

| Critério | **A. Cadastro interno** | **B. Rede aberta** (plataforma opera marketplace) | **C. Integração com marketplace existente** |
| --- | --- | --- | --- |
| **O que é** | O escritório cadastra os correspondentes que conhece, emite ordens e paga | A plataforma cadastra, avalia e põe advogados de todo o país em disputa por ordens | A plataforma publica a ordem em Jurídico Certo ou Juris Correspondente e recebe o retorno |
| **Sigilo** | O escritório controla quem recebe o quê | Ordem exposta a desconhecidos: comarca, tipo e prazo já dizem o que o cliente faz (J4) | Dados saem para terceiro; contrato de operador **[a confirmar]** |
| **Dinheiro** | O escritório paga na própria conta, após validar (H3) | Marketplace "de verdade" retém ou intermedia pagamento: **contradiz H3 e R1 do 09** | Custódia é do marketplace |
| **Ética e responsabilidade** | Do escritório, como já é | A plataforma vira intermediária entre advogados: captação, publicidade e partilha (Provimento 205/2021) **[a confirmar com advogado de ética]** | Divide com o marketplace **[a confirmar]** |
| **Esforço** | Pequeno: usa Diligência, Mandato, Conta a pagar | Grande: oferta e demanda em cada comarca ("começo frio"), curadoria, disputa | Médio a grande: depende de API **não lida** e de acordo comercial |

**Decisão proposta: opção A agora, em degraus; C só sob condições; B não se faz.**

1. **Degrau 1 (v1): cadastro interno e ordem controlada.** O escritório cadastra correspondentes, emite a Diligência com o mínimo de dados, acompanha aceite, relato e prova, valida e paga por conta a pagar. Serve ao escritório pequeno, que mais depende de correspondente por não ter presença em outras comarcas.
2. **Degrau 2 (perfil médio): cotação** da mesma ordem a 2 a 5 correspondentes da carteira. Ainda é a rede **do escritório**.
3. **Registro de quem veio de marketplace, sem integração.** O escritório pode usar o Jurídico Certo ou outro por fora e **cadastrar o profissional como Correspondente avulso** (`origem = marketplace`), registrando Diligência, prova, custo e Avaliação. A plataforma ganha histórico e custo do Caso sem API, sem expor dado e sem depender do parceiro.
4. **Opção C só com quatro condições:** (i) documentação oficial de API lida; (ii) parecer de ética e de LGPD sobre o envio; (iii) ordem exportada **sem nome de cliente**, só com o mínimo; (iv) pelo menos 5 escritórios do piloto pedindo e dizendo que comarca lhes falta.
5. **Por que não B:** exigiria intermediar dinheiro e pessoas (contra H3), piora o sigilo, tem "começo frio" caro, o risco ético da intermediação não foi examinado e o JU-01 já registrou "Não". Fica como possibilidade remota, depois de parecer.

A recomendação é **hipótese**: confirma-se ou cai na conversa de 20 minutos com a advogada (10.2, etapa A0).

### 6.3 Cadastro de Correspondente

Entidade **do escritório**: não há carteira compartilhada entre escritórios (piso A do sigilo).

| Campo | Descrição |
| --- | --- |
| `nome`, `tipo`, `documento` | Advogado ou escritório; CPF ou CNPJ. A Pessoa do núcleo só tem CPF (JU-01 4.2): correspondente PJ pede o ajuste "fornecedor com CNPJ" (10.1) |
| `oab`, `uf`, `confirmada_na_fonte_em` | Conferência **assistida** (a OAB não tem API, JR9), refeita a cada 12 meses **[a confirmar]** |
| `comarcas`, `tribunais`, `servicos` | Onde atua e o que faz (audiência, protocolo, cópia, certidão, carga, despacho, sustentação) |
| `tabela_de_valores` | Do **histórico do escritório**; sem tabela da plataforma; tabela da seccional só como referência **[a confirmar]** |
| `contato`, `dados_de_pagamento` | WhatsApp e e-mail; Pix ou conta, **visível só ao Financeiro e ao sócio**, com alerta a cada mudança (risco de fraude) |
| `documentos` | Termo do correspondente (sigilo, LGPD, **não captação do cliente**, devolução dos arquivos), comprovante de OAB, contrato-quadro opcional |
| `situacao`, `origem` | `ativo`, `em_observacao`, `bloqueado` com motivo; `indicacao`, `historico`, `marketplace` |

**Regras.** (1) **Impedimento:** a ordem é recusada se a OAB do correspondente é a do **advogado contrário** no mesmo Processo (regra sobre `Parte.oab`). (2) `bloqueado` não recebe ordem. (3) O correspondente não é usuário pago (6.7). (4) Sócio ou Gestor cadastra; estagiário e secretária só propõem. (5) Dado de pagamento é financeiro restrito (H9).

### 6.4 O ciclo da ordem

A ordem **é a Diligência `terceirizada`**. O agente organiza e o advogado aprova.

| # | Passo | O que acontece | Quem decide |
| --- | --- | --- | --- |
| 1 | **Escolha** | Propõe da carteira por comarca, tipo, nota e preço; no degrau 2, pede cotação | Advogado |
| 2 | **Briefing** | Mínimo por tipo (6.7), instruções, relato esperado e o que **não** fazer (p. ex., não transigir) | Agente prepara |
| 3 | **Substabelecimento** | Mandato com poderes e vigência limitados ao ato; sem reserva exige ciência do cliente **[a confirmar: EAOAB art. 26]** | Advogado, por assinatura |
| 4 | **Cartão de aprovação** | Mostra a quem, o que vai (campos e documentos), valor e prazo; aprovar libera o envio; **nunca promovido** a automático | Advogado; sócio acima da alçada |
| 5 | **Envio** | **Página da ordem** (6.7) por link, sem anexos soltos no WhatsApp | Sistema |
| 6 | **Aceite** | Aceita, recusa ou contrapropõe valor; a contraproposta volta ao advogado; o agente **nunca negocia valores** (SG-035) | Correspondente e advogado |
| 7 | **Lembretes** | D-1 e o dia, com "estou a caminho"; cobrança do relato é **automática** (não expõe dado novo) | Agente |
| 8 | **Execução e relato** | Relato estruturado e prova (3.6 e 5.1) | Correspondente |
| 9 | **Validação** | Confere relato e prova com ata ou autos; aceita ou devolve; relato com prazo ou decisão gera Prazo "proposto" (AG5) | **Advogado inscrito** |
| 10 | **Avaliação e pagamento** | Registra a Avaliação; `validada` cria a Conta a pagar (6.6) | Advogado e sócio, cartão sempre |

### 6.5 Entidade Avaliação

Registro do advogado sobre um serviço de correspondente, **privado ao escritório**.

| Campo | Descrição |
| --- | --- |
| `diligencia_id`, `correspondente_id`, `avaliador_id`, `em` | Quem avaliou, quando, qual serviço |
| `criterios` | Pontualidade, fidelidade às instruções, qualidade de relato e prova, comunicação, custo contra o combinado (1 a 5) |
| `ocorrencias` | Lista fechada: `faltou`, `atrasou`, `relato_tardio`, `cobrou_acima`, `descumpriu_instrucao`, `quebra_de_sigilo` |
| `recomendaria`, `comentario` | Sim, com ressalva, não; texto interno sem dado de cliente além do necessário |
| `visivel_ao_correspondente` | Padrão **falso**; o termo avisa que o escritório guarda avaliações internas **[a confirmar com advogado de LGPD e ética]** |

Só inserção; correção é nova versão. A nota média só aparece após 3 serviços e **nunca vira ranking público nem sai do escritório**. `quebra_de_sigilo` bloqueia o correspondente e avisa o sócio. A Avaliação é **só de externos**: não existe avaliação de pessoas do escritório aqui (decisão 11 do JU-02, sem placar).

### 6.6 Pagamento, repasse e custos adiantados

Tudo pelo Financeiro (09) e pelo JU-05; aqui só o gatilho e as ligações.

| Situação | Tratamento |
| --- | --- |
| **Preço por serviço** | `validada` cria **Conta a pagar** (fornecedor = Correspondente), com valor combinado, documento fiscal ou recibo **[a confirmar com o contador]**, alçada e **pagamento sempre com cartão**; a ferramenta de pagamento **não é promovível** (09 6) |
| **Reembolso ao escritório** | Se o Contrato de honorários prevê, vira **despesa adiantada** (FIN-002, JUR-214) ligada ao Caso, à Diligência e à Peça; padrão de recibo separado, fora da nota **[a confirmar com o contador]** |
| **Provisão do cliente** | Saída da **Conta do cliente**, com cartão do sócio; saldo nunca negativo; dinheiro de outro cliente nunca cobre; conta de terceiros fica **fora** do caixa, do DRE e do custo-hora (H5) |
| **Custo não reembolsado** | Custo direto do Caso na rentabilidade (JU-05 4.1) |
| **Parceria com partilha** (correspondente que acompanha o Caso e divide honorário) | **Não é este fluxo:** é `regra_partilha` e Apuração (JU-05 2.3), com parecer de ética e fiscal. Separar sempre "serviço por preço" de "parceria" |
| **Retenções e tributos** | **Não calculados no v1**; documento obrigatório antes de pagar; parecer do contador **[a confirmar]** |

Em uma frase: o escritório paga o correspondente da própria conta; o cliente reembolsa se o contrato disser; o dinheiro que o cliente deixou só sai pela Conta do cliente, com cartão; a plataforma nunca toca no dinheiro.

### 6.7 Sigilo: o correspondente só vê o que precisa

**Modelo.** O Correspondente **não é usuário** e **não entra no Caso**. Recebe uma **Página da ordem**: projeção de campos autorizados para uma Diligência, com link de uso limitado. Aproveita a ideia do processo compartilhado com prazo de acesso do SGJur (SG-028) sem dar acesso ao Caso.

| Regra | Efeito |
| --- | --- |
| **Visão mínima por tipo** | Tabela abaixo; o resto não aparece |
| **Prazo de acesso e identidade** | Expira após a entrega validada ou na data limite mais 48 h (padrão **[a confirmar]**); link com código enviado ao contato cadastrado, sem senha permanente; o correspondente não conversa com agente do escritório |
| **Caso restrito ou segredo de justiça** | **Só com substabelecimento assinado antes do envio** (em segredo de justiça só partes e procuradores consultam os autos **[a confirmar: CPC art. 189]**); a ordem sai do compartimento só como projeção mínima, com membro nominal aprovando (regra unificada 1) |
| **Documentos** | Só os listados no cartão, com registro de download; **marca d'água com o nome do correspondente** **[a confirmar viabilidade]** |
| **Nunca vai** | Honorários, valor da causa, conversas com o cliente, notas, estratégia, outros Casos; alçada de acordo só por decisão expressa ("pode propor acordo: sim ou não, até X") |
| **Fim** | Termo: apagar ou devolver os arquivos; acesso encerrado; evento gravado |
| **Auditoria e suporte** | Quem abriu, quando e o que baixou; o suporte da plataforma não vê Página de Caso restrito (JU-01 6.2) |

**Visão mínima por tipo** (hipótese; a advogada confere):

| Campo | Audiência | Cópia ou vista | Carga | Protocolo | Certidão |
| --- | --- | --- | --- | --- | --- |
| Número do processo e vara | Sim | Sim | Sim | Sim | Sim |
| Nome das partes | Sim (pregão) | Não | Não | Só as necessárias | Sim |
| Resumo do pedido | Só o necessário | Não | Não | O documento a protocolar | Não |
| Documentos | Os a juntar | Não | Não | O a protocolar | Não |
| Poderes (transigir etc.) | Os do substabelecimento | Não | Não | Não | Não |
| Contato do cliente | Só se o cliente autorizar | Não | Não | Não | Não |
| Prazo ligado | Se existir | Se existir | **Sim** (devolução) | **Sim** se fatal | Se existir |

### 6.8 Quando o correspondente falha

| Falha | Resposta |
| --- | --- |
| **Sem resposta ao aceite** (`expirada`) ou **recusa** | Avisa o advogado e propõe o próximo da carteira |
| **Faltou ou atrasou** (sem "estou a caminho"; contato do juízo) | `falhou`, alerta urgente, plano B (colega, outro correspondente, justificativa), ocorrência na Avaliação |
| **Quebra de sigilo** | `bloqueado`, aviso ao sócio; parecer de ética sobre comunicar ao cliente e à OAB **[a confirmar]** |
| **Cobrança acima do combinado** | `contestada`; só o sócio libera o excedente |

---

## 7. Permissões, agentes e ferramentas

### 7.1 Quem pode o quê

Segue a matriz do JU-01 6.1. **Só advogado inscrito:** confirmar o ato da Audiência, a manifestação e a Peça de perícia, emitir substabelecimento, validar entrega, confirmar prazo fatal e protocolar. **Sócio:** aprovar ordem acima da alçada, pagar (cartão), bloquear correspondente, ver dado de pagamento. **Associado:** emitir ordem até a alçada. **Demais perfis:** rascunham Audiência, Perícia, Diligência e cadastro de Correspondente. Cada um sincroniza a própria agenda; só o Administrador conecta a do setor.

### 7.2 O que o agente faz

| Lê | Faz sozinho | Prepara, pessoa conclui | Nunca |
| --- | --- | --- | --- |
| Caso, Processo, Comunicação, Audiência, Perícia, Diligência, Mandato e agenda, no compartimento e só se `ia_permitida` | Criar Audiência a partir de Comunicação classificada, detectar conflito, alertar, lembrar convocados, **cobrar relato**, sincronizar agenda, criar tarefas de preparo | Roteiro, carta de preposto, quesitos, resumos de ata e laudo, briefing da ordem, minuta de adiamento, Prazo proposto a partir de relato, sugestão de correspondente | **Remarcar ou cancelar audiência, confirmar prazo fatal, dar ciência, protocolar, transigir ou negociar valor, enviar ordem sem cartão, pagar, contratar assistente técnico, aceitar honorário pericial, abrir Caso restrito** |

### 7.3 Ferramentas, eventos e gatilhos

| Família | Ferramentas | Observação |
| --- | --- | --- |
| `agenda.*` | `listar_horarios`, `marcar`, `remarcar`, `cancelar` (08); novas: `verificar_conflito` (ler), `sincronizar`, `gerar_ics` | `remarcar` e `cancelar` de Audiência só por pessoa |
| `audiencia.*` | Existentes: `agendar`, `remarcar`, `registrar_resultado`; novas: `confirmar`, `convocar`, `registrar_ata`, `avisar_cliente`, `autorizar_acordo` | `confirmar` é ato; `autorizar_acordo` exige o cliente |
| `pericia.*` | `criar`, `registrar_nomeacao`, `registrar_quesitos`, `registrar_honorarios`, `registrar_laudo`, `registrar_manifestacao`, `encerrar` | Nenhuma promovível |
| `diligencia.*` | `criar`, **`enviar_ordem`** (com aprovação sempre, não promovível), `aceitar`, `registrar_entrega`, `validar`, `devolver`, `cancelar` | `validar` só advogado inscrito |
| `correspondente.*` | `cadastrar`, `conferir_oab` (assistida), `bloquear`, `listar`, `avaliacao.registrar` | `bloquear` sócio ou Gestor |

**Gatilhos** (desenho do time no JU-06): designação classificada cria Audiência e preparo; `audiencia.vencer_em_3_dias` e `_em_1_dia` conferem preparo, correspondente e conexão; `relato_pendente` cobra o relato e, passado o dia, alerta o advogado; nomeação de perito cria Perícia; honorário pericial a 5 dias lembra o depósito (pagamento por cartão); `diligencia.falhar` alerta e sugere o plano B.

**Eventos novos:** `audiencia.confirmar`, `.relato_pendente`, `.ata_pendente`; `pericia.nomear`, `.honorarios_depositados`, `.laudo_entregue`; `diligencia.enviar_ordem`, `.aceitar`, `.entregar`, `.validar`, `.falhar`; `correspondente.bloquear`; `avaliacao.registrar`; `agenda.conflito_aberto`, `.sincronizacao_parada`.


---

## 8. O que fica de fora (adiado, registrar apenas)

Decisão da Síntese e do JU-02: **escritórios de 1 a 10 usuários primeiro**; contencioso de massa, departamento jurídico e Legal Ops ficam **adiados de propósito**, só registrados.

| Item adiado | Por quê |
| --- | --- |
| **Contencioso de massa** (pauta de centenas de audiências, preposto e correspondente em lote) | Outro público e outro preço (eLaw Enterprise, Legal One, Benner, J1); candidato futuro (Conferência, seção 4) |
| **Departamento jurídico** (escritórios externos, e-billing, provisão, agenda de prepostos: JUR-191 a 207) | Perfil desativado no pacote (JU-01 2.1; JU-02 2.3) |
| **Rede aberta e marketplace próprio** | 6.2; decisão "Não" do JU-01 5.5 |
| **Integração com marketplace** | Só com as quatro condições de 6.2 (FX-015) |
| **Pagamento intermediado ou retido em custódia** | Contraria H3 e R1 |
| **Rota e trânsito; gravação ou transcrição de audiência pelo sistema; pontuação de produtividade por audiência (FX-012); carteira de correspondentes compartilhada entre escritórios** | Custo de API; consentimento e prova pedem parecer; vigilância e LGPD trabalhista; quebraria o piso A do sigilo |

---

## 9. Entradas de custo para o JU-12

Não são preços: são custos e parâmetros que o estudo de precificação precisa medir.

| # | Item | Natureza | Referência |
| --- | --- | --- | --- |
| C1 | **Sincronização de agenda** (Google, Microsoft) | Fixo por usuário conectado | API sem custo dentro das cotas **[a confirmar]** (08); manutenção do conector |
| C2 | **Notificações** de audiência e perícia (escada D-7, D-3, D-1, dia, mais cliente e testemunha) | Variável por mensagem | Custo da conta do WhatsApp (08) **[a confirmar]**; parâmetro: mensagens por audiência |
| C3 | **IA** (roteiro, carta de preposto, quesitos, resumo de ata e laudo, briefing) | Variável por evento | Medir no piloto o consumo de UU por tarefa (Síntese 9.1); pode corroer a margem do plano básico (Síntese 6.4) |
| C4 | **Assinatura eletrônica** (substabelecimento e termo) | Por documento | R$ 69 a R$ 80 por mês **[a confirmar por envelope]** (JU-03 6.1); conta do escritório |
| C5 | **Convidados externos** (correspondentes na Página da ordem) | Capacidade, não usuário | Hipótese: **não contam como usuário**, com teto de ativos **[a confirmar]** (H10) |
| C6 | **Parecer de ética e LGPD** (correspondentes, avaliação, substabelecimento) | Fixo, antes do lançamento | Custo **[a confirmar]** (regra unificada 9) |

**Custos do escritório, não da plataforma,** que entram na rentabilidade do Caso e nos escritórios-tipo do JU-12 (JU-05 4.1): correspondente, perícia, custas e deslocamento. **Premissas não medidas:** audiências por advogado por mês, parcela feita por correspondente, valor médio por serviço, correspondentes por escritório, tempo de deslocamento **[a confirmar]**.

---

## 10. Ajustes pedidos, ordem de construção e perguntas

### 10.1 Ajustes pedidos a outros documentos

| Documento | Ajuste |
| --- | --- |
| **JU-01** | (a) Entidades novas: Perícia, Diligência, Correspondente, Avaliação. (b) Audiência: campos de 3.1, **sem novos estados**. (c) O correspondente **não é Parte**: tirar "correspondente" de `partes_convocadas` e ligar a Audiência à Diligência. (d) Peça: `protocolada_por` aceita correspondente inscrito com substabelecimento. (e) Custa e depósito: `custa_id` ligado à Perícia e à Diligência. (f) Mandato: substabelecimento por ordem, limitado ao ato. (g) Prazo avulso com data-base em audiência, perícia e carga |
| **JU-02** | (a) Perfil pequeno: **Correspondente simples** em "Terceiros" (hoje só "substituto convidado") e visão "Perícias" em Prazos e agenda; a aba "Audiências e correspondentes" segue do médio, com cotação. (b) Ficha: blocos "Perícias" e "Diligências". (c) Banner de conflito, tela do Correspondente e relato no celular |
| **JU-03** | Regras de prazo de perícia e de audiência (rol, memoriais, ata) com gabarito; fuso e horário do juízo no calendário forense; devolução de carga como prazo avulso; protocolo por correspondente só fecha o prazo após validação do advogado |
| **JU-04** | Checklists de preparo por tipo e área; modelos de Peça (rol de testemunhas, carta de preposto, quesitos, manifestação sobre laudo, pedido de adiamento, substabelecimento, termo do correspondente); resumos de ata e laudo com citação de trecho |
| **JU-05** | Conta a pagar para correspondente (fornecedor com CNPJ, retenções a confirmar); despesa adiantada ligada à Diligência e à Perícia; honorários periciais em Valores em juízo e na Conta do cliente; custo do Caso por correspondente e perícia; separar serviço por preço de partilha |
| **08 e Fundações** | Agenda: sentido, título neutro, fuso do juízo, mudança externa como sugestão; **evento de agenda** genérico com `entidade_ref`, compartimento e fuso; papel **convidado externo** com link de uso limitado, sem usuário pago; fornecedor com CNPJ; `Tarefa.origem` com `audiencia`, `pericia`, `diligencia` |
| **03, 05, 06, JU-06, JU-10 a JU-12** | Calendário da Home com os novos itens; atividade "deslocamento"; Agenda do Caso no app; gatilhos de 7.3 e `enviar_ordem` fora da promoção; termo do correspondente e retenção; importação de agenda e planilha de correspondentes; entradas da seção 9 |

### 10.2 Ordem de construção (só planejamento)

Depois do BPO. Depende de JU-01 (compartimento, Audiência), JU-03 (motor de prazo, E1 a E3) e JU-05 (F0 e F3).

| Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- |
| **A0** | **Sem código, já:** 20 minutos com a advogada (como contrata correspondente, comarcas, valores, marketplace, perícias por mês); 10 audiências e 3 perícias recentes contra o desenho; confirmar artigos e prazos de 3 e 4 | Nenhuma | Roteiro e perguntas de 10.3 |
| **A1** | **Agenda do núcleo:** evento de agenda com fuso e compartimento; visões; **conflito por regra** | Fundações, JU-01, JU-02 T3 | Vazamento em Caso restrito; 10 casos de conflito e de fuso |
| **A2** | **Audiência completa e sincronização Google e Outlook** (título neutro): criação a partir da Comunicação, confirmação, preparo, aviso, escada | A1, JU-03 E1 e E3 | Advogada confere o checklist de 3 tipos (conciliação, instrução, custódia); Caso restrito não sai com título |
| **A3** | **Resultado, relato e ata:** `ata_pendente`, Prazos propostos | A2, JU-03 E2 | 5 audiências reais em modo sombra |
| **A4** | **Diligência interna** | A1 | Advogada e estagiário testam 3 tipos |
| **A5** | **Perícia:** nomeação, quesitos, laudo, manifestação, prazos | A3, JU-03, JU-04 | Gabarito de prazos; advogada confere |
| **A6** | **Honorários periciais e custas:** depósito com escada, Valores em juízo | A5, JU-05 F0 e F3 | Parecer de ética e do contador |
| **A7** | **Correspondente, degrau 1:** cadastro, ordem, Página da ordem, relato, validação, Avaliação | A4, A3, Mandato | Parecer de ética e LGPD; piloto com 3 a 5 correspondentes reais |
| **A8** | **Pagamento do correspondente:** Conta a pagar, reembolso, Conta do cliente | A7, JU-05 F3 | Parecer fiscal; teste de saldo negativo e de mistura |
| **A9** | **Perfil médio:** cotação a vários e aba "Audiências e correspondentes" | A7, JU-02 T13 | Pedido real de pelo menos 3 escritórios |
| **A10** | **Marketplace (C)** | A7, A9 | As quatro condições de 6.2 |

### 10.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | Qual das três opções para correspondentes? | **A**, cadastro interno; C só com quatro condições; B não se faz | "Começo só com a lista de correspondentes que o próprio escritório conhece, sem marketplace e sem rede aberta?" |
| 2 | O escritório pequeno já tem correspondente simples? | Sim, em "Terceiros"; cotação a vários fica no médio | "Mesmo o escritório pequeno já pode cadastrar correspondente e mandar ordem?" |
| 3 | Quem paga o correspondente? | O escritório, da conta dele, depois de validar, com cartão do sócio; a plataforma nunca segura o dinheiro | "Só o escritório paga, depois de conferir o serviço, e o sistema não mexe no dinheiro?" |
| 4 | Quem valida a entrega e o prazo que sai do relato? | Só advogado inscrito valida; o prazo nasce "proposto" | "Um advogado confere o relato antes de ele virar prazo?" |
| 5 | Título do evento na agenda externa | Neutro ("Audiência · Caso 2026-0123"); Caso restrito mostra só "Compromisso restrito" | "No Google do advogado aparece um título genérico, sem o nome do cliente?" |
| 6 | Mudança no Google ou Outlook altera a audiência? | Não; vira sugestão e prevalece a data do juízo | "Se alguém mexer no calendário do Google, a audiência no sistema continua como o juiz marcou?" |
| 7 | Correspondente em Caso restrito ou segredo de justiça | Só com substabelecimento assinado antes e com a projeção mínima | "Em caso sigiloso, o correspondente só recebe o necessário e só depois de ter poderes?" |
| 8 | Avaliação do correspondente | Privada ao escritório, só de externos, sem nota pública; o termo avisa | "As notas dos correspondentes ficam só no escritório e eles sabem disso?" |
| 9 | Relato no mesmo dia | Obrigatório, estruturado, com lembrete até o fim do dia | "O correspondente manda um relato no mesmo dia, com perguntas fixas?" |
| 10 | Honorários periciais e assistente técnico | O sistema alerta e registra o depósito, nunca paga e não contrata assistente sem aval do cliente | "O sistema lembra do depósito do perito, mas quem paga e quem contrata o assistente é você?" |
| 11 | Aviso da audiência ao cliente | Automático só depois de o advogado confirmar a Audiência, com texto-modelo aprovado | "O cliente recebe sozinho a data da audiência só depois de você conferir?" |
| 12 | Correspondente como convidado | Não conta como usuário pago, com teto de convidados ativos | "Quem vem de fora por um serviço não paga mensalidade da plataforma?" |

---

## Ressalvas

- **Nada do mercado de correspondentes foi verificado.** Jurídico Certo, Juris Correspondente, eLaw, SGJur e EasyJur aparecem por resumos de busca e textos de fornecedores; **nenhuma afirmação passou por verificação**. A opção A é decisão de **desenho**, não de evidência de mercado; confirma-se ou cai na conversa com a advogada.
- **Normas e artigos vêm de memória de desenho e do catálogo J3 e estão a confirmar** no texto oficial: CPC (arts. 95, 189, 213, 357, 362, 455, 465, 477, 1.003), CLT (arts. 790-B, 843, 844), Estatuto da Advocacia (art. 26), Provimento 205/2021, Res. CNJ 345 e 354/2020. Dias de prazo e consequências de ausência entram no motor só como Regra de prazo com gabarito, conferida por advogado.
- Fusos, videoconferência por tribunal, carga de autos, sustentação oral e perícia com gratuidade variam por tribunal e caso. Tributação do pagamento a correspondente e assistente: **[a confirmar com o contador]**. Ética de substabelecimento sem reserva, partilha, avaliação de terceiros e quebra de sigilo: **[a confirmar com a advogada e com advogado de ética]**. Prazo de acesso da Página da ordem, margem de deslocamento, escada D-7 e teto de convidados são **hipóteses**; premissas de uso **não foram medidas**.
- **Nada é desenvolvido agora**; o BPO fecha antes. Antes de usar casos reais valem as regras unificadas (parecer de advogado especializado e modo sombra).

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].

## Decisão do usuário (9/11/2026, terceira rodada)

**Mantém o JU-09 como está** (cadastro interno de correspondentes, opção A): o sistema organiza as despesas e paga os correspondentes a partir da conta do escritório, com aprovação humana; **a plataforma não é e não será um marketplace**, e não cobra taxa por demanda. A opção C (integração com marketplace) fica fora do plano.
