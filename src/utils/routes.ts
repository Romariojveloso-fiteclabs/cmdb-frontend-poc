import { withBase } from './paths';

export type AppScreen =
  | 'home'
  | 'catalog'
  | 'inventory'
  | 'family'
  | 'report'
  | 'guides'
  | 'templates'
  | 'security'
  | 'contribute';

export interface AppRoute {
  screen: AppScreen;
  familyKey?: string;
  reportId?: string;
  guideId?: string;
}

export const STATIC_ROUTES = [
  { screen: 'catalog', slug: 'explorar', title: 'Explorar malwares' },
  { screen: 'inventory', slug: 'inventario', title: 'Inventário de malwares' },
  { screen: 'guides', slug: 'guias', title: 'Guias de laboratório' },
  { screen: 'templates', slug: 'modelos', title: 'Modelos de documentação' },
  { screen: 'security', slug: 'seguranca', title: 'Segurança' },
  { screen: 'contribute', slug: 'contribuir', title: 'Contribuir' },
] as const;

const screenToSlug = new Map<AppScreen, string>(
  STATIC_ROUTES.map(({ screen, slug }) => [screen, slug]),
);

export function routeHref(route: AppRoute): string {
  if (route.screen === 'home') return withBase('/');
  if (route.screen === 'family' && route.familyKey) {
    return withBase(`/familias/${encodeURIComponent(route.familyKey.toLowerCase())}/`);
  }
  if (route.screen === 'report' && route.familyKey && route.reportId) {
    return withBase(
      `/familias/${encodeURIComponent(route.familyKey.toLowerCase())}/relatorios/${encodeURIComponent(route.reportId.toLowerCase())}/`,
    );
  }
  if (route.screen === 'guides' && route.guideId) {
    return withBase(`/guias/${encodeURIComponent(route.guideId.toLowerCase())}/`);
  }

  const slug = screenToSlug.get(route.screen);
  return withBase(slug ? `/${slug}/` : '/');
}

export function screenRoute(screen: string): AppRoute {
  const knownScreen = STATIC_ROUTES.find((item) => item.screen === screen)?.screen;
  return { screen: knownScreen || 'home' };
}

export function parseAppRoute(pathname: string): AppRoute | null {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  let relativePath = pathname;

  if (basePath && basePath !== '/' && relativePath.startsWith(basePath)) {
    relativePath = relativePath.slice(basePath.length);
  }

  const segments = relativePath
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (segments.length === 0) return { screen: 'home' };

  const staticRoute = STATIC_ROUTES.find((item) => item.slug === segments[0]);
  if (staticRoute && segments.length === 1) return { screen: staticRoute.screen };

  if (segments[0] === 'guias' && segments[1] && segments.length === 2) {
    return { screen: 'guides', guideId: segments[1].toUpperCase() };
  }

  if (segments[0] === 'familias' && segments[1]) {
    const familyKey = segments[1].toLowerCase();
    if (segments.length === 2) return { screen: 'family', familyKey };
    if (segments[2] === 'relatorios' && segments[3] && segments.length === 4) {
      return {
        screen: 'report',
        familyKey,
        reportId: segments[3].toUpperCase(),
      };
    }
  }

  return null;
}
