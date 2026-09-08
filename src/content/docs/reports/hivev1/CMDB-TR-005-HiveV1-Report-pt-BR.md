# Hive Ransomware V1

[English](./CMDB-TR-005-HiveV1-Report-EN.md) | **Português (Brasil)**

> **Universidade Federal de Pernambuco — UFPE** <br>
> **Centro de Tecnologia e Geociências — CTG** <br>
> **Pós-Graduação Lato Sensu em Segurança Ofensiva e Inteligência Cibernética** <br>
> **Caatinga Malware DB (CMDB) · Relatório técnico acadêmico**

**Subtítulo:** Análise dinâmica e avaliação experimental do decifrador integrado da KISA em Windows 7

**Romário J. O. Veloso¹**

¹ Bacharelando em Engenharia Eletrônica, Universidade Federal de Pernambuco (UFPE), Recife — PE, Brasil.

**Contribuição do autor:** planejamento e execução do laboratório, coleta das evidências, desenvolvimento dos procedimentos auxiliares, análise dos resultados e redação do relatório.

> **Aviso de segurança:** este documento registra uma análise já realizada com ransomware real. Ele não é um roteiro de execução. Qualquer reprodução exige autorização formal, ambiente isolado e descartável, rede controlada e capacidade de restauração.

Relatório elaborado a partir do modelo do Caatinga Malware DB (CMDB), adaptado do *Cyber Malware Analysis Report Template v1* (2021), da [FIRST Malware Analysis SIG](https://www.first.org/global/sigs/malware/ma-framework/), e da estrutura editorial da UFPE/CTG adotada pelo projeto.

## Controle do documento

| Campo | Informação |
|---|---|
| Identificador | `CMDB-TR-005` |
| Versão | `0.1.0` |
| Data de publicação | `2026-08-30` (rascunho) |
| Estado editorial | Rascunho |
| Local | Recife — PE, Brasil |

## Como citar

> VELOSO, Romário J. O. **Hive Ransomware V1: análise dinâmica e avaliação experimental do decifrador integrado da KISA em Windows 7**. Caatinga Malware DB (CMDB). Recife: UFPE/CTG, 2026. Relatório técnico `CMDB-TR-005`, versão 0.1.0. Disponível em: https://github.com/UFPE-Seguranca-Ofensiva/caatinga-malware-db/blob/main/docs/reports/hivev1/CMDB-TR-005-HiveV1-Report-pt-BR.md. Acesso em: 30 ago. 2026.

## Controle de versões

| Versão | Data | Descrição da alteração | Responsável |
|---|---|---|---|
| 0.1.0 | 2026-08-30 | Versão inicial baseada nas evidências e anotações do laboratório. | Romário J. O. Veloso |

## Assinatura da versão

| Papel | Nome | Data | Versão validada |
|---|---|---|---|
| Autor responsável | Romário J. O. Veloso | 2026-08-30 | 0.1.0 |
| Revisor técnico | Pendente | — | — |
| Orientador ou docente responsável | Pendente | — | — |
| Aprovação editorial do CMDB | Pendente | — | — |

- **Artefato versionado:** `CMDB-TR-005-HiveV1-Report-pt-BR.md`, versão `0.1.0`.
- **Pacote malicioso:** não incluído neste relatório.
- **Artefato analisado:** arquivo Windows identificado pelo SHA-256 publicado pelo theZoo `25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5`.

## Sumário

1. [Resumo](#1-resumo)
2. [Aviso legal](#2-aviso-legal)
3. [O que é o malware analisado](#3-o-que-é-o-malware-analisado)
4. [Atividades realizadas](#4-atividades-realizadas)
5. [Ambiente de laboratório](#5-ambiente-de-laboratório)
6. [Evidências da análise dinâmica](#6-evidências-da-análise-dinâmica)
7. [Conclusão](#7-conclusão)
8. [Referências](#8-referências)

## 1. Resumo

Este relatório documenta uma análise dinâmica acadêmica do Hive Ransomware V1 em uma máquina virtual Windows 7 e uma tentativa de recuperação com o *Hive Ransomware Integrated Decryption Tool*, desenvolvido pela Korea Internet & Security Agency (KISA). A execução produziu arquivos com identificadores e extensão `.hive`, uma nota `HOW_TO_DECRYPT` e indisponibilidade de diversos arquivos e aplicativos no ambiente observado. Para obter pares original/cifrado, o ensaio combinou arquivos previamente preservados e componentes de uma segunda instalação semelhante do Windows 7, transferidos à VM infectada por uma ISO que, segundo o autor, foi montada como somente leitura. Dos 43 pares candidatos registrados pelo autor, 25 foram aceitos no critério operacional `feasible : True` e 18 foram rejeitados. A melhor execução exibiu 63,529% de cobertura do material da tabela de chaves. Embora a ferramenta tenha informado sucesso para um alvo, a validação posterior relatada pelo autor não encontrou uma estrutura PNG válida. O resultado é, portanto, classificado como recuperação parcial de material criptográfico, sem confirmação de recuperação íntegra do arquivo-alvo.

**Palavras-chave:** Hive; ransomware; análise dinâmica; decifragem; recuperação de arquivos; KISA.

## 2. Aviso legal

Este relatório destina-se exclusivamente ao ensino, à pesquisa e à defesa cibernética. Os nomes, hashes e links são apresentados para identificação, rastreabilidade e resposta a incidentes. Nenhuma parte do documento autoriza execução em sistemas de terceiros, propagação, evasão de controles ou uso ofensivo não consentido.

A amostra permanece perigosa mesmo após a interrupção da infraestrutura do grupo criminoso. Nenhum binário malicioso foi adicionado junto a este relatório. A captura da nota de resgate também foi omitida porque expunha endereços Tor e credenciais específicas do ensaio; seu conteúdo relevante foi resumido sem reproduzir esses dados.

## 3. O que é o malware analisado

O Hive foi identificado em junho de 2021 e operou no modelo *ransomware as a service* (RaaS), no qual desenvolvedores mantêm o malware e afiliados conduzem ataques. O alerta conjunto da CISA, do FBI e do HHS registra alvos corporativos e de infraestrutura crítica, mecanismos de dupla extorsão e variantes para Windows, Linux, VMware ESXi e FreeBSD [1].

As cadeias de intrusão documentadas incluíram credenciais de acesso remoto, phishing e exploração de vulnerabilidades conhecidas. Este laboratório executou diretamente uma amostra em VM e não reproduziu uma cadeia de intrusão. Não há evidência neste estudo de exploração de vulnerabilidade *zero-day* [1].

Em janeiro de 2023, autoridades dos Estados Unidos, da Alemanha e dos Países Baixos apreenderam servidores e interromperam parte da infraestrutura usada pelo grupo. A operação não neutraliza binários históricos, que continuam capazes de causar danos quando executados [2].

### 3.1. Amostra e rastreabilidade

O artefato foi associado à entrada [`Ransomware.Hive`](https://github.com/ytisf/theZoo/tree/master/malware/Binaries/Ransomware.Hive), conforme os manifestos [SHA-256](https://github.com/ytisf/theZoo/blob/master/malware/Binaries/Ransomware.Hive/Ransomware.Hive.sha256) e [MD5](https://github.com/ytisf/theZoo/blob/master/malware/Binaries/Ransomware.Hive/Ransomware.Hive.md5) do theZoo [7].

O artefato Windows efetivamente executado foi registrado pelo autor como `windows_25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5`. Os hashes abaixo foram conferidos com os manifestos publicados pelo theZoo, mas não foram recalculados nesta revisão porque o pacote e o artefato não estavam disponíveis no conjunto documental desta versão.

| Artefato no inventário da fonte | SHA-256 publicado pelo theZoo | MD5 legado | Escopo neste ensaio |
|---|---|---|---|
| `windows_25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5` | `25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5` | `DA13022097518D123A91A3958BE326DA` | Executado no Windows 7, segundo o registro do autor |

O MD5 é mantido apenas para correlação com bases legadas; o SHA-256 é o identificador principal. O pacote-fonte possui outros artefatos listados em seus manifestos, mas eles não são reproduzidos aqui porque não fizeram parte da análise documentada.

### 3.2. Hashes do conjunto de validação do método de recuperação

O artigo que descreve o método posteriormente empregado pelo decifrador relaciona cinco amostras Hive em sua Tabela 1 [6]. São os SHA-256 para os quais a pesquisa documenta análise e validação experimental do método. Eles **não constituem uma lista exclusiva de hashes aceita pelo decifrador**: a ferramenta identifica a versão a partir do arquivo de chave cifrada e declara suporte ao Hive V1–V4, com as limitações descritas no manual [4].

| SHA-256 informado no artigo [6] | Correspondência exata no MalwareBazaar | Metadados da ficha |
|---|---|---|
| `2f26ea19a8fdb167b8593e8eec03c37248b6e5008f0b9ee5fb7d326cbe6500bf` | Não localizada | — |
| `50ad0e6e9dc72d10579c20bb436f09eeaa7bfdbcb5747a2590af667823e85609` | Não localizada | Aparece apenas como amostra similar na ficha de `612e5f…` [9] |
| `88f7544a29a2ceb175a135d9fa221cbfd3e8c71f32dd6b09399717f85ea9afd1` | [Localizada](https://bazaar.abuse.ch/sample/88f7544a29a2ceb175a135d9fa221cbfd3e8c71f32dd6b09399717f85ea9afd1/) [8] | Assinatura `Hive`; executável; visto inicialmente em 3 jul. 2021 |
| `612e5ffd09ca30ca9488d802594efb5d41c360f7a439df4ae09b14bce45575ec` | [Localizada](https://bazaar.abuse.ch/sample/612e5ffd09ca30ca9488d802594efb5d41c360f7a439df4ae09b14bce45575ec/) [9] | Assinatura `Hive`; executável; visto inicialmente em 30 jul. 2021 |
| `e1a7ddbf735d5c1cb9097d7614840c00e5c4d5107fa687c0ab2a2ec8948ef84e` | Não localizada | — |

Na consulta realizada em **1º de setembro de 2026**, somente dois dos cinco valores apresentaram uma ficha pública de correspondência exata no MalwareBazaar. A ausência de ficha para os demais significa apenas que eles não foram localizados nessa base e nessa data; não demonstra que sejam benignos, inexistentes ou incompatíveis. O artefato executado neste ensaio possui outro SHA-256 (`25bfec0c…`) e não deve ser tratado como idêntico às amostras do artigo sem comparação binária.

A ficha de `88f754…` também relaciona o artefato desempacotado `2f7d37c22e6199d1496f307c676223dda999c136ece4f2748975169b4a48afe5` [8]. Esse valor e a relação de similaridade entre `612e5f…` e `50ad0e…` são correlações auxiliares da base, não novas correspondências entre os cinco hashes e nem evidência de compatibilidade adicional com o decifrador.

## 4. Atividades realizadas

- A entrada correta do Hive no theZoo e seus manifestos de hashes foram consultados.
- O autor preparou três imagens como arquivos de referência e executou o artefato Windows em uma VM acadêmica autorizada.
- Foram registrados a renomeação de arquivos, a nota de resgate e falhas de acesso a arquivos e aplicativos.
- A ferramenta da KISA para Hive V1–V4, indexada pelo No More Ransom, foi avaliada.
- Pares original/cifrado foram preparados a partir de arquivos conhecidos e de uma segunda instalação semelhante do Windows 7.
- Segundo o registro do autor, o compartilhamento gravável entre VM e host foi substituído por uma ISO montada como mídia somente leitura.
- Os pares candidatos foram avaliados incrementalmente e classificados pelo estado `feasible` informado pela ferramenta.
- O arquivo produzido após a mensagem de sucesso foi verificado quanto à estrutura esperada de PNG.

| Campo da amostra | Valor |
|---|---|
| Nome do arquivo | `windows_25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5` |
| Objeto analisado | Artefato Windows extraído do pacote `Ransomware.Hive.zip`, segundo o autor |
| Proteção do pacote | ZIP protegido; senha convencional `infected`, conforme o registro do ensaio |
| SHA-256 do pacote | Não registrado — obrigatório antes de qualquer futura inclusão do pacote |
| SHA-256 do artefato | `25bfec0c3c81ab55cf85a57367c14cc6803a03e2e9b4afd72e7bbca9420fe7c5`, publicado pelo theZoo e não recalculado nesta revisão |
| Fonte de obtenção | `ytisf/theZoo` |
| URL da fonte | [Ransomware.Hive](https://github.com/ytisf/theZoo/tree/master/malware/Binaries/Ransomware.Hive) |
| Data de obtenção | Não registrada |
| Identificador na fonte | Nome do artefato e SHA-256 |
| Fonte de validação | [Manifesto SHA-256](https://github.com/ytisf/theZoo/blob/master/malware/Binaries/Ransomware.Hive/Ransomware.Hive.sha256) do theZoo [7] |
| Referências defensivas | KISA e No More Ransom [3–5] |
| Tamanho e tipo | Não registrados |

> **Pendência de integridade:** antes de publicar futuramente o pacote, devem ser calculados no ambiente autorizado o SHA-256 do ZIP final e o SHA-256 de cada artefato extraído. O nome do arquivo ou o hash publicado por terceiros não substituem essa verificação local.

## 5. Ambiente de laboratório

| Item | Descrição |
|---|---|
| Autorização e responsável | Atividade acadêmica informada pelo autor; responsável: Romário J. O. Veloso |
| Sistema infectado | Máquina virtual Windows 7; edição, arquitetura e nível de atualização não registrados |
| Sistema limpo auxiliar | Segunda VM Windows 7, denominada `win_7_clean` |
| Host e virtualização | Host Ubuntu e VirtualBox; versões não registradas |
| Rede | Houve acesso a serviços web; segmentação e filtragem de saída não foram documentadas |
| Controles de segurança | Segundo o autor, Windows Defender e Firewall do Windows foram desativados antes da execução; condição histórica, não recomendação |
| Ferramentas | WinRAR e Hive Ransomware Integrated Decryption Tool; versões não registradas |
| Transferência de arquivos | Compartilhamento do VirtualBox inicialmente acessível; segundo o autor, depois substituído por ISO montada como somente leitura |
| Restauração | Snapshot ou imagem de restauração não documentados |
| Data da análise | `2026-08-30`, conforme as capturas |

O estado do **UAC (Controle de Conta de Usuário)** não foi registrado. O UAC ajuda a impedir alterações administrativas não autorizadas, solicitando consentimento ou credenciais quando aplicável; ele é distinto do Firewall do Windows e do Windows Defender.

A desativação dos controles reduziu o realismo defensivo e ampliou o risco do ensaio. Também foi observado que uma pasta compartilhada do VirtualBox estava acessível pela VM infectada. Não foram fornecidas evidências forenses suficientes para afirmar que o host permaneceu íntegro; a mudança para mídia somente leitura apenas reduziu a superfície de exposição nas etapas seguintes. Em trabalhos futuros, ferramentas e arquivos limpos devem ser obtidos e verificados fora da VM infectada e transferidos por mídia controlada.

## 6. Evidências da análise dinâmica

As oito figuras abaixo foram selecionadas entre 27 capturas. Imagens repetitivas, excessivamente operacionais ou contendo endereços Tor e credenciais foram excluídas para preservar clareza e segurança.

### 6.1. Preparação e efeitos observados

Segundo o registro do autor, três imagens foram preservadas antes da execução para apoiar a comparação posterior entre originais e versões cifradas.

**Figura 1 — Arquivos de referência preparados antes da execução**

![Explorador do Windows 7 mostrando três imagens de referência e o pacote Ransomware.Hive antes da infecção](./img/01-reference-files-before-execution.png)

**Fonte:** Acervo do autor (2026).

Após a execução, o diretório observado passou a conter artefatos com identificadores anexados e extensão `.hive`, além da nota `HOW_TO_DECRYPT`.

**Figura 2 — Artefatos renomeados e nota de resgate**

![Diretório Downloads contendo arquivos com identificadores e extensão Hive, além da nota HOW TO_DECRYPT](./img/02-encrypted-artifacts.png)

**Fonte:** Acervo do autor (2026).

A nota alegava cifragem dos dados, exigia a aquisição de um decifrador e ameaçava divulgar informações. Sua captura não foi publicada por expor dados de acesso do caso. O autor também observou indisponibilidade de arquivos e aplicativos. A Figura 3 mostra especificamente que o Windows não encontrou `msedge.exe` no caminho esperado; isoladamente, ela não determina se o executável foi cifrado, removido ou tornado inacessível por outro efeito.

**Figura 3 — Indisponibilidade observada de um aplicativo**

![Erro do Windows informando que o executável do Microsoft Edge não foi encontrado no caminho esperado](./img/03-application-unavailable.png)

**Fonte:** Acervo do autor (2026).

Não se afirma que “todos” os dados foram cifrados: as evidências demonstram impacto amplo no ambiente observado, mas não constituem inventário completo do sistema.

### 6.2. Seleção da ferramenta e material necessário

O No More Ransom ainda indexa o decifrador Hive V1–V4 como ferramenta da KISA [5].

**Figura 4 — Entrada do decifrador Hive V1–V4 no No More Ransom**

![Página do No More Ransom exibindo a ferramenta da KISA para Hive versões 1 a 4](./img/04-nomore-ransom-hive-decryptor.png)

**Fonte:** Reprodução de [No More Ransom](https://www.nomoreransom.org/pt/decryption-tools.html); captura do autor (2026) [5].

O arquivo `.key.hive` exibido tem 11.801 KB (aproximadamente 11,5 MiB), dimensão compatível com a descrição aproximada de 10 MB para Hive V1 no manual da KISA [4].

**Figura 5 — Arquivo de chave cifrada localizado no laboratório**

![Pesquisa do Windows mostrando um arquivo com extensão key.hive e tamanho aproximado de 11,5 MB](./img/05-encrypted-key-file.png)

**Fonte:** Acervo do autor (2026).

O decifrador organiza quatro tipos de entrada [4]:

| Estrutura | Finalidade |
|---|---|
| `0_Encrypted_keyfile` | Arquivo de chave cifrada criado durante a infecção |
| `1_infected_files` | Arquivos cifrados para os quais existe original correspondente |
| `2_original_files` | Originais correspondentes aos arquivos da estrutura anterior |
| `3_recovery_target_files` | Arquivos cifrados que se pretende recuperar |

Os alvos podem ser diferentes dos pares conhecidos. Cada original deve ter o mesmo nome e corresponder à mesma versão do arquivo cifrado, e os dois conjuntos devem conter a mesma quantidade de arquivos. A preservação do caminho foi uma heurística adicional deste ensaio, não uma exigência oficial da ferramenta [4]. Esse método decorre da pesquisa de Kim et al. sobre uma fragilidade na cifragem do Hive e a recuperação parcial do material da tabela de chaves por meio de arquivos conhecidos [6].

### 6.3. Construção e validação dos pares

Uma imagem obtida novamente da Web apresentou SHA-256 diferente da cópia preservada. Isso demonstra apenas que os dois arquivos não eram idênticos em nível binário; a causa da diferença não foi determinada. Um ZIP estático foi aceito pelo critério `feasible`, mas forneceu cobertura inicial de apenas 0,00598907%.

**Figura 6 — Cobertura inicial insuficiente do material de chave**

![Console do decifrador mostrando um par rejeitado, um conjunto viável e cobertura inicial de 0,00598907 por cento](./img/06-initial-key-coverage.png)

**Fonte:** Acervo do autor (2026).

Para ampliar os pares conhecidos, arquivos de uma segunda instalação semelhante do Windows 7 foram coletados com seus caminhos. Uma pasta compartilhada gravável havia ficado acessível à VM infectada; segundo o registro do autor, o fluxo foi corrigido para passar pelo host Ubuntu e por uma ISO montada como somente leitura.

```text
Windows 7 limpo → host Ubuntu → ISO somente leitura → Windows 7 infectado
```

**Figura 7 — ISO criada no host para transferência controlada**

![Gerenciador de arquivos do Ubuntu mostrando arquivos originais e a imagem original_files.iso](./img/07-read-only-iso.png)

**Fonte:** Acervo do autor (2026).

O procedimento auxiliar correlacionou arquivos pelo caminho e encontrou 43 pares candidatos. Ao adicionar cada candidato, o estado `feasible : True` foi usado como critério operacional de aceitação; `False` levou à rejeição daquele candidato nas execuções seguintes.

Os procedimentos reutilizáveis relacionados estão separados no [guia de dados sintéticos](../../guides/synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md), no [guia de mídia ISO](../../guides/iso-media/CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md), no [guia de validação com SHA-256](../../guides/sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-pt-BR.md) e no [guia de controles de segurança do Windows 7](../../guides/windows-7-security-controls/CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-pt-BR.md).

| Resultado local | Quantidade | Proporção |
|---|---:|---:|
| Candidatos | 43 | 100% |
| Aceitos como `GOOD` | 25 | 58,14% |
| Rejeitados como `BAD` | 18 | 41,86% |

Esses rótulos indicam consistência para aquela execução, não identidade binária comprovada nem validade universal dos pares. Mesmo nome e caminho não garantem conteúdo idêntico entre instalações. Os totais de 43, 25 e 18 pares foram extraídos das anotações do autor; os logs completos da classificação não acompanham este relatório.

### 6.4. Resultado e verificação independente

A melhor execução exibiu 63,529% de cobertura do material da tabela de chaves. O percentual não representa a fração de arquivos recuperados: cada alvo pode depender de regiões específicas ainda ausentes.

**Figura 8 — Melhor cobertura registrada e mensagem da ferramenta**

![Console mostrando 63,529 por cento de cobertura, uma mensagem de sucesso para beldum e outro alvo sem o offset necessário](./img/08-best-key-coverage.png)

**Fonte:** Acervo do autor (2026).

O decifrador exibiu `Decrypted successfully!!` para o alvo `beldum`. Entretanto, a inspeção posterior relatada pelo autor mostrou que os bytes iniciais não correspondiam à assinatura esperada de um PNG (`89 50 4E 47 0D 0A 1A 0A`) e o arquivo não foi validado como imagem íntegra. O arquivo produzido e o registro dessa verificação não acompanham o relatório, de modo que o achado permanece um resultado declarado, não uma reprodução independente. Outro alvo permaneceu sem o *offset* necessário. A mensagem da ferramenta é, portanto, apenas um estado de processamento, não prova suficiente de recuperação.

O manual adverte que a recuperação de 100% é difícil e fornece faixas indicativas para Hive V1 [4]:

| Volume conhecido informado no manual | Quantidade indicativa de arquivos |
|---|---:|
| Até 50 KB | 500–1.000 |
| Entre 1 e 5 MB | Mais de 100 |
| Aproximadamente 25 MB | 30–50 |

As 25 correspondências aceitas neste ensaio não sustentam expectativa de recuperação integral. O tempo e a cobertura também variam conforme quantidade, tamanho e contribuição não redundante dos pares. Os procedimentos auxiliares empregados foram desenvolvidos para o experimento e não fazem parte da ferramenta oficial. Os resultados limitam-se ao Hive V1 identificado neste ensaio; o suporte declarado da ferramenta às versões V1–V4 não autoriza generalização para variantes posteriores.

## 7. Conclusão

O ensaio registrou efeitos compatíveis com Hive Ransomware V1 e demonstrou, de forma experimental, a dependência do decifrador da KISA em pares original/cifrado corretos. Segundo o procedimento registrado pelo autor, uma segunda VM semelhante e a transferência por ISO montada como somente leitura permitiram ampliar o conjunto sem manter uma pasta gravável exposta à VM infectada.

Segundo as anotações do autor, dos 43 candidatos, 25 permaneceram consistentes conforme o critério operacional da ferramenta. A melhor execução exibiu 63,529% de cobertura do material da tabela de chaves, mas nenhum arquivo-alvo teve recuperação íntegra confirmada. A classificação final é **recuperação parcial do material criptográfico, sem confirmação de recuperação íntegra do arquivo de teste**.

Em um incidente real, a prioridade deve ser isolar o equipamento, preservar evidências, erradicar o malware em ambiente confiável e restaurar cópias de segurança verificadas. Um decifrador não substitui essas medidas. Qualquer nova tentativa deve preservar hashes dos originais, cifrados, ferramentas e saídas; validar os resultados por assinatura, abertura e, quando existir um original conhecido, comparação de SHA-256.

## 8. Referências

1. CYBERSECURITY AND INFRASTRUCTURE SECURITY AGENCY; FEDERAL BUREAU OF INVESTIGATION; DEPARTMENT OF HEALTH AND HUMAN SERVICES. **#StopRansomware: Hive Ransomware**. Cybersecurity Advisory AA22-321A, 2022. Disponível em: https://www.cisa.gov/sites/default/files/publications/aa22-321a_joint_csa_stopransomware_hive.pdf. Acesso em: 30 ago. 2026.
2. UNITED STATES DEPARTMENT OF JUSTICE. **U.S. Department of Justice Disrupts Hive Ransomware Variant**. 26 jan. 2023. Disponível em: https://www.justice.gov/archives/opa/pr/us-department-justice-disrupts-hive-ransomware-variant. Acesso em: 30 ago. 2026.
3. KOREA INTERNET & SECURITY AGENCY. **KISA e o laboratório DF&C da Kookmin University desenvolvem e distribuem ferramenta integrada de recuperação do Hive**. 28 jun. 2022. Em coreano. Disponível em: https://www.krcert.or.kr/kr/bbs/view.do?bbsId=B0000127&menuNo=205021&nttId=66789. Acesso em: 30 ago. 2026.
4. KOREA INTERNET & SECURITY AGENCY. **Ransomware Integrated Decryption Tool User Manual: Hive Version 1 to Version 4**. jun. 2022. Disponível em: [manual da KISA](https://www.nomoreransom.org/uploads/Hive_Ransomware_Integrated_Decryption_Tool_User_Manual%28ENG%29.pdf). Acesso em: 30 ago. 2026.
5. NO MORE RANSOM. **Ferramentas de decifragem: Hive (v1 to v4) Ransom**. Disponível em: https://www.nomoreransom.org/pt/decryption-tools.html. Acesso em: 30 ago. 2026.
6. KIM, Giyoon; KIM, Soram; KANG, Soojin; KIM, Jongsung. **A Method for Decrypting Data Infected with Hive Ransomware**. *Journal of Information Security and Applications*, v. 71, art. 103387, 2022. DOI: https://doi.org/10.1016/j.jisa.2022.103387.
7. YTISF. **theZoo: Ransomware.Hive**. GitHub. Disponíveis em: [diretório](https://github.com/ytisf/theZoo/tree/master/malware/Binaries/Ransomware.Hive), [manifesto SHA-256](https://github.com/ytisf/theZoo/blob/master/malware/Binaries/Ransomware.Hive/Ransomware.Hive.sha256) e [manifesto MD5](https://github.com/ytisf/theZoo/blob/master/malware/Binaries/Ransomware.Hive/Ransomware.Hive.md5). Acesso em: 30 ago. 2026.
8. MALWAREBAZAAR. **Amostra Hive: SHA-256 88f7544a29a2ceb175a135d9fa221cbfd3e8c71f32dd6b09399717f85ea9afd1**. abuse.ch. Disponível em: https://bazaar.abuse.ch/sample/88f7544a29a2ceb175a135d9fa221cbfd3e8c71f32dd6b09399717f85ea9afd1/. Acesso em: 1 set. 2026.
9. MALWAREBAZAAR. **Amostra Hive: SHA-256 612e5ffd09ca30ca9488d802594efb5d41c360f7a439df4ae09b14bce45575ec**. abuse.ch. Disponível em: https://bazaar.abuse.ch/sample/612e5ffd09ca30ca9488d802594efb5d41c360f7a439df4ae09b14bce45575ec/. Acesso em: 1 set. 2026.
