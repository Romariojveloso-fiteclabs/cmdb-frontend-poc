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

A aplicação estará disponível, por padrão, em `http://localhost:4321`.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

Os arquivos estáticos serão gerados no diretório `dist/`.

## Publicação

O projeto pode ser publicado em serviços de hospedagem estática, como Cloudflare Pages ou GitHub Pages. Para Cloudflare Pages, use:

```text
Build command: npm run build
Output directory: dist
```

## Aviso de segurança

Este frontend deve publicar somente conteúdo acadêmico e defensivo, como relatórios, hashes, indicadores e imagens. Não disponibilize amostras executáveis ou pacotes de malware em hospedagens públicas.

## Status

Projeto em estágio de prova de conceito, sujeito a mudanças.
