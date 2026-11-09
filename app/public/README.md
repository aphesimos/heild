# public/: as peças da marca, geradas

`diretrizes.html`, `inteiro.html` e `fontes/` não se editam à mão. São gerados por
`apresentacoes/build.py --site` no branch `claude/zealous-wright-fvok37`, a partir do commit
`44b0fc8`:

```bash
python3 apresentacoes/build.py --site <caminho do branch site>/app/public
```

Para mudar as diretrizes da marca ou o "Do inteiro", mude as peças lá
(`apresentacoes/diretrizes-web/` e `apresentacoes/inteiro/`), gere de novo e atualize o commit
acima. O tema das diretrizes é o do site (a chave `heild-tema`), extraído para
`apresentacoes/comum/tema.js` e `tema.css`: mudou o `BotaoTema`, o `trocarModo` ou `tema.css`
aqui no site, leve a mudança para lá.

O Vite copia esta pasta como está para o build (com o `favicon.svg`, que é daqui); este README
fica de fora (`vite.site.config.ts`).
