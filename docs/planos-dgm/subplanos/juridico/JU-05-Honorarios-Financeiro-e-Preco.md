# JU-05 · Honorários, financeiro e preço do pacote Jurídico

**Versão 0.1 · 8/11/2026 · rascunho para decisão do usuário. Só planejamento: nada será desenvolvido agora** (decisão (d) da [Síntese](../../Sintese_Pacote_Juridico.md), seção 10). **[a confirmar]** marca o que as fontes não fecharam; **toda regra de honorário, ética e tributo deste documento é hipótese de desenho até passar por advogado e contador** (seção 7). **Todo preço é parâmetro de teste, nunca preço final de venda.**

Fontes: [Síntese](../../Sintese_Pacote_Juridico.md); pesquisas [J1](../../../pesquisa/juridico/J1-mercado-software-juridico.md) (preços), [J3](../../../pesquisa/juridico/J3-atividades-advocacia.md) (JUR-208 a JUR-217), [J4](../../../pesquisa/juridico/J4-fontes-e-integracoes.md) (captura), [J7](../../../pesquisa/juridico/J7-sgjur.md), [J8](../../../pesquisa/juridico/J8-matriz-de-funcionalidades.md), [J9](../../../pesquisa/juridico/J9-ordem-dos-modulos-de-base.md); [09 Financeiro](../09-Financeiro.md); [05 Timesheet](../05-Timesheet.md); [Estudo de Precificação](../../Estudo_de_Precificacao_por_Modulo.md) e `precificacao/parametros.json` (v0.8); [Plano da Plataforma](../../Plano_Plataforma_do_Escritorio.md) (DA-02 e DA-02.1). Entidades do pacote (nomes fixos): **Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico.** Os subplanos JU-01 a JU-04 são escritos em paralelo; os pontos de contato estão na seção 8.

---

## 1. Escopo e princípios

### 1.1 O que este subplano cobre

1. **Honorários da advocacia**, a lacuna de mercado (J8): êxito, sucumbência, partilha, repasse, retenção, conta de terceiros. Nenhum sistema estudado documenta isso em público.
2. **O que o Financeiro da plataforma já faz** e **o que só o jurídico precisa** (DA-02.1).
3. **Rentabilidade por caso e por área** e o **timesheet do advogado**.
4. **Preço do pacote Jurídico**: componentes, configurador, simulações, comparação com o mercado, implantação, migração e caixa do primeiro ano.
5. **Riscos fiscais e éticos** dos honorários e o que exige parecer.

**Fora de escopo:** ser banco, intermediar ou guardar dinheiro; escrituração contábil do escritório; decisão jurídica ou tributária pela IA; departamento jurídico de empresa (e-billing, provisão); desenvolvimento.

### 1.2 Princípios

| # | Princípio | Consequência |
| --- | --- | --- |
| H1 | O Financeiro é **sempre o da própria empresa** (DA-02.1, item 10) | Honorário, cobrança, caixa e DRE do escritório ficam no item Financeiro; o pacote só traz o que é jurídico |
| H2 | Se mais de um pacote precisa, é da plataforma | Contrato, parcela, boleto, Pix, régua, conciliação, NFS-e, caixa e DRE não são duplicados no pacote |
| H3 | **A plataforma não intermedia dinheiro** (09, R1) | Conta bancária, banco e certificado são do escritório; a plataforma registra, concilia e prepara ordens que o escritório executa na própria conta |
| H4 | **A IA propõe, a pessoa decide** | A IA detecta o evento no Andamento e calcula pelo Motor Cálculo; confirmar êxito, retenção, partilha e repasse é do advogado ou do sócio (J3: JUR-209 a 212 são "prepara, pessoa conclui") |
| H5 | Dinheiro de cliente nunca se mistura com o do escritório | Conta de terceiros fica fora do caixa, do DRE e do custo-hora; saldo de um cliente nunca cobre outro |
| H6 | Recebível condicionado nunca é caixa realizado | Êxito e sucumbência entram na projeção por probabilidade e data, em cenários; só viram caixa no recebimento |
| H7 | Nada se apaga (09, 3.3) | Estorno, ajuste e aditivo; cada mudança de base, percentual ou partilha deixa evento com diff |
| H8 | Valor, imposto e prazo de pagamento saem do motor, com fonte versionada | O modelo explica; não calcula (09, 8.4) |
| H9 | Dado financeiro é restrito (09, R8; 05, 8.4) | O Colaborador não vê honorário, margem nem custo-hora; sigilo por Caso vale também para o Honorário-Jurídico |
| H10 | Preço previsível | Sem "pedágio" por processo na base; o que tem custo variável de terceiros é complemento claro, a custo mais 20% (regra já adotada nos conectores) |

---

## 2. Honorários jurídicos

### 2.1 Modalidades

O **Contrato de honorários** do 09 continua sendo o documento e o ciclo (minuta, assinatura, aditivo, vigência). O **Honorário-Jurídico** é a entidade do pacote: cada honorário **devido ou previsto**, com a natureza jurídica, o Caso e o Processo a que se liga, a condição e a regra de partilha. Quando o honorário fica exigível, ele gera **Cobrança e Parcela** do 09; o resto do ciclo (boleto, régua, baixa, NFS-e) é do Financeiro.

| Modalidade | O que é | Como o sistema modela | Gatilho de cobrança | Ponto a confirmar |
| --- | --- | --- | --- | --- |
| **Fixo mensal** (iguala) | Valor mensal por assessoria ou carteira | Item do contrato, como no 09 (tipo fixo), com franquia de horas opcional e reajuste por índice | Mensal, no lote | Nenhum específico |
| **Por ato ou fase** | Valor por petição inicial, contestação, recurso, audiência | Honorário-Jurídico por **fase do Processo**; fase concluída vira exigível | Conclusão do ato (Peça protocolada) ou da fase | Descrever o que é "concluído" no contrato |
| **Por hora** | Horas do Timesheet × valor-hora | Pré-fatura mensal com horas aprovadas (4.3); teto e estimativa opcionais | Fechamento do mês | Cláusula de teto e de revisão |
| **Êxito** | Percentual ou valor condicionado a resultado | Condição + **evento gerador** (sentença, acordo, trânsito, levantamento) + base de cálculo (2.3) | Evento confirmado pelo advogado | Limites éticos da cláusula "quota litis" (CED, art. 50) **[a confirmar]** |
| **Sucumbenciais** | Fixados pelo juiz contra a parte vencida | Honorário-Jurídico criado pela decisão; rastreia fixação, execução, destaque e partilha | Execução ou levantamento | Titularidade (advogado ou sociedade) e partilha (CPC, art. 85; EAOAB, arts. 22 a 24) **[a confirmar]** |
| **Misto** | Fixo mais êxito; hora com teto mais êxito | Dois ou mais Honorários-Jurídicos no mesmo contrato; a soma respeita o limite do contrato | Cada um no seu gatilho | Soma de êxito e sucumbência dentro do que o cliente obtém (CED, art. 50) **[a confirmar]** |
| **Parcelado** | Entrada mais parcelas, ou acordo de pagamento | Parcelas do 09 (acordo de cobrança) ou parcelas por fase | Vencimentos | Parcelas por fase só valem se o contrato disser |
| **Consultoria** | Parecer, assessoria, contratos, diligência | **Caso consultivo** (sem Processo), com fixo, hora ou por entrega | Entrega ou mês | Aparece no catálogo de J3 (consultivo) |

**Padrão do EAOAB quando o contrato é omisso** (um terço no início, um terço até a sentença de primeira instância, o resto no final; art. 22, § 3º) **[a confirmar]**: o modelo de minuta sempre traz as datas e **nunca depende do padrão**.

### 2.2 O contrato e a minuta

O contrato nasce de uma **minuta do escritório** com cláusulas mínimas, preparada pelo integrante e **revisada por advogado** (J3: SOC-016 e SOC-019 no lado contábil; aqui, JUR-208 e 209). Vem do CRM (proposta aceita) e é assinado por ciência simples ou assinatura avançada (09, 4.1; J4: ZapSign, Clicksign e D4Sign, nível B). **A IA não aconselha o cliente sobre valor ou risco** (a atividade é do advogado, J3).

| Cláusula | Campo estruturado | Por que importa |
| --- | --- | --- |
| Objeto e Caso | `caso_id`, instâncias cobertas | Onde acaba o serviço contratado (recurso, execução, cumprimento) |
| Valor ou percentual e **base de cálculo** | `base_calculo` (lista fechada, 2.3) | Disputa mais comum em êxito |
| **Evento gerador** e prazo de pagamento | `evento_gerador`, `prazo_dias` | Dispara a cobrança |
| **Retenção** sobre valores levantados | `autoriza_retencao`, % e ordem de dedução | Retenção sem cláusula é infração (J3: JUR-212; CED, art. 48, §§ 2º e 3º) **[a confirmar]** |
| **Partilha** com advogados e parceiros | `regra_partilha` | Evita disputa entre sócios (J3: JUR-211) |
| **Despesas** (custas, perícia, diligência, deslocamento) | `politica_despesas`: adianta o escritório ou o cliente; reembolso | Liga ao 09, 4.6 |
| Reajuste, atraso e rescisão | Política de reajuste do 09, 4.3; juros e multa da política financeira | Ver 2.4 |
| Honorários na **desistência ou revogação** do mandato | `regra_revogacao` | Direito aos honorários proporcionais é ponto de conflito **[a confirmar]** |
| **Conta de terceiros** | Autorização de receber em nome do cliente (Mandato com poderes especiais) | Sem poder especial, não se levanta alvará em nome do cliente **[a confirmar]** |

Um **aditivo** (09, 3.1) altera percentual, base, partilha ou escopo, com aviso e aceite; nunca retroage. A **tabela de honorários da seccional da OAB** (a OAB SP incluiu 45 áreas em 2024, J9) aparece como **referência na tela da proposta** e como **piso para arbitramento** (EAOAB, art. 22, § 2º) **[a confirmar]**; a plataforma não obriga a segui-la e mostra o aviso quando o valor fica abaixo.

### 2.3 Êxito e sucumbência

**Base de cálculo** (lista fechada no contrato; o motor aplica e guarda a memória de cálculo, H8):

| Base | Exemplo | Origem do dado |
| --- | --- | --- |
| Valor da causa | Percentual sobre o valor atribuído | Processo |
| Valor da condenação (bruto ou líquido de custas) | Trabalhista, cível | Andamento da sentença e da liquidação |
| **Proveito econômico** | Benefício obtido, inclusive não monetário, valorado | Peça e decisão; a pessoa informa |
| Atrasados mais parcelas vincendas (previdenciário) | Limite de parcelas vincendas no contrato | Cálculo de liquidação |
| **Economia** (tributário) | Tributo afastado, com período definido | Decisão e planilha do cliente |
| Valor do acordo | Percentual sobre o total ou sobre a parte do cliente | Termo de acordo |

**Quando nasce e quando é devido.** Distinguimos quatro momentos, porque o mercado só mostra o último:

| Momento | Êxito contratual | Sucumbência |
| --- | --- | --- |
| **Nasce** (direito) | Cláusula assinada; condição ainda não ocorreu | A decisão que fixa os honorários; o direito é do advogado (EAOAB, art. 23; CPC, art. 85) **[a confirmar]** |
| **Evento ocorrido** | Evento gerador confirmado no Andamento (JUR-209) | Fixação transitada, em execução ou cumprimento |
| **Exigível** | Conforme o contrato: sentença, trânsito em julgado, levantamento | Valor líquido (cálculo ou precatório definido) |
| **Recebido** | Baixa no Recebimento do 09 | Alvará, depósito ou pagamento voluntário, com partilha |

**Estados do recebível condicionado** (no Honorário-Jurídico): `previsto`, `evento_ocorrido`, `exigivel`, `a_receber`, `recebido`, `perdido`, `renunciado`. Perder o processo move o êxito para `perdido` com motivo; nada se apaga.

**Quem detecta o evento.** O conector de Andamento (JU-03) ou o Prazo/Peça indicam a decisão; o integrante propõe "evento gerador ocorrido", mostrando o trecho; o advogado confirma em cartão (H4). A IA nunca marca êxito sozinha.

**Retenção, destaque e alvará.** Três mecanismos distintos, com o mesmo cuidado:

1. **Destaque dos honorários contratuais** no mandado de levantamento ou no precatório: exige juntar o contrato antes da expedição (EAOAB, art. 22, § 4º; J3, JUR-209) **[a confirmar]**. O sistema cria a tarefa e o alerta "contrato não juntado" antes do prazo.
2. **Retenção contratual** no valor levantado pelo cliente (JUR-212): só com cláusula; sem ela, o cartão bloqueia a dedução.
3. **Retenção de tributos na fonte** sobre o honorário recebido (7.1): parâmetro do contador, nunca descontado automaticamente sem aviso (queixa registrada no Astrea, J8, 4.3).

**Partilha entre advogados do caso e com parceiros.** Cada Honorário-Jurídico tem uma `regra_partilha`: participantes (advogado responsável, associado, sócio, correspondente ou parceiro externo), percentual ou valor, base (bruto ou líquido), momento (no recebimento). O motor Cálculo aplica a regra sobre o **recebido** (princípio já adotado para comissões no 09, 7.4) e gera uma **Apuração** com memória, que cada participante vê só na parte dele. A partilha entre sócios e associados segue o contrato de sociedade ou associação e o EAOAB (art. 24, § 3º-A, J3) **[a confirmar, inclusive decisão do STF citada em J3]**.

**Repasse.** O repasse ao participante vira **Conta a pagar** (09, 6.1), com aprovação por alçada, pagamento sempre com cartão e comprovante arquivado. Repasse a parceiro externo e a correspondente pede documento fiscal ou recibo do beneficiário **[a confirmar com o contador]**.

**Sucumbência: ciclo próprio.** Fixada na decisão; acompanhada na execução ou no cumprimento; destacada no alvará; partilhada. Quando há sucumbência recíproca ou compensação, o campo `compensada` registra a parte não recebível (CPC, art. 85, § 14, veda compensação em parte; confirmar redação atual) **[a confirmar]**. **Titularidade:** o contrato diz se o crédito vai ao advogado ou à sociedade; o sistema mostra a escolha na procuração (Mandato).

**Entidade Honorário-Jurídico (campos principais):**

| Campo | Conteúdo |
| --- | --- |
| `caso_id`, `processo_id` (opcional) | Onde nasce; consultivo não tem Processo |
| `contrato_item_id` | Item do Contrato de honorários (09) |
| `natureza` | contratual, exito, sucumbencial, arbitrado, consultoria |
| `base_calculo`, `percentual` ou `valor`, `teto`, `piso` | Regra |
| `evento_gerador`, `evento_andamento_id` | O que dispara e a prova (trecho do Andamento) |
| `probabilidade`, `data_esperada`, `definida_por` | Projeção de caixa (2.6); sempre definida por pessoa |
| `regra_partilha`, `retencao` | 2.3 |
| Estado | `previsto`, `evento_ocorrido`, `exigivel`, `a_receber`, `recebido`, `perdido`, `renunciado` |
| Memória de cálculo | Tabela e versão usadas |

### 2.4 Adiantamentos, custas adiantadas e reembolso

Três situações com tratamentos diferentes:

| Situação | Natureza | Tratamento |
| --- | --- | --- |
| **Honorário antecipado** (parcela inicial) | Receita do escritório | Parcela do 09; entra no caixa e no DRE |
| **Custas e despesas pagas pelo escritório** | Despesa adiantada, reembolsável | **Cobrança avulsa** combinável com o honorário na mesma fatura ou à parte (09, 3.1 e 4.6; FIN-002; JUR-214); recibo e comprovante anexos; `perdoada` exige motivo e alçada |
| **Valor entregue pelo cliente para custas e despesas** (provisão) | **Valor de terceiro**, não receita | Entra na **Conta do cliente** (2.5); sai quando a despesa é paga; saldo devolvido ou abatido do honorário conforme o contrato |

A despesa adiantada liga a **Caso, Processo e Peça** (ex.: preparo recursal). O integrante lê o comprovante, acha o Caso e propõe a despesa; o reembolso entra no lote do mês. Se o reembolso integra a base da nota e dos tributos, a política é configurável e o padrão é **recibo separado, fora da nota** (09, 4.6) **[a confirmar com o contador]**. Custa não reembolsada (por decisão ou perda do caso) vira **custo direto do Caso** na rentabilidade (4.1).

### 2.5 Contas do cliente e conta de terceiros

**Conta do cliente** é o razão de valores de **cada cliente em poder do escritório**, por Caso, com extrato. Existe para evitar o risco apontado em J3 (JUR-213: "mistura de recursos") e para prestar contas (o EAOAB trata a recusa de prestar contas como infração, art. 34, XXI) **[a confirmar]**.

| Regra | Efeito |
| --- | --- |
| **A plataforma não intermedia dinheiro** (H3) | Não existe conta da plataforma: o saldo está na **conta bancária do escritório** marcada como "conta de terceiros" (novo tipo de Conta bancária, 8.2); o sistema registra e concilia |
| **Segregação** | Lançamento de terceiro nunca entra no caixa próprio, no DRE nem no custo-hora; a conciliação casa o extrato bancário com o razão por cliente (Open Finance, módulo à parte do 09) |
| **Saldo nunca negativo por cliente** | Saída que deixaria o saldo de um cliente abaixo de zero é **bloqueada**; o dinheiro de outro cliente não cobre |
| **Entradas** | Provisão para custas; valor levantado (alvará, acordo, depósito); restituição |
| **Saídas** | Despesa do Caso; **repasse ao cliente** com retenção contratual; devolução; abatimento de honorário autorizado por escrito |
| **Prazo de repasse** | Alerta D+X após o crédito (X da política); repasse atrasado é risco ético (J3, JUR-212) |
| **Extrato no app** | O cliente vê o extrato do Caso pelo app, liberado pelo advogado (princípio do app do cliente) |
| **Cartão sempre** | Toda saída de conta de terceiros exige cartão do sócio; **nunca promovida** a automática |

**Repasse ao cliente, passo a passo.** Valor levantado entra na Conta do cliente pelo valor bruto, com a origem (alvará, acordo, depósito) → o motor calcula honorário destacado, retenção contratual e líquido, com memória → cartão ao sócio com a cláusula citada → ordem de pagamento preparada na API do banco do escritório (09, 6.1: pagamento é executar, irreversível) → comprovante e extrato ao cliente. A cláusula faltante bloqueia a retenção.

### 2.6 Depósitos judiciais, recebíveis condicionados e projeção de caixa

**Valores em juízo** (depósito recursal, garantia, consignação, penhora online) **não são dinheiro do escritório nem do cliente em mãos do escritório**: ficam como **registro ligado ao Processo**, num painel "Valores em juízo", com origem, data e situação. Só viram lançamento quando há **alvará ou transferência** (aí entram na Conta do cliente ou no destaque de honorários). Preparo e depósito recursal têm prazo e risco de deserção (J3: JUR-075 e JUR-098); o alerta é do Prazo, o dado financeiro é daqui.

**Controle de recebíveis condicionados** (êxito e sucumbência): painel por Caso, área e responsável com valor previsto, estado, probabilidade, data esperada e **envelhecimento** (evento ocorrido sem cobrança é alerta: "êxito esquecido", risco de J3). Precatório e RPV têm data incerta e longa: entram sem data até haver **ofício ou previsão** oficial.

**Projeção de caixa com êxito provável.** O fluxo de 12 meses do 09 (7.1) ganha uma linha **"recebíveis condicionados"**, em três cenários (a mesma lógica de base, conservador e otimista):

| Cenário | O que entra |
| --- | --- |
| **Conservador** | Só honorário fixo, parcelas e recebíveis com evento já ocorrido e valor líquido |
| **Base** | O conservador mais cada êxito e sucumbência por **valor × probabilidade**, na data esperada |
| **Otimista** | O base com a probabilidade dos casos de histórico melhor do escritório (jurimetria só do escritório, J7 #45) |

**Regras:** a probabilidade e a data são **sempre da pessoa** (a IA pode sugerir pela carteira do próprio escritório, nunca de outros); êxito sem probabilidade não entra; a linha aparece separada do caixa realizado (R7 do 09); o Gestor vê a diferença entre previsto e recebido por trimestre, o que calibra o escritório.

### 2.7 Ligações com Processo, Caso e Timesheet

| Entidade | Ligação | Uso |
| --- | --- | --- |
| **Caso** | Um Caso reúne Processos, horas, documentos e honorários (modelo "Cliente, Caso, Processos" do SGJur, J7 #19) | Âncora da rentabilidade e do sigilo |
| **Processo** | Fase, valor da causa, decisões; o Andamento dispara o evento gerador | Evento do êxito e da sucumbência |
| **Peça** | Peça protocolada fecha honorário por ato; preparo e custas ligam à Peça | Gatilho de cobrança |
| **Mandato** | Poderes especiais (receber e dar quitação), substabelecimento | Habilita Conta do cliente e levantamento |
| **Audiência** | Diligência e correspondente | Despesa e repasse a correspondente |
| **Timesheet** | Horas por Caso e atividade | Honorário por hora e rentabilidade (4) |

**Autonomia na tabela de J3** (para a planilha de aprovação): faz sozinho, com cartão onde há irreversibilidade: **JUR-208** honorário contratual, **JUR-213** conciliação da conta de terceiros, **JUR-214** reembolso, **JUR-216** faturar por hora e **JUR-217** rentabilidade. **Prepara, pessoa conclui:** **JUR-209** êxito, **JUR-210** sucumbência, **JUR-211** repasse a sócios, **JUR-212** repasse ao cliente e **JUR-215** cobrança de inadimplentes.

---

## 3. O que reaproveita do Financeiro da plataforma e o que é do jurídico

Segundo DA-02.1: o que mais de um pacote precisa é da plataforma, com **titular** (escritório; empresa cliente no BPO). No Jurídico o titular do Financeiro é o escritório. **Conta de terceiros é um terceiro uso do mesmo componente** (titular = escritório em custódia, natureza = terceiro) e exige ajuste nas Fundações (8.2).

| Função | Plataforma (09) | Específico do Jurídico | Observação |
| --- | --- | --- | --- |
| Contrato de honorários (ciclo, minuta, assinatura, aditivo) | Sim | Cláusulas jurídicas, `caso_id`, retenção, partilha | Modelo e campos novos, mesma entidade |
| Itens e faixas por métrica | Sim (fixo, faixa, unidade) | Por ato, hora, êxito, sucumbência, misto | Vira **Honorário-Jurídico** |
| Faturamento mensal em lote, avulso, 13º | Sim | 13º raramente; avulso = ato extra | Usa lote e avulsos do 09 |
| Reembolso de despesa adiantada (FIN-002) | Sim | Custas processuais, perícia; liga a Caso e Peça | Sem duplicar |
| Cobrança (boleto, Pix, Pix Automático) e régua | Sim | Régua com tom adequado ao cliente pessoa física | Mensagens do CRM; sigilo no texto |
| Baixa automática e conciliação | Sim | Casamento por Caso; Conta do cliente | Webhook, OFX, Open Finance |
| NFS-e dos honorários | Sim (Emissor Nacional) | Regra para sucumbência e para advogado pessoa física **[a confirmar]** | Parecer do contador |
| Contas a pagar e alçadas | Sim | Repasse a sócios, associados e correspondentes | Pagamento sempre com cartão |
| Fluxo de caixa, previsão e cenários | Sim | Linha de **recebíveis condicionados** | 2.6 |
| DRE por centro de custo | Sim | Centro de custo por **área do direito** e por **Caso** | Receita por Honorário-Jurídico |
| Custo-hora do escritório e Rentabilidade (05) | Sim | Rentabilidade por **Caso e área**, êxito ponderado | Seção 4 |
| Comissões e PLR (FIN-008, fase 4) | Sim, desligado | **Partilha e repasse** do Honorário-Jurídico, necessária no lançamento | Pedir antecipação (8.2) |
| Migração do financeiro (FIN-014) | Sim | Conectores de Astrea, ADVBOX, EasyJur, Projuris, SGJur (seção 6) | Ver 6.2 |
| **Evento gerador, êxito, sucumbência** | Não | **Sim** | Depende de Andamento (JU-03) |
| **Conta de terceiros e Conta do cliente** | Não | **Sim** (titular terceiro) | 2.5 |
| **Valores em juízo** | Não | **Sim** | Registro ligado ao Processo |
| **Tabela de honorários da OAB, aviso de piso** | Não | **Sim** | Referência por seccional |
| **Tributação e retenção específicas da advocacia** | Parâmetros do 09 | Parâmetros próprios | Parecer (seção 7) |

---

## 4. Rentabilidade por caso e por área, e o timesheet do advogado

### 4.1 Rentabilidade

O **custo-hora é um só, do escritório** (decisão de 7 e 8/11/2026; 05, 8.4; Estudo, 6.8.10): gastos do mês de **titular escritório** ÷ horas produtivas, incluindo todos os pacotes. O chip **"Pacote: Contábil | BPO | Jurídico | Todos"** vale aqui; o **custo-hora por pacote** é só um extra opcional, desligado por padrão. Para o Jurídico acrescentamos o filtro **"Área do direito"** (trabalhista, família, penal, civil e as demais da lista de J9) como dimensão do Caso, e o centro de custo por área no DRE.

| Medida | Conta | Observação |
| --- | --- | --- |
| **Custo do Caso** | Horas do Caso × custo-hora + custos diretos (custas não reembolsadas, perícia, diligência, correspondente) + custo de IA do Caso | Conta de terceiros fica fora |
| **Receita prevista** | Fixos e parcelas contratados + **êxito e sucumbência ponderados** por probabilidade | Com o alternador "só o certo" (sem condicionados) |
| **Margem prevista** | Receita prevista − custo | Competência (R7 do 09) |
| **Margem recebida** | Recebido − custo até a data | Caixa; separa caso deficitário de caso em espera de resultado |
| **Caso deficitário** | Margem prevista abaixo de zero **ou** horas acima de 80% do orçamento de horas do Caso sem fase concluída | Botão "propor revisão de honorário" e alerta ao responsável |

**Exemplo ilustrativo** (custo-hora de **R$ 150**, valor de exemplo, não dado de mercado; honorários inventados para mostrar a conta):

| Caso | Fixo | Êxito ponderado | Sucumbência ponderada | Receita prevista | Horas | Custo | Margem prevista | Leitura |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Divórcio consensual | 3.500 | 0 | 0 | 3.500 | 14 | 2.100 | 1.400 (40%) | Saudável |
| Reclamação trabalhista (30% de R$ 60 mil, 55%; sucumbência 10%, 55%) | 1.000 | 9.900 | 3.300 | 14.200 | 70 | 10.500 | 3.700 (26%) | Só fecha se vencer; recebido até agora: R$ 1 mil contra R$ 5,7 mil de custo |
| Previdenciário (20% de R$ 25 mil, 70%) | 1.500 | 3.500 | 0 | 5.000 | 30 | 4.500 | 500 (10%) | Margem fina |
| Consumidor, por hora (22 h × R$ 300) | 6.600 | 0 | 0 | 6.600 | 22 | 3.300 | 3.300 (50%) | Saudável |
| Assessoria mensal fixa (R$ 1.200) | 1.200 | 0 | 0 | 1.200 | 12 | 1.800 | −600 (−50%) | **Deficitário:** reajuste ou renegociação (GES-014) |

A leitura por **área** soma os casos: margem, horas, ticket e **taxa de êxito sem acordo e sem extinção sem mérito**, no estilo da jurimetria própria do SGJur (J7 #45), **só com dados do escritório** (decisão de sigilo B da Síntese). O custo de IA entra com centavos por Caso (05, 7.2).

### 4.2 O timesheet do advogado

O Timesheet é da plataforma. O pacote acrescenta o **Caso** como âncora e o catálogo jurídico de atividades (união com os outros pacotes, DA-02.1, item 4).

| Elemento | Regra |
| --- | --- |
| **Lançamento** | Por Caso e atividade; a IA propõe horas a partir da agenda, de Peças e de e-mails, e **o advogado confirma** (J3, JUR-027; 05, aba Confirmações) |
| **Faturável ou não** | Marcação por lançamento; hora não faturável entra no custo, não na pré-fatura |
| **Valor-hora de cobrança** | **Diferente do custo-hora do escritório.** É a tarifa por advogado ou por grau (J7 #51 guarda valor e custo por advogado; aqui só o valor de cobrança é por pessoa) e vem do contrato ou da tabela; visibilidade: Gestor e o próprio advogado **(pergunta f)** |
| **Honorário por hora** | O fechamento do mês gera uma **pré-fatura**: horas aprovadas × valor-hora, por Caso, com ajuste do sócio (corte, desconto) sempre com cartão; vira Cobrança do 09 (JUR-216) |
| **Retainer com franquia** | Horas dentro da franquia não geram fatura; excedente sim (J7 #54) |
| **Honorário fixo ou êxito** | O relatório de horas vira prova de trabalho e base de rentabilidade, **sem preço** |
| **Teto e estimativa** | Alerta a 80% do orçamento de horas do Caso; aviso ao cliente só por decisão do advogado |
| **Fechamento de competência** | Mês fechado não aceita edição; reabrir exige motivo (J7 #52, 09 R3) |
| **Relatório ao cliente** | Horas por Caso no app, liberado pelo advogado |

O Colaborador não vê custo-hora, honorário nem margem (05, 8.4); vê as próprias horas e a pré-fatura da sua parte, se o sócio liberar.

---

## 5. Preço do pacote Jurídico

**Tudo nesta seção é parâmetro de teste, não preço final de venda.** Âncoras: sistema-base segue o mercado e a margem alta fica na IA (decisão de 7/11/2026); mercado jurídico em **R$ 220 a R$ 500 por mês** para escritório pequeno (J1); **SGJur a R$ 377, R$ 1.977 e R$ 4.200** (J7); contrato modular **plataforma + pacote de área + módulos** (DA-02).

### 5.1 Componentes

| Camada | Componente | Origem | Obrigatório |
| --- | --- | --- | --- |
| Plataforma | **Núcleo** (contas, papéis, cadastro, tarefas, cofre, tema, Gestão) | `nucleo_sem_contabil` do `parametros.json` | Sim |
| Pacote de área | **Pacote Jurídico** (Processo, Prazo, Caso, Honorário-Jurídico, calendário forense, motor de prazos) | Novo | Sim (pelo menos um pacote) |
| Módulos da plataforma | Timesheet, Financeiro, App do cliente, CRM | Já existem; preço próprio no Jurídico (5.2) | Opcionais |
| Complemento do pacote | **Captura de publicações** (DJEN e Domicílio, hospedada no Brasil) | J4; novo | Opcional, pré-marcado no atalho |
| Complemento do pacote | **Monitoramento de andamentos por agregador** | J4: Judit R$ 1,50 por processo | Opcional |
| Complemento do pacote | **Peticionamento assistido** (prepara e confere; o advogado protocola) | J4 | Opcional |
| Módulos de base de leis | Trabalhista, Família e Sucessões, Penal, Civil e demais (J9) | J4, J9 | Opcional |
| IA | **Planos por usuário:** Essencial R$ 79, Operação R$ 189, Intensivo R$ 299 | Estudo 6.8 | Opcional |
| Extras | Marca branca (R$ 150), app na loja (R$ 350), armazenamento (R$ 0,45 por GB) | `parametros.json` | Opcionais |

**Franquia de armazenamento (premissa):** 15 GB por usuário incluídos (SGJur dá 20, 70 e 160 GB por plano, J7; custo de R$ 0,20 por GB). **WhatsApp:** repassado ao custo da Meta, como no Contábil.

### 5.2 Estrutura do configurador e parâmetros de teste

A equação do Estudo (6.1) continua: soma dos módulos (base B, mais cliente a, mais usuário u) com faixas marginais de clientes, mais complementos, mais IA, mais consumo acima do teto. **Três mudanças propostas para o Jurídico:** (1) **tabela de preços por pacote de área** para os módulos da plataforma, porque as bases do Contábil (CRM R$ 200, Painel R$ 200) vêm da âncora HubStrom e jogariam o solo muito acima do mercado jurídico; (2) um novo componente **processo** (processos ativos cadastrados) com faixa degressiva própria; (3) **piso mensal próprio do pacote**, de **R$ 250** (o do Contábil é R$ 700), pois o solo jurídico de mercado começa em R$ 79 a R$ 377.

Unidade de **cliente**: pessoa ou empresa com Caso ativo. **Premissa (a medir):** 1,6 processo por cliente. Unidade de **usuário** e de **inscrição OAB (advogado)**: premissa de 60% dos usuários serem advogados.

| Componente (R$ por mês) | Base B | Por cliente a | Por usuário u | Por processo ativo | Origem |
| --- | ---: | ---: | ---: | ---: | --- |
| Núcleo | 100 | 0,30 | 5 | 0 | **Herdado** (`nucleo_sem_contabil`) |
| **Pacote Jurídico** | 30 | 0 | 18 | 0,12 | **Novo (teste)** |
| Timesheet | 20 | 0 | 7 | 0 | Base reduzida (Contábil: 40) |
| Financeiro (honorários) | 30 | 0,40 | 0 | 0 | Base e a reduzidas (Contábil: 80 e 1,30) |
| App do cliente | 30 | 0,15 | 0 | 0 | Reduzido (Contábil: 80 e 0,30) |
| CRM | 40 | 0,40 | 2 | 0 | Reduzido (Contábil: 200 e 0,90) |
| **Captura de publicações** | 0 | 0 | 15 por inscrição OAB | 0 | **Novo (teste)** |
| **Monitoramento de andamentos** | 0 | 0 | 0 | 1,80 por processo monitorado (custo mais 20%) | **Novo (teste)**; custo J4 |
| **Peticionamento assistido** | 0 | 0 | 19 por inscrição OAB | 0 | **Novo (teste)** |

**Faixas de clientes:** as do Contábil (1,00; 0,92; 0,85; 0,75; 0,65; 0,55; 0,50). **Faixa de processos ativos (novo, teste):** 1 a 100: 1,00; 101 a 300: 0,90; 301 a 1.000: 0,80; acima: 0,70. **Piso do pacote:** R$ 250.

**Atalhos do Jurídico** (seleções pré-marcadas, sem desconto implícito, como em 8.1 do Estudo): **Jurídico Essencial** = núcleo + pacote + captura de publicações. **Jurídico Integrado** = Essencial + Timesheet + Financeiro + App. **Jurídico Completo** = Integrado + CRM, com IA e módulos à escolha. Extras nunca pré-marcados: monitoramento, peticionamento, marca branca, app na loja.

### 5.3 Custos por componente e fonte

Listas = [baixo, provável, alto], R$ de 7/11/2026 (R$ 7,97 por US$). **Herdado** vem do `parametros.json`; o resto é **premissa a medir**.

| Componente | Fixo por escritório | Por cliente | Por usuário | Por processo | Fonte |
| --- | --- | --- | --- | --- | --- |
| Núcleo (com suporte por assento) | 12 / 22 / 55 | 0,10 / 0,30 / 0,75 | 6 / 12,50 / 25 | n/a | Herdado |
| Pacote Jurídico | 3 / 6 / 15 | n/a | 1 / 2 / 4 | 0,02 / 0,05 / 0,12 | Premissa (índice e calendário por inquilino) |
| Timesheet | 0 | 0 | 1 / 2 / 5 | n/a | Herdado |
| Financeiro | 3 / 8 / 20 | 0,052 / 0,10 / 0,30 | 0 | n/a | Herdado |
| App do cliente | 3 / 5 / 10 | 0,10 / 0,20 / 0,50 | 0 | n/a | Herdado |
| CRM (sem WhatsApp) | 0 | 0,20 / 0,43 / 1,18 | 0 | n/a | Herdado |
| Chat de suporte e ajuda | n/a | n/a | 1 / 2 / 4 e 0,06 / 0,16 / 0,65 | n/a | Herdado |
| **Captura de publicações** | Coletor no Brasil e monitor de saúde: **R$ 400 por mês para a plataforma** (premissa) | n/a | 2 / 4 / 8 por inscrição (premissa) | n/a | J4: DJEN só responde de IP brasileiro; construir ou contratar **[a confirmar]** |
| **Monitoramento de andamentos** | Mínimo de faixa **R$ 1.000 por mês** do agregador **[a confirmar]** | n/a | n/a | **1,00 / 1,50 / 2,00** | J4: **Judit, R$ 1,50 por processo por mês** (tabela pública, faixa de R$ 1 mil); baixo e alto são premissas; DJEN pela Judit: R$ 1,35 |
| **Peticionamento assistido** | n/a | n/a | 1 / 2 / 4 por inscrição | n/a | Premissa |
| **Módulo de lei** | Curadoria e revisão: **R$ 1.500 por módulo** na primeira versão (normas, súmulas e tabelas); **R$ 4.000** com jurisprudência e doutrina | n/a | 1 / 2 / 4 | n/a | Premissa; J9 (camadas L0 a L5) |
| **IA (planos)** | n/a | n/a | Utilização do teto × limite × R$ 0,0882 por UU + infraestrutura | n/a | Estudo 6.8.5 |

**IA no jurídico:** J5 alerta que o consumo é maior (autos e peças). Proposta: **utilização provável de 50% do teto** (Contábil: 35%), alta de 80% e pior de 100% **[premissa; medir no piloto]**. Custo provável por advogado: **Essencial R$ 26** (0,50 × 430 UU × R$ 0,0882 + R$ 7), **Operação R$ 71** (0,50 × 1.290 × 0,0882 + R$ 14). Margem da IA isolada, provável: Essencial 67%; Operação 62%; no pior caso 20% e 16%.

**Fixos do pacote, para o nível (b) das margens:** R$ 400 (coletor) + R$ 1.000 (mínimo do agregador) + 3 módulos × R$ 1.500 = **R$ 5.900, arredondado a R$ 6.000 por mês** [premissa]. A plataforma (R$ 8,2 mil, 9.4 do Estudo) já é paga pelo Contábil e pelo BPO; a coluna "sozinho" mostra o caso do Jurídico como único produto.

### 5.4 Simulações para três escritórios

**Perfis (premissas a medir):** **Solo:** 1 usuário (1 inscrição OAB), 80 processos, 50 clientes. **Pequeno:** 5 usuários (3 advogados), 400 processos, 250 clientes. **Médio:** 10 usuários (6 advogados), 1.000 processos, 625 clientes. Margens com o uso provável; fixos rateados com **30 escritórios de 5 usuários equivalentes** (peso = usuários ÷ 5); tributos de 12,5% e comissão 0% (valores do Estudo, ainda a confirmar com o contador).

**Cenários:** **E** Jurídico Essencial; **I** Integrado (com Timesheet, Financeiro, App, captura de publicações); **C** Completo (I mais CRM); **C+IA** = C com **IA Essencial e módulo Trabalhista (R$ 60)** para os advogados; **C+IA+** = C com monitoramento de 40% dos processos, **IA Operação**, módulo Trabalhista e peticionamento assistido.

| Escritório | Cenário | Preço mensal | Custo provável | (a) Contribuição | (b) Após fixos | (c) Líquida |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| **Solo** (1; 80 proc.) | E (piso R$ 250) | 250 | 68 | 72,8% | 56,8% | 44,3% |
| | I | 306 | 98 | 68,1% | 55,0% | 42,5% |
| | C | 367 | 119 | 67,5% | 56,6% | 44,1% |
| | C+IA | 506 | 147 | 70,9% | 63,0% | 50,5% |
| | C+IA+ | 693 | 242 | 65,1% | 59,3% | 46,8% |
| **Pequeno** (5; 400 proc.) | E | 395 | 218 | 44,7% | 5,6% (ver nota) | −6,9% |
| | I | 623 | 316 | 49,3% | 17,2% | 4,7% |
| | C | 756 | 424 | 43,9% | 17,5% | 5,0% |
| | C+IA | 1.173 | 508 | 56,7% | 39,7% | 27,2% |
| | C+IA+ | 1.848 | 888 | 51,9% | 41,1% | 28,6% |
| **Médio** (10; 1.000 proc.) | E | 682 | 456 | 33,1% | −25,6% (ver nota) | −38,1% |
| | I | 1.073 | 677 | 36,9% | −0,4% | −12,9% |
| | C | 1.307 | 945 | 27,7% | −2,9% | −15,4% |
| | C+IA | 2.141 | 1.113 | 48,0% | 29,3% | 16,8% |
| | C+IA+ | 3.635 | 1.995 | 45,1% | 34,1% | 21,6% |

*Nota:* as margens (b) e (c) do cenário E foram obtidas com o mesmo rateio de R$ 6.000 dos demais (R$ 200 por escritório de 5 usuários), que é pesado para quem paga só R$ 395; o rateio verdadeiro dependerá de quantos escritórios existirem. Linha E: contas conforme `(preço − custo − rateio) ÷ preço`.

**Conta do pequeno em C+IA** (preço): núcleo R$ 187 + pacote R$ 163 + Timesheet R$ 55 + Financeiro R$ 112 + App R$ 61 + CRM R$ 132 + captura 3 × R$ 15 = R$ 45 + IA Essencial 3 × R$ 79 = R$ 237 + módulo Trabalhista 3 × R$ 60 = R$ 180, total R$ 1.173 (arredondado). **O monitoramento a 100% dos processos** custaria ao cliente R$ 144 (solo), R$ 720 (pequeno) e R$ 1.800 (médio): é o complemento que mais empurra o preço acima do mercado (5.7).

**Uso alto e pior caso (estresse).** No sistema-base sem IA, a contribuição no uso alto fica em **23,5% (solo), −20,8% (pequeno) e −51,3% (médio)**; é o mesmo padrão do grande do Contábil (−54,2%): o custo por cliente e por usuário não cai com a escala e o preço de mercado não cresce. **O remédio é o teto de uso e a IA** (com C+IA, o pequeno no uso alto fica em −3,2% e no pior caso −6,6%); medir o uso real nos dez primeiros escritórios antes de fixar o preço.

### 5.5 Comparação com R$ 220 a R$ 500 e com o SGJur

| Escritório | Nosso Integrado (I) | Faixa de mercado (J1) | SGJur (J7) | Leitura |
| --- | ---: | --- | --- | --- |
| Solo | **R$ 306** (Essencial R$ 250) | R$ 79 a R$ 377; entrada típica R$ 220 a R$ 249 | Advogado R$ 377 (1 inscrição, 20 GB, Stella) | **Dentro da faixa**; 19% abaixo do SGJur; com CRM R$ 367, ainda abaixo |
| Pequeno (5) | **R$ 623** (Essencial R$ 395) | R$ 349 a R$ 499 (Projuris, Astrea Smart R$ 439, ADVBOX R$ 450, EasyJur R$ 499) | Equipe R$ 1.977 (6 usuários, 6 inscrições) | **25% acima do topo da faixa** no Integrado; o Essencial (R$ 395) fica dentro; **68% abaixo do SGJur** |
| Médio (10) | **R$ 1.073** (Essencial R$ 682) | R$ 769 a R$ 990 (Astrea Company, ADVBOX Banca Max, EasyJur Standard) | Escritório R$ 4.200 (15 usuários; o menor plano que comporta 10) | **8% acima do EasyJur Standard**; Essencial abaixo; **74% abaixo do SGJur** |

O SGJur cobra **R$ 377, R$ 330 e R$ 280 por usuário** nos três planos e tem um **degrau grande** (de R$ 377 a R$ 1.977 ao passar de 1 para 2 advogados, J7), que não favorece o escritório pequeno; nossa curva é gradual. **Com IA:** o mercado vende IA à parte (Jus IA R$ 78,90 a R$ 208,90 por usuário); a soma de Astrea Smart (R$ 439) e 3 Jus IA Essencial (R$ 237) é **R$ 676**, contra **R$ 1.173** do nosso C+IA (que inclui CRM e WhatsApp integrados, Financeiro com êxito e conta de terceiros, e IA com citação conferida).

### 5.6 Margens em três níveis

Definidas como no Estudo (1.6): **(a) contribuição** = preço − custo variável e rateado por usuário e cliente; **(b) após fixos** = (a) − rateio dos fixos do pacote (R$ 6.000 ÷ 30 escritórios de 5 usuários equivalentes); **(c) líquida estimada** = (b) − tributos de 12,5% (faixa de 8% a 17%) e comissão de 0%.

| Escritório e cenário | (a) | (b) só fixos do pacote | (b) se o Jurídico fosse o único produto (mais R$ 8,2 mil de plataforma) | (c) |
| --- | ---: | ---: | ---: | ---: |
| Pequeno, Integrado | 49,3% | 17,2% | −26,7% | 4,7% |
| Pequeno, C+IA | 56,7% | 39,7% | 16,4% | 27,2% |
| Médio, Integrado | 36,9% | −0,4% | −51,3% | −12,9% |
| Médio, C+IA | 48,0% | 29,3% | 3,8% | 16,8% |

**Leitura honesta.** (1) A **base sem IA não paga a plataforma**, como já era verdade no médio e no grande do Contábil: o preço segue o mercado e a margem está na IA. (2) A base do **solo** é saudável (68%) porque quase não consome usuário e cliente. (3) O **Integrado do médio** (R$ 1.073) está em equilíbrio em (b) e negativo em (c): sem IA e sem implantação cobrada, não se sustenta. (4) **Ponto de equilíbrio do pacote (fixos de R$ 6 mil):** com a contribuição de C+IA, 12 escritórios pequenos; só com a base I, 19. **Equilíbrio de cada módulo de lei:** ver 5.8.

### 5.7 Ponto em que a oferta fica acima do mercado, e como justificá-la

| Ponto | Onde acontece | Magnitude |
| --- | --- | --- |
| **1. Integrado a partir de cerca de 4 usuários e 320 processos** | Preço cruza R$ 500: 3 usuários R$ 469; 4 usuários R$ 539; 5 usuários R$ 623 | +8% a +25% sobre o topo da faixa |
| **2. Monitoramento por agregador acima de poucos processos** | R$ 1,80 por processo; a 100% dos processos, R$ 720 (pequeno) e R$ 1.800 (médio) | Acima do mercado, que inclui 1.000 processos no ADVBOX Essencial (R$ 220) |
| **3. IA com módulo de lei** | R$ 139 (Essencial com módulo) a R$ 249 (Operação com módulo) por advogado | Faixa do Jus IA (R$ 78,90 a R$ 208,90); **acima** quando se soma Operação e módulo |

**Como justificar (o que está no preço e o mercado vende à parte ou não tem):**

1. **CRM e WhatsApp no mesmo cadastro do processo, do prazo, das horas e do financeiro**: lacuna registrada (J1, J8). O EasyJur cobra R$ 499 de Talk e R$ 880 de setup, sem preço de IA.
2. **Financeiro de advocacia completo**: êxito, sucumbência, partilha, repasse, retenção e conta de terceiros (nenhum sistema documenta, J8).
3. **Timesheet com rentabilidade por Caso e por área**, que o mercado só tem em planos altos (J1).
4. **Preço previsível**: publicações sem "pedágio", sem taxa de adesão e com reajuste informado; a cobrança por processo só existe no complemento explicitado (queixa recorrente, J8).
5. **IA com citação conferida e abstenção** (J5), vendida como verificabilidade.

**Como reduzir o preço sem perder margem (alavancas de custo):** (i) **captura própria do DJEN e do Domicílio** no lugar de pagar por processo, deixando o agregador só para os processos de risco; (ii) contrato de **DataJud comercial** pela Res. CNJ 574/2024, ainda a negociar (J4); (iii) **volume** com a Judit (faixas acima de R$ 1 mil por mês) ou segundo fornecedor; (iv) **atalho Essencial** (R$ 395 para 5 usuários) para quem só quer processos, prazos e agenda. **Risco de concorrência:** o ADVBOX inclui 1.000 processos por R$ 220; se isso se apoiar em robô logado como advogado, o risco de bloqueio de credencial é do cliente (J4); não competiremos nesse ponto.

### 5.8 Exemplo de oferta por módulo de lei (valores de teste)

Valores por usuário por mês, para o advogado com IA, dentro da hipótese de J5 (R$ 40 a R$ 90 por módulo), como na Síntese 6.4. **Marcados como parâmetros de teste; não são dado de mercado e a hipótese não foi testada (J9).**

| Oferta | Conteúdo | Módulo de teste | Com IA Essencial (R$ 79) | Com IA Operação (R$ 189) | Equilíbrio do módulo (R$ 1.500 de curadoria) | Equilíbrio (R$ 4.000) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| **Trabalhista** | Núcleo, M3, índices, STJ | R$ 60 | R$ 139 | R$ 249 | 30 advogados | 79 |
| **Família e Sucessões** | Núcleo, M5, ITCMD | R$ 60 | R$ 139 | R$ 249 | 30 | 79 |
| **Penal** | Núcleo, M4, revisão reforçada | R$ 90 | R$ 169 | R$ 279 | 20 | 52 |

Equilíbrio = fixo ÷ (preço × 0,875 − R$ 2 de custo por usuário), com tributos de 12,5%. **Penal só sai depois da camada de lei no tempo e da política de dados sensíveis** (J5), e **só para advogado inscrito**. **Pacotes combinados de J9 (hipótese, a testar com 10 a 20 escritórios):** Generalista (Civil, Família, Trabalhista, Previdenciário, Consumidor) a **R$ 100**; Trabalhista e Previdenciário a **R$ 80**; Família e Sucessões a **R$ 60**; Penal como complemento a **R$ 90**; Completo (todos os módulos) a **R$ 110**, mantendo **Operação com módulo abaixo de R$ 300** (J5). **Todos os módulos devem existir** (decisão (c) da Síntese): em 19 módulos na primeira versão, o custo fixo de curadoria seria de **R$ 28,5 mil por mês** (19 × R$ 1.500), o que só se paga com carteira ampla; por isso a ordem de J9 e a regra "L0, L1 e L4 primeiro".

### 5.9 Tabela de parâmetros a acrescentar (proposta; não edito `parametros.json` nem a calculadora)

| Chave proposta | Valor de teste | Observação |
| --- | --- | --- |
| `pacotes_area.juridico.piso_mensal` | 250 | Piso próprio do pacote |
| `pacotes_area.juridico.modulos_plataforma` | Tabela da seção 5.2 (Timesheet 20 + 7u; Financeiro 30 + 0,40c; App 30 + 0,15c; CRM 40 + 0,40c + 2u) | Preço por pacote de área |
| `pacotes_area.juridico.pacote` | preço 30 + 18u + 0,12 por processo; custo da seção 5.3 | Novo módulo |
| `faixas_processos` | 100: 1,00; 300: 0,90; 1.000: 0,80; acima: 0,70 | Novo |
| `escritorios_tipo_juridico` | Solo (1; 80 proc.; 50 clientes; 1 inscrição); Pequeno (5; 400; 250; 3); Médio (10; 1.000; 625; 6) | Premissas a medir |
| `complementos.captura_publicacoes` | preço 15 por inscrição; custo 2 / 4 / 8; fixo plataforma 400 | Novo |
| `complementos.monitoramento_andamentos` | preço 1,80 por processo; custo 1,00 / 1,50 / 2,00; mínimo de faixa 1.000 | Custo J4 |
| `complementos.peticionamento_assistido` | preço 19 por inscrição; custo 1 / 2 / 4 | Novo |
| `ia.utilizacao_plano_juridico` | 0,15 / 0,50 / 0,80 / 1,00 | Proposta; Contábil: 0,15 / 0,35 / 0,70 / 1,00 |
| `modulos_lei` | Trabalhista 60; Família e Sucessões 60; Penal 90; fixo de curadoria 1.500 (v1) ou 4.000; custo 1 / 2 / 4 por usuário | Teste |
| `fixos_pacote_juridico` | 6.000 por mês (400 + 1.000 + 3 × 1.500) | Premissa |
| `implantacao_juridico` | Seção 6.1 | Horas e tabela |
| `armazenamento.gb_padrao_por_usuario_juridico` | 15 | Premissa |

A **calculadora** precisaria de: seletor de pacote de área, campos de processos e de inscrições OAB, tabela por pacote para os módulos da plataforma e a utilização de IA por pacote. Fica para quando o jurídico for construído.

---

## 6. Implantação e migração, e caixa dos primeiros 12 meses

### 6.1 Implantação

Horas **[estimativa a medir no piloto]**, a **R$ 90 por hora** (premissa do Estudo; R$ 70 a 130). O **piso é a margem zero** (P27): o time nunca vende abaixo do custo de entrega.

| Atividade | Solo | Pequeno | Médio |
| --- | ---: | ---: | ---: |
| Contrato, inquilino, tema, usuários e papéis | 1,5 | 3 | 5 |
| Cadastro do escritório (inscrições OAB, tribunais de atuação, calendário forense, modelos de contrato de honorários) | 1,5 | 3 | 5 |
| Importação de clientes, processos e Partes e conferência (2 h mais 1 h por 100 processos) | 2,8 | 6 | 12 |
| Captura de publicações: ativar e validar por inscrição | 1 | 2 | 3 |
| Financeiro: contratos de honorários, conta de cobrança, régua, regras de êxito e partilha | 1,5 | 3 | 5 |
| CRM e App (setores, modelos) | 1 | 3 | 4 |
| Treinamento | 2 | 5 | 8 |
| Acompanhamento de 30 dias | 2 | 4 | 6 |
| **Trilha completa** | **13,3 (≈ 14 h)** | **29 h** | **48 h** |
| Custo (piso) | R$ 1.260 | R$ 2.610 | R$ 4.320 |
| **Preço de tabela de teste** | R$ 1.800 | R$ 3.900 | R$ 6.500 |
| Desconto máximo até o piso | 30% | 33% | 33,5% |

**Solo em trilha enxuta:** 6 horas assistidas (importação conferida e treinamento) e o resto em autoatendimento: custo (piso) **R$ 540**, tabela **R$ 900**. Quem não quiser assistência faz sozinho, sem cobrança. O mercado jurídico pequeno cobra pouco ou nada de implantação (Astrea tem plano gratuito de um ano, J1), diferente da HubStrom do Contábil; o prêmio só se justifica em escritórios de 5 ou mais usuários.

### 6.2 Migração e importação

**O que precisamos trazer:** clientes e contatos; processos (número CNJ, classe, vara, valor da causa, fase, Partes e advogados contrários); andamentos e publicações (histórico); Prazos abertos; Audiências; tarefas; documentos; **contratos de honorários, parcelas abertas, recebidos e êxitos pendentes**; horas lançadas.

| Via | Como funciona | Fonte |
| --- | --- | --- |
| **Lista de números CNJ** | Colar números, validar o dígito, consultar a capa pelo DataJud ou agregador e **criar o Caso por processo**; reconstrói capa e andamentos sem exportar nada | SGJur faz assim, lote de 20 (J7 #21, SG-020) |
| **Planilha ou exportação do sistema atual** | Mapeamento de colunas e conferência | Legal One importa planilha; ADVBOX e EasyJur **vendem migração assistida**; DataJuri tinha pedido de importação em lote; Astrea tem pedido de backup completo (J8, FX-007) |
| **API** | Só onde houver | EasyJur (API aberta com MCP em complemento), Projuris ADV completo (API pública), Legal One e eLaw (APIs): **formatos e limites a confirmar** |
| **Financeiro** | Contratos, parcelas abertas e recebidos por planilha; êxitos pendentes mapeados à mão | Nenhum sistema documenta êxito (J8): o mapeamento é **manual assistido** |

**O que cada sistema exporta (SGJur, Projuris, Advbox, Astrea e outros): não está verificado nas fontes.** Os relatórios não entraram em áreas logadas; só as páginas públicas foram lidas. **[a confirmar]** com teste em conta de avaliação (Astrea 10 dias, Projuris 7 dias, ADVBOX e EasyJur 7 dias, eLaw Adv 10 dias sem cartão) e com a advogada da família. Prioridade alta de J8 (FX-007): **exportar tudo a qualquer hora**, também do nosso sistema, para reduzir o medo de troca.

**Horas e preço da migração** (opcional, tabela a R$ 130 por hora; piso a R$ 90): histórico e documentos de outro sistema: solo 3 h, pequeno 10 h, médio 20 h; financeiro (contratos, parcelas, êxitos): 2 h, 6 h e 12 h **[premissa]**. Com as duas migrações: custo (piso) R$ 450, R$ 1.440 e R$ 2.880; tabela R$ 650, R$ 2.080 e R$ 4.160. Mais **R$ 50 a 300** de indexação de documentos.

### 6.3 Caixa dos primeiros 12 meses, em três cenários

Regras do Estudo (8.5): entradas = implantação (à vista, no mês da assinatura, com desconto) e mensalidades; saídas = horas de implantação, custo variável, fixos, tributos de 12,5% sobre as entradas; **mensalidade começa um mês depois**; sem capital inicial. **Mix de escritórios novos:** 50% solo (trilha enxuta), 40% pequeno e 10% médio. **Configuração:** parte dos escritórios fica só com a base (cenário I) e parte leva C+IA. **Fixos do pacote R$ 6 mil por mês**, com a plataforma já paga por outros produtos; entre parênteses, a variante **com a plataforma inclusa** (R$ 14,2 mil).

| | **Conservador** | **Base** | **Otimista** |
| --- | ---: | ---: | ---: |
| Escritórios novos por mês | 2 | 4 | 8 |
| Desconto médio da implantação | 30% | 20% | 10% |
| Cancelamento mensal | 2% | 1% | 0% |
| Escritórios com IA (C+IA) | 40% | 60% | 80% |
| Escritórios ativos no mês 12 | 20 | 42 | 88 |
| **Resultado do mês fica positivo** | Não em 12 meses (−R$ 0,4 mil no mês 12) | **Mês 6** | **Mês 3** |
| **Caixa acumulado fica positivo** | Não | **Mês 10** | **Mês 4** |
| Maior necessidade de caixa | **R$ 38,4 mil** (mês 12) | **R$ 14,2 mil** (mês 5) | R$ 3,3 mil (mês 2) |
| Caixa no mês 12 | −R$ 38,4 mil | **+R$ 20,4 mil** | +R$ 165,1 mil |
| Implantação nas entradas (3 primeiros meses / ano) | 73% / 35% | 74% / 34% | 74% / 34% |
| **Com plataforma inclusa (R$ 14,2 mil de fixos)**: caixa no mês 12 | −R$ 136,8 mil | −R$ 78,0 mil | +R$ 66,7 mil |

**Cenário base mês a mês** (R$ mil; saldo / acumulado): 1: −5,5 / −5,5; 2: −4,2 / −9,7; 3: −2,8 / −12,5; 4: −1,5 / −14,0; **5: −0,2 / −14,2**; 6: +1,1 / −13,1; 7: +2,4 / −10,7; 8: +3,7 / −7,0; 9: +5,0 / −2,0; **10: +6,2 / +4,2**; 11: +7,5 / +11,7; 12: +8,7 / +20,4.

**Leitura:** (1) a implantação é cerca de **três quartos das entradas dos 3 primeiros meses**; (2) **o ritmo de vendas manda**: com 2 novos por mês o caixa não fecha; (3) **a IA decide o ano**: com 60% de adesão fecha no mês 10; só com a base (S0, 4 por mês), a necessidade é de R$ 22 mil e o caixa do mês 12 fica em −R$ 14,6 mil; (4) **o rateio da plataforma pesa**: o Jurídico não se sustenta como produto único com estes volumes; (5) a carga de implantação é de **cerca de 78 horas por mês no cenário base** (meia pessoa), 39 no conservador e 155 no otimista (uma pessoa inteira). **Avisos:** os R$ 90 por hora, as horas por porte e a adesão à IA são estimativas (P28 segue aberta); sem a implantação cobrada, os números pioram.

---

## 7. Riscos fiscais e éticos de honorários

**Tudo abaixo é hipótese de desenho, [a confirmar] com advogado (ética) e contador (tributos).** A plataforma **não presta consultoria jurídica nem tributária**; ela aplica parâmetros definidos pelo escritório e mostra o aviso.

| Tema | Risco | Como o sistema se protege | Exige parecer? |
| --- | --- | --- | --- |
| **Publicidade e captação** | Provimento 205/2021 (J3, JUR-227): proibição de promessa de resultado, de valores e de captação indevida; CED **[a confirmar]** | Mensagens do CRM e da régua passam por checklist de vedações; **nenhum modelo promete êxito**; texto informativo, não promocional; honorário e êxito nunca em material de divulgação | **Sim** (advogado de ética) |
| **Tabela de honorários da OAB** | Valores abaixo da tabela seccional podem ser questionados no arbitramento e eticamente (aviltamento) (EAOAB, art. 22, § 2º) **[a confirmar]** | Referência da tabela e aviso na proposta; decisão do advogado | Sim, sobre o alcance |
| **Quota litis (êxito)** | Limites do CED, art. 50: em pecúnia, e a soma com a sucumbência não deve passar do que o cliente obtém **[a confirmar]** | Validação no contrato: soma de êxito e sucumbência contra o resultado; aviso quando passa | Sim |
| **Retenção contratual de valores do cliente** | Retenção sem cláusula é infração (CED, art. 48 §§ 2º e 3º; J3, JUR-212) **[a confirmar]** | Cartão bloqueia retenção sem cláusula; extrato ao cliente | Sim |
| **Prestação de contas e conta de terceiros** | Recusa de prestar contas e mistura de recursos (EAOAB, art. 34, XXI e outros) **[a confirmar]** | Conta do cliente, segregação, saldo nunca negativo, repasse com alerta | Sim |
| **Partilha entre sócios, associados e parceiros** | Contrato de sociedade ou associação, registro na seccional, titularidade da sucumbência (EAOAB, art. 24, § 3º-A, e a discussão no STF citada em J3) **[a confirmar]** | A regra vem do contrato do escritório; o sistema só aplica e registra | Sim |
| **Tributos sobre honorário** | **ISS** (alíquota ou fixo por sociedade uniprofissional, que depende do município e do regime) e **PIS, COFINS, CSLL e IRRF retidos na fonte** por empresa pagadora **[a confirmar com o contador]**; no Simples, o anexo da advocacia **[a confirmar]**; advogado autônomo: IRPF e carnê-leão **[a confirmar]** | Parâmetros por escritório; **nunca desconta sozinho** (queixa do Astrea, J8); retenção calculada pelo motor com tabela versionada | **Sim** (contador) |
| **Nota fiscal de êxito e sucumbência** | Se e quando emitir NFS-e sobre a sucumbência e o êxito pago por terceiro; advogado pessoa física emite recibo **[a confirmar]** | Política por escritório (nota, recibo, nenhuma) sem padrão pré-fixado; uma NFS-e por serviço como em 09, 5.5 | **Sim** |
| **Honorário e reembolso** | Reembolso entra ou não na base da nota e do ISS (09, 4.6) **[a confirmar]** | Padrão: recibo separado | Sim |
| **Prescrição da cobrança** | Prazo de cobrança de honorários (EAOAB, art. 25: cinco anos, termo conforme o caso) **[a confirmar]** | Alerta de prescrição de crédito nos recebíveis (J3, JUR-215) | Conferir termo |
| **Dados do cliente** | Sigilo, LGPD, valores e dados de família ou criminais; isolamento por Caso | Mesma política do pacote (JU-01 e JU-04); extrato só no app liberado | Parecer de sigilo (Síntese 7) |

**Perguntas para o contador (via contador da família) e para a advogada da família:** quatro de ética (cláusulas, quota litis, retenção, partilha) e quatro de tributo (ISS, retenções, nota de sucumbência, advogado pessoa física).

---

## 8. Ajustes pedidos, ordem de construção e perguntas para aval

### 8.1 Ajustes pedidos a cada documento

| Documento | Ajuste |
| --- | --- |
| **Fundações (01)** | (a) Novo **tipo de titular em custódia** ou campo `natureza = terceiro` em Lançamento e em Conta bancária (tipo `terceiros`), com exclusão de caixa, DRE e custo-hora; (b) entidades do pacote Jurídico registradas na lista de entidades do pacote (Honorário-Jurídico); (c) **sigilo por Caso** aplicado também ao financeiro do Caso; (d) evento `honorario.evento_gerador_confirmado` e `conta_terceiro.saida.bloqueada` |
| **09 Financeiro** | (a) `Contrato de honorários` com `caso_id` e cláusulas jurídicas; (b) `tipo_cobranca` aceita os tipos do Honorário-Jurídico; (c) **antecipar a Regra de remuneração e a Apuração** (FIN-008) para o Jurídico, que hoje está desligada até a fase 4; (d) fluxo de caixa com a linha de recebíveis condicionados e cenários; (e) Recebimento de **alvará**; (f) migração com conectores de Astrea, ADVBOX, EasyJur, Projuris e SGJur; (g) NFS-e: política por natureza (êxito, sucumbência) **[a confirmar]** |
| **05 Timesheet** | (a) `Caso` como âncora; (b) **valor-hora de cobrança** distinto do custo-hora; (c) pré-fatura por hora, retainer com franquia, teto e orçamento de horas; (d) chips **Pacote: Jurídico** e **Área do direito** na Rentabilidade e na Equipe |
| **07 Motores** | Funções do motor Cálculo: `calculo.honorario_exito`, `calculo.sucumbencia`, `calculo.partilha`, `calculo.retencao_alvara`, `calculo.liquido_repasse` e o aviso de piso pela tabela da seccional; tabelas versionadas com fonte |
| **Estudo de Precificação** | (a) **Tabela de preços por pacote de área** para os módulos da plataforma; (b) **componente de processo** e faixa; (c) **piso por pacote**; (d) utilização de IA por pacote; (e) **fixos do pacote**; (f) atalhos Jurídico Essencial, Integrado e Completo; (g) módulos de base de leis com custo de curadoria e equilíbrio; (h) escritórios-tipo jurídicos e implantação (6.1) |
| **JU-01 (dados)** | Campos do Caso (área do direito, valor da causa, proveito econômico, orçamento de horas), do Processo (fase, decisões) e do Honorário-Jurídico (2.3) |
| **JU-02 (painel)** | Painéis "Recebíveis condicionados", "Valores em juízo", "Conta do cliente" e "Rentabilidade por Caso e área" |
| **JU-03 (prazos e conectores)** | Detecção do **evento gerador** pelo Andamento e pela Comunicação; custo do monitoramento (Judit R$ 1,50 por processo) e do coletor do DJEN no Brasil; **saúde da captura** como alerta; regra "listar nunca dá ciência" |
| **JU-04 (motor e base de leis)** | Custo de curadoria por módulo (R$ 1.500 na v1; R$ 4.000 com jurisprudência); módulos e pacotes de J9; **a revisão por especialista fica para o lançamento** (decisão (e)) |

### 8.2 Ordem de construção (só planejamento)

Construir **depois do BPO** (decisão (d)). Dependências: Financeiro 09 na fase 3a (cobrança e baixa), Timesheet e Andamento (JU-03).

| Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- |
| **F0** | Contrato de honorários com `caso_id`; Honorário-Jurídico por **fixo, ato, hora e parcelado**; pré-fatura por hora; reembolso | 09 fase 3a; JU-01 | Advogada da família lê a minuta |
| **F1** | **Êxito e sucumbência** com evento gerador, base de cálculo e recebíveis condicionados | F0; Andamento (JU-03) | Parecer de ética (7) |
| **F2** | **Partilha, repasse, retenção e destaque** | F1; Regra de remuneração do 09 | Parecer fiscal e ético |
| **F3** | **Conta do cliente, conta de terceiros e valores em juízo**; conciliação | F1; Conta bancária do 09; Open Finance | Parecer de ética (prestação de contas) |
| **F4** | **Rentabilidade por Caso e área** e projeção com êxito provável | F0 a F3; Timesheet | Piloto |
| **F5** | **Configurador do Jurídico**, calculadora e piloto de preço com 10 a 20 escritórios | Estudo; JU-03 e JU-04 | Medir uso, custo de captura e IA |

### 8.3 Perguntas para aval

Hipótese e frase simples (o usuário não é advogado nem financista).

| | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| a | Os módulos da plataforma (CRM, Financeiro, App, Timesheet) podem ter **preço próprio por pacote**? | Sim, para o Jurídico, porque as bases do Contábil o jogariam acima do mercado | "O CRM e o Financeiro podem custar menos no Jurídico do que no Contábil, para o preço do pequeno caber no mercado?" |
| b | O **piso do pacote Jurídico** é R$ 250? | Sim, no lugar dos R$ 700 do Contábil | "O mínimo mensal do Jurídico pode ser bem menor que o do Contábil?" |
| c | A **captura de publicações** vem pré-marcada nos atalhos? | Sim, como complemento a R$ 15 por advogado | "Vem incluída por padrão, e o cliente pode tirar?" |
| d | O **monitoramento por agregador** é cobrado por processo, a custo mais 20%? | Sim, no lugar de uma franquia embutida; o custo da Judit (R$ 1,50) seria absorvido pelo preço | "Cobramos à parte o acompanhamento de cada processo no tribunal, pelo custo mais 20%?" |
| e | A **conta de terceiros** é só registro, sem a plataforma segurar dinheiro, e com saldo nunca negativo? | Sim | "Só anotamos e conferimos o dinheiro do cliente que está na conta do escritório, e nunca mexemos nele?" |
| f | O advogado vê o **valor-hora de cobrança** dele? | Sim, ele e o Gestor; o custo-hora do escritório continua só do Administrador | "O advogado pode ver quanto ele cobra por hora, mas não quanto o escritório gasta por hora?" |
| g | O **êxito entra na projeção de caixa** só por probabilidade definida por uma pessoa? | Sim, em três cenários | "O dinheiro de êxito só entra na previsão se o advogado disser a chance e a data?" |
| h | Quem confere **tributos e ética** dos honorários? | O contador da família confere tributos; a advogada da família, a ética; parecer pago antes de vender | "O contador da família olha os impostos e a advogada, as regras da OAB, antes de lançar?" |
| i | A **implantação do solo** é gratuita em autoatendimento? | Sim; assistida custa R$ 900 na tabela (piso R$ 540) | "O solo configura sozinho de graça, e paga só se quiser ajuda?" |
| j | Aceita a premissa de **fixos de R$ 6 mil** do pacote (e plataforma já paga pelo Contábil)? | Sim, até medir | "Contamos R$ 6 mil por mês só do Jurídico e deixamos a plataforma para o Contábil pagar?" |
| k | O **prêmio sobre o mercado** (5 usuários a R$ 623 contra R$ 500) é aceitável com o atalho Essencial a R$ 395? | Sim, com as cinco justificativas de 5.7 | "Aceitamos cobrar um pouco mais que o mercado se mostrarmos o que o concorrente não tem?" |

**Ressalvas das fontes.** Não li as normas oficiais (EAOAB, CED, CPC, provimentos); os artigos aqui citados vêm de J3 e de memória de desenho e **estão a confirmar**. Preços de mercado vêm de páginas de fabricantes (J1, J7, J8); o SGJur tem evidência fraca (J7); as tabelas de Judit, Escavador e Jusbrasil, o mínimo de faixa e os custos de captura própria estão **[a confirmar]**; as premissas de uso, de horas, de 1,6 processo por cliente e de adesão à IA **não foram medidas**.

## Decisões do usuário (9/11/2026)

Resposta: **segue a hipótese em todas as perguntas** (tabela de perguntas para aval acima). Ficam aprovadas como escritas.

- **a a k aprovadas.** Preço próprio por pacote para CRM, Financeiro, App e Timesheet; piso do Jurídico em **R$ 250**; captura de publicações pré-marcada a R$ 15 por inscrição; monitoramento por agregador por processo a custo mais 20%; conta de terceiros só como registro, saldo nunca negativo; advogado e Gestor veem o valor-hora de cobrança; êxito na projeção de caixa só por probabilidade definida por pessoa, em três cenários; contador da família confere tributos e a advogada da família a ética, com parecer pago antes de vender; implantação do solo gratuita em autoatendimento (assistida R$ 900 na tabela, piso R$ 540); fixos do pacote em R$ 6 mil por mês até medir; prêmio sobre o mercado aceito com o atalho Essencial a R$ 395. **Premissas de uso, de horas, de 1,6 processo por cliente e de adesão à IA seguem sem medição.**

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

## Adendo (9/11/2026): correções feitas pelo JU-12

O [JU-12](JU-12-Estudo-de-Precificacao-Juridico.md) refez as contas da seção 5: margem após fixos do Pequeno Essencial −7,8% (não 5,6%); equilíbrio do Integrado em 20 escritórios pequenos (não 19); custo da franquia de 15 GB por usuário incluído; CRM e App por cliente abaixo do custo provável. **Em conflito, vale o JU-12.** A calculadora e `parametros.json` seguem sem mudança; a proposta de parâmetros está em `docs/precificacao/parametros-juridico.json`.
