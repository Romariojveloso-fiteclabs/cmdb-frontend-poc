import React, { useMemo, useState } from 'react';
import { FAMILIES, Lang } from '../data/families';
import { parseAllFamiliesFromMarkdown, parseAllReportsFromMarkdown } from '../data/markdownLoader';
import { FamilyHeader } from './family/FamilyHeader';
import { FamilyOverviewTab } from './family/FamilyOverviewTab';
import { FamilySamplesTab } from './family/FamilySamplesTab';
import { FamilyEvidenceTab } from './family/FamilyEvidenceTab';
import { FamilyReferencesTab } from './family/FamilyReferencesTab';
import { FamilySidebar } from './family/FamilySidebar';

interface FamilyDetailViewProps {
  familyKey: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
  onOpenReport: (reportId: string, familyKey: string) => void;
  onSelectFamily: (key: string) => void;
}

export const FamilyDetailView: React.FC<FamilyDetailViewProps> = ({ familyKey, lang, onNavigate, onOpenReport, onSelectFamily }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const parsedFamilies = useMemo(() => parseAllFamiliesFromMarkdown(), []);
  const allReports = useMemo(() => parseAllReportsFromMarkdown(), []);

  const parsedData = parsedFamilies.find((family) => family.key === familyKey) || parsedFamilies[0];
  const fam = FAMILIES.find((family) => family.key === familyKey) || FAMILIES[0];
  const familyReports = allReports.filter((report) => report.familyKey === fam.key);

  const tabs = lang === 'pt'
    ? ['Visão geral', 'Amostras', 'Evidências', 'Referências']
    : ['Overview', 'Samples', 'Evidence', 'References'];

  return (
    <div>
      <FamilyHeader
        fam={fam}
        lang={lang}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => onNavigate('catalog')}
      />

      <section className="family-content-layout" style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 28px 72px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {activeTab === 0 && <FamilyOverviewTab fam={fam} parsedData={parsedData} lang={lang} />}
          {activeTab === 1 && <FamilySamplesTab parsedData={parsedData} lang={lang} />}
          {activeTab === 2 && <FamilyEvidenceTab parsedData={parsedData} lang={lang} />}
          {activeTab === 3 && <FamilyReferencesTab lang={lang} />}
        </div>

        <FamilySidebar
          fam={fam}
          parsedData={parsedData}
          familyReports={familyReports}
          lang={lang}
          onOpenReport={onOpenReport}
          onSelectFamily={onSelectFamily}
        />
      </section>
    </div>
  );
};
