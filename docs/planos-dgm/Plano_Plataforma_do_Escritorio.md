# Plano: Plataforma agêntica do escritório

5 de novembro de 2026

Rascunho para discussão entre o fundador e os dois contadores. Este documento avalia a ideia de levar o assistente legal para dentro de uma plataforma que reúne tudo o que o escritório faz fora dos sistemas contábeis "core" (Domínio, Alterdata, Contmatic). Ele traz o inventário de atividades por aba, as APIs necessárias, uma linha do tempo e uma triagem do que construir. **[A CONFIRMAR]** marca o que precisa ser verificado com o fornecedor, com o órgão ou na prática antes de entrar no cronograma.

Os outros planos continuam valendo para o assistente legal: [Plano do Assistente](Plano_Assistente_de_IA_para_Contadores.md), [Plano de Ingestão](Plano_de_Ingestao_da_Base_Legal.md) e [Plano de 6 meses](Plano_MVP_6_meses.md). A seção 9 mostra o que muda neles.

---

## 1. Parecer sobre a ideia

### 1.1 A ideia faz sentido?

Sim, e é mais forte como negócio do que o assistente sozinho:

- **Uso diário.** Um assistente de perguntas é aberto algumas vezes por semana. Um painel com obrigações, notas, caixa postal e WhatsApp fica aberto o dia inteiro. Isso dá retenção e justifica um preço por escritório, não por pergunta.
- **Dados próprios.** O assistente hoje sabe a lei, mas não sabe nada do cliente. Dentro do painel, ele conhece regime, CNAE, UF, notas emitidas, folha e histórico de conversa. Essa é a diferença entre "o que diz a lei" e "o que isso significa para o cliente X".
- **Distribuição.** O próprio plano do assistente aponta que a IA dentro do ERP vence em distribuição (Plano do Assistente, "O que o mercado tem em comum"). A plataforma é o nosso "ERP": o lugar onde o contador já está.
- **Timesheet como subproduto.** Se toda ação do sistema vira um evento com usuário, cliente, atividade e duração, o timesheet automático sai quase de graça. É o que permite o relatório que quase nenhum escritório tem: **custo real de cada cliente contra o honorário cobrado**.

### 1.2 Os riscos sinceros

1. **Escopo de um time inteiro, com uma pessoa.** Hubstrom, Acessórias, Gestta, SIEG, Qive (ex-Arquivei), Onvio e os CRMs de WhatsApp são empresas com dezenas de desenvolvedores, cada uma cobrindo um ou dois dos cinco blocos. Fazer tudo com profundidade levaria anos. A saída é a triagem da seção 8: poucos módulos, muito bem integrados, com a IA como diferencial.
2. **Conflito com o plano atual.** O Plano de 6 meses põe o M1–M6 inteiro na arquitetura completa do assistente, e o Plano do Assistente diz explicitamente que o produto "não é um sistema de rotina contábil". A plataforma muda isso. Não dá para fazer as duas coisas com a mesma pessoa no mesmo prazo; é preciso decidir a ordem (seção 7).
3. **Integração com o governo é a parte frágil.** Boa parte do que o escritório faz por fora acontece em portais sem API (e-CAC, Sefaz estaduais, prefeituras, Juntas). Onde há API oficial, a automação é sólida. Onde não há, ela depende de robô com certificado digital, que quebra quando o portal muda e exige cuidado jurídico (seção 3).
4. **Responsabilidade e LGPD.** O sistema passa a guardar certificados digitais A1, procurações, dados fiscais e de folha de todos os clientes. Um vazamento aqui é muito mais grave que no assistente legal. Cofre de certificados, isolamento por escritório e registro de acesso entram no núcleo, não depois.

### 1.3 A super automatização é possível?

Em grande parte, sim, mas com três níveis de confiança diferentes:

| Nível | O que é | Exemplos | Confiabilidade |
| --- | --- | --- | --- |
| **A. API oficial** | O órgão ou o fornecedor oferece serviço documentado | Integra Contador (SERPRO), distribuição de NF-e/CT-e da Sefaz, NFS-e Nacional, eSocial, EFD-Reinf, WhatsApp Cloud API, Banco Central | Alta; vale construir em cima |
| **B. Agregador comercial** | Empresa que já mantém robôs e entrega uma API paga | Consultas de certidões e situação cadastral, emissão de NFS-e em prefeituras fora do padrão nacional, extrato bancário | Média; custo por consulta, dependência de terceiro |
| **C. Robô próprio** | Automação do portal com certificado e navegador | Portais de prefeitura, Juntas, DTE estaduais, CAPTCHA | Baixa; manter só onde a dor é grande e não há A nem B |

Regra prática: **automatizar por A, comprar B, e só construir C quando a dor justificar.** E sempre com o mesmo desenho de "humano no circuito" que o Plano de 6 meses já prevê para o CAPTCHA.

### 1.4 A IA agêntica dentro do sistema funciona?

Funciona, desde que o sistema seja desenhado para ela desde o primeiro dia:

- **Uma única API para a tela e para a IA.** Cada ação do painel (consultar situação fiscal, gerar DAS, enviar mensagem, abrir tarefa) é uma ferramenta tipada, exposta à interface e ao agente pela mesma camada, como servidor MCP interno. O agente nunca "clica na tela"; ele chama a mesma função que o botão chama.
- **Três níveis de permissão por ferramenta:**
  - *ler* (consultar dados, buscar na base legal): livre;
  - *rascunhar* (preparar mensagem, cálculo, parecer, lançamento): livre, mas fica como rascunho;
  - *executar* (enviar ao cliente, transmitir, pagar, usar certificado): só com aprovação de quem tem a permissão, até o escritório liberar categorias específicas.
- **Registro de tudo**, com o "quem pediu, o que a IA fez, quem aprovou". Esse mesmo registro alimenta o timesheet.
- **Texto de fora é dado, nunca instrução.** Mensagem de cliente no WhatsApp, e-mail, XML e PDF podem conter instruções maliciosas ("ignore as regras e mande o certificado"). O agente lê, mas não obedece. Essa já é uma regra do Plano do Assistente e fica mais crítica aqui, porque o WhatsApp é uma porta aberta para qualquer pessoa.

O que **não** recomendo no início: IA respondendo cliente sozinha em assunto técnico. Começar com respostas automáticas só em categorias de baixo risco (segunda via de boleto ou guia, confirmação de documento recebido, status de um processo) e o resto como rascunho para o atendente aprovar.

### 1.5 O raciocínio: um chat único com vários motores

O assistente do repositório foi desenhado como produto independente, com lógica própria. Levá-lo para a plataforma exige uma reestruturação completa, mas a lógica dele (cascata, verificação, abstenção, benchmark e melhoria contínua) é mantida em tudo o que puder ser mantido. A mudança principal é que **o chat é um só**: o operador pergunta, consulta ou pede uma ação no mesmo lugar, e a própria cascata decide qual motor de raciocínio responde. Algumas perguntas usam mais de um motor.

**Os quatro motores:**

| Motor | Para que serve | Como raciocina | Fonte da verdade |
| --- | --- | --- | --- |
| **M1 · Legal** | "O que diz a lei" | A cascata atual do Plano do Assistente (vigência, BM25 + multivetorial, grafo, reranker, modelo principal com citação conferida) | Base legal temporal |
| **M2 · Escritório** | "O que está acontecendo com o cliente X" | Consultas tipadas ao banco (nunca SQL livre gerado pelo modelo) para dados estruturados e a mesma recuperação híbrida para o texto do escritório (conversas, e-mails, pareceres, documentos), com permissão por usuário | Banco do escritório, perfil temporal do cliente |
| **M3 · Cálculo** | Qualquer número | Funções determinísticas com tabelas versionadas (Simples, fator R, multa e juros, simulações da reforma). O modelo explica, mas não faz a conta | Código + base legal (para a regra vigente) |
| **M4 · Ação** | "Faça isso" | Planejador que monta uma sequência de ferramentas da plataforma e a executa com o nível de permissão de cada uma (ler, rascunhar, executar com aprovação) | Camada de ferramentas (seção 2) |

**A cascata ganha uma etapa 0, antes de todas as outras:**

```
Mensagem do operador
        │
0 · Roteador de intenção ...... classifica: pergunta legal, consulta do escritório,
        │                       cálculo, ação, ou uma combinação; extrai cliente e data
        │
        ├── só M1 ─────► cascata legal atual (etapas 1 a 7)
        ├── só M2 ─────► consultas tipadas + recuperação no texto do escritório
        ├── M3 ────────► função de cálculo (os dados vêm de M2, a regra de M1)
        ├── M4 ────────► plano de ações → confirmação no chat → execução
        └── combinação ► plano em passos: cada passo chama o motor certo,
                          e o resultado de um alimenta o próximo
        │
Verificação única ............. toda afirmação aponta para a fonte:
        │                       o dispositivo legal vigente ou o registro do banco
Resposta, cálculo ou cartão de ação para aprovar
```

**Exemplos de combinação:**

- "O cliente Padaria X pode usar o fator R em 2025?" → M2 (folha e receita dos 12 meses) → M1 (regra vigente, LC 123/2006) → M3 (cálculo) → resposta com a norma citada e os números de origem.
- "Quais clientes do Simples são afetados pela norma publicada ontem e avise cada um" → M1 (o que a norma muda) → M2 (clientes com aquele perfil) → M4 (rascunho de mensagem por cliente, aprovado em lote).
- "Manda a guia do DAS de março para o cliente e pergunta se ele já pagou o parcelamento" → só M4 (e M2 para achar a guia e o parcelamento).

**O que é mantido do repositório:**

- toda a Camada 1 e a cascata do M1, sem mudança de lógica;
- a verificação em etapa separada, estendida para citar registros do banco além de normas;
- a abstenção ("não encontrei base legal" e também "não encontrei esse dado no sistema");
- o roteamento por dificuldade e por modelo (Haiku, Sonnet, Opus) da pesquisa 08, agora aplicado também a M2 e M4;
- o benchmark e o ciclo de melhoria (Camada 4), agora com três tipos de caso: perguntas legais com gabarito, consultas do escritório com resultado verificável e tarefas de ação com resultado esperado. O roteador da etapa 0 também é medido (a pergunta foi para o motor certo?);
- a DGM, que passa a poder evoluir o roteador, as instruções dos motores e o planejador do M4. Continuam fora da área editável: a base legal, os cálculos, as permissões das ferramentas e as regras de segurança. O benchmark do escritório usa dados anonimizados ou sintéticos.

**O que muda:** o "perfil do cliente opcional" do Plano do Assistente deixa de ser um campo que o contador preenche e passa a ser lido do banco, na data da pergunta. O modelo temporal da base legal (redação vigente na data) é repetido no cliente (regime, CNAEs, sócios e endereço vigentes na data).

**O que recomendo adiar, sem tirar do plano:** Search-R1, Rank1 destilado, DGM, RAPTOR e HippoRAG continuam atrás de chaves e entram quando o benchmark tiver tamanho para medi-los. Com 50 a 200 casos não há sinal estatístico suficiente para separar uma versão melhor de ruído.

### 1.6 Agêntico desde a primeira linha de código

O sistema agêntico não é um módulo para depois: é uma regra de construção desde a fase 0.

1. **Toda funcionalidade nasce como ferramenta.** Antes da tela, cada ação é uma função tipada com entrada, saída, nível de permissão e descrição para o modelo. A tela e a IA chamam a mesma função.
2. **Nenhuma ação só pela tela.** Se o operador consegue fazer, a IA consegue pedir para fazer (com a permissão adequada). Isso entra como critério de aceite de cada módulo.
3. **Toda ação gera evento** (quem, para qual cliente, qual atividade, início e fim, pessoa ou IA, quem aprovou). O mesmo registro serve à auditoria, ao timesheet e ao benchmark de tarefas.
4. **Toda leitura respeita permissão**, inclusive quando quem lê é a IA em nome de um usuário.
5. **Confirmação no chat** para ações de nível "executar": a IA mostra um cartão com o que vai fazer e para quem, e o operador aprova, edita ou recusa.
6. **Servidor MCP interno** expondo as ferramentas, para que o chat, automações agendadas e integrações externas usem o mesmo caminho.

---

## Decisões de arquitetura registradas

### DA-01 (6/11/2026): dados separados por escritório desde a base, em dois níveis

**Decisão.** A plataforma nasce com separação de dados em dois níveis: o **inquilino** (o escritório que contrata a plataforma, ou o BPO) e, dentro dele, o **subinquilino** (cada escritório contratante atendido por um BPO), cada um com as suas empresas clientes. Um escritório comum usa só o primeiro nível; o segundo fica pronto para a linha de escritório para escritório.

**Por quê.** Fazer isso depois exige mexer no modelo de dados inteiro (pesquisa B10). A separação vale para tudo, não só para as tabelas:
- dados e documentos;
- permissões e usuários;
- o índice de busca e a memória da IA (o agente de um escritório nunca recupera texto de outro);
- marca, remetente de mensagens e base de conhecimento;
- registro de eventos e timesheet;
- cofre de certificados e procurações.

**Como.**
- Política por linha (row-level security) no Postgres em toda tabela com dado de cliente, com `FORCE ROW LEVEL SECURITY`: superusuários, papéis com `BYPASSRLS` e o dono da tabela passam por cima da política se ela não for forçada.
- A aplicação nunca conecta como dono das tabelas nem como superusuário.
- O inquilino e o subinquilino da sessão vêm da autenticação, nunca de um parâmetro que o usuário ou a IA possa mudar; as ferramentas do agente (seção 1.6) herdam esse contexto.
- Testes automáticos de vazamento entre inquilinos rodam a cada mudança, incluindo buscas da IA.

**Consequências.** O BPO não exige refazer a base (o BPO financeiro está na fase 3c do catálogo, decisão de 8/11/2026; o BPO entre escritórios, depois); o custo extra fica concentrado na fase 0. Pontos ainda em aberto, registrados no B10: o modelo do app com a marca do contratante (a regra 4.2.6 da App Store exige a conta do próprio contratante ou um app único com seletor) e o contrato de tratamento de dados entre controlador, operador e suboperador.

---

### DA-02 (8/11/2026): plataforma comum com pacotes de área, não limitada à contabilidade

O painel contábil não é obrigatório por natureza: é o primeiro **pacote de área** (vertical) de uma **plataforma comum**. A estrutura geral, o design, a UX e os raciocínios de IA servem a outras áreas (exemplo do usuário: o mesmo sistema com painel para advogados). A empresa pode vender produtos com o mesmo núcleo e "serviços principais" diferentes: *{nome} Contábil*, *{nome} BPO Financeiro*, *{nome} Direito* e assim por diante. Nenhuma outra área é estudada agora; a decisão é só **não amarrar a estrutura a uma área**.

| Camada | O que é | Exemplos |
| --- | --- | --- |
| **Plataforma** (núcleo, obrigatória) | Tudo o que não depende da área | Inquilinos e contas, papéis, cadastro único, tarefas, documentos e índice, eventos, ferramentas tipadas, notificações, framework de conectores, Time de agentes (framework), tema, motores genéricos (roteador, Escritório, Ação), Gestão |
| **Módulos da plataforma** (opcionais; servem a qualquer pacote; subplano 10, P6 e 9.1) | O que não depende da área, mas não é obrigatório: só as dependências técnicas reais travam a seleção | CRM, Timesheet, App do cliente (portal), Financeiro do escritório (honorários, cobrança, contas, conciliação), Open Finance, marca branca |
| **Pacote de área** (escolhido por produto; pelo menos um) | Tudo o que depende da área | Catálogo de atividades, setores e abas do Painel, schema do perfil do cliente, obrigações e calendário, motor Legal com a base legal da área, tabelas de cálculo, conectores dos órgãos da área, integrantes padrão, modelos de texto, trilhas de implantação, benchmarks |
| **Módulos extras** (da plataforma ou do pacote) | Opcionais, vendidos à parte | Modo BPO entre escritórios (modo da plataforma), plano de IA, Consultor da empresa (o BPO financeiro é pacote de área, DA-02.1; Open Finance e marca branca estão entre os módulos da plataforma) |

Regras para o desenho e para o código:

1. **O núcleo não assume contabilidade.** Termos, campos, setores, obrigações e fontes legais vivem como **dados e configuração do pacote**, não como código do núcleo. Os documentos já escritos usam o vocabulário contábil porque o primeiro pacote é contábil; o código do núcleo não pode.
2. **Setores fixos valem dentro de um pacote.** A decisão "setores fixos, iguais às abas" continua: o pacote contábil tem os seus; outro pacote terá os dele. O escritório não funde nem cria setores dentro do pacote.
3. **O perfil do cliente tem schema do pacote** (no contábil: regime, CNAEs, UF, município; em outra área, os campos dela). O cadastro único, as identidades, os documentos e as tarefas são do núcleo.
4. **Os motores** (roteador, Escritório, Ação) são do núcleo; **Legal e Cálculo são plug-ins do pacote** (base legal, tabelas e funções da área).
5. **Assinatura = plataforma + pacote(s) de área + módulos.** O módulo Painel contábil deixa de ser "obrigatório" e passa a ser "o pacote de área obrigatório do produto contábil". Um produto pode ter outro pacote no lugar (por exemplo, BPO financeiro sem as abas Fiscal, DP e Contábil).
6. **Marca e nome por produto:** o tema e a marca branca já separam o produto do escritório; o nome comercial de cada produto é uma configuração da empresa.
7. **O que fica de fora agora:** estudar outras áreas, criar pacotes novos ou renomear os documentos. Quando surgir uma nova área, o trabalho é criar o pacote (catálogo, abas, perfil, motores plugáveis), não reconstruir a plataforma.

#### DA-02.1 (8/11/2026): vários pacotes de área no mesmo escritório

Caso que motiva: uma contabilidade compra também o produto de BPO. Ela não deve contratar duas plataformas. O escritório tem **uma assinatura, um login, um cadastro de clientes** e vê, na lateral, **um item por pacote** (por exemplo, *Painel* do pacote Contábil e *BPO* do pacote BPO), cada um com os seus setores e abas. Para decidir o que fica onde quando as funcionalidades se cruzam, vale a regra:

> **Se mais de um pacote precisa de uma função, ela é da plataforma e existe uma vez só; cada pacote a usa no seu contexto. Só o que é específico de um pacote fica nele. Duplicar uma função em dois pacotes é erro de desenho.**

Três classes de cruzamento e o tratamento de cada uma:

| Classe | Tratamento | Exemplos |
| --- | --- | --- |
| **Compartilhado de verdade** (uma só coisa para todos os pacotes) | Plataforma; os itens dos pacotes aparecem **filtrados por pacote e por setor**, nunca duplicados | Cadastro de clientes e pessoas, tarefas, documentos e pastas, conversas e número de WhatsApp por setor, Timesheet, notificações, agenda e calendário do cliente, app do cliente, plano de IA do usuário, tema |
| **Mesmo componente, contexto diferente** | O componente é da plataforma e recebe um **titular**: o escritório ou a empresa cliente. Cada pacote o usa com o seu titular; os dados não se misturam | Contas a pagar, contas a receber, conciliação, cobrança, fluxo de caixa, DRE: no **Financeiro do escritório** o titular é o escritório (honorários, despesas); no **BPO** o titular é a empresa cliente. Mesma tela de conciliação, mesma lógica, titulares diferentes |
| **Específico do pacote** | Fica no pacote, sem aparecer no outro | Obrigações e guias (Contábil); fila e SLA do contratante, aprovação de pagamento do cliente, alçadas (BPO); base legal e cálculo tributário (Contábil); rotinas de pagamento (BPO) |

Regras de aplicação:

1. **Um cliente, um cadastro, vários serviços.** A empresa atendida pela contabilidade e também pelo BPO é o mesmo cliente. O perfil tem uma parte por pacote (no Contábil: regime, CNAEs; no BPO: bancos, alçadas, rotina de pagamento), e o cliente carrega a lista de **serviços contratados** (cada um liga a um pacote).
2. **Setores pertencem ao pacote, e o vínculo do usuário é por setor.** Um colaborador pode ter setores dos dois pacotes. O acesso às abas e às ferramentas segue a regra de interseção já existente; nada novo na permissão.
3. **Uma lista de tarefas, com filtro de pacote.** O calendário do cliente mostra obrigações do Contábil e rotinas do BPO juntas, com cor por pacote.
4. **Um Timesheet.** O catálogo de atividades é a união dos catálogos dos pacotes; a rentabilidade do cliente soma o que ele paga ao escritório (honorário contábil mais taxa de BPO) contra todas as horas gastas.
5. **Um contrato de honorários por cliente, com itens por serviço.** O Financeiro do escritório fatura uma vez: **uma fatura e uma cobrança por mês**, com linhas do Contábil e linhas do BPO e a pré-visualização já decidida; **as notas fiscais saem por serviço** (cada serviço respeita a própria tributação), como **uma NFS-e por serviço**, o padrão, porque o **layout nacional decide** (o mesmo em toda a federação) e ainda **não está confirmado** que uma DPS aceite vários serviços **[a confirmar na NT 007/2026]** (decisão de 8/11/2026; 09, 4.5 e 5.5). A mesma pessoa, com contabilidade e BPO na mesma empresa, usa **um só app e um só acesso**, com papel e áreas por serviço contratado (Fundações 2.3).
6. **Um app do cliente.** Mostra as seções dos pacotes que o cliente contratou (documentos e guias do Contábil; aprovações de pagamento e fluxo de caixa do BPO).
7. **Um Time de agentes.** Os integrantes padrão vêm por setor de cada pacote ativo; o Geral e o Consultor continuam únicos; o plano de IA é por usuário, não por pacote.
8. **Preço sem dupla cobrança.** A plataforma (base, faixa de clientes, usuários, GB) é cobrada **uma vez**; cliente atendido pelos dois pacotes conta **uma vez** na faixa. Cada pacote soma os seus módulos e o seu componente de uso.
9. **Navegação (ordem decidida em 8/11/2026):** Início, o item do pacote contábil (**Painel**, só para quem tem setor contábil), CRM, Timesheet, Arquivos (módulo da plataforma), Financeiro, o item do pacote **BPO** e, **no pé, Suporte e Configurações**; ou seja, **Financeiro, BPO, Configurações** no fim. O seletor de cliente é **por módulo** (no Painel só as empresas da contabilidade; no BPO só as de BPO; some no CRM, no Financeiro e em Configurações). O item **Clientes** só existe no BPO puro (C1, sem Painel): no cenário com Painel, a ficha do cliente continua no Societário. O que é da plataforma não se repete dentro de um pacote; o pacote só traz o que é dele.
10. **Simetria da barra lateral (decisão do usuário, 8/11/2026):** o item do pacote de área (*Painel* no Contábil, *BPO* no BPO Financeiro) é o **trabalho do pacote para o cliente**; o item **Financeiro** é **sempre o financeiro da própria empresa** (honorários, cobrança dos clientes, contas a pagar e caixa do escritório, titular = o escritório). O item *Clientes* aparece para quem não tem o Painel, em qualquer cenário (mesmo cadastro do Painel › Societário, com as abas Cadastro e Contatos). Num BPO puro, portanto, a barra é *Início, Clientes, CRM, Timesheet, Arquivos, Financeiro, BPO, Configurações*: o BPO ocupa o lugar do Painel, e o Financeiro continua o da empresa de BPO. Dentro do BPO, os mesmos componentes financeiros aparecem com titular = empresa cliente.
11. **Quando surgir um cruzamento novo,** a pergunta de decisão é uma só: "mais de um pacote precisa disso?" Se sim, vira função da plataforma com titular; se não, fica no pacote.

Isso vale para o BPO financeiro, que é o primeiro caso, e para qualquer combinação futura (contábil e jurídico, por exemplo).

## 2. Arquitetura da plataforma

```
                 Operador (contador, atendente, gestor)
                          │  tela  │  chat com a IA
                          ▼        ▼
        ┌─────────────────────────────────────────────┐
        │  Camada de ferramentas (API única + MCP)    │
        │  permissões ler / rascunhar / executar      │
        └─────────────────────────────────────────────┘
           │            │             │            │
           ▼            ▼             ▼            ▼
   ┌─────────────┐ ┌─────────┐ ┌────────────┐ ┌──────────────┐
   │ Núcleo de   │ │ Base    │ │ Conectores │ │ Multiatendi- │
   │ dados do    │ │ legal   │ │ governo,   │ │ mento        │
   │ escritório  │ │ temporal│ │ bancos,    │ │ WhatsApp,    │
   │ (clientes,  │ │ (planos │ │ core       │ │ e-mail       │
   │ tarefas,    │ │ atuais) │ │ (Domínio..)│ │              │
   │ documentos) │ └─────────┘ └────────────┘ └──────────────┘
   └─────────────┘
           │
           ▼
   Registro de eventos  ──►  Timesheet, rentabilidade, auditoria
```

**Modelo de dados comum, decidido no início.** Tudo pendura em seis entidades: *cliente* (com perfil versionado no tempo), *obrigação* (o que precisa ser feito, quando, por regra), *tarefa* (a execução daquela obrigação naquele mês, com responsável e status), *documento* (XML, PDF, guia, recibo, com origem e hash), *conversa* (mensagens de qualquer canal ligadas ao cliente) e *evento* (toda ação, de pessoa ou da IA, com usuário, cliente, atividade, início e fim). Se essas entidades forem bem feitas, os blocos 1 a 5 se conectam sem retrabalho.

**Cofre de certificados.** Certificados A1 dos clientes e o e-CNPJ do escritório guardados criptografados, usados só pelos conectores, nunca expostos à IA nem à tela. Vencimentos monitorados.

**Revisão (6/11/2026, pesquisa B5): o A1 do cliente vira exceção, não regra.** Os concorrentes capturam boa parte das notas sem o certificado de cada cliente, por caminhos oficiais. A captura passa a ter um **perfil por UF e por tipo de documento**, sempre tentando primeiro o caminho sem o A1:

| Caminho | Cobre | Credencial |
| --- | --- | --- |
| CNPJ do escritório no campo autXML | NF-e e CT-e emitidas pelo cliente (saídas) | Certificado do escritório |
| Web services estaduais para contabilistas: RS (autorização no e-CAC estadual) e SC (vínculo) | NF-e emitidas e recebidas, CT-e, NFC-e | Certificado do contador |
| Portais estaduais com acesso do contador: PR (Receita/PR) | Notas do cliente | Login ou certificado do contador |
| ADN da NFS-e com procuração da RFB (desde 01/11/2026, segundo a Fenacon citando o Portal da NFS-e) | NFS-e prestadas e tomadas | Certificado do escritório + procuração **[A CONFIRMAR numa prova de conceito]** |
| E-mail dedicado, agente de pasta, API do emissor do cliente | Saídas | Nenhuma |
| Distribuição nacional de NF-e | **Entradas** de clientes de SP, MG e das UFs sem web service para contabilista | **A1 do cliente** (não há alternativa) |

Por isso o A1 continua pedido no app, mas só para os clientes e documentos que dependem dele, principalmente as notas de entrada fora do RS e de SC. Detalhes e fontes em [B5-captura-sem-certificado.md](../pesquisa/plataforma/B5-captura-sem-certificado.md).

**Decisão anterior (6/11/2026), mantida para os casos acima: o A1 do cliente é obrigação do cliente, enviada pelo app.** A distribuição de NF-e e CT-e (NT 2014.002 v1.40, jul/2026) e as APIs do ADN da NFS-e autenticam com o certificado do próprio contribuinte. O acesso por procuração pedido pela FENACON ainda não existe. Por isso o A1 entra como documento obrigatório do cliente, enviado por ele no app do cliente (seção 6.1), com:

- termo de autorização assinado no próprio app, dizendo para quais serviços o certificado é usado (captura de notas, consultas e, se o escritório quiser, transmissões);
- guarda em cofre com chave gerenciada (KMS ou HSM), sem exibição nem download para ninguém, nem para a IA;
- uso registrado: cada chamada feita com o certificado gera evento com serviço, data e quem disparou;
- alerta de vencimento ao cliente com 30 dias de antecedência, e pedido de renovação pelo app;
- para NF-e, o CNPJ do escritório no campo autXML como complemento: as notas com autXML chegam com o certificado do escritório, sem depender do A1 do cliente;
- cliente que só tem certificado A3 (token ou cartão) não consegue enviar o arquivo: ou emite um A1, ou a captura dele fica pelo autXML e pelo envio manual.

**Stack:** a mesma do assistente (Postgres com pgvector), mais fila de tarefas e workflows duráveis para os conectores (a pesquisa 03, seção 5.2, já levanta opções) e o navegador headless já previsto para os robôs de nível C.

---

## 3. APIs e fontes: o mapa geral

Lista do que se sabe ser público ou comercial. Antes de cada módulo, confirmar preço, contrato e limites com o fornecedor.

### 3.1 Governo, com API oficial (nível A)

| API | Quem oferece | O que permite | Observações |
| --- | --- | --- | --- |
| **Integra Contador** | SERPRO / RFB | Serviços do e-CAC por API (catálogo oficial de 15/10/2026): PGDAS-D, DAS, DEFIS, PGMEI, CCMEI, DASN-SIMEI, DCTFWeb, caixa postal, DTE, SITFIS (situação fiscal), parcelamentos do Simples e do MEI, Sicalc, e-Processo, vínculo do contador e outros | Preços oficiais (Loja SERPRO, 6/11/2026), por faixa de consumo: consulta R$ 0,24 a 0,06; emissão R$ 0,32 a 0,08; declaração R$ 0,40 a 0,12. Cerca de R$ 1,92 a 2,56 por cliente do Simples por mês. O escritório assina um termo de autorização; o modelo de contrato para plataforma que atende vários escritórios está na agenda de contatos. **Abrir o detalhe de uma mensagem da caixa postal dá ciência da intimação:** listar sem abrir, e abrir só com aprovação |
| **NF-e / CT-e: distribuição de DF-e** | Ambiente Nacional da Sefaz (webservice NFeDistribuicaoDFe) | Baixar os XMLs emitidos contra o CNPJ (entradas), resumos e eventos, por NSU | Usa o certificado do cliente. O escritório também recebe os XMLs em que for indicado no campo de autorização de download (autXML) |
| **Manifestação do destinatário** | Sefaz (RecepcaoEvento) | Ciência, confirmação, desconhecimento e operação não realizada | Necessária para obter o XML completo de muitas notas |
| **NFS-e Padrão Nacional** | Receita Federal / Ambiente de Dados Nacional (ADN) | Emissão, consulta e distribuição de NFS-e | Na planilha oficial de 28/09/2026, as 5 capitais do escopo e 2.687 dos 2.689 municípios de SP, MG, PR, SC e RS aderiram. A captura é gratuita, com o certificado A1 do próprio cliente (mesmo CNPJ raiz). O acesso por procuração ainda não existe |
| **eSocial** | Governo federal | Envio e consulta de lotes; download de eventos já enviados | Certificado do empregador ou procuração. Útil para conferir pendências e cruzar com a folha do core |
| **EFD-Reinf** | RFB | Envio e consulta de eventos | Mesmo modelo do eSocial |
| **Dados abertos do CNPJ** | RFB (arquivos em lote) | Cadastro de todas as empresas, sócios, CNAEs | Base mensal grátis; para consulta em tempo real, SERPRO Consulta CNPJ (paga) ou serviços gratuitos como a BrasilAPI |
| **SGS / Banco Central** | BCB | Selic, IPCA, IGP-M, câmbio PTAX | Grátis; correções e cálculos |
| **SIDRA / IBGE** | IBGE | Índices e a tabela CNAE | Grátis |
| **Calculadora da reforma (CBS/IBS)** | RFB | Cálculo oficial dos novos tributos | A RFB publicou calculadora para a fase de testes; conferir se há API pública e para quem **[A CONFIRMAR]** |

### 3.2 Governo, sem API pública (níveis B ou C)

| Fonte | Situação | Caminho sugerido |
| --- | --- | --- |
| Certidões negativas (federal, estadual, municipal, FGTS, trabalhista) | Consultas públicas, várias com CAPTCHA | Agregador comercial (nível B); a situação fiscal federal vem do Integra Contador |
| Sefaz estaduais: DTE, conta-corrente, pendências, GIA/declarações | Varia por UF; quase sempre portal com certificado | Começar pelas UFs dos clientes; robô (C) só onde a dor for grande |
| Prefeituras: ISS, NFS-e fora do padrão nacional, alvarás | Cada uma de um jeito | Integradores de NFS-e (B) para notas; o resto manual com tarefa e lembrete |
| Juntas Comerciais e REDESIM | Portais estaduais | Manual com checklist e acompanhamento; automação só para consultar andamento |
| FGTS Digital | Portal com gov.br/certificado | Verificar se há API para software ou se as guias saem só pelo portal **[A CONFIRMAR]** |
| Domicílio Eletrônico Trabalhista (DET) | Portal do MTE | Verificar integração **[A CONFIRMAR]**; enquanto isso, lembrete de leitura |
| Mediador (convenções coletivas) | Já tratado no Plano de 6 meses | Coletor existente |

### 3.3 Mercado (nível B e serviços)

| Necessidade | Opções conhecidas | Observação |
| --- | --- | --- |
| Emissão de NF-e/NFS-e para clientes (se um dia entrar) | Focus NFe, PlugNotas (TecnoSpeed), NFE.io, eNotas | Não construir emissor próprio |
| Consultas de órgãos públicos (certidões, cadastros) | Agregadores como a InfoSimples | Preço por consulta; comparar fornecedores |
| Extrato bancário | Open Finance via agregadores (Pluggy, Belvo); arquivos OFX e CNAB | Open Finance exige consentimento do cliente; OFX é o caminho imediato |
| Cobrança dos honorários do escritório | Asaas (já previsto no Plano de 6 meses), Banco Inter, Efí; Pix | Boleto, Pix e conciliação automática |
| Assinatura eletrônica | Clicksign, D4Sign, ZapSign | Contratos de honorários, procurações, documentos de admissão |
| WhatsApp | WhatsApp Business Platform (Cloud API da Meta), direto ou via provedor (360dialog, Twilio, Gupshup) | Ver seção 6 |
| Base de atendimento multicanal | Chatwoot (código aberto) como referência ou base | Evita reconstruir a caixa de entrada do zero |
| E-mail | Gmail API, Microsoft Graph, IMAP | Captura de documentos e conversas |
| Armazenamento de arquivos dos clientes | Google Drive, OneDrive, S3 | Integração ou armazenamento próprio |

### 3.4 Sistemas "core"

| Sistema | O que se sabe | Caminho |
| --- | --- | --- |
| **Domínio (Thomson Reuters)** | Módulo de processos: Gestta Processos, integrado ao Domínio. O Onvio Gestão tem um menu API que gera chave de integração; a especificação pública encontrada (`api.onvio.com.br`) cobre o status de integração, não as tarefas | Conversa técnica com a Thomson Reuters para liberar a API de tarefas (parceria ou pago) **[A CONFIRMAR]**. Arquivos de importação no padrão Domínio funcionam desde já |
| **Alterdata** | **API pública documentada (ePlugin):** histórico de tarefas do eTarefas (nome, responsável, status, prazos, data de conclusão, empresa, departamento; sem início nem horas), criação de tarefas, empresas, funcionários, folha, guias DAS e importação de lançamentos, com token Bearer | Integração direta; conversa técnica para obter o token e saber se há campos de tempo |
| **Contmatic** | Nenhuma API pública encontrada | Conversa técnica com a Contmatic **[A CONFIRMAR]**; arquivos de importação como base |

**Decisão (6/11/2026):** os dados dos cores vêm por API dos módulos de processos, negociada com cada fornecedor (parceria ou pagamento). Onde ainda não houver API, o caminho é **trocar arquivos** (exportar no leiaute de importação do core e ler os relatórios exportados por ele).

---

## 4. Inventário de atividades por aba

Ponto de partida para o levantamento dos contadores: o que um escritório típico faz fora do core. Cada linha diz o que a aba faz, como se automatiza e com qual fonte. **Prioridade:** P1 = entra no primeiro corte, P2 = segundo corte, P3 = depois ou por demanda. É uma proposta; a triagem final sai do levantamento (seção 8 e apêndice).

### 4.1 Aba Clientes e Societário (base de tudo)

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Cadastro do cliente | Puxa razão social, CNAEs, endereço, sócios e situação pelo CNPJ; guarda regime, UF, município, atividades com ST, folha (sim/não) | Dados do CNPJ (RFB, SERPRO, BrasilAPI) | P1 |
| Perfil temporal | Histórico de regime, CNAE, sócios e endereço com datas (o mesmo modelo de vigência da base legal) | Próprio | P1 |
| Certificados digitais | Cofre, vencimento, alerta, quem usou | Próprio | P1 |
| Procurações eletrônicas | Controle das procurações no e-CAC e outros órgãos, vencimento, serviços cobertos | Integra Contador (procurações) | P1 |
| Contratos e honorários | Contrato, valor, reajuste anual, serviços incluídos, aditivos | Próprio + assinatura eletrônica | P1 |
| Onboarding de cliente | Checklist de entrada: documentos, acessos, procurações, migração de saldos | Próprio | P2 |
| Abertura, alteração e baixa de empresa | Checklist por UF, acompanhamento do processo, viabilidade, prazos | REDESIM e Juntas (consulta de andamento, C) | P2 |
| Alvarás e licenças | Alvará, Bombeiros, Vigilância Sanitária, licença ambiental: vencimentos | Próprio (manual com alerta) | P2 |
| Livro de sócios e atas | Controle de atas, distribuição de lucros por sócio | Próprio | P3 |
| Offboarding | Checklist de saída, entrega de arquivos, revogação de procurações | Próprio | P3 |

### 4.2 Aba Obrigações e Prazos (o "calendário vivo")

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Calendário de obrigações por cliente | Gera automaticamente as obrigações do mês a partir do perfil (regime, UF, município, folha, atividade) | **A própria base legal** (prazos versionados) | P1 |
| Tarefas recorrentes por setor | Cada obrigação vira tarefa com responsável, status e prazo interno | Próprio | P1 |
| Comprovação de entrega | Anexa recibo de entrega e guia paga; marca como concluída | Integra Contador, eSocial, Reinf, importação do core | P1 |
| Painel de atrasos e riscos | O que vence hoje, o que está atrasado, multa estimada | Próprio + cálculo determinístico | P1 |
| Vigia da lei | Norma nova cruzada com o perfil dos clientes: "afeta estes 12 clientes" | Base legal (já planejado) | P2 |

Esta aba é onde a base legal e a plataforma se encontram: o calendário não é uma tabela digitada à mão, é derivado das normas vigentes. Nenhum concorrente faz isso dessa forma, pelo que se sabe.

### 4.3 Aba Notas fiscais e XML

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Captura automática de XML de entrada | Busca diária por NSU de NF-e e CT-e de cada cliente | Distribuição DF-e (Sefaz) | P1 |
| Manifestação do destinatário | Ciência automática para baixar o XML completo; alerta de nota desconhecida | RecepcaoEvento (Sefaz) | P1 |
| Captura de NFS-e | Tomadas e prestadas | NFS-e Nacional (ADN); integradores para os demais | P1 |
| Notas de saída | Recebimento do XML do cliente (upload, e-mail, sistema emissor) ou via autXML | E-mail, upload, distribuição | P1 |
| Conferência de completude | "Faltam notas de saída de março" comparando sequência numérica e faturamento | Próprio | P1 |
| Envio ao core | Exporta os XMLs no formato de importação do Domínio, Alterdata ou Contmatic | Arquivos / API do core | P1 |
| Conferência tributária das notas | NCM × CST × CFOP × alíquota contra a regra; monofásico, ST, DIFAL | Base legal + regras determinísticas | P2 |
| Alerta de cancelamento e carta de correção | Eventos posteriores à importação | Distribuição DF-e | P2 |
| Notas com IBS/CBS (reforma) | Lê os novos grupos do XML (fase de testes de 2026 em diante) e confere | Leiautes oficiais da NF-e | P2 |
| Emissão de nota para o cliente | Emitir pelo escritório | Integradores (B) | P3, avaliar se faz sentido |

### 4.4 Aba Fiscal

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Caixa postal do e-CAC | Leitura diária de todos os clientes, resumo pela IA, alerta do que exige ação | Integra Contador | P1 |
| Situação fiscal / pendências federais | Relatório de situação fiscal de cada cliente, comparado com o mês anterior | Integra Contador | P1 |
| Simples Nacional | Conferência do PGDAS-D, emissão e envio do DAS, controle de sublimite e fator R | Integra Contador + cálculo determinístico | P1 |
| MEI | DAS-MEI, DASN-SIMEI, controle de limite | Integra Contador | P1 |
| DCTFWeb | Conferência, emissão da guia | Integra Contador | P1 |
| Guias de todos os tributos | Central de guias por cliente com envio automático (WhatsApp/e-mail) e confirmação de pagamento | Integra Contador (DARF/DAS), core, Sefaz | P1 |
| Parcelamentos | Controle de parcelas, emissão de guia, risco de exclusão | Integra Contador (parcelamentos do Simples e MEI); outros manual | P2 |
| Malhas e intimações | Recebimento, prazo, responsável, resposta | Caixa postal + DTE estaduais | P2 |
| Certidões | Emissão periódica e vencimento | Agregador (B) + situação fiscal | P2 |
| Pendências estaduais e municipais | DTE, conta-corrente, débitos | Robôs por UF (C), só onde há volume | P3 |
| Recuperação de créditos | Monofásico de PIS/Cofins no Simples, ICMS-ST, créditos extemporâneos | XMLs + base legal + cálculo | P2 (gera receita para o escritório) |
| Pré-validação de SPED | Conferências antes de transmitir (sem substituir o PVA) | Arquivos do core | P3 |

### 4.5 Aba Trabalhista e Departamento Pessoal

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Admissão | Coleta de documentos do empregado pelo WhatsApp ou portal, checklist, ASO, envio ao core | Multiatendimento + assinatura eletrônica | P1 |
| Fechamento de folha | Recebimento das variáveis do cliente (horas extras, faltas, comissões) por formulário, com prazo e lembrete | Portal/WhatsApp; importação no core | P1 |
| Envio de holerites e guias | Distribuição automática aos clientes e empregados | Multiatendimento | P1 |
| Férias | Controle de períodos aquisitivos e concessivos, alerta de dobra | Dados exportados do core ou eSocial | P2 |
| Rescisão | Checklist, prazos (10 dias), homologação quando prevista em convenção | Próprio + base legal | P2 |
| Convenções coletivas | Data-base, reajuste, piso e benefícios por cliente; alerta de convenção nova | Coletor do Mediador (já planejado) | P2 |
| Pendências do eSocial e FGTS Digital | Conferência de eventos e guias | eSocial (download de eventos); FGTS Digital **[A CONFIRMAR]** | P2 |
| Ponto | Importação de arquivos do relógio (AFD/AEJ, Portaria 671/2021) e conferência | Arquivos | P3 |
| Afastamentos, atestados, CAT | Controle e prazos | Próprio | P3 |

### 4.6 Aba Contábil

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Coleta de documentos do mês | Checklist por cliente do que falta (extratos, notas, recibos), cobrança automática | Multiatendimento + documentos | P1 |
| Extratos bancários | Recebimento de OFX ou via Open Finance | OFX; agregadores (B) | P2 |
| Conciliação e classificação | Sugestão de conta contábil por IA a partir do histórico do cliente, exportada no layout do core | Próprio + core | P2 |
| Checklist de fechamento | Etapas do fechamento por cliente e status | Próprio | P2 |
| Relatórios gerenciais ao cliente | DRE gerencial, indicadores, comparativo mensal, explicado pela IA | Balancete exportado do core | P2 |
| Distribuição de lucros e pró-labore | Cálculo do limite, simulações | Cálculo determinístico + base legal | P3 |
| ECD/ECF | Acompanhamento de status (a geração fica no core) | Core | P3 |

### 4.7 Aba Consultoria e Reforma Tributária

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Assistente legal | O assistente dos planos atuais, agora com o perfil do cliente | Base legal | P1 |
| Pareceres e respostas a clientes | Rascunho de parecer com citação conferida, revisado e assinado pelo contador | Base legal | P1 |
| Simulação da reforma por cliente | Usa os XMLs reais de 12 meses para estimar carga de CBS/IBS × tributos atuais, por ano da transição | XMLs + base legal + cálculo | P2 (forte argumento comercial em 2026–2027) |
| Decisão do Simples "por fora" | Simula se vale recolher IBS/CBS fora do Simples (relevante para quem vende a empresas que tomam crédito) | Idem | P2 |
| Planejamento tributário anual | Comparativo Simples × Presumido × Real com os dados do cliente | Dados do core + cálculo | P2 |
| Split payment e fluxo de caixa | Impacto do recolhimento na liquidação financeira | Base legal + dados do cliente | P3, quando as regras operacionais estiverem estáveis |

### 4.8 Aba Financeiro do escritório

Acrescentada depois da pesquisa B1 (6/11/2026): o financeiro do próprio escritório, no nível do Conta Azul e do Conexa, ligado à operação. Contratos de honorários como assinaturas estruturadas (itens, reajuste, 13º), faturamento com reembolso de despesas adiantadas, NFS-e do escritório pelo Emissor Nacional (obrigatório para ME e EPP do Simples desde a competência 11/2026), boletos e Pix Automático, régua de cobrança, contas a pagar com aprovação, conciliação, fluxo de caixa e previsão de 12 meses, DRE por setor com as horas medidas, orçamento, comissões, suspensão por inadimplência e divisão do resultado entre sócios. As 14 fichas FIN estão em [B1-financeiro-escritorio.md](../pesquisa/plataforma/B1-financeiro-escritorio.md). HubStrom e Acessórias não têm módulo financeiro; o Conexa cobre quase tudo, mas sem a ligação com tempo e operação.

**Posicionamento depois da varredura de concorrentes (B2 a B4):** servidor MCP para a IA do cliente consultar e agir já existe em Acessórias, Conexa, Nibo, Jettax e Fiscal.io, então "conversar com o sistema" deixou de ser diferencial. O que nenhum concorrente encontrado junta é: tempo medido nos cores, rentabilidade por cliente, IA que cruza XML, documentos do cliente, base legal com vigência e dados dos cores, e ações que viram tarefa com aprovação.

### 4.9 Aba Gestão do escritório

| Atividade | O que o sistema faz | Fonte / API | Prioridade |
| --- | --- | --- | --- |
| Cobrança de honorários | Boleto/Pix, régua de cobrança pelo WhatsApp, conciliação | Asaas ou banco | P1 |
| NFS-e dos honorários | Emissão automática do próprio escritório | NFS-e Nacional ou integrador | P2 |
| Rentabilidade por cliente | Horas do timesheet × honorário | Timesheet | P2 |
| Reajuste de honorários | Sugestão com base em custo real e índice | Timesheet + BCB | P3 |
| Produtividade por setor | Volume de tarefas, atrasos, retrabalho | Registro de eventos | P2 |

### 4.10 Aba Atendimento (o CRM, detalhado na seção 6)

| Atividade | Prioridade |
| --- | --- |
| Caixa de entrada única (WhatsApp, e-mail), ligada ao cadastro do cliente | P1 |
| Distribuição por setor e fila, transferência, SLA | P1 |
| Captura de documentos enviados na conversa direto para o cliente certo | P1 |
| Respostas rápidas e modelos aprovados | P1 |
| Rascunho de resposta pela IA, com o contexto do cliente | P2 |
| Resposta automática em categorias liberadas | P2 |
| Envio em massa segmentado (aviso de prazo, mudança de lei) | P2 |
| Portal do cliente (upload, guias, relatórios) | P2 |

---

## 5. Timesheet automático

### 5.1 De onde vêm as horas

| Fonte | O que capta | Precisão | Quando |
| --- | --- | --- | --- |
| **Eventos da própria plataforma** | Cada tarefa aberta/fechada, conversa atendida, documento conferido, ação da IA aprovada | Alta (sabemos cliente e atividade) | Desde o primeiro módulo |
| **API dos módulos de processos dos cores** | Tarefas por responsável, empresa, departamento, status e data de conclusão (Alterdata ePlugin, confirmado; Domínio e Contmatic a negociar) | Alta para "quem fez o quê, para quem e quando concluiu". A duração não vem pronta: mede-se entre as mudanças de status (consulta periódica) ou pelo apontamento de horas, se o módulo tiver | Desde a fase 1, conforme os contratos |
| **Calendário e chamadas** | Reuniões e ligações ligadas ao cliente | Média | Depois |

**Decisão (6/11/2026):** o timesheet vem dos eventos da plataforma e das APIs dos módulos de processos dos cores. O agente de desktop (registro da janela ativa) sai do plano principal e fica só como alternativa para um core que não tenha API. Onde a API não trouxer a duração, ela é calculada pelas mudanças de status ou por um tempo padrão por tipo de tarefa, calibrado com os dados medidos na própria plataforma.

### 5.2 O que o timesheet entrega

- horas por cliente, setor, atividade e pessoa, sem ninguém apontar nada;
- custo por cliente (horas × custo/hora do funcionário) × honorário: **a margem de cada cliente**;
- clientes que dão prejuízo e quanto reajustar;
- atividades que mais consomem tempo, que viram a fila de automação seguinte.

### 5.3 Cuidados (importantes)

- **LGPD e transparência com os funcionários.** Monitoramento é permitido com finalidade clara e informada (política interna, aviso, termo). Captar só programa, título da janela e ociosidade; **nada de captura de tela, teclas ou conteúdo**. Isso precisa passar pelo advogado do grupo.
- **Prova trabalhista.** Um registro automático do tempo de trabalho é um registro da jornada. Se mostrar trabalho fora do horário, vira prova de hora extra em reclamação trabalhista. O sistema deve ser apresentado como medição de esforço por cliente, alinhado ao controle de ponto oficial, e o escritório precisa decidir isso de olhos abertos.
- **Não vender como vigilância.** O valor para a equipe é parar de apontar horas à mão; o valor para o gestor é a rentabilidade por cliente. Mostrar a cada pessoa os próprios dados primeiro.

---

## 6. CRM, multiatendimento e app do cliente

### 6.1 App do cliente e guarda de arquivos

**Decisão (6/11/2026):** a plataforma centraliza a guarda dos arquivos do escritório e a entrega aos clientes por um app padrão (web e celular):

- o cliente vê os próprios dados espelhados: guias, notas, holerites, relatórios, certidões, situação fiscal, pendências e tarefas que dependem dele;
- envia o que o escritório precisa: documentos do mês, extratos, variáveis da folha, documentos de admissão e o certificado A1 (obrigatório, seção 2);
- recebe automaticamente o que entra: cada documento gerado ou capturado pela plataforma aparece no app e, se o cliente quiser, também é avisado pelo WhatsApp;
- cada arquivo tem origem, hash, data e quem o enviou ou baixou, e o "baixou" vale como comprovante de entrega;
- as permissões seguem os papéis do cliente (sócio, financeiro, RH), para que o RH não veja o fiscal e vice-versa.

### 6.2 Multiatendimento


- **Só a API oficial do WhatsApp (Cloud API da Meta), direto ou por um provedor.** Bibliotecas não oficiais que imitam o WhatsApp Web são mais baratas, mas violam os termos e o número pode ser banido, o que para um escritório significa perder o canal com todos os clientes de uma vez.
- **Custos da Meta (BRL, desde 1/10/2026, conferido):** marketing R$ 0,3217 por mensagem; utilidade, autenticação e serviço R$ 0,035; 1.000 respostas de serviço grátis por número por mês. Detalhes no [consolidado](../pesquisa/plataforma/90-consolidado.md), seção 5.
- **Política de IA da Meta:** os termos restringem "assistentes de IA de uso geral" no WhatsApp Business; o CADE abriu inquérito (08700.012397/2025-63) com medida preventiva em 12/01/2026, ainda sem julgamento de mérito. O texto vigente dos termos não pôde ser lido (página só com JavaScript) e está na agenda de contatos. O desenho segue o caso seguro: IA a serviço do atendimento do próprio escritório aos próprios clientes.
- **Não reconstruir a caixa de entrada do zero:** estudar o Chatwoot (código aberto) como base ou referência, e investir o esforço no que nenhum CRM genérico tem: a conversa ligada ao cliente, às obrigações, às guias e ao assistente legal.
- **O diferencial com a IA:**
  - cliente pergunta "minha guia saiu?" e a IA responde com a guia do mês, porque está no sistema;
  - documento recebido na conversa vai sozinho para a pasta e a tarefa certas;
  - pergunta técnica do cliente gera rascunho com citação legal para o contador aprovar;
  - régua de cobrança de documentos e de honorários sem ninguém lembrar;
  - resumo diário: "estes 8 clientes estão sem resposta há mais de 24 horas".

---

## 7. Linha do tempo proposta

Premissa: uma pessoa desenvolvendo, com agente de programação, e os dois contadores como especialistas e escritório-piloto. Os prazos são estimativas para discussão.

### A decisão de ordem

Recomendo **manter a ordem que vocês desenharam, começando pelo painel**, mas com o assistente legal num trilho enxuto em paralelo, e não com a arquitetura completa do Plano de 6 meses. O agêntico não é uma fase: cada módulo já nasce como ferramenta (seção 1.6), e a fase 3 só amadurece o planejador.

- o painel dá uso diário e dados próprios, e é o que os escritórios pagam primeiro;
- o assistente enxuto (base temporal federal + o estado do piloto, busca híbrida, reranker por API, citação conferida, abstenção, cálculos) já entrega os diferenciais principais;
- RL, Rank1 destilado, DGM, RAPTOR e HippoRAG entram depois, quando o benchmark tiver tamanho para medi-los.

### Fases

| Fase | Duração | O que entra | Critério de saída |
| --- | --- | --- | --- |
| **0a. Levantamento por agentes** | 1–2 semanas | Execução do [Protocolo de Descoberta](../pesquisa/plataforma/00-protocolo-de-descoberta.md): inventário por aba, verificação de APIs, preços e níveis de automação, consolidação e triagem | Inventário verificado e triado; os contadores validam depois, como extra |
| **0b. Reestruturação e fundação** | 4–6 semanas | Reestruturação dos planos (seção 9); conversa técnica com Thomson Reuters, Alterdata e Contmatic sobre as APIs dos módulos de processos (agenda no consolidado); contrato do Integra Contador; modelo de dados das seis entidades; multiescritório, login, permissões, cofre de certificados, registro de eventos; **camada de ferramentas e servidor MCP interno; chat único com o roteador da etapa 0 (seção 1.5), mesmo que no início só com M1 e poucas ferramentas de leitura** | Esqueleto no ar; toda ação do esqueleto já é ferramenta |
| **1. Painel núcleo** | 3–4 meses | Clientes com perfil temporal, certificados, procurações, contratos; calendário de obrigações e tarefas por setor; captura de XML (NF-e, CT-e, NFS-e) e exportação ao core; Integra Contador (caixa postal, situação fiscal, Simples, MEI, DCTFWeb, guias); central de guias | O escritório-piloto usa o painel todo dia para prazos, notas e e-CAC |
| **1b. Assistente enxuto (paralelo)** | ao longo da fase 1 | Base federal + estado do piloto; busca híbrida; citação conferida; abstenção; cálculos; benchmark v1 | 100% das respostas com citação conferida ou abstenção; benchmark com 100+ perguntas |
| **2. Atendimento** | 2–3 meses | Caixa de entrada WhatsApp (API oficial) e e-mail ligada ao cliente; filas por setor; captura de documentos; envio de guias e holerites; cobrança de honorários (Asaas); portal do cliente simples | Atendimento do piloto saiu do WhatsApp do celular |
| **3. Agente operador maduro** | 2–3 meses | As ferramentas já existem desde a fase 0b (seção 1.6); aqui entram o planejador de várias etapas do M4, ações em lote, automações agendadas, respostas automáticas em categorias liberadas e o benchmark de tarefas completo | O agente executa as 20 tarefas mais pedidas do piloto com aprovação, sem erro no benchmark de tarefas |
| **4. Timesheet e gestão** | 2 meses | Eventos da plataforma já existem; APIs dos módulos de processos dos cores; rentabilidade por cliente; produtividade por setor | Relatório de margem por cliente aceito pelos sócios do piloto |
| **5. Consultoria e reforma** | 2 meses | Simulação da reforma com XMLs reais; Simples "por fora"; planejamento tributário; vigia da lei por cliente; recuperação de monofásico | Simulações conferidas pelos contadores em 10 clientes reais |
| **6. Aprofundamento** | contínuo | DP (férias, rescisão, convenções), contábil (extratos, classificação, relatórios), outros estados, robôs de nível C onde a dor justificar; componentes experimentais do assistente (RL, Rank1, DGM) se vencerem no benchmark | Por módulo |

Total até a fase 5: cerca de **14 a 18 meses** para uma pessoa. A partir da fase 2 o piloto já pode virar o primeiro cliente pagante, o que muda a conta do aporte do Plano de 6 meses.

---

## 8. Triagem: o que construir, comprar e não fazer

### 8.1 Critérios de nota (de 1 a 5)

Para cada atividade levantada pelos contadores:

1. **Dor:** quanto tempo consome por mês, somando todos os clientes.
2. **Frequência:** diária, semanal, mensal, anual.
3. **Risco:** multa, perda de prazo ou de cliente quando falha.
4. **Viabilidade:** nível A (5), B (3), C (1) da seção 1.3.
5. **Diferencial:** quanto a IA e a integração fazem melhor que os concorrentes.

Prioridade = Dor × Frequência × Risco × Viabilidade, com o Diferencial como desempate. Tudo que tirar nota alta em dor e baixa em viabilidade vira **tarefa com lembrete e checklist** (sem automação), que já resolve boa parte do problema.

### 8.2 Proposta inicial

| Construir (o núcleo e o diferencial) | Comprar ou integrar | Não fazer |
| --- | --- | --- |
| Modelo de dados e perfil temporal do cliente | Integra Contador (SERPRO) | Escrituração, apuração, folha e SPED: ficam no core |
| Calendário de obrigações derivado da base legal | WhatsApp Cloud API (provedor) | Emissor próprio de NF-e/NFS-e |
| Captura e conferência de XML | Agregador de certidões e consultas | WhatsApp não oficial |
| Central de guias e caixa postal com resumo por IA | Asaas/banco para cobrança | Assinatura eletrônica própria |
| Caixa de entrada ligada ao cliente (sobre Chatwoot ou similar) | Assinatura eletrônica | Ferramenta de BI própria (usar gráficos simples) |
| Agente operador com permissões e aprovações | Integradores de NFS-e fora do padrão | Robôs de portal sem dor comprovada |
| Assistente legal enxuto, depois completo | Open Finance via agregador (quando chegar no contábil) | Captura de tela ou de teclas no timesheet |
| Timesheet por eventos + APIs dos cores | | IA respondendo sozinha em assunto técnico, no início |
| Simulações da reforma com dados reais | | |

### 8.3 Decisões para tomarmos juntos

1. **Ordem:** painel primeiro com assistente enxuto em paralelo (recomendado), ou assistente completo primeiro como no Plano de 6 meses?
2. **Aporte e cobrança:** o aporte de R$ 20 mil dos playtesters passa a financiar a plataforma? O piloto vira cliente pagante a partir da fase 2?
3. **Escritório-piloto:** qual dos escritórios, quais setores e quantos clientes entram primeiro?
4. **Core prioritário:** qual dos três sistemas o piloto usa? A integração começa só por ele.
5. **Estados e municípios:** quais UFs e prefeituras concentram os clientes (define a cobertura de NFS-e e dos robôs).
6. **Timesheet:** política informada aos funcionários sobre a medição por tarefa (dados dos cores e da plataforma), com revisão do advogado. Decidido: sem agente de desktop no plano principal.
7. **Autonomia da IA no atendimento:** quais categorias de mensagem podem ser respondidas sem aprovação?
8. **Preço:** por escritório (com faixas por número de CNPJs atendidos, como o mercado costuma cobrar) em vez de por pergunta? Exige refazer o modelo da pesquisa 08.

---

## 9. O que muda nos planos atuais

| Documento | Mudança proposta |
| --- | --- |
| Plano do Assistente | Reestruturação completa: tirar "não é um sistema de rotina contábil" da visão; o assistente vira o motor M1 do chat único (seção 1.5), com a etapa 0 de roteamento antes da cascata; perfil do cliente lido do banco; Camada 4 com os três tipos de caso de benchmark. Arquitetura da base legal mantida |
| Plano de 6 meses | Cronograma refeito pela seção 7: assistente enxuto em paralelo ao painel; RL, Rank1 destilado e DGM movidos para depois, atrás do benchmark |
| Pesquisa 08 (modelo financeiro) | Novo modelo de preço por escritório e custos de Integra Contador, WhatsApp e agregadores |
| Plano de Ingestão | Sem mudança de estrutura; prazos de obrigações acessórias ganham prioridade, porque alimentam o calendário |

---

## Apêndice: ficha de levantamento para os contadores

O levantamento principal é feito por agentes, pelo [Protocolo de Descoberta](../pesquisa/plataforma/00-protocolo-de-descoberta.md). Esta ficha fica como extra: os contadores conferem o inventário dos agentes e acrescentam o que é próprio do escritório deles. Uma linha por atividade.

| Campo | Exemplo |
| --- | --- |
| Setor | Fiscal |
| Atividade | Ler a caixa postal do e-CAC de todos os clientes |
| Como é feita hoje | Um analista abre o e-CAC cliente por cliente com o certificado do escritório |
| Sistema ou portal usado | e-CAC |
| Frequência | Semanal |
| Quantos clientes envolve | 180 |
| Tempo médio por cliente | 3 min |
| Horas por mês (calculado) | 36 h |
| O que acontece se falhar | Intimação sem resposta, multa, exclusão do Simples |
| Dados de entrada e saída | Mensagens; tarefa de resposta quando há intimação |
| Depende do cliente? | Não |
| Dor (1–5) | 4 |
| Ideia de automação | Ler por API todos os dias, resumir e abrir tarefa só quando houver ação |

Dicas para o levantamento:

- incluir as atividades pequenas e repetitivas (mandar guia, cobrar documento, conferir se o cliente pagou): somadas, costumam ser as que mais consomem horas;
- anotar tudo que é feito no WhatsApp, em planilha ou em papel;
- marcar onde o trabalho volta (retrabalho por falta de documento, nota faltante, erro de cadastro);
- cronometrar uma semana real de 2 ou 3 pessoas por setor, se possível: dá a base para validar o timesheet depois.

## Adendo: pacote Jurídico (9/11/2026)

Os cinco subplanos do Jurídico (`docs/subplanos/juridico/JU-01` a `JU-05`) estão aprovados como planejamento (hipóteses aceitas em 9/11/2026). Nada é construído antes do BPO. Ordem do Jurídico: modelo de dados, prazos e comunicações, painel, motor e base de leis (onda 2: Família antes de Trabalhista), honorários e financeiro, configurador de preço.

## Adendo: painel do Leandro (9/11/2026)

O [cruzamento](Cruzamento_Painel_do_Leandro.md) e a [lista de decisão](Lista_de_Decisao_Painel_do_Leandro.md) foram aprovados pelo Enzo: 23 itens entram agora, 7 depois, 3 não entram e 8 viram só ideia. **Controle de distribuição de lucros** passa de P3 (fase 4) para **P1 (primeiro corte)**; a Renata não entra (já temos o time de agentes); regra de implementação: **agentificação**, não cópia crua.

## Adendo: comunicação interna e aba Obrigações (14/11/2026)

- **Comunicação interna** (pedido do Enzo): conversas pessoais, grupos, canal de cada setor e canal geral, quase como um Microsoft Teams, **sem possibilidade de excluir mensagens** (editar guarda o histórico). Faz parte da plataforma comum, para todos os pacotes. Desenho no [subplano 11](subplanos/11-Comunicacao-Interna.md).
- **Aba Obrigações:** compartilhada, mas dinâmica por setor: cada setor vê as suas obrigações e o seu integrante; quem tem vários setores, o Gestor e o Administrador escolhem ver um, vários ou todos. Cada aba de setor tem o bloco "Obrigações do setor". Detalhe no adendo do [subplano 03](subplanos/03-Painel.md).
- **Nome:** o setor continua **Societário** ("Legal" e "Legalização" são sinônimos na busca e na IA).
