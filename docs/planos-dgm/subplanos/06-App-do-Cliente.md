# Subplano 06 · App do cliente

**Versão 0.1 · 7/11/2026 · documento de desenho funcional, anterior a design visual e stack.**

Este subplano detalha a seção 7 do [Desenho do Sistema](../Desenho_do_Sistema.md) (v0.3) sobre as [Fundações](01-Fundacoes.md) (F7 documentos e F9 notificações prontas), o [Time de agentes](02-Time-de-Agentes.md) (seção 10, Consultor do cliente), o [Painel](03-Painel.md) (seção 8, implantação) e o [CRM](04-CRM.md) (seções 3, 7 e 11). As decisões da seção 10 do Desenho são definitivas: web instalável primeiro e loja depois; marca branca desde a primeira versão; app só para clientes, cada pessoa na conta da própria empresa; lead não usa o app; sem desligamento por inatividade; o modo cliente do Consultor responde o factual direto e manda opinião ao contador.

Convenções: os IDs (GES-040, FIS-036) são do [catálogo](../../pesquisa/plataforma/atividades.json); as ferramentas em `codigo` são as das Fundações 6.5 ou as pedidas na seção 14.2; "pessoa do cliente" é quem tem Conta de cliente (Fundações 2.3); "o escritório" é a equipe que usa o Painel.

---

## 1. Escopo e princípios

### 1.1 O que o app entrega

| Função | O que é | Catálogo |
| --- | --- | --- |
| Documentos | Tudo o que está nas pastas visíveis do cliente, por competência e tipo, com "visto" e "baixado" | GES-039, FIS-031, DP-019, SOC-034 |
| Pendências | O que o escritório espera do cliente, com envio direto e validação na hora | CTB-201, CTB-002, CTB-003, NFE-038, DP-009, GES-405 |
| Pedidos | Pedidos padronizados que viram tarefa no setor certo | GES-040, DP-001, DP-024, DP-026, FIS-036, NFE-039 |
| Conversa | O fio único do CRM, visto pelo lado do cliente | GES-023 a GES-026 |
| Agenda | Reunião com o responsável | GES-045 |
| Financeiro com o escritório | Honorários, boletos, notas, 2ª via | FIN-010, GES-001, GES-004 |
| Empresa | Dados, pessoas, certificado, procurações, termos | SOC-002, SOC-008, SOC-011, SOC-013, GES-041 |
| Serviços extras | Os sete do Desenho 7.2, ligados por cliente | NFE-201, FIS-201, CON-302, DP-059 |
| ~~Portal do funcionário~~ | Fora do escopo: seria outro produto (2.6). A folha chega ao RH do cliente como documento | DP-019 pelo RH |

### 1.2 O que vem das Fundações

O app não tem dados próprios. É uma janela sobre: Conta de cliente, convites e sessão (2.3 a 2.5); escopo da pessoa do cliente (3.2, regra 3); Tarefa com `aguardando_cliente` e `aguardando_detalhe` (4.8); Documento com `visivel_ao_cliente`, `areas_cliente` e registro de entrega (4.11); Certificado (4.12); Conversa e Mensagem com `canal = chat_app` (4.10); Notificação com destinatário `pessoa` e preferências (8); Tema (10); eventos (5). Os bytes dos documentos ficam no conector que o escritório escolheu (7.1); o app lê pelo índice.

### 1.3 Regras herdadas

| # | Regra | No app |
| --- | --- | --- |
| H1 | **Só ferramentas `exposta_ao_cliente`** (Fundações 6.1); o app é composição de ferramentas, como qualquer tela | Dado que nenhuma ferramenta expõe é defeito do catálogo, não motivo para consulta direta |
| H2 | **Escopo da conta de cliente**: só a própria empresa, só as `areas` do papel (3.2, regra 3) | Nunca há duas empresas na mesma tela |
| H3 | **Tema do escritório** (R6); no BPO, do subinquilino (BPO-007) | Nenhuma referência ao fornecedor aparece ao cliente |
| H4 | **Tudo gera evento** (R2): abrir, enviar, aceitar termo, ler mensagem | O "baixou" é o comprovante de entrega (7.7) |
| H5 | **Sem desligamento por inatividade** (Fundações 2.5) | Sessão longa, revogável |
| H6 | **Conteúdo do cliente é dado** (R5) | Texto e arquivos chegam a integrantes com `origem_externa = true` |
| H7 | **Lead não entra** (Desenho 10) | Identidade sem Conta de cliente é recusada no login |
| H8 | **Toda notificação passa pela central** (Fundações 8) | Push é só mais um canal |

Princípios de desenho: uma tela por pergunta do cliente ("o que vocês precisam de mim?", "minha guia saiu?", "quanto devo?"); um toque para a ação mais comum; nenhum termo que exija conhecimento contábil (nomes exibidos vêm do Tema e de um dicionário para leigo).

---

## 2. Contas, acesso e papéis

### 2.1 Convite e primeiro acesso (GES-104, GES-041)

1. O escritório chama `conta_cliente.convidar(pessoa, cliente, papel, areas, assuntos)` pela aba Clientes e Societário. O convite sai por e-mail ou WhatsApp (template do tema), com link de 7 dias (Fundações 2.4).
2. A pessoa abre o link no domínio do app do escritório, confirma a identidade (código de 6 dígitos no mesmo canal), aceita o termo de uso (modelo do tema) e escolhe a forma de entrar (2.2).
3. Aceitar gera `conta.convite.aceitar`, cria ou liga o Usuário e materializa o escopo. Quem já tem usuário só liga a conta nova; o login é um.

O sócio vê "convites pendentes" da própria empresa, com "reenviar".

### 2.2 Autenticação

| Forma | Quando | Regra |
| --- | --- | --- |
| **Código por e-mail ou WhatsApp** (padrão) | Primeiro acesso, aparelho novo, recuperação | 6 dígitos, 10 minutos, 5 tentativas; o canal é identidade já cadastrada |
| **Senha** (opcional) | Quem prefere | Nunca obrigatória |
| **Biometria do aparelho** (chave de acesso) | Após o primeiro acesso no aparelho | Oferecida uma vez; uma chave por aparelho; listada em Empresa › Acessos |
| **Segundo fator** | Sócio, se o escritório exigir | Código no segundo canal; desligado por padrão |

Sessão longa (padrão 90 dias, renovada a cada uso), sem bloqueio por inatividade (H5). Encerra por logout, revogação pelo escritório (`conta_cliente.revogar`) ou pela própria pessoa em outro aparelho. Toda sessão é listada com aparelho e último uso; "sair de todos os aparelhos" é um toque.

### 2.3 Pessoa em várias empresas

Uma pessoa pode ter Conta de cliente em várias empresas (o contador interno do grupo; o sócio de duas). O app mostra um **seletor de empresa** no topo, sem "Todos". A empresa selecionada persiste por aparelho; o Início mostra "outras empresas: 2 pendências na Empresa Y" só com contagens; notificações abrem na empresa certa; cada empresa tem o próprio papel, e **dentro da empresa o papel e as áreas são por serviço contratado** (2.4): se a empresa tem contabilidade e BPO com a mesma firma, a pessoa entra **uma vez, pelo mesmo app e o mesmo acesso**, e vê as áreas dos dois serviços somadas na mesma tela (decisão de 8/11/2026). **Grupo econômico** (Fundações 4.5) é só rótulo: as empresas aparecem juntas no seletor, com uma linha "visão do grupo" que soma pendências e vencimentos; qualquer toque leva a uma empresa.

### 2.4 Papéis e o que cada um vê

| Papel | Áreas padrão (Fundações 2.3) | Assuntos padrão (04, 5.4) | Vê | Não vê |
| --- | --- | --- | --- | --- |
| **Sócio** | todas | todos | Tudo da empresa, inclusive Financeiro com o escritório e Empresa | Nada escondido |
| **Financeiro** | documentos, guias, financeiro, pedidos, chat | guias, documentos_pendentes, honorarios | Guias, notas, extratos, boletos do escritório, pendências fiscais e contábeis | Folha, admissões, dados societários, certificado |
| **RH** | folha, pedidos, chat, documentos (só pasta de folha) | folha | Folha, holerites, admissões, férias, rescisões, pendências do DP | Guias, honorários, societário |
| **Contador interno** | tudo menos financeiro | guias, folha, documentos_pendentes, societario | O que o sócio vê, menos honorários e boletos | Financeiro com o escritório |


**Papel por serviço contratado (decisão de 8/11/2026, Fundações 2.3):** a tabela acima vale para cada serviço (`contabil`, `bpo_financeiro`); o João Batista pode ser **sócio na contabilidade e aprovador de pagamentos no BPO** sem trocar de app nem de login. O app mostra a **união das áreas** das linhas dele na empresa (a aba some só se nenhuma linha dá a área); no cartão, o papel que vale é o do serviço do cartão. O escritório ajusta `areas` e `assuntos` por pessoa e por serviço (GES-041). Aba sem área some. Pedidos e Conversa seguem o papel: o RH abre pedidos do DP; o financeiro, do Fiscal e do Contábil; o sócio, qualquer um.

### 2.5 Revogação e revisão

O escritório revoga na hora (`conta_cliente.revogar`); a sessão cai em segundos; os registros de entrega ficam. O sócio pede a remoção de uma pessoa pelo app (Empresa › Pessoas › "esta pessoa saiu"), o que vira tarefa GES-041 ao escritório; não é autoatendimento, porque a conta é do escritório. **Revisão anual** (GES-041): job que pergunta ao sócio "estas pessoas ainda trabalham com vocês?", com botões por pessoa.

### 2.6 Portal do funcionário: fora do escopo do app (decisão de 7/11/2026)

**O app é o app do escritório de contabilidade**, pelo qual o cliente do escritório acessa documentos, pendências, pedidos e conversa. Não é um app da empresa cliente para os funcionários dela. Um portal do funcionário (holerite, informe, férias para os empregados das empresas clientes) seria **outro produto**, com outro usuário, outro contrato e outra dependência: se o escritório sair da plataforma, os funcionários das empresas dele perderiam um serviço que não era do escritório. Misturar os dois no mesmo app cria esse problema.

O que fica no app, dentro do papel RH do cliente: a folha e os holerites da empresa como documentos (o RH baixa e entrega aos funcionários pelo meio dele), as admissões, férias e rescisões como pedidos e pendências. A entrega do holerite ao empregado (DP-019) é feita pelo RH do cliente, ou pelo escritório por e-mail ou WhatsApp, como hoje; o registro de entrega cobre a entrega ao RH. O papel `funcionario` e a ferramenta de convite pelo RH saem do desenho; se um dia o portal do funcionário for construído, será um produto separado com o próprio desenho.

---

## 3. Navegação e telas

### 3.1 Esqueleto

```
Celular (menu inferior)                 Tablet e computador (barra lateral)
┌──────────────────────────┐            ┌────────┬──────────────────────────────┐
│ [Empresa X ▾]        🔔  │            │ Logo   │ [Empresa X ▾]            🔔 🙂│
│                          │            │ Início │                              │
│   (conteúdo da tela)     │            │ Docs   │   conteúdo da tela, com      │
│                          │            │ Pend.  │   lista à esquerda e detalhe  │
│                          │            │ Pedidos│   à direita quando couber     │
│                          │            │ Conv.  │                              │
│                          │            │ Agenda │                              │
├──────────────────────────┤            │ Financ.│                              │
│ Início Docs Pend Conv Mais│           │ Empresa│                              │
└──────────────────────────┘            │ Serviç.│                              │
  "Mais": Pedidos, Agenda,              └────────┴──────────────────────────────┘
  Financeiro, Empresa, Serviços
```

Regras: ação do cliente (enviar, baixar, pagar, responder) cabe em um toque no celular; leitura longa (honorários, painel do sócio) ganha a tela larga. Sem calendário arrastável, sem edição de dados da empresa (vira pedido). O app é **web responsiva instalável** (Decisão 16); detalhes em 3.11.

### 3.2 Início

```
┌─ Início · Empresa X ──────────────────────────────────────┐
│ Olá, Maria. Hoje é 7/11.                                  │
│ ┌ O escritório precisa de você (3) ───────────────────┐   │
│ │ • Extrato do Banco Y de outubro        há 4 dias [📎]│   │
│ │ • Documentos do novo funcionário      há 2 dias [📎]│   │
│ │ • Certificado A1 vence em 12 dias            [enviar]│  │
│ └─────────────────────────────────────────────────────┘   │
│ ┌ Próximos vencimentos ───────────────────────────────┐   │
│ │ DAS 10/2026   R$ 1.842,10   vence 20/11   [guia] [pago✔]│
│ │ FGTS 10/2026  R$ 963,00     vence 20/11   [guia]     │   │
│ └─────────────────────────────────────────────────────┘   │
│ ┌ Chegou para você (5 novos) ─────────────────────────┐   │
│ │ Holerites 10/2026 (8) · Balancete 09/2026 · CND federal│ │
│ └─────────────────────────────────────────────────────┘   │
│ ┌ Avisos do escritório ───────────────────────────────┐   │
│ │ Feriado 15/11: sem expediente. Prazo da folha: 25/11.│   │
│ └─────────────────────────────────────────────────────┘   │
│ Pedidos em andamento (2) › · Resposta nova na conversa › │
└───────────────────────────────────────────────────────────┘
```

Fontes: `pendencia.listar`, `documento.listar` (guias a vencer; novos desde o último acesso), comunicados do CRM (GES-030) para quem tem o assunto, `pedido.listar`, `conversa.listar`. Blocos vazios somem; Início vazio diz "tudo em dia" com o texto do tema. O botão "pago" gera `documento.registrar_entrega(confirmado_pelo_cliente)` e o evento `guia.pagamento.informado`, que para a régua "Guia a pagar" (04, 7.2) sem substituir a conciliação (FIS-032).

### 3.3 Documentos

Árvore visível (Fundações 7.8), mostrada como **lista por competência** ("outubro de 2026") com filtro por tipo e setor exibido; a pasta aparece como caminho, não como navegação.

```
┌─ Documentos ─────────────────────────────────────────────┐
│ 🔍 buscar (nome, número da nota, tributo)                 │
│ [Todos ▾] [Guias] [Notas] [Folha] [Relatórios] [Permanentes]│
│ Outubro 2026 ────────────────────────────── 12 arquivos   │
│  ● DAS 10/2026.pdf          guia · 2/11 · novo    [⬇] [↗] │
│    Holerites 10/2026 (8)    folha · 1/11 · visto  [⬇] [↗] │
│    NFS-e 1023.pdf + xml     nota · 28/10 · baixado[⬇] [↗] │
│ Setembro 2026 ────────────────────────────── 31 arquivos  │
│ Permanentes: contrato social consolidado · cartão CNPJ ·  │
│   alvará (vence 3/2027) · certidões vigentes (3)          │
└───────────────────────────────────────────────────────────┘
```

- Abrir chama `documento.obter_link` (gera `visto`); baixar gera `baixado` com hash (7.7). Estados "novo / visto / baixado"; o escritório vê o mesmo no Painel (GES-039).
- Busca por nome, tipo, competência e metadados (número, chave, tributo, valor), só no visível ao papel.
- "↗": compartilhar por link (5.4), enviar para meu e-mail ou WhatsApp (registram `enviado_*`).
- "Baixar o mês" gera um zip com manifesto (lista e hashes), como o dossiê de saída do Painel 8.3.
- Documento com `bytes_ausentes_desde` aparece "indisponível" e abre pedido em um toque.

### 3.4 a 3.6 Pendências, Pedidos, Conversa

Pendências: o que o escritório espera, por competência, com o tipo de item (documento, informação, assinatura, ação externa); seção 4. Pedidos: lista com status visível e "novo pedido"; seção 4.3. Conversa: fios por setor exibido e a caixa "Falar com o escritório"; seção 7.

### 3.7 Agenda

Horários livres do responsável do cliente no setor (calendário conectado do usuário do escritório, Google ou Microsoft; sem conexão, janelas fixas). O cliente escolhe tipo, duração e canal; recebe convite e lembrete. Marcar gera `agenda.marcar` e uma tarefa GES-045 para quem atende, com pauta pré-preenchida pelo integrante (entregas, pendências, alertas). Remarcar e cancelar até o limite do escritório (padrão 4 h antes).

### 3.8 Financeiro com o escritório

Sócio e financeiro. Contrato vigente (FIN-001), faturas do ano com status, boleto e Pix com cópia do código, 2ª via com juros e multa (FIN-010, `honorario.segunda_via`), NFS-e de cada serviço da fatura (uma por serviço, 09, 5.5), informe anual de pagamentos e retenções (GES-008), Pix Automático (quando o provedor oferecer), contestação (vira tarefa FIN-011). Cobrança por provedor é fase 3 (GES-001); até lá, faturas importadas (FIN-014) e 2ª via no provedor atual.

### 3.9 Empresa

Perfil vigente só leitura (`cliente.perfil_em(hoje)`) com "pedir alteração" (SOC-002); pessoas e papéis; **Certificado** (seção 6); **Procurações** (6.4) com status por órgão; **Termos aceitos** (uso do app, certificado, opt-in) com data, versão e texto; **Acessos** (12.4).

### 3.10 Serviços

Os serviços extras (seção 8) em três estados: **ativo**, **disponível** (descrição, preço se o escritório quiser, "tenho interesse" abre pedido GES-002) e **oculto**. Nada é contratado sem o escritório confirmar.

### 3.11 Instalação

| Plataforma | Instalar | Push | Observação |
| --- | --- | --- | --- |
| Android | Aviso do navegador ou botão "instalar" | Sim, após permissão | Ícone, nome e cores do manifesto por escritório (seção 11) |
| iOS e iPadOS (Safari) | Só por "Compartilhar › Adicionar à Tela de Início"; sem aviso automático | Só instalado; permissão após um toque da pessoa | O app detecta Safari sem instalação e mostra o passo a passo; até instalar, avisos vão por WhatsApp ou e-mail |
| Computador | Chrome e Edge; Safari no macOS como app da Tela de Início | Chrome e Edge | Tela larga |
| Loja (depois) | App único ou app por escritório (GES-204) | Nativo | Seção 11.3 |

Push no iOS exige HTTPS, manifesto, modo autônomo e permissão pedida após gesto (iOS 16.4 em diante; Safari 18.4 trouxe o push declarativo; iOS 26 abre sites da Tela de Início como app por padrão). Fonte: guias de fornecedores consultados em 7/11/2026 **[a confirmar nas notas do WebKit antes de prometer push no iOS]**.

---

## 4. Pendências e pedidos

### 4.1 Ciclo de uma pendência

```
Escritório / integrante                         Cliente no app
tarefa.aguardar_cliente(itens) ──► pendência publicada ──► push "o escritório precisa de: …"
   │ régua CTB-003 (D0, D+3, D+7, D+10, D+15)        │
   │                                                 ▼ envia arquivo / preenche / assina
   │                                       documento.registrar(origem=upload_cliente_app)
   │                                       pendencia.marcar_recebida(item) ──► recibo
   ▼                                                 │
gatilho 12 (02, 7.2): integrante valida (GES-405) ◄──┘
   ├─ ok: tarefa volta a em_andamento; Colaborador avisado; cliente vê "recebido ✔"
   └─ errado: item volta à pendência com o motivo ("extrato é de setembro; precisamos de outubro")
```

Regras:

1. **Pendência é um item de `aguardando_detalhe`** de uma tarefa `aguardando_cliente` (Fundações 4.8). Não existe pendência sem tarefa; CTB-201 é a mesma lista vista pelo escritório.
2. **Tipos de item**: `documento` (tipo esperado, competência, vários arquivos, foto com recorte), `informacao` (formulário tipado: variáveis DP-009, férias DP-024, admissão DP-001), `assinatura` (ciência, 5.5), `acao_externa` (procuração SOC-011, consentimento CTB-010, com passo a passo e botão "já fiz" que acorda o integrante).
3. **Envio** chama `documento.registrar` (`origem = upload_cliente_app`) e `pendencia.marcar_recebida`. A classificação (04, 8.1) confere tipo e competência; divergência não bloqueia, marca "em conferência".
4. **Validação na hora** (GES-405): o integrante confere legibilidade, período, CNPJ e tipo e devolve o errado pelo app e pelo canal preferido.
5. **Recibo de envio**: protocolo (número, data e hora, hash, arquivo, quem enviou) no item e em Empresa › Termos e recibos; `documento.comprovante` gera o PDF. É o espelho do comprovante de entrega: prova nos dois sentidos.
6. **Prazo**: o item herda o prazo da tarefa; se há consequência (folha atrasa, multa), a frase vem da régua "Prazo do cliente" (04, 7.2).
7. **Régua integrada**: a régua do CRM é a única cadência; cada etapa vira Notificação `pendencia` para a pessoa com o assunto, no canal da preferência dela. "Visto no app" não para a régua; só `pendencia.marcar_recebida` para. A etapa seguinte menciona o visto ("você viu a lista no dia 10; falta só o extrato").
8. **"Não tenho isso"**: registra a justificativa e devolve ao escritório na conversa da tarefa; o Colaborador decide se baixa o item.
9. **Competência completa**: todos os itens validados mostram "outubro completo ✔" e geram `competencia.completa` (CTB-026).

### 4.2 Pendências de implantação

Na trilha de entrada (Painel 8.2), "o cliente precisa enviar" é a mesma lista: A1 e senha (SOC-008, só se o perfil exigir, 6.1), Autorização de Acesso na RFB (SOC-011), procuração do FGTS Digital (SOC-013), consentimento das contas (CTB-010), contrato social e documentos dos sócios (SOC-021), acervo que estiver com ele (NFE-101, CTB-102), opt-in (GES-104). O Início ganha a faixa "Implantação: 6 de 9 itens enviados".

### 4.3 Pedidos (GES-040)

| Tipo de pedido | Formulário | Vira tarefa com | Setor | O integrante já faz (02, gatilho 23) |
| --- | --- | --- | --- | --- |
| Admissão | cargo, salário, jornada, início, local, experiência; convite ao empregado para os documentos (DP-002) | DP-001 | DP | Valida, checa piso da CCT, abre DP-002 |
| Férias | empregado, início, dias, abono | DP-024 | DP | Confere fracionamento e CCT; prepara aviso |
| Rescisão | empregado, data, tipo, aviso prévio | DP-026 | DP | Checa estabilidades; simula custo (DP-059) |
| Variáveis da folha | formulário mensal com os empregados ativos | DP-009 | DP | Extrai de foto ou áudio; confere |
| Certidão | tipo, finalidade | FIS-036 | Fiscal | Emite; se positiva, abre FIS-037 |
| Documento vigente | cartão CNPJ, contrato social, alvará, para quem | SOC-034 | Societário | Reemite e entrega |
| Nota fiscal (sem emissor) | tomador, serviço, valor | NFE-039 | Notas | Rascunha; o cliente aprova (GES-036); a pessoa emite |
| Recálculo de guia vencida | guia, nova data | FIS-201 | Fiscal | Recalcula pela API; entrega |
| Alteração da empresa | o que muda | SOC-002 / SOC-017 | Societário | Lista documentos e custos; marca "fora do escopo" |
| Dúvida | texto ou áudio | CON-001 | Consultoria | Classifica; o Consultor rascunha para o contador |
| 2ª via ou contestação | fatura | FIN-010 / FIN-011 | Financeiro | 2ª via na hora; contestação vai à pessoa |
| Outro | texto livre | GES-025 | Gestão e Atendimento | Triagem |

Regras:

1. `pedido.abrir(cliente, tipo, dados)` cria a Tarefa com `origem = pedido_cliente` e dispara `pedido.abrir`. O cliente recebe número e previsão (do `prazo_interno` do catálogo).
2. **Status visível** é projeção do status da tarefa: `a_fazer` e `em_andamento` → "em andamento no escritório"; `aguardando_cliente` → "aguardando você", com a lista; `aguardando_terceiro` → "aguardando órgão ou banco"; `em_revisao` → "em conferência"; `concluida` → "concluído", com o resultado; `cancelada` → "cancelado", com o motivo. Checklist, responsável e notas internas não aparecem (04, 11).
3. **Fora do escopo** (GES-002, SOC-017): o pedido mostra "serviço avulso: R$ X" (tabela do escritório) e "autorizar"; a autorização é registrada (GES-036) e vira item de cobrança (FIN-002). Sem tabela, o escritório responde pela conversa do pedido.
4. **Conversa do pedido**: cada pedido tem conversa ligada (`tarefa.conversa_id`) no setor dele, no fio do CRM.
5. **Cancelar**: o cliente cancela enquanto ninguém iniciou; depois, pede pela conversa.
6. **Pelo WhatsApp**: o mesmo formulário conduzido pelo integrante de Atendimento (GES-040) chama o mesmo `pedido.abrir`; o pedido aparece no app.

---

## 5. Documentos e entrega

### 5.1 Árvore visível

Regra das Fundações 7.8: o escritório marca pastas visíveis (árvore-modelo e ajustes por cliente); `visivel_ao_cliente` vem da pasta e pode ser forçado por arquivo; `areas_cliente` é o segundo filtro. O app mostra o que passa pelos dois, de qualquer origem. O que o cliente enviou fica em "Enviados por você", sempre visível a quem enviou, mesmo se a pasta de destino for interna.

### 5.2 Comprovante de entrega

Abrir gera `visto`; baixar, `baixado`; enviar para o próprio e-mail ou WhatsApp, `enviado_*`; o botão "Recebi" das guias (04, 7.2), `confirmado_pelo_cliente`. Todos com `hash_no_momento`. O escritório vê por documento quem abriu e quando (GES-039); `documento.comprovante` gera o extrato com data, hora, hash e identidade (IP e aparelho ficam no evento). É o "protocolo digital" que o mercado cobra como prova de leitura (B2, seção 4).

### 5.3 Documento novo e pacote mensal

- Todo `documento.registrar` em pasta visível publica Notificação `documento`: `normal` (resumo) ou `alta` para guia e holerite. A central agrupa por cliente + competência + tipo: "8 holerites de outubro".
- **Pacote do mês** (FIS-031): ao fechar a competência, cartão "Guias de novembro: 4 guias, R$ 3.210,00, vencem 20/11" com baixar tudo, ver uma a uma e marcar pagas. Pelo canal preferido vai uma mensagem só, com link.
- **Resumo do mês** (FIS-033): documento `relatorio` na pasta visível, destacado no Início.

### 5.4 Compartilhar com terceiros

`documento.compartilhar_link(documento_ids, validade, senha?, destinatario_nome)` gera link com validade padrão de 7 dias (máximo 30), senha opcional por outro canal, bytes servidos pelo índice e cada acesso registrado (`documento.acesso_externo`: data, hora, IP). O cliente vê os links ativos e revoga em um toque. O escritório desliga por cliente ou por tipo (holerite nunca). Casos: banco pedindo balancete e contrato social; advogado pedindo certidões; licitação (SOC-034).

### 5.5 Assinatura

| Nível | O que é | No app | Exemplos |
| --- | --- | --- | --- |
| **Ciência** (eletrônica simples) | "Li e estou ciente" com identidade autenticada, data, hora, hash e IP | `documento.assinar_ciencia`; registro de entrega `ciente`; PDF com o tema | Balancete e DRE, resumo do mês, termos do app e do certificado, autorização de serviço avulso (GES-036), variáveis da folha |
| **Avançada** (gov.br ou provedor) | Certificado emitido na hora pelo provedor | Depois: o app leva ao provedor e recebe o arquivo assinado no índice | Contrato de honorários (GES-401), distrato, atas, recibo de férias e holerite (DP-019, DP-024) **[a confirmar: aceitação por Junta e auditoria trabalhista]** |
| **Qualificada** (ICP-Brasil) | Certificado do titular | O app não assina com o A1 do cofre (4.12); o cliente assina no próprio emissor ou com A3 | ECD, alterações na Junta quando exigido, procurações públicas |

A primeira versão entrega só a ciência; o resto vira tarefa com item `acao_externa`.

---

## 6. Certificado A1 e procurações

### 6.1 Quando o A1 é pedido

Segue o Plano, seção 2: o A1 do cliente é exceção. A plataforma calcula, pelo perfil (UF, município, documentos que emite e recebe, regime) e pela tabela de caminhos de captura, se algum serviço depende do A1. Só então nasce a pendência "Enviar certificado A1" (SOC-008), com a frase do motivo em linguagem simples ("precisamos dele para receber as notas que seus fornecedores emitem contra você; em SP não há outro caminho"). Clientes do RS e de SC, prestadores de serviço cobertos pela procuração da NFS-e (NFE-502) e quem só emite com autXML (NFE-002) não recebem a pendência. Quem só tem A3 registra "tenho A3, em poder de fulano" e a captura dele segue por autXML e envio manual.

### 6.2 Fluxo de envio

```
1. Pendência "Enviar certificado A1" com o motivo e a lista de serviços que vai usar.
2. Termo de autorização (modelo do tema): "autorizo o escritório a usar o certificado para:
   ☑ captura de notas  ☑ consultas em portais  ☐ transmissão de declarações", com prazo
   (até o vencimento do certificado) e revogação a qualquer momento. Ciência (5.5).
3. Envio do arquivo .pfx ou .p12 e da senha. O aparelho e o servidor nunca guardam a senha
   em claro: arquivo e senha vão direto para o cofre (certificado.enviar), que valida.
4. Validação: senha abre o arquivo; CNPJ ou CPF do titular confere com a empresa; validade
   futura; cadeia ICP-Brasil. Erro volta na hora ("senha incorreta", "este certificado é de
   outra empresa", "vence em 3 dias").
5. Certificado em `ativo`; `servicos_autorizados` do termo; evento `certificado.enviar`;
   a pendência baixa; a trilha dispara a janela de 90 dias da captura (NFE-101).
```

Regras: o app nunca mostra nem baixa o certificado; o sócio (ou quem tem a área `certificado`) vê titular, validade, serviços autorizados, situação e **uso** ("usado 14 vezes em novembro: captura de notas 12, situação fiscal 2", de `evento.listar(credencial_usada)`); alterar o termo (tirar "transmissão") gera versão nova; revogar pelo app põe `revogado` e avisa o escritório com `alta`.

### 6.3 Vencimento e renovação (SOC-009)

`certificado.vencer_em_30_dias` abre a régua "Certificado e cadastros" (04, 7.2): D-30, D-15, D-5 ao sócio, com link para a pendência "Renovar certificado"; o Início mostra os dias. O novo arquivo segue o fluxo 6.2 e fecha a tarefa; o antigo vai a `vencido`. Se o escritório vender certificado (SOC-201, depois), a régua leva o link de compra e agendamento, e o arquivo emitido cai direto no cofre.

### 6.4 Procurações e autorizações eletrônicas

| Órgão | Ferramenta do catálogo | O que o app faz |
| --- | --- | --- |
| RFB, "Autorização de Acesso" no e-CAC (SOC-011) | `pedir_autorizacao(cliente, servicos)`, `consultar_autorizacoes` | Pendência `acao_externa` com a lista exata de serviços, passo a passo com imagens, vídeo curto do tema, exigência de conta gov.br prata ou ouro (ou certificado) explicada; botão "já fiz"; o integrante do Societário consulta o Integra Procurações e fecha sozinho quando aparecer ativa; status em Empresa › Procurações |
| NFS-e nacional (NFE-502) | `validar_procuracao_nfse` | Mesmo fluxo, com os serviços da NFS-e marcados; é o que dispensa o A1 para notas de serviço |
| FGTS Digital, Sefaz, prefeitura, Junta, DET (SOC-013, DP-042) | `matriz_procuracoes`, `pedir_procuracao` | Um item por órgão, com o guia do órgão; sem consulta automática, o escritório confirma |
| Open Finance (CTB-010) | `convidar_open_finance`, `status_consentimentos` | Pendência com o link do agregador; validade e renovação 30 dias antes |

A tela Empresa › Procurações mostra a matriz "o que o escritório pode fazer por você em cada órgão", com validade, e serve ao desligamento (revogações, Painel 8.3).

---

## 7. Conversa e atendimento

### 7.1 O fio único

O chat do app é `canal = chat_app` na mesma Conversa do WhatsApp e do e-mail (04, 11). Um fio por pessoa e por setor exibido; o sócio não vê o fio do financeiro. "Falar com o escritório" abre no Gestão e Atendimento, que transfere. O que o cliente vê e não vê é a tabela do 04, 11: mensagens de qualquer canal com a marca do canal; respostas do integrante assinadas como assistente, com o nome do tema; anexos de pasta visível; status simplificado. Não vê notas internas, cartões, repasses, transcrições, etiquetas nem SLA.

### 7.2 Quem responde

1. **Integrante de Atendimento** responde o factual (GES-025: guia saiu, prazo, documento, andamento), com o documento anexado e registro de entrega, nas categorias liberadas. Assina como assistente.
2. **Pessoa do setor** assume e responde; o cliente vê o nome exibido dela.
3. **Consultor da empresa** (seção 9) só se contratado, em chat separado.
4. **Fora do horário** (04, 4.5): aviso do tema com previsão ("amanhã às 9h"); o integrante responde o que pode; o resto fica `nova`.

### 7.3 Pedido a partir da conversa

Pedido implícito ("contratei dois funcionários") vira um cartão no app, "abrir pedido de admissão com estes dados?", com os campos preenchidos; o cliente confirma e `pedido.abrir` roda, ligado à conversa. O mesmo cartão vai ao Colaborador como proposta de tarefa (02, gatilho 4). Nenhum pedido abre sem o toque do cliente ou a confirmação do Colaborador.

### 7.4 Áudio, anexos e canal de resposta

- Áudio do cliente é transcrito para o escritório (04, 3.6); o cliente vê só o áudio.
- Anexo passa por `documento.registrar` (`origem = conversa`) e pela classificação; se casa com pendência aberta, baixa o item e avisa "recebido: extrato de outubro".
- Canal de resposta é o último usado pelo cliente. Resposta pelo app gera push; sem abertura em 4 h úteis e com opt-in, o WhatsApp recebe "você tem uma resposta no app", nunca o conteúdo (04, 11). Mensagem pelo WhatsApp aparece no app com "por WhatsApp".
- **Satisfação** ao resolver (04, 8.2): uma pergunta de um toque, por setor.

---

## 8. Serviços extras (venda adicional)

Cada serviço é ligado por cliente pelo escritório (`servico_extra.ativar(cliente, servico, cobranca)`), com evento e termo quando houver. Cobrança: **fora** (o escritório inclui no honorário ou fatura à parte) ou **pela plataforma com repasse** (item recorrente no contrato, cobrado pelo provedor de cobrança do escritório, GES-001; a plataforma retém a parte dela). Fases são as do Plano, seção 7.

| Serviço | O que entrega ao cliente | O que exige | Como o escritório ativa | Cobrança | Fase |
| --- | --- | --- | --- | --- | --- |
| **Emissão de NFS-e pelo app** (NFE-201) | Emitir, consultar, cancelar e substituir NFS-e; tomadores e serviços cadastrados; tributação travada pelo escritório (código de serviço, retenções, IBS/CBS); a nota entra na apuração na hora | API do Emissor Nacional com certificado. Hoje exige o certificado do próprio contribuinte; a Fenacon pediu acesso por procuração em 6/2026 e há relato de liberação sem data **[a confirmar na documentação oficial]**. Logo: A1 do cliente no cofre ou, confirmada a procuração, certificado do escritório; município fora do padrão, provedor de emissão (B) | Configura serviços, tomadores e regras; o cliente só preenche tomador, valor e descrição | Fora ou pela plataforma (por nota ou mensal) | 2 |
| **Consultor da empresa** (02, 10) | Perguntas sobre a própria empresa em linguagem de leigo, com os dados dela (seção 9) | Só o serviço; tokens contados no cliente, com teto | Liga; nome e avatar; o que pode responder direto | Pela plataforma (mensal) ou fora | 3 |
| **Certidões sob demanda** (FIS-036) | Certidões com um toque; renovação antes de vencer; kit para licitação | Agregador para CAPTCHA; situação fiscal federal por API | Liga; quais certidões e quantas por mês | Por certidão ou pacote | 1 |
| **Simulador da reforma** (CON-020, CON-302) | Carga de hoje × carga com IBS/CBS por ano de transição, com os números da empresa; cenários simples | Motor Cálculo com XMLs e perfil; revisão do contador a cada versão | O Consultor gera (CON-302), o contador aprova, o cliente mexe nas variáveis liberadas | Relatório ou mensal | 5 |
| **Painel do sócio** (CON-010, CON-303) | Faturamento, impostos, folha, resultado, limites do Simples, comparação com o mês anterior | Dados já na plataforma; benchmark anônimo opcional | Liga; escolhe blocos; o integrante do Fiscal explica alertas | Mensal | 4 |
| **Conciliação simplificada** (CTB-010, CTB-015) | Extratos pelo agregador; lançamentos classificados; caixa do mês; "o que foi isto?" por toque | Consentimento Open Finance; agregador contratado pelo escritório | O cliente consente no app; o integrante do Contábil classifica e pergunta | Custo do agregador cobrado do escritório (08, 13.3); o escritório decide se repassa ao cliente | 3 |
| **Cobrança dos clientes do cliente** (FIN-201, parcial) | Boletos e Pix para os clientes da empresa; régua; baixa entra na conciliação | Conta no provedor em nome do cliente; provedor com subcontas; termo | O cliente abre a conta pelo app; o escritório vê recebimentos | Tarifa do provedor + margem | 5 |

Regras comuns: o serviço aparece em Serviços com o estado (3.10); desligar mantém o histórico; custo de agentes e de APIs é atribuído ao cliente nos eventos, para o escritório ver margem por serviço; nada é ativado pelo cliente sozinho.

**Ideias extras**, uma linha cada: recálculo ilimitado de guia vencida (FIS-201); simulador de custo de contratar, demitir, aumentar (DP-059) para o RH; relatório anual "o que fizemos por você" (GES-045); agenda tributária no calendário do celular; pacote pronto para licitação (SOC-034); certificado A1 vendido pelo escritório (SOC-201) com emissão guiada; IRPF dos sócios com checklist adaptativo (PF-004), cobrado à parte; conta digital e benefícios por parceria (GES-205), com transparência sobre a comissão.

---

## 9. Consultor da empresa no app

O Consultor da Empresa X é um integrante cujo dono é a Conta de cliente (02, seção 10; Fundações 13). Quando o escritório ativa o serviço, o integrante nasce com nome e avatar do tema (`integrantes_padrao.consultor`), e o app ganha um chat próprio, separado da conversa com o escritório.

| Pergunta do cliente | O que o Consultor faz | Nível |
| --- | --- | --- |
| "Minha guia de outubro saiu? Quanto é?" | Responde direto com o cartão da guia e registra entrega | Ler, direto |
| "Quando vence o FGTS?" | Responde direto do calendário da empresa | Ler, direto |
| "Quanto faturei este trimestre?" | Responde direto com os números dos XMLs, se o painel do sócio estiver ativo ou a área liberada | Ler, direto |
| "O que é DCTFWeb?" | Explica em linguagem de leigo, sem citar norma, com o que vale para a empresa dela | Ler, direto |
| "Posso pagar menos imposto mudando de regime?" | Não opina. Diz "isso é planejamento; estou passando para o contador" e abre tarefa CON-001 com a pergunta; o cliente acompanha o pedido | Vira tarefa |
| "Posso demitir fulano sem pagar aviso?" | Idem: CON-001 ao DP; responde só o factual (datas do contrato) | Vira tarefa |
| "Preciso do balancete para o banco" | Entrega o documento ou abre pedido SOC-034 | Ler ou pedido |

Regras:

1. **Escopo** = o da conta de cliente de quem pergunta: só a empresa, só as `areas` do papel, só ferramentas `exposta_ao_cliente`. O RH não obtém guias pelo Consultor.
2. **Factual direto, opinião ao contador** (Decisão 15). A fronteira é a ferramenta: `documento.*`, `tarefa.listar`, `pedido.*`, `cliente.perfil_em`, `calculo.multa_juros`, `calculo.rbt12`, `calculo.sublimite` e `calculo.mei_limite` são factuais (07, 8.2); `legal.consultar` só para explicar termos; qualquer frase com recomendação vira CON-001. O integrante diz de onde veio a resposta ("da guia emitida em 2/11").
3. **Memória** privada do integrante; da memória do escritório por setor entra só o `visivel_ao_cliente`. Nada sobre outros clientes.
4. **Apresentação**: nome do tema; a primeira mensagem diz o que faz e o que não faz; assinado como assistente; o escritório vê as conversas e pode intervir.
5. **Limites** próprios (tokens por dia, custo por mês) com teto por serviço; ao estourar, avisa "limite do mês atingido" e os pedidos seguem pela conversa com o escritório. Custo contado no cliente para a cobrança.
6. **Sem o serviço**, o app tem só o atendimento factual do integrante de Atendimento (7.2).
7. **Segurança**: mensagens do cliente são dados (R5); o Consultor não executa nada além de `pedido.abrir` com confirmação; o benchmark do modo cliente mede "respondeu direto o factual" e "mandou ao contador a opinião" (02, 14).

---

## 10. Notificações

Tudo passa pela central (Fundações 8), com `destinatario_tipo = pessoa`. O app acrescenta o canal `push_app` (registro do aparelho por `app.dispositivo.registrar`, um por aparelho instalado, com remoção ao revogar a sessão).

| Evento | Categoria | Prioridade padrão | Para quem (assunto) | Agrupamento |
| --- | --- | --- | --- | --- |
| Documento novo em pasta visível | documento | normal; **alta** para guia e holerite | documentos; guias; folha | cliente + competência + tipo |
| Pacote de guias do mês | documento | alta | guias | um por competência |
| Pendência publicada (`tarefa.aguardar_cliente`) | pendencia | alta | documentos_pendentes | cliente + competência |
| Etapas da régua (D+3, D+7, …) | pendencia | alta; D+10 e D+15 ao sócio | documentos_pendentes; sócio | idem |
| Documento devolvido na validação | pendencia | alta | quem enviou | por item |
| Vencimento de guia em 3 dias e no dia | prazo | alta; **urgente** no dia se não marcada paga e sem conciliação | guias | por competência |
| Resposta na conversa | conversa | alta | a pessoa do fio | por conversa |
| Pedido mudou de status | tarefa | normal; alta ao concluir ou pedir algo | quem abriu | por pedido |
| Certificado vence (30, 15, 5 dias) | prazo | alta; urgente a 5 dias | sócio / certificado | por certificado |
| Honorário emitido, vence, vencido | prazo | normal; alta no vencimento; alta +3 | honorarios | por fatura |
| Comunicado do escritório | sistema | normal | comunicados | por comunicado |
| Convite, acesso novo, revogação | sistema | alta | a pessoa | por evento |

Regras:

1. **Preferência por pessoa** (`notificacao.preferencias_definir`): canais em ordem, por categoria; silêncio; resumo diário com hora. Padrão: push; sem app instalado, WhatsApp com opt-in; senão e-mail. O escritório define o padrão para clientes novos; a pessoa muda em Empresa › Avisos.
2. **Urgente fura o silêncio**; **alta** respeita e vai ao primeiro canal; **normal** entra no resumo diário ("Hoje no app: 8 holerites, 1 balancete, 1 pendência"); **baixa** só na central. Regras de Fundações 8, sem exceção.
3. **Agrupamento** por `agrupamento_chave` em 30 minutos: 12 documentos viram um push.
4. **WhatsApp**: só com opt-in e, fora da janela, template de utilidade; conteúdo sensível (holerite, valor de honorário) nunca vai no texto, só o link com login.
5. **Central no app** (sino): lido e não lido, filtro por categoria, "silenciar esta competência". Resumo semanal opcional, "sua semana", como resumo da central.

---

## 11. Marca branca no app

### 11.1 O que vem do Tema (Fundações 10)

| Elemento | Campo do Tema | No app |
| --- | --- | --- |
| Nome do produto | `nome_produto` | Título, manifesto, e-mails, push ("Contábil Silva: sua guia saiu") |
| Logotipo, ícone, favicon | `logotipo_ref`, `icone_ref`, `favicon_ref` | Tela de entrada, ícone de instalação (gerado nos tamanhos exigidos), notificações |
| Cores, fontes, raio | `tokens`, `modo_escuro` | Componentes usam só tokens; modo escuro segue o aparelho se o escritório definir |
| Domínio | `dominios.app` | `app.escritorio.com.br`; o tema é carregado pelo domínio antes do login; certificado TLS emitido pela plataforma |
| Remetente de e-mail | `remetente_email` | Convite, código, resumos |
| Nome no WhatsApp | `nome_whatsapp_exibido` | Avisos e régua |
| Integrantes | `integrantes_padrao.consultor`, `.geral` | Nome e avatar do assistente e do Consultor da empresa |
| Textos | `modelos_texto` | Boas-vindas do app, convite, termo de uso, termo do certificado, "tudo em dia", fora de horário, recibo de envio, rodapé |
| Documentos gerados | `modelos_documento` | Comprovante de entrega, recibo de envio, pacote do mês |

### 11.2 Manifesto por escritório e BPO

O manifesto do app instalável (nome, ícone, cores, URL de início) é gerado do Tema por domínio e versionado com ele; trocar o tema publica versão nova e o app instalado atualiza no próximo uso. Nenhuma referência ao fornecedor aparece no nome, ícone, e-mails ou rodapé; o aviso de privacidade (GES-054) cita o fornecedor como operador. No BPO (DA-01), o cliente final vê a marca do escritório contratante, nunca a do BPO (BPO-007); o domínio é do subinquilino e o Tema herda da mãe o que não definir.

### 11.3 Loja de aplicativos (depois)

| Opção | Como | Prós | Contras |
| --- | --- | --- | --- |
| **App único com seleção do escritório** | Um app nas lojas, em nome do fornecedor; na abertura, a pessoa informa o domínio ou o código do escritório (ou abre pelo link do convite) e o app assume o tema | Uma publicação; atualizações para todos; sem conta de desenvolvedor por escritório | Nome e ícone na loja são do fornecedor; o cliente vê a marca do escritório só depois de abrir |
| **App por escritório** (GES-204) | Publicação separada, com nome e ícone do escritório, na conta do escritório ou do fornecedor | Marca completa na loja | Custo por escritório; cada versão passa por revisão; risco de recusa de apps repetidos nas lojas **[a confirmar: política de apps "modelo" da App Store e do Google Play em 2026]** |

Hipótese: app único primeiro, com link de instalação por escritório que já abre no tema certo; app por escritório como adicional cobrado (referência de mercado R$ 300/mês, B2). Até a loja existir, a web instalável cobre Android e iOS com as limitações de 3.11.

**Verificação e decisão de 8/11/2026 (subplano 10, P10).** A regra 4.2.6 da App Store (revisão de dez/2017) rejeita apps feitos a partir de modelo comercial **a menos que enviados diretamente pelo dono do conteúdo**. Na prática, os fornecedores de app com marca branca usam um destes caminhos: (a) publicar na **conta de desenvolvedor do cliente** (o cliente tem a conta e o fornecedor publica por acesso de equipe); (b) um **app único multi-cliente** na conta do fornecedor, com seletor de organização ou login que carrega a marca (sujeito ao julgamento da revisão; o caso B2B de marca diferente sobre o mesmo modelo é debatido em fóruns sem resposta fechada); (c) **distribuição privada** (Apps Personalizados pelo Apple Business Manager) **[a confirmar]**. **Não há atalho garantido.** Google Play **[a confirmar]**. **Decisão do usuário: web app (PWA) primeiro; depois o app único com seletor; o app com a marca do escritório, publicado na conta dele, fica como opção cobrada.**

---

## 12. Privacidade e segurança

### 12.1 Dados e base legal (GES-054)

Os dados da empresa são tratados em execução do contrato entre escritório e cliente; a plataforma é operadora. Consentimentos específicos, cada um com texto, data, versão e canal: opt-in de WhatsApp; termo do certificado; Open Finance (no agregador); biometria (fica no aparelho; a plataforma guarda só a chave pública). O aviso de privacidade é o do escritório, exibido no primeiro acesso e em Empresa › Termos.

### 12.2 Direitos do titular

| Direito | No app | Por trás |
| --- | --- | --- |
| Acesso e portabilidade | "Baixar meus dados" (conta, registros de entrega, pedidos, conversas da pessoa) | `conta_cliente.exportar_dados`, com evento; Documento com hash, disponível por 7 dias |
| Correção | Pedir alteração de dados pessoais | Tarefa SOC-004 |
| Exclusão | "Pedir exclusão da minha conta" | Tarefa GES-054 ao Administrador; anonimização da identidade (Fundações 15), nunca remoção de eventos (R7); documentos ficam com a empresa; guarda legal explicada |
| Revogar consentimento | Botão por consentimento | `opt_in.revogar`, `certificado.revogar`, efeito imediato |

### 12.3 Isolamento

A RLS isola por escritório; a função única de autorização isola por `cliente_id` da Conta de cliente . Testes de fundação (Fundações 11) ganham dois casos: pessoa da Empresa X chama `documento.listar` com ID da Empresa Y do mesmo escritório (negado); financeiro chama `documento.obter_link` de holerite (negado).

### 12.4 Logs visíveis ao cliente

Em Empresa › Acessos: sessões e aparelhos (com "sair"), chaves de acesso, histórico de entradas (data, hora, aparelho, cidade aproximada), consentimentos e, para o sócio, **o uso do certificado** (serviço, data, "escritório" ou "automático") e os acessos aos links compartilhados. Hipótese: o cliente não vê o nome de quem do escritório abriu os documentos dele; vê "o escritório" (14.3).

### 12.5 O que o escritório vê do uso do app

Por cliente e pessoa: último acesso, app instalado (e em que aparelho), push permitido, documentos vistos e baixados (GES-039), pendências e tempo até o envio, pedidos, conversas, consentimentos, sessões ativas (com revogação). Não vê senha, chave biométrica nem conteúdo do aparelho. Ler esses dados é evento `ler`, auditável (Fundações 5.5).

### 12.6 Se o escritório sair da plataforma

O cliente do escritório depende do app para ver os próprios documentos. Se o escritório cancelar a assinatura, o app dele é desligado, e o cliente não pode ser deixado sem o que é dele. Regras (decisão de 7/11/2026):

| Momento | O que acontece |
| --- | --- |
| Aviso de cancelamento | O escritório recebe a exportação completa (documentos com a árvore, índice com metadados, registros de entrega, conversas, cadastro) em formato aberto, para levar ao próximo sistema |
| Período de leitura (90 dias após o fim do contrato) | O app do escritório fica em **modo leitura** para os clientes: baixar documentos e ver o histórico; sem pedidos, sem conversa, sem pendências. Aviso no app com a data de encerramento |
| Fim do período | Os dados seguem a retenção das Fundações (eventos e índice ficam; arquivos vão ao destino que o escritório escolheu: nuvem dele, que já era dele nas opções 1 e 3, ou exportação da opção 2) |
| Cliente que troca de escritório | O cliente pode pedir ao escritório a exportação dos próprios documentos a qualquer momento (direito de portabilidade); se o novo escritório também usa a plataforma, a transferência de cliente entre escritórios é uma operação com aceite dos dois lados e do cliente, sem recadastro |

Nas opções de armazenamento 1 e 3 (nuvem ou servidor do próprio escritório), os arquivos nunca deixaram de ser do escritório; só o índice e o app são da plataforma. É mais um motivo para o padrão ser a nuvem do escritório.

### 12.7 Proteções de desenho

Links de documento temporários e assinados, nunca URLs permanentes; bytes servidos pelo índice; limite de tentativas no código e bloqueio com aviso ao escritório; verificação de tipo e tamanho e varredura de malware antes de `documento.registrar`; certificado e senha só no cofre (4.12); conteúdo do cliente nunca entra em prompt sem envelope (R5); sem rastreadores de terceiros.

---

## 13. Métricas

Todas calculadas dos eventos (`indicador.listar`), por escritório, cliente e período, visíveis em Gestão (Painel 6.9) e, as de adoção, na visão do cliente no CRM.

| Métrica | Como se calcula | Para que serve |
| --- | --- | --- |
| Adoção | Convidadas × aceitas × com app instalado × ativas em 30 dias; push permitido ÷ ativas | Saber se vale cobrar menos WhatsApp e mais app; limite do iOS |
| Pendências resolvidas pelo app | `pendencia.marcar_recebida` com origem `upload_cliente_app` ÷ total | Quanto da coleta saiu do WhatsApp e do e-mail |
| Tempo até o envio | Mediana de `tarefa.aguardar_cliente` até `pendencia.marcar_recebida`, por item e cliente; etapas de régua antes do envio | "Clientes que mais atrasam" (CTB-003); cadência |
| Devoluções na validação | Devolvidos ÷ enviados | Qualidade das instruções |
| Documentos entregues e abertos | Registrados em pasta visível × `visto` × `baixado`; "guia não aberta a 2 dias do vencimento" (GES-039) | Prova de entrega; reenvio |
| Guias marcadas pagas | "pago" × conciliação (FIS-032) | Confiabilidade do botão |
| Pedidos por tipo | `pedido.abrir` por tipo, status, tempo até concluir, avulsos autorizados | Carga por setor; receita avulsa |
| Conversa | Iniciadas no app ÷ total; respostas lidas no app; satisfação por setor | Deslocamento do WhatsApp |
| Consultor da empresa | Perguntas; direto × viradas tarefa; custo por cliente; avaliação | Benchmark do modo cliente; margem |
| Serviços extras | Por serviço: clientes ativos, receita, custo de API e agente, margem | Decidir o que vender |
| Certificados e procurações | Enviados ÷ pedidos; dias entre aviso e renovação; procurações pendentes e tempo até ativar | Gargalos da captura e da implantação (Painel 8.2) |

---

## 14. Ordem de construção, ajustes e perguntas

### 14.1 Etapas sobre as Fundações (F7 e F9 prontas)

| # | Etapa | Entrega | Depende de |
| --- | --- | --- | --- |
| A1 | Acesso e casca | Domínio com tema, convite, código, sessão longa, seletor de empresa, menu, manifesto instalável, central e push | F1, F3, F9, F11 |
| A2 | Documentos | Lista por competência e tipo, busca, abrir e baixar com entrega, "Enviados por você", pacote do mês, "pago" e "Recebi" | F7 |
| A3 | Pendências | `aguardando_detalhe` tipado, envio com câmera, recibo, formulários, ação externa, régua integrada, validação (gatilho 12) | F5, 04, 02 |
| A4 | Pedidos | Tipos, `pedido.abrir`, status visível, conversa do pedido, fora de escopo com autorização | F5, 02 (gatilho 23), 04 |
| A5 | Conversa | Chat no fio único, lista por setor, áudio, anexos, aviso de resposta, satisfação | F8, 04 |
| A6 | Empresa, certificado, procurações | Perfil, pessoas, termos, acessos, envio do A1 com termo e cofre, uso registrado, régua de vencimento, matriz de procurações | F1 (cofre), 04, conectores |
| A7 | Implantação pelo app | Faixa, lista "o cliente precisa enviar", opt-in | 03 (trilha) |
| A8 | Financeiro com o escritório | Faturas importadas, 2ª via, NFS-e, informe; depois cobrança pelo provedor | Fase 3 (GES-001) |
| A9 | Compartilhar e ciência | Link expirável com registro; ciência com comprovante | A2 |
| A10 | Serviços extras | Certidões (1); emissor de NFS-e e Consultor (2–3); painel do sócio e conciliação (4); reforma e cobrança (5) | 02 (10), conectores |
| A11 | ~~Portal do funcionário~~ | Removido (2.6): produto separado, fora deste desenho | |
| A12 | Loja | App único com seleção de escritório; app por escritório como adicional | A1 estável; GES-204 |

A1 e A2 são a primeira versão útil ("minha guia saiu?"); A3 e A4 tiram trabalho do atendimento; A5 fecha o fio único; A6 e A7 destravam a implantação sem o WhatsApp do celular.

### 14.2 Ajustes pedidos às Fundações, 02, 03, 04 ou 05

| # | Para | Pedido | Motivo |
| --- | --- | --- | --- |
| B1 | Fundações 6.5 | `pedido.abrir`, `pedido.listar`, `pedido.cancelar` (`exposta_ao_cliente`) com `tipo_pedido` e esquema por tipo | O 02 e o 04 citam o evento; a ferramenta não está no catálogo |
| B2 | Fundações 6.5 | `documento.compartilhar_link`, `.revogar_link`, `.assinar_ciencia`, `.baixar_pacote`; `agenda.listar_horarios`, `.marcar`, `.remarcar` com conector de calendário do usuário | Seções 3.7 e 5 |
| B3 | Fundações 6.5, 4.12 | `certificado.enviar(arquivo, senha, termo)`, `.alterar_termo`, `.revogar`, `.uso_listar`; `termo_versao` no Certificado | Seção 6; arquivo e senha vão ao cofre sem passar pelo banco |
| B4 | Fundações 6.5, 2.3 | `conta_cliente.revogar`, `.exportar_dados`, `.listar_sessoes`, `sessao.encerrar_outras`; ~~`portal_funcionario_ativo`; papel `funcionario`~~ (removidos, 2.6) | Seções 2 e 12 |
| B5 | Fundações 8 | Canal `push_app` com entidade Dispositivo (pessoa, token, plataforma, instalado_em, revogado_em); `app.dispositivo.registrar` | Seção 10 |
| B6 | Fundações 4.8 | `aguardando_detalhe` tipado: `{item, tipo, esquema?, prazo, recebido_em, validado_em, devolvido_motivo, justificativa_cliente}` | Seção 4.1 |
| B7 | Fundações 5.7 | Eventos `pedido.status_visivel.mudar`, `documento.acesso_externo`, `documento.ciencia`, `guia.pagamento.informado`, `competencia.completa`, `certificado.enviar`, `certificado.termo.alterar`, `app.instalar`, `app.push.permitir`, `conta.cliente.revogar`, `agenda.marcar` | Seções 3 a 10 |
| B8 | Fundações 10, 4.2 | `modelos_texto` ganha boas-vindas, convite, termo de uso, termo do certificado, "tudo em dia", recibo de envio, instalar no iOS; `manifesto_app` gerado do Tema; `servicos_extras` no perfil versionado `{servico, ativo_desde, cobranca, termo_documento_id, limites}` | Seções 8 e 11 |
| B9 | 02, 7.2 e 10 | Gatilho 23 desdobrado por tipo de pedido (4.3); gatilhos em `guia.pagamento.informado` (Fiscal confere) e `documento.ciencia` (fecha tarefa com critério "ciência"); lista explícita das ferramentas factuais do modo cliente e caso de benchmark | Seções 4, 5 e 9 |
| B10 | 03, 6.1 e 6.9 | Tela "App do cliente" em Clientes e Societário (pessoas, papéis, pastas visíveis, serviços, instalação, último acesso) e bloco de métricas em Gestão | Seções 12.5 e 13 |
| B11 | 04, 7.2 e 11 | Etapas da régua com link profundo para a pendência; "visto no app" como variável do modelo; satisfação pelo app; aviso de resposta sem conteúdo estendido a toda notificação `alta` | Seções 4 e 10 |
| B12 | 05 | Eventos de pessoa do cliente nunca viram sessão de trabalho; o tempo do Colaborador na validação (GES-405) conta pela tarefa | Coerência com o timesheet |

### 14.3 Perguntas para aval

Cada uma com a hipótese adotada e uma frase simples sobre o que está em jogo.

| # | Pergunta | Hipótese adotada | Em outras palavras |
| --- | --- | --- | --- |
| P1 | Senha opcional, com código por e-mail ou WhatsApp como padrão e biometria do aparelho depois? Sessão de 90 dias? | **Respondido (segue a hipótese):** Sim; segundo fator opcional por escritório | O cliente recebe um código e depois usa a digital, em vez de decorar senha; menos chamados de "esqueci a senha". Mais dias logado é mais cômodo e um pouco menos seguro. |
| P2 | O sócio remove uma pessoa da própria empresa sozinho, ou passa pelo escritório? | **Respondido (segue a hipótese):** Passa pelo escritório, com pedido de um toque | Sozinho é mais rápido; pelo escritório há uma conferência antes de cortar o acesso de alguém. |
| P3 | Pedido de férias pelo portal do funcionário vai ao RH do cliente ou direto ao escritório? | **Respondido: a pergunta caiu. O portal do funcionário saiu do app (2.6); férias são pedido do RH do cliente ao escritório.** Ao RH do cliente | O funcionário pede férias ao patrão, não ao contador; o patrão aprova e aí o contador calcula. |
| P4 | Compartilhar por link é liberado por padrão ou o escritório liga por cliente? | **Respondido (segue a hipótese):** Liberado para permanentes e relatórios; nunca holerite; o escritório pode desligar | É deixar o cliente mandar o contrato social ao banco sozinho, com registro de quem abriu. |
| P5 | O botão "pago" na guia para a régua de cobrança? | **Respondido (segue a hipótese):** Sim, até a conciliação dizer o contrário | O cliente diz que pagou e os lembretes param; se o banco mostrar que não pagou, voltam. |
| P6 | O cliente vê o nome de quem do escritório abriu ou enviou os documentos dele? | **Respondido (segue a hipótese):** Não; vê "o escritório" | É decidir se o cliente enxerga só o que foi feito ou também quem fez. |
| P7 | Serviços com repasse: a plataforma retém percentual ou valor fixo? | **Respondido (segue a hipótese):** Percentual por serviço, no contrato comercial | Define como o dinheiro do serviço vendido ao cliente se divide entre escritório e plataforma. |
| P8 | O emissor de NFS-e usa o A1 do cliente ou espera a procuração do escritório na API nacional? | **Respondido (segue a hipótese):** A1 agora; procuração quando confirmada | Hoje a nota só sai pela API com o certificado do próprio cliente; se a Receita liberar a procuração, o cliente não precisa enviar nada. |
| P9 | Loja: app único primeiro, app por escritório como adicional cobrado? | **Respondido (segue a hipótese):** Sim | O app único é mais barato de manter; o app com o nome do escritório na loja custa mais e cada escritório paga à parte. |
| P10 | Ciência no app basta para balancete, DRE e termo do certificado? Holerite e férias precisam de assinatura avançada? | **Respondido (segue a hipótese):** Ciência para os primeiros; holerite e férias com ciência agora e assinatura avançada quando houver provedor | É saber até onde um clique com login vale como assinatura e quando precisa de algo mais forte, como o gov.br. |
| P11 | Grupo econômico tem visão consolidada (somas) ou só o seletor? | **Respondido (segue a hipótese):** Só somas de pendências e vencimentos | "3 pendências nas suas 3 empresas" é útil; somar números financeiros exige decidir quem pode ver tudo. |
| P12 | O Consultor da empresa aparece como chat separado ou dentro da conversa com o escritório? | **Respondido (segue a hipótese):** Separado | Separado deixa claro quando é a máquina e quando é o contador; junto é mais simples, mas confunde. |

**Lacunas marcadas [a confirmar]**: regras atuais do push em iOS (notas do WebKit); política das lojas para apps repetidos por escritório; situação da procuração eletrônica na API da NFS-e nacional; aceitação de assinatura avançada por Juntas e auditoria trabalhista.

### 14.4 Pergunta reformulada

**P3, em outras palavras (superada: o portal do funcionário saiu do escopo, 2.6).** O portal do funcionário é a parte do app que o escritório pode liberar para os **funcionários das empresas clientes** (não para o cliente em si): ali o funcionário vê holerite e informe de rendimentos. Nesse portal ele também pode pedir férias. A dúvida é para quem vai esse pedido. Hipótese: para o RH ou o dono da empresa cliente, que aprova ou nega dentro do app, e só depois da aprovação vira tarefa para o escritório calcular as férias (DP-024). A alternativa seria o pedido cair direto na fila do escritório, que não decide se o funcionário pode tirar férias, e precisaria devolver a pergunta ao patrão.

## 15. Adendo: ajustes recebidos do subplano 07 (7/11/2026)

- A lista explícita das ferramentas factuais do Consultor da empresa é a tabela 8.2 do 07; `calculo.multa_juros`, `rbt12`, `sublimite` e `mei_limite` entram como factuais; `legal.consultar` só no escopo "explicar".
- "De onde veio" aparece como cartão (guia, cálculo), não só frase; a verificação do modo cliente é obrigatória antes de qualquer saída ao app.
- Faturamento acumulado contra o limite do Simples aparece ao cliente só se o escritório liberar a área, sem recomendação.

## 16. Adendo: ajustes recebidos do subplano 08 (7/11/2026)

- A pendência do A1 nasce do perfil de captura do cliente, só quando nenhum caminho sem certificado cobre o documento; o cliente não configura nada para a captura de notas.
- A matriz de procurações lê as Credenciais do tipo procuração; "Certidões sob demanda" usa `certidao.emitir`; o termo do A1 inclui "consultas por fornecedor" (DTE por agregador, com contrato de proteção de dados).
- A Agenda do app mostra o calendário compartilhado de atividades do cliente.

## 17. Adendo: ajustes recebidos do subplano 09 (7/11/2026)

- Estados da fatura, botão "pago", faixa de pausa parcial e contestação como no 09, 10.8; evento `cobranca.pagamento.informado`. A fatura mostra as linhas combinadas (honorário e cobranças avulsas) de forma clara.

## 18. Adendo: decisões do UI lab (8/11/2026)

Decisões do usuário no UI lab (7/11/2026), com o app do cliente montado e conferido contra este subplano (entrada por código, uma pessoa em várias empresas, papel que define as áreas, pendência respondida pelo app, pedido que vira tarefa, certificado com termo, serviços extras ligados por cliente, emissor de NFS-e travado, Consultor factual, contestação que pausa a régua). O que muda ou se acrescenta:

- **Saída do escritório (12.6):** o cancelamento é feito na aba **Assinatura** de Configurações, com **confirmação digitada**, exportação completa e 90 dias de leitura; o app dos clientes passa a modo leitura com a data de encerramento.
- **Documento abre na marca do escritório, nunca no provedor** (visualizador do app e do escritório); o "baixou" do cliente grava o registro de entrega no mesmo arquivo (Fundações, adendo 22).
- **Contato fora da ficha é barrado** na entrada por código ("peça o convite"): o cadastro de contatos da ficha do cliente (assuntos, WhatsApp, e-mail, app) é a fonte do acesso.
- **Serviço extra:** "tenho interesse" vira a atividade GES-002, mensagem no Atendimento e aviso ao responsável; o escritório liga, deixa disponível ou oculta cada serviço por cliente, na ficha.
- **Limitações do wireframe (não são regra):** "Já paguei" e os downloads registram o evento mas não mudam a guia no Painel; a conferência pelo Fiscal (`guia.pagamento.informado`, adendo 18 do 02) continua valendo.

## 19. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seções 3.6, 4.6 e 11.2 (A11 e A19).

- **Seções por pacote** (3.1): o app mostra as seções dos pacotes que o cliente contratou; para o BPO financeiro entram **Aprovações de pagamento** (primeira tela do sócio no PWA, independente de loja), **Pagamentos e caixa** e o relatório mensal do BPO. A área `pagamentos_aprovar` e a alçada (`alcada_pagamento`, `canal_aprovacao`) vivem na Conta de cliente.
- **Ordem de entrega do app (P10 do 10; 11.3):** **PWA primeiro**; depois **app único com seletor de empresa**; por último o app com a marca do escritório na conta dele, como **opção cobrada**. A regra 4.2.6 da App Store está registrada em 11.3. O GES-204 em lote (publicar o app de cada subescritório nas lojas) fica **descartado**.
- **Portal de convidado do contratante** (BPO entre escritórios, C2): variante do app para escritório, com a marca do contratante; convidados sem preço por usuário, com teto de abuso (10 por contratante, editável) e sem acesso a custo, horas, margem ou dados de outro contratante.
- **Cartão de pagamento:** conteúdo obrigatório, expiração (48 h) e recusa como em 10, 3.6; WhatsApp só avisa e leva ao app (ver adendo 19 do 04).

## 20. Adendo: decisões do UI lab, segunda rodada (8/11/2026)

O app foi estendido com o BPO (adendo 19). O que a segunda rodada acrescenta:

- **Cartão de pagamento:** botões **Aprovar**, **Editar e aprovar** (tirar contas do lote) e **Recusar** com motivo; registra quem e quando e avisa a equipe no sino; no M1, depois de aprovar, o cartão pede "Já liberei no banco" (10, 3.6). **Pagamentos para aprovar** aparece no Início e, em Mais, **Aprovações de pagamento** e **Fluxo de caixa**, só para quem tem alçada de pagamento (10, 3.9).
- **Empresa só de BPO** não recebe documentos nem áreas da contabilidade (guias, folha, certificado): as áreas seguem o serviço contratado; a subpasta `Entregáveis/BPO financeiro` é visível a quem aprova pagamentos (Fundações 7.8).
- **Mesmo contato, dois pacotes (decidido, 8/11/2026; Q8 do 10):** um só app e um só acesso; o seletor de empresa continua um por empresa, e o papel e as áreas são **por serviço contratado**, somados na mesma tela (2.3 e 2.4).
- **Limitações do wireframe (não são regra):** lote novo montado pela equipe não gera cartão novo no app; push e estado offline do PWA não foram provados (10, Q10).

## 21. Adendo: respostas finais do BPO, faturamento e suporte (8/11/2026)

O corpo (2.3, 2.4) e o adendo 20 já trazem o papel por serviço. Aqui só o que se acrescenta.

- **Fatura única do cliente:** quem paga contabilidade e BPO recebe **uma fatura e uma cobrança por mês** (um boleto ou Pix), com os serviços em linhas separadas; as **NFS-e** saem por serviço (09, 4.5 e 5.5), e a lista de notas do cliente mostra uma por serviço, ligadas à linha da fatura.
- **Cartão e papel:** a pessoa aprova pagamento só pela linha `bpo_financeiro` (alçada e `pagamentos_aprovar`); o papel de sócio da contabilidade não dá alçada de pagamento por si.
- **Suporte:** o app do cliente **não** usa o chat de suporte (o app fala com o escritório); o diagnóstico e a tela compartilhada são do usuário do escritório (Fundações, adendo 26).

## 22. Adendo: últimas decisões (8/11/2026)

- **NFS-e:** o layout nacional, o mesmo em toda a federação, decide; a nota sai **por serviço** (uma NFS-e por serviço, padrão; `nfse_por_servico`, 09, 5.5), e a lista de notas do cliente continua mostrando uma por serviço. Vários itens por nota só se a NT 007/2026 confirmar **[a confirmar]**.
- **Cartão de pagamento do BPO:** o cartão ao aprovador sai às 9h (janela da empresa); há lembrete após 4 h e, depois de 8 h, o mesmo cartão vai ao substituto cadastrado (10, 3.6). O cartão expirado continua sem pagar.

## Adendo: itens do painel do Leandro aprovados (9/11/2026)

Decididos na [Lista de decisão do painel do Leandro](../Lista_de_Decisao_Painel_do_Leandro.md) (de acordo com o Enzo). **Regra:** entram **agentificados**, como integrantes do time que agem por gatilho, perguntam só a dúvida, preparam no cartão de aprovação e aprendem com a decisão da equipe; não como cópia das rotinas e telas do painel dele. Nada sai ao cliente sem aprovação humana no início. Detalhes de cada item ("Como fica agentificado") estão na lista.

| Itens | O que entra |
| --- | --- |
| D-17, D-28 | Farol de abertura no app com reenvio por outro canal preparado no cartão; painel da empresa por pedido (depois). |
| D-16 | Documento assinado pelo contador chega ao app só depois da conferência da assinatura. |

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-02 Simulados de rescisão | Agora | 03, 6.5 (bloco "Simulados"); 06 (pedido de simulado no app); 04 (régua) | DP |
| C2-10 Biblioteca de passo a passo para o cliente | Só a ideia | SOC-101 (biblioteca de modelos); 06 (publicação no app) | Gestão e Atendimento |
| C2-14 Declaração de faturamento assinada pelo contador | Agora | 03, 6.6 (Relatórios ao cliente, junto do DECORE); 06 (pedido padronizado); D-16 (assinatura) | Contábil |
