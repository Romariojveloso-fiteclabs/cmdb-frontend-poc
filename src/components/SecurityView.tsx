import React from 'react';
import { parseGeneralDocFromMarkdown } from '../data/markdownLoader';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { PageHeader } from './PageHeader';

interface SecurityViewProps {
  lang: Lang;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const disclaimerDoc = parseGeneralDocFromMarkdown('disclaimer', lang);
  const securityDoc = parseGeneralDocFromMarkdown('security', lang);

  return (
    <section className="page-shell" style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <PageHeader title={t.secTitle} intro={t.secSub} />

      {securityDoc && (
        <article
          id="security"
          className="markdown-body content-panel"
          dangerouslySetInnerHTML={{ __html: securityDoc.htmlContent }}
          style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '32px', marginBottom: '24px' }}
        />
      )}

      {disclaimerDoc && (
        <article
          id="disclaimer"
          className="markdown-body content-panel"
          dangerouslySetInnerHTML={{ __html: disclaimerDoc.htmlContent }}
          style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '32px' }}
        />
      )}
    </section>
  );
};
