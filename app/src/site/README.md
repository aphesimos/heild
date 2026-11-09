# O site da Heild

O site e as landing pages: a página principal (da empresa), uma página por
plataforma (Heild Contábil, Heild BPO) e a de contato. Roda sobre o código do
protótipo: a demonstração usa a mesma loja, os mesmos fluxos e os mesmos cartões
do sistema, então o que se vê no site é o produto de verdade.

## Rodar

```bash
cd app
npm install
npm run site         # http://localhost:5173/site.html
npm run build:site   # build estático em dist/
```

As páginas são escolhidas pela hash: `#contabil`, `#bpo`, `#contato`; sem hash,
a principal.

## Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| `main.tsx` | Monta o site (tema e fontes do design system) |
| `SiteApp.tsx` | Cabeçalho com o menu Soluções, o botão de tema, o hero, as seções da principal, as páginas de plataforma, a de contato e o rodapé |
| `paginas.ts` | As plataformas: nome, forma do I da logo, resumo e a conta e o time da demonstração. Uma plataforma nova é uma entrada a mais aqui |
| `roteiros.ts` | O roteiro da demonstração guiada de cada plataforma (o pedido, a cadeia de integrantes, o que ela espera) |
| `DemoGuiada.tsx` | A demonstração guiada, sobre a loja real (`LojaProvider semRotinas`, navegação em modo vitrine) |
| `SecoesContabil.tsx`, `SecoesBpo.tsx` | As seções de produto de cada plataforma: Painel, notas e XML, Consultor da reforma, widgets, o resto do escritório |
| `SecaoProduto.tsx`, `PainelMini.tsx` | As peças comuns dessas seções e o Painel pequeno e navegável |
| `Vivos.tsx` | As cenas que tocam sozinhas: o time conversando, a aprovação, a pergunta sobre a lei |
| `Luz.tsx` | O brilho borrado do hero e do fechamento, nas cores dos integrantes |
| `Estavel.tsx` | `ReservaAltura`: empilha as variantes invisíveis na mesma célula para que nada mude de altura ao trocar de conteúdo |
| `Rolagem.tsx` | A barra de rolagem: uma pílula como o I da logo, que some parada |
| `heild-logo.js` | A logo animada (`<heild-logo>`), a mesma do design system |
| `site.css`, `tema.css` | Os estilos do site e a troca de tema em onda |

## Regras do site

- **Nada muda de tamanho** ao passar o cursor, selecionar uma aba ou trocar uma
  conversa. Todo conteúdo que troca fica num `ReservaAltura` (ou numa grade com
  todas as variantes na mesma célula). Teste em 1440, 1024 e 390.
- **Nenhum botão morto.** Na demonstração, a navegação roda com `vitrine`: os
  cartões só mostram as ações que fazem algo ali, e os que levariam a outra tela
  somem.
- **O chat se comporta como um chat real.** As mensagens escrevem a partir de
  `escreverDesde`; abrir uma conversa depois não toca tudo de novo.
- **Sem corte seco** entre seções: as faixas se fundem por gradiente, e o hero
  nunca reinicia a animação.
- **O texto é genérico de empresa** na principal; o de área fica nas páginas de
  plataforma.
- Nada inventado: sem clientes, números de uso ou depoimentos.

## Testes

`app/scripts/site-demo.cjs` percorre a demonstração guiada (Playwright). `app/scripts/site-cortes.cjs` mede cada texto contra a caixa que o recorta e contra a tela, em todas as páginas, em 360, 390, 768, 1024 e 1440 px e com cada aba clicada; rode antes de publicar. Sirva o
site numa porta e rode o script com uma pasta para as capturas (ver o
comentário no topo do arquivo).
