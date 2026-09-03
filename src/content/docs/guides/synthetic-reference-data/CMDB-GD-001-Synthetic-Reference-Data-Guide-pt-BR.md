# Guia CMDB — criação e preservação de dados sintéticos de referência

[English](./CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md) | **Português (Brasil)**

**Universidade Federal de Pernambuco (UFPE)**  
**Centro de Tecnologia e Geociências (CTG)**  
**Pós-Graduação Lato Sensu em Segurança Ofensiva e Inteligência Cibernética**  
**Caatinga Malware DB (CMDB)**

## Controle do documento

| Campo | Valor |
|---|---|
| Identificador | `CMDB-GD-001` |
| Versão | `0.1.0` |
| Estado | Rascunho |
| Data | 2026-09-01 |
| Idioma | Português brasileiro (`pt-BR`) |

## Autoria e contribuição

**Autor:** Romário J. O. Veloso  
**Afiliação:** Bacharelando em Engenharia Eletrônica, Universidade Federal de Pernambuco (UFPE), Recife — PE, Brasil.  
**Contribuição:** concepção do procedimento experimental, sistematização das práticas de preservação e redação inicial.  
**ORCID e e-mail institucional:** não informados.

### Citação sugerida

VELOSO, Romário J. O. *Guia CMDB — criação e preservação de dados sintéticos de referência*. Recife: Universidade Federal de Pernambuco, 2026. Versão 0.1.0. Documento em elaboração.

## Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | Primeira versão editorial baseada nas anotações de laboratório. |

## Sumário

1. [Finalidade, escopo e público](#1-finalidade-escopo-e-público)
2. [Aviso de segurança](#2-aviso-de-segurança)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Termos utilizados](#4-termos-utilizados)
5. [Planejamento do arquivo de referência](#5-planejamento-do-arquivo-de-referência)
6. [Procedimento no GNU/Linux](#6-procedimento-no-gnulinux)
7. [Validação e critérios de aceitação](#7-validação-e-critérios-de-aceitação)
8. [Limitações](#8-limitações)
9. [Registro de evidências](#9-registro-de-evidências)
10. [Solução de problemas](#10-solução-de-problemas)
11. [Referências](#11-referências)
12. [Validação editorial](#12-validação-editorial)

## 1. Finalidade, escopo e público

Este guia descreve como criar, identificar e preservar um **arquivo de referência íntegro**, também chamado de original conhecido, para avaliar posteriormente se um processo de recuperação restaurou o mesmo conteúdo byte a byte.

O procedimento destina-se a estudantes, pesquisadores e revisores que trabalham em laboratórios acadêmicos autorizados. Ele abrange a criação de dados sintéticos, o registro de tamanho e SHA-256 e a preservação de uma cópia confiável. A criação da mídia ISO é tratada separadamente no [Guia CMDB de criação e validação de mídia ISO](../iso-media/CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md).

O guia não ensina a obter ou executar malware, desabilitar controles de segurança, contornar detecções ou operar um descriptografador específico. Essas atividades exigem protocolo próprio, autorização institucional e supervisão adequada.

## 2. Aviso de segurança

Os comandos deste documento criam apenas dados sintéticos e arquivos de apoio. Quando o arquivo de referência for empregado em um estudo com software malicioso:

- utilize infraestrutura dedicada, isolada e formalmente autorizada;
- mantenha a cópia preservada fora da máquina virtual analisada e de qualquer caminho compartilhado com ela;
- desative pastas compartilhadas, área de transferência, arrastar e soltar e dispositivos USB entre host e convidado;
- defina a conectividade de rede conforme o protocolo do laboratório, sem presumir que uma rede virtual seja segura;
- mantenha snapshot anterior ao experimento, sem tratá-lo como substituto de backup; e
- considere todo artefato proveniente da máquina comprometida como não confiável.

## 3. Pré-requisitos

- host GNU/Linux confiável e fora do ambiente comprometido;
- diretório de trabalho que não seja compartilhado com a máquina virtual;
- espaço livre compatível com o arquivo, suas cópias e os snapshots;
- GNU Coreutils, incluindo `dd`, `stat` e `sha256sum`;
- GNU Findutils, para o inventário da área de preparação; e
- `zip`, somente se o arquivo precisar ser empacotado.

Instale dependências apenas pelo procedimento aprovado para o host. Este guia não fornece comandos de instalação nem orienta downloads.

Antes de criar arquivos grandes, confira o espaço do volume atual:

```bash
df -h -- .
```

## 4. Termos utilizados

| Termo | Definição |
|---|---|
| Arquivo de referência | Arquivo íntegro e conhecido utilizado como base da comparação. Não é uma amostra de malware. |
| Cópia preservada | Instância mantida no host confiável, sem exposição ao convidado comprometido. |
| Cópia de trabalho | Instância verificada destinada ao ambiente experimental. |
| Manifesto SHA-256 | Arquivo textual que associa um resumo SHA-256 ao nome do objeto verificado. |
| Host | Sistema que executa a plataforma de virtualização. |
| Convidado | Máquina virtual usada no experimento. |

## 5. Planejamento do arquivo de referência

Escolha o tamanho e o formato conforme a pergunta experimental. Um único arquivo grande não representa o comportamento observado em arquivos pequenos, formatos diferentes ou outras extensões. Quando pertinente, use um conjunto sintético com tamanhos e formatos variados e registre cada item separadamente.

O exemplo principal deste guia cria 64 MiB, suficientes para validar o fluxo sem consumo excessivo. O tamanho de 4,5 GiB é apresentado apenas como opção para estudos que tenham justificativa técnica específica.

Dados produzidos por `/dev/urandom` são pouco compressíveis, mas cada execução gera conteúdo diferente. O SHA-256 e a preservação do original são, portanto, indispensáveis; o arquivo não poderá ser recriado posteriormente a partir do comando.

Um objeto com mais de 4 GiB pode exigir ZIP64 e ferramentas compatíveis. Um experimento de 4,5 GiB também pode consumir espaço várias vezes maior ao considerar o binário, o ZIP, cópias e snapshots.

## 6. Procedimento no GNU/Linux

### 6.1 Preparar diretórios dedicados

Execute os comandos em um local previamente conferido e que não esteja exposto à máquina virtual:

```bash
mkdir -p -- cmdb-reference-lab/build
mkdir -p -- cmdb-reference-lab/preserved
mkdir -p -- cmdb-reference-lab/staging/data
cd -- cmdb-reference-lab/build
```

A pasta `preserved` oferece separação do fluxo experimental, mas uma cópia no mesmo disco não constitui backup independente. Use armazenamento protegido adicional quando a política do laboratório exigir preservação contra falha ou adulteração.

### 6.2 Gerar dados sintéticos

Exemplo recomendado de 64 MiB:

```bash
dd if=/dev/urandom of=reference-file.bin bs=1M count=64 status=progress
```

Exemplo opcional de aproximadamente 4,5 GiB:

```bash
dd if=/dev/urandom of=reference-file.bin bs=1M count=4608 status=progress
```

Use o segundo comando somente após justificar o tamanho e conferir armazenamento, tempo de entrada e saída e compatibilidade das ferramentas.

### 6.3 Registrar tamanho e SHA-256

```bash
stat --format='%n	%s bytes' -- reference-file.bin
sha256sum -- reference-file.bin > reference-file.bin.sha256
sha256sum --check --strict -- reference-file.bin.sha256
```

O operador `>` substitui um manifesto de mesmo nome. Trabalhe em um diretório novo ou confirme previamente que nenhum registro anterior será perdido.

Registre também data e hora em UTC, sistema operacional e versões das ferramentas. Calcule o hash apenas depois que a gravação do arquivo tiver terminado.

### 6.4 Empacotar sem compressão, quando necessário

O empacotamento é opcional. Se o ZIP for o objeto efetivamente submetido ao experimento, ele passa a ser o objeto de referência e deve receber registro próprio:

```bash
zip -0 reference-file.zip reference-file.bin
zip -T reference-file.zip
sha256sum -- reference-file.zip > reference-file.zip.sha256
sha256sum --check --strict -- reference-file.zip.sha256
```

A opção `-0` armazena o conteúdo sem compressão. O teste feito por `zip -T` verifica a estrutura do arquivo ZIP, mas não substitui a comparação SHA-256 com o objeto preservado.

### 6.5 Preservar o objeto conhecido

O exemplo abaixo considera que o ZIP é o objeto escolhido. Se o estudo usar o arquivo binário diretamente, substitua os nomes de forma consistente.

```bash
cp -- reference-file.zip ../preserved/
cp -- reference-file.zip.sha256 ../preserved/
(cd ../preserved && sha256sum --check --strict -- reference-file.zip.sha256)
```

Não renomeie a cópia preservada sem atualizar o registro. O manifesto gerado pelo GNU `sha256sum` contém o nome do arquivo e é resolvido a partir do diretório em que a verificação ocorre.

### 6.6 Criar e verificar a cópia de trabalho

```bash
cp -- ../preserved/reference-file.zip ../staging/data/
cp -- ../preserved/reference-file.zip.sha256 ../staging/data/
(cd ../staging/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Somente a cópia de trabalho deve ser apresentada à máquina virtual. A cópia preservada permanece fora do alcance do convidado.


## 7. Validação e critérios de aceitação

O preparo está completo somente quando:

- tamanho exato e SHA-256 do objeto de referência foram registrados;
- o manifesto valida a cópia preservada;
- o manifesto valida a cópia de trabalho;
- a cópia preservada permanece fora de compartilhamentos com o convidado;
- origem, data, ferramentas e responsáveis foram documentados; e
- o snapshot e os controles de isolamento foram revisados.

Para transportar a cópia por mídia óptica virtual, prossiga no [Guia CMDB de criação e validação de mídia ISO](../iso-media/CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md). Após um experimento, valide o resultado conforme o [Guia CMDB de validação de recuperação com SHA-256](../sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-pt-BR.md).

## 8. Limitações

- O SHA-256 demonstra consistência do conteúdo comparado, mas não autentica sua origem por si só.
- Arquivo e manifesto podem ser adulterados em conjunto; use armazenamento protegido ou assinatura digital quando autenticidade for necessária.
- Dados aleatórios não reproduzem a estrutura interna de documentos, bancos de dados ou formatos multimídia.
- Um único tamanho, formato ou nome não permite generalizar o comportamento de criptografia ou recuperação.
- Um ZIP recriado pode ter conteúdo lógico equivalente e hash diferente por causa de metadados ou ordem das entradas.
- Arquivos acima de 4 GiB podem depender de ZIP64 e de suporte adequado no sistema convidado.
- Snapshots facilitam reversão do convidado, mas não substituem backup nem contenção.
- Objetos recuperados continuam não confiáveis até validação em ambiente limpo e isolado.

## 9. Registro de evidências

Preencha um registro para cada objeto:

| Campo | Registro |
|---|---|
| Identificador do experimento |  |
| Responsável |  |
| Data e hora em UTC |  |
| Sistema e versão |  |
| Ferramentas e versões |  |
| Nome do arquivo de referência |  |
| Tamanho exato em bytes |  |
| SHA-256 do arquivo de referência |  |
| Local protegido da cópia preservada |  |
| SHA-256 da cópia de trabalho |  |
| Controles de isolamento conferidos |  |
| Observações e limitações |  |

Não publique caminhos pessoais, credenciais, dados sensíveis ou informações que identifiquem vítimas.

## 10. Solução de problemas

### Espaço insuficiente

Interrompa o preparo, preserve os registros existentes e escolha tamanho menor ou volume autorizado com capacidade suficiente. Não apague evidências para liberar espaço durante um experimento ativo.

### ZIP incompatível ou maior que 4 GiB

Confirme suporte a ZIP64 em todas as ferramentas. Se o empacotamento não fizer parte da pergunta experimental, considere usar diretamente o arquivo binário ou um conjunto menor.

### Manifesto informa arquivo ausente

Execute a verificação no diretório que contém o arquivo com o nome registrado. Renomear ou mover apenas um dos dois objetos invalida a resolução do manifesto.

### Hash diferente após uma cópia

Não prossiga. Repita a cópia a partir da referência preservada, confira armazenamento e registre a ocorrência. Não substitua o hash esperado pelo novo valor sem investigar a diferença.

## 11. Referências

- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Disponível em: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Acesso em: 1 set. 2026.
- FREE SOFTWARE FOUNDATION. *GNU Coreutils: dd invocation*. Disponível em: <https://www.gnu.org/software/coreutils/manual/html_node/dd-invocation.html>. Acesso em: 1 set. 2026.
- NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. *Secure Hash Standard (SHS)*. FIPS PUB 180-4. Gaithersburg, 2015. Disponível em: <https://doi.org/10.6028/NIST.FIPS.180-4>. Acesso em: 1 set. 2026.
- CAATINGA MALWARE DB. [Padrão editorial e catálogo de guias](../CMDB-Reports-Guide-pt-BR.md).

## 12. Validação editorial

| Papel | Nome | Situação | Data/versão validada |
|---|---|---|---|
| Autor | Romário J. O. Veloso | Pendente de assinatura | — |
| Revisor técnico | A definir | Pendente | — |
| Aprovação editorial | A definir | Pendente | — |

As assinaturas devem ser registradas apenas após a revisão técnica e editorial da versão destinada à publicação.
