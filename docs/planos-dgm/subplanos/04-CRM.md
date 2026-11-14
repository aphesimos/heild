# Subplano 04 · CRM e multiatendimento

**Versão 0.1 · 7/11/2026 · documento de desenho funcional, anterior a design visual e stack.**

Detalha a seção 3 (CRM) do [Desenho do Sistema](../Desenho_do_Sistema.md) (v0.3) e o chat do app (seção 7) sobre as entidades do [Subplano 01 · Fundações](01-Fundacoes.md) (4.3 a 4.5, 4.9, 4.10, 5.4, 6, 8, 13 e 14). Usa o integrante de Atendimento e os gatilhos do [Subplano 02](02-Time-de-Agentes.md) (3, 7, 9, 12), a navegação lateral do [Subplano 03](03-Painel.md) (2.0, 6.10), a [pesquisa S3](../../pesquisa/plataforma/S3-conexao-whatsapp.md) (conexão com o WhatsApp) e a seção 6.2 do [Plano da Plataforma](../Plano_Plataforma_do_Escritorio.md). As decisões da seção 10 do Desenho são definitivas: um número de WhatsApp por setor, sem filas, repasse e transferência, mensagem automática enquanto ninguém assume, e-mail desde a primeira versão, lead só pelo WhatsApp, CRM como item lateral com as abas Conversas · Leads · Comunicados · Configuração dos números.

Convenções:

- IDs como GES-023, CTB-003 e CON-001 são os do [catálogo de atividades](../../pesquisa/plataforma/atividades.json). Um script sobre o arquivo listou as atividades de **Gestão e Atendimento** com fase 0 a 2 que cabem aqui: GES-023, 024, 025, 026, 027, 029, 030, 031, 033, 034, 035, 036, 037, 040, 041, 044, 104, 105, 108, 203, 405, 406. GES-042 (funil), GES-043 (retenção) e GES-038 (NPS) estão em fase 3 no mapa, mas o Desenho traz leads e satisfação para o CRM, e este documento os desenha. De outros setores, com texto que cita WhatsApp, atendimento, cobrança de documento ou comunicado, em fase 0 a 2: CTB-002, 003, 004, 006, 028, 201; NFE-012, 019, 037, 038; DP-001, 002, 007, 009, 012, 019, 021, 024, 026; FIS-010, 016, 031, 032, 045; SOC-009, 034; CON-001, 002; CIC-007, 009; BPO-008, 009, 022; PF-004.
- "Atendente" é qualquer Colaborador ou Gestor com o setor. "Integrante de Atendimento" é o agente do setor Gestão e Atendimento (02, 3.2). "Caixa" é a aba Conversas.
- Nenhum fornecedor de WhatsApp, e-mail, transcrição ou assinatura é escolhido aqui.

---

## 1. Escopo e princípios

### 1.1 O que o CRM entrega

1. A caixa de conversas de todos os canais, ligada ao cadastro único e às tarefas.
2. Números e caixas por setor, conexão oficial ao WhatsApp (coexistência), templates e janela de 24 h.
3. O fluxo da conversa: assumir, repassar, transferir, resolver, aguardar, etiquetar, virar tarefa, cobrar.
4. Quem escreve (identidade → pessoa → cliente ou lead) e o número desconhecido.
5. O pipeline de leads até o contrato, que cria o Cliente e dispara a implantação.
6. Comunicados segmentados e réguas.
7. As ações de IA, cada uma como ferramenta com nível.
8. O tempo de atendimento no timesheet e as métricas.
9. O chat do app como o mesmo fio.
10. A decisão de base e a ordem de construção.

Não entrega: tela do app (06), motores (07), cobrança de honorários (Financeiro, fase 3; aqui só a régua), telefonia (GES-033 fica como registro manual).

### 1.2 O que vem das Fundações

| Precisa de | Fundações | Uso no CRM |
| --- | --- | --- |
| Setor com `numero_whatsapp_id` e `responsavel_padrao_id` | 4.1 | Um número por setor |
| Pessoa, Identidade (`opt_in_whatsapp`), Conta de cliente (`papel_cliente`, `areas`) | 2.3, 4.3, 4.4 | Reconhecer quem escreve; quem recebe o quê |
| Lead e pipeline | 4.9 | Aba Leads |
| Canal, Conversa, Mensagem, fio único, transferência com aviso | 4.10 | Toda a caixa |
| Documento com `setor_id`; Tarefa com `aguardando_cliente` | 4.11, 4.8, 14 | Anexos; virar tarefa; régua |
| Sessão de trabalho | 5.4 | Atendimento conta tempo |
| Gatilhos `mensagem.receber`, `conversa.sem_resposta_24h` | 5.7 | Integrante de Atendimento |
| Ferramentas `conversa.*`, `identidade.resolver`, cartão | 6.4, 6.5 | Cada botão da caixa |
| Notificações com opt-in e template fora da janela | 8 | Avisos ao atendente e ao cliente |
| Tema: `modelos_texto`, `nome_whatsapp_exibido`, `remetente_email` | 10 | Mensagens automáticas, régua, remetentes |

### 1.3 Regras herdadas

| # | Regra | Consequência no CRM |
| --- | --- | --- |
| H1 | Tudo é ferramenta | Assumir, responder, transferir e resolver são `conversa.*`; a caixa é declarada como lista de ferramentas; o chat e os integrantes fazem o mesmo com a mesma permissão |
| H2 | Toda ação gera evento e tempo | Assumir abre sessão de trabalho; resolver, repassar ou inatividade encerra (seção 9) |
| H3 | Conteúdo de cliente é dado | Mensagem, e-mail, áudio transcrito e anexo chegam com `origem_externa = true`, envolvidos antes de qualquer modelo; pedido dentro de mensagem vira no máximo proposta com cartão |
| H4 | Tema | Mensagens automáticas, régua, nome exibido no WhatsApp e remetente de e-mail vêm do tema; nada fixo |
| H5 | Agente nunca excede o usuário | O integrante de Atendimento responde só o que a conta de cliente daquela pessoa pode ver |
| H6 | Nada se apaga | Mensagem apagada ou editada pelo cliente fica com a versão anterior (GES-203); conversa não se exclui, resolve-se |
| H7 | Permissão por setor | Quem tem o setor vê as conversas do setor; de outro setor, só após transferência |
| H8 | Nenhum módulo envia por conta própria | Toda saída ao cliente passa por `conversa.responder` ou `notificacao.publicar`; fora da janela, só template aprovado |

---

## 2. O padrão do mercado

Pesquisa de 7/11/2026 em páginas públicas de Digisac, Kommo, RD Station Conversas (ex-Tallos), ChatGuru, Chatwoot e Zenvia, e de ferramentas correlatas que a busca trouxe (B2Chat, Zendesk Chat, Live Helper Chat). As centrais de ajuda de Kommo, Zenvia, RD e Chatwoot não abriram nesta sessão; o que segue vem dos trechos indexados e das páginas de produto. ChatGuru só apareceu pela S3 (parceira oficial; transcreve e resume áudio).

### 2.1 O que todos têm

| Conceito | Nome mais comum | Como funciona | Fonte |
| --- | --- | --- | --- |
| Canal ligado a um grupo | **Departamento** ou **setor** (Digisac, Zenvia, B2Chat, Zendesk); **time** (RD, Chatwoot); **caixa de entrada** (*inbox*, Chatwoot) | O número ou a caixa de e-mail pertence a um departamento; a Zenvia exige canal "atribuído a um departamento" | [Zenvia KB](https://zenvia.movidesk.com/kb/en/article/503710/transfer-contacts-to-sales-support-in-whatsapp-broadcasts-zcc), [B2Chat](https://help.b2chat.io/en/what-are-departments), [Zendesk](https://support.zendesk.com/hc/pt-br/articles/4408845596698-Como-configuro-ou-altero-o-departamento-de-um-chat) |
| Quem atende | **Atendente**, **operador**, **agente** | Várias pessoas no mesmo número; um responsável por vez | Todas |
| Chegada a alguém | **Distribuição** ou **atribuição**: manual ("pegar"), automática por departamento ou responsável, rodízio, carteira; **limite por pessoa** | Digisac: "distribua conversas de acordo com o departamento ou responsável"; RD: "filas de espera", "distribuição automática", "limitar o número de atendimentos por pessoa"; Chatwoot: *auto-assignment* e capacidade por agente | [Digisac](https://digisac.com.br/), [RD](https://www.rdstation.com/produtos/conversas/atendimento-ao-cliente/), [Chatwoot](https://www.chatwoot.com/use-cases/support-desk) |
| Estados | **Aberta**, **pendente** (bot ou sem atendente), **adiada** (*snoozed*), **resolvida** | Chatwoot: `open`, `pending`, `snoozed`, `resolved`; adiada reabre na próxima mensagem; Zenvia pede **motivo do encerramento** | [Chatwoot API](https://developers.chatwoot.com/api-reference/conversations/toggle-status.md), [Zenvia](https://zenvia.com/customer-cloud/atender-melhor/) |
| Passar adiante | **Transferir** para outro atendente ou departamento; pode disparar bot ou mensagem ao cliente | Zenvia: "transfira a conversa para outros usuários"; Live Helper Chat executa o bot do destino; Digisac usa resumo de IA na transferência | [Zenvia](https://zenvia.com/customer-cloud/atender-melhor/), [LHC](https://doc.livehelperchat.com/docs/department-transfer), [Digisac IA](https://digisac.com.br/solucoes/ia) |
| Mensagens automáticas | **Saudação**, **fora de horário**, **espera**, **transferência**, **encerramento**, **feriado**, **pesquisa de avaliação** | Digisac tem blocos de feriado e de avaliação; todas têm horário de atendimento | [Digisac](https://digisac.com.br/solucoes/chatbot) |
| Organização | **Etiquetas** em conversa e contato | RD: "Etiquetas Inteligentes" por tema e urgência, inclusive na transferência; Chatwoot: etiquetas entre times | [RD blog](https://www.rdstation.com/blog/conversacional/novidades-imperdiveis-no-rd-station-conversas/), [Chatwoot](https://chatwoot.com/hc/user-guide/en/categories/features-explained) |
| Texto pronto | **Respostas rápidas** ("/") e **modelos** (*templates*) aprovados pela Meta | Todas | S3 |
| Prazo | **SLA** de primeira resposta e de resolução, pausado fora do horário | Chatwoot: políticas de SLA nos planos pagos; Zenvia: "até 2 h para primeira resposta, 12 h para críticos" | [Chatwoot](https://www.chatwoot.com/use-cases/support-desk), [Zenvia preços](https://zenvia.com/precos/) |
| Triagem | **Chatbot** ou **menu** de departamentos; **transbordo** para humano; conversa com bot começa "pendente" | B2Chat, SocialHub (palavra-chave e intenção), Zenvia ("primeira triagem pelo bot"), Chatwoot | [B2Chat](https://help.b2chat.io/en/what-are-departments), [SocialHub](https://www.socialhub.pro/blog/configurar-transferencia-automatica-conversa-departamentos/) |
| Bastidor | **Nota interna** e **menções** | Chatwoot, Kommo | [Chatwoot](https://chatwoot.com/hc/user-guide/en/categories/features-explained) |
| Venda | **Funil** em quadro, lead ligado à conversa | Kommo, "CRM conversacional" | [Kommo](https://www.kommo.com/br/whatsapp/caixa-de-entrada-unificada-com-whatsapp/) |
| Medição | Conversas por atendente e departamento, primeira resposta, resolução, CSAT ou NPS | Todas | |
| IA | Resumo, sugestão de resposta, transcrição de áudio, agente que atende e transfere | Digisac, ChatGuru | [Digisac](https://digisac.com.br/solucoes/ia), S3 |

### 2.2 O que o nosso CRM usa, com os nomes do mercado

| Mercado | No nosso CRM | Diferença |
| --- | --- | --- |
| Departamento | **Setor** (o das abas; Fundações 4.1) | Não é criado no CRM; já existe e dá a permissão |
| Fila, distribuição, rodízio | **Lista "sem responsável"** do setor | Sem filas: quem assume, atende; o integrante propõe repasse quando ninguém assume |
| Pegar, atribuir | **Assumir**, **repassar** (mesmo setor), **transferir** (outro setor) | Transferir muda o número e avisa o cliente |
| Pendente (bot) | **Nova** (o integrante responde o factual) | |
| Adiada | **Aguardando cliente**, **aguardando interno** (com tarefa) | "Aguardando interno" liga o CRM ao Painel |
| Encerrada com motivo | **Resolvida** (resolvida, transferida, sem resposta, spam) | |
| Etiquetas, respostas rápidas, modelos, notas, SLA, horário, avaliação | Mesmos nomes | |
| Chatbot de triagem | **Triagem automática** pelo integrante; menu só para número desconhecido | A triagem lê o cadastro: sabe quem escreve antes de perguntar |
| Funil | **Leads** (quadro) | Fechar contrato cria o Cliente |
| Contato | **Pessoa** do cadastro único | Não há "contato do CRM" |

---

## 3. Canais e números

### 3.1 Um canal por setor

| Canal | Como se liga ao setor | Quem entra |
| --- | --- | --- |
| **WhatsApp** | Um número por setor com equipe. O do **Gestão e Atendimento** é o **número principal**: site, cartão, leads | Clientes e leads (só aqui) |
| **E-mail** | Uma caixa por setor (`fiscal@`, `dp@`) ou uma caixa única (`contato@`) no Gestão e Atendimento, que a triagem transfere; as duas convivem (GES-027) | Clientes, órgãos, fornecedores |
| **Chat do app** | Sem número; entra no setor da conversa aberta, ou no Gestão e Atendimento | Só clientes com conta (Desenho 7.1) |
| **Formulário do site** | Gestão e Atendimento; lead com origem `site` | Leads |

Regras:

1. **Escritório com um número só** usa o número no Gestão e Atendimento e transfere para os outros setores. Não existe setor "Geral" (Desenho 3.1); como os setores são fixos (Fundações 4.1), o papel é do Gestão e Atendimento.
2. **Setor sem número próprio** usa o principal (`numero_whatsapp_id` nulo). Transferir para ele mantém o cliente no mesmo número; muda o setor da conversa e quem a vê.
3. **Mensagem que chega num número** vai para a conversa aberta daquela pessoa naquele setor; sem conversa, abre `nova`. Se dois setores compartilham o número e há conversa aberta nos dois, a triagem (8.1) escolhe pelo assunto; empate vai para a de última mensagem, com aviso e botão **mover mensagem**.
4. **Cliente que insiste no número antigo após transferência**: a mensagem abre conversa nova na origem; a triagem reconhece a continuação e propõe transferir de novo em um clique; na terceira vez o integrante responde com o número certo (modelo do tema).
5. **Grupos de WhatsApp** não entram (coexistência não os sincroniza). GES-037: a plataforma dá o modelo de comunicado dos números oficiais e a lista de clientes sem opt-in.

### 3.2 A tela Configuração dos números

Quarta aba do item CRM, chamada **Números** no wireframe do UI lab (decisão de 7/11/2026). Administrador; o Gestor configura o próprio setor (10.1). É do escritório (sem seletor de cliente) e não conta tempo: não entra em modo de espera por inatividade (Fundações 2.5).

```
┌─ CRM › Configuração dos números ───────────────────────────────────────────┐
│ Empresa na Meta: verificada ✔ · limite atual: 2.000 conversas/24 h · qualidade: alta│
├────────────┬──────────────────┬───────────┬──────────┬───────────┬────────┤
│ Setor      │ WhatsApp         │ Conexão   │ Status   │ E-mail    │ Ações  │
├────────────┼──────────────────┼───────────┼──────────┼───────────┼────────┤
│ Gestão e   │ +55 11 9xxxx-0001│ Cloud API │ ativo    │ contato@  │ ⋯      │
│ Atendimento│ (principal)      │ coexist.  │ app ok   │           │        │
│ Fiscal     │ +55 11 9xxxx-0002│ Cloud API │ ativo    │ fiscal@   │ ⋯      │
│ DP         │ +55 11 9xxxx-0003│ Cloud API │ app sem  │ dp@       │ ⋯      │
│            │                  │ coexist.  │ abrir 12d│           │        │
│ Contábil   │ — usa o principal│           │          │ —         │ + número│
│ Consultoria│ — usa o principal│           │          │ —         │ + número│
├────────────┴──────────────────┴───────────┴──────────┴───────────┴────────┤
│ [Horário de atendimento por setor] [Mensagens automáticas] [Modelos (templates)]│
│ [SLA por setor] [Etiquetas] [Respostas rápidas] [Modo experimental ⚠]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

Cada linha é um **Canal do escritório** (Fundações 4.10). O detalhe do número mostra nome exibido (tema), foto, horário, mensagem automática, estado da coexistência (a Meta exige abrir o app a cada 14 dias, S3), qualidade e limite (GES-031), templates, e os botões **conectar** (Embedded Signup com coexistência) e **migrar** (de provedor ou do modo experimental). Tudo é `canal.configurar` (executar, Administrador) e `canal.verificar_saude` (ler).

**Verificação da empresa**: a tela mostra se o portfólio está verificado e o que falta, porque disso dependem os limites de envio (250 → 2.000 → 10 mil, S3). Sem verificação, o Comunicados avisa o teto antes de enviar.

### 3.3 Janela de 24 h e templates

| Situação | O que a plataforma faz |
| --- | --- |
| Cliente escreveu há menos de 24 h | Texto livre por `conversa.responder` |
| Fora da janela, atendimento (guia saiu, documento faltando) | `conversa.responder` recusa texto livre e oferece o template de **utilidade** com variáveis preenchidas; o atendente confirma |
| Fora da janela, comunicado | Template de **marketing** ou **utilidade** conforme o conteúdo, só com `opt_in_whatsapp` (7) |
| Template não aprovado ou pausado | Ação desabilitada com o motivo; "em aprovação" no Comunicados |

A biblioteca de **Modelos** (GES-029) é entidade por escritório: nome, categoria da Meta, idioma, texto com variáveis nomeadas, status na Meta (rascunho, enviado, aprovado, rejeitado com motivo, pausado), números em que vale, versão. Cada evento do sistema tem um modelo padrão do tema (guia emitida, documento faltando, prazo chegando, etapas da régua, satisfação, espera, fora de horário, transferência). O escritório edita; a plataforma submete (`modelo.submeter`, Administrador) e acompanha (`modelo.status`). Respostas rápidas são lista interna, sem a Meta, com atalho "/".

### 3.4 Provedor abstraído

A caixa não conhece a Meta. Fala com uma **interface de provedor**, com evento em cada operação: **receber** (webhook → mensagem normalizada com `id_externo`, identidade, tipo: texto, áudio, imagem, documento, botão, reação, apagada, editada), **enviar** texto, mídia, template ou botões (→ `id_externo`), **status de entrega** (enviada, entregue, lida, falhou), **baixar mídia** (a URL da Meta vale 5 min; baixa na hora para `documento.registrar`), **templates** (listar, submeter, status), **saúde do número** (qualidade, limite, coexistência), e, opcionais, marcar lida e "digitando".

Implementações: **Cloud API direto** (padrão), **provedor** (360dialog, Gupshup, Z-API, quando o escritório já tem contrato), **não oficial** (3.5), **e-mail** (IMAP ou API do Gmail e do Microsoft 365, sem template e sem janela), **chat do app**. A Evolution API é a referência de um contrato que serve Cloud API e Baileys (S3). Trocar de provedor é trocar a implementação do Canal; conversas e mensagens não mudam.

### 3.5 Modo não oficial, experimental

Ligado só pelo Administrador, por número, atrás de um aviso aceito por escrito (evento): banimento sem aviso, violação dos termos, sem opt-in auditável; o histórico fica no CRM e a migração para coexistência é um clique. Regras fixas: nunca envia fora da janela de 24 h nem comunicado (o Comunicados mostra "indisponível neste número"); o número aparece como "experimental" em todas as listas. Como na S3: existe para o escritório que não quer pagar antes de ver valor, não como padrão.

### 3.6 Áudio

Todo áudio é transcrito na chegada (`mensagem.transcrever`, executar, custo barato, fornecedor abstraído; centavos por minuto, S3). A transcrição fica em `mensagem.transcricao`, marcada "gerada"; o atendente lê e pode ouvir. Falha mostra "transcrição indisponível" e tenta de novo em 5 min. A busca inclui a transcrição.

---

## 4. A caixa de conversas

### 4.1 Lista

Primeira aba do item CRM. O CRM **não usa o seletor de cliente do topo** (decisão do UI lab, 7/11/2026): a lista tem o **filtro por cliente** próprio, que é a "visão do cliente" do Desenho 3.1 e do 03, 6.10; sem filtro, a carteira. Leads e Números são do escritório; Comunicados escolhe os destinatários (7.1).

```
┌─ CRM › Conversas ──────────────────────────────────────────────────────────────┐
│ [Sem responsável (4)] [Minhas (7)] [Do setor ▾ Fiscal (19)] [Todas]  [🔍 buscar] │
│ Filtros: setor ▾ · status ▾ · etiqueta ▾ · canal ▾ · responsável ▾ · período ▾   │
│ Ordem: prazo de resposta ▾ (ou: última mensagem, mais antiga)                    │
├────────────────────────────────────────────────────────────────────────────────┤
│ ⏰ 12 min  Empresa X · Maria (financeiro)   Fiscal   nova     [WA]  "minha guia…"│
│ ⏰ 40 min  Padaria Y · João (sócio)         DP       nova     [WA]  🎤 áudio 0:48 │
│ ✔ 2 h     Loja Z · Ana (RH)                DP       em atend.[app] Beltrano       │
│ ⏸ amanhã  Empresa W · Carlos (sócio)       Contábil aguard.cl.[✉]  Fulano  #extrato│
│ ⚠ -1 h    LEAD · +55 11 9…  (desconhecido) Gestão   nova     [WA]  "quanto custa…"│
└────────────────────────────────────────────────────────────────────────────────┘
```

| Visão | O que lista |
| --- | --- |
| **Sem responsável** | `responsavel_id` nulo nos setores do usuário: a "fila" sem fila |
| **Minhas** | `responsavel_id` = usuário, exceto resolvidas |
| **Do setor** | Todas de um setor do usuário |
| **Todas** | Todos os setores do usuário; para o Administrador, todos |

Cada linha: prazo de resposta restante (estourado em vermelho), cliente ou lead, pessoa e papel, setor, status, canal da última mensagem, responsável, etiquetas, prévia (áudio mostra duração e início da transcrição). A ordenação padrão é **por prazo de resposta** (4.6); conversas sem SLA (aguardando cliente) vão para o fim. A busca cobre corpo, transcrição, anexo, pessoa, empresa e CNPJ (`busca.global`).

Com carteira ligada, o Colaborador vê "Sem responsável" só dos clientes da carteira mais as de lead e de identidade desconhecida, que não têm cliente ainda.

### 4.2 Uma conversa

```
┌─ Empresa X · Maria Souza (financeiro) · Fiscal ─────────────┬─ Lateral ──────────────┐
│ Responsável: Fulano · em atendimento · ⏰ responder até 14:30│ Cliente: Empresa X     │
│ [Assumir] [Repassar ▾] [Transferir ▾] [Aguardando ▾] [Resolver]│ Simples · SP · resp.  │
│ [Etiquetar ▾] [Lembrete] [Virar tarefa] [Ligar a cliente]   │ Fiscal: Fulano         │
├─────────────────────────────────────────────────────────────┤ Pessoa: Maria, financ. │
│ 🤖 Resumo (gerado): pediu a guia de outubro; áudio diz que  │ WA ✔ opt-in · e-mail   │
│    contratou 2 funcionários. [ver completo]                  │ Outras empresas: 2 ▾  │
│ ─── 6/11 · WhatsApp ───────────────────────────────────────  │ ───────────────────── │
│ Maria 09:12  Bom dia, minha guia de outubro saiu?            │ Tarefas abertas (3)   │
│ ⚙ auto 09:12  Olá, Maria! Já vamos atendê-la. (modelo)        │ • Apurar DAS out ⏳   │
│ 🤖 Atend. 09:13 A guia DAS 10/2026 vence 20/11, R$ 1.240,00. │ • Admissão ×2 (DP) ⏳ │
│    📎 DAS-10-2026.pdf  [entregue ✔ lida ✔]                    │ Pendências (2) [cobrar]│
│ Maria 09:20  🎤 0:48  Transcrição (gerada): "ah, e contratei │ • extrato out ✉ 7 d   │
│    dois funcionários semana passada…"                        │ • notas de serviço    │
│ 📝 nota · Fulano 09:25  @Beltrano é DP, vou transferir       │ ───────────────────── │
│ 🎴 cartão · DP (de Beltrano): propõe tarefa DP-001 ×2 [sim/não]│ Histórico: 14 conv.  │
│ ─── 6/11 · app ──────────────────────────────────────────── │ Últimos eventos ▾     │
│ Maria 11:02  mandei o extrato pelo app 📎 extrato-out.pdf    │ Etiquetas: #guia #adm │
├─────────────────────────────────────────────────────────────┤                        │
│ Responder por: [WhatsApp ▾]  [/ resposta rápida] [tom ▾] [📎] │                        │
│ ┌──────────────────────────────────────────────┐ [Enviar]   │                        │
│ │                                              │ [Nota]     │                        │
│ └──────────────────────────────────────────────┘            │                        │
└─────────────────────────────────────────────────────────────┴────────────────────────┘
```

Na conversa, o campo de texto **alterna entre "Responder" e "Nota interna"** (um controle só, no lugar de dois botões); em telas abaixo de 1.536 px a lateral vira **gaveta**.

O histórico unificado mostra, em ordem de tempo e com o canal marcado: mensagens de qualquer canal (e-mail com o assunto como cabeçalho), mensagens automáticas (⚙), respostas do integrante (🤖, nome do tema), notas internas (📝, nunca saem), anexos como Documentos (status de entrega, "visto"), transcrições sob o áudio, cartões (🎴, os de 02, 9.3) e marcos (assumida, repassada, transferida, resolvida, reaberta). Mensagem apagada pelo cliente aparece riscada com o texto original (GES-203); editada mostra as duas versões.

A lateral projeta o cadastro: perfil vigente, **responsáveis por setor lidos da ficha do cliente**, pessoa e identidades (opt-in), outras empresas da pessoa, tarefas abertas no setor, pendências com **cobrar** (CTB-201 → `conversa.cobrar_pendencias`), histórico de conversas (de outros setores só a contagem, se o usuário não os tem), últimos eventos.

### 4.3 Ações

| Ação | Ferramenta | Nível | O que acontece |
| --- | --- | --- | --- |
| **Assumir** | `conversa.assumir` | executar | `responsavel_id` = eu; `em_atendimento`; abre sessão de trabalho; cancela a mensagem de espera; marco no histórico |
| **Repassar** | `conversa.repassar(usuario)` | executar | Outra pessoa do mesmo setor; encerra minha sessão; `alta` ao destino; o cliente não é avisado |
| **Transferir** | `conversa.transferir(setor, usuario?)` | executar, irreversível | Resolve a origem (`transferida`), abre conversa no destino com `conversa_anterior_id`, histórico e notas; o cliente recebe "seu assunto passou ao {setor}; fale por {número}"; a origem mostra **"transferida para o DP, com Beltrano"** e o aviso *as próximas mensagens do cliente sobre isto chegam no DP, não aqui*; só leitura para quem transferiu (Fundações 4.10, P4) |
| **Resolver** | `conversa.resolver(motivo?)` | executar | `resolvida`; encerra sessão; pesquisa de satisfação se configurada; mensagem em até 7 dias reabre; depois, cria outra ligada |
| **Aguardando cliente** | `conversa.marcar_aguardando(cliente, ate?)` | executar | Pausa o SLA; volta a `em_atendimento` na próxima mensagem ou na data; se há pendência, sugere a tarefa em `aguardando_cliente` |
| **Aguardando interno** | `conversa.marcar_aguardando(interno, tarefa_id)` | executar | Exige tarefa; concluída a tarefa, a conversa volta a `em_atendimento` com aviso |
| **Etiquetar** | `conversa.etiquetar` | executar | Catálogo do escritório (cor, setor opcional, tipo "assunto" ou "tipo de atendimento"); a de tipo define a atividade do timesheet (9.1) |
| **Lembrete** | `conversa.agendar_lembrete(quando, texto)` | executar | `alta` ao responsável na hora; não muda status |
| **Virar tarefa** | `conversa.virar_tarefa` | rascunhar → executar | A IA propõe cliente, setor, atividade, prazo, responsável e checklist lidos da conversa; o atendente confirma; tarefa e conversa ficam ligadas |
| **Ligar a cliente** | `conversa.ligar_cliente` ou `lead.fundir_com_cliente` | executar | Lead que é cliente; pessoa com várias empresas; religa com evento |
| **Mover mensagem** | `mensagem.mover(conversa_destino)` | executar | Mensagem na conversa errada da mesma pessoa (3.1, regra 3) |
| **Registrar autorização** | `conversa.registrar_autorizacao(mensagem_id, tarefa_id, ato)` | executar | GES-036: o "pode transmitir" vira prova ligada à tarefa; a IA sugere ao reconhecer a frase |
| **Bloquear** | `identidade.bloquear(motivo)` | executar, Gestor | Spam (5.5) |
| **Responder** | `conversa.responder` | executar, irreversível | Pelo canal escolhido; recusa nota; fora da janela exige template; cada saída tem `status_entrega` |
| **Nota** | `conversa.nota_interna` | executar | Menção `@pessoa` gera notificação `normal` |

Repassar e transferir aceitam seleção múltipla ("repassa as do Fulano para o Beltrano", 02 9.4); o Gestor do setor faz sem ser responsável.

### 4.4 Status e passagens

| De | Para | Quem ou o quê |
| --- | --- | --- |
| (mensagem sem conversa aberta) | **nova** | Provedor; triagem define setor e urgência (8.1) |
| nova | em_atendimento | `conversa.assumir` |
| nova | resolvida | Integrante de Atendimento resolveu o factual (só categorias liberadas, 8.1) ou `spam` |
| em_atendimento | aguardando_cliente | Atendente, ou `conversa.cobrar_pendencias` |
| em_atendimento | aguardando_interno | Atendente com tarefa |
| em_atendimento | resolvida | Atendente; transferência (motivo `transferida`) |
| em_atendimento | nova | Só se o responsável for desativado (GES-021); repasse mantém `em_atendimento` |
| aguardando_* | em_atendimento | Mensagem do cliente; data; tarefa concluída |
| resolvida | em_atendimento | Mensagem em até `reabrir_dias` (7), com o mesmo responsável se ainda tem o setor; senão `nova` |
| resolvida (> 7 dias) | nova conversa com `conversa_anterior_id` | Mensagem do cliente |

Toda passagem é evento `conversa.<acao>`. Não há "excluir".

### 4.5 Mensagem automática, horário e fora de horário

| Momento | O que sai | Modelo do tema |
| --- | --- | --- |
| Conversa `nova` no horário, ninguém assumiu em `espera_min` (2 min; 0 = na hora) | Uma vez por conversa: "Olá, {nome}! Já vamos atendê-la." | `ja_vamos_atender` |
| Conversa `nova` com resposta factual liberada | A resposta substitui a espera; se não resolve tudo, a espera vai junto | |
| Fora do horário | "Nosso horário é {horário}. O que for de status eu resolvo agora; o resto fica para o primeiro horário." O integrante responde o factual (GES-035); a conversa fica `nova`; o SLA começa na abertura | `fora_de_horario` |
| Feriado (calendário do escritório, FIS-002) | Idem, com a data de retorno | `feriado` |
| Transferência | 4.3 | `transferencia` |
| Resolução | Opcional: "Avalie de 1 a 5" (8.2) | `satisfacao` |
| Número desconhecido | Triagem por botões (5.2) | `boas_vindas_lead` |

Horário de atendimento é por setor, com fuso, dias e intervalos; o Gestor pode ligar "plantão" (uma pessoa recebe `urgente` fora do horário para etiquetas urgentes, como "intimação"). E-mail não recebe mensagem automática por padrão (P3). A mensagem de espera não conta como primeira resposta.

### 4.6 SLA por setor

| Setor | Primeira resposta humana (horas úteis) | Resolução (dias úteis) |
| --- | --- | --- |
| Padrão (Fiscal, DP, Contábil, Notas, Societário, Gestão e Atendimento) | 1 h | 2 |
| Consultoria (dúvida técnica, CON-001) | 4 h | 5 |
| Lead | 15 min | — (vira etapa do funil) |

Configurável por setor e por etiqueta ("urgente" encurta). O relógio corre só no horário do setor, pausa em `aguardando_cliente` e reinicia a cada mensagem do cliente sem resposta. `sla_resposta_ate` gera `conversa.sla_estourar` ao vencer: `alta` ao responsável e, após 2 estouros no dia, ao Gestor. A resposta do integrante conta como "primeira resposta automática" (métrica à parte); o SLA humano continua até alguém assumir ou o integrante resolver numa categoria liberada.

---

## 5. Identidade e cadastro único

### 5.1 Como a mensagem vira conversa

```
mensagem chega no número N (setor S)
  → identidade.resolver(telefone ou e-mail)
     ├─ identidade conhecida, 1 pessoa, 1 cliente ........ conversa (cliente, pessoa, S)
     ├─ identidade conhecida, pessoa com N clientes ....... triagem infere o cliente (8.1); marca `cliente_inferido`
     ├─ identidade conhecida, pessoa tipo lead ........... conversa do lead (sempre no Gestão e Atendimento)
     ├─ identidade conhecida, pessoa tipo terceiro ....... conversa sem cliente; o atendente liga (órgão, fornecedor)
     ├─ identidade bloqueada ............................. guarda a mensagem, não abre conversa, não avisa
     └─ identidade desconhecida ........................... Pessoa `lead` + Identidade + Lead (origem whatsapp) + conversa no Gestão e Atendimento
```

A conversa de pessoa com vários clientes fica com `cliente_inferido = true` até o atendente confirmar (um clique) ou trocar (`conversa.ligar_cliente`). A inferência usa assunto, último atendimento e setor do número; abaixo de confiança 0,6 o integrante pergunta ao cliente por botões ("É sobre a Empresa A ou a B?") se a conversa é `nova`; se já tem responsável, pergunta ao atendente.

### 5.2 Número desconhecido

Desconhecido em número de setor também vira lead, mas a conversa vai ao Gestão e Atendimento na hora, sem mensagem ao cliente. A triagem por botões:

```
⚙ Olá! Aqui é o atendimento do {nome_produto}. Você já é cliente?
   [Sou cliente]  [Quero conhecer os serviços]  [Outro assunto]
```

- **Sou cliente**: pede empresa ou CNPJ; o integrante busca no cadastro e, se encontra, **propõe ao atendente** `lead.fundir_com_cliente` por cartão (nunca funde sozinho: um número novo pode ser alguém sem autorização). Até a decisão, a conversa segue como lead e o integrante não entrega dado da empresa.
- **Quero conhecer**: etiqueta `comercial`; o integrante faz a qualificação inicial (regime, porte, dor, contabilidade atual; GES-042); não fala de preço (8.4).
- **Outro assunto**: etiqueta `outro`; o atendente decide.

### 5.3 Fusão

`pessoa.fundir` e `cliente.fundir` (Fundações 6.5) religam conversas, mensagens, tarefas, horas e documentos; o histórico mostra "cadastro fundido em …". Casos: lead que já era cliente; dois números da mesma pessoa; o contador interno de três empresas do grupo (CIC-009) que aparece como três pessoas. O integrante detecta prováveis duplicatas (nome, CPF, e-mail) e propõe por cartão ao Gestor.

### 5.4 Contatos do cliente com papéis

A Conta de cliente tem `papel_cliente` e `areas`, **por serviço contratado** (Fundações 2.3). O CRM precisa de **quem recebe o quê** para a régua, o "responder com dado" e a entrega de guia. Pedido A1: `assuntos` na Conta de cliente (`guias`, `folha`, `documentos_pendentes`, `honorarios`, `societario`, `comunicados`), derivado do papel (financeiro: guias, documentos, honorários; RH: folha; sócio: tudo) e editável **na ficha do cliente** (contatos com assuntos, WhatsApp, e-mail e app; decisão do UI lab de 7/11/2026) (GES-041, GES-104). Entrega: à pessoa com o assunto e `principal = true`; sem ninguém, ao sócio; sem sócio com opt-in, tarefa "cadastrar contato para {assunto}". A ferramenta recusa mandar folha a quem não tem `folha`.

### 5.5 Spam e bloqueio

`identidade.bloquear(motivo)` (Gestor) para golpe, lista de marketing ou insistência sem assunto. A mensagem continua guardada (H6), sem conversa, notificação ou custo de IA; a lista "bloqueados" fica na Configuração. Lead que não responde à triagem em 7 dias: `lead.perder(sem_contato)` automático, sem bloqueio. O integrante propõe bloqueio de spam provável; nunca bloqueia sozinho.

---

## 6. Leads e pipeline

### 6.1 Quadro

Segunda aba do item CRM. Visível para quem tem o setor Gestão e Atendimento e para o Administrador. Lead conversa só pelo WhatsApp (decisão 9 do Desenho); o quadro é a outra face da conversa.

```
┌─ CRM › Leads ───────────────────────────────────────────────────────────────┐
│ [Quadro] [Lista] [Métricas]       origem ▾  responsável ▾  período ▾  [+ lead]│
├───────────┬───────────┬───────────┬───────────┬───────────┬─────────────────┤
│ Lead (6)  │ Qualif.(3)│ Proposta 2│ Contrato 1│ Implant. 2│ Perdido (mês) 4 │
├───────────┼───────────┼───────────┼───────────┼───────────┼─────────────────┤
│ +55 11 9… │ Cafeteria │ Clínica M │ Oficina R │ Loja K    │ Bar J (preço)   │
│ site · 2h │ Simples   │ R$ 1.800  │ assinatura│ trilha 4/9│ Pet S (sumiu)   │
│ ⏰ 15 min  │ Carla·1 d │ enviada 3d│ pendente  │           │                 │
│ …         │           │           │           │           │                 │
└───────────┴───────────┴───────────┴───────────┴───────────┴─────────────────┘
```

| Etapa | Entra quando | Sai quando | Quem |
| --- | --- | --- | --- |
| **Lead** | Identidade desconhecida ou lead manual (indicação, Instagram, site) | Qualificação preenchida | Integrante qualifica; pessoa confirma |
| **Qualificado** | `qualificacao` com regime, porte, serviços, contabilidade atual (GES-042) | Proposta gerada | Responsável |
| **Proposta** | Documento do modelo do tema (serviços, honorário, implantação), enviado pelo fio; a IA rascunha a partir da qualificação e da tabela de honorários | Aceite por mensagem (GES-036) ou recusa | Responsável |
| **Contrato** | Documento de contrato; assinatura por fornecedor externo (Plano 8.2) | Assinado | `lead.fechar_contrato` |
| **Implantação** | Cliente criado em `em_implantacao`; `cliente.gerar_jornada(entrada)` abriu a trilha (SOC-021, GES-104, GES-105) | Trilha concluída → `ativo` (03, seção 8) | Societário e Atendimento |
| **Perdido** | `lead.perder(motivo)`: preço, sem contato, escolheu outro, fora do perfil | Pode reabrir | |

Campos do Lead além dos das Fundações 4.9: `valor_proposta` (centavos), `servicos_propostos` (lista do catálogo de serviços do escritório), `proxima_acao_em` (follow-up), `ultimo_contato_em`, `contrato_documento_id`. Pedido A2.

### 6.2 Regras

1. **Fechar contrato é um ato só**: `lead.fechar_contrato(perfil_inicial)` cria o Cliente com a primeira versão do perfil, religa conversas e documentos, converte a Pessoa em `cliente` com Conta `socio`, envia o convite do app (GES-104) e dispara a trilha. Uma transação, um evento por efeito.
2. **Follow-up**: lead sem contato há `follow_up_dias` (3) gera lembrete; o integrante rascunha a retomada (template se fora da janela, com o opt-in da triagem).
3. **Proposta e contrato são Documentos** na pasta do lead (que vira a do cliente), com hash, versão e "visto" quando o lead abre o link.
4. **Preço**: a IA não cita valores; apresenta o escritório e agenda com o responsável. A proposta sai sempre por pessoa (cartão).

### 6.3 Métricas de funil

Leads por origem e por mês; conversão por etapa (lead → qualificado → proposta → contrato); tempo médio em cada etapa; motivo de perda; valor de honorário fechado por mês; tempo de primeira resposta ao lead; leads por responsável. Tudo por `indicador.listar(escopo = leads)`; aparece em Leads › Métricas e na aba Gestão do Painel.

---

## 7. Comunicados e réguas

### 7.1 Comunicados (GES-030, GES-044)

Terceira aba do item CRM. Um Comunicado é: **destinatários (todos os clientes, segmento do perfil ou clientes escolhidos a dedo)**, modelo aprovado, variáveis, canal, agendamento, status, resultado por destinatário.

```
┌─ CRM › Comunicados › Novo ──────────────────────────────────────────────────┐
│ Segmento: regime = Simples · UF = SP · setor = Fiscal · perfil ≠ MEI         │
│           → 84 clientes · 97 pessoas com assunto "comunicados" · 91 com opt-in│
│ Modelo:   [prazo_pgdas_novembro ▾] (utilidade · aprovado · WhatsApp)          │
│ Texto:    "Olá {nome}, o PGDAS-D de {competencia} vence {data}. …"            │
│ Canal:    WhatsApp (91) · e-mail para os 6 sem opt-in ☑                       │
│ Quando:   [agora] [agendar: 10/11 09:00]   Limite do número: 2.000/24 h ✔     │
│ [Pré-visualizar 3 exemplos] [Enviar com aprovação]                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

Regras:

1. **Destinatários**: todos os clientes, um **segmento** ou clientes escolhidos a dedo (UI lab, 7/11/2026). O segmento é um predicado sobre o perfil vigente (`cliente.listar`), no formato das Obrigações; o integrante monta a partir de texto ("todos do Simples de SP com funcionários"), mostra em tabela, a pessoa confirma.
2. **Destinatário** é a pessoa do cliente com `assuntos ∋ comunicados` (5.4); sem ninguém, o sócio.
3. **Opt-in e descadastro** (GES-031): WhatsApp fora da janela só com `opt_in_whatsapp`, coletado na implantação (GES-104) por botão e guardado com texto, data e canal; "PARAR", "sair" ou o botão de descadastro revoga com data e motivo; e-mail tem link de descadastro no rodapé do tema.
4. **Envio** é `comunicado.enviar` (executar, irreversível, cartão em lote com 3 exemplos); respeita limite do número e horário; respostas abrem conversa `nova` no setor do comunicado, etiquetada.
5. **Resultado** por destinatário: `status_entrega` (enviada, entregue, lida, falhou, sem opt-in, descadastrado); taxa de leitura e resposta; o Gestor reenvia por outro canal a quem não recebeu.
6. **Boletim mensal** (GES-044): prazos do mês do perfil e mudanças legais que o Consultor marcou para o segmento; o integrante rascunha, a pessoa aprova.

### 7.2 Réguas

Uma **Régua** é entidade do escritório (pedido A3): tipo, etapas (dia relativo, modelo, tom, para quem), canal preferido (da pessoa; fallback e-mail), horário de envio, condição de parada, escalonamento, ativa por cliente (o cliente pode ter régua própria: "manda extrato só dia 10", GES-020).

| Régua | Dispara em | Etapas padrão | Para quando | Catálogo |
| --- | --- | --- | --- | --- |
| **Documentos da competência** | `tarefa.aguardar_cliente`; job dia 1 (CTB-002) | D0 lista; D+3 lembrete; D+7 só o que falta; D+10 ao sócio; D+15 Gestor e etiqueta "cliente atrasa" | `pendencia.marcar_recebida` zera o item | CTB-003, NFE-038, DP-009, DP-002, PF-004 |
| **Guia a pagar** | `documento.registrar` tipo guia (FIS-031) | D-3 com a guia; D0; D+2 "consta em aberto" | Pagamento conciliado ou botão "paguei" | FIS-010, 016, 032, DP-021 |
| **Honorários** | Fase 3; existe desligada | D-5; D0; D+3; D+10 firme; D+20 Gestor; D+30 aviso formal; D+45 pausa parcial (dias configuráveis; 09, 5.2) | Baixa do pagamento; `cobranca.pagamento.informado` (3 dias úteis) | GES-004, FIN-009 |
| **Certificado e cadastros** | `certificado.vencer_em_30_dias`; alvará, licença | D-30, D-15, D-5 | Novo arquivo no cofre | SOC-009, SOC-036 |
| **Prazo do cliente** (folha, férias, experiência) | Tarefa `aguardando_cliente` com prazo legal | D-5, D-2, D-1 com a consequência | Resposta | DP-007, 012, 024 |
| **Lead sem resposta** | `ultimo_contato_em` | D+3, D+7 | Resposta; `perdido` em D+14 | GES-042 |

Regras comuns: a régua é `conversa.cobrar_pendencias` executada pelo integrante de Atendimento (gatilho 11 de 02), no fio da pessoa certa, no canal preferido, no horário, com template fora da janela; cada envio é mensagem na conversa; três etapas sem resposta geram `alta` ao responsável do cliente; "já mandei" devolve a conversa a `em_atendimento` para uma pessoa. **Confirmação de recebimento de guia**: a mensagem traz o botão "Recebi"; o clique gera `documento.registrar_entrega(confirmado_pelo_cliente)`, a abertura do link gera "visto"; sem clique em 48 h, reenvia uma vez e depois avisa (FIS-010).

---

## 8. IA no CRM

### 8.1 As ações do Desenho 3.2 como ferramentas

| Ação | Ferramenta | Nível | Gatilho | Saída e tela |
| --- | --- | --- | --- | --- |
| **Responder com tom** | `conversa.rascunhar_resposta(tom)` | rascunhar | Botão "tom ▾": formal, direto, amigável, para leigo | Texto reescrito no campo; cartão de pré-visualização "editar / enviar" |
| **Responder com dado** | `conversa.rascunhar_resposta(com_dados)` sobre `documento.listar`, `tarefa.listar`, `obrigacao.listar_aplicaveis` | executar nas **categorias liberadas** (P2); rascunhar no resto | `mensagem.receber` em conversa `nova` ou sem responsável (02, gatilho 3); botão | Resposta com o documento anexo e entrega registrada (GES-025); mensagem 🤖 com "ver origem" |
| **Transcrever áudio** | `mensagem.transcrever` | executar | Todo áudio | `transcricao` e resumo de uma linha sob o áudio, marcada "gerada" |
| **Virar tarefa** | `conversa.virar_tarefa` | rascunhar → executar | Botão; pedido implícito (8.2) | Cartão de tarefa "criar / editar / não" |
| **Triagem automática** | `conversa.triar` | executar, correção em um clique | Conversa `nova`; pessoa com N clientes | Setor, urgência, cliente inferido, tipo (operacional, técnica CON-001, comercial, documento); "corrigir setor" transfere sem avisar o cliente se ninguém assumiu |
| **Documento recebido** | `documento.registrar` + `documento.classificar` | executar para tipos reconhecidos (extrato, NF-e, DANFE, boleto, guia paga, RG, CTPS); rascunhar nos demais | Anexo (GES-026) | Documento no índice com cliente, competência, tipo, pasta, `setor_id`; baixa de pendência (CTB-201); devolução ao cliente só por erro objetivo (GES-405); cartão "arquivado em …" ou "classificar" |
| **Resposta técnica com citação** | `parecer.rascunhar` via Consultor (02, 10) | rascunhar, sempre | Triagem "dúvida técnica" | Rascunho com citação conferida, vigência e "dentro / fora do escopo do contrato" (CON-001, CON-002); só o contador envia |
| **Régua de cobrança** | `conversa.cobrar_pendencias` | executar | Seção 7.2 | Mensagem ⚙ "régua: etapa 2 de 5" |
| **Alerta de silêncio** | job GES-034 sobre `conversa.listar` | executar (aviso) | 8h e 17h; `conversa.sem_resposta_24h` | `alta` ao Gestor: "8 sem resposta, 5 no Fiscal; repassar para Beltrano?" com cartão em lote |
| **Resumo da conversa** | `conversa.resumir` | executar | Assumir, repassar, transferir; > 20 mensagens; botão | `resumo` gerado com identificadores preservados, no topo da conversa |

Todas seguem 02: conteúdo da conversa é `<dado>`; pedido vira proposta; número só de ferramenta; "enviei" só com retorno `ok` (12.3).

### 8.2 As ideias extras

| Ideia | Como entra | Nível | Quem |
| --- | --- | --- | --- |
| **Pedido implícito** ("contratei dois", "vou abrir filial", "errei a nota") | Gatilho 4 de 02: o integrante **do setor do pedido** propõe a tarefa com checklist e documentos a pedir (DP-001, SOC-002, NFE-019) | rascunhar (cartão) | Integrante do setor do responsável |
| **Sinal de risco de perda** (GES-043) | Job semanal: reclamações (etiqueta), satisfação baixa, atraso de honorário (quando houver Financeiro), silêncio prolongado, erro recente (GES-019); `alta` ao Gestor com os sinais | executar (aviso) | Atendimento do Gestor |
| **Agendamento de reunião** | `reuniao.agendar`: oferece 3 horários livres do responsável (conector de calendário), confirma por botão, cria tarefa (GES-105, GES-045) e evento na agenda | executar; a pessoa pode desmarcar | Atendimento |
| **Pesquisa de satisfação** (GES-038) | Ao resolver, no máximo uma por pessoa a cada 30 dias, botões 1 a 5; nota ligada à conversa, setor e responsável; ≤ 2 gera `alta` ao Gestor e tarefa "plano de ação"; NPS trimestral como Comunicado | executar | Atendimento |
| **Modelos por evento** | Guia emitida, documento faltando, prazo em 3 dias, tarefa concluída visível, admissão feita: cada um com modelo do tema e variáveis do sistema; o integrante nunca escreve do zero o que tem modelo | executar se a atividade está liberada; senão cartão | Integrante do setor |
| **Base de respostas aprovadas** | Resposta enviada sem edição, ou marcada "boa", vira exemplo na memória do escritório por setor (02, 5) com cliente anonimizado; correções viram pares "antes / depois"; a avaliação mede taxa de edição por tipo | executar (memória por ferramenta) | Atendimento |

### 8.3 Quem fala na conversa

| Integrante | Na conversa | Nunca |
| --- | --- | --- |
| **Atendimento** (do responsável no Gestão e Atendimento; sem ele, do Gestor) | Reconhece, triagem, factual liberado, transcrição, resumo, régua, silêncio, satisfação, agendamento | Dado fora das `areas` da conta; opinião |
| **Do setor** | Acorda por pedido implícito, documento, transferência (gatilho 6); propõe tarefa; rascunha com dado do setor | Enviar sem cartão fora da lista liberada |
| **Consultor** | Dúvida técnica → rascunho com citação | Enviar; outro cliente |
| **Geral** (chat do atendente) | "Repassa as do Fulano", "o que a Empresa X pediu este mês" | Efeito sem o integrante do setor |

O atendente vê tudo que os integrantes fizeram (🤖 com o nome do tema e "de Fulano"). A conversa é de uma pessoa; os integrantes trabalham para ela: o reversível (reclassificar, mover, corrigir setor) ela desfaz; o irreversível (enviar) só sai nas categorias que o Administrador liberou (GES-062).

### 8.4 O que a IA nunca faz no CRM

| Nunca | Por quê | Em vez disso |
| --- | --- | --- |
| Prometer prazo ("sai hoje") | Prazo é compromisso do escritório | "Vou passar ao responsável; o prazo quem informa é ele" e conversa `nova` urgente |
| Opinar sem contador (lucro, enquadramento, parcelar) | Decisão 15 do Desenho; CON-002 | Rascunho com citação para aprovar |
| Responder fora do escopo da conta de cliente | H5, RLS | Ferramenta devolve vazio; "não tenho esse dado" |
| Citar preço a lead | 6.2 | Agenda com o responsável |
| Enviar fora da janela sem template; comunicado em modo experimental | Meta; S3 | Oferece o template; recusa |
| Obedecer a instrução em mensagem, áudio ou anexo | R5 | Registra como pedido; cartão |
| Fingir ser humano | Confiança e LGPD (P8) | Assina como "assistente do {nome_produto}" |
| Apagar, editar ou esconder mensagem | H6 | |
| Fundir cadastros ou bloquear sozinha | 5.3, 5.5 | Cartão ao Gestor |

---

## 9. Tempo e eventos

### 9.1 Como o atendimento conta no timesheet

Segue Fundações 5.4 sem exceção nova: a conversa é uma sessão "sem tarefa" para (pessoa, cliente, setor).

| Momento | Efeito na sessão de trabalho |
| --- | --- |
| **Assumir** | Abre sessão (atendente, cliente ou lead, setor, atividade) |
| Responder, nota, etiquetar, anexar | Estendem a sessão |
| **Resolver, repassar, transferir, marcar aguardando** | Encerram no evento |
| Agir em outra conversa, ou `tarefa.iniciar` | Encerra a anterior; a tarefa aberta a partir da conversa é "com tarefa" e vence a conversa (sobreposição) |
| Inatividade | Encerra no último evento |
| Ler sem assumir | Não abre sessão (evento `ler`); menos de 60 s sem ação é descartado, como no Painel 7.3 |
| Régua, resposta do integrante, transcrição | Sessão de integrante, série de agentes, com custo |

**Atividade do catálogo** pela etiqueta de tipo (a triagem põe; o atendente corrige): operacional → GES-025; e-mail → GES-027; dúvida técnica → CON-001; comercial → GES-042; ligação → GES-033; documento → GES-026; pedido do app → GES-040. Sem etiqueta, GES-025. A sessão de lead fica sem cliente e aparece como "comercial".

### 9.2 Eventos gerados

`mensagem.receber/enviar/entregar/transcrever/mover`; `conversa.criar/triar/assumir/repassar/transferir/resolver/reabrir/marcar_aguardando/etiquetar/virar_tarefa/cobrar_pendencias/sla_estourar/sem_resposta_24h/satisfacao.responder/registrar_autorizacao`; `identidade.bloquear`; `lead.criar/avancar/perder/fechar_contrato`; `comunicado.enviar/resultado`; `canal.conectar/qualidade.mudar`; `modelo.status.mudar`; `opt_in.registrar/revogar`. Os novos em relação às Fundações 5.7 estão no pedido A5.

### 9.3 Métricas

| Métrica | Como se calcula | Onde |
| --- | --- | --- |
| Primeira resposta humana | `conversa.assumir` ou primeira `mensagem.enviar` de pessoa − `conversa.criar`, em horas úteis | Gestão; Home do Gestor |
| Primeira resposta automática | Primeira `mensagem.enviar` de integrante − `conversa.criar` | Avaliação da IA (02, 14) |
| Resolução | `conversa.resolver` − `conversa.criar`, descontando `aguardando_cliente` | Gestão |
| Conversas por pessoa e setor | Assumidas, resolvidas, abertas, repassadas | Gestão; Timesheet › Equipe |
| Reabertas | `conversa.reabrir` em 7 dias ÷ resolvidas | Gestão |
| SLA cumprido | Resolvidas dentro do prazo ÷ total | Gestão |
| Satisfação | Média e distribuição por setor e pessoa; detratores | Gestão; risco de perda |
| Resolvidas pelo integrante | Por categoria liberada; reabertura dessas | Governança da IA (GES-062) |
| Clientes que mais atrasam documentos | Etapas de régua por cliente | Contábil; rentabilidade |
| Horas de atendimento por cliente | Sessões GES-025, 027, CON-001 | Timesheet › Rentabilidade |

---

## 10. Permissões

### 10.1 Quem vê o quê

| Papel | Conversas | Ações | Leads | Comunicados | Configuração |
| --- | --- | --- | --- | --- | --- |
| **Colaborador** | As dos seus setores (com carteira: só dos seus clientes e as sem cliente); de outro setor só se transferidas | Assumir, responder, repassar, transferir, resolver, aguardar, etiquetar, virar tarefa, notas | Se tem Gestão e Atendimento | Rascunhar; enviar com aprovação do Gestor | Não |
| **Gestor** | Todas dos seus setores | Tudo acima, reatribuir, bloquear, em lote, métricas do setor | Idem e métricas | Enviar | Horário, SLA, etiquetas, mensagens automáticas do setor |
| **Administrador** | Todas | Tudo | Tudo | Tudo | Números, modelos, modo experimental, bloqueados, exportação, retenção |
| **Cliente** (app) | Só o próprio fio (11) | Escrever, anexar, abrir pedido | — | — | — |
| **Integrante** | Interseção com o dono (R4) | Ferramentas liberadas | | | |

Conversa de outro setor não aparece nem na busca; a lateral mostra "14 conversas em outros setores" sem conteúdo.

### 10.2 Notas internas

Vistas por quem vê a conversa; seguem na transferência (são do escritório). Nunca saem pelo canal: `conversa.responder` recusa; o app não as recebe. Menção a alguém de outro setor gera notificação com o trecho, não acesso à conversa.

### 10.3 Exportação e LGPD

| Tema | Regra |
| --- | --- |
| **Exportação** | `relatorio.gerar(conversas, …)` só para Administrador, com evento e arquivo como Documento com hash; conversa individual exportável pelo Gestor (prova de autorização, disputa, GES-203) |
| **Finalidade e base legal** (GES-054) | Cliente: execução de contrato; lead: legítimo interesse até a proposta, consentimento para comunicados; a Configuração guarda o aviso de privacidade do escritório |
| **Consentimento** | `opt_in_whatsapp` com texto, data e canal; revogação registrada |
| **Retenção** | Cliente: prazo de guarda do escritório (mínimo 5 anos, Fundações P5), depois arquivo frio; lead perdido: **mantido para campanhas futuras** (decisão de 7/11/2026), com nome, contato, origem, serviço de interesse e motivo da perda, enquanto houver consentimento; o conteúdo das conversas (corpo e transcrições) é removido após 12 meses e a identidade só é anonimizada se a pessoa pedir ou se o escritório desligar "guardar leads" na configuraçãos, eventos mantidos |
| **Direito de exclusão** | Pedido vira tarefa GES-054 ao Administrador; resposta é anonimização, nunca remoção de evento (R7); o que a lei obriga a guardar fica, com justificativa |
| **Acesso ao histórico** | Ler conversa é evento `ler`; o Administrador vê quem leu o quê |
| **Incidente** (GES-059) | Envio à pessoa errada: a mensagem não se apaga; o incidente é registrado ligado à mensagem e ao cliente, com a ação tomada |

---

## 11. App do cliente no CRM

O chat do app é o mesmo fio: `canal = chat_app` numa Mensagem da mesma Conversa (Fundações 4.10). Não há segunda caixa.

| O cliente vê | O cliente não vê |
| --- | --- |
| Mensagens de qualquer canal, com "por WhatsApp" ou "pelo app" | Notas internas; cartões; marcos de repasse; responsável anterior |
| Respostas do integrante, assinadas como assistente | Transcrições (uso interno; o áudio dele fica como áudio) |
| Anexos em pasta visível (Fundações 7.8) | Anexos de pasta interna |
| Status simplificado: **recebido** · **em atendimento** · **aguardando você** (com a lista do que falta) · **em andamento no escritório** · **resolvido** | Etiquetas, SLA, setor interno (só o nome exibido do setor) |
| Pedidos (GES-040) abrem tarefa com `pedido.abrir`; o status da tarefa aparece como etapas | Responsável e checklist da tarefa |

Regras:

1. **Um fio por pessoa e setor**, como no WhatsApp; o sócio não vê a conversa do financeiro (P7). O app lista as conversas por setor exibido e uma caixa "Falar com o escritório" que abre no Gestão e Atendimento.
2. **Canal de resposta**: o último usado pelo cliente; resposta pelo app gera push; sem abertura em 4 h úteis e com opt-in, o WhatsApp recebe o aviso "você tem uma resposta no app", não o conteúdo.
3. **Pedido vira tarefa na hora** (`pedido.abrir` → `tarefa.criar`; 02, gatilho 23): o integrante do setor começa o que pode, o Colaborador é avisado, o status da tarefa alimenta o status visível.
4. **Documentos pelo app** passam pela mesma classificação (8.1); a pendência baixa; o cliente vê "recebido: extrato de outubro".
5. **Lead não entra**: o app recusa identidade sem Conta de cliente.

---

## 12. Base: construir, usar Chatwoot ou outro

### 12.1 Avaliação

| Opção | O que ganhamos | O que perdemos ou custa |
| --- | --- | --- |
| **Chatwoot como sistema** (instância ligada à plataforma por API e webhooks) | Caixa pronta: inboxes, times, status, etiquetas, notas, respostas rápidas, SLA, CSAT, automações, conectores de Cloud API e e-mail, app móvel; comunidade ativa | Segundo cadastro de contatos e atendentes a sincronizar (quebra "um cadastro, muitos pontos de uso"); permissões próprias fora da tupla e da RLS (R3, R8); ações fora do executor de ferramentas (R1) e sem nossos eventos (R2): nem timesheet nem auditoria sem camada de espelho; fio único com o app exige escrever no Chatwoot e reconciliar; tema limitado; sem subinquilino; times, SLA e automações são da edição paga (busca de 7/11); dois sistemas para operar |
| **Chatwoot como referência** (organização, nomes, estados, conectores) | UX validada pelo mercado; código aberto para ler os conectores (webhooks da Meta, IMAP, status de entrega) | Escrever a caixa |
| **Evolution API** como provedor | Contrato de provedor (3.4) pronto para Cloud API e não oficial, multi-instância | Processo a mais; só WhatsApp; chamar a Meta direto é pouco código |
| **Outros de código aberto** (Rocket.Chat Omnichannel, Zammad, Papercups) | Escopo parecido | Mesmas perdas; menos foco em WhatsApp no Brasil |
| **Construir sobre as Fundações** | Conversa, Mensagem, Canal, fio único, transferência, cartão, eventos, RLS, tema e integrantes já existem (F8, F9, F10); a caixa é uma tela sobre `conversa.*`; timesheet e tarefas vêm de graça | Escrever lista, conversa, conectores e quadro de leads; sem app móvel pronto (Painel 2.6 cobre celular) |

### 12.2 O que exige código nosso de qualquer forma

Mesmo com Chatwoot: identidade → pessoa → cliente (5.1), inferência de empresa, fio único com o app, transferência que troca o número e avisa quem transferiu, "aguardando interno" com tarefa, régua sobre pendências, cartões dos integrantes na conversa, atividade do catálogo por conversa, tempo no timesheet, permissões por setor e carteira, tema. É a maior parte do valor, e tudo precisaria de espelho e sincronização.

### 12.3 Recomendação

**Construir a caixa sobre as Fundações, com o Chatwoot como referência de organização e de código dos conectores.** As entidades já existem (F8 é a Conversa); as regras R1 a R8 não sobrevivem a um sistema paralelo; o que diferencia o produto é a ligação com cadastro, tarefas, integrantes e tempo. Copia-se do Chatwoot: visões (sem responsável, minhas, do time), estados, etiquetas, respostas rápidas, notas, SLA, CSAT e a mecânica dos conectores. Para o modo não oficial, Evolution API ou Baileys como implementação isolada do contrato de provedor.

Risco aceito: a primeira caixa terá menos recursos que o Chatwoot (sem macros, automações visuais e app móvel próprio). Mitigação: a ordem de 13.1 entrega primeiro o que o piloto usa todo dia.

---

## 13. Ordem de construção, ajustes e perguntas

### 13.1 Etapas sobre as Fundações (F8 pronta)

| # | Etapa | Entrega | Depende de | Prova |
| --- | --- | --- | --- | --- |
| C1 | Provedor abstraído e Cloud API com coexistência | Contrato de 3.4; webhook com dedupe por `id_externo`; envio; status de entrega; mídia → `documento.registrar`; Embedded Signup; `canal.*` | F8, F7, F2 | Mensagem no número do piloto vira Mensagem na Conversa certa em menos de 5 s |
| C2 | Transcrição e resumo | `mensagem.transcrever`, `conversa.resumir`, fornecedor abstraído | C1, F10 | 100 áudios reais; custo por minuto medido |
| C3 | Caixa: lista e conversa | Visões, filtros, ordem por SLA, histórico unificado, lateral, as ações de 4.3, mensagem automática, horário, SLA | C1, F3, F9, 03 (P1, P2) | Uma semana do setor piloto sem o WhatsApp do celular |
| C4 | Identidade e desconhecidos | Fluxo de 5.1, triagem por botões, lead automático, fusão por cartão, bloqueio, `assuntos`, `mensagem.mover` | C3, F4 | Número novo vira lead; pessoa com 2 empresas cai na certa em 9 de 10 |
| C5 | Tempo e eventos | Sessão por assumir e resolver, atividade por etiqueta, métricas de 9.3 | C3, F6 | Timesheet do piloto com horas de atendimento por cliente |
| C6 | Integrante de Atendimento na caixa | Gatilhos 3, 5, 11 de 02; triagem, factual liberado, documento recebido, silêncio, virar tarefa | C3, 02 (T4) | Correção de triagem < 10%; nenhuma resposta fora de categoria liberada |
| C7 | Templates, janela e Configuração dos números | Biblioteca de modelos, submissão, recusa fora da janela, tela de 3.2, verificação, limites | C1 | Fora da janela só por template aprovado |
| C8 | E-mail | IMAP e API (Gmail, Microsoft 365), caixa por setor e única, assunto, anexos, remetente do tema | C3 | `fiscal@` do piloto na caixa com encadeamento |
| C9 | Réguas e pendências | Entidade Régua, as seis réguas de 7.2, botão "Recebi", parada automática | C6, C7, F5 | Um fechamento do piloto sem cobrança manual |
| C10 | Leads | Quadro, campos, proposta e contrato como Documento, assinatura externa, `lead.fechar_contrato` com trilha, follow-up, métricas | C4, F5, 03 (8) | Lead vira cliente em implantação com a trilha aberta |
| C11 | Comunicados | Segmento, modelos, opt-in e descadastro, lote com cartão, resultado, boletim | C7, C9 | Comunicado a 50 clientes com leitura medida |
| C12 | Chat do app | Canal `chat_app` no fio, status visível, pedidos, reenvio de aviso | C3, subplano 06 | App e WhatsApp numa conversa só |
| C13 | Satisfação, risco de perda, agendamento, base de respostas | Seção 8.2 | C6, C12 | Nota por setor na Gestão |
| C14 | Modo experimental e provedores | Não oficial isolado, migração em um clique, BSP | C1 | Migra para coexistência sem perder histórico |
| C15 | LGPD e exportação | Retenção, anonimização, exportação, aviso de privacidade, incidente | C3 | Teste de anonimização; exportação com evento |

C1 a C3 formam a primeira caixa usável; C4 a C6 a tornam o CRM do Desenho; o resto segue a dor do piloto. C12 anda com o subplano 06.

### 13.2 Ajustes pedidos às Fundações, ao 02 ou ao 03

| # | Onde | Pedido | Por quê |
| --- | --- | --- | --- |
| A1 | Fundações 2.3 | `assuntos` na Conta de cliente, derivado do papel, editável | Quem recebe guia e folha (5.4) |
| A2 | Fundações 4.9 | Lead: `valor_proposta`, `servicos_propostos`, `proxima_acao_em`, `ultimo_contato_em`, `contrato_documento_id`, `perdido_em` | 6.1 |
| A3 | Fundações 4.10 | Entidades novas: **Etiqueta** (nome, cor, setor opcional, tipo, atividade_id), **Modelo de mensagem** (3.3), **Régua** e **Etapa** (7.2), **Comunicado** e **Destinatário** (7.1), **Resposta rápida**. Conversa ganha `assumida_em`, `primeira_resposta_humana_em`, `primeira_resposta_automatica_em`, `resolvida_em`, `motivo_resolucao`, `aguardando_ate`, `cliente_inferido`, `urgencia`, `tipo`. Identidade ganha `bloqueada_em`, `bloqueada_motivo`. Canal ganha `principal`, SLA, `espera_min`, `estado_coexistencia`, `qualidade`, `limite_atual`, `aviso_experimental_aceito_por/em` | Seções 3, 4, 7 |
| A4 | Fundações 6.5 | Ferramentas: `conversa.marcar_aguardando`, `.etiquetar`, `.agendar_lembrete`, `.ligar_cliente`, `.triar`, `.resumir`, `.registrar_autorizacao`; `mensagem.transcrever`, `.mover`; `identidade.bloquear/desbloquear`; `lead.criar/avancar/perder/fechar_contrato/fundir_com_cliente`; `comunicado.segmentar/rascunhar/enviar`; `modelo.submeter/status`; `canal.configurar/verificar_saude/conectar/migrar`; `regua.configurar`; `pesquisa.enviar`; `reuniao.agendar`; `opt_in.registrar/revogar` | Seções 4.3, 6, 7, 8 |
| A5 | Fundações 5.7 | Eventos de 9.2 que não existem (`conversa.sla_estourar`, `conversa.reabrir`, `conversa.satisfacao.responder`, `mensagem.entregar`, `lead.*`, `comunicado.enviar`, `canal.qualidade.mudar`, `opt_in.*`, `identidade.bloquear` e os demais) | Gatilhos e métricas |
| A6 | Fundações 4.10 | Roteamento quando dois setores compartilham o número (3.1, regra 3); setor sem número usa o principal | Escritório com um número |
| A7 | Fundações 5.4 | Atividade da sessão de conversa vem da etiqueta de tipo; fallback GES-025; sessão de lead com `cliente_id` nulo | 9.1 |
| A8 | Fundações 10 | `modelos_texto` ganha `boas_vindas_lead`, `transferencia`, `feriado`, `satisfacao`, `recebi_guia`, `boletim` e as etapas das réguas; `nome_whatsapp_exibido` por número | 4.5, 7 |
| A9 | Fundações 5.2 | Anonimização (identidade → hash, corpo removido, evento mantido) como operação de retenção | 10.3 |
| A10 | 02 (7.2) | Gatilhos: `conversa.sla_estourar`, `conversa.satisfacao.responder` ≤ 2, `lead.criar` (qualificação inicial), `conversa.criar` de pessoa com N clientes (inferir), job semanal GES-043 | 8.1, 8.2 |
| A11 | 02 (3.2) | GES-042 e GES-038 na lista "prepara" do Atendimento desde a primeira versão; GES-043 como job | Desenho traz leads e satisfação ao CRM |
| A12 | 02 (9.3) | Cartão **Conversa** no chat: cliente, pessoa, setor, status, prévia, "abrir no CRM" | "O que a Empresa X pediu este mês" |
| A13 | 03 (2.0, 6.10) | A aba Atendimento é o item lateral CRM com quatro abas; a "visão do cliente" é Conversas com cliente selecionado; a Home ganha "sem responsável e SLA a vencer"; o detalhe da tarefa mostra a conversa ligada em leitura | Encaixe |
| A14 | 03 (6.9) | Gestão ganha o relatório de atendimento (9.3) e a governança da IA no CRM (categorias liberadas, amostragem, GES-062) | Métricas |
| A15 | Desenho 3.1 | "Setor Geral" = Gestão e Atendimento com o número principal | Setores fixos (Fundações 4.1) |

### 13.3 Perguntas para aval

| # | Pergunta | Hipótese adotada | Em outras palavras |
| --- | --- | --- | --- |
| P1 | A mensagem "já vamos atendê-lo" sai na hora ou depois de alguns minutos sem ninguém assumir? | **Respondido (segue a hipótese):** 2 minutos, configurável por setor; 0 = na hora | Na hora, todo cliente recebe resposta robótica mesmo quando alguém ia responder em 30 segundos; tarde demais, ele acha que ninguém viu. |
| P2 | Quais categorias o integrante responde sozinho desde o início? | **Respondido (segue a hipótese):** Status de guia ou documento já emitido, reenvio de documento visível, prazo do calendário, situação de tarefa; o resto é rascunho | É o que a IA responde sem ninguém olhar antes. Começa com consulta de dado pronto ("a guia saiu?") e cresce com o uso, como no subplano 02. |
| P3 | E-mail recebe mensagem automática? | **Respondido (segue a hipótese):** Não por padrão; só fora do horário, se o escritório ligar | No WhatsApp o cliente espera resposta rápida; no e-mail, resposta automática costuma incomodar. |
| P4 | Os SLAs padrão (1 h e 2 dias; 4 h e 5 dias em Consultoria) estão bons? | **Respondido (segue a hipótese; ver 13.4):** Sim, como ponto de partida; o Gestor ajusta | É a meta de tempo que ordena a lista e avisa atraso. Chute inicial a calibrar com o piloto. |
| P5 | Lead perdido: anonimizar depois de 12 meses? | **Respondido:** o lead perdido fica guardado para campanhas futuras (contato, origem, interesse, motivo); só o conteúdo das conversas é removido após 12 meses (10.3). Sim; conversas de cliente seguem o prazo de guarda | Quem só pediu orçamento e sumiu não fica guardado para sempre, como pede a lei de dados. Depois de um ano, número e mensagens perdem a identificação; o registro de que existiu fica. |
| P6 | Transferência para setor que usa o mesmo número: avisar o cliente? | **Respondido (segue a hipótese):** Sim, uma frase curta, sem número | O cliente segue no mesmo número, mas quem responde muda. Avisar evita estranhamento; custa uma mensagem a mais. |
| P7 | No app, cada pessoa do cliente vê só o próprio fio, ou o sócio vê as conversas de todos? | **Respondido (segue a hipótese):** Só o próprio fio | O dono poderia querer ver o que o financeiro combinou. A hipótese é não mostrar: a conversa é da pessoa; o sócio vê tarefas e pendências, que é o que importa. |
| P8 | O integrante se identifica como assistente? | **Respondido (segue a hipótese):** Sim, com o nome do tema e "assistente do {nome_produto}" | Quando a IA responde, o cliente sabe. Esconder pode dar problema de confiança e de lei; mostrar pode gerar "quero falar com gente". |
| P9 | Pesquisa de satisfação a cada conversa resolvida, no máximo uma por pessoa a cada 30 dias? | **Respondido (segue a hipótese):** Sim | Perguntar toda vez cansa; nunca perguntar deixa o Gestor sem termômetro. |
| P10 | Lead que diz "sou cliente": o integrante nunca funde sozinho, mesmo com CNPJ batendo? | **Respondido (segue a hipótese):** Nunca; sempre cartão | Um número novo dizendo "sou da Empresa X" pode ser qualquer um. Antes de liberar dados da empresa, uma pessoa confirma. |
| P11 | Construir a caixa sobre as Fundações, com Chatwoot só como referência? | **Respondido (segue a hipótese; ver 13.4):** Sim | Dá para ligar um programa pronto de atendimento ao nosso, ou fazer o nosso. O pronto é mais rápido no começo, mas vira um segundo sistema com cadastro, permissão e histórico próprios; o que nos diferencia (ligar a conversa ao cliente, às tarefas, ao tempo e aos agentes) teria que ser feito de qualquer jeito. |
| P12 | Escritório com um número só: o número fica no Gestão e Atendimento e os outros setores usam o principal? | **Respondido (segue a hipótese; ver 13.4):** Sim | Como os setores são fixos, não existe setor "Geral"; o Atendimento faz esse papel e passa a conversa ao Fiscal ou ao DP, que respondem pelo mesmo número. |
| P13 | A IA nunca cita preço ao lead? | **Respondido (segue a hipótese):** Nunca; agenda com o responsável | Honorário depende de conversa; a IA só apresenta o escritório e marca o papo. Alguns escritórios podem preferir tabela pública. |
| P14 | Leads, satisfação e risco de perda (GES-042, 038, 043) entram na primeira versão, embora o mapa os marque como fase 3? | **Respondido (segue a hipótese):** Leads e satisfação sim; risco de perda quando houver dados de honorário | O mapa deixou vendas e pesquisa para depois; o Desenho pediu o quadro de leads no CRM. Segue o Desenho. |

### 13.4 As três perguntas reformuladas (respondidas em 7/11/2026: seguem a hipótese)

**P4, metas de resposta.** Todo CRM de atendimento tem uma "meta de tempo" (o mercado chama de SLA): em quanto tempo a primeira resposta deve sair e em quanto tempo a conversa deve ser resolvida. O sistema usa isso para ordenar a lista (o que está mais perto de estourar vai para cima) e para avisar o Gestor quando estourar. A proposta é começar com **1 hora para a primeira resposta e 2 dias para resolver**, e 4 horas e 5 dias na Consultoria, porque consulta técnica demora mais. O Administrador ajusta por setor. Só precisa dizer se esses números iniciais parecem razoáveis.

**P11, construir ou usar um pronto.** Existe um sistema de caixa de conversas de código aberto chamado Chatwoot, que já tem tela de atendimento, WhatsApp e e-mail. A dúvida é usar ele como base do nosso CRM ou construir a nossa caixa sobre as Fundações. Usar o pronto é mais rápido no começo, mas ele tem cadastro de contatos, usuários e permissões próprios, o que vira um segundo sistema para manter sincronizado com o nosso, e o que nos diferencia (conversa ligada a cliente, tarefa, timesheet e integrantes) teria que ser feito de qualquer jeito. Hipótese: construir a nossa, usando o Chatwoot só como referência de como organizar a tela.

**P12, escritório com um número só.** Como os setores são fixos e cada um tem o seu número, a dúvida é o que fazer com o escritório pequeno que tem um único número de WhatsApp. Hipótese: esse número fica ligado ao setor Gestão e Atendimento, que faz o papel de recepção; as conversas chegam ali e são transferidas para Fiscal, DP ou Contábil, continuando no mesmo número. Não é preciso criar um setor "Geral".

## 14. Adendo: ajustes recebidos do subplano 06 (7/11/2026)

- Etapas da régua de cobrança levam link profundo para a pendência no app; "visto no app" é variável de modelo.
- Pesquisa de satisfação também pelo app; o aviso de "resposta sem conteúdo" vale para toda notificação de prioridade alta.

## 15. Adendo: ajustes recebidos do subplano 07 (7/11/2026)

- "Base de respostas aprovadas" é o evento `resposta.aprovar`, com anonimização por regra, indexado na busca do escritório com as versões da base legal.
- `parecer.rascunhar` devolve o escopo do contrato; a triagem "dúvida técnica" passa a data da mensagem como data de referência, salvo competência citada.

## 16. Adendo: ajustes recebidos do subplano 08 (7/11/2026)

- A interface de provedor de WhatsApp é a capacidade `canal.*` do conector; a saúde do canal é a saúde do conector. Um conector de e-mail atende o CRM e a caixa de XML (complemento).

## 17. Adendo: ajustes recebidos do subplano 09 (7/11/2026)

- Régua de honorários com sete etapas (09, 5.2), parada por `cobranca.pagamento.informado` (botão "pago", 3 dias úteis) e por pagamento; variável "visto no app".

## 18. Adendo: decisões do UI lab (8/11/2026)

Decisões do usuário no UI lab (7/11/2026). Já corrigidos no corpo: 3.2 (aba **Números**), 4.1 (sem seletor de cliente do topo; filtro por cliente na lista), 4.2 (campo que alterna "Responder" e "Nota interna"; lateral em gaveta abaixo de 1.536 px), 5.4 (contatos e assuntos na ficha do cliente) e 7.1 (destinatários do comunicado). Aqui o que se acrescenta.

- **Escopo das abas:** Conversas filtra por cliente na própria lista; **Leads e Números são do escritório**; Comunicados escolhe os destinatários (todos os clientes, segmento do perfil ou clientes escolhidos). O CRM não tem seletor de cliente no topo.
- **Ficha do cliente** (Fundações adendo 22): contatos com assuntos, WhatsApp, e-mail e app; responsáveis por setor (Gestor e Administrador editam, Colaborador vê). A lateral da conversa os lê dali; cobrança, entrega de guia, régua e comunicado usam o contato que recebe aquele assunto, e o envio grava a mensagem na conversa certa.
- **Lateral da conversa:** responsáveis por setor, tarefas abertas (clicáveis), a tarefa que segura a conversa, e atalhos ao Painel, ao Time e à ficha. A ficha da tarefa mostra de volta a conversa em que o assunto corre.
- **Comunicado do Colaborador:** o botão vira "Mandar para aprovação" e o aviso chega ao sino do Gestor (10.1, confirmado).
- **Link vindo do Time ou de um aviso** abre a conversa mesmo que seja de outro setor, quando ela foi transferida ou citada no cartão (4.2: de outro setor só as transferidas; a citação em cartão passa a valer também; a busca continua sem mostrá-la).
- **Cadastros em gaveta** (padrão único, com validação na hora): números, modelos, mensagens automáticas, horário, feriados, SLA, etiquetas, respostas rápidas, **lead manual** e réguas.
- **Inatividade no CRM:** a aba Conversas e as demais, exceto Números, contam tempo e entram em modo de espera (Fundações 2.5); Números não.

## 19. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seções 3.6, 4.6 e 11.2 (A11).

- **WhatsApp e aprovação de pagamento:** o cartão de aprovação do BPO é avisado e levado ao app pelo WhatsApp; aprovar **dentro** do WhatsApp só abaixo de um teto baixo da alçada e com **código de uso único**; acima, abre o app com segundo fator (10, 3.6).
- **Modos de contato por contratante e departamento** (BPO-008, modo BPO): invisível (o BPO fala com a marca do contratante), com a marca dele, ou direto; o cliente final do contratante nunca vê a marca do BPO. O número e o fio de cada contratante são do contexto dele (um subinquilino por contexto).

## 20. Adendo: ajustes pendentes do subplano 05 (aplicados em 8/11/2026)

O pedido A14 do 05 (12.2) não tinha adendo. Aplicado em 9.1: **conversa de outro cliente com tarefa aberta corta a tarefa no intervalo** (a sessão da conversa passa a valer; ao voltar à tarefa, nova sessão), na regra de sobreposição entre clientes diferentes do 05 (vence a sessão com eventos no intervalo).

## 21. Adendo: decisões do UI lab, segunda rodada (8/11/2026)

- **Contato da ficha:** é o mesmo registro que o CRM, o app e o BPO usam. Além de `assuntos`, WhatsApp, e-mail e app, ele carrega a **alçada de pagamento** da pessoa quando a empresa tem o BPO (10, 3.9); mudança de alçada vai ao aceite do cliente no app. O mesmo contato tem **papel e áreas por serviço contratado** (sócio na contabilidade, aprovador no BPO), pelo mesmo app e o mesmo acesso: decidido em 8/11/2026 (10, seção 12, Q8; Fundações 2.3); a alçada fica na linha do BPO e os `assuntos` somam os dos serviços.
- O CRM segue sem seletor de cliente (decisão 18); conversas e comunicados de uma empresa só de BPO aparecem pelos setores do usuário, como as demais.

## Adendo: itens do painel do Leandro aprovados (9/11/2026)

Decididos na [Lista de decisão do painel do Leandro](../Lista_de_Decisao_Painel_do_Leandro.md) (de acordo com o Enzo). **Regra:** entram **agentificados**, como integrantes do time que agem por gatilho, perguntam só a dúvida, preparam no cartão de aprovação e aprendem com a decisão da equipe; não como cópia das rotinas e telas do painel dele. Nada sai ao cliente sem aprovação humana no início. Detalhes de cada item ("Como fica agentificado") estão na lista.

| Itens | O que entra |
| --- | --- |
| D-17, D-18, D-19 | Farol de entrega com prazo (padrão 3 dias úteis); e-mail devolvido marca a entrega como falha (depois); comunicado de pendências em PDF (depois). |
| D-28, D-30, D-31, D-33, D-34, D-35 | Painel da empresa por pedido (depois); modo simulação e clientes-piloto do atendimento; conferir o CNPJ antes de enviar; certidão com débito sem comentário da IA, com aviso à Legalização. |

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-02 Simulados de rescisão | Agora | 03, 6.5 (bloco "Simulados"); 06 (pedido de simulado no app); 04 (régua) | DP |
| C2-06 Termo de ciência com assinatura e acompanhamento | Agora | 01 (ferramentas de documento e assinatura); 03, 7.4; 04 (régua) | Do setor (DP) |
| C2-07 Nome de quem atende nas mensagens | Agora | 04 (Conversas; tema H4); 01 (mensagem) | Gestão e Atendimento |
| C2-08 E-mail enviado vira registro sozinho | Agora | 08 (conector de e-mail, pasta de enviados); 04; 01, 7 (pasta do cliente) (ampliado: lê tudo, entrada e enviados, com anexos) | Gestão e Atendimento |
| C2-09 Malote e documentos em papel | Agora | 04 (canais e comunicados); 03, 6.1 (preferência de entrega na ficha); Arquivos (origem "malote") | Gestão e Atendimento |
| C2-13 Aniversariantes e cartão de Natal | Só a ideia | 04 (comunicados por modelo) | Gestão e Atendimento |
