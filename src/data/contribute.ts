import { Lang } from './families';

export interface ContribStep {
  n: string;
  title: string;
  desc: string;
}

export interface CriteriaItem {
  text: string;
}

export const CONTRIBUTE_CONTENT: Record<Lang, { steps: ContribStep[]; criteria: CriteriaItem[] }> = {
  pt: {
    steps: [
      {
        n: '01',
        title: 'Seleção do Modelo',
        desc: 'Baixe o modelo Markdown adequado no menu Modelos (ex: CMDB-TPL-01 para relatórios completos ou CMDB-TPL-02 para amostragem).'
      },
      {
        n: '02',
        title: 'Execução Controlada',
        desc: 'Realize os testes dinâmicos em laboratório isolado seguindo os Guias de Laboratório (CMDB-LG-001) e calcule o hash SHA-256.'
      },
      {
        n: '03',
        title: 'Preenchimento do Estudo',
        desc: 'Preencha todos os campos do modelo, prestando especial atenção às limitações encontradas e às evidências registradas.'
      },
      {
        n: '04',
        title: 'Submissão e Revisão',
        desc: 'Abra um Pull Request no repositório do acervo. A submissão passará por revisão por pares do Grupo de Segurança Ofensiva da UFPE.'
      }
    ],
    criteria: [
      { text: 'Amostra com hash SHA-256 calculado e procedência de origem documentada.' },
      { text: 'Ambiente de laboratório isolado detalhado (SO, hipervisor, ferramentas utilizadas).' },
      { text: 'Seção explícita de limitações da análise (o que não foi testado ou ficou inconclusivo).' },
      { text: 'Evidências fotográficas ou capturas de tela acompanhadas de legenda e fonte.' },
      { text: 'Classificação criteriosa na Escala de Recuperação (1 a 6) do acervo.' },
      { text: 'Ausência de dados confidenciais, pessoais ou corporativos nas capturas e textos.' },
      { text: 'Formatação em Markdown conforme o modelo padrão CMDB-TPL-01.' },
      { text: 'Conformidade com os princípios de uso responsável e pesquisa defensiva da UFPE.' }
    ]
  },
  en: {
    steps: [
      {
        n: '01',
        title: 'Template Selection',
        desc: 'Download the matching Markdown template from the Templates menu (e.g. CMDB-TPL-01 for full reports).'
      },
      {
        n: '02',
        title: 'Controlled Execution',
        desc: 'Conduct dynamic tests in an isolated lab following Lab Guides (CMDB-LG-001) and calculate the SHA-256 checksum.'
      },
      {
        n: '03',
        title: 'Filling the Study',
        desc: 'Complete all template fields, giving extra care to declared limitations and captured evidence.'
      },
      {
        n: '04',
        title: 'Submission & Review',
        desc: 'Open a Pull Request on the archive repository. Submissions undergo peer review by the UFPE Offensive Security Group.'
      }
    ],
    criteria: [
      { text: 'Sample with calculated SHA-256 hash and documented collection source.' },
      { text: 'Detailed isolated lab setup (OS, hypervisor, tools used).' },
      { text: 'Explicit analysis limitations section (untested or inconclusive items).' },
      { text: 'Screen captures with caption, source, and relation to outcome.' },
      { text: 'Accurate rating on the archive Recovery Scale (1 to 6).' },
      { text: 'Absence of confidential, personal, or corporate data in captures.' },
      { text: 'Markdown formatting compliant with standard CMDB-TPL-01 template.' },
      { text: 'Compliance with UFPE responsible research principles.' }
    ]
  }
};
