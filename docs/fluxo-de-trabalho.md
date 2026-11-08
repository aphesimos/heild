# Fluxo de trabalho

## Escolher o branch

| Vai mudar | Branch |
|---|---|
| Cor, fonte, token, logo, regra da marca | `design-system` |
| Tela, fluxo, dado de exemplo, comportamento do sistema | `prototipo` |
| Página do site, landing, texto de venda | `site` |
| Este hub, a documentação geral, as imagens do README | `main` |

Uma mudança de marca que também aparece no sistema e no site entra primeiro no `design-system` e depois é levada aos outros (os tokens do app ficam em `app/src/theme/`).

Para trazer ao `site` o que mudou no `prototipo`:

```bash
git checkout site
git merge prototipo
```

## Rodar

O protótipo e o site ficam em `app/`, nos branches `prototipo` e `site`.

```bash
cd app
npm install
npm run app                                   # o sistema (protótipo), em Vite
npm run dev                                   # o Storybook dos componentes (porta 6006)
npm run typecheck                             # checagem de tipos
npm run site                                  # o site (só no branch site)
npm run build:site                            # build estático do site (só no branch site)
```

Os testes de ponta a ponta ficam em `app/scripts/*.cjs` (Playwright). Cada um recebe uma pasta para as capturas e espera o app servido numa porta: o protótipo em `http://localhost:6100/` e o site em `http://localhost:6101/` (ver o comentário no topo de cada script).

O design system não precisa de build: abra `design-system/componentes/heild-logo/exemplo.html` no navegador.

## Commits

- Em português, pequenos, com o que mudou e por quê.
- Um assunto por commit.
- Não misture branches: a mudança de marca vai no `design-system`, mesmo que seja pequena.

## As imagens do README

```bash
python3 ferramentas/gerar_svgs_readme.py
```

Gera `assets/readme/{hero,time,areia}-{claro,escuro}.svg`. As cores estão no começo do script (copiadas do `tokens.json` do design system) e a logo em `ferramentas/wordmark.json`. Se a marca mudar, atualize os dois e rode de novo.

## Regras que valem em todo lugar

- Nada inventado: a Heild ainda não foi lançada. Sem clientes, depoimentos, números de uso ou faixas de logos.
- Sem rótulo em caixa alta, sem rótulo acima do título, mono só para código e dado.
- Claro e escuro com o mesmo cuidado, contraste conferido nos dois.
- Movimento com propósito: o I da logo e os orbs são os elementos que se movem; nada corta seco.
