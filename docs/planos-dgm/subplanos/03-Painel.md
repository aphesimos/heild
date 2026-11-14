# Subplano 03 · Painel

**Versão 0.1 · 7/11/2026 · documento de desenho funcional, anterior ao design visual e à escolha de stack.**

Detalha a seção 2 do [Desenho do Sistema](../Desenho_do_Sistema.md) (v0.3) sobre as entidades, permissões e ferramentas do [Subplano 01 · Fundações](01-Fundacoes.md) e sobre o chat e os integrantes do [Subplano 02 · Time de agentes](02-Time-de-Agentes.md). IDs de atividade são os do [atividades.json](../../pesquisa/plataforma/atividades.json); as abas seguem a seção 4 do [Plano da Plataforma](../Plano_Plataforma_do_Escritorio.md).

Convenções:

- Tela descrita por blocos, dados, ações, estados e regras. Sem cor, fonte, framework ou código. Wireframes em texto mostram posição e conteúdo, não proporção.
- Ferramenta entre crases (`tarefa.iniciar`) é a do catálogo das Fundações (6.5) ou pedida na seção 13.
- A primeira versão cobre as atividades de fases 0, 1 e 2 (358 das 589). O que é fase 3 a 5 aparece em cada aba como "fica para depois".
- Autonomia como no mapa: **S** (agente faz sozinho), **P** (agente prepara, pessoa conclui), **O** (agente organiza e lembra).

---

## 1. Escopo e princípios

### 1.1 O que o Painel entrega

1. A tela de trabalho da equipe: Home, onze abas, bloco de tarefas em toda aba, gaveta do chat.
2. O contexto de cliente (seletor, carteira, grupos, perfis) que abas, chat e tarefas obedecem.
3. Lista e detalhe de tarefas, com início e fim do tempo, checklist, cartão de aprovação e pendências.
4. Telas de implantação e de desligamento de cliente como conjuntos de tarefas.
5. A projeção das permissões na tela.
6. O método de validação da divisão de abas e o ponto de encaixe com o painel do Leandro.
7. As métricas de uso que alimentam o benchmark.

Não entrega: caixa de entrada e WhatsApp (04), tela de timesheet e captura externa (05), app do cliente (06), motores (07), design visual (depois do aval deste documento).

### 1.2 O que vem das Fundações

| Precisa de | Fundações | Uso no Painel |
| --- | --- | --- |
| Papéis, vínculos a setor, exceções por tela, carteira | 2.2, 3.2 | Visibilidade de abas e botões (seção 9) |
| Cliente versionado, pessoas, identidades, grupos | 4.2 a 4.5 | Seletor, cabeçalho das abas, perfis |
| Catálogo, obrigação, tarefa com máquina de estados | 4.6 a 4.8 | Calendário, bloco de tarefas, detalhe |
| Documento e pastas visíveis ao cliente | 4.11, 7.8 | Bloco de documentos de cada aba |
| Conversa e mensagem | 4.10 | Aba Atendimento (04) e conversa ligada à tarefa |
| Sessão de trabalho e inatividade | 2.5, 5.4 | Iniciar e concluir; modo de espera (só com cliente aberto) |
| Ferramentas, quatro portas, cartão de aprovação | 6.1 a 6.4 | Todo botão é ferramenta; o cartão aparece na Home, na tarefa e no chat |
| Notificações | 8 | Sino; bloco de avisos da Home |
| Integrantes (entidades) | 9 | Integrante dentro da aba; gaveta |
| Tema | 10 | Logotipo, nome do produto, cores, nomes dos integrantes |

### 1.3 Regras herdadas

| # | Regra | Consequência na tela |
| --- | --- | --- |
| H1 | Tudo é ferramenta | Cada tela é declarada como lista de ferramentas (Fundações 6.2); tela que precisa de dado sem ferramenta é defeito de catálogo; o botão mostra o nível do contrato |
| H2 | Toda ação gera evento | Não há edição silenciosa; o que a tela faz aparece na linha do tempo e no timesheet |
| H3 | Tema por escritório | Nenhum nome, cor ou logotipo fixo; integrantes com nome do tema; o usuário vê `nome_produto`, nunca "Painel" |
| H4 | Permissão por setor e por tela | A tela esconde o que o usuário não pode (seção 9) |
| H5 | Inatividade de 2 a 5 min (decisão de 7/11/2026: sem logout) | Só nas telas que registram tempo (Painel com cliente aberto e CRM, menos Números): sem evento por `inatividade_min`, a tela entra em modo de espera, a sessão de trabalho encerra no último evento e "Continuar" abre sessão nova sem pedir senha; a tarefa aberta continua; mouse não conta, navegar e clicar contam. Início, Painel na carteira, Timesheet, Financeiro e Configurações não entram em espera |
| H6 | Agente nunca excede o usuário | O integrante dentro da aba só mostra e faz o que o dono pode; o cartão lista quem pode aprovar |
| H7 | Conteúdo externo é dado | Texto de cliente, e-mail ou documento aparece com a origem marcada, nunca como instrução |
| H8 | Nada se apaga | Não há "excluir"; há desativar, cancelar com motivo, fundir |

---

## 2. Esqueleto da tela

### 2.0 Decisão de navegação (7/11/2026): barra lateral com módulos, abas internas dentro de cada módulo

O usuário enviou o esqueleto do design geral (Figma) e o UI lab o confirmou em 7/11/2026 (decisão 1 do UI lab): vale o seguinte, que muda a seção 2 e a 6: **as onze abas não ficam no mesmo lugar.** A navegação principal é uma **barra lateral à esquerda, expansível** (abre e fecha, com animação e texto), com os módulos e Configurações no pé; cada módulo tem, quando precisa, **abas internas em cima, centralizadas** (controle segmentado); cliente selecionado e sino ficam no canto direito.

```
┌───────────┬─────────────────────────────────────────────────────────┐
│ Início    │  [Cliente ▾ | Todos]  (por módulo)         🔔  conta     │
│ Painel    │ ┌─ abas internas do módulo, centralizadas ───────────┐   │
│ CRM       │ │ Societário · Obrigações · Notas · Fiscal · DP ·    │   │
│ Timesheet │ │ Contábil · Consultoria · Gestão                    │   │
│ Arquivos  │ └────────────────────────────────────────────────────┘   │
│ Financeiro│                                                          │
│ BPO       │   conteúdo da tela                    ┃ chat (gaveta)    │
│ ───────── │                                                          │
│ Suporte   │                                                          │
│ ⚙ Config  │                                                          │
└───────────┴─────────────────────────────────────────────────────────┘
```

Cada item aparece só se o pacote ou o módulo está na assinatura **e** o usuário tem o vínculo (Painel: pacote Contábil e setor contábil; BPO: pacote BPO financeiro, módulo ligado em Configurações › Assinatura e setor `bpo_financeiro`; Financeiro: Administrador e Gestor com o setor). No BPO puro (C1) não há Painel e entra o item **Clientes** (10, 2.2).

| Lateral | Abas internas | Corresponde a |
| --- | --- | --- |
| **Início** | **Assistente** (chat Geral, abre aqui) · **Time** (chat dos integrantes, lista à esquerda) · **Visão geral** (a Home da seção 4, em widgets) | Home e 02, 9 |
| **Painel** (**só existe para quem tem setor contábil**; quem é só do BPO não o vê) | **Societário · Obrigações · Notas · Fiscal · DP · Contábil · Consultoria · Gestão** (oito; a aba mostra o nome curto e o título da tela, o completo da seção 6: "Clientes e Societário", "Obrigações e Prazos", "Notas fiscais", "Trabalhista e DP", "Consultoria e Reforma"). **Obrigações é aba própria**: com cliente, a agenda de todas as áreas dele; na carteira, a semana por cliente | Seções 6.1 a 6.7 e 6.9 |
| **CRM** | Conversas · Leads · Comunicados · Números | Seção 6.10 e subplano 04 |
| **Timesheet** | Meu tempo · Equipe · Rentabilidade · Confirmações (ordem do 05, 8.1; o UI lab desenhou Meu tempo · Confirmações · Equipe · Rentabilidade, U5) | Seção 6.11 e subplano 05 |
| **Arquivos** (módulo da plataforma, decidido em 8/11/2026) | Árvore do armazenamento por cliente e visualizador na marca do escritório; sem abas | Fundações 7 |
| **Financeiro** (o da própria empresa) | **Sete abas, decidido em 8/11/2026** (09, 10.1; desenhadas pelo UI lab na segunda rodada): Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado | Seção 6.8 |
| **BPO** (pacote BPO financeiro; é o trabalho do pacote para o cliente, como o Painel) | Nove abas, com nome curto: Visão geral · Carteira · Fila · Rotinas · Aprovações · Entregas · Volume · Rentabilidade · Configuração (10, 5.2; o Colaborador vê seis, o Gestor do BPO oito, o Administrador nove) | Subplano 10 |
| **Suporte** (todo usuário; no pé da barra, acima de Configurações, e atalho no menu do usuário) | **Ajuda do sistema** (assistente, 30 perguntas por mês, fora do limite de IA; diagnostica em leitura, pelo escopo de quem pergunta) · **Falar com a equipe** (chat com pessoas, com fila e aviso fora do horário) · **Histórico**; ao esgotar as perguntas, a Ajuda encaminha à equipe | Desenho 1.10; Fundações, adendos 24 e 25 |
| **Configurações** (só Administrador) | Escritório · Usuários e setores · Armazenamento · Tema · Integrantes · Assinatura | Fundações |

**Seletor de cliente por módulo.** O cliente selecionado (canto direito) é contexto de cada módulo: **no Painel lista só as empresas da contabilidade**; **no BPO, só as empresas de BPO** (a empresa só de BPO não aparece no Painel, e a só contábil não aparece no BPO); **some no CRM, no Financeiro e em Configurações**, onde as listas filtram por cliente (decisões 18, 23 e 24 do UI lab). Em Início, Timesheet e Arquivos segue o contexto global.

O que não muda: bloco "Tarefas deste setor" em cada aba interna do Painel (U3 segue aberta), gaveta do chat em qualquer lugar, permissões por setor escondendo abas internas e itens laterais. Gestão fica como aba interna do Painel e Configurações ganha as seis abas do quadro. As seções 2.3 e 6 abaixo descrevem as abas como conteúdo; a posição delas é a desta tabela.

### 2.1 Visão geral

```
┌─ Barra superior ──────────────────────────────────────────────────────────────┐
│ [logotipo·nome_produto] [Escritório ▾]  [Cliente: Empresa X ▾ | Todos]  [🔍]  🔔(3)  [conta ▾] │
├─ Navegação ───────────┬───────────────────────────────────────────┬─ Gaveta ──┤
│ Home                  │                                           │ (fechada) │
│ Clientes e Societário │  Área de conteúdo da aba                  │  Chat ▸   │
│ Obrigações e Prazos   │  (no contexto do cliente ou da carteira)  │           │
│ Notas fiscais         │                                           │           │
│ Fiscal                │  ┌─ Tarefas deste setor ───────────────┐  │           │
│ Trabalhista e DP      │  │ [filtros: responsável, status, mês] │  │           │
│ Contábil              │  │ lista de tarefas do setor           │  │           │
│ Consultoria e Reforma │  └─────────────────────────────────────┘  │           │
│ Financeiro do escrit. │                                           │           │
│ Gestão                │                                           │           │
│ Atendimento           │                                           │           │
│ Timesheet             │                                           │           │
└───────────────────────┴───────────────────────────────────────────┴───────────┘
```

### 2.2 Barra superior

| Elemento | Dados e ações | Regras |
| --- | --- | --- |
| Logotipo e nome do produto | Do tema; volta à Home | Nunca fixo no código |
| Escritório | Nome; no modo BPO, subinquilinos visíveis; trocar de contexto (mãe ou contratante, só dentro do `escopo_mae`) | Trocar de contexto não pede novo login (`sessao.trocar_contexto`, com evento); o tema muda junto |
| Cliente selecionado | Nome, documento, situação do ciclo, regime; abre o seletor (seção 3) | Persiste em `usuario.preferencias` |
| Modo "Todos" | Rótulo "Carteira" com contagem; um clique alterna | Visão de carteira em todas as abas |
| Busca global | Cliente, pessoa, tarefa, documento, conversa, só no escopo; resultado agrupado por tipo; clicar leva à aba certa no cliente certo | `busca.global` (seção 13) |
| Sino | Não lidas `alta` e `urgente`; abre a central por categoria; cartões de aprovação com sim / editar / não | Mesmo registro da Home e do chat |
| Conta | Nome, papel, setores (só leitura); **Minha conta** (preferências de aviso, canais e resumo diário; senha, segundo fator e sessões abertas; o segundo fator obrigatório aparece travado com o motivo); tema claro ou escuro; sair | Papel e setores são editados pelo Administrador em Gestão |

### 2.3 Navegação por abas

Lista fixa e na mesma ordem para todo escritório (decisão de 7/11/2026: setores fixos iguais às abas). O escritório renomeia a exibição, não a ordem nem o conjunto. Os nomes da tabela são os dos títulos de tela; a aba mostra o nome curto, e Home, Financeiro do escritório, Atendimento e Timesheet são itens laterais ou abas de outros módulos (2.0).

| Aba | Setor do catálogo | Quem vê |
| --- | --- | --- |
| Home | todos | Todos |
| Clientes e Societário | `societario` | Vínculo ao setor, Gestor, Administrador |
| Obrigações e Prazos | `fiscal` (projeção das obrigações de todos os setores) | Quem tem setor com equipe; filtrada pelos setores do usuário |
| Notas fiscais | `notas` | Vínculo ao setor |
| Fiscal | `fiscal` | Vínculo ao setor |
| Trabalhista e DP | `dp` | Vínculo ao setor |
| Contábil | `contabil` | Vínculo ao setor |
| Consultoria e Reforma | `consultoria` | Vínculo ao setor; perguntar ao Consultor existe para todos pelo chat |
| Financeiro do escritório | `financeiro_escritorio` | Administrador e Gestor com o setor |
| Gestão | `gestao_atendimento` (modo gestão) | Administrador; Gestor nos setores que gere |
| Atendimento | `gestao_atendimento` e qualquer setor com número | Quem tem setor com número (04) |
| Timesheet | transversal | Administrador e Gestor veem a equipe; Colaborador vê o próprio (ajuste A12) |

Regras: aba de setor que o usuário não tem não aparece (não fica cinza); módulo fora da assinatura não aparece e a busca não devolve o tipo; aba e cliente formam a URL, para que um link cole o destinatário na mesma tela se ele puder vê-la; cada aba mostra um contador discreto de tarefas atrasadas do setor para o cliente (ou carteira), e zero não mostra nada.

### 2.4 Bloco "Tarefas deste setor"

O mesmo componente em todas as abas, no rodapé da área de conteúdo em tela larga, colapsável:

```
┌─ Tarefas deste setor · Fiscal · Empresa X ─────────────────────────────────┐
│ [Responsável: todos ▾] [Status: abertas ▾] [Competência: 2026-11 ▾] [+ Nova] │
│ ● Transmitir PGDAS-D 10/2026   FIS-009  prazo 20/11  João (agente)  ▸ cartão │
│ ● Conferir DCTFWeb 10/2026     FIS-019  prazo 30/11  Fulano   em andamento   │
│ ○ Enviar DAS 11/2026           FIS-010  prazo 20/12  —        a fazer        │
│ ⏸ Responder intimação 1234     FIS-038  prazo 18/11  Fulano   aguard. cliente (3 d) │
└───────────────────────────────────────────────────────────────────────────┘
```

Dados: `tarefa.listar(setor, cliente ou carteira, status, competência, responsável)`; é o dado do calendário da Home filtrado pelo setor. Ações: abrir, iniciar, nova tarefa (só com atividade do catálogo), reatribuir (Gestor). Estados: vazio ("nenhuma tarefa aberta deste setor para este cliente"), carteira (50 mais urgentes com "ver todas"), atrasada, aguardando cliente com dias, responsável integrante com ícone e cartão pendente. O filtro fica em `usuario.preferencias` por aba.

### 2.5 Gaveta do chat

Abre pela borda direita em qualquer aba, sempre no **Geral** (decisão de 7/11/2026).

```
┌─ Chat ──────────────────────────────────────────┬──────┐
│ Geral · contexto: Empresa X                     │ [G]  │ ← Geral
│ Você: quais clientes do Simples ainda não       │ [F]  │ ← Fiscal (João)
│       transmitiram o PGDAS-D?                   │ [D]  │ ← DP (Ana)
│ Geral: [Tabela · 14 clientes · ver na aba ▸]    │ [C]  │ ← Contábil
│ Encaminhei para Fiscal (João) ▸                 │ [S]  │ ← Societário
│   João: "Preparei 14 cartões em lote" [sim/editar/não] │ [K]  │ ← Consultor
│ [ escreva aqui                             ] ▶  │ [+]  │ ← criar integrante
└─────────────────────────────────────────────────┴──────┘
```

- Ícones à direita: um por integrante do usuário (setores que tem, Consultor, criados por ele); ponto no ícone indica cartão pendente ou trabalho em andamento. Clicar abre o chat daquele integrante com o histórico dele; acima da caixa, o que ele está fazendo e os cartões pendentes (02, 9.2).
- O cliente selecionado é o contexto; trocar o cliente faz o chat avisar "agora falando da Empresa Y".
- Todo cartão (tabela, documento, guia, cálculo, citação, pré-visualização, aprovação, encaminhamento, tarefa) tem "ver na aba": abre a aba certa no cliente certo com o filtro aplicado.
- Largura fixa em tela larga; cobre o conteúdo em tela média; tela inteira em celular.

### 2.6 Celular e tablet

| Tela | O que muda |
| --- | --- |
| Larga | Como no esqueleto |
| Média (tablet) | Navegação vira ícones; gaveta cobre o conteúdo; o bloco de tarefas vira aba interna no topo ("Dados · Pendências · Documentos · Tarefas") |
| Estreita (celular) | Barra reduzida (cliente e sino); menu inferior com Home, Tarefas, Pendências, Chat, Mais; abas de setor em modo leitura com ações de um toque (iniciar, concluir, aprovar, cobrar); calendário só dia e semana; sem arrastar, com botão "reprogramar" |

Regra: o que é decisão (aprovar, concluir, cobrar, responder) cabe em um toque; configuração e edição de dados ficam para a tela larga, com aviso "edite no computador".

---

## 3. Contexto de cliente

### 3.1 Seletor

```
┌─ Cliente ───────────────────────────────────────────────┐
│ [🔍 nome, CNPJ, apelido, código no core            ]     │
│ ★ Favoritos    Empresa X · Padaria Y · Loja Z           │
│ ⟲ Recentes     Empresa X (há 2 min) · Clínica W (ontem) │
│ Empresa X Ltda   12.345.678/0001-90   Simples · SP · ativo │
│ Empresa X Filial 12.345.678/0002-71   (grupo: Grupo X)  │
│ [Todos (carteira: 87 clientes)]                         │
└─────────────────────────────────────────────────────────┘
```

Dados de `cliente.listar(predicado)` com o escopo da sessão: documento, regime, UF, situação, grupo. Busca por nome, nome fantasia, CNPJ ou CPF com ou sem pontuação, código no core, apelido. Favoritos (até 10) e recentes (10 últimos, por dispositivo) em `usuario.preferencias`. Atalho de teclado de qualquer tela.

### 3.2 Persistência e troca

- Persiste entre sessões; no primeiro acesso o padrão é **Todos**.
- O seletor é por módulo (2.0): não aparece no CRM, no Financeiro nem em Configurações (do escritório; as listas filtram por cliente); no BPO lista só as empresas de BPO e, no Painel, só as da contabilidade.
- Trocar o cliente troca o conteúdo das abas, o bloco de tarefas, o contexto do chat, os cartões mostrados (os do cliente sobem; os demais ficam na central) e a linha do tempo. Não troca a aba ativa, os filtros nem a gaveta.
- Abrir uma tarefa de outro cliente (link, busca, notificação) troca o cliente, com aviso de uma linha.
- Cliente que sai do escopo volta para Todos no próximo carregamento, com aviso.

### 3.3 Visão de carteira ("Todos")

| Bloco da aba | Em um cliente | Em "Todos" |
| --- | --- | --- |
| Cabeçalho | Perfil relevante à aba | Contagens da carteira (por regime, situação) |
| Pendências | Itens que o cliente deve | Cliente × itens × dias, ordenado por dias |
| Dados e capturas | Os dele | Uma linha por cliente com as colunas que a aba define |
| Documentos | Pastas dele | Oculto |
| Ações | Botões do cliente | Só ações em lote (gerar calendário, cobrar, cartões em lote) |
| Tarefas e relatórios | Do cliente | Da carteira, com filtro por cliente |

Com `escritorio.carteira_ligada`, "Todos" é "todos os meus".

### 3.4 Grupos econômicos

Selecionar um grupo (CIC-009) seleciona as empresas como conjunto; o seletor mostra o grupo como entrada própria. Pendências e tarefas aparecem por empresa; `consolidar_pendencias` junta a cobrança no `cliente_principal`. Grupo é rótulo, não permissão: a tela diz "2 de 4 empresas visíveis".

### 3.5 Perfis que alteram as abas

Pessoa física, terceiro setor e nichos são setores de perfil (Fundações 4.1), lidos do perfil vigente; o BPO **não** é perfil sem equipe: é pacote de área (BPO financeiro) e modo da plataforma, com item lateral próprio (subplano 10, 2.2). A aba continua a mesma; os blocos mudam.

| Perfil | A tela sabe por | O que muda |
| --- | --- | --- |
| Pessoa física (PF-001) | `cliente.tipo` | Fiscal mostra IRPF (PF-003 a PF-011), carnê-leão (PF-013, PF-014), ganho de capital e renda variável (PF-015 a PF-017); Notas e DP vazias com explicação; Contábil mostra livro-caixa; Obrigações usa as de PF |
| MEI | `regime = mei` | Fiscal: FIS-016, FIS-017, FIS-018, limite pelas notas; Societário: SOC-032 |
| Terceiro setor, nicho por CNAE | `perfis_especiais` | Fase 5 (TS-001 a TS-027, NIC-001 a NIC-030); na primeira versão só o rótulo e as obrigações do calendário |
| BPO (subinquilino) | Sessão | A equipe do BPO vê o Painel com a marca do contratante (BPO-007); fila compartilhada (BPO-009, BPO-010) e conversa na tarefa (BPO-022) são a mesma lista de tarefas com o campo "contratante" |
| Ciclo de vida | `estado_ciclo` | `em_implantacao`, `em_saida`, `em_baixa` põem a faixa de trilha em toda aba (seção 8); `inativo` e `encerrado` deixam as abas só leitura |

---

## 4. Home

**Decisão do UI lab (7/11/2026):** a Home é a aba **Visão geral** do item Início (as outras duas abas são Assistente e Time, 02, 9); o Início **abre no Assistente**. Os blocos de 4.1 são **widgets** de uma grade personalizável (4.3).

### 4.1 Blocos

```
┌─ Home · Fulano (Colaborador · Fiscal, Notas) · Empresa X ───────────────────────┐
│ ┌─ Avisos do time (desde ontem 18h) ──────────┐ ┌─ Indicadores · Fiscal ───────┐ │
│ │ [F] Fiz: PGDAS-D de 14 clientes preparado   │ │ atrasadas 3 · vencem hoje 2  │ │
│ │     Decisão: 14 cartões em lote [sim/editar/não] │ │ entregues 41/58 · sem resp. 5 │ │
│ │ [S] Info: Empresa X ficou inapta ontem ▸ tarefa │ │ horas semana 31h (est. 4h)   │ │
│ └─────────────────────────────────────────────┘ └──────────────────────────────┘ │
│ ┌─ Calendário · [dia] [semana] [mês] · [resp.: eu ▾] · cor por setor ───────────┐ │
│ │ seg 16    ter 17     qua 18        qui 19      sex 20                        │ │
│ │ ■ FIS-010 ■ DP-018   ■ FIS-038 (!) ■ CTB-028    ■ FIS-009 ×14               │ │
│ └──────────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ Pendências por cliente (CTB-201) ──────────┐ ┌─ Linha do tempo · Empresa X ─┐ │
│ │ Empresa X  extrato Itaú 10/26 · 6 d · 2 cobr. [cobrar] │ │ 10:42 NF-e recebida (agente) │ │
│ │ Padaria Y  folha de ponto · 3 d · 1 cobr.  [cobrar]    │ │ 09:15 FIS-019 concluída      │ │
│ └─────────────────────────────────────────────┘ └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Calendário** (estilo Hubstrom TaskHub). Dados: `tarefa.listar` do escopo no período; obrigações iguais em muitos clientes aparecem agrupadas ("PGDAS-D × 14") e abrem a lista. Ações: clicar abre a tarefa; **arrastar reprograma o `prazo_interno`** por `tarefa.reprogramar` (seção 13); o `prazo_legal` nunca é arrastado, o item mostra os dois quando diferem, e arrastar além do legal pede confirmação com a multa estimada (M3, FIS-040). Filtros: responsável (eu, equipe, agente, todos), setor (cor), status, só atrasadas. Padrão: semana, "eu" para Colaborador, "equipe" para Gestor. Feriados e prorrogações (FIS-002) marcam o dia; o futuro muda com o perfil, o passado fica.

**Pendências por cliente** (CTB-201). Dados: `pendencia.listar` (tarefas `aguardando_cliente`, itens, dias, cobranças). Ações: **cobrar** (`conversa.cobrar_pendencias`, executar, irreversível, com pré-visualização do texto da régua e do canal), **marcar recebida**, abrir a tarefa. Item enviado pelo app baixa sozinho e aparece "recebido pelo app".

**Avisos e cartões dos integrantes.** Notificações `agente` e `aprovacao` desde o último acesso, por integrante, com os três blocos do 02 (**fiz**, **decisão**, **informação**); cartões em lote como um cartão com contagem. Ações: sim / editar / não (`aprovacao.decidir`, `aprovacao.decidir_lote`), abrir a tarefa, abrir o chat do integrante. Passagens entre integrantes aparecem como linha ("Fiscal (João, de Fulano) passou Sublimite da Empresa X para DP (Ana, de Beltrano)"). Cartão a menos de 12 h de expirar vem urgente; decidido em qualquer lugar some daqui.

**Indicadores.** Colaborador: do seu setor e das suas tarefas (atrasadas, vencem hoje, entregues × pendentes, conversas sem resposta, horas da semana com a parte estimada). Gestor: do setor com quebra por pessoa. Administrador: do escritório por setor. Dados de `indicador.listar` (seção 13); cada número leva à lista.

**Linha do tempo.** `evento.listar(cliente)` com `visivel_na_linha_do_tempo`, últimos 30, com ator (pessoa, integrante e dono, sistema, core). Em "Todos", últimos eventos da carteira por setor.

### 4.2 Variação por papel

| Papel | Ordem padrão dos blocos | Não aparece |
| --- | --- | --- |
| Colaborador | Avisos, calendário (eu), pendências dos meus clientes, indicadores do setor, linha do tempo | Quebra por pessoa, custo |
| Gestor | Avisos (inclui os que pedem decisão dele), calendário (equipe), pendências do setor, indicadores por pessoa, linha do tempo | Rentabilidade e custo-hora (fase 3) |
| Administrador | Indicadores do escritório, avisos, calendário agrupado, pendências, linha do tempo, implantações em andamento | — |

### 4.3 Configuração e estados vazios

Ordem, tamanho e presença dos widgets em `usuario.preferencias.blocos_home` (a grade da Visão geral) e, para cada aba do Painel, em preferências por tela, **separadas para cliente e para carteira**; tamanhos fixos (P, M, G, L, XL), arrastar, mudar tamanho, esconder, galeria para adicionar e reset para o padrão do papel. Cada widget só oferece os tamanhos em que o conteúdo cabe inteiro; o arranjo padrão fecha a grade sem espaços vazios. Mesma regra para os blocos C e G de cada aba (seção 5). Estado vazio diz o que fazer: calendário ("nenhuma tarefa nesta semana; gere o calendário de dezembro em Obrigações e Prazos"), pendências ("nenhum cliente deve documento"), avisos ("o time não teve nada a dizer desde ontem"), linha do tempo em Todos ("selecione um cliente"). Escritório recém-aberto mostra a faixa "primeiros passos" (importar clientes, conectar armazenamento, convidar equipe, campanha SOC-014/SOC-011) até cumprir os critérios de saída da fase 0 (L2, 3).

---

## 5. Anatomia de uma aba

Toda aba de setor repete a mesma estrutura, na mesma ordem.

```
┌─ [Aba] · Empresa X ─────────────────────────────────────────────────────────────┐
│ A. Cabeçalho: perfil relevante à aba · integrante do setor · situação            │
├──────────────────────────┬───────────────────────────────────────────────────────┤
│ B. Pendências do setor   │ C. Dados e capturas (blocos específicos da aba)       │
├──────────────────────────┴───────────────────────────────────────────────────────┤
│ D. Documentos da aba (por competência; marca de pasta visível ao cliente)        │
│ E. Ações  [preparar ▸] [executar com aprovação ▸] [executar ▸]                   │
│ F. Tarefas deste setor (bloco fixo, 2.4)                                         │
│ G. Relatórios da aba                                                             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**A. Cabeçalho.** Campos do perfil vigente que importam ao setor (Fiscal: regime, UF, inscrições, sublimite; DP: empregados, sindicato, data-base; Contábil: contas, o que deve chegar), data de vigência e link "histórico" (`cliente.perfil_em`). Ao lado, o **integrante do setor** do usuário: avatar e nome do tema, o que está fazendo para este cliente (`integrante.status`, seção 13) e "falar com [nome]", que abre a gaveta no chat dele. Responsável diferente do padrão do setor aparece aqui.

**B. Pendências do setor.** Do cliente (`pendencia.listar` pelo setor) e de terceiros (`aguardando_terceiro` com órgão). Cada item: o que falta, desde quando, cobranças, botões cobrar e marcar recebida.

**C. Dados e capturas.** Blocos da seção 6. Dado capturado carrega origem e data; digitado carrega quem. Nada se edita no lugar: editar abre o formulário da ferramenta, com o diff antes de gravar.

**D. Documentos.** `documento.listar(cliente, tipos da aba, competência)` por competência e tipo. Cada um: nome, tipo, competência, origem, quem enviou, hash curto e a **marca "visível no app"** com a pasta de origem (Fundações 7.8). Ações: abrir (gera `visto`), enviar ao cliente (cartão de aprovação), mover (`documento.classificar`), forçar visível ou oculto por arquivo (registra quem), ver registro de entrega. Arquivo da nuvem sem `enviado_por` aparece na fila "confirmar origem".

**E. Ações.** O rótulo traz o nível do contrato, sem exceção:

| Nível | Rótulo | Ao clicar |
| --- | --- | --- |
| rascunhar | **preparar** | Gera o rascunho e mostra para editar; nada sai |
| executar com `exige_aprovacao` ou `irreversivel` | **executar com aprovação** | Abre o cartão com `resumo_humano`; o usuário aprova se tem o nível, senão vai a quem pode |
| executar sem aprovação | **executar** | Executa e mostra resultado e evento |

Botão que o usuário não pode chamar não aparece. Ação em carteira mostra "N clientes" e gera um cartão por cliente, em lote.

**G. Relatórios.** Cada aba cuida dos seus; Gestão consolida (decisão de 7/11/2026). Formato comum: filtros (período, cliente ou carteira, responsável), tabela com totais, exportar (CSV e PDF com o tema), agendar envio (vira job do integrante). `relatorio.gerar` (seção 13).

**O integrante dentro da aba** aparece em três lugares: no cabeçalho; nos itens que criou ou tocou ("feito por João, de Fulano", com link ao evento); nos cartões pendentes dele para o cliente, no topo das ações. Não tem área própria; é visível pelo que fez.

---

## 6. As abas, uma a uma

Para cada aba: objetivo, blocos específicos com as atividades cobertas (fases 0 a 2, IDs), dados e ações, estados e regras, o que fica para depois. Contagens do script sobre o `atividades.json` (7/11/2026).

### 6.1 Clientes e Societário

**Objetivo.** A base de tudo (SOC-001 é pré-requisito de 576 atividades): cliente, pessoas, acessos ao governo, certificados, contratos, legalização. **Cobertura:** 50 atividades de fases 0 a 2, mais as 8 do ciclo de vida (CIC).

| Bloco | Atividades | Dados e ações |
| --- | --- | --- |
| Ficha e perfil temporal | SOC-001, 002, 003, 034 (S); SOC-005, 006 (P) | Versão vigente com data e linha de versões; divergência Receita × cadastro. Cadastrar pelo CNPJ (executar); versionar perfil (executar com aprovação, regera o calendário); corrigir digitação; perfil em data |
| Pessoas e identidades | SOC-004 (S), GES-041 (P) | Sócios, contatos por assunto, telefones, e-mails, papel no app, opt-in. Adicionar, religar identidade, convidar para o app, definir quem vê o quê |
| Acessos e procurações | SOC-011, 013, 014, PF-002 (O); SOC-012, FIS-007 (S); DP-042 (P) | Painel de autorizações: órgão, serviço, validade, situação (confirmada, pedida, vencida). Pedir ao cliente pela régua; confirmar no portal; registrar procuração fora da RFB |
| Certificados | SOC-008, 009, 010, GES-058 (S) | Tipo, validade, serviços, trilha de uso. Pedir A1 pelo app, registrar A3, ver trilha; nunca mostra o arquivo |
| Contratos e honorários | SOC-015, 016, 019, 020, 101, FIN-001 (P) | Proposta, contrato, cláusulas mínimas, termo LGPD, PLD, honorário. Gerar proposta e contrato (preparar); enviar para assinatura (executar com aprovação) |
| Legalização e processos | SOC-025 a 031, 033, 035, 041 a 043, 032, 105 (P); SOC-036 a 040, 109 (O) | Processos por órgão, exigências, licenças com validade, atas, livros. Abrir processo (tarefa com checklist por UF); registrar andamento; calendário de renovações |
| Comunicações oficiais e calendário | SOC-007, SOC-046 (S) | Domicílio Judicial (cadastro, última leitura, citações); calendário do setor = calendário da Home filtrado |
| Ciclo de vida | CIC-001 (S); CIC-002, 003, 004, 007, 009, 010 (P); CIC-006 (O); SOC-021 a 024, 102 a 104, 106 a 108 | Estado, trilha, marcos. Mudar estado (executar com aprovação, Gestor); ver trilha (seção 8) |

**Estados e regras.** `prospect` e `proposta` mostram só ficha, pessoas e contrato; o resto a partir de `aceito`. Divergência SOC-003 vira faixa no cabeçalho com "versionar com os dados da Receita". Certificado a 30 dias marca o bloco. Nunca mostra senha nem conteúdo de procuração.

**Fica para depois.** SOC-017, SOC-018 (fase 3); SOC-110 (4); SOC-039, 044, 045, 201 (5); CIC-005, 008, 011.

### 6.2 Obrigações e Prazos

**Objetivo.** O calendário vivo: toda obrigação de todo setor, gerada do perfil × regras, com comprovação de entrega. Substitui Acessórias e Nibo Obrigações (GES-601, GES-607). **Cobertura:** FIS-001, 002, 003, 046 (S); FIS-023, 024 (P); FIS-047 (O); e a projeção das obrigações dos outros setores (DP-016, 017, 018, 057; CTB-041, 042).

| Bloco | Dados e ações |
| --- | --- |
| Calendário por cliente | Obrigações da competência com prazo legal, interno, status, recibo, setor. Gerar calendário do mês (`obrigacao.gerar_calendario`, executar, idempotente); reprogramar prazo interno |
| Atrasos e riscos (FIS-047) | Vence hoje, atrasado, em risco (pré-requisito faltando), multa estimada (M3). Abrir tarefa; cobrar pré-requisito |
| Pré-requisitos da semana (FIS-046) | Certificado, procuração, gov.br, documentos. Pedir ao cliente |
| Comprovação (FIS-003, FIS-023) | Recibo por obrigação com hash; obrigações sem recibo. Anexar manual; o integrante anexa o capturado |
| Regras por UF (FIS-024) e prorrogações (FIS-002) | Declarações estaduais por cliente; mudanças de prazo detectadas. Editar (versiona o perfil); confirmar |

**Com cliente e na carteira (UI lab, 8/11/2026).** Com cliente, a aba é a **agenda de todas as áreas dele**; itens sem setor contábil (gerais e do Financeiro) caem nela. Na carteira, é a **semana por cliente**. É aba própria do Painel, não filtro da Visão geral.

**Estados e regras.** Mostra tarefas `origem = obrigacao`. Perfil mudado no meio do mês: futuras não iniciadas regeradas, com "regerado por mudança de perfil". Cancelar só por Gestor ou regeração. Em "Todos": tabela obrigação × cliente, o formato que os contadores conhecem. **Fica para depois:** vigia da lei cruzada com perfil (CON-005, fase 4).

### 6.3 Notas fiscais

**Objetivo.** Capturar, conferir e entregar documentos fiscais ao core; avisar o que falta. Substitui SIEG e Qive, por último (GES-604, GES-605). **Cobertura:** 48 atividades (40 na fase 1).

| Bloco | Atividades | Dados e ações |
| --- | --- | --- |
| Configuração de captura | NFE-001, 003 (S); NFE-002 (P); NFE-503 e 504 ficam para depois (agente de pasta saiu do desenho; XML-semente é robô C-cert na fila futura, 08 4.3) | CNPJs, IEs, IMs, modelos, certificado, autXML, e-mail de recepção; situação diária (rodou, NSU, erro). Cadastrar; orientar o cliente sobre autXML (preparar) |
| Captura de entradas, serviços e saídas | NFE-004, 006, 007, 011, 501, 502, 005, 009, 012 (S); NFE-008, 013 (P) | Por competência e fonte; contagem contra a ferramenta antiga (paridade). Forçar captura; registrar NFS-e de prefeitura sem ADN; triar documento do atendimento |
| Manifestação | NFE-014 (S); NFE-015, 016 (P) | Resumos sem ciência, notas sem conclusão, entradas não reconhecidas. Evento conclusivo (executar com aprovação); desconhecimento |
| Completude e conferência | NFE-020, 021, 022, 029, 035 (S) | Buracos de sequência, compras sem XML, receita × declarada, totais core × plataforma. Abrir tarefa |
| Conferência tributária | NFE-023 a 027, 302, 031 (P) | Divergências de NCM, CST, CFOP, ST, DIFAL, ISS; produto novo. Aceitar ou corrigir (preparar) |
| Eventos posteriores e risco | NFE-018, 010, 028 (S); NFE-019, 017 (P) | Canceladas após importação, MDF-e abertos, CT-e a contestar, situação do fornecedor. Ajustar no core (executar com aprovação); contestar |
| Envio ao core e guarda | NFE-033, 036 (S); NFE-034 (P) | Lotes por competência, erros, de-para de CFOP, pacote de guarda. Reenviar; gerar pacote |
| Atendimento e emissão | NFE-037, 038 (S); NFE-039, 201 (P) | Pedidos de DANFE e XML; notas que faltam; notas emitidas pelo escritório; emissor no app. Cobrar; emitir (executar com aprovação) |
| Entrada e saída | NFE-101, 105 (S); NFE-103, 104, 106 (P) | Trilha (seção 8) |

**Estados e regras.** Cabeçalho: "captura ok ontem 03:12 · NSU 18.442" ou "parada há 2 dias: certificado vencido". Em "Todos": cliente × última captura × XMLs do mês × divergências. XML nunca aparece inteiro; só resumo e documento do índice. Paridade com o SIEG (`/ContarXmls`) é coluna enquanto a migração estiver aberta (GES-608). **Fica para depois:** NFE-030, 032, 040, 102, 301 (fase 4).

### 6.4 Fiscal

**Objetivo.** Cada obrigação do mês conferida, transmitida e com recibo; caixas postais lidas antes do prazo; guias entregues e pagamento confirmado. **Cobertura:** 52 atividades (47 na fase 1), menos as de calendário, que ficam em Obrigações.

| Bloco | Atividades | Dados e ações |
| --- | --- | --- |
| Caixas postais | FIS-005, 026, 029 (S) | Mensagens novas, resumo, classificação, prazo de ciência, tarefa aberta |
| Situação fiscal | FIS-006, 027, 030 (S); FIS-008 (P) | Relatório RFB/PGFN atual × anterior, débitos estaduais, CNPJ ou IE irregular, termos de exclusão. Gerar agora; regularizar (tarefa) |
| Simples e MEI | FIS-010, 011, 012, 016 (S); FIS-009, 013, 017, 018 (P) | Receita segregada, PGDAS-D preparado, DAS, sublimite com barra, fator R; DAS-MEI, DASN, limite. **Transmitir: executar com aprovação** (cartão com receita e valor); enviar DAS (executar) |
| DCTFWeb, Reinf, federais, estaduais, municipais | FIS-019, 020, 021, 022, 025, 028 (P) | Totalizadores, divergências, retenções, DARF, DIRBI, guias por UF, ISS. Conferir (preparar); transmitir (executar com aprovação); gerar guia (preparar) |
| Guias e pagamentos | FIS-031, 032, 201, 034 (S) | Central de guias: tributo, competência, valor, vencimento, enviada, lida, paga; recálculo pelo cliente; parcelamentos. Enviar (executar com aprovação); cobrar pagamento |
| Certidões, malhas, intimações | FIS-036 (S); FIS-037, 038, 039, 040 (P) | Certidões e vencimentos; causa de positiva; intimação com prazo, documentos e resposta; multas. Emitir (executar); responder (preparar, depois executar com aprovação) |
| Conferência e reforma | FIS-004 (P); FIS-045 (S) | Cruzamento notas × apuração × folha × extrato; destaque CBS/IBS por regime. Aprovar conferência |
| Comunicação | FIS-033, 044 (P) | Resumo do mês; respostas recorrentes. Enviar (preparar) |
| Entrada e saída | FIS-101, 103 a 106, 108, 110 (P); FIS-102, 107 (O); FIS-109 (S) | Trilha (seção 8) |

**Estados e regras.** Transmitir só aparece com FIS-004 marcada e pré-requisito válido; senão o botão vira "falta X" com link. Cartão de transmissão expira na véspera do prazo legal (Fundações 6.4). Cliente PF troca os blocos por IRPF e carnê-leão (3.5). Em "Todos", a visão do integrante: "PGDAS-D de 14 clientes pronto; 2 de fora". **Fica para depois:** FIS-014, 015, 035, 041 a 043, 301, 302 (fase 4); FIS-111 (5).

### 6.5 Trabalhista e DP

**Objetivo.** Ciclo do empregado, eSocial e FGTS Digital, com o cliente mandando o que falta pelo app. **Cobertura:** 65 atividades (43 na fase 2); a aba com mais "prepara, pessoa conclui".

| Bloco | Atividades | Dados e ações |
| --- | --- | --- |
| Quadro de empregados | DP-056, 060 (S); DP-045 (P) | Ativos por estabelecimento, cota, sistema de ponto, pasta por empregado |
| Admissão | DP-001, 002, 004, 006, 007 (S); DP-005, 008 (P); DP-003 (O) | Pedidos em andamento (dados, documentos, ASO, contrato, S-2200, benefícios), prazo do S-2200. Gerar contrato (preparar); confirmar S-2200 |
| Fechamento da folha | DP-009, 014 (S); DP-010, 011, 012, 013, 015 (P) | Variáveis recebidas × esperadas, ponto, prévia aprovada, tabelas conferidas, pró-labore. Pedir variáveis (executar); importar no core (executar com aprovação); enviar prévia (preparar) |
| eSocial e DCTFWeb | DP-038, 039, 043 (S); DP-016, 017, 057 (P) | Eventos pendentes, rejeitados, não fechados; totalizadores × folha; recibos; mudanças de leiaute. Transmitir (executar com aprovação) |
| Guias, holerites, pagamento | DP-019, 020, 021 (S); DP-018, 022 (P) | GFD, DARF, sindical, resumo, líquidos; holerites com prova; pagamento conferido. Enviar pacote (executar com aprovação); CNAB (preparar) |
| Férias, afastamentos, SST | DP-023, 049 (S); DP-024, 025, 046, 047, 048 (P); DP-050 (O) | Períodos e dobra; atestados, licenças, CAT, periódicos, PGR e PCMSO. Programar férias; transmitir CAT (executar com aprovação) |
| Rescisão | DP-027 (S); DP-026, 029, 030, 031, 032 (P); DP-028 (O) | Rescisões com prazo de 10 dias contado, TRCT, homologação, GFD rescisória. Gerar TRCT (preparar); confirmar desligamento |
| Convenções, benefícios, anuais | DP-034 (S); DP-033, 051 a 055 (P) | Sindicato, CCT e vencimento; VT, VR, plano de saúde, 13º, informe, igualdade salarial. Registrar; calcular (preparar) |
| DET, fiscalização, reclamatórias | DP-040 (S); DP-044, 061 (P); DP-041 (O) | Notificações, prazos, documentos para advogado. Abrir tarefa |
| Entrada e saída | DP-101 (O); DP-102 a 105, 106 a 108 (P); DP-109 (O) | Trilha (seção 8) |

**Estados e regras.** Admissão é o pedido implícito do Desenho 8: chega pelo CRM ou app (`pedido.abrir`), o integrante valida e abre as tarefas; a aba mostra "aguardando cliente" com a lista de documentos. Prazos de rescisão e S-2200 em contagem regressiva. Cliente sem folha mostra "sem empregados; a primeira admissão abre DP-105". **Fica para depois:** DP-035 a 037, 058, 059, 201 (fase 4); DP-062 (doméstico, 5; L2 sugere subir à fase 2 se o escritório atender).

### 6.6 Contábil

**Objetivo.** Fechar a competência: cobrar, trazer extratos, classificar, conciliar, apontar o fora do padrão, entregar ao core e ao cliente. **Cobertura:** 51 atividades (30 na fase 1).

| Bloco | Atividades | Dados e ações |
| --- | --- | --- |
| O que deve chegar e pendências | CTB-002, 003, 005, 201 (S); CTB-001 (P) | Lista mensal por cliente; competência aberta; chegou × falta; régua. Definir; abrir competência; cobrar |
| Triagem e extratos | CTB-004, 008, 009, 011, 007 (S); CTB-012, 014 (P); CTB-010 (O) | Documentos do WhatsApp e e-mail com cliente e competência inferidos; contas detectadas, Open Finance, extratos sem buracos, PDF convertido, dados do ERP; cartões, empréstimos. Confirmar classificação; pedir consentimento |
| Classificação e de-para | CTB-015 (S); CTB-016, 006 (P) | Linhas com confiança, não classificadas, de-para; Pix e débitos sem nota. Corrigir de-para (ensina o integrante); perguntar ao cliente (preparar) |
| Conciliação | CTB-019, 020, 022, 013 (S); CTB-018, 021 (P) | Saldos de terceiros, impostos × fiscal × extrato, folha × contábil, caixa credor, conta de sócio, adquirentes, parcelamentos. Abrir tarefa da diferença |
| Fechamento | CTB-026, 017, 052, 047 (S); CTB-025, 027, 046 (P); CTB-024 (O) | Etapas por cliente; variações fora do padrão; fechados, parados (por quê), atrasados por analista; lote ao core; imobilizado; inventário. Enviar ao core, reabrir competência (executar com aprovação) |
| Relatórios ao cliente e anuais | CTB-039, 050 (S); CTB-028, 031, 037, 041, 042, 043, 044, 032, 051 (P); CTB-040, 049 (O) | Balancete, DRE, comparativo; demonstrações assinadas; carta de responsabilidade; cronograma de encerramento; ECD, ECF, publicação, PLD, DECORE; pacotes para auditor. Gerar (preparar); enviar e transmitir (executar com aprovação) |
| Entrada e saída | CTB-102, 111 (S); CTB-103, 104, 108, 109, 110 (P); CTB-105 (O) | Trilha (seção 8) |

**Estados e regras.** Cabeçalho mostra a etapa ("10/26: coleta 80% · extratos ok · classificação 412/430 · conciliação pendente"). Documento do app baixa a pendência sozinho. Linha com confiança abaixo de 0,7 vem marcada. Em "Todos": a visão de CTB-026, clientes por etapa e analista. **Fica para depois:** CTB-101 (fase 3); CTB-023, 029, 030, 033 a 036, 038, 045, 048, 106, 107 (4).

### 6.7 Consultoria e Reforma

**Objetivo.** Perguntas técnicas separadas do operacional, respondidas com base citada e revisadas pelo contador. **Cobertura:** só CON-001 (S) e CON-002 (P); as outras 46 são fase 4. A aba existe desde o início, fina.

| Bloco | Dados e ações |
| --- | --- |
| Perguntas técnicas | Por canal, cliente, setor de origem, status (nova, rascunho pronto, revisada, enviada). Pedir rascunho (`parecer.rascunhar`, preparar); revisar e enviar (executar com aprovação) |
| Pareceres do cliente | Enviados, com citação, data e versão da base legal. Reaproveitar como modelo |
| Vigilância e enquadramento | Avisos do Consultor sobre o cliente (norma nova, fator R, sublimite). Abrir tarefa; falar com o Consultor |
| Perguntar | Abre a gaveta no chat do Consultor com o cliente como contexto |

**Estados e regras.** Toda resposta técnica passa por pessoa (rascunhar, sempre); o rascunho mostra a citação com vigência; sem base encontrada, abstenção explícita. Blocos de simulação aparecem com "disponível na fase 4", sem botão. **Fica para depois:** CON-003 a 038, 101 a 106, 301 a 304 (4); CON-401 (5).

### 6.8 Financeiro do escritório

**Objetivo.** Contratos, faturamento, cobrança, caixa, DRE por setor com as horas medidas. **Cobertura:** só FIN-001 (P, contrato como assinatura estruturada, fase 0), compartilhado com Clientes e Societário; as 18 FIN restantes e GES-001 a 015 são fase 3.

| Bloco | Dados e ações |
| --- | --- |
| Contratos e honorários | Por cliente: itens, valor, vencimento, reajuste, 13º, situação. Editar (aditivo; o `honorario` do perfil vira resumo derivado, 09 3.2); exportar |
| Receita contratada | Por mês, setor, regime; clientes sem contrato estruturado |
| Cobrança, caixa, contas a pagar, DRE | Rótulo "fase 3" com a pré-condição (API de cobrança do banco) |

**Regras.** Visível a Administrador e Gestor com o setor; Colaborador só por exceção `aba.financeiro.contratos` (ler), o exemplo de Fundações 3.5. Até a fase 3, ninguém cobra por aqui. O Financeiro **não tem seletor de cliente**: é o financeiro do escritório e as listas filtram por cliente (UI lab, decisão 24). **Sete abas** (09, 10.1; decidido em 8/11/2026 e desenhado pelo UI lab na segunda rodada). As peças (contas a pagar, conciliação, caixa) têm um titular e servem também ao BPO, com a empresa cliente como titular (09, adendo 15; 10, 2.4). **Fica para depois:** FIN-002 a 016, 601 a 604 (3); FIN-201 (5).

### 6.9 Gestão

**Objetivo.** Equipe, carteira, permissões, produtividade, governança da IA, migração e relatórios consolidados. **Cobertura:** as atividades de gestão do setor Gestão e Atendimento: GES-047, 048, 056, 058 (S); GES-017, 021, 041, 054, 204, 206, 601 a 607, 609 (P); GES-018, 020, 053, 057, 059, 062, 608 (O). As de atendimento vão para a aba Atendimento.

| Bloco | Dados e ações |
| --- | --- |
| Equipe e carteira (GES-017, 018, 021) | Usuários, papel, setores, exceções, carteira, substituto nas férias, carga por pessoa. Convidar; editar vínculos e exceções (só Administrador); redistribuir em lote; férias com substituto |
| Permissões (GES-021, 041) | Matriz usuário × aba × nível efetivo (calculada, só leitura); o que cada pessoa do cliente vê. Simular "o que Fulano vê?" |
| Produtividade e atrasos | Tarefas por setor e pessoa: criadas, concluídas, atrasadas, tempo iniciar → concluir, reabertas; conversas sem resposta |
| Governança da IA (GES-056, 062) | O que os integrantes fizeram sozinhos e com aprovação, taxa de aprovação sem edição por atividade, tempo humano de aprovação, custo em tokens, lista "executa sozinho", pedidos de promoção (02, 3.3). Tirar da lista; aceitar promoção; limites |
| Catálogo local | Atividades ativas, horas padrão, equivalência no core, fila "sem equivalente" (`catalogo.configurar_atividade`) |
| Armazenamento e tema | Conectores, mapeamento de árvore, pastas visíveis ao cliente (7.8), cota; tema |
| Plano mestre de migração (GES-608) | Por ferramenta antiga: onda, pré-requisitos, paralelo, critério medido, data de contrato. Marcar critério; registrar desligamento |
| Compliance e LGPD (GES-054, 057, 059) | Registro de tratamento, incidentes, anuidades |
| Relatórios consolidados e auditoria | Os relatórios de cada aba lado a lado; `evento.listar` com filtros (ator, credencial, negado). Exportar |

**Regras.** Gestor vê só os setores que gere; Administrador é o único que edita papéis, setores, exceções, tema e catálogo. Toda edição de permissão exige motivo (vai ao evento). A matriz é calculada pela função única (Fundações 3.4); a tela não tem lógica própria. **Fica para depois:** GES-001 a 016, 042, 043, 049 a 052, 055, 060, 061, 101 a 109, 207, 401 a 404 (fase 3: cobrança, rentabilidade, custo-hora, funil, previsão de carga); GES-028, 045, 201, 301, 402, 407 (4); GES-032, 205, 208 (5).

### 6.10 Atendimento

Caixa de entrada única (WhatsApp, e-mail, chat do app, formulário), ligada ao cadastro e às tarefas. **Desenhada no subplano 04.** Cobertura: GES-023 a 027, 029 a 031, 033 a 040, 044, 104, 105, 108, 203, 405, 406, 025, e as de atendimento por setor (NFE-037, 038, FIS-044, CON-001, DP-002).

Encaixe: a aba abre a caixa de entrada na área de conteúdo; **o CRM não tem seletor de cliente no topo** (decisão do UI lab, 7/11/2026): a "visão do cliente" é o **filtro por cliente da própria lista de Conversas**; Leads e Números são do escritório e Comunicados escolhe os destinatários (04, 7.1). Cada conversa mostra a tarefa ligada e cada tarefa a conversa; "virar tarefa" propõe (rascunhar) e cria (executar); as pendências aparecem dentro da conversa com "cobrar"; a visão do cliente (tudo que conversou, pediu, recebeu e tem pendente) é a lista de Conversas filtrada por ele.

### 6.11 Timesheet

Onde o tempo vai, por cliente, setor, atividade e pessoa. **Desenhada no subplano 05.** Encaixe: Colaborador vê "meu tempo" (sessões, confirmação assistida, contestar); Gestor, a equipe e a capacidade; Administrador, tudo. Sessões de integrante em série separada. O Painel alimenta por `tarefa.iniciar` e `tarefa.concluir`; o Timesheet devolve os indicadores de horas da Home e a confirmação assistida como cartão.

---

## 7. Tarefas

### 7.1 Lista

O mesmo componente no bloco de cada aba, no calendário (outra forma) e na tela "Tarefas" do celular. Colunas: status, título, atividade (ID e nome curto), cliente, competência, prazo interno e legal, responsável (pessoa ou integrante), origem, dias no status, cartão pendente. Filtros: setor, cliente ou carteira, status (abertas por padrão), responsável (eu, pessoa, integrante, sem), competência, prazo (hoje, semana, atrasadas), origem, só com pendência, só com cartão; filtro salvo por usuário e aba. **Visão por responsável** agrupa por pessoa e integrante com contagens; arrastar uma tarefa de uma pessoa para outra chama `tarefa.reatribuir` (Gestor).

### 7.2 Detalhe

```
┌─ FIS-019 · Conferir e transmitir DCTFWeb 10/2026 · Empresa X ────────────────────┐
│ status: em andamento (há 2 h) · prazo interno 25/11 · prazo legal 30/11            │
│ responsável: Fulano · origem: obrigação · quem conclui: pessoa · aberta por Fulano  │
│ [■ Concluir] [Enviar para revisão] [Aguardar cliente] [Aguardar órgão] [Cancelar]  │
├─ Checklist ─────────────────────────┬─ Cartão pendente ──────────────────────────┤
│ ☑ Totalizadores batem (João, 09:12) │ Transmitir DCTFWeb 10/2026 da Empresa X,   │
│ ☑ Reinf fechada                     │ saldo R$ 4.812,30 · pedido por João        │
│ ☐ Transmitir (pessoa)   obrigatório │ [sim] [editar] [não]   expira 29/11 18h    │
│ ☐ Anexar recibo                     │                                            │
├─ Documentos ────────────────────────┼─ Conversa ligada ──────────────────────────┤
│ DARF 10/2026 (gerado · visível app) │ DP · "variáveis de outubro" · resolvida    │
│ Recibo (aguardando)                 │ [abrir] [nova mensagem ao cliente]         │
├─ Tempo: Fulano 1h40 (automática) · João 4 min (agente, 3.100 tokens) ────────────┤
├─ Histórico: 09:12 João conferiu totalizadores · 10:02 Fulano iniciou · ...       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Campos de Fundações 4.8: cliente, setor, atividade, título, descrição, competência, origem e referência (obrigação, pedido, conversa, tarefa-pai da trilha), responsável, quem conclui, status e desde quando, detalhe do que se aguarda, prazos, prioridade, checklist, recorrência, risco, quem está com a tarefa aberta, resultado, motivo de cancelamento.

### 7.3 Iniciar e concluir como início e fim do tempo

- **Abrir a tarefa inicia; não há botão a mais.** Decisão de 7/11/2026: abrir o detalhe da tarefa a partir da lista chama `tarefa.iniciar` e a sessão começa, sem clique extra. Para quem só quer conferir, a lista tem **pré-visualização** (painel lateral ou expansão da linha) que mostra o essencial sem abrir, e uma sessão **encerrada em menos de 60 segundos sem nenhuma ação** é descartada, não contada. O botão Iniciar existe só como alternativa (atalho, teclado); o texto a seguir continua valendo com essa leitura. A partir da abertura, a tarefa fica "aberta por Fulano" e a sessão começa. O cabeçalho de toda aba mostra a tarefa aberta ("trabalhando em: FIS-019 Empresa X · 1h40") com o botão de concluir, para a pessoa ir ao core e voltar sem procurar.
- Uma tarefa aberta por pessoa. Iniciar outra pausa a anterior (volta a `em_andamento`, sem dono aberto) com aviso.
- **Concluir** pede o resultado quando a atividade define (recibo, protocolo) e recusa com item obrigatório do checklist aberto. `risco = true`, ou responsável integrante em "prepara", só sai por **Enviar para revisão**.
- **Aguardar cliente** exige a lista de itens (vira pendência no app e na régua); **aguardar órgão** exige órgão e protocolo.
- A espera por inatividade não muda status; a sessão encerra no último evento e, ao voltar, a tela pergunta "você estava em FIS-019; continuar?" (sem pedir senha).
- Reabrir cria outra tarefa com `tarefa_pai_id`; o botão se chama "abrir correção".

### 7.4 Checklist, documentos e conversa

Checklist com obrigatório ou não, quem marcou e quando (`tarefa.checklist_marcar`); molde da obrigação (`checklist_padrao`) ou do processo (GES-206), mais itens livres. Documentos ligados (`documento.tarefa_id`) com os controles do bloco D; anexar aqui já preenche cliente, competência e tipo. Conversa ligada com resumo e última mensagem; "nova mensagem" abre o rascunho no CRM com a tarefa como contexto; "virar pendência" transforma itens da conversa em `aguardando_detalhe`.

### 7.5 Cartão de aprovação dentro da tarefa

O cartão (Fundações 6.4) no detalhe, na Home, na central e no chat é o mesmo registro: `resumo_humano`, argumentos em tabela legível, quem pediu (integrante e dono), quem pode aprovar, expiração, sim / editar / não. Editar grava `argumentos_editados`; o integrante é acordado com a decisão e o comentário vira aprendizado (02, 7.2 gatilho 18). Quem não pode aprovar vê o cartão sem botões e o nome de quem pode.

### 7.6 Recorrência e conclusão por evidência

Tarefa de obrigação nasce de `obrigacao.gerar_calendario`, idempotente. Recorrência do escritório sem obrigação formal (`recorrencia_id`, ex.: "relatório gerencial dia 10") é configurada na aba como processo (GES-206) e gera tarefas do mesmo jeito; a tela mostra a origem e leva à regra, não a edita a partir da tarefa.

**Tarefa que se fecha por evidência** (B2, 4, item 1): quando a atividade tem critério verificável (recibo anexado, guia entregue e lida, documento recebido, `core.tarefa.concluir`), o integrante conclui ao receber a evidência se é "faz sozinho", ou envia para revisão com a evidência ligada se é "prepara". A tela mostra "concluída por evidência: recibo 123". Pede o campo `criterio_conclusao` (seção 13).

### 7.7 Trilha como conjunto de tarefas

`cliente.gerar_jornada(molde)` cria a tarefa-raiz ("Implantação do cliente X", GES-106) e as filhas por setor com `tarefa_pai_id`, prazo relativo e dependência. Na lista, a raiz aparece com progresso ("14 de 31"); cada filha é tarefa comum, visível no bloco da aba do seu setor. A tela da trilha é a seção 8.

---

## 8. Implantação e desligamento de cliente

### 8.1 Faixa de ciclo de vida

Cliente em `em_implantacao`, `em_saida` ou `em_baixa` ganha uma faixa acima do cabeçalho em toda aba: "Em implantação (transição) · desde 3/11 · 14 de 31 passos · corte 10/2026 · [ver trilha]". A trilha mora em Clientes e Societário.

### 8.2 Tela da trilha de entrada (L2 e L1)

```
┌─ Implantação · Empresa X · molde: transição (jornada b) · responsável: Beltrano ─────────┐
│ Marcos  [b1 janela 90 d ✓] [b2 corte ✓] [b3 acervo ●] [b4 acessos ●] [b5 diagnóstico ○] │
│         [b6 heranças ○] [b7 saldos ○] [b8 ambientes ○] [b9 regularizar ○] [b10 1º fech. ○] │
├─ O cliente precisa enviar ──────────────────────────┬─ O contador anterior precisa enviar ──┤
│ ☐ Certificado A1 e senha (SOC-008)      pedido 3/11 │ ☐ ECD 2025 (CIC-002)                  │
│ ☑ Autorização de acesso RFB (SOC-011)   feito 5/11  │ ☑ Balancetes 2026 (CTB-102)           │
│ ☐ Procuração FGTS Digital (SOC-013)     pedido 4/11 │ ☐ Arquivos do eSocial (DP-103)        │
│ ☐ Contas e consentimento (CTB-010)                  │ ☐ Parcelamentos e processos (FIS-105) │
│ [cobrar pelo CRM] [ver no app do cliente]           │ [reenviar carta única]                │
├─ Tarefas por setor: Societário 5/8 · Fiscal 2/6 · Notas 3/4 · DP 1/5 · Contábil 2/6 ─────┤
│ (mesma lista do bloco de tarefas, por setor; bloqueadas mostram "depende de b3")           │
├─ Custo: 18h registradas · 26h previstas (molde) · agente 2h ──────────────────────────────┤
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

- Moldes da primeira versão: **abertura** (jornada a: a1 a a12), **transição** (b1 a b11), **MEI** (c1 a c4), **pessoa física** (c5 a c8, CIC-004). A pré-entrada (P1 a P7) nasce no pipeline de leads (04) e termina em `aceito`.
- "O cliente precisa enviar" é `pendencia.listar` das tarefas da trilha em `aguardando_cliente`; é o que o cliente vê no app, com envio direto. Documento do app baixa o item e acorda o integrante para validar (GES-405).
- "O contador anterior" é a carta única (CIC-002): pedidos, recebidos, cobrados.
- Marcos bloqueados mostram `depende_de`. O marco "primeiro fechamento de cada setor" (GES-106) libera `cliente.mudar_estado(ativo)`, executar com aprovação de Gestor.
- O gargalo humano de L2 (SOC-014 e SOC-011) aparece em destaque com dias e cobranças; a Home do Administrador lista os clientes parados nesse elo.
- A janela de 90 dias (b1, NFE-101) dispara ao receber o A1; a trilha mostra "captura retroativa: 1.240 XMLs".

### 8.3 Tela de saída

Mesma estrutura, com os moldes **saída para outra contabilidade** (e1 a e13) e **baixa** (f1 a f11).

- Cabeçalho: motivo, data efetiva, competência de corte, aviso prévio.
- **Obrigações remanescentes** (SOC-107, FIS-108, DP-106, CTB-109): geradas do calendário até o corte; `encerrado` bloqueado até zerar (Fundações 4.2).
- **Dossiê de saída** (CIC-003): pacotes por setor, índice com manifesto (lista e hash), termo de entrega. Gerar é executar; enviar ao sucessor é executar com aprovação.
- **Revogações e desligamentos** (SOC-024, DP-107, FIS-109, NFE-105, CTB-111, GES-108): checklist gerado das matrizes; cada item marca quem fez.
- **O cliente precisa**: assinar o distrato, informar o sucessor, retirar o A1 ou autorizar o descarte.
- Após `encerrado`: abas só leitura com "encerrado em DD/MM; retenção até AAAA"; CIC-007 cria tarefas sem reabrir o cliente.

---

## 9. Permissões na tela

### 9.1 Regra geral

A tela não decide nada: pede à função única (Fundações 3.4) o escopo materializado da sessão (setores com modo, clientes ou "todos", ferramenta → nível) e **esconde** o que não está nele. Botão cinza convida "por que não posso?"; botão ausente não revela o que existe. A exceção é o cartão de aprovação, que mostra quem pode aprovar.

### 9.2 Matriz por papel e aba

| Aba | Administrador | Gestor (modo gestão) | Colaborador (modo execução) |
| --- | --- | --- | --- |
| Home | Indicadores do escritório | Setor com quebra por pessoa | O próprio e o setor, sem quebra |
| Clientes e Societário | Tudo; funde | Muda estado do ciclo | Edita ficha, pessoas, acessos; não muda estado nem funde |
| Obrigações e Prazos | Cancela obrigação | Gera calendário; cancela; reatribui | Executa as suas; reprograma prazo interno das suas |
| Notas, Fiscal, DP, Contábil | Tudo | Reatribui; aprova cartões do setor | Prepara e executa até o nível do contrato; aprova os próprios cartões quando tem o nível |
| Consultoria e Reforma | Tudo | Tudo do setor | Pede rascunho; envia só com executar |
| Financeiro do escritório | Tudo | Contratos, cobranças, contas a pagar e conciliação; lê Resultado (09, 10.6) | Só por adição na conta do usuário, até o `nivel_max`; Resultado e remuneração nunca |
| Gestão | Único que edita papéis, setores, exceções, tema, catálogo | Equipe e produtividade dos seus setores; redistribui; férias | Não aparece |
| Atendimento | Tudo | Setor inteiro: assume, repassa, transfere, resolve | As suas e as sem responsável |
| Timesheet | Equipe inteira | Equipe do setor; decide contestações | Só o próprio; contesta |

### 9.3 Exceções, carteira, integrantes, cliente

- **Exceção por tela** muda uma aba inteira ou uma ferramenta: aba liberada aparece com o nível máximo da exceção (Financeiro só leitura: sem botões); aba bloqueada some mesmo com o setor. Configurada em Gestão, com motivo obrigatório; a matriz "o que Fulano vê" mostra o resultado calculado e a exceção que o causou.
- **Carteira ligada**: o seletor só lista a carteira (por setor quando `setor_id` preenchido), "Todos" vira "todos os meus", a busca não devolve clientes de fora. Carteira vazia: Home com "nenhum cliente na sua carteira; fale com o Gestor" e só o Timesheet próprio.
- **Integrantes** obedecem ao escopo do dono: o Colaborador do Fiscal não vê o integrante do DP. Cartão cujo dono não tem o nível vai ao Gestor do setor (e sempre ao Administrador) com "pedido por João, de Fulano; Fulano não pode aprovar".
- **Cliente** nunca entra no Painel (tem o app); lead não tem acesso; no BPO, a equipe do subinquilino vê o Painel com o tema dele, e a mãe só vê dentro do `escopo_mae`.

---

## 10. Validação da divisão de abas com os contadores

### 10.1 Método

| Passo | O que | Duração |
| --- | --- | --- |
| 1. Sessão individual | 1 h com cada contador (inclusive o Leandro), sobre cartões impressos: um por bloco de aba (6.1 a 6.11), sem o nome da aba. O contador agrupa como acha que trabalha e nomeia os grupos. | 1 h |
| 2. Cartões de atividades | 40 atividades de fases 0 a 2 sorteadas por setor (ID e descrição curta). O contador põe cada uma no grupo que criou. Divergência entre contadores, e entre os grupos deles e a aba do mapa, vai para a tabela de resultado. | Dentro da hora |
| 3. "Ache onde fazer X" | Com os wireframes em texto, 10 tarefas: transmita o PGDAS-D da Empresa X; veja o que a Padaria Y não mandou do mês; veja se o certificado da Clínica W vence; reprograme a DCTFWeb para sexta; aprove o que o agente do DP preparou; ache a nota cancelada de outubro; veja quem está atrasado no Fiscal; comece a implantação de um cliente; cobre o extrato do Itaú; veja quantas horas foram para a Empresa X. Mede-se primeira aba clicada, cliques até achar, acerto, comentário. | 20 min |
| 4. Consolidação | Matriz contador × tarefa × primeira aba; cartões que mudaram de grupo; pedidos de junção ou divisão. | — |

### 10.2 Critérios para juntar ou dividir

| Critério | Junta | Divide |
| --- | --- | --- |
| Primeiro clique | Mais da metade procura o bloco em outra aba | Mais da metade acha de primeira |
| Agrupamento | Dois grupos têm as mesmas pessoas e os mesmos dados | Dados e pessoas distintos |
| Volume | Menos de 10 atividades de fases 0 a 2 e sem integrante próprio (candidata: Consultoria, até a fase 4) | Mais de 60 (candidata a sub-abas internas: DP) |
| Setor fixo | Setor com equipe é fixo (decisão de 7/11/2026): juntar abas seria juntar setores, o que não se faz | — |
| Filtro em vez de aba | O conteúdo é o mesmo com outro filtro (Obrigações e Prazos é o calendário filtrado por origem) | Tem blocos próprios |

A validação pode mudar nomes, ordem, sub-abas e o que é filtro; não pode fundir setores com equipe. Candidatas a discussão: Obrigações e Prazos como aba ou visão da Home; Notas fiscais como aba ou sub-aba do Fiscal (tem integrante próprio e 48 atividades, por isso a hipótese é aba); Consultoria fina ou oculta até a fase 4.

### 10.3 O que a revisão do mapa já alimenta

Os contadores estão respondendo, por atividade, "fazemos / faz sentido / horas / feito em":

- **fazemos = não** em atividade de fases 0 a 2: o bloco nasce desligado (`ativa = false`) e a aba não o mostra; sem blocos vazios de coisa que o escritório não faz.
- **faz sentido = não**: sai da primeira versão; a aba ganha a nota "fica para depois".
- **horas**: calibra `horas_100` da atividade (estimativa de sessão, Fundações 5.4) e os indicadores de capacidade; a hora padrão por cliente não é informada, é calculada pelo timesheet (05, 11.2).
- **feito em** (core, portal, planilha, Drive, HubStrom, Acessórias): diz de onde vem o dado na migração e qual ferramenta a aba substitui; alimenta GES-608 e a seção 11.

---

## 11. Cruzamento com o painel existente

O Leandro tem um painel em Google Apps Script sobre o Google Drive, que chega na segunda-feira. O Desenho (2.3) decidiu: entra como referência de regra de negócio e de layout de dados, não como código.

### 11.1 Método de comparação

| Etapa | O que fazer | Resultado |
| --- | --- | --- |
| 1. Inventário | Cada tela, menu, planilha e aba de planilha: nome, para que serve, quem usa, campos (nome, tipo, obrigatório, origem), botões e o que fazem, gatilhos (tempo, edição de célula, formulário) | Tabela de telas e de campos |
| 2. Mapeamento | Tela dele → aba e bloco nossos; campo → entidade e campo das Fundações; botão ou gatilho → atividade do mapa e ferramenta | Igual, parecido (diferença anotada) ou sem correspondente |
| 3. O que ele tem e nós não | Para cada item sem correspondente: entra na primeira versão, entra depois (fase), ou não entra (motivo) | Fichas novas e acréscimos a este subplano |
| 4. Regras nos scripts | Validações (o que ele recusa), cálculos (prazos, dias úteis), nomes de pastas e arquivos (árvore do Drive, para 7.3), textos de mensagens (modelos do tema), listas fixas (regimes, tipos, status) | Regras em português, uma por linha, com o trecho de origem |
| 5. Carga inicial | Planilhas viram carga do banco (Fundações F14); o Drive vira conector espelho com mapeamento de árvore | De-para de colunas |
| 6. Paridade | Para 5 clientes, o que o painel dele mostra hoje × o que as abas mostrariam com os mesmos dados | Lista de diferenças |

Perguntas na sessão: o que ele abre primeiro de manhã; o que a equipe edita e o que só ele edita; o que quebra com frequência; o que queria que fizesse e não faz; quais telas não usa mais.

### 11.2 Tabelas a preencher (vazias)

**Telas**

| Tela ou planilha dele | Para que serve | Quem usa | Aba nossa | Bloco | Resultado (igual / parecido / sem correspondente) | Observação |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |

**Campos**

| Tela dele | Campo | Tipo | Origem (digitado / fórmula / script) | Entidade nossa | Campo nosso | Resultado | Observação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

**Botões, gatilhos e regras dos scripts**

| Onde (script, função) | O que faz | Atividade do mapa | Ferramenta nossa | Nível | Regra embutida | Entra? (v1 / fase / não) |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |

**O que ele tem e nós não**

| Item | Descrição | Proposta (ficha nova / ajuste de aba / não entra) | Motivo |
| --- | --- | --- | --- |
| | | | |

**Árvore do Drive dele** (para o mapeamento de 7.3)

| Nível | Padrão de nome | Vira (cliente / ano / competência / tipo / ignorar) | Visível ao cliente? |
| --- | --- | --- | --- |
| | | | |

---

## 12. Métricas de uso do Painel

Saem do registro de eventos (Fundações 5), mais um evento de navegação pedido na seção 13. Para o benchmark, dados anonimizados ou sintéticos (Plano 1.5).

| Métrica | Cálculo | Para que serve |
| --- | --- | --- |
| Tempo até concluir tarefa | `concluir − iniciar`, descontando `aguardando_*`; por atividade, setor, pessoa; mediana e p90 | Calibra `horas_100`; mostra onde a tela atrapalha; compara antes e depois de uma mudança |
| Cliques por ação | `tela.navegar` entre o início de uma intenção (abrir aba, buscar) e a ferramenta executada | Mais de 3 cliques: candidata a atalho ou a botão no bloco de tarefas |
| Abas mais usadas | `tela.navegar` por aba, papel, hora | Ordem dos blocos na Home; menu de celular |
| Pendências resolvidas pelo app | `pendencia.marcar_recebida` com origem `upload_cliente_app` ÷ total | Quanto o app tira do atendimento; régua |
| Aprovação sem edição | `aprovacao.decidir` por resultado, atividade e integrante | Critério de promoção (02, 3.3); cartões mal escritos |
| Concluídas por evidência | Com `criterio_conclusao` atendido ÷ total | Mede o "fecha sozinho" |
| Tela × chat | Eventos por `origem` por ferramenta | Quais ações o usuário prefere pedir em linguagem natural; prioriza o M4 |
| Tempo até a primeira ação do dia | Login até a primeira ferramenta | Se a Home mostra o que importa |
| Esperas por hora de trabalho | `sessao.espera` ÷ horas | Ajusta `inatividade_min`; tempo no core sem sinal |
| Preferências alteradas | Mudanças em `usuario.preferencias` | Se todos mudam a mesma coisa, o padrão está errado |
| Buscas sem resultado | Busca global com zero resultados, termo | O que se procura e não se acha |

**Como alimentam o benchmark.** O benchmark tem três tipos de caso (Plano 1.5); o Painel alimenta o terceiro, tarefas de ação com resultado esperado: cada ferramenta executada pela tela, com argumentos e resultado, vira caso candidato ("transmitir PGDAS-D da Empresa X, receita R$ 48.200" → recibo). Aprovação sem edição diz quais cartões do M4 estão certos; tela × chat diz quais pedidos o roteador precisa reconhecer; cliques por ação apontam onde um cartão do chat vale mais que uma tela. O relatório fica em Gestão; a versão anonimizada vai ao benchmark.

---

## 13. Ordem de construção, ajustes e perguntas

### 13.1 Etapas sobre as Fundações

| # | Etapa | Depende de | Entrega |
| --- | --- | --- | --- |
| P1 | Esqueleto, autenticação, tema, inatividade | F1, F2, F11 | Barra, navegação com visibilidade por papel e setor, modo de espera, tema por domínio |
| P2 | Contexto de cliente | F3, F4 | Seletor, favoritos, recentes, persistência, "Todos", grupos, faixa de ciclo |
| P3 | Tarefas | F5, F6 | Bloco "Tarefas deste setor", detalhe, transições por ferramenta, tarefa aberta no cabeçalho |
| P4 | Home mínima | P3, F9 | Calendário (semana e mês), pendências, indicadores básicos, linha do tempo |
| P5 | Anatomia de aba e duas abas | P2, P3, F7 | Componente de aba; Clientes e Societário; Obrigações e Prazos |
| P6 | Cartões e integrante na aba | F10, 02 (E1 a E4) | Cartão na Home, na tarefa e na central; avisos fiz/decisão/informação; integrante no cabeçalho; gaveta |
| P7 | Notas fiscais e Fiscal | P5, conectores | As duas abas |
| P8 | Trilha de entrada e saída | P5, moldes (F5) | Faixa e telas de trilha |
| P9 | DP e Contábil | P5, conectores de core | As duas abas |
| P10 | Gestão, Financeiro (contratos), Consultoria fina | P6, F13 | Equipe e permissões, governança da IA, plano mestre, catálogo local; contratos; perguntas técnicas |
| P11 | Encaixe de Atendimento e Timesheet | 04, 05 | As duas abas no esqueleto |
| P12 | Celular e tablet | P1 a P6 | Menu inferior, um toque, modo leitura |
| P13 | Métricas e relatórios | P4 a P10 | `tela.navegar`, relatórios por aba, consolidação, exportação anonimizada |

P1 a P4 formam a primeira tela usável. A validação da seção 10 acontece entre P4 e P5 com os wireframes deste documento; o cruzamento da seção 11, assim que o painel do Leandro chegar, antes de P5.

### 13.2 Ajustes pedidos às Fundações ou ao 02

| # | Onde | Pedido | Por quê |
| --- | --- | --- | --- |
| A1 | Fundações 6.5 | `tarefa.reprogramar(tarefa_id, prazo_interno, motivo)` (executar; Gestor para tarefa de outra pessoa) | Arrastar no calendário; só o prazo interno |
| A2 | Fundações 4.8 | Campo `criterio_conclusao` (tipo de evidência, filtro) e evento `tarefa.concluir_por_evidencia` | Tarefa que se fecha sozinha (B2); métrica |
| A3 | Fundações 5.7, 5.2 | Eventos `tela.navegar` (ler, fora da linha do tempo, com aba, cliente, origem) e `sessao.espera` (antes `sessao.bloquear`) | Métricas; sinal de atividade (2.5 já cita navegação) |
| A4 | Fundações 6.5 | `indicador.listar(escopo, periodo)`, `relatorio.gerar(tipo, filtros, formato)`, `busca.global(termo)` (ler) | Indicadores, relatórios e busca sem consulta direta |
| A5 | Fundações 2.2 | Estrutura de `usuario.preferencias`: `cliente_selecionado`, `favoritos`, `recentes` (por dispositivo), `blocos_home`, `filtros_por_aba`, `modo_tema` | Seções 3 e 4 |
| A6 | Fundações 2.2 | Catálogo de identificadores estáveis de tela (`aba.societario`, `aba.fiscal.guias`) com a lista de ferramentas de cada um | Exceção por tela, métricas e declaração de telas (6.2) com o mesmo nome |
| A7 | Fundações 4.11 | Mapa tipo de documento → setor, ou `setor_id` no Documento | O bloco de documentos filtra por setor; o tipo não basta (guia é Fiscal ou DP) |
| A8 | Fundações 4.8 | Evento `tarefa.pausar` gerado pelo executor ao trocar de tarefa aberta | A tela mostra "pausada"; o timesheet corta no ponto certo |
| A9 | 02 (9.3) | Formato do link "ver na aba": `{aba, cliente_id, filtro}` com o catálogo de A6 | O chat abre a aba certa |
| A10 | 02 (9.2) | `integrante.status(integrante_id, cliente_id)` (ler): o que faz, fila, cartões pendentes | Cabeçalho da aba |
| A11 | 02 (7.4) e Fundações 8 | Notificação `agente` com `corpo_estruturado` `{fiz, decisao, informacao}` | A Home renderiza os três blocos sem interpretar texto |
| A12 | Desenho 2.1 | Aba Timesheet visível ao Colaborador em modo "meu tempo" | 2.1 diz que é só de Administrador e Gestor; 4.5 e a decisão 10 dizem que o Colaborador vê e contesta o próprio. Prevalece 4.5 |

### 13.3 Perguntas para aval

| # | Pergunta | Hipótese adotada | Em outras palavras |
| --- | --- | --- | --- |
| P1 | Obrigações e Prazos é aba própria ou a Home com filtro "só obrigações"? | **Respondido (segue a hipótese):** Aba própria, com a tabela obrigação × cliente conhecida de Acessórias | A agenda de obrigações pode ser uma página só dela ou um filtro no calendário da página inicial. A página própria é mais parecida com o que eles usam hoje; o filtro é menos coisa para aprender. |
| P2 | Arrastar no calendário muda só o prazo interno e pede confirmação quando passa do legal? | **Respondido (segue a hipótese):** Sim | Arrastar uma tarefa muda a meta do escritório, nunca a data que a lei manda; passar da lei faz a tela perguntar "tem certeza?" e mostrar a multa estimada. |
| P3 | Notas fiscais fica separada do Fiscal? | **Respondido (segue a hipótese):** Sim: integrante próprio e 48 atividades | Capturar e conferir notas pode ficar na página dos impostos ou numa página só. Separar é mais claro para quem faz só isso; juntar é menos abas. A validação decide. |
| P4 | Consultoria e Reforma aparece desde o início, com duas atividades, ou fica escondida até a fase 4? | **Respondido (segue a hipótese):** Aparece, fina, com "disponível na fase 4" nos blocos futuros | Uma página quase vazia pode frustrar; escondê-la faz o contador não saber que vem. A hipótese é mostrar o pouco que existe e anunciar o resto. |
| P5 | Financeiro do escritório na primeira versão mostra só contratos e honorários? | **Respondido (segue a hipótese; as telas de orçamento, remuneração e sócios existem desligadas, adendo 18):** Sim; cobrança e caixa são fase 3 e dependem da API do banco | Na primeira versão, essa página é só o cadastro do que cada cliente paga. Cobrar, dar baixa e ver o caixa vêm depois. |
| P6 | "Iniciar" é botão explícito; abrir o detalhe não conta como início? | **Respondido:** não. Abrir a tarefa inicia, sem clique a mais; pré-visualização para quem só confere; sessão de menos de 60 s sem ação é descartada (7.3) | O relógio só começa quando a pessoa aperta "iniciar", não quando abre a tarefa para olhar. Evita contar tempo de quem só confere, mas exige um clique a mais. |
| P7 | O primeiro acesso abre em "Todos"; depois, o último cliente usado? | **Respondido (segue a hipótese):** Sim | Na primeira vez a pessoa vê a carteira inteira; depois o sistema lembra onde ela estava. |
| P8 | No celular, abas de setor em modo leitura com ações de um toque; edição só no computador? | **Respondido (segue a hipótese):** Sim | No telefone dá para aprovar, concluir, cobrar e responder; preencher cadastro e configurar fica para o computador. |
| P9 | Colaborador vê as tarefas dos colegas do setor ou só as suas? | **Respondido (segue a hipótese):** Vê as do setor; só o Gestor reatribui | Ver o que o colega tem ajuda a cobrir férias e entender a fila; esconder evita comparação. A hipótese é mostrar. |
| P10 | Colaborador vê o custo em tokens do seu integrante? | **Respondido:** não vê tokens; vê a **porcentagem usada do próprio limite** de 5 horas e de 7 dias (como "você usou 40% do limite desta janela"); Gestor e Administrador veem o custo | O gasto do agente em dinheiro aparece só para quem gere. O Colaborador vê o tempo do agente, não o custo. |
| P11 | Tarefa com evidência (recibo chegou, guia lida) conclui sem clique quando a atividade é "faz sozinho"? | **Respondido (segue a hipótese):** Sim, com "concluída por evidência" visível e corrigível | Quando a prova de que o trabalho foi feito chega sozinha, a tarefa fecha sozinha e mostra a prova; se foi engano, abre-se uma correção. HubStrom e Domínio já fazem isso. |
| P12 | Cliente PF usa a aba Fiscal com conteúdo de IRPF, sem aba própria? | **Respondido (segue a hipótese):** Sim (Desenho 2.1) | Pessoa física não ganha página só dela; a página de impostos muda de conteúdo. Na temporada do IRPF, a Home mostra a campanha. |
| P13 | A validação da seção 10 acontece com wireframes em texto, antes de qualquer tela desenhada? | **Respondido (segue a hipótese):** Sim, entre P4 e P5 | Testar com caixas de texto é mais barato e evita que o contador avalie cor em vez de organização; o risco é ele ter dificuldade de imaginar. |
| P14 | O painel do Leandro entra só como referência de regras e carga inicial, sem reaproveitar script? | **Respondido (segue a hipótese):** Sim (Desenho 2.3) | O que ele programou vira lista de regras para conferirmos e os dados dele viram a carga inicial; o código não é levado, porque a base é outra. |
| P15 | A aba Timesheet aparece para o Colaborador em modo "meu tempo" (ajuste A12)? | **Respondido:** sim, como item lateral Timesheet com a aba interna "Meu tempo"; e a navegação inteira muda para barra lateral com abas internas (2.0), a confirmar com o esqueleto de design do usuário | O Desenho diz num lugar que a página de horas é só de chefes e noutro que cada um vê as próprias horas. A hipótese é que cada um vê as suas. |

## 14. Adendo: ajustes recebidos do subplano 04 (7/11/2026)

- A aba Atendimento (6.10) é o item lateral CRM, com abas internas Conversas · Leads · Comunicados · Configuração dos números; a "visão do cliente" é Conversas com o cliente selecionado.
- A Home ganha o bloco "sem responsável e SLA a vencer"; o detalhe da tarefa mostra a conversa ligada, em leitura.
- Gestão (6.9) ganha o relatório de atendimento e a governança da IA no CRM (categorias liberadas, amostragem, GES-062).

## 15. Adendo: ajustes recebidos do subplano 05 (7/11/2026)

- O item lateral Timesheet tem as abas internas Meu tempo · Equipe · Rentabilidade · Confirmações; o contador de confirmações pendentes aparece no item lateral.
- Abrir a tarefa inicia o tempo; a lista tem pré-visualização; "pausar" aparece ao abrir outra tarefa.
- Gestão › Catálogo local recebe as tabelas de equivalência dos cores e a fila "atividade do core sem equivalente".
- Rentabilidade usa o custo-hora do escritório (gastos totais ÷ horas produtivas), com custo por cargo opcional.

## 16. Adendo: ajustes recebidos do subplano 06 (7/11/2026)

- Clientes e Societário ganha a tela "App do cliente": pessoas, papéis, pastas visíveis, serviços extras, instalação e último acesso.
- Gestão ganha o bloco de métricas do app (adoção, pendências resolvidas pelo app, tempo até envio, serviços ativos).

## 17. Adendo: ajustes recebidos do subplano 08 (7/11/2026)

- Tela **Configurações › Conectores** (Administrador): conexões, credenciais, saúde, custo do mês e teto.
- O cabeçalho da aba Notas fiscais lê a saúde dos conectores de captura; Gestão mostra custo por cliente e por conector.
- Caixa postal e DTE: a lista aparece sem dar ciência; o botão "abrir" avisa que conta como ciência na plataforma original.

## 18. Adendo: ajustes recebidos do subplano 09 (7/11/2026)

- Financeiro é item lateral com sete abas internas (Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado), identificadores `aba.financeiro.*`; permissões na tabela do 09, 10.6. Orçamento, comissões e divisão entre sócios existem desde a v1, desligados e com a mensagem "ainda não há dados suficientes para ativar".
- Configurações do Financeiro: escolha do banco do escritório para cobrança (08, 13.7).

## 19. Adendo: DA-02, plataforma comum com pacotes de área (8/11/2026)

- O item lateral **Painel** com as abas Societário, Obrigações, Notas, Fiscal, DP, Contábil, Consultoria e Gestão é o **Painel do pacote Contábil**. Outro pacote traz o próprio Painel (abas e perfil do cliente); o esqueleto da tela, o Início, o CRM, o Timesheet, o Financeiro e as Configurações são da plataforma.
- A visibilidade dos itens laterais e das abas vem da assinatura (pacotes e módulos) e do vínculo do usuário.

## 20. Adendo: decisões do UI lab (8/11/2026)

Decisões do usuário no UI lab (7/11/2026). Já corrigidos no corpo: 2.0 (barra lateral expansível, abas internas centralizadas, Início com três abas, CRM com "Números", Configurações com seis abas), 2.2 (Minha conta), 4 (Home como aba Visão geral, em widgets), 4.3, 6.8 (Financeiro sem seletor), 6.10 (CRM sem seletor de cliente), H5 e 7.3 (modo de espera). Aqui o que se acrescenta.

- **Widgets (seções 4 e 5).** Visão geral e todas as abas do Painel usam uma grade personalizável com uma caixa única para todo widget: tamanhos fixos (P, M, G, L, XL), arrastar, mudar tamanho, esconder, galeria para adicionar e restaurar padrão; grade responsiva de 2 a 8 colunas; só são oferecidos os tamanhos em que o conteúdo cabe; o arranjo padrão de cada aba fecha a grade sem buracos. Na anatomia de uma aba, o **cabeçalho (A) é fixo** e o resto (B a G) são widgets. O arranjo vai em `usuario.preferencias`, por tela, separado para cliente e carteira. Ao rolar, o conteúdo esmaece sob o cabeçalho.
- **Visão de carteira própria em cada aba (seção 6).** Cada aba tem uma composição de widgets para o cliente e outra para a carteira (Gestão é igual nas duas); exemplos do UI lab: certificados a vencer (Societário), semana por cliente (Obrigações), captura por cliente (Notas). Ação em lote na carteira continua gerando um cartão por cliente (5, E); o wireframe só registra e avisa.
- **Gavetas de formulário** (padrão único, com validação na hora): **histórico do perfil** (versões e datas, no cabeçalho A), **Gerar relatório** (período, formato, agendamento; bloco G) e **Nova tarefa** (prazo interno, responsável pessoa ou integrante; 7.1).
- **Quem vê o quê** (revisão do UI lab, conferida): abas do Painel pelo vínculo ao setor; Obrigações para quem tem setor com equipe; Gestão para Administrador e Gestor dos setores que gere; exceção por tela libera ou bloqueia uma aba inteira, com `nivel_max` (Fundações 3.5); Financeiro: Administrador e Gestor com o setor, Colaborador só por exceção (ler); Rentabilidade só Administrador e Gestor com Gestão ou Financeiro.
- **Ficha da tarefa** (7.2): mostra a conversa do CRM em que o assunto corre, o integrante, as sessões de tempo, a aba do Painel, o honorário em aberto e a ficha do cliente, cada um com o botão que leva até lá; abre de qualquer lista, cartão ou aviso.
- **Reajuste (6.8 e 09, 4.3):** a campanha de reajuste usa a rentabilidade do Timesheet para propor acima do índice a quem dá prejuízo (GES-014); a primeira versão do Financeiro liga só Contratos e as demais abas existem como desenho (fase 3).

**Pendentes de decisão** (o wireframe do UI lab difere do plano por escolha de desenho; a sessão-mãe perguntou ao UI lab onde ficaram contas a pagar, conciliação e a Visão geral, e a resposta virá depois):

| # | Tema | Opção A (plano) | Opção B (UI lab) | Situação |
| --- | --- | --- | --- | --- |
| U1 | **Abas do Financeiro** | Sete abas (09, 10.1; adendo 18): Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado | Quatro abas: Contratos · Cobrança · Caixa · Resultado, com todos os fluxos; contas a pagar, conciliação e a Visão geral ficam dentro delas ou em widgets, **a confirmar com o UI lab** | **Decidido em 8/11/2026: sete abas** (opção A). O UI lab acrescentou as três que faltavam (Visão geral, Contas a pagar e Conciliação) na segunda rodada (8/11/2026); `aba.financeiro.*` e as permissões do 09, 10.6, valem como estão |
| U2 | **Início** | Home sem abas, chat do Geral na gaveta (2.0 e 4 originais; Desenho 2.2) | Três abas: Assistente (abre aqui), Time, Visão geral (Home em widgets) | O corpo já segue a opção B por decisão explícita do usuário (decisão 2); **reverter 2.0 e 4 se a sessão-mãe preferir A** |
| U3 | **Painel em widgets** | Blocos fixos na ordem da anatomia A a G, "Tarefas deste setor" como bloco fixo (2.4) | Cabeçalho fixo e o resto em widgets que o usuário move, redimensiona e esconde (decisões 14 e 16) | O corpo registra B (decisão 14); **aberto:** se "Tarefas deste setor" pode ser escondido ou é obrigatório em toda aba |
| U4 | **Clientes e Arquivos** | Item **Clientes** no núcleo (10, 2.5, A10) e aba "Clientes e Societário" dividida; sem item Arquivos | Sem item Clientes na barra (ficha do cliente aberta de dentro das telas); módulo **Arquivos** com a árvore por cliente (descrito no PLANO do UI lab, fora da lista da barra lateral) | **Resolvido em 8/11/2026** (00, seção 9): no cenário B (contabilidade com BPO) a ficha do cliente continua no Painel (Societário) e a legalização também; **Arquivos** é módulo da plataforma na barra (o UI lab já o tem); o item **Clientes** só existe no BPO puro (C1, sem Painel), a tratar na fase do C1 |
| U5 | **Ordem das abas do Timesheet** | Meu tempo · Equipe · Rentabilidade · Confirmações (05, 8.1) | Meu tempo · Confirmações · Equipe · Rentabilidade | Baixa; escolher uma |

## 21. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seções 2, 5 e 11.2 (A10).

- **Navegação com um item por pacote** (DA-02.1, item 9): Início, **Clientes** (só no BPO puro, C1, sem Painel; decidido em 8/11/2026, U4 do adendo 20), o item do pacote contábil (**Painel**), CRM, Timesheet, Arquivos, Financeiro, **BPO**, Configurações (e Suporte no pé). O C1 (BPO financeiro puro) não tem o Painel; ninguém vê aba de pacote que não contratou, sem decompor o Painel contábil.
- **Legalização** (SOC-025 a 043) é do Painel contábil; o cadastro, as pessoas, as identidades e o ciclo ficam na **ficha do cliente**, no Painel (Societário) no cenário B, e no item Clientes só no BPO puro (C1), a tratar na fase do C1 (decisão de 8/11/2026).
- **Item BPO** (posição na barra: **Financeiro, BPO, Configurações**, decidido em 8/11/2026; o 10, 2.2, foi corrigido), com nove abas (`aba.bpo.*`): Visão geral, Carteira, Fila e pedidos, Rotinas, Aprovações, Entregas e SLA, Volume e faturamento, Rentabilidade e capacidade, Configuração. Não é aba do Painel. Permissões por papel na tabela de 10, 5.4; margem e custo-hora nunca liberáveis por exceção.
- A seção 3.5 deixa de tratar o BPO como perfil sem equipe (corrigido no corpo): é pacote de área e modo da plataforma. A barra superior ganha a troca de contexto mãe e contratante sem novo login (2.2, corrigido no corpo).

## 22. Adendo: ajustes pendentes do subplano 05 (aplicados em 8/11/2026)

O pedido A13 do 05 (12.2) estava só em parte no adendo 15. Aplicado o que faltava: o cabeçalho da tarefa (7.3) ganha os botões **"pausar"** e **"não era esta"** (corrige o cliente ou a tarefa da sessão em curso, vira item de confirmação); a **Home do Gestor** recebe a **carga prevista** (tarefas abertas × horas padrão por pessoa); o bloco Equipe de Gestão (6.9) aponta para **Timesheet › Equipe**.

## 23. Adendo: suporte geral e pendências do UI lab fechadas (8/11/2026)

Rodada de decisões do usuário em 8/11/2026.

- **Suporte (P25).** A barra lateral ganha o ponto de entrada **Suporte**, no pé (acima de Configurações), com atalho no menu do usuário (Minha conta): abre o **chat de suporte com pessoas** e, dentro dele, o **assistente de ajuda padrão**, que responde só sobre o sistema e as configurações dele, com limite mensal de perguntas (hipótese: 30) e encaminhamento para a equipe ao atingir o limite ou sem resposta (e, desde 8/11/2026, diagnóstico em leitura pelo escopo de quem pergunta; adendo 25). Aparece para todo usuário, em qualquer pacote, e continua acessível no modo de espera. Não é aba do Painel nem integrante do usuário; regras em Fundações, adendo 24, e no Desenho 1.10. O Colaborador vê a quantidade de perguntas restantes no mês, nunca tokens nem custo.
- **Financeiro em sete abas (U1): decidido.** Visão geral · Contratos · Cobranças · Contas a pagar · Conciliação · Fluxo de caixa · Resultado, como no 09, 10.1. O wireframe tinha quatro; o UI lab acrescentou as três que faltavam (Visão geral, Contas a pagar, Conciliação) na segunda rodada. Corrigidas as menções "sete ou quatro, pendente de decisão" em 2.0, 6.8 e no adendo 20.
- **Clientes e Arquivos (U4): resolvido.** Cenário B: ficha do cliente e legalização continuam no Painel (Societário); **Arquivos** é módulo da plataforma na barra; o item **Clientes** do 10 só existe no BPO puro (C1), na fase do C1. Ordem dos itens: Início, Painel, CRM, Timesheet, Arquivos, **Financeiro, BPO, Configurações** (o BPO fica entre Financeiro e Configurações; no BPO puro, o BPO ocupa o lugar do Painel).
- **Aprovado pelo usuário no UI lab:** o **arranjo padrão dos widgets**, as **oito abas do Painel** (Societário, Obrigações, Notas, Fiscal, DP, Contábil, Consultoria, Gestão) e o **Timesheet** como desenhado. Continuam abertas, por não terem decisão expressa: U3 (se "Tarefas deste setor" é widget obrigatório ou escondível) e U5 (ordem das abas do Timesheet; o UI lab usa Meu tempo · Confirmações · Equipe · Rentabilidade).

## 24. Adendo: decisões do UI lab, segunda rodada (8/11/2026)

Segunda entrega do UI lab (`ui-lab/PLANO.md` e `REVISAO.md`, 8/11/2026), com o Financeiro em sete abas, o Suporte, Arquivos e o BPO desenhados. Os reagrupamentos (Início com três abas, Painel com oito e Obrigações própria, Painel só com setor contábil, Financeiro, Arquivos e BPO como módulos laterais, seletor por módulo) e a tela de Suporte já estão no corpo, em 2.0, 2.3, 3.2, 6.2 e 6.8. Aqui só o que se acrescenta.

- **Quem vê o Painel:** o item exige o pacote Contábil na assinatura **e** setor contábil no vínculo; o C1 e o usuário só do BPO não o veem. A regra de visibilidade das abas (9) vale dentro dele.
- **Abas do BPO por papel** (10, 5.4): Colaborador seis, Gestor do BPO oito (edita a Configuração, sem margem), Administrador nove. O nome curto na aba e o completo no título é o mesmo padrão do Painel.
- **Aberto, sem decisão:** ordem das abas do Timesheet (U5) e se "Tarefas deste setor" é obrigatório (U3); ordem de Arquivos e Timesheet na barra (o plano põe CRM, Timesheet, Arquivos; o UI lab, CRM, Arquivos, Timesheet; 00, seção 10). **Limitações do wireframe, sem regra:** os blocos próprios de cada aba do Painel têm os números da Metalúrgica Andrade para todos os clientes; persistência, tempo real entre aparelhos e offline são da fase de stack (10, seção 12).

## 25. Adendo: respostas finais do BPO, faturamento e suporte (8/11/2026)

- **Suporte com diagnóstico (Q9 do 10):** a **Ajuda do sistema** lê configurações, dados e estrutura do escritório **só dentro das permissões da pessoa que perguntou** e **não altera nada sem aprovação dela**: a correção aparece como **cartão de aprovação** no mesmo lugar dos demais cartões. A tela Suporte ganha, em **Falar com a equipe**, o aviso "a equipe pediu para ver sua tela" com **Aceitar** (prazo visível, padrão 30 minutos) e **Encerrar**; sem aceite nada abre, e o **Histórico** lista cada sessão com quem pediu, quando e por quanto tempo (Fundações, adendo 26). O Colaborador continua vendo só as perguntas restantes do mês, nunca tokens nem custo.
- **Papel por serviço (Q8):** o seletor de cliente do Painel e do BPO não muda; a ficha, em **Contatos**, mostra o papel e as áreas da pessoa **por serviço contratado** (linhas `contabil` e `bpo_financeiro`) e a alçada de pagamento na linha do BPO (10, 3.9).
- **Faturamento (Q6):** a aba Cobranças do Financeiro mostra **uma cobrança por mês** por cliente, com os serviços em linhas e a NFS-e de cada um (09, adendo 17).

## 26. Adendo: últimas decisões (8/11/2026)

- **Suporte:** a parte **Ajuda do sistema** da tela Suporte abre com **seções básicas de FAQ** (lista curta, pesquisável); abaixo, o campo do assistente; em seguida, **Falar com a equipe**. Ordem de uso: FAQ, assistente, equipe. Premissas da sessão de tela mantidas (30 minutos, até 5 leituras por pergunta, sem gravação).
- **Rentabilidade e Equipe (Timesheet):** a barra de filtros ganha o chip **"Pacote: Contábil | BPO | Todos"** (padrão Todos); o custo-hora exibido é o do escritório, único (05, adendo 19).
- **Escalonamento do lote** do BPO: o sino do Gestor do BPO e do sócio recebe o alerta de véspera com a lista de contas e o alerta de "vencido sem aprovação"; a Visão geral do BPO marca a empresa em vermelho (10, 3.6).

## Adendo: itens do painel do Leandro aprovados (9/11/2026)

Decididos na [Lista de decisão do painel do Leandro](../Lista_de_Decisao_Painel_do_Leandro.md) (de acordo com o Enzo). **Regra:** entram **agentificados**, como integrantes do time que agem por gatilho, perguntam só a dúvida, preparam no cartão de aprovação e aprendem com a decisão da equipe; não como cópia das rotinas e telas do painel dele. Nada sai ao cliente sem aprovação humana no início. Detalhes de cada item ("Como fica agentificado") estão na lista.

| Itens | O que entra |
| --- | --- |
| D-03, D-11, D-12, D-13, D-14, D-15 | Controle mensal de distribuição de lucros na ficha do cliente (6.6, bloco novo): leitor de extratos (OFX, CSV, planilha, PDF), contas esperadas por banco, classificação em cinco perguntas, alerta de R$ 50 mil, trava depois do REINF e exportação do trimestre. **Sobe de fase 4 (P3) para primeiro corte (P1).** |
| D-16, D-26, D-27 | Fluxo de assinatura do contador (fila, conferência real da assinatura dentro do PDF, envio ao cliente só com aprovação); travas antes de enviar relatório (faturamento zerado, lucro maior que faturamento, balancete que não fecha); informe financeiro com nota, depois. |
| D-20 a D-23, D-25 | Faixas vencido, 7 e 30 dias e Mais urgentes; filtros por fase do cliente; Kanban do fechamento e Minha fila; guias eventuais só quando há imposto; lista de exclusão de setores por escritório. |
| D-06 | Bloco de manutenção em Configurações › Armazenamento. |

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-01 Kit de rescisão | Agora | 03, 6.5 (Rescisão); 02, 3.2 (DP); 08 (FGTS Digital e Empregador Web, robô com certificado) | DP |
| C2-02 Simulados de rescisão | Agora | 03, 6.5 (bloco "Simulados"); 06 (pedido de simulado no app); 04 (régua) | DP |
| C2-03 Boletos de sindicato, convênio e seguro de vida | Agora | 03, 6.5 (Guias, holerites, pagamento); 02, 3.2 (gatilho do dia 25); 08 (robô de portal, depois) | DP |
| C2-04 Resumo da convenção coletiva | Agora | 03, 6.5 (Convenções); `atividades.json` DP-201 da fase 4 para a 2; 07 (motores) | DP e Consultor |
| C2-05 Recálculo de guias de FGTS e de sindicato | Depois | 03, 6.5; FIS-201 ampliado | DP |
| C2-06 Termo de ciência com assinatura e acompanhamento | Agora | 01 (ferramentas de documento e assinatura); 03, 7.4; 04 (régua) | Do setor (DP) |
| C2-09 Malote e documentos em papel | Agora | 04 (canais e comunicados); 03, 6.1 (preferência de entrega na ficha); Arquivos (origem "malote") | Gestão e Atendimento |
| C2-14 Declaração de faturamento assinada pelo contador | Agora | 03, 6.6 (Relatórios ao cliente, junto do DECORE); 06 (pedido padronizado); D-16 (assinatura) | Contábil |
| C2-15 Pesquisas do IBGE (PAC e PAS) | Agora | 07 (regras de obrigação, eventual); 03, 6.2 | Contábil |
| C2-16 DMED no calendário | Agora | 07 (regras de obrigação por CNAE); 03, 6.2 | Fiscal |
| C2-20 Renovação do registro e do certificado nos conselhos | Agora | 03, 6.1 (Legalização e processos); SOC-046 | Societário |
| C2-21 Fiscalização de licença como processo | Agora | 03, 6.1; 02, 3.2 (gatilho) | Societário |
| C2-22 Taxa anual de licença municipal | Agora | 03, 6.1 e 6.4 (central de guias); 07 (regra anual por município) | Societário |
| C2-23 Certificação digital como serviço | Depois | SOC-201 e GES-205 da fase 5 para a 3; 03, 6.1 (Certificados); 09 (faturamento) | Societário e Financeiro do escritório |
| C2-24 Termo de reativação de serviços | Só a ideia | 03, 8 (trilhas); CIC-001 | Societário |
| C2-25 Comanda digital de serviço extra | Agora | 03, 7.2 (detalhe da tarefa: marcar extra); 05 (horas do extra); 09 (fatura, fase 3) | Do setor |
| C2-26 Perfil de apoio (recepção) | Agora | Fundações 3.4 e 3.5 (exceção); 03, 9.3 | Geral |
| C2-27 Registro de ocorrências críticas | Só a ideia | 03, 6.9 (Gestão); GES-019 (fase 3) | Gestão e Atendimento |
| C2-28 Pauta da reunião semanal | Só a ideia | 02, 9 (Geral); 03, 6.9 | Geral |
| C2-29 Lembrete interno que só some com confirmação | Só a ideia | 03, 7.6; GES-061 | Geral |

## Adendo: aba Obrigações dinâmica por setor (14/11/2026)

Decisão do Enzo, depois da reclamação dos contadores de que a aba Obrigações ficava "fora do Fiscal". A aba continua **compartilhada**, mas deixa de ser uma visão só do Fiscal (`fiscal` como dono da projeção, na tabela da seção 2): **cada obrigação tem o setor dono** (Fiscal, DP, Contábil, Societário, Gestão), e a aba mostra **as obrigações do setor de quem olha, com o integrante daquele setor**.

| Quem olha | O que vê |
| --- | --- |
| Pessoa com **um setor** | Só as obrigações do seu setor e o integrante dele; sem seletor |
| Pessoa com **vários setores** (ex.: Contábil e Fiscal) | Chips no topo com os seus setores, todos marcados; desmarca para focar; o integrante mostrado é o do setor do item |
| **Gestor** e **Administrador**, ou conta configurada para isso | Seletor "Meus setores · um setor · todos"; o padrão é "meus setores" |

Cada aba de setor (Fiscal, DP, Contábil, Societário) ganha também o bloco **"Obrigações do setor"**: as próximas do setor, com o mesmo dado, e o link "ver todas" que abre a aba Obrigações já filtrada. Assim a obrigação aparece dentro do setor sem duplicar o calendário. No cliente, a aba mostra a agenda dele filtrada pelos setores de quem olha; na carteira, a semana por cliente com o mesmo filtro. O dono da obrigação é a regra (subplano 07) e o vínculo usuário × setor (Fundações 4.1). **Pendente no protótipo** (repositório Heild, branch `prototipo`): hoje a aba mostra todas as áreas do cliente.
