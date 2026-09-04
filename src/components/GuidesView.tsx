import React, { useState } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { parseAllGuidesFromMarkdown } from '../data/markdownLoader';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface GuidesViewProps {
  lang: Lang;
}

export const GuidesView: React.FC<GuidesViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const allGuides = parseAllGuidesFromMarkdown();
  const guidesList = lang === 'pt' ? allGuides.pt : (allGuides.en.length ? allGuides.en : allGuides.pt);

  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const selectedGuide = guidesList.find((g) => g.id === selectedGuideId);

  if (selectedGuide) {
    return (
      <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
        <button
          onClick={() => setSelectedGuideId(null)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ display: 'block', width: '3px', height: '14px', background: 'var(--info-color)' }}></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.14em', color: 'var(--info-color)' }}>
              {selectedGuide.id} · {selectedGuide.level}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', padding: '14px 0', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>IDENTIFICADOR</div>
              <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{selectedGuide.id}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>IDIOMA</div>
              <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{selectedGuide.lang}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>ATUALIZADO</div>
              <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{selectedGuide.updated}</div>
            </div>
          </div>

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
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
        {t.guidesPageTitle}
      </h1>
      <p style={{ fontSize: '14.5px', color: 'var(--text-color-secondary)', margin: '0 0 28px', maxWidth: '70ch' }}>
        {t.guidesPageSub}
      </p>

      <div className="guides-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
        {guidesList.map((g) => (
          <article
            key={g.id}
            onClick={() => setSelectedGuideId(g.id)}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              borderRadius: '6px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              cursor: 'pointer',
              transition: 'border-color .15s, box-shadow .15s'
            }}
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
                  setSelectedGuideId(g.id);
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
