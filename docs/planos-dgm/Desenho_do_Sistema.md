# Desenho do sistema: os seis módulos

**Versão 0.3 · 7/11/2026 · documento de desenho, anterior à escolha de stack, design e UI.**

Este documento descreve **o que** o sistema é: módulos, entidades, regras de negócio e como os módulos se encaixam. Ele se apoia no [Plano da Plataforma](Plano_Plataforma_do_Escritorio.md) (parecer, motores de raciocínio, APIs, decisões DA-01) e no [mapa de 589 atividades](../pesquisa/plataforma/mapa-de-atividades.html) (o que cada aba faz, em que fase). Não repete esse conteúdo; aponta para ele.

As 17 perguntas da versão 0.2 foram respondidas em 7/11/2026 e estão incorporadas; cada seção traz a decisão como **Decisão**. A lista completa está na seção 10.

As três pesquisas feitas por sessões filhas para este desenho estão em [S1 (times de agentes)](../pesquisa/plataforma/S1-times-de-agentes.md), [S2 (captura de tempo)](../pesquisa/plataforma/S2-captura-de-tempo.md) e [S3 (conexão WhatsApp)](../pesquisa/plataforma/S3-conexao-whatsapp.md).

---

> **Decisão DA-02 (8/11/2026): a plataforma é comum e a área é um pacote.** O que este documento descreve como Painel contábil, setores, obrigações e base legal é o **primeiro pacote de área** (Contábil). Plataforma, CRM, Timesheet, Time de agentes, App do cliente, Financeiro, Conectores (framework), tema e marca branca valem para outras áreas (por exemplo, um painel para advogados) como produtos "{nome} Contábil", "{nome} BPO Financeiro", "{nome} Direito". Detalhe e regras em [DA-02, no Plano da Plataforma](Plano_Plataforma_do_Escritorio.md). Nenhuma outra área é estudada agora.

## 0. Visão geral

```
                      ┌──────────────────────────────────────────────┐
   Equipe do          │  PAINEL      CRM      TIMESHEET   TIME DE    │
   escritório  ─────► │  (telas)   (conversas) (horas)   AGENTES +   │
                      │                                  CONSULTOR   │
                      └───────────────┬──────────────────────────────┘
                                      │ tudo passa pela mesma camada
                      ┌───────────────▼──────────────────────────────┐
                      │  FUNDAÇÕES                                   │
                      │  contas e papéis · cadastro único · tarefas  │
                      │  documentos · eventos · ferramentas tipadas  │
                      │  notificações · conectores · dados por       │
                      │  escritório (DA-01)                          │
                      └───────────────┬──────────────────────────────┘
                                      │
   Cliente do        ┌────────────────▼──────┐
   escritório ─────► │  APP DO CLIENTE       │  (mesmas fundações, visão do cliente)
                     └───────────────────────┘
```

Os seis módulos não são seis sistemas. São seis **janelas sobre as mesmas fundações**. É isso que permite que um cliente cadastrado uma vez apareça no CRM, no timesheet e no app; que uma tarefa criada por um agente apareça no painel; e que qualquer ação, feita por pessoa ou por agente, conte tempo e fique auditável.

A ordem de construção segue a ordem das fundações, não a dos módulos: nenhum módulo fica pronto antes delas, e todos ficam quase prontos quando elas existem.

---

## 1. Fundações (transversais a todos os módulos)

### 1.1 Contas, papéis e escopo

Quatro tipos de conta. Nomes padronizados (os seus, entre parênteses):

| Conta | Quem é | O que vê |
| --- | --- | --- |
| **Administrador** (Admin) | Dono ou sócio do escritório | Todos os módulos liberados na assinatura, todas as configurações, todos os setores e clientes |
| **Gestor** (Coordenador) | Responsável por um ou mais setores | Os setores vinculados, com acesso de gestão (tarefas da equipe, timesheet do setor, aprovações) |
| **Colaborador** (Membro) | Quem executa | Os setores vinculados, com acesso de execução |
| **Cliente** | Pessoa da empresa cliente (sócio, financeiro, RH) | Só o app do cliente, só a própria empresa, só as áreas do papel dele |

Regras:

1. **A assinatura define os pacotes de área e os módulos disponíveis** (por exemplo, "pacote Contábil + CRM" ou "tudo"; DA-02). O Administrador sempre tem tudo o que a assinatura libera; ninguém configura isso por tela, é consequência do contrato.
2. **Gestor e Colaborador são vinculados a setores.** Um usuário pode ter vários setores. O vínculo é a regra padrão: ter o setor Fiscal libera as telas, tarefas, clientes e agentes do Fiscal.
3. **Acesso customizado por tela existe, mas é exceção configurada.** O Administrador pode, por usuário, liberar ou bloquear telas específicas além do padrão do setor (ex.: um Colaborador do DP que também vê a tela de honorários). A regra é "setor dá o padrão, exceção por tela ajusta".
4. **Só o Administrador edita papéis, setores e exceções.** Gestor não promove ninguém.
5. **Carteira de clientes é um segundo filtro, opcional.** Por padrão, quem tem o setor vê todos os clientes naquele setor. O escritório pode ligar "carteira" para restringir um Colaborador a uma lista de clientes. Deixar desligado é o mais simples e o que a maioria dos escritórios pequenos quer.
6. **Agentes herdam o escopo de quem os possui, nunca mais do que isso.** Detalhe no módulo 5.
7. **Modo BPO / escritório para escritório** (DA-01): um escritório pode ter subinquilinos; cada um com os próprios Administradores e **sem assinatura própria** (o BPO é o único que assina; subplano 10). O escritório-mãe vê cada subinquilino dentro do `escopo_mae`, só nos departamentos contratados.

Cada ação no sistema é verificada contra a tupla **(usuário, escritório, setor, cliente, tela ou ferramenta, titular, nível da ação)**; o titular (escritório ou empresa cliente) só importa nos componentes compartilhados entre pacotes (DA-02.1). Os níveis de ação são os mesmos do plano: **ler, rascunhar, executar**. Essa mesma verificação vale para tela e para agente, porque os dois chamam as mesmas ferramentas (1.6).

**Decisões (7/11/2026):** os nomes Administrador, Gestor, Colaborador e Cliente ficam. A carteira de clientes por usuário entra na primeira versão, desligada por padrão.

### 1.2 Cadastro único (clientes, pessoas, identidades)

Uma entidade **Cliente** por empresa ou pessoa física atendida, com perfil versionado no tempo (regime, CNAEs, UF, município, responsáveis, honorário, serviços contratados, situação: prospecção, implantação, ativo, suspenso, desligado).

Ligadas ao cliente, **Pessoas** (sócio, contador interno, financeiro, RH, contato de confiança) e, ligadas às pessoas, **Identidades**: cada telefone, e-mail, CPF, login de portal, usuário do app. É a identidade que faz o CRM reconhecer um número de WhatsApp como "o financeiro da empresa X" e o timesheet atribuir o atendimento ao cliente X.

Regras:

1. **Um cadastro, muitos pontos de uso.** Painel, CRM, timesheet, app e agentes leem o mesmo registro. Não existe "cadastro do CRM" nem "cadastro do app".
2. **Uma identidade pertence a uma pessoa; uma pessoa pode pertencer a vários clientes** (o contador interno que cuida de três empresas do mesmo grupo). O CRM, ao receber mensagem de uma identidade ligada a vários clientes, pergunta ou infere pelo contexto (assunto, último atendimento) e marca o cliente na conversa.
3. **Identidade desconhecida vira lead**, nunca cliente. O atendente ou o agente liga o lead a um cliente existente (merge) ou cria o cliente ao fechar contrato.
4. **Dedução e fusão (merge) com histórico.** Fundir dois cadastros preserva todas as conversas, tarefas e horas. Nada é apagado, só religado.
5. **Grupos econômicos** (holding com várias empresas) são um rótulo sobre clientes, para visão consolidada.
6. **Importação inicial** pelo core (Domínio, Alterdata, Contmatic via arquivo) e pela planilha ou Drive do escritório; depois a plataforma é a fonte e o core recebe (quando houver API) ou é atualizado por rotina.

### 1.3 Tarefas: a entidade que todos os módulos criam e consomem

Tudo que precisa ser feito é uma **Tarefa**: cliente, setor, atividade do catálogo (os IDs do mapa, como FIS-045), responsável (pessoa ou agente), origem, prazo, status, checklist, documentos ligados, conversa ligada, tempo registrado.

Origens possíveis de uma tarefa, todas iguais para o resto do sistema:

| Origem | Exemplo |
| --- | --- |
| Obrigação recorrente | "Enviar DCTFWeb de novembro", gerada pelo calendário de obrigações a partir do perfil do cliente |
| Pedido do cliente | pelo app ou pelo WhatsApp ("preciso de uma certidão negativa") |
| Agente | o agente do Fiscal detectou divergência entre XML e SPED e abriu tarefa para o Colaborador conferir |
| Pessoa | o Gestor cria manualmente ou a partir de uma conversa no CRM |
| Trilha de implantação | ao mudar o cliente para "implantação", a trilha cria as tarefas de entrada |

Status: **a fazer → em andamento → aguardando cliente → aguardando terceiro (órgão, banco) → em revisão → concluída / cancelada**. "Aguardando cliente" é o que alimenta o painel de pendências por cliente e a régua de cobrança do CRM.

Toda tarefa sabe **quem pode concluir**: pessoa, agente sozinho, ou agente prepara e pessoa conclui (os eixos de autonomia do mapa). É isso que o time de agentes consulta para decidir o que fazer sozinho.

### 1.4 Documentos: um índice único, os arquivos onde o escritório quiser

**Decisão (7/11/2026):** a plataforma não obriga o escritório a mover os arquivos. Ela é dona do **índice** (metadados, permissões, hash, quem enviou, quem baixou, tarefa e cliente ligados, visível ao cliente ou não) e os **bytes** ficam no **armazenamento que o escritório escolher**, por meio de um conector:

| Opção | Para quem | Como funciona |
| --- | --- | --- |
| **1. Espelho da nuvem do escritório** (Google Drive, OneDrive e SharePoint; outros depois) | Quem já tem a estrutura montada, como o Leandro | O escritório conecta a conta; a plataforma lê a árvore, mapeia pastas para clientes (regra de nome ou mapeamento manual), indexa, e passa a gravar e ler ali. Alterações feitas direto no Drive chegam por notificação de mudança da própria nuvem e atualizam o índice |
| **2. Armazenamento da plataforma** | Quem não tem estrutura ou quer sair da que tem | Cobrado pelo tamanho; com importação da nuvem anterior (lê, copia, mantém a árvore) |
| **3. Servidor próprio do escritório** | Quem tem servidor de arquivos | O escritório expõe o servidor por um protocolo padrão (S3 compatível, WebDAV ou SFTP) e a plataforma o usa como qualquer outro conector |

Observações sobre a proposta:

- A opção 3 é melhor como **protocolo padrão** do que como "API aberta que lê o servidor": com S3, WebDAV ou SFTP o escritório usa o que já tem (NAS, Windows Server, MinIO) sem ninguém escrever código do lado dele, e a plataforma não precisa entrar na rede dele.
- O que vale em qualquer opção: **toda leitura e gravação pela plataforma passa pelo índice**. É isso que mantém permissões por cliente e papel, a auditoria de entrega ("baixou" como comprovante) e a busca para a IA. Arquivo colocado direto no Drive é indexado, mas não tem "quem enviou" até alguém confirmar.
- A árvore padrão da plataforma é cliente / ano / competência / tipo. Um escritório com árvore diferente informa o mapeamento uma vez; a plataforma não renomeia nada dele.
- Um escritório pode trocar de opção sem perder nada, porque o índice é o mesmo; só os bytes mudam de lugar.
- O painel atual do Leandro usa o Drive como banco de dados e de arquivos. Aqui o Drive é só arquivo; os dados (cadastro, tarefas, obrigações) ficam no banco da plataforma. Na importação, as planilhas dele viram carga inicial do banco.

### 1.5 Registro de eventos: a espinha do timesheet, da auditoria e dos agentes

Cada ação relevante gera um **evento** imutável: quem (pessoa ou agente), escritório, cliente, setor, atividade, ferramenta usada, início e fim, resultado, custo (horas ou tokens). Três consumidores leem o mesmo fluxo:

- **Timesheet** (módulo 3): soma os eventos em sessões de trabalho;
- **Auditoria**: quem fez o quê, quando, com qual credencial;
- **Time de agentes** (módulo 5): os eventos são os gatilhos que acordam os agentes ("documento recebido", "tarefa atrasada", "cliente sem resposta há 24 h").

Os eventos dos sistemas core (Alterdata por API; Domínio por API negociada; Contmatic por arquivo ou nada) entram no mesmo fluxo depois de normalizados para o catálogo de atividades.

### 1.6 Ferramentas tipadas: a única porta de entrada

Todo recurso do sistema é uma **ferramenta com contrato tipado** (entrada, saída, nível de permissão, cliente e setor que afeta, custo). As telas chamam ferramentas; o chat chama as mesmas ferramentas; os agentes chamam as mesmas ferramentas. Não existe caminho exclusivo de tela.

Consequências práticas:

- qualquer coisa que a tela faz, a IA pode fazer pelo chat, com a mesma permissão de quem pediu;
- cada ferramenta já nasce com evento, logo com timesheet e auditoria;
- os níveis **ler / rascunhar / executar** definem quando o agente age sozinho e quando aparece o botão "sim / não".

### 1.7 Notificações: uma central, vários canais

Uma **central de notificações** por usuário e por cliente, com preferências de canal: dentro do sistema, WhatsApp, e-mail, push do app. Tudo que o sistema "avisa" passa por ela, inclusive os avisos dos agentes. Regras de silêncio (horário, agrupamento em resumo diário, prioridade) ficam aqui, não em cada módulo.

### 1.8 Dados separados por escritório

DA-01 do plano: dois níveis de inquilino desde a base, política de acesso por linha forçada no banco, inquilino vindo da autenticação, testes de vazamento automáticos. Vale para dados, documentos, busca, memória dos agentes, marca e certificados.

### 1.9 Marca branca em todo o sistema

**Decisão (7/11/2026):** o sistema inteiro, não só o app do cliente, nasce com marca branca. Cada escritório tem um **tema**: logotipo, nome do produto, cores, tipografia, domínio próprio (painel e app), remetente de e-mail e nome exibido no WhatsApp. Regras para o código:

- nenhuma cor, logotipo ou nome fixo no código: tudo vem de variáveis de tema carregadas por escritório;
- os componentes de tela usam só os tokens do tema (cor primária, fundo, texto, destaque), para que mudar o tema seja trocar um arquivo, não reestilizar telas; a **cor de estado** (atenção, erro, sucesso) é um token separado da cor de destaque da marca (decisão do UI lab, 7/11/2026);
- os integrantes do time têm nome e avatar configuráveis por escritório, e os textos padrão (saudações, mensagens automáticas, régua de cobrança) são modelos editáveis;
- documentos gerados (relatórios, recibos, notificações) usam o tema do escritório;
- no modo BPO, o subinquilino pode ter tema próprio.

### 1.10 Suporte geral: chat com pessoas e assistente de ajuda

**Decisão (8/11/2026, P25 do estudo de precificação):** o sistema tem um **chat de suporte geral com pessoas** (a equipe da plataforma) e, dentro dele, **incluído**, um **assistente de ajuda padrão e barato**. Regras:

- **é da plataforma**, não de um pacote de área nem de um módulo: vale para todo usuário, com ou sem plano de IA, em qualquer produto (contábil, BPO financeiro, outros);
- **ordem do suporte (8/11/2026): FAQ, depois o assistente, depois a equipe.** A Ajuda do sistema abre com **seções básicas de FAQ** (perguntas curtas escritas e mantidas pela equipe do produto, sem IA e sem custo por consulta); se o FAQ não resolver, o usuário pergunta ao assistente; se o assistente não resolver ou o limite acabar, fala com a equipe;
- o assistente de ajuda responde **só sobre o sistema e as configurações dele** (como fazer, onde fica), com um **modelo pequeno** e uma **base de conhecimento do produto**. **Decisão do usuário (8/11/2026): para achar o que está errado, ele pode acessar, só em leitura, as configurações, os dados e a estrutura do escritório, dentro das permissões da pessoa que perguntou** (a interseção com o escopo dela; nunca vê mais do que ela veria), e **não altera nada sem a aprovação dela**: a correção vira cartão de aprovação. Não é integrante do usuário (02) e **não consome o limite do plano de IA**;
- **limite básico de perguntas por mês** por usuário (hipótese: 30); ao atingir o limite, ou quando não souber, **encaminha para a equipe**, abrindo um chamado no chat com o histórico da conversa;
- o ponto de entrada é **Suporte**, no pé da barra lateral (acima de Configurações) e no menu do usuário (03, 2.2), sempre visível, também no modo de espera. A tela (desenhada no UI lab, 8/11/2026) tem três partes: **Ajuda do sistema** (**FAQ primeiro**, depois o assistente, com o contador das 30 perguntas do mês, fora do limite de IA; ao esgotar ou sem resposta, encaminha à equipe), **Falar com a equipe** (chat com pessoas, com **fila** e aviso **fora do horário**) e **Histórico** dos chamados;
- **Se o assistente não resolver, a equipe pode pedir para ver a tela da pessoa**, com **pedido prévio**, **consentimento** dela, **prazo** e **registro**; a equipe não navega pelos dados do escritório por conta própria (Fundações, adendo 26). **Premissas mantidas pelo usuário (8/11/2026):** tela compartilhada de **30 minutos**, no máximo **5 leituras por pergunta** de diagnóstico, **sem gravação**; falta o parecer do advogado do grupo sobre a base legal (LGPD);
- tudo vira dado de produto: **Chamado de suporte**, **contador mensal de perguntas por usuário** e **Sessão de tela de suporte**, ferramentas `suporte.perguntar_ajuda`, `suporte.diagnosticar` (só leitura) e `suporte.abrir_chamado` e eventos `suporte.*` (Fundações, adendos 24 e 26);
- custo e margem: R$ 12,50 por assento de suporte humano, R$ 2 de chat com pessoas e R$ 0,16 de assistente por usuário por mês (R$ 0,15 mais R$ 0,01 do diagnóstico de leitura; R$ 0,65 no limite de 30 perguntas; o FAQ custa só conteúdo e manutenção, R$ 0 nos totais; estudo 6.8.8), no custo do sistema-base, sem preço próprio (estudo de precificação, 6.8.9 e 6.8.10). **Comparação:** a ajuda por IA custa 1,3% dos R$ 12,50 do suporte humano e é o que mantém o provável nessa metade dos R$ 25 (se o suporte humano ficasse em R$ 25, o sistema-base do médio cairia de 39,9% para 26,2% de margem).

---

## 2. Módulo Painel

**Objetivo:** a tela de trabalho do escritório. Tudo que o levantamento mapeou por aba mora aqui.

### 2.1 Estrutura da tela

```
┌─ Barra superior ─────────────────────────────────────────────────┐
│ [Escritório ▾]  [Cliente selecionado: Empresa X ▾ | Todos]  🔔  🙂 │
├─ Navegação ──────────────┬────────────────────────────────────────┤
│ Home                     │                                        │
│ Clientes e Societário    │   Conteúdo da aba, no contexto do      │
│ Obrigações e Prazos      │   cliente selecionado (ou da carteira) │
│ Notas fiscais            │                                        │
│ Fiscal                   │   ┌────────────────────────────────┐   │
│ Trabalhista e DP         │   │ Tarefas deste setor            │   │
│ Contábil                 │   └────────────────────────────────┘   │
│ Consultoria e Reforma    │                                        │
│ Financeiro do escritório │                                        │
│ Gestão                   │                                        │
│ Atendimento (CRM)        │                                        │
│ Timesheet                │                                        │
├──────────────────────────┴────────────────────────────────────────┤
│ Chat com o time de agentes (gaveta lateral, sempre disponível)     │
└───────────────────────────────────────────────────────────────────┘
```

- **Decisão (7/11/2026, após o subplano 03; reagrupada pelo UI lab em 8/11/2026): a navegação principal é uma barra lateral expansível com os módulos e cada módulo tem abas internas.** Ordem: **Início, Painel, CRM, Timesheet, Arquivos, Financeiro, BPO**, e, no pé, **Suporte** e **Configurações**; cada item aparece só se o pacote ou módulo está na assinatura e o usuário tem o vínculo. **Início** tem três abas (Assistente, que abre primeiro, Time e Visão geral). **Painel** tem oito (Societário, Obrigações, Notas, Fiscal, DP, Contábil, Consultoria, Gestão; o nome curto vai na aba e o completo, no título da tela), **só existe para quem tem setor contábil** (quem é só do BPO não o vê) e **Obrigações é aba própria**: com cliente, a agenda de todas as áreas dele; na carteira, a semana por cliente. **Financeiro** (sete abas), **Arquivos** e **BPO** (nove) são módulos laterais, não abas do Painel. O item do pacote de área (Painel, BPO) é o trabalho para o cliente; o Financeiro é sempre o da própria empresa (03, 2.0; Plano, DA-02.1, itens 9 e 10). O esquema acima mostra o conteúdo, não a posição (a posição é a deste item e a do [subplano 03](subplanos/03-Painel.md), seção 2.0).
- **Cliente selecionado** é um contexto global **por módulo**: trocar o cliente troca o conteúdo das abas, do chat e das tarefas. **O seletor some no CRM, no Financeiro e em Configurações** (são do escritório; ali as listas filtram por cliente; UI lab, 7/11/2026); **no BPO lista só as empresas de BPO** e **no Painel, só as da contabilidade** (a empresa só de BPO não aparece no Painel). O modo **"Todos"** mostra a visão de carteira (listas, pendências, totais).
- **As abas são as do mapa** (seções 4.1 a 4.10 do plano). Pessoa física, terceiro setor e nichos não são abas: são **perfis do cliente** que mudam o que cada aba mostra (um cliente PF não tem aba Fiscal cheia de ICMS; tem carnê-leão e IRPF).
- **Cada aba tem um bloco fixo "Tarefas deste setor"**: as tarefas do setor para o cliente selecionado (ou para a carteira), com filtro por responsável e status. É o mesmo dado do calendário da Home, filtrado.
- Cada aba mostra ainda: os **dados** da aba (do perfil do cliente e das capturas), os **documentos** da aba, as **ações** (botões que chamam ferramentas, com o nível de permissão visível: "preparar", "executar com aprovação"), e o **painel de pendências** daquele setor.
- O usuário só vê as abas dos setores dele. Gestão e Financeiro do escritório aparecem para Administrador e Gestor; Timesheet aparece para todos, o Colaborador em modo "meu tempo".
- **A divisão em abas é a do mapa, mas ainda não foi testada como experiência de uso.** O subplano do Painel precisa validar com os contadores se a separação faz sentido na tela (quantidade de abas, o que fica junto, o que vira filtro), antes de desenhar as telas.

### 2.2 Home

(Desde a decisão do UI lab de 7/11/2026, a Home é a aba **Visão geral** do item Início, ao lado de Assistente e Time; os blocos abaixo viram widgets personalizáveis, 03, 4.)

Dashboard do que importa hoje, para a conta logada e para o cliente selecionado (ou carteira):

1. **Calendário de tarefas e obrigações**, no estilo do Hubstrom: dia, semana, mês; cor por setor; filtro por responsável; arrastar para reprogramar; clicar abre a tarefa.
2. **Pendências por cliente** (CTB-201 do mapa): o que está "aguardando cliente", há quantos dias, com botão de cobrar pelo CRM.
3. **Avisos dos agentes**: o que o time fez ou encontrou desde o último acesso, com os botões de aprovação pendentes.
4. **Indicadores do setor ou do escritório**: atrasos, obrigações do mês entregues × pendentes, conversas sem resposta, horas da semana (do timesheet).
5. **Linha do tempo do cliente selecionado**: últimos eventos (documento recebido, guia emitida, conversa, tarefa concluída).

Os blocos são configuráveis por usuário (ordem, quais aparecem).

### 2.3 Regras de negócio principais

- A Home e as abas não têm dados próprios: são projeções das fundações (tarefas, documentos, eventos, perfil do cliente).
- O calendário de obrigações é gerado pelo **perfil do cliente × regras de obrigação** (versão vigente, por regime e UF). Mudou o perfil, o calendário futuro muda; o passado fica.
- Toda ação que altera dados do cliente passa por ferramenta e gera evento; não há edição "silenciosa".
- O que o painel do Leandro já resolve (chegando na segunda) será cruzado com o mapa: o que já existe nele entra como referência de regra de negócio e de layout de dados, não como código a reaproveitar, porque o Google Apps Script não carrega para a plataforma.

### 2.4 Perguntas

**Decisões (7/11/2026):** Clientes e Societário continua como aba. O cliente selecionado persiste entre sessões. Não há aba de relatórios transversal: cada aba cuida dos seus e a Gestão consolida.

---

## 3. Módulo CRM

**Objetivo:** todas as conversas do escritório com clientes e leads, em qualquer canal, ligadas ao cadastro único e às tarefas.

### 3.1 Entidades e regras

- **Canal**: WhatsApp (um ou mais números), chat do app do cliente, e-mail, formulário do site. Novos canais plugam na mesma caixa de entrada.
- **Conversa**: pertence a um cliente (ou lead) e a um setor; tem responsável, status, etiquetas, prazo de resposta (SLA) e notas internas invisíveis ao cliente.
- **Fio único por cliente**: WhatsApp e chat do app são o **mesmo fio**. O cliente que começa no app e continua no WhatsApp vê uma conversa só, e o atendente também. O canal de resposta é o último usado pelo cliente, com possibilidade de escolher.
- **Status**: nova → em atendimento → aguardando cliente → aguardando interno → resolvida. "Aguardando interno" cria ou aponta para uma tarefa.
- **Um número de WhatsApp por setor, compartilhado pelas pessoas do setor.** Decisão de 7/11/2026. Não há filas: a conversa que chega no número do Fiscal aparece para todos do Fiscal como "sem responsável"; quem assume passa a ser o responsável, e pode **repassar** para outra pessoa do setor ou **transferir** para outro setor (a conversa segue no número do outro setor, com o histórico inteiro). Enquanto ninguém assume, o cliente recebe a mensagem automática do escritório ("já vamos atendê-lo"), e o agente de atendimento responde o que for factual. Escritórios com um número só ligam esse número ao setor Gestão e Atendimento, que faz o papel de recepção e transfere para os outros setores no mesmo número (não existe setor "Geral"; os setores são fixos).
- **Leads**: pipeline simples em quadro (lead → qualificado → proposta → contrato → implantação). Fechar contrato cria o Cliente e dispara a trilha de implantação (tarefas de entrada do mapa).
- **Visão do cliente**: aba no CRM que mostra tudo que aquele cliente conversou, pediu, recebeu e tem pendente, em qualquer canal e setor.
- **Comunicados**: envio segmentado (por regime, UF, setor, perfil) com modelos aprovados, respeitando a política de opt-in e a janela do WhatsApp.
- **Horário de atendimento**: fora do horário, o agente de atendimento responde o que pode (status de guia, documento, agendamento) e registra o resto como conversa "nova" para o dia seguinte.

### 3.2 IA no CRM

Ações de um clique ou automáticas, todas via ferramentas com nível de permissão:

| Ação | Como funciona | Autonomia padrão |
| --- | --- | --- |
| **Responder com tom** | Botões "formal", "direto", "amigável", "explicar como para leigo"; a IA reescreve o rascunho do atendente | Rascunhar |
| **Responder com dado** | "Minha guia saiu?" vira resposta com a guia do mês anexada, porque a IA consulta o motor Escritório | Executar para dados simples, rascunhar para o resto |
| **Transcrever áudio** | Todo áudio recebido é transcrito e resumido; o atendente lê, não ouve | Executar |
| **Virar tarefa** | A IA lê a conversa (texto e áudios) e propõe a tarefa: cliente, setor, atividade do catálogo, prazo, responsável; um clique cria | Rascunhar |
| **Triagem automática** | Nova conversa é classificada por setor e urgência e vai para o setor certo | Executar, com correção fácil |
| **Documento recebido** | Arquivo enviado na conversa é identificado (nota, extrato, contrato) e vai para a pasta e a tarefa certas | Executar para tipos reconhecidos; rascunhar para os demais |
| **Resposta técnica com citação** | Pergunta de legislação gera rascunho do Consultor (motor Legal) com a citação para o contador aprovar | Rascunhar, sempre |
| **Régua de cobrança** | Documentos e informações pendentes são cobrados pelo canal preferido, em cadência configurada, sem ninguém lembrar | Executar |
| **Alerta de silêncio** | "Estes 8 clientes estão sem resposta há mais de 24 horas" | Executar (aviso) |
| **Resumo da conversa** | Ao assumir ou transferir, resumo do que já aconteceu | Executar |

Ideias além do que você listou, para avaliar:

- **Detecção de pedido implícito**: o cliente comenta "contratei dois funcionários semana passada" e o agente do DP já propõe tarefa de admissão e pede os documentos.
- **Sinal de risco de perda do cliente**: reclamações, tom, atraso de honorário e silêncio prolongado combinados em um alerta ao Gestor.
- **Agendamento de reunião** direto na conversa, com a agenda do responsável.
- **Pesquisa de satisfação** curta ao resolver, com nota por setor.
- **Modelos de mensagem por evento**: guia emitida, documento faltando, prazo chegando, cada um com a variável puxada do sistema.
- **Base de respostas do escritório**: respostas aprovadas viram exemplos para a IA (melhoria contínua, com a mesma lógica de benchmark do assistente).

### 3.3 Conexão com o WhatsApp

Decisão a partir da [pesquisa S3](../pesquisa/plataforma/S3-conexao-whatsapp.md):

- **Padrão: Cloud API oficial direto na Meta, com coexistência.** O recurso de coexistência deixa o mesmo número no app WhatsApp Business do celular e no CRM ao mesmo tempo, sem custo além das tarifas da Meta. Resolve a objeção clássica ("não quero perder o WhatsApp do celular") e dispensa provedor intermediário no começo.
- **Canal abstraído desde o início.** O CRM fala com uma interface de provedor; Cloud API, provedor (360dialog, Gupshup, Z-API) e bibliotecas não oficiais são implementações trocáveis, como a Evolution API faz.
- **Modo não oficial (WhatsApp Web via Baileys ou Evolution) só como opção experimental**, ligada pelo Administrador com aviso explícito de banimento, histórico sempre salvo no CRM e migração para coexistência em um clique. Nunca para disparos fora da janela de 24 h; esses vão por template aprovado.
- **Áudio sempre transcrito** (centavos por minuto) e guardado como texto na conversa.
- **IA no atendimento:** bots de atendimento ao cliente nunca foram atingidos pela política da Meta contra "assistentes de IA de uso geral"; a tarifa de provedor de IA (US$ 0,0625 por mensagem fora de template, desde março) não deve se aplicar ao nosso caso, mas fica marcada para confirmar antes de vender "IA responde o cliente" como recurso.
- **Escala:** virar Tech Provider da Meta ou usar plano de parceiro sem markup para fazer o onboarding de muitos escritórios.

### 3.4 Perguntas

**Decisões (7/11/2026):** um número por setor, sem filas, com repasse entre pessoas do setor e transferência entre setores. E-mail entra no CRM na primeira versão. Lead conversa só pelo WhatsApp; o app é exclusivo de quem já é cliente, com acesso à conta da própria empresa.

---

## 4. Módulo Timesheet

**Objetivo:** saber onde o tempo do escritório vai, por cliente, setor, atividade e pessoa, sem apontamento manual na maior parte dos casos.

### 4.1 Fontes de tempo, em ordem de preferência

| # | Fonte | Cobertura | Confiança |
| --- | --- | --- | --- |
| 1 | **Eventos da plataforma** (toda ferramenta, toda tela, todo atendimento no CRM, toda ação de agente) | Tudo que é feito dentro do sistema | Alta, automática |
| 2 | **APIs dos cores** (Alterdata confirmada; Domínio a negociar; Questor pública) | O que é feito dentro do core | Alta, depende do fornecedor |
| 3 | **Captura passiva** fora da plataforma (4.5) | O que é feito em portais e em cores sem API | Média a alta, com revisão em um clique |
| 4 | **Inferência por artefato** | Um arquivo do core apareceu na pasta, uma guia foi emitida, um e-mail saiu: o sistema registra a atividade com o tempo médio do catálogo e marca "estimado" | Média-baixa, clara como estimativa |
| 5 | **Apontamento assistido** | O que sobrou aparece pré-preenchido ("você esteve 40 min sem atividade registrada entre 10h e 10h40, o cliente aberto era X; confirma?") para confirmação em um clique | Último recurso |

A quinta fonte é a versão aceitável da "solução feia": ninguém digita o que fez; confirma ou corrige o que o sistema deduziu.

### 4.2 Modelo canônico

Toda fonte vira uma **sessão de trabalho**: pessoa ou agente, cliente, setor, atividade do catálogo (os IDs do mapa), origem, início, fim, confiança (automática, estimada, confirmada), evidências (eventos ou artefatos que a geraram). As tarefas dos cores são mapeadas para o catálogo uma vez por escritório (tabela de equivalência), e o que não casa cai em "atividade do core sem equivalente" para o Gestor classificar.

Regras:

- início e fim vêm dos eventos; inatividade acima de um limite encerra a sessão;
- duas sessões sobrepostas da mesma pessoa não somam: a mais específica vence e a outra é cortada;
- tempo sem cliente é registrado como "interno" (reunião, treinamento, administrativo), também com atividade do catálogo;
- **ações de agentes também viram sessões**, com custo em tokens e tempo de máquina, para que o Gestor veja horas humanas e trabalho de agente lado a lado;
- o Colaborador vê e pode contestar as próprias sessões; a contestação fica registrada.

### 4.3 Tela

Visível para Administrador e Gestor (o Colaborador vê só o próprio): gráficos com filtros por setor, cliente, atividade, pessoa e período; horas por cliente × honorário (rentabilidade); capacidade por setor (horas disponíveis × horas registradas); proporção automática × estimada × confirmada (para saber o quanto a captura está funcionando); exportação.

### 4.4 Como o tempo fora da plataforma é atribuído ao cliente

**Decisão (7/11/2026): o coletor Windows de título de janela não entra.** A objeção é certa: o título da janela do core nem sempre diz qual empresa está aberta, e um registro "esteve no Domínio das 10h às 11h" sem cliente é inútil. A [pesquisa S2](../pesquisa/plataforma/S2-captura-de-tempo.md) fica como referência; o fallback é outro.

O que resolve a atribuição é **a tarefa aberta na plataforma**. O fluxo de trabalho do Colaborador parte da lista de tarefas do painel, não do core:

1. O Colaborador abre a tarefa (por exemplo, "Apurar ICMS de outubro, Empresa X"). A tarefa já tem cliente, setor e atividade do catálogo. Abrir é **iniciar**.
2. Ele vai ao Domínio, ao Contmatic ou ao portal e faz o trabalho. Tudo o que acontece enquanto a tarefa está aberta é contado para ela.
3. Ele volta e marca **concluída**, ou abre outra tarefa (o que encerra a anterior), ou o sistema encerra por inatividade.

Fontes de confirmação em volta disso, do mais confiável ao menos:

- **APIs dos cores** (Alterdata hoje; Domínio a negociar): confirmam ou corrigem a sessão, e permitem atribuir o que foi feito sem tarefa aberta.
- **Extensão de navegador** para portais do governo e cores web: registra a aba ativa e o CNPJ que aparece na URL, no título ou na página, e confirma o cliente da sessão. Pode ler a página só para identificar o cliente e envia apenas o identificador, nunca o conteúdo (subplano 05, 3.3).
- **Artefatos**: arquivo gerado pelo core na pasta do cliente, guia emitida, e-mail enviado. Confirmam que a tarefa foi feita e aproximam a duração quando a sessão não existir.
- **Confirmação assistida**: o que sobrou aparece pré-preenchido para confirmar em um clique.

**Inatividade (decisão de 7/11/2026, ajustada em 7/11/2026 pelo UI lab):** entre 2 e 5 minutos sem atividade (valor configurável pelo Administrador), a tela entra em **modo de espera**; o sistema **não desloga nem pede nova autenticação**. O modo de espera vale só nas telas que registram tempo sozinhas (Painel com cliente aberto e CRM, exceto Números). Entrar em espera significa: a sessão de trabalho do timesheet é encerrada no último evento registrado e nada continua contando. Quando a pessoa clica em Continuar, a tarefa continua aberta e uma nova sessão começa, sem pedir senha. Início (onde só conta o que a IA faz), Painel na carteira, Timesheet, Financeiro e Configurações não contam tempo e não entram em espera. Enquanto a pessoa está trabalhando no core, a plataforma não vê atividade; para não cortar o tempo, a extensão de navegador e, no futuro, as APIs dos cores servem de sinal de "ainda em atividade". Sem nenhum sinal, a sessão é cortada e o tempo no core entra como estimado, para confirmação. É o custo de não ter coletor, e é aceitável.

Com isso, o apontamento manual que sobra é raro: tarefa feita sem ter sido aberta no painel, atendimento por telefone sem registro, e as correções da confirmação assistida.

### 4.5 Decisões registradas

O Colaborador vê o próprio timesheet e pode contestar registros (a contestação fica registrada; o Gestor decide). O trabalho dos agentes aparece no mesmo painel, em série separada das horas humanas.

---

## 5. Módulo Time de agentes (IA agêntica)

**Objetivo:** operar o sistema pelo chat e ter agentes que trabalham sozinhos e avisam o usuário.

### 5.1 Conceito

Cada usuário tem um **time**. O time é composto por:

- **Integrantes padrão por setor**: um por setor com equipe que o usuário tem (Societário, Fiscal, Notas, DP, Contábil, Consultoria, Gestão e Atendimento, Financeiro do escritório; subplano 01, 4.1). Aparecem sozinhos, com função pronta, e só para quem tem o setor.
- **O Consultor** (módulo 6), presente em todo time.
- **Integrantes criados pelo usuário**: a partir de um modelo. O usuário dá nome, função em linguagem natural, escolhe as ferramentas (subconjunto do que ele próprio tem), os gatilhos (eventos, horários) e o canal de aviso.

Um integrante é: **persona** (nome, instruções, tom) + **escopo** (setores, clientes, ferramentas, níveis de ação) + **memória própria** (o que aprendeu sobre o escritório e o usuário, separada por integrante) + **gatilhos** + **canal de entrega**.

**Os integrantes são de cada usuário, mas conversam entre si (decisão de 7/11/2026).** O integrante do Fiscal do usuário 1 ("João") e o do Fiscal do usuário 2 ("Ana") são diferentes: cada um com a memória, o dono e o escopo do seu usuário. Mas o trabalho do escritório atravessa pessoas e setores, então eles se passam trabalho:

- **Passagem de trabalho (handoff) é por tarefa, não por conversa.** Quando João termina a parte do Fiscal de algo que continua no DP, ele cria ou atualiza a tarefa, e a tarefa tem um responsável. O integrante do DP **do usuário responsável por aquele cliente no DP** acorda pelo evento e continua. Se o cliente não tem responsável naquele setor, vai para o integrante do Gestor do setor.
- **Mensagem direta entre integrantes** também existe, para pedir ou devolver informação ("Ana, a Empresa X mudou de regime; confira o cálculo de outubro"). A mensagem chega na fila da Ana com a origem (João, usuário 1) e aparece para o usuário 2 como atividade do time, nunca como ordem escondida.
- **Memória em dois níveis:** a memória privada de cada integrante (o que o usuário dele prefere, como trabalha) e a **memória do escritório por setor**, compartilhada por todos os integrantes daquele setor (decisões do escritório, particularidades de cada cliente, regras combinadas). O João escreve no nível do escritório só o que vale para todos, e o Administrador pode revisar.
- **Nada passa entre integrantes com mais permissão do que a do usuário destinatário.** A mensagem do João para a Ana só tem o que o usuário 2 poderia ver.
- Os usuários veem o fluxo: a Home mostra "João (de Fulano) passou a admissão da Empresa X para Ana (de Beltrano)".

É a mesma ideia dos canais compartilhados do OpenBot e das mensagens entre agentes: ali, agentes com papéis diferentes passam tarefas e arquivos entre si e anunciam no canal. Aqui, o canal é o registro de tarefas e eventos do escritório.

### 5.2 Chats separados, motores compartilhados

- **Um chat por integrante.** Contexto separado, histórico próprio. É o que dá organização.
- **O chat "Geral"** é a tela principal do chat: um chat grande, no estilo do ChatGPT ou do Claude, que recebe qualquer pergunta e responde direto ou encaminha para o integrante certo (é o roteador de intenção do plano, etapa 0). **Os integrantes aparecem como ícones na coluna da direita**; clicar em um abre o chat daquele integrante, com o histórico dele. A gaveta abre sempre no Geral (decisão de 7/11/2026).
- Por trás de todos, **os mesmos quatro motores** (Legal, Escritório, Cálculo, Ação). O integrante é uma casca com persona, escopo e memória sobre os motores; não existe um modelo de raciocínio por integrante.
- **Operação pelo chat**: o integrante traz dados em cartões (tabela, documento, guia), oferece ações com botões **sim / não**, e executa pela mesma camada de ferramentas da tela. O que exige "executar" sempre pede o botão, a não ser que a atividade esteja marcada como "agente faz sozinho" no mapa e o Administrador não a tenha tirado da lista do escritório (a lista vem preenchida; subplano 01, 3.3).

### 5.3 Proatividade

Os integrantes chegam ao usuário sem serem chamados, por três gatilhos:

1. **Eventos** (1.5): documento recebido, tarefa atrasada, prazo em 3 dias, conversa sem resposta, divergência detectada, mudança de legislação relevante.
2. **Agenda** (batimento periódico): o integrante acorda em intervalos e horários definidos, revisa a fila dele e decide se há algo a fazer ou a dizer.
3. **Condições**: regras do tipo "se X clientes do Simples ultrapassarem 80% do sublimite, me avise".

Regra de etiqueta: **só fala se houver algo**. O que não é urgente vai para o resumo diário (central de notificações, 1.7). Cada aviso diz o que o integrante fez, o que precisa de decisão e o que só é informação.

### 5.4 Mecânica técnica (copiada dos frameworks)

Da [pesquisa S1](../pesquisa/plataforma/S1-times-de-agentes.md). O OpenBot (openbot.run) é um app de desktop e servidor que roda um time de agentes persistentes com os provedores que o usuário já paga; cada agente tem papel, instruções, workspace, conversa, fila e contexto próprios, troca mensagens e arquivos com os outros, e há rotinas por agenda, workflows com aprovação e canais compartilhados com pessoas. Hermes, OpenClaw e Grok Bot resolvem o mesmo problema com mecânicas parecidas. O que faz esses sistemas "não esquecerem o objetivo" não é o modelo: é a infraestrutura em volta dele. Os componentes que o nosso sistema implementa, no servidor, por escritório e por usuário:

| Componente | O que faz | De onde vem |
| --- | --- | --- |
| **Registro de integrantes** | Persona, instruções, setor, modelo, política de ferramentas, dono | OpenBot, OpenClaw (SOUL/AGENTS) |
| **Sessões com chave composta** | `escritório:usuário:integrante:escopo` (chat, job, evento, subintegrante); transcript em banco | OpenClaw |
| **Fila persistente por integrante** | Mensagens e pedidos em fila FIFO com pausa, cancelamento e retomada; nada se perde se o processo cair | OpenBot |
| **Memória em camadas** | Perfil do usuário; memória curada por integrante com limite de tamanho, editada só por ferramenta (add, patch, remove); notas diárias pesquisáveis (texto e vetor); consolidação em background | Hermes, OpenClaw, Letta |
| **Compaction auditada** | Quando o contexto cresce, resumo salvo no transcript preservando pedido ativo e identificadores (CNPJ, guia, competência); checagem de perda de fatos | OpenBot, OpenClaw |
| **Agendador persistente** | Jobs por integrante com horário ativo, "só quando ocioso", histórico e recuperação de atraso | Hermes, OpenClaw, Grok Bot (rotinas) |
| **Gatilhos por evento** | O registro de eventos (1.5) acorda o integrante; eventos duplicados são agrupados; cada disparo roda em sessão isolada | OpenClaw (webhooks), Grok Bot |
| **Checagem sem modelo antes de acordar** | Um script determinístico decide se há algo a fazer; só então gasta tokens | Hermes (modo sem agente) |
| **Regra de silêncio** | "Só reporte o que exige atenção; senão não responda"; o resto vai para o resumo diário | OpenClaw (NO_REPLY) |
| **Delegação limitada** | Subintegrantes com contexto vazio, herança (nunca ampliação) de permissões, profundidade e concorrência máximas, modelo barato | Hermes |
| **Política de ferramentas** | Interseção com as permissões reais do usuário; ações irreversíveis pedem cartão sim/não; job sem humano = negar | Hermes, OpenClaw, Grok Bot (Auto Review) |
| **Conteúdo externo como dado** | Mensagens, e-mails, PDFs e páginas entram marcados como não confiáveis; integrante "leitor" sem ferramentas resume conteúdo hostil | OpenClaw |
| **Modelos de integrante** | Publicáveis pelo escritório, sem copiar memória nem credenciais | Grok Bot, OpenBot (marketplace) |
| **Canais compartilhados** (fase posterior) | Pessoa e integrantes na mesma conversa, com um dono da tarefa, delegação explícita, reatribuir e arquivar | OpenBot |

O que **não** copiamos: o OpenBot roda os agentes com acesso total ao computador e sem aprovação por ação (decisão explícita deles, para um usuário que confia nos próprios agentes); o Grok Bot põe todos os Bots do usuário na mesma máquina. Nós somos multi-usuário e multi-escritório, então a fronteira é por integrante e por usuário, na camada de ferramentas, sempre.

Armadilhas conhecidas que o desenho já evita: custo de tokens de heartbeat (jobs com condição e checagem sem modelo), injeção de instruções por mensagens e arquivos (conteúdo como dado), perda de fatos na compaction (resumo auditado com identificadores preservados), sessões eternas (reset do chat em marcos naturais, como virada de competência), e "memória fantasma" (o integrante só pode dizer que salvou se a ferramenta de memória confirmou).

### 5.5 Segurança e limites

- **Escopo efetivo = interseção (usuário, integrante).** Um integrante criado pelo Colaborador do Fiscal nunca enxerga o DP, mesmo que a instrução dele peça. A verificação é na camada de ferramentas, não no prompt.
- Integrantes padrão de setores que o usuário não tem **não existem** para ele; não são "ocultos".
- O Administrador define, por escritório, **o que os agentes podem executar sozinhos** (lista a partir do mapa) e **limites de custo** por usuário e por integrante.
- Toda ação de agente gera evento com o integrante, o usuário dono e a ferramenta; o painel mostra "feito pelo agente X de Fulano".
- Mensagens de clientes e documentos são **dados, nunca instruções**: o integrante que lê uma conversa não obedece ao que está escrito nela (defesa contra injeção de instruções).
- Memória do integrante é do escritório e do usuário; não sai do inquilino (DA-01).

### 5.6 Perguntas

**Decisões (7/11/2026):** integrantes criados por um usuário podem virar modelos do escritório, publicados pelo Administrador, em versão posterior. A gaveta de chat abre no Geral, com os integrantes na coluna da direita.

---

## 6. Módulo Consultor (IA Legal + Escritório)

**Objetivo:** o assistente do repositório, reestruturado como integrante de todo time, com os motores Legal e Escritório.

Modos:

| Modo | O que faz | Autonomia |
| --- | --- | --- |
| **Perguntar** | Responde com a cascata legal (vigência, citação conferida, abstenção quando não sabe) e com os dados do cliente selecionado | Ler |
| **Parecer** | Gera parecer ou resposta técnica com fundamentação, para revisão e assinatura do contador | Rascunhar |
| **Vigilância** (autônoma) | Acompanha mudanças legais relevantes para a carteira (regime, CNAE, UF) e avisa quem é afetado e o que fazer | Executar (aviso) |
| **Revisão de enquadramento** (autônoma) | Periodicamente relê o perfil de cada cliente contra as regras vigentes e aponta risco ou oportunidade (fator R, sublimite, reforma) | Executar (aviso), rascunhar a ação |
| **Segunda opinião** | Em tarefas marcadas como de risco, confere o que a pessoa ou outro agente fez antes de concluir | Rascunhar |
| **Modo cliente** | Versão para o app, limitada à empresa daquele cliente, com linguagem para leigo e sem opinar além do que o escritório liberou | Ler |

Mantém do assistente atual: cascata, verificação, abstenção, benchmark e melhoria contínua; os módulos avançados (DGM, RL, RAPTOR, HippoRAG) ficam atrás do benchmark, como já decidido.

**Decisão (7/11/2026):** o modo cliente responde direto o que é factual sobre a própria empresa (guia, prazo, situação) e manda para o contador o que é opinião ou planejamento.

---

## 7. Módulo App do cliente

**Objetivo:** o canal do cliente com o escritório: documentos, pendências, pedidos, conversa e serviços extras.

### 7.1 Funções base

- **Documentos**: tudo que o escritório gerou ou capturou, por competência e tipo, com "visto" e "baixado" registrados.
- **Pendências**: o que o escritório espera do cliente (documentos, informações, assinaturas), com envio direto pelo app.
- **Pedidos**: "preciso de certidão", "contratei alguém", "quero emitir nota": cada pedido cria a tarefa, o integrante do setor começa o que pode, o Colaborador é avisado, e o cliente acompanha o status.
- **Chat**: o mesmo fio do CRM (3.1). O cliente pode conversar com o escritório; o agente de atendimento responde o factual e o resto fica como conversa "nova" no setor.
- **Agenda**: marcar reunião com o responsável, na agenda dele.
- **Notificações**: push, com as mesmas regras da central.
- **Acesso**: cada pessoa do cliente entra na **conta da própria empresa** (convite do escritório por e-mail ou WhatsApp, com papel definido). Leads não têm acesso; o app é só de clientes.
- **Cadastro e assinaturas**: dados da empresa, termo de uso do certificado, envio do A1 (quando necessário, seção 2 do plano), procurações.
- **Financeiro com o escritório**: honorários, boletos, notas do escritório, histórico.
- **Papéis dentro do cliente**: sócio vê tudo; financeiro vê guias e boletos; RH vê folha e admissões. Definido pelo escritório.
- ~~Portal do funcionário~~: **fora do escopo** (decisão de 7/11/2026). O app é o app do escritório para os clientes dele, não um app das empresas clientes para os funcionários delas; um portal do funcionário seria outro produto, com outra dependência. A folha chega ao RH do cliente como documento.
- **Se o escritório sair da plataforma**: exportação completa, modo leitura por 90 dias para os clientes e portabilidade do cliente (subplano 06, 12.6).

### 7.2 Serviços extras (venda adicional pelo escritório)

Cada um é ligado por cliente pelo escritório. O escritório decide se cobra fora ou pela plataforma (cobrança com repasse):

| Serviço | O que entrega |
| --- | --- |
| **Emissão de NFS-e pelo app** | Emitir, consultar e cancelar notas da própria empresa, com os dados já cadastrados e o layout nacional da NFS-e, o mesmo em toda a federação |
| **Consultor da empresa** | O modo cliente do Consultor (6): dúvidas sobre a própria empresa, com os dados dela, em linguagem de leigo |
| **Certidões sob demanda** | Pedir e receber certidões com um toque |
| **Simulador da reforma** | O que muda para esta empresa, com os números dela (motor Cálculo) |
| **Painel do sócio** | Faturamento, impostos, folha e resultado do mês, em gráficos simples |
| **Conciliação simplificada** | Extratos conectados (agregador bancário) e lançamentos classificados para o cliente ver o caixa |
| **Cobrança do cliente aos clientes dele** | Boletos e Pix dos clientes da empresa, pelo mesmo provedor de cobrança |

### 7.3 Perguntas

**Decisões (7/11/2026):** web responsiva instalável primeiro; loja depois. Marca branca desde a primeira versão, no app e no sistema inteiro (1.9).

---

## 8. Um fluxo ponta a ponta

Para conferir que os módulos se encaixam:

1. O financeiro da Empresa X manda um áudio no WhatsApp: "segue a nota do fornecedor, e contratei dois funcionários".
2. **CRM** reconhece o número (identidade → pessoa → cliente), transcreve o áudio, triagem manda para o Fiscal (sem responsável) e sinaliza o DP.
3. O arquivo é identificado como NF-e de entrada e vai para a pasta e a tarefa do mês (**Documentos**, **Tarefas**).
4. O **integrante do DP** do Colaborador responsável detecta o pedido implícito e propõe a tarefa de admissão com a lista de documentos; o Colaborador confirma com um botão; a régua de cobrança pede os documentos ao cliente pelo mesmo fio.
5. No **Painel**, a Home do Colaborador mostra a tarefa nova; a aba DP mostra a admissão em "aguardando cliente"; o painel de pendências da Empresa X passa a listar os documentos.
6. O **App do cliente** mostra a pendência ao financeiro da Empresa X, que envia os documentos pelo app; a tarefa muda de status; o DP é avisado.
7. O **Timesheet** registrou: o atendimento no CRM (pessoa), a classificação do documento (agente), a preparação da admissão (agente), a conferência (pessoa), cada um com cliente, setor e atividade do catálogo.
8. O **Consultor**, em vigilância, nota que a Empresa X ultrapassa o sublimite com os dois contratados e avisa o Gestor do Fiscal com a regra citada.

---

## 9. Próximos passos

Subplanos para sessões filhas, nesta ordem, um por vez e cada um construído sobre este documento. **Estado em 8/11/2026: os dez subplanos (01 a 10, incluindo 08 · Conectores, acrescentado pela revisão de consistência, 09 · Financeiro e 10 · BPO) estão escritos, com todas as perguntas respondidas; a lista abaixo é a original.** O estudo de precificação por módulo existe ([Estudo_de_Precificacao_por_Modulo.md](Estudo_de_Precificacao_por_Modulo.md), v0.6). Documento ainda a fazer: o catálogo de identificadores de tela (com os wireframes do Painel).

1. **Fundações**: modelo de dados completo (entidades, campos, versões), matriz de permissões, contrato das ferramentas, esquema de eventos. É o subplano que trava tudo.
2. **Time de agentes**: mecânica técnica (5.4), ciclo de vida do integrante, formato de memória, gatilhos, custos.
3. **Painel**: telas por aba a partir do mapa e do painel do Leandro (cruzamento na segunda).
4. **CRM**: decisão de conexão, caixa de entrada (Chatwoot como base ou referência), fluxos de IA.
5. **Timesheet**: extensão e coletor (4.4), normalização dos cores, tela.
6. **App do cliente**: funções base, serviços extras, marca branca.
7. **Consultor**: o que muda na reestruturação do assistente atual.

## 10. Registro das respostas (7/11/2026)

| # | Pergunta | Resposta |
| --- | --- | --- |
| 1 | Nomes dos papéis | Administrador, Gestor, Colaborador, Cliente |
| 2 | Carteira de clientes por usuário | Entra, desligada por padrão |
| 3 | Drive do escritório | Espelho; três opções de armazenamento (nuvem do escritório, armazenamento da plataforma, servidor próprio) com índice único (1.4) |
| 4 | Clientes e Societário | Continua aba; validar a divisão de abas com os contadores no subplano do Painel |
| 5 | Cliente selecionado persiste | Sim |
| 6 | Relatórios | Cada aba; Gestão consolida |
| 7 | Números de WhatsApp | Um por setor, sem filas; repasse entre pessoas e transferência entre setores; mensagem automática enquanto ninguém assume |
| 8 | E-mail no CRM | Sim, desde a primeira versão |
| 9 | Lead no app | Não; app só para clientes, com acesso à conta da própria empresa |
| 10 | Colaborador vê e contesta o próprio timesheet | Sim |
| 11 | Trabalho de agente no painel de horas | Sim, série separada |
| 12 | Coletor Windows de título de janela | Não entra; atribuição pela tarefa aberta, com modo de espera por inatividade de 2 a 5 minutos, sem logout (4.4) |
| 13 | Compartilhar integrantes | Sim, como modelos do escritório; integrantes são por usuário e passam trabalho entre si (5.1) |
| 14 | Chat inicial | Geral, como um chat grande, na aba **Assistente** do Início; os integrantes ficam na aba **Time** (lista à esquerda), decisão do UI lab de 7/11/2026 (02, 9) |
| 15 | Modo cliente do Consultor | Factual direto; opinião passa pelo contador |
| 16 | App do cliente | Web instalável primeiro; loja depois |
| 17 | Marca branca | Sim, no sistema inteiro (1.9) |
| 18 | Suporte geral (8/11/2026) | Chat de suporte com pessoas e, dentro dele, assistente de ajuda padrão e barato, incluído, só sobre o sistema, com limite mensal de perguntas (hipótese: 30); da plataforma, para todo usuário (1.10) |

## Adendo: comunicação interna e aba Obrigações (14/11/2026)

- **Comunicação interna** (pedido do Enzo): conversas pessoais, grupos, canal de cada setor e canal geral, quase como um Microsoft Teams, **sem possibilidade de excluir mensagens** (editar guarda o histórico). Faz parte da plataforma comum, para todos os pacotes. Desenho no [subplano 11](subplanos/11-Comunicacao-Interna.md).
- **Aba Obrigações:** compartilhada, mas dinâmica por setor: cada setor vê as suas obrigações e o seu integrante; quem tem vários setores, o Gestor e o Administrador escolhem ver um, vários ou todos. Cada aba de setor tem o bloco "Obrigações do setor". Detalhe no adendo do [subplano 03](subplanos/03-Painel.md).
- **Nome:** o setor continua **Societário** ("Legal" e "Legalização" são sinônimos na busca e na IA).
