import React from 'react';
import { parseAllFamiliesFromMarkdown, ParsedFamilyData } from '../data/markdownLoader';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface ReportViewProps {
  reportId: string;
  familyKey: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ reportId, familyKey, lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  const families = parseAllFamiliesFromMarkdown();
  const familyData: ParsedFamilyData | undefined = families.find(
    (f) => f.key === familyKey || f.report === reportId
  ) || families[0];

  if (!familyData) {
    return (
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 28px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '24px' }}>
          {lang === 'pt' ? 'Relatório não encontrado no repositório.' : 'Report not found in repository.'}
        </h2>
        <button
          onClick={() => onNavigate('catalog')}
          style={{ background: '#243A2E', color: '#F3EBDD', border: 'none', padding: '10px 18px', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' }}
        >
          {t.backCatalog}
        </button>
      </section>
    );
  }

  const html = familyData.htmlContent[lang] || familyData.htmlContent.pt;
  const tocList = familyData.toc[lang] || familyData.toc.pt;

  const metaList = [
    { label: 'RELATÓRIO', value: familyData.report },
    { label: 'IDIOMA', value: lang.toUpperCase() },
    { label: 'FONTE', value: 'Repositório de Pesquisa caatinga-malware-db' },
    { label: 'CLASSIFICAÇÃO', value: 'Pesquisa Acadêmica Defensiva' }
  ];

  return (
    <section className="report-layout" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px', display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: '40px', alignItems: 'start' }}>
      <aside className="report-toc" style={{ position: 'sticky', top: '96px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '12px' }}>
          {t.toc}
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {tocList.map((s: { id: string; n: string; label: string }, idx: number) => (
            <li key={`${s.id}-${idx}`}>
              <a className="report-toc__link" href={`#${s.id}`}>
                <span className="report-toc__number">{s.n}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <article className="document-card" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '44px 52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ display: 'block', width: '3px', height: '14px', background: 'var(--ufpe-crimson)' }}></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.14em', color: '#B85C2E' }}>
            {familyData.report}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', padding: '16px 0', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', marginBottom: '32px' }}>
          {metaList.map((m: { label: string; value: string }, i: number) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 500 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-color)' }}
        />
      </article>
    </section>
  );
};
