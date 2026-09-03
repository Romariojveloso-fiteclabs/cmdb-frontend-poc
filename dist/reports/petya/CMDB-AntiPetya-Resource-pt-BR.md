# Recurso de recuperação AntiPetya

[English](./CMDB-AntiPetya-Resource-EN.md) | **Português (Brasil)**

> [!IMPORTANT]
> Este documento descreve um utilitário defensivo de terceiros mantido no diretório do estudo Petya. O arquivo não foi criado pela UFPE, pelo CMDB ou por seus contribuidores e não está abrangido pelas licenças CC BY 4.0 ou MIT do projeto.

## Identificação

| Campo | Valor |
|---|---|
| Projeto upstream | [`hasherezade/petya_key`](https://github.com/hasherezade/petya_key) |
| Release | [`0.2`](https://github.com/hasherezade/petya_key/releases/tag/0.2), publicada em 26 de julho de 2017 |
| Ativo oficial | [`antipetya_ultimate.iso`](https://github.com/hasherezade/petya_key/releases/download/0.2/antipetya_ultimate.iso) |
| Finalidade declarada | CD inicializável para recuperação da chave individual de variantes compatíveis do Petya |
| Arquivo preservado pelo CMDB | `antipetya_ultimate-v0.2.zip` |
| Senha do ZIP | `infected` |
| Tamanho do ISO | `43.409.408 bytes` |
| SHA-256 do ISO | `c5d76efe5b477aa41b1d6d186ab447394b591e22a47184a82f9cdfac522e185f` |
| SHA-256 do ZIP do CMDB | `ff0c75a25484e75950decbdf60dfa76c284734d12de387b52fc95091c13c146b` |

## Verificação de procedência

Em 26 de agosto de 2026, o ativo da release oficial foi obtido exclusivamente para verificação estática. Seu tamanho e SHA-256 coincidiram com o ISO contido no ZIP do CMDB. Nenhum dos arquivos foi executado nessa verificação.

O hash do ISO identifica o conteúdo distribuído pelo upstream. O hash do ZIP identifica apenas o empacotamento atual do CMDB e será alterado se o arquivo for novamente compactado, mesmo que o ISO permaneça idêntico.

## Licença e redistribuição

Na data da verificação, não foi identificada uma licença explícita no repositório ou na release upstream. A release informa que as ferramentas são fornecidas “no estado em que se encontram” e por conta e risco do usuário, mas esse aviso não equivale a uma licença de redistribuição.

Consequentemente, a presença deste arquivo não concede direitos de uso, modificação ou redistribuição além daqueles estabelecidos pelo respectivo titular ou pela legislação aplicável. Antes da incorporação à branch oficial, os mantenedores devem confirmar uma autorização adequada para redistribuição ou remover o ZIP e manter somente o link para o ativo oficial.

## Segurança

A ferramenta atua sobre estruturas de disco e pode causar perda de dados. A senha `infected` reduz o risco de abertura acidental do pacote, mas não torna o conteúdo seguro. A recuperação deve ser avaliada por pessoal qualificado, em cópia do disco e em ambiente autorizado, conforme as orientações e ressalvas do projeto upstream.
