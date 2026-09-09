import React from 'react';
import { FileEdit } from 'lucide-react';
import { FAMILIES, Lang, MalwareFamily } from '../../data/families';
import { ParsedFamilyData, ParsedReportDocument } from '../../data/markdownLoader';
import { TRANSLATIONS } from '../../data/i18n';

interface FamilySidebarProps {
  fam: MalwareFamily;
  parsedData: ParsedFamilyData | undefined;
  familyReports: ParsedReportDocument[];
  lang: Lang;
  onOpenReport: (reportId: string, familyKey: string) => void;
  onSelectFamily: (key: string) => void;
}

export const FamilySidebar: React.FC<FamilySidebarProps> = ({ fam, parsedData, familyReports, lang, onOpenReport, onSelectFamily }) => {
  const t = TRANSLATIONS[lang];
  const otherFams = FAMILIES.filter((family) => family.key !== fam.key);
  const signatures = parsedData ? (parsedData.signatures[lang] || parsedData.signatures.pt) : [];

  return (
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
                style={{ width: '100%', background: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none', borderRadius: '4px', padding: '9px 12px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FileEdit size={15} />
                {t.readReport}
              </button>
            </div>
          ))}
        </div>
      </div>

      {signatures.length > 0 && (
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
            {lang === 'pt' ? 'Autoria e revisão' : 'Authorship & review'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {signatures.map((signature, index) => (
              <div key={signature.role + '-' + index}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '2px' }}>
                  {signature.role}
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 500 }}>
                  {signature.name || (lang === 'pt' ? 'Pendente' : 'Pending')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
          {t.otherFams}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {otherFams.map((other) => (
            <button
              key={other.key}
              onClick={() => onSelectFamily(other.key)}
              style={{ background: 'none', border: 'none', padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--text-color)', cursor: 'pointer', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}
            >
              <span>{other.disp}</span>
              <span style={{ color: 'var(--text-color-secondary)', fontSize: '11px' }}>{other.ed}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
