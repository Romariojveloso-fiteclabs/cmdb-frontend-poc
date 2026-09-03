# Guia CMDB — criação e validação de mídia ISO de dados

[English](./CMDB-GD-004-ISO-Data-Media-Guide-EN.md) | **Português (Brasil)**

**Universidade Federal de Pernambuco (UFPE)**  
**Centro de Tecnologia e Geociências (CTG)**  
**Pós-Graduação Lato Sensu em Segurança Ofensiva e Inteligência Cibernética**  
**Caatinga Malware DB (CMDB)**

## Controle do documento

| Campo | Valor |
|---|---|
| Identificador | `CMDB-GD-004` |
| Versão | `0.1.0` |
| Estado | Rascunho |
| Data | 2026-09-01 |
| Idioma | Português brasileiro (`pt-BR`) |

## Autoria e contribuição

**Autor:** Romário J. O. Veloso  
**Afiliação:** Bacharelando em Engenharia Eletrônica, Universidade Federal de Pernambuco (UFPE), Recife — PE, Brasil.  
**Contribuição:** concepção do procedimento experimental, registro das limitações observadas e redação inicial.  
**ORCID e e-mail institucional:** não informados.

### Citação sugerida

VELOSO, Romário J. O. *Guia CMDB — criação e validação de mídia ISO de dados*. Recife: Universidade Federal de Pernambuco, 2026. Versão 0.1.0. Documento em elaboração.

## Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | Separação do procedimento de mídia ISO do guia de dados sintéticos. |

## Sumário

1. [Finalidade, escopo e público](#1-finalidade-escopo-e-público)
2. [Aviso de segurança](#2-aviso-de-segurança)
3. [Pré-requisitos e entradas](#3-pré-requisitos-e-entradas)
4. [Preparação da área de mídia](#4-preparação-da-área-de-mídia)
5. [Criação e identificação da ISO](#5-criação-e-identificação-da-iso)
6. [Validação do conteúdo](#6-validação-do-conteúdo)
7. [Apresentação à máquina virtual](#7-apresentação-à-máquina-virtual)
8. [Critérios de aceitação](#8-critérios-de-aceitação)
9. [Limitações e solução de problemas](#9-limitações-e-solução-de-problemas)
10. [Registro de evidências](#10-registro-de-evidências)
11. [Referências](#11-referências)
12. [Validação editorial](#12-validação-editorial)

## 1. Finalidade, escopo e público

Este guia descreve como preparar, criar, identificar e validar uma ISO de dados destinada a transportar uma **cópia de trabalho previamente verificada** para uma máquina virtual de laboratório.

A criação do conteúdo sintético não faz parte deste procedimento. Prepare e preserve o material conforme o [Guia CMDB de criação e preservação de dados sintéticos](../synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md) antes de iniciar.

O documento não ensina a obter ou executar malware. A ISO deve conter apenas dados e manifestos necessários ao ensaio. Ferramentas e instaladores, quando indispensáveis, devem usar mídia separada e possuir fonte, versão, assinatura e SHA-256 registrados.

## 2. Aviso de segurança

Uma ISO montada como unidade óptica reduz a possibilidade de escrita acidental no meio apresentado ao convidado, mas não torna a máquina virtual segura. Ela não impede escape da virtualização, exfiltração, erro de configuração ou comprometimento do host.

- produza e valide a ISO em um host confiável;
- não inclua credenciais, documentos pessoais ou diretórios amplos;
- mantenha a cópia preservada fora de qualquer compartilhamento com o convidado;
- desative integrações host–convidado não necessárias;
- registre a configuração de rede e o snapshot; e
- trate qualquer arquivo copiado de volta do convidado como não confiável.

## 3. Pré-requisitos e entradas

- host GNU/Linux confiável;
- `xorriso`, `sha256sum` e utilitários de montagem aprovados pelo laboratório;
- espaço para a árvore de preparação, a ISO e seus registros;
- cópia de trabalho validada;
- manifesto SHA-256 correspondente; e
- sistema convidado compatível com o nível ISO e o tamanho dos arquivos.

O exemplo considera esta organização:

```text
cmdb-reference-lab/
├── staging/
│   └── data/
│       ├── reference-file.zip
│       └── reference-file.zip.sha256
└── preserved/
    ├── reference-file.zip
    └── reference-file.zip.sha256
```

Adapte os nomes, mas não use a cópia preservada como entrada direta da ISO.

## 4. Preparação da área de mídia

Entre no diretório do experimento e confira explicitamente cada arquivo que será incorporado:

```bash
cd -- cmdb-reference-lab
find staging -type f -printf '%P\t%s bytes\n'
(cd staging/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Não use `.` ou um diretório amplo como origem sem inventário prévio. Isso pode incorporar arquivos ocultos, credenciais ou outros objetos não previstos.

## 5. Criação e identificação da ISO

Crie a imagem com `xorriso` em modo compatível com `mkisofs`:

```bash
xorriso -as mkisofs \
  -o reference-data.iso \
  -iso-level 3 \
  -J \
  -R \
  staging/
```

Em seguida, registre e verifique o SHA-256 da própria ISO:

```bash
sha256sum -- reference-data.iso > reference-data.iso.sha256
sha256sum --check --strict -- reference-data.iso.sha256
```

O nível ISO 9660 deve ser compatível com o tamanho dos objetos e com o convidado. No ensaio que originou este guia, uma invocação específica de `genisoimage` recusou um arquivo maior que 4 GiB e `xorriso` produziu a imagem. Essa observação não demonstra uma limitação universal de `genisoimage`, de todos os níveis ISO ou de todas as versões.

## 6. Validação do conteúdo

Liste a árvore gravada:

```bash
xorriso -indev reference-data.iso -ls /
```

A listagem confirma nomes, não a integridade dos bytes. Monte a ISO somente leitura em um ambiente limpo e valide novamente o manifesto. O ponto de montagem varia; no exemplo abaixo, ele é `/media/iso`:

```bash
(cd /media/iso/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Não prossiga se a verificação falhar. Refaça a cópia de trabalho a partir da referência preservada, investigue a diferença e gere uma nova ISO com outro nome ou versão de evidência.

## 7. Apresentação à máquina virtual

Anexe `reference-data.iso` como unidade óptica virtual. Confirme na configuração do hipervisor que a mídia não oferece um caminho de escrita para o host.

Antes do ensaio:

1. registre o nome e o SHA-256 da ISO montada;
2. confirme visualmente os arquivos apresentados;
3. copie somente a cópia de trabalho para o disco interno do convidado;
4. calcule o SHA-256 da cópia no convidado, quando a ferramenta estiver disponível; e
5. mantenha a cópia preservada inacessível ao convidado.

Não execute o ensaio diretamente sobre a ISO. Ela é um meio de transporte e preservação da entrada, não a área de trabalho do experimento.

## 8. Critérios de aceitação

A mídia está pronta somente quando:

- a área de preparação foi inventariada;
- o manifesto valida a cópia de trabalho antes da criação;
- o SHA-256 da ISO foi registrado e confirmado;
- o conteúdo montado valida contra o manifesto;
- compatibilidade com o convidado foi verificada;
- a cópia preservada permanece separada; e
- ferramenta, versão, data, operador e limitações foram registrados.

## 9. Limitações e solução de problemas

### Arquivo maior que 4 GiB

Tamanho superior a 4 GiB exige combinação compatível de nível ISO, gerador e leitor. Não atribua toda falha ao formato ISO; registre o comando, versão, mensagem completa e sistema de arquivos de origem.

### A ISO lista o arquivo, mas o manifesto falha

A listagem não verifica os bytes. Interrompa o fluxo, compare a cópia de trabalho com a preservada e gere novamente a mídia.

### O convidado não lê a mídia

Teste a ISO em ambiente limpo e verifique a compatibilidade do nível ISO e das extensões usadas. Não reduza o tamanho, renomeie ou reconstrua o objeto sem criar novo registro de evidência.

### A mídia é somente leitura, mas a VM continua exposta

Esse comportamento é esperado: somente leitura é uma propriedade do meio apresentado, não um mecanismo completo de contenção.

## 10. Registro de evidências

| Campo | Registro |
|---|---|
| Identificador do experimento |  |
| Responsável e data/hora UTC |  |
| Ferramenta, versão e comando |  |
| Inventário da área de preparação |  |
| SHA-256 da cópia de trabalho |  |
| Nome, tamanho e SHA-256 da ISO |  |
| Resultado da validação da mídia montada |  |
| Hipervisor e configuração da unidade |  |
| Sistema convidado e compatibilidade |  |
| Limitações e ocorrências |  |

## 11. Referências

- GNU PROJECT. *xorriso*. Disponível em: <https://www.gnu.org/software/xorriso/xorriso.html>. Acesso em: 1 set. 2026.
- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Disponível em: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Acesso em: 1 set. 2026.
- CAATINGA MALWARE DB. [Padrão editorial e catálogo de guias](../CMDB-Reports-Guide-pt-BR.md).

## 12. Validação editorial

| Papel | Nome | Situação | Data/versão validada |
|---|---|---|---|
| Autor | Romário J. O. Veloso | Pendente de assinatura | — |
| Revisor técnico | A definir | Pendente | — |
| Aprovação editorial | A definir | Pendente | — |

