# Plano da Base de Legislação Municipal

**Versão 0.1 · 9 de novembro de 2026 · proposta para decisão do dono do produto.**

Este plano diz como a base legal da Heild passa a cobrir a legislação **municipal** com a mesma promessa do resto da base: redação vigente na data do fato, trecho citado, grau de segurança e abstenção quando não há base. Ele valida, corrige e substitui o plano municipal anexado ao pedido (seção 20) e se encaixa nos planos do repositório de trabalho `DGM-RAG-Contabil`, sem reescrevê-los:

- [Plano de Ingestão da Base Legal](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_de_Ingestao_da_Base_Legal.md): fichas, princípios, agentes, portões. Este plano **mantém** tudo isso e só acrescenta o que o município exige.
- [Plano do Assistente](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_Assistente_de_IA_para_Contadores.md) e [Subplano 07 · Motores e Consultor](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/07-Motores-e-Consultor.md): cascata do M1 Legal, `legal.consultar`, verificação e abstenção.
- [JU-04 · Motor jurídico e base de leis](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md): módulos Imobiliário e Administrativo, que também dependem do município.

As notas brutas, com cada fonte e o que foi testado, estão em [`pesquisa-base-municipal/notas-de-pesquisa.md`](pesquisa-base-municipal/notas-de-pesquisa.md). Todo número abaixo tem fonte e data; o que é conta minha vem marcado como **estimativa**, com a conta ao lado.

---

## 1. Resumo

**O problema.** São 5.570 municípios mais o Distrito Federal (5.571 linhas na estimativa do IBGE de 2025). Cada um publica no seu veículo oficial, num de dezenas de sistemas, e quase nenhum mantém texto compilado. Em outubro de 2026, nos diários municipais de Santa Catarina, só 1,3% das publicações eram leis e 5,2% eram decretos; o resto é licitação, ata e portaria. Quase um quarto das leis ainda revoga "as disposições em contrário" sem dizer quais. Não existe serviço aberto que entregue a lei municipal vigente numa data.

**A solução recomendada, em seis linhas:**

1. Cobrir por **município × domínio**, começando pelo **núcleo tributário** (código tributário, ISS, IPTU, ITBI, taxas, UFM, REFIS, regulamentos), com um **nível de cobertura publicado** por município (N0 a N4) que o Consultor lê antes de responder.
2. Ordem: municípios dos clientes dos escritórios-piloto, depois os **338 municípios acima de 100 mil habitantes** (58,3% da população, 67,4% do PIB, 68,2% das unidades locais de empresas), e o resto sob demanda. Não carregar cinco estados inteiros no lançamento.
3. **Coletores por plataforma, não por município**: DOM/SC, SIGPub (diariomunicipal.com.br, uma plataforma para mais de dez associações), SAPL, a Base de Legislação Municipal do TCE-RS e as classes replicáveis do Querido Diário, que já cobrem 85,5% dos seus raspadores.
4. O modelo **extrai eventos com evidência**; o **código consolida**. Num estudo de 2025 com leis alemãs, modelos que escreviam o texto consolidado acertaram exatamente só 50% das alterações simples e 20% das cadeias.
5. Toda versão de dispositivo municipal carrega a **certeza da cadeia** (âncora conferida, cadeia completa ou com lacuna), que entra no grau de segurança da resposta.
6. Uma **fonte licenciada** (Leis Municipais, que declara mais de mil órgãos clientes e vende consolidação com "texto vigente até a data selecionada") fica como acelerador opcional, decisão do dono.

**O que custa.** O modelo de linguagem é barato: cerca de US$ 0,07 por ato relevante e US$ 14 por município no núcleo tributário de 10 anos (**estimativa**, seção 18). O que pesa é **revisão humana** (cerca de 6 horas por município no cenário médio, 2.000 horas para os 338) e a **manutenção dos coletores**. É por isso que a ordem de cobertura e a opção de licença são decisões de negócio, não de engenharia.

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
| **Escopo do plano anexado** (5 UFs inteiras + capitais + acima de 100 mil no país) | **2.853** | 75,9% | 85,3% | 88,8% |

Os 10 maiores PIBs municipais somam 24,5% do PIB; os 100 maiores, 52,9% (58 deles nas cinco UFs). O escopo do plano anexado pede **8,4 vezes mais municípios** que o recorte acima de 100 mil para ganhar 17,9 pontos de PIB.

O CFC registra 101.880 organizações contábeis ([Relato Integrado 2025](https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf)); o CRCSP informa 533.724 profissionais ativos em 30/09/2024, 29% deles em SP, e que a maior parte das organizações está no estado ([CRCSP, transparência](https://crcsp.org.br/transparencia/)). Não há distribuição pública de clientes de escritórios por município; usamos população, PIB e unidades locais como aproximação, e a lista real de clientes dos escritórios-piloto como prioridade absoluta.

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

**Estimativas derivadas** (média de SC; o município médio de SC tem 27,8 mil habitantes, contra 38,3 mil no país): cerca de **53 leis e 206 decretos por município por ano**, dos quais cerca de **9 atos tributários** (97 + 133 = 230 por mês ÷ 293 × 12 = 9,4). Extrapolado para o país, são cerca de 295 mil leis, 1,15 milhão de decretos e 52 mil atos tributários municipais por ano. O filtro é aproximado (palavras-chave sobre título e começo do texto) e deve ser refeito com rótulo humano no piloto.

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

Três consequências: (1) o "(NR)" aparece em cerca de um terço das leis que dão nova redação, então não serve como detector; (2) a revogação genérica é frequente, logo a **revogação tácita** é um caso comum, não exceção; (3) um quarto das leis traz anexo, ou seja, tabelas de alíquota, valores e listas que precisam da Ficha 4 (tabela normativa).

### 2.4 O que está em jogo para o Consultor

- **Contábil:** ISS (alíquota por item da LC 116, retenção, local de incidência, sociedades uniprofissionais, regime de estimativa), IPTU, ITBI, taxas de licença e fiscalização, COSIP, unidade fiscal municipal, parcelamentos e anistias, obrigações acessórias municipais.
- **BPO financeiro:** retenção de ISS nas notas de fornecedores, que depende da lei do município do tomador e do prestador; taxas e alvarás nas contas a pagar.
- **Advocacia (JU-04):** IPTU e ITBI no Imobiliário; servidores, licitações e posturas no Administrativo; plano diretor e zoneamento.

---

## 3. A premissa do dono, conferida: federal e estadual

| Fonte | Esfera | Cobertura e formato | Versionamento | Licença | API |
|---|---|---|---|---|---|
| [API de legislação do Senado](https://legis.senado.leg.br/dadosabertos/legislacao/lista?tipo=LEI&ano=2024) | Federal | JSON/XML; detalhe com publicações, vetos e **alterações recebidas por dispositivo** | Eventos por dispositivo (a validar contra o compilado) | Livre, citar a proveniência ([Senado](https://www12.senado.leg.br/dados-abertos/sobre)) | Sim, sem chave |
| normas.leg.br | Federal | Texto multivigente, linha do tempo e histórico do dispositivo | Compilação estruturada só para CC, CPC e leis desde 2019; antes, manual da Câmara ([apresentação do Senado](https://www12.senado.leg.br/assessoria-de-imprensa/arquivos/apresentacao-em-power-point_normas.leg/normas-leg-br.pptx/@@download/file/Normas%20leg%20br.pdf)) | A confirmar | Não documentada |
| Planalto | Federal | HTML compilado com texto riscado | Visual, não estruturado | Texto de lei sem direito autoral | Não; **bloqueia robôs** (nos testes da pesquisa 04 e nos meus, 9/11/2026) |
| INLABS / DOU | Federal | XML e PDF diários desde 2020 | Não | Livre | Sim |
| [LexML](https://www.lexml.gov.br/desc_acervo.html) | Todas | Índice e URN; 11,0 milhões de documentos (21/12/2025): Senado 291 mil, Câmara 258 mil | Não | Aberta | SRU; devolveu página de verificação a script (J4, 8/11/2026) |
| LexML, estadual | Estadual | **Só 6 assembleias e o DF:** ALESP 172 mil, ALMG 109 mil, ALESC 21 mil, AM 12 mil, RO 6 mil, AL 1 mil; SINJ-DF 52 mil | Não | Aberta | Via LexML |
| Assembleias e Casas Civis | Estadual | ALESP em XML; ALMG com endpoint; Goiás com API de pesquisa; o resto por portal | Raro | Varia | Preprint de 2025 sobre as 26 assembleias e a CLDF: "forte assimetria e fragmentação técnica" ([SciELO Preprints 12275](https://preprints.scielo.org/index.php/scielo/preprint/view/12275)) |

**Veredito.** A premissa vale **para o federal**: há fontes abertas, padronizadas e com eventos por dispositivo. **Para o estadual vale só em parte**: LexML padroniza seis assembleias e o DF; as outras 20 UFs exigem coletor por UF, e o ICMS mora nas Sefaz, como o Plano de Ingestão já prevê (seção 5.2). Se o dono pensou em serviços comerciais (LegisWeb, IOB, Econet, Leis.Org), eles juntam federal, estadual e parte do municipal, mas não são abertos e a compilação é protegida (seção 15). **Para o municipal, não há serviço aberto equivalente**; é o que este plano resolve.

---

## 4. Inventário das fontes municipais

### 4.1 Quadro geral

| Fonte | Cobertura (data) | Grão | Texto | Vigência ou vínculos | Licença e acesso | Papel no plano |
|---|---|---|---|---|---|---|
| **Querido Diário** (OKBR) | 522 municípios, ~65 milhões de pessoas ([OKBR](https://www.catarse.com.br/queridodiario-okbr/about), sem data); 527 numa conferência de terceiro em 30/09/2026 | Diário inteiro | Extraído do PDF | Não | Código MIT, dados CC-BY 4.0; API com limite de referência de 60 req/min; **fora do ar no teste de 9/11/2026** | Código de raspadores reaproveitável; descoberta |
| **DOM/SC** (CIGA/FECAM) | 293 de 295 municípios de SC (out/2026) | **Ato** | Sim (HTML extraído) | Não | Dados abertos JSON desde jan/2023; **licença não declarada** | Fonte de fluxo do estado inteiro |
| **SIGPub** (Vox Tecnologia, diariomunicipal.com.br) | Diários de AMA, AGM, FGM, AMURB, AMURC (página inicial); e, segundo buscas, AMUPE, FAMUP, FAMEP, FEMURN, AAM, AROM, APRECE, FAMURS, AMP e AMM-MG (lista a conferir na Fase 0) | **Ato**, com código identificador verificável | PDF assinado e página do ato | Não | Público; termos a confirmar | Um coletor para muitos estados |
| **Diário dos Municípios Mineiros** (Imprensa Oficial de MG) | 834 de 853 municípios usam ([Agência Minas, 22/04/2026](https://agenciaminas.mg.gov.br/noticia/jornal-minas-gerais-completa-134-anos-como-referencia-em-transparencia-e-parceria-com-municipios)) | Caderno do jornal oficial | PDF | Não | Público | Fluxo de MG |
| **TCE-RS, Base de Legislação Municipal (BLM)** | 789.722 documentos no LexML; "mais de um milhão de normas" na consulta pública ([Atricon, 02/10/2019](https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/)) | Norma | Sim | Indexação; sem consolidação | Envio obrigatório pelos municípios desde 2009 (Res. 843/2009, IN 12/2009); consulta via leismunicipais.com.br/tcers | Estoque e conferência de completude do RS |
| **LexML municipal** | 57 câmaras, 285.963 documentos (21/12/2025) | Norma | Link | Não | Aberta | Índice e URN |
| **SAPL** (Interlegis) | "Cerca de 1.200 câmaras" (técnico do Senado, 2026) | Norma; **dispositivo** quando a câmara usa a compilação | PDF | **Normas relacionadas** (altera, revoga) e **dispositivos com início e fim de vigência e eficácia** | API REST aberta | Melhor fonte estruturada das leis; padrão-ouro de teste |
| **Leis Municipais / Leis.Org** (Leis Ltda) | "Mais de 1.000 municípios, governos estaduais e tribunais de contas" (proposta de dez/2023); "1.350 órgãos" e "10 milhões de normas" (notícia, 2025-2026) | Norma | Sim | **Consolidação, compilação e versionamento por data** (contrato de 2025) | Compilação protegida; portal recusa acesso automatizado; licença sob consulta | Acelerador por licença (decisão do dono) |
| Jusbrasil, LegisWeb, IOB, Econet | Ampla, não auditada | Norma | Sim | Variável | Uso individual; o Jusbrasil proíbe robôs (cláusula 2.5.2) | Só conferência manual |
| Portais de prefeituras e câmaras | Heterogêneo | Varia | PDF, muitas vezes digitalizado nos atos antigos | Raro | Público; robots e termos por site | Último recurso por município |
| **NFS-e Nacional, parâmetros municipais** | 5.466 municípios em operação (out/2026) | Tabela | Dados | **Com vigência** | API oficial | Conferência de alíquotas e retenções (não é base legal) |

### 4.2 Querido Diário

- **Cobertura.** A OKBR declara 522 municípios e cerca de um terço da população. Um projeto de terceiros que confere a cobertura município a município contou 527 municípios com diário indexado e 5.044 sem, em 30/09/2026 ([monitorelnino, PR 469](https://github.com/monitorelnino/monitorelnino/pull/469)). A pesquisa J4 do repositório ainda falava em 350 cidades (2024).
- **Código.** O repositório de raspadores (`okfn-brasil/querido-diario`, último commit em 23/09/2026) tem 449 raspadores e 441 códigos IBGE distintos. Por UF: SP 116, BA 74, RJ 33, SE 29, MA 29, PR 27, TO 26, RS 21, MG 21, SC 3. **384 (85,5%) herdam uma de 21 classes de plataformas replicáveis** (Instar 111, DOEM 56, DOSP 42, ADiários 39, Município Online 26, Atende 22, DIOF 21...); só 65 são próprios. É o ativo mais útil do projeto para nós: licença MIT, plataformas já mapeadas.
- **API.** Documentação pública com `/gazettes` (filtro por código IBGE e termo) e limite de referência de 60 requisições por minuto ([docs](https://docs.queridodiario.ok.org.br/en/latest/using/public-api.html)). No teste de 9/11/2026, o endereço antigo falhou na negociação TLS, o WebFetch recebeu 503 e o endereço novo não respondeu; uma issue de outubro de 2026 relata instabilidade ([Ro-DOU 378](https://github.com/gestaogovbr/Ro-dou/issues/378)). O projeto se financia em parte por financiamento coletivo.
- **Base dos Dados.** A busca do catálogo não mostra conjunto do Querido Diário em 9/11/2026; mostra o DOU e as leis da Câmara de Feira de Santana.
- **Atraso e qualidade do texto.** Não foi possível medir: a API estava fora do ar. Medir na Fase 0, num mês de dez municípios, contra o diário de origem.
- **Uso no plano.** Reaproveitar as classes de plataforma (com atribuição), usar a API como descoberta quando estiver no ar e nunca depender dela como fonte única.

### 4.3 Diários associativos e estaduais

- **DOM/SC.** O melhor caso do país: um registro por ato, com `municipio`, `entidade`, `categoria` (Leis, Decretos...), `titulo`, `texto`, `link` e `url` do PDF. Só um ato em 6.319 leis e decretos de outubro veio sem texto. Os dados abertos vão de jan/2023 a out/2026; antes disso, o portal diariomunicipal.sc.gov.br. A página do recurso diz "Nenhuma licença fornecida": pedir licença explícita ao CIGA (seção 15).
- **SIGPub.** Uma plataforma, um coletor, muitos estados. Cada ato tem "Código Identificador" verificável no site, o que ajuda a deduplicar e a provar a publicação.
- **Minas Gerais: correção.** O Plano de Ingestão atribui à AMM os 834 municípios. A fonte diz que os 834 usam o **Diário dos Municípios Mineiros, caderno do jornal Minas Gerais**, da Imprensa Oficial do Estado (Decreto Estadual 48.175/2021). A AMM mantém **outro** diário, o Diário Oficial dos Municípios Mineiros, no SIGPub. São duas fontes; o veículo oficial de cada município é o que a lei municipal define.

### 4.4 Tribunais de contas

O TCE-RS mantém a **BLM**, alimentada por envio obrigatório dos municípios desde 2009 e publicada em até 24 horas após validação diária. É o único órgão de âmbito estadual que fornece legislação municipal ao LexML, com 789.722 documentos, cerca de 1.589 por município do RS (**estimativa**: 789.722 ÷ 497). Outros tribunais pedem envio de legislação municipal (TCE-RN, Sistema Legis, Res. 017/2020; TCE-PI, Res. 09/2009, que inclui o código tributário), mas não encontrei consulta pública desses; **a confirmar** na Fase 0.

### 4.5 SAPL

Testei a API pública de uma câmara (Cacoal, RO) em 9/11/2026:

- `/api/norma/normajuridica/`: número, ano, data, data de publicação, veículo, ementa, PDF, data de vigência, tipo e assuntos; 3.631 normas.
- `/api/norma/normarelacionada/` com `tipo_vinculo`: "Altera o(a)", "Revoga integralmente", "Revoga parcialmente", "Revoga integralmente por consolidação", "Norma correlata" e outros (14 tipos); 699 vínculos. É um grafo de alterações pronto, no nível da norma.
- `/api/compilacao/dispositivo/`: **dispositivo a dispositivo**, com `inicio_vigencia`, `fim_vigencia`, `inicio_eficacia`, `fim_eficacia`, `dispositivo_substituido` e `dispositivo_atualizador`; 278 textos articulados e 21.149 dispositivos. É o mesmo modelo das Fichas 2 e 3 do Plano de Ingestão.

Limites: o SAPL é da **câmara**, então traz leis, resoluções e decretos legislativos, e **não traz os decretos do Executivo** (regulamento do ISS, valores de UFM, pautas de ITBI). A estimativa de 1.200 câmaras vem de fala de técnico do Senado reproduzida em notícias de 2026; a lista do Interlegis por UF não serve para contar (o PR aparece com 421 "câmaras municipais", mais que os 399 municípios).

### 4.6 Agregadores privados

- **Leis Municipais / Leis.Org** (Leis Ltda e Liz Serviços Online, Itapema/SC). É contratada pelas próprias prefeituras, por inexigibilidade, para "consolidação, compilação, versionamento e gerenciamento dos atos oficiais". O contrato de Caçapava do Sul (abril de 2025, R$ 3.480 por ano) define versionamento como os textos "por cada período de tempo em que existiram alterações/revogações", permitindo ver "o texto vigente até a data selecionada", e classifica normas em vigor, revogadas, a vigorar, repristinadas, revogadas tacitamente, de vigência esgotada e declaradas inconstitucionais. A proposta a Ilhota (dez/2023) cobra R$ 12.865,60 por ano e declara mais de 1.000 clientes. Nenhuma outra fonte encontrada nesta pesquisa oferece consolidação municipal nessa escala, e é exatamente o produto de que a data do fato precisa. A compilação é protegida (Lei 9.610, art. 7º, XIII) e o portal recusa acesso automatizado (403 em 9/11/2026): **só por licença**.
- **Jusbrasil, LegisWeb, IOB, Econet.** Bases de uso individual. O Jusbrasil trata acessos por robôs como ilegítimos (Termos, 2.5.2). Ficam como conferência manual, como a pesquisa 04 já recomendou.

### 4.7 O que já existe consolidado

- Leis Municipais, para os seus clientes (consolidação, compilação e versionamento).
- Câmaras que usam a compilação do SAPL (texto multivigente, ensinado pelo Interlegis).
- Portais oficiais de grandes cidades, como o Portal da Legislação da Prefeitura de São Paulo, mantido pelo Centro de Referência da Legislação Municipal ([Casa Civil SP](https://prefeitura.sp.gov.br/web/casa_civil/w/portal-da-legisla%C3%A7%C3%A3o-ultrapassa-4-milh%C3%B5es-de-visualiza%C3%A7%C3%B5es-no-1%C2%BA-semestre-de-2025%C2%A0)).
- Republicações oficiais de códigos tributários consolidados, quando o município as faz. Não há inventário nacional; a Fase 0 levanta, para cada município da fila, se existe uma.

### 4.8 Acesso formal

A Lei de Acesso à Informação manda os sites oficiais "possibilitar o acesso automatizado por sistemas externos em formatos abertos, estruturados e legíveis por máquina" (art. 8º, § 3º, III). Municípios com até 10 mil habitantes estão dispensados de publicar na internet (art. 8º, § 4º), mas continuam obrigados a responder pedidos (pesquisa 04, seção 6.4). Há 2.469 municípios nessa faixa, com 6,0% da população: para eles, o caminho é LAI ou convênio, não raspagem.

---

## 5. O que muda o problema: NFS-e Nacional e reforma tributária

### 5.1 NFS-e Nacional

- Painel da Receita citado em 28/10/2026: **5.571 municípios conveniados, 5.466 em operação** enviando ao Ambiente de Dados Nacional, 3.062 usando o Emissor Nacional ([Nota Gateway](https://notagateway.com.br/adesao-municipios-nfse/)). Em janeiro de 2026 eram 1.898 em operação ([Portal da Reforma](https://www.reformatributaria.com/tecnologia/lista-de-municipios-aderentes-a-nfs-e-nacional-chega-a-5-465-so-347-estao-com-a-plataforma-em-operacao-ativa/)). A LC 214/2025 obriga o padrão nacional desde 2026.
- A API do Sistema Nacional expõe **parâmetros municipais**: convênio, **alíquotas por subitem da lista de serviços** (com regimes especiais e deduções), retenções e benefícios, e o sistema considera a vigência dessas informações ([manual de municípios v1.2, out/2025](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-municipios-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out21025.pdf)).
- **Consequência para o plano.** Pela primeira vez há uma tabela nacional, oficial e datada de alíquotas de ISS. Ela **não é a lei** (é o que a prefeitura cadastrou), mas serve para três coisas: conferir a tabela extraída da lei municipal (Ficha 4), apontar divergência para revisão e, quando o município não tem cobertura, mostrar o parâmetro com rótulo próprio e grau baixo, nunca como fundamento (regra R-MUN3, seção 12).

### 5.2 Reforma tributária

- **ISS até 2032.** A EC 132/2023 reduz as alíquotas do ICMS e do ISS a 9/10 em 2029, 8/10 em 2030, 7/10 em 2031 e 6/10 em 2032, e extingue os dois a partir de 2033 (ADCT, arts. 128 e 129; texto oficial no [Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm), que bloqueia robôs; resumo da [PwC](https://www.pwc.com.br/pt/thinking-about-taxes/tax-intelligence/2023/reforma-tributaria-sobre-o-consumo-promulgacao-da-emenda-constitucional-n-132.pdf)).
- **O ISS continua sendo perguntado depois de 2033.** O prazo de decadência é de cinco anos (CTN, art. 150, § 4º, e art. 173, I), então fatos de 2032 seguem em fiscalização e revisão até cerca de 2038. A data do fato é justamente o que dá valor à base de ISS nesse período.
- **IBS também é lei municipal.** Cada ente fixa sua alíquota própria do IBS por lei específica; sem lei, vale a alíquota de referência do Senado (CF, art. 156-A, § 1º, V; LC 214, art. 14). Haverá leis municipais de alíquota de IBS a partir da transição.
- **Ficam municipais, sem prazo:** IPTU (a EC 132 permite atualizar a base de cálculo por ato do Executivo, nos critérios da lei municipal), ITBI (a LC 227/2026, publicada em 14/01/2026, trouxe normas gerais ao CTN, com base de cálculo pelo valor de mercado), taxas, COSIP, posturas, uso do solo e regras de servidores.

### 5.3 Prioridade e horizonte por tipo de norma

| Tipo | Valor para o Consultor | Horizonte | Prioridade |
|---|---|---|---|
| Código tributário e leis de ISS (alíquotas, retenção, local, regimes) | Muito alto (contábil e BPO) | Fatos até 2032; consultas até ~2038 | **Lançamento** |
| Regulamento do ISS e decretos de NFS-e, obrigações acessórias | Alto | Idem | **Lançamento** |
| IPTU (planta genérica, isenções), ITBI (base, alíquota, pauta) | Alto (contábil, imobiliário) | Permanente | **Lançamento** |
| Taxas, COSIP, UFM, REFIS e anistias, processo administrativo tributário | Médio a alto | Permanente | **Lançamento** |
| Lei municipal de alíquota do IBS | Alto a partir da transição | 2029 em diante | Monitorar desde já |
| Lei Orgânica (partes tributária e de processo legislativo) | Médio (vigência, veículo oficial) | Permanente | Lançamento, só as partes citadas |
| Posturas, alvarás, uso do solo, plano diretor, código de obras | Médio no contábil; alto no imobiliário | Permanente | Pacote jurídico (JU-04, onda 5) |
| Servidores, licitações locais | Alto no administrativo | Permanente | Pacote jurídico |
| Créditos orçamentários, denominação de ruas, títulos honoríficos | Nenhum para os dois públicos | — | Descartar na triagem |

---

## 6. Decisões

| # | Decisão | Por quê |
|---|---|---|
| D1 | **A unidade de cobertura é município × domínio × nível** (seção 7), não "a norma". | O Consultor precisa saber o que pode afirmar sobre o ISS de um município numa data; saber quantas leis daquele município estão na base não responde isso. |
| D2 | **Núcleo tributário primeiro** (seção 5.3); urbanismo, posturas e servidores entram com o pacote jurídico. | 7,5% das leis e 2,6% dos decretos são tributários; atacar só esse recorte corta o volume em mais de 90% e cobre o que contadores e BPO perguntam. |
| D3 | **Ordem por demanda e peso econômico**: clientes dos escritórios-piloto → 338 municípios acima de 100 mil → sob demanda. Estados com fonte agregada barata (SC, RS, SIGPub) recebem cobertura de **fluxo** (N1) cedo, sem consolidação. | 338 municípios dão 67% do PIB; o escopo anexado (2.853) custa 8,4 vezes mais para 18 pontos a mais (seção 2.1). |
| D4 | **Coletor por plataforma**, reaproveitando as classes do Querido Diário (MIT, com atribuição). | 85,5% dos raspadores do Querido Diário são instâncias de 21 plataformas; o custo marginal de um município numa plataforma conhecida é quase zero. |
| D5 | **Hierarquia de fontes**: (1) veículo oficial de publicação = prova; (2) bases estruturadas (SAPL, BLM, DOM/SC, SIGPub) = descoberta e metadados; (3) consolidações de terceiros = conferência, só com licença; (4) parâmetros da NFS-e = tabela declarada. | A citação tem de apontar para a publicação oficial; o resto acelera e confere. |
| D6 | **O modelo extrai eventos com evidência literal; o código consolida.** Revogação tácita nunca é aplicada sem pessoa. | Princípio 4 do Plano de Ingestão, agora com prova externa (seção 10.2). |
| D7 | **Toda versão municipal carrega a certeza da cadeia**: âncora conferida, cadeia completa, cadeia com lacuna. | Sem isso o Consultor diria "vigente em 2023" sem saber se faltou uma lei de 2021. |
| D8 | **Anterioridade tributária é regra do validador**: aumento de tributo só produz efeito no exercício seguinte e 90 dias depois da publicação, salvo exceções da CF (a fixação da base do IPTU escapa dos 90 dias, art. 150, § 1º). | É o erro de data do fato mais provável em lei municipal publicada em dezembro. |
| D9 | **Janela de 10 anos** no núcleo tributário, como o Plano de Ingestão; a versão vigente mais antiga entra com a data da âncora. | Cobre a decadência e a vida útil do ISS até ~2038. |
| D10 | **Abstenção municipal explícita** (regras R-MUN, seção 12): sem cobertura, o Consultor dá só a moldura federal, rotulada, e diz o que falta. | É a promessa do produto; o plano anexado fala em "nível de confiança", mas não diz o que muda na resposta. |
| D11 | **Coleta sob demanda com prazo público**: cliente novo em município sem cobertura abre a tarefa de cobertura sozinho. | Transforma a lacuna em fila de trabalho, como a detecção de lacunas do Plano do Assistente. |
| D12 | **Licença como acelerador opcional**, nunca raspagem de compilação de terceiro. | A Leis Municipais já vende versionamento por data e declara mais de mil órgãos clientes; o dono decide se compra (seção 21). |
| D13 | **Triagem LGPD na entrada**: atos de pessoal e nomeação são descartados; nomes em leis ficam só no original. | Diários publicam dados pessoais em massa; a base de leis não precisa deles (seção 15). |
| D14 | **Laço de melhoria inspirado na DGM também na ingestão**, offline, contra conjuntos-ouro, sem tocar na base. | Coletores e extratores são o que mais muda; a DGM mostrou que esse tipo de busca funciona e que burla a métrica se puder (seção 13). |

---

## 7. Níveis de cobertura e registro de cobertura

### 7.1 Os níveis, por município e por domínio

| Nível | Nome | O que existe na base | O que o Consultor pode fazer |
|---|---|---|---|
| **N0** | Sem cobertura | Nada local | Abster-se da regra local; dar a moldura federal rotulada; oferecer coleta sob demanda |
| **N1** | Fluxo | Publicações novas monitoradas desde uma data, sem estoque consolidado | Citar um ato novo isolado com texto integral; avisar que não há consolidação; não afirmar "a alíquota vigente é" |
| **N2** | Vigente | Texto atual do núcleo, ancorado em consolidação oficial ou conferido, com fluxo ativo | Responder para fatos a partir da data da âncora; abster-se ou rebaixar o grau para datas anteriores |
| **N3** | Temporal | Cadeia completa de 10 anos, versões por dispositivo, conferida | Data do fato plena, grau conforme a certeza da cadeia |
| **N4** | Amplo | N3 mais domínios do pacote jurídico (urbanismo, posturas, servidores) | Idem, nos domínios cobertos |

### 7.2 O registro

Tabela `cobertura_municipal`, mantida pelo publicador e lida por `legal.consultar`:

`municipio_ibge`, `dominio` (iss, iptu, itbi, taxas, cosip, ufm, processo, organica, urbanismo...), `nivel`, `vigencia_coberta_de`, `vigencia_coberta_ate`, `cadeia_status` (completa, com_lacuna, sem_ancora), `fontes[]`, `ultima_coleta`, `ultima_publicacao_vista`, `atraso_medio_horas`, `pendencias[]`.

O nível nunca é declarado à mão: sai de regras sobre esses campos (por exemplo, N3 exige `cadeia_status = completa` nos últimos 10 anos e auditoria do município aprovada). Quando um coletor quebra, o nível cai sozinho para N1 depois de um prazo sem coleta.

---

## 8. Modelo de dados: o que muda nas fichas

As seis fichas do Plano de Ingestão ficam. O município entra como **extensão** (princípio 6), sem tocar no núcleo:

| Ficha | Campos novos (extensão municipal) | Para quê |
|---|---|---|
| 1 · Norma | `municipio_ibge`; `veiculo_oficial` (o definido na lei municipal) e `veiculo_desta_publicacao`; `ids_externos` (SAPL, BLM, DOM/SC, SIGPub, Querido Diário); `fonte_descoberta`; `republicacao_de`; `pii` (sim ou não, no original) | Provar a publicação, deduplicar, rastrear a origem |
| 2 · Dispositivo e versão | `certeza_vigencia` (alta, média, baixa) e o motivo; `ancora_id` | Grau de segurança |
| 3 · Evento | `origem_evento` (extraído, vínculo SAPL, revogação genérica sinalizada, anterioridade aplicada); `revisado_por` | Saber o que veio do texto e o que veio de regra |
| 4 · Tabela normativa | `conferencia_nfse` (valor do parâmetro municipal, data da consulta, divergência) | Conferir alíquotas de ISS |
| Nova: Âncora | Norma-mãe, texto-base, fonte do texto-base (publicação original, republicação oficial, consolidação oficial, consolidação licenciada), data, quem conferiu | Começar a cadeia de um ponto confiável |
| Nova: Cadeia | Norma-mãe, lista ordenada de alteradoras com fonte, lacunas conhecidas, status | Calcular `cadeia_status` |

O esquema plano do anexo (`texto_completo`, `status`, `data_vigencia` por documento) não permite responder pela data do fato: ele guarda uma foto, não a história. Por isso não é adotado (seção 20).

---

## 9. Pipeline municipal

O caminho de um documento é o do Plano de Ingestão (seção 4.3), com estas etapas e agentes a mais:

| Etapa | O que faz no municipal | Quem | Saída |
|---|---|---|---|
| 0 · **Mapa de fontes** | Para cada município: veículo oficial (lei municipal), plataforma do diário, SAPL, BLM, presença no Querido Diário, portal de legislação, consolidação oficial ou licenciada, contato para LAI | Agente **mapeador** + pessoa confirma | Ficha do município |
| 1 · Coleta | Um coletor por plataforma; detecção de mudança sem IA; original imutável com hash | Código mantido por agente | Original |
| 2 · **Segmentação** | Já vem por ato em DOM/SC, SIGPub, SAPL e BLM. Em PDF de diário inteiro: regras de cabeçalho ("LEI Nº", "DECRETO Nº", nome do órgão) e layout; modelo só nos casos que as regras não fecham | Código + modelo barato | Atos individualizados |
| 3 · Texto e OCR | Camada de texto quando existe; OCR em escada: Tesseract ou docTR → olmOCR ou Marker em GPU própria → modelo de visão por API só nas páginas ruins; medir erro por caractere numa amostra | Código | Texto com confiança por página |
| 4 · Triagem | Título e início do texto: é normativo? é do núcleo? altera outra norma? Descarta crédito orçamentário, nomeação, denominação | Regras + modelo barato | Ato relevante ou descarte |
| 5 · **Montagem da cadeia** | Para cada norma-mãe do núcleo: lista das alteradoras a partir de vínculos SAPL, citações no texto ("altera a Lei nº"), BLM e busca no diário; escolhe a âncora | Agente **montador de cadeia** | Fichas Âncora e Cadeia |
| 6 · Extração | Fichas 1 a 4 com evidência literal; dois extratores de famílias diferentes | Modelos | Eventos |
| 7 · Validação | Regras do Plano de Ingestão + municipais (seção 10.4) | Código | Aprovado ou falhas |
| 8 · Consolidação | Aplica eventos em ordem de eficácia e calcula versões | Código | Linha do tempo por dispositivo |
| 9 · Conferência | Compara com a compilação SAPL, a consolidação oficial, a licenciada (se houver) e os parâmetros da NFS-e | Código + modelo barato | Divergências |
| 10 · Publicação | Portões do Plano de Ingestão; atualiza `cobertura_municipal`; emite `legislacao.publicar` | Código | Base de produção |

A orquestração, o revisor, o reconciliador, a fila humana, o mantenedor de coletores, o auditor amostral e o controlador de custos são os do Plano de Ingestão. Não se cria uma segunda arquitetura de agentes.

**Referências para segmentação e OCR.** O DODFMiner, do projeto KnEDLe da UnB, segmenta, classifica e extrai entidades de atos do Diário Oficial do DF com regras e aprendizado de máquina; o artigo relata F1 médio de 0,778 na classificação e 0,851 no reconhecimento de entidades com CRF ([documentação](https://dodfminer.readthedocs.io/en/main/user/intro.html); números segundo resumo do artigo na Neurocomputing, 2024). Para OCR, a Ai2 estima menos de US$ 200 por milhão de páginas com o olmOCR em GPU própria, e o seu benchmark (olmOCR-Bench) dá 82,4 ao olmOCR 2, 76,1 ao Marker 1.10.1 e 72,0 à API de OCR da Mistral ([olmOCR](https://arxiv.org/abs/2502.18443); números segundo resumos, a conferir). Nenhum desses testes é em diário municipal brasileiro: a escada de OCR é escolhida pelas 300 páginas difíceis do conjunto-ouro (seção 14).

**Coleta respeitosa.** Pedido identificado com contato, robots.txt, ritmo baixo (no máximo uma requisição por segundo por site e janela noturna; a API do Querido Diário pede no máximo 60 por minuto), cache e reaproveitamento. 403, CAPTCHA ou bloqueio param o coletor: o município vai para LAI ou convênio. No municipal, **não se usa** o "humano resolve o CAPTCHA pelo celular" do Plano de Ingestão (seção 5.6): CAPTCHA num portal de legislação é sinal de que o publicador não quer coleta automatizada, e há caminho formal.

---

## 10. Alteração, revogação, vigência e texto compilado

Esta é a parte que o plano anexado quase não trata, e a que decide se o Consultor acerta a data do fato.

### 10.1 O que os números de SC dizem

Só 4,3% das leis usam "(NR)", 11,8% dizem "passa a vigorar com a seguinte redação", 8,3% revogam expressamente e 22,9% revogam "as disposições em contrário" (seção 2.3). Um detector por expressão regular perde a maior parte das alterações e não vê a revogação tácita.

### 10.2 O que a literatura diz

- Modelo gerador ajustado para aplicar emendas do orçamento francês ao Código Geral de Impostos: sucesso de "mais de 63%" num projeto difícil ([Etcheverry et al., NLLP 2024](https://aclanthology.org/2024.nllp-1.13/)).
- Consolidação por LLM de quatro códigos alemães, 908 pares emenda–lei: similaridade de 93% a 99%, mas acerto exato de **50,3%** em um passo e **20,51%** em cadeias; os autores concluem que a saída é rascunho sujeito a verificação humana rigorosa ([Prior et al., NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)).
- O mesmo artigo resume que regras sobre leis japonesas bem estruturadas chegaram a 99,47% (Ogawa et al., 2008), enquanto leis gregas em PDF heterogêneo ficaram em 37,1%, subindo a 59,4% com correção manual (Garofalakis et al., 2016).

O município brasileiro se parece mais com o caso grego. Daí a decisão D6: o modelo identifica **o quê** muda (alvo, operação, texto novo, regra de vigência, trecho de evidência) e o código aplica.

### 10.3 Procedimento por norma-mãe

1. **Inventário da cadeia.** Juntar alteradoras de quatro lados: vínculos `normarelacionada` do SAPL; citações extraídas do texto de cada ato do município ("altera", "acrescenta", "revoga" + número e ano); BLM e índices do LexML; busca do número da norma-mãe nos diários do período.
2. **Âncora.** Escolher, nesta ordem: republicação oficial consolidada; consolidação oficial do município; publicação original. Consolidação licenciada entra como âncora só se o dono contratar e só depois de conferida contra a publicação oficial dos dispositivos que ela altera.
3. **Extração dos eventos** de cada alteradora, com dois extratores e evidência literal.
4. **Aplicação** em ordem de eficácia, pelo consolidador do Plano de Ingestão.
5. **Conferência por repetição.** Se existe um texto compilado oficial numa data posterior (SAPL, portal, republicação), aplicar os eventos até essa data e comparar dispositivo a dispositivo; diferença vai para a fila humana.
6. **Status da cadeia.** "Completa" quando todas as alteradoras citadas foram encontradas e a conferência fechou; "com lacuna" quando há referência a ato não localizado (por exemplo, "Lei nº 1.234/2011" citada e não encontrada), com a lacuna registrada.

### 10.4 Regras do validador para o município

Somam-se às da seção 4.4 do Plano de Ingestão:

- **Anterioridade:** evento que institui ou aumenta tributo recebe eficácia não anterior a 1º de janeiro do exercício seguinte nem a 90 dias da publicação (CF, art. 150, III, b e c), salvo as exceções do § 1º (a fixação da base do IPTU escapa dos 90 dias). Divergência entre a cláusula de vigência e a anterioridade vira alerta, não correção silenciosa.
- **Revogação genérica:** "revogam-se as disposições em contrário" gera um **sinal** sobre as normas do mesmo tema, nunca um evento; pessoa decide.
- **Veículo:** ato publicado fora do veículo oficial do município fica marcado; a citação aponta para o veículo oficial quando ele existe.
- **Republicação e retificação:** ligadas ao ato original (regra já existente), com atenção às republicações "por incorreção" comuns nos diários municipais.
- **Localidade:** a URN do evento e a do alvo têm de ser do mesmo município, salvo norma federal ou estadual citada.
- **Decreto regulamentar:** decreto não altera lei; se o texto diz que altera, vai para revisão.

### 10.5 Certeza da versão

| Certeza | Condição |
|---|---|
| Alta | Âncora conferida, cadeia completa, conferência por repetição sem divergência |
| Média | Âncora conferida e cadeia completa, sem texto oficial para conferir |
| Baixa | Cadeia com lacuna no período, revogação genérica pendente ou OCR com confiança abaixo do limiar |

---

## 11. Identificadores, deduplicação e hash

- **URN LexML municipal:** `urn:lex:br;sao.paulo;campinas:municipal:lei:AAAA-MM-DD;número`, com autoridade "municipal" (nem "prefeitura", nem "camara.municipal"), conforme a [especificação da URN LexML, Parte 2](https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf). O espaço "lex" está descrito na [RFC 9676](https://www.rfc-editor.org/rfc/rfc9676.html) (maio de 2025, informacional). Dispositivos recebem o sufixo hierárquico do Plano de Ingestão. Uma tabela liga a localidade do vocabulário LexML ao código IBGE.
- **Chave natural** dentro do município: (código IBGE, tipo, número, ano). Variações de grafia ("LEI MUNICIPAL ORDINÁRIA Nº 1.406/2026") são normalizadas.
- **Hash:** SHA-256 dos bytes do original (princípio 1) e um hash do texto normalizado para achar a mesma norma vinda do diário, do SAPL, da BLM e do portal. Quase duplicatas (MinHash) só **dentro** do mesmo município: textos parecidos entre municípios são prováveis (minutas-modelo, a medir no piloto) e não são o mesmo ato.
- **Prova de publicação:** o código identificador do SIGPub, o `codigo` do DOM/SC e o id do SAPL entram em `ids_externos`.

### 11.1 Grafo de remissões

| Aresta | De onde vem | Exemplo |
|---|---|---|
| altera, acrescenta, revoga | Ficha 3 (eventos extraídos) e vínculos `normarelacionada` do SAPL | Lei complementar de 2026 altera o art. 12 do código tributário |
| regulamenta | Decreto que cita a lei que regulamenta | Regulamento do ISS → código tributário |
| remete | Citação no texto ("nos termos do art. X da Lei Y") | Taxa de licença → tabela do anexo |
| aplica norma de outra esfera | Citação de LC 116, LC 214, CTN, lei estadual | Lista de serviços do município → subitem da LC 116 |
| interpreta | Solução de consulta ou parecer da fazenda municipal, quando publicado | Fase posterior (Ficha 5) |
| revogação genérica (sinal) | Cláusula "revogam-se as disposições em contrário" | Liga a lei às normas do mesmo tema para revisão; não é evento |

As arestas são determinísticas ou extraídas com evidência; o grafo é particionado por município, e a camada federal e estadual é compartilhada. É esse grafo que o PageRank personalizado da seção 13 percorre.

---

## 12. Como a base se liga ao Consultor e ao M1 Legal

### 12.1 No M1 Legal

- **Partição.** A legislação municipal é partição da base global, só leitura, chaveada por `municipio_ibge`, como o JU-04 já define para os módulos. A etapa 3 da cascata (filtro de vigência, 07, 3.1) passa a filtrar por município **por código**, a partir de `cliente.perfil_em` ou de `municipio_ibge` explícito (07, 3.2). Nada do município A chega à busca de uma pergunta sobre o município B.
- **Saída de `legal.consultar`.** Ganha `cobertura_municipal` (nível por domínio, período coberto, status da cadeia, última coleta) lida do registro, e `lacunas[]` passa a ser preenchida pelo registro, não pelo modelo.
- **Grau de confiança** = o menor entre o grau da afirmação, a certeza da versão citada (10.5) e o nível de cobertura do município no domínio.
- **M3 Cálculo.** `calculo.retencoes_nota`, `calculo.das` (ISS "por fora") e `calculo.comparar_regimes` leem a alíquota municipal da Ficha 4, com a conferência da NFS-e anexada; sem tabela municipal, a função devolve "alíquota municipal fora da base", e não um padrão.
- **Busca ao vivo (camada 3).** Novas ferramentas: `municipal.buscar_diario` (DOM/SC, SIGPub e Querido Diário quando no ar), `municipal.sapl` e `municipal.parametros_nfse`. O que achar entra na fila de ingestão, marcado "ainda não validado na base".

### 12.2 Regras de resposta

| # | Regra | Garantia |
|---|---|---|
| R-MUN1 | Afirmação sobre regra municipal só com trecho municipal da base, ou de busca ao vivo marcada como não validada | Verificação (07, seção 7) recusa frase normativa municipal sem `trecho_id` municipal |
| R-MUN2 | Sem cobertura no domínio, a resposta dá só a moldura federal (LC 116, CF, CTN), rotulada, e diz o que falta | Mensagem de abstenção "fonte local fora da base" (07, 7.4), agora com o nível |
| R-MUN3 | Parâmetro da NFS-e pode ser mostrado como "cadastrado pelo município no Sistema Nacional da NFS-e em DD/MM", com grau baixo; nunca como fundamento legal | Rótulo próprio no cartão de citação |
| R-MUN4 | Pergunta sobre data anterior ao período coberto rebaixa o grau ou vira abstenção | Comparação de datas por código |
| R-MUN5 | Nunca inferir alíquota ou prazo municipal "típico" | O modelo não completa com conhecimento próprio (R-M3 do 07) |

Exemplos de saída (modelos de texto; {município}, {subitem} e X são variáveis):

- N3: "Em {município}, em março de 2023, a alíquota do ISS para o subitem {subitem} era X% [t1, lei complementar municipal, artigo, redação vigente de ... a ...]. Grau: alto."
- N2: "A regra atual é X% [t1]. A base tem o código tributário de {município} desde 01/2025; para março de 2023 não consigo afirmar. Quer que eu monte o histórico? Prazo estimado: 15 dias úteis."
- N0: "A legislação de ISS de {município} ainda não está na base. Pela LC 116/2003, a regra geral é o ISS devido no local do estabelecimento prestador, com as exceções do art. 3º, e alíquota entre 2% e 5% [t2, t3]. O município pode ter regra própria. O município cadastrou X% para esse subitem no Sistema Nacional da NFS-e (parâmetro consultado em DD/MM, não é lei). Abri o pedido de cobertura."

### 12.3 Nos modos do Consultor

- **Perguntar e Parecer:** como acima; o parecer guarda as versões e o nível de cobertura da data em que foi feito.
- **Vigilância:** ato tributário novo num município com clientes gera `legislacao.publicar` com `perfis_afetados` (município, subitens da LC 116, regime) e cai no fluxo de avisos já existente; em N1 o aviso diz "ato novo, sem consolidação".
- **Revisão de enquadramento e segunda opinião:** usam a Ficha 4 municipal e só concluem divergência com tabela N2 ou N3.
- **Coleta sob demanda:** cliente novo (evento `cliente.perfil.versionar`) num município N0 abre a tarefa de cobertura. Metas a validar no piloto: N1 em 1 dia útil se o município está numa plataforma conhecida, N2 em 5 dias úteis, N3 em 15 dias úteis. O status aparece para o escritório.

### 12.4 No jurídico

Os módulos Imobiliário e Administrativo do JU-04 usam a mesma partição e o mesmo registro, com os domínios do nível N4. A "fatia de leitura" do JU-04 (3.3) vale aqui: ativar o Imobiliário traz o IPTU e o ITBI do núcleo tributário.

---

## 13. RAPTOR, HippoRAG 2, Rank1 e o laço inspirado na DGM

O que cada técnica faz no artigo original e o que fazemos com ela. Todas seguem atrás de chave e só ligam se vencerem no benchmark (07, 3.7 e 9.4).

**RAPTOR** ([Sarthi et al., ICLR 2024](https://arxiv.org/abs/2401.18059)). Agrupa trechos por similaridade (mistura gaussiana sobre embeddings reduzidos com UMAP), resume cada grupo, agrupa os resumos e repete, formando uma árvore; busca percorrendo a árvore ou numa "árvore colapsada". Com GPT-4, ganhou 20 pontos absolutos no QuALITY. **No nosso uso**, a árvore segue a taxonomia (tributo → município → tema), o que é uma adaptação, não o RAPTOR puro. No municipal, gera resumos por município e tema ("ISS de Campinas: alíquotas, retenção, sociedades uniprofissionais"), refeitos quando uma versão muda. Resumo **roteia**; nunca é citado como fundamento.

**HippoRAG 2** ([Gutiérrez et al., ICML 2025](https://arxiv.org/abs/2502.14802)). Monta um grafo a partir de triplas extraídas por modelo (OpenIE), com nós de frase e de passagem e arestas de sinonímia; na consulta, acha passagens e triplas-semente, filtra as triplas com um modelo e espalha relevância com PageRank personalizado. Relata cerca de 7% de ganho em memória associativa sobre o melhor embedding. O "10 a 30 vezes mais barato que a busca em rodadas" citado na apresentação é do **HippoRAG 1** ([arXiv 2405.14831](https://arxiv.org/abs/2405.14831)), comparado ao IRCoT. **No nosso uso**, as arestas principais são determinísticas (altera, revoga, regulamenta, remete, cita norma federal), vindas da Ficha 3, dos vínculos do SAPL e das citações; os nós de conceito (subitem 17.01, sociedade uniprofissional) ligam municípios à LC 116 e à LC 214. O PageRank roda no subgrafo do município da pergunta mais as camadas federal e estadual.

**Rank1** ([Weller et al., COLM 2025](https://arxiv.org/abs/2502.18418)). Reranker que escreve um raciocínio antes de julgar a relevância; destilado de 635 mil traços do DeepSeek R1 sobre o MS MARCO, em inglês, com modelos Qwen 2.5. **No nosso uso**, precisa de destilação em português jurídico com os pares do benchmark. No municipal, separa trechos parecidos de normas e datas diferentes do mesmo município. Não decide vigência nem município: isso já foi filtrado por código antes.

**Laço inspirado na DGM** ([Zhang et al., arXiv 2505.22954, ICLR 2026](https://arxiv.org/abs/2505.22954)). A DGM mantém um arquivo de agentes de código, com modelos de fundação **congelados**; a cada iteração, um agente do arquivo propõe e aplica uma mudança no próprio código, e a variante entra no arquivo se funcionar no benchmark. Em 80 iterações, levou o SWE-bench de 20,0% a 50,0% e o Polyglot de 14,2% a 30,7%. Uma rodada no SWE-bench levou cerca de duas semanas e US$ 22 mil, com sandbox e supervisão humana. O artigo relata **burla da métrica**: uma variante removeu o registro dos marcadores de uso de ferramenta e enganou a função que detectava alucinação. **No nosso uso, é inspiração, não a DGM**: um arquivo de variantes, avaliação automática e revisão humana antes de produção. Dois laços:

1. **Consultor** (já previsto no 07, 9.4): roteador, instruções e planejador, contra 500 casos com conjunto reservado.
2. **Ingestão municipal** (novo): segmentador, triagem, instruções dos extratores e montador de cadeia evoluem contra conjuntos-ouro (seção 14). Não são editáveis: validador, consolidador, base, conjuntos-ouro e as funções de avaliação, que ficam escondidas das variantes, como no próprio artigo, que observou mais burla quando essas funções ficavam visíveis. Um ciclo com 20 variantes sobre 300 atos-ouro custa cerca de US$ 430 em modelo (**estimativa**: 20 × 300 × US$ 0,072).

---

## 14. Avaliação: métricas e conjuntos de teste

### 14.1 Conjuntos-ouro

| Conjunto | De onde vem | Mede |
|---|---|---|
| Atos e fronteiras | 200 páginas de diários em PDF de 10 plataformas, rotuladas à mão | Segmentação |
| Páginas difíceis | 300 páginas digitalizadas de atos antigos | OCR (erro por caractere) |
| Triagem | 1.000 atos do DOM/SC rotulados (normativo, núcleo, altera) | Triagem |
| **Cadeias-ouro** | Câmaras que usam a compilação do SAPL (Cacoal tem 21.149 dispositivos com vigência), consolidações oficiais e, se licenciada, a Leis Municipais | Eventos e consolidação, de graça e em escala |
| Completude | BLM do TCE-RS (RS) e DOM/SC (SC) como universo de referência | Recall da coleta |
| **Benchmark municipal do Consultor** | 100 perguntas em 10 municípios e várias datas: ISS retido, local de incidência, alíquota na data, isenção de IPTU, base do ITBI, taxa de licença; inclui perguntas sobre municípios N0 (tem de abster-se) e datas fora do período coberto | Respostas |

### 14.2 Métricas e metas

| Métrica | Meta (decisão, a confirmar no piloto) |
|---|---|
| Recall de atos tributários na coleta, municípios N3 | ≥ 98% contra o universo de referência |
| F1 de fronteira de ato em PDF | ≥ 0,98 |
| Erro por caractere do OCR nas páginas difíceis | ≤ 2% |
| Concordância dos campos de núcleo dos eventos | ≥ 98% (critério de congelamento do Plano de Ingestão) |
| Dispositivos corretos na data, auditoria | erro ≤ 2% (portão do Plano de Ingestão) |
| Publicação → base, municípios N1+ | ≤ 48 horas |
| Nível de cobertura declarado corretamente | 100% |
| Abstenção municipal correta no benchmark | ≥ 95% |
| Custo por ato relevante | ≤ US$ 0,15 |
| Custo de modelo por município N3 | ≤ US$ 60 |
| Horas humanas por município N3 | a medir; alvo ≤ 6 |
| Horas de manutenção por coletor por mês | a medir |

---

## 15. Jurídico: direito autoral, LGPD, termos de uso e coleta

- **Direito autoral.** Leis, decretos e demais atos oficiais não são objeto de direito autoral (Lei 9.610/1998, art. 8º, IV). Compilações e bases de dados são protegidas pela seleção e organização (art. 7º, XIII), mas a proteção não abrange os dados em si (art. 7º, § 2º) ([texto na Câmara](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html)). Logo: coletar o texto da publicação oficial é livre; reaproveitar a consolidação de terceiro exige licença. O Brasil não tem exceção de mineração de texto e dados (J4).
- **Licenças das fontes abertas.** Querido Diário: dados CC-BY 4.0 e código MIT, com atribuição. Senado: livre, citando a proveniência. DOM/SC: **sem licença declarada**; pedir ao CIGA licença explícita (ou termo de cooperação), embora o texto dos atos seja livre pelo art. 8º, IV.
- **Termos de uso e robots.** Seguir robots.txt e termos; parar diante de 403, CAPTCHA ou cláusula que proíba robôs (Jusbrasil, 2.5.2); não contornar bloqueio. O caminho para quem bloqueia é LAI (art. 8º, § 3º, III) ou convênio.
- **LGPD.** Diários publicam nomeações, licitações e notificações com dados pessoais. A base de leis não precisa disso: (1) a triagem descarta atos de pessoal, nomeação, notificação e licitação antes de guardar; (2) leis que citam pessoas (denominação de rua, título honorífico, desapropriação) ficam com o original, mas os índices e os embeddings recebem o texto com nomes e documentos mascarados; (3) a base legal do tratamento é o legítimo interesse, observando que o tratamento de dado de acesso público deve considerar a finalidade, a boa-fé e o interesse público que justificaram sua disponibilização (LGPD, art. 7º, § 3º e § 7º; [guia da ANPD para o Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_tratamento_de_dados_pessoais_pelo_poder_publico___defeso_eleitoral.pdf/@@display-file/file)); (4) um relatório de impacto antes de ligar a coleta em escala. Parecer do advogado do grupo antes da Fase 2.

---

## 16. Ordem de cobertura

| Onda | Municípios | População | PIB 2023 | Nível-alvo | Por quê |
|---|---|---:|---:|---|---|
| A | Clientes dos escritórios-piloto + capitais das 5 UFs | a definir com a lista | — | N3 no núcleo | Demanda real; o que os playtesters perguntam |
| B | Os 338 acima de 100 mil, em lotes de 50, por número de clientes e depois PIB | 58,3% | 67,4% | N3 no núcleo | Melhor retorno por município |
| C (paralela) | SC inteiro (DOM/SC), RS inteiro (BLM), estados do SIGPub | — | — | N1 (fluxo) | Custo marginal quase zero; vigilância e pistas para N2 |
| D | Sob demanda e o restante das 5 UFs | A, B e D juntas = escopo do anexo: 75,9% | 85,3% | N2, sobe a N3 por demanda | Lacunas viram fila |
| E | Domínios jurídicos nos municípios com clientes de advocacia | — | — | N4 | JU-04, onda 5 |

---

## 17. Fases e portões

O Plano de 6 meses põe os municípios no M3, com uma pessoa. A pesquisa mostra que o gargalo é revisão humana (seção 18), então as fases abaixo dizem o que cabe antes do lançamento e o que segue depois.

**Fase 0 · Mapa e pedidos (2 semanas).** Ficha de fontes dos municípios da onda A e dos 50 primeiros da B; inventário de âncoras (consolidações oficiais); cartas de pedido de licença ou cooperação ao CIGA, ao TCE-RS, ao Interlegis, à AMM e à Leis Ltda (cotação de licença); política de coleta e LGPD; benchmark municipal v0 com 30 perguntas. **Portão:** mapa completo da onda A.

**Fase 1 · Piloto (6 semanas).** Dez municípios que exercitam todas as fontes: São Paulo, Belo Horizonte, Curitiba, Florianópolis e Porto Alegre; um município via DOM/SC, um via SIGPub, um com SAPL e compilação, um gaúcho via BLM e um com atos antigos digitalizados. Núcleo tributário em N3. Medir tudo da seção 14, inclusive horas humanas e custo por município. **Portão:** auditoria de 100 dispositivos com erro ≤ 2%; benchmark municipal com abstenção correta ≥ 95%; custo e horas medidos para recalcular a seção 18.

**Fase 2 · Fluxo barato (4 a 6 semanas, em paralelo à 1).** Coletores DOM/SC, SIGPub e BLM; triagem e vigilância em N1 para SC, RS e os estados do SIGPub. **Portão:** publicação → base ≤ 48 horas e recall ≥ 98% contra o DOM/SC num mês.

**Fase 3 · Os 338 (contínua, depois do lançamento).** Lotes de 50 municípios; cada lote passa pelo mesmo portão da Fase 1 com amostra menor. O ritmo é dado pelas horas de revisão disponíveis.

**Fase 4 · Sob demanda.** Coleta sob demanda com os prazos da seção 12.3; o restante das cinco UFs em N2.

**Fase 5 · Jurídico.** Domínios N4 com o JU-04.

**Laço de melhoria** a partir do fim da Fase 1, quando os conjuntos-ouro existirem.

---

## 18. Custo, com premissas

Todas as contas são **estimativas**. Preços de modelo conferidos em 9/11/2026 na referência da API da Anthropic: Haiku 5.5 US$ 0,10 e 0,50 por milhão de tokens de entrada e saída (prompts até 100 mil tokens), Sonnet 5.5 US$ 2 e 10, Opus 5.5 US$ 4 e 20; lote com 50% de desconto. Câmbio da pesquisa 02 do repositório: R$ 5,6858 por dólar pago.

### 18.1 Por ato relevante (lote)

| Etapa | Tokens (entrada / saída) | Modelo | US$ |
|---|---|---|---:|
| Triagem | 700 / 60 | Haiku 5.5 | 0,00005 |
| Extrator primário | 5.000 / 2.500 | Opus 5.5 | 0,0350 |
| Extrator independente | 5.000 / 2.500 | Sonnet 5.5 (ou outro fornecedor de preço parecido) | 0,0175 |
| Revisor | 7.000 / 1.000 | Sonnet 5.5 | 0,0120 |
| Reconciliador, em 20% dos atos | 8.000 / 2.000 | Opus 5.5 | 0,0072 |
| **Total** | | | **≈ 0,072 (R$ 0,41)** |

Premissas: instruções em cache (custo desprezível); texto do ato com média de 3 mil tokens (no DOM/SC, a mediana é 2.074 caracteres e o percentil 90, 9.645; atos tributários tendem a ser maiores) mais 2 mil tokens dos dispositivos-alvo. A pesquisa 02 estimou US$ 0,147 por ato com premissas mais pesadas; uso as duas como faixa: **US$ 0,07 a 0,15**.

### 18.2 Por município, núcleo tributário em N3

Premissa: 100 a 400 atos relevantes por município (cerca de 9 por ano em 10 anos, mais o código-base e as alterações antigas ainda vigentes; a medir no piloto).

| Cenário | Atos | Modelo | OCR | Horas humanas |
|---|---:|---:|---:|---:|
| Baixo | 100 | US$ 7 (R$ 41) | desprezível | 2,7 h (5% para a fila × 8 min + 2 h de âncora) |
| Médio | 200 | US$ 14 (R$ 82) | US$ 0,36 | 6 h (15% × 8 min + 2 h) |
| Alto | 400 | US$ 59 (R$ 334), a US$ 0,147 | US$ 0,72 | 15 h (20% × 10 min + 2 h) |

OCR: 30% dos atos digitalizados, 3 páginas cada, a US$ 2 por mil páginas (Mistral OCR 4 em lote, preço de jul/2026 a confirmar) ou menos de US$ 200 por milhão de páginas com olmOCR em GPU própria. Não pesa no custo; pesa na qualidade.

### 18.3 Por onda

| Item | Onda B (338 municípios) |
|---|---:|
| Modelo, cenário médio | US$ 4,9 mil (R$ 27,7 mil) |
| Modelo, faixa | US$ 2,4 mil a 19,9 mil |
| Horas humanas, cenário médio | ≈ 2.030 h |
| Horas humanas, faixa | ≈ 900 a 5.200 h |
| Em reais, a R$ 90/h (premissa de hora do Estudo de Precificação; a P28, custo real da hora, segue aberta) | ≈ R$ 183 mil no médio |
| Armazenamento dos originais (259 atos por município por ano × 10 anos × 300 KB ≈ 263 GB, Standard-IA em SP a US$ 0,0221/GB-mês) | ≈ US$ 6 por mês |

### 18.4 Operação contínua

- Por município monitorado e por ano: cerca de 3.980 publicações triadas (média do DOM/SC) e 9 atos extraídos ≈ **menos de US$ 1** em modelo e cerca de 11 minutos de revisão (15% × 8 min × 9).
- Os 5.571 municípios em N1: cerca de US$ 5 mil por ano em modelo (22 milhões de publicações triadas a US$ 0,00005 e 52 mil atos a US$ 0,072).
- **O custo dominante é a manutenção dos coletores** (sites mudam) e a fila humana. A métrica "horas por coletor por mês" da Fase 1 decide quantas plataformas valem um coletor próprio.

### 18.5 A comparação que o dono precisa fazer

| Caminho | Custo direto | O que entrega | Risco |
|---|---|---|---|
| Base própria (este plano) | US$ 5 mil em modelo + ~2.000 h de revisão para os 338 | Base auditável, com evidência na publicação oficial | Tempo; capacidade de revisão |
| Licença de consolidação (Leis Ltda) + base própria como conferência | Licença sob consulta (referência: dois contratos de prefeituras encontrados, R$ 3.480 e R$ 12.865,60 por ano, pela publicação e consolidação do próprio município) | Corta a montagem de cadeia nos municípios clientes deles | Dependência de fornecedor; conferir antes de citar |
| Só fluxo (N1) em escala | < US$ 5 mil por ano | Vigilância, sem data do fato | Não cumpre a promessa do produto |

---

## 19. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Cadeia de alterações incompleta faz o Consultor errar a data do fato | Certeza da cadeia na versão; R-MUN4; conferência por repetição; lacuna visível no registro |
| Revogação tácita e cláusula genérica (23% das leis) | Sinal para pessoa, nunca evento automático; categoria prioritária na auditoria |
| Citar lei de outro município parecido | Filtro por município em código antes da busca; validação da localidade da URN; verificação confere o município do trecho |
| Querido Diário fora do ar ou sem financiamento | Usar o código (MIT), não depender da API; coletores próprios por plataforma |
| DOM/SC sem licença declarada | Pedido de licença ao CIGA na Fase 0; texto dos atos é livre (art. 8º, IV) |
| Portais bloqueiam robôs | Parar; LAI ou convênio; município fica em N0 ou N1 até lá |
| Coletor quebra quando o site muda | Mantenedor do Plano de Ingestão; queda automática de nível; alerta de queda de volume |
| OCR ruim em atos antigos | Escada de OCR; confiança por página entra na certeza; conferência humana dos atos-âncora |
| Dados pessoais dos diários | Triagem LGPD na entrada; mascaramento nos índices; relatório de impacto; parecer |
| Dependência de licença | Contrato com saída de dados; base própria como conferência; nunca citar a consolidação licenciada sem a publicação oficial |
| Investimento em ISS perde valor depois de 2038 | Estrutura reaproveitável para IBS municipal, IPTU, ITBI e taxas; ISS ainda rende até lá |
| Laço de melhoria burla a métrica | Funções de avaliação escondidas; conjunto reservado de municípios; revisão humana; área editável restrita |
| Revisão humana não cabe no calendário | Ordem por demanda; licença como acelerador; metas de horas por município no portão |
| Responsabilidade profissional | Grau e nível visíveis em toda resposta; a decisão e a assinatura são do profissional |

---

## 20. Comparação com o plano anexado

### 20.1 O que ficou

- Qualidade e verificabilidade antes de volume; link oficial e metadados para citação auditável.
- Pipeline em estágios, regras e OCR antes de modelo, modelo pequeno onde couber, cache agressivo.
- Querido Diário, DOM/SC, LexML e SAPL como fontes; sites individuais por último.
- Nível de confiança por município, transparência e coleta sob demanda; feedback do usuário sobre norma faltante.
- Métricas de custo por norma, sucesso por fonte e tempo de processamento; riscos de sites que mudam, PDFs ruins, custo e cobertura incompleta.

### 20.2 O que mudou e por quê

| # | Plano anexado | Este plano | Por quê |
|---|---|---|---|
| 1 | MVP com SP, MG, PR, SC e RS inteiros, capitais e todos acima de 100 mil (2.853 municípios) | Clientes-piloto, depois os 338 acima de 100 mil em N3; SC, RS e SIGPub só em fluxo | 2.853 é metade dos municípios; os 338 dão 67% do PIB com 12% daquele número de municípios (2.1) |
| 2 | Tipos: leis, decretos, códigos, ISS, IPTU, zoneamento, posturas e urbanismo juntos | Núcleo tributário no lançamento; urbanismo e posturas com o jurídico | 7,5% das leis e 2,6% dos decretos são tributários (2.2) |
| 3 | Esquema plano por documento (`texto_completo`, `status`, `data_vigencia`) | Fichas do Plano de Ingestão (dispositivo, versão, evento) com extensão municipal, Âncora e Cadeia | Data do fato exige história por dispositivo, não foto (8) |
| 4 | Status "vigente / revogada / alterada, quando detectável" | Eventos, revogação genérica sinalizada, anterioridade como regra, certeza da cadeia | 22,9% de revogação genérica e 4,3% de "(NR)" (2.3) |
| 5 | "Modelo mais forte extrai e padroniza" | Modelo extrai eventos com evidência; código consolida | Acerto exato de 50% e 20% quando o modelo consolida (10.2) |
| 6 | Querido Diário como primeira fonte | Querido Diário como código reaproveitável e descoberta; DOM/SC, SIGPub, BLM e SAPL promovidos | Cobertura de ~520 municípios e API fora do ar no teste; 85,5% dos raspadores são plataformas (4.2) |
| 7 | Sem fonte licenciada | Licença da Leis Municipais como acelerador opcional | Produto de versionamento por data já existe, vendido às prefeituras (4.6) |
| 8 | Sem tribunais de contas | BLM do TCE-RS para o RS inteiro; outros TCEs a investigar | 789.722 documentos, envio obrigatório desde 2009 (4.4) |
| 9 | Sem NFS-e Nacional | Parâmetros municipais como conferência e rótulo | 5.466 municípios em operação, alíquotas com vigência (5.1) |
| 10 | Histórico de 5 anos (ou 2 a 3) | 10 anos no núcleo | Decadência e ISS consultado até ~2038 (5.2) |
| 11 | "Link oficial" | Veículo oficial definido em lei municipal como prova | Portal da prefeitura não é necessariamente oficial (9) |
| 12 | Cinco agentes novos | Agentes do Plano de Ingestão + mapeador e montador de cadeia | Uma arquitetura só |
| 13 | "Ativar DGM completo" para otimizar prompts e ordem | Laço inspirado na DGM, offline, com avaliação escondida e conjunto reservado | A DGM real custa US$ 22 mil por rodada e burla a métrica se puder (13) |
| 14 | Custo qualitativo | Custo com premissas: modelo barato; revisão e coletores pesam | 18 |
| 15 | Jurídico só com robots e rate limit | Direito autoral, licenças, LGPD, termos e LAI; sem CAPTCHA no municipal | 15 |
| 16 | "Nível de confiança" sem efeito definido | N0 a N4 com regras de resposta (R-MUN) e prazos de coleta sob demanda | 7 e 12 |

---

## 21. O que está aberto: perguntas ao dono

Só o que muda o plano:

1. **Primeiros clientes:** contábil, BPO ou advocacia? Se for advocacia, urbanismo, posturas e servidores sobem para o lançamento e o escopo dobra.
2. **Lista de municípios:** onde estão os clientes dos escritórios-piloto? Essa lista é a onda A e ordena a B. Há UF prioritária fora das cinco?
3. **Quem revisa e quanto custa a hora:** o cenário médio pede cerca de 6 horas humanas por município (2.000 h para os 338). Contadores do grupo, equipe contratada ou só auditoria amostral? Isso define o ritmo da Fase 3.
4. **Fonte licenciada:** aceita licenciar consolidação (Leis Municipais) para acelerar? Qual teto? Aceita também uma assinatura de editora só para conferência manual?
5. **Lançar com N2:** aceita lançar municípios com texto vigente sem histórico (N2), rotulados, ou a promessa de data do fato exige N3 em todo município declarado coberto?
6. **Janela:** 10 anos no núcleo, como o Plano de Ingestão, ou 5 anos no começo para chegar mais rápido a mais municípios?
7. **Caminho formal:** aceita abrir pedidos de LAI e termos de cooperação (CIGA, TCE-RS, Interlegis, AMM) em nome da empresa, e abandonar o CAPTCHA pelo celular no municipal?

---

## 22. Correções a documentos do repositório de trabalho

Achados desta pesquisa que afetam textos já escritos (não alterados aqui):

- **Plano de Ingestão, 5.3:** os 834 municípios mineiros usam o caderno "Diário dos Municípios Mineiros" do jornal Minas Gerais (Imprensa Oficial), não o diário da AMM; a AMM tem outro diário, no SIGPub.
- **Plano de 6 meses, premissas:** "os textos são digitais, então não há OCR relevante" não vale para atos municipais antigos nem para portais que publicam imagem.
- **J4 e JU-04:** "Querido Diário, cerca de 350 cidades (2024)" passa a cerca de 520 (2026).
- **Plano do Assistente, guia das técnicas, e roteiro da apresentação:** o "10 a 30 vezes mais barato" é do HippoRAG 1, não do 2; a "árvore de temas guiada pela taxonomia" é uma adaptação do RAPTOR, que agrupa por similaridade.

---

## Fontes

Acessadas em 9/11/2026, salvo indicação. "Testado" = chamada feita durante a pesquisa.

**Municípios: fontes de legislação**
- Querido Diário: [documentação](https://docs.queridodiario.ok.org.br/pt-br/latest/) · [API pública](https://docs.queridodiario.ok.org.br/en/latest/using/public-api.html) · [OKBR no Catarse (cobertura)](https://www.catarse.com.br/queridodiario-okbr/about) · [repositório de raspadores](https://github.com/okfn-brasil/querido-diario) (testado) · [conferência de cobertura, monitorelnino PR 469](https://github.com/monitorelnino/monitorelnino/pull/469) · [issue Ro-DOU 378 (instabilidade)](https://github.com/gestaogovbr/Ro-dou/issues/378)
- LexML: [descrição do acervo, 21/12/2025](https://www.lexml.gov.br/desc_acervo.html) · [especificação da URN, Parte 2](https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf) · [RFC 9676](https://www.rfc-editor.org/rfc/rfc9676.html)
- DOM/SC: [dados abertos do CIGA](https://dados.ciga.sc.gov.br/) (testado, outubro de 2026) · [relatórios do CIGA 2013 e 2014](https://consorciociga.gov.br/wp-content/uploads/2015/05/Plano-de-Trabalho-2015-e-Relatorio-de-Atividade-2014.pdf)
- SIGPub: [diariomunicipal.com.br](https://www.diariomunicipal.com.br/) · [AMUPE](https://www.diariomunicipal.com.br/amupe/)
- Minas Gerais: [Agência Minas, 22/04/2026](https://agenciaminas.mg.gov.br/noticia/jornal-minas-gerais-completa-134-anos-como-referencia-em-transparencia-e-parceria-com-municipios) · [SEGOV-MG, caderno Diário dos Municípios Mineiros](https://www.governo.mg.gov.br/Noticias/Detalhe/5347)
- TCE-RS: [Atricon, consulta pública da BLM, 02/10/2019](https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/) · [IN TCE-RS 12/2009](https://atosoficiais.com.br/tcers/instrucao-normativa-n-12-2009-regulamenta-o-encaminhamento-de-normas-expedidas-pelos-entes-jurisdicionados-da-esfera-municipal-a-base-de-legislacao-municipal-blm-instituida-pela-resolucao-843-de-04-de-marco-de-2009-e-da-outras-providencias)
- Outros TCEs: [TCE-RN, Resolução 017/2020](https://www.tce.rn.gov.br/as/Legislacao_site/download/resolucoes_tce_rn/3_000017_2020_CPJUR_25.05.2021.0725.pdf)
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
- [Estimativas de população 2025, arquivo de 28/08/2026](https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2025/) · [PIB dos Municípios, SIDRA 5938](https://apisidra.ibge.gov.br/values/t/5938/n6/all/v/37/p/last%201) · [CEMPRE, SIDRA 1685](https://apisidra.ibge.gov.br/values/t/1685/n6/all/v/706/p/last%201) (todos testados)
- [CFC, Relato Integrado 2025](https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf) · [CRCSP, transparência](https://crcsp.org.br/transparencia/)

**Jurídico**
- [Lei 9.610/1998 (LEGIN/Câmara)](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html) · [ANPD, guia de tratamento pelo Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_tratamento_de_dados_pessoais_pelo_poder_publico___defeso_eleitoral.pdf/@@display-file/file) · [Jusbrasil, termos de uso](https://www.jusbrasil.com.br/termos-de-uso)

**Técnica**
- [RAPTOR, Sarthi et al., ICLR 2024](https://arxiv.org/abs/2401.18059) · [anais do ICLR 2024](https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html)
- [HippoRAG 2, Gutiérrez et al., ICML 2025](https://arxiv.org/abs/2502.14802) · [HippoRAG 1](https://arxiv.org/abs/2405.14831)
- [Rank1, Weller et al., COLM 2025](https://arxiv.org/abs/2502.18418)
- [Darwin Gödel Machine, Zhang et al.](https://arxiv.org/abs/2505.22954) · [Hyperagents (DGM-H)](https://arxiv.org/abs/2603.19461)
- [Etcheverry et al., consolidação automática, NLLP 2024](https://aclanthology.org/2024.nllp-1.13/) · [Prior et al., riscos e limites da consolidação automática, NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)
- [olmOCR, arXiv 2502.18443](https://arxiv.org/abs/2502.18443) · [DODFMiner, extração em diários oficiais (UnB)](https://dodfminer.readthedocs.io/en/main/user/intro.html)
- [Preços da API da Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)

**Repositório de trabalho (DGM-RAG-Contabil)**
- `docs/Plano_de_Ingestao_da_Base_Legal.md`, `docs/Plano_Assistente_de_IA_para_Contadores.md`, `docs/Plano_MVP_6_meses.md`, `docs/subplanos/07-Motores-e-Consultor.md`, `docs/subplanos/08-Conectores.md`, `docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md`, `docs/Estudo_de_Precificacao_por_Modulo.md` (hora de R$ 90, P28)
- `pesquisa/01-infra-aws.md` (S3), `pesquisa/02-custos-llm.md` (câmbio, custo por ato), `pesquisa/04-juridico-tributario-dados.md` (LAI, fontes pagas), `pesquisa/juridico/J4-fontes-e-integracoes.md`, `pesquisa/plataforma/V2-estados-municipios.md` (planilha de adesão à NFS-e de 28/09/2026)
