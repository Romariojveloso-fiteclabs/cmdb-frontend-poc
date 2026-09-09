import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FAMILIES, Lang } from '../../data/families';
import { parseAllReportsFromMarkdown } from '../../data/markdownLoader';
import { TRANSLATIONS } from '../../data/i18n';

const ACTIVE_FAMILIES = FAMILIES.length;
const PUBLISHED_REPORTS = parseAllReportsFromMarkdown().length;
const DOCUMENTED_SAMPLES = FAMILIES.reduce((sum, family) => sum + family.samples, 0);
const VERIFIABLE_EVIDENCE = ACTIVE_FAMILIES
  ? Math.round((100 * FAMILIES.filter((family) => family.ev === 'observed').length) / ACTIVE_FAMILIES)
  : 0;

interface HomeStatsProps {
  lang: Lang;
}

export const HomeStats: React.FC<HomeStatsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const stats = [
    { n: String(ACTIVE_FAMILIES).padStart(2, '0'), label: lang === 'pt' ? 'Famílias ativas' : 'Active families' },
    { n: String(PUBLISHED_REPORTS).padStart(2, '0'), label: lang === 'pt' ? 'Relatórios publicados' : 'Published reports' },
    { n: String(DOCUMENTED_SAMPLES).padStart(2, '0'), label: lang === 'pt' ? 'Amostras documentadas' : 'Documented samples' },
    { n: VERIFIABLE_EVIDENCE + '%', label: lang === 'pt' ? 'Evidência verificável' : 'Verifiable evidence' }
  ];

  return (
    <>
      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '28px' }}>
        <div style={{ background: 'var(--warning-soft)', border: '1px solid var(--warning-color)', color: 'var(--warning-600)', borderRadius: '6px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13.5px', lineHeight: 1.5 }}>{t.safetyBanner}</span>
        </div>
      </section>

      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '8px 28px 48px' }}>
        <div className="home-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1px', background: 'var(--surface-border)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ background: 'var(--surface-card)', padding: '22px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '34px', fontWeight: 500, color: 'var(--primary-color)', lineHeight: 1 }}>
                {stat.n}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-color-secondary)', marginTop: '8px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
