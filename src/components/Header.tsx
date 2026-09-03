import React, { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { withBase } from '../utils/paths';
import { usePwaInstall } from '../hooks/usePwaInstall';

interface HeaderProps {
  currentScreen: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
  onSetLang: (lang: Lang) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, lang, onNavigate, onSetLang }) => {
  const t = TRANSLATIONS[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const { canInstall, install } = usePwaInstall();

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

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 30, background: '#243A2E', color: '#F3EBDD', borderBottom: '3px solid #B85C2E' }}>
      <div className="site-header__inner" style={{ maxWidth: '1180px', margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '28px' }}>
        <button
          type="button"
          className="site-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: 0, border: 0, background: 'transparent', color: 'inherit', textAlign: 'left' }}
          onClick={() => navigate('home')}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: '#F3EBDD', borderRadius: '5px', flex: 'none' }}>
            <img src={withBase('/assets/cmdb-logo.png')} alt="Caatinga Malware DB" style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }} />
          </span>
          <span className="site-brand__text" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '.14em' }}>
              {t.brandName}
            </span>
            <span style={{ fontSize: '11px', color: '#B4C8B9', letterSpacing: '.04em' }}>
              {t.brandSub}
            </span>
          </span>
        </button>

        <nav id="main-navigation" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} style={{ display: 'flex', gap: '2px', flex: 1, flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  background: isActive ? 'rgba(243,235,221,.14)' : 'transparent',
                  color: isActive ? '#F3EBDD' : '#B4C8B9',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 11px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background .15s'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="site-header__actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          {canInstall && (
            <button
              type="button"
              className="pwa-install-button"
              onClick={install}
              aria-label={lang === 'pt' ? 'Instalar aplicativo CMDB' : 'Install CMDB application'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#B85C2E', color: '#FDFAF4', border: 0, borderRadius: '4px', padding: '7px 9px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              <Download size={14} />
              <span>{lang === 'pt' ? 'Instalar' : 'Install'}</span>
            </button>
          )}
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
              color: lang === 'pt' ? '#D39A32' : '#537760'
            }}
          >
            PT
          </button>
          <span style={{ color: '#537760' }}>/</span>
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
              color: lang === 'en' ? '#D39A32' : '#537760'
            }}
          >
            EN
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
            style={{ background: 'rgba(243,235,221,.1)', color: '#F3EBDD', border: '1px solid #537760', borderRadius: '4px', width: '38px', height: '38px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
