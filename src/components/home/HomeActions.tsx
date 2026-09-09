import React from 'react';
import { FilePlus, BookOpen } from 'lucide-react';
import { Lang } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';

interface HomeActionsProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
}

export const HomeActions: React.FC<HomeActionsProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="home-actions-grid" style={{ maxWidth: '1180px', margin: '0 auto', padding: '52px 28px 72px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '26px' }}>
        <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '21px', fontWeight: 600, margin: '0 0 10px' }}>
          {t.contribTitle}
        </h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: '0 0 20px' }}>
          {t.contribSub}
        </p>
        <button
          onClick={() => onNavigate('contribute')}
          style={{ background: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none', borderRadius: '4px', padding: '10px 18px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FilePlus size={16} />
          {t.contribCta}
        </button>
      </div>

      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '26px' }}>
        <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '21px', fontWeight: 600, margin: '0 0 10px' }}>
          {t.guidesTitle}
        </h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: '0 0 20px' }}>
          {t.guidesSub}
        </p>
        <button
          onClick={() => onNavigate('guides')}
          style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--input-border)', borderRadius: '4px', padding: '10px 18px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <BookOpen size={16} />
          {t.guidesCta}
        </button>
      </div>
    </section>
  );
};
