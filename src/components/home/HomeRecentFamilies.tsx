import React from 'react';
import { FAMILIES, Lang } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';
import { FamilyCard } from '../FamilyCard';

interface HomeRecentFamiliesProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
  onOpenFamily: (key: string) => void;
}

export const HomeRecentFamilies: React.FC<HomeRecentFamiliesProps> = ({ lang, onNavigate, onOpenFamily }) => {
  const t = TRANSLATIONS[lang];
  const featuredFamilies = FAMILIES.slice(0, 3);

  return (
    <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 28px 56px' }}>
      <div className="section-heading-row" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '26px', fontWeight: 600, margin: 0 }}>
          {t.recentTitle}
        </h2>
        <button onClick={() => onNavigate('catalog')} style={{ background: 'none', border: 'none', color: 'var(--info-600)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          {t.seeAll}
        </button>
      </div>

      <div className="home-family-grid card-grid card-grid--3">
        {featuredFamilies.map((family) => (
          <FamilyCard key={family.key} family={family} lang={lang} onOpen={onOpenFamily} />
        ))}
      </div>
    </section>
  );
};
