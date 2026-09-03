import { Lang } from './families';

export interface SecurityPrinciple {
  n: string;
  title: string;
  desc: string;
}

export interface SecurityItem {
  text: string;
}

export const SECURITY_CONTENT: Record<Lang, { principles: SecurityPrinciple[]; donts: SecurityItem[] }> = {
  pt: {
    principles: [
      {
        n: '01',
        title: 'Isolamento Obrigatório de Rede e Host',
        desc: 'Nenhum experimento com código malicioso pode ser conduzido em máquinas virtuais conectadas a redes locais ou à internet sem controle de isolamento aprovado.'
      },
      {
        n: '02',
        title: 'Ausência de Dados Reais de Produção',
        desc: 'Ambientes de teste devem utilizar estritamente dados sintéticos gerados para pesquisa. Dados pessoais, credenciais reais ou arquivos confidenciais jamais devem estar presentes na VM.'
      },
      {
        n: '03',
        title: 'Verificação de Hashes e Procedência',
        desc: 'Toda afirmação sobre um artefato deve ser acompanhada pelo hash SHA-256 verificado e pela fonte de coleta documentada.'
      },
      {
        n: '04',
        title: 'Transparência de Limitações',
        desc: 'Inconclusões e falhas de método devem ser declaradas abertamente no relatório técnico. Um experimento inconclusivo possui valor científico para a comunidade.'
      },
      {
        n: '05',
        title: 'Uso Estritamente Educacional e Defensivo',
        desc: 'O acervo se destina exclusivamente à pesquisa acadêmica, desenvolvimento de assinaturas de detecção e aprimoramento de técnicas de resposta a incidentes.'
      }
    ],
    donts: [
      { text: 'O acervo não disponibiliza o download de binários executáveis ou pacotes maliciosos para o público em geral.' },
      { text: 'O acervo não fornece tutoriais ou códigos direcionados à criação de novas variantes de malware ou evasão de soluções de segurança.' },
      { text: 'O acervo não garante que um resultado de decifragem em laboratório funcionará em cenários reais de infecção sem análise prévia de chave.' },
      { text: 'O acervo não substitui consultorias ou procedimentos formais de resposta a incidentes de segurança cibernética.' }
    ]
  },
  en: {
    principles: [
      {
        n: '01',
        title: 'Mandatory Host and Network Isolation',
        desc: 'No experiment involving malicious code may be conducted in virtual machines connected to local networks or the internet without approved isolation controls.'
      },
      {
        n: '02',
        title: 'Absence of Real Production Data',
        desc: 'Test environments must strictly use synthetic data generated for research. Personal data, real credentials, or confidential files must never be present in the VM.'
      },
      {
        n: '03',
        title: 'Hash and Provenance Verification',
        desc: 'Every claim about an artefact must be accompanied by its verified SHA-256 hash and documented collection source.'
      },
      {
        n: '04',
        title: 'Transparency of Limitations',
        desc: 'Inconclusive findings and method limitations must be declared openly in the technical report. An inconclusive experiment holds scientific value.'
      },
      {
        n: '05',
        title: 'Strictly Educational and Defensive Use',
        desc: 'The archive is intended exclusively for academic research, detection signature development, and incident response enhancement.'
      }
    ],
    donts: [
      { text: 'The archive does not offer downloads of executable binaries or malicious payloads to the general public.' },
      { text: 'The archive does not provide tutorials or code aimed at creating malware variants or evading security tools.' },
      { text: 'The archive does not guarantee lab decryption outcomes will work in live infection cases without prior key analysis.' },
      { text: 'The archive does not replace formal cybersecurity incident response procedures.' }
    ]
  }
};
