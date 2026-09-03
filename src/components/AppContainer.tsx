import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { HomeView } from './HomeView';
import { CatalogView } from './CatalogView';
import { FamilyDetailView } from './FamilyDetailView';
import { ReportView } from './ReportView';
import { GuidesView } from './GuidesView';
import { TemplatesView } from './TemplatesView';
import { SecurityView } from './SecurityView';
import { ContributeView } from './ContributeView';
import { InventoryView } from './InventoryView';
import { Lang } from '../data/families';

export const AppContainer: React.FC = () => {
  const [screen, setScreen] = useState<string>('home');
  const [lang, setLang] = useState<Lang>('pt');
  const [selectedFamily, setSelectedFamily] = useState<string>('akira');
  const [selectedReport, setSelectedReport] = useState<string>('CMDB-TR-006');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigate = (targetScreen: string) => {
    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFamily = (familyKey: string) => {
    setSelectedFamily(familyKey);
    setScreen('family');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReport = (reportId: string, familyKey: string) => {
    setSelectedReport(reportId);
    setSelectedFamily(familyKey);
    setScreen('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-ground)', fontFamily: 'var(--font-sans)', color: 'var(--text-color)', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentScreen={screen}
        lang={lang}
        onNavigate={handleNavigate}
        onSetLang={setLang}
      />

      <main style={{ flex: 1 }}>
        {screen === 'home' && (
          <HomeView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenFamily={handleOpenFamily}
            onSearch={handleSearch}
          />
        )}

        {screen === 'catalog' && (
          <CatalogView
            lang={lang}
            initialQuery={searchQuery}
            onOpenFamily={handleOpenFamily}
          />
        )}

        {screen === 'inventory' && (
          <InventoryView lang={lang} onOpenFamily={handleOpenFamily} />
        )}

        {screen === 'family' && (
          <FamilyDetailView
            familyKey={selectedFamily}
            lang={lang}
            onNavigate={handleNavigate}
            onOpenReport={handleOpenReport}
            onSelectFamily={handleOpenFamily}
          />
        )}

        {screen === 'report' && (
          <ReportView
            reportId={selectedReport}
            familyKey={selectedFamily}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'guides' && (
          <GuidesView lang={lang} />
        )}

        {screen === 'templates' && (
          <TemplatesView lang={lang} />
        )}

        {screen === 'security' && (
          <SecurityView lang={lang} />
        )}

        {screen === 'contribute' && (
          <ContributeView lang={lang} />
        )}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
};
