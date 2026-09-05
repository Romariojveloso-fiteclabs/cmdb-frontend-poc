import React from 'react';
import { Github, Globe2, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { withBase } from '../utils/paths';
import { routeHref, screenRoute } from '../utils/routes';

interface FooterProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];
  const isPt = lang === 'pt';

  const routeLink = (screen: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(screen);
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <a
              className="site-footer__home"
              href={routeHref(screenRoute('home'))}
              onClick={routeLink('home')}
              aria-label={isPt ? 'Ir para o início' : 'Go to home'}
            >
              <img src={withBase('/assets/cmdb-logo.png')} alt="" />
              <span>
                <strong>Caatinga Malware DB</strong>
                <small>UFPE - CTG</small>
              </span>
            </a>
            <p>{t.footerNote}</p>
          </div>

          <div className="site-footer__contacts">
            <span className="site-footer__label">{isPt ? 'Canais e contato' : 'Channels and contact'}</span>
            <div className="site-footer__contact-links">
              <a href="https://sites.ufpe.br/seguranca-ofensiva/" target="_blank" rel="noopener noreferrer">
                <Globe2 size={15} aria-hidden="true" />
                <span>{isPt ? 'Site do grupo' : 'Group website'}</span>
              </a>
              <a href="https://sites.ufpe.br/seguranca-extensao/" target="_blank" rel="noopener noreferrer">
                <Globe2 size={15} aria-hidden="true" />
                <span>{isPt ? 'Projeto de extensão' : 'Extension project'}</span>
              </a>
              <a href="https://github.com/Romariojveloso-fiteclabs/cmdb-frontend-poc" target="_blank" rel="noopener noreferrer">
                <Github size={15} aria-hidden="true" />
                <span>{isPt ? 'Repositório' : 'Repository'}</span>
              </a>
              <a href="https://github.com/Romariojveloso-fiteclabs/cmdb-frontend-poc/issues" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} aria-hidden="true" />
                <span>{isPt ? 'Reportar problema' : 'Report an issue'}</span>
              </a>
              <a href="https://www.linkedin.com/in/romario-jonas-veloso-427373175" target="_blank" rel="noopener noreferrer">
                <Linkedin size={15} aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:romariojonas@outlook.com.br">
                <Mail size={15} aria-hidden="true" />
                <span>{isPt ? 'E-mail' : 'Email'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__utility">
          <nav className="site-footer__nav" aria-label={isPt ? 'Navegação do projeto' : 'Project navigation'}>
            <a href={routeHref(screenRoute('catalog'))} onClick={routeLink('catalog')}>
              {isPt ? 'Acervo' : 'Archive'}
            </a>
            <a href={routeHref(screenRoute('inventory'))} onClick={routeLink('inventory')}>
              {isPt ? 'Inventário' : 'Inventory'}
            </a>
            <a href={routeHref(screenRoute('guides'))} onClick={routeLink('guides')}>
              {isPt ? 'Guias' : 'Guides'}
            </a>
            <a href={routeHref(screenRoute('contribute'))} onClick={routeLink('contribute')}>
              {isPt ? 'Contribuir' : 'Contribute'}
            </a>
          </nav>

          <div className="site-footer__meta">
            <span>{t.footerRights}</span>
            <span>{t.footerInstitution}</span>
            <span>
              {t.footerDevelopedBy}:{' '}
              <a href="https://romariojonas.com" target="_blank" rel="noopener noreferrer">
                Romário Jonas
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
