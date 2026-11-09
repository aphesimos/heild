# gh-pages

Build estático do site da Heild, servido pelo GitHub Pages. Não edite aqui: o código do site mora no branch `site` (`app/src/site/`).

Para atualizar, a partir do branch `site`:

```bash
cd app
npm install
npx vite build -c vite.site.config.ts --base ./ --outDir ../../heild-pages --emptyOutDir
```

Depois copie o conteúdo para este branch, com `site.html` renomeado para `index.html`, mantenha o `.nojekyll` e faça o commit.
