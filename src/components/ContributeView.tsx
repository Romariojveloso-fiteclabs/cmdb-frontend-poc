import React from 'react';
import { parseGeneralDocFromMarkdown } from '../data/markdownLoader';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { PageHeader } from './PageHeader';

interface ContributeViewProps {
  lang: Lang;
}

export const ContributeView: React.FC<ContributeViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const contribDoc = parseGeneralDocFromMarkdown('contributing', lang);

  return (
    <section className="page-shell" style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <PageHeader title={t.contribPageTitle} intro={t.contribPageSub} />

      {contribDoc ? (
        <article
          className="markdown-body content-panel"
          dangerouslySetInnerHTML={{ __html: contribDoc.htmlContent }}
          style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '32px' }}
        />
      ) : (
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '24px', borderRadius: '6px' }}>
          {lang === 'pt' ? 'Instruções de contribuição arquivadas no repositório.' : 'Contribution guidelines archived in repository.'}
        </div>
      )}
    </section>
  );
};
