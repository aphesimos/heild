# Plano da Base de Legislação Municipal (e dos módulos de base legal)

**Versão 0.2 · 9 de novembro de 2026 · incorpora as decisões do dono do produto de 9/11/2026.**

Este plano diz como a base legal da Heild cobre a legislação **municipal** com a mesma promessa do resto da base: redação vigente na data do fato, trecho citado, grau de segurança e abstenção quando não há base. Desde a versão 0.2 ele também organiza a **base estadual dos 27 entes** e os **módulos de base legal** em que o Assistente e o Consultor serão vendidos (seção 6). Ele valida, corrige e substitui o plano municipal anexado ao pedido (seção 22) e se encaixa nos planos do repositório de trabalho `DGM-RAG-Contabil`, sem reescrevê-los:

- [Plano de Ingestão da Base Legal](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_de_Ingestao_da_Base_Legal.md): fichas, princípios, agentes, portões. Este plano **mantém** tudo isso e só acrescenta o que o município e os estados exigem.
- [Plano do Assistente](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_Assistente_de_IA_para_Contadores.md) e [Subplano 07 · Motores e Consultor](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/07-Motores-e-Consultor.md): cascata do M1 Legal, `legal.consultar`, verificação e abstenção.
- [JU-04 · Motor jurídico e base de leis](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md) e as pesquisas J3, J6 e [J9 · Ordem dos módulos](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/pesquisa/juridico/J9-ordem-dos-modulos-de-base.md): os módulos jurídicos e a sua ordem.

As notas brutas, com cada fonte e o que foi testado, estão em [`pesquisa-base-municipal/notas-de-pesquisa.md`](pesquisa-base-municipal/notas-de-pesquisa.md). Todo número tem fonte e data; o que é conta minha vem marcado como **estimativa**, com a conta ao lado.

**Como ler as marcas.** **[Dono]** = decisão do dono de 9/11/2026. **[Proposta]** = proposta deste plano, ainda não aprovada. Sem marca = fato pesquisado ou consequência direta de uma decisão.

### O que mudou da versão 0.1

| Tema | Versão 0.1 | Versão 0.2 |
|---|---|---|
| Primeiros clientes | Pergunta aberta | **[Dono]** Contábil e BPO; advocacia depois, em módulos (seção 6) |
| Estadual | Coletor por UF onde o Plano de Ingestão previa (5 UFs) | **[Dono]** Os 27 entes; expectativa corrigida e custo (seção 3) |
| Municipal | Onda dos 338 municípios acima de 100 mil como meta | **[Dono]** Só o que é fácil de puxar (coletores por plataforma); o resto sob demanda e pelo feedback; os 338 viram só a ordem da fila (seção 18) |
| Revisão humana | ~6 h por município, ~2.000 h para os 338 | **[Dono]** Sem revisor dedicado no começo; redesenho com automação, conferência cruzada e o usuário como revisor; ~17 h por mês no total (seção 13) |
| Fonte licenciada | Opção | Opção em aberto, com o que ela é de fato explicado (seção 4.6) |
| Nível intermediário (texto atual sem histórico) | Pergunta aberta | **[Dono]** Pode ser lançado, rotulado; rótulos e textos definidos (seção 8) |
| Janela histórica | 10 anos | **[Dono]** 10 anos no federal; **5 anos** no estadual e no municipal |
| LAI, convênios e CAPTCHA | Só LAI e convênio; sem CAPTCHA | **[Dono]** LAI e convênio em nome da empresa; o **CAPTCHA resolvido por pessoa no celular volta como reserva**, com cuidados (seção 10.2) |
| Nome dos níveis de cobertura | N0 a N4 | **C0 a C4**, para não colidir com os níveis de maturidade N1 a N4 e o Núcleo N0 do JU-04. O antigo N2 é o C2 |

---

## 1. Resumo

**O problema.** São 5.570 municípios mais o Distrito Federal (5.571 linhas na estimativa do IBGE de 2025). Cada um publica no seu veículo oficial, num de dezenas de sistemas, e quase nenhum mantém texto compilado. Em outubro de 2026, nos diários municipais de Santa Catarina, só 1,3% das publicações eram leis e 5,2% eram decretos; o resto é licitação, ata e portaria. Quase um quarto das leis ainda revoga "as disposições em contrário" sem dizer quais. Não existe serviço aberto que entregue a lei municipal vigente numa data. No estadual a situação é melhor, mas não é a do federal: o LexML padroniza só 6 assembleias e o DF.

**O escopo decidido pelo dono:**

1. **[Dono]** Lançamento para **contábil e BPO**. O primeiro domínio local é o **núcleo tributário** (ICMS, ITCMD e IPVA nos estados; ISS, IPTU, ITBI, taxas, UFM e REFIS nos municípios). A advocacia entra depois, vendida em **módulos de base legal** do mais comum ao menos comum (seção 6).
2. **[Dono]** **Estadual: os 27 entes.** Exige um coletor por fonte em cada UF, cerca de 100 coletores (**estimativa**), e custa US$ 8 mil a 14 mil em modelo para 5 anos de histórico (**estimativa**, seção 20).
3. **[Dono]** **Municipal: só o que é fácil de puxar.** Isso inclui o DOM/SC (293 municípios), o SIGPub (diários de mais de dez associações), o SAPL (cerca de 1.200 câmaras), a Base de Legislação Municipal do TCE-RS (se houver acesso por convênio ou LexML) e as classes de plataforma do Querido Diário. O resto entra **sob demanda e pelo feedback dos usuários**.
4. **[Dono]** Janela de **10 anos no federal** e de **5 anos no estadual e no municipal**.
5. **[Dono]** Sem revisor dedicado no começo. **[Proposta]** O plano funciona com:
   - dupla extração independente e reconciliação automática;
   - conferência cruzada com os parâmetros da NFS-e, a compilação do SAPL e as consolidações oficiais;
   - publicação rotulada em C1 e C2;
   - uma fila de exceções puxada pela demanda;
   - o usuário (contador, advogado) como revisor do próprio município.

   Sobram cerca de **17 horas humanas por mês** (faixa de 10 a 30, **estimativa**), concentradas em auditoria amostral, exceções que alguém perguntou e CAPTCHA (seção 13).
6. **[Dono]** O texto atual sem histórico (**C2**) pode ser lançado, rotulado: "Texto atual · sem histórico" (seção 8).

**A técnica que não muda.** Coletores por plataforma, não por município. O modelo **extrai eventos com evidência** e o **código consolida**: num estudo de 2025 com leis alemãs, modelos que escreviam o texto consolidado acertaram exatamente só 50% das alterações simples e 20% das cadeias. Toda versão de dispositivo local carrega a **certeza da cadeia**, que entra no grau de segurança da resposta.

**O que custa.** O modelo de linguagem é barato. No estadual, US$ 8 mil a 14 mil no histórico de 5 anos e US$ 120 a 220 por mês. No municipal, menos de US$ 1 por município por ano no fluxo e cerca de US$ 7 por município (faixa de US$ 4 a 29) para montar o histórico de 5 anos sob demanda. O que pesa é a **manutenção dos coletores** (cerca de 100 no estadual, mais os de plataforma no municipal) e as poucas horas humanas que não dá para eliminar (seções 13 e 20).

---

## 2. O problema em números

### 2.1 Onde estão as pessoas, a renda e as empresas

Contas minhas sobre IBGE: estimativas de população 2025 (arquivo de 28/08/2026), PIB dos Municípios 2023 (SIDRA 5938) e Cadastro Central de Empresas 2021, unidades locais (SIDRA 1685).

| Recorte | Municípios | População 2025 | PIB 2023 | Unidades locais 2021 |
|---|---:|---:|---:|---:|
| Brasil | 5.571 | 213,4 milhões | R$ 10,94 tri | 6,32 milhões |
| Capitais | 27 | 23,1% | 28,3% | 32,1% |
| Acima de 100 mil habitantes (inclui todas as capitais) | 338 | 58,3% | 67,4% | 68,2% |
| Acima de 50 mil | 682 | 69,5% | 78,1% | 78,0% |
| Acima de 20 mil | 1.752 | 85,0% | — | 89,6% |
| Até 10 mil | 2.469 | 6,0% | — | — |
| SP, MG, PR, SC e RS inteiros | 2.689 | 46,3% | 57,1% | 63,7% |
| As cinco UFs, acima de 100 mil | 174 | 28,7% | 39,2% | 43,1% |
| Escopo do plano anexado (5 UFs inteiras + capitais + acima de 100 mil no país) | 2.853 | 75,9% | 85,3% | 88,8% |

Os 10 maiores PIBs municipais somam 24,5% do PIB; os 100 maiores, 52,9% (58 deles nas cinco UFs). Com a decisão do dono, esses números deixam de definir uma meta de cobertura e passam a **ordenar a fila sob demanda** (seção 18).

O CFC registra 101.880 organizações contábeis ([Relato Integrado 2025](https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf)); o CRCSP informa 533.724 profissionais ativos em 30/09/2024, 29% deles em SP, e que a maior parte das organizações está no estado ([CRCSP, transparência](https://crcsp.org.br/transparencia/)). Não há distribuição pública de clientes de escritórios por município.

### 2.2 Quanto se publica, e quanto disso importa

Baixei os 87 arquivos de dados abertos do DOM/SC de outubro de 2026 (um registro por ato, com texto) e contei ([CIGA, dados abertos](https://dados.ciga.sc.gov.br/)):

| Medida | Valor |
|---|---:|
| Publicações no mês | 97.180 |
| Municípios que publicaram | 293 dos 295 de SC |
| Atas de registro de preços | 64.662 (66,5%) |
| Decretos | 5.024 (5,2%) |
| Leis | 1.295 (1,3%) |
| Leis que abrem crédito orçamentário | 28,3% das leis |
| Decretos que abrem crédito orçamentário | 54,3% dos decretos |
| Leis com termo tributário (fora créditos) | 97 (7,5%) |
| Decretos com termo tributário (fora créditos) | 133 (2,6%) |

**Estimativas derivadas** (média de SC; o município médio de SC tem 27,8 mil habitantes, contra 38,3 mil no país):
- cerca de **53 leis e 206 decretos por município por ano**;
- desses, cerca de **9 atos tributários** (97 + 133 = 230 por mês ÷ 293 × 12 = 9,4);
- extrapolado para o país, cerca de 295 mil leis, 1,15 milhão de decretos e 52 mil atos tributários municipais por ano.

O filtro é aproximado (palavras-chave sobre o título e o começo do texto) e deve ser refeito no piloto.

### 2.3 Como as leis municipais são escritas

Na mesma amostra de outubro de 2026:

| Marcador | Leis | Decretos |
|---|---:|---:|
| "entra em vigor na data de sua publicação" | 92,9% | 92,7% |
| Vigência diferida (data, 1º de janeiro, exercício seguinte, 90 dias) | 5,2% | 0,9% |
| Efeitos retroativos ou "a contar de" | 4,3% | 3,1% |
| "revogam-se as disposições em contrário" | **22,9%** | **27,5%** |
| Revogação expressa | 8,3% | 7,9% |
| "passa a vigorar com a seguinte redação" | 11,8% | 2,8% |
| Marca "(NR)" | **4,3%** | 1,3% |
| Cita anexo (tabelas) | 27,3% | 9,6% |

Três consequências:
1. O "(NR)" aparece em cerca de um terço das leis que dão nova redação, então não serve como detector.
2. A revogação genérica é frequente, logo a revogação tácita é um caso comum, não exceção.
3. Um quarto das leis traz anexo (tabelas de alíquota, valores, listas), que precisa da Ficha 4.

### 2.4 O que está em jogo

- **Contábil:**
  - nos estados: ICMS (RICMS, substituição tributária, benefícios), ITCMD e IPVA;
  - nos municípios: ISS (alíquota por item da LC 116, retenção, local de incidência, sociedades uniprofissionais), IPTU, ITBI, taxas, COSIP, unidade fiscal, parcelamentos;
  - no DP: feriados municipais e pisos estaduais.
- **BPO financeiro:** ISS retido nas notas de fornecedores (lei do município do tomador e do prestador), substituição tributária e diferencial de alíquota nas compras, taxas e alvarás nas contas a pagar.
- **Advocacia (seção 6):**
  - Imobiliário: IPTU, ITBI, plano diretor;
  - Administrativo: servidores, licitações locais, posturas;
  - Família: ITCMD estadual;
  - Civil: custas e calendário forense por tribunal.

---

## 3. Federal e estadual: a premissa conferida e o custo dos 27 entes

### 3.1 O que existe

| Fonte | Esfera | Cobertura e formato | Versionamento | Licença | API |
|---|---|---|---|---|---|
| [API de legislação do Senado](https://legis.senado.leg.br/dadosabertos/legislacao/lista?tipo=LEI&ano=2024) | Federal | JSON/XML; publicações, vetos e **alterações recebidas por dispositivo** | Eventos por dispositivo (a validar contra o compilado) | Livre, citar a proveniência ([Senado](https://www12.senado.leg.br/dados-abertos/sobre)) | Sim, sem chave |
| normas.leg.br | Federal | Texto multivigente, linha do tempo e histórico do dispositivo | Compilação estruturada só para CC, CPC e leis desde 2019; antes, manual da Câmara ([apresentação do Senado](https://www12.senado.leg.br/assessoria-de-imprensa/arquivos/apresentacao-em-power-point_normas.leg/normas-leg-br.pptx/@@download/file/Normas%20leg%20br.pdf)) | A confirmar | Não documentada |
| Planalto | Federal | HTML compilado com texto riscado | Visual, não estruturado | Texto de lei sem direito autoral | Não; **bloqueia robôs** (pesquisa 04 e meus testes de 9/11/2026) |
| INLABS / DOU | Federal | XML e PDF diários desde 2020 | Não | Livre | Sim |
| [LexML](https://www.lexml.gov.br/desc_acervo.html) | Todas | Índice e URN; 11,0 milhões de documentos (21/12/2025) | Não | Aberta | SRU; devolveu página de verificação a script (J4, 8/11/2026) |
| LexML, estadual | Estadual | **Só 6 assembleias e o DF:** ALESP 172 mil, ALMG 109 mil, ALESC 21 mil, AM 12 mil, RO 6 mil, AL 1 mil; SINJ-DF 52 mil | Não | Aberta | Via LexML |
| Assembleias e Casas Civis | Estadual | ALESP em XML; ALMG com endpoint; Goiás com API de pesquisa; o resto por portal | Raro | Varia | Preprint de 2025 sobre as 26 assembleias e a CLDF: "forte assimetria e fragmentação técnica" ([SciELO Preprints 12275](https://preprints.scielo.org/index.php/scielo/preprint/view/12275)) |
| Sefaz das UFs | Estadual | RICMS, anexos, legislação de ICMS, ITCMD e IPVA, respostas a consultas | O Plano de Ingestão conta com RICMS consolidado nas 5 UFs; nas outras 22, **a confirmar** | Varia | Raro |

### 3.2 A expectativa do dono, corrigida

O dono entende que a legislação estadual "é parecida com a federal". **No conteúdo, é:** os mesmos tipos de norma (lei, decreto, portaria), a mesma técnica legislativa e um diário oficial por UF. **Na forma de obter, não é:**

- **Não há serviço estadual único.** A API de legislação do Senado e o normas.leg.br são só federais. O LexML padroniza 6 assembleias e o DF; as outras 20 UFs exigem coleta própria.
- **O ICMS mora nas Sefaz, não nas assembleias.** O RICMS é longo e muda por decreto com frequência. Cada Sefaz publica do seu jeito, e não confirmei que todas mantêm o regulamento consolidado.
- **São quatro fontes por UF**: Sefaz, diário oficial, assembleia (quando fora do LexML) e tribunal administrativo tributário. Isso dá **cerca de 100 coletores** (**estimativa**: 27 + 27 + 20 + 27), contra um punhado no federal.
- **O CONFAZ e as resoluções do Senado** (alíquotas interestaduais) são federais e entram uma vez só, para as 27 UFs.

Se o dono pensou em serviços comerciais (LegisWeb, IOB, Econet, Leis.Org), eles juntam federal, estadual e parte do municipal, mas não são abertos e a compilação é protegida (seção 17).

### 3.3 Quanto custam os 27 entes

**Estimativa**, escalando a premissa da pesquisa 02 do repositório: por UF e por ano, 330 atos normativos de ICMS, ITCMD e IPVA, 300 respostas a consultas e 200 decisões do tribunal administrativo. É um teto: a pesquisa 02 tirou esses números das UFs grandes.

| Item | 5 anos, 27 UFs | Custo em modelo |
|---|---:|---:|
| Atos normativos | 44.550 | US$ 3,2 mil a 6,5 mil |
| Respostas a consultas | 40.500 | US$ 1,9 mil a 3,8 mil |
| Decisões administrativas | 27.000 | US$ 0,9 mil a 1,8 mil |
| Textos consolidados vigentes (premissa: 3 milhões de tokens por UF, ao custo por token da pesquisa 02) | ~81 milhões de tokens | ~US$ 0,8 mil |
| Triagem dos diários estaduais (3 mil atos por UF por mês, premissa da pesquisa 02) | ~4,9 milhões | ~US$ 1,3 mil |
| **Total do histórico** | | **US$ 8 mil a 14 mil (R$ 45 mil a 80 mil)** |
| **Manutenção** | ~1.870 atos por mês | **US$ 120 a 220 por mês** |

- O teto usa os custos por ato da pesquisa 02 em lote com cache: US$ 0,147, 0,093 e 0,066.
- O piso usa o custo por ato desta pesquisa (US$ 0,072, seção 20.1), aplicado na mesma proporção às três classes.

O custo de verdade é **construir e manter os cerca de 100 coletores**. A métrica "horas por coletor por mês" da Fase 1 dirá quanto isso pesa.

**[Proposta] Ordem dentro do estadual:**
1. Texto vigente (**C2**) das 27 UFs, ancorado no RICMS e nas leis consolidadas oficiais onde existirem.
2. Histórico de 5 anos (**C3**) primeiro nas UFs dos clientes dos pilotos, que o dono espera estarem em grande parte em RS, SC, PR, SP e MG.
3. Histórico das demais UFs sob demanda.

---

## 4. Inventário das fontes municipais

### 4.1 Quadro geral

| Fonte | Cobertura (data) | Grão | Texto | Vigência ou vínculos | Licença e acesso | Papel no plano |
|---|---|---|---|---|---|---|
| **Querido Diário** (OKBR) | 522 municípios, ~65 milhões de pessoas ([OKBR](https://www.catarse.com.br/queridodiario-okbr/about), sem data); 527 numa conferência de terceiro em 30/09/2026 | Diário inteiro | Extraído do PDF | Não | Código MIT, dados CC-BY 4.0; API com limite de referência de 60 req/min; **fora do ar no teste de 9/11/2026** | Código de raspadores reaproveitável; descoberta |
| **DOM/SC** (CIGA/FECAM) | 293 de 295 municípios de SC (out/2026) | **Ato** | Sim (HTML extraído) | Não | Dados abertos JSON desde jan/2023; **licença não declarada** | Fluxo do estado inteiro |
| **SIGPub** (Vox Tecnologia, diariomunicipal.com.br) | Diários de AMA, AGM, FGM, AMURB, AMURC (página inicial); e, segundo buscas, AMUPE, FAMUP, FAMEP, FEMURN, AAM, AROM, APRECE, FAMURS, AMP e AMM-MG (lista a conferir na Fase 0) | **Ato**, com código identificador verificável | PDF assinado e página do ato | Não | Público; termos a confirmar | Um coletor para muitos estados |
| **Diário dos Municípios Mineiros** (Imprensa Oficial de MG) | 834 de 853 municípios usam ([Agência Minas, 22/04/2026](https://agenciaminas.mg.gov.br/noticia/jornal-minas-gerais-completa-134-anos-como-referencia-em-transparencia-e-parceria-com-municipios)) | Caderno do jornal oficial | PDF | Não | Público | Fluxo de MG |
| **TCE-RS, Base de Legislação Municipal (BLM)** | 789.722 documentos no LexML; "mais de um milhão de normas" na consulta pública ([Atricon, 02/10/2019](https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/)) | Norma | Sim | Indexação; sem consolidação | Envio obrigatório pelos municípios desde 2009 (Res. 843/2009, IN 12/2009). A consulta pública fica em leismunicipais.com.br/tcers, que recusa robôs; o caminho fácil é o **LexML ou convênio com o TCE-RS** (a confirmar na Fase 0) | Estoque e completude do RS |
| **LexML municipal** | 57 câmaras, 285.963 documentos (21/12/2025) | Norma | Link | Não | Aberta | Índice e URN |
| **SAPL** (Interlegis) | "Cerca de 1.200 câmaras" (técnico do Senado, 2026) | Norma; **dispositivo** quando a câmara usa a compilação | PDF | **Normas relacionadas** (altera, revoga) e **dispositivos com vigência e eficácia** | API REST aberta | Melhor fonte estruturada das leis; padrão-ouro de teste |
| **Leis Municipais / Leis.Org** (Leis Ltda, empresa privada) | "Mais de 1.000 municípios, governos estaduais e tribunais de contas" (proposta de dez/2023); "1.350 órgãos" e "10 milhões de normas" (notícia, 2025-2026) | Norma | Sim | **Consolidação, compilação e versionamento por data** | Compilação protegida; portal recusa acesso automatizado; licença só por negociação | Opção em aberto (seção 4.6) |
| Jusbrasil, LegisWeb, IOB, Econet | Ampla, não auditada | Norma | Sim | Variável | Uso individual; o Jusbrasil proíbe robôs (cláusula 2.5.2) | Só conferência manual |
| Portais de prefeituras e câmaras | Heterogêneo | Varia | PDF, muitas vezes digitalizado nos atos antigos | Raro | Público; robots e termos por site | Sob demanda |
| **NFS-e Nacional, parâmetros municipais** | 5.466 municípios em operação (out/2026) | Tabela | Dados | **Com vigência** | API oficial | Conferência de alíquotas e retenções (não é base legal) |

### 4.2 Querido Diário

- **Cobertura.** A OKBR declara 522 municípios e cerca de um terço da população. Um projeto de terceiros contou 527 municípios com diário indexado e 5.044 sem, em 30/09/2026 ([monitorelnino, PR 469](https://github.com/monitorelnino/monitorelnino/pull/469)). A pesquisa J4 ainda falava em 350 cidades (2024).
- **Código.** O repositório de raspadores (`okfn-brasil/querido-diario`, último commit em 23/09/2026) tem 449 raspadores e 441 códigos IBGE distintos.
  - Por UF: SP 116, BA 74, RJ 33, SE 29, MA 29, PR 27, TO 26, RS 21, MG 21, SC 3.
  - **384 (85,5%) herdam uma de 21 classes de plataformas replicáveis**: Instar 111, DOEM 56, DOSP 42, ADiários 39, Município Online 26, Atende 22, DIOF 21, entre outras. Só 65 raspadores são próprios.
  - É o ativo mais útil do projeto para nós: licença MIT e plataformas já mapeadas.
- **API.** Endpoint `/gazettes` e limite de referência de 60 requisições por minuto ([docs](https://docs.queridodiario.ok.org.br/en/latest/using/public-api.html)).
  - Em 9/11/2026, o endereço antigo falhou na negociação TLS, o WebFetch recebeu 503 e o endereço novo não respondeu.
  - Uma issue de outubro de 2026 relata instabilidade ([Ro-DOU 378](https://github.com/gestaogovbr/Ro-dou/issues/378)).
- **Base dos Dados:** a busca do catálogo não mostra conjunto do Querido Diário em 9/11/2026.
- **Atraso e qualidade do texto:** não foi possível medir; medir na Fase 0.

### 4.3 Diários associativos e estaduais

- **DOM/SC.** Um registro por ato, com `municipio`, `entidade`, `categoria`, `titulo`, `texto`, `link` e `url` do PDF.
  - Só um ato em 6.319 leis e decretos de outubro veio sem texto.
  - Os dados abertos vão de jan/2023 a out/2026, o que cobre só parte da janela de 5 anos; antes disso, o portal diariomunicipal.sc.gov.br.
  - A página do recurso diz "Nenhuma licença fornecida": pedir licença ao CIGA.
- **SIGPub.** Uma plataforma, um coletor, muitos estados; cada ato tem "Código Identificador" verificável.
- **Minas Gerais: correção.** Os 834 municípios usam o **Diário dos Municípios Mineiros, caderno do jornal Minas Gerais** (Imprensa Oficial do Estado; Decreto Estadual 48.175/2021). A AMM mantém **outro** diário, no SIGPub.

### 4.4 Tribunais de contas

O TCE-RS mantém a **BLM**, alimentada por envio obrigatório dos municípios desde 2009 e publicada em até 24 horas após validação diária. É o único órgão de âmbito estadual que fornece legislação municipal ao LexML, com 789.722 documentos, cerca de 1.589 por município do RS (**estimativa**: 789.722 ÷ 497). TCE-RN (Sistema Legis, Res. 017/2020) e TCE-PI (Res. 09/2009) também pedem envio de legislação municipal; não encontrei consulta pública desses (**a confirmar**).

### 4.5 SAPL

Testei a API pública da câmara de Cacoal (RO) em 9/11/2026:

- `/api/norma/normajuridica/`: número, ano, datas, veículo, ementa, PDF, data de vigência, tipo e assuntos; 3.631 normas.
- `/api/norma/normarelacionada/` com `tipo_vinculo`, que vem em 14 tipos ("Altera o(a)", "Revoga integralmente", "Revoga parcialmente", "Revoga integralmente por consolidação", "Norma correlata" e outros). Cacoal tem 699 vínculos: um grafo de alterações pronto, no nível da norma.
- `/api/compilacao/dispositivo/`: **dispositivo a dispositivo**, com `inicio_vigencia`, `fim_vigencia`, `inicio_eficacia`, `fim_eficacia`, `dispositivo_substituido` e `dispositivo_atualizador`; 278 textos articulados e 21.149 dispositivos. É o modelo das Fichas 2 e 3.

**Limites.**
- O SAPL é da câmara: traz leis, resoluções e decretos legislativos, e **não traz decretos do Executivo** (regulamento do ISS, UFM, pauta de ITBI).
- A estimativa de 1.200 câmaras vem de fala de técnico do Senado reproduzida em notícias de 2026.

### 4.6 A Leis Municipais, explicada

- **Quem é.** Uma **empresa privada** (Leis Ltda, ligada à Liz Serviços Online, de Itapema/SC). **Não** é um órgão de prefeitura nem de estado.
- **Quem a contrata.** São as **próprias prefeituras e câmaras**, por inexigibilidade de licitação, para publicar e consolidar a legislação **delas**. O serviço inclui "consolidação, compilação, versionamento e gerenciamento dos atos oficiais".
- **O que ela entrega.** O contrato de Caçapava do Sul (abril de 2025) define versionamento como os textos "por cada período de tempo em que existiram alterações/revogações", o que permite ver "o texto vigente até a data selecionada". É exatamente o que a data do fato precisa.
- **Os valores encontrados.** Caçapava do Sul paga R$ 3.480 por ano; a proposta a Ilhota (dez/2023) é de R$ 12.865,60 por ano. Esses valores são **o que uma prefeitura paga pelo serviço para o próprio município**. **Não são o preço de uma licença para a Heild.**
- **Como seria para a Heild.** Usar a base deles seria uma **negociação entre empresas**, com preço desconhecido. A compilação é protegida (Lei 9.610, art. 7º, XIII) e o portal recusa acesso automatizado (403 em 9/11/2026). Então o caminho é **só por contrato**.
- **Status: opção em aberto.** **[Proposta]** Pedir uma cotação na Fase 0 sem compromisso, para comparar com o custo da base própria.

O Jusbrasil trata acessos por robôs como ilegítimos (Termos, 2.5.2). LegisWeb, IOB e Econet são de uso individual e servem só de conferência manual.

### 4.7 O que já existe consolidado

- A Leis Municipais, para os seus clientes.
- As câmaras que usam a compilação do SAPL.
- Portais oficiais de grandes cidades, como o Portal da Legislação da Prefeitura de São Paulo ([Casa Civil SP](https://prefeitura.sp.gov.br/web/casa_civil/w/portal-da-legisla%C3%A7%C3%A3o-ultrapassa-4-milh%C3%B5es-de-visualiza%C3%A7%C3%B5es-no-1%C2%BA-semestre-de-2025%C2%A0)).
- Republicações oficiais de códigos tributários consolidados. Não há inventário nacional; a Fase 0 levanta município a município.

### 4.8 Acesso formal

A Lei de Acesso à Informação manda os sites oficiais "possibilitar o acesso automatizado por sistemas externos em formatos abertos, estruturados e legíveis por máquina" (art. 8º, § 3º, III). Municípios com até 10 mil habitantes estão dispensados de publicar na internet (art. 8º, § 4º), mas continuam obrigados a responder pedidos (pesquisa 04, 6.4). São 2.469 municípios, com 6,0% da população. **[Dono]** A empresa aceita pedir por LAI e firmar convênios em seu nome.

---

## 5. O que muda o problema: NFS-e Nacional e reforma tributária

### 5.1 NFS-e Nacional

- Painel da Receita citado em 28/10/2026 ([Nota Gateway](https://notagateway.com.br/adesao-municipios-nfse/)):
  - **5.571 municípios conveniados**;
  - **5.466 em operação**, enviando ao Ambiente de Dados Nacional;
  - 3.062 usando o Emissor Nacional.
- Em janeiro de 2026 eram 1.898 em operação ([Portal da Reforma](https://www.reformatributaria.com/tecnologia/lista-de-municipios-aderentes-a-nfs-e-nacional-chega-a-5-465-so-347-estao-com-a-plataforma-em-operacao-ativa/)). A LC 214/2025 obriga o padrão nacional desde 2026.
- A API expõe **parâmetros municipais com vigência** ([manual de municípios v1.2, out/2025](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-municipios-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out21025.pdf)):
  - convênio;
  - **alíquotas por subitem da lista de serviços**, com regimes especiais e deduções;
  - retenções;
  - benefícios.
- **Consequência.** É uma tabela nacional, oficial e datada de alíquotas de ISS. Ela não é a lei (é o que a prefeitura cadastrou), mas serve para três coisas:
  - conferir a Ficha 4 automaticamente, sem revisor;
  - apontar divergência;
  - mostrar o parâmetro, rotulado, quando o município não tem cobertura.

### 5.2 Reforma tributária

- **ISS até 2032.** A EC 132/2023 reduz o ICMS e o ISS a 9/10 em 2029, 8/10 em 2030, 7/10 em 2031 e 6/10 em 2032, e os extingue a partir de 2033. Base: ADCT, arts. 128 e 129; o [Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm) bloqueia robôs; resumo da [PwC](https://www.pwc.com.br/pt/thinking-about-taxes/tax-intelligence/2023/reforma-tributaria-sobre-o-consumo-promulgacao-da-emenda-constitucional-n-132.pdf).
- **O ISS segue perguntado depois de 2033.** A decadência é de cinco anos (CTN, art. 150, § 4º, e art. 173, I), então fatos de 2032 seguem em revisão até cerca de 2038. A janela móvel de 5 anos do dono cobre isso enquanto andar com o tempo.
- **IBS também é lei local.** Cada ente fixa sua alíquota própria do IBS por lei específica; sem lei, vale a alíquota de referência do Senado (CF, art. 156-A, § 1º, V; LC 214, art. 14).
- **Ficam municipais, sem prazo:**
  - IPTU: a EC 132 permite atualizar a base de cálculo por ato do Executivo, nos critérios da lei municipal;
  - ITBI: a LC 227/2026, publicada em 14/01/2026, trouxe normas gerais ao CTN, com base de cálculo pelo valor de mercado;
  - taxas, COSIP, posturas, uso do solo e servidores.

### 5.3 Prioridade e horizonte por tipo de norma local

| Tipo | Valor | Horizonte | Prioridade |
|---|---|---|---|
| ICMS (RICMS, ST, benefícios), ITCMD, IPVA | Muito alto (contábil e BPO) | ICMS até 2032; consultas até ~2038; ITCMD e IPVA permanentes | **Lançamento**, 27 UFs |
| Código tributário municipal e leis de ISS | Muito alto (contábil e BPO) | Até 2032; consultas até ~2038 | **Lançamento**, onde for fácil; sob demanda no resto |
| Regulamento do ISS, decretos de NFS-e | Alto | Idem | Idem |
| IPTU, ITBI, taxas, COSIP, UFM, REFIS | Alto | Permanente | Idem |
| Lei estadual e municipal de alíquota do IBS | Alto a partir da transição | 2029 em diante | Monitorar desde já |
| Feriados municipais (Lei 9.093/1995) e pisos estaduais | Médio (DP) | Permanente | Lançamento |
| Posturas, uso do solo, plano diretor, servidores, licitações locais | Alto na advocacia | Permanente | Com os módulos jurídicos (seção 6) |
| Créditos orçamentários, denominação de ruas, títulos honoríficos | Nenhum | — | Descartar na triagem |

---

## 6. Módulos de base legal

**[Dono]** O Assistente e o Consultor serão vendidos com bases de leis em **módulos menores**. O contábil e o BPO vêm no lançamento; os jurídicos seguem do mais comum ao menos comum.

### 6.1 De onde vem cada parte

- **Ranking e ordem dos módulos jurídicos:** [J9](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/pesquisa/juridico/J9-ordem-dos-modulos-de-base.md) (8/11/2026). O critério é o percentual de advogados por área principal, do Perfil ADV (CFOAB e FGV, n = 20.885). O volume de casos novos do CNJ (Justiça em Números 2024 e 2025) serve de desempate.
- **Corpus mínimo, fontes, camadas e níveis de maturidade:** JU-04, seções 3.1 a 3.4 (camadas L0 normas, L1 súmulas e teses, L2 jurisprudência, L3 doutrina e modelos, L4 tabelas, L5 território).
- **Atividades de cada área:** J3 (234 atividades em 12 áreas). O prazo é o centro de gravidade da advocacia (J3, seção 1).
- **Jurídico como próximo pacote:** J6 coloca o jurídico em 1º lugar entre os pacotes candidatos e o DP/SST como extensão barata do contábil.
- **Decisão já tomada no JU-04 (9/11/2026):** na onda 2, Família antes de Trabalhista.
- **Novo nesta versão:** as colunas de camada estadual e municipal de cada módulo. Nada aqui refaz a pesquisa. O que não estava em J9 ou no JU-04 vem marcado **[acréscimo]** e deve ser conferido.

### 6.2 Módulos do lançamento: contábil e BPO

**[Proposta]** A divisão em módulos do contábil é nova; o conteúdo vem do Plano de Ingestão (seções 3, 5 e 6) e do Plano do Assistente (Camada 1).

| Módulo | Federal (10 anos) | Estadual (27 UFs, 5 anos) | Municipal (5 anos) | Reuso |
|---|---|---|---|---|
| **T1 · Tributário federal** | CTN; LC 123 e resoluções do CGSN; LC 214 e LC 227 (CBS, IBS, IS); leis de PIS/Cofins, IRPJ/CSLL e IPI; RIR e RIPI; INs da RFB; Soluções de Consulta COSIT; CARF; temas do STF e do STJ | — | — | Jurídico M7 |
| **T2 · Tributos estaduais** | LC 87/1996, LC 24/1975, convênios e ajustes do CONFAZ, resoluções do Senado sobre alíquotas interestaduais, normas gerais do ITCMD (LC 227) | RICMS e anexos (ST, MVA), leis e decretos de ICMS, ITCMD e IPVA, respostas a consultas, tribunal administrativo | — | Jurídico M7; ITCMD no M5 Família |
| **T3 · Tributos municipais** | LC 116 (com o mínimo de 2%), CF arts. 156 e 156-A, normas gerais do ITBI (LC 227), LC 214 (IBS) | — | Núcleo tributário: código tributário, ISS, IPTU, ITBI, taxas, COSIP, UFM, REFIS, regulamentos, alíquota do IBS; fácil (C1) e sob demanda (C2/C3) | Jurídico M7, M10 |
| **D1 · Trabalhista e previdenciário do DP** | CLT, legislação previdenciária, eSocial, FGTS, Portaria MTE 671/2021; convenções e acordos coletivos (Mediador) | Pisos salariais estaduais onde instituídos **[acréscimo]** | Feriados municipais (Lei 9.093/1995) **[acréscimo]** | Jurídico M3 A e M3 B |
| **S1 · Societário e registro** | CC Livro II, Lei 6.404, Lei 8.934, Decreto 1.800, INs do DREI, Lei 13.874, Redesim | Atos das 27 Juntas Comerciais | Alvará e licença de funcionamento **[acréscimo]**, sob demanda | Jurídico M8 |
| **K1 · Normas contábeis** | NBC, CPC e ITG do CFC | — | — | — |
| **B1 · BPO financeiro** | Retenções na fonte (IRRF; CSRF, Lei 10.833/2003, art. 30; INSS, Lei 8.212, art. 31), documentos fiscais (NF-e, NFS-e), normas do Banco Central sobre Pix e boleto, duplicata (Leis 5.474/1968 e 13.775/2018), protesto (Lei 9.492/1997), juros e multa (CC e Lei 14.905/2024), LGPD, split payment (LC 214) | Fatia do T2: ST e diferencial de alíquota nas compras | Fatia do T3: ISS retido pelo tomador (LC 116, art. 6º, e a lei municipal) | **[acréscimo]** Corpus a validar com o subplano 10 (BPO) |

**[Proposta] Venda:** um pacote Contábil (T1, T2, T3, D1, S1, K1) e um pacote BPO (B1, com as fatias de T2 e T3 só para leitura e citação, pela regra de "fatia" do JU-04, 3.3). Preço fica no Estudo de Precificação.

### 6.3 Módulos jurídicos, do mais comum ao menos comum

Percentual de advogados por área principal e corpus federal de J9 e do JU-04, 3.2. Onda de construção do JU-04, 3.3.

| # | Módulo | Advogados (área principal) | Federal | Estadual | Municipal | Reuso do lançamento | Onda |
|---|---|---:|---|---|---|---|---|
| 0 | **N0 Núcleo** | todos | CF, LINDB, Estatuto e Ética da OAB, CPC, CPP, CLT processual, Lei 9.099, súmulas vinculantes, índices | Calendário forense por tribunal (JU-03), custas por UF | Feriados locais, via calendário dos tribunais | — | 0 |
| 1 | **Civil e Processual Civil** | 26% | CC, CPC, Leis 9.099, 9.307, 13.140; súmulas e temas do STJ | Custas e prazos por UF; regimentos dos TJs **[acréscimo]** | — | — | 1 |
| 2 | **Família e Sucessões** | 14% | CC Livros IV e V, procedimentos do CPC, Leis 5.478, 11.441, 12.318, 13.058, ECA, provimentos do CNJ | **ITCMD (27 leis)**; códigos de normas das corregedorias (extrajudicial) | — | T2 (ITCMD) | 2 |
| 3 | **Trabalhista** | 12% | CLT, Lei 13.467, súmulas, OJs e PNs do TST, convenções e acordos (Mediador), índices (ADC 58) | Pisos estaduais **[acréscimo]** | Feriados municipais **[acréscimo]** | D1 | 2 |
| 4 | **Previdenciário** | 11% | Leis 8.212 e 8.213, Decreto 3.048, EC 103, normas do INSS, TNU | Regimes próprios de servidores **[acréscimo]**, fora da primeira versão | Regimes próprios de servidores **[acréscimo]**, fora da primeira versão | D1 | 2 |
| 6 | **Consumidor e Bancário** | 6% | CDC, Decretos 2.181 e 11.034, Lei 14.181, súmulas do STJ, normas do CMN e do BC | Leis estaduais de consumo **[acréscimo]** | Leis municipais de consumo (ex.: tempo de espera em agência) **[acréscimo]**, sob demanda | — | 3 |
| 5 | **Penal e Processual Penal** | 8% | CP, CPP, LEP, Leis 11.343, 11.340, 12.850, 13.964 | — | — | — | 3 (depois do Consumidor, pelo portão do JU-04) |
| 7 | **Empresarial** | 4% | CC Livro II, Leis 6.404, 11.101, 13.874, 14.195, LC 123, DREI | Juntas Comerciais | Alvarás, sob demanda | S1 | 4 |
| 8 | **Tributário** | 3% | CTN, Lei 6.830, Decreto 70.235, LC 116, EC 132, LC 214, temas do STJ e do STF, CARF | Tribunais administrativos, processo administrativo estadual | Processo administrativo tributário municipal | T1, T2, T3 (custo marginal muito baixo, J9) | 4 |
| 9 | **Imobiliário** | 3% | Leis 8.245, 6.015, 13.465, 4.591, 13.786, CC Livro III | Códigos de normas das corregedorias; ITCMD | **IPTU, ITBI, plano diretor, uso do solo, código de obras** (pesado; sob demanda) | T3 (IPTU, ITBI) | 5 |
| 10 | **Saúde e Planos** | 1% | Lei 9.656, resoluções e rol da ANS, STJ e STF | — | — | — | 5 |
| 11 | **Administrativo** | sem linha própria | Leis 14.133, 9.784, 8.429 e 14.230, LAI, TCU | Processo administrativo, estatutos de servidores, normas dos TCEs | **Estatutos de servidores, licitações locais, posturas** (pesado; sob demanda) | Coletores municipais | 5 |
| 12 | **LGPD e Digital** | 0% | LGPD, ANPD, Marco Civil, Leis 12.846 e 9.613 | Decretos de regulamentação local **[acréscimo]** | Idem | — | 6 (pode correr em paralelo desde a 2) |
| 13 | **Ambiental** | 1% | Lei 9.605, Código Florestal, CONAMA | Legislação e licenciamento ambiental estaduais **[acréscimo]** | Licenciamento municipal **[acréscimo]** (o DOM/SC tem a categoria) | — | 6 |
| 14 | **Eleitoral** | 0% | Legislação eleitoral, resoluções do TSE | — | — | — | 6 (janela de 2028) |
| 15 | **Agrário** | 0% | Normas fundiárias **[a confirmar no JU-04]** | Terras estaduais **[acréscimo]** | — | — | 7 |
| 16 | **Propriedade Intelectual** | 0% | Leis 9.279, 9.609, 9.610, INPI, tratados | — | — | — | 7 |
| 17 | **Militar** | sem linha | CPM, CPPM, STM | Estatutos dos militares estaduais **[acréscimo]** | — | — | 7 |
| 18 | **Marítimo** | sem linha | Tribunal Marítimo, tratados | — | — | — | 7 |
| 19 | **Internacional** | sem linha | Tratados (Planalto e MRE) | — | — | — | 7 |

Leitura:
- **Os cinco primeiros jurídicos concentram 71% dos advogados**, e o pacote A de J9 (Núcleo, Civil, Família, Trabalhista, Previdenciário e Consumidor) também chega a 71% (26 + 2 de Contratual + 14 + 12 + 11 + 6).
- **Quase todo o peso local dos módulos jurídicos está no estadual** (custas, ITCMD, corregedorias), que o dono já decidiu cobrir.
- **O municipal pesado** se concentra em **Imobiliário** e **Administrativo** (ondas 5) e fica sob demanda, como o resto do municipal.

### 6.4 Ordem de construção

| Etapa | Módulos | Status |
|---|---|---|
| Lançamento | N0 compartilhado (a parte que o contábil usa) + T1, T2, T3, D1, S1, K1 + B1 | **[Dono]** contábil e BPO primeiro |
| Jurídico, onda 0 | N0 completo (prazos, calendário forense, índices) | JU-04 |
| Onda 1 | Civil e Processual Civil | J9, JU-04 |
| Onda 2 | Família e Sucessões; depois Trabalhista e Previdenciário, em dupla | JU-04 (decisão de 9/11/2026) |
| Onda 3 | Consumidor e Bancário; depois Penal | J9 (inversão documentada) |
| Onda 4 | Empresarial e Tributário, em paralelo | J9 |
| Onda 5 | Imobiliário, Saúde, Administrativo (o municipal pesado entra aqui, sob demanda) | J9 |
| Onda 6 | LGPD (em paralelo desde a 2), Ambiental, Eleitoral | J9 |
| Onda 7 | Agrário, PI, Militar, Marítimo, Internacional, como base mínima | J9, JU-04 |

**[Proposta]** Como o lançamento já constrói T1 a T3, D1 e S1, os módulos jurídicos **Tributário (8)**, **Empresarial (7)** e a parte material do **Trabalhista (3)** ficam quase prontos. Eles podem ser oferecidos como complementos baratos antes da onda 4, sem mudar a ordem principal. A regra de J9 permite inverter "com motivo escrito (ganho de custo muito grande)"; o motivo é o reuso.

---

## 7. Decisões

| # | Decisão | Status | Por quê |
|---|---|---|---|
| D1 | Primeiros clientes: contábil e BPO; advocacia depois, em módulos | **[Dono]** | — |
| D2 | Estadual: os 27 entes | **[Dono]** | Corrigido o que se espera disso e calculado o custo na seção 3 |
| D3 | Municipal: só o que é fácil de puxar; o resto sob demanda e pelo feedback | **[Dono]** | Os 338 acima de 100 mil viram a ordem da fila, não meta |
| D4 | Janela: 10 anos no federal; 5 no estadual e no municipal | **[Dono]** | — |
| D5 | Sem revisor dedicado no começo | **[Dono]** | Redesenho na seção 13 |
| D6 | Texto atual sem histórico (C2) pode ser lançado, rotulado | **[Dono]** | Rótulos na seção 8 |
| D7 | LAI e convênios em nome da empresa; CAPTCHA por pessoa no celular como reserva | **[Dono]** | Cuidados na seção 10.2 |
| D8 | A unidade de cobertura é **ente local × domínio × nível** (C0 a C4) | [Proposta] | O Consultor precisa saber o que pode afirmar sobre um município ou UF numa data |
| D9 | Núcleo tributário primeiro no local | [Proposta], coerente com D1 | 7,5% das leis e 2,6% dos decretos municipais são tributários |
| D10 | Coletor por plataforma, reaproveitando o Querido Diário (MIT, com atribuição) | [Proposta] | 85,5% dos raspadores do Querido Diário são instâncias de 21 plataformas |
| D11 | Hierarquia de fontes: (1) veículo oficial = prova; (2) bases estruturadas (SAPL, BLM, DOM/SC, SIGPub) = descoberta e metadados; (3) consolidações de terceiros = conferência, só com contrato; (4) parâmetros da NFS-e = tabela declarada | [Proposta] | A citação tem de apontar para a publicação oficial |
| D12 | O modelo extrai eventos com evidência literal; o código consolida | [Proposta] (princípio 4 do Plano de Ingestão) | Acerto exato de 50% e 20% quando o modelo consolida (seção 11.2) |
| D13 | Toda versão local carrega a certeza da cadeia | [Proposta] | Sem isso o Consultor diria "vigente em 2023" sem saber se faltou uma lei |
| D14 | Anterioridade tributária é regra do validador | [Proposta] | Erro de data do fato mais provável em lei de dezembro |
| D15 | Exceção não resolvida pela automação **não bloqueia a base**: rebaixa a certeza e o nível, rotulados, e só vira trabalho humano quando alguém pergunta | [Proposta], consequência de D5 | Sem revisor, bloquear seria não ter base |
| D16 | O usuário é revisor do próprio município: "reportar" e "confirmar", sempre ancorados na publicação oficial | [Proposta], consequência de D5 | Quem usa a lei local todo dia é quem mais rápido nota o erro |
| D17 | Leis Municipais: opção em aberto, com cotação sem compromisso | [Proposta] | Preço de licença para a Heild é desconhecido |
| D18 | Triagem LGPD na entrada | [Proposta] | A base de leis não precisa dos dados pessoais dos diários |
| D19 | Laço de melhoria inspirado na DGM também na ingestão, offline, contra conjuntos-ouro | [Proposta] | Coletores e extratores são o que mais muda |

---

## 8. Níveis de cobertura, rótulos e onde aparecem

### 8.1 Os níveis

Valem para **cada ente local (UF ou município) e cada domínio** (ICMS, ISS, IPTU...).

| Nível | Nome curto (rótulo) | O que existe na base | Exige pessoa? |
|---|---|---|---|
| **C0** | **Sem base local** | Nada | Não |
| **C1** | **Só publicações novas** | Atos novos monitorados desde uma data, sem texto atualizado | Não |
| **C2** | **Texto atual · sem histórico** | Texto vigente, ancorado numa consolidação oficial (ou montado e conferido automaticamente), com fluxo ativo | **Não**, quando a âncora é consolidação oficial e as conferências automáticas passam ([Proposta], seção 13) |
| **C3** | **Com histórico de 5 anos** (no federal, 10) | Cadeia de 5 anos, versões por dispositivo | Não para publicar; o que a automação não fecha fica marcado com certeza baixa |
| **C4** | **Amplo** | C3 mais domínios jurídicos (urbanismo, posturas, servidores) | Idem |

O nível sai de regras sobre o registro `cobertura_local` (`ente`, `dominio`, `nivel`, `vigencia_coberta_de`, `vigencia_coberta_ate`, `cadeia_status`, `fontes[]`, `ultima_coleta`, `atraso_medio_horas`, `pendencias[]`), nunca de declaração manual. Coletor parado rebaixa o nível sozinho.

### 8.2 O texto que o Consultor mostra

**[Proposta]** Textos curtos, com variáveis entre chaves:

| Nível | Texto |
|---|---|
| C0 | "**Sem base local.** Ainda não tenho a legislação de {ente} sobre {domínio}. Respondo pela regra federal; {ente} pode ter regra própria. Já pedi a inclusão." |
| C1 | "**Só publicações novas.** Acompanho as publicações de {ente} desde {data}, mas ainda não tenho o texto atualizado de {norma}. Cito o ato publicado; não afirmo a regra vigente." |
| C2 | "**Texto atual · sem histórico.** Tenho o texto atual de {norma} de {ente}, conferido em {data}. Para fatos antes de {data da âncora}, não confirmo qual redação valia." |
| C3 | "**Com histórico desde {data}.** Redação vigente em {data do fato}." Mais "certeza média" ou "certeza baixa" quando for o caso, com o motivo ("falta localizar uma lei de 2022 citada na cadeia"). |
| C4 | Igual ao C3, com os domínios cobertos. |

Variante para a conferência pela NFS-e (C0 a C2): "{ente} cadastrou {X}% para este serviço no Sistema Nacional da NFS-e (consultado em {data}). É um parâmetro, não a lei."

### 8.3 Onde aparece

1. **No cartão de citação**, ao lado do nome do ente: o rótulo curto, sempre.
2. **Na primeira linha da resposta**, só quando o nível limita a conclusão: C0, C1, C2 com data do fato anterior à âncora, ou C3 com certeza baixa no dispositivo central.
3. **No rodapé da resposta**: "Cobertura local: {ente}, {domínio}: {rótulo}", com o botão "Reportar".
4. **Na saída de `legal.consultar`** (`cobertura_local`) e em `lacunas[]`, para a verificação (07, seção 7) e para os outros integrantes.
5. **Numa página "Cobertura"** do escritório, com o nível de cada UF e município dos seus clientes, o pedido de inclusão e o prazo estimado.

---

## 9. Modelo de dados: o que muda nas fichas

As seis fichas do Plano de Ingestão ficam. O local entra como **extensão** (princípio 6):

| Ficha | Campos novos | Para quê |
|---|---|---|
| 1 · Norma | `ente_ibge` (UF ou município); `veiculo_oficial` e `veiculo_desta_publicacao`; `ids_externos` (SAPL, BLM, DOM/SC, SIGPub, Querido Diário); `fonte_descoberta`; `republicacao_de`; `pii` | Provar a publicação, deduplicar, rastrear |
| 2 · Dispositivo e versão | `certeza_vigencia` (alta, média, baixa) e motivo; `ancora_id`; `conferido_por` (automático, pessoa, reporte de usuário confirmado) | Grau de segurança e rastreio |
| 3 · Evento | `origem_evento` (extraído, vínculo SAPL, revogação genérica sinalizada, anterioridade aplicada, reporte de usuário); `revisado_por` | Saber o que veio do texto e o que veio de regra ou de reporte |
| 4 · Tabela normativa | `conferencia_nfse` (valor, data, divergência) | Conferir alíquotas de ISS |
| Nova: Âncora | Norma-mãe, texto-base, fonte (publicação original, republicação oficial, consolidação oficial, consolidação contratada), data | Começar a cadeia de um ponto confiável |
| Nova: Cadeia | Norma-mãe, alteradoras ordenadas, lacunas, status | Calcular `cadeia_status` |
| Nova: Reporte | Ente, dispositivo ou norma, tipo, link da publicação oficial, quem, quando, resultado da nova verificação | Fluxo do usuário como revisor (seção 13.4) |

O esquema plano do anexo (`texto_completo`, `status`, `data_vigencia`) guarda uma foto, não a história; não é adotado.

---

## 10. Pipeline local

### 10.1 Etapas

O caminho é o do Plano de Ingestão (seção 4.3), com estas etapas a mais:

| Etapa | O que faz | Quem | Saída |
|---|---|---|---|
| 0 · **Mapa de fontes** | Por ente: veículo oficial, plataforma do diário, SAPL, BLM, Querido Diário, portal, consolidação oficial, contato para LAI | Agente **mapeador**; o dono confirma o que for contrato | Ficha do ente |
| 1 · Coleta | Coletor por plataforma; detecção de mudança sem IA; original imutável com hash | Código mantido por agente | Original |
| 2 · Segmentação | Já vem por ato em DOM/SC, SIGPub, SAPL e BLM; em PDF de diário inteiro, regras de cabeçalho e layout; modelo só no que as regras não fecham | Código + modelo barato | Atos |
| 3 · Texto e OCR | Camada de texto quando existe; OCR em escada: Tesseract ou docTR → olmOCR ou Marker em GPU própria → modelo de visão só nas páginas ruins | Código | Texto com confiança por página |
| 4 · Triagem | Normativo? Do núcleo? Altera outra norma? Descarta crédito orçamentário, nomeação, denominação | Regras + modelo barato | Ato relevante ou descarte |
| 5 · **Montagem da cadeia** | Alteradoras de cada norma-mãe (vínculos SAPL, citações, BLM, busca no diário); escolha da âncora | Agente **montador de cadeia** | Âncora e Cadeia |
| 6 · Extração | Fichas 1 a 4 com evidência literal; **dois extratores de famílias diferentes** | Modelos | Eventos |
| 7 · Validação | Regras do Plano de Ingestão + locais (seção 11.4) | Código | Aprovado ou falhas |
| 8 · Consolidação | Aplica eventos em ordem de eficácia | Código | Linha do tempo |
| 9 · Conferência | Compilação SAPL, consolidação oficial, parâmetros da NFS-e, RICMS consolidado da Sefaz | Código + modelo barato | Divergências |
| 10 · Publicação | Portões automáticos (seção 13.3); atualiza `cobertura_local`; emite `legislacao.publicar` | Código | Base de produção |

**Referências.**
- **Segmentação.** O DODFMiner (KnEDLe/UnB) segmenta, classifica e extrai entidades de atos do Diário Oficial do DF. O artigo relata F1 médio de 0,778 na classificação e 0,851 em entidades ([documentação](https://dodfminer.readthedocs.io/en/main/user/intro.html); números segundo resumo).
- **OCR.** O olmOCR custa menos de US$ 200 por milhão de páginas em GPU própria; no olmOCR-Bench, o olmOCR 2 marca 82,4, o Marker 76,1 e a API da Mistral 72,0 ([olmOCR](https://arxiv.org/abs/2502.18443); números segundo resumos).
- Nenhum desses testes foi feito em diário brasileiro municipal. A escada de OCR será escolhida pelo conjunto-ouro (seção 16).

### 10.2 Coleta: LAI, convênio e o CAPTCHA como reserva

**[Dono]** A ordem dos caminhos, para qualquer fonte pública oficial:

1. API, dados abertos ou serviço oficial (DOM/SC, SAPL, LexML, Querido Diário).
2. Coleta automatizada respeitosa:
   - pedido identificado com contato;
   - respeito ao robots.txt e aos termos de uso;
   - no máximo uma requisição por segundo por site, em janela noturna;
   - cache.
3. **LAI e convênio**, em nome da empresa, abertos já na Fase 0 para as fontes que bloqueiam ou que valem um acordo: CIGA, TCE-RS, Interlegis, AMM, Sefaz e assembleias. Prazos da LAI: 20 dias, prorrogáveis por mais 10, mais recursos (pesquisa 04).
4. **Reserva: CAPTCHA resolvido por pessoa no celular**, como no Plano de Ingestão (seção 5.6). O coletor pausa, a pessoa recebe um link de uso único, resolve o CAPTCHA na página real e a coleta segue com a sessão.

**Cuidados obrigatórios no passo 4** ([Proposta]):
- Só **fontes públicas oficiais** de atos normativos: diário oficial, portal de legislação da prefeitura ou da câmara, Sefaz. **Nunca** agregadores privados (Leis Municipais, Jusbrasil) nem portais cujos termos proíbam robôs.
- **Em paralelo à LAI ou ao convênio, nunca no lugar.** Quando a via formal responder, o CAPTCHA deixa de ser usado naquela fonte.
- **Taxa de navegação humana**: no máximo uma requisição a cada 5 segundos e só os documentos que faltam. A sessão não é usada para baixar o acervo inteiro.
- **Registro completo**: quem resolveu, quando, qual fonte, quantos documentos baixou na sessão.
- Parada imediata se o site mostrar aviso de proibição, bloquear o IP ou pedir login.
- Parecer do advogado do grupo antes do primeiro uso.

**O risco, dito com clareza.**
- Um CAPTCHA num portal de legislação é o sinal mais claro de que o publicador não quer coleta automatizada.
- Uma pessoa resolver o desafio e o robô seguir com a sessão contorna essa intenção, mesmo sendo uma pessoa que resolve.
- Os riscos concretos:
  - contrariar os termos de uso do site;
  - ter o IP bloqueado e perder a fonte;
  - desgaste com o órgão público com quem se pede convênio ao mesmo tempo;
  - questionamento jurídico se o volume baixado não parecer uso humano.
- Por isso o passo 4 é reserva, limitado e registrado, e convive com a via formal em vez de substituí-la.

---

## 11. Alteração, revogação, vigência e texto compilado

### 11.1 O que os números de SC dizem

Só 4,3% das leis usam "(NR)", 11,8% dizem "passa a vigorar com a seguinte redação", 8,3% revogam expressamente e 22,9% revogam "as disposições em contrário" (seção 2.3). Um detector por expressão regular perde a maior parte das alterações e não vê a revogação tácita.

### 11.2 O que a literatura diz

- Modelo gerador aplicando emendas do orçamento francês ao Código Geral de Impostos: sucesso de "mais de 63%" num projeto difícil ([Etcheverry et al., NLLP 2024](https://aclanthology.org/2024.nllp-1.13/)).
- Consolidação por LLM de quatro códigos alemães, 908 pares emenda–lei ([Prior et al., NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)):
  - similaridade de 93% a 99%;
  - mas acerto exato de **50,3%** em um passo e **20,51%** em cadeias;
  - conclusão dos autores: a saída é rascunho sujeito a verificação humana rigorosa.
- O mesmo artigo resume dois casos com regras:
  - leis japonesas estruturadas: 99,47% (Ogawa et al., 2008);
  - leis gregas em PDF heterogêneo: 37,1%, subindo a 59,4% com correção manual (Garofalakis et al., 2016).

O município brasileiro se parece mais com o caso grego. Daí D12: o modelo identifica **o quê** muda e o código aplica.

### 11.3 Procedimento por norma-mãe

1. **Inventário da cadeia**, juntando quatro lados: vínculos do SAPL, citações extraídas dos textos do ente, BLM e LexML, busca no diário.
2. **Âncora**, nesta ordem:
   - republicação oficial consolidada;
   - consolidação oficial;
   - publicação original;
   - consolidação contratada, só se houver contrato e depois de conferida contra a publicação oficial.
3. **Extração dos eventos**, com dois extratores e evidência literal.
4. **Aplicação** em ordem de eficácia.
5. **Teste de aplicação limpa**: todo dispositivo-alvo existe na versão anterior e, quando a alteradora cita o texto antigo, ele bate. Falha rebaixa a certeza.
6. **Conferência por repetição** contra qualquer texto compilado oficial posterior (SAPL, portal, republicação, RICMS consolidado).
7. **Status da cadeia**: completa, ou com lacuna registrada.

### 11.4 Regras do validador para o local

- **Anterioridade:** evento que institui ou aumenta tributo não produz efeito antes de 1º de janeiro do exercício seguinte nem antes de 90 dias da publicação (CF, art. 150, III, b e c), salvo as exceções do § 1º (a fixação da base do IPTU escapa dos 90 dias). Divergência vira alerta.
- **Revogação genérica:** gera **sinal**, nunca evento.
- **Veículo:** ato fora do veículo oficial fica marcado.
- **Republicação e retificação:** ligadas ao ato original.
- **Localidade:** a URN do evento e a do alvo são do mesmo ente, salvo norma federal ou estadual citada.
- **Decreto que diz alterar lei:** vai para exceção.

### 11.5 Certeza da versão

| Certeza | Condição |
|---|---|
| Alta | Âncora oficial, cadeia completa, aplicação limpa, conferência por repetição sem divergência, extratores de acordo |
| Média | Âncora oficial, cadeia completa, aplicação limpa, extratores de acordo, sem texto oficial para conferir |
| Baixa | Lacuna na cadeia, revogação genérica pendente, extratores em desacordo, OCR abaixo do limiar ou reporte de usuário em aberto |

---

## 12. Identificadores, deduplicação, hash e grafo

- **URN LexML:** município `urn:lex:br;sao.paulo;campinas:municipal:lei:AAAA-MM-DD;número`, com autoridade "municipal" ([especificação, Parte 2](https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf)); estadual com autoridade "estadual". O espaço "lex" está na [RFC 9676](https://www.rfc-editor.org/rfc/rfc9676.html) (maio de 2025, informacional).
- **Chave natural** dentro do ente: (código IBGE, tipo, número, ano), com grafias normalizadas.
- **Hash:**
  - SHA-256 dos bytes do original;
  - hash do texto normalizado entre fontes do mesmo ente;
  - MinHash só **dentro** do ente, porque textos parecidos entre municípios são prováveis (minutas-modelo, a medir) e não são o mesmo ato.
- **Prova de publicação:** código do SIGPub, `codigo` do DOM/SC, id do SAPL em `ids_externos`.

**Grafo de remissões.**

| Aresta | De onde vem |
|---|---|
| altera, acrescenta, revoga | Ficha 3 e vínculos do SAPL |
| regulamenta | Decreto que cita a lei que regulamenta |
| remete | "nos termos do art. X da Lei Y" |
| aplica norma de outra esfera | Citação de LC 116, LC 214, LC 87, CTN, lei estadual |
| revogação genérica (sinal) | "revogam-se as disposições em contrário"; liga a normas do mesmo tema; não é evento |

O grafo é particionado por ente, e a camada federal é compartilhada.

---

## 13. Revisão humana: o que é e como operar sem revisor

### 13.1 O que conta como "revisão humana"

O dono perguntou o que uma pessoa faria. É uma lista curta e concreta:

| Tarefa | O que a pessoa faz | Tempo por item (**estimativa**) |
|---|---|---|
| **Conferir a âncora** | Abrir a consolidação ou a publicação usada como texto-base e confirmar que é a vigente e oficial (não um rascunho, nem uma versão antiga) | 15 a 60 min por norma-mãe |
| **Eventos de baixa confiança** | Ler a alteradora e o dispositivo-alvo quando os dois extratores discordam ou a aplicação não fecha, e dizer qual leitura está certa | 5 a 8 min por evento |
| **Revogação genérica** | Decidir se "revogam-se as disposições em contrário" atingiu algum dispositivo do mesmo tema | 5 a 10 min por caso |
| **Cadeia com lacuna** | Achar a lei citada que não foi localizada (diário, portal, pedido à prefeitura) ou marcar como "não localizada" | 10 a 30 min por lacuna |
| **Decreto que diz alterar lei** | Decidir se é erro de redação, regulamentação ou ilegalidade a sinalizar | 5 a 10 min |
| **Auditoria amostral** | Sortear dispositivos, comparar com a publicação oficial e registrar o erro | 3 min por dispositivo |

**Sem a auditoria amostral, não há número de erro para publicar.** Esta é a tarefa que não dá para eliminar.

### 13.2 O redesenho para começar sem revisor

**[Proposta]**, para cumprir D5:

1. **Automação máxima.**
   - Dois extratores de famílias diferentes (o Plano de Ingestão já prevê).
   - Reconciliador automático que busca mais contexto.
   - Teste de aplicação limpa.
   - Regras do validador.
   - O que fecha publica sozinho.
2. **Conferência cruzada automática**, que faz o papel da "segunda leitura":
   - **parâmetros da NFS-e** para alíquotas de ISS;
   - **compilação do SAPL** para leis de câmaras que a usam;
   - **consolidações oficiais** (portal da prefeitura, RICMS da Sefaz, normas.leg.br no federal) por repetição.
3. **C1 e C2 sem pessoa.**
   - C1 é só o ato publicado, citado como tal.
   - C2 é publicado sem pessoa quando a âncora é **consolidação oficial** e as conferências passam.
   - Quando a âncora é a publicação original, C2 também sai, com certeza média.
4. **Exceção não bloqueia (D15).** O que a automação não fecha:
   - fica publicado com certeza baixa e o motivo visível;
   - entra numa **fila de exceções puxada pela demanda**, onde só sobe quem alguém perguntou ou reportou. O resto espera, rotulado.
5. **O usuário como revisor (D16).** Fluxo na seção 13.4.

### 13.3 Portões automáticos

Uma versão entra em produção, sem pessoa, se:
- passou no validador;
- os dois extratores concordam nos campos de núcleo;
- a aplicação foi limpa;
- e bateu com a conferência quando ela existe.

Se não tiver conferência, entra com certeza média. Se falhar em qualquer item, entra com certeza baixa e vai para a fila puxada pela demanda.

**Muda em relação ao Plano de Ingestão**, que exigia aprovação do revisor modelo e auditoria humana por portão: aqui o revisor modelo continua, mas a ausência de pessoa vira **rótulo**, não bloqueio.

### 13.4 O usuário como revisor

**[Proposta]** Dois botões em toda citação de norma local e uma regra de confiança.

**Reportar.** Opções:
- "falta uma norma";
- "esta redação mudou";
- "foi revogada";
- "ente errado";
- "alíquota diferente".

Campo opcional para o link ou o PDF da **publicação oficial**, e aviso para não colar dado de cliente. O que acontece depois:
1. O sistema busca a publicação indicada (ou a procura pelo número e ano) na fonte oficial.
2. Se achar e o texto sustentar o reporte (por exemplo, uma lei alteradora que faltava), roda o pipeline e corrige sozinho. A versão sai marcada "corrigida por reporte, conferida na publicação oficial".
3. Se não achar ou não fechar, o reporte vai para a fila de exceções com prioridade.
4. Quem reportou recebe o resultado ("aplicado em {data}" ou "não confirmado na publicação oficial; seguimos verificando").

**Confirmar.** Depois de uma resposta com norma local em C2 ou C3, um toque opcional: "confere com o que você conhece / não confere".
- "Não confere" funciona como um reporte.
- "Confere" é **sinal**, não prova: conta confirmações de escritórios diferentes, mas nunca eleva a certeza a "alta" sozinho, porque a base legal continua sendo a publicação oficial.

**Regras de confiança:**
- Só usuários autenticados com papel profissional reportam e confirmam.
- Há limite por usuário.
- O peso de quem reporta cresce com o histórico de reportes que se confirmaram.
- No **jurídico**, o reporte leva só a norma e o link oficial, nunca dado de caso, para respeitar a regra do JU-04 de não aprender entre escritórios além da base pública.
- Reportes confirmados viram casos do benchmark, sem dado de cliente (07, 9.2).

### 13.5 Horas nesse cenário

**Estimativa** em regime, por mês, com as premissas na linha:

| Item | Conta | Horas/mês |
|---|---|---:|
| Exceções do fluxo federal | 550 atos (pesquisa 02) × 3% × 8 min | 2,2 |
| Exceções do fluxo estadual | 743 atos normativos × 3% × 8 min | 3,0 |
| Exceções do fluxo dos municípios em C2/C3 | 100 municípios × 0,8 ato tributário × 5% × 6 min | 0,4 |
| Cobertura sob demanda | 10 municípios por mês × 0,5 h (seção 20.4) | 5,0 |
| Reportes que a automação não resolve | 20 × 5 min | 1,7 |
| Exceções puxadas por pergunta | 30 dispositivos × 5 min | 2,5 |
| Auditoria amostral mínima | 30 dispositivos × 3 min + registro | 2,0 |
| CAPTCHA pelo celular | 10 sessões × 2 min | 0,3 |
| **Total** | | **≈ 17 h/mês** (faixa de 10 a 30) |

Pontuais:
- auditoria de 100 dispositivos no portão da Fase 1 (≈ 5 h);
- o congelamento do núcleo das fichas do Plano de Ingestão, que pede pessoas preenchendo 60 documentos à mão. Esse é um requisito do plano geral, não do municipal, mas é o maior trabalho humano que não dá para pular.

Comparação com a versão 0.1: lá eram ~6 h por município, ~2.000 h para os 338; aqui, ~0,5 h por município sob demanda e ~17 h por mês para a base inteira. A diferença vem de **não revisar antes** o que ninguém perguntou e de usar conferência automática e usuários no lugar da segunda leitura humana.

**O que ainda exige uma pessoa, mesmo pouca:**
- auditoria amostral, sem a qual não há taxa de erro;
- CAPTCHA;
- exceções de dispositivos que alguém perguntou e a automação não fechou (revogação genérica, decreto que diz alterar lei, lacuna sem a publicação);
- pedidos de LAI, convênios e eventual contrato com a Leis Ltda (dono);
- o gabarito do benchmark, com perguntas reais dos playtesters.

Pode ser o dono ou um contador do grupo por cerca de um dia por semana.

**O custo de não ter revisor**:
- A base nasce com mais versões de certeza média e baixa.
- A taxa de erro só pode ser afirmada pela amostra pequena: 30 dispositivos por mês dão intervalo largo. Por isso a auditoria acumula meses antes de virar número público.

---

## 14. Como a base se liga ao Consultor e ao M1 Legal

### 14.1 No M1 Legal

- **Partição.** A legislação local é partição da base global, só leitura, chaveada por `ente_ibge`, como o JU-04 já define para os módulos. A etapa 3 da cascata (07, 3.1) filtra por UF e município **por código**, a partir de `cliente.perfil_em` ou de `uf`/`municipio_ibge` explícitos (07, 3.2). Nada do município A chega à busca sobre o município B.
- **Saída de `legal.consultar`.** Ganha `cobertura_local` (nível, período, status da cadeia, última coleta) lido do registro, e `lacunas[]` passa a ser preenchida pelo registro.
- **Grau de confiança** = o menor entre o grau da afirmação, a certeza da versão citada e o nível de cobertura.
- **Módulos.** O roteador só consulta partições dos módulos ativos do escritório (JU-04, 3.6). T3 desativado vira "módulo não ativo", não abstenção por falta de base.
- **M3 Cálculo.** `calculo.retencoes_nota`, `calculo.das` e `calculo.comparar_regimes` leem a alíquota local da Ficha 4, com a conferência da NFS-e; sem tabela, devolvem "alíquota municipal fora da base", e nunca um padrão.
- **Busca ao vivo.** `municipal.buscar_diario`, `municipal.sapl`, `municipal.parametros_nfse`, `estadual.sefaz`. O resultado entra na fila de ingestão, marcado "ainda não validado".

### 14.2 Regras de resposta

| # | Regra | Garantia |
|---|---|---|
| R-LOC1 | Afirmação sobre regra local só com trecho local da base, ou de busca ao vivo marcada como não validada | Verificação (07, 7) recusa frase normativa local sem `trecho_id` local |
| R-LOC2 | Em C0, só a moldura federal rotulada, e o que falta | Texto C0 da seção 8.2 |
| R-LOC3 | Parâmetro da NFS-e só como parâmetro, com grau baixo | Rótulo próprio |
| R-LOC4 | Data anterior ao período coberto rebaixa o grau ou vira abstenção | Comparação de datas por código |
| R-LOC5 | Nunca inferir alíquota ou prazo local "típico" | R-M3 do 07 |
| R-LOC6 | O rótulo de cobertura aparece sempre que a citação é local | Seção 8.3 |

### 14.3 Nos modos do Consultor

- **Perguntar e Parecer:** o parecer guarda as versões e o nível de cobertura da data.
- **Vigilância:** ato novo de ente com clientes gera `legislacao.publicar` com `perfis_afetados`; em C1, o aviso diz "ato novo, sem texto atualizado".
- **Revisão de enquadramento e segunda opinião:** só concluem divergência com tabela local em C2 ou C3.
- **Coleta sob demanda:** cliente novo num município C0 abre a tarefa de cobertura sozinho.
  - **[Proposta]** Metas: C1 em 1 dia útil numa plataforma conhecida; C2 em 5 dias úteis; C3 em 15 dias úteis.
  - O status aparece na página "Cobertura".
- **Reportar e confirmar:** em todos os modos com citação local (13.4).

---

## 15. RAPTOR, HippoRAG 2, Rank1 e o laço inspirado na DGM

Todas seguem atrás de chave e só ligam se vencerem no benchmark (07, 3.7 e 9.4).

**RAPTOR** ([Sarthi et al., ICLR 2024](https://arxiv.org/abs/2401.18059)).
- **No artigo:** agrupa trechos por similaridade (mistura gaussiana sobre embeddings reduzidos com UMAP), resume, agrupa os resumos e repete, formando uma árvore. A busca percorre a árvore ou usa a "árvore colapsada". Com GPT-4, ganhou 20 pontos absolutos no QuALITY.
- **No nosso uso**, a árvore segue a taxonomia (módulo → tributo → ente → tema), o que é adaptação. Os resumos por ente e tema roteiam; nunca são citados.

**HippoRAG 2** ([Gutiérrez et al., ICML 2025](https://arxiv.org/abs/2502.14802)).
- **No artigo:** grafo de triplas extraídas por modelo (OpenIE), com nós de frase e de passagem e arestas de sinonímia; triplas-semente filtradas por modelo; PageRank personalizado. Cerca de 7% de ganho em memória associativa. O "10 a 30 vezes mais barato" é do **HippoRAG 1** ([arXiv 2405.14831](https://arxiv.org/abs/2405.14831)), contra o IRCoT.
- **No nosso uso**, as arestas são as determinísticas da seção 12, e o PageRank roda no subgrafo do ente mais a camada federal.

**Rank1** ([Weller et al., COLM 2025](https://arxiv.org/abs/2502.18418)).
- **No artigo:** reranker que raciocina antes de julgar; destilado de 635 mil traços do DeepSeek R1 sobre o MS MARCO, em inglês, com modelos Qwen 2.5.
- **No nosso uso**, precisa de destilação em português jurídico. Não decide vigência nem ente: isso já foi filtrado por código.

**Laço inspirado na DGM** ([Zhang et al., arXiv 2505.22954, ICLR 2026](https://arxiv.org/abs/2505.22954)).
- **No artigo:** arquivo de agentes de código com modelos **congelados**. A cada iteração, um agente propõe e aplica mudança no próprio código, e a variante entra se funcionar no benchmark. Em 80 iterações, o SWE-bench foi de 20,0% a 50,0% e o Polyglot de 14,2% a 30,7%. Uma rodada no SWE-bench custou cerca de duas semanas e US$ 22 mil, com sandbox e supervisão humana. O artigo relata **burla da métrica**: uma variante apagou os marcadores de uso de ferramenta para enganar o detector de alucinação.
- **No nosso uso é inspiração**, em dois laços:
  1. o do Consultor (07, 9.4);
  2. o da ingestão (segmentador, triagem, instruções dos extratores, montador de cadeia) contra conjuntos-ouro, com as funções de avaliação escondidas das variantes, como no artigo.
- Um ciclo de ingestão com 20 variantes sobre 300 atos-ouro custa cerca de US$ 430 (**estimativa**: 20 × 300 × US$ 0,072). Sem revisor, o laço é a forma de baixar a fila de exceções com o tempo.

---

## 16. Avaliação: métricas e conjuntos de teste

### 16.1 Conjuntos-ouro que não exigem revisor

| Conjunto | De onde vem | Mede |
|---|---|---|
| **Cadeias-ouro** | Câmaras com compilação do SAPL (Cacoal: 21.149 dispositivos com vigência); consolidações oficiais; RICMS consolidados; normas.leg.br no federal | Eventos e consolidação |
| Completude | DOM/SC (SC) e BLM (RS) como universo de referência | Recall da coleta |
| Tabelas | Parâmetros da NFS-e | Alíquotas de ISS extraídas |
| Triagem | Categorias do DOM/SC (Leis, Decretos...) como rótulo fraco | Triagem |
| Reportes confirmados | Fluxo do usuário | Erros reais |
| Benchmark do Consultor | Perguntas reais dos playtesters com gabarito, mais 100 perguntas locais (ISS retido, alíquota na data, ICMS-ST, ITBI, entes em C0 e datas fora do período) | Respostas |

Exigem pessoa, em quantidade pequena: 200 páginas de PDF com fronteiras de ato e 300 páginas digitalizadas difíceis, rotuladas uma vez.

### 16.2 Métricas e metas

[Proposta]; a confirmar no piloto.

| Métrica | Meta |
|---|---|
| Recall de atos tributários na coleta (entes C3) | ≥ 98% contra o universo de referência |
| Concordância dos extratores nos campos de núcleo | ≥ 98% |
| Aplicação limpa | ≥ 95% dos eventos |
| Acerto contra cadeias-ouro (dispositivo na data) | ≥ 98% |
| Erro na auditoria amostral | ≤ 2% (portão do Plano de Ingestão), acumulado em meses |
| Publicação → base, entes C1+ | ≤ 48 horas |
| Rótulo de cobertura correto | 100% |
| Abstenção local correta no benchmark | ≥ 95% |
| Reportes resolvidos sem pessoa | ≥ 60% |
| Horas humanas por mês | ≤ 30 |
| Custo por ato relevante | ≤ US$ 0,15 |
| Horas de manutenção por coletor por mês | a medir |

---

## 17. Jurídico: direito autoral, LGPD, termos de uso e coleta

- **Direito autoral.** Leis, decretos e demais atos oficiais não têm proteção (Lei 9.610/1998, art. 8º, IV). Compilações e bases de dados são protegidas pela seleção e organização (art. 7º, XIII), mas não os dados em si (art. 7º, § 2º) ([texto na Câmara](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html)). Coletar a publicação oficial é livre; reaproveitar consolidação de terceiro exige contrato. Não há exceção de mineração de texto e dados no Brasil (J4).
- **Licenças:**
  - Querido Diário: CC-BY 4.0 e MIT, com atribuição;
  - Senado: livre, citando a proveniência;
  - DOM/SC: sem licença declarada; pedir ao CIGA.
- **Termos, robots e CAPTCHA:** seção 10.2. O Jusbrasil proíbe robôs (2.5.2), e os agregadores privados ficam fora da coleta.
- **LGPD.**
  1. A triagem descarta atos de pessoal, nomeação, notificação e licitação.
  2. Leis que citam pessoas ficam com o original, com nomes mascarados nos índices.
  3. A base legal é o legítimo interesse, considerando a finalidade, a boa-fé e o interesse público da disponibilização (LGPD, art. 7º, §§ 3º e 7º; [guia da ANPD para o Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_tratamento_de_dados_pessoais_pelo_poder_publico___defeso_eleitoral.pdf/@@display-file/file)).
  4. Relatório de impacto antes da coleta em escala.
  5. Os reportes não carregam dado de cliente.
- **Parecer** do advogado do grupo antes da Fase 2 e antes do primeiro uso do CAPTCHA.

---

## 18. Ordem de cobertura

**[Dono]** Municipal: fácil primeiro, o resto sob demanda. Estadual: os 27 entes. **[Proposta]** Ordem:

| Camada | O que entra | Nível | Quando |
|---|---|---|---|
| Federal | Como no Plano de Ingestão, 10 anos | C3 | Lançamento |
| Estadual, 27 UFs | Texto vigente de ICMS, ITCMD e IPVA | C2 | Lançamento (meta; depende da consolidação oficial de cada Sefaz) |
| Estadual, UFs dos pilotos | Histórico de 5 anos | C3 | Lançamento, onde der; senão logo depois |
| Estadual, demais UFs | Histórico de 5 anos | C3 | Sob demanda |
| Municipal fácil | DOM/SC (293), SIGPub, SAPL (~1.200 câmaras, só leis), BLM (497, se houver acesso), classes do Querido Diário (441 municípios no código) | C1 automático; C2 onde há consolidação oficial | Lançamento |
| Municipal sob demanda | Os demais | C0 → C1 → C2 → C3 | Pela fila |

**Estimativa** do municipal fácil: entre cerca de 1.200 e 2.400 municípios, conforme a sobreposição entre as fontes. O piso é o SAPL sozinho; o teto é 293 + 497 + 441 + ~1.200. A medir na Fase 0.

**Prioridade da fila sob demanda** ([Proposta]):
1. Município de cliente ativo com pergunta sem base.
2. Município com reporte de usuário.
3. Município de cliente ainda sem pergunta.
4. Os 338 acima de 100 mil, por PIB. Isso é ordem, não meta.
5. Os demais.

---

## 19. Fases e portões

[Proposta]. Durações são **estimativas** para uma pessoa com agentes de programação, como no Plano de 6 meses.

**Fase 0 · Mapa, pedidos e parecer (2 a 3 semanas).**
- Ficha de fontes das 27 UFs (Sefaz, diário, assembleia, tribunal administrativo) e das plataformas municipais fáceis.
- Inventário de consolidações oficiais (RICMS de cada Sefaz; códigos municipais).
- Pedidos de LAI e convênio: CIGA, TCE-RS, Interlegis, AMM, Sefaz que não publicam em formato aberto.
- Cotação sem compromisso com a Leis Ltda.
- Política de coleta, incluindo o CAPTCHA como reserva, e LGPD; parecer.
- **Portão:** mapa das 27 UFs e lista medida dos municípios fáceis.

**Fase 1 · Estadual vigente e fluxo (6 a 8 semanas).**
- Coletores das UFs dos pilotos primeiro, depois as demais.
- C2 nas 27 UFs onde houver consolidação oficial; C3 nas UFs dos pilotos.
- **Portão:** concordância dos extratores ≥ 98%; acerto ≥ 98% contra o RICMS consolidado; auditoria de 100 dispositivos com erro ≤ 2% (≈ 5 h humanas).

**Fase 2 · Municipal fácil (4 a 6 semanas, em paralelo à 1).**
- Coletores DOM/SC, SIGPub, SAPL, BLM (se houver acesso) e classes do Querido Diário.
- C1 automático; C2 onde houver consolidação oficial; conferência pela NFS-e.
- **Portão:** publicação → base ≤ 48 horas; recall ≥ 98% contra o DOM/SC num mês.

**Fase 3 · Sob demanda e feedback (contínua, a partir do lançamento).**
- Página "Cobertura", botões "Reportar" e "Confirmar", fila puxada pela demanda.
- Cinco capitais dos pilotos como primeiros C3 municipais, até os municípios dos pilotos estarem definidos.
- **Portão contínuo:** ≤ 30 horas humanas por mês; ≥ 60% dos reportes resolvidos sem pessoa.

**Fase 4 · Módulos jurídicos (seção 6.4).**
- Estadual (custas, ITCMD, corregedorias) com o JU-04.
- Municipal pesado (Imobiliário, Administrativo) sob demanda.

**Laço de melhoria** a partir do fim da Fase 1, quando os conjuntos-ouro existirem.

---

## 20. Custo, com premissas

Todas as contas são **estimativas**.
- Preços de modelo conferidos em 9/11/2026 (referência da API da Anthropic): Haiku 5.5 US$ 0,10/0,50 por milhão de tokens; Sonnet 5.5 US$ 2/10; Opus 5.5 US$ 4/20; lote com 50% de desconto.
- Câmbio da pesquisa 02: R$ 5,6858 por dólar pago.

### 20.1 Por ato relevante (lote)

| Etapa | Tokens (entrada / saída) | Modelo | US$ |
|---|---|---|---:|
| Triagem | 700 / 60 | Haiku 5.5 | 0,00005 |
| Extrator primário | 5.000 / 2.500 | Opus 5.5 | 0,0350 |
| Extrator independente | 5.000 / 2.500 | Sonnet 5.5 (ou outro fornecedor de preço parecido) | 0,0175 |
| Revisor modelo | 7.000 / 1.000 | Sonnet 5.5 | 0,0120 |
| Reconciliador, em 20% dos atos | 8.000 / 2.000 | Opus 5.5 | 0,0072 |
| **Total** | | | **≈ 0,072 (R$ 0,41)** |

Faixa usada: **US$ 0,07 a 0,15**. O teto é a estimativa de US$ 0,147 da pesquisa 02, com premissas mais pesadas.

### 20.2 Federal

Não muda: Plano de Ingestão e pesquisa 02, 10 anos. Pela tabela da pesquisa 02 (6.1 e 6.2), os atos federais de 10 anos custam cerca de US$ 3,5 mil em lote com cache (**conta minha**: 11.000 × 0,147 + 6.000 × 0,093 + 20.500 × 0,066).

### 20.3 Estadual, 27 UFs, 5 anos

Seção 3.3: **US$ 8 mil a 14 mil (R$ 45 mil a 80 mil)** no histórico e **US$ 120 a 220 por mês**. Mais cerca de 100 coletores para construir e manter.

### 20.4 Municipal

| Item | Premissa | Modelo | Horas humanas |
|---|---|---:|---:|
| Fluxo dos municípios fáceis (C1) | ~3.980 publicações triadas e 9 atos tributários por município por ano (DOM/SC) | < US$ 1 por município por ano; US$ 1,2 mil a 2,4 mil por ano para 1.200 a 2.400 municípios | 0 |
| Histórico de 5 anos sob demanda (C3), cenário baixo | 50 atos; 3% de exceções × 5 min | US$ 3,6 (R$ 20) | 0,1 h |
| Idem, cenário médio | 100 atos; 5% × 6 min | US$ 7,2 (R$ 41) | 0,5 h |
| Idem, cenário alto | 200 atos, a US$ 0,147; 10% × 8 min | US$ 29 (R$ 167) | 2,7 h |
| OCR, quando há atos digitalizados | 30% dos atos × 3 páginas × US$ 2 por mil páginas (Mistral OCR 4 em lote, preço de jul/2026 a confirmar) | US$ 0,09 a 0,36 por município | — |
| Armazenamento | Atos normativos de 2.400 municípios × 259 por ano × 5 anos × 300 KB ≈ 930 GB, Standard-IA em SP a US$ 0,0221/GB-mês | ≈ US$ 21 por mês | — |

Os 50 a 200 atos saem da conta de cerca de 9 atos tributários por ano em 5 anos, mais o código-base e as alterações antigas ainda vigentes. A medir no piloto.

### 20.5 Horas humanas

Seção 13.5: **≈ 17 h por mês** (faixa de 10 a 30), mais ≈ 5 h pontuais na auditoria do portão da Fase 1. A R$ 90/h (premissa de hora do Estudo de Precificação; a P28 segue aberta), cerca de R$ 1,5 mil por mês se a hora for paga.

### 20.6 Resumo

| Camada | Histórico (modelo) | Por mês (modelo) | Horas/mês | O que pesa de verdade |
|---|---:|---:|---:|---|
| Federal (10 anos) | ~US$ 3,5 mil em atos (pesquisa 02) | pesquisa 02 | 2,2 | Coletores federais (poucos) |
| Estadual (27 UFs, 5 anos) | US$ 8 mil a 14 mil | US$ 120 a 220 | 3,0 | **~100 coletores** |
| Municipal: fluxo dos fáceis (C1) e dos que estão em C2/C3 | — | US$ 100 a 200 | 0,4 (só os C2/C3; o C1 não pede pessoa) | Coletores por plataforma |
| Municipal sob demanda | US$ 4 a 29 por município | — | 5 (a 10 municípios/mês) | Demanda |
| Reportes, perguntas, auditoria, CAPTCHA | — | — | 6,5 | — |

**Leis Municipais.** Fica fora da conta: o preço para a Heild é desconhecido (seção 4.6).

---

## 21. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Base nasce com muita certeza média e baixa, sem revisor | Rótulos claros; fila puxada pela demanda; reporte do usuário; laço de melhoria na ingestão |
| Taxa de erro não pode ser afirmada com precisão | Auditoria amostral mínima acumulada; não publicar número antes de ter amostra suficiente |
| Usuário reporta errado ou de má-fé | Reporte só corrige com a publicação oficial; "confere" é sinal, não prova; peso por histórico; limite por usuário |
| Cadeia incompleta faz errar a data do fato | Certeza da cadeia; R-LOC4; conferência por repetição |
| Revogação tácita e cláusula genérica (23% das leis) | Sinal, nunca evento automático; vira exceção quando perguntada |
| Citar lei de outro ente | Filtro por ente em código; validação da URN; verificação do ente do trecho |
| Os ~100 coletores estaduais custam mais que o previsto | Medir horas por coletor na Fase 1; UFs dos pilotos primeiro; LAI por arquivos em lote onde a Sefaz aceitar |
| Sefaz sem RICMS consolidado oficial | UF fica em C1 até montar e conferir o texto; pedido por LAI |
| Querido Diário fora do ar ou sem financiamento | Usar o código (MIT), não a API |
| DOM/SC sem licença declarada | Pedido ao CIGA; texto dos atos é livre (art. 8º, IV) |
| BLM só acessível pela Leis Municipais | LexML ou convênio com o TCE-RS; sem acesso, o RS entra como os outros |
| CAPTCHA contorna a intenção do publicador | Só fonte pública oficial, em paralelo à via formal, taxa humana, registro, parada ao primeiro aviso, parecer (10.2) |
| Dados pessoais | Triagem LGPD; mascaramento; relatório de impacto; reportes sem dado de cliente |
| ISS perde valor depois de 2038 | Estrutura serve ao IBS local, IPTU, ITBI e taxas |
| Laço de melhoria burla a métrica | Avaliação escondida; conjunto reservado; área editável restrita |
| Responsabilidade profissional | Rótulo e grau em toda resposta; decisão e assinatura do profissional |

---

## 22. Comparação com o plano anexado

### 22.1 O que ficou

- Qualidade e verificabilidade antes de volume; link oficial e metadados.
- Pipeline em estágios, regras e OCR antes de modelo, modelo pequeno onde couber, cache.
- Querido Diário, DOM/SC, LexML e SAPL como fontes.
- Nível de confiança por município, transparência, coleta sob demanda e feedback do usuário, que na 0.2 virou peça central.
- **[Dono]** A cobertura ampla dos estados do Sul, de SP e de MG volta, agora no **estadual** e para as 27 UFs.
- Métricas de custo e de sucesso por fonte; riscos de sites, PDFs, custo e cobertura.

### 22.2 O que mudou e por quê

| # | Plano anexado | Este plano | Por quê |
|---|---|---|---|
| 1 | MVP municipal com SP, MG, PR, SC e RS inteiros, capitais e todos acima de 100 mil (2.853) | **[Dono]** Municipal só fácil + sob demanda; os 338 viram ordem da fila | Custo de coletores e revisão; decisão do dono |
| 2 | Estadual não tratado | **[Dono]** 27 UFs, com expectativa corrigida e custo | Seção 3 |
| 3 | Tipos de norma todos juntos | Núcleo tributário no lançamento; urbanismo e posturas com os módulos jurídicos | 7,5% das leis tributárias; módulos na seção 6 |
| 4 | Esquema plano por documento | Fichas por dispositivo, versão e evento, com extensão local | Data do fato |
| 5 | "Status quando detectável" | Eventos, revogação genérica como sinal, anterioridade, certeza da cadeia | 22,9% de revogação genérica; 4,3% de "(NR)" |
| 6 | "Modelo forte extrai e padroniza" | Modelo extrai eventos; código consolida | 50% e 20% de acerto quando o modelo consolida |
| 7 | Querido Diário como primeira fonte | Código reaproveitável e descoberta; DOM/SC, SIGPub, BLM e SAPL promovidos | ~520 municípios; API fora do ar no teste |
| 8 | Sem fonte licenciada | Leis Municipais como opção em aberto, explicada | Empresa privada contratada por prefeituras; preço para a Heild desconhecido |
| 9 | Sem tribunais de contas nem NFS-e | BLM do TCE-RS; parâmetros da NFS-e como conferência automática | Seções 4.4 e 5.1 |
| 10 | Histórico de 5 anos (ou 2 a 3) | **[Dono]** 10 anos federal; 5 estadual e municipal | Decisão do dono |
| 11 | Revisão implícita | **[Dono]** Sem revisor dedicado; automação, conferência cruzada, usuário como revisor; ~17 h/mês | Seção 13 |
| 12 | "Nível de confiança" sem efeito definido | C0 a C4, com rótulos, textos e lugar na resposta | Seção 8 |
| 13 | "Ativar DGM completo" | Laço inspirado na DGM, offline, com avaliação escondida | DGM real custa US$ 22 mil por rodada e burla a métrica |
| 14 | Robots e rate limit | Direito autoral, LGPD, termos, LAI e convênio; **[Dono]** CAPTCHA como reserva, com cuidados | Seções 10.2 e 17 |
| 15 | Sem módulos | **[Dono]** Módulos de base legal: contábil e BPO no lançamento, 19 jurídicos na ordem de J9 | Seção 6 |
| 16 | Custo qualitativo | Custo por camada com premissas | Seção 20 |

---

## 23. Decisões do dono (9/11/2026) e o que segue aberto

### 23.1 Decisões

1. **Primeiros clientes:** contábil e BPO. Advocacia em módulos, do mais comum ao menos comum (seção 6).
2. **Escopo local:** estadual dos 27 entes; municipal só o fácil, o resto sob demanda e pelo feedback. Os pilotos ainda não estão definidos, mas a maioria deve estar em RS, SC, PR, SP e MG.
3. **Revisão humana:** hoje não há ninguém. O plano funciona sem revisor dedicado (seção 13).
4. **Fonte licenciada:** fica em aberto. A Leis Municipais é empresa privada contratada pelas prefeituras e câmaras; os valores encontrados são o que uma prefeitura paga pelo serviço dela; uma licença para a Heild seria negociação B2B, com preço desconhecido.
5. **C2 (texto atual sem histórico):** pode ser lançado, rotulado (seção 8).
6. **Janela:** 10 anos no federal; 5 anos no estadual e no municipal.
7. **LAI e convênios:** em nome da empresa. **CAPTCHA por pessoa no celular** mantido como reserva (seção 10.2).

### 23.2 O que ainda precisa do dono

1. **Municípios e UFs dos pilotos.** Quando definidos, eles viram o topo da fila e as primeiras UFs em C3.
2. **Quem faz as ~17 horas por mês** (o próprio dono, um contador do grupo, alguém pago). A auditoria amostral, sem a qual não há taxa de erro, depende disso.
3. **Cotação da Leis Ltda:** autoriza pedir uma cotação sem compromisso na Fase 0?
4. **Venda em módulos:** aprova a divisão do contábil em T1, T2, T3, D1, S1, K1 e do BPO em B1 (seção 6.2), e os complementos jurídicos baratos antes da onda 4 (seção 6.4)? O preço segue no Estudo de Precificação.
5. **Rótulos:** aprova os textos da seção 8.2?
6. **Reportes como revisão:** aprova que reportes confirmados na publicação oficial corrijam a base sem pessoa (seção 13.4)?

---

## 24. Correções a documentos do repositório de trabalho

Achados que afetam textos já escritos (não alterados aqui):

- **Plano de Ingestão, 5.3:** os 834 municípios mineiros usam o caderno "Diário dos Municípios Mineiros" do jornal Minas Gerais (Imprensa Oficial), não o diário da AMM; a AMM tem outro diário, no SIGPub.
- **Plano de Ingestão e Plano do Assistente, escopo:** a decisão do dono troca "5 UFs" por "27 UFs" no estadual e "capitais e municípios dos clientes" por "municípios fáceis e sob demanda"; janela de 5 anos no local.
- **Plano de 6 meses, premissas:** "os textos são digitais, então não há OCR relevante" não vale para atos municipais antigos.
- **J4 e JU-04:** "Querido Diário, cerca de 350 cidades (2024)" passa a cerca de 520 (2026).
- **Plano do Assistente, guia das técnicas, e roteiro da apresentação:** o "10 a 30 vezes mais barato" é do HippoRAG 1, não do 2; a "árvore de temas guiada pela taxonomia" é adaptação do RAPTOR.

---

## Fontes

Acessadas em 9/11/2026, salvo indicação. "Testado" = chamada feita durante a pesquisa.

**Municípios: fontes de legislação**
- Querido Diário: [documentação](https://docs.queridodiario.ok.org.br/pt-br/latest/) · [API pública](https://docs.queridodiario.ok.org.br/en/latest/using/public-api.html) · [OKBR no Catarse (cobertura)](https://www.catarse.com.br/queridodiario-okbr/about) · [repositório de raspadores](https://github.com/okfn-brasil/querido-diario) (testado) · [conferência de cobertura, monitorelnino PR 469](https://github.com/monitorelnino/monitorelnino/pull/469) · [issue Ro-DOU 378](https://github.com/gestaogovbr/Ro-dou/issues/378)
- LexML: [descrição do acervo, 21/12/2025](https://www.lexml.gov.br/desc_acervo.html) · [especificação da URN, Parte 2](https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf) · [RFC 9676](https://www.rfc-editor.org/rfc/rfc9676.html)
- DOM/SC: [dados abertos do CIGA](https://dados.ciga.sc.gov.br/) (testado, outubro de 2026) · [relatórios do CIGA 2013 e 2014](https://consorciociga.gov.br/wp-content/uploads/2015/05/Plano-de-Trabalho-2015-e-Relatorio-de-Atividade-2014.pdf)
- SIGPub: [diariomunicipal.com.br](https://www.diariomunicipal.com.br/) · [AMUPE](https://www.diariomunicipal.com.br/amupe/)
- Minas Gerais: [Agência Minas, 22/04/2026](https://agenciaminas.mg.gov.br/noticia/jornal-minas-gerais-completa-134-anos-como-referencia-em-transparencia-e-parceria-com-municipios) · [SEGOV-MG](https://www.governo.mg.gov.br/Noticias/Detalhe/5347)
- TCE-RS: [Atricon, 02/10/2019](https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/) · [IN TCE-RS 12/2009](https://atosoficiais.com.br/tcers/instrucao-normativa-n-12-2009-regulamenta-o-encaminhamento-de-normas-expedidas-pelos-entes-jurisdicionados-da-esfera-municipal-a-base-de-legislacao-municipal-blm-instituida-pela-resolucao-843-de-04-de-marco-de-2009-e-da-outras-providencias) · [TCE-RN, Resolução 017/2020](https://www.tce.rn.gov.br/as/Legislacao_site/download/resolucoes_tce_rn/3_000017_2020_CPJUR_25.05.2021.0725.pdf)
- SAPL: [API de Cacoal](https://sapl.cacoal.ro.leg.br/api/) (testado) · [Interlegis, casas com SAPL em SC](https://www12.senado.leg.br/interlegis/orgaosatendidos?uf=SC&servico=SAPL&tipocasa=CM) · [caderno de articulação e compilação](https://www12.senado.leg.br/interlegis/produtos/anexos/caderno-de-exercicios-articulacao-e-compilacao)
- Leis Municipais: [contrato de Caçapava do Sul, 14/04/2025](https://cacapavadosul.rs.gov.br/uploads/contrato/53762/5745_2025__Empresa_Leis_Ltda___Ass.pdf) · [proposta a Ilhota, dez/2023](https://ilhota.sc.gov.br/wp-content/uploads/2023/12/Leis-Municipais.pdf)
- São Paulo: [Portal da Legislação, Casa Civil](https://prefeitura.sp.gov.br/web/casa_civil/w/portal-da-legisla%C3%A7%C3%A3o-ultrapassa-4-milh%C3%B5es-de-visualiza%C3%A7%C3%B5es-no-1%C2%BA-semestre-de-2025%C2%A0)

**Federal e estadual**
- [API de legislação do Senado](https://legis.senado.leg.br/dadosabertos/legislacao/lista?tipo=LEI&ano=2024) · [dados abertos do Senado, termos](https://www12.senado.leg.br/dados-abertos/sobre) · [apresentação do normas.leg.br](https://www12.senado.leg.br/assessoria-de-imprensa/arquivos/apresentacao-em-power-point_normas.leg/normas-leg-br.pptx/@@download/file/Normas%20leg%20br.pdf)
- [ALESP, dados abertos](https://al.sp.gov.br/dados-abertos/perguntas) · [ALMG, dados abertos](https://dadosabertos.almg.gov.br/ws/ajuda/sobre) · [preprint "Democracia em Formato JSON"](https://preprints.scielo.org/index.php/scielo/preprint/view/12275)

**NFS-e e reforma**
- [Adesão à NFS-e Nacional, 28/10/2026](https://notagateway.com.br/adesao-municipios-nfse/) · [Portal da Reforma, jan/2026](https://www.reformatributaria.com/tecnologia/lista-de-municipios-aderentes-a-nfs-e-nacional-chega-a-5-465-so-347-estao-com-a-plataforma-em-operacao-ativa/) · [manual de municípios, API do Sistema Nacional NFS-e v1.2](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-municipios-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out21025.pdf)
- [EC 132/2023 no Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm) · [PwC, resumo da EC 132](https://www.pwc.com.br/pt/thinking-about-taxes/tax-intelligence/2023/reforma-tributaria-sobre-o-consumo-promulgacao-da-emenda-constitucional-n-132.pdf) · [TCE-PB, art. 156-A](https://tce.pb.gov.br/wp-content/uploads/2026/04/Apresentacao_Reforma-Tributaria.pdf) · [Senior, LC 227/2026](https://documentacao.senior.com.br/exigenciaslegais/noticias/federal/2026/2026-01-14-sancionada-segunda-etapa-da-regulamentacao-da-reforma-tributaria-e-criacao-do-comite-gestor-do-ibs) · [Cescon Barrieu, LC 227/2026](https://cesconbarrieu.com.br/reforma-tributaria-sancionada-a-lei-complementar-227-2026/)

**Dados do IBGE e do CFC**
- [Estimativas de população 2025](https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2025/) · [PIB dos Municípios, SIDRA 5938](https://apisidra.ibge.gov.br/values/t/5938/n6/all/v/37/p/last%201) · [CEMPRE, SIDRA 1685](https://apisidra.ibge.gov.br/values/t/1685/n6/all/v/706/p/last%201) (todos testados)
- [CFC, Relato Integrado 2025](https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf) · [CRCSP, transparência](https://crcsp.org.br/transparencia/)

**Jurídico**
- [Lei 9.610/1998 (LEGIN/Câmara)](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html) · [ANPD, guia de tratamento pelo Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_tratamento_de_dados_pessoais_pelo_poder_publico___defeso_eleitoral.pdf/@@display-file/file) · [Jusbrasil, termos de uso](https://www.jusbrasil.com.br/termos-de-uso)

**Técnica**
- [RAPTOR, Sarthi et al., ICLR 2024](https://arxiv.org/abs/2401.18059) · [anais do ICLR 2024](https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html)
- [HippoRAG 2, Gutiérrez et al., ICML 2025](https://arxiv.org/abs/2502.14802) · [HippoRAG 1](https://arxiv.org/abs/2405.14831)
- [Rank1, Weller et al., COLM 2025](https://arxiv.org/abs/2502.18418)
- [Darwin Gödel Machine, Zhang et al.](https://arxiv.org/abs/2505.22954) · [Hyperagents (DGM-H)](https://arxiv.org/abs/2603.19461)
- [Etcheverry et al., NLLP 2024](https://aclanthology.org/2024.nllp-1.13/) · [Prior et al., NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)
- [olmOCR, arXiv 2502.18443](https://arxiv.org/abs/2502.18443) · [DODFMiner (UnB)](https://dodfminer.readthedocs.io/en/main/user/intro.html)
- [Preços da API da Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)

**Repositório de trabalho (DGM-RAG-Contabil)**
- `docs/Plano_de_Ingestao_da_Base_Legal.md`, `docs/Plano_Assistente_de_IA_para_Contadores.md`, `docs/Plano_MVP_6_meses.md`, `docs/subplanos/07-Motores-e-Consultor.md`, `docs/subplanos/08-Conectores.md`, `docs/subplanos/10-BPO.md`, `docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md` (3.1 a 3.6 e decisões de 9/11/2026), `docs/Estudo_de_Precificacao_por_Modulo.md` (hora de R$ 90, P28)
- `pesquisa/juridico/J9-ordem-dos-modulos-de-base.md` (ranking, pacotes e ondas), `pesquisa/juridico/J3-atividades-advocacia.md` (234 atividades), `pesquisa/juridico/J6-outras-areas-candidatas.md` (ordem dos pacotes), `pesquisa/juridico/J4-fontes-e-integracoes.md`
- `pesquisa/01-infra-aws.md` (S3), `pesquisa/02-custos-llm.md` (câmbio, custo por ato, volumes por UF), `pesquisa/04-juridico-tributario-dados.md` (LAI, fontes pagas), `pesquisa/plataforma/V2-estados-municipios.md`
