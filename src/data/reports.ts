import { Lang } from './families';

export interface ReportSection {
  id: string;
  n: string;
  title: string;
  text: string;
  color?: string;
}

export interface ReportMeta {
  label: string;
  value: string;
}

export interface ReportDetail {
  id: string;
  title: string;
  familyKey: string;
  meta: ReportMeta[];
  toc: { n: string; label: string }[];
  sections: ReportSection[];
}

export const REPORTS_DATA: Record<string, Record<Lang, ReportDetail>> = {
  akira: {
    pt: {
      id: 'CMDB-TR-006',
      title: 'Análise dinâmica comparativa e verificação de recuperação do Akira Ransomware em ambiente isolado (Windows 7 SP1)',
      familyKey: 'akira',
      meta: [
        { label: 'VERSÃO', value: '1.2' },
        { label: 'DATA DE PUBLICAÇÃO', value: '2025-11-15' },
        { label: 'AUTOR', value: 'Comunidade de Segurança Ofensiva · CIn-UFPE' },
        { label: 'CLASSIFICAÇÃO', value: 'Pesquisa Acadêmica Defensiva' },
        { label: 'SITUAÇÃO EDITORIAL', value: 'Publicado (Revisado por Pares)' }
      ],
      toc: [
        { n: '01', label: 'Resumo executivo e escopo do estudo' },
        { n: '02', label: 'Caracterização das amostras e procedência' },
        { n: '03', label: 'Metodologia e infraestrutura de laboratório' },
        { n: '04', label: 'Comportamento dinâmico e vetor de cifragem' },
        { n: '05', label: 'Avaliação da ferramenta de recuperação' },
        { n: '06', label: 'Limitações declaradas e trabalhos futuros' },
        { n: '07', label: 'Referências e indicadores de comprometimento (IoCs)' }
      ],
      sections: [
        {
          id: 's1',
          n: '01',
          title: 'Resumo executivo e escopo do estudo',
          text: 'Este relatório apresenta os resultados do estudo dinâmico conduzido no Grupo de Segurança Ofensiva da UFPE sobre a variante do ransomware Akira. O experimento foi executado em ambiente isolado sem conectividade com a internet. Duas amostras controladas foram submetidas ao ambiente de testes para observar as etapas de varredura de arquivos, desativação de serviços de recuperação do sistema e escrita de notas de resgate. Os testes demonstraram a cifragem direcionada ao perfil do usuário com aposição da extensão .akira e a subsequente restauração parcial dos dados através do decifrador público disponível.'
        },
        {
          id: 's2',
          n: '02',
          title: 'Caracterização das amostras e procedência',
          text: 'A amostra primária CMDB-S-006-A (SHA-256: e4b1f2c9a7d3856b0f4e1c2a9d7b53e8f60c1a4d92b7e35f8c0a6d1b4e29f73c) foi obtida via repositórios acadêmicos e teve seu hash integralmente verificado localmente. A amostra secundária CMDB-S-006-B (SHA-256: 7a3d9e1c48b25f0d6c9a8e3b7145f2d0c86b4a19e5d3f7028c1b6a4d9e2f350b) possui procedência declarada pela fonte, mas mantida como correlacionada aguardando nova validação de hash em lote.'
        },
        {
          id: 's3',
          n: '03',
          title: 'Metodologia e infraestrutura de laboratório',
          text: 'Os testes foram realizados em máquina virtual rodando Windows 7 SP1 x86 com adaptadores de rede desconectados e snapshots de controle pré-configurados. Foram utilizadas as ferramentas Sysinternals Procmon, Regshot e PEStudio para captura de syscalls, modificações de registro e inspeção de cabeçalhos PE.'
        },
        {
          id: 's4',
          n: '04',
          title: 'Comportamento dinâmico e vetor de cifragem',
          text: 'Ao ser executado, o artefato inicia a enumeração dos drives locais e interrompe o serviço de Cópia de Sombra do Volume (VSS) através de subprocessos acionados via comando vssadmin.exe delete shadows /all /quiet. Em seguida, os arquivos com extensões comuns (PDF, DOCX, PNG, ZIP) no diretório C:\\Users são cifrados utilizando criptografia simétrica com chave pública embutida, adicionando a extensão .akira ao final do nome de cada arquivo afetado.'
        },
        {
          id: 's5',
          n: '05',
          title: 'Avaliação da ferramenta de recuperação',
          text: 'Foi testada a ferramenta pública de decifragem desenvolvida por pesquisadores de segurança. Após a execução da ferramenta no diretório cifrado, os arquivos retornaram ao formato original e puderam ser abertos sem erros nos leitores padrão. Contudo, devido à ausência do hash pré-infecção dos arquivos de controle neste lote específico, o resultado é classificado estritamente como Recuperação Funcional Aparente.'
        },
        {
          id: 's6',
          n: '06',
          title: 'Limitações declaradas e trabalhos futuros',
          text: 'O estudo não cobriu comportamentos dependentes de comando e controle (C2) remoto devido ao isolamento de rede obrigatório. Trabalhos futuros preveem simulação de C2 em ambiente com rede emulada (INetSim) e testes comparativos na variante compilada para sistemas Linux.'
        },
        {
          id: 's7',
          n: '07',
          title: 'Referências e indicadores de comprometimento (IoCs)',
          text: 'Referências: CISA Alert AA23-353A, MITRE ATT&CK T1486 (Data Encrypted for Impact), MITRE ATT&CK T1490 (Inhibit System Recovery), Guia UFPE CMDB-LG-002.'
        }
      ]
    },
    en: {
      id: 'CMDB-TR-006',
      title: 'Comparative dynamic analysis and recovery verification of Akira Ransomware in isolated environment (Windows 7 SP1)',
      familyKey: 'akira',
      meta: [
        { label: 'VERSION', value: '1.2' },
        { label: 'PUBLICATION DATE', value: '2025-11-15' },
        { label: 'AUTHOR', value: 'Offensive Security Community · CIn-UFPE' },
        { label: 'CLASSIFICATION', value: 'Defensive Academic Research' },
        { label: 'EDITORIAL STATUS', value: 'Published (Peer-reviewed)' }
      ],
      toc: [
        { n: '01', label: 'Executive summary and study scope' },
        { n: '02', label: 'Sample characterisation and provenance' },
        { n: '03', label: 'Methodology and lab infrastructure' },
        { n: '04', label: 'Dynamic behaviour and encryption vector' },
        { n: '05', label: 'Evaluation of recovery tool' },
        { n: '06', label: 'Declared limitations and future work' },
        { n: '07', label: 'References and Indicators of Compromise (IoCs)' }
      ],
      sections: [
        {
          id: 's1',
          n: '01',
          title: 'Executive summary and study scope',
          text: 'This report presents the findings of the dynamic study conducted at the UFPE Offensive Security Group on the Akira ransomware variant. The experiment was conducted in an isolated lab environment without internet connectivity. Two controlled samples were tested to observe file traversal, system recovery service disabling, and ransom note dropping. The tests demonstrated targeted encryption of user profile files with the .akira extension and subsequent partial data restoration using a public decryptor tool.'
        },
        {
          id: 's2',
          n: '02',
          title: 'Sample characterisation and provenance',
          text: 'Primary sample CMDB-S-006-A (SHA-256: e4b1f2c9a7d3856b0f4e1c2a9d7b53e8f60c1a4d92b7e35f8c0a6d1b4e29f73c) was acquired via academic repositories and fully verified locally. Secondary sample CMDB-S-006-B (SHA-256: 7a3d9e1c48b25f0d6c9a8e3b7145f2d0c86b4a19e5d3f7028c1b6a4d9e2f350b) has source-declared provenance and remains correlated awaiting batch hash validation.'
        },
        {
          id: 's3',
          n: '03',
          title: 'Methodology and lab infrastructure',
          text: 'Tests were conducted in a virtual machine running Windows 7 SP1 x86 with network adapters disconnected and pre-configured control snapshots. Sysinternals Procmon, Regshot, and PEStudio were used for syscall capturing, registry diffing, and PE header inspection.'
        },
        {
          id: 's4',
          n: '04',
          title: 'Dynamic behaviour and encryption vector',
          text: 'Upon execution, the artefact enumerates local drives and stops the Volume Shadow Copy service (VSS) via subprocess calls to vssadmin.exe delete shadows /all /quiet. Common user files (PDF, DOCX, PNG, ZIP) under C:\\Users are encrypted using symmetric encryption key pairs, appending .akira to each file name.'
        },
        {
          id: 's5',
          n: '05',
          title: 'Evaluation of recovery tool',
          text: 'A public decryptor tool developed by security researchers was evaluated. After running the tool on the encrypted directory, files were restored to their original extension and opened cleanly in standard viewers. However, as pre-infection control hashes were absent for this specific set, the result is classified strictly as Apparently Functional Recovery.'
        },
        {
          id: 's6',
          n: '06',
          title: 'Declared limitations and future work',
          text: 'The study did not cover remote command-and-control (C2) dependent actions due to mandatory network isolation. Future work includes C2 emulation with simulated network environments (INetSim) and comparative tests on Linux binaries.'
        },
        {
          id: 's7',
          n: '07',
          title: 'References and Indicators of Compromise (IoCs)',
          text: 'References: CISA Alert AA23-353A, MITRE ATT&CK T1486 (Data Encrypted for Impact), MITRE ATT&CK T1490 (Inhibit System Recovery), UFPE Guide CMDB-LG-002.'
        }
      ]
    }
  }
};
