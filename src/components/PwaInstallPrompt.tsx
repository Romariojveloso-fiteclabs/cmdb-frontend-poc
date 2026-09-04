import React, { useState } from 'react';
import { Download, Share2, Smartphone } from 'lucide-react';
import { Lang } from '../data/families';
import { usePwaInstall } from '../hooks/usePwaInstall';

interface PwaInstallPromptProps {
  lang: Lang;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ lang }) => {
  const { canInstall, isManualInstall, manualInstallKind, install, dismiss } = usePwaInstall();
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  if (!canInstall) return null;

  const isPt = lang === 'pt';

  return (
    <aside className="pwa-install-prompt" aria-labelledby="pwa-install-title">
      <div className="pwa-install-prompt__icon" aria-hidden="true">
        <Smartphone size={22} />
      </div>

      <div className="pwa-install-prompt__content">
        <strong id="pwa-install-title">
          {showManualInstructions
            ? (isPt ? 'Instale pela tela inicial' : 'Install from the Home Screen')
            : (isPt ? 'Instale o CMDB no seu dispositivo' : 'Install CMDB on your device')}
        </strong>
        <span>
          {showManualInstructions
            ? (manualInstallKind === 'ios'
              ? (isPt
                ? 'No navegador, toque em Compartilhar e depois em “Adicionar à Tela de Início”.'
                : 'In your browser, tap Share and then “Add to Home Screen”.')
              : (isPt
                ? 'Abra o menu do navegador e procure por “Instalar aplicativo” ou “Adicionar à tela inicial”.'
                : 'Open the browser menu and choose “Install app” or “Add to Home Screen”.'))
            : (isPt
              ? 'Acesse o inventário com uma experiência mais rápida e adequada ao mobile.'
              : 'Access the inventory with a faster, mobile-friendly experience.')}
        </span>
      </div>

      <div className="pwa-install-prompt__actions">
        {!showManualInstructions && (
          <button
            type="button"
            className="pwa-install-prompt__primary"
            onClick={() => {
              if (isManualInstall) {
                setShowManualInstructions(true);
                return;
              }
              void install();
            }}
          >
            {isManualInstall ? <Share2 size={15} /> : <Download size={15} />}
            {isManualInstall
              ? (isPt ? 'Como instalar' : 'How to install')
              : (isPt ? 'Instalar' : 'Install')}
          </button>
        )}
        <button type="button" className="pwa-install-prompt__secondary" onClick={dismiss}>
          {showManualInstructions
            ? (isPt ? 'Entendi' : 'Got it')
            : (isPt ? 'Não agora' : 'Not now')}
        </button>
      </div>
    </aside>
  );
};
