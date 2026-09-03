# Alcatraz Locker Ransomware

[English](./CMDB-TR-003-Alcatraz-Report-EN.md) | **Português (Brasil)**

> **Universidade Federal de Pernambuco — UFPE** \
> **Centro de Tecnologia e Geociências — CTG** \
> **Pós-Graduação Lato Sensu em Segurança Ofensiva e Inteligência Cibernética** \
> **Caatinga Malware DB (CMDB) · Relatório técnico acadêmico**

**Subtítulo:** Análise dinâmica e recuperação defensiva de arquivos em Windows 7

**Romário J. O. Veloso¹**

¹ Bacharelando em Engenharia Eletrônica, Universidade Federal de Pernambuco (UFPE), Recife — PE, Brasil.

**Contribuição do autor:** planejamento e execução do laboratório, coleta das evidências, análise dos resultados e redação do relatório.

> **Aviso de segurança:** este documento descreve uma amostra real de ransomware para estudo e defesa. A reprodução do experimento exige autorização formal, isolamento verificável e capacidade de restauração. As evidências abaixo registram ações já realizadas; elas não constituem instruções para executar malware ou reduzir controles de segurança.

Relatório elaborado a partir do modelo do Caatinga Malware DB (CMDB), adaptado do _Cyber Malware Analysis Report Template v1_ (2021), da [FIRST Malware Analysis SIG](https://www.first.org/global/sigs/malware/ma-framework/), e da estrutura editorial da UFPE/CTG adotada pelo projeto.

## Controle do documento

| Campo              | Informação              |
| ------------------ | ----------------------- |
| Identificador      | `CMDB-TR-003`           |
| Versão             | `0.1.0`                 |
| Data de publicação | `2026-08-27` (rascunho) |
| Estado editorial   | Rascunho                |
| Local              | Recife — PE, Brasil     |

## Como citar

> VELOSO, Romário J. O. **Alcatraz Locker: análise dinâmica e recuperação defensiva de arquivos em Windows 7**. Caatinga Malware DB (CMDB). Recife: UFPE/CTG, 2026. Relatório técnico `CMDB-TR-003`, versão 0.1.0. Disponível em: https://github.com/UFPE-Seguranca-Ofensiva/caatinga-malware-db/blob/main/docs/reports/alcatraz/CMDB-TR-003-Alcatraz-Report-pt-BR.md. Acesso em: 27 ago. 2026.

## Controle de versões

| Versão | Data       | Descrição da alteração                                                        | Responsável          |
| ------ | ---------- | ----------------------------------------------------------------------------- | -------------------- |
| 0.1.0  | 2026-08-27 | Versão inicial baseada nas evidências do laboratório realizado em 2026-08-24. | Romário J. O. Veloso |

## Assinatura da versão

| Papel                             | Nome                 | Data       | Versão validada |
| --------------------------------- | -------------------- | ---------- | --------------- |
| Autor responsável                 | Romário J. O. Veloso | 2026-08-27 | 0.1.0           |
| Revisor técnico                   | Pendente             | —          | —               |
| Orientador ou docente responsável | Pendente             | —          | —               |
| Aprovação editorial do CMDB       | Pendente             | —          | —               |

- **Pacote versionado:** `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec.zip`
- **Artefato contido:** `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec.exe`

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

Este relatório documenta uma análise dinâmica acadêmica do ransomware Alcatraz Locker em uma máquina virtual com Windows 7. A amostra foi obtida pelo autor no MalwareBazaar, verificada localmente pelo SHA-256 `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec` e executada em laboratório em 24 de agosto de 2026. Foram observados a inclusão da extensão `.Alcatraz` em arquivos acessíveis e o surgimento da nota de resgate `ransomed.html`. A ferramenta Avast Decryption Tool for AlcatrazLocker, localizada por meio do No More Ransom, recuperou 22 de 22 arquivos no conjunto avaliado. A nota de resgate permaneceu no sistema após a recuperação, de modo que o resultado demonstra restauração dos arquivos, mas não comprova erradicação completa do malware nem limpeza integral do ambiente.

**Palavras-chave:** Alcatraz Locker; ransomware; análise dinâmica; recuperação de arquivos; No More Ransom.

## 2. Aviso legal

Este relatório destina-se ao ensino, à pesquisa e à defesa cibernética. Aplicam-se o [aviso legal](../../../DISCLAIMER.pt-BR.md), as [orientações de segurança](../../../SECURITY.pt-BR.md) e as regras de acesso e uso do repositório.

A amostra é distribuída exclusivamente como ZIP criptografado com AES e protegido pela senha convencional `infected`. Essa proteção reduz o risco de abertura acidental, mas não substitui isolamento ou controle de acesso. Os nomes, hashes e links são apresentados para identificação, rastreabilidade e defesa. Nenhuma parte do documento autoriza execução em sistemas de terceiros, evasão de controles, propagação ou uso ofensivo não consentido.

## 3. O que é o malware analisado

Alcatraz Locker é uma família de ransomware observada publicamente desde novembro de 2016. Segundo a Avast, a família cifra arquivos acessíveis no perfil do usuário, acrescenta a extensão `.Alcatraz` e apresenta a nota de resgate `ransomed.html`. A descrição técnica da Avast informa o uso de AES-256 combinado com codificação Base64 [2, 3].

O registro consultado no MalwareBazaar classifica a amostra como `Alcatraz`, informa o tipo `exe` e agrega resultados de diferentes serviços de inteligência que indicam atividade maliciosa e comportamento de ransomware [1]. O próprio serviço ressalva que a presença de um arquivo em sua base não garante, isoladamente, que ele seja malicioso. Neste estudo, a identificação também foi compatível com as evidências do laboratório: arquivos receberam a extensão `.Alcatraz` e o documento `ransomed.html` identificou a infecção como “Alcatraz Locker”.

### 3.1. Indicadores registrados pela fonte

| Indicador                  | Valor                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| SHA-256                    | `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec`                                 |
| SHA3-384                   | `521756f91f6dc6e4ce19d634a12692e833b29835128f8492ca166359b514d064b48fd4f9d8f51dbefbec3c7a5ad401fc` |
| SHA-1                      | `03c94534ae4471187d9ab10ad0802deb51103de1`                                                         |
| MD5                        | `76ffbb43f6ac003cacf391b95d462362`                                                                 |
| imphash                    | `983d9930adf4e1f4a55db167dd5f3c89`                                                                 |
| ssdeep                     | `3072:JKTECsVTYGVMuCz0a3gcGiR4idFyEco3I74o+w5jZ:JKA7xYg44+wVZ`                                     |
| TLSH                       | `T112B36C11B5C1C071D4B3193459B8DAB11A6CF9300F686EEBA3D8117A4FB41D17A3AEAF`                         |
| Humanhash do MalwareBazaar | `jupiter-edward-dakota-west`                                                                       |

Os valores desta tabela foram transcritos do registro do MalwareBazaar acessado em 27 de agosto de 2026 [1]. MD5 e SHA-1 são mantidos apenas para correlação com bases legadas; não devem ser usados isoladamente como garantia moderna de integridade. O `humanhash` é um identificador de conveniência do serviço, não um hash criptográfico.

## 4. Atividades realizadas

- O catálogo de ferramentas de decifragem do No More Ransom foi consultado e a entrada “Alcatraz Ransom” foi localizada.
- O repositório `ytisf/theZoo` foi consultado; não foi localizada uma entrada nominal correspondente a Alcatraz nas árvores públicas de [binários](https://github.com/ytisf/theZoo/tree/master/malware/Binaries), [código-fonte original](https://github.com/ytisf/theZoo/tree/master/malware/Source/Original) e [código revertido](https://github.com/ytisf/theZoo/tree/master/malware/Source/Reversed) pesquisadas em 27 de agosto de 2026 [6]. Essa constatação é temporal e não prova ausência histórica ou futura.
- A amostra foi obtida pelo autor a partir do registro específico do MalwareBazaar e descompactada na máquina virtual.
- O comportamento da amostra foi observado em Windows 7, incluindo alterações em nomes de arquivos e exibição da nota de resgate.
- A ferramenta de recuperação indicada pelo No More Ransom foi avaliada conforme o guia da Avast.
- Os resultados apresentados pela ferramenta e os arquivos recuperados foram registrados por capturas de tela.

| Campo da amostra             | Valor                                                                                                                                                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome do arquivo              | `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec.exe`                                                                                                                                                                        |
| Objeto analisado             | Executável extraído de pacote obtido no MalwareBazaar                                                                                                                                                                                         |
| Proteção do pacote           | ZIP com criptografia AES; senha convencional `infected`; proteção validada localmente com 7-Zip 23.01                                                                                                                                         |
| SHA-256 do pacote            | `26a4de2976398fed3d435bf2d95ad5f1ee11285f2f75b66fa4b03c326e903ce4`                                                                                                                                                                           |
| SHA-256 do artefato extraído | `918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec` — calculado localmente em fluxo, sem gravar ou executar o artefato; corresponde ao registro do MalwareBazaar                                                               |
| Fonte de obtenção            | MalwareBazaar, operado pela abuse.ch                                                                                                                                                                                                          |
| URL ou registro da fonte     | [Registro da amostra no MalwareBazaar](https://bazaar.abuse.ch/sample/918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec/)                                                                                                      |
| Data de obtenção             | `2026-08-24`, conforme data visível nas evidências do laboratório                                                                                                                                                                             |
| Identificador na fonte       | SHA-256 da amostra                                                                                                                                                                                                                            |
| Registro temporal da fonte   | Primeiro registro: `2022-04-11 04:00:30 UTC`; último registro: `2022-04-11 04:32:05 UTC`                                                                                                                                                      |
| Fontes de validação          | Documentação técnica da Avast e identificação comportamental observada no laboratório                                                                                                                                                         |
| Referências defensivas       | [No More Ransom](https://www.nomoreransom.org/pt/decryption-tools.html), [guia da Avast](https://www.nomoreransom.org/uploads/Avast_how-to-guide.pdf) e [catálogo de ferramentas da Avast](https://www.avast.com/ransomware-decryption-tools) |
| Tamanho e tipo               | 117.760 bytes; `exe`; MIME `application/x-dosexec`, segundo o MalwareBazaar                                                                                                                                                                   |

> **Verificação de integridade:** em 27 de agosto de 2026, o pacote versionado foi testado com a senha `infected`, uma senha inválida foi rejeitada e o único executável interno foi submetido a cálculo SHA-256 em fluxo, sem extração para o sistema de arquivos ou execução. O hash interno corresponde ao identificador publicado pelo MalwareBazaar. Essa verificação confirma o pacote presente no repositório, mas não substitui uma cadeia de custódia produzida no momento do experimento original.

## 5. Ambiente de laboratório

| Item                                     | Descrição                                                                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Autorização e responsável                | Atividade acadêmica informada pelo autor; responsável: Romário J. O. Veloso                                                                  |
| Sistema operacional                      | Windows 7; arquitetura e nível de atualização não registrados                                                                                |
| Isolamento                               | Máquina virtual; hipervisor e configuração de integração não registrados                                                                     |
| Rede                                     | Houve acesso à internet para obtenção da amostra e da ferramenta; segmentação, filtragem de saída e compartilhamentos não foram documentados |
| Ferramentas e versões                    | WinRAR, versão não registrada; navegadores web; Gerenciador de Tarefas do Windows; Avast Decryption Tool for AlcatrazLocker `1.0.0.838`      |
| Integridade da ferramenta de recuperação | SHA-256 não registrado; pendência antes da publicação final                                                                                  |
| Restauração                              | Snapshot ou imagem de restauração não documentados                                                                                           |
| Data da análise                          | `2026-08-24`                                                                                                                                 |

O Windows 7 é um ambiente legado cujo suporte geral da Microsoft terminou em 14 de janeiro de 2020 [7]. Seu uso neste estudo descreve a reprodução realizada e não representa recomendação de plataforma.

As lacunas acima limitam a reprodutibilidade e a avaliação do isolamento. Em análises futuras, o registro deve incluir hipervisor, snapshot limpo, topologia de rede, ausência de pastas compartilhadas, estado dos controles de segurança e método de descarte da máquina virtual.

## 6. Evidências da análise dinâmica

As imagens foram organizadas na sequência fornecida pelo autor. Elas registram o experimento, mas não substituem logs, hashes calculados localmente ou uma imagem forense do sistema. O identificador da infecção e a senha de decifragem visíveis nas Figuras 3, 8 e 12 foram gerados exclusivamente na máquina virtual descartável deste laboratório; segundo o autor, não correspondem a uma vítima real, credencial pessoal ou sistema de produção.

### 6.1. Obtenção da amostra e preparação

A amostra foi obtida pelo autor no MalwareBazaar. O uso do WinRAR foi necessário para informar a senha do pacote. O ZIP posteriormente incorporado ao repositório foi validado com a senha convencional `infected`; seu único executável possui o mesmo SHA-256 do registro de origem. Antes da execução, o nível de notificação do Controle de Conta de Usuário (UAC) foi reduzido para “Nunca notificar”. Essa alteração aparece como condição histórica do experimento e não como requisito ou recomendação.

O **UAC (Controle de Conta de Usuário)** é uma proteção do Windows que solicita confirmação quando um programa tenta realizar alterações administrativas no sistema. Reduzir seu nível de notificação facilita essas alterações sem aviso e aumenta a exposição a ações maliciosas.

**Figura 1 — Controle de Conta de Usuário configurado para “Nunca notificar”**

![Janela do Windows 7 mostrando o nível do UAC em Nunca notificar](img/01_-_Desabilitar_configuração.png)

**Fonte:** Acervo do autor (2026).

O autor informou também que a proteção antimalware foi desativada porque detectava a amostra. Entretanto, a Figura 1 documenta o UAC, que é um controle diferente, e a Figura 5 mostra o serviço `WinDefend` com estado “Executando”. Assim, o estado efetivo do Windows Defender no momento da execução não pôde ser confirmado pelas evidências disponíveis.

### 6.2. Execução e infecção

Após a execução no laboratório, arquivos presentes no diretório de trabalho receberam a extensão `.Alcatraz`. Entre os itens visíveis estavam o pacote da própria amostra, instaladores legítimos utilizados no experimento e `desktop.ini`.

**Figura 2 — Arquivos com a extensão `.Alcatraz` após a infecção**

![Explorador do Windows mostrando diferentes arquivos com a extensão Alcatraz](img/02_-_Arquivos_infectados.png)

**Fonte:** Acervo do autor (2026).

Também foi criado no desktop o documento `ransomed.html`. A página exibiu uma exigência de pagamento em Bitcoin e identificou o incidente como uma infecção por “Alcatraz Locker”, comportamento compatível com a documentação da Avast [2, 3].

**Figura 3 — Nota de resgate aberta a partir de `ransomed.html`**

![Página laranja de resgate do Alcatraz Locker exibida no Internet Explorer](img/03_-_Mensagem_desktop_do_ransome.png)

**Fonte:** Acervo do autor (2026).

O Gerenciador de Tarefas foi consultado após a infecção para registrar processos e serviços. As capturas isoladas não permitem atribuir com segurança um processo específico à amostra nem concluir que o sistema estava livre de persistência.

**Figura 4 — Processos visíveis após a execução da amostra**

![Gerenciador de Tarefas do Windows mostrando os processos ativos no laboratório](img/04_-_Processos_apos_instalacao_do_virus.png)

**Fonte:** Acervo do autor (2026).

**Figura 5 — Serviços visíveis após a execução da amostra**

![Aba Serviços do Gerenciador de Tarefas mostrando serviços e respectivos estados](img/05_-_Servicos_02.png)

**Fonte:** Acervo do autor (2026).

### 6.3. Desinfecção ou resposta

O catálogo do No More Ransom foi consultado e apresentou uma ferramenta para “Alcatraz Ransom”, desenvolvida pela Avast [4]. O próprio catálogo orienta a leitura prévia do manual e a remoção do malware antes da decifragem. O PDF referenciado é um guia geral das ferramentas de decifragem da Avast, e não um estudo exclusivo do Alcatraz [5]. A evidência disponível não demonstra uma etapa independente de erradicação anterior à recuperação; por isso, esta seção comprova a tentativa de resposta, mas não a desinfecção completa do sistema.

**Figura 6 — Entrada do Alcatraz no catálogo do No More Ransom**

![Página do No More Ransom com resultado de busca e ferramenta Alcatraz Ransom](img/06_-_nomoreransom_alcatraz.png)

**Fonte:** Reprodução de No More Ransom; captura do autor (2026).

A versão `1.0.0.838` do Avast Decryption Tool for AlcatrazLocker foi iniciada no ambiente afetado.

**Figura 7 — Tela inicial da ferramenta de recuperação da Avast**

![Assistente do Avast Decryption Tool for AlcatrazLocker aberto no Windows 7](img/07_-_Seguir_com_manual_do_nomoreransom.png)

**Fonte:** Interface da Avast; captura do autor (2026).

A ferramenta analisou um arquivo cifrado selecionado no laboratório e informou ter localizado a senha necessária para prosseguir com a recuperação.

**Figura 8 — Ferramenta informando a localização da senha de decifragem**

![Assistente da Avast indicando que encontrou a senha do arquivo Alcatraz analisado](img/08_-_gerar_password.png)

**Fonte:** Interface da Avast; captura do autor (2026).

### 6.4. Recuperação e verificação

Ao fim do processamento, a ferramenta apresentou a mensagem “Decryption Complete”.

**Figura 9 — Conclusão do processo de decifragem**

![Assistente da Avast mostrando a mensagem Decryption Complete](img/09_-_decriptação_funciona.png)

**Fonte:** Interface da Avast; captura do autor (2026).

O log resumido registrou `22/22` arquivos decifrados em oito segundos na unidade `C:`. Esse número corresponde ao conjunto processado pela ferramenta e não deve ser interpretado como inventário completo do sistema. Não foram preservados hashes anteriores à cifragem e posteriores à recuperação; por isso, a equivalência byte a byte dos arquivos restaurados não pôde ser demonstrada.

**Figura 10 — Resumo com 22 de 22 arquivos decifrados**

![Log da ferramenta Avast informando 22 arquivos decifrados de um total de 22](img/10_-_resultados_logs.png)

**Fonte:** Interface da Avast; captura do autor (2026).

No diretório examinado, os arquivos recuperados voltaram a aparecer sem a extensão `.Alcatraz`. A ferramenta manteve cópias dos objetos cifrados com o sufixo `.Alcatraz.backup`, o que permitiu distinguir os arquivos restaurados dos backups criptografados.

**Figura 11 — Arquivos recuperados e cópias cifradas com sufixo `.backup`**

![Explorador do Windows mostrando arquivos recuperados e cópias Alcatraz.backup](img/11_-_resultados_arquivos_deciptados.png)

**Fonte:** Acervo do autor (2026).

Mesmo após a recuperação, `ransomed.html` permaneceu acessível no desktop. A persistência da nota reforça que decifrar arquivos não equivale a remover todos os artefatos do incidente ou comprovar que o malware foi erradicado.

**Figura 12 — Nota de resgate ainda presente após a recuperação dos arquivos**

![Página de resgate do Alcatraz Locker ainda acessível após a decifragem](img/12_-_Resultado_ainda_fica_a_imagem.png)

**Fonte:** Acervo do autor (2026).

## 7. Conclusão

O laboratório demonstrou comportamento compatível com Alcatraz Locker: arquivos acessíveis receberam a extensão `.Alcatraz` e a nota `ransomed.html` foi apresentada ao usuário. A ferramenta indicada pelo No More Ransom recuperou os 22 arquivos do conjunto processado e preservou cópias cifradas com o sufixo `.backup`. O experimento, contudo, não comprovou erradicação integral: a nota de resgate permaneceu no sistema, não há registro de varredura posterior ou análise de persistência, e os detalhes de isolamento e restauração da máquina virtual não foram preservados.

O principal resultado defensivo é que recuperação de dados e limpeza do incidente são etapas distintas. Uma resposta completa deve preservar evidências, remover ou conter o malware antes da decifragem, validar os arquivos recuperados, realizar varredura posterior e restaurar o ambiente a partir de uma origem confiável quando sua integridade não puder ser demonstrada. Antes da publicação final deste relatório, ainda deve ser registrado o SHA-256 da ferramenta de recuperação. Em estudos futuros, hashes de arquivos de teste antes da cifragem e depois da recuperação devem ser comparados para comprovar a restauração byte a byte.

## 8. Referências

1. ABUSE.CH. **MalwareBazaar: SHA-256 918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec (Alcatraz)**. [S. l.], 2022. Disponível em: https://bazaar.abuse.ch/sample/918504ede26bb9a3aa315319da4d3549d64531afba593bfad71a653292899fec/. Acesso em: 27 ago. 2026.
2. AVAST. **Free ransomware decryption tools: Alcatraz Locker**. [S. l.], [s. d.]. Disponível em: https://www.avast.com/ransomware-decryption-tools. Acesso em: 27 ago. 2026.
3. KŘOUSTEK, Jakub. **Avast releases four free ransomware decryptors**. Avast Blog, 1 dez. 2016. Disponível em: https://blog.avast.com/avast-releases-four-free-ransomware-decryptors. Acesso em: 27 ago. 2026.
4. NO MORE RANSOM. **Ferramentas de decifragem: Alcatraz Ransom**. [S. l.], [s. d.]. Disponível em: https://www.nomoreransom.org/pt/decryption-tools.html. Acesso em: 27 ago. 2026.
5. AVAST; NO MORE RANSOM. **Avast Ransomware Decryption Tools: how-to guide**. [S. l.], [2017]. Disponível em: https://www.nomoreransom.org/uploads/Avast_how-to-guide.pdf. Acesso em: 27 ago. 2026.
6. YTISF. **theZoo: a live malware repository**. GitHub, [s. d.]. Disponível em: https://github.com/ytisf/theZoo. Acesso em: 27 ago. 2026.
7. MICROSOFT. **Você recebeu uma notificação: seu computador Windows 7 está sem suporte**. [S. l.], [s. d.]. Disponível em: https://support.microsoft.com/pt-br/topic/voc%C3%AA-recebeu-uma-notifica%C3%A7%C3%A3o-seu-computador-windows-7-est%C3%A1-sem-suporte-3278599f-9613-5cc1-e0ee-4f81f623adcf. Acesso em: 27 ago. 2026.
