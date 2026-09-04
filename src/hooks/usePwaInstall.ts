import { useEffect, useState } from 'react';

const INSTALL_OFFER_DISMISSED_KEY = 'cmdb:pwa-install-offer-dismissed';
const LEGACY_INSTALL_OFFER_SEEN_KEY = 'cmdb:pwa-install-offer-seen';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installType, setInstallType] = useState<'native' | 'ios' | 'manual' | null>(null);

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || navigatorWithStandalone.standalone === true;
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
      || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    let offerWasDismissed = false;

    try {
      window.sessionStorage.removeItem(LEGACY_INSTALL_OFFER_SEEN_KEY);
      offerWasDismissed = window.sessionStorage.getItem(INSTALL_OFFER_DISMISSED_KEY) === 'true';
    } catch {
      // The prompt can still work when storage is unavailable.
    }

    setIsInstalled(standalone);

    if (!standalone && !offerWasDismissed) {
      setInstallType(isIos ? 'ios' : 'manual');
    }

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      if (standalone || offerWasDismissed) return;
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallType('native');
    };

    const markInstalled = () => {
      setInstallPrompt(null);
      setInstallType(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', markInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'dismissed') {
      try {
        window.sessionStorage.setItem(INSTALL_OFFER_DISMISSED_KEY, 'true');
      } catch {
        // Ignore storage restrictions and hide the prompt in memory.
      }
    }

    setInstallPrompt(null);
    setInstallType(null);
  };

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(INSTALL_OFFER_DISMISSED_KEY, 'true');
    } catch {
      // Ignore storage restrictions and hide the prompt in memory.
    }

    setInstallPrompt(null);
    setInstallType(null);
  };

  return {
    canInstall: Boolean(installType) && !isInstalled,
    isManualInstall: installType !== 'native',
    manualInstallKind: installType === 'ios' ? 'ios' : 'browser',
    install,
    dismiss
  };
}
