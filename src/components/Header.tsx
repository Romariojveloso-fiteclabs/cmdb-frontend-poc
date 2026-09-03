import React from 'react';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface HeaderProps {
  currentScreen: string;
  lang: Lang;
  onNavigate: (screen: string) => void;
  onSetLang: (lang: Lang) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, lang, onNavigate, onSetLang }) => {
  const t = TRANSLATIONS[lang];

  const navItems = [
    { key: 'home', label: lang === 'pt' ? 'Início' : 'Home' },
    { key: 'catalog', label: lang === 'pt' ? 'Explorar' : 'Explore' },
    { key: 'templates', label: lang === 'pt' ? 'Modelos' : 'Templates' },
    { key: 'guides', label: lang === 'pt' ? 'Guias' : 'Guides' },
    { key: 'security', label: lang === 'pt' ? 'Segurança' : 'Safety' },
    { key: 'contribute', label: lang === 'pt' ? 'Contribuir' : 'Contribute' }
  ];

  const activeKey = currentScreen === 'family' ? 'catalog' : currentScreen;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: '#243A2E', color: '#F3EBDD', borderBottom: '3px solid #B85C2E' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => onNavigate('home')}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: '#F3EBDD', borderRadius: '5px', flex: 'none' }}>
            <img src="/assets/cmdb-logo.png" alt="Caatinga Malware DB" style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }} />
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, letterSpacing: '.14em' }}>
              {t.brandName}
            </span>
            <span style={{ fontSize: '11px', color: '#B4C8B9', letterSpacing: '.04em' }}>
              {t.brandSub}
            </span>
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2px', flex: 1, flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
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
        </div>
      </div>
    </header>
  );
};
