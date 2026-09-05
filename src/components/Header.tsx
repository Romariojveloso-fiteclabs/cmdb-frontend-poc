import React, { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { withBase } from '../utils/paths';
import { routeHref, screenRoute } from '../utils/routes';

interface HeaderProps {
  currentScreen: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
  onSetLang: (lang: Lang) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, lang, onNavigate, onSetLang, theme, onToggleTheme }) => {
  const t = TRANSLATIONS[lang];
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: lang === 'pt' ? 'Início' : 'Home' },
    { key: 'catalog', label: lang === 'pt' ? 'Explorar' : 'Explore' },
    { key: 'inventory', label: lang === 'pt' ? 'Inventário' : 'Inventory' },
    { key: 'templates', label: lang === 'pt' ? 'Modelos' : 'Templates' },
    { key: 'guides', label: lang === 'pt' ? 'Guias' : 'Guides' },
    { key: 'security', label: lang === 'pt' ? 'Segurança' : 'Safety' },
    { key: 'contribute', label: lang === 'pt' ? 'Contribuir' : 'Contribute' }
  ];

  const activeKey = currentScreen === 'family' ? 'catalog' : currentScreen;

  const navigate = (screen: string) => {
    setMenuOpen(false);
    onNavigate(screen);
  };

  const handleRouteClick = (event: React.MouseEvent<HTMLAnchorElement>, screen: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(screen);
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 30, color: 'var(--header-text)' }}>
      <div className="site-header__inner" style={{ maxWidth: '1180px', margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a
          href={routeHref(screenRoute('home'))}
          className="site-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: 0, border: 0, background: 'transparent', color: 'inherit', textAlign: 'left' }}
          onClick={(event) => handleRouteClick(event, 'home')}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: 'var(--header-logo-background)', borderRadius: '5px', flex: 'none' }}>
            <img src={withBase('/assets/cmdb-logo.png')} alt="Caatinga Malware DB" style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }} />
          </span>
          <span className="site-brand__text" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '.14em' }}>
              {t.brandName}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--header-muted)', letterSpacing: '.04em' }}>
              {t.brandSub}
            </span>
          </span>
        </a>

        <nav id="main-navigation" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} style={{ display: 'flex', gap: '2px', flex: 1, flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <a
                key={item.key}
                href={routeHref(screenRoute(item.key))}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleRouteClick(event, item.key)}
                style={{
                  background: isActive ? 'var(--header-active-background)' : 'transparent',
                  color: isActive ? 'var(--header-text)' : 'var(--header-muted)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 11px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background .15s',
                  textDecoration: 'none'
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="site-header__actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <button
            onClick={() => onSetLang('pt')}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              color: lang === 'pt' ? 'var(--brand-panel-accent)' : 'var(--header-muted)'
            }}
          >
            PT
          </button>
          <span style={{ color: 'var(--header-muted)' }}>/</span>
          <button
            onClick={() => onSetLang('en')}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              color: lang === 'en' ? 'var(--brand-panel-accent)' : 'var(--header-muted)'
            }}
          >
            EN
          </button>
          <button
            type="button"
            className="site-theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark'
              ? (lang === 'pt' ? 'Ativar modo claro' : 'Switch to light mode')
              : (lang === 'pt' ? 'Ativar modo escuro' : 'Switch to dark mode')}
            title={theme === 'dark'
              ? (lang === 'pt' ? 'Modo claro' : 'Light mode')
              : (lang === 'pt' ? 'Modo escuro' : 'Dark mode')}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            className="site-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen
              ? (lang === 'pt' ? 'Fechar menu de navegação' : 'Close navigation menu')
              : (lang === 'pt' ? 'Abrir menu de navegação' : 'Open navigation menu')}
            style={{ background: 'var(--header-active-background)', color: 'var(--header-text)', border: '1px solid var(--header-border)', borderRadius: '4px', width: '38px', height: '38px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
