# Subplano 08 · Conectores

**7/11/2026.** Desenho funcional e arquitetura lógica dos conectores, anterior à stack. Construído sobre o [Desenho do Sistema](../Desenho_do_Sistema.md) (1.4, 1.5, 1.6, 3.3, 4, 10), o [Plano da Plataforma](../Plano_Plataforma_do_Escritorio.md) (2, 3, 5), o [consolidado da descoberta](../../pesquisa/plataforma/90-consolidado.md) (5, 6, 7, 9), as verificações V1, V2 e V3, as pesquisas B1, B5, B6 e S3, as [Fundações](01-Fundacoes.md) (4.12, 5.6, 6, 7, adendos 13 a 18) e os subplanos 03 a 07. Preços e limites vêm das pesquisas de 06/11/2026; o que não está nelas vem marcado **[a confirmar]**. Os IDs são os do [catálogo de atividades](../../pesquisa/plataforma/atividades.json).

**Inventário atendido.** O catálogo tem 589 atividades; 358 nas fases 0 a 2. Por nível nessas fases: Próprio 132 · B 60 · A 51 · D-assistido 44 · A$ 30 · F 27 · C-cert 8 · D-humano 4 · C-crc 2 · C-captcha 0. Agrupadas pela integração que citam (uma ficha pode citar mais de uma): WhatsApp 57, Integra Contador 43, Alterdata 25, Domínio/Onvio 23, e-mail e calendário 22, assinatura 20, certidões e consultas por agregador 19, eSocial e EFD-Reinf 14, distribuição de DF-e 14, REDESIM e Juntas 14, Open Finance e OFX 12, FGTS Digital e DET 11, NFS-e Nacional 9, Contmatic 9, ERPs dos clientes 9, DTEs estaduais 8, integradores comerciais 8, nuvens 6, dados do CNPJ 6, web services estaduais 5, Questor e outros cores 5, Calculadora e BCB 3. Por credencial declarada: token de fornecedor 39, A1 do cliente 29, procuração ou Autorização de Acesso 26, login pessoal 22, e-CNPJ do escritório 17, consentimento Open Finance 9, nenhuma 32 (140 fichas não declaram credencial: são "Próprio" ou dependem de outra).

---

## 1. Escopo e princípios

### 1.1 O que é um conector

Um conector é o **adaptador entre uma fonte externa e as Fundações**: fora, fala o protocolo do órgão, do fornecedor ou da nuvem; dentro, existe só como **ferramentas tipadas** (Fundações 6) e **eventos** (Fundações 5). Nenhum módulo chama API externa diretamente; chama a ferramenta do conector, que tem contrato, nível, custo e evento como qualquer outra, pelas quatro portas (tela, chat, integrante, MCP interno). O conector não decide negócio: traz dados, normaliza para Documento, Evento, Tarefa do core ou Mensagem, e devolve. Quem classifica, cria tarefa e avisa é o integrante do setor (02) ou a regra do Painel (03).

### 1.2 Regras

| # | Regra | Consequência |
| --- | --- | --- |
| C1 | **Toda chamada externa gera evento** com `ferramenta`, `credencial_usada`, `custo` (centavos, quando pago) e `resultado`. | Auditoria responde "quem usou o certificado da Empresa X este mês" (Fundações 5.5); o app mostra o uso ao cliente (06, 6.2). |
| C2 | **Credencial só no cofre.** Nunca no banco da aplicação, na saída de ferramenta, no contexto de um modelo ou na tela. | O conector recebe uma `cofre_ref` opaca; só o processo do conector abre o segredo (seção 3). |
| C3 | **Idempotência e reexecução.** Captura é `por_chave` ou natural (Fundações 6.1); reentrega do mesmo `id_externo` não cria nada (5.3); qualquer execução repete do último cursor sem efeito colateral. | NSU, id de mensagem, id de tarefa, hash de arquivo são as chaves. |
| C4 | **Cada conector declara capacidades e níveis** (2.1). | O perfil de captura escolhe o caminho pela declaração, não por código espalhado. |
| C5 | **Falha nunca perde dado.** O que chegou é gravado antes de ser processado; o que falhou vai para fila com retentativa e, esgotada, para fila morta com aviso. | Seção 2.3. |
| C6 | **Conteúdo externo é dado** (Fundações R5). XML, PDF, mensagem de órgão, resposta do core, página de portal chegam com `origem_externa = true`. | Nenhum texto de fora vira instrução. |
| C7 | **Leitura que dá ciência é execução irreversível.** Abrir o detalhe da caixa postal federal, o teor de um DTE estadual ou do DET inicia prazo (consolidado 7.3, item 51). | `exige_aprovacao = sempre`, `irreversivel = true`; o conector lista, nunca abre sozinho. |
| C8 | **Preferir A, A$, B ou F a C.** Robô só sem API, com credencial legítima, humano no circuito e parecer (seção 8). | O que fica em C vai para D-assistido até haver motivo (consolidado §6). |
| C9 | **O caminho sem A1 do cliente vem primeiro** (Plano 2; B5). | Seções 5.5 e 9. |
| C10 | **Um escritório, uma conexão.** Credencial, cursor, fila e saúde por escritório (ou subinquilino); só o código do adaptador é compartilhado. | DA-01 vale para conectores. |

---

## 2. Anatomia de um conector

### 2.1 Contrato comum

Três entidades: **Conector** (catálogo global da plataforma), **Conexão** (um conector habilitado num escritório, com credencial e configuração) e **Execução** (uma rodada: gatilho, início, fim, resultado, itens lidos, novos, duplicados e falhos, custo em centavos, `evento_id`).

**Conector**

| Campo | Descrição |
| --- | --- |
| nome, familia | `integra_contador`, `dfe_distribuicao`, `adn_nfse`, `alterdata_eplugin`, `whatsapp_cloud`, `google_drive`; família governo_federal, estadual, municipal, core, mercado, armazenamento, robo |
| capacidades | Lista; cada uma com nome, nível (A, A$, B, F, C-cert, C-crc, C-captcha), `irreversivel`, `da_ciencia`, custo por chamada (classe e R$ de tabela), credencial exigida. Ex.: `caixa_postal.listar` (A$, Consulta R$ 0,24) e `caixa_postal.abrir` (A$, **dá ciência**) |
| credenciais_aceitas | Tipos do cofre (3.1) |
| perfil | nacional, por_uf, por_municipio, com a lista coberta (dado versionado, não código) |
| frequencia_padrao, limites | Cron ou "por evento"; taxa por chave, hora e dia; lote; janela de retroatividade; horário do órgão |
| modo_teste | sandbox, producao_restrita, credito_de_teste, nenhum |
| versao_adaptador, versao_api_externa | Ex.: NT 2014.002 v1.40; catálogo Integra 15/10/2026; eSocial v1.16 |
| webhook, risco_mudanca | Recebe notificações ou só consulta; baixo, médio, alto, com a data da última mudança |

**Conexão (por escritório)**

| Campo | Descrição |
| --- | --- |
| escritorio_id, subinquilino_id, conector | |
| credencial_ids | Referências ao cofre; uma conexão pode usar várias (e-CNPJ do escritório e os A1 dos clientes) |
| configuracao | Setor dono, pastas de destino, frequência, filtros por cliente, teto de custo mensal |
| situacao | nao_habilitada, aguardando_credencial, teste_pendente, ativa, pausada, erro_credencial, erro_fornecedor, desligada |
| cursor | Por cliente quando necessário: `ultNSU`, última mensagem, `dataFinal`, delta token da nuvem |
| saude | Última execução ok, última falha, falhas consecutivas, latência, itens e custo no mês |

### 2.2 Ciclo de vida

| Passo | Quem | Ferramenta | Efeito |
| --- | --- | --- | --- |
| Habilitar | Administrador | `conector.habilitar` | Conexão em `aguardando_credencial`; termo do fornecedor aceito e registrado |
| Vincular credencial | Administrador (e-CNPJ, token, OAuth); cliente pelo app (A1, 06 6.2) | `credencial.vincular` | O cofre valida (senha abre, titular confere, validade futura); evento |
| Testar | Administrador ou job | `conector.testar` | Chamada de prova barata (status, `distNSU` atual, `GET /empresas`); `teste_pendente` → `ativa` |
| Agendar | Job | `conector.agendar` | Respeita o mínimo do conector e o horário do órgão (SIDEB SP: dias úteis, 6h–21h) |
| Executar | Job, evento, pessoa | `conector.executar_agora` | Uma Execução; o botão "forçar captura" da aba Notas (03 6.3) |
| Pausar, desligar | Administrador; o sistema em erro de credencial | `conector.pausar` | Pausa mantém cursor; desligar mantém histórico |

Credencial vencida pausa só os clientes afetados: o A1 vencido de um cliente não para a captura dos outros.

### 2.3 Fila, retentativas e deduplicação

- **Duas filas por conexão**: itens a buscar (cursor por cliente) e itens a processar. O que chegou é gravado bruto antes de entrar na segunda fila; o processamento pode ser refeito.
- **Retentativa** com espera crescente (1 min, 5, 30, 2 h, 12 h) para erro transitório; respeita o bloqueio do órgão (o 656 da distribuição de DF-e bloqueia o CNPJ por 1 h e consultar antes zera a contagem: o conector espera o tempo inteiro). Erro de credencial não retenta: pausa o cliente e notifica.
- **Fila morta** depois das tentativas: aviso ao Administrador e ao Gestor do setor dono, item visível na tela de Conectores, botão "tentar de novo".
- **Deduplicação** por `(conexao, cliente, id_externo)`: NSU e chave de acesso (DF-e, ADN), id da mensagem (caixa postal, WhatsApp), id da tarefa no core, `id_externo_backend` (nuvem), SHA-256 (arquivo sem id). Duplicata é contada, não gravada.
- **Teto de custo** por conexão e mês (Integra, InfoSimples, WhatsApp): a 80%, aviso; a 100%, só execuções manuais ou aprovadas.

### 2.4 Observabilidade

| Visão | Quem | Conteúdo |
| --- | --- | --- |
| Cabeçalho de aba (03 6.3) | Setor | "captura ok ontem 03:12 · NSU 18.442" ou "parada há 2 dias: certificado vencido"; por cliente e em "Todos" |
| Configurações › Conectores | Administrador | Conexões, situação, última execução, falhas consecutivas, custo do mês contra o teto, credenciais e vencimentos, fila morta, botões testar, pausar, executar |
| Gestão › custo por cliente (GES-010) | Administrador, Gestor | Chamadas pagas por cliente e conector, base da precificação (13.2) |
| Painel global | Equipe da plataforma | Saúde por conector em todos os escritórios: erro, latência, versão, mudanças de API; é onde "o ADN caiu para todo mundo" aparece antes da reclamação |

Eventos: `conector.executar`, `.falhar`, `.pausar`, `.retomar`, `.custo.teto`, `.versao.mudar`. Três falhas consecutivas acordam o integrante de Gestão (gatilho no 02).

### 2.5 Versionamento quando o órgão muda

- O adaptador é versionado junto com a versão da API externa. Mudança **anunciada** (NT, catálogo trimestral do Integra, XSD do eSocial com data) entra como versão nova servida em paralelo até a data de corte; a Conexão migra sozinha, com `conector.versao.mudar`.
- Mudança **não anunciada** (resposta fora do esquema) é pega pela validação de saída da ferramenta (Fundações 6.1) e vira falha `esquema_externo`, sem retentativa, com alerta no painel global.
- Um **calendário de mudanças** por conector fica visível ao Administrador. Conhecidas hoje: XSD do eSocial em 23/11/2026, 14/12/2026 e 18/01/2027 (V1 I-05); conta do WhatsApp em BRL até 30/06/2027 (V3 I-05); catálogo do Integra a cada trimestre (V1 I-01).

---

## 3. Cofre de credenciais e certificados

### 3.1 O que o cofre guarda

A entidade Certificado das Fundações (4.12) passa a chamar-se **Credencial** e ganha tipos (ajuste A1):

| Tipo | Titular | Quem vincula | Segundo fator | Para que serve | Rotação e revogação |
| --- | --- | --- | --- | --- | --- |
| `ecnpj_escritorio` (A1; A3 só para assinar o termo do Integra) | Escritório | Administrador | Senha do arquivo | Integra (termo), autXML, web services RS e SC, eSocial e Reinf como procurador, ADN por procuração **[a confirmar]**, Emissor Nacional do escritório | Vencimento monitorado (SOC-009); troca cria credencial nova e religa conexões; a antiga fica `vencida` |
| `a1_cliente` | Cliente | O cliente pelo app, com termo (06 6.2) | Senha do arquivo | Distribuição de DF-e, ADN, SAE-NFC-e SP, DTEs por agregador, manifestação | Régua D-30/15/5; o cliente revoga pelo app; `servicos_autorizados`, `termo_versao` |
| `procuracao_rfb` (Autorização de Acesso) | Cliente → escritório | Escritório, após o aceite no Portal de Serviços; conferida pelo Integra-Procurações | — | Serviços do Integra, download do eSocial, Reinf, NFS-e | Prazo do outorgante; cancela se não aceita em 30 dias (V1 I-13); matriz em Empresa › Procurações (06 6.4) |
| `procuracao_estadual` | Cliente → escritório ou contador | Registro manual com comprovante | — | DEC SP, SIARE MG, Receita/PR, DTEC SC, DTE RS, e-CAC RS | Por UF; o desligamento revoga (03 8.3) |
| `token_api` | Escritório | Administrador | — | Alterdata ePlugin, Asaas ou Efí, InfoSimples, Pluggy, provedor de assinatura, Meta, Domínio (chave por empresa) | Rotação pelo Administrador; revogar pausa a conexão |
| `oauth` | Usuário ou escritório | O usuário (calendário, caixa pessoal) ou o Administrador (Drive, Graph, caixa de setor) | O do provedor | Google, Microsoft | Refresh token no cofre; revogação no provedor detectada no próximo uso |
| `chave_nuvem` | Escritório | Administrador | — | S3 compatível, WebDAV, SFTP | Rotação manual; teste de leitura e escrita ao vincular |
| `login_portal` | Pessoa (contador) | **Não guardado na v1** (P10) | TOTP ou SMS do dono | C-crc: DTE RS, REDESIM, e-Fisco PE, Receita/PR | A pessoa digita na hora, no cartão de execução |

### 3.2 Regras

1. **Bytes e senhas nunca passam pelo banco da aplicação.** App e tela enviam direto ao serviço do cofre (06 6.2); o banco guarda `cofre_ref`, titular, tipo, validade, serviços, termo e situação.
2. **Chave gerenciada** (KMS ou HSM **[a confirmar]**), uma por escritório, para que a saída de um escritório destrua as chaves dele sem tocar nos outros (06 12.6).
3. **Só o processo do conector abre o segredo**, em memória, pelo tempo da chamada. `credencial.obter` não existe; leituras devolvem titular, validade, serviços e uso.
4. **Cada uso gera evento** `credencial.usar` (conector, capacidade, cliente, resultado); alimenta `certificado.uso_listar` do app e a auditoria. Uso fora dos `servicos_autorizados` do termo é recusado pela função de autorização, não pelo conector.
5. **Compartilhamento com fornecedor é declarado.** Quando uma capacidade envia o segredo a terceiro (a InfoSimples recebe PKCS#12 e senha a cada chamada de DTE), a Credencial registra `compartilhada_com = [infosimples]` e o termo do cliente precisa ter "consultas por fornecedor" marcado (consolidado 5.3). Sem isso, o perfil de captura cai para D-assistido naquele cliente.
6. **Quem vincula**: Administrador para as do escritório; o cliente (área `certificado`) para o A1; o próprio usuário para `oauth` pessoal. Vínculo, rotação e revogação por integrante sempre com cartão.
7. **Revogação** pausa os clientes afetados em todas as conexões e avisa o setor com prioridade alta; o histórico de uso fica.
8. **O que a IA nunca vê**: o segredo, o caminho do cofre, a senha, o token. Vê o que a leitura devolve: "A1 da Empresa X, válido até 12/03/2027, serviços: captura e consultas, usado 14 vezes em novembro".
9. **Auditoria mensal automática**: credenciais sem uso há 90 dias, vencendo em 30, compartilhadas sem termo, tokens sem rotação há 12 meses; resumo ao Administrador.

---

## 4. Conectores de governo federal

Família `governo_federal`, perfil nacional. Credenciais e preços conferidos em fonte oficial em 06/11/2026 (V1), salvo marca.

### 4.1 Quadro

| Conector | Capacidades | Credencial | Custo | Nível | Atividades (fases 0–2) | Risco de mudança |
| --- | --- | --- | --- | --- | --- | --- |
| **Integra Contador** (SERPRO/RFB) | Simples (PGDAS-D, DAS, DEFIS, regime), MEI (PGMEI, CCMEI, DASN-SIMEI), DCTFWeb e MIT, Sicalc (DARF, CONSOLIDAR54), caixa postal e DTE, PAGTOWEB, SITFIS, parcelamentos SN e MEI, procurações (OBTERPROCURACAO41), PNRCONTADOR, e-Processo, eventos de atualização | e-CNPJ do contratante no contrato; termo de autorização XML assinado pelo escritório → token até a meia-noite do dia seguinte (cache 304); Autorização de Acesso de cada cliente | Consulta R$ 0,24→0,06; Emissão R$ 0,32→0,08; Declaração R$ 0,40→0,12; eventos de atualização grátis **[a confirmar]**; faixa mensal **[inferência]** | A$ | 43 fichas: FIS-005, FIS-006, FIS-008, FIS-009, FIS-010, FIS-016, FIS-017, FIS-019, FIS-021, FIS-031, FIS-032, FIS-034, FIS-038, FIS-039, FIS-040, SOC-012, SOC-032, DP-004, DP-017, DP-042, NFE-022, FIS-103, FIS-105, FIS-201 | Alto: catálogo trimestral (15/10/2026); documentação ainda cita "procuração eletrônica" |
| **e-CAC sem API** | PER/DCOMP, DIRBI, e-BEF, PGFN/Regularize, opção pelo Simples, Termo de Exclusão | Certificado + procuração | — | D-assistido | FIS-022, FIS-042, SOC-006, FIS-034, FIS-035 | Entrada futura no Integra (perguntar ao SERPRO) |
| **eSocial** | Envio de lote (50 eventos), consulta, identificadores, download de eventos | Envio: qualquer ICP; download: empregador ou procurador com perfil do grupo | Gratuito; download **10 acessos/dia por empregador**, janela de 31 dias, bloqueio nos dias 1 a 7 para identificadores | A | DP-038, DP-006, DP-102, DP-104, DP-105, DP-106, FIS-003, FIS-004 | Médio: XSD em 23/11/2026, 14/12/2026, 18/01/2027 |
| **EFD-Reinf** | Envio assíncrono, consulta de lote, recibo por evento (REST) | e-CNPJ do contribuinte ou procurador (matriz) | Gratuito; produção restrita com Swagger | A | FIS-020, FIS-003, FIS-103, FIS-106 | Médio: manual v2.8; só assíncrono desde v2.7 |
| **Distribuição de DF-e** (NF-e, CT-e) | `distNSU`, `consNSU`, `consChNFe`; eventos; resumos; manifestação | A1 do cliente (CNPJ base) para entradas; e-CNPJ do escritório para o que tiver o escritório no `autXML` | Gratuito | A; manifestação conclusiva com aprovação | NFE-004, NFE-006, NFE-001, NFE-003, NFE-010, NFE-014, NFE-015, NFE-016, NFE-101, NFE-105, NFE-106, NFE-002 | Médio: NT 2014.002 v1.40 (jul/2026); CNPJ alfanumérico |
| **NFS-e Nacional** (ADN e Sefin) | `GET /DFe/{NSU}`, eventos por chave, DANFSe, CNC, emissão por DPS, parametrização | A1 do cliente (mesmo CNPJ raiz); procuração RFB desde 01/11/2026 **[a confirmar na PoC]** | Gratuito; limite de requisições **[a confirmar]** | A | NFE-007, FIS-028, NFE-008, NFE-039, NFE-201, NFE-502 | Alto: produto novo; completude por capital não testada |
| **Simples e MEI** | Pelo Integra (acima) | Integra | Integra | A$ | FIS-009, FIS-010, FIS-016, FIS-017, FIS-040, FIS-105, FIS-110 | Opção e exclusão continuam por portal (D) |
| **CNPJ e cadastros** | Dados abertos (arquivo), Consulta CNPJ SERPRO (Básica, QSA, Empresa), Consulta CPF, BrasilAPI como reserva | Nenhuma; contrato SERPRO | Dados abertos grátis (endereço atual **[a confirmar]**); Consulta CNPJ R$ 0,6591 / 0,8683 / 1,1717; CPF R$ 0,6591 | A / A$ | SOC-001, SOC-002, SOC-003, SOC-004, FIS-030, CIC-009 | Médio: 404 no endereço antigo; CNPJ alfanumérico |
| **Certidões federais** | CND RFB/PGFN, CRF, CNDT; SITFIS explica a positiva | Nenhuma (CAPTCHA) | Agregador (5.4); SITFIS 2 × Emissão ≈ R$ 0,64 | B (reserva C-captcha) | FIS-036, FIS-037, SOC-034 | Baixo |
| **Calculadora de Tributos RFB** | Regime regular, split payment simplificado, Simples; offline em Docker/JAR no servidor da plataforma | Nenhuma | Gratuita; licença **[a confirmar]** | A | CON-016, FIS-045, CON-020, CON-302 | Alto: 1.6.2, base V0066 de 28/10/2026, muda sem aviso; o conector grava `versaoApp` e `versaoDb` em `versao_tabelas` (07 5.5) |
| **BCB SGS e PTAX** | Selic, IPCA, IGP-M, câmbio | Nenhuma | Gratuito | A | FIS-021, M3 | Baixo |
| **FGTS Digital e DET** | Sem API pública; SPE para procuração | e-CNPJ + perfil de procurador | — | D-assistido; DET "só listar" C-cert com aprovação | DP-018, DP-029, DP-044, DP-040, DP-041, DP-107 | API para "sistemas parceiros" citada em jul/2026: perguntar ao MTE |

### 4.2 Integra Contador: decisões de desenho

- **Contratação**: alvo é o modelo A (plataforma contratante única; termo de autorização por escritório; `contratante` = plataforma, `autorPedidoDados` = escritório, `contribuinte` = cliente); B (cada escritório contrata) como reserva no piloto; D (termo assinado pelo cliente com o A1 do cofre) é hipótese a levar ao SERPRO. Pergunta P1.
- **Token diário**: reenvio do termo às 00h05 (Brasília); token em memória do processo; termo de vigência longa pode ser assinado uma vez com A3 (cache 304).
- **Caixa postal**: `indicador` e `listar` (Consulta, sem ciência) rodam no job; `abrir` dá ciência (Decreto 70.235/1972, art. 23, § 2º, III) e é `exige_aprovacao = sempre`. A lista traz `dataCiencia` e `dataLeitura`; o Fiscal calcula a tácita (15 dias no DTE geral, 45 no DTE-SN, conflito aberto em 8.3 do consolidado). Pergunta P4.
- **Eventos de atualização** (grátis): lote de 1.000 contribuintes, 1.000 requisições/dia, resultado guardado 20 min, dados de 60 dias, procuração vigente até D-1. É a rotina diária; a lista paga roda semanalmente ou quando o indicador acusa mensagem nova. Pergunta P9.
- **Autorizações de Acesso** (SOC-011, SOC-012): o app pede ao cliente (06 6.4); o escritório valida no Portal de Serviços em até 30 dias (tarefa com lembrete); o conector confirma pelo Integra-Procurações e registra a `procuracao_rfb`.
- **Guia vencida pelo cliente** (FIS-201): Sicalc e DAS de cobrança, cobrados como Emissão, 1 por dia por cliente.

### 4.3 Distribuição de DF-e: regras que o conector aplica

| Regra (NT 2014.002 v1.40) | O que o conector faz |
| --- | --- |
| NSU só a partir do primeiro acesso, sem retroativo; 60 dias sem consulta interrompem | Liga a captura **no dia** em que o A1 chega (06 6.2; NFE-101); nunca deixa um cliente mais de 7 dias sem `distNSU` |
| Documentos por 90 dias | Acervo anterior só por `consChNFe` (20 por hora) ou upload; a trilha pede os XMLs ao contador anterior |
| 137 → esperar 1 h; 656 → bloqueio de 1 h | Cursor por cliente com `proxima_consulta_em`; nunca duas aplicações no mesmo CNPJ (o SIEG precisa ser desligado do CNPJ: GES-604) |
| Emitente não recebe as próprias notas | Saídas por autXML (e-CNPJ do escritório), web service estadual, e-mail (NFE-503); XML-semente (NFE-504) fora da v1 |
| Destinatário sem manifestação recebe só o resumo | `manifestacao.ciencia` automática para quem autorizou no termo (NFE-014); conclusivos só com cartão (NFE-015, NFE-016); prazo de 90 dias vira tarefa |
| Terceiro no autXML recebe a nota integral | Uma conexão do escritório para todos os clientes; o conector confere nota a nota se o CNPJ do escritório veio na tag e marca a cobertura (NFE-002) |

### 4.4 NFS-e Nacional: ordem de tentativa

1. PoC em produção restrita: distribuição por NSU com **e-CNPJ do escritório + procuração** (NFE-502). Se funcionar, é o padrão e o A1 deixa de ser pedido para serviços.
2. Senão, **A1 do cliente** (NFE-007), mesmo CNPJ raiz.
3. Teste de **completude por capital** (um CNPJ real, um mês, contra o portal municipal) antes de desligar qualquer alternativa (V2 I-12).
4. Municípios não ativos (Cantagalo PR, Cristal do Sul RS) e sistemas próprios com defasagem: lista por município (5.3) e NFE-008.
5. Emissão (NFE-039, GES-007, NFE-201): Sefin por DPS; o Simples emite só pelo Emissor Nacional desde 01/11/2026 (B1). Integrador só para município fora do padrão.

---

## 5. Conectores estaduais e municipais

### 5.1 Perfil por UF

| UF | NF-e e CT-e | NFC-e | DTE | Certidão estadual | Guias e conta-corrente | Nível |
| --- | --- | --- | --- | --- | --- | --- |
| **RS** | Web service para contabilistas: emitidas **e destinadas**, com e-CNPJ do escritório; o cliente autoriza no e-CAC estadual e o contabilista aceita (NFE-501) | Mesmo web service | **Sem agregador**; procuração eletrônica do CNPJ ao contabilista (vínculo no CGCTE não basta) | InfoSimples (+ R$ 0,04) | ICMS exige EFD validada: core (F) | A / C-crc / B |
| **SC** | Web service SEF-SC para contabilistas vinculados ao CNPJ (NFE-501) | Web service em teste desde 15/04/2026, pode ser encerrado | DTEC no SAT; InfoSimples com A1; senha do SAT como alternativa C-crc | InfoSimples (+ R$ 0,04) | DARE pelo core | A / B / B |
| **PR** | Entradas com A1 do cliente; Receita/PR aceita o contador sem API (C-crc, fora da v1) | Nota a nota por agregador ou PDV | DT-e; InfoSimples com A1 | InfoSimples (+ R$ 0,07) | GR-PR pelo core | A / B / B |
| **MG** | Entradas com A1 do cliente; sem caminho para contabilista | Nota a nota | DT-e no SIARE; InfoSimples com A1 | InfoSimples (+ R$ 0,08; pede login ou certificado) | DAE pelo core; apuração só pela EFD desde 30/01/2026 | A / B / B |
| **SP** | Entradas com A1 do cliente; o FAQ da Sefaz-SP só prevê autXML ou pedir ao cliente | **SAE-NFC-e** com e-CNPJ do próprio contribuinte | DEC; InfoSimples com A1 e `ignora_nao_lidas` | **Certidão Única** Sefaz + PGE desde 14/10/2026, 90 dias; InfoSimples (+ R$ 0,08) | SIDEB com e-CNPJ: C-cert, fora da v1; GARE pelo core | A / B / B |
| **Outras** | Entradas com A1; PE (e-Fisco aceita o contador) e AM (procuração) candidatos a robô | Agregador ou PDV | Sem levantamento; D-assistido com lembrete | `sefaz/certidao-debitos` unificada (+ R$ 0,08) | Core | A / D / B |

O perfil é **dado versionado**: tabela UF × documento × caminho × credencial × nível × fonte, com data de conferência. O Administrador vê a cobertura e o que falta por cliente; a plataforma escolhe sozinha, o que nenhum concorrente encontrado faz (B5).

### 5.2 Domicílios eletrônicos

Regra conferida: ciência **no dia da consulta do teor** e **tácita em 10 dias** em SP, MG, PR, SC e RS (V2 I-23); DEC paulistano e de Curitiba também 10 dias (trecho).

1. `dte.listar(cliente, uf)` roda em dias úteis, de manhã, pelo agregador, com `ignora_nao_lidas`; devolve assunto, data, status. **Se listar der ciência, o conector pára**: a regra "listar nunca dá ciência" (13.1) foi confirmada para o e-CAC; para os DTEs estaduais pelo agregador, a pergunta continua aberta à InfoSimples (consolidado 9, linha 5), e até a resposta a lista roda com aprovação do Gestor na primeira semana de cada escritório. Pergunta P2.
2. Mensagem nova → `dte.mensagem.receber`; o Fiscal calcula D+10 e abre FIS-026 com prazo interno D+7.
3. `dte.abrir` é irreversível, com cartão: "abrir hoje inicia o prazo; sem abrir, a ciência é considerada em DD/MM".
4. RS: C-crc com o contador procurador no circuito (seção 8); sem parecer, D-assistido com lembrete diário.
5. DEC municipal: SP pelo agregador (FIS-029); demais capitais, lembrete.

### 5.3 NFS-e municipal fora do padrão nacional

Lista por município mantida pela plataforma (dado versionado, como a lista de domínios da extensão, 05 3.2): situação no ADN (planilha de 28/09/2026), sistema próprio, completude testada, caminho (ADN, upload, integrador, portal). Nas cinco UFs só dois municípios não estão ativos. Na v1 o conector `nfse_municipal` só recebe PDF ou XML pelo app ou e-mail e extrai campos (NFE-008). Integrador comercial por município quando houver cliente com volume (Focus integra município novo por R$ 199).

### 5.4 Agregador de consultas (InfoSimples)

| Capacidade | Endpoint conferido | Credencial | Adicional | Atividades |
| --- | --- | --- | --- | --- |
| DTE SP, MG, PR, SC; DEC paulistano | `sefaz/{uf}/dec/caixa-postal`, `pref/sp/sao-paulo/caixa-postal` | A1 do cliente (PKCS#12 a cada chamada) | R$ 0 | FIS-026, FIS-029 |
| Certidões estaduais | `sefaz/{uf}/certidao-debitos`; unificada; `pge/sp/cndt` | Nenhuma (MG e PGE-SP pedem login ou certificado) | R$ 0,04 a 0,08 | FIS-036, FIS-027 |
| Certidões municipais das capitais | SP 0,04; BH 0,08; Curitiba 0,08; Florianópolis 0; POA 0,04 | Nenhuma | idem | FIS-036 |
| Sintegra, CCC | `sintegra/{uf}`, `sintegra/unificada`, `sefaz/cadastro-centralizado` | Nenhuma (CCC: A1 ou login) | R$ 0 a 0,10 | SOC-003, FIS-030, NFE-028 |
| JUCESP | viabilidade REDESIM, fichas, documentos | Protocolo + login ou certificado | R$ 0,08 | SOC-027, SOC-030, SOC-102 |
| Bombeiros SP | `pm/sp/licenca-bombeiros` | Nenhuma | R$ 0 | SOC-037 |

Preço base em cascata mensal: R$ 0,20 (1–500) → 0,16 → 0,14 → 0,13 → 0,11 → 0,10 → 0,09 → 0,07 → 0,05; franquia mínima R$ 100/mês; "nada consta" é cobrado; crédito de teste R$ 100. O agregador é tratado como **fornecedor com DPA**: sem o contrato assinado, as capacidades que enviam A1 ficam desligadas. Reserva de toda consulta com CAPTCHA: C-captcha com humano (seção 8), nunca resolvedor automático.

### 5.5 Como o perfil de captura decide

`perfil_captura(cliente)` (ler; NFE-001, NFE-003) cruza o perfil vigente (UF, município, IE, IM, regime, documentos que emite e recebe, varejo) com a tabela de 5.1 e devolve, por documento, caminho e credencial, na ordem: (1) e-CNPJ do escritório (autXML, web service RS/SC, procuração NFS-e); (2) portais municipais pelo conector e fornecedor de captura (nível B); (3) A1 do cliente; (4) upload e e-mail de XML (complemento). A pendência "Enviar certificado A1" do app (06 6.1) nasce só quando (3) é o único caminho para algum documento, com a frase do motivo. A cobertura ("NF-e entradas: A1 ativo · saídas: autXML em 92% das notas · NFS-e: procuração pendente") aparece na aba Notas (03 6.3).

### 5.6 Inscrições, ISS e Juntas

Situação cadastral: eventos PJ do Integra (grátis) + Sintegra pelo agregador + Consulta CNPJ opcional (SOC-003, FIS-030). ISS: base pelas NFS-e do ADN; guia pelo core (F) ou portal (D-assistido); FIS-028. REDESIM e Juntas: viabilidade na JUCESP por agregador (B); abertura, alteração, baixa e livros D-assistido com checklist (SOC-025, SOC-029, SOC-033, SOC-042); vínculo do contador pelo PNRCONTADOR (A$) e "Meus Clientes" da REDESIM (C-crc, SOC-005).

---

## 6. Conectores dos cores

### 6.1 Contrato único do core

Um conector de core expõe as mesmas capacidades para qualquer sistema; cada core é um adaptador que implementa o que pode (B6 2.5). O timesheet (05 4.1) definiu a parte de tarefas; o contrato completo:

| Capacidade | Direção | Alterdata | Domínio | Questor | Contmatic |
| --- | --- | --- | --- | --- | --- |
| `core.empresas.listar` (id, CNPJ, nome, regime, departamento) | lê | `GET /api/v1/empresas` | A negociar; exportação | A negociar | Planilha (F) |
| `core.tarefas.listar_alteradas(desde)` (id, empresa, departamento, responsável, tipo, competência, status com data-hora, início e horas se houver, anexos) | lê | `historico-tarefas` (sem início nem horas) | Domínio Processos a negociar; relatório Excel por `core.importar_relatorio` | Tareffa a negociar | Relatório Gestão do Escritório (F) |
| `core.documentos.listar` (categoria, título, valor, vencimento, status, arquivo) | lê | `GET /integracao/documentos` | Portal do Cliente sem API (C-crc evitado) | — | Contador Online a negociar |
| `core.certidoes.listar` | lê | eCND | Portal do Cliente | — | — |
| `core.xml.enviar` | escreve | Pasta (F; sem endpoint de upload) | **API de entrada** para ERP homologado: NF-e, NFC-e, NFS-e, CF-e, CT-e; chave por empresa no Onvio Gestão; fila de 60 dias; Agente de Comunicação ativo | SYN (`POST`, 2 req/s) | Pasta "Busca XML" (F) |
| `core.lancamentos.enviar` (lançamentos, pagamentos, recebimentos) | escreve | `integracaoAlterdata` (TXT) | API de entrada; TXT | SYN | TXT (F) |
| `core.folha.enviar` (admissão, férias, rescisão, rubricas) | escreve | `candidatos`, `agendamentos-ferias`, `notificacoes-rescisao`, `movimentos` | API de Rubricas | A negociar | — |
| `core.atendimento.abrir`; `core.das.recalcular` | escreve, executa | `POST /atendimentos`; `recalculo-das` (1 por empresa/dia) | — | — | — |

Escrita no core é `irreversivel = true` e `exige_aprovacao = se_integrante`. Eventos: `core.tarefa.<status>` (Fundações 5.6), `core.documento.receber`, `core.envio.ok`, `core.envio.erro` (com o motivo do core, ex. "relação de acumulador para o CFOP/CST não encontrada").

### 6.2 Alterdata ePlugin

Confirmado (V3 I-02): REST/JSON, `Authorization: Bearer` com token gerado no eContador, pré-requisito pacote **eContador Master** (preço não público). O token é **do escritório**, no cofre como `token_api`.

| O que a API oferece | Uso | Atividades |
| --- | --- | --- |
| Histórico de tarefas | Fonte 2 do timesheet: leitura a cada 15 min no dia corrente e varredura diária de 7 dias (05 4.2); conclusão por evidência fecha a tarefa da plataforma (03 7.6) | GES-048, FIS-001, FIS-003, FIS-047 |
| Documentos, categorias, certidões (eCND) | Guias e relatórios do core viram Documentos `origem = core` na pasta do cliente (visíveis no app se a pasta for visível); CNDs já controladas não são consultadas de novo | GES-039, FIS-031, FIS-036, SOC-019 |
| Empresas, usuários, funcionários, funções | Importação inicial e mapas de equivalência (6.5); diagnóstico trabalhista | SOC-023, DP-102 |
| Admissão, férias, rescisão, movimentos, lançamentos, atendimentos, recálculo de DAS | Pedido do cliente no app vira registro no core, com cartão | DP-001, DP-009, DP-011, DP-020, DP-024, CTB-017, GES-040, FIS-201 |

Vai à negociação (consolidado 9, linha 1): início e horas por tarefa, upload de documento, envio de XML, webhooks, limite de taxa, token em nome de vários escritórios. Prosoft (grupo Alterdata) usa o mesmo conector.

### 6.3 Domínio e Onvio (Thomson Reuters)

- **Entrada (B confirmado)**: a plataforma se cadastra como parceira ("Quero ser parceiro") e recebe a especificação; o escritório gera **uma chave por empresa** em Onvio Gestão › API; o Agente de Comunicação precisa estar verde no servidor do escritório; documentos ficam 60 dias na fila. O conector guarda a chave por empresa no cofre e monitora o status da API por hora. NFE-033, NFE-034, CTB-017, DP-011.
- **Saída (a negociar)**: não há API pública do Domínio Processos nem do Portal do Cliente. Pedir, nesta ordem (05 4.3; V3 I-01): (1) leitura de tarefas do Processos com empresa, departamento, responsável por e-mail, tipo, status com data-hora, **início real e tempo de produção**; (2) "alterado desde" ou webhook; (3) anexos por id; (4) códigos estáveis de departamento e tipo de processo; (5) Portal do Cliente: publicar e ler documentos e solicitações sem login de usuário; (6) leiaute de lançamentos; (7) o que `api.onvio.com.br` cobre; (8) relação Gestta ↔ Domínio Processos.
- **Arquivo de troca enquanto não houver API**: relatório de produtividade do Processos (Excel) por `core.importar_relatorio` como eventos `core.*`; TXT de lançamentos (CTB-103, CTB-109); OFX; pasta do Domínio indexada pelo conector de armazenamento para artefatos (05 5.1).
- **Nunca**: ler o Portal com usuário e senha de um usuário Onvio com MFA, nem o banco local do core (consolidado §6).

### 6.4 Questor, Contmatic e outros

| Core | Entrada | Saída de tarefas | Caminho na v1 | Ficha |
| --- | --- | --- | --- | --- |
| **Questor** | SYN (`POST` cabeçalho + dados JSON; homologação e produção; 2 req/s): lançamentos, entradas, saídas, pagamentos, recebimentos, inventário, Bloco K | Tareffa: não encontrada; negociar junto | B para entrada; F para o resto | GES-609 |
| **Contmatic** | Nenhuma API pública; integra com Acessórias e Jettax por canal não documentado | Gestão do Escritório (Avançado e Elite) só por relatório | **F**: pasta do Phoenix indexada (guias, SPED, recibos como artefatos); relatório importado; confirmação assistida (05 4.5); pedir o acesso dado aos parceiros | GES-048, CTB-019, NFE-035 |
| **SCI**, **Fortes** | SCI: programa de parceiro e Portal do Desenvolvedor (não lido); Fortes: sem API publicada, integra Omie e Kloud | — | Cadastrar como parceira; negociar; F (SPED, TXT) | GES-609 |
| **Gestta, Acessórias, Nibo Obrigações, HubStrom** (a substituir) | Acessórias: API por token não documentada; Nibo: API beta; Gestta: só Excel; HubStrom: nada | — | Conectores **de migração**, usados uma vez: histórico importado como somente leitura (protocolos com data, hora, IP) e JSON bruto guardado | GES-601, 602, 606, 607, 608 |

Ordem de desligamento e critérios de paridade: B6 4.2; o SIEG sai por último (GES-604), com `/ContarXmls` como coluna da aba Notas enquanto a migração estiver aberta.

### 6.5 Tabela de equivalência

Compartilhada com o timesheet (Fundações 5.6; 05 4.6): uma por escritório e por core, em Gestão › Catálogo local. Quatro mapas: departamento → setor (sugestão por nome, confirmação única); responsável → usuário (por e-mail; senão lista); empresa → cliente (por CNPJ; empresa sem cliente vira sugestão "importar"); tipo de tarefa → atividade (três sugestões por similaridade; o Gestor escolhe; vale para o futuro e 90 dias para trás). Fila "sem equivalente" por ocorrências. O conector nunca cria sessão sem `atividade_id`; o evento fica guardado e a sessão nasce retroativa quando o mapa casa.

### 6.6 Importação inicial de cadastro (F14)

(1) Empresas do core (`core.empresas.listar` ou exportação) casadas por CNPJ com os dados abertos ou a Consulta CNPJ (SOC-001); (2) perfil versionado com regime e CNAE do core, marcado "importado, a conferir"; (3) pessoas e responsáveis pelos mapas de 6.5; (4) tarefas dos últimos 90 dias como eventos `core.*`; (5) planilhas do painel atual (Desenho 1.4) como carga de obrigações e contatos. Tudo é ferramenta de nível executar com `origem = migracao` e cartão por lote ao Administrador.

---

## 7. Conectores de mercado

### 7.1 WhatsApp

Decisões do Desenho 3.3 e do 04 (3.1 a 3.6): Cloud API direto na Meta com **coexistência** (Embedded Signup; o app precisa abrir a cada 14 dias; grupos, listas e visualização única não sincronizam); **provedor abstraído** (interface do 04 3.4: receber, enviar, status, baixar mídia, templates, saúde); BSP só se verificação ou suporte travarem; modo não oficial experimental com aviso aceito. O conector implementa a interface; o CRM não conhece a Meta.

| Ponto | Regra no conector | Fonte |
| --- | --- | --- |
| Credencial | Conta Meta Business verificada, número por setor, forma de pagamento no Billing Hub, conta em **BRL** (obrigatória até 30/06/2027); token de sistema no cofre | V3 I-05 |
| Janela de 24 h | Texto livre só na janela; fora dela `conversa.responder` exige modelo aprovado (utilidade ou marketing) com opt-in | 04 3.3 |
| Preços (BRL, desde 01/10/2026) | Marketing R$ 0,3217; utilidade R$ 0,035 (mesmo na janela); autenticação R$ 0,035; serviço R$ 0,035 após **1.000 grátis por número/mês**; receber é grátis | V3 I-05 |
| Limites de envio | 250 → 2.000 → 10 mil → 100 mil destinatários em 24 h, por qualidade e verificação; `canal.verificar_saude` expõe limite e qualidade; o Comunicados avisa o teto | S3 |
| Mídia e áudio | URL válida por 5 min: baixa na hora e chama `documento.registrar`; áudio transcrito (centavos por minuto) | S3; 04 3.6 |
| Templates e webhook | `modelo.submeter` e `modelo.status`; webhook com `id_externo` da Meta como chave de dedupe; sem webhook por 15 min, consulta a saúde e avisa | GES-029, GES-203 |
| Grupos e IA | Grupos só com Official Business Account e até 8 participantes, fora da v1; respostas do integrante são "serviço"; política de IA da Meta e inquérito do CADE seguem abertos: não vender "IA responde o cliente" antes de confirmar | V3 I-05; Desenho 3.3 |

Atividades (57 nas fases 0–2): GES-023 a GES-038, FIS-010, FIS-032, FIS-044, SOC-009, NFE-037, DP-020 e as réguas do 04.

### 7.2 E-mail

Um conector `email`, implementações Gmail API, Microsoft Graph e IMAP/SMTP, credencial `oauth` do escritório (caixa de setor) ou da pessoa. Três usos:

1. **Caixa por setor no CRM** (`fiscal@`, `dp@`, `contato@` com triagem): recebimento vira Mensagem `canal = email`, anexos passam por `documento.registrar` e classificação; envio por `conversa.responder` sem janela nem template. GES-027, GES-030, NFE-012, CON-001.
2. **Caixa dedicada de XML** (NFE-503), complemento opcional (13.4): endereço que o cliente configura no emissor; o conector confere assinatura e protocolo, identifica o CNPJ e vincula ao cliente; XML inválido vai para "triar"; cruza com a sequência numérica (NFE-020).
3. **Contas do escritório** (FIN-003, fase 3): boletos e faturas por e-mail e DDA viram contas a pagar.

Só leitura das pastas configuradas; nada é apagado no provedor; e-mail de órgão é dado (C6): "você foi intimado" é alerta a conferir na fonte oficial, não fato.

### 7.3 Agregador bancário e arquivos

| Caminho | Nível | Credencial | Custo | Uso | Fase |
| --- | --- | --- | --- | --- | --- |
| **OFX, CNAB, EDI** pelo app ou pasta | F | Nenhuma | R$ 0 | Extrato do mês (CTB-008); cartões (CTB-013); o core concilia | 1 |
| **Pluggy** | B | Consentimento do representante da PJ + contrato | **≥ R$ 2.500/mês** com volume incluso; excedente por requisição; 15 dias de teste | Conciliação simplificada do cliente (CTB-010, CTB-015; serviço extra do 06 8); caixa do escritório (FIN-004); `DELETE /items/{id}` no desligamento (CTB-111) | 3 |
| **Belvo** | B | Idem | Launch US$ 1.000/mês | Alternativa | 3 |
| **API do banco do escritório** (mTLS) | B | Certificado do banco | Conforme banco | Só a conta do escritório | 3 |

O conector `banco` abstrai os três: `banco.consentimento.convidar`, `.status`, `.revogar`, `banco.extrato.listar`, `banco.transacoes.listar_desde(cursor)`. Consentimento que vence vira tarefa 30 dias antes (06 6.4). O piso só faz sentido rateado ou vendido como serviço extra; o MVP é OFX. Pergunta P7.

### 7.4 Cobrança

Abstração `cobranca.*` (criar, cancelar, segunda_via, pix_automatico.autorizar, webhook → `recebimento.receber` → baixa automática GES-003). **Decisão de 7/11/2026: funciona como o Conexa, ligado diretamente ao banco do escritório, e não depende de um provedor único.** O conector tem três tipos de implementação, todos atrás da mesma interface: (1) **banco do escritório**, com o convênio de cobrança que ele já tem (Inter, Itaú, Bradesco, Santander, Banco do Brasil, Sicoob, Sicredi e outros): Pix pela API Pix padronizada do Banco Central, que todo banco expõe com o mesmo formato, e boleto pela API de cobrança do banco ou, onde não houver, por arquivo CNAB de remessa e retorno (nível F); (2) **agregador de bancos** (Kobana e similares), que unifica as APIs de vários bancos em uma só; (3) **gateway** (Asaas, Efí), para o escritório que não quer lidar com convênio bancário. A conta é **do escritório** (credenciais do banco ou token do provedor no cofre); a plataforma não intermedia dinheiro. Quais bancos têm API de cobrança utilizável por terceiro, e o formato de autenticação de cada um, é levantamento a fazer (item 13.7); não se afirma aqui uma lista fechada. Pergunta P8.

| Item | Asaas | Efí |
| --- | --- | --- |
| Pix ou boleto recebido | R$ 1,59 (R$ 0,79 promocional; conferido na página oficial em 7/11/2026) | Boleto R$ 3,45; Pix por API 1,19%; Pix Automático R$ 3,50 |
| Notificação por WhatsApp | R$ 0,55: não usar; a régua da plataforma custa R$ 0,035 | — |
| NFS-e; negativação | R$ 0,49 (não usar se o escritório emitir pelo Emissor Nacional); R$ 9,90 | — |

Usos: honorários do escritório (GES-001, GES-004, GES-009, FIN-604; fase 3) e, depois, cobrança dos clientes do cliente (FIN-201, fase 5) com subcontas em nome do cliente, termo e margem. Títulos do provedor antigo terminam lá; só cobranças novas nascem no novo (B6 4.3). A régua respeita o limite ético: nunca condicionar entrega de documento a pagamento (GES-006, NBC PG 01 **[a confirmar]**).

Tarifas: quando a cobrança é pelo **banco do escritório**, a tarifa é a do convênio dele com o banco (a plataforma não cobra por boleto nem por Pix); a tabela abaixo vale só para os gateways.

### 7.5 Emissor de NFS-e do escritório

GES-007 e FIN-011 (fase 3): escritório do Simples emite **só pelo Emissor Nacional** desde 01/11/2026 (B1): o conector `nfse_nacional` emite por DPS com o `ecnpj_escritorio`, uma nota por honorário, com retenções de IRRF e CSRF **[a confirmar]** e campos de IBS/CBS (sem rejeição em 2026). Município fora do padrão: integrador (Focus Solo R$ 94,90/mês) ou Asaas (R$ 0,49 por nota). Leiaute de cancelamento e substituição **[a confirmar]**. Pergunta P13.

### 7.6 Assinatura eletrônica

Dois níveis (06 5.5): **ciência simples na plataforma** (`documento.assinar_ciencia`: identidade autenticada, data, hora, hash, IP; PDF com o tema) é a v1 e cobre termos, balancetes, autorizações (GES-036) e variáveis da folha. **Avançada por provedor** entra depois pela abstração `assinatura.enviar(documento, signatarios, nivel)`, `assinatura.status` e webhook `assinatura.concluir`, que grava o arquivo assinado no índice. Pisos com API: ZapSign Equipe R$ 69,90/mês (20 docs), Clicksign Start R$ 69, D4Sign Profissional R$ 79,90. Qualificada nunca com o A1 do cofre. SOC-015, SOC-016, SOC-020, SOC-021, SOC-026, SOC-041, DP-005, DP-024, DP-030, CTB-037, CTB-039, FIN-001.

### 7.7 Calendário

Conector `agenda` (Google Calendar, Microsoft Graph), credencial `oauth` **por usuário**; o Administrador pode conectar uma agenda do setor. `agenda.listar_horarios`, `.marcar`, `.remarcar`, `.cancelar` (06 3.7; `reuniao.agendar` do 04) e leitura de eventos passados com convidado de cliente para o timesheet (GES-050, fase 3): só o vínculo pessoa-cliente é usado; título e descrição não vão ao modelo. Pergunta P12.

### 7.8 Nuvens de arquivo

Conector de armazenamento das Fundações 7.1, com autenticação e notificação:

| Backend | Credencial | Notificação de mudança | Limites |
| --- | --- | --- | --- |
| **Google Drive** (conta do escritório ou Shared Drive) | `oauth` do Administrador, escopo só de arquivos | Assinatura de mudanças (webhook renovado) + consulta por cursor; varredura diária de segurança | Cota do escritório; Shared Drive preferido ao "Meu Drive" pessoal |
| **OneDrive / SharePoint** | `oauth` (Graph) | Assinatura + consulta delta | Biblioteca do SharePoint como raiz |
| **Plataforma** | Nenhuma | Interna | Cota da assinatura, por GB (Fundações 7.6) |
| **S3 compatível** (MinIO, NAS) | `chave_nuvem` | Varredura a cada 15 min; notificação de bucket quando o servidor oferecer **[a confirmar por produto]** | O escritório expõe o endpoint; a plataforma não entra na rede dele |
| **WebDAV**, **SFTP** | `chave_nuvem` (usuário de serviço; chave SSH preferida) | Varredura a cada 15 min | Sem notificação nativa |

Regras herdadas (Fundações 7.4 e 7.8): arquivo novo vira Documento `origem = nuvem_escritorio`; alterado vira versão; movido segue o id; removido marca `bytes_ausentes_desde`; conflito nunca sobrescreve; visibilidade ao cliente depende da pasta. A pasta do core indexada aqui é a fonte dos artefatos do timesheet (05 5.1) e dos documentos gerados que vão ao app (GES-039).

### 7.9 Extensão de navegador como "conector" dos portais

A extensão (05 3) é um conector de família `robo` com uma capacidade só: `atividade.pulso` com `portal`, `cnpj_detectado`, `metodo_deteccao`. Lê a página só para identificar o cliente, envia só o identificador, nunca conteúdo nem credencial, só nos domínios da lista versionada. Não executa nada nos portais. A lista de domínios é a base da lista de "portais sem API" da seção 8.

---

## 8. Robôs (níveis C)

### 8.1 Quando um robô é aceitável

Só com as quatro condições: (1) não há API, agregador nem arquivo (A, A$, B, F) para a capacidade; (2) a credencial é legítima e do próprio ator (e-CNPJ com procuração, ou login do contador) e os termos do portal permitem; (3) a dor é medida no timesheet (horas por mês), não estimada; (4) há parecer jurídico registrado para o portal (consolidado §6, decisão 3). Fora disso, D-assistido: tarefa, checklist, lembrete, link e anexo pelo app.

### 8.2 Regras de execução

| Regra | Como |
| --- | --- |
| Navegador headless isolado por escritório | Um perfil por escritório, em contêiner descartado ao fim; nenhum cookie entre escritórios |
| Sem CAPTCHA automatizado | Ao aparecer, a execução pára e vira item C-captcha: uma pessoa resolve na tela da plataforma (sessão espelhada) e o robô continua; nunca resolvedor externo |
| Humano no circuito para C-crc | O dono do login aprova o cartão e digita senha e segundo fator na hora; o cartão mostra o que o robô fará, página a página |
| Nunca dar ciência | Robô lista; abrir teor é irreversível com cartão (C7) |
| Taxa baixa | Uma sessão por portal por escritório; pausas entre páginas; horário comercial; limite diário |
| Registro completo | Evento por execução com capturas de tela guardadas como Documento interno, credencial, quem aprovou, resultado |
| Fallback | Três execuções quebradas seguidas → D-assistido automático (tarefa com link e checklist) e aviso ao Administrador |

### 8.3 Candidatos, ordenados

A primeira versão **não liga nenhum robô autônomo** (P5). A fila, com o que cada um precisa para entrar:

| Portal | Capacidade | Nível | Credencial | Pré-requisito | Fichas |
| --- | --- | --- | --- | --- | --- |
| DET (MTE) | Listar notificações (nunca abrir) | C-cert | e-CNPJ + procurador | Resposta do MTE sobre API; parecer; dor medida | DP-040, DP-041 |
| DTE do RS | Listar mensagens | C-crc | Login do contador procurador | Resposta da Receita/RS; parecer | FIS-026 |
| FGTS Digital | Emitir GFD e baixar PDF | C-cert | e-CNPJ + procuração SPE | Resposta do MTE sobre API de parceiros; até lá D (analista emite, a plataforma lê o PDF e entrega) | DP-018, DP-029, DP-044 |
| e-Fisco PE, Receita/PR | Download de XML pelo contador | C-cert / C-crc | Certificado ou login do contador | Cliente fora de RS e SC com volume; termos | NFE-501 (parte) |
| SIDEB SP | Pendências e conta fiscal | C-cert | e-CNPJ ou poderes no CADESP | Certidão por agregador como sentinela antes | FIS-027, FIS-037 |
| REDESIM "Meus Clientes" | Vínculo e renúncia | C-crc | gov.br do contador | PNRCONTADOR (A$) cobre a parte federal | SOC-005, SOC-024 |
| XML-semente (saídas) | Seguir a numeração | C-cert | A1 do cliente | Entender o mecanismo (não publicado); autXML e e-mail antes | NFE-504 |
| ReceitanetBX | Baixar ECD e ECF | C-cert | Certificado | Recibo pelo core (F) resolve a maior parte | CTB-102 |
| Certidões com CAPTCHA | Emitir | C-captcha | Nenhuma | Só reserva do agregador, com humano | FIS-036 |

**Não fazer** (E): e-CAC por robô para o que o Integra cobre (a documentação do Integra existe "para substituir web scraping"); internet banking do cliente; WhatsApp não oficial para disparos; banco local do core; Portal do Cliente Onvio com usuário e senha.

### 8.4 Manutenção quando o portal muda

Seletores e passos são **dado versionado**, não código; execução sintética diária em modo leitura confere as páginas; quebra gera `robo.quebrar`, alerta no painel global e fallback D no escritório. Alteração de seletores passa por teste com gravação. O custo de manutenção por robô é comparado com a dor medida; robô que custa mais do que poupa é desligado.

---

## 9. Captura de documentos ponta a ponta

### 9.1 NF-e de entrada

| # | Passo | Quem | Resultado |
| --- | --- | --- | --- |
| 1 | `perfil_captura(cliente)`: cliente de SP → distribuição nacional com A1 do cliente; cliente do RS → web service estadual com e-CNPJ do escritório | Perfil (5.5) | Caminho e credencial; se falta o A1, pendência no app com o motivo |
| 2 | Job de 2 h chama `dfe.distribuir(cliente)` a partir do `ultNSU` | Conector DF-e | Lote de até 50; 137 → espera 1 h; evento `credencial.usar` |
| 3 | Resumo sem XML completo | Conector | `manifestacao.ciencia` automática se autorizada no termo; o XML chega na próxima consulta |
| 4 | XML gravado bruto; hash; dedupe por chave de acesso | Fila | Documento `tipo = nfe`, `origem = captura_governo`, competência pela emissão, metadados com chave, número, emitente, valor, NSU, caminho |
| 5 | Pasta `<cliente>/<ano>/<AAAA-MM>/nfe/` no backend padrão; se visível ao cliente, aparece no app na hora (Fundações 7.8) | `documento.registrar` | Evento `documento.registrar` |
| 6 | O evento acorda o integrante de Notas, agrupado por cliente ("12 documentos da Empresa X") | Despachante (02) | NCM, CST, CFOP (NFE-023), nota fria (NFE-016), fornecedor irregular (NFE-028) |
| 7 | Lote por competência ao core: `core.xml.enviar` (Domínio pela API; Alterdata e Contmatic por pasta) | Conector de core | `core.envio.ok` ou `.erro`; erro vira tarefa NFE-033 |
| 8 | Cabeçalho da aba Notas: "captura ok hoje 03:12 · NSU 18.442"; paridade com o SIEG enquanto a migração estiver aberta | Painel 6.3 | |

### 9.2 NFS-e

Perfil: ADN por procuração com e-CNPJ do escritório (se a PoC confirmar) ou A1 do cliente; município fora do ADN → NFE-008. `nfse.distribuir(cliente)` por NSU; eventos por chave. Documento `tipo = nfse`, pasta `nfse/`, metadados com código de serviço, ISS retido, tomador. O integrante de Notas confere retenção e IBS/CBS (FIS-045); o ISS retido alimenta FIS-028. Envio ao core. Completude por capital conferida mensalmente contra o portal.

### 9.3 Guia

Origem: Integra (`das.emitir`, `darf.emitir`: Emissão R$ 0,32) para federais; core (F) para estaduais e ISS; FGTS Digital pelo analista (D). PDF como Documento `tipo = guia`, `setor_id` Fiscal ou DP, metadados com tributo, competência, valor, vencimento, código de barras. Pasta visível `Entregáveis/Guias` → app; notificação "sua guia de outubro saiu" (utilidade R$ 0,035 fora da janela). Registro de entrega quando o cliente abre (06 5.2). `guia.vencer_sem_pagamento` em D-2 e D+1: consulta de pagamento no Integra (PAGTOWEB, R$ 0,24) ou "informar pagamento" no app; lembrete (FIS-032). Artefato para o timesheet.

### 9.4 Mensagem do e-CAC

Diário: `ecac.eventos_atualizacao` (grátis) para a carteira com procuração vigente. Mensagem nova → `caixa_postal.listar(cliente)` (R$ 0,24) → `ecac.mensagem.receber` com assunto, data, `dataCiencia`, `dataLeitura`. O Fiscal classifica, calcula a tácita e abre FIS-005 com prazo interno três dias antes. Cartão "abrir mensagem" ao responsável, com a frase de que abrir dá ciência e a data da tácita. Aprovado, `caixa_postal.abrir` baixa detalhe e anexos (URL pré-assinada) → Documento com subtipo intimação, pasta privada. O integrante resume (M1 explica a base legal), propõe resposta (FIS-038) e, se for termo de exclusão, o fluxo de 90 dias (FIS-008). Nunca visível ao cliente antes do contador decidir.

### 9.5 Extrato bancário

Fase 1: o cliente envia o OFX pelo app (pendência mensal CTB-008) ou o escritório lê da pasta; o conector `banco` valida banco, agência, conta e período; Documento `tipo = extrato`, pasta `extratos/`; baixa a pendência ("recebido: extrato de outubro"); envio ao core para conciliação. Fase 3: com consentimento Open Finance, o mesmo conector busca transações por cursor diário; o integrante do Contábil classifica e pergunta ao cliente "o que foi isto?" (CTB-010, CTB-015), cobrado do escritório à parte (13.3).

---

## 10. Custos

### 10.1 Tabela por conector

| Conector | Unidade | Preço (fonte V1 a V3, B1, S3) | Modo de teste |
| --- | --- | --- | --- |
| Integra Contador | Chamada | Consulta R$ 0,24→0,06 · Emissão R$ 0,32→0,08 · Declaração R$ 0,40→0,12; eventos de atualização grátis [a confirmar]; pós-pago, sem adesão | Demonstração [a confirmar] |
| Consulta CNPJ / CPF (SERPRO) | Consulta | R$ 0,6591 (Básica), 0,8683 (QSA), 1,1717 (Empresa); CPF R$ 0,6591 | — |
| eSocial, Reinf, DF-e, ADN, Calculadora, SGS, dados abertos | — | R$ 0 | Produção restrita (ADN, Reinf, eSocial) |
| InfoSimples | Consulta | R$ 0,20→0,05 + adicional R$ 0 a 0,10; mínimo R$ 100/mês | R$ 100 de crédito |
| WhatsApp Cloud API | Mensagem entregue | Marketing R$ 0,3217; utilidade, autenticação e serviço R$ 0,035; 1.000 de serviço grátis por número/mês | Número de teste |
| Transcrição de áudio | Minuto | ≈ R$ 0,015 a 0,02 | — |
| Alterdata ePlugin; Domínio (parceria); Contmatic, Questor, SCI | Pacote ou contrato | [PREÇO NÃO PÚBLICO]; chave e usuários Onvio sem custo | Piloto com token real; homologação |
| Asaas; Efí | Cobrança recebida | R$ 1,59 (R$ 0,79 promocional), NF R$ 0,49; Efí boleto R$ 3,45, Pix API 1,19%, Pix Automático R$ 3,50 | Sandbox |
| Pluggy; Belvo | Mês | ≥ R$ 2.500/mês; US$ 1.000/mês | 15 dias; sandbox |
| Assinatura (ZapSign, Clicksign, D4Sign) | Mês (20 docs) | R$ 69,90 · R$ 69 · R$ 79,90 | Planos de entrada |
| Integrador NFS-e (Focus) | Mês | Solo R$ 94,90; Growth R$ 572 (4.000 docs, R$ 0,125 adicional); município novo R$ 199 | 30 dias |
| Google, Microsoft (Drive, Graph, Calendar, Gmail) | — | Sem custo de API dentro das cotas [a confirmar]; armazenamento é do escritório | — |
| Armazenamento da plataforma; cofre (KMS/HSM) | GB; chave | Preço da assinatura; [a confirmar] | — |

### 10.2 Estimativa para 100 clientes

Premissas: 70 do Simples, 10 MEI, 20 Presumido ou Real com folha; 80 com IE em SP, MG, PR ou SC; dois números de WhatsApp; faixa 1 em tudo (no modelo A do Integra o volume somado cai de faixa).

| Conector | Volume mensal | Custo mensal |
| --- | --- | --- |
| Integra (PGDAS-D, DAS, lista 4×, pagamento; SITFIS; DCTFWeb e DARF; DAS-MEI) | 70 × R$ 1,92 a 2,56 + 10 × R$ 0,56 + 20 × R$ 2,64 | **R$ 193 a 238** |
| Consulta CNPJ (novos e varredura opcional) | 10 a 20 | R$ 7 a 13 |
| InfoSimples (DTE 4 × 80; certidões 2 × 100; Sintegra 1 × 100) | 620 consultas | **R$ 137** (500 × 0,20 + 120 × 0,16 + ≈ R$ 18 de adicionais) |
| WhatsApp (2 modelos de utilidade por cliente; serviço dentro das 1.000 grátis por número) | 200 + ≤ 2.000 | **R$ 7 a 20** |
| Transcrição | 500 min | R$ 10 |
| Cobrança por gateway Asaas (fase 3; no banco do escritório vale a tarifa do convênio dele) | 100 | R$ 159 (R$ 79 na tarifa promocional) |
| NFS-e do escritório pelo Emissor Nacional | 100 | R$ 0 (R$ 49 no Asaas) |
| Assinatura (fase 2) | ≤ 20 docs | R$ 69 a 80 |
| Open Finance (fase 3, se contratado) | piso | R$ 2.500 ÷ clientes conectados (100 → R$ 25 cada) |
| Captura oficial, eSocial, Reinf, Calculadora | — | R$ 0 |
| **Total variável nas fases 1 e 2** | | **≈ R$ 350 a 420/mês (R$ 3,50 a 4,20 por cliente)**, sem core nem Open Finance; com cobrança, ≈ R$ 570 a 640 |

Um cofre comercial de XML custa a partir de R$ 223/mês (SIEG); a captura própria sai a R$ 0. O Integra é o maior custo recorrente e o único sem substituto.

### 10.3 Repasse ou plano

| Custo | Tratamento | Por quê |
| --- | --- | --- |
| Integra Contador; InfoSimples | **Entram na precificação do módulo** (13.2), sem repasse avulso; consumo por cliente visível em Gestão (GES-010); franquia mínima diluída | Varia com a carteira; a Alterdata repassa a ~2× (R$ 0,80 por declaração) |
| WhatsApp | **Embutido** até um teto por número (ex.: 1.500 mensagens pagas); o excedente fica para o estudo de precificação por módulo (13.2) | Barato e previsível; o teto evita surpresa com marketing (R$ 0,3217) |
| Transcrição, Calculadora, captura oficial | Embutidos | Centavos ou zero |
| Asaas ou Efí, assinatura, integrador NFS-e | **Conta e contrato do escritório**; a plataforma integra | Dinheiro e documentos assinados são do escritório |
| Open Finance | Cobrado do escritório à parte (13.3) | Piso alto |
| Cores | Contrato do escritório com o fornecedor; parceria da plataforma à parte | Decisão 2 do fundador |
| Cofre, infraestrutura, armazenamento da plataforma | Plano (por GB) | Fundações 7.6 |

Pergunta P6.

---

## 11. Riscos e mudanças

| Risco | Efeito | Mitigação |
| --- | --- | --- |
| Catálogo do Integra muda a cada trimestre; documentação defasada; contrato-padrão para plataforma não lido | Capacidade some ou muda de preço; obrigação de usar o modelo B | Adaptador por catálogo; calendário de mudanças; teste sintético diário; piloto no modelo B e migração para A sem mudar o conector |
| NT nova da NF-e (CNPJ alfanumérico já) | Parser quebra; NSU fora de sequência | Versão paralela até a data de corte; monitor de 656 e 137 |
| ADN novo: completude, limites, procuração recém-anunciada | Notas faltando sem aviso; A1 pedido sem necessidade | Teste mensal por capital; PoC da procuração antes de desligar o A1; cobertura visível por cliente |
| Dependência da Thomson Reuters (concorrente) para saída de tarefas e Portal; Alterdata sem início nem horas | Timesheet com cobertura menor nos clientes desses cores | Arquivo de troca desde o primeiro dia; artefatos pela pasta; a implantação diz a cobertura esperada antes de contratar; calibração (05 11.2) |
| Política de IA da Meta e inquérito do CADE; coexistência exige abrir o app a cada 14 dias; conta em BRL até 30/06/2027 | Respostas reclassificadas; número para de receber | Abstração de provedor; teto por número; `canal.verificar_saude` avisa em D-3; não vender "IA responde o cliente" antes de confirmar |
| LGPD nas credenciais: A1 do cliente no agregador; tokens; senhas de portal | Incidente com centenas de certificados | Termo com serviço explícito; DPA; `compartilhada_com` auditável; sem senha de portal no cofre; chave por escritório |
| Ciência tácita por leitura automática (DTE, DET, caixa postal) | Prazo iniciado sem ninguém saber | C7; listar sem abrir; pergunta ao fornecedor; cartão com a data |
| Órgão ou fornecedor fora do ar por dias (ADN em jun/2026) | Captura parada; fila cresce | Cursor não avança; fila guarda; aviso em 24 h; tarefas de contingência em 72 h; retomada automática; relatório "o que chegou atrasado"; segunda implementação planejada para `certidao.*`, `banco.*`, `cobranca.*` |
| Robô quebra com mudança de portal; web service de NFC-e de SC em teste; Sefaz-RS barrou alguns A3 | Trabalho não feito sem aviso; captura interrompida | Execução sintética diária; fallback D; perfil por UF versionado; e-mail e PDV como reserva |

**Quando um conector cai por dias**: (1) fila e cursor preservam tudo; nada é marcado como feito; (2) o escritório vê "parado desde DD/MM, motivo" na aba e em Configurações › Conectores; (3) após 24 h, aviso ao Administrador e ao Gestor do setor; após 72 h, o integrante abre tarefas de contingência por cliente ("pedir XMLs pelo app", "ler o DTE manualmente, tácita em D+10"); (4) na volta, retomada automática e relatório do que chegou atrasado; (5) o painel global registra o incidente.

---

## 12. Ordem de construção, ajustes e perguntas

### 12.1 Etapas sobre as Fundações (F7, F12, F13 prontas)

Ordem por valor para o escritório: captura de notas e e-CAC primeiro; depois estados; depois cores e mercado.

| # | Etapa | Depende de | Entrega |
| --- | --- | --- | --- |
| C1 | Núcleo de conectores | F2, F12 | Conector, Conexão, Execução; filas, retentativa, fila morta, dedupe, teto de custo; Configurações › Conectores; eventos `conector.*`; painel global |
| C2 | Cofre como Credencial | F1, 06 A6 | Tipos de 3.1; `credencial.*`; `credencial.usar`; auditoria mensal; chave por escritório |
| C3 | Distribuição de DF-e e autXML | C1, C2, F7 | `dfe.*`, manifestação com cartão; perfil de captura v1 (SP, MG, PR, SC, RS); fluxo 9.1; cabeçalho da aba Notas |
| C4 | Integra Contador | C1, C2, contrato SERPRO | Termo e token; caixa postal (listar, indicador, abrir com cartão), eventos de atualização, DAS, PGDAS-D, SITFIS, DCTFWeb, Sicalc, PAGTOWEB, procurações; fluxos 9.3 e 9.4; custo por cliente |
| C5 | NFS-e Nacional | C3 | PoC da procuração; distribuição; completude por capital; lista de municípios fora do ADN; fluxo 9.2 |
| C6 | Web services RS e SC; SAE-NFC-e SP | C3 | Capturas com e-CNPJ do escritório; checklist de autorizações estaduais no app |
| C7 | Agregador (InfoSimples) | C2, DPA | DTEs SP, MG, PR, SC e DEC SP (listar); certidões; Sintegra; serviço "Certidões" do app |
| C8 | eSocial e EFD-Reinf | C2 | Consulta e download (10/dia); recibos; pendências (DP-038) |
| C9 | E-mail | F8, 04 | Caixa por setor; caixa de XML (NFE-503); triagem de anexo |
| C10 | WhatsApp | F8, 04 C1 | Cloud API na interface de provedor; coexistência; templates; saúde; webhooks |
| C11 | Cores: Alterdata completo; Domínio entrada; arquivo de troca | F13, 05 T5 | Documentos, certidões, empresas, folha, lançamentos; API de entrada TR; `core.importar_relatorio`; importação inicial (F14) |
| C12 | Nuvens além do Drive | F7 | OneDrive/SharePoint, S3, WebDAV, SFTP; varredura; pasta do core como artefato |
| C13 | Calculadora RFB e BCB | 07 M3 | Versão offline em contêiner; `calculo.reforma_conferir_rfb`; monitor de versão |
| C14 | Assinatura e calendário | 06 A9, 06 3.7 | `assinatura.*` com um provedor; `agenda.*` por usuário |
| C15 | Cobrança e NFS-e do escritório | FIN-001, fase 3 | `cobranca.*` pelo banco do escritório (API Pix, boleto por API ou CNAB; 13.7), com Asaas e Efí como alternativa; webhook de pagamento; Emissor Nacional |
| C16 | Open Finance | Fase 3, contrato | `banco.*` com Pluggy; consentimento pelo app; conciliação simplificada |
| C17 | Domínio saída; Questor, SCI, Contmatic | Contratos | Adaptadores quando houver acesso |
| C18 | Robôs | Parecer, dor medida | Infraestrutura de 8.2; primeiro candidato da fila de 8.3 |

C1 a C4 formam a primeira versão útil (notas de entrada e e-CAC do piloto); C5 a C8 fecham a fase 1 do Plano; C9 a C11 acompanham a fase 2; o resto segue as fases 3 a 6.

### 12.2 Ajustes pedidos às Fundações, 02, 03, 04, 05, 06 e 07

| # | Onde | Pedido | Por quê |
| --- | --- | --- | --- |
| A1 | Fundações 4.12 | Certificado vira **Credencial**: `tipo` ganha `procuracao_rfb`, `token_api`, `oauth`, `chave_nuvem`, `login_portal`; campos `fornecedor`, `escopo`, `compartilhada_com`, `rotacionada_em`, `vinculada_por`, `segundo_fator` | 3.1 |
| A2 | Fundações 4 | Entidades **Conector**, **Conexão**, **Execução**, **Item de fila**; **Perfil de captura** por cliente (documento, caminho, credencial, situação, cobertura) | 2, 5.5 |
| A3 | Fundações 5.7 | Eventos `conector.*` (executar, falhar, pausar, retomar, custo.teto, versao.mudar); `credencial.*` (vincular, usar, rotacionar, revogar); `captura.documento.receber`, `captura.cursor.avancar`, `captura.lacuna`; `dte.mensagem.receber`, `ciencia.registrar`; `core.documento.receber`, `core.envio.ok`, `core.envio.erro`; `webhook.receber`; `recebimento.receber`; `assinatura.concluir`; `consentimento.vencer`; `robo.executar`, `robo.quebrar` | 2.4, 9 |
| A4 | Fundações 6.5 | Catálogo: `conector.*`, `credencial.*`, `perfil_captura`, `dfe.*`, `manifestacao.*`, `nfse.*`, `ecac.*` e `caixa_postal.*`, `integra.*` (das, darf, pgdas, sitfis, dctfweb, pagamentos, procuracoes), `esocial.*`, `reinf.*`, `dte.*`, `certidao.*`, `cadastro.consultar_cnpj`, `core.*` (6.1), `email.*`, `banco.*`, `cobranca.*`, `assinatura.*`, `agenda.*`, `calculo.reforma_conferir_rfb`; capacidades que dão ciência com `exige_aprovacao = sempre` | 2, 4, 6, 7 |
| A5 | Fundações 6.1 | Ferramenta ganha `da_ciencia` e `custo.tabela_ref` (linha de preço do conector) | C7, 10 |
| A6 | Fundações 7.1 | Conector de armazenamento usa `credencial_ref` do cofre (`oauth` ou `chave_nuvem`); campo `intervalo_varredura_min` | 7.8 |
| A7 | Fundações 4.11 | `origem` ganha `email_xml` (complemento opcional; sem `agente_pasta`); `metadados` padroniza `chave_acesso`, `nsu`, `caminho_captura`, `credencial_usada_id` | 9 |
| A8 | 02 (7.2) | Gatilhos: `conector.falhar` × 3 acorda Gestão; `dte.mensagem.receber` e `ecac.mensagem.receber` acordam o Fiscal com cálculo da tácita; `captura.lacuna` acorda Notas; `consentimento.vencer` e `certificado.vencer_em_30_dias` acordam o Societário | 2.4, 5.2, 9.4 |
| A9 | 03 (6.3, 6.9, 2.0) | Tela **Configurações › Conectores** (Administrador); cabeçalho de captura lê `conector.saude`; Gestão mostra custo por cliente e conector com o teto; coluna de paridade SIEG enquanto GES-604 estiver aberto | 2.4, 10.3 |
| A10 | 04 (3.4) | A interface de provedor é a capacidade `canal.*` do conector `whatsapp`; `canal.verificar_saude` → `conector.saude`; um conector de e-mail para CRM e caixa de XML | 7.1, 7.2 |
| A11 | 05 (4.1) | Contrato do core ganha `core.empresas.listar`, `core.documentos.listar`, `core.certidoes.listar` e as escritas de 6.1; `core.importar_relatorio` é o adaptador F | 6.1 |
| A12 | 06 (6.1, 6.4, 8) | A pendência do A1 nasce de `perfil_captura`; a matriz de procurações lê Credenciais `procuracao_*`; "Certidões" usa `certidao.emitir`; o termo do A1 ganha "consultas por fornecedor" | 3.2, 5.4, 5.5 |
| A13 | 07 (5.5) | `calculo.reforma_conferir_rfb` roda no conector da Calculadora offline; `versao_tabelas` guarda `versaoApp` e `versaoDb` | 4.1 |
| A14 | Fundações 11 | Testes: segredo nunca aparece em saída, evento, log ou contexto de modelo; reentrega de NSU, mensagem e tarefa não duplica; capacidade `da_ciencia` sem aprovação é recusada; conexão do escritório A não lê cursor nem credencial do B; execução interrompida retoma do cursor sem repetir efeito | C1 a C10 |

### 12.3 Perguntas para aval

| # | Pergunta | Hipótese adotada | Em palavras simples |
| --- | --- | --- | --- |
| P1 | Integra Contador: a plataforma contrata com o SERPRO (modelo A, termo por escritório) ou cada escritório contrata (modelo B)? | **Respondido (segue a hipótese):** A como alvo; B no piloto até o contrato-padrão ser lido | É decidir quem assina com o SERPRO: se for a plataforma, é um contrato só e o volume somado barateia cada consulta; se for cada escritório, é mais simples juridicamente, mas cada um paga a faixa mais cara. |
| P2 | Aceitamos enviar o A1 do cliente a um fornecedor (InfoSimples) para ler as caixas postais estaduais? | **Respondido (segue a hipótese; ver 13.6):** Sim, com o serviço marcado no termo do cliente e DPA com o fornecedor; sem isso, DTE manual com lembrete | Para ler os avisos da Sefaz, o certificado do cliente passa pelas mãos de uma empresa terceira; o cliente precisa saber e concordar, e a empresa precisa assinar um contrato de proteção de dados. |
| P3 | NFS-e pelo ADN com procuração e certificado do escritório: tentamos antes de pedir o A1 do cliente? | **Respondido (segue a hipótese):** Sim; PoC em produção restrita; A1 só se a PoC falhar | Desde novembro o governo parece deixar o contador buscar as notas de serviço com o certificado dele e uma procuração; se funcionar, pedimos muito menos certificados aos clientes. |
| P4 | Alguma mensagem que dá ciência pode ser aberta sem alguém clicar? | **Respondido:** ver 13.1: listar sem dar ciência; abrir só com aviso explícito de que conta como ciência também na plataforma original. Nunca; cartão sempre, com aviso D-3 da ciência tácita | Abrir uma intimação equivale a dizer ao governo "fui avisado", e o prazo começa a correr; por isso o sistema só abre quando uma pessoa decide. |
| P5 | A primeira versão liga algum robô de navegador? | **Respondido (segue a hipótese; ver 13.6):** Não; o que seria robô fica como tarefa com lembrete; a fila de 8.3 entra por parecer e dor medida | Robô que entra em site do governo com a senha do contador é frágil e pode dar problema legal; começamos sem nenhum e ligamos um por vez, quando valer a pena. |
| P6 | Custos de API: repassar por consumo (Integra, InfoSimples) e embutir o resto no plano? | **Respondido:** ver 13.2: os custos entram na precificação modular do sistema, não em repasse avulso | Algumas consultas custam centavos por cliente; cobramos do escritório o que ele usou nessas e incluímos no plano o que é barato e previsível. |
| P7 | Open Finance só na fase 4, como serviço extra com repasse, e o MVP usa OFX? | **Respondido:** ver 13.3: Open Finance entra para conciliação na própria plataforma, cobrado do escritório à parte. Sim | Conectar bancos custa no mínimo R$ 2.500 por mês; por enquanto o cliente manda o extrato pelo app, e a conexão automática vira serviço vendido à parte quando houver volume. |
| P8 | A conta de cobrança (Asaas ou Efí) é do escritório, não da plataforma? | **Respondido (segue a hipótese; ver 13.6):** Sim; a plataforma integra pelo token do escritório | O dinheiro dos honorários entra direto na conta do escritório; a plataforma só gera e acompanha as cobranças. |
| P9 | Caixa postal federal: eventos de atualização (grátis) diários e lista paga só quando há mensagem nova ou uma vez por semana? | **Respondido (segue a hipótese; ver 13.6):** Sim | Há um jeito grátis de saber que chegou algo e um jeito pago de ver a lista; usamos o grátis todo dia e o pago só quando precisa. |
| P10 | Senhas de portal do contador ficam no cofre? | **Respondido:** segue (não na v1), mas o roadmap guarda os acessos no cofre, porque sem isso a autonomia some. Não na v1; a pessoa digita na hora, com o segundo fator dela | Guardar a senha pessoal do contador num sistema é um risco; é mais seguro ela digitar quando precisar. |
| P11 | Agente de pasta no computador do cliente (NFE-503) entra na v1? | **Respondido:** ver 13.4: sem agente de pasta e sem depender de e-mail; captura direto das prefeituras e do ADN, sem o cliente configurar nada. Não; sem agente de pasta; e-mail de XML só como complemento | Instalar um programinha no computador do cliente dá trabalho de suporte; o e-mail resolve a maior parte e vem primeiro. |
| P12 | Calendário conectado por usuário, opcional? | **Respondido:** sim, calendário pessoal opcional; e existe o calendário compartilhado de atividades de cada cliente (13.5). Sim; só eventos com pessoa de cliente viram candidato de tempo; título não vai ao modelo | Cada pessoa decide se liga a própria agenda; o sistema só olha quem participou da reunião para saber de qual cliente era, não o que estava escrito. |
| P13 | NFS-e dos honorários pelo Emissor Nacional (grátis) em vez do Asaas (R$ 0,49)? | **Respondido (segue a hipótese):** Sim, se o escritório for do Simples (obrigatório desde 01/11/2026) | O governo tem um emissor gratuito que os escritórios do Simples já são obrigados a usar; não faz sentido pagar por nota. |
| P14 | O teto de custo por conexão pausa execuções automáticas ao chegar a 100%? | **Respondido (segue a hipótese):** Sim; a partir daí só execuções manuais ou aprovadas | É um freio: se um escritório estourar o orçamento de consultas pagas no mês, o sistema para de gastar sozinho e pergunta antes de continuar. |

## 13. Decisões do aval (7/11/2026)

### 13.1 Caixa postal e ciência

Regra: **listar nunca dá ciência; abrir dá.** O conector usa só as chamadas de lista e indicador (assunto, data, remetente, se é intimação) para alimentar o painel e os integrantes. O Hubstrom faz o mesmo e avisa que abrir no sistema é abrir no e-CAC; aqui vale o mesmo aviso. Antes de abrir, a tela diz, em uma frase: "Abrir aqui conta como ciência no e-CAC (ou no DTE da UF); o prazo começa a correr hoje". O que não dá para fazer: ler o teor sem que o órgão registre a ciência, porque a ciência é do ato de consulta do teor, não da plataforma que consultou. Por isso o cartão de aviso 3 dias antes da ciência tácita continua, e o integrante nunca abre sozinho (C7).

### 13.2 Custos e precificação modular

Os custos por conector não viram repasse avulso: entram no **estudo de precificação por módulo**, que é um documento à parte, ainda a fazer: cada módulo (Painel, CRM, Timesheet, Time de agentes, Consultor, App, Conectores por grupo) com os custos de API, de modelo e de infraestrutura que carrega, para o sistema ser vendido de forma modular. A tabela de custos da seção 10 é a entrada desse estudo. Teto de custo por conexão (P14) continua como freio.

### 13.3 Open Finance e conciliação na plataforma

Decisão: a conciliação bancária **entra na plataforma** (hoje os cores fazem, a Domínio inclusive; aqui será tentada também), e o Open Finance é o conector para isso, **cobrado do escritório à parte**. Usos: conciliação dos clientes (lançamentos classificados pelos integrantes, com o core recebendo o resultado quando houver API), caixa do escritório (Financeiro) e a conciliação simplificada do app do cliente. Entra quando o módulo de conciliação for construído (fase 3), não como fase 4.

### 13.4 Captura de notas sem o cliente configurar nada

Objetivo: **o cliente do escritório não precisa dar nem configurar nada.** O agente de pasta no computador do cliente sai do desenho, e o e-mail de XML deixa de ser caminho principal (fica como complemento opcional). A captura é feita pelos caminhos que SIEG e Hubstrom usam (pesquisa B5): ADN da NFS-e Nacional com procuração e certificado do escritório (P3, prova de conceito), web services estaduais para contabilistas (RS, SC), autXML para as saídas, portais municipais fora do padrão nacional pelo conector com credencial do escritório, e, como opção de nível B, um fornecedor de captura (SIEG, Arquivei) por API enquanto o conector próprio de um município não existir. O A1 do cliente fica só para o que nenhum desses caminhos cobre (entradas de NF-e em UFs sem web service), pedido pelo app uma única vez.

### 13.5 Calendários

Dois calendários distintos: o **pessoal**, conectado por usuário e opcional, de onde só o vínculo com o cliente é usado; e o **calendário compartilhado de atividades de cada cliente** (tarefas, obrigações, reuniões), que é o da Home do Painel filtrado pelo cliente e aparece também ao cliente no app, na Agenda. O segundo não depende de conector; é dado da plataforma.

### 13.6 Perguntas reformuladas (seguem a hipótese, 7/11/2026)

**P2, em outras palavras.** Para ler as mensagens do DTE estadual (SP, MG, PR) sem robô, usamos um fornecedor pago, a InfoSimples, que faz a consulta por nós. Só que a consulta exige o certificado A1 do cliente, e isso significa **entregar o certificado do cliente a uma empresa terceira**. A proposta é fazer isso só com o cliente aceitando no termo do app e com o fornecedor assinando contrato de proteção de dados; se não, o DTE daquele cliente é lido manualmente pelo contador. Hipótese: sim, com termo.

**P5, em outras palavras.** Um robô de navegador é um programa que entra num site do governo com a senha do contador e clica como uma pessoa. É frágil (quebra quando o site muda), arriscado (a senha é pessoal) e pode ser bloqueado. A proposta é **não ligar nenhum robô autônomo na primeira versão**: cada robô só entra quando houver parecer de que não há API e dor medida no timesheet. Hipótese: nenhum na v1.

**P8, em outras palavras.** Para cobrar honorários por boleto e Pix, a plataforma integra com um provedor de cobrança (Asaas ou similar). A dúvida é de quem é a conta no provedor: do escritório (o dinheiro entra direto na conta dele e a plataforma só integra) ou da plataforma (o dinheiro passa por nós e repassamos). Hipótese: a conta é do escritório.

**P9, em outras palavras.** A caixa postal do e-CAC tem duas chamadas no Integra Contador: uma grátis que só diz "há mensagem nova?" e uma paga que lista as mensagens. A proposta é rodar a grátis todo dia e só pagar a lista quando a grátis acusar novidade (ou uma vez por semana). Hipótese: sim.

### 13.7 Cobrança ligada ao banco do escritório (decisão de 7/11/2026)

O usuário observou que o Conexa gera boleto e Pix vinculados diretamente a bancos (Inter, Itaú e outros) e pediu o mesmo funcionamento. O que a pesquisa deste dia confirmou e o que não confirmou: o Conexa gera boleto, Pix e cobrança por cartão, e um depoimento cita a integração com o Banco Inter; **a lista de bancos do Conexa não foi confirmada** (a lista Inter, Itaú, Bradesco, Santander, Banco do Brasil, Sicoob e Sicredi aparece em outro produto, o Intopays). O desenho segue a intenção do usuário, não a lista do concorrente:

- O escritório escolhe **o banco onde já tem convênio de cobrança** e conecta (credenciais e certificado no cofre); os boletos e Pix saem pela conta dele, com a tarifa que ele já paga ao banco.
- A plataforma mantém uma **tabela de bancos suportados**, versionada, com o tipo de integração de cada um (API Pix, API de boleto, CNAB), o que pede de credencial e a situação (ativo, em teste, planejado). Começa pelos bancos mais usados pelos escritórios do grupo e cresce por demanda.
- **Onde não houver API de boleto**, o caminho é CNAB de remessa e retorno: o sistema gera o arquivo e lê o retorno (por pasta, por upload ou pela API de arquivos do banco). Perde a baixa em tempo real, mas funciona em qualquer banco.
- **Pix** é o ponto mais fácil: a API Pix é padronizada pelo Banco Central, então um conector serve para quase todos os bancos, mudando só a autenticação.
- Asaas e Efí ficam como a opção para o escritório sem convênio bancário.
- Para o escritório que muda de banco ou de provedor, vale a regra do FIN-604: cobranças antigas terminam onde nasceram, só as novas nascem no novo.

**Resultado da pesquisa dos bancos (7/11/2026, [S4](../pesquisa/plataforma/S4-apis-de-cobranca-dos-bancos.md)):**

- Inter, Itaú (Pix e Bolecode), Bradesco, Santander, Banco do Brasil, Sicoob (só boleto) e Sicredi têm API de cobrança que o **correntista gera e cola no software de terceiro, sem a plataforma ser parceira homologada**: é o modelo que a Omie e o Conexa já usam. Caixa só por CNAB; Nubank PJ não tem API pública de cobrança.
- Do Conexa, o que é público: Inter (boleto e Pix), Efí (boleto e Pix) e C6 (boleto, via TecnoSpeed). Quantos bancos ele suporta no total não é público.
- **Primeiros bancos:** Inter (autoatendimento total, sandbox, mTLS, validado pelo Conexa), Sicoob, Sicredi, Banco do Brasil e Itaú ou Bradesco, na ordem a confirmar com os escritórios do grupo.
- **Segundo caminho:** um agregador (Kobana ou TecnoSpeed) para os demais, em vez de homologar banco a banco. Custo extra por cima do banco, preço não público.
- **Cuidados:** certificado mTLS e secret ficam no cofre por escritório, com alerta de vencimento (Inter: 1 ano); as tarifas de cada banco dependem do convênio, então a plataforma só mostra o que o escritório informar; webhook de Bradesco, Santander e Sicredi e algumas tarifas são **[a confirmar]**; os portais oficiais de alguns bancos não abriram, e a evidência veio das centrais de ajuda da Omie e do Conexa.


## 14. Adendo: ajustes pendentes do subplano 09 (aplicados em 8/11/2026)

O pedido A15 do 09 (13.2) já está no corpo (7.4 a 7.6, 10.3, 13.7); faltavam três pontos, aplicados: a abstração `cobranca.*` ganha `pix_automatico.status` ao lado de `pix_automatico.autorizar`; as contas a pagar do escritório (FIN-003) capturam **DDA pelo agregador** (Kobana ou TecnoSpeed, segundo caminho de 13.7) além do e-mail; o leiaute de **cancelamento e substituição da NFS-e** segue `[a confirmar]` por município.

## 15. Adendo: ajustes recebidos do subplano 10 (8/11/2026)

Aceitos; detalhe em [10-BPO.md](10-BPO.md), seções 3.0, 8 e 11.2 (A12, A16 e A21).

- **Família `erp_financeiro`** no catálogo de conectores (Conta Azul, Omie, Nibo, Granatum, Bling): modos **E1** (API com leitura e, onde permitido, escrita), **E2** (arquivo: OFX, CSV, planilha, CNAB) e **E3** (livro próprio, sem conector). Ferramentas `erp.ler`, `erp.lancar`, `erp.baixar` (nível executar, evento e trilha); credencial OAuth ou chave do cliente no cofre do escritório (por titular empresa), com o menor escopo possível; espelho de leitura com `origem = erp:<provedor>` e `versao_origem`, sincronização incremental conferida todo dia; **o ERP vence** em conflito.
- **Catálogo de ERPs financeiros** (10, 8.3), com limites de chamadas por conta, **consulta periódica onde não há webhook** (a Conta Azul não tem), janela de sincronização e **condições de parceiro `[a confirmar]`** (tudo vem de resumos de busca; confirmar antes de construir o conector). O cliente paga o próprio ERP.
- **`banco.pagamento.*`** (pagamento por API do banco da empresa, `[a confirmar]`; descobrir quais bancos têm API de pagamento para terceiros); **subconta de cobrança** em provedor, em nome do cliente do cliente (`[a confirmar]`); **uma contratação de Open Finance** serve aos dois titulares, e a conta conectada conta uma vez.
- Credencial do ERP e de banco da empresa ficam no cofre do escritório (por titular empresa), com `escopo_credencial`; a procuração do governo **não passa ao BPO**.

## Adendo: itens do painel do Leandro aprovados (9/11/2026)

Decididos na [Lista de decisão do painel do Leandro](../Lista_de_Decisao_Painel_do_Leandro.md) (de acordo com o Enzo). **Regra:** entram **agentificados**, como integrantes do time que agem por gatilho, perguntam só a dúvida, preparam no cartão de aprovação e aprendem com a decisão da equipe; não como cópia das rotinas e telas do painel dele. Nada sai ao cliente sem aprovação humana no início. Detalhes de cada item ("Como fica agentificado") estão na lista.

| Itens | O que entra |
| --- | --- |
| D-11, D-18, D-37, D-38 | Leitor de extratos como peça comum (também usado pelo BPO); conector de e-mail devolvido (depois); Acessórias como fonte viva só de consulta, se o piloto a mantiver (depois); saúde das rotinas em Configurações › Conectores. |
| D-01, D-10, D-35 | Aviso de pasta fora do padrão e Raio-X na trilha de conexão do Drive; regra de não comentar débito de certidão. |

## Adendo: itens do segundo escritório aprovados (14/11/2026)

Decididos no [cruzamento com o segundo escritório](../Cruzamento_Levantamento_Segundo_Escritorio.md). Entram **agentificados**, como os itens do Leandro. O nome do setor continua **Societário**.

| Item | Quando | Onde entra | Integrante |
| --- | --- | --- | --- |
| C2-01 Kit de rescisão | Agora | 03, 6.5 (Rescisão); 02, 3.2 (DP); 08 (FGTS Digital e Empregador Web, robô com certificado) | DP |
| C2-03 Boletos de sindicato, convênio e seguro de vida | Agora | 03, 6.5 (Guias, holerites, pagamento); 02, 3.2 (gatilho do dia 25); 08 (robô de portal, depois) | DP |
| C2-08 E-mail enviado vira registro sozinho | Agora | 08 (conector de e-mail, pasta de enviados); 04; 01, 7 (pasta do cliente) (ampliado: lê tudo, entrada e enviados, com anexos) | Gestão e Atendimento |
