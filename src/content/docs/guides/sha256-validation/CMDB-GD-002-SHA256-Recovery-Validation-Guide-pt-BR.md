# Guia CMDB — validação de recuperação de arquivos com SHA-256

[English](./CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md) | **Português (Brasil)**

**Universidade Federal de Pernambuco (UFPE)**  
**Centro de Tecnologia e Geociências (CTG)**  
**Pós-Graduação Lato Sensu em Segurança Ofensiva e Inteligência Cibernética**  
**Caatinga Malware DB (CMDB)**

## Controle do documento

| Campo | Valor |
|---|---|
| Identificador | `CMDB-GD-002` |
| Versão | `0.1.0` |
| Estado | Rascunho |
| Data | 2026-09-01 |
| Idioma | Português brasileiro (`pt-BR`) |

## Autoria e contribuição

**Autor:** Romário J. O. Veloso  
**Afiliação:** Bacharelando em Engenharia Eletrônica, Universidade Federal de Pernambuco (UFPE), Recife — PE, Brasil.  
**Contribuição:** definição do fluxo experimental de validação, sistematização dos critérios de resultado e redação inicial.  
**ORCID e e-mail institucional:** não informados.

### Citação sugerida

VELOSO, Romário J. O. *Guia CMDB — validação de recuperação de arquivos com SHA-256*. Recife: Universidade Federal de Pernambuco, 2026. Versão 0.1.0. Documento em elaboração.

## Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | Primeira versão editorial baseada nas anotações de laboratório. |

## Sumário

1. [Finalidade, escopo e público](#1-finalidade-escopo-e-público)
2. [Aviso de segurança](#2-aviso-de-segurança)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Conceitos e objetos comparados](#4-conceitos-e-objetos-comparados)
5. [Registro do SHA-256 de referência](#5-registro-do-sha-256-de-referência)
6. [Validação do arquivo recuperado](#6-validação-do-arquivo-recuperado)
7. [Critérios de classificação](#7-critérios-de-classificação)
8. [Arquivos ZIP e formatos estruturados](#8-arquivos-zip-e-formatos-estruturados)
9. [Comparação parcial e exposição de bytes](#9-comparação-parcial-e-exposição-de-bytes)
10. [Limitações](#10-limitações)
11. [Registro de evidências](#11-registro-de-evidências)
12. [Solução de problemas](#12-solução-de-problemas)
13. [Referências](#13-referências)
14. [Validação editorial](#14-validação-editorial)

## 1. Finalidade, escopo e público

Este guia estabelece um método reproduzível para verificar se um arquivo recuperado corresponde ao arquivo de referência conhecido. O SHA-256 fornece um resumo criptográfico do conteúdo e permite detectar alterações, mesmo quando nome, extensão e tamanho aparente permanecem iguais.

O documento destina-se a estudantes, pesquisadores e revisores que avaliam resultados de ferramentas defensivas ou de recuperação em laboratório autorizado. Ele não orienta a execução de malware nem afirma compatibilidade com uma família específica.

## 2. Aviso de segurança

- Calcule o hash de referência em sistema confiável e antes de qualquer experimento.
- Aguarde o término de gravações e feche aplicações que possam modificar o arquivo.
- Não considere como definitivo um hash calculado apenas dentro de uma máquina comprometida; o sistema pode adulterar arquivo, ferramenta ou saída.
- Trate o arquivo recuperado e o arquivo processado como não confiáveis, mesmo quando possuírem extensão comum.
- Faça a validação final em ambiente limpo, isolado e descartável, seguindo o procedimento institucional de transferência e quarentena.
- Não utilize pastas graváveis compartilhadas com a máquina comprometida para devolver arquivos ao host de uso cotidiano.
- Não abra, visualize ou extraia conteúdo não confiável apenas para calcular seu hash.

Os comandos de hash somente leem os arquivos indicados. Os exemplos que usam `>` criam ou substituem manifestos; confira o caminho e preserve registros anteriores.

## 3. Pré-requisitos

- arquivo de referência íntegro, preservado e identificado;
- arquivo recuperado que será avaliado;
- opcionalmente, artefato processado ou criptografado para documentação;
- ambiente confiável para a validação final;
- tamanho exato dos objetos e data/hora em UTC;
- uma implementação de SHA-256: GNU `sha256sum`, `certutil` compatível ou PowerShell com `Get-FileHash` disponível;
- GNU `cmp`, opcionalmente, para comparação binária adicional; e
- `zip`, opcionalmente, para a verificação estrutural de arquivos ZIP.

Para criar o material conhecido, consulte o [Guia CMDB de criação e preservação de dados sintéticos de referência](../synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md).

## 4. Conceitos e objetos comparados

| Termo | Definição |
|---|---|
| SHA-256 | Função da família SHA-2 que produz um resumo de 256 bits, normalmente representado por 64 caracteres hexadecimais. |
| Integridade | Propriedade avaliada ao verificar se o conteúdo permaneceu inalterado em relação a uma referência. |
| Autenticidade | Confirmação da origem ou autoria. Um hash isolado não a fornece. |
| Igualdade byte a byte | Todos os bytes ocupam os mesmos valores e posições nos dois objetos. |
| Arquivo de referência | Original conhecido preservado antes do experimento. |
| Artefato processado | Resultado produzido pelo evento estudado, como um arquivo criptografado ou alterado. |
| Arquivo recuperado | Saída fornecida pelo processo ou ferramenta de recuperação. |

Registre separadamente, quando existirem:

1. SHA-256 do pacote que contém a amostra analisada;
2. SHA-256 de cada artefato extraído;
3. SHA-256 do arquivo de referência;
4. SHA-256 do artefato processado; e
5. SHA-256 do arquivo recuperado.

Esses valores identificam objetos diferentes e não devem ser intercambiados.

## 5. Registro do SHA-256 de referência

### 5.1 GNU/Linux

No diretório que contém o arquivo estável:

```bash
stat --format='%n	%s bytes' -- reference-file.bin
sha256sum -- reference-file.bin
```

Para criar e conferir um manifesto:

```bash
sha256sum -- reference-file.bin > reference-file.bin.sha256
sha256sum --check --strict -- reference-file.bin.sha256
```

O operador `>` substitui um arquivo de mesmo nome. Use um diretório novo ou confirme que o manifesto anterior já foi preservado.

O manifesto contém o nome do arquivo. Execute a conferência no diretório correspondente e mantenha arquivo e manifesto associados, mas fora do alcance do ambiente comprometido.

### 5.2 Windows 7 com `certutil`

Em um convidado Windows 7 legado, verifique primeiro os parâmetros oferecidos pela instalação local:

```cmd
certutil -?
```

Quando `-hashfile` e SHA-256 estiverem disponíveis:

```cmd
certutil -hashfile "C:\CMDB\reference-file.bin" SHA256
```

Registre a saída completa, a versão do sistema e o comando utilizado. Versões de `certutil` podem oferecer parâmetros diferentes. O resultado produzido dentro de um convidado posteriormente comprometido é apenas evidência auxiliar e deve ser confirmado em sistema confiável.

### 5.3 PowerShell, quando `Get-FileHash` estiver disponível

Instalações antigas do PowerShell presentes no Windows 7 podem não fornecer `Get-FileHash`. Confirme a disponibilidade antes de usá-lo:

```powershell
Get-Command Get-FileHash -ErrorAction Stop
Get-FileHash -LiteralPath 'C:\CMDB\reference-file.bin' -Algorithm SHA256
```

Não instale ou atualize componentes no meio de um experimento apenas para obter esse cmdlet; use o método previamente validado pelo laboratório.

### 5.4 Preservação do registro

O manifesto deve ser copiado para armazenamento protegido ou para o sistema institucional de evidências antes do experimento. Guardar o arquivo e um hash modificável no mesmo local detecta alterações acidentais, mas não comprova autenticidade: ambos podem ser substituídos.

Quando a origem e a cadeia de custódia precisarem ser demonstradas, associe o manifesto a assinatura digital, registro imutável ou outro controle aprovado pela instituição.

## 6. Validação do arquivo recuperado

### 6.1 Registrar os três estados

Em ambiente confiável, calcule e registre os valores sem alterar os arquivos:

```bash
sha256sum -- reference-file.bin
sha256sum -- processed-artifact.bin
sha256sum -- recovered-file.bin
```

É esperado que um artefato realmente modificado possua hash diferente do original. Essa diferença, porém, não identifica o algoritmo, a variante ou a causa da alteração. Acrescentar uma extensão sem modificar os bytes também não constitui evidência suficiente de criptografia.

### 6.2 Interpretar os hashes

- **SHA-256 de referência igual ao recuperado:** forte evidência prática de identidade do conteúdo, desde que os arquivos estejam estáveis e o cálculo ocorra em ambiente confiável.
- **SHA-256 de referência diferente do recuperado:** os objetos não são idênticos byte a byte.
- **SHA-256 indisponível ou calculado apenas em sistema comprometido:** resultado inconclusivo até verificação confiável.

Uma mensagem de “sucesso” exibida por uma ferramenta não substitui essa validação.

### 6.3 Comparação binária adicional no GNU/Linux

Quando os dois arquivos puderem permanecer no mesmo ambiente confiável:

```bash
cmp -s -- reference-file.bin recovered-file.bin
cmp_status=$?

case "$cmp_status" in
  0) echo "Arquivos idênticos byte a byte" ;;
  1) echo "Arquivos diferentes" ;;
  *) echo "Erro durante a comparação" ;;
esac
```

O código `0` significa igualdade, `1` diferença e `2` erro. Não interprete erro de leitura ou caminho incorreto como diferença válida.

### 6.4 Comparação no PowerShell

Quando `Get-FileHash` estiver disponível em um ambiente confiável:

```powershell
$referenceHash = (Get-FileHash -LiteralPath 'C:\CMDB\reference-file.bin' -Algorithm SHA256 -ErrorAction Stop).Hash
$recoveredHash = (Get-FileHash -LiteralPath 'C:\CMDB\recovered-file.bin' -Algorithm SHA256 -ErrorAction Stop).Hash

if ([string]::Equals($referenceHash, $recoveredHash, [System.StringComparison]::OrdinalIgnoreCase)) {
    'Arquivos idênticos segundo SHA-256'
} else {
    'Arquivos diferentes segundo SHA-256'
}
```

O script deve falhar explicitamente caso um arquivo não seja lido. Preserve a saída e não trate valores vazios como hashes válidos.

## 7. Critérios de classificação

| Classificação | Critério mínimo | Forma adequada de relatar |
|---|---|---|
| Recuperação exata | SHA-256 igual ao original conhecido, calculado em ambiente confiável; opcionalmente, `cmp` com código `0` | “O arquivo recuperado corresponde byte a byte ao arquivo de referência.” |
| Recuperação parcial ou funcional | SHA-256 diferente, mas parte do conteúdo ou da estrutura foi validada por método documentado | “Houve recuperação parcial/funcional; o objeto não é idêntico ao original.” |
| Falha de recuperação | Saída ausente, ilegível ou reprovada nos testes definidos | “Não foi confirmada recuperação utilizável segundo os critérios aplicados.” |
| Inconclusivo | Ausência de original confiável, hash não verificável, erro de leitura ou evidência limitada à interface da ferramenta | “As evidências disponíveis não permitem confirmar a recuperação.” |

Tamanho igual, nome restaurado, extensão removida ou abertura aparente do arquivo não comprovam recuperação exata.

## 8. Arquivos ZIP e formatos estruturados

Quando o objeto de referência for um ZIP, a igualdade do SHA-256 do próprio ZIP confirma identidade do contêiner. Se o hash for diferente, o conteúdo interno ainda pode ser parcialmente ou logicamente equivalente, mas o contêiner não foi recuperado byte a byte.

Uma verificação estrutural pode complementar a análise:

```bash
zip -T recovered-file.zip
```

Esse comando verifica a estrutura segundo a ferramenta usada; ele não comprova identidade, completude ou segurança do conteúdo.

Se for necessário extrair e comparar entradas internas, faça isso somente em ambiente isolado e descartável. Registre inventário, caminhos relativos, tamanhos e SHA-256 de cada item. Arquivos executáveis, documentos com macros e outros conteúdos recuperados continuam não confiáveis.

## 9. Comparação parcial e exposição de bytes

O SHA-256 completo responde se dois objetos são ou não idênticos; ele não informa quantos bytes foram recuperados, quais regiões mudaram ou a causa da diferença.

Evite publicar despejos extensos de bytes ou usar saída detalhada sem limite. Ferramentas como `cmp -l` podem gerar enormes volumes e revelar conteúdo do arquivo. Quando a análise por deslocamento for indispensável:

- defina previamente o intervalo e a pergunta técnica;
- use a menor quantidade de dados necessária;
- registre deslocamentos, tamanho do intervalo e ferramenta;
- não exponha conteúdo pessoal, credenciais, chaves ou dados de vítimas; e
- diferencie bytes iguais de conteúdo semanticamente recuperado.

Uma porcentagem de bytes disponíveis, uma porcentagem de chave reconstruída ou uma barra de progresso não equivale automaticamente à porcentagem de arquivos recuperados.

## 10. Limitações

- Colisões são teoricamente possíveis; no contexto deste guia, a igualdade SHA-256 é tratada como forte evidência prática, não como prova matemática absoluta.
- O hash não informa procedência, autoria, momento da criação, segurança ou ausência de conteúdo malicioso.
- Um manifesto sem proteção pode ser alterado junto com o arquivo.
- O cálculo feito em sistema comprometido pode ser falsificado.
- Hash diferente não mede a extensão do dano e não exclui recuperação parcial útil.
- Hash igual confirma igualdade com a referência, mas não garante que a própria referência seja legítima ou segura.
- Arquivos reconstruídos podem ser funcionalmente equivalentes e ainda possuir bytes ou metadados diferentes.
- Abertura bem-sucedida em uma aplicação não detecta necessariamente truncamento, corrupção silenciosa ou perda de metadados.
- A verificação de arquivos muito grandes exige leitura integral e pode consumir tempo e entrada/saída consideráveis.

## 11. Registro de evidências

| Campo | Registro |
|---|---|
| Identificador do experimento |  |
| Responsável |  |
| Ambiente confiável de verificação |  |
| Data e hora em UTC |  |
| Ferramenta e versão |  |
| Nome e tamanho do arquivo de referência |  |
| SHA-256 do arquivo de referência |  |
| Nome e tamanho do artefato processado |  |
| SHA-256 do artefato processado |  |
| Nome e tamanho do arquivo recuperado |  |
| SHA-256 do arquivo recuperado |  |
| Resultado de `cmp`, se aplicado |  |
| Validação estrutural/funcional, se aplicada |  |
| Classificação final |  |
| Limitações e anomalias |  |

Não publique credenciais, caminhos pessoais, conteúdo de vítimas ou saídas byte a byte desnecessárias.

## 12. Solução de problemas

### O manifesto informa arquivo ausente

O nome é armazenado no manifesto e resolvido a partir do diretório atual. Volte ao diretório correto ou gere um registro específico para o novo nome sem substituir o hash original.

### O hash muda entre execuções

Confirme que o arquivo terminou de ser gravado, não está sendo modificado por outra aplicação e corresponde ao mesmo caminho. Preserve os dois resultados e investigue antes de prosseguir.

### O arquivo abre, mas o hash é diferente

Classifique-o como não idêntico. Faça validação estrutural e funcional separada para determinar se houve recuperação parcial, sem usar a abertura aparente como prova de integralidade.

### A ferramenta informa sucesso, mas a validação falha

Registre a mensagem como observação da ferramenta e mantenha o resultado como parcial, falho ou inconclusivo, conforme as evidências independentes.

### `Get-FileHash` não existe no Windows 7

Não altere o laboratório no meio do teste. Use o `certutil -hashfile` previamente validado ou transfira o objeto por procedimento controlado para um ambiente limpo com ferramenta disponível.

### `cmp` retorna código `2`

Trata-se de erro, não de diferença confirmada. Confira caminhos, permissões, armazenamento e erros de entrada e saída.

## 13. Referências

- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Disponível em: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Acesso em: 1 set. 2026.
- FREE SOFTWARE FOUNDATION. *GNU Diffutils*. Disponível em: <https://www.gnu.org/software/diffutils/manual/diffutils.html>. Acesso em: 1 set. 2026.
- MICROSOFT. *Get-FileHash*. Disponível em: <https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1>. Acesso em: 1 set. 2026.
- MICROSOFT. *certutil*. Disponível em: <https://learn.microsoft.com/windows-server/administration/windows-commands/certutil>. Acesso em: 1 set. 2026.
- NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. *Secure Hash Standard (SHS)*. FIPS PUB 180-4. Gaithersburg, 2015. Disponível em: <https://doi.org/10.6028/NIST.FIPS.180-4>. Acesso em: 1 set. 2026.
- CAATINGA MALWARE DB. [Padrão editorial e catálogo de guias](../CMDB-Reports-Guide-pt-BR.md).

## 14. Validação editorial

| Papel | Nome | Situação | Data/versão validada |
|---|---|---|---|
| Autor | Romário J. O. Veloso | Pendente de assinatura | — |
| Revisor técnico | A definir | Pendente | — |
| Aprovação editorial | A definir | Pendente | — |

As assinaturas devem ser registradas apenas após a revisão técnica e editorial da versão destinada à publicação.
