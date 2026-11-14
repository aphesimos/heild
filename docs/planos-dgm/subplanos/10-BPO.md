# Subplano 10 · BPO

**Versão 0.4 · 8/11/2026 (segunda rodada do UI lab incorporada) · documento de desenho funcional, anterior ao design visual e à escolha de stack. Incorpora as respostas do usuário às 15 perguntas (11.4): o BPO trabalha no ERP do cliente (3.0), a ordem de venda é B, C1 e C2, e o pacote BPO financeiro passou a ter mensalidade-base e valor por empresa (seção 9).**

Detalha o item lateral **BPO**, decidido pelo usuário em 8/11/2026 para que o sistema seja vendido a três perfis de cliente, e a decisão de arquitetura do mesmo dia: **plataforma comum + pacotes de área**. Apoia-se nas [Fundações](01-Fundacoes.md) e nos subplanos [02](02-Time-de-Agentes.md) a [09](09-Financeiro.md), na pesquisa [B10](../../pesquisa/plataforma/B10-bpo-escritorios.md) e no [Estudo de precificação](../Estudo_de_Precificacao_por_Modulo.md).

Convenções:

- IDs (BPO-010, FIN-201, CTB-015) são os do [atividades.json](../../pesquisa/plataforma/atividades.json). Onde B10 e o JSON divergem na fase, **vale o JSON** (11.3).
- Ferramenta entre crases é a do catálogo das Fundações (6.5) ou pedida em 11.2.
- Autonomia como no mapa: **S** (agente faz sozinho), **P** (prepara, pessoa conclui), **O** (organiza e lembra).
- `[a confirmar]` marca o que a pesquisa não fechou. Preços são **parâmetros de teste, nunca preço de venda**.
- No núcleo, "cliente", "atividade", "obrigação" e "setor" são termos do **pacote de área**; contabilidade, aqui, é o pacote Contábil. "Pacote de área" não é o mesmo que os atalhos "Essencial, Operação, Completo" do estudo de preços.

---

## 1. Escopo e princípios

### 1.1 O que é o módulo BPO

BPO é terceirização de rotina. Aqui o termo tem **dois sentidos**, e o desenho cobre os dois.

| | **BPO financeiro** (sentido 1) | **BPO entre escritórios** (sentido 2) |
| --- | --- | --- |
| Quem executa | Um escritório, ou uma empresa de BPO financeiro | Um escritório de BPO |
| Para quem | **Empresas clientes**: padaria, clínica | **Outros escritórios**, os contratantes |
| O que executa | Contas a pagar e a receber, cobrança, conciliação, fluxo de caixa, relatórios | Departamentos inteiros (fiscal, DP, contábil) |
| Catálogo | FIN-201, FIN-003, FIN-004, FIN-005, FIN-006, CTB-008, CTB-010, CTB-015 | BPO-001 a BPO-023 |
| Dados | Um nível: a empresa é cliente do inquilino | **Dois níveis** (DA-01) |
| Onde trabalha | No **ERP financeiro que o cliente já usa** (Conta Azul, Omie e outros), com a plataforma como camada de orquestração; livro próprio como opção (3.0) | No core do contratante (BPO-018) |
| Como entra na plataforma | **Pacote de área "BPO Financeiro"** | **Modo multi-inquilino da plataforma** |
| Estudo de preços | **Pacote BPO financeiro: R$ 390 de mensalidade-base + R$ 65 por empresa incluída** (v0.6, seção 9) | R$ 490 + R$ 120 por subescritório |

Termos usados: **empresa BPO** é a empresa cliente atendida em BPO financeiro; **contratante** é o escritório **cliente do BPO** (um subinquilino, no modelo de dados), que **não assina a plataforma** e recebe um portal de convidado no sistema do BPO (4.1.1); **cliente final** é a empresa atendida pelo contratante.

Ambos são **extras opcionais, fora de qualquer atalho de preço**; o BPO financeiro também pode ser vendido **sozinho**, como "{nome} BPO Financeiro".

### 1.2 Os três perfis e as variantes de "só BPO"

| Perfil | Quem é | O que contrata | Variante |
| --- | --- | --- | --- |
| **A** | Contabilidade que **não** faz BPO | Plataforma + pacote **Contábil** | |
| **B** | Contabilidade que **faz** BPO | Plataforma + pacote Contábil + pacote **BPO Financeiro** (e, se atender escritórios, modo BPO) | |
| **C1** | Empresa de **BPO financeiro** sem contabilidade | Plataforma + pacote **BPO Financeiro**. **Sem o pacote Contábil** | Sentido 1 |
| **C2** | **BPO que atende outros escritórios** | Plataforma + pacote da área executada (hoje Contábil) + **modo BPO entre escritórios** | Sentido 2 |

A assinatura decide o que cada um vê: pacotes de área, módulos da plataforma e o modo BPO. Ninguém configura isso por tela (Fundações 2.2).

**Ordem de venda (P1, respondida em 8/11/2026):** primeiro **B**, a contabilidade que compra o BPO financeiro; depois **C1**, o BPO financeiro puro; o **C2**, o BPO entre escritórios, fica para depois.

**Quem contrata o quê (P5, respondida em 8/11/2026).** Quem usa o sistema o contrata **por conta própria**. A contabilidade que oferece BPO (B) faz o BPO **dentro do próprio escritório**, com os usuários dela ou com um setor de BPO, conforme o porte. O BPO que atende escritórios (C2) **assina a plataforma ele mesmo**; o contratante é **cliente do BPO**. **Não existe** a contabilidade passar o acesso ao nosso sistema a uma empresa de BPO de fora, nem o contratante precisar assinar a plataforma. O acesso do BPO ao **core** do contratante (BPO-018) é acesso ao sistema que o contratante já usa, não ao nosso.

### 1.3 Regras herdadas e novas

Valem as regras R1 a R8 das Fundações: **tudo é ferramenta tipada** (pagar, aprovar, passar a bola e contar volume são ferramentas com nível e evento); **todo efeito gera evento** (base da trilha, do SLA e da fatura por volume); **o inquilino vem da autenticação** (no modo BPO, um contratante por contexto, 4.1); **agente nunca excede o usuário** (o integrante não paga, não altera dados bancários e não assina; cria o cartão); **conteúdo externo é dado** (boleto com "troque a conta" é alerta); **marca branca por tema** (o cliente final vê a marca do contratante); **nada se apaga** (pagamento errado é estornado ou ajustado); **dados por escritório** (dois contratantes nunca no mesmo contexto de modelo). Três regras novas:

- **B1. A plataforma não toca o dinheiro.** Conta, token e certificado são da empresa, no cofre (09, R1).
- **B2. Quem digita não aprova, e quem aprova não paga.** Imposto por `autorizar` (3.8), não pelo costume.
- **B3. Nenhum pagamento sai sem aprovação humana registrada** (P12). O sistema limita o risco confirmando e com cartões: o pagamento só sai depois da aprovação do cliente, sempre registrada (o M3, em que a pessoa do BPO libera com alçada delegada, fica **fora da primeira versão**, seção 12, Q5). A regra vale **também depois de qualquer promoção** de outras ações para o modo automático: **pagar e transferir nunca entram na lista de ações promovíveis**.

---

## 2. Perfis de escritório e composição: plataforma, pacotes de área e cruzamentos

### 2.1 Três camadas

A plataforma **não é limitada à contabilidade** (DA-02). O que se chamava Painel é o **pacote de área Contábil**, plugado numa plataforma comum.

| Camada | O que contém | Obrigatória |
| --- | --- | --- |
| **Plataforma (núcleo)** | Inquilinos e contas, papéis, cadastro único, tarefas, documentos, eventos, ferramentas, notificações, framework de conectores, tema, motores genéricos, Gestão | Sim. B 100 + 0,30 por cliente efetivo + 5 por usuário (a antiga "Base") |
| **Módulos da plataforma** | CRM, Timesheet, App do cliente, **Financeiro** (honorários, cobrança, contas, conciliação, caixa), framework de IA e planos, Open Finance | Opcionais; servem a qualquer pacote |
| **Pacote de área** | Catálogo, **setores e abas**, perfil do cliente, obrigações, base legal, tabelas de cálculo, conectores da área, integrantes, modelos, trilhas | **Pelo menos um** por produto |
| **Modo multi-inquilino** | Subinquilinos (dados de cada contratante), fila compartilhada, SLA, contrato entre escritórios, **portal de convidado** do contratante | Extra da plataforma, contratado pelo BPO |

Setores são **fixos dentro de um pacote**. O Contábil traz Societário, Fiscal, Notas, DP, Contábil e Consultoria; o BPO Financeiro traz `bpo_financeiro`. `gestao_atendimento` e `financeiro_escritorio` são setores da **plataforma**.

### 2.2 Três cenários de venda

Em todos: **uma assinatura, um login, um cadastro de clientes**. Nenhum cenário contrata duas plataformas.

| Cenário | Perfil | Pacotes | Itens laterais | Aba BPO |
| --- | :-: | --- | --- | --- |
| **1. Contabilidade que compra o BPO** | B | Contábil + BPO Financeiro | Início, **Painel** (contábil, com a ficha do cliente em Societário), CRM, Timesheet, Arquivos, Financeiro, **BPO**, Configurações | Frente financeira: setores de BPO, rotinas, aprovações, alçadas. O que é comum aparece **no mesmo cadastro, na mesma lista de tarefas e no mesmo Timesheet** |
| **2. BPO financeiro puro** ("{nome} BPO Financeiro") | C1 | **BPO Financeiro** | Início, **Clientes** (só aqui: sem o Painel, a ficha do cliente precisa de item próprio; a tratar na fase do C1), CRM, Timesheet, Arquivos, Financeiro, **BPO**, Configurações. **Sem Painel contábil** | Idem, sem nada contábil |
| **3. BPO entre escritórios** | C2 | Pacote da área executada (hoje Contábil) + modo BPO | Início, **Painel** (com a ficha do cliente), CRM, Timesheet, Arquivos, Financeiro, **BPO**, Configurações | Frente entre escritórios: contratantes, fila, SLA, volume |
| (base) Contabilidade sem BPO | A | Contábil | Sem o item BPO | |

**Ordem dos itens (decidido em 8/11/2026): Financeiro, BPO, Configurações** nos três cenários, como o UI lab foi instruído e como diz 5.1; o item **Clientes** só existe no BPO puro (C1). **Arquivos** é módulo da plataforma na barra (o UI lab já o tem); a ordem do plano é CRM, Timesheet, Arquivos, e o UI lab os desenhou como CRM, Arquivos, Timesheet (divergência aberta, 00, seção 10). **Suporte** e **Configurações** ficam no pé da barra, para todo cenário. O Painel só existe para quem tem setor contábil: o C1 não o tem. O **seletor de cliente é por módulo**: no BPO lista só as empresas de BPO e, no Painel, só as da contabilidade; some no CRM, no Financeiro e em Configurações (03, 2.0). Um B que também atende escritórios tem as duas frentes na aba BPO, com seletor. Como o C1 não tem o Painel, **não vê abas que não contratou**, sem decompor o Painel contábil.

**Simetria (decisão do usuário, 8/11/2026):** *BPO* é o equivalente ao *Painel* contábil (o trabalho do pacote para o cliente), e *Financeiro* é o financeiro **da própria empresa de BPO**, como é o da contabilidade. Num BPO puro a barra é Início, Clientes, CRM, Timesheet, Arquivos, **Financeiro**, **BPO**, Configurações. O Financeiro só aparece para Administrador e Gestor com o setor Financeiro (3.5 das Fundações); um Gestor de BPO sem esse setor não o vê.

**Item Clientes (resposta do UI lab, 8/11/2026):** quem **não tem o Painel** ganha o item **Clientes** no lugar dele, **em qualquer cenário**, não só no BPO puro. Ele tem duas abas: **Cadastro** (pacotes contratados, quem atende, ERP e ficha) e **Contatos** (canal, app e alçada de pagamento). É o **mesmo cadastro** do Painel › Societário; a pessoa vê só os clientes dos pacotes e setores dela (no cenário B, um Gestor só do setor BPO vê só as empresas do BPO). Simetria adotada: **[Painel | BPO] + Financeiro (titular escritório) + Clientes quando não há Painel**. O Financeiro existe nos dois cenários e só aparece para Administrador e Gestor com o setor Financeiro. Limitação do wireframe: no cenário só BPO, Visão geral, Fluxo de caixa e Resultado do Financeiro ainda usam os números de exemplo do escritório contábil.

### 2.3 A regra de cruzamento e onde ela falha

A regra do Plano (DA-02.1): **se mais de um pacote precisa de uma função, ela é da plataforma e existe uma vez; só o específico fica no pacote.** Três classes: compartilhado de verdade, mesmo componente com **titular** diferente, específico do pacote. A tabela 2.4 a aplica ao BPO. Validada contra o BPO, a regra **vale, com nove ajustes**:

| # | Onde a regra falha ou é incompleta | Ajuste proposto |
| --- | --- | --- |
| F1 | **Permissão por tela não basta.** Sem titular, o Colaborador do BPO abriria o caixa do próprio escritório (09, R8) | Tupla `(ferramenta, titular)`. Titular `escritorio`: só Administrador e Gestor do Financeiro. Titular `empresa`: setor do BPO |
| F2 | **Aprendizado vaza entre titulares:** regra de categorização e fornecedor de uma empresa aplicados a outra | `titular` em regra, fornecedor, plano de contas e centros; regra nunca cruza titular |
| F3 | **Custo-hora se contamina:** o 09 (7.3) o deriva das "contas pagas do mês", que passariam a incluir as dos clientes | `custo_hora` usa **só titular `escritorio`** |
| F4 | **Atividade de um só pacote:** CTB-015 (conta contábil por linha) é do Contábil, e o C1 não o tem | O BPO classifica por **categoria e centro gerenciais** (09); a conta contábil só se o pacote Contábil existe. FIN-003, FIN-004 e CTB-008 sobem ao catálogo da plataforma, com titular |
| F5 | **Um cliente, um estado de ciclo:** a empresa sai do BPO e fica na contabilidade, ou o inverso | Estado **por serviço contratado**; o cliente só é `encerrado` quando todos encerram; bloqueios por serviço |
| F6 | **Dependência entre pacotes:** o fechamento contábil espera a conciliação do BPO | `bloqueada_por` entre pacotes e evento `bpo.mes_fechado`; dependência de **um sentido**, sem função compartilhada nova |
| F7 | **Módulo que carrega o componente:** o C1 compraria o Financeiro só para usar o espelho e a conciliação | Só são exigidas as **dependências técnicas reais** (Financeiro, para o espelho do ERP e a conciliação, e App, para a aprovação do cliente); o componente não é cobrado de novo (9.1); Timesheet, CRM e Open Finance são recomendados e desmarcáveis (P6) |
| F8 | **Pastas e áreas do app:** `Entregáveis/Financeiro` mistura honorário e BPO | Subpasta **`Entregáveis/BPO financeiro`** na árvore-modelo (Fundações 7), **visível a quem aprova pagamentos**; `areas` da Conta de cliente por pacote contratado |
| F9 | **Fonte da verdade com o ERP do cliente:** o mesmo lançamento existe no ERP e na plataforma | O ERP é a fonte do lançamento, da conta a pagar e do fornecedor; a plataforma é a fonte da aprovação, da alçada, do SLA, da fila e da trilha; o espelho tem `origem` e `versao_origem` (3.0) |

### 2.4 Tabela de cruzamentos: BPO × Painel contábil × Financeiro

| Função | Onde vive | Titular | A aba BPO mostra | Remete à plataforma ou a outro pacote |
| --- | --- | --- | --- | --- |
| Cadastro de clientes e pessoas; estado do ciclo | Plataforma (estado **por serviço**) | | Carteira; estado do serviço BPO | Ficha, contatos, identidades |
| Perfil do cliente | **Por pacote** | | Perfil BPO (bancos, alçadas, escopo) | Perfil contábil fica no Painel |
| Tarefas e calendário | Plataforma | | Lista filtrada por pacote | **Calendário único, uma cor por pacote**: obrigações contábeis e rotinas do BPO aparecem juntas |
| Documentos; conversas e WhatsApp | Plataforma | | Comprovantes, extratos; fio da empresa | Índice único; subpasta `Entregáveis/BPO financeiro` (F8); fio único do cliente |
| Timesheet e custo-hora | Plataforma | **escritório** | Horas por empresa e contratante | Catálogo-união; custo-hora único que inclui todos os pacotes; rentabilidade soma honorário contábil e taxa BPO; BPO é filtro |
| Contrato de honorários e faturamento | Financeiro | escritório | Extrato de volume e faixa | **Uma fatura e uma cobrança por mês**, linhas por serviço; **notas fiscais por serviço** (7.3; 09, 4.5 e 5.5) |
| Contas a pagar; a receber e cobrança; conciliação; fluxo de caixa e DRE | **Financeiro (componente)**; com o ERP do cliente, **espelho** dele | **empresa** | Fila de pagamento, cobrança, conciliação, caixa e DRE da empresa | Mesma tela e lógica; no Financeiro o titular é o escritório; o espelho é de leitura e a escrita volta ao ERP (3.0) |
| Plano de contas, centros, regras; conexões bancárias e de ERP | Financeiro e Conectores | **por titular** | Os da empresa | Nunca cruzam (F2); cofre único; uma contratação de Open Finance |
| **Aprovação de pagamento, alçadas, segregação** | **Pacote BPO** | empresa | Aprovações e Configuração | Cartão é das Fundações |
| **Fila, SLA, rotinas, lote de pagamento** | **Pacote BPO** | empresa | Fila, Rotinas, Entregas e SLA | Relógio e pausas seguem o CRM (04, 4.6) |
| Obrigações, guias, base legal, cálculo tributário | **Pacote Contábil** | | Não aparece | Fica no Painel |
| App do cliente; integrantes de IA | Plataforma | | Seção "Pagamentos e caixa"; integrantes BPO financeiro e SLA e fila | Seções por pacote; **a empresa só de BPO não recebe documentos nem áreas da contabilidade** (a pasta e as áreas seguem o serviço contratado); plano de IA é do usuário |
| Seletor de cliente | Plataforma, **por módulo** | | Só as empresas de BPO | No Painel, só as da contabilidade; some no CRM, no Financeiro e em Configurações (03, 2.0) |
| Fechamento do mês | Cada pacote | | Fechamento da empresa | Contábil espera o BPO (F6) |

**O que o BPO acrescenta ao componente do Financeiro:** aprovação do cliente por cartão, alçadas por empresa e pessoa, segregação de funções, conectores de ERP financeiro e espelho com fonte da verdade (3.0), fila de pagamento e lote, rotinas, SLA, modos de execução (M1 e M2; M3 desligado na primeira versão), perfil BPO e relatório mensal ao cliente. **O que reutiliza sem copiar:** contas a pagar e a receber, conciliação, cobrança, caixa e DRE, com titular empresa.

### 2.5 Setores fixos por pacote e visibilidade

| Regra | Texto |
| --- | --- |
| Aba | **Aparece se o pacote está na assinatura E o usuário tem o vínculo ao setor**. Pacote fora da assinatura: aba inexistente, busca sem o tipo, ferramenta devolve "módulo não contratado" |
| Setor | Fixo no pacote (Fundações 4.1); pode ser **desativado** se o inquilino não o atende, **sem reduzir o preço**: não se cobra por aba nem por setor (P8). Responsável padrão só em setor ativo |
| Contratar pacote depois | Nova linha de assinatura, com evento; nada é migrado |
| Clientes | **Decidido em 8/11/2026:** no cenário B (contabilidade com BPO) a **ficha do cliente continua no Painel (Societário)**, com pessoas, identidades, acessos, ciclo e a legalização (SOC-025 a 043); o item **Clientes** só existe no **BPO puro (C1)**, que não tem Painel, e fica para a fase do C1. Os dados (ficha, pessoas, identidades, ciclo) continuam sendo do núcleo; o que muda é só onde a tela mora |

### 2.6 O pacote BPO Financeiro

Setor `bpo_financeiro` (com equipe); catálogo FIN-201 e as de 3.1 (FIN-003, FIN-004 e CTB-008 ficam na plataforma, com titular); **perfil BPO** (3.12); **rotinas** no lugar de obrigações; base legal pequena (contratos, Open Finance, LGPD, **[a confirmar]**); conectores de **ERP financeiro** (Conta Azul, Omie e outros; 8.3), bancos, Open Finance, provedores e DDA; integrante **BPO financeiro**; modelos de cartão e relatório; trilha de entrada (3.3); item lateral **BPO**.

### 2.7 O BPO entre escritórios é modo da plataforma

Vale para qualquer pacote: contratante, fila, SLA, contrato e suboperador não dependem da área. O **departamento** contratado é um **setor do pacote** executado. O subinquilino é uma unidade de dados do BPO (clientes finais, tema, convidados) e **não tem assinatura nem pacote próprios**: o BPO é o cliente pagante (P5). Detalhe na seção 4.

### 2.8 Cadastro do inquilino

O assistente pergunta "Qual é o seu produto?" e propõe uma assinatura-modelo (a implantação a fecha): `contabil` (pacote Contábil), `contabil_bpo` (Contábil + BPO Financeiro), `bpo_financeiro` (só BPO Financeiro, com setores `bpo_financeiro`, `gestao_atendimento` e `financeiro_escritorio`) e `bpo_escritorios` (Contábil + modo BPO, com o setor `bpo`). O produto é ponto de partida; vale a assinatura. `modo_bpo` é **derivado** dela. O subinquilino não tem produto nem assinatura: é cliente do BPO (P5).

---

## 3. BPO financeiro das empresas clientes

### 3.0 Onde o BPO trabalha: o ERP do cliente (P3, respondida em 8/11/2026)

**Decisão do usuário:** "Copie o mercado. ERP do cliente." O padrão é o BPO **trabalhar no ERP financeiro que o cliente já usa** (Conta Azul, Omie, Nibo, Granatum e outros, por API ou arquivo). A plataforma é a **camada de orquestração**: carteira, fila, aprovação, alçadas, SLA, conciliação assistida e relatórios. O **livro financeiro próprio** fica como **opção**, para o cliente sem ERP. Os conectores de ERP são **parte central do pacote BPO**.

| Modo | Como funciona | Quando |
| --- | --- | --- |
| **E1. ERP com API aberta (padrão)** | Leitura e, **onde a API permitir**, escrita: a plataforma lê contas, lançamentos e fornecedores, cria o lançamento e dá a baixa no ERP por comando tipado (`erp.ler`, `erp.lancar`, `erp.baixar`) | Conta Azul, Omie e os que tiverem API utilizável (8.3) |
| **E2. ERP sem API ou sem escrita: arquivo** | Exportação e importação de arquivo (OFX, CSV, planilha, CNAB). Sem escrita automática: o plataforma lê o arquivo, propõe, e o operador lança ou dá a baixa no ERP; a conta fica em "lançar no ERP" com checklist | ERP sem API de terceiros, plano do cliente sem API, ou escrita não liberada |
| **E3. Livro próprio (opção)** | O componente do Financeiro com titular empresa é a fonte, como era (3.5 a 3.10) | Cliente sem ERP |

**Fonte da verdade e duplicação de dados.** A regra é uma só fonte por dado; a cópia é só leitura.

| Dado | Fonte | Na plataforma |
| --- | --- | --- |
| Lançamentos, contas a pagar e a receber, fornecedores, plano de contas | **ERP** | **Espelho de leitura** (`origem = erp:<provedor>`, `versao_origem`); atualizado por sincronização incremental e conferido todo dia |
| Extrato bancário | Banco (Open Finance ou OFX) | Cópia para a conciliação assistida |
| Aprovação, alçada, segregação, lote, fila, rotinas, SLA, comprovante, trilha | **Plataforma** | Nunca no ERP; no máximo uma observação no lançamento do ERP |
| Conciliação | **Proposta** na plataforma; **baixa** no ERP (E1) ou pelo operador (E2) | Se o ERP divergir, vale o ERP e a divergência vira tarefa |
| Caixa, DRE e relatório mensal | Calculados na plataforma sobre o espelho | Se o ERP tem DRE oficial, a plataforma mostra a diferença |

A plataforma **não grava um dado em dois lugares de forma independente**: a escrita é um comando ao ERP, que depois é relido. Conflito: o ERP vence. Quando o ERP não tem webhook (a Conta Azul não tem, 8.3), a sincronização é por consulta periódica **a cada 15 minutos** (Q2, respondida), dentro do limite de chamadas dele. Onde o ERP não aceita escrita (Nibo e Granatum, modo arquivo), a **baixa manual conta no SLA**, com a marca "manual". O espelho segue o prazo do contrato e é apagado no encerramento (3.14).

**Impactos.**

- **Conciliação (FIN-004):** a entrada é o extrato mais o espelho; casa por regra; a baixa é comando ao ERP (E1) ou tarefa do operador (E2). A taxa de baixa automática é indicador do pacote.
- **Financeiro (09), titular empresa:** com ERP, as contas e os lançamentos da empresa são **espelho** (`origem` diferente de `nativo`), **não editáveis na plataforma**; o titular escritório segue nativo e o custo-hora só usa o titular escritório (F3). No modo E3 as entidades são nativas.
- **Custos:** o conector de ERP custa infraestrutura de sincronização por empresa (R$ 1 / 3 / 8, **[premissa]**); **tarifa de terceiros não conhecida [a confirmar]**; o **cliente paga o próprio ERP** (não revendemos). O desenvolvimento e a manutenção de cada conector (a API muda) são custo fixo da plataforma, fora do custo variável.
- **Credencial do ERP:** token OAuth ou chave do cliente, **no cofre do escritório** (o cofre único do inquilino, separado por titular e por empresa; Q2, respondida), com o escopo mínimo que a API oferecer; revogável em um passo (3.4); nunca em tela, evento, log ou contexto de modelo. Texto vindo do ERP é **dado**, não instrução (R4).
- **Risco de escrita errada no livro do cliente:** `erp.lancar` e `erp.baixar` são ferramentas de nível executar, com evento e trilha; a baixa de pagamento só depois de comprovante ou extrato; erro se corrige por estorno no ERP, e a plataforma registra (3.11).
- **Ligação com a contabilidade (perfil B):** `bpo.mes_fechado` entrega ao Contábil os lançamentos já classificados, lidos do espelho (3.10).

**Configuração por empresa (aba Configuração, 5.2):** ERP e modo (Conta Azul, Omie e Bling por API; Nibo e Granatum por arquivo; sem ERP, livro próprio), escopo da credencial, religar ou pedir nova autorização, bancos por Open Finance, modo de pagamento M1 ou M2 (**M3 desligado na primeira versão**, Q5), alçadas e janela. O modo por provedor é o da tabela 8.3 até a confirmação das APIs.

Mercado, **[a confirmar]** (blogs): muitos BPOs financeiros trabalham no ERP do cliente (Conta Azul e Omie); BPO Suite e Sofia trazem livro próprio e importadores de ERP (S5).

### 3.1 O serviço e as rotinas

No ERP do cliente (3.0), o BPO lança, paga, recebe, concilia e entrega relatório; **a cobrança dos clientes do cliente fica para uma fase posterior** (B13). **A decisão sobre o dinheiro é do cliente**; o BPO prepara, confere e executa o que ele autorizou.

| Cadência | Rotina | Quem faz | Catálogo |
| --- | --- | --- | --- |
| **Diária** | Capturar contas (DDA, e-mail, WhatsApp, notas), classificar, checar duplicidade | Integrante prepara; analista confere | FIN-003 (P), CTB-008 (S) |
| | Montar fila de pagamento e pedir aprovação do cliente | Integrante prepara; analista libera | FIN-201 (P) |
| | Executar o aprovado e guardar comprovante | Ferramenta, com cartão | FIN-201 |
| | Baixar e conciliar extrato | Integrante, o que casa por regra | FIN-004 (S) |
| | Cobrar os clientes da empresa (**depois**: fase posterior, fora da ordem de construção do B e do C1; B13 em 11.1; decidido em 8/11/2026) | Integrante prepara; Atendimento envia | 3.10 |
| **Semanal e mensal** | Agenda de vencimentos e previsão; conciliação final, DRE, fluxo de caixa, relatório, fechamento | Integrante prepara; responsável aprova | FIN-005 (S), FIN-006 (P) |

### 3.2 Fluxo ponta a ponta

```
Onboarding ─► Acesso ao banco ─► Extrato ─► Capturar contas ─► Fila de pagamento
  (3.3)          (3.4)                         (3.5)              (3.5)
                                                                    │
Relatório ◄─ DRE ◄─ Caixa ◄─ Conciliar ◄─ Executar ◄─ Liberar ◄─ Aprovar cliente
 mensal (3.10)                              (3.7)      dupla        (3.6)
```

No modo ERP (3.0), "capturar contas", "classificar" e "conciliar" leem e escrevem no ERP do cliente; "aprovar", "liberar" e "executar" são da plataforma e do banco. No modo arquivo (E2), o operador faz a escrita no ERP.

### 3.3 Onboarding da empresa BPO

A empresa já é cliente (SOC-001). Ativar o BPO é um **serviço contratado** novo, com **perfil BPO** (3.12) e **estado próprio** (F5). A trilha usa a de implantação do 03 (seção 8), com oito tarefas:

1. Contrato com item BPO, faixa de volume e **alçadas assinadas** (FIN-001); responsável: Gestor e sócio.
2. Termo de tratamento de dados; o BPO é operador da empresa (GES-054).
3. Convite no app a sócio e financeiro, com `alcada_pagamento`.
4. Conexão bancária por conta e consentimento (CTB-010).
5. Conectar o **ERP financeiro** do cliente (OAuth ou chave dele, no cofre; leitura e, onde a API permitir, escrita) ou importar por arquivo; trazer 90 dias de extrato e as contas em aberto para o espelho (3.0). Cliente sem ERP: livro próprio com plano de contas **gerencial**.
6. Fornecedores recorrentes **com dados bancários confirmados por segundo canal**.
7. Um mês em **paralelo** (BPO prepara, cliente paga), com comparação.
8. Ativar o serviço (Gestor); evento e prova.

O padrão é **trabalhar no ERP do cliente** (3.0, P3 respondida); o livro próprio vale só para o cliente sem ERP.

### 3.4 Acesso às contas bancárias do cliente

| Acesso | Para quê | Como | Risco |
| --- | --- | --- | --- |
| **Leitura de extrato** | Conciliar, projetar caixa | OFX; **Open Finance** por agregador; API do banco | Baixo |
| **Cobrança** | Boleto e Pix dos clientes da empresa | API de cobrança que **o correntista gera e cola** (08, 13.7) ou subconta (3.10) | Médio |
| **Pagamento** | Pagar fornecedores | Modos M1 e M2 (M3 desligado na primeira versão) | **Alto** |

| Modo de pagamento | Como funciona | Chave | Quando serve |
| --- | --- | --- | --- |
| **M1. Cliente libera no banco** | O BPO prepara e agenda; a empresa libera no aplicativo do banco; a plataforma confirma pela baixa no extrato | Só o cliente | **Padrão** |
| **M2. Pagamento por API** | O cartão aprovado dispara o pagamento; credencial da empresa no cofre, com escopo só de pagamento e limite | Cliente (cofre) | Banco com API de pagamento utilizável por terceiro **[a confirmar; S4 cobriu cobrança, não pagamento]** |
| **M3. BPO libera por alçada delegada** | O BPO libera até um teto, por procuração bancária ou perfil no banco | Delegada | **Descrito e desligado: fora da primeira versão** (Q5, respondida); só entra com parecer jurídico, teto baixo e contrato (seção 10) |

A iniciação de pagamento pelo Open Finance exige consentimento por transação e participante autorizado **[a confirmar no texto oficial]**; a plataforma não inicia pagamento. A credencial nunca aparece em tela, evento, log ou contexto de modelo, e **senha pessoal de internet banking não é guardada**. Consentimento que vence vira tarefa 30 dias antes (08, 7.3). Revogar a empresa revoga todas as credenciais em um passo.

### 3.5 Contas a pagar e fila de pagamento

Entidade: a **Conta a pagar** do 09 (3.1), com `titular` (escritório ou empresa BPO). No modo ERP ela é o **espelho** da conta a pagar do ERP (`origem`); `conta_pagar.capturar` cria a conta **no ERP** quando a API permite escrita e, quando não, a deixa em "lançar no ERP" (3.0).

| Passo | O que acontece | Ferramenta | Nível |
| --- | --- | --- | --- |
| Captura | DDA, e-mail, foto ou PDF por WhatsApp ou app, nota de entrada | `conta_pagar.capturar` | executar (S) |
| Leitura | IA lê boleto e nota: valor, vencimento, código de barras, fornecedor | `conta_pagar.ler_documento` | rascunhar |
| Checagem | Duplicidade, fornecedor novo, **dados bancários diferentes do cadastro**, valor fora do padrão | `conta_pagar.checar` | ler |
| Classificação | Categoria e centro; regra aprendida só vale depois de aprovada | `conta_pagar.classificar` | rascunhar |
| Fila | Contas conferidas entram em lote, na janela da empresa (**fixa e configurável por empresa**, padrão 9h; Q3 e escalonamento em 3.6); **a conta conferida depois da janela vai para o próximo lote** | `pagamento_lote.montar` | rascunhar |

**Conferência interna antes do lote.** A conta só entra no lote depois de conferida por **outra pessoa** do BPO (3.8): quem digitou não confere, e o botão **Conferir** fica desligado para ela, com o motivo na tela ("você lançou esta conta"). O cartão ao cliente (3.6) só sai de lote com todas as contas conferidas.

Estados (estendem o 09): `capturada → classificada → conferida → em_lote → aguardando_aprovacao_cliente → aprovada → liberada → paga`; mais `contestada`, `recusada_pelo_cliente`, `cancelada`.

### 3.6 Aprovação do cliente: cartão no app e no WhatsApp

Cartão das Fundações (6.4), com `pode_aprovar` igual às contas de cliente com alçada.

```
┌─ Cartão · Padaria Y · Pagar 4 contas · vence hoje 17h ────────────────────┐
│ Moinho Sul Ltda    R$ 4.200  10/11  OK (3ª vez, mesma conta)               │
│ Aluguel            R$ 6.800  10/11  OK (contrato)                          │
│ Gráfica Nova       R$ 2.940  12/11  ⚠ fornecedor novo; conta confirmada    │
│                                      por ligação em 08/11 (Ana, BPO)       │
│ Total R$ 13.940 · saldo R$ 31.400 · depois R$ 17.460                       │
│ [Aprovar] [Editar e aprovar] [Recusar com motivo]       [Perguntar ao BPO] │
└──────────────────────────────────────────────────────────────────────────┘
```

| Aspecto | Regra |
| --- | --- |
| Onde | App do cliente (principal); notificação e link no WhatsApp; mesmo registro na Visão geral do BPO |
| **WhatsApp** | Avisa e leva ao app. Aprovar **dentro** do WhatsApp só abaixo de teto baixo da alçada e com **código de uso único**. Acima, abre o app com segundo fator |
| Conteúdo obrigatório | Total, saldo antes e depois, cada fornecedor com marca de conferência, alertas em destaque, quem preparou e quem conferiu |
| Botões | **Aprovar**; **Editar e aprovar** (tirar contas do lote e aprovar o resto); **Recusar**, com motivo obrigatório. "Perguntar ao BPO" abre a conversa e não decide. Cada decisão registra **quem e quando** e **avisa a equipe do BPO no sino**. No **M1**, depois de aprovar, o cartão pede "**Já liberei no banco**" (a baixa no extrato confirma) |
| Invariante B3 | Na tela de Aprovações e no cartão do app: **nenhum pagamento sai sem aprovação humana registrada**; conta vencida sem aprovação só gera alerta (abaixo), nunca execução |
| Expiração | No dia útil do pagamento, ou na véspera de vencimento legal; padrão 48 h (Fundações 6.4). Expirado não executa. **Cartão expirado nunca paga e escala** (Q3, respondida; escalonamento na tabela abaixo, **premissa de mercado**): aprovador designado, lembrete, **substituto cadastrado**, alerta ao **Gestor do BPO e ao sócio** (gatilho `cartao.vencer_sem_resposta`) |
| Recusa e ausência | Recusa vira tarefa com motivo; conta que vence sem aprovação gera **alerta ao Gestor do BPO e ao sócio**, nunca execução; a empresa fica **vermelha na auditoria** (5.2) com "vencido sem aprovação" |

**Escalonamento do lote (decisão de 8/11/2026, tomada pela sessão-mãe com base no mercado; premissa de mercado, o usuário não opinou).** Unifica o que 3.6, 3.7 e Q3 diziam em separado (aprovador, substituto, Gestor, sócio). Os horários são padrão e **configuráveis por empresa**, junto com a janela.

| Quando | Quem recebe | O que acontece |
| --- | --- | --- |
| **Janela do lote** (padrão 9h, por empresa) | **Aprovador designado** (pessoa da ficha com `pode_aprovar`) | Cartão com as contas conferidas |
| **+4 h** | O mesmo aprovador | Lembrete |
| **+8 h**, ou na **abertura do dia útil seguinte** se o prazo cair fora do expediente | **Substituto cadastrado** | Cartão, com o aprovador copiado |
| **Véspera do vencimento da conta mais próxima** | **Gestor do BPO e sócio** | Alerta com a **lista** das contas ainda sem aprovação |
| **Vencida sem aprovação** | Gestor do BPO e sócio | **Só alerta**; o sistema **nunca paga sozinho** (B3); a empresa fica **vermelha na auditoria** com "vencido sem aprovação" |

O padrão de 48 h de expiração do cartão (Fundações 6.4) segue como o limite do cartão; o escalonamento ocorre dentro dele. Para a aprovação reforçada (3.7), entra o substituto da pessoa ausente, como já estava. **Aberto:** se o sócio recebe só o alerta ou também pode aprovar no lugar do aprovador (hoje só alerta; a alçada da pessoa segue a ficha).

### 3.7 Execução com dupla aprovação e alçadas

Faixas de **exemplo, editáveis por empresa** (P7).

| Faixa por pagamento (exemplo) | Conferência BPO | Aprovação do cliente | Liberação |
| --- | --- | --- | --- |
| **Faixa 1:** até R$ 2.000, fornecedor recorrente conferido | Analista | 1 aprovador | M1 ou M2 (M3 fora da primeira versão) |
| **Faixa 2:** R$ 2.000 a R$ 20.000 | Analista + Gestor | 1 aprovador **com alçada para o total** do cartão | M1 ou M2 |
| Acima de R$ 20.000 | Analista + Gestor | **Aprovação reforçada: 2 pessoas marcadas na ficha** (`pode_aprovar_reforcada`); se uma está ausente, entra o **substituto cadastrado**, nunca alguém do BPO (Q4) | M1 ou M2 |
| **Com exceção** | Gestor do BPO | Aprovação reforçada (2 pessoas) | M1 ou M2 |

**Sobem de faixa:** fornecedor novo; dados bancários alterados; pessoa física; valor 30% acima da média; duplicidade suspeita; fora do horário; fracionamento (soma por fornecedor e dia); urgência (**não elimina controle: muda o caminho**). Cada alçada tem vigência e revisão anual.

### 3.8 Segregação de funções

**A mesma pessoa não ocupa duas etapas no mesmo item.** `autorizar` consulta as etapas já feitas e nega.

| Etapa | Quem faz | Não pode no mesmo item |
| --- | --- | --- |
| **Digitar** (capturar, lançar, classificar) | Colaborador do BPO ou integrante | Conferir (o botão fica **desligado, com o motivo**), liberar, aprovar |
| **Conferir** | Outro Colaborador ou Gestor | Digitar, aprovar |
| **Cadastrar ou alterar fornecedor e dados bancários** | Colaborador designado; **confirma o cliente por segundo canal** | Liberar pagamento a esse fornecedor |
| **Aprovar** | Conta de cliente com alçada | Digitar, conferir |
| **Liberar e pagar** | Ferramenta com `aprovacao_id`; no M1, o cliente | Qualquer etapa anterior |
| **Configurar alçadas, janelas e modo** | Gestor do BPO (setor) ou Administrador; alçada e modo só valem **com o aceite do sócio, dado no app** | Operar pagamentos da mesma empresa: quem altera a alçada de uma empresa **não confere nem libera pagamento nessa empresa**, e a mudança vai ao aceite do cliente no app |
| **Administrar usuários e credenciais** | Administrador do BPO (o Gestor religa ou pede nova autorização) | Operar pagamentos |

**Quem digita não confere, também em operação pequena** (UI lab, 8/11/2026): o botão Conferir fica desligado para quem lançou a conta, com o motivo. A exceção "conferência única" (uma pessoa acumulando digitar e conferir, com aprovação do cliente reforçada) das versões anteriores foi **retirada**; com uma só pessoa no BPO, a conferência é do **Gestor do escritório** ou, na falta dele, do **próprio cliente na aprovação** (hipótese não objetada pelo usuário, 8/11/2026; 00, seção 11). O cliente nunca acumula "aprovar" com nada.

### 3.9 Limites e alçadas por empresa e por usuário

A **alçada da empresa** (versionada: faixas, limites por pagamento, dia e mês, janela, modo, exceções, vigência, `aceito_por`) é editada pelo Gestor do BPO ou pelo Administrador, **com aceite do sócio no app**. A **alçada da pessoa do cliente** fica **no contato da ficha** (a Conta de cliente: o mesmo registro do CRM e do app, onde estão `assuntos`, WhatsApp e e-mail): `alcada_pagamento`, `pode_aprovar_reforcada`, `canal_aprovacao`; **edita o sócio com papel de aprovador no BPO**, isto é, quem tem `papel_cliente = socio` na linha `bpo_financeiro` (o sócio que só tem a linha contábil não edita; hipótese mantida pelo usuário em 8/11/2026). **Toda mudança de alçada, da empresa ou da pessoa, vai para o aceite do cliente no app.** A **da pessoa do BPO** é por vínculo (`pode_conferir_ate`; `pode_liberar_ate` só existe com o M3, desligado na primeira versão). Vale o **menor** limite entre empresa e pessoa (Q4, respondida); aumentar limite só vale após aceite do sócio. A alçada de pagamento é da linha **BPO financeiro** da Conta de cliente (papel por serviço contratado, Fundações 2.3): o mesmo contato é sócio na contabilidade e aprovador no BPO, **pelo mesmo app e o mesmo acesso**.

### 3.10 Conciliação, cobrança, caixa, DRE, relatório e fechamento

| Frente | Como funciona | Catálogo |
| --- | --- | --- |
| **Conciliação** | Ordem do 09 (6.2): crédito do provedor, Pix por valor e CNPJ, débito agendado, transferência, regra aprendida; cartão simples para o resto. No modo ERP a plataforma **propõe** e a **baixa** é feita no ERP (3.0) | FIN-004 (S) |
| **Cobrança dos clientes do cliente** | Boleto e Pix **pela conta da empresa**, em **subconta no nome dela**, com **termo**; régua do CRM; baixa entra na conciliação. A plataforma não intermedia dinheiro; margem da plataforma é do serviço (06, 8). **Fica para depois (decidido em 8/11/2026):** fase posterior, fora da ordem de construção do B e do C1 (B13, 11.1); até lá o cliente do cliente é cobrado pelo ERP ou pelo canal que a empresa já usa | FIN-201 (parcial), 08 7.4 |
| **Fluxo de caixa** | Realizado por lançamentos; projetado por contas, contratos e atraso histórico dos clientes dela | FIN-005 (S) |
| **DRE gerencial** | Por centro de custo e competência; rascunho do integrante, aprovação do responsável | FIN-006 (P) |
| **Relatório mensal** | PDF com o tema: caixa, pagamentos, atrasos, DRE, pendências, riscos | `bpo.relatorio_mensal` |
| **Fechamento** | Conciliação sem pendência, relatório aprovado; reabrir exige Administrador e motivo | `bpo.fechamento.executar` |
| **Ligação com a contabilidade** | No perfil B, o evento `bpo.mes_fechado` entrega ao Contábil lançamentos já classificados, sem redigitar; a **conta contábil** (CTB-015) só é preenchida se o pacote Contábil existe (F4) | Diferencial |

### 3.11 Ações irreversíveis e trilha

O integrante **nunca paga sozinho**, e a ferramenta de pagamento não entra em promoção (09, 8.2). Vale a regra B3 (1.3): nenhum pagamento sai sem aprovação humana registrada, também depois da promoção de outras ações.

| Ferramenta | Nível | Irreversível | Aprovação |
| --- | --- | :-: | --- |
| `conta_pagar.capturar`, `.classificar`, `pagamento_lote.montar`, `.pedir_aprovacao` | ler, rascunhar, executar | não | nunca (a última cria o cartão) |
| `pagamento.liberar`, `pagamento.executar_api` | executar | **sim** | **sempre**, com `aprovacao_id` do cliente |
| `fornecedor.alterar_dados_bancarios` | executar | **sim** | **sempre**, com segundo canal |
| `alcada.alterar` | executar | não | **sempre**, com aceite do sócio |
| `pagamento.estornar`, `conta_pagar.cancelar`, `bpo.fechamento.executar` | executar | parcial ou sim | **sempre**, com motivo |
| `cobranca_cliente.emitir` | executar | sim | cartão até a promoção |
| `erp.lancar`, `erp.baixar` | executar | parcial (estorno no ERP) | lançamento sem cartão; **baixa só com comprovante ou extrato** |

A **trilha** é a cadeia de hashes das Fundações (5.2): quem capturou, conferiu, aprovou (e de onde), qual credencial, comprovante e hash. O relatório "trilha da empresa" é entregável ao cliente e ao auditor.

### 3.12 Entidades novas ou estendidas

O pacote reaproveita o modelo do 09 e acrescenta **titular**, para o dinheiro do escritório e o da empresa não se misturarem.

| Entidade | Mudança | Campos |
| --- | --- | --- |
| **Perfil BPO da empresa** (nova, versionada) | Schema do perfil do cliente do pacote | `escopo`, `modo_execucao`, `conexoes_bancarias`, `alcada_id`, `responsavel_id`, `analista_id`, `sla_id`, `termo_id`, `paralelo_ate` |
| **Conta bancária, a pagar, a receber, lançamento, plano de contas, centros, regras** (09) | Ganham `titular` (`escritorio` ou `empresa`), por F1 a F3 | `titular_tipo`, `titular_id`, `origem` (`nativo` ou `erp:<provedor>`), `versao_origem`; `escopo_credencial`; a conta a pagar ganha `etapas` e `aprovacao_cliente_id` |
| **Fornecedor da empresa** | Nova | `dados_bancarios_confirmados_em`, `confirmado_por`, `canal_confirmacao`, `risco` |
| **Lote de pagamento** e **Alçada** | Novas | Lote: `empresa_id`, `itens`, `total`, `modo_execucao`, `cartao_id`. Alçada: 3.9 |
| **Conta de cliente** (Fundações 2.3) | Estendida | Chave (pessoa, cliente, serviço); na linha `bpo_financeiro`: `alcada_pagamento`, `canal_aprovacao`; áreas `pagamentos_aprovar`, `caixa`, `relatorio_bpo` |
| **Subconta de cobrança** | Nova | `empresa_id`, `provedor`, `termo_id`, `situacao` |
| **Conexão de ERP** | Nova | `empresa_id`, `provedor`, `modo` (`api_leitura_escrita`, `api_leitura`, `arquivo`), `credencial_id`, `escopo`, `ultima_sincronizacao`, `situacao` |

Honorário BPO e margem seguem restritos (09, R8): o Colaborador vê o caixa da empresa, nunca o que ela paga ao escritório.

### 3.13 Riscos de fraude e como o desenho os reduz

| Risco | Controle |
| --- | --- |
| **Troca de conta do fornecedor** (a mais comum) | Dados alterados sobem de faixa; **confirmação por segundo canal**; o integrante só alerta |
| Boleto falso, fornecedor fictício, duplicidade, fracionamento | Beneficiário checado contra o cadastro; fornecedor novo sobe de faixa; consulta de CNPJ (08); hash de código de barras; soma por fornecedor e dia entra na faixa |
| Desvio interno | Segregação por `autorizar`; M1 padrão; revisão mensal de acessos (BPO-002) |
| Engenharia social e instrução escondida em PDF | Mensagem e documento são dado; pagamento só por cartão no app com segundo fator; WhatsApp só abaixo de teto, com código |
| Analista que saiu; aprovador comprometido | Revogação por evento; credencial no cofre do escritório (por titular empresa); segundo fator e aviso em outro canal |
| **Escrita errada no ERP do cliente; credencial do ERP vazada** | `erp.lancar` e `erp.baixar` com evento e trilha; baixa só com comprovante ou extrato; credencial no cofre do escritório (por titular empresa) com escopo mínimo; texto do ERP é dado, não instrução (3.0) |

Prática de mercado **[a confirmar]**: conta dedicada a fornecedores, com saldo controlado.

### 3.14 SLA, contrato e offboarding

| Tema | Regra |
| --- | --- |
| **Contrato** | Item do contrato único do cliente (09, 3.1), com escopo, faixa, SLA, alçadas anexas, responsabilidade por erro e aviso prévio |
| **SLA** | Conta capturada em X horas; lote enviado Y horas antes do vencimento; conciliação até o dia Z; relatório até o dia W. O relógio **pausa** com o cliente (cartão sem resposta, documento faltando) e retoma na resposta (04, 4.6) |
| **Offboarding** | Concluir o mês; pacote de saída com manifesto; revogar conexões (banco e ERP) e apagar o espelho; encerrar subconta e o serviço (F5); prova de exclusão (CIC-003, SOC-024) |

### 3.15 A Sofia (antes lembrada como "Luana") e o que ela ensina

**Atualização de 8/11/2026:** o produto que o usuário queria dizer é a **Sofia** (usesofia.com, "Software para BPO Financeiro com IA"). A ficha completa, a comparação com BPO Suite, Loki e Nortcash e as ideias aproveitáveis estão em [S5](../../pesquisa/plataforma/S5-bpo-financeiro-com-ia.md); o que segue abaixo foi escrito antes de o nome certo ser conhecido e vale como leitura da categoria. Resumo da Sofia: R$ 250 por organização ativa por mês; hoje a IA é o Radar (WhatsApp e e-mail para lançamento) e a conciliação assistida por Open Finance, com o operador validando; "IA autônoma", audit score, Central do BPO e white-label com subdomínio aparecem como "em construção" ou só na home; não executa pagamento; o plugin do Claude usa uma chave que abre todas as organizações do usuário (risco que não copiamos). Candidatos a feature tirados dela: audit score por empresa, gestão por exceção, IA que executa com confiança alta e nível configurável por cliente, API e MCP com escopo mínimo, BI em HTML sob demanda, migração em simulação.

### 3.15.1 Leitura da categoria (antes do nome certo)

**O produto "Luana" não foi confirmado.** Em 8/11/2026 foram feitas 7 buscas; as 4 tentativas de abrir páginas falharam por restrição de rede da sessão (`luana.ai`, `bposuite.com.br` e `multibpo.com.br` precisam ser liberados). Tudo vem de **resumos de busca**, fonte secundária. A ficha `S5-luana-bpo-com-ia.md` **não foi criada**, porque o produto não foi achado.

| Nome buscado ou parecido | O que apareceu | Serve como o Luana? |
| --- | --- | --- |
| **Luana AI** (`luana.ai`) | Análise financeira com IA por chat; só página agregadora | Improvável: é análise **[a confirmar]** |
| **MULTI BPO** | BPO financeiro com IA; assistente **Luca**; WhatsApp | Possível troca de nome **[a confirmar]** |
| **Ottimizza.AI** | Agentes de IA para contabilidade (conciliação LUZ.IA; Maria) | Nome parecido **[a confirmar]** |
| **BPO Suite** (Contbank) | BPO financeiro + Open Finance + IA; pagamentos em lote (Pix, TED, boleto); conciliação; caixa; lançado em set/2025; mais de 1.000 contadores parceiros | Categoria mais próxima; nenhum agente "Luana" |
| **Conta Azul (Conta AI), Omie** | Captura por WhatsApp e e-mail, a IA propõe o lançamento; Omie aprova contas pelo WhatsApp, até 10 por pedido, com token de 6 dígitos | Referências de categoria |

| Eixo | O que a categoria faz | Já cobrimos | Candidato a recurso | Nosso diferencial |
| --- | --- | --- | --- | --- |
| Captura | WhatsApp e e-mail; IA propõe, humano confirma | 3.5 | **Código ou QR por empresa** para o cliente mandar documento | Documento no índice e na tarefa certa |
| Aprovação | Por cargo, token, lote no app e no WhatsApp | 3.6, 3.7 | Código de uso único (já em 3.6) | Segregação por `autorizar`, trilha em hashes, alçada por pessoa |
| Pagamento | Lote Pix, TED e boleto no painel | 3.4 | Pagar direto no painel | Plataforma não toca o dinheiro; M1 padrão |
| Conciliação | Open Finance contínuo | 3.10 | Conciliação **contínua** | Alimenta a contabilidade, no mesmo sistema |
| Gestão do BPO | Visão consolidada da carteira | Carteira e Aprovações | Painel multiempresa de aprovações (dor do mercado) | Timesheet e custo-hora: margem real por empresa |
| IA | "Agente" é fluxo para um ciclo, não robô | Integrante com gatilhos (02) | Nome próprio por escritório | Time de agentes, memória, cartão |

**Lógica da categoria (não do Luana):** captura multicanal → IA lê e propõe → humano confirma → lote → aprovação por alçada com segundo fator → pagamento pelo banco → conciliação por Open Finance → relatório. **Riscos deles:** limite de registros por pedido; aprovação fora do sistema do BPO; pagamento que depende do cliente estar disponível (3.6). **Efeito nas hipóteses:** software de BPO financeiro para contadores já existe (Conta Azul, Omie, BPO Suite); o C1 só se diferencia com a ligação à contabilidade e ao custo-hora. A ordem passa de "C1 e B" para **"B primeiro, C1 em seguida"** (P1). Mercado (blogs, **[a confirmar]**): faixas de volume, não hora; Conta Azul Pro BPO R$ 129,90 por licença.

---

## 4. BPO entre escritórios (modo BPO)

### 4.1 Inquilino BPO e subinquilinos (DA-01 em dois níveis)

O BPO é o **inquilino-mãe** e o **único que assina** a plataforma (P5). Cada contratante é um **subinquilino**: uma unidade de dados com clientes finais, tema, domínio e **usuários convidados**, **sem assinatura nem pacote próprios**. Três mudanças nas Fundações:

1. **A mãe sempre vê o subinquilino, mas só os departamentos contratados** (BPO-002): `escopo_mae` por subinquilino, no lugar do `visivel_para_mae` solto.
2. **Trocar de contratante é trocar de contexto, sem novo login**, com evento (o escopo fixado no login, R3, passa a valer por contexto).
3. **Dois contextos de sessão.** No contexto **contratante** (um `subinquilino_id`), o usuário vê e a IA trabalha com memória e índice **só daquele** contratante. No contexto **mãe** (`subinquilino_id` nulo), vê listas, SLA e capacidade de todos, **sem abrir conteúdo e sem IA**.

A chave de sessão de integrante ganha o subinquilino: `escritorio:subinquilino:usuario:integrante:escopo`.

### 4.1.1 O contratante é cliente do BPO: o portal de convidado (P5, respondida em 8/11/2026)

O contratante **contrata o BPO** (contrato BPO-003), não a plataforma. O que ele recebe é um **portal de convidado** no sistema do BPO, como o app do cliente, mas para um escritório: **enviar pedidos, acompanhar a fila e o SLA, aprovar** (revisão do responsável técnico, "pode transmitir"), **conversar** e **ver relatórios**, tudo com a **marca do contratante**.

| Tema | Regra |
| --- | --- |
| Usuários do contratante | **Convidados**, convidados pelo BPO; **sem preço por usuário**. O BPO, que é o cliente pagante, define o que cobra do contratante |
| Teto de abuso | `convidados_max_por_contratante`, **10** como valor de teste, **editável**; **não é cobrança**. Ao passar do teto, o Administrador do BPO é avisado e decide |
| O que o convidado não vê | Custo, horas, margem, comentários internos e dados de outro contratante (4.2) |
| Acesso do BPO ao core do contratante (BPO-018) | O BPO opera o **core que o contratante já usa** (por acesso remoto e credencial dele) ou o seu próprio. É acesso ao core, **não ao nosso sistema**; nenhum caso passa o acesso do nosso sistema a quem não o contratou |


### 4.2 Visibilidade cruzada

| Objeto | Equipe do BPO | Convidados do contratante | Cliente final |
| --- | --- | --- | --- |
| Empresas do contratante (só departamentos contratados) | Sim, no contexto dele | Todas as suas | A própria |
| Tarefas, entregas, recibos | Todas | Campos "compartilhada" (estado, prazo, responsável, pendências) | O que o contratante liberar |
| Comentários internos; custo, horas, margem | Sim | **Não** | Não |
| Conversa BPO-contratante na tarefa (BPO-022) | Sim | Sim | Não |
| Dados de outro contratante | **Não** | **Não** | Não |

Tarefa e comentário têm `visibilidade` (`interna_bpo`, `compartilhada`): padrão compartilhada na tarefa, interna no comentário.

### 4.3 Fila única, "quem está com a bola" e SLA

A fila (BPO-010) é a lista de tarefas com **contratante** e **bola**. `fila.passar_bola(tarefa, para, motivo)` é ferramenta com evento.

| Bola | Significa | SLA |
| --- | --- | --- |
| **BPO** | O BPO precisa agir | Corre |
| **Contratante**, **cliente final**, **terceiro** | Aguardando decisão, documento ou órgão | **Pausa** (terceiro, com limite) |

O SLA **começa quando o pedido fica completo** (BPO-009) e nunca ultrapassa o prazo legal (FIS-001, DP-027). A meta por tipo vem do contrato (ponto de partida do 04: 1 h e 2 dias). O fechamento mensal (BPO-011) calcula o percentual no prazo, explica cada desvio como **do contratante** ou **do BPO**, aplica créditos e multas do contrato e é revisado por pessoa. A IA reordena por risco e avisa bola parada.

### 4.4 Contrato e responsabilidade técnica

O contrato (BPO-003) traz **escopo por departamento**, SLA, divisão de responsabilidade, sigilo, preço por volume, saída e o **modo de transferência por empresa**:

| Modo | O que é | Efeito |
| --- | --- | --- |
| **Parcial** | Contratante transfere parte e **mantém a responsabilidade técnica** (NBC PG 01, item 5 c) | Bloqueia transmissão e demonstração **sem a revisão do responsável técnico do contratante** (BPO-005) |
| **Total** | Contrato transferido com **anuência escrita do cliente final** (item 5 b) | Exige anuência anexada; o BPO assume a responsabilidade |

A revisão é tarefa de `risco` alto (07), com resumo do que mudou, ligada à entrega por hash. A Res. CFC 1.590/2020 não trata de terceirização entre escritórios; aplica-se o molde por analogia **[a confirmar]**.

### 4.5 LGPD, procuração e prova de segurança

| Tema | Desenho |
| --- | --- |
| **Cadeia** | Cliente final controlador; contratante operador; **BPO suboperador**; plataforma e nuvem abaixo. A plataforma gera acordo, lista de suboperadores e registro das operações por subinquilino (BPO-004; LGPD arts. 37 e 39) |
| **Procuração da Receita** | **Não passa do contratante ao BPO** (IN RFB 1.751/2017, fonte secundária). Saídas: o cliente final outorga também ao BPO; o BPO usa o certificado do contratante no cofre, com trilha por pessoa; ou prepara e o contratante transmite. O **mapa de credenciais** mostra qual vale (BPO-006). eSocial e FGTS Digital: regras próprias **[a confirmar]** |
| **Prova** | Trilha por subinquilino; aviso ao contratante no mesmo dia do incidente (ANPD: 3 dias úteis, fonte secundária); relatório de controles (BPO-020) |

### 4.6 Marca, App Store, carteira em bloco e encerramento

- **Marca** (BPO-007, 008): o cliente final vê **a marca do contratante**, nunca a do BPO (tema, domínio, remetente, WhatsApp). O modo de contato é por contratante e departamento: invisível, com a marca dele, ou direto.
- **App Store** (P10, respondida em 8/11/2026): a regra 4.2.6 da Apple (revisão de dez/2017) rejeita apps feitos a partir de modelo comercial **a menos que enviados diretamente pelo dono do conteúdo**. Os fornecedores de app com marca branca usam, na prática: (a) a **conta de desenvolvedor do cliente** (o fornecedor publica por acesso de equipe); (b) um **app único multi-cliente** na conta do fornecedor, com seletor de organização ou login que carrega a marca, sujeito ao julgamento da revisão (o caso B2B de marca diferente sobre o mesmo modelo é debatido em fóruns, sem resposta fechada); (c) **distribuição privada** (Apps Personalizados pelo Apple Business Manager) **[a confirmar]**. **Não há atalho garantido.** Decisão: **web app (PWA) primeiro**; depois o **app único com seletor**; o app com a marca do contratante, publicado na conta dele, é **opção cobrada**. Publicação em lote (GES-204) descartada. Google Play **[a confirmar]**. Registrado também no subplano 06, 11.3.
- **Carteira em bloco** (BPO-017): importar empresas (CIC-005), pedir credenciais, levantar pendências (SOC-022), um ou dois meses em **paralelo**.
- **Execução no core** (BPO-018): o BPO opera o **core do contratante** por acesso remoto, ou o seu próprio; é acesso ao core, **não ao nosso sistema** (4.1.1). A plataforma registra, confere o retorno e **não lança sozinha**.
- **Encerramento** (BPO-019): concluir competências, pacote de saída, devolver dados, apagar cópias, revogar acessos, última fatura. **Conhecimento por contratante** (BPO-021): base de procedimentos por subinquilino.
- Faturamento e rentabilidade: seção 7.

---

## 5. A tela BPO

### 5.1 Posição e conteúdo por cenário

Os itens laterais de cada cenário estão em 2.2. O **BPO** fica entre Financeiro e Configurações e **não é aba do Painel**: pertence a um pacote próprio e atravessa setores (fila, aprovações, volume). O item só aparece com o setor BPO financeiro e o módulo ligado em Configurações › Assinatura. O trabalho técnico de cada setor fica nas abas do Painel contábil; o item BPO cuida da **relação**: carteira, fila, aprovação, SLA, volume e margem. Identificadores: `aba.bpo.<nome>`.

| Cenário | Frente da aba BPO | Particularidade |
| --- | --- | --- |
| 1. Contabilidade que compra o BPO (B) | Financeira | O cliente já existe no cadastro; a empresa BPO aparece também no Painel contábil, com cor própria no calendário; o Financeiro fatura uma só fatura |
| 2. BPO financeiro puro (C1) | Financeira | Sem Painel; Clientes e BPO são o espaço de trabalho |
| 3. BPO entre escritórios (C2) | Entre escritórios | Seletor de contratante; contexto mãe ou contratante (4.1) |

### 5.2 As abas

[F] BPO financeiro; [E] entre escritórios. As nove existem nos cenários 1 a 3; o perfil A não tem o item.

**Nome da aba e título da tela.** Nove abas não cabem com o nome inteiro: a aba mostra o **nome curto** (Visão geral, Carteira, **Fila**, Rotinas, Aprovações, **Entregas**, **Volume**, **Rentabilidade**, Configuração) e o **título da tela** traz o nome completo da tabela abaixo. O identificador segue `aba.bpo.<nome>`.

| Aba | O que mostra |
| --- | --- |
| **Visão geral** | Abre por **Precisa de decisão** (vermelho antes de amarelo, as seis primeiras e "mostrar todas"); **audit score** (contagem por cor) e as **exceções** do dia; cartões pendentes, fila em risco, SLA, caixa das empresas, alertas. Com **uma empresa escolhida**, mostra a auditoria, o caixa e o fluxo dela. A auditoria tem **cor e rótulo** ("em dia", "atenção", "agir hoje"), **nunca só cor** |
| **Carteira** | F: empresas BPO, **audit score (semáforo, rótulo e motivo)**, saldo, pendências; por empresa, o **ERP e a sincronização** (sincronizado, atrasada, credencial vencida, modo arquivo, livro próprio), o **caixa contra o mínimo**, os **lotes com o cliente** e a **fila e o SLA**. E: contratantes e, dentro, empresas |
| **Fila e pedidos** | F: pedidos e pagamentos do dia. E: fila única com bola e SLA |
| **Rotinas** | Checklists diário, semanal e mensal por empresa; calendário de entregas por contratante |
| **Aprovações** | F: cartões aguardando o cliente e conferências. E: revisões do responsável técnico, "pode transmitir" |
| **Entregas e SLA** | Entregas com recibo, relatório mensal, SLA, desvios, qualidade (BPO-013) |
| **Volume e faturamento** | Contagem, extrato, contestação, glosa, envio ao Financeiro |
| **Rentabilidade e capacidade** | Margem por empresa, contratante e departamento; carga por semana |
| **Configuração** | F, **por empresa**: ERP e modo, escopo da credencial, religar ou pedir nova autorização, bancos por Open Finance, modo de pagamento M1 ou M2 (M3 desligado na primeira versão), alçadas e janela (3.0). E: contratos, escopo, suboperadores, procurações, marca, convidados e teto |

Com as duas frentes, um **seletor** ("Empresas · Contratantes") escolhe o conteúdo.

**Audit score e gestão por exceção (decididos em 8/11/2026; entram já na primeira versão da tela BPO).** Ideia aproveitada da Sofia (S5, ideia 1), que ainda a anuncia como "em construção":

- **Audit score** por empresa BPO: um **semáforo verde, amarelo e vermelho**, recalculado **a cada sincronização do ERP e uma vez por dia**, que resume se a empresa está em dia: documentos capturados e não lançados, conciliação atrasada, divergências abertas, ERP sincronizado, aprovações do cliente vencidas, SLA do mês e fechamento. Os **critérios e os pesos são fixos do sistema** (sincronização do ERP, caixa mínimo, vencido sem aprovação, fornecedor novo, modo arquivo, além dos itens acima) e o **Gestor ajusta os pesos** na Configuração (Q1, respondida; substitui a regra inicial de parâmetros do inquilino com 2 dias úteis); os pesos de partida são **[premissa a validar no piloto]**. Cada cor mostra **o motivo** ("conciliação atrasada há 4 dias; 3 documentos sem lançar") e leva ao item. Aparece como coluna da **Carteira**, como contagem por cor na **Visão geral** e no cartão do integrante. Ferramenta `bpo.audit_score` (ler; Fundações 6.5, por titular empresa) e evento `bpo.score.mudar` na mudança de cor.
- **Gestão por exceção:** a **Visão geral**, a **Fila e pedidos** e as **Rotinas** abrem **só com o que está fora do verde** (as exceções, do vermelho ao amarelo); a empresa em dia fica recolhida ("38 empresas em dia") e a carteira inteira está a um clique. O analista trabalha da exceção; o Gestor vê quem está acumulando vermelho por analista. No C2 o mesmo vale por contratante.
- **Primeira versão:** o score e o filtro de exceção nascem com a tela (etapa B3, 11.1), calculados com o que já existir (pendências, aprovações, SLA e volume) e ganham os componentes de conciliação e de sincronização do ERP quando B7a e B9 entram. Não ficam para depois: sem eles, a tela só lista, não prioriza.

No modo ERP (3.0), Fila, Rotinas e Aprovações operam sobre o **espelho**; cada linha tem o atalho "abrir no ERP". Na Carteira, a empresa com sincronização atrasada, credencial vencida ou ERP em modo arquivo (E2) aparece com selo e vira alerta. A aba **Configuração** guarda a conexão de ERP, o modo (E1, E2, E3) e o escopo da credencial.

### 5.3 Wireframes

Visão geral, BPO financeiro (cenários 1 e 2):

```
┌─ BPO · Visão geral · novembro ▾ ─────────────────────────── [integrante: Bia] ┐
│ 38 empresas · 71 contas · SLA do mês 96% · volume 6.240 lançamentos            │
│ ┌─ Precisa de decisão ──────────────────┐ ┌─ Alertas ─────────────────────┐   │
│ │ 5 cartões aguardando cliente (2 vencem)│ │ Fornecedor novo: Gráfica Nova │   │
│ │ 3 conferências do BPO a fazer          │ │ Consentimento vence em 12 d.  │   │
│ │ Padaria Y: cartão R$ 13.940  [abrir]   │ └──────────────────────────────┘   │
│ └───────────────────────────────────────┘ Caixa abaixo do mínimo: Loja Z, W   │
└───────────────────────────────────────────────────────────────────────────────┘
```

Visão geral, entre escritórios (cenário 3, contexto mãe):

```
┌─ BPO · Visão geral · novembro ▾ ─────────────────────────────────────────────┐
│ 8 contratantes · 160 empresas · SLA 94% · margem 31% · 14 tarefas em risco    │
│ Contratante      Empresas  No prazo  Bola BPO  Bola contratante  Margem       │
│ Escritório Alfa     32      97%        11          6              38%         │
│ Contábil Beta       21      88% ⚠       19          9              12% ⚠      │
│ [abrir contratante ▸]  (abre no contexto do contratante)                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Fila e pedidos:

```
┌─ BPO · Fila e pedidos · [Contratante ▾] [Bola ▾] [Departamento ▾] [+ Pedido] ┐
│ ● Rescisão João Silva  Alfa/Mercadinho X  DP-027  legal 12/11   BOLA: BPO     │
│ ● Folha 11/2026        Alfa/Padaria Y     DP-014  SLA 3 d       BOLA: BPO     │
│ ⏸ Admissão Maria        Beta/Clínica W     DP-001  falta CTPS    BOLA: cliente final (2 d) │
│ ⏸ Transmitir PGDAS-D    Beta/Loja Z        FIS-009 revisão do RT BOLA: contratante ▸ cartão │
│ SLA 94% no prazo · resposta média do contratante: 6 h                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

No BPO financeiro a fila mostra pedidos do cliente ("pague o fornecedor X") e o lote, com a bola entre BPO e cliente.

### 5.4 Permissões por papel

| Aba | Administrador | Gestor (setor do BPO) | Colaborador | Cliente do BPO (app) | Convidado do contratante |
| --- | --- | --- | --- | --- | --- |
| Visão geral | Tudo, com margem | Setor, sem margem | O que é dele | Pendências e cartões | Resumo dele |
| Carteira | Tudo; encerra | Edita perfil BPO | Lê; edita ficha | A própria empresa | As suas empresas |
| Fila e pedidos | Tudo | Reatribui, passa a bola | Executa as suas | Seus pedidos | Fila compartilhada |
| Rotinas | Tudo | Configura | Executa | Não | Não |
| Aprovações | Vê todas | Confere e libera na alçada | Digita; confere com outra pessoa | **Aprova na alçada** | Aprova revisões, se for o responsável técnico |
| Entregas e SLA | Tudo | Fecha relatório | Lê | Relatório da empresa | Relatório e SLA dele |
| Volume e faturamento | Tudo | Lê; contesta | Não | Só a fatura | Extrato; contesta |
| Rentabilidade e capacidade | Tudo | Só com Gestão ou Financeiro | **Não** | Não | **Não** |
| Configuração | Edita | **Edita** (alçadas e modo só valem com o aceite do sócio no app) | Não | Não | Não |

**Quantas abas cada papel vê:** o **Colaborador, seis** (sem Volume e faturamento, Rentabilidade e capacidade, Configuração); o **Gestor do BPO, oito** (sem Rentabilidade e capacidade, e **sem margem**), e edita a Configuração; o **Administrador, nove**. O Gestor do BPO que também gere Gestão ou Financeiro vê a Rentabilidade.

Permissão é por `(ferramenta, titular)` (F1): a aba BPO mostra o componente do Financeiro **só com titular empresa**; o caixa do escritório segue restrito a Administrador e Gestor do Financeiro. A **alçada fica no contato da ficha** (Conta de cliente). **Margem e custo-hora nunca são liberáveis por exceção.** A tela esconde, não deixa cinza. O contratante entra como **convidado**, sem preço por usuário (4.1.1). No celular cabe em um toque: aprovar, recusar, perguntar, ver caixa; o app do cliente ganha **Aprovações de pagamento** como primeira tela do sócio e do financeiro.

---

## 6. IA no BPO

### 6.1 Dois integrantes

Seguem a mecânica do 02. Cada um pertence a uma camada diferente.

| Integrante | Camada | Função | Escopo |
| --- | --- | --- | --- |
| **BPO financeiro** | Pacote BPO Financeiro (setor `bpo_financeiro`) | Captura, lê, confere, concilia, projeta caixa, prepara lote e relatório | Empresas BPO do usuário; só ferramentas do pacote |
| **SLA e fila** | Modo BPO da plataforma (setor `bpo`) | Recebe pedidos, confere completude, ordena a fila, mede SLA, cobra a bola, rascunha o relatório do contratante | Fila e contratos do usuário; **um subinquilino por contexto** |

Nome e avatar vêm do tema. Memória por setor e, no C2, **por subinquilino** (BPO-021), nunca cruzada.

### 6.2 Atividades por ID, fase e autonomia

Fonte: `atividades.json`, 8/11/2026.

| ID | Atividade | Fase | Aut. | O que o integrante faz |
| --- | --- | :-: | :-: | --- |
| FIN-201 | BPO financeiro do cliente | **3c** (JSON atualizado em 8/11/2026; era 5) | P | Prepara lote e cartão; nunca paga (antecipada, 11.3) |
| FIN-003 | Capturar contas | 3 | P | Captura, lê, classifica, propõe |
| FIN-004 | Conciliação | 3 | S | Concilia o que casa por regra aprovada |
| FIN-005 | Fluxo de caixa | 3 | S | Atualiza a projeção semanal |
| FIN-006 | DRE gerencial | 3 | P | Rascunha |
| CTB-008 | Extrato do mês (plataforma, com titular) | 1 | S | Importa e confere; classifica por categoria gerencial |
| CTB-015 | Conta contábil por linha | 1 | S | **Só no perfil B**, com o pacote Contábil |
| CTB-010 | Consentimento Open Finance | 0 | O | Pede e renova |
| BPO-009 | Pedidos e completude | 2 | S | Lê o pedido, aponta o que falta, inicia o SLA |
| BPO-010 | Fila única | 2 | S | Ordena por risco; avisa bola parada |
| BPO-011 | Medir SLA | 2 | P | Calcula e explica desvios |
| BPO-012 | Painel e relatório do contratante | 3 | S | Escreve resumo por empresa |
| BPO-013 | Auditoria de qualidade | 3 | P | Confere por regra e sorteia amostra |
| BPO-015 | Volume e fatura | 3 | S | Monta extrato; cobra após o prazo de contestação |
| BPO-016 | Rentabilidade e capacidade | 3 | P | Projeta e sugere |
| BPO-008, 021, 022 | Contato, conhecimento, conversa | 2 | P, S, S | Tom do contratante; procedimento; cobra resposta |

Apoio de fundação (pessoa conclui): BPO-002, 003, 004, 005, 006 e 020.

### 6.3 O que nunca faz sozinho, limites e plano de IA

**Nunca, sem cartão e sem promoção:** pagar ou transferir (**nunca promovível**, regra B3); alterar dados bancários; criar fornecedor com conta; mudar alçada ou modo; aprovar pelo cliente; fechar o mês; cobrança firme; transmitir ou liberar demonstração sem revisão registrada; abrir caixa postal (dá ciência, 08, 13.1); revogar credencial.

**Limites:** os do 02, mais **teto de custo por empresa** (ao estourar, a captura segue por regra e a classificação por modelo pausa) e **uma sessão por contratante**, que compacta ao trocar. O integrante só fala com cartão, divergência ou SLA em risco.

**Plano de IA.** O BPO tem poucos usuários e muitas empresas; o consumo vem dos eventos (estudo 6.5). Estimativa **[premissa]**: 74 UU por empresa por mês (40 baixo, 140 alto). No C1 com 40 empresas e 6 usuários, a demanda é cerca de 2.960 UU; com o uso dos usuários a 35% do teto (4.515 UU), 7.475 UU. Seis **IA Intensivo** têm 12.900 UU (58%); seis **IA Operação**, 7.740 UU (97%). **Recomendação:** Intensivo para quem opera, ou Operação com bolsa e uso extra. O plano é do **usuário**, não do pacote.

**Horas poupadas** (GES-056): cada evento de integrante é comparado à duração padrão da atividade (`horas_100`, calibrada pelo timesheet) e mostrado **em série separada das horas humanas**.

---

## 7. Tempo, rentabilidade e faturamento

### 7.1 Horas por empresa BPO e por contratante

O Timesheet (05) é **um só**, com catálogo-união dos pacotes. Dimensões novas: **contratante** (`subinquilino_id`), **departamento** (setor da atividade) e **frente**. O catálogo estima **207 h por mês** para coordenar 100 empresas finais (soma de `horas_100` das 23 fichas BPO); a execução está nas fichas de DP, fiscal e contábil. Para o BPO financeiro há só FIN-201, 40 h por mês por 100 clientes, **claramente baixo** (o mercado cita um analista para cerca de 80 clientes) **[a confirmar]**. Tudo é `[ESTIMATIVA]` até medir (05, 11.2).

**Custo-hora:** o 05 decidiu um custo-hora **do escritório**, derivado só do titular `escritorio` (F3). No BPO, hora de DP, fiscal e financeiro custam diferente; **Decidido (Q7, respondida e corrigida em 8/11/2026):** **um custo-hora do escritório, que inclui todos os pacotes**; o **custo-hora por pacote é só um extra opcional, desligado por padrão** (o custo por departamento é detalhe desse extra); e o **BPO é um filtro** nas telas do Timesheet e da Rentabilidade (chip "Pacote: Contábil | BPO | Todos"), não um custo-hora próprio. As horas da equipe do escritório no BPO entram no custo-hora; o dinheiro da empresa BPO (titular `empresa`) nunca entra (F3).

### 7.2 Medição do volume

| Unidade | Fonte (evento) | Conta quando | Proteção |
| --- | --- | --- | --- |
| Empresa ativa por regime | Perfil e estado do serviço | Ativa no mês | Em paralelo não conta |
| Lançamento; conciliação | `lancamento.criar`, `.conciliar` | Classificado ou casado | Duplicado, ajuste e ignorado não contam |
| Pagamento executado | `pagamento.liberar` | Com comprovante | Estorno desconta |
| Conta bancária conectada | Conexão `ativa` | Funcionou no mês | |
| Holerite, admissão, rescisão; nota escriturada | DP-014, DP-001, DP-027; escrituração | Concluído | Cancelada não conta |
| Hora fora de escopo | `fora_de_escopo` (09, 4.7) | Aceite do contratante (GES-036) | |

Conta só o **entregue e não contestado**; o contratante ou a empresa vê o **extrato** antes da fatura.

### 7.3 Faturamento por volume e por faixa

O 09 já tem item de contrato com `tipo_cobranca` (fixo, por_faixa, por_unidade), `metrica` e `faixas`; **o BPO usa essas estruturas e não cria motor novo**. Modelos: fixo por empresa e regime (C2); faixa de volume com excedente (B e C1); por evento (DP, C2); hora ou equipe dedicada (volume imprevisível); misto, o mais comum **[a confirmar]**. Fluxo mensal (BPO-015): `bpo.contar_volume` → extrato → prazo de contestação → glosas → **a mesma fatura do Financeiro**, com linhas por serviço (cenário 1: Contábil e BPO juntos).

**Faturamento conjunto e notas por serviço (decisão do usuário, 8/11/2026; Q6).** Ao cliente que paga BPO e contabilidade: **uma fatura e uma cobrança só por mês** (um boleto ou Pix, lançamento conjunto), com os **serviços em linhas separadas** (honorário contábil, mensalidade do BPO, excedente). **As diferenças ficam nas notas:** cada serviço respeita a própria tributação, e as notas fiscais saem **por serviço**, como **uma NFS-e por serviço**, o padrão, porque o **layout nacional decide** e **não está confirmado** que uma DPS aceite mais de um serviço **[a confirmar na NT 007/2026]** (09, 5.5; parâmetro `nfse_por_servico`). Isso substitui "um boleto e uma NFS-e".
 `faixa.estourar` propõe excedente ou aditivo. **O excedente de lançamentos acima da faixa vira extra na fatura do escritório, com o ok de uma pessoa** (o UI lab o cita como "4.2"; é esta regra).

### 7.4 Rentabilidade e relatórios

A Rentabilidade (05, 8.4) ganha o chip **Pacote: Contábil | BPO | Todos** e os filtros **contratante**, **departamento** e **frente**. Margem = honorário do mês (`contrato.honorario_na_competencia`; no cenário 1, honorário contábil **mais** taxa de BPO) − horas × custo-hora do escritório (do pacote, só se o extra opcional estiver ligado) − custos variáveis (IA, Open Finance rateado, WhatsApp), sobre o faturado e sobre o recebido. **Capacidade** (BPO-016): carga da semana pela fila e pelo calendário (folha no início do mês, DCTFWeb e EFD-Reinf no meio, Simples no dia 20).

| Relatório | Para quem | Marca |
| --- | --- | --- |
| Mensal da empresa BPO: caixa, pagamentos, DRE, riscos | Sócio da empresa | Do escritório |
| Mensal do contratante (BPO-012): entregas com recibo, guias, pendências, erros com correção; SLA (BPO-011); controles (BPO-020) | Contratante | **Do contratante** |

---

## 8. Conectores e custos

### 8.1 Conectores do BPO

| Conector | Uso | Custo e regras |
| --- | --- | --- |
| **Open Finance** (Pluggy, Belvo) | Extrato e saldo, conciliação contínua | Pluggy a partir de R$ 2.500/mês (**não confirmado no site oficial**), Belvo US$ 1.000/mês; consentimento **com vencimento**; piso alto, só rateado |
| **OFX, CNAB** | Alternativa gratuita | Sem conciliação contínua |
| **ERP financeiro do cliente** (Conta Azul, Omie, Nibo, Granatum, Bling) | Ler e, onde a API permitir, escrever contas, lançamentos e baixas (3.0) | OAuth ou chave do cliente no cofre; limites de chamadas por conta; **ver 8.3**; custo de infraestrutura R$ 1 / 3 / 8 por empresa **[premissa]** |
| **API do banco da empresa** | Cobrança e, **a confirmar**, pagamento | Credencial gerada pelo correntista; mTLS e secret no cofre; tarifa do convênio dela |
| **Subconta em provedor** | Cobrança dos clientes do cliente | Tarifa da empresa (Asaas R$ 1,59, R$ 0,79 promocional; Efí boleto R$ 3,45); subconta em nome do cliente **[a confirmar]** |
| **WhatsApp** | Cartão, avisos, mensagens do contratante | Utilidade R$ 0,035; marketing R$ 0,3217; vai ao escritório |
| **Cores do contratante** (BPO-018) | Execução do BPO no core dele, por acesso remoto (acesso ao core, não ao nosso sistema) | Licença é do contratante **[preço não público]** |
| **Governo** (Integra) | C2 | 08, seção 10; **procuração não passa ao BPO** |

### 8.2 Quem paga e custo por empresa BPO

IA de BPO: plataforma. Open Finance: **escritório, à parte**. WhatsApp, tarifas de banco e provedor, licença de core: escritório, empresa ou contratante. Armazenamento: plano (5 GB por cliente).

| Item do custo provável | Cálculo (premissa) | R$ por empresa/mês |
| --- | --- | ---: |
| Leitura e classificação por modelo | 150 documentos; 30% precisam de modelo (45) × R$ 0,13 | 5,9 |
| Relatório e DRE (rascunho) | 7,5 UU × R$ 0,0882 | 0,7 |
| Armazenamento, busca, eventos | Infra rateada | 1,0 |
| Open Finance (variável) | R$ 1 por cliente conectado | 1,0 |
| Conector de ERP financeiro | Sincronização e consultas periódicas, por empresa **[premissa]** | 3,0 |
| **Total** | | **≈ 11,6** |

O estudo usava R$ 6; a conta sugere **R$ 9** de IA, infraestrutura e Open Finance (faixa R$ 4, R$ 9, R$ 18) mais **R$ 3** do conector de ERP (faixa R$ 1, R$ 3, R$ 8): **R$ 12 por empresa**. No modo de livro próprio (E3) não há conector. **Medir no piloto.**

### 8.3 ERPs financeiros de PME: API aberta para terceiros (P3, pesquisa de 8/11/2026)

Quatro buscas na web em 8/11/2026; as páginas oficiais não foram lidas por inteiro, só os resumos de busca. **Tudo é [a confirmar]** antes de construir o conector. A coluna "modo" é o que a evidência permite hoje (3.0).

| ERP | API aberta a terceiros? | Autenticação e escopo | Limites e condições | Modo provável |
| --- | --- | --- | --- | --- |
| **Conta Azul** | **Sim.** Portal `developers.contaazul.com`; aplicação pública (vários clientes) ou privada | OAuth 2.0 com código de autorização; **cada empresa autoriza e gera token próprio**; refresh token | 600 chamadas por minuto e 10 por segundo por conta conectada; **sem webhooks nativos** (consulta periódica); sandbox de 30 dias, prorrogável; endpoints de contas a pagar e a receber e de escrita **[a confirmar]**; requisitos mínimos de app público **[a confirmar]** | **E1**, escrita a confirmar |
| **Omie** | **Sim.** Referência em `developer.omie.com.br` | `app_key` e `app_secret` **gerados pelo cliente** (Configurações > Geral > API) | Métodos de contas a pagar para **leitura e escrita** (`ListarContasPagar`, `ConsultarContaPagar`, `IncluirContaPagar`, `UpsertContaPagarPorLote`); custo, limites e dependência do plano contratado **[a confirmar]**; regras para app de parceiro **[a confirmar]** | **E1** |
| **Bling** | **Sim**, API v3 | OAuth | Contas a pagar e a receber na API; 3 requisições por segundo e 120.000 por dia por conta (**fonte secundária**, documento de um integrador); sem sandbox **[a confirmar]**; endpoints financeiros **[a confirmar]** | **E1**, a confirmar |
| **Nibo** | **Restrita:** a API pública está disponível só para usuários beta (Nibo Obrigações) | Exige conta de contador Nibo e token gerado no painel de integração | Liberação e escopo financeiro **[a confirmar]** | **E2** (arquivo) até confirmar |
| **Granatum** | **Existe** (token por empresa nas configurações); só se achou fonte de terceiros (plugin) | Token da empresa | Escopo de contas a pagar e condições **[a confirmar]** | **E2** até confirmar |

Leitura: **Conta Azul e Omie** são os candidatos a **E1** (conector de leitura e escrita); Bling vem depois; **Nibo e Granatum** entram por **arquivo (E2)** até haver confirmação. Nenhum custo de acesso à API foi achado, e **o cliente paga o próprio ERP**. Pedir aos fornecedores as condições de parceiro e de uso por terceiros antes de prometer escrita.

---

---

## 9. Precificação

### 9.1 Como os módulos entram no configurador

A equação do estudo (6.1) ganha uma camada: **preço = núcleo + pacotes de área + módulos + planos de IA + complementos**.

| Regra | Valor |
| --- | --- |
| **Plataforma (núcleo)** | Obrigatória; B 100 + 0,30 por cliente efetivo + 5 por usuário |
| **Pacote de área** | Pelo menos um. Contábil: B 100 + 0,40 por cliente efetivo. **BPO Financeiro (v0.6): mensalidade-base de R$ 390 + R$ 65 por empresa incluída**, as duas partes editáveis (era R$ 150 + R$ 18 na proposta anterior) |
| Módulos da plataforma | CRM, Timesheet, App, Financeiro, Open Finance: iguais em qualquer pacote. Conectores de governo, estados e cores ficam no pacote Contábil |
| Dependências (P6) | **Só as dependências técnicas reais são obrigatórias.** O pacote BPO Financeiro exige o **núcleo**, o **Financeiro** (guarda o espelho do ERP e roda a conciliação assistida) e o **App** (superfície de aprovação do cliente: cartão, PWA). **Timesheet, CRM e Open Finance são "recomendados, desmarcáveis"**: o BPO os traz marcados por padrão, mas o sistema é modular e o escritório pode tirá-los (sem Timesheet não há margem por empresa; sem Open Finance o extrato vem por OFX). Modo BPO exige um pacote com setor executado; Timesheet fica recomendado |
| Modo BPO | R$ 490 + R$ 120 por subescritório (contratante); os clientes finais de todos somam para a faixa (P10 do estudo). **Os convidados do contratante não têm preço por usuário** (P5): o BPO define o que cobra do contratante; teto de abuso de **10 convidados por contratante**, editável, que não é cobrança. **O Financeiro conta os contratantes**, não os clientes finais (P9) |
| Aba e setor | **Não se cobra por aba nem por setor** (P8): os módulos são opcionais, as abas não; tudo o que vem num módulo ou pacote está incluído. Desativar um setor não reduz o preço |

**Regra "sem dupla cobrança"** (DA-02.1, item 8):

1. **Plataforma, faixa de clientes, usuários e GB são cobrados uma vez.** O cliente atendido pelos dois pacotes conta **uma vez** na faixa (cenário 1: as 10 empresas BPO estão entre os 100 clientes).
2. **Cada função é paga onde está.** O componente do Financeiro (contas, conciliação, cobrança, caixa) é cobrado pelo módulo Financeiro; o valor por empresa do pacote BPO cobre só o que é do pacote: rotinas, alçadas, fila, aprovação, perfil, conectores de ERP financeiro e IA de BPO (F7).
3. **Open Finance:** uma contratação para os dois titulares; a conta conectada conta uma vez.
4. **App, CRM, Timesheet e plano de IA** são cobrados uma vez por cliente ou usuário, qualquer que seja o número de pacotes.
5. A soma do núcleo (100 + 0,30) com o pacote Contábil (100 + 0,40) é **igual ao Painel atual** (200 + 0,70): quem só compra o Contábil paga o de hoje.

### 9.2 Parâmetros de teste em `parametros.json` (versão 0.6)

**Aplicado em `parametros.json` 0.6 (8/11/2026).** `complementos.bpo_fin` (pacote BPO Financeiro) e `nucleo_sem_contabil` (C1) já estão no arquivo e no configurador; `nucleo` e `pacotes.contabil` seguem como proposta (o configurador usa o Painel, que é a soma dos dois). Listas de custo = [baixo, provável, alto].

| Chave | Preço (R$/mês) | Custo | Observação |
| --- | --- | --- | --- |
| `modulos.painel` | **Substituído** por `nucleo` e `pacotes.contabil` (soma igual) | | O configurador ganha a seleção "produto", sem alterar preço |
| `nucleo` | B 100 · a 0,30 · u 5 | fixo [12, 22, 55] · cliente [0,10, 0,30, 0,75] · usuário [6, 12,5, 25] | Obrigatório |
| `nucleo_sem_contabil` | Núcleo para o BPO financeiro puro: B 100 · a 0,30 · u 5 | fixo [12, 22, 55] · cliente [0,10, 0,30, 0,75] · usuário [6, 12,5, 25] | C1, sem Painel contábil, gov, est e cores |
| `pacotes.contabil` | B 100 · a 0,40 | fixo [6, 11, 25] · cliente [0,10, 0,30, 0,75] | Contém Fiscal e Notas, DP, Contábil, Consultoria; exige núcleo |
| `complementos.bpo_fin` (pacote BPO Financeiro) | **Mensalidade-base 390 · empresa 65** (era 150 e 12; proposta 18) | fixo [15, 30, 60] · empresa [4, 9, 18] · **conector de ERP [1, 3, 8] por empresa** | Exige fin e app; margem de linha de 83% a 86% (paga o desenvolvimento dos conectores); calibrado pela Sofia (R$ 250, teto) e pelo BPO Suite (piso) |
| `complementos.modo_bpo` | Fixo 490 · sub 120 | fixo [15, 30, 60] · sub [10, 25, 40] | Mantém; Timesheet recomendado (P6) |
| `complementos.modo_bpo.convidados_max_por_contratante` | **10** (teto de abuso, **não é cobrança**) | | Convidados do contratante sem preço por usuário (P5); editável |
| `bpo.uu_por_empresa_mes` | | [40, 74, 140] | Consumo da frente financeira |

### 9.3 Simulação para três casos (recalculada em 8/11/2026)

Configurador v0.7 (com o chat de suporte de R$ 2 por assento e o teto de 130% dos conectores; entre parênteses, a v0.6), perfil provável, reais de 7/11/2026, câmbio R$ 7,97. **Premissas:** IA a 35% do teto no provável (70% no alto); Open Finance a R$ 450 + R$ 6 por empresa conectada, custo R$ 250 de rateio + R$ 1; marca branca R$ 150; no caso 3 o Financeiro conta os **8 contratantes** (P9, respondida); sem armazenamento da plataforma. Margens: **(a)** contribuição, **(b)** após fixos rateados, **(c)** líquida, com tributos de 12,5%. Nenhum valor é preço de venda.

| | **Caso 1** · Contabilidade com BPO financeiro de 10 empresas | **Caso 2** · BPO financeiro puro, 40 empresas, 6 usuários | **Caso 3** · BPO entre escritórios, 8 subescritórios, 160 clientes |
| --- | --- | --- | --- |
| Produto e perfil | Contábil com BPO (B) | BPO Financeiro (C1) | BPO para Escritórios (C2) |
| Clientes e usuários | 100 clientes, 15 usuários | 40 empresas, 6 usuários | 8 contratantes (clientes do BPO), 160 clientes finais, 12 usuários do BPO (premissa) |
| Pacotes | Contábil + BPO Financeiro | **BPO Financeiro**, núcleo sem Contábil | Contábil |
| Módulos | CRM, Timesheet, App, Financeiro, gov, est | CRM, Timesheet, App, Financeiro | CRM, Timesheet, App, Financeiro (8), gov, est, cores |
| Complementos | Marca branca, Open Finance (10), Pacote BPO (10 empresas) | Marca branca, Open Finance (40), Pacote BPO (40 empresas) | Marca branca, modo BPO (8) |
| IA | IA Operação para 3 | **IA Intensivo para 6** | IA Operação para 12 |
| Parte do BPO | Pacote R$ 1.040 (390 + 10 × 65; R$ 104 por empresa) | Pacote R$ 2.990 (390 + 40 × 65; R$ 75 por empresa) | Modo BPO R$ 1.450 (490 + 8 × 120) |
| **Preço mensal** | **R$ 3.692** | **R$ 6.318** | **R$ 5.371** |
| **Custo provável** | R$ 1.417 (1.387) | R$ 1.473 (1.461) | R$ 1.963 (1.939) |
| **(a) Margem de contribuição** | **61,6%** (62,4%) | **76,7%** (76,9%) | **63,4%** (63,9%) |
| (b) Após fixos rateados | 54,2% (55,0%) | 74,9% (75,1%) | 55,3% (55,7%) |
| (c) Líquida | 41,7% (42,5%) | 62,4% (62,6%) | 42,8% (43,2%) |
| (a) no uso alto | 30,9% (30,0%) | 54,1% (54,5%) | 29,2% (27,3%) |
| Variação | Sem o pacote BPO: R$ 2.652, (a) 52,2% | Sem o pacote BPO: R$ 3.328, (a) 71,1% | Com IA Intensivo para os 12: R$ 6.691, (a) 65,9% |
| Preço total por empresa | | R$ 158 (tudo) | |

**Nota v0.9 (9/11/2026):** o App do cliente segue incluído nos pacotes, e o preço dele por cliente subiu de R$ 0,30 para R$ 0,60 (Estudo de Precificação, adendo v0.9). Custos iguais; preços R$ 3.720 / 6.330 / 5.412; (a) 61,9% / 76,7% / 63,7%; (b) 54,6% / 75,0% / 55,6%; (c) 42,1% / 62,5% / 43,1%; (a) no uso alto 31,3% / 54,2% / 29,7%. Sem o pacote BPO: R$ 2.680 (52,7%) e R$ 3.340 (71,2%); caso 3 com IA Intensivo para os 12: R$ 6.732 (66,1%). O caso 2 segue em R$ 158 por empresa; sensibilidade do valor por empresa (R$ 48 / 65 / 90): caso 2 em R$ 5.650 / 6.330 / 7.330, caso 1 em R$ 3.550 / 3.720 / 3.970. A tabela acima fica como registro.

Leitura:

- **Pacote contra o mercado** (S5, páginas comerciais): a Sofia cobra R$ 250 por organização (40 empresas: R$ 10.000; Founders, R$ 7.160), e é o teto de referência; o BPO Suite cobra R$ 800 por 10 CNPJs e cerca de R$ 3.018 por 40 (só software). O pacote fica um pouco acima do BPO Suite em 10 e 25 empresas (R$ 1.040 contra 800; R$ 2.015 contra 1.750) e no mesmo nível em 40 (R$ 2.990). O escritório de 40 empresas paga R$ 158 por empresa, com plataforma, IA, Open Finance e app, contra R$ 250 da Sofia. Sensibilidade do valor por empresa (R$ 48, R$ 65, R$ 90): caso 2 em R$ 5.638, R$ 6.318 e R$ 7.318; caso 1 em R$ 3.522, R$ 3.692 e R$ 3.942.
- **Margem de linha do pacote (83% a 86%)** é alta de propósito: o usuário pediu que o BPO **pague pelo acesso** e por empresa, e a margem financia o desenvolvimento e a manutenção dos conectores de ERP, que **não entram no custo variável**. Medir no piloto.
- O caso 2 tem a melhor margem porque **não carrega** o pacote Contábil, os conectores de governo e os setores: é o argumento comercial da arquitetura de pacotes. No **uso alto** o caso 1 cai a 31% e o caso 3 a 29% (o teto de 130% dos conectores cobra o excedente).
- **Correção de custo:** a tabela anterior trazia custos de R$ 1.540, R$ 1.880 e R$ 2.730 que **não se reproduzem** com os parâmetros 0.5 (o preço do caso 3, R$ 5.371, sim). A diferença era de R$ 200 a R$ 790 e a origem não foi achada; os números acima vêm do configurador (299 verificações na v0.7). Parte do aumento das margens vem dessa correção. Não entram: implantação, WhatsApp, tarifas de banco e provedor, manutenção dos conectores e suporte específico do BPO.
- **Capacidade de IA:** no C2 a demanda dos eventos supera a do chat (estudo 6.5: 152% do Intensivo com 400 clientes e 10 usuários). Medir no piloto.
- Contra o mercado de BPO (R$ 1.500 a R$ 8.000 por empresa, **[a confirmar]**): 40 empresas a R$ 1.500 somam R$ 60 mil por mês; a plataforma custaria R$ 6.318 (11%). O custo de Open Finance de R$ 250 supõe 10 escritórios dividindo o piso de R$ 2.500.

---

## 10. Riscos jurídicos e regulatórios

**Parecer profissional (P12, respondida):** o parecer do contador ou do advogado do grupo antes do piloto é **recomendação, não bloqueio**. O sistema limita o risco por **confirmação e cartão de aprovação**: **nenhum pagamento sai sem aprovação humana registrada** (regra B3), também depois de qualquer promoção para o modo automático; pagar e transferir **nunca** são promovíveis.

| Tema | Risco e tratamento | Parecer |
| --- | --- | --- |
| **Responsabilidade técnica (C2)** | Assinar peça de outro sem revisão. NBC PG 01 itens 4 e 5 (b, c), lida em cópias não oficiais; Res. CFC 1.590/2020; bloqueio sem revisão registrada (4.4) | Contador **[a confirmar]** |
| **C1 e registro profissional** | BPO financeiro sem contabilidade prestar serviço que exija CRC; limite exato a ver; se escritura, é perfil B | Contador e advogado **[a confirmar]** |
| **Contrato e pagamentos** | Limite de responsabilidade por erro e fraude; alçadas anexas; M1 padrão; seguro do BPO | Advogado **[a confirmar]** |
| **LGPD** | Cadeia operador e suboperador; arts. 5º VI e VII, 37, 39, 42; guia da ANPD; acordo e lista (BPO-004) | Advogado **[a confirmar]** |
| **Procuração e certificado** | IN RFB 1.751/2017 (leitura secundária); cofre com trilha; BPO prepara e contratante transmite | Advogado **[a confirmar]** |
| **Contas bancárias de terceiros** | Consentimento com finalidade e validade; iniciação de pagamento exige participante autorizado; a plataforma **não inicia pagamento nem guarda senha**; regulação do Banco Central a ler | Advogado **[a confirmar]** |
| **Fraude e incidente** | Controles de 3.13; Res. CD/ANPD 15/2024, prazo de 3 dias úteis (fonte secundária) | Advogado **[a confirmar]** |
| **Cobrança em subconta** | Subconta no nome do cliente, em provedor autorizado; sem intermediar | Advogado **[a confirmar]** |
| **Cobrança e entrega** | Não reter documento por falta de pagamento (09, R6; NBC PG 01 item 4(l)) | Contador **[a confirmar]** |
| **ERP do cliente** | Termos do ERP e da API para terceiros e para escrita; credencial do cliente no cofre; erro de escrita no livro do cliente; mudança de API; o cliente paga o próprio ERP | Advogado **[a confirmar]**; condições de parceiro dos ERPs (8.3) |
| **App Store 4.2.6; registro do BPO no CRC** | Decisão de 8/11/2026: PWA primeiro, depois app único com seletor, app com a marca do contratante só na conta dele, cobrado (4.6); distribuição privada [a confirmar]; Google Play não lido; Res. CFC 1.555/2018 não lida | **[a confirmar]** |

---

## 11. Fases e ordem de construção

### 11.1 Etapas pequenas sobre as Fundações

A frente financeira depende do Financeiro 3a e 3b (09, FN1 a FN10).

| # | Etapa | Entrega | Depende de |
| --- | --- | --- | --- |
| **B1** | **Plataforma e pacotes** | Pacote e `servicos_contratados` no cliente; setor com `pacote_area`; visibilidade "pacote ∩ vínculo"; `inquilino.produto`; ficha do cliente no núcleo (item **Clientes** só no C1) | F1, F3, F11 |
| **B2** | **Titular no Financeiro** | `titular` nas entidades financeiras e na permissão (F1 a F3) | B1, FN3 |
| **B3** | **Item BPO, contextos, audit score e gestão por exceção** | Abas `aba.bpo.*` por cenário; contextos mãe e contratante; troca sem login; **audit score (semáforo por empresa) e visões por exceção desde a primeira versão** (5.2) | B1, F2 |
| **B4** | **Fundação do modo BPO** | BPO-001, 002, 003, 004, 006 | B3, F3 |
| **B5** | **Pedido, fila e SLA** | BPO-009, 010, 011, 022; `visibilidade`; bola; pausas | B4, 03 |
| **B6** | **Revisão técnica, marca e portal de convidado** | BPO-005, 007, 008; PWA por subinquilino; **portal de convidado do contratante** com teto de convidados (4.1.1) | B5, 06 |
| **B7** | **Perfil BPO, alçada, fornecedor** | Perfil BPO, `alcada_pagamento`, estado por serviço | B2 |
| **B7a** | **Conector de ERP financeiro** | Framework de conector de ERP, espelho com `origem`, `erp.ler`, `erp.lancar`, `erp.baixar`; Conta Azul e Omie (leitura e escrita, a confirmar), importação por arquivo (E2) para os demais; livro próprio (E3) para o cliente sem ERP | B7, 08 |
| **B8** | **Captura, fila e cartão** | Conta a pagar com etapas, lote, cartão no app e WhatsApp, `autorizar` com etapas | B7, B7a, FN9, 06, 04 |
| **B9** | **Conciliação e Open Finance** | FIN-004 e CTB-010 com titular empresa; no modo ERP a plataforma propõe e a baixa vai ao ERP | B7, B7a, FN10 |
| **B10** | **Execução do pagamento** | M1, depois M2 por banco | B8, B9 |
| **B11** | **Caixa, DRE, relatório, fechamento** | FIN-005, FIN-006, `bpo.mes_fechado` | B9 |
| **B12** | **Volume, faturamento, rentabilidade** | Medição, extrato, glosa; filtros no 05 | B5 ou B11, FN1 |
| **B13** | **Cobrança dos clientes do cliente** (**depois**: fase posterior, fora da ordem do B e do C1) | Subconta, termo, régua | B9, 08 |
| **B14** | **Carteira em bloco, encerramento, qualidade** | BPO-017, 019, 013, 020 | B5, B12 |

B1 a B3 valem para todos os perfis. **Ordem de construção e venda (P1, 8/11/2026):** primeiro o **B** (B1 a B3 e B7 a B11, com B7a), que é o BPO financeiro na **fase 3c**; depois o **C1** (as mesmas etapas, sem o pacote Contábil); por último o **C2** (B4 a B6 e B12 a B14), que fica depois. **B13 (cobrança dos clientes do cliente) fica para uma fase posterior, fora da ordem de construção do B e do C1** (decidido em 8/11/2026).

### 11.2 Ajustes pedidos às Fundações, 02 a 09 e ao estudo de precificação

O Plano (DA-02, DA-02.1) e o Desenho estão com a sessão-mãe; **não os edito**.

| # | Onde | Pedido |
| --- | --- | --- |
| A1 | Fundações 2.2 (Assinatura) | `pacotes_area` (pelo menos um), `modulos` da plataforma, `modo_bpo` derivado; núcleo obrigatório; `inquilino.produto`; **subinquilino sem assinatura nem produto próprios**: o BPO é o único que assina (P5); dependências **técnicas** (`exige`) separadas das **recomendadas, desmarcáveis** (`recomenda`) (P6); regra "não se cobra por aba nem por setor" (P8) |
| A2 | Fundações 4.1 (Setor) | `pacote_area`; fixos por pacote; `gestao_atendimento` e `financeiro_escritorio` da plataforma; `bpo` (modo BPO) e `bpo_financeiro` com equipe; responsável só em setor ativo |
| A3 | Fundações 4.2 (Cliente) | `servicos_contratados` ligado a pacote; **perfil por pacote** (perfil BPO versionado à parte); **estado do ciclo por serviço** (F5); `encerrado` só com todos os serviços encerrados |
| A4 | Fundações 3.1, 3.2 | **`titular` na tupla de permissão** (F1); `autorizar` consulta etapas já feitas (segregação) |
| A5 | Fundações 4, 6.5, 9.x do 09 | `titular` (`escritorio` ou `empresa`) em conta bancária, a pagar, a receber, lançamento, plano de contas, centros, regras, fornecedor e conexão; ferramentas `pagamento.*`, `alcada.*`, `fila.*`, `bpo.*`, `fornecedor.*` |
| A6 | Fundações 2.1, 2.5 | Contextos mãe e contratante; troca sem novo login (`sessao.trocar_contexto`); `escopo_mae`; chave de integrante com subinquilino |
| A7 | Fundações 2.3, 4.8, 4.10, 4.12, 6.4 | Conta de cliente com `alcada_pagamento` e áreas por pacote; tarefa com `bola`, `visibilidade` e `bloqueada_por` entre pacotes; credencial com `escopo_credencial`; cartão com dupla aprovação |
| A8 | Fundações 7, 10, 11 | Subpasta `Entregáveis/BPO financeiro`, visível a quem aprova pagamentos; tema por subinquilino; testes de dois contextos, de titular, de etapas e de boleto com instrução |
| A9 | 02 | Integrantes **BPO financeiro** (pacote) e **SLA e fila** (modo BPO); gatilhos `cartao.vencer_sem_resposta`, `sla.em_risco`; lista "nunca" de 6.3 |
| A10 | 03 | Navegação com um item por pacote; **ficha do cliente e legalização no Painel** (item **Clientes** só no C1); item BPO com nove abas, entre Financeiro e Configurações; seção 3.5 deixa de tratar BPO como perfil sem equipe |
| A11 | 04, 05, 06 | WhatsApp com código único; modos de contato por contratante; custo-hora do escritório único, que inclui todos os pacotes (gastos só com `titular escritorio`), com custo-hora por pacote como extra opcional, desligado por padrão, e BPO como filtro (Q7 corrigida em 8/11/2026; o detalhe por departamento fica dentro do extra); dimensões contratante e frente; app com seções por pacote e **Aprovações de pagamento**, PWA e app único com seletor (descartar GES-204 em lote) |
| A12 | 07, 08 | Alçada por faixa e soma por fornecedor; `banco.pagamento.*` (**a confirmar**); subconta; uma contratação de Open Finance para os dois titulares |
| A13 | **09** | Componente com `titular`; `custo_hora.propor` só com titular escritório (F3); contrato único com item por serviço e `metrica` de BPO; uma fatura e uma cobrança por mês, com linhas de Contábil e BPO, e NFS-e por serviço; Financeiro **exigido** pelo BPO sem cobrar o componente de novo (F7); FIN-201 em 3c |
| A14 | Estudo, `parametros.json`, `configurador.html` | **Feito na v0.6 (8/11/2026):** pacote BPO Financeiro com mensalidade-base R$ 390 e R$ 65 por empresa, conector de ERP no custo, produto sem Contábil (`nucleo_sem_contabil`), Financeiro contando os contratantes no modo BPO (P9), regra "sem dupla cobrança" (9.1), margem nos três níveis. Falta a seleção "produto" por pacote (núcleo e pacotes separados) |
| A15 | B10 e `atividades.json` | **Feito em 8/11/2026:** fases alinhadas (FIN-201 na 3c, BPO-017 na 4 com CIC-005; B10 igual ao JSON); FIN-003, FIN-004 e CTB-008 no catálogo da plataforma, com titular (a regra de titular fica nos adendos de 01 e 09) |
| A16 | **Fundações** (conectores, 6.5; entidades; segurança) | Família **`erp_financeiro`** no catálogo de conectores; credencial OAuth ou chave do cliente no cofre do escritório (por titular empresa), com `escopo_credencial`; `origem` e `versao_origem` nas entidades financeiras; ferramentas `erp.ler`, `erp.lancar`, `erp.baixar` com nível e evento; **fonte da verdade** por dado (3.0); texto vindo do ERP é dado (R4) |
| A17 | **Fundações** (papéis, 2.3; 4.1) | Papel **convidado do contratante** (portal do C2): sem assinatura e sem preço por usuário, com teto `convidados_max_por_contratante`; o subinquilino herda a assinatura do BPO; BPO-018 é acesso ao core do contratante, não ao nosso sistema |
| A18 | **Fundações** (invariantes, 1 e 7) | Invariante **B3**: nenhum pagamento sem aprovação humana registrada; `pagamento.liberar` e `pagamento.executar_api` fora da lista de ações promovíveis, mesmo depois de promoções; teste automático da invariante |
| A19 | **06 (App do cliente)** | PWA primeiro; **Aprovações de pagamento** como primeira tela do sócio no PWA (independe de loja); app único com seletor depois; app com a marca do escritório na conta dele como opção cobrada; regra 4.2.6 registrada em 11.3 (**feito**); portal de convidado do contratante como variante do app para escritório |
| A20 | **09 (Financeiro)** | Com ERP, as entidades da empresa são **espelho** (`origem`) e somente leitura na plataforma; a escrita é comando `erp.*`; conciliação **propõe** e a baixa vai ao ERP; DRE e fluxo calculados sobre o espelho; o Financeiro é dependência técnica do pacote BPO (espelho e conciliação), sem cobrar o componente de novo; custo-hora só com titular escritório; no modo E3 as entidades são nativas; FIN-201 em 3c; contagem de clientes do Financeiro no modo BPO = contratantes (P9) |
| A21 | **08 (Conectores)** | Catálogo de ERPs financeiros (8.3), limites de chamadas, consulta periódica onde não há webhook, janela de sincronização, condições de parceiro (**a confirmar**) |

### 11.3 Fases do catálogo

O JSON e B10 divergiam em BPO-005 (JSON 1, B10 0), BPO-017 (5 e 1), BPO-019 e BPO-020 (2 e 1); vale o JSON, com duas mudanças: **BPO-017 antecipada** (única forma de entrar um contratante) e **FIN-201 antecipada da fase 5 para a 3c**, depois do Financeiro 3b (sem ela o B e o C1 não existem). **Aplicado em 8/11/2026 (A15):** no `atividades.json`, FIN-201 foi da fase 5 para a **3** (3c) e BPO-017 da 5 para a **4**, com CIC-005, de que depende; no B10, as fases das fichas divergentes foram alinhadas ao JSON. O mapa HTML lê o JSON e não foi regerado. **Os conectores de ERP financeiro (B7a) entram na fase 3c**, com o pacote BPO financeiro; **a ordem é B, depois C1, depois C2** (P1).

### 11.4 Perguntas para aval

Todas as 15 têm resposta do usuário (8/11/2026). Seguem a hipótese: P2, P4, P7, P13 e P15; as demais mudaram a hipótese. A segunda rodada do UI lab abriu onze perguntas novas (seção 12): **nove respondidas em 8/11/2026** (seis seguem a hipótese de mercado; Q6, Q8 e Q9 mudaram) e duas (Q10 e Q11) que são de engenharia e limitação do wireframe.

| # | Pergunta | Situação | Decisão adotada |
| --- | --- | --- | --- |
| **P1** | Qual vender primeiro: BPO financeiro ou BPO para escritórios? | **Respondido, com mudança** | 1º contabilidade pura com BPO adicionado (B); 2º BPO puro (C1, BPO financeiro); o BPO entre escritórios (C2) fica depois |
| **P2** | O BPO financeiro sai da fase 5 para depois do Financeiro 3b? | **Respondido: segue a hipótese** | Sim, fase 3c |
| **P3** | O BPO usa o nosso livro financeiro ou lê o ERP do cliente? | **Respondido, com mudança** | "Copie o mercado. **ERP do cliente.**" Padrão: o BPO trabalha no ERP que o cliente já usa, por API ou arquivo; a plataforma orquestra; livro próprio é opção (3.0, 8.3) |
| **P4** | Modo de pagamento padrão? | **Respondido: segue a hipótese** | **M1**: o cliente libera no banco |
| **P5** | Quem é o contratante e quem são os usuários? | **Respondido, com premissa corrigida** | O contratante é **cliente do BPO** e recebe um **portal de convidado**; quem usa o sistema o contrata por conta própria. Convidados **sem preço por usuário**; teto de abuso de 10 por contratante, editável, não é cobrança. Apagado o "cinco incluídos por subescritório" (4.1.1, 9.1) |
| **P6** | CRM, Timesheet, App e Financeiro são opcionais? O BPO os exige? | **Respondido, com mudança** | O BPO pode exigir Timesheet, App e Financeiro por padrão, mas o sistema é modular: **só as dependências técnicas reais são obrigatórias**; as demais são "recomendadas, desmarcáveis" (9.1) |
| **P7** | Faixas de alçada de exemplo (R$ 2 mil, R$ 20 mil)? | **Respondido: segue a hipótese** | Sim, editáveis por empresa |
| **P8** | O pacote Contábil tem preço único com setor desativado? | **Respondido** | Sim. **Os módulos são opcionais, as abas não; tudo o que vem num módulo está incluído. Não se cobra por aba nem por setor** (9.1) |
| **P9** | No modo BPO, o Financeiro conta contratantes ou clientes finais? | **Respondido** | Os **8 contratantes**. O escritório do BPO repassa o valor aos clientes dele, se for o caso. Os clientes do escritório do BPO (C2) são só os contratantes |
| **P10** | App do contratante nas lojas só pela conta dele? | **Respondido, verificado** | A regra 4.2.6 rejeita apps de modelo comercial salvo envio pelo dono do conteúdo; caminhos: conta do cliente, app único multi-cliente, distribuição privada [a confirmar]; **sem atalho garantido**. **PWA primeiro**, depois app único com seletor, app com marca na conta do cliente como opção cobrada (4.6; 06, 11.3) |
| **P11** | O que é o Luana? | **Respondido** | É a **Sofia** (usesofia.com), estudada em S5 e na 3.15 |
| **P12** | Pareceres da seção 10 antes do piloto? | **Respondido** | Parecer do contador ou do advogado do grupo é **recomendação, não bloqueio**. **Invariante B3:** nenhum pagamento sai sem aprovação humana registrada, também depois da promoção de outras ações; pagar e transferir nunca são promovíveis (1.3, 10) |
| **P13** | Quem responde por erro de pagamento? | **Respondido: segue a hipótese** | BPO, pela execução; cliente, pelo que aprovou; plataforma, por falha do sistema |
| **P14** | Qual o preço do pacote BPO financeiro? | **Respondido** | Duas partes: **mensalidade-base por escritório** (o acesso, que aumenta a assinatura) e **valor por empresa incluída**, acima dos R$ 18 de hoje. Teste: **R$ 390 + R$ 65 por empresa**, calibrado pela Sofia (teto) e pelo BPO Suite (9.1 a 9.3) |
| **P15** | Cada serviço do cliente tem estado de ciclo próprio? | **Respondido: segue a hipótese** | Sim (F5) |


**Pendências externas:** ler a IN RFB 1.751/2017, a Res. CD/ANPD 15/2024, a regulação de iniciação de pagamento e a regra do Google Play; **confirmar as condições de API dos ERPs financeiros (Conta Azul, Omie, Bling, Nibo, Granatum; 8.3), a escrita e as condições de parceiro**; descobrir quais bancos têm API de pagamento para terceiros; medir o custo de IA e do conector de ERP por empresa BPO; confirmar subcontas em provedores; **confirmar a distribuição privada da Apple (Apps Personalizados)**; recomendado: parecer do contador ou advogado do grupo antes do piloto (P12).

---

## 12. Perguntas da segunda rodada do UI lab: respostas finais (8/11/2026)

O wireframe do BPO (UI lab, segunda rodada) não provava onze pontos. O usuário respondeu em 8/11/2026: disse que **não entendeu várias das perguntas de BPO e que, se estiverem baseadas no mercado, está tudo certo**. Por isso as hipóteses de mercado viraram decisão (Q1 a Q5 e Q7); as respostas dele mudaram **Q6, Q8 e Q9**; Q10 e Q11 não eram perguntas ao usuário. As decisões já estão no corpo (3.0, 3.5 a 3.9, 5.2, 7.1, 7.3) e em Fundações 2.3, 06, 09 e Desenho 1.10.

| # | Pergunta | Resposta | Onde pesa |
| --- | --- | --- | --- |
| **Q1** | **Auditoria do BPO:** critérios, pesos e frequência | **Respondido: segue a hipótese (padrão de mercado).** Critérios e pesos **fixos do sistema**, recalculados **a cada sincronização e uma vez por dia**; o **Gestor ajusta os pesos** na Configuração | 5.2, `bpo.audit_score` |
| **Q2** | **Espelho do ERP:** frequência, credencial e ERP sem escrita | **Respondido: segue a hipótese (padrão de mercado).** Leitura **a cada 15 minutos**; credencial **no cofre do escritório**; sem escrita, a **baixa manual conta no SLA** com a marca "manual" | 3.0, 3.4, 8.3 |
| **Q3** | **Lote:** janela e cartão expirado | **Respondido: segue a hipótese (padrão de mercado).** Janela **fixa, configurável por empresa** (padrão 9h); cartão expirado nunca paga e escala: **9h** cartão ao aprovador designado; **+4 h** lembrete; **+8 h** (ou abertura do dia útil seguinte) **substituto cadastrado**; **véspera do vencimento** da conta mais próxima, alerta ao **Gestor do BPO e ao sócio** com a lista; **vencido sem aprovação**, só alerta e empresa vermelha na auditoria. **Premissa de mercado** (decidida pela sessão-mãe, 8/11/2026) | 3.5, 3.6 |
| **Q4** | **Alçada:** divergência e ausência na aprovação reforçada | **Respondido: segue a hipótese (padrão de mercado).** Vale **a menor**; na aprovação reforçada, se um dos dois está ausente, entra o **substituto cadastrado**, nunca alguém do BPO | 3.7, 3.9 |
| **Q5** | **M2 e M3:** teto delegado | **Respondido: segue a hipótese (padrão de mercado).** **M3 fora da primeira versão**; só M1 e M2 até haver parecer jurídico. O M3 fica descrito e desligado (3.4, 3.7) | 3.4, 3.7, 10 |
| **Q6** | **Faturamento:** honorário e excedente na mesma fatura da contabilidade? | **Respondido (mudou a hipótese).** Cliente que paga BPO e contabilidade: **uma fatura e uma cobrança só por mês** (um boleto ou Pix, lançamento conjunto), **serviços em linhas separadas**; **as diferenças ficam nas notas**: cada serviço respeita a própria tributação, e as NFS-e saem **por serviço** (**uma NFS-e por serviço** como padrão; o **layout nacional decide** se vários itens cabem numa nota **[a confirmar na NT 007/2026]**). O excedente nasce com o ok de uma pessoa | 7.3; 09, 4.5 e 5.5 |
| **Q7** | **Custo-hora no BPO** | **Respondido (ajustado em 8/11/2026).** **Custo-hora do escritório único**, que inclui todos os pacotes; **por pacote é extra opcional**, desligado por padrão; o **BPO é filtro** (chip "Pacote: Contábil \| BPO \| Todos") nas telas do Timesheet e da Rentabilidade | 7.1, 7.4; 05, 8.4 e adendo 19 |
| **Q8** | **Mesmo contato, dois pacotes** | **Respondido (mudou a hipótese).** Se a empresa do João Batista faz BPO e contabilidade, **pelo mesmo app, com o mesmo acesso, ele controla tudo**: **um só app e um só acesso**; **papel e áreas por serviço contratado**, somados na mesma tela. A Conta de cliente passa a ter a chave (pessoa, cliente, serviço) | 3.9; Fundações 2.3; 06, 2.3 e 2.4 |
| **Q9** | **Suporte da plataforma:** como diagnostica um problema | **Respondido (mudou a hipótese).** O agente de suporte (Ajuda do sistema) pode **acessar, só em leitura, configurações, dados e estrutura do escritório dentro das permissões da pessoa que perguntou**, para procurar o que está errado, **sem alterar nada sem aprovação dela** (correção vira cartão de aprovação). Se não resolver, a equipe pode pedir para **ver a tela dela, com pedido prévio**, consentimento, prazo e registro | Desenho 1.10; Fundações, adendo 26; 02, 03 e estudo |
| **Q10** | **Persistência, tempo real e offline do app** | **Decisão de engenharia da stack, não do usuário.** Lacuna para a fase de stack (PWA com fila local e reenvio, push, atualização em tempo real) | 06; escolha de stack |
| **Q11** | **Blocos do Painel por cliente** | **Limitação do wireframe, sem pergunta:** os blocos específicos usam dados de exemplo | 03, 6 |

Também seguem a hipótese, por não terem sido objetadas, três divergências levantadas pela sessão-mãe: o BPO de uma pessoa só tem a conferência do **Gestor do escritório** ou, na falta, do **cliente na aprovação** (3.8); quem altera a alçada de uma empresa **não aprova pagamento nessa empresa** e a mudança vai ao aceite do cliente no app (3.8, 3.9); o papel por serviço contratado exige mudar a chave da Conta de cliente (Q8).

## 13. Adendo: respostas finais do BPO, faturamento e suporte (8/11/2026)

Resumo do que mudou a partir das respostas do usuário; o detalhe está no corpo e na seção 12.

- **M3 fora da primeira versão:** só M1 e M2; o M3 segue descrito e desligado, e a invariante B3 vale sem ele.
- **Notas por serviço:** o faturamento conjunto é uma cobrança por mês; o que varia por serviço (tributação, código, NFS-e) fica nas notas (7.3). O Financeiro (09, 4.5 e 5.5) emite a NFS-e por serviço.
- **Um acesso, papel por serviço:** a linha **BPO financeiro** da Conta de cliente carrega alçada, `pagamentos_aprovar` e `relatorio_bpo`; a linha **Contábil** carrega as áreas da contabilidade. O app soma as áreas das linhas (06, 2.4).
- **Suporte lê, não escreve:** o assistente de ajuda diagnostica em leitura dentro do escopo de quem perguntou; correção é cartão de aprovação (Fundações, adendo 26).

## 14. Adendo: últimas decisões (8/11/2026)

- **Escalonamento do lote** (3.6 e Q3): 9h cartão ao aprovador designado; +4 h lembrete; +8 h (ou abertura do dia útil seguinte) ao substituto; véspera do vencimento, alerta ao Gestor do BPO e ao sócio com a lista; vencido sem aprovação, só alerta e empresa vermelha na auditoria. **Premissa de mercado**, decidida pela sessão-mãe; o usuário não opinou.
- **Custo-hora (Q7):** único do escritório, incluindo todos os pacotes; por pacote é extra opcional, desligado por padrão; BPO é filtro ("Pacote: Contábil | BPO | Todos") no Timesheet e na Rentabilidade (05, adendo 19).
- **NFS-e:** o layout é o nacional, o mesmo em toda a federação. **Uma NFS-e por serviço** é o padrão; `nfse_por_servico` (09, 5.5) fica como chave para quando o layout confirmar vários itens por nota **[a confirmar na NT 007/2026]**. A fatura e a cobrança seguem únicas, com linhas por serviço.
- **Quem edita a alçada (N2):** quem tem papel `socio` na linha `bpo_financeiro` da Conta de cliente da empresa; hipótese mantida pelo usuário. **Suporte:** a Ajuda tem FAQ, depois o assistente, depois a equipe (Fundações, adendo 27).

## Adendo: integrantes do BPO por função (UI lab, 8/11/2026)

Decisão do usuário no UI lab: o BPO financeiro passa a ter **um integrante por função**: **Contas a Pagar, Contas a Receber, Conciliação e Gerencial**, mais o **Atendimento**. Os setores de integrante são `bpo_pagar`, `bpo_receber`, `bpo_conciliacao` e `bpo_gerencial`; o setor do escritório continua `bpo_financeiro` e **vê os quatro**. Isso substitui, no 10 (seção 6) e no 02 (integrantes padrão), o integrante único do BPO. Regras que continuam: o integrante de Contas a Pagar só prepara; nenhum pagamento sai sem aprovação humana registrada; quem digita não confere.

## Adendo: itens do painel do Leandro aprovados (9/11/2026)

Decididos na [Lista de decisão do painel do Leandro](../Lista_de_Decisao_Painel_do_Leandro.md) (de acordo com o Enzo). **Regra:** entram **agentificados**, como integrantes do time que agem por gatilho, perguntam só a dúvida, preparam no cartão de aprovação e aprendem com a decisão da equipe; não como cópia das rotinas e telas do painel dele. Nada sai ao cliente sem aprovação humana no início. Detalhes de cada item ("Como fica agentificado") estão na lista.

| Itens | O que entra |
| --- | --- |
| D-11, D-13 | O leitor de extratos robusto e as regras aprendidas por favorecido servem à leitura de extrato do BPO. |
