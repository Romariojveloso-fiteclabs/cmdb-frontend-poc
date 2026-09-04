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

A aplicação estará disponível em `http://localhost:4321/`. O prefixo
`/cmdb-frontend-poc/` é aplicado apenas ao build destinado ao GitHub Pages.

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

## Rotas e descoberta automática

O build gera páginas estáticas compatíveis com acesso direto no GitHub Pages. As principais rotas são:

```text
/explorar/
/inventario/
/familias/<familia>/
/familias/<familia>/relatorios/<relatorio>/
/guias/
/guias/<guia>/
/modelos/
/seguranca/
/contribuir/
```

Famílias, relatórios e guias não precisam ser cadastrados manualmente no roteador:

- um diretório em `src/content/docs/reports/<familia>/` gera a rota da família;
- cada relatório Markdown dentro dele gera sua própria rota;
- cada Markdown em `src/content/docs/guides/` gera uma rota de guia;
- identificadores `CMDB-TR-000`, `CMDB-PR-000` e `CMDB-GD-000` são usados como slug quando existirem;
- quando o documento não declara um identificador, o nome do arquivo é convertido em um slug estável.

As novas rotas são criadas automaticamente pelo próximo `npm run build`. Busca, filtros, visualização e paginação também são gravados na URL para permitir o compartilhamento do estado atual das tabelas.

## Aplicativo mobile (PWA)

O site é responsivo e pode ser instalado como aplicativo em navegadores compatíveis. No Android ou em navegadores Chromium, use a opção **Instalar** exibida na tela. No iPhone e no iPad, o próprio aviso apresenta o caminho para **Adicionar à Tela de Início**.

O PWA inclui manifest, ícones próprios e um service worker com suporte offline para a interface e para os recursos já visitados. A instalação e o cache offline exigem HTTPS, fornecido automaticamente pelo GitHub Pages.

## Aviso de segurança

Este frontend publica somente conteúdo acadêmico e defensivo, como relatórios, hashes, indicadores e imagens. O processo de build remove arquivos ZIP do diretório de publicação para impedir a disponibilização de amostras executáveis ou pacotes de malware no GitHub Pages.

## Status

Projeto em estágio de prova de conceito, sujeito a mudanças.
