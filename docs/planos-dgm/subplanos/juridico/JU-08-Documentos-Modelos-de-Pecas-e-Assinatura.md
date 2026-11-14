# Subplano JU-08 · Documentos, modelos de peças, assinatura e procuração digital (pacote Jurídico)

**Versão 0.1 · 9/11/2026 · desenho; nada é desenvolvido agora (o BPO fecha antes).** Pacote de área sobre a plataforma comum (DA-02, DA-02.1). Fontes: [Conferência](../../Conferencia_Pacote_Juridico.md) (lacuna "documentos, modelos, assinatura e procuração"), [Síntese](../../Sintese_Pacote_Juridico.md), [JU-01](JU-01-Modelo-de-Dados-e-Catalogo.md) (Peça, Mandato, sigilo), [JU-03](JU-03-Prazos-Comunicacoes-e-Conectores.md) (seção 5), [JU-04](JU-04-Motor-Juridico-e-Base-de-Leis.md), [JU-05](JU-05-Honorarios-Financeiro-e-Preco.md), [Fundações](../01-Fundacoes.md) (documentos, backends, pasta visível), [App do cliente (06)](../06-App-do-Cliente.md) e as pesquisas J3 e J4. Valem as convenções das Fundações (identificadores opacos, datas com fuso, dinheiro em centavos, **nada se apaga**, versões com `vigente_de` e `vigente_ate`) e as **regras unificadas de 9/11/2026** (sócio não entra sozinho em Caso restrito; só advogado inscrito confirma prazo fatal e dá ciência; *Contrato* é a entidade do consultivo e *Contrato de honorários* é do JU-05; antes de casos reais, parecer de advogado e modo sombra). Nomes fixos: Processo, Parte, Prazo, Comunicação, Andamento, Audiência, Mandato, Peça, Caso, Honorário-Jurídico, Contrato. **[a confirmar]** marca o que as fontes não verificaram; **nenhum texto de lei foi relido no original nesta rodada**.

**Resumo para quem não é advogado.**

- **Peça** é o documento que o advogado escreve para o processo (petição, contestação, recurso, parecer). **Modelo** é a peça "de gaveta", com lacunas.
- **Procuração** é o papel pelo qual o cliente autoriza o advogado a atuar; o nome técnico é **Mandato**. Há poderes comuns e **poderes especiais** (receber dinheiro, fazer acordo, desistir), que precisam estar escritos. **Substabelecer** é passar o poder a outro advogado.
- **Assinatura eletrônica** tem três níveis na Lei 14.063/2020: **simples** (pouca prova), **avançada** (ligada só àquela pessoa, com trilha, como o gov.br e os provedores comerciais) e **qualificada** (certificado **ICP-Brasil**, o de maior valor). O certificado do advogado, emitido pela OAB, é o **A3** (token ou nuvem).
- **Autos** são os documentos do processo. **OCR** é a leitura por máquina de páginas escaneadas, para pesquisar o texto.
- O sistema **prepara**; o advogado **revisa, assina e protocola**. A plataforma nunca guarda o A3.

---

## 1. Escopo e princípios

**Dentro:** biblioteca de modelos (seção 2); geração da Peça com o motor do JU-04 e bloqueio por citação não verificada (3); revisão, versões e trilha (4); documentos do Caso, OCR, sigilo e pasta visível (5); assinatura e procuração digital (6); poderes, substabelecimento, validade e revogação do Mandato (7); custo do provedor de assinatura (8); A3 e entrega ao peticionamento assistido (9); permissões (11).

**Fora (só registrado, seção 10):** contratos do consultivo mais complexos. Também fora: protocolar, guardar o A3, procuração em cartório, editor de texto próprio. Campos de Processo, Prazo e Mandato são do JU-01; telas, do JU-02; motor e leis, do JU-04; honorários e preço, do JU-05 e do JU-12.

| # | Princípio | Consequência |
| --- | --- | --- |
| D1 | **Peça é rascunho até revisão assinada por advogado** (JU-01 JR5; JU-04 R-J6) | A aprovação fica presa à versão exata (hash) |
| D2 | **Citação não verificada trava a Peça** | Sem `revisada` até o advogado remover ou conferir à mão, com a fonte anexada |
| D3 | **Número só do motor:** prazo do JU-03, valores de `calculo.*`; a IA nunca conta (JU-04 R-J4) | Sem origem, aparece **[preencher]** |
| D4 | **Fato só com origem:** Caso, autos (documento e página) ou "informado pelo advogado" (JU-04 6.1) | O índice dos autos (5.4) existe para isso |
| D5 | **Nada de Caso sobe:** modelo, peça e documento do escritório são classe E, fora de treino, benchmark e cache globais (JU-04 R-J5) | Modelo da plataforma é classe P e só desce |
| D6 | **O sigilo por Caso cobre o documento inteiro:** arquivo, texto de OCR, índice de busca, versões e relatório de assinatura (JU-01 6.2) | Busca e IA respeitam o compartimento antes de devolver |
| D7 | **Ato privativo é da pessoa:** aprovar para protocolo, assinar a petição, protocolar, substabelecer (JU-01 JR1) | O integrante prepara |
| D8 | **A plataforma não guarda o A3** (JU-03 4.6, 7.1) | Só a validade informada |
| D9 | **O nível de assinatura é escolha do advogado, com a prova guardada**, porque os tribunais divergem (6.4) | Padrão conservador, tabela de aceite e alerta |
| D10 | **Cópia própria da prova:** arquivo assinado e relatório ficam no índice do escritório | Trocar de provedor não perde a prova |
| D11 | **O modelo da plataforma nunca muda em silêncio** | Versão nova é oferecida; o escritório decide |

---

## 2. Biblioteca de modelos de peças

### 2.1 Três origens

| Origem | Quem escreve | Quem vê | Classe | Observação |
| --- | --- | --- | --- | --- |
| **Pessoal** | O usuário | Só ele, até "publicar" | E | Ensaio antes de virar modelo do escritório |
| **Do escritório** | Advogado com permissão de curadoria | O escritório | E | É o banco de peças que o escritório já tem (JUR-221) |
| **Da plataforma** | Advogados do grupo sob contrato, com cessão de direitos (JU-04 6.5): hoje a advogada da família; especialistas no lançamento | Escritórios com o módulo da área ativo | P | Começa por poucos **tipos de peça cobertos** |

Regras:

1. **Cópia, não edição.** O escritório copia o modelo da plataforma e edita a cópia. Versão nova do original aparece com a diferença visível, e o escritório decide adotar (D11).
2. **Modelo de escritório nunca sobe** (D5). A única fonte de modelos globais é o grupo contratado.
3. **Modelo não tem dado de cliente.** Ao importar um Word do escritório, o sistema marca CPF, CNPJ, nomes e números de processo para trocar por variável; sem a limpeza, o modelo não é publicado.
4. **Peça de Caso vira modelo só por ato do advogado**, com a mesma limpeza. Peça de Caso restrito não entra no banco geral (a memória do escritório recusa fato identificável de Caso, JU-04 A7).
5. **Fora dos tipos cobertos a IA recusa, mas o modelo funciona** (3.2).

### 2.2 Entidade nova: Modelo de peça

| Campo | Descrição |
| --- | --- |
| `origem`, `dono`, `nome`, `tipo_de_peca` | Pessoal, escritório ou plataforma; tipo da lista do JU-04 (inicial, contestação, réplica, recurso, parecer, notificação) |
| `area_direito`, `modulo_de_lei`, `ramo`, `rito`, `grau` | O módulo exigido para a IA redigir |
| `arquivo_modelo_id` | DOCX com campos marcados e papel timbrado **[a confirmar o formato técnico]** |
| `estrutura`, `variaveis` | Blocos (2.3) e campos (2.4) |
| `versao`, `vigente_de/ate`, `estado` | `rascunho`, `publicado`, `substituido`, `retirado` |
| `responsavel_id`, `fonte_juridica` | Advogado que responde (JUR-163); normas e súmulas com data de conferência |
| `checklist_id` | Checklist pré-protocolo do tipo (JUR-219) |

### 2.3 Blocos e variáveis do Caso

Um modelo combina quatro blocos: **texto fixo**; **campo** (variável); **cláusula** da biblioteca (obrigatória, opcional ou alternativa); **área de redação** (fatos, direito, pedidos), com instruções do modelo que o motor segue ("fatos em ordem cronológica, cada um com a página dos autos"). O escritório controla o estilo sem escrever instruções de IA.

| Família de variável | Origem | Se faltar |
| --- | --- | --- |
| Cliente e qualificação (nome, CPF ou CNPJ, estado civil, profissão, endereço, representante) | Cliente e perfil jurídico (JU-01 3.1) | **[preencher]**; lista de qualificação **[a confirmar com a advogada]** |
| Caso e Processo (número CNJ, vara, valor da causa, `data_do_fato`) | Caso, Processo | Idem |
| Partes | Parte (JU-01 4.2) | Nome e documento vêm da Parte; a qualificação completa da contrária é **digitada na peça e fica só no documento**, sem virar cadastro |
| Advogado e sociedade (nome, OAB, endereço) | Perfil jurídico do usuário | **[preencher]** |
| Prazo | Prazo (JU-03), nunca a IA | "(prazo não conferido)" |
| Valores, custas, juros | `calculo.*` com memória | **[preencher]**, nunca número escrito pelo modelo |
| Poderes | Mandato (seção 7) | Aviso de poder faltante |

Cada variável guarda **origem e data**. Se o dado mudar depois, o rascunho avisa; **peça aprovada não muda sozinha**.

### 2.4 Versionamento

- **Versão publicada é imutável.** Editar cria versão nova; a antiga vira `substituido` e continua visível, porque Peças apontam para ela (`modelo_versao_id`).
- Peça em rascunho não é atualizada à força: recebe o aviso "o modelo mudou", com a diferença.
- Publicar modelo do escritório exige curadoria (seção 11); estagiário e secretária propõem.
- Sem responsável, o modelo não é publicado; ele recebe os alertas de revisão (2.5).

### 2.5 Cláusulas reutilizáveis

Entidade nova, **Cláusula**: título, categoria (honorários, êxito, retenção, foro, confidencialidade, LGPD, rescisão, poderes), texto com variáveis, uso (obrigatória, opcional, alternativa em grupo, como "honorário fixo" ou "de êxito"), versão, responsável e fonte jurídica.

- Serve ao Contrato de honorários (conteúdo e cobrança no JU-05), à procuração, ao termo de IA, a notificações e a trechos repetidos de peças.
- **Alerta de desatualização** (JUR-163): se o módulo de lei ativo registra mudança numa norma da `fonte_juridica`, o responsável recebe tarefa de revisão, **sem alterar nada sozinho** (vigilância do JU-04).
- As cláusulas obrigatórias do Contrato de honorários (CED art. 48 e Estatuto, art. 22, segundo J3 **[a confirmar texto e numeração]**) formam grupo obrigatório; a lista final é do JU-05.
- A biblioteca também serve a contratos simples do consultivo (seção 10).

### 2.6 Onde o advogado edita

**Hipótese (pergunta 11):** modelo e Peça são DOCX na pasta do Caso, no backend do escritório (nuvem da plataforma, Drive, OneDrive, S3, WebDAV ou SFTP; Fundações 7.1). O advogado edita **no Word ou na nuvem**; ao mudar o arquivo (hash novo, mesmo `id_externo_backend`), a plataforma cria **versão da Peça** (Fundações 7.4). A autoria de versão feita fora fica "a confirmar", como no fluxo "confirmar origem". Editor próprio fica para depois **[a confirmar]**.

---

## 3. Gerar a Peça a partir do Caso

### 3.1 O fluxo

| Passo | Quem | O que acontece |
| --- | --- | --- |
| 1. Pedir | Advogado, estagiário ou integrante, pelo Caso, Prazo ou tarefa (JUR-045) | Escolhe tipo e modelo; o sistema sugere pelo ato que gerou o Prazo |
| 2. Pré-condições | Regra | Confere os bloqueios de 3.3 antes de gastar IA |
| 3. Variáveis | Regra, **sem IA** | Preenche os campos e marca **[preencher]** onde falta |
| 4. Fatos | Advogado e agente | Fatos em ordem, **cada um com origem** (D4) |
| 5. Minuta | Agente (JU-04, "Minuta de peça") | Redige as áreas de redação no módulo ativo, seguindo as instruções do modelo |
| 6. Números | Código | Prazo do JU-03; valores e custas de `calculo.*` |
| 7. Verificação | Motor (JU-04 6.1) | Cada citação: existe; órgão, número e data conferem; vigente e não superada; hierarquia; sustenta a tese; fatos comparáveis |
| 8. Bloqueio ou liberação | Regra | Citação pendente impede `revisada` (3.4) |
| 9. Revisão | Advogado | Seção 4 |

A IA só atua nos passos 4 e 5. O plano de IA decide **se** a Minuta existe (a partir do IA Operação, JU-04 7.3); a **conferência de citações vale em todos os planos, fora da franquia** (decisão de 9/11/2026).

### 3.2 Três modos

| Modo | O que faz | Quando |
| --- | --- | --- |
| **Só preencher** | Variáveis e cláusulas, sem texto de IA | Qualquer plano; procuração, termo, notificação, peça de praxe |
| **Minuta com IA** | Preenche e redige | Tipo coberto, módulo ativo, `ia_permitida`, plano com Minuta |
| **Em branco com apoio** | O advogado escreve; o sistema verifica citações e variáveis a cada versão | Tipo fora da lista; preferência do advogado |

A verificação roda em **toda versão**, inclusive nas escritas à mão: citação digitada pelo advogado também é conferida. Protege do erro mais noticiado, a jurisprudência inventada, com multas e ofícios à OAB (fonte secundária, J5 **[a confirmar]**).

### 3.3 Bloqueios antes de gerar

| Condição | Efeito |
| --- | --- |
| Caso em `aguardando_conflito` ou `aguardando_contrato` | Sem Peça nem documento até a decisão do sócio (JU-01 3.2) |
| `ia_permitida = falso` (cliente recusou o termo, ou segredo de justiça com IA desligada) | Só "só preencher" e "em branco"; o agente não lê o Caso |
| Módulo da área inativo ou tipo não coberto | Minuta recusada com explicação (abstenção tipada, JU-04 2.7) |
| Mandato ausente, vencido ou sem o poder exigido | Aviso forte; `pronta_para_protocolo` só com decisão do advogado (7.2) |
| Prazo fatal vencido | Alerta urgente; justa causa é do JU-03 |

### 3.4 Bloqueio por citação não verificada

**Regra:** a Peça **não passa a `revisada`** com citação fora de "verificada" ou "conferida à mão". O rascunho segue editável e exportável ao Word **com marca de rascunho e cada citação pendente marcada no texto**; trava só a passagem a `revisada`, `pronta_para_protocolo` e o pacote de protocolo.

| Estado da citação | Significado | Efeito |
| --- | --- | --- |
| **Verificada** | Passou nas camadas, com datas, estado e força do precedente | Libera |
| **Não verificada** | Falhou, ou a base não cobre (módulo inativo, tribunal sem cobertura) | **Trava** |
| **Removida** | Citação central removida vira abstenção; as periféricas somem e o sistema diz **quantas** (modelo do SGJur, J7) | Libera, com contagem |
| **Conferida à mão** | O advogado anexou a fonte e registrou "conferi" | Libera, marcada como **responsabilidade do advogado**, com autor, data e anexo |

**Não há botão "ignorar".** O caminho "conferida à mão" existe porque a base nunca cobre tudo (pergunta 3) e a responsabilidade final é do advogado (JU-01 JR6). Peça **crítica** (contestação, recursos, tutela de urgência, prazo fatal) segue ainda a segunda opinião do JU-04 (4.4).

---

## 4. Revisão, aprovação, versões e trilha

### 4.1 Estados e quem os muda

Estados do JU-01 (4.8): `rascunho` → `em_revisao` → `revisada` → `pronta_para_protocolo` → `protocolada` → `comprovada`; lados `devolvida` e `cancelada`. (O JU-03 usa `pronta_para_conferir`; adoto o nome do JU-01 e peço o acerto, 12.1.)

| Transição | Quem | Condição |
| --- | --- | --- |
| `rascunho` → `em_revisao` | Autor | Sem **[preencher]**; citações verificadas |
| `em_revisao` → `revisada` | Advogado inscrito | Checklist completo; registro de leitura integral; nenhuma citação pendente |
| `revisada` → `pronta_para_protocolo` | Advogado (ato) | Mandato com poderes; preparo calculado; pacote montado; segunda conferência em peça fatal com dois ou mais advogados (JU-04 4.4) |
| `pronta_para_protocolo` → `protocolada` | **Advogado**, registrando o ato feito fora | Irreversível |
| `protocolada` → `comprovada` | Advogado ou quem ele indicar, com o recibo | Comparação com o fatal (JU-03 2.6) |
| qualquer → `devolvida` | Revisor | Motivo; volta a `rascunho` |

**A aprovação fica presa à versão.** Mudou o arquivo depois de `revisada` (hash novo), a Peça **volta a `em_revisao`**; a revisão anterior fica no histórico.

### 4.2 Checklist pré-protocolo (JUR-219)

| Item | Quem verifica |
| --- | --- |
| Citações verificadas ou conferidas à mão; fatos com origem | Regra |
| Variáveis sem **[preencher]**; nomes, número CNJ e vara conferem com o Caso | Regra |
| Protocolo dentro da data interna e do fatal | Regra (JU-03) |
| Mandato com os poderes que a peça exige | Regra; o advogado decide na dúvida |
| Preparo, custas e depósito recursal pagos, quando couber (JUR-075; JU-01 4.9) | Regra; guia anexada pela pessoa |
| Anexos obrigatórios, ordenados e no limite de tamanho do tribunal **[a confirmar por tribunal]** | Regra |
| Pedidos coerentes; estratégia; **peça lida por inteiro** | **Advogado** |

O que cada **tipo de peça** exige (requisitos formais da inicial, por exemplo) vem do modelo da plataforma validado por advogado; o texto legal de cada requisito é **[a confirmar]**.

### 4.3 Versões e trilha

Cada versão registra: `documento_id`, hash, autor (pessoa, integrante ou modelo), `gerada_com_ia`, agente e versão do motor, citações e estados. **Nenhum prompt é guardado** (JU-04 5.4); guarda-se quem pediu, fontes e quem revisou (JUR-234; Recomendação CFOAB 001/2024).

- A **comparação entre versões** mostra o que o advogado mudou na minuta da IA. É classe E: **fica no escritório** e não alimenta aprendizado global (JU-01 6.4).
- Versão feita fora da plataforma entra por hash, "autor a confirmar". Nenhuma versão é apagada.
- **Supervisão:** o sócio responde pela supervisão de associados e estagiários (OAB/SP, Conferência **[a confirmar]**) e vê a **fila de supervisão** (peças aguardando revisão, com a idade). Estagiário rascunha; não aprova. Um relatório por Peça (autoria, IA, fontes, revisor) permite ao escritório prestar contas ao cliente ou à OAB.
- **Advogado sozinho:** pode redigir e revisar, com registro de leitura integral e checklist, e a recontagem independente do prazo (regra unificada 2).

---

## 5. Documentos do Caso

### 5.1 O que entra e de onde

O documento do Caso é o **Documento do índice único** (Fundações 4.11), com `caso_id` e `compartimento_id`; os bytes moram no backend do escritório.

| Origem | Como entra | Cuidado |
| --- | --- | --- |
| Equipe, e-mail, WhatsApp, app do cliente | `documento.registrar`, classificação sugerida; duplicata religada pelo hash | O enviado pelo cliente fica visível a ele (06 5.1) |
| **Autos** | **A pessoa** baixa no tribunal e sobe o PDF, ou compra sob demanda de fornecedor com cartão de custo (JU-03 4.7) | **Nunca robô logado como advogado** (JU-03 4.6) |
| Teor de Comunicação, recibo, memória de cálculo, ato do calendário | Conectores e motor do JU-03 | Herdam o sigilo |
| Peças, versões, procuração, contrato, termo, relatório de assinatura | Gerados aqui | Seções 3, 4 e 6 |
| Arquivo posto direto na nuvem | Varredura; "confirmar origem" (Fundações 7.4) | Visibilidade depende da pasta |

Tipos novos de Documento (enum extensível): `autos`, `peca_versao`, `anexo_de_peca`, `prova`, `procuracao`, `substabelecimento`, `termo_ia`, `relatorio_assinatura`, `guia_custas`, `modelo`, `contrato`, mais os do JU-03 (`comprovante_protocolo`, `memoria_calculo`, `ato_calendario`, `teor_comunicacao`).

### 5.2 Árvore por Caso e pasta visível

A árvore das Fundações (cliente, ano, competência) serve ao contábil, recorrente; o Caso tem começo e fim. Hipótese:

```
<raiz>/<cliente: CPF ou CNPJ - Nome>/<Caso: nº interno - título>/
    01 Mandato e contrato · 02 Autos (um por Processo) · 03 Peças
    04 Provas e anexos · 05 Comunicações e andamentos · 06 Custas e guias
    Entregáveis/Jurídico   (única pasta visível ao cliente por padrão)
```

A plataforma **nunca renomeia pastas existentes**; quem já tem árvore usa o mapeamento das Fundações (7.3). Importar acervo antigo é do JU-11. Valem as regras de pasta visível (Fundações 7.8; 06 5.1): a marca é na pasta, herdada, forçável por arquivo com registro, e o papel do cliente é segundo filtro. No pacote:

- **Rascunho nunca vai à pasta visível.** A Peça só é copiada depois de `protocolada` e da **liberação do advogado**, com cartão (JU-04 4.4).
- Procuração e contrato assinados vão a `Entregáveis/Jurídico` por decisão do advogado no cartão **[a confirmar com a advogada]**.
- Caso restrito controla **a equipe**, não o titular: o cliente vê a pasta visível dele.
- O comprovante de entrega (visto, baixado, hash; Fundações 7.7) vale aqui. **Link externo** (06 5.4) fica desligado por padrão em Caso restrito e segredo de justiça.

### 5.3 OCR e índice dos autos

**OCR.** Autos costumam ser PDFs de imagem. A plataforma lê por máquina e guarda o texto como camada de busca, sem alterar o original. Cada página recebe marca de qualidade; texto fraco aparece "lido por máquina, pode ter erro" e **nunca vira fato sem origem conferida** (D4). Manuscrito não se promete. Quem processa é **operador com contrato** (LGPD) ou componente próprio; em Caso restrito e segredo de justiça, o OCR roda **só por ordem do advogado**, com operador declarado **[a confirmar com o JU-10]**. OCR não é IA generativa, mas lê o mesmo conteúdo. Custo e tempo **[a medir]** (8.3).

**Índice dos autos** (entidade nova, por Processo): lista de peças processuais com tipo (inicial, contestação, decisão, sentença, ata, laudo, procuração, recibo), data, evento ou folhas e páginas no PDF. Preenchimento: (1) sumário nativo do sistema do tribunal, quando houver **[a confirmar por sistema]**; (2) sem sumário, o agente propõe a divisão por título e data e **a pessoa confirma**; (3) correção é versão. Serve para **citar folhas**, ligar cada fato da minuta à página (D4) e alimentar o resumo de autos do JU-04. O resumo de 300 páginas consome 25 a 40 UU (JU-04 7.1); por isso OCR e índice por regra vêm **antes** da IA.

**Preparar para protocolo.** O pacote do JU-03 precisa de PDFs no limite de tamanho, ordenados e com nomes aceitos. A plataforma oferece dividir, reduzir imagens, ordenar, juntar e renomear por regra; limites por tribunal **[a confirmar]**.

### 5.4 Sigilo por Caso e onde ficam os bytes

O compartimento (JU-01 6.2) cobre documento, texto de OCR, índice, versões, conversas ligadas e relatório de assinatura: usuário de fora **não vê nem encontra**, e a IA não lê.

**Limite real:** os bytes moram no backend do escritório. Se o Caso restrito está no Drive dele, a permissão da pasta é do Drive, e a plataforma não impede quem tem acesso ao Drive de abrir o arquivo. **Hipótese (pergunta 9):** Caso restrito e segredo de justiça **recomendam o backend da plataforma** (ou S3, WebDAV ou SFTP controlado), com aviso na tela de restrição; se o escritório insistir no Drive, a plataforma avisa e registra que a proteção dos bytes depende da nuvem dele; o parecer de ética e LGPD diz se isso é aceitável **[a confirmar]**. **Segredo de justiça** sinaliza o Processo, restringe por padrão e desliga a IA no conteúdo, salvo decisão do advogado (JU-04, pergunta 5).

### 5.5 Retenção, hash e saída

SHA-256 na entrada, conferido em toda leitura (Fundações 7.7). Retenção do documento e da trilha **enquanto durar o Caso e o prazo de guarda** (`prazo_guarda_ate`, JUR-029, LGPD art. 16 **[a confirmar prazo]**), depois descarte com cartão do advogado. Cota e preço do backend da plataforma: Fundações 7.6 e JU-12. Saída do escritório: exportação com índice, versões e relatórios de assinatura, e aviso ao cliente do app (06 12.6).

---

## 6. Assinatura eletrônica e procuração digital

### 6.1 Os três níveis (Lei 14.063/2020)

| Nível | Em linguagem simples | Prova | Meio |
| --- | --- | --- | --- |
| **Simples** | Identifica quem assinou; sem garantia de que é quem diz | Baixa | Clique com login (a "ciência" do 06 5.5) |
| **Avançada** | Ligada só àquela pessoa, sob controle dela, detecta alteração do documento | Média a alta, conforme a trilha | gov.br (em regra avançada, J4); ZapSign, Clicksign, D4Sign com biometria |
| **Qualificada** | Certificado **ICP-Brasil** (e-CPF, e-CNPJ, A3 da OAB) | A maior | Assinador do tribunal; assinador do provedor com o certificado do próprio signatário |

O alcance da lei em **processo judicial** e entre particulares é **[a confirmar no texto oficial e com a advogada]**; o desenho segue J3 e J4.

### 6.2 Nível padrão por documento

| Documento | Quem assina | Nível padrão | Observação |
| --- | --- | --- | --- |
| **Contrato de honorários** | Cliente e advogado ou sociedade | **Avançada** | Minuta e ciclo no JU-05 |
| **Procuração ad judicia**, poderes gerais | Cliente ou representante | **Avançada** | Sujeita à tabela de aceite (6.4) |
| **Procuração com poderes especiais sensíveis** (receber e quitar, transigir, desistir, renunciar) | Cliente | **Avançada reforçada ou qualificada**, escolha do advogado, registrada | Lista de "atos sensíveis" **[a confirmar com a advogada]** |
| Procuração administrativa (INSS etc.) | Cliente | Avançada | O que o órgão aceita **[a confirmar]** |
| **Substabelecimento** | Advogado | **Qualificada**, A3 fora da plataforma | Só pessoa (JU-02 4.5) |
| Termo de ciência de IA; declaração de hipossuficiência | Cliente | Avançada, no mesmo envio da procuração | Rec. CFOAB 001/2024; JUR-016 |
| Renúncia e revogação | Advogado e cliente | Avançada ou notificação rastreável | 7.4 |
| Ciência de documento (recibo de entrega) | Cliente | **Simples** | 06 5.5 |
| **Petição e recurso** | Advogado | **Qualificada, no protocolo, pelo assinador do tribunal** | Fora da plataforma (seção 9) |

**Ciência simples não vale para o Mandato:** um clique com login no app não substitui a procuração.

### 6.3 O fluxo da procuração digital

```
1. Conflito decidido (o CRM exige antes de lead.fechar_contrato; JU-01 8.1).
2. Kit de entrada: o sistema monta, dos modelos, o Contrato de honorários (JU-05), a procuração com
   os poderes do Caso, o termo de ciência de IA e, se couber, a declaração de hipossuficiência.
3. O advogado confere o kit (cartão "preparar"; a IA não aconselha o cliente sobre valor ou risco).
4. Envio único pelo provedor, por link no app ou WhatsApp, com cartão de aprovação (JU-02 4.5).
5. O cliente assina (gov.br, biometria ou código). Incapaz ou espólio: assina o representante, e o
   advogado confere os documentos de representação antes de enviar.
6. O provedor devolve o arquivo e o RELATÓRIO DE ASSINATURA (webhook). A plataforma confere o hash e
   grava em "01 Mandato e contrato". O Mandato vai a `vigente`; o Caso sai de aguardando_contrato.
7. O advogado assina por último; eventos mandato.assinar e termo_ia.registrar_aceite.
```

**Caminho sem provedor pago:** o cliente assina no gov.br por conta própria e envia o PDF (item `acao_externa` do app); o advogado registra "avançada, enviada pelo cliente". Se o tribunal aceita e como obter o relatório de verificação **[a confirmar]**; a API do gov.br para terceiros **não foi encontrada** (J4). **Papel:** procuração física digitalizada é Documento, com Mandato "assinatura física".

### 6.4 A divergência sobre exigir ICP-Brasil

O que as pesquisas acharam (resumos de busca; **acórdãos não lidos**):

- Segundo J4, a Lei 14.063/2020 **não veda a avançada em processo judicial**, salvo hipótese em que a lei exija a qualificada **[a confirmar]**.
- Acórdão do **TJMS** aceitou **substabelecimento** por gov.br (estadual, não vinculante, J4).
- J3 cita **decisões do STJ em 2026** sobre gov.br **[a confirmar o acórdão]**; um texto da ConJur (1/4/2026, só pelo título) diz que procuração sem ICP é válida se não houver dúvida sobre a autenticidade.
- Na prática, **alguns juízos podem exigir ICP-Brasil ou firma reconhecida** **[a confirmar por tribunal e vara]**.

**O desenho não escolhe lado.** O sistema:

1. usa **avançada com a trilha mais forte** como padrão (é o que o cliente consegue sem certificado);
2. mantém uma **tabela de aceite por tribunal e vara** ("aceita avançada", "exige qualificada", "desconhecido"), com fonte, data e quem registrou, no modelo do calendário forense (JU-01 4.5): a plataforma carrega pesquisa conferida pela advogada e o escritório ratifica;
3. em `pronta_para_protocolo`, **avisa** se o tribunal está "exige qualificada" ou "desconhecido" e o Mandato é só avançado, e oferece refazer com certificado ou o caminho de fora;
4. **registra toda rejeição** informada ("o juiz exigiu ICP-Brasil") e atualiza a tabela, com cartão;
5. deixa a **escolha** ao advogado, com motivo registrado (JU-01 JR6);
6. lê com a advogada, no E0, os acórdãos e o texto da lei (12.2).

### 6.5 Relatório de assinatura e evidências

O **relatório de assinatura** é a trilha que os provedores anexam ao PDF: prova de quem assinou, como e quando. Guarda-se **sempre**: arquivo assinado com hash do original e do assinado; o PDF de trilha do provedor, como veio; e dados estruturados (provedor e envelope, signatários e papéis, método de autenticação e nível alcançado, data, hora e fuso, IP, aparelho, resultado, ligação ao Mandato, ao Contrato de honorários e ao termo). Regras:

1. **Cópia própria** no índice e no backend do escritório (D10).
2. O relatório tem **dados pessoais** (IP, aparelho, biometria): base legal e retenção no JU-10 **[a confirmar]**; herda o sigilo do Caso.
3. Arquivo sem relatório fica `incompleta` e o advogado é avisado.
4. O Mandato registra `assinatura`: meio, nível, `documento_id`, `relatorio_documento_id`, `aceito_por_tribunal`.
5. Os eventos entram na linha do tempo do Caso, com hash em cadeia.

### 6.6 Provedores

Usa-se a abstração do 08 (`assinatura.enviar(documento, signatarios, nivel)`, `assinatura.status`, webhook `assinatura.concluir`), nível B (JU-03 4.4). Que **níveis cada plano entrega**, se há envio em lote e como se **conta** documento (por envelope ou arquivo) são **[a confirmar]** na escolha. **Hipótese:** um provedor na v1 e um segundo depois.

---

## 7. Poderes, substabelecimento, validade e revogação do Mandato

Entidade e estados são do JU-01 (4.7): `rascunho` → `aguardando_assinatura` → `vigente` → `vencido`, `revogado`, `renunciado`, `substabelecido`.

### 7.1 Poderes e conferência

**Gerais** permitem a atuação comum. **Especiais** precisam estar **expressos**; a lista de J3, que cita o CPC, arts. 105 e 112 **[a confirmar o texto]**: receber citação, confessar, reconhecer a procedência, transigir, desistir, renunciar ao direito, receber, dar quitação, firmar compromisso, e a declaração de hipossuficiência (onde a lei a coloca, **[a confirmar]**). O campo `poderes` é uma **lista fechada** por caixas, para a regra checar; o texto da procuração sai dela. O modelo gera "o conjunto certo para o caso" (JUR-014) e o advogado confere.

### 7.2 Conferência

| Quando | Regra |
| --- | --- |
| Peça que transige, desiste ou levanta valor | Mostra o poder exigido e o que o Mandato tem |
| Passagem a `pronta_para_protocolo` | Se faltar, **trava** até o advogado: emitir aditivo; registrar que o poder consta em outro documento; ou justificar |
| Acordo ou alvará no Honorário-Jurídico | Avisa se falta poder de receber e dar quitação |
| Cliente incapaz ou espólio | Confere se o signatário é o representante cadastrado (JU-01 3.1) |

### 7.3 Substabelecimento

Substabelecer é passar poderes **com reserva** (o original continua) ou **sem reserva** (sai de cena), tipicamente a correspondente (JUR-017; fluxo no JU-09). O Mandato novo guarda `mandato_pai_id`, `substabelecido_a` e `com_reserva`; a ficha mostra "quem tem poder, hoje". **Só advogado inscrito substabelece** (ato, `nao_promovivel`); o integrante prepara o texto; a assinatura é do advogado (A3, fora). Sem reserva, a regra ética pede ciência do cliente **[a confirmar CED e Estatuto]**: o sistema oferece o cartão "avisar o cliente" e **registra se foi avisado**. Quem perdeu o poder deixa de ser sugerido como responsável, e os alertas de Prazo passam a quem recebeu (cartão de redistribuição, JU-02 4.6).

### 7.4 Validade, vencimento e revogação

| Evento | O que o sistema faz |
| --- | --- |
| **Vigência** | Por prazo ou "até o fim do Caso"; `mandato.vencer_em_30_dias` abre "propor renovação". Mandato vencido **não bloqueia** ato urgente, mas avisa e pede nova assinatura |
| **Revogação** (pelo cliente) | O advogado registra a comunicação por escrito; Mandato vai a `revogado` e abre tarefas: honorários devidos (JU-05), devolução de originais (JUR-028), alerta nos Prazos abertos, checagem de quem fica no Processo |
| **Renúncia** (pelo advogado) | Minuta de notificação pelo modelo, **envio pelo advogado**; alerta dos dias em que a representação continua (10 dias, CPC art. 112, segundo J3 **[a confirmar]**); o Prazo segue na escada |
| **Fim do Caso** | Não vai a `encerrado` com Mandato sem tratamento (JU-01 3.2) |

Prazos e efeitos da revogação e da renúncia são **[a confirmar com a advogada e no texto oficial]**: o sistema só **cria tarefas e alertas**, não decide efeito jurídico. O acesso técnico a órgãos (Meu INSS) mora na **Credencial** do cofre, não no Mandato (JU-03 7.1).

---

## 8. Custo do provedor de assinatura (referência para o JU-12)

### 8.1 Preços públicos levantados

**Não foram refeitos nesta rodada.** Vêm das pesquisas V3 e J4, que conferiram as páginas oficiais em **6/11/2026**; preços mudam e há promoção (cupom de 20% no Clicksign na data). **[a confirmar no dia da decisão.]**

| Provedor | Plano | R$ por mês | Documentos por mês | Observação |
| --- | --- | ---: | ---: | --- |
| **ZapSign** | Equipe (API, WhatsApp) | 69,90 | 20 | Anual à vista equivale a 49,90 |
| ZapSign | Equipe, faixas maiores | 119,90 e 259,90 | 80 e 200 | Anual à vista: 99,90 e 239,90 |
| ZapSign | Profissional (sem API); gratuito | a partir de 39,90; 0 | **[a confirmar]**; 3 | Certificado e-CPF ou e-CNPJ à parte: R$ 160 a R$ 260 (cada) |
| **Clicksign** | Start (API) | 69 | 20 | 5 usuários; sem WhatsApp |
| Clicksign | Plus; Automação | 99; 135 | **[a confirmar]** | Plus: WhatsApp e biometria |
| **D4Sign** | Profissional (API Premium) | 79,90 | **[a confirmar]** | Básico 39,90; Avançado 59,90 |

**Custo por documento (conta nossa, preço dividido pela franquia):** ZapSign a 69,90 por 20, cerca de R$ 3,50; a 119,90 por 80, cerca de R$ 1,50; a 259,90 por 200, cerca de R$ 1,30; Clicksign Start, cerca de R$ 3,45. O preço do documento extra e a regra de envelope são **[a confirmar]**.

### 8.2 Uso esperado (hipótese a medir)

Cada cliente novo gera 3 a 4 documentos (Contrato de honorários, procuração, termo de IA, às vezes hipossuficiência); se o provedor contar por envelope, 1 a 2. Com 5 a 15 clientes novos por mês (**hipótese não verificada**, a perguntar à advogada) mais 0 a 5 substabelecimentos ou aditivos, o uso fica em **15 a 65 documentos por mês**: a faixa de 20 pode não bastar; a de 80 costuma bastar. Custo do provedor: da ordem de **R$ 70 a R$ 120 por escritório por mês**, ou **R$ 5 a R$ 14 por cliente novo**. **Ordem de grandeza para o JU-12, não preço.**

### 8.3 Quem paga e outros custos

| Opção | Como é | Quando serve |
| --- | --- | --- |
| **A. Conta do escritório** (token no cofre; JU-03 4.4) | O escritório contrata; a plataforma integra | **Hipótese da v1:** sem revenda e sem risco de preço |
| B. Conta da plataforma, com repasse | A plataforma contrata e cobra por documento | Depois, se o escritório não quiser conta |
| C. Franquia no plano | O plano inclui X documentos | Decisão do JU-12, com a conta de 8.2 |
| D. gov.br pelo cliente | PDF enviado (6.3) | Sem custo; mais trabalho manual |

Outros custos para o JU-12: **A3** (advogado paga; R$ 199 a R$ 229 e nuvem R$ 49 por ano em OAB/SP, matéria antiga, J4, **[a confirmar tabela atual]**); **OCR** por página **[a medir]**; **armazenamento** do backend da plataforma (Fundações 7.6); **minuta com IA**, R$ 0,71 a R$ 1,41, e **resumo de autos de 300 páginas**, R$ 2,20 a R$ 3,50, a preço médio de teste (JU-04 7.1); **verificação de citações** fora da franquia, em boa parte código.

---

## 9. Certificado A3 e entrega ao peticionamento assistido

**O certificado.** O A3 da OAB é token ou nuvem, sem versão em arquivo (J4). A plataforma **não o guarda nem usa** (D8); guarda só a **validade informada** e alerta em D-60, D-30 e D-7, **com urgência** se houver prazo fatal em 7 dias e o certificado vencer antes (JU-03 7.1; JUR-229). Se o tribunal aceita certificado **em nuvem** e quais assinadores cada sistema usa (Web Signer no e-SAJ, PJeOffice no PJe, normalmente nenhum no eproc, Conferência) é **[a confirmar]**.

**O que a Peça `pronta_para_protocolo` entrega ao JU-03** (passos 1 a 3 da seção 5.1 dele):

| Item | Detalhe |
| --- | --- |
| **PDF final** | Da versão aprovada, com o hash dela; formato aceito pelo tribunal **[a confirmar]** |
| **Anexos ordenados e renomeados** | Pela regra do tribunal, no limite de tamanho, com a camada de texto do OCR |
| **Ficha de protocolo** | Número do Processo, tribunal e sistema, **tipo de petição a escolher no sistema do tribunal**, prazo fatal, data interna, preparo e guia |
| **Checklist cumprido** | Quem revisou, quando, versão e hash |
| **Dossiê de tempestividade** | Montado pelo JU-03 (2.6) |
| **Aviso do certificado e do assinador** | Validade do A3 e assinador daquele tribunal |

A plataforma entrega o pacote **ao advogado, no equipamento dele**; ele entra no sistema do tribunal, assina com o A3 **no ato do protocolo** e protocola. A assinatura **prévia** do PDF só ocorre se o tribunal pedir, também pelo advogado **[a confirmar por tribunal]**. Depois, ele ou quem indicar anexa o **recibo**; a Peça vai a `protocolada` e, com a juntada conferida, a `comprovada`, e o JU-03 compara o recibo com o fatal.

**Nunca:** assinar com certificado, guardar A3, PIN ou login do advogado; protocolar por robô ou extensão (JU-03 4.6); entregar como "pronto" um pacote que não passa nas regras conhecidas. Processo físico ou sem peticionamento eletrônico: PDF para impressão e comprovante digitalizado (JU-03 5.3).

---

## 10. O que fica fora (só registrado)

| Tema | O que fica registrado | Quando volta |
| --- | --- | --- |
| **Contratos do consultivo mais complexos** (negociação e comparação com a contraparte, playbook e matriz de risco, vigência e renovação com alertas, extração de contratos legados, aditivos em cadeia) | Hoje, o contrato do consultivo é **Documento versionado** (tipo `contrato`), assinado pelo mesmo conector, com a biblioteca de cláusulas e um modelo básico; **sem** entidade Contrato, alerta de vigência ou playbook. Revisão em quatro lentes (JUR-162) é modo do JU-04 | Entidade **Contrato** no JU-04, depois da fase dos prazos (P12 do JU-01, aprovada) |
| Contrato de honorários | Conteúdo, cobrança e aditivo são do JU-05; aqui, modelo, cláusulas e assinatura | Já tratado |
| Procuração pública (cartório, e-Notariado) | Documento com Mandato "assinatura pública" | Depois; emolumento por UF **[a confirmar]** |
| Editor de texto próprio | Word e nuvem (2.6) | Depois do piloto |
| Troca de modelos entre escritórios | Nada; viola D5 | Fora do roteiro |
| Documentos do departamento jurídico (JUR-166 a 169, 201) | Perfil que o JU-01 só desenha | Depois do escritório pequeno |
| Peças penais (liberdade, réu preso) | Só com o módulo e o portão do JU-04 | Onda final |

---

## 11. Permissões, sigilo e auditoria

Níveis das Fundações: **L** ler, **R** rascunhar, **E** executar, **—** nada; "ato" = só advogado inscrito. Complementa a matriz do JU-01 (6.1).

| Capacidade | Sócio | Associado | Estagiário | Secretária | Controladoria |
| --- | --- | --- | --- | --- | --- |
| Criar modelo pessoal | E | E | E | E | E |
| **Publicar** modelo e cláusula do escritório | E | E (curadoria) | R | R | R |
| Gerar Peça (rascunho) | E | E | R | — | R |
| Marcar citação "conferida à mão"; **aprovar** Peça; registrar protocolo | E (ato) | E (ato) | — | — | — |
| Montar pacote, anexar recibo | E | E | R | R | E |
| Subir autos, rodar OCR, editar índice | E | E | E | E | E |
| Marcar pasta visível; **liberar** peça ao cliente | E | E | — | — | — |
| Emitir kit e enviar para assinatura | E | E | R | E | L |
| Registrar assinatura manual | E | E | R | R | — |
| Substabelecer, revogar, renunciar | E (ato) | E (ato) | — | — | — |
| Editar tabela de aceite por tribunal | E | L | L | L | E (sócio ratifica) |

**Auditoria.** Eventos com `caso_id`: `peca.criar`, `.enviar_revisao`, `.revisar`, `.protocolar`, `.comprovar`; `modelo.publicar`; `citacao.conferir_a_mao`; `mandato.assinar`, `.revogar`, `.substabelecer`, `.renunciar`; `termo_ia.registrar_aceite`; `assinatura.concluir`; `documento.registrar` e `.acesso_externo`. Hash em cadeia em Peça, Mandato e relatório. Toda leitura de documento de Caso restrito grava evento; o Administrador vê **quem acessou, não o conteúdo** (JU-01 6.5).

**Testes novos:** (1) vazamento de documento, OCR e relatório entre Casos restritos (busca, memória, notificação, IA); (2) citação pendente impede `revisada` e o pacote; (3) alterar após `revisada` volta a `em_revisao`; (4) número sem origem de cálculo vira **[preencher]**; (5) integrante não lê Caso com `ia_permitida = falso`; (6) modelo e peça de escritório não chegam a benchmark, cache global ou treino (canários, JU-04 5.6); (7) procuração só avançada para tribunal "exige qualificada" gera aviso; (8) assinatura sem relatório fica `incompleta`.

---

## 12. Ajustes pedidos, ordem de construção e perguntas

### 12.1 Ajustes pedidos a outros documentos

| Onde | Ajuste pedido |
| --- | --- |
| **Fundações 4.11, 7.2, 7.8** | Tipos novos de Documento; texto de OCR e qualidade por página; árvore por Caso; `Entregáveis/Jurídico`; link externo desligado em Caso restrito; **aviso de que o sigilo por Caso não protege bytes em Drive ou OneDrive do escritório** |
| **Fundações e 08 (assinatura)** | `assinatura.*` com `nivel`, relatório como Documento, cópia própria, `incompleta`, vários documentos por envio, contagem por envelope; provedor por conta do escritório |
| **06, seção 5.5** | Assinatura **avançada** para procuração, contrato de honorários e termo de IA (hoje "depois"); ciência simples não vale para Mandato; caminho gratuito pelo gov.br como `acao_externa` |
| **JU-01** | Entidades: **Modelo de peça**, **Cláusula**, **Índice de autos**, **Tabela de aceite de assinatura**. Mandato: `nivel_assinatura`, `relatorio_documento_id`, `aceito_por_tribunal`, `poderes` em lista fechada, `com_reserva`, validade. Peça: `modelo_versao_id`, estado de citação por versão, "conferida à mão". Cliente: campos de qualificação **[a confirmar a lista]** |
| **JU-02** | Telas: biblioteca de modelos, geração com lista de citações e bloqueios, fila de supervisão, documentos do Caso com índice e OCR, kit de entrada e envio, tabela de aceite, cartões de substabelecimento e revogação; revisão que **impeça exportar** (JU-04 A10) |
| **JU-03** | Estado `pronta_para_protocolo` (nome do JU-01); o passo 3 usa "preparar para protocolo" (5.3); consulta à tabela de aceite; "Mandato válido" usa a conferência de poderes |
| **JU-04** | Tipos de peça cobertos e modelos por módulo; `peca.rascunhar` com `modelo_versao_id`, variáveis e instruções; verificação por versão, também no texto à mão; "conferida à mão"; alerta de modelo desatualizado; **Contrato** depois dos prazos |
| **JU-05, JU-09, JU-10, JU-11, JU-12** | JU-05: modelos, cláusulas e assinatura do Contrato de honorários. JU-09: substabelecimento a correspondente (7.3). JU-10: retenção e base legal do relatório, OCR em Caso restrito, bytes em nuvem de terceiros. JU-11: importar modelos Word com limpeza e acervo de autos. JU-12: custo do provedor, OCR, armazenamento |

### 12.2 Ordem de construção

**Só depois do BPO;** o que não é código começa já.

| # | Etapa | Entrega | Depende de | Validação antes |
| --- | --- | --- | --- | --- |
| **D0** | **Sem código, já** | Ler os textos oficiais (Lei 14.063/2020, CPC sobre poderes e renúncia, CED sobre substabelecimento); ler com a advogada os acórdãos (STJ, TJMS); lista dos tipos de peça que ela mais usa; modelos reais sem dado de cliente; aceite de assinatura nos tribunais do piloto; contas de teste nos provedores; parecer de ética e LGPD | Nada | Resposta escrita da advogada; parecer registrado |
| **D1** | **Documentos do Caso** | Árvore por Caso, tipos, hash, `Entregáveis/Jurídico`, compartimento | Fundações 7; JU-01 J2 | Teste de vazamento por Caso |
| **D2** | **Assinatura e procuração digital** | `assinatura.*`, um provedor por token do escritório, kit de entrada, Mandato com relatório e cópia própria, caminho gov.br | D1; JU-01 J4; 08; 06 | 10 envios de teste com documentos sintéticos conferidos pela advogada; teste de `incompleta` |
| **D3** | **Modelos e geração sem IA** | Modelo, versão, variáveis, cláusulas, três origens, limpeza na importação | D1; JU-01 | A advogada preenche 5 modelos reais; nenhum dado de cliente fica no modelo |
| **D4** | **Revisão, estados e trilha** | Estados, checklist, aprovação presa ao hash, versões, fila de supervisão, bloqueio de exportar | D3; JU-02 | Alterar após aprovar volta a `em_revisao`; revisor registrado |
| **D5** | **OCR e índice de autos** | Leitura, camada de busca, índice por regra e proposta, "preparar para protocolo" | D1; decisão do JU-10 | Amostra de 100 páginas; erro medido; índice conferido |
| **D6** | **Minuta com IA e bloqueio de citação** | Fluxo da seção 3 nos tipos cobertos; verificação por versão; "conferida à mão" | D4; JU-04 E4 e E10 | Casos sintéticos de classe G; **zero citação inexistente ou superada**; bloqueio comprovado |
| **D7** | **Entrega ao peticionamento** | Pacote, ficha, alerta do A3, recibo, `protocolada` e `comprovada` | D4, D5; JU-03 E7 | Protocolos reais da advogada, em modo sombra |
| **D8** | **Poderes, substabelecimento, revogação** | Lista fechada, conferência por tipo de peça, cadeia, tarefas, tabela de aceite | D2, D4 | 12 casos de poder faltante revisados pela advogada |
| **D9** | **Biblioteca da plataforma por onda** | Modelos validados por especialista, cessão de direitos, versões oferecidas | JU-04 E15; D3 | Gate de lançamento do módulo (JU-04 6.4) |

### 12.3 Perguntas para aval

| # | Pergunta | Hipótese | Em frase simples |
| --- | --- | --- | --- |
| 1 | Quem escreve os modelos da plataforma, e quando? | Até o lançamento, poucos modelos básicos (procuração, substabelecimento, termo de IA, contrato de honorários, notificação), validados pela advogada da família; o resto, por especialista com cessão de direitos | "Os modelos prontos nascem poucos, revisados pela advogada, e os demais vêm de advogados contratados?" |
| 2 | A peça de um Caso pode virar modelo do escritório? | Sim, por ato do advogado e com limpeza de dados; nunca vai à biblioteca da plataforma | "O escritório pode transformar uma boa peça em modelo, sem dado do cliente, e isso nunca sai dele?" |
| 3 | Citação que a base não consegue verificar: bloqueia sempre? | Bloqueia; o advogado remove ou marca "conferi à mão" com a fonte anexada | "Se o sistema não achar a decisão citada, a peça trava até o advogado tirar a citação ou conferir à mão?" |
| 4 | O advogado que pediu a minuta pode aprová-la? | Sim, com checklist e registro de leitura; segunda conferência só onde o JU-04 exige | "Quando só há um advogado, ele mesmo aprova, mas precisa marcar que leu tudo?" |
| 5 | Que atos pedem assinatura mais forte? | Receber e dar quitação, transigir, desistir e renunciar pedem avançada reforçada ou qualificada, escolha do advogado, registrada | "Procuração com poder de receber dinheiro ou fazer acordo tem assinatura mais forte, e o advogado escolhe qual?" |
| 6 | Como tratar a divergência sobre exigir ICP-Brasil? | Padrão avançada; tabela de aceite por tribunal; aviso antes de protocolar; o advogado decide | "Como os tribunais discordam, o sistema avisa se aquele juízo costuma exigir certificado e o advogado decide?" |
| 7 | Quem paga a assinatura eletrônica? | Na v1, o escritório contrata o provedor (token) e a plataforma integra; o JU-12 avalia franquia | "O escritório contrata a empresa de assinatura e nós ligamos ao sistema?" |
| 8 | Um provedor primeiro ou dois? | Um, o que passar no teste com a advogada, atrás de uma abstração | "Começo com uma só empresa de assinatura?" |
| 9 | Onde ficam os arquivos de um Caso restrito? | Recomendar a nuvem da plataforma ou nuvem controlada; no Drive do escritório, avisar que o sigilo dos arquivos depende dele | "No caso sigiloso, guardo os arquivos na nossa nuvem e aviso se o escritório preferir o Drive dele?" |
| 10 | Procuração e contrato entram sozinhos na pasta que o cliente vê? | Só por decisão do advogado no cartão; rascunho nunca entra | "O cliente recebe a cópia da procuração e do contrato só depois de o advogado liberar?" |
| 11 | O advogado edita no Word ou num editor da plataforma? | Word e nuvem do escritório na v1; editor próprio depois do piloto | "O advogado continua escrevendo no Word e o sistema guarda cada versão sozinho?" |
| 12 | OCR automático em todos os autos? | Sim; em Caso restrito ou segredo de justiça, só por ordem do advogado e com operador declarado | "O sistema lê todas as páginas escaneadas, menos nos casos sigilosos, onde o advogado manda?" |
| 13 | Cliente incapaz ou espólio assina por meio do representante? | Sim, e o advogado confere os documentos de representação antes de enviar | "Se o cliente é menor ou espólio, assina o representante, e o advogado confere os papéis dele?" |
| 14 | Contratos mais complexos do consultivo esperam? | Sim: só Documento versionado, cláusulas e assinatura; entidade Contrato depois dos prazos | "Os contratos mais complicados do consultivo ficam para depois, só guardando e assinando agora?" |

---

## Ressalvas

- **Nenhuma norma foi relida em texto oficial.** Lei 14.063/2020, CPC (arts. 105 e 112, como citados em J3), Estatuto, Código de Ética (arts. 26 e 48), LGPD e a Recomendação CFOAB 001/2024 estão como registrados em J3, J4, J5 e nos JU-01 a JU-05; numerações e prazos marcados **[a confirmar]** precisam de conferência antes de virar regra ou texto de modelo.
- **A divergência sobre ICP-Brasil não foi resolvida:** há acórdão do TJMS (estadual), decisões do STJ em 2026 citadas por J3 sem o acórdão lido e um texto de imprensa lido só pelo título. O desenho não depende de quem tem razão.
- **Preços de provedores** vêm das pesquisas V3 e J4 (páginas de 6/11/2026) e não foram refeitos; a conta por documento é nossa, e o volume por escritório (8.2) é hipótese a medir. Preços do A3 vêm de matéria antiga da OAB/SP.
- **Formatos, limites de tamanho, ordem de anexos e assinadores por tribunal** não foram levantados.
- **Sigilo dos bytes em nuvem de terceiros e OCR em segredo de justiça** dependem do parecer de ética e LGPD e do JU-10.
- **Antes de casos reais:** parecer de advogado especializado (sigilo, LGPD, termos, responsabilidade, seguro) e modo sombra de algumas semanas sem alerta real. A advogada da família valida os fluxos; especialista de área só no lançamento.
- Estimativas de custo de IA vêm do JU-04 (7.1) e são hipóteses. Tudo aqui é **planejamento**: nada foi construído nem testado.

## Decisões do usuário (9/11/2026, segunda rodada)

Resposta: **segue a hipótese em todas as perguntas** da tabela de perguntas para aval acima, **exceto** as que dependem de explicação ou da regra de preço abaixo (registradas no JU-12 e na seção 14.1 da revisão de consistência). Fica aprovado como escrito, ainda sujeito aos pareceres e às conferências marcadas [a confirmar].
