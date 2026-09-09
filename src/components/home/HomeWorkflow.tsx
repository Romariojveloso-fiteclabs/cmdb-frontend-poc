import React from 'react';
import { Lang } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';

interface HomeWorkflowProps {
  lang: Lang;
}

export const HomeWorkflow: React.FC<HomeWorkflowProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const steps = [
    {
      n: '01',
      label: lang === 'pt' ? 'Obtenção e verificação de hash' : 'Sample retrieval & hash check',
      desc: lang === 'pt' ? 'Amostra isolada e hash SHA-256 verificado antes de qualquer execução.' : 'Isolated sample & SHA-256 checksum verified prior to execution.'
    },
    {
      n: '02',
      label: lang === 'pt' ? 'Execução em ambiente isolado' : 'Execution in isolated lab',
      desc: lang === 'pt' ? 'Ambiente sem rede e sem dados reais para observação de comportamentos.' : 'Network-free VM with dummy files to observe dynamic behaviors.'
    },
    {
      n: '03',
      label: lang === 'pt' ? 'Registro e capturas com legenda' : 'Logging & captioned captures',
      desc: lang === 'pt' ? 'Evidência fotográfica e logs de syscall vinculados ao resultado.' : 'Visual proof & system call logs attached to the finding.'
    },
    {
      n: '04',
      label: lang === 'pt' ? 'Declaração aberta de limitações' : 'Open limitation disclosure',
      desc: lang === 'pt' ? 'Tudo o que não foi possível testar é registrado de forma transparente.' : 'Every unverified condition is published explicitly.'
    }
  ];

  return (
    <section style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', padding: '52px 28px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '26px', fontWeight: 600, margin: '0 0 6px' }}>
          {t.flowTitle}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-color-secondary)', margin: '0 0 28px', maxWidth: '64ch' }}>
          {t.flowSub}
        </p>

        <ol className="home-steps-grid" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          {steps.map((step, index) => (
            <li key={index} style={{ borderTop: '2px solid var(--warning-color)', paddingTop: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--info-color)', marginBottom: '8px' }}>
                {step.n}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.35, marginBottom: '6px' }}>
                {step.label}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', lineHeight: 1.5 }}>
                {step.desc}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
