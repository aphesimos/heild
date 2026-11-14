# Subplano 09 · Financeiro do escritório

**Versão 0.1 · 7/11/2026 · documento de desenho funcional, anterior ao design visual e à escolha de stack.**

Detalha o item lateral **Financeiro** (decisão 2.0 do [Painel](03-Painel.md)) e a aba 4.8 do [Plano da Plataforma](../Plano_Plataforma_do_Escritorio.md). Usa as entidades e ferramentas das [Fundações](01-Fundacoes.md), o integrante do [Time de agentes](02-Time-de-Agentes.md), a régua do [CRM](04-CRM.md), a Rentabilidade do [Timesheet](05-Timesheet.md), a tela do cliente no [App](06-App-do-Cliente.md) e os conectores de cobrança, NFS-e e banco do [08](08-Conectores.md). Pesquisa de base: [B1](../../pesquisa/plataforma/B1-financeiro-escritorio.md) (fichas FIN), [B2](../../pesquisa/plataforma/B2-concorrentes-gestao.md) e [B6](../../pesquisa/plataforma/B6-cores-e-ferramentas.md).

Convenções:

- IDs (FIN-001, GES-001) são os do [atividades.json](../../pesquisa/plataforma/atividades.json). O módulo cobre as 20 atividades do setor `financeiro_escritorio` e as GES de honorário (GES-001 a 015, 046, 055, 103, 109), que o mapa guarda em Gestão.
- Ferramenta entre crases é a do catálogo (Fundações 6.5, 08 7) ou pedida na seção 13.
- Autonomia como no mapa: **S** (agente faz sozinho), **P** (prepara, pessoa conclui), **O** (organiza e lembra).
- `[a confirmar]` marca o que a pesquisa não fechou.

---

## 1. Escopo e princípios

### 1.1 O que o módulo entrega

1. Contratos de honorários estruturados: itens, faixas, reajuste, 13º, aditivos.
2. Faturamento mensal em lote, serviços avulsos e reembolso de despesas adiantadas.
3. Cobrança por boleto, Pix e Pix Automático, pela conta do escritório; régua; baixa automática.
4. NFS-e dos honorários pelo Emissor Nacional.
5. Contas a pagar com aprovação por alçada e conciliação bancária.
6. Fluxo de caixa, previsão de 12 meses, DRE por setor e orçamento.
7. Ligação com a operação: horas do timesheet, tarefas, CRM e app do cliente.
8. Migração do financeiro atual (Conexa, Omie, Conta Azul, Nibo, Domínio).

Não entrega: conta bancária ou intermediação de dinheiro; escrituração contábil do próprio escritório (GES-061); ERP financeiro para os clientes do escritório (BPO financeiro, FIN-201, é a fase 3c, depois da 3b; subplano 10).

### 1.2 "Similar ao Conexa" e onde nos diferenciamos

O Conexa cobre contratos, avulsos, reajuste por regra, 13º, régua com WhatsApp, NFS-e, contas a pagar, DRE, centro de custo, MRR e churn, e já tem servidor MCP (B1, achado 1). Igualamos o conjunto. Não competimos em "conversar com o financeiro": o diferencial está no que o Conexa não vê.

| O que o Conexa faz | O que fazemos a mais por estar ligados à operação |
| --- | --- |
| Contrato com valor fixo e reajuste | Honorário por contrato **comparado às horas reais** do timesheet, por cliente; reajuste sugerido para o deficitário (GES-013, GES-014) |
| Régua de cobrança | Régua do CRM no fio certo, com o status visível ao cliente no app, botão "pago" e suspensão **parcial** ligada às tarefas e ao app (FIN-009) |
| Cliente fora da faixa: o escritório descobre quando lembra | Faixa contratada medida todo mês pelas notas, pelos empregados e pela receita que a plataforma já tem (GES-015) |
| Serviço avulso lançado à mão | Pedido do app ou tarefa fora do escopo vira proposta de avulso, com o aceite guardado como prova (GES-002, GES-036) |
| DRE com rateio por percentual digitado | DRE por setor com custo pelas horas medidas (FIN-006) |
| Boleto e nota | Integrante do Financeiro que prepara o lote, confere contra o contrato e pede um "ok" em cartão |

### 1.3 Princípios

| # | Princípio | Consequência |
| --- | --- | --- |
| R1 | A conta de cobrança, o banco e o e-CNPJ são do escritório | A plataforma integra por token e certificado no cofre; não toca o dinheiro (08 P8) |
| R2 | Tudo é ferramenta, todo efeito gera evento | Cada botão e cada ação do integrante usa o catálogo; nada de edição silenciosa |
| R3 | Nada se apaga | Cancelar com motivo, estornar, substituir; mês financeiro fechado muda só por lançamento de ajuste |
| R4 | Abrir cobrança e emitir nota são irreversíveis | Cartão de aprovação até a promoção (02, 3.3); cancelar, pagar conta e suspender cliente têm cartão sempre |
| R5 | O valor nasce do contrato | Cobrança diferente do contrato é exceção marcada e justificada |
| R6 | Cobrança nunca condiciona entrega | Régua e suspensão não retêm documento nem obrigação em curso (NBC PG 01, item 4(l)) `[a confirmar]` |
| R7 | Dois regimes, sem mistura | Caixa (fluxo, conciliação) por data de pagamento; competência (DRE, rentabilidade) por mês de serviço |
| R8 | Dado financeiro é restrito | Colaborador não vê honorário, margem nem custo-hora (05, 8.4) |
| R9 | Marca branca e dados por escritório | PDF, mensagem e recibo usam o tema; no modo BPO, cada subinquilino tem o próprio financeiro |

---

## 2. Mapa do Conexa e dos concorrentes

Fontes: B1 (preços e páginas lidos em 06/11/2026), B2 e B6. "Não encontrado" quer dizer que a pesquisa não achou, não que não exista.

| Capacidade | Conexa | Outros ERPs e cores | Nosso módulo |
| --- | --- | --- | --- |
| Contratos com minuta e assinatura | Contrato personalizado ou plano, assinatura eletrônica | Omie: vigência por item; Domínio e Makro: cadastro de honorários | Contrato estruturado (fase 0, FIN-001); minuta pelo CRM; ciência simples na v1, assinatura avançada depois |
| Serviços avulsos | Sim | Makro: cobranças adicionais; Asaas e iugu: itens avulsos | Fase 3 (GES-002) |
| Reajuste por regra | Sim | Não encontrado | Fase 3 (GES-014, SOC-018) |
| 13º honorário | Único que anuncia | Não encontrado | Fase 3 (GES-009, FIN-016) |
| Faixa contratada medida | Não encontrado | Alterdata estima honorário "ideal" | Fase 3 (GES-015) |
| Despesas reembolsáveis | Não encontrado | Omie e Nibo Premium | Fase 3 (FIN-002) |
| Régua de cobrança | Com WhatsApp | Asaas e Omie Bank | Régua do CRM (04, 7.2), fase 3 |
| NFS-e | Antes ou depois da liquidação | Omie, Nibo, Asaas (R$ 0,49) | Emissor Nacional, gratuito (fase 3) |
| Boleto, Pix, Pix Automático | Convênio do escritório ou parceiros | Asaas, Granatum, Domínio Conta PJ | Banco do escritório (convênio dele: API Pix, boleto por API ou CNAB); Asaas e Efí como alternativa; agregador como segundo caminho (08 7.4 e 13.7), fase 3 |
| Contas a pagar | Sim | Omie Bank (DDA, aprovação); Nibo Premium (CNAB) | Fase 3 (FIN-003) |
| Conciliação | Automática dos recebimentos | Nibo, Omie Bank, Granatum | Fase 3a: webhook do banco ou provedor e OFX; Open Finance na 3b, cobrado à parte (FIN-004) |
| Fluxo de caixa e previsão | Sim | Granatum; genéricos | Fase 3, com contratos, distratos e funil (FIN-005) |
| MRR, churn, CAC, LTV | Sim | Não encontrado | MRR, churn, inadimplência na fase 3 (GES-011); CAC e LTV na fase 4 (funil do CRM) |
| DRE e centro de custo | Rateio | Nibo Plus; Onvio Custos; Makro | Por setor com horas medidas (FIN-006) |
| Orçamento | Não encontrado | Granatum; Nibo Premium | Fase 4 (FIN-007) |
| Comissão e PLR | Não encontrado | Não encontrado | Fase 4 (FIN-008) |
| Resultado dos sócios | Não encontrado | Não encontrado | Fase 4 (FIN-012) |
| Rentabilidade por horas medidas | Não encontrado | Onvio Custos usa o módulo Honorários | Fase 3, com Timesheet (05, 8.4) |
| Suspensão ligada à operação | Não encontrado | Não encontrado | Fase 3 (FIN-009) |
| Migração assistida | API | Asaas: importação grátis | Fase 3 (FIN-014, 601 a 604) |
| MCP | Sim | Nibo, Acessórias | Ferramentas `exposta_mcp` (Fundações 6.3) |

### 2.1 O que não vamos fazer

| Não faremos | Por quê |
| --- | --- |
| Ser banco ou repassar dinheiro | Conta é do escritório (R1) |
| Negativar, protestar ou cobrar em juízo sozinhos | GES-006 é decisão do sócio (D-humano); a plataforma só registra e prepara |
| Cartão de crédito recorrente | Boleto, Pix e Pix Automático cobrem; entra se o provedor oferecer e o escritório pedir |
| NFS-e municipal fora do padrão nacional pelo conector próprio | Integrador (Focus, R$ 94,90/mês) ou Asaas (R$ 0,49 por nota) como alternativa (08 7.5) |
| Substituir o ERP financeiro do cliente | Não: o BPO financeiro (FIN-201, fase 3c; subplano 10) trabalha no ERP que o cliente já usa |

---

## 3. Modelo de dados

### 3.1 Entidades

Todas por escritório (e subinquilino), com `id`, `criado_em`, `criado_por` e evento de criação. Quando a coluna "Estados" traz transições, cada uma é ferramenta própria.

| Entidade | Campos principais | Estados | Regras |
| --- | --- | --- | --- |
| **Contrato de honorários** (assinatura) | `cliente_id`, `numero`, `vigente_de`, `vigente_ate`, `documento_contrato_id`, `lead_id` de origem, `dia_vencimento`, `meio_pagamento`, `conexao_cobranca_id`, `politica_reajuste`, `politica_13o`, `pro_rata_inicio`, `cobranca_consolidada_em` (grupo) | rascunho, aguardando_assinatura, ativo, suspenso, encerrado, cancelado | Um ativo por cliente por vez; mudança é **aditivo**, não edição; `encerrado` exige data e motivo |
| **Item do contrato** | `contrato_id`, `servico` (fiscal, contabil, dp, societario, consultoria, bpo_financeiro, emissao_nfse), `setor_id` (aloca a receita), `valor`, `tipo_cobranca` (fixo, por_faixa, por_unidade), `metrica` e `faixas` `{ate, valor, excedente_unidade}`, `vigente_de`, `vigente_ate`, `desconto` `{valor ou %, vigência, motivo, aprovado_por}`, `atividades_cobertas` | vigente, futuro, encerrado | Item tem vigência própria; mudar valor fecha o item e abre outro; o que não está coberto é "fora de escopo" |
| **Aditivo** | `contrato_id`, `tipo` (reajuste, escopo, faixa, desconto, vencimento, rescisão), `documento_id`, `vigente_de`, `comunicado_em` | proposto, comunicado, aceito, vigente, recusado | Reajuste exige aviso com a antecedência da política; aceito por assinatura, ciência simples ou mensagem guardada (GES-036) |
| **Tabela de avulsos** | `atividade_id`, `nome`, `valor_padrao`, `unidade` (ocorrência, hora, por empregado), `exige_aceite` | ativa, inativa | Preço do escritório por atividade do catálogo (GES-002) |
| **Serviço avulso** | `cliente_id`, `atividade_id`, `descricao`, `valor`, `origem` (tarefa, pedido do app, conversa, manual), `tarefa_id`, `aceite_ref` | proposto, aceito, a_faturar, faturado, cancelado | Só fatura com aceite; sem aceite, vira cartão para o Gestor |
| **Despesa adiantada** (FIN-002) | `cliente_id`, `tarefa_id` ou processo, `tipo`, `valor`, `pago_em`, `comprovante_documento_id`, `conta_id` | registrada, conferida, na_fatura, reembolsada, perdoada, cancelada | Cada despesa vira **cobrança avulsa** ligada ao cliente; ao faturar, é combinada ao honorário na mesma fatura ou sai à parte (4.6); perdoar exige motivo e alçada |
| **Lote de faturamento** | `competencia`, `cobrancas`, `excecoes`, `total`, `cartao_id` | preparado, aprovado, emitido, parcial | Um por competência e provedor; "parcial" lista o que não saiu e por quê |
| **Cobrança** | `cliente_id`, `competencia`, `origem` (lote, avulsa, 13º, reembolso, acordo), `linhas` (item, avulso, reembolso, 13º, desconto, juros, multa), `valor`, `vencimento`, `meio`, `conexao_cobranca_id`, `id_externo`, `nfse_id`, `regua_id`, `regua_pausada_ate` | rascunho, aguardando_aprovacao, emitida, paga_parcial, paga, em_acordo, cancelada, substituida, baixada_perda | "Vencida" é derivada (emitida com vencimento passado), nunca gravada; cancelar e substituir exigem motivo |
| **Parcela** | `cobranca_id`, `numero`, `vencimento`, `valor`, `linha_digitavel`, `pix_copia_cola`, `id_externo` | aberta, aguardando_confirmacao, paga, cancelada | Cobrança simples tem uma parcela; acordo e 13º em duas vezes têm várias |
| **Recebimento** | `parcela_id`, `valor`, `pago_em`, `credito_em`, `meio`, `tarifa`, `origem` (webhook, conciliação, manual, informado_pelo_cliente), `lancamento_id` | informado, confirmado, estornado, nao_localizado | "Informado" (botão "pago") não baixa a parcela; só pausa a régua |
| **Nota de serviço do escritório** | `cobranca_id`, `numero`, `chave`, `competencia`, `valor`, `retencoes` (IRRF, CSRF, ISS), `documento_id`, `substitui_id`, `motivo` | rascunho, emitida, rejeitada, cancelada, substituida | Via conector `nfse_nacional`; nota cancelada sai do contas a receber (FIN-011) |
| **Conta bancária** | `tipo` (corrente, conta_cobranca, cartao, caixa), `banco`, `conta_mascarada`, `conexao_id` (08), `saldo_inicial`, `ativa` | ativa, inativa, consentimento_vencido | Credencial no cofre; nunca em contexto de modelo |
| **Lançamento** | `conta_id`, `data`, `valor` (com sinal), `descricao_extrato`, `hash_dedupe`, `origem` (open_finance, ofx, provedor, manual), `categoria_id`, `centro_custo_id`, `vinculo` (pagamento, conta a pagar, par de transferência), `regra_id` | nao_conciliado, sugerido, conciliado, transferencia, ignorado | Imutável; correção é lançamento de ajuste |
| **Conta a pagar** (FIN-003) | `fornecedor_id` (Pessoa `terceiro`), `valor`, `vencimento`, `competencia`, `origem` (dda, email, manual, recorrente), `documento_id`, `categoria_id`, `rateio`, `codigo_barras`, `aprovador_id`, `comprovante_id` | capturada, classificada, aguardando_aprovacao, aprovada, agendada, paga, contestada, cancelada | Duplicidade por hash de código de barras e valor; paga só com aprovação por alçada |
| **Centro de custo** | `nome`, `tipo` (setor, estrutura, comercial, carteira_de_socio), `setor_codigo`, `pai_id` | ativo, inativo | Os setores fixos entram prontos; "Estrutura" recebe aluguel e sistemas |
| **Plano de contas gerencial** | `codigo`, `nome`, `natureza` (receita, deducao, custo, despesa, financeiro, tributo, distribuicao), `entra_no_custo_hora`, `pai_id` | ativa, inativa | Modelo padrão de escritório contábil carregado na abertura; o Administrador edita |
| **Regra de categorização** | `padrao` (fornecedor, texto, valor), `categoria_id`, `centro_custo_id`, `rateio`, `aprovada_por` | proposta, ativa, pausada | Aprendida pelo integrante; só vale depois de aprovada |
| **Orçamento** (montado na v1, desligado; liga na fase 4) | `ano`, `versao`, linhas categoria × centro × mês, `premissas` | rascunho, aprovado, revisado | Compara orçado × realizado todo mês |
| **Fechamento financeiro** | `competencia`, `fechado_por`, `fechado_em`, `custo_hora_id` | aberto, fechado, reaberto | Fechado bloqueia lançamento retroativo; reabrir exige motivo e Administrador |
| **Política financeira** | juros e multa, alçadas, dias da régua, dias do aviso formal e da pausa, prazo do "pago", provedores | vigente por versão | Uma versão vigente; mudança gera evento com diff |

Comissões, PLR e distribuição aos sócios (montados na v1, desligados; ligam na fase 4) entram como **Regra de remuneração** e **Apuração** com memória de cálculo; o desenho está na seção 7.4.

### 3.2 Relação com Cliente, Tarefa e Documento

| Com | Regra |
| --- | --- |
| **Cliente** | Todo contrato, cobrança e avulso tem `cliente_id`. Cliente em `aceito` abre contrato em rascunho (GES-103). Em `em_saida`, abre FIN-016 e GES-046. **`cliente.mudar_estado` para `encerrado` é bloqueado** com contrato ativo ou parcela aberta. Fusão religa por tabela, como nas Fundações 4.2. Grupo econômico pode ter cobrança consolidada no `cliente_principal`, opcional |
| **Perfil versionado** | O campo `honorario` (Fundações 4.2) deixa de ser fonte; vira resumo derivado do contrato ativo, só leitura |
| **Tarefa** | As atividades FIN geram tarefas do setor `financeiro_escritorio`, com `cliente_id` nulo quando internas ("Faturar 11/2026"). Avulso aponta a `tarefa_id` operacional que o originou. Parcela vencida acima do limite abre tarefa para o Gestor |
| **Documento** | Contrato assinado, fatura, boleto, comprovante e NFS-e entram no índice com `setor_id = financeiro_escritorio`. Os do cliente ficam na pasta visível `Entregáveis/Financeiro`, com área `financeiro` do papel do cliente. Contas a pagar ficam em `_escritorio/<ano>/financeiro/`, sem cliente |

### 3.3 Nada se apaga

Não existe "excluir". Cobrança errada é cancelada com motivo ou substituída; pagamento errado é estornado; lançamento errado recebe ajuste; item de contrato é fechado, não editado; mês fechado só abre por Administrador, com motivo. Toda mudança tem evento, e a cadeia de hashes das Fundações 5.2 vale para o dinheiro.

---

## 4. Contratos e faturamento

### 4.1 Ciclo do contrato

```
proposta do CRM ─► minuta ─► assinatura ─► ativo ─► reajuste ─► suspenso ─► encerrado
   (lead aceito)   (prepara)  (ciência ou    │     (aditivo)   (FIN-009)   (FIN-016,
                              avançada)      └─ aditivos de escopo e faixa   GES-046)
```

| Etapa | O que acontece | Ferramenta e nível |
| --- | --- | --- |
| Proposta | Lead aceito (`lead.fechar_contrato`, GES-401) traz serviços e valor; o contrato nasce em rascunho com os itens da proposta | `contrato.criar` (rascunhar) |
| Minuta | Modelo do escritório com cláusulas mínimas (SOC-016, SOC-019); o integrante preenche, a pessoa revisa | `contrato.rascunhar_minuta` (rascunhar) |
| Assinatura | Ciência simples na plataforma (v1) ou provedor avançado (08 7.6); o PDF assinado entra no índice | `contrato.enviar_assinatura` (executar, irreversível, cartão) |
| Ativo | Itens passam a valer; abre implantação e a primeira cobrança (GES-103) | `contrato.ativar` (executar) |
| Aditivo | Reajuste, escopo, faixa, desconto, vencimento | `contrato.aditar` (executar, cartão) |
| Suspenso | Pausa parcial por inadimplência; faturamento segue, o escopo se reduz (5.6) | `suspensao.aplicar` |
| Encerrado | Data de fim, 13º proporcional, saldo e aviso prévio; cobranças recorrentes terminam | `contrato.encerrar` (executar, cartão) |

FIN-001 mede a paridade: `contrato.conferir_cobranca(competencia)` compara o contrato assinado, o cadastro e o lote antes de emitir. Divergência abre tarefa.

### 4.2 Itens, faixas e descontos

Cada item cobra por uma regra.

| Tipo | Como calcula | Exemplo |
| --- | --- | --- |
| Fixo | Valor mensal | Fiscal do Simples: R$ 600 |
| Por faixa | Degrau pela métrica medida no mês | Receita até R$ 100 mil: R$ 800; até R$ 300 mil: R$ 1.200 |
| Por unidade | Base mais excedente | DP: R$ 150 por empregado acima de 5 |

Métricas que a plataforma já tem: **faturamento** (notas capturadas e receita segregada, FIS-010), **empregados** (quadro do DP, DP-056), **notas** (volume capturado no mês, NFE-004), **estabelecimentos** e **regime** (perfil versionado). GES-015 mede todo mês a métrica contra a faixa. Estourou, o integrante propõe uma de duas saídas: cobrar o excedente pela cláusula (cartão) ou propor aditivo de faixa pelo CRM. Nunca altera sozinho.

Descontos têm vigência, motivo e aprovador. Acima do percentual da política, só o Administrador aprova. Desconto de pontualidade não existe na v1.

### 4.3 Reajuste por regra

| Elemento | Definição |
| --- | --- |
| Regra | Índice (IPCA, INPC, IGP-M, fonte SGS do Banco Central), percentual fixo ou negociado; data-base; antecedência de aviso; piso e teto |
| Cálculo | `calculo.reajuste_honorario` (motor Cálculo, tabela de índice versionada por vigência, ver 07 e seção 13) |
| Gatilho | Evento `reajuste.vencer_em_60_dias` acorda o integrante do Financeiro |
| Saída | Simulação por cliente em três segmentos (GES-014): índice cheio, acima do índice (cliente deficitário na Rentabilidade) e renegociação |
| Aplicação | Aditivo com comunicado pelo CRM; item novo vigente da data-base; nunca retroativo |

Reajuste é **sempre cartão** e sempre com aviso ao cliente no prazo do contrato. SOC-018 trata o lado do contrato; este módulo trata o lado do valor.

### 4.4 13º honorário e regra proporcional

`politica_13o` define: nenhum, parcela única em dezembro, duas parcelas (novembro e dezembro) ou diluído em doze meses. A base é o honorário vigente em dezembro ou a média dos doze meses. GES-009 emite as cobranças anuais; FIN-016 (S) trata a saída no meio do ano: `calculo.proporcional_13o(cliente, data_rescisao)` lê a cláusula e calcula os avos. O padrão do modelo conta fração de 15 dias ou mais como mês `[a confirmar com os contadores]`. O valor entra na última cobrança junto com o termo de distrato (GES-046). Com 13º diluído, não há proporcional.

### 4.5 Faturamento mensal em lote

Job mensal do integrante (GES-001), dia configurável.

1. `faturamento.preparar_lote(competencia)` reúne, por cliente ativo: itens vigentes, avulsos `a_faturar`, reembolsos conferidos, excedentes de faixa e 13º.
2. Confere contra o contrato (FIN-001) e contra o mês anterior. Variação acima do limite vira exceção.
3. Separa as **exceções**: sem contrato, sem meio de pagamento, sem contato com assunto `cobranca`, cliente suspenso, valor diferente do contrato.
4. Gera cobranças em rascunho e o cartão em lote ("142 cobranças de 11/2026, R$ 118.400; 6 de fora"). **Cliente com mais de um serviço (contabilidade e BPO): uma fatura e uma cobrança por mês** (um boleto ou Pix, lançamento conjunto), com os **serviços em linhas separadas** (decisão de 8/11/2026; 10, 7.3).
5. Aprovado, emite por provedor (seção 5) e as NFS-e, conforme a política: com a cobrança ou após a liquidação. **As notas saem por serviço**, porque cada serviço respeita a própria tributação (5.5).

### 4.6 Reembolso de despesas adiantadas (FIN-002)

O escritório paga a taxa da Junta ou o cartório. O integrante lê o comprovante (OCR), acha o cliente e o processo, registra a despesa e a mantém `conferida`. Fica salva como **cobrança avulsa** do cliente; ao faturar, o Financeiro a **combina com o honorário** na mesma fatura ou fatura à parte, com pré-visualização das linhas, recibo e comprovante anexo. `listar_reembolsos_pendentes` mede o que ficou sem cobrar. Se o reembolso integra a base da NFS-e e do ISS depende do município `[a confirmar]`; a política (nota ou recibo separado) é configurável por escritório e por município; até o contador decidir, o padrão é recibo separado, fora da nota.

### 4.7 Serviço avulso e "fora de escopo"

O contrato lista `atividades_cobertas`. Quando nasce uma tarefa de atividade **não coberta** (por pedido do app, conversa ou criação manual), o integrante consulta a tabela de avulsos e propõe o serviço (GES-002) com cartão ao responsável: "Alteração contratual da Empresa X, R$ 450. Enviar a proposta?". O cliente aceita no app ou por mensagem; o aceite é guardado como prova (GES-036) e liga o avulso à tarefa. Sem aceite, o avulso não fatura. A tarefa pode começar antes, mas o painel mostra "sem aceite". Avulsos entram no lote do mês, ou saem numa cobrança própria se o contrato assim previr.

---

## 5. Cobrança e recebimento

### 5.1 Emissão

A abstração `cobranca.*` do 08 (7.4) cria boleto, Pix ou Pix Automático na conta do escritório. **Como no Conexa, a conexão é direta com o banco onde o escritório tem convênio de cobrança** (API Pix padronizada do Banco Central, API de boleto do banco ou CNAB onde não houver); Asaas e Efí ficam como a opção para o escritório sem convênio (08, 13.7). A tela de Configurações do Financeiro tem a escolha do banco, a conexão e a situação do convênio. `cobranca.criar` é **executar, irreversível**: cartão até a promoção. O lote usa `aprovacao.decidir_lote`. Pix Automático exige autorização do pagador, que o cliente pode cancelar (FIN-010); o convite vai pelo app e pela conversa. Juros e multa vêm da política financeira.

### 5.2 Régua de cobrança de honorários

Entidade Régua do CRM (04, 7.2), `conversa.cobrar_pendencias`, no fio da pessoa com o assunto `cobranca` (Fundações, adendo 15).

| Etapa | Mensagem | Quem age |
| --- | --- | --- |
| D-5 | Fatura com link, boleto e Pix | Integrante, sozinho, por modelo do tema |
| D0 | "Vence hoje" | Integrante, sozinho |
| D+3 | "Consta em aberto" | Integrante, sozinho |
| D+10 | Tom firme, ao financeiro e ao sócio do cliente | Cartão de pré-visualização ao Gestor |
| D+20 | Aviso ao Gestor e etiqueta "cliente atrasa" | Notificação `alta` |
| D+30 | **Aviso formal** com prazo de regularização (FIN-009, fase 3b) | Cartão ao Administrador |
| D+45 | Pausa parcial (5.6) | Cartão ao Administrador |

Os dias são da política, gerais do escritório e ajustáveis por cliente. As três primeiras etapas rodam sozinhas depois que o Administrador aprova a régua inteira, uma vez. Cobrança não sai pelo número de um setor operacional: sai pelo número de Gestão e Atendimento ou por e-mail.

### 5.3 Botão "pago" e baixa automática

O cliente vê a fatura no app (06, 3.8) e toca em "pago" (decisão do 06, P5). O evento `cobranca.pagamento.informado` cria um Recebimento `informado`, põe a parcela em `aguardando_confirmacao` e **pausa a régua** por `prazo_pago_dias` (padrão 3 dias úteis). Quem confirma:

| Fonte | Efeito |
| --- | --- |
| Webhook do provedor (`recebimento.receber`) | Baixa automática (GES-003), recibo ao cliente, régua encerrada |
| Extrato (OFX ou Open Finance) | A conciliação (seção 6) casa o crédito com a parcela |
| Nenhuma, e o prazo venceu | Sem fonte confiável, abre tarefa "confirmar pagamento de X" para pessoa; a régua só volta com a decisão dela |
| Fonte mostra que não pagou | A régua retoma sozinha e o cliente recebe o aviso "não localizamos seu pagamento" |

`recebimento.baixar` é reversível por estorno, por isso o integrante baixa sozinho (S). Recebimento sem cobrança correspondente vai para a conciliação.

### 5.4 Autoatendimento: 2ª via e histórico (FIN-010)

No app e no WhatsApp, o cliente pede a 2ª via com juros e multa atualizados, vê o histórico de faturas e de NFS-e, o status do Pix Automático e o informe anual de pagamentos e retenções (GES-008). O integrante responde sozinho (S). Contestação vira tarefa do Financeiro; se há cobrança ou nota errada, a atividade é FIN-011.

### 5.5 NFS-e dos honorários (GES-007, FIN-011)

Desde a competência 11/2026, ME e EPP do Simples emitem pelo Emissor Nacional (B1, achado 4). O conector `nfse_nacional` emite por DPS com o e-CNPJ do escritório (cofre), uma nota por honorário, com retenções de IRRF e CSRF `[a confirmar]` e os campos de IBS/CBS (sem rejeição técnica em 2026). **Fatura com mais de um serviço (decisão de 8/11/2026):** a cobrança é uma só, mas a nota é **por serviço**. **O layout da NFS-e é o nacional, o mesmo em toda a federação** (informação do usuário, 8/11/2026), e é ele que decide como a nota é montada, não o município. **Não está confirmado** que uma DPS aceite mais de um serviço (a NT 007/2026 não foi lida; o Emissor Nacional pode aceitar só um serviço por nota) **[a confirmar na NT 007/2026]**. **Regra de desenho: uma NFS-e por serviço, como padrão.** O parâmetro **`nfse_por_servico`** (escritório; padrão `verdadeiro`) é a chave: se o layout confirmar vários itens por nota, passa-se a `falso` e o Financeiro agrupa as linhas do mesmo cliente e do mesmo regime numa DPS, sem mudar a fatura nem a cobrança. Cada linha da fatura aponta a nota do seu serviço (`linha_id`), e o cancelamento de uma nota ajusta só a linha dela.

| Ação | Nível | Aprovação |
| --- | --- | --- |
| `nfse.emitir` | executar, irreversível | Cartão até a promoção; depois, sozinho só para valor igual ao contrato |
| `nfse.cancelar`, `nfse.substituir` | executar, irreversível | **Sempre** cartão; nunca promovida |
| `ajustar_cobranca` após cancelamento | executar | Cartão, junto com a nota |

Nota cancelada tira a cobrança do contas a receber na mesma transação. Leiaute de cancelamento e substituição `[a confirmar]`. Município que ainda não tenha aderido ao padrão nacional (se houver) usa integrador (08 7.5).

### 5.6 Inadimplência e suspensão escalonada (FIN-009)

GES-006 (decisão sobre protesto, negativação e distrato) é do sócio. FIN-009 só executa o que ele decidiu, em degraus, todos com cartão ao Administrador:

| Degrau | Efeito | Reversão |
| --- | --- | --- |
| Aviso formal (D+30) | Notificação com prazo, no app e por e-mail, com a data da pausa | Pagamento |
| Pausa parcial (D+45) | Pedidos novos e serviços extras no app em espera; faixa explicando no app | Reativa **sozinha** quando o pagamento é confirmado |
| Proposta de distrato | Prepara FIN-016 e GES-046; decisão do sócio | Não aplicável |

Nunca pausa: obrigação em curso, prazo legal, guia, documento já devido (R6). Cada degrau gera evento e fica na linha do tempo do cliente.

---

## 6. Contas a pagar e conciliação

### 6.1 Captura e pagamento (FIN-003, fase 3, nível B)

| Passo | Quem | Ferramenta |
| --- | --- | --- |
| Captura | Integrante lê DDA (pelo agregador ou banco) e a caixa de e-mail financeira | `listar_boletos_dda`, `capturar_conta_email` |
| Classificação | Integrante propõe fornecedor, categoria e centro de custo; checa duplicidade | `propor_pagamento` (rascunhar) |
| Aprovação | Por alçada: Gestor do Financeiro até o limite, Administrador acima | Cartão |
| Pagamento | API do banco, Pix ou CNAB; comprovante volta ao índice | `agendar_pagamento` (executar, irreversível) |

O integrante **nunca paga sozinho** e a ferramenta de pagamento não entra na promoção. Fornecedor novo ou valor fora do padrão sobe como alerta de boleto suspeito.

### 6.2 Conciliação bancária (FIN-004)

Entra na plataforma (decisão do 08, 13.3). Fontes, em ordem: webhook da conta de cobrança (grátis, fase 3a); OFX ou CNAB enviado (grátis); API do banco do escritório; **Open Finance** por agregador (fase 3b, contratado e cobrado do escritório à parte, piso de R$ 2.500/mês no Pluggy).

Ordem de casamento de cada lançamento:

1. Crédito do provedor com `id_externo` de parcela: casa sozinho.
2. Crédito por Pix ou TED: casa por valor, CNPJ ou nome do pagador e vencimento.
3. Débito com conta a pagar agendada: casa pelo código de barras ou valor e data.
4. Transferência entre contas do escritório: par de lançamentos.
5. Resto: **regra aprendida** (padrão → categoria e centro de custo). Regra nova só vale depois de aprovada.

O integrante concilia sozinho o que casa por (1), (3), (4) e por regra aprovada (S). Sobra para a pessoa: valor diferente do devido (juros, desconto, pagamento duplicado), pagador desconhecido, lançamento sem documento, divergência de saldo. Cada item pendente é um cartão simples ("R$ 1.480 de um pagador desconhecido: Empresa X ou Y?"). Consentimento do Open Finance que vence vira tarefa 30 dias antes (08, 7.3).

---

## 7. Gestão financeira

### 7.1 Fluxo de caixa e previsão de 12 meses (FIN-005, S)

| Entradas | Saídas |
| --- | --- |
| Parcelas abertas, com a probabilidade de atraso do histórico de cada cliente | Contas a pagar agendadas e recorrentes |
| Contratos vigentes, reajustes agendados e 13º | Folha, encargos e tributos próprios do escritório (GES-061) |
| Funil do CRM ponderado (GES-042), opcional | Custos fixos de sistemas e conectores |
| Distratos avisados (GES-046) como queda | Decisões simuladas |

Três cenários: base, conservador e otimista. `simular_decisao` responde "aguento contratar mais um analista em março?" com `calculo.custo_contratacao` (07). Realizado vem de lançamentos (caixa); projetado, de parcelas e contratos.

### 7.2 DRE gerencial por centro de custo (FIN-006, P)

Receita alocada pelos itens do contrato (`setor_id` do item). Custo direto pelas despesas lançadas no centro de custo; estrutura rateada por critério (horas, clientes ou receita), com `calculo.rateio`. A **visão apropriada** mostra horas do setor × custo-hora do escritório; a diferença para o realizado é a ociosidade. Competência, não caixa (R7). O fechamento do mês é `fechamento.executar` (cartão ao Administrador).

### 7.3 Custo-hora e Rentabilidade (05, 8.4)

```
Contas pagas e a pagar do mês (competência)  ─┐
 - fora do custo: distribuição de lucros, imobilizado, despesas reembolsáveis
                                              ├─► gastos do mês ÷ horas produtivas ─► custo-hora do escritório
Horas produtivas registradas (Timesheet)     ─┘
```

| Passo | Quem |
| --- | --- |
| Marcar no plano de contas o que `entra_no_custo_hora` | Administrador, uma vez |
| `custo_hora.propor(competencia)` com memória de cálculo | Integrante do Financeiro (rascunhar) |
| `custo_hora.definir` (05, A7) | Administrador, cartão |

Até o fechamento do mês, vale o do mês anterior, marcado "provisório". A Rentabilidade lê o honorário por `contrato.honorario_na_competencia(cliente, competencia)`, não mais do perfil. Duas margens: sobre o **contratado e faturado** (competência) e sobre o **recebido** (caixa), para separar cliente deficitário de cliente inadimplente. Do cliente deficitário, o botão **propor reajuste** abre o cartão de 4.3.

### 7.4 Orçamento, remuneração e sócios (montados na v1, desligados; ligam na fase 4)

Telas e estruturas existem desde a v1 e mostram "ainda não há dados suficientes para ativar" até o critério da 13.5 ser atendido.

| Atividade | O que faz | Nota |
| --- | --- | --- |
| FIN-007 Orçamento anual | Parte do realizado e da projeção, aplica premissas, compara orçado × realizado, avisa desvio | Precisa de 6 a 12 meses de dados |
| FIN-008 Comissões e PLR | Calcula sobre o **recebido** pela regra aprovada; mostra a memória de cálculo a cada pessoa; exporta variáveis para a folha | Lei 10.101/2000 não lida `[a confirmar]`; remuneração é restrita (seção 10.6) |
| FIN-012 Resultado e sócios | Aplica o acordo de sócios sobre a DRE por carteira; avisa o limite mensal de lucros por sócio (`calculo.lucro_distribuivel`) | Decisão dos sócios; só Administrador |
| FIN-013 Provedores | Soma a tarifa real por ciclo e compara com as tabelas públicas; prepara a troca | D-assistido |

---

## 8. O integrante do Financeiro e a IA

### 8.1 O que faz e o que prepara

O integrante existe desde a v1, **desligado** (02, P11), e serve a Administrador, Gestor e ao Colaborador com a adição de acesso ao Financeiro, dentro do escopo dele (13.6). Liga na fase 3a, em modo pseudomanual (13.6). O que o mapa marca **S** ele faz sozinho; o que é irreversível passa por cartão até a promoção.

| Atividade | Autonomia | O que o integrante faz | Cartão |
| --- | --- | --- | --- |
| FIN-002 despesa adiantada | S | Lê o comprovante, liga cliente e processo, inclui na fatura | Entra no cartão do lote |
| FIN-004 conciliação | S | Aplica regras aprovadas; manda o resto à revisão | Só para regra nova |
| FIN-005 caixa e previsão | S | Atualiza a projeção semanal | Não |
| FIN-010 autoatendimento | S | 2ª via, histórico, status do Pix Automático | Contestação vai a pessoa |
| FIN-016 13º proporcional | S | Calcula e inclui na última cobrança | Cobrança e distrato, cartão |
| GES-001 faturamento | S | Prepara o lote e confere o contrato | **Emitir: cartão até a promoção** |
| GES-003 baixa | S | Baixa e emite recibo | Não (estorno reverte) |
| GES-004 régua | S | D-5 a D+3 por modelo do tema | D+10 em diante: cartão |
| GES-007 NFS-e | S | Prepara a nota | **Emitir: cartão até a promoção** |
| GES-009 cobranças anuais | S | Prepara 13º e sazonais | Cartão em lote |
| GES-011 indicadores | S | Atualiza MRR, churn, inadimplência | Não |
| GES-015 faixa contratada | S | Mede e propõe | Cobrar excedente ou aditivo: cartão |
| FIN-001, GES-002, 013, 014, 046 | P | Rascunha contrato, avulso, reajuste e distrato | Cartão |
| FIN-003 contas a pagar | P | Captura, classifica e propõe | Pagamento: **sempre** |
| FIN-006, 007, 008, 012, 013 | P | Fecha e rascunha a análise | Aprovação humana |
| FIN-009 suspensão | P | Propõe e aplica o que o sócio decidiu | **Sempre** |
| FIN-011 corrigir nota e cobrança | P | Acha a nota e a cobrança afetadas | **Sempre** |
| FIN-014, 601 a 604 migração | P | Mapeia, importa, mede a paridade | Cartão antes de gravar |

### 8.2 Promoção e o que nunca faz

A promoção segue o 02 (3.3): uma pergunta ao Administrador depois de 30 cartões e 95% sem edição em 90 dias. Aqui vale para **`cobranca.criar` do lote recorrente e `nfse.emitir`**, e só com valor **igual ao contrato**; qualquer valor diferente volta ao cartão. O critério "reversível" do 02 precisa de exceção explícita (seção 13).

**Nunca, sem cartão e sem promoção possível:** cancelar ou substituir nota ou cobrança; pagar conta; aplicar reajuste; suspender cliente; perdoar despesa ou dívida; alterar contrato assinado; negativar, protestar ou acionar; fechar mês financeiro.

### 8.3 Gatilhos

| Evento | O que faz |
| --- | --- |
| `reajuste.vencer_em_60_dias` | Simula o reajuste e abre o cartão (4.3) |
| `parcela.vencer_em_3_dias`, `cobranca.vencer` | Ajusta a régua; confere o meio de pagamento |
| `cobranca.pagamento.informado` | Pausa a régua; cobra a conciliação |
| `conta_pagar.capturar` | Classifica e propõe |
| `conciliacao.divergir` | Abre o cartão da diferença |
| `faixa.estourar` | Propõe excedente ou aditivo |
| `cic.estado.mudar` para `em_saida` | Prepara FIN-016 e GES-046 |
| Job mensal | GES-001 no dia do lote; fechamento e custo-hora no dia 5 |
| Job diário | Baixa e conciliação (GES-003, FIN-004); régua (GES-004) |

Aviso só quando há algo: o integrante publica `alta` apenas para cartão pendente, divergência ou parcela acima do limite; o resto vai ao resumo diário (Fundações 8, regra 5).

### 8.4 Motor Cálculo

Reajuste, proporcional, juros e multa de honorário, rateio e custo-hora usam o motor Cálculo (07), nunca o modelo: valor em tabela versionada com fonte, resultado com memória. O modelo explica; não calcula. Valor com origem não verificada é removido da resposta (07).

### 8.5 Exemplos ponta a ponta

**Reajuste (Padaria Y).** Data-base 01/03. No fim de dezembro, 60 dias antes, o gatilho acorda o integrante. Ele chama `calculo.reajuste_honorario` com o IPCA de 12 meses, vê que a Rentabilidade de Y está deficitária em dois dos últimos três meses e propõe o índice mais 4 pontos percentuais. Cartão ao Gestor com as duas opções e a margem. Aprovado, o CRM envia o comunicado; o aditivo fica `comunicado` e vira `vigente` em 01/03. O lote de março sai com o item novo.

**Parcela vencida (Empresa X).** Fatura de 11/2026 vence dia 5. O integrante envia D-5, D0 e D+3 sozinho. No dia 8 o cliente toca em "pago" no app; a régua pausa. O webhook do provedor não chega até o dia 11; o extrato do Open Finance não mostra crédito. A parcela volta a `emitida`, a régua retoma e o cliente recebe "não localizamos seu pagamento". No D+10 o Gestor vê o cartão da mensagem firme.

**Fechamento do mês.** Dia 25, o job de GES-001 reúne 142 contratos, os reembolsos de FIN-002 e os avulsos aceitos, confere o contrato (FIN-001), separa 6 exceções e abre o cartão em lote. O Administrador aprova com uma edição. Saem 136 cobranças e 136 NFS-e (GES-007), cada uma com evento e `chave_idempotencia`.

**Divergência de conciliação.** Entra um Pix de R$ 1.480 de pagador "M. Souza ME". O integrante acha dois contratos com esse valor aproximado, escolhe por CNPJ do pagador e propõe a baixa com R$ 30 de juros. Cartão simples. Aprovado, a regra "pagador M. Souza ME = Empresa X" vira regra proposta.

---

## 9. Migração

Atividades: FIN-014 (F, P) e as fichas FIN-601 a 604 (B), na onda 3 do plano mestre GES-608 (B6, 4.2).

| Origem | Como entra | Cuidados (B6) | Ficha |
| --- | --- | --- | --- |
| Conta Azul | API v2: clientes, contratos, contas a receber, parcelas, saldos | Sem webhook (polling de `/alteracoes`); sem sandbox | FIN-601 |
| Omie e Nibo | Omie: planilha ou Plano de APIs (R$ 49,90 por aplicativo/mês, só durante a migração); Nibo: token Premium, 500 registros por consulta | PDFs dos boletos em aberto | FIN-602 |
| Conexa | API v2: customers, contracts, recurringSales, charges | 60 requisições/min; **encerrar a recorrência na mesma data** em que a nossa começa | FIN-603 |
| Domínio Honorários e planilha | Exportação e modelo de planilha da plataforma | Sem API de saída `[NÃO ENCONTRADO]` | FIN-014 |

### 9.1 Mapeamento

| Origem | Destino |
| --- | --- |
| Cliente (CNPJ) | Cliente existente (SOC-001); casa por CNPJ |
| Contrato ou recorrência | Contrato e itens; rascunho para conferência |
| Título em aberto | Cobrança `origem = legado`, `conexao_cobranca_id` antigo; **não reemite** |
| Título pago | Cobrança e Recebimento históricos, somente leitura |
| Plano de contas, centros de custo | Plano gerencial e centros, com mapeamento proposto pelo integrante |
| JSON ou arquivo bruto | Guardado como Documento; data, hora e autor originais preservados |

### 9.2 Convivência e troca de provedor

1. Importa e roda `relatorio_paridade`: contratos, valores do mês, saldos em aberto. O integrante mostra as divergências.
2. Define a **data de corte** por cliente. Antes, cobra o sistema antigo; depois, a plataforma. O título antigo termina lá, a baixa chega por webhook, polling ou arquivo.
3. Convive por **um ciclo completo** de cobrança (dois, no Conta Azul). Critério de saída: títulos novos todos pela plataforma, carteira antiga liquidada, saldos batendo.
4. **Troca do provedor de boleto (FIN-604):** nova conta, primeira competência pela plataforma, novo convite de Pix Automático a cada cliente, aviso da mudança de beneficiário (o cliente pode desconfiar de golpe) e duas contas abertas até o último título antigo liquidar. O histórico fica unificado, porque a Cobrança guarda `conexao_cobranca_id` de cada época.

Importação grava depois de cartão. Nada é cobrado em dobro: a ferramenta recusa criar cobrança de competência já coberta por título legado.

---

## 10. Telas

### 10.1 Estrutura

Item lateral **Financeiro** com sete abas internas (**decidido em 8/11/2026: sete abas**; o UI lab desenhou quatro na primeira rodada e as sete na segunda, 8/11/2026, adendo 16). Cabeçalho comum: período, filtro por cliente (o Financeiro é do escritório e não usa o seletor do topo, UI lab, decisão 24), integrante do Financeiro ao lado ("falar com Ana") e o bloco de tarefas do setor (Painel 2.4). Identificadores: `aba.financeiro.<tela>`.

| Aba | Identificador | Fase |
| --- | --- | --- |
| Visão geral | `aba.financeiro.visao_geral` | 3 (v1: só receita contratada) |
| Contratos | `aba.financeiro.contratos` | v1 |
| Cobranças | `aba.financeiro.cobrancas` | 3 |
| Contas a pagar | `aba.financeiro.contas_pagar` | 3 |
| Conciliação | `aba.financeiro.conciliacao` | 3 |
| Fluxo de caixa | `aba.financeiro.fluxo_caixa` | 3 |
| Resultado | `aba.financeiro.resultado` | 3 (orçamento, remuneração e sócios na 4) |

A engrenagem "Configurar" (só Administrador) reúne contas, plano de contas, centros, política financeira, alçadas, régua e provedores. Na v1, o Painel 6.8 mostra só as duas primeiras linhas da aba Contratos; esta seção as estende sem mudar a posição.

### 10.2 Visão geral

```
┌─ Financeiro · Visão geral · novembro ▾ ─────────────────────────────── [integrante: Ana] ┐
│ MRR R$ 184 mil · churn 1,2% · inadimplência 4,8% · caixa hoje R$ 96 mil · custo-hora R$ 300 │
│ ┌─ Precisa de você (cartões) ───────────────┐ ┌─ Caixa: 90 dias ───────────────────────┐ │
│ │ Lote 11/2026: 142 cobranças · [sim/editar/não] │ │ realizado ▬▬▬▬ projetado ┄┄┄ mínimo   │ │
│ │ Reajuste da Padaria Y (2 opções)   [abrir]     │ └──────────────────────────────────────┘ │
│ └────────────────────────────────────────────────┘ ┌─ Clientes que pedem atenção ──────────┐ │
│ ┌─ Receita por setor ─┐ ┌─ Vencidas por idade ─┐ │ Empresa W deficitária · Loja Z fora da │ │
│ └─────────────────────┘ └──────────────────────┘ │ faixa · Clínica V pausada (D+45)       │ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

Dados: `indicador.listar`, `cobranca.listar`, `caixa.projetar`. Estado vazio: "nenhum contrato estruturado; importe em Contratos".

### 10.3 Contratos

Lista por cliente (valor, situação, próximo reajuste, faixa, 13º) e detalhe com itens e vigências, aditivos, linha do tempo e "contrato × cobrança" (FIN-001). Blocos extras: clientes sem contrato, receita contratada por mês, setor e regime, e faixas estouradas (GES-015). Ações: **preparar** aditivo, **executar com aprovação** assinatura e reajuste, **executar** exportar. Contrato em edição mostra diff antes de gravar (Painel 5, bloco C).

### 10.4 Cobranças

```
┌─ Cobranças · novembro ▾ · [Todas ▾] [cliente ▾]                 [Preparar lote ▸] ┐
│ A receber R$ 118 mil · recebido R$ 71 mil · vencido R$ 5,7 mil (4,8%)               │
│ Empresa X   11/2026  R$ 1.200  vence 05/12  emitida   boleto+Pix  NFS-e 1432  [2ª via] │
│ Padaria Y   11/2026  R$   900  venceu 05/11 D+2  régua 2/7   [aguard. confirmação] │
│ Loja Z      11/2026  R$ 2.100  venceu 26/10 D+12 pausa em 33 dias  [propor acordo] │
└────────────────────────────────────────────────────────────────────────────────────┘
```

Ações com nível: **preparar** lote e acordo; **executar com aprovação** emitir, cancelar, substituir, enviar aviso formal; **executar** baixa manual e 2ª via. Blocos: lote do mês, régua por cobrança, notas (FIN-011), avulsos a faturar, reembolsos pendentes, provedor (tarifa real, FIN-013). Estados: vazio ("nenhuma cobrança no mês; prepare o lote"), vencida por idade, em acordo, aguardando confirmação.

### 10.5 Contas a pagar, Conciliação, Fluxo de caixa, Resultado

| Aba | Blocos | Ações (nível) |
| --- | --- | --- |
| Contas a pagar | Fila por estado; vencimentos da semana; duplicidades suspeitas; alçada de cada uma | Classificar (preparar); aprovar e agendar pagamento (executar com aprovação) |
| Conciliação | Contas e saldo; lançamentos por estado; regras propostas; divergências; consentimento Open Finance | Confirmar sugestão e criar regra (executar); ajuste (executar com aprovação) |
| Fluxo de caixa | Realizado e projetado, cenários, 12 meses, simulador "e se" | Simular (ler); salvar cenário (executar) |
| Resultado | DRE por setor e por carteira, visão apropriada, custo-hora, Rentabilidade (link ao Timesheet), orçamento, remuneração e sócios (desligados até haver dados; fase 4) | Fechar mês (executar com aprovação); propor custo-hora (preparar) |

### 10.6 Permissões

| Papel | Vê e faz |
| --- | --- |
| Administrador | Tudo, inclusive configuração, fechamento, custo-hora, remuneração e sócios |
| Gestor com o setor Financeiro | Contratos, cobranças, contas a pagar e conciliação; aprova até a alçada; lê Resultado; não vê remuneração individual nem distribuição |
| Gestor sem o setor | Não vê o item lateral; vê a Rentabilidade se tiver Gestão (05, 8.4) |
| Colaborador | Só por **adição nas configurações da conta do usuário** (exceção por tela, Painel 9.3), com `nivel_max`: por exemplo auxiliar financeiro com `aba.financeiro.cobrancas` e `.conciliacao` em executar. **Resultado, remuneração e sócios não são liberáveis por exceção** |

O integrante obedece ao escopo do dono (H6). Cartão de pagamento acima da alçada do dono vai ao Administrador. No modo BPO, o financeiro do subinquilino é separado e a mãe só vê dentro do `escopo_mae`; o componente tem `titular` (escritório ou empresa, adendo 15).

### 10.7 Celular

Decisão cabe em um toque: aprovar o cartão do lote, aprovar pagamento, baixar, enviar 2ª via, ver o caixa. Visão geral, Cobranças e Contas a pagar em lista; Resultado e Contratos em modo leitura com "edite no computador" (Painel 2.6).

### 10.8 O que o cliente vê no app (06, 3.8)

| Bloco | Conteúdo |
| --- | --- |
| Contrato | Resumo do vigente: serviços, valor, vencimento, próximo reajuste; **sem** margem, horas ou custo |
| Faturas | Ano corrente, com status: a vencer, vence em N dias, vencida, aguardando confirmação, em acordo, paga |
| Pagar | Boleto, Pix com copia-e-cola, 2ª via com juros e multa, botão **"pago"** |
| Notas | NFS-e de cada serviço da fatura; informe anual de pagamentos e retenções |
| Pix Automático | Autorizar, ver e cancelar |
| Pausa parcial | Faixa explicando o que está em espera, e que obrigações e documentos seguem |
| Contestar | Abre tarefa do Financeiro |

Visível ao sócio e ao financeiro do cliente (papéis do 06, 2.4). O texto vem do tema e nunca usa "inadimplente".

---

## 11. Fases

| Fase | Entra | Depende de |
| --- | --- | --- |
| **v1 (já no Painel)** | Contratos e honorários estruturados (FIN-001), receita contratada, cliente sem contrato, reajuste e faixa **como dados**; telas e estruturas de orçamento, remuneração e sócios montadas e desligadas (13.5) | Fundações F4, F5; Painel P10 |
| **3a** | Cobrança, NFS-e Nacional, baixa por webhook, régua, 2ª via, botão "pago", despesas adiantadas, avulsos, reajuste e 13º, contas a pagar, conciliação por provedor e OFX, fluxo de caixa, migração (FIN-014, 601 a 604) | 08 C15; 04 C9 (régua); 06 (tela do app); 07 (cálculos); assinatura de ciência (08 C14) |
| **3b** | DRE, custo-hora e Rentabilidade, Open Finance, suspensão (FIN-009), integrante do Financeiro ligado | 05 T6 e T8; 08 C16 (contrato com agregador); 02 E1 a E4 |
| **4** | Ligar orçamento (FIN-007), comissões e PLR (FIN-008), resultado dos sócios (FIN-012) quando houver dados; comparação de provedores (FIN-013), CAC e LTV | Seis meses de realizado; funil do CRM |
| **3c** | BPO financeiro (FIN-201, antecipada da fase 5; subplano 10, 11.3): pacote BPO financeiro sobre o Financeiro 3a e 3b, com titular empresa e espelho do ERP do cliente | 3b; conectores de ERP (10, B7a) |
| **5** | Cobrança dos clientes do cliente (subcontas em nome do cliente; 10, B13) | Conta no provedor do cliente; 06 (serviços extras) |

O catálogo marca FIN-007, 008 e 012 como fase 3; este desenho os **liga** na 4 porque dependem de realizado acumulado, mas os monta desde a v1 (13.5). O Plano da Plataforma (seção 7) cita "cobrança de honorários (Asaas)" na fase 2; o catálogo e o 08 dizem fase 3, e este desenho segue o catálogo.

---

## 12. Custos e precificação

Entrada do estudo de precificação por módulo (08, 13.2). Preços lidos em 06/11/2026 (B1, 08 10).

| Custo | Valor | Quem paga | Como entra no estudo |
| --- | --- | --- | --- |
| Boleto ou Pix recebido: **banco do escritório = tarifa do convênio dele, sem custo da plataforma**; gateway (Asaas) | **R$ 1,59 (R$ 0,79 na tarifa promocional)**, conferido na página oficial do Asaas em 7/11/2026; o R$ 2,15 do V3 e do 08 era de verificação anterior | Escritório, ao provedor | Fora do módulo; informado como custo do cliente. **Conferir antes de usar** |
| Efí | Boleto R$ 3,45; Pix por API 1,19%; Pix Automático R$ 3,50 | Escritório | Idem |
| NFS-e Emissor Nacional | R$ 0 (R$ 0,49 pelo Asaas; Focus Solo R$ 94,90/mês fora do padrão) | Escritório | Zero no módulo |
| Notificação WhatsApp da régua | R$ 0,035 por mensagem de utilidade (R$ 0,55 se pelo Asaas: não usar) | Embutido até o teto por número (08 10.3) | Dentro do plano do CRM |
| Open Finance (Pluggy) | A partir de R$ 2.500/mês, com 15 dias de teste | Escritório, à parte | Complemento do módulo; rateado pelos clientes conectados (100 clientes: R$ 25 cada) |
| Assinatura avançada | R$ 69 a 80/mês | Escritório | Opcional |
| Modelo (tokens) do integrante | A medir | Plataforma | Custo por integrante já aparece em Gestão (02) |

**Ordem de grandeza** para 100 clientes: tarifa do gateway entre R$ 79 (promocional) e R$ 159 por mês, paga pelo escritório; no banco do escritório, a do convênio dele. Para comparar: o escritório paga hoje R$ 166 a 929/mês por ERP genérico (Nibo, Conta Azul, Omie, Granatum, B1), sem contar o Conexa, cujo preço não é público.

### 12.1 Venda separada

| Pacote | Conteúdo | Exige |
| --- | --- | --- |
| **Contratos e honorários** | v1: contrato, itens, faixa, receita contratada | Base (Fundações, cadastro, documentos) |
| **Financeiro completo** | Fase 3 inteira, sem Open Finance | Base; CRM para régua por WhatsApp (sem ele, só e-mail) |
| **Open Finance** | Conciliação por consentimento | Financeiro completo; contrato com agregador |
| **Rentabilidade** | DRE e margem por cliente | Financeiro completo e Timesheet |
| **BPO financeiro** (fase 3c) | FIN-201 | Financeiro e App (dependências técnicas reais; Timesheet, CRM e Open Finance recomendados e desmarcáveis; 10, 9.1) |

Vendido sozinho, o Financeiro substitui o Conexa, mas perde o diferencial da operação (horas, tarefas, app). A Assinatura (Fundações 2.2) ganha o módulo `financeiro` e o complemento `open_finance`. Ferramenta de módulo não contratado devolve "módulo não contratado".

---

## 13. Ordem de construção, ajustes e perguntas

### 13.1 Etapas sobre as Fundações

| # | Etapa | Depende de | Entrega |
| --- | --- | --- | --- |
| FN1 | Contrato, item, aditivo, tabela de avulsos | F2, F4, F5 | Entidades, ferramentas `contrato.*`, migração do JSON `honorario`, aba Contratos (v1) |
| FN2 | Reajuste e 13º | FN1, 07 | `calculo.reajuste_honorario`, simulação, FIN-016, GES-014 |
| FN3 | Base financeira | F2 | Plano de contas, centros, conta bancária, lançamento, política, fechamento; tela de configuração; estruturas de orçamento, remuneração e apuração, desligadas |
| FN4 | Cobrança e baixa | FN1, FN3, 08 C15 | `cobranca.*`, Parcela, Recebimento, webhook, cartão em lote, aba Cobranças |
| FN5 | NFS-e Nacional | FN4, e-CNPJ no cofre | Emitir, cancelar, substituir, retenções |
| FN6 | Migração e convivência | FN4 | FIN-014, 601 a 604, paridade, data de corte |
| FN7 | Régua, "pago" e 2ª via | FN4, 04 C9, 06 | Régua de honorários, evento, app do cliente |
| FN8 | Despesas, avulsos, faixa | FN1, FN4 | FIN-002, GES-002, GES-015 |
| FN9 | Contas a pagar | FN3, banco | FIN-003, alçadas, pagamento |
| FN10 | Conciliação | FN3, FN4 | Regras, FIN-004 por provedor e OFX; Open Finance (08 C16) |
| FN11 | Caixa e Visão geral | FN4, FN9 | FIN-005, GES-011 |
| FN12 | DRE, custo-hora, Rentabilidade | FN11, 05 T6 | FIN-006, `custo_hora.propor`, T8 |
| FN13 | Integrante ligado e suspensão | FN4, FN7, 02 E1 a E4 | Gatilhos, promoção, FIN-009 |
| FN14 | Fase 4 | FN12 | FIN-007, 008, 012, 013 |
| FN15 | Fase 3c (antes: fase 5) | FN10, FN12 | FIN-201 (subplano 10, B7 a B11) |

FN1 a FN4 formam o primeiro corte útil. FN6 vem antes do uso real de um escritório com sistema anterior.

### 13.2 Ajustes pedidos às Fundações, 02, 03, 04, 05, 06, 07 e 08

| # | Onde | Pedido | Por quê |
| --- | --- | --- | --- |
| A1 | Fundações 2.2 | Módulo `financeiro` e complemento `open_finance` na Assinatura | Venda separada (12.1) |
| A2 | Fundações 4.2 | `honorario` do perfil vira resumo derivado do Contrato; `cliente.mudar_estado` para `encerrado` bloqueia com contrato ativo ou parcela aberta | 3.2 |
| A3 | Fundações 4, 6.5 | Entidades da seção 3; ferramentas de 3 a 8 (`contrato.*`, `faturamento.*`, `cobranca.*`, `recebimento.*`, `nfse.*`, `suspensao.*`, `conta_pagar.*`, `lancamento.*`, `caixa.*`, `dre.*`, `custo_hora.propor`, `fechamento.executar`) com nível, `irreversivel` e `exposta_mcp` | Tudo é ferramenta |
| A4 | Fundações 4.11 | `tipo` de Documento ganha `fatura`, `boleto`, `comprovante`; `nfse` com `metadados.emitente = escritorio`; `cliente_id` da NFS-e é o tomador | 3.2 |
| A5 | Fundações 5.7 | Eventos `contrato.ativar`, `contrato.aditar`, `reajuste.vencer_em_60_dias`, `cobranca.criar`, `cobranca.vencer`, `cobranca.pagamento.informado`, `parcela.vencer_em_3_dias`, `suspensao.aplicar`, `faixa.estourar`, `conta_pagar.capturar`, `conciliacao.divergir`, `fechamento.executar` | Gatilhos 8.3 |
| A6 | Fundações 8, 10 | `modelos_texto` ganha fatura, recibo, aviso formal, "não localizamos seu pagamento", comunicado de reajuste, pausa parcial; Notificação `categoria = financeiro` | Marca branca |
| A7 | Fundações 3.5 | Exceção por tela com `nivel_max` já existe; acrescentar que `aba.financeiro.resultado` e remuneração não são liberáveis por exceção | 10.6 |
| A8 | 02 3.3 e 3.2 | Exceção ao critério "reversível": `cobranca.criar` do lote recorrente e `nfse.emitir` são promovíveis com valor igual ao contrato; cancelar, pagar, reajustar e suspender nunca; listar as atividades GES-001 a 015 e FIN no integrante do Financeiro | 8.2 |
| A9 | 02 7.2 | Gatilhos novos da 8.3 na lista; integrante liga na fase 3 | Gatilhos |
| A10 | 03 6.8, 9.2 | Aba Financeiro vira item lateral com sete abas e identificadores `aba.financeiro.*`; Gestor com o setor passa de "lê e edita contratos" para a tabela de 10.6 | Seção 10 |
| A11 | 04 7.2 | Régua de honorários com sete etapas (5.2), parada por `cobranca.pagamento.informado` e por pagamento; variável "visto no app" | Seção 5 |
| A12 | 05 8.4 | Honorário do mês lido de `contrato.honorario_na_competencia`; margem sobre o contratado e sobre o recebido; `custo_hora.propor` pelo Financeiro; fonte dos gastos é a base financeira | 7.3 |
| A13 | 06 3.8 | Estados da fatura, botão "pago", faixa de pausa parcial e contestação como na 10.8; evento `cobranca.pagamento.informado` | Seção 5 |
| A14 | 07 | `calculo.reajuste_honorario`, `calculo.proporcional_13o`, `calculo.juros_multa_honorario`, `calculo.rateio`, com tabela de índices (SGS) versionada | 8.4 |
| A15 | 08 7.4 a 7.6, 10 | Tarifa do Asaas corrigida para R$ 1,59 (R$ 0,79 promocional), conferida em 7/11/2026; conexão direta com banco do escritório (08, 13.7), tabela de bancos suportados, CNAB como alternativa; conector `cobranca.*` com `pix_automatico.status`; leiaute de cancelamento e substituição da NFS-e; DDA pelo agregador | 5 e 12 |

### 13.3 Perguntas para aval

Cada uma com a hipótese adotada e uma frase simples sobre o que está em jogo.

| # | Pergunta | Hipótese adotada | Em outras palavras |
| --- | --- | --- | --- |
| P1 | Depois de provar que acerta, o sistema pode emitir sozinho as cobranças e notas do mês, ou sempre pede o "ok" do sócio? | **Respondido: sim, em duas etapas.** Começa pseudomanual (o sistema monta as cobranças e notas do mês e o usuário confirma em lote); depois que o usuário confirma que está tudo de acordo, a emissão passa a ser totalmente automática (4.5 e 8.2). Pede "ok" até a promoção; depois só o que bate com o contrato; cancelar nunca é sozinho | Emitir cobrança e nota não tem volta fácil; sozinho poupa o clique mensal, mas um erro chega ao cliente antes de alguém ver |
| P2 | O reajuste anual pode ser aplicado sozinho na data-base? | **Respondido: sempre cartão**, aviso ao cliente no prazo do contrato; sem automação do reajuste (4). Não: sempre cartão e aviso ao cliente no prazo do contrato | Reajustar é mexer no preço do cliente; um aviso falho pode gerar briga ou nulidade da cobrança |
| P3 | Com quantos dias de atraso vem o aviso formal e a pausa de pedidos novos? | **Respondido: os prazos são configuráveis**, por cliente e/ou gerais do escritório (5.2 e 5.6). D+30 e D+45, configuráveis; nunca pausa obrigação, prazo legal nem documento devido | É o ponto em que o sistema deixa de só lembrar e passa a avisar que vai reduzir o serviço; cedo demais irrita, tarde demais dá calote |
| P4 | Quanto tempo o botão "pago" segura a régua até o banco confirmar? | **Respondido (segue a hipótese):** 3 dias úteis; sem fonte de confirmação, abre tarefa para pessoa em vez de voltar a cobrar | Cliente que já pagou odeia receber cobrança; cliente que mente ganha tempo |
| P5 | Um auxiliar financeiro (Colaborador) pode operar cobranças e conciliação? | **Respondido (segue a hipótese):** o acesso é uma adição nas configurações da conta do usuário (permissões por tela, `aba.financeiro.*`); resultado e remuneração nunca liberáveis. Sim, por exceção; Resultado, remuneração e sócios nunca | Em escritório pequeno quem cobra não é sócio, mas margem e salário são assuntos só dos sócios |
| P6 | O dinheiro que o escritório adianta (taxa da Junta) entra na nota fiscal do honorário? | **Respondido: customizável.** A taxa adiantada fica salva como **cobrança avulsa** no sistema; ao faturar, o Financeiro combina as avulsas de forma dinâmica e de fácil entendimento, e a política de entrar na nota ou em recibo separado é configurável (4.6 e 13.5); até o contador decidir por município, o padrão é recibo separado | A regra muda de cidade para cidade e errar altera o imposto da nota |
| P7 | A distribuição de lucros fica fora do custo da hora? | **Respondido: o custo-hora é calculado a partir dos custos.** Entra o que é custo constante (folha, encargos, pró-labore, aluguel, sistemas, impostos sobre a operação); a distribuição de lucros, que é o que sobra, fica fora. Cada conta do plano de contas gerencial tem a marca `entra_no_custo_hora`, editável (3 e 7.3). Sim; pró-labore e folha entram | O custo-hora diz quanto custa uma hora de trabalho; lucro dos sócios é o que sobra, não o custo |
| P8 | O Financeiro pode ser vendido sozinho, sem CRM, Timesheet e app? | **Respondido: sim, o Financeiro pode ser vendido sozinho** (um financeiro agêntico para escritório de contabilidade não existe no mercado) (12.1). Sim, em pacotes; sem CRM a régua é só por e-mail | Vender separado abre mais clientes, mas sem a operação ele vira "mais um Conexa" |
| P9 | Orçamento, comissões e divisão entre sócios ficam para a fase 4, embora o catálogo marque a fase 3? | **Respondido: segue, e o plano já fica montado na v1 (13.5).** Sim | São decisões que exigem meses de números reais; fazer cedo gera planilha vazia |
| P10 | Qual tarifa do Asaas vale no estudo de preços: R$ 1,59 ou R$ 2,15 por cobrança paga? | **Respondido: R$ 1,59 por cobrança paga (R$ 0,79 promocional), conferido na página oficial do Asaas em 7/11/2026.** Usar a faixa até conferir no contrato | Muda em quase R$ 60 por mês cada 100 clientes; o estudo precisa de um número só |

### 13.4 Perguntas reformuladas

**P2, reajuste anual.** Todo contrato de honorários tem uma data-base em que o preço sobe por um índice (por exemplo, a inflação do ano). Quando a data chega, alguém precisa aplicar o novo valor e **avisar o cliente com antecedência**, no prazo que o contrato manda. A dúvida é se o sistema pode aplicar o reajuste sozinho, ou se sempre mostra um cartão ("reajustar a Empresa X de R$ 500 para R$ 527; avisar o cliente?") para uma pessoa aprovar. Hipótese: sempre cartão, porque é mexer no preço do cliente, e um aviso mal feito pode gerar briga ou invalidar a cobrança. Resposta: reajuste é sempre cartão; a regra pseudomanual-depois-automático do P1 vale para cobrança e nota, não para o reajuste.

**P4, o botão "pago".** No app o cliente pode apertar "já paguei" numa cobrança, e a régua de cobrança para de mandar lembrete. O problema: o cliente pode ter apertado sem ter pago. A dúvida é por quanto tempo o botão segura a régua até o banco confirmar o pagamento. Hipótese: 3 dias úteis; se o banco não confirmar nesse prazo, o sistema não volta a cobrar sozinho: abre uma tarefa para uma pessoa ligar ou escrever. Evita o cliente que já pagou ser cobrado de novo, e evita deixar o que mente ganhar tempo sem ninguém ver.

**P5, quem opera o financeiro.** Numa equipe, quem manda cobranças e confere os pagamentos muitas vezes é um auxiliar, não um sócio. A dúvida é se o Colaborador do setor Financeiro (esse auxiliar) pode operar cobranças e conciliação. Hipótese: sim, por exceção que o Administrador libera; mas **Resultado, remuneração e divisão entre sócios continuam só dos sócios**, porque margem e salário são assuntos deles.

**P6, taxa adiantada e nota fiscal.** O escritório às vezes paga uma taxa em nome do cliente (por exemplo, a taxa da Junta Comercial) e depois cobra do cliente. A dúvida é se esse valor entra na nota fiscal do honorário ou vai num recibo separado. A regra muda de município para município e errar altera o imposto da nota. Hipótese original: recibo separado até o contador decidir, por município, que a taxa entra na nota. Resposta: a política é configurável e a despesa vira cobrança avulsa combinável ao faturar (13.5).

**P9, o que fica para a fase 4.** Orçamento anual, comissões da equipe e divisão do resultado entre os sócios dependem de meses de números reais do escritório dentro do sistema; feitos logo no começo, viram planilhas vazias. O catálogo marcou como fase 3, o desenho propõe a fase 4. Hipótese: ligar na fase 4. Resposta: o plano fica montado desde a v1, desligado até haver dados (13.5).

### 13.5 Decisões do aval sobre as cinco perguntas (7/11/2026)

- **Reajuste (P2):** sempre cartão e aviso ao cliente no prazo do contrato. Nunca automático.
- **Botão "pago" (P4):** 3 dias úteis; sem confirmação do banco, tarefa para uma pessoa.
- **Quem opera (P5):** o acesso ao Financeiro é uma **adição nas configurações da conta do usuário** (permissão por tela, até o nível que o Administrador definir); resultado, remuneração e divisão entre sócios continuam não liberáveis por exceção.
- **Taxas e despesas adiantadas (P6):** cada despesa adiantada vira uma **cobrança avulsa** salva dentro do sistema, ligada ao cliente. No faturamento, o Financeiro vê as avulsas pendentes do cliente e **combina com o honorário** na mesma fatura, ou fatura à parte, escolhendo na tela com uma pré-visualização do total e de como cada linha vai aparecer ao cliente ("honorário de novembro R$ 500 + taxa da Junta R$ 180 = R$ 680"). A política de entrar na nota fiscal ou em recibo separado é configurável por escritório e por município.
- **Orçamento, comissões e divisão entre sócios (P9):** ficam na fase 4 para ligar, mas **o plano já fica montado desde a v1**: as telas e as estruturas existem, desligadas. Enquanto não houver dados suficientes, a planilha fica vazia e o sistema mostra "ainda não há dados suficientes para ativar", com o critério (por exemplo, 6 meses de fechamentos) e o que falta. A ativação acontece quando o critério é atendido e o Administrador liga.

### 13.6 Esclarecimentos da revisão de consistência (7/11/2026)

- **Quem executa a régua:** o integrante do **Financeiro decide e prepara** (qual cobrança, em que etapa, com que texto); o integrante de **Atendimento envia**, pelo fio da pessoa, pelo canal preferido dela (04, 7.2). O Financeiro nunca fala direto com o cliente fora desse fio.
- **Quem o integrante serve:** Administrador, Gestor e também o **Colaborador com a adição de acesso ao Financeiro**, sempre dentro do escopo dele (5 e 10.6).
- **Fase de ligação do integrante:** liga na **3a, em modo pseudomanual**: prepara o lote e a régua e entrega em cartão em lote; na 3b, com a conciliação e o caixa, ganha os gatilhos de conciliação e o modo automático.
- **Promoção para automático (P1):** a pergunta ao Administrador do 02 (3.3) **é** a confirmação do usuário; o critério (30 cartões, 95% sem edição, 90 dias) é o gatilho que faz a pergunta aparecer. Depois do "sim", `cobranca.criar` do lote recorrente com valor igual ao contrato e `nfse.emitir` passam a automáticos.
- **Botão "pago" (5.3 e 8.5):** "sem fonte de confirmação" quer dizer que **nenhuma fonte foi consultada** (escritório sem conexão bancária nem conciliação): vira tarefa para uma pessoa. "Fonte consultada sem crédito" (o extrato não mostra o pagamento) retoma a régua com aviso, como no exemplo da Empresa X.
- **Reembolso na base da NFS-e e retenções de IRRF e CSRF:** continuam **[a confirmar]**, por parecer do contador do grupo, município por município.

## 14. Adendo: decisões do UI lab (8/11/2026)

Decisões do usuário no UI lab (7/11/2026). O Financeiro foi desenhado com **quatro abas** (Contratos, Cobrança, Caixa, Resultado), com todos os fluxos e as configurações do módulo (provedor de cobrança, NFS-e, política de inadimplência, contas, plano de contas, alçadas, importação) em gavetas.

- **Decidido (U1 do 03, adendo 20; usuário, 8/11/2026): sete abas** (10.1): Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado. A opção B (as quatro do wireframe, com contas a pagar e conciliação dentro de Cobrança e Caixa) foi descartada; o UI lab acrescentou as três abas que faltavam na segunda rodada (adendo 16). `aba.financeiro.*` e a tabela 10.6 valem como estão.
- **Sem seletor de cliente:** o Financeiro é o financeiro do escritório; as listas filtram por cliente (decisão 24). O integrante do Financeiro tem orb e chat próprios e o **cartão fica no topo de cada aba** (cobranças de dezembro para aprovar, régua da Loja Bela Vista, no exemplo).
- **Fases (11):** a fase 3 fica pronta como desenho; a **primeira versão liga só Contratos** (v1 deste subplano).
- **Reajuste (4.3):** a campanha usa a rentabilidade do Timesheet para propor, acima do índice, o reajuste de quem dá prejuízo (GES-014); continua sempre cartão.
- **Contas a pagar:** o wireframe aprova e agenda; a liberação final do pagamento é feita no banco (M1 do 10), e "Transmitir" pede "conferi os valores". O Colaborador com exceção lê Contratos sem botões de edição; o wireframe chama a exceção de `aba.financeiro.honorarios`, e o identificador do plano é `aba.financeiro.contratos` (revisão 00, seção 7).

## 15. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seções 2.3, 3.0, 9 e 11.2 (A13 e A20).

- **Componente com `titular`** (`escritorio` ou `empresa`): contas a pagar e a receber, conciliação, cobrança, caixa e DRE são um componente só, da plataforma; no Financeiro do escritório o titular é o escritório; no BPO é a empresa cliente. Dados e regras **nunca cruzam titular** (F2); o `custo_hora` e `custo_hora.propor` usam **só `titular = escritorio`** (F3, 7.3).
- **Contrato único com item por serviço** e `metrica` de BPO (usa `tipo_cobranca`, `metrica` e `faixas` que já existem; a contagem vem de `bpo.contar_volume`, 10, 7.3); **uma fatura** com linhas do Contábil e do BPO (DA-02.1, regra 5) **e uma cobrança por mês**; as **notas saem por serviço** (4.5 e 5.5; adendo 17).
- **Financeiro é dependência técnica do pacote BPO** (guarda o espelho do ERP e roda a conciliação assistida) **sem cobrar o componente de novo** (F7; 10, 9.1): o valor por empresa do pacote cobre só rotinas, alçadas, fila, aprovação, perfil, conectores de ERP e IA de BPO. No modo BPO, a contagem de clientes do Financeiro são os **contratantes** (P9).
- **Com ERP do cliente (E1 e E2):** as entidades da empresa são **espelho** (`origem`, `versao_origem`) e **somente leitura** na plataforma; a escrita é comando `erp.*`; a conciliação **propõe** e a baixa vai ao ERP (E1) ou ao operador (E2); DRE e fluxo de caixa são calculados sobre o espelho. No livro próprio (E3) as entidades são nativas.
- **FIN-201 em 3c** (corrigido no corpo, 2, 11, 12.1 e 13.1): BPO financeiro depois da 3b; FIN-003, FIN-004 e CTB-008 sobem ao catálogo da plataforma, com titular.

## 16. Adendo: decisões do UI lab, segunda rodada (8/11/2026)

O UI lab desenhou o Financeiro nas **sete abas** (Visão geral, Contratos, Cobranças, Contas a pagar, Conciliação, Fluxo de caixa, Resultado; antes eram quatro, e Caixa virou Fluxo de caixa), sem seletor de cliente, e reaproveitou as peças no BPO. O corpo e os adendos 14 e 15 já trazem a decisão; aqui só o que se acrescenta.

- **Titular na tela:** as peças com titular (contas a pagar, conciliação, fluxo de caixa) mostram o **selo do titular** (escritório no Financeiro; empresa cliente no BPO) e cada linha, no BPO, tem "Abrir no ERP" (10, 3.0 e 5.2). O Financeiro continua sendo sempre o da própria empresa, inclusive no BPO puro (DA-02.1, item 10).
- **Fatura e excedente:** uma fatura só por cliente, com linhas por serviço; o excedente de lançamentos acima da faixa do BPO vira extra na fatura do escritório, com o ok de uma pessoa (10, 7.3). Honorário e excedente na mesma fatura da contabilidade: **decidido** (Q6 respondida, adendo 17).
- **Contas a pagar do Financeiro:** o wireframe aprova e agenda e a liberação final é no banco (M1); isso vale para as contas do escritório. A conferência por outra pessoa antes do lote e as alçadas em faixas são do BPO (10, 3.5 a 3.8); a invariante B3 (nenhum pagamento sem aprovação humana registrada; pagar nunca é automático) vale nos dois titulares.

## 17. Adendo: respostas finais do BPO, faturamento e suporte (8/11/2026)

Decisão do usuário em 8/11/2026 (Q6 do [10, seção 12](10-BPO.md)). O corpo (4.5 e 5.5) já traz a regra; aqui só o que se acrescenta.

- **Uma fatura por mês, notas por serviço:** o cliente que paga BPO e contabilidade recebe **uma cobrança só** (um boleto ou Pix, lançamento conjunto, uma baixa na conciliação), com os serviços em linhas separadas e o excedente do BPO como linha extra. **As diferenças ficam nas notas:** cada serviço tem a própria tributação e o próprio código de serviço, e a NFS-e sai por serviço (**uma nota por serviço**, o padrão; o **layout nacional** decide se vários itens cabem numa nota, **[a confirmar na NT 007/2026]**; `nfse_por_servico`, 5.5). Isso substitui "um boleto e uma NFS-e" onde o texto dizia assim.
- **Reflexos:** `faturamento.preparar_lote` agrupa por cliente e por serviço; a tela de Cobranças (10.4) mostra, na linha do cliente, "NFS-e 1432, 1433" quando há mais de uma; a 2ª via e o histórico do app trazem uma fatura com as notas por linha. O limite de notas do plano do integrante e o custo do integrante de NFS-e (R$ 0,49 por nota no Asaas) passam a contar **por serviço**, o que sobe pouco o custo por cliente com dois serviços (uma nota a mais por mês).
- **Suporte:** o assistente de ajuda pode diagnosticar o Financeiro **só em leitura e só pelo escopo de quem perguntou** (Fundações, adendo 26); a correção de uma cobrança ou nota errada continua cartão (FIN-011).

## 18. Adendo: últimas decisões (8/11/2026)

- **NFS-e (N1):** o layout é o nacional, o mesmo em toda a federação; onde o texto dizia "o município decide" ou "quando o município permite", vale **"o layout nacional decide"** (5.5). **Uma NFS-e por serviço** é o padrão; `nfse_por_servico` é a chave para quando o layout confirmar vários itens por nota **[a confirmar na NT 007/2026]**. A cobrança e a fatura seguem únicas, com linhas por serviço. O reembolso na base do ISS e as retenções seguem `[a confirmar]` (não são questão de layout).
- **Custo-hora (7.3):** um só, do escritório, incluindo todos os pacotes; por pacote é extra opcional, desligado por padrão; o BPO é filtro na Rentabilidade (05, adendo 19).
- **Suporte:** o assistente tem o FAQ como primeira camada (Fundações, adendo 27).

## Adendo: pacote Jurídico (9/11/2026)

Aprovado (JU-05): Contrato de honorários com `caso_id` e `tipo_cobranca` do Honorário-Jurídico; **antecipar a Regra de remuneração e a Apuração (FIN-008)** para o Jurídico; recebíveis condicionados e cenários no fluxo de caixa; Recebimento de alvará; conta de terceiros só como registro, saldo nunca negativo. Ordem: F0 a F5 do JU-05 8.2, depois do BPO.

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-23 Certificação digital como serviço | Depois | SOC-201 e GES-205 da fase 5 para a 3; 03, 6.1 (Certificados); 09 (faturamento) | Societário e Financeiro do escritório |
| C2-25 Comanda digital de serviço extra | Agora | 03, 7.2 (detalhe da tarefa: marcar extra); 05 (horas do extra); 09 (fatura, fase 3) | Do setor |
