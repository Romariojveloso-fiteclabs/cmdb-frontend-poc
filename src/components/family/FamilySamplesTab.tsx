import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Lang } from '../../data/families';
import { ParsedFamilyData } from '../../data/markdownLoader';
import { TRANSLATIONS } from '../../data/i18n';

interface FamilySamplesTabProps {
  parsedData: ParsedFamilyData | undefined;
  lang: Lang;
}

export const FamilySamplesTab: React.FC<FamilySamplesTabProps> = ({ parsedData, lang }) => {
  const t = TRANSLATIONS[lang];
  const sampleList = parsedData ? (parsedData.samples[lang] || parsedData.samples.pt) : [];

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
        {t.samplesTitle}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-color-secondary)', margin: '0 0 16px' }}>
        {t.samplesSub}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sampleList.map((sample) => (
          <div key={sample.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--info-color)' }}>
                {sample.id}
              </span>
              <span style={{ background: sample.verifySeverity === 'success' ? 'var(--success-soft)' : 'var(--warning-soft)', color: sample.verifySeverity === 'success' ? 'var(--success-600)' : 'var(--warning-600)', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                {sample.verifyLabel}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>SHA-256</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', wordBreak: 'break-all', background: 'var(--surface-ground)', border: '1px solid var(--surface-border)', borderRadius: '4px', padding: '9px 11px' }}>
              {sample.sha}
            </div>
            <div className="family-sample-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginTop: '14px' }}>
              {sample.fields.map((field, index) => (
                <div key={index}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>{field.label}</div>
                  <div style={{ fontSize: '12.5px' }}>{field.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--surface-border)' }}>
              {sample.provenance}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', background: 'var(--danger-soft)', border: '1px solid var(--danger-color)', color: 'var(--danger-600)', padding: '14px 18px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertOctagon size={18} style={{ flexShrink: 0 }} />
        <span>{t.noDownload}</span>
      </div>
    </div>
  );
};
