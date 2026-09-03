# CMDB Frontend PoC

Prova de conceito da interface web do **Caatinga Malware DB (CMDB)**, um acervo acadêmico de relatórios, evidências e materiais sobre análise de malware.

## Tecnologias

- Astro
- React
- TypeScript

## Executar localmente

Requisitos: Node.js 22 ou superior e npm.

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:4321/cmdb-frontend-poc/`.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

Os arquivos estáticos serão gerados no diretório `dist/`.

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy.yml` gera e publica o site automaticamente após cada push na branch `main`.

No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** em **Source**. O site será publicado em:

```text
https://romariojveloso-fiteclabs.github.io/cmdb-frontend-poc/
```

Os caminhos de recursos respeitam o prefixo `/cmdb-frontend-poc`, configurado em `astro.config.mjs`.

## Aviso de segurança

Este frontend publica somente conteúdo acadêmico e defensivo, como relatórios, hashes, indicadores e imagens. O processo de build remove arquivos ZIP do diretório de publicação para impedir a disponibilização de amostras executáveis ou pacotes de malware no GitHub Pages.

## Status

Projeto em estágio de prova de conceito, sujeito a mudanças.
