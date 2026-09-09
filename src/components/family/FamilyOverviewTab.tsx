import React from 'react';
import { Lang, MalwareFamily } from '../../data/families';
import { ParsedFamilyData } from '../../data/markdownLoader';
import { TRANSLATIONS } from '../../data/i18n';

interface FamilyOverviewTabProps {
  fam: MalwareFamily;
  parsedData: ParsedFamilyData | undefined;
  lang: Lang;
}

export const FamilyOverviewTab: React.FC<FamilyOverviewTabProps> = ({ fam, parsedData, lang }) => {
  const t = TRANSLATIONS[lang];
  const isAkira = fam.key === 'akira';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 10px' }}>
          {t.summaryTitle}
        </h2>
        <p
          className="family-summary-text"
          lang={lang === 'pt' ? 'pt-BR' : 'en'}
          style={{ fontSize: '15.5px', lineHeight: 1.7, margin: 0, maxWidth: '72ch' }}
        >
          {parsedData ? (parsedData.summary[lang] || parsedData.summary.pt) : fam.headline.pt}
        </p>
      </div>

      <div>
        <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
          {t.observedTitle}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-color-secondary)', margin: '0 0 16px' }}>
          {t.observedSub}
        </p>

        <ul className="family-observed-grid" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1px', background: 'var(--surface-border)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
          <li style={{ background: 'var(--surface-card)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>{lang === 'pt' ? 'Arquivos cifrados' : 'Encrypted files'}</div>
            <div style={{ fontSize: '13.5px' }}>{lang === 'pt' ? 'Documentos e imagens do perfil do usuário' : 'Documents and images in user profile'}</div>
          </li>
          <li style={{ background: 'var(--surface-card)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>{lang === 'pt' ? 'Extensão applied' : 'Applied extension'}</div>
            <div style={{ fontSize: '13.5px' }}>{isAkira ? '.akira' : '.encrypted'}</div>
          </li>
          <li style={{ background: 'var(--surface-card)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>{lang === 'pt' ? 'Nota de resgate' : 'Ransom note'}</div>
            <div style={{ fontSize: '13.5px' }}>{isAkira ? 'akira_readme.txt' : 'readme.txt'}</div>
          </li>
          <li style={{ background: 'var(--surface-card)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>{lang === 'pt' ? 'Processos afetados' : 'Affected processes'}</div>
            <div style={{ fontSize: '13.5px' }}>{lang === 'pt' ? 'Serviços de cópia de sombra interrompidos (VSS)' : 'Volume Shadow Copy services stopped (VSS)'}</div>
          </li>
        </ul>
      </div>
    </div>
  );
};
