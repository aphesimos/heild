# Mapa de telas do wireframe interativo

**Versão 1 · 14/11/2026.** Mapa do produto inteiro, tela por tela, para as sessões que vão levar o protótipo (`app/`) "à perfeição": todas as fases, não só a v1, funcionando na tela (clicar, editar, mover, confirmar, excluir, fluxos completos), com APIs pagas e IA simuladas. Contadores parceiros vão usar o wireframe para entender organização, funcionamento e fluxos; depois, o backend real será construído em cima.

- **Fontes:** `docs/planos-dgm/` (subplanos 01 a 11 e adendos, com os mais recentes no fim de cada arquivo; `Desenho_do_Sistema.md`; `Plano_Plataforma_do_Escritorio.md`; listas de decisão do Leandro e do segundo escritório; `pesquisa/atividades.json`; `subplanos/juridico/`) e o protótipo (`app/README.md`, `app/PLANO.md`, `app/REVISAO.md`, código em `app/src`).
- **Como citar:** "03, 6.4" é o subplano 03, seção 6.4; "01, ad. 22" é o adendo 22 das Fundações; "FIS-009" é o código da atividade no `atividades.json`; "D-16" e "C2-01" são itens aprovados das listas do Leandro e do segundo escritório; "JU-02, 4.2" é o subplano jurídico.
- **Divisão do trabalho:** uma seção por sessão (S01 a S11), na ordem de `SESSOES.md`. Cada tela tem um código (`S02-T03`) e cada ação um código (`S02-A41`), para as sessões e o `DECISOES.md` citarem sem ambiguidade.
- **O que este mapa não é:** não é plano novo. Onde o plano não diz, o mapa marca **[sem regra no plano]** e a sessão decide e registra em `DECISOES.md`.

---

## 0. O que vale por cima de tudo

Decisões recentes que prevalecem sobre qualquer texto anterior (planos ou protótipo):

| # | Decisão | Fonte |
| --- | --- | --- |
| 1 | **Painel com oito abas:** Societário, Obrigações, Notas, Fiscal, DP, Contábil, Consultoria, Gestão. Contábil e Fiscal ficam em duas abas | 03, 2.0 e ad. 23; Cruzamento do 2º escritório, E-02 |
| 2 | **Obrigações é compartilhada e dinâmica por setor:** cada obrigação tem setor dono; quem tem um setor vê só as dele, com o integrante dele; quem tem vários vê chips com os seus setores; Gestor e Administrador escolhem "meus setores · um setor · todos"; cada aba de setor ganha o bloco **"Obrigações do setor"** com "ver todas" | 03, ad. "Obrigações dinâmica por setor" (14/11) |
| 3 | O setor se chama **Societário** ("Legal" e "Legalização" são sinônimos na busca e na IA) | 00, 15; Desenho, ad. 14/11 |
| 4 | **Recepção, Supervisão e Direção são papéis, não abas:** Recepção = Gestão e Atendimento + perfil de apoio (C2-26); Supervisão = Gestor; Direção = Administrador | Cruzamento do 2º escritório, E-05 |
| 5 | **Comunicação interna** (subplano 11): conversas pessoais, grupos, canal por setor e canal geral; **nenhuma mensagem se apaga** (editar guarda versões) | 11, 1 e 2 |
| 6 | **App do cliente incluído por padrão**; **marca branca é complemento** (tema, domínio, app na loja) | Estudo de precificação, ajustes de 7/11 (marca branca opcional); JU-12, 7.5 (app incluído); decisão recente do Enzo repassada pela coordenação |
| 7 | Tudo do Leandro e do 2º escritório entra **agentificado**: um integrante acorda por gatilho, faz sozinho o reversível, prepara no cartão o que transmite, paga, assina ou sai ao cliente, e organiza e lembra o que é ato humano; nada sai ao cliente sem aprovação no início | Lista do Leandro, princípio; Cruzamento do 2º escritório, 6 |

---

## 1. Convenções

### 1.1 Papéis

| Papel no wireframe | Nos planos | O que é | Fonte |
| --- | --- | --- | --- |
| **Administrador** | administrador | Direção; vê e configura tudo da assinatura; único que edita papéis, setores, exceções, tema, catálogo e Configurações | 01, 2.2 e 3.2; 03, 9.2 |
| **Gestor** | gestor (vínculo `gestao` no setor) | Supervisão; aprova cartões do setor, reatribui, decide contestações, vê a equipe dos setores que gere | 01, 2.2; 03, 9.2 |
| **Membro** | colaborador (vínculo `execucao`) | Executa nos setores vinculados; vê % do próprio limite de IA, nunca tokens nem custo | 01, 2.2; 03, P10 |
| Perfil de apoio | Membro de Gestão e Atendimento + exceções por tela | Recepção: vê e conclui só o que é de apoio nos outros setores (separar, consultar, cobrar, digitalizar) | C2-26; 01, 3.5 |
| Cliente | papel `cliente` (Conta de cliente por serviço) | Usa só o app; papéis sócio, financeiro, RH, contador interno, por serviço contratado | 01, 2.3; 06, 2.4 |
| Convidado do contratante | BPO entre escritórios (C2) | Portal de convidado com a marca do contratante, sem preço por usuário | 10, 4.1.1 |

Um Gestor pode ter `gestao` num setor e `execucao` em outro (01, 2.2). Tela esconde o que a pessoa não pode; não deixa cinza (03, 9.1). A exceção é o cartão de aprovação, que mostra quem pode aprovar.

### 1.2 Setores e integrantes

Setores fixos (01, 4.1): `societario`, `fiscal`, `notas`, `dp`, `contabil`, `consultoria`, `gestao_atendimento`, `financeiro_escritorio`; do BPO `bpo_financeiro` (com quatro integrantes por função: Contas a Pagar, Contas a Receber, Conciliação, Gerencial) e `bpo` (modo BPO entre escritórios); setores de perfil sem equipe `pf`, `terceiro_setor`, `nichos`, `ciclo_vida`. O escritório renomeia a exibição e desativa; não cria nem funde. Cada pessoa tem **os próprios integrantes** (o Geral, chamado Assistente no tema de fábrica, o Consultor e um por setor que ela tem, mais os que criou) (02, 3.2; 02, ad. 22).

### 1.3 Níveis de ação e classes do integrante

| Rótulo na tela | Nível (01, 6) | Ao clicar |
| --- | --- | --- |
| **preparar** | rascunhar | Gera o rascunho e mostra para editar; nada sai |
| **executar com aprovação** | executar com `exige_aprovacao` ou `irreversivel` | Abre o **cartão de aprovação** (Aprovar · Editar e aprovar · Recusar; expira; mostra quem pode aprovar) |
| **executar** | executar | Faz e mostra resultado e evento |
| **só pessoa** | ato privativo | Sem botão para integrante; a pessoa conclui (transmitir com certificado, pagar, assinar, dar ciência) |

Classe do integrante por atividade (`autonomia` no `atividades.json`; 02, 3.1): **S** faz sozinho (179), **P** prepara, pessoa conclui (346), **O** organiza e lembra (65). A lista "faz sozinho" vem cheia e o Administrador só tira (01, 3.3). Promoção de P para S só por pergunta ao Administrador depois de 30 cartões e 95% aprovados sem edição (02, 3.3). Nunca promovível: transmitir, pagar, assinar, alterar regime, `pagamento.liberar` (B3).

### 1.4 Fases

O wireframe mostra **todas as fases** (0 a 5). Cada bloco cita a fase da atividade (Anexo A). **[sem regra no plano]** Sugestão para as sessões: um selo discreto "fase N" visível só com a opção "Mostrar fases" do painel Demonstração, para os contadores entenderem o que vem primeiro sem poluir a tela; registrar em `DECISOES.md` se adotado.

### 1.5 Regras que valem em toda tela

| Regra | Como aparece | Fonte |
| --- | --- | --- |
| Barra lateral com módulos; abas internas centralizadas em cima; cliente e sino à direita | `Moldura.tsx`, `barra-lateral.tsx`, `cabecalho-modulo.tsx` | 03, 2.0 |
| Ordem da barra: Início, Painel (ou Clientes, sem Painel; Jurídico depois do Painel), CRM, Timesheet, Arquivos, Financeiro, BPO, Conversas internas (posição **[sem regra no plano]**), Suporte e Configurações no pé | `telas/modulos.ts` | 03, ad. 21 e 23; 11, 6; JU-02, 2.1 |
| Seletor de cliente **por módulo**: some no CRM, Financeiro e Configurações; no Painel só empresas da contabilidade; no BPO só as de BPO; no Jurídico, Todos é o normal | `Plataforma.tsx` (`clientesDoModulo`) | 03, 2.0 e 3.2; JU-02, 2.1 |
| Gaveta do chat em qualquer tela, sempre no Geral; ícones dos integrantes à direita | `ModuloTela.tsx` (`GavetaChat`) | 03, 2.5 |
| Grade de widgets personalizável (P, M, G, L, XL; arrastar, tamanho, esconder, galeria, restaurar) na Visão geral e em toda aba do Painel; arranjo por usuário e tela, separado para cliente e carteira | `components/widgets/` | 03, ad. 20 |
| Cadastro e edição sempre em gaveta de formulário com validação na hora | `components/ui/formulario.tsx` | PLANO do UI lab, decisões 20 e 22 |
| Telas novas nascem com **todos** os pop-ups de setup e configuração | idem | PLANO, decisão 22 |
| Nada se apaga: tarefa cancela com motivo, conversa resolve, mensagem edita com versão, evento é imutável | — | 01, 5.2; 04, 4.4; 11, 1 |
| Cartão de aprovação é um registro só: decidir no chat, na Visão geral, na tarefa ou no sino vale em todos | `cartoes-chat.tsx`, `efeitos.tsx` | 01, 6.4; 03, 7.5 |
| Todo documento abre no visualizador com a marca do escritório | `visualizador-documento.tsx` | 01, ad. 22 |
| Modo de espera só no Painel com cliente e no CRM (menos Números) | `ambiente/espera.tsx` | 01, 2.5 |
| Celular: decisão em um toque; edição e configuração "no computador" | — | 03, 2.6 |
| Marca branca: só tokens do tema; nenhuma cor solta | `src/theme/` | 01, 10 |
| Rótulo de estado nunca só por cor (texto e cor) | — | 10, 5.2; JU-02, 3.2 |
| Integrante assina como assistente ao falar com o cliente; nunca cita preço a lead; nunca opina sem contador | — | 04, 8.4 |

### 1.6 Como simular APIs e IA no wireframe

- **IA:** os integrantes, o Geral, o Consultor e o assistente de ajuda respondem por roteiro (`dados/simulacao.ts`, `useConversa.ts`): pensam, mostram etapas, escrevem palavra por palavra (`lib/escrita.ts`), passam a outro integrante com animação e entregam cartão, tarefa, aviso no sino e toast. Toda tela nova que "pede ao integrante" usa esse motor (`usePedirIntegrante`, `ambiente/pedir.ts`).
- **APIs:** nenhuma chamada sai. Cada conector simulado devolve dado de exemplo depois de um atraso realista e grava o evento (`loja.registrar`). Cada tela que depende de conector precisa também dos **estados de erro simulados** (conector fora do ar, credencial vencida, certificado vencido, limite de consulta, CAPTCHA pendente, timeout), acionáveis pelo painel Demonstração (`ambiente/PainelLab.tsx`) **[sem regra no plano: forma do acionamento]**.
- **Estado:** o que se faz fica feito na sessão (`usePersistente` em `ambiente/loja.tsx`); "Resetar o ambiente" volta ao começo. Telas novas guardam estado com chave própria (`<sessao>:<tela>:<item>`), sem mexer no redutor central.

### 1.7 Catálogo de APIs externas a simular

| Código | API ou serviço | Usado em | Fonte |
| --- | --- | --- | --- |
| API-01 | Modelo de linguagem (principal e barato): integrantes, Geral, Consultor (`legal.consultar`), assistente de ajuda, triagem, resumo, classificação | Quase todas | 02; 07 |
| API-02 | Transcrição de áudio e ditado (`mensagem.transcrever`) | Chat, CRM, comunicação interna | 04, 3.6; 02, ad. 22 |
| API-03 | WhatsApp Cloud API (Meta): Embedded Signup, coexistência, envio, status, templates, qualidade, limite | CRM, régua, comunicados, app | 04, 3; 08, 7.1 |
| API-04 | Provedores de WhatsApp (360dialog, Gupshup, Z-API) e modo não oficial | CRM › Números | 04, 3.4 e 3.5 |
| API-05 | E-mail (Gmail API, Microsoft Graph, IMAP/SMTP): entrada, enviados (C2-08), devolvidos (D-18) | CRM, registro de envios | 08, 7.2 |
| API-06 | Integra Contador (SERPRO): PGDAS-D, DAS, DEFIS, PGMEI, DCTFWeb, Sicalc, caixa postal e DTE, SITFIS, parcelamentos, procurações, PAGTOWEB | Fiscal, Obrigações, Societário | 08, 4.1 e 4.2 |
| API-07 | Portais sem API (e-CAC, PER/DCOMP, Regularize, prefeituras): robôs C-cert, C-crc, C-captcha ou D-assistido | Fiscal, DP, Societário | 08, 4.1 e 8 |
| API-08 | eSocial (envio, consulta, download) | DP | 08, 4.1 |
| API-09 | EFD-Reinf | Fiscal, Contábil (trava D-15) | 08, 4.1 |
| API-10 | Distribuição de DF-e (NF-e, CT-e) e manifestação | Notas | 08, 4.3 |
| API-11 | NFS-e Nacional (ADN, Sefin) e Emissor Nacional (emissão por DPS) | Notas, app (emissor), Financeiro | 08, 4.4 |
| API-12 | Consulta CNPJ e CPF (SERPRO, dados abertos, BrasilAPI) | Societário, Leads | 08, 4.1 |
| API-13 | Certidões federais, estaduais, municipais, CNDT, CRF | Fiscal, app | 08, 4.1 e 5.4 |
| API-14 | Agregador InfoSimples: DTE estaduais, DEC, Sintegra, CCC, JUCESP, Bombeiros | Fiscal, Societário | 08, 5.4 |
| API-15 | Calculadora de Tributos RFB (reforma) | Fiscal, Consultoria, app | 08, 4.1; 07, 5.5 |
| API-16 | BCB SGS e PTAX (índices) | Cálculo, reajuste | 08, 4.1 |
| API-17 | FGTS Digital, DET, Empregador Web (robô ou assistido) | DP (kit de rescisão C2-01) | 08, 4.1; C2-01 |
| API-18 | Cores contábeis: Alterdata ePlugin, Domínio/Onvio, Questor, Contmatic (arquivo) | Contábil, DP, Timesheet, importação | 05, 4; 08, 6 |
| API-19 | Open Finance e agregador bancário; OFX, CSV, PDF, CNAB | Contábil, Financeiro, BPO | 08, 7.3; 09, 6.2 |
| API-20 | Cobrança (banco do escritório, Asaas, Efí): boleto, Pix, Pix Automático, webhooks | Financeiro, app | 08, 7.4 e 13.7 |
| API-21 | Emissor de NFS-e do escritório (honorários) | Financeiro | 08, 7.5; 09, 5.5 |
| API-22 | Assinatura eletrônica (provedor, gov.br) | Societário, DP (C2-06), Contábil (D-16), Leads, Jurídico | 08, 7.6; JU-08, 6 |
| API-23 | Calendário (Google, Microsoft) | Agenda do app, reuniões, Jurídico | 08, 7.7 |
| API-24 | Nuvens de arquivo (Google Drive, OneDrive/SharePoint, S3, WebDAV, SFTP) | Arquivos, Armazenamento, Raio-X | 08, 7.8 |
| API-25 | ERPs financeiros de PME (Conta Azul, Omie, Bling por API; Nibo, Granatum por arquivo) | BPO | 10, 3.0 e 8.3 |
| API-26 | Extensão de navegador (pulsos por portal) | Timesheet | 05, 3 |
| API-27 | Push web (PWA), código por WhatsApp e e-mail (login do app) | App, avisos | 06, 2.2 e 3.11 |
| API-28 | DNS (domínio, SPF, DKIM) e TLS da marca branca | Tema | 01, 10 |
| API-29 | Cofre de credenciais e KMS | Conectores e cofre, certificado no app | 08, 3 |
| API-30 | Importação das ferramentas antigas (SIEG, Acessórias, Nibo, Conexa, Omie, Conta Azul, Domínio Honorários, planilha) | Migração, Financeiro, Notas (paridade) | 03, 6.9; 09, 9 |
| API-31 | Parceiros de venda (certificado A1, conta digital) | App › Serviços | 06, 8 |
| API-32 | Jurídico: DJEN, Domicílio Judicial Eletrônico, DataJud, painéis PJe, calendário forense, cadastro da OAB | S11 | JU-03 |

### 1.8 Entidades (nomes do subplano 01 e dos módulos)

Escritório, Subinquilino, Assinatura, Usuário, Vínculo usuário × setor, Exceção por tela, Carteira de clientes, Conta de cliente, Convite, Sessão de autenticação (01, 2); Setor, Cliente, Versão do perfil, Pessoa, Identidade, Grupo econômico, Atividade, Configuração local, Obrigação (regra), Tarefa, Lead, Canal do escritório, Conversa, Mensagem, Documento, Registro de entrega, Certificado (no 08, **Credencial**) (01, 4); Evento, Sessão de trabalho (01, 5); Ferramenta, Cartão de aprovação (01, 6); Conector (01, 7; 08); Notificação, Entrega, Preferência (01, 8); Integrante, Modelo de integrante, Sessão de integrante, Item de fila, Memória, Job agendado, Gatilho por evento, Mensagem entre integrantes (01, 9); Tema (01, 10); Chamado de suporte, Uso de ajuda, Sessão de tela de suporte, Item de FAQ (01, ad. 24 a 27); Ausência (05, ad. 16). CRM: Modelo (template), Régua, Comunicado, Etiqueta, Resposta rápida (04). Financeiro: Contrato de honorários, Item do contrato, Aditivo, Tabela de avulsos, Serviço avulso, Despesa adiantada, Lote de faturamento, Cobrança, Parcela, Recebimento, Nota de serviço do escritório, Conta bancária, Lançamento, Conta a pagar, Centro de custo, Plano de contas gerencial, Regra de categorização, Orçamento, Fechamento financeiro, Política financeira, Regra de remuneração (09, 3.1). BPO: Perfil BPO da empresa, Fornecedor da empresa, Lote de pagamento, Alçada, Subconta de cobrança, Conexão de ERP (10, 3.12). Comunicação interna: Conversa interna, Mensagem (com versões), Participação (11, 8.1). Jurídico: Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato, Perícia, Diligência, Correspondente, Modelo de peça, Solicitação de titular (01, ad. 28; JU-08; JU-09; JU-10).

---

## 2. Resumo das sessões

| Sessão | Escopo | Telas | Ações | Branch |
| --- | --- | --: | --: | --- |
| S01 | Início e moldura | 11 | 87 | `wf-s01-inicio` |
| S02 | Painel A: anatomia, Societário, Obrigações, Notas | 5 | 72 | `wf-s02-painel-a` |
| S03 | Painel B: Fiscal, Contábil, Consultoria | 3 | 51 | `wf-s03-painel-b` |
| S04 | Painel C: DP, Gestão, tarefas, trilhas, ciclo de vida | 9 | 90 | `wf-s04-painel-c` |
| S05 | CRM e Comunicação interna | 5 | 87 | `wf-s05-crm-interna` |
| S06 | Timesheet | 6 | 45 | `wf-s06-timesheet` |
| S07 | Financeiro do escritório | 8 | 52 | `wf-s07-financeiro` |
| S08 | BPO | 10 | 52 | `wf-s08-bpo` |
| S09 | Arquivos, Configurações, entrada e implantação | 14 | 99 | `wf-s09-arquivos-config` |
| S10 | App do cliente | 11 | 65 | `wf-s10-app-cliente` |
| S11 | Pacote Jurídico (posterior) | 14 | 86 | `wf-s11-juridico` |
| **Total** | | **96** | **786** | |

"Telas" conta as telas e gavetas principais deste mapa (uma aba com visão de cliente e de carteira conta uma vez); "Ações" conta as linhas das tabelas de ações. Detalhe de arquivos, dependências e regras de convivência em `SESSOES.md`.


## 3. As dez maiores lacunas do protótipo atual

| # | Lacuna | Onde | Sessão |
| --- | --- | --- | --- |
| 1 | **Comunicação interna não existe** (nem item na barra, nem conversa pessoal, grupo, canal de setor ou geral, nem a regra "nada se apaga") | nenhum arquivo; `telas/modulos.ts` sem o item | S05 |
| 2 | **Aba Obrigações não é dinâmica por setor**: mostra todas as áreas do cliente, sem chips de setor, sem seletor do Gestor e sem o bloco "Obrigações do setor" nas abas de setor | `telas/painel/obrigacoes.tsx` | S02 (bloco nas abas: S03, S04) |
| 3 | **Ficha da tarefa rasa**: sem checklist, sem cartão de aprovação dentro, sem documentos anexados, sem histórico, sem "enviar para revisão", "aguardar órgão", "cancelar com motivo", "pausar", "abrir correção" e conclusão por evidência; não há fila de revisão | `ambiente/fluxos.tsx` (`FichaTarefa`) | S04 |
| 4 | **Sem calendário completo** (dia, semana, mês, arrastar prazo interno, confirmação além do prazo legal com multa) e sem visão por responsável com arrastar para reatribuir | `components/compostos/widgets.tsx` (só a semana), `bloco-tarefas.tsx` | S04 (S01 usa no widget) |
| 5 | **Sem trilhas de implantação e saída nem ciclo de vida navegável** (marcos, "o cliente precisa enviar", "o contador anterior", dossiê de saída, revogações, mudar estado) | só o widget "Ciclo de vida" em `telas/painel/societario.tsx` e a contagem da trilha em `telas/crm/LeadsTela.tsx` | S04 |
| 6 | **Itens aprovados do Leandro e do 2º escritório ausentes**: distribuição de lucros (D-11 a D-15), assinatura do contador (D-16), travas do relatório (D-26), Kanban e Minha fila (D-21, D-22), kit e simulados de rescisão (C2-01, C2-02), boletos de sindicato (C2-03), resumo da CCT (C2-04), termo de ciência (C2-06), malote (C2-09), declaração de faturamento (C2-14), conselhos e licenças (C2-20 a 22), comanda de extra (C2-25), perfil de apoio (C2-26) | nenhum arquivo | S02, S03, S04, S05, S09 |
| 7 | **Blocos das abas do Painel incompletos e iguais para todo cliente**: Fiscal sem DCTFWeb/Reinf/federais, intimações e malhas, reforma e comunicação; Notas sem eventos posteriores e emissão; DP sem guias e holerites, convenções, DET; Contábil sem triagem e extratos e sem relatórios anuais; Societário sem comunicações oficiais e sem a tela "App do cliente"; Gestão sem catálogo local, compliance, auditoria e relatórios consolidados; números da Metalúrgica Andrade para todos | `telas/painel/*.tsx`, `dados/painel.ts`, `dados/painel-abas.ts` | S02, S03, S04 |
| 8 | **Sem assistente de implantação do escritório, primeiro acesso por convite e Raio-X do Drive**; Configurações sem a aba **Conectores e cofre** (saúde, custo, teto, credenciais, saúde das rotinas D-38) | `telas/LoginTela.tsx` só entra; `telas/config/` tem seis abas | S09 |
| 9 | **Busca global e seletor de cliente incompletos**: não há busca global; o seletor não tem favoritos, recentes, grupos econômicos nem atalho de teclado; não há troca de contexto mãe e contratante (BPO entre escritórios) | `components/compostos/seletor-cliente.tsx`, `Moldura.tsx` | S01 (contexto BPO: S08) |
| 10 | **Pacote Jurídico e fases futuras sem tela**: nenhum item Jurídico; Consultoria só com as atividades da fase 1 (as 46 da fase 4 só como "simulações"); terceiro setor, nichos e PF (IRPF, carnê-leão) sem blocos; BPO entre escritórios (C2) e portal do convidado ausentes | `telas/painel/consultoria.tsx`; nada para S11 | S03, S08, S11 |

---
## S01 · Início e moldura

Escopo: a casca do sistema (barra lateral, cabeçalho, celular), as três abas do Início (Assistente, Time, Visão geral), a gaveta do chat, o sino e as notificações, Minha conta, a busca global, o seletor e a troca de cliente, o modo de espera. Fontes principais: 02, 9 e 11; 03, 2, 3 e 4; 01, 2.5, 8 e ad. 22; README do protótipo.

### S01-T01 · Moldura: barra lateral, cabeçalho e navegação no celular

**Objetivo.** Situar a pessoa: onde está, de quem é o contexto, o que pede atenção. Igual em todo módulo (03, 2.0).

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Barra lateral | Logotipo do tema (ou sigla), módulos com ícone (inativo duotone, ativo preenchido), contador por item (confirmações do Timesheet, não lidas da comunicação interna, cartões), divisória, conta, Suporte e Configurações no pé | Assinatura (pacotes e módulos), Vínculo usuário × setor, Tema |
| Cabeçalho | Abas internas do módulo (nome curto; título completo na tela), selo "contando tempo", sino com contagem, seletor de cliente (quando o módulo usa) | Preferência, Notificação |
| Celular | Barra reduzida (menu, sino, código do cliente); abas rolando; menu inferior Home, Tarefas, Pendências, Chat, Mais (03, 2.6) **[o protótipo usa gaveta no lugar do menu inferior; decidir]** | — |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A01 | Abrir e recolher a barra (botão e Ctrl/Cmd+B) | Anima; fechada mostra só ícones com nome no tooltip; escolha lembrada no ultrawide | todos | PLANO, decisão 6 |
| S01-A02 | Trocar de módulo e de aba interna | Pílula desliza; aba e cliente entram no endereço (`Destino`) **[o 03, 2.3 pede URL; o protótipo não tem roteamento por URL]** | todos | 03, 2.3 |
| S01-A03 | Ver só o que o vínculo permite | Item e aba que a pessoa não tem não aparecem (nunca cinza); Painel exige pacote Contábil e setor contábil; Clientes aparece sem Painel; BPO exige setor e módulo | todos | 03, 2.0 e 9.1 |
| S01-A04 | Contador de atrasadas na aba | Cada aba do Painel mostra as atrasadas do setor no cliente ou carteira; zero não mostra | todos | 03, 2.3 |
| S01-A05 | Menu da conta | Nome, papel e setores (leitura), Minha conta, claro/escuro, Suporte, sair | todos | 03, 2.2 |
| S01-A06 | Abrir menu e gaveta no celular | Gaveta com os módulos; menu inferior com cinco destinos (se adotado) | todos | 03, 2.6 |
| S01-A07 | "Edite no computador" | No celular, tela de configuração e edição mostra aviso e só leitura | todos | 03, 2.6 |

- **Integrantes:** só aparecem pelos contadores e pelo indicador "time trabalhando".
- **Permissões:** visibilidade por assinatura e vínculo (03, 2.0 e ad. 19); Configurações só Administrador.
- **APIs simuladas:** nenhuma.
- **Protótipo tem:** barra expansível com animação e atalho, módulos, Suporte e Configurações no pé, abas segmentadas, selo de tempo, responsivo de 390 px a 3440 px (`telas/Moldura.tsx`, `components/compostos/barra-lateral.tsx`, `cabecalho-modulo.tsx`, `telas/modulos.ts`).
- **Falta:** roteamento por URL (aba + cliente); menu inferior do celular (ou decisão de manter a gaveta); item Conversas internas com contador (S05 registra, S01 só acomoda); item Jurídico (S11); contadores reais por item (hoje fixos em `modulos.ts`).

### S01-T02 · Início › Assistente (chat Geral)

**Objetivo.** O chat grande que abre o sistema: perguntar qualquer coisa, pedir ao time e acompanhar o pedido até o fim na mesma conversa (02, 9.1 e ad. 22 "o Geral acompanha").

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Título e orb | "No que posso ajudar?", orb do Assistente (contraste do tema, vivo, segue o cursor) | Tema, Integrante (`tipo` Geral) |
| Sugestões | Pedidos frequentes por papel e contexto; "Pergunte sobre a lei"; "Peça ao time" | Configuração local |
| Avisos básicos | Uma linha por aviso do time, abaixo do título; o completo mora na Visão geral | Notificação (`agente`) |
| Conversa | Mensagens com cartões (tabela, documento, guia, cálculo, citação legal, pré-visualização de mensagem, aprovação, encaminhamento, tarefa, conversa do CRM) e "ver na aba" | Sessão de integrante (chat por usuário, integrante e cliente ou carteira) |
| Campo | Texto, anexar, ditado (pt-BR), enviar; anel de limite de uso e "?" fora do campo | Uso de IA, Assinatura (limites) |
| Histórico | Conversas do cliente agrupadas por Hoje, Ontem, Esta semana, Antes | Sessão de integrante |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A08 | Enviar pergunta | Roteador decide: lei (Consultor responde com citação), consulta (tabela), cálculo, ação de um setor (encaminha), vários setores (encaminha ao primeiro e cria tarefas), confiança baixa (pergunta com dois botões) | todos | 02, 9.1; 07, 2 |
| S01-A09 | Peça ao time (fluxo ponta a ponta) | Passagem animada ao integrante; cartão de trabalho com etapas; retorno ao Assistente; passagem ao próximo; fechamento com tabela, documento ou cartão de aprovação (o mesmo do chat do integrante) | todos | 02, ad. 22 |
| S01-A10 | Pergunta sobre a lei | Cascata em etapas visíveis; resposta no modelo de `legal.consultar`: resposta direta, fundamento por afirmação, trechos com vigência e link, cálculo com origem, divergências, ressalvas, grau de segurança, data considerada, versão da base; abstenção explícita quando não acha base | todos | 07, 3.2 e 7.4 |
| S01-A11 | Decidir cartão de aprovação no chat | Aprovar, Editar e aprovar (abre os argumentos editáveis), Recusar (com comentário); executa de verdade; some de todos os lugares | quem pode aprovar | 01, 6.4; 02, ad. 22 |
| S01-A12 | "Ver na aba" num cartão | Abre a aba certa no cliente certo com o filtro aplicado | todos | 03, 2.5; 02, ad. 16 |
| S01-A13 | Abrir documento do cartão | Visualizador na marca do escritório; "enviar ao cliente" vira cartão | todos | 02, 9.3 |
| S01-A14 | Pré-visualização de mensagem | Editar texto e canal; "enviar" vira cartão de aprovação; envio grava na conversa certa do CRM | todos | 02, 9.3 |
| S01-A15 | Nova conversa, limpar, histórico | Nova no mesmo cliente; limpar pede confirmação e não apaga cartões pendentes; histórico no título | todos | 02, ad. 22 |
| S01-A16 | Trocar de cliente | A sessão base troca sozinha ("agora falando da Empresa Y") | todos | 02, ad. 22; 03, 2.5 |
| S01-A17 | Ditar | Texto cai no campo para revisar antes de enviar; sem suporte do navegador, botão some | todos | 02, ad. 22 |
| S01-A18 | Anexar arquivo ao pedido | Vira Documento do cliente (classificado) e entra no contexto do pedido **[sem regra no plano sobre a pasta de destino]** | todos | 04, 8.1 (análogo) |
| S01-A19 | Ver limites | Anel: "% do limite de 5 horas · renova às HH:MM"; clique: todos os limites (5 h e 7 dias); vermelho a partir de 95% | todos (Membro só %) | 02, ad. 22; 03, P10 |
| S01-A20 | Limite atingido | Faixa "cheguei ao limite desta janela; o chat continua, os trabalhos automáticos esperam" | todos | README, Aba Time |
| S01-A21 | Pergunta sobre o sistema | O Geral encaminha ao assistente de ajuda (sem gastar limite de IA) e oferece abrir o Suporte | todos | 02, ad. 25 |
| S01-A22 | Condição em linguagem natural ("me avise quando...") | O Geral devolve a regra em português e tabela com cartão sim / editar / não; com o sim, vira job do integrante; o que não compila volta "não consigo vigiar isso porque..." | todos | 02, 7.3 |
| S01-A23 | Pauta da reunião semanal | Pedido "monte a pauta da semana" devolve atrasos, riscos e pendências por setor (C2-28, só a ideia) | Gestor, Administrador | C2-28 |
| S01-A24 | Clicar num aviso básico | Abre o item exato (tarefa, conversa, integrante, fatura) | todos | 01, ad. 22 |

- **Estados:** vazio (orb grande, sugestões); pensando (orb animado, etapas); erro do motor (abstenção com o que pesquisou); limite atingido; sem plano de IA (só ajuda e pessoas do suporte, 02, ad. 25).
- **Integrantes:** o Geral só roteia, consulta (ler) e acompanha; nunca executa efeito em setor (02, 9.1). Consultor responde a lei. Os do setor fazem.
- **Permissões:** tudo pelo escopo do usuário (o chat "não encontra" cliente fora do escopo, 02, 9.5).
- **Entidades:** Integrante, Sessão de integrante, Cartão de aprovação, Tarefa, Documento, Mensagem entre integrantes, Job agendado.
- **APIs simuladas:** API-01, API-02.
- **Protótipo tem:** chat com conversas por cliente, histórico, nova e limpar, ditado, anel de limite, avisos básicos, "Peça ao time" acompanhado, duas perguntas de lei com cascata e cartão legal (`telas/AssistenteTela.tsx`, `useConversa.ts`, `useHistorico.ts`, `pedidoAoTime.ts`, `components/compostos/cartoes-chat.tsx`, `cartoes-legal.tsx`, `limite-uso.tsx`).
- **Falta:** roteamento de pergunta de sistema ao assistente de ajuda; condição em linguagem natural; cartões de cálculo e de pré-visualização de mensagem genéricos; pauta semanal; mais roteiros por setor (hoje poucos pedidos simulados); anexar com destino no índice.

### S01-T03 · Início › Time (chat dos integrantes)

**Objetivo.** Ver e conversar com cada integrante: o que faz, o que espera de você, o que fez (02, 9.2; 02, ad. 22).

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Lista | Busca; Assistente e Consultor fixos; os demais por urgência (precisa de você, erro, trabalhando, concluído, disponível, em espera); linha do que faz; contador; pausado e "em observação" marcados; "Novo integrante" | Integrante, Item de fila, Cartão de aprovação |
| Cabeçalho do chat | Orb grande, nome, estado, setor e função, fila, cartões pendentes, % do limite, menu | `integrante.status` (02, ad. 16) |
| Faixa acima do campo | Cartões que ainda esperam nesta conversa, com "ir ao primeiro" | Cartão de aprovação |
| Conversa | Cartões: aviso (fiz, decisão, informação), aprovação, tarefa, documento, conversa do CRM, encaminhamento, tabela, passagem de trabalho entre integrantes de pessoas diferentes | Sessão de integrante, Mensagem entre integrantes |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A25 | Abrir chat de um integrante | Histórico próprio; contexto do cliente selecionado; avisa quando o pedido não cabe nele | todos | 02, 9.2 |
| S01-A26 | Pedir algo ao integrante | Mesmo motor de trabalho simulado (pensa, etapas, resultado, cartão) | todos | README, Demonstração viva |
| S01-A27 | Usar sugestão do integrante | Sugestões por setor viram trabalho | todos | README |
| S01-A28 | Pausar e retomar | Pausado: faixa com "Retomar"; jobs esperam | dono | 02, ad. 22 |
| S01-A29 | Ver memória | Lista privada do integrante e a do setor (só leitura); corrigir e remover pela ferramenta `memoria.*` (o retorno prova) **[a tela de memória privada não existe]** | dono | 02, 5; 01, 9 |
| S01-A30 | Configurar integrante | Gaveta: instruções editáveis (camadas 1 e 2 travadas), setores, clientes, ferramentas com nível (fora do escopo do dono marcado "removido"), canal de aviso, limites | dono | 01, 9; 02, 11.2 |
| S01-A31 | Ver jobs e gatilhos | Últimos 30 resultados de cada job (vazio, ok, parcial, falhou) e custo (custo só Gestor e Administrador); ligar e desligar gatilhos sugeridos | dono | 02, 7.1 |
| S01-A32 | Histórico do mês passado | Sessões anteriores (reset em marcos) | dono | 02, 6.4 |
| S01-A33 | Decidir cartão no chat | Igual a S01-A11 | quem pode | 01, 6.4 |
| S01-A34 | Passagem de trabalho | Linha "Fiscal (de Fernanda) passou X da Padaria para DP (de Ana)"; abre a tarefa | envolvidos | 02, 8.4 |
| S01-A35 | Liberar depois da observação | Integrante criado fica 14 dias com tudo em cartão; no fim, cartão "posso fazer sozinho?" | dono | 02, 11.1 |
| S01-A36 | Pergunta de promoção | Cartão "posso passar a fazer X sozinho?" (30 cartões, 95% sem edição); sim vale para sempre, não silencia 90 dias | Administrador | 02, 3.3 |

- **Estados:** sem histórico (quem ele é e sugestões), pausado, limite atingido, erro (falha consecutiva avisa dono e Administrador, 02, 7.2 gatilho 22), em observação.
- **Integrantes:** todos do usuário, inclusive os do BPO (um por função) e os criados.
- **Permissões:** cada pessoa só vê os próprios integrantes; o integrante obedece à interseção com o dono (01, 3.3).
- **Entidades:** Integrante, Sessão de integrante, Item de fila, Memória, Job agendado, Gatilho por evento.
- **APIs simuladas:** API-01.
- **Protótipo tem:** lista, cabeçalho com menu, estados vazio, pausado e limite, cartões, passagem, faixa de pendentes, orb espelhado (`telas/TimeTela.tsx`, `components/compostos/lista-integrantes.tsx`, `cabecalho-integrante.tsx`, `ambiente/integrante-vivo.ts`).
- **Falta:** telas de memória (ver, corrigir, remover), configurar integrante com ferramentas e níveis, jobs e gatilhos com histórico, promoção e fim da observação como cartões reais.

### S01-T04 · Novo integrante (fluxo)

**Objetivo.** Criar um integrante descrevendo em português (02, 11).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A37 | Descrever | Campo livre ("toda segunda, me diga quais clientes do Presumido...") | todos | 02, 11.1 |
| S01-A38 | Receber proposta | Nome, cor do orb, função, setores, ferramentas com nível (o que o usuário não tem vem "você não tem isso; removido"), gatilhos com a regra em português e tabela | todos | 02, 11.1 |
| S01-A39 | Revisar e editar | Formulário editável; nome não imita integrante padrão nem pessoa real | todos | 02, 11.2 |
| S01-A40 | Ativar | Aviso dos 14 dias de observação; aparece na lista | todos | 02, 11.1 |
| S01-A41 | Limite de quantidade | Acima de `integrantes_por_usuario` (padrão 5), bloqueia com o motivo | todos | 02, 11.2 |
| S01-A42 | Usar modelo publicado | Escolher modelo do escritório; interseção recalcula; não copia memória, clientes nem credenciais | todos | 02, 11.3 |

- **Protótipo tem:** fluxo descrever → proposta → revisar → ativar (`components/compostos/novo-integrante.tsx`).
- **Falta:** limite de quantidade, criação a partir de modelo, edição das ferramentas com nível.

### S01-T05 · Início › Visão geral (a Home)

**Objetivo.** Responder "o que pede a minha atenção hoje?" em widgets que a pessoa arranja (03, 4).

| Widget | O que mostra | Dados | Papel |
| --- | --- | --- | --- |
| Avisos do time | Desde o último acesso, por integrante, em três blocos (fiz, decisão, informação); cartões em lote com contagem; passagens; urgente a menos de 12 h | Notificação `agente` e `aprovacao` (`corpo_estruturado`) | todos |
| Indicadores | Membro: atrasadas, vencem hoje, entregues × pendentes, conversas sem resposta, horas da semana com a parte estimada; Gestor: do setor com quebra por pessoa; Administrador: do escritório por setor; cada número abre a lista | `indicador.listar` | por papel |
| Calendário | Dia, semana, mês; responsável (eu, equipe, integrante, todos); cor por setor; obrigações iguais agrupadas ("PGDAS-D × 14"); feriados e prorrogações; arrastar o prazo interno | Tarefa, Obrigação | todos |
| Medidor do mês | Obrigações do mês entregues × total | Tarefa `origem = obrigacao` | todos |
| Pendências por cliente | Cliente × itens × dias × cobranças; cobrar, marcar recebida; "recebido pelo app" | `pendencia.listar` (CTB-201) | todos |
| Linha do tempo | Últimos 30 eventos do cliente (ator: pessoa, integrante e dono, sistema, core); em Todos, da carteira por setor | Evento | todos |
| Time agora | Integrantes trabalhando e o que fazem | Integrante | todos |
| Sem responsável e SLA a vencer | Conversas do CRM sem dono e prazo de resposta | Conversa | Gestor, Administrador |
| Carga prevista | Tarefas abertas × horas padrão por pessoa | Tarefa, Atividade | Gestor |
| Implantações em andamento | Clientes em trilha, parados no elo SOC-014/SOC-011 | Tarefa (trilha) | Administrador |
| Faixas vencido · 7 dias · 30 dias e "Mais urgentes" | Três mais urgentes no topo (D-20, como ideia) | Tarefa | todos |
| Primeiros passos | Faixa até cumprir a fase 0: importar clientes, conectar armazenamento, convidar equipe, campanha SOC-014 e SOC-011 | Escritório | Administrador |
| Widgets do Jurídico | Saúde da captura, prazos hoje e semana (S11 entrega; entram na galeria) | — | quem tem o pacote |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A43 | Editar painel | Widgets tremem; arrastar (mouse, toque, teclado), mudar tamanho, esconder, galeria "Adicionar widget", "Restaurar padrão" (padrão do papel); Esc conclui | todos | 03, 4.3 |
| S01-A44 | Decidir cartão no aviso | Aprovar, editar, recusar; decidir em lote | quem pode | 03, 4.1 |
| S01-A45 | Abrir tarefa, chat do integrante ou item do aviso | Navega ao item exato | todos | 03, 4.1 |
| S01-A46 | Arrastar no calendário | Muda só o prazo interno (`tarefa.reprogramar`); passar do legal pede confirmação com a multa estimada; prazo legal nunca arrasta | Membro nas suas; Gestor em todas | 03, 4.1 e P2 |
| S01-A47 | Filtrar calendário | Responsável, setor, status, só atrasadas; padrão "eu" para Membro, "equipe" para Gestor | todos | 03, 4.1 |
| S01-A48 | Cobrar pendência | Gaveta com o texto da régua e o canal (pré-visualização); irreversível; grava na conversa certa | todos | 03, 4.1 |
| S01-A49 | Marcar pendência recebida | Baixa o item; a tarefa volta a andar | todos | 01, 6.5 |
| S01-A50 | Clicar num indicador | Abre a lista filtrada | todos | 03, 4.1 |
| S01-A51 | Seguir primeiros passos | Cada passo leva à tela de configuração; some ao cumprir | Administrador | 03, 4.3 |

- **Estados vazios:** calendário ("nenhuma tarefa nesta semana; gere o calendário de dezembro em Obrigações"), pendências ("nenhum cliente deve documento"), avisos ("o time não teve nada a dizer desde ontem"), linha do tempo em Todos ("selecione um cliente"); carteira vazia ("nenhum cliente na sua carteira; fale com o Gestor") (03, 4.3 e 9.3).
- **Integrantes:** publicam os avisos; o Atendimento consolida "sem resposta" para o Gestor.
- **Permissões:** conforme a coluna Papel; custo e rentabilidade nunca para Membro.
- **Entidades:** Notificação, Tarefa, Obrigação, Evento, Conversa, Preferência (`blocos_home`).
- **APIs simuladas:** nenhuma.
- **Protótipo tem:** indicadores, medidor, calendário da semana, avisos completos com decisão, pendências por cliente, linha do tempo, Time agora, grade editável (`telas/VisaoGeralTela.tsx`, `components/compostos/widgets.tsx`, `components/widgets/grade.tsx`).
- **Falta:** calendário dia e mês com arrastar (componente vem de S04), indicadores por papel com quebra por pessoa, "sem responsável e SLA", carga prevista, implantações em andamento, faixas D-20, primeiros passos, widgets do Jurídico.

### S01-T06 · Gaveta do chat (em qualquer módulo)

**Objetivo.** Falar com o Geral ou com um integrante sem sair da tela (03, 2.5).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A52 | Abrir a gaveta pela borda | Abre no Geral, com o cliente da tela como contexto | todos | 03, 2.5 |
| S01-A53 | Trocar para um integrante | Ícones à direita (um por integrante; ponto de pendente ou trabalho); "+" cria integrante | todos | 03, 2.5 |
| S01-A54 | "Falar com [integrante]" vindo do cabeçalho da aba | Abre a gaveta no chat dele | todos | 03, 5 |
| S01-A55 | Cartão com "ver na aba" | Igual a S01-A12 | todos | 03, 2.5 |

- **Estados:** largura fixa em tela larga; cobre o conteúdo em tela média; tela inteira no celular.
- **Protótipo tem:** `GavetaChat` em `telas/ModuloTela.tsx`. **Falta:** histórico do Geral dentro da gaveta (hoje começa vazia), aviso "agora falando da Empresa Y", "+" criar integrante.

### S01-T07 · Sino, central de avisos e toasts

**Objetivo.** Uma central para tudo o que o sistema avisa, com o mesmo registro da Visão geral e do chat (01, 8; 03, 2.2).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A56 | Abrir o sino | Lista da conta; filtro todos e não lidos; por categoria (aprovação, tarefa, pendência, conversa, documento, prazo, agente, sistema) **[o filtro por categoria falta]** | todos | 01, 8 |
| S01-A57 | Decidir cartão no sino | Aprovar, editar, recusar | quem pode | 03, 2.2 |
| S01-A58 | Abrir o item do aviso | Navega ao item exato e marca lido | todos | 01, ad. 22 |
| S01-A59 | Marcar todos como lidos; descartar | Some da contagem | todos | 01, 8 |
| S01-A60 | Agrupamento | "5 documentos da Empresa X" abre a lista | todos | 01, 8 |
| S01-A61 | Toast ao terminar trabalho | Some sozinho; não aparece se a pessoa já está vendo o item | todos | README |
| S01-A62 | Resumo diário | Notificação do sistema na hora preferida, agrupada por cliente e setor **[simular pelo painel Demonstração]** | todos | 01, 8; 02, 7.4 |
| S01-A63 | Preferências | Abre Minha conta na seção de avisos | todos | REVISAO, 4 |

- **Regras:** urgente fura silêncio; alta respeita; normal vai ao resumo; baixa só na central; cartão a menos de 12 h vira urgente (01, 8).
- **Protótipo tem:** central por conta com não lidos, marcar todos, preferências, toasts (`ambiente/interface.tsx`). **Falta:** filtro por categoria, descartar, agrupamento, resumo diário, prioridade visível.

### S01-T08 · Minha conta

**Objetivo.** O que é da pessoa (03, 2.2; 01, ad. 22).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A64 | Preferências de aviso | Por categoria: canais em ordem (sistema, WhatsApp, e-mail), silêncio, resumo diário com hora, mínimo para canal externo | todos | 01, 8 |
| S01-A65 | Trocar senha | Gaveta com validação | todos | 01, ad. 22 |
| S01-A66 | Segundo fator | Ligar e desligar; travado para Administrador, com o motivo | todos | 01, 2.5 |
| S01-A67 | Sessões abertas | Lista com aparelho e último uso; encerrar uma ou todas | todos | 01, ad. 22 |
| S01-A68 | Claro e escuro | Alterna e lembra | todos | 03, 2.2 |
| S01-A69 | Ver papel e setores | Só leitura ("papel e setores são editados pelo Administrador") | todos | 03, 2.2 |

- **Protótipo tem:** `ambiente/conta.tsx` (preferências, senha, segundo fator, sessões). **Falta:** silêncio e mínimo para canal externo conferidos contra 01, 8; encerrar sessão com efeito visível.

### S01-T09 · Busca global

**Objetivo.** Achar cliente, pessoa, tarefa, documento, conversa, obrigação e mensagem interna só dentro do escopo, e cair na aba certa (03, 2.2; `busca.global`, 03, A4).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A70 | Abrir a busca (ícone e atalho de teclado) | Campo sobre a tela | todos | 03, 2.2 |
| S01-A71 | Digitar | Resultados agrupados por tipo; aceita CNPJ com e sem pontuação, código no core, apelido; inclui transcrição de áudio do CRM | todos | 03, 3.1; 04, 4.1 |
| S01-A72 | Escolher resultado | Leva à aba certa no cliente certo (troca o cliente com aviso de uma linha) | todos | 03, 3.2 |
| S01-A73 | Sinônimos | "Legal" e "Legalização" acham Societário | todos | 00, 15 |
| S01-A74 | Fora do escopo | Não aparece; módulo fora da assinatura não devolve o tipo; conversa de outro setor não aparece nem na busca | todos | 03, 2.3; 04, 10.1 |

- **Estados:** sem resultado ("nada encontrado no que você pode ver"), digitando.
- **Protótipo tem:** busca só dentro de telas (Arquivos, Conversas, seletor). **Falta:** a busca global inteira.

### S01-T10 · Seletor de cliente e troca de contexto

**Objetivo.** Escolher o cliente (ou a carteira) que é contexto do módulo (03, 3).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A75 | Abrir seletor | Busca por nome, fantasia, CNPJ/CPF, código no core, apelido; código - nome; regime, UF, situação, grupo | todos | 03, 3.1 |
| S01-A76 | Favoritar e usar recentes | Até 10 favoritos; 10 recentes por aparelho | todos | 03, 3.1 |
| S01-A77 | "Todos" (carteira) | Contagem; com carteira ligada, "todos os meus" | todos | 03, 3.3 |
| S01-A78 | Escolher grupo econômico | Seleciona as empresas como conjunto; "2 de 4 empresas visíveis" | todos | 03, 3.4 |
| S01-A79 | Trocar de cliente | Troca abas, tarefas, chat e linha do tempo; não troca aba, filtros nem gaveta | todos | 03, 3.2 |
| S01-A80 | Abrir item de outro cliente | Troca com aviso de uma linha | todos | 03, 3.2 |
| S01-A81 | Cliente sai do escopo | Volta a Todos com aviso | todos | 03, 3.2 |
| S01-A82 | Trocar contexto mãe e contratante (modo BPO) | Sem novo login; tema muda junto; evento (S08 desenha o conteúdo) | equipe do BPO | 03, 2.2; 01, ad. 23 |

- **Protótipo tem:** busca por código, nome e CNPJ, "Todos", largura mínima (`components/compostos/seletor-cliente.tsx`). **Falta:** favoritos, recentes, grupos, atalho, aviso de troca, cliente fora do escopo, troca de contexto do BPO.

### S01-T11 · Modo de espera e registro de tempo

**Objetivo.** Contar tempo só onde ele é registrado sozinho, sem deslogar (01, 2.5).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S01-A83 | Selo "contando tempo" | Só no Painel com cliente e no CRM (menos Números) | todos | 01, 2.5 |
| S01-A84 | Entrar em espera | Sem clique, tecla, rolagem ou digitação por `inatividade_min`: cobre a área com "Em espera"; tempo para no último evento | todos | 01, 2.5 |
| S01-A85 | Continuar | Abre sessão nova sem senha; se havia tarefa aberta, pergunta "você estava em FIS-019; continuar?" | todos | 03, 7.3 |
| S01-A86 | Simular 3 min parado | Painel Demonstração dispara a espera | demonstração | README |
| S01-A87 | Suporte e comunicação interna na espera | Continuam acessíveis (presença "em espera" na comunicação interna) | todos | 03, ad. 23; 11, 3 |

- **Protótipo tem:** `ambiente/espera.tsx`. **Falta:** pergunta da tarefa aberta, presença ligada à comunicação interna.

## S02 · Painel A: anatomia da aba, Societário, Obrigações, Notas

Escopo: a anatomia comum das oito abas (que S03 e S04 consomem), a ficha do cliente, as abas Societário, Obrigações (dinâmica por setor) e Notas, com visão de cliente e de carteira. Fontes: 03, 3, 5, 6.1 a 6.3 e adendos; 01, 4; 08, 4 e 5; atividades SOC, CIC, FIS-001 a 003, 023, 024, 046, 047 e NFE.

### S02-T01 · Anatomia comum de uma aba do Painel

**Objetivo.** Toda aba repete a mesma estrutura: cabeçalho fixo e widgets (03, 5; 03, ad. 20).

| Parte | O que mostra | Ações e dados |
| --- | --- | --- |
| Faixa de ciclo de vida | "Em implantação · desde 3/11 · 14 de 31 passos · corte 10/2026 · ver trilha" (também em saída e baixa); `inativo` e `encerrado` deixam a aba só leitura | Tarefa (trilha), Cliente.`estado_ciclo` (03, 8.1) |
| A. Cabeçalho (fixo) | Perfil vigente que importa ao setor, vigência e "histórico", faixa de aviso (ex.: divergência com a Receita), integrante do setor com o que faz para o cliente, "Falar com", responsável diferente do padrão, "trabalhando em: FIS-019 · 1h40" com concluir | Versão do perfil, `integrante.status` |
| B. Pendências do setor | Do cliente e de terceiros (órgão): o que falta, desde quando, cobranças; cobrar, marcar recebida | `pendencia.listar` |
| C. Blocos da aba | Os da seção 6 de cada aba, como widgets | — |
| Obrigações do setor (novo) | As próximas obrigações do setor do cliente (ou da carteira) com o mesmo dado da aba Obrigações e "ver todas" (abre Obrigações filtrada) | Tarefa `origem = obrigacao` por setor dono (03, ad. 14/11) |
| D. Documentos | Por competência e tipo: nome, origem, quem enviou, hash curto, marca "visível no app" com a pasta; fila "confirmar origem" | `documento.listar` (01, 4.11) |
| E. Ações | Botões com o nível no rótulo (preparar, executar com aprovação, executar); "falta X" quando falta pré-requisito; na carteira, "N clientes" em lote | Ferramenta |
| F. Tarefas deste setor | Componente comum (S04): filtros responsável, status, competência; "+ Nova"; 50 mais urgentes na carteira | `tarefa.listar` |
| G. Relatórios | Gerar (período, cliente ou carteira, responsável), exportar CSV e PDF com o tema, agendar envio | `relatorio.gerar` |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S02-A01 | Ver histórico do perfil | Gaveta com versões e datas; "perfil em" uma data | todos | 03, 5; 01, ad. 22 |
| S02-A02 | Falar com o integrante | Abre a gaveta no chat dele com o cliente como contexto | todos | 03, 5 |
| S02-A03 | Abrir a ficha do cliente | Gaveta da ficha (S02-T05) | todos | 01, ad. 22 |
| S02-A04 | Cobrar pendência | Pré-visualização do texto da régua e do canal; irreversível; grava na conversa certa e avisa com link | todos com o setor | 03, 4.1 |
| S02-A05 | Marcar recebida | Baixa o item; tarefa volta a andar; evento | todos com o setor | 01, 6.5 |
| S02-A06 | Abrir documento | Visualizador (gera "visto") | todos | 03, 5 |
| S02-A07 | Enviar documento ao cliente | Cartão de aprovação; envio pelo contato que recebe o assunto; registro de entrega | todos com o setor | 03, 5 |
| S02-A08 | Mover ou reclassificar documento | `documento.classificar` com diff | todos com o setor | 03, 5 |
| S02-A09 | Forçar visível ou oculto no app | Registra quem forçou | Gestor, Administrador | 01, ad. 22 |
| S02-A10 | Ver registro de entrega | Quem abriu, baixou, confirmou e quando | todos | 06, 5.2 |
| S02-A11 | Confirmar origem de arquivo da nuvem | Fila "confirmar origem" (sem `enviado_por`) | todos com o setor | 03, 5 |
| S02-A12 | Preparar | Gera rascunho editável; nada sai | conforme o nível | 03, 5 |
| S02-A13 | Executar com aprovação | Posta cartão no chat do integrante e avisa com link; aprovar executa | conforme o nível | 03, 5; 02, ad. 22 |
| S02-A14 | Executar | Executa e mostra o evento | conforme o nível | 03, 5 |
| S02-A15 | Ação em lote na carteira | "N clientes": um cartão por cliente, em lote, com aprovar em lote | Gestor, Administrador | 03, 3.3 e 5 |
| S02-A16 | Gerar, exportar e agendar relatório | Gaveta: período, formato, agendar todo mês (vira job do integrante) | todos | 03, 5 G |
| S02-A17 | Editar o painel da aba | Grade editável, arranjo separado para cliente e carteira | todos | 03, ad. 20 |
| S02-A18 | Ver "feito por João, de Fulano" | Link ao evento do item que o integrante criou ou tocou | todos | 03, 5 |

- **Estados:** cliente em `prospect` ou `proposta` mostra só ficha, pessoas e contrato (03, 6.1); `inativo` e `encerrado` só leitura com "encerrado em DD/MM; retenção até AAAA"; carteira vazia; aba sem dados ("sem empregados; a primeira admissão abre DP-105").
- **Integrantes:** o do setor aparece no cabeçalho, nos itens que tocou e nos cartões pendentes no topo das ações.
- **Permissões:** botão que a pessoa não pode chamar não aparece (03, 5 E); matriz 03, 9.2.
- **Protótipo tem:** cabeçalho com histórico e integrante, pendências, ações com nível e "falta X", documentos com "visível no app", relatórios com gerar, exportar e agendar, grade com padrões por aba e variante (`components/compostos/painel-aba.tsx`, `telas/painel/comuns.tsx`, `telas/PainelTela.tsx`, `telas/painel/padroes.ts`).
- **Falta:** faixa de ciclo de vida, "trabalhando em" no cabeçalho, bloco "Obrigações do setor" (componente para S03 e S04), mover documento, confirmar origem, registro de entrega por documento no bloco, lote que gera um cartão por cliente, "feito por" com link ao evento, estados `prospect`/`inativo`/`encerrado`.

### S02-T02 · Painel › Societário (Clientes e Societário)

**Objetivo.** A base de tudo: cliente, pessoas, acessos, certificados, contratos, legalização e ciclo de vida (03, 6.1). SOC-001 é pré-requisito de 576 atividades.

| Bloco (com cliente) | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Ficha e perfil temporal | Versão vigente com data e linha de versões; divergência Receita × cadastro em faixa | SOC-001, 002, 003, 034 (S); 005, 006 (P) | Cadastrar pelo CNPJ (executar); versionar perfil (executar com aprovação, regera o calendário); corrigir digitação (correção no lugar com registro); perfil em data |
| Pessoas e identidades | Sócios, contatos por assunto, telefones, e-mails, papel no app por serviço, opt-in | SOC-004 (S); GES-041 (P) | Adicionar; religar identidade; convidar para o app; definir quem vê o quê; fundir pessoa (cartão ao Gestor) |
| Acessos e procurações | Órgão, serviço, validade, situação (confirmada, pedida, vencida) | SOC-011, 013, 014, PF-002 (O); SOC-012, FIS-007 (S); DP-042 (P) | Pedir ao cliente pela régua; confirmar no portal; registrar procuração fora da RFB |
| Certificados | Tipo, validade, serviços autorizados, trilha de uso; nunca o arquivo nem a senha | SOC-008, 009, 010, GES-058 (S) | Pedir A1 pelo app; registrar A3; ver trilha; certificado como serviço (C2-23, fase 3) |
| Contratos e honorários | Proposta, contrato, cláusulas mínimas, termo LGPD, PLD, honorário (resumo do Financeiro) | SOC-015, 016, 019, 020, 101, FIN-001 (P) | Gerar proposta e contrato (preparar); enviar para assinatura (executar com aprovação) |
| Legalização e processos | Processos por órgão, exigências, licenças com validade, atas, livros; renovação nos conselhos (C2-20); fiscalização de licença como processo (C2-21); taxa anual de licença municipal com guia na central do Fiscal (C2-22) | SOC-025 a 031, 033, 035, 041 a 043, 032, 105 (P); SOC-036 a 040, 109 (O) | Abrir processo (tarefa com checklist por UF); registrar andamento; calendário de renovações |
| Comunicações oficiais | Domicílio Judicial (cadastro, última leitura, citações) | SOC-007, SOC-046 (S) | Listar sem dar ciência; abrir avisa que conta como ciência |
| Ciclo de vida | Estado, trilha, marcos | CIC-001 (S); CIC-002 a 004, 007, 009, 010 (P); CIC-006 (O) | Mudar estado (executar com aprovação, Gestor); ver trilha (S04-T07) |
| App do cliente | Pessoas e papéis por serviço, pastas visíveis, serviços extras (ativo, disponível, oculto), instalação e último acesso | GES-041, 104 | Convidar, reenviar convite, revogar acesso, ligar serviço extra (03, ad. 16) |
| Preferência de entrega | Malote e papel (C2-09): entrega física, motoboy, protocolo de devolução | C2-09 | Marcar preferência; registrar malote com origem "malote" em Arquivos |
| Arquivos repetidos | Aviso ao analista do mesmo arquivo salvo duas vezes (D-05, como ideia) | D-05 | Abrir os dois no visualizador |

| Bloco (carteira) | O que mostra |
| --- | --- |
| Certificados a vencer | Cliente, tipo, vencimento em dias, régua em andamento |
| Clientes por estado | Prospect, proposta, aceito, em implantação, ativo, em saída, em baixa, inativo, encerrado; clicar filtra |
| Acessos pendentes | Clientes parados em SOC-014 e SOC-011, com dias e cobranças (03, 8.2) |
| Licenças e renovações | Vencimentos da carteira (C2-20, C2-22) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S02-A19 | Cadastrar cliente pelo CNPJ | Consulta simulada (API-12) preenche razão, CNAE, endereço, QSA; cria Cliente em `aceito` com a primeira versão do perfil | Membro do Societário, Gestor, Administrador | 01, 6.5; SOC-001 |
| S02-A20 | Versionar perfil | Gaveta com diff; data de vigência; cartão; ao aprovar, regera o calendário (aviso "regerado por mudança de perfil") | idem; aprova quem tem o nível | SOC-002; 03, 6.2 |
| S02-A21 | Corrigir digitação | Corrige a versão atual com "corrigido por X em tal data" | idem | 01, P2 |
| S02-A22 | Versionar com os dados da Receita | Da faixa de divergência (SOC-003) | idem | 03, 6.1 |
| S02-A23 | Adicionar contato e assuntos | Gaveta da ficha; assunto sem ninguém vai ao sócio | idem | 04, 5.4 |
| S02-A24 | Convidar contato para o app | Convite com papel e áreas por serviço; aparece em "convites pendentes" | idem | 06, 2.1 |
| S02-A25 | Pedir procuração ou acesso | Pendência `acao_externa` no app com passo a passo; régua | idem | 06, 6.4 |
| S02-A26 | Confirmar procuração | Consulta simulada do Integra-Procurações (API-06) fecha sozinho quando ativa | integrante (S) ou pessoa | SOC-012 |
| S02-A27 | Pedir A1 pelo app | Pendência com o motivo em linguagem simples; termo; envio direto ao cofre | idem | 06, 6.1 e 6.2 |
| S02-A28 | Registrar A3 | Cadastro sem arquivo | idem | 03, 6.1 |
| S02-A29 | Gerar proposta e contrato | Rascunho do modelo do tema; editar | idem | SOC-015, 016 |
| S02-A30 | Enviar contrato para assinatura | Cartão; provedor simulado (API-22); volta assinado ao índice | idem | 03, 6.1 |
| S02-A31 | Abrir processo de legalização | Tarefa com checklist por UF e órgão (abertura, alteração, baixa, licença, fiscalização) | idem | SOC-025 a 033; C2-21 |
| S02-A32 | Registrar andamento e exigência | Linha do tempo do processo; exigência vira pendência | idem | 03, 6.1 |
| S02-A33 | Ver Domicílio Judicial | Lista sem ciência; "abrir" avisa que dá ciência | idem | 03, ad. 17 |
| S02-A34 | Mudar estado do ciclo | Cartão com bloqueios (encerrado só sem obrigações remanescentes) | Gestor | CIC-001; 01, 4.2 |
| S02-A35 | Fundir clientes | Religa conversas, tarefas, horas e documentos; histórico "fundido em" | Administrador | 01, 6.5 |
| S02-A36 | Ligar serviço extra do cliente | Ativo, disponível, oculto; "tenho interesse" do app chega aqui | Gestor, Administrador | 06, 3.10 |
| S02-A37 | Revogar acesso ao app | Sessão do cliente cai; registros ficam | Gestor, Administrador | 06, 2.5 |
| S02-A38 | Marcar preferência de entrega (malote) | Campo na ficha; tarefas de entrega física nascem com checklist de protocolo | idem | C2-09 |
| S02-A39 | Lote na carteira | Pedir autorização de acesso a todos os parados; régua de certificados | Gestor | 03, 3.3 |

- **Estados e regras:** `prospect` e `proposta` só ficha, pessoas e contrato; certificado a 30 dias marca o bloco; nunca mostra senha nem conteúdo de procuração (03, 6.1).
- **Integrantes:** Societário faz sozinho SOC-001, 002, 003, 004, 007, 008, 009, 010, 012, 034, 046; prepara SOC-015, 016, 022, 026, 027, 032, 043; gatilhos `cliente.perfil.versionar`, `certificado.vencer_em_30_dias`, `cic.estado.mudar`, job semanal SOC-003, fiscalização de licença (C2-21) (02, 3.2 e ad. 14/11). Atendimento pede a renovação ao cliente pelo app (02, ad. 20). Exemplo de aviso: "Empresa X ficou inapta na Receita ontem... Decisão: regularizar ou falar com o cliente antes?".
- **Permissões:** Administrador tudo e funde; Gestor muda estado do ciclo; Membro edita ficha, pessoas, acessos, não muda estado nem funde (03, 9.2). Responsáveis por setor: Gestor e Administrador editam, Membro vê.
- **Entidades:** Cliente, Versão do perfil, Pessoa, Identidade, Conta de cliente, Convite, Grupo econômico, Credencial, Documento, Tarefa.
- **APIs simuladas:** API-06, API-12, API-14 (JUCESP, Bombeiros), API-22, API-29.
- **Protótipo tem:** os sete blocos com cliente e os dois de carteira, com dados da Metalúrgica Andrade (`telas/painel/societario.tsx`, `dados/painel-abas.ts`).
- **Falta:** comunicações oficiais, tela "App do cliente", acessos pendentes e licenças na carteira, C2-09, C2-20 a 22, D-05, fluxos de cadastrar pelo CNPJ, versionar com diff, mudar estado, fundir, abrir processo com checklist; dados por cliente.

### S02-T03 · Painel › Obrigações (Obrigações e Prazos), dinâmica por setor

**Objetivo.** O calendário vivo de toda obrigação, gerado do perfil × regras, com comprovação de entrega; agora com **setor dono por obrigação** e filtro por quem olha (03, 6.2 e ad. 14/11).

| Bloco | O que mostra | Ações (nível) |
| --- | --- | --- |
| Seletor de setores | Pessoa de um setor: nenhum seletor, só as dela. Vários setores: chips dos seus setores, todos marcados, desmarca para focar. Gestor e Administrador: "Meus setores · um setor · todos", padrão "meus setores" | Filtro persistido por aba (`usuario.preferencias.filtros_por_aba`) |
| Calendário do cliente | Obrigações da competência: prazo legal, interno, status, recibo, setor dono, integrante do setor do item | Gerar calendário do mês (executar, idempotente); reprogramar prazo interno |
| Atrasos e riscos (FIS-047) | Vence hoje, atrasado, em risco (pré-requisito faltando), multa estimada (M3) | Abrir tarefa; cobrar pré-requisito |
| Pré-requisitos da semana (FIS-046) | Certificado, procuração, gov.br, documentos | Pedir ao cliente |
| Comprovação (FIS-003, 023) | Recibo por obrigação com hash; sem recibo | Anexar manual; o integrante anexa o capturado |
| Regras por UF e prorrogações (FIS-024, 002) | Declarações estaduais; mudanças de prazo detectadas | Editar (versiona o perfil); confirmar prorrogação |
| Obrigações eventuais | Guias que só existem às vezes (ICMS, ISS, PIS/COFINS só com imposto: sem arquivo não é falta, D-23); pesquisa do IBGE PAC/PAS só quando a empresa é chamada (C2-15); DMED por CNAE de saúde (C2-16); taxa anual de licença (C2-22) | Marcar "chamada" ou "sem movimento" |
| Semana por cliente (carteira) | Tabela obrigação × cliente (formato Acessórias), com o mesmo filtro de setores | Gerar calendário em lote; cobrar em lote |
| Faixas no topo | Vencido · 7 dias · 30 dias e três mais urgentes (D-20, como ideia) | Clicar filtra |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S02-A40 | Escolher setores | Chips (vários setores) ou seletor "meus setores · um setor · todos" (Gestor, Administrador); a lista, os integrantes e as contagens mudam | todos | 03, ad. 14/11 |
| S02-A41 | Gerar calendário do mês | Cria as tarefas da competência por cliente e setor dono; idempotente (segunda vez diz "nada a gerar") | Gestor; integrante Fiscal no job | FIS-001; 03, 9.2 |
| S02-A42 | Reprogramar prazo interno | Gaveta com motivo; além do legal pede confirmação com multa | Membro (as suas), Gestor | 03, 4.1; A1 |
| S02-A43 | Abrir a tarefa da obrigação | Ficha da tarefa (S04-T04) | todos | 03, 6.2 |
| S02-A44 | Cobrar pré-requisito | Régua com o item certo | todos com o setor | FIS-046 |
| S02-A45 | Anexar recibo | Documento com hash; obrigação vira "entregue" | todos com o setor | FIS-003 |
| S02-A46 | Ver multa estimada | Cálculo com origem dos números (M3) | todos | FIS-047; 07, 5 |
| S02-A47 | Confirmar prorrogação | Muda o prazo legal com a fonte; o passado fica | Gestor | FIS-002 |
| S02-A48 | Editar regra por UF | Versiona o perfil | Membro do Fiscal, Gestor | FIS-024 |
| S02-A49 | Cancelar obrigação | Só Gestor, Administrador ou regeração; com motivo | Gestor, Administrador | 01, 4.8 |
| S02-A50 | Marcar obrigação eventual | "Empresa chamada pelo IBGE" cria a obrigação; "sem imposto" encerra a guia eventual sem acusar falta | todos com o setor | C2-15; D-23 |
| S02-A51 | Ver o que foi regerado | Selo "regerado por mudança de perfil" nas futuras não iniciadas | todos | 03, 6.2 |
| S02-A52 | Exportar a semana da carteira | CSV e PDF | todos | 03, 5 G |
| S02-A53 | Ver todas a partir do bloco de um setor | Chega na aba já filtrada pelo setor de origem | todos | 03, ad. 14/11 |

- **Estados:** sem calendário gerado ("gere o calendário de dezembro"), tudo entregue, setor sem obrigações, carteira vazia.
- **Integrantes:** o integrante mostrado é o do **setor do item** (Fiscal, DP, Contábil, Societário, Gestão). Fiscal: FIS-001 (job último dia útil 18h), FIS-002, 003, 046 (S); FIS-023, 024 (P); FIS-047 (O). DP, Contábil e Societário projetam as suas (DP-016 a 018, 057; CTB-041, 042; C2-22). Lista de setores que o escritório não atende esconde as obrigações deles (D-25, como ideia).
- **Permissões:** Administrador cancela; Gestor gera, cancela, reatribui; Membro executa as suas e reprograma o prazo interno das suas (03, 9.2).
- **Entidades:** Obrigação (regra, com setor dono), Tarefa, Documento (recibo), Versão do perfil.
- **APIs simuladas:** API-06 (recibos e DCTFWeb), API-08, API-09 (recibos), API-16 (índices na multa).
- **Protótipo tem:** calendário do cliente, atrasos e riscos, pré-requisitos, comprovação, regras por UF, semana da carteira (`telas/painel/obrigacoes.tsx`, `dados/painel-abas.ts`).
- **Falta:** tudo da dinâmica por setor (setor dono, chips, seletor, integrante por item), gerar calendário, reprogramar, cancelar, anexar recibo, obrigações eventuais (D-23, C2-15, C2-16, C2-22), faixas D-20, filtro vindo do bloco "Obrigações do setor".

### S02-T04 · Painel › Notas (Notas fiscais)

**Objetivo.** Capturar, conferir e entregar documentos fiscais ao core; avisar o que falta. Substitui SIEG e Qive (03, 6.3).

| Bloco | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Configuração de captura | CNPJs, IEs, IMs, modelos, certificado, autXML, e-mail de recepção; situação diária (rodou, NSU, erro); caminho escolhido por documento (`perfil_captura`) | NFE-001, 003 (S); 002 (P) | Cadastrar; orientar o cliente sobre autXML (preparar) |
| Captura do mês | Por competência e fonte; contagem contra a ferramenta antiga (paridade com SIEG `/ContarXmls` enquanto a migração estiver aberta) | NFE-004, 006, 007, 011, 501, 502, 005, 009, 012 (S); 008, 013 (P) | Forçar captura; registrar NFS-e de prefeitura sem ADN; triar documento do atendimento |
| Manifestação | Resumos sem ciência, notas sem conclusão, entradas não reconhecidas | NFE-014 (S); 015, 016 (P) | Evento conclusivo (executar com aprovação); desconhecimento |
| Completude e conferência | Buracos de sequência, compras sem XML, receita × declarada, totais core × plataforma | NFE-020, 021, 022, 029, 035 (S) | Abrir tarefa |
| Conferência tributária | Divergências de NCM, CST, CFOP, ST, DIFAL, ISS; produto novo | NFE-023 a 027, 302, 031 (P) | Aceitar ou corrigir (preparar) |
| Eventos posteriores e risco | Canceladas após importação, MDF-e abertos, CT-e a contestar, situação do fornecedor | NFE-018, 010, 028 (S); 019, 017 (P) | Ajustar no core (executar com aprovação); contestar |
| Envio ao core e guarda | Lotes por competência, erros, de-para de CFOP, pacote de guarda | NFE-033, 036 (S); 034 (P) | Reenviar; gerar pacote |
| Atendimento e emissão | Pedidos de DANFE e XML; notas que faltam; notas emitidas pelo escritório e pelo emissor do app | NFE-037, 038 (S); 039, 201 (P) | Cobrar; emitir (executar com aprovação) |
| Entrada e saída | Captura retroativa de 90 dias ao receber o A1 ("1.240 XMLs"); encerramento | NFE-101, 105 (S); 103, 104, 106 (P) | Trilha (S04-T07) |
| Carteira | Cliente × última captura × XMLs do mês × divergências × paridade | — | Forçar captura em lote |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S02-A54 | Forçar captura | Rodada simulada (API-10, API-11) com contagem nova e NSU | Membro de Notas | NFE-004 |
| S02-A55 | Ver saúde da captura no cabeçalho | "captura ok ontem 03:12 · NSU 18.442" ou "parada há 2 dias: certificado vencido" com link ao Societário | todos | 03, 6.3; ad. 17 |
| S02-A56 | Cadastrar configuração de captura | Gaveta (CNPJ, IE, IM, modelos, e-mail de recepção) | Membro de Notas | NFE-001 |
| S02-A57 | Orientar autXML | Mensagem preparada ao cliente (cartão) | Membro de Notas | NFE-002 |
| S02-A58 | Manifestar | Ciência (S) e conclusivo ou desconhecimento (cartão) | quem tem o nível | NFE-014 a 016 |
| S02-A59 | Abrir tarefa de lacuna | Buraco de sequência ou compra sem XML vira tarefa | idem | NFE-020 |
| S02-A60 | Aceitar ou corrigir divergência tributária | Gaveta com a sugestão e a regra; aceitar ensina o integrante | idem | NFE-023 a 027 |
| S02-A61 | Ajustar nota cancelada no core | Cartão | idem | NFE-018 |
| S02-A62 | Reenviar lote ao core | Lote com erro reenviado; evento | idem | NFE-033 |
| S02-A63 | Gerar pacote de guarda | Zip com manifesto e hash | idem | NFE-036 |
| S02-A64 | Registrar NFS-e de prefeitura sem ADN | Upload de PDF ou XML com extração de campos | idem | NFE-008 |
| S02-A65 | Abrir .zip enviado pelo cliente | Cada item vira documento, inclusive nomes com acento do Windows | idem | D-04 |
| S02-A66 | Emitir nota a pedido do cliente | Rascunho; o cliente aprova (GES-036); a pessoa emite | idem | NFE-039 |

- **Estados:** captura parada (vermelho com motivo e ação), migração aberta (coluna de paridade), cliente PF ("Notas vazia com explicação", 03, 3.5), XML nunca aparece inteiro (só resumo e documento do índice).
- **Integrantes:** Notas faz sozinho NFE-001, 003, 004, 006, 007, 009, 012, 014, 018, 020, 021, 022, 028, 033, 035, 036, 037, 038; prepara NFE-015, 016, 019, 023 a 027; job diário 3h, gatilho `documento.registrar` (nfe, nfse, cte), `captura.lacuna`, job mensal NFE-022 (02, 3.2 e ad. 20). Notas vem com o Fiscal por padrão: dar o setor Fiscal a uma conta já dá Notas, e o escritório pode separar (E-03, aprovado; Cruzamento do 2º escritório, resumo).
- **Permissões:** vínculo ao setor Notas; Gestor reatribui e aprova cartões do setor.
- **Entidades:** Documento, Credencial, Conector, Tarefa, Evento.
- **APIs simuladas:** API-10, API-11, API-14, API-18, API-30 (paridade SIEG).
- **Protótipo tem:** captura por fonte com paridade (widget "fluxos"), configuração, manifestação, completude, conferência tributária, envio ao core, captura da carteira (`telas/painel/notas.tsx`).
- **Falta:** eventos posteriores e risco, atendimento e emissão, entrada e saída, saúde da captura no cabeçalho vinda dos conectores, forçar captura, abrir zip (D-04), ações com gaveta e efeito.

### S02-T05 · Ficha do cliente (gaveta, aberta de qualquer tela)

**Objetivo.** O lugar de configurar o cliente para o resto do sistema: contatos com assuntos, responsáveis por setor, serviços extras (01, ad. 22; REVISAO, 4).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S02-A67 | Editar contatos | Nome, papel por serviço, WhatsApp, e-mail, assuntos (guias, folha, documentos pendentes, honorários, societário, comunicados), "usa o app", principal; aviso "sem ninguém: vai ao sócio" | Membro (ficha), Gestor, Administrador | 04, 5.4 |
| S02-A68 | Alçada de pagamento (linha do BPO) | Só proposta; vale depois do aceite do sócio aprovador no app | Gestor do BPO, Administrador | 01, ad. 25 e 27 |
| S02-A69 | Responsáveis por setor | "padrão do setor" ou pessoa | Gestor, Administrador; Membro vê | 01, ad. 22 |
| S02-A70 | Serviços extras | Ativo, disponível, oculto por serviço | Gestor, Administrador | 06, 3.10 |
| S02-A71 | Ver resumo da relação | Conversas por setor (contagem nos outros), tarefas abertas, honorário em aberto, pacotes contratados | todos | 04, 4.2 |
| S02-A72 | Preferência de entrega e malote | Campo da ficha | idem | C2-09 |

- **Protótipo tem:** contatos com assuntos, responsáveis por setor e serviços extras (`ambiente/fluxos.tsx`, `GavetaFichaCliente`; `ambiente/clientes.ts`).
- **Falta:** papel por serviço (linhas `contabil` e `bpo_financeiro` lado a lado), alçada com aceite, preferência de entrega, resumo da relação, histórico de mudanças da ficha.

## S03 · Painel B: Fiscal, Contábil, Consultoria

Escopo: as abas Fiscal (com as variantes Simples, MEI, Presumido/Real e pessoa física), Contábil (com os itens do Leandro) e Consultoria (todas as fases, inclusive as 46 atividades da fase 4). Cada aba usa a anatomia de S02-T01 e ganha o bloco "Obrigações do setor". Fontes: 03, 3.5 e 6.4, 6.6, 6.7; 07; Lista do Leandro (D-03, D-11 a D-16, D-21, D-22, D-26); C2-14, C2-16; atividades FIS, CTB, CON, PF.

### S03-T01 · Painel › Fiscal

**Objetivo.** Cada obrigação do mês conferida, transmitida e com recibo; caixas postais lidas antes do prazo; guias entregues e pagamento confirmado (03, 6.4). Cabeçalho: regime, UF, inscrições, sublimite.

| Bloco | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Obrigações do setor | Próximas obrigações do Fiscal do cliente; "ver todas" | FIS-001, 003 | Componente de S02 |
| Caixas postais | e-CAC, DTE estaduais, DEC municipal: mensagens novas, resumo, classificação, prazo de ciência (tácita em 10 dias), tarefa aberta; **listar nunca dá ciência** | FIS-005, 026, 029 (S) | Abrir mensagem (cartão: "abrir hoje inicia o prazo; sem abrir, ciência em DD/MM") |
| Situação fiscal | Relatório RFB/PGFN atual × anterior, débitos estaduais, CNPJ ou IE irregular, termos de exclusão | FIS-006, 027, 030 (S); 008 (P) | Gerar agora; regularizar (tarefa) |
| Simples e MEI (só no regime) | Receita segregada, PGDAS-D preparado, DAS, sublimite com barra, fator R; DAS-MEI, DASN-SIMEI, limite pelas notas | FIS-010, 011, 012, 016 (S); 009, 013, 017, 018 (P) | **Transmitir: executar com aprovação** (cartão com receita e valor); enviar DAS (executar) |
| DCTFWeb, Reinf, federais, estaduais, municipais | Totalizadores, divergências, retenções, DARF, DIRBI, guias por UF, ISS | FIS-019, 020, 021, 022, 025, 028 (P) | Conferir (preparar); transmitir (executar com aprovação); gerar guia (preparar) |
| Central de guias | Tributo, competência, valor, vencimento, enviada, lida, paga; recálculo pelo cliente; parcelamentos; guias eventuais só com imposto (D-23); taxa anual de licença (C2-22) | FIS-031, 032, 201, 034 (S) | Enviar (executar com aprovação); cobrar pagamento; recalcular guia vencida |
| Certidões, malhas e intimações | Certidões e vencimentos; causa da positiva (SITFIS); intimação com prazo, documentos e resposta; multas | FIS-036 (S); 037, 038, 039, 040 (P) | Emitir (executar); responder intimação (preparar, depois executar com aprovação) |
| Conferência e reforma | Cruzamento notas × apuração × folha × extrato; destaque CBS e IBS por regime | FIS-004 (P); 045 (S) | Aprovar conferência (libera o transmitir) |
| Comunicação | Resumo do mês ao cliente; respostas recorrentes | FIS-033, 044 (P) | Enviar (preparar → cartão) |
| Trava do REINF | Trimestre enviado com data e protocolo fica travado; o que chega depois vira "complementar" (com o Contábil) | D-15 | Ver protocolo; exportar o trimestre |
| Pessoa física (variante) | IRPF (campanha, coleta adaptativa, pré-preenchida, elaboração, revisão, entrega, pós-entrega, malha, retificação), carnê-leão e Receita Saúde, ganho de capital, renda variável, cripto, espólio; na temporada, a Visão geral mostra a campanha | PF-003 a 017, 022 (fases 1 e 2); PF-012, 018 a 021, 023, 026 (fase 4); PF-024, 025, 027 (fase 5) | Coletar pelo app; transmitir (só pessoa); retificar |
| Créditos e fase 4 | Créditos PER/DCOMP, simulação de parcelamento (C2-18, depois), reforma no Simples | FIS-014, 015, 035, 041 a 043 (fase 4) | Preparar |
| Carteira | Visão do integrante: "PGDAS-D de 14 clientes pronto; 2 de fora"; guias da carteira enviadas, lidas, pagas | — | Transmitir em lote (um cartão por cliente) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S03-A01 | Ver mensagem da caixa postal | Resumo e classificação sem abrir; prazo de ciência calculado (M3) | todos com o setor | FIS-005; 08, 5.2 |
| S03-A02 | Abrir mensagem (dá ciência) | Cartão irreversível com a data; ao aprovar, o teor aparece e a tarefa ganha prazo | quem tem o nível | 08, 5.2 e 13.1 |
| S03-A03 | Gerar situação fiscal agora | Consulta simulada (API-06 SITFIS); compara com a anterior | todos com o setor | FIS-006 |
| S03-A04 | Abrir tarefa de regularização | Ficha da tarefa com a pendência | idem | FIS-008 |
| S03-A05 | Ver PGDAS-D preparado | Receita segregada por anexo, fator R, alíquota efetiva, origem de cada número | idem | FIS-009, 011, 012 |
| S03-A06 | Transmitir PGDAS-D | Botão só com FIS-004 marcada e pré-requisito válido; senão "falta X"; cartão expira na véspera do prazo legal; aprovar transmite (API-06), grava recibo e baixa a obrigação | quem tem o nível | 03, 6.4; 01, 6.4 |
| S03-A07 | Transmitir em lote | "PGDAS-D de 14 clientes": cartão com contagem; aprovar todos ou um a um; os 2 de fora com o motivo | Gestor | 02, 3.2 |
| S03-A08 | Enviar DAS ao cliente | Pelo contato com assunto "guias"; registro de entrega; botão "Recebi" | todos com o setor | FIS-010 |
| S03-A09 | Conferir DCTFWeb ou Reinf | Totalizadores × folha e retenções; divergência vira tarefa | idem | FIS-019, 020 |
| S03-A10 | Gerar DARF ou guia estadual | Rascunho (Sicalc simulado, API-06) | idem | FIS-021, 025 |
| S03-A11 | Cobrar pagamento de guia | Régua "Guia a pagar"; terceira cobrança avisa o dono | idem | FIS-032; 04, 7.2 |
| S03-A12 | Recalcular guia vencida | Nova data, juros e multa com origem | idem | FIS-201 |
| S03-A13 | Ver parcelamentos | Parcelas, atrasos, risco de exclusão | idem | FIS-034 |
| S03-A14 | Emitir certidão | Consulta simulada (API-13); positiva mostra a causa | idem | FIS-036, 037 |
| S03-A15 | Responder intimação | Rascunho com documentos; envio com aprovação; prazo em contagem | idem | FIS-038 a 040 |
| S03-A16 | Aprovar conferência | Marca FIS-004 e libera o transmitir | quem tem o nível | FIS-004 |
| S03-A17 | Enviar resumo do mês | Pré-visualização ao cliente | idem | FIS-033 |
| S03-A18 | Pedir ao integrante | Gaveta "Pedir ao Fiscal" com o que fazer | todos com o setor | README |
| S03-A19 | Campanha do IRPF (PF) | Lista de clientes PF com coleta pelo app e etapas; envio só por pessoa | idem | PF-003 a 009 |
| S03-A20 | Ver trimestre travado do REINF | Protocolo e "complementar" | idem | D-15 |

- **Estados e regras:** transmitir só com conferência e pré-requisito; cartão de transmissão expira na véspera do prazo; cliente PF troca os blocos; MEI mostra os blocos de MEI; caixa postal "listar não dá ciência"; DMED aparece no calendário pelo CNAE de saúde (C2-16).
- **Integrantes:** Fiscal faz sozinho FIS-001, 002, 003, 005, 006, 007, 010, 011, 012, 026, 029, 030, 031, 032, 034, 036, 046; prepara FIS-004, 008, 009, 019, 037, 038, 040; jobs: caixa postal diário 6h, calendário no último dia útil, guias vencendo 8h, FIS-011/012 dia 8; gatilhos `ecac.mensagem.receber`, `dte.mensagem.receber`, `tarefa.prazo_em_3_dias`, `guia.vencer_sem_pagamento`, `guia.pagamento.informado` (02, 3.2, 7.1, 7.2 e ad. 18 e 20). Exemplo de aviso: "PGDAS-D de outubro de 14 clientes pronto... 2 de fora". Nunca promovível: FIS-009, FIS-019.
- **Permissões:** vínculo ao Fiscal; Gestor reatribui e aprova; Membro aprova os próprios cartões se tem o nível (03, 9.2).
- **Entidades:** Tarefa, Obrigação, Documento (guia, recibo, certidão), Credencial, Cartão de aprovação, Evento.
- **APIs simuladas:** API-06, API-07, API-09, API-13, API-14, API-15, API-16.
- **Protótipo tem:** Simples e MEI (só para cliente do Simples), caixas postais, situação fiscal, certidões, central de guias com enviada, lida, paga; PGDAS-D do Café Central e lote de 14 com aprovação que executa (`telas/painel/fiscal.tsx`, `dados/painel.ts`, `ambiente/efeitos.tsx`).
- **Falta:** DCTFWeb, Reinf e federais, intimações e malhas, conferência e reforma, comunicação, trava do REINF, variante PF com IRPF e carnê-leão, MEI completo, abrir mensagem com ciência por cartão, recálculo de guia, parcelamentos, créditos (fase 4), bloco "Obrigações do setor".

### S03-T02 · Painel › Contábil

**Objetivo.** Fechar a competência: cobrar, trazer extratos, classificar, conciliar, apontar o fora do padrão, entregar ao core e ao cliente (03, 6.6). Cabeçalho: "10/26: coleta 80% · extratos ok · classificação 412/430 · conciliação pendente".

| Bloco | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Obrigações do setor | ECD, ECF, DECORE, IBGE (C2-15) do cliente | CTB-041, 042; C2-15 | Componente de S02 |
| Fechamento em cinco etapas | Coleta, extratos, classificação, conciliação, fechamento, com o que trava cada uma | CTB-026 (S) | Ver etapa; abrir o que falta |
| O que deve chegar | Lista mensal por cliente; chegou × falta; régua; **contas esperadas por banco** (aponta o banco que não mandou extrato) | CTB-002, 003, 005, 201 (S); 001 (P); D-03 | Definir lista; abrir competência; cobrar |
| Triagem e extratos | Documentos do WhatsApp e do e-mail com cliente e competência inferidos (regras do mês D-02: nome, pasta e conteúdo; mês futuro não conta; mais de 3 meses vai a "conferir"); contas detectadas, Open Finance, extratos sem buracos, PDF convertido, dados do ERP; .zip aberto (D-04); leitor de extratos OFX, CSV, planilha, PDF (D-11) | CTB-004, 008, 009, 011, 007 (S); 012, 014 (P); 010 (O) | Confirmar classificação; pedir consentimento Open Finance |
| Classificação e de-para | Linhas com confiança (abaixo de 0,7 marcada), não classificadas, de-para; Pix e débitos sem nota | CTB-015 (S); 016, 006 (P) | Corrigir de-para (ensina o integrante); perguntar ao cliente (preparar) |
| Conciliação | Saldos de terceiros, impostos × fiscal × extrato, folha × contábil, caixa credor, conta de sócio, adquirentes, parcelamentos | CTB-019, 020, 022, 013 (S); 018, 021 (P) | Abrir tarefa da diferença |
| Distribuição de lucros (novo, D-12) | Por sócio e mês: lucro, pró-labore (pelo líquido do holerite), devolução, saída suspeita; dúvidas em cinco perguntas; regras por favorecido ("sempre lucro", "nunca lucro") (D-13); alerta de R$ 50 mil com imposto de 10% e vencimento (D-14); trimestre travado depois do REINF (D-15); exportação do trimestre | D-11 a D-15 (sobem para P1) | Responder dúvida; adotar regra; exportar |
| Fechamento e lote ao core | Fechados, parados (por quê), atrasados por analista; lote ao core; imobilizado; inventário | CTB-017, 052, 047 (S); 025, 027, 046 (P); 024 (O) | Enviar ao core, reabrir competência (executar com aprovação) |
| Relatórios ao cliente e anuais | Balancete, DRE, comparativo; demonstrações; carta de responsabilidade; cronograma de encerramento; ECD, ECF, publicação, PLD, DECORE; **declaração de faturamento assinada pelo contador** (C2-14); pacotes para auditor | CTB-039, 050 (S); 028, 031, 037, 041 a 044, 032, 051 (P); 040, 049 (O); C2-14 | Gerar (preparar); enviar e transmitir (executar com aprovação) |
| Fila de assinatura do contador (novo, D-16) | Documentos que só saem assinados: fila, conferência da assinatura dentro do PDF, envio ao cliente só depois | D-16 | Assinar fora (API-22) e devolver; conferir; liberar envio |
| Travas antes de enviar relatório (D-26) | Faturamento zerado, lucro maior que faturamento, "outras receitas" altas, balancete que não fecha | D-26 | Corrigir ou justificar antes do cartão de envio |
| Carteira: Kanban do fechamento e Minha fila (D-22) | Colunas Pendente, Em andamento, Conferência, Concluído; "meus clientes" do mais atrasado ao menos; clientes por etapa e analista | CTB-026; D-22 | Arrastar entre colunas; filtrar |
| Filtros por fase do cliente (D-21) | Completo, Parcial, A conferir, Pendente, Estrutura incompleta; por módulo ("lucro pendente de REINF") | D-21 | Filtrar |
| Livro-caixa (PF) | Variante para cliente pessoa física | 03, 3.5 | — |
| Fase 4 | Orçamento do cliente, indicadores, consolidação, auditoria (CTB-023, 029, 030, 033 a 036, 038, 045, 048) | fase 4 | Preparar |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S03-A21 | Definir o que deve chegar | Gaveta com documentos e contas esperadas por banco | Membro do Contábil | CTB-001; D-03 |
| S03-A22 | Abrir competência | Gera a lista do mês e dispara a régua | integrante (S) ou pessoa | CTB-002 |
| S03-A23 | Cobrar o que falta | Régua "Documentos da competência" com os itens e o banco faltante | idem | CTB-003 |
| S03-A24 | Confirmar triagem | Documento inferido (cliente, competência) confirmado ou corrigido; correção vence a leitura | idem | CTB-004; D-02 |
| S03-A25 | Pedir consentimento Open Finance | Pendência no app com o link (API-19) | idem | CTB-010 |
| S03-A26 | Importar extrato | Upload OFX, CSV, planilha ou PDF; deduplica PDF × CSV; reconhece sócio por CPF inteiro, mascarado ou nome | idem | D-11 |
| S03-A27 | Corrigir de-para | Gaveta; vira regra e memória do integrante | idem | CTB-016 |
| S03-A28 | Perguntar ao cliente sobre lançamento | Pré-visualização com as linhas; cartão | idem | CTB-006 |
| S03-A29 | Abrir tarefa da diferença | Diferença de conciliação vira tarefa | idem | CTB-018 |
| S03-A30 | Responder dúvida da distribuição de lucros | Cinco perguntas; resposta vira regra por favorecido | idem | D-12, D-13 |
| S03-A31 | Ver alerta de R$ 50 mil | Aviso com imposto e vencimento, uma vez só | idem | D-14 |
| S03-A32 | Exportar trimestre de lucros | CSV e PDF; trimestre travado depois do REINF | idem | D-15 |
| S03-A33 | Enviar lote ao core | Cartão; resultado do core simulado (API-18) | quem tem o nível | CTB-047 |
| S03-A34 | Reabrir competência | Cartão com motivo | Gestor | CTB-025 |
| S03-A35 | Gerar balancete e DRE | Rascunho com o tema; passa pelas travas (D-26) | Membro do Contábil | CTB-028 |
| S03-A36 | Mandar para a fila de assinatura | Documento entra na fila do contador; conferência da assinatura ao voltar | idem | D-16 |
| S03-A37 | Enviar relatório ao cliente | Só depois de assinado e conferido; cartão; chega ao app | quem tem o nível | D-16; 06, ad. Leandro |
| S03-A38 | Gerar declaração de faturamento | Pedido padronizado do app vira tarefa; assinatura do contador; envio | idem | C2-14 |
| S03-A39 | Transmitir ECD e ECF | Só pessoa (certificado); recibo anexado | idem | CTB-041, 042 |
| S03-A40 | Mover cliente no Kanban | Muda a etapa do fechamento; evento | idem | D-22 |
| S03-A41 | Filtrar por fase do cliente | Lista e Kanban filtrados | todos | D-21 |

- **Estados e regras:** documento do app baixa a pendência sozinho; confiança abaixo de 0,7 marcada; competência completa gera `competencia.completa`; trimestre do REINF travado; relatório com trava aberta não vira cartão.
- **Integrantes:** Contábil faz sozinho CTB-002, 003, 004, 005, 008, 009, 011, 013, 015, 017, 019, 020, 022, 026, 047, 052, 201; prepara CTB-006, 016, 018, 025, 028, 041, 042; job dia 1 (CTB-002), régua diária 9h, job semanal CTB-026; gatilhos `documento.registrar` (extrato), `pendencia.marcar_recebida`; memória das regras por favorecido (D-13) e gatilho do alerta de R$ 50 mil (D-14) (02, 3.2 e ad. Leandro). Exemplo do protótipo: CTB-016 (classifica, passa ao Atendimento, a Rita responde no WhatsApp, o Contábil fecha). Nunca promovível: CTB-041.
- **Permissões:** vínculo ao Contábil; Gestor reabre competência e reatribui.
- **Entidades:** Tarefa, Documento, Conta bancária e Lançamento (titular empresa, no contábil), Credencial (consentimento), Regra (memória), Evento.
- **APIs simuladas:** API-05 (anexos do e-mail), API-09, API-18, API-19, API-22.
- **Protótipo tem:** fechamento em cinco etapas, o que deve chegar, classificação com confiança, conciliação, fechamento da carteira por etapa e analista; fluxo CTB-016 (`telas/painel/contabil.tsx`, `dados/painel.ts`, `dados/simulacao.ts`).
- **Falta:** triagem e extratos, contas esperadas por banco (D-03), regras do mês (D-02), leitor de extratos (D-11), distribuição de lucros (D-12 a D-15), relatórios ao cliente e anuais, fila de assinatura (D-16), travas (D-26), Kanban e Minha fila (D-22), filtros por fase (D-21), declaração de faturamento (C2-14), livro-caixa PF, fase 4, bloco "Obrigações do setor".

### S03-T03 · Painel › Consultoria (Consultoria e Reforma)

**Objetivo.** Perguntas técnicas separadas do operacional, respondidas com base citada e revisadas pelo contador; e, nas fases seguintes, planejamento, reforma e recuperação de créditos (03, 6.7; 02, 10; 07, 8).

| Bloco | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Perguntas técnicas | Por canal, cliente, setor de origem, status (nova, rascunho pronto, revisada, enviada); "dentro ou fora do escopo do contrato" | CON-001 (S), 002 (P) | Pedir rascunho (`parecer.rascunhar`, preparar); revisar e enviar (executar com aprovação) |
| Pareceres do cliente | Enviados, com citação, data e versão da base legal | CON-002, 003, 006 | Reaproveitar como modelo |
| Vigilância e enquadramento | Avisos do Consultor sobre o cliente: norma nova, fator R, sublimite; pareceres afetados | CON-004, 010, 015, 033 (S) | Abrir tarefa; falar com o Consultor |
| Perguntar | Atalho para o chat do Consultor com o cliente como contexto | — | Abre a gaveta |
| Segunda opinião | Tarefas com `risco = true` enviadas para revisão: "confere" ou "divergência: X" com citação | 02, 10.1 | Ver nota na tarefa |
| Resumo da convenção coletiva | Pontos do dia a dia da CCT nova, com o DP (C2-04; DP-201 sobe para a fase 2) | C2-04 | Preparar; publicar na memória do setor |
| Planejamento tributário (fase 4) | Comparativo de regimes, planejamento dos sócios, inteligência tributária, revisão de enquadramento com números (M3) e regra (M1) | CON-007 a 014, 303 | Preparar; enviar com aprovação |
| Reforma tributária (fase 4) | Diagnóstico, simulação de carga por ano de transição (Calculadora RFB), Simples, créditos, preço, cadastro, regimes específicos, IS, split payment, contratos, créditos de transição, 2029 a 2032, parâmetros, pequenos, comunicação, prontidão, apuração | CON-015 a 032 | Simular (ler); gerar relatório (preparar) |
| Recuperação de créditos (fase 4) | Oportunidades, levantamento, comercial | CON-033 a 036, 304 | Preparar |
| Entrada, saída e comercial (fase 4) | Diagnóstico na entrada (transição, abertura), no desligamento, pré-venda, consultoria recorrente; consultoria financeira (fase 5) | CON-101 a 106, 301, 302, 401 | Preparar |
| Carteira | Perguntas e avisos por cliente | — | Filtrar |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S03-A42 | Pedir rascunho de parecer | O Consultor percorre a cascata em etapas; rascunho com citação conferida e vigência | Membro da Consultoria | CON-002; 07, 3.5 |
| S03-A43 | Revisar e editar rascunho | Editor do documento com as citações marcadas; afirmação sem suporte destacada | idem | 07, 7 |
| S03-A44 | Enviar parecer ao cliente | Cartão de aprovação; vira documento no app | quem tem o nível | 03, 6.7 |
| S03-A45 | Ver abstenção | "Não encontrei base legal; pesquisei X, Y"; sem completar com conhecimento próprio | todos | 07, 7.4 |
| S03-A46 | Reaproveitar parecer como modelo | Novo rascunho a partir do anterior | idem | 03, 6.7 |
| S03-A47 | Abrir tarefa da vigilância | Tarefa "risco ou oportunidade" por cliente com números e regra | idem | 02, 10.1 |
| S03-A48 | Marcar fora do escopo | Vira serviço avulso a propor (Financeiro) | idem | 04, 8.1; 09, 4.7 |
| S03-A49 | Simular a reforma | Cenários por ano com os números do cliente (API-15) e divergência contra a calculadora oficial | idem | CON-016; 07, 5.5 |
| S03-A50 | Comparar regimes | Tabela com origem de cada número; rascunho de ação (CON-008) | idem | CON-008, 010 |
| S03-A51 | Resumir convenção coletiva | Documento da CCT lido; resumo para revisão; publicar no DP | DP e Consultoria | C2-04 |

- **Estados e regras:** toda resposta técnica passa por pessoa (rascunhar sempre); sem base, abstenção explícita; afirmações com origem (norma, registro ou cálculo); data de referência obrigatória (07, 1.4 e 3.2).
- **Integrantes:** Consultor faz sozinho CON-001, 004, 010, 015, 033; prepara CON-002, 008, 028; modos perguntar, parecer, vigilância (job diário 7h, `legislacao.publicar`), revisão de enquadramento (dia 10), segunda opinião, modo cliente (S10) (02, 10.1).
- **Permissões:** vínculo ao setor; perguntar ao Consultor existe para todos pelo chat (03, 2.3); Membro pede rascunho e envia só com executar (03, 9.2).
- **Entidades:** Tarefa (CON-001), Documento (parecer), Memória do setor, Evento.
- **APIs simuladas:** API-01 (cascata legal), API-15, API-16.
- **Protótipo tem:** perguntas técnicas, pareceres, vigilância e enquadramento, simulações (como bloco da fase 4), carteira; duas respostas legais completas no Assistente (`telas/painel/consultoria.tsx`, `components/compostos/cartoes-legal.tsx`).
- **Falta:** editor de parecer com citações, fluxo enviar com aprovação, segunda opinião, resumo da CCT, os blocos da fase 4 funcionando (planejamento, reforma por ano, créditos, entrada e saída), "fora do escopo" ligado ao Financeiro.

## S04 · Painel C: DP, Gestão, tarefas, trilhas e ciclo de vida

Escopo: as abas DP (com as visões Admissão e rotina; Rescisão) e Gestão; o sistema de tarefas inteiro (lista, calendário, detalhe, checklist, revisão, nova tarefa, recorrência); as trilhas de implantação e de saída; o ciclo de vida do cliente. Fontes: 03, 6.5, 6.9, 7 e 8; 01, 4.8; 05, ad. 16; C2-01 a C2-06, C2-25, C2-27 a C2-29; atividades DP, GES, CIC.

### S04-T01 · Painel › DP (Trabalhista e DP)

**Objetivo.** Ciclo do empregado, eSocial e FGTS Digital, com o cliente mandando o que falta pelo app; a aba com mais "prepara, pessoa conclui" (03, 6.5). Cabeçalho: empregados, sindicato, data-base. **Duas visões internas** (filtros com blocos, não setores): **Admissão e rotina** e **Rescisão** (E-04, aprovado).

| Bloco | Visão | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- | --- |
| Obrigações do setor | ambas | FGTS, DCTFWeb da folha, eSocial, informe | DP-016 a 018, 057 | Componente de S02 |
| Quadro de empregados | rotina | Ativos por estabelecimento, cota, sistema de ponto, pasta por empregado | DP-056, 060 (S); 045 (P) | Abrir empregado |
| Admissão | rotina | Pedidos em andamento (dados, documentos, ASO, contrato, S-2200, benefícios), contagem regressiva do S-2200 | DP-001, 002, 004, 006, 007 (S); 005, 008 (P); 003 (O) | Gerar contrato (preparar); confirmar S-2200 |
| Fechamento da folha | rotina | Variáveis recebidas × esperadas, ponto, prévia aprovada, tabelas conferidas, pró-labore | DP-009, 014 (S); 010 a 013, 015 (P) | Pedir variáveis (executar); importar no core (executar com aprovação); enviar prévia (preparar) |
| eSocial e DCTFWeb | rotina | Eventos pendentes, rejeitados, não fechados; totalizadores × folha; recibos; mudanças de leiaute | DP-038, 039, 043 (S); 016, 017, 057 (P) | Transmitir (executar com aprovação) |
| Guias, holerites e pagamento | rotina | GFD, DARF, sindical, resumo, líquidos; holerites com prova; pagamento conferido; **boletos de sindicato, convênio e seguro de vida** (alguns só depois do dia 25, C2-03) | DP-019, 020, 021 (S); 018, 022 (P); C2-03 | Enviar pacote (executar com aprovação); CNAB (preparar); emitir boleto (robô de portal, depois) |
| Férias, afastamentos e SST | rotina | Períodos e risco de dobra; atestados, licenças, CAT, periódicos, PGR e PCMSO | DP-023, 049 (S); 024, 025, 046 a 048 (P); 050 (O) | Programar férias; transmitir CAT (executar com aprovação) |
| Simulados de rescisão (novo) | rescisão | Simulados pedidos, data de pagamento, simulado do core em modelo legível, cobrança diária da resposta do cliente | C2-02 | Gerar simulado (preparar); enviar ao cliente (cartão) |
| Rescisão | rescisão | Prazo de 10 dias contado, TRCT, homologação, GFD rescisória; **kit de rescisão**: extrato do FGTS, extrato para fins rescisórios (pede num dia, chega no outro), guia rescisória, seguro-desemprego com conferência de nome, mãe, nascimento e sexo (C2-01) | DP-027 (S); 026, 029 a 032 (P); 028 (O); C2-01 | Gerar TRCT (preparar); montar kit; confirmar desligamento |
| Convenções, benefícios e anuais | rotina | Sindicato, CCT e vencimento; **resumo da CCT** (C2-04); VT, VR, plano de saúde, 13º, informe, igualdade salarial | DP-034 (S); 033, 051 a 055 (P); DP-201 (sobe à fase 2) | Registrar; calcular (preparar); resumir CCT |
| DET, fiscalização e reclamatórias | ambas | Notificações, prazos, documentos para o advogado | DP-040 (S); 044, 061 (P); 041 (O) | Abrir tarefa |
| Termo de ciência com assinatura | ambas | Termos enviados (advertência, ciência de regra), status da assinatura, régua até assinar (C2-06) | C2-06 | Gerar termo; enviar para assinatura (cartão); acompanhar |
| Recálculo de FGTS e sindicato | rotina | Guias recalculadas (C2-05, depois) | C2-05 | Recalcular |
| Fase 4 e 5 | — | Folha de doméstico (DP-062), benefícios avançados, simulação de custo (DP-059), DP-035 a 037, 058 | fases 4 e 5 | Preparar |
| Carteira | — | Folha de cada cliente na competência: variáveis, prévia, eSocial, guias | — | Pedir variáveis em lote |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A01 | Alternar visão Admissão e rotina × Rescisão | Os blocos mudam; filtro guardado | todos com o DP | E-04 |
| S04-A02 | Receber pedido de admissão | Vem do app ou do CRM (`pedido.abrir`); o integrante valida, checa piso da CCT, abre DP-002 e as tarefas; aba mostra "aguardando cliente" com a lista | integrante (S) | 03, 6.5; 06, 4.3 |
| S04-A03 | Gerar contrato de experiência | Rascunho; envio com aprovação | Membro do DP | DP-005 |
| S04-A04 | Confirmar S-2200 | Recibo simulado (API-08); contagem zera | quem tem o nível | DP-006 |
| S04-A05 | Pedir variáveis da folha | Formulário mensal no app; extrai de foto ou áudio | integrante | DP-009 |
| S04-A06 | Enviar prévia ao cliente | Pré-visualização; aprovação do cliente pelo app (ciência) | Membro do DP | DP-012 |
| S04-A07 | Importar no core | Cartão; resultado do core (API-18) | quem tem o nível | DP-013 |
| S04-A08 | Transmitir eventos do eSocial | Cartão com eventos e totalizadores; recibo | quem tem o nível | DP-038; DP-016 |
| S04-A09 | Enviar pacote da folha | Guias e holerites ao contato com assunto "folha"; registro de entrega | quem tem o nível | DP-020 |
| S04-A10 | Emitir boleto de sindicato ou convênio | Lembrete no dia 25; robô de portal simulado; vai para a pasta do cliente | integrante (gatilho do dia 25) | C2-03 |
| S04-A11 | Programar férias | Gaveta com período, abono, risco de dobra; aviso ao cliente | Membro do DP | DP-024 |
| S04-A12 | Transmitir CAT | Cartão | quem tem o nível | DP-047 |
| S04-A13 | Pedir simulado de rescisão | Vem do app (pedido de simulado) ou da pessoa; simulado legível; régua diária até a resposta | Membro do DP | C2-02 |
| S04-A14 | Montar kit de rescisão | Checklist: extrato do FGTS, extrato para fins rescisórios (pedido e "chega amanhã"), guia rescisória, seguro-desemprego conferido; robô simulado (API-17) | integrante prepara; pessoa confere | C2-01 |
| S04-A15 | Gerar TRCT e confirmar desligamento | Prazo de 10 dias em contagem | Membro do DP | DP-027, 026 |
| S04-A16 | Resumir CCT nova | Integrante lê e prepara o resumo; pessoa revisa e publica | DP e Consultor | C2-04 |
| S04-A17 | Enviar termo de ciência | Gera o termo, envia para assinatura (API-22), acompanha até assinar; régua | integrante prepara; envio com aprovação | C2-06 |
| S04-A18 | Abrir tarefa de notificação do DET | Tarefa com prazo | idem | DP-040 |

- **Estados:** cliente sem folha ("sem empregados; a primeira admissão abre DP-105"); contagem regressiva do S-2200 e da rescisão; cliente PF sem DP (vazio com explicação).
- **Integrantes:** DP faz sozinho DP-001, 002, 004, 006, 007, 009, 014, 019, 020, 021, 023, 027, 034, 038, 039, 040, 043, 049, 056, 060; prepara DP-015, 016, 017, 026, 029, 046, 048; gatilhos `pedido.abrir` (admissão), mensagem com pedido implícito, jobs diários DP-007 e DP-023, gatilho do dia 25 (C2-03) (02, 3.2 e ad. 14/11). Exemplo de aviso: "Empresa X pediu admissão de 2 pessoas pelo app... Falta decidir: experiência 45+45 ou 90 dias?". Nunca promovível: DP-016.
- **Permissões:** vínculo ao DP; Gestor aprova e reatribui.
- **Entidades:** Tarefa, Documento (holerite, guia, TRCT, termo), Credencial, Pedido (tarefa `origem = pedido_cliente`), Evento.
- **APIs simuladas:** API-08, API-17, API-18, API-22, API-02 (variáveis por áudio).
- **Protótipo tem:** quadro, admissões com contagem do S-2200, folha, eSocial, férias com risco de dobra, rescisões, folha da carteira; contrato de experiência da Metalúrgica com aprovação que executa (`telas/painel/dp.tsx`, `dados/painel.ts`).
- **Falta:** as duas visões (E-04), guias e holerites, convenções e benefícios, DET, simulados (C2-02), kit de rescisão (C2-01), boletos (C2-03), resumo da CCT (C2-04), termo de ciência (C2-06), fluxos com gaveta, bloco "Obrigações do setor".

### S04-T02 · Painel › Gestão

**Objetivo.** Equipe, carteira, permissões, produtividade, governança da IA, migração e relatórios consolidados; igual com e sem cliente (03, 6.9).

| Bloco | O que mostra | Atividades | Ações (nível) |
| --- | --- | --- | --- |
| Equipe e carteira | Usuários, papel, setores, exceções, carteira, substituto nas férias, carga por pessoa; link a Timesheet › Equipe | GES-017, 018, 021 | Convidar; editar vínculos e exceções (só Administrador); redistribuir em lote; férias com substituto |
| Permissões | Matriz usuário × aba × nível efetivo (calculada, só leitura); o que cada pessoa do cliente vê | GES-021, 041 | Simular "o que Fulano vê?" |
| Produtividade e atrasos | Tarefas por setor e pessoa: criadas, concluídas, atrasadas, tempo iniciar → concluir, reabertas; conversas sem resposta; carga prevista | GES-016 | Abrir a lista |
| Governança da IA | Feito sozinho e com aprovação, taxa de aprovação sem edição por atividade, tempo humano de aprovação, custo em tokens, lista "executa sozinho", pedidos de promoção; no CRM: categorias liberadas e amostragem | GES-056, 062 | Tirar da lista; aceitar promoção; limites |
| Catálogo local | Atividades ativas, horas padrão, equivalência no core, fila "sem equivalente" | `catalogo.configurar_atividade`; GES-609 | Ativar, editar horas, mapear equivalência (Administrador) |
| Processos e recorrências do escritório | Rotinas sem obrigação formal ("relatório gerencial dia 10"), com checklist padrão | GES-206 | Criar e editar processo (gera tarefas) |
| Armazenamento e tema | Atalhos às Configurações | — | Ir |
| Plano mestre de migração | Por ferramenta antiga (Acessórias, Gestta, Onvio, SIEG, Qive, HubStrom, Nibo): onda, pré-requisitos, paralelo, critério medido, data de contrato | GES-601 a 608 | Marcar critério; registrar desligamento |
| Compliance e LGPD | Registro de tratamento, incidentes (envio à pessoa errada), anuidades, pedidos de titular | GES-054, 057, 059, 060, 061 | Registrar incidente; responder pedido (tarefa) |
| Relatórios consolidados e auditoria | Os relatórios de cada aba lado a lado; `evento.listar` com filtros (ator, credencial, negado); relatório de atendimento; métricas do app (adoção, pendências pelo app, tempo até envio, serviços ativos); custo por cliente e por conector | 03, ad. 14, 16, 17 | Exportar |
| Saúde das rotinas e dos jobs | Última execução, fila, arquivos com erro (senha, imagem ruim, grande demais) | D-38 | Abrir o erro; reprocessar |
| Ocorrências críticas | Etiqueta na tarefa e lista (C2-27, como ideia; GES-019 na fase 3) | C2-27 | Etiquetar; ver lista |
| Pauta da reunião semanal | O Geral monta atrasos, riscos e pendências (C2-28, como ideia) | C2-28 | Gerar pauta |
| Fase 3 e seguintes | Rentabilidade, custo-hora, funil, previsão de carga (atalhos ao Timesheet e ao Financeiro) | GES-001 a 016, 042, 043, 049 a 052, 055, 101 a 109, 403, 404 | Ir |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A19 | Simular "o que Fulano vê?" | Mostra as abas e o nível calculados e a exceção que causou cada diferença | Gestor (seus setores), Administrador | 03, 6.9 e 9.3 |
| S04-A20 | Editar vínculo ou exceção | Gaveta com motivo obrigatório (vai ao evento) | Administrador | 03, 6.9 |
| S04-A21 | Redistribuir em lote | Tarefas e conversas de uma pessoa para outra; cartão em lote | Gestor | GES-018 |
| S04-A22 | Férias com substituto | Registra ausência (Timesheet) e repassa a fila | Gestor | 05, ad. 16 |
| S04-A23 | Tirar atividade do "faz sozinho" | Volta a cartão; evento | Administrador | 01, 3.3 |
| S04-A24 | Aceitar promoção | Cartão do integrante | Administrador | 02, 3.3 |
| S04-A25 | Configurar atividade do catálogo | Horas padrão, equivalência, ativa | Administrador | 01, 6.5 |
| S04-A26 | Criar processo recorrente | Gera tarefas com o checklist padrão; a tarefa mostra a origem e leva à regra | Gestor | 03, 7.6 |
| S04-A27 | Marcar critério de migração | Critério medido (ex.: paridade de XMLs) ou desligamento registrado | Administrador | GES-608 |
| S04-A28 | Registrar incidente LGPD | Ligado à mensagem e ao cliente, com a ação tomada | Administrador | GES-059 |
| S04-A29 | Filtrar auditoria | Ator, credencial usada, negado; exportar | Administrador | 03, 6.9 |
| S04-A30 | Reprocessar rotina com erro | Fila andando; aviso | Administrador | D-38 |
| S04-A31 | Gerar pauta semanal | Documento com atrasos, riscos e pendências | Gestor, Administrador | C2-28 |

- **Regras:** Gestor vê só os setores que gere; Administrador é o único que edita papéis, setores, exceções, tema e catálogo; a matriz é calculada, sem lógica própria na tela (03, 6.9).
- **Integrantes:** Gestão e Atendimento faz sozinho GES-016, 056 (horas poupadas) e consolida atrasos para o Gestor; o Geral monta a pauta; a fila de pedidos de consulta ao Administrador (GES-056) chega aqui.
- **Permissões:** aba visível ao Administrador e ao Gestor nos setores que gere; Membro não vê.
- **Entidades:** Usuário, Vínculo, Exceção por tela, Carteira, Atividade, Configuração local, Evento, Ausência.
- **APIs simuladas:** API-30 (paridade da migração).
- **Protótipo tem:** produtividade e atrasos, governança da IA, equipe e carga, permissões calculadas, plano de migração (`telas/painel/gestao.tsx`, `dados/painel-abas.ts`).
- **Falta:** simular "o que Fulano vê" interativo, catálogo local, processos recorrentes, compliance e LGPD, relatórios consolidados e auditoria, relatório de atendimento e métricas do app, saúde das rotinas (D-38), ocorrências críticas, pauta semanal, redistribuir em lote.

### S04-T03 · Tarefas: lista, visão por responsável e bloco do setor

**Objetivo.** O mesmo componente de tarefas no bloco de cada aba, no calendário (outra forma) e na tela "Tarefas" do celular (03, 7.1 e 2.4).

| Elemento | O que mostra | Dados |
| --- | --- | --- |
| Colunas | Status, título, atividade (ID e nome curto), cliente, competência, prazo interno e legal, responsável (pessoa ou integrante), origem, dias no status, cartão pendente | Tarefa |
| Filtros | Setor, cliente ou carteira, status (abertas por padrão), responsável (eu, pessoa, integrante, sem), competência, prazo (hoje, semana, atrasadas), origem, só com pendência, só com cartão; filtro salvo por usuário e aba | Preferência |
| Visão por responsável | Agrupa por pessoa e integrante com contagens | Tarefa |
| Pré-visualização | Painel lateral ou linha expandida com o essencial, sem abrir (não inicia o tempo) | Tarefa |
| Raiz de trilha | "Implantação do cliente X · 14 de 31" | Tarefa (`tarefa_pai_id`) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A32 | Filtrar e salvar filtro | Filtro lembrado por aba | todos | 03, 7.1 |
| S04-A33 | Pré-visualizar | Não abre sessão de tempo | todos | 03, 7.3 |
| S04-A34 | Abrir (inicia) | Abre o detalhe e chama `tarefa.iniciar`; sessão de menos de 60 s sem ação é descartada | todos | 03, 7.3 |
| S04-A35 | Iniciar outra | A anterior pausa (volta a `em_andamento` sem dono aberto) com aviso | todos | 03, 7.3 |
| S04-A36 | Reatribuir arrastando entre responsáveis | Na visão por responsável; `tarefa.reatribuir` | Gestor | 03, 7.1 |
| S04-A37 | Ação de um toque (celular) | Iniciar, concluir, aprovar, cobrar | todos | 03, 2.6 |
| S04-A38 | Ver tarefas dos colegas do setor | Visíveis; só o Gestor reatribui | Membro | 03, P9 |
| S04-A39 | Carteira: 50 mais urgentes e "ver todas" | Lista longa paginada | todos | 03, 2.4 |

- **Estados:** vazio ("nenhuma tarefa aberta deste setor para este cliente"), atrasada, aguardando cliente com dias, responsável integrante com ícone, cartão pendente.
- **Protótipo tem:** bloco de tarefas com filtros e "Nova tarefa", cartão de tarefa (`components/compostos/bloco-tarefas.tsx`, `cartao-tarefa.tsx`). **Falta:** colunas completas, visão por responsável com arrastar, pré-visualização, raiz de trilha com progresso, tela "Tarefas" do celular, filtros salvos.

### S04-T04 · Calendário de tarefas

**Objetivo.** O calendário (estilo TaskHub) que a Visão geral e as abas usam (03, 4.1).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A40 | Trocar dia, semana, mês | Padrão semana; celular só dia e semana | todos | 03, 4.1 e 2.6 |
| S04-A41 | Arrastar para reprogramar | Só o prazo interno; mostra os dois prazos quando diferem; passar do legal pede confirmação com a multa estimada | Membro (as suas), Gestor | 03, 4.1 e P2 |
| S04-A42 | Reprogramar sem arrastar | Botão "reprogramar" (celular e teclado) | idem | 03, 2.6 |
| S04-A43 | Abrir grupo | "PGDAS-D × 14" abre a lista | todos | 03, 4.1 |
| S04-A44 | Filtrar | Responsável, setor (cor), status, só atrasadas | todos | 03, 4.1 |
| S04-A45 | Ver feriados e prorrogações | Dia marcado; o futuro muda com o perfil, o passado fica | todos | 03, 4.1 |

- **Protótipo tem:** calendário da semana sem arrastar (`components/compostos/widgets.tsx`, `CalendarioSemana`). **Falta:** dia e mês, arrastar com confirmação e multa, reprogramar, grupos, filtros. O README do protótipo anota a troca para React Aria quando o calendário for desenhado.

### S04-T05 · Detalhe da tarefa (ficha), checklist e revisão

**Objetivo.** Tudo da tarefa num lugar, com as transições como botões próprios (03, 7.2 a 7.6; 01, 4.8).

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Cabeçalho | Código, título, cliente, status e desde quando, prazo interno e legal, responsável, origem, quem conclui, aberta por | Tarefa |
| Barra de ações | Concluir · Enviar para revisão · Aguardar cliente · Aguardar órgão · Cancelar · Pausar · Não era esta · Abrir correção · Pedir ao integrante | Ferramentas `tarefa.*` |
| Checklist | Itens com obrigatório, quem marcou e quando; molde da obrigação ou do processo, mais itens livres | `tarefa.checklist_marcar` |
| Cartão pendente | O mesmo registro do chat e da Visão geral | Cartão de aprovação |
| Documentos | Ligados à tarefa, com os controles do bloco D; anexar já preenche cliente, competência e tipo | Documento (`tarefa_id`) |
| Conversa ligada | Resumo, última mensagem, "abrir", "nova mensagem ao cliente", "virar pendência" | Conversa |
| Tempo | Pessoas e integrantes (máquina, tokens só para quem gere) | Sessão de trabalho |
| Histórico | Eventos em ordem | Evento |
| Ligações | Integrante, aba do Painel, honorário em aberto, ficha do cliente, conversa interna que originou a tarefa | — |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A46 | Concluir | Pede o resultado quando a atividade define (recibo, protocolo); recusa com item obrigatório aberto | pessoa com o setor | 03, 7.3 |
| S04-A47 | Enviar para revisão | Único caminho quando `risco = true` ou responsável integrante em "prepara"; com `risco`, o Consultor deixa a segunda opinião | todos | 01, 4.8 |
| S04-A48 | Aguardar cliente | Exige a lista de itens (vira pendência no app e na régua) | todos | 03, 7.3 |
| S04-A49 | Aguardar órgão | Exige órgão e protocolo | todos | 03, 7.3 |
| S04-A50 | Cancelar | Motivo obrigatório; tarefa de obrigação só Gestor ou Administrador | conforme | 01, 4.8 |
| S04-A51 | Pausar | Volta a `em_andamento` sem dono aberto; tempo corta | todos | 03, ad. 22 |
| S04-A52 | Não era esta | Corrige o cliente ou a tarefa da sessão em curso; vira item de confirmação no Timesheet | todos | 03, ad. 22 |
| S04-A53 | Abrir correção | Concluída é final: cria tarefa nova com `tarefa_pai_id` | todos | 01, 4.8 |
| S04-A54 | Marcar item do checklist | Registra quem e quando | todos | 03, 7.4 |
| S04-A55 | Adicionar item livre ao checklist | Item não obrigatório | todos | 03, 7.4 |
| S04-A56 | Decidir o cartão dentro da tarefa | Aprovar, editar (grava argumentos editados), recusar (comentário vira aprendizado) | quem pode | 03, 7.5 |
| S04-A57 | Anexar documento | Classificado com o contexto da tarefa | todos | 03, 7.4 |
| S04-A58 | Nova mensagem ao cliente | Rascunho no CRM com a tarefa como contexto | todos | 03, 7.4 |
| S04-A59 | Virar pendência | Itens da conversa viram `aguardando_detalhe` | todos | 03, 7.4 |
| S04-A60 | Pedir ao integrante | Ele faz ou cobra o cliente (trabalho simulado) | todos | README |
| S04-A61 | Ver "concluída por evidência" | "Concluída por evidência: recibo 123", corrigível por "abrir correção" | todos | 03, 7.6 |
| S04-A62 | Marcar serviço extra (comanda) | A tarefa fica marcada como extra; as horas entram no Timesheet como extra; vai ao Financeiro para faturar | todos | C2-25 |
| S04-A63 | Etiquetar ocorrência crítica | Entra na lista da Gestão | todos | C2-27 |
| S04-A64 | Lembrete interno que só some com confirmação | Tarefa interna recorrente que exige confirmação explícita | todos | C2-29 |
| S04-A65 | Ir à conversa, ao integrante, à aba, à fatura, à ficha | Navega | todos | 03, ad. 20 |

**Fila de revisão.** Tarefas em `em_revisao` do setor e cartões pendentes, agrupados por atividade, com aprovar em lote e "devolver" (volta a `em_andamento` com comentário) (01, 4.8 máquina de estados). **[sem regra no plano: onde mora a fila; sugestão: filtro "em revisão" no bloco de tarefas e widget próprio para o Gestor]**

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A66 | Abrir a fila de revisão | Lista das tarefas em revisão do setor com a evidência | Gestor, quem tem o nível | 01, 4.8 |
| S04-A67 | Devolver | Volta a `em_andamento` com comentário | idem | 01, 4.8 |
| S04-A68 | Aprovar em lote | Conclui as selecionadas; evento com o nome de quem aprovou | idem | 01, 6.4 |

- **Integrantes:** concluem por evidência quando "faz sozinho" (03, 7.6); "prepara" só envia para revisão.
- **Permissões:** concluir é de pessoa com o setor, Gestor ou Administrador; integrante só quando `agente_sozinho`; quem não pode aprovar vê o cartão sem botões e o nome de quem pode (03, 7.5).
- **Entidades:** Tarefa, Cartão de aprovação, Documento, Conversa, Sessão de trabalho, Evento.
- **Protótipo tem:** ficha com status, responsável, ligações (conversa, integrante, tempo, aba, ficha, honorário), concluir, iniciar, aguardar cliente, pedir ao integrante (`ambiente/fluxos.tsx`, `FichaTarefa`).
- **Falta:** checklist, cartão dentro, documentos, histórico, enviar para revisão, aguardar órgão, cancelar, pausar, não era esta, abrir correção, conclusão por evidência, comanda (C2-25), ocorrência crítica, lembrete com confirmação, fila de revisão.

### S04-T06 · Nova tarefa e recorrência

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A69 | Criar tarefa à mão | Gaveta: atividade do catálogo (obrigatória), cliente, competência, prazo interno, responsável pessoa ou integrante, checklist; `origem = manual` | todos com o setor | 01, ad. 22 |
| S04-A70 | Criar tarefa interna (sem cliente) | `cliente_id` nulo (ex.: backup, C2-29) | todos | 01, 4.8 |
| S04-A71 | Ver origem da recorrência | Leva à regra do processo (não edita pela tarefa) | todos | 03, 7.6 |

- **Protótipo tem:** gaveta "Nova tarefa" (`ambiente/fluxos.tsx`, `NovaTarefa`). **Falta:** atividade obrigatória do catálogo, checklist, tarefa interna, recorrência.

### S04-T07 · Trilha de implantação (entrada)

**Objetivo.** Conduzir o cliente novo até o primeiro fechamento de cada setor (03, 8.2; 01, 4.8). Mora no Societário; aberta pela faixa de ciclo de vida.

| Bloco | O que mostra |
| --- | --- |
| Cabeçalho | Molde (abertura a1 a a12; transição b1 a b11; MEI c1 a c4; pessoa física c5 a c8), responsável, corte, desde quando |
| Marcos | Feito, em andamento, a fazer, bloqueado (`depende_de`) |
| O cliente precisa enviar | Itens `aguardando_cliente` da trilha (A1, autorização RFB, procuração FGTS, consentimento das contas, contrato social, acervo, opt-in); é o que o cliente vê no app |
| O contador anterior precisa enviar | Carta única (CIC-002): pedidos, recebidos, cobrados |
| Tarefas por setor | "Societário 5/8 · Fiscal 2/6..."; bloqueadas mostram "depende de b3" |
| Custo | Horas registradas × previstas (molde) × agente |
| Gargalo | SOC-014 e SOC-011 em destaque com dias e cobranças |
| Captura retroativa | "1.240 XMLs" da janela de 90 dias ao receber o A1 |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A72 | Gerar trilha | Ao fechar contrato (S05) ou ao mudar para `em_implantacao`: cria a raiz e as filhas por setor | integrante Societário (S) | CIC-001; 01, 4.8 |
| S04-A73 | Cobrar pelo CRM | Régua com os itens do cliente | todos | 03, 8.2 |
| S04-A74 | Ver no app do cliente | Prévia do que o cliente vê | todos | 03, 8.2 |
| S04-A75 | Reenviar carta única | Ao contador anterior | todos | CIC-002 |
| S04-A76 | Marcar item recebido | Acorda o integrante para validar (GES-405) | todos | 03, 8.2 |
| S04-A77 | Concluir marco | Libera os dependentes | todos | 03, 8.2 |
| S04-A78 | Passar o cliente a ativo | Depois do primeiro fechamento de cada setor; cartão do Gestor | Gestor | GES-106 |
| S04-A79 | Rodar o Raio-X da pasta antiga do cliente | Passo da trilha (S09 desenha o Raio-X) | Administrador | D-10 |
| S04-A80 | Editar moldes | Lista versionada de `{atividade, setor, condição, prazo relativo, depende_de}` **[sem tela no plano; sugerida em Gestão › Processos]** | Administrador | 01, 4.8 |

- **Protótipo tem:** só a contagem da trilha nos Leads (`telas/crm/LeadsTela.tsx`) e o widget de ciclo de vida (`telas/painel/societario.tsx`). **Falta:** a tela inteira.

### S04-T08 · Trilha de saída e baixa

**Objetivo.** Desligar o cliente sem deixar obrigação para trás (03, 8.3).

| Bloco | O que mostra |
| --- | --- |
| Cabeçalho | Motivo, data efetiva, competência de corte, aviso prévio; moldes saída (e1 a e13) e baixa (f1 a f11) |
| Obrigações remanescentes | Geradas até o corte; `encerrado` bloqueado até zerar (SOC-107, FIS-108, DP-106, CTB-109) |
| Dossiê de saída | Pacotes por setor, índice com manifesto (lista e hash), termo de entrega (CIC-003) |
| Revogações e desligamentos | Checklist das matrizes (SOC-024, DP-107, FIS-109, NFE-105, CTB-111, GES-108); cada item marca quem fez |
| O cliente precisa | Assinar o distrato, informar o sucessor, retirar o A1 ou autorizar o descarte |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A81 | Iniciar saída | Motivo e datas; gera a trilha de saída | Gestor | CIC-003 |
| S04-A82 | Gerar dossiê | Executar; zip com manifesto | Membro | 03, 8.3 |
| S04-A83 | Enviar dossiê ao sucessor | Cartão | quem tem o nível | 03, 8.3 |
| S04-A84 | Marcar revogação | Item com quem fez | todos | 03, 8.3 |
| S04-A85 | Encerrar | Só sem remanescentes; abas só leitura com retenção | Gestor | 01, 4.2 |
| S04-A86 | Tarefa pós-desligamento | CIC-007 cria tarefa sem reabrir o cliente | todos | 03, 8.3 |

- **Protótipo tem:** nada. **Falta:** a tela inteira.

### S04-T09 · Ciclo de vida do cliente

**Objetivo.** Estados do cliente e o que cada um libera (03, 3.5 e 8.1; CIC).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S04-A87 | Ver estado e histórico | prospect → proposta → aceito → em implantação → ativo → em saída ou em baixa → inativo → encerrado; por serviço contratado (contábil e BPO têm ciclos separados) | todos | 01, ad. 23 |
| S04-A88 | Mudar estado | Cartão com bloqueios | Gestor | CIC-001 |
| S04-A89 | Reativar ex-cliente | Reabre a ficha com o histórico e uma trilha de reentrada (C2-24, como ideia; CIC-010) | Gestor | C2-24 |
| S04-A90 | Evento de exceção | Cliente inapto, suspenso, falecimento do titular (CIC-006, 008) vira faixa e tarefa | integrante | CIC-006 |

- **Protótipo tem:** widget "Ciclo de vida" e "Clientes por estado" (`telas/painel/societario.tsx`). **Falta:** faixa em todas as abas, mudar estado com bloqueio, reativação, ciclo por serviço.

## S05 · CRM e Comunicação interna

Escopo: as quatro abas do CRM (Conversas, Leads, Comunicados, Números e configurações) e o módulo novo de Comunicação interna. O CRM é a conversa com clientes e leads; a comunicação interna é a conversa da equipe; nada de uma aparece na outra (11, 1). Fontes: 04 inteiro e adendos; 11 inteiro; D-17, D-18, D-30, D-31, D-33 a D-35; C2-07 a C2-09, C2-13.

### S05-T01 · CRM › Conversas

**Objetivo.** A caixa única de todos os canais (WhatsApp, e-mail, chat do app, formulário), ligada ao cadastro e às tarefas (04, 4). Conta tempo e entra em espera.

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Visões | Sem responsável · Minhas · Do setor · Todas, com contagem | Conversa |
| Busca e filtros | Corpo, transcrição, anexo, pessoa, empresa, CNPJ; setor, status, etiqueta, canal, responsável, período; **filtro por cliente** (funil, chip removível; é a "visão do cliente") | `busca.global` |
| Lista | Prazo de resposta restante (estourado em vermelho), cliente ou lead, pessoa e papel, setor, status, canal, responsável, etiquetas, prévia (áudio com duração e transcrição); ordem por prazo; aguardando cliente no fim | Conversa, Mensagem |
| Conversa | Ações no topo; resumo gerado; histórico unificado com o canal de cada mensagem: do cliente, do escritório (com **nome de quem atende**, C2-07), automática (modelo), do integrante (orb parado), nota interna, áudio com transcrição, anexos com status de entrega e "visto", cartões, marcos; apagada pelo cliente riscada com o texto original; editada com as duas versões | Mensagem, Documento, Registro de entrega |
| Campo | Alterna Responder e Nota interna; canal; respostas rápidas ("/"); "tom"; anexar; fora da janela de 24 h só modelo aprovado | Canal do escritório, Modelo |
| Lateral (gaveta abaixo de 1536 px) | Cliente e perfil, responsáveis por setor (da ficha), pessoa e identidades com opt-in, outras empresas da pessoa, tarefas abertas (clicáveis), tarefa que segura a conversa, pendências com cobrar, histórico (outros setores só contagem), últimos eventos, atalhos ao Painel, ao Time e à ficha | Cliente, Pessoa, Tarefa |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S05-A01 | Assumir | Responsável = eu; em atendimento; abre sessão de tempo; cancela a espera; marco | Membro (seus setores), Gestor | 04, 4.3 |
| S05-A02 | Repassar | Outra pessoa do setor; aviso ao destino; o cliente não é avisado; seleção múltipla | idem | 04, 4.3 |
| S05-A03 | Transferir | Outro setor; a origem fica só leitura com "transferida para o DP, com Beltrano"; o cliente recebe o aviso do novo número | idem | 04, 4.3 |
| S05-A04 | Aguardando cliente ou interno | Pausa o SLA; interno exige tarefa; volta sozinho | idem | 04, 4.3 |
| S05-A05 | Resolver | Encerra sessão; pesquisa de satisfação (1 a 5) se configurada; reabre em até 7 dias | idem | 04, 4.3 e 8.2 |
| S05-A06 | Responder | Envio com status (enviada, entregue, lida); fora da janela oferece o modelo de utilidade preenchido | idem | 04, 3.3 |
| S05-A07 | Nota interna com @menção | Nunca sai; menção a outro setor manda o trecho, não o acesso | idem | 04, 10.2 |
| S05-A08 | Integrante sugere | Escreve a resposta no campo, aos poucos, para revisar; categorias liberadas respondem sozinhas | idem | 04, 8.1 |
| S05-A09 | Mudar o tom | Formal, direto, amigável, para leigo; reescreve no campo | idem | 04, 8.1 |
| S05-A10 | Virar tarefa | A IA propõe cliente, setor, atividade, prazo, responsável e checklist; confirmar cria e liga | idem | 04, 4.3 |
| S05-A11 | Etiquetar (urgente, tipo de atendimento) | A etiqueta de tipo define a atividade do Timesheet | idem | 04, 9.1 |
| S05-A12 | Lembrete | Aviso ao responsável na hora | idem | 04, 4.3 |
| S05-A13 | Resumir | Resumo no topo com identificadores | idem | 04, 8.1 |
| S05-A14 | Ligar a cliente | Lead que é cliente ou pessoa com várias empresas; fusão só por cartão ao Gestor | idem | 04, 5.1 e 5.3 |
| S05-A15 | Confirmar cliente inferido | Um clique; abaixo de 0,6, o integrante pergunta por botões | idem | 04, 5.1 |
| S05-A16 | Mover mensagem | Para a conversa certa da mesma pessoa | idem | 04, 4.3 |
| S05-A17 | Registrar autorização | "Pode transmitir" vira prova ligada à tarefa | idem | GES-036 |
| S05-A18 | Bloquear número | Spam; mensagem guardada sem conversa | Gestor | 04, 5.5 |
| S05-A19 | Cobrar pendência pela lateral | Régua no fio certo | idem | 04, 4.2 |
| S05-A20 | Ouvir áudio e ler transcrição | "Transcrição indisponível" tenta de novo em 5 min | idem | 04, 3.6 |
| S05-A21 | Abrir anexo | Visualizador; anexo classificado baixa pendência | idem | 04, 8.1 |
| S05-A22 | Conferir CNPJ antes de enviar documento | Se o CNPJ do documento não é o da empresa da conversa, bloqueia com o motivo | idem | D-34 |
| S05-A23 | Ver farol de entrega | Verde abriu, amarelo no prazo (3 dias úteis), vermelho passou sem abrir; reenvio por outro canal preparado no cartão | idem | D-17 |
| S05-A24 | E-mail enviado vira registro | E-mails da caixa do setor (entrada e enviados, com anexos) aparecem no fio e os anexos vão à pasta do cliente com o mês pelas regras do D-02 | integrante (S) | C2-08 |
| S05-A25 | E-mail que voltou | Marca a entrega como falha (depois) | integrante | D-18 |
| S05-A26 | Agendar reunião | Três horários livres do responsável; confirma por botão; cria tarefa | integrante | 04, 8.2 |
| S05-A27 | Abrir conversa vinda do Time ou de um aviso | Abre mesmo de outro setor se transferida ou citada; a busca continua sem mostrá-la | idem | 04, ad. 18 |
| S05-A28 | Exportar conversa | Prova de autorização ou disputa | Gestor; exportação geral só Administrador | 04, 10.3 |
| S05-A29 | Modo simulação | A equipe faz o papel do cliente e testa a IA sem gravar nem enviar | Gestor, Administrador | D-30 |

- **Estados:** sem conversas na visão; SLA estourado; transferida (só leitura); fora do horário; número experimental (selo); carteira ligada (Membro vê "sem responsável" só da carteira, mais leads).
- **Integrantes:** Atendimento faz sozinho GES-023, 024, 025, 026, 031, 034, 035, 036, 038, 039, 040, 203, 405 (triagem, factual liberado, transcrição, resumo, régua, silêncio, satisfação, agendamento); prepara GES-027, 029, 030, 042, 044; o do setor acorda por pedido implícito, documento ou transferência; o Consultor rascunha a dúvida técnica com citação; o Geral repassa em lote. Nunca: prometer prazo, opinar, citar preço a lead, enviar fora da janela sem modelo, fingir ser humano, apagar mensagem, fundir ou bloquear sozinho; certidão com débito vai sem comentário e o Societário é avisado (D-35). Clientes-piloto (D-31) e "começa sem categoria liberada" (D-33) (04, 8; 02, 3.2 e ad. Leandro).
- **Permissões:** Membro as dos seus setores (de outro só transferidas); Gestor todas dos seus setores, reatribui, bloqueia, em lote; Administrador todas (04, 10.1).
- **Entidades:** Canal do escritório, Conversa, Mensagem, Identidade, Pessoa, Lead, Etiqueta, Resposta rápida, Modelo, Documento, Registro de entrega, Tarefa, Sessão de trabalho.
- **APIs simuladas:** API-01, API-02, API-03, API-04, API-05, API-23.
- **Protótipo tem:** caixa completa com visões, busca (com transcrição), lista por prazo, conversa com ações, resumo, histórico unificado, campo que alterna, respostas rápidas, tom, janela de 24 h, transferência só leitura, lateral, filtro por cliente, "integrante sugere", cliente que responde (`telas/crm/ConversasTela.tsx`, `telas/crm/itens.tsx`, `dados/crm.ts`).
- **Falta:** conferir CNPJ (D-34), farol de entrega (D-17), e-mail registrado (C2-08), nome de quem atende configurável (C2-07), modo simulação (D-30), clientes-piloto (D-31), agendar reunião, satisfação ao resolver, mover mensagem, registrar autorização, exportar, mensagem apagada e editada pelo cliente.

### S05-T02 · CRM › Leads

**Objetivo.** O funil comercial, outra face da conversa com o lead (04, 6).

| Bloco | O que mostra |
| --- | --- |
| Quadro | Lead · Qualificado · Proposta · Contrato · Implantação · Perdido, com contagem e cartões (origem, idade, prazo de resposta, valor da proposta, responsável, próxima ação) |
| Lista | Mesmo conteúdo em tabela com filtros (origem, responsável, período) |
| Métricas | Leads por origem e mês; conversão por etapa; tempo em cada etapa; motivo de perda; honorário fechado por mês; primeira resposta ao lead; por responsável |
| Detalhe (gaveta) | Qualificação (regime, porte, dor, contabilidade atual, serviços), conversa, proposta e contrato (documentos com "visto"), próxima ação, nível de cada ação |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S05-A30 | Arrastar entre etapas | Mouse, toque, teclado; Implantação só por "Fechar contrato" | Gestão e Atendimento, Administrador | 04, 6.1 |
| S05-A31 | + Lead manual | Indicação, Instagram, site, telefone | idem | 04, 6.1 |
| S05-A32 | Qualificar | O integrante preenche pela conversa (GES-042); a pessoa confirma | idem | 04, 6.1 |
| S05-A33 | Gerar proposta | Rascunho do modelo do tema a partir da qualificação e da tabela de honorários; envio só por pessoa (cartão) | idem | 04, 6.2 |
| S05-A34 | Enviar contrato para assinatura | Provedor simulado (API-22) | idem | 04, 6.1 |
| S05-A35 | Fechar contrato | Mostra de uma vez o que acontece: cria o cliente com o perfil, religa conversas e documentos, converte a pessoa em sócio, convida para o app, abre a trilha (S04-T07) | idem | 04, 6.2 |
| S05-A36 | Perder | Motivo obrigatório (preço, sem contato, escolheu outro, fora do perfil); pode reabrir | idem | 04, 6.1 |
| S05-A37 | Follow-up | Lead sem contato há 3 dias gera lembrete e rascunho de retomada | integrante | 04, 6.2 |
| S05-A38 | Fundir lead com cliente | Cartão ao atendente; nunca automático | idem | 04, 5.2 |
| S05-A39 | Ver métricas | Gráficos por pergunta; clicar leva à lista | idem | 04, 6.3 |

- **Integrantes:** Atendimento qualifica, faz follow-up e nunca cita preço; triagem por botões para número desconhecido ("Sou cliente", "Quero conhecer", "Outro assunto") (04, 5.2).
- **Permissões:** quem tem o setor Gestão e Atendimento e o Administrador.
- **Entidades:** Lead, Pessoa, Identidade, Conversa, Documento, Cliente, Tarefa.
- **APIs simuladas:** API-03, API-12, API-22.
- **Protótipo tem:** quadro com arrastar, fechar contrato com o que acontece, detalhe em gaveta, perdido com motivo, métricas, "+ Lead" (`telas/crm/LeadsTela.tsx`). **Falta:** lista, qualificação pela conversa, proposta e contrato como documentos com "visto", follow-up automático, fusão por cartão.

### S05-T03 · CRM › Comunicados e réguas

**Objetivo.** Mensagens em massa por modelo aprovado e as réguas de cobrança e lembrete (04, 7).

| Bloco | O que mostra |
| --- | --- |
| Enviados | Por comunicado: entregues, lidas, respostas, falhas; reenvio por e-mail a quem não recebeu |
| Novo comunicado | Para quem (todos, segmento do perfil, clientes escolhidos), contagem de pessoas com o assunto "comunicados" e com opt-in, modelo aprovado, texto com variáveis, canal (e-mail para quem não tem opt-in), agendamento, limite do número, três exemplos |
| Réguas | Documentos da competência, Guia a pagar, Honorários (espera o Financeiro), Certificado e cadastros, Prazo do cliente, Lead sem resposta; etapas (dia relativo, modelo, tom, para quem), parada, horário, escalonamento, liga e desliga, régua própria por cliente |
| Boletim mensal | Prazos do mês do perfil e mudanças legais marcadas pelo Consultor (GES-044) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S05-A40 | Montar segmento por texto | "Todos do Simples de SP com funcionários" vira predicado em tabela para confirmar | todos com acesso | 04, 7.1 |
| S05-A41 | Escolher clientes a dedo | Lista com busca | idem | 04, ad. 18 |
| S05-A42 | Pré-visualizar três exemplos | Com dados reais de três destinatários | idem | 04, 7.1 |
| S05-A43 | Agendar | Data e hora; respeita horário e limite | idem | 04, 7.1 |
| S05-A44 | Enviar com aprovação | Cartão em lote; Membro vê "Mandar para aprovação" e o Gestor recebe no sino | Gestor envia; Membro rascunha | 04, 10.1 |
| S05-A45 | Ver resultado por destinatário | Status de entrega e respostas (abrem conversa no setor, etiquetada) | idem | 04, 7.1 |
| S05-A46 | Reenviar por outro canal | A quem falhou | Gestor | 04, 7.1 |
| S05-A47 | Criar e editar régua | Etapas, parada, horário, escalonamento | Gestor | 04, 7.2 |
| S05-A48 | Ligar e desligar régua; régua por cliente | "Manda extrato só dia 10" | Gestor | 04, 7.2 |
| S05-A49 | Rascunhar boletim mensal | O integrante rascunha; pessoa aprova | idem | GES-044 |
| S05-A50 | Comunicado de aniversário e de fim de ano | Por modelo (C2-13, como ideia) | idem | C2-13 |
| S05-A51 | Comunicado de pendências em PDF | Anexa PDF com timbre (D-19, depois) | idem | D-19 |

- **Integrantes:** Atendimento executa a régua no fio certo (gatilho 11 do 02); três etapas sem resposta avisam o responsável; descadastro ("PARAR") revoga o opt-in.
- **Permissões:** Membro rascunha e manda para aprovação; Gestor envia; Administrador tudo (04, 10.1).
- **Entidades:** Comunicado, Régua, Modelo, Conta de cliente (assuntos, opt-in), Mensagem.
- **APIs simuladas:** API-03, API-05.
- **Protótipo tem:** enviados com resultados e reenvio, novo comunicado com para quem, opt-in, modelo, canal, agendamento, três exemplos e aprovação; seis réguas com etapas e liga e desliga; nova régua (`telas/crm/ComunicadosTela.tsx`). **Falta:** segmento por texto, boletim mensal, régua por cliente, C2-13, D-19.

### S05-T04 · CRM › Números e configurações do atendimento

**Objetivo.** Um número por setor, modelos aprovados na Meta e as regras do atendimento (04, 3 e 4.5 a 4.6). Não conta tempo.

| Bloco | O que mostra |
| --- | --- |
| Empresa na Meta | Verificação, limite atual (250 → 2.000 → 10 mil), qualidade |
| Números | Setor, número (principal no Gestão e Atendimento), conexão (Cloud API, coexistência, provedor, experimental), status (app sem abrir há N dias), e-mail do setor; setor sem número usa o principal |
| Modelos | Nome no formato da Meta, categoria, idioma, texto com variáveis, botões, status (rascunho, enviado, aprovado, rejeitado com motivo, pausado), números, versão |
| Mensagens automáticas | Espera ("já vamos atender"), fora de horário, feriado, transferência, satisfação, boas-vindas de lead |
| Horário, feriados e plantão | Por setor, com fuso, dias, intervalos; plantão para etiquetas urgentes |
| SLA | Por setor e por etiqueta (padrão 1 h e 2 dias; Consultoria 4 h e 5 dias; lead 15 min) |
| Etiquetas e respostas rápidas | Cor, tipo (assunto ou tipo de atendimento), setor, atividade do Timesheet; atalho, texto, setor |
| Nome de quem atende | Como a assinatura da pessoa entra na mensagem (C2-07) |
| Bloqueados | Lista com motivo |
| Privacidade e retenção | Aviso de privacidade do escritório; guardar leads; exportação |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S05-A52 | Conectar número | Passos: setor → janela da Meta (Embedded Signup simulado) → coexistência → nome exibido e e-mail → pronto | Administrador; Gestor no próprio setor | 04, 3.2 |
| S05-A53 | Verificar saúde | Qualidade, limite, coexistência (abrir o app a cada 14 dias) | idem | 04, 3.2 |
| S05-A54 | Migrar de provedor ou do experimental | Um clique; histórico fica | Administrador | 04, 3.5 |
| S05-A55 | Ligar modo experimental | Aceite por escrito (evento); selo "experimental" em todas as listas; comunicados indisponíveis | Administrador | 04, 3.5 |
| S05-A56 | Criar, editar e submeter modelo | Nome normalizado; variáveis por toque com erro para desconhecida; até 3 botões; prévia; rejeitado mostra o motivo; editar aprovado cria versão | Administrador | 04, 3.3 |
| S05-A57 | Editar mensagens automáticas | Texto, liga e desliga, minutos de espera | Gestor do setor | 04, 4.5 |
| S05-A58 | Editar horário, feriados e plantão | Gaveta | Gestor do setor | 04, 4.5 |
| S05-A59 | Editar SLA | Por setor e etiqueta | Gestor do setor | 04, 4.6 |
| S05-A60 | Criar etiqueta e resposta rápida | Gaveta | Gestor do setor | 04, 4.3 |
| S05-A61 | Configurar nome de quem atende | Prefixo ou rodapé com o nome exibido | Gestor | C2-07 |
| S05-A62 | Desbloquear número | Volta a abrir conversa | Gestor | 04, 5.5 |
| S05-A63 | Ajustar retenção e "guardar leads" | Conteúdo de lead perdido removido após 12 meses | Administrador | 04, 10.3 |
| S05-A64 | Conectar caixa de e-mail do setor | OAuth simulado (API-05); lê entrada e enviados | Administrador | C2-08; 08, 7.2 |

- **Protótipo tem:** números com equipe, principal, saúde e e-mail; conectar em passos; detalhes do número; modo experimental; modelos completos; mensagens automáticas, horário, feriados, SLA, etiquetas, respostas rápidas (`telas/crm/NumerosTela.tsx`, `telas/crm/config/*.tsx`). **Falta:** verificação da empresa na Meta com limites, migrar de provedor, nome de quem atende (C2-07), bloqueados, privacidade e retenção, caixa de e-mail do setor (C2-08), plantão conferido.

### S05-T05 · Conversas internas (comunicação interna)

**Objetivo.** Conversa da equipe do escritório, quase como um Teams, sem exclusão de mensagens (11). Item próprio na barra lateral ("Conversas internas", nome provisório), separado do CRM.

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Lista em três grupos | **Pessoais e grupos** · **Setores** (um canal por setor ativo, automático) · **Geral** (toda a equipe); não lidas por conversa; presença (disponível, ausente, em espera) | Conversa interna, Participação |
| Conversa | Mensagens com fio (thread), menções (`@pessoa`, `@setor`, `@integrante`), anexos, cartões clicáveis de cliente, tarefa, obrigação e documento (respeitando a permissão de quem lê), "editada" com histórico de versões, "visto por" em grupos e canais, mensagens fixadas no topo do Geral | Mensagem (com versões) |
| Campo | Texto, anexar, gravar áudio (transcrição), mencionar, link de reunião colado (sem vídeo próprio na v1) | — |
| Detalhes da conversa | Participantes (entrada e saída registradas), nome do grupo, arquivos da conversa (em Arquivos com origem "comunicação interna") | Participação, Documento |
| Janela flutuante | Uma conversa pequena aberta sobre qualquer tela | — |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S05-A65 | Começar conversa pessoal | Escolher colega; fechada entre os dois | todos | 11, 2 |
| S05-A66 | Criar grupo | Nome e participantes; entrada e saída registradas | todos | 11, 2 e P3 |
| S05-A67 | Editar grupo | Renomear, adicionar, sair | participantes | 11, 2 |
| S05-A68 | Entrar e sair de canal de setor | Automático conforme o setor da pessoa muda | sistema | 11, 2 |
| S05-A69 | Enviar mensagem e responder em fio | Fio abre ao lado | todos | 11, 1 |
| S05-A70 | Editar mensagem | Nova versão; "editada"; histórico visível a quem participa | autor | 11, 1 e P1 |
| S05-A71 | Tentar excluir | Não existe botão de excluir para ninguém, nem anexo; o menu explica "mensagens não podem ser apagadas" | todos | 11, 1 |
| S05-A72 | Mencionar pessoa ou setor | Aviso a quem foi citado; `@setor` avisa todos | todos | 11, 3 |
| S05-A73 | Chamar `@integrante` | O integrante responde no fio, marcado como IA (só leitura e resposta) | todos | 11, 4 |
| S05-A74 | Citar cliente, tarefa, obrigação, documento | Cartão clicável; quem não tem permissão vê "sem acesso" | todos | 11, 3 |
| S05-A75 | Transformar em tarefa | Mensagem vira tarefa no Painel com link de volta | todos | 11, 3 |
| S05-A76 | Integrante propõe tarefa | "Parece um pedido: criar tarefa?" (prepara; a pessoa confirma) | integrante | 11, 4 |
| S05-A77 | Resumir fio longo | Para quem chegou depois, quando pedido | integrante | 11, 4 |
| S05-A78 | Resumo da manhã no canal do setor | Vencimentos do dia e cartões esperando aprovação, se o escritório ligar o gatilho | integrante (gatilho) | 11, 4 e P6 |
| S05-A79 | Anexar arquivo | Vai a Arquivos com origem "comunicação interna"; não se apaga | todos | 11, 3 |
| S05-A80 | Gravar áudio | Transcrição (conta no limite de IA de quem grava) | todos | 11, 3 |
| S05-A81 | Buscar | Texto, pessoa, cliente, período, só no que a pessoa pode ver | todos | 11, 3 |
| S05-A82 | Fixar mensagem no Geral | Aviso fixo no topo | Gestor | 11, 2 e P5 |
| S05-A83 | Aviso de dado sensível | Colar algo com cara de CPF ou holerite num canal amplo sugere mover para a tarefa do cliente | sistema | 11, 5 |
| S05-A84 | Aviso do primeiro uso | "Mensagens não podem ser apagadas" no primeiro uso e no termo da equipe | todos | 11, 5 |
| S05-A85 | Abrir conversa pessoal em investigação | Motivo escrito, registro e aviso aos participantes | Administrador | 11, 5 e P2 |
| S05-A86 | Silenciar e horário de silêncio | Por conversa e por pessoa | todos | 11, 3 |
| S05-A87 | Abrir janela flutuante | Conversa pequena sobre qualquer tela | todos | 11, 6 |

- **Estados:** sem conversas ("comece com um colega ou use o canal do seu setor"); pessoa desligada (perde o acesso; histórico fica; nome anonimizado se pedir); sigilo (cliente ou Caso restrito: o ligado a ele só aparece a quem tem acesso).
- **Integrantes:** respondem por menção (S), resumo da manhã se ligado (S), propõem tarefa (P), resumem fio (S); **não leem conversas pessoais** salvo se chamados ali; nunca mandam mensagem a cliente por aqui (11, 4).
- **Permissões:** todos os papéis da equipe; convidado de outro escritório (BPO) não entra; Administrador não lê conversa pessoal no dia a dia (11, 1 e 5).
- **Entidades:** Conversa interna, Mensagem (com versões), Participação, Documento, Tarefa, Notificação.
- **APIs simuladas:** API-01 (integrante por menção, resumo), API-02 (áudio), API-27 (aviso no celular).
- **Protótipo tem:** nada.
- **Falta:** o módulo inteiro (item na barra, três grupos, conversa, fio, menções, edição com versões, sem excluir, anexos, busca, presença, janela flutuante, integrantes, auditoria).

## S06 · Timesheet

Escopo: o item lateral Timesheet com as quatro abas (ordem do protótipo: Meu tempo · Confirmações · Equipe · Rentabilidade; a ordem do 05, 8.1 é Meu tempo · Equipe · Rentabilidade · Confirmações, pendência U5 sem decisão) e todos os pop-ups de setup; a extensão de navegador simulada. O Timesheet não conta tempo e não entra em espera. O cliente selecionado filtra as quatro abas. Fontes: 05 inteiro e adendos; 03, 6.11; 01, 5.4; C2-25; JU-05 (chips do Jurídico).

### S06-T01 · Timesheet › Meu tempo

**Objetivo.** A pessoa vê onde foi o próprio dia, confirma o estimado e contesta o errado, sem apontar horas (05, 8.2).

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Resumo do dia | Registradas, automáticas, confirmadas, sem classificação; agente: tempo de máquina, horas poupadas (estim.), % do limite de 5 h e de 7 dias | Sessão de trabalho, Sessão de integrante |
| Onde foi o meu dia? | Linha do tempo por confiança (automática escura, confirmada média, estimada clara listrada, sem classificação tracejada); atendimento (CRM) e agente em faixa à parte; fora da jornada contornado | Sessão de trabalho |
| Lista de sessões | Início, fim, atividade, cliente, confiança, origem, evidências | Evento, artefatos, pulsos |
| Semana e mês | "Quantas horas por dia, e quanto foi automático?"; "Em que clientes meu tempo foi?"; "Em que atividades?" | — |
| O que os integrantes fizeram | Sessões dos meus integrantes, máquina, poupadas, % do limite | Sessão de integrante |
| Extensão | Estado, pulsos do dia por portal, pausar, lista de portais | Extensão (API-26) |
| Minhas contestações | Com a decisão do Gestor | — |
| Filtro de pacote | "Pacote: Todos · Contábil · BPO" (e Jurídico, com área do direito, quando houver) | 05, ad. 19; 05, ad. Jurídico |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A01 | Trocar dia, semana, mês e navegar datas | Gráficos e lista mudam | todos | 05, 8.2 |
| S06-A02 | Abrir sessão | Evidências (eventos, pulsos por portal, artefatos) | todos | 05, 8.2 |
| S06-A03 | Contestar | Motivo em lista (cliente errado, atividade errada, tempo errado, não era trabalho) e nota | todos | 05, 8.2 |
| S06-A04 | Confirmar estimado | A sugestão em um clique | todos | 05, 5.2 |
| S06-A05 | Corrigir ou dividir | Entre dois clientes ou atividades | todos | 05, 5.2 |
| S06-A06 | Classificar sem classificação | Atividade e cliente; "interno" | todos | 05, 5.2 |
| S06-A07 | Abrir chat do integrante | A partir da faixa do agente | todos | 05, 8.2 |
| S06-A08 | Pausar extensão | Gaveta com o tempo de pausa | todos | 05, 3 |
| S06-A09 | Ver portais da extensão | Lista; pedir inclusão | todos | 05, 10.2 |
| S06-A10 | Ler e aceitar o termo de ciência (primeiro acesso) | Faixa; só depois vincula a extensão | todos | 05, 10.1 |
| S06-A11 | Vincular extensão | Navegador, loja, vínculo pelo login, ciência com a lista de portais, pronto | todos | 05, 3.6 |
| S06-A12 | Filtrar por pacote | Chip; o custo-hora não muda | todos | 05, ad. 19 |
| S06-A13 | Ver horas de serviço extra | Sessões de tarefa marcada como extra aparecem marcadas (C2-25) | todos | C2-25 |

- **Nunca vê (Membro):** custo-hora, honorário, margem, tokens, centavos, horas de colegas, contestações de outros (05, 8.2).
- **Protótipo tem:** tudo acima menos C2-25, com pop-ups no kit (`telas/timesheet/MeuTempoTela.tsx`, `graficos.tsx`, `configuracao.tsx`, `dados/timesheet.ts`). **Falta:** marcação de extra (C2-25), chip Jurídico, "fora da jornada" sem juízo conferido.

### S06-T02 · Timesheet › Confirmações

**Objetivo.** A lista curta por dia, pré-preenchida (05, 5.2 e 8.5).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A14 | Aceitar sugestão em um clique | Item vira confirmado | todos | 05, 5.2 |
| S06-A15 | "Era o outro cliente" | Conflito resolvido | todos | 05, 5.2 |
| S06-A16 | Corrigir ou dividir | Gaveta | todos | 05, 5.2 |
| S06-A17 | "Não era trabalho" | Sai da contagem | todos | 05, 5.2 |
| S06-A18 | Confirmar tudo marcado | Em lote | todos | 05, 5.2 |
| S06-A19 | Ver últimos 7 dias | Pendências por dia; contador no item lateral | todos | 05, 8.5 |
| S06-A20 | Atribuir arquivo sem pessoa | "Quem fez?" | Gestor | 05, 8.5 |
| S06-A21 | Ver pendências por pessoa | Só a contagem, sem o conteúdo | Gestor | 05, 8.5 |
| S06-A22 | Item de "não era esta" | Vem da tarefa (S04-A52) | todos | 03, ad. 22 |

- **Limites:** itens por dia e horário da lista configuráveis, para não virar apontamento disfarçado (05, 5.3).
- **Protótipo tem:** `telas/timesheet/ConfirmacoesTela.tsx`. **Falta:** item vindo de "não era esta".

### S06-T03 · Timesheet › Equipe

**Objetivo.** Gestor e Administrador veem horas, confiança, capacidade, contestações e a qualidade da captura (05, 8.3).

| Bloco | Pergunta | Ações |
| --- | --- | --- |
| Pessoas | Quanto cada pessoa registrou, e quanto foi automático? | Abrir a pessoa |
| Onde foi | Onde o tempo do setor foi? (cliente, atividade, origem) | Alternar |
| Captura semana a semana | Automático × estimado × confirmado | — |
| Capacidade (GES-403) | Quem está acima ou abaixo da capacidade? Previsão de 2 semanas pelas tarefas abertas | Registrar ausência |
| Contestações | O que decidir? | Aceitar ou recusar com motivo |
| Cobertura e atividades mal capturadas | Que atividades a captura não enxerga? | Abrir |
| Calibração | O padrão do catálogo está certo? | Adotar a mediana |
| Fila sem equivalente | Que tarefas do core não entram? | Ir a Gestão › Catálogo local |
| Sistemas conectados | Cores e o estado | Conectar sistema contábil |
| Agentes | O que os integrantes fizeram, custaram e pouparam? | — |
| Fora da jornada (GES-053) | Houve trabalho fora da política? (agregado) | — |
| Sessões anômalas | Sessões longas demais, sobrepostas, sem evento (05, 11.3) | Revisar |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A23 | Filtrar | Setor, cliente ou grupo, atividade, pessoa ou integrante, período, confiança, origem, pacote, contratante e frente (BPO) | Gestor, Administrador | 05, 8.1; 05, ad. 17 |
| S06-A24 | Decidir contestação | Aceitar (vira confirmada com a correção) ou recusar (motivo) | Gestor | 05, 8.3 |
| S06-A25 | Registrar ausência | Férias, licença, atestado; entra na capacidade e no substituto | Gestor | 05, ad. 16 |
| S06-A26 | Adotar calibração | `horas_100` vira a mediana medida | Administrador | 05, 11.2 |
| S06-A27 | Conectar sistema contábil | Alterdata por token com teste; Domínio, Questor, Contmatic por relatório e pasta (API-18) | Administrador | 05, 4 |
| S06-A28 | Editar equivalências | Departamento → setor; responsável → pessoa | Administrador | 05, 4.6 |
| S06-A29 | Revisar sessão anômala | Corrigir ou descartar | Gestor | 05, 11.3 |
| S06-A30 | Reconstruir período | Reprocessa a partir dos eventos (`timesheet.reconstruir`) | Administrador | 01, 6.5; 05, 11.4 |

- **Permissões:** Gestor só os setores que gere; pessoa com dois setores aparece nos dois; custo-hora não aparece aqui (05, 8.3).
- **Protótipo tem:** pessoas, onde foi, captura, capacidade com ausências, contestações, cobertura, fila sem equivalente, sistemas, atividades mal capturadas, calibração, agentes, fora da jornada, chip de pacote (`telas/timesheet/EquipeTela.tsx`, `acoes.tsx`). **Falta:** sessões anômalas, reconstruir período, filtros contratante e frente.

### S06-T04 · Timesheet › Rentabilidade

**Objetivo.** Margem por cliente com o custo-hora do escritório (05, 8.4). Administrador; Gestor com o setor Gestão ou Financeiro.

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A31 | Ver margem da carteira | Barras divergentes com sinal e rótulo; deficitários (2 dos últimos 3 meses) | Administrador, Gestor com Gestão ou Financeiro | 05, 8.4 |
| S06-A32 | "Só medidas e confirmadas" | Alternador | idem | 05, P12 |
| S06-A33 | Escolher cliente | Linha de 12 meses com marcos (reajuste, regime, faixa estourada); horas por setor e atividade; custo do escritório; variáveis (serviços pagos, integrantes) | idem | 05, 8.4 |
| S06-A34 | Propor reajuste | Cartão do integrante de Gestão; leva à campanha do Financeiro | idem | GES-014 |
| S06-A35 | Filtrar por pacote, setor, grupo | Chip de pacote; grupo soma os clientes | idem | 05, ad. 19 |
| S06-A36 | Ver cliente sem contrato | "Não informado", margem em branco, nunca zero | idem | 05, 8.4 |
| S06-A37 | Ir ao Financeiro | DRE por centro de custo, contrato | idem | 05, 8.4 |
| S06-A38 | Ver valor-hora de cobrança (Jurídico) | Distinto do custo-hora; visível ao advogado e ao Gestor | idem | 05, ad. Jurídico |

- **Protótipo tem:** `telas/timesheet/RentabilidadeTela.tsx`. **Falta:** valor-hora do Jurídico, ligação ao DRE.

### S06-T05 · Configurações do Timesheet e pop-ups

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A39 | Configurar o módulo | Inatividade (`inatividade_min`), itens por dia, horário da lista, jornada, abertura da Equipe ao Gestor, extensão, artefatos, benchmark anonimizado | Administrador | 05, ad. 16 |
| S06-A40 | Custo-hora do escritório | Pelos gastos do mês ou valor direto; por cargo opcional; por pacote opcional (desligado) | Administrador | 05, 8.4; ad. 19 |
| S06-A41 | Portais da extensão | Desligar portal; pedir inclusão | Administrador | 05, 10.2 |
| S06-A42 | Exportar | CSV das sessões, PDF do relatório mensal, exportação anonimizada para o benchmark | conforme papel | 05, 8.1 |

- **Protótipo tem:** todos esses pop-ups (`telas/timesheet/configuracao.tsx`). **Falta:** nada estrutural; conferir textos contra 05, 10.

### S06-T06 · Extensão de navegador (simulada)

**Objetivo.** Mostrar aos contadores o que a extensão capta e o que nunca capta (05, 3). **[sem tela no protótipo; sugestão: um painel "como a extensão vê" no painel Demonstração]**

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S06-A43 | Simular visita a portal | Pulso com domínio da lista, cliente inferido (CNPJ na tela, certificado escolhido) e duração | demonstração | 05, 3.3 e 3.4 |
| S06-A44 | Ver o que nunca capta | Conteúdo, teclas, senhas, sites fora da lista | todos | 05, 3.5 |
| S06-A45 | Pausar pela extensão | Reflete em Meu tempo | todos | 05, 3 |

- **APIs simuladas:** API-26.

## S07 · Financeiro do escritório

Escopo: o item lateral Financeiro com as sete abas (09, 10.1) e a engrenagem Configurar. É o financeiro **da própria empresa** (titular escritório); as peças com titular (contas a pagar, conciliação, saldos, fluxo) servem também ao BPO (S08), que as consome sem alterar. Sem seletor de cliente; listas filtram por cliente. Não conta tempo. Fontes: 09 inteiro e adendos; 03, 6.8; 05, 8.4; 08, 7.3 a 7.5 e 13.7; C2-23, C2-25.

**Integrante do Financeiro (vale para todas as abas).** Orb e chat próprios, cartão no topo de cada aba (02, ad. 22). Faz sozinho FIN-002, 004, 005, 010, 016 e GES-001, 003, 004, 007, 009, 011, 015 (emitir cobrança e NFS-e é cartão até a promoção, só com valor igual ao contrato); prepara FIN-001, 003, 006 a 009, 011 a 014, GES-002, 013, 014, 046 e a migração; gatilhos `reajuste.vencer_em_60_dias`, `parcela.vencer_em_3_dias`, `cobranca.pagamento.informado`, `conta_pagar.capturar`, `conciliacao.divergir`, `faixa.estourar`, `cic.estado.mudar` para saída; jobs mensais (lote, fechamento e custo-hora no dia 5) e diários (baixa, conciliação, régua). **Nunca, nem com promoção:** cancelar ou substituir nota ou cobrança, pagar conta, aplicar reajuste, suspender cliente, perdoar, alterar contrato assinado, negativar, fechar o mês (09, 8). Números só pelo motor Cálculo (09, 8.4).

**Permissões (todas as abas).** Administrador: tudo, inclusive configuração, fechamento, custo-hora, remuneração e sócios. Gestor com o setor Financeiro: contratos, cobranças, contas a pagar e conciliação; aprova até a alçada (Gestor até R$ 5 mil no protótipo); lê Resultado. Gestor sem o setor: não vê o item. Membro: só por exceção na conta, com `nivel_max`; Resultado, remuneração e sócios nunca liberáveis (09, 10.6).

### S07-T01 · Financeiro › Visão geral

**Objetivo.** Abrir pelo que precisa de decisão (09, 10.2).

| Bloco | O que mostra |
| --- | --- |
| Indicadores | MRR, churn, inadimplência, caixa hoje, custo-hora |
| Precisa de você | Cartões: lote do mês, reajustes, contas a pagar esperando aprovação, faturas vencidas, lançamentos a conciliar, clientes acima da faixa |
| Caixa 90 dias | Realizado, projetado (listrado) e mínimo |
| Receita por setor e vencidas por idade | Gráficos por pergunta |
| Clientes que pedem atenção | Deficitário, fora da faixa, em pausa (D+45) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A01 | Decidir cartão do lote | Aprovar, editar (tirar exceções), recusar | Administrador, Gestor na alçada | 09, 10.2 |
| S07-A02 | Abrir item que pede atenção | Vai à aba e ao cliente | idem | 09, 10.2 |
| S07-A03 | Falar com o integrante | Chat do Financeiro | idem | 09, 10.1 |

- **Estado vazio:** "nenhum contrato estruturado; importe em Contratos" (09, 10.2).
- **Protótipo tem:** `telas/financeiro/VisaoFinTela.tsx`. **Falta:** nada estrutural.

### S07-T02 · Financeiro › Contratos

**Objetivo.** Contrato de honorários como assinatura estruturada e versionada (09, 4; FIN-001; GES-002, 008, 012, 014, 015).

| Bloco | O que mostra |
| --- | --- |
| Receita contratada | Por setor, regime e mês; clientes sem contrato estruturado |
| Contratos | Por cliente: itens (com faixa, vencimento, forma, índice e data-base, 13º, retenções, centro de custo, indicação), valor, situação, próximo reajuste; um contrato por cliente; serviços em linhas (contábil, BPO, emissão de NFS-e) |
| Faixas estouradas | Quem passou da faixa: propor aditivo ou cobrar como extra (GES-015) |
| Extras e reembolsos a faturar | Serviços avulsos aceitos, despesas adiantadas com comprovante, comandas de serviço extra vindas das tarefas (C2-25), certificado digital vendido como serviço (C2-23, fase 3) |
| Campanha de reajuste | Passos: índice, segmentar pelo custo real (Timesheet), carta, envio |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A04 | Abrir contrato | Detalhe com itens e vigências, aditivos, linha do tempo, "contrato × cobrança" | conforme permissão | 09, 10.3 |
| S07-A05 | Editar contrato | Diff antes de gravar; salvar cria versão a partir de uma competência | Administrador, Gestor | 09, 4.1 |
| S07-A06 | Preparar aditivo | Rascunho; assinatura com aprovação (API-22) | idem | 09, 10.3 |
| S07-A07 | Propor aditivo ou cobrar extra da faixa | Cartão | idem | GES-015 |
| S07-A08 | Registrar extra ou despesa | Gaveta; reembolso exige comprovante | idem | 09, 4.6 e 4.7 |
| S07-A09 | Faturar comanda de extra | A tarefa marcada como extra vira serviço avulso a aceitar | idem | C2-25 |
| S07-A10 | Campanha de reajuste | Índice (API-16), segmentar por margem (acima do índice para deficitários), carta, envio pelo CRM; aplicar sempre por cartão | Administrador | 09, 4.3; GES-014 |
| S07-A11 | Exportar | CSV e PDF | idem | 09, 10.3 |
| S07-A12 | Ver em leitura (exceção) | Sem botões de edição | Membro com exceção | 01, 3.5 |

- **Protótipo tem:** receita contratada, faixas, contratos versionados, extras e reembolsos, campanha de reajuste, leitura por exceção (`telas/financeiro/ContratosTela.tsx`). **Falta:** comandas (C2-25), certificado como serviço (C2-23), aditivo com assinatura.

### S07-T03 · Financeiro › Cobranças

**Objetivo.** O ciclo do mês, a régua e quem está devendo (09, 4.5 e 5; GES-001, 003 a 007, 009; FIN-009 a 011).

| Bloco | O que mostra |
| --- | --- |
| Lote do mês | O que mudou desde o mês anterior, 13º, exceções; gerar sozinho quando nada mudou |
| Faturas | Cliente, competência, valor, vencimento, situação, meio (boleto e Pix), NFS-e; **uma cobrança por mês, serviços em linhas, uma NFS-e por serviço** ("2 serviços, 2 NFS-e") |
| Devedores | Idade, régua, pausa em N dias, proposta de acordo |
| Recebimentos sem cobrança | Para vincular |
| Régua de honorários | D-5, D0, D+3, D+10 firme, D+20 Gestor, D+30 aviso formal, D+45 pausa parcial (nunca reter documento) |
| Notas do escritório | Emitidas, rejeitadas, canceladas, substituídas |
| Provedor | Tarifa real, Pix Automático |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A13 | Preparar e aprovar o lote | Cartão em lote; emite cobranças e NFS-e (API-20, API-21) | Administrador, Gestor | 09, 4.5 |
| S07-A14 | Abrir fatura | Histórico, linhas, notas, régua | idem | 09, 10.4 |
| S07-A15 | 2ª via atualizada | Juros e multa pelo motor Cálculo | idem; cliente no app | FIN-010 |
| S07-A16 | Registrar pagamento fora do provedor | Baixa manual com comprovante | idem | 09, 5.3 |
| S07-A17 | Corrigir nota ou valor | Cartão (sempre) | idem | FIN-011 |
| S07-A18 | Cancelar ou substituir | Cartão (sempre); motivo | idem | 09, 8.2 |
| S07-A19 | Propor acordo | Parcelas; fora da política pede alçada | idem | FIN-009 |
| S07-A20 | Vincular recebimento | Sugestão por CNPJ do pagador; vira regra proposta | idem | 09, 8.5 |
| S07-A21 | Editar a régua | Dias e textos | Administrador | 09, 5.2 |
| S07-A22 | Pausar a régua por contestação | Contestação do app pausa e avisa | sistema | 06, 3.8 |
| S07-A23 | Aviso formal e pausa parcial | Cartão; faixa no app explica o que fica em espera | Administrador | 09, 5.6 |

- **Estados:** vazio ("nenhuma cobrança no mês; prepare o lote"), vencida por idade, em acordo, aguardando confirmação ("pago" informado não baixa até o extrato).
- **Protótipo tem:** ciclo do mês, faturas com detalhe, 2ª via, pagamento fora, corrigir, cancelar, devedores com acordo, recebimentos para vincular, régua editável, linhas por serviço e NFS-e por serviço (`telas/financeiro/CobrancaTela.tsx`, `dados/financeiro.ts`). **Falta:** lista das notas do escritório com estados, Pix Automático, aviso formal e pausa parcial como cartões.

### S07-T04 · Financeiro › Contas a pagar

**Objetivo.** Capturar, classificar e aprovar o que o escritório paga; a liberação final é sempre no banco (09, 6.1; FIN-003).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A24 | Capturar conta | Por arquivo, código de barras ou à mão; DDA e e-mail simulados | Administrador, Gestor | 09, 6.1 |
| S07-A25 | Classificar | Categoria, centro de custo, rateio (preparar) | idem | 09, 6.1 |
| S07-A26 | Conferir | Duplicidade suspeita; fornecedor novo | idem | 09, 6.1 |
| S07-A27 | Aprovar e agendar | Alçada pela conta (Gestor até R$ 5 mil, Administrador acima); aprovação em lote; "liberação final no banco" | conforme alçada | 09, 6.1 |
| S07-A28 | Anexar comprovante | Baixa | idem | 09, 6.1 |

- **Protótipo tem:** fila por estado, alçada, conferir, aprovação em lote (`telas/financeiro/ContasPagarTela.tsx`, peças com titular em `pecas.tsx`). **Falta:** DDA e e-mail como origens visíveis.

### S07-T05 · Financeiro › Conciliação

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A29 | Confirmar sugestão | Lançamento ligado; cria regra (executar) | Administrador, Gestor | 09, 6.2 |
| S07-A30 | Aceitar em lote as seguras | Só as de regra aprovada | idem | 09, 6.2 |
| S07-A31 | Ajuste manual | Cartão | idem | 09, 10.5 |
| S07-A32 | Aprovar regra proposta | Vale daí em diante | idem | 09, 3.1 |
| S07-A33 | Renovar consentimento Open Finance | Conta com consentimento vencido (API-19) | Administrador | 09, 6.2 |

- **Protótipo tem:** `telas/financeiro/ConciliacaoTela.tsx`. **Falta:** regras propostas como lista, consentimento vencido.

### S07-T06 · Financeiro › Fluxo de caixa

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A34 | Ver 12 meses realizado e projetado | Projetado listrado; marcos | Administrador, Gestor | 09, 7.1 |
| S07-A35 | Simular "e se" | Cenários mudam as entradas projetadas | idem | 09, 7.1 |
| S07-A36 | Salvar cenário | Aparece no Resultado como comparação | idem | 09, 10.5 |
| S07-A37 | Ver saldos por conta | Com origem (Open Finance, OFX, manual) | idem | 09, 3.1 |

- **Protótipo tem:** `telas/financeiro/CaixaTela.tsx`. **Falta:** nada estrutural.

### S07-T07 · Financeiro › Resultado

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A38 | Ver DRE gerencial | Por centro de custo, com o custo vindo do Timesheet e a opção de ratear o Atendimento | Administrador; Gestor lê | 09, 7.2 |
| S07-A39 | Orçado × realizado | Orçamento (fase 4; montado e desligado na v1 com "ainda não há dados suficientes para ativar") | Administrador | 09, 7.4 |
| S07-A40 | Antecipar lucros aos sócios | Gaveta com memória de cálculo | Administrador | 09, 7.4 |
| S07-A41 | Comissões e PLR | Regra de remuneração e apuração | Administrador | 09, 7.4 |
| S07-A42 | Custos variáveis por cliente | Absorver ou repassar | Administrador | GES-010 |
| S07-A43 | Fechar o mês | Cartão; fechado bloqueia lançamento retroativo; reabrir exige motivo | Administrador | 09, 3.1 |
| S07-A44 | Propor custo-hora | Preparar; vai ao Timesheet | Administrador | 09, 7.3 |

- **Protótipo tem:** indicadores, DRE por centro de custo, orçado × realizado, antecipação, comissões e PLR, custos variáveis (`telas/financeiro/ResultadoTela.tsx`). **Falta:** fechar e reabrir o mês, estado "desligado até haver dados" das partes da fase 4.

### S07-T08 · Financeiro › Configurar

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S07-A45 | Provedor de cobrança em passos | Banco do escritório ou provedor; trocar sem perder autorizações de Pix Automático (API-20) | Administrador | 08, 13.7; 09, 9.2 |
| S07-A46 | NFS-e do escritório | Dados, série, retenções; `nfse_por_servico` (padrão uma por serviço, "a confirmar na NT 007/2026") | Administrador | 01, ad. 27 |
| S07-A47 | Política de inadimplência | Dias da régua, aviso formal e pausa; nunca reter documento | Administrador | 09, 5.6 |
| S07-A48 | Conectar conta por Open Finance | Passos com consentimento | Administrador | 09, 6.2 |
| S07-A49 | Plano de contas e centros de custo | Modelo padrão; editar; "entra no custo-hora" | Administrador | 09, 3.1 |
| S07-A50 | Alçadas de aprovação | Por valor e papel | Administrador | 09, 10.6 |
| S07-A51 | Trazer o financeiro atual | Conexa, Omie, Conta Azul, Nibo, Domínio Honorários, planilha; data de virada; paridade (API-30) | Administrador | 09, 9 |
| S07-A52 | Tabela de avulsos | Preço por atividade do catálogo | Administrador | 09, 3.1 |

- **Protótipo tem:** provedor, NFS-e, política, Open Finance, plano de contas, alçadas, importação, exportar (`telas/financeiro/configuracao.tsx`). **Falta:** centros de custo como cadastro próprio, tabela de avulsos, `nfse_por_servico` visível.

- **Entidades (S07):** as do 09, 3.1. **APIs simuladas:** API-16, API-19, API-20, API-21, API-22, API-30.

## S08 · BPO

Escopo: o item lateral BPO com as nove abas, nas duas frentes (financeira, das empresas clientes; e entre escritórios, com contratantes); o item Clientes do BPO puro (C1); a troca de contexto mãe e contratante; o portal do convidado do contratante; as telas do app do cliente que são do BPO (aprovações de pagamento, caixa, proposta de alçada). Fontes: 10 inteiro e adendos; 09 (peças com titular); 01, ad. 23 a 27; 06, ad. 19 a 22; 02, ad. "integrantes do BPO por função"; PLANO do UI lab, seção BPO.

**Regras do módulo (valem em todas as abas).** Item só com o setor `bpo_financeiro` e o módulo ligado em Configurações › Assinatura; seletor lista só empresas de BPO; nenhum pagamento sem aprovação humana registrada, pagar e transferir nunca automáticos, vencido sem aprovação só alerta (invariante B3); quem digitou não confere; quem altera a alçada não confere nem aprova naquela empresa; alçada entre a da pessoa e a da empresa vale a menor; faixa 1 até R$ 2 mil (um aprovador), faixa 2 até R$ 20 mil (quem tem alçada para o total), acima: aprovação reforçada com duas pessoas; no M1 o cliente libera no banco depois de aprovar; M3 desligado na primeira versão; escalonamento do lote (9h; +4 h lembrete; +8 h ou dia útil seguinte ao substituto; véspera, alerta ao Gestor do BPO e ao sócio; vencido, só alerta e empresa vermelha); auditoria com cor **e** rótulo ("em dia", "atenção", "agir hoje"), critérios fixos e pesos ajustáveis pelo Gestor; gestão por exceção (abre só o que está fora do verde) (10, 3 e 5.2; PLANO, BPO).

**Integrantes (um por função).** Contas a Pagar (captura, fornecedor, lote, alçada; só prepara), Contas a Receber (boletos, cobrança, baixa), Conciliação (extrato, espelho do ERP, sincronização), Gerencial (previsão de caixa, DRE, relatório do mês, fechamento), mais o Atendimento; no modo entre escritórios, o integrante SLA e fila (um contratante por contexto, memória nunca cruzada). Cada aba mostra o da função: Fila e Aprovações, Contas a Pagar; Visão geral, Carteira e Rotinas, Conciliação; Entregas, Volume e Rentabilidade, Gerencial. **Nunca:** pagar ou transferir (nunca promovível), alterar dados bancários, criar fornecedor com conta, mudar alçada ou modo, aprovar pelo cliente, fechar o mês, cobrança firme, abrir caixa postal, revogar credencial (10, 6; 02, ad. 23).

**Permissões por aba (10, 5.4).** Colaborador (Membro) vê seis (sem Volume, Rentabilidade, Configuração); Gestor do BPO oito (sem Rentabilidade e sem margem; edita a Configuração, que só vale com o aceite do sócio no app); Administrador nove; Gestor do BPO com Gestão ou Financeiro vê Rentabilidade. Margem e custo-hora nunca liberáveis por exceção.

### S08-T01 · BPO › Visão geral

| Bloco | O que mostra |
| --- | --- |
| Precisa de decisão | Vermelho antes de amarelo, as seis primeiras e "mostrar todas": cartões aguardando o cliente (e os que vencem), conferências a fazer, lotes |
| Auditoria (audit score) | Contagem por cor, com rótulo e motivo; "38 empresas em dia" recolhidas |
| Exceções do dia | Fornecedor novo, consentimento a vencer, caixa abaixo do mínimo, sincronização atrasada |
| Com uma empresa escolhida | Auditoria, caixa e fluxo dela (peças do Financeiro com selo do titular) |
| Entre escritórios (contexto mãe) | Contratantes, empresas, no prazo, bola BPO, bola contratante, margem; "abrir contratante" (abre no contexto dele) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A01 | Abrir decisão | Vai à aprovação, conferência ou empresa | conforme aba | 10, 5.2 |
| S08-A02 | Mostrar todas | Expande a lista | todos | 10, 5.2 |
| S08-A03 | Ver motivo da cor | Critérios do score com o peso | todos | 10, 5.2 |
| S08-A04 | Escolher empresa | Auditoria, caixa e fluxo dela | todos | 10, 5.2 |
| S08-A05 | Abrir contratante (C2) | Troca para o contexto do contratante sem novo login | equipe do BPO | 10, 4.1; 01, ad. 23 |

- **Protótipo tem:** Visão geral pelo que precisa de decisão, semáforo com rótulo, empresa escolhida (`telas/bpo/VisaoBpo.tsx`). **Falta:** frente entre escritórios (contexto mãe), exceções do dia completas.

### S08-T02 · BPO › Carteira

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A06 | Ver empresa | Audit score com motivo, saldo, pendências, ERP e sincronização (sincronizado, atrasada, credencial vencida, modo arquivo, livro próprio), caixa contra o mínimo, lotes com o cliente, fila e SLA | todos | 10, 5.2 |
| S08-A07 | Abrir no ERP | Atalho por linha (simulado, API-25) | todos | 10, 3.0 |
| S08-A08 | Religar credencial ou pedir nova autorização | Cartão ao cliente pelo app | Gestor | 10, 5.2 |
| S08-A09 | Editar perfil BPO da empresa | Escopo, modo de execução, bancos, alçada, responsável, analista, SLA, termo, paralelo até | Gestor | 10, 3.12 |
| S08-A10 | Onboarding da empresa | Passos (10, 3.3): termo, ERP, bancos por Open Finance, fornecedores com dados bancários confirmados, alçadas com aceite, paralelo | Gestor | 10, 3.3 |
| S08-A11 | Encerrar empresa | Offboarding com SLA e devolução | Administrador | 10, 3.14 |
| S08-A12 | Alternar "Empresas · Contratantes" | Com as duas frentes | todos | 10, 5.2 |

- **Protótipo tem:** ERP e sincronização por empresa (`telas/bpo/VisaoBpo.tsx`, `dados/bpo.ts`). **Falta:** onboarding em passos, encerrar, frente de contratantes, perfil BPO editável.

### S08-T03 · BPO › Fila e pedidos

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A13 | Filtrar pela bola | Todas, conosco, com o cliente (e, no C2, com o contratante, com o cliente final) | todos | 10, 5.3 |
| S08-A14 | + Pedido | Pedido do cliente ("pague o fornecedor X") vira item com completude conferida (BPO-009) | todos | 10, 5.3 |
| S08-A15 | Passar a bola | Cobra quem está com ela; SLA conta | Gestor; integrante cobra | BPO-010 |
| S08-A16 | Executar item | Conforme a função | Membro | 10, 5.4 |
| S08-A17 | Reatribuir | Arrastar ou escolher | Gestor | 10, 5.4 |

- **Protótipo tem:** fila com a bola conosco ou com o cliente (`telas/bpo/OperacaoBpo.tsx`). **Falta:** + Pedido com completude, frente C2 com contratante e cliente final, SLA por item.

### S08-T04 · BPO › Rotinas

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A18 | Marcar checklist diário, semanal, mensal | Por empresa; quem marcou e quando | Membro | 10, 3.1 |
| S08-A19 | Conciliar o dia | Conciliação da empresa (peça do Financeiro, titular empresa) | Membro | 10, 3.10 |
| S08-A20 | Ver calendário único | Uma cor por pacote (obrigações contábeis e rotinas do BPO juntas) | todos | PLANO, BPO |
| S08-A21 | Configurar rotina | Itens e periodicidade | Gestor | 10, 5.4 |

- **Protótipo tem:** checklist, conciliação do dia e calendário único (`telas/bpo/OperacaoBpo.tsx`). **Falta:** configurar rotina.

### S08-T05 · BPO › Aprovações

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A22 | Conferir conta | Quem digitou não confere (botão desligado com o motivo) | Membro com outra pessoa; Gestor | 10, 3.8 |
| S08-A23 | Pôr no próximo lote | Conta conferida entra no lote da janela | Membro | 10, 3.5 |
| S08-A24 | Montar lote e enviar ao cliente | Cartão no app com linha do tempo "se ninguém responder" | Gestor | 10, 3.6 |
| S08-A25 | Acompanhar lote | Aprovado, editado (contas tiradas), recusado com motivo, expirado; "Já liberei no banco" no M1 | todos | 10, 3.6 |
| S08-A26 | "Cliente confere" | BPO de uma pessoa: conferência pelo cliente | Gestor | PLANO, BPO |
| S08-A27 | Aprovação reforçada | Duas pessoas marcadas na ficha | sistema | 10, 3.7 |

- **Protótipo tem:** conferência com segregação, lotes com o cliente, decisão vinda do app (`telas/bpo/AprovacoesBpo.tsx`, `cliente/bpo.tsx`). **Falta:** lote novo montado pela equipe gerar cartão novo no app (limitação anotada), linha do tempo do escalonamento visível no cartão.

### S08-T06 · BPO › Entregas e SLA · Volume e faturamento · Rentabilidade e capacidade

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A28 | Fechar relatório do mês | Relatório por empresa em Arquivos › Entregáveis › BPO financeiro | Gestor | 10, 5.2 |
| S08-A29 | Ver SLA e desvios | Por empresa e analista; qualidade (BPO-013) | todos | 10, 5.2 |
| S08-A30 | Ver volume | Contagem de lançamentos, extrato, contestação, glosa | Gestor, Administrador | 10, 7.2 |
| S08-A31 | Faturar no Financeiro | Excedente vira extra na fatura única com o ok de uma pessoa; abre Cobranças | Administrador | 10, 7.3 |
| S08-A32 | Ver margem | Por empresa, contratante e departamento; carga por semana; leva ao Timesheet com o filtro de pacote | Administrador (Gestor com Gestão ou Financeiro) | 10, 7.4 |

- **Protótipo tem:** as três abas (`telas/bpo/GestaoBpo.tsx`). **Falta:** contestação e glosa, margem por contratante.

### S08-T07 · BPO › Configuração

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A33 | ERP e modo da empresa | Conta Azul, Omie, Bling por API; Nibo, Granatum por arquivo; livro próprio; escopo da credencial (API-25) | Gestor, Administrador | 10, 3.0 |
| S08-A34 | Bancos por Open Finance | Consentimento do cliente (API-19) | idem | 10, 3.4 |
| S08-A35 | Modo de pagamento | M1 (cliente libera), M2 (teto delegado), M3 desligado | idem | 10, 3.7 |
| S08-A36 | Alçadas | Gaveta salva na ficha; vale só depois do aceite do sócio no app | idem | 10, 3.9 |
| S08-A37 | Janela e escalonamento | Abertura, prazos e substituto por empresa | idem | 01, ad. 27 |
| S08-A38 | Pesos do audit score | Critérios fixos; o Gestor ajusta os pesos | Gestor | 02, ad. 26 |
| S08-A39 | Contratos, escopo, suboperadores, procurações, marca, convidados e teto (C2) | Frente entre escritórios | Administrador | 10, 5.2 |

- **Protótipo tem:** ERP da empresa, alçadas, janela e escalonamento (`telas/bpo/ConfigBpo.tsx`). **Falta:** pesos do score, modo M2 com teto, frente C2.

### S08-T08 · Clientes (BPO puro, sem Painel)

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A40 | Ver cadastro | Pacotes de cada cliente, quem atende, ERP, ficha | quem não tem Painel | PLANO, BPO |
| S08-A41 | Ver contatos | Canal, app, alçada de pagamento, papel por serviço | idem | PLANO, BPO |
| S08-A42 | Novo cliente | Gaveta (mesmo cadastro do Societário, sem duplicar) | Gestor, Administrador | 10, 2.2 |

- **Protótipo tem:** `telas/ClientesTela.tsx` com Cadastro, Contatos e Novo cliente. **Falta:** cenário "Só BPO" com Visão geral, Fluxo e Resultado do Financeiro com números próprios (limitação anotada).

### S08-T09 · BPO entre escritórios: contexto e portal do convidado

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A43 | Trocar contexto mãe e contratante | Mãe: listas, SLA e capacidade sem abrir conteúdo e sem IA; contratante: só aquele; tema do contratante | equipe do BPO | 01, ad. 23; 10, 4.1 |
| S08-A44 | Portal do convidado | O contratante entra com a marca dele; vê fila compartilhada, aprovações de revisão (se responsável técnico), relatório e SLA dele, extrato de volume com contestação | convidado | 10, 4.1.1 e 5.4 |
| S08-A45 | Convidar pessoa do contratante | Teto de 10 por contratante (editável); sem preço por usuário | Administrador | 01, ad. 23 |
| S08-A46 | Modo de contato por contratante | Invisível, com a marca dele ou direto; o cliente final nunca vê a marca do BPO | Administrador | 04, ad. 19 |

- **Protótipo tem:** nada. **Falta:** tudo.

### S08-T10 · App do cliente: telas do BPO

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S08-A47 | Pagamentos para aprovar (Início) | Lista dos lotes; primeira tela de quem tem alçada | cliente com alçada | 06, ad. 19 e 20 |
| S08-A48 | Aprovar lote | Aprovar, Editar e aprovar (tirar contas), Recusar com motivo; registra quem e quando; avisa a equipe no sino | idem | 10, 3.6 |
| S08-A49 | "Já liberei no banco" (M1) | Fecha o lote | idem | 10, 3.6 |
| S08-A50 | Aprovar pelo WhatsApp | Só abaixo de um teto baixo e com código de uso único; acima, abre o app com segundo fator | idem | 04, ad. 19 |
| S08-A51 | Aceitar ou recusar proposta de alçada | Cartão "o escritório propôs novas alçadas" | sócio aprovador | PLANO, BPO |
| S08-A52 | Ver fluxo de caixa e relatório do BPO | Mais › Fluxo de caixa; Entregáveis › BPO financeiro | cliente com a área | 06, ad. 20 |

- **Protótipo tem:** `cliente/bpo.tsx` (aprovações, cartão do lote, caixa, proposta de alçada). **Falta:** aprovação pelo WhatsApp com código, relatório do BPO como documento novo destacado.

- **Entidades (S08):** Perfil BPO da empresa, Fornecedor da empresa, Lote de pagamento, Alçada, Subconta de cobrança, Conexão de ERP, Conta de cliente (linha `bpo_financeiro`), peças do 09 com `titular = empresa`, Subinquilino. **APIs simuladas:** API-19, API-20, API-25, API-03.

## S09 · Arquivos, Configurações, entrada e implantação

Escopo: o módulo Arquivos e o visualizador de documentos; as Configurações (Escritório; Usuários; Papéis, permissões e setores; Integrantes; Tema e marca branca; Armazenamento; Conectores e cofre; Assinatura e plano); o Suporte; o login, o primeiro acesso por convite, o assistente de implantação do escritório e o Raio-X do Drive. Configurações só para o Administrador, sem seletor de cliente, não contam tempo. Fontes: 01, 2, 3, 7, 9, 10, ad. 22 a 27; 08, 3 e 10; 02, 3.3 e 11; 03, ad. 17 e 23 a 26; D-01, D-05, D-06, D-10, D-30 a D-33, D-38; C2-26; Estudo de precificação (marca branca).

### S09-T01 · Arquivos

**Objetivo.** O "servidor" do escritório: uma árvore só, espelhando os conectores, com o que o cliente vê marcado (01, 7; 01, ad. 22).

| Bloco | O que mostra | Dados |
| --- | --- | --- |
| Árvore | `<CNPJ - Nome>/permanentes`, `<ano>/<competência>/trabalho interno`, `Entregáveis/Fiscal · Folha · Contábil · BPO financeiro · Financeiro · Jurídico`, `_escritorio` (só Administrador); selo da pasta visível ao cliente | Documento, Conector |
| Recentes | O que chegou por último, de qualquer origem (app, conversas, integrantes, equipe, e-mail, malote, comunicação interna) | Documento |
| Busca | Em todas as pastas, só no escopo | `busca.global` |
| Drive antigo | Somente leitura, com selo | Conector `somente_leitura` |
| Fila "confirmar origem" | Arquivos da nuvem sem `enviado_por` | Documento |
| Manutenção (D-06) | Pastas fora do padrão, pastas sem cliente, ex-clientes ainda na pasta principal | Conector |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A01 | Navegar e abrir | Visualizador na marca do escritório | todos no escopo | 01, ad. 22 |
| S09-A02 | Enviar arquivo | Gaveta; classifica cliente, competência, tipo; hash | todos | 01, 7 |
| S09-A03 | Nova pasta | Gaveta | todos | 01, 7 |
| S09-A04 | Mover e renomear | Mudança de cliente vai para conferência; registros de entrega seguem o hash | Gestor, Administrador | 01, 7.4 |
| S09-A05 | Ver versões lado a lado | Alterado na nuvem cria versão; comparar | todos | 01, 7.4 |
| S09-A06 | Forçar visível ou oculto | Registra quem forçou | Gestor, Administrador | 01, 7.8 |
| S09-A07 | Ver registro de entrega | Visto, baixado, enviado, confirmado; comprovante em PDF com o tema | todos | 01, 7.7 |
| S09-A08 | Confirmar origem | Atribui `enviado_por` e tarefa | Membro do setor | 01, 7.4 |
| S09-A09 | Resolver conflito | Versão com sufixo; escolher | Gestor | 01, 7.4 |
| S09-A10 | Ver arquivo sem bytes | "Indisponível desde" com aviso ao Administrador | todos | 01, 7.4 |
| S09-A11 | Aviso de pasta fora do padrão | O integrante do setor avisa quem salvou, na hora | integrante | D-01 |
| S09-A12 | Ver repetidos | Mesma impressão digital em dois lugares (D-05, ideia) | todos | D-05 |
| S09-A13 | Configurar estrutura | Atalho para Armazenamento | Administrador | README |

- **Protótipo tem:** árvore por cliente, recentes, busca, enviar, nova pasta, Drive antigo em leitura, visualizador (`telas/ArquivosTela.tsx`, `dados/arquivos.ts`). **Falta:** mover e renomear, versões lado a lado, confirmar origem, conflito, sem bytes, manutenção (D-06), aviso de pasta fora do padrão (D-01), repetidos (D-05).

### S09-T02 · Visualizador de documento

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A14 | Abrir de qualquer menção | Folha, pasta real (trilha leva a Arquivos), onde os bytes estão, versão, impressão digital, visibilidade no app, registro de entrega | todos | 01, ad. 22 |
| S09-A15 | Baixar e imprimir | Registra | todos | 01, 7.7 |
| S09-A16 | Enviar ao cliente | Cartão; confere o CNPJ antes (D-34) | todos com o setor | 03, 5; D-34 |
| S09-A17 | Conferir assinatura dentro do PDF | Para documentos da fila do contador (D-16) | Contábil | D-16 |

- **Protótipo tem:** `components/compostos/visualizador-documento.tsx`, `ambiente/documentos.tsx`. **Falta:** enviar com conferência de CNPJ, conferência de assinatura.

### S09-T03 · Configurações › Escritório

| Bloco | O que mostra e faz |
| --- | --- |
| Dados | Razão, fantasia, CNPJ, CRC, fuso |
| Regras de acesso | Inatividade (2 a 5 min), segundo fator para os demais, carteira de clientes (ligar avisa quem fica sem cliente) |
| Setores | Fixos: renomear a exibição, desativar, responsável padrão, número padrão; setores do perfil |
| Notificações padrão | Resumo diário, silêncio, para quem não mudou as próprias |
| Calendário do escritório | Feriados e plantão (usados pelo CRM e pelo calendário) **[o protótipo os tem no CRM]** |
| Setores que o escritório não atende | Esconde obrigações deles (D-25, ideia) |
| Modo BPO e subinquilinos | Novo subinquilino; `escopo_mae` |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A18 | Editar dados | Gaveta | Administrador | 01, 2.2 |
| S09-A19 | Editar regras de acesso | Gaveta; ligar a carteira com aviso | Administrador | 01, 2.2 |
| S09-A20 | Renomear e desativar setor | Exibição muda em todo o sistema (abas, integrantes, canais da comunicação interna) | Administrador | 01, 4.1 |
| S09-A21 | Definir responsável padrão do setor | Conta responsável quando o cliente não tem | Administrador | 01, 4.1 |
| S09-A22 | Editar notificações padrão | Gaveta | Administrador | 01, 8 |
| S09-A23 | Criar subinquilino | Razão, CNPJ, escopo da mãe | Administrador (modo BPO) | 01, 2.2 |

- **Protótipo tem:** dados, regras de acesso, setores, setores do perfil, notificações, modo BPO com subinquilinos (`telas/config/EscritorioTela.tsx`). **Falta:** calendário do escritório próprio, exclusão de setores (D-25).

### S09-T04 · Configurações › Usuários

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A24 | Convidar pessoa | Papel, setores com modo (gestão ou execução), cargo; convite de 7 dias por e-mail | Administrador | 01, 2.4 |
| S09-A25 | Editar pessoa | Papel, vínculos, cargo, exceções por tela (liberar ou bloquear, nível máximo, motivo, vigência), carteira | Administrador | 01, 2.2 |
| S09-A26 | Aplicar perfil de apoio (recepção) | Modelo de exceções: vê e conclui só o que é de apoio nos setores escolhidos | Administrador | C2-26 |
| S09-A27 | Ver "o que vê" calculado | Abas e nível por módulo, com a exceção que causou | Administrador | 03, 9.3 |
| S09-A28 | Bloquear e desbloquear | Sessões caem | Administrador | 01, 2.2 |
| S09-A29 | Desativar com repasse | Tarefas, conversas e integrantes da pessoa repassados; conversas internas: perde o acesso, histórico fica | Administrador | GES-021; 11, 1 |
| S09-A30 | Reenviar e cancelar convite | Convites pendentes | Administrador | 01, 2.4 |
| S09-A31 | Exemplos de papéis do segundo escritório | Recepção, Supervisão e Direção como modelos prontos na implantação | Administrador | E-05 |

- **Protótipo tem:** pessoas com papel e vínculos, convidar, editar com exceções, carteira, bloquear, desativar com repasse, "o que vê", convites (`telas/config/UsuariosTela.tsx`). **Falta:** perfil de apoio (C2-26), modelos Recepção, Supervisão, Direção.

### S09-T05 · Configurações › Papéis, permissões e setores

**Objetivo.** A matriz calculada pela função única, para conferir e explicar (01, 3; 03, 9). **[sem regra no plano sobre aba própria; a matriz já mora em Painel › Gestão; sugestão: aba ou seção "Permissões" em Configurações com a mesma matriz]**

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A32 | Ver matriz usuário × aba × nível | Só leitura, calculada | Administrador | 03, 6.9 |
| S09-A33 | Simular uma pessoa | Igual a S04-A19 | Administrador | 03, 9.3 |
| S09-A34 | Ver regras por papel | Administrador, Gestor, Membro, apoio, cliente, convidado; o que nunca é liberável (margem, custo-hora, Resultado) | Administrador | 01, 3.2; 09, 10.6 |

### S09-T06 · Configurações › Integrantes

| Bloco | O que mostra e faz |
| --- | --- |
| Perguntas para você | Promoções pendentes (sim vale para sempre; não silencia 90 dias) |
| Time padrão por setor | Ligar, regras do escritório com trava, canal de aviso |
| Faz sozinho por setor | Lista que vem cheia; o Administrador só tira |
| Limites | Por pessoa (tokens por dia, custo por mês, concorrência) e teto do escritório; teto de gasto sem deixar o cliente mudo (cai para uma pessoa, D-32) |
| Modelos publicados | Publicar modelo de um integrante (não copia memória, clientes nem credenciais) |
| Memória do escritório a revisar | Por setor, com `revisado_por_admin_em`; manual de procedimentos (D-36, depois) |
| Criados pelas pessoas | Lista, em observação, pausar |
| Liberação no atendimento | Categorias liberadas para o integrante responder sozinho ao cliente (começa vazia, D-33); clientes-piloto (D-31); modo simulação (D-30) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A35 | Responder promoção | Sim ou não | Administrador | 02, 3.3 |
| S09-A36 | Tirar atividade do "faz sozinho" | Volta a cartão; evento | Administrador | 01, 3.3 |
| S09-A37 | Ligar e desligar integrante padrão | Por setor | Administrador | 02, 3.2 |
| S09-A38 | Editar limites | Por pessoa e teto | Administrador | 02, 11.2 |
| S09-A39 | Publicar modelo | Gaveta | Administrador | 02, 11.3 |
| S09-A40 | Revisar memória do escritório | Aprovar, corrigir, remover | Administrador | 01, 9 |
| S09-A41 | Liberar categoria de resposta sozinha | Por assunto; amostragem | Administrador | 04, 8.1; GES-062 |
| S09-A42 | Definir clientes-piloto | A IA só fala com cliente real desta lista | Administrador | D-31 |
| S09-A43 | Ligar modo simulação | A equipe testa sem gravar nem enviar | Administrador | D-30 |

- **Protótipo tem:** perguntas, time padrão, faz sozinho, limites, modelos, memória a revisar, criados pelas pessoas (`telas/config/IntegrantesTela.tsx`). **Falta:** categorias liberadas, clientes-piloto, modo simulação, teto que cai para pessoa.

### S09-T07 · Configurações › Tema e marca branca

**Objetivo.** A identidade do escritório no sistema e no app. **Marca branca é complemento:** sem ele, o escritório usa o tema padrão da plataforma; com ele, logotipo, cores, domínio, remetente e app com a marca (Estudo de precificação; 06, 11).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A44 | Ver estado do complemento | Sem marca branca: identidade da plataforma e convite "adicionar marca branca" (leva à Assinatura) **[sem regra no plano sobre o que fica editável sem o complemento]** | Administrador | Estudo, ajustes de 7/11 |
| S09-A45 | Identidade | Nome do produto, logotipo, ícone, favicon | Administrador | 01, 10 |
| S09-A46 | Cores por modo | Claro e escuro, com verificação de contraste; atenção separada do destaque | Administrador | 01, ad. 22 |
| S09-A47 | Tipografia e raio | Fontes e raio | Administrador | 01, 10 |
| S09-A48 | Prévia ao vivo | Só no recorte, antes de publicar | Administrador | 01, ad. 22 |
| S09-A49 | Integrantes padrão | Nome e cor de cada um (o Assistente é o contraste do tema, não configurável) | Administrador | 01, ad. 22 |
| S09-A50 | Domínios | Painel e app, com verificação de DNS (API-28) | Administrador | 01, 10 |
| S09-A51 | Remetente de e-mail | SPF e DKIM | Administrador | 01, 10 |
| S09-A52 | Nome no WhatsApp | Por número | Administrador | 01, 10 |
| S09-A53 | Modelos de texto e de documento | Saudação, fora de horário, régua, rodapé, cabeçalho de relatório | Administrador | 01, 10 |
| S09-A54 | Versões e publicar | Nova versão; a anterior fica; documentos guardam a versão | Administrador | 01, 10 |

- **Protótipo tem:** identidade, cores com contraste, tipografia, prévia no recorte, integrantes padrão, domínios, remetente, modelos de texto, versões (`telas/config/TemaTela.tsx`, `src/theme/`). **Falta:** estado do complemento (com e sem marca branca), modelos de documento, nome no WhatsApp por número.

### S09-T08 · Configurações › Armazenamento

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A55 | Conectar nuvem | Passos: tipo (Drive, OneDrive/SharePoint, S3, WebDAV, SFTP), autorizar (API-24), raiz, casar pastas com clientes, pronto | Administrador | 01, 7.1 e 7.3 |
| S09-A56 | Tornar padrão | Documentos novos vão para ele | Administrador | 01, 7.1 |
| S09-A57 | Migrar | Copia, confere hash, origem em somente leitura | Administrador | 01, 7.5 |
| S09-A58 | Árvore-modelo e o que o cliente vê | Marcar pasta visível vale para as filhas; ajuste por cliente | Administrador | 01, 7.8 |
| S09-A59 | Destino por tipo de documento | Mapeamento usado pelas ferramentas | Administrador | 01, 7.8 |
| S09-A60 | Mapear pastas do Drive antigo | Ligar a cliente ou ignorar; dicionário editável | Administrador | 01, 7.3 |
| S09-A61 | Ver cota | 90% avisa; duplicados contam uma vez | Administrador | 01, 7.6 |
| S09-A62 | Bloco de manutenção | Pastas fora do padrão, sem cliente, ex-clientes | Administrador | D-06 |
| S09-A63 | Rodar o Raio-X | Abre S09-T13 | Administrador | D-10 |

- **Protótipo tem:** conectores com cota, padrão, conectar em passos, migrar, árvore-modelo, destino por tipo, pastas sem cliente (`telas/config/ArmazenamentoTela.tsx`). **Falta:** manutenção (D-06), Raio-X, dicionário editável.

### S09-T09 · Configurações › Conectores e cofre (aba nova)

**Objetivo.** Conexões, credenciais, saúde, custo do mês e teto (03, ad. 17; 08).

| Bloco | O que mostra |
| --- | --- |
| Conexões | Por família (governo federal, estadual e municipal, cores, mercado, ERPs, nuvens): estado (ativo, erro de credencial, somente leitura), última execução, fila, erros |
| Cobertura por cliente | Perfil por UF: o caminho de captura de cada documento e o que falta por cliente (08, 5.1 e 5.5) |
| Cofre | Credenciais por tipo (e-CNPJ do escritório, A1 de cliente, procuração RFB, procuração estadual, token de API, OAuth, chave de nuvem); titular, validade, serviços, uso, compartilhada com; nunca o segredo |
| Custo do mês e teto | Por conector e por cliente; teto do escritório |
| Auditoria mensal | Sem uso há 90 dias, vencendo em 30, compartilhadas sem termo, tokens sem rotação |
| Saúde das rotinas | Jobs dos integrantes e conectores: última execução, fila, arquivos com erro (D-38) |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A64 | Conectar | Gaveta por conector (token, OAuth ou termo do Integra assinado) | Administrador | 08, 2.2 |
| S09-A65 | Testar conexão | Resultado simulado, incluindo erro | Administrador | 08, 2.4 |
| S09-A66 | Vincular e-CNPJ do escritório | Envio direto ao cofre (API-29); validade monitorada | Administrador | 08, 3.1 |
| S09-A67 | Rotacionar e revogar credencial | Revogar pausa os clientes afetados e avisa o setor | Administrador | 08, 3.2 |
| S09-A68 | Ver uso da credencial | Eventos `credencial.usar` | Administrador | 08, 3.2 |
| S09-A69 | Definir teto de custo | Ao atingir, pausa o que é pago e avisa | Administrador | 08, 10 |
| S09-A70 | Reprocessar rotina parada | Fila anda | Administrador | D-38 |

- **Protótipo tem:** nada (credenciais aparecem só no app e em Armazenamento). **Falta:** a aba inteira.

### S09-T10 · Configurações › Assinatura e plano

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A71 | Ver pacotes e módulos | Pacote de área (Contábil, BPO, Jurídico), módulos da plataforma (CRM, Timesheet, Financeiro, Open Finance), **App do cliente incluído**, complementos (marca branca, app na loja), módulos extras (BPO) | Administrador | 01, ad. 23; Estudo |
| S09-A72 | Adicionar módulo ou complemento | Liga o item lateral e as abas | Administrador | 03, ad. 19 |
| S09-A73 | Ver uso do plano | Usuários, clientes, GB, IA por usuário (janelas de 5 h e 7 dias), integrantes | Administrador | 01, 2.2 |
| S09-A74 | Planos de IA por usuário | Atribuir plano a cada pessoa (o plano é do usuário) | Administrador | 10, 6.3 |
| S09-A75 | Dados de cobrança e faturas | Histórico | Administrador | README |
| S09-A76 | Trocar plano | Bloqueia se o uso já passa do plano menor | Administrador | README |
| S09-A77 | Encerrar assinatura | Confirmação digitada, exportação completa, 90 dias em leitura; app dos clientes em modo leitura | Administrador | 06, ad. 18 |
| S09-A78 | Configurador de preço (Jurídico) | Equação do JU-12 (S11) | Administrador | JU-12, 3 |

- **Protótipo tem:** módulos, módulos extras, uso, cobrança, faturas, trocar plano, encerrar (`telas/config/AssinaturaTela.tsx`). **Falta:** App incluído e marca branca como complemento, planos de IA por usuário, pacote Jurídico.

### S09-T11 · Suporte

**Objetivo.** Ajuda da plataforma para todo usuário, com ou sem plano de IA (01, ad. 24 a 27; 03, ad. 23 a 26).

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A79 | Buscar no FAQ | Seções por módulo; não conta no limite | todos | 01, ad. 27 |
| S09-A80 | Perguntar ao assistente de ajuda | Responde só sobre o sistema, com botão para a tela certa; contador das 30 perguntas do mês | todos | 01, ad. 24 |
| S09-A81 | Diagnóstico em leitura | "Olhando as suas configurações (somente leitura)", "3 de 5 leituras", o que não lê; achado vira cartão de correção (Aprovar ou Recusar) | todos | 01, ad. 26 |
| S09-A82 | Falar com a equipe | Horário (seg a sex, 8h às 20h), fila com posição, atendente entrando, "resolveu?" com avaliação; fora do horário fica para o dia seguinte | todos | 01, ad. 25 |
| S09-A83 | Aceitar compartilhamento de tela | "A equipe pediu para ver sua tela": Deixar ver por 30 min ou Recusar; indicador fixo com Encerrar; a equipe só vê | todos | 01, ad. 26 |
| S09-A84 | Ver histórico | Chamados com transcrição e sessões de tela (quem, quando, quanto tempo); o Administrador vê os de todos | todos | 01, ad. 25 |
| S09-A85 | Limite atingido | Encaminha à equipe | todos | 01, ad. 24 |

- **Protótipo tem:** tudo acima (`ambiente/suporte.tsx`). **Falta:** conferir FAQ por módulo atualizado com os módulos novos (comunicação interna, Jurídico).

### S09-T12 · Login e primeiro acesso

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A86 | Entrar | Tema carregado pelo domínio antes do login; e-mail e senha | todos | 01, 10 |
| S09-A87 | Segundo fator | Código; obrigatório para Administrador | todos | 01, 2.5 |
| S09-A88 | Conta bloqueada, desativada ou convite pendente | Barra com o motivo | todos | REVISAO, 1 |
| S09-A89 | Esqueci a senha | Código por e-mail **[sem regra detalhada no plano]** | todos | — |
| S09-A90 | Aceitar convite | Link de 7 dias; confirmar identidade; definir senha; ligar segundo fator; aceitar o termo de uso da equipe (inclui "mensagens internas não se apagam") | convidado | 01, 2.4; 11, 5 |
| S09-A91 | Escolher escritório ou contexto | Quando a pessoa tem mais de um (modo BPO) | equipe do BPO | 01, 2.5 |

- **Protótipo tem:** login com sete contas, segundo fator e barragem com motivo (`telas/LoginTela.tsx`, `ambiente/sessao.tsx`). **Falta:** aceitar convite, esqueci a senha, termo da equipe, escolha de contexto.

### S09-T13 · Assistente de implantação do escritório

**Objetivo.** Levar o escritório recém-aberto até cumprir os critérios da fase 0 ("primeiros passos", 03, 4.3), com o Geral conduzindo. **[o plano descreve os passos e a faixa; a tela de assistente em passos é desenho a fazer]**

| Passo | O que acontece | Fonte |
| --- | --- | --- |
| 1. Dados do escritório | CNPJ, CRC, fuso | 01, 2.2 |
| 2. Setores e responsáveis | Desativar o que não atende; responsável padrão (preenchido com o Administrador) | 01, 4.1 |
| 3. Convidar a equipe | Papéis com exemplos (Recepção, Supervisão, Direção) | E-05 |
| 4. Importar clientes | Do core (API-18), da planilha ou do Acessórias; conferência | 08, 6.6; GES-608 |
| 5. Conectar armazenamento e rodar o Raio-X | S09-T08 e T14 | D-10 |
| 6. Conectar WhatsApp e e-mail | S05-T04 | 04, 3.2 |
| 7. Tema (se tiver marca branca) | S09-T07 | 01, 10 |
| 8. Campanha de acessos | SOC-014 e SOC-011 para toda a carteira | 03, 4.3 |
| 9. Plano mestre de migração | Ondas por ferramenta antiga | GES-608 |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A92 | Seguir passo a passo | Cada passo marca feito; pular e voltar | Administrador | 03, 4.3 |
| S09-A93 | Importar clientes | Prévia com divergências; cartão antes de gravar | Administrador | 08, 6.6 |
| S09-A94 | Disparar campanha de acessos | Cartão em lote | Administrador | SOC-014 |
| S09-A95 | Concluir implantação | A faixa "primeiros passos" some da Visão geral | Administrador | 03, 4.3 |

- **Protótipo tem:** nada. **Falta:** tudo.

### S09-T14 · Raio-X do Drive

**Objetivo.** Diagnóstico das pastas de todos os clientes antes de o mapeamento valer, só lendo a lista de pastas e arquivos (D-10).

| Bloco | O que mostra |
| --- | --- |
| Resumo | "142 pastas de cliente; 128 casaram pelo CNPJ ou nome; 9 sem cliente; 5 parecem ex-clientes; Fiscal em 3 padrões; 37 pastas de mês fora do padrão" |
| Por cliente | Tem ou não Contábil, Fiscal, Pessoal, Legalização |
| Estrutura | Como cada departamento está organizado |
| Padrões | Nomes de pasta que se repetem |
| Órgãos | Receita, PGFN, Junta, Sefaz, Prefeitura, Bombeiros, Vigilância, conselhos |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S09-A96 | Rodar diagnóstico | O Geral lê a lista (simulada, API-24) e entrega o relatório no chat e na tela | Administrador | D-10 |
| S09-A97 | Decidir achados em lote | Ligar ao cliente, ignorar, marcar ex-cliente, adotar padrão; nada vale sem o sim | Administrador | D-10 |
| S09-A98 | Editar dicionário de departamentos e órgãos | Dicionário editável | Administrador | D-10 |
| S09-A99 | Ver detalhe com nomes | Contagens para todos; nomes só para o Administrador (LGPD) | conforme papel | D-10 |

- **Protótipo tem:** nada. **Falta:** tudo.

- **Entidades (S09):** Documento, Registro de entrega, Conector, Credencial, Escritório, Setor, Usuário, Vínculo, Exceção por tela, Carteira, Convite, Sessão de autenticação, Integrante, Modelo de integrante, Memória, Configuração local, Tema, Assinatura, Subinquilino, Chamado de suporte, Uso de ajuda, Sessão de tela de suporte, Item de FAQ. **APIs simuladas:** API-01, API-06, API-18, API-24, API-27, API-28, API-29.

## S10 · App do cliente (web instalável)

Escopo: o app que os clientes do escritório usam, incluído por padrão, numa moldura de aparelho de 390 px com o painel "Chegou ao escritório" ao lado (wireframe). As telas do BPO no app são de S08 (S08-T10). Fontes: 06 inteiro e adendos; 04, 11; 02, 10.1 (Consultor da empresa); 09, 10.8; D-16, D-17, D-28; C2-02, C2-10, C2-14.

**Regras do app (valem em todas as telas).** Entrada sem senha, por código no WhatsApp ou e-mail cadastrado na ficha; contato fora da ficha é barrado ("peça o convite"); sessão longa, sem espera por inatividade; uma pessoa, várias empresas, seletor no topo sem "Todos"; papel e áreas **por serviço contratado**, somados (sócio vê tudo; financeiro guias, documentos e honorários; RH só folha; contador interno tudo menos financeiro); aba sem área some; nunca aparecem notas internas, cartões internos, transcrições, etiquetas, SLA, responsável e checklist; ação do cliente cabe em um toque; edição de dado da empresa vira pedido; o integrante assina como assistente (06, 1.3 e 2; 04, 11).

### S10-T01 · Entrada, primeiro acesso e empresa

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A01 | Abrir convite | Link de 7 dias no domínio do app (tema do escritório antes do login) | contato convidado | 06, 2.1 |
| S10-A02 | Confirmar identidade | Código de 6 dígitos (10 min, 5 tentativas) no canal cadastrado (API-27) | idem | 06, 2.2 |
| S10-A03 | Aceitar termo de uso | Modelo do tema; registrado em Termos | idem | 06, 2.1 |
| S10-A04 | Escolher forma de entrar | Código (padrão), senha opcional, biometria do aparelho oferecida uma vez | idem | 06, 2.2 |
| S10-A05 | Entrar de novo | Código; contato fora da ficha barrado | cliente | 06, ad. 18 |
| S10-A06 | Trocar de empresa | Seletor; Início mostra "outras empresas: 2 pendências" | cliente com várias | 06, 2.3 |
| S10-A07 | Ver visão do grupo | Linha que soma pendências e vencimentos do grupo econômico | idem | 06, 2.3 |
| S10-A08 | Instalar | Android: aviso ou botão; iOS: passo a passo "Compartilhar › Adicionar à Tela de Início"; até instalar, avisos por WhatsApp ou e-mail | cliente | 06, 3.11 |
| S10-A09 | Permitir push | Pedido após um toque da pessoa | cliente | 06, 3.11 |

- **Protótipo tem:** entrada por código, barragem de quem não está na ficha, seletor de empresa (`cliente/ClienteApp.tsx`, `LoginApp`). **Falta:** abrir convite e aceitar termo, escolher forma de entrar, visão do grupo, passo a passo de instalação, push.

### S10-T02 · Início

| Bloco | O que mostra |
| --- | --- |
| O escritório precisa de você | Pendências com envio em um toque |
| Próximos vencimentos | Guias com "guia" e "pago"; honorários |
| Chegou para você | Documentos novos desde o último acesso |
| Avisos do escritório | Comunicados para quem tem o assunto |
| Pedidos em andamento e resposta nova | Atalhos |
| Implantação | "Implantação: 6 de 9 itens enviados" |
| Pagamentos para aprovar | Só com alçada (S08) |
| Tudo em dia | Início vazio com o texto do tema |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A10 | Enviar pendência daqui | Igual a S10-A20 | cliente | 06, 3.2 |
| S10-A11 | Marcar guia como paga | "Pago" grava `confirmado_pelo_cliente` e pausa a régua da guia, sem substituir a conciliação | sócio, financeiro | 06, 3.2 |
| S10-A12 | Abrir documento novo | Visualizador; registra visto | cliente | 06, 3.3 |
| S10-A13 | Abrir pedido ou conversa | Navega | cliente | 06, 3.2 |

- **Protótipo tem:** `Inicio` em `cliente/ClienteApp.tsx`. **Falta:** faixa de implantação, avisos do escritório por assunto, "tudo em dia" do tema, "pago" que muda a guia no Painel (limitação anotada).

### S10-T03 · Documentos

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A14 | Filtrar por tipo e setor | Todos, Guias, Notas, Folha, Relatórios, Permanentes | cliente (pelas áreas) | 06, 3.3 |
| S10-A15 | Buscar | Nome, número da nota, tributo, valor | cliente | 06, 3.3 |
| S10-A16 | Abrir e baixar | Visto e baixado com hash; estados novo, visto, baixado; o escritório vê o mesmo | cliente | 06, 5.2 |
| S10-A17 | Enviar para meu e-mail ou WhatsApp | Registra `enviado_*` | cliente | 06, 3.3 |
| S10-A18 | Compartilhar com terceiro | Link com validade (7 a 30 dias), senha opcional; acessos registrados; ver e revogar links ativos; holerite nunca | cliente | 06, 5.4 |
| S10-A19 | Baixar o mês | Zip com manifesto (lista e hashes) | cliente | 06, 3.3 |

- **Regra:** documento assinado pelo contador chega só depois da conferência da assinatura (D-16); farol de abertura com reenvio por outro canal preparado no escritório (D-17).
- **Protótipo tem:** lista por competência, abrir e baixar com registro (`Documentos`). **Falta:** busca por metadados, enviar para mim, compartilhar com terceiro, baixar o mês, "indisponível" com pedido.

### S10-T04 · Pendências

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A20 | Enviar documento | Arquivo ou foto com recorte; vários arquivos; vira Documento `upload_cliente_app`; o item fica "em conferência" e o integrante valida na hora | cliente | 06, 4.1 |
| S10-A21 | Preencher informação | Formulário tipado (variáveis da folha, férias, admissão) | cliente | 06, 4.1 |
| S10-A22 | Assinar ciência | "Li e estou ciente" com identidade, data, hora, hash e IP | cliente | 06, 5.5 |
| S10-A23 | Ação externa com "já fiz" | Procuração, consentimento Open Finance, com passo a passo e vídeo do tema | cliente | 06, 4.1 e 6.4 |
| S10-A24 | "Não tenho isso" | Justificativa volta ao escritório na conversa da tarefa | cliente | 06, 4.1 |
| S10-A25 | Ver recibo de envio | Protocolo (número, data e hora, hash, arquivo, quem enviou) e PDF | cliente | 06, 4.1 |
| S10-A26 | Ver item devolvido | "O extrato é de setembro; precisamos de outubro" | cliente | 06, 4.1 |
| S10-A27 | Competência completa | "Outubro completo" | cliente | 06, 4.1 |

- **Protótipo tem:** envio que vira mensagem no CRM, tarefa que volta a andar e aviso ao responsável (`Pendencias`). **Falta:** foto com recorte, formulário tipado, assinar ciência, ação externa com "já fiz", "não tenho isso", recibo de envio, devolução com motivo, competência completa.

### S10-T05 · Pedidos

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A28 | Novo pedido | Tipos limitados ao papel: admissão, férias, rescisão, **simulado de rescisão** (C2-02), variáveis, certidão, documento vigente, nota fiscal (sem emissor), recálculo de guia, alteração da empresa, **declaração de faturamento** (C2-14), dúvida, 2ª via ou contestação, outro | cliente | 06, 4.3 |
| S10-A29 | Acompanhar status | Em andamento, aguardando você (com a lista), aguardando órgão ou banco, em conferência, concluído com o resultado, cancelado com o motivo | cliente | 06, 4.3 |
| S10-A30 | Autorizar serviço avulso | "Serviço avulso: R$ X" com autorizar (registrado, vira cobrança) | sócio | 06, 4.3 |
| S10-A31 | Cancelar pedido | Enquanto ninguém iniciou | cliente | 06, 4.3 |
| S10-A32 | Conversar no pedido | Conversa ligada no setor | cliente | 06, 4.3 |

- **Protótipo tem:** pedidos que viram tarefa com origem marcada e aviso (`Pedidos`). **Falta:** simulado de rescisão, declaração de faturamento, serviço avulso com autorizar, cancelar, conversa do pedido, status completo.

### S10-T06 · Conversa

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A33 | Escolher fio | Um por setor exibido; "Falar com o escritório" no Gestão e Atendimento | cliente | 06, 7.1 |
| S10-A34 | Escrever, anexar, gravar áudio | Mesmo fio do WhatsApp e do e-mail; anexo baixa pendência se casar | cliente | 06, 7.4 |
| S10-A35 | Confirmar pedido implícito | Cartão "abrir pedido de admissão com estes dados?" | cliente | 06, 7.3 |
| S10-A36 | Ver status simplificado | Recebido, em atendimento, aguardando você, em andamento, resolvido | cliente | 04, 11 |
| S10-A37 | Avaliar atendimento | Uma pergunta de um toque ao resolver | cliente | 06, 7.4 |

- **Protótipo tem:** conversa por setor que grava no CRM (`Conversa`). **Falta:** pedido implícito como cartão, status simplificado, áudio, avaliação.

### S10-T07 · Agenda

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A38 | Marcar reunião | Horários livres do responsável (calendário conectado, API-23, ou janelas fixas); tipo, duração, canal; vira tarefa GES-045 com pauta preparada pelo integrante | cliente | 06, 3.7 |
| S10-A39 | Remarcar e cancelar | Até o limite (4 h antes) | cliente | 06, 3.7 |
| S10-A40 | Ver agenda tributária | Vencimentos no calendário do celular (serviço extra) | cliente | 06, 8 |

- **Protótipo tem:** `Agenda`. **Falta:** pauta preparada, remarcar e cancelar com limite.

### S10-T08 · Financeiro com o escritório

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A41 | Ver contrato | Serviços, valor, vencimento, próximo reajuste; sem margem, horas ou custo | sócio, financeiro | 09, 10.8 |
| S10-A42 | Ver faturas | Status sem a palavra "inadimplente"; uma fatura com serviços em linhas e uma NFS-e por serviço | idem | 06, ad. 21 |
| S10-A43 | Pagar | Boleto, Pix copia e cola, 2ª via com juros e multa, "pago" | idem | 09, 10.8 |
| S10-A44 | Autorizar Pix Automático | Ver e cancelar | idem | 09, 10.8 |
| S10-A45 | Contestar fatura | Vira tarefa do Financeiro e pausa a régua | idem | 06, 3.8 |
| S10-A46 | Ver informe anual | Pagamentos e retenções | idem | GES-008 |
| S10-A47 | Ver pausa parcial | Faixa do que está em espera e do que segue | idem | 09, 10.8 |

- **Protótipo tem:** faturas com linhas e NFS-e por serviço, contestação que pausa a régua (`Financeiro`). **Falta:** Pix Automático, informe anual, faixa de pausa parcial.

### S10-T09 · Empresa

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A48 | Ver perfil vigente | Só leitura; "pedir alteração" vira pedido SOC-002 | sócio | 06, 3.9 |
| S10-A49 | Pessoas e papéis | "Esta pessoa saiu" vira tarefa GES-041; convites pendentes com reenviar; revisão anual ("estas pessoas ainda trabalham com vocês?") | sócio | 06, 2.5 |
| S10-A50 | Enviar certificado A1 | Motivo em linguagem simples; termo (captura, consultas, transmissão); arquivo e senha direto ao cofre; validação na hora (senha incorreta, outra empresa, vence em 3 dias) | sócio ou área certificado | 06, 6.2 |
| S10-A51 | Ver uso e revogar certificado | "Usado 14 vezes em novembro"; alterar o termo gera versão; revogar avisa o escritório | idem | 06, 6.2 |
| S10-A52 | Ver procurações | Matriz "o que o escritório pode fazer por você em cada órgão", com validade | sócio | 06, 6.4 |
| S10-A53 | Ver termos e recibos | Termos aceitos com data, versão e texto; recibos de envio | cliente | 06, 3.9 |
| S10-A54 | Ver acessos | Sessões com aparelho e último uso; sair de todos; chaves de acesso | cliente | 06, 2.2 e 12.4 |
| S10-A55 | Preferências de aviso | Canais por categoria, silêncio, resumo diário | cliente | 06, 10 |

- **Protótipo tem:** pessoas com acesso, certificado com termo, procurações (`Empresa`). **Falta:** pedir alteração, revisão anual, uso e revogação do certificado, termos e recibos, acessos, preferências de aviso.

### S10-T10 · Serviços extras e Consultor da empresa

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A56 | Ver serviços | Ativo, disponível (descrição, preço se o escritório quiser), oculto não aparece | cliente | 06, 3.10 |
| S10-A57 | "Tenho interesse" | Vira GES-002, mensagem no Atendimento e aviso | cliente | 06, ad. 18 |
| S10-A58 | Emitir NFS-e | Tributação travada; tomador, valor, descrição; conferência antes; cancelar com motivo; substituir (API-11) | cliente com o serviço | 06, 8 |
| S10-A59 | Perguntar ao Consultor da empresa | Factual direto com a origem ("da guia emitida em 2/11"); opinião vira CON-001 ao contador; limite do mês | idem | 06, 9 |
| S10-A60 | Usar certidões, painel do sócio, simulador de folha, IRPF, recálculo, agenda tributária, licitação, compra do A1, simulador da reforma, conciliação, cobrança dos clientes, relatório anual, conta digital | Cada serviço ativo tem tela própria | idem | 06, 8 |
| S10-A61 | Ver passo a passo do escritório | Biblioteca de tutoriais publicada pelo escritório (C2-10, ideia) | cliente | C2-10 |
| S10-A62 | Painel da empresa por pedido | "Como está minha empresa?" vira link com caixas (D-28, depois) | sócio | D-28 |

- **Protótipo tem:** catálogo com estado por cliente e todas as telas dos serviços ativos (`cliente/servicos.tsx`, `dados/servicos-extras.ts`). **Falta:** substituir NFS-e, biblioteca de passo a passo (C2-10), painel por pedido (D-28).

### S10-T11 · Avisos do app e saída do escritório

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S10-A63 | Abrir central (sino do app) | Lido e não lido, filtro por categoria, "silenciar esta competência" | cliente | 06, 10 |
| S10-A64 | Receber push agrupado | "8 holerites de outubro"; urgente fura silêncio | cliente | 06, 10 |
| S10-A65 | Modo leitura após saída | Data de encerramento; exportação do que é dele | cliente | 06, ad. 18 |

- **Protótipo tem:** painel "Chegou ao escritório" com os eventos (`cliente/MolduraCliente.tsx`). **Falta:** central de avisos do app, push agrupado, modo leitura.

- **Entidades (S10):** Conta de cliente, Convite, Pessoa, Identidade, Documento, Registro de entrega, Tarefa (pendência e pedido), Conversa, Mensagem, Credencial, Notificação, Preferência, Integrante (Consultor da empresa), Cobrança, Parcela, Nota de serviço do escritório. **APIs simuladas:** API-01, API-02, API-11, API-13, API-19, API-20, API-23, API-27, API-29.

## S11 · Pacote Jurídico (sessão posterior)

Escopo: as telas do pacote Jurídico (JU-02) e as dos subplanos JU-06 a JU-12: item lateral Jurídico com as sete abas do escritório pequeno, ficha do processo, integrantes jurídicos, captação com conflito de interesses, app do cliente jurídico, peças e assinatura, mandatos, agenda com audiências, perícias, diligências e correspondentes, segurança e LGPD, migração e implantação, configurador de preço. Roda depois das sessões S01 a S10, sobre a plataforma pronta. Nada é construído antes do BPO no plano (01, ad. 28); no wireframe, entra como sessão própria. Fontes: JU-01 a JU-12 e "Decisões do usuário (9/11/2026)" ao fim de cada um; 00, 13 e 14; `pesquisa/atividades-juridico.json` (234 atividades: 48 faz sozinho, 159 prepara, 27 organiza e lembra).

**Regras unificadas do pacote (valem em toda tela; JU-02, Decisões).** Caso restrito: o sócio pede acesso com motivo, fica registrado e os membros são avisados. Só advogado inscrito confirma prazo fatal e dá ciência; segunda conferência do fatal por recontagem independente, confirmação do advogado e segundo aviso no dia seguinte. Margem interna por tipo de peça (5 dias úteis em recurso e contestação; 2 em manifestação simples; D-2 útil no resto; ajustável de D0 a D-5). Domicílio Judicial: ciência nunca delegável; listar nunca dá ciência. Avisos com datas diferentes: vale a mais cedo, com pergunta. O motor mostra a origem do número ("lido no texto" ou "sugerido"), não porcentagem. Gestão sem Painel mora dentro do Jurídico. Antes de casos reais: parecer e modo sombra.

**Papéis no pacote.** Administrador (sócio), Gestor, Membro advogado (inscrito na OAB), Membro apoio (estagiário, secretária); "só pessoa" vale só para advogado inscrito; correspondente externo acessa só a página da ordem por link (JU-02, 4; JU-09, 6.7).

**Integrantes (JU-06, 2.1).** Controladoria de prazos (captura, vincula, propõe e conta prazo, vigia a própria captura, dupla checagem); Contencioso (redator de peças; prepara audiência); Consultor jurídico (pesquisa com vigência, citação conferida, abstenção); Consultivo e Contratos; integrantes de área (trabalhista, família, previdenciário, penal, tributário, com o módulo ativo); Atendimento (andamento em linguagem simples); Secretaria e Audiências (proposta); Financeiro de honorários; Geral (contexto: cliente ou Processo). **Nunca sozinhos:** dar ciência no Domicílio ou abrir citação, confirmar prazo fatal, assinar ou protocolar, enviar peça sem revisão registrada, aceitar acordo ou estimar êxito ao cliente, repassar valor de alvará, liberar processo em conflito, alimentar cache global com dado de caso (JU-02, 5.2). Modo sombra na primeira semana (JU-06, 5.5).

### S11-T01 · Item Jurídico e navegação

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A01 | Ver o item Jurídico | Depois do Início (só jurídico) ou depois do Painel (Contábil + Jurídico); Clientes aparece sem Painel, com a seção Jurídico na ficha | quem tem o pacote e o setor | JU-02, 2.1 |
| S11-A02 | Seletor de cliente | Lista só clientes com serviço jurídico; **Todos é o modo normal**; Prazos e Intimações abrem em Todos | idem | JU-02, 2.1 |
| S11-A03 | Contexto do processo | O chat e as tarefas podem ter o processo aberto como contexto | idem | JU-02, 2.1 |
| S11-A04 | Perfis (preset de abas) | Pequeno (sete abas); médio com Audiências e correspondentes; departamento jurídico só no plano | Administrador | JU-02, 2.3 |
| S11-A05 | Gestão sem Painel | Oitava aba dentro do Jurídico (equipe, permissões, governança da IA, compliance) | Administrador, Gestor | JU-02, 2.2 |

### S11-T02 · Jurídico › Hoje (Home do advogado)

**Objetivo.** "O que preciso saber hoje?" em cinco segundos; os mesmos widgets entram na galeria da Visão geral (JU-02, 3.2).

| Widget | O que mostra |
| --- | --- |
| Saúde da captura | DJEN por inscrição (lido há N h), Domicílio por empresa (citação não aberta), painéis em modo assistido, calendário forense, intimações sem tratamento (mais antiga em dias úteis), sem ciência; semáforo com cor, rótulo e motivo; nunca "zero" sem a idade da leitura |
| Prazos hoje e semana | Fatais sobem; internos abaixo; "a conferir" |
| Audiências 7 dias | Com link e preparo (roteiro, preposto) |
| Cartões do time | Fiz, decisão (confirmar prazos) |
| Minhas tarefas, novos processos | "2 sem caso: incluir o meu" |
| Ausências | Quem está fora e o que ficou sem dono |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A06 | Abrir prazo, intimação ou audiência | Vai à aba | todos | JU-02, 3.2 |
| S11-A07 | Decidir cartão | Confirmar prazos propostos (só advogado) | advogado | JU-02, 3.2 |
| S11-A08 | Ver por papel | Membro: os próprios; Gestor: carga e sem dono; Administrador: quase perdidos, conflitos esperando, ausências | conforme | JU-02, 3.2 |

### S11-T03 · Jurídico › Processos e ficha do processo

| Bloco da ficha | O que mostra | Ações (nível) |
| --- | --- | --- |
| Cabeçalho (fixo) | CNJ, tribunal, grau, classe, valor, fase, polo, responsável, selos de sigilo e conflito, idade do acompanhamento | Editar com diff |
| Partes | Autor, réu, terceiros, advogado contrário, testemunhas (cadastro único) | Adicionar (conflito roda ao incluir) |
| Andamentos | Relevantes e burocráticos; "andamento chega semanas depois do diário" | Traduzir ao cliente (preparar); enviar (aprovação) |
| Prazos, audiências, comunicações, mandato, peças, documentos | Como nas abas | — |
| Conversas, tarefas | Fio do CRM em leitura; tarefas do processo | — |
| Honorários, horas | Leitura do Financeiro; horas (custo só Gestor) | Abrir no Financeiro; evento gerador de êxito (preparar) |
| Linha do tempo | Tudo com o ator | Filtrar |
| Como o cliente vê | Prévia do "Meu processo" | Liberar ou ocultar |

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A09 | Criar processo por CNJ ou publicação | Rascunho "revise e confirme"; confirmar como ativo | advogado, apoio | JU-02, 4.1 |
| S11-A10 | Importar carteira | Colar números CNJ; dígito validado; lote de 20; enriquecer pela fonte plugável (API-32); um Caso com um Processo em rascunho | Administrador | JU-11, 2.4 |
| S11-A11 | Monitorar por OAB ou CPF/CNPJ | Com aprovação e custo avisado | Administrador | JU-02, 4.1 |
| S11-A12 | Baixar autos, resumir, montar linha do tempo | Preparar | advogado | JUR-055, 056 |
| S11-A13 | Arquivar caso | Com prazo de guarda; aprovação | advogado | JUR-029 |
| S11-A14 | Filtrar | Cliente, caso, área, tribunal, responsável, fase, sem dono, parado além do normal; acervo do diário; duplicados | todos | JU-02, 4.1 |
| S11-A15 | Pedir acesso a Caso restrito | Motivo; registro; membros avisados | sócio | JU-02, Decisões |
| S11-A16 | Decidir conflito bloqueado | Liberar, liberar com ressalva e anexo, recusar (só o sócio) | sócio | JU-02, 3.1 |

- **Estados:** rascunho, ativo, suspenso, arquivado, sem número, fora da base pública, segredo de justiça, conflito bloqueado, sem dono ativo; encerrado só leitura.

### S11-T04 · Jurídico › Prazos e agenda

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A17 | Trocar visão | Fatais, Internos, Audiências, Todos, Sem dono, A conferir | todos | JU-02, 4.2 |
| S11-A18 | Ver a conta da data | Cadeia de contagem, norma, calendário; "por que a data andou" | todos | JU-02, 4.2 |
| S11-A19 | Propor prazo da intimação | Ato, dias ("lido no texto" ou "sugerido"), norma, termo inicial | integrante (preparar) | JU-02, 4.2 |
| S11-A20 | Confirmar prazo | Só advogado; data confirmada não muda sozinha | advogado | JU-02, 4.2 |
| S11-A21 | Pedir conferência a outro advogado | Segunda conferência do fatal | advogado | JU-02, Decisões |
| S11-A22 | Reprogramar data interna | Além da legal pede confirmação | advogado | JU-02, 4.2 |
| S11-A23 | Criar prazo avulso e tarefa da peça | Com data-base e checklist | advogado, apoio | JU-02, 4.2 |
| S11-A24 | Registrar protocolo com recibo | Protocolar é fora do sistema | advogado | JUR-047 |
| S11-A25 | Minutar devolução de prazo por justa causa | Preparar; envio só pessoa | advogado | JUR-052 |
| S11-A26 | Sincronizar agenda | Google e Outlook (API-23) | todos | JU-09, 2.4 |

- **Estados:** a confirmar, confirmado, a conferir, cumprido, vencido sem baixa (alerta ao sócio), sem dono; "não consegui ler" nunca vira "sem prazo"; calendário ausente avisa que a data pode estar mais cedo.

### S11-T05 · Jurídico › Intimações

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A27 | Ver caixa do DJEN por inscrição | Teor e partes (API-32) | todos | JU-02, 4.3 |
| S11-A28 | Ver caixa do Domicílio sem abrir | Por empresa cliente | todos | JU-02, 4.3 |
| S11-A29 | Vincular a processo e cliente; passar adiante | Com aviso | advogado, apoio | JUR-035 |
| S11-A30 | Classificar e propor prazo | Com o trecho | integrante (preparar) | JUR-036, 037 |
| S11-A31 | Dar ciência no Domicílio | Só advogado titular; cartão irreversível que expira | advogado | JU-02, 4.3 |
| S11-A32 | Três saídas | Virar prazo, arquivar por ciência, nada a fazer | advogado | JU-02, 4.3 |
| S11-A33 | Ver e corrigir saúde da captura | Religar credencial; confirmar inscrição na fonte; pedir recaptura | Administrador | JU-02, 4.3 |
| S11-A34 | Publicação em nome errado | Tratar | advogado | JUR-050 |

### S11-T06 · Jurídico › Peças e modelos

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A35 | Gerar peça a partir do Caso | Passos: pedir, pré-condições, variáveis sem IA ([preencher]), fatos com origem, minuta, números por cálculo, verificação de cada citação | advogado, apoio, integrante | JU-08, 3.1 |
| S11-A36 | Ver bloqueio por citação não verificada | Impede "revisada" | todos | JU-08, 3.4 |
| S11-A37 | Revisar e mudar estado | rascunho → em revisão → revisada → pronta para protocolo → protocolada → comprovada; devolvida; mudar o arquivo depois de revisada volta a "em revisão" | conforme | JU-08, 4.1 |
| S11-A38 | Checklist pré-protocolo | Citações, pedidos, anexos, assinatura, preparo | advogado | JUR-219 |
| S11-A39 | Liberar para protocolo | Aprovação do advogado revisor; dupla aprovação em peça fatal | advogado | JU-06, 7.2 |
| S11-A40 | Ver log de revisão e IA | Autor, integrante e modelo por versão | todos | JUR-234 |
| S11-A41 | Biblioteca de modelos e cláusulas | Três origens; blocos e variáveis; versões | Administrador, advogado | JU-08, 2 |
| S11-A42 | Revisar contrato em quatro lentes | Preparar | advogado | SG-038 |
| S11-A43 | Banco de teses | Reaproveitar | advogado | JUR-221 |

### S11-T07 · Jurídico › Mandatos

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A44 | Gerar procuração do cadastro | Preparar | advogado | JU-02, 4.5 |
| S11-A45 | Enviar para assinatura | ICP-Brasil, gov.br, avançada ou física (API-22); relatório de evidências | advogado | JU-08, 6 |
| S11-A46 | Substabelecer | Preparar; assinatura só pessoa | advogado | JU-08, 7.3 |
| S11-A47 | Conferir poderes e vigência | Vencimento e revogação com representação pelo prazo legal | advogado | JU-08, 7.4 |
| S11-A48 | Termo de ciência e consentimento de IA | Por cliente; sem termo, IA desligada no Caso | advogado | JUR-013 |

### S11-T08 · Jurídico › Controladoria

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A49 | Auditoria diária | Publicações sem tarefa, fatais sem dupla checagem | Administrador, Gestor | JUR-048 |
| S11-A50 | Calendário forense | Por tribunal e comarca, com fonte, data e tipo de efeito; confirmar datas móveis | Administrador | SG-008 |
| S11-A51 | Certificados e credenciais | Validade, segundo fator | Administrador | JUR-229 |
| S11-A52 | Cobertura de ausência | Redistribuir (com aprovação) | Gestor | FX-004 |
| S11-A53 | Regras do escritório | D0 a D-5, "final × fatal", quem confere no D-1; valem só para tarefas futuras | Administrador | FX-003 |
| S11-A54 | Metas (médio, depois) | Contagens, sem ranking | Gestor | SG-017 |

### S11-T09 · Agenda, audiências, perícias, diligências e correspondentes

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A55 | Ver agenda do escritório e do advogado | Prazo, audiência, perícia, diligência, reunião, compromisso externo ("ocupado"), ausência; conflito de agenda | todos | JU-09, 2 |
| S11-A56 | Audiência do aviso à ata | Preparação (roteiro, preposto, testemunhas), presencial, virtual ou híbrida, deslocamento e fuso, ata e desdobramentos | advogado | JU-09, 3 |
| S11-A57 | Perícia | Ciclo e prazos, assistente técnico, honorários periciais | advogado | JU-09, 4 |
| S11-A58 | Diligência | Tipos, campos e estados | advogado, apoio | JU-09, 5 |
| S11-A59 | Ordem ao correspondente | Escolha, briefing, substabelecimento, cartão (nunca promovido), página da ordem por link, aceite ou contraproposta, lembretes, relato, validação, avaliação e pagamento | advogado; sócio acima da alçada | JU-09, 6.4 |
| S11-A60 | Cadastro de correspondente | Comarcas, tipos, preço, avaliação | Gestor | JU-09, 6.3 |

### S11-T10 · CRM jurídico: captação, conflito e publicidade

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A61 | Funil jurídico | Primeiro contato, triagem, consulta, proposta, contratação, recusado ou encerrado | Gestão e Atendimento, advogado da área | JU-07, 3.1 |
| S11-A62 | Conflito rápido | Ao primeiro nome: sem coincidência, coincidência possível (sem dizer quem), homônimo | todos | JU-07, 4.2 |
| S11-A63 | Conflito completo e cartão de decisão | Antes da proposta e do contrato; só o sócio vê o detalhe | sócio | JU-07, 4.3 e 4.6 |
| S11-A64 | Abrir Caso em estudo | Com sigilo | advogado | JU-07, 3.3 |
| S11-A65 | Contratação em um ato | Três documentos assinados e conflito liberado | advogado | JU-07, 3.5 |
| S11-A66 | Travas de publicidade | Resposta só a quem escreveu; modelos aprovados; sem cláusula-isca | sistema | JU-07, 5 |
| S11-A67 | Indicação e parceria | Cadastro de parceiro com trava | Administrador | JU-07, 7 |
| S11-A68 | Retenção de quem consultou e não contratou | Prazo e descarte | sistema | JU-07, 6 |

### S11-T11 · App do cliente jurídico

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A69 | Ver "Meu processo" | Linha do tempo em linguagem simples: o que aconteceu, o que acontece agora, quando, o que precisa de você; só o liberado | cliente | JU-07, 10.5 |
| S11-A70 | Enviar documento por foto | Checklist por tipo de ação | cliente | JU-07, 10.6 |
| S11-A71 | Assinar procuração, contrato de honorários, termo de IA | Níveis do 06 | cliente | JU-07, 10.7 |
| S11-A72 | Pagar honorários | Contrato, parcelas, Pix e boleto, extrato da conta do cliente | cliente | JU-07, 10.8 |
| S11-A73 | Ver audiência e agendar reunião | Local, link, instruções | cliente | JU-07, 10.9 |
| S11-A74 | Empresa (PJ) | Representante legal, contato jurídico, financeiro, por Caso | cliente PJ | JU-07, 10.3 |

- **Nunca vê:** estratégia, minutas, risco e êxito, data interna e conta do prazo, horas e custo, conflito, trilha de IA, andamento não liberado (JU-02, 7).

### S11-T12 · Segurança, LGPD e sigilo

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A75 | Registrar pedido do titular | Entrada, identidade, classificação, varredura cega com cartão a cada advogado, rascunho de resposta, quatro saídas | encarregado, advogado | JU-10, 4.3 |
| S11-A76 | Ver ROPA e RIPD gerados | Pelo produto | Administrador | JU-10, 3.3 |
| S11-A77 | Registrar incidente | Detectar, conter, classificar, avisar com modelo, apoiar ANPD, aprender | Administrador | JU-10, 7.3 |
| S11-A78 | Ver trilha à prova de adulteração | Cadeia de hashes | Administrador | JU-10, 6.6 |
| S11-A79 | IA desligada por Caso | Sem termo ou com segredo de justiça | advogado | JU-06, 4.3 |

### S11-T13 · Migração, implantação e modo sombra

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A80 | Escolher trilha | Autoatendimento, assistida enxuta, completa | Administrador | JU-11, 3.1 |
| S11-A81 | Seguir os 30 dias | Dia 0 a dia 30 com marcos verificáveis; checklist na tela Hoje | Administrador | JU-11, 3.2 |
| S11-A82 | Ligar modo sombra | Alertas não reais; revisão na semana 4 | Administrador | JU-11, 3.3 |
| S11-A83 | Registrar a virada | Critério cumprido; o sistema antigo só se desliga depois | Administrador | JU-11, 3.3 |
| S11-A84 | Importar de sistema de origem | Astrea, ADVBOX, Projuris, planilha; mapa de campos; validação e reversão | Administrador | JU-11, 2 |

### S11-T14 · Configurador de preço do Jurídico

| ID | Ação | O que acontece no wireframe | Quem | Fonte |
| --- | --- | --- | --- | --- |
| S11-A85 | Montar o plano | Equação do JU-12 (usuários, processos monitorados, complementos, IA por usuário, app incluído) | Administrador | JU-12, 3 e 17 |
| S11-A86 | Ver custo de monitoramento antes de ligar | Custo por processo ativo avisado | Administrador | JU-11, 2.4 |

- **Protótipo tem (S11 inteiro):** nada.
- **Entidades:** Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato, Perícia, Diligência, Correspondente, Avaliação, Modelo de peça, Solicitação de titular (01, ad. 28; JU-08; JU-09; JU-10).
- **APIs simuladas:** API-32, API-22, API-23, API-01, API-03.

## Anexo A · Atividades do mapa por setor, subárea, autonomia e fase

Gerado de `docs/planos-dgm/pesquisa/atividades.json` (590 atividades). Formato de cada item: `ID·autonomia+fase` (S faz sozinho, P prepara e a pessoa conclui, O organiza e lembra; fase 0 a 5). Ex.: `FIS-009·P1` é "prepara, fase 1". A coluna "Sessão que desenha" diz onde a atividade vira tela; setores de perfil (pessoa física, terceiro setor, nichos) mudam o conteúdo das abas, sem aba própria (03, 3.5). As 234 atividades do Jurídico estão em `pesquisa/atividades-juridico.json` (S11).

| Setor do mapa | Total | S | P | O | Fase 0 | 1 | 2 | 3 | 4 | 5 | Sessão que desenha |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --- |
| Clientes e Societário | 57 | 11 | 32 | 14 | 14 | 16 | 20 | 2 | 1 | 4 | S02 |
| Fiscal e Obrigações | 61 | 22 | 36 | 3 | 1 | 47 | 4 | 0 | 8 | 1 | S02/S03 |
| Notas fiscais | 53 | 28 | 25 | 0 | 0 | 40 | 8 | 0 | 5 | 0 | S02 |
| Trabalhista e DP | 72 | 20 | 46 | 6 | 2 | 20 | 44 | 0 | 5 | 1 | S04 |
| Contábil | 65 | 24 | 35 | 6 | 2 | 30 | 20 | 1 | 12 | 0 | S03 |
| Consultoria e Reforma | 49 | 5 | 40 | 4 | 0 | 0 | 2 | 0 | 46 | 1 | S03 |
| Gestão e Atendimento | 95 | 34 | 39 | 22 | 9 | 4 | 35 | 38 | 6 | 3 | S04/S05 |
| Financeiro do escritório | 20 | 5 | 15 | 0 | 1 | 0 | 0 | 19 | 0 | 0 | S07 |
| Pessoa física | 27 | 6 | 18 | 3 | 2 | 5 | 10 | 0 | 7 | 3 | S03 (Fiscal PF) |
| Terceiro setor | 27 | 3 | 23 | 1 | 0 | 0 | 0 | 0 | 0 | 27 | S02-S04 (perfil) |
| Nichos (por CNAE) | 30 | 11 | 18 | 1 | 0 | 0 | 0 | 0 | 0 | 30 | S02-S04 (perfil) |
| Escritório para escritório (BPO) | 23 | 8 | 13 | 2 | 5 | 2 | 9 | 5 | 1 | 1 | S08 |
| Ciclo de vida (transversal) | 11 | 2 | 6 | 3 | 1 | 2 | 5 | 1 | 2 | 0 | S04 |
| **Total** | **590** | 179 | 346 | 65 | 37 | 166 | 157 | 66 | 93 | 71 | |

### Clientes e Societário

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Cadastro | SOC-001·S0 |
| Perfil temporal | SOC-002·S0 |
| Vigilância cadastral | SOC-003·S1 |
| Pessoas vinculadas | SOC-004·S0 |
| Inscrições | SOC-005·P1 |
| Cadastro RFB | SOC-006·P1 |
| Comunicações oficiais | SOC-007·S1 |
| Certificados | SOC-008·S0, SOC-009·S0, SOC-010·S0, SOC-201·O5 |
| Procurações | SOC-011·O0, SOC-012·S0, SOC-013·O0 |
| Acessos | SOC-014·O0 |
| Comercial | SOC-015·P0 |
| Contratos | SOC-016·P0, SOC-017·P3, SOC-018·P3, SOC-020·P0 |
| Compliance do escritório | SOC-019·P1 |
| Onboarding | SOC-021·O1, SOC-022·P1, SOC-023·P1 |
| Offboarding | SOC-024·O1 |
| Abertura | SOC-025·P2, SOC-026·P2, SOC-027·P2, SOC-028·P2 |
| Alteração | SOC-029·P2, SOC-033·P2 |
| Processos | SOC-030·P2 |
| Baixa | SOC-031·P2 |
| MEI | SOC-032·P2 |
| Documentos | SOC-034·S2 |
| Licenças | SOC-035·P2, SOC-036·O2, SOC-037·O2, SOC-038·O2, SOC-039·O5, SOC-040·O2 |
| Atas | SOC-041·P2, SOC-045·P5 |
| Livros | SOC-042·P2, SOC-043·P2 |
| Capital estrangeiro | SOC-044·P5 |
| Calendário | SOC-046·S1 |
| Clientes / Modelos e minutas | SOC-101·P0 |
| Clientes / Onboarding | SOC-102·P1, SOC-103·O1, SOC-104·P1 |
| Societário / Abertura | SOC-105·P2 |
| Clientes / Offboarding | SOC-106·O1, SOC-107·P1, SOC-108·P1 |
| Societário / Baixa | SOC-109·O2, SOC-110·P4 |

### Fiscal e Obrigações

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Calendário de obrigações | FIS-001·S1, FIS-002·S1 |
| Controle de entregas | FIS-003·S1 |
| Conferência | FIS-004·P1 |
| e-CAC | FIS-005·S1, FIS-006·S1 |
| e-CAC (transversal: D1) | FIS-007·S0 |
| Simples Nacional | FIS-008·P1, FIS-009·P1, FIS-011·S1, FIS-013·P1 |
| Simples Nacional / Guias (transversal: FIS-031) | FIS-010·S1 |
| Simples Nacional (transversal: D4, D6) | FIS-012·S1 |
| Simples Nacional (transversal: D1, D6) | FIS-014·P4 |
| Simples Nacional · Reforma (transversal: D6) | FIS-015·P4 |
| MEI | FIS-016·S1, FIS-017·P1 |
| MEI (transversal: D1) | FIS-018·P1 |
| DCTFWeb | FIS-019·P1 |
| EFD-Reinf | FIS-020·P1 |
| Guias federais | FIS-021·P1 |
| Declarações federais | FIS-022·P1 |
| Controle de entregas (transversal: D5 para ECD/ECF) | FIS-023·P1 |
| Estadual | FIS-024·P1, FIS-027·S1 |
| Estadual / Guias | FIS-025·P1 |
| Estadual / DTE | FIS-026·S1 |
| Municipal | FIS-028·P1 |
| Municipal / DTE | FIS-029·S1 |
| Cadastro fiscal (transversal: D1) | FIS-030·S1 |
| Guias (transversal: D4, D5, D7) | FIS-031·S1 |
| Guias | FIS-032·S1, FIS-201·S2 |
| Comunicação (transversal: D7) | FIS-033·P2 |
| Parcelamentos | FIS-034·S1 |
| Parcelamentos (transversal: D6) | FIS-035·P4 |
| Certidões | FIS-036·S1, FIS-037·P1 |
| Malhas e intimações | FIS-038·P1, FIS-039·P1, FIS-040·P1 |
| Créditos (transversal: D6) | FIS-041·P4, FIS-043·P4 |
| Créditos | FIS-042·P4 |
| Atendimento (transversal: D7) | FIS-044·P2 |
| Reforma (transversal: D3, D6) | FIS-045·S1 |
| Pré-requisitos (transversal: D1) | FIS-046·S1 |
| Gestão (transversal: D7) | FIS-047·O1 |
| Fiscal / Entrada do cliente | FIS-101·P1 |
| Fiscal / Entrada · transição | FIS-102·O1, FIS-103·P1, FIS-104·P1, FIS-105·P1 |
| Fiscal / Entrada · regularização | FIS-106·P1 |
| Fiscal / Entrada · abertura e transição | FIS-107·O1 |
| Fiscal / Desligamento · saída para outro contador | FIS-108·P2 |
| Fiscal / Desligamento | FIS-109·S1 |
| Fiscal / Desligamento · baixa | FIS-110·P1, FIS-111·P5 |
| SPED | FIS-301·P4 |
| Estoque e ICMS | FIS-302·P4 |

### Notas fiscais

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Configuração | NFE-001·S1, NFE-002·P1, NFE-003·S1 |
| Captura de entradas | NFE-004·S1, NFE-006·S1 |
| Captura de saídas | NFE-005·S1, NFE-009·S1, NFE-503·S1, NFE-504·S1 |
| Captura de serviços | NFE-007·S1, NFE-008·P1, NFE-502·S1 |
| Eventos de transporte | NFE-010·S1, NFE-017·P1 |
| Captura | NFE-011·S1, NFE-012·S2, NFE-013·P1 |
| Manifestação | NFE-014·S1, NFE-015·P1 |
| Manifestação e risco | NFE-016·P1 |
| Eventos | NFE-018·S1, NFE-019·P2 |
| Completude | NFE-020·S1, NFE-021·S1 |
| Conferência | NFE-022·S1, NFE-029·S1 |
| Conferência tributária | NFE-023·P1, NFE-024·P1, NFE-025·P1, NFE-026·P1, NFE-027·P1, NFE-032·P4, NFE-301·P4, NFE-302·P2 |
| Risco | NFE-028·S1 |
| Reforma tributária | NFE-030·P4, NFE-031·P2 |
| Envio ao core | NFE-033·S1, NFE-034·P1, NFE-035·S1 |
| Guarda | NFE-036·S1 |
| Atendimento | NFE-037·S2, NFE-038·S2 |
| Emissão | NFE-039·P2 |
| Manutenção | NFE-040·P4 |
| Notas fiscais / Entrada e transição | NFE-101·S1, NFE-102·P4, NFE-103·P1 |
| Notas fiscais / Desligamento | NFE-104·P1, NFE-105·S1, NFE-106·P1 |
| Emissão pelo cliente | NFE-201·P2 |
| Captura estadual por procuração | NFE-501·S1 |

### Trabalhista e DP

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Admissão | DP-001·S2, DP-002·S2, DP-005·P2, DP-007·S2 |
| Admissão · SST | DP-003·O2 |
| Admissão · eSocial | DP-004·S2, DP-006·S2 |
| Admissão · Benefícios | DP-008·P2 |
| Fechamento da folha | DP-009·S1, DP-011·P1, DP-012·P2 |
| Fechamento da folha · Ponto | DP-010·P1 |
| Fechamento da folha · Consignado | DP-013·P1 |
| Parâmetros | DP-014·S1 |
| Pró-labore (transversal: D2, D5) | DP-015·P1 |
| eSocial | DP-016·P1, DP-038·S1, DP-039·S1 |
| DCTFWeb (transversal: D2) | DP-017·P1 |
| FGTS Digital | DP-018·P1 |
| Holerites | DP-019·S2 |
| Guias (transversal: D2, D5, D7) | DP-020·S2 |
| Guias (transversal: D2) | DP-021·S2 |
| Pagamento | DP-022·P2 |
| Férias | DP-023·S1, DP-024·P2, DP-025·P2 |
| Rescisão | DP-026·P2, DP-027·S2, DP-030·P2, DP-031·P2, DP-032·P2 |
| Rescisão · SST | DP-028·O2 |
| Rescisão · eSocial · FGTS Digital | DP-029·P2 |
| Convenções | DP-033·P1, DP-034·S1, DP-035·P4, DP-036·P4, DP-201·P2 |
| Convenções · Jornada | DP-037·P4 |
| DET | DP-040·S1 |
| Fiscalização | DP-041·O2 |
| Acessos (transversal: D1) | DP-042·P0 |
| Atualização | DP-043·S1 |
| Reclamatórias | DP-044·P2, DP-061·P2 |
| Ponto | DP-045·P1 |
| Afastamentos | DP-046·P2, DP-047·P2 |
| Afastamentos · SST | DP-048·P2 |
| SST | DP-049·S2, DP-050·O2 |
| Benefícios | DP-051·P2, DP-052·P2 |
| 13º salário | DP-053·P2 |
| Anuais | DP-054·P2, DP-057·P1 |
| Igualdade salarial | DP-055·P2 |
| Cotas | DP-056·S1 |
| Atendimento (transversal: D7) | DP-058·P4 |
| Consultoria | DP-059·P4 |
| Arquivo | DP-060·S2 |
| Doméstico e MEI | DP-062·P5 |
| Entrada do cliente | DP-101·O0, DP-102·P1 |
| Entrada do cliente · Transição | DP-103·P2, DP-104·P2 |
| Entrada do cliente · Abertura de empresa | DP-105·P2 |
| Desligamento do cliente · Saída para outro contador | DP-106·P2 |
| Desligamento do cliente | DP-107·P2 |
| Desligamento do cliente · Baixa | DP-108·P2 |
| Desligamento do cliente · Arquivo e LGPD | DP-109·O2 |

### Contábil

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Coleta de documentos | CTB-001·P0, CTB-002·S1, CTB-003·S1, CTB-004·S1, CTB-005·S1, CTB-006·P2, CTB-007·S1, CTB-201·S2 |
| Extratos | CTB-008·S1, CTB-009·S1, CTB-010·O0, CTB-011·S1, CTB-014·P2 |
| Cartões | CTB-012·P2 |
| Adquirentes | CTB-013·S1 |
| Classificação | CTB-015·S1, CTB-016·P1 |
| Integração com o core | CTB-017·S1 |
| Conciliação | CTB-018·P1, CTB-019·S1, CTB-020·S1, CTB-021·P2, CTB-022·S1 |
| Reforma tributária | CTB-023·P4 |
| Fechamento | CTB-024·O1, CTB-025·P1, CTB-026·S1, CTB-027·P2 |
| Relatórios gerenciais | CTB-028·P2, CTB-029·P4, CTB-030·S4, CTB-031·P2 |
| Declarações do profissional | CTB-032·P2 |
| Distribuição de lucros | CTB-033·P4, CTB-034·P4, CTB-035·P4, CTB-036·S4, CTB-037·P2, CTB-038·P4 |
| Encerramento anual | CTB-039·S2, CTB-040·O1, CTB-044·P2, CTB-045·P4 |
| ECD | CTB-041·P1, CTB-043·P2 |
| ECF | CTB-042·P1 |
| Inventário | CTB-046·P1 |
| Imobilizado | CTB-047·S1, CTB-048·O4 |
| Conformidade do profissional | CTB-049·O1 |
| Guarda | CTB-050·S2 |
| Conformidade | CTB-051·P2 |
| Escrituração simplificada | CTB-052·S1 |
| Contábil / Entrada (proposta) | CTB-101·P3 |
| Contábil / Entrada (transição) | CTB-102·S1, CTB-103·P1, CTB-104·P1 |
| Contábil / Entrada e Desligamento (transição) | CTB-105·O2 |
| Contábil / Entrada (diagnóstico) | CTB-106·P4 |
| Contábil / Entrada (regularização) | CTB-107·P4 |
| Contábil / Entrada (abertura) | CTB-108·P1 |
| Contábil / Desligamento (saída para outro contador) | CTB-109·P2 |
| Contábil / Desligamento (baixa) | CTB-110·P2 |
| Contábil / Desligamento | CTB-111·S2 |
| Relatórios ao cliente | CTB-202·P2 |

### Consultoria e Reforma

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Atendimento técnico | CON-001·S2, CON-002·P2 |
| Pareceres | CON-003·P4, CON-006·P4 |
| Gestão do conhecimento | CON-004·S4, CON-005·P4, CON-038·P4 |
| Comercial | CON-007·P4 |
| Planejamento tributário | CON-008·P4, CON-009·P4, CON-010·S4, CON-011·P4, CON-014·P4, CON-303·P4 |
| Planejamento tributário (sócios) | CON-012·P4 |
| Inteligência tributária | CON-013·P4 |
| Reforma — diagnóstico | CON-015·S4 |
| Reforma — simulação | CON-016·P4 |
| Reforma — Simples | CON-017·P4 |
| Reforma — créditos | CON-018·P4 |
| Reforma — preço | CON-019·P4 |
| Reforma — cadastro | CON-020·P4 |
| Reforma — regimes específicos | CON-021·P4 |
| Reforma — IS | CON-022·P4 |
| Reforma — split payment | CON-023·P4 |
| Reforma — contratos | CON-024·P4 |
| Reforma — créditos de transição | CON-025·P4, CON-026·P4 |
| Reforma — transição 2029–2032 | CON-027·P4 |
| Reforma — parâmetros | CON-028·P4 |
| Reforma — pequenos | CON-029·P4 |
| Reforma — comunicação | CON-030·P4 |
| Reforma — prontidão | CON-031·O4 |
| Reforma — apuração | CON-032·P4 |
| Recuperação de créditos | CON-033·S4, CON-034·P4, CON-035·O4, CON-304·O4 |
| Recuperação de créditos (comercial) | CON-036·P4 |
| Gestão | CON-037·O4 |
| Consultoria / Entrada de cliente | CON-101·P4 |
| Consultoria / Entrada de cliente (transição) | CON-102·P4 |
| Consultoria / Entrada de cliente (abertura) | CON-103·P4 |
| Consultoria / Desligamento | CON-104·P4, CON-105·P4 |
| Consultoria / Desligamento (baixa) | CON-106·P4 |
| Comercial (pré-venda) | CON-301·P4 |
| Consultoria recorrente | CON-302·P4 |
| Consultoria financeira | CON-401·P5 |

### Gestão e Atendimento

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Faturamento de honorários | GES-001·S3, GES-002·P3, GES-009·S3 |
| Contas a receber | GES-003·S3 |
| Cobrança | GES-004·S3, GES-005·P3, GES-006·O3 |
| Fiscal do escritório | GES-007·S3, GES-008·P3 |
| Custos do escritório | GES-010·S3 |
| Indicadores | GES-011·S3 |
| Comercial | GES-012·P3 |
| Rentabilidade | GES-013·P3, GES-014·P3, GES-015·S3 |
| Produtividade | GES-016·S3 |
| Equipe | GES-017·P0, GES-018·O1, GES-022·O3 |
| Qualidade | GES-019·O3, GES-038·S2 |
| Conhecimento | GES-020·O2 |
| Segurança | GES-021·P0 |
| Caixa de entrada | GES-023·S2, GES-027·P2 |
| Filas e SLA | GES-024·S2 |
| Respostas | GES-025·S2 |
| Documentos | GES-026·S2 |
| Respostas técnicas | GES-028·P4 |
| Modelos | GES-029·P2 |
| Envio em massa | GES-030·P2 |
| Canal | GES-031·S2, GES-037·O2 |
| Canais | GES-032·P5, GES-033·O2 |
| Supervisão | GES-034·S2 |
| Horário | GES-035·S2 |
| Registro | GES-036·S2 |
| Portal do cliente | GES-039·S2, GES-040·S2, GES-041·P0 |
| Comercial (CRM) | GES-042·O3, GES-208·S5 |
| Retenção | GES-043·O3 |
| Relacionamento | GES-044·P2, GES-045·P4 |
| Offboarding | GES-046·P3 |
| Captura | GES-047·S0, GES-048·S2, GES-049·S3, GES-050·S3 |
| Revisão | GES-051·O3 |
| Trabalhista | GES-052·O3, GES-053·O2 |
| LGPD | GES-054·P0 |
| Custos | GES-055·P3 |
| IA | GES-056·S0 |
| Compliance do escritório | GES-057·O1, GES-058·S0, GES-059·O2, GES-060·O3, GES-061·O3 |
| Governança da IA | GES-062·O2, GES-301·S4 |
| Comercial (Entrada) | GES-101·O3, GES-207·S3 |
| Rentabilidade (Entrada) | GES-102·P3 |
| Faturamento de honorários (Entrada) | GES-103·P3 |
| Atendimento e app do cliente (Entrada) | GES-104·P2 |
| Relacionamento (Entrada) | GES-105·P2 |
| Relacionamento e rentabilidade (Entrada) | GES-106·O3 |
| Relacionamento e retenção (Desligamento) | GES-107·O3 |
| Atendimento e app do cliente (Desligamento) | GES-108·P2 |
| Faturamento de honorários (Desligamento) | GES-109·P3 |
| Qualidade do atendimento | GES-201·P4 |
| Registro e supervisão | GES-203·S2 |
| App do cliente | GES-204·P0 |
| Receitas de parceria | GES-205·O5 |
| Processos e tarefas | GES-206·P1 |
| Comercial e faturamento (Entrada) | GES-401·P3 |
| Precificação (Entrada) | GES-402·P4 |
| Equipe e capacidade | GES-403·S3 |
| Rentabilidade em tempo real | GES-404·S3 |
| Documentos e portal | GES-405·S2 |
| Coleta estruturada | GES-406·P2 |
| Governança da IA e automação | GES-407·P4 |
| Migração de ferramentas (Acessórias) | GES-601·P2 |
| Migração de ferramentas (Gestta/Domínio Processos) | GES-602·P2 |
| Migração de ferramentas (Onvio Portal do Cliente) | GES-603·P2 |
| Migração de ferramentas (SIEG) | GES-604·P2 |
| Migração de ferramentas (Qive) | GES-605·P2 |
| Migração de ferramentas (HubStrom) | GES-606·P2 |
| Migração de ferramentas (Nibo Obrigações) | GES-607·P2 |
| Migração de ferramentas (plano mestre) | GES-608·O0 |
| Integração com o core (outros cores) | GES-609·S1 |

### Financeiro do escritório

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Contratos e honorários recorrentes | FIN-001·P0 |
| Faturamento / reembolsos | FIN-002·S3 |
| Contas a pagar | FIN-003·P3 |
| Conciliação bancária | FIN-004·S3 |
| Fluxo de caixa e previsão de receita | FIN-005·S3 |
| DRE e centros de custo | FIN-006·P3 |
| Orçamento | FIN-007·P3 |
| Comissões e remuneração variável | FIN-008·P3 |
| Inadimplência / suspensão | FIN-009·P3 |
| App do cliente / autoatendimento financeiro | FIN-010·S3 |
| NFS-e do escritório / correções | FIN-011·P3 |
| Resultado dos sócios do escritório | FIN-012·P3 |
| Provedores de recebimento | FIN-013·P3 |
| Implantação do financeiro | FIN-014·P3 |
| Faturamento / 13º e rescisão | FIN-016·S3 |
| BPO financeiro | FIN-201·P3 |
| Migração de ferramentas (Conta Azul) | FIN-601·P3 |
| Migração de ferramentas (Omie e Nibo) | FIN-602·P3 |
| Migração de ferramentas (Conexa) | FIN-603·P3 |
| Provedores de recebimento (troca) | FIN-604·P3 |

### Pessoa física

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Pessoa física / Cadastro PF | PF-001·S0 |
| Pessoa física / Acessos PF | PF-002·O0 |
| Pessoa física / IRPF · Campanha | PF-003·S1 |
| Pessoa física / IRPF · Coleta | PF-004·S2 |
| Pessoa física / IRPF · Pré-preenchida | PF-005·S1 |
| Pessoa física / IRPF · Elaboração | PF-006·P2 |
| Pessoa física / IRPF · Revisão | PF-007·P2 |
| Pessoa física / IRPF · Entrega | PF-008·P2 |
| Pessoa física / IRPF · Pós-entrega | PF-009·S1 |
| Pessoa física / IRPF · Malha | PF-010·P2 |
| Pessoa física / IRPF · Retificação | PF-011·P2 |
| Pessoa física / IRPF · Revisão retroativa | PF-012·P4 |
| Pessoa física / Carnê-leão | PF-013·P1 |
| Pessoa física / Carnê-leão · Receita Saúde | PF-014·O1 |
| Pessoa física / Ganho de capital | PF-015·P2 |
| Pessoa física / Ganho de capital · Renda variável | PF-016·S2 |
| Pessoa física / Ganho de capital · Criptoativos | PF-017·P2 |
| Pessoa física / Exterior | PF-018·P4, PF-019·P4 |
| Pessoa física / Exterior · Residência | PF-020·P4 |
| Pessoa física / Exterior · Saída definitiva | PF-021·P4 |
| Pessoa física / Espólio e sucessão | PF-022·P2 |
| Pessoa física / Espólio e sucessão · ITCMD | PF-023·P4 |
| Pessoa física / Produtor rural PF | PF-024·P5, PF-025·P5 |
| Pessoa física / IRPFM | PF-026·P4 |
| Pessoa física / Empregador doméstico | PF-027·O5 |

### Terceiro setor

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Enquadramento | TS-001·P5 |
| Imunidade e isenção | TS-002·P5, TS-009·P5, TS-022·P5, TS-023·P5 |
| Estatuto e governança | TS-003·P5 |
| CEBAS | TS-004·P5 |
| Inscrições e títulos | TS-005·O5 |
| Contabilidade ITG 2002 | TS-006·P5, TS-007·P5 |
| Demonstrações | TS-008·P5 |
| Parcerias (MROSC) | TS-010·P5, TS-011·S5, TS-012·S5 |
| Obrigações acessórias | TS-013·P5 |
| Tributos da entidade | TS-014·P5, TS-015·P5 |
| Igrejas | TS-016·P5 |
| Igrejas e doações | TS-017·S5 |
| Doações incentivadas | TS-018·P5 |
| Imunidades municipais e estaduais | TS-019·P5 |
| Governança | TS-020·P5 |
| Reforma tributária | TS-021·P5 |
| Fundações | TS-024·P5 |
| Encerramento | TS-025·P5 |
| Entrada | TS-026·P5 |
| Organizações sociais | TS-027·P5 |

### Nichos (por CNAE)

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Transversal (nichos) | NIC-001·S5 |
| Construção civil | NIC-002·P5, NIC-003·P5, NIC-004·S5, NIC-005·P5, NIC-006·P5, NIC-007·S5, NIC-008·P5, NIC-009·P5, NIC-010·P5 |
| Saúde | NIC-011·P5, NIC-012·S5, NIC-013·O5, NIC-014·P5, NIC-015·S5 |
| E-commerce e marketplace | NIC-016·S5, NIC-017·S5, NIC-018·S5, NIC-019·S5, NIC-020·P5, NIC-021·P5, NIC-022·S5 |
| Agro | NIC-023·P5, NIC-024·S5, NIC-025·P5, NIC-026·P5, NIC-027·P5, NIC-028·P5, NIC-029·P5, NIC-030·P5 |

### Escritório para escritório (BPO)

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Fundação multi-inquilino | BPO-001·S0, BPO-002·P0 |
| Contrato entre escritórios | BPO-003·P0 |
| LGPD na cadeia | BPO-004·P0 |
| Responsabilidade técnica | BPO-005·P1 |
| Acessos e credenciais | BPO-006·O0 |
| Marca do contratante | BPO-007·S2, BPO-008·P2 |
| Fila de trabalho compartilhada | BPO-009·S2, BPO-010·S2 |
| SLA e medição | BPO-011·P2 |
| Reporte ao contratante | BPO-012·S3 |
| Auditoria de qualidade | BPO-013·P3 |
| Preço e faturamento entre escritórios | BPO-014·P3, BPO-015·S3 |
| Gestão do BPO | BPO-016·P3 |
| Entrada de um contratante | BPO-017·P4 |
| Execução no core | BPO-018·P1 |
| Saída de um contratante | BPO-019·P2 |
| Segurança e evidência | BPO-020·P2 |
| Conhecimento por contratante | BPO-021·S2 |
| Canal entre escritórios | BPO-022·S2 |
| Rede de parceiros | BPO-023·O5 |

### Ciclo de vida (transversal)

| Subárea | Atividades (ID·autonomia·fase) |
| --- | --- |
| Ciclo de vida (transversal) / Orquestração | CIC-001·S0 |
| Ciclo de vida (transversal) / Transição de entrada | CIC-002·P1 |
| Ciclo de vida (transversal) / Desligamento | CIC-003·P2 |
| Ciclo de vida (transversal) / Pessoa física | CIC-004·P2 |
| Ciclo de vida (transversal) / Entrada em lote | CIC-005·O4 |
| Ciclo de vida (transversal) / Eventos de exceção | CIC-006·O2, CIC-008·O4 |
| Ciclo de vida (transversal) / Pós-desligamento | CIC-007·P2 |
| Ciclo de vida (transversal) / Cadastro | CIC-009·P1 |
| Ciclo de vida (transversal) / Manutenção | CIC-010·P2 |
| Ciclo de vida (transversal) / Indicadores | CIC-011·S3 |

