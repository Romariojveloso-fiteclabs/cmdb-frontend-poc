import React from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { parseAllGuidesFromMarkdown } from '../data/markdownLoader';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { PageHeader } from './PageHeader';

interface GuidesViewProps {
  lang: Lang;
  selectedGuideId?: string;
  onNavigate: (screen: string) => void;
  onOpenGuide: (guideId: string) => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({
  lang,
  selectedGuideId,
  onNavigate,
  onOpenGuide,
}) => {
  const t = TRANSLATIONS[lang];
  const allGuides = parseAllGuidesFromMarkdown();
  const guidesList = lang === 'pt' ? allGuides.pt : (allGuides.en.length ? allGuides.en : allGuides.pt);

  const selectedGuide = guidesList.find((g) => g.id === selectedGuideId)
    || [...allGuides.pt, ...allGuides.en].find((g) => g.id === selectedGuideId);

  if (selectedGuide) {
    return (
      <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
        <button
          onClick={() => onNavigate('guides')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--info-600)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          {lang === 'pt' ? 'Voltar para a lista de guias' : 'Back to guides list'}
        </button>

        <article className="document-card" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '44px 52px' }}>
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: selectedGuide.htmlContent }}
            style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-color)' }}
          />
        </article>
      </section>
    );
  }

  return (
    <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <PageHeader title={t.guidesPageTitle} intro={t.guidesPageSub} />

      <div className="guides-grid card-grid card-grid--2">
        {guidesList.map((g) => (
          <article
            key={g.id}
            onClick={() => onOpenGuide(g.id)}
            className="content-card"
            style={{ gap: '14px', cursor: 'pointer', transition: 'border-color .15s, box-shadow .15s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', color: 'var(--info-color)' }}>
                {g.id}
              </span>
              <span style={{ background: 'var(--success-soft)', color: 'var(--success-600)', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                {g.level}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '21px', fontWeight: 600, margin: 0, color: 'var(--text-color-strong)' }}>
              {g.title}
            </h2>

            <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: 0 }}>
              {g.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-color-secondary)', borderTop: '1px solid var(--surface-border)', paddingTop: '14px', marginTop: 'auto' }}>
              <span>{g.lang} · {g.updated}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenGuide(g.id);
                }}
                style={{
                  background: 'var(--primary-color)',
                  color: 'var(--primary-color-text)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <BookOpen size={14} />
                {lang === 'pt' ? 'Ler guia na íntegra' : 'Read full guide'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
