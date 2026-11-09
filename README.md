# gh-pages

Build estático do site da Heild, servido pelo GitHub Pages. Não edite aqui: o código do site mora no branch `site` (`app/src/site/`).

Para atualizar, a partir do branch `site`:

```bash
cd app
npm install
npx vite build -c vite.site.config.ts --base ./ --outDir ../../heild-pages --emptyOutDir
```

Depois copie o conteúdo para este branch, com `site.html` renomeado para `index.html`, mantenha o `.nojekyll` e faça o commit.

O build já traz as duas peças da marca, que o Vite copia de `app/public/`: `diretrizes.html` (as diretrizes da marca), `inteiro.html` (Do inteiro) e as fontes delas em `fontes/`. Elas vêm de `apresentacoes/build.py --site`; confira que as três chegam junto com o `index.html`.
