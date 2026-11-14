# Subplano JU-04 · Motor jurídico e base de leis modular

**Versão 0.1 · 8/11/2026 · planejamento do pacote Jurídico/Advocacia. Nada será desenvolvido agora: o BPO fecha antes.** Herda o [Subplano 07](../07-Motores-e-Consultor.md) (roteador, M1 a M4, verificação, Consultor, benchmark) e o [Plano de Ingestão](../../Plano_de_Ingestao_da_Base_Legal.md). Apoia-se na [Síntese](../../Sintese_Pacote_Juridico.md) e nas pesquisas J1, J4, J5, J7, J8 e J9. Preços e limites são **de teste**; **[a confirmar]** marca o que as fontes não verificaram. JU-01 (dados), JU-02 (painel), JU-03 (prazos e conectores) e JU-05 (honorários e preço) são escritos em paralelo; nomes que dependem deles são provisórios. Entidades fixas do pacote: Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico.

---

## 1. Escopo e princípios

### 1.1 O que este subplano entrega

A camada jurídica do motor (seção 2); a base de leis modular (3); o Consultor jurídico (4); sigilo e aprendizado (5); verificação, benchmark e gates (6); custos e planos de IA (7); ajustes, etapas e perguntas (8). Fora daqui: contagem de prazos e conectores (JU-03), entidades (JU-01), telas (JU-02), honorários e preço (JU-05).

### 1.2 Decisões do usuário que governam o texto

| Decisão (8/11/2026) | Efeito aqui |
|---|---|
| Escritórios pequenos primeiro | Pacotes enxutos; consumo de IA que não corroa a margem do plano de entrada |
| Todos os módulos existem, na ordem de J9 | 19 módulos em ondas, com uma inversão documentada (Consumidor antes de Penal) |
| Sigilo: B com A como piso | Aprende com a base pública e com correções de advogados do grupo; cada escritório isolado; funciona com todos os escritórios juntos **por esse caminho** |
| Advogada da família valida prazos; contador da família confere | Validação interna sem selo de especialista |
| Especialista por área só no lançamento | Gate de lançamento por módulo (6.4) |

### 1.3 O que o direito exige de diferente

| Tema | Contábil (07) | Jurídico |
|---|---|---|
| Tempo | Uma `data_de_referencia` | **Três datas**: fato, ato e hoje |
| Unidade | Dispositivo | Dispositivo **e** tese com fatos; precedente tem **estado** e **força** |
| Conflito | Exceção | **Divergência entre tribunais é rotina**: sem tese vinculante, apresenta e não escolhe |
| Prazo | Obrigação, calendário | **Prazo fatal** processual, por regra determinística (JU-03) |
| Quem responde | Contador | **Advogado inscrito**; o sistema é apoio |
| Aprendizado entre escritórios | Anonimizado, sem opt-in (07, 9.2) | **Não há**: só base pública e advogados do grupo |

### 1.4 Regras invioláveis

R-M1 a R-M8 do 07 valem. O pacote soma:

| # | Regra |
|---|---|
| R-J1 | **Três datas** em toda consulta; a resposta diz qual usou |
| R-J2 | **Precedente só com estado e força na data**; superado nunca é citado como vigente |
| R-J3 | **Sem tese vinculante e com divergência, apresenta e não escolhe** |
| R-J4 | **Prazo e data processual só da função de prazo do JU-03**; o modelo nunca conta dia |
| R-J5 | **Conteúdo de Caso nunca sai do escritório**: não treina, não avalia, não alimenta cache ou benchmark globais |
| R-J6 | **Peça é rascunho até revisão assinada por advogado**; protocolo nunca é automático |
| R-J7 | **Uso por advogado inscrito**; nada de parecer a leigo; sem sugerir aval da OAB nem substituição do advogado |

---

## 2. O que muda do motor contábil para o jurídico

### 2.1 As três datas

| Data | Rege | Origem | Exemplos |
|---|---|---|---|
| **Do fato** | Lei material (tempus regit actum; lei penal mais benéfica; lei da abertura da sucessão) | Caso, pergunta ou pergunta de volta | Contrato anterior à reforma de 2017; transição da EC 103/2019; dívida anterior a 30/08/2024 (Lei 14.905) |
| **Do ato** | Lei processual e prazo | Andamento, Comunicação ou Audiência | Intimação publicada; data da sentença |
| **De hoje** | Precedentes e súmulas **vigentes** | Servidor | Tema afetado depois do fato |

Mudanças em relação ao 07 (R-M5): (1) **data do fato ausente**: se a lei material mudou entre as datas candidatas, o roteador **pergunta**; se não mudou, responde com aviso (**hipótese**, pergunta 1); (2) o cartão mostra as três ("fato 12/03/2023 · ato 08/11/2026 · consulta 08/11/2026"); (3) a etapa 3 da cascata filtra a norma material pela data do fato, a processual pela do ato e a jurisprudência pela de hoje.

### 2.2 Estado e força do precedente

| Estado | Como o cartão mostra | Pode ser citado como |
|---|---|---|
| Vigente | Selo normal | Fundamento, conforme a força |
| Superado ou cancelado | "Superado em (data) por (decisão)" | Histórico, nunca vigente |
| Em revisão ou afetado a repetitivo | "Afetado em (data); sem tese" | Pendência, nunca tese |
| Suspensão nacional ou modulado | "Efeitos modulados desde (data)" | Com a modulação |
| Embargos ou trânsito pendentes | "Embargos pendentes" | Com ressalva |

**Força**, da maior para a menor: controle concentrado do STF, súmula vinculante, repercussão geral, IRDR e IAC, repetitivos (STJ e TST), súmulas e OJs, acórdão isolado, monocrática. Vale o que **vincula na data do julgamento** (CPC, art. 927 **[a confirmar]**). O STJ publica situação, tese e referência legislativa em CC-BY: 2.410 registros, 1.073 com trânsito, 534 cancelados, 107 afetados (J4, medido em 8/11/2026). Meta: **zero** superado apresentado como vigente.

### 2.3 Tese, não só ementa

A unidade é **tese + fatos relevantes + órgão + data + trecho do voto**. A verificação confere que (a) a tese citada **está no texto** do acórdão; (b) os **fatos são comparáveis** aos do Caso; (c) a ementa nunca prova sozinha. Fatos distintos viram "possível distinção" e o advogado decide (CPC, art. 489, §1º, VI **[a confirmar]**).

### 2.4 Hierarquia, divergência e controle de constitucionalidade

**Hierarquia:** Constituição, tratados, leis, decretos, atos normativos, regimentos; mais **competência federativa** (pesa em Imobiliário e Administrativo), **convenção coletiva** por categoria e base territorial, e **atos do Judiciário** (provimentos do CNJ, códigos de normas das corregedorias).

**Divergência (R-J3):** mapa **por órgão e data**, cada posição marcada como vinculante, majoritária local, minoritária ou pendente de uniformização. Com tese vinculante, ela é a resposta; sem ela, o sistema mostra as posições e **se abstém de escolher**. A **cobertura** (tribunais pesquisados) aparece sempre: TJs e TRTs sem fonte aberta ficam fora (J4, 3.1).

**Constitucionalidade:** norma vigente pode ser declarada inconstitucional, ganhar interpretação conforme ou ter eficácia modulada: o texto não muda, a resposta muda. A base guarda o vínculo **norma, decisão, efeito, data** (Ficha 6 do Plano, antes periférica, agora **central**) e a verificação o consulta antes de aceitar qualquer dispositivo.

### 2.5 Prazos determinísticos (ponte com o JU-03)

O Consultor **não calcula prazo**. Para uma data processual chama a função de prazo do JU-03 (nome a definir), que devolve data, memória de cálculo, calendário e versão da regra no envelope do M3. O M1 explica a regra ("15 dias úteis, art. X"); a **data** vem só da função. Prazo fatal tem confirmação humana (quatro olhos, JU-03). Os 10 casos de contagem da Síntese, validados pela advogada da família, são o primeiro gabarito.

### 2.6 Números só do motor de cálculo

Índices judiciais, juros, custas, atualização e liquidação são **tabelas normativas versionadas** com fórmula por justiça e período, aprovadas por pessoa da plataforma (P2 do 07), nunca editadas pelo escritório. Fontes: BCB SGS (IPCA, INPC, Selic, TR, IGP-M, testados em J4), IPCA-E pelo IBGE **[a confirmar]**, custas por UF **[não levantadas]**. A Lei 14.905/2024 (vigência a partir de 30/08/2024) mudou juros e correção civis, e sua aplicação a obrigações anteriores é controvertida (Tema 1368 do STJ; ADC 58 no Trabalho) **[a confirmar]**; cada fórmula tem parecer humano antes de entrar. Saída rotulada "cálculo de apoio: confira", com a regra de cada linha (como o SGJur, J7).

| Função (provisória) | Resultado | Atividades | Módulo |
|---|---|---|---|
| `atualizacao_judicial` | Correção e juros por justiça; cenários alternativos se há controvérsia | JUR-084, 095 | Civil, Trabalhista |
| `custas_preparo` | Custas e preparo por UF e justiça | JUR-075 | Civil |
| `prescricao_decadencia` | Marcos, prazo e data final | JUR-023, 101, 143 | Civil, Trabalhista, Previdenciário |
| `verbas_rescisorias` | Verbas, FGTS, multas | JUR-095 | Trabalhista |
| `tempo_contribuicao_rmi` | Tempo, carência, renda por regra de transição | JUR-137 | Previdenciário |
| `pensao_partilha` | Pensão em atraso, partilha, ITCMD por UF | JUR-132 | Família |
| `prescricao_penal_dosimetria` | Prescrição e dosimetria em três fases | JUR-124 | Penal |
| `sucumbencia` | Honorários sucumbenciais (CPC, art. 85 **[a confirmar]**) | | Civil (usada pelo JU-05) |

Cada função entra com seu módulo e passa pelo gate do contábil: suíte de gabarito, conferência cruzada (calculadoras de prescrição do CNJ, **API a confirmar**) e aprovação humana.

### 2.7 Abstenção ampliada

Toda abstenção mostra **o que foi pesquisado** e a cobertura. Tipos novos:

| Tipo | Quando | Texto (editável) |
|---|---|---|
| Sem base | Nenhuma afirmação com suporte | "Não encontrei base para afirmar isso. Pesquisei: (normas, súmulas, temas)." |
| **Divergência sem tese vinculante** | Posições conflitam | "Há posições diferentes e nenhuma vincula. Mostro cada uma; a escolha é sua." |
| **Precedente pendente** | Tema afetado, sem tese | "O STJ afetou o tema em (data). Não aplico como regra." |
| **Fato fora da base** | Norma local não coberta | "A norma do estado X não está na base; a resposta vale para a regra nacional." |
| **Módulo não ativo** | Área não ativada | "Isto é de (área), módulo que o escritório não ativou." |
| **Data do fato necessária** | Lei mudou entre as datas | "Preciso da data do fato: a lei mudou em (data)." |
| **Premissa falsa** | Pergunta pressupõe norma inexistente ou superada | "Essa premissa não se sustenta: (motivo e fonte)." |
| **Dado indisponível** | Segredo de justiça, processo sigiloso | "Esse conteúdo não está na base." |

Regra do 07 (R-M3): depois de abster-se, o sistema **não completa com conhecimento do modelo**, o vício que a Vals mediu.

---

## 3. A base de leis modular

### 3.1 Camadas e níveis de maturidade

Camadas de J4: **L0** normas, **L1** enunciados, súmulas e teses, **L2** jurisprudência ampla, **L3** doutrina e modelos, **L4** tabelas, **L5** território. L0, L1 e L4 vêm de fonte oficial; L2, L3 e L5 concentram custo e risco de licença. Daí quatro **níveis de maturidade**:

| Nível | Conteúdo | Libera |
|---|---|---|
| **N1 Base mínima** | L0 + L1 + L4 | Perguntar, busca de norma, vigilância, cálculos. Rótulo "base mínima" (J9) |
| **N2 Jurisprudência** | N1 + L2 (STJ aberto primeiro) | Pesquisa de jurisprudência, parecer, minuta, com a cobertura declarada |
| **N3 Modelos e doutrina** | N2 + L3 | Biblioteca de modelos por rito; playbooks de contrato; doutrina só com licença |
| **N4 Território** | N3 + L5 | Normas estaduais e municipais, custas |

**Núcleo N0**, em todo pacote: CF e emendas, LINDB, Estatuto e Código de Ética **[texto a confirmar]**, regras processuais comuns (CPC, CPP, CLT processual, Lei 9.099), súmulas vinculantes e repercussão geral, calendário forense e índices.

### 3.2 Os 19 módulos: corpus mínimo e fonte

Ordem de J9 (% de advogados por área principal). Volumes são ordens de grandeza **[a confirmar na ingestão]**.

| # | Módulo | Corpus mínimo (L0, L1, L4) | Fonte e licença |
|---|---|---|---|
| 1 | **Civil e Processual Civil** (26%) | CC, CPC, Leis 9.099, 9.307, 13.140; súmulas e temas cíveis do STJ; custas e prazos por UF | Aberta; STJ CC-BY; acórdãos de TJs só após parecer |
| 2 | **Família e Sucessões** (14%) | CC Livros IV e V; procedimentos do CPC; Leis 5.478, 11.441, 12.318, 13.058; ECA; provimentos do CNJ; ITCMD (27 leis) | Aberta; doutrina licenciada; segredo de justiça indisponível |
| 3 | **Trabalhista** (12%) | CLT; Lei 13.467/2017; súmulas, OJs e PNs do TST; **convenções e acordos coletivos**; índices (ADC 58) | Aberta; TST sem dump; convenções via Mediador (MTE) |
| 4 | **Previdenciário** (11%) | Leis 8.212 e 8.213; Decreto 3.048; EC 103/2019; normas do INSS; súmulas e temas da TNU | Aberta |
| 5 | **Penal** (8%) | CP, CPP, LEP; Leis 11.343, 11.340, 12.850, 13.964; temas penais (369 no STJ) | Aberta; STF por raspagem ou fornecedor; dados sensíveis |
| 6 | **Consumidor e Bancário** (6%) | CDC; Decretos 2.181 e 11.034/2022; Lei 14.181; súmulas do STJ | Aberta |
| 7 | **Empresarial** (4%) | CC Livro II; Leis 6.404, 11.101, 13.874, 14.195, 14.711; LC 123; DREI | Aberta; reuso parcial do Contábil |
| 8 | **Tributário** (3%) | CTN; Lei 6.830; Decreto 70.235; LC 116; EC 132 e LC 214; temas S1 (1.322); CARF | **Reuso do Contábil**; STJ CC-BY |
| 9 | **Imobiliário** (3%) | Leis 8.245, 6.015, 13.465, 4.591, 13.786; CC Livro III; códigos de normas das corregedorias | Aberta; local heterogêneo; certidões ONR por fornecedor |
| 10 | **Saúde e Planos** (1%) | Lei 9.656; rol e resoluções da ANS; STJ e STF | Aberta |
| 11 | **Administrativo** | Leis 14.133, 9.784, 8.429 e 14.230; LAI; TCU | Aberta; local heterogêneo (Querido Diário, cerca de 350 cidades em 2024) |
| 12 | **LGPD e Digital** | LGPD; ANPD; Marco Civil; Leis 12.846 e 9.613 | Aberta |
| 13 | **Ambiental** | Lei 9.605; Código Florestal; CONAMA **[a confirmar]** | Aberta **[a confirmar]** |
| 14 | **Eleitoral** | Legislação eleitoral; resoluções do TSE **[a confirmar]** | Aberta **[a confirmar]** |
| 15 | **Agrário** | Normas fundiárias **[a confirmar]** | Aberta **[a confirmar]** |
| 16 | **Propriedade Intelectual** | Leis 9.279, 9.609, 9.610; INPI; tratados | Aberta; doutrina licenciada **[a confirmar]** |
| 17 | **Militar** | CPM, CPPM; STM **[a confirmar]** | Aberta **[a confirmar]** |
| 18 | **Marítimo** | Tribunal Marítimo; tratados **[a confirmar]** | Aberta **[a confirmar]** |
| 19 | **Internacional** | Tratados (Planalto e MRE) **[a confirmar]** | Aberta **[a confirmar]** |

### 3.3 Cadência, esforço, dependências e onda

Esforço e dependências de J4 e J9; **[inf.]** é inferência de J9 ou minha.

| # | Módulo | Cadência | Esforço | Depende de | Onda |
|---|---|---|---|---|---|
| 1 | Civil | Leis mensal; jurisprudência semanal | Alto | N0 | 1 |
| 2 | Família | Mensal; provimentos frequentes | Médio-alto | N0; fatia do Civil | 2 |
| 3 | Trabalhista | Semanal; convenções por data-base | Alto | N0; Civil (subsidiário); base do Contábil (CLT, eSocial) | 2 |
| 4 | Previdenciário | Semanal a mensal [inf.] | Médio-alto [inf.] | N0; Civil; **Trabalhista** | 2 |
| 5 | Penal | Semanal | **Muito alto** | N0; portão de dados sensíveis e lei no tempo | 3, depois do 6 |
| 6 | Consumidor | Lei baixa; jurisprudência média | Baixo-médio | N0; Civil | 3 |
| 7 | Empresarial | Mensal | Médio | Civil; fatia do Tributário | 4 |
| 8 | Tributário | Diária (federal) | Alto; marginal muito baixo | N0; base do Contábil | 4 |
| 9 | Imobiliário | Mensal; norma local sem aviso | Alto | Civil; Família | 5 |
| 10 | Saúde | Mensal [inf.] | Médio [inf.] | Consumidor; Civil | 5 |
| 11 | Administrativo | Alta | Alto | N0; Civil | 5 |
| 12 | LGPD | Mensal | Baixo-médio | Consumidor; Empresarial | 6 (paralelo desde a 2) |
| 13 | Ambiental | Mensal [inf.] | Médio [inf.] | Administrativo; Penal; Imobiliário | 6 |
| 14 | Eleitoral | Picos em ano eleitoral | Médio [inf.] | N0; Administrativo | 6 (janela de 2028) |
| 15 | Agrário | Baixa [inf.] | Médio-alto [inf.] | Imobiliário; Ambiental; Civil | 7 |
| 16 | Propriedade Intelectual | Baixa [inf.] | Médio [inf.] | Civil; Empresarial; Penal | 7 |
| 17 | Militar | Baixa [inf.] | Baixo-médio [inf.] | Penal; Administrativo | 7 |
| 18 | Marítimo | Baixa [inf.] | Baixo-médio [inf.] | Empresarial; Civil; Administrativo | 7 |
| 19 | Internacional | Baixa [inf.] | Médio [inf.] | Civil; Empresarial | 7 |

**Ondas.** 0: N0, ficha de precedente e calendário forense. 1: Civil (base de nove módulos). 2: Família, depois Trabalhista e Previdenciário em dupla (J9 admite trocar a ordem do bloco; pergunta 12). 3: Consumidor, depois Penal. 4: Empresarial e Tributário em paralelo. 5: Imobiliário, Saúde, Administrativo. 6: LGPD, Ambiental, Eleitoral. 7: a cauda, em base mínima. **A Síntese punha o Trabalhista primeiro; a ordem de J9 a substitui** (decisão do usuário). Regra: seguir a lista, nunca construir antes da dependência, inverter só com motivo escrito.

**Fatia de leitura.** Módulo dependente **inclui, só para leitura e citação, a fatia** do módulo-base de que precisa (Família traz os artigos do CC e do CPC que cita); o módulo-base completo é upgrade (J9). Ativar um dependente ativa a fatia, com aviso.

### 3.4 Pacotes combinados

| Pacote | Conteúdo | Cobertura | Disponível quando |
|---|---|---|---|
| **A. Generalista** | N0 + Civil + Família + Trabalhista + Previdenciário + Consumidor | 71% | Gate dos cinco módulos |
| **B. Trabalhista e Previdenciário** | N0 + módulos 3 e 4 | 23% | Fim da onda 2 |
| **C. Família e Sucessões** | N0 + módulo 2 + fatia do Civil + ITCMD | 14% | Fim da onda 2 |
| **Completo** | N0 + os 19 | Todos | Fim da onda 7 |
| Complementos | Penal (8%); Empresarial e Tributário (7%); Imobiliário e Saúde (4%) | | Add-on de A, B ou C |

Penal fica fora do A de propósito: só entra como add-on depois do portão. Um pacote só é vendido quando **todos** os seus módulos passaram o gate de lançamento (6.4).

### 3.5 A base temporal compartilhada com o Contábil

**Reaproveita sem mudança:** originais imutáveis, URN LexML, três datas por versão, eventos calculados por código, evidência literal, os agentes (coletor, extratores independentes, validador, revisor, consolidador, conferente, publicador), portões e auditoria amostral; fichas 1 a 5. Reuso de corpus: Tributário inteiro; CLT, convenções e eSocial no Trabalhista; LC 123 e Redesim no Empresarial; ITCMD em Família. O publicador gera `legislacao.publicar` **por módulo**.

| Dimensão | Contábil | Jurídico |
|---|---|---|
| Janela | 10 anos | **Desde a origem** do diploma central (CP 1940, CLT 1943, CF 1988, CC 2002; CC 1916 **[a confirmar]**) |
| Fichas | 1 a 6 | Soma a **Ficha 7: Precedente e Súmula** com ciclo de vida, tese, fatos, órgão e vínculos; a Ficha 6 ganha efeito e modulação |
| Eventos | Alteração normativa | Soma **eficácia por decisão judicial** |
| Tabelas | Alíquotas, anexos | Índices por justiça, custas por UF, **calendário forense** (compartilhado com o JU-03), convenções |
| Validação | Contadores do grupo | Advogada e contador da família agora; **especialista por área** no lançamento |

**Núcleo congelado.** O núcleo v1.0 foi congelado no piloto contábil. Antes da primeira ingestão jurídica, **mini-piloto de 100 documentos** (CC com alterações, CLT com a reforma, EC 103, súmulas, convenção, tema repetitivo) pelo mesmo protocolo. O que não couber vira extensão v1.1; mudança de núcleo é versão maior com reprocessamento pelos agentes (princípio 6). **Risco registrado.**

**Público separado do privado.** A base de leis é partição global, só leitura, sem `escritorio_id`. Processo com `nivelSigilo` é descartado na ingestão (J4, R7). O que o escritório produz vive em índice próprio (5.6).

### 3.6 Como o módulo se liga a um escritório

A **assinatura** é do escritório e lista módulos ou pacotes. O módulo é uma **partição** da base global: ativar concede acesso, não copia dados.

| Momento | O que acontece |
|---|---|
| **Ativação** | O Administrador escolhe em Configurações (JU-02); evento `modulo.ativar`; vale na hora, com cobrança proporcional (JU-05); a fatia das dependências entra junto; o roteador passa a usar a partição |
| **Versão** | Cada módulo tem `versao_base` própria; o escritório segue a **atual**; o publicador invalida o cache do módulo. Cada resposta, parecer e Peça guarda as versões e **o texto fechado** dos dispositivos citados (P8 do 07). Cálculo antigo não muda quando a tabela muda |
| **Vigilância** | Só módulos ativos alertam; mudança de norma citada em Peça ou parecer avisa o advogado responsável |
| **Desativação** | Vale no ciclo seguinte. Pergunta nova da área vira "módulo não ativo". O que já foi emitido **continua legível**, com o texto fechado da data e o aviso "cita módulo desativado: sem acompanhamento de mudanças". Cache e correções do escritório ficam guardados e inativos; a reativação os restaura. **Nada é apagado** |

---

## 4. O Consultor jurídico e os modos

Mesmo integrante `tipo = consultor` do 02 (seção 10), com os modos do pacote; o Geral responde perguntas jurídicas "pelo Consultor".

### 4.1 Os modos

| Modo | Gatilho | Módulo mínimo | Saída | Nível |
|---|---|---|---|---|
| **Perguntar** | Chat | N1 | Cartão de citação (três datas, estado, força) ou abstenção tipada | ler |
| **Parecer** (JUR-085) | Chat; tarefa do Caso | N2 | Rascunho: fatos (só do Caso), questão, normas, precedentes, divergência, conclusão **proposta**, grau, ressalvas, `escopo_mandato`; guarda versões e PDF fechado; o advogado assina | rascunhar |
| **Minuta de peça** | Chat; tarefa | N2 e **tipo coberto** | Rascunho com fatos **só dos autos** (cada um com origem), fundamentos com citação conferida em camadas e checklist pré-protocolo (JUR-219); fora da lista de tipos, recusa | rascunhar |
| **Pesquisa de jurisprudência** (JUR-060, 061) | Chat | N2 | Mapa por órgão e data, **cobertura declarada**; sem "chance de êxito" | ler |
| **Resumo de autos e andamentos** (JUR-056) | Chat; carga de autos | N1 | Cronologia com origem (evento ou página), partes, pedidos, prazos pendentes do JU-03; fica no índice do escritório | ler |
| **Revisão de contrato** (JUR-162) | Chat; Documento | N1; N3 para playbook | Achados em quatro lentes (jurídica, risco, financeira, clareza), cada um **citando a cláusula**; achado sem citação é descartado e o sistema diz quantos (modelo do SGJur) | ler |
| **Vigilância por módulo ativo** | `legislacao.publicar`; evento de precedente; job diário | N1 | Alerta ao advogado responsável: o que muda e **Casos afetados** (o predicado inclui as datas: lei nova só afeta fato posterior); tarefa de revisão; nada ao cliente | executar (aviso) |
| **Segunda opinião** | Peça com `risco = true` | N2 | Nota na Peça: "confere" ou "divergência: X", com citação e recálculo; nunca conclui | rascunhar |
| **Modo cliente** | Chat do app | N1 | 4.4 | ler |

### 4.2 `legal.consultar` adaptado

Ler, custo cara. Mantém o contrato do 07 (3.2) com estas mudanças.

| Entrada | Mudança |
|---|---|
| `escopo` | Ganha `pesquisar_jurisprudencia`; `explicar` segue o único liberado ao cliente |
| **`data_do_fato`, `data_do_ato`, `data_da_consulta`** | Substituem `data_de_referencia` (R-J1) |
| `caso_ou_processo` | Contexto lido do Caso e do Processo (ramo, justiça, tribunal, UF, comarca, fase, rito), nunca texto livre |
| `modulos` | Do roteador, entre os **ativos**; área sem módulo ativo vira abstenção |

| Saída | Mudança |
|---|---|
| `afirmacoes[]` | Ganha `tipo` (norma, precedente, enunciado, convenção) |
| `trechos[]` | Precedente: órgão, número, data, **`estado`, `forca`, `tese`, `fatos_relevantes`**, ementa só para exibição, link, atribuição (CC-BY) |
| `divergencias[]` | Mapa por órgão e data, com a força de cada posição |
| `afetacoes[]` | Decisões que afetam a norma citada (2.4) |
| `abstencao`, `pesquisado[]`, `cobertura[]` | Com `tipo_abstencao`; partições e **tribunais cobertos** |
| `datas_consideradas`, `versao_base` | As três datas; versão **por módulo** |

### 4.3 Exemplo ilustrativo

Forma, não parecer; o conteúdo jurídico depende de conferência **[a confirmar]**. **Pergunta (Caso de cobrança):** "Que juros e correção aplico a uma dívida civil de 2023 que estou liquidando hoje?"

| Campo do cartão | Conteúdo |
|---|---|
| Datas | Fato: março de 2023 (do Caso) · Ato: 08/11/2026 · Consulta: 08/11/2026 |
| Resposta resumida | A regra geral da Lei 14.905/2024, vigente desde 30/08/2024, é taxa legal (Selic menos IPCA, piso zero) e correção pelo IPCA. Para obrigação anterior a essa data a aplicação é controvertida. **Não indico qual regime vale para este Caso.** |
| Afirmação 1 | Regra da Lei 14.905; suporte sim, grau alto |
| Afirmação 2 | Tema 1368 do STJ sobre a aplicação no tempo; **estado: afetado**, sem tese **[confirmar na base]**; força: vinculante quando julgado |
| Divergência | Posições por órgão e data, preenchidas pela base; nenhuma vinculante |
| Abstenção parcial | "Precedente pendente" e "divergência sem tese vinculante" |
| Números | Nenhum. O botão "calcular os dois cenários" chama `atualizacao_judicial`, que devolve valores e memória de cálculo |
| Cobertura e confiança | Tribunais pesquisados e não cobertos; grau médio |

### 4.4 Segunda opinião, peças críticas e modo cliente

**Peça crítica** (`risco = true`): contestação, recursos, tutela de urgência, parecer a cliente, peça com prazo fatal e, quando houver o Penal, peça com liberdade em jogo. Ela **não passa a "revisada"** sem: (1) **conferência de citações** (`legal.consultar(conferir)` mais recálculo de prazos e valores), que roda **sempre**, em qualquer plano; (2) o advogado ter lido a nota; (3) em escritório com dois ou mais advogados, **segundo advogado** nos prazos fatais (quatro olhos, JU-03). O advogado solo recebe a nota e o checklist. A narrativa completa de segunda opinião é do IA Intensivo (7.3).

**Modo cliente.** O cliente vê **só o que o advogado liberou**: Andamentos visíveis, traduzidos em "o que acontece agora e quando" (J8), Audiências, documentos pedidos, parcelas de Honorário-Jurídico (JU-05). Dados e datas vêm de registros lidos e da função de prazo; `legal.consultar(explicar)` só explica termos. **Nunca opina**: "vou ganhar?" e "aceito o acordo?" viram pedido ao advogado. Identifica-se como máquina (Rec. 2.4). A tradução de Andamento usa **modelo de texto com campos extraídos**, aprovado por tipo pelo advogado; o resto vai a cartão. Exige **termo de ciência registrado** (5.4). Serviço à parte, como o Consultor da empresa.

### 4.5 O que nunca faz

| Nunca | Em vez disso |
|---|---|
| Assinar, protocolar, dar ciência de citação ou intimação | Prepara; a pessoa conclui; listar nunca dá ciência (C7 do 08) |
| Calcular prazo | Função do JU-03 |
| Inventar jurisprudência ou completar após abstenção | Cita com `trecho_id` conferido ou se abstém |
| Escolher entre posições sem tese vinculante; citar superado como vigente | Mapa e estado |
| Prever o resultado ou perfilar juiz e parte | Só jurimetria **agregada** por órgão e tese, rotulada (J5) |
| Dar parecer a leigo; negociar valores; aceitar acordo | Advogado |
| Enviar algo ao cliente sem cartão | Cartão de aprovação |
| Usar dado de Caso para treinar, avaliar ou alimentar cache global | R-J5 |
| Concordar com premissa falsa | Abstenção |
| Sugerir aval da OAB ou substituição do advogado | Texto do produto e do contrato |

---

## 5. Sigilo e aprendizado

### 5.1 O desenho B com A como piso

**A:** tudo o que nasce num escritório melhora **só** esse escritório. **B:** a plataforma aprende com **(1)** a base pública e **(2)** as correções de **advogados do grupo**, e o benefício vai a todos.

| Classe | O que é | Onde vive | Quem aprende |
|---|---|---|---|
| **P · Pública** | Leis, súmulas, teses, acórdãos abertos (STJ CC-BY), índices, calendário, modelos próprios | Partição global, só leitura | Todos |
| **G · Grupo** | Casos **sintéticos** ou sobre fonte pública, escritos ou corrigidos por **advogados do grupo** (a advogada da família agora; especialistas no lançamento), sob contrato | Benchmark global; conjunto de ajuste | **Todos** |
| **E · Escritório** | Casos, autos, fatos, peças, pareceres, consultas, respostas aprovadas, correções de advogados **do escritório**, memória, embeddings e resumos derivados | Índice e memória **do escritório** (e por Caso restrito) | **Só aquele escritório** (A) |

**Como funciona com todos juntos.** Quatro ciclos, nenhum lê a classe E: (1) **base**, com ingestão diária e versão nova do módulo para todos; (2) **benchmark**, em que advogados do grupo geram e corrigem casos sintéticos de todos os módulos; (3) **ajuste e DGM offline**, em que reranker e recuperador usam pares de P e G e a DGM lê só o benchmark (07, 9.3, R-M8); (4) **por escritório**, em que respostas aprovadas, pareceres assinados e memória melhoram aquele escritório.

**Cache semântico global.** No contábil a pergunta sem dado de cliente entra no cache global (P3 do 07). No jurídico a pergunta livre traz fatos que identificam partes. **Hipótese:** o cache global guarda só **perguntas canônicas** (da base ou do grupo); a pergunta do escritório usa cache **do escritório** (pergunta 2). **Telemetria sem texto** (módulo, tema, tipo de falha) ficaria **desligada** até o parecer de ética (pergunta 3).

### 5.2 O que nunca sai do escritório, e anonimização

Texto de peças, autos, fatos, nomes, CPF e CNPJ, números de processo, consultas, respostas aprovadas, correções de advogados do escritório, memória e os **derivados** (embeddings, resumos, logs com conteúdo). Inclui o que o escritório **corrige** em respostas sobre Casos reais.

**Anonimizar reduz risco de processamento, não autoriza aprendizado**: quando os fatos identificam as partes, tirar nome e CNPJ não basta (J5). Serve a (a) **redação de dados antes de enviar ao modelo de terceiros** (nomes, documentos e números de processo trocados por marcadores, restaurados localmente; por analogia ao art. 19, §3º, IV, da CNJ 615) e (b) exibição de jurisprudência não pseudonimizada **[a confirmar com DPO]**.

### 5.3 Consentimento e contrato

| Camada | O que é |
|---|---|
| **Contrato escritório e plataforma** | Cláusula de **não uso para treinamento**; operador (LGPD); subprocessadores; local; retenção; exclusão ao fim. Papéis de controlador e operador **[a confirmar com advogado de ética e LGPD]** |
| **Termo de ciência do cliente** (Rec. 4.1 a 4.3; JUR-013) | Gerado pelo sistema com os itens da Rec. 4.2.1 (propósito, benefícios e limites, riscos, segurança, revisão humana), assinado por fornecedor B, **arquivado no Mandato**. Se o cliente recusa, o Caso fica "sem IA" |
| **Consentimento do usuário no primeiro uso** | Mostra o que é enviado e a quem (modelo do SGJur) |
| **Contrato com advogados do grupo** | Confidencialidade, **proibição de dado real de cliente**, cessão de direitos sobre correções e modelos (J4, 4.2) |
| **Opt-in para treinar com dado de escritório** | **Não existe**; a opção C fica como futuro, em áreas não sensíveis e após parecer |

IA sobre o conteúdo de um Caso exige termo registrado; pergunta geral, sem dado de Caso, não. **Hipótese:** bloqueio brando, com atestado do advogado quando o termo for dispensado (pergunta 4).

### 5.4 Retenção

| Item | Padrão (hipótese) | Opção do escritório |
|---|---|---|
| Log técnico (ferramenta, tokens, ids, hashes, versões) | Longo, **sem conteúdo** | Fixo |
| Transcript com conteúdo | 90 dias (como no 02, 6.4) | Menor, ou "**não guardar conteúdo**" (análoga ao art. 20, IX, da CNJ 615) |
| Versões de Peça | Quem fez, quando, agente e modelo; **sem o prompt** | Fixo (JUR-234) |
| Respostas aprovadas e memória | Até o escritório apagar | Exportar e apagar |
| Fim de contrato | Exportação e exclusão em prazo **[a confirmar]** | |

### 5.5 Subprocessadores e modelos de terceiros

| Subprocessador | O que vê | Exigência |
|---|---|---|
| Modelos de linguagem, embedding e reranker | Texto já redigido (5.2) | **Sem treino** por contrato, retenção zero ou mínima, região declarada. O SGJur admite contrato sem retenção zero e IA nos EUA (J7): devemos fazer melhor ou **listar a exceção** |
| Hospedagem e banco | Tudo | Brasil **[a confirmar]**; transferência internacional declarada (LGPD, art. 33) |
| Captura de andamentos | Números de processo, OAB | Contrato B com cláusula de uso; dois fornecedores (JU-03) |
| Assinatura, transcrição, WhatsApp | Documento, áudio, conversa | Contrato de operador; o termo cita o canal |

**Treinamento próprio.** Não se ajusta modelo com classe E. Reranker, embedding e Rank1 destilado usam P e G. O fornecedor do modelo sai do benchmark da pesquisa 02, e as cláusulas acima são **requisito de escolha**.

### 5.6 O que isso exige da arquitetura

| Exigência | Como |
|---|---|
| Índice por escritório | BM25 e vetor com `escritorio_id` e **filtro antes da busca** (07, 4.2; DA-01); base global só leitura |
| **Sigilo por Caso** | Restrito: só usuários listados. **Segredo de justiça**: IA desligada para o conteúdo por padrão (CNJ 615, art. 19, §3º, por analogia) **[parecer]** (pergunta 5) |
| Memória por escritório e por Caso | Camadas do 02 (5); sem texto copiado de autos |
| **Classe de dado** em ferramenta, índice e evento | `P`, `G` ou `E`; quem grava em área global só aceita `P` ou `G` |
| **Separação por pacote** | Dado Jurídico invisível a setores e à IA do Contábil: o contador não lê o sigilo do advogado |
| Criptografia | Chave por escritório **[a confirmar no desenho do KMS]** |
| **Teste de vazamento** | Estende o A7 do 07 com **canários** (marcadores únicos) plantados no escritório A e procurados no B, no cache, no benchmark, nos prompts e nos artefatos de ajuste, a cada mudança |

### 5.7 Regras da OAB e do CNJ: o que o desenho cobre e o que falta

Fonte: J5, seção 3. Numerações **[a confirmar]**; Res. CFOAB 16/26 conhecida por notícias.

| Norma | Exigência | Cobre | Falta |
|---|---|---|---|
| **Rec. 001/2024**, 1.1 e 3.2 | Conformidade; veracidade (CPC, art. 77) | Verificação em camadas; abstenção | Checklist pré-protocolo ligado à Peça |
| 2.2 | Fornecedor protege dados e permite **não treinar** | Classes P, G, E; R-J5 | **Cláusula no provedor do modelo**; opção de não guardar prompts |
| 2.3 e 2.4 | Cuidado no compartilhamento; chatbot se identifica | Suboperadores; modo cliente | Lista pública; texto na primeira mensagem |
| 3.1 e 3.7 | Sem substituir o julgamento; **revisão integral** | Rascunho, revisão assinada, protocolo nunca automático | Tela que **impeça exportar** sem revisão (JU-02) |
| 3.6 | Sócio supervisiona | Trilha por Peça e pessoa | Papéis "advogado" e "apoio supervisionado"; **inscrição OAB** (sem API do CNA: número e UF, D-assistido, J4) |
| 4.1 a 4.3 | **Termo escrito**, aceite guardado, recusa possível | Termo no Mandato (5.3) | Bloqueio brando; modelo validado por advogado de ética |
| **Res. CFOAB 16/26**; Prov. 205/2021 | Natureza do serviço prevalece; sem aval da OAB nem substituição; publicidade sóbria | Venda só a advogados; modo cliente sem opinião | **Checklist de comunicação** e revisão do material comercial |
| Estatuto, art. 1º e 34, VII | Atos privativos; sigilo | R-J6, R-J7; isolamento | Parecer de ética |
| **CNJ 615/2025** (Judiciário) | Conclusão sobre fatos é alto risco; texto de apoio, baixo | Apresenta tese e divergência; conclusão é humana | Só obriga se vendermos a tribunais |
| LGPD (arts. 20 e 33); PL 2338/2023 | Revisão humana; transferência internacional; avaliação de impacto | Revisão humana; local declarado | DPO; política de dados sensíveis; documentação de modelo |

**Falta, em uma linha:** termo e consentimento; cláusula "sem treino" no provedor; opção de não guardar prompts; subprocessadores; anonimização assistida; isolamento por Caso; trilha e bloqueio; venda só a inscritos; checklist de comunicação; jurimetria agregada; **parecer de advogado de ética**.

---

## 6. Verificação, benchmark e qualidade

### 6.1 Verificação estendida

Mesma biblioteca do 07 (seção 7), com checagens novas:

| Checagem | Como | Falha |
|---|---|---|
| **Três datas** | `datas_consideradas` = as da sessão, ou a saída declara a diferença | Reescrita |
| **Citação em camadas** (J5) | (a) existe; (b) órgão, número e data contra metadados oficiais; (c) **vigente e não superada**; (d) **hierarquia correta**; (e) **sustenta a tese**, não só a ementa; (f) fatos comparáveis | Removida; central vira abstenção |
| Afetação | Norma sem a decisão que a suspende ou modula | Aviso |
| **Prazo e data** | Todo prazo com origem na função do JU-03 | "(prazo não conferido)" |
| **Fatos da Peça** | Cada fato com origem no Caso, nos autos ou "informado pelo advogado" | Removido; vira pendência |
| **Premissa falsa** | Testada contra a base antes de responder | Abstenção |
| Escopo e sigilo | Nenhum registro de outro escritório ou Caso restrito | Falha crítica |

### 6.2 O conjunto de gabarito

Casos de classe G, escritos por **advogados do grupo** em **duplo cego**, com terceiro desempatando e concordância medida; guias de correção no estilo do OAB-Bench. **Nunca casos de clientes.** Conjunto **reservado** e renovado.

| Tipo | Testa | Proporção ou meta |
|---|---|---|
| Pesquisa | Norma e precedente corretos | Núcleo |
| **Data do fato diferente de hoje** | Lei no tempo | 15% |
| **Divergência real** | Reconhece e não escolhe | 10% |
| **Superado ou afetado** | Estado correto | 10% |
| **Premissa falsa** | Recusa | 5% |
| **Abstenção esperada** | Abstém-se quando deve | 10% |
| Prazo | Exatidão (JU-03) | 10 casos hoje, 100 depois |
| Peça; revisão de contrato | Comparação com minuta, por rubrica; achados | 20 por tipo coberto; 20 |
| Cálculo; modo cliente | Resultado exato; "factual ou advogado" | 10 por função; 60 |
| **Sigilo** | Canários, zero vazamento | 100 transversais |

**Tamanho.** Módulos grandes (Civil, Família, Trabalhista, Previdenciário, Penal): **200 casos** (cerca de ±5,5 pontos a 80%); médios (Consumidor, Empresarial, Tributário, Imobiliário, Saúde, Administrativo, LGPD): **100 a 150**; cauda: **60**, sem divulgar taxa, só "base mínima". Cerca de 2.300 casos, mais os transversais. Esforço **[estimativa própria]**: 1,5 hora de advogado por caso (criação, gabarito, segunda leitura), ou 300 horas por módulo de 200 casos; casos gerados por modelo e validados reduzem. Custo em reais **[a confirmar; hora não pesquisada]**.

### 6.3 Métricas e a meta de mercado

Métricas: citação em camadas, **vigência**, **abstenção correta nos dois sentidos**, divergência reconhecida, premissa falsa recusada, **prazo exato** (alvo 100%), **cálculo exato**, rubrica da Peça, escopo (zero), conclusão (juiz automático calibrado, com auditoria humana por amostra), sempre **por módulo e tipo de tarefa**. Reporta-se também a **taxa de abstenção**, para o sistema não "vencer" abstendo-se.

**O benchmark que o mercado erra.** Stanford e Yale mediram **17% a 34%** de respostas incorretas ou mal fundamentadas (Lexis+ AI e Practical Law AI acima de 17%; Westlaw cerca de 33% a 34%). Na Vals (2025), ferramentas fizeram 74% a 78% contra 69% de advogados, sem os três maiores fornecedores. Os números **não são comparáveis** (direito dos EUA, outras perguntas): comparamos **método e definição**.

| Meta | Critério |
|---|---|
| **Zero** citação inexistente | Zero em 200 casos limita o erro a cerca de 1,5% (regra dos três, cálculo próprio) |
| **Zero** superado como vigente | Idem |
| **Incorreta ou mal fundamentada abaixo de 17%** nos módulos grandes | Com 200 casos, **12% ou menos** observado deixa o limite superior de 95% abaixo de 17% (cálculo próprio, aproximação normal) |
| Conclusão por área | Só depois do primeiro ciclo medido |

Comparação aberta: mesmos casos contra modelo geral e, se os termos permitirem, produto de terceiro; **grupo-controle de advogados** nos três primeiros módulos grandes; método e intervalos publicados. **Nunca prometer "sem alucinação".**

### 6.4 Gate por módulo

| Critério | Uso interno (família) | **Lançamento** |
|---|---|---|
| Auditoria de 100 dispositivos, erro até 2% (como no M3 do Plano) | Sim | Sim, **por especialista** |
| Estado dos precedentes: amostra de 100, erro até **1%** (hipótese) | Sim | Por especialista |
| Cobertura de L0 e L1 da lista do módulo | Sim | Sim |
| Benchmark: zero inexistente, zero superado, abaixo de 17% (grandes) | Sim | Sim, **dois ciclos** |
| Prazo: gabarito a 100% | Advogada da família | Ampliado |
| Teste de vazamento com canários | Sim | Sim |
| **Conferência por especialista** | **Não** | **Sim** |
| Parecer de ética (global) | Antes de qualquer dado de cliente | Sim |
| Nível de maturidade (N1 a N4) declarado | | Sim |

O contador da família **confere** conteúdo que domina; isso **não é selo jurídico** e não substitui o gate de lançamento.

### 6.5 Conferência por especialista no lançamento

Sete grupos de revisor (J9, seção 5): (1) Civil, Empresarial, Imobiliário, Agrário, PI, Marítimo, Internacional; (2) Família; (3) Trabalhista e Previdenciário; (4) Penal e Militar; (5) Consumidor, Bancário e Saúde; (6) Tributário e Administrativo; (7) LGPD, Ambiental e Eleitoral.

| Tarefa do especialista | Quando |
|---|---|
| Auditar a amostra da base e o estado dos precedentes | No gate; depois mensal nas categorias de risco (vigência complexa, intertemporalidade, superação) |
| Escrever e validar o gabarito | Por módulo, antes do gate |
| Validar **tipos de peça cobertos** e modelos (com cessão de direitos) | Por módulo |
| Revisar **30 respostas reais do piloto** em duplo cego | No gate |
| Aprovar fórmulas e tabelas com impacto jurídico | A cada tabela nova |

Cada grupo é contratado **antes da onda** dos seus módulos (contrato de 5.3). Custo e recrutamento **[a confirmar]**.

---

## 7. Custos e desempenho

### 7.1 Tokens por tarefa

**[Estimativas próprias; medir.]** Regra do Estudo (6.8.1): 1 UU = 10 mil tokens; R$ 0,0882 por UU no preço médio (25% em modelo barato); R$ 0,60 por MTok no barato.

| Tarefa | Tokens | UU | Custo (preço médio) |
|---|---|---|---|
| Pergunta jurídica | 20 a 40 mil | 2 a 4 | R$ 0,18 a 0,35 |
| Pesquisa de jurisprudência | 40 a 80 mil | 4 a 8 | R$ 0,35 a 0,71 |
| Parecer | 60 a 120 mil | 6 a 12 | R$ 0,53 a 1,06 |
| Minuta de peça | 80 a 160 mil | 8 a 16 | R$ 0,71 a 1,41 |
| Revisão de contrato (30 páginas) | 40 a 70 mil | 4 a 7 | R$ 0,35 a 0,62 |
| **Resumo de autos (300 páginas)** | 250 a 400 mil, quase todo em modelo barato | **25 a 40** | R$ 2,20 a 3,50 pelo preço médio; cerca de R$ 0,40 a 0,70 pelo custo real |
| Verificação em camadas | 4 a 8 mil | 0,4 a 0,8 | Parte é código |
| Vigilância por norma | 5 a 10 mil | 0,5 a 1 | Zero sem Caso afetado |

**Achado.** Um resumo de autos de 300 páginas gasta **mais que a janela de 5 horas do IA Essencial (25 UU)** e cerca de um terço da semana (100 UU), embora custe centavos, porque a UU não distingue o modelo. É o risco que J5 previu para a margem do Essencial.

### 7.2 Cache, modelo barato e módulos grandes

| Alavanca | Uso |
|---|---|
| **Partição por módulo ativo** | O roteador escolhe 1 a 3 partições; N0 e Civil ficam quentes; a cauda carrega sob demanda |
| Cache | De prefixo e semântico por escritório; global só de perguntas canônicas; versão do módulo invalida |
| Modelo barato | Roteador, etapas 1, 2 e 8, resumo de autos por blocos, classificação na verificação; o principal entra uma vez por resposta |
| Código | Cálculo e estado do precedente; só "sustenta a tese" usa modelo barato |
| L2 do STJ | Cerca de 20 GB compactados mais 3,3 GB de JSON (J4): indexar primeiro **espelhos e os 2.410 precedentes qualificados**; íntegras por demanda; custo de embedding **[a medir]** |
| Modos longos | Minuta, parecer e autos em segundo plano, com aviso |
| Alvos | Pergunta 10 a 25 s; pesquisa e parecer 30 a 90 s |

### 7.3 Planos de IA e módulos

O Estudo (6.8) define IA Essencial R$ 79, Operação R$ 189 e Intensivo R$ 299 por usuário por mês (25, 60 e 100 UU por janela de 5 horas; 100, 300 e 500 por semana). **O módulo de lei é separado do plano de IA:** o módulo dá a base e o plano dá a capacidade; cada usuário precisa dos dois.

| Modo | Essencial | Operação | Intensivo |
|---|---|---|---|
| Perguntar; pesquisa curta | Sim | Sim | Sim |
| Pesquisa ampla de jurisprudência | Com franquia | Sim | Sim |
| Parecer, minuta, revisão de contrato | Não | Sim | Sim |
| Resumo de autos | Franquia de páginas **[a testar]** | Sim | Sim |
| Vigilância por módulo | Não | Sim | Sim |
| **Conferência de citações da Peça** | **Sempre** | Sempre | Sempre |
| Segunda opinião completa | Não | Não | Sim |
| Modo cliente | Serviço à parte | Serviço à parte | Serviço à parte |

Ajustes propostos ao Estudo: (1) **UU ponderada pelo modelo** (por exemplo, 1 UU por 10 mil tokens do principal e por 100 mil do barato **[hipótese]**), que resolve o achado de 7.1; (2) **franquia visível em "documentos analisados"** (o Jus IA Essencial dá 10 cargas); (3) conferência de citações **fora da franquia**, por ser segurança; (4) **busca de norma sem IA** no módulo, mesmo para usuário "Sem IA" (custo só de índice) **[hipótese]**.

**Preço do módulo.** O custo é **fixo por módulo** (ingestão, auditoria mensal, benchmark, especialista) e independe dos usuários. **Hipótese:** assinatura **por escritório**, com assentos incluídos. Referências **de teste**: J5, R$ 40 a R$ 90 por usuário; Síntese, R$ 60 (Trabalhista, Família) e R$ 90 (Penal); Jus IA Premium, R$ 208,90. Pacote A: **[a definir; hipótese: abaixo da soma dos módulos]**. Sensibilidade ilustrativa (não é estimativa): se manter um módulo custasse R$ 3 mil, R$ 6 mil ou R$ 12 mil por mês, a R$ 60 por usuário seriam precisos 50, 100 ou 200 usuários pagantes. **Módulos da cauda não fecham sozinhos**, o que reforça o Completo e o rótulo "base mínima". Testar com 10 a 20 escritórios (JU-05). IA grátis por tempo limitado é prática do mercado (Jux até 15/01/2027, J8): **não depender do preço de IA para entrar**.

---

## 8. Ajustes pedidos, ordem de construção e perguntas

### 8.1 Ajustes pedidos

| # | Onde | Pedido |
|---|---|---|
| A1 | **Fundações 6.5** | Catálogo com `legal.consultar` jurídico, `peca.rascunhar`, `calculo.*` jurídicos, `modulo.ativar` e `modulo.desativar` |
| A2 | Fundações 4 | Entidades globais **Módulo de lei** e **Ativação** (escritório, módulo, versão ou "atual", datas); `Assinatura` lista módulos |
| A3 | Fundações 4 e 6 | **Classe de dado** (`P`, `G`, `E`) obrigatória em ferramenta, índice e evento; quem grava em área global só aceita `P` ou `G` |
| A4 | Fundações 3 | **Separação por pacote** (Jurídico invisível ao Contábil); usuário com **inscrição OAB** e papéis "advogado" e "apoio supervisionado" |
| A5 | Fundações 4.11; 08 (5.5) | Documento "termo de ciência de IA" com aceite; retenção configurável do conteúdo de transcript, separada do log técnico |
| A6 | Fundações 11 | Teste de vazamento com **canários** e entre pacotes |
| A7 | **02** | Consultor jurídico com os modos do pacote; `risco_padrao` das atividades de 4.4; memória do escritório recusa fato identificável de Caso; Consultor do cliente com termo |
| A8 | **07** | R-M5 vira R-J1 no pacote; contrato 3.2 (4.2); verificação 7 (6.1); abstenção tipada (2.7); **9.2, P3 e P6 não valem para o Jurídico**; benchmark 9.1 (6.2); gate 9.4 (6.4); `legal.diff_norma` com eventos de precedente e predicado por datas; `parecer.rascunhar` com modelos jurídicos |
| A9 | **JU-01** | Caso e Processo: ramo, justiça, tribunal, UF, comarca, fase, rito, **`data_do_fato`**, nível de sigilo, `ia_permitida`; Mandato com o termo; Peça com estado, versões, revisor, **origem de cada fato**, versões citadas; Andamento com `visivel_ao_cliente` e tradução |
| A10 | **JU-02** | Cartão com três datas, estado e força; cartões de abstenção tipada; tela **Módulos de lei**; revisão assinada que impeça exportar; segunda opinião; painel de qualidade; alertas por Caso |
| A11 | **JU-03** | Função de prazo como **única** fonte de datas, com memória de cálculo; calendário forense como Tabela normativa compartilhada; gabarito de prazos compartilhado; captura nunca dá ciência; custo de captura fora das UU |
| A12 | **JU-05** | `atualizacao_judicial` e `sucumbencia` reaproveitadas em honorários e êxito; `escopo_mandato` alimenta a cobrança; preço do módulo e pacotes (7.3) |

### 8.2 Ordem de construção

Etapas pequenas, **depois do BPO**; a E0 pode andar antes, por não ser código.

| # | Etapa | Depende de | Pronto quando |
|---|---|---|---|
| E0 | **Pré-condições**: parecer de advogado de ética e LGPD; tratativas com CNJ, CFOAB e tribunais (J4); inventário de fontes e licenças; provedor de modelo com as cláusulas de 5.5; contrato com a advogada da família | Nada | Parecer recebido; cláusulas aceitas |
| E1 | **Mini-piloto do núcleo** (100 documentos), Ficha 7 e calendário forense (com JU-03) | E0 | Duas rodadas sem mudar o núcleo |
| E2 | **Contratos no catálogo** (A1 a A3) | Fundações | Esquemas validam; devolvem `nao_implementada` |
| E3 | **Onda 0**: N0 e STJ aberto (2.410 precedentes) | E1, E2 | Auditoria de 100 dispositivos, erro até 2% |
| E4 | **Verificação jurídica e roteador** com área e três datas | E2 | Testes de data, estado, premissa falsa |
| E5 | **Sigilo e isolamento**: índice por escritório, sigilo por Caso, termo, retenção, redação de dados, canários | E2, A5, A6 | **Zero vazamento**; antes de qualquer dado real |
| E6 | **Benchmark v1** com a advogada da família | E4 | 100 casos corrigidos em duplo cego |
| E7 | **Onda 1**: Civil, N1 e depois N2 | E3, E4, E6 | Gate interno |
| E8 | **Perguntar e Pesquisa**; piloto fechado com a família, sob termo | E5, E7 | Perguntas reais medidas |
| E9 | **Onda 2**: Família; Trabalhista e Previdenciário; cálculos da onda | E7 | Gate interno |
| E10 | **Parecer, Minuta, Resumo, Revisão de contrato**, com revisão assinada, trilha e bloqueio | E8, JU-01, JU-02 | Peça não sai sem revisão |
| E11 | **Vigilância e segunda opinião** (`risco`) | E9, E10 | Norma sintética avisa só os Casos afetados |
| E12 | **Ativação de módulos** (assinatura, versão, desativação) com JU-02 e JU-05 | E9 | Desativar sem perder o já emitido |
| E13 | **Modo cliente**, com termo | E10, E12 | 60 casos "factual ou advogado" |
| E14 | **Ondas 3 a 7** na ordem da lista; Penal só com o portão | E9 | Gate de cada módulo |
| E15 | **Conferência por especialista**, por onda | E0 | Gate de lançamento (6.4) |
| E16 | **Lançamento por pacote**: B e C após a onda 2; A após Consumidor; Completo no fim | E15 | Todos os módulos do pacote aprovados |

### 8.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
|---|---|---|---|
| 1 | Sem a data do fato, o sistema pergunta ou assume hoje? | **Pergunta só se a lei mudou** entre as datas possíveis | "Se a data do acontecimento muda a resposta, o sistema pergunta antes?" |
| 2 | O cache de respostas pode ser global? | Só **perguntas canônicas** da base; as dos advogados ficam no escritório (muda o P3 do 07) | "A pergunta de um advogado nunca vira resposta guardada para outro escritório?" |
| 3 | Contadores sem texto (assunto, tipo de erro) podem sair do escritório? | **Não**, até o parecer de ética | "Posso contar quantas respostas erraram por assunto, sem ver a pergunta?" |
| 4 | IA sobre um Caso exige o termo do cliente? | **Sim**, bloqueio brando e atestado do advogado | "O sistema só usa IA num caso depois de o cliente assinar o aviso?" |
| 5 | Segredo de justiça: IA desligada para o conteúdo? | **Sim, por padrão**; o advogado liga | "Em segredo de justiça a IA fica desligada, salvo decisão do advogado?" |
| 6 | A conferência de citações da Peça vale em todos os planos? | **Sim**, fora da franquia; a segunda opinião completa fica no Intensivo | "A checagem das citações é obrigatória e de graça em qualquer plano?" |
| 7 | Cota ponderada pelo modelo e franquia por documentos? | **Sim** (ajuste ao Estudo) | "Autos longos custam centavos mas gastam a cota; mudo a regra da cota?" |
| 8 | Módulo cobrado por escritório ou por usuário? | **Por escritório**, assentos incluídos; pacotes abaixo da soma | "O módulo de lei é cobrado do escritório, não de cada advogado?" |
| 9 | Módulos da cauda saem em "base mínima" ou esperam? | **Saem rotulados**, sem parecer nem peça | "Áreas raras entram só com leis e súmulas, avisando que é base inicial?" |
| 10 | Quem recruta e paga os sete especialistas? | A empresa, por contrato e cessão de direitos, **só no lançamento** | "Contrato advogados especialistas na hora de lançar, e os modelos ficam nossos?" |
| 11 | Busca de norma sem IA vale para quem não tem plano? | **Sim** | "Quem não paga IA ainda pesquisa a lei no sistema?" |
| 12 | Onda 2: Família ou Trabalhista primeiro? | **Família** (testa a lei no tempo exigida pelo Penal) | "Começo pelo direito de família e depois o trabalhista, ou o contrário?" |
| 13 | O que o contador da família pode afirmar? | **Conferir** a base, sem selo jurídico | "O contador confere, mas só o advogado especialista aprova para vender?" |

**Ressalvas.** Textos oficiais do Estatuto, do Código de Ética, do CPC, da LGPD e da Res. CFOAB 16/26 não foram lidos nas pesquisas; sanções vêm de fontes secundárias; Tema 1368 e Lei 14.905/2024 estão como citados por J4. Estimativas de tokens, horas e preço são hipóteses para medir no piloto.

## Decisões do usuário (9/11/2026)

Resposta: **segue a hipótese em todas as perguntas** (tabela de perguntas para aval acima). Ficam aprovadas como escritas.

- **1 a 13 aprovadas.** Sem data do fato, o sistema pergunta só se a lei mudou entre as datas possíveis; contadores sem texto não saem do escritório até o parecer de ética; IA sobre Caso exige o termo do cliente (bloqueio brando e atestado do advogado); segredo de justiça com IA desligada por padrão; conferência de citações da Peça em todos os planos, fora da franquia; cota ponderada pelo modelo e franquia por documentos; módulo de lei por escritório; módulos da cauda saem rotulados como base mínima; busca de norma sem IA para quem não tem plano; especialistas contratados só no lançamento; **onda 2: Família antes de Trabalhista**; o contador da família confere a base, sem selo jurídico.

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
