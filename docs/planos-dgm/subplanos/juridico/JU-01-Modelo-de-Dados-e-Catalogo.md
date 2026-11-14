# Subplano JU-01 · Modelo de dados e catálogo (pacote Jurídico)

**Versão 0.1 · 8/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Pacote de área sobre a plataforma comum (DA-02, DA-02.1). Fontes: [Síntese](../../Sintese_Pacote_Juridico.md), pesquisas J1 a J9 e `atividades-juridico.json`, [Fundações](../01-Fundacoes.md) e [Desenho do Sistema](../../Desenho_do_Sistema.md). As convenções das Fundações valem aqui: identificadores opacos, datas com fuso, dinheiro em centavos, `escritorio_id` e `subinquilino_id` implícitos, **nada se apaga**, versões com `vigente_de` e `vigente_ate`. **[a confirmar]** marca o que as fontes não verificaram.

**Nomes fixos para JU-02 a JU-05:** Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico. Entidades de apoio criadas aqui (usar estes nomes, não inventar outros): Custa e depósito, Verificação de conflito, Termo de ciência de IA, Ciência, Regra de prazo, Calendário forense, Política de prazos, Inscrição monitorada, Perfil jurídico do usuário, Vínculo entre processos.

**Decisões do usuário já registradas (8/11/2026):** escritórios de 1 a 10 usuários primeiro; sigilo pela opção B com A como piso; todos os módulos de base de leis, na ordem da lista J9; a advogada da família e o contador da família validam o fluxo de prazos; conferência por especialista de área só no lançamento.

---

## 1. Escopo e princípios

### 1.1 O que o pacote traz e o que herda

| Função | Onde vive | Como o pacote usa |
| --- | --- | --- |
| Cadastro único, tarefas, documentos, eventos, ferramentas tipadas, notificações, tema | Plataforma | Nada novo no núcleo, salvo os ajustes da seção 8.1 |
| CRM e WhatsApp, Timesheet, App do cliente, agenda, assinatura | Plataforma | Lead, horas por Caso, "meu processo", audiências na agenda, mandato assinado |
| Financeiro do escritório (titular = escritório) | Plataforma | JU-05 só estende (êxito, sucumbência, repasse, conta de terceiros) |
| Time de agentes, motores, Consultor | Plataforma | Integrantes do pacote; Legal e Cálculo são plug-ins do pacote (JU-04) |
| Setores, perfil do cliente, Caso, Processo, Parte, Andamento, Comunicação, Prazo, Audiência, Mandato, Peça, Custa e depósito, Honorário-Jurídico | **Pacote** | Seções 2 a 4 |
| Catálogo de 234 atividades, calendário forense, regras de prazo, base de leis | **Pacote** | Seção 5; JU-03 e JU-04 |

### 1.2 Regras do pacote

| # | Regra | Consequência no desenho |
| --- | --- | --- |
| JR1 | **Ato privativo é da pessoa.** Assinar, protocolar, dar ciência com efeito de prazo, aceitar acordo, levantar valor e aconselhar o cliente nunca são do agente (J3) | Ferramentas desses atos exigem advogado inscrito e cartão; fora da lista de ações promovíveis |
| JR2 | **Nunca dar ciência sozinho.** Listar não dá ciência; abrir no Domicílio ou no painel dá e faz o prazo correr (regra C7 do 08) | `comunicacao.ciencia.registrar` é `da_ciencia`, irreversível, aprovação sempre |
| JR3 | **Prazo é regra, não IA.** Contagem, calendário, suspensões, dobro e alertas são determinísticos, com memória de cálculo; a IA só classifica e extrai | Nos prazos fatais, o advogado confirma (quatro olhos) |
| JR4 | **Sigilo profissional primeiro.** Isolamento por escritório (piso A); por Caso quando restrito; nenhum dado de Caso treina, avalia ou alimenta cache ou benchmark global (B) | Seção 6; reescrita do 9.2 do 07 para este pacote |
| JR5 | **Peça só sai de rascunho com revisão registrada.** O protocolo é humano e a plataforma não guarda certificado A3 | Estado da Peça; bloqueio na ferramenta |
| JR6 | **A responsabilidade é do advogado.** O cálculo é recomendação; a tela não promete "zero perda de prazo" | Texto de interface e termo de uso |
| JR7 | **Consentimento do cliente antes da IA** (Rec. CFOAB 001/2024, itens 4.x) | Termo de ciência de IA; Caso com `ia_permitida` |
| JR8 | **Nada se apaga.** Comunicação, Prazo e Andamento só crescem; correção é versão ou evento | Versões e cadeia de hashes (Fundações 5.2) |
| JR9 | **Venda só a advogados inscritos** (J5); a OAB não tem API de consulta (CNA), então a conferência é assistida | Perfil jurídico do usuário |
| JR10 | **O núcleo não muda por causa da área.** O que serve a mais de um pacote vira generalização do núcleo, pedida na seção 8.1 | Compartimento, enums extensíveis |

---

## 2. Setores fixos do pacote

### 2.1 Lista

Setores iguais às abas (decisão geral de 7/11/2026): o escritório renomeia a exibição e desativa o que não atende; **não se cobra por setor**. Regra de desenho: **setor é quem trabalha; área do direito é o que se trabalha.** A área é atributo do Caso (as 19 de J9, mais `outra`) e escolhe base de leis, checklist e setor padrão; setor existe só onde a rotina, o responsável padrão e o integrante diferem. `pacote_area = juridico`.

| Código | Nome | Cobre | Atividades JUR | Escritório pequeno | Dept. jurídico |
| --- | --- | --- | --- | --- | --- |
| `contencioso` | Contencioso | Civil, consumidor e bancário, imobiliário contencioso, administrativo, saúde e áreas sem setor próprio | 47 | Ativo | Ativo |
| `consultivo` | Consultivo e Contratos | Contratos, empresarial, compliance e LGPD, pareceres | 28 | Ativo | Ativo |
| `controladoria` | Controladoria de prazos | Captura, comunicações, prazos, calendário, certificados | 27 | Ativo | Ativo |
| `trabalhista` | Trabalhista | Empregado e empresa | 16 | Pela área escolhida | Opcional |
| `familia` | Família e Sucessões | Família, inventário, planejamento sucessório | 9 | Pela área escolhida | Opcional |
| `previdenciario` | Previdenciário | INSS, RPPS, assistencial | 11 | Pela área escolhida | Opcional |
| `penal` | Penal | Defesa criminal, execução penal | 11 | Desativado até o módulo | Opcional |
| `tributario` | Tributário | Defesa fiscal, planejamento | 10 | Opcional | Opcional |
| `depto_juridico` | Departamento jurídico | Triagem, escritórios externos, provisão, e-billing | 17 | Desativado | Ativo |
| `gestao_atendimento` | Gestão e Atendimento | **Setor da plataforma, reaproveitado** | 27 | Ativo | Ativo |
| `financeiro_escritorio` | Financeiro do escritório | **Setor da plataforma, reaproveitado** | 12 | Ativo | Ativo |

As 19 atividades "do caso" (ciclo do caso e atos como protocolar e revisar) pertencem ao setor do Caso (`regra_setor = do_caso`, seção 5.1). A soma fecha em 234.

**Por quê.** (1) Sete setores de área existem porque cada um tem base de leis, checklist e integrante próprios (J9: módulos distintos, Trabalhista e Previdenciário separados). (2) **Controladoria** é setor à parte porque o prazo é o centro do pacote (J3) e porque a secretária ou o paralegal que trata comunicações precisa de aba e integrante próprios, mesmo que no escritório de uma pessoa a conta tenha todos os setores. (3) Atendimento e Financeiro **não se duplicam** (DA-02.1; Fundações 4.1, adendo 23). (4) `depto_juridico` (JUR-191 a 207) é de outro cliente, a empresa com contencioso próprio; fica no desenho e desativado, e o perfil de departamento jurídico é construído depois. (5) Pequeno escritório não funde setores: dá à conta dele vários vínculos (decisão P1 das Fundações). O assistente de abertura pergunta a área principal (sugestão de J9) e ativa os setores.

### 2.2 Vínculo usuário × setor e perfis

O vínculo (modo `gestao` ou `execucao`), as exceções por tela e a carteira são os das Fundações 2.2. Os **perfis jurídicos** não são papéis novos: são **modelos de acesso** aplicados no convite (papel, setores, modo, exceções) mais a entidade **Perfil jurídico do usuário**: `usuario_id`, `perfil`, inscrições OAB (número, UF, principal ou suplementar, situação, `confirmada_na_fonte_em`), `supervisor_id` (obrigatório para estagiário, Rec. 3.6) e `substituto_usuario_id` (férias, o campo já existe no integrante).

| Perfil | Papel da plataforma | Setores e modo | Condição |
| --- | --- | --- | --- |
| Advogado sócio | Administrador (ou Gestor nos setores que gere) | Todos ativos | Inscrição OAB ativa |
| Advogado associado | Colaborador (Gestor se coordena área) | Áreas dele em `execucao` | Inscrição OAB ativa |
| Estagiário | Colaborador | Áreas dele em `execucao`, com supervisor | Sem atos privativos |
| Secretária | Colaborador | `gestao_atendimento` e `controladoria` | Sem atos privativos |
| Controladoria (paralegal) | Colaborador, ou Gestor da controladoria | `controladoria` em `gestao` ou `execucao` | Sem atos privativos |

---

## 3. Perfil do cliente jurídico e o Caso

### 3.1 Perfil do cliente jurídico (schema do pacote, versionado)

O Cliente é o do núcleo (Fundações 4.2): `tipo` (pf ou pj), `documento`, ciclo por serviço (o serviço `juridico` tem estado próprio) e `servicos_contratados`. O schema abaixo é a versão do perfil declarada pelo pacote; mudança real cria versão, correção de digitação é `cliente.corrigir_versao`.

| Campo | Descrição |
| --- | --- |
| `qualidade_juridica` | capaz, incapaz representado, espólio, massa falida, condomínio, outra **[a confirmar a lista]**. Dado do perfil, sem mudar o enum `tipo` do núcleo |
| `representante` | Pessoa (Fundações 4.3) e `tipo_representacao` (genitor, tutor, curador, inventariante, administrador, sócio-administrador); é quem assina o Mandato |
| `areas_de_interesse` | Lista das áreas de J9 |
| `hipossuficiencia` | Declarada ou não, data, documentos; a gratuidade é do Processo, não do cliente |
| `origem_cliente` | `origem` do Lead (Fundações 4.9) mais `indicado_por`; sem canal que fira o Provimento 205 **[a confirmar]** |
| `sigilo_reforcado_padrao` | Verdadeiro: todo Caso novo nasce restrito (cliente político, família, criminal) |
| `termo_ia` | Referência ao Termo de ciência de IA vigente (3.3) |
| derivados (só leitura) | Mandatos vigentes, situação da última Verificação de conflito, Casos ativos |

Regras: o Cliente só vai a `encerrado` sem Caso ativo, sem Mandato vigente (revogar ou renunciar antes) e sem parcela aberta (09). Um Cliente pode ter Contábil e Jurídico: é o mesmo cadastro.

### 3.2 Caso (agrupador)

O Caso agrupa 0 a n Processos e o trabalho consultivo do cliente (parecer, contrato). Modelo Cliente → Caso → Processos (SG-025).

| Campo | Descrição |
| --- | --- |
| `cliente_id`, `titulo`, `numero_interno` | Número interno do escritório (JUR-019) |
| `tipo`, `area_direito` | contencioso, consultivo ou misto; a área escolhe módulo de base, checklist e `setor_id` |
| `setor_id`, `responsavel_id`, `supervisor_id` | Setor responsável (resolve tarefas "do caso") e advogados |
| `equipe` | Usuários com acesso nominal e função (responsável, revisor, apoio) |
| `estado`, `estado_desde` | `em_estudo`, `aguardando_conflito`, `aguardando_contrato`, `ativo`, `suspenso`, `encerrado`, `arquivado` |
| `sigilo` | `normal`, `por_equipe` ou `restrito` (compartimento, seção 6.2) |
| `ia_permitida` | Derivado do Termo de ciência de IA; falso = integrantes não leem o conteúdo (6.4) |
| `valor_em_jogo`, `resultado` | Resultado no encerramento (alimenta jurimetria agregada) |
| `contrato_id`, `origem_lead_id` | Contrato de honorários (09; detalhe em JU-05) e lead de origem |
| `prazo_guarda_ate` | Guarda e descarte (JUR-029); prazo legal **[a confirmar]** |

**Estados e regras.** Em `aguardando_conflito` o Caso fica **bloqueado**: sem prazo, tarefa ou documento até a decisão do sócio (SG-029). Não vai a `encerrado` com Prazo aberto, Mandato sem tratamento, Custa pendente ou parcela aberta; reabrir é transição com motivo (Gestor). Cliente com vários Casos é normal; um Processo pertence a um só Caso.

### 3.3 Verificação de conflito e Termo de ciência de IA

**Verificação de conflito** (JUR-003, 004, 020; SG-029 e 030): `alvo` (lead, Caso ou consulta avulsa antes de aceitar), `executada_em/por`, `coincidencias` (regra, Parte ou Cliente encontrado, Caso), `resultado`, `decisao` (liberar, liberar com ressalva, recusar), `decidida_por` (sócio), `decidida_em`, `anexo_id` (consentimento das partes), `motivo`. A varredura é determinística (mesmo documento de cliente ativo ou ex-cliente, parte contrária em Caso ativo ou encerrado, mesmo grupo econômico, telefone ou e-mail repetido, advogado do escritório; nome idêntico gera alerta de homônimo, "nome não é identidade"). Decisão é permanente; rever cria registro novo.

**Termo de ciência de IA** em dois níveis: (a) do **cliente** (Rec. 4.1 a 4.3: propósito, limites, riscos, medidas de segurança, revisão humana; consentimento por escrito, arquivado, recusável): `cliente_id`, `versao_termo`, `abrangencia` (peças, pesquisa, análise de documentos), `aceito_em`, `forma`, `documento_id`, `recusado`, `revogado_em`; (b) do **usuário**, no primeiro uso da IA (para onde vão os dados; SG-046). Recusa do cliente faz `ia_permitida = falso` nos Casos dele.

---

## 4. Entidades

Toda tabela tem `caso_id` (menos as globais) e herda o sigilo do Caso. Cada uma lista campos principais, **estados**, **regras** e a ligação ao núcleo; a visão geral das ligações está em 4.11.

### 4.1 Processo

| Campo | Descrição |
| --- | --- |
| `caso_id`, `natureza` | judicial, administrativo (INSS, CARF) ou inquérito; o administrativo também gera Prazo |
| `numero_cnj` | 20 dígitos com dígito verificador **validado na entrada**; único por Caso e por escritório |
| `tribunal`, `segmento`, `grau` | Código CNJ; 1º grau, 2º grau, superior, turma recursal |
| `orgao_julgador`, `comarca`, `sistema` | Vara ou órgão; PJe, eproc, e-SAJ, Projudi, físico |
| `classe`, `assuntos` | Tabelas processuais unificadas |
| `valor_causa`, `fase` | Conhecimento, recursal, liquidação, cumprimento ou execução, arquivado |
| `segredo_justica` | público, segredo de justiça, sigilo absoluto (sinaliza e restringe, FX-008) |
| `gratuidade` | não pedida, pedida, deferida, indeferida |
| `situacao`, `data_ajuizamento` | Ver estados |

**Versão do processo:** classe, assunto, órgão, valor da causa, fase e sigilo vêm do tribunal e mudam; cada mudança capturada abre versão (`vigente_de/ate`). **Vínculo entre processos:** `processo_a`, `processo_b`, `tipo` (recurso de, incidente de, apenso, cumprimento de, execução de título, conexo, cautelar), `origem` (informado ou capturado).

**Estados:** `candidato` (descoberto numa Comunicação; **nunca vira Processo sozinho**, SG-019) → `ativo` → `suspenso` → `arquivado` ou `baixado`; `transitado` é marca de data. **Regras:** processo duplicado se funde (`fundido_em`), como no cliente; importar por lista de números CNJ valida o dígito; o enriquecimento (classe, órgão) vem de agregador ou DataJud **[a confirmar: DataJud é não comercial]**; sem número, o Processo existe mas "não há comunicação nem andamento a acompanhar".

### 4.2 Parte

Quem figura no Caso ou no Processo. **Não cria Pessoa para toda parte contrária**: guarda nome e documento próprios (minimização, LGPD) e liga a Pessoa ou Cliente só quando já existem.

| Campo | Descrição |
| --- | --- |
| `caso_id`, `processo_id` | Processo opcional (parte do Caso antes do ajuizamento) |
| `nome`, `documento`, `tipo_pessoa` | CPF ou CNPJ (a Pessoa do núcleo só tem CPF) |
| `papel` | cliente, parte contrária, litisconsorte, terceiro interessado, testemunha, perito, assistente técnico, advogado contrário, preposto |
| `polo`, `qualidade` | ativo, passivo, terceiro; autor, réu, reclamante, reclamada etc. |
| `oab` | Só para advogado contrário |
| `pessoa_id`, `cliente_id` | Opcionais |
| `na_base_de_conflito` | Padrão verdadeiro |

**Estados:** ativa, saiu do processo. **Versão:** entrada e saída por Processo com `vigente_de/ate`. **Regra:** a Parte alimenta a Verificação de conflito de todos os Casos, inclusive os de outro setor; o conteúdo do Caso restrito fica no compartimento, mas o **nome e o documento entram na varredura**, que só devolve "há coincidência, falar com o sócio" **[a confirmar com a advogada]**.

### 4.3 Andamento

| Campo | Descrição |
| --- | --- |
| `processo_id`, `fonte` | DataJud, agregador, painel, Comunicação, manual |
| `id_externo` | Deduplicação (reentrega não cria andamento) |
| `codigo_tpu`, `nome`, `complemento`, `ocorrido_em` | Movimento da tabela unificada e hora do tribunal; `capturado_em` |
| `relevancia` | relevante ou burocrático (classificado por agente ou pessoa) |
| `traducao_cliente` | Texto em linguagem simples (diz o que acontece agora e quando), marcado "gerado"; `liberado_por`, `visivel_ao_cliente` (padrão falso) |
| `conciliado_com` | Comunicação correspondente (JUR-051) |

Só inserção; correção é andamento novo. DataJud pode atrasar semanas e **não traz prazo nem intimação** (SG-023): a tela diz isso. O aviso ao cliente só sai com liberação do advogado até a promoção por confiança (02, 3.3).

### 4.4 Comunicação (publicação, intimação, citação)

O que chega do tribunal ou do órgão e pode gerar Prazo.

| Campo | Descrição |
| --- | --- |
| `tipo` | publicação, intimação, citação, notificação |
| `origem` | `djen`, `domicilio_judicial`, `painel_tribunal`, `diario_oficial`, `agregador`, `ecac_dte` (reuso do 08), `manual` |
| `processo_id`, `caso_id` | Nulos até o vínculo; sem vínculo fica no "acervo" (SG-019) |
| `destinatario` | Advogado inscrito, sociedade de advogados ou parte-cliente (CPF ou CNPJ) |
| `inscricao_monitorada_id` | De onde veio |
| `disponibilizada_em` | **Data de disponibilização** |
| `publicada_em` | Data considerada pela regra do canal |
| `regra_ciencia` | Regra aplicada, com a referência da norma |
| `ciencia_prevista_em` | Para canais com ciência tácita, a data em que ela se considera |
| `teor`, `teor_documento_id`, `origem_externa` | Texto (sempre dado, nunca instrução, R5) e arquivo no índice |
| `id_externo` | Deduplicação |
| `tipo_ato`, `classificado_por`, `trecho_prazo` | Despacho, decisão, sentença, acórdão, designação de audiência etc.; agente com confiança ou pessoa; trecho que justifica o prazo |
| `dias_no_ato` | Número lido ou sugerido (marca "ninguém leu este número escrito", SG-005) |
| `responsavel_triagem_id` | Dono da triagem; "sem dono ativo" é fila |

**Regras de ciência por canal** (J3, F1 e F2; **conferir Res. CNJ 455/2022 e 569/2024** [a confirmar]): DJEN, publicação no dia seguinte à disponibilização, prazo desde o primeiro dia útil seguinte; Domicílio, citação confirmada conta do 5º dia útil após a confirmação, ente público sem confirmação 10 dias corridos do envio, empresa privada sem confirmação o prazo não corre e a citação é refeita; intimação pessoal confirmada conta da confirmação, não confirmada após 10 dias corridos; na Justiça do Trabalho o Domicílio serve só à citação inicial. Quando as fontes divergem (DJEN e painel), vale a data mais cedo.

**Ciência** (entidade própria, só cresce): `comunicacao_id`, `tipo` (automática do canal, expressa, tácita calculada), `registrada_por` (**pessoa**, nunca integrante), `inscricao_oab`, `momento`, `canal`, `aprovacao_id` (cartão), `aviso_exibido` (texto e versão). Para ciência expressa, o cartão diz: "abrir agora dá ciência e o prazo passa a correr; sem abrir, a ciência se considera em DD/MM", com alerta D-3 da tácita.

**Estados:** `capturada` → `vinculada` → `classificada` → `tratada` (virou prazo, sem prazo, arquivada por ciência; SG-002) ou `cancelada_pelo_tribunal`; marcas `pendente_ciencia` e `suspeita_nome_errado` (JUR-050). Nada se apaga.

### 4.5 Prazo

| Campo | Descrição |
| --- | --- |
| `caso_id`, `processo_id`, `comunicacao_id` | Os dois últimos opcionais: prazo avulso (SG-010), prescrição, contrato, regulatório |
| `origem` | comunicação, lei, contrato, regulatório, manual (J3, 7.1) |
| `descricao`, `tipo_ato` | "Contestação", "Apelação" |
| `regra_id`, `dias`, `origem_do_numero` | Regra aplicada; dias; escrito no ato, sugerido pelo tipo ou informado |
| `unidade`, `multiplicador` | Dias úteis ou corridos; 1 ou 2 (Fazenda, MP, Defensoria, litisconsortes **[a confirmar alcance]**) |
| `termo_inicial`, `cadeia` | Data e a cadeia inteira: disponibilização, publicação, início, vencimento |
| `calendario_versao`, `sem_calendario` | Versão do calendário forense usada; aviso "sem calendário do tribunal" (erra para mais cedo) |
| `suspensoes` | Recesso (20/12 a 20/01), indisponibilidade, ato do tribunal, cada uma com fonte e comprovante |
| `vencimento_calculado`, `vencimento_confirmado` | Confirmado é imutável; muda só por versão com motivo ("por que a data andou", SG-014) |
| `fatal` | Perder extingue o direito (SG-006); definição **[a confirmar com a advogada]** |
| `data_interna_protocolo`, `data_interna_revisao` | Fatal menos a margem da Política de prazos |
| `responsavel_id`, `revisor_id`, `substituto_id` | Substituto padrão vem da ausência (FX-004) |
| `confirmado_por/em`, `conferido_por/em` | Advogado que confirma; segunda conferência condicional |
| `cumprimento` | `peca_id`, protocolo, `comprovante_id`, `juntada_conferida_em` |

**Memória de cálculo:** guardada em cada versão; base do comprovante de tempestividade (FX-002) e do pedido de devolução por justa causa (JUR-052).

**Estados:** `proposto` → `confirmado` (ou `aguardando_conferencia` se fatal, número sugerido e vencimento em menos de 7 dias, parâmetro) → `cumprido` (com comprovante); lados: `suspenso`, `devolvido` (nova data por versão), `cancelado` (com motivo). **`vencido_sem_cumprimento` nunca é silencioso:** gera alerta urgente à controladoria e ao sócio.

**Apoio global e local.** **Regra de prazo**: norma e artigo, ato gerador, dias, unidade, ramo (cível, trabalhista, penal, JEC, administrativo, INSS), regra do termo por canal, vigência, fonte e casos de gabarito; segue o modelo da Tabela de cálculo do 07 (global, aprovada pela equipe da plataforma, com teste de gabarito). **Calendário forense**: `tribunal`, `comarca`, `data`, `efeito` (não conta; não começa nem vence; sistema indisponível), `tipo` (nacional, estadual, municipal, local, recesso, ponto facultativo), `fonte`, `documento_id`; nacionais e recesso entram sozinhos, **datas móveis são propostas e o escritório ratifica** (SG-008). **Política de prazos** (FX-003, por escritório): margem interna (D0 a D-5 no mercado), escada de alertas, quem confere no D-1, parâmetro da segunda conferência; vale só para prazos futuros. **Inscrição monitorada**: `tipo` (OAB, sociedade, parte-cliente), `valor`, `responsavel_captura_id`, `conector_id`, `ultima_leitura_ok_em`, `ultima_falha_em`, `estado` (saudável, atrasada, parada, sem resposta), `cobertura`: base do alerta de captura parada (FX-001).

### 4.6 Audiência

| Campo | Descrição |
| --- | --- |
| `caso_id`, `processo_id`, `comunicacao_id` | Origem opcional na publicação (SG-018) |
| `tipo`, `modalidade` | Conciliação, instrução, julgamento ou júri, custódia, sessão de julgamento; presencial, virtual, híbrida |
| `data_hora`, `local_ou_link`, `responsavel_id` | |
| `partes_convocadas` | Preposto, testemunhas, correspondente (Partes) |
| `cliente_avisado_em`, `agenda_evento_id` | Aviso pela central; evento na agenda da plataforma |
| `ata_documento_id`, `resultado` | |

**Estados:** `designada` → `confirmada` → `realizada`; `adiada`, `redesignada` (nova linha ligada), `cancelada`, `ausencia_registrada`. Cada audiência gera tarefa de preparo (JUR-066, 067, 094, 120).

### 4.7 Mandato (procuração e substabelecimento)

| Campo | Descrição |
| --- | --- |
| `cliente_id`, `caso_id` | Caso opcional (mandato geral) |
| `tipo` | Procuração ad judicia, procuração administrativa (INSS), substabelecimento com ou sem reserva |
| `outorgados` | Advogados e sociedade, com OAB |
| `poderes` | Gerais e especiais (receber e dar quitação, transigir, confessar, desistir, renunciar) |
| `vigencia` | Outorga e validade |
| `assinatura` | Meio (ICP-Brasil, gov.br, avançada, física; Lei 14.063/2020, aceite varia por tribunal **[a confirmar]**), `documento_id`, evidências |
| `mandato_pai_id`, `substabelecido_a` | Cadeia |
| `credencial_id` | Quando vira acesso técnico (ex.: Meu INSS), no cofre; o Mandato é o ato, a Credencial é o acesso |

**Estados:** `rascunho` → `aguardando_assinatura` → `vigente` → `vencido`, `revogado`, `renunciado` (manter representação pelo prazo legal **[a confirmar]**), `substabelecido`. **Regra:** a Peça que transige ou desiste checa o poder no Mandato e avisa se faltar.

### 4.8 Peça

| Campo | Descrição |
| --- | --- |
| `caso_id`, `processo_id`, `prazo_id` | Prazo opcional (peça espontânea) |
| `tipo`, `modelo_id` | Inicial, contestação, réplica, recurso, parecer, notificação etc. |
| `versoes` | Cada versão: `documento_id`, autor (pessoa, integrante, modelo), `gerada_com_ia`, agente e versão do motor, citações conferidas (resultado do 07) |
| `revisao` | `revisor_id`, `revisada_em`, checklist pré-protocolo (citações, pedidos, anexos, assinatura, preparo) |
| `protocolo` | `protocolada_por` (**advogado**), `protocolada_em`, `numero_protocolo`, `recibo_documento_id`, `juntada_conferida_em` |

**Estados:** `rascunho` → `em_revisao` → `revisada` → `pronta_para_protocolo` → `protocolada` → `comprovada` (recibo e juntada conferida); `devolvida` (volta à revisão), `cancelada`. **Regras (JR5):** `pronta_para_protocolo` exige revisão registrada; peça gerada com IA exige revisão integral (Rec. 3.7); `protocolada` só por advogado, registrando o ato feito fora da plataforma. Contratos e pareceres consultivos são Documentos versionados; entidade própria de Contrato fica para JU-04 **[a confirmar]**.

### 4.9 Custa e depósito

`processo_id`, `tipo` (custas iniciais, preparo, porte, depósito recursal, depósito judicial, honorários periciais, diligência, multa), `valor_calculado` com memória (tabela do tribunal e versão), `valor_pago`, `guia_documento_id`, `comprovante_documento_id`, `prazo_id` (preparo vence com o recurso, JUR-075 e 098), `adiantada_pelo_escritorio` (liga a Despesa adiantada do 09, que já aceita "tarefa ou processo"). **Estados:** `a_calcular`, `guia_emitida`, `paga`, `comprovada`, `a_restituir`, `restituida`, `levantada`, `cancelada`. Depósito e valor levantado são **dinheiro do cliente**: tratamento em JU-05 (conta de terceiros).

### 4.10 Honorário-Jurídico (só o essencial; detalhe em JU-05)

Registro por Caso que estende o Item do contrato (09): `caso_id`, `item_contrato_id`, `natureza` (contratual, êxito, sucumbencial), `evento_gerador` (trânsito, acordo homologado, alvará, sentença; só para êxito e sucumbência), `base_e_percentual`, `estado` (previsto, devido, a faturar, faturado, recebido, retido no alvará, repassado, perdoado), `repasse_id`. Os eventos do processo (`processo.transitar`, `peca.comprovar`) avisam JU-05 que um evento gerador ocorreu; quem decide é o advogado. Faz parte da lacuna de mercado (êxito, sucumbência e repasse não aparecem em nenhum sistema público, J8).

### 4.11 Ligações com o núcleo

| Núcleo | Como as entidades do pacote se ligam |
| --- | --- |
| **Cliente** | Caso tem `cliente_id`; Mandato, Termo de IA e Verificação de conflito também. Parte pode apontar `cliente_id` |
| **Tarefa** | Prazo, Peça, Audiência e Custa geram Tarefas (origem `prazo`, `comunicacao` etc., enum extensível). `prazo_legal` = vencimento confirmado, `prazo_interno` = data interna, `risco = verdadeiro` nos fatais (segunda opinião), `quem_conclui` vem do catálogo. O vínculo é por tabela genérica (8.1). `tarefa.reprogramar` mexe só no interno; o legal muda por `prazo.corrigir` |
| **Documento** | Teor da Comunicação, versões da Peça, recibo, guia, Mandato e termo são Documentos com tipos do pacote, `caso_id` e `compartimento_id`. Visível ao cliente só pelas pastas visíveis e por liberação |
| **Conversa e Mensagem** | A conversa do cliente liga-se ao Caso (etiqueta). O andamento traduzido sai por `conversa.responder` com cartão. Mensagem do cliente com prazo implícito vira Comunicação manual |
| **Evento** | Todo efeito gera evento com `caso_id` e `processo_id` na referência de entidade (8.1); `evento.listar(caso)` é a linha do tempo do Caso; eventos de leitura provam "quem leu o quê" |

---

## 5. Catálogo de atividades do pacote

### 5.1 Como as 234 JUR viram o catálogo

Mesmo formato do contábil (Fundações 4.6), carregado como **dados do pacote** (JUR-001 a JUR-234, versão do catálogo própria). O que muda:

| Campo do catálogo | Origem em `atividades-juridico.json` |
| --- | --- |
| `id`, `atividade`, `base_legal`, `frequencia` | `id`, `atividade`, `base`, `freq` |
| `setor_codigo` | Mapa da 5.2 e `regra_setor` (`fixo` ou `do_caso`: o setor vem do Caso, resolvido ao criar a Tarefa; o núcleo só vê um `setor_id`) |
| `subarea` | `area` do JSON |
| `etapas` | Entrada (captação, proposta, procuração, abertura), Manutenção (execução, acompanhamento), Desligamento (encerramento) |
| `autonomia` | Já classificada: faz sozinho, prepara e a pessoa conclui, organiza e lembra |
| `nivel`, `integracao` | Nível lido do campo `fonte` (A, A$, B, F, Próprio, C-cert, D-assistido) |
| `hipotese`, `papel_ia` | `ia`; `risco_txt` = `risco`; `quem_faz` = `quem` |
| `dor`, `risco` | `dr` (nota inicial de descoberta, **não** a de triagem) |
| `horas_padrao` | **Vazio**: calculada pelo timesheet (unidade `ocorrencia` ou `caso`); as fontes não trazem horas **[a confirmar]** |
| `core` | Valor fixo `nao_depende`; o análogo é a origem (tribunal, DJEN, Domicílio, INSS) |
| `depende_de`, `fase`, `prio`, `nota` | Preenchidos aqui (5.3); `prio` e `nota` pela triagem do pacote, depois |
| **Campos do pacote** | `areas_direito`, `regra_setor`, `ato_privativo` (verdadeiro nos que exigem advogado inscrito), `entrega` (`pacote` ou `plataforma:<módulo>`), `origem_candidata` (JUR, SG-nnn, FX-nnn) |

Vinte atividades são **entregues pela plataforma** (JUR-001, 006, 007, 011, 015, 024, 026, 027, 030, 165, 208, 214, 215, 216, 217, 225, 226, 227, 228, 231: CRM, agenda, assinatura, Timesheet, Financeiro, App, permissões). Ficam no catálogo para gerar tarefa, tempo e autonomia, sem reconstruir a função (DA-02.1).

### 5.2 Classificação por setor, etapa e autonomia

| Setor | Faz sozinho | Prepara, pessoa conclui | Organiza e lembra | Total |
| --- | ---: | ---: | ---: | ---: |
| Contencioso | 2 | 41 | 4 | 47 |
| Consultivo e Contratos | 4 | 21 | 3 | 28 |
| Controladoria de prazos | 16 | 9 | 2 | 27 |
| Trabalhista | 1 | 15 | 0 | 16 |
| Família e Sucessões | 0 | 8 | 1 | 9 |
| Previdenciário | 0 | 10 | 1 | 11 |
| Penal | 0 | 8 | 3 | 11 |
| Tributário | 1 | 8 | 1 | 10 |
| Departamento jurídico | 2 | 10 | 5 | 17 |
| "Do caso" (setor resolvido pelo Caso) | 4 | 14 | 1 | 19 |
| Gestão e Atendimento (plataforma) | 12 | 10 | 5 | 27 |
| Financeiro do escritório (plataforma) | 6 | 5 | 1 | 12 |
| **Total** | **48** | **159** | **27** | **234** |

**Etapa do ciclo:** Entrada 35 (captação 9, proposta 5, procuração 5, abertura 16), Manutenção 194 (execução 141, acompanhamento 53), Desligamento 5. O caso tem começo, meio e fim (o contábil é recorrente), então Manutenção é a tramitação.

**Ajustes de autonomia propostos** (as 234 ficam como no JSON, salvo estes): JUR-057 se divide em classificar (faz sozinho) e avisar o cliente (prepara, pessoa conclui, até a promoção por confiança); JUR-032 captura é faz sozinho, **nunca** a ciência; JUR-116 e 126 (prisão, réu preso) ficam "organiza e lembra" com alerta de horas, atendimento humano.

### 5.3 Fases de implantação (0 a 5)

Seguem a ordem do ranking J9 para as áreas e a de J3 e J4 para o resto. A fase diz quando a atividade ganha o integrante completo; o Prazo da contestação, por exemplo, corre desde a fase 1, e a Peça com modelo e checklist desde a 2, mas a minuta com IA só chega com o módulo de base da área.

| Fase | Entrega | Atividades JUR | Faz sozinho / prepara / organiza |
| --- | --- | --- | --- |
| **0** Cadastro e sigilo | Cliente jurídico, Caso, Processo manual, Parte, conflito, Mandato, termo de IA, sigilo por Caso, setores, catálogo | 24 | 10 / 12 / 2 |
| **1** Prazos e comunicações (núcleo do pacote) | Comunicação (DJEN, Domicílio só listar), Prazo, calendário, escada, dupla checagem, saúde da captura, agenda | 21 | 12 / 8 / 1 |
| **2** Peça, audiência, cliente | Peça com revisão, Audiência, Andamento, custas e preparo, painéis (assistido), "meu processo", certificados | 27 | 10 / 15 / 2 |
| **3** Honorários e conta de terceiros | Honorário-Jurídico, repasse, retenção, despesas, peritos (com JU-05) | 13 | 5 / 6 / 2 |
| **4** Base de leis, ondas 1 a 3 de J9 | Civil, Família, Trabalhista e Previdenciário, Consumidor; contratos | 76 | 6 / 67 / 3 |
| **5** Ondas 4 a 7 e departamento jurídico | Penal (com o portão de J4), Empresarial, Tributário, Imobiliário, Saúde, Administrativo, LGPD e a cauda; jurimetria; dept. jurídico | 73 | 5 / 51 / 17 |

**Dependências.** Tudo depende da fase 0; a 1 depende de Processo e Caso; a 2 de Prazo; a 3 do Financeiro (09); a 4 do núcleo N0 de J9 (calendário e índices) e de Civil antes de Família, Consumidor e Empresarial; Previdenciário depois de Trabalhista; Penal só após a camada de lei no tempo provada e a política de dados sensíveis. Penal está na posição 5 da lista e é construído depois de Consumidor (única inversão de J9).

### 5.4 As 20 atividades mais críticas

As 10 primeiras são as de J3 (gravidade 5, consequência irreversível); as demais completam o fluxo de prazos e os atos que sustentam o recurso.

| # | ID | Atividade | Setor | Autonomia | Fase |
| ---: | --- | --- | --- | --- | :-: |
| 1 | JUR-032 | Capturar publicações do DJEN | Controladoria | Faz sozinho | 1 |
| 2 | JUR-033 | Capturar citações e intimações do Domicílio (listar; ciência só por pessoa) | Controladoria | Prepara | 1 |
| 3 | JUR-034 | Capturar intimações nos painéis (assistido) | Controladoria | Prepara | 2 |
| 4 | JUR-036 | Classificar o ato | Controladoria | Prepara | 1 |
| 5 | JUR-038 | Definir o termo inicial | Controladoria | Prepara | 1 |
| 6 | JUR-039 | Contar em dias úteis com calendário forense | Controladoria | Faz sozinho | 1 |
| 7 | JUR-063 | Contestação | Contencioso | Prepara | 4 |
| 8 | JUR-071 | Apelação e recursos de 15 dias úteis | Contencioso | Prepara | 4 |
| 9 | JUR-023 | Prescrição e decadência | Do caso | Prepara | 2 |
| 10 | JUR-095 | Liquidação no PJe-Calc | Trabalhista | Prepara | 4 |
| 11 | JUR-037 | Identificar o prazo que nasce do ato | Controladoria | Prepara | 1 |
| 12 | JUR-040 | Suspensão de 20/12 a 20/01 e por indisponibilidade | Controladoria | Faz sozinho | 1 |
| 13 | JUR-041 | Calendário por tribunal e comarca, com prova do feriado local | Controladoria | Prepara | 1 |
| 14 | JUR-044 | Escada de alertas D-5, D-3, D-1, dia | Controladoria | Faz sozinho | 1 |
| 15 | JUR-048 | Dupla checagem de fatais e publicações sem tratamento | Controladoria | Faz sozinho | 1 |
| 16 | JUR-046 | Protocolar e guardar o recibo (humano) | Do caso | Prepara | 2 |
| 17 | JUR-052 | Devolução de prazo por justa causa | Do caso | Prepara | 2 |
| 18 | JUR-075 | Preparo recursal e porte | Contencioso | Prepara | 2 |
| 19 | JUR-219 | Revisão de peça com checklist pré-protocolo | Do caso | Prepara | 2 |
| 20 | JUR-229 | Certificado A3 da OAB e acessos aos tribunais | Controladoria | Organiza | 1 |

Ficam fora da lista, com nota 5: JUR-098 (depósito recursal), 116 e 126 (prisão e réu preso), 185 (incidente de segurança), 212 (repasse com retenção, fase 3).

### 5.5 Candidatas SG (J7) e FX (J8): decisão de cada uma

**Entra** (com a fase), **Depois**, **Não**, ou **Plataforma** (já é função do núcleo; vira ajuste pedido, seção 8).

| Decisão | Itens | Onde |
| --- | --- | --- |
| Entra, fase 0 | SG-025, 029, 030, 035 (agente nunca negocia valores), 036 (termo versionado), 046 (consentimento por pessoa); FX-008 (sigilo por Caso) | 3 e 6 |
| Entra, fase 1 | SG-001 a 010, 012 a 016, 019, 020 (importação; fonte do enriquecimento a confirmar), 055 (Meu Dia); FX-001 (saúde da captura), 002 (comprovante de tempestividade), 003 (política de prazos), 004 (cobertura de ausência), 007 (migração e exportação) | JU-02, JU-03 |
| Entra, fase 2 | SG-017 (metas por resultado, sem ranking), 018, 023, 037 (versões de modelo), 058; FX-006 (playbooks por molde, em qualquer plano), 009 (confiança e aprendizado local) | JU-02, JU-03 |
| Entra, fase 3 | SG-050 (faturar horas, retainer, honorário fixo) | JU-05 |
| Entra, fase 4 | SG-032 (fichas por área), 038, 039, 040, 041 (STJ aberto), 044 (cálculo com regra por linha) | JU-04 |
| Depois | SG-011 (INSS, fase 4), 021, 022, 024, 026, 027 (fase 2), 028 (correspondente, fase 3), 042, 043, 045, 060 (fase 5), 059 (preço, JU-05); FX-005 (distribuição, fase 2), 013 (safras, fase 5) | |
| Plataforma | SG-031, 033, 034, 047 (ferramentas com dado de Caso nascem sem exposição ao MCP), 048, 049, 051, 052, 053, 054, 056, 057 (suporte de 8 h não: vale a sessão de tela de 30 minutos); FX-010, 011 | 8.1 |
| Não | FX-012 (pontuação de produtividade: vigilância e LGPD trabalhista), 014 (cobrança em volume), 015 (marketplace de correspondentes) | |

---

## 6. Permissões e sigilo

### 6.1 Matriz por perfil

Níveis das Fundações: **L** ler, **R** rascunhar, **E** executar, **—** nada. "Ato" = só advogado inscrito (`condicao_pessoa`, 8.1).

| Capacidade | Sócio | Associado | Estagiário | Secretária | Controladoria |
| --- | --- | --- | --- | --- | --- |
| Cadastrar Cliente, Caso, Processo, Parte | E | E | R | E | E |
| Propor e calcular Prazo | E | E | E | R | E |
| Confirmar prazo **não fatal** | E | E | R | — | E |
| Confirmar prazo **fatal** e segunda conferência | E (ato) | E (ato) | — | — | — |
| Registrar ciência (Domicílio, painel) | E (ato, cartão) | E (ato, cartão) | — | R | R |
| Dar baixa e conferir juntada | E | E | R | R | E |
| Rascunhar Peça | R | R | R | — | R |
| Aprovar e registrar protocolo | E (ato) | E (ato) | — | — | — |
| Emitir e coletar assinatura do Mandato | E | E | R | E | L |
| Revogar, renunciar, substabelecer | E (ato) | E (ato) | — | — | — |
| Decidir conflito e restringir Caso | E | L (consulta) | — | L (consulta) | L |
| Política de prazos; ratificar calendário | E | L | L | L | E (ratifica; sócio aprova) |
| Honorário-Jurídico e financeiro | E | L (próprios) | — | — | — |
| Ver auditoria de acesso a Caso restrito | L (Administrador) | — | — | — | — |

O Cliente (app) vê só o que o advogado libera: andamento traduzido, documentos nas pastas visíveis, agenda, mandato e termos para assinar.

### 6.2 Acesso por Caso e sigilo reforçado

1. **Padrão:** quem tem o setor e, se a carteira está ligada, o Cliente, vê o Caso (Fundações 3.2).
2. **Por equipe:** só a `equipe` nominal do Caso.
3. **Restrito (sigilo reforçado):** o Caso ganha um **compartimento** (generalização do núcleo, 8.1) que cobre Tarefa, Documento, Conversa, Evento, memória e índice de busca. Só membros nominais entram; **o Administrador não entra automaticamente**: inclui-se com motivo, o que gera evento e aviso aos membros **[a confirmar com a advogada]**.
4. Cliente com `sigilo_reforcado_padrao` cria Casos restritos. Segredo de justiça sinaliza o Processo e restringe por padrão.
5. A busca (vetorial e textual), a memória dos integrantes e o resumo diário respeitam o compartimento **antes** de devolver (mesma função de autorização, R8).
6. Notificação e resumo diário de Caso restrito mostram só "há novidade no Caso X" a quem é membro; nunca o conteúdo em canal externo.
7. **Suporte:** a sessão de tela e o diagnóstico de leitura (adendo 26) **não mostram nem leem** Caso restrito **[a confirmar parecer]**.

### 6.3 O que o agente de IA pode ler e fazer

| Lê | Faz sozinho | Prepara, pessoa conclui | Nunca |
| --- | --- | --- | --- |
| Caso, Processo, Parte, Comunicação, Prazo, Andamento, Peça, Mandato, dentro do escopo do dono e do compartimento; só se `ia_permitida` | Vincular comunicação ao Processo, classificar ato, **propor** prazo e calcular, criar tarefas, alertar na escada, conciliar andamento e publicação, dupla checagem diária, detectar nome errado, importar Processo como candidato | Minuta de Peça, tradução de andamento ao cliente, cartão de ciência, preparo, pedido de devolução de prazo | **Confirmar prazo fatal, dar ciência, protocolar, assinar, aceitar acordo, levantar valor, aconselhar o cliente, decidir conflito, restringir ou abrir Caso restrito, enviar mensagem ao cliente sem liberação** |

As ferramentas de ciência, protocolo e confirmação de fatal são `nao_promovivel` (como o pagamento no BPO, B3): nenhuma promoção por confiança as libera.

### 6.4 Sigilo do aprendizado (opção B com A como piso)

| Regra | Efeito |
| --- | --- |
| **Piso A** | Respostas aprovadas, teses e peças alimentam só o índice do próprio escritório; Caso restrito, só o do compartimento |
| **B** | A plataforma aprende com lei, STJ aberto e correções de **advogados do grupo** sobre perguntas públicas e **casos sintéticos** |
| Nenhum Caso treina | Nada de Caso ou Cliente entra em benchmark global, cache semântico global ou treino, nem no provedor do modelo (sem treino por contrato e por arquitetura) |
| O "correta ou incorreta" do advogado cliente | Fica no escritório; não sobe |
| Registro de IA por Peça | Quem pediu, agente e versão, fontes, quem revisou (JUR-234) |
| Opção C | Só no futuro, áreas não sensíveis, após parecer de ética |

### 6.5 Auditoria e testes do pacote

Toda leitura de Caso restrito grava evento (`argumentos_resumo` mínimo); o Administrador vê **quem acessou e quando**, não o conteúdo. A cadeia de hashes vale para Prazo e Peça. Testes novos, somados aos das Fundações 11: (1) vazamento entre Casos restritos (usuário de fora, integrante, busca vetorial, memória, notificação); (2) `da_ciencia` sem cartão é recusado, também por integrante promovido; (3) 10 casos de contagem de prazo contra gabarito validado pela advogada e pelo contador (feriado, recesso, dobro, Domicílio); (4) confirmado imutável: só versão com motivo; (5) integrante não lê Caso com `ia_permitida = falso`; (6) nada de Caso chega ao benchmark global.

---

## 7. Eventos e ferramentas

### 7.1 Ferramentas (nomes tipados, padrão `entidade.acao`)

| Família | Ferramentas | Nível e observação |
| --- | --- | --- |
| `caso.*`, `conflito.*` | `caso.criar`, `mudar_estado`, `restringir`, `conceder_acesso`, `revogar_acesso`, `encerrar`; `conflito.consultar` (ler, sem cadastrar), `conflito.varrer`, `conflito.decidir` (executar, sócio) | `restringir` e `decidir` exigem Gestor ou Administrador |
| `processo.*` | `criar`, `importar_por_cnj`, `vincular`, `versionar`, `fundir`, `arquivar`, `listar`; `processo.andamento.registrar` | Importar valida o dígito; candidato nunca vira Processo sozinho |
| `comunicacao.*` | `listar` (ler), `vincular`, `classificar` (rascunhar), `tratar`, **`ciencia.registrar`** | `ciencia.registrar`: executar, `da_ciencia`, irreversível, `exige_aprovacao = sempre`, `nao_promovivel` |
| `prazo.*` | `propor` (rascunhar), `confirmar`, `conferir`, `corrigir` (versão com motivo), `cumprir`, `cancelar`, `devolver`, `listar`; plug-in `calculo.prazo_processual` (ler) | `confirmar` de fatal e `conferir` só advogado inscrito |
| `peca.*` | `criar`, `rascunhar`, `versionar`, `enviar_revisao`, `revisar`, `aprovar_para_protocolo`, `registrar_protocolo`, `registrar_comprovante`, `conferir_juntada` | `registrar_protocolo` é irreversível, só advogado |
| `mandato.*` | `emitir` (rascunhar), `enviar_assinatura`, `registrar_assinatura`, `substabelecer`, `revogar`, `renunciar`, `listar` | Assinatura pelo conector de assinatura (08) |
| `audiencia.*`, `custa.*` | `agendar`, `remarcar`, `registrar_resultado`; `custa.calcular` (ler), `registrar`, `comprovar` | |
| `termo_ia.*`, `captura.*` | `termo_ia.gerar`, `registrar_aceite`, `recusar`; `captura.saude` (ler), `inscricao.confirmar_oab` | Confirmação da OAB é assistida (sem API) |
| `honorario.*` | `registrar_evento_gerador`, `listar` | Resto em JU-05 |

### 7.2 Eventos

| Evento | Quando |
| --- | --- |
| `processo.criar`, `processo.versionar`, `processo.transitar`, `processo.fundir` | Ciclo do Processo; `transitar` avisa JU-05 |
| `comunicacao.receber`, `.vincular`, `.classificar`, `.tratar`, `.ciencia.registrar` | Cadeia da Comunicação; `ciencia.pendente_vencer_em_3_dias` na tácita |
| `prazo.propor`, `.confirmar`, `.conferir`, `.corrigir`, `.cumprir`, `.cancelar`, `.devolver` | Ciclo do Prazo |
| `prazo.vencer_em_5_dias`, `.vencer_em_3_dias`, `.vencer_em_1_dia`, `.vencer_hoje`, `.vencer_sem_cumprimento` | Escada (job diário); a última é urgente |
| `peca.criar`, `.enviar_revisao`, `.revisar`, `.protocolar`, `.comprovar` | Ciclo da Peça |
| `mandato.assinar`, `.vencer_em_30_dias`, `.revogar`, `.substabelecer`, `.renunciar` | Ciclo do Mandato |
| `audiencia.designar`, `.vencer_em_3_dias` (antes da data), `.registrar_resultado` | |
| `captura.fonte.parar`, `.retomar`, `.lacuna` | Saúde da captura (FX-001) |
| `caso.restringir`, `.acesso.incluir`, `.acesso.revogar`, `conflito.decidir`, `termo_ia.recusar` | Sigilo e consentimento |

### 7.3 Gatilhos para o Time de agentes

| Gatilho (evento) | Integrante | O que faz | Limite |
| --- | --- | --- | --- |
| `comunicacao.receber` | Controladoria | Vincula, classifica, propõe Prazo e tarefa; agrupa lote do dia | Não confirma fatal nem dá ciência |
| `captura.fonte.parar` | Controladoria | Avisa o sócio e a controladoria, urgente; sugere recaptura | Só avisa |
| `prazo.vencer_em_3_dias` | Setor do Caso | Confere a peça pronta, cobra o revisor | Notificação por prioridade |
| `prazo.vencer_sem_cumprimento` | Controladoria | Alerta urgente a todos os responsáveis; abre rascunho de devolução se há justa causa | Rascunho apenas |
| `mandato.vencer_em_30_dias` | Setor do Caso | Propõe renovação | Cartão |
| `processo.transitar` | Financeiro | Avisa que há evento gerador de honorário | Cartão |
| job diário | Controladoria | Dupla checagem de publicações sem tarefa e de fatais (JUR-048) | Sem modelo no passo 0 |

Um integrante por setor com equipe (02, 3.2): na fase 1 só a **Controladoria**; os demais entram com a fase de cada setor.

---

## 8. Ajustes pedidos, ordem de construção e perguntas

### 8.1 Às Fundações e aos subplanos 02 a 09

| Onde | Ajuste pedido |
| --- | --- |
| Fundações 2.2 e 4.1 | `pacotes_area` aceita `juridico`; setores da seção 2; `gestao_atendimento` e `financeiro_escritorio` reaproveitados |
| Fundações (novo, **o principal**) | **Compartimento** genérico: `compartimento_id` opcional em Tarefa, Documento, Conversa, Evento, Memória e índice de busca; quem não é membro não vê, nem na busca. O pacote o cria por Caso restrito. Alternativa: gancho do pacote na função `autorizar` |
| Fundações 4.8, 4.11, 5.1 | Enums extensíveis por pacote (`Tarefa.origem`, `Documento.tipo`, `Credencial.tipo`, `servicos_autorizados` com `dar_ciencia`); tabela genérica de **vínculo** tarefa, documento e conversa com entidade de pacote; `entidade_ref` {tipo, id} no Evento |
| Fundações 6.1 | Na ferramenta: `condicao_pessoa` (advogado inscrito) e `nao_promovivel` (hoje só no BPO) |
| Fundações 4.2 | `encerrado` bloqueia por Caso ativo (gancho por pacote); perfil por pacote já previsto |
| Fundações 5.4 | `caso_id` na sessão de trabalho |
| Fundações adendo 18 e 26 | Melhoria contínua sem opt-in **não vale** no pacote Jurídico; suporte não vê Caso restrito |
| 02 | Integrante Controladoria e por setor; ciência, protocolo e confirmação de fatal fora da promoção; gatilhos de 7.3; memória do escritório sem Caso restrito |
| 03 | Item lateral do pacote (JU-02); seletor de cliente com Caso; calendário da Home com prazos, cor por pacote; bloco "Tarefas deste setor" por setor jurídico |
| 04 | `lead.fechar_contrato` exige Verificação de conflito decidida; etiqueta por Caso; modelos de mensagem de andamento em linguagem simples; limites do Provimento 205 na régua |
| 05 | Atividades jurídicas com unidade `ocorrencia` ou `caso`; extensão detecta o número CNJ só como identificador; domínios dos tribunais na lista de domínios |
| 06 | Serviço `juridico` com áreas (processos, documentos, agenda, pendências, honorários); assinatura avançada ou qualificada para Mandato e termo; código por e-mail só para o sigiloso; visibilidade por Caso |
| 07 | **Reescrever o 9.2 para este pacote** (6.4); Legal com três datas, estado do precedente, tese em vez de ementa, divergência com abstenção; `calculo.prazo_processual` e `calculo.custas`; busca e cache com compartimento; benchmark só com casos sintéticos |
| 08 | Conectores DJEN, Domicílio, DataJud, agregador; coletor em região brasileira; `da_ciencia` (C7) e robô fora do MVP (C8); A3 sempre humano |
| 09 | Item do contrato por Caso e `evento_gerador`; conta de terceiros precisa de titular "cliente" ou marca `de_terceiros`; despesa adiantada ligada a Custa |
| JU-02 | Telas sobre estas entidades e estados; sem entidade nova |
| JU-03 | Regras de ciência (4.4), Prazo e calendário (4.5), `Inscrição monitorada`, conectores e saúde da captura |
| JU-04 | Regra de prazo como Tabela de cálculo; módulos por Caso, ondas de J9; Contrato como entidade **[a confirmar]** |
| JU-05 | Honorário-Jurídico (4.10), Custa (4.9), conta de terceiros, êxito e sucumbência |

### 8.2 Ordem de construção (etapas pequenas)

Só começa depois do BPO. A cada etapa, teste de vazamento por Caso e revisão da advogada e do contador da família.

| # | Etapa | Entrega | Fase |
| --- | --- | --- | :-: |
| J1 | Pacote como dados | `juridico` na assinatura, setores, modelos de acesso, catálogo carregado | 0 |
| J2 | Compartimento | Sigilo por Caso no núcleo e teste de vazamento | 0 |
| J3 | Cliente, Caso, Parte | Perfil jurídico, conflito, Termo de IA, Perfil jurídico do usuário | 0 |
| J4 | Processo e Mandato | Processo manual e por número CNJ, vínculos, assinatura de Mandato | 0 |
| J5 | Dados de prazo | Regra de prazo, calendário forense, Política de prazos, casos de gabarito | 1 |
| J6 | Prazo | Propor, confirmar, versões, memória de cálculo, escada, tarefas ligadas | 1 |
| J7 | Comunicação | Entrada manual, depois Inscrição monitorada e DJEN no Brasil, saúde da captura | 1 |
| J8 | Domicílio e ciência | Listar; ciência por pessoa com cartão | 1 |
| J9 | Andamento e Audiência | DataJud ou agregador, audiência a partir da comunicação | 2 |
| J10 | Peça e custas | Revisão, protocolo registrado, comprovante, preparo | 2 |
| J11 | Honorário-Jurídico | Com JU-05 | 3 |
| J12 | Módulos de área | Um por onda de J9, cada um com catálogo, checklist, tabelas e integrante | 4 e 5 |

### 8.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| P1 | O núcleo pode ganhar o **compartimento** (sigilo por Caso)? | Sim, genérico; serve a outros pacotes | "Posso pedir que o sistema-base saiba esconder um caso inteiro de quem não faz parte dele?" |
| P2 | O sócio vê um Caso restrito? | Não automaticamente; entra com motivo e os membros são avisados | "O sócio deve ser barrado de um caso sigiloso até pedir acesso, e os outros ficam sabendo?" |
| P3 | Quem faz a segunda conferência de prazo fatal no escritório de um só advogado? | A controladoria ou a própria pessoa reconfirma em outro horário; vale a regra de fatal sugerido com menos de 7 dias | "Se só há um advogado, quem confere o prazo mais perigoso antes de ele vencer?" |
| P4 | O que é "prazo fatal"? | Perder extingue o direito (SG-006); os demais são prazos comuns **[a confirmar]** | "Qual prazo a advogada chama de fatal?" |
| P5 | A margem interna padrão? | D-2 útil, ajustável de D0 a D-5 | "Quantos dias antes do vencimento a equipe deve terminar a peça?" |
| P6 | A ciência no Domicílio: autorização por cliente ou por comunicação? | Autorização geral do titular **e** cartão a cada ciência | "O cliente autoriza uma vez e ainda confirmamos cada abertura?" |
| P7 | Cliente que recusa IA | Caso segue sem IA; só regras de prazo e cadastro | "Se o cliente disser não à IA, o caso continua só com o que não usa IA?" |
| P8 | Nove setores do pacote bastam para o escritório pequeno? | Sim; os desligados não aparecem nem custam | "Cada área de atuação com aba própria, o que não usa some. Serve?" |
| P9 | Quem mantém o calendário forense? | A plataforma carrega com fonte e data; o escritório ratifica; custo de curadoria **[a confirmar]** | "O sistema traz os feriados dos tribunais e o escritório só confirma?" |
| P10 | Guardar nome e CPF ou CNPJ da parte contrária sem criar Pessoa | Sim, por minimização | "A parte contrária entra só como dado do caso, sem virar cadastro?" |
| P11 | Conferir a OAB no cadastro do usuário | Conferência manual do nome na ativação (sem API da OAB) | "Basta conferirmos a inscrição na OAB à mão, uma vez, ao cadastrar cada advogado?" |
| P12 | Entidade de Contrato (cláusulas, vigência) | Fica em JU-04, depois do Prazo | "Os contratos do consultivo podem esperar a fase dos prazos?" |

## Decisões do usuário (9/11/2026)

Resposta: **segue a hipótese em todas as perguntas** (tabela de perguntas para aval acima). Ficam aprovadas como escritas.

- **P1 a P12 aprovadas.** O núcleo ganha o *compartimento* (sigilo por Caso) de forma genérica; nove setores do pacote; OAB conferida à mão na ativação; parte contrária só como dado do Caso; calendário forense carregado pela plataforma e ratificado pelo escritório (custo de curadoria **[a confirmar]**); "prazo fatal" = perda extingue o direito, e a advogada da família confirma a definição **[a confirmar]**.

- **Regras unificadas** (valem nos cinco subplanos; em conflito, vale esta lista):
  1. **Caso restrito e sócio:** o sócio não entra automaticamente; pede acesso com motivo, o acesso fica registrado e os membros do Caso são avisados.
  2. **Segunda conferência do prazo fatal (um só advogado):** recontagem independente do motor, confirmação do advogado e segundo aviso no dia seguinte; colega de fora é opcional. Só advogado inscrito confirma prazo fatal e dá ciência.
  3. **Margem interna:** padrão por tipo de peça (JU-03: 5 dias úteis em recurso e contestação, 2 em manifestação simples); D-2 útil onde não houver regra do tipo; a advogada ajusta de D0 a D-5.
  4. **Domicílio Judicial:** ciência nunca delegável; autorização geral do titular mais cartão a cada ciência; na primeira semana de cada escritório a lista roda com aprovação do gestor. Listar nunca dá ciência.
  5. **Cache global:** só perguntas canônicas da base; perguntas dos advogados ficam no escritório.
  6. **Gestão sem Painel:** mora dentro do Jurídico, uma só, com Clientes (DA-02.1).
  7. **Contrato:** a entidade de cláusulas e vigência (consultivo) se chama *Contrato*; o de honorários é *Contrato de honorários* (JU-05) e não colide.
  8. **Avisos com datas diferentes:** vale a mais cedo, com pergunta ao advogado; o motor mostra a origem do número ("lido no texto" ou "sugerido"), não porcentagem de confiança.
  9. **Antes de usar casos reais:** parecer de advogado especializado (sigilo, LGPD, termos, responsabilidade, seguro) e modo sombra de algumas semanas sem alerta real.
