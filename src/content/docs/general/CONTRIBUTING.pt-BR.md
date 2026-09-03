# Como contribuir com o Caatinga Malware DB

[English](./CONTRIBUTING.md) | **Português (Brasil)**

Agradecemos sua ajuda para construir um recurso acadêmico confiável. Como este repositório pode conter malware ativo, as contribuições são avaliadas quanto ao valor científico, segurança, procedência, privacidade e risco jurídico — não apenas quanto à correção técnica.

Ao participar, você concorda em seguir o [aviso legal](./DISCLAIMER.pt-BR.md), o [escopo das licenças](./LICENSE.pt-BR.md) e a [política de segurança](./SECURITY.pt-BR.md).

## Formas de contribuir

- Corrigir ou traduzir a documentação do projeto.
- Aprimorar análises, indicadores de comprometimento, orientações de detecção ou medidas de correção.
- Adicionar resultados reproduzíveis de análise estática que não exijam a execução da amostra.
- Propor nova amostra pelo processo controlado descrito abaixo.
- Relatar material incorreto, inseguro, sensível ou licenciado inadequadamente.

## Nunca envie por uma issue pública

Não anexe nem cole qualquer item abaixo em issue, discussão, comentário ou pull request não aprovado:

- executáveis, scripts, payloads, shellcode ou documentos maliciosos descompactados;
- senhas, tokens, dados pessoais, dados de vítimas ou informações confidenciais;
- endereços ativos de comando e controle ou infraestrutura que possa dar continuidade a um ataque; ou
- material obtido sem autorização ou cuja redistribuição viole lei, contrato ou direito de terceiro.

Para questões sensíveis de segurança, privacidade, direito autoral ou abuso, siga o [SECURITY.pt-BR.md](./SECURITY.pt-BR.md).

## Contribuições de documentação

1. Abra uma issue ou pull request que explique o valor acadêmico ou defensivo da alteração.
2. Cite fontes primárias confiáveis sempre que possível. Diferencie claramente resultados observados, alegações externas e hipóteses.
3. Remova dados pessoais, dados de vítimas, credenciais e informações confidenciais sem relação com a pesquisa de textos, capturas de tela, logs, despejos de memória e capturas de rede.
4. Preserve a navegação entre inglês e português e atualize as duas versões ao alterar políticas ou a navegação geral do projeto.
5. Não inclua instruções cujo efeito principal seja implantação, persistência, evasão, furto de credenciais, acesso não autorizado ou dano. Explique comportamento ofensivo apenas no nível necessário para análise, detecção, contenção ou correção.

## Admissão controlada de amostras

**Não** comece enviando uma amostra. Primeiro, abra uma proposta contendo apenas metadados não sensíveis ou contate os mantenedores de forma privada quando até os metadados forem sensíveis. A proposta deve incluir:

- família do malware ou melhor classificação disponível;
- tipo de arquivo, plataforma-alvo, arquitetura e tamanho aproximado;
- fonte, data de obtenção, cadeia de custódia e fundamento para redistribuição;
- links para relatórios públicos de ameaça ou análise, quando disponíveis;
- valor acadêmico ou defensivo esperado;
- comportamento destrutivo, autopropagável, anti-análise, de persistência ou de rede conhecido; e
- confirmação de que o material não contém dados de vítimas, credenciais, dados pessoais ou informações confidenciais de terceiros.

Um mantenedor deve aprovar a admissão **antes** que qualquer binário seja adicionado. A autorização para discutir uma amostra não é autorização para publicá-la.

### Requisitos de empacotamento após a aprovação

- Nunca faça commit de uma amostra ativa descompactada.
- Coloque cada amostra em arquivo criptografado usando a convenção de senha do projeto (`infected`). Essa senha convencional protege apenas contra execução acidental; ela não é controle de acesso.
- Confirme que a criptografia está realmente habilitada; a extensão `.zip`, por si só, não oferece proteção.
- Use nomes de arquivo consistentes e identifique claramente cada artefato documentado.
- Adicione relatório com classificação, procedência, SHA-256 do pacote e de cada artefato extraído, observações técnicas, indicadores, medidas de contenção ou correção e referências.
- Mantenha ferramentas de recuperação e utilitários legítimos de terceiros separados das amostras maliciosas e documente a origem e a licença de cada item.

Os mantenedores podem exigir outro mecanismo de transferência, revisão institucional adicional ou a rejeição/remoção de um artefato.

## Conteúdo que não será aceito

- Material destinado a apoiar ataque ilícito em andamento ou campanha ativa de malware.
- Infraestrutura pronta para implantação, phishing, furto de credenciais, persistência, destruição ou comando e controle.
- Amostras com credenciais reais, dados pessoais, identificadores de vítimas, dados proprietários ou segredos.
- Conteúdo sem procedência verificável ou sem fundamento defensável para redistribuição.
- Contribuições que adicionem capacidade perigosa sem análise educacional ou defensiva clara.
- Arquivos protegidos por senha cujo conteúdo não tenha sido informado e revisado pelos mantenedores.

## Checklist do pull request

- [ ] Expliquei o valor educacional ou defensivo da contribuição.
- [ ] Identifiquei claramente cada artefato analisado.
- [ ] Documentei a procedência e meu fundamento para enviar o material.
- [ ] Removi segredos, dados pessoais, dados de vítimas e informações confidenciais sem relação com a pesquisa.
- [ ] Não coloquei amostra descompactada ou binário em issue pública.
- [ ] Atualizei a documentação relevante em português e inglês.
- [ ] Aceito os termos aplicáveis do [LICENSE.pt-BR.md](./LICENSE.pt-BR.md).
- [ ] Meus commits incluem uma linha `Signed-off-by`, conforme descrito abaixo.

## Certificado de Origem do Desenvolvedor

O contribuidor certifica que tem o direito de enviar sua contribuição sob a licença aplicável do projeto ao assinar cada commit conforme o [Developer Certificate of Origin 1.1](https://developercertificate.org/):

```bash
git commit --signoff
```

A assinatura registra o nome real e o e-mail do contribuidor na mensagem do commit. Ela não declara que o contribuidor seja titular de malware de terceiros; a procedência e um fundamento legítimo para redistribuição ainda devem ser documentados separadamente.

## Revisão e remoção

Os mantenedores podem rejeitar, colocar em quarentena, restringir ou remover qualquer contribuição para proteger usuários, cumprir políticas do GitHub ou a legislação aplicável, responder a relato de abuso ou de titular de direitos, ou preservar a finalidade acadêmica e defensiva do projeto.
