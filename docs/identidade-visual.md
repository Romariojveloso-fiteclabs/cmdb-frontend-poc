# Referências visuais da UFPE

Inspeção realizada em 4 de setembro de 2026 com o MCP do Playwright: navegação nos dois sites, capturas de tela e leitura de estilos computados com `getComputedStyle`, incluindo o pseudo-elemento `::after` e o SVG do cabeçalho do portal UFPE.

A composição do CMDB foi ajustada em 5 de setembro de 2026: o grafite ocupa a apresentação principal, e o vermelho aparece em áreas menores, no cabeçalho, rodapé e ações. A escolha adapta as referências à preferência do projeto por uma interface menos dominada pelo vermelho.

## Cores observadas

Estes valores foram extraídos das páginas em uso. Não representam uma especificação de um manual oficial de marca.

| Referência | Cor | Elemento observado | Aplicação no CMDB |
| --- | --- | --- | --- |
| [Portal UFPE](https://www.ufpe.br/) | Base `#830D1A`; facetas de `#790C18` a `#910E1D` | SVG do cabeçalho, identificado na inspeção de `::after` | Referência geométrica; as facetas do CMDB são translúcidas e usam as bases descritas abaixo |
| [Portal UFPE](https://www.ufpe.br/) | `#548CBA` | Links | Detalhes azuis e referência para os tons de texto e tabelas |
| [Portal UFPE](https://www.ufpe.br/) | `rgba(255, 255, 255, .15)` / `#E4E4E4` | Fundo translúcido e borda da busca | Busca sobre grafite e navegação ativa sobre vermelho |
| [Portal UFPE](https://www.ufpe.br/) | `#551B26` / `#780C18` | Blocos de acesso rápido e destaque do carrossel | Cabeçalho e rodapé nos temas escuro e claro, respectivamente |
| [Segurança — extensão](https://sites.ufpe.br/seguranca-extensao/) | `#B51223` | Botão `.btn-chamado` | Ação principal da apresentação, ações gerais do tema claro e faixas institucionais |
| [Segurança — extensão](https://sites.ufpe.br/seguranca-extensao/) | `#242020` | Menu `.navbar.bg-dark` | Apresentação do tema claro e blocos de código |
| [Segurança — extensão](https://sites.ufpe.br/seguranca-extensao/) | `#FAFAFA` | Fundo do `body` | Fundo geral do tema claro |
| [Segurança — extensão](https://sites.ufpe.br/seguranca-extensao/) | `#2B2B2B` / `#595959` | Títulos e texto | Texto principal e secundário |

O cabeçalho da UFPE combina uma imagem geométrica com camadas do layout. Os valores do SVG não descrevem sozinhos cada pixel da captura. No CMDB, a distribuição das cores e a conversão das facetas em polígonos translúcidos são adaptações de composição.

## Adaptação da paleta

| Uso | Tema claro | Tema escuro |
| --- | --- | --- |
| Cabeçalho e rodapé | `#780C18` | `#551B26` |
| Apresentação | `#242020` com facetas translúcidas | `#191617` com facetas translúcidas |
| Texto da apresentação | Branco `#FFFFFF`; secundário `#E6E4E4` | Branco `#FFFFFF`; secundário `#E6E4E4` |
| Bordas da apresentação | `#958B8E` | `#958B8E` |
| Ação principal da apresentação | `#B51223`, com texto branco; hover `#780C18` | `#B51223`, com texto branco; hover `#780C18` |
| Links e texto informativo | `#336B98`; variante forte e hover `#285477` | `#92BDDF`; variante forte `#BCDCF4` |
| Fundo informativo | `#EAF2F8` | `#1F3547` |
| Cabeçalhos de tabelas | `#336B98`, com texto branco | `#203C53`, com texto branco |

O azul observado no portal, `#548CBA`, permanece nos detalhes visuais. Os tons de texto são adaptações para legibilidade: esse azul original oferece aproximadamente 3,60:1 sobre branco, abaixo de 4,5:1 para texto de tamanho normal.

A navegação ativa e o campo de busca usam branco com 15% de opacidade sobre seus respectivos fundos. O botão de busca tem fundo transparente e texto branco, independente do botão vermelho da apresentação. As demais ações principais preservam a escala vermelha existente no tema claro e suas variantes para o tema escuro.

## Composição e tipografia

- Open Sans, encontrada nos dois sites, é a fonte da interface. IBM Plex Mono e Source Serif 4 continuam nos identificadores técnicos e títulos editoriais do CMDB.
- O arquivo local `src/assets/ufpe-header-facets.svg` aproveita a geometria do SVG do portal, convertendo suas cores em polígonos translúcidos sobre a base do CMDB. Não há dependência de imagens remotas para esse efeito.
- A marca Caatinga mantém sua arte original, com verde e terracota, em um cartão exclusivo sobre fundo branco. A identificação da UFPE permanece nos textos da interface e no rodapé.
- Verde para sucesso e dourado para alertas preservam a distinção dos estados. O vermelho institucional tem variáveis próprias, independentes da cor de erro.
- O rodapé mantém o site do grupo e inclui um acesso ao projeto de extensão fornecido como referência.

## Manutenção dos temas

Os valores estão centralizados em `src/styles/global.css`. A tabela de referências acima distingue cores observadas de adaptações. A escala `--primary-*`, os azuis para texto, os tons claros e as variantes do tema escuro são adaptações para a interface do CMDB.

As cores de cabeçalho, apresentação, busca e tabelas têm responsabilidades separadas, permitindo ajustar a identidade sem aplicar o mesmo fundo a todos os componentes.

No modo escuro, superfícies em grafite recebem texto claro e as ações gerais mantêm rosa suave (`#F0A0AA`). Cabeçalho e rodapé usam vinho `#551B26`; a apresentação usa grafite `#191617`. O cartão da marca Caatinga permanece branco, apenas com a logo, para preservar sua legibilidade.

As cores da barra do navegador e do aplicativo instalado acompanham o cabeçalho em `AppLayout.astro`, `AppContainer.tsx` e `public/manifest.webmanifest`.

## Verificação

Os cálculos de luminância relativa dão contraste de aproximadamente **5,68:1** para `#336B98` sobre branco, **16,12:1** para branco sobre a apresentação `#242020`, **11,26:1** para branco sobre o cabeçalho `#780C18` e **6,83:1** para branco sobre o botão `#B51223`. São cálculos desses pares sólidos, não uma auditoria completa de acessibilidade nem uma medição de todos os estados renderizados.
