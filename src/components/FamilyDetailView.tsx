import React, { useState } from 'react';
import { FileEdit, AlertOctagon } from 'lucide-react';
import { FAMILIES, DIMENSIONS, Lang } from '../data/families';
import { parseAllFamiliesFromMarkdown, parseAllReportsFromMarkdown, ParsedFamilyData } from '../data/markdownLoader';
import { TRANSLATIONS } from '../data/i18n';

interface FamilyDetailViewProps {
  familyKey: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
  onOpenReport: (reportId: string, familyKey: string) => void;
  onSelectFamily: (key: string) => void;
}

export const FamilyDetailView: React.FC<FamilyDetailViewProps> = ({
  familyKey,
  lang,
  onNavigate,
  onOpenReport,
  onSelectFamily
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<number>(0);

  const parsedFamilies = parseAllFamiliesFromMarkdown();
  const parsedData: ParsedFamilyData | undefined = parsedFamilies.find(f => f.key === familyKey) || parsedFamilies[0];
  const fam = FAMILIES.find((f) => f.key === familyKey) || FAMILIES[0];
  const familyReports = parseAllReportsFromMarkdown().filter((report) => report.familyKey === fam.key);

  const isAkira = fam.key === 'akira';
  const otherFams = FAMILIES.filter((f) => f.key !== fam.key);

  const tabs = lang === 'pt'
    ? ['Visão geral', 'Amostras', 'Evidências', 'Referências']
    : ['Overview', 'Samples', 'Evidence', 'References'];

  const renderBadge = (dimKey: string, valKey: string) => {
    const meta = DIMENSIONS[dimKey]?.[valKey];
    if (!meta) return null;
    const label = lang === 'pt' ? meta.pt : meta.en;

    let bg = 'var(--surface-100)';
    let color = 'var(--text-color-secondary)';
    if (meta.sev === 'success') { bg = 'var(--success-soft)'; color = 'var(--success-600)'; }
    if (meta.sev === 'info') { bg = 'var(--info-soft)'; color = 'var(--info-600)'; }
    if (meta.sev === 'warning') { bg = 'var(--warning-soft)'; color = 'var(--warning-600)'; }
    if (meta.sev === 'danger') { bg = 'var(--danger-soft)'; color = 'var(--danger-600)'; }

    return (
      <span style={{ background: bg, color: color, fontSize: '11px', fontFamily: 'var(--font-sans)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
        {label}
      </span>
    );
  };

  const sampleList = parsedData ? (parsedData.samples[lang] || parsedData.samples.pt) : [];
  const evidenceList = parsedData ? (parsedData.evidences[lang] || parsedData.evidences.pt) : [];

  return (
    <div>
      <section className="family-header" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--surface-border)', padding: '28px 28px 0' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <button
            onClick={() => onNavigate('catalog')}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--info-600)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', cursor: 'pointer', marginBottom: '16px' }}
          >
            {t.backCatalog}
          </button>

          <div className="family-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '38px', fontWeight: 600, letterSpacing: '.08em', margin: '0 0 8px' }}>
                {fam.name}
              </h1>
              <div style={{ fontSize: '15px', color: 'var(--text-color-secondary)', maxWidth: '60ch' }}>
                {lang === 'pt' ? fam.headline.pt : fam.headline.en}
              </div>
              <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', margin: '18px 0 0' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                    Aliases
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.aliases}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                    {lang === 'pt' ? 'Categoria' : 'Category'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.cat}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                    {lang === 'pt' ? 'Plataformas' : 'Platforms'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.plats.join(' · ')}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                    {lang === 'pt' ? 'Amostras' : 'Samples'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.samples}</div>
                </div>
              </div>
            </div>

            <div className="family-status-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '280px', background: 'var(--surface-ground)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '2px' }}>
                {t.statusSystem}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Status Editorial</span>
                {renderBadge('ed', fam.ed)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Identificação</span>
                {renderBadge('id', fam.id)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Evidência</span>
                {renderBadge('ev', fam.ev)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Disponibilidade</span>
                {renderBadge('av', fam.av)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '26px', display: 'flex', borderBottom: '1px solid var(--surface-border)', gap: '4px', overflowX: 'auto' }}>
            {tabs.map((tabLabel, idx) => {
              const active = idx === activeTab;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? '3px solid var(--primary-color)' : '3px solid transparent',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--primary-color)' : 'var(--text-color-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="family-content-layout" style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 28px 72px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {activeTab === 0 && (
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
          )}

          {activeTab === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
                {t.samplesTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-color-secondary)', margin: '0 0 16px' }}>
                {t.samplesSub}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sampleList.map((s) => (
                  <div key={s.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--info-color)' }}>
                        {s.id}
                      </span>
                      <span style={{ background: s.verifySeverity === 'success' ? 'var(--success-soft)' : 'var(--warning-soft)', color: s.verifySeverity === 'success' ? 'var(--success-600)' : 'var(--warning-600)', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                        {s.verifyLabel}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '5px' }}>SHA-256</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', wordBreak: 'break-all', background: 'var(--surface-ground)', border: '1px solid var(--surface-border)', borderRadius: '4px', padding: '9px 11px' }}>
                      {s.sha}
                    </div>
                    <div className="family-sample-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginTop: '14px' }}>
                      {s.fields.map((fd, i) => (
                        <div key={i}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>{fd.label}</div>
                          <div style={{ fontSize: '12.5px' }}>{fd.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--surface-border)' }}>
                      {s.provenance}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', background: 'var(--danger-soft)', border: '1px solid var(--danger-color)', color: 'var(--danger-600)', padding: '14px 18px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertOctagon size={18} style={{ flexShrink: 0 }} />
                <span>{t.noDownload}</span>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 4px' }}>
                {t.evTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-color-secondary)', margin: '0 0 18px' }}>
                {t.evSub}
              </p>

              {evidenceList.length > 0 ? (
                <div className="family-evidence-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                  {evidenceList.map((ev, idx) => (
                    <figure key={idx} style={{ margin: 0, background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '220px', background: 'var(--surface-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={ev.imgUrl} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <figcaption style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--info-color)', marginBottom: '6px' }}>{ev.figNum}</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '5px' }}>{ev.title}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', lineHeight: 1.55 }}>{ev.desc}</div>
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
          )}

          {activeTab === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '22px', fontWeight: 600, margin: '0 0 18px' }}>
                {t.refTitle}
              </h2>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--surface-border)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
                <li style={{ background: 'var(--surface-card)', padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--info-color)', whiteSpace: 'nowrap' }}>DEFENSIVA</span>
                  <span style={{ fontSize: '13.5px', lineHeight: 1.55 }}>CISA Alert & Advisory — Indicadores e mitigações oficiais.</span>
                </li>
                <li style={{ background: 'var(--surface-card)', padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--info-color)', whiteSpace: 'nowrap' }}>MITRE ATT&CK</span>
                  <span style={{ fontSize: '13.5px', lineHeight: 1.55 }}>T1486 (Data Encrypted for Impact) e T1490 (Inhibit System Recovery).</span>
                </li>
                <li style={{ background: 'var(--surface-card)', padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--info-color)', whiteSpace: 'nowrap' }}>INTERNA</span>
                  <span style={{ fontSize: '13.5px', lineHeight: 1.55 }}>CMDB-LG-002 — Guia de preparação de laboratório isolado UFPE.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <aside className="family-sidebar" style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
              {t.reportCard}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {familyReports.map((report) => (
                <div key={report.id} style={{ paddingTop: '12px', borderTop: '1px solid var(--surface-border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>
                    {report.id}
                  </div>
                  <div style={{ fontSize: '11.5px', lineHeight: 1.4, color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
                    {report.title[lang]}
                  </div>
                  <button
                    onClick={() => onOpenReport(report.id, fam.key)}
                    style={{
                      width: '100%',
                      background: 'var(--primary-color)',
                      color: 'var(--primary-color-text)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '9px 12px',
                      fontSize: '12.5px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <FileEdit size={15} />
                    {t.readReport}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
              {t.otherFams}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {otherFams.map((o) => (
                <button
                  key={o.key}
                  onClick={() => onSelectFamily(o.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '7px 8px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    color: 'var(--text-color)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <span>{o.disp}</span>
                  <span style={{ color: 'var(--text-color-secondary)', fontSize: '11px' }}>{o.ed}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
