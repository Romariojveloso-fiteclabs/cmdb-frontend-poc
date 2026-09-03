# Padrão editorial e catálogo de guias e relatórios

[English](./CMDB-Reports-Guide-EN.md) | **Português (Brasil)**

Este documento é o ponto de entrada para a documentação técnica do Caatinga Malware DB (CMDB). O diretório `docs/guides` reúne os procedimentos de apoio, organizados por assunto, e `docs/reports` reúne os relatórios acadêmicos. Novos relatórios devem partir do [modelo simplificado em Markdown](../templates/malware-analysis-report/CMDB-Report-template-pt-BR.md), adaptado do *Cyber Malware Analysis Report Template v1* da FIRST Malware Analysis SIG.

## Catálogo atual

| Estudo | Português | English |
|---|---|---|
| Petya | [Documento original bilíngue](../reports/petya/CMDB-Petya-Report.md) | [Documento original bilíngue](../reports/petya/CMDB-Petya-Report.md) |
| Thanos | [Documento original bilíngue](../reports/thanos/CMDB-Thanos-Report.md) | [Documento original bilíngue](../reports/thanos/CMDB-Thanos-Report.md) |
| Alcatraz Locker (`CMDB-TR-003`, rascunho) | [Relatório](../reports/alcatraz/CMDB-TR-003-Alcatraz-Report-pt-BR.md) | [Report](../reports/alcatraz/CMDB-TR-003-Alcatraz-Report-EN.md) |
| Cerber (`CMDB-TR-004`, rascunho) | [Relatório](../reports/cerber/CMDB-TR-004-Cerber-Report-pt-BR.md) | [Report](../reports/cerber/CMDB-TR-004-Cerber-Report-EN.md) |
| Akira (`CMDB-TR-006`, rascunho) | [Relatório](../reports/akira/CMDB-TR-006-Akira-Report-pt-BR.md) | [Report](../reports/akira/CMDB-TR-006-Akira-Report-EN.md) |

## Lista de guias disponíveis

| Finalidade | Português | English |
|---|---|---|
| Criar e preservar dados sintéticos de referência (`CMDB-GD-001`) | [Guia](./synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md) | [Guide](./synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md) |
| Validar uma recuperação com SHA-256 (`CMDB-GD-002`) | [Guia](./sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-pt-BR.md) | [Guide](./sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md) |
| Configurar temporariamente controles de segurança do Windows 7 em laboratório (`CMDB-GD-003`) | [Guia](./windows-7-security-controls/CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-pt-BR.md) | [Guide](./windows-7-security-controls/CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-EN.md) |
| Criar e validar mídia ISO de dados (`CMDB-GD-004`) | [Guia](./iso-media/CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md) | [Guide](./iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md) |

Cada assunto possui diretório próprio. Novas imagens ou anexos devem permanecer dentro do diretório do respectivo guia.

## Objetivos do padrão

- oferecer leitura clara diretamente no GitHub e em leitores de Markdown;
- preservar autoria, contribuição, revisão e histórico de cada relatório;
- separar observações, método, resultados e recomendações defensivas;
- manter equivalência editorial entre português brasileiro e inglês;
- apresentar figuras numeradas, legendadas, com texto alternativo e fonte; e
- aplicar uma estrutura acadêmica inspirada nas normas atuais da ABNT e nas orientações da UFPE.

O modelo é um **relatório técnico acadêmico**, não uma tese, dissertação ou TCC pronto para depósito institucional. A conformidade final deve ser revisada pela biblioteca ou instância acadêmica responsável.

## Estrutura obrigatória

Cada novo relatório deve conter, nesta ordem:

1. elementos editoriais: identificação institucional, autoria, controle, citação, versões, assinatura e sumário;
2. resumo;
3. aviso legal;
4. apresentação do malware analisado;
5. atividades realizadas e identificação da amostra;
6. ambiente de laboratório;
7. evidências da análise dinâmica, organizadas em obtenção, execução, resposta e recuperação;
8. conclusão; e
9. referências.

Não devem ser incluídos campos de “disciplina/turma” ou “classificação” no controle editorial. Informações técnicas sobre família ou variante pertencem ao corpo do relatório e devem ser fundamentadas pelas evidências.

## Identificação e autoria

Use um identificador permanente e legível no formato:

```text
CMDB-TR-NNN
```

Para cada autor, registre:

- nome usado na publicação;
- afiliação confirmada;
- ORCID, quando disponível;
- e-mail institucional autorizado para publicação;
- contribuições realizadas; e
- relação com as evidências produzidas.

Não deduza vínculo institucional apenas pelo histórico Git. Autores, revisores e aprovadores devem validar seus dados e assinar a versão destinada à publicação.

## Controle de versões

Cada alteração editorial relevante deve criar uma entrada contendo versão, data, responsável e descrição. As assinaturas mínimas são:

- autor ou representante dos autores;
- revisor técnico; e
- responsável pela aprovação editorial.

Correções posteriores não devem apagar versões anteriores. O histórico Git complementa, mas não substitui, o controle apresentado no relatório.

Quando houver assinatura ou validação editorial, registre nome, papel, data e versão validada.

## Evidências e figuras

- Numere figuras conforme a ordem de apresentação, independentemente do nome do arquivo.
- Posicione identificação e título acima da imagem e a fonte abaixo.
- Escreva texto alternativo que descreva a informação relevante.
- Remova ou oculte credenciais, dados pessoais, identificadores de vítimas e segredos.
- Não use a legenda como instrução para executar malware.
- Informe quando a figura for reprodução, adaptação ou produção dos autores.

Exemplo:

```markdown
**Figura 1 — Título objetivo**

![Descrição acessível da evidência](img/evidencia.png)

**Fonte:** Acervo dos autores (ano).
```

## Idiomas

O documento deve possuir conteúdo completo em `pt-BR` e `en`. Alterações técnicas ou editoriais devem ser aplicadas às duas versões no mesmo pull request. Identificadores, nomes de ferramentas e referências devem permanecer equivalentes.

Para cada amostra, registre a fonte de obtenção, o link direto ou identificador do registro, a data de acesso e fontes independentes de validação. Diferencie repositórios de amostras de fontes defensivas ou de recuperação.

Todos os arquivos ZIP adicionados ao projeto devem estar efetivamente criptografados com a senha convencional `infected`. A extensão `.zip` e a senha conhecida não constituem controle de acesso; elas servem apenas para reduzir abertura e execução acidentais. O contribuidor deve confirmar a proteção antes de enviar o arquivo.

Todo relatório novo deve registrar o SHA-256 do pacote final e de cada artefato extraído. Esse registro é obrigatório para identificar exatamente o objeto analisado, detectar mudanças e comparar a amostra com fontes independentes. Calcule o hash sobre o arquivo efetivamente analisado, em ambiente autorizado, antes de qualquer execução. Em sistemas compatíveis com GNU/Linux, use `sha256sum caminho/do/arquivo`; no PowerShell, use `Get-FileHash -Algorithm SHA256 caminho\do\arquivo`. Não deduza um hash a partir do nome do arquivo ou de informação não verificada.

Descreva a análise como registro do que foi observado no laboratório, preferencialmente no passado e sem linguagem imperativa. Não transforme o relatório em um passo a passo para ativar malware, desabilitar controles de segurança ou contornar detecções. Quando um comando for indispensável para documentar uma medida defensiva ou de recuperação, explique sua finalidade, delimite o ambiente autorizado e cite a documentação original da ferramenta.

O [VirusTotal](https://www.virustotal.com/) deve ser registrado normalmente como fonte de análise ou validação. Aponte para o relatório direto do arquivo e informe a data da análise. Não apresente o VirusTotal como fonte de obtenção, salvo quando o artefato analisado tiver sido efetivamente obtido por meio de um serviço autorizado da plataforma.

## Formato de autoria

O Markdown é a única fonte editorial oficial e pode ser lido diretamente no GitHub. Os relatórios versionados no repositório devem permanecer em Markdown.

## Referências normativas

O modelo considera a ABNT NBR 14724:2024, NBR 6023:2025, NBR 10520:2023, NBR 6028:2021, NBR 6024:2012 e NBR 6027:2012, conforme o material de estrutura e formatação publicado pela UFPE em 2025. Consulte a [página de normalização do SIB/UFPE](https://agencia.ufpe.br/sib/ficha-catalografica-normalizacao) e a [Biblioteca do CTG](https://www.ufpe.br/ctg/biblioteca) antes de uma publicação institucional definitiva.

## Como criar um novo relatório

1. Crie `docs/reports/<estudo>` e reserve um identificador `CMDB-TR-NNN` que ainda não esteja em uso.
2. Copie os modelos como `CMDB-<estudo>-Report-pt-BR.md` e `CMDB-<estudo>-Report-EN.md`, ajustando os links de idioma no topo.
3. Coloque as imagens no subdiretório `img`.
4. Registre fontes, autores, versões e limitações sem presumir informações.
5. Adicione o relatório ao catálogo deste documento.
6. Solicite revisão técnica, editorial e institucional.

As regras de segurança, contribuição e licenciamento do repositório continuam aplicáveis ao relatório e a todos os artefatos associados.
