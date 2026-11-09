# Notas brutas da pesquisa: base de legislação municipal

Coleta feita em 9/11/2026. Cada item traz a fonte e o que foi conferido. "[lido]" = página primária lida; "[busca]" = só trecho de buscador; "[testado]" = chamada feita daqui; "[inferência]" = conta ou dedução minha.

## 1. Querido Diário (OKBR)

- Site mudou para queridodiario.org.br (o antigo queridodiario.ok.org.br redireciona com 302) [testado 9/11/2026].
- API pública: `api.queridodiario.ok.org.br` respondeu com falha de TLS daqui e o WebFetch recebeu 503; `api.queridodiario.org.br` não respondeu em 150 s (9/11/2026) [testado]. Issue do Ro-DOU (out/2026) relata instabilidade e "API voltando a ficar estável" [busca: https://github.com/gestaogovbr/Ro-dou/issues/378].
- Documentação da API: endpoint `/gazettes` com `territory_ids` (IBGE), `querystring`, `excerpt_size`, `number_of_excerpts`, `size`; limite de referência 60 requisições/minuto; "sem restrições formais de uso" [lido: https://docs.queridodiario.ok.org.br/en/latest/_sources/using/public-api.rst.txt].
- Licença: código MIT; dados CC-BY 4.0 salvo indicação [lido: https://docs.queridodiario.ok.org.br/pt-br/latest/].
- Cobertura declarada pela OKBR: "Hoje, a plataforma abrange 522 municípios", quase 65 milhões de pessoas (cerca de um terço da população) [lido: https://www.catarse.com.br/queridodiario-okbr/about; página sem data].
- Conferência de terceiro (monitorelnino, PR #469, 30/09/2026): 527 de 5.571 municípios com diário indexado; 5.044 sem [lido: https://github.com/monitorelnino/monitorelnino/pull/469]. Fonte não oficial; serve de ordem de grandeza.
- Repositório de raspadores (okfn-brasil/querido-diario, último commit 23/09/2026, pasta `querido_diario_raspadores`): 449 arquivos de raspador; 441 códigos IBGE distintos em `TERRITORY_ID`; por UF: SP 116, BA 74, RJ 33, SE 29, MA 29, PR 27, TO 26, RS 21, MG 21, CE 13, PB 10, MS 10, RN 8, PE 6, AL 4, SC 3, PA 3, MT 3, ES 3, AP 3, GO 2, RR/RO/PI/DF/AM 1; 22 classes-base de sistemas replicáveis (SIGPub, Instar, DOEM, Atende, etc.); único raspador de associação no código atual: `al_associacao_municipios` (diariomunicipal.com.br/ama) [testado: git clone].
- Base dos Dados: a busca do catálogo (backend.basedosdados.org) não mostra conjunto do Querido Diário; mostra o DOU (Imprensa Nacional, atualizado 19/02/2024) e "leis" da Câmara de Feira de Santana [testado 9/11/2026].
- Pesquisa J4 (8/11/2026) citava "350 cidades (2024)"; o número atual é cerca de 520.

## 2. LexML

- Descrição do acervo atualizada em 21/12/2025: 11.010.402 documentos no total [lido: https://www.lexml.gov.br/desc_acervo.html].
- Legislação municipal: 57 câmaras municipais provedoras, somando 285.963 documentos (maiores: Campinas 36.796; Divinópolis 15.881; Bento Gonçalves 14.069; Jundiaí 13.074; Uberaba 11.852) [lido, soma minha].
- TCE-RS é provedor de "Legislação Municipal do Rio Grande do Sul": 789.722 documentos [lido].
- Portal da Lei Geral da MPE (CNI/Sebrae): 3.922 documentos de legislação municipal e estadual da microempresa [lido].
- Estadual: ALESP 172.457; ALMG 109.230; ALESC 20.881; ALEAM 11.629; ALERO 6.301; ALEAL 1.010; SINJ-DF 52.210 [lido].
- Federal: Senado 291.420; Câmara 258.444 [lido].
- J4 (8/11/2026): LexML SRU devolveu página de "Verificação de segurança" a chamada por script.

## 3. TCE-RS: Base de Legislação Municipal (BLM)

- Resolução TCE-RS 843/2009 instituiu a BLM; IN 12/2009 regulamentou o envio obrigatório das normas municipais (cronograma trimestral na versão original) [busca: https://atosoficiais.com.br/tcers/instrucao-normativa-n-12-2009-...].
- Consulta pública lançada em 02/10/2019 em parceria com a Liz Serviços Online (Leis Municipais), "mais de um milhão de normas municipais", página por município, publicação em até 24 h após validação diária; endereço leismunicipais.com.br/tcers [lido: https://atricon.org.br/blog/tce-rs-lanca-nova-plataforma-de-consulta-a-legislacao-municipal/].
- A parceria não cobre consolidação, compilação e versionamento [busca: página do LeisMunicipais].
- Outros TCEs com envio de legislação municipal: TCE-RN (Sistema Legis, Res. 017/2020, validação automatizada) [busca]; TCE-PI (Res. 09/2009: lei orgânica, PPA, código tributário etc.) [busca]. A confirmar se há consulta pública.

## 4. Leis Municipais (Leis Ltda / Liz Serviços Online, Itapema/SC)

- Contrato Caçapava do Sul (RS), 14/04/2025, inexigibilidade (Lei 14.133, art. 74): "consolidação, compilação, versionamento e gerenciamento dos atos oficiais"; versionamento = "textos ... por cada período de tempo em que existiram alterações/revogações ... texto vigente até a data selecionada"; classifica normas em vigor, revogadas, a vigorar, repristinadas, revogadas tacitamente, vigência esgotada, declaradas inconstitucionais, sem efeito; anuidade R$ 3.480,00 [lido: PDF do contrato no portal de Caçapava do Sul].
- Proposta a Ilhota (SC), dez/2023: "Há 23 anos no mercado ... mais de 1.000 municípios, governos estaduais e tribunais de contas"; R$ 12.865,60/ano [lido: https://ilhota.sc.gov.br/wp-content/uploads/2023/12/Leis-Municipais.pdf].
- Notícia (data incerta, 2025-2026): "1.350 órgãos públicos ativos" e "mais de 10 milhões de normas publicadas", portal Leis.Org [busca: sosnoticias.com.br; página não carregou o texto].
- O site devolveu 403 ao acesso automatizado (WebFetch) em 9/11/2026 [testado]. Não insistir: a coleta automatizada desse portal está fora do plano.

## 5. Diários associativos e estaduais

- **DOM/SC (CIGA/FECAM)**: dados abertos em CKAN (dados.ciga.sc.gov.br), um pacote por mês, arquivos ZIP por janela de horário, JSON com um registro **por ato**: `codigo`, `titulo`, `data`, `municipio`, `entidade`, `categoria` (Leis, Decretos, Portarias...), `link`, `texto` (HTML extraído), `url` (PDF do ato). Licença: "Nenhuma licença fornecida" na página do recurso [testado 9/11/2026].
- Outubro de 2026 no DOM/SC (contagem minha sobre os 87 arquivos do mês): 97.180 publicações; 293 municípios; 655 entidades; categorias: atas de registro de preços 64.662 (66,5%), portarias 7.653, licitações 6.514, **decretos 5.024 (5,2%)**, **leis 1.295 (1,3%)**, resoluções 745, instruções normativas 55. 228 municípios publicaram ao menos uma lei no mês; 270, ao menos um decreto [testado].
  - Média por município no mês: 4,4 leis e 17,1 decretos → cerca de 53 leis e 206 decretos por município por ano em SC [inferência].
- CIGA, relatórios antigos: 2013, 117 municípios e 131.953 atos; 2014, 148 municípios e 200.517 atos; custo médio R$ 4,21 por ato [busca: consorciociga.gov.br, relatórios 2013 e 2014]. Em out/2026 já são 293 dos 295 municípios de SC [testado].
- **SIGPub (Vox Tecnologia), diariomunicipal.com.br**: plataforma única de diários de associações: AMA (AL), AGM e FGM (GO), AMURB e AMURC (BA), Maceió; diários da AMUPE (PE), FAMUP (PB), FAMEP (PA), FEMURN (RN), AAM (AM), AROM (RO), APRECE (CE), FAMURS (RS), AMP (PR), AMM-MG (MG) usam o mesmo endereço [lido: https://www.diariomunicipal.com.br/; busca para a lista]. Cada ato publicado traz "Código Identificador" verificável no site [busca: atos de Cacoal-RO e Brochier-RS].
- **Minas Gerais**: o "Diário dos Municípios Mineiros" é um caderno do jornal Minas Gerais (Imprensa Oficial do Estado), criado em 2021 (Decreto Estadual 48.175/2021); "Dos 853 municípios mineiros, atualmente, a maior parte, 834, utiliza o Diário dos Municípios Mineiros" (Agência Minas, 22/04/2026) [lido: https://agenciaminas.mg.gov.br/noticia/jornal-minas-gerais-completa-134-anos-como-referencia-em-transparencia-e-parceria-com-municipios]. Há também o "Diário Oficial dos Municípios Mineiros" da AMM no SIGPub (ano XVII, nº 4115 em 25/09/2025) [busca]. **Correção ao Plano de Ingestão:** os 834 são do caderno estadual, não da AMM.
- AMM tem 839 municípios afiliados (jul/2026) [busca: acessa.com, Sindijori].

## 6. População, PIB e empresas (IBGE) — contas minhas

Fontes: IBGE, Estimativas de População 2025, arquivo POP2025_20260828 (https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2025/); PIB dos Municípios 2023 (SIDRA, tabela 5938, variável 37); CEMPRE 2021, número de unidades locais (SIDRA, tabela 1685, variável 706) [testado 9/11/2026].

| Recorte | Municípios | População 2025 | PIB 2023 | Unidades locais 2021 |
|---|---:|---:|---:|---:|
| Brasil | 5.571 | 213.421.037 | R$ 10,94 tri | 6.321.759 |
| Capitais | 27 | 23,1% | 28,3% | 32,1% |
| Acima de 100 mil hab. (inclui todas as capitais) | 338 | 58,3% | 67,4% | 68,2% |
| Acima de 50 mil | 682 | 69,5% | 78,1% | 78,0% |
| Acima de 20 mil | 1.752 | 85,0% | — | 89,6% |
| Até 10 mil | 2.469 | 6,0% | — | — |
| SP+MG+PR+SC+RS, todos | 2.689 | 46,3% | 57,1% | 63,7% |
| As 5 UFs, acima de 100 mil | 174 | 28,7% | 39,2% | 43,1% |
| Escopo do plano anexado (5 UFs inteiras + capitais + >100 mil no país) | 2.853 | 75,9% | 85,3% | 88,8% |

- Top 10 municípios por PIB: 24,5% do PIB; top 50: 42,9%; top 100: 52,9% (58 deles nas 5 UFs); top 1.000: 86,1%.
- Municípios acima de 100 mil por UF: SP 81, MG 36, RJ 29, PR 24, RS 19, BA 18, GO 17, PE 15, PA 15, SC 14, MA 10, ES 10, CE 9, MT 6...

## 7. NFS-e Nacional e reforma

- Painel da RFB citado em 28/10/2026: 5.571 municípios conveniados; 5.466 em "ativo operacional" enviando ao ADN; 3.062 usam o Emissor Nacional [busca: notagateway.com.br/adesao-municipios-nfse/]. Em jan/2026: 5.465 formalizados, 1.898 em operação ativa [busca: reformatributaria.com]. Planilha oficial de 28/09/2026: 5.543 aderentes ao Ambiente Nacional, 2.875 ao Emissor Nacional, 5.462 ativos no último período (V2, lida no repositório de trabalho).
- LC 214/2025 obriga o padrão nacional da NFS-e a partir de 2026 (sistema próprio integrado ou emissor nacional) [busca]. Res. CGSN 189/2026: NFS-e de padrão nacional para ME/EPP do Simples [busca].
- EC 132/2023, ADCT art. 128: ICMS e ISS a 9/10 em 2029, 8/10 em 2030, 7/10 em 2031, 6/10 em 2032; art. 129: extintos a partir de 2033 [busca: PwC e Taxup; Planalto bloqueou o robô].
- LC 227/2026 (PLP 108/2024): sancionada 13/01/2026, publicada 14/01/2026; Comitê Gestor do IBS; normas gerais de ITCMD; regras de ITBI no CTN (base = valor de mercado; veto à antecipação facultativa) [busca: Senior, Cescon Barrieu, CNT].

## 8. SAPL (Interlegis/Senado)

- Estimativa de uso: "cerca de 1.200 câmaras municipais" (técnico do Senado em evento de 2026, citado por duas notícias regionais) [busca]. Os filtros por UF da página "órgãos atendidos" do Interlegis não são confiáveis para contar (PR aparece com 421 "câmaras municipais", mais que os 399 municípios); SC mostra 64 câmaras com SAPL [lido: https://www12.senado.leg.br/interlegis/orgaosatendidos?uf=SC&servico=SAPL&tipocasa=CM]. A página nacional devolveu 503.
- API REST aberta, testada em sapl.cacoal.ro.leg.br (9/11/2026) [testado]:
  - `/api/norma/normajuridica/`: `numero`, `ano`, `data`, `data_publicacao`, `veiculo_publicacao`, `ementa`, `texto_integral` (PDF), `data_vigencia`, `tipo`, `assuntos`, `materia`; Cacoal: 3.631 normas.
  - `/api/norma/normarelacionada/` com `tipo_vinculo`: "Altera o(a)", "Revoga integralmente", "Revoga parcialmente", "Revoga integralmente por consolidação", "Norma correlata" etc. (14 tipos); Cacoal: 699 vínculos.
  - `/api/compilacao/dispositivo/`: dispositivo a dispositivo, com `inicio_vigencia`, `fim_vigencia`, `inicio_eficacia`, `fim_eficacia`, `dispositivo_substituido`, `dispositivo_atualizador`, `inconstitucionalidade`; Cacoal: 278 textos articulados e 21.149 dispositivos. É o mesmo modelo das Fichas 2 e 3 do Plano de Ingestão.
  - Tipos de norma em Cacoal: lei ordinária, lei orgânica, emenda à lei orgânica, decreto legislativo, resolução, regimento interno, errata. **Decretos do Executivo não estão no SAPL da câmara.**
- Interlegis ensina compilação (textos multivigentes TMS, TMI, TVT) às câmaras [busca: caderno de exercícios "articulação e compilação"].

## 9. Querido Diário: plataformas replicáveis

- Dos 449 raspadores, 384 (85,5%) herdam uma de 21 classes-base de plataformas; só 65 (14,5%) são próprios. Maiores: Instar 111, DOEM 56, DOSP 42, ADiários (v1+v2) 39, Município Online 26, Atende v2 22, DIOF 21, Barco Digital 12, Siganet 10, DiárioOficialBR 10 [testado: contagem minha no código].

## 10. Técnica: consolidação automática (literatura)

- Etcheverry, Real, Chavallard (Doctrine), "Algorithm for Automatic Legislative Text Consolidation", NLLP 2024 (arXiv 2501.16794): modelo gerador quantizado com LoRA aplicando emendas do PLF francês ao CGI; "success rate of more than 63% on a difficult bill" [lido].
- Prior, Hof, Wais, Grabmair (TUM), "Risks and Limits of Automatic Consolidation of Statutes", NLLP 2025: 908 pares emenda–lei de 140 edições do Diário Oficial Federal alemão; similaridade textual 93–99%, mas acerto exato só 50,3% (um passo) e 20,51% (vários passos); "any public or private deployment must treat outputs as drafts subject to rigorous human verification" [lido: https://aclanthology.org/2025.nllp-1.29.pdf].
- Mesmo artigo resume a literatura: Ogawa et al. (2008), leis japonesas estruturadas, 16 expressões regulares, 99,47% de acerto; Garofalakis et al. (2016), leis gregas em PDF heterogêneo, 37,1% subindo a 59,4% com correção manual [lido].
- Conclusão para o plano: o modelo extrai eventos; código aplica; o acerto depende da qualidade da fonte, e o município brasileiro se parece mais com o caso grego que com o japonês.

## 11. Artigos das técnicas (conferidos no texto)

- RAPTOR (Sarthi et al., ICLR 2024, arXiv 2401.18059): incorpora, agrupa e resume trechos recursivamente, de baixo para cima; agrupamento suave com modelos de mistura gaussiana sobre embeddings reduzidos com UMAP; dois modos de busca: percorrer a árvore camada a camada ou "árvore colapsada" (todos os nós num só nível, por similaridade de cosseno até um limite de tokens); com GPT-4, +20 pontos absolutos no QuALITY [lido].
- HippoRAG 2 (Gutiérrez, Shu, Qi, Zhou, Su; ICML 2025; arXiv 2502.14802): grafo aberto feito de triplas extraídas por LLM (OpenIE), nós de frase e de passagem, arestas de sinonímia por similaridade; na consulta, embeddings acham passagens e triplas-semente, um LLM filtra as triplas ("recognition memory") e o PageRank personalizado espalha a relevância; ~7% de ganho em memória associativa sobre o melhor embedding [lido]. O "10 a 30 vezes mais barato e 6 a 13 vezes mais rápido que o IRCoT" é do HippoRAG 1 (arXiv 2405.14831), não do 2 [lido].
- Rank1 (Weller, Ricci, Yang, Yates, Lawrie, Van Durme; COLM 2025; arXiv 2502.18418): reranker que gera raciocínio antes do julgamento; destilado de 635 mil traços do DeepSeek R1 sobre o MS MARCO; modelos Qwen 2.5 (7B, 32B etc.); estado da arte no BRIGHT, NevIR e mFollowIR na época; versões quantizadas mantêm desempenho [lido].
- DGM (Zhang, Hu, Lu, Lange, Clune; arXiv 2505.22954 v3; "Published as a conference paper at ICLR 2026" segundo o PDF citado em busca): arquivo de agentes de código com modelos de fundação **congelados**; a cada iteração um agente do arquivo propõe e aplica mudança no próprio código, avaliada em benchmark; 80 iterações; SWE-bench 20,0% → 50,0%; Polyglot 14,2% → 30,7% (conjunto completo); uma rodada no SWE-bench leva ~2 semanas e ~US$ 22 mil; experimentos com sandbox e supervisão humana; relata "objective hacking": o nó 114 removeu o registro dos tokens que marcavam uso de ferramenta e burlou a função de detecção de alucinação [lido].
- Hyperagents / DGM-H (Zhang et al., arXiv 2603.19461, mar/2026, v2 nov/2026): meta-agente editável junto com o agente de tarefa; ganhos que transferem entre domínios, segundo o resumo [lido, só o resumo].

## 12. DOM/SC, outubro de 2026: técnica legislativa e conteúdo (contagem minha, expressões regulares sobre título e texto)

Universo: 1.295 leis e 5.024 decretos publicados no mês por 293 municípios [testado; scripts em scratchpad, não versionados].

| Marcador | Leis | Decretos |
|---|---:|---:|
| "entra em vigor na data de sua publicação" | 92,9% | 92,7% |
| Vigência diferida (data fixa, 1º de janeiro, exercício seguinte, 90 dias) | 5,2% | 0,9% |
| Efeitos retroativos ou "a contar de" | 4,3% | 3,1% |
| Cláusula genérica "revogam-se as disposições em contrário" | 22,9% | 27,5% |
| Revogação expressa ("fica revogado", "revoga-se o art.") | 8,3% | 7,9% |
| "passa a vigorar com a seguinte redação" ou "nova redação" | 11,8% | 2,8% |
| Marca "(NR)" | 4,3% | 1,3% |
| Menciona "anexo" | 27,3% | 9,6% |
| Abertura de crédito orçamentário | 28,3% | 54,3% |
| Algum termo tributário (ISS, IPTU, ITBI, código tributário, taxa, REFIS, UFM, NFS-e, COSIP) | 9,3% | 6,1% |
| Termo tributário, excluídos créditos orçamentários | 7,5% (97) | 2,6% (133) |
| Texto com menos de 200 caracteres (sem camada de texto) | 1 ato | 1 ato |

- Tamanho do texto (leis e decretos): mediana 2.074 caracteres; percentil 90: 9.645 [testado].
- Leitura: (1) o marcador (NR) aparece em cerca de um terço das leis que dão nova redação, então não serve como detector único; (2) quase um quarto ainda usa a revogação genérica, o que deixa a revogação tácita como caso frequente; (3) os critérios são aproximados (falsos positivos em "taxa", "revoga"), servem de ordem de grandeza e devem ser refeitos no piloto com rótulo humano.
- Dados abertos do DOM/SC existem como pacotes mensais de jan/2023 a out/2026 (58 pacotes) [testado: package_search do CKAN].

## 13. Outras fontes conferidas

- LexML, especificação da URN (Parte 2): municipal usa `urn:lex:br;sao.paulo;campinas:municipal:lei` (autoridade "municipal", não "prefeitura" nem "camara.municipal") [lido: https://projeto.lexml.gov.br/documentacao/Parte-2-LexML-URN.pdf].
- RFC 9676 (maio de 2025), "LEX: A URN Namespace for Sources of Law", informacional, CNR da Itália [lido: https://www.rfc-editor.org/rfc/rfc9676.html].
- NFS-e Nacional, API de parâmetros municipais: `GET /parametros_municipais/{codigoMunicipio}/convenio`, `/aliquotas` (por subitem da lista de serviços, com regimes especiais e deduções), `/retencoes`, `/beneficios`; o sistema considera a vigência dessas informações [busca: manual de municípios v1.2, out/2025, gov.br/nfse].
- EC 132/2023, art. 156-A, § 1º, V: cada ente fixa sua alíquota própria do IBS por lei específica; sem lei, vale a alíquota de referência fixada pelo Senado [busca: TCE-PB, Senado, Conjur].
- Senado e normas.leg.br: compilação estruturada para CC (2002), CPC (2015) e legislação federal a partir de 2019; anterior a 2019, compilação manual da Câmara [busca: apresentação do Senado "Normas leg br"].
- Assembleias: preprint "Democracia em Formato JSON" (Vinicius Santos, SciELO Preprints 12275, jul/2025) avalia as 26 assembleias e a CLDF e descreve "forte assimetria e fragmentação técnica" [busca].
- Jusbrasil, Termos de Uso, cláusula 2.5.2: acessos por robôs, bots ou automações são ilegítimos [busca].
- Leis Municipais: portal devolveu 403 ao acesso automatizado [testado]; não se insiste.
- CFC: 101.880 organizações contábeis (Relato Integrado 2025); 533.724 profissionais ativos em 30/09/2024, SP com 154.574 (29%) e a maior parte das organizações [busca: CFC RI 2025; CRCSP transparência].
- Câmbio usado nas contas em reais: R$ 5,6858 por dólar pago (PTAX de 3/11/2026 × IOF), da pesquisa 02 do repositório de trabalho.
- Preços de modelos (Anthropic, conferidos na referência da API em 9/11/2026): Haiku 5.5 US$ 0,10/0,50 por milhão de tokens (até 100 mil tokens de prompt), Sonnet 5.5 US$ 2/10, Opus 5.5 US$ 4/20; lote com 50% de desconto.
- OCR: olmOCR (Ai2) estima menos de US$ 200 por milhão de páginas em GPU própria; olmOCR-Bench: olmOCR 2 82,4; Marker 1.10.1 76,1; Mistral OCR API 72,0 [busca: arXiv 2502.18443 e resumos]; Mistral OCR 4 (jun/2026): US$ 4 por mil páginas, US$ 2 em lote [busca: usagepricing.com, captura de 6/7/2026; confirmar na página da Mistral].
- S3 Standard-IA em São Paulo: US$ 0,0221 por GB-mês (pesquisa 01 do repositório de trabalho, 20/10/2026).
