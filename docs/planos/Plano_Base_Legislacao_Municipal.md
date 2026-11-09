# Plano da Base de Legislação Municipal (e dos módulos de base legal)

**Versão 0.3 · 9 de novembro de 2026 · incorpora as duas rodadas de decisões do dono do produto de 9/11/2026.**

Este plano diz como a base legal da Heild cobre a legislação **municipal** com a mesma promessa do resto da base: redação vigente na data do fato, trecho citado, grau de segurança e abstenção quando não há base. Também organiza a **base estadual dos 27 entes**, os **módulos de base legal** em que o Assistente e o Consultor serão vendidos (seção 6) e a **revisão pela IA** que vale para toda a ingestão (seção 13). Ele valida, corrige e substitui o plano municipal anexado ao pedido (seção 23) e se encaixa nos planos do repositório de trabalho `DGM-RAG-Contabil`, sem reescrevê-los:

- [Plano de Ingestão da Base Legal](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_de_Ingestao_da_Base_Legal.md): fichas, princípios, agentes, portões. Este plano mantém as fichas e os princípios e troca o papel humano pela revisão pela IA (seções 13 e 25).
- [Plano do Assistente](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_Assistente_de_IA_para_Contadores.md) e [Subplano 07 · Motores e Consultor](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/07-Motores-e-Consultor.md): cascata do M1 Legal, `legal.consultar`, verificação e abstenção.
- [JU-04 · Motor jurídico e base de leis](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md) e as pesquisas J3, J6 e [J9 · Ordem dos módulos](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/pesquisa/juridico/J9-ordem-dos-modulos-de-base.md): os módulos jurídicos e a sua ordem.

As notas brutas, com cada fonte e o que foi testado, estão em [`pesquisa-base-municipal/notas-de-pesquisa.md`](pesquisa-base-municipal/notas-de-pesquisa.md). Todo número tem fonte e data. O que é conta minha vem marcado como **estimativa**, com a conta ao lado.

**Como ler as marcas.**
- **[Dono]**: decisão do dono de 9/11/2026.
- **[Proposta]**: proposta deste plano, ainda não aprovada.
- Sem marca: fato pesquisado ou consequência direta de uma decisão.

### Histórico de versões

| Versão | O que mudou |
|---|---|
| 0.1 | Plano municipal: fontes, técnica, custo, comparação com o plano anexado |
| 0.2 | **[Dono]** Contábil e BPO primeiro. Também nesta versão: <ul><li>módulos de base legal;</li><li>estadual dos 27 entes;</li><li>municipal só o fácil, o resto sob demanda;</li><li>texto atual sem histórico (C2) rotulado;</li><li>10 anos no federal e 5 no local;</li><li>LAI, convênios e CAPTCHA como reserva.</li></ul> Níveis renomeados de N0–N4 para **C0–C4**, para não colidir com o JU-04 |
| **0.3** | **[Dono]** **Revisão pela IA como padrão** em toda a ingestão: famílias de modelos diferentes, reconciliação, rodadas de revisão e revisor final de outra família (seção 13). Consequências: <ul><li>divergência persistente rebaixa a certeza, sem ir para pessoa;</li><li>taxa de erro medida contra conjuntos-ouro automáticos e reportes confirmados, sem auditoria humana obrigatória;</li><li>pessoa só em CAPTCHA, papelada de LAI e convênios e reunião de parceria, com as horas;</li><li>custo refeito com a revisão múltipla.</li></ul> **[Dono]** **Leis Ltda como trilha adicional**, da licença até uma eventual parceria societária (seção 18). Referências de seção corrigidas |

---

## 1. Resumo

**O problema.** São 5.570 municípios mais o Distrito Federal (5.571 linhas na estimativa do IBGE de 2025).
- Cada município publica no seu veículo oficial, num de dezenas de sistemas, e quase nenhum mantém texto compilado.
- Em outubro de 2026, nos diários municipais de Santa Catarina, só 1,3% das publicações eram leis e 5,2% eram decretos.
- Quase um quarto das leis ainda revoga "as disposições em contrário" sem dizer quais.
- Não existe serviço aberto que entregue a lei municipal vigente numa data.

No estadual a situação é melhor, mas não é a do federal: o LexML padroniza só 6 assembleias e o DF.

**O escopo decidido pelo dono:**

1. **[Dono]** Lançamento para **contábil e BPO**, com o **núcleo tributário** como primeiro domínio local. A advocacia vem depois, em **módulos de base legal**, do mais comum ao menos comum (seção 6).
2. **[Dono]** **Estadual: os 27 entes.** São cerca de 100 coletores (**estimativa**) e US$ 10 mil a 19 mil em modelo para 5 anos de histórico (**estimativa**, seção 21).
3. **[Dono]** **Municipal: só o que é fácil de puxar** (DOM/SC, SIGPub, SAPL, BLM do TCE-RS se houver acesso, classes do Querido Diário). O resto entra **sob demanda e pelo feedback dos usuários**.
4. **[Dono]** Janela de **10 anos no federal** e de **5 anos no estadual e no municipal**.
5. **[Dono]** **Revisão pela IA, não por pessoas**, em toda a ingestão. O desenho (seção 13):
   - duas extrações independentes por modelos de **famílias diferentes**;
   - reconciliação e rodadas de revisão;
   - um **revisor final de uma terceira família**;
   - limiares de consenso, consolidação por código e validação automática.

   Divergência que persiste roda de novo com mais contexto ou **rebaixa a certeza**, que aparece no rótulo. O erro é medido contra **conjuntos-ouro automáticos** e contra reportes confirmados dos usuários.
6. **[Dono]** O texto atual sem histórico (**C2**) pode ser lançado, rotulado "Texto atual · sem histórico" (seção 8).
7. **[Dono]** A **Leis Ltda** (Leis Municipais) entra como **trilha adicional**: uma reunião que pode ir de licença de dados a parceria societária. Acelera, mas o plano funciona sem ela (seção 18).

**O limite, dito com franqueza.** Modelos diferentes erram juntos com frequência. Num estudo do ICML 2025 com mais de 350 modelos, quando dois modelos erravam, davam a mesma resposta errada em 60% dos casos num dos conjuntos. Por isso a concordância entre famílias não basta. O plano exige ainda evidência literal, consolidação por código, conferência contra ouro externo, reportes e certeza visível (seção 13.6).

**O que custa.**
- **Modelo**, com a revisão múltipla, cerca de **US$ 0,10 por ato relevante** (faixa de 0,10 a 0,20):
  - federal, US$ 2,4 mil a 4,8 mil (10 anos de atos);
  - estadual, US$ 10 mil a 19 mil no histórico e US$ 160 a 300 por mês;
  - municipal, cerca de US$ 0,25 por município por ano no fluxo e US$ 5 a 40 por município para o histórico sob demanda.
- **Pessoas**, só onde não há jeito:
  - cerca de **2 a 7 horas por mês** (CAPTCHA e acompanhamento de LAI);
  - **40 a 110 horas pontuais** no começo (primeira leva de LAI e convênios, e a trilha da Leis Ltda).
- O que mais pesa continua sendo **construir e manter os coletores**.

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

Os 10 maiores PIBs municipais somam 24,5% do PIB; os 100 maiores, 52,9% (58 deles nas cinco UFs). Com a decisão do dono, esses números **ordenam a fila sob demanda** (seção 19), em vez de definir uma meta.

O CFC registra 101.880 organizações contábeis ([Relato Integrado 2025](https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf)). O CRCSP informa 533.724 profissionais ativos em 30/09/2024, 29% deles em SP, e que a maior parte das organizações está no estado ([CRCSP, transparência](https://crcsp.org.br/transparencia/)).

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

O filtro é aproximado e deve ser refeito no piloto.

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
2. A revogação tácita é caso comum, não exceção.
3. Um quarto das leis traz anexo (tabelas), que precisa da Ficha 4.

### 2.4 O que está em jogo

- **Contábil:**
  - nos estados: ICMS (RICMS, substituição tributária, benefícios), ITCMD e IPVA;
  - nos municípios: ISS (alíquota por item da LC 116, retenção, local de incidência, sociedades uniprofissionais), IPTU, ITBI, taxas, COSIP, unidade fiscal, parcelamentos;
  - no DP: feriados municipais e pisos estaduais.
- **BPO financeiro:** ISS retido nas notas de fornecedores, substituição tributária e diferencial de alíquota nas compras, taxas e alvarás.
- **Advocacia (seção 6):** IPTU, ITBI e plano diretor no Imobiliário; servidores, licitações e posturas no Administrativo; ITCMD na Família; custas e calendário forense no Civil.

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

O dono entende que a legislação estadual "é parecida com a federal".

**No conteúdo, é:** os mesmos tipos de norma, a mesma técnica legislativa e um diário oficial por UF.

**Na forma de obter, não é:**
- **Não há serviço estadual único.** A API do Senado e o normas.leg.br são só federais. O LexML padroniza 6 assembleias e o DF; as outras 20 UFs exigem coleta própria.
- **O ICMS mora nas Sefaz.** O RICMS é longo e muda por decreto com frequência, e cada Sefaz publica do seu jeito.
- **São quatro fontes por UF**: Sefaz, diário oficial, assembleia (quando fora do LexML) e tribunal administrativo. Isso dá **cerca de 100 coletores** (**estimativa**: 27 + 27 + 20 + 27).
- **CONFAZ e resoluções do Senado** são federais e entram uma vez, para as 27 UFs.

Serviços comerciais (LegisWeb, IOB, Econet, Leis.Org) juntam federal, estadual e parte do municipal, mas não são abertos e a compilação é protegida (seção 17).

### 3.3 Quanto custam os 27 entes

**Estimativa**, escalando a premissa da pesquisa 02 do repositório. Por UF e por ano: 330 atos normativos de ICMS, ITCMD e IPVA, 300 respostas a consultas e 200 decisões do tribunal administrativo. É um teto: a pesquisa 02 tirou esses números das UFs grandes. O custo por ato já inclui a revisão múltipla pela IA (seção 21.1).

| Item | 5 anos, 27 UFs | Custo em modelo |
|---|---:|---:|
| Atos normativos | 44.550 | US$ 4,5 mil a 8,9 mil |
| Respostas a consultas | 40.500 | US$ 2,6 mil a 5,1 mil |
| Decisões administrativas | 27.000 | US$ 1,2 mil a 2,4 mil |
| Textos consolidados vigentes (premissa: 3 milhões de tokens por UF) | ~81 milhões de tokens | ~US$ 1,0 mil |
| Triagem dos diários estaduais (3 mil atos por UF por mês, premissa da pesquisa 02) | ~4,9 milhões | ~US$ 1,3 mil |
| **Total do histórico** | | **US$ 10 mil a 19 mil (R$ 60 mil a 106 mil)** |
| **Manutenção** | ~1.870 atos por mês | **US$ 160 a 300 por mês** |

O custo de verdade é **construir e manter os cerca de 100 coletores**. A métrica "horas por coletor por mês" da Fase 1 dirá quanto isso pesa.

**[Proposta] Ordem dentro do estadual:**
1. Texto vigente (C2) das 27 UFs, ancorado no RICMS e nas leis consolidadas oficiais onde existirem.
2. Histórico de 5 anos (C3) primeiro nas UFs dos clientes dos pilotos, que o dono espera estarem na maioria em RS, SC, PR, SP e MG.
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
| **TCE-RS, Base de Legislação Municipal (BLM)** | 789.722 documentos no LexML; "mais de um milhão de normas" na consulta pública ([Atricon, 02/10/2019](https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/)) | Norma | Sim | Indexação; sem consolidação | Envio obrigatório pelos municípios desde 2009 (Res. 843/2009, IN 12/2009). A consulta pública fica em leismunicipais.com.br/tcers, que recusa robôs; o caminho é **LexML, convênio com o TCE-RS ou a trilha da Leis Ltda** (seção 18) | Estoque e completude do RS |
| **LexML municipal** | 57 câmaras, 285.963 documentos (21/12/2025) | Norma | Link | Não | Aberta | Índice e URN |
| **SAPL** (Interlegis) | "Cerca de 1.200 câmaras" (técnico do Senado, 2026) | Norma; **dispositivo** quando a câmara usa a compilação | PDF | **Normas relacionadas** (altera, revoga) e **dispositivos com vigência e eficácia** | API REST aberta | Melhor fonte estruturada das leis; ouro automático |
| **Leis Municipais / Leis.Org** (Leis Ltda, empresa privada) | "Mais de 1.000 municípios, governos estaduais e tribunais de contas" (proposta de dez/2023); "1.350 órgãos" e "10 milhões de normas" (notícia, 2025-2026) | Norma | Sim | **Consolidação, compilação e versionamento por data** | Compilação protegida; portal recusa acesso automatizado; só por acordo | **Trilha adicional** (seção 18) |
| Jusbrasil, LegisWeb, IOB, Econet | Ampla, não auditada | Norma | Sim | Variável | Uso individual; o Jusbrasil proíbe robôs (cláusula 2.5.2) | Só conferência manual |
| Portais de prefeituras e câmaras | Heterogêneo | Varia | PDF, muitas vezes digitalizado nos atos antigos | Raro | Público; robots e termos por site | Sob demanda |
| **NFS-e Nacional, parâmetros municipais** | 5.466 municípios em operação (out/2026) | Tabela | Dados | **Com vigência** | API oficial | Ouro automático de alíquotas (não é base legal) |

### 4.2 Querido Diário

- **Cobertura.** A OKBR declara 522 municípios e cerca de um terço da população. Um projeto de terceiros contou 527 municípios com diário indexado e 5.044 sem, em 30/09/2026 ([monitorelnino, PR 469](https://github.com/monitorelnino/monitorelnino/pull/469)). A pesquisa J4 ainda falava em 350 cidades (2024).
- **Código.** O repositório de raspadores (`okfn-brasil/querido-diario`, último commit em 23/09/2026) tem 449 raspadores e 441 códigos IBGE distintos.
  - Por UF: SP 116, BA 74, RJ 33, SE 29, MA 29, PR 27, TO 26, RS 21, MG 21, SC 3.
  - **384 (85,5%) herdam uma de 21 classes de plataformas replicáveis**: Instar 111, DOEM 56, DOSP 42, ADiários 39, Município Online 26, Atende 22, DIOF 21, entre outras.
- **API.** Endpoint `/gazettes`, limite de referência de 60 requisições por minuto ([docs](https://docs.queridodiario.ok.org.br/en/latest/using/public-api.html)). Em 9/11/2026 o endereço antigo falhou na negociação TLS, o WebFetch recebeu 503 e o endereço novo não respondeu. Uma issue de outubro de 2026 relata instabilidade ([Ro-DOU 378](https://github.com/gestaogovbr/Ro-dou/issues/378)).
- **Base dos Dados:** a busca do catálogo não mostra conjunto do Querido Diário em 9/11/2026.
- **Atraso e qualidade do texto:** não foi possível medir; medir na Fase 0.

### 4.3 Diários associativos e estaduais

- **DOM/SC.** Um registro por ato, com `municipio`, `entidade`, `categoria`, `titulo`, `texto`, `link` e `url` do PDF.
  - Só um ato em 6.319 leis e decretos de outubro veio sem texto.
  - Os dados abertos vão de jan/2023 a out/2026; antes disso, o portal diariomunicipal.sc.gov.br.
  - A página do recurso diz "Nenhuma licença fornecida": pedir licença ao CIGA.
- **SIGPub.** Uma plataforma, um coletor, muitos estados; cada ato tem "Código Identificador" verificável.
- **Minas Gerais: correção.** Os 834 municípios usam o **Diário dos Municípios Mineiros, caderno do jornal Minas Gerais** (Imprensa Oficial do Estado; Decreto Estadual 48.175/2021). A AMM mantém **outro** diário, no SIGPub.

### 4.4 Tribunais de contas

O TCE-RS mantém a **BLM**, alimentada por envio obrigatório dos municípios desde 2009 e publicada em até 24 horas após validação diária.
- É o único órgão de âmbito estadual que fornece legislação municipal ao LexML: 789.722 documentos, cerca de 1.589 por município do RS (**estimativa**: 789.722 ÷ 497).
- TCE-RN (Sistema Legis, Res. 017/2020) e TCE-PI (Res. 09/2009) também pedem envio de legislação municipal. Não encontrei consulta pública desses (**a confirmar**).

### 4.5 SAPL

Testei a API pública da câmara de Cacoal (RO) em 9/11/2026:

- `/api/norma/normajuridica/`: número, ano, datas, veículo, ementa, PDF, data de vigência, tipo e assuntos; 3.631 normas.
- `/api/norma/normarelacionada/` com `tipo_vinculo` em 14 tipos ("Altera o(a)", "Revoga integralmente", "Revoga parcialmente", "Revoga integralmente por consolidação", "Norma correlata"...). Cacoal tem 699 vínculos.
- `/api/compilacao/dispositivo/`: **dispositivo a dispositivo**, com `inicio_vigencia`, `fim_vigencia`, `inicio_eficacia`, `fim_eficacia`, `dispositivo_substituido` e `dispositivo_atualizador`. Cacoal tem 278 textos articulados e 21.149 dispositivos.

**Limites.**
- O SAPL é da câmara: traz leis, resoluções e decretos legislativos, e **não traz decretos do Executivo**.
- Os 1.200 vêm de fala de técnico do Senado reproduzida em notícias de 2026.

### 4.6 A Leis Municipais, explicada

- **O que é.** **Empresa privada** (Leis Ltda, ligada à Liz Serviços Online, Itapema/SC), contratada pelas **próprias prefeituras e câmaras**, por inexigibilidade, para publicar e consolidar a legislação **delas**.
- **O que entrega.** O contrato de Caçapava do Sul (abril de 2025) define versionamento como os textos "por cada período de tempo em que existiram alterações/revogações", com "o texto vigente até a data selecionada".
- **Os valores encontrados não são o preço de uma licença para a Heild.** Caçapava do Sul paga R$ 3.480 por ano e a proposta a Ilhota (dez/2023) é de R$ 12.865,60 por ano. Esses valores são o que **uma prefeitura paga pelo serviço para o próprio município**.
- **Como seria para a Heild.** A compilação é protegida (Lei 9.610, art. 7º, XIII) e o portal recusa acesso automatizado (403 em 9/11/2026). Qualquer uso é negociação entre empresas, com preço desconhecido.
- **[Dono]** Vira trilha adicional (seção 18).

O Jusbrasil trata acessos por robôs como ilegítimos (Termos, 2.5.2). LegisWeb, IOB e Econet servem só de conferência manual.

### 4.7 O que já existe consolidado

- A Leis Municipais, para os seus clientes.
- As câmaras que usam a compilação do SAPL.
- Portais oficiais como o Portal da Legislação da Prefeitura de São Paulo ([Casa Civil SP](https://prefeitura.sp.gov.br/web/casa_civil/w/portal-da-legisla%C3%A7%C3%A3o-ultrapassa-4-milh%C3%B5es-de-visualiza%C3%A7%C3%B5es-no-1%C2%BA-semestre-de-2025%C2%A0)).
- Republicações oficiais de códigos tributários. Não há inventário nacional; a Fase 0 levanta município a município.

### 4.8 Acesso formal

A LAI manda os sites oficiais "possibilitar o acesso automatizado por sistemas externos em formatos abertos, estruturados e legíveis por máquina" (art. 8º, § 3º, III). Municípios com até 10 mil habitantes estão dispensados de publicar na internet (art. 8º, § 4º), mas continuam obrigados a responder pedidos (pesquisa 04, 6.4). São 2.469 municípios, com 6,0% da população.

**[Dono]** A empresa pede por LAI e firma convênios em seu nome.

---

## 5. O que muda o problema: NFS-e Nacional e reforma tributária

### 5.1 NFS-e Nacional

- **Adesão.** O painel da Receita citado em 28/10/2026 mostra **5.571 municípios conveniados**, **5.466 em operação** e 3.062 usando o Emissor Nacional ([Nota Gateway](https://notagateway.com.br/adesao-municipios-nfse/)). Em janeiro de 2026 eram 1.898 em operação ([Portal da Reforma](https://www.reformatributaria.com/tecnologia/lista-de-municipios-aderentes-a-nfs-e-nacional-chega-a-5-465-so-347-estao-com-a-plataforma-em-operacao-ativa/)). A LC 214/2025 obriga o padrão nacional desde 2026.
- **O que a API traz.** Parâmetros municipais **com vigência** ([manual de municípios v1.2, out/2025](https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual/manual-municipios-emissor-publico-api-sistema-nacional-nfs-e-v1-2-out21025.pdf)):
  - convênio;
  - **alíquotas por subitem da lista de serviços**;
  - retenções;
  - benefícios.
- **Consequência.** É uma tabela nacional, oficial e datada de alíquotas de ISS. Não é a lei, mas é **ouro automático** para a Ficha 4 e parâmetro rotulado quando o município não tem cobertura.

### 5.2 Reforma tributária

- **ISS até 2032.** A EC 132/2023 reduz o ICMS e o ISS a 9/10 em 2029, 8/10 em 2030, 7/10 em 2031 e 6/10 em 2032, e os extingue a partir de 2033 (ADCT, arts. 128 e 129). O texto está no [Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm), que bloqueia robôs; há um resumo da [PwC](https://www.pwc.com.br/pt/thinking-about-taxes/tax-intelligence/2023/reforma-tributaria-sobre-o-consumo-promulgacao-da-emenda-constitucional-n-132.pdf).
- **O ISS segue perguntado depois de 2033.** A decadência é de cinco anos (CTN, art. 150, § 4º, e art. 173, I), então fatos de 2032 seguem em revisão até cerca de 2038. A janela móvel de 5 anos cobre isso.
- **IBS também é lei local.** Cada ente fixa sua alíquota própria do IBS por lei específica; sem lei, vale a alíquota de referência do Senado (CF, art. 156-A, § 1º, V; LC 214, art. 14).
- **Ficam municipais, sem prazo:**
  - IPTU, cuja base de cálculo pode ser atualizada por ato do Executivo, nos critérios da lei municipal;
  - ITBI, com normas gerais da LC 227/2026 (publicada em 14/01/2026);
  - taxas, COSIP, posturas, uso do solo e servidores.

### 5.3 Prioridade e horizonte por tipo de norma local

| Tipo | Valor | Horizonte | Prioridade |
|---|---|---|---|
| ICMS (RICMS, ST, benefícios), ITCMD, IPVA | Muito alto (contábil e BPO) | ICMS até 2032, consultas até ~2038; ITCMD e IPVA permanentes | **Lançamento**, 27 UFs |
| Código tributário municipal e leis de ISS | Muito alto | Até 2032; consultas até ~2038 | **Lançamento** onde for fácil; sob demanda no resto |
| Regulamento do ISS, decretos de NFS-e | Alto | Idem | Idem |
| IPTU, ITBI, taxas, COSIP, UFM, REFIS | Alto | Permanente | Idem |
| Lei estadual e municipal de alíquota do IBS | Alto a partir da transição | 2029 em diante | Monitorar desde já |
| Feriados municipais (Lei 9.093/1995) e pisos estaduais | Médio (DP) | Permanente | Lançamento |
| Posturas, uso do solo, plano diretor, servidores, licitações locais | Alto na advocacia | Permanente | Com os módulos jurídicos (seção 6) |
| Créditos orçamentários, denominação de ruas, títulos honoríficos | Nenhum | — | Descartar na triagem |

---

## 6. Módulos de base legal

**[Dono]** O Assistente e o Consultor serão vendidos com bases de leis em **módulos menores**. Contábil e BPO vêm no lançamento; os jurídicos seguem do mais comum ao menos comum.

### 6.1 De onde vem cada parte

- **Ranking e ordem dos módulos jurídicos:** [J9](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/pesquisa/juridico/J9-ordem-dos-modulos-de-base.md) (8/11/2026). O critério é o percentual de advogados por área principal (Perfil ADV, CFOAB e FGV, n = 20.885), com desempate pelo volume de casos novos do CNJ (Justiça em Números 2024 e 2025).
- **Corpus mínimo, fontes, camadas (L0 a L5) e níveis de maturidade:** JU-04, seções 3.1 a 3.4.
- **Atividades por área:** J3 (234 atividades em 12 áreas; o prazo é o centro de gravidade).
- **Próximo pacote:** J6 põe o jurídico em 1º lugar entre os pacotes candidatos.
- **Decisão do JU-04 (9/11/2026):** na onda 2, Família antes de Trabalhista.
- **Novo aqui:** as camadas estadual e municipal de cada módulo. O que não estava em J9 ou no JU-04 vem marcado **[acréscimo]**.

### 6.2 Módulos do lançamento: contábil e BPO

**[Proposta]** A divisão em módulos é nova. O conteúdo vem do Plano de Ingestão (seções 3, 5 e 6) e do Plano do Assistente (Camada 1).

| Módulo | Federal (10 anos) | Estadual (27 UFs, 5 anos) | Municipal (5 anos) | Reuso |
|---|---|---|---|---|
| **T1 · Tributário federal** | CTN; LC 123 e CGSN; LC 214 e LC 227; PIS/Cofins, IRPJ/CSLL, IPI; RIR e RIPI; INs da RFB; COSIT; CARF; temas do STF e do STJ | — | — | Jurídico 8 |
| **T2 · Tributos estaduais** | LC 87/1996, LC 24/1975, CONFAZ, resoluções do Senado sobre alíquotas interestaduais, normas gerais do ITCMD (LC 227) | RICMS e anexos (ST, MVA), leis e decretos de ICMS, ITCMD e IPVA, respostas a consultas, tribunal administrativo | — | Jurídico 8; ITCMD no 2 |
| **T3 · Tributos municipais** | LC 116 (mínimo de 2%), CF arts. 156 e 156-A, normas gerais do ITBI (LC 227), LC 214 | — | Código tributário, ISS, IPTU, ITBI, taxas, COSIP, UFM, REFIS, regulamentos, alíquota do IBS; fácil (C1) e sob demanda (C2/C3) | Jurídico 8 e 9 |
| **D1 · Trabalhista e previdenciário do DP** | CLT, legislação previdenciária, eSocial, FGTS, Portaria MTE 671/2021; convenções e acordos (Mediador) | Pisos salariais estaduais onde instituídos **[acréscimo]** | Feriados municipais (Lei 9.093/1995) **[acréscimo]** | Jurídico 3 e 4 |
| **S1 · Societário e registro** | CC Livro II, Lei 6.404, Lei 8.934, Decreto 1.800, INs do DREI, Lei 13.874, Redesim | Atos das 27 Juntas Comerciais | Alvará e licença de funcionamento **[acréscimo]**, sob demanda | Jurídico 7 |
| **K1 · Normas contábeis** | NBC, CPC e ITG do CFC | — | — | — |
| **B1 · BPO financeiro** | Retenções na fonte (IRRF; CSRF, Lei 10.833/2003, art. 30; INSS, Lei 8.212, art. 31), NF-e e NFS-e, normas do Banco Central sobre Pix e boleto, duplicata (Leis 5.474/1968 e 13.775/2018), protesto (Lei 9.492/1997), juros e multa (CC e Lei 14.905/2024), LGPD, split payment (LC 214) | Fatia do T2: ST e diferencial de alíquota | Fatia do T3: ISS retido pelo tomador (LC 116, art. 6º, e lei municipal) | **[acréscimo]**; validar com o subplano 10 |

**[Proposta] Venda:** um pacote Contábil (T1, T2, T3, D1, S1, K1) e um pacote BPO (B1 com as fatias de T2 e T3 só para leitura e citação, pela regra de "fatia" do JU-04, 3.3). Preço no Estudo de Precificação.

### 6.3 Módulos jurídicos, do mais comum ao menos comum

Percentual de advogados por área principal e corpus federal de J9 e do JU-04, 3.2. Onda de construção do JU-04, 3.3. A coluna "#" é a posição no ranking; a tabela segue a ordem de construção.

| # | Módulo | Advogados | Federal | Estadual | Municipal | Reuso do lançamento | Onda |
|---|---|---:|---|---|---|---|---|
| 0 | **N0 Núcleo** | todos | CF, LINDB, Estatuto e Ética da OAB, CPC, CPP, CLT processual, Lei 9.099, súmulas vinculantes, índices | Calendário forense por tribunal (JU-03), custas por UF | Feriados locais, via calendário dos tribunais | — | 0 |
| 1 | **Civil e Processual Civil** | 26% | CC, CPC, Leis 9.099, 9.307, 13.140; STJ | Custas e prazos por UF; regimentos dos TJs **[acréscimo]** | — | — | 1 |
| 2 | **Família e Sucessões** | 14% | CC Livros IV e V, CPC, Leis 5.478, 11.441, 12.318, 13.058, ECA, provimentos do CNJ | **ITCMD (27 leis)**; códigos de normas das corregedorias | — | T2 | 2 |
| 3 | **Trabalhista** | 12% | CLT, Lei 13.467, TST, convenções (Mediador), índices (ADC 58) | Pisos estaduais **[acréscimo]** | Feriados municipais **[acréscimo]** | D1 | 2 |
| 4 | **Previdenciário** | 11% | Leis 8.212 e 8.213, Decreto 3.048, EC 103, INSS, TNU | Regimes próprios de servidores **[acréscimo]**, fora da 1ª versão | Idem **[acréscimo]** | D1 | 2 |
| 6 | **Consumidor e Bancário** | 6% | CDC, Decretos 2.181 e 11.034, Lei 14.181, STJ, CMN e BC | Leis estaduais de consumo **[acréscimo]** | Leis municipais de consumo (ex.: espera em agência) **[acréscimo]**, sob demanda | — | 3 |
| 5 | **Penal e Processual Penal** | 8% | CP, CPP, LEP, Leis 11.343, 11.340, 12.850, 13.964 | — | — | — | 3 (depois do Consumidor, pelo portão do JU-04) |
| 7 | **Empresarial** | 4% | CC Livro II, Leis 6.404, 11.101, 13.874, 14.195, LC 123, DREI | Juntas Comerciais | Alvarás, sob demanda | S1 | 4 |
| 8 | **Tributário** | 3% | CTN, Lei 6.830, Decreto 70.235, LC 116, EC 132, LC 214, STJ, STF, CARF | Tribunais e processo administrativo estaduais | Processo administrativo tributário municipal | T1, T2, T3 | 4 |
| 9 | **Imobiliário** | 3% | Leis 8.245, 6.015, 13.465, 4.591, 13.786, CC Livro III | Códigos de normas das corregedorias; ITCMD | **IPTU, ITBI, plano diretor, uso do solo, código de obras** (pesado; sob demanda) | T3 | 5 |
| 10 | **Saúde e Planos** | 1% | Lei 9.656, ANS, STJ, STF | — | — | — | 5 |
| 11 | **Administrativo** | sem linha | Leis 14.133, 9.784, 8.429 e 14.230, LAI, TCU | Processo administrativo, estatutos, TCEs | **Estatutos de servidores, licitações locais, posturas** (pesado; sob demanda) | Coletores municipais | 5 |
| 12 | **LGPD e Digital** | 0% | LGPD, ANPD, Marco Civil, Leis 12.846 e 9.613 | Regulamentação local **[acréscimo]** | Idem | — | 6 (paralelo desde a 2) |
| 13 | **Ambiental** | 1% | Lei 9.605, Código Florestal, CONAMA | Licenciamento estadual **[acréscimo]** | Licenciamento municipal **[acréscimo]** | — | 6 |
| 14 | **Eleitoral** | 0% | Legislação eleitoral, TSE | — | — | — | 6 (janela de 2028) |
| 15 | **Agrário** | 0% | Normas fundiárias **[a confirmar no JU-04]** | Terras estaduais **[acréscimo]** | — | — | 7 |
| 16 | **Propriedade Intelectual** | 0% | Leis 9.279, 9.609, 9.610, INPI, tratados | — | — | — | 7 |
| 17 | **Militar** | sem linha | CPM, CPPM, STM | Estatutos dos militares estaduais **[acréscimo]** | — | — | 7 |
| 18 | **Marítimo** | sem linha | Tribunal Marítimo, tratados | — | — | — | 7 |
| 19 | **Internacional** | sem linha | Tratados | — | — | — | 7 |

Leitura:
- Os cinco primeiros jurídicos concentram 71% dos advogados; o pacote A de J9 também chega a 71% (26 + 2 de Contratual + 14 + 12 + 11 + 6).
- O peso local dos jurídicos está quase todo no **estadual**, já coberto.
- O **municipal pesado** se concentra em Imobiliário e Administrativo, na onda 5, sob demanda.

### 6.4 Ordem de construção

| Etapa | Módulos | Fonte da ordem |
|---|---|---|
| Lançamento | N0 compartilhado (a parte que o contábil usa) + T1, T2, T3, D1, S1, K1 + B1 | **[Dono]** |
| Jurídico, onda 0 | N0 completo | JU-04 |
| Onda 1 | Civil e Processual Civil | J9, JU-04 |
| Onda 2 | Família e Sucessões; depois Trabalhista e Previdenciário | JU-04 (9/11/2026) |
| Onda 3 | Consumidor e Bancário; depois Penal | J9 |
| Onda 4 | Empresarial e Tributário | J9 |
| Onda 5 | Imobiliário, Saúde, Administrativo | J9 |
| Onda 6 | LGPD (paralelo desde a 2), Ambiental, Eleitoral | J9 |
| Onda 7 | Agrário, PI, Militar, Marítimo, Internacional, como base mínima | J9, JU-04 |

**[Proposta]** Como o lançamento já constrói T1 a T3, D1 e S1, os jurídicos Tributário, Empresarial e a parte material do Trabalhista ficam quase prontos. Podem ser oferecidos como complementos baratos antes da onda 4, sem mudar a ordem principal. J9 admite inverter "com motivo escrito (ganho de custo muito grande)", e o motivo aqui é o reuso.

---

## 7. Decisões

| # | Decisão | Status | Por quê |
|---|---|---|---|
| D1 | Primeiros clientes: contábil e BPO; advocacia depois, em módulos | **[Dono]** | — |
| D2 | Estadual: os 27 entes | **[Dono]** | Expectativa corrigida e custo na seção 3 |
| D3 | Municipal: só o fácil; o resto sob demanda e pelo feedback | **[Dono]** | Os 338 acima de 100 mil viram ordem da fila |
| D4 | Janela: 10 anos no federal; 5 no estadual e no municipal | **[Dono]** | — |
| D5 | **Revisão pela IA como padrão em toda a ingestão**; divergência persistente rebaixa a certeza, não vai para pessoa | **[Dono]** | Pessoa conferindo tudo é cara e lenta; desenho na seção 13 |
| D6 | **Taxa de erro medida contra conjuntos-ouro automáticos e reportes confirmados**, sem auditoria humana obrigatória | **[Dono]** | Seções 13.5 e 16 |
| D7 | Pessoa só em CAPTCHA, papelada de LAI e convênios e reunião de parceria | **[Dono]** | Horas na seção 13.7 |
| D8 | Texto atual sem histórico (C2) pode ser lançado, rotulado | **[Dono]** | Seção 8 |
| D9 | LAI e convênios em nome da empresa; CAPTCHA por pessoa no celular como reserva | **[Dono]** | Seção 10.2 |
| D10 | Leis Ltda como trilha adicional, da licença à parceria societária; opcional | **[Dono]** | Seção 18 |
| D11 | Unidade de cobertura: ente local × domínio × nível (C0 a C4) | [Proposta] | O Consultor precisa saber o que pode afirmar sobre um ente numa data |
| D12 | Núcleo tributário primeiro no local | [Proposta], coerente com D1 | 7,5% das leis e 2,6% dos decretos municipais são tributários |
| D13 | Coletor por plataforma, reaproveitando o Querido Diário (MIT, com atribuição) | [Proposta] | 85,5% dos raspadores são instâncias de 21 plataformas |
| D14 | Hierarquia de fontes. A citação aponta para a publicação oficial. <ul><li>Veículo oficial: prova.</li><li>Bases estruturadas: descoberta.</li><li>Consolidações de terceiros: só com acordo.</li><li>NFS-e: tabela declarada.</li></ul> | [Proposta] | — |
| D15 | O modelo extrai eventos com evidência literal; o código consolida | [Proposta] (princípio 4 do Plano de Ingestão) | Acerto exato de 50% e 20% quando o modelo consolida |
| D16 | Três famílias de modelos; o revisor final nunca é da família de quem extraiu | [Proposta], para cumprir D5 | Reduz pontos cegos comuns (seção 13.6) |
| D17 | Evento sem consenso não entra no texto consolidado: fica sinalizado no dispositivo e rebaixa a certeza | [Proposta] | Erro não se propaga pela linha do tempo |
| D18 | Ouro de medição separado do ouro de conferência | [Proposta] | Sem isso a medida seria circular |
| D19 | Usuário como revisor: "reportar" e "confirmar", sempre ancorados na publicação oficial | [Proposta] | Fonte de erros reais que o ouro não cobre |
| D20 | Anterioridade tributária como regra do validador | [Proposta] | Erro de data do fato mais provável em lei de dezembro |
| D21 | Triagem LGPD na entrada | [Proposta] | — |
| D22 | Laço inspirado na DGM na ingestão, offline, contra ouro escondido | [Proposta] | É como a base melhora sem revisor humano |

---

## 8. Níveis de cobertura, rótulos e onde aparecem

### 8.1 Os níveis

Valem para **cada ente local (UF ou município) e cada domínio**. Nenhum exige pessoa (D5).

| Nível | Rótulo | O que existe na base |
|---|---|---|
| **C0** | **Sem base local** | Nada |
| **C1** | **Só publicações novas** | Atos novos monitorados desde uma data, sem texto atualizado |
| **C2** | **Texto atual · sem histórico** | Texto vigente, ancorado numa consolidação oficial ou montado e conferido pela IA, com fluxo ativo |
| **C3** | **Com histórico de 5 anos** (no federal, 10) | Cadeia de 5 anos, versões por dispositivo, cada uma com a sua certeza |
| **C4** | **Amplo** | C3 mais domínios jurídicos (urbanismo, posturas, servidores) |

O nível sai de regras sobre o registro `cobertura_local` (`ente`, `dominio`, `nivel`, `vigencia_coberta_de`, `vigencia_coberta_ate`, `cadeia_status`, `fontes[]`, `ultima_coleta`, `atraso_medio_horas`, `pendencias[]`). Coletor parado rebaixa o nível sozinho.

### 8.2 O texto que o Consultor mostra

**[Proposta]**, com variáveis entre chaves:

| Nível | Texto |
|---|---|
| C0 | "**Sem base local.** Ainda não tenho a legislação de {ente} sobre {domínio}. Respondo pela regra federal; {ente} pode ter regra própria. Já pedi a inclusão." |
| C1 | "**Só publicações novas.** Acompanho as publicações de {ente} desde {data}, mas ainda não tenho o texto atualizado de {norma}. Cito o ato publicado; não afirmo a regra vigente." |
| C2 | "**Texto atual · sem histórico.** Tenho o texto atual de {norma} de {ente}, conferido em {data}. Para fatos antes de {data da âncora}, não confirmo qual redação valia." |
| C3 | "**Com histórico desde {data}.** Redação vigente em {data do fato}." Mais "certeza média" ou "certeza baixa" quando for o caso, com o motivo (ex.: "os modelos não chegaram a acordo sobre a alteração feita pela Lei {n}/{ano}; veja o ato") |
| C4 | Igual ao C3, com os domínios cobertos |

Variante da NFS-e (C0 a C2): "{ente} cadastrou {X}% para este serviço no Sistema Nacional da NFS-e (consultado em {data}). É um parâmetro, não a lei."

### 8.3 Onde aparece

1. **No cartão de citação**, ao lado do nome do ente: o rótulo curto, sempre.
2. **Na primeira linha da resposta**, quando o nível limita a conclusão: C0, C1, C2 com data anterior à âncora, ou C3 com certeza baixa no dispositivo central.
3. **No rodapé da resposta**: "Cobertura local: {ente}, {domínio}: {rótulo}", com "Reportar".
4. **Na saída de `legal.consultar`** (`cobertura_local`) e em `lacunas[]`.
5. **Na página "Cobertura"** do escritório, por UF e município dos clientes, com o pedido de inclusão.

---

## 9. Modelo de dados: o que muda nas fichas

As seis fichas do Plano de Ingestão ficam. O local e a revisão pela IA entram como **extensão** (princípio 6):

| Ficha | Campos novos | Para quê |
|---|---|---|
| 1 · Norma | `ente_ibge`; `veiculo_oficial` e `veiculo_desta_publicacao`; `ids_externos`; `fonte_descoberta`; `republicacao_de`; `pii` | Provar a publicação, deduplicar, rastrear |
| 2 · Dispositivo e versão | `certeza_vigencia` (alta, média, baixa) e motivo; `ancora_id`; `conferido_por` (consenso de modelos, ouro, reporte confirmado); `eventos_nao_consensuais[]` | Grau de segurança e rótulo |
| 3 · Evento | `origem_evento`; **`leituras[]`** (uma por modelo, com família, versão do modelo e evidência); `rodadas`; `consenso` (pleno, após reconciliação, sem consenso); `parecer_revisor_final` | Rastrear a revisão pela IA |
| 4 · Tabela normativa | `conferencia_nfse` (valor, data, divergência) | Ouro de alíquotas |
| Nova: Âncora | Norma-mãe, texto-base, fonte, data | Começar a cadeia de um ponto confiável |
| Nova: Cadeia | Norma-mãe, alteradoras ordenadas, lacunas, status | `cadeia_status` |
| Nova: Reporte | Ente, dispositivo, tipo, link oficial, quem, quando, resultado | Usuário como revisor |

---

## 10. Pipeline local

### 10.1 Etapas

| Etapa | O que faz | Quem | Saída |
|---|---|---|---|
| 0 · Mapa de fontes | Por ente: veículo oficial, plataforma, SAPL, BLM, Querido Diário, portal, consolidação oficial, contato para LAI | Agente mapeador | Ficha do ente |
| 1 · Coleta | Coletor por plataforma; detecção de mudança sem IA; original com hash | Código mantido por agente | Original |
| 2 · Segmentação | Já vem por ato em DOM/SC, SIGPub, SAPL e BLM; em PDF de diário inteiro, regras de cabeçalho e layout; modelo no que as regras não fecham | Código + modelo barato | Atos |
| 3 · Texto e OCR | Camada de texto quando existe; OCR em escada (Tesseract ou docTR → olmOCR ou Marker → modelo de visão nas páginas ruins) | Código | Texto com confiança |
| 4 · Triagem | Normativo? Do núcleo? Altera outra norma? | Regras + modelo barato | Ato relevante ou descarte |
| 5 · Montagem da cadeia | Alteradoras de cada norma-mãe; escolha da âncora | Agente montador de cadeia | Âncora e Cadeia |
| 6 a 9 · **Revisão pela IA** | Extrações independentes, reconciliação, rodadas, revisor final, limiares (seção 13) | Modelos de três famílias + código | Eventos com consenso e certeza |
| 10 · Validação | Regras do Plano de Ingestão + locais (seção 11.4) | Código | Aprovado ou falhas |
| 11 · Consolidação | Aplica só eventos com consenso, em ordem de eficácia | Código | Linha do tempo |
| 12 · Conferência com ouro | SAPL, consolidação oficial, Planalto e normas.leg.br, RICMS da Sefaz, NFS-e | Código + modelo barato | Divergências → nova rodada ou rebaixamento |
| 13 · Publicação | Portões automáticos (seção 13.4); atualiza `cobertura_local`; emite `legislacao.publicar` | Código | Base de produção |

**Referências.**
- **Segmentação:** o DODFMiner (KnEDLe/UnB) segmenta, classifica e extrai entidades de atos do Diário Oficial do DF; o artigo relata F1 médio de 0,778 na classificação e 0,851 em entidades ([documentação](https://dodfminer.readthedocs.io/en/main/user/intro.html); números segundo resumo).
- **OCR:** o olmOCR custa menos de US$ 200 por milhão de páginas em GPU própria. No olmOCR-Bench, o olmOCR 2 marca 82,4, o Marker 76,1 e a API da Mistral 72,0 ([olmOCR](https://arxiv.org/abs/2502.18443); números segundo resumos).
- Nenhum desses testes foi feito em diário municipal brasileiro.

### 10.2 Coleta: LAI, convênio e o CAPTCHA como reserva

**[Dono]** A ordem dos caminhos, para qualquer fonte pública oficial:

1. API, dados abertos ou serviço oficial.
2. Coleta automatizada respeitosa:
   - pedido identificado com contato;
   - robots.txt e termos de uso respeitados;
   - no máximo uma requisição por segundo por site, em janela noturna;
   - cache.
3. **LAI e convênio**, em nome da empresa, abertos já na Fase 0: CIGA, TCE-RS, Interlegis, AMM, Sefaz e assembleias, e a Casa Civil, pelo texto compilado do Planalto. A LAI dá 20 dias de prazo, prorrogáveis por mais 10, além dos recursos (pesquisa 04).
4. **Reserva: CAPTCHA resolvido por pessoa no celular**, como no Plano de Ingestão (seção 5.6). O coletor pausa, a pessoa resolve na página real e a coleta segue com a sessão.

**Cuidados no passo 4** ([Proposta]):
- Só **fontes públicas oficiais** de atos normativos. **Nunca** agregadores privados nem portais cujos termos proíbam robôs.
- **Em paralelo à LAI ou ao convênio**, nunca no lugar.
- **Taxa de navegação humana**: no máximo uma requisição a cada 5 segundos e só os documentos que faltam.
- **Registro completo**: quem, quando, qual fonte, quantos documentos.
- Parada imediata diante de aviso de proibição, bloqueio de IP ou pedido de login.
- Parecer do advogado do grupo antes do primeiro uso.

**O risco, dito com clareza.** O CAPTCHA num portal de legislação é o sinal mais claro de que o publicador não quer coleta automatizada. Uma pessoa resolver o desafio e o robô seguir com a sessão contorna essa intenção. Os riscos concretos são:
- contrariar os termos de uso;
- ter o IP bloqueado e perder a fonte;
- desgaste com o órgão com quem se pede convênio ao mesmo tempo;
- questionamento se o volume baixado não parecer uso humano.

Por isso o passo 4 é reserva, limitada e registrada.

---

## 11. Alteração, revogação, vigência e texto compilado

### 11.1 O que os números de SC dizem

Só 4,3% das leis usam "(NR)", 11,8% dizem "passa a vigorar com a seguinte redação", 8,3% revogam expressamente e 22,9% revogam "as disposições em contrário" (seção 2.3). Expressão regular sozinha perde a maior parte das alterações.

### 11.2 O que a literatura diz

- **Doctrine, França.** Um modelo gerador aplicou emendas do orçamento francês ao Código Geral de Impostos, com sucesso de "mais de 63%" num projeto difícil ([Etcheverry et al., NLLP 2024](https://aclanthology.org/2024.nllp-1.13/)).
- **TUM, Alemanha.** Consolidação por LLM de quatro códigos alemães, 908 pares emenda–lei ([Prior et al., NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)):
  - similaridade de 93% a 99%;
  - mas acerto exato de **50,3%** em um passo e **20,51%** em cadeias.
- **Casos com regras, citados no mesmo artigo:** leis japonesas estruturadas chegaram a 99,47% (Ogawa et al., 2008); leis gregas em PDF heterogêneo, a 37,1% (59,4% com correção manual).
- **O ouro oficial também falha.** O mesmo artigo relata uma lei alemã em vigor desde 14/05/2024 que ainda não estava no texto consolidado oficial em 30/07/2025.

O município brasileiro se parece mais com o caso grego. Daí D15: o modelo identifica o quê muda; o código aplica.

### 11.3 Procedimento por norma-mãe

1. **Inventário da cadeia**, juntando quatro lados: vínculos do SAPL, citações extraídas, BLM e LexML, busca no diário.
2. **Âncora**, nesta ordem:
   1. republicação oficial consolidada;
   2. consolidação oficial;
   3. publicação original;
   4. consolidação obtida pela trilha da Leis Ltda, só com acordo e depois de conferida.
3. **Extração dos eventos pela revisão da seção 13.**
4. **Aplicação**, só dos eventos com consenso, em ordem de eficácia.
5. **Teste de aplicação limpa**: o dispositivo-alvo existe e o texto antigo citado bate.
6. **Conferência com o ouro** posterior (seção 13.5).
7. **Status da cadeia**: completa, ou com lacuna registrada.

### 11.4 Regras do validador para o local

- **Anterioridade:** evento que institui ou aumenta tributo não produz efeito antes de 1º de janeiro do exercício seguinte nem antes de 90 dias da publicação (CF, art. 150, III, b e c). As exceções do § 1º valem; a fixação da base do IPTU escapa dos 90 dias.
- **Revogação genérica:** gera sinal, nunca evento.
- **Veículo:** ato fora do veículo oficial fica marcado.
- **Republicação e retificação:** ligadas ao ato original.
- **Localidade:** a URN do evento e a do alvo são do mesmo ente.
- **Decreto que diz alterar lei:** rebaixa a certeza e fica sinalizado.

### 11.5 Certeza da versão

Ver os limiares da seção 13.3.

---

## 12. Identificadores, deduplicação, hash e grafo

- **URN LexML.** Para município, `urn:lex:br;sao.paulo;campinas:municipal:lei:AAAA-MM-DD;número`, com autoridade "municipal" ([especificação, Parte 2](https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf)); para estado, autoridade "estadual". O espaço "lex" está na [RFC 9676](https://www.rfc-editor.org/rfc/rfc9676.html) (maio de 2025, informacional).
- **Chave natural** dentro do ente: (código IBGE, tipo, número, ano).
- **Hash.**
  - SHA-256 dos bytes do original;
  - hash do texto normalizado entre fontes do mesmo ente;
  - MinHash só dentro do ente, porque textos parecidos entre municípios são prováveis (minutas-modelo) e não são o mesmo ato.
- **Prova de publicação:** código do SIGPub, `codigo` do DOM/SC e id do SAPL vão em `ids_externos`.

**Grafo de remissões.**

| Aresta | De onde vem |
|---|---|
| altera, acrescenta, revoga | Ficha 3 e vínculos do SAPL |
| regulamenta | Decreto que cita a lei que regulamenta |
| remete | "nos termos do art. X da Lei Y" |
| aplica norma de outra esfera | Citação de LC 116, LC 214, LC 87, CTN, lei estadual |
| revogação genérica (sinal) | Liga a normas do mesmo tema; não é evento |

O grafo é particionado por ente, e a camada federal é compartilhada.

---

## 13. Revisão pela IA: o padrão em toda a ingestão

**[Dono]** Palavras do dono: "a própria IA não poderia fazer isso? No meu fluxo, eu desenhei explicitamente um sistema sem viés, que roda modelos diferentes para cruzar as gerações, e um revisor final. Passaria por algumas revisões e depois seria consolidado e validado. Não dá para pôr uma pessoa para conferir tudo isso: é caro e lento."

### 13.1 O desenho do dono, no repositório de trabalho

O desenho já está no [Plano de Ingestão](https://github.com/sundenlast/DGM-RAG-Contabil/blob/main/docs/Plano_de_Ingestao_da_Base_Legal.md):

- **Agentes (seção 4.2):**
  - **extrator primário** (modelo grande);
  - **extrator independente**, que "preenche as mesmas fichas sem ver o resultado do primário", com "outro modelo ou outra instrução";
  - **validador determinístico** (código);
  - **revisor**, que compara com as fichas-base e os casos-modelo e confere a evidência literal;
  - **reconciliador**, que "resolve divergências entre os extratores ou entre agente e fonte, buscando mais contexto";
  - **consolidador** (código) e **conferente de fontes**.
- **Princípios (seção 2):**
  - original imutável;
  - eventos, e não textos consolidados, com as versões calculadas por código;
  - evidência literal em todo campo.
- **Portões (seção 4.5):** validador sem falha, os dois extratores de acordo no núcleo, revisor aprovado e conferência com o texto consolidado oficial quando existe.
- **Ponto cego (seção 4.6):** o plano já reconhece que "o extrator e o revisor concordam numa leitura errada" quando "modelos parecidos compartilham o mesmo ponto cego". A defesa era outro modelo no extrator independente, o texto consolidado oficial e a auditoria amostral humana.
- **Modelos sugeridos (pesquisa 02, 6.2):** extrator Opus 5.5, independente GPT-6.1-sol (outro fornecedor), revisor Sonnet 5.5, reconciliador Opus 5.5.

**O que muda com a decisão do dono:**
- a revisão humana sai do caminho (fila humana, auditoria obrigatória);
- o revisor final passa a ser de **uma terceira família**, porque na pesquisa 02 o revisor era da mesma família do extrator primário;
- a divergência que persiste deixa de ir para a fila humana e passa a **rebaixar a certeza**.

### 13.2 A sequência, para todo ato relevante (federal, estadual e municipal)

**[Proposta]** Famílias iniciais; a escolha final sai do benchmark, como pedem o 07 e a pesquisa 02. A regra fixa é ter três famílias e o revisor final nunca ser de quem extraiu.

| Passo | O que acontece | Família (proposta inicial) |
|---|---|---|
| 1 · Extração A | Fichas 1 a 4 com evidência literal | Anthropic (Opus 5.5) |
| 2 · Extração B | As mesmas fichas, **sem ver a A**, com instrução própria | OpenAI (GPT-6.1-sol) |
| 3 · Comparação | Código compara campo a campo, depois de normalizar (datas, números, rótulos de dispositivo) | Código |
| 4 · Evidência | Código confere que cada trecho de evidência **existe literalmente** no original | Código |
| 5 · Reconciliação (só campos divergentes) | O reconciliador recebe as duas leituras e mais contexto: a norma-alvo inteira, a versão anterior do dispositivo, atos relacionados e casos-modelo. Propõe uma leitura com evidência. A e B conferem a proposta, cada um sem ver a resposta do outro | Anthropic (Opus 5.5) |
| 6 · Validação | Regras determinísticas (seção 11.4 e Plano de Ingestão, 4.4) | Código |
| 7 · Revisor final | Lê cada campo contra a evidência e o manual, **sem saber qual modelo propôs o quê**; aprova ou rejeita com motivo | **Google (Gemini 4 Argon)**, terceira família |
| 8 · Rodada extra (se o revisor rejeitar) | A e B refazem com a objeção do revisor; o revisor final julga de novo uma vez | As três |
| 9 · Consolidação | Só eventos com consenso entram na linha do tempo | Código |
| 10 · Conferência com ouro | Divergência com o ouro: nova rodada com o texto oficial como contexto. Se as três famílias seguirem contra o ouro, registra "divergência com {fonte}", porque o ouro também falha (11.2) | Código + modelos |

### 13.3 Limiares de consenso e certeza

| Certeza | Condição (todas) |
|---|---|
| **Alta** | A e B concordam já no passo 3; evidência literal confirmada; validador sem falha; revisor final aprova; aplicação limpa; e ouro concorda, quando existe |
| **Média** | Concordância só depois da reconciliação **ou** sem ouro para conferir; o resto igual |
| **Baixa** | Divergência persiste depois da rodada extra; ou revisor final rejeita duas vezes; ou lacuna na cadeia; ou revogação genérica pendente; ou OCR abaixo do limiar; ou reporte de usuário em aberto |

**O que acontece com a baixa.** O evento não entra no texto consolidado. O dispositivo fica marcado "pode ter sido alterado por {ato}; leituras não consensuais", com o ato citado. O rótulo mostra "certeza baixa" e o motivo. A versão volta para a fila automática quando chega contexto novo: ato relacionado, ouro novo ou reporte.

### 13.4 Portões automáticos

Uma versão entra em produção, sem pessoa, com a certeza que os limiares derem. **Nada fica bloqueado à espera de uma pessoa.** O publicador só barra o que falha no validador por erro estrutural (alvo inexistente, data impossível). Isso volta à extração com mais contexto e, se persistir, entra como evento não aplicado e sinalizado.

### 13.5 Como medir o erro sem auditoria humana

**[Dono]** A taxa de erro é medida contra **conjuntos-ouro automáticos** e contra os **reportes confirmados** dos usuários.

| Camada | Ouro automático | Cobertura do ouro |
|---|---|---|
| Federal | normas.leg.br (multivigente para CC, CPC e leis desde 2019); alterações por dispositivo da API do Senado (a validar); texto compilado do Planalto (pedido formal à Casa Civil, porque o site bloqueia robôs; ou o espelho da Câmara) | Alta para leis recentes; menor para atos infralegais |
| Estadual | RICMS e leis consolidadas das Sefaz e assembleias, onde existirem | A confirmar por UF |
| Municipal | Compilação do SAPL (dispositivos com vigência), consolidações oficiais, parâmetros da NFS-e (alíquotas), BLM e DOM/SC (completude) | Parcial; maior onde o município é organizado |
| Todas | Reportes de usuários confirmados na publicação oficial | Cresce com o uso |

**Regras da medida** ([Proposta]):
- **Ouro de medição separado do ouro de conferência (D18).** Uma parte sorteada do ouro nunca entra como contexto no pipeline, só serve para medir. É a mesma ideia do conjunto reservado da DGM.
- **Erro por estrato**: esfera, tipo de evento, qualidade da fonte, certeza declarada.
- **Calibração**: a certeza "alta" tem de errar bem menos que a "média", e esta menos que a "baixa". Se não errar, os limiares mudam.
- **Cobertura do ouro publicada junto com o erro.** Fora do ouro, o erro não é medido; é estimado pela calibração.
- **Reportes confirmados** entram como erro real e viram casos de teste.

### 13.6 O limite, com franqueza, e como o plano o reduz

**O limite.**
- **Modelos diferentes erram juntos.** Kim, Garg, Peng e Garg avaliaram mais de 350 modelos ([Correlated Errors in Large Language Models, ICML 2025](https://proceedings.mlr.press/v267/kim25e.html)). Num dos conjuntos, quando dois modelos erravam, davam **a mesma resposta errada em 60% dos casos**. Modelos maiores e mais precisos tinham **erros mais correlacionados, mesmo de fornecedores diferentes**. Três famílias concordando não é prova.
- **O erro de interpretação dentro de um campo válido continua possível**, como o próprio Plano de Ingestão (4.6) já dizia. Exemplo: uma cláusula de vigência complexa lida do mesmo jeito errado por todos.
- **O ouro é parcial e enviesado.** Ele existe mais onde a fonte é organizada, então o erro medido tende a subestimar o erro onde não há ouro. E o próprio ouro atrasa ou erra (11.2).

**O que o plano faz contra isso:**
1. **Evidência literal obrigatória**, conferida por código. Elimina a invenção de texto, mas não a má leitura.
2. **Famílias diferentes**, extrações às cegas e revisor final de uma terceira família. Reduz, sem eliminar, o ponto cego comum.
3. **Consolidação por código e teste de aplicação limpa.** Pegam boa parte das leituras erradas que quebram a estrutura (alvo errado, dispositivo inexistente, texto antigo que não bate).
4. **Ouro automático externo** e a parte reservada só para medir.
5. **Parâmetros da NFS-e** como segunda fonte independente para alíquotas.
6. **Reportes dos usuários**, que pegam o erro que todos os modelos compartilham.
7. **Certeza visível no rótulo.** O usuário sabe quando a base não tem consenso.
8. **Laço inspirado na DGM fora da produção** (seção 15). Variantes do pipeline competem contra o ouro escondido, e a que reduz o erro sem burlar a medida substitui a anterior.

### 13.7 Onde ainda há pessoa, e quantas horas

**[Dono]** Só onde não tem jeito. **Estimativas**:

| Tarefa | Recorrente | Pontual |
|---|---|---|
| Resolver CAPTCHA no celular | 10 a 30 sessões por mês × 2 min ≈ 0,3 a 1 h/mês | — |
| Papelada de LAI e convênios (2 a 6 h por pedido, incluindo recurso, pela pesquisa 04) | ~1 pedido novo por mês ≈ 2 a 6 h/mês | Primeira leva de ~15 pedidos e convênios ≈ 30 a 90 h, nos primeiros meses |
| Trilha da Leis Ltda (preparo, reuniões, análise da proposta) | — | ≈ 10 a 20 h |
| **Total** | **≈ 2 a 7 h/mês** | **≈ 40 a 110 h** |

Na versão 0.2 eram cerca de 17 horas por mês com revisão humana de exceções e auditoria amostral. Agora as exceções viram rebaixamento de certeza e nova rodada da IA, e a auditoria vira medida contra ouro automático.

**Fica fora desta conta:** as perguntas reais com gabarito que os playtesters mandam para o benchmark do Consultor. Isso é uso do produto, não conferência da base.

**Mudanças no Plano de Ingestão que decorrem disto (seção 25):**
- no protocolo de congelamento (3.5), a concordância "entre agentes e contadores" vira concordância entre famílias e contra o ouro;
- nos portões (4.5), a ausência de consenso vira rótulo, não bloqueio;
- o papel humano (4.7) fica com CAPTCHA, LAI, convênios e decisões de negócio.

---

## 14. Como a base se liga ao Consultor e ao M1 Legal

### 14.1 No M1 Legal

- **Partição.** A legislação local é partição da base global, chaveada por `ente_ibge`. A etapa 3 da cascata (07, 3.1) filtra por UF e município **por código**.
- **Saída de `legal.consultar`.** Ganha `cobertura_local`; `lacunas[]` vem do registro.
- **Grau de confiança** = o menor entre o grau da afirmação, a certeza da versão citada (13.3) e o nível de cobertura.
- **Módulos.** O roteador só consulta partições dos módulos ativos (JU-04, 3.6).
- **M3 Cálculo.** As funções leem a alíquota local da Ficha 4, conferida com a NFS-e. Sem tabela, devolvem "alíquota municipal fora da base", nunca um padrão.
- **Busca ao vivo.** `municipal.buscar_diario`, `municipal.sapl`, `municipal.parametros_nfse`, `estadual.sefaz`. O que achar entra na fila de ingestão, marcado "ainda não validado".

### 14.2 Regras de resposta

| # | Regra | Garantia |
|---|---|---|
| R-LOC1 | Afirmação local só com trecho local da base, ou de busca ao vivo marcada | Verificação (07, 7) |
| R-LOC2 | Em C0, só a moldura federal rotulada | Texto C0 (8.2) |
| R-LOC3 | Parâmetro da NFS-e só como parâmetro | Rótulo próprio |
| R-LOC4 | Data anterior ao período coberto rebaixa ou abstém | Código |
| R-LOC5 | Nunca inferir alíquota ou prazo local "típico" | R-M3 do 07 |
| R-LOC6 | Rótulo de cobertura sempre que a citação é local | 8.3 |
| R-LOC7 | Dispositivo com evento não consensual é citado com o ato alterador e a certeza baixa | 13.3 |

### 14.3 O usuário como revisor

**[Proposta]** Dois botões em toda citação local.

**Reportar.** Tipos: "falta uma norma", "esta redação mudou", "foi revogada", "ente errado", "alíquota diferente". Há campo para o link ou o PDF da publicação oficial e aviso para não colar dado de cliente. O que acontece depois:
1. O sistema busca a publicação na fonte oficial.
2. Roda a revisão da seção 13 com o reporte como contexto.
3. Se fechar, corrige sozinho e marca "corrigida por reporte, conferida na publicação oficial".
4. Se não fechar, a versão fica com certeza baixa e "reporte em aberto" no rótulo, até chegar contexto novo.
5. Quem reportou recebe o resultado.

**Confirmar.** Um toque opcional: "confere / não confere".
- "Não confere" funciona como reporte.
- "Confere" é sinal, nunca prova: não eleva a certeza a "alta" sozinho.

**Regras:**
- só usuários autenticados com papel profissional;
- limite por usuário;
- o peso de quem reporta cresce com o histórico de reportes confirmados;
- no jurídico, o reporte leva só a norma e o link oficial, nunca dado de caso, como exige o JU-04;
- reportes confirmados viram casos do benchmark, sem dado de cliente (07, 9.2).

### 14.4 Nos modos do Consultor

- **Perguntar e Parecer:** o parecer guarda versões, certezas e nível da data.
- **Vigilância:** ato novo de ente com clientes gera `legislacao.publicar`; em C1, o aviso diz "ato novo, sem texto atualizado".
- **Revisão de enquadramento e segunda opinião:** só concluem divergência com tabela em C2 ou C3, certeza média ou alta.
- **Coleta sob demanda.** [Proposta] Metas: C1 em 1 dia útil numa plataforma conhecida, C2 em 5 dias úteis, C3 em 15 dias úteis.

---

## 15. RAPTOR, HippoRAG 2, Rank1 e o laço inspirado na DGM

Todas seguem atrás de chave e só ligam se vencerem no benchmark (07, 3.7 e 9.4).

**RAPTOR** ([Sarthi et al., ICLR 2024](https://arxiv.org/abs/2401.18059)).
- *No artigo:* agrupa trechos por similaridade (mistura gaussiana sobre embeddings reduzidos com UMAP), resume, agrupa os resumos e repete, formando uma árvore; busca percorrendo a árvore ou na "árvore colapsada". Com GPT-4, +20 pontos absolutos no QuALITY.
- *No nosso uso:* a árvore segue a taxonomia (módulo → tributo → ente → tema), uma adaptação. Os resumos roteiam; nunca são citados.

**HippoRAG 2** ([Gutiérrez et al., ICML 2025](https://arxiv.org/abs/2502.14802)).
- *No artigo:* grafo de triplas extraídas por modelo (OpenIE), nós de frase e de passagem, PageRank personalizado; cerca de 7% de ganho em memória associativa. O "10 a 30 vezes mais barato" é do **HippoRAG 1** ([arXiv 2405.14831](https://arxiv.org/abs/2405.14831)), contra o IRCoT.
- *No nosso uso:* as arestas são as da seção 12, e o PageRank roda no subgrafo do ente mais a camada federal.

**Rank1** ([Weller et al., COLM 2025](https://arxiv.org/abs/2502.18418)).
- *No artigo:* reranker que raciocina antes de julgar; destilado de 635 mil traços do DeepSeek R1 sobre o MS MARCO, em inglês, com modelos Qwen 2.5.
- *No nosso uso:* precisa de destilação em português jurídico. Não decide vigência nem ente.

**Laço inspirado na DGM** ([Zhang et al., arXiv 2505.22954, ICLR 2026](https://arxiv.org/abs/2505.22954)).
- *No artigo:* arquivo de agentes de código com modelos **congelados**; cada variante entra se funcionar no benchmark. Em 80 iterações, o SWE-bench foi de 20,0% a 50,0% e o Polyglot de 14,2% a 30,7%. Uma rodada no SWE-bench levou cerca de duas semanas e US$ 22 mil, com sandbox e supervisão humana. O artigo relata **burla da métrica**: uma variante apagou os marcadores de uso de ferramenta para enganar o detector de alucinação.
- *No nosso uso*, dois laços, ambos fora da produção:
  1. **Consultor** (07, 9.4).
  2. **Ingestão**: instruções dos extratores, reconciliador, montador de cadeia, segmentador e limiares competem contra o **ouro escondido** (13.5).
- Não são editáveis: o validador, o consolidador, a base, o ouro e as funções de medida.
- Com a revisão pela IA como padrão, este laço é o principal mecanismo de melhoria da base. Um ciclo com 20 variantes sobre 300 atos-ouro custa cerca de US$ 600 (**estimativa**: 20 × 300 × US$ 0,10).

---

## 16. Avaliação: métricas e conjuntos de teste

### 16.1 Conjuntos

| Conjunto | De onde vem | Mede |
|---|---|---|
| Cadeias-ouro | SAPL com compilação (Cacoal: 21.149 dispositivos com vigência); consolidações oficiais; RICMS consolidados; normas.leg.br e Planalto no federal | Eventos e consolidação |
| Completude | DOM/SC (SC) e BLM (RS) | Recall da coleta |
| Tabelas | Parâmetros da NFS-e | Alíquotas de ISS |
| Triagem | Categorias do DOM/SC como rótulo fraco | Triagem |
| Reportes confirmados | Usuários | Erros reais |
| Benchmark do Consultor | Perguntas reais dos playtesters com gabarito, mais 100 perguntas locais | Respostas |

### 16.2 Métricas e metas

[Proposta]; a confirmar no piloto.

| Métrica | Meta |
|---|---|
| Recall de atos tributários na coleta (entes C3) | ≥ 98% contra o universo de referência |
| Concordância entre famílias já no passo 3 | ≥ 90% |
| Concordância depois da reconciliação | ≥ 98% |
| Aprovação do revisor final | ≥ 97% |
| Aplicação limpa | ≥ 95% dos eventos |
| Acerto contra o ouro reservado, certeza alta | ≥ 99% |
| Acerto contra o ouro reservado, todas as certezas | ≥ 98% (o limite de 2% de erro do Plano de Ingestão) |
| Cobertura do ouro | Publicada; crescer a cada trimestre |
| Parte das versões com certeza baixa | Publicada; cair a cada ciclo do laço |
| Reportes confirmados por mil respostas locais | Publicado; cair com o tempo |
| Publicação → base, entes C1+ | ≤ 48 horas |
| Rótulo de cobertura correto | 100% |
| Abstenção local correta no benchmark | ≥ 95% |
| Custo por ato relevante | ≤ US$ 0,20 |
| Horas humanas por mês | ≤ 7 |
| Horas de manutenção por coletor por mês | a medir |

---

## 17. Jurídico: direito autoral, LGPD, termos de uso e coleta

- **Direito autoral.** Leis, decretos e atos oficiais não têm proteção (Lei 9.610/1998, art. 8º, IV). Compilações e bases de dados são protegidas pela seleção e organização (art. 7º, XIII), mas não os dados em si (art. 7º, § 2º) ([texto na Câmara](https://www2.camara.leg.br/legin/fed/lei/1998/lei-9610-19-fevereiro-1998-365399-normaatualizada-pl.html)). Reaproveitar consolidação de terceiro exige acordo (seção 18). Não há exceção de mineração de texto e dados no Brasil (J4).
- **Licenças.**
  - Querido Diário: CC-BY 4.0 e MIT, com atribuição.
  - Senado: livre, citando a proveniência.
  - DOM/SC: sem licença declarada; pedir ao CIGA.
- **Termos, robots e CAPTCHA:** seção 10.2.
- **LGPD.**
  - A triagem descarta atos de pessoal, nomeação, notificação e licitação.
  - Nomes ficam mascarados nos índices.
  - A base legal é o legítimo interesse, considerando a finalidade, a boa-fé e o interesse público da disponibilização (LGPD, art. 7º, §§ 3º e 7º; [guia da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_tratamento_de_dados_pessoais_pelo_poder_publico___defeso_eleitoral.pdf/@@display-file/file)).
  - Relatório de impacto antes da coleta em escala.
  - Os reportes não carregam dado de cliente.
- **Modelos de três fornecedores.** O que vai a eles é texto público de lei, sem dado de cliente. Mesmo assim, cada fornecedor entra na lista de subprocessadores (JU-04, 5.5).
- **Parecer** do advogado do grupo antes da Fase 2 e antes do primeiro uso do CAPTCHA.

---

## 18. Trilha adicional: Leis Ltda (Leis Municipais)

**[Dono]** O dono achou interessante e quer uma reunião com a empresa, que pode chegar a uma parceria societária. **É opcional: o plano funciona sem ela.**

### 18.1 Formas possíveis

| Forma | O que é | Vantagem | Cuidado |
|---|---|---|---|
| **Licença de dados** | Acesso por API ou arquivo aos textos consolidados e versionados dos municípios clientes deles, com metadados de vigência e link para a publicação oficial | Rápida; preço por município ou fixo | Escopo de uso (só conferência ou também exibição); renovação; dependência |
| **Codesenvolvimento** | A Heild entra com o pipeline de IA (extração, consolidação por código, Consultor); eles com o acervo, a equipe e a relação com mais de mil órgãos | Cada lado reduz custo: o pipeline acelera a consolidação deles; o acervo dá ouro e âncora à Heild | Quem é dono do que for produzido junto; divisão de receita |
| **Participação societária** | Troca de participação ou investimento cruzado | Alinha os incentivos por longo prazo | Avaliação das duas empresas, governança, contratos públicos deles (abaixo) |

### 18.2 O que levar à reunião

- Este plano em resumo: data do fato, citação conferida, revisão pela IA, rótulos de cobertura.
- O que a Heild quer: textos por data, metadados de vigência, link para a publicação oficial, atualização diária.
- O que a Heild oferece: pipeline de extração e consolidação, Consultor para os clientes deles, canal com escritórios contábeis.
- **Uma proposta de piloto**: 10 municípios clientes deles, comparando os textos versionados com as publicações oficiais pelo pipeline da seção 13. A conta do erro é automática e não precisa de revisor.

### 18.3 O que avaliar antes de decidir

1. **Cobertura real.** A lista de municípios com consolidação e versionamento **ativos** (e não só publicação), e o período coberto em cada um. Os números públicos são de proposta comercial: "mais de 1.000" órgãos (2023), "1.350" e "10 milhões de normas" (notícia).
2. **Qualidade.** O resultado do piloto: taxa de acerto por dispositivo contra a publicação oficial e atraso de atualização.
3. **De quem é a compilação.** Os contratos com as prefeituras dizem de quem são os textos consolidados e se a empresa pode reaproveitá-los comercialmente. No contrato de Caçapava do Sul, a busca no texto não achou cláusula de propriedade (**a confirmar** com o contrato inteiro e outros contratos).
4. **Exclusividade.** Não aceitar exclusividade que impeça a Heild de usar fontes oficiais ou o próprio pipeline. Avaliar se faz sentido pedir exclusividade no segmento de escritórios contábeis.
5. **Preço e modelo.** Fixo, por município, por uso ou participação na receita. Hoje é desconhecido.
6. **Contrato.** Formato e SLA, responsabilidade por erro, saída com portabilidade dos dados, LGPD.
7. **Imagem.** Eles têm contratos públicos por inexigibilidade, então a parceria não pode depender de vantagem indevida nesses contratos.
8. **BLM do TCE-RS.** A consulta pública da BLM é hospedada por eles; verificar se o acordo também facilita esse acesso.

### 18.4 Como acelera sem bloquear

- Nos municípios clientes deles, o texto versionado vira **âncora e ouro automático**. Isso adianta C2 e C3 sem esperar a montagem completa da cadeia e aumenta a cobertura do ouro (13.5).
- **A citação continua apontando para a publicação oficial**, e o pipeline da Heild continua independente. Sem acordo, nada no plano muda.
- **Calendário** ([Proposta]): reunião na Fase 0; piloto de 10 municípios na Fase 1 ou 2; decisão depois do piloto, com os números da seção 18.3.

---

## 19. Ordem de cobertura

**[Dono]** Municipal: o fácil primeiro e o resto sob demanda. Estadual: os 27 entes.

**[Proposta] Ordem:**

| Camada | O que entra | Nível | Quando |
|---|---|---|---|
| Federal | Como no Plano de Ingestão, 10 anos | C3 | Lançamento |
| Estadual, 27 UFs | Texto vigente de ICMS, ITCMD e IPVA | C2 | Lançamento (meta; depende da consolidação oficial de cada Sefaz) |
| Estadual, UFs dos pilotos | Histórico de 5 anos | C3 | Lançamento, onde der |
| Estadual, demais UFs | Histórico de 5 anos | C3 | Sob demanda |
| Municipal fácil | DOM/SC (293), SIGPub, SAPL (~1.200 câmaras, só leis), BLM (497, se houver acesso), classes do Querido Diário (441 municípios no código) | C1 automático; C2 onde há consolidação oficial | Lançamento |
| Municipal com a trilha da Leis Ltda | Municípios clientes deles, se houver acordo | C2/C3 mais cedo | Depois do piloto da seção 18 |
| Municipal sob demanda | Os demais | C0 → C1 → C2 → C3 | Pela fila |

**Estimativa** do municipal fácil: entre cerca de 1.200 e 2.400 municípios, conforme a sobreposição entre as fontes. A medir na Fase 0.

**[Proposta] Prioridade da fila sob demanda:**
1. Município de cliente ativo com pergunta sem base.
2. Município com reporte.
3. Município de cliente sem pergunta ainda.
4. Os 338 acima de 100 mil, por PIB. Isso é ordem, não meta.
5. Os demais.

---

## 20. Fases e portões

[Proposta]. Durações são **estimativas** para uma pessoa com agentes de programação. Todos os portões são automáticos, medidos contra o ouro (13.5).

**Fase 0 · Mapa, pedidos e reunião (2 a 3 semanas).**
- Ficha de fontes das 27 UFs e das plataformas municipais fáceis.
- Inventário de consolidações oficiais (é o ouro).
- Primeira leva de LAI e convênios: CIGA, TCE-RS, Interlegis, AMM, Sefaz sem formato aberto, Casa Civil.
- Reunião com a Leis Ltda.
- Política de coleta, CAPTCHA, LGPD e parecer.
- Escolha das três famílias de modelos no benchmark de extração.
- **Portão:** mapa das 27 UFs, lista medida dos municípios fáceis e ouro reservado separado.

**Fase 1 · Estadual vigente e fluxo (6 a 8 semanas).**
- Coletores das UFs dos pilotos primeiro.
- C2 nas 27 UFs onde houver consolidação oficial; C3 nas UFs dos pilotos.
- **Portão:** concordância após reconciliação ≥ 98%; acerto contra o ouro reservado ≥ 98%; certeza calibrada.

**Fase 2 · Municipal fácil (4 a 6 semanas, em paralelo à 1).**
- Coletores DOM/SC, SIGPub, SAPL, BLM (se houver acesso) e classes do Querido Diário.
- C1 automático; C2 onde houver consolidação oficial.
- Piloto da Leis Ltda, se houver acordo.
- **Portão:** publicação → base ≤ 48 horas; recall ≥ 98% contra o DOM/SC num mês; acerto ≥ 98% contra a compilação do SAPL reservada.

**Fase 3 · Sob demanda e feedback (contínua, a partir do lançamento).**
- Página "Cobertura", "Reportar" e "Confirmar", fila sob demanda.
- Cinco capitais dos pilotos como primeiros C3 municipais, até a demanda indicar os municípios.
- **Portão contínuo:** ≤ 7 horas humanas por mês; certeza baixa caindo a cada ciclo do laço.

**Fase 4 · Módulos jurídicos (seção 6.4).**

**Laço de melhoria** a partir do fim da Fase 1.

---

## 21. Custo, com premissas

Todas as contas são **estimativas**.
- Preços da Anthropic conferidos em 9/11/2026: Haiku 5.5 US$ 0,10/0,50 por milhão de tokens; Sonnet 5.5 US$ 2/10; Opus 5.5 US$ 4/20.
- Preços da OpenAI e do Google lidos pela pesquisa 02 em 4/11/2026: GPT-6.1-sol US$ 2/10; Gemini 4 Argon US$ 4/20 a partir de 1/12/2026.
- Lote com 50% de desconto em todos.
- Câmbio da pesquisa 02: R$ 5,6858 por dólar pago.

### 21.1 Por ato relevante, com a revisão pela IA (lote)

| Passo | Tokens (entrada / saída) | Família e modelo | Frequência | US$ |
|---|---|---|---:|---:|
| Triagem | 700 / 60 | Anthropic, Haiku 5.5 | 100% | 0,00005 |
| Extração A | 5.000 / 2.500 | Anthropic, Opus 5.5 | 100% | 0,0350 |
| Extração B | 5.000 / 2.500 | OpenAI, GPT-6.1-sol | 100% | 0,0175 |
| Reconciliação: reconciliador (10.000 / 2.000) + conferência de A e B (6.000 / 800 cada) | — | Anthropic + OpenAI | 20% | 0,0140 |
| Revisor final | 7.000 / 1.500 | Google, Gemini 4 Argon | 100% | 0,0290 |
| Rodada extra: A e B refazem (8.000 / 2.500 cada) + revisor final de novo | — | As três | 5% | 0,0045 |
| Conferência com ouro (alinhamento) | 6.000 / 300 | Anthropic, Haiku 5.5 | 100% | 0,0004 |
| **Total** | | | | **≈ 0,10 (R$ 0,57)** |

**Faixa: US$ 0,10 a 0,20 por ato relevante.** O teto cobre atos longos (os tributários tendem a ser maiores) e mais rodadas. É cerca de 40% acima do custo da versão 0.2 (US$ 0,072), por causa do revisor final e das rodadas. Interpretações e decisões usam a mesma proporção da pesquisa 02 (0,63 e 0,45 do custo de um ato normativo).

### 21.2 Federal (10 anos)

Volumes da pesquisa 02 (6.1): 11.000 atos normativos, 6.000 interpretações e 20.500 decisões.

**US$ 2,4 mil a 4,8 mil (R$ 14 mil a 27 mil)**, mais triagem e textos consolidados, da ordem de US$ 1,6 mil no conjunto original da pesquisa 02.

### 21.3 Estadual (27 UFs, 5 anos)

Seção 3.3: **US$ 10 mil a 19 mil (R$ 60 mil a 106 mil)** no histórico e **US$ 160 a 300 por mês**. Mais os cerca de 100 coletores.

### 21.4 Municipal

| Item | Premissa | Modelo |
|---|---|---|
| Fluxo dos fáceis (C1) | ~3.980 publicações triadas e metadados dos atos normativos por município por ano | ≈ US$ 0,25 por município por ano; US$ 0,3 mil a 0,6 mil por ano para 1.200 a 2.400 municípios |
| Fluxo dos municípios em C2/C3 | Triagem + 9 atos tributários por ano com a revisão completa | ≈ US$ 1,2 a 2,1 por município por ano |
| Histórico de 5 anos sob demanda (C3), cenário baixo | 50 atos a US$ 0,10 | US$ 5 (R$ 28) |
| Idem, cenário médio | 100 atos a US$ 0,10 | US$ 10 (R$ 57) |
| Idem, cenário alto | 200 atos a US$ 0,20 | US$ 40 (R$ 227) |
| OCR, quando há atos digitalizados | 30% dos atos × 3 páginas × US$ 2 por mil páginas (Mistral OCR 4 em lote, preço de jul/2026 a confirmar) | US$ 0,09 a 0,36 por município |
| Armazenamento | 2.400 municípios × 259 atos por ano × 5 anos × 300 KB ≈ 930 GB, Standard-IA em SP a US$ 0,0221/GB-mês | ≈ US$ 21 por mês |

### 21.5 Laço de melhoria

≈ US$ 600 por ciclo de ingestão (20 variantes × 300 atos-ouro × US$ 0,10).

### 21.6 Pessoas

Seção 13.7: **≈ 2 a 7 h por mês** e **≈ 40 a 110 h pontuais**. A R$ 90/h (premissa do Estudo de Precificação; a P28 segue aberta), cerca de R$ 180 a 630 por mês e R$ 3,6 mil a 9,9 mil pontuais, se a hora for paga.

### 21.7 Resumo

| Camada | Histórico (modelo) | Por mês (modelo) | Horas humanas | O que pesa de verdade |
|---|---:|---:|---:|---|
| Federal (10 anos) | US$ 2,4 mil a 4,8 mil | pesquisa 02 | 0 | Coletores federais (poucos); texto do Planalto por via formal |
| Estadual (27 UFs, 5 anos) | US$ 10 mil a 19 mil | US$ 160 a 300 | 0 | **~100 coletores** |
| Municipal, fluxo | — | US$ 25 a 50 (C1) + C2/C3 | 0 | Coletores por plataforma |
| Municipal sob demanda | US$ 5 a 40 por município | — | 0 | Demanda |
| Trilha da Leis Ltda | Preço desconhecido | — | 10 a 20 h pontuais | Negociação |
| CAPTCHA, LAI, convênios | — | — | 2 a 7 h/mês + 30 a 90 h pontuais | Prazos de terceiros |

---

## 22. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| **Erros correlacionados entre modelos** (60% de mesma resposta errada quando dois erram, ICML 2025) | Evidência literal, famílias diferentes às cegas, revisor final de terceira família, consolidação por código, ouro reservado, NFS-e, reportes, certeza visível (13.6) |
| Ouro parcial subestima o erro onde não há ouro | Publicar a cobertura do ouro; erro por estrato; calibração da certeza |
| Ouro atrasado ou errado | Divergência das três famílias contra o ouro vira "divergência com {fonte}", não correção automática |
| Base com muita certeza baixa no começo | Rótulos claros; nova rodada quando chega contexto; laço de melhoria; reportes |
| Usuário reporta errado ou de má-fé | Reporte só corrige com a publicação oficial e a revisão da IA; "confere" é sinal; peso por histórico; limite |
| Um fornecedor de modelo muda preço ou some | Três famílias intercambiáveis; escolha pelo benchmark; o Argon já tem aumento marcado para 1/12/2026 |
| Revogação tácita e cláusula genérica (23% das leis) | Sinal, nunca evento; certeza baixa no dispositivo |
| Citar lei de outro ente | Filtro por ente em código; URN validada |
| Os ~100 coletores estaduais custam mais que o previsto | Medir horas por coletor; UFs dos pilotos primeiro; LAI por arquivos em lote |
| Sefaz sem RICMS consolidado oficial | UF fica em C1 até o texto montado passar nos limiares; pedido por LAI |
| Planalto bloqueia robôs (ouro federal) | Pedido formal à Casa Civil; espelho da Câmara; normas.leg.br |
| Querido Diário fora do ar | Usar o código (MIT), não a API |
| DOM/SC sem licença declarada | Pedido ao CIGA |
| BLM só acessível pela Leis Municipais | LexML, convênio com o TCE-RS ou a trilha da seção 18 |
| Dependência da Leis Ltda, se houver acordo | Pipeline próprio segue; saída com portabilidade; sem exclusividade que bloqueie |
| CAPTCHA contorna a intenção do publicador | Só fonte pública oficial, em paralelo à via formal, taxa humana, registro, parecer (10.2) |
| Dados pessoais | Triagem LGPD; mascaramento; relatório de impacto |
| Laço de melhoria burla a métrica | Ouro escondido; funções de medida fora da área editável |
| Responsabilidade profissional | Rótulo e certeza em toda resposta; decisão e assinatura do profissional |

---

## 23. Comparação com o plano anexado

### 23.1 O que ficou

- Qualidade e verificabilidade antes de volume; link oficial e metadados.
- Pipeline em estágios, modelo pequeno onde couber, cache.
- Querido Diário, DOM/SC, LexML e SAPL como fontes.
- Nível de confiança por município, coleta sob demanda e feedback do usuário.
- **Agentes e DGM otimizando o processo**, que agora vale para toda a ingestão, com a revisão pela IA como padrão (**[Dono]**).
- A cobertura ampla do Sul, de SP e de MG, agora no **estadual** e para as 27 UFs (**[Dono]**).

### 23.2 O que mudou e por quê

| # | Plano anexado | Este plano | Por quê |
|---|---|---|---|
| 1 | MVP municipal com 5 UFs inteiras, capitais e todos acima de 100 mil (2.853) | **[Dono]** Municipal fácil + sob demanda; os 338 como ordem da fila | Custo de coletores; decisão do dono |
| 2 | Estadual não tratado | **[Dono]** 27 UFs, com expectativa corrigida e custo | Seção 3 |
| 3 | Tipos de norma todos juntos | Núcleo tributário no lançamento; urbanismo e posturas com os módulos jurídicos | Seção 6 |
| 4 | Esquema plano por documento | Fichas por dispositivo, versão e evento, com leituras por modelo | Data do fato; rastreio da revisão |
| 5 | "Status quando detectável" | Eventos, revogação genérica como sinal, anterioridade, certeza por limiar | 22,9% de revogação genérica |
| 6 | "Modelo forte extrai e padroniza" | Três famílias extraem e revisam; o código consolida | 50% e 20% de acerto quando o modelo consolida; erros correlacionados |
| 7 | Validação de presença de campos | Revisão pela IA com limiares, ouro reservado e calibração | Seção 13 |
| 8 | Querido Diário como primeira fonte | Código reaproveitável e descoberta; DOM/SC, SIGPub, BLM e SAPL promovidos | ~520 municípios; API fora do ar no teste |
| 9 | Sem fonte privada | **[Dono]** Leis Ltda como trilha adicional, da licença à parceria | Seção 18 |
| 10 | Sem tribunais de contas nem NFS-e | BLM do TCE-RS; NFS-e como ouro de alíquotas | Seções 4.4 e 5.1 |
| 11 | Histórico de 5 anos (ou 2 a 3) | **[Dono]** 10 anos federal; 5 estadual e municipal | — |
| 12 | "Nível de confiança" sem efeito | C0 a C4 com rótulos, textos e lugar na resposta | Seção 8 |
| 13 | "Ativar DGM completo" | Laço inspirado na DGM, offline, contra ouro escondido | DGM real custa US$ 22 mil por rodada e burla a métrica |
| 14 | Robots e rate limit | Direito autoral, LGPD, termos, LAI e convênio; **[Dono]** CAPTCHA como reserva | Seções 10.2 e 17 |
| 15 | Sem módulos | **[Dono]** Módulos de base legal | Seção 6 |
| 16 | Custo qualitativo | Custo por camada com a revisão múltipla e horas humanas | Seção 21 |

---

## 24. Decisões do dono (9/11/2026) e o que segue aberto

### 24.1 Decisões

**Primeira rodada:**
1. **Primeiros clientes:** contábil e BPO; advocacia em módulos, do mais comum ao menos comum (seção 6).
2. **Escopo local:** estadual dos 27 entes; municipal só o fácil, o resto sob demanda e pelo feedback.
3. **C2:** pode ser lançado, rotulado (seção 8).
4. **Janela:** 10 anos no federal; 5 anos no estadual e no municipal.
5. **LAI e convênios** em nome da empresa; **CAPTCHA** por pessoa no celular como reserva (seção 10.2).

**Segunda rodada:**
6. **Revisão pela IA, não por pessoas**, em toda a ingestão (federal, estadual e municipal): famílias diferentes, reconciliação, rodadas, revisor final de outra família, limiares, consolidação por código e validação automática. Divergência persistente rebaixa a certeza (seção 13).
7. **Taxa de erro** contra conjuntos-ouro automáticos e reportes confirmados, sem auditoria humana obrigatória (seção 13.5).
8. **Pessoa só onde não tem jeito:** CAPTCHA, papelada de LAI e convênios, reunião da parceria (seção 13.7).
9. **Leis Ltda** como trilha adicional, com reunião que pode chegar a parceria societária; opcional (seção 18).

**Resolvidas por consequência destas decisões:**
- quem faz as horas de revisão: não há revisão humana; sobram 2 a 7 h por mês de tarefas administrativas;
- se reportes podem corrigir a base sem pessoa: sim, desde que confirmados na publicação oficial pela revisão da IA;
- a cotação da Leis Ltda: substituída pela reunião.

### 24.2 O que segue aberto

1. **Municípios dos pilotos.** Virão pela demanda. Até lá, as cinco capitais de RS, SC, PR, SP e MG servem de primeiros C3 municipais.
2. **Aprovar a divisão em módulos** do contábil (T1, T2, T3, D1, S1, K1) e do BPO (B1), e os complementos jurídicos baratos antes da onda 4 (seções 6.2 e 6.4).
3. **Aprovar os textos dos rótulos** C0 a C4 (seção 8.2).

---

## 25. Correções a documentos do repositório de trabalho

Achados e decisões que afetam textos já escritos (não alterados aqui):

- **Plano de Ingestão, 5.3:** os 834 municípios mineiros usam o caderno "Diário dos Municípios Mineiros" do jornal Minas Gerais (Imprensa Oficial), não o diário da AMM.
- **Plano de Ingestão, 3.5, 4.5, 4.6 e 4.7**, pela decisão do dono de revisão pela IA:
  - congelamento por concordância entre famílias e contra o ouro, não "entre agentes e contadores";
  - ausência de consenso vira rótulo, não bloqueio;
  - auditoria amostral humana substituída pelo ouro reservado;
  - papel humano restrito a CAPTCHA, LAI, convênios e decisões de negócio;
  - revisor final de terceira família no lugar do revisor Sonnet da pesquisa 02.
- **Plano de Ingestão e Plano do Assistente, escopo:** "5 UFs" passa a "27 UFs" no estadual; "capitais e municípios dos clientes" passa a "municípios fáceis e sob demanda"; janela de 5 anos no local.
- **Plano de 6 meses, premissas:** "não há OCR relevante" não vale para atos municipais antigos.
- **J4 e JU-04:** "Querido Diário, cerca de 350 cidades (2024)" passa a cerca de 520 (2026).
- **Plano do Assistente, guia das técnicas, e roteiro da apresentação:** o "10 a 30 vezes mais barato" é do HippoRAG 1, não do 2; a "árvore guiada pela taxonomia" é adaptação do RAPTOR.

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
- [Correlated Errors in Large Language Models, Kim et al., ICML 2025](https://proceedings.mlr.press/v267/kim25e.html) · [arXiv 2506.07962](https://arxiv.org/abs/2506.07962)
- [Etcheverry et al., NLLP 2024](https://aclanthology.org/2024.nllp-1.13/) · [Prior et al., NLLP 2025](https://aclanthology.org/2025.nllp-1.29.pdf)
- [olmOCR, arXiv 2502.18443](https://arxiv.org/abs/2502.18443) · [DODFMiner (UnB)](https://dodfminer.readthedocs.io/en/main/user/intro.html)
- [Preços da API da Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)

**Repositório de trabalho (DGM-RAG-Contabil)**
- `docs/Plano_de_Ingestao_da_Base_Legal.md` (seções 2, 3.5, 4.2, 4.4 a 4.7 e 5.6: o desenho de extratores, revisor, reconciliador e portões), `docs/Plano_Assistente_de_IA_para_Contadores.md`, `docs/Plano_MVP_6_meses.md`, `docs/subplanos/07-Motores-e-Consultor.md`, `docs/subplanos/08-Conectores.md`, `docs/subplanos/10-BPO.md`, `docs/subplanos/juridico/JU-04-Motor-Juridico-e-Base-de-Leis.md` (3.1 a 3.6, 5.5 e decisões de 9/11/2026), `docs/Estudo_de_Precificacao_por_Modulo.md` (hora de R$ 90, P28)
- `pesquisa/juridico/J9-ordem-dos-modulos-de-base.md`, `pesquisa/juridico/J3-atividades-advocacia.md`, `pesquisa/juridico/J6-outras-areas-candidatas.md`, `pesquisa/juridico/J4-fontes-e-integracoes.md`
- `pesquisa/01-infra-aws.md` (S3), `pesquisa/02-custos-llm.md` (câmbio, preços de OpenAI e Google, custo por ato, volumes por UF, modelos por etapa), `pesquisa/04-juridico-tributario-dados.md` (LAI: 2 a 6 h por pedido), `pesquisa/plataforma/V2-estados-municipios.md`
