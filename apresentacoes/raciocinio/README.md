# O raciocínio do Consultor

A apresentação do método do Consultor da Heild: como ele responde sobre a lei com a norma certa, na redação que valia na data do fato, com o trecho citado e conferido, e por que isso é diferente de uma IA comum. Aberta a escritórios de advocacia, contábeis e de BPO financeiro, com exemplos das três áreas. Num HTML só, com a marca e o motor da apresentação de produto.

| Versão | Endereço | O que tem |
|---|---|---|
| Completa | `#completa` (padrão) | 33 slides, com todas as cenas técnicas |
| Curta | `#curta` | 19 slides, para uns 20 minutos |

`#completa-12` abre o slide 12. As notas do apresentador (tecla N) trazem a fala de cada slide e as fontes.

## O fio da história

1. **Abertura:** a tese em uma frase; a mesma pergunta antes e depois de uma mudança na lei, nas três áreas.
2. **O problema:** arraste a data do fato e o texto da CLT muda; a mesma pergunta para uma IA comum e para o Consultor; o erro de citação nos tribunais; as armadilhas da lei.
3. **A ideia:** a lei fica fora do modelo; as quatro camadas.
4. **A base no tempo:** o dispositivo com todas as redações; o texto compilado calculado por código; as três datas do direito; o grafo de remissões.
5. **A cascata:** do barato ao caro, etapa por etapa; entender antes de buscar; o filtro de vigência; palavras e significado; o revisor que diz por quê; a conta fora do modelo; os modos.
6. **A confiança:** o verificador; a abstenção; a divergência sem tese vinculante; a responsabilidade do advogado.
7. **A base municipal:** o desafio; os rótulos de cobertura C0 a C4; a revisão pela IA na ingestão; o limite da concordância; os blocos que os pacotes dividem.
8. **A melhoria:** cada correção vira prova; o laço inspirado na DGM; a burla da métrica.
9. **Fecho:** o que muda em relação a uma IA comum.

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py raciocinio
```

Gera `apresentacoes/dist/heild-raciocinio.html` (fora do git). As fontes e o `<heild-logo>` vêm do branch `design-system`; o `<orb-avatar>`, do protótipo.

## Arquivos

| Caminho | O que é |
|---|---|
| `src/modelo.html` | A página. Inclui, pelo build, o motor, os tipos, os dados e o estilo da apresentação de produto (`../produto/src/`) e, depois, os arquivos daqui |
| `src/dados.js` | O conteúdo: os 33 slides e as duas versões. Troca `HEILD_APRESENTACAO.versoes` pela desta apresentação. **É o arquivo que se edita** |
| `src/comum.js` | O que as cenas usam: composição, datas, a cápsula que anda por um caminho, contagem, cartão de citação |
| `src/cenas-*.js` | Os tipos de slide novos, por capítulo, somados a `HEILD_TIPOS` (capa, abertura e fecho vêm de produto) |
| `src/depois.js` | Roda depois do motor: põe o título desta apresentação na aba |
| `src/estilo.css` | O estilo dos tipos novos; a base vem de `../produto/src/estilo.css` e os tokens de `../comum/tokens.css` |

Nada em `../produto/` ou `../comum/` foi alterado.

## De onde vem o conteúdo

- **Planos** (repositório de trabalho `DGM-RAG-Contabil`): Plano do Assistente, Plano de Ingestão, subplano 07 (motores, Consultor, verificação e abstenção), JU-04 (motor jurídico), pesquisa J5 (IA jurídica e ética).
- **Plano da Base de Legislação Municipal**, versão 0.4 (`docs/planos/`): fontes, níveis C0 a C4 com os textos aprovados, revisão pela IA, blocos e pacotes, correções às técnicas.
- **A apresentação antiga** (67 slides, para escritórios contábeis), de onde vêm a cascata, a base por vigência, o grafo, o revisor, a abstenção, as quatro camadas e a DGM. O plano de negócio (investimento, preços, prazos) ficou de fora.

## Conferido na fonte (9/11/2026)

Normas, no texto compilado e na publicação original da Câmara (LEGIN), e decisões nos sites dos tribunais:

| Exemplo | Citação |
|---|---|
| Horas de trajeto | CLT, art. 58, § 2º: redação da Lei 10.243/2001 (DOU de 20/06/2001) e da Lei 13.467/2017 (DOU de 14/07/2017, em vigor 120 dias depois, 11/11/2017); § 3º acrescido pela LC 123/2006 e revogado pela Lei 13.467/2017 |
| Tema 23 do TST | IncJulgRREmbRep-528-80.2018.5.14.0004, Pleno, 25/11/2024: a Lei 13.467/2017 vale de imediato nos contratos em curso, para os fatos desde a sua vigência; no caso, horas de trajeto até 10/11/2017 |
| Prazos processuais | CPC/2015, art. 219 (dias úteis) e art. 1.046; CPC/1973, art. 178 (prazo contínuo); vigência em 18/03/2016 (Enunciado administrativo 1 do STJ) |
| Aposentadoria | EC 103/2019, art. 3º (DOU de 13/11/2019; art. 36, III); CF, art. 201, § 7º, I, na redação da EC 20/1998 e na da EC 103/2019 |
| Clínica Sorriso | LC 123/2006, art. 18, § 5º-B, XX (odontologia no Anexo III) e § 5º-M, I (Anexo V abaixo de 28%), da LC 155/2016, com efeitos em 01/01/2018; antes, § 5º-I, III, e Anexo VI, da LC 147/2014, com efeitos em 01/01/2015 (art. 15, I); §§ 5º-K e 24 |
| Retenções no BPO | Lei 10.833/2003, arts. 30, 31 (4,65%) e 32, III; § 3º do art. 31: R$ 5.000 no mês pela Lei 10.925/2004 e R$ 10 pela Lei 13.137/2015 (DOU extra de 22/06/2015, em vigor na publicação) |
| ITBI | CTN, art. 38, §§ 1º a 4º (LC 227/2026, de 13/01/2026); Tema 1.113 do STJ (REsp 1.937.821/SP, 1ª Seção, 24/02/2022; situação no STJ: acórdão publicado, RE pendente) |
| ISS | LC 116/2003, arts. 8º, II (5%), e 8º-A (2%); item 4.12 da lista (odontologia) |
| OAB | Recomendação 001/2024 do CFOAB, itens 2.2, 3.1 e 3.2 (PDF oficial) |

Técnica, nos artigos originais: RAPTOR (arXiv 2401.18059, ICLR 2024); HippoRAG (arXiv 2405.14831, NeurIPS 2024: 10 a 30 vezes mais barato que o IRCoT) e HippoRAG 2 (arXiv 2502.14802, ICML 2025: 7% em memória associativa); Rank1 (arXiv 2502.18418, COLM 2025); Darwin Gödel Machine (arXiv 2505.22954, v3; ICLR 2026); LIMIT (arXiv 2508.21038, ICLR 2026); BEIR (NeurIPS 2021); RRF (Cormack, Clarke e Büttcher, SIGIR 2009); ALCE (EMNLP 2023); abstenção (Wen et al., TACL; Kalai et al., arXiv 2509.04664); Stanford (arXiv 2405.20362); erros correlacionados (Kim et al., ICML 2025); consolidação automática (Prior et al., NLLP 2025); banco de Damien Charlotin.

## Regras que a apresentação segue

- As mesmas da apresentação de produto: design system, tokens, `<heild-logo>` sem redesenho, claro e escuro, títulos no estilo hero, nada em caixa alta, sem emoji.
- Toda cena toca em loop até a pessoa mexer; as passagens entre elementos são uma cápsula andando por um caminho, com rastro.
- Os textos que mudam (redação, resposta, rótulo) têm altura fixa: nada muda de lugar por um texto mais longo.
- Com movimento reduzido no sistema, as cenas aparecem no estado final.
- Nada inventado: a Heild não foi lançada. As empresas são as fictícias do protótipo; os casos jurídicos são exemplos sem nomes de pessoas; as respostas da "IA comum" são ilustrativas.
