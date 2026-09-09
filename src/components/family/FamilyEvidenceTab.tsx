import React from 'react';
import { Lang } from '../../data/families';
import { ParsedFamilyData } from '../../data/markdownLoader';
import { TRANSLATIONS } from '../../data/i18n';

interface FamilyEvidenceTabProps {
  parsedData: ParsedFamilyData | undefined;
  lang: Lang;
}

export const FamilyEvidenceTab: React.FC<FamilyEvidenceTabProps> = ({ parsedData, lang }) => {
  const t = TRANSLATIONS[lang];
  const evidenceList = parsedData ? (parsedData.evidences[lang] || parsedData.evidences.pt) : [];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
        {t.evTitle}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-color-secondary)', margin: '0 0 18px' }}>
        {t.evSub}
      </p>

      {evidenceList.length > 0 ? (
        <div className="family-evidence-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
          {evidenceList.map((evidence, index) => (
            <figure key={index} style={{ margin: 0, background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
              <div className="family-evidence-image">
                <img
                  src={evidence.imgUrl}
                  alt={evidence.title}
                  loading="lazy"
                  decoding="async"
                  data-evidence-lightbox
                  role="button"
                  tabIndex={0}
                  aria-label={lang === 'pt' ? 'Ampliar evidência: ' + evidence.title : 'Expand evidence: ' + evidence.title}
                />
              </div>
              <figcaption style={{ padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--info-color)', marginBottom: '6px' }}>{evidence.figNum}</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '5px' }}>{evidence.title}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', lineHeight: 1.55 }}>{evidence.desc}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--surface-card)', border: '1px dashed var(--input-border)', borderRadius: '6px', padding: '32px', textAlign: 'center', color: 'var(--text-color-secondary)' }}>
          {lang === 'pt' ? 'Evidências fotográficas arquivadas no relatório principal.' : 'Photo evidences archived in main report.'}
        </div>
      )}
    </div>
  );
};
