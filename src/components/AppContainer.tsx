import React, { useEffect, useState } from 'react';
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
import { PwaInstallPrompt } from './PwaInstallPrompt';
import { EvidenceLightbox } from './EvidenceLightbox';
import { FAMILIES, Lang } from '../data/families';
import { AppRoute, parseAppRoute, routeHref, screenRoute } from '../utils/routes';

const defaultRoute: AppRoute = { screen: 'home' };

function currentRoute(): AppRoute {
  if (typeof window === 'undefined') return defaultRoute;
  return parseAppRoute(window.location.pathname) || defaultRoute;
}

function currentSearchQuery(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('busca') || '';
}

export const AppContainer: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem('cmdb-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [route, setRoute] = useState<AppRoute>(currentRoute);
  const [lang, setLang] = useState<Lang>('pt');
  const [searchQuery, setSearchQuery] = useState<string>(currentSearchQuery);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#551B26' : '#780C18'
    );
  }, [theme]);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystemTheme = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem('cmdb-theme')) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    systemTheme.addEventListener('change', followSystemTheme);
    return () => systemTheme.removeEventListener('change', followSystemTheme);
  }, []);

  const handleToggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('cmdb-theme', nextTheme);
      return nextTheme;
    });
  };

  useEffect(() => {
    const handleHistoryNavigation = () => {
      setRoute(currentRoute());
      setSearchQuery(currentSearchQuery());
    };

    window.addEventListener('popstate', handleHistoryNavigation);
    return () => window.removeEventListener('popstate', handleHistoryNavigation);
  }, []);

  useEffect(() => {
    const family = route.familyKey
      ? FAMILIES.find((item) => item.key === route.familyKey)
      : undefined;
    const titles: Record<string, string> = {
      home: 'Caatinga Malware DB',
      catalog: lang === 'pt' ? 'Explorar malwares' : 'Explore malware',
      inventory: lang === 'pt' ? 'Inventário de malwares' : 'Malware inventory',
      guides: lang === 'pt' ? 'Guias de laboratório' : 'Laboratory guides',
      templates: lang === 'pt' ? 'Modelos de documentação' : 'Documentation templates',
      security: lang === 'pt' ? 'Segurança' : 'Safety',
      contribute: lang === 'pt' ? 'Contribuir' : 'Contribute',
      family: family?.disp || 'Caatinga Malware DB',
      report: route.reportId ? `${route.reportId} · ${family?.disp || ''}` : 'Caatinga Malware DB',
    };
    const title = titles[route.screen];
    document.title = title === 'Caatinga Malware DB' ? title : `${title} · Caatinga Malware DB`;
  }, [lang, route]);

  const navigate = (nextRoute: AppRoute, search = '') => {
    const href = `${routeHref(nextRoute)}${search}`;
    const currentHref = `${window.location.pathname}${window.location.search}`;
    if (href !== currentHref) window.history.pushState({}, '', href);
    setRoute(nextRoute);
    setSearchQuery(new URLSearchParams(search).get('busca') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (targetScreen: string) => {
    navigate(screenRoute(targetScreen));
  };

  const handleOpenFamily = (familyKey: string) => {
    navigate({ screen: 'family', familyKey });
  };

  const handleOpenReport = (reportId: string, familyKey: string) => {
    navigate({ screen: 'report', reportId, familyKey });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams({ busca: query });
    navigate({ screen: 'catalog' }, `?${params.toString()}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-ground)', fontFamily: 'var(--font-sans)', color: 'var(--text-color)', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentScreen={route.screen}
        lang={lang}
        onNavigate={handleNavigate}
        onSetLang={setLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <PwaInstallPrompt lang={lang} />
      <EvidenceLightbox lang={lang} />

      <main style={{ flex: 1 }}>
        {route.screen === 'home' && (
          <HomeView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenFamily={handleOpenFamily}
            onSearch={handleSearch}
          />
        )}

        {route.screen === 'catalog' && (
          <CatalogView
            lang={lang}
            initialQuery={searchQuery}
            onOpenFamily={handleOpenFamily}
          />
        )}

        {route.screen === 'inventory' && (
          <InventoryView lang={lang} onOpenFamily={handleOpenFamily} />
        )}

        {route.screen === 'family' && route.familyKey && (
          <FamilyDetailView
            familyKey={route.familyKey}
            lang={lang}
            onNavigate={handleNavigate}
            onOpenReport={handleOpenReport}
            onSelectFamily={handleOpenFamily}
          />
        )}

        {route.screen === 'report' && route.reportId && route.familyKey && (
          <ReportView
            reportId={route.reportId}
            familyKey={route.familyKey}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {route.screen === 'guides' && (
          <GuidesView
            lang={lang}
            selectedGuideId={route.guideId}
            onNavigate={handleNavigate}
            onOpenGuide={(guideId) => navigate({ screen: 'guides', guideId })}
          />
        )}

        {route.screen === 'templates' && (
          <TemplatesView lang={lang} />
        )}

        {route.screen === 'security' && (
          <SecurityView lang={lang} />
        )}

        {route.screen === 'contribute' && (
          <ContributeView lang={lang} />
        )}
      </main>

      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
};
