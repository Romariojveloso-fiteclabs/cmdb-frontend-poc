import React from 'react';
import { Globe, Github, Linkedin, Mail } from 'lucide-react';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { withBase } from '../utils/paths';

interface FooterProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  const footerNav = [
    { label: lang === 'pt' ? 'Explorar famílias' : 'Explore families', screen: 'catalog' },
    { label: lang === 'pt' ? 'Inventário comparativo' : 'Comparative inventory', screen: 'inventory' },
    { label: lang === 'pt' ? 'Modelos de documentação' : 'Documentation templates', screen: 'templates' },
    { label: lang === 'pt' ? 'Guias de laboratório' : 'Lab guides', screen: 'guides' },
    { label: lang === 'pt' ? 'Segurança e uso responsável' : 'Safety and responsible use', screen: 'security' }
  ];

  return (
    <footer style={{ background: '#202522', color: '#A89A82', padding: '44px 28px 28px', borderTop: '3px solid var(--ufpe-crimson)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.1fr)', gap: '44px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#F3EBDD', borderRadius: '5px', flex: 'none' }}>
                <img src={withBase('/assets/cmdb-logo.png')} alt="Caatinga Malware DB" style={{ width: '34px', height: '34px', objectFit: 'contain', display: 'block' }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.14em', color: '#F3EBDD' }}>
                CAATINGA MALWARE DB
              </span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#F3EBDD', borderRadius: '5px', flex: 'none' }}>
                <img src={withBase('/assets/ufpe-brasao.png')} alt="Brasão da UFPE" style={{ width: '30px', height: '30px', objectFit: 'contain', display: 'block' }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.1em', color: '#D39A32', border: '1px solid #5C564A', borderRadius: '3px', padding: '3px 7px' }}>
                UFPE · CIn
              </span>
            </div>
            <div style={{ fontSize: '12.5px', lineHeight: 1.65, maxWidth: '52ch' }}>
              {t.footerNote}
            </div>
            <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.7, color: '#A89A82' }}>
              {t.footerInstitution}
              <br />
              Recife, PE · Brasil
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#D39A32', marginBottom: '14px' }}>
              {t.footerNavTitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {footerNav.map((n, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(n.screen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: '#A89A82',
                    cursor: 'pointer'
                  }}
                >
                  → {n.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#D39A32', marginBottom: '14px' }}>
              {t.footerContactTitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <a href="https://sites.ufpe.br/seguranca-ofensiva/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#A89A82', textDecoration: 'none' }}>
                <span style={{ display: 'flex', color: '#D39A32' }}><Globe size={15} /></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>sites.ufpe.br/seguranca-ofensiva</span>
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#A89A82', textDecoration: 'none' }}>
                <span style={{ display: 'flex', color: '#D39A32' }}><Github size={15} /></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{lang === 'pt' ? 'GitHub — repositório do acervo' : 'GitHub — archive repository'}</span>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#A89A82', textDecoration: 'none' }}>
                <span style={{ display: 'flex', color: '#D39A32' }}><Linkedin size={15} /></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>LinkedIn</span>
              </a>
              <a href="mailto:contato@cin.ufpe.br" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#A89A82', textDecoration: 'none' }}>
                <span style={{ display: 'flex', color: '#D39A32' }}><Mail size={15} /></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>contato@cin.ufpe.br</span>
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #403C34', marginTop: '32px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
          <span>{t.footerRights}</span>
          <span>{t.footerLicense} · {t.footerContact}</span>
        </div>
      </div>
    </footer>
  );
};
