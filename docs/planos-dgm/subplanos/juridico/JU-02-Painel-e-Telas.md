# JU-02 · Painel e telas do pacote Jurídico

**Versão 0.1 · 8/11/2026 · desenho funcional, só planejamento: nada é desenvolvido agora.** Detalha as telas do pacote sobre o esqueleto do [Subplano 03](../03-Painel.md), no padrão do item BPO ([10, seção 5](../10-BPO.md)). Fontes: [Síntese do pacote Jurídico](../../Sintese_Pacote_Juridico.md) e pesquisas J1, J2 (eLaw), J3 (234 atividades e fluxo de prazos), J7 (SGJur), J8 (matriz e candidatas FX). **[a confirmar]** marca o que as fontes não verificaram. Entidades de nome fixo: Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico. Os outros subplanos do pacote correm em paralelo (JU-01 modelo de dados e catálogo, JU-03 prazos, comunicações e conectores, JU-04 motor jurídico e base de leis, JU-05 honorários, financeiro e preço); a dependência de cada um está dita onde existe.

Convenções: wireframe em texto mostra posição e conteúdo, não proporção nem cor. `JUR-xxx` são atividades do catálogo; `SG-xxx` vêm do J7 e `FX-xxx` do J8. Níveis de ação como no 03: **preparar**, **executar com aprovação**, **executar**; o pacote acrescenta **só pessoa** (ato privativo do advogado, que o sistema não executa nem por aprovação delegada).

---

## 1. Escopo e princípios

### 1.1 O que entrega

O item lateral do pacote, suas abas e o que cada papel e perfil vê; a ficha do processo e a Home do advogado; as telas por aba com ações, estados, permissões e atividades; três wireframes críticos; os integrantes de IA e seus cartões; o destino das funcionalidades candidatas; o app do cliente; celular, tablet e marca branca. **Não entrega** o modelo de dados (JU-01), a captura e o cálculo (JU-03, JU-04), os honorários e o preço (JU-05) nem o visual, que já existe no UI lab e no design system. **Nada do visual de concorrente é copiado**; os estudos servem para funcionalidade e lógica.

### 1.2 Regras

As regras H1 a H8 do 03 valem inteiras (tudo é ferramenta; toda ação gera evento; tema por escritório; permissão por setor; agente nunca excede o usuário; texto de publicação é dado, nunca instrução; nada se apaga). Novas:

| # | Regra | Consequência na tela |
| --- | --- | --- |
| J1 | **O prazo é o centro**: das 234 atividades, 42 têm gravidade máxima, quase todas de prazo | O pacote abre pelo que vence |
| J2 | **A conta aparece inteira** (SG-003) | Toda data tem "ver a conta"; sem memória de cálculo não há botão de confirmar |
| J3 | **Quem confirma é advogado**: prazo fatal, ciência, assinatura e protocolo | Botões "só pessoa"; o integrante prepara e lembra |
| J4 | **Listar nunca dá ciência** (regra C7 do 08) | A caixa mostra o Domicílio sem abrir; abrir é cartão do titular |
| J5 | **Robô parado é evento** (FX-001) | Nenhuma tela diz "nada novo" sem a idade da última leitura |
| J6 | **Sem promessa de "zero perda de prazo"** (J2) | Texto: "o sistema calcula e avisa; você confirma" |
| J7 | **Pouca configuração para o pequeno** (J8, 7.9) | Perfil "pequeno" com padrão pronto |
| J8 | **Sigilo por caso** (hoje o isolamento é por inquilino, DA-01; FX-008) | Caso restrito some de lista, busca, chat e Timesheet para quem não foi designado; esconde, não cinza |
| J9 | **O cliente lê linguagem simples, liberada pelo advogado** | Seção 7 |
| J10 | **O que serve a mais de um pacote é da plataforma** (DA-02.1) | Sem Financeiro, CRM, Timesheet ou Arquivos dentro do item Jurídico |

---

## 2. Posição na barra e abas

### 2.1 O item lateral

**Nome sugerido: Jurídico**, equivalente de **Painel** (contábil) e **BPO**: o trabalho do pacote para o cliente (o nome que o usuário vê vem do tema, H3). "Processos", nome comum nos sistemas, foi descartado: o item cobre também mandato, peça e consultivo.

**Posição.** Depois do Início; no lugar do Painel num escritório só jurídico e depois dele quando há os dois pacotes. Estende o item 9 de DA-02.1 (pergunta 2).

```
Só jurídico                         Contábil + Jurídico
Início                              Início
Jurídico   ← trabalho do pacote     Painel      ← pacote Contábil
Clientes   ← sem Painel, ganha      Jurídico    ← pacote Jurídico
CRM · Timesheet · Arquivos          CRM · Timesheet · Arquivos
Financeiro ← o da própria empresa   Financeiro · BPO (se contratado)
Suporte · Configurações             Suporte · Configurações
```

Aparece com pacote na assinatura **e** vínculo a setor do pacote (10, 2.5). **Clientes** (Cadastro, Contatos) aparece para quem não tem Painel (10, 2.2); a ficha ganha a seção **Jurídico**: processos e casos, mandatos, checagem de conflito, termo de ciência e consentimento de IA (JUR-012, 013). Com os dois pacotes, a ficha continua em Painel › Societário, com a mesma seção.

**Seletor de cliente** por módulo: no Jurídico lista só clientes com serviço jurídico. Diferente do Contábil, o modo **Todos** é o **modo normal**: advogado trabalha por prazo e intimação, não por cliente. Prazos e Intimações abrem em Todos; Processos e a ficha, no cliente ou processo escolhido. O contexto do chat e das tarefas pode ser o **processo** aberto.

### 2.2 As sete abas do escritório pequeno

Setores fixos no pacote (DA-02, regra 2): proponho **Contencioso**, **Consultivo e Contratos** e **Controladoria**, mais os da plataforma; divisão final de JU-01 **[a confirmar]**. O vínculo ao setor decide as abas; setor desativável sem reduzir preço (10, P8).

| Aba | Título | Serve para | Atividades |
| --- | --- | --- | --- |
| **Hoje** | Hoje | Home do advogado: o que vence, chegou ou não foi lido | 044, 048, 049, 228 |
| **Processos** | Processos e casos | Lista, ficha, partes, andamentos, honorários, linha do tempo | 019, 020, 054 a 057 |
| **Prazos** | Prazos e agenda | Prazos, audiências e agenda, com a conta de cada data | 037 a 047, 052, 066, 067 |
| **Intimações** | Publicações e intimações | Caixa do DJEN e do Domicílio, triagem, saúde da captura | 032 a 036, 050, 051 |
| **Peças** | Peças e modelos | Peças, contratos e pareceres; revisão antes do protocolo | 045, 058 a 064, 085, 161 a 169, 219, 221 |
| **Mandatos** | Mandatos e procurações | Procuração, poderes, substabelecimento, assinatura | 013 a 018, 201 |
| **Controladoria** | Controladoria | Auditoria diária, calendário forense, certificados, ausências | 048, 050, 051, 218, 229 |

**Gestão** (equipe, permissões, governança da IA, compliance) é da plataforma e existe uma vez, no primeiro item de trabalho: Painel se houver; senão o Jurídico, que passa a ter oito abas como o Painel (pergunta 10).

**Por que sete e não nove.** Os sistemas dividem em Processos, Prazos e Agenda, Publicações e Intimações, Peças e Modelos, Audiências, Casos e Consultivo, Contratos e Procurações, Controladoria e Gestão. O SGJur, que atende de 1 a 15 usuários, junta caso e processo e separa prazo, publicação e controladoria (J7, 2); o eLaw Adv, para solo, tem Home, processos, caixa de publicações, agenda e financeiro (J2, T01 a T15). Mantive **prazo e intimação separados**, porque são duas filas com donos diferentes.

| Área dos sistemas | No pequeno | Por quê |
| --- | --- | --- |
| Audiências | Visão em **Prazos** | Poucas por semana; no médio vira aba |
| Casos e Consultivo | **Processos**, agrupado por Caso, filtro Contencioso ou Consultivo | Caso agrupa processos e consultas sem processo |
| Contratos e Procurações | Procuração em **Mandatos**; contrato do cliente em **Peças**; honorários no **Financeiro** | Cada coisa no seu dono (J10) |
| Gestão | Da plataforma | Não duplica |

### 2.3 O que cada perfil vê

Perfil é um **preset** de abas e widgets, sem efeito no preço (10, P8).

| Item | Pequeno (1 a 10) | Médio **[a confirmar: faixa]** | Departamento jurídico |
| --- | --- | --- | --- |
| Abas | As sete | Sete, mais **Audiências e correspondentes** | Outro conjunto: Contencioso, Consultivo, Contratos, Provisão, Escritórios externos, Poderes |
| Controladoria | Auditoria, saúde da captura, calendário, certificados | Mais metas (SG-017), distribuição e carga (FX-005), playbooks (FX-006) | Auditoria de escritórios externos (JUR-198) |
| Intimações | Caixa única, dono por inscrição | Fila "sem dono", passagem com aviso | Citações do Domicílio da empresa distribuídas (JUR-191) |
| Terceiros | Substituto convidado | Correspondente com prazo e valor (SG-028) | Escritórios externos, e-billing (JUR-207) |
| Situação | **Primeira versão** | Depois | **Só plano**: JUR-191 a 207 fora do primeiro lançamento (decisão a da Síntese; J2: sem "sprawl" enterprise) |

### 2.4 O que fica no núcleo

Simetria: **[Painel | BPO | Jurídico] + Financeiro (titular escritório) + Clientes quando não há Painel.** O Financeiro é sempre o da própria empresa (DA-02.1, item 10); o Jurídico não tem aba financeira.

| Função | Mora em | O que o Jurídico mostra |
| --- | --- | --- |
| Clientes, pessoas, parte adversa, testemunha | Plataforma (cadastro único) | Seção Jurídico na ficha; partes ligadas ao processo |
| CRM e WhatsApp | CRM | Conversa ligada ao processo; "consultar conflito antes de aceitar" no Lead (SG-030) |
| Timesheet | Timesheet | Horas por caso; chip "Pacote: Jurídico" |
| Financeiro | Financeiro (titular escritório) | Honorários em leitura na ficha; o evento gerador de êxito nasce no processo e vira lançamento lá |
| Arquivos, App | Arquivos, App | Pasta do processo com o sigilo do caso; seção "Meu processo" |

---

## 3. Ficha do processo e Home do advogado

### 3.1 Anatomia da ficha

Segue o 03 (seção 5): cabeçalho fixo e o resto em widgets arrastáveis, com arranjo padrão sem buracos e visão de carteira (lista). Hierarquia **Cliente › Caso › Processo**; o Caso reúne processos (principal, cautelar, recursos, execução) e consultas sem processo (SG-025).

| Bloco | Conteúdo | Ações (nível) |
| --- | --- | --- |
| **Cabeçalho (fixo)** | CNJ, tribunal, grau, classe, valor, fase, polo, responsável, selos de sigilo e de conflito, **idade do acompanhamento** | Editar por formulário com diferença |
| **Partes** | Autor, réu, terceiros, advogado contrário, testemunhas (mesma Parte do cadastro único) | Adicionar (executar); conflito roda ao incluir |
| **Andamentos** | Movimentos, relevantes e burocráticos (JUR-057), com a nota "andamento chega semanas depois do diário" (SG-023) | Traduzir ao cliente (preparar); enviar (com aprovação) |
| **Prazos** | Abertos e cumpridos, data legal e interna, estado, "ver a conta" | Confirmar (**só pessoa**) |
| **Audiências** | Próximas e passadas, local ou link, preposto | Roteiro (preparar); correspondente (com aprovação) |
| **Comunicações, Mandato, Peças, Documentos** | Publicações vinculadas; procuração e poderes; peças com revisor e recibo; autos e provas | Como nas abas |
| **Conversas, Tarefas** | Fio do CRM em leitura; "Tarefas deste setor" do processo | Como no 03, 2.4 |
| **Honorários, Horas** | Contrato, êxito, sucumbência, repasse (leitura do Financeiro); horas (custo só Gestor) | "Abrir no Financeiro"; evento gerador (preparar) |
| **Linha do tempo** | Tudo em ordem, com o ator (pessoa, integrante, sistema) | Filtrar |
| **Como o cliente vê** | Prévia do "Meu processo" | Liberar ou ocultar (executar) |

**Estados.** *Rascunho* (nasceu de publicação ou CNJ: "revise e confirme", zero digitação); *ativo*; *suspenso*; *arquivado*; *sem número* (nada a acompanhar, SG-023); *fora da base pública*; *segredo de justiça* (captura com regra própria, FX-008); *conflito bloqueado* (sem prazo, tarefa ou documento até o sócio decidir: liberar, liberar com ressalva e anexo, ou recusar, SG-029); *sem dono ativo*. Encerrado fica em leitura.

### 3.2 Home do advogado

É a aba **Hoje**; os mesmos widgets entram na galeria da **Início › Visão geral** (componentes, não cópias). Responde em cinco segundos "o que preciso saber hoje?" (C1 do J2).

```
┌─ Jurídico · Hoje · Dra. Ana (Colaborador · Contencioso) · Todos ─────────────┐
│ Saúde da captura                  │ Prazos hoje e semana                      │
│ DJEN OAB 123  lido há 3 h  ● em dia│ HOJE 2 fatais · 1 interno                 │
│ Domicílio Alfa: 1 citação NÃO aberta│ ■ FATAL Contestação 1234… 17h            │
│ Painel PJe TRT-2: assistido        │ ■ interno Réplica 5678… prot. 15h         │
│ Calendário forense: atualizado 02/11│ SEMANA 4 fatais · 9 internos · ⚠ 1 a conferir│
│ Intimações sem tratamento: 3       │ Audiências 7 dias                         │
│ (mais antiga: 2 d.u.) [abrir]      │ qua 15h Conciliação 9012… (link)          │
│ Sem ciência (Domicílio): 1         │ preparo: roteiro pronto, preposto?        │
│ Cartões do time (fiz · decisão)    │ Minhas tarefas · Novos processos          │
│ [C] 3 minutas, 2 prazos novos      │ 2 sem caso [incluir o meu]                │
│ Decisão: confirmar prazos [abrir]  │ Ausências: Dr. Beto até 18/11 · 0 sem dono│
└──────────────────────────────────────────────────────────────────────────────┘
```

**Regras.** (1) Nenhum cartão de captura mostra "zero" sem a idade da leitura; semáforo com **cor, rótulo e motivo** ("em dia", "atenção", "agir hoje"), como o audit score do BPO. (2) Fatal sobe; interno fica abaixo. (3) "Sem tratamento" conta dias úteis desde a captura. (4) Papéis: o Colaborador vê os próprios prazos e filas; o Gestor, carga por pessoa e o que está sem dono; o Administrador, quase perdidos, conflitos esperando decisão e ausências. (5) Vazio diz o que fazer: "última leitura do DJEN há 3 h; nada a tratar".

---

## 4. Telas por aba

Papéis: **Administrador** (sócio), **Gestor**, **Colaborador advogado** (inscrito na OAB) e **Colaborador apoio** (estagiário, secretária). A distinção exige atributo na pessoa (9.1). "Só pessoa" vale só para advogado inscrito. **Hoje** (3.2): todos veem a própria; apoio não vê fatais de processo não atribuído.

### 4.1 Processos

**Blocos.** Lista com filtros (cliente, caso, área, tribunal, responsável, fase, "sem dono", "parado além do normal", SG-043); ficha; **acervo do diário** (processos descobertos em publicações, 90 dias, SG-019); **importar carteira** (colar números CNJ, validar dígito, lote de 20, enriquecer pelo DataJud, SG-020); duplicados (JUR-218).

| Ação | Nível |
| --- | --- |
| Criar processo por CNJ ou publicação (rascunho); confirmar como ativo | executar |
| Buscar por OAB ou monitorar CPF/CNPJ do cliente (SG-021, 022) | com aprovação; custo avisado antes **[a confirmar com JU-03]** |
| Baixar autos; resumir e montar linha do tempo (JUR-055, 056) | preparar |
| Arquivar caso com prazo de guarda (JUR-029) | com aprovação |

**Permissões.** Administrador e Gestor: tudo; advogado: edita os seus; apoio: lê e edita dados. Caso restrito só aos designados. **Estados.** Vazio: "importe a carteira ou espere a primeira publicação". **Atividades.** JUR-019, 020, 029, 053 a 057, 218.

### 4.2 Prazos

**Blocos.** Lista por visão (Fatais, Internos, Audiências, Todos, Sem dono, A conferir); **detalhe** com a cadeia de contagem, a norma e o calendário; agenda com Google e Outlook (J7, 17); prazo avulso com data-base (SG-010); escada D-5, D-3, D-1 e dia (JUR-044); data interna (JUR-043); "por que a data andou" (SG-014); tópico de tempestividade (FX-002); devolução de prazo por justa causa (JUR-052).

| Ação | Nível |
| --- | --- |
| Propor prazo da intimação (ato, dias, norma, termo inicial) | preparar |
| **Confirmar prazo** | **só pessoa** |
| Pedir conferência de outro advogado; reprogramar data interna | executar (além da data legal, pede confirmação) |
| Criar tarefa da peça com checklist (JUR-045); registrar protocolo com recibo (JUR-047) | executar (protocolar é do advogado, fora do sistema) |
| Minutar devolução de prazo | preparar; envio **só pessoa** |

**Estados.** *A confirmar*; *confirmado* (a data **não muda sozinha**, SG-004); *a conferir* (fatal, dias só sugeridos, vence em menos de sete dias, SG-007); *cumprido*; *vencido sem baixa* (alerta ao sócio); *sem dono*. O número de dias traz **lido no texto** ou **sugerido pelo tipo do ato** (SG-005); "não consegui ler" nunca vira "sem prazo". Calendário ausente: aviso de que a data pode estar mais cedo, nunca mais tarde (SG-009). **Permissões.** Advogado confirma os seus e confere os de outros; apoio cria prazo avulso e tarefa, não confirma. **Atividades.** JUR-037 a 047, 052, 066, 067, 228.

### 4.3 Intimações

**Blocos.** Caixa do **DJEN** por inscrição na OAB, teor e partes, sem cota por nome (SG-001); caixa do **Domicílio** por empresa cliente, **sem abrir**; painéis em modo assistido; triagem com dono (SG-016); **saúde da captura** por fonte e credencial (FX-001); conciliação com o DataJud (JUR-051); publicação em nome errado (JUR-050). Três saídas (SG-002): **virar prazo**, **arquivar por ciência**, **nada a fazer** (ato cancelado).

| Ação | Nível |
| --- | --- |
| Vincular a processo e cliente (JUR-035); passar a outra pessoa com aviso | executar |
| Classificar o ato e propor prazo com o trecho (JUR-036, 037) | preparar |
| **Abrir e dar ciência no Domicílio** | **só pessoa**: cartão do titular, autorização expressa, expira, irreversível |
| Confirmar inscrição na OAB na fonte, com o nome (SG-015); pedir recaptura | executar |

**Saúde:** em dia; atenção (credencial, certificado a vencer, segundo fator, fonte sem resposta); agir hoje (leitura parada há mais de um dia útil: "podem faltar publicações"). **Permissões.** Administrador: tudo e credenciais; Gestor: reatribui; advogado: trata as suas; apoio: vincula, não classifica fatal. **Atividades.** JUR-032 a 036, 050, 051.

### 4.4 Peças

**Blocos.** Fila por prazo; minuta do modelo do escritório e da biblioteca de cláusulas (JUR-161, 163), com papel timbrado e versões com autor, integrante e modelo de IA (SG-037); **revisão pré-protocolo** (citações, pedidos, anexos, assinatura, preparo, JUR-219, 075); **citação conferida** contra o texto, com a contagem do descartado (SG-039); revisão de contrato em quatro lentes (SG-038); banco de teses (JUR-221); cálculos com a regra de cada linha e marcadores **[preencher]** e **[conferir precedente]** (SG-044).

| Ação | Nível |
| --- | --- |
| Minutar, pesquisar, calcular custas e valores (JUR-058 a 064, 083) | preparar |
| **Liberar para protocolo** (marca "revisada por"; sem revisor humano não chega lá, Rec. CFOAB 001/2024) | com aprovação do advogado revisor |
| Enviar ao cliente | com aprovação |
| Registrar IA e revisão por peça (JUR-234) | executar, automático |

**Permissões.** Advogado minuta e revisa; apoio prepara anexos e checklist. **Atividades.** JUR-045, 058 a 088 (por módulo, na ordem da J9), 161 a 169, 219, 221, 234.

### 4.5 Mandatos

**Blocos.** Procuração e poderes (JUR-014); substabelecimento (017); renúncia e revogação com a representação mantida pelo prazo legal (018); assinatura por ICP-Brasil, gov.br, avançada ou física (015); hipossuficiência (016); **termo de ciência e consentimento de IA** (013, SG-046); vigência. Contrato de honorários é lançado no **Financeiro**; aqui é link.

| Ação | Nível |
| --- | --- |
| Gerar procuração do cadastro | preparar |
| Enviar para assinatura no app ou provedor | com aprovação |
| Substabelecer | preparar; assinatura **só pessoa** |

**Estados.** Rascunho, enviada, assinada, vigente, vencida, revogada. **Atividades.** JUR-013 a 018, 201.

### 4.6 Controladoria

**Pequeno.** Auditoria diária: publicações sem tarefa e fatais sem dupla checagem (JUR-048); saúde da captura detalhada e validade de certificados (JUR-229); **calendário forense** por tribunal e comarca com fonte e data de cada dia e o tipo de efeito (o dia não conta; conta mas o prazo não começa nem vence; sistema fora do ar, SG-008); quase perdidos; higienização (JUR-218); **cobertura de ausência** (FX-004); regras do escritório (padrão D0 a D-5, "final x fatal", quem confere no D-1, valendo só para tarefas futuras, FX-003). **Médio, depois:** metas de triagem em três dias úteis e de prazo com um dia de folga, **sem ranking de velocidade** (SG-017); distribuição e carga (FX-005); playbooks (FX-006); jurimetria da carteira (SG-043); correspondentes (JUR-232).

Ações: confirmar quais datas móveis valem para o tribunal, religar credencial e aprovar redistribuição (**com aprovação**); gerar relatório (executar). Só Administrador e Gestor; o advogado vê a própria cobertura. **Atividades.** JUR-048 a 051, 218, 229, 230, 232.

### 4.7 Wireframe 1: Prazos e agenda

```
┌─ Jurídico · Prazos e agenda · semana 9–13/11 ▾ ───────── [Cliente ▾ | Todos] ┐
│ Captura: DJEN há 3 h ● em dia · Calendário TRT-2 atualizado 02/11 ● ok        │
│ [Fatais] Internos · Audiências · Todos · Sem dono · A conferir  [+ Prazo avulso]│
│ ● FATAL qua 02/12 Contestação 1234-56… Silva x Alfa    Dra. Ana               │
│     interno 27/11 · 15 d.u. (lido no texto) · ⚠ a conferir por outro advogado  │
│ ● FATAL sex 13/11 Embargos 5678-90… Beta  Dr. Beto (fora) SEM DONO [redistribuir]│
│ ○ interno qui 12/11 Réplica 9012-34… prot. 15h              tarefa ▸           │
├─ Detalhe: Contestação 1234-56… ──────────────────────────────────────────────┤
│ disponibilização  seg 09/11 (DJEN)                                            │
│ publicação        ter 10/11 1º dia útil seguinte (Lei 11.419, art. 4º §3º)     │
│ início da conta   qua 11/11 1º dia útil seguinte (CPC, art. 224 §3º)           │
│ prazo             15 dias úteis (CPC, art. 219) · lido no texto                │
│ não contam        20/11 feriado nacional [a confirmar] · fins de semana        │
│ vence             qua 02/12 · calendário TRT-2/SP atualizado 02/11 [ver dias]  │
│ [Ver trecho do ato] [Confirmar prazo (só você)] [Pedir conferência]            │
│ [Tópico de tempestividade ▸ preparar]     Por que a data andou: nada ainda     │
└──────────────────────────────────────────────────────────────────────────────┘
```

A conta é a ilustração de J3 (7.3); os dias de cada rito estão **[a confirmar]** por advogado e o cálculo é de JU-04.

### 4.8 Wireframe 2: Intimações

```
┌─ Jurídico · Intimações · [DJEN ▾] ───────────────────────── [integrante: C.] ┐
│ DJEN OAB 123 SP (Ana Silva ✓ na fonte) lido há 3 h              ● em dia      │
│ DJEN OAB 456 SP (Beto Lima ✓) leitura parada: titular sem acesso ● agir hoje   │
│ Domicílio Alfa Ltda: certificado vence em 12 d.                  ● atenção     │
│ Painel PJe TRT-2: assistido, sem robô                            ○ não lido    │
├─ Novas (3) · Sem dono (1) · Domicílio sem ciência (1) · Arquivadas · Sem vínculo┤
│ ● hoje   DJEN TRT-2 1234-56… Despacho "manifeste-se em 5 dias"   dono: Ana     │
│          sugestão: Manifestação · 5 d.u. · sugerido pelo tipo do ato           │
│ ● ontem  DJEN TJSP 5678-90… Sentença                             dono: Beto ⚠  │
│ ● 2 d.u. Domicílio Alfa Ltda  CITAÇÃO disponível, NÃO ABERTA                   │
├─ Detalhe ────────────────────────────────────────────────────────────────────┤
│ Teor (origem: DJEN, dado externo) ▸ trecho destacado                           │
│ [Virar prazo ▸ preparar] [Arquivar por ciência] [Nada a fazer] [Passar para…]  │
│ Domicílio: abrir faz o prazo correr. [Pedir ciência: só o titular, cartão que  │
│ expira, irreversível]                                                          │
│ Se o sistema não achou prazo, isto não quer dizer que o ato não tenha prazo.   │
└──────────────────────────────────────────────────────────────────────────────┘
```

A frase final e as marcas "lido" e "sugerido" vêm do SGJur (SG-002, 005) e viram regra de redação. A expiração do cartão é proposta **[a confirmar com 02, 6.4]**.

### 4.9 Wireframe 3: Ficha do processo

```
┌─ Processos › Silva x Alfa Ltda › 1234-56.2025.8.26.0100 ─────────────────────┐
│ TJSP 1º grau · Procedimento comum · R$ 84.500 · autor: Silva · Resp.: Dra. Ana │
│ 🔒 restrito (Ana, Beto, sócio) · conflito verificado 03/11 · andamentos há 5 h ●│
├────────────────────────────┬─────────────────────────────────────────────────┤
│ Prazos                     │ Andamentos (relevantes ▾)                        │
│ ● FATAL 02/12 Contestação  │ 09/11 Publicação: decisão inicial                │
│   [ver a conta] a conferir │ 05/11 Citação juntada                            │
│ ○ int. 27/11 protocolo     │ 28/10 Distribuído · o DataJud atrasa             │
│ Audiência 15/12 14h (link) │ [Traduzir ao cliente ▸ preparar]                 │
├────────────────────────────┼─────────────────────────────────────────────────┤
│ Partes e advogados         │ Peças                                            │
│ Autor José Silva (cliente) │ Contestação em revisão (Ana → Beto)              │
│ Réu Alfa Ltda · adv. Dr. X │ checklist 3/6 · citações conferidas 14/15        │
├────────────────────────────┼─────────────────────────────────────────────────┤
│ Mandato: vigente até 2027  │ Conversas (CRM): cliente 11/11 "chegou algo?"    │
│ Honorários (Financeiro):   │ Horas 6,5 h (faturável 6,0)                      │
│ êxito 20% · 1/3 pago       │ Linha do tempo ▸ · Como o cliente vê ▸           │
└────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 5. Integrantes de IA do pacote

### 5.1 Quem são

Um integrante por setor com equipe (02, 3), com nome e avatar do tema; o plano de IA é do usuário (DA-02.1, regra 7). Catálogo inicial: **48 "faz sozinho", 159 "prepara, pessoa conclui", 27 "organiza e lembra"**. Cada um obedece ao escopo do dono (H6).

| Integrante | Função | Faz sozinho | Prepara |
| --- | --- | --- | --- |
| **Controladoria** | Captura, conta, alerta; vigia a própria captura | 032, 035, 039, 040, 043, 044, 047 a 051, 053, 054, 057, 218, 228 | 033, 034, 036 a 038, 041, 042, 045, 052, 055, 056 |
| **Contencioso** | Peça, audiência, cálculo do processo | 019, 020, 082, 093, 221 | 058 a 060, 062 a 067, 069 a 075, 077 a 081, 083, 084, 219 |
| **Consultivo e Contratos** | Contrato, parecer, mandato | 164 a 166 | 013, 014, 016 a 018, 085, 086, 161, 162, 167 a 169 |
| **Consultor jurídico** (Legal e Cálculo, plug-ins do pacote) | Pesquisa com vigência, citação conferida, abstenção | 061, 189 | 060, 083, 095 |
| **Gestão e Atendimento** (plataforma) | Cliente no WhatsApp, andamento em linguagem simples | 001, 006, 024, 030 | 025, 026, 226 |
| **Financeiro do escritório** (plataforma) | Honorários e cobrança | 208, 213, 214, 216, 217 | 209 a 212, 215 |

### 5.2 O que nunca fazem sozinhos

| Nunca | Por quê |
| --- | --- |
| **Dar ciência no Domicílio ou abrir citação** | A ciência faz o prazo correr; irreversível (JUR-033; regra C7) |
| Confirmar prazo fatal | Ato do advogado; quatro olhos nos fatais |
| Assinar ou protocolar (JUR-046) | Ato privativo; a plataforma não guarda o certificado A3 |
| Enviar peça sem revisão registrada | Recomendação CFOAB 001/2024 |
| Aceitar acordo, aconselhar, estimar êxito ao cliente | Atividade privativa; Res. CFOAB 16/26 **[a confirmar]** |
| Repassar valor ou reter honorário do alvará (JUR-212) | Irreversível; infração ética sem cláusula |
| Liberar processo em conflito | Decisão permanente do sócio |
| Treinar ou alimentar cache global com dado de caso | Decisão B da Síntese, A como piso |

Candidatas à promoção, pelo critério do 02 (3.3): **traduzir andamento relevante por modelo aprovado** e **vincular publicação a processo**.

### 5.3 Cartões do pacote

| Cartão | Quem decide | Particularidade |
| --- | --- | --- |
| Confirmar prazo fatal | Advogado | Conta inteira; sem conta, sem botão |
| Pedir ciência no Domicílio | Titular | "Abrir faz o prazo correr"; expira |
| Cadastrar processo (rascunho) | Responsável | Em lote na importação |
| Liberar peça para protocolo | Advogado revisor | Citações conferidas e descartadas |
| Enviar andamento ao cliente | Advogado, ou automático por modelo | Prévia exata |
| Decidir conflito | Sócio | Liberar, ressalva com anexo ou recusar |
| Redistribuir por ausência | Gestor | Prazos, intimações e tarefas em lote |

### 5.4 Saúde da captura e cobertura de ausência

**Saúde (FX-001).** A Controladoria faz checagem sem modelo (02, 4.2) a cada leitura e uma vez por dia. Gera evento e alerta no sino do responsável, do Gestor e do sócio quando a leitura para (senha mudou, segundo fator, certificado vencendo, fonte sem resposta), quando **faltam publicações esperadas** pela conciliação com o DataJud ou quando o calendário forense não atualiza. O coletor do DJEN roda no Brasil (J4); falha silenciosa vira alerta.

**Ausência (FX-004).** Ao registrar férias, doença ou audiência fora (Timesheet › Equipe), o integrante propõe **um cartão em lote**: redistribuir, indicar substituto e fazer a dupla checagem do que ficou sem dono (JUR-048). Com um advogado só, o substituto é convidado temporário, com prazo de acesso e só aos casos escolhidos (modelo do SG-028); quem confere o fatal é a pergunta 5.

### 5.5 O chat

O Geral roteia ("quais prazos vencem esta semana?" devolve cartão-tabela com "ver na aba"). Contexto: cliente **ou processo aberto**. Cartões de citação mostram a **data considerada** e a vigência; sem base, **abstenção** com o que foi pesquisado. Comandos por conversa (FX-010) criam registros com confirmação, respeitam permissão e não excluem. O chat nunca confirma prazo, dá ciência nem protocola: responde "isso é com o advogado" e abre o cartão.

---

## 6. Funcionalidades candidatas

### 6.1 As que entram

| Candidata | Onde |
| --- | --- |
| SG-001, 002, 013, 015, 016 (caixa, três saídas, responsável, OAB na fonte, triagem) | Intimações |
| SG-003 a 007, 009, 014 (conta, confirmação, lido x sugerido, fatal, conferência, calendário ausente, "por que a data andou") | Prazos |
| SG-008 (calendário em camadas) | Controladoria |
| SG-010, 012, 018 (prazo avulso, escada, audiência da publicação) | Prazos; a escada com D-5 e supervisor (JUR-044) |
| SG-017, 043 (metas sem ranking, jurimetria da carteira) | Controladoria, médio |
| SG-019, 020, 022, 023, 025, 026 (acervo, importar, monitorar CPF, andamento com nota, caso 360, etapas) | Processos |
| SG-027 e FX-006 (gatilhos, playbooks); SG-028 (correspondente e substituto) | Controladoria, médio; Mandatos |
| SG-029, 030 (conflito bloqueante, consultar antes de aceitar) | Ficha do cliente e Lead do CRM |
| SG-031, 032, 033, 036, 046 (portal, fichas por área, assinatura, LGPD, consentimento de IA) | App e Mandatos |
| SG-037 a 040, 042, 044, 045 (documentos, revisão, citação, memória, precedentes, cálculo, leitura de documento) | Peças e Consultor |
| SG-048 a 053 (horas, fechamento, retainer, contrato, devedores, despesas) | **Plataforma**; a ficha só lê |
| SG-055 (Meu Dia); SG-057, 058 (permissões, duplicados) | Hoje; Gestão e Processos |
| FX-001 saúde da captura; FX-002 tempestividade; FX-003 padrão de controladoria; FX-004 ausência | Hoje, Intimações, Prazos, Controladoria |
| FX-005 distribuição; FX-007 migração e exportação; FX-008 sigilo por caso; FX-010 comandos | Controladoria; Gestão › plano mestre (GES-608) e Processos; ficha, busca e chat; chat |
| FX-009 sugestão com origem e aprendizado local | Prazos e Intimações |

**FX-009.** No lugar de "% de confiança", a tela diz **lido no texto** ou **sugerido pelo tipo do ato**, porque o percentual sugere precisão que não existe **[hipótese; pergunta 6]**. O aprendizado fica dentro do escritório, nunca entre escritórios.

### 6.2 As que não entram

| Candidata | Por quê |
| --- | --- |
| SG-021, 024 (busca por OAB e autos, pagos por crédito) | Custo imprevisível; JU-03 decide; só com custo avisado antes |
| SG-034, 035, 056 (CRM omnicanal, agente de WhatsApp, horário) | **Já são da plataforma** (04); "nunca negocia valores" vira regra do integrante |
| SG-047 e FX-011 (MCP, API) | Sem tela do pacote; são da plataforma |
| SG-054, 059, 060 (retiradas, plano por advogado, painel dos sócios) | Financeiro e preço (JU-05); o painel dos sócios está "em construção" no SGJur e não vira vitrine (J7, 5.3) |
| SG-011 (prazo do INSS) | Fase do módulo Previdenciário (J9, posição 4) |
| FX-012 (pontuação ponderada) | Risco de vigilância e de LGPD trabalhista; usa contagens |
| FX-013 a 015 (safras, cobrança em volume, marketplace) | Banca de volume; outro mercado |

---

## 7. O app do cliente jurídico

Um só app (06), com seções por serviço contratado (DA-02.1, regra 6). O cliente com serviço jurídico ganha:

| Seção | O que mostra | Regra |
| --- | --- | --- |
| **Início** | "O que falta você fazer", próxima audiência | Do que o advogado liberou |
| **Meu processo** (nova) | Linha do tempo em linguagem simples: **o que aconteceu, o que acontece agora, quando, o que precisa de você** (J8, nota a) | Só o **liberado**; por cliente, "automático para andamento relevante por modelo aprovado" ou "revisar antes" |
| **Documentos** | Pasta `Entregáveis/Jurídico`: peças protocoladas liberadas, procuração, contrato | Pasta visível (06, 5.1); comprovante de leitura |
| **Pendências** | Checklist por tipo de ação, envio por foto (SG-032) | Pedido do advogado vira pendência |
| **Honorários** | Contrato, parcelas, boleto e Pix | Do Financeiro; nunca estima êxito |
| **Agenda** | Audiências com local, link e instruções; agendar reunião | Pedido vira tarefa |
| **Assinatura** | Procuração, contrato, termo de ciência de IA | Níveis do 06 (5.5); aceite por tribunal **[a confirmar]** |
| **Conversa** | Fio único no canal que o cliente usa | Segredo de justiça e dado sensível: sem canal inseguro |

**Papéis.** A pessoa física é um papel; a empresa tem **representante legal**, **contato jurídico** e **financeiro**, ajustados por pessoa e por serviço (ajuste ao 06, 2.4).

**O que o cliente não vê:** estratégia, minutas e comentários de revisão; notas e conversas internas; risco, probabilidade de êxito e jurimetria; a data interna e a conta do prazo (no máximo "o escritório responde até"); horas, custo e rentabilidade; conflito de interesses; trilha de IA; andamento não liberado; dados de outros clientes, mesmo do mesmo grupo (grupo é rótulo, 03 3.4). Segredo de justiça só com liberação do advogado, para pessoa autorizada. Penal e família têm dados sensíveis e ficam para a fase desses módulos, com política própria **[a confirmar com JU-04]**.

---

## 8. Celular, tablet, marca branca e responsividade

| Tela | O que muda |
| --- | --- |
| Celular | Menu inferior: Hoje, Prazos, Intimações, Chat, Mais. **Um toque:** ler intimação, ver a conta, confirmar prazo (só depois de abrir "ver a conta"), pedir conferência, passar publicação, aprovar cartão, registrar protocolo com foto do recibo, abrir o link da audiência. Pedir ciência no Domicílio exige novo segundo fator. **Só no computador:** editar ficha, configurar calendário, minutar peça longa (abre em leitura com comentário curto). Escada de alertas por push, WhatsApp e e-mail |
| Tablet | Lista à esquerda, ficha ou prazo à direita; serve à audiência. O bloco de tarefas vira aba (03, 2.6) |

**Marca branca.** Nenhum nome, cor ou logotipo fixo; nomes dos integrantes do tema; semáforos com **cor, rótulo e ícone**, nunca só cor; papel timbrado e relatório ao cliente na marca do escritório. Comunicados respeitam a publicidade da advocacia (Provimento 205/2021, J3) **[a confirmar por advogado de ética]**.

**Responsividade.** A mesma grade de widgets de 2 a 8 colunas, de 390 px a ultrawide, com tamanhos P, M, G, L e XL; arranjo por usuário, separado para processo e para carteira; o arranjo padrão de Hoje fecha a grade sem buracos.

---

## 9. Ajustes, ordem de construção e perguntas

### 9.1 Ajustes pedidos

| Para | Pedido |
| --- | --- |
| **Fundações** | (1) `inscricao_oab` e papel derivado "advogado" na Pessoa; (2) visibilidade **por caso** (designados, selo, escondido em busca, chat e Timesheet; Administrador vê com evento e aviso); (3) nível **`só_pessoa`** na ferramenta, fora da promoção e de cartão delegado; (4) cartão com expiração e novo segundo fator; (5) tarefa com data legal confirmada que não muda sozinha; (6) contexto de tela pode ser **processo**; (7) pasta `Entregáveis/Jurídico`; (8) papel do cliente por serviço `juridico` |
| **02** | Integrantes e IDs da seção 5; gatilhos `comunicacao.receber`, `prazo.vencer_em_3_dias`, `captura.parada`, `ausencia.registrar`; lista "nunca" (5.2); contexto de processo no chat; cartão de citação com data considerada |
| **03** | Item do pacote na barra (2.1); seletor do Jurídico só com clientes de serviço jurídico; Todos como padrão em Prazos e Intimações; widgets do pacote na galeria da Visão geral; **Gestão** única; seção 3.5 e adendo 19 registram o pacote |
| **04** | "Consultar conflito" no Lead; conversa ligada ao processo; canal seguro para segredo de justiça; andamento em linguagem simples com histórico |
| **05** | Horas por Caso e processo; chip "Pacote: Jurídico"; fechamento de competência com reabertura registrada (SG-049); ausência na Equipe alimenta a cobertura; abrir prazo inicia o tempo |
| **06** | Seção Meu processo; papéis jurídicos por serviço; assinatura de procuração e termo de IA; Agenda com audiência; pasta Jurídico |
| **07** | Legal e Cálculo como plug-ins; cartão de citação com as três datas (fato, ato, julgamento, J5); abstenção que mostra o pesquisado; [preencher] e [conferir precedente]; o 9.2 não vale para o pacote (decisão B) |
| **08** | Saúde por fonte (última leitura, estado, motivo) lida pela tela; listar nunca dá ciência (C7); coletor do DJEN no Brasil; custo da captura por cliente |
| **09** | Honorários jurídicos lidos pela ficha; êxito, sucumbência, repasse e conta de terceiros como lançamentos com titular; boleto nasce do contrato e baixa sozinho; **sem desconto automático de imposto sem aviso** (queixa do Astrea, J8) |
| **10** | Tabela de cruzamentos com a coluna Jurídico; reaproveitar semáforo com motivo e gestão por exceção; ordem da barra; Clientes com seção Jurídico |
| **JU-01** | Setores da seção 2.2; estados da ficha (3.1); Caso como agrupador; sigilo e segredo de justiça; Prazo com data legal, interna, unidade, dias e origem do número; perfil do cliente com parte jurídica |
| **JU-03** | Saúde por fonte e credencial; eventos de leitura parada e de publicação esperada ausente; autorização para ciência; modo assistido de painel |
| **JU-04** | Memória de cálculo em passos, com norma e artigo; calendário forense com fonte e data por dia; caso de teste por rito; aviso de calendário ausente |
| **JU-05** | Honorário-Jurídico, evento gerador, retenção no alvará e conta de terceiros no Financeiro; leitura para ficha e app; preço sem pedágio por processo |

### 9.2 Ordem de construção

Nada é desenvolvido agora. Quando vier, sobre as Fundações, o 03 e JU-01, 03, 04:

| # | Etapa | Depende de | Entrega |
| --- | --- | --- | --- |
| T1 | Esqueleto e sigilo por caso | Fundações, JU-01 | Item, visibilidade por vínculo, perfil "pequeno", caso restrito |
| T2 | Processos | T1 | Lista, ficha mínima, importação por CNJ, rascunho, partes, linha do tempo |
| T3 | Prazos | T2, JU-04 | Lista, detalhe com a conta, confirmar, escada, agenda |
| T4 | Hoje | T3 | Widgets e galeria da Visão geral |
| T5 | Intimações | T2, JU-03 | Caixa do DJEN, três saídas, triagem, **saúde da captura** |
| T6 | Conferência e ausência | T3, T5 | Dupla conferência, cobertura, calendário forense |
| T7 | Mandatos e conflito | T2 | Procuração, termo de IA, varredura de conflito |
| T8 | Honorários na ficha | JU-05, 09 | Bloco em leitura e evento gerador |
| T9 | Peças | JU-04 | Revisão pré-protocolo, citação conferida, banco |
| T10 | App do cliente | 06, T2 | Meu processo, assinatura, agenda |
| T11 | Celular e tablet | T3, T5 | Menu inferior, um toque |
| T12 | Domicílio e painéis | JU-03, T5 | Ciência por cartão, modo assistido |
| T13 | Perfil médio | T6 | Audiências, correspondentes, metas |

**Validação antes de desenhar:** mostrar estes wireframes à advogada da família (20 minutos), com as perguntas do J7 (que tela mais usa, se confia no prazo calculado, que tribunais), e confirmar se o sistema dela é o **SGJur** **[a confirmar]**. As 10 contas de prazo da Síntese (9.1) validam o cálculo, não a tela.

### 9.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | Nome do item da barra | **Jurídico** | "Posso chamar o menu de Jurídico?" |
| 2 | Posição na barra | Depois do Início e do Painel, não entre Financeiro e Configurações | "O menu do jurídico fica no alto, junto do da contabilidade?" |
| 3 | Onde mora a Home do advogado | Aba **Hoje**, mais os mesmos widgets na Visão geral | "A tela de 'o que vence hoje' abre dentro do menu jurídico e também pode aparecer na página inicial?" |
| 4 | Quem confirma fatal e dá ciência | **Só advogado inscrito** | "Só o advogado confirma o prazo e dá o 'ciente'; os outros deixam pronto?" |
| 5 | Um só advogado: quem faz a segunda conferência? | Cálculo independente pelo motor, confirmação do advogado e segundo aviso no dia seguinte; colega de fora é opcional | "Se só há um advogado, o sistema confere por conta própria e você confirma; posso deixar convidar um colega de fora?" |
| 6 | "% de confiança" ou origem do número? | A origem: "lido no texto" ou "sugerido" | "Em vez de 'tenho 90% de certeza', o sistema diz se leu o número ou chutou?" |
| 7 | Ciência no Domicílio | Nunca delegável; cartão do titular que expira | "Dar ciência é sempre decisão sua, nunca do sistema?" |
| 8 | Andamento ao cliente | Automático só para andamento relevante e texto de modelo aprovado; o advogado escolhe por cliente | "Posso mandar sozinho só os andamentos importantes, com texto que você já aprovou?" |
| 9 | Perfil médio e departamento jurídico | Só plano agora; telas do pequeno primeiro | "Deixo escritório médio e departamento jurídico para depois?" |
| 10 | Onde mora a Gestão sem Painel | No Jurídico, uma só | "Se o escritório só tem o jurídico, equipe e permissões ficam dentro do menu jurídico?" |
| 11 | Metas de controladoria | Contagens e metas, sem pontos nem ranking | "O sistema mostra quantas publicações estão paradas, mas não faz placar entre pessoas?" |
| 12 | Sócio vê caso restrito? | Sim, com registro e aviso ao responsável | "O sócio pode abrir um processo restrito, mas fica registrado e o responsável é avisado?" |

## Decisões do usuário (9/11/2026)

Resposta: **segue a hipótese em todas as perguntas** (tabela de perguntas para aval acima). Ficam aprovadas como escritas.

- **Itens 1 a 12 aprovados:** item **Jurídico** na barra depois de Início e Painel; Home do advogado na aba *Hoje* (widgets também na Visão geral); andamento ao cliente automático só para andamento relevante, com texto de modelo; metas de controladoria só como contagens, sem placar; perfil médio e departamento jurídico ficam só no plano.

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
