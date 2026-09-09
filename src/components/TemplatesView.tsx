import React, { useState } from 'react';
import { Download, Info, Check } from 'lucide-react';
import { DOC_TEMPLATES, DocTemplate } from '../data/templates';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface TemplatesViewProps {
  lang: Lang;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const templates = DOC_TEMPLATES[lang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const downloadTemplate = (tpl: DocTemplate) => {
    const element = document.createElement('a');
    const file = new Blob([tpl.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${tpl.id}-${tpl.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="page-shell" style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
        {t.tplTitle}
      </h1>
      <p className="page-intro">
        {t.tplSub}
      </p>

      <div style={{ background: 'var(--info-soft)', border: '1px solid var(--info-color)', color: 'var(--info-600)', borderRadius: '6px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
          {t.tplNote}
        </span>
      </div>

      <div className="templates-grid card-grid card-grid--2">
        {templates.map((tp) => (
          <article key={tp.id} className="content-card" style={{ gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '.12em', color: 'var(--info-color)' }}>
                {tp.id}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-color-secondary)' }}>
                {tp.format}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '20px', fontWeight: 600, margin: 0 }}>
              {tp.title}
            </h2>

            <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: 0 }}>
              {tp.desc}
            </p>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {tp.fields.map((fd, i) => (
                <li key={i} style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--success-color)' }}>·</span>
                  <span>{fd}</span>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '14px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-color-secondary)' }}>
                {tp.required}
              </span>
              <button
                onClick={() => downloadTemplate(tp)}
                style={{
                  background: 'var(--primary-color)',
                  color: 'var(--primary-color-text)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '9px 14px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                {t.tplDownload}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
