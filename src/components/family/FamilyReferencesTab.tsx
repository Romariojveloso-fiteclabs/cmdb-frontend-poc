import React from 'react';
import { Lang } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';

interface FamilyReferencesTabProps {
  lang: Lang;
}

const REFERENCE_ITEMS = [
  { tag: 'DEFENSIVA', text: 'CISA Alert & Advisory — Indicadores e mitigações oficiais.' },
  { tag: 'MITRE ATT&CK', text: 'T1486 (Data Encrypted for Impact) e T1490 (Inhibit System Recovery).' },
  { tag: 'INTERNA', text: 'CMDB-LG-002 — Guia de preparação de laboratório isolado UFPE.' }
];

export const FamilyReferencesTab: React.FC<FamilyReferencesTabProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 18px' }}>
        {t.refTitle}
      </h2>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--surface-border)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
        {REFERENCE_ITEMS.map((item) => (
          <li key={item.tag} style={{ background: 'var(--surface-card)', padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--info-color)', whiteSpace: 'nowrap' }}>{item.tag}</span>
            <span style={{ fontSize: '13.5px', lineHeight: 1.55 }}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
