# Apresentação de produto da Heild

A apresentação de marca e de produto da Heild, animada e interativa, num HTML só. Funciona como o site: uma versão principal, genérica, e uma versão por plataforma, todas montadas no mesmo molde.

| Versão | Endereço | O que tem |
|---|---|---|
| Heild | `#principal` (padrão) | A marca inteira (nome, logo, formas, movimento, areia, claro e escuro, tipografia, voz), o time, o cartão de aprovação, o Consultor, os módulos, as plataformas, conectores, marca branca e princípios |
| Heild Contábil | `#contabil` | O escritório contábil: Painel por setor, CRM, Timesheet, Financeiro, app do cliente, e um slide da Heild BPO por cima |
| Heild BPO | `#bpo` | Só o BPO financeiro: as três regras, gestão por exceção, o cliente no WhatsApp, a aprovação do lote no app, os ERPs |

`#contabil-7` abre a versão Contábil no slide 7. O menu de versões fica nos controles do canto (tecla V).

## Atalhos

| Tecla | O que faz |
|---|---|
| → ↓ espaço PageDown Enter | Avança (o próximo passo ou o próximo slide) |
| ← ↑ PageUp Backspace | Volta |
| Home / End | Primeiro / último slide |
| número + Enter | Vai para o slide |
| O | Visão geral, por capítulo |
| V | Escolhe a versão |
| T | Troca claro e escuro (em onda, como no site) |
| N | Notas do apresentador |
| R | Repete a cena do slide |
| F | Tela cheia |

No toque, arraste para os lados. Os controles somem com o mouse parado.

## Montar

```bash
git fetch origin design-system prototipo
python3 apresentacoes/build.py produto
```

Gera `apresentacoes/dist/heild-produto.html` (fora do git), que abre direto no navegador, sem internet. As fontes PP Neue Montreal e o `<heild-logo>` vêm do branch `design-system`; o `<orb-avatar>`, da cópia do protótipo (branch `prototipo`). Nada disso é copiado para cá: cada build pega a versão atual.

## Arquivos

| Caminho | O que é |
|---|---|
| `src/dados.js` | O conteúdo: integrantes, formas do I, plataformas, o molde de uma versão de plataforma e a versão principal. **É o arquivo que se edita.** |
| `src/slides.js` | Os tipos de slide: cada um desenha o HTML a partir dos dados e liga a sua cena (o que anima, o que responde ao clique) |
| `src/motor.js` | O palco, a navegação, os passos, as versões pelo endereço, a visão geral, as notas e a troca de tema |
| `src/estilo.css` | O estilo de cada tipo de slide (os tokens do design system ficam em `../comum/tokens.css`) |
| `src/modelo.html` | A página, com as marcas que o build preenche |
| `../build.py` | Junta tudo num HTML só (o mesmo build das outras apresentações) |

## Uma área nova (Jurídico, Seguros…)

1. Em `src/dados.js`, copie a entrada `contabil` ou `bpo` dentro de `plataformas`, troque o `id` e preencha. O esqueleto está comentado no fim de `plataformas`.
2. `forma` é a forma do I da logo para a área (`juridico` já existe no `<heild-logo>`; uma forma nova nasce no branch `design-system`).
3. Integrante novo entra em `integrantes`, com a cor do orb como token (`--orb-…`) em `../comum/tokens.css`, e a mesma cor no `design-system/tokens.json`.
4. `recursos` são os slides próprios da área, com os tipos que já existem: `tela` (uma tela do produto com abas), `conversa` (o CRM), `timesheet`, `app` (o app do cliente), `regras`. Um tipo novo é uma entrada a mais em `src/slides.js`.
5. `chamada` é como a área aparece "por cima" na versão de outra; `tambem: ['bpo']` põe a chamada da Heild BPO na versão Contábil.
6. Rode o build. A versão nova entra sozinha no menu, no endereço (`#juridico`) e no slide "Uma Heild para cada operação" da principal.

Peça que a área não tem (por exemplo, sem `lei`) fica de fora; o resto do molde segue igual.

## Regras que a apresentação segue

- O design system do branch `design-system`: areia em camadas, um destaque índigo em pontos pequenos, PP Neue Montreal (títulos no estilo `hero`, 500 e -0,04em; o resto leve), a grade de pontos como chão, claro e escuro desenhados com o mesmo cuidado, os dois seguindo a preferência de quem assiste.
- A logo é sempre o `<heild-logo>`, com uma logo animando por tela, no máximo. A do rodapé nunca anima.
- A cor de um integrante só aparece no orb dele, nos marcadores dele e na luz da abertura e do fecho (como no hero do site).
- Os textos dos integrantes aparecem sendo escritos, a cerca de 55 caracteres por segundo; a passagem entre integrantes leva 1,6 s.
- Com movimento reduzido no sistema, tudo aparece no estado final.
- Nada inventado: as cenas usam os escritórios, empresas e pessoas fictícios da demonstração do protótipo, e os números citados vêm dos planos.
